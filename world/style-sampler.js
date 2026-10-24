'use strict';
// Style sampler. A temporary row of walk-in shells so Ellie can compare looks.
// Move SAMPLER_ROW when the dance district lands. Room art does not use map coordinates.
// The six real rooms (house, arcade, cafe, pet lounge, soccer shop, builder) stay for later.
const SAMPLER_ROW = { x: -268, z0: -56, step: 16, w: 14, d: 12 };
const SAMPLER_KEY = 'zdash.sampler.likes.v1';

function samplerBox(x, z, y, w, h, d, fill, stroke) {
  return { x: x, z: z, y: y, w: w, h: h, d: d, fill: fill, stroke: stroke || null };
}

function samplerPanes(z, y, h, xs, fill, stroke) {
  const out = [];
  for (let i = 0; i < xs.length; i++) out.push(samplerBox(xs[i], z, y, 2.4, h, 0.08, fill, stroke));
  return out;
}

function samplerStairs(x0, z0, rise, run, n, fill) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(samplerBox(x0, z0 + i * run, i * (rise / n), 1.3, rise / n, run * 0.92, fill, null));
  }
  return out;
}

function samplerPots(side, z0, n, gap, fill, leaf) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const tall = 0.7 + (i % 3) * 0.45;
    const wide = 0.55 + (i % 2) * 0.35;
    const z = z0 + i * gap;
    out.push(samplerBox(side, z, 0, wide, 0.4, wide, fill, null));
    out.push(samplerBox(side, z, 0.4, wide * 1.5, tall, wide * 1.5, leaf, null));
  }
  return out;
}

const SAMPLER_STYLES = [
  {
    id: 'glass', name: 'Glass', sign: 'GLASS', color: '#3ee6ff', exteriorH: 12,
    blurb: 'Open room. Tall glass. A few pieces.',
    w: 26, d: 18, h: 4.8, floor: '#f3ecdf', wall: '#f7f4ef', ceil: '#fffdf8', glass: '#d7f4fb',
    props: [
      samplerBox(0, 8, 0.02, 7, 0.04, 4.2, '#e7d7c3', null),
      samplerBox(8.2, 14, 0, 0.7, 0.42, 0.7, '#efe6d8', null),
      samplerBox(8.2, 14, 0.42, 1.15, 1.15, 1.15, '#7dff6b', null)
    ].concat(samplerPanes(17.85, 0.4, 3.6, [-7.5, -2.5, 2.5, 7.5], '#d7f4fb', '#9ad4e2'))
  },
  {
    id: 'wood', name: 'Wood', sign: 'WOOD', color: '#ffb020', exteriorH: 11,
    blurb: 'Two rooms. Low ceiling. Warm lamps.',
    w: 22, d: 16, h: 3.6, floor: '#c4894a', wall: '#f4e4cf', ceil: '#f8efe4',
    props: [
      samplerBox(-5.5, 8, 0, 9, 3.35, 0.22, '#e6d0b0', '#c4a078'),
      samplerBox(5.5, 8, 0, 9, 3.35, 0.22, '#e6d0b0', '#c4a078'),
      samplerBox(0, 4.2, 0.02, 5.2, 0.05, 2.8, '#a33b2c', null),
      samplerBox(-6.2, 3.2, 0, 0.28, 1.55, 0.28, '#5c3b22', null),
      samplerBox(-6.2, 3.2, 1.5, 0.75, 0.28, 0.75, '#ffb020', null),
      samplerBox(6.4, 12.2, 0, 0.28, 1.45, 0.28, '#5c3b22', null),
      samplerBox(6.4, 12.2, 1.4, 0.65, 0.24, 0.65, '#ffd27a', null)
    ]
  },
  {
    id: 'pop', name: 'Pop', sign: 'POP', color: '#ff2a3d', exteriorH: 15,
    blurb: 'One tall room. Huge furniture. Lots of color.',
    w: 32, d: 22, h: 6.8, floor: '#fff6ea', wall: '#fffdf8', ceil: '#fffaf2',
    props: [
      samplerBox(-8, 8, 0.03, 6, 0.06, 5, '#ffb3e6', null),
      samplerBox(8, 14, 0.03, 7, 0.06, 4.5, '#9ff3ff', null),
      samplerBox(11, 16, 0, 1.8, 4.6, 1.8, '#3ee6ff', null),
      samplerBox(-12, 16.5, 0, 2.2, 3.3, 2.2, '#7dff6b', null),
      samplerBox(0, 21.7, 1.5, 7, 3.2, 0.16, '#ff4fd8', null),
      samplerBox(-11, 21.7, 1.6, 4.2, 2.5, 0.16, '#3ee6ff', null),
      samplerBox(11, 21.7, 1.8, 4.2, 2.8, 0.16, '#ffe14d', null)
    ]
  },
  {
    id: 'pastel', name: 'Pastel', sign: 'SOFT', color: '#ffb3e6', exteriorH: 12,
    blurb: 'Two rooms. A low wall. Small furniture.',
    w: 20, d: 18, h: 4.2, floor: '#fff8f4', wall: '#fffdfb', ceil: '#fffaf8',
    props: [
      samplerBox(-4.6, 9, 0, 7.2, 2.05, 0.16, '#f6e4ee', '#f0d0e0'),
      samplerBox(4.6, 9, 0, 7.2, 2.05, 0.16, '#f6e4ee', '#f0d0e0'),
      samplerBox(0, 4.2, 0.02, 3.2, 0.04, 2.1, '#fde8f0', null),
      samplerBox(1.2, 13.2, 0.02, 2.6, 0.04, 1.7, '#e5f7f1', null)
    ]
  },
  {
    id: 'loft', name: 'Loft', sign: 'LOFT', color: '#8a7a9d', exteriorH: 16,
    blurb: 'Tall loft. Stairs. An upper floor.',
    w: 28, d: 24, h: 7.4, floor: '#b7b1a8', wall: '#e4e0da', ceil: '#ece8e2',
    props: [
      samplerBox(-7, 18.2, 3.4, 12, 0.24, 8, '#8d867c', '#6e675f'),
      samplerBox(-7, 14.3, 3.64, 12, 0.9, 0.12, '#5c564e', null),
      samplerBox(6.2, 6.2, 0, 1.25, 1.25, 1.25, '#a89880', null),
      samplerBox(7.5, 7.3, 0, 0.85, 0.85, 0.85, '#8d7b68', null),
      samplerBox(-8.2, 5, 0, 0.32, 1.7, 0.32, '#4a453f', null),
      samplerBox(-8.2, 5, 1.65, 0.75, 0.22, 0.75, '#ffb020', null),
      samplerBox(11, 16, 0, 0.7, 7.1, 0.7, '#9a938a', null)
    ].concat(samplerStairs(4.2, 9, 3.4, 0.72, 8, '#7a736a')).concat(samplerPanes(23.75, 4.8, 1.7, [-8, -4, 0, 4, 8], '#d5e4e8', '#b7c9ce'))
  },
  {
    id: 'plants', name: 'Plants', sign: 'GREEN', color: '#7dff6b', exteriorH: 13,
    blurb: 'A long garden room. Big and small pots.',
    w: 36, d: 26, h: 5.6, floor: '#e7f2df', wall: '#f4f7f2', ceil: '#f7fbf4',
    props: [].concat(samplerPots(-14, 4, 6, 3.4, '#efe6d4', '#5fa86a'))
      .concat(samplerPots(14, 4.6, 6, 3.4, '#e7d8c4', '#7dff6b'))
      .concat(samplerPots(0, 14, 3, 3.2, '#f3ead8', '#3e8f55'))
      .concat(samplerPanes(25.75, 1.2, 3.2, [-12, -6, 0, 6, 12], '#e5f6ea', '#b7d7c0'))
  },
  {
    id: 'future', name: 'Future', sign: 'FUTURE', color: '#3ee6ff', exteriorH: 15,
    blurb: 'Very tall. Almost empty. Low seats.',
    w: 30, d: 16, h: 8, floor: '#e8eef4', wall: '#f4f7fb', ceil: '#f8fbfe',
    props: [
      samplerBox(0, 8, 7.72, 26, 0.08, 0.14, '#3ee6ff', null),
      samplerBox(0, 2.2, 0.04, 18, 0.06, 0.12, '#3ee6ff', null),
      samplerBox(0, 15.8, 2.2, 10, 4.2, 0.1, '#e7f7ff', '#3ee6ff')
    ]
  },
  {
    id: 'neon', name: 'Neon', sign: 'NEON', color: '#ff4fd8', exteriorH: 14,
    blurb: 'Night room. Thin glow strips. A row of screens.',
    w: 24, d: 18, h: 5.2, floor: '#241433', wall: '#321c4c', ceil: '#1a1028',
    props: [
      samplerBox(0, 9, 4.95, 20, 0.1, 0.14, '#3ee6ff', null),
      samplerBox(-11.8, 9, 2.2, 0.12, 0.12, 14, '#ff4fd8', null),
      samplerBox(11.8, 9, 2.2, 0.12, 0.12, 14, '#7dff6b', null)
    ]
  }
];

