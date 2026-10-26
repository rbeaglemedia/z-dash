'use strict';
// Validates the two proposed Neon World layouts and writes top-down SVGs.
// World: +x east, +z north. Roads every 100 m in x and 200 m in z.
import fs from 'fs';
import { buildRamps, PLAZAS_NOW, PLAZAS_AB, checkClear, sameGeometry, inventoryLines, HALFPIPE, LOOP } from './ramps.mjs';

const ROADX = [-550, -450, -350, -250, -150, 150, 250, 350, 450, 550];
const ROADZ = [-300, -100, 100, 300, 500, 700, 900, 1100, 1300, 1500, 1700, 1900, 2100];
const HW = { x: -450, hw: 15 };
const TUN = { x0: -530, x1: -370, z0: 500, z1: 700, bx0: -465, bx1: -435, ceil: 10, top: 34 };
// Bore extended 60 m past each mouth. That is the lead-in the tunnel drawing already uses.
const APPROACH = [
  { x0: -465, x1: -435, z0: 440, z1: 500, tag: 'south-mouth' },
  { x0: -465, x1: -435, z0: 700, z1: 760, tag: 'north-mouth' }
];
const RIV = { z0: 1780, z1: 1840 };
const PARK = { x0: -340, x1: -160, z0: 1010, z1: 1190 };
const ZONE = { x0: -400, x1: 540, z0: 1860, z1: 2100 };
const TOWS = [[254, 600], [-354, 1200], [-154, 800], [-246, 0], [154, 1600], [-546, 400]];

const CUR = [
  [1, 'GARAGE', 'GARAGE', 168, 232, 118, 282, 26, 's', 'SPAWN_SOUTH'],
  [2, 'SKY DROP', 'SKY_DROP', -232, -168, 518, 682, 62, 's', 'ARTS_GARAGE'],
  [3, 'SHOWROOM', 'SHOWROOM', 168, 232, 918, 1082, 18, 's', 'DOWNTOWN_CORE'],
  [4, 'NOS', 'NOS', -332, -268, 1518, 1682, 34, 's', 'PARKSIDE_WEST'],
  [5, 'SKY TOWER', 'SKY_DROP', 465, 535, 1165, 1235, 239, 'w', 'DOWNTOWN_CORE'],
  [6, 'HOME', 'HOME', 264, 308, 140, 188, 11, 'w', 'SPAWN_SOUTH'],
  [7, 'SHOWROOM', 'SHOWROOM', 364, 428, 140, 196, 16, 'w', 'SPAWN_SOUTH'],
  [8, 'NOS', 'NOS', -236, -196, 140, 186, 12, 'w', 'SPAWN_SOUTH'],
  [9, 'GARAGE', 'GARAGE', 464, 512, 364, 454, 15, 'w', 'SPORTS_EAST'],
  [10, 'PAINT', 'NEON_PAINT', -336, -292, 360, 408, 14, 'w', 'ARTS_GARAGE'],
  [11, 'PAINT', 'NEON_PAINT', -336, -292, 760, 808, 15, 'w', 'PARKSIDE_WEST'],
  [12, 'DANCE', 'DANCE', -224, -164, 360, 424, 18, 'e', 'ARTS_GARAGE'],
  [13, 'ARCADE', 'ARCADE', 264, 320, 560, 624, 18, 'w', 'ARTS_GARAGE'],
  [14, 'HOME', 'HOME', -536, -496, 960, 1008, 12, 'w', 'PARKSIDE_WEST'],
  [15, 'PETS', 'PETS', -536, -496, 1164, 1212, 12, 'w', 'PARKSIDE_WEST'],
  [16, 'PETS', 'PETS', -408, -364, 964, 1012, 13, 'e', 'PARKSIDE_WEST'],
  [17, 'CAFE', 'CAFE', -336, -292, 1314, 1362, 12, 's', 'PARKSIDE_WEST'],
  [18, 'DANCE', 'DANCE', 264, 324, 1160, 1224, 20, 'w', 'DOWNTOWN_CORE'],
  [19, 'CAFE', 'CAFE', 364, 412, 1364, 1412, 13, 'w', 'DOWNTOWN_CORE'],
  [20, 'ARCADE', 'ARCADE', 464, 516, 760, 824, 17, 'w', 'SPORTS_EAST'],
  [21, 'SOCCER', 'SOCCER', 480, 536, 198, 286, 16, 'n', 'SPORTS_EAST'],
  [22, 'SOCCER', 'SOCCER', 480, 536, 1018, 1086, 16, 'n', 'SPORTS_EAST'],
  [23, 'BUILDER', 'BUILDER', 164, 208, 1856, 1888, 15, 'n', 'BUILDER_NORTH'],
  [24, 'BUILDER', 'BUILDER', 364, 408, 1856, 1886, 16, 'n', 'BUILDER_NORTH']
];

