'use strict';
// Solids must not cover a road, a bridge, or a ramp. Arches are gates and may
// span the street. Shops face the curb with a 4 m sidewalk. Run:
//   node tools/street-overlap-check.js
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'world/city-layout.js'), 'utf8');
const city = fs.readFileSync(path.join(root, 'world/city.js'), 'utf8');
const ctx = {};
ctx.globalThis = ctx;
vm.runInNewContext(src, ctx);
const L = ctx.CITY_LAYOUT;
const places = L.places;
const roads = L.roads;
const fails = [];
const notes = [];

function hit(a, b) {
  return a.x1 > b.x0 && a.x0 < b.x1 && a.z1 > b.z0 && a.z0 < b.z1;
}
function roadBox(r) {
  const half = (r.w || 20) / 2;
  if (Math.abs(r.x0 - r.x1) < 1.5) {
    const z0 = Math.min(r.z0, r.z1), z1 = Math.max(r.z0, r.z1);
    return { x0: r.x0 - half, x1: r.x0 + half, z0: z0, z1: z1, kind: r.kind };
  }
  if (Math.abs(r.z0 - r.z1) < 1.5) {
    const x0 = Math.min(r.x0, r.x1), x1 = Math.max(r.x0, r.x1);
    return { x0: x0, x1: x1, z0: r.z0 - half, z1: r.z0 + half, kind: r.kind };
  }
  return null;
}
function rampBox(name, x, z, rot, ov) {
  const F = {
    ramp_big: { w: 16, d: 60 }, ramp_small: { w: 14, d: 40 }, ramp_kick: { w: 8, d: 10 },
    ramp_med: { w: 12, d: 24 }, ramp_launch: { w: 16, d: 60 }, ramp_curb: { w: 10, d: 5 },
    ramp_bank: { w: 20, d: 30 }, road_crest: { w: 20, d: 19 }
  };
  const f = F[name];
  const w = ov && ov.w != null ? ov.w : f.w;
  const d = f.d;
  const swap = ((rot % 180) + 180) % 180 === 90;
  const ww = swap ? d : w, dd = swap ? w : d;
  return { x0: x - ww / 2, x1: x + ww / 2, z0: z - dd / 2, z1: z + dd / 2, kind: name };
}

if (places.length !== 37) fails.push('place count ' + places.length + ' (want 37)');
const solids = places.filter(p => p.kind !== 'arch');
const arches = places.filter(p => p.kind === 'arch');
if (solids.length !== 33) fails.push('solid count ' + solids.length + ' (want 33)');
if (arches.length !== 4) fails.push('arch count ' + arches.length + ' (want 4)');

const dance = places.find(p => p.purpose === 'DANCE');
if (!dance || dance.x1 - dance.x0 !== 60 || dance.z1 - dance.z0 !== 64 || dance.h !== 18) fails.push('dance wall size changed');
if (!dance || dance.x1 !== -1004) fails.push('dance east face is not on the stage sidewalk');
const tower = places.find(p => p.kind === 'tower');
if (!tower || tower.h !== 239 || tower.x0 !== 365 || tower.z0 !== 1685) fails.push('sky tower moved');
for (const p of places) {
  if (p.purpose === 'GARAGE' && p.kind === 'garage' && p.h !== 26) fails.push('homestead garage height');
  if (p.purpose === 'SHOWROOM' && p.h !== 18) fails.push('showroom height');
  if (p.kind === 'deck' && p.h !== 62) fails.push('jump roof height');
  if (p.kind === 'nos' && p.h !== 34) fails.push('NOS depot height');
}
const kits = places.filter(p => p.kind === 'kitnos');
if (kits.length !== 3) fails.push('kit NOS count ' + kits.length);
for (const p of kits) {
  const span = Math.max(p.x1 - p.x0, p.z1 - p.z0);
  const depth = Math.min(p.x1 - p.x0, p.z1 - p.z0);
  if (span < 20 || depth < 16 || p.h < 8) fails.push('kit NOS ' + p.district + ' is still too small');
}

