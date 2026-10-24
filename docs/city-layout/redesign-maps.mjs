'use strict';
// Two district plans for Neon World. Picture generator only. Not game code.
import fs from 'fs';
import { buildRamps, PLAZAS_NOW } from './ramps.mjs';

const TUN = { x0: -530, x1: -370, z0: 500, z1: 700 };
const APPROACH = [
  { x0: -465, x1: -435, z0: 440, z1: 500 },
  { x0: -465, x1: -435, z0: 700, z1: 760 }
];
const RIVER = { z0: 1780, z1: 1840 };

const FIXED = buildRamps(PLAZAS_NOW).filter((r) => r.group === 'river' || r.group === 'airport' || r.nm === 'highway' || r.group === 'base');
const STUNTS = [
  { name: 'half-pipe', x0: -127, x1: -63, z0: 200, z1: 320 },
  { name: 'loop', x0: -88, x1: -64, z0: 1420, z1: 1464 }
];

function box(name, station, cx, cz, w, d, kind, label) {
  return {
    name, station, kind, label: label || name,
    x0: cx - w / 2, x1: cx + w / 2, z0: cz - d / 2, z1: cz + d / 2,
    cx, cz, w, d
  };
}
function edgeGap(a, b) {
  const dx = a.x1 < b.x0 ? b.x0 - a.x1 : b.x1 < a.x0 ? a.x0 - b.x1 : 0;
  const dz = a.z1 < b.z0 ? b.z0 - a.z1 : b.z1 < a.z0 ? a.z0 - b.z1 : 0;
  if (dx === 0 && dz === 0) return 0;
  return Math.hypot(dx, dz);
}
function distToBox(x, z, b) {
  const dx = x < b.x0 ? b.x0 - x : x > b.x1 ? x - b.x1 : 0;
  const dz = z < b.z0 ? b.z0 - z : z > b.z1 ? z - b.z1 : 0;
  return Math.hypot(dx, dz);
}
function overlap(a, b) {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;
}