// Shared moves. Sky Drop (seed 2) differs per option.
// Walls sit 4 m outside a 10 m curb so doorsOf still finds a street face (8 m tolerance).
const BASE = [
  // South auto sits north of the park, so the park is the gap between home street and the car shops.
  [1, 'GARAGE', 'GARAGE', -428, -364, 1314, 1478, 26, 'e', 'AUTO'],
  [10, 'PAINT', 'NEON_PAINT', -534, -490, 1314, 1362, 14, 'w', 'AUTO'],
  [7, 'SHOWROOM', 'SHOWROOM', -534, -470, 1426, 1482, 16, 'n', 'AUTO'],
  [9, 'GARAGE', 'GARAGE', -312, -264, 1396, 1486, 15, 'n', 'AUTO'],
  // North auto, east of the runway and north of the tower, so the west highway between the rows stays empty.
  [4, 'NOS', 'NOS', 364, 428, 1514, 1678, 34, 'w', 'AUTO'],
  [3, 'SHOWROOM', 'SHOWROOM', 164, 228, 1514, 1678, 18, 'w', 'AUTO'],
  [11, 'PAINT', 'NEON_PAINT', 492, 536, 1514, 1562, 15, 'e', 'AUTO'],
  [8, 'NOS', 'NOS', 496, 536, 1640, 1686, 12, 'n', 'AUTO'],
  [5, 'SKY TOWER', 'SKY_DROP', 465, 535, 1165, 1235, 239, 'w', 'DOWNTOWN_CORE'],
  // South home street, just north of z=300.
  [6, 'HOME', 'HOME', -408, -364, 314, 362, 11, 's', 'RESIDENTIAL'],
  [15, 'PETS', 'PETS', -336, -296, 314, 362, 12, 's', 'RESIDENTIAL'],
  [17, 'CAFE', 'CAFE', -534, -490, 314, 362, 12, 's', 'RESIDENTIAL'],
  // North home street, just south of z=900.
  [14, 'HOME', 'HOME', -404, -364, 838, 886, 12, 'n', 'RESIDENTIAL'],
  [16, 'PETS', 'PETS', -336, -292, 838, 886, 13, 'n', 'RESIDENTIAL'],
  [19, 'CAFE', 'CAFE', -534, -486, 838, 886, 13, 'n', 'RESIDENTIAL'],
  // Dance halls keep a 64 m east mural wall, far enough from the Sky Drop deck to stay out of its near ring.
  [12, 'DANCE', 'DANCE', -224, -164, 114, 178, 18, 'e', 'RESIDENTIAL'],
  [18, 'DANCE', 'DANCE', -224, -164, 914, 978, 20, 'e', 'RESIDENTIAL'],
  // Play, east of the runway, on the road that leads to the soccer dome.
  [13, 'ARCADE', 'ARCADE', 164, 220, 422, 486, 18, 'w', 'PLAY'],
  [20, 'ARCADE', 'ARCADE', 164, 216, 822, 886, 17, 'w', 'PLAY'],
  [21, 'SOCCER', 'SOCCER', 464, 520, 314, 402, 16, 's', 'PLAY'],
  [22, 'SOCCER', 'SOCCER', 464, 520, 410, 478, 16, 'w', 'PLAY'],
  // Builder HQs stay on today's pads. Sliding them onto the bank clips the north-bank river jumps.
  [23, 'BUILDER', 'BUILDER', 164, 208, 1856, 1888, 15, 'n', 'BUILDER_NORTH'],
  [24, 'BUILDER', 'BUILDER', 364, 408, 1856, 1886, 16, 'n', 'BUILDER_NORTH']
];
const SKY_A = [2, 'SKY DROP', 'SKY_DROP', -232, -168, 518, 682, 62, 's', 'RESIDENTIAL'];
const SKY_B = [2, 'SKY DROP', 'SKY_DROP', 264, 328, 518, 682, 62, 's', 'PLAY'];
const OPT_A = [SKY_A, ...BASE].sort((a, b) => a[0] - b[0]);
const OPT_B = [SKY_B, ...BASE].sort((a, b) => a[0] - b[0]);

const PLAZAS = PLAZAS_NOW;

