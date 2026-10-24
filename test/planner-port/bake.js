/* Bake a building design into the same flat boxes as world/nos-station.js (PR #76).
   Parts are axis-aligned: { x0, x1, z0, z1, y0, y1, part }.
   Coordinates are inside the footprint, not the city. face is which side the door is on.
   A pitched roof and a dome are stacks of those boxes, so the WebGL renderer can pushBox them.
   Glow is a brighter box. There is no blur. */
'use strict';

function box(part, x0, x1, y0, y1, z0, z1, color, glow) {
  if (x1 < x0) { const t = x0; x0 = x1; x1 = t; }
  if (z1 < z0) { const t = z0; z0 = z1; z1 = t; }
  if (y1 < y0) { const t = y0; y0 = y1; y1 = t; }
  return { part: part, x0: x0, x1: x1, y0: y0, y1: y1, z0: z0, z1: z1, color: color || '#f7f4ee', glow: !!glow };
}

function wallBoxes(w) {
  const x0 = Math.min(w.a[0], w.b[0]), x1 = Math.max(w.a[0], w.b[0]);
  const z0 = Math.min(w.a[1], w.b[1]), z1 = Math.max(w.a[1], w.b[1]);
  const alongX = (x1 - x0) >= (z1 - z0);
  const len = alongX ? (x1 - x0) : (z1 - z0);
  const y0 = w.y || 0;
  const h = w.h || 3.2;
  const t = w.t || 0.22;
  const col = w.color || '#f7f4ee';
  const spans = [];
  let cursor = 0;
  const openings = (w.openings || []).slice().sort((p, q) => p.at - q.at);
  openings.forEach((op) => {
    const ow = op.w || 1.2;
    const oh = op.h || (op.kind === 'door' ? 2.3 : 1.2);
    const sill = op.kind === 'door' ? 0 : (op.sill == null ? 0.95 : op.sill);
    const at = Math.max(ow / 2, Math.min(len - ow / 2, op.at));
    const left = at - ow / 2;
    if (left > cursor + 0.05) spans.push({ a: cursor, b: left, y: 0, h: h, part: 'wall' });
    if (sill > 0.05) spans.push({ a: left, b: at + ow / 2, y: 0, h: sill, part: 'sill' });
    const head = sill + oh;
    if (h - head > 0.05) spans.push({ a: left, b: at + ow / 2, y: head, h: h - head, part: 'header' });
    if (op.kind === 'window') spans.push({ a: left + 0.04, b: at + ow / 2 - 0.04, y: sill, h: oh, part: 'glass', color: '#b7e4f2' });
    if (op.kind === 'door') spans.push({ a: left, b: at + ow / 2, y: 0, h: 0.08, part: 'door' });
    cursor = at + ow / 2;
  });
  if (len - cursor > 0.05) spans.push({ a: cursor, b: len, y: 0, h: h, part: 'wall' });
  if (!spans.length) spans.push({ a: 0, b: len, y: 0, h: h, part: 'wall' });
  return spans.map((s) => {
    const a = s.a, b = s.b;
    if (alongX) {
      const zc = (z0 + z1) / 2;
      return box(s.part, x0 + a, x0 + b, y0 + s.y, y0 + s.y + s.h, zc - t / 2, zc + t / 2, s.color || col, false);
    }
    const xc = (x0 + x1) / 2;
    return box(s.part, xc - t / 2, xc + t / 2, y0 + s.y, y0 + s.y + s.h, z0 + a, z0 + b, s.color || col, false);
  });
}

function flatRoof(r) {
  const poly = r.poly;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  poly.forEach(([x, z]) => {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  });
  const over = r.overhang || 0;
  const t = r.t || 0.16;
  const y = r.y || 0;
  return [box('roof-flat', minX - over, maxX + over, y, y + t, minZ - over, maxZ + over, r.color || '#efe6d8', false)];
}

/* Stepped slabs. Each step is a pushBox the NOS prefab path already understands. */
function pitchedRoof(r) {
  const a = r.ridge[0], b = r.ridge[1];
  const x = (a[0] + b[0]) / 2;
  const z0 = Math.min(a[1], b[1]), z1 = Math.max(a[1], b[1]);
  const span = r.span || 4;
  const pitch = (r.pitch || 32) * Math.PI / 180;
  const rise = Math.tan(pitch) * (span / 2);
  const steps = 4;
  const out = [];
  const yBase = r.y || 0;
  for (let i = 0; i < steps; i++) {
    const u0 = i / steps, u1 = (i + 1) / steps;
    const half = (span / 2) * (1 - u0);
    const y0 = yBase + rise * u0;
    const y1 = yBase + rise * u1;
    out.push(box('roof-pitch', x - half, x + half, y0, y1 + 0.08, z0 - 0.3, z1 + 0.3, r.color || '#e4c99a', false));
  }
  return out;
}

function dome(r) {
  const rings = 4;
  const R = r.r || 2;
  const out = [];
  for (let i = 0; i < rings; i++) {
    const t0 = (i / rings) * Math.PI / 2;
    const t1 = ((i + 1) / rings) * Math.PI / 2;
    const y0 = (r.y || 0) + R * Math.sin(t0);
    const y1 = (r.y || 0) + R * Math.sin(t1);
    const rad = R * Math.cos((t0 + t1) / 2);
    out.push(box('roof-dome', r.c[0] - rad, r.c[0] + rad, y0, y1, r.c[1] - rad, r.c[1] + rad, r.color || '#f7f4ee', false));
  }
  return out;
}