function buildingsFor(mode) {
  const B = [];
  const add = (name, station, cx, cz, w, d, kind, label) => B.push(box(name, station, cx, cz, w, d, kind, label));

  // Homestead, same yard in both options. One station on purpose.
  add('HOME', 'yard', -250, -640, 44, 48, 'home', 'HOME');
  add('PETS', 'yard', -190, -640, 44, 48, 'pets', 'PETS');
  add('GARAGE', 'yard', -220, -760, 164, 64, 'garage', 'GARAGE');

  // Lone landmarks.
  add('TOWER', 'tower', 400, 1720, 70, 70, 'tower', 'TOWER');
  if (mode === 'boulevard') add('JUMP ROOF', 'deck', -210, 1240, 64, 164, 'deck', 'JUMP ROOF');
  else add('JUMP ROOF', 'deck', 190, 640, 64, 164, 'deck', 'JUMP ROOF');

  if (mode === 'boulevard') {
    // Car Row: one east-west boulevard. Pairs 500 m apart.
    add('SHOWROOM', 'car-w', -520, 2320, 164, 64, 'show', 'SHOWROOM');
    add('BAY', 'car-w', -520, 2400, 20, 14, 'bay', 'BAY');
    add('PAINT', 'car-c', 0, 2316, 44, 48, 'paint', 'PAINT');
    add('SNACK', 'car-c', 0, 2396, 12, 10, 'snack', 'SNACK');
    add('NOS', 'car-e', 540, 2320, 164, 64, 'nos', 'NOS');
    add('PAD', 'car-e', 540, 2400, 28, 28, 'pad', 'PAD');
    add('ARCH', 'car-gate', -980, 2260, 26, 8, 'arch', 'CAR ROW');

    // The Stage: one north-south street. Full cafe lives here.
    // Street is east of the mural so the 64 m wall faces east.
    add('ARCH', 'dance-gate', -990, -620, 8, 26, 'arch', 'THE STAGE');
    add('BAY', 'dance-gate', -900, -620, 14, 20, 'bay', 'BAY');
    add('CAFE', 'dance-s', -1060, -80, 44, 48, 'cafe', 'CAFE');
    add('NOS', 'dance-s', -900, -80, 16, 12, 'kitnos', 'NOS');
    add('DANCE', 'dance-n', -1060, 460, 60, 64, 'dance', 'DANCE');
    add('PAD', 'dance-n', -900, 460, 28, 28, 'pad', 'PAD');

    // Builder Bay.
    add('ARCH', 'build-gate', 840, -620, 8, 26, 'arch', 'BUILDER BAY');
    add('BAY', 'build-gate', 960, -620, 14, 20, 'bay', 'BAY');
    add('ARCADE', 'build-s', 900, -80, 56, 64, 'arcade', 'ARCADE');
    add('SNACK', 'build-s', 980, -80, 12, 10, 'snack', 'SNACK');
    add('BUILDER', 'build-n', 900, 460, 44, 32, 'builder', 'BUILDER');
    add('PAD', 'build-n', 980, 460, 28, 28, 'pad', 'PAD');
    add('NOS', 'build-nos', 1180, 200, 16, 12, 'kitnos', 'NOS');

    // The Track. Gates on either side of the two ovals.
    add('ARCH', 'track-e', -560, 860, 26, 8, 'arch', 'THE TRACK');
    add('SNACK', 'track-e', -560, 800, 12, 10, 'snack', 'SNACK');
    add('BAY', 'track-w', -1480, 860, 20, 14, 'bay', 'BAY');
    add('NOS', 'track-w', -1480, 800, 16, 12, 'kitnos', 'NOS');
    add('PAD', 'track-pad', -1200, 1580, 28, 28, 'pad', 'PAD');

    // The Field. Shop and pad share one stop. The arch is a different stop.
    add('SOCCER', 'field-shop', 760, 1280, 56, 88, 'soccer', 'SOCCER');
    add('PAD', 'field-shop', 680, 1280, 28, 28, 'pad', 'PAD');
    add('ARCH', 'field-s', 980, 860, 26, 8, 'arch', 'THE FIELD');
    add('SNACK', 'field-s', 1040, 860, 12, 10, 'snack', 'SNACK');
    add('BAY', 'field-e', 1180, 1280, 20, 14, 'bay', 'BAY');
    add('NOS', 'field-e', 1180, 1340, 16, 12, 'kitnos', 'NOS');
  } else {
    // Town squares. Corners sit 320 m from the middle, so the next shop is out of the detail bubble.
    const corner = (cx, cz, dx, dz, name, station, w, d, kind, label) => {
      const len = Math.hypot(dx, dz) || 1;
      add(name, station, cx + dx, cz + dz, w, d, kind, label);
      return { ox: dx / len, oz: dz / len };
    };
    // Car Row square.
    add('SHOWROOM', 'car-w', -320, 2480, 64, 164, 'show', 'SHOWROOM');
    add('BAY', 'car-w', -380, 2480, 20, 14, 'bay', 'BAY');
    add('NOS', 'car-e', 320, 2480, 64, 164, 'nos', 'NOS');
    add('PAINT', 'car-s', 0, 2160, 44, 48, 'paint', 'PAINT');
    add('ARCH', 'car-s', 70, 2100, 26, 8, 'arch', 'CAR ROW');
    add('PAD', 'car-n', 0, 2800, 28, 28, 'pad', 'PAD');
    add('SNACK', 'car-n', 0, 2860, 12, 10, 'snack', 'SNACK');

    // The Stage square. Dance sits on the west side so the 64 m mural faces east, into the square.
    // The full cafe stands in for this city's snack.
    add('DANCE', 'dance-w', -1280, 0, 60, 64, 'dance', 'DANCE');
    add('PAD', 'dance-w', -1360, 40, 28, 28, 'pad', 'PAD');
    add('CAFE', 'dance-s', -980, -320, 44, 48, 'cafe', 'CAFE');
    add('NOS', 'dance-s', -980, -400, 16, 12, 'kitnos', 'NOS');
    add('BAY', 'dance-e', -660, 70, 20, 14, 'bay', 'BAY');
    add('ARCH', 'dance-c', -980, 0, 26, 8, 'arch', 'THE STAGE');

    // Builder Bay square.
    add('BUILDER', 'build-n', 900, 460, 44, 32, 'builder', 'BUILDER');
    add('PAD', 'build-n', 980, 540, 28, 28, 'pad', 'PAD');
    add('ARCADE', 'build-s', 900, -460, 56, 64, 'arcade', 'ARCADE');
    add('SNACK', 'build-s', 980, -540, 12, 10, 'snack', 'SNACK');
    add('BAY', 'build-w', 460, 80, 20, 14, 'bay', 'BAY');
    add('NOS', 'build-w', 460, 140, 16, 12, 'kitnos', 'NOS');
    add('ARCH', 'build-c', 900, 0, 26, 8, 'arch', 'BUILDER BAY');

    // Track gates, ovals stacked.
    add('ARCH', 'track-e', -700, 1000, 8, 26, 'arch', 'THE TRACK');
    add('SNACK', 'track-e', -700, 1060, 12, 10, 'snack', 'SNACK');
    add('BAY', 'track-w', -1320, 1460, 20, 14, 'bay', 'BAY');
    add('NOS', 'track-w', -1320, 1520, 16, 12, 'kitnos', 'NOS');
    add('PAD', 'track-pad', -700, 640, 28, 28, 'pad', 'PAD');

    // Field, approach from the south so the gate stays clear of the jump roof.
    add('SOCCER', 'field-shop', 860, 1320, 56, 88, 'soccer', 'SOCCER');
    add('PAD', 'field-shop', 780, 1320, 28, 28, 'pad', 'PAD');
    add('ARCH', 'field-w', 360, 1240, 8, 26, 'arch', 'THE FIELD');
    add('SNACK', 'field-w', 420, 1180, 12, 10, 'snack', 'SNACK');
    add('BAY', 'field-e', 1320, 1320, 20, 14, 'bay', 'BAY');
    add('NOS', 'field-e', 1320, 1380, 16, 12, 'kitnos', 'NOS');
    void corner;
  }
  return B;
}

