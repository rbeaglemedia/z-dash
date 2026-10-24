/* One shared tool file for the DEV Builder and for Ellie's Builder.
   DEV calls snap, rotate, moveHosts, copySpot, history, roof, measure, align, and group.
   Ellie calls roomSnap, rotate, moveHosts, copySpot, and history, plus create() for pack B.
   Units are metres. This file has no canvas shadowBlur. */
'use strict';
(function (root) {
  var FT = 0.3048;

  function round(n, step) {
    return Math.round(n / step) * step;
  }

  function snap(x, z, step) {
    step = step || 2;
    return { x: round(x, step), z: round(z, step) };
  }

  /* Planner item snap is 0.5 ft. Ellie's room can pass 0.5 for the half-metre step. */
  function itemSnap(x, z) {
    return snap(x, z, 0.5 * FT);
  }

  function rotate(yawDeg, mode) {
    var step = mode === 'deg15' ? 15 : 90;
    var y = ((yawDeg || 0) + step) % 360;
    if (y < 0) y += 360;
    return y;
  }

  function moveHosts(host, dx, dz, items) {
    return items.map(function (it) {
      if (it.id !== host.id && it.host !== host.id) return it;
      return Object.assign({}, it, {
        x: it.x + dx, z: it.z + dz,
        x0: it.x0 + dx, x1: it.x1 + dx, z0: it.z0 + dz, z1: it.z1 + dz
      });
    });
  }

  function copySpot(item, gap) {
    var w = Math.abs(item.x1 - item.x0);
    var dx = w + (gap == null ? 0.5 * FT : gap);
    return Object.assign({}, item, {
      id: null, objId: null,
      x: item.x + dx, z: item.z,
      x0: item.x0 + dx, x1: item.x1 + dx
    });
  }

  function createHistory(limit) {
    var stack = [];
    var i = -1;
    limit = limit || 100;
    return {
      push: function (doc) {
        var s = JSON.stringify(doc);
        if (i >= 0 && stack[i] === s) return;
        stack.splice(i + 1);
        stack.push(s);
        while (stack.length > limit) { stack.shift(); i--; }
        i = stack.length - 1;
      },
      undo: function () {
        if (i <= 0) return null;
        i--;
        return JSON.parse(stack[i]);
      },
      redo: function () {
        if (i < 0 || i >= stack.length - 1) return null;
        i++;
        return JSON.parse(stack[i]);
      },
      canUndo: function () { return i > 0; },
      canRedo: function () { return i >= 0 && i < stack.length - 1; }
    };
  }

  function measure(a, b) {
    var dx = b.x - a.x, dz = b.z - a.z;
    return { dx: dx, dz: dz, metres: Math.hypot(dx, dz) };
  }

  function distPointSeg(px, pz, r) {
    var dx = r.x1 - r.x0, dz = r.z1 - r.z0;
    var L2 = dx * dx + dz * dz || 1;
    var t = Math.max(0, Math.min(1, ((px - r.x0) * dx + (pz - r.z0) * dz) / L2));
    return Math.hypot(px - (r.x0 + dx * t), pz - (r.z0 + dz * t));
  }

  function alignFace(b, roads) {
    var cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    var best = null, bestD = 1e9;
    (roads || []).forEach(function (r) {
      if (r.kind && r.kind !== 'street') return;
      var d = distPointSeg(cx, cz, r);
      if (d < bestD) { bestD = d; best = r; }
    });
    if (!best) return Object.assign({}, b);
    var horiz = Math.abs(best.x1 - best.x0) >= Math.abs(best.z1 - best.z0);
    var face = horiz ? (cz >= (best.z0 + best.z1) / 2 ? 'n' : 's') : (cx >= (best.x0 + best.x1) / 2 ? 'e' : 'w');
    var yaw = face === 'n' ? 0 : face === 'e' ? 90 : face === 's' ? 180 : 270;
    return Object.assign({}, b, { face: face, yaw: yaw });
  }

  function alignEdges(members, axis) {
    if (!members.length) return members;
    var key0 = axis === 'z' ? 'z0' : 'x0';
    var edge = members[0][key0];
    var deltaKey = axis === 'z' ? 'z' : 'x';
    return members.map(function (b) {
      var d = edge - b[key0];
      var next = Object.assign({}, b);
      next[deltaKey] = b[deltaKey] + d;
      next.x0 = b.x0 + (axis === 'z' ? 0 : d);
      next.x1 = b.x1 + (axis === 'z' ? 0 : d);
      next.z0 = b.z0 + (axis === 'z' ? d : 0);
      next.z1 = b.z1 + (axis === 'z' ? d : 0);
      return next;
    });
  }

  function groupMove(members, dx, dz) {
    return members.map(function (b) {
      return Object.assign({}, b, {
        x: b.x + dx, z: b.z + dz,
        x0: b.x0 + dx, x1: b.x1 + dx,
        z0: b.z0 + dz, z1: b.z1 + dz
      });
    });
  }

  function box(part, x0, x1, y0, y1, z0, z1) {
    if (x1 < x0) { var tx = x0; x0 = x1; x1 = tx; }
    if (z1 < z0) { var tz = z0; z0 = z1; z1 = tz; }
    return { part: part, x0: x0, x1: x1, y0: y0, y1: y1, z0: z0, z1: z1 };
  }

  /* Closed rectangle. Flat, pitched, and dome roofs are stacked boxes. No rotated mesh. */
  function roof(b, kind) {
    var x0 = b.x0, x1 = b.x1, z0 = b.z0, z1 = b.z1;
    var y = b.h || 8;
    kind = kind || 'flat';
    if (kind === 'pitch') {
      var parts = [];
      var span = Math.min(x1 - x0, z1 - z0);
      var steps = 4;
      for (var i = 0; i < steps; i++) {
        var u0 = i / steps;
        var inset = (span / 2) * u0 * 0.85;
        parts.push(box('roof-pitch', x0 + inset, x1 - inset, y + i * 0.45, y + (i + 1) * 0.45, z0 + inset * 0.35, z1 - inset * 0.35));
      }
      return parts;
    }
    if (kind === 'dome') {
      var rings = [];
      var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      var rad = Math.min(x1 - x0, z1 - z0) / 2;
      for (var k = 0; k < 4; k++) {
        var rr = rad * (1 - k / 4);
        rings.push(box('roof-dome', cx - rr, cx + rr, y + k * 0.4, y + (k + 1) * 0.4, cz - rr, cz + rr));
      }
      return rings;
    }
    return [box('roof-flat', x0 - 0.4, x1 + 0.4, y, y + 0.16, z0 - 0.4, z1 + 0.4)];
  }

  function cornersOf(b) {
    var yaw = ((b.yaw || 0) * Math.PI) / 180;
    var c = Math.cos(yaw), s = Math.sin(yaw);
    var w = b.w, d = b.d;
    return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(function (p) {
      return [b.x + p[0] * c - p[1] * s, b.z + p[0] * s + p[1] * c];
    });
  }

  function withAabb(b) {
    var cs = b.corners || cornersOf(b);
    var xs = cs.map(function (p) { return p[0]; });
    var zs = cs.map(function (p) { return p[1]; });
    return Object.assign({}, b, {
      corners: cs,
      x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs),
      z0: Math.min.apply(null, zs), z1: Math.max.apply(null, zs)
    });
  }

  function inside(b, x, z, pad) {
    pad = pad || 0;
    return x >= b.x0 - pad && x <= b.x1 + pad && z >= b.z0 - pad && z <= b.z1 + pad;
  }

  function samples(r, step) {
    var dx = r.x1 - r.x0, dz = r.z1 - r.z0;
    var L = Math.hypot(dx, dz);
    var n = Math.max(1, Math.ceil(L / (step || 4)));
    var out = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      out.push({ x: r.x0 + dx * t, z: r.z0 + dz * t });
    }
    return out;
  }

  function lockedKind(kind) {
    return kind === 'highway' || kind === 'bridge' || kind === 'tunnel' || kind === 'track';
  }

  /* M2: new streets are allowed. Highway, bridge, tunnel, track, and both spawns stay put. */
  function guardM2(base, next) {
    var errors = [];
    if (!next || next.v !== 1) errors.push('The layout is not version 1.');
    (base.spawns || []).forEach(function (s) {
      var n = (next.spawns || []).find(function (q) { return q.id === s.id; });
      if (!n || n.x !== s.x || n.z !== s.z) errors.push('Spawn ' + s.id + ' is locked.');
    });
    (base.roads || []).forEach(function (r) {
      if (!r.locked) return;
      var n = (next.roads || []).find(function (q) { return q.id === r.id; });
      if (!n || n.x0 !== r.x0 || n.z0 !== r.z0 || n.x1 !== r.x1 || n.z1 !== r.z1 || n.kind !== r.kind) {
        errors.push('Locked road ' + r.id + ' cannot change.');
      }
    });
    var hw = base.highwayX;
    (next.roads || []).forEach(function (r) {
      var known = (base.roads || []).some(function (b) { return b.id === r.id; });
      if (known) return;
      if (r.kind !== 'street') errors.push('A new road has to be a street.');
      if (hw != null && Math.abs(r.x0 - hw) < 2 && Math.abs(r.x1 - hw) < 2) errors.push('The highway is locked.');
      samples(r, 4).forEach(function (p) {
        (next.buildings || []).forEach(function (b) {
          if (inside(b, p.x, p.z, 0)) errors.push('That street runs through ' + (b.name || b.id) + '.');
        });
      });
    });
    (next.buildings || []).forEach(function (b) {
      (base.spawns || []).forEach(function (s) {
        if (inside(b, s.x, s.z, 3)) errors.push((b.name || b.id) + ' covers the ' + s.id + ' spawn.');
      });
    });
    var seen = {};
    errors.forEach(function (e) { seen[e] = 1; });
    return Object.keys(seen);
  }

  root.PLANNER_TOOLS = {
    FT: FT,
    snap: snap,
    itemSnap: itemSnap,
    rotate: rotate,
    moveHosts: moveHosts,
    copySpot: copySpot,
    createHistory: createHistory,
    measure: measure,
    alignFace: alignFace,
    alignEdges: alignEdges,
    groupMove: groupMove,
    roof: roof,
    cornersOf: cornersOf,
    withAabb: withAabb,
    inside: inside,
    samples: samples,
    lockedKind: lockedKind,
    guardM2: guardM2,
    distPointSeg: distPointSeg
  };
})(typeof window !== 'undefined' ? window : global);

