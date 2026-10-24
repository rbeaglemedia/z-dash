// Stage deck checks. Not loaded by the catalog glob (that only takes *.js).
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Box3 } from 'three';
import {
  STAGE_DIM, STAGE_SOURCES, STAGE_UNCONFIRMED, STAGE_REGISTRATION, STAGE_SNAP,
  stageProduct, buildStageMesh, stageSnap, stageJoins, stageGroup, stageCarry, linkStages, stageLinkFlush,
} from './stage.js';

const near = (a, b, e = 1e-3) => Math.abs(a - b) < e;
const inch = (n) => n / 12;
const boxOf = (g, pred) => {
  const b = new Box3();
  g.traverse((o) => { if (o.isMesh && (!pred || pred(o))) b.expandByObject(o); });
  return b;
};
const names = (g) => { const s = new Set(); g.traverse((o) => { if (o.name) s.add(o.name); }); return s; };
const deck = (uid, x = 0, z = 0, a = 0) => ({ uid, type: 'stage', x, z, a });

test('catalog size is the 4 × 8 ft deck at the 24 in default', () => {
  assert.equal(stageProduct.id, 'stage');
  assert.equal(stageProduct.cat, 'decor');
  assert.equal(stageProduct.name, '4 × 8 stage deck');
  assert.equal(stageProduct.w, 8);
  assert.equal(stageProduct.d, 4);
  assert.equal(stageProduct.h, 2);
  assert.equal(stageProduct.top, 2);
  assert.equal(stageProduct.stairs, true);
  assert.equal(stageProduct.skirt, true);
  assert.match(stageProduct.note, /24 in height unconfirmed, pending Bob/);
  assert.equal(STAGE_DIM.wIn, 96);
  assert.equal(STAGE_DIM.dIn, 48);
  assert.equal(STAGE_DIM.hIn, 24);
});

test('24 in height and the other silent sizes are flagged', () => {
  const keys = new Set(STAGE_UNCONFIRMED.map((u) => u.key));
  for (const k of ['hIn', 'stairModel', 'riserIn', 'frameBandIn', 'treadThickIn', 'railIn', 'skirt', 'stairJointIn']) assert.ok(keys.has(k), k);
  assert.equal(STAGE_UNCONFIRMED.find((u) => u.key === 'hIn').valueIn, 24);
  assert.match(STAGE_SOURCES.deck, /wengercorp\.com/);
  assert.match(STAGE_SOURCES.stairs, /Wenger_Stairways/);
  assert.match(STAGE_SOURCES.page, /rentacomputer\.com\/rentals\/audio-visual\/staging/);
  assert.equal(STAGE_DIM.stairModel, '281A100');
  assert.equal(STAGE_DIM.stairRunIn, 22.75);
  assert.equal(STAGE_DIM.treadDIn, 11);
  assert.equal(STAGE_DIM.treadWIn, 36);
  assert.equal(STAGE_DIM.deckIn, 0.75);
  assert.equal(STAGE_DIM.frameHIn, 4);
  assert.equal(STAGE_DIM.legDiaIn, 2.5);
});

