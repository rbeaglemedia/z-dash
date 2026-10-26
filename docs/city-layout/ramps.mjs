'use strict';
// Every ramp and jump placed by world/city.js on current main, plus the run-up
// and landing check used by the layout maps. Not game code.

const FACE = ['north', 'east', 'south', 'west'];
const DIRV = [[0, 1], [1, 0], [0, -1], [-1, 0]];

export const PF = {
  kick: { w: 8, d: 10, h: 1.6, label: 'kicker' },
  med: { w: 12, d: 24, h: 3.5, label: 'medium' },
  launch: { w: 16, d: 60, h: 7.5, label: 'big launch' },
  small: { w: 14, d: 40, h: 4, label: 'small ramp' },
  big: { w: 16, d: 60, h: 7.5, label: 'big ramp' },
  curb: { w: 10, d: 5, h: 0.8, label: 'curb kicker' },
  bank: { w: 20, d: 30, h: 4, label: 'embankment' },
  crest: { w: 20, d: 19, h: 1.8, label: 'road crest' }
};

export const PLAZAS_NOW = [
  [260, 340, -290, -110],
  [260, 340, 310, 490],
  [160, 240, 310, 490],
  [-540, -472, 310, 490],
  [-240, -160, 1310, 1490]
];

// Arcade lot slides north of the new arcade. Pizza lot slides to the open
// west block by spawn. Both moves keep the six pieces and their rotations.
// The extra shift past a single block is so the big launch still has 40 m
// of open ground before the relocated shop.
export const PLAZAS_AB = [
  [260, 340, -290, -110],
  [260, 340, 310, 490],
  [160, 240, 520, 700],
  [-540, -472, -90, 90],
  [-240, -160, 1310, 1490]
];

function round1(n) {
  return Math.round(n * 10) / 10;
}

function addRamp(list, spec) {
  const kind = PF[spec.kind];
  const w = spec.w != null ? spec.w : kind.w;
  const d = spec.d != null ? spec.d : kind.d;
  const h = spec.h != null ? spec.h : kind.h;
  const rot = spec.rot || 0;
  const dir = Math.round((((rot % 360) + 360) % 360) / 90) % 4;
  const swap = ((rot % 180) + 180) % 180 === 90;
  const W = swap ? d : w;
  const D = swap ? w : d;
  const x0 = spec.x - W / 2, x1 = spec.x + W / 2, z0 = spec.z - D / 2, z1 = spec.z + D / 2;
  const angle = Math.atan(h / d) * 180 / Math.PI;
  list.push({
    group: spec.group,
    name: spec.name,
    kind: spec.kind,
    label: spec.label || kind.label,
    x: spec.x,
    z: spec.z,
    w, d, h, rot, dir,
    x0, x1, z0, z1,
    angle,
    face: FACE[dir],
    hid: spec.hid ? 1 : 0,
    nm: spec.nm || '',
    spot: spec.spot || '',
    yb: spec.yb || 0,
    stunt: 0
  });
}

function addPlaza(list, lot, i) {
  const [x0, x1, z0, z1] = lot;
  const cx = (x0 + x1) / 2;
  const L = z1 - z0;
  const fl = i % 2;
  const spot = 'plaza ' + (i + 1);
  if (L >= 150) {
    addRamp(list, { group: 'plaza', kind: 'launch', name: spot + ' launch', x: cx, z: fl ? z1 - 42 : z0 + 42, rot: fl ? 180 : 0, spot });
    addRamp(list, { group: 'plaza', kind: 'med', name: spot + ' medium', x: x0 + 16, z: fl ? z0 + 20 : z1 - 20, rot: fl ? 0 : 180, spot });
    addRamp(list, { group: 'plaza', kind: 'kick', name: spot + ' kick', x: x1 - 12, z: (z0 + z1) / 2, rot: fl ? 180 : 0, spot });
    addRamp(list, { group: 'plaza', kind: 'kick', name: spot + ' hidden kick', x: x1 - 12, z: (z0 + z1) / 2 + (fl ? -30 : 30), rot: fl ? 180 : 0, hid: 1, spot });
  }
  addRamp(list, { group: 'plaza', kind: 'curb', name: spot + ' curb west', x: x0 + 3.5, z: (z0 + z1) / 2 + 12, rot: 90, spot });
  addRamp(list, { group: 'plaza', kind: 'curb', name: spot + ' curb east', x: x1 - 3.5, z: (z0 + z1) / 2 - 12, rot: 270, spot });
}

