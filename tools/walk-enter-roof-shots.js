/* Galaxy-sized proof: drive up, park, tap ENTER, land in the floor-level
   walk-in room. A jump-roof door must not teleport the car onto the roof. */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || '/opt/google/chrome/chrome';
const OUT = path.join(ROOT, 'test-results', 'dev-builder', 'walk-enter');
const ART = '/opt/cursor/artifacts/dev-builder/walk-enter';
const PORT = Number(process.env.PORT || 8795);
const GALAXY_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.webmanifest': 'application/manifest+json',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.glb': 'model/gltf-binary'
  })[ext] || 'application/octet-stream';
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const file = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing ' + url.pathname); return; }
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
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 60000);
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
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = String(res.status);
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('chrome not ready: ' + last);
}

function kill(child) {
  try { child.kill('SIGKILL'); } catch (e) {}
}

async function evalJson(cdp, expression, timeout) {
  const ev = await cdp.send('Runtime.evaluate', {
    expression: expression,
    returnByValue: true,
    awaitPromise: true
  }, timeout || 30000);
  if (ev.exceptionDetails) {
    const d = ev.exceptionDetails;
    throw new Error((d.exception && d.exception.description) || d.text || 'eval failed');
  }
  return ev.result && ev.result.value;
}

const READY = `(function () {
  try {
    if (typeof CITY === 'undefined' || !CITY.BL || !CITY.BL.length) return '';
    if (typeof P === 'undefined' || !P) return '';
    if (typeof WALK_MODE === 'undefined' || !WALK_MODE) return '';
    if (!window.INTERIOR_BUILDER || !document.getElementById('c')) return '';
    return 'ready';
  } catch (e) { return 'ERR ' + e.message; }
})()`;

function labelExpr(text) {
  return `(function () {
    var el = document.getElementById('zdShotLabel');
    if (!el) {
      el = document.createElement('div');
      el.id = 'zdShotLabel';
      el.style.cssText = 'position:fixed;top:36px;left:50%;transform:translateX(-50%);z-index:400;max-width:94vw;text-align:center;background:#12081c;color:#ffe14d;border:2px solid #3ee6ff;border-radius:12px;padding:6px 12px;font:700 14px Orbitron,sans-serif;letter-spacing:.3px;pointer-events:none';
      document.body.appendChild(el);
    }
    el.textContent = ${JSON.stringify(text)};
    return el.textContent;
  })()`;
}

const BOOT = `(function () {
  var over = document.getElementById('kOver');
  if (over) over.classList.add('hidden');
  var menu = document.getElementById('kMenuB');
  if (menu) menu.classList.remove('hidden');
  try { flying = true; paused = true; } catch (e) {}
  P.driveMode = 'street'; P.ground = true; P.v = 0; P.wreck = null; P.y = 0.2;
  return 'booted';
})()`;

const FIND = `(function () {
  var homes = [], jump = null;
  for (var i = 0; i < CITY.BL.length; i++) {
    var b = CITY.BL[i];
    if (!b) continue;
    if (b.purpose === 'SKY_DROP' && Math.abs((b.top || 0) - 62) < 1) {
      var door = (b.doors && b.doors[0]) || [b.cx, b.cz, 0, -1];
      var nx = door[2] || 0, nz = door[3] || 0, len = Math.hypot(nx, nz) || 1;
      jump = { purpose: 'SKY_DROP', top: b.top || 0, x: door[0] + nx / len * 6, z: door[1] + nz / len * 6, yaw: Math.atan2(nx, nz), name: b.purposeLabel || b.label || 'JUMP' };
    }
    if ((b.purpose !== 'HOME' && b.purpose !== 'CAFE') || !b.doors || !b.doors.length) continue;
    var rank = INTERIOR_BUILDER.exploreOf({ purpose: b.purpose, building: b });
    if (!rank) continue;
    var d0 = b.doors[0];
    var nx2 = d0[2] || 0, nz2 = d0[3] || 0, len2 = Math.hypot(nx2, nz2) || 1;
    nx2 /= len2; nz2 /= len2;
    homes.push({
      purpose: rank.purpose, n: rank.n, oid: b.oid, top: b.top || 0,
      x: d0[0] + nx2 * 6, z: d0[1] + nz2 * 6, yaw: Math.atan2(nx2, nz2),
      dx: d0[0], dz: d0[1], nx: nx2, nz: nz2
    });
  }
  homes.sort(function (a, c) { return a.purpose === c.purpose ? a.n - c.n : (a.purpose < c.purpose ? -1 : 1); });
  return JSON.stringify({ homes: homes, jump: jump });
})()`;

