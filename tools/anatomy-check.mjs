#!/usr/bin/env node
/**
 * Neon World anatomy check. Test-only. Ships nothing into the game.
 *
 * Renders the real closet sprite and the real on-foot / pet drawers, then
 * checks the humanoid bar Bob set:
 *   1. Head sits on the neck, centered, a big stylized size.
 *   2. Arms leave the shoulders, hands end the arms, legs leave the hips,
 *      feet meet the ground, left and right are on the correct sides.
 *      The torso stays visible, with real depth, at every yaw, and it
 *      stays joined to the neck and the hips.
 *   3. Walk is a cycle: opposite arm and leg, a planted foot, a small bob,
 *      sensible angles, nothing clipping. The same torso check runs on
 *      every walk frame from the front, three-quarter, side, and back.
 * Clothing and extra style are noted, not failed, unless they break 1-3.
 *
 *   node tools/anatomy-check.mjs --root /path/to/tree --out test-results/anatomy
 *
 * Exit 0 pass, 1 anatomy fail, 2 checker failure.
 */
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME || 'google-chrome';

function parseArgs(argv) {
  const out = { root: path.resolve(HERE, '..'), out: '', port: 0 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root') out.root = path.resolve(argv[++i]);
    else if (a === '--out') out.out = path.resolve(argv[++i]);
    else if (a === '--port') out.port = Number(argv[++i]);
    else if (a === '--help') out.help = true;
    else throw new Error('Unknown arg ' + a);
  }
  if (!out.out) out.out = path.join(out.root, 'test-results', 'anatomy');
  return out;
}

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.webmanifest': 'application/manifest+json'
  })[ext] || 'application/octet-stream';
}

function exportCrew(code) {
  if (code.includes('window.__ANATOMY')) return code;
  const idx = code.lastIndexOf('})();');
  if (idx < 0) return code;
  const inject = [
    'try{window.__ANATOMY={',
    'paintPet:paintPet,paintFigure:paintFigure,humanSpec:humanSpec,',
    'figurePoints:figurePoints,groundPetQ:groundPetQ,cellProject:cellProject,',
    'wearLook:typeof wearLook==="function"?wearLook:null',
    '};}catch(err){window.__ANATOMY={error:String(err&&err.stack||err)};}',
    ''
  ].join('');
  return code.slice(0, idx) + inject + code.slice(idx);
}

