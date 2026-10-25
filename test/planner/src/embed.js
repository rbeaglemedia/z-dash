/* Neon World embed. The planner tools stay as they are.
   A room key loads and saves that building's layout only.
   1 unit is 1 foot, the same as the event planner. */
import { ESP } from './app/runtime.js';
import { deserialize, serialize } from './grid.js';
import { rectPoly, wallRects, floorOf, floorBounds, placeDoor } from './walls.js';
import { dims, def } from './logic.js';
import * as THREE from 'three';

const FT = 0.3048;

function query() {
  let q;
  try { q = new URLSearchParams(location.search); } catch (e) { q = new URLSearchParams(); }
  const fw = parseFloat(q.get('fw') || '');
  const fd = parseFloat(q.get('fd') || '');
  return {
    on: q.get('embed') === '1',
    room: q.get('room') || '',
    fw: fw > 1 ? fw : 30,
    fd: fd > 1 ? fd : 40,
    title: q.get('title') || 'Room',
    from: q.get('from') || 'dev',
    walk: q.get('walk') === '1'
  };
}

function roomKey(embed) {
  return 'zdash.interior.layout.v1:' + embed.room;
}

export function embedSolids() {
  const walls = wallRects(ESP.S.walls).map(function (r) {
    return {
      kind: 'wall', name: 'Wall',
      x: r.x * FT, z: r.z * FT, a: r.a, w: r.w * FT, d: r.d * FT
    };
  });
  const items = [];
  (ESP.S.items || []).forEach(function (it) {
    const box = dims(it);
    const spec = def(it);
    if (!box || !spec) return;
    const y = (it.y || 0) * FT;
    const h = (spec.h || 0) * FT;
    if (y + h < 0.35 || y > 1.7) return;
    items.push({
      kind: 'item', name: spec.name || it.type,
      x: it.x * FT, z: it.z * FT, a: it.a || 0, w: box.w * FT, d: box.d * FT
    });
  });
  const floor = floorOf(ESP.S.walls);
  const b = floorBounds(floor);
  return {
    walls: walls,
    items: items,
    floor: {
      minX: b.minX * FT, maxX: b.maxX * FT, minZ: b.minZ * FT, maxZ: b.maxZ * FT,
      polys: floor.polys.map(function (pts) { return pts.map(function (p) { return [p[0] * FT, p[1] * FT]; }); }),
      rects: floor.rects.map(function (r) { return { x0: r.x0 * FT, z0: r.z0 * FT, x1: r.x1 * FT, z1: r.z1 * FT }; })
    },
    title: ESP.EMBED.title
  };
}

function frameRoom() {
  const p = ESP.walkPoseData;
  const b = floorBounds(floorOf(ESP.S.walls));
  const x = p && Number.isFinite(p.x) ? p.x : (b.minX + b.maxX) / 2;
  const z = p && Number.isFinite(p.z) ? p.z : b.minZ + Math.min(8, (b.maxZ - b.minZ) * 0.2);
  ESP.V.tx = x;
  ESP.V.tz = z;
  ESP.V.yaw = Math.PI / 4;
  ESP.V.pitch = 0.95;
  ESP.V.dist = 38;
  if (typeof ESP.placeCam === 'function') ESP.placeCam();
}