function addTow(list, x, z, rot, n) {
  const L = 14, w = 3.6, h = 2.6;
  const bed = L * 0.62;
  const dir = Math.round((((rot % 360) + 360) % 360) / 90) % 4;
  const u = DIRV[dir];
  const bx = x - u[0] * (L / 2 - bed / 2);
  const bz = z - u[1] * (L / 2 - bed / 2);
  addRamp(list, { group: 'tow', kind: 'med', name: 'tow ' + n + ' bed', x: bx, z: bz, rot, w, d: bed, h, nm: 'tow', label: 'tow bed' });
  const cabL = 2.376 * 1.15;
  const chF = 2.345 * 1.15;
  const gap = L - bed - cabL;
  const KD = 1.1;
  const gx = x + u[0] * (L / 2 - cabL - gap / 2);
  const gz = z + u[1] * (L / 2 - cabL - gap / 2);
  addRamp(list, {
    group: 'tow', kind: 'kick', name: 'tow ' + n + ' gap kicker',
    x: gx, z: gz, rot, w, d: gap, h: chF - h + KD, yb: h - KD, nm: 'tow', label: 'tow gap kicker'
  });
}

export function buildRamps(plazas) {
  const list = [];
  plazas.forEach((lot, i) => addPlaza(list, lot, i));
  addRamp(list, { group: 'garage', kind: 'kick', name: 'garage kicker', x: 528, z: 409, rot: 0, nm: 'garage' });
  addRamp(list, { group: 'base', kind: 'big', name: 'taxiway ramp', x: 50, z: 790, rot: 0, w: 16, h: 7.5, nm: 'taxiway' });
  addRamp(list, { group: 'base', kind: 'small', name: 'street ramp', x: 250, z: 350, rot: 0, w: 14, h: 4, nm: 'street' });
  addRamp(list, { group: 'base', kind: 'big', name: 'highway ramp', x: -450, z: 1630, rot: 0, w: 24, h: 6, nm: 'highway' });
  const air = [
    ['med', 120, 150, 0, 0], ['kick', 120, 420, 0, 0], ['launch', 120, 640, 0, 0], ['med', 120, 1000, 180, 0],
    ['kick', 120, 1250, 0, 1], ['kick', 125, 1390, 180, 0], ['med', -40, 520, 0, 0], ['launch', -110, 700, 0, 0],
    ['kick', -40, 900, 0, 1], ['med', -110, 1100, 180, 0], ['kick', -40, 1250, 0, 0], ['kick', -125, 1600, 180, 0],
    ['kick', -40, 60, 180, 1]
  ];
  for (const [kind, x, z, rot, hid] of air) {
    addRamp(list, { group: 'airport', kind, name: 'airport ' + kind, x, z, rot, hid, nm: 'airport' });
  }
  const river = [
    ['launch', 120, 0], ['med', -100, 0], ['kick', -40, 0], ['med', 100, 180], ['launch', -120, 180],
    ['kick', 60, 180], ['med', 250, 0], ['kick', -250, 0], ['med', 300, 180], ['med', -250, 180]
  ];
  for (const [kind, x, rot] of river) {
    const d = PF[kind].d;
    const z = rot ? 1840 + 6 + 2 + d / 2 : 1780 - 6 - 2 - d / 2;
    const bank = rot ? 'north bank' : 'south bank';
    addRamp(list, { group: 'river', kind, name: 'river ' + bank + ' ' + kind, x, z, rot, nm: 'river' });
  }
  for (const [x, z, rot] of [[300, -345, 180], [-300, -345, 180], [600, 520, 90], [600, 1500, 90], [-600, 960, 270], [300, 2150, 0], [-260, 2150, 0], [-600, 1500, 270]]) {
    addRamp(list, { group: 'bank', kind: 'bank', name: 'embankment', x, z, rot, hid: 1, nm: 'bank' });
  }
  for (const [x, z, rot] of [[400, 300, 90], [-300, 900, 270], [350, 1400, 0], [-250, 300, 180], [450, -200, 0]]) {
    addRamp(list, { group: 'crest', kind: 'crest', name: 'road crest', x, z, rot, hid: 1, nm: 'crest' });
  }
  [[254, 600, 0], [-354, 1200, 180], [-154, 800, 0], [-246, 0, 0], [154, 1600, 0], [-546, 400, 180]]
    .forEach((t, i) => addTow(list, t[0], t[1], t[2], i + 1));
  return list;
}

