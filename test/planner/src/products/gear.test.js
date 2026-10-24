// Product tests for orders 70-77. Loaded by the selftest page only (see lineup.js).
// Not imported by the app, and not run at app startup.
import { registeredProducts } from '../register.js';
import { BY_ID } from '../catalog.js';
import { buildMesh, disposeTree } from '../meshes.js';
import { Box3 } from 'three';
import { itemIcon } from '../icons.js';
import { BRAND } from '../brand.js';
import { applyPose, corners, isValid, newItem, snapPose } from '../logic.js';
import { pointInPoly, presetWalls } from '../walls.js';
import { endSnap, gearSnap, outsidePose, settleItem } from './lineup.js';
import { WT_OPEN_H_IN, WT_OPEN_W_IN } from './wtmeter.js';

const ft = (i) => Math.round((i / 12) * 1000) / 1000;
const near = (a, b, e = 1e-3) => Math.abs(a - b) <= e;

const IDS = [
  [70, 'qbar', 'decor', 'Queue barricade', [100, 20, 43]],
  [71, 'wtmeter', 'decor', 'Walk-through metal detector', [32.9, 26, 88.8]],
  [72, 'tent', 'decor', 'Event tent', [240, 240, 201]],
  [73, 'generator', 'power', 'Generator', [33.4, 27.6, 28.4]],
  [74, 'feeder', 'power', 'Feeder cable', [36, 2.31, 2.31]],
  [75, 'ramp', 'power', 'Cable ramp', [36, 20, 2.31]],
  [76, 'radio', 'audio', 'Two-way radio', [2.4, 1.7, 5]],
  [77, 'ibooth', 'decor', 'Interpretation booth', [63, 63, 79]],
];

function room(env = 'indoor') {
  return { env, walls: presetWalls('30x40'), items: [], cols: [] };
}
function put(world, type, x, z, a = 0) {
  const it = newItem(type, x, z, a);
  world.items.push(it);
  return it;
}
function envelope(d) {
  const g = buildMesh(d, 'free');
  const b = new Box3().setFromObject(g);
  const names = [];
  g.traverse((m) => { if (m.name) names.push(m.name); });
  return { g, b, names };
}
function covers(g, x, y, z) {
  let hit = false;
  g.traverse((m) => {
    if (!m.isMesh) return;
    const box = new Box3().setFromObject(m);
    if (x >= box.min.x - 1e-4 && x <= box.max.x + 1e-4 && y >= box.min.y - 1e-4 && y <= box.max.y + 1e-4 && z >= box.min.z - 1e-4 && z <= box.max.z + 1e-4) hit = true;
  });
  return hit;
}

