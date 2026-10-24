/* Shared tool core for Ellie's Builder and the later DEV Builder.
   Planner Port bc-40642464 owns the DEV role and the Q2 tools.
   Add that role in this file. Keep one core.
   No DOM and no city. Road, structure, NOS, and spawn calls return
   { ok:false, reason:'off' }.
   Ellie writes only zdash.ellie.builder.v1. */
'use strict';

const EDITOR_SAVE = 'zdash.ellie.builder.v1';
const EDITOR_LOCKED = ['zdash.house.v1', 'zdash.kid.v1', 'zdash.sampler.likes.v1'];
const EDITOR_PACK_B = ['select', 'move', 'turn', 'copy', 'size', 'floor', 'walk', 'swatch', 'undo', 'redo', 'delete', 'done', 'place', 'clear'];
const EDITOR_OFF = {
  road: 1, building: 1, nos: 1, spawn: 1, scale: 1, align: 1, array: 1,
  measure: 1, layer: 1, walldraw: 1, same: 1, group: 1, rotate15: 1
};

/* Real envelopes, feet converted at 0.3048. y on a prop is the bottom. */
const EDITOR_SIZES = {
  tv85: { w: 1.90, d: 0.33, h: 1.08, label: '1.9 m wide', kind: 'wall', glow: '#3ee6ff', name: 'TV' },
  ledposter: { w: 0.64, d: 0.47, h: 2.03, label: '0.6 m wide', kind: 'wall', glow: '#ff4fd8', name: 'Poster' },
  speaker: { w: 0.38, d: 0.38, h: 1.83, label: '1.8 m tall', kind: 'floor', glow: '#ffb020', name: 'Speaker' },
  kiosk: { w: 0.46, d: 0.46, h: 1.22, label: '1.2 m tall', kind: 'floor', glow: '#3ee6ff', name: 'Kiosk' }
};

const EDITOR_SWATCHES = [
  { id: 'cyan', hex: '#3ee6ff', label: 'Cyan' },
  { id: 'magenta', hex: '#ff4fd8', label: 'Magenta' },
  { id: 'amber', hex: '#ffb020', label: 'Amber' },
  { id: 'white', hex: '#ffffff', label: 'White' }
];

const EDITOR_PALETTE = ['tv85', 'ledposter', 'speaker', 'kiosk'];

