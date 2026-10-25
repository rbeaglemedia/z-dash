#!/usr/bin/env node
/**
 * Dev Test Tools spinner check.
 * Loads every character, car, and building option. Fails on console errors,
 * missing textures, NaN bones, leftover parts, drifted compare cameras,
 * or a Save Shot label that does not match the on-screen model.
 *
 *   node tools/viewer-check.js
 *
 * Exit 0 pass, 1 fail, 2 checker bug.
 */
import { spawn, execFileSync } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire('/tmp/viewer-deps/package.json');
const { PNG } = require('pngjs');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'test-results', 'character-viewer');
const PORT = 8779;
const CDP = 9341;
const CHROME = process.env.CHROME || 'google-chrome';

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.fbx': 'application/octet-stream',
    '.glb': 'model/gltf-binary',
    '.svg': 'image/svg+xml',
  })[ext] || 'application/octet-stream';
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
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

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
        else p.resolve(msg.result);
      }
    });
  }
  send(method, params, timeout) {
    const id = ++this.id;
    const ms = timeout || 30000;
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => { this.pending.delete(id); reject(new Error(method + ' timed out')); }, ms);
      this.pending.set(id, {
        resolve: (v) => { clearTimeout(t); resolve(v); },
        reject: (e) => { clearTimeout(t); reject(e); },
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  eval(expression, timeout) {
    return this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    }, timeout).then((res) => {
      if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails).slice(0, 800));
      return res.result && res.result.value;
    });
  }
}

function launchChrome() {
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--remote-debugging-port=' + CDP,
    '--user-data-dir=/tmp/zd-viewer-chrome',
    '--window-size=1366,768',
    'about:blank',
  ], { stdio: 'ignore' });
  return chrome;
}

async function connect() {
  const t0 = Date.now();
  let version;
  while (Date.now() - t0 < 20000) {
    try { version = await getJson('http://127.0.0.1:' + CDP + '/json/version'); break; }
    catch (err) { await new Promise((r) => setTimeout(r, 200)); }
  }
  if (!version) throw new Error('chrome did not open a debug port');
  const list = await getJson('http://127.0.0.1:' + CDP + '/json/list');
  const page = list.find((t) => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve); ws.addEventListener('error', reject); });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  return { cdp, ws };
}

async function setSize(cdp, w, h) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: w, height: h, deviceScaleFactor: 1, mobile: w < 900,
  });
}

async function goto(cdp, url) {
  await cdp.send('Page.navigate', { url });
  const t0 = Date.now();
  while (Date.now() - t0 < 30000) {
    const ready = await cdp.eval('document.readyState');
    if (ready === 'complete') return;
    await new Promise((r) => setTimeout(r, 50));
  }
}

function mae(a, b) {
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  let s = 0;
  let n = 0;
  for (let y = 8; y < h - 8; y += 2) {
    for (let x = 8; x < w - 8; x += 2) {
      const i = (y * a.width + x) << 2;
      const j = (y * b.width + x) << 2;
      s += Math.abs(a.data[i] - b.data[j]);
      s += Math.abs(a.data[i + 1] - b.data[j + 1]);
      s += Math.abs(a.data[i + 2] - b.data[j + 2]);
      n += 3;
    }
  }
  return n ? s / n : 999;
}