const HOUSE_ROOM = {
  id: 'house', name: 'Home', sign: 'HOME', color: '#7dff6b', exteriorH: 12,
  blurb: 'Ellie’s house. Glass, daylight, and the saved pieces.',
  w: 24, d: 18, h: 4.8, floor: '#f3ecdf', wall: '#f7f4ef', ceil: '#fffdf8', glass: '#d7f4fb',
  props: [].concat(samplerPanes(17.85, 0.4, 3.6, [-7, -2.4, 2.4, 7], '#d7f4fb', '#9ad4e2'))
};

const SAMPLER = {
  row: SAMPLER_ROW,
  styles: SAMPLER_STYLES,
  key: SAMPLER_KEY,
  view: null,
  stamps: [],
  fps: 0,
  styleId: 'glass'
};

function samplerById(id) {
  if (id === 'house') return HOUSE_ROOM;
  for (let i = 0; i < SAMPLER_STYLES.length; i++) if (SAMPLER_STYLES[i].id === id) return SAMPLER_STYLES[i];
  return SAMPLER_STYLES[0];
}

function samplerHex(p) {
  const c = (v) => { const n = Math.round(Math.max(0, Math.min(1, v)) * 255); return (n < 16 ? '0' : '') + n.toString(16); };
  return '#' + c(p.r) + c(p.g) + c(p.b);
}

function samplerFromParts(parts) {
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    out.push({
      x: p.x, z: p.z, y: p.y - p.sy / 2, w: p.sx, h: p.sy, d: p.sz,
      fill: samplerHex(p), stroke: null, yaw: p.yaw || 0
    });
  }
  return out;
}

