#!/usr/bin/env node
/**
 * Throttled phone gate, plus the iPad and PC columns from the build order.
 * Phone slows the CPU 4×. iPad and PC do not. One browser. 360 frames.
 *
 *   node tools/adventure-gate.mjs phone
 *   node tools/adventure-gate.mjs ipad
 *   node tools/adventure-gate.mjs pc
 */
import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'test-results', 'adventure-m0');
const PORT = 8775;
const CDP = 9345;
const kind = (process.argv[2] || 'phone').toLowerCase();
const specs = {
  phone: { w: 844, h: 390, mobile: true, throttle: 4, p95: 20, p99: 33, hitch: 50 },
  ipad: { w: 1024, h: 768, mobile: true, throttle: 1, p95: 33, p99: 50, hitch: 50 },
  pc: { w: 1366, h: 768, mobile: false, throttle: 1, p95: 16.7, p99: 33, hitch: 33 },
};
const spec = specs[kind];
if (!spec) {
  console.error('kind must be phone, ipad, or pc');
  process.exit(2);
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

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
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'adv-gate-'));
const chrome = spawn('google-chrome', [
  '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
  '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
  '--remote-debugging-port=' + CDP, '--user-data-dir=' + dir,
  '--window-size=' + spec.w + ',' + spec.h, 'about:blank',
], { stdio: 'ignore' });

let wsUrl = null;
for (let i = 0; i < 40 && !wsUrl; i++) {
  try {
    const list = await getJson('http://127.0.0.1:' + CDP + '/json/list');
    const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    if (page) wsUrl = page.webSocketDebuggerUrl;
  } catch (e) { await new Promise((r) => setTimeout(r, 150)); }
}
if (!wsUrl) {
  chrome.kill('SIGKILL');
  server.close();
  console.error('chrome cdp did not open');
  process.exit(1);
}
const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve); ws.addEventListener('error', reject); });
let id = 0;
const pending = new Map();
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const p = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
    else p.resolve(msg.result);
  }
});
function send(method, params) {
  const n = ++id;
  return new Promise((resolve, reject) => {
    pending.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params: params || {} }));
  });
}
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: spec.w, height: spec.h, deviceScaleFactor: 1, mobile: spec.mobile,
});
await send('Emulation.setCPUThrottlingRate', { rate: spec.throttle });
await send('Page.navigate', {
  url: 'http://127.0.0.1:' + PORT + '/adventure.html?bench=1&fps=1&perf=1&frames=360&kind=' + kind,
});
const ev = await send('Runtime.evaluate', {
  expression: `new Promise((res) => { const t0=Date.now(); const tick=()=>{ const a=window.__ADV; if (a && a.benchDone) return res(a.stats); if (a && a.error) return res({error:String(a.error)}); if (Date.now()-t0>90000) return res({timeout:true}); setTimeout(tick,50); }; tick(); })`,
  awaitPromise: true,
  returnByValue: true,
});
const stats = (ev.result && ev.result.value) || { error: 'no result' };
const reasons = [];
if (stats.timeout) reasons.push('timeout');
if (stats.error) reasons.push(String(stats.error));
if (!(stats.warmMs < 80)) reasons.push('curtain first draw ' + stats.warmMs);
if (!(stats.bootHitch < 80)) reasons.push('warmup hitch ' + stats.bootHitch);
if (!(stats.p95 <= spec.p95)) reasons.push('p95 ' + stats.p95);
if (!(stats.p99 <= spec.p99)) reasons.push('p99 ' + stats.p99);
if (!(stats.worst <= spec.hitch)) reasons.push('hitch ' + stats.worst);
if (stats.calls > (kind === 'ipad' ? 80 : kind === 'pc' ? 200 : 120)) reasons.push('draws ' + stats.calls);
if (stats.tris > (kind === 'ipad' ? 28000 : kind === 'pc' ? 60000 : 35000)) reasons.push('tris ' + stats.tris);
if (Array.isArray(stats.dipLog)) {
  for (let i = 0; i < stats.dipLog.length; i++) {
    if (!stats.dipLog[i].slice) reasons.push('unnamed dip');
  }
}
const row = { kind, throttle: spec.throttle, pass: reasons.length === 0, reasons, stats };
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'gate-' + kind + '.json'), JSON.stringify(row, null, 2));
console.log(JSON.stringify(row, null, 2));
chrome.kill('SIGKILL');
server.close();
process.exit(row.pass ? 0 : 1);
