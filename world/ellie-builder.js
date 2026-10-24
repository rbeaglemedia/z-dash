/* Ellie's Builder, pack B, inside the 24 by 18 m house.
   Build shows after she is already inside. The bar lives on the interior card.
   Tool rules live in editor-core.js. This file is the buttons and the floor map. */
'use strict';

let ellieSession = null;
let ellieOpened = false;
let elliePreview = false;
let ellieArmed = 'tv85';
let ellieDrag = null;
let ellieFloorMap = null;

const ELLIE_BUILDER = {
  get open() { return ellieOpened; },
  get view() { return ellieSession ? ellieSession.view : 'walk'; },
  get floorMap() { return ellieFloorMap; },
  caption: '',
  mount: ellieMount,
  show: ellieShow,
  hide: ellieHide,
  sync: ellieSync,
  paintFloor: elliePaintFloor
};

function ellieEnsure() {
  if (ellieSession) return ellieSession;
  ellieSession = EDITOR_CORE.create({
    role: 'ellie',
    roomId: 'house',
    saveKey: 'zdash.ellie.builder.v1'
  });
  return ellieSession;
}

function ellieHome() {
  if (elliePreview) return true;
  return typeof WALK_MODE !== 'undefined' && WALK_MODE && WALK_MODE.insideBuilding &&
    WALK_MODE.insideDoor && WALK_MODE.insideDoor.purpose === 'HOME';
}

function ellieSync() {
  const btn = document.getElementById('ellie-build');
  if (btn) btn.hidden = !ellieHome();
  if (!ellieHome() && ellieOpened) ellieHide();
}