function samplerDrop(bag, id, params, x, z, yaw, lift) {
  if (typeof PLANNER_PROPS === 'undefined' || !PLANNER_PROPS) return;
  PLANNER_PROPS.place(bag, PLANNER_PROPS.parts(id, params), x, lift || 0, z, yaw || 0);
}

function samplerTech(id) {
  const bag = [];
  const face = Math.PI;
  if (id === 'glass') {
    samplerDrop(bag, 'sofa', { w: 2.4, color: '#f7f4ee' }, -2.4, 6.6, 0);
    samplerDrop(bag, 'table', { w: 1.3, d: 0.7, color: '#ffffff', leg: '#d9cfc4' }, 1.6, 6.2, 0);
    samplerDrop(bag, 'screen', { w: 2.4, h: 1.3, color: '#d7e3ea', face: '#e7f6fb' }, 0, 16.6, face, 1.15);
  } else if (id === 'wood') {
    samplerDrop(bag, 'sofa', { w: 2.8, d: 0.95, h: 0.9, color: '#7a3428' }, -2.4, 6.2, face);
    samplerDrop(bag, 'table', { w: 1.6, d: 0.9, top: 0.74, color: '#c4894a', leg: '#5c3b22' }, 2.2, 6.4, 0);
  } else if (id === 'pop') {
    samplerDrop(bag, 'sofa', { w: 4.4, d: 1.4, h: 1.35, color: '#ff2a3d' }, -1.6, 6.8, 0.15);
    samplerDrop(bag, 'table', { w: 2.4, d: 1.2, top: 0.95, color: '#ffe14d', leg: '#ffb020' }, 3.2, 7.2, 0);
    samplerDrop(bag, 'screen', { w: 5.5, h: 2.8, color: '#ff4fd8', glow: '#3ee6ff' }, 0, 20.4, face, 1.6);
  } else if (id === 'pastel') {
    samplerDrop(bag, 'sofa', { w: 1.2, d: 0.62, h: 0.5, color: '#f7d6e4' }, -1.8, 5.6, 0.2);
    samplerDrop(bag, 'table', { w: 0.7, d: 0.5, top: 0.42, color: '#fff6dc', leg: '#f3d7c4' }, 2.0, 7.4, 0);
  } else if (id === 'loft') {
    samplerDrop(bag, 'sofa', { w: 2.2, d: 0.9, color: '#6e675f' }, -2.2, 6.4, 0);
    samplerDrop(bag, 'table', { w: 1.8, d: 0.8, top: 0.78, color: '#b7b1a8', leg: '#4a453f' }, 2.2, 7.6, 0);
    samplerDrop(bag, 'speaker', { color: '#4a453f', glow: '#ffb020' }, -4.2, 6.8, face);
  } else if (id === 'plants') {
    samplerDrop(bag, 'sofa', { w: 2.1, d: 0.8, h: 0.7, color: '#d7c4a8' }, -1.4, 7.2, 0);
    samplerDrop(bag, 'table', { w: 0.9, d: 0.6, color: '#efe6d4', leg: '#8a7360' }, 1.8, 6.6, 0);
  } else if (id === 'future') {
    samplerDrop(bag, 'sofa', { w: 3.2, d: 1.1, h: 0.42, color: '#f7fbff' }, 0, 6.4, 0);
    samplerDrop(bag, 'screen', { w: 8, h: 0.35, d: 0.04, color: '#e7f7ff', glow: '#3ee6ff', bezel: 0.04 }, 0, 15.2, face, 2.4);
  } else if (id === 'neon') {
    const glows = ['#3ee6ff', '#ff4fd8', '#ffe14d', '#7dff6b'];
    for (let i = 0; i < glows.length; i++) {
      samplerDrop(bag, 'screen', { w: 1.15, h: 1.7, color: '#1a1028', glow: glows[i] }, -3.9 + i * 2.6, 12.4, face, 0.55);
    }
    samplerDrop(bag, 'speaker', { glow: '#ff4fd8' }, 3.6, 6.6, face);
  }
  return samplerFromParts(bag);
}

function samplerHouseSave(opts) {
  if (opts && opts.save) return opts.save;
  if (typeof walkHouseLoad === 'function') return walkHouseLoad();
  return { theme: '#3ee6ff', furniture: 'sofa', petBed: true, sign: 'ELLIE' };
}

function samplerHouseParts(save) {
  const bag = [];
  const theme = save.theme || '#3ee6ff';
  const furn = save.furniture || 'sofa';
  const face = Math.PI;
  if (furn === 'arcade') {
    samplerDrop(bag, 'tv-stand', { w: 1.35, h: 0.72, screenH: 0.95, color: '#1b1e26', glow: theme }, 0, 8.4, face);
    samplerDrop(bag, 'screen', { w: 1.05, h: 1.35, color: '#1b1e26', glow: theme }, -2.4, 8.2, face, 0.2);
  } else if (furn === 'dj') {
    samplerDrop(bag, 'table', { w: 2.4, d: 0.85, top: 0.95, color: '#2a241c', leg: '#1c140c' }, 0, 7.6, 0);
    samplerDrop(bag, 'speaker', { h: 1.25, glow: theme }, -2.2, 7.2, face);
    samplerDrop(bag, 'speaker', { h: 1.25, glow: theme }, 2.2, 7.2, face);
  } else if (furn === 'trophy') {
    samplerDrop(bag, 'table', { w: 1.7, d: 0.55, top: 1.05, color: '#f7f4ee', leg: '#cfc6b8' }, 0, 8.2, 0);
    samplerDrop(bag, 'screen', { w: 1.45, h: 0.72, color: '#1b1e26', glow: theme }, 0, 8.35, face, 1.12);
  } else {
    samplerDrop(bag, 'sofa', { w: 2.6, d: 0.95, h: 0.82, color: '#f4efe6' }, -2.6, 6.6, 0);
    samplerDrop(bag, 'table', { w: 1.2, d: 0.7, color: '#d9c7a6' }, 1.4, 6.4, 0);
    samplerDrop(bag, 'screen', { w: 2.4, h: 1.25, color: '#1b1e26', glow: theme }, 0, 16.8, face, 1.15);
  }
  if (save.petBed !== false) {
    samplerDrop(bag, 'table', { w: 1.15, d: 0.75, top: 0.28, color: '#7dff6b', leg: '#3d6b48' }, 3.1, 5.2, 0);
  }
  return samplerFromParts(bag);
}

