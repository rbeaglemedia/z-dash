/* ENTER / BUILD / EXIT overlap check and labeled shots.
   One Chrome at a time. A shared edge is not a hit (1px inset). */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || '/opt/google/chrome/chrome';
const OUT = path.join(ROOT, 'test-results', 'dev-builder', 'walk-act');
const ART = '/opt/cursor/artifacts/dev-builder/walk-act';
const PORT = Number(process.env.PORT || 8791);
const GALAXY_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const VIEWPORTS = [
  { id: 'phone-844', width: 844, height: 390, dpr: 2, mobile: true, ua: GALAXY_UA },
  { id: 'galaxy-780', width: 780, height: 360, dpr: 3, mobile: true, ua: GALAXY_UA },
  { id: 'ipad-1024', width: 1024, height: 768, dpr: 2, mobile: true, ua: '' },
  { id: 'pc-1366', width: 1366, height: 768, dpr: 1, mobile: false, ua: '' }
];

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
    throw new Error((d.exception && d.exception.description) || d.text || JSON.stringify(d).slice(0, 600));
  }
  return ev.result && ev.result.value;
}

const READY = `(function () {
  try {
    if (typeof CITY === 'undefined' || !CITY.BL || !CITY.BL.length) return '';
    if (typeof P === 'undefined' || !P) return '';
    if (typeof WALK_MODE === 'undefined' || !WALK_MODE) return '';
    if (!window.INTERIOR_BUILDER || !document.getElementById('brk')) return '';
    return 'ready';
  } catch (e) { return 'ERR ' + e.message; }
})()`;

const DISMISS = `(function () {
  var over = document.getElementById('kOver');
  if (over) { over.classList.add('hidden'); over.style.display = 'none'; }
  var home = document.getElementById('kHome');
  if (home) home.classList.add('hidden');
  var menu = document.getElementById('kMenuB');
  if (menu) menu.classList.remove('hidden');
  try { flying = true; } catch (e) {}
  try { paused = true; } catch (e) {}
  if (typeof setDriveMode === 'function') setDriveMode('street', true);
  else P.driveMode = 'street';
  P.v = 0; P.ground = true; P.pitch = 0; P.wreck = false; P.y = 0.2;
  WALK_MODE.onFoot = false;
  WALK_MODE.insideBuilding = false;
  var spots = [];
  for (var i = 0; i < CITY.BL.length; i++) {
    var b = CITY.BL[i];
    if (!b || (b.purpose !== 'HOME' && b.purpose !== 'CAFE') || !b.doors) continue;
    for (var d = 0; d < b.doors.length; d++) {
      var door = b.doors[d];
      var nx = door[2] || 0, nz = door[3] || 0, len = Math.hypot(nx, nz) || 1;
      nx /= len; nz /= len;
      spots.push({
        x: door[0] + nx * 5.5, z: door[1] + nz * 5.5, yaw: Math.atan2(nx, nz),
        purpose: b.purpose, oid: b.oid, sign: (b.sign && (b.sign.word || b.sign.t)) || b.purpose
      });
    }
  }
  return JSON.stringify(spots);
})()`;

function parkAt(spot) {
  return `(function () {
    var s = ${JSON.stringify(spot)};
    P.x = s.x; P.z = s.z; P.y = 0.2; P.yaw = s.yaw; P.hd = s.yaw;
    P.v = 0; P.ground = true; P.pitch = 0; P.bank = 0; P.wreck = false;
    P.driveMode = 'street';
    WALK_MODE.onFoot = false;
    WALK_MODE.insideBuilding = false;
    WALK_MODE.insideDoor = null;
    WALK_MODE._ibCar = null;
    WALK_MODE.x = s.x; WALK_MODE.z = s.z;
    try { flying = true; paused = true; } catch (e) {}
    var card = document.getElementById('walk-interior');
    if (card) { card.classList.remove('show'); card.hidden = true; }
    return 'parked';
  })()`;
}

const MODE = `(function () {
  var b = document.getElementById('zdWalkAct');
  if (!b) return '';
  return (b.classList.contains('show') ? 'show:' : 'hide:') + (b.getAttribute('data-mode') || '') + ':' + (b.textContent || '').replace(/\\s+/g, ' ').trim();
})()`;