function ellieMount(root, opts) {
  if (!root || document.getElementById('ellie-build')) return;
  opts = opts || {};
  elliePreview = !!opts.preview;
  if (!document.getElementById('ellie-style')) {
    const css = document.createElement('style');
    css.id = 'ellie-style';
    css.textContent = [
      '#ellie-build{position:absolute;z-index:5;right:14px;top:56px;min-height:44px;min-width:44px;padding:8px 14px;border:2px solid #04140c;border-radius:999px;background:#e9fff2;color:#04140c;font:800 14px sans-serif;cursor:pointer}',
      '#ellie-bar{position:absolute;z-index:5;left:8px;right:8px;bottom:8px;display:flex;flex-direction:column;gap:8px}',
      '#ellie-bar[hidden]{display:none}',
      '#ellie-bar .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
      '#ellie-bar button{min-height:44px;min-width:44px;padding:8px 12px;border:2px solid #243044;border-radius:12px;background:#fffdf8;color:#1c140c;font:800 14px sans-serif;cursor:pointer}',
      '#ellie-bar button[aria-pressed="true"]{background:#3ee6ff;border-color:#04140c}',
      '#ellie-bar button.swatch{padding:0}',
      '#ellie-size{min-height:44px;display:flex;align-items:center;padding:0 10px;font:800 14px sans-serif;color:#1c140c;background:#fffdf8;border:2px solid #243044;border-radius:12px}',
      '#ellie-note{min-height:44px;display:flex;align-items:center;padding:0 10px;font:700 14px sans-serif;color:#1c140c}',
      '#ellie-note:empty{display:none}',
      '#ellie-confirm{position:absolute;z-index:6;left:50%;top:42%;transform:translate(-50%,-50%);background:#fffdf8;color:#1c140c;border:2px solid #243044;border-radius:16px;padding:16px;width:min(320px,calc(100% - 32px))}',
      '#ellie-confirm[hidden]{display:none}',
      '#ellie-confirm p{margin:0 0 12px;font:700 16px sans-serif}',
      '#ellie-confirm .row{display:flex;gap:8px}',
      '#ellie-confirm button{min-height:44px;min-width:44px;padding:8px 14px;border:2px solid #243044;border-radius:12px;background:#fff;color:#1c140c;font:800 14px sans-serif;cursor:pointer}',
      '#ellie-confirm button.go{background:#3ee6ff}'
    ].join('');
    document.head.appendChild(css);
  }
  const build = document.createElement('button');
  build.id = 'ellie-build';
  build.type = 'button';
  build.textContent = 'Build';
  build.hidden = !ellieHome();
  build.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); ellieShow(); });

  const bar = document.createElement('div');
  bar.id = 'ellie-bar';
  bar.hidden = true;
  const rowA = document.createElement('div');
  rowA.className = 'row';
  const rowB = document.createElement('div');
  rowB.className = 'row';
  rowA.append(
    ellieBtn('Place', 'Place the chosen piece', () => ellieAct('place', ellieArmed)),
    ellieBtn('Turn', 'Quarter turn', () => ellieAct('turn')),
    ellieBtn('Copy', 'Copy', () => ellieAct('copy')),
    ellieBtn('Undo', 'Undo', () => ellieAct('undo')),
    ellieBtn('Redo', 'Redo', () => ellieAct('redo')),
    ellieBtn('Delete', 'Delete', () => ellieAct('delete')),
    ellieBtn('Done', 'Done', () => { ellieAct('done'); ellieHide(); })
  );
  for (let i = 0; i < EDITOR_CORE.palette.length; i++) {
    const id = EDITOR_CORE.palette[i];
    const spec = EDITOR_CORE.sizes[id];
    const b = ellieBtn(spec.name, spec.name, () => { ellieArmed = id; ellieRefresh(); });
    b.dataset.prop = id;
    rowB.appendChild(b);
  }
  const floor = ellieBtn('Floor', 'Floor', () => ellieAct('floor'));
  floor.dataset.view = 'floor';
  const walk = ellieBtn('Walk', 'Walk', () => ellieAct('walk'));
  walk.dataset.view = 'walk';
  rowB.append(floor, walk);
  for (let i = 0; i < EDITOR_CORE.swatches.length; i++) {
    const sw = EDITOR_CORE.swatches[i];
    const b = ellieBtn('', sw.label + ' glow', () => ellieAct('swatch', sw.hex));
    b.className = 'swatch';
    b.dataset.glow = sw.hex;
    b.style.background = sw.hex;
    b.setAttribute('aria-label', sw.label);
    rowB.appendChild(b);
  }
  const size = document.createElement('div');
  size.id = 'ellie-size';
  size.textContent = '';
  const note = document.createElement('div');
  note.id = 'ellie-note';
  const clear = ellieBtn('Start over', 'Start over', ellieAskClear);
  rowB.append(size, note, clear);
  bar.append(rowA, rowB);

  const ask = document.createElement('div');
  ask.id = 'ellie-confirm';
  ask.hidden = true;
  const q = document.createElement('p');
  q.textContent = 'Clear the pieces in this house?';
  const askRow = document.createElement('div');
  askRow.className = 'row';
  const go = document.createElement('button');
  go.type = 'button';
  go.className = 'go';
  go.textContent = 'Clear';
  go.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    ask.hidden = true;
    ellieAct('clear');
  });
  const keep = document.createElement('button');
  keep.type = 'button';
  keep.textContent = 'Keep';
  keep.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); ask.hidden = true; });
  askRow.append(go, keep);
  ask.append(q, askRow);

  root.append(build, bar, ask);
  if (!elliePreview) {
    document.addEventListener('pointerdown', ellieDown, true);
    document.addEventListener('pointerup', ellieUp, true);
    window.addEventListener('resize', ellieRepaint);
  }
  ellieRefresh();
}

function ellieBtn(label, aria, fn) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.setAttribute('aria-label', aria);
  b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
  return b;
}

function ellieShow() {
  if (!ellieHome()) return;
  const session = ellieEnsure();
  session.reload();
  session.view = 'walk';
  session.openSession();
  ellieOpened = true;
  const bar = document.getElementById('ellie-bar');
  if (bar) bar.hidden = false;
  const tools = document.getElementById('walk-room-tools');
  if (tools) tools.hidden = true;
  const card = document.getElementById('walk-interior');
  if (card) card.classList.add('ellie-build');
  ellieRefresh();
  ellieLift();
  ellieRepaint();
}

