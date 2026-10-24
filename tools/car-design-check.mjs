#!/usr/bin/env node
/**
 * 370Z design check. Test-only. Ships nothing into the game.
 *
 * Reviews the player 370Z and the traffic copy against docs/CAR-DESIGN-CHECK.md.
 * Kid App world.html only. Never opens adult index.html.
 *
 *   node tools/car-design-check.mjs --review --out test-results/car-design-check
 *   node tools/car-design-check.mjs --review --root /path/to/tree --label pr-78
 *
 * Exit 0 pass, 1 design fail, 2 checker failure.
 */
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { spawn, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME || 'google-chrome';
const MARKER = '<!-- CAR-DESIGN-CHECK -->';

const VIEWS = [
  { id: 'rear', title: 'REAR', az: Math.PI, el: 0.20, dist: 11, range: 'close', steer: 0 },
  { id: 'front', title: 'FRONT', az: 0, el: 0.22, dist: 12, range: 'close', steer: 0.45 },
  { id: 'side', title: 'SIDE', az: Math.PI / 2, el: 0.18, dist: 12, range: 'close', steer: 0 },
  { id: 'three', title: 'THREE-QUARTER', az: Math.PI - 0.7, el: 0.30, dist: 13, range: 'close', steer: 0.45 },
  { id: 'rear', title: 'REAR', az: Math.PI, el: 0.22, dist: 260, range: 'far', steer: 0 },
  { id: 'front', title: 'FRONT', az: 0, el: 0.22, dist: 260, range: 'far', steer: 0 },
  { id: 'side', title: 'SIDE', az: Math.PI / 2, el: 0.18, dist: 260, range: 'far', steer: 0 },
  { id: 'three', title: 'THREE-QUARTER', az: Math.PI - 0.7, el: 0.30, dist: 280, range: 'far', steer: 0 }
];

function parseArgs(argv) {
  const out = { root: path.resolve(HERE, '..'), out: '', port: 0, label: '', review: false, staticOnly: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root') out.root = path.resolve(argv[++i]);
    else if (a === '--out') out.out = path.resolve(argv[++i]);
    else if (a === '--port') out.port = Number(argv[++i]);
    else if (a === '--label') out.label = argv[++i];
    else if (a === '--review') out.review = true;
    else if (a === '--static-only') out.staticOnly = true;
    else if (a === '--help') out.help = true;
    else throw new Error('Unknown arg ' + a);
  }
  if (!out.out) out.out = path.join(out.root, 'test-results', 'car-design-check');
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

function readText(root, rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8');
}

function staticScan(root) {
  const findings = [];
  const traffic = readText(root, 'world/traffic.js');
  const tune = readText(root, 'shared/traffic-tune.js');
  const draw = readText(root, 'shared/car-draw.js');
  const garage = readText(root, 'world/garage.js') + '\n' + readText(root, 'world/garagez.js');
  const paint = readText(root, 'world/neon-paint.js');
  const spriteMatch = tune.match(/spritePx:\s*(\d+)/);
  const spritePx = spriteMatch ? Number(spriteMatch[1]) : 0;
  const drawBody = traffic.slice(traffic.indexOf('function drawOne'));
  const usesCloseSprite = /paintCar\s*\(|blit\s*\(/.test(drawBody);
  const wheelFn = /function\s+drawWheels\s*\(/.test(traffic);
  const wheelCall = /drawWheels\s*\(/.test(drawBody);
  const wheelPxMatch = traffic.match(/cv\.width\s*=\s*cv\.height\s*=\s*(\d+)/);
  const wheelPx = wheelPxMatch ? Number(wheelPxMatch[1]) : 0;
  const shadow = [];
  // Brush glow in the paint studio is not the car body. Only the player sprite
  // and the traffic copy are on this bar.
  for (const [name, src] of [['world/traffic.js', traffic], ['shared/car-draw.js', draw]]) {
    const re = /shadowBlur\s*=\s*([^;\n]+)/g;
    let m;
    while ((m = re.exec(src))) {
      const v = String(m[1]).trim();
      if (v !== '0') shadow.push(name + ' sets shadowBlur to ' + v);
    }
  }
  if (usesCloseSprite && spritePx && spritePx < 256) {
    findings.push({
      rule: 3, severity: 'fail', id: 'bake-px',
      title: 'Close traffic bake is ' + spritePx + ' px',
      detail: 'shared/traffic-tune.js spritePx is ' + spritePx + '. A close copy of the 370Z has to be at least 256 px at the source. A 160 px bake reads smeared once the chase camera stretches it.'
    });
  }
  if (wheelFn && wheelCall) {
    findings.push({
      rule: 2, severity: 'fail', id: 'wheel-decal',
      title: 'Traffic wheels are screen-space cards',
      detail: 'world/traffic.js drawWheels composites a ' + (wheelPx || 'tiny') + ' px wheel picture in screen space' + (wheelPx ? ' (' + wheelPx + '×' + wheelPx + ')' : '') + '. The card faces the camera. Squashing it does not put a tire in the wheel well, and it does not steer about the vertical axle.'
    });
  }
  if (shadow.length) {
    findings.push({
      rule: 5, severity: 'fail', id: 'shadow-blur',
      title: 'Car draw uses shadowBlur',
      detail: shadow.join(' ')
    });
  }
  let indexTouched = false;
  try {
    const names = execFileSync('git', ['-C', root, 'diff', '--name-only', 'origin/main...HEAD'], { encoding: 'utf8' });
    indexTouched = names.split('\n').some((n) => n === 'index.html' || n.endsWith('/index.html'));
  } catch (e) { /* detached tree */ }
  if (indexTouched) {
    findings.push({
      rule: 0, severity: 'fail', id: 'adult-index',
      title: 'Adult index.html is in the diff',
      detail: 'This check does not approve edits to adult index.html. Kid App files only.'
    });
  }
  return {
    spritePx, usesCloseSprite, wheelDecal: !!(wheelFn && wheelCall), wheelPx, shadow, indexTouched, findings
  };
}

function startServer(root, port, shotDir) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/index.html' || url.pathname === '/index.html/') {
      res.writeHead(404); res.end('adult index is out of scope'); return;
    }
    if (url.pathname === '/__shot' && req.method === 'POST') {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const name = path.basename(String(body.name || 'shot.png'));
          fs.mkdirSync(shotDir, { recursive: true });
          fs.writeFileSync(path.join(shotDir, name), Buffer.from(body.b64 || '', 'base64'));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        } catch (e) {
          res.writeHead(400); res.end(String(e.message || e));
        }
      });
      return;
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/world.html';
    const file = path.normalize(path.join(root, rel));
    if (!file.startsWith(root)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing ' + rel); return; }
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function launchChrome(port) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zd-car-design-'));
  const args = [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
    '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist',
    '--no-first-run', '--disable-background-networking', '--disable-sync',
    '--mute-audio', '--hide-scrollbars', '--force-color-profile=srgb',
    '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    '--window-size=1280,720', 'about:blank'
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
        this.logs.push(msg.method + ' ' + JSON.stringify(msg.params).slice(0, 500));
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

async function evalJson(cdp, expression, timeout) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    timeout: timeout || 60000
  }, (timeout || 60000) + 5000);
  if (result.exceptionDetails) {
    const d = result.exceptionDetails;
    const text = (d.exception && d.exception.description) || d.text || JSON.stringify(d);
    throw new Error(text);
  }
  return result.result && result.result.value;
}

function fpsFail(fps) {
  if (!fps || fps.error || typeof fps.delta !== 'number') return null;
  const spread = (arr) => {
    if (!arr || !arr.length) return 0;
    return Math.max.apply(null, arr) - Math.min.apply(null, arr);
  };
  const noise = Math.max(spread(fps.samplesOn), spread(fps.samplesOff));
  fps.noise = +noise.toFixed(2);
  // SwiftShader frame time jumps around. A delta inside that spread is not a fail.
  if (fps.delta > 3.5 && fps.delta > noise) {
    return {
      rule: 5, severity: 'fail', id: 'fps-add',
      title: 'Twelve close copies add ' + fps.delta + ' ms',
      detail: 'Headless software GL, 4× CPU, five pairs. Traffic on median ' + fps.on + ' ms, off ' + fps.off + ' ms. Spread ' + fps.noise + ' ms. The gate is a stable delta above 3.5 ms.'
    };
  }
  return null;
}

function markdown(p) {
  const lines = [];
  lines.push('# 370Z design check');
  lines.push('');
  lines.push('Target `' + (p.branch || '') + '` `' + (p.sha || '').slice(0, 12) + '`' + (p.label ? ' · ' + p.label : ''));
  lines.push('');
  lines.push('Result: **' + (p.ok ? 'PASS' : 'FAIL') + '**');
  lines.push('');
  lines.push('Bar: `docs/CAR-DESIGN-CHECK.md`. Close copies match his 370Z from every angle. Wheels are real wheels. No 160 px bake. Far cars may be simpler. The frame stays cheap.');
  lines.push('');
  if (p.checkerError) {
    lines.push('Checker error: ' + p.checkerError);
    lines.push('');
  }
  const rules = [
    [1, 'Close shape, paint, and light'],
    [2, 'Wheels'],
    [3, 'Resolution'],
    [4, 'Far LOD'],
    [5, 'Frame cost']
  ];
  for (const [rule, title] of rules) {
    const items = (p.findings || []).filter((f) => f.rule === rule && f.severity === 'fail');
    lines.push('## ' + rule + '. ' + title);
    lines.push('');
    if (!items.length) lines.push(rule === 4 ? 'Far shots are recorded. A simpler shape is allowed there.' : 'Pass.');
    for (const f of items) {
      lines.push('- **' + f.title + '** `' + f.id + '`');
      lines.push('  ' + f.detail);
      if (f.shots && f.shots.length) lines.push('  Shots: ' + f.shots.map((s) => 'shots/' + s).join(', '));
    }
    lines.push('');
  }
  if (p.shots && p.shots.length) {
    lines.push('## Shots');
    lines.push('');
    lines.push('| View | Range | Result |');
    lines.push('| --- | --- | --- |');
    for (const s of p.shots) {
      const v = s.verdict || {};
      lines.push('| ' + s.id + ' | ' + s.range + ' | ' + (v.ok ? 'pass' : 'FAIL') + ' |');
    }
    lines.push('');
  }
  if (p.fps) {
    lines.push('## FPS probe');
    lines.push('');
    lines.push('Twelve close copies, cache warmed in ' + (p.fps.bakeMs || 0) + ' ms. Median frame ' + p.fps.on + ' ms with them, ' + p.fps.off + ' ms without. Delta ' + p.fps.delta + ' ms. Sample spread ' + (p.fps.noise != null ? p.fps.noise : 'n/a') + ' ms. Gate: a stable delta above 3.5 ms. Software GL, 4× CPU, five pairs. This is not a Galaxy measurement.');
    if (p.fps.noise != null && p.fps.delta <= p.fps.noise) {
      lines.push('The spread of the five pairs is larger than the delta, so this probe does not fail the frame.');
    }
    lines.push('');
  }
  if (p.gl) {
    lines.push('GL: ' + p.gl);
    lines.push('');
  }
  return lines.join('\n');
}

function commentBody(p) {
  const lines = [];
  lines.push(MARKER);
  lines.push('');
  lines.push('**370Z design check: ' + (p.ok ? 'PASS' : 'FAIL') + '**');
  lines.push('');
  lines.push('`' + (p.branch || '') + '` `' + (p.sha || '').slice(0, 12) + '`' + (p.label ? ' · ' + p.label : ''));
  lines.push('');
  const fails = (p.findings || []).filter((f) => f.severity === 'fail');
  if (!fails.length) lines.push('Close copies match his 370Z on shape, wheels, resolution, and frame cost. Far LODs are allowed to be simpler.');
  for (const f of fails) {
    lines.push('- **Rule ' + f.rule + ' — ' + f.title + '.** ' + f.detail);
  }
  lines.push('');
  lines.push('Sheets show his Z and the traffic copy in the same frame, then zoomed. Nearest-neighbor zoom keeps a coarse bake blocky.');
  lines.push('');
  if (p.shotNotes) {
    for (const n of p.shotNotes) lines.push(n);
  }
  lines.push('');
  lines.push('Standard: `docs/CAR-DESIGN-CHECK.md`. Checker: `node tools/car-design-check.mjs --review`.');
  return lines.join('\n');
}

function writeReport(dir, payload) {
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(payload, null, 2));
  fs.writeFileSync(path.join(dir, 'report.md'), markdown(payload));
  fs.writeFileSync(path.join(dir, 'comment.md'), commentBody(payload));
}

async function reviewVisual(root, shotDir) {
  const server = await startServer(root, 0, shotDir);
  const port = server.address().port;
  const debugPort = 9300 + Math.floor(Math.random() * 500);
  const chrome = launchChrome(debugPort);
  let cdp = null;
  try {
    const ver = await waitJson('http://127.0.0.1:' + debugPort + '/json/version', 80);
    cdp = new Cdp(ver.webSocketDebuggerUrl);
    await cdp.send('Target.setDiscoverTargets', { discover: true });
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { targetInfos } = await cdp.send('Target.getTargets', {});
    const page = (targetInfos || []).find((t) => t.targetId === targetId) || (targetInfos || []).find((t) => t.type === 'page');
    if (!page) throw new Error('no page target');
    const { webSocketDebuggerUrl } = await (await fetch('http://127.0.0.1:' + debugPort + '/json/list')).json().then((list) => {
      const hit = list.find((t) => t.id === page.targetId);
      if (!hit) throw new Error('page socket missing');
      return hit;
    });
    cdp.close();
    cdp = new Cdp(webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280, height: 720, deviceScaleFactor: 1, mobile: false
    });
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/world.html' });
    let pageState = '';
    for (let i = 0; i < 80; i++) {
      const probe = await cdp.send('Runtime.evaluate', {
        expression: '({state:document.readyState, render:typeof render, z:!!(window.ZD&&ZD.Xray)})',
        returnByValue: true
      });
      pageState = JSON.stringify(probe.result && probe.result.value);
      const v = probe.result && probe.result.value;
      if (v && v.state === 'complete' && v.render === 'function') break;
      await sleep(250);
    }
    if (!pageState.includes('complete')) throw new Error('world.html did not finish loading: ' + pageState);
    const harness = fs.readFileSync(path.join(HERE, 'car-design-browser.js'), 'utf8');
    await evalJson(cdp, harness, 20000);
    const boot = await evalJson(cdp, 'window.__CAR_DESIGN.boot()', 60000);
    if (!boot || !boot.ok) throw new Error((boot && boot.error) || 'boot failed');
    const shots = [];
    for (const view of VIEWS) {
      const arg = JSON.stringify(view);
      const metrics = await evalJson(cdp, 'window.__CAR_DESIGN.shot(' + arg + ')', 60000);
      if (!metrics) throw new Error('empty shot ' + view.range + ' ' + view.id);
      shots.push(metrics);
    }
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const fps = await evalJson(cdp, 'window.__CAR_DESIGN.fpsProbe()', 90000);
    try { await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }); } catch (e) {}
    return { boot, shots, fps, logs: cdp.logs.slice(-30) };
  } finally {
    if (cdp) cdp.close();
    try { chrome.child.kill('SIGKILL'); } catch (e) {}
    try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
    await new Promise((r) => server.close(r));
  }
}

