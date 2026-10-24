// Pure wall-drawing logic (no DOM, no three.js). 1 unit = 1 ft. Walls = list of polylines { pts: [[x,z],...], closed }.
export const WALL_T = 0.33, CLOSE_R = 1.5, MARGIN = 10, DEFAULT_AREA = 40;
export const PRESETS = [{ id: 'none', name: 'No walls', w: 0, l: 0 }, { id: '20x20', name: '20 × 20', w: 20, l: 20 }, { id: '30x40', name: '30 × 40', w: 30, l: 40 }, { id: '50x100', name: '50 × 100', w: 50, l: 100 }, { id: '100x150', name: '100 × 150', w: 100, l: 150 }];
export const DEFAULT_PRESET = { indoor: '30x40', outdoor: 'none' };
export const rectPoly = (w, l, x0 = 0, z0 = 0) => ({ pts: [[x0, z0], [x0 + w, z0], [x0 + w, z0 + l], [x0, z0 + l]], closed: true });
export const presetWalls = (id) => { const p = PRESETS.find((q) => q.id === id); return p && p.w ? [rectPoly(p.w, p.l)] : []; };
const fin = Number.isFinite;
export function segments(walls) { const out = []; walls.forEach((p, pi) => { const n = p.pts.length, m = p.closed ? n : n - 1; for (let i = 0; i < m; i++) { const a = p.pts[i], b = p.pts[(i + 1) % n]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 1e-6) out.push({ pi, i, a, b }); } }); return out; }
export function wallBounds(walls) { let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity; for (const p of walls) for (const [x, z] of p.pts) { a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, z); d = Math.max(d, z); } return a === Infinity ? null : { minX: a, maxX: b, minZ: c, maxZ: d, w: b - a, l: d - c }; }
export const polyArea = (pts) => Math.abs(pts.reduce((s, [x, z], i) => { const [x2, z2] = pts[(i + 1) % pts.length]; return s + x * z2 - x2 * z; }, 0)) / 2;
export function pointInPoly(x, z, pts) { let ins = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, zi] = pts[i], [xj, zj] = pts[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) ins = !ins; } return ins; }
// Floor: closed shapes fill; open walls get their bounding box plus a margin; no walls at all = a default open area.
export function floorOf(walls) {
  const closed = walls.filter((p) => p.closed && p.pts.length >= 3), open = walls.filter((p) => !p.closed && p.pts.length >= 1), rects = [];
  if (open.length) { const b = wallBounds(open); rects.push({ x0: b.minX - MARGIN, z0: b.minZ - MARGIN, x1: b.maxX + MARGIN, z1: b.maxZ + MARGIN }); }
  if (!closed.length && !open.length) rects.push({ x0: 0, z0: 0, x1: DEFAULT_AREA, z1: DEFAULT_AREA });
  return { polys: closed.map((p) => p.pts), rects };
}
export const inFloor = (F, x, z) => F.rects.some((r) => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) || F.polys.some((p) => pointInPoly(x, z, p));
export function floorBounds(F) { let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity; for (const r of F.rects) { a = Math.min(a, r.x0); b = Math.max(b, r.x1); c = Math.min(c, r.z0); d = Math.max(d, r.z1); } for (const p of F.polys) for (const [x, z] of p) { a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, z); d = Math.max(d, z); } return { minX: a, maxX: b, minZ: c, maxZ: d, w: b - a, l: d - c }; }
// Both faces of every wall, for wall-mount snapping. Normal points away from the wall face.
export function wallFaces(walls) { const out = []; for (const s of wallPieces(walls)) { const [ax, az] = s.a, [bx, bz] = s.b, L = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / L, uz = (bz - az) / L, nx = -uz, nz = ux;
  for (const k of [1, -1]) { const o = (k * WALL_T) / 2; out.push({ x1: ax + nx * o, z1: az + nz * o, x2: bx + nx * o, z2: bz + nz * o, nx: k * nx, nz: k * nz, src: 'room', host: null, seg: s }); } } return out; }