function roadsFor(mode) {
  const R = [];
  const seg = (x0, z0, x1, z1, kind = 'street') => R.push({ x0, z0, x1, z1, kind });
  // Shared skeleton.
  seg(-450, -800, -450, 2500, 'highway');
  seg(-14, 1640, 14, 1960, 'bridge');
  seg(-465, 1640, -435, 1960, 'bridge');
  seg(-1400, 1640, -160, 1640, 'water');
  seg(160, 1640, 1100, 1640, 'water');
  seg(-200, 40, -200, -700, 'lane');
  // Shoulder roads out of spawn, clear of the runway pavement.
  seg(-980, 0, -40, 0, 'street');
  seg(40, 0, 900, 0, 'street');
  if (mode === 'boulevard') {
    // Streets sit beside the shops, not under them.
    seg(-1100, 2260, 720, 2260, 'street');
    seg(-450, 1640, -450, 2260, 'street');
    seg(-990, -760, -990, 620, 'street');
    seg(-990, -80, -450, -80, 'street');
    seg(760, -760, 1100, -760, 'street');
    seg(840, -760, 840, 620, 'street');
    seg(840, 200, 160, 200, 'street');
    seg(-1560, 860, -450, 860, 'street');
    seg(160, 860, 900, 860, 'street');
    seg(1040, 860, 1040, 1180, 'street');
    seg(1040, 1380, 1040, 1640, 'street');
    seg(640, 1280, 820, 1280, 'street');
    seg(1120, 1280, 1280, 1280, 'street');
  } else {
    // Squares and the roads that tie them to the highway.
    const loop = (cx, cz, r) => {
      seg(cx - r, cz - r, cx + r, cz - r);
      seg(cx + r, cz - r, cx + r, cz + r);
      seg(cx + r, cz + r, cx - r, cz + r);
      seg(cx - r, cz + r, cx - r, cz - r);
    };
    loop(0, 2480, 220);
    seg(-450, 2100, 0, 2100);
    seg(-450, 2100, -450, 2480);
    loop(-980, 0, 220);
    seg(-760, 0, -450, 0);
    loop(900, 0, 340);
    seg(680, 0, 450, 0);
    seg(-1480, 1000, -1160, 1000);
    seg(-880, 1000, -450, 1000);
    seg(-1480, 1460, -1160, 1460);
    seg(160, 1240, 800, 1240);
    seg(1120, 1320, 1400, 1320);
    seg(1100, 1420, 1100, 1640);
  }
  return R;
}

function ovals(mode) {
  if (mode === 'boulevard') {
    return [
      { cx: -1180, cz: 1160, rx: 115, ry: 250, label: 'TRACK' },
      { cx: -820, cz: 1160, rx: 115, ry: 250, label: 'LATER TRACK', later: true }
    ];
  }
  return [
    { cx: -1020, cz: 1020, rx: 115, ry: 210, label: 'TRACK' },
    { cx: -1020, cz: 1460, rx: 115, ry: 180, label: 'LATER TRACK', later: true }
  ];
}
function fields(mode) {
  if (mode === 'boulevard') return { cx: 1000, cz: 1280, rx: 100, ry: 80 };
  return { cx: 1100, cz: 1320, rx: 90, ry: 80 };
}

