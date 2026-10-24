// End-to-end lines (queue barricades, feeder cables, cable ramps) and outside-the-room
// placement (generator). Product files set place: 'end' or place: 'outside'.
//
// logic.js has no product snap hook, and this lane cannot edit it. mount() below
// wraps the live drag/drop path so the planner behaves correctly today.
// Preferred wiring, for when a shared-file edit is allowed (do not apply both —
// the tests.js line plus this file's selftest summary hook would count twice):
//
// logic.js, inside snapPose, after the ledposter sideSnap block:
//   import { gearSnap } from './products/lineup.js';
//   const g = gearSnap(world, it, px, pz);
//   if (g) return g;
//
// logic.js isValid: treat mode 'outside' like mode 'wall' (skip the inside-floor
//   test, still reject overlap). Until then the generator reuses mode 'wall'.
//
// logic.js cleanItems: no change required. Positions save as x, z, a. Group drag
//   for a barricade line needs a posterGroup-style hook later.
//
// tests.js, next to the other product-test calls:
//   import { runGearTests } from './products/gear.test.js';
//   for (const [n, ok, err] of runGearTests()) R.push([n + (err ? ' (' + err + ')' : ''), ok]);
//
// productdims.js FLAGGED, append (notes already flag these; dimsCheck ignores unknown ids):
//   'qbar', 'wtmeter', 'tent', 'generator', 'feeder', 'ramp', 'radio', 'ibooth'
//
// LICENSES.xlsx: one row for these code-drawn meshes (own work / CC0, three.js
//   primitives, no third-party models, no photos).
import { applyPose, def, isValid, toLocal, toWorld } from '../logic.js';
import { pointInPoly, wallFaces } from '../walls.js';

export const END_REACH = 0.75; // ft of gap still pulled flush
export const OUTSIDE_REACH = 6; // ft; inside-the-room cursor to the outside pose (default snap is 2)
const END_LATERAL = 0.6;
const END_ANG = Math.PI / 18;
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v, a, b) => (a > b ? (a + b) / 2 : Math.max(a, Math.min(b, v)));

function poseOf(it) {
  return { x: it.x, z: it.z, a: it.a, y: it.y || 0, host: it.host || null, mode: it.mode || 'free' };
}

// Same-type only, along local +x (the long side). Result angle matches the host.
export function endSnap(items, it, px, pz, a = it.a) {
  const me = def(it);
  if (!me || me.place !== 'end') return null;
  let best = null;
  for (const h of items) {
    if (h === it || h.type !== it.type) continue;
    const ang = Math.abs(wrapA((a ?? it.a) - h.a));
    if (ang > END_ANG && Math.abs(ang - Math.PI) > END_ANG) continue;
    const hd = def(h);
    const [lx, lz] = toLocal(h.x, h.z, h.a, px, pz);
    const half = hd.w / 2 + me.w / 2;
    const gap = Math.abs(lx) - half;
    if (gap > END_REACH || gap < -0.2 || Math.abs(lz) > END_LATERAL) continue;
    const slot = (Math.sign(lx) || 1) * half;
    const taken = items.some((o) => {
      if (o === it || o === h || o.type !== it.type) return false;
      const [ox, oz] = toLocal(h.x, h.z, h.a, o.x, o.z);
      return Math.abs(ox - slot) < 0.25 && Math.abs(oz) < END_LATERAL;
    });
    if (taken) continue;
    const [x, z] = toWorld(h.x, h.z, h.a, slot, 0);
    const dist = Math.hypot(px - x, pz - z);
    if (!best || dist < best.dist) best = { x, z, a: h.a, dist };
  }
  return best;
}

