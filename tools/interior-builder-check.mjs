/* Interior Builder: planner scale, door gaps, item solids, save and reload. */
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { rectPoly, wallRects, placeDoor } from '../test/planner/src/walls.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FT = 0.3048;

function memStore(seed) {
  const data = Object.assign({}, seed || {});
  return {
    getItem(k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
    setItem(k, v) { data[k] = String(v); },
    dump() { return Object.assign({}, data); }
  };
}

function boot(store) {
  const sandbox = {
    console, Math, JSON, Object, isFinite, parseInt, setTimeout, clearTimeout, Promise,
    location: { pathname: '/test/world.html', search: '' }
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.document = {
    body: null,
    head: { appendChild() {} },
    addEventListener() {},
    getElementById() { return null; },
    createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; }
  };
  sandbox.localStorage = store;
  sandbox.window.addEventListener = function () {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'test/world/interior-builder.js'), 'utf8'), sandbox);
  return sandbox;
}

const src = fs.readFileSync(path.join(root, 'test/world/interior-builder.js'), 'utf8');
const embed = fs.readFileSync(path.join(root, 'test/planner/src/embed.js'), 'utf8');
assert(!/\.shadowBlur/.test(src), 'interior builder does not set shadowBlur');
assert(src.includes('Exit to street') === false, 'exit label stays in the planner');
assert(embed.includes('Exit to street'), 'the planner shows Exit to street');
assert(embed.includes("setPhase('build')"), 'a new room opens in build mode');
assert(embed.includes("setPhase('place')"), 'a saved room opens ready to place objects');
assert(embed.includes('zd-interior-save'), 'a save tells the world');
assert(fs.readFileSync(path.join(root, 'test/planner/src/main.js'), 'utf8').includes('bootEmbed'), 'the planner boots the room embed');

const live = boot(memStore());
const IB = live.INTERIOR_BUILDER;
assert(IB, 'INTERIOR_BUILDER is on the page');
const fresh = IB.feetFor({ purpose: 'HOME', building: { purpose: 'HOME' } }, 'HOME');
assert.strictEqual(fresh.fw, 30, 'no saved style starts at the planner 30 ft width');
assert.strictEqual(fresh.fd, 40, 'no saved style starts at the planner 40 ft depth');
live.HOUSE_ROW = { pick: function () { return { look: { name: 'Glass loft', w: 24, d: 18 } }; } };
const sized = IB.feetFor({ purpose: 'HOME', building: { purpose: 'HOME' } }, 'HOME');
assert(Math.abs(sized.fw - 24 / FT) < 0.02, 'a current room width becomes feet');
assert(Math.abs(sized.fd - 18 / FT) < 0.02, 'a current room depth becomes feet');
assert.strictEqual(sized.title, 'Glass loft');
live.CITY = {
  BL: [
    { id: 19, oid: 16, kind: 'b', purpose: 'NOS', sign: { t: 'NOS', word: 'NOS' } },
    { id: 22, oid: 19, kind: 'b', purpose: 'HOME', sign: { t: 'HOME 1', word: 'HOME 1' }, tryHouse: 1 }
  ],
  OBJS: [{ id: 19, type: 'building', p: { purpose: 'HOME' } }]
};
const home1 = { id: 'b19', objId: 19, name: 'PLAYER HOUSE & GARAGE', purpose: 'HOME', x: 806, z: -723 };
assert.strictEqual(IB.canEnter(home1), true, 'HOME 1 offers Enter when another building uses that list slot');

const walls = [rectPoly(20, 10)];
const placed = placeDoor(walls, 0, 0, 10);
assert(placed.door, 'a door lands on the wall');
const solids = wallRects(walls).map(function (r) {
  return { kind: 'wall', name: 'Wall', x: r.x * FT, z: r.z * FT, a: r.a, w: r.w * FT, d: r.d * FT };
});
const gapX = 10 * FT, wallZ = 0;
assert(!solids.some(function (s) { return IB.hits(s, gapX, wallZ, 0.2); }), 'the door gap is open');
assert(solids.some(function (s) { return IB.hits(s, 2 * FT, wallZ, 0.2); }), 'the rest of the wall is solid');

const pack = {
  title: 'Glass loft',
  floor: { minX: 0, maxX: 20 * FT, minZ: 0, maxZ: 10 * FT, polys: [[[0, 0], [20 * FT, 0], [20 * FT, 10 * FT], [0, 10 * FT]]], rects: [] },
  walls: solids,
  items: [{ kind: 'item', name: 'Table', x: 5 * FT, z: 5 * FT, a: 0, w: 6 * FT, d: 2.5 * FT }]
};
IB.remember('HOME:7', '{"walls":[]}', pack);
assert(IB.blocks('HOME:7', 5 * FT, 5 * FT), 'the table is solid where it was placed');
assert(!IB.blocks('HOME:7', 5 * FT, 8 * FT), 'empty floor is open');
pack.items[0] = { kind: 'item', name: 'Table', x: 14 * FT, z: 5 * FT, a: 0, w: 6 * FT, d: 2.5 * FT };
IB.remember('HOME:7', '{"moved":1}', pack);
assert(IB.blocks('HOME:7', 14 * FT, 5 * FT), 'a moved table is solid at the new spot');
assert(!IB.blocks('HOME:7', 5 * FT, 5 * FT), 'the old spot is clear');

