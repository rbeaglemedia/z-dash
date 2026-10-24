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
load('world/planner-props.js');
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
const propSrc = fs.readFileSync(path.join(root, 'world/planner-props.js'), 'utf8');
if (/shadowBlur\s*=/.test(src) || /shadowBlur\s*=/.test(propSrc)) fail.push('a room file sets shadowBlur');
const props = ctx.PLANNER_PROPS;
if (!props || typeof props.parts !== 'function' || typeof props.list !== 'function') fail.push('PLANNER_PROPS is missing');
else {
  const ids = props.list().map((s) => s.id);
  for (const id of ['screen', 'tv-stand', 'led-trailer', 'speaker', 'sofa', 'table', 'snack-counter']) {
    if (ids.indexOf(id) < 0) fail.push('catalog missing ' + id);
  }
  if (!props.get('tv-stand') || props.get('tv-stand').base !== 'tvStand') fail.push('tv-stand entry mismatch');
  if (!props.get('tvStand') || props.get('tvStand').id !== 'tv-stand') fail.push('tvStand alias missing');
  if (props.parts('sofa', { w: 2 }).length < 4) fail.push('sofa did not build');
  if (props.parts('screen', { w: 2, h: 1 }).length < 2) fail.push('screen did not build');
  if (props.parts('tv-stand', {}).length < 3) fail.push('tv-stand did not build');
  if (props.parts('tvStand', {}).length !== props.parts('tv-stand', {}).length) fail.push('tvStand alias parts differ');
  if (props.remix('snack-counter').length < 4) fail.push('remix did not build');
  const tech = ctx.SAMPLER && ctx.SAMPLER.tech;
  if (!tech) fail.push('sampler does not furnish from the catalog');
  else {
    for (let i = 0; i < ctx.SAMPLER.styles.length; i++) {
      const id = ctx.SAMPLER.styles[i].id;
      if (!tech(id).length) fail.push(id + ' has no catalog furniture');
    }
    const home = ctx.SAMPLER.houseParts({ theme: '#3ee6ff', furniture: 'sofa', petBed: true, sign: 'ELLIE' });
    if (!home || home.length < 4) fail.push('house did not place catalog furniture');
    for (const furn of ['sofa', 'arcade', 'dj', 'trophy']) {
      const parts = ctx.SAMPLER.houseParts({ theme: '#3ee6ff', furniture: furn, petBed: true, sign: 'ELLIE' });
      if (!parts || parts.length < 4) fail.push('house ' + furn + ' did not place catalog furniture');
    }
    const g = new Proxy({}, { get: () => () => {}, set: () => true });
    const who = { x: 0, z: 3.6, petX: 1.35, petZ: 3.85 };
    function onScreen(box, view) {
      const y0 = box.y, y1 = box.y + box.h, hx = box.w / 2, hz = box.d / 2;
      const yaw = box.yaw || 0, c = Math.cos(yaw), s = Math.sin(yaw);
      let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
      for (const lx of [-hx, hx]) for (const y of [y0, y1]) for (const lz of [-hz, hz]) {
        let dz = (box.z - lx * s + lz * c) - view.camZ;
        if (dz < 0.35) dz = 0.35;
        const f = view.focal / dz;
        const sx = view.cx + (box.x + lx * c + lz * s) * f;
        const sy = view.cy - (y - view.eye) * f;
        if (sx < minx) minx = sx;
        if (sx > maxx) maxx = sx;
        if (sy < miny) miny = sy;
        if (sy > maxy) maxy = sy;
      }
      const w = Math.min(maxx, 1280) - Math.max(minx, 0);
      const h = Math.min(maxy, 720) - Math.max(miny, 0);
      return w > 24 && h > 12;
    }
    ctx.SAMPLER.paint(g, 1280, 720, 'pop', who);
    const popSofa = ctx.SAMPLER.tech('pop').filter((b) => b.fill === '#ff2a3d');
    if (!popSofa.some((b) => onScreen(b, ctx.SAMPLER.view))) fail.push('pop sofa is off the frame');
    ctx.SAMPLER.paint(g, 1280, 720, 'wood', who);
    const woodSofa = ctx.SAMPLER.tech('wood').filter((b) => b.fill === '#7a3428');
    if (!woodSofa.some((b) => onScreen(b, ctx.SAMPLER.view))) fail.push('wood sofa is off the frame');
    ctx.SAMPLER.paint(g, 1280, 720, 'house', Object.assign({ save: { theme: '#3ee6ff', furniture: 'sofa', petBed: true, sign: 'ELLIE' } }, who));
    const bed = ctx.SAMPLER.houseParts({ theme: '#3ee6ff', furniture: 'sofa', petBed: true, sign: 'ELLIE' }).filter((b) => b.fill === '#7dff6b');
    const glow = ctx.SAMPLER.houseParts({ theme: '#3ee6ff', furniture: 'sofa', petBed: true, sign: 'ELLIE' }).filter((b) => b.fill === '#3ee6ff');
    if (!bed.some((b) => onScreen(b, ctx.SAMPLER.view))) fail.push('house pet bed is off the frame');
    if (!glow.some((b) => onScreen(b, ctx.SAMPLER.view))) fail.push('house screen glow is off the frame');
  }
}
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
