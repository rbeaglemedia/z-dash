#!/usr/bin/env node
/**
 * Neon World resume checks. Kid app only.
 * Run: node tools/resume-check.js
 *
 * Covers the save key, protected profile keys, throttle, map-change
 * fallback, Sky Drop / aside hold, and resume-to-home. Does not launch Chrome.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const KEY = 'zdash.world.resume.v1';
const PROTECTED = {
  'zdash.kid.v1': '{"v":1,"car":"ellie","eq":{"nos":2}}',
  'zdash.char.v1': '{"v":1,"name":"Ellie"}',
  'zdash.pet.v1': '{"v":1,"type":"fox"}',
  'zdash.house.v1': '{"v":1,"home":"loft"}',
  'zdash.ellie.builder.v1': '{"v":1,"blocks":["hq"]}',
  'zdash.neonpaint.v1': '{"version":1,"enabled":true}'
};

const failures = [];
function check(name, cond, detail) {
  if (cond) {
    console.log('ok  ' + name);
    return;
  }
  failures.push(name + (detail ? ' — ' + detail : ''));
  console.log('FAIL ' + name + (detail ? ' — ' + detail : ''));
}

function memStore(extra) {
  const data = Object.assign({}, PROTECTED, extra || {});
  const calls = [];
  return {
    data: data,
    calls: calls,
    getItem: function (k) {
      calls.push(['get', k]);
      return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null;
    },
    setItem: function (k, v) {
      calls.push(['set', k]);
      data[k] = String(v);
    },
    removeItem: function (k) {
      calls.push(['del', k]);
      delete data[k];
    }
  };
}

function protectedSame(store) {
  const keys = Object.keys(PROTECTED);
  for (let i = 0; i < keys.length; i++) {
    if (store.data[keys[i]] !== PROTECTED[keys[i]]) return false;
  }
  return true;
}

function onlyResumeKey(store) {
  for (let i = 0; i < store.calls.length; i++) {
    const op = store.calls[i][0];
    const k = store.calls[i][1];
    if ((op === 'set' || op === 'del' || op === 'get') && k !== KEY) return false;
  }
  return true;
}

function loadResumeVm() {
  const ctx = {
    console: console,
    performance: { now: function () { return 0; } }
  };
  ctx.window = ctx;
  ctx.CITY = { ROADS: { nodes: [], edges: [] } };
  ctx.P = { x: 0, y: 0, z: 0, nosTank: 1 };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'world/objectives.js'), 'utf8'), ctx, { filename: 'objectives.js' });
  vm.runInContext('CITY = undefined;', ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'world/resume.js'), 'utf8'), ctx, { filename: 'resume.js' });
  return ctx;
}

function hotReset(ctx) {
  const H = ctx.HOTDROP;
  H.active = false;
  H.tLeft = 0;
  H.hold = false;
  H.overchargeT = 0;
  H.x = 0;
  H.y = 0;
  H.z = 0;
  H.claimed = 0;
  H.spawned = 0;
}

function poseAt(x, z, extra) {
  return Object.assign({
    x: x, y: 0, z: z, yaw: 0, pitch: 0, v: 0, ground: true, wings: 0,
    driveMode: 'arcade', mode: 'car'
  }, extra || {});
}

function hotBag(over) {
  const pose = poseAt(0, 400);
  const home = poseAt(0, 400);
  return Object.assign({
    v: 1,
    map: 'old-map',
    pose: pose,
    nos: { tank: 0.42, left: 0, hotDropNosT: 0 },
    challenges: [{
      id: 'hotdrop', name: 'Hot Drop', needsPlace: true, active: true,
      x: 0, y: 0, z: 680, r: 16, tLeft: 18, maxT: 25, overchargeT: 0,
      claimed: 0, spawned: 1, hold: false, home: home
    }]
  }, over || {});
}

function worldOf(opts) {
  opts = opts || {};
  const stamp = opts.stamp == null ? 'map-a' : opts.stamp;
  return {
    mapStamp: function () { return stamp; },
    spotClear: function (x, z) { return opts.clear ? opts.clear(x, z) : true; },
    districts: function () { return opts.districts || []; },
    nodes: function () { return opts.nodes || []; }
  };
}

function harness(ctx, store, city, live) {
  const seen = { pose: null, where: null, nos: null, hold: null, toast: null, spawned: 0 };
  const api = ctx.ZD_RESUME.create({
    storage: store,
    interval: 2.5,
    paused: function () { return !!live.paused; },
    city: city,
    live: {
      readPose: function () { return live.pose(); },
      readNos: function () { return live.nos(); },
      applyPose: function (pose, where) { seen.pose = pose; seen.where = where; },
      applyNos: function (nos) { seen.nos = nos; },
      safeSpawn: function () { seen.spawned++; if (live.onSafe) live.onSafe(); },
      parkFeet: function () { seen.parked = (seen.parked || 0) + 1; },
      setHold: function (id, on) { seen.hold = { id: id, on: !!on }; if (id === 'hotdrop') ctx.HOTDROP.hold = !!on && !!ctx.HOTDROP.active; },
      toast: function (msg) { seen.toast = msg; }
    }
  });
  return { api: api, seen: seen };
}

const resumeVm = loadResumeVm();
check('resume exports create', !!(resumeVm.ZD_RESUME && resumeVm.ZD_RESUME.create));
check('browser boot stays off without document', !resumeVm.RESUME);

// Hot Drop: a second spawn must not replace a live beacon, and hold freezes the timer.
{
  const H = resumeVm.HOTDROP;
  const P = resumeVm.P;
  H.spawn(0, 0, 0);
  const z0 = H.z;
  const spawned = H.spawned;
  H.spawn(40, 40, 1);
  check('hot drop spawn no-ops while active', H.spawned === spawned && H.z === z0 && H.tLeft === 25, 'spawned ' + H.spawned + ' z ' + H.z);
  H.hold = true;
  P.x = 999;
  P.z = 999;
  P.y = 0;
  H.update(5);
  check('hold freezes the timer far from the beacon', H.hold === true && H.tLeft === 25, 'tLeft ' + H.tLeft);
  P.x = H.x;
  P.z = H.z + 50;
  let near = 0;
  resumeVm.RESUME = { onNear: function () { near++; } };
  H.update(1);
  check('coming within 80m unholds and starts the clock', H.hold === false && H.tLeft < 25 && H.tLeft > 20 && near === 1, 'tLeft ' + H.tLeft + ' near ' + near);
  hotReset(resumeVm);
  resumeVm.RESUME = undefined;
}

// Runway reset must not wipe a live challenge. state.js `const` bindings stay
// inside that script, so the check runs in the same script.
{
  const ctx = {
    console: console,
    setWings: function () {},
    FX: [],
    showWreck: function () {},
    SKID: { L: [], R: [] },
    localStorage: { getItem: function () { return null; } },
    D: Math.PI / 180
  };
  vm.createContext(ctx);
  const src = fs.readFileSync(path.join(ROOT, 'world/state.js'), 'utf8') + `
    var HOTDROP = { active: true, tLeft: 12, x: 5, z: 9 };
    P.x = 40; P.nosTank = 0.2;
    reset();
    globalThis.__after = { active: HOTDROP.active, tLeft: HOTDROP.tLeft, x: HOTDROP.x, z: HOTDROP.z, px: P.x, pz: P.z, py: P.y, nos: P.nosTank, v: P.v };
  `;
  vm.runInContext(src, ctx, { filename: 'state.js' });
  const after = ctx.__after;
  check('runway reset keeps the challenge', after && after.active === true && after.tLeft === 12 && after.x === 5 && after.z === 9, JSON.stringify(after));
  check('runway reset still parks the car', after && after.px === 0 && after.pz === 0 && after.py === 0 && after.nos === 1 && after.v === 0, JSON.stringify(after));
}

// Corrupt and foreign versions are ignored. Protected keys stay byte-identical.
{
  const samples = ['{', '[]', 'null', '{"v":2,"pose":{"x":1,"z":1}}', '{"v":1,"pose":"nope"}'];
  for (let i = 0; i < samples.length; i++) {
    const store = memStore();
    store.data[KEY] = samples[i];
    const h = harness(resumeVm, store, worldOf(), {
      pose: function () { return poseAt(0, 0); },
      nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
    });
    const view = h.api.preview();
    check('ignores bad resume ' + JSON.stringify(samples[i]).slice(0, 24), h.api.bag() == null && !view.continue && !view.resume);
    check('bad resume does not touch profile keys', protectedSame(store) && onlyResumeKey(store));
  }
}

// Throttle: no storage write until the interval, and no rewrite when nothing changed.
{
  const store = memStore();
  const live = {
    pose: function () { return poseAt(40, 0, { v: 0, y: 0, mode: 'car' }); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
  };
  const h = harness(resumeVm, store, worldOf({ stamp: 'map-a' }), live);
  h.api.beginAside();
  h.api.tick(2.0);
  const mid = store.calls.filter(function (c) { return c[0] === 'set'; }).length;
  check('2.0s still inside the throttle', mid === 0, 'writes ' + mid);
  h.api.tick(0.6);
  const once = store.calls.filter(function (c) { return c[0] === 'set'; }).length;
  check('one write at 2.6s', once === 1, 'writes ' + once);
  let frames = 0;
  for (let i = 0; i < 120; i++) { h.api.tick(0.016); frames++; }
  const early = store.calls.filter(function (c) { return c[0] === 'set'; }).length;
  check('120 further frames do not write again', early === 1, 'writes ' + early + ' frames ' + frames);
  h.api.tick(3);
  const again = store.calls.filter(function (c) { return c[0] === 'set'; }).length;
  check('unchanged pose does not write again', again === 1, 'writes ' + again);
  h.livePaused = true;
  live.paused = true;
  live.pose = function () { return poseAt(80, 0); };
  h.api.tick(3);
  const pausedWrites = store.calls.filter(function (c) { return c[0] === 'set'; }).length;
  check('paused time does not write', pausedWrites === 1);
  check('throttle only touches the resume key', onlyResumeKey(store) && protectedSame(store));
  const saved = JSON.parse(store.data[KEY]);
  check('saved bag is v1 away from the origin', saved.v === 1 && saved.pose && saved.pose.x === 40);
}

// A finished runway visit with no challenge drops the nag, and does not invent a save.
{
  const store = memStore();
  store.data[KEY] = JSON.stringify({ v: 1, map: 'map-a', pose: poseAt(0, 0), nos: { tank: 1, left: 0, hotDropNosT: 0 }, challenges: [] });
  const h = harness(resumeVm, store, worldOf({ stamp: 'map-a' }), {
    pose: function () { return poseAt(0, 0); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
  });
  h.api.beginAside();
  h.api.tick(3);
  check('fresh runway clears a stale empty save', store.data[KEY] == null);
  check('clear does not remove profile keys', protectedSame(store) && onlyResumeKey(store));
}

// Map match restores the exact spot. A moved map with a clear spot still uses it.
{
  const store = memStore();
  const bag = hotBag({ map: 'map-a', pose: poseAt(10, 40, { y: 2, mode: 'car' }) });
  bag.challenges[0].home = poseAt(10, 40, { y: 2 });
  store.data[KEY] = JSON.stringify(bag);
  const h = harness(resumeVm, store, worldOf({ stamp: 'map-a', clear: function () { return true; } }), {
    pose: function () { return poseAt(10, 40); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
  });
  const where = h.api.resolveSaved(bag.pose, bag.map);
  check('same map uses the exact spot', where && where.how === 'exact' && where.x === 10 && where.z === 40 && where.y === 2, JSON.stringify(where));
  const moved = h.api.resolveSaved(Object.assign({}, bag.pose, { anchor: null }), 'old-map');
  check('moved map keeps a spot that is still clear', moved && moved.how === 'clear' && moved.x === 10 && moved.z === 40, JSON.stringify(moved));
}

// District fraction and road anchor after the blocks move.
{
  const store = memStore();
  const spot = poseAt(50, 50);
  spot.anchor = { x: 50, z: 50, district: 'core', ux: 0.25, uz: 0.5 };
  const city = worldOf({
    stamp: 'map-b',
    districts: [{ id: 'core', x0: 1000, x1: 1100, z0: 0, z1: 100 }],
    clear: function (x, z) { return Math.abs(x - 1025) < 0.01 && Math.abs(z - 50) < 0.01; }
  });
  const h = harness(resumeVm, store, city, {
    pose: function () { return poseAt(0, 0); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
  });
  const via = h.api.resolveSaved(spot, 'map-a');
  check('moved district resolves the fraction', via && Math.abs(via.x - 1025) < 0.02 && Math.abs(via.z - 50) < 0.02, JSON.stringify(via));

  const roadSpot = poseAt(5, 5);
  roadSpot.anchor = { x: 5, z: 5, road: { kind: 'street', ox: 4, oz: -2, nx: 10, nz: 10 } };
  const roadCity = worldOf({
    stamp: 'map-c',
    nodes: [{ kind: 'street', x: 100, z: 12 }, { kind: 'tunnel', x: 10, z: 10 }],
    clear: function (x, z) { return Math.abs(x - 104) < 0.02 && Math.abs(z - 10) < 0.02; }
  });
  const hr = harness(resumeVm, store, roadCity, {
    pose: function () { return poseAt(0, 0); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
  });
  const road = hr.api.resolveSaved(roadSpot, 'map-a');
  check('moved road anchor resolves', road && road.how === 'road' && Math.abs(road.x - 104) < 0.02 && Math.abs(road.z - 10) < 0.02, JSON.stringify(road));
}

// Invalid spot: safe spawn, challenge kept, profile keys untouched.
{
  hotReset(resumeVm);
  const store = memStore();
  const bag = hotBag({ map: 'map-old' });
  bag.pose = poseAt(50, 50);
  bag.pose.anchor = { district: 'gone', ux: 0.5, uz: 0.5, x: 50, z: 50 };
  bag.challenges[0].anchor = { district: 'gone', ux: 0.2, uz: 0.8, x: 0, z: 680 };
  bag.challenges[0].home = poseAt(50, 50);
  bag.challenges[0].home.anchor = bag.pose.anchor;
  store.data[KEY] = JSON.stringify(bag);
  let safe = 0;
  const h = harness(resumeVm, store, worldOf({
    stamp: 'map-new',
    clear: function () { return false; }
  }), {
    pose: function () { return poseAt(0, 0); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; },
    onSafe: function () { safe++; }
  });
  const r = h.api.beginContinue();
  const written = JSON.parse(store.data[KEY]);
  const ch = written.challenges && written.challenges[0];
  check('blocked spot uses a safe spawn', r.ok === false && r.how === 'safe' && safe === 1, JSON.stringify(r));
  check('blocked spot keeps the challenge', ch && ch.id === 'hotdrop' && ch.tLeft === 18 && ch._unplaced === true, JSON.stringify(ch));
  check('safe spawn does not touch profile keys', protectedSame(store) && onlyResumeKey(store));
  check('safe spawn tells her the city changed', h.seen.toast && h.seen.toast.indexOf('CHALLENGES KEPT') >= 0, h.seen.toast);
}

// Aside (Sky Drop / runway) keeps the timer and only holds it when she is far.
{
  hotReset(resumeVm);
  const store = memStore();
  store.data[KEY] = JSON.stringify(hotBag());
  const h = harness(resumeVm, store, worldOf({ stamp: 'old-map', clear: function () { return true; } }), {
    pose: function () { return poseAt(180, 520, { y: 460, v: 42, ground: false }); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
  });
  const view = h.api.preview();
  check('same-spot save offers RESUME and not a second continue', view.resume === true && view.continue === false && view.prompt && view.prompt.title.indexOf('18s') >= 0, JSON.stringify(view));
  const aside = h.api.beginAside();
  check('sky drop keeps the challenge timer', resumeVm.HOTDROP.active === true && resumeVm.HOTDROP.tLeft === 18, 'tLeft ' + resumeVm.HOTDROP.tLeft);
  check('sky drop holds a far challenge and asks to resume', aside.showPrompt === true && resumeVm.HOTDROP.hold === true && h.seen.hold && h.seen.hold.on === true, JSON.stringify(aside));
  const back = h.api.beginResume();
  check('resume puts her on the challenge home', back.ok === true && h.seen.where && Math.abs(h.seen.where.z - 400) < 0.01 && Math.abs(h.seen.where.x) < 0.01, JSON.stringify(h.seen.where));
  check('resume restores the NOS bottle', h.seen.nos && Math.abs(h.seen.nos.tank - 0.42) < 0.001, JSON.stringify(h.seen.nos));
  check('resume drops the hold', resumeVm.HOTDROP.hold === false && resumeVm.HOTDROP.tLeft === 18);
}

// Continue restores the last pose when it is far from the challenge, and still keeps it.
{
  hotReset(resumeVm);
  const store = memStore();
  const bag = hotBag();
  bag.pose = poseAt(180, 520, { y: 12, mode: 'car', v: 8 });
  bag.map = 'map-a';
  store.data[KEY] = JSON.stringify(bag);
  const h = harness(resumeVm, store, worldOf({ stamp: 'map-a', clear: function () { return true; } }), {
    pose: function () { return poseAt(0, 0); },
    nos: function () { return { tank: 1, left: 0, hotDropNosT: 0 }; }
  });
  const view = h.api.preview();
  check('far pose offers continue and resume', view.continue === true && view.resume === true && view.far === true);
  const go = h.api.beginContinue();
  check('continue restores the saved pose', go.ok === true && h.seen.where && Math.abs(h.seen.where.x - 180) < 0.01 && Math.abs(h.seen.where.z - 520) < 0.01, JSON.stringify(h.seen.where));
  check('continue keeps the challenge and holds it while she is far', resumeVm.HOTDROP.active === true && resumeVm.HOTDROP.tLeft === 18 && resumeVm.HOTDROP.hold === true);
  check('continue restores NOS', h.seen.nos && Math.abs(h.seen.nos.tank - 0.42) < 0.001);
}

// Foot pose is handed to applyPose unchanged.
{
  hotReset(resumeVm);
  const store = memStore();
  const bag = hotBag({ map: 'map-a' });
  bag.pose = poseAt(12, 80, { mode: 'foot', driveMode: 'street', foot: { x: 12, y: 0, z: 80, yaw: 0.4, run: true } });
  bag.challenges = [];
  bag.nos = { tank: 0.55, left: 0.1, hotDropNosT: 0 };
  store.data[KEY] = JSON.stringify(bag);
  const h = harness(resumeVm, store, worldOf({ stamp: 'map-a', clear: function () { return true; } }), {
    pose: function () { return bag.pose; },
    nos: function () { return bag.nos; }
  });
  h.api.beginContinue();
  check('foot mode is passed through', h.seen.pose && h.seen.pose.mode === 'foot' && h.seen.pose.foot && h.seen.pose.foot.x === 12 && h.seen.pose.foot.run === true, JSON.stringify(h.seen.pose && h.seen.pose.foot));
  check('foot continue keeps the street mode and NOS', h.seen.pose.driveMode === 'street' && Math.abs(h.seen.nos.tank - 0.55) < 0.001);
}

// Browser adapters: real applyPose parks her on foot, and an inside door restores the room.
function fakeDocument() {
  const els = {};
  function make(id) {
    const el = {
      id: id,
      hidden: true,
      textContent: '',
      classList: {
        _c: {},
        add: function (c) { this._c[c] = 1; },
        remove: function (c) { delete this._c[c]; },
        contains: function (c) { return !!this._c[c]; },
        toggle: function (c, on) { if (on) this.add(c); else this.remove(c); }
      },
      addEventListener: function (type, fn) {
        el._on = el._on || {};
        el._on[type] = fn;
      }
    };
    return el;
  }
  return {
    els: els,
    getElementById: function (id) {
      if (!els[id]) els[id] = make(id);
      return els[id];
    },
    visibilityState: 'visible',
    addEventListener: function () {}
  };
}

function bootBrowser(bag, walk, buildings) {
  const store = memStore();
  store.data[KEY] = JSON.stringify(bag);
  const ctx = {
    console: console,
    performance: { now: function () { return 0; } },
    localStorage: store
  };
  ctx.window = ctx;
  ctx.addEventListener = function () {};
  ctx.document = fakeDocument();
  ctx.CITY = {
    mapStamp: function () { return 'live-map'; },
    probe: function () { return { wl: null }; },
    surfaceAt: function () { return 'paved'; },
    XS0: -2000, XS1: 2000, ZS0: -2000, ZS1: 2000,
    DISTRICTS: [{ id: 'SPAWN_SOUTH', label: 'Spawn', x0: -560, x1: 560, z0: -300, z1: 400 }],
    ROADS: { nodes: [{ kind: 'street', x: 0, z: 80 }] },
    BL: buildings || []
  };
  ctx.P = { x: 0, y: 0, z: 0, yaw: 0, pitch: 0, bank: 0, v: 0, vs: 0, ground: true, wings: 0, driveMode: 'arcade', hd: 0, nosTank: 1, nosLeft: 0, hotDropNosT: 0, gam: 0, fromSkyDrop: false };
  ctx.WALK_MODE = walk;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'world/objectives.js'), 'utf8'), ctx, { filename: 'objectives.js' });
  vm.runInContext([
    'function reset(){ P.x=0; P.z=0; P.y=0; P.v=0; P.nosTank=1; P.ground=true; P.wings=0; P.yaw=0; }',
    'function setDriveMode(m){ P.driveMode = m; }',
    'function setWings(on){ P.wings = on ? 1 : 0; }',
    'function kPause(){}',
    'function kToast(msg){ window.__toast = msg; }',
    'function syncOnFootButtons(){ window.__sync = (window.__sync||0)+1; }',
    'function walkHideInterior(){}',
    'function walkShowInterior(){ window.__interior = 1; }',
    'let flying = false;',
    'let paused = false;'
  ].join('\n'), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'world/resume.js'), 'utf8'), ctx, { filename: 'resume.js' });
  ctx.__store = store;
  return ctx;
}

{
  const walk = { onFoot: false, x: 0, z: 0, y: 0, yaw: 0, insideBuilding: false, insideDoor: null, dancing: false, runMode: false, vx: 0, vz: 0, speed: 0, room: null };
  const bag = hotBag({ map: 'live-map' });
  bag.pose = poseAt(12, 80, { mode: 'foot', driveMode: 'street', yaw: 0.3, foot: { x: 12, y: 0, z: 80, yaw: 0.3, run: false } });
  bag.challenges[0].home = poseAt(12, 80, { mode: 'foot', driveMode: 'street', yaw: 0.3, foot: { x: 12, y: 0, z: 80, yaw: 0.3, run: false } });
  bag.nos = { tank: 0.55, left: 0, hotDropNosT: 0 };
  const ctx = bootBrowser(bag, walk, []);
  const note = ctx.document.getElementById('kResumeNote');
  const title = ctx.document.getElementById('kResumeTitle');
  const cont = ctx.document.getElementById('kContinue');
  check('start card shows the resume prompt', note && note.hidden === false && title && title.textContent.indexOf('18s') >= 0, title && title.textContent);
  check('start card hides continue when she is already there', cont && cont.hidden === true);
  ctx.RESUME.beginResume();
  check('browser resume parks her on foot', ctx.WALK_MODE.onFoot === true && Math.abs(ctx.WALK_MODE.x - 12) < 0.01 && Math.abs(ctx.WALK_MODE.z - 80) < 0.01, JSON.stringify({ x: ctx.WALK_MODE.x, z: ctx.WALK_MODE.z, on: ctx.WALK_MODE.onFoot }));
  check('browser resume restores NOS and the beacon', Math.abs(ctx.P.nosTank - 0.55) < 0.001 && ctx.HOTDROP.active === true && ctx.HOTDROP.tLeft === 18 && Math.abs(ctx.HOTDROP.z - 680) < 0.01);
  ctx.document.getElementById('kOver').classList.add('hidden');
  ctx.P.x = 180;
  ctx.P.z = 520;
  ctx.P.y = 460;
  const aside = ctx.RESUME.beginAside();
  const pop = ctx.document.getElementById('kResumePop');
  check('browser sky drop keeps the beacon and shows the prompt', aside && aside.showPrompt === true && ctx.HOTDROP.active === true && ctx.HOTDROP.tLeft === 18 && ctx.HOTDROP.hold === true && pop && pop.hidden === false, 'hold ' + ctx.HOTDROP.hold + ' pop ' + (pop && pop.hidden));
  check('browser flow leaves profile keys alone', protectedSame(ctx.__store));
}

{
  const walk = { onFoot: false, x: 0, z: 0, y: 0, yaw: 0, insideBuilding: false, insideDoor: null, dancing: false, runMode: false, vx: 0, vz: 0, speed: 0, room: null };
  const bag = {
    v: 1, map: 'live-map',
    pose: poseAt(12, 80, {
      mode: 'inside', driveMode: 'street',
      inside: { purpose: 'DANCE', doorX: 12, doorZ: 80, roomX: 1.5, roomZ: 2.2, roomYaw: 1 }
    }),
    nos: { tank: 0.7, left: 0, hotDropNosT: 0 },
    challenges: []
  };
  const ctx = bootBrowser(bag, walk, [{
    id: 7, purpose: 'DANCE', purposeLabel: 'Z COMPANY ARTS', c: '#ff4fd8', top: 18, cx: 12, cz: 80,
    doors: [[12, 80, 0, 1]]
  }]);
  ctx.RESUME.beginContinue();
  check('inside resume reopens the room', ctx.WALK_MODE.onFoot === true && ctx.WALK_MODE.insideBuilding === true && ctx.WALK_MODE.room && Math.abs(ctx.WALK_MODE.room.x - 1.5) < 0.01 && ctx.__interior === 1, JSON.stringify(ctx.WALK_MODE.room));
}

// Kid pages carry the script. The adult page does not.
{
  const world = fs.readFileSync(path.join(ROOT, 'world.html'), 'utf8');
  const split = fs.readFileSync(path.join(ROOT, 'world-split.html'), 'utf8');
  const adult = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  check('world and world-split stay identical', world === split);
  check('kid world loads resume.js', world.indexOf('world/resume.js') >= 0 && world.indexOf('kResumeNote') >= 0);
  check('adult index has no resume save', adult.indexOf('world/resume.js') < 0 && adult.indexOf('zdash.world.resume') < 0 && adult.indexOf('kResumeNote') < 0);
}

if (failures.length) {
  console.log('\n' + failures.length + ' failed');
  process.exit(1);
}
console.log('\nall resume checks passed');