// Wall bodies as rectangles {x,z,a,w,d} for collision (same rotation convention as items: local x = along the wall).
export const wallRects = (walls) => wallPieces(walls).map((s) => { const [ax, az] = s.a, [bx, bz] = s.b, L = Math.hypot(bx - ax, bz - az); return { x: (ax + bx) / 2, z: (az + bz) / 2, a: Math.atan2(-(bz - az) / L, (bx - ax) / L), w: L, d: WALL_T, seg: s }; });
// Zoom-dependent snap steps (camera distance in ft).
export const snapStep = (dist) => (dist >= 600 ? 25 : dist >= 160 ? 10 : dist >= 80 ? 5 : dist >= 30 ? 1 : 0.5);
export const itemStep = () => 0.5; // items always snap like v3.2 (0.5 ft corner snap); only wall drawing coarsens with zoom
export function snapPoint(walls, active, x, z, step) {
  const p = active != null ? walls[active] : null;
  if (p && !p.closed && p.pts.length >= 3) { const [sx, sz] = p.pts[0]; if (Math.hypot(x - sx, z - sz) <= Math.max(CLOSE_R, step * 0.6)) return { x: sx, z: sz, close: true }; }
  const r = Math.max(CLOSE_R * 0.7, step * 0.4); for (const q of walls) for (const [px, pz] of q.pts) if (Math.hypot(x - px, z - pz) <= r) return { x: px, z: pz, close: false }; // join existing corners
  return { x: Math.round(x / step) * step, z: Math.round(z / step) * step, close: false };
}
// Returns the polyline index still being drawn (null when finished or closed).
export function addPoint(walls, active, pt) {
  if (active == null || !walls[active] || walls[active].closed) { walls.push({ pts: [[pt.x, pt.z]], closed: false }); return walls.length - 1; }
  const p = walls[active]; if (pt.close && p.pts.length >= 3) { p.closed = true; return null; }
  const [lx, lz] = p.pts[p.pts.length - 1]; if (Math.hypot(pt.x - lx, pt.z - lz) < 1e-6) return active; p.pts.push([pt.x, pt.z]); return active;
}
export function undoPoint(walls, active) { const i = active != null ? active : walls.length - 1; if (i < 0 || !walls[i]) return null; const p = walls[i];
  if (p.closed) { p.closed = false; fitDoors([p]); return i; } p.pts.pop(); fitDoors([p]); if (!p.pts.length) { walls.splice(i, 1); return null; } return i; }
export function deleteSegment(walls, pi, i) { const p = walls[pi]; if (!p) return;
  const D = (p.doors || []).filter((d) => d.i !== i);
  if (p.closed) { const n = p.pts.length; p.pts = [...p.pts.slice(i + 1), ...p.pts.slice(0, i + 1)]; p.closed = false; p.doors = D.map((d) => ({ i: (d.i - i - 1 + n) % n, t: d.t })); }
  else { const a = p.pts.slice(0, i + 1), b = p.pts.slice(i + 1); const pa = { pts: a, closed: false, doors: D.filter((d) => d.i < i) }, pb = { pts: b, closed: false, doors: D.filter((d) => d.i > i).map((d) => ({ ...d, i: d.i - i - 1 })) }; walls.splice(pi, 1, ...[pa, pb].filter((x) => x.pts.length >= 2)); }
  for (let k = walls.length - 1; k >= 0; k--) if (walls[k].pts.length < 2) walls.splice(k, 1); }
const f1 = (v) => +v.toFixed(1);
export function sizeLabel(walls) { const b = wallBounds(walls); if (!b) return 'No walls · open floor'; const area = walls.filter((p) => p.closed && p.pts.length >= 3).reduce((s, p) => s + polyArea(p.pts), 0);
  return `${f1(b.w)} x ${f1(b.l)} ft${area ? ` · ${Math.round(area)} sq ft` : ' · open walls'}`; }