export const HALFPIPE = { name: 'half-pipe', x0: -127, x1: -63, z0: 200, z1: 320, h: 5, note: 'beside the runway, x -95, z 260. 64 m wide including the decks, 120 m long, 5 m walls.' };
export const LOOP = { name: 'loop', x: -80, z: 1440, R: 12, w: 8, off: 9, note: 'entry x -80, z 1440, heading north. Radius 12 m, lane 8 m, exit shifts 9 m east.' };

function overlap(a, b) {
  return a.x0 < b.x1 - 0.05 && a.x1 > b.x0 + 0.05 && a.z0 < b.z1 - 0.05 && a.z1 > b.z0 + 0.05;
}

function corridor(r, dist, which) {
  let x0 = r.x0, x1 = r.x1, z0 = r.z0, z1 = r.z1;
  const [dx, dz] = DIRV[r.dir];
  if (dx === 1) {
    if (which === 'land') { x0 = r.x1; x1 = r.x1 + dist; }
    else { x1 = r.x0; x0 = r.x0 - dist; }
  } else if (dx === -1) {
    if (which === 'land') { x1 = r.x0; x0 = r.x0 - dist; }
    else { x0 = r.x1; x1 = r.x1 + dist; }
  } else if (dz === 1) {
    if (which === 'land') { z0 = r.z1; z1 = r.z1 + dist; }
    else { z1 = r.z0; z0 = r.z0 - dist; }
  } else if (which === 'land') { z1 = r.z0; z0 = r.z0 - dist; }
  else { z0 = r.z1; z1 = r.z1 + dist; }
  return { x0, x1, z0, z1 };
}

function runLen(r) {
  if (r.group === 'tow' && r.name.includes('gap')) return 0;
  if (r.kind === 'launch' || r.kind === 'big' || r.kind === 'small') return 40;
  if (r.kind === 'med' || r.kind === 'bank') return 24;
  if (r.group === 'tow') return 20;
  return 12;
}

function landLen(r) {
  if (r.nm === 'river') return 0;
  if (r.group === 'tow' && r.name.includes('gap')) return 0;
  if (r.kind === 'launch' || r.kind === 'big' || r.kind === 'small') return 40;
  if (r.kind === 'med' || r.kind === 'bank') return 24;
  if (r.group === 'tow') return 16;
  return 12;
}

function riverLanding(r) {
  if (r.kind === 'kick') {
    return { x0: r.x0, x1: r.x1, z0: 1780, z1: 1840, note: 'water, by design (the just-over jump)' };
  }
  if (r.dir === 0) return { x0: r.x0, x1: r.x1, z0: 1846, z1: 1880, note: 'north bank after the water' };
  return { x0: r.x0, x1: r.x1, z0: 1740, z1: 1774, note: 'south bank after the water' };
}

