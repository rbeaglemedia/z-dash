'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.join(__dirname, '..');

const store = {};
const ctx = {
  console,
  performance: { now: () => Date.now() },
  Math,
  localStorage: {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  }
};
ctx.globalThis = ctx;
ctx.window = ctx;
vm.createContext(ctx);

function load(file) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInContext(src, ctx, { filename: file });
}

load('world/planner-props.js');
load('world/room-place.js');
load('world/style-sampler.js');
load('world/editor-core.js');

const fail = [];
const hook = JSON.parse(fs.readFileSync(path.join(root, 'docs/room-place/HOOK.json'), 'utf8'));
const RP = ctx.ROOM_PLACE;
const EC = ctx.EDITOR_CORE;
const PP = ctx.PLANNER_PROPS;

if (JSON.stringify(RP.rooms) !== JSON.stringify(hook.rooms)) fail.push('rooms drifted from HOOK.json');

const house = RP.describe('house');
if (!house || house.bounds.w !== 24 || house.bounds.d !== 18 || house.bounds.h !== 4.8) fail.push('house bounds');
if (RP.describe('arcade').shell !== 'later') fail.push('arcade shell');

const near = RP.snap('house', { x: -5.1, y: 0, z: 8.1, kind: 'floor' }, []);
if (!near || near.id !== 'floor-left') fail.push('snap floor-left ' + (near && near.id));
const hero = RP.snap('house', { x: -2.6, y: 0, z: 6.6, kind: 'floor' }, []);
if (hero) fail.push('snap landed on a hero slot ' + hero.id);
const door = RP.snap('house', { x: 0, y: 0, z: 1, kind: 'floor' }, []);
if (door) fail.push('snap landed in the door gap ' + door.id);

function topOf(parts) {
  let t = 0;
  for (let i = 0; i < parts.length; i++) t = Math.max(t, parts[i].y + parts[i].sy / 2);
  return t;
}
function bottomOf(parts) {
  let t = 1e9;
  for (let i = 0; i < parts.length; i++) t = Math.min(t, parts[i].y - parts[i].sy / 2);
  return t;
}
const speakerDefault = topOf(PP.parts('speaker', {}));
if (Math.abs(speakerDefault - 0.9) > 0.02) fail.push('default speaker height ' + speakerDefault);
const speakerTall = topOf(PP.parts('speaker', { w: 0.38, h: 1.83, d: 0.38, glow: '#ffb020' }));
if (Math.abs(speakerTall - 1.83) > 0.02) fail.push('R1 speaker height ' + speakerTall);
const kioskTop = topOf(PP.parts('kiosk', {}));
if (Math.abs(kioskTop - 1.22) > 0.03) fail.push('kiosk top ' + kioskTop);
const tvBottom = bottomOf(PP.parts('tv85', {}));
if (Math.abs(tvBottom) > 0.02) fail.push('tv85 local bottom ' + tvBottom);
const posterTop = topOf(PP.parts('ledposter', {}));
if (Math.abs(posterTop - 2.03) > 0.03) fail.push('ledposter height ' + posterTop);
if (PP.parts('tv85', {}).length > 8 || PP.parts('kiosk', {}).length > 8) fail.push('R1 mesh is heavy');

store['zdash.house.v1'] = '{"theme":"#3ee6ff"}';
store['zdash.kid.v1'] = '{"house":1}';
const lockedHouse = store['zdash.house.v1'];
const lockedKid = store['zdash.kid.v1'];

const other = EC.create({ role: 'ellie', roomId: 'arcade', saveKey: 'zdash.ellie.builder.v1' });
if (!other || other.call('place', 'tv85').ok) fail.push('ellie accepted a room besides the house');

const session = EC.create({ role: 'ellie', roomId: 'house', saveKey: 'zdash.ellie.builder.v1' });
const starter = session.props.map((p) => p.slot).join(',');
if (starter !== 'wall-far-left,wall-far-right,floor-left,floor-right') fail.push('starter slots ' + starter);
const yawOk = session.props.every((p) => Math.abs(p.yaw - Math.PI) < 0.01 || Math.abs(p.yaw - 3.1416) < 0.001);
if (!yawOk) fail.push('starter yaw');
if (session.props[0].y !== 1.15 || session.props[2].y !== 0) fail.push('starter bottoms');

