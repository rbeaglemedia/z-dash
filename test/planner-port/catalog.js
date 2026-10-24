/* Stand-in parametric prop kit for the planner-port proof.
   These meshes are original boxes. They are not copied from
   rbeaglemedia/event-space-planner. Source ids are the names Bob
   used (addScreen, LED trailer, truss, TV stand, speaker stack, table).
   When the private repo is readable, swap the bakers for the real
   modules and keep these ids. */
'use strict';

export function hex(c) {
  const s = String(c || '#888').replace('#', '');
  const n = parseInt(s.length === 3 ? s.replace(/./g, (ch) => ch + ch) : s, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function part(x, y, z, sx, sy, sz, color, mode, yaw, pitch) {
  const rgb = hex(color);
  return {
    x, y, z, sx, sy, sz,
    yaw: yaw || 0, pitch: pitch || 0,
    r: rgb[0], g: rgb[1], b: rgb[2],
    mode: mode || 0
  };
}

function emit(local, x, y, z, yaw) {
  const c = Math.cos(yaw || 0), s = Math.sin(yaw || 0);
  return local.map((p) => {
    const px = p.x * c + p.z * s;
    const pz = -p.x * s + p.z * c;
    return Object.assign({}, p, { x: x + px, y: y + p.y, z: z + pz, yaw: (p.yaw || 0) + (yaw || 0) });
  });
}

/* One screen face. w/h/d in metres. video=true marks the single shared texture. */
export function screen(o) {
  const w = o.w, h = o.h, d = o.d == null ? 0.06 : o.d;
  const bezel = o.bezel == null ? Math.min(w, h) * 0.06 : o.bezel;
  const body = o.color || '#14161c';
  const face = o.face || '#07141c';
  const mode = o.video ? 2 : (o.glow ? 1 : 0);
  const glow = o.glow || face;
  return [
    part(0, h / 2, 0, w, h, d, body, 0),
    part(0, h / 2, d * 0.5 + 0.004, Math.max(0.05, w - bezel * 2), Math.max(0.05, h - bezel * 2), 0.012, mode ? glow : face, mode)
  ];
}

export function table(o) {
  const w = o.w || 1.2, d = o.d || 0.7, top = o.top || 0.75;
  const col = o.color || '#d9c7a6';
  const leg = o.leg || '#8a7360';
  const lx = w * 0.42, lz = d * 0.38;
  return [
    part(0, top, 0, w, 0.06, d, col, 0),
    part(-lx, top / 2, -lz, 0.06, top, 0.06, leg, 0),
    part(lx, top / 2, -lz, 0.06, top, 0.06, leg, 0),
    part(-lx, top / 2, lz, 0.06, top, 0.06, leg, 0),
    part(lx, top / 2, lz, 0.06, top, 0.06, leg, 0)
  ];
}

export function sofa(o) {
  const w = o.w || 2.1, d = o.d || 0.85, h = o.h || 0.78;
  const col = o.color || '#f4efe6';
  return [
    part(0, 0.22, 0, w, 0.36, d, col, 0),
    part(0, 0.52, -d * 0.38, w, 0.42, 0.16, col, 0),
    part(-w / 2 + 0.1, 0.4, 0.02, 0.16, 0.36, d * 0.86, col, 0),
    part(w / 2 - 0.1, 0.4, 0.02, 0.16, 0.36, d * 0.86, col, 0)
  ];
}

export function tvStand(o) {
  const w = o.w || 1.15, h = o.h || 0.42;
  const col = o.color || '#f7f4ee';
  const scr = screen({ w: w * 0.78, h: o.screenH || 0.62, d: 0.05, color: '#1b1e26', glow: o.glow || '#3ee6ff', video: !!o.video, bezel: 0.04 });
  const local = [
    part(0, h * 0.5, 0, w, h, 0.42, col, 0),
    part(0, 0.04, 0, w * 1.05, 0.06, 0.48, '#cfc6b8', 0)
  ];
  scr.forEach((p) => { p.y += h; });
  return local.concat(scr);
}

export function speaker(o) {
  const w = o.w || 0.55, h = o.h || 0.9, d = o.d || 0.45;
  const col = o.color || '#1c1e24';
  const glow = o.glow || '#ff4fd8';
  return [
    part(0, h / 2, 0, w, h, d, col, 0),
    part(0, h * 0.72, d / 2 + 0.01, w * 0.55, w * 0.55, 0.04, glow, o.glow ? 1 : 0),
    part(0, h * 0.34, d / 2 + 0.01, w * 0.42, w * 0.42, 0.04, '#2a2e36', 0)
  ];
}

export function trussSeg(o) {
  const len = o.len || 2, h = o.h || 0.35, col = o.color || '#d5d8de';
  const t = 0.06;
  return [
    part(0, h, 0, len, t, t, col, 0),
    part(0, 0, 0, len, t, t, col, 0),
    part(0, h / 2, 0, t, h, t, col, 0),
    part(-len * 0.28, h / 2, 0, t, h, t, col, 0),
    part(len * 0.28, h / 2, 0, t, h, t, col, 0)
  ];
}

/* LED trailer body. Screen is the side face. video only when this is the towed one. */
export function ledTrailer(o) {
  const L = o.len || 4.2, W = o.w || 2.05, H = o.h || 2.35;
  const body = o.color || '#f4f1ea';
  const scr = screen({
    w: o.screenW || L * 0.72, h: o.screenH || 1.35, d: 0.04,
    color: '#12141a', glow: o.glow || '#3ee6ff', video: !!o.video, bezel: 0.05
  });
  scr.forEach((p) => { p.x += 0.15; p.y += 0.85; p.z += W / 2; });
  return [
    part(0, 0.55, 0, L, 0.28, W, '#2c3038', 0),
    part(0, 0.55 + H * 0.42, 0, L * 0.92, H * 0.7, W * 0.92, body, 0),
    part(-L * 0.42, 0.32, W * 0.38, 0.55, 0.55, 0.28, '#1a1c22', 0),
    part(-L * 0.42, 0.32, -W * 0.38, 0.55, 0.55, 0.28, '#1a1c22', 0),
    part(L * 0.28, 0.32, W * 0.38, 0.55, 0.55, 0.28, '#1a1c22', 0),
    part(L * 0.28, 0.32, -W * 0.38, 0.55, 0.55, 0.28, '#1a1c22', 0),
    part(-L * 0.62, 0.42, 0, 0.9, 0.08, 0.12, '#8a9098', 0)
  ].concat(scr);
}

export function place(list, local, x, y, z, yaw) {
  emit(local, x, y, z, yaw).forEach((p) => list.push(p));
}

/* Remixes. Same base parts, different params. No new mesh. */
export function remix(id) {
  if (id === 'food-truck') {
    const trailer = ledTrailer({ len: 4.6, w: 2.15, h: 2.5, color: '#f7f1e4', glow: '#ffb020', screenW: 2.4, screenH: 1.15, video: false });
    return trailer.concat([
      part(2.55, 1.35, 0, 1.5, 1.7, 2.05, '#f7f1e4', 0),
      part(2.7, 1.55, 1.02, 0.7, 0.55, 0.04, '#9fd8ea', 0),
      part(0.2, 2.15, 1.12, 2.2, 0.08, 0.9, '#ff4fd8', 1),
      part(-0.4, 1.15, 1.16, 1.4, 0.08, 0.35, '#d9c7a6', 0)
    ]);
  }
  if (id === 'stage') {
    const scr = screen({ w: 8, h: 4.2, d: 0.08, color: '#14161c', glow: '#3ee6ff', video: false, bezel: 0.12 });
    scr.forEach((p) => { p.y += 1.2; });
    const deck = [part(0, 0.55, 1.6, 9.2, 0.9, 3.2, '#1c1e24', 0)];
    const posts = [];
    [[-4.2, -0.2], [4.2, -0.2], [-4.2, 3.2], [4.2, 3.2]].forEach(([x, z]) => {
      trussSeg({ len: 5.2, h: 0.4, color: '#d5d8de' }).forEach((p) => {
        posts.push(Object.assign({}, p, { x: x + p.z, y: p.y + 1.1, z: z, yaw: Math.PI / 2 }));
      });
    });
    return deck.concat(scr, posts);
  }
  if (id === 'mobile-billboard') {
    const scr = screen({ w: 6.2, h: 3.2, d: 0.08, color: '#12141a', glow: '#ff4fd8', video: false, bezel: 0.1 });
    scr.forEach((p) => { p.y += 2.4; });
    return [
      part(0, 0.45, 0, 3.4, 0.35, 1.8, '#2c3038', 0),
      part(-1.1, 0.32, 0.7, 0.5, 0.5, 0.24, '#1a1c22', 0),
      part(1.1, 0.32, 0.7, 0.5, 0.5, 0.24, '#1a1c22', 0),
      part(-1.1, 0.32, -0.7, 0.5, 0.5, 0.24, '#1a1c22', 0),
      part(1.1, 0.32, -0.7, 0.5, 0.5, 0.24, '#1a1c22', 0),
      part(0, 1.7, 0, 0.18, 2.2, 0.18, '#d5d8de', 0),
      part(0, 1.7, 0.35, 0.18, 2.2, 0.18, '#d5d8de', 0)
    ].concat(scr);
  }
  if (id === 'welcome-gate') {
    const left = trussSeg({ len: 8, h: 0.45, color: '#e6e8ee' }).map((p) => Object.assign({}, p, { x: -4.2, y: p.y + 0.2, yaw: Math.PI / 2 }));
    const right = trussSeg({ len: 8, h: 0.45, color: '#e6e8ee' }).map((p) => Object.assign({}, p, { x: 4.2, y: p.y + 0.2, yaw: Math.PI / 2 }));
    const beam = trussSeg({ len: 9.2, h: 0.4, color: '#e6e8ee' }).map((p) => Object.assign({}, p, { y: p.y + 7.6 }));
    const sign = screen({ w: 6.4, h: 1.35, d: 0.08, color: '#12141a', glow: '#7dff6b', video: false, bezel: 0.08 });
    sign.forEach((p) => { p.y += 6.3; });
    return left.concat(right, beam, sign);
  }
  if (id === 'bridge') {
    const out = [];
    for (let i = 0; i < 8; i++) {
      trussSeg({ len: 2.4, h: 1.1, color: '#d5d8de' }).forEach((p) => {
        out.push(Object.assign({}, p, { x: -8.4 + i * 2.4, y: p.y + 3.2 }));
      });
    }
    out.push(part(0, 3.15, 0, 19.2, 0.12, 2.4, '#c8bba4', 0));
    return out;
  }
  if (id === 'ticket-booth') {
    const stand = tvStand({ w: 1.5, h: 1.05, screenH: 0.72, color: '#f7f4ee', glow: '#3ee6ff', video: false });
    return stand.concat([
      part(0, 1.15, 0.55, 1.7, 0.08, 0.7, '#d9c7a6', 0),
      part(0, 1.55, -0.15, 1.55, 1.1, 0.08, '#f4efe6', 0)
    ]);
  }
  if (id === 'speaker-tower') {
    const out = [];
    for (let i = 0; i < 4; i++) {
      speaker({ w: 0.7, h: 1.15, d: 0.55, glow: i % 2 ? '#ff4fd8' : '#3ee6ff' }).forEach((p) => {
        out.push(Object.assign({}, p, { y: p.y + i * 1.15 }));
      });
    }
    return out;
  }
  if (id === 'snack-counter') {
    const top = table({ w: 3.2, d: 0.9, top: 1.05, color: '#f3ead7', leg: '#8a7360' });
    const scr = screen({ w: 0.42, h: 0.28, d: 0.04, color: '#1b1e26', glow: '#ffe14d', video: false, bezel: 0.03 });
    scr.forEach((p) => { p.y += 1.12; p.z += 0.2; });
    return top.concat([
      part(0, 0.55, 0.42, 3.05, 0.9, 0.08, '#f7f1e4', 0)
    ], scr);
  }
  return [];
}

export const REMIXES = [
  { id: 'food-truck', title: 'LED trailer as a food truck', base: 'ledTrailer' },
  { id: 'stage', title: 'LED trailer screen as a stage', base: 'screen' },
  { id: 'mobile-billboard', title: 'LED trailer as a mobile billboard', base: 'ledTrailer' },
  { id: 'welcome-gate', title: 'Truss as a welcome gate', base: 'trussSeg' },
  { id: 'ticket-booth', title: 'TV stand as a ticket booth', base: 'tvStand' },
  { id: 'speaker-tower', title: 'Speaker stack as a tower', base: 'speaker' },
  { id: 'snack-counter', title: 'Table as a snack counter', base: 'table' },
  { id: 'bridge', title: 'Truss as a short bridge', base: 'trussSeg' }
];
