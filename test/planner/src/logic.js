// Pure placement + snapping logic (no DOM, no three.js) so the selftest can check it. 1 unit = 1 ft.
import { BY_ID } from './catalog.js';
import { floorOf, inFloor, wallFaces, wallRects } from './walls.js';
import { stageSnap, stageJoins, stageLinkFlush } from './products/stage.js';
import { gearSnap } from './products/lineup.js'; // v3.36 PR #12 end-to-end lines and outside generator
export { stageJoins, stageLinkFlush };
export const LINKED = ['ledposter', 'stage']; // v3.35: items that join into rigid linked runs (poster walls, stage decks)
export const SNAP_DIST = 2, EDGE_DIST = 2.5, TOP_MARGIN = 0.5;
let n = 1;
export const def = (it) => BY_ID[it.type];
export function newItem(type, x = 0, z = 0, a = 0) { return { uid: 'i' + Date.now().toString(36) + (n++).toString(36), type, x, z, a, y: 0, host: null, mode: 'free' }; }
export const isMounted = (it) => it.mode === 'wall';
export const dims = (it) => { const d = def(it); return { w: d.w, d: isMounted(it) ? d.wallD : d.d }; };
const c = Math.cos, s = Math.sin, clamp = (v, a, b) => (a > b ? (a + b) / 2 : Math.max(a, Math.min(b, v)));
export const toWorld = (cx, cz, a, lx, lz) => [cx + lx * c(a) + lz * s(a), cz - lx * s(a) + lz * c(a)];
export const toLocal = (cx, cz, a, wx, wz) => { const dx = wx - cx, dz = wz - cz; return [dx * c(a) - dz * s(a), dx * s(a) + dz * c(a)]; };
const rotN = (a, nx, nz) => [nx * c(a) + nz * s(a), -nx * s(a) + nz * c(a)];
export const faceAngle = (nx, nz) => Math.atan2(nx, nz);
const rc = (o) => (o.type ? { x: o.x, z: o.z, a: o.a, ...dims(o) } : o);
export function corners(o, shrink = 0) { const it = rc(o), { w, d } = it, hw = w / 2 - shrink, hd = d / 2 - shrink; return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([lx, lz]) => toWorld(it.x, it.z, it.a, lx, lz)); }
export function obbOverlap(A, B, eps = 0.02) {
  const ca = corners(A, eps), cb = corners(B, eps);
  for (const ang of [A.a, B.a]) for (const [ax, az] of [[c(ang), -s(ang)], [s(ang), c(ang)]]) {
    const pa = ca.map(([x, z]) => x * ax + z * az), pb = cb.map(([x, z]) => x * ax + z * az);
    if (Math.max(...pa) <= Math.min(...pb) || Math.max(...pb) <= Math.min(...pa)) return false;
  }
  return true;
}
export function onFloor(F, it) {
  const { w, d } = dims(it), hw = w / 2 - 0.01, hd = d / 2 - 0.01, nx = Math.max(1, Math.ceil(w / 0.5)), nz = Math.max(1, Math.ceil(d / 0.5));
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= nz; j++) { const [x, z] = toWorld(it.x, it.z, it.a, -hw + (2 * hw * i) / nx, -hd + (2 * hd * j) / nz); if (!inFloor(F, x, z)) return false; }
  return true;
}
// Walls that belong to items: booth back and side walls (inner faces) and both faces of pipe and drape.
export function itemWalls(items) {
  const out = [];
  for (const it of items) { const d = def(it); if (!d.booth && !d.wallHost) continue; const hw = d.w / 2, hd = d.d / 2;
    const seg = (lx1, lz1, lx2, lz2, nx, nz, src) => { const [x1, z1] = toWorld(it.x, it.z, it.a, lx1, lz1), [x2, z2] = toWorld(it.x, it.z, it.a, lx2, lz2), [wx, wz] = rotN(it.a, nx, nz); out.push({ x1, z1, x2, z2, nx: wx, nz: wz, src, host: it.uid }); };
    if (d.booth) { const t = 0.15; seg(-hw, -hd + t, hw, -hd + t, 0, 1, 'boothBack'); seg(-hw + 0.1, -hd, -hw + 0.1, hd, 1, 0, 'boothSide'); seg(hw - 0.1, hd, hw - 0.1, -hd, -1, 0, 'boothSide'); }
    else { seg(-hw, hd, hw, hd, 0, 1, 'drape'); seg(hw, -hd, -hw, -hd, 0, -1, 'drape'); } }
  return out;
}
function wallSnap(it, px, pz, segs, depth) {
  const d = def(it); let best = null;
  for (const g of segs) { const dx = g.x2 - g.x1, dz = g.z2 - g.z1, L = Math.hypot(dx, dz); if (L < d.w - 0.01) continue; const ux = dx / L, uz = dz / L;
    const t = clamp((px - g.x1) * ux + (pz - g.z1) * uz, d.w / 2, L - d.w / 2), qx = g.x1 + ux * t, qz = g.z1 + uz * t;
    if ((px - qx) * g.nx + (pz - qz) * g.nz < -0.75) continue; // wrong side of the wall
    const x = qx + g.nx * (depth / 2 + 0.02), z = qz + g.nz * (depth / 2 + 0.02), dist = Math.hypot(px - x, pz - z);
    if (dist < SNAP_DIST && (!best || dist < best.dist)) best = { x, z, a: faceAngle(g.nx, g.nz), dist, host: g.host, hl: { seg: g } }; }
  return best;
}
export const ancestors = (items, it) => { const out = []; let h = it.host; while (h) { const p = items.find((o) => o.uid === h); if (!p || out.includes(p)) break; out.push(p); h = p.host; } return out; };
export const descendants = (items, it) => { const out = [], q = [it.uid]; while (q.length) { const u = q.shift(); for (const o of items) if (o.host === u && !out.includes(o)) { out.push(o); q.push(o.uid); } } return out; };
const related = (items, a, b) => ancestors(items, a).includes(b) || ancestors(items, b).includes(a);
function topSnap(items, it, px, pz) {
  let best = null; const me = def(it), desc = descendants(items, it);
  for (const h of items) { const hd = def(h); if (h === it || !hd.top || desc.includes(h) || h.mode === 'top') continue;
    let [lx, lz] = toLocal(h.x, h.z, h.a, px, pz); const r = it.a - h.a, ex = Math.abs(c(r)) * me.w / 2 + Math.abs(s(r)) * me.d / 2, ez = Math.abs(s(r)) * me.w / 2 + Math.abs(c(r)) * me.d / 2;
    if (hd.round) { const R = hd.w / 2, m = Math.hypot(lx, lz); if (m > R + TOP_MARGIN) continue; const lim = R - Math.hypot(ex, ez); if (m > lim && m > 0) { lx *= lim / m; lz *= lim / m; } }
    else { if (Math.abs(lx) > hd.w / 2 + TOP_MARGIN || Math.abs(lz) > hd.d / 2 + TOP_MARGIN) continue; lx = clamp(lx, -hd.w / 2 + ex, hd.w / 2 - ex); lz = clamp(lz, -hd.d / 2 + ez, hd.d / 2 - ez); }
    const [x, z] = toWorld(h.x, h.z, h.a, lx, lz); if (!best || hd.top > best.y) best = { x, z, a: it.a, y: hd.top, host: h.uid, hl: { item: h.uid } }; }
  return best;
}
function edgeSnap(items, it, px, pz) {
  const me = def(it), tuck = me.edgeKind === 'stool' ? 0.25 : 0.3; let best = null;
  for (const h of items) { const hd = def(h); if (!hd.edgeFor || !hd.edgeFor.includes(me.edgeKind)) continue;
    const [lx, lz] = toLocal(h.x, h.z, h.a, px, pz); let p;
    if (hd.round) { let th = Math.atan2(lx, lz); th = Math.round(th / (Math.PI / 4)) * (Math.PI / 4); const R = hd.w / 2 + me.d / 2 - tuck; p = [R * s(th), R * c(th), th + Math.PI]; }
    else { const hw = hd.w / 2, hh = hd.d / 2, o = me.d / 2 - tuck, ds = [hh - lz, lz + hh, hw - lx, lx + hw].map(Math.abs), k = ds.indexOf(Math.min(...ds));
      p = k === 0 ? [clamp(lx, -hw + me.w / 2, hw - me.w / 2), hh + o, Math.PI] : k === 1 ? [clamp(lx, -hw + me.w / 2, hw - me.w / 2), -hh - o, 0] : k === 2 ? [hw + o, clamp(lz, -hh + me.w / 2, hh - me.w / 2), -Math.PI / 2] : [-hw - o, clamp(lz, -hh + me.w / 2, hh - me.w / 2), Math.PI / 2]; }
    const [x, z] = toWorld(h.x, h.z, h.a, p[0], p[1]), dist = Math.hypot(px - x, pz - z);
    if (dist < EDGE_DIST && (!best || dist < best.dist)) best = { x, z, a: h.a + p[2], dist, host: h.uid, hl: { item: h.uid } }; }
  return best;
}
// v3.30 LED poster walls: a dragged poster joins another flush, side by side (same angle, same depth line, 0 gap) only when its side edge
// is within POSTER_SNAP.gap ft of the other's side edge and the angles differ by at most POSTER_SNAP.ang. Sizes are never changed.
// Joined posters carry symmetric links (it.links = [uid]); the linked set moves as one group; Separate clears a poster's links.
export const POSTER_SNAP = { gap: 0.5, ang: Math.PI / 18, lz: 0.5 };
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
export function posterGroup(items, it) { if (!it || !LINKED.includes(it.type)) return it ? [it] : []; const by = new Map(items.filter((o) => o.type === it.type).map((o) => [o.uid, o])), out = [it], q = [it];
  while (q.length) { const u = q.shift(); for (const id of u.links || []) { const o = by.get(id); if (o && !out.includes(o)) { out.push(o); q.push(o); } } } return out; }
