'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.join(__dirname, '..');

const store = {};
const ctx = {
  console,
  performance: { now: () => Date.now() },
  D: Math.PI / 180,
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  localStorage: {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); }
  }
};
ctx.globalThis = ctx;
ctx.window = ctx;
vm.createContext(ctx);

function load(file, fixes) {
  let src = fs.readFileSync(path.join(root, file), 'utf8');
  for (const [a, b] of fixes || []) src = src.split(a).join(b);
  vm.runInContext(src, ctx, { filename: file });
}

load('world/towtruck.js', [['const ZD_TOW_PREFAB', 'var ZD_TOW_PREFAB']]);
load('world/city.js', [['const CITY=', 'var CITY=']]);
load('world/style-sampler.js');

const CITY = ctx.CITY;
const SAMPLER = ctx.SAMPLER;
const solids = (list) => list.filter((b) => b && (b.kind === 'b' || b.kind === 'landmark'));
const beforeSolids = solids(CITY.BL).length;
const beforeAll = CITY.BL.length;
const added = SAMPLER.place();
const row = CITY.BL.filter((b) => b && b.sampler);
const fail = [];
if (!CITY || typeof CITY.add !== 'function') fail.push('CITY did not load');
if (beforeSolids !== 24) fail.push('expected 24 solid shops before the row, saw ' + beforeSolids);
if (added !== 8 || row.length !== 8) fail.push('expected 8 sampler shells, added ' + added + ' found ' + row.length);
const seen = {};
for (const b of row) {
  if (seen[b.sampler]) fail.push('duplicate style ' + b.sampler);
  seen[b.sampler] = 1;
  if (b.purpose !== 'SAMPLER') fail.push(b.sampler + ' purpose is ' + b.purpose);
  if (b.district !== 'SPAWN_SOUTH') fail.push(b.sampler + ' district is ' + b.district);
  const q = b.boxes[0];
  if (q.x1 > -260.05) fail.push(b.sampler + ' enters the x=-250 street at x ' + q.x1);
  if (q.x0 < -540) fail.push(b.sampler + ' is too far west');
  if (q.z0 < -90 || q.z1 > 90) fail.push(b.sampler + ' leaves the south block');
  if (!b.doors || !b.doors.length) fail.push(b.sampler + ' has no door');
  else if (!(b.doors[0][2] > 0)) fail.push(b.sampler + ' door does not face the street');
  for (const o of CITY.BL) {
    if (o === b || o.sampler) continue;
    const p = o.boxes && o.boxes[0];
    if (!p) continue;
    const ox = Math.min(q.x1, p.x1) - Math.max(q.x0, p.x0);
    const oz = Math.min(q.z1, p.z1) - Math.max(q.z0, p.z0);
    if (ox > 0.2 && oz > 0.2) fail.push(b.sampler + ' overlaps ' + (o.purpose || o.kind || o.id));
  }
  for (const r of CITY.RAMPS) {
    const ox = Math.min(q.x1, r.x1) - Math.max(q.x0, r.x0);
    const oz = Math.min(q.z1, r.z1) - Math.max(q.z0, r.z0);
    if (ox > 0 && oz > 0) fail.push(b.sampler + ' sits on a ramp');
  }
}
for (const st of SAMPLER.styles) {
  if (!(st.w > 8.4 && st.d > 6.3 && st.h > 3.1)) fail.push(st.id + ' is not bigger than the old room');
}
const src = fs.readFileSync(path.join(root, 'world/style-sampler.js'), 'utf8');
if (/shadowBlur\s*=/.test(src)) fail.push('sampler sets shadowBlur');
if (/zdash\.house|zdash\.kid|jr\.html#garage/.test(src)) fail.push('sampler touches a saved home key or the garage link');
if (SAMPLER.key !== 'zdash.sampler.likes.v1') fail.push('unexpected likes key ' + SAMPLER.key);
if (SAMPLER.toggle('glass') !== true || SAMPLER.toggle('glass') !== false) fail.push('heart toggle did not flip');
if (store['zdash.house.v1'] || store['zdash.kid.v1']) fail.push('heart write touched a home key');
const saved = JSON.parse(store[SAMPLER.key] || '{}');
if (saved.glass !== false) fail.push('likes file did not record glass');
const ids = SAMPLER.styles.map((s) => s.id).sort().join(',');
if (Object.keys(seen).sort().join(',') !== ids) fail.push('missing style shell');
const report = {
  ok: fail.length === 0,
  beforeSolids: beforeSolids,
  beforeAll: beforeAll,
  added: added,
  afterSolids: solids(CITY.BL).length,
  fails: fail,
  rooms: SAMPLER.styles.map((s) => ({ id: s.id, m: s.w + 'x' + s.d + 'x' + s.h, props: s.props.length })),
  shells: row.map((b) => {
    const q = b.boxes[0];
    return { id: b.sampler, x0: q.x0, x1: q.x1, z0: q.z0, z1: q.z1, door: b.doors[0], h: b.top };
  })
};
fs.mkdirSync(path.join(root, 'test-results/style-sampler'), { recursive: true });
fs.writeFileSync(path.join(root, 'test-results/style-sampler/place.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(fail.length ? 1 : 0);
