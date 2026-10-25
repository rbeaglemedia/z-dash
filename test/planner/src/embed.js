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

const OUT_FOV = 2 * Math.atan(0.5 / 0.9) * 180 / Math.PI;
const PLAN_FOV = 40;
const CHASE_BACK = 4.5 / FT;
const CHASE_LOOK = 1.10 / FT;
const CHASE_CAM = 1.85 / FT;

function setFov(fov) {
  if (!ESP.camera || Math.abs(ESP.camera.fov - fov) < 0.05) return;
  ESP.camera.fov = fov;
  ESP.camera.updateProjectionMatrix();
}

function frameAngled() {
  const p = ESP.walkPoseData;
  const b = floorBounds(floorOf(ESP.S.walls));
  const cx = (b.minX + b.maxX) / 2;
  const cz = (b.minZ + b.maxZ) / 2;
  const px = p && Number.isFinite(p.x) ? p.x : cx;
  const pz = p && Number.isFinite(p.z) ? p.z : cz;
  ESP.V.tx = cx * 0.35 + px * 0.65;
  ESP.V.tz = cz * 0.35 + pz * 0.65;
  ESP.V.yaw = Math.PI / 4;
  ESP.V.pitch = 0.62;
  const span = Math.max(b.maxX - b.minX, b.maxZ - b.minZ, 24);
  ESP.V.dist = Math.max(72, span * 1.25);
}

function chasePose() {
  const p = ESP.walkPoseData || { x: 0, z: 0, y: 0, yaw: 0 };
  const yaw = p.yaw || 0;
  const x = p.x || 0;
  const z = p.z || 0;
  const y = p.y || 0;
  setFov(OUT_FOV);
  ESP.camera.position.set(x - Math.sin(yaw) * CHASE_BACK, Math.max(0.8 / FT, y + CHASE_CAM), z - Math.cos(yaw) * CHASE_BACK);
  ESP.camera.lookAt(x, y + CHASE_LOOK, z);
  ESP.camera.updateMatrixWorld();
}