export const fmtFt = (L) => (L >= 10 ? `${f1(L)} ft` : `${f1(L)} ft`);
export function cleanWalls(arr) { return (Array.isArray(arr) ? arr : []).map((p) => ({ pts: (Array.isArray(p && p.pts) ? p.pts : []).filter((q) => Array.isArray(q) && fin(q[0]) && fin(q[1])).map((q) => [q[0], q[1]]), closed: !!(p && p.closed), doors: (Array.isArray(p && p.doors) ? p.doors : []).filter((d) => d && Number.isInteger(d.i) && fin(d.t)).map((d) => ({ i: d.i, t: d.t, ...(d.k === 'dock' || d.k === 'svc' ? { k: d.k } : {}), ...(fin(d.w) && d.w > DOOR_W ? { w: Math.min(2000, +(+d.w).toFixed(2)) } : {}) })) })).filter((p) => p.pts.length >= 2 || (p.pts.length === 1 && !p.closed)).map((p) => (p.pts.length < 3 ? { ...p, closed: false } : p)); }
// v3.0–v3.2 saves had painted tiles: turn their bounding box into a closed rectangle of walls.
export function wallsFromTiles(tiles) { let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity; for (const k of tiles || []) { const m = /^(-?\d+),(-?\d+)$/.exec(k); if (!m) continue; const x = +m[1], z = +m[2]; a = Math.min(a, x); b = Math.max(b, x + 1); c = Math.min(c, z); d = Math.max(d, z + 1); } return a === Infinity ? [] : [rectPoly(b - a, d - c, a, c)]; }
// ---------- v3.4 square-friendly drawing ----------
const snapTo = (v, st) => Math.round(v / st) * st;
export const alignTol = (step) => Math.max(1.25, step * 0.6);
export const closeR = (step) => Math.max(3, step * 1.5); // generous close-snap radius
// Box tool: corner to corner -> exact closed rectangle (corners on the current zoom step)
export function boxRect(a, b, step) { const x0 = snapTo(Math.min(a[0], b[0]), step), x1 = snapTo(Math.max(a[0], b[0]), step), z0 = snapTo(Math.min(a[1], b[1]), step), z1 = snapTo(Math.max(a[1], b[1]), step);
  return x1 - x0 > 0 && z1 - z0 > 0 ? rectPoly(x1 - x0, z1 - z0, x0, z0) : null; }
function corners(walls) { const c = []; for (const p of walls) for (const q of p.pts) c.push(q); return c; }
// Point-to-point with a sticky axis lock (dead zone + hysteresis), alignment guides and a generous close.
export function drawPoint(walls, active, x, z, step, lock) {
  const p = active != null && walls[active] && !walls[active].closed ? walls[active] : null, tol = alignTol(step), cs = corners(walls);
  if (!p) { let gx = null, gz = null, sx = snapTo(x, step), sz = snapTo(z, step);
    for (const [cx, cz] of cs) { if (gx == null && Math.abs(x - cx) <= tol) { sx = cx; gx = [cx, cz]; } if (gz == null && Math.abs(z - cz) <= tol) { sz = cz; gz = [cx, cz]; } }
    const guides = []; if (gx) guides.push([gx, [sx, sz]]); if (gz) guides.push([gz, [sx, sz]]); return { x: sx, z: sz, close: false, guides, aligned: guides.length > 0 }; }
  const [fx, fz] = p.pts[0], [lx, lz] = p.pts[p.pts.length - 1];
  if (p.pts.length >= 3 && Math.hypot(x - fx, z - fz) <= closeR(step)) return { x: fx, z: fz, close: true, guides: [], aligned: true };
  const dx = x - lx, dz = z - lz, D = Math.max(1, step * 0.5), ax = Math.abs(dx), az = Math.abs(dz);
  if (!lock.axis) { if (Math.max(ax, az) < D) return { x: lx, z: lz, close: false, guides: [], aligned: false, idle: true }; lock.axis = ax >= az ? 'x' : 'z'; }
  else if (lock.axis === 'x' && az > ax * 1.8 + D) lock.axis = 'z'; else if (lock.axis === 'z' && ax > az * 1.8 + D) lock.axis = 'x';
  const along = lock.axis === 'x' ? x : z; let v = snapTo(along, step), g = null;
  let best = tol; for (const q of cs) { if (q === p.pts[p.pts.length - 1]) continue; const c = lock.axis === 'x' ? q[0] : q[1]; const d = Math.abs(along - c); if (d <= best) { best = d; v = c; g = q; } }
  const out = lock.axis === 'x' ? { x: v, z: lz } : { x: lx, z: v };
  return { ...out, close: false, axis: lock.axis, guides: g ? [[g, [out.x, out.z]]] : [], aligned: !!g };
}
const segX = (a, b, c, d) => { const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); const s = (p, q) => p[0] === q[0] && p[1] === q[1];
  if (s(a, c) || s(a, d) || s(b, c) || s(b, d)) return false; return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
