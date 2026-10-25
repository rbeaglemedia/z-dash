/* Phone proof: HOME 1 opens the outdoor walk-in, BUILD opens the planner,
   a placed item comes back into the room. Fresh Chrome profile, no cache. */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || '/opt/google/chrome/chrome';
const OUT = path.join(ROOT, 'test-results', 'dev-builder', 'walk-planner');
const ART = '/opt/cursor/artifacts/dev-builder/walk-planner';
const PORT = Number(process.env.PORT || 8794);
const GALAXY_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const ALL_VIEWPORTS = [
  { id: 'phone-844', width: 844, height: 390, dpr: 2, mobile: true, ua: GALAXY_UA },
  { id: 'galaxy-780', width: 780, height: 360, dpr: 3, mobile: true, ua: GALAXY_UA },
  { id: 'ipad-1024', width: 1024, height: 768, dpr: 1, mobile: true, ua: '' },
  { id: 'pc-1366', width: 1366, height: 768, dpr: 1, mobile: false, ua: '' }
];
const VIEWPORTS = process.env.ONLY
  ? ALL_VIEWPORTS.filter((v) => v.id.indexOf(process.env.ONLY) >= 0)
  : ALL_VIEWPORTS;

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
      el.style.cssText = 'position:fixed;top:36px;left:50%;transform:translateX(-50%);z-index:300;max-width:94vw;text-align:center;background:#12081c;color:#ffe14d;border:2px solid #3ee6ff;border-radius:12px;padding:6px 12px;font:700 14px Orbitron,sans-serif;letter-spacing:.3px;pointer-events:none';
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
  P.driveMode = 'street'; P.ground = true; P.v = 0; P.wreck = null;
  return 'booted';
})()`;

const FIND = `(function () {
  var homes = [];
  for (var i = 0; i < CITY.BL.length; i++) {
    var b = CITY.BL[i];
    if (!b || (b.purpose !== 'HOME' && b.purpose !== 'CAFE') || !b.doors || !b.doors.length) continue;
    var sign = (b.sign && (b.sign.word || b.sign.t)) || '';
    var rank = INTERIOR_BUILDER.exploreOf({ purpose: b.purpose, building: b });
    if (!rank) continue;
    var door = b.doors[0];
    var nx = door[2] || 0, nz = door[3] || 0, len = Math.hypot(nx, nz) || 1;
    nx /= len; nz /= len;
    homes.push({
      purpose: rank.purpose, n: rank.n, oid: b.oid, sign: sign,
      x: door[0] + nx * 6, z: door[1] + nz * 6, yaw: Math.atan2(nx, nz),
      dx: door[0], dz: door[1], nx: nx, nz: nz
    });
  }
  homes.sort(function (a, c) { return a.purpose === c.purpose ? a.n - c.n : (a.purpose < c.purpose ? -1 : 1); });
  return JSON.stringify(homes);
})()`;

function parkAt(spot) {
  return `(function () {
    var s = ${JSON.stringify(spot)};
    P.x = s.x; P.z = s.z; P.y = 0.2; P.yaw = s.yaw; P.hd = s.yaw;
    P.v = 0; P.ground = true; P.pitch = 0; P.bank = 0; P.wreck = null;
    P.driveMode = 'street';
    WALK_MODE.onFoot = false;
    WALK_MODE.insideBuilding = false;
    WALK_MODE.insideDoor = null;
    WALK_MODE._ibWorld = 0;
    WALK_MODE._ibCar = null;
    WALK_MODE._ibOrigin = null;
    WALK_MODE.x = s.x; WALK_MODE.z = s.z; WALK_MODE.yaw = s.yaw;
    try { flying = true; paused = true; } catch (e) {}
    var card = document.getElementById('walk-interior');
    if (card) { card.classList.remove('show'); card.hidden = true; }
    return 'parked';
  })()`;
}

const STATE = `(function () {
  var card = document.getElementById('walk-interior');
  var act = document.getElementById('zdWalkAct');
  var dev = document.getElementById('devOpen');
  var enter = document.getElementById('enterBldBtn');
  var legacy = card && !card.hidden && card.classList.contains('show');
  var text = legacy ? (card.innerText || '') : '';
  var devShown = false;
  if (dev) {
    var s = getComputedStyle(dev);
    devShown = s.display !== 'none' && s.visibility !== 'hidden';
  }
  var enterShown = false;
  if (enter) {
    var es = getComputedStyle(enter);
    var er = enter.getBoundingClientRect();
    enterShown = es.display !== 'none' && er.width > 8 && er.height > 8;
  }
  return JSON.stringify({
    world: !!(WALK_MODE && WALK_MODE._ibWorld),
    inside: !!(WALK_MODE && WALK_MODE.insideBuilding),
    onFoot: !!(WALK_MODE && WALK_MODE.onFoot),
    x: WALK_MODE ? WALK_MODE.x : 0,
    z: WALK_MODE ? WALK_MODE.z : 0,
    room: document.body && document.body.dataset ? document.body.dataset.ibRoom || '' : '',
    legacy: !!legacy,
    legacyText: text.replace(/\\s+/g, ' ').trim().slice(0, 180),
    act: act ? ((act.classList.contains('show') ? 'show:' : 'hide:') + (act.getAttribute('data-mode') || '') + ':' + (act.textContent || '').replace(/\\s+/g, ' ').trim()) : '',
    dev: devShown,
    enterTop: enterShown,
    fps: (document.getElementById('zdWalkFps') && document.getElementById('zdWalkFps').textContent) || (typeof fps === 'number' ? Math.round(fps) + ' FPS' : ''),
    planner: !!(document.getElementById('zdInterior') && document.getElementById('zdInterior').style.display === 'block'),
    walk: (function () {
      var f = document.getElementById('zdInteriorFrame');
      var doc = f && f.contentDocument;
      return !!(doc && doc.body && doc.body.classList.contains('zd-walk') && doc.body.dataset.ready === '1');
    })(),
    edit: (function () {
      var f = document.getElementById('zdInteriorFrame');
      var doc = f && f.contentDocument;
      return !!(doc && doc.body && doc.body.dataset.ready === '1' && !doc.body.classList.contains('zd-walk'));
    })(),
    hold: WALK_MODE ? (WALK_MODE.cityHoldFrames || 0) : 0,
    paused: !!(WALK_MODE && WALK_MODE._ibHold),
    actor: (function () {
      var f = document.getElementById('zdInteriorFrame');
      var esp = f && f.contentWindow && f.contentWindow.ESP;
      if (!esp || !esp.scene) return 0;
      var n = 0;
      esp.scene.traverse(function (o) {
        if (o.name === 'zdWalkActor') n = o.children.filter(function (c) { return c.visible; }).length;
      });
      return n;
    })(),
    rail: (function () {
      var f = document.getElementById('zdInteriorFrame');
      var doc = f && f.contentDocument;
      var rail = doc && doc.getElementById('rail');
      return rail ? (rail.innerText || '').replace(/\\s+/g, ' ').trim() : '';
    })(),
    hud: (function () {
      var b = document.getElementById('tup');
      if (!b) return '';
      var r = b.getBoundingClientRect();
      return ((b.textContent || '') + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)).replace(/\\s+/g, ' ');
    })(),
    crewErr: window.IB_ERR || ''
  });
})()`;

const OVERLAP = `(function () {
  function box(el) {
    if (!el) return null;
    var view = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    var s = view.getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return null;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    var x = r.left, y = r.top, right = r.right, bottom = r.bottom;
    if (view !== window && view.frameElement) {
      var fr = view.frameElement.getBoundingClientRect();
      x += fr.left; y += fr.top; right += fr.left; bottom += fr.top;
    }
    return { name: el.id || (el.textContent || '').slice(0, 24), x: x, y: y, r: right, b: bottom, w: r.width, h: r.height };
  }
  var nodes = ['tup','nos','brk','wng','emoteBtn','exitCarBtn','kMenuB','zdWalkAct','zdWalkExit','zdWalkFps','devOpen'].map(function (id) { return box(document.getElementById(id)); }).filter(Boolean);
  var frame = document.getElementById('zdInteriorFrame');
  var doc = frame && frame.contentDocument;
  if (doc) {
    var rail = doc.getElementById('rail');
    if (rail) [].forEach.call(rail.querySelectorAll('button'), function (b) { var q = box(b); if (q) nodes.push(q); });
  }
  var hits = [];
  for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
    var a = nodes[i], c = nodes[j];
    var iw = Math.min(a.r, c.r) - Math.max(a.x, c.x);
    var ih = Math.min(a.b, c.b) - Math.max(a.y, c.y);
    if (iw > 2 && ih > 2) hits.push(a.name + ' x ' + c.name + ' ' + Math.round(iw) + 'x' + Math.round(ih));
  }
  var clip = nodes.filter(function (n) { return n.x < -1 || n.y < -1 || n.r > innerWidth + 1 || n.b > innerHeight + 1; }).map(function (n) { return n.name; });
  return JSON.stringify({ bad: hits.length > 0 || clip.length > 0, hits: hits, clip: clip, n: nodes.length, boxes: nodes.map(function (n) { return n.name + ' ' + Math.round(n.x) + ',' + Math.round(n.y) + ' ' + Math.round(n.w) + 'x' + Math.round(n.h); }) });
})()`;

const CLICK_ACT = `(function () {
  var b = document.getElementById('zdWalkAct');
  if (!b || !b.classList.contains('show')) return 'missing';
  b.click();
  return 'clicked';
})()`;

const PLANNER = `(function () {
  var frame = document.getElementById('zdInteriorFrame');
  if (!frame || !frame.contentDocument || !frame.contentDocument.body) return JSON.stringify({ ready: false });
  var doc = frame.contentDocument;
  function txt(sel) {
    var el = doc.querySelector(sel);
    return el ? (el.textContent || '').replace(/\\s+/g, ' ').trim() : '';
  }
  return JSON.stringify({
    ready: doc.body.dataset.ready === '1',
    box: txt('[data-tool="box"]'),
    walls: txt('[data-tool="walls"]'),
    door: txt('[data-tool="door"]'),
    place: txt('[data-phase="place"]'),
    build: txt('[data-phase="build"]'),
    size: txt('#sizeLbl'),
    editing: !doc.body.classList.contains('zd-walk')
  });
})()`;

const PLACE = `(function () {
  var frame = document.getElementById('zdInteriorFrame');
  var doc = frame && frame.contentDocument;
  if (!doc) return 'no-frame';
  var place = doc.querySelector('[data-phase="place"]');
  if (place) place.click();
  var add = doc.querySelector('#btnAdd');
  if (add) add.click();
  var cat = doc.querySelector('.cat');
  if (!cat) return 'no-cat';
  cat.click();
  var prod = doc.querySelector('.prod');
  if (!prod) return 'no-prod';
  var name = (prod.querySelector('b') && prod.querySelector('b').textContent) || prod.getAttribute('data-id');
  prod.click();
  var home = doc.querySelector('#btnHome');
  if (home) home.click();
  return name || 'placed';
})()`;

const ITEM = `(function () {
  var door = WALK_MODE && WALK_MODE.insideDoor;
  var id = INTERIOR_BUILDER.roomOf(door);
  var pack = INTERIOR_BUILDER.pack(id);
  var items = pack && pack.items ? pack.items.map(function (it) { return it.name; }) : [];
  return JSON.stringify({ id: id, items: items, world: !!(WALK_MODE && WALK_MODE._ibWorld), legacy: !!(document.getElementById('walk-interior') && !document.getElementById('walk-interior').hidden && document.getElementById('walk-interior').classList.contains('show')) });
})()`;

const ALL_DOORS = `(function () {
  var out = [];
  var saved = {
    onFoot: WALK_MODE.onFoot, x: P.x, z: P.z, yaw: P.yaw
  };
  for (var i = 0; i < CITY.BL.length; i++) {
    var b = CITY.BL[i];
    if (!b || (b.purpose !== 'HOME' && b.purpose !== 'CAFE')) continue;
    var rank = INTERIOR_BUILDER.exploreOf({ purpose: b.purpose, building: b });
    if (!rank || rank.n < 1 || rank.n > 4) continue;
    var doorA = (b.doors && b.doors[0]) || [b.cx, b.cz, 0, -1];
    var door = { purpose: b.purpose, x: doorA[0], z: doorA[1], nx: doorA[2] || 0, nz: doorA[3] || 0, building: b, buildingId: b.id };
    INTERIOR_BUILDER.enterExplore(WALK_MODE, door, null);
    var card = document.getElementById('walk-interior');
    var legacy = !!(card && !card.hidden && card.classList.contains('show'));
    var pack = INTERIOR_BUILDER.activePack(door);
    var fw = pack && pack.floor ? +((pack.floor.maxX - pack.floor.minX) / 0.3048).toFixed(1) : 0;
    var fd = pack && pack.floor ? +((pack.floor.maxZ - pack.floor.minZ) / 0.3048).toFixed(1) : 0;
    out.push({
      name: rank.purpose + ' ' + rank.n,
      world: !!WALK_MODE._ibWorld,
      inside: !!WALK_MODE.insideBuilding,
      paused: !!WALK_MODE._ibHold,
      onFoot: !!WALK_MODE.onFoot,
      far: WALK_MODE.x > 8000,
      legacy: legacy,
      fw: fw,
      fd: fd
    });
    INTERIOR_BUILDER.leaveToCar(WALK_MODE);
  }
  P.x = saved.x; P.z = saved.z; P.yaw = saved.yaw; P.hd = saved.yaw; P.v = 0; P.ground = true;
  return JSON.stringify(out);
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
  const cdpPort = 9620 + ALL_VIEWPORTS.indexOf(vp);
  const dir = '/tmp/walk-planner-shot-' + vp.id;
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
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
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

async function waitReady(cdp) {
  let last = '';
  for (let i = 0; i < 50; i++) {
    await sleep(400);
    try { last = await evalJson(cdp, READY); } catch (e) { last = 'err:' + e.message; }
    if (last === 'ready') return;
    if (i === 20 || i === 40) {
      let info = '';
      try {
        info = await evalJson(cdp, 'JSON.stringify({title:document.title,wm:typeof WALK_MODE,ib:typeof INTERIOR_BUILDER,city:typeof CITY,p:typeof P,c:!!document.getElementById("c"),err:window.IB_ERR||""})');
      } catch (e) { info = e.message; }
      console.log('boot wait', i, last, info);
    }
  }
  throw new Error('world did not boot ' + last);
}

async function waitState(cdp, pred, label) {
  let last = null;
  for (let i = 0; i < 60; i++) {
    await sleep(200);
    last = JSON.parse(await evalJson(cdp, STATE));
    if (pred(last)) return last;
  }
  throw new Error(label + ' ' + JSON.stringify(last));
}

async function runViewport(vp) {
  const chrome = await bootChrome(vp);
  const log = { id: vp.id, steps: [] };
  try {
    await chrome.cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/test/world.html' });
    await waitReady(chrome.cdp);
    await evalJson(chrome.cdp, BOOT);
    await sleep(400);
    const homes = JSON.parse(await evalJson(chrome.cdp, FIND));
    const home1 = homes.find((h) => h.purpose === 'HOME' && h.n === 1);
    if (!home1) throw new Error('HOME 1 missing ' + JSON.stringify(homes.map((h) => h.purpose + h.n)));
    log.homes = homes.map((h) => h.purpose + ' ' + h.n + ' oid ' + h.oid);
    await evalJson(chrome.cdp, parkAt(home1));
    const atDoor = await waitState(chrome.cdp, (s) => s.act.indexOf('show:enter') === 0, 'enter button');
    log.steps.push({ step: 'door', state: atDoor });
    await evalJson(chrome.cdp, labelExpr(vp.id + '  HOME 1 door  ENTER  ' + atDoor.fps));
    await sleep(250);
    await shot(chrome.cdp, vp.id + '-1-door-enter.png');

    const clicked = await evalJson(chrome.cdp, CLICK_ACT);
    if (clicked !== 'clicked') throw new Error('enter click ' + clicked);
    const inside = await waitState(chrome.cdp, (s) => s.world && s.onFoot && s.walk && s.planner && !s.legacy && s.act.indexOf('show:build') === 0 && s.x > 8000 && s.actor > 4 && s.hold > 2 && /Add item/.test(s.rail) && /WALK/.test(s.hud), 'walk-in room');
    await sleep(900);
    inside.render = JSON.parse(await evalJson(chrome.cdp, `(function(){
      var t=document.getElementById('zdWalkFps');
      var f=document.getElementById('zdInteriorFrame');
      var esp=f&&f.contentWindow&&f.contentWindow.ESP;
      var info=esp&&esp.R&&esp.R.info&&esp.R.info.render;
      return JSON.stringify({
        fps:t?t.textContent:'',
        ratio:esp&&esp.R?esp.R.getPixelRatio():0,
        buf:esp&&esp.R?[esp.R.domElement.width,esp.R.domElement.height]:[],
        calls:info?info.calls:0,
        tris:info?info.triangles:0
      });
    })()`));
    inside.fps = inside.render.fps;
    if (/WELCOME HOME|STEP BACK|GLOWING PET|PLAYER HOUSE|DJ BOOTH/i.test(inside.legacyText || '')) {
      throw new Error('legacy room ' + inside.legacyText);
    }
    const overlap = JSON.parse(await evalJson(chrome.cdp, OVERLAP));
    inside.overlap = overlap;
    if (overlap.bad) throw new Error('overlap ' + JSON.stringify({ hits: overlap.hits, clip: overlap.clip, boxes: overlap.boxes }));
    log.steps.push({ step: 'room', state: inside });
    await evalJson(chrome.cdp, labelExpr(vp.id + '  HOME 1 walk-in  BUILD ROOM  ' + inside.fps));
    await sleep(400);
    await shot(chrome.cdp, vp.id + '-2-walk-in-build.png');

    await evalJson(chrome.cdp, CLICK_ACT);
    let planner = null;
    for (let i = 0; i < 40; i++) {
      await sleep(250);
      planner = JSON.parse(await evalJson(chrome.cdp, PLANNER));
      if (planner.ready && planner.editing && /Box/.test(planner.box) && /Walls/.test(planner.walls) && /Door/.test(planner.door) && /Place/.test(planner.place)) break;
    }
    log.steps.push({ step: 'planner', planner: planner });
    if (!planner || !planner.ready) throw new Error('planner not ready ' + JSON.stringify(planner));
    await evalJson(chrome.cdp, labelExpr(vp.id + '  planner  Box Walls Door  Place objects'));
    await sleep(300);
    await shot(chrome.cdp, vp.id + '-3-planner-tools.png');

    const placed = await evalJson(chrome.cdp, PLACE);
    log.placed = placed;
    const back = await waitState(chrome.cdp, (s) => s.world && s.walk && s.planner && s.act.indexOf('show:build') === 0 && s.actor > 4, 'back in room');
    await sleep(900);
    back.render = JSON.parse(await evalJson(chrome.cdp, `(function(){
      var t=document.getElementById('zdWalkFps');
      var f=document.getElementById('zdInteriorFrame');
      var esp=f&&f.contentWindow&&f.contentWindow.ESP;
      var info=esp&&esp.R&&esp.R.info&&esp.R.info.render;
      return JSON.stringify({
        fps:t?t.textContent:'',
        ratio:esp&&esp.R?esp.R.getPixelRatio():0,
        buf:esp&&esp.R?[esp.R.domElement.width,esp.R.domElement.height]:[],
        calls:info?info.calls:0,
        tris:info?info.triangles:0
      });
    })()`));
    back.fps = back.render.fps;
    const item = JSON.parse(await evalJson(chrome.cdp, ITEM));
    log.steps.push({ step: 'saved', state: back, item: item });
    if (!item.items || !item.items.length) throw new Error('no saved item ' + JSON.stringify(item) + ' place=' + placed);
    await evalJson(chrome.cdp, labelExpr(vp.id + '  saved ' + item.items[0] + ' in the room  ' + back.fps));
    await sleep(500);
    await shot(chrome.cdp, vp.id + '-4-item-in-room.png');

    const doors = JSON.parse(await evalJson(chrome.cdp, ALL_DOORS));
    log.doors = doors;
    const bad = doors.filter((d) => !d.world || d.inside || !d.paused || !d.onFoot || !d.far || d.legacy || d.fw < 59 || d.fd < 79);
    if (bad.length) throw new Error('a door still opens the old room ' + JSON.stringify(bad));
    if (doors.length < 8) throw new Error('expected 8 explore doors, got ' + doors.length);
    log.ok = true;
    return log;
  } finally {
    kill(chrome.child);
    chrome.cdp.close();
  }
}

async function main() {
  const server = await startServer();
  const logs = [];
  try {
    for (const vp of VIEWPORTS) {
      logs.push(await runViewport(vp));
    }
  } finally {
    server.close();
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'log.json'), JSON.stringify(logs, null, 2));
  fs.mkdirSync(ART, { recursive: true });
  fs.writeFileSync(path.join(ART, 'log.json'), JSON.stringify(logs, null, 2));
  console.log(JSON.stringify(logs, null, 2));
}

main().catch((err) => {
  console.error(err && err.stack || err);
  process.exit(1);
});
