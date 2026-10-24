#!/usr/bin/env node
'use strict';
// Drives the picked traffic rows on a tiny cross, without a browser.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sandbox = {
  console,
  location: {search: ''},
  P: {x: 5000, z: 5000, y: 0, yaw: 0, v: 0},
  cam: {x: 0, y: 8, z: -12, yaw: 0}
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.CITY = {
  TOWS: [],
  RAMPS: [],
  BL: [],
  probe() { return {fl: 0, wl: null}; },
  ROADS: null
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'shared/traffic-tune.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'world/traffic.js'), 'utf8'), sandbox);

function edge(id, ax, az, bx, bz, w, kind) {
  const len = Math.hypot(bx - ax, bz - az);
  const ux = (bx - ax) / len, uz = (bz - az) / len, o = w / 4;
  return {
    id, a: 0, b: 1, len, w, kind, blockedBy: [],
    lanes: [
      {off: [uz * o, -ux * o]},
      {off: [-uz * o, ux * o]}
    ],
    _ax: ax, _az: az, _bx: bx, _bz: bz
  };
}

function load(edges) {
  const nodes = [];
  const list = edges.map((e, i) => {
    const a = nodes.length;
    nodes.push({id: a, x: e._ax, z: e._az});
    const b = nodes.length;
    nodes.push({id: b, x: e._bx, z: e._bz});
    e.a = a; e.b = b; e.id = i;
    return e;
  });
  sandbox.CITY.ROADS = {nodes, edges: list, laneW: 3.4};
  sandbox.TRAFFIC.ensure();
}

function fail(msg) { console.error('FAIL', msg); process.exitCode = 1; }
function ok(msg) { console.log('ok', msg); }

const T = sandbox.TRAFFIC_TUNE;
if (T.simCap !== 12 || T.dotCap !== 18) fail('car count is not 12 + 18');
else ok('30 cars reserved');
if (T.hopLane !== 0) fail('mid-block lane change is still on');
else ok('no mid-block lane change');
if (T.speedMin !== 10 || T.speedMax !== 15 || T.fastMin !== 16 || T.fastMax !== 20) fail('speed bands');
else ok('town 10-15, fast 16-20');

load([
  edge(0, 200, -80, 200, 220, 20, 'street'),
  edge(1, 80, 40, 320, 40, 20, 'street'),
  edge(2, 500, 0, 500, 300, 30, 'highway')
]);
const lanes = sandbox.TRAFFIC.lanes;
const street = lanes.filter(L => L.kind === 'street' && L.turns.length);
const highway = lanes.find(L => L.kind === 'highway');
if (!street.length || !highway) fail('cross or highway lane missing');
else ok('lanes follow the road graph (' + lanes.length + ' lanes, ' + street[0].turns.length + ' turns on the first)');

const cars = sandbox.TRAFFIC.cars;
if (cars.filter(c => c.sim).length !== 12 || cars.filter(c => !c.sim).length !== 18) fail('spawn lists');
else ok('12 simulated + 18 dots');

function arm(c, lane, s, v) {
  c.on = true; c.lane = lane; c.s = s; c.v = v; c.v0 = v; c.yaw = lane.yaw;
  c.turn = null; c.arc = null; c.blend = 0; c.hit = false; c.hop = null; c.ground = true; c.y = 0;
  const p = lane.at(s); c.x = p[0]; c.z = p[1];
}
T.recycle = 5000;
function parkRest(keep, lane, s0) {
  let i = 0;
  for (const c of cars) {
    if (keep.indexOf(c) !== -1) continue;
    const s = Math.min(lane.len - 2, s0 + i * 5);
    arm(c, lane, s, 0);
    c.v = 0; c.v0 = 0;
    i++;
  }
}

const leadLane = street[0];
const crossS = leadLane.turns[0].s;
const at = leadLane.at(crossS);
const stopper = cars.find(c => c.sim);
const blocker = cars.filter(c => c.sim)[1];
arm(stopper, leadLane, Math.max(2, crossS - 16), 12);
arm(blocker, leadLane, Math.min(leadLane.len - 1, crossS), 0);
blocker.v = 0; blocker.v0 = 0;
parkRest([stopper, blocker], highway, 200);
sandbox.P.x = at[0] + 70; sandbox.P.z = at[1]; sandbox.P.v = 0; sandbox.P.y = 0;
for (let i = 0; i < 90; i++) sandbox.TRAFFIC.update(1 / 30);
if (stopper.s > crossS - (T.crossBox || 6) - T.carL * 0.5 + 1.2) fail('car entered a busy crossing (s=' + stopper.s.toFixed(1) + ' cross=' + crossS.toFixed(1) + ')');
else if (stopper.v > 0.6) fail('busy crossing did not stop the car (v=' + stopper.v.toFixed(2) + ')');
else ok('busy crossing holds the bumper (v=' + stopper.v.toFixed(2) + ')');

const roller = stopper;
arm(roller, leadLane, Math.max(2, crossS - 22), 12);
arm(blocker, highway, 12, 0); blocker.v = 0; blocker.v0 = 0;
parkRest([roller], highway, 200);
sandbox.P.x = at[0] + 80; sandbox.P.z = at[1]; sandbox.P.v = 12;
let minRoll = 99;
for (let i = 0; i < 70; i++) {
  sandbox.TRAFFIC.update(1 / 30);
  if (roller.s < crossS - (T.crossBox || 6)) minRoll = Math.min(minRoll, roller.v);
}
if (minRoll > 5.2) fail('empty crossing did not ease off (min v=' + minRoll.toFixed(2) + ')');
else if (roller.s < crossS - 18) fail('empty crossing froze the car');
else ok('empty crossing rolls (min v=' + minRoll.toFixed(2) + ', now ' + roller.v.toFixed(2) + ')');

const yielder = roller;
const yaw = leadLane.yaw;
const backS = Math.max(4, crossS - 70);
const p0 = leadLane.at(backS);
arm(yielder, leadLane, backS, 14);
parkRest([yielder], highway, 200);
const ahead = 14;
sandbox.P.x = p0[0] + Math.sin(yaw) * ahead;
sandbox.P.z = p0[1] + Math.cos(yaw) * ahead;
sandbox.P.y = 0; sandbox.P.yaw = yaw; sandbox.P.v = 0; sandbox.P.hd = yaw;
const px = sandbox.P.x, pz = sandbox.P.z, pv = sandbox.P.v;
for (let i = 0; i < 60; i++) sandbox.TRAFFIC.update(1 / 30);
if (Math.abs(sandbox.P.x - px) > 0.01 || Math.abs(sandbox.P.z - pz) > 0.01 || sandbox.P.v !== pv) fail('his Z was moved');
else if (yielder.v > 1.2) fail('traffic did not yield (v=' + yielder.v.toFixed(2) + ')');
else ok('yields to his Z and leaves him put (v=' + yielder.v.toFixed(2) + ')');

const fast = yielder;
arm(fast, highway, 220, 10);
fast.v0 = 18;
parkRest([fast], leadLane, 8);
sandbox.P.x = highway.at(220)[0] + 40; sandbox.P.z = highway.at(220)[1]; sandbox.P.v = 18;
for (let i = 0; i < 50; i++) sandbox.TRAFFIC.update(1 / 20);
if (fast.v < 16 || fast.v > 20.2) fail('highway cruise out of band (v=' + fast.v.toFixed(2) + ')');
else ok('highway holds ' + fast.v.toFixed(2) + ' m/s');

const townLane = lanes.find(L => L.kind === 'street' && !L.turns.length) || leadLane;
const town = fast;
const townS = townLane.turns.length ? 4 : Math.min(20, townLane.len * 0.3);
arm(town, townLane, townS, 8);
town.v0 = 12; town.turn = null;
parkRest([town], highway, 200);
sandbox.P.x = town.x + 40; sandbox.P.z = town.z; sandbox.P.v = 12;
for (let i = 0; i < 40; i++) sandbox.TRAFFIC.update(1 / 20);
if (town.v < 10 || town.v > 15.2) fail('town cruise out of band (v=' + town.v.toFixed(2) + ' s=' + town.s.toFixed(1) + ')');
else ok('town holds ' + town.v.toFixed(2) + ' m/s');

sandbox.CITY.BL = [{purpose:'NOS', nosStation:{lane:{x0:198, x1:212, z0:150, z1:168}}}];
const apronCar = town;
const apronS = 214;
arm(apronCar, leadLane, apronS, 12);
const occupant = cars.filter(c => c.sim)[1];
arm(occupant, leadLane, 232, 0);
occupant.v = 0; occupant.v0 = 0;
parkRest([apronCar, occupant], highway, 200);
sandbox.P.x = 280; sandbox.P.z = 140; sandbox.P.v = 0;
for (let i = 0; i < 80; i++) sandbox.TRAFFIC.update(1 / 30);
if (apronCar.z > 149) fail('entered a busy NOS apron (z=' + apronCar.z.toFixed(1) + ')');
else if (apronCar.v > 0.6) fail('did not stop for the NOS apron (v=' + apronCar.v.toFixed(2) + ')');
else ok('stops short of a busy NOS apron');

if (!process.exitCode) console.log('traffic rules check passed');