const dumped = live.localStorage.dump();
const again = boot(memStore(dumped));
assert(again.INTERIOR_BUILDER.blocks('HOME:7', 14 * FT, 5 * FT), 'reload keeps the table solid');
assert(!again.INTERIOR_BUILDER.blocks('HOME:7', 5 * FT, 5 * FT), 'reload leaves the old spot open');
pack.items[0] = { kind: 'item', name: 'Table', x: 5 * FT, z: 5 * FT, a: 0, w: 6 * FT, d: 2.5 * FT };
again.INTERIOR_BUILDER.remember('HOME:7', '{"undo":1}', pack);
assert(again.INTERIOR_BUILDER.blocks('HOME:7', 5 * FT, 5 * FT), 'undo puts the table back');
assert(!again.INTERIOR_BUILDER.blocks('HOME:7', 14 * FT, 5 * FT), 'undo clears the new spot');

again.walkRoomStep = function () { throw new Error('default walk should stay unused'); };
again.K = {};
again.WALK_MODE = {};
assert.strictEqual(again.INTERIOR_BUILDER.hook(), undefined);
const w = {
  insideDoor: { purpose: 'HOME', building: { oid: 7, purpose: 'HOME' } },
  room: { x: 12 * FT, z: 0.5, yaw: 0, _ib: 1, petX: 1, petZ: 1, tx: null, tz: null }
};
again.K.ArrowUp = 1;
again.walkRoomStep(w, 0.5);
assert.strictEqual(w.room.z, 0.5, 'walking into a wall does not pass through it');
again.K.ArrowUp = 0;
again.K.ArrowRight = 1;
const x0 = w.room.x;
again.walkRoomStep(w, 0.2);
assert(w.room.x > x0, 'walking along open floor moves');
again.K.ArrowRight = 0;
again.K.ArrowDown = 1;
const z0 = w.room.z;
again.walkRoomStep(w, 0.2);
assert(w.room.z > z0, 'walking away from the wall moves');

const plain = {
  insideDoor: { purpose: 'GARAGE', building: { oid: 3, purpose: 'GARAGE' } },
  room: { x: 1, z: 1 }
};
let usedDefault = 0;
again.walkRoomStep = function () { usedDefault++; };
again.INTERIOR_BUILDER.hook();
again.walkRoomStep(plain, 0.16);
assert.strictEqual(usedDefault, 1, 'a room without a saved layout keeps the current interior');

const ranked = IB.exploreOf({ purpose: 'HOME', building: { oid: 19, purpose: 'HOME', sign: { t: 'HOME 1' } } });
assert.strictEqual(ranked.purpose, 'HOME');
assert.strictEqual(ranked.n, 1, 'HOME 1 is an explore door');
assert.strictEqual(IB.exploreOf({ purpose: 'GARAGE', building: { oid: 3, purpose: 'GARAGE' } }), null, 'a garage is not this enter button');

live.P = { x: 1, z: 1, y: 0.2, yaw: 0.3, v: 2 };
const shoved = IB.parkSpot({
  x: 0, z: 0, nx: 0, nz: -1,
  building: { x0: -2, x1: 2, z0: -2, z1: 2 }
});
assert(shoved.z < -2 || shoved.x < -2 || shoved.x > 2, 'a car in the doorway is parked outside');
assert(Math.hypot(shoved.x, shoved.z) > 2.4, 'the parked car is clear of the door');
live.P = { x: 10, z: -8, y: 0, yaw: 0.4, v: 0 };
const stayed = IB.parkSpot({
  x: 0, z: 0, nx: 0, nz: -1,
  building: { x0: -2, x1: 2, z0: -2, z1: 2 }
});
assert.strictEqual(stayed.x, 10, 'a car already outside stays parked');
assert.strictEqual(stayed.z, -8, 'a car already outside keeps its spot');

const doorLayout = JSON.stringify({
  walls: [{ pts: [[0, 0], [20, 0], [20, 10], [0, 10]], closed: true, doors: [{ i: 0, t: 10 }] }]
});
const exitPack = {
  title: 'HOME 1',
  floor: pack.floor,
  walls: solids,
  items: []
};
again.INTERIOR_BUILDER.remember('HOME:9', doorLayout, exitPack);
const savedDoors = again.INTERIOR_BUILDER.pack('HOME:9').doors;
assert(savedDoors && savedDoors.length === 1, 'the saved door is kept');
assert(again.INTERIOR_BUILDER.nearDoor(again.INTERIOR_BUILDER.pack('HOME:9'), 10 * FT, 0.4), 'the gap is the exit');
assert(!again.INTERIOR_BUILDER.nearDoor(again.INTERIOR_BUILDER.pack('HOME:9'), 10 * FT, 4), 'the middle of the room is not the exit');
again.P = { x: 3, z: 4, y: 1, yaw: 0.2, v: 5, hd: 0.2 };
again.K = { ArrowUp: 1 };
const leaving = {
  insideDoor: { purpose: 'HOME', building: { oid: 9, purpose: 'HOME' } },
  insideBuilding: true,
  onFoot: true,
  room: { x: 10 * FT, z: 0.5, yaw: 0, _ib: 1, petX: 1, petZ: 1, tx: null, tz: null },
  _ibCar: { x: 8, z: -4, y: 0, yaw: 1.2 }
};
again.walkRoomStep(leaving, 0.5);
assert.strictEqual(leaving.onFoot, false, 'walking out the door puts Bob back at the car');
assert.strictEqual(leaving.insideBuilding, false, 'the room closes on the way out');
assert.strictEqual(again.P.x, 8, 'the car is where it was parked');
assert.strictEqual(again.P.z, -4, 'exit returns to the parked car');
assert.strictEqual(again.P.v, 0, 'the parked car is stopped');

console.log('interior builder checks passed');
console.log('door gap open at ' + gapX.toFixed(2) + ' m, table reload kept');