function ellieHide() {
  if (ellieSession) ellieSession.closeSession();
  ellieOpened = false;
  const bar = document.getElementById('ellie-bar');
  if (bar) bar.hidden = true;
  const ask = document.getElementById('ellie-confirm');
  if (ask) ask.hidden = true;
  const tools = document.getElementById('walk-room-tools');
  if (tools) tools.hidden = false;
  const card = document.getElementById('walk-interior');
  if (card) card.classList.remove('ellie-build');
  const out = document.getElementById('walk-step-out');
  if (out) out.style.bottom = '';
  ellieRepaint();
}

function ellieAskClear() {
  const ask = document.getElementById('ellie-confirm');
  if (ask) ask.hidden = false;
}

function ellieAct(name, arg) {
  const session = ellieEnsure();
  const res = session.call(name, arg);
  const note = document.getElementById('ellie-note');
  if (note) {
    if (res && res.reason === 'full') note.textContent = res.text || 'This room is full.';
    else if (res && res.reason === 'noslot') note.textContent = 'No open spot in this room.';
    else note.textContent = '';
  }
  ellieRefresh();
  ellieLift();
  ellieRepaint();
  return res;
}

function ellieRefresh() {
  const session = ellieSession;
  document.querySelectorAll('#ellie-bar button[data-prop]').forEach((b) => {
    b.setAttribute('aria-pressed', b.dataset.prop === ellieArmed ? 'true' : 'false');
  });
  document.querySelectorAll('#ellie-bar button[data-view]').forEach((b) => {
    const on = session && session.view === b.dataset.view;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const size = document.getElementById('ellie-size');
  if (size) {
    const text = session ? session.sizeText() : '';
    size.textContent = text;
    size.hidden = !text;
  }
}

function ellieLift() {
  const bar = document.getElementById('ellie-bar');
  const out = document.getElementById('walk-step-out');
  if (!out || !bar) return;
  if (bar.hidden) out.style.bottom = '';
  else out.style.bottom = (bar.offsetHeight + 16) + 'px';
}

function ellieRepaint() {
  if (typeof walkPaintRoom === 'function') walkPaintRoom();
}

function elliePoint(e, cv) {
  const r = cv.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) / Math.max(1, r.width) * cv.width,
    y: (e.clientY - r.top) / Math.max(1, r.height) * cv.height
  };
}

function ellieDown(e) {
  if (!ellieOpened) return;
  const cv = document.getElementById('walk-room-cv');
  if (!cv || e.target !== cv) return;
  e.preventDefault();
  e.stopPropagation();
  const pt = elliePoint(e, cv);
  const session = ellieEnsure();
  const hit = session.view === 'floor' ? ellieFloorHit(pt.x, pt.y) : ellieWalkHit(pt.x, pt.y, cv.width, cv.height);
  if (hit == null) session.select(null);
  else {
    session.select(hit);
    ellieDrag = { index: hit };
  }
  ellieRefresh();
  ellieRepaint();
}

function ellieUp(e) {
  if (!ellieDrag) return;
  const cv = document.getElementById('walk-room-cv');
  ellieDrag = null;
  if (!cv || !ellieOpened) return;
  const session = ellieEnsure();
  const prop = session.props[session.sel];
  if (!prop) return;
  const pt = elliePoint(e, cv);
  const kind = EDITOR_CORE.kind(prop.prop);
  if (session.view === 'floor' && ellieFloorMap) {
    const w = ellieFloorMap.toWorld(pt.x, pt.y);
    session.move({ x: w.x, y: prop.y, z: w.z, kind: kind });
  } else {
    const slot = ellieScreenSlot(pt.x, pt.y, cv.width, cv.height, kind);
    if (slot) session.move({ x: slot.x, y: slot.y, z: slot.z, kind: kind });
    else if (typeof SAMPLER !== 'undefined' && SAMPLER.unproject) {
      const floor = SAMPLER.unproject(pt.x, pt.y, cv.width, cv.height);
      if (floor) session.move({ x: floor.x, y: kind === 'wall' ? 1.15 : 0, z: floor.z, kind: kind });
    }
  }
  ellieRefresh();
  ellieRepaint();
}