/* Ellie pack B lives on the same PLANNER_TOOLS object.
   Quarter turns use rotate. Copies use copySpot. Moves use moveHosts.
   Undo uses createHistory. Slot choice uses roomSnap, which reads ROOM_PLACE.
   Road, structure, NOS, and spawn stay off for role ellie.
   The only save this session writes is zdash.ellie.builder.v1. */

const ELLIE_SAVE = 'zdash.ellie.builder.v1';
const ELLIE_LOCKED = ['zdash.house.v1', 'zdash.kid.v1', 'zdash.sampler.likes.v1'];
const ELLIE_PACK_B = ['select', 'move', 'turn', 'copy', 'size', 'floor', 'walk', 'swatch', 'undo', 'redo', 'delete', 'done', 'place', 'clear'];
const ELLIE_OFF = {
  road: 1, building: 1, nos: 1, spawn: 1, scale: 1, align: 1, array: 1,
  measure: 1, layer: 1, walldraw: 1, same: 1, group: 1, rotate15: 1
};

const ELLIE_SIZES = {
  tv85: { w: 1.90, d: 0.33, h: 1.08, label: '1.9 m wide', kind: 'wall', glow: '#3ee6ff', name: 'TV' },
  ledposter: { w: 0.64, d: 0.47, h: 2.03, label: '0.6 m wide', kind: 'wall', glow: '#ff4fd8', name: 'Poster' },
  speaker: { w: 0.38, d: 0.38, h: 1.83, label: '1.8 m tall', kind: 'floor', glow: '#ffb020', name: 'Speaker' },
  kiosk: { w: 0.46, d: 0.46, h: 1.22, label: '1.2 m tall', kind: 'floor', glow: '#3ee6ff', name: 'Kiosk' }
};

