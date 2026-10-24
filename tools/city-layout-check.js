'use strict';
// Headless check for Option 1: places, doors, lanes, resume API, minimap export.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const g = {
  console, Math, JSON, Object, Array, Number, String, Error, parseInt, isFinite,
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  D: Math.PI / 180,
  TUNE: { skimDeg: 25, skimSpeed: 8, offRoad: 0.6 }
};
g.globalThis = g;
g.window = g;
vm.createContext(g);
const src = ['world/towtruck.js','world/nos-station.js','world/city-layout.js','world/city.js','world/resume-safe.js','shared/traffic-tune.js']
  .map(rel => fs.readFileSync(path.join(root, rel), 'utf8')).join('\n');
vm.runInContext(src + '\nglobalThis.__CITY=CITY;globalThis.__RESUME=ZD_RESUME;globalThis.__TUNE=TRAFFIC_TUNE;\n', g, { filename: 'city-bundle.js' });

const C = g.__CITY;
const L = C.LAYOUT;
const M = L.minimap;
const fail = [];
function expect(cond, msg) { if (!cond) fail.push(msg); }

expect(L && L.id === 'option1-boulevards', 'layout id');
expect(M && M.roads && M.roads.length > 10, 'minimap roads');
expect(M.river && M.river.z0 === 1780 && M.river.z1 === 1840, 'minimap river');
expect(M.bridges && M.bridges.length === 2, 'minimap bridges');
expect(M.districts && M.districts.length >= 8, 'minimap districts');
expect(M.places && M.places.length >= 30, 'minimap places ' + (M.places && M.places.length));
const typed = M.places.filter(p => p.type && Number.isFinite(p.cx) && Number.isFinite(p.cz) && Number.isFinite(p.x0));
expect(typed.length === M.places.length, 'every place has type and position');
const purposes = {};
for (const p of M.places) purposes[p.purpose || p.type] = (purposes[p.purpose || p.type] || 0) + 1;
for (const name of ['HOME', 'PETS', 'SHOWROOM', 'NEON_PAINT', 'DANCE', 'CAFE', 'ARCADE', 'BUILDER', 'SOCCER']) {
  const n = M.places.filter(p => p.purpose === name).length;
  expect(n === 1, name + ' count ' + n);
}
expect(M.places.filter(p => p.purpose === 'NOS').length >= 5, 'NOS in each district');
expect(M.places.filter(p => p.type === 'arch').length === 5, 'five arches');
const ed = L.editor;
expect(ed && ed.places.length === M.places.length && ed.roads.length === M.roads.length, 'editor places and roads');
expect(ed.nos && ed.nos.length >= 5 && ed.nos.every(n => n.pumps && n.pumps.length), 'editor NOS pumps');
expect(ed.spawns && ed.spawns.length > 40 && ed.spawns.every(s => Number.isFinite(s.x) && Number.isFinite(s.z)), 'editor spawns');
const again = C.editorDoc();
expect(again.nos.length === ed.nos.length && again.spawns.length === ed.spawns.length, 'editorDoc copy');
const raw = JSON.stringify(ed);
const copy = JSON.parse(raw);
expect(raw.indexOf('function') < 0 && copy.bounds && copy.bounds.x0 === -1600 && copy.districts.length === 8, 'editor JSON copy');
expect(copy.pages && copy.pages[0] === 'world.html' && copy.pages[1] === 'world-split.html', 'editor names both kid pages');
expect(copy.anchors && copy.anchors.river.z0 === 1780 && copy.trailerPad && copy.trailerPad.x0 === -280, 'editor anchors');
expect(typeof C.districts === 'function' && C.districts().length === M.districts.length, 'districts()');
expect(typeof C.nodes === 'function' && C.nodes().length > 10, 'nodes()');
expect(typeof C.mapStamp === 'function' && C.mapStamp(), 'mapStamp');
expect(C.spotClear(0, 0, 0) === true, 'runway clear');
expect(C.spotClear(0, 400, 0) === true, 'runway mid clear');

const nos = C.BL.filter(b => b.purpose === 'NOS' && b.nosStation);
expect(nos.length >= 5, 'fitted NOS stations ' + nos.length);
expect(nos.some(b => b.nosStation.kind === 'depot'), 'one depot');
expect(nos.filter(b => b.nosStation.kind === 'station').length >= 4, 'drive-up stations');