// Later weather. Open ground only. Not the runway, the tunnel, the river jumps, or a city.
function weatherZones(mode) {
  const shared = [
    ['Fog', -180, 250, 1530, 1660],
    ['Fog', -480, -80, -400, -160]
  ];
  if (mode === 'boulevard') {
    return [
      ['Sand', -350, -170, 40, 1000],
      shared[0],
      ['Rain', 240, 640, 240, 760],
      shared[1]
    ];
  }
  return [
    ['Sand', -350, -170, 160, 900],
    shared[0],
    ['Rain', 500, 820, 780, 1020],
    shared[1]
  ];
}

function check(mode, B) {
  const problems = [];
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
    if (overlap(B[i], B[j])) problems.push('overlap ' + B[i].label + ' ' + B[j].label);
    if (B[i].station !== B[j].station && edgeGap(B[i], B[j]) < 180) {
      problems.push('close ' + B[i].station + '/' + B[i].label + ' & ' + B[j].station + '/' + B[j].label + ' ' + Math.round(edgeGap(B[i], B[j])) + 'm');
    }
  }
  for (const b of B) {
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    if (b.z1 > RIVER.z0 && b.z0 < RIVER.z1) problems.push('river ' + b.label);
    if (overlap(b, TUN) || APPROACH.some((a) => overlap(b, a))) problems.push('tunnel ' + b.label);
    if (Math.abs(cx) < 140 && cz > -80 && cz < 1700) problems.push('corridor ' + b.label);
    for (const r of FIXED) if (overlap(b, r)) problems.push('ramp ' + b.label + ' ' + r.name);
    for (const s of STUNTS) if (overlap(b, s)) problems.push('stunt ' + b.label + ' ' + s.name);
    if (b.x0 < -20 && b.x1 > 20 && b.z0 < 0 && b.z1 > 0) problems.push('spawn ' + b.label);
  }
  // Sky drop start and spawn.
  const start = { x0: 175, x1: 185, z0: 515, z1: 525 };
  if (B.some((b) => overlap(b, start))) problems.push('skydrop start inside a building');
  return problems;
}

function worst(B) {
  let max = 0, at = null;
  const see = (x, z) => {
    const names = [];
    for (const b of B) if (distToBox(x, z, b) <= 170) names.push(b.station + ':' + b.label);
    if (names.length > max) { max = names.length; at = { x, z, names }; }
  };
  for (let x = -1600; x <= 1400; x += 20) for (let z = -900; z <= 3000; z += 20) see(x, z);
  for (const b of B) see(b.cx, b.cz);
  return { max, at };
}
function packed(B) {
  const groups = new Map();
  for (const b of B) {
    const key = b.station.split('-')[0];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(b.label);
  }
  let max = 0, who = '';
  for (const [k, v] of groups) if (v.length > max) { max = v.length; who = k; }
  return { max, who, groups: [...groups.entries()].map(([k, v]) => k + ':' + v.length).join(' ') };
}

function report(mode) {
  const B = buildingsFor(mode);
  const problems = check(mode, B);
  const w = worst(B);
  const p = packed(B);
  return { mode, n: B.length, problems, worst: w, packed: p };
}

const rb = report('boulevard');
const rs = report('squares');
console.log(JSON.stringify({ boulevard: { n: rb.n, problems: rb.problems, worst: rb.worst, packed: rb.packed }, squares: { n: rs.n, problems: rs.problems, worst: rs.worst, packed: rs.packed } }, null, 2));

const COL = {
  home: '#5fbf6a', pets: '#8ed98a', garage: '#f0a202', paint: '#e85aad', show: '#3aaed0',
  nos: '#e2b93b', kitnos: '#e2b93b', dance: '#ff4f9a', cafe: '#ff5d5d', arcade: '#5b92f0',
  builder: '#a78bfa', soccer: '#2fbf8a', tower: '#6d7cff', deck: '#7fd4ef',
  bay: '#f29a4a', pad: '#7fd4ef', snack: '#ff8b7b', arch: '#ffffff'
};
const WASH = {
  car: { fill: 'rgba(255,196,120,0.45)', stroke: '#e09a3e', label: 'NORTH · CAR ROW' },
  dance: { fill: 'rgba(255,150,190,0.40)', stroke: '#e45b8a', label: 'SOUTHWEST · THE STAGE' },
  build: { fill: 'rgba(190,170,255,0.42)', stroke: '#7c62d6', label: 'SOUTHEAST · BUILDER BAY' },
  track: { fill: 'rgba(150,214,140,0.40)', stroke: '#3d9a55', label: 'MIDDLE WEST · THE TRACK' },
  field: { fill: 'rgba(140,200,255,0.42)', stroke: '#3a86c8', label: 'MIDDLE EAST · THE FIELD' }
};

