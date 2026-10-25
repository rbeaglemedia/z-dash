/* room.html: direct explore, landscape builder chrome, Done returns, building label.
   One browser at a time. Overlap at 844x390, 780x360, 1024x768, 1366x768, 390x844. */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || '/opt/google/chrome/chrome';
const OUT = path.join(ROOT, 'test-results', 'dev-builder', 'room-layout');
const ART = '/opt/cursor/artifacts/dev-builder/room-layout';
const PORT = Number(process.env.PORT || 8796);
const GALAXY_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const VIEWPORTS = [
  { id: 'phone-844', width: 844, height: 390, dpr: 2, mobile: true, ua: GALAXY_UA, orient: 'landscapePrimary', angle: 90 },
  { id: 'galaxy-780', width: 780, height: 360, dpr: 2, mobile: true, ua: GALAXY_UA, orient: 'landscapePrimary', angle: 90 },
  { id: 'ipad-1024', width: 1024, height: 768, dpr: 1, mobile: true, ua: '', orient: 'landscapePrimary', angle: 90 },
  { id: 'pc-1366', width: 1366, height: 768, dpr: 1, mobile: false, ua: '', orient: 'landscapePrimary', angle: 90 },
  { id: 'portrait-390', width: 390, height: 844, dpr: 2, mobile: true, ua: GALAXY_UA, orient: 'portraitPrimary', angle: 0 }
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
    throw new Error((d.exception && d.exception.description) || d.text || 'eval failed');
  }
  return ev.result && ev.result.value;
}

const READY = `(function () {
  try {
    if (!document.documentElement.classList.contains('room-direct')) return '';
    if (typeof WALK_MODE === 'undefined' || !WALK_MODE || !WALK_MODE._ibWorld) return '';
    var over = document.getElementById('kOver');
    if (over && getComputedStyle(over).display !== 'none') return '';
    var f = document.getElementById('zdInteriorFrame');
    var esp = f && f.contentWindow && f.contentWindow.ESP;
    if (!esp || !esp.walkOn || !f.contentDocument || f.contentDocument.body.dataset.ready !== '1') return '';
    if (!document.body.dataset.ibRoom) return '';
    return 'ready';
  } catch (e) { return 'ERR ' + e.message; }
})()`;

function labelExpr(text) {
  return `(function () {
    var el = document.getElementById('zdShotLabel');
    if (!el) {
      el = document.createElement('div');
      el.id = 'zdShotLabel';
      el.style.cssText = 'position:fixed;left:12px;top:46%;z-index:400;max-width:42vw;background:#12081c;color:#ffe14d;border:2px solid #3ee6ff;border-radius:10px;padding:4px 8px;font:700 12px Orbitron,sans-serif;pointer-events:none';
      document.body.appendChild(el);
    }
    el.textContent = ${JSON.stringify(text)};
    return el.textContent;
  })()`;
}