function gameFilesTouched() {
  const out = execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' });
  const bad = [];
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    const file = line.slice(3).trim();
    if (/^(index|world|jr|adventure)\.html$/.test(file) || file === 'sw.js' || file.startsWith('adventure/src/')) bad.push(line);
  }
  return bad;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const log = [];
  const note = (s) => { log.push(s); console.log(s); };
  const server = await startServer();
  const chrome = launchChrome();
  let ws;
  const report = { fails: [], notes: [], shots: [], fps: {} };
  try {
    const conn = await connect();
    ws = conn.ws;
    const cdp = conn.cdp;
    await setSize(cdp, 1366, 768);
    await goto(cdp, 'http://127.0.0.1:' + PORT + '/test/tools.html?check=1&m=character');
    const booted = await cdp.eval(`new Promise((res) => {
      const t0 = Date.now();
      const tick = () => {
        if (window.__SPIN && window.__SPIN.ready) return res({ ready: true, modules: window.__SPIN.modules, contract: window.__SPIN.contract });
        if (Date.now() - t0 > 20000) return res({ ready: false });
        setTimeout(tick, 40);
      };
      tick();
    })`);
    if (!booted || !booted.ready) throw new Error('hub did not boot');
    note('hub contract ' + booted.contract + ' modules ' + booted.modules.join(','));

    const broken = await cdp.eval('window.__SPIN.mountBroken()');
    if (!broken || !broken.failed || !broken.card || broken.tabs < 3) {
      report.fails.push('broken module took down the hub ' + JSON.stringify(broken));
    } else note('broken module stayed inside its card, tabs ' + broken.tabs);

    const opened = await cdp.eval('window.__SPIN.open("character")');
    if (!opened || opened.failed) report.fails.push('character remount failed after a broken module');
    const sweep = await cdp.eval('window.__SPIN.character.sweep()', 240000);
    note('character sweep fails ' + (sweep && sweep.fails ? sweep.fails.length : 'none'));
    if (!sweep) report.fails.push('character sweep returned nothing');
    else {
      report.character = { fails: sweep.fails, notes: sweep.notes, label: sweep.label };
      for (const f of sweep.fails || []) report.fails.push('character ' + f);
      for (const n of sweep.notes || []) report.notes.push(n);
    }

    async function shot(name, w, h, view) {
      await setSize(cdp, w, h);
      await cdp.eval('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
      if (view) await cdp.eval('window.__SPIN.character.setView(' + JSON.stringify(view) + ')');
      await cdp.eval('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
      const cap = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUT, name), Buffer.from(cap.data, 'base64'));
      report.shots.push(name);
      const frames = await cdp.eval(`(async () => {
        const out = [];
        let last = performance.now();
        for (let i = 0; i < 5; i++) {
          await new Promise((r) => requestAnimationFrame(r));
          const now = performance.now();
          out.push(Math.round((now - last) * 100) / 100);
          last = now;
        }
        return out;
      })()`);
      report.fps[name] = frames;
      note(name + ' frames ' + frames.join(', '));
    }

    await shot('phone-ellie.png', 390, 844, { model: 'ellie', compare: false, angle: 'front', light: 'game', turn: false, play: false });
    await shot('ipad-ellie.png', 1180, 820, { model: 'ellie', compare: false, angle: 'three', light: 'studio', turn: false, play: false });
    await shot('pc-compare.png', 1366, 768, { model: 'ellie', compare: 'fox', angle: 'front', light: 'game', turn: false, overlay: false });
    await shot('pc-turntable.png', 1366, 768, { compare: false, angle: 'three', light: 'neon', turn: true, play: true });
    await shot('pc-scrub.png', 1366, 768, { model: 'ellie', compare: false, angle: 'side', light: 'studio', turn: false, scrub: 0.35, play: false });

    await setSize(cdp, 520, 760);
    const match = await cdp.eval('window.__SPIN.character.gameMatch()', 60000);
    if (!match || !match.url) report.fails.push('gameMatch returned no image');
    else {
      const buf = Buffer.from(match.url.split(',')[1], 'base64');
      fs.writeFileSync(path.join(OUT, 'viewer-game.png'), buf);
      report.viewerMeasure = match.measure;
    }

    await goto(cdp, 'http://127.0.0.1:' + PORT + '/adventure.html?anatomy=1&pet=fox');
    const game = await cdp.eval(`new Promise((res) => {
      const t0 = Date.now();
      const tick = () => {
        const a = window.__ADV;
        if (a && a.error) return res({ error: a.error });
        if (a && a.ready && a.pose) {
          a.pose('hero', 0, -1);
          return res({ measure: a.measure().hero });
        }
        if (Date.now() - t0 > 60000) return res({ timeout: true });
        setTimeout(tick, 50);
      };
      tick();
    })`, 70000);
    if (!game || game.error || game.timeout) report.fails.push('adventure anatomy page ' + JSON.stringify(game));
    else {
      report.gameMeasure = game.measure;
      await cdp.eval('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))');
      const cap = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(cap.data, 'base64');
      fs.writeFileSync(path.join(OUT, 'adventure-game.png'), buf);
      if (match && match.url) {
        const viewer = PNG.sync.read(fs.readFileSync(path.join(OUT, 'viewer-game.png')));
        const adv = PNG.sync.read(buf);
        const diff = mae(viewer, adv);
        report.pixelMae = +diff.toFixed(2);
        note('pixel mae ' + report.pixelMae);
        if (diff > 36) report.fails.push('viewer vs adventure pixel mae ' + report.pixelMae);
        const vm = match.measure;
        const gm = game.measure;
        if (vm && gm) {
          if (Math.abs(vm.height - gm.height) > 0.05) report.fails.push('height viewer ' + vm.height.toFixed(3) + ' game ' + gm.height.toFixed(3));
          if (Math.abs(vm.minY - gm.minY) > 0.05) report.fails.push('feet viewer ' + vm.minY.toFixed(3) + ' game ' + gm.minY.toFixed(3));
        }
      }
    }

    await setSize(cdp, 1366, 768);
    await goto(cdp, 'http://127.0.0.1:' + PORT + '/test/tools.html?check=1&m=car');
    await cdp.eval(`new Promise((res) => {
      const t0 = Date.now();
      const tick = () => {
        if (window.__SPIN && window.__SPIN.car && window.__SPIN.car.sweep) return res(true);
        if (Date.now() - t0 > 90000) return res(false);
        setTimeout(tick, 80);
      };
      tick();
    })`, 100000);
    const car = await cdp.eval('window.__SPIN.car.sweep()', 180000);
    report.car = car;
    note('car sweep fails ' + (car && car.fails ? car.fails.length : 'none'));
    for (const f of (car && car.fails) || ['car sweep missing']) report.fails.push('car ' + f);
    const carShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, 'car.png'), Buffer.from(carShot.data, 'base64'));

    const buildingOpen = await cdp.eval('window.__SPIN.open("building")');
    if (!buildingOpen || buildingOpen.failed) report.fails.push('building module failed to mount');
    const building = await cdp.eval('window.__SPIN.building && window.__SPIN.building.sweep()', 90000);
    report.building = building;
    note('building sweep fails ' + (building && building.fails ? building.fails.length : 'none'));
    for (const f of (building && building.fails) || ['building sweep missing']) report.fails.push('building ' + f);
    const bShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, 'building.png'), Buffer.from(bShot.data, 'base64'));

    const back = await cdp.eval('window.__SPIN.open("character")');
    if (!back || back.failed) report.fails.push('character failed after the other modules');
    else note('hub still opens characters after car and building');

    const touched = gameFilesTouched();
    if (touched.length) report.fails.push('game files changed ' + touched.join(', '));
    else note('index.html, world.html, jr.html, adventure sources untouched');
  } catch (err) {
    report.fails.push('checker ' + (err && err.stack || err));
    note(String(err && err.stack || err));
  } finally {
    try { if (ws) ws.close(); } catch (err) { /* closed */ }
    chrome.kill('SIGKILL');
    server.close();
  }
  report.pass = report.fails.length === 0;
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(OUT, 'log.txt'), log.join('\n') + '\n');
  console.log(report.pass ? 'PASS' : 'FAIL');
  console.log(report.fails.slice(0, 30).join('\n'));
  process.exit(report.pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