function laneDist(x, z) {
  let best = 1e9;
  for (const r of L.roads) {
    const hw = (r.w || 20) / 2 + 16;
    if (Math.abs(r.x0 - r.x1) < 1.5) {
      const z0 = Math.min(r.z0, r.z1), z1 = Math.max(r.z0, r.z1);
      if (z < z0 - 16 || z > z1 + 16) continue;
      const zz = Math.max(z0, Math.min(z1, z));
      best = Math.min(best, Math.hypot(x - r.x0, z - zz));
    } else if (Math.abs(r.z0 - r.z1) < 1.5) {
      const x0 = Math.min(r.x0, r.x1), x1 = Math.max(r.x0, r.x1);
      if (x < x0 - 16 || x > x1 + 16) continue;
      const xx = Math.max(x0, Math.min(x1, x));
      best = Math.min(best, Math.hypot(x - xx, z - r.z0));
    }
    void hw;
  }
  return best;
}
let farDoor = 0;
for (const b of C.BL) {
  if (!b.purpose || (b.kind !== 'b' && b.kind !== 'landmark')) continue;
  const doors = b.doors || [];
  if (!doors.length) { farDoor++; continue; }
  let near = 1e9;
  for (const d of doors) near = Math.min(near, laneDist(d[0], d[1]));
  if (near > 22) farDoor++;
}
expect(farDoor === 0, 'doors farther than 22 m: ' + farDoor);

let runway = 0, bridge = 0, samples = 0;
for (const e of C.ROADS.edges) {
  if (!e || !e.lanes) continue;
  if (e.kind === 'bridge') bridge++;
  for (const lane of e.lanes) {
    const A = C.ROADS.nodes[lane.from], B = C.ROADS.nodes[lane.to];
    const x = (A.x + B.x) / 2 + lane.off[0], z = (A.z + B.z) / 2 + lane.off[1];
    samples++;
    if (Math.abs(x) < 20 && z > -80 && z < 1520) runway++;
  }
}
expect(samples > 40, 'lane samples ' + samples);
expect(runway === 0, 'lane samples on runway ' + runway);
expect(bridge > 0, 'bridge edges ' + bridge);
expect(g.__TUNE.simCap + g.__TUNE.dotCap === 30, '30 cars');

const grass = C.surfaceAt(-800, 400);
const road = C.surfaceAt(-990, 0);
const water = C.surfaceAt(200, 1810);
const deck = C.surfaceAt(0, 1810);
expect(grass === 'grass', 'open land ' + grass);
expect(road === 'paved', 'boulevard ' + road);
expect(water === 'water', 'river ' + water);
expect(deck === 'paved', 'bridge deck ' + deck);

const bagBlocked = { v: 1, map: 'old-map', pose: { x: -250, y: 0, z: -740, anchor: { district: 'NOWHERE' } }, challenges: [{ id: 'hot', tLeft: 10 }] };
const bad = g.__RESUME.resolve(bagBlocked);
expect(bad.how === 'runway' && bad.x === 0 && bad.z === 0 && bad.kept === false, 'blocked save -> runway ' + JSON.stringify(bad));
expect(C.spotClear(-250, -740, 0) === false, 'garage footprint blocked');
const stamp = C.mapStamp();
const bagOk = { v: 1, map: stamp, pose: { x: -990, y: 0, z: 200 } };
const ok = g.__RESUME.resolve(bagOk);
expect(ok.kept === true && ok.how === 'exact' && Math.abs(ok.x + 990) < 0.1, 'clear save kept ' + JSON.stringify(ok));

const out = {
  places: M.places.length,
  roads: M.roads.length,
  districts: M.districts.length,
  bridges: M.bridges.length,
  nos: nos.map(b => b.nosStation.kind + '@' + Math.round(b.cx) + ',' + Math.round(b.cz)),
  lanes: samples,
  bridgeEdges: bridge,
  runwayLaneSamples: runway,
  cars: g.__TUNE.simCap + g.__TUNE.dotCap,
  editor: { places: ed.places.length, roads: ed.roads.length, nos: ed.nos.length, spawns: ed.spawns.length },
  stamp,
  fail
};
console.log(JSON.stringify(out, null, 2));
if (fail.length) process.exit(1);