function placeCar(spot, v) {
  return `(function () {
    var s = ${JSON.stringify(spot)};
    var v = ${Number(v) || 0};
    P.x = s.x; P.z = s.z; P.y = 0.2; P.yaw = s.yaw; P.hd = s.yaw;
    P.v = v; P.ground = true; P.pitch = 0; P.bank = 0; P.wreck = null;
    P.driveMode = 'street';
    WALK_MODE.onFoot = false;
    WALK_MODE.insideBuilding = false;
    WALK_MODE.insideDoor = null;
    WALK_MODE._ibWorld = 0;
    WALK_MODE._ibCar = null;
    WALK_MODE._ibOrigin = null;
    WALK_MODE._roofY = null;
    WALK_MODE.y = 0;
    WALK_MODE.x = s.x; WALK_MODE.z = s.z; WALK_MODE.yaw = s.yaw;
    try { flying = true; paused = true; } catch (e) {}
    var card = document.getElementById('walk-interior');
    if (card) { card.classList.remove('show'); card.hidden = true; }
    if (document.body && document.body.dataset) delete document.body.dataset.ibRoom;
    return 'placed';
  })()`;
}

const SNAP = `(function () {
  function box(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    var s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return null;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    return { id: id, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  }
  var dev = box('devOpen'), jump = box('brk');
  var overlap = false;
  if (dev && jump) {
    var iw = Math.min(dev.x + dev.w, jump.x + jump.w) - Math.max(dev.x, jump.x);
    var ih = Math.min(dev.y + dev.h, jump.y + jump.h) - Math.max(dev.y, jump.y);
    overlap = iw > 2 && ih > 2;
  }
  var frame = document.getElementById('zdInteriorFrame');
  var doc = frame && frame.contentDocument;
  var enter = document.getElementById('enterBldBtn');
  var es = enter ? getComputedStyle(enter) : null;
  return JSON.stringify({
    y: P.y, wy: WALK_MODE.y, roof: WALK_MODE._roofY, onFoot: !!WALK_MODE.onFoot,
    world: !!WALK_MODE._ibWorld, x: WALK_MODE.x, v: P.v, ground: !!P.ground,
    room: (document.body.dataset && document.body.dataset.ibRoom) || '',
    walk: !!(doc && doc.body && doc.body.classList.contains('zd-walk')),
    legacy: !!(document.getElementById('walk-interior') && !document.getElementById('walk-interior').hidden && document.getElementById('walk-interior').classList.contains('show')),
    enter: enter && es && es.display !== 'none' ? (enter.innerText || '').replace(/\\s+/g, ' ').trim() : '',
    dev: dev, jump: jump, devHitsJump: overlap,
    err: window.IB_ERR || ''
  });
})()`;

const GET_OUT = `(function () {
  if (WALK_MODE.onFoot) return 'already';
  var ok = WALK_MODE.toggleGetOut && WALK_MODE.toggleGetOut();
  return ok ? 'out' : 'no';
})()`;

const TAP_ENTER = `(function () {
  var before = P.y;
  try { if (typeof walkSyncEnterBtn === 'function') walkSyncEnterBtn(); } catch (e) {}
  try { if (typeof syncEnterBldBtn === 'function') syncEnterBldBtn(); } catch (e2) {}
  var btn = document.getElementById('enterBldBtn');
  var shown = false;
  if (btn) {
    var s = getComputedStyle(btn);
    var r = btn.getBoundingClientRect();
    shown = s.display !== 'none' && s.visibility !== 'hidden' && r.width > 8 && r.height > 8;
  }
  if (shown && btn.click) btn.click();
  else if (WALK_MODE.enterDoor) WALK_MODE.enterDoor();
  return JSON.stringify({ via: shown ? 'enterBldBtn' : 'enterDoor', before: before, after: P.y, label: btn ? (btn.innerText || '').replace(/\\s+/g, ' ').trim() : '' });
})()`;

async function shot(cdp, name) {
  const pic = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const buf = Buffer.from(pic.data, 'base64');
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), buf);
  fs.writeFileSync(path.join(ART, name), buf);
  return buf.length;
}

