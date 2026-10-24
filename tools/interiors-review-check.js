'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.join(__dirname, '..');

const ctx = {
  console,
  performance: { now: () => Date.now() },
  Math,
  document: { getElementById: () => null }
};
ctx.globalThis = ctx;
ctx.window = ctx;
vm.createContext(ctx);

function load(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file });
}

load('world/planner-props.js');
load('world/planner-tools.js');
load('world/style-sampler.js');
load('world/interiors-review.js');

const fail = [];
const R = ctx.INTERIOR_REVIEW;
const rooms = ['house', 'arcade', 'cafe', 'pets', 'soccer', 'builder'];
const door = { x: 1.2, z: 2.2 };

function hitsDoor(b) {
  if (!b || b.h < 0.2) return false;
  const x0 = b.x - b.w / 2, x1 = b.x + b.w / 2;
  const z0 = b.z - b.d / 2, z1 = b.z + b.d / 2;
  const overlapX = x1 > -door.x && x0 < door.x;
  const overlapZ = z1 > 0 && z0 < door.z;
  return overlapX && overlapZ;
}

if (!R || typeof R.paint !== 'function') fail.push('review painter missing');
if (!ctx.PLANNER_TOOLS || typeof ctx.PLANNER_TOOLS.roof !== 'function') fail.push('shared roof missing');
if (!ctx.PLANNER_PROPS || typeof ctx.PLANNER_PROPS.place !== 'function') fail.push('shared props missing');

const srcPerson = fs.readFileSync(path.join(root, 'world/style-sampler.js'), 'utf8');
const person = srcPerson.slice(srcPerson.indexOf('function samplerPerson'), srcPerson.indexOf('function samplerPet'));
const pet = srcPerson.slice(srcPerson.indexOf('function samplerPet'), srcPerson.indexOf('function samplerNoteFrame'));
if (!/0\.82/.test(person) || !/#2f7f96/.test(person) || !/samplerBox\(x, z, 0/.test(person)) fail.push('Ellie torso is not the live interior figure');
if (!/0\.36/.test(pet) || !/0\.62/.test(pet) || !/0\.12/.test(pet) || !/samplerBox\(x, z, 0/.test(pet)) fail.push('pet figure drifted');
const petTop = 0.62 + 0.12;
if (Math.abs(petTop - 0.74) > 0.001) fail.push('pet ears are not 0.74 m');
if (Math.abs(petTop / 1.7 - 0.435) > 0.02) fail.push('pet to Ellie ratio');

const reviewSrc = fs.readFileSync(path.join(root, 'world/interiors-review.js'), 'utf8');
const pageSrc = fs.readFileSync(path.join(root, 'test/interiors-review.html'), 'utf8');
if (/shadowBlur\s*=/.test(reviewSrc) || /shadowBlur\s*=/.test(pageSrc)) fail.push('review sets shadowBlur');
if (!/samplerPerson\(/.test(reviewSrc) || !/samplerPet\(/.test(reviewSrc)) fail.push('review does not draw the live pair');
if (!/PLANNER_TOOLS\.roof/.test(reviewSrc) || !/samplerDrop\(/.test(reviewSrc)) fail.push('review skips shared tools');

const counts = {};
for (let r = 0; r < rooms.length; r++) {
  const room = rooms[r];
  const list = R.list(room);
  if (!list || list.length < 3 || list.length > 4) fail.push(room + ' style count ' + (list && list.length));
  const names = {};
  for (let i = 0; i < list.length; i++) {
    const spec = list[i];
    if (names[spec.name]) fail.push(room + ' repeated ' + spec.name);
    names[spec.name] = 1;
    if (!spec.line || spec.line.length > 80) fail.push(room + ' line ' + spec.id);
    if (spec.h < 4.2) fail.push(room + ' ' + spec.id + ' ceiling ' + spec.h);
    if (spec.w * spec.d < 22 * 16) fail.push(room + ' ' + spec.id + ' floor small');
    if (room === 'house' && !spec.glass) fail.push('house ' + spec.id + ' has no glass');
    const kit = R.kit(spec);
    const props = kit.props;
    let doorHit = 0;
    for (let b = 0; b < props.length; b++) if (hitsDoor(props[b])) doorHit++;
    if (doorHit) fail.push(room + ' ' + spec.id + ' blocks the door ' + doorHit);
    if (props.length > 80) fail.push(room + ' ' + spec.id + ' boxes ' + props.length);
    counts[room + '/' + spec.n + '-' + spec.id] = props.length + 3;
  }
  const floors = list.map((s) => s.floor);
  if (new Set(floors).size < 3) fail.push(room + ' floors are too alike');
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (/interiors-review/.test(index)) fail.push('adult page loads the review');
const live = ['world.html', 'world-split.html'];
for (let i = 0; i < live.length; i++) {
  const html = fs.readFileSync(path.join(root, live[i]), 'utf8');
  if (/interiors-review/.test(html)) fail.push(live[i] + ' loads the review');
}

const report = { ok: fail.length === 0, fails: fail, boxes: counts };
fs.mkdirSync(path.join(root, 'test-results/interiors-review'), { recursive: true });
fs.writeFileSync(path.join(root, 'test-results/interiors-review/check.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(fail.length ? 1 : 0);