const blockers = [];
for (const r of roads) {
  if (r.kind === 'water') continue;
  const b = roadBox(r);
  if (b) blockers.push(b);
}
for (const b of L.bridges) blockers.push({ x0: Math.min(b.x0, b.x1), x1: Math.max(b.x0, b.x1), z0: Math.min(b.z0, b.z1), z1: Math.max(b.z0, b.z1), kind: 'bridge-deck' });
const RIV = { z0: 1780, z1: 1840, land: 6 };
const riverZ = (name, rot) => {
  const d = { ramp_launch: 60, ramp_med: 24, ramp_kick: 10 }[name];
  return rot ? RIV.z1 + RIV.land + 2 + d / 2 : RIV.z0 - RIV.land - 2 - d / 2;
};
const ramps = [
  rampBox('ramp_big', 50, 790, 0, { w: 16 }), rampBox('ramp_small', 250, 350, 0, { w: 14 }), rampBox('ramp_big', -450, 1630, 0, { w: 24 }),
  rampBox('ramp_med', 120, 150, 0), rampBox('ramp_kick', 120, 420, 0), rampBox('ramp_launch', 120, 640, 0),
  rampBox('ramp_med', 120, 1000, 180), rampBox('ramp_kick', 120, 1250, 0), rampBox('ramp_kick', 125, 1390, 180),
  rampBox('ramp_med', -40, 520, 0), rampBox('ramp_launch', -110, 700, 0), rampBox('ramp_kick', -40, 900, 0),
  rampBox('ramp_med', -110, 1100, 180), rampBox('ramp_kick', -40, 1250, 0), rampBox('ramp_kick', -125, 1600, 180), rampBox('ramp_kick', -40, 60, 180),
  rampBox('ramp_bank', 300, -345, 180), rampBox('ramp_bank', -300, -345, 180), rampBox('ramp_bank', 600, 520, 90),
  rampBox('ramp_bank', 600, 1500, 90), rampBox('ramp_bank', -600, 960, 270), rampBox('ramp_bank', 300, 2150, 0),
  rampBox('ramp_bank', -260, 2150, 0), rampBox('ramp_bank', -600, 1500, 270),
  rampBox('road_crest', 400, 300, 90), rampBox('road_crest', -300, 900, 270), rampBox('road_crest', 350, 1400, 0),
  rampBox('road_crest', -250, 300, 180), rampBox('road_crest', 450, -200, 0)
];
for (const [name, x, rot] of [['ramp_launch', 120, 0], ['ramp_med', -100, 0], ['ramp_kick', -40, 0], ['ramp_med', 100, 180], ['ramp_launch', -120, 180], ['ramp_kick', 60, 180], ['ramp_med', 250, 0], ['ramp_kick', -250, 0], ['ramp_med', 300, 180], ['ramp_med', -250, 180]]) {
  ramps.push(rampBox(name, x, riverZ(name, rot), rot));
}
blockers.push.apply(blockers, ramps);
const tun = L.anchors.tunnel;
blockers.push({ x0: tun.bx0, x1: tun.bx1, z0: tun.z0 - 40, z1: tun.z1 + 40, kind: 'tunnel-bore' });
blockers.push({ x0: -16, x1: 16, z0: -60, z1: 1500, kind: 'runway' });
blockers.push({ x0: 38, x1: 62, z0: -20, z1: 1450, kind: 'taxiway' });
blockers.push({ x0: -16, x1: 16, z0: -30, z1: 40, kind: 'spawn' });

for (const p of solids) {
  for (const b of blockers) if (hit(p, b)) fails.push(p.district + ' ' + p.name + ' ' + p.kind + ' overlaps ' + b.kind);
  const dist = L.districts.find(d => d.id === p.district);
  const cx = (p.x0 + p.x1) / 2, cz = (p.z0 + p.z1) / 2;
  if (!dist || cx < dist.x0 || cx > dist.x1 || cz < dist.z0 || cz > dist.z1) fails.push(p.name + ' center left ' + p.district);
}
if (places.find(p => p.purpose === 'SOCCER' && (p.x0 + p.x1) / 2 < 350)) fails.push('soccer left the east side');
for (let i = 0; i < solids.length; i++) for (let j = i + 1; j < solids.length; j++) {
  if (hit(solids[i], solids[j])) fails.push(solids[i].name + '/' + solids[i].district + ' overlaps ' + solids[j].name + '/' + solids[j].district);
}
const pitch = L.anchors.field;
for (const p of solids) {
  if (p.purpose === 'SOCCER') continue;
  const box = { x0: pitch.cx - pitch.rx, x1: pitch.cx + pitch.rx, z0: pitch.cz - pitch.ry, z1: pitch.cz + pitch.ry, kind: 'pitch' };
  if (hit(p, box)) fails.push(p.name + ' sits on the soccer pitch');
}

