/* Neon World embed. The planner tools stay as they are.
   A room key loads and saves that building's layout only.
   1 unit is 1 foot, the same as the event planner. */
import { ESP } from './app/runtime.js';
import { deserialize, serialize } from './grid.js';
import { rectPoly, wallRects, floorOf, floorBounds, placeDoor } from './walls.js';
import { dims, def } from './logic.js';

const FT = 0.3048;
/* Outdoor chase, written in planner feet: 4.5 m back, eye 1.85 m, look 1.10 m. */
const WALK_BACK = 4.5 / FT;
const WALK_EYE = 1.85 / FT;
const WALK_LOOK = 1.10 / FT;

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

function walkTarget() {
  const p = ESP.walkPoseData;
  if (p && Number.isFinite(p.x) && Number.isFinite(p.z)) return p;
  const fw = ESP.EMBED && ESP.EMBED.fw || 60;
  const fd = ESP.EMBED && ESP.EMBED.fd || 80;
  return { x: fw / 2, z: Math.min(6, fd * 0.12), y: 0, yaw: 0 };
}

function placeWalkCam() {
  const p = walkTarget();
  const y = Number.isFinite(p.y) ? p.y : 0;
  const yaw = Number.isFinite(p.yaw) ? p.yaw : 0;
  const cx = p.x - Math.sin(yaw) * WALK_BACK;
  const cz = p.z - Math.cos(yaw) * WALK_BACK;
  ESP.camera.position.set(cx, y + WALK_EYE, cz);
  ESP.camera.lookAt(p.x, y + WALK_LOOK, p.z);
  ESP.camera.updateMatrixWorld();
}

function installWalkCam() {
  if (!ESP.placeCam || ESP.placeCam._walk) return;
  const orbit = ESP.placeCam;
  const wrapped = function placeCamWalk() {
    if (ESP.walkOn) { placeWalkCam(); return; }
    orbit();
  };
  wrapped._walk = 1;
  ESP.placeCam = wrapped;
  if (typeof ESP.overlays === 'function' && !ESP.overlays._walk) {
    const overlays = ESP.overlays;
    const wrappedOverlays = function overlaysWalk() {
      if (ESP.walkOn) {
        if (ESP.grid1) ESP.grid1.visible = false;
        if (ESP.grid10) ESP.grid10.visible = false;
        if (ESP.grid100) ESP.grid100.visible = false;
        if (ESP.cursorDot) ESP.cursorDot.visible = false;
        return;
      }
      overlays();
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
  css.textContent = 'body.zd-walk header.bar,body.zd-walk #modes,body.zd-walk #toolsBuild,body.zd-walk #toolsPlace,body.zd-walk #drawTools,body.zd-walk #presets,body.zd-walk #rail,body.zd-walk #hist,body.zd-walk #snapHint,body.zd-walk #lvlBar,body.zd-walk #hint,body.zd-walk #btnClear,body.zd-walk .ver,body.zd-walk #simBar,body.zd-walk #labels,body.zd-walk #presetTip,body.zd-walk #stampBar,body.zd-walk #selBar,body.zd-walk #sheet{display:none!important}';
  document.head.appendChild(css);
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
    if (ESP.walkOn && ESP.frame) ESP.frame();
  };
  ESP.setWalk = function setWalk(on) {
    ESP.walkOn = !!on;
    ESP.sim = null;
    if (typeof ESP.simStop === 'function') ESP.simStop();
    if (document.body) document.body.classList.toggle('zd-walk', !!on);
    if (on) {
      ESP.select(null);
      if (typeof ESP.endStamp === 'function') ESP.endStamp();
      if (typeof ESP.closeSheet === 'function') ESP.closeSheet();
      if (typeof ESP.setWallsView === 'function') ESP.setWallsView('full');
    } else if (typeof ESP.setWallsView === 'function') {
      ESP.setWallsView('low');
    }
    if (typeof ESP.resize === 'function') ESP.resize();
    if (ESP.frame) ESP.frame();
  };
  if (embed.walk) ESP.setWalk(true);
  if (document.body) document.body.dataset.ready = '1';
  try { window.ESP = ESP; } catch (e) {}
  ESP.renderPresets();
  ESP.rebuildSoon();
  post('zd-interior-ready');
}
