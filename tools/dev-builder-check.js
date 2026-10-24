/* Guards for DEV Builder M2 and the shared Q2 tools. No browser, no city file. */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const toolsPath = path.join(__dirname, '..', 'world', 'planner-tools.js');
const builderPath = path.join(__dirname, '..', 'world', 'dev-builder.js');
const ctx = { window: {}, console: console };
ctx.global = ctx.window;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(toolsPath, 'utf8'), ctx);
const T = ctx.window.PLANNER_TOOLS;
assert(T, 'PLANNER_TOOLS missing');

const base = {
  v: 1,
  highwayX: -450,
  spawns: [{ id: 'player', x: 0, z: 0 }, { id: 'skydrop', x: 180, z: 520 }],
  roads: [
    { id: 'highway:1', x0: -450, z0: 0, x1: -450, z1: 100, kind: 'highway', locked: true },
    { id: 'street:1', x0: 150, z0: 0, x1: 150, z1: 100, kind: 'street', locked: false }
  ],
  buildings: [
    { id: 'b1', name: 'HOME', x0: 10, x1: 30, z0: 10, z1: 30 }
  ]
};

function copy() { return JSON.parse(JSON.stringify(base)); }

assert.deepStrictEqual(Array.from(T.guardM2(base, copy())), []);

const movedSpawn = copy();
movedSpawn.spawns[0].x = 5;
assert(T.guardM2(base, movedSpawn).some((e) => e.indexOf('player') >= 0), 'spawn lock');

const movedHw = copy();
movedHw.roads[0].x0 = -440;
assert(T.guardM2(base, movedHw).some((e) => e.indexOf('Locked road') >= 0), 'highway lock');

const parallel = copy();
parallel.roads.push({ id: 'new', x0: -450, z0: 200, x1: -450, z1: 400, kind: 'street', locked: false });
assert(T.guardM2(base, parallel).some((e) => e.indexOf('highway') >= 0), 'parallel highway');

const through = copy();
through.roads.push({ id: 'new2', x0: 0, z0: 0, x1: 40, z1: 40, kind: 'street', locked: false });
assert(T.guardM2(base, through).some((e) => e.indexOf('through') >= 0), 'street through building');

const cover = copy();
cover.buildings[0] = { id: 'b1', name: 'HOME', x0: -4, x1: 4, z0: -4, z1: 4 };
assert(T.guardM2(base, cover).some((e) => e.indexOf('spawn') >= 0), 'cover spawn');

const street = copy();
street.roads.push({ id: 'new3', x0: 200, z0: -300, x1: 200, z1: -80, kind: 'street', locked: false, added: true });
assert.deepStrictEqual(Array.from(T.guardM2(base, street)), [], 'new street on open ground');

const m = T.measure({ x: 0, z: 0 }, { x: 180, z: 520 });
assert(Math.abs(m.metres - Math.hypot(180, 520)) < 1e-6, 'measure');

const yaw = T.rotate(0, 'deg15');
assert.strictEqual(yaw, 15);
assert.strictEqual(T.rotate(0, 'quarter'), 90);

const box = { id: 'b', x: 0, z: 0, x0: -5, x1: 5, z0: -4, z1: 4, w: 10, d: 8, h: 12, yaw: 0 };
const parts = T.roof(box, 'pitch');
assert(parts.length === 4 && parts[0].part === 'roof-pitch', 'pitched roof');
assert(T.roof(box, 'flat')[0].part === 'roof-flat');
assert(T.roof(box, 'dome').length === 4);

const faced = T.alignFace(box, [{ x0: 0, z0: 30, x1: 40, z1: 30, kind: 'street' }]);
assert.strictEqual(faced.face, 's', 'face the street to the north? building is south of a horizontal road so face n or s');

const grouped = T.groupMove([box, Object.assign({}, box, { id: 'c', x: 20, x0: 15, x1: 25 })], 4, -2);
assert.strictEqual(grouped[0].x, 4);
assert.strictEqual(grouped[1].x, 24);
assert.strictEqual(grouped[1].z0, -6);

const hist = T.createHistory(100);
hist.push({ n: 1 });
hist.push({ n: 2 });
assert.strictEqual(hist.undo().n, 1);
assert.strictEqual(hist.redo().n, 2);

const builder = fs.readFileSync(builderPath, 'utf8');
const world = fs.readFileSync(path.join(__dirname, '..', 'world.html'), 'utf8');
const split = fs.readFileSync(path.join(__dirname, '..', 'world-split.html'), 'utf8');
assert(!/\.shadowBlur/.test(builder), 'dev builder must not set shadowBlur');
assert(!/\.shadowBlur/.test(fs.readFileSync(toolsPath, 'utf8')), 'shared tools must not set shadowBlur');
assert(world.includes('world/planner-tools.js'), 'world.html loads the shared tools');
assert(world.includes('world/dev-builder.js'), 'world.html loads the DEV Builder');
assert(split.includes('world/dev-builder.js'), 'world-split.html loads the DEV Builder');
assert(!world.includes('zdash.house.v1'), 'builder script tags do not touch the house key');

console.log('dev-builder checks passed');