function samplerShade(hex, amt) {
  if (!hex || hex.charAt(0) !== '#' || hex.length < 7) return hex;
  const n = parseInt(hex.slice(1, 7), 16);
  const ch = (v) => { const x = v + amt; return x < 0 ? 0 : x > 255 ? 255 : x; };
  const r = ch(n >> 16), g = ch((n >> 8) & 255), b = ch(n & 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function samplerView(room, W, H) {
  const camZ = -0.8;
  const eye = 1.55;
  const dzFar = room.d - camZ;
  const focalW = (W * 0.42) * dzFar / (room.w * 0.5);
  const focalH = (H * 0.34) * dzFar / Math.max(room.h - eye, 1);
  return { cx: W * 0.5, cy: H * 0.42, focal: Math.min(focalW, focalH), eye: eye, camZ: camZ };
}

function samplerProject(x, y, z, view) {
  let dz = z - view.camZ;
  if (dz < 0.35) dz = 0.35;
  const f = view.focal / dz;
  return [view.cx + x * f, view.cy - (y - view.eye) * f, f];
}

function samplerQuad(g, pts, fill, stroke) {
  if (!pts[0] || !pts[1] || !pts[2] || !pts[3]) return;
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  g.lineTo(pts[1][0], pts[1][1]);
  g.lineTo(pts[2][0], pts[2][1]);
  g.lineTo(pts[3][0], pts[3][1]);
  g.closePath();
  g.fillStyle = fill;
  g.fill();
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = 2; g.stroke(); }
}

function samplerDrawBox(g, b, view) {
  const y0 = b.y, y1 = b.y + b.h, hx = b.w / 2, hz = b.d / 2;
  const yaw = b.yaw || 0, c = Math.cos(yaw), s = Math.sin(yaw);
  const P = (lx, y, lz) => samplerProject(b.x + lx * c + lz * s, y, b.z - lx * s + lz * c, view);
  const edge = b.stroke;
  samplerQuad(g, [P(-hx, y0, hz), P(hx, y0, hz), P(hx, y1, hz), P(-hx, y1, hz)], b.fill, edge);
  samplerQuad(g, [P(-hx, y0, -hz), P(-hx, y0, hz), P(-hx, y1, hz), P(-hx, y1, -hz)], samplerShade(b.fill, -22), edge);
  samplerQuad(g, [P(hx, y0, -hz), P(hx, y0, hz), P(hx, y1, hz), P(hx, y1, -hz)], samplerShade(b.fill, -12), edge);
  samplerQuad(g, [P(-hx, y1, -hz), P(hx, y1, -hz), P(hx, y1, hz), P(-hx, y1, hz)], samplerShade(b.fill, 18), edge);
  samplerQuad(g, [P(-hx, y0, -hz), P(hx, y0, -hz), P(hx, y1, -hz), P(-hx, y1, -hz)], samplerShade(b.fill, -8), edge);
}

function samplerShell(room) {
  const boxes = [
    samplerBox(0, room.d / 2, 0, room.w, 0.08, room.d, room.floor, null),
    samplerBox(-room.w / 2 + 0.12, room.d / 2, 0, 0.24, room.h, room.d, room.wall, null),
    samplerBox(room.w / 2 - 0.12, room.d / 2, 0, 0.24, room.h, room.d, room.wall, null)
  ];
  if (!room.glass) boxes.push(samplerBox(0, room.d - 0.12, 0, room.w, room.h, 0.24, room.wall, null));
  return boxes;
}

function samplerActors(opts) {
  if (opts && opts.x != null) return { x: opts.x, z: opts.z, petX: opts.petX, petZ: opts.petZ };
  const r = (typeof WALK_MODE !== 'undefined' && WALK_MODE && WALK_MODE.room) || {};
  const x = r.x || 0, z = r.z || 3.6;
  return {
    x: x, z: z,
    petX: r.petX != null ? r.petX : x + 1.35,
    petZ: r.petZ != null ? r.petZ : z + 0.25
  };
}

function samplerPerson(g, x, z, view) {
  samplerDrawBox(g, samplerBox(x, z, 0, 0.36, 0.82, 0.22, '#243044', null), view);
  samplerDrawBox(g, samplerBox(x, z + 0.02, 0.82, 0.46, 0.52, 0.24, '#2f7f96', '#1d4e5c'), view);
  samplerDrawBox(g, samplerBox(x - 0.34, z, 0.95, 0.12, 0.42, 0.12, '#2f7f96', null), view);
  samplerDrawBox(g, samplerBox(x + 0.34, z, 0.95, 0.12, 0.42, 0.12, '#2f7f96', null), view);
  const head = samplerProject(x, 1.55, z, view);
  const s = Math.max(8, head[2] * 0.16);
  g.fillStyle = '#3a2418';
  g.beginPath();
  g.arc(head[0], head[1] - s * 0.15, s * 0.95, 0, 6.3);
  g.fill();
  g.fillStyle = '#f0c8a8';
  g.beginPath();
  g.arc(head[0], head[1] + s * 0.15, s * 0.72, 0, 6.3);
  g.fill();
}

function samplerPet(g, x, z, view) {
  samplerDrawBox(g, samplerBox(x, z, 0, 0.46, 0.36, 0.7, '#ffb020', null), view);
  samplerDrawBox(g, samplerBox(x + 0.28, z, 0.36, 0.28, 0.28, 0.28, '#ffb020', null), view);
  samplerDrawBox(g, samplerBox(x + 0.34, z, 0.62, 0.1, 0.12, 0.08, '#fff2c0', null), view);
}

function samplerNoteFrame() {
  const t = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const s = SAMPLER.stamps;
  s.push(t);
  const cut = t - 500;
  while (s.length && s[0] < cut) s.shift();
  if (s.length > 2) SAMPLER.fps = (s.length - 1) / ((s[s.length - 1] - s[0]) / 1000);
  return SAMPLER.fps;
}

function samplerLikes() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAMPLER_KEY) || '{}');
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  } catch (e) { return {}; }
}

