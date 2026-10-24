// v3.9 pure helpers: furniture that follows a pushed wall, and one-tap event layouts. No DOM, no three.js.
import { WALL_T, floorOf, floorBounds, wallBounds, doorList, DOOR_W } from './walls.js';
import { def, dims, newItem, snapPose, applyPose, isValid, descendants, freePose, linkPosters } from './logic.js';
import { registeredPresets, presetById } from './register.js';
import.meta.glob('./presets/*.js', { eager: true });

// Items that ride along when wall segment i of run pi is pushed: anything mounted on that wall, or whose footprint
// comes within 0.5 ft of the wall face, plus everything sitting on or attached to them.
export const CARRY_FT = 0.5;
export function carrySet(walls, pi, i, items) { const p = walls[pi]; if (!p) return []; const n = p.pts.length, a = p.pts[i], b = p.pts[(i + 1) % n]; if (!a || !b) return [];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (!L) return []; const ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L, lim = WALL_T / 2 + CARRY_FT + 1e-6, out = new Set();
  for (const it of items) { if (it.host) continue; const { w, d } = dims(it), c = Math.cos(it.a), s = Math.sin(it.a); let near = false;
    for (const [lx, lz] of [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2], [0, 0]]) { const x = it.x + lx * c + lz * s, z = it.z - lx * s + lz * c, t = (x - a[0]) * ux + (z - a[1]) * uz;
      if (t < -CARRY_FT || t > L + CARRY_FT) continue; if (Math.abs(-(x - a[0]) * uz + (z - a[1]) * ux) <= lim) { near = true; break; } }
    if (near) { out.add(it); for (const ch of descendants(items, it)) out.add(ch); } }
  return [...out]; }

// The room to fill: the biggest closed room, else the open floor.
export function roomRect(walls) { const closed = walls.filter((p) => p.closed && p.pts.length >= 3); if (closed.length) { let best = null; for (const p of closed) { const b = wallBounds([p]); if (!best || b.w * b.l > best.w * best.l) best = b; } return best; }
  const b = wallBounds(walls) || floorBounds(floorOf(walls)); return b; }

export const EVENT_PRESETS = registeredPresets().map(({ id, name, note }) => ({ id, name, note }));