// v3.31: which sides of a poster touch a linked poster flush (local +x = right); drives the seamless-wall mesh
export function posterJoins(items, it) { const r = { joinL: false, joinR: false }; if (!it || it.type !== 'ledposter' || !(it.links || []).length) return r; const w = def(it).w;
  for (const id of it.links) { const o = items.find((q) => q.uid === id); if (!o || Math.abs(wrapA(o.a - it.a)) > 1e-3) continue; const [lx, lz] = toLocal(it.x, it.z, it.a, o.x, o.z); if (Math.abs(lz) < 0.05 && Math.abs(Math.abs(lx) - w) < 0.05) r[lx > 0 ? 'joinR' : 'joinL'] = true; } return r; }
export function linkPosters(a, b) { if (!a || !b || a === b) return; a.links = [...new Set([...(a.links || []), b.uid])]; b.links = [...new Set([...(b.links || []), a.uid])]; }
export function unlinkPoster(items, it) { if (!it) return 0; const n = (it.links || []).length; for (const o of items) if (o.links) { o.links = o.links.filter((u) => u !== it.uid); if (!o.links.length) delete o.links; } delete it.links; return n; }
export function sideSnap(items, it, px, pz, a = it.a) { if (it.type !== 'ledposter') return null; const me = def(it), grp = posterGroup(items, it); let best = null;
  for (const h of items) { if (h === it || h.type !== 'ledposter' || grp.includes(h) || Math.abs(wrapA(a - h.a)) > POSTER_SNAP.ang + 1e-9) continue;
    const hd = def(h), [lx, lz] = toLocal(h.x, h.z, h.a, px, pz), half = hd.w / 2 + me.w / 2, gap = Math.abs(lx) - half; if (Math.abs(gap) > POSTER_SNAP.gap + 1e-9 || Math.abs(lz) > POSTER_SNAP.lz) continue;
    const slot = (Math.sign(lx) || 1) * half; if (items.some((o) => o !== it && o !== h && o.type === 'ledposter' && !grp.includes(o) && (([ox, oz]) => Math.abs(ox - slot) < half - 0.05 && Math.abs(oz) < hd.d)(toLocal(h.x, h.z, h.a, o.x, o.z)))) continue; // that side is taken
    const [x, z] = toWorld(h.x, h.z, h.a, slot, 0), dist = Math.abs(gap); if (!best || dist < best.dist) best = { x, z, a: h.a, dist, join: h.uid, hl: { item: h.uid } }; }
  return best; }
