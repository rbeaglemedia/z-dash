'use strict';
// Layout checks for the drive-up NOS prefab. No browser, no shadowBlur.
const assert = require('assert');
const N = require('../world/nos-station');
const fs = require('fs');
const path = require('path');

const SHOPS = [
  { name: 'depot', box: { x0: -332, x1: -268, z0: 1518, z1: 1682 }, face: { nx: 0, nz: -1 }, h: 34, kind: 'depot' },
  { name: 'station', box: { x0: -236, x1: -196, z0: 140, z1: 186 }, face: { nx: -1, nz: 0 }, h: 12, kind: 'station' },
  { name: 'tiny', box: { x0: 0, x1: 16, z0: 0, z1: 14 }, face: { nx: 0, nz: -1 }, h: 8, kind: 'station' }
];

function laneCenter(plan) {
  const lane = plan.lane;
  return { x: (lane.x0 + lane.x1) / 2, z: (lane.z0 + lane.z1) / 2 };
}

for (const shop of SHOPS) {
  const plan = N.layout(shop.box, shop.face, shop.h);
  assert.strictEqual(plan.kind, shop.kind, shop.name + ' kind');
  assert.strictEqual(plan.pumps.length, 2, shop.name + ' pumps');
  assert.ok(plan.mass.y1 === shop.h, shop.name + ' height stays');
  const massDepth = Math.min(plan.mass.x1 - plan.mass.x0, plan.mass.z1 - plan.mass.z0);
  assert.ok(massDepth >= 3.9, shop.name + ' kiosk keeps a back wall ' + massDepth);
  const canopy = plan.parts.filter((p) => p.nosPart === 'canopy');
  const posts = plan.parts.filter((p) => p.nosPart === 'post');
  const pumps = plan.parts.filter((p) => p.nosPart === 'pump');
  assert.strictEqual(canopy.length, 1, shop.name + ' one canopy');
  assert.strictEqual(posts.length, 4, shop.name + ' four posts');
  assert.strictEqual(pumps.length, 2, shop.name + ' two islands');
  assert.ok(canopy[0].y0 >= N.CLEAR - 0.001, shop.name + ' clearance');
  assert.ok(canopy[0].y0 + 0.3 >= 1.4, shop.name + ' car fits under');
  for (const part of [plan.mass].concat(plan.parts)) {
    if (part.nosPart === 'lane') continue;
    assert.ok(N.inside(part, shop.box), shop.name + ' ' + part.nosPart + ' stays on the parcel');
  }
  const here = laneCenter(plan);
  let near = 1e9;
  for (const p of plan.pumps) near = Math.min(near, Math.hypot(p.x - here.x, p.z - here.z));
  assert.ok(near <= plan.reach, shop.name + ' lane claims ' + near.toFixed(2));
  const far = { x: plan.mass.x0 + (plan.mass.x1 - plan.mass.x0) * 0.5, z: plan.mass.z0 + (plan.mass.z1 - plan.mass.z0) * 0.5 };
  let farD = 1e9;
  for (const p of plan.pumps) farD = Math.min(farD, Math.hypot(p.x - far.x, p.z - far.z));
  assert.ok(farD > plan.reach, shop.name + ' kiosk is not a pump ' + farD.toFixed(2));
  const span = Math.hypot(plan.pumps[0].x - plan.pumps[1].x, plan.pumps[0].z - plan.pumps[1].z);
  assert.ok(span >= 3.2, shop.name + ' islands leave a lane ' + span.toFixed(2));
}

const draw = fs.readFileSync(path.join(__dirname, '../world/city-draw.js'), 'utf8');
const station = fs.readFileSync(path.join(__dirname, '../world/nos-station.js'), 'utf8');
assert.ok(!/shadowBlur/.test(station), 'prefab has no shadowBlur');
const fn = draw.slice(draw.indexOf('function drawNosStation'), draw.indexOf('function drawBldgGLDeco'));
assert.ok(fn.includes('function drawNosStation'), 'draw exists');
assert.ok(!/shadowBlur/.test(fn), 'station draw has no shadowBlur');
assert.ok(draw.includes('if(b.nosStation)drawNosStation'), 'near path uses the station');

for (const page of ['world.html', 'world-split.html']) {
  const html = fs.readFileSync(path.join(__dirname, '..', page), 'utf8');
  const iNos = html.indexOf('world/nos-station.js?v=31');
  const iCity = html.indexOf('world/city.js?v=31');
  assert.ok(iNos > 0 && iCity > iNos, page + ' loads the prefab before city.js');
}
const kid = fs.readFileSync(path.join(__dirname, '../world.html'), 'utf8');
const split = fs.readFileSync(path.join(__dirname, '../world-split.html'), 'utf8');
assert.ok(!kid.includes('world/gl-city.js'), 'kid page does not load the gl prototype');
assert.ok(split.includes('world/gl-city.js?v=31'), 'split page still loads the gl prototype');
const ver = fs.readFileSync(path.join(__dirname, '../shared/version.js'), 'utf8');
assert.ok(/ZD_WORLD = '31'/.test(ver), 'cache world version is 31');

console.log('nos-station-check ok', SHOPS.map((s) => s.name).join(', '));
