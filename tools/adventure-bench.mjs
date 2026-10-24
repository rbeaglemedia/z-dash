#!/usr/bin/env node
/**
 * Milestone 0 frame-time bench and screenshots.
 * Lab graphics (swiftshader), not her phone. The page records the histogram.
 *
 *   node tools/adventure-bench.mjs
 */
import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'test-results', 'adventure-m0');
const PORT = 8765;
const CDP = 9333;

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
    this.logs = [];
    this.waiters = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
      if (msg.method) {
        this.waiters = this.waiters.filter((w) => {
          if (w.method !== msg.method) return true;
          w.resolve(msg.params);
          return false;
        });
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = (msg.params.args || []).map((a) => a.value || a.description || '').join(' ');
        this.logs.push(text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        this.logs.push('EXC ' + (msg.params.exceptionDetails && msg.params.exceptionDetails.text));
      }
    });
  }
  once(method, ms) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), ms);
      this.waiters.push({
        method,
        resolve: (params) => { clearTimeout(timer); resolve(params); },
      });
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
}

async function connect() {
  const list = await getJson('http://127.0.0.1:' + CDP + '/json/list');
  const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!page) throw new Error('no page target');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  return new Cdp(ws);
}

async function runOne(cdp, spec) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: spec.w, height: spec.h, deviceScaleFactor: 1, mobile: spec.kind !== 'pc',
  });
  const url = 'http://127.0.0.1:' + PORT + '/adventure.html?' + spec.query;
  const loaded = cdp.once('Page.loadEventFired', 20000);
  await cdp.send('Page.navigate', { url });
  await loaded;
  const expr = spec.wait || `new Promise((res) => {
    const t0 = Date.now();
    const tick = () => {
      const a = window.__ADV;
      if (a && a.benchDone) return res(a);
      if (a && a.error) return res(a);
      if (Date.now() - t0 > 90000) return res({ timeout: true, adv: a || null });
      setTimeout(tick, 40);
    };
    tick();
  })`;
  const ev = await cdp.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  const value = ev.result && ev.result.value;
  let png = null;
  if (spec.shot) {
    const cap = await cdp.send('Page.captureScreenshot', { format: 'png' });
    png = Buffer.from(cap.data, 'base64');
  }
  return { value, png, logs: cdp.logs.slice() };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'adv-chrome-'));
  const chrome = spawn('google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
    '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
    '--remote-debugging-port=' + CDP, '--user-data-dir=' + dir,
    '--window-size=1366,768', 'about:blank',
  ], { stdio: 'ignore' });
  let cdp;
  for (let i = 0; i < 40; i++) {
    try { cdp = await connect(); break; } catch (e) { await new Promise((r) => setTimeout(r, 150)); }
  }
  if (!cdp) throw new Error('chrome cdp did not open');
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  const shotWait = `new Promise((res) => { const t0=Date.now(); const tick=()=>{ const a=window.__ADV; if (a && a.error) return res(a); if (a && a.ready) return requestAnimationFrame(() => requestAnimationFrame(() => res(a.measure()))); if (Date.now()-t0>45000) return res({timeout:true}); setTimeout(tick,40); }; tick(); })`;
  const jobs = [
    { kind: 'phone', w: 844, h: 390, query: 'bench=1&fps=1&frames=360&kind=phone', shot: false },
    { kind: 'ipad', w: 1024, h: 768, query: 'bench=1&fps=1&frames=360&kind=ipad', shot: false },
    { kind: 'pc', w: 1366, h: 768, query: 'bench=1&fps=1&frames=360&kind=pc', shot: false },
    { kind: 'phone', w: 844, h: 390, query: 'shot=heads&view=front&kind=phone', shot: true, file: 'head-compare-front.png', wait: shotWait },
    { kind: 'phone', w: 844, h: 390, query: 'shot=heads&view=three-quarter&kind=phone', shot: true, file: 'head-compare-three-quarter.png', wait: shotWait },
    { kind: 'phone', w: 844, h: 390, query: 'shot=hero&kind=phone', shot: true, file: 'phone-hero.png', wait: shotWait },
    { kind: 'phone', w: 844, h: 390, query: 'shot=pet&kind=phone', shot: true, file: 'phone-pet.png', wait: shotWait },
    { kind: 'phone', w: 844, h: 390, query: 'shot=1&kind=phone&pet=fox', shot: true, file: 'phone-fox.png', wait: shotWait },
    { kind: 'phone', w: 844, h: 390, query: 'shot=1&kind=phone&pet=cat', shot: true, file: 'phone-cat.png', wait: shotWait },
    { kind: 'phone', w: 844, h: 390, query: 'shot=1&kind=phone&pet=puppy', shot: true, file: 'phone-puppy.png', wait: shotWait },
    { kind: 'phone', w: 844, h: 390, query: 'shot=1&kind=phone&pet=fox', shot: true, file: 'phone-both.png', wait: shotWait },
    { kind: 'ipad', w: 1024, h: 768, query: 'shot=hero&kind=ipad', shot: true, file: 'ipad-hero.png', wait: shotWait },
    { kind: 'ipad', w: 1024, h: 768, query: 'shot=pet&kind=ipad', shot: true, file: 'ipad-pet.png', wait: shotWait },
    { kind: 'ipad', w: 1024, h: 768, query: 'shot=1&kind=ipad', shot: true, file: 'ipad-both.png', wait: shotWait },
    { kind: 'pc', w: 1366, h: 768, query: 'shot=hero&kind=pc', shot: true, file: 'pc-hero.png', wait: shotWait },
    { kind: 'pc', w: 1366, h: 768, query: 'shot=pet&kind=pc', shot: true, file: 'pc-pet.png', wait: shotWait },
    { kind: 'pc', w: 1366, h: 768, query: 'shot=1&kind=pc', shot: true, file: 'pc-both.png', wait: shotWait },
  ];
  const report = [];
  for (const job of jobs) {
    const row = await runOne(cdp, job);
    if (job.file && row.png) fs.writeFileSync(path.join(OUT, job.file), row.png);
    report.push({ kind: job.kind, query: job.query, file: job.file || null, value: row.value, logs: row.logs.slice(-8) });
    console.log(job.kind, job.query, JSON.stringify(row.value && (row.value.stats || row.value.hero || row.value.error || row.value.timeout || row.value)));
  }
  fs.writeFileSync(path.join(OUT, 'bench.json'), JSON.stringify(report, null, 2));
  chrome.kill('SIGKILL');
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