// Build a starter layout scaled to the room. Every piece is checked with the normal placement rules; pieces that don't fit are skipped.
// v3.15 preset gaps (ft), approved by Bob: chair back to next table, aisles, wall and door clearances
export const GAPS = { classRow: 3.25, classCentre: 4.5, classSide: 3.5, wall: 3, banquetChairBacks: 5, boothAisle: 10, regQueue: 9, regBehind: 5.1, door: 3 };
export const LAYOUT_MAX = 120; // v3.18: in huge venue halls, presets fill a centred 120 ft block instead of thousands of tables
const cropB = (b0) => { if (!b0) return b0; const b = { ...b0 }; for (const [lo, hi] of [['minX', 'maxX'], ['minZ', 'maxZ']]) { const c = (b[lo] + b[hi]) / 2; if (b[hi] - b[lo] > LAYOUT_MAX) { b[lo] = c - LAYOUT_MAX / 2; b[hi] = c + LAYOUT_MAX / 2; } } if ('w' in b) b.w = b.maxX - b.minX; if ('l' in b) b.l = b.maxZ - b.minZ; return b; };
// v3.30 tech levels: Showcase (default) = the full tech list, Standard = about half, Essentials = furniture + minimal tech.
// Each tech piece has a minimum level; pieces that don't pass the normal placement rules (GAPS, door and queue clearances, overlaps) are dropped.
export const TECH_LEVELS = [{ id: 'essentials', name: 'Essentials', note: 'Furniture + minimal tech' }, { id: 'standard', name: 'Standard', note: 'About half the tech' }, { id: 'showcase', name: 'Showcase', note: 'Every screen, kiosk and charger' }];
export const TECH_DEFAULT = 'showcase';
export const techRank = (lvl) => Math.max(0, TECH_LEVELS.findIndex((l) => l.id === lvl)) || (lvl === 'essentials' ? 0 : 2);
export function eventLayout(kind, world, level = TECH_DEFAULT) { const hooked = presetById(kind); if (hooked && hooked.build) return hooked.build(world, level); const b = cropB(roomRect(world.walls)); if (!b) return []; const W = { env: world.env, walls: world.walls, items: [] }, m = WALL_T / 2 + 2;
  const x0 = b.minX + m, x1 = b.maxX - m, z0 = b.minZ + m, z1 = b.maxZ - m, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2; void x0; void x1; void z0; void z1; void cz;
  const R = techRank(level), at = (min) => R >= { e: 0, s: 1, x: 2 }[min]; // at('s'): placed at Standard and Showcase
  const put = (type, x, z, a = 0, snap = false) => { const it = newItem(type, x, z, a); W.items.push(it); applyPose(W, it, snap ? snapPose(W, it, x, z) : freePose(it, x, z, a)); if (snap && it.mode === 'free') it.a = a; if (!isValid(W, it)) { W.items.pop(); return null; } return it; };
  const exact = (type, x, z, a) => { const it = newItem(type, x, z, a); W.items.push(it); applyPose(W, it, { x, z, a, y: 0, host: null, mode: 'free' }); if (!isValid(W, it)) { W.items.pop(); return null; } return it; }; // no grid rounding (flush poster walls)
  const tech = (min, type, x, z, a = 0, snap = false) => (at(min) ? put(type, x, z, a, snap) : null);
  const onTop = (min, type, host, x, z) => { if (!at(min) || !host) return null; const it = put(type, x, z, host.a, true); if (it && it.host !== host.uid) { W.items.splice(W.items.indexOf(it), 1); return null; } return it; };
  const chairs = (t, pts) => { for (const [x, z] of pts) { const c = put('chair', x, z, 0, true); if (c && c.host !== t.uid) W.items.splice(W.items.indexOf(c), 1); } };
  // v3.15 realistic gaps (approved planning targets): see GAPS. Fewer items fit; that's expected.
  const face = WALL_T / 2, wx0 = b.minX + face, wx1 = b.maxX - face, wz0 = b.minZ + face, wz1 = b.maxZ - face, doors = doorList(world.walls);
  const nearDoor = (x, z, r) => doors.some((d) => Math.hypot(d.x - x, d.z - z) < r + DOOR_W / 2 + GAPS.door);
  const inX = (x, hw) => x - hw >= wx0 + GAPS.wall - 1e-6 && x + hw <= wx1 - GAPS.wall + 1e-6; // keeps the side-wall clearance
  // entrance spots: beside each door (outside its clearance), facing into the room; with no door yet, beside the back-wall centre where the auto door goes
  const entrance = (r) => { const out = [], off = DOOR_W / 2 + GAPS.door + r + 0.6, inn = r + 0.6, list = doors.length ? doors.slice(0, 4) : [{ x: (wx0 + wx1) / 2, z: wz1 }];
    for (const d of list) { const s = [[Math.abs(d.z - wz0), 0, 1], [Math.abs(d.z - wz1), 0, -1], [Math.abs(d.x - wx0), 1, 0], [Math.abs(d.x - wx1), -1, 0]].sort((p, q) => p[0] - q[0])[0], nx = s[1], nz = s[2];
      for (const o of [off, off + 2 * r + 0.4]) for (const sg of [-1, 1]) out.push([d.x + nx * inn + (nz ? sg * o : 0), d.z + nz * inn + (nx ? sg * o : 0), Math.atan2(nx, nz), nz ? sg : 0, nx ? sg : 0]); } return out; };
  // v3.30 LED poster wall: n posters joined flush side by side (exact catalog size), running from (x,z) along (ux,uz); all or nothing
  const posterWall = (n, x, z, a, ux, uz) => { const w = def({ type: 'ledposter' }).w, got = []; for (let k = 0; k < n; k++) { const px = (got[0] ? got[0].x : x) + ux * w * k, pz = (got[0] ? got[0].z : z) + uz * w * k; const it = nearDoor(px, pz, 1.1) ? null : k === 0 ? put('ledposter', px, pz, a) : exact('ledposter', px, pz, got[0].a); if (!it) { for (const g of got) W.items.splice(W.items.indexOf(g), 1); return null; } got.push(it); } for (let k = 1; k < n; k++) linkPosters(got[k - 1], got[k]); return got; };
  const atEntrance = (min, types) => { if (!at(min)) return 0; let n = 0; const sp = entrance(1.1); for (let i = 0; i < sp.length && n < types.length; i++) { const [x, z, a, ux, uz] = sp[i]; if (x < wx0 + 0.8 || x > wx1 - 0.8 || z < wz0 + 0.8 || z > wz1 - 0.8) continue; const m = /^wall(\d)$/.exec(types[n]); if (m ? posterWall(+m[1], x, z, a, ux, uz) || put('ledposter', x, z, a) : put(types[n], x, z, a)) n++; } return n; };
  const frontWall = (min, type, x) => (at(min) ? put(type, x, wz0 + 1, 0, true) : null); // LED wall / screen against the front (z0) wall, facing the room
  const sideTVs = (min, type, z) => { if (!at(min)) return; put(type, wx0 + 0.5, z, Math.PI / 2, true); put(type, wx1 - 0.5, z, -Math.PI / 2, true); };
  if (kind === 'banquet') { const back = 3.2 + 0.83, sp = Math.ceil((2 * back + GAPS.banquetChairBacks) * 2) / 2, m2 = back + GAPS.wall, fb = 4.5, nx = Math.max(1, Math.floor((wx1 - wx0 - 2 * m2) / sp) + 1), nz = Math.max(1, Math.floor((wz1 - wz0 - fb - 2 * m2) / sp) + 1), ox = (wx0 + wx1) / 2 - ((nx - 1) * sp) / 2, oz = (wz0 + fb + wz1) / 2 - ((nz - 1) * sp) / 2;
    if (wx1 - wx0 < 2 * m2 || wz1 - wz0 - fb < 2 * m2) return []; // fb: a front band for the stage tech (LED wall, podium)
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const x = ox + i * sp, z = oz + j * sp; if (nearDoor(x, z, back)) continue; const t = put('round60', x, z); if (t) chairs(t, [...Array(8)].map((_, k) => [t.x + 3.2 * Math.sin((k * Math.PI) / 4), t.z + 3.2 * Math.cos((k * Math.PI) / 4)])); }
    const led = frontWall('s', 'led', cx), pw = led ? 5.6 + 1.5 : 0, pod = at('s') ? put('podium', cx + pw, wz0 + 1.6) : null; onTop('s', 'laptop', pod, pod && pod.x, pod && pod.z);
    sideTVs('s', 'tv75', wz0 + (wz1 - wz0) * 0.35);
    for (const [x, z, min] of [[wx0 + 1, wz0 + 1, 's'], [wx1 - 1, wz0 + 1, 's'], [wx0 + 1, wz1 - 1, 'x'], [wx1 - 1, wz1 - 1, 'x']]) tech(min, 'speaker', x, z);
    atEntrance('s', at('x') ? ['wall3', 'ledposter', 'tower'] : ['ledposter']); }
  if (kind === 'classroom') { const tw = 6, td = 2.5, chairBack = 1.6 + 0.83, row = Math.ceil((td / 2 + chairBack + GAPS.classRow) * 2) / 2, colGap = GAPS.classCentre, side = GAPS.classSide;
    const cols = Math.max(1, Math.floor((wx1 - wx0 - 2 * side + colGap) / (tw + colGap))), span = cols * tw + (cols - 1) * colGap, ox = (wx0 + wx1) / 2 - span / 2 + tw / 2;
    const scr = at('x') ? frontWall('x', 'led', cx) : frontWall('s', 'screen', cx), pod = put('podium', scr ? Math.min(cx + 7.2, wx1 - 2) : (wx0 + wx1) / 2, wz0 + 1.5); onTop('e', 'laptop', pod, pod && pod.x, pod && pod.z);
    const fz = wz0 + 7.5, rows = Math.max(0, Math.floor((wz1 - GAPS.wall - chairBack - fz) / row) + 1); let k = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = ox + c * (tw + colGap), z = fz + r * row; if (nearDoor(x, z, 3.5)) continue; const t = put('table6', x, z); if (!t) continue; chairs(t, [[t.x - 1.6, t.z + 1.6], [t.x + 1.6, t.z + 1.6]]);
      if (at('x') || (at('s') && k % 2 === 0)) onTop('s', 'laptop', t, t.x - 1.6, t.z + 0.3); onTop('x', 'ipad', t, t.x + 1.6, t.z + 0.3); k++; }
    if (rows >= 3) sideTVs('x', 'tv75', fz + row * Math.floor(rows / 2));
    tech('s', 'speaker', wx0 + 1, wz0 + 1); tech('s', 'speaker', wx1 - 1, wz0 + 1);
    atEntrance('x', ['tower', 'wall2']); }
  if (kind === 'theater') { const seat = 1.5, pitch = 3, ca = GAPS.classCentre, fz = wz0 + 9, half = Math.floor((wx1 - wx0 - 2 * GAPS.wall - ca) / 2 / seat), a = Math.PI; // rows at 36 in, chairs face the stage (front wall)
    if (half < 2 || wz1 - GAPS.wall - fz < pitch) return [];
    const ent = at('s') ? entrance(1.1) : [], nearEnt = (x, z) => ent.some(([ex, ez]) => Math.abs(ex - x) < 2.6 && Math.abs(ez - z) < 2.6); // keep the entrance tech spots clear
    for (let z = fz; z + 0.83 <= wz1 - GAPS.wall + 1e-6; z += pitch) for (const sd of [-1, 1]) for (let i = 0; i < half; i++) { const x = cx + sd * (ca / 2 + seat / 2 + i * seat); if (nearDoor(x, z, 1.2) || nearEnt(x, z)) continue; put('chair', x, z, a); }
    const led = frontWall('s', 'led', cx), sw = 10 / 2 + 0.6; if (led && at('x')) { frontWall('x', 'screen', cx - 5.9 - sw); frontWall('x', 'screen', cx + 5.9 + sw); }
    const pod = put('podium', cx + (led ? -6.6 : 0), wz0 + (led ? 4.2 : 1.6)); onTop('e', 'laptop', pod, pod && pod.x, pod && pod.z);
    tech('s', 'speaker', wx0 + 1, wz0 + 1.5); tech('s', 'speaker', wx1 - 1, wz0 + 1.5); tech('x', 'speaker', wx0 + 1, (fz + wz1) / 2); tech('x', 'speaker', wx1 - 1, (fz + wz1) / 2);
    atEntrance('s', at('x') ? ['wall3', 'ledposter', 'kiosk', 'tower'] : ['ledposter']); }
  if (kind === 'registration') { const tz = wz0 + GAPS.regBehind + 2.43, n = Math.max(1, Math.min(4, Math.floor((wx1 - wx0 - 2 * GAPS.wall + 1) / 7))), ox = (wx0 + wx1) / 2 - ((n - 1) * 7) / 2; let nT = 0;
    // behind the desk first (against the front wall): LED wall at Showcase, a 75 in TV at Standard
    if (at('x')) frontWall('x', 'led', cx); else if (at('s')) put('tv75', cx, wz0 + 0.5, 0, true);
    for (let k = 0; k < n; k++) { const x = ox + k * 7; if (nearDoor(x, tz, 4)) continue; const t = put('table6', x, tz); if (!t) continue; nT++; chairs(t, [[t.x - 1.6, t.z - 1.6], [t.x + 1.6, t.z - 1.6]]);
      onTop('e', 'laptop', t, t.x - 1.9, t.z); onTop('s', 'laptop', t, t.x + 1.9, t.z); onTop('x', 'monitor', t, t.x, t.z - 0.4); }
    if (nT) for (const sg of [-1, 1]) { const x = sg < 0 ? ox - 3.5 - 1.5 : ox + (n - 1) * 7 + 3.5 + 1.5; if (inX(x, 1.05) && !nearDoor(x, tz, 1.1)) tech(sg < 0 ? 's' : 'x', 'ledposter', x, tz); }
    const kz = tz + 1.25 + GAPS.regQueue + 1.5; if (kz + 1 + GAPS.regQueue / 2 < wz1) for (const [dx, min] of [[-5, 's'], [5, 's'], [-10, 'x'], [10, 'x']]) { const x = (wx0 + wx1) / 2 + dx; if (inX(x, 0.75) && !nearDoor(x, kz, 0.75)) tech(min, 'kiosk', x, kz); }
    { const x = cx + (at('x') ? 7.6 : 3.6); if (inX(x, 0.67)) tech('x', 'tower', x, wz0 + 1.2); } }
  if (kind === 'booth') { const e = WALL_T / 2 + 5.5, bx0 = b.minX + e, bx1 = b.maxX - e, n = Math.max(1, Math.floor((bx1 - bx0) / 10.5) + 1), ox = (bx0 + bx1) / 2 - ((n - 1) * 10.5) / 2, rows = b.l >= 10 + 10 + GAPS.boothAisle ? [[b.minZ + e, 0], [b.maxZ - e, Math.PI]] : [[b.minZ + e, 0]]; let k = 0;
    for (const [z, a] of rows) for (let i = 0; i < n; i++) { const x = ox + i * 10.5; if (nearDoor(x, z, 7.1)) continue; const bt = put('booth10', x, z, a); if (!bt) continue; const t = put('table6', bt.x, bt.z, 0), fz = Math.cos(a), back = bt.z - fz * 4.4;
      if (at('x') || (at('s') && k % 2 === 0)) put('tv55', bt.x, back, a, true); onTop('s', t && at('x') && k % 2 ? 'ipad' : 'laptop', t, t && t.x - 1.5, t && t.z); if (at('x') && t && k % 2 === 0) onTop('x', 'ipad', t, t.x + 1.5, t.z);
      tech('x', 'ledposter', bt.x + 3.8, bt.z + fz * 3.8, a); k++; }
    if (rows.length > 1) { const az = (rows[0][0] + rows[1][0]) / 2; for (let j = 1, q = 0; j < n; j += 3, q++) tech(q % 2 ? 'x' : 's', 'tower', ox + (j - 0.5) * 10.5, az); } // charging towers on the aisle centre line, one every ~3 booths
    if (at('s')) { const sp = [...entrance(5.6), [wx0 + 1, (wz0 + wz1) / 2, Math.PI / 2], [wx1 - 1, (wz0 + wz1) / 2, -Math.PI / 2]]; for (const [x, z, ang] of sp) if (put('led', x, z, ang)) break; } } // LED wall at the entrance, else on a side wall facing the aisle
  return W.items; }