function faceGap(p) {
  let best = null;
  const faces = [
    { face: 's', fix: p.z0, ax: 'x' }, { face: 'n', fix: p.z1, ax: 'x' },
    { face: 'w', fix: p.x0, ax: 'z' }, { face: 'e', fix: p.x1, ax: 'z' }
  ];
  for (const r of roads) {
    if (r.kind !== 'street' && r.kind !== 'lane') continue;
    const box = roadBox(r);
    if (!box) continue;
    for (const f of faces) {
      let gap = null;
      if (f.ax === 'x' && p.x1 > box.x0 && p.x0 < box.x1) {
        if (f.face === 's') gap = f.fix - box.z1;
        if (f.face === 'n') gap = box.z0 - f.fix;
      }
      if (f.ax === 'z' && p.z1 > box.z0 && p.z0 < box.z1) {
        if (f.face === 'w') gap = f.fix - box.x1;
        if (f.face === 'e') gap = box.x0 - f.fix;
      }
      if (gap == null || gap < 0) continue;
      if (!best || gap < best.gap) best = { gap: gap, face: f.face, kind: r.kind };
    }
  }
  return best;
}
for (const p of solids) {
  if (p.kind === 'tower' || p.kind === 'deck') continue;
  const g = faceGap(p);
  if (!g || g.gap < 3 || g.gap > 6) fails.push(p.district + ' ' + p.name + ' sidewalk ' + (g ? g.gap.toFixed(1) + ' m ' + g.face : 'none'));
}
let gatesOnRoad = 0;
for (const p of arches) {
  for (const r of roads) {
    const b = roadBox(r);
    if (b && hit(p, b)) gatesOnRoad++;
  }
}
if (gatesOnRoad < arches.length) fails.push('a gate is no longer on its road');

const net = L.buildNetwork();
const spurHits = [];
for (const s of net.roads) {
  if (!s.spur) continue;
  const b = roadBox(s);
  if (!b) continue;
  for (const p of solids) if (hit(p, b)) spurHits.push(p.name);
}
if (spurHits.length) fails.push('driveway spur runs through ' + spurHits.join(', '));
const spine = net.roads.filter(r => Math.abs(r.x0 - 840) < 0.1 && Math.abs(r.x1 - 840) < 0.1);
const rowOpen = spine.some(r => Math.min(r.z0, r.z1) <= -740 && Math.max(r.z0, r.z1) >= -584);
if (!rowOpen) fails.push('builder bay street does not run the house row');
notes.push('spurs ' + net.roads.filter(r => r.spur).length);
notes.push('faces ' + Object.keys(net.faces).length);

if (!/\['ramp_kick',-40,0\]/.test(city) || !/\['ramp_kick',60,180\]/.test(city) || !/\['ramp_kick',-250,0\]/.test(city)) {
  fails.push('river-edge ramp list changed');
}
if (!/tunnel: \{z0:500, z1:700, x0:-530, x1:-370, bx0:-465, bx1:-435\}/.test(src)) fails.push('tunnel anchor changed');
if (!/p\.purpose==='DANCE'\?'e'/.test(city)) fails.push('dance face is no longer forced east');

const mainKinds = { home: 1, pets: 1, garage: 1, tower: 1, deck: 1, show: 1, paint: 1, cafe: 1, dance: 1, arcade: 1, builder: 1, soccer: 1, arch: 1 };
const extraKinds = { nos: 1, kitnos: 1, bay: 1, pad: 1, snack: 1 };
const extraType = k => k === 'kitnos' ? 'nos' : k;
const chosen = {};
for (const p of places) {
  if (!extraKinds[p.kind]) continue;
  const key = p.district + ':' + extraType(p.kind);
  const area = (p.x1 - p.x0) * (p.z1 - p.z0);
  if (!chosen[key] || area > chosen[key].area) chosen[key] = { name: p.district + ' ' + p.name, area: area };
}
const mains = places.filter(p => mainKinds[p.kind] || p.landmark).map(p => p.district + ' ' + p.kind + ' ' + p.name);
notes.push('minimap mains ' + mains.length + ': ' + mains.join(', '));
notes.push('minimap extras ' + Object.keys(chosen).length + ': ' + Object.values(chosen).map(v => v.name).join(', '));
notes.push('pois kept: airport, soccer ball, track flag');

if (fails.length) {
  console.error(fails.join('\n'));
  process.exit(1);
}
console.log('street-overlap-check OK');
console.log(notes.join('\n'));