export function runGearTests() {
  const R = [];
  const t = (name, fn) => {
    let ok = false, err = '';
    try { ok = !!fn(); if (!ok) err = 'returned false'; }
    catch (e) { err = e.message || String(e); }
    R.push([name, ok, ok ? '' : err]);
  };
  const by = Object.fromEntries(registeredProducts().map((p) => [p.id, p]));
  const badWord = (s) => /\bRAC\b|\bCAM\b|\bdistro\b/i.test(s);

  t('v3.34 gear products register at orders 70-77', () => {
    const got = IDS.map(([order, id]) => by[id] && by[id].order === order && by[id].id === id);
    const extra = registeredProducts().filter((p) => p.order >= 70 && p.order <= 79 && !IDS.some((row) => row[1] === p.id));
    if (extra.length) throw new Error(extra.map((p) => p.id + ':' + p.order).join(','));
    return got.every(Boolean) && IDS.length === 8;
  });

  for (const [order, id, cat, name, inches] of IDS) {
    t(id + ' is order ' + order + ' in ' + cat + ' at the sheet size', () => {
      const p = by[id], d = BY_ID[id];
      if (!p || !d) throw new Error('missing');
      if (p.cat !== cat || d.cat !== cat || d.name !== name) throw new Error(d.cat + ' ' + d.name);
      if (d.w !== ft(inches[0]) || d.d !== ft(inches[1]) || d.h !== ft(inches[2])) throw new Error([d.w, d.d, d.h].join(','));
      if (typeof d.draw !== 'function') throw new Error('no draw');
      return p.order === order;
    });
    t(id + ' is flagged unconfirmed and its copy stays on brand', () => {
      const d = BY_ID[id];
      const blob = [d.name, d.note, ...(d.flags || [])].join('\n');
      if (!d.unconfirmed || !/UNCONFIRMED/.test(d.note || '')) throw new Error(d.note);
      if (badWord(blob)) throw new Error(blob);
      return (d.flags || []).length >= 1;
    });
    t(id + ' mesh fills its envelope within 1 in and is code-drawn', () => {
      const d = BY_ID[id];
      const { g, b, names } = envelope(d);
      const sz = [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z];
      const err = [sz[0] - d.w, sz[1] - d.h, sz[2] - d.d];
      const brand = names.some((n) => /ceia|honda|motorola|checkers/i.test(n));
      disposeTree(g);
      if (brand) throw new Error(names.join(','));
      if (err.some((v) => v <= -1 / 12 || v >= 1 / 12) || b.min.y <= -0.02 || b.min.y >= 0.04) throw new Error(sz.map((v) => v.toFixed(3)).join(',') + ' minY ' + b.min.y.toFixed(3));
      if (Math.abs(b.min.x + b.max.x) > 0.08 || Math.abs(b.min.z + b.max.z) > 0.08) throw new Error('off center');
      return names.length > 0;
    });
  }

  t('tent, radio, and interpretation booth say Bob has not confirmed', () => ['tent', 'radio', 'ibooth'].every((id) => /Bob has not confirmed/.test(BY_ID[id].note) && (BY_ID[id].flags || []).some((f) => /Bob has not confirmed/.test(f))));
  t('generator note says Power distribution and sits outside', () => /Power distribution/.test(BY_ID.generator.note) && BY_ID.generator.place === 'outside' && BY_ID.generator.wallDIn === 27.6);
  t('feeder size is the ramp section and is not a sourced cable', () => BY_ID.feeder.w === BY_ID.ramp.w && BY_ID.feeder.h === BY_ID.ramp.h && BY_ID.feeder.d === BY_ID.ramp.h && /not a sourced cable/.test(BY_ID.feeder.note));
  t('gear icons use brand colours', () => IDS.every(([, id]) => { const svg = itemIcon(BY_ID[id]); return svg.startsWith('<svg') && svg.includes(BRAND.colors.highlight) && svg.includes(BRAND.colors.accent); }));

  t('queue barricades snap end to end into a line', () => {
    const W = room();
    const a = put(W, 'qbar', 6, 20, 0);
    const w = BY_ID.qbar.w;
    const b = put(W, 'qbar', 6 + w + 0.2, 20, 0);
    if (!settleItem(W, b)) throw new Error('no snap');
    if (!near(b.x, 6 + w) || !near(b.z, 20) || !near(b.a, 0)) throw new Error([b.x, b.z, b.a].join(','));
    const c = put(W, 'qbar', b.x + w + 0.3, 20, 0);
    if (!settleItem(W, c)) throw new Error('third');
    if (!near(c.x, b.x + w) || !near(c.z, 20)) throw new Error('c ' + c.x);
    const x0 = b.x;
    if (!settleItem(W, b) || !near(b.x, x0)) throw new Error('not idempotent');
    return isValid(W, a) && isValid(W, b) && isValid(W, c);
  });
  t('a barricade on top of another, or square to it, does not join', () => {
    const W = room();
    const a = put(W, 'qbar', 15, 20, 0);
    const onTop = put(W, 'qbar', 15, 20, 0);
    const side = put(W, 'qbar', 15 + BY_ID.qbar.w + 0.2, 22, 0);
    const turn = put(W, 'qbar', 15 + BY_ID.qbar.w + 0.2, 20, Math.PI / 2);
    return !endSnap(W.items, onTop, onTop.x, onTop.z, 0) && !endSnap(W.items, side, side.x, side.z, 0) && !endSnap(W.items, turn, turn.x, turn.z, turn.a) && a.type === 'qbar';
  });
  t('a slight angle still joins, and the line keeps the host angle', () => {
    const W = room();
    put(W, 'qbar', 15, 20, 0);
    const b = put(W, 'qbar', 0, 0, Math.PI / 36);
    const p = endSnap(W.items, b, 15 + BY_ID.qbar.w + 0.15, 20.1, b.a);
    if (!p || !near(p.a, 0)) throw new Error(p ? String(p.a) : 'null');
    return near(p.x, 15 + BY_ID.qbar.w);
  });
  t('cable ramps and feeder cables snap only to their own type', () => {
    const W = room();
    put(W, 'qbar', 10, 18, 0);
    const ramp = put(W, 'ramp', 10, 12, 0);
    const feeder = put(W, 'feeder', 10, 16, 0);
    if (endSnap(W.items, ramp, 10 + BY_ID.qbar.w / 2 + BY_ID.ramp.w / 2 + 0.2, 18, 0)) throw new Error('ramp joined barricade');
    if (endSnap(W.items, feeder, 10 + BY_ID.ramp.w + 0.2, 12, 0)) throw new Error('feeder joined ramp');
    const ramp2 = put(W, 'ramp', 10 + BY_ID.ramp.w + 0.2, 12, 0);
    const feeder2 = put(W, 'feeder', 10 + BY_ID.feeder.w + 0.2, 16, 0);
    if (!settleItem(W, ramp2) || !near(ramp2.x, 10 + BY_ID.ramp.w)) throw new Error('ramp ' + ramp2.x);
    if (!settleItem(W, feeder2) || !near(feeder2.x, 10 + BY_ID.feeder.w)) throw new Error('feeder ' + feeder2.x);
    const g = gearSnap(W, ramp2, ramp2.x, ramp2.z);
    return !!g && g.mode === 'free' && isValid(W, ramp2) && isValid(W, feeder2);
  });

  t('generator indoors sits outside the room', () => {
    const W = room();
    const it = put(W, 'generator', 0.9, 20, 0);
    if (!settleItem(W, it)) throw new Error('no outside pose');
    if (!(it.x < 0) || !near(it.z, 20, 0.05) || it.mode !== 'wall') throw new Error([it.x, it.z, it.mode].join(','));
    if (pointInPoly(it.x, it.z, W.walls[0].pts)) throw new Error('center inside');
    if (!corners(it).every(([x]) => x < -0.01)) throw new Error(corners(it).map((p) => p[0].toFixed(3)).join(','));
    if (!isValid(W, it)) throw new Error('invalid');
    const again = outsidePose(W, it, it.x, it.z);
    return again && near(again.x, it.x) && near(again.a, -Math.PI / 2, 0.02);
  });
  t('generator in the middle of the room stays free', () => {
    const W = room();
    const it = put(W, 'generator', 15, 20, 0);
    return !outsidePose(W, it, 15, 20) && !settleItem(W, it) && it.mode === 'free';
  });
  t('generator outdoors stays free, like Power distribution', () => {
    const W = room('outdoor');
    const it = put(W, 'generator', 8, 20, 0);
    const posed = snapPose(W, it, 8, 20);
    const box = put(W, 'powerbox', 0.9, 20, 0);
    const pb = snapPose(W, box, 0.9, 20);
    it.mode = 'wall';
    settleItem(W, it);
    return outsidePose(W, it, 0.9, 20) === null && gearSnap(W, it, 0.9, 20) === null && posed.mode === 'free' && posed.y === 0 && pb.mode === 'free' && pb.y === 0 && it.mode === 'free' && it.y === 0;
  });
  t('Power distribution box still snaps inside the room', () => {
    const W = room();
    const it = put(W, 'powerbox', 0.9, 20, 0);
    applyPose(W, it, snapPose(W, it, 0.9, 20));
    return it.mode === 'wallfloor' && it.x > 0 && pointInPoly(it.x, it.z, W.walls[0].pts);
  });

  t('two-way radio snaps onto a registration counter', () => {
    const W = room();
    const desk = put(W, 'regctr', 15, 20, 0);
    const it = put(W, 'radio', 15, 20, 0);
    applyPose(W, it, snapPose(W, it, 15, 20));
    if (it.mode !== 'top' || it.host !== desk.uid) throw new Error(it.mode + ' ' + it.host);
    return near(it.y, BY_ID.regctr.top) && near(it.y, ft(42)) && isValid(W, it);
  });
  t('interpretation booth sits against the wall', () => {
    const W = room();
    const it = put(W, 'ibooth', 3, 20, 0);
    applyPose(W, it, snapPose(W, it, 3, 20));
    if (it.mode !== 'wallfloor' || !(it.x > 0)) throw new Error(it.mode + ' ' + it.x);
    return pointInPoly(it.x, it.z, W.walls[0].pts) && isValid(W, it);
  });

  t('walk-through opening is 28.3 by 80.7 in and stays clear', () => {
    if (WT_OPEN_W_IN !== 28.3 || WT_OPEN_H_IN !== 80.7) throw new Error('sheet');
    const d = BY_ID.wtmeter;
    const { g } = envelope(d);
    let left = null, right = null, header = null;
    g.traverse((m) => {
      if (!m.isMesh) return;
      const b = new Box3().setFromObject(m);
      if (m.name === 'wtmeterUpright' && b.max.x < 0) left = b;
      if (m.name === 'wtmeterUpright' && b.min.x > 0) right = b;
      if (m.name === 'wtmeterHeader') header = b;
    });
    const gap = left && right ? (right.min.x - left.max.x) * 12 : -1;
    const openH = header ? header.min.y * 12 : -1;
    const mid = covers(g, 0, d.h / 2, 0);
    const low = covers(g, 0, 0.4, 0);
    const upright = left ? covers(g, (left.min.x + left.max.x) / 2, d.h / 2, 0) : false;
    disposeTree(g);
    if (!near(gap, 28.3, 0.05) || !near(openH, 80.7, 0.05)) throw new Error('gap ' + gap.toFixed(2) + ' h ' + openH.toFixed(2));
    if (mid || low || !upright) throw new Error('mid ' + mid + ' low ' + low + ' upright ' + upright);
    return true;
  });

  return R;
}
