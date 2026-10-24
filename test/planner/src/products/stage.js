// Modular stage deck. Code-drawn geometry only (our own). No prices.
// Sizes: missing-products.xlsx "Stage / riser platform" (Wenger StageTek 4×8), then the maker sheets cited there.
// Deck 96 × 48 in is the published 4 × 8 ft rectangle. Deck height default is 24 in, unconfirmed, pending Bob.
import { registerProduct } from '../register.js'; // merge line calls this; this file does not
import { product } from './create.js';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const inch = (n) => n / 12;

// Published inches. Do not treat STAGE_VISUAL as a spec — those stand in only where the sheet is silent.
export const STAGE_DIM = {
  wIn: 96,
  dIn: 48,
  hIn: 24,
  deckIn: 0.75, // plywood thickness, Wenger StageTek TS
  frameHIn: 4, // extrusion height, same sheet (section width is not published)
  legDiaIn: 2.5,
  treadWIn: 36, // "3'-wide steps", Wenger education catalogs
  treadDIn: 11, // stairway TS
  stairRunIn: 22.75, // 2-step fixed 281A100, dimension B
  stairSteps: 2,
  stairModel: '281A100',
};

// Drawn so the picture reads, and flagged. None of these are a claimed size.
const VISUAL = {
  frameBandIn: STAGE_DIM.legDiaIn, // section width is not published; band uses the leg diameter
  treadThickIn: STAGE_DIM.deckIn,
  railIn: 1,
  riserIn: 0.25,
  skirtPleatFt: 0.035,
  skirtInsetFt: 0.05,
};

export const STAGE_SOURCES = {
  page: 'https://www.rentacomputer.com/rentals/audio-visual/staging',
  deck: 'https://www.wengercorp.com/Lit/Wenger_StageTek%20Staging%20System_TS.pdf',
  shop: 'https://shop.wengercorp.com/performance/stagetekr-staging.html',
  stairs: 'https://www.wengercorp.com/Lit/Wenger_Stairways_Fixed%20and%20Adjustable_TS.pdf',
  treadWidth: 'https://www.wengercorp.com/Lit/catalog/Education/2017/Wenger%20Education%20Catalog_Platforms1-18.pdf',
};

// Pending Bob, or not on the maker sheet. The mesh still has to be drawn; these are not confirmed sizes.
export const STAGE_UNCONFIRMED = [
  { key: 'hIn', valueIn: 24, why: 'Pending Bob. Wenger fixed deck heights are 8, 16, 24, 32 and 40 in. 24 in is the default drawn here, not a confirmed rental height. Top surface uses the same number.' },
  { key: 'stairModel', valueIn: '281A100', why: 'Pending Bob. 2-step fixed 281A100 is published for 16 or 24 in decks (run 22.75 in). 3-step fixed 281A101 (run 33 in) and 3-step adjustable 281A201 (run 38.75 in at 24 in) also fit a 24 in deck.' },
  { key: 'riserIn', valueIn: 12, why: 'Not published. Two treads split the 24 in deck height evenly, so each rise is 12 in. The top tread is level with the deck.' },
  { key: 'frameBandIn', valueIn: VISUAL.frameBandIn, why: 'Frame section width is not published (only the 4 in height). The drawn band uses the 2.5 in leg diameter and is not a frame spec.' },
  { key: 'centerRailIn', valueIn: 2.5, why: 'A center support rail is published on the 4×8 deck. Its cross-section is not. Drawn at the 2.5 in leg diameter.' },
  { key: 'treadThickIn', valueIn: VISUAL.treadThickIn, why: 'Tread thickness is not published. Drawn at the deck’s 3/4 in so the top of each tread sits on the rise.' },
  { key: 'railIn', valueIn: VISUAL.railIn, why: 'Handrail height and tube size are not published. Rails stay inside the 36 in tread width and no taller than the deck. The stair sheet also prints 40.5, 41 and 41.5 in overall widths without a label for which model each is.' },
  { key: 'skirt', valueIn: null, why: 'Hook-and-loop skirt recess is on the frame; drapery heights match the staging elevation. Fabric thickness is not published. Pleats stay inside the deck footprint. Skirt is optional and preselected on.' },
  { key: 'stairJointIn', valueIn: 0.75, why: '22.75 in run minus two 11 in treads. Not a named part. Drawn as a 3/4 in lip between the deck face and the upper tread so the published run is kept.' },
];