const MEASURE = `(function () {
  function shown(el) {
    if (!el || !el.getBoundingClientRect) return null;
    if (el.id === 'zdWalkAct' || el.id === 'zdShotLabel') return null;
    if (el.closest && el.closest('#zdShotLabel')) return null;
    var s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05) return null;
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return null;
    if (r.bottom <= 1 || r.right <= 1 || r.top >= innerHeight - 1 || r.left >= innerWidth - 1) return null;
    var id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
    var text = (el.innerText || el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 42);
    return { id: id, text: text, x: r.left, y: r.top, w: r.width, h: r.height };
  }
  var boxes = [];
  var seen = {};
  function add(box) {
    if (!box) return;
    var key = box.id + '@' + Math.round(box.x) + ',' + Math.round(box.y);
    if (seen[key]) return;
    seen[key] = 1;
    boxes.push(box);
  }
  document.querySelectorAll('button, a, input, [role="button"]').forEach(function (el) { add(shown(el)); });
  ['brk','nos','tup','wng','kMenuB','emoteBtn','exitCarBtn','enterBldBtn','ebpad','devOpen','devEnter','pcFps','zdWalkFps','walk-step-out','walk-open-page'].forEach(function (id) {
    add(shown(document.getElementById(id)));
  });
  var card = document.getElementById('walk-interior');
  var inside = !!(card && card.classList.contains('show'));
  var cv = document.getElementById('c');
  var cr = cv ? cv.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight };
  var ipad = document.documentElement.classList.contains('ipad-mode');
  var pc = document.documentElement.classList.contains('pc-mode');
  var bufH = cv && cv.height ? cv.height : innerHeight;
  var bufW = cv && cv.width ? cv.width : innerWidth;
  var scale = ipad ? 1 : Math.max(0.72, Math.min(1.35, bufH / 378));
  var sx = cr.width / bufW, sy = cr.height / bufH;
  var map = null;
  if (ipad && typeof zIpadChrome === 'function') {
    var cssL = zIpadChrome(innerWidth, innerHeight);
    if (cssL && cssL.map) map = { id: 'minimap', text: 'minimap', x: cssL.map.x, y: cssL.map.y, w: cssL.map.w, h: cssL.map.h };
  }
  if (!map) {
    var Wd = bufW / scale;
    var mapW = Math.min(196, Math.max(96, Wd / 2 - 79));
    map = { id: 'minimap', text: 'minimap', x: cr.left + 12 * scale * sx, y: cr.top + 10 * scale * sy, w: mapW * scale * sx, h: 134 * scale * sy };
  }
  add(map);
  var fpsDom = document.getElementById('pcFps');
  var fpsWalk = document.getElementById('zdWalkFps');
  var fpsShown = shown(fpsDom) || shown(fpsWalk);
  if (!fpsShown && !inside) {
    if (ipad && typeof zIpadChrome === 'function') {
      var tel = zIpadChrome(innerWidth, innerHeight);
      if (tel && tel.tel) add({ id: 'canvas-fps', text: 'FPS', x: tel.tel.x + tel.tel.w - 72, y: tel.tel.y + 2, w: 64, h: 16 });
    } else if (!pc) {
      var Wd2 = bufW / scale;
      var right = cr.left + (Wd2 - 16) * scale * sx;
      var base = cr.top + 134 * scale * sy;
      add({ id: 'canvas-fps', text: 'FPS', x: right - 54, y: base - 12, w: 54, h: 14 });
    }
  }
  var act = document.getElementById('zdWalkAct');
  var ar = act ? act.getBoundingClientRect() : null;
  var self = ar ? { id: 'zdWalkAct', text: (act.textContent || '').replace(/\\s+/g, ' ').trim(), x: ar.left, y: ar.top, w: ar.width, h: ar.height, mode: act.getAttribute('data-mode') || '' } : null;
  function hit(a, b) {
    var iw = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    var ih = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (iw <= 1 || ih <= 1) return null;
    return { id: b.id, text: b.text, iw: Math.round(iw * 10) / 10, ih: Math.round(ih * 10) / 10 };
  }
  var hits = [];
  var nearest = null;
  if (self) {
    boxes.forEach(function (b) {
      var h = hit(self, b);
      if (h) hits.push(h);
      var gx = 0, gy = 0;
      if (self.x + self.w < b.x) gx = b.x - (self.x + self.w);
      else if (b.x + b.w < self.x) gx = self.x - (b.x + b.w);
      if (self.y + self.h < b.y) gy = b.y - (self.y + self.h);
      else if (b.y + b.h < self.y) gy = self.y - (b.y + b.h);
      var gap = gx && gy ? Math.hypot(gx, gy) : (gx || gy);
      if (!nearest || gap < nearest.gap) nearest = { id: b.id, text: b.text, gap: Math.round(gap * 10) / 10 };
    });
  }
  var clipped = !self || self.x < -1 || self.y < -1 || self.x + self.w > innerWidth + 1 || self.y + self.h > innerHeight + 1;
  var fpsText = '';
  if (fpsDom && shown(fpsDom)) fpsText = fpsDom.textContent || '';
  else if (fpsWalk && shown(fpsWalk)) fpsText = fpsWalk.textContent || '';
  else if (typeof fps === 'number') fpsText = Math.round(fps) + ' FPS';
  return JSON.stringify({
    mode: self ? self.mode : '',
    button: self,
    hits: hits,
    nearest: nearest,
    clipped: clipped,
    pass: !!(self && self.w > 40 && self.h > 30 && !clipped && !hits.length && self.mode),
    fps: fpsText,
    ipad: ipad,
    pc: pc,
    dev: !!(document.getElementById('devOpen') && shown(document.getElementById('devOpen'))),
    boxes: boxes.map(function (b) { return { id: b.id, text: b.text, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h) }; })
  });
})()`;