const axisSeg = (a, b) => a[0] === b[0] || a[1] === b[1];
// How to close an open shape so it stays square. Returns { pts: full new point list, ghost: closing path } or null.
export function closePlan(p) {
  if (!p || p.closed || p.pts.length < 3) return null; const P = p.pts.map((q) => [...q]), n = P.length, F = P[0];
  // U shape (3 segments, first and last parallel): straighten the last wall so the 4th closes a perfect rectangle
  if (n === 4 && axisSeg(P[0], P[1]) && axisSeg(P[1], P[2]) && axisSeg(P[2], P[3])) { const vert0 = P[0][0] === P[1][0], vert2 = P[2][0] === P[3][0];
    if (vert0 === vert2) { const o = P[3]; P[3] = vert0 ? [P[2][0], F[1]] : [F[0], P[2][1]]; if ((P[3][0] !== o[0] || P[3][1] !== o[1]) && (P[3][0] !== P[2][0] || P[3][1] !== P[2][1])) return { pts: P, ghost: [P[2], P[3], F], u: true }; } }
  const L = P[n - 1]; if (L[0] === F[0] || L[1] === F[1]) return { pts: P, ghost: [L, F] };
  const segs = []; for (let i = 0; i < n - 1; i++) segs.push([P[i], P[i + 1]]);
  const ok = (C) => ![[L, C], [C, F]].some(([a, b]) => segs.some(([c, d]) => segX(a, b, c, d)));
  const C1 = [F[0], L[1]], C2 = [L[0], F[1]], C = ok(C1) || !ok(C2) ? C1 : C2;
  return { pts: [...P, C], ghost: [L, C, F] };
}
export function closeWalls(walls, active) { const p = walls[active]; const pl = closePlan(p); if (!pl) return active; p.pts = pl.pts; p.closed = true; fitDoors([p]); return null; }
export const isRect = (p) => p && p.closed && p.pts.length === 4 && p.pts.every((q, i) => axisSeg(q, p.pts[(i + 1) % 4]));
// Corner drag keeps a rectangular room rectangular (neighbours slide along the axes).
export function dragCorner(p, j, x, z) {
  if (!isRect(p)) { p.pts[j] = [x, z]; return; } const [ox, oz] = p.pts[j], Q = p.pts.map((q) => [...q]);
  for (const k of [(j + 3) % 4, (j + 1) % 4]) { if (Q[k][0] === ox) Q[k][0] = x; else if (Q[k][1] === oz) Q[k][1] = z; }
  Q[j] = [x, z]; const b = wallBounds([{ pts: Q }]); if (b.w > 0 && b.l > 0 && isRect({ closed: true, pts: Q })) p.pts = Q;
}