// Indoor only. Skip faces whose normal points into a closed room. Center sits
// just outside the wall face. Null outdoors, so a boundary stays a free pose.
export function outsidePose(world, it, px, pz) {
  if (!world || world.env === 'outdoor') return null;
  const d = def(it);
  if (!d || d.place !== 'outside') return null;
  const depth = d.d;
  let best = null;
  for (const g of wallFaces(world.walls || [])) {
    const mx = (g.x1 + g.x2) / 2 + g.nx * 0.4, mz = (g.z1 + g.z2) / 2 + g.nz * 0.4;
    const inward = (world.walls || []).some((w) => w.closed && w.pts && w.pts.length >= 3 && pointInPoly(mx, mz, w.pts));
    if (inward) continue;
    const dx = g.x2 - g.x1, dz = g.z2 - g.z1, L = Math.hypot(dx, dz);
    if (!(L > 0) || L < d.w - 0.01) continue;
    const ux = dx / L, uz = dz / L;
    const t = clamp((px - g.x1) * ux + (pz - g.z1) * uz, d.w / 2, L - d.w / 2);
    const qx = g.x1 + ux * t, qz = g.z1 + uz * t;
    const x = qx + g.nx * (depth / 2 + 0.02), z = qz + g.nz * (depth / 2 + 0.02);
    const dist = Math.hypot(px - x, pz - z);
    if (dist <= OUTSIDE_REACH && (!best || dist < best.dist)) best = { x, z, a: Math.atan2(g.nx, g.nz), dist };
  }
  return best;
}

function tryPose(world, it, p) {
  const save = poseOf(it);
  applyPose(world, it, p);
  if (isValid(world, it)) return true;
  applyPose(world, it, save);
  return false;
}

export function settleItem(world, it) {
  if (!world || !it) return false;
  const d = def(it);
  if (!d) return false;
  if (d.place === 'end') {
    const p = endSnap(world.items, it, it.x, it.z, it.a);
    if (!p) return false;
    return tryPose(world, it, { x: p.x, z: p.z, a: p.a, y: 0, host: null, mode: 'free' });
  }
  if (d.place === 'outside') {
    if (world.env === 'outdoor') {
      if (it.mode === 'wall') {
        const save = poseOf(it);
        it.mode = 'free'; it.y = 0; it.host = null;
        if (!isValid(world, it)) Object.assign(it, save);
      }
      return false;
    }
    const p = outsidePose(world, it, it.x, it.z);
    if (p) return tryPose(world, it, { x: p.x, z: p.z, a: p.a, y: 0, host: null, mode: 'wall' });
    return false;
  }
  return false;
}

// What the logic.js hook should return. Does not apply the pose.
export function gearSnap(world, it, px, pz) {
  const d = def(it);
  if (!d) return null;
  if (d.place === 'end') {
    const p = endSnap(world.items, it, px, pz, it.a);
    return p ? { x: p.x, z: p.z, a: p.a, y: 0, host: null, mode: 'free' } : null;
  }
  if (d.place === 'outside') {
    const p = outsidePose(world, it, px, pz);
    return p ? { x: p.x, z: p.z, a: p.a, y: 0, host: null, mode: 'wall' } : null;
  }
  return null;
}

function seat(ESP) {
  const world = ESP.W;
  if (!world || !world.items) return;
  const drag = ESP.drag && typeof ESP.selItem === 'function' ? ESP.selItem() : null;
  for (const it of world.items) {
    const place = def(it) && def(it).place;
    if (place === 'outside') settleItem(world, it);
    else if (place === 'end' && drag && drag.uid === it.uid) settleItem(world, it);
  }
}

export function mountGear(ESP) {
  if (!ESP || ESP.__gear70 || typeof ESP.syncItems !== 'function') return;
  ESP.__gear70 = 1;
  const origSync = ESP.syncItems;
  const origDrop = ESP.dropped;
  const wrappedSync = function syncItems() {
    if (!ESP.__gearSkip) { try { seat(ESP); } catch (err) { console.error(err); } }
    return origSync.apply(this, arguments);
  };
  ESP.syncItems = wrappedSync;
  if (typeof window !== 'undefined' && window.__esp && window.__esp.syncItems === origSync) window.__esp.syncItems = wrappedSync;
  if (typeof origDrop === 'function') {
    const wrappedDrop = function dropped(item, start) {
      if (item) { try { settleItem(ESP.W, item); } catch (err) { console.error(err); } }
      ESP.__gearSkip = true;
      try { return origDrop.call(this, item, start); }
      finally { ESP.__gearSkip = false; }
    };
    ESP.dropped = wrappedDrop;
  }
}

// v3.36: the snap now runs from logic.js snapPose (gearSnap), so drag, drop and Add item all use it.
// No syncItems/dropped wrapping, and the gear tests are wired in src/tests.js (selftest only).