session.select(2);
const copied = session.copy();
if (!copied.ok || copied.slot !== 'floor-free') fail.push('copy ' + JSON.stringify(copied));
session.undo();
if (session.props.length !== 4) fail.push('undo copy');

session.select(0);
const wallYaw = session.props[0].yaw;
session.turn();
if (session.props[0].yaw !== wallYaw) fail.push('wall turn changed yaw');
session.select(3);
const floorYaw = session.props[3].yaw;
session.turn();
if (Math.abs(session.props[3].yaw - (floorYaw + Math.PI / 2)) > 1e-4) fail.push('floor turn');
session.undo();

const missed = session.move({ x: 0, y: 0, z: 1, kind: 'floor' });
if (!missed.ok || missed.snapped) fail.push('bad drag should stay');
if (session.props[3].slot !== 'floor-right') fail.push('kiosk left its slot');
const moved = session.move({ x: 0.2, y: 0, z: 10.1, kind: 'floor' });
if (!moved.snapped || session.props[3].slot !== 'floor-free') fail.push('move to floor-free ' + JSON.stringify(moved));
session.undo();

session.select(0);
session.setGlow('#ffffff');
if (session.props[0].params.glow !== '#ffffff') fail.push('white swatch');
if (session.sizeText() !== '1.9 m wide') fail.push('size ' + session.sizeText());
session.select(2);
if (session.sizeText() !== '1.8 m tall') fail.push('speaker size ' + session.sizeText());
session.undo();

const road = session.call('road');
if (!road || road.ok || road.reason !== 'off') fail.push('road tool ' + JSON.stringify(road));
if (session.call('spawn').reason !== 'off') fail.push('spawn tool');
if (session.place('laptop').ok) fail.push('laptop placed');

session.startOver();
if (!RP.hasSave()) fail.push('start over missed the save');
const cleared = JSON.parse(store['zdash.ellie.builder.v1']);
if (!cleared.rooms || !cleared.rooms.house || cleared.rooms.house.props.length !== 0) fail.push('start over shape');
const placed = session.place('tv85');
if (!placed.ok || placed.slot !== 'wall-far-left') fail.push('place tv85 ' + JSON.stringify(placed));
const placedPoster = session.place('ledposter');
if (!placedPoster.ok || placedPoster.slot !== 'wall-far-right') fail.push('place poster ' + JSON.stringify(placedPoster));
const placedSpeaker = session.place('speaker');
if (!placedSpeaker.ok || placedSpeaker.slot !== 'floor-free') fail.push('place speaker ' + JSON.stringify(placedSpeaker));
session.commit();
if (store['zdash.house.v1'] !== lockedHouse || store['zdash.kid.v1'] !== lockedKid) fail.push('home keys changed');
if (store['zdash.sampler.likes.v1']) fail.push('likes key written');
const saved = JSON.parse(store['zdash.ellie.builder.v1']);
if (!saved.rooms.house.props.some((p) => p.prop === 'tv85' && p.slot === 'wall-far-left' && p.y === 1.15)) fail.push('save missing tv85');

const again = EC.create({ role: 'ellie', roomId: 'house', saveKey: 'zdash.ellie.builder.v1' });
if (again.props.length !== 3) fail.push('reload count ' + again.props.length);
if (again.props.some((p) => p.prop === 'kiosk')) fail.push('starter returned after a save');

again.select(2);
while (again.props.length < 48) {
  again.props.push({ prop: 'kiosk', slot: 'pad-' + again.props.length, wall: null, x: 0, y: 0, z: 3, yaw: 0, params: {} });
}
const full = again.copy();
if (!full || full.reason !== 'full' || full.text !== 'This room is full.') fail.push('full room ' + JSON.stringify(full));

again.select(2);
for (let i = 0; i < 120; i++) again.turn();
if (!again.undo().ok) fail.push('undo stack');

const files = ['world/room-place.js', 'world/editor-core.js', 'world/ellie-builder.js', 'world/planner-props.js', 'world/style-sampler.js'];
for (const file of files) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  if (/shadowBlur\s*=/.test(src)) fail.push(file + ' sets shadowBlur');
}
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (/ellie-builder|room-place\.js|editor-core/.test(index)) fail.push('adult page loads the builder');

const report = { ok: fail.length === 0, fails: fail };
fs.mkdirSync(path.join(root, 'test-results/ellie-builder'), { recursive: true });
fs.writeFileSync(path.join(root, 'test-results/ellie-builder/check.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(fail.length ? 1 : 0);