function canopy(r) {
  const x0 = Math.min(r.a[0], r.b[0]), x1 = Math.max(r.a[0], r.b[0]);
  const z0 = Math.min(r.a[1], r.b[1]), z1 = Math.max(r.a[1], r.b[1]);
  const depth = r.depth || 1.6;
  const y = r.y || 2.6;
  const out = [box('canopy', x0, x1, y, y + 0.08, z0 - depth, z1, r.color || '#f7f4ee', false)];
  if (r.posts !== false) {
    out.push(box('post', x0 + 0.15, x0 + 0.28, 0, y, z0 - depth + 0.15, z0 - depth + 0.28, '#d5d8de', false));
    out.push(box('post', x1 - 0.28, x1 - 0.15, 0, y, z0 - depth + 0.15, z0 - depth + 0.28, '#d5d8de', false));
  }
  return out;
}

export function bakeBuilding(doc) {
  const parts = [];
  (doc.slabs || []).forEach((s) => {
    parts.push(box('slab', s.x - s.sx / 2, s.x + s.sx / 2, s.y - s.sy / 2, s.y + s.sy / 2, s.z - s.sz / 2, s.z + s.sz / 2, s.color, false));
  });
  (doc.walls || []).forEach((w) => wallBoxes(w).forEach((p) => parts.push(p)));
  (doc.roofs || []).forEach((r) => {
    const list = r.kind === 'pitched' ? pitchedRoof(r) : r.kind === 'dome' ? dome(r) : r.kind === 'canopy' ? canopy(r) : flatRoof(r);
    list.forEach((p) => parts.push(p));
  });
  (doc.trim || []).forEach((band) => {
    (doc.walls || []).forEach((w) => {
      if (band.floor && w.floor !== band.floor) return;
      const x0 = Math.min(w.a[0], w.b[0]), x1 = Math.max(w.a[0], w.b[0]);
      const z0 = Math.min(w.a[1], w.b[1]), z1 = Math.max(w.a[1], w.b[1]);
      const alongX = (x1 - x0) >= (z1 - z0);
      const y = band.y, h = band.h || 0.08;
      if (alongX) parts.push(box('trim', x0, x1, y, y + h, z0 - 0.04, z1 + 0.04, band.color || '#3ee6ff', true));
      else parts.push(box('trim', x0 - 0.04, x1 + 0.04, y, y + h, z0, z1, band.color || '#3ee6ff', true));
    });
  });
  return parts;
}

/* Same door-face frame as NOS_STATION.frameOf. Moves footprint parts onto a city box. */
export function frameOf(box, face) {
  const nx = face.nx || 0, nz = face.nz || 0;
  const tx = -nz, tz = nx;
  let fx, fz, ix, iz;
  if (nz < 0) { fx = (box.x0 + box.x1) / 2; fz = box.z0; ix = 0; iz = 1; }
  else if (nz > 0) { fx = (box.x0 + box.x1) / 2; fz = box.z1; ix = 0; iz = -1; }
  else if (nx < 0) { fx = box.x0; fz = (box.z0 + box.z1) / 2; ix = 1; iz = 0; }
  else { fx = box.x1; fz = (box.z0 + box.z1) / 2; ix = -1; iz = 0; }
  return { fx: fx, fz: fz, tx: tx, tz: tz, ix: ix, iz: iz, nx: nx, nz: nz };
}

function corner(fr, along, inward) {
  return { x: fr.fx + fr.tx * along + fr.ix * inward, z: fr.fz + fr.tz * along + fr.iz * inward };
}

/* doc parts use x as along-face and z as inward. The footprint is centered on the door. */
export function placeOnBox(parts, box, face) {
  const fr = frameOf(box, face || { nx: 0, nz: -1 });
  return parts.map((p) => {
    const c = [
      corner(fr, p.x0, p.z0), corner(fr, p.x1, p.z0),
      corner(fr, p.x0, p.z1), corner(fr, p.x1, p.z1)
    ];
    let x0 = c[0].x, x1 = c[0].x, z0 = c[0].z, z1 = c[0].z;
    for (let i = 1; i < c.length; i++) {
      if (c[i].x < x0) x0 = c[i].x;
      if (c[i].x > x1) x1 = c[i].x;
      if (c[i].z < z0) z0 = c[i].z;
      if (c[i].z > z1) z1 = c[i].z;
    }
    return { part: p.part, x0: x0, x1: x1, z0: z0, z1: z1, y0: p.y0, y1: p.y1, color: p.color, glow: p.glow };
  });
}

export function drawParts(parts) {
  return parts.map((p) => {
    const rgb = hex(p.color);
    return {
      x: (p.x0 + p.x1) / 2, y: (p.y0 + p.y1) / 2, z: (p.z0 + p.z1) / 2,
      sx: Math.max(0.02, p.x1 - p.x0), sy: Math.max(0.02, p.y1 - p.y0), sz: Math.max(0.02, p.z1 - p.z0),
      yaw: 0, pitch: 0, r: rgb[0], g: rgb[1], b: rgb[2], mode: p.video ? 2 : (p.glow ? 1 : 0)
    };
  });
}

function hex(c) {
  const s = String(c || '#888').replace('#', '');
  const n = parseInt(s.length === 3 ? s.replace(/./g, (ch) => ch + ch) : s, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