function box(b) { return { id: b[0], name: b[1], purpose: b[2], x0: b[3], x1: b[4], z0: b[5], z1: b[6], h: b[7], face: b[8], district: b[9] }; }
function overlap(a, b) {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;
}
function extRamp(x, z, w, d, rot) {
  const swap = ((rot % 180) + 180) % 180 === 90;
  const W = swap ? d : w, D = swap ? w : d;
  return { x0: x - W / 2, x1: x + W / 2, z0: z - D / 2, z1: z + D / 2 };
}
// Fixed ramps only, used as a building-footprint clearance check. The full set, including plazas, is drawn.
const PF = { kick: [8, 10], med: [12, 24], launch: [16, 60], small: [14, 40], big: [16, 60], bank: [20, 30], crest: [20, 19] };
function rampAt(tag, kind, x, z, rot, w, d) {
  const base = PF[kind];
  return Object.assign(extRamp(x, z, w || base[0], d || base[1], rot || 0), { tag });
}
const RAMPS = [];
{
  const land = 6, zS = (d) => 1780 - land - 2 - d / 2, zN = (d) => 1840 + land + 2 + d / 2;
  const add = (tag, kind, x, z, rot, w, d) => RAMPS.push(rampAt(tag, kind, x, z, rot, w, d));
  add('garage-kick', 'kick', 528, 409, 0);
  add('taxi', 'big', 50, 790, 0, 16, 60);
  add('street', 'small', 250, 350, 0, 14, 40);
  add('hwy', 'big', -450, 1630, 0, 24, 60);
  for (const [k, x, z, rot] of [['med', 120, 150, 0], ['kick', 120, 420, 0], ['launch', 120, 640, 0], ['med', 120, 1000, 180], ['kick', 120, 1250, 0], ['kick', 125, 1390, 180],
    ['med', -40, 520, 0], ['launch', -110, 700, 0], ['kick', -40, 900, 0], ['med', -110, 1100, 180], ['kick', -40, 1250, 0], ['kick', -125, 1600, 180], ['kick', -40, 60, 180]]) add('air', k, x, z, rot);
  for (const [k, x, rot] of [['launch', 120, 0], ['med', -100, 0], ['kick', -40, 0], ['med', 100, 180], ['launch', -120, 180], ['kick', 60, 180], ['med', 250, 0], ['kick', -250, 0], ['med', 300, 180], ['med', -250, 180]]) {
    const d = PF[k][1];
    add('river', k, x, rot ? zN(d) : zS(d), rot);
  }
  for (const [x, z, rot] of [[300, -345, 180], [-300, -345, 180], [600, 520, 90], [600, 1500, 90], [-600, 960, 270], [300, 2150, 0], [-260, 2150, 0], [-600, 1500, 270]]) add('bank', 'bank', x, z, rot);
  for (const [x, z, rot] of [[400, 300, 90], [-300, 900, 270], [350, 1400, 0], [-250, 300, 180], [450, -200, 0]]) add('crest', 'crest', x, z, rot);
  RAMPS.push(Object.assign(extRamp(-95, 260, 64, 120, 0), { tag: 'halfpipe' }));
}
// doorsOf: a wall is a street face when it sits within 8 m of a 10 m curb.
function streetFace(b) {
  const roadsX = [-550, -350, -250, -150, 150, 250, 350, 450, 550];
  const tol = 8, curb = 10;
  for (const x of roadsX) {
    if ((b.x1 <= x - curb && x - curb - b.x1 <= tol) || (b.x0 >= x + curb && b.x0 - (x + curb) <= tol)) return true;
  }
  for (const z of ROADZ) {
    if (z > 1770 && z < 1850) continue;
    if ((b.z1 <= z - curb && z - curb - b.z1 <= tol) || (b.z0 >= z + curb && b.z0 - (z + curb) <= tol)) return true;
  }
  return false;
}
function gapRoad(b) {
  const hits = [];
  for (const x of ROADX) {
    const hw = x === HW.x ? HW.hw : 10;
    if (b.x0 < x + hw + 2 && b.x1 > x - hw - 2 && b.z1 > -400 && b.z0 < 2200) {
      // only if the building's x-range meets the road AND it isn't just beside it for its whole z
      if (b.x0 < x + hw && b.x1 > x - hw) hits.push('x' + x);
    }
  }
  for (const z of ROADZ) {
    if (b.z0 < z + 12 && b.z1 > z - 12 && b.x1 > -700 && b.x0 < 700) {
      if (b.z0 < z + 10 && b.z1 > z - 10) hits.push('z' + z);
    }
  }
  return hits;
}
function validate(name, list) {
  const B = list.map(box);
  const problems = [];
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
    if (overlap(B[i], B[j])) problems.push('overlap ' + B[i].id + ' ' + B[j].id);
  }
  for (const b of B) {
    const hits = gapRoad(b);
    if (hits.length) problems.push('road ' + b.id + ' ' + hits.join(','));
    if (overlap(b, TUN)) problems.push('tunnel ' + b.id);
    for (const a of APPROACH) if (overlap(b, a)) problems.push('approach ' + b.id + ' ' + a.tag);
    if (b.z1 > RIV.z0 && b.z0 < RIV.z1) problems.push('river ' + b.id);
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    if (Math.abs(cx) < 140 && cz > -80 && cz < 1700) problems.push('runway ' + b.id);
    if (overlap(b, PARK)) problems.push('park ' + b.id);
    if (b.purpose === 'BUILDER') {
      // Today's HQs already sit 4 m south of the sandbox line, on the bank, clear of the water.
      if (b.x0 < ZONE.x0 || b.x1 > ZONE.x1 || b.z0 < 1850 || b.z1 > ZONE.z1) problems.push('zone ' + b.id);
    } else if (overlap(b, ZONE)) problems.push('in-zone ' + b.id);
    const cur = CUR.find(c => c[0] === b.id);
    if (cur[7] !== b.h) problems.push('height ' + b.id);
    if ((cur[4] - cur[3]) !== (b.x1 - b.x0) || (cur[6] - cur[5]) !== (b.z1 - b.z0)) problems.push('footprint ' + b.id + ' cur ' + (cur[4] - cur[3]) + 'x' + (cur[6] - cur[5]) + ' now ' + (b.x1 - b.x0) + 'x' + (b.z1 - b.z0));
    if (b.purpose === 'DANCE' && (b.z1 - b.z0) < 64) problems.push('mural ' + b.id);
    if (name !== 'current') {
      for (const r of RAMPS) if (overlap(b, r)) problems.push('ramp ' + b.id + ' ' + r.tag);
      if (!streetFace(b)) problems.push('no-street-face ' + b.id);
    }
    for (const [tx, tz] of TOWS) {
      if (tx > b.x0 - 6 && tx < b.x1 + 6 && tz > b.z0 - 6 && tz < b.z1 + 6) problems.push('tow ' + b.id + ' @' + tx + ',' + tz);
    }
  }
  const sizes = {};
  for (const b of B) sizes[b.purpose] = (sizes[b.purpose] || 0) + 1;
  return { name, problems, sizes, n: B.length };
}

