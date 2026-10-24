#!/usr/bin/env node
/**
 * Adventure World anatomy bar, Milestone 0.
 * The Neon checker on cursor/anatomy-check-3de5 scores crew.js sprites only.
 * This applies that same numeric bar to the adventure renders:
 *   head 16–45% of the figure, on a neck, centered
 *   side / three-quarter / back chest at least 36% of the front
 *   walk: opposite arms and legs, a plant, a small bob
 *   Ellie 1.15–2.05 m with feet on the ground
 *   pug at or under her hip, feet on the ground, knee-to-waist
 *
 *   node tools/adventure-anatomy.mjs
 * Exit 0 pass, 1 fail, 2 checker bug.
 */
import { spawn } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';

const require = createRequire('/tmp/adv-deps/package.json');
const { PNG } = require('pngjs');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'test-results', 'adventure-m0');
const PORT = 8767;
const CDP = 9335;

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/adventure.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing'); return; }
      const ext = path.extname(file);
      const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'text/javascript' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.waiters = [];
    this.logs = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
        else p.resolve(msg.result);
      }
      if (msg.method) {
        this.waiters = this.waiters.filter((w) => {
          if (w.method !== msg.method) return true;
          w.resolve(msg.params);
          return false;
        });
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails || {};
        this.logs.push(d.text + ' ' + (d.exception && d.exception.description || ''));
      }
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  once(method, ms) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), ms);
      this.waiters.push({ method, resolve: (p) => { clearTimeout(timer); resolve(p); } });
    });
  }
  async eval(expression) {
    const ev = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (ev.exceptionDetails) throw new Error(ev.exceptionDetails.text + ' ' + JSON.stringify(ev.exceptionDetails.exception || {}));
    return ev.result && ev.result.value;
  }
}