const PROBE = `(function () {
  function box(el) {
    if (!el) return null;
    var view = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    var s = view.getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return null;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    var x = r.left, y = r.top, right = r.right, bottom = r.bottom;
    if (view !== window && view.frameElement) {
      var fr = view.frameElement.getBoundingClientRect();
      x += fr.left; y += fr.top; right += fr.left; bottom += fr.top;
    }
    return { name: el.id || (el.className || '').toString().slice(0, 24), x: x, y: y, r: right, b: bottom, w: r.width, h: r.height };
  }
  var over = document.getElementById('kOver');
  var f = document.getElementById('zdInteriorFrame');
  var doc = f && f.contentDocument;
  var esp = f && f.contentWindow && f.contentWindow.ESP;
  var ids = ['kOver','zdWalkAct','zdWalkExit','zdWalkCam','zdWalkFps','zdWalkTitle','devOpen','tup','nos','brk','wng','emoteBtn','exitCarBtn','enterBldBtn','kMenuB'];
  var nodes = ids.map(function (id) { return box(document.getElementById(id)); }).filter(Boolean);
  var railText = [];
  if (doc) {
    ['drawTools','hint','btnMute','btnHome','btnReset','modes','toolsBuild','btnWallsDone','btnExitStreet','sizeLbl','rail'].forEach(function (id) {
      var q = box(doc.getElementById(id));
      if (q) nodes.push(q);
    });
    var rail = doc.getElementById('rail');
    if (rail) [].forEach.call(rail.querySelectorAll('button'), function (b) {
      var q = box(b);
      var label = (b.innerText || '').replace(/\\s+/g, ' ').trim();
      if (q) { q.name = label || b.id; nodes.push(q); }
      if (getComputedStyle(b).display !== 'none') railText.push(label);
    });
  }
  var hits = [];
  for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
    var a = nodes[i], c = nodes[j];
    if (a.name === 'rail' || c.name === 'rail') continue;
    if ((a.name === 'toolsBuild' && c.name === 'btnWallsDone') || (c.name === 'toolsBuild' && a.name === 'btnWallsDone')) continue;
    if ((a.name === 'modes' && (c.name === 'btnHome' || c.name === 'hint')) || (c.name === 'modes' && (a.name === 'btnHome' || a.name === 'hint'))) continue;
    var iw = Math.min(a.r, c.r) - Math.max(a.x, c.x);
    var ih = Math.min(a.b, c.b) - Math.max(a.y, c.y);
    if (iw > 4 && ih > 4) hits.push(a.name + ' x ' + c.name + ' ' + Math.round(iw) + 'x' + Math.round(ih));
  }
  var clip = nodes.filter(function (n) {
    if (n.name === 'kOver' || n.name === 'rail' || n.name === 'toolsBuild' || n.name === 'modes' || n.name === 'drawTools') return false;
    return n.x < -2 || n.y < -2 || n.r > innerWidth + 2 || n.b > innerHeight + 2;
  }).map(function (n) { return n.name + ' ' + Math.round(n.x) + ',' + Math.round(n.y) + ' ' + Math.round(n.r) + ',' + Math.round(n.b); });
  var fps = document.getElementById('zdWalkFps');
  var fr = fps ? fps.getBoundingClientRect() : null;
  var title = document.getElementById('zdWalkTitle');
  var meshes = 0;
  try {
    var g = esp && esp.scene && esp.scene.getObjectByName('zdWalkActor');
    if (g) g.children.forEach(function (m) { if (m.visible) meshes++; });
  } catch (e) {}
  var body = doc && doc.body;
  return JSON.stringify({
    menu: !!(over && getComputedStyle(over).display !== 'none'),
    menuText: over ? (over.innerText || '').slice(0, 40) : '',
    label: title ? (title.textContent || '') : '',
    labelOn: !!(title && title.classList.contains('show')),
    labelClip: !!(title && title.scrollWidth > title.clientWidth + 2),
    walk: !!(esp && esp.walkOn),
    cam: esp && esp.walkCam,
    fov: esp && esp.camera ? Math.round(esp.camera.fov) : 0,
    phase: body ? (body.classList.contains('zd-walk') ? 'walk' : (body.classList.contains('zd-build') ? 'build' : '')) : '',
    room: document.body.dataset.ibRoom || '',
    world: document.body.dataset.ibWorld || '',
    rail: railText,
    share: railText.some(function (t) { return /Share/i.test(t); }),
    meshes: meshes,
    fps: fps ? fps.textContent : '',
    fpsRight: !!(fr && fr.right > innerWidth - 24 && fr.top < 36 && fr.width > 20),
    hits: hits,
    clip: clip,
    onFoot: !!(WALK_MODE && WALK_MODE.onFoot && WALK_MODE._ibWorld),
    car: ['wng','exitCarBtn','enterBldBtn'].every(function (id) {
      var el = document.getElementById(id);
      if (!el) return true;
      var s = getComputedStyle(el);
      return s.display === 'none' || s.visibility === 'hidden';
    }),
    exitOn: !!(document.getElementById('zdWalkExit') && document.getElementById('zdWalkExit').classList.contains('show')),
    flying: (function () { try { return !!flying; } catch (e) { return false; } })(),
    err: window.IB_ERR || ''
  });
})()`;

const BUILD = `(function () {
  var b = document.getElementById('zdWalkAct');
  if (!b) return 'missing';
  b.click();
  return 'clicked';
})()`;

const DONE = `(function () {
  var f = document.getElementById('zdInteriorFrame');
  var btn = f && f.contentDocument && f.contentDocument.getElementById('btnWallsDone');
  if (!btn) return 'missing';
  btn.click();
  return 'clicked';
})()`;