function nearCount(list, x, z, r) {
  let n = 0; const names = [];
  for (const raw of list) {
    const b = box(raw);
    const dx = x < b.x0 ? b.x0 - x : x > b.x1 ? x - b.x1 : 0;
    const dz = z < b.z0 ? b.z0 - z : z > b.z1 ? z - b.z1 : 0;
    const d = Math.hypot(dx, dz);
    if (d <= r) { n++; names.push(b.id + b.name); }
  }
  return { n, names };
}

const cams = [
  ['runway spawn', 0, 40],
  ['south home street', -400, 300],
  ['south dance', -190, 100],
  ['sky drop west', -200, 600],
  ['north home street', -400, 900],
  ['north dance', -190, 950],
  ['auto south road', -400, 1400],
  ['open highway', -450, 1650],
  ['auto north road', 300, 1600],
  ['east play', 320, 450],
  ['option B deck', 296, 600],
  ['tower face', 380, 1200],
  ['stadium gate', 640, 300],
  ['builder bridge', 200, 1900],
  ['air south', 0, -200]
];

function report(list) {
  const rows = [];
  for (const [label, x, z] of cams) {
    const n170 = nearCount(list, x, z, 170);
    const n950 = nearCount(list, x, z, 950);
    rows.push({ label, x, z, near170: n170.n, names: n170.names.join(' '), draw950: n950.n });
  }
  return rows;
}