export const stageProduct = product(33, 'stage', 'decor', '4 × 8 stage deck', STAGE_DIM.wIn, STAGE_DIM.dIn, STAGE_DIM.hIn, 'stage', {
  topIn: STAGE_DIM.hIn,
  stairs: true, // included with the deck
  skirt: true, // optional; recommended choice preselected
  note: '24 in height unconfirmed, pending Bob',
});

// One line for merge. Import of registerProduct is already at the top of this file. Do not call it here.
export const STAGE_REGISTRATION = 'registerProduct(stageProduct);';

// Same snap window the poster walls use: 0.5 ft, about 10°. Not a stage size.
export const STAGE_SNAP = { gap: 0.5, ang: Math.PI / 18, cross: 0.5 };

const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const toWorld = (cx, cz, a, lx, lz) => {
  const c = Math.cos(a), s = Math.sin(a);
  return [cx + lx * c + lz * s, cz - lx * s + lz * c];
};
const toLocal = (cx, cz, a, wx, wz) => {
  const dx = wx - cx, dz = wz - cz, c = Math.cos(a), s = Math.sin(a);
  return [dx * c - dz * s, dx * s + dz * c];
};

export function stageGroup(items, it) {
  if (!it || it.type !== 'stage') return it ? [it] : [];
  const by = new Map(items.filter((o) => o.type === 'stage').map((o) => [o.uid, o]));
  const out = [it], q = [it];
  while (q.length) {
    const u = q.shift();
    for (const id of u.links || []) {
      const o = by.get(id);
      if (o && !out.includes(o)) { out.push(o); q.push(o); }
    }
  }
  return out;
}

export function linkStages(a, b) {
  if (!a || !b || a === b) return;
  a.links = [...new Set([...(a.links || []), b.uid])];
  b.links = [...new Set([...(b.links || []), a.uid])];
}

// A deck can land flush with more than one neighbour (the corner of a grid). Link every flush edge, not only the one the pointer was near.
export function stageLinkFlush(items, it) {
  if (!it || it.type !== 'stage') return 0;
  let n = 0;
  for (const o of items) {
    if (o === it || o.type !== 'stage' || Math.abs(wrapA(o.a - it.a)) > 1e-3) continue;
    const [lx, lz] = toLocal(it.x, it.z, it.a, o.x, o.z);
    const side = Math.abs(lz) < 0.05 && Math.abs(Math.abs(lx) - stageProduct.w) < 0.05;
    const end = Math.abs(lx) < 0.05 && Math.abs(Math.abs(lz) - stageProduct.d) < 0.05;
    if (side || end) { linkStages(it, o); n++; }
  }
  return n;
}

export function unlinkStage(items, it) {
  if (!it) return 0;
  const n = (it.links || []).length;
  for (const o of items) if (o.links) { o.links = o.links.filter((u) => u !== it.uid); if (!o.links.length) delete o.links; }
  delete it.links;
  return n;
}

// Which edges of a deck sit flush against a linked deck. Local +x is right, local +z is the front (the stair edge).
export function stageJoins(items, it) {
  const r = { joinL: false, joinR: false, joinF: false, joinB: false };
  if (!it || it.type !== 'stage' || !(it.links || []).length) return r;
  const w = stageProduct.w, d = stageProduct.d;
  for (const id of it.links) {
    const o = items.find((q) => q.uid === id);
    if (!o || Math.abs(wrapA(o.a - it.a)) > 1e-3) continue;
    const [lx, lz] = toLocal(it.x, it.z, it.a, o.x, o.z);
    if (Math.abs(lz) < 0.05 && Math.abs(Math.abs(lx) - w) < 0.05) r[lx > 0 ? 'joinR' : 'joinL'] = true;
    if (Math.abs(lx) < 0.05 && Math.abs(Math.abs(lz) - d) < 0.05) r[lz > 0 ? 'joinF' : 'joinB'] = true;
  }
  return r;
}

const SIDES = [
  { id: 'R', axis: 'x', sign: 1 },
  { id: 'L', axis: 'x', sign: -1 },
  { id: 'F', axis: 'z', sign: 1 },
  { id: 'B', axis: 'z', sign: -1 },
];

