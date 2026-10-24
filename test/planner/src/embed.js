/* Neon World embed. The planner tools stay as they are.
   A room key loads and saves that building's layout only.
   1 unit is 1 foot, the same as the event planner. */
import { ESP } from './app/runtime.js';
import { deserialize, serialize } from './grid.js';
import { rectPoly, wallRects, floorOf, floorBounds } from './walls.js';
import { dims, def } from './logic.js';

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
    from: q.get('from') || 'dev'
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
    ESP.setPhase('build');
  }
  ESP.applyEnv();
  ESP.select(null);
  ESP.resetView();
  ESP.histReset();
  ESP.showScreen('build');
  const home = ESP.$('#btnHome');
  if (home) home.onclick = function () { ESP.saveNow(); post('zd-interior-exit'); };
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
  if (document.body) document.body.dataset.ready = '1';
  ESP.renderPresets();
  ESP.rebuildSoon();
}