// ---------- v3.6 doors: 3 ft openings stored per wall segment as { i: segment index, t: centre distance from the segment start } ----------
export const DOOR_W = 3, CORNER_M = WALL_T / 2;
const segLen = (p, i) => { const n = p.pts.length, a = p.pts[i], b = p.pts[(i + 1) % n]; return a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 0; };
const segCount = (p) => (p.closed ? p.pts.length : p.pts.length - 1);
const doorsOn = (p, i) => (p.doors || []).filter((d) => d.i === i);
export const dw = (d) => (d && d.w > DOOR_W ? d.w : DOOR_W); // v3.22: resizable doors (width in ft, min 3)
const tRange = (L, w = DOOR_W) => [CORNER_M + w / 2, L - CORNER_M - w / 2];
// Place a door centred at t (snapped to 0.5 ft). Clamped off corners; an overlap slides to the nearer side and touches (merges). Returns { door } or { error }.
export function placeDoor(walls, pi, i, t, step = 0.5) {
  const p = walls[pi]; if (!p || i < 0 || i >= segCount(p)) return { error: 'Tap a wall to add a door' };
  const L = segLen(p, i), [lo, hi] = tRange(L); if (hi < lo - 1e-9) return { error: 'This wall is too short for a door' };
  const clampT = (v) => Math.min(hi, Math.max(lo, v)); let c = clampT(Math.round(t / step) * step); if (c !== Math.round(t / step) * step) c = clampT(c);
  const others = doorsOn(p, i), free = (v) => v >= lo - 1e-9 && v <= hi + 1e-9 && others.every((d) => Math.abs(d.t - v) >= (dw(d) + DOOR_W) / 2 - 1e-9);
  if (!free(c)) { const hit = others.filter((d) => Math.abs(d.t - c) < (dw(d) + DOOR_W) / 2 - 1e-9).sort((a, b) => Math.abs(a.t - c) - Math.abs(b.t - c))[0];
    const cands = [hit.t + (dw(hit) + DOOR_W) / 2, hit.t - (dw(hit) + DOOR_W) / 2].sort((a, b) => Math.abs(a - t) - Math.abs(b - t)); c = cands.find(free); if (c == null) return { error: 'No room for another door here' }; }
  const door = { i, t: +c.toFixed(4) }; (p.doors ||= []).push(door); return { door };
}
// Merged openings on one segment: touching doors join (3 + 3 = 6 ft). Returns [[t0, t1], ...] sorted.
export function openings(p, i) { const iv = doorsOn(p, i).map((d) => [d.t - dw(d) / 2, d.t + dw(d) / 2]).sort((a, b) => a[0] - b[0]), out = [];
  for (const v of iv) { const l = out[out.length - 1]; if (l && v[0] <= l[1] + 1e-6) l[1] = Math.max(l[1], v[1]); else out.push([...v]); } return out; }
// Solid wall pieces (segments with door openings cut out), same shape as segments(): { pi, i, a, b }
export function wallPieces(walls) { const out = []; for (const sg of segments(walls)) { const p = walls[sg.pi], op = openings(p, sg.i); if (!op.length) { out.push(sg); continue; }
  const L = Math.hypot(sg.b[0] - sg.a[0], sg.b[1] - sg.a[1]), ux = (sg.b[0] - sg.a[0]) / L, uz = (sg.b[1] - sg.a[1]) / L, at = (t) => [sg.a[0] + ux * t, sg.a[1] + uz * t]; let s0 = 0;
  for (const [t0, t1] of op) { if (t0 - s0 > 1e-6) out.push({ ...sg, a: at(s0), b: at(t0) }); s0 = t1; } if (L - s0 > 1e-6) out.push({ ...sg, a: at(s0), b: sg.b }); } return out; }
