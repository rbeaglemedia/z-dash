// Walk, stop, and assert the pet's speed is 0 and its idle clip is showing within 0.5 s.
import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'test-results', 'adventure-pet');
const PORT = 8793;
const CDP = 9393;
fs.mkdirSync(OUT, { recursive: true });

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

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'petstop-'));
const chrome = spawn('google-chrome', [
  '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
  '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
  '--remote-debugging-port=' + CDP, '--user-data-dir=' + dir,
  '--window-size=900,500', 'about:blank',
], { stdio: 'ignore' });

let wsUrl = null;
for (let i = 0; i < 40 && !wsUrl; i++) {
  try {
    const list = await getJson('http://127.0.0.1:' + CDP + '/json/list');
    const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    if (page) wsUrl = page.webSocketDebuggerUrl;
  } catch (e) {
    await new Promise((r) => setTimeout(r, 150));
  }
}
if (!wsUrl) {
  console.error('no cdp page');
  chrome.kill('SIGKILL');
  server.close();
  process.exit(1);
}

const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve);
  ws.addEventListener('error', reject);
});
let id = 0;
const pending = new Map();
const waiters = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const p = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
    else p.resolve(msg.result);
  }
  if (msg.method) {
    for (let i = waiters.length - 1; i >= 0; i--) {
      if (waiters[i].method === msg.method) {
        const w = waiters.splice(i, 1)[0];
        clearTimeout(w.timer);
        w.resolve(msg.params);
      }
    }
  }
});
function send(method, params) {
  const n = ++id;
  return new Promise((resolve, reject) => {
    pending.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params: params || {} }));
  });
}
function once(method, ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    waiters.push({ method, timer, resolve });
  });
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 844, height: 390, deviceScaleFactor: 1, mobile: true,
});
const loaded = once('Page.loadEventFired', 20000);
await send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/adventure.html?kind=phone' });
await loaded;

const t0 = Date.now();
let ready = false;
while (Date.now() - t0 < 30000) {
  const ev = await send('Runtime.evaluate', {
    expression: 'window.__ADV && window.__ADV.ready ? true : false',
    returnByValue: true,
  });
  if (ev.result && ev.result.value === true) { ready = true; break; }
  await new Promise((r) => setTimeout(r, 80));
}
if (!ready) {
  console.error('adventure did not become ready');
  chrome.kill('SIGKILL');
  server.close();
  process.exit(1);
}

const start = await send('Runtime.evaluate', {
  expression: `(() => {
    window.__petStopSamples = [];
    const down = new KeyboardEvent('keydown', { code: 'KeyW', bubbles: true });
    window.dispatchEvent(down);
    const tWalk = performance.now();
    function frame() {
      const a = window.__ADV || {};
      const follow = a.petFollow ? a.petFollow() : null;
      const now = performance.now();
      const walking = now - tWalk < 1000;
      if (!walking && !window.__petStopUp) {
        window.__petStopUp = now;
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW', bubbles: true }));
      }
      const stopT = window.__petStopUp ? now - window.__petStopUp : -1;
      window.__petStopSamples.push({
        t: Math.round(now - tWalk),
        stopT: Math.round(stopT),
        speed: a.petSpeed,
        anim: a.petAnim,
        walk: a.petWalk,
        dist: follow ? follow.dist : null,
        face: follow ? follow.face : null,
        chest: follow ? follow.chest : null,
        tail: follow ? follow.tail : null,
      });
      if (stopT < 500) requestAnimationFrame(frame);
      else {
        const pet = window.__ADV.bones().pet || [];
        const hips = (window.__ADV.bones().hero || []).find((b) => b.name === 'Hips');
        const head = pet.find((b) => b.name === 'b_Head_05');
        const tail = pet.find((b) => b.name === 'b_Tail03_014');
        const dist = (b) => (b && hips) ? Math.hypot(b.x - hips.x, b.z - hips.z) : null;
        window.__petBones = { head: dist(head), tail: dist(tail) };
        window.__petStopDone = true;
      }
    }
    requestAnimationFrame(frame);
    return 'started';
  })()`,
  returnByValue: true,
});
if (!start.result || start.result.value !== 'started') {
  console.error('failed to start walk', JSON.stringify(start));
  chrome.kill('SIGKILL');
  server.close();
  process.exit(1);
}

const waitUntil = Date.now() + 8000;
let done = false;
while (Date.now() < waitUntil) {
  const ev = await send('Runtime.evaluate', {
    expression: 'window.__petStopDone ? { samples: window.__petStopSamples, bones: window.__petBones } : null',
    returnByValue: true,
  });
  if (ev.result && ev.result.value) {
    done = ev.result.value;
    break;
  }
  await new Promise((r) => setTimeout(r, 50));
}

if (!done) {
  chrome.kill('SIGKILL');
  server.close();
  console.error('pet stop sample timed out');
  process.exit(1);
}
chrome.kill('SIGKILL');
server.close();

const bones = done.bones || {};
done = done.samples;
const during = done.filter((s) => s.stopT < 0);
const after = done.filter((s) => s.stopT >= 500);
const last = after[after.length - 1] || done[done.length - 1];
const walked = during.some((s) => s.anim === 'walk' && s.walk === true && s.speed > 0.4);
const stopped = last && last.speed < 0.05 && last.anim === 'idle' && last.walk === false;
const near = last && last.dist != null && last.dist > 0.4 && last.dist < 1.8;
const facing = last && last.face > 0.85;
const chestAhead = last && last.chest != null && last.tail != null && last.chest < last.tail;
const noseAhead = bones.head != null && bones.tail != null && bones.head + 0.15 < bones.tail;
const idleAt = done.find((s) => s.stopT >= 0 && s.speed < 0.05 && s.anim === 'idle' && s.walk === false);
const pass = Boolean(walked && stopped && near && facing && chestAhead && noseAhead && idleAt && idleAt.stopT <= 500);
const report = {
  pass,
  walked,
  stopped,
  near,
  facing,
  chestAhead,
  noseAhead,
  bones,
  idleAtMs: idleAt ? idleAt.stopT : null,
  last,
  walkSamples: during.length,
  stopSamples: after.length,
  maxWalkSpeed: during.reduce((m, s) => Math.max(m, s.speed || 0), 0),
  tail: done.slice(-8),
};
fs.writeFileSync(path.join(OUT, 'pet-stop.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(pass ? 0 : 1);