const ELLIE_SWATCHES = [
  { id: 'cyan', hex: '#3ee6ff', label: 'Cyan' },
  { id: 'magenta', hex: '#ff4fd8', label: 'Magenta' },
  { id: 'amber', hex: '#ffb020', label: 'Amber' },
  { id: 'white', hex: '#ffffff', label: 'White' }
];

const ELLIE_PALETTE = ['tv85', 'ledposter', 'speaker', 'kiosk'];

function ellieSlot(id) {
  if (typeof ROOM_PLACE === 'undefined' || !ROOM_PLACE) return null;
  const room = ROOM_PLACE.describe('house');
  if (!room) return null;
  const all = room.floor.concat(room.wall);
  for (let i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}

function elliePut(prop, id, params, yaw) {
  const s = ellieSlot(id);
  const spec = ELLIE_SIZES[prop];
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

function ellieR1House() {
  return [
    elliePut('tv85', 'wall-far-left', { glow: '#3ee6ff' }),
    elliePut('ledposter', 'wall-far-right', { glow: '#ff4fd8' }),
    elliePut('speaker', 'floor-left', { w: 0.38, h: 1.83, d: 0.38, glow: '#ffb020' }),
    elliePut('kiosk', 'floor-right', { glow: '#3ee6ff' })
  ];
}

function ellieKind(id) {
  return ELLIE_SIZES[id] ? ELLIE_SIZES[id].kind : '';
}

function ellieCreate(opts) {
  opts = opts || {};
  const role = opts.role || 'ellie';
  const roomId = opts.roomId || 'house';
  const saveKey = opts.saveKey || ELLIE_SAVE;
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
  let history = PLANNER_TOOLS.createHistory(100);

  function allowed(name) {
    if (ELLIE_OFF[name]) return false;
    return ELLIE_PACK_B.indexOf(name) >= 0;
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
    if (saveKey !== ELLIE_SAVE) return { ok: false, reason: 'locked' };
    const kept = {};
    for (let i = 0; i < ELLIE_LOCKED.length; i++) kept[ELLIE_LOCKED[i]] = localStorage.getItem(ELLIE_LOCKED[i]);
    localStorage.setItem(ELLIE_SAVE, JSON.stringify(raw));
    for (let i = 0; i < ELLIE_LOCKED.length; i++) {
      const key = ELLIE_LOCKED[i];
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
    if (roomId === 'house') return ellieR1House();
    return [];
  }

  function remember() {
    history.push({ props: props, sel: state.sel });
  }

  function applyDoc(doc) {
    if (!doc) return { ok: false, reason: 'empty' };
    props.length = 0;
    for (let i = 0; i < doc.props.length; i++) props.push(doc.props[i]);
    state.sel = doc.sel;
    if (state.sel != null && (state.sel < 0 || state.sel >= props.length)) state.sel = props.length ? props.length - 1 : null;
    return { ok: true };
  }

  function reload() {
    const next = loadList();
    props.length = 0;
    for (let i = 0; i < next.length; i++) props.push(next[i]);
    state.sel = props.length ? 0 : null;
    history = PLANNER_TOOLS.createHistory(100);
    remember();
    return props;
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
    const spec = ELLIE_SIZES[id];
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
    if (!ELLIE_SIZES[id]) return off();
    if (props.length >= 48) return { ok: false, reason: 'full', text: 'This room is full.' };
    const slot = firstFree(ellieKind(id));
    if (!slot) return { ok: false, reason: 'noslot' };
    remember();
    props.push(adopt(id, slot));
    state.sel = props.length - 1;
    remember();
    return { ok: true, slot: slot.id };
  }

  function copy() {
    if (!allowed('copy')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    if (props.length >= 48) return { ok: false, reason: 'full', text: 'This room is full.' };
    const src = props[state.sel];
    const slot = firstFree(ellieKind(src.prop));
    if (!slot) return { ok: false, reason: 'noslot' };
    const spec = ELLIE_SIZES[src.prop];
    const ghost = PLANNER_TOOLS.copySpot({
      id: src.slot,
      x: src.x,
      z: src.z,
      x0: src.x - spec.w / 2,
      x1: src.x + spec.w / 2,
      z0: src.z,
      z1: src.z
    });
    const glow = src.params && src.params.glow;
    const item = adopt(src.prop, slot, glow);
    if (!item.wall) item.yaw = src.yaw;
    if (!ghost || ghost.x == null) return { ok: false, reason: 'copy' };
    remember();
    props.push(item);
    state.sel = props.length - 1;
    remember();
    return { ok: true, slot: slot.id };
  }

  function move(hit) {
    if (!allowed('move')) return off();
    if (state.sel == null || !props[state.sel] || !hit) return { ok: false, reason: 'none' };
    const prop = props[state.sel];
    const kind = ellieKind(prop.prop);
    if (hit.kind && hit.kind !== kind) return { ok: true, snapped: false };
    const slot = PLANNER_TOOLS.roomSnap(roomId, {
      x: hit.x, y: hit.y || 0, z: hit.z, kind: kind
    }, taken(state.sel));
    if (!slot || slot.id === prop.slot) return { ok: true, snapped: !!slot, slot: prop.slot };
    remember();
    const host = { id: prop.slot || 'piece' };
    const shifted = PLANNER_TOOLS.moveHosts(host, slot.x - prop.x, slot.z - prop.z, [{
      id: host.id,
      x: prop.x,
      z: prop.z,
      x0: prop.x,
      x1: prop.x,
      z0: prop.z,
      z1: prop.z
    }]);
    prop.x = shifted[0].x;
    prop.y = slot.y;
    prop.z = shifted[0].z;
    prop.slot = slot.id;
    prop.wall = slot.wall || null;
    if (prop.wall) prop.yaw = slot.yaw;
    remember();
    return { ok: true, snapped: true, slot: slot.id };
  }

  function turn() {
    if (!allowed('turn')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    const prop = props[state.sel];
    if (prop.wall) return { ok: true, yaw: prop.yaw };
    remember();
    const deg = PLANNER_TOOLS.rotate((prop.yaw * 180) / Math.PI);
    prop.yaw = (deg * Math.PI) / 180;
    remember();
    return { ok: true, yaw: prop.yaw };
  }

  function setGlow(hex) {
    if (!allowed('swatch')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    const prop = props[state.sel];
    remember();
    prop.params = Object.assign({}, prop.params, { glow: hex });
    remember();
    return { ok: true, glow: hex };
  }

  function remove() {
    if (!allowed('delete')) return off();
    if (state.sel == null || !props[state.sel]) return { ok: false, reason: 'none' };
    remember();
    props.splice(state.sel, 1);
    if (!props.length) state.sel = null;
    else if (state.sel >= props.length) state.sel = props.length - 1;
    remember();
    return { ok: true };
  }

  function sizeText() {
    if (state.sel == null || !props[state.sel]) return '';
    const spec = ELLIE_SIZES[props[state.sel].prop];
    return spec ? spec.label : '';
  }

  function startOver() {
    if (!allowed('clear')) return off();
    remember();
    props.length = 0;
    state.sel = null;
    writeSession();
    remember();
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
      PLANNER_TOOLS.live = session;
    },
    closeSession: function () {
      state.open = false;
      if (PLANNER_TOOLS.live === session) PLANNER_TOOLS.live = null;
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
    undo: function () { return allowed('undo') ? applyDoc(history.undo()) : off(); },
    redo: function () { return allowed('redo') ? applyDoc(history.redo()) : off(); },
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

PLANNER_TOOLS.roomSnap = function (id, hit, taken) {
  if (typeof ROOM_PLACE === 'undefined' || !ROOM_PLACE) return null;
  return ROOM_PLACE.snap(id, hit, taken);
};
PLANNER_TOOLS.live = null;
PLANNER_TOOLS.saveKey = ELLIE_SAVE;
PLANNER_TOOLS.packB = ELLIE_PACK_B;
PLANNER_TOOLS.sizes = ELLIE_SIZES;
PLANNER_TOOLS.swatches = ELLIE_SWATCHES;
PLANNER_TOOLS.palette = ELLIE_PALETTE;
PLANNER_TOOLS.r1House = ellieR1House;
PLANNER_TOOLS.kind = ellieKind;
PLANNER_TOOLS.create = ellieCreate;