function installWalkCam() {
  if (ESP.placeCam && !ESP.placeCam._walkWrapped) {
    const orig = ESP.placeCam;
    const wrapped = function placeCamWalk() {
      const build = !ESP.walkOn || ESP.phase === 'build';
      if (build) {
        setFov(PLAN_FOV);
        return orig();
      }
      if (ESP.topDown) {
        setFov(PLAN_FOV);
        return orig();
      }
      if (ESP.walkCam === 'room') {
        setFov(PLAN_FOV);
        if (ESP.orbitPtr || ESP.panPtr) ESP.walkHeld = true;
        else if (!ESP.walkHeld) frameAngled();
        return orig();
      }
      chasePose();
    };
    wrapped._walkWrapped = 1;
    wrapped._walk = 1;
    ESP.placeCam = wrapped;
  }
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
      if (!(ESP.walkOn && ESP.R && ESP.camera)) return;
      const w = Math.round(innerWidth), h = Math.round(innerHeight);
      if (!(w > 0 && h > 0)) return;
      const cap = 844 * 390;
      let bw = w, bh = h;
      if (bw * bh > cap) {
        const s = Math.sqrt(cap / (bw * bh));
        bw = Math.max(1, Math.round(w * s));
        bh = Math.max(1, Math.round(h * s));
      }
      ESP.R.setPixelRatio(1);
      ESP.R.setSize(bw, bh, false);
      ESP.camera.aspect = w / Math.max(1, h);
      ESP.camera.updateProjectionMatrix();
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
    + 'body.zd-walk header.bar,body.zd-walk #modes,body.zd-walk #toolsBuild,body.zd-walk #toolsPlace,body.zd-walk #drawTools,body.zd-walk #presets,body.zd-walk #hist,body.zd-walk #snapHint,body.zd-walk #lvlBar,body.zd-walk #hint,body.zd-walk #btnClear,body.zd-walk .ver,body.zd-walk #simBar,body.zd-walk #labels,body.zd-walk #presetTip,body.zd-walk #stampBar,body.zd-walk #selBar{display:none!important}'
    + 'body.zd-embed #btnShare,body.zd-embed #btnRun,body.zd-embed #btnQuote,body.zd-embed #btnExitStreet,body.zd-embed #sizeLbl,body.zd-embed #snapHint,body.zd-embed #btnClear,body.zd-embed #lvlBar{display:none!important}'
    + 'body.zd-embed header.bar{padding-right:112px;box-sizing:border-box}'
    + 'body.zd-embed #rail{display:grid!important;grid-auto-flow:column;align-content:start;justify-items:stretch;top:8px;overflow:hidden;z-index:6}'
    + 'body.zd-embed.zd-build #hint{left:12px;right:96px;transform:none;max-width:none;width:auto;text-align:left;pointer-events:none;z-index:4}'
    + 'body.zd-embed #rail button.hidden,body.zd-embed #btnShare,body.zd-embed #btnRun,body.zd-embed #btnQuote{display:none!important}'
    + 'body.zd-embed #rail button:not(.hidden){display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:1px;border-radius:12px;border:1px solid #ffffff40;background:color-mix(in srgb,var(--surface) 91%,transparent);color:var(--fg);padding:2px 1px;font-weight:600;font-size:9px;line-height:1.05;overflow:hidden;box-sizing:border-box;min-height:0!important}'
    + 'body.zd-embed #rail button svg{display:block!important;width:14px;height:14px;flex:0 0 auto;margin:0!important}'
    + 'body.zd-embed #rail button span{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.05}'
    + 'body.zd-embed #rail button.on{background:var(--accent);color:var(--on-action);border-color:var(--accent)}'
    + 'body.zd-embed #rail #btnAdd{background:var(--action);color:var(--on-action);border-color:var(--action)}'
    + 'body.zd-embed #sheet{z-index:12}'
    + '@media (max-height:450px){body.zd-embed.zd-build #hint{display:none!important}}';
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

const PLUS_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
const PRESET_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5M16 4v5"/></svg>';

function dressRailButton(b, label, iconHtml) {
  if (!b || b.dataset.dressed === '1') return;
  b.dataset.plain = b.innerHTML;
  let svg = iconHtml || '';
  if (!svg) {
    const old = b.querySelector('svg');
    svg = old ? old.outerHTML : '';
  }
  b.innerHTML = svg + '<span>' + label + '</span>';
  const el = b.querySelector('svg');
  if (el) el.removeAttribute('style');
  b.dataset.dressed = '1';
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
  dressRailButton(ESP.$('#btnAdd'), 'Add item', PLUS_ICON);
  dressRailButton(ESP.$('#btnSame'), 'Same again', '');
  dressRailButton(ESP.$('#btnEvents'), 'Presets', PRESET_ICON);
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
    if (b.dataset.plain) {
      b.innerHTML = b.dataset.plain;
      delete b.dataset.plain;
      delete b.dataset.dressed;
    }
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

function localBox(sel) {
  const el = ESP.$(sel);
  if (!el || !el.getBoundingClientRect) return null;
  const s = getComputedStyle(el);
  if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  return { x: r.left, y: r.top, r: r.right, b: r.bottom };
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
  const obs = ['kMenuB', 'exitCarBtn', 'tup', 'nos', 'brk', 'wng', 'emoteBtn', 'zdWalkAct', 'zdWalkExit', 'zdWalkCam', 'zdWalkTitle', 'zdWalkFps', 'devOpen', 'enterBldBtn'].map(parentHudBox).filter(Boolean);
  ['header.bar', '#modes', '#drawTools', '#hint'].forEach(function (sel) {
    const box = localBox(sel);
    if (box) obs.push(box);
  });
  const rightJoy = obs.filter(function (o) { return o.x > w * 0.45 && o.b > h * 0.4; });
  let floor = (rightJoy.length ? Math.min.apply(null, rightJoy.map(function (o) { return o.y; })) : h) - 8;
  const foot = localBox('#toolsBuild') || localBox('#toolsPlace');
  if (foot && foot.y > 48) floor = Math.min(floor, foot.y - 8);
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
    b.style.fontSize = '';
    b.style.padding = '';
    b.style.overflow = 'hidden';
    b.style.whiteSpace = '';
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
  if (document.body) document.body.classList.add('zd-embed');
  const home = ESP.$('#btnHome');
  if (home) home.onclick = function () {
    ESP.saveNow();
    post(embed.from === 'walk' ? 'zd-interior-back' : 'zd-interior-exit');
  };
  const done = ESP.$('#btnWallsDone');
  if (done && embed.from === 'walk') done.onclick = function () {
    if (typeof ESP.commitEdit === 'function') ESP.commitEdit();
    ESP.saveNow();
    post('zd-interior-back');
  };
  ESP.walkPose = function walkPose(p) {
    ESP.walkPoseData = p || null;
    drawActor(p && p.segs);
    if (ESP.frame) ESP.frame();
  };
  ESP.setWalkCam = function setWalkCam(mode) {
    ESP.walkCam = mode === 'room' ? 'room' : 'chase';
    ESP.walkHeld = false;
    if (ESP.frame) ESP.frame();
    return ESP.walkCam;
  };
  ESP.sheetOpen = function sheetOpen() {
    const sheet = ESP.$('#sheet');
    return !!(sheet && !sheet.classList.contains('hidden'));
  };
  ESP.setWalk = function setWalk(on) {
    const was = !!ESP.walkOn;
    ESP.walkOn = !!on;
    ESP.sim = null;
    if (typeof ESP.simStop === 'function') ESP.simStop();
    if (document.body) {
      document.body.classList.add('zd-embed');
      document.body.classList.toggle('zd-walk', !!on);
      document.body.classList.toggle('zd-build', !on);
    }
    walkFloor(!!on);
    if (on) {
      if (!was) {
        if (typeof ESP.setWallsView === 'function') ESP.setWallsView('low');
        ESP.walkCam = 'chase';
        ESP.walkHeld = false;
      }
      ESP.select(null);
      if (typeof ESP.endStamp === 'function') ESP.endStamp();
      if (typeof ESP.closeSheet === 'function') ESP.closeSheet();
      if (ESP.phase !== 'place' && typeof ESP.setPhase === 'function') ESP.setPhase('place');
      ensureActor();
    } else {
      setFov(PLAN_FOV);
      ESP.walkHeld = false;
      if (typeof ESP.setPhase === 'function') ESP.setPhase('build');
    }
    mountWalkRail();
    if (typeof ESP.resize === 'function') ESP.resize();
    if (ESP.frame) ESP.frame();
    fitWalkRail();
  };
  ESP.fitWalkRail = fitWalkRail;
  addEventListener('resize', function () {
    if (document.body && (document.body.classList.contains('zd-walk') || document.body.classList.contains('zd-build'))) fitWalkRail();
  });
  if (embed.walk) ESP.setWalk(true);
  if (document.body) document.body.dataset.ready = '1';
  try { window.ESP = ESP; } catch (e) {}
  ESP.renderPresets();
  ESP.rebuildSoon();
  post('zd-interior-ready');
}