function samplerSaveLikes(o) {
  try { localStorage.setItem(SAMPLER_KEY, JSON.stringify(o)); } catch (e) {}
}

SAMPLER.liked = function (id) { return !!samplerLikes()[id]; };

SAMPLER.toggle = function (id) {
  const o = samplerLikes();
  o[id] = !o[id];
  samplerSaveLikes(o);
  SAMPLER.syncHeart();
  SAMPLER.fillPicks();
  return o[id];
};

function samplerPlacedProps(roomId) {
  const live = typeof EDITOR_CORE !== 'undefined' && EDITOR_CORE && EDITOR_CORE.live;
  if (live && live.open && live.roomId === roomId && Array.isArray(live.props)) return live.props;
  if (typeof ROOM_PLACE === 'undefined' || !ROOM_PLACE || typeof ROOM_PLACE.read !== 'function') return [];
  const saved = ROOM_PLACE.read(roomId) || [];
  if (saved.length) return saved;
  if (roomId === 'house' && !ROOM_PLACE.hasSave() && typeof EDITOR_CORE !== 'undefined' && EDITOR_CORE && typeof EDITOR_CORE.r1House === 'function') {
    return EDITOR_CORE.r1House();
  }
  return [];
}

function samplerPlacedBoxes(list) {
  const bag = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item || !item.prop) continue;
    samplerDrop(bag, item.prop, Object.assign({}, item.params || {}), item.x, item.z, item.yaw || 0, item.y || 0);
  }
  return samplerFromParts(bag);
}

function samplerCaption(g, caption) {
  if (!caption) return;
  g.font = '700 14px sans-serif';
  const w = Math.min(g.measureText(caption).width + 20, 360);
  g.fillStyle = '#04140c';
  g.fillRect(12, 12, w, 28);
  g.fillStyle = '#e9fff2';
  g.textAlign = 'left';
  g.fillText(caption, 22, 31);
}