function installWalkCam() {
  if (ESP.placeCam && ESP.placeCam._walk) return;
  if (ESP.placeCam) ESP.placeCam._walk = 1;
  if (typeof ESP.overlays === 'function' && !ESP.overlays._walk) {
    const overlays = ESP.overlays;
    const wrappedOverlays = function overlaysWalk() {
      overlays();
      if (!ESP.walkOn) return;
      if (ESP.grid1) ESP.grid1.visible = true;
      if (ESP.grid10) ESP.grid10.visible = false;
      if (ESP.grid100) ESP.grid100.visible = false;
      if (ESP.cursorDot) ESP.cursorDot.visible = false;
    };
    wrappedOverlays._walk = 1;
    ESP.overlays = wrappedOverlays;
  }
  if (ESP.R && typeof ESP.R.render === 'function' && !ESP.R.render._walk) {
    const render = ESP.R.render.bind(ESP.R);
    const wrappedRender = function renderWalk(scene, camera) {
      const now = performance.now();
      ESP._fpsN = (ESP._fpsN || 0) + 1;
      if (!ESP._fpsT) ESP._fpsT = now;
      if (now - ESP._fpsT >= 400) {
        ESP.walkFps = Math.round(ESP._fpsN * 1000 / (now - ESP._fpsT));
        ESP._fpsN = 0;
        ESP._fpsT = now;
      }
      return render(scene, camera);
    };
    wrappedRender._walk = 1;
    ESP.R.render = wrappedRender;
  }
  if (typeof ESP.resize === 'function' && !ESP.resize._walk) {
    const resize = ESP.resize;
    const wrappedResize = function resizeWalk() {
      resize();
      if (!(ESP.walkOn && ESP.R)) return;
      const w = Math.round(innerWidth), h = Math.round(innerHeight);
      ESP.R.setPixelRatio(1);
      if (w > 0 && h > 0) ESP.R.setSize(w, h, false);
    };
    wrappedResize._walk = 1;
    ESP.resize = wrappedResize;
  }
}

function walkStyle() {
  if (document.getElementById('zdWalkCss')) return;
  const css = document.createElement('style');
  css.id = 'zdWalkCss';
  css.textContent = ''
    + 'body.zd-walk header.bar,body.zd-walk #modes,body.zd-walk #toolsBuild,body.zd-walk #toolsPlace,body.zd-walk #drawTools,body.zd-walk #presets,body.zd-walk #hist,body.zd-walk #snapHint,body.zd-walk #lvlBar,body.zd-walk #hint,body.zd-walk #btnClear,body.zd-walk .ver,body.zd-walk #simBar,body.zd-walk #labels,body.zd-walk #presetTip,body.zd-walk #stampBar,body.zd-walk #selBar,body.zd-walk #btnShare,body.zd-walk #btnRun,body.zd-walk #btnQuote{display:none!important}'
    + 'body.zd-walk #rail{display:grid!important;grid-auto-flow:column;align-content:start;justify-items:stretch}'
    + 'body.zd-walk #rail svg{display:none!important}'
    + 'body.zd-walk #rail button{justify-content:center;line-height:1.15;overflow:hidden}'
    + 'body.zd-walk #sheet{z-index:12}';
  document.head.appendChild(css);
}

const actor = { group: null, mats: [], meshes: [], geo: null, head: null };

function ensureActor() {
  if (actor.group || !ESP.scene) return;
  actor.group = new THREE.Group();
  actor.group.name = 'zdWalkActor';
  actor.geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
  actor.head = new THREE.SphereGeometry(0.5, 8, 6);
  ESP.scene.add(actor.group);
}

function boneMesh(head) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xff4ad8 });
  const mesh = new THREE.Mesh(head ? actor.head : actor.geo, mat);
  mesh.frustumCulled = false;
  actor.group.add(mesh);
  actor.mats.push(mat);
  actor.meshes.push(mesh);
  return mesh;
}