export const layoutSummary = (items) => { const c = {}; for (const it of items) c[def(it).name] = (c[def(it).name] || 0) + 1; return c; };

// v3.15: measure the real gaps in a preset layout (ft), for selftests and the report
export function presetGaps(kind, world, items) { const b = roomRect(world.walls), f = WALL_T / 2, L = { x0: b.minX + f, x1: b.maxX - f, z0: b.minZ + f, z1: b.maxZ - f }, of = (t) => items.filter((i) => i.type === t), g = {};
  const doors = doorList(world.walls), ext = (it) => { const { w, d } = dims(it), c = Math.abs(Math.cos(it.a)), s = Math.abs(Math.sin(it.a)), hw = (w * c + d * s) / 2, hd = (w * s + d * c) / 2; return { x0: it.x - hw, x1: it.x + hw, z0: it.z - hd, z1: it.z + hd }; };
  const floor = items.filter((i) => i.mode !== 'top' && i.mode !== 'wall');
  g.door = doors.length ? Math.min(...doors.map((d) => Math.min(...floor.map((it) => { const e = ext(it); return Math.hypot(Math.max(e.x0 - d.x, 0, d.x - e.x1), Math.max(e.z0 - d.z, 0, d.z - e.z1)); })))) - DOOR_W / 2 : null;
  if (kind === 'classroom') { const T = of('table6'), C = of('chair'), zs = [...new Set(T.map((t) => +t.z.toFixed(2)))].sort((a, b2) => a - b2), xs = [...new Set(T.map((t) => +t.x.toFixed(2)))].sort((a, b2) => a - b2);
    g.row = zs.length > 1 ? Math.min(...zs.slice(1).map((z, i) => (z - 1.25) - (zs[i] + 1.6 + 0.83))) : null; g.centre = xs.length > 1 ? Math.min(...xs.slice(1).map((x, i) => x - xs[i] - 6)) : null;
    g.side = Math.min(xs[0] - 3 - L.x0, L.x1 - xs[xs.length - 1] - 3); g.back = L.z1 - Math.max(...C.map((c) => c.z + 0.83)); g.seats = C.length; }
  if (kind === 'banquet') { const T = of('round60'); let m = Infinity; for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) m = Math.min(m, Math.hypot(T[i].x - T[j].x, T[i].z - T[j].z)); const back = 3.2 + 0.83;
    g.chairBacks = T.length > 1 ? m - 2 * back : null; g.tableEdges = T.length > 1 ? m - 5 : null; g.wall = Math.min(...T.map((t) => Math.min(t.x - L.x0, L.x1 - t.x, t.z - L.z0, L.z1 - t.z) - back)); g.seats = of('chair').length; }
  if (kind === 'booth') { const B = of('booth10'), zs = [...new Set(B.map((t) => +t.z.toFixed(2)))].sort((a, b2) => a - b2); g.aisle = zs.length > 1 ? zs[zs.length - 1] - zs[0] - 10 : null; g.booths = B.length; }
  if (kind === 'registration') { const T = of('table6'), front = Math.max(...T.map((t) => t.z + 1.25)), beyond = floor.filter((i) => !['table6', 'chair'].includes(i.type)).map((i) => ext(i).z0).filter((z) => z > front);
    g.queue = (beyond.length ? Math.min(...beyond) : L.z1) - front; g.behind = Math.min(...of('chair').map((c) => c.z - 0.83)) - L.z0; g.wall = Math.min(...floor.map((i) => { const e = ext(i); return Math.min(e.x0 - L.x0, L.x1 - e.x1); })); g.desks = T.length; }
  return g; }