SAMPLER.paint = function (g, W, H, id, opts) {
  const room = samplerById(id || SAMPLER.styleId);
  opts = opts || {};
  SAMPLER.styleId = room.id;
  if (room.id === 'house' && typeof ELLIE_BUILDER !== 'undefined' && ELLIE_BUILDER && ELLIE_BUILDER.open && ELLIE_BUILDER.view === 'floor') {
    ELLIE_BUILDER.paintFloor(g, W, H, opts);
    if (opts.live) {
      const fps = samplerNoteFrame();
      const el = document.getElementById('sampler-fps');
      if (el) el.textContent = (fps ? Math.round(fps) : '…') + ' FPS';
    }
    return room;
  }
  const view = samplerView(room, W, H);
  SAMPLER.view = view;
  g.fillStyle = room.ceil;
  g.fillRect(0, 0, W, H);
  const save = room.id === 'house' ? samplerHouseSave(opts) : null;
  const placed = samplerPlacedProps(room.id);
  const hideSamples = !save && placed.length > 0 && typeof ROOM_PLACE !== 'undefined' && ROOM_PLACE.hasSave();
  const gear = save ? samplerHouseParts(save) : (hideSamples ? [] : samplerTech(room.id));
  const extra = samplerPlacedBoxes(placed);
  const shell = samplerShell(room);
  const boxes = room.props.concat(gear, extra);
  boxes.sort((a, b) => (b.z - b.d / 2) - (a.z - a.d / 2));
  for (let i = 0; i < shell.length; i++) samplerDrawBox(g, shell[i], view);
  for (let i = 0; i < boxes.length; i++) samplerDrawBox(g, boxes[i], view);
  const live = typeof EDITOR_CORE !== 'undefined' && EDITOR_CORE && EDITOR_CORE.live;
  if (live && live.open && live.roomId === room.id && live.sel != null && live.props[live.sel]) {
    const item = live.props[live.sel];
    const spec = (EDITOR_CORE.sizes && EDITOR_CORE.sizes[item.prop]) || { w: 0.8, d: 0.8 };
    samplerDrawBox(g, samplerBox(item.x, item.z, 0.02, spec.w + 0.16, 0.045, spec.d + 0.16, '#3ee6ff', '#04140c'), view);
  }
  const who = samplerActors(opts);
  samplerPet(g, who.petX, who.petZ, view);
  samplerPerson(g, who.x, who.z, view);
  const label = samplerProject(0, room.h * 0.72, room.d - 0.4, view);
  g.fillStyle = room.id === 'neon' ? '#e9fff2' : '#243044';
  g.font = '700 28px sans-serif';
  g.textAlign = 'center';
  g.fillText(save ? (save.sign || 'ELLIE') : room.name, label[0], label[1]);
  if (opts.showChrome) {
    const ms = opts.ms != null ? opts.ms : 0;
    g.fillStyle = 'rgba(233,255,242,.92)';
    g.fillRect(W - 168, 16, 152, 36);
    g.fillStyle = '#04140c';
    g.font = '800 16px sans-serif';
    g.textAlign = 'right';
    g.fillText((ms && ms < 9 ? '110+' : 'FPS') + (ms ? ' · ' + ms.toFixed(1) + ' ms' : ''), W - 28, 40);
    g.fillStyle = opts.liked ? '#ff4fd8' : '#ffffff';
    g.fillRect(W - 196, H - 64, 176, 40);
    g.strokeStyle = '#ff4fd8';
    g.lineWidth = 2;
    g.strokeRect(W - 196, H - 64, 176, 40);
    g.fillStyle = opts.liked ? '#ffffff' : '#3a1028';
    g.font = '800 14px sans-serif';
    g.textAlign = 'center';
    g.fillText(opts.liked ? '♥ Liked' : '♡ I like this', W - 108, H - 38);
  }
  if (opts.live) {
    const fps = samplerNoteFrame();
    const el = document.getElementById('sampler-fps');
    if (el) el.textContent = (fps ? Math.round(fps) : '…') + ' FPS';
  }
  samplerCaption(g, opts.caption);
  return room;
};

function samplerStyleFromDoor(door) {
  const b = door && door.building;
  if (b && b.sampler) return b.sampler;
  const name = (door && door.purposeLabel) || '';
  for (let i = 0; i < SAMPLER_STYLES.length; i++) {
    if (SAMPLER_STYLES[i].name === name || SAMPLER_STYLES[i].sign === name) return SAMPLER_STYLES[i].id;
  }
  return SAMPLER.styleId || 'glass';
}

function samplerPurpose() {
  return typeof WALK_MODE !== 'undefined' && WALK_MODE && WALK_MODE.insideBuilding && WALK_MODE.insideDoor && WALK_MODE.insideDoor.purpose;
}

function samplerInside() {
  return samplerPurpose() === 'SAMPLER';
}

function samplerBig() {
  const p = samplerPurpose();
  return p === 'SAMPLER' || p === 'HOME';
}

function samplerClamp(v, a, b) { return v < a ? a : v > b ? b : v; }

function samplerStep(w, d) {
  const room = w.room || (w.room = { x: 0, z: 3.6, petX: 1.35, petZ: 3.85, tx: null, tz: null });
  const st = samplerById(SAMPLER.styleId);
  let ix = 0, iz = 0;
  if (typeof K !== 'undefined' && K) {
    ix = (K.ArrowRight || K.KeyD ? 1 : 0) - (K.ArrowLeft || K.KeyA ? 1 : 0);
    iz = (K.ArrowDown || K.KeyS ? 1 : 0) - (K.ArrowUp || K.KeyW ? 1 : 0);
  }
  const n = w.nudge;
  if (n && (Math.abs(n.x) > 0.01 || Math.abs(n.z) > 0.01)) { ix = n.x; iz = n.z; }
  if (!ix && !iz && typeof B !== 'undefined' && B && (B.walk || B.tup)) iz = -1;
  if (!ix && !iz && room.tx != null) {
    const dx = room.tx - room.x, dz = room.tz - room.z;
    if (Math.hypot(dx, dz) < 0.12) { room.tx = null; room.tz = null; }
    else { ix = dx; iz = dz; }
  }
  const len = Math.hypot(ix, iz);
  if (len > 0.01) {
    room.x = samplerClamp(room.x + (ix / len) * 5.5 * d, -st.w / 2 + 0.8, st.w / 2 - 0.8);
    room.z = samplerClamp(room.z - (iz / len) * 5.5 * d, 1.4, st.d - 1.2);
  }
  const k = Math.min(1, (d || 0.016) * 3.2);
  room.petX += ((room.x + 1.35) - room.petX) * k;
  room.petZ += ((room.z + 0.25) - room.petZ) * k;
}

function samplerUnproject(px, py, W, H) {
  const view = SAMPLER.view || samplerView(samplerById(SAMPLER.styleId), W, H);
  const ndcX = (px - view.cx) / view.focal;
  const ndcY = (view.cy - py) / view.focal;
  if (!(ndcY < -0.02)) return null;
  const t = -view.eye / ndcY;
  return { x: t * ndcX, z: view.camZ + t };
}

