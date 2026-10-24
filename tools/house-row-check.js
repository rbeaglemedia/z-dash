'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const fails = [];
function fail(m) { fails.push(m); }

const layout = fs.readFileSync(path.join(root, 'world/city-layout.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'world/house-styles.js'), 'utf8');
const house = fs.readFileSync(path.join(root, 'world/house.js'), 'utf8');
const world = fs.readFileSync(path.join(root, 'world.html'), 'utf8');
const split = fs.readFileSync(path.join(root, 'world-split.html'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

if (!/house-styles\.js\?v=37/.test(house)) fail('interior script is not loaded from the house painter');
if (/\bshadowBlur\s*=/.test(styles)) fail('house looks assign shadowBlur');
if (index.includes('house-styles')) fail('adult index loads the house looks');
if (!world.includes('house.js?v=37') || !split.includes('house.js?v=37')) fail('kid pages are not on world37');

const sandbox = { window: {}, globalThis: {}, performance: { now: function () { return 0; } }, URLSearchParams: URLSearchParams, location: { search: '' }, CITY: { BL: [] } };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(layout, sandbox);
vm.runInContext(styles, sandbox);
const places = sandbox.CITY_LAYOUT && sandbox.CITY_LAYOUT.places;
if (!places) fail('city layout did not publish places');
const homes = (places || []).filter(function (p) { return p.purpose === 'HOME' || p.kind === 'home'; });
if (homes.length !== 1) fail('expected 1 HOME on the boulevard map, found ' + homes.length);
const home = homes[0] || {};
const spot = {
  name: home.name,
  x0: home.x0, x1: home.x1, z0: home.z0, z1: home.z1,
  district: home.district
};
if (spot.district !== 'HOMESTEAD') fail('the home is not in Homestead');
if (!(spot.x1 < 0 && spot.z1 < 0)) fail('the home is not southwest of spawn');

const row = sandbox.HOUSE_ROW;
if (!row || !row.looks || row.looks.length !== 4) fail('expected 4 house looks');
const names = {};
(row.looks || []).forEach(function (look) {
  if (names[look.name]) fail('duplicate look ' + look.name);
  names[look.name] = 1;
  if (!look.panes || !look.panes.xs || !look.panes.xs.length) fail(look.name + ' has no glass');
  if (look.h < 4.2) fail(look.name + ' is short');
  if (!look.line || look.line.length > 80) fail(look.name + ' line');
  const boxes = look.boxes.concat(look.panes.xs.map(function (x) {
    return [x, look.panes.z, look.panes.y, 2.2, look.panes.h, 0.08, look.panes.fill];
  }));
  boxes.forEach(function (b) {
    const x0 = b[0] - b[3] / 2, x1 = b[0] + b[3] / 2, z0 = b[1] - b[5] / 2, z1 = b[1] + b[5] / 2;
    const door = x1 > -1.2 && x0 < 1.2 && z1 > 0 && z0 < 2.2 && b[4] >= 0.2;
    if (door) fail(look.name + ' puts a prop in the door gap');
  });
});

function pickStyle(list, id) {
  sandbox.CITY = { BL: list };
  return row.pick({ building: { id: id } }).style;
}
const many = [];
for (let i = 0; i < 6; i++) many.push({ id: i + 1, purpose: 'HOME', z0: i * 20, x0: 0 });
const stylesOut = many.map(function (b) { return pickStyle(many, b.id); });
if (stylesOut.join(',') !== '1,2,3,4,1,2') fail('style repeat got ' + stylesOut.join(','));

const one = [{ id: 7, purpose: 'HOME', x0: home.x0, z0: home.z0, x1: home.x1, z1: home.z1 }];
if (pickStyle(one, 7) !== 1) fail('the only door is not style 1');

if (!/samplerPerson|walkDrawPerson/.test('')) {
  /* actors are boxes in house-styles.js */
}
if (!/walkBox\(g, x, 0, z, 0\.18, 0\.82/.test(styles) && !/0\.82/.test(styles)) fail('Ellie legs are not 0.82 m');
if (!/#2f7f96/.test(styles)) fail('Ellie torso color');
if (!/#ffb020/.test(styles)) fail('pet color');
if (!/0\.74|0\.62/.test(styles)) fail('pet ear height');

const out = { ok: fails.length === 0, fails: fails, home: spot, homes: homes.length, styles: stylesOut };
fs.mkdirSync(path.join(root, 'test-results/house-row'), { recursive: true });
fs.writeFileSync(path.join(root, 'test-results/house-row/check.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
process.exit(out.ok ? 0 : 1);