// Flush snap on all four edges. Same facing only, so an 8 ft edge never lands on a 4 ft edge.
// Returns null when nothing is in range. Does not change sizes.
export function stageSnap(items, it, px, pz, a = it.a) {
  if (!it || it.type !== 'stage') return null;
  const grp = stageGroup(items, it);
  let best = null;
  for (const h of items) {
    if (h === it || h.type !== 'stage' || grp.includes(h) || Math.abs(wrapA(a - h.a)) > STAGE_SNAP.ang + 1e-9) continue;
    const [lx, lz] = toLocal(h.x, h.z, h.a, px, pz);
    for (const side of SIDES) {
      const along = side.axis === 'x' ? lx : lz;
      const cross = side.axis === 'x' ? lz : lx;
      const span = side.axis === 'x' ? stageProduct.w : stageProduct.d;
      if (Math.sign(along) !== side.sign) continue;
      const gap = Math.abs(along) - span;
      if (Math.abs(gap) > STAGE_SNAP.gap + 1e-9 || Math.abs(cross) > STAGE_SNAP.cross) continue;
      const slotLx = side.axis === 'x' ? side.sign * span : 0;
      const slotLz = side.axis === 'z' ? side.sign * span : 0;
      const taken = items.some((o) => {
        if (o === it || o === h || o.type !== 'stage' || grp.includes(o)) return false;
        const [ox, oz] = toLocal(h.x, h.z, h.a, o.x, o.z);
        return Math.abs(ox - slotLx) < span / 2 - 0.05 && Math.abs(oz - slotLz) < (side.axis === 'x' ? stageProduct.d : stageProduct.w) / 2 - 0.05;
      });
      if (taken) continue;
      const [x, z] = toWorld(h.x, h.z, h.a, slotLx, slotLz);
      const dist = Math.hypot(px - x, pz - z);
      if (!best || dist < best.dist) best = { x, z, a: h.a, y: 0, dist, join: h.uid, side: side.id, mode: 'free', host: null };
    }
  }
  return best;
}

// Rigid move of a snapped run. Same idea as a poster wall: one drag carries the linked decks.
export function stageCarry(items, it, pose) {
  const da = pose.a - it.a;
  return stageGroup(items, it).map((o) => {
    if (o === it) return { uid: o.uid, x: pose.x, z: pose.z, a: pose.a };
    const [lx, lz] = toLocal(it.x, it.z, it.a, o.x, o.z);
    const [x, z] = toWorld(pose.x, pose.z, pose.a, lx, lz);
    return { uid: o.uid, x, z, a: o.a + da };
  });
}

const mats = {};
const mat = (k, c) => (mats[k] ||= new THREE.MeshLambertMaterial({ color: c }));
const addBox = (g, name, w, h, d, m, x, y, z, extra) => {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z); o.name = name; if (extra) Object.assign(o.userData, extra); g.add(o); return o;
};

function addSkirt(g, length, axis, cx, cz, inside, side) {
  if (length < 0.2) return;
  const n = Math.max(4, Math.round(length * 2));
  const pw = length / n, pleat = VISUAL.skirtPleatFt, face = VISUAL.skirtInsetFt;
  const h = stageProduct.h, deckT = inch(STAGE_DIM.deckIn);
  const sh = h - deckT - 0.04, y = 0.02 + sh / 2;
  const geos = [];
  for (let i = 0; i < n; i++) {
    const t = -length / 2 + pw * (i + 0.5);
    const inset = face + (i % 2 ? pleat : 0);
    const x = axis === 'x' ? cx + t : cx + inside * inset;
    const z = axis === 'x' ? cz + inside * inset : cz + t;
    const bw = axis === 'x' ? pw * 0.72 : 0.025;
    const bd = axis === 'x' ? 0.025 : pw * 0.72;
    geos.push(new THREE.BoxGeometry(bw, sh, bd).translate(x, y, z));
  }
  const o = new THREE.Mesh(mergeGeometries(geos), mat('skirt', 0x16181e));
  geos.forEach((q) => q.dispose());
  o.name = 'skirt'; o.userData.side = side; g.add(o); return o;
}