function foldShots(staticInfo, visual) {
  const findings = staticInfo.findings.slice();
  const shots = (visual && visual.shots) || [];
  const shape = [];
  const light = [];
  const wheels = [];
  const res = [];
  for (const s of shots) {
    const v = s.verdict || { ok: true, reasons: [] };
    if (s.range === 'far') continue;
    if (v.ok) continue;
    const file = s.file || (s.range + '-' + s.id + '.png');
    for (const reason of v.reasons || []) {
      const row = { reason, file, id: s.id };
      if (/wheel|silver|card/i.test(reason)) wheels.push(row);
      else if (/bake|px|smear|edge/i.test(reason)) res.push(row);
      else if (/paint|light|flat/i.test(reason)) light.push(row);
      else shape.push(row);
    }
  }
  function add(rule, id, title, rows) {
    if (!rows.length) return;
    const have = findings.some((f) => f.id === id);
    const shots = [...new Set(rows.map((r) => r.file))];
    const detail = rows.map((r) => r.id + ': ' + r.reason).join(' ');
    if (have) {
      const f = findings.find((x) => x.id === id);
      f.shots = shots;
      if (detail && !f.detail.includes(rows[0].reason)) f.detail += ' ' + detail;
      return;
    }
    findings.push({ rule, severity: 'fail', id, title, detail, shots });
  }
  add(1, 'close-shape', 'Close copy does not match his Z', shape);
  add(1, 'close-light', 'Close copy is flat next to the showroom car', light);
  if (!staticInfo.wheelDecal) add(2, 'wheel-visual', 'Wheel marks face the camera', wheels);
  else {
    const f = findings.find((x) => x.id === 'wheel-decal');
    if (f) f.shots = [...new Set(wheels.map((w) => w.file))];
  }
  const resRows = res.filter((r) => !/too coarse/.test(r.reason) || !staticInfo.spritePx);
  add(3, 'bake-visual', 'Close picture is coarse on screen', resRows);
  const bake = findings.find((x) => x.id === 'bake-px');
  if (bake) {
    const files = [...new Set(res.map((r) => r.file).concat((bake.shots || [])))];
    bake.shots = files.filter(Boolean);
  }
  const fps = visual && visual.fps;
  const fpsFinding = fpsFail(fps);
  if (fpsFinding) findings.push(fpsFinding);
  // Static wheel/bake already cover the code. Drop a visual duplicate that only repeats them.
  const filtered = findings.filter((f) => {
    if (f.id === 'wheel-visual' && staticInfo.wheelDecal && (f.detail || '').length < 8) return false;
    return true;
  });
  return filtered;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('node tools/car-design-check.mjs --review [--root tree] [--out dir] [--label name]');
    return;
  }
  const commit = readCommit(args.root);
  const staticInfo = staticScan(args.root);
  const shotDir = path.join(args.out, 'shots');
  fs.mkdirSync(shotDir, { recursive: true });
  let visual = null;
  let checkerError = '';
  if (!args.staticOnly) {
    try {
      visual = await reviewVisual(args.root, shotDir);
    } catch (e) {
      checkerError = String(e && e.stack || e);
    }
  }
  const findings = checkerError && !visual
    ? staticInfo.findings
    : foldShots(staticInfo, visual);
  const designFail = findings.some((f) => f.severity === 'fail');
  const payload = {
    ok: !checkerError && !designFail,
    sha: commit.sha,
    branch: commit.branch,
    label: args.label,
    checkerError,
    findings,
    shots: visual ? visual.shots : [],
    fps: visual ? visual.fps : null,
    gl: visual && visual.boot ? visual.boot.gl : '',
    boot: visual ? visual.boot : null,
    static: {
      spritePx: staticInfo.spritePx,
      usesCloseSprite: staticInfo.usesCloseSprite,
      wheelDecal: staticInfo.wheelDecal,
      wheelPx: staticInfo.wheelPx
    },
    shotNotes: (visual && visual.shots || []).filter((s) => s.file).map((s) => {
      const v = s.verdict || {};
      return '- `' + s.file + '` ' + (s.range || '') + ' ' + (s.id || '') + ' — ' + (v.ok ? 'pass' : 'FAIL');
    })
  };
  writeReport(args.out, payload);
  console.log(markdown(payload));
  if (checkerError) process.exit(2);
  process.exit(payload.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e && e.stack || e);
  process.exit(2);
});