function drawActor(segs) {
  ensureActor();
  if (!actor.group) return;
  const list = segs || [];
  while (actor.meshes.length < list.length) boneMesh(!!(list[actor.meshes.length] && list[actor.meshes.length].head));
  const up = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();
  for (let i = 0; i < actor.meshes.length; i++) {
    const mesh = actor.meshes[i];
    const seg = list[i];
    if (!seg || !seg.a || !seg.b) { mesh.visible = false; continue; }
    const ax = +seg.a[0], ay = +seg.a[1], az = +seg.a[2];
    const bx = +seg.b[0], by = +seg.b[1], bz = +seg.b[2];
    const len = Math.hypot(bx - ax, by - ay, bz - az) || 0.04;
    const r = Math.max(0.12, (+seg.r || 0.08) * 1.7);
    mesh.visible = true;
    mesh.material.color.set(seg.c || '#ff4ad8');
    if (seg.head) {
      mesh.position.set(ax, ay, az);
      mesh.scale.set(r * 2, r * 2, r * 2);
      mesh.quaternion.identity();
      continue;
    }
    mesh.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
    mesh.scale.set(r * 2, len, r * 2);
    dir.set(bx - ax, by - ay, bz - az).multiplyScalar(1 / len);
    mesh.quaternion.setFromUnitVectors(up, dir);
  }
}

function walkFloor(on) {
  if (!ESP.floorMat) return;
  if (on) {
    ESP.floorMat.color.set(0x0c2038);
    ESP.floorMat.transparent = true;
    ESP.floorMat.opacity = 0.72;
    ESP.floorMat.depthWrite = false;
  } else {
    ESP.floorMat.color.set(0xffffff);
    ESP.floorMat.transparent = false;
    ESP.floorMat.opacity = 1;
    ESP.floorMat.depthWrite = true;
  }
}

function mountWalkRail() {
  const rail = ESP.$('#rail');
  if (!rail) return;
  const anchor = ESP.$('#btnTop') || rail.firstChild;
  ['btnAdd', 'btnSame', 'btnEvents'].forEach(function (id) {
    const b = ESP.$('#' + id);
    if (!b) return;
    if (!b.dataset.railHome && b.parentElement) b.dataset.railHome = b.parentElement.id || '';
    rail.insertBefore(b, anchor);
  });
  ['btnShare', 'btnRun', 'btnQuote'].forEach(function (id) {
    const b = ESP.$('#' + id);
    if (b) b.classList.add('hidden');
  });
  fitWalkRail();
}

function restoreWalkRail() {
  const place = ESP.$('#toolsPlace');
  ['btnSame', 'btnEvents', 'btnAdd'].forEach(function (id) {
    const b = ESP.$('#' + id);
    if (!b) return;
    b.style.height = '';
    b.style.minHeight = '';
    b.style.width = '';
    b.style.fontSize = '';
    b.style.padding = '';
    b.style.whiteSpace = '';
    if (place) place.appendChild(b);
  });
  const share = ESP.$('#btnShare');
  if (share) share.classList.remove('hidden');
  const rail = ESP.$('#rail');
  if (!rail) return;
  delete rail.dataset.fit;
  rail.style.top = '';
  rail.style.right = '';
  rail.style.left = '';
  rail.style.gap = '';
  rail.style.width = '';
  rail.style.maxHeight = '';
  rail.style.gridTemplateRows = '';
  rail.style.gridTemplateColumns = '';
  [].forEach.call(rail.querySelectorAll('button'), function (b) {
    b.style.height = '';
    b.style.minHeight = '';
    b.style.width = '';
    b.style.fontSize = '';
    b.style.padding = '';
    b.style.whiteSpace = '';
  });
}

function parentHudBox(id) {
  let doc = document;
  try {
    if (window.parent && window.parent.document && window.parent.document.getElementById) doc = window.parent.document;
  } catch (e) {}
  const el = doc.getElementById(id);
  if (!el || !el.getBoundingClientRect) return null;
  const view = (el.ownerDocument && el.ownerDocument.defaultView) || window;
  const s = view.getComputedStyle(el);
  if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  let x = r.left;
  let y = r.top;
  let right = r.right;
  let bottom = r.bottom;
  if (el.ownerDocument !== document && window.frameElement && window.frameElement.getBoundingClientRect) {
    const fr = window.frameElement.getBoundingClientRect();
    x -= fr.left;
    y -= fr.top;
    right -= fr.left;
    bottom -= fr.top;
  }
  return { x: x, y: y, r: right, b: bottom };
}