function ellieProject(x, y, z) {
  if (typeof SAMPLER === 'undefined' || !SAMPLER.project || !SAMPLER.view) return null;
  return SAMPLER.project(x, y, z, SAMPLER.view);
}

function ellieWalkHit(px, py, W, H) {
  const session = ellieSession;
  if (!session) return null;
  let best = null;
  let bestD = 1e9;
  for (let i = 0; i < session.props.length; i++) {
    const item = session.props[i];
    const spec = EDITOR_CORE.sizes[item.prop] || { h: 1, w: 1 };
    const p = ellieProject(item.x, item.y + spec.h * 0.5, item.z);
    if (!p) continue;
    const dz = Math.max(0.35, item.z - SAMPLER.view.camZ);
    const reach = Math.max(48, (spec.w * SAMPLER.view.focal / dz) * 0.55);
    const d = Math.hypot(p[0] - px, p[1] - py);
    if (d <= reach && d < bestD) {
      bestD = d;
      best = i;
    }
  }
  if (best != null) return best;
  if (typeof SAMPLER === 'undefined' || !SAMPLER.unproject) return null;
  const floor = SAMPLER.unproject(px, py, W, H);
  if (!floor) return null;
  for (let i = 0; i < session.props.length; i++) {
    const item = session.props[i];
    if (item.wall) continue;
    const spec = EDITOR_CORE.sizes[item.prop] || { w: 0.8, d: 0.8 };
    if (Math.abs(floor.x - item.x) < spec.w * 0.5 + 0.35 && Math.abs(floor.z - item.z) < spec.d * 0.5 + 0.35) return i;
  }
  return null;
}

function ellieScreenSlot(px, py, W, H, kind) {
  if (typeof ROOM_PLACE === 'undefined') return null;
  const room = ROOM_PLACE.describe('house');
  if (!room) return null;
  const kindSlots = kind === 'wall' ? room.wall : room.floor;
  let best = null;
  let bestD = 48;
  for (let i = 0; i < kindSlots.length; i++) {
    const s = kindSlots[i];
    if (s.holds === 'hero') continue;
    const specH = s.wall ? 0.6 : 0.4;
    const p = ellieProject(s.x, (s.y || 0) + specH, s.z);
    if (!p) continue;
    const d = Math.hypot(p[0] - px, p[1] - py);
    if (d < bestD) { bestD = d; best = s; }
  }
  return best;
}

function ellieFloorHit(px, py) {
  const map = ellieFloorMap;
  const session = ellieSession;
  if (!map || !session) return null;
  const w = map.toWorld(px, py);
  let best = null;
  let bestD = 1.2;
  for (let i = 0; i < session.props.length; i++) {
    const item = session.props[i];
    const spec = EDITOR_CORE.sizes[item.prop] || { w: 0.8, d: 0.8 };
    const dx = Math.abs(w.x - item.x);
    const dz = Math.abs(w.z - item.z);
    if (dx <= spec.w * 0.5 + 0.3 && dz <= spec.d * 0.5 + 0.3) {
      const d = Math.hypot(w.x - item.x, w.z - item.z);
      if (d < bestD) { bestD = d; best = i; }
    }
  }
  return best;
}