function analyze(png) {
  const w = png.width;
  const h = png.height;
  const src = png.data;
  const bgR = src[0];
  const bgG = src[1];
  const bgB = src[2];
  const m = new Uint8Array(w * h);
  let x0 = w, y0 = h, x1 = 0, y1 = 0, count = 0;
  for (let y = 0, p = 0; y < h; y++) {
    for (let x = 0; x < w; x++, p++) {
      const i = p * 4;
      const dr = src[i] - bgR, dg = src[i + 1] - bgG, db = src[i + 2] - bgB;
      if (dr * dr + dg * dg + db * db <= 900) continue;
      m[p] = 1;
      count++;
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  }
  if (count < 80) return { missing: true, count, w, h, bg: [bgR, bgG, bgB] };
  const fh = Math.max(1, y1 - y0 + 1);
  const cx = (x0 + x1) / 2;
  const cw = new Float64Array(h);
  const spansAt = (yy) => {
    const spans = [];
    let run = -1;
    for (let x = x0; x <= x1; x++) {
      if (m[yy * w + x]) { if (run < 0) run = x; }
      else if (run >= 0) { spans.push([run, x - 1]); run = -1; }
    }
    if (run >= 0) spans.push([run, x1]);
    return spans;
  };
  for (let y = y0; y <= y1; y++) {
    const spans = spansAt(y);
    let s = null;
    for (const span of spans) if (span[0] <= cx && span[1] >= cx) s = span;
    cw[y] = s ? (s[1] - s[0] + 1) : 0;
  }
  let headMaxW = 0;
  let equator = y0;
  const headLimit = Math.min(y1, (y0 + fh * 0.42) | 0);
  for (let y = y0; y <= headLimit; y++) {
    if (cw[y] >= headMaxW) { headMaxW = cw[y]; equator = y; }
    else if (headMaxW > 12 && y > equator + fh * 0.04 && cw[y] < headMaxW * 0.72) break;
  }
  let neckW = headMaxW;
  let shoulderY = -1;
  let shoulderW = 0;
  let neckAt = equator;
  const searchEnd = Math.min(y1, (y0 + fh * 0.62) | 0);
  let minW = cw[equator] || headMaxW;
  let minAt = equator;
  for (let y = equator + 1; y <= searchEnd; y++) {
    const widthC = cw[y];
    if (widthC > 0 && widthC < minW) { minW = widthC; minAt = y; }
    if (minAt > equator + 2 && widthC >= minW * 1.25 && widthC >= headMaxW * 0.38 && y > minAt) {
      shoulderY = y; neckAt = minAt; neckW = minW; shoulderW = widthC; break;
    }
  }
  const neck = neckW > 0 && shoulderY > 0 && (neckW / Math.max(1, headMaxW)) >= 0.12 && (neckW / Math.max(1, headMaxW)) <= 0.9 && shoulderW > neckW * 1.08;
  const headBot = neck ? neckAt : Math.min(y1, equator + ((fh * 0.08) | 0));
  const ratio = Math.max(1, headBot - y0 + 1) / fh;
  let headSx = 0, headSn = 0;
  for (let y = y0; y <= headBot; y++) for (let x = x0; x <= x1; x++) if (m[y * w + x]) { headSx += x; headSn++; }
  const headCx = headSn ? headSx / headSn : cx;
  const win0 = Math.min(y1, (y0 + fh * 0.32) | 0);
  const win1 = Math.min(y1, Math.max(win0 + 4, (y0 + fh * 0.58) | 0));
  const depthSamples = [];
  for (let y = win0; y <= win1; y++) {
    let best = cw[y] || 0;
    for (const span of spansAt(y)) best = Math.max(best, span[1] - span[0] + 1);
    depthSamples.push(best);
  }
  depthSamples.sort((a, b) => a - b);
  const chest = depthSamples.length ? depthSamples[Math.floor(depthSamples.length * 0.5)] : 0;
  const half = Math.max(8, shoulderW, chest) / 2;
  const torsoLeft = cx - half;
  const torsoRight = cx + half;
  function sideHand(left) {
    let hx = 0, hy = -1, n = 0;
    const yB = Math.min(y1, (y0 + fh * 0.82) | 0);
    for (let y = Math.max(y0, headBot - 4); y <= yB; y++) {
      for (let x = x0; x <= x1; x++) {
        if (!m[y * w + x]) continue;
        if (left ? x < cx - 6 : x > cx + 6) {
          n++;
          if (y >= hy) { hy = y; hx = x; }
        }
      }
    }
    return n >= 12 ? { x: hx, y: hy, n } : null;
  }
  const yStart = Math.max(y0, (y1 - Math.max(16, fh * 0.2)) | 0);
  const hist = new Int32Array(w);
  const bot = new Int32Array(w);
  for (let y = yStart; y <= y1; y++) for (let x = x0; x <= x1; x++) if (m[y * w + x]) { hist[x]++; if (y > bot[x]) bot[x] = y; }
  const feet = [];
  let run = -1, gap = 0;
  const pushFoot = (a, b) => {
    let area = 0, bestX = a, bestY = -1;
    for (let x = a; x <= b; x++) { area += hist[x]; if (bot[x] > bestY) { bestY = bot[x]; bestX = x; } }
    if (area >= 8 && bestY >= 0) feet.push({ x: bestX, y: bestY });
  };
  for (let x = x0; x <= x1; x++) {
    if (hist[x]) { if (run < 0) run = x; gap = 0; }
    else if (run >= 0) { gap++; if (gap >= 3) { pushFoot(run, x - gap); run = -1; gap = 0; } }
  }
  if (run >= 0) pushFoot(run, x1);
  return {
    missing: false, count, figureH: fh, ratio, neck, centered: Math.abs(headCx - cx) <= Math.max(10, half * 0.5),
    dx: Math.abs(headCx - cx), chest, top: y0, hands: { L: sideHand(true), R: sideHand(false) }, feet,
  };
}

function corr(a, b) {
  const n = a.length;
  if (n < 3) return 0;
  const ma = a.reduce((s, v) => s + v, 0) / n;
  const mb = b.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    const xa = a[i] - ma;
    const xb = b[i] - mb;
    num += xa * xb;
    da += xa * xa;
    db += xb * xb;
  }
  if (da < 1 || db < 1) return 0;
  return num / Math.sqrt(da * db);
}

function range(xs) { return Math.max(...xs) - Math.min(...xs); }