function labelExpr(text) {
  return `(function () {
    var el = document.getElementById('zdShotLabel');
    if (!el) {
      el = document.createElement('div');
      el.id = 'zdShotLabel';
      el.style.cssText = 'position:fixed;top:78px;left:50%;transform:translateX(-50%);z-index:200;max-width:92vw;text-align:center;background:#12081c;color:#ffe14d;border:2px solid #3ee6ff;border-radius:12px;padding:6px 12px;font:700 13px Orbitron,sans-serif;letter-spacing:.3px;pointer-events:none';
      document.body.appendChild(el);
    }
    el.textContent = ${JSON.stringify(text)};
    return el.textContent;
  })()`;
}

const SEED = `(function () {
  var IB = window.INTERIOR_BUILDER;
  var wm = window.WALK_MODE;
  var door = null;
  var best = 1e9;
  for (var i = 0; i < CITY.BL.length; i++) {
    var b = CITY.BL[i];
    if (!b || b.purpose !== 'HOME' || !b.doors) continue;
    for (var d = 0; d < b.doors.length; d++) {
      var doorA = b.doors[d];
      var dist = Math.hypot(doorA[0] - P.x, doorA[1] - P.z);
      if (dist < best) {
        best = dist;
        door = { x: doorA[0], z: doorA[1], nx: doorA[2] || 0, nz: doorA[3] || 0, purpose: 'HOME', building: b, buildingId: b.id };
      }
    }
  }
  if (!door) return JSON.stringify({ ok: false, error: 'no HOME door' });
  var FT = 0.3048, W = 24, D = 16;
  function wall(x, z, a, w, depth) {
    return { kind: 'wall', name: 'Wall', x: x * FT, z: z * FT, a: a, w: w * FT, d: depth * FT };
  }
  var half = (W - 3) / 2;
  var pack = {
    title: 'HOME 1',
    floor: { minX: 0, maxX: W * FT, minZ: 0, maxZ: D * FT, polys: [[[0, 0], [W * FT, 0], [W * FT, D * FT], [0, D * FT]]], rects: [] },
    walls: [
      wall(half / 2, 0, 0, half, 0.33),
      wall(W - half / 2, 0, 0, half, 0.33),
      wall(W, D / 2, Math.PI / 2, D, 0.33),
      wall(W / 2, D, Math.PI, W, 0.33),
      wall(0, D / 2, -Math.PI / 2, D, 0.33)
    ],
    items: [{ kind: 'item', name: 'Table', x: (W / 2) * FT, z: (D / 2) * FT, a: 0, w: 6 * FT, d: 2.5 * FT }]
  };
  var layout = JSON.stringify({ walls: [{ pts: [[0, 0], [W, 0], [W, D], [0, D]], closed: true, doors: [{ i: 0, t: W / 2, w: 3 }] }] });
  var id = 'HOME:' + door.building.oid;
  IB.remember(id, layout, pack);
  IB.enterExplore(wm, door, window.walkEnterDoor && window.walkEnterDoor._ibOrig);
  if (wm.room) {
    wm.room.x = (W * FT) / 2;
    wm.room.z = (D * FT) / 2;
    wm.room._ib = 1;
  }
  try { walkPaintRoom(); } catch (e) {}
  var saved = IB.pack(id);
  return JSON.stringify({
    ok: true,
    id: id,
    oid: door.building.oid,
    doors: saved && saved.doors ? saved.doors.length : 0,
    items: saved && saved.items ? saved.items.length : 0,
    inside: !!wm.insideBuilding,
    onFoot: !!wm.onFoot,
    car: wm._ibCar || null,
    carNow: { x: P.x, z: P.z }
  });
})()`;