function elliePaintFloor(g, W, H, opts) {
  opts = opts || {};
  const session = ellieSession || (typeof EDITOR_CORE !== 'undefined' && EDITOR_CORE.live);
  const list = session && session.props ? session.props : (EDITOR_CORE.r1House ? EDITOR_CORE.r1House() : []);
  const top = 86;
  const bottom = 150;
  const side = 24;
  const scale = Math.min((W - side * 2) / 24, (H - top - bottom) / 18);
  const mapW = 24 * scale;
  const mapH = 18 * scale;
  const x0 = (W - mapW) / 2;
  const y0 = top + Math.max(0, (H - top - bottom - mapH) / 2);
  const map = {
    scale: scale,
    x0: x0,
    y0: y0,
    toScreen: function (x, z) { return [x0 + (x + 12) * scale, y0 + (18 - z) * scale]; },
    toWorld: function (px, py) { return { x: (px - x0) / scale - 12, z: 18 - (py - y0) / scale }; }
  };
  ellieFloorMap = map;
  g.fillStyle = '#fffdf8';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#f3ecdf';
  g.fillRect(x0, y0, mapW, mapH);
  g.strokeStyle = '#9ad4e2';
  g.lineWidth = 3;
  g.strokeRect(x0, y0, mapW, mapH);
  const doorL = map.toScreen(-1.2, 0);
  const doorR = map.toScreen(1.2, 0);
  g.strokeStyle = '#fffdf8';
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(doorL[0], doorL[1]);
  g.lineTo(doorR[0], doorR[1]);
  g.stroke();
  g.fillStyle = '#243044';
  g.font = '700 13px sans-serif';
  g.textAlign = 'center';
  const doorWord = map.toScreen(0, 0.45);
  g.fillText('Door', doorWord[0], doorWord[1]);

  if (typeof ROOM_PLACE !== 'undefined') {
    const room = ROOM_PLACE.describe('house');
    const slots = room ? room.floor.concat(room.wall) : [];
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      const p = map.toScreen(s.x, s.z);
      g.fillStyle = s.holds === 'hero' ? '#c8c2b8' : '#3ee6ff';
      g.fillRect(p[0] - 4, p[1] - 4, 8, 8);
    }
  }
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const spec = EDITOR_CORE.sizes[item.prop] || { w: 0.8, d: 0.8, h: 1 };
    const c = map.toScreen(item.x, item.z);
    const rw = Math.max(10, spec.w * scale);
    const rd = Math.max(10, spec.d * scale);
    g.fillStyle = (item.params && item.params.glow) || '#1b1e26';
    g.fillRect(c[0] - rw / 2, c[1] - rd / 2, rw, rd);
    if (session && session.sel === i) {
      g.strokeStyle = '#04140c';
      g.lineWidth = 2;
      g.strokeRect(c[0] - rw / 2 - 3, c[1] - rd / 2 - 3, rw + 6, rd + 6);
    }
  }
  const who = (opts && opts.x != null) ? opts : { x: 0, z: 3.6, petX: 1.35, petZ: 3.85 };
  const ellie = map.toScreen(who.x || 0, who.z || 3.6);
  const pet = map.toScreen(who.petX != null ? who.petX : 1.35, who.petZ != null ? who.petZ : 3.85);
  g.fillStyle = '#2f7f96';
  g.beginPath();
  g.arc(ellie[0], ellie[1], Math.max(7, 0.28 * scale), 0, 6.3);
  g.fill();
  g.fillStyle = '#ffb020';
  g.beginPath();
  g.arc(pet[0], pet[1], Math.max(5, 0.18 * scale), 0, 6.3);
  g.fill();
  const caption = opts.caption || ELLIE_BUILDER.caption;
  if (caption) ellieCaption(g, caption);
}

function ellieCaption(g, caption) {
  g.font = '700 14px sans-serif';
  const w = g.measureText(caption).width + 20;
  g.fillStyle = '#04140c';
  g.fillRect(12, 12, w, 28);
  g.fillStyle = '#e9fff2';
  g.textAlign = 'left';
  g.fillText(caption, 22, 31);
}

if (typeof document !== 'undefined') {
  const ellieBoot = function () {
    if (typeof SAMPLER === 'undefined') return;
    if (SAMPLER.onHome && SAMPLER.onHome._ellie) return;
    const prevHome = SAMPLER.onHome;
    const prevLeave = SAMPLER.onLeave;
    SAMPLER.onHome = function () {
      if (prevHome) prevHome();
      const card = document.getElementById('walk-interior');
      if (card) ellieMount(card);
      ellieSync();
    };
    SAMPLER.onHome._ellie = 1;
    SAMPLER.onLeave = function () {
      ellieHide();
      if (prevLeave) prevLeave();
      ellieSync();
    };
  };
  ellieBoot();
}

if (typeof globalThis !== 'undefined') globalThis.ELLIE_BUILDER = ELLIE_BUILDER;
if (typeof window !== 'undefined') window.ELLIE_BUILDER = ELLIE_BUILDER;