function samplerEnsureUi() {
  if (typeof document === 'undefined' || document.getElementById('sampler-heart')) return;
  const css = document.createElement('style');
  css.textContent = '#sampler-heart,#sampler-picks-open{position:absolute;z-index:4;border:2px solid #ff4fd8;border-radius:999px;padding:8px 12px;font:800 13px Orbitron,Rajdhani,sans-serif;cursor:pointer}#sampler-heart{right:14px;bottom:64px;background:#fff;color:#3a1028}#sampler-heart.on{background:#ff4fd8;color:#fff}#sampler-picks-open{right:14px;top:52px;background:#e9fff2;color:#04140c;border-color:#7dff6b}#sampler-fps{position:absolute;z-index:4;right:14px;top:14px;background:#e9fff2;color:#04140c;border-radius:999px;padding:6px 10px;font:800 12px sans-serif}#sampler-results{position:fixed;inset:0;z-index:120;background:rgba(8,6,16,.55);display:flex;align-items:center;justify-content:center}#sampler-results[hidden]{display:none}#sampler-results .card{width:min(440px,calc(100% - 28px));max-height:calc(100% - 28px);overflow:auto;background:#fffdf8;color:#1c140c;border-radius:18px;padding:16px 16px 12px;font:700 14px Rajdhani,sans-serif}#sampler-results h2{margin:0 0 4px;font:800 18px Orbitron,sans-serif}#sampler-results p{margin:0 0 10px;opacity:.8}#sampler-results li{display:flex;gap:8px;align-items:baseline;padding:6px 0;border-top:1px solid #f0e6da;list-style:none}#sampler-results ul{margin:0;padding:0}#sampler-results button{margin-top:10px;border:0;border-radius:999px;background:#3ee6ff;color:#041018;font:800 13px Orbitron,sans-serif;padding:8px 14px;cursor:pointer}';
  document.head.appendChild(css);
  const heart = document.createElement('button');
  heart.id = 'sampler-heart';
  heart.type = 'button';
  heart.textContent = '♡ I like this one';
  heart.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); SAMPLER.toggle(SAMPLER.styleId); });
  const fps = document.createElement('div');
  fps.id = 'sampler-fps';
  fps.textContent = '… FPS';
  const picks = document.createElement('button');
  picks.id = 'sampler-picks-open';
  picks.type = 'button';
  picks.textContent = 'Picks';
  picks.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); SAMPLER.showPicks(); });
  const sheet = document.createElement('div');
  sheet.id = 'sampler-results';
  sheet.hidden = true;
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('h2');
  h.textContent = "Ellie's picks";
  const note = document.createElement('p');
  note.textContent = 'Saved on this device.';
  const ul = document.createElement('ul');
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close';
  close.addEventListener('click', () => SAMPLER.hidePicks());
  card.append(h, note, ul, close);
  sheet.appendChild(card);
  document.body.appendChild(sheet);
  const room = document.getElementById('walk-interior') || document.body;
  room.append(fps, picks, heart);
}

SAMPLER.syncHeart = function () {
  const b = typeof document !== 'undefined' && document.getElementById('sampler-heart');
  if (!b) return;
  const on = SAMPLER.liked(SAMPLER.styleId);
  b.classList.toggle('on', on);
  b.textContent = on ? '♥ I like this one' : '♡ I like this one';
  b.setAttribute('aria-pressed', on ? 'true' : 'false');
};

SAMPLER.fillPicks = function () {
  const ul = typeof document !== 'undefined' && document.querySelector('#sampler-results ul');
  if (!ul) return;
  ul.replaceChildren();
  const likes = samplerLikes();
  for (let i = 0; i < SAMPLER_STYLES.length; i++) {
    const st = SAMPLER_STYLES[i];
    const li = document.createElement('li');
    const mark = document.createElement('b');
    mark.textContent = likes[st.id] ? '♥' : '♡';
    mark.style.color = likes[st.id] ? '#ff4fd8' : '#8a7a9d';
    const name = document.createElement('span');
    name.textContent = st.name + ' — ' + st.blurb;
    li.append(mark, name);
    ul.appendChild(li);
  }
};

SAMPLER.showPicks = function () {
  samplerEnsureUi();
  SAMPLER.fillPicks();
  const sheet = document.getElementById('sampler-results');
  if (sheet) sheet.hidden = false;
};

SAMPLER.hidePicks = function () {
  const sheet = document.getElementById('sampler-results');
  if (sheet) sheet.hidden = true;
};

SAMPLER.attach = function () { samplerEnsureUi(); };

SAMPLER.onHome = function () {
  samplerEnsureUi();
  SAMPLER.styleId = 'house';
  SAMPLER.stamps = [];
  SAMPLER.fps = 0;
  if (typeof WALK_MODE !== 'undefined' && WALK_MODE) {
    WALK_MODE.room = { x: 0, z: 3.6, yaw: 0, petX: 1.35, petZ: 3.85, tx: null, tz: null };
  }
  const card = document.getElementById('walk-interior');
  const heart = document.getElementById('sampler-heart');
  const fps = document.getElementById('sampler-fps');
  const picks = document.getElementById('sampler-picks-open');
  if (card && fps && fps.parentElement !== card) card.appendChild(fps);
  if (heart) heart.hidden = true;
  if (picks) picks.hidden = true;
  if (fps) fps.hidden = false;
};