function editorSlot(id) {
  if (typeof ROOM_PLACE === 'undefined' || !ROOM_PLACE) return null;
  const room = ROOM_PLACE.describe('house');
  if (!room) return null;
  const all = room.floor.concat(room.wall);
  for (let i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}

function editorPut(prop, id, params, yaw) {
  const s = editorSlot(id);
  const spec = EDITOR_SIZES[prop];
  const wall = s && s.wall ? s.wall : null;
  return {
    prop: prop,
    x: s ? s.x : 0,
    y: s ? s.y : 0,
    z: s ? s.z : 0,
    yaw: wall ? s.yaw : (yaw == null ? Math.PI : yaw),
    wall: wall,
    slot: id,
    params: params || { glow: spec.glow }
  };
}

function editorR1House() {
  return [
    editorPut('tv85', 'wall-far-left', { glow: '#3ee6ff' }),
    editorPut('ledposter', 'wall-far-right', { glow: '#ff4fd8' }),
    editorPut('speaker', 'floor-left', { w: 0.38, h: 1.83, d: 0.38, glow: '#ffb020' }),
    editorPut('kiosk', 'floor-right', { glow: '#3ee6ff' })
  ];
}

function editorKind(id) {
  return EDITOR_SIZES[id] ? EDITOR_SIZES[id].kind : '';
}

const EDITOR_CORE = {
  live: null,
  saveKey: EDITOR_SAVE,
  packB: EDITOR_PACK_B,
  sizes: EDITOR_SIZES,
  swatches: EDITOR_SWATCHES,
  palette: EDITOR_PALETTE,
  r1House: editorR1House,
  kind: editorKind,
  create: editorCreate
};

function editorCreate(opts) {
  opts = opts || {};
  const role = opts.role || 'ellie';
  const roomId = opts.roomId || 'house';
  const saveKey = opts.saveKey || EDITOR_SAVE;
  const inert = {
    ok: false,
    reason: 'house',
    open: false,
    props: [],
    roomId: roomId,
    view: 'walk',
    sel: null,
    call: function () { return { ok: false, reason: 'house' }; }
  };
  if (role === 'ellie' && roomId !== 'house') return inert;
  if (role !== 'ellie') return Object.assign({}, inert, { reason: 'role', call: function () { return { ok: false, reason: 'off' }; } });

  const props = [];
  const state = { sel: null, view: 'walk', open: false };
  const undo = [];
  const redo = [];

  function allowed(name) {
    if (EDITOR_OFF[name]) return false;
    return EDITOR_PACK_B.indexOf(name) >= 0;
  }

  function off() { return { ok: false, reason: 'off' }; }

  function readRaw() {
    try {
      const raw = JSON.parse(localStorage.getItem(saveKey) || 'null');
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw;
    } catch (e) {}
    return null;
  }

  function writeSave(raw) {
    if (saveKey !== EDITOR_SAVE) return { ok: false, reason: 'locked' };
    const kept = {};
    for (let i = 0; i < EDITOR_LOCKED.length; i++) kept[EDITOR_LOCKED[i]] = localStorage.getItem(EDITOR_LOCKED[i]);
    localStorage.setItem(EDITOR_SAVE, JSON.stringify(raw));
    for (let i = 0; i < EDITOR_LOCKED.length; i++) {
      const key = EDITOR_LOCKED[i];
      if (localStorage.getItem(key) === kept[key]) continue;
      if (kept[key] == null) {
        if (typeof localStorage.removeItem === 'function') localStorage.removeItem(key);
      } else localStorage.setItem(key, kept[key]);
    }
    return { ok: true };
  }

  function writeSession() {
    const prev = readRaw();
    const raw = prev && prev.rooms ? prev : { v: 1, rooms: {} };
    raw.v = 1;
    if (!raw.rooms || typeof raw.rooms !== 'object' || Array.isArray(raw.rooms)) raw.rooms = {};
    raw.rooms[roomId] = { props: JSON.parse(JSON.stringify(props)) };
    return writeSave(raw);
  }

  function loadList() {
    if (typeof ROOM_PLACE === 'undefined' || !ROOM_PLACE) return [];
    if (ROOM_PLACE.hasSave()) return JSON.parse(JSON.stringify(ROOM_PLACE.read(roomId) || []));
    if (roomId === 'house') return editorR1House();
    return [];
  }

  function reload() {
    const next = loadList();
    props.length = 0;
    for (let i = 0; i < next.length; i++) props.push(next[i]);
    state.sel = props.length ? 0 : null;
    undo.length = 0;
    redo.length = 0;
    return props;
  }

  function snapshot() {
    undo.push(JSON.stringify({ props: props, sel: state.sel }));
    if (undo.length > 100) undo.shift();
    redo.length = 0;
  }

  function restore(from, to) {
    if (!from.length) return { ok: false, reason: 'empty' };
    to.push(JSON.stringify({ props: props, sel: state.sel }));
    const data = JSON.parse(from.pop());
    props.length = 0;
    for (let i = 0; i < data.props.length; i++) props.push(data.props[i]);
    state.sel = data.sel;
    if (state.sel != null && (state.sel < 0 || state.sel >= props.length)) state.sel = props.length ? props.length - 1 : null;
    return { ok: true };
  }

  function taken(except) {
    const ids = [];
    for (let i = 0; i < props.length; i++) if (i !== except && props[i].slot) ids.push(props[i].slot);
    return ids;
  }

  function firstFree(kind) {
    const room = ROOM_PLACE.describe(roomId);
    if (!room) return null;
    const slots = kind === 'wall' ? room.wall : room.floor;
    const skip = {};
    const have = taken(-1);
    for (let i = 0; i < have.length; i++) skip[have[i]] = 1;
    const door = ROOM_PLACE.rules.doorKeepOut;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (s.holds === 'hero' || skip[s.id]) continue;
      if (Math.abs(s.x) < door.x && s.z < door.z) continue;
      return s;
    }
    return null;
  }

  function paramsFor(id, glow) {
    const spec = EDITOR_SIZES[id];
    const color = glow || spec.glow;
    if (id === 'speaker') return { w: spec.w, h: spec.h, d: spec.d, glow: color };
    return { glow: color };
  }

  function adopt(id, slot, glow) {
    const wall = slot.wall || null;
    return {
      prop: id,
      x: slot.x,
      y: slot.y,
      z: slot.z,
      yaw: wall ? slot.yaw : Math.PI,
      wall: wall,
      slot: slot.id,
      params: paramsFor(id, glow)
    };
  }

  function place(id) {
    if (!allowed('place')) return off();
    if (!EDITOR_SIZES[id]) return off();
    if (props.length >= 48) return { ok: false, reason: 'full', text: 'This room is full.' };
    const slot = firstFree(editorKind(id));
    if (!slot) return { ok: false, reason: 'noslot' };
    snapshot();
    props.push(adopt(id, slot));
    state.sel = props.length - 1;
    return { ok: true, slot: slot.id };
  }

  function copy() {
    if (!allowed('copy')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    if (props.length >= 48) return { ok: false, reason: 'full', text: 'This room is full.' };
    const src = props[state.sel];
    const slot = firstFree(editorKind(src.prop));
    if (!slot) return { ok: false, reason: 'noslot' };
    snapshot();
    const glow = src.params && src.params.glow;
    const item = adopt(src.prop, slot, glow);
    if (!item.wall) item.yaw = src.yaw;
    props.push(item);
    state.sel = props.length - 1;
    return { ok: true, slot: slot.id };
  }

  function move(hit) {
    if (!allowed('move')) return off();
    if (state.sel == null || !props[state.sel] || !hit) return { ok: false, reason: 'none' };
    const prop = props[state.sel];
    const kind = editorKind(prop.prop);
    if (hit.kind && hit.kind !== kind) return { ok: true, snapped: false };
    const slot = ROOM_PLACE.snap(roomId, {
      x: hit.x, y: hit.y || 0, z: hit.z, kind: kind
    }, taken(state.sel));
    if (!slot || slot.id === prop.slot) return { ok: true, snapped: !!slot, slot: prop.slot };
    snapshot();
    prop.x = slot.x;
    prop.y = slot.y;
    prop.z = slot.z;
    prop.slot = slot.id;
    prop.wall = slot.wall || null;
    if (prop.wall) prop.yaw = slot.yaw;
    return { ok: true, snapped: true, slot: slot.id };
  }

  function turn() {
    if (!allowed('turn')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    const prop = props[state.sel];
    if (prop.wall) return { ok: true, yaw: prop.yaw };
    snapshot();
    prop.yaw = prop.yaw + Math.PI / 2;
    if (prop.yaw > Math.PI * 2 - 1e-6) prop.yaw -= Math.PI * 2;
    return { ok: true, yaw: prop.yaw };
  }

  function setGlow(hex) {
    if (!allowed('swatch')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    snapshot();
    const prop = props[state.sel];
    prop.params = Object.assign({}, prop.params, { glow: hex });
    return { ok: true, glow: hex };
  }

  function remove() {
    if (!allowed('delete')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    snapshot();
    props.splice(state.sel, 1);
    if (!props.length) state.sel = null;
    else if (state.sel >= props.length) state.sel = props.length - 1;
    return { ok: true };
  }

  function sizeText() {
    if (state.sel == null || !props[state.sel]) return '';
    const spec = EDITOR_SIZES[props[state.sel].prop];
    return spec ? spec.label : '';
  }

  function startOver() {
    if (!allowed('clear')) return off();
    snapshot();
    props.length = 0;
    state.sel = null;
    writeSession();
    return { ok: true };
  }

  const session = {
    roomId: roomId,
    role: role,
    saveKey: saveKey,
    props: props,
    get sel() { return state.sel; },
    set sel(v) { state.sel = v; },
    get view() { return state.view; },
    set view(v) { state.view = v; },
    get open() { return state.open; },
    reload: reload,
    openSession: function () {
      state.open = true;
      EDITOR_CORE.live = session;
    },
    closeSession: function () {
      state.open = false;
      if (EDITOR_CORE.live === session) EDITOR_CORE.live = null;
    },
    allowed: allowed,
    place: place,
    copy: copy,
    move: move,
    turn: turn,
    setGlow: setGlow,
    remove: remove,
    sizeText: sizeText,
    startOver: startOver,
    commit: function () {
      if (!allowed('done')) return off();
      return writeSession();
    },
    select: function (index) {
      if (!allowed('select')) return off();
      if (index == null || index < 0 || index >= props.length) {
        state.sel = null;
        return { ok: true, sel: null };
      }
      state.sel = index;
      return { ok: true, sel: state.sel };
    },
    undo: function () { return allowed('undo') ? restore(undo, redo) : off(); },
    redo: function () { return allowed('redo') ? restore(redo, undo) : off(); },
    call: function (name, arg) {
      if (!allowed(name)) return off();
      if (name === 'place') return place(arg);
      if (name === 'turn') return turn();
      if (name === 'copy') return copy();
      if (name === 'delete') return remove();
      if (name === 'undo') return session.undo();
      if (name === 'redo') return session.redo();
      if (name === 'done') return session.commit();
      if (name === 'swatch') return setGlow(arg);
      if (name === 'floor') { state.view = 'floor'; return { ok: true, view: 'floor' }; }
      if (name === 'walk') { state.view = 'walk'; return { ok: true, view: 'walk' }; }
      if (name === 'size') return { ok: true, text: sizeText() };
      if (name === 'select') return session.select(arg);
      if (name === 'move') return move(arg);
      if (name === 'clear') return startOver();
      return off();
    }
  };

  reload();
  return session;
}

if (typeof globalThis !== 'undefined') globalThis.EDITOR_CORE = EDITOR_CORE;
if (typeof window !== 'undefined') window.EDITOR_CORE = EDITOR_CORE;