function fitWalkRail() {
  const rail = ESP.$('#rail');
  if (!rail) return;
  const w = window.innerWidth || 844;
  const h = window.innerHeight || 390;
  const buttons = [].filter.call(rail.querySelectorAll('button'), function (b) {
    return !b.classList.contains('hidden');
  });
  const n = Math.max(1, buttons.length);
  const gap = 4;
  const btnW = 72;
  const minH = 18;
  const obs = ['kMenuB', 'exitCarBtn', 'tup', 'nos', 'brk', 'wng', 'emoteBtn', 'zdWalkAct', 'zdWalkExit', 'devOpen', 'enterBldBtn'].map(parentHudBox).filter(Boolean);
  const rightJoy = obs.filter(function (o) { return o.x > w * 0.45 && o.b > h * 0.4; });
  const floor = (rightJoy.length ? Math.min.apply(null, rightJoy.map(function (o) { return o.y; })) : h) - 8;
  function planFor(cols) {
    const rows = Math.ceil(n / cols);
    const railW = cols * btnW + (cols - 1) * gap;
    const left = w - 8 - railW;
    let top = 8;
    obs.forEach(function (o) {
      if (o.y >= floor - 4) return;
      const iw = Math.min(w - 8, o.r) - Math.max(left, o.x);
      if (iw > 2 && o.b + 6 > top) top = Math.ceil(o.b + 6);
    });
    const avail = floor - top;
    let btnH = Math.floor((avail - gap * (rows - 1)) / rows);
    if (btnH > 44) btnH = 44;
    const need = rows * minH + gap * (rows - 1);
    return { cols: cols, rows: rows, top: top, btnH: btnH, avail: avail, railW: railW, ok: btnH >= minH && avail + 1 >= need };
  }
  let plan = planFor(1);
  if (!plan.ok) plan = planFor(2);
  if (!plan.ok) plan.btnH = minH;
  const sig = [plan.cols, plan.rows, plan.top, plan.btnH, plan.railW, n, Math.round(floor)].join('|');
  if (rail.dataset.fit === sig) return;
  rail.dataset.fit = sig;
  rail.style.top = plan.top + 'px';
  rail.style.right = '8px';
  rail.style.left = 'auto';
  rail.style.gap = gap + 'px';
  rail.style.width = plan.railW + 'px';
  rail.style.maxHeight = Math.max(36, Math.floor(plan.avail)) + 'px';
  rail.style.gridTemplateRows = 'repeat(' + plan.rows + ', ' + plan.btnH + 'px)';
  rail.style.gridTemplateColumns = 'repeat(' + plan.cols + ', ' + btnW + 'px)';
  buttons.forEach(function (b) {
    b.style.height = plan.btnH + 'px';
    b.style.minHeight = '0px';
    b.style.width = btnW + 'px';
    b.style.fontSize = '10px';
    b.style.padding = '1px 2px';
    b.style.overflow = 'hidden';
    b.style.whiteSpace = 'nowrap';
  });
}

function post(type) {
  let solids = null;
  let layout = '';
  try {
    layout = serialize(ESP.S);
    solids = embedSolids();
  } catch (e) {}
  try {
    parent.postMessage({
      type: type,
      room: ESP.EMBED.room,
      from: ESP.EMBED.from,
      layout: layout,
      solids: solids,
      title: ESP.EMBED.title
    }, '*');
  } catch (e) {}
}