export function doorList(walls) { const out = []; walls.forEach((p, pi) => (p.doors || []).forEach((d, k) => { const n = p.pts.length, a = p.pts[d.i], b = p.pts[(d.i + 1) % n]; if (!a || !b) return; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (!L) return; const ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L;
  out.push({ pi, k, i: d.i, t: d.t, w: dw(d), dock: d.k === 'dock', svc: d.k === 'svc', x: a[0] + ux * d.t, z: a[1] + uz * d.t, ux, uz }); })); return out; }
export function doorAt(walls, x, z, tol = 1) { let best = null, bd = Infinity; for (const d of doorList(walls)) { const along = (x - d.x) * d.ux + (z - d.z) * d.uz, perp = Math.abs(-(x - d.x) * d.uz + (z - d.z) * d.ux);
  if (Math.abs(along) <= d.w / 2 && perp <= tol) { const dd = Math.abs(along) + perp; if (dd < bd) { bd = dd; best = d; } } } return best; }
export function removeDoor(walls, pi, k) { const p = walls[pi]; if (p && p.doors) p.doors.splice(k, 1); }
// Nearest wall segment to a point (for the Door tool): { pi, i, t, dist }
export function nearestSeg(walls, x, z) { let best = null; for (const sg of segments(walls)) { const [ax, az] = sg.a, [bx, bz] = sg.b, L = Math.hypot(bx - ax, bz - az), t = Math.max(0, Math.min(L, ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / L)), dist = Math.hypot(ax + ((bx - ax) * t) / L - x, az + ((bz - az) * t) / L - z);
  if (!best || dist < best.dist) best = { pi: sg.pi, i: sg.i, t, dist }; } return best; }
// After walls change: clamp doors back onto their segment, drop those that no longer fit or now overlap.
export function fitDoors(walls) { for (const p of walls) { if (!p.doors || !p.doors.length) continue; const keep = [], m = segCount(p);
  for (const d of p.doors.slice().sort((a, b) => a.i - b.i || a.t - b.t)) { if (d.i < 0 || d.i >= m) continue; const Ls = segLen(p, d.i), w = Math.min(dw(d), Math.max(DOOR_W, Ls - 2 * CORNER_M)), [lo, hi] = tRange(Ls, w); if (hi < lo - 1e-9) continue; const t = Math.min(hi, Math.max(lo, d.t));
    if (keep.some((o) => o.i === d.i && Math.abs(o.t - t) < (dw(o) + w) / 2 - 1e-9)) continue; const nd = { ...d, t }; if (w > DOOR_W) nd.w = w; else delete nd.w; keep.push(nd); } p.doors = keep; } }
// v3.22: resize a door by dragging one end. The other end stays put; width snaps to `step`, min 3 ft, max = wall length (minus corners), never over a neighbour.
export function resizeDoor(walls, pi, k, end, tEnd, step = 0.5) { const p = walls[pi], d = p && p.doors && p.doors[k]; if (!d) return null; const L = segLen(p, d.i), w0 = dw(d), a = d.t - w0 / 2, b = d.t + w0 / 2;
  const nb = doorsOn(p, d.i).filter((o) => o !== d), loLim = Math.max(CORNER_M, ...nb.filter((o) => o.t < d.t).map((o) => o.t + dw(o) / 2)), hiLim = Math.min(L - CORNER_M, ...nb.filter((o) => o.t > d.t).map((o) => o.t - dw(o) / 2));
  let e = Math.round(tEnd / step) * step; let na = a, nbE = b;
  if (end < 0) { na = Math.max(loLim, Math.min(e, b - DOOR_W)); } else { nbE = Math.min(hiLim, Math.max(e, a + DOOR_W)); }
  const w = +(nbE - na).toFixed(4); d.t = +((na + nbE) / 2).toFixed(4); if (w > DOOR_W + 1e-6) d.w = w; else delete d.w; return { w: dw(d), t: d.t, max: +(L - 2 * CORNER_M).toFixed(2) }; }