async function bootChrome() {
  const cdpPort = 9633;
  const dir = '/tmp/walk-enter-roof';
  fs.rmSync(dir, { recursive: true, force: true });
  const child = spawn(CHROME, [
    '--headless=new',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--enable-low-end-device-mode',
    '--js-flags=--max-old-space-size=256',
    '--no-sandbox',
    '--hide-scrollbars',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=' + cdpPort,
    '--user-data-dir=' + dir,
    '--window-size=780,360',
    'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  let err = '';
  child.stderr.on('data', (d) => { err += d; });
  const ver = await waitJson('http://127.0.0.1:' + cdpPort + '/json/version');
  const list = await waitJson('http://127.0.0.1:' + cdpPort + '/json/list');
  const page = list.find((t) => t.type === 'page') || list[0];
  const cdp = new Cdp(page.webSocketDebuggerUrl || ver.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 780,
    height: 360,
    deviceScaleFactor: 2.6,
    mobile: true,
    screenOrientation: { type: 'landscapePrimary', angle: 90 }
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await cdp.send('Emulation.setUserAgentOverride', { userAgent: GALAXY_UA });
  return { child: child, cdp: cdp, err: function () { return err; } };
}

async function waitReady(cdp) {
  let last = '';
  for (let i = 0; i < 50; i++) {
    await sleep(400);
    try { last = await evalJson(cdp, READY); } catch (e) { last = 'err:' + e.message; }
    if (last === 'ready') return;
  }
  throw new Error('world did not boot ' + last);
}

async function snap(cdp) {
  return JSON.parse(await evalJson(cdp, SNAP));
}

async function main() {
  const server = await startServer();
  const chrome = await bootChrome();
  const log = { steps: [] };
  try {
    await chrome.cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/test/world.html' });
    await waitReady(chrome.cdp);
    await evalJson(chrome.cdp, BOOT);
    await sleep(500);
    const found = JSON.parse(await evalJson(chrome.cdp, FIND));
    const home = found.homes.find((h) => h.purpose === 'HOME' && h.n === 1) || found.homes[0];
    if (!home) throw new Error('no home door');
    log.home = home;
    log.jump = found.jump;
    const approach = {
      x: home.x - home.nx * 28,
      z: home.z - home.nz * 28,
      yaw: home.yaw
    };
    await evalJson(chrome.cdp, placeCar(approach, 14));
    await sleep(400);
    await evalJson(chrome.cdp, labelExpr('galaxy  driving toward HOME 1'));
    await shot(chrome.cdp, 'galaxy-1-driving.png');
    log.steps.push({ step: 'driving', state: await snap(chrome.cdp) });

    await evalJson(chrome.cdp, placeCar(home, 0));
    await sleep(300);
    await evalJson(chrome.cdp, labelExpr('galaxy  parked at HOME 1 door'));
    await shot(chrome.cdp, 'galaxy-2-parked.png');
    log.steps.push({ step: 'parked', state: await snap(chrome.cdp) });

    const out = await evalJson(chrome.cdp, GET_OUT);
    log.getOut = out;
    await sleep(400);
    const foot = await snap(chrome.cdp);
    log.steps.push({ step: 'on-foot', state: foot });
    if (foot.devHitsJump) throw new Error('DEV overlaps JUMP ' + JSON.stringify({ dev: foot.dev, jump: foot.jump }));
    await evalJson(chrome.cdp, labelExpr('galaxy  on foot at the door  DEV clear of JUMP'));
    await shot(chrome.cdp, 'galaxy-3-on-foot.png');

    const py = foot.y;
    const tapped = JSON.parse(await evalJson(chrome.cdp, TAP_ENTER));
    log.tapped = tapped;
    let room = null;
    for (let i = 0; i < 40; i++) {
      await sleep(250);
      room = await snap(chrome.cdp);
      if (room.world && room.walk && room.x > 8000 && !room.legacy) break;
    }
    log.steps.push({ step: 'room', state: room });
    if (!room || !room.world || !room.walk || room.legacy) throw new Error('enter did not open the room ' + JSON.stringify(room));
    if (room.roof != null) throw new Error('roof lock still set ' + JSON.stringify(room));
    if (Math.abs(room.wy) > 0.2) throw new Error('walker is not on the room floor ' + JSON.stringify(room));
    if (room.y > 8) throw new Error('car was sent to a roof ' + JSON.stringify(room) + ' from ' + py);
    await evalJson(chrome.cdp, labelExpr('galaxy  HOME 1 walk-in room  floor level'));
    await sleep(600);
    await shot(chrome.cdp, 'galaxy-4-room.png');

    await evalJson(chrome.cdp, 'INTERIOR_BUILDER.leaveToCar(WALK_MODE); "left"');
    await sleep(300);
    if (!found.jump) throw new Error('jump roof missing');
    await evalJson(chrome.cdp, placeCar(found.jump, 0));
    await sleep(200);
    const before = await snap(chrome.cdp);
    await evalJson(chrome.cdp, TAP_ENTER);
    let jumped = null;
    for (let i = 0; i < 40; i++) {
      await sleep(250);
      jumped = await snap(chrome.cdp);
      if (jumped.world && jumped.walk && jumped.x > 8000) break;
    }
    log.steps.push({ step: 'jump-roof', before: before, after: jumped });
    if (!jumped.world || !jumped.walk || jumped.legacy) throw new Error('jump roof did not open a room ' + JSON.stringify(jumped));
    if (jumped.roof != null) throw new Error('jump roof locked the rooftop ' + JSON.stringify(jumped));
    if (Math.abs(jumped.y - before.y) > 3) throw new Error('jump roof moved the car ' + JSON.stringify({ before: before.y, after: jumped.y }));
    if (jumped.y > 8) throw new Error('jump roof still at altitude ' + jumped.y);
    await evalJson(chrome.cdp, labelExpr('galaxy  JUMP roof ENTER opens the room  not ALT 62'));
    await sleep(500);
    await shot(chrome.cdp, 'galaxy-5-jump-roof-room.png');
    log.ok = true;
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, 'log.json'), JSON.stringify(log, null, 2));
    fs.mkdirSync(ART, { recursive: true });
    fs.writeFileSync(path.join(ART, 'log.json'), JSON.stringify(log, null, 2));
    console.log(JSON.stringify(log, null, 2));
  } finally {
    kill(chrome.child);
    chrome.cdp.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err && err.stack || err);
  process.exit(1);
});