export function bootEmbed() {
  const embed = query();
  if (!embed.on || !embed.room) return;
  ESP.EMBED = embed;
  const key = roomKey(embed);
  ESP.loadSaved = function loadRoom() {
    try { return deserialize(localStorage.getItem(key)); } catch (e) { return null; }
  };
  const plainSave = ESP.saveNow;
  ESP.saveNow = function saveRoom() {
    try { localStorage.setItem(key, serialize(ESP.S)); } catch (e) {}
    post('zd-interior-save');
    if (typeof plainSave === 'function' && plainSave !== ESP.saveNow) {
      /* The planner's own key stays unused while a room is open. */
    }
  };
  const saved = ESP.loadSaved();
  if (saved && ((saved.walls && saved.walls.length) || (saved.items && saved.items.length))) {
    ESP.S.env = saved.env || 'indoor';
    ESP.S.walls = saved.walls || [];
    ESP.S.items = saved.items || [];
    ESP.S.venue = saved.venue || null;
    ESP.S.fill = saved.fill || null;
    ESP.S.lvl = saved.lvl || 1;
    ESP.S.levels = saved.levels || {};
    ESP.S.tech = saved.tech || ESP.S.tech;
    ESP.S.preset = null;
    ESP.setPhase('place');
  } else {
    ESP.S.env = 'indoor';
    ESP.S.walls = [rectPoly(embed.fw, embed.fd)];
    ESP.S.items = [];
    ESP.S.preset = null;
    ESP.S.venue = null;
    ESP.S.fill = null;
    placeDoor(ESP.S.walls, 0, 0, embed.fw / 2);
    ESP.setPhase('build');
  }
  /* People simulation (src/sim.js) is not in this port. Do not start it. */
  ESP.sim = null;
  if (typeof ESP.simStop === 'function') ESP.simStop();
  ESP.applyEnv();
  ESP.select(null);
  ESP.resetView();
  ESP.histReset();
  ESP.showScreen('build');
  installWalkCam();
  walkStyle();
  const home = ESP.$('#btnHome');
  if (home) home.onclick = function () {
    ESP.saveNow();
    post(embed.from === 'walk' ? 'zd-interior-back' : 'zd-interior-exit');
  };
  const bar = ESP.$('header.bar');
  if (bar && !ESP.$('#btnExitStreet')) {
    const exit = document.createElement('button');
    exit.id = 'btnExitStreet';
    exit.type = 'button';
    exit.textContent = 'Exit to street';
    exit.setAttribute('aria-label', 'Exit to street');
    exit.onclick = function () { ESP.saveNow(); post('zd-interior-exit'); };
    bar.appendChild(exit);
  }
  ESP.walkPose = function walkPose(p) {
    ESP.walkPoseData = p || null;
    drawActor(p && p.segs);
    if (ESP.walkOn) frameRoom();
    if (ESP.frame) ESP.frame();
  };
  ESP.sheetOpen = function sheetOpen() {
    const sheet = ESP.$('#sheet');
    return !!(sheet && !sheet.classList.contains('hidden'));
  };
  ESP.setWalk = function setWalk(on) {
    ESP.walkOn = !!on;
    ESP.sim = null;
    if (typeof ESP.simStop === 'function') ESP.simStop();
    if (document.body) document.body.classList.toggle('zd-walk', !!on);
    if (typeof ESP.setWallsView === 'function') ESP.setWallsView('low');
    walkFloor(!!on);
    if (on) {
      ESP.select(null);
      if (typeof ESP.endStamp === 'function') ESP.endStamp();
      if (typeof ESP.closeSheet === 'function') ESP.closeSheet();
      if (ESP.phase !== 'place' && typeof ESP.setPhase === 'function') ESP.setPhase('place');
      mountWalkRail();
      frameRoom();
      ensureActor();
    } else {
      restoreWalkRail();
      if (typeof ESP.setPhase === 'function') ESP.setPhase('build');
    }
    if (typeof ESP.resize === 'function') ESP.resize();
    if (ESP.frame) ESP.frame();
  };
  ESP.fitWalkRail = fitWalkRail;
  addEventListener('resize', function () { if (ESP.walkOn) fitWalkRail(); });
  if (embed.walk) ESP.setWalk(true);
  if (document.body) document.body.dataset.ready = '1';
  try { window.ESP = ESP; } catch (e) {}
  ESP.renderPresets();
  ESP.rebuildSoon();
  post('zd-interior-ready');
}