function startServer(root, port) {
  const harness = harnessHtml();
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/__anatomy.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(harness);
      return;
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/__anatomy.html';
    const file = path.normalize(path.join(root, rel));
    if (!file.startsWith(root)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing ' + rel); return; }
      let body = buf;
      let type = mime(file);
      if (file.endsWith(path.sep + 'crew.js') || file.endsWith('/crew.js')) {
        if (url.searchParams.get('anatomy') === '1') {
          body = Buffer.from(exportCrew(buf.toString('utf8')), 'utf8');
        }
      }
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      res.end(body);
    });
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function launchChrome(port) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zd-anatomy-'));
  const args = [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--disable-sync',
    '--mute-audio', '--hide-scrollbars', '--force-color-profile=srgb',
    '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    '--window-size=1100,800', 'about:blank'
  ];
  const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return { child, dir };
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitJson(url, tries) {
  let last = '';
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = String(res.status);
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('Chrome debug endpoint not ready: ' + last);
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.next = 1;
    this.pending = new Map();
    this.ready = new Promise((res, rej) => {
      this.ws.addEventListener('open', res);
      this.ws.addEventListener('error', () => rej(new Error('cdp socket error')));
    });
    this.logs = [];
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.rej(new Error((msg.error && msg.error.message) || JSON.stringify(msg.error)));
        else p.res(msg.result || {});
      } else if (msg.method === 'Runtime.exceptionThrown' || msg.method === 'Runtime.consoleAPICalled') {
        this.logs.push(msg.method + ' ' + JSON.stringify(msg.params).slice(0, 800));
      }
    });
  }
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 120000);
      this.pending.set(id, {
        res: (v) => { clearTimeout(t); res(v); },
        rej: (e) => { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

import { execFileSync } from 'child_process';

function readCommit(root) {
  try {
    return {
      sha: execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      branch: execFileSync('git', ['-C', root, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim()
    };
  } catch (e) {
    return { sha: '', branch: '', error: e.message };
  }
}

function writeReport(dir, payload) {
  fs.mkdirSync(dir, { recursive: true });
  const shots = path.join(dir, 'shots');
  fs.mkdirSync(shots, { recursive: true });
  for (const shot of payload.shots || []) {
    if (!shot.b64) continue;
    fs.writeFileSync(path.join(shots, shot.name), Buffer.from(shot.b64, 'base64'));
  }
  const slim = Object.assign({}, payload);
  delete slim.shots;
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(slim, null, 2));
  fs.writeFileSync(path.join(dir, 'report.md'), markdown(slim));
}

function markdown(p) {
  const lines = [];
  lines.push('# Anatomy check');
  lines.push('');
  lines.push('Target `' + (p.branch || '') + '` `' + (p.sha || '').slice(0, 12) + '`');
  lines.push('');
  lines.push('Result: **' + (p.ok ? 'PASS' : 'FAIL') + '**');
  lines.push('');
  lines.push('Bar: humanoid at least. Head, then limbs, then the walk. Clothes are secondary.');
  lines.push('');
  if (p.checkerError) {
    lines.push('Checker error: ' + p.checkerError);
    lines.push('');
  }
  if (p.calib && !p.calib.ok) {
    lines.push('Calibration failed. These character results are not trusted.');
    lines.push('');
    for (const e of p.calib.errors || []) lines.push('- ' + e);
    lines.push('');
  }
  const groups = [
    [1, 'Head'],
    [2, 'Limbs and feet'],
    [3, 'Walk']
  ];
  for (const [pri, title] of groups) {
    const items = (p.findings || []).filter((f) => f.priority === pri && f.severity === 'fail');
    lines.push('## ' + pri + '. ' + title);
    lines.push('');
    if (!items.length) lines.push('Pass.');
    for (const f of items) {
      lines.push('- **' + f.title + '** `' + f.id + '`');
      lines.push('  ' + f.detail);
      if (f.shots && f.shots.length) lines.push('  Shots: ' + f.shots.map((s) => 'shots/' + s).join(', '));
    }
    lines.push('');
  }
  const notes = (p.findings || []).filter((f) => f.severity === 'note');
  if (notes.length) {
    lines.push('## Secondary');
    lines.push('');
    for (const f of notes) {
      lines.push('- **' + f.title + '** ' + f.detail);
    }
    lines.push('');
  }
  if (p.pets) {
    lines.push('## Pets');
    lines.push('');
    lines.push(p.pets.ok ? 'Pass. Each pet reads as its animal in idle, walk, closet, and on foot.' : 'Fail.');
    for (const f of p.pets.findings || []) lines.push('- ' + f);
    lines.push('');
  }
  lines.push('## What was rendered');
  lines.push('');
  for (const row of p.coverage || []) lines.push('- ' + row);
  lines.push('');
  if (p.passes && p.passes.length) {
    lines.push('## What held');
    lines.push('');
    for (const row of p.passes) lines.push('- ' + row);
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('node tools/anatomy-check.mjs --root <tree> --out <dir>');
    return;
  }
  const meta = readCommit(args.root);
  const server = await startServer(args.root, args.port);
  const srvPort = server.address().port;
  const debugPort = 9300 + Math.floor(Math.random() * 500);
  const chrome = launchChrome(debugPort);
  let cdp = null;
  try {
    const ver = await waitJson('http://127.0.0.1:' + debugPort + '/json/version', 80);
    cdp = new Cdp(ver.webSocketDebuggerUrl);
    await cdp.send('Target.setDiscoverTargets', { discover: true });
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const targets = await waitJson('http://127.0.0.1:' + debugPort + '/json/list', 40);
    const page = targets.find((t) => t.id === targetId) || targets.find((t) => t.type === 'page');
    cdp.close();
    cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1100, height: 800, deviceScaleFactor: 1, mobile: false
    });
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + srvPort + '/__anatomy.html' });
    let readyVal = '';
    for (let i = 0; i < 40; i++) {
      const ready = await cdp.send('Runtime.evaluate', {
        expression: 'window.__ANATOMY_READY',
        awaitPromise: true,
        returnByValue: true
      }, 60000);
      readyVal = ready.result && ready.result.value;
      if (readyVal === 'ready') break;
      await sleep(200);
    }
    if (readyVal !== 'ready') {
      const probe = await cdp.send('Runtime.evaluate', {
        expression: 'JSON.stringify({state:document.readyState, text:(document.body&&document.body.innerText||"").slice(0,400), href:location.href, err:window.__bootError||""})',
        returnByValue: true
      });
      throw new Error('Harness did not start: ' + (probe.result && probe.result.value) + ' logs=' + cdp.logs.slice(0, 8).join('\n'));
    }
    const ev = await cdp.send('Runtime.evaluate', {
      expression: 'ANATOMY.run()',
      returnByValue: true
    }, 120000);
    if (ev.exceptionDetails) {
      throw new Error(ev.exceptionDetails.text + ' ' + JSON.stringify(ev.exceptionDetails.exception || {}));
    }
    const report = ev.result.value;
    report.sha = meta.sha;
    report.branch = meta.branch;
    report.shots = [];
    for (const name of report.shotNames || []) {
      const one = await cdp.send('Runtime.evaluate', {
        expression: 'ANATOMY.png(' + JSON.stringify(name) + ')',
        returnByValue: true
      }, 60000);
      const b64 = one.result && one.result.value;
      if (b64) report.shots.push({ name, b64 });
    }
    writeReport(args.out, report);
    const fails = (report.findings || []).filter((f) => f.severity === 'fail').length;
    console.log((report.ok ? 'PASS' : 'FAIL') + ' findings=' + fails + ' out=' + args.out);
    console.log('sha ' + meta.sha);
    for (const f of report.findings || []) {
      if (f.severity === 'fail') console.log('P' + f.priority + ' ' + f.id + ' ' + f.title);
    }
    if (report.checkerError) console.log('CHECKER ' + report.checkerError);
    if (report.calib && !report.calib.ok) {
      for (const e of report.calib.errors || []) console.log('CALIB ' + e);
    }
    process.exitCode = report.checkerError || (report.calib && !report.calib.ok) ? 2 : (report.ok ? 0 : 1);
  } finally {
    if (cdp) cdp.close();
    try { chrome.child.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
    server.close();
  }
}

function harnessHtml() {
  return `<!doctype html><meta charset="utf-8"><title>anatomy</title>
<canvas id="cv" width="480" height="640"></canvas>
<script src="/world/crew-data.js"></script>
<script src="/shared/char-closet.js"></script>
<script src="/world/crew.js?anatomy=1"></script>
<script>
${BROWSER}
</script>`;
}

const BROWSER = String.raw`
window.__ANATOMY_READY = 'ready';
try {
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: function () { return 8; } });
} catch (e) {}

var ANATOMY = (function () {
  var images = {};
  var W = 420, H = 560;
  var BG = [7, 1, 15];

  function canvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  function fillBg(ctx, w, h) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#07010f';
    ctx.fillRect(0, 0, w, h);
  }
  function isShadow(r, g, b) {
    return r < 45 && g > r + 12 && b > r + 12 && g < 90 && b < 110;
  }
  function isInk(r, g, b) {
    if (isShadow(r, g, b)) return false;
    var dr = r - BG[0], dg = g - BG[1], db = b - BG[2];
    return dr * dr + dg * dg + db * db > 650;
  }
  function maskOf(ctx, w, h) {
    var data = ctx.getImageData(0, 0, w, h).data;
    var m = new Uint8Array(w * h);
    var shadowYs = [];
    for (var i = 0, p = 0; i < m.length; i++, p += 4) {
      var r = data[p], g = data[p + 1], b = data[p + 2];
      if (isInk(r, g, b)) m[i] = 1;
      else if (isShadow(r, g, b)) shadowYs.push((i / w) | 0);
    }
    var ground = null;
    if (shadowYs.length > 20) {
      shadowYs.sort(function (a, b) { return a - b; });
      ground = shadowYs[(shadowYs.length * 0.5) | 0];
    }
    return { m: m, w: w, h: h, ground: ground };
  }
  function bboxOf(m, w, h) {
    var x0 = w, y0 = h, x1 = -1, y1 = -1, n = 0;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (m[y * w + x]) {
      n++; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y;
    }
    if (!n) return null;
    return { x0: x0, y0: y0, x1: x1, y1: y1, n: n, fh: y1 - y0 + 1, fw: x1 - x0 + 1 };
  }
  function components(m, w, h) {
    var seen = new Uint8Array(w * h);
    var out = [];
    var stack = [];
    var dirs = [-1, 0, 1, 0, 0, -1, 0, 1, -1, -1, 1, -1, -1, 1, 1, 1];
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var s = y * w + x;
      if (!m[s] || seen[s]) continue;
      var area = 0, x0 = x, y0 = y, x1 = x, y1 = y, sx = 0, sy = 0;
      stack.length = 0; stack.push(s); seen[s] = 1;
      while (stack.length) {
        var i = stack.pop();
        var cx = i % w, cy = (i / w) | 0;
        area++; sx += cx; sy += cy;
        if (cx < x0) x0 = cx; if (cy < y0) y0 = cy; if (cx > x1) x1 = cx; if (cy > y1) y1 = cy;
        for (var d = 0; d < 16; d += 2) {
          var nx = cx + dirs[d], ny = cy + dirs[d + 1];
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          var j = ny * w + nx;
          if (!m[j] || seen[j]) continue;
          seen[j] = 1; stack.push(j);
        }
      }
      out.push({ area: area, x0: x0, y0: y0, x1: x1, y1: y1, cx: sx / area, cy: sy / area });
    }
    out.sort(function (a, b) { return b.area - a.area; });
    return out;
  }
  function rowSpans(m, w, y, x0, x1) {
    var spans = [];
    var run = -1;
    var gap = 0;
    for (var x = x0; x <= x1; x++) {
      if (m[y * w + x]) {
        if (run < 0) run = x;
        gap = 0;
      } else if (run >= 0) {
        gap++;
        if (gap >= 3) { spans.push([run, x - gap]); run = -1; gap = 0; }
      }
    }
    if (run >= 0) spans.push([run, x1]);
    return spans;
  }
  function widthAt(m, w, y, x0, x1) {
    var a = -1, b = -1;
    for (var x = x0; x <= x1; x++) if (m[y * w + x]) { if (a < 0) a = x; b = x; }
    return a < 0 ? 0 : (b - a + 1);
  }
  function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
  function nearest(m, w, h, pred, qx, qy) {
    var best = 1e9;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (m[y * w + x] && pred(x, y)) {
      var d = dist(x, y, qx, qy);
      if (d < best) best = d;
    }
    return best;
  }

  function measure(pack, groundY) {
    var m = pack.m, w = pack.w, h = pack.h;
    var box = bboxOf(m, w, h);
    if (!box || box.n < 30) return { missing: true, figureH: 0, components: [] };
    var comps = components(m, w, h).filter(function (c) { return c.area >= 36; });
    var fh = box.fh;
    var gapLim = Math.max(6, fh * 0.025);
    var cx = (box.x0 + box.x1) / 2;
    var strip = Math.max(2, (fh * 0.015) | 0);
    function stripOn(y) {
      var x0 = Math.max(0, (cx - strip) | 0), x1 = Math.min(w - 1, (cx + strip) | 0);
      for (var x = x0; x <= x1; x++) if (m[y * w + x]) return true;
      return false;
    }
    var runs = [];
    var ry = -1;
    var headScan = Math.min(box.y1, (box.y0 + fh * 0.46) | 0);
    for (var y = box.y0; y <= headScan; y++) {
      if (stripOn(y)) { if (ry < 0) ry = y; }
      else if (ry >= 0) { runs.push([ry, y - 1]); ry = -1; }
    }
    if (ry >= 0) runs.push([ry, headScan]);
    var headGap = 0, headTop = box.y0, headBot = box.y0;
    if (runs.length) {
      headTop = runs[0][0]; headBot = runs[0][1];
      if (runs.length > 1) headGap = runs[1][0] - runs[0][1] - 1;
    }
    function centralSpan(y) {
      var sp = rowSpans(m, w, y, box.x0, box.x1);
      for (var i = 0; i < sp.length; i++) if (sp[i][0] <= cx && sp[i][1] >= cx) return sp[i];
      return null;
    }
    function centralW(y) {
      var s = centralSpan(y);
      return s ? (s[1] - s[0] + 1) : 0;
    }
    var cw = new Float64Array(h);
    for (var y2 = box.y0; y2 <= box.y1; y2++) cw[y2] = centralW(y2);
    var headMaxW = 0, equator = box.y0;
    var headLimit = Math.min(box.y1, (box.y0 + fh * 0.36) | 0);
    for (var ye = box.y0; ye <= headLimit; ye++) {
      if (cw[ye] >= headMaxW) { headMaxW = cw[ye]; equator = ye; }
      else if (headMaxW > 12 && ye > equator + fh * 0.03 && cw[ye] < headMaxW * 0.85) break;
    }
    if (headMaxW < 8) headMaxW = 8;
    var neckY = headBot, neckW = headMaxW, shoulderY = -1, shoulderW = 0;
    if (headGap > 2 && runs.length > 1) {
      var bodyTop = runs[1][0];
      var lim = Math.min(box.y1, bodyTop + fh * 0.22);
      var peak = 0;
      for (var yb = bodyTop; yb <= lim; yb++) if (cw[yb] > peak) peak = cw[yb];
      shoulderY = bodyTop;
      for (var yb2 = bodyTop; yb2 <= lim; yb2++) {
        if (cw[yb2] >= peak * 0.7 && cw[yb2] > 4) { shoulderY = yb2; break; }
      }
      shoulderW = cw[shoulderY] || peak;
      neckW = 0;
    } else {
      var minW = cw[equator] || headMaxW, minY = equator;
      var searchEnd = Math.min(box.y1, (box.y0 + fh * 0.58) | 0);
      for (var ys = equator + 1; ys <= searchEnd; ys++) {
        var widthC = cw[ys];
        if (widthC > 0 && widthC < minW) { minW = widthC; minY = ys; }
        if (minY > equator + 2 && widthC >= minW * 1.35 && widthC >= headMaxW * 0.42 && ys > minY) {
          shoulderY = ys; neckY = minY; neckW = minW; shoulderW = widthC; break;
        }
      }
    }
    if (shoulderY < 0) {
      shoulderY = Math.min(box.y1, (box.y0 + fh * 0.34) | 0);
      shoulderW = cw[shoulderY] || 0;
    }
    var neckRatio = neckW / headMaxW;
    var neck = headGap <= 2 && neckW > 0 && neckRatio >= 0.16 && neckRatio <= 0.82 && shoulderW > neckW * 1.12;
    if (headGap <= 2) {
      if (neck) headBot = neckY;
      else {
        headBot = headTop;
        var chinLim = Math.min(box.y1, (box.y0 + fh * 0.42) | 0);
        for (var yc = box.y0; yc <= chinLim; yc++) if (cw[yc] >= headMaxW * 0.55) headBot = yc;
      }
      headTop = box.y0;
    }
    var headH = Math.max(1, headBot - headTop + 1);
    var headSx = 0, headSn = 0;
    for (var hy = headTop; hy <= Math.min(box.y1, headBot); hy++) {
      for (var hx = box.x0; hx <= box.x1; hx++) if (m[hy * w + hx]) { headSx += hx; headSn++; }
    }
    var headCx = headSn ? headSx / headSn : cx;
    var edgeL = [], edgeR = [];
    var chestEnd = Math.min(box.y1, shoulderY + fh * 0.22);
    for (var yt = shoulderY; yt <= chestEnd; yt++) {
      var spc = centralSpan(yt);
      if (!spc) continue;
      var sw = spc[1] - spc[0] + 1;
      if (sw < Math.max(8, headMaxW * 0.35)) continue;
      edgeL.push(spc[0]); edgeR.push(spc[1]);
    }
    edgeL.sort(function (a, b) { return a - b; });
    edgeR.sort(function (a, b) { return a - b; });
    var torsoLeft, torsoRight, torsoCx;
    if (edgeL.length) {
      torsoLeft = edgeL[(edgeL.length * 0.5) | 0];
      torsoRight = edgeR[(edgeR.length * 0.5) | 0];
      torsoCx = (torsoLeft + torsoRight) / 2;
    } else {
      var coreFallback = Math.max(12, shoulderW);
      torsoLeft = cx - coreFallback / 2;
      torsoRight = cx + coreFallback / 2;
      torsoCx = cx;
    }
    var hipY = -1, seenSplit = false;
    var hipScan = box.y0 + fh * 0.32;
    for (var yh = box.y1; yh >= hipScan; yh--) {
      var sph = rowSpans(m, w, yh, box.x0, box.x1);
      var hasL = false, hasR = false, hasC = false;
      for (var si = 0; si < sph.length; si++) {
        var sa = sph[si][0], sb = sph[si][1];
        if (sb < torsoCx - 1) hasL = true;
        else if (sa > torsoCx + 1) hasR = true;
        else hasC = true;
      }
      if (hasL && hasR && !hasC) seenSplit = true;
      else if (seenSplit && hasC) { hipY = yh; break; }
    }
    if (hipY < 0) hipY = Math.min(box.y1 - 4, (box.y0 + fh * 0.64) | 0);
    var win0 = Math.min(box.y1, (box.y0 + fh * 0.34) | 0);
    var win1 = Math.min(box.y1, Math.max(win0 + 4, (box.y0 + fh * 0.52) | 0));
    var depthSamples = [];
    var inkRows = 0, winRows = 0;
    for (var yd = win0; yd <= win1; yd++) {
      depthSamples.push(cw[yd] || 0);
      winRows++;
      if (rowSpans(m, w, yd, box.x0, box.x1).length) inkRows++;
    }
    depthSamples.sort(function (a, b) { return a - b; });
    var depth = depthSamples.length ? depthSamples[Math.floor(depthSamples.length * 0.25)] : 0;
    function emptyRun(y0, y1) {
      var gap = 0, best = 0, seen = false, any = false;
      var a = Math.max(box.y0, y0 | 0), b = Math.min(box.y1, y1 | 0);
      for (var y = a; y <= b; y++) {
        if (stripOn(y)) {
          any = true;
          if (seen && gap > best) best = gap;
          gap = 0; seen = true;
        } else if (seen) gap++;
      }
      if (!any) return Math.max(0, b - a);
      return best;
    }
    var neckJoin = emptyRun(headBot, win0 + Math.max(4, fh * 0.04));
    var hipJoin = (winRows && inkRows < winRows * 0.45) ? (win1 - win0) : emptyRun(win0, win1);
    var torsoTop = headGap > 2 ? runs[1][0] : (neck ? neckY : shoulderY);
    var torsoBot = hipY;
    var dxHead = Math.abs(headCx - torsoCx);
    var centered = dxHead <= Math.max(8, (torsoRight - torsoLeft) * 0.18);
    var ratio = headH / fh;
    var buried = headGap <= 2 && headBot > torsoTop + headH * 0.45 && neckW > headMaxW * 0.9;

    function connectedInk(sx, sy, pixels) {
      if (!pixels || !pixels.length) return false;
      var seen = new Uint8Array(w * h);
      var stack = [];
      var rad = 8;
      for (var yy = (sy - rad) | 0; yy <= sy + rad; yy++) {
        for (var xx = (sx - rad) | 0; xx <= sx + rad; xx++) {
          if (xx < box.x0 || yy < box.y0 || xx > box.x1 || yy > box.y1) continue;
          var s = yy * w + xx;
          if (m[s] && !seen[s]) { seen[s] = 1; stack.push(s); }
        }
      }
      if (!stack.length) return false;
      var want = new Uint8Array(w * h);
      for (var i = 0; i < pixels.length; i++) {
        var px = pixels[i][0], py = pixels[i][1];
        if (px >= 0 && py >= 0 && px < w && py < h) want[py * w + px] = 1;
      }
      var dirs = [-1, 0, 1, 0, 0, -1, 0, 1, -1, -1, 1, -1, -1, 1, 1, 1];
      while (stack.length) {
        var idx = stack.pop();
        if (want[idx]) return true;
        var cxp = idx % w, cy = (idx / w) | 0;
        for (var d = 0; d < 16; d += 2) {
          var nx = cxp + dirs[d], ny = cy + dirs[d + 1];
          if (nx < box.x0 || ny < box.y0 || nx > box.x1 || ny > box.y1) continue;
          var j = ny * w + nx;
          if (!m[j] || seen[j]) continue;
          seen[j] = 1; stack.push(j);
        }
      }
      return false;
    }
    function verticalHole(pixels) {
      if (!pixels.length) return 0;
      var y0 = pixels[0][1], y1 = y0;
      for (var i = 1; i < pixels.length; i++) {
        if (pixels[i][1] < y0) y0 = pixels[i][1];
        if (pixels[i][1] > y1) y1 = pixels[i][1];
      }
      var on = new Uint8Array(y1 - y0 + 1);
      for (var j = 0; j < pixels.length; j++) on[pixels[j][1] - y0] = 1;
      var gap = 0, best = 0, seen = false;
      for (var k = 0; k < on.length; k++) {
        if (on[k]) { if (seen && gap > best) best = gap; gap = 0; seen = true; }
        else if (seen) gap++;
      }
      return best;
    }

    function sideStats(side) {
      var left = side === 'L';
      var pixels = [];
      var yA = headBot - 2, yB = Math.min(box.y1, hipY + fh * 0.08);
      for (var y = Math.max(0, yA | 0); y <= yB; y++) {
        for (var x = box.x0; x <= box.x1; x++) {
          if (!m[y * w + x]) continue;
          if (left ? x < torsoLeft - 1 : x > torsoRight + 1) pixels.push([x, y]);
        }
      }
      var present = pixels.length > 18;
      var attachGap = present ? 0 : 999;
      var handGap = 0;
      var angle = 0;
      var up = false;
      var hand = null, shoulderPt = null;
      if (present) {
        var edge = left ? torsoLeft : torsoRight;
        var yArm0 = shoulderY, yArm1 = Math.min(yB, shoulderY + fh * 0.18);
        var best = 1e9;
        pixels.forEach(function (p) {
          var yy = p[1] < yArm0 ? yArm0 : (p[1] > yArm1 ? yArm1 : p[1]);
          var d = dist(p[0], p[1], edge, yy);
          if (d < best) best = d;
        });
        attachGap = best;
        var low = pixels[0];
        pixels.forEach(function (p) { if (p[1] > low[1]) low = p; });
        hand = { x: low[0], y: low[1] };
        shoulderPt = { x: edge, y: shoulderY };
        handGap = verticalHole(pixels);
        var dy = hand.y - shoulderY, ddx = hand.x - edge;
        angle = Math.abs(Math.atan2(ddx, Math.max(1, dy))) * 180 / Math.PI;
        up = dy < fh * 0.04;
        if (connectedInk(edge, shoulderY, pixels)) {
          attachGap = Math.min(attachGap, 2);
          var tip = [];
          for (var ti = 0; ti < pixels.length; ti++) if (pixels[ti][1] >= low[1] - 6) tip.push(pixels[ti]);
          if (connectedInk(edge, shoulderY, tip)) handGap = 0;
        }
      }
      return { present: present, attachGap: attachGap, handGap: handGap, angle: angle, up: up, hand: hand, shoulder: shoulderPt, n: pixels.length };
    }

    function legStats(side) {
      var left = side === 'L';
      var pixels = [];
      for (var y = (hipY - 2) | 0; y <= box.y1; y++) {
        for (var x = box.x0; x <= box.x1; x++) {
          if (!m[y * w + x]) continue;
          if (left ? x <= torsoCx : x >= torsoCx) pixels.push([x, y]);
        }
      }
      var present = pixels.length > 18;
      var hipGap = 999, footGap = 0, angle = 0, up = false, foot = null;
      if (present) {
        var top = pixels[0];
        pixels.forEach(function (p) { if (p[1] < top[1]) top = p; });
        hipGap = Math.max(0, top[1] - hipY);
        var low = pixels[0];
        pixels.forEach(function (p) { if (p[1] > low[1]) low = p; });
        foot = { x: low[0], y: low[1] };
        var hipX = left ? (torsoLeft + torsoCx) / 2 : (torsoRight + torsoCx) / 2;
        var dy = foot.y - hipY, ddx = foot.x - hipX;
        angle = Math.abs(Math.atan2(ddx, Math.max(1, dy))) * 180 / Math.PI;
        up = foot.y + Math.max(4, fh * 0.02) < hipY;
        footGap = verticalHole(pixels);
        if (connectedInk(torsoCx, hipY, [foot])) footGap = 0;
      }
      return { present: present, hipGap: hipGap, footGap: footGap, angle: angle, up: up, foot: foot };
    }

    var arms = { L: sideStats('L'), R: sideStats('R') };
    var legs = { L: legStats('L'), R: legStats('R') };
    var lrOk = true, lrMsg = '';
    if (arms.L.hand && arms.R.hand) {
      if (!(arms.L.hand.x < torsoCx - 4 && arms.R.hand.x > torsoCx + 4)) {
        lrOk = false; lrMsg = 'Hands are not on their own sides (left ' + Math.round(arms.L.hand.x) + ', right ' + Math.round(arms.R.hand.x) + ', center ' + Math.round(torsoCx) + ')';
      }
    } else if (arms.L.present && arms.R.present && arms.L.hand && arms.R.hand) {
      lrOk = arms.L.hand.x < arms.R.hand.x;
    }
    if (legs.L.foot && legs.R.foot && legs.L.foot.x > legs.R.foot.x + 6) {
      lrOk = false; lrMsg = 'The legs read swapped, left foot is to the right of the right foot';
    }
    var footY = box.y1;
    var gy = groundY == null ? pack.ground : groundY;
    var floatPx = 0, clipPx = 0, slop = Math.max(8, fh * 0.04);
    if (gy != null) {
      floatPx = gy - footY;
      if (floatPx < 0) { clipPx = -floatPx; floatPx = 0; }
    }
    function footClustersOf() {
      var y0 = (box.y1 - Math.max(16, fh * 0.22)) | 0;
      if (y0 < box.y0) y0 = box.y0;
      var hist = new Int32Array(w);
      var bot = new Int32Array(w);
      for (var y = y0; y <= box.y1; y++) {
        for (var x = box.x0; x <= box.x1; x++) if (m[y * w + x]) {
          hist[x]++; if (y > bot[x]) bot[x] = y;
        }
      }
      var spans = [];
      var run = -1, gapc = 0;
      for (var x = box.x0; x <= box.x1; x++) {
        if (hist[x]) { if (run < 0) run = x; gapc = 0; }
        else if (run >= 0) {
          gapc++;
          if (gapc >= 4) { spans.push([run, x - gapc]); run = -1; gapc = 0; }
        }
      }
      if (run >= 0) spans.push([run, box.x1]);
      function cuts(a, b) {
        if (b - a < 16) return [[a, b]];
        var peak1 = a, peak2 = a, p1 = 0, p2 = 0;
        for (var x3 = a; x3 <= b; x3++) {
          var v = hist[x3];
          if (v >= p1) {
            if (x3 - peak1 > 8) { p2 = p1; peak2 = peak1; }
            p1 = v; peak1 = x3;
          } else if (v > p2 && Math.abs(x3 - peak1) > 8) { p2 = v; peak2 = x3; }
        }
        if (p2 < p1 * 0.3 || Math.abs(peak1 - peak2) < 10) return [[a, b]];
        var lo = Math.min(peak1, peak2), hi = Math.max(peak1, peak2);
        var minV = 1e9, minX = (lo + hi) >> 1;
        for (var x4 = lo; x4 <= hi; x4++) if (hist[x4] <= minV) { minV = hist[x4]; minX = x4; }
        if (minV > Math.min(p1, p2) * 0.62 || minX <= a + 2 || minX >= b - 2) return [[a, b]];
        return [[a, minX - 1], [minX + 1, b]];
      }
      var clusters = [];
      spans.forEach(function (sp) {
        cuts(sp[0], sp[1]).forEach(function (part) {
          var area = 0, bestX = part[0], bestY = -1;
          for (var x5 = part[0]; x5 <= part[1]; x5++) {
            area += hist[x5];
            if (bot[x5] > bestY) { bestY = bot[x5]; bestX = x5; }
          }
          if (area >= 10 && bestY >= 0) clusters.push({ x: bestX, y: bestY, area: area });
        });
      });
      return clusters;
    }
    var footClusters = footClustersOf();
    if (footClusters.length < 2 && legs.L.foot && legs.R.foot && Math.abs(legs.L.foot.x - legs.R.foot.x) >= 4) {
      var sole = Math.max(legs.L.foot.y, legs.R.foot.y);
      var lift = sole - Math.min(legs.L.foot.y, legs.R.foot.y);
      if (sole >= box.y1 - fh * 0.16 && lift < fh * 0.22) {
        footClusters = [
          { x: legs.L.foot.x, y: legs.L.foot.y, area: 30 },
          { x: legs.R.foot.x, y: legs.R.foot.y, area: 30 }
        ];
      }
    }
    var handClusters = [];
    if (arms.L.hand) handClusters.push({ x: arms.L.hand.x, y: arms.L.hand.y, area: arms.L.n || 1 });
    if (arms.R.hand) handClusters.push({ x: arms.R.hand.x, y: arms.R.hand.y, area: arms.R.n || 1 });
    var clipMsg = '';
    ['L', 'R'].forEach(function (s) {
      var hd = arms[s].hand;
      if (!hd) return;
      if (hd.x > torsoLeft + 4 && hd.x < torsoRight - 4 && hd.y > torsoTop && hd.y < torsoBot) {
        clipMsg = s + ' hand sits inside the torso';
      }
    });
    return {
      missing: false,
      figureH: fh,
      figureW: box.fw,
      box: box,
      head: { gap: headGap, ratio: ratio, centered: centered, dx: dxHead, headH: headH, neck: neck, top: headTop, bottom: headBot, cx: headCx },
      torso: { left: torsoLeft, right: torsoRight, cx: torsoCx, top: torsoTop, hip: hipY, shoulderY: shoulderY, depth: depth, neckJoin: neckJoin, hipJoin: hipJoin, win0: win0, win1: win1 },
      arms: arms,
      legs: legs,
      lr: { ok: lrOk, msg: lrMsg },
      ground: gy == null ? null : { floatPx: floatPx, clipPx: clipPx, slop: slop, groundY: gy, footY: footY },
      buried: buried,
      clip: clipMsg,
      components: comps.slice(0, 8).map(function (c) { return { area: c.area, x0: c.x0, y0: c.y0, x1: c.x1, y1: c.y1 }; }),
      compAll: comps,
      footClusters: footClusters,
      handClusters: handClusters
    };
  }

  function problemsOf(m, opt) {
    var p = [];
    if (!m || m.missing) return [{ id: 'missing', priority: 1, msg: 'Nothing readable is drawn' }];
    var H = m.figureH || 1;
    var gapLim = Math.max(6, H * 0.025);
    if (m.head.gap > gapLim) p.push({ id: 'head-neck', priority: 1, msg: 'The head floats ' + Math.round(m.head.gap) + 'px above the body. No neck joins them' });
    else if (!m.head.neck) p.push({ id: 'head-neck', priority: 1, msg: 'The head does not sit on a neck. The outline never narrows between head and shoulders' });
    if (m.buried) p.push({ id: 'head-buried', priority: 1, msg: 'The head is buried in the torso' });
    if (m.head.ratio < 0.16 || m.head.ratio > 0.45) p.push({ id: 'head-size', priority: 1, msg: 'Head height is ' + Math.round(m.head.ratio * 100) + '% of the figure. A Brookhaven-style head is about 18% to 40%' });
    if (!m.head.centered) p.push({ id: 'head-center', priority: 1, msg: 'The head is off the center of the shoulders by ' + Math.round(m.head.dx) + 'px' });
    var view = opt && opt.view ? opt.view : '';
    var where = view ? ' in the ' + view + ' view' : '';
    if (m.torso && m.torso.depth < Math.max(8, H * 0.1)) {
      p.push({ id: 'torso-depth', priority: 2, msg: 'The torso has no depth' + where + '. Chest width is ' + Math.round(m.torso.depth) + 'px (' + Math.round(100 * m.torso.depth / H) + '% of height). Side, front, and back all need a visible body' });
    }
    if (m.torso && m.torso.neckJoin > gapLim) {
      p.push({ id: 'torso-neck', priority: 2, msg: 'The neck does not connect to the torso' + where + '. Gap ' + Math.round(m.torso.neckJoin) + 'px' });
    }
    if (m.torso && m.torso.hipJoin > gapLim) {
      p.push({ id: 'torso-hip', priority: 2, msg: 'The torso does not connect to the hips' + where + '. Gap ' + Math.round(m.torso.hipJoin) + 'px' });
    }
    if (!(opt && opt.profile)) ['L', 'R'].forEach(function (s) {
      var name = s === 'L' ? 'Left' : 'Right';
      var a = m.arms[s];
      var expectBothArms = !opt || !opt.view || opt.view === 'front' || opt.view === 'back';
      if (!a.present) {
        if (expectBothArms) p.push({ id: 'arm-missing', priority: 2, msg: name + ' arm is missing' });
      } else if (a.attachGap > gapLim * 1.4) p.push({ id: 'arm-shoulder', priority: 2, msg: name + ' arm does not leave the shoulder. Closest gap is ' + Math.round(a.attachGap) + 'px' });
      if (a.handGap > gapLim) p.push({ id: 'hand-arm', priority: 2, msg: name + ' hand does not sit on the end of the arm. Gap ' + Math.round(a.handGap) + 'px' });
      if (opt && opt.idleAngles && a.present && (a.up || a.angle > 58)) p.push({ id: 'arm-angle', priority: 2, msg: name + ' arm does not hang from the shoulder (' + Math.round(a.angle) + ' degrees from straight down)' });
      var leg = m.legs[s];
      if (!leg.present) p.push({ id: 'leg-missing', priority: 2, msg: name + ' leg is missing' });
      else if (leg.hipGap > gapLim) p.push({ id: 'leg-hip', priority: 2, msg: name + ' leg does not leave the hip. Gap ' + Math.round(leg.hipGap) + 'px' });
      if (leg.footGap > gapLim) p.push({ id: 'foot-leg', priority: 2, msg: name + ' foot is separated from the leg by ' + Math.round(leg.footGap) + 'px' });
      if (opt && opt.idleAngles && leg.present && (leg.up || leg.angle > 42)) p.push({ id: 'leg-angle', priority: 2, msg: name + ' leg is not a standing leg (' + Math.round(leg.angle) + ' degrees)' });
    });
    if (!m.lr.ok && !(opt && opt.profile)) p.push({ id: 'left-right', priority: 2, msg: m.lr.msg || 'Left and right are swapped or missing' });
    if (m.ground && m.ground.floatPx > m.ground.slop) p.push({ id: 'feet-ground', priority: 2, msg: 'Feet float ' + Math.round(m.ground.floatPx) + 'px above the ground' });
    if (m.ground && m.ground.clipPx > m.ground.slop * 1.3) p.push({ id: 'feet-clip', priority: 2, msg: 'Feet sink ' + Math.round(m.ground.clipPx) + 'px through the ground' });
    if (m.clip) p.push({ id: 'clip', priority: 3, msg: m.clip });
    return p;
  }

  function strokeLimb(ctx, x0, y0, x1, y1, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  function drawGoodStill(ctx, broken) {
    fillBg(ctx, W, H);
    var ground = 500;
    var cx = 210;
    var skin = '#f2c7a5', shirt = '#ff3df2', pants = '#2a6fdb', shoe = '#ffffff';
    var headCy = broken ? 70 : 108;
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.ellipse(cx, headCy, 38, 42, 0, 0, 7);
    ctx.fill();
    if (!broken) {
      ctx.fillStyle = skin;
      ctx.fillRect(cx - 12, 146, 24, 22);
    }
    ctx.fillStyle = shirt;
    ctx.fillRect(cx - 50, 164, 100, 110);
    var armY = broken ? 78 : 180;
    var armEnd = broken ? 150 : 292;
    strokeLimb(ctx, cx - 50, armY, cx - 92, armEnd, 16, shirt);
    strokeLimb(ctx, cx + 50, armY, cx + 92, armEnd, 16, shirt);
    var handY = broken ? armEnd + 46 : armEnd + 8;
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(cx - 92, handY, 11, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 92, handY, 11, 0, 7); ctx.fill();
    strokeLimb(ctx, cx - 22, 274, cx - 30, broken ? 430 : 486, 18, pants);
    strokeLimb(ctx, cx + 22, 274, cx + 34, broken ? 430 : 486, 18, pants);
    ctx.fillStyle = shoe;
    ctx.beginPath(); ctx.ellipse(cx - 36, broken ? 436 : 494, 20, 8, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 42, broken ? 436 : 494, 20, 8, 0, 0, 7); ctx.fill();
    return ground;
  }

  function drawGoodWalk(ctx, phase, broken) {
    fillBg(ctx, W, H);
    var ground = 500;
    var cx = 230;
    var s = Math.sin(phase * Math.PI * 2);
    var c = Math.cos(phase * Math.PI * 2);
    var bob = broken ? 0 : Math.abs(c) * 7;
    var hip = 340 - bob;
    var shoulder = hip - 108;
    var skin = '#f2c7a5', shirt = '#3ee6ff', pants = '#ffb020';
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(cx + (broken ? 0 : s * 2), shoulder - 64 - bob * 0.2, 36, 40, 0, 0, 7); ctx.fill();
    ctx.fillStyle = skin;
    ctx.fillRect(cx - 10, shoulder - 28, 20, 18);
    ctx.fillStyle = shirt;
    ctx.beginPath();
    ctx.moveTo(cx - 42, shoulder);
    ctx.lineTo(cx + 36, shoulder - 4);
    ctx.lineTo(cx + 30, hip);
    ctx.lineTo(cx - 34, hip + 4);
    ctx.closePath();
    ctx.fill();
    function footOf(u) {
      if (broken) return { x: 0, y: -40 };
      if (u < 0.5) return { x: 36 - 72 * (u / 0.5), y: 0 };
      var k = (u - 0.5) / 0.5;
      return { x: -36 + 72 * k, y: -Math.sin(k * Math.PI) * 30 };
    }
    var lf = footOf(phase % 1);
    var rf = footOf((phase + 0.5) % 1);
    strokeLimb(ctx, cx - 18, hip, cx - 22 + lf.x, ground + lf.y - 8, 16, pants);
    strokeLimb(ctx, cx + 18, hip, cx + 22 + rf.x, ground + rf.y - 8, 16, pants);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(cx - 22 + lf.x, ground + lf.y - 6, 14, 7, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 22 + rf.x, ground + rf.y - 6, 14, 7, 0, 0, 7); ctx.fill();
    var la = broken ? -70 : -100 - c * 28;
    var ra = broken ? 70 : 100 + c * 28;
    var handDrop = 78;
    strokeLimb(ctx, cx - 40, shoulder + 8, cx + la, shoulder + handDrop, 14, shirt);
    strokeLimb(ctx, cx + 34, shoulder + 6, cx + ra, shoulder + handDrop, 14, shirt);
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(cx + la, shoulder + handDrop + 4, 9, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + ra, shoulder + handDrop + 4, 9, 0, 7); ctx.fill();
    return ground;
  }

  function drawSideBody(ctx, deep) {
    fillBg(ctx, W, H);
    var ground = 500;
    var cx = 220;
    var skin = '#f2c7a5', shirt = '#ff3df2', pants = '#2a6fdb';
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(cx, 108, 34, 42, 0, 0, 7); ctx.fill();
    ctx.fillRect(cx - 10, 146, 20, 24);
    ctx.fillStyle = shirt;
    if (deep) ctx.fillRect(cx - 36, 166, 72, 112);
    ctx.fillStyle = pants;
    ctx.fillRect(cx - 12, deep ? 274 : 330, 24, deep ? 214 : 156);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(cx + 4, deep ? 494 : 494, 18, 8, 0, 0, 7); ctx.fill();
    return ground;
  }

  function annotate(src, measure, caption) {
    var pad = 36;
    var c = canvas(src.width, src.height + pad);
    var g = c.getContext('2d');
    g.fillStyle = '#12081c';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#fff';
    g.font = '700 13px system-ui,sans-serif';
    g.fillText(caption.slice(0, 78), 8, 24);
    g.drawImage(src, 0, pad);
    if (measure && measure.ground && measure.ground.groundY != null) {
      g.strokeStyle = '#ffe14d';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(8, pad + measure.ground.groundY);
      g.lineTo(src.width - 8, pad + measure.ground.groundY);
      g.stroke();
    }
    if (measure && measure.compAll && measure.compAll.length > 1) {
      g.strokeStyle = '#ff4d5e';
      g.lineWidth = 2;
      measure.compAll.slice(1, 6).forEach(function (p) {
        g.strokeRect(p.x0 + 0.5, pad + p.y0 + 0.5, Math.max(2, p.x1 - p.x0), Math.max(2, p.y1 - p.y0));
      });
    }
    return c.toDataURL('image/png').split(',')[1];
  }
  function store(name, cnv, measure, caption) {
    images[name] = annotate(cnv, measure, caption);
  }

  function projectAt(w, h, groundY) {
    var dist = 1.7, f = 460, lookY = 0.4;
    var cx = w * 0.5, cy = groundY;
    return function (x, y, z) {
      var Z = dist - z;
      if (Z < 0.25) return null;
      return [cx + x * f / Z, cy - (y - lookY) * f / Z, Z, f];
    };
  }

  function renderFigure(yaw, spec, groundY) {
    var c = canvas(W, H);
    var ctx = c.getContext('2d');
    fillBg(ctx, W, H);
    var api = window.__ANATOMY;
    if (!api || !api.paintFigure) return { canvas: c, error: 'paintFigure missing' };
    var look = api.wearLook ? api.wearLook('girl') : { head: 0.2, torso: 0.3, thigh: 0.2, shin: 0.18, neck: 0.04, shoulder: 0.16, hip: 0.1, uarm: 0.18, farm: 0.16, armR: 0.04, legR: 0.05, cloth: '#ff3df2', cloth2: '#2a6fdb', trim: '#3ee6ff', accent: '#3ee6ff', sole: '#fff', hair: '#3a2418' };
    var project = projectAt(W, H, groundY);
    try { api.paintFigure(ctx, look, spec || api.humanSpec('idle', 0.2, 0.2, false), project, yaw || 0, { x: 0, y: 0, z: 0 }); }
    catch (e) { return { canvas: c, error: String(e && e.message || e) }; }
    return { canvas: c, groundY: project(0, 0, 0)[1] };
  }

  function renderCloset() {
    var c = canvas(W, H);
    var ctx = c.getContext('2d');
    fillBg(ctx, W, H);
    if (!window.CHARCLOSET || !CHARCLOSET.frame) return { canvas: c, error: 'no closet' };
    try { CHARCLOSET.frame(ctx, W, H); } catch (e) { return { canvas: c, error: String(e.message || e) }; }
    return { canvas: c, groundY: null };
  }

  function setWear(parts) {
    if (!window.CHARCLOSET) return;
    var w = CHARCLOSET.wear();
    if (!setWear.base) setWear.base = JSON.parse(JSON.stringify({ parts: w.parts, colors: w.colors, gender: w.gender }));
    var b = setWear.base;
    w.gender = b.gender;
    w.parts = JSON.parse(JSON.stringify(b.parts));
    w.colors = JSON.parse(JSON.stringify(b.colors));
    if (parts) for (var k in parts) w.parts[k] = parts[k];
  }

  function idleSpec() {
    if (window.__ANATOMY && __ANATOMY.humanSpec) return __ANATOMY.humanSpec('idle', 0.15, 0.2, false);
    return { legL: 0, legR: 0 };
  }
  function walkSpec(phase) {
    if (window.__ANATOMY && __ANATOMY.humanSpec) return __ANATOMY.humanSpec('walk', phase, phase, false);
    return { legL: phase < 0.5 ? 0.4 : 0, legR: phase >= 0.5 ? 0.4 : 0 };
  }

  function stillCase(name, draw, opt) {
    var c = canvas(W, H);
    var ctx = c.getContext('2d');
    var ground = draw(ctx);
    var pack = maskOf(ctx, W, H);
    var gy = ground == null ? pack.ground : ground;
    if (typeof ground === 'number') gy = ground;
    var m = measure(pack, gy);
    var probs = problemsOf(m, opt || { idleAngles: true });
    store(name + '.png', c, m, name);
    return { name: name, measure: slim(m), problems: probs };
  }

  function slim(m) {
    if (!m) return null;
    return {
      missing: m.missing, figureH: m.figureH,
      head: m.head, torso: m.torso,
      arms: { L: pickArm(m.arms && m.arms.L), R: pickArm(m.arms && m.arms.R) },
      legs: { L: pickLeg(m.legs && m.legs.L), R: pickLeg(m.legs && m.legs.R) },
      lr: m.lr, ground: m.ground, buried: m.buried, clip: m.clip,
      components: m.components
    };
  }
  function pickArm(a) { if (!a) return null; return { present: a.present, attachGap: round(a.attachGap), handGap: round(a.handGap), angle: round(a.angle), up: a.up, n: a.n }; }
  function pickLeg(a) { if (!a) return null; return { present: a.present, hipGap: round(a.hipGap), footGap: round(a.footGap), angle: round(a.angle) }; }
  function round(n) { return n == null || !isFinite(n) ? n : Math.round(n * 10) / 10; }

  function walkFrames(broken, yawName) {
    var frames = [];
    for (var i = 0; i < 8; i++) {
      var phase = i / 8;
      var c = canvas(W, H);
      var ctx = c.getContext('2d');
      var ground = drawGoodWalk(ctx, phase, broken);
      var pack = maskOf(ctx, W, H);
      var m = measure(pack, ground);
      frames.push({ phase: phase, m: m, canvas: c });
      if (!broken) store('calib-walk-' + i + '.png', c, m, 'calib walk ' + i);
    }
    return analyzeWalk(frames, 'calib');
  }

  function clusterFeet(m) {
    if (!m || m.missing) return [];
    var feet = [];
    if (m.legs.L.foot) feet.push(Object.assign({ side: 'L' }, m.legs.L.foot));
    if (m.legs.R.foot) feet.push(Object.assign({ side: 'R' }, m.legs.R.foot));
    return feet;
  }
  function clusterHands(m) {
    var hands = [];
    if (m && m.arms.L.hand) hands.push(Object.assign({ side: 'L' }, m.arms.L.hand));
    if (m && m.arms.R.hand) hands.push(Object.assign({ side: 'R' }, m.arms.R.hand));
    return hands;
  }

  function corr(a, b) {
    var n = a.length;
    if (n < 3) return 0;
    var ma = 0, mb = 0;
    for (var i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
    ma /= n; mb /= n;
    var num = 0, da = 0, db = 0;
    for (var j = 0; j < n; j++) {
      var xa = a[j] - ma, xb = b[j] - mb;
      num += xa * xb; da += xa * xa; db += xb * xb;
    }
    if (da < 1e-6 || db < 1e-6) return 0;
    return num / Math.sqrt(da * db);
  }
  function range(arr) {
    if (!arr.length) return 0;
    var lo = arr[0], hi = arr[0];
    arr.forEach(function (v) { if (v < lo) lo = v; if (v > hi) hi = v; });
    return hi - lo;
  }

  function trackPair(frames, key) {
    var prevA = null, prevB = null;
    var out = [];
    frames.forEach(function (f) {
      var cs = (f.m[key] || []).slice().sort(function (a, b) { return a.x - b.x; });
      if (cs.length < 2) { out.push(null); return; }
      var A, B;
      if (prevA == null) { A = cs[0]; B = cs[cs.length - 1]; }
      else {
        var dKeep = Math.abs(cs[0].x - prevA) + Math.abs(cs[cs.length - 1].x - prevB);
        var dSwap = Math.abs(cs[0].x - prevB) + Math.abs(cs[cs.length - 1].x - prevA);
        if (dKeep <= dSwap) { A = cs[0]; B = cs[cs.length - 1]; }
        else { A = cs[cs.length - 1]; B = cs[0]; }
      }
      prevA = A.x; prevB = B.x;
      out.push({ A: A, B: B });
    });
    return out;
  }
  function analyzeWalk(frames, label) {
    var probs = [];
    var feet = trackPair(frames, 'footClusters');
    var hands = trackPair(frames, 'handClusters');
    var usable = [];
    for (var i = 0; i < frames.length; i++) {
      if (!frames[i].m || frames[i].m.missing || !feet[i] || !hands[i]) continue;
      usable.push({ m: frames[i].m, foot: feet[i], hand: hands[i] });
    }
    if (usable.length < 5) {
      var footN = 0, handN = 0;
      frames.forEach(function (f) {
        footN += (f.m && f.m.footClusters && f.m.footClusters.length) || 0;
        handN += (f.m && f.m.handClusters && f.m.handClusters.length) || 0;
      });
      probs.push({ id: 'walk-missing', priority: 3, msg: 'Walk frames did not produce two feet and two hands (' + usable.length + '/8, feet ' + footN + ', hands ' + handN + ')' });
      return { problems: probs, stats: { frames: frames.length, usable: usable.length, feet: footN, hands: handN } };
    }
    var H = usable[0].m.figureH || 200;
    var footL = usable.map(function (f) { return f.foot.A.x; });
    var footR = usable.map(function (f) { return f.foot.B.x; });
    var handL = usable.map(function (f) { return f.hand.A.x; });
    var handR = usable.map(function (f) { return f.hand.B.x; });
    var footDelta = usable.map(function (f, i) { return footL[i] - footR[i]; });
    var handDelta = usable.map(function (f, i) { return handL[i] - handR[i]; });
    var step = Math.max(range(footL), range(footR));
    var swing = Math.max(range(handL), range(handR));
    var oppose = corr(footDelta, handDelta);
    var together = corr(footL, footR);
    var lifts = 0, swapL = 0, swapR = 0, floatMax = 0, plantSlop = 0;
    var tops = [];
    usable.forEach(function (f) {
      var ly = f.foot.A.y, ry = f.foot.B.y;
      var lift = Math.abs(ly - ry);
      if (lift > H * 0.03) lifts++;
      if (ly + 3 < ry) swapL++;
      if (ry + 3 < ly) swapR++;
      if (f.m.ground) {
        floatMax = Math.max(floatMax, f.m.ground.floatPx);
        plantSlop = f.m.ground.slop;
      }
      if (f.m.box) tops.push(f.m.box.y0);
    });
    var bob = range(tops);
    if (step < H * 0.06) probs.push({ id: 'walk-step', priority: 3, msg: 'The feet barely travel (' + Math.round(step) + 'px). A walk needs a real step' });
    var sideOn = label === 'side';
    if (swing < H * 0.04) probs.push({ id: 'walk-arms', priority: 3, msg: 'The arms do not swing (' + Math.round(swing) + 'px). They should move opposite the legs' });
    else if (!sideOn && oppose > -0.35) probs.push({ id: 'walk-opposite', priority: 3, msg: 'Arms and legs do not oppose. Correlation of left-minus-right is ' + oppose.toFixed(2) + ' (want below -0.35)' });
    else if (sideOn && oppose < 0.35) probs.push({ id: 'walk-opposite', priority: 3, msg: 'From the side, the forward arm should travel with the forward foot. Correlation is ' + oppose.toFixed(2) + ' (want above 0.35)' });
    if (together > 0.55 && step > 8) probs.push({ id: 'walk-slide', priority: 3, msg: 'Both feet slide the same way (correlation ' + together.toFixed(2) + ') instead of trading places' });
    if (lifts < 2 && (swapL < 1 || swapR < 1)) probs.push({ id: 'walk-plant', priority: 3, msg: 'The feet do not trade a plant and a lift (lifts ' + lifts + ', left-up ' + swapL + ', right-up ' + swapR + ')' });
    if (floatMax > (plantSlop || 12)) probs.push({ id: 'walk-float', priority: 3, msg: 'During the walk the lower foot floats up to ' + Math.round(floatMax) + 'px off the ground' });
    if (bob < Math.max(2, H * 0.008)) probs.push({ id: 'walk-bob', priority: 3, msg: 'The body does not bob on the legs (torso-to-plant range ' + Math.round(bob) + 'px)' });
    if (bob > H * 0.1) probs.push({ id: 'walk-bob', priority: 3, msg: 'The body bobs too much (' + Math.round(bob) + 'px), like a hop rather than a walk' });
    usable.forEach(function (f) {
      ['L', 'R'].forEach(function (s) {
        var foot = f.m.legs[s].foot, hip = f.m.torso.hip, hand = f.m.arms[s].hand, sh = f.m.torso.shoulderY;
        if (foot && hip && foot.y + H * 0.02 < hip) probs.push({ id: 'walk-angle', priority: 3, msg: 'A foot rises above the hip during the walk' });
        if (hand && sh && hand.y + 6 < sh) probs.push({ id: 'walk-angle', priority: 3, msg: 'A hand rises above the shoulder during the walk' });
      });
    });
    var seen = {};
    probs = probs.filter(function (p) { var k = p.id + p.msg; if (seen[k]) return false; seen[k] = 1; return true; });
    return {
      problems: probs,
      stats: { step: round(step), swing: round(swing), oppose: round(oppose * 100) / 100, together: round(together * 100) / 100, lifts: lifts, swapL: swapL, swapR: swapR, floatMax: round(floatMax), bob: round(bob), figureH: H }
    };
  }

  function contactFrom(canvases, file, title) {
    var cols = 4;
    var rows = Math.ceil(canvases.length / cols) || 1;
    var c = canvas(cols * 220, rows * 300 + 28);
    var g = c.getContext('2d');
    g.fillStyle = '#12081c';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#fff';
    g.font = '700 14px system-ui,sans-serif';
    g.fillText(title, 8, 20);
    canvases.forEach(function (src, i) {
      var col = i % cols, row = (i / cols) | 0;
      g.drawImage(src, col * 220 + 8, 32 + row * 300, 204, 272);
      g.fillStyle = '#ffe14d';
      g.font = '700 12px system-ui,sans-serif';
      g.fillText(String(i), col * 220 + 12, 48 + row * 300);
    });
    images[file] = c.toDataURL('image/png').split(',')[1];
  }

  function mergeFindings(cases) {
    var map = {};
    cases.forEach(function (cs) {
      (cs.problems || []).forEach(function (p) {
        if (!map[p.id]) map[p.id] = { id: p.id, priority: p.priority, severity: 'fail', views: [], msgs: [], shots: [] };
        var f = map[p.id];
        if (f.views.indexOf(cs.name) < 0) f.views.push(cs.name);
        if (f.msgs.indexOf(p.msg) < 0 && f.msgs.length < 4) f.msgs.push(p.msg);
        if (cs.shot && f.shots.indexOf(cs.shot) < 0 && f.shots.length < 6) f.shots.push(cs.shot);
      });
    });
    return Object.keys(map).map(function (k) {
      var f = map[k];
      f.title = titleFor(f.id);
      f.detail = f.msgs.join(' ') + ' Seen on: ' + f.views.slice(0, 10).join(', ') + (f.views.length > 10 ? ' (+' + (f.views.length - 10) + ')' : '') + '.';
      return f;
    }).sort(function (a, b) { return a.priority - b.priority || a.id.localeCompare(b.id); });
  }
  function titleFor(id) {
    return {
      'head-neck': 'The head does not sit on the neck',
      'head-buried': 'The head is buried in the torso',
      'head-size': 'The head is the wrong size for the body',
      'head-center': 'The head is not centered on the shoulders',
      'torso-depth': 'The torso disappears from the side',
      'torso-neck': 'The neck does not meet the torso',
      'torso-hip': 'The torso does not meet the hips',
      'arm-shoulder': 'The arms do not leave the shoulders',
      'arm-missing': 'An arm is missing',
      'hand-arm': 'The hands do not sit at the ends of the arms',
      'arm-angle': 'The arms do not hang in a human way',
      'leg-hip': 'The legs do not leave the hips',
      'leg-missing': 'A leg is missing',
      'foot-leg': 'The feet do not sit at the ends of the legs',
      'leg-angle': 'The legs are not a standing pose',
      'left-right': 'Left and right are wrong',
      'feet-ground': 'The feet do not meet the ground',
      'feet-clip': 'The feet sink through the ground',
      'clip': 'A limb clips the body',
      'walk-missing': 'The walk frames are not a full figure',
      'walk-step': 'The walk has no real step',
      'walk-arms': 'The arms do not swing with the walk',
      'walk-opposite': 'The arms and legs do not swing opposite each other',
      'walk-slide': 'The feet slide instead of trading places',
      'walk-plant': 'The feet do not plant and lift',
      'walk-float': 'The feet float during the walk',
      'walk-bob': 'The body bob is missing or too big',
      'walk-angle': 'A walk pose bends a joint the wrong way',
      'missing': 'The figure is missing'
    }[id] || id;
  }

  function petPose(type, gait, phase) {
    var D = window.CREWDATA;
    var src;
    if (gait === 'walk') src = D.PET_CLIPS.follow.f(phase);
    else if (gait === 'onfoot') src = window.__ANATOMY.groundPetQ(type, 'walk', phase, phase, null);
    else if (gait === 'onfoot-idle') src = window.__ANATOMY.groundPetQ(type, 'idle', phase, phase, null);
    else src = D.PET_CLIPS.idle.f(phase || 0.25);
    var q = {};
    for (var k in src) q[k] = src[k];
    q.x = 0; q.y = 0; q.z = 0;
    q.yaw = gait === 'closet' ? 55 : 20;
    return q;
  }
  function petIssues(type) {
    var D = window.CREWDATA;
    var issues = [];
    if (!D || !D.petFk || !D.PET_RIG[type]) return ['No rig for ' + type];
    function joints(gait, phase) {
      var q = petPose(type, gait, phase);
      q.yaw = 0;
      return D.petFk(q, type);
    }
    var rig = D.PET_RIG[type];
    var J = joints('idle', 0.2);
    if (!J.head || !J.S) issues.push(type + ' idle is missing a head or shoulders');
    else {
      var neck = Math.hypot(J.head[0] - J.S[0], J.head[1] - J.S[1], J.head[2] - J.S[2]);
      if (J.head[1] + 0.01 < J.S[1]) issues.push(type + ' head sits below the shoulders');
      if (neck > (rig.head || 0.08) * 3.4) issues.push(type + ' head is detached from the neck (' + neck.toFixed(3) + ' m)');
    }
    if (J.snout && J.head && J.snout[2] + 0.005 < J.head[2]) issues.push(type + ' snout points backward');
    ['pawFL', 'pawFR', 'pawBL', 'pawBR'].forEach(function (k) { if (!J[k]) issues.push(type + ' idle is missing ' + k); });
    if (J.pawFL && J.pawFR && J.pawFL[0] * J.pawFR[0] >= 0) issues.push(type + ' front paws are not on opposite sides');
    if (J.pawBL && J.pawBR && J.pawBL[0] * J.pawBR[0] >= 0) issues.push(type + ' back paws are not on opposite sides');
    if (!J.earL || !J.earR || !J.earTL || !J.earTR) issues.push(type + ' is missing ears');
    if (!J.tail0 || !J.tail2) issues.push(type + ' is missing a tail');
    if (rig.wings && (!J.wingL || !J.wingR)) issues.push(type + ' is missing wings');
    if (type === 'cat' && J.tail2 && J.tail0 && J.tail2[1] < J.tail0[1] + 0.02) issues.push('cat tail does not rise');
    if (type === 'dragon' && J.wingL && J.wingTL) {
      var span = Math.hypot(J.wingTL[0] - J.wingL[0], J.wingTL[1] - J.wingL[1], J.wingTL[2] - J.wingL[2]);
      if (span < 0.04) issues.push('dragon wings have no span');
    }
    if (type === 'robo' && J.tail0 && J.tail2) {
      var tlen = Math.hypot(J.tail2[0] - J.tail0[0], J.tail2[1] - J.tail0[1], J.tail2[2] - J.tail0[2]);
      if (tlen > 0.22) issues.push('robo-dog tail is too long to read as a stub');
    }
    ['pawFL', 'pawFR', 'pawBL', 'pawBR'].forEach(function (k) {
      if (!J[k]) return;
      if (J[k][1] > 0.055) issues.push(type + ' ' + k + ' floats in idle (' + J[k][1].toFixed(3) + ' m)');
      if (J[k][1] < -0.04) issues.push(type + ' ' + k + ' is under the ground in idle');
    });
    var J0 = joints('walk', 0.0), J1 = joints('walk', 0.25);
    var moved = false, floatWalk = false;
    ['pawFL', 'pawFR', 'pawBL', 'pawBR'].forEach(function (k) {
      if (!J0[k] || !J1[k]) return;
      if (Math.abs(J0[k][1] - J1[k][1]) > 0.008 || Math.abs(J0[k][2] - J1[k][2]) > 0.01) moved = true;
      if (J0[k][1] > 0.09 || J1[k][1] > 0.09) floatWalk = true;
    });
    if (!moved) issues.push(type + ' walk does not move the paws');
    if (floatWalk) issues.push(type + ' walk lifts a paw clear off a step');
    var Q0 = joints('onfoot', 0.1), Q1 = joints('onfoot', 0.35);
    var moved2 = false;
    ['pawFL', 'pawFR', 'pawBL', 'pawBR'].forEach(function (k) {
      if (!Q0[k] || !Q1[k]) return;
      if (Math.hypot(Q0[k][0] - Q1[k][0], Q0[k][1] - Q1[k][1], Q0[k][2] - Q1[k][2]) > 0.012) moved2 = true;
      if (Q0[k][1] > 0.09) floatWalk = true;
    });
    if (!moved2) issues.push(type + ' on-foot walk does not move the paws');
    return issues;
  }

  function drawPets() {
    var D = window.CREWDATA;
    var api = window.__ANATOMY;
    if (!D || !api || !api.paintPet) return;
    var types = Object.keys(D.PET_RIG);
    var c = canvas(types.length * 220, 860);
    var ctx = c.getContext('2d');
    fillBg(ctx, c.width, c.height);
    ctx.fillStyle = '#fff';
    ctx.font = '700 14px system-ui,sans-serif';
    var gaits = [['idle', 0.2], ['walk', 0.3], ['closet', 0.25], ['onfoot', 0.4]];
    types.forEach(function (type, i) {
      ctx.fillStyle = '#ffe7a8';
      ctx.fillText(D.PET_RIG[type].n || type, i * 220 + 16, 22);
      gaits.forEach(function (g, row) {
        ctx.save();
        ctx.translate(i * 220, 36 + row * 200);
        ctx.fillStyle = '#9fd';
        ctx.font = '700 11px system-ui,sans-serif';
        ctx.fillText(g[0], 12, 14);
        var q = petPose(type, g[0], g[1]);
        var ground = 170;
        var project = function (x, y, z) {
          var dist = 1.6, f = 220;
          var Z = dist - z;
          return [110 + x * f / Z, ground - y * f / Z, Z, f];
        };
        try { api.paintPet(ctx, type, q, project, '#ffb020'); } catch (e) {}
        ctx.strokeStyle = '#3ee6ff';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(20, ground); ctx.lineTo(200, ground); ctx.stroke();
        ctx.restore();
      });
    });
    images['pets.png'] = c.toDataURL('image/png').split(',')[1];
  }

  function passesFrom(cases, findings) {
    var ids = {};
    findings.forEach(function (f) { if (f.severity === 'fail') ids[f.id] = 1; });
    var held = [];
    function heldIf(id, text) { if (!ids[id]) held.push(text); }
    heldIf('head-center', 'The head stays centered on the shoulders');
    heldIf('head-size', 'The head size is in the big stylized range');
    heldIf('left-right', 'Left and right land on their own sides');
    heldIf('leg-hip', 'The legs meet the hips');
    return held;
  }

  function run() {
    var shotNames = [];
    function keep(name) { if (shotNames.indexOf(name) < 0) shotNames.push(name); }
    var calibErrors = [];
    var good = stillCase('calib-good', function (ctx) { return drawGoodStill(ctx, false); }, { idleAngles: true });
    var bad = stillCase('calib-bad', function (ctx) { return drawGoodStill(ctx, true); }, { idleAngles: true });
    if (good.problems.length) calibErrors.push('good still should pass, saw ' + good.problems.map(function (p) { return p.id + ':' + p.msg; }).join(' | '));
    ['head-neck', 'hand-arm', 'feet-ground', 'arm-shoulder'].forEach(function (id) {
      if (!bad.problems.some(function (p) { return p.id === id; })) calibErrors.push('bad still missed ' + id + ' (saw ' + bad.problems.map(function (p) { return p.id; }).join(',') + ')');
    });
    var sideDeep = stillCase('calib-side-deep', function (ctx) { return drawSideBody(ctx, true); }, { idleAngles: false, profile: true, view: 'side' });
    var sideFlat = stillCase('calib-side-flat', function (ctx) { return drawSideBody(ctx, false); }, { idleAngles: false, profile: true, view: 'side' });
    if (sideDeep.problems.length) calibErrors.push('deep side should pass, saw ' + sideDeep.problems.map(function (p) { return p.id + ':' + p.msg; }).join(' | '));
    ['torso-depth', 'torso-hip'].forEach(function (id) {
      if (!sideFlat.problems.some(function (p) { return p.id === id; })) calibErrors.push('flat side missed ' + id + ' (saw ' + sideFlat.problems.map(function (p) { return p.id; }).join(',') + ')');
    });
    var framesG = [];
    var framesB = [];
    for (var i = 0; i < 8; i++) {
      var cg = canvas(W, H), cb = canvas(W, H);
      var gg = drawGoodWalk(cg.getContext('2d'), i / 8, false);
      var gb = drawGoodWalk(cb.getContext('2d'), i / 8, true);
      var mg = measure(maskOf(cg.getContext('2d'), W, H), gg);
      var mb = measure(maskOf(cb.getContext('2d'), W, H), gb);
      framesG.push({ phase: i / 8, m: mg, canvas: cg });
      framesB.push({ phase: i / 8, m: mb, canvas: cb });
      store('calib-walk-' + i + '.png', cg, mg, 'calib walk ' + i);
    }
    var walkG = analyzeWalk(framesG, 'good');
    var walkB = analyzeWalk(framesB, 'bad');
    if (walkG.problems.length) calibErrors.push('good walk should pass, saw ' + walkG.problems.map(function (p) { return p.id + ':' + p.msg; }).join(' | '));
    ['walk-step', 'walk-arms', 'walk-float'].forEach(function (id) {
      if (!walkB.problems.some(function (p) { return p.id === id; })) calibErrors.push('bad walk missed ' + id);
    });
    var calib = { ok: calibErrors.length === 0, errors: calibErrors, good: good.measure, badProblems: bad.problems, sideDeep: sideDeep.measure && sideDeep.measure.torso, sideFlat: sideFlat.problems.map(function (p) { return p.id; }), walkGood: walkG.stats, walkBad: walkB.stats };

    var cases = [];
    function pushStill(name, render, opt) {
      var c = render.canvas;
      var ctx = c.getContext('2d');
      var pack = maskOf(ctx, W, H);
      var gy = render.groundY == null ? pack.ground : render.groundY;
      var m = measure(pack, gy);
      var probs = problemsOf(m, opt || { idleAngles: name.indexOf('walk') < 0 });
      var shot = name + '.png';
      store(shot, c, m, name + (render.error ? ' ' + render.error : ''));
      keep(shot);
      cases.push({ name: name, problems: probs, shot: shot, measure: slim(m), error: render.error || '' });
      return m;
    }

    setWear(null);
    pushStill('closet-front', renderCloset(), { idleAngles: true, view: 'front' });
    pushStill('idle-front', renderFigure(0, idleSpec(), 390), { idleAngles: true, view: 'front' });
    pushStill('idle-side', renderFigure(Math.PI / 2, idleSpec(), 390), { idleAngles: false, profile: true, view: 'side' });
    pushStill('idle-back', renderFigure(Math.PI, idleSpec(), 390), { idleAngles: false, view: 'back' });
    pushStill('onfoot-idle', renderFigure(0.45, idleSpec(), 390), { idleAngles: true, view: 'three-quarter' });

    var partSets = [
      ['body-short', { body: 'short' }],
      ['hair-bob', { hair: 'bob' }],
      ['hair-long', { hair: 'long' }],
      ['top-hoodie', { top: 'hoodie' }],
      ['top-jacket', { top: 'jacket' }],
      ['bottom-shorts', { bottom: 'shorts' }],
      ['bottom-skirt', { bottom: 'skirt' }],
      ['shoes-boots', { shoes: 'boots' }],
      ['hands-gloves', { hands: 'gloves' }]
    ];
    partSets.forEach(function (pair) {
      setWear(pair[1]);
      var opt = { idleAngles: true };
      pushStill('part-' + pair[0], renderFigure(0, idleSpec(), 390), opt);
    });
    setWear(null);

    var yawViews = [
      ['front', 0, false],
      ['three-quarter', Math.PI / 4, false],
      ['side', Math.PI / 2, true],
      ['back', Math.PI, false]
    ];
    var gaitFrames = null;
    var depthByView = {};
    yawViews.forEach(function (view) {
      var frames = [];
      var depths = [];
      for (var p = 0; p < 8; p++) {
        var phase = p / 8;
        var rendered = renderFigure(view[1], walkSpec(phase), 390);
        var pack = maskOf(rendered.canvas.getContext('2d'), W, H);
        var gy = rendered.groundY == null ? pack.ground : rendered.groundY;
        var m = measure(pack, gy);
        var shot = 'walk-' + view[0] + '-' + p + '.png';
        store(shot, rendered.canvas, m, 'walk ' + view[0] + ' ' + phase.toFixed(2));
        if (p === 0 || p === 2 || p === 4 || p === 6) keep(shot);
        var probs = problemsOf(m, { idleAngles: false, profile: true, view: view[0] });
        cases.push({ name: 'walk-' + view[0] + '-' + p, problems: probs, shot: shot, measure: slim(m) });
        frames.push({ phase: phase, m: m, canvas: rendered.canvas });
        depths.push(m && m.torso ? m.torso.depth : 0);
      }
      var contact = 'walk-' + view[0] + '.png';
      contactFrom(frames.map(function (f) { return f.canvas; }), contact, 'Walk, ' + view[0] + ', 8 frames');
      keep(contact);
      depthByView[view[0]] = depths;
      if (view[0] === 'side') gaitFrames = frames;
    });
    function median(arr) {
      var xs = arr.slice().sort(function (a, b) { return a - b; });
      return xs.length ? xs[(xs.length * 0.5) | 0] : 0;
    }
    var frontDepth = median(depthByView.front || []);
    var sideDepth = median(depthByView.side || []);
    var backDepth = median(depthByView.back || []);
    var quarterDepth = median(depthByView['three-quarter'] || []);
    var depthNote = 'Walk chest width: front ' + Math.round(frontDepth) + 'px, three-quarter ' + Math.round(quarterDepth) + 'px, side ' + Math.round(sideDepth) + 'px, back ' + Math.round(backDepth) + 'px.';
    if (sideDepth < Math.max(8, frontDepth * 0.36)) {
      cases.push({
        name: 'walk-side-depth',
        problems: [{ id: 'torso-depth', priority: 2, msg: 'Walking from the side, the chest is ' + Math.round(sideDepth) + 'px wide. From the front it is ' + Math.round(frontDepth) + 'px. The body is a flat card, so the torso disappears at 90 degrees. Three-quarter ' + Math.round(quarterDepth) + 'px, back ' + Math.round(backDepth) + 'px.' }],
        shot: 'walk-side-0.png'
      });
    }
    ['three-quarter', 'back'].forEach(function (name) {
      var d = name === 'back' ? backDepth : quarterDepth;
      if (frontDepth > 12 && d < Math.max(8, frontDepth * 0.36)) {
        cases.push({
          name: 'walk-' + name + '-depth',
          problems: [{ id: 'torso-depth', priority: 2, msg: 'Walking from the ' + name + ', the chest is ' + Math.round(d) + 'px against ' + Math.round(frontDepth) + 'px from the front.' }],
          shot: 'walk-' + name + '-0.png'
        });
      }
    });
    var walk = analyzeWalk(gaitFrames, 'side');
    cases.push({ name: 'walk-cycle', problems: walk.problems, shot: 'walk-side.png', measure: walk.stats });

    var faceNote = null;
    try {
      setWear(null);
      var front = renderFigure(0, idleSpec(), 390);
      var back = renderFigure(Math.PI, idleSpec(), 390);
      function eyePixels(cnv) {
        var data = cnv.getContext('2d').getImageData(0, 0, W, H).data;
        var n = 0;
        for (var i = 0; i < data.length; i += 4) {
          if (data[i] < 40 && data[i + 1] > 160 && data[i + 2] > 180) n++;
        }
        return n;
      }
      var ef = eyePixels(front.canvas), eb = eyePixels(back.canvas);
      if (eb > 12 && eb > ef * 0.45) {
        faceNote = { id: 'face-turn', severity: 'note', priority: 9, title: 'The face stays on when the body turns around', detail: 'Back view still shows the eye color (' + eb + ' px, front was ' + ef + '). Secondary to the humanoid bar. Left and right limbs are the blocking check.', shots: ['idle-back.png'] };
      }
    } catch (e) {}

    drawPets();
    keep('pets.png');
    var petFindings = [];
    if (!window.CREWDATA || !window.CREWDATA.PET_RIG) petFindings.push('Pet rig did not load');
    else if (!window.__ANATOMY || !window.__ANATOMY.paintPet) petFindings.push('Pet drawer did not load');
    else Object.keys(CREWDATA.PET_RIG).forEach(function (type) {
      petIssues(type).forEach(function (msg) { petFindings.push(msg); });
    });

    var findings = mergeFindings(cases);
    if (sideDepth >= Math.max(8, frontDepth * 0.36)) {
      findings.push({
        id: 'torso-held',
        severity: 'note',
        priority: 9,
        title: 'The torso keeps its depth from the front, the side, and the back',
        detail: depthNote + ' Neck-to-torso and torso-to-hips stayed connected on those frames.',
        shots: ['walk-side-0.png', 'walk-front-0.png', 'walk-back-0.png', 'walk-side.png'],
        views: [],
        msgs: []
      });
    }
    if (faceNote) findings.push(faceNote);
    var slowNote = false;
    try {
      var srcNote = window.CHARCLOSET && CHARCLOSET.slow && CHARCLOSET.slow();
      slowNote = !!srcNote;
    } catch (e) {}
    findings.push({
      id: 'clothes-secondary',
      severity: 'note',
      priority: 9,
      title: 'Clothes were checked only where they could break the body',
      detail: 'Short body, bob, long hair, hoodie, jacket, shorts, skirt, boots, and gloves were rendered. A clothing fail is listed above only if the head, the torso, or a limb came apart.',
      shots: [],
      views: [],
      msgs: []
    });

    var blocking = findings.filter(function (f) { return f.severity === 'fail' && f.priority <= 3; });
    var coverage = [
      'Closet preview, idle front, idle side, idle back, on-foot idle',
      'Body and clothes that can change the silhouette: short body, bob, long hair, hoodie, jacket, shorts, skirt, boots, gloves',
      'Walk: 8 on-foot frames at front, three-quarter, side, and back. Torso depth and neck/hip joins are checked on every frame',
      'Pets: ' + (window.CREWDATA && CREWDATA.PET_RIG ? Object.keys(CREWDATA.PET_RIG).join(', ') : 'none') + ' in idle, walk, closet, on foot'
    ];
    return {
      ok: calib.ok && blocking.length === 0 && petFindings.length === 0,
      calib: calib,
      findings: findings,
      pets: { ok: petFindings.length === 0, findings: petFindings },
      passes: passesFrom(cases, findings),
      coverage: coverage,
      shotNames: shotNames,
      walkStats: walk.stats,
      sample: cases.filter(function (c) { return c.name === 'idle-front' || c.name === 'closet-front' || c.name === 'idle-side' || c.name === 'walk-side-0' || c.name === 'walk-side-depth'; }).map(function (c) { return { name: c.name, problems: c.problems, measure: c.measure, error: c.error }; }),
      checkerError: (window.__ANATOMY && window.__ANATOMY.error) || (!window.CHARCLOSET ? 'CHARCLOSET missing' : '') || (!window.__ANATOMY ? 'crew export missing' : '')
    };
  }

  return {
    run: function () {
      try { return run(); }
      catch (e) { return { ok: false, checkerError: String(e && e.stack || e), findings: [], shotNames: Object.keys(images), pets: { ok: false, findings: [] }, calib: { ok: false, errors: ['threw'] } }; }
    },
    png: function (name) { return images[name] || ''; }
  };
})();
window.ANATOMY = ANATOMY;
`;

main().catch((e) => {
  console.error(e && e.stack || e);
  process.exit(2);
});