function svgFor(mode, worstN) {
  const B = buildingsFor(mode);
  const roads = roadsFor(mode);
  const ovs = ovals(mode);
  const field = fields(mode);
  const title = mode === 'boulevard' ? 'Option 1 — The Boulevards' : 'Option 2 — The Town Squares';
  const sub = mode === 'boulevard'
    ? 'Same zones. Straight streets. Each shop is a stop on one road.'
    : 'Same zones. A square in each city. The next shop is around the corner, out of view.';
  const x0 = -1680, x1 = 1520, z0 = -980, z1 = 3100;
  const W = 1620, H = 2200, padL = 36, padR = 36, padT = 72, padB = 132;
  const iw = W - padL - padR, ih = H - padT - padB;
  const X = (x) => padL + (x - x0) / (x1 - x0) * iw;
  const Y = (z) => padT + (z1 - z) / (z1 - z0) * ih;
  const P = [];
  P.push(`<rect width="${W}" height="${H}" fill="#f6f3ec"/>`);
  P.push(`<text x="36" y="34" fill="#1c2430" font-family="Georgia, ui-serif, serif" font-size="28">${title}</text>`);
  P.push(`<text x="${W - 36}" y="34" text-anchor="end" fill="#1c2430" font-size="16" font-weight="800" font-family="ui-sans-serif, sans-serif">N ↑</text>`);
  P.push(`<line x1="${W - 150}" y1="48" x2="${W - 54}" y2="48" stroke="#1c2430" stroke-width="3"/>`);
  P.push(`<text x="${W - 102}" y="62" text-anchor="middle" fill="#1c2430" font-size="11" font-family="ui-sans-serif, sans-serif">200 m</text>`);
  P.push(`<text x="36" y="56" fill="#5c6b7a" font-family="ui-sans-serif, sans-serif" font-size="15">${sub}</text>`);
  // Open ground.
  P.push(`<rect x="${X(x0)}" y="${Y(z1)}" width="${X(x1) - X(x0)}" height="${Y(z0) - Y(z1)}" fill="#e7f2df"/>`);
  // District washes.
  const washes = mode === 'boulevard'
    ? [
      ['car', -1120, 2080, 760, 2520],
      ['dance', -1180, -780, -800, 680],
      ['build', 740, -780, 1320, 680],
      ['track', -1620, 720, -480, 1760],
      ['field', 600, 720, 1360, 1640]
    ]
    : [
      ['car', -480, 2000, 480, 2960],
      ['dance', -1420, -420, -560, 480],
      ['build', 380, -640, 1400, 660],
      ['track', -1500, 720, -560, 1760],
      ['field', 260, 1080, 1460, 1560]
    ];
  for (const [k, xa, za, xb, zb] of washes) {
    const w = WASH[k];
    P.push(`<rect x="${X(xa)}" y="${Y(zb)}" width="${X(xb) - X(xa)}" height="${Y(za) - Y(zb)}" rx="18" fill="${w.fill}" stroke="${w.stroke}" stroke-width="2"/>`);
    P.push(`<text x="${X((xa + xb) / 2)}" y="${Y(zb) + 22}" text-anchor="middle" fill="${w.stroke}" font-family="ui-sans-serif, sans-serif" font-size="15" font-weight="700">${w.label}</text>`);
  }
  // River.
  P.push(`<rect x="${X(x0)}" y="${Y(RIVER.z1)}" width="${X(x1) - X(x0)}" height="${Y(RIVER.z0) - Y(RIVER.z1)}" fill="#7ec8e3"/>`);
  P.push(`<text x="${X(0)}" y="${Y(1810)}" text-anchor="middle" fill="#0c4a6e" font-size="13" font-family="ui-sans-serif, sans-serif" font-weight="700">RIVER</text>`);
  // Airport band.
  P.push(`<rect x="${X(-150)}" y="${Y(1560)}" width="${X(150) - X(-150)}" height="${Y(-80) - Y(1560)}" fill="rgba(255,248,220,0.65)" stroke="#e6d48a"/>`);
  P.push(`<rect x="${X(-16)}" y="${Y(1500)}" width="${X(16) - X(-16)}" height="${Y(-60) - Y(1500)}" fill="#fffef8" stroke="#c4b36a"/>`);
  P.push(`<text x="${X(0)}" y="${Y(400)}" text-anchor="middle" fill="#8a7340" font-size="14" font-family="ui-sans-serif, sans-serif" font-weight="700">AIRPORT</text>`);
  P.push(`<text x="${X(0)}" y="${Y(378)}" text-anchor="middle" fill="#8a7340" font-size="11" font-family="ui-sans-serif, sans-serif">ramps stay</text>`);
  // Roads: a gray curb, then a light lane.
  for (const pass of [0, 1]) {
    for (const r of roads) {
      const hw = r.kind === 'highway';
      const col = pass === 0 ? (hw ? '#c48a12' : '#b7c3cf') : (hw ? '#ffd56a' : '#ffffff');
      const sw = pass === 0 ? (hw ? 11 : 8) : (hw ? 6 : 4);
      P.push(`<line x1="${X(r.x0)}" y1="${Y(r.z0)}" x2="${X(r.x1)}" y2="${Y(r.z1)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`);
    }
  }
  // Tunnel.
  P.push(`<rect x="${X(TUN.x0)}" y="${Y(TUN.z1)}" width="${X(TUN.x1) - X(TUN.x0)}" height="${Y(TUN.z0) - Y(TUN.z1)}" fill="rgba(90,160,90,0.35)" stroke="#2f7d46" stroke-dasharray="4 3"/>`);
  P.push(`<text x="${X(-450)}" y="${Y(600)}" text-anchor="middle" fill="#1f6b34" font-size="11" font-family="ui-sans-serif, sans-serif" font-weight="700">TUNNEL</text>`);
  // Ovals and field.
  for (const o of ovs) {
    P.push(`<ellipse cx="${X(o.cx)}" cy="${Y(o.cz)}" rx="${(X(o.cx + o.rx) - X(o.cx - o.rx)) / 2}" ry="${(Y(o.cz - o.ry) - Y(o.cz + o.ry)) / 2}" fill="${o.later ? 'none' : 'rgba(255,255,255,0.7)'}" stroke="${o.later ? '#3d9a55' : '#1f6b34'}" stroke-width="3" ${o.later ? 'stroke-dasharray="7 5"' : ''}/>`);
    P.push(`<text x="${X(o.cx)}" y="${Y(o.cz)}" text-anchor="middle" fill="#1f6b34" font-size="13" font-family="ui-sans-serif, sans-serif" font-weight="700">${o.label}</text>`);
  }
  P.push(`<ellipse cx="${X(field.cx)}" cy="${Y(field.cz)}" rx="${(X(field.cx + field.rx) - X(field.cx - field.rx)) / 2}" ry="${(Y(field.cz - field.ry) - Y(field.cz + field.ry)) / 2}" fill="rgba(255,255,255,0.75)" stroke="#1f6b34" stroke-width="3"/>`);
  P.push(`<text x="${X(field.cx)}" y="${Y(field.cz)}" text-anchor="middle" fill="#1f6b34" font-size="13" font-family="ui-sans-serif, sans-serif" font-weight="700">SOCCER FIELD</text>`);
  // Later-game parcels.
  const parcels = mode === 'boulevard'
    ? [[1080, 560, 70, 50], [1160, 560, 70, 50], [1080, 640, 70, 50], [1160, 640, 70, 50]]
    : [[1180, -240, 70, 50], [1260, -240, 70, 50], [1180, -160, 70, 50], [1260, -160, 70, 50]];
  for (const [px, pz, pw, pd] of parcels) {
    P.push(`<rect x="${X(px)}" y="${Y(pz + pd)}" width="${X(px + pw) - X(px)}" height="${Y(pz) - Y(pz + pd)}" fill="rgba(255,255,255,0.45)" stroke="#7c62d6" stroke-dasharray="4 3"/>`);
  }
  P.push(`<text x="${X(parcels[0][0])}" y="${Y(parcels[0][1]) - 8}" fill="#5b46a8" font-size="12" font-weight="700" font-family="ui-sans-serif, sans-serif">room for later games</text>`);
  // Homestead chip.
  P.push(`<text x="${X(-220)}" y="${Y(-560)}" text-anchor="middle" fill="#8a5a12" font-size="13" font-family="ui-sans-serif, sans-serif" font-weight="700">HOMESTEAD</text>`);
  const weatherFill = { Sand: 'rgba(214,180,96,0.38)', Fog: 'rgba(186,204,216,0.5)', Rain: 'rgba(126,168,204,0.38)' };
  for (const [name, xa, xb, za, zb] of weatherZones(mode)) {
    P.push(`<rect x="${X(xa)}" y="${Y(zb)}" width="${X(xb) - X(xa)}" height="${Y(za) - Y(zb)}" rx="10" fill="${weatherFill[name]}" stroke="#5c6b7a" stroke-width="1.4" stroke-dasharray="7 4"/>`);
    P.push(`<text x="${X((xa + xb) / 2)}" y="${Y((za + zb) / 2)}" text-anchor="middle" fill="#3a4654" font-size="12" font-weight="800" font-family="ui-sans-serif, sans-serif">${name} later</text>`);
  }
  // River kicks.
  for (const [x, z] of [[-40, 1767], [-250, 1767], [60, 1853]]) {
    P.push(`<polygon points="${X(x)},${Y(z + 18)} ${X(x - 8)},${Y(z - 10)} ${X(x + 8)},${Y(z - 10)}" fill="#ffffff" stroke="#0c4a6e" stroke-width="1"/>`);
  }
  P.push(`<text x="${X(-40)}" y="${Y(1740)}" text-anchor="middle" fill="#0c4a6e" font-size="11" font-family="ui-sans-serif, sans-serif">river jump stays</text>`);
  // Sightline. A view, not a road.
  if (mode === 'boulevard') {
    P.push(`<line x1="${X(0)}" y1="${Y(1640)}" x2="${X(400)}" y2="${Y(1720)}" stroke="#7c62d6" stroke-width="1.5" stroke-dasharray="5 4"/>`);
    P.push(`<text x="${X(80)}" y="${Y(1608)}" fill="#5b46a8" font-size="11" font-family="ui-sans-serif, sans-serif">sightline</text>`);
  } else {
    P.push(`<line x1="${X(-700)}" y1="${Y(200)}" x2="${X(400)}" y2="${Y(1720)}" stroke="#7c62d6" stroke-width="1.5" stroke-dasharray="5 4"/>`);
    P.push(`<text x="${X(-200)}" y="${Y(900)}" fill="#5b46a8" font-size="11" font-family="ui-sans-serif, sans-serif">sightline to the tower</text>`);
  }
  const KIT = { bay: 'G', snack: 'S', kitnos: 'N', pad: 'P', arch: 'A' };
  // Buildings at true size. Kit stalls also get a dot, because a 12 m stall is a speck at this scale.
  for (const b of B) {
    const fill = COL[b.kind] || '#ccc';
    P.push(`<rect x="${X(b.x0)}" y="${Y(b.z1)}" width="${Math.max(2, X(b.x1) - X(b.x0))}" height="${Math.max(2, Y(b.z0) - Y(b.z1))}" fill="${fill}" stroke="#1c2430" stroke-width="1" rx="2"/>`);
  }
  for (const b of B) {
    if (KIT[b.kind]) {
      P.push(`<circle cx="${X(b.cx)}" cy="${Y(b.cz)}" r="8" fill="${COL[b.kind]}" stroke="#1c2430" stroke-width="1.2"/>`);
      P.push(`<text x="${X(b.cx)}" y="${Y(b.cz) + 3}" text-anchor="middle" fill="#1c2430" font-size="9" font-weight="800" font-family="ui-sans-serif, sans-serif">${KIT[b.kind]}</text>`);
      // Suggested pull-off, not part of the decided kit. The district banner already names the city.
      const side = b.w >= b.d;
      const px = b.cx + (side ? 0 : 24);
      const pz = b.cz + (side ? 22 : 0);
      P.push(`<rect x="${X(px - 10)}" y="${Y(pz + 6)}" width="${X(px + 10) - X(px - 10)}" height="${Y(pz - 6) - Y(pz + 6)}" fill="none" stroke="#8a5a12" stroke-dasharray="2 2"/>`);
    } else {
      P.push(`<text x="${X(b.cx)}" y="${Y(b.z1) - 4}" text-anchor="middle" fill="#1c2430" font-size="11" font-weight="800" font-family="ui-sans-serif, sans-serif" stroke="#ffffff" stroke-width="3" paint-order="stroke">${b.label}</text>`);
    }
  }
  // Spawn.
  P.push(`<circle cx="${X(0)}" cy="${Y(0)}" r="5" fill="#1c2430"/>`);
  P.push(`<text x="${X(16)}" y="${Y(0)}" fill="#1c2430" font-size="11" font-family="ui-sans-serif, sans-serif">SPAWN</text>`);
  // Worst-view chip.
  P.push(`<text x="${W - 36}" y="${H - 108}" text-anchor="end" fill="#1c2430" font-size="14" font-family="ui-sans-serif, sans-serif" font-weight="800">Worst view ${worstN}. Today 5. Scale: the runway is the pale strip.</text>`);
  // Key along the bottom, so it cannot cover a district.
  const chips = [
    ['#ffffff', 'A arch'], ['#f29a4a', 'G garage bay'], ['#e2b93b', 'N small NOS'], ['#7fd4ef', 'P sky pad'], ['#ff8b7b', 'S snack'],
    ['#5fbf6a', 'home / pets'], ['#f0a202', 'main garage'], ['#e85aad', 'paint'], ['#3aaed0', 'showroom'], ['#e2b93b', 'big NOS'],
    ['#ff4f9a', 'dance'], ['#ff5d5d', 'cafe'], ['#5b92f0', 'arcade'], ['#a78bfa', 'builder'], ['#2fbf8a', 'soccer'],
    ['#6d7cff', 'tower'], ['#7fd4ef', 'jump roof']
  ];
  P.push(`<text x="36" y="${H - 108}" fill="#1c2430" font-size="13" font-weight="800" font-family="ui-sans-serif, sans-serif">Every city: A G N P S.  Colored blocks are one of a kind.  North is up.</text>`);
  let cx = 36;
  chips.forEach(([color, text], i) => {
    if (i === 9) { cx = 36; }
    const y = i < 9 ? H - 88 : H - 64;
    P.push(`<rect x="${cx}" y="${y}" width="14" height="12" fill="${color}" stroke="#1c2430"/>`);
    P.push(`<text x="${cx + 18}" y="${y + 11}" fill="#1c2430" font-size="12" font-family="ui-sans-serif, sans-serif">${text}</text>`);
    cx += 18 + text.length * 7 + 16;
  });
  P.push(`<text x="36" y="${H - 28}" fill="#5c6b7a" font-size="12" font-family="ui-sans-serif, sans-serif">Gold road is the highway. Dashed oval is a later track. Dashed lots are later games. Dashed box by an arch is a suggested pull-off. Kit dots are drawn large so the stalls show. The Stage has the full cafe instead of a snack.</text>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${P.join('\n')}\n</svg>\n`;
}

const out = '/workspace/docs/city-layout';
const wb = worst(buildingsFor('boulevard')).max;
const ws = worst(buildingsFor('squares')).max;
fs.writeFileSync(out + '/option-boulevards.svg', svgFor('boulevard', wb));
fs.writeFileSync(out + '/option-squares.svg', svgFor('squares', ws));
function gap(B) {
  const key = (s) => s.split('-')[0];
  let min = 1e9, pair = '';
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
    if (key(B[i].station) === key(B[j].station)) continue;
    const g = edgeGap(B[i], B[j]);
    if (g < min) { min = g; pair = key(B[i].station) + '/' + B[i].label + ' & ' + key(B[j].station) + '/' + B[j].label; }
  }
  return { min: Math.round(min), pair };
}
const dump = (mode) => buildingsFor(mode).map((b) => ({
  name: b.label, station: b.station, kind: b.kind,
  x0: Math.round(b.x0), x1: Math.round(b.x1), z0: Math.round(b.z0), z1: Math.round(b.z1)
}));
fs.writeFileSync(out + '/coords.json', JSON.stringify({ boulevard: dump('boulevard'), squares: dump('squares') }, null, 2));
console.log('gap', JSON.stringify({ boulevard: gap(buildingsFor('boulevard')), squares: gap(buildingsFor('squares')) }));
console.log('svg', wb, ws);
if (rb.problems.length || rs.problems.length) process.exitCode = 1;
