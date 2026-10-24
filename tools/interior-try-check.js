'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const fails = [];
function fail(m) { fails.push(m); }

const src = fs.readFileSync(path.join(root, 'world/interior-try.js'), 'utf8');
const house = fs.readFileSync(path.join(root, 'world/house.js'), 'utf8');
const page = fs.readFileSync(path.join(root, 'test/interior-try.html'), 'utf8');
const version = fs.readFileSync(path.join(root, 'shared/version.js'), 'utf8');

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
if (!/interior-try\.js\?v=38/.test(house)) fail('try script is not injected at world38');
if (!/function interiorTryOn\(/.test(house)) fail('try flag helper missing');
if (!/interiorTryOn\(\)&&purpose!=='HOME'/.test(house)) fail('single rooms are not gated on the try flag');
if (!/INTERIOR_TRY_HOUSE=0/.test(house)) fail('a real door does not clear the house hold');
if (!version.includes("ZD_WORLD = '38'")) fail('world cache is not 38');
if (!page.includes('world.html?interiorTry=1')) fail('test page does not open the try walk');
if (!/noindex/.test(page)) fail('test page is indexable');

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
if (single.join(',') !== 'CAFE,ARCADE,PETS,SOCCER,BUILDER') fail('single rooms ' + single.join(','));
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
if (api && !api.has('CAFE')) fail('cafe missing');

const out = { ok: fails.length === 0, fails: fails, rooms: Object.keys(expect).length, looks: 20 };
fs.mkdirSync(path.join(root, 'test-results/interior-try'), { recursive: true });
fs.writeFileSync(path.join(root, 'test-results/interior-try/check.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
process.exit(out.ok ? 0 : 1);