async function main() {
  fs.mkdirSync(path.join(OUT, 'anatomy'), { recursive: true });
  const server = await startServer();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'adv-anatomy-'));
  const chrome = spawn('google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
    '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--remote-debugging-port=' + CDP, '--user-data-dir=' + dir,
    '--window-size=520,760', 'about:blank',
  ], { stdio: 'ignore' });
  let page;
  for (let i = 0; i < 40 && !page; i++) {
    try {
      const list = await getJson('http://127.0.0.1:' + CDP + '/json/list');
      page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    } catch (e) { page = null; }
    if (!page) await new Promise((r) => setTimeout(r, 150));
  }
  if (!page) throw new Error('no page target');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 520, height: 760, deviceScaleFactor: 1, mobile: false,
  });
  const loaded = cdp.once('Page.loadEventFired', 20000);
  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/adventure.html?anatomy=1' });
  await loaded;
  const measure = await cdp.eval(`new Promise((res) => {
    const t0 = Date.now();
    const tick = () => {
      const a = window.__ADV;
      if (a && a.error) return res({ error: a.error });
        if (a && a.ready) return res(a.measure());
      if (Date.now() - t0 > 30000) return res({ timeout: true });
      setTimeout(tick, 40);
    };
    tick();
  })`);
  if (!measure || measure.error || measure.timeout) throw new Error('page did not ready ' + JSON.stringify(measure));

  const problems = [];
  const hero = measure.hero;
  const pet = measure.pet;
  if (hero.height < 1.15 || hero.height > 2.05) problems.push('Ellie is ' + hero.height.toFixed(2) + ' m. A standing kid reads around 1.50 m (1.15–2.05).');
  if (hero.minY > 0.08 || hero.minY < -0.05) problems.push('Ellie feet are at ' + hero.minY.toFixed(3) + ' m. They should meet the ground.');
  if (pet.minY > 0.08 || pet.minY < -0.05) problems.push('Pug feet are at ' + pet.minY.toFixed(3) + ' m. The pug should stand on the ground.');
  if (pet.maxY > hero.hipY + 0.08) problems.push('Pug top is ' + pet.maxY.toFixed(2) + ' m. Her hip is ' + hero.hipY.toFixed(2) + ' m, so the pug stands above her waist.');
  if (pet.height < 0.28) problems.push('Pug is ' + pet.height.toFixed(2) + ' m, below knee height.');
  if (!hero.bones.upperArmL || !hero.bones.upperLegL || !hero.bones.footL || !hero.bones.head) problems.push('Ellie is missing a limb bone.');

  async function grab(which, yaw, t, file) {
    await cdp.eval(`new Promise((res) => { window.__ADV.pose(${JSON.stringify(which)}, ${yaw}, ${t}); requestAnimationFrame(() => requestAnimationFrame(() => res(true))); })`);
    const cap = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(cap.data, 'base64');
    if (file) fs.writeFileSync(path.join(OUT, 'anatomy', file), buf);
    return analyze(PNG.sync.read(buf));
  }

  const views = [['front', 0], ['three-quarter', Math.PI / 4], ['side', Math.PI / 2], ['back', Math.PI]];
  const frames = {};
  for (const [name, yaw] of views) {
    frames[name] = [];
    for (let i = 0; i < 8; i++) {
      const file = (i === 0 || i === 3) ? (name + '-' + i + '.png') : null;
      frames[name].push(await grab('hero', yaw, i / 8, file));
    }
  }
  await grab('pet', 0.4, -1, 'pet.png');
  await grab('both', 0.35, -1, 'both.png');

  const front0 = frames.front[0];
  if (!front0 || front0.missing) problems.push('The front view did not draw Ellie.');
  else {
    if (front0.ratio < 0.16 || front0.ratio > 0.45) problems.push('Head height is ' + Math.round(front0.ratio * 100) + '% of the figure. A Brookhaven-style head is about 18% to 40%, and the bar is 16% to 45%.');
    if (!front0.neck) problems.push('The head does not sit on a neck. The outline never narrows between the head and the shoulders.');
    if (!front0.centered) problems.push('The head is off the center of the body by ' + Math.round(front0.dx) + ' px.');
    const L = front0.hands.L;
    const R = front0.hands.R;
    if (!L || !R) problems.push('The front view is missing a hand.');
    else if (!(L.x < R.x - 4)) problems.push('Hands are not on their own sides.');
    if (!front0.feet || front0.feet.length < 2) problems.push('The front view does not show two feet.');
  }
  const frontChest = front0 && !front0.missing ? front0.chest : 0;
  for (const name of ['three-quarter', 'side', 'back']) {
    const fig = frames[name][0];
    if (!fig || fig.missing) { problems.push('The ' + name + ' view did not draw Ellie.'); continue; }
    if (fig.ratio < 0.16 || fig.ratio > 0.45) problems.push('From the ' + name + ', head height is ' + Math.round(fig.ratio * 100) + '% of the figure.');
    if (frontChest > 12 && fig.chest < Math.max(8, frontChest * 0.36)) {
      problems.push('From the ' + name + ', the chest is ' + Math.round(fig.chest) + ' px against ' + Math.round(frontChest) + ' px from the front. The body reads as a flat card.');
    }
  }

  function walkProblems(name, sideOn) {
    const seq = frames[name].filter((f) => f && !f.missing && f.feet && f.feet.length >= 1 && f.hands && (f.hands.L || f.hands.R));
    if (seq.length < 5) {
      problems.push(name + ' walk did not produce feet and hands (' + seq.length + '/8).');
      return { frames: seq.length };
    }
    const H = seq[0].figureH;
    const footL = [];
    const footR = [];
    const handL = [];
    const handR = [];
    const tops = [];
    for (const f of seq) {
      const feet = f.feet.slice().sort((a, b) => a.x - b.x);
      footL.push(feet[0].x);
      footR.push(feet[feet.length - 1].x);
      handL.push(f.hands.L ? f.hands.L.x : f.hands.R.x);
      handR.push(f.hands.R ? f.hands.R.x : f.hands.L.x);
      tops.push(f.top);
    }
    const step = Math.max(range(footL), range(footR));
    const swing = Math.max(range(handL), range(handR));
    const oppose = corr(footL.map((v, i) => v - footR[i]), handL.map((v, i) => v - handR[i]));
    const together = corr(footL, footR);
    const bob = range(tops);
    let lifts = 0;
    for (const f of seq) {
      if (f.feet.length >= 2) {
        const ys = f.feet.map((ft) => ft.y);
        if (Math.abs(Math.max(...ys) - Math.min(...ys)) > H * 0.03) lifts++;
      }
    }
    if (step < H * 0.06) problems.push(name + ' feet barely travel (' + Math.round(step) + ' px).');
    if (swing < H * 0.04) problems.push(name + ' arms do not swing (' + Math.round(swing) + ' px).');
    // A 3D stride travels away from the camera, so front-view x correlation stays near 0.
    // Opposition is scored from the side, where the forward arm travels with the forward foot.
    if (sideOn && oppose < 0.15) problems.push(name + ' side view: the forward arm should travel with the forward foot (correlation ' + oppose.toFixed(2) + ').');
    if (!sideOn && together > 0.75 && step > 8) problems.push(name + ' both feet slide the same way.');
    if (lifts < 2) problems.push(name + ' feet do not trade a plant and a lift.');
    if (bob < Math.max(2, H * 0.008)) problems.push(name + ' body does not bob (' + Math.round(bob) + ' px).');
    if (bob > H * 0.1) problems.push(name + ' body bobs too much (' + Math.round(bob) + ' px).');
    return { step: Math.round(step), swing: Math.round(swing), oppose: +oppose.toFixed(2), bob: Math.round(bob), lifts, figureH: H };
  }

  const walk = { front: walkProblems('front', false), side: walkProblems('side', true) };
  console.log('front0', JSON.stringify(frames.front[0]));
  console.log('side0', JSON.stringify(frames.side[0]));
  const report = {
    ok: problems.length === 0,
    bar: 'Same numeric bar as Anatomy Check (cursor/anatomy-check-3de5). That checker scores Neon crew sprites, so Milestone 0 runs it on these renders.',
    problems,
    measure,
    chest: {
      front: frames.front[0] && frames.front[0].chest,
      threeQuarter: frames['three-quarter'][0] && frames['three-quarter'][0].chest,
      side: frames.side[0] && frames.side[0].chest,
      back: frames.back[0] && frames.back[0].chest,
    },
    head: views.map(([name]) => ({
      view: name,
      ratio: frames[name][0] && frames[name][0].ratio != null ? +frames[name][0].ratio.toFixed(3) : null,
      neck: frames[name][0] && frames[name][0].neck,
      centered: frames[name][0] && frames[name][0].centered,
    })),
    walk,
    logs: cdp.logs,
  };
  fs.writeFileSync(path.join(OUT, 'anatomy.json'), JSON.stringify(report, null, 2));
  console.log((report.ok ? 'PASS' : 'FAIL') + ' ' + problems.length);
  for (const p of problems) console.log(' - ' + p);
  console.log('head', JSON.stringify(report.head));
  console.log('chest', JSON.stringify(report.chest));
  console.log('walk', JSON.stringify(walk));
  console.log('scale', JSON.stringify({ heroH: hero.height, hip: hero.hipY, feet: hero.minY, petH: pet.height, petTop: pet.maxY, petFeet: pet.minY }));
  chrome.kill('SIGKILL');
  server.close();
  process.exit(report.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