// Origin is the deck centre, on the floor. Front is +z. 1 unit = 1 ft.
// opt.skirt / opt.stairs default on (the recommended choice). opt.joinL/R/F/B drop the skirt on a shared edge.
// A deck whose front is against another deck does not grow a stair into that deck.
export function buildStageMesh(d = stageProduct, opt = {}) {
  const g = new THREE.Group();
  g.name = 'stage';
  const w = d.w, dd = d.d, h = d.h;
  const deckT = inch(STAGE_DIM.deckIn);
  const frameH = inch(STAGE_DIM.frameHIn);
  const legR = inch(STAGE_DIM.legDiaIn) / 2;
  const band = inch(VISUAL.frameBandIn);
  const deckM = mat('deck', 0x1c1e22), frameM = mat('frame', 0x9aa3ad), seamM = mat('seam', 0x3c424c);
  addBox(g, 'deckTop', w, deckT, dd, deckM, 0, h - deckT / 2, 0);
  addBox(g, 'seam', w * 0.92, 0.004, 0.012, seamM, 0, h - 0.003, 0);
  addBox(g, 'seam', 0.012, 0.004, dd * 0.88, seamM, 0, h - 0.003, 0);
  const yf = h - frameH / 2;
  addBox(g, 'frame', w, frameH, band, frameM, 0, yf, dd / 2 - band / 2, { side: 'F' });
  addBox(g, 'frame', w, frameH, band, frameM, 0, yf, -dd / 2 + band / 2, { side: 'B' });
  addBox(g, 'frame', band, frameH, dd, frameM, w / 2 - band / 2, yf, 0, { side: 'R' });
  addBox(g, 'frame', band, frameH, dd, frameM, -w / 2 + band / 2, yf, 0, { side: 'L' });
  const legH = h - frameH;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(legR, legR, legH, 16), frameM);
    o.position.set(sx * (w / 2 - legR), legH / 2, sz * (dd / 2 - legR));
    o.name = 'leg'; g.add(o);
  }
  addBox(g, 'centerRail', w - inch(STAGE_DIM.legDiaIn) * 4, inch(STAGE_DIM.legDiaIn), inch(STAGE_DIM.legDiaIn), frameM, 0, legH - legR, 0);

  const skirtOn = opt.skirt !== false;
  const stairsOn = opt.stairs !== false && !opt.joinF;
  if (skirtOn) {
    if (!opt.joinL) addSkirt(g, dd, 'z', -w / 2, 0, 1, 'L');
    if (!opt.joinR) addSkirt(g, dd, 'z', w / 2, 0, -1, 'R');
    if (!opt.joinB) addSkirt(g, w, 'x', 0, -dd / 2, 1, 'B');
    if (!opt.joinF) {
      const stairW = inch(STAGE_DIM.treadWIn);
      if (stairsOn) {
        const side = (w - stairW) / 2;
        addSkirt(g, side, 'x', -(stairW / 2 + side / 2), dd / 2, -1, 'F');
        addSkirt(g, side, 'x', stairW / 2 + side / 2, dd / 2, -1, 'F');
      } else addSkirt(g, w, 'x', 0, dd / 2, -1, 'F');
    }
  }

  if (stairsOn) {
    const run = inch(STAGE_DIM.stairRunIn);
    const treadD = inch(STAGE_DIM.treadDIn);
    const treadW = inch(STAGE_DIM.treadWIn);
    const treadT = inch(VISUAL.treadThickIn);
    const joint = run - STAGE_DIM.stairSteps * treadD;
    const rise = h / STAGE_DIM.stairSteps;
    const treadM = mat('tread', 0x4c545f), noseM = mat('nose', 0xc5ccd4), railM = mat('rail', 0x2c3138);
    const zFace = dd / 2;
    addBox(g, 'stairJoint', treadW, treadT, joint, treadM, 0, h - treadT / 2, zFace + joint / 2);
    const riserT = inch(VISUAL.riserIn);
    for (let i = 0; i < STAGE_DIM.stairSteps; i++) {
      const top = h - rise * i;
      const z0 = zFace + joint + treadD * i;
      addBox(g, 'stairTread', treadW, treadT, treadD, treadM, 0, top - treadT / 2, z0 + treadD / 2);
      addBox(g, 'stairNose', treadW * 0.96, 0.008, 0.04, noseM, 0, top - 0.008, z0 + treadD - 0.03);
      // Vertical face at the nose, from the step below (or the floor) up to this tread. Stays inside the run.
      addBox(g, 'stairRiser', treadW, rise, riserT, railM, 0, top - rise / 2, z0 + treadD - riserT / 2);
    }
    const railT = inch(VISUAL.railIn);
    const zFront = zFace + run;
    const railSpan = zFront - railT - zFace;
    for (const sx of [-1, 1]) {
      const x = sx * (treadW / 2 - railT / 2);
      addBox(g, 'stairRail', railT, h, railT, railM, x, h / 2, zFront - railT / 2);
      addBox(g, 'stairRail', railT, railT, railSpan, railM, x, h - railT / 2, zFace + railSpan / 2);
      addBox(g, 'stairRail', railT, railT, railSpan * 0.7, railM, x, rise * 0.55, zFace + railSpan * 0.45);
    }
  }

  g.traverse((o) => { if (o.isMesh) o.castShadow = false; });
  return g;
}

export { registerProduct };
