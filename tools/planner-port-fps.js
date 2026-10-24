#!/usr/bin/env node
/* Lab frame times for the planner-port proof page.
   Headless Chrome, software graphics (--disable-gpu). These milliseconds
   are not a Galaxy frame and not an iPad frame. Five samples per viewport
   after a short warmup the page records itself. */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';
const OUT = path.join(ROOT, 'test-results', 'planner-port');
const PORT = Number(process.env.PORT || 8766);
const CDP = Number(process.env.CDP || 9333);

const VIEWPORTS = [
  { id: 'phone', width: 844, height: 390, dpr: 3, throttle: 4 },
  { id: 'ipad', width: 1024, height: 768, dpr: 2, throttle: 2 },
  { id: 'pc', width: 1366, height: 768, dpr: 1, throttle: 1 }
];

const MEASURE = ['house', 'shell', 'remix-row', 'trailer', 'budget'];
const SHOTS = [
  ['house', ''],
  ['shell', ''],
  ['props', ''],
  ['remix', 'food-truck'],
  ['remix', 'welcome-gate'],
  ['remix', 'ticket-booth'],
  ['remix', 'speaker-tower'],
  ['remix', 'snack-counter'],
  ['trailer', '']
];

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png'
  })[ext] || 'application/octet-stream';
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing'); return; }
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.next = 1;
    this.pending = new Map();
    this.ready = new Promise((res, rej) => {
      this.ws.addEventListener('open', res);
      this.ws.addEventListener('error', () => rej(new Error('cdp socket error')));
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.rej(new Error(msg.error.message || JSON.stringify(msg.error)));
        else p.res(msg.result || {});
      }
    });
  }
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 20000);
      this.pending.set(id, {
        res: (v) => { clearTimeout(t); res(v); },
        rej: (e) => { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function waitJson(url) {
  let last = '';
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = String(res.status);
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('chrome not ready: ' + last);
}

function sceneUrl(scene, remix) {
  const q = new URLSearchParams({ scene, shot: '1' });
  if (remix) q.set('remix', remix);
  return 'http://127.0.0.1:' + PORT + '/test/planner-port.html?' + q.toString();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zd-planner-'));
  const child = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--mute-audio',
    '--remote-debugging-port=' + CDP, '--user-data-dir=' + dir, 'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let chromeErr = '';
  child.stderr.on('data', (b) => { chromeErr += b.toString(); });
  const ver = await waitJson('http://127.0.0.1:' + CDP + '/json/version');
  const cdp = new Cdp(ver.webSocketDebuggerUrl);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const list = await waitJson('http://127.0.0.1:' + CDP + '/json/list');
  const page = list.find((t) => t.id === targetId);
  const pageCdp = new Cdp(page.webSocketDebuggerUrl);
  await pageCdp.send('Page.enable');
  await pageCdp.send('Runtime.enable');

  const rows = [];
  const shots = [];

  async function open(scene, remix, vp) {
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: vp.id !== 'pc'
    });
    await pageCdp.send('Emulation.setCPUThrottlingRate', { rate: vp.throttle });
    await pageCdp.send('Page.navigate', { url: sceneUrl(scene, remix) });
    await sleep(400);
    let proof = null;
    for (let i = 0; i < 40; i++) {
      const ev = await pageCdp.send('Runtime.evaluate', {
        expression: 'window.__PROOF || null',
        returnByValue: true
      });
      proof = ev.result && ev.result.value;
      if (proof && proof.ready) break;
      if (proof && proof.error) break;
      await sleep(150);
    }
    return proof;
  }

  for (const vp of VIEWPORTS) {
    for (const scene of MEASURE) {
      const proof = await open(scene, '', vp);
      rows.push({
        viewport: vp.id,
        css: vp.width + 'x' + vp.height,
        dpr: vp.dpr,
        throttle: vp.throttle,
        scene,
        ready: !!(proof && proof.ready),
        error: proof && proof.error || '',
        instances: proof && proof.instances,
        draws: proof && proof.draws,
        tris: proof && proof.tris,
        samples: proof && proof.samples,
        meanMs: proof && proof.meanMs,
        rafHeavy: proof && proof.rafHeavy,
        fps: proof && proof.fps,
        buffer: proof && proof.buffer,
        videoPaused: proof && proof.videoPaused
      });
      console.log(vp.id, scene, proof && proof.ready ? proof.meanMs.toFixed(2) + ' ms  ' + proof.instances + ' inst' : (proof && proof.error) || 'not ready');
    }
  }

  for (const vp of VIEWPORTS) {
    for (const [scene, remix] of SHOTS) {
      if (vp.id !== 'ipad' && scene === 'remix') continue;
      if (vp.id === 'phone' && scene !== 'house' && scene !== 'props' && scene !== 'shell') continue;
      if (vp.id === 'pc' && scene === 'props') continue;
      const proof = await open(scene, remix, vp);
      const name = [vp.id, scene, remix].filter(Boolean).join('-') + '.png';
      const shot = await pageCdp.send('Page.captureScreenshot', { format: 'png' });
      const file = path.join(OUT, name);
      fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      shots.push({ file: 'test-results/planner-port/' + name, scene, remix, viewport: vp.id, instances: proof && proof.instances, meanMs: proof && proof.meanMs });
      console.log('shot', name);
    }
  }

  const payload = {
    note: 'Headless Chrome --disable-gpu. Draw cost is one instanced draw, taken as the mean of five trials of 40 draws plus gl.finish, divided by 40. CPU throttle matches the city-builder clip: phone 4, iPad 2, PC 1. These are lab costs, not a Galaxy frame and not an iPad frame. A cost under 9.1 ms is inside the Galaxy 110 fps budget. A cost under 16.7 ms is inside a 60 fps iPad budget.',
    chrome: ver.Browser,
    rows,
    shots
  };
  fs.writeFileSync(path.join(OUT, 'fps.json'), JSON.stringify(payload, null, 2));

  const lines = [];
  lines.push('# Planner port proof — lab frame times');
  lines.push('');
  lines.push(payload.note);
  lines.push('');
  lines.push('Browser: ' + ver.Browser);
  lines.push('');
  lines.push('| viewport | scene | instances | tris | mean draw ms | heavy-frame gaps (ms) |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  rows.forEach((r) => {
    const gaps = (r.rafHeavy || []).map((n) => Number(n).toFixed(2)).join(', ');
    lines.push('| ' + [r.viewport + ' ' + r.css + ' dpr ' + r.dpr + ' cpu ' + r.throttle, r.scene, r.instances, r.tris, r.meanMs != null ? Number(r.meanMs).toFixed(3) : '', gaps || r.error || 'not ready'].join(' | ') + ' |');
  });
  lines.push('');
  lines.push('Screenshots:');
  shots.forEach((s) => lines.push('- ' + s.file + ' (' + s.viewport + ', ' + s.scene + (s.remix ? ' ' + s.remix : '') + ')'));
  fs.writeFileSync(path.join(OUT, 'fps.md'), lines.join('\n') + '\n');

  pageCdp.close();
  cdp.close();
  child.kill();
  server.close();
  if (chromeErr && !rows.some((r) => r.ready)) {
    fs.writeFileSync(path.join(OUT, 'chrome-err.txt'), chromeErr.slice(-4000));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