function worst(list) {
  let max = 0, spots = [];
  const consider = (label, x, z) => {
    const n = nearCount(list, x, z, 170);
    if (n.n > max) { max = n.n; spots = [{ label, x, z, names: n.names }]; }
    else if (n.n === max && n.n > 0) spots.push({ label, x, z, names: n.names });
  };
  for (const x of ROADX) for (const z of ROADZ) {
    if (z > 1770 && z < 1850) continue;
    consider('road ' + x + ',' + z, x, z);
  }
  for (const raw of list) {
    const b = box(raw);
    consider('at ' + b.name + b.id, (b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2);
  }
  let gridMax = 0, gridAt = null;
  for (let x = -560; x <= 560; x += 20) for (let z = -300; z <= 2100; z += 20) {
    const n = nearCount(list, x, z, 170);
    if (n.n > gridMax) { gridMax = n.n; gridAt = { x, z, names: n.names }; }
  }
  return { max, sample: spots.slice(0, 6), gridMax, gridAt };
}
function plazaHits(list) {
  const hits = [];
  for (const raw of list) {
    const b = box(raw);
    for (const lot of PLAZAS) if (overlap(b, { x0: lot[0], x1: lot[1], z0: lot[2], z1: lot[3] })) hits.push(b.id + ' ' + b.name + ' lot ' + lot.join(','));
  }
  return hits;
}
const va = validate('A', OPT_A);
const vb = validate('B', OPT_B);
const vc = validate('current', CUR);
console.log(JSON.stringify({ current: vc, A: va, B: vb }, null, 2));
console.log('---COUNTS current---');
console.log(JSON.stringify(report(CUR), null, 2));
console.log('---COUNTS A---');
console.log(JSON.stringify(report(OPT_A), null, 2));
console.log('---COUNTS B---');
console.log(JSON.stringify(report(OPT_B), null, 2));
console.log('---WORST---');
console.log(JSON.stringify({ current: worst(CUR), A: worst(OPT_A), B: worst(OPT_B) }, null, 2));
console.log('---PLAZA---');
console.log(JSON.stringify({ A: plazaHits(OPT_A), B: plazaHits(OPT_B) }));
function mouthGap(list) {
  const mouths = [['south', -450, 500], ['north', -450, 700]];
  return mouths.map(([label, x, z]) => {
    let best = 1e9, id = '';
    for (const raw of list) {
      const b = box(raw);
      const dx = x < b.x0 ? b.x0 - x : x > b.x1 ? x - b.x1 : 0;
      const dz = z < b.z0 ? b.z0 - z : z > b.z1 ? z - b.z1 : 0;
      const d = Math.hypot(dx, dz);
      if (d < best) { best = d; id = b.id + ' ' + b.name; }
    }
    return { label, nearest: id, meters: Math.round(best) };
  });
}
console.log('---TUNNEL---');
console.log(JSON.stringify({ changes: 'none', A: mouthGap(OPT_A), B: mouthGap(OPT_B) }));

const rampsNow = buildRamps(PLAZAS_NOW);
const rampsAB = buildRamps(PLAZAS_AB);
const geom = sameGeometry(rampsNow, rampsAB);
const boxList = (list) => list.map(box);
const rampReport = {
  pieces: rampsNow.length,
  geometry: geom || 'same height, length, width, rotation',
  current: checkClear(rampsNow, boxList(CUR)),
  A: checkClear(rampsAB, boxList(OPT_A)),
  B: checkClear(rampsAB, boxList(OPT_B)),
  halfpipe: HALFPIPE,
  loop: LOOP.note
};
console.log('---RAMPS---');
console.log(JSON.stringify(rampReport, null, 2));
if (geom || rampReport.A.length || rampReport.B.length) {
  console.error('RAMP CHECK FAILED');
  process.exitCode = 1;
}

const COL = {
  HOME: '#7dff6b', SHOWROOM: '#3ee6ff', NEON_PAINT: '#ff4fd8', GARAGE: '#ffb020',
  NOS: '#ffe14d', DANCE: '#ff4fd8', PETS: '#7dff6b', CAFE: '#ff2a3d',
  ARCADE: '#3ee6ff', SKY_DROP: '#9ffbff', SOCCER: '#ffb020', BUILDER: '#b6ff9a'
};

function rampArrow(r) {
  const cx = (r.x0 + r.x1) / 2, cz = (r.z0 + r.z1) / 2;
  if (r.dir === 0) return [[r.x0, r.z0], [r.x1, r.z0], [cx, r.z1]];
  if (r.dir === 2) return [[r.x0, r.z1], [r.x1, r.z1], [cx, r.z0]];
  if (r.dir === 1) return [[r.x0, r.z0], [r.x0, r.z1], [r.x1, cz]];
  return [[r.x1, r.z0], [r.x1, r.z1], [r.x0, cz]];
}
function rampFill(r) {
  if (r.group === 'river') return '#f4feff';
  if (r.group === 'airport' || r.nm === 'taxiway') return '#7ee7ff';
  if (r.group === 'plaza') return '#ffb020';
  if (r.group === 'tow') return '#ffe14d';
  if (r.group === 'bank' || r.group === 'crest') return '#cbb6e6';
  return '#ff8a3d';
}

function svgFor(title, subtitle, list, districts, ramps) {
  const x0 = -700, x1 = 1280, z0 = -420, z1 = 2280;
  const W = 1400, H = 1860, padL = 70, padR = 250, padT = 92, padB = 70;
  const iw = W - padL - padR, ih = H - padT - padB;
  const X = x => padL + (x - x0) / (x1 - x0) * iw;
  const Y = z => padT + (z1 - z) / (z1 - z0) * ih;
  const parts = [];
  parts.push(`<rect width="${W}" height="${H}" fill="#070314"/>`);
  parts.push(`<text x="36" y="40" fill="#e9fbff" font-family="ui-sans-serif,Segoe UI,sans-serif" font-size="28" font-weight="700">${title}</text>`);
  parts.push(`<text x="36" y="68" fill="#b9a8d4" font-family="ui-sans-serif,Segoe UI,sans-serif" font-size="16">${subtitle}</text>`);
  // district washes
  for (const d of districts) {
    parts.push(`<rect x="${X(d.x0)}" y="${Y(d.z1)}" width="${X(d.x1) - X(d.x0)}" height="${Y(d.z0) - Y(d.z1)}" fill="${d.fill}" stroke="${d.stroke}" stroke-dasharray="5 4"/>`);
    parts.push(`<text x="${X((d.x0 + d.x1) / 2)}" y="${Y(d.z1) + 16}" fill="${d.stroke}" font-size="13" font-family="ui-sans-serif,sans-serif" text-anchor="middle">${d.label}</text>`);
  }
  // flying lane
  parts.push(`<rect x="${X(-140)}" y="${Y(1700)}" width="${X(140) - X(-140)}" height="${Y(-60) - Y(1700)}" fill="rgba(62,230,255,0.05)" stroke="none"/>`);
  // runway
  parts.push(`<rect x="${X(-16)}" y="${Y(1500)}" width="${X(16) - X(-16)}" height="${Y(-60) - Y(1500)}" fill="rgba(62,230,255,0.35)" stroke="#e9fbff" stroke-width="1.2"/>`);
  parts.push(`<text x="${X(78)}" y="${Y(700)}" fill="#e9fbff" font-size="13" font-family="ui-sans-serif,sans-serif">AIRPORT</text>`);
  parts.push(`<text x="${X(78)}" y="${Y(676)}" fill="#9fd8ea" font-size="11" font-family="ui-sans-serif,sans-serif">fixed, with its ramps</text>`);
  // taxi
  parts.push(`<rect x="${X(38)}" y="${Y(1450)}" width="${X(62) - X(38)}" height="${Y(-20) - Y(1450)}" fill="none" stroke="#ffb020" stroke-width="1"/>`);
  // highway
  parts.push(`<rect x="${X(-465)}" y="${Y(2200)}" width="${X(-435) - X(-465)}" height="${Y(-400) - Y(2200)}" fill="rgba(255,176,32,0.35)"/>`);
  // roads
  for (const x of ROADX) {
    if (x === -450) continue;
    parts.push(`<line x1="${X(x)}" y1="${Y(-300)}" x2="${X(x)}" y2="${Y(1700)}" stroke="rgba(62,230,255,0.35)" stroke-width="2"/>`);
    parts.push(`<line x1="${X(x)}" y1="${Y(1900)}" x2="${X(x)}" y2="${Y(2100)}" stroke="rgba(62,230,255,0.35)" stroke-width="2"/>`);
  }
  for (const z of ROADZ) {
    if (z > 1770 && z < 1850) continue;
    parts.push(`<line x1="${X(-560)}" y1="${Y(z)}" x2="${X(-150)}" y2="${Y(z)}" stroke="rgba(62,230,255,0.28)" stroke-width="2"/>`);
    parts.push(`<line x1="${X(150)}" y1="${Y(z)}" x2="${X(560)}" y2="${Y(z)}" stroke="rgba(62,230,255,0.28)" stroke-width="2"/>`);
  }
  // river
  parts.push(`<rect x="${X(-700)}" y="${Y(1840)}" width="${X(1280) - X(-700)}" height="${Y(1780) - Y(1840)}" fill="rgba(8,40,90,0.95)"/>`);
  parts.push(`<text x="${X(200)}" y="${Y(1810) + 4}" fill="#9ffbff" font-size="13" font-family="ui-sans-serif,sans-serif">RIVER</text>`);
  // bridges
  for (const [a, b, lab] of [[-14, 14, ''], [-465, -435, '']]) {
    parts.push(`<rect x="${X(a)}" y="${Y(1860)}" width="${X(b) - X(a)}" height="${Y(1760) - Y(1860)}" fill="#120a18" stroke="#ffb020"/>`);
  }
  parts.push(`<text x="${X(0)}" y="${Y(1868)}" fill="#ffb020" font-size="11" text-anchor="middle" font-family="ui-sans-serif,sans-serif">BRIDGE</text>`);
  parts.push(`<text x="${X(-450)}" y="${Y(1868)}" fill="#ffb020" font-size="11" text-anchor="middle" font-family="ui-sans-serif,sans-serif">HWY BRIDGE</text>`);
  // tunnel, unchanged. Pale bars are the 60 m bore approaches, kept clear.
  parts.push(`<rect x="${X(-530)}" y="${Y(700)}" width="${X(-370) - X(-530)}" height="${Y(500) - Y(700)}" fill="rgba(125,255,107,0.15)" stroke="#7dff6b" stroke-dasharray="4 3"/>`);
  parts.push(`<text x="${X(-450)}" y="${Y(600)}" fill="#7dff6b" font-size="11" text-anchor="middle" font-family="ui-sans-serif,sans-serif">TUNNEL</text>`);
  parts.push(`<text x="${X(-450)}" y="${Y(584)}" fill="#7dff6b" font-size="10" text-anchor="middle" font-family="ui-sans-serif,sans-serif">unchanged</text>`);
  for (const a of APPROACH) {
    parts.push(`<rect x="${X(a.x0)}" y="${Y(a.z1)}" width="${X(a.x1) - X(a.x0)}" height="${Y(a.z0) - Y(a.z1)}" fill="rgba(125,255,107,0.28)" stroke="#7dff6b"/>`);
  }
  // park
  parts.push(`<rect x="${X(PARK.x0)}" y="${Y(PARK.z1)}" width="${X(PARK.x1) - X(PARK.x0)}" height="${Y(PARK.z0) - Y(PARK.z1)}" fill="rgba(10,60,30,0.85)" stroke="#7dff6b"/>`);
  parts.push(`<text x="${X(-250)}" y="${Y(1100)}" fill="#7dff6b" font-size="13" text-anchor="middle" font-family="ui-sans-serif,sans-serif">PARK</text>`);
  // stadium
  parts.push(`<ellipse cx="${X(830)}" cy="${Y(300)}" rx="${(X(902) - X(758)) / 2}" ry="${(Y(198) - Y(402)) / 2}" fill="rgba(255,79,216,0.13)" stroke="#ff4fd8" stroke-width="2"/>`);
  parts.push(`<rect x="${X(778)}" y="${Y(380)}" width="${X(882) - X(778)}" height="${Y(220) - Y(380)}" fill="rgba(6,42,18,0.8)" stroke="#3ee6ff"/>`);
  parts.push(`<text x="${X(830)}" y="${Y(300)}" fill="#e9fbff" font-size="13" text-anchor="middle" font-family="ui-sans-serif,sans-serif">SOCCER DOME</text>`);
  // boulevard
  parts.push(`<line x1="${X(550)}" y1="${Y(300)}" x2="${X(778)}" y2="${Y(300)}" stroke="#ffb020" stroke-width="6"/>`);
  // track
  parts.push(`<ellipse cx="${X(1000)}" cy="${Y(1100)}" rx="${(X(1080) - X(920)) / 2}" ry="${(Y(920) - Y(1280)) / 2}" fill="none" stroke="#ff4fd8" stroke-width="3"/>`);
  parts.push(`<text x="${X(1000)}" y="${Y(1100)}" fill="#ff4fd8" font-size="12" text-anchor="middle" font-family="ui-sans-serif,sans-serif">TRACK</text>`);
  parts.push(`<line x1="${X(560)}" y1="${Y(1100)}" x2="${X(920)}" y2="${Y(1100)}" stroke="#ff4fd8" stroke-width="2"/>`);
  // builder grid
  parts.push(`<rect x="${X(ZONE.x0)}" y="${Y(ZONE.z1)}" width="${X(ZONE.x1) - X(ZONE.x0)}" height="${Y(ZONE.z0) - Y(ZONE.z1)}" fill="rgba(94,246,200,0.06)" stroke="#5ef6c8" stroke-dasharray="3 3"/>`);
  // buildings
  for (const raw of list) {
    const b = box(raw);
    const col = COL[b.purpose] || '#fff';
    parts.push(`<rect x="${X(b.x0)}" y="${Y(b.z1)}" width="${Math.max(3, X(b.x1) - X(b.x0))}" height="${Math.max(3, Y(b.z0) - Y(b.z1))}" fill="${col}" fill-opacity="0.85" stroke="#070314" stroke-width="1"/>`);
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    const tall = b.h >= 60 ? ' ★' : '';
    parts.push(`<text x="${X(cx)}" y="${Y(cz) + 4}" fill="#140818" font-size="11" font-weight="700" text-anchor="middle" font-family="ui-sans-serif,sans-serif">${b.name}${tall}</text>`);
  }
  // every ramp, tip points the way the car launches
  parts.push(`<rect x="${X(HALFPIPE.x0)}" y="${Y(HALFPIPE.z1)}" width="${X(HALFPIPE.x1) - X(HALFPIPE.x0)}" height="${Y(HALFPIPE.z0) - Y(HALFPIPE.z1)}" fill="none" stroke="#7ee7ff" stroke-width="1.4"/>`);
  parts.push(`<text x="${X(-95)}" y="${Y(260)}" fill="#7ee7ff" font-size="9" text-anchor="middle" font-family="ui-sans-serif,sans-serif">HALF-PIPE</text>`);
  parts.push(`<circle cx="${X(LOOP.x)}" cy="${Y(LOOP.z)}" r="7" fill="none" stroke="#ffb020" stroke-width="1.6"/>`);
  parts.push(`<text x="${X(LOOP.x)}" y="${Y(LOOP.z) - 10}" fill="#ffb020" font-size="9" text-anchor="middle" font-family="ui-sans-serif,sans-serif">LOOP</text>`);
  for (const r of ramps) {
    const raw = rampArrow(r).map((p) => [X(p[0]), Y(p[1])]);
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]);
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
    const midX = (Math.min(...xs) + Math.max(...xs)) / 2, midY = (Math.min(...ys) + Math.max(...ys)) / 2;
    const need = r.group === 'river' ? 9 : 6;
    const s = Math.max(1, need / Math.max(bw, bh, 0.8));
    const pts = raw.map((p) => (midX + (p[0] - midX) * s).toFixed(1) + ',' + (midY + (p[1] - midY) * s).toFixed(1)).join(' ');
    const stroke = r.group === 'river' ? '#3ee6ff' : '#140818';
    const sw = r.group === 'river' ? 1.3 : 0.4;
    parts.push(`<polygon points="${pts}" fill="${rampFill(r)}" fill-opacity="0.95" stroke="${stroke}" stroke-width="${sw}"/>`);
  }
  // spawn + sky drop launch
  parts.push(`<circle cx="${X(0)}" cy="${Y(0)}" r="7" fill="#fff" stroke="#3ee6ff" stroke-width="2"/>`);
  parts.push(`<text x="${X(0) + 12}" y="${Y(0) + 4}" fill="#fff" font-size="12" font-family="ui-sans-serif,sans-serif">SPAWN</text>`);
  parts.push(`<circle cx="${X(180)}" cy="${Y(520)}" r="5" fill="none" stroke="#ffe14d" stroke-width="2"/>`);
  parts.push(`<text x="${X(196)}" y="${Y(520)}" fill="#ffe14d" font-size="11" font-family="ui-sans-serif,sans-serif">SKY DROP START</text>`);
  // scale
  parts.push(`<line x1="${X(600)}" y1="${Y(-340)}" x2="${X(800)}" y2="${Y(-340)}" stroke="#e9fbff" stroke-width="2"/>`);
  parts.push(`<text x="${X(700)}" y="${Y(-350)}" fill="#e9fbff" font-size="12" text-anchor="middle" font-family="ui-sans-serif,sans-serif">200 m</text>`);
  parts.push(`<text x="${W - 20}" y="120" fill="#e9fbff" font-size="14" text-anchor="end" font-family="ui-sans-serif,sans-serif">N ↑</text>`);
  // legend
  let ly = 150;
  const items = [['HOME', 'Home'], ['CAFE', 'Pizza / cafe'], ['PETS', 'Pets'], ['DANCE', 'Dance + mural'], ['GARAGE', 'Garage'], ['NEON_PAINT', 'Neon paint'], ['NOS', 'NOS'], ['SHOWROOM', 'Showroom'], ['ARCADE', 'Arcade'], ['SKY_DROP', 'Sky Drop / tower'], ['SOCCER', 'Soccer shop'], ['BUILDER', 'Builder HQ']];
  for (const [k, lab] of items) {
    parts.push(`<rect x="${W - 220}" y="${ly}" width="16" height="12" fill="${COL[k]}"/>`);
    parts.push(`<text x="${W - 198}" y="${ly + 11}" fill="#e9fbff" font-size="13" font-family="ui-sans-serif,sans-serif">${lab}</text>`);
    ly += 20;
  }
  ly += 8;
  const notes = ['Arrows are ramps. Tip = launch.', 'White = river edge, same angles', 'Cyan arrows = airport ramps', 'Amber arrows = plaza jumps', 'Orange = street, highway, garage', 'Yellow = tow-truck jumps', 'Lilac = banks and road humps', 'No new ramps. Count matches.', 'Cyan strip = runway flying lane', 'Amber road = highway, 30 m', 'Green hill = tunnel, unchanged', 'Green bars = clear tunnel mouths', 'Pink oval = race track', 'Pink dome = soccer field', 'Green dash = builder sandbox', '★ = tall roof (62 m or 239 m)'];
  for (const n of notes) {
    parts.push(`<text x="${W - 220}" y="${ly}" fill="#b9a8d4" font-size="12" font-family="ui-sans-serif,sans-serif">${n}</text>`);
    ly += 16;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${parts.join('\n')}\n</svg>\n`;
}

const distCur = [
  { x0: -560, x1: 560, z0: -300, z1: 400, fill: 'rgba(255,255,255,0.03)', stroke: '#8a7a9d', label: 'SPAWN SOUTH' },
  { x0: -560, x1: 400, z0: 400, z1: 900, fill: 'rgba(255,79,216,0.05)', stroke: '#ff4fd8', label: 'ARTS & GARAGE' },
  { x0: -560, x1: -150, z0: 700, z1: 1780, fill: 'rgba(125,255,107,0.04)', stroke: '#7dff6b', label: 'PARKSIDE' }
];
const distNew = [
  { x0: -560, x1: 560, z0: -300, z1: 90, fill: 'rgba(62,230,255,0.04)', stroke: '#3ee6ff', label: 'SPAWN — OPEN RUNWAY' },
  { x0: -560, x1: -150, z0: 90, z1: 1000, fill: 'rgba(125,255,107,0.05)', stroke: '#7dff6b', label: 'RESIDENTIAL' },
  { x0: -560, x1: -150, z0: 1280, z1: 1560, fill: 'rgba(255,176,32,0.06)', stroke: '#ffb020', label: 'CAR SHOPS' },
  { x0: 150, x1: 560, z0: 250, z1: 1000, fill: 'rgba(255,79,216,0.05)', stroke: '#ff4fd8', label: 'PLAY' },
  { x0: 150, x1: 560, z0: 1050, z1: 1420, fill: 'rgba(62,230,255,0.05)', stroke: '#9ffbff', label: 'DOWNTOWN — TOWER ONLY' },
  { x0: 150, x1: 560, z0: 1480, z1: 1760, fill: 'rgba(255,176,32,0.06)', stroke: '#ffb020', label: 'CAR SHOPS NORTH' }
];

const outDir = new URL('.', import.meta.url).pathname.startsWith('/workspace/')
  ? '/workspace/docs/city-layout'
  : '/tmp/city-maps';
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync('/tmp/city-maps', { recursive: true });
for (const dir of [outDir, '/tmp/city-maps']) {
  fs.writeFileSync(dir + '/current.svg', svgFor('Neon World — current city', 'North is up. Every ramp is an arrow. The tip is the launch. River arrows stay on the banks.', CUR, distCur, rampsNow));
  fs.writeFileSync(dir + '/option-a.svg', svgFor('Option A — Sky Drop stays on the west', 'Same 82 ramps, same angles. Two plaza lots slide so their run-ups stay clear. River launches do not move.', OPT_A, distNew, rampsAB));
  fs.writeFileSync(dir + '/option-b.svg', svgFor('Option B — Sky Drop moves to the east', 'Same ramps as A. Only the Sky Drop deck crosses the runway. It does not sit on a ramp or a landing.', OPT_B, distNew, rampsAB));
}
console.log('svg written');