const TO_DOOR = `(function () {
  var o = WALK_MODE._ibOrigin || { x: 0, z: 0 };
  var pack = INTERIOR_BUILDER.pack(INTERIOR_BUILDER.roomOf(WALK_MODE.insideDoor));
  var d = pack && pack.doors && pack.doors[0];
  if (!d) return JSON.stringify({ ok: false });
  WALK_MODE.x = o.x + d.x;
  WALK_MODE.z = o.z + d.z + 0.35;
  WALK_MODE.yaw = Math.PI;
  return JSON.stringify({ ok: true, x: d.x, z: d.z });
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
  const cdpPort = 9630 + VIEWPORTS.indexOf(vp);
  const dir = '/tmp/room-layout-shot-' + vp.id;
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
    '--window-size=' + vp.width + ',' + (vp.height + 80),
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
    screenOrientation: { type: vp.orient, angle: vp.angle }
  });
  if (vp.mobile) await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (vp.ua) await cdp.send('Emulation.setUserAgentOverride', { userAgent: vp.ua });
  return { child: child, cdp: cdp, err: function () { return err; } };
}

async function waitReady(cdp) {
  let last = '';
  for (let i = 0; i < 60; i++) {
    await sleep(400);
    try { last = await evalJson(cdp, READY); } catch (e) { last = 'err:' + e.message; }
    if (last === 'ready') return;
  }
  let info = '';
  try {
    info = await evalJson(cdp, 'JSON.stringify({title:document.title,cls:document.documentElement.className,wm:typeof WALK_MODE,ib:typeof INTERIOR_BUILDER,direct:window.ZD_ROOM_DIRECT,world:document.body&&document.body.dataset.ibWorld,room:document.body&&document.body.dataset.ibRoom,err:window.IB_ERR||"",over:!!document.getElementById("kOver")})');
  } catch (e) { info = e.message; }
  throw new Error('room not ready ' + last + ' ' + info);
}

function railOk(list) {
  const want = ['Add item', 'Same again', 'Presets', 'Top view', 'Drag: Turn', 'Walls: Low'];
  return list.length === want.length && want.every((w, i) => list[i] === w);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const report = [];
  for (const vp of VIEWPORTS) {
    const boot = await bootChrome(vp);
    const row = { id: vp.id, pass: false };
    try {
      await boot.cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/test/room.html' });
      await waitReady(boot.cdp);
      await sleep(800);
      const explore = JSON.parse(await evalJson(boot.cdp, PROBE));
      await evalJson(boot.cdp, labelExpr(vp.id + ' explore  ' + (explore.label || '')));
      await sleep(200);
      await shot(boot.cdp, vp.id + '-explore.png');
      row.explore = explore;
      await evalJson(boot.cdp, BUILD);
      await sleep(700);
      const built = JSON.parse(await evalJson(boot.cdp, PROBE));
      await evalJson(boot.cdp, labelExpr(vp.id + ' builder  ' + (built.label || '')));
      await sleep(250);
      await shot(boot.cdp, vp.id + '-build.png');
      row.build = built;
      await evalJson(boot.cdp, DONE);
      await sleep(700);
      const back = JSON.parse(await evalJson(boot.cdp, PROBE));
      row.back = { walk: back.walk, cam: back.cam, phase: back.phase, room: back.room, world: back.world, onFoot: back.onFoot, label: back.label, menu: back.menu };
      if (vp.id === 'phone-844' || vp.id === 'portrait-390') {
        await evalJson(boot.cdp, labelExpr(vp.id + ' back to explore'));
        await sleep(200);
        await shot(boot.cdp, vp.id + '-back.png');
      }
      const door = JSON.parse(await evalJson(boot.cdp, TO_DOOR));
      await sleep(400);
      const at = JSON.parse(await evalJson(boot.cdp, PROBE));
      row.door = { door: door, exitOn: at.exitOn, car: at.car, world: at.world };
      row.pass = !explore.menu && explore.phase === 'walk' && explore.cam === 'chase' && explore.label === 'HOME Interior' && !explore.labelClip && !built.labelClip
        && explore.meshes > 8 && explore.fpsRight && !explore.share && explore.hits.length === 0 && explore.clip.length === 0
        && built.phase === 'build' && built.label === 'HOME Interior' && railOk(built.rail) && !built.share
        && built.hits.length === 0 && built.clip.length === 0 && built.fpsRight
        && back.phase === 'walk' && back.walk && back.cam === 'chase' && back.room && back.onFoot && !back.menu
        && at.exitOn && at.car && at.world === '1';
    } catch (e) {
      row.error = e.message;
    } finally {
      boot.cdp.close();
      kill(boot.child);
    }
    report.push(row);
    console.log(vp.id, row.pass ? 'PASS' : 'FAIL', row.error || '');
    if (row.explore) console.log('  explore', JSON.stringify({ menu: row.explore.menu, label: row.explore.label, labelClip: row.explore.labelClip, cam: row.explore.cam, phase: row.explore.phase, meshes: row.explore.meshes, fps: row.explore.fps, fpsRight: row.explore.fpsRight, hits: row.explore.hits, clip: row.explore.clip, rail: row.explore.rail }));
    if (row.build) console.log('  build', JSON.stringify({ phase: row.build.phase, label: row.build.label, labelClip: row.build.labelClip, rail: row.build.rail, share: row.build.share, fps: row.build.fps, fpsRight: row.build.fpsRight, hits: row.build.hits, clip: row.build.clip }));
    if (row.back) console.log('  back', JSON.stringify(row.back));
    if (row.door) console.log('  door', JSON.stringify(row.door));
  }
  server.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  const bad = report.filter((r) => !r.pass);
  if (bad.length) {
    console.log('ROOM LAYOUT FAIL ' + bad.map((r) => r.id).join(','));
    process.exit(1);
  }
  console.log('ROOM LAYOUT PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