function fmtBox(b) {
  return 'x ' + round1(b.x0) + '..' + round1(b.x1) + ', z ' + round1(b.z0) + '..' + round1(b.z1);
}

function hits(box, buildings) {
  const names = [];
  for (const b of buildings) if (overlap(box, b)) names.push(b.id + ' ' + b.name);
  return names;
}

export function zonesFor(r) {
  const run = runLen(r);
  const land = landLen(r);
  const runBox = run ? corridor(r, run, 'run') : null;
  let landBox = null;
  let landNote = '';
  if (r.nm === 'river') {
    landBox = riverLanding(r);
    landNote = landBox.note;
  } else if (land) {
    landBox = corridor(r, land, 'land');
    landNote = land + ' m ' + r.face;
  }
  return {
    run,
    runBox,
    runNote: run ? (run + ' m ' + FACE[(r.dir + 2) % 4]) : 'same truck',
    landBox,
    landNote
  };
}

export function checkClear(ramps, buildings) {
  const problems = [];
  for (const r of ramps) {
    const z = zonesFor(r);
    const onRamp = hits(r, buildings);
    if (onRamp.length) problems.push(r.name + ' footprint under ' + onRamp.join(', '));
    if (z.runBox) {
      const h = hits(z.runBox, buildings);
      if (h.length) problems.push(r.name + ' run-up blocked by ' + h.join(', ') + ' (' + fmtBox(z.runBox) + ')');
    }
    if (z.landBox) {
      const h = hits(z.landBox, buildings);
      if (h.length) problems.push(r.name + ' landing blocked by ' + h.join(', ') + ' (' + fmtBox(z.landBox) + ')');
    }
  }
  const pipeMouths = [
    HALFPIPE,
    { x0: HALFPIPE.x0, x1: HALFPIPE.x1, z0: HALFPIPE.z0 - 20, z1: HALFPIPE.z0 },
    { x0: HALFPIPE.x0, x1: HALFPIPE.x1, z0: HALFPIPE.z1, z1: HALFPIPE.z1 + 20 }
  ];
  for (const box of pipeMouths) {
    const h = hits(box, buildings);
    if (h.length) problems.push('half-pipe blocked by ' + h.join(', '));
  }
  const loopBoxes = [
    { x0: -84, x1: -76, z0: 1400, z1: 1440 },
    { x0: -84, x1: -67, z0: 1428, z1: 1452 },
    { x0: -76, x1: -67, z0: 1440, z1: 1480 }
  ];
  for (const box of loopBoxes) {
    const h = hits(box, buildings);
    if (h.length) problems.push('loop blocked by ' + h.join(', '));
  }
  return problems;
}

export function sameGeometry(a, b) {
  if (a.length !== b.length) return 'count ' + a.length + ' vs ' + b.length;
  for (let i = 0; i < a.length; i++) {
    if (a[i].kind !== b[i].kind || a[i].h !== b[i].h || a[i].d !== b[i].d || a[i].w !== b[i].w || a[i].rot !== b[i].rot) {
      return 'piece ' + i + ' ' + a[i].name + ' changed';
    }
  }
  return '';
}

function deg(n) {
  return (Math.round(n * 10) / 10).toFixed(1) + '°';
}

export function inventoryLines(ramps) {
  return ramps.map((r, i) => {
    const z = zonesFor(r);
    const size = round1(r.w) + '×' + round1(r.d) + '×' + round1(r.h);
    const where = 'x ' + round1(r.x) + ', z ' + round1(r.z);
    const run = z.runBox ? (z.runNote + ' (' + fmtBox(z.runBox) + ')') : z.runNote;
    const land = z.landBox ? (z.landNote + ' (' + fmtBox(z.landBox) + ')') : z.landNote;
    const hid = r.hid ? ', hidden' : '';
    return {
      n: i + 1,
      group: r.group,
      name: r.name + hid,
      where,
      size,
      angle: deg(r.angle),
      face: r.face,
      run,
      land
    };
  });
}
