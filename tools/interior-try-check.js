'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const fails = [];
function fail(m) { fails.push(m); }

const src = fs.readFileSync(path.join(root, 'world/interior-try.js'), 'utf8');
const mapSrc = fs.readFileSync(path.join(root, 'world/interior-try-map.js'), 'utf8');
const house = fs.readFileSync(path.join(root, 'world/house.js'), 'utf8');
const version = fs.readFileSync(path.join(root, 'shared/version.js'), 'utf8');
const world = fs.readFileSync(path.join(root, 'world.html'), 'utf8');
const layout = fs.readFileSync(path.join(root, 'world/city-layout.js'), 'utf8');

const expect = {
  CAFE: ['Beach shack', 'Wood bakery', 'Pop diner', 'Night counter'],
  ARCADE: ['Retro lane', 'Pop hall', 'Space pit', 'Block arcade'],
  PETS: ['Garden yard', 'Cabin den', 'Aqua bay', 'Block park'],
  SOCCER: ['Shop pitch', 'Beach pitch', 'Cup night', 'Block field'],
  BUILDER: ['Glass studio', 'Space lab', 'Wood workshop', 'Sky office']
};

if (/\bshadowBlur\s*=/.test(src)) fail('try looks assign shadowBlur');
['zdash.house.v1', 'zdash.kid.v1', 'zdash.sampler.likes.v1', 'zdash.ellie.builder.v1'].forEach(function (key) {
  if (src.includes(key)) fail('try script names ' + key);
});
if (!src.includes('zdash.interior.try.v1')) fail('save key missing');
if (!/#243044/.test(src) || !/#2f7f96/.test(src) || !/#f0c8a8/.test(src) || !/#ffb020/.test(src)) fail('actor colors');
if (!/0\.82/.test(src) || !/0\.74|0\.62/.test(src)) fail('actor heights');
if (!/interior-try\.js\?v=40/.test(house)) fail('try script is not injected at world40');
if (!/function interiorTryOn\(/.test(house)) fail('try flag helper missing');
if (!/interiorTryOn\(\)&&purpose!=='HOME'/.test(house)) fail('single rooms are not gated on the try flag');
if (!/INTERIOR_TRY_HOUSE=0/.test(house)) fail('a real door does not clear the house hold');
if (!version.includes("ZD_WORLD = '41'")) fail('world cache is not 41');
if (!/interiorTry/.test(house)) fail('try flag missing from the house painter');
if (!/noindex/.test(world)) fail('kid page is indexable');
if (!world.includes('interior-try-map.js?v=40')) fail('kid page does not load the try map');
if (world.indexOf('interior-try-map.js') > world.indexOf('city.js?v=40')) fail('try map loads after the city');
if (/\bshadowBlur\s*=/.test(mapSrc)) fail('cafe map assigns shadowBlur');
if (mapSrc.includes('zdash.house.v1') || mapSrc.includes('zdash.kid.v1')) fail('cafe map names a save');

const sandbox = {
  window: {},
  globalThis: {},
  performance: { now: function () { return 0; } },
  URLSearchParams: URLSearchParams,
  location: { search: '?interiorTry=1' },
  sessionStorage: { getItem: function () { return ''; }, setItem: function () {} },
  walkBox: function () {},
  walkQuad: function () {},
  walkCam: function () { return [0, 0, 1]; }
};
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const api = sandbox.INTERIOR_TRY;
if (!api) fail('INTERIOR_TRY missing');
if (api && api.saveKey !== 'zdash.interior.try.v1') fail('saveKey ' + (api && api.saveKey));
const single = (api && api.single) || [];
if (single.join(',') !== 'ARCADE,PETS,SOCCER,BUILDER') fail('single rooms ' + single.join(','));
Object.keys(expect).forEach(function (id) {
  const room = api && api.rooms && api.rooms[id];
  if (!room || !room.looks || room.looks.length !== 4) { fail(id + ' look count'); return; }
  room.looks.forEach(function (look, i) {
    if (look.name !== expect[id][i]) fail(id + ' style ' + (i + 1) + ' name ' + look.name);
    if (!look.panes || !look.panes.xs || !look.panes.xs.length) fail(look.name + ' has no glass');
    if (!look.boxes || !look.boxes.length) fail(look.name + ' has no boxes');
    if (look.h < 4.2) fail(look.name + ' is short');
  });
});
if (api && api.has('HOME')) fail('houses are not a switcher room');
if (api && api.has('CAFE')) fail('cafe is not a switcher room');
if (!api || !api.rooms || !api.rooms.CAFE) fail('cafe looks missing');

const layBox = { window: {}, globalThis: {}, URLSearchParams: URLSearchParams, location: { search: '' } };
layBox.globalThis = layBox;
layBox.window = layBox;
vm.createContext(layBox);
vm.runInContext(layout, layBox);
const before = layBox.CITY_LAYOUT.places.length;
vm.runInContext(mapSrc, layBox);
if (layBox.CITY_LAYOUT.places.length !== before) fail('try map adds doors without the try flag');
layBox.__INTERIOR_TRY_MAP = 1;
vm.runInContext(mapSrc, layBox);
if (layBox.CITY_LAYOUT.places.length !== before) fail('try map still adds a second row');
const places = layBox.CITY_LAYOUT.places;
const homes = places.filter(function (p) { return p.purpose === 'HOME'; });
const cafes = places.filter(function (p) { return p.district === 'BUILDER_BAY' && p.purpose === 'CAFE'; }).sort(function (a, b) { return a.z0 - b.z0; });
const bayHomes = homes.filter(function (p) { return p.district === 'BUILDER_BAY'; }).sort(function (a, b) { return a.z0 - b.z0; });
const live = homes.filter(function (p) { return p.district === 'HOMESTEAD'; })[0];
const district = layBox.CITY_LAYOUT.districts.filter(function (d) { return d.id === 'HOMESTEAD'; })[0];
if (!district || district.z1 !== -560) fail('Homestead district moved');
if (!live || live.sign !== 'HOME' || live.tryHouse || live.x0 !== -274 || live.z0 !== -678) fail('the homestead house moved');
if (bayHomes.length !== 4) fail('expected 4 southeast houses, found ' + bayHomes.length);
if (cafes.length !== 4) fail('expected 4 southeast cafes, found ' + cafes.length);
function clearOfPavement(p) {
  if (p.x1 > 830 && p.x0 < 850) fail(p.name + ' covers the southeast pavement');
  if (p.x1 > 948) fail(p.name + ' reaches the east lane');
  if (p.z0 < -750 || p.z1 > -138) fail(p.name + ' meets a cross street');
}
bayHomes.forEach(function (p, i) {
  const n = i + 1;
  if (p.tryHouse !== n || p.sign !== 'HOME ' + n) fail(p.name + ' sign');
  if (p.x0 !== 786 || p.x1 !== 826 || p.h !== 11 || p.roof !== 'ant') fail(p.name + ' plan');
  if (p.tryOnly) fail(p.name + ' is still try-only');
  clearOfPavement(p);
  const cafe = cafes[i];
  if (!cafe || cafe.z0 !== p.z0 || cafe.z1 !== p.z1) fail(p.name + ' has no cafe across the street');
});
cafes.forEach(function (p, i) {
  if (p.tryCafe !== i + 1 || p.sign !== 'CAFE ' + (i + 1)) fail(p.name + ' sign');
  if (p.x0 !== 854 || p.x1 !== 894 || p.h !== 12 || p.roof !== 'ant') fail(p.name + ' plan');
  if (p.tryOnly) fail(p.name + ' is still try-only');
  clearOfPavement(p);
});
const net = layBox.CITY_LAYOUT.buildNetwork();
bayHomes.forEach(function (p) {
  const face = net.faces[p.station + ':' + p.name];
  if (face !== 'e') fail(p.name + ' faces ' + face);
});
cafes.forEach(function (p) {
  const face = net.faces[p.station + ':' + p.name];
  if (face !== 'w') fail(p.name + ' faces ' + face);
});
if (net.faces['yard:HOME'] !== 'e') fail('homestead HOME faces ' + net.faces['yard:HOME']);
const spine = net.roads.filter(function (r) { return Math.abs(r.x0 - 840) < 0.1 && Math.abs(r.x1 - 840) < 0.1; });
if (!spine.some(function (r) { return Math.min(r.z0, r.z1) <= -740 && Math.max(r.z0, r.z1) >= -584; })) fail('southeast street is cut through the row');
const city = fs.readFileSync(path.join(root, 'world/city.js'), 'utf8');
if (!/built\.tryOnly=1/.test(city)) fail('the city does not keep the try-only mark');
if (!/b\.tryOnly/.test(city)) fail('try-only houses still cut a garage');

const out = { ok: fails.length === 0, fails: fails, rooms: Object.keys(expect).length, looks: 20 };
fs.mkdirSync(path.join(root, 'test-results/interior-try'), { recursive: true });
fs.writeFileSync(path.join(root, 'test-results/interior-try/check.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
process.exit(out.ok ? 0 : 1);