// Corner drag that carries doors: keep each door's distance from its segment start in proportion.
export function dragCornerDoors(p, j, x, z) { const before = (p.doors || []).map((d) => ({ d, L: segLen(p, d.i) })); dragCorner(p, j, x, z);
  for (const { d, L } of before) { const L2 = segLen(p, d.i); if (L > 0 && L2 > 0) d.t = Math.round(((d.t / L) * L2) * 2) / 2; } fitDoors([p]); }
export function reversePoly(p) { const m = segCount(p), L = (p.doors || []).map((d) => segLen(p, d.i)); p.pts.reverse(); if (p.closed) { const n = p.pts.length; p.doors = (p.doors || []).map((d, k) => ({ i: (2 * n - 2 - d.i) % n, t: L[k] - d.t })); } else p.doors = (p.doors || []).map((d, k) => ({ i: m - 1 - d.i, t: L[k] - d.t })); }

// ---------- v3.8 push or pull a whole wall ----------
// Slides segment i along its normal by `off` ft. Both ends move together, so neighbouring walls just get longer or shorter
// and a square room stays square. Doors on the pushed wall keep their place; doors on the next wall stay put in the world.
// Returns false (and changes nothing) if a neighbouring wall would shrink below 1 ft or flip over.
export function segNormal(p, i) { const n = p.pts.length, a = p.pts[i], b = p.pts[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / L, (b[0] - a[0]) / L]; }
export function pushWall(p, i, off) { const n = p.pts.length, m = segCount(p); if (i < 0 || i >= m || !off) return !off;
  const [nx, nz] = segNormal(p, i), ia = i, ib = (i + 1) % n, Q = p.pts.map((q) => [...q]), L0 = p.pts.map((_, k) => segLen(p, k));
  Q[ia] = [Q[ia][0] + nx * off, Q[ia][1] + nz * off]; Q[ib] = [Q[ib][0] + nx * off, Q[ib][1] + nz * off];
  const q = { ...p, pts: Q }; for (const k of [i - 1, i + 1]) { const kk = p.closed ? (k + m) % m : k; if (kk < 0 || kk >= m || kk === i) continue;
    const a0 = p.pts[kk], b0 = p.pts[(kk + 1) % n], a1 = Q[kk], b1 = Q[(kk + 1) % n], d0 = [b0[0] - a0[0], b0[1] - a0[1]], d1 = [b1[0] - a1[0], b1[1] - a1[1]];
    if (Math.hypot(...d1) < 1 - 1e-9 || d0[0] * d1[0] + d0[1] * d1[1] <= 0) return false; }
  p.pts = Q; const nxt = p.closed ? (i + 1) % m : i + 1; if (p.doors) for (const d of p.doors) if (d.i === nxt && nxt !== i) d.t += segLen(p, nxt) - L0[nxt];
  fitDoors([p]); return true; }
// Green or red edit outline: a room is OK when every wall is at least 1 ft and it doesn't cross itself or another run of walls.
const xing = (a, b, c, d) => { const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
export function editOk(walls, pi) { const p = walls[pi]; if (!p || p.pts.length < 2) return false; const m = segCount(p), n = p.pts.length, seg = (q, k) => [q.pts[k], q.pts[(k + 1) % q.pts.length]];
  for (let k = 0; k < m; k++) if (segLen(p, k) < 1 - 1e-9) return false;
  for (let k = 0; k < m; k++) { const [a, b] = seg(p, k); for (let j = k + 2; j < m; j++) { if (p.closed && k === 0 && j === m - 1) continue; const [c, d] = seg(p, j); if (xing(a, b, c, d)) return false; }
    for (let qi = 0; qi < walls.length; qi++) { if (qi === pi) continue; const q = walls[qi]; for (let j = 0; j < segCount(q); j++) { const [c, d] = seg(q, j); if (xing(a, b, c, d)) return false; } } }
  return n >= 2; }
