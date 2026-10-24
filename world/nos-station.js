'use strict';
// Drive-up NOS station. One prefab, two sizes.
// The layout is in the building's own box and door face. It does not
// read a world coordinate, so a later city map can move the shop.
// Depot: the tall pad building. Station: the small shop every city can have.
// Flat boxes only. Glow is a brighter stroke, not a blur.
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.NOS_STATION = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const REACH = 3.6;
  const CLEAR = 3.4;
  const THICK = 0.42;

  function metrics(span, depth, height) {
    const depot = height >= 20 || depth >= 80;
    const want = depot ? 16 : 12;
    const apron = Math.min(want, Math.max(8, depth * (depot ? 0.2 : 0.5)), Math.max(6, depth - 4));
    const lane = Math.min(4, Math.max(3.2, span * 0.12));
    let islandW = Math.min(1.25, Math.max(0.9, (span - lane - 2.2) / 4));
    let canopyW = lane + islandW * 2 + 3.2;
    if (canopyW > span - 1.0) {
      canopyW = Math.max(6.2, span - 1.0);
      islandW = Math.max(0.8, (canopyW - lane - 2.0) / 2);
    }
    const canopyD = Math.min(8.2, Math.max(4.2, apron - 1.2));
    const islandL = Math.min(4.6, Math.max(2.8, canopyD - 1.6));
    return { depot: depot, apron: apron, lane: lane, islandW: islandW, islandL: islandL, canopyW: canopyW, canopyD: canopyD, y0: CLEAR, thick: THICK, reach: REACH };
  }

  function frameOf(box, face) {
    const nx = face.nx || 0, nz = face.nz || 0;
    const tx = -nz, tz = nx;
    let fx, fz, ix, iz;
    if (nz < 0) { fx = (box.x0 + box.x1) / 2; fz = box.z0; ix = 0; iz = 1; }
    else if (nz > 0) { fx = (box.x0 + box.x1) / 2; fz = box.z1; ix = 0; iz = -1; }
    else if (nx < 0) { fx = box.x0; fz = (box.z0 + box.z1) / 2; ix = 1; iz = 0; }
    else { fx = box.x1; fz = (box.z0 + box.z1) / 2; ix = -1; iz = 0; }
    return { fx: fx, fz: fz, tx: tx, tz: tz, ix: ix, iz: iz, nx: nx, nz: nz };
  }

  function at(fr, along, inward) {
    return { x: fr.fx + fr.tx * along + fr.ix * inward, z: fr.fz + fr.tz * along + fr.iz * inward };
  }

  function aabb(fr, a0, a1, n0, n1, y0, y1, part) {
    const p = [at(fr, a0, n0), at(fr, a1, n0), at(fr, a0, n1), at(fr, a1, n1)];
    let x0 = p[0].x, x1 = p[0].x, z0 = p[0].z, z1 = p[0].z;
    for (let i = 1; i < p.length; i++) {
      if (p[i].x < x0) x0 = p[i].x;
      if (p[i].x > x1) x1 = p[i].x;
      if (p[i].z < z0) z0 = p[i].z;
      if (p[i].z > z1) z1 = p[i].z;
    }
    return { x0: x0, x1: x1, z0: z0, z1: z1, y0: y0, y1: y1, nosPart: part };
  }

  function layout(box, face, height) {
    const span = Math.abs(face.nz || 0) > Math.abs(face.nx || 0) ? (box.x1 - box.x0) : (box.z1 - box.z0);
    const depth = Math.abs(face.nz || 0) > Math.abs(face.nx || 0) ? (box.z1 - box.z0) : (box.x1 - box.x0);
    const m = metrics(span, depth, height);
    const fr = frameOf(box, face);
    const mass = {
      x0: box.x0, x1: box.x1, z0: box.z0, z1: box.z1, y0: 0, y1: height, nosPart: 'mass'
    };
    if (fr.iz > 0) mass.z0 = box.z0 + m.apron;
    else if (fr.iz < 0) mass.z1 = box.z1 - m.apron;
    else if (fr.ix > 0) mass.x0 = box.x0 + m.apron;
    else mass.x1 = box.x1 - m.apron;
    const half = m.canopyW / 2;
    const nCan = 0.55;
    const parts = [];
    parts.push(aabb(fr, -half, half, nCan, nCan + m.canopyD, m.y0, m.y0 + m.thick, 'canopy'));
    parts.push(aabb(fr, -half, half, nCan - 0.08, nCan + 0.34, m.y0 - 0.22, m.y0 + m.thick, 'glow'));
    const post = 0.42;
    const inset = 0.36;
    const corners = [[-half + inset, nCan + inset], [half - inset, nCan + inset], [-half + inset, nCan + m.canopyD - inset], [half - inset, nCan + m.canopyD - inset]];
    for (let i = 0; i < corners.length; i++) {
      const a = corners[i][0], n = corners[i][1];
      parts.push(aabb(fr, a - post / 2, a + post / 2, n - post / 2, n + post / 2, 0, m.y0, 'post'));
    }
    const aPump = m.lane / 2 + m.islandW / 2;
    const nPump = 1.15;
    const pumps = [];
    for (const s of [-1, 1]) {
      const island = aabb(fr, s * aPump - m.islandW / 2, s * aPump + m.islandW / 2, nPump, nPump + m.islandL, 0, 1.15, 'pump');
      parts.push(island);
      const c = at(fr, s * aPump, nPump + m.islandL / 2);
      pumps.push({ x: c.x, z: c.z, nx: fr.nx, nz: fr.nz });
    }
    const glassH = Math.min(5.2, Math.max(2.4, height - 1.2));
    parts.push(aabb(fr, -half * 0.82, half * 0.82, m.apron - 0.08, m.apron + 0.22, 1.05, glassH, 'glass'));
    const lane = aabb(fr, -m.lane / 2, m.lane / 2, nCan, nCan + m.canopyD, 0.02, 0.04, 'lane');
    return {
      kind: m.depot ? 'depot' : 'station',
      face: { nx: fr.nx, nz: fr.nz },
      origin: { fx: fr.fx, fz: fr.fz, tx: fr.tx, tz: fr.tz, ix: fr.ix, iz: fr.iz },
      apron: m.apron,
      reach: m.reach,
      mass: mass,
      parts: parts,
      pumps: pumps,
      lane: lane,
      span: span,
      depth: depth
    };
  }

  function inside(part, box) {
    return part.x0 >= box.x0 - 0.05 && part.x1 <= box.x1 + 0.05 && part.z0 >= box.z0 - 0.05 && part.z1 <= box.z1 + 0.05;
  }

  function fit(b, pushBox) {
    if (!b || b.purpose !== 'NOS' || b.nosStation || !b.boxes || !b.boxes[0]) return null;
    const src = b.boxes[0];
    const face = b.sign || { nx: 0, nz: -1 };
    const plan = layout({ x0: src.x0, x1: src.x1, z0: src.z0, z1: src.z1 }, { nx: face.nx || 0, nz: face.nz || 0 }, b.top || src.y1 || 12);
    src.x0 = plan.mass.x0; src.x1 = plan.mass.x1; src.z0 = plan.mass.z0; src.z1 = plan.mass.z1;
    src.y0 = 0; src.y1 = plan.mass.y1; src.nosPart = 'mass';
    b.roofBox = src;
    for (let i = 0; i < plan.parts.length; i++) {
      if (plan.parts[i].nosPart === 'lane') continue;
      pushBox(b, plan.parts[i]);
    }
    b.nosStation = { kind: plan.kind, pumps: plan.pumps, lane: plan.lane, reach: plan.reach, face: plan.face };
    if (b.sign) {
      const g = b.sign, nx = g.nx || 0, nz = g.nz || 0;
      const wall = nx < 0 ? src.x0 : nx > 0 ? src.x1 : nz < 0 ? src.z0 : src.z1;
      if (nx) g.x = wall + nx * 0.12;
      else g.z = wall + nz * 0.12;
    }
    const deco = b.deco || [];
    for (let i = 0; i < deco.length; i++) {
      if (deco[i][0] !== 'pad') continue;
      const p = deco[i][1];
      p.x0 = src.x0; p.x1 = src.x1; p.z0 = src.z0; p.z1 = src.z1;
      p.x = Math.min(src.x1 - 2, Math.max(src.x0 + 2, p.x));
      p.z = Math.min(src.z1 - 2, Math.max(src.z0 + 2, p.z));
      const span = Math.min(src.x1 - src.x0, src.z1 - src.z0);
      p.r = Math.min(p.r || span * 0.32, span * 0.32);
    }
    if (b.doors) {
      b.doors = b.doors.filter(function (d) {
        const x = d[0], z = d[1];
        const onX = Math.abs(x - src.x0) < 1.4 || Math.abs(x - src.x1) < 1.4;
        const onZ = Math.abs(z - src.z0) < 1.4 || Math.abs(z - src.z1) < 1.4;
        const inX = x >= src.x0 - 1.2 && x <= src.x1 + 1.2;
        const inZ = z >= src.z0 - 1.2 && z <= src.z1 + 1.2;
        return (onX && inZ) || (onZ && inX);
      });
    }
    return plan;
  }

  function nearest(x, z) {
    if (typeof CITY === 'undefined' || !CITY || !CITY.BL) return null;
    let best = null;
    for (let i = 0; i < CITY.BL.length; i++) {
      const b = CITY.BL[i], st = b && b.nosStation;
      if (!st) continue;
      const reach = st.reach || REACH;
      for (let k = 0; k < st.pumps.length; k++) {
        const p = st.pumps[k];
        const dist = Math.hypot(p.x - x, p.z - z);
        if (dist > reach) continue;
        if (!best || dist < best.dist) best = { b: b, p: p, dist: dist };
      }
    }
    return best;
  }

  function asDoor(hit) {
    if (!hit) return null;
    const b = hit.b, p = hit.p;
    let label = 'NOS & FUEL DEPOT', color = '#ffe14d';
    if (typeof walkMeta === 'function') {
      const meta = walkMeta(b);
      if (meta && meta.purposeLabel) label = meta.purposeLabel;
      if (meta && meta.color) color = meta.color;
    }
    return {
      x: p.x, z: p.z, nx: p.nx || 0, nz: p.nz || 0, dist: hit.dist, y: 0,
      standX: p.x, standZ: p.z, pump: 1, garage: false,
      purpose: 'NOS', purposeLabel: label, actionLabel: 'TAP: CLAIM NOS', color: color,
      buildingId: b.id, building: b, cx: b.cx, cz: b.cz, top: b.top || 0
    };
  }

  return { REACH: REACH, CLEAR: CLEAR, metrics: metrics, layout: layout, inside: inside, fit: fit, nearest: nearest, asDoor: asDoor };
});