SAMPLER.onEnter = function (door) {
  samplerEnsureUi();
  SAMPLER.styleId = samplerStyleFromDoor(door);
  SAMPLER.stamps = [];
  SAMPLER.fps = 0;
  const st = samplerById(SAMPLER.styleId);
  if (typeof WALK_MODE !== 'undefined' && WALK_MODE) {
    WALK_MODE.room = { x: 0, z: 3.6, yaw: 0, petX: 1.35, petZ: 3.85, tx: null, tz: null };
  }
  const card = document.getElementById('walk-interior');
  const blurb = card && card.querySelector('[data-k="act"]');
  if (blurb) blurb.textContent = st.blurb;
  const heart = document.getElementById('sampler-heart');
  const fps = document.getElementById('sampler-fps');
  const picks = document.getElementById('sampler-picks-open');
  if (card && heart && heart.parentElement !== card) card.append(fps, picks, heart);
  if (heart) heart.hidden = false;
  if (fps) fps.hidden = false;
  if (picks) picks.hidden = false;
  SAMPLER.syncHeart();
};

SAMPLER.onLeave = function () {
  SAMPLER.hidePicks();
  const heart = document.getElementById('sampler-heart');
  const fps = document.getElementById('sampler-fps');
  const picks = document.getElementById('sampler-picks-open');
  if (heart) heart.hidden = true;
  if (fps) fps.hidden = true;
  if (picks) picks.hidden = true;
};

SAMPLER.place = function () {
  if (typeof CITY === 'undefined' || !CITY || typeof CITY.add !== 'function' || !CITY.BL) return 0;
  if (CITY.BL.some((b) => b && b.sampler)) return 0;
  let n = 0;
  for (let i = 0; i < SAMPLER_STYLES.length; i++) {
    const st = SAMPLER_STYLES[i];
    const z = SAMPLER_ROW.z0 + i * SAMPLER_ROW.step;
    const x = SAMPLER_ROW.x;
    const w = SAMPLER_ROW.w, d = SAMPLER_ROW.d, h = st.exteriorH;
    const sign = { x: x + w / 2 + 0.12, z: z, y: h * 0.62, y0: Math.max(3.2, h - 4.2), y1: h - 1.1, nx: 1, nz: 0, w: 8, h: 2.4, t: st.sign, word: st.sign, c: st.color };
    CITY.add({
      prefab: 'shop_low', x: x, z: z, w: w, d: d, h: h,
      p: {
        purpose: 'SAMPLER', purposeLabel: st.name, district: 'SPAWN_SOUTH', sign: sign,
        c: st.color, wc: '#fff2c0', kind: 'b', tiers: [1], wseed: 40 + i, dash: [4.5, 2.5]
      }
    });
    const b = CITY.BL[CITY.BL.length - 1];
    b.sampler = st.id;
    b.samplerRow = 1;
    n++;
  }
  return n;
};

function samplerHook() {
  if (typeof walkPaintRoom !== 'function' || walkPaintRoom._sampler) return;
  const prevPaint = walkPaintRoom;
  walkPaintRoom = function () {
    if (samplerBig()) {
      const cv = document.getElementById('walk-room-cv');
      const card = document.getElementById('walk-interior');
      if (!cv) return;
      const W = Math.max(320, Math.floor((card && card.clientWidth) || window.innerWidth || 844));
      const H = Math.max(180, Math.floor((card && card.clientHeight) || window.innerHeight || 390));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const g = cv.getContext('2d');
      if (!g) return;
      const home = samplerPurpose() === 'HOME';
      SAMPLER.paint(g, W, H, home ? 'house' : samplerStyleFromDoor(WALK_MODE.insideDoor), {
        live: true,
        save: home && typeof walkHouseLoad === 'function' ? walkHouseLoad() : null
      });
      return;
    }
    return prevPaint();
  };
  walkPaintRoom._sampler = 1;
  if (typeof walkRoomStep === 'function') {
    const prevStep = walkRoomStep;
    walkRoomStep = function (w, d) { if (samplerBig()) return samplerStep(w, d); return prevStep(w, d); };
  }
  if (typeof walkUniso === 'function') {
    const prevUn = walkUniso;
    walkUniso = function (px, py, W, H) {
      if (samplerBig()) {
        const hit = samplerUnproject(px, py, W, H);
        const st = samplerById(SAMPLER.styleId);
        if (hit) return { x: samplerClamp(hit.x, -st.w / 2, st.w / 2), z: samplerClamp(hit.z, 0.4, st.d) };
      }
      return prevUn(px, py, W, H);
    };
  }
  if (typeof walkShowInterior === 'function') {
    const prevShow = walkShowInterior;
    walkShowInterior = function (door) {
      prevShow(door);
      if (door && door.purpose === 'SAMPLER') SAMPLER.onEnter(door);
      else if (door && door.purpose === 'HOME') SAMPLER.onHome();
      else SAMPLER.onLeave();
    };
  }
  if (typeof walkHideInterior === 'function') {
    const prevHide = walkHideInterior;
    walkHideInterior = function () { SAMPLER.onLeave(); return prevHide(); };
  }
}

if (typeof document !== 'undefined') {
  samplerHook();
  if (typeof CITY !== 'undefined') SAMPLER.place();
}

SAMPLER.tech = samplerTech;
SAMPLER.houseParts = samplerHouseParts;
SAMPLER.project = samplerProject;
SAMPLER.unproject = samplerUnproject;
if (typeof window !== 'undefined') window.SAMPLER = SAMPLER;
if (typeof globalThis !== 'undefined') globalThis.SAMPLER = SAMPLER;