test('registration is one line and this file does not call it', () => {
  assert.equal(STAGE_REGISTRATION, 'registerProduct(stageProduct);');
  const src = readFileSync(new URL('./stage.js', import.meta.url), 'utf8');
  const code = src.replace(/export const STAGE_REGISTRATION = [\s\S]*?;/, '');
  assert.doesNotMatch(code, /registerProduct\s*\(/);
  assert.doesNotMatch(src, /\$\d|\bprice\b/i);
  assert.doesNotMatch(src, /\bRAC\b|\bXponex\b|\bdistro\b/);
});

test('deck mesh is the real 8 × 4 × 2 ft box, code-drawn', () => {
  const g = buildStageMesh(stageProduct, { stairs: false, skirt: false });
  const b = boxOf(g);
  assert.ok(near(b.max.x - b.min.x, 8) && near(b.max.z - b.min.z, 4) && near(b.max.y - b.min.y, 2));
  assert.ok(near(b.max.y, 2) && near(b.min.y, 0));
  assert.ok(near(b.min.x, -4) && near(b.max.x, 4) && near(b.min.z, -2) && near(b.max.z, 2));
  const n = names(g);
  assert.ok(n.has('deckTop') && n.has('leg') && n.has('frame') && n.has('centerRail'));
  let legs = 0;
  g.traverse((o) => { if (o.name === 'leg') { legs++; assert.equal(o.geometry.type, 'CylinderGeometry'); } else if (o.isMesh) assert.equal(o.geometry.type, 'BoxGeometry'); });
  assert.equal(legs, 4);
});

test('stairs add the published 22.75 in run and 36 in width, and stay at deck height', () => {
  const g = buildStageMesh(stageProduct, { stairs: true, skirt: false });
  const stairs = boxOf(g, (o) => o.name.startsWith('stair'));
  const run = inch(22.75), treadW = inch(36);
  assert.ok(near(stairs.min.z, 2), stairs.min.z);
  assert.ok(near(stairs.max.z, 2 + run), stairs.max.z);
  assert.ok(near(stairs.max.x - stairs.min.x, treadW), stairs.max.x - stairs.min.x);
  assert.ok(near(stairs.max.y, 2) && stairs.min.y >= -1e-4);
  const treads = [];
  g.traverse((o) => { if (o.name === 'stairTread') treads.push(o); });
  assert.equal(treads.length, 2);
  const whole = boxOf(g);
  assert.ok(near(whole.max.x - whole.min.x, 8));
  assert.ok(near(whole.max.z - whole.min.z, 4 + run));
  assert.ok(near(whole.max.y, 2) && near(whole.min.y, 0));
});

test('optional skirt stays inside the deck and leaves the stair opening', () => {
  const open = buildStageMesh(stageProduct, { skirt: true, stairs: true });
  const skirt = boxOf(open, (o) => o.name === 'skirt');
  assert.ok(skirt.max.x < 4 && skirt.min.x > -4 && skirt.max.z < 2 && skirt.min.z > -2);
  assert.ok(skirt.min.y >= 0 && skirt.max.y <= 2);
  const front = [];
  open.traverse((o) => { if (o.name === 'skirt' && o.userData.side === 'F') front.push(new Box3().setFromObject(o)); });
  assert.equal(front.length, 2);
  const stairW = inch(36);
  assert.ok(front.every((b) => b.max.x < -stairW / 2 + 0.02 || b.min.x > stairW / 2 - 0.02));
  const bare = buildStageMesh(stageProduct, { skirt: false, stairs: true });
  assert.equal([...names(bare)].includes('skirt'), false);
});

test('a joined edge drops its skirt, and a joined front drops the stair', () => {
  const side = buildStageMesh(stageProduct, { joinR: true, skirt: true, stairs: true });
  const sides = new Set();
  side.traverse((o) => { if (o.name === 'skirt') sides.add(o.userData.side); });
  assert.deepEqual([...sides].sort(), ['B', 'F', 'L']);
  const buried = buildStageMesh(stageProduct, { joinF: true, skirt: true, stairs: true });
  const buriedSides = new Set();
  let stairs = 0;
  buried.traverse((o) => { if (o.name === 'skirt') buriedSides.add(o.userData.side); if (o.name.startsWith('stair')) stairs++; });
  assert.equal(buriedSides.has('F'), false);
  assert.equal(stairs, 0);
  const deckOnly = boxOf(buried);
  assert.ok(near(deckOnly.max.z - deckOnly.min.z, 4));
});

test('decks snap flush on the 4 ft ends and on the 8 ft sides', () => {
  const a = deck('a');
  const b = deck('b');
  const right = stageSnap([a, b], b, 8.2, 0.1, 0);
  assert.equal(right.side, 'R');
  assert.equal(right.join, 'a');
  assert.ok(near(right.x, 8) && near(right.z, 0) && right.a === 0);
  const front = stageSnap([a, b], b, 0.1, 4.2, 0);
  assert.equal(front.side, 'F');
  assert.ok(near(front.x, 0) && near(front.z, 4));
  assert.equal(stageSnap([a, b], b, 12, 0, 0), null);
  assert.equal(stageSnap([a, b], b, 8.2, 0.1, 0.4), null);
  assert.equal(stageSnap([a, b], b, 4, 0, Math.PI / 2), null);
  assert.ok(STAGE_SNAP.gap === 0.5 && near(STAGE_SNAP.ang, Math.PI / 18));
});

test('an occupied side is refused, and a linked run moves together', () => {
  const a = deck('a'), c = deck('c', 8, 0), b = deck('b');
  assert.equal(stageSnap([a, c, b], b, 8.1, 0, 0), null);
  const back = stageSnap([a, c, b], b, 0, -4.1, 0);
  assert.equal(back.side, 'B');
  linkStages(a, c);
  assert.deepEqual(stageGroup([a, c, b], a).map((o) => o.uid).sort(), ['a', 'c']);
  assert.equal(stageJoins([a, c], a).joinR, true);
  assert.equal(stageJoins([a, c], c).joinL, true);
  assert.equal(stageJoins([a, c], a).joinF, false);
  const moved = stageCarry([a, c], a, { x: 3, z: 1, a: Math.PI / 2 });
  const by = Object.fromEntries(moved.map((o) => [o.uid, o]));
  assert.ok(near(by.a.x, 3) && near(by.a.z, 1) && near(by.a.a, Math.PI / 2));
  assert.ok(near(by.c.x, 3) && near(by.c.z, 1 - 8) && near(by.c.a, Math.PI / 2));
});

test('four decks snap into an 8 × 8 ft stage with stairs only on the open front', () => {
  const items = [deck('a')];
  const place = (uid, px, pz) => {
    const it = deck(uid);
    const p = stageSnap(items, it, px, pz, 0);
    assert.ok(p, uid);
    it.x = p.x; it.z = p.z; it.a = p.a;
    items.push(it);
    assert.ok(stageLinkFlush(items, it) >= 1);
    return it;
  };
  place('b', 8.1, 0);
  place('c', 0, 4.1);
  place('d', 8.1, 4.1);
  assert.ok(near(items[3].x, 8) && near(items[3].z, 4));
  assert.equal(stageGroup(items, items[0]).length, 4);
  const front = items.filter((o) => stageJoins(items, o).joinF);
  const open = items.filter((o) => !stageJoins(items, o).joinF);
  assert.equal(front.length, 2);
  assert.equal(open.length, 2);
  for (const o of open) {
    const g = buildStageMesh(stageProduct, { ...stageJoins(items, o), stairs: true, skirt: true });
    assert.ok([...names(g)].some((n) => n.startsWith('stair')));
  }
  for (const o of front) {
    const g = buildStageMesh(stageProduct, { ...stageJoins(items, o), stairs: true, skirt: true });
    assert.equal([...names(g)].some((n) => n.startsWith('stair')), false);
  }
});