const TO_EXIT = `(function () {
  var wm = WALK_MODE;
  var door = wm.insideDoor;
  var id = 'HOME:' + (door && door.building && door.building.oid);
  var pack = INTERIOR_BUILDER.pack(id);
  var d0 = pack && pack.doors && pack.doors[0];
  if (!d0 || !wm.room) return JSON.stringify({ ok: false, error: 'no saved door' });
  wm.room.x = d0.x + d0.nx * 0.35;
  wm.room.z = d0.z + d0.nz * 0.35;
  wm.room._ib = 1;
  try { walkPaintRoom(); } catch (e) {}
  return JSON.stringify({ ok: true, x: wm.room.x, z: wm.room.z });
})()`;

const LEAVE = `(function () {
  var wm = WALK_MODE;
  var car = wm._ibCar ? { x: wm._ibCar.x, z: wm._ibCar.z, yaw: wm._ibCar.yaw } : null;
  INTERIOR_BUILDER.leaveToCar(wm);
  if (car) { P.x = car.x; P.z = car.z; P.yaw = car.yaw; P.hd = car.yaw; P.v = 0; P.ground = true; }
  try { paused = true; } catch (e) {}
  return JSON.stringify({ ok: true, onFoot: !!wm.onFoot, inside: !!wm.insideBuilding, x: P.x, z: P.z, yaw: P.yaw });
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

async function bootChrome(vp) {
  const cdpPort = 9510 + VIEWPORTS.indexOf(vp);
  const dir = '/tmp/walk-act-shot-' + vp.id;
  fs.rmSync(dir, { recursive: true, force: true });
  const child = spawn(CHROME, [
    '--headless=new',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--no-sandbox',
    '--hide-scrollbars',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=' + cdpPort,
    '--user-data-dir=' + dir,
    '--window-size=' + vp.width + ',' + vp.height,
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
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.dpr,
    mobile: vp.mobile,
    screenOrientation: { type: 'landscapePrimary', angle: 90 }
  });
  if (vp.mobile) await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (vp.ua) await cdp.send('Emulation.setUserAgentOverride', { userAgent: vp.ua });
  return { child: child, cdp: cdp, err: function () { return err; } };
}

async function waitReady(cdp, vp) {
  let last = '';
  for (let i = 0; i < 80; i++) {
    await sleep(500);
    try { last = await evalJson(cdp, READY); } catch (e) { last = e.message; }
    if (last === 'ready') return;
  }
  throw new Error(vp.id + ' did not boot ' + last);
}

async function waitMode(cdp, want) {
  let last = '';
  for (let i = 0; i < 20; i++) {
    await sleep(100);
    last = await evalJson(cdp, MODE);
    if (last && last.indexOf('show:' + want) === 0) return last;
  }
  return last;
}

async function measure(cdp, vp, phase, caption) {
  const raw = await evalJson(cdp, MEASURE);
  const info = JSON.parse(raw);
  const fps = (info.fps || '').replace(/\s+/g, ' ').trim();
  await evalJson(cdp, labelExpr(vp.width + '×' + vp.height + ' · ' + caption + (fps ? ' · ' + fps : '')));
  await sleep(120);
  const file = vp.id + '-' + phase + '.png';
  const bytes = await shot(cdp, file);
  info.phase = phase;
  info.file = file;
  info.bytes = bytes;
  info.viewport = vp.id;
  info.size = vp.width + 'x' + vp.height;
  return info;
}

async function shootDevice(vp) {
  const boot = await bootChrome(vp);
  const row = { id: vp.id, width: vp.width, height: vp.height, phases: [] };
  try {
    await boot.cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/test/world.html?apply=0' });
    await waitReady(boot.cdp, vp);
    const spots = JSON.parse(await evalJson(boot.cdp, DISMISS));
    if (!spots.length) throw new Error(vp.id + ' has no HOME or CAFE door');
    let parked = null;
    let mode = '';
    for (const spot of spots) {
      await evalJson(boot.cdp, parkAt(spot));
      mode = await waitMode(boot.cdp, 'enter');
      if (mode.indexOf('show:enter') === 0) { parked = spot; break; }
    }
    if (!parked) throw new Error(vp.id + ' ENTER did not show ' + mode);
    let carReady = '';
    for (let i = 0; i < 24; i++) {
      await sleep(250);
      carReady = await evalJson(boot.cdp, `(function () {
        try {
          var ready = !!(window.ZD && ZD.Xray && ZD.Xray.ready && window.ZGL && ZGL.ensure && ZGL.ensure());
          return ready ? 'ready' : 'wait';
        } catch (e) { return 'ERR ' + e.message; }
      })()`);
      if (carReady === 'ready') break;
    }
    row.carReady = carReady;
    row.pose = JSON.parse(await evalJson(boot.cdp, `(function () {
      var p = (typeof proj === 'function') ? proj(P.x, (P.y || 0) + 0.7, P.z) : null;
      return JSON.stringify({
        screen: p,
        cam: { x: cam.x, y: cam.y, z: cam.z, yaw: cam.yaw, pitch: cam.pitch },
        car: { x: P.x, z: P.z, y: P.y, yaw: P.yaw },
        back: window.FLYCAM && FLYCAM.back,
        up: window.FLYCAM && FLYCAM.up
      });
    })()`));
    console.log(vp.id, 'pose', JSON.stringify(row.pose));
    await evalJson(boot.cdp, parkAt(parked));
    await sleep(250);
    row.parked = parked;
    row.phases.push(await measure(boot.cdp, vp, 'enter', 'ENTER ' + parked.purpose + ' · car parked outside'));
    if (parked.purpose === 'HOME') {
      const seeded = JSON.parse(await evalJson(boot.cdp, SEED));
      if (!seeded.ok) throw new Error(vp.id + ' seed ' + seeded.error);
      mode = await waitMode(boot.cdp, 'build');
      if (mode.indexOf('show:build') !== 0) throw new Error(vp.id + ' BUILD did not show ' + mode + ' ' + JSON.stringify(seeded));
      await sleep(300);
      row.seed = seeded;
      row.phases.push(await measure(boot.cdp, vp, 'inside', 'INSIDE HOME 1 · saved layout · BUILD'));
      const atDoor = JSON.parse(await evalJson(boot.cdp, TO_EXIT));
      if (!atDoor.ok) throw new Error(vp.id + ' exit spot ' + atDoor.error);
      mode = await waitMode(boot.cdp, 'exit');
      if (mode.indexOf('show:exit') !== 0) throw new Error(vp.id + ' EXIT did not show ' + mode);
      row.phases.push(await measure(boot.cdp, vp, 'exit', 'EXIT · at the door'));
      if (vp.id === 'phone-844') {
        const left = JSON.parse(await evalJson(boot.cdp, LEAVE));
        mode = await waitMode(boot.cdp, 'enter');
        row.left = left;
        row.phases.push(await measure(boot.cdp, vp, 'returned', 'BACK AT THE CAR · ' + (mode.indexOf('show:enter') === 0 ? 'ENTER' : mode)));
      }
    }
    boot.cdp.close();
    return row;
  } catch (e) {
    try {
      await shot(boot.cdp, vp.id + '-fail.png');
    } catch (e2) {}
    throw e;
  } finally {
    kill(boot.child);
    await sleep(400);
  }
}

(async function () {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });
  const server = await startServer();
  const rows = [];
  try {
    for (const vp of VIEWPORTS) {
      if (process.env.ONLY && process.env.ONLY !== vp.id) continue;
      const row = await shootDevice(vp);
      rows.push(row);
      console.log(vp.id, 'car', row.carReady);
      row.phases.forEach((p) => {
        console.log(vp.id, p.phase, p.pass ? 'PASS' : 'FAIL', 'mode', p.mode, 'hits', (p.hits || []).map((h) => h.id + ' ' + h.iw + 'x' + h.ih).join(',') || 'none', 'nearest', p.nearest && (p.nearest.id + ' ' + p.nearest.gap), 'fps', p.fps);
      });
    }
  } finally {
    server.close();
  }
  const failed = [];
  rows.forEach((r) => r.phases.forEach((p) => { if (!p.pass) failed.push(r.id + ':' + p.phase); }));
  const out = {
    note: 'Bounding boxes inset by 1px. A shared edge is not an overlap. Compared with every visible button, the drive controls, the minimap, the DEV button, and the FPS.',
    failed: failed,
    rows: rows
  };
  fs.writeFileSync(path.join(OUT, 'overlap.json'), JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(ART, 'overlap.json'), JSON.stringify(out, null, 2));
  console.log('overlap', failed.length ? 'FAIL ' + failed.join(' ') : 'PASS');
  if (failed.length) process.exit(2);
})().catch((e) => { console.error(e); process.exit(1); });