export function freePose(it, px, pz, a = it.a, step = 0.5) { const d = def(it), ex = Math.abs(c(a)) * d.w / 2 + Math.abs(s(a)) * d.d / 2, ez = Math.abs(s(a)) * d.w / 2 + Math.abs(c(a)) * d.d / 2;
  return { x: Math.round((px - ex) / step) * step + ex, z: Math.round((pz - ez) / step) * step + ez, a, y: 0, host: null, mode: 'free', hl: null }; }
// Try the item's snapsTo rules in order; fall back to the floor grid (item corner on 0.5 ft steps).
export function snapPose(world, it, px, pz, step = 0.5) {
  const d = def(it), others = world.items.filter((o) => o !== it), desc = descendants(world.items, it), hosts = others.filter((o) => !desc.includes(o));
  const outdoor = world.env === 'outdoor'; // outdoors drawn walls are a fence / boundary: never mountable
  const room = () => (outdoor ? [] : wallFaces(world.walls)), iw = (f) => itemWalls(hosts).filter(f);
  if (it.type === 'ledposter') { const p = sideSnap(world.items, it, px, pz); if (p) return { ...p, y: 0, mode: 'free' }; } // v3.30 poster wall
  if (it.type === 'stage') { const p = stageSnap(world.items, it, px, pz); if (p) return { x: p.x, z: p.z, a: p.a, join: p.join, y: 0, host: null, mode: 'free' }; } // v3.35 stage decks snap flush on all 4 edges
  { const g = gearSnap(world, it, px, pz); if (g) return g; } // v3.36 PR #12
  for (const r of d.snapsTo) { let p = null;
    if (r === 'top') { p = topSnap(world.items, it, px, pz); if (p) return { ...p, mode: 'top' }; }
    if (r === 'edge') { p = edgeSnap(hosts, it, px, pz); if (p) return { ...p, y: 0, mode: 'edge' }; }
    if (r === 'wall') { p = wallSnap(it, px, pz, [...room(), ...iw(() => true)], d.wallD); if (p) return { ...p, y: d.mountY, mode: 'wall' }; }
    if (r === 'wallfloor') { p = wallSnap(it, px, pz, [...room(), ...iw((g) => g.src === 'boothBack')], d.d); if (p) return { ...p, y: 0, mode: 'wallfloor' }; }
    if (r === 'backwall') { p = wallSnap(it, px, pz, iw((g) => g.src === 'boothBack'), d.d); if (p) return { ...p, y: 0, mode: 'backwall' }; }
    if (r === 'nearwall' && !outdoor) { p = wallSnap(it, px, pz, room(), d.d); if (p) return { ...p, y: 0, mode: 'wallfloor' }; } }
  return freePose(it, px, pz, it.a, step);
}
// Move an item and carry everything attached to it (rigid transform of the whole subtree).
export function applyPose(world, it, p) {
  const desc = descendants(world.items, it), da = p.a - it.a;
  for (const ch of desc) { const [lx, lz] = toLocal(it.x, it.z, it.a, ch.x, ch.z), [x, z] = toWorld(p.x, p.z, p.a, lx, lz); ch.x = x; ch.z = z; ch.a += da; }
  Object.assign(it, { x: p.x, z: p.z, a: p.a, y: p.y || 0, host: p.host || null, mode: p.mode || 'free' });
}
export function isValid(world, it) {
  const items = world.items, d = def(it);
  if (it.mode === 'top') { const h = items.find((o) => o.uid === it.host); if (!h) return false; const hd = def(h);
    for (const [x, z] of corners(it, 0.01)) { const [lx, lz] = toLocal(h.x, h.z, h.a, x, z); if (hd.round ? Math.hypot(lx, lz) > hd.w / 2 + 0.01 : Math.abs(lx) > hd.w / 2 + 0.01 || Math.abs(lz) > hd.d / 2 + 0.01) return false; }
    return !items.some((o) => o !== it && o.mode === 'top' && o.host === it.host && obbOverlap(it, o)); }
  if (it.mode === 'wall') { if (it.host && !items.some((o) => o.uid === it.host)) return false; return !items.some((o) => o !== it && o.mode === 'wall' && obbOverlap(it, o) && Math.abs(o.y - it.y) < Math.max(d.panel, def(o).panel || 0)); }
  if (!onFloor(floorOf(world.walls), it)) return false;
  for (const r of wallRects(world.walls)) if (obbOverlap(it, r)) return false; // can't stand inside a wall
  for (const r of world.cols || []) if (obbOverlap(it, r)) return false; // v3.18 venue columns block placement
  for (const o of items) { if (o === it || o.mode === 'top' || o.mode === 'wall') continue; const od = def(o);
    if (!!d.booth !== !!od.booth) continue; // booths are zones: items can stand inside them
    if (related(items, it, o)) continue; if (obbOverlap(it, o)) return false; }
  return true;
}
export function removeItem(world, it) { if (LINKED.includes(it.type)) unlinkPoster(world.items, it); const gone = new Set([it, ...descendants(world.items, it)]); world.items = world.items.filter((o) => !gone.has(o)); return gone.size; }
// Find a valid spot near (px,pz): snapped pose first, then a spiral search outwards (1 ft steps, up to r ft).
export function findSpot(world, it, px, pz, r = 14) {
  for (let ring = 0; ring <= r; ring++) for (let i = -ring; i <= ring; i++) for (const [dx, dz] of ring ? [[i, -ring], [i, ring], [-ring, i], [ring, i]] : [[0, 0]]) {
    const p = snapPose(world, it, px + dx, pz + dz), save = { ...it }; Object.assign(it, { x: p.x, z: p.z, a: p.a, y: p.y, host: p.host, mode: p.mode }); const ok = isValid(world, it); Object.assign(it, save); if (ok) return p; }
  return null;
}
export const cleanItems = (arr) => (Array.isArray(arr) ? arr : []).filter((o) => o && BY_ID[o.type] && [o.x, o.z, o.a].every(Number.isFinite)).map((o) => ({ uid: String(o.uid), type: o.type, x: o.x, z: o.z, a: o.a, y: Number.isFinite(o.y) ? o.y : 0, host: o.host ? String(o.host) : null, ...(o.preset ? { preset: String(o.preset) } : {}), ...(o.type === 'ledposter' && Array.isArray(o.links) && o.links.length ? { links: o.links.map(String) } : {}), mode: ['free', 'top', 'edge', 'wall', 'wallfloor', 'backwall'].includes(o.mode) ? o.mode : 'free' }));
