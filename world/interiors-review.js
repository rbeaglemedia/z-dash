/* Review kits for the six walk-in rooms. Plan prototypes only.
   Painted with the live interior renderer (style-sampler.js) and
   PLANNER_PROPS. Roofs use PLANNER_TOOLS.roof. This file does not
   write a save, and it does not set shadowBlur. */
'use strict';

const INTERIOR_ROOMS = {
  house: 'House',
  arcade: 'Arcade',
  cafe: 'Cafe',
  pets: 'Pet lounge',
  soccer: 'Soccer shop',
  builder: 'Builder HQ'
};

const INTERIOR_ACTORS = {
  ellie: { x: -0.35, z: 3.55 },
  pet: { x: 1.2, z: 3.85 },
  ellieM: 1.7,
  petM: 0.74
};

function interiorBox(x, z, y, w, h, d, fill, stroke) {
  return samplerBox(x, z, y, w, h, d, fill, stroke);
}

function interiorPanes(z, y, h, xs, fill, edge) {
  return samplerPanes(z, y, h, xs, fill, edge);
}

function interiorPots(side, z0, n, gap, pot, leaf) {
  return samplerPots(side, z0, n, gap, pot, leaf);
}

function interiorDrops(list) {
  const bag = [];
  for (let i = 0; i < list.length; i++) {
    const it = list[i];
    samplerDrop(bag, it.id, it.params || {}, it.x, it.z, it.yaw || 0, it.y || 0);
  }
  return samplerFromParts(bag);
}

function interiorRoof(b, kind, fill) {
  if (typeof PLANNER_TOOLS === 'undefined' || !PLANNER_TOOLS || typeof PLANNER_TOOLS.roof !== 'function') return [];
  const parts = PLANNER_TOOLS.roof(b, kind) || [];
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    out.push(interiorBox((p.x0 + p.x1) / 2, (p.z0 + p.z1) / 2, p.y0, p.x1 - p.x0, p.y1 - p.y0, p.z1 - p.z0, fill, null));
  }
  return out;
}

function interiorStyle(room, n, id, name, line, spec, props, drops) {
  spec.room = room;
  spec.n = n;
  spec.id = id;
  spec.name = name;
  spec.line = line;
  spec.props = props;
  spec.drops = drops;
  return spec;
}

const INTERIOR_STYLES = {
  house: [
    interiorStyle('house', 1, 'glass', 'Glass loft', 'A bright glass house with a cyan light and a soft sofa.', {
      w: 24, d: 18, h: 4.8, floor: '#f3ecdf', wall: '#f7f4ef', ceil: '#fffdf8', glass: '#d7f4fb'
    }, [].concat(
      interiorPanes(17.85, 0.35, 3.7, [-7.2, -2.4, 2.4, 7.2], '#d7f4fb', '#9ad4e2'),
      interiorBox(0, 9, 4.55, 16, 0.08, 0.12, '#3ee6ff', null),
      interiorBox(0, 7.2, 0.02, 6.4, 0.04, 3.6, '#e7d7c3', null)
    ), [
      { id: 'sofa', params: { w: 2.6, d: 0.95, h: 0.82, color: '#f4efe6' }, x: -2.4, z: 6.8 },
      { id: 'table', params: { w: 1.2, d: 0.7, color: '#d9c7a6' }, x: 1.6, z: 6.6 },
      { id: 'tv85', params: { glow: '#3ee6ff' }, x: -4.6, z: 16.9, yaw: Math.PI, y: 1.15 },
      { id: 'table', params: { w: 1.15, d: 0.75, top: 0.28, color: '#7dff6b', leg: '#3d6b48' }, x: 3.4, z: 5.6 }
    ]),
    interiorStyle('house', 2, 'cabin', 'Timber cabin', 'A warm wood cabin with a big window and a stone hearth.', {
      w: 22, d: 16, h: 4.2, floor: '#c4894a', wall: '#f4e4cf', ceil: '#f8efe4', glass: '#d5e6ea'
    }, [].concat(
      interiorBox(-5.2, 8, 0, 8.4, 3.5, 0.22, '#e6d0b0', '#c4a078'),
      interiorBox(5.2, 8, 0, 8.4, 3.5, 0.22, '#e6d0b0', '#c4a078'),
      interiorPanes(15.85, 0.8, 2.4, [-6, -2, 2, 6], '#d5e6ea', '#9bb8c0'),
      interiorBox(0, 5.2, 0.02, 4.2, 0.06, 2.4, '#8d4a3a', null),
      interiorBox(-6.4, 4.2, 0, 0.28, 1.5, 0.28, '#5c3b22', null),
      interiorBox(-6.4, 4.2, 1.45, 0.7, 0.22, 0.7, '#ffb020', null),
      interiorBox(6.2, 11.5, 0, 0.28, 1.4, 0.28, '#5c3b22', null),
      interiorBox(6.2, 11.5, 1.35, 0.62, 0.2, 0.62, '#ffd27a', null),
      interiorRoof({ x0: -4.2, x1: 4.2, z0: 4.2, z1: 10, h: 2.55 }, 'pitch', '#a56b3c')
    ), [
      { id: 'sofa', params: { w: 2.4, d: 0.9, h: 0.85, color: '#7a3428' }, x: -2.2, z: 7.4, yaw: Math.PI },
      { id: 'table', params: { w: 1.4, d: 0.8, top: 0.7, color: '#c4894a', leg: '#5c3b22' }, x: 2.1, z: 7.2 },
      { id: 'screen', params: { w: 1.4, h: 0.8, color: '#5c3b22', face: '#f4e4cf' }, x: 0, z: 14.6, yaw: Math.PI, y: 1.2 }
    ]),
    interiorStyle('house', 3, 'sky', 'Sky penthouse', 'A tall glass room with a gold edge and a low lounge.', {
      w: 30, d: 20, h: 7.2, floor: '#e7e2da', wall: '#f7f5f1', ceil: '#fbfaf7', glass: '#d5e6ee'
    }, [].concat(
      interiorPanes(19.85, 0.4, 5.6, [-10, -5, 0, 5, 10], '#d5e6ee', '#b7c9ce'),
      interiorBox(0, 10, 0.02, 8, 0.05, 4, '#d9c7a0', null),
      interiorBox(-14.7, 10, 1.2, 0.12, 0.08, 16, '#e6c56a', null),
      interiorBox(14.7, 10, 1.2, 0.12, 0.08, 16, '#e6c56a', null),
      interiorRoof({ x0: -14, x1: 14, z0: 2, z1: 18, h: 6.7 }, 'flat', '#efe6d4')
    ), [
      { id: 'sofa', params: { w: 3.2, d: 1.05, h: 0.55, color: '#f7f4ee' }, x: -2.2, z: 7.2 },
      { id: 'table', params: { w: 1.8, d: 0.8, top: 0.42, color: '#f7f4ee', leg: '#cfc6b8' }, x: 2.4, z: 7.4 },
      { id: 'screen', params: { w: 3.2, h: 1.6, color: '#e7e2da', glow: '#e6c56a' }, x: 0, z: 18.4, yaw: Math.PI, y: 1.3 },
      { id: 'table', params: { w: 1.1, d: 0.7, top: 0.28, color: '#7dff6b', leg: '#3d6b48' }, x: 4.2, z: 5.8 }
    ]),
    interiorStyle('house', 4, 'block', 'Block home', 'Chunky wood blocks, a glass window, and a cube seat.', {
      w: 24, d: 18, h: 5.4, floor: '#d7c4a2', wall: '#f3ead7', ceil: '#fff8ee', glass: '#c8efe8'
    }, [].concat(
      interiorPanes(17.85, 1.2, 2.4, [-6, -2, 2, 6], '#c8efe8', '#8ec9c0'),
      interiorBox(-8.2, 8, 0, 2.2, 2.2, 2.2, '#c4894a', null),
      interiorBox(-8.2, 8, 2.2, 1.4, 1.4, 1.4, '#7dff6b', null),
      interiorBox(8.4, 12, 0, 2.4, 1.2, 2.4, '#e6d0b0', null),
      interiorBox(8.4, 12, 1.2, 1.6, 1.6, 1.6, '#ffb020', null),
      interiorBox(0, 12.5, 0, 2.2, 0.7, 2.2, '#f4efe6', null),
      interiorBox(-6.5, 14.5, 0, 1.6, 1.6, 1.6, '#3ee6ff', null)
    ), [
      { id: 'sofa', params: { w: 2.2, d: 0.9, h: 0.9, color: '#f4efe6' }, x: -1.8, z: 7.2 },
      { id: 'table', params: { w: 1.2, d: 1.2, top: 0.6, color: '#c4894a', leg: '#5c3b22' }, x: 2.4, z: 7.6 },
      { id: 'tv85', params: { glow: '#7dff6b' }, x: 4.8, z: 16.6, yaw: Math.PI, y: 1.2 }
    ])
  ],
  arcade: [
    interiorStyle('arcade', 1, 'retro', 'Retro lane', 'A purple hall of bright cabinets and a gold jackpot.', {
      w: 36, d: 16, h: 5.2, floor: '#4a3568', wall: '#5c427c', ceil: '#3a2a55', glass: ''
    }, [].concat(
      interiorBox(0, 8, 4.9, 28, 0.1, 0.14, '#ffb020', null),
      interiorBox(-8, 6.5, 0.02, 3.2, 0.04, 3.2, '#f2e6c9', null),
      interiorBox(0, 6.5, 0.02, 3.2, 0.04, 3.2, '#6b4c8a', null),
      interiorBox(8, 6.5, 0.02, 3.2, 0.04, 3.2, '#f2e6c9', null),
      interiorBox(0, 15.7, 2.2, 8, 1.4, 0.16, '#ffb020', null)
    ), [
      { id: 'tv-stand', params: { w: 1.2, glow: '#ff4fd8', color: '#2a2140' }, x: -6.2, z: 10.5, yaw: Math.PI },
      { id: 'tv-stand', params: { w: 1.2, glow: '#3ee6ff', color: '#2a2140' }, x: -3.4, z: 10.5, yaw: Math.PI },
      { id: 'tv-stand', params: { w: 1.2, glow: '#ffe14d', color: '#2a2140' }, x: -0.6, z: 10.5, yaw: Math.PI },
      { id: 'tv-stand', params: { w: 1.2, glow: '#7dff6b', color: '#2a2140' }, x: 2.2, z: 10.5, yaw: Math.PI },
      { id: 'kiosk', params: { glow: '#ffb020' }, x: 6.4, z: 10.2 },
      { id: 'speaker', params: { h: 1.4, glow: '#ff4fd8' }, x: -8.8, z: 8.4, yaw: Math.PI }
    ]),
    interiorStyle('arcade', 2, 'pop', 'Pop hall', 'A tall room of pink, mint, and lemon game cabinets.', {
      w: 32, d: 22, h: 6.8, floor: '#fff6ea', wall: '#fffdf8', ceil: '#fffaf2', glass: ''
    }, [
      interiorBox(-8, 9, 0.03, 6, 0.06, 5, '#ffb3e6', null),
      interiorBox(8, 14, 0.03, 7, 0.06, 4.2, '#9ff3ff', null),
      interiorBox(0, 21.4, 1.8, 10, 3.2, 0.16, '#ff4fd8', null),
      interiorBox(-11, 18, 0, 1.8, 3.4, 1.8, '#7dff6b', null),
      interiorBox(11, 16, 0, 1.8, 4.2, 1.8, '#3ee6ff', null)
    ], [
      { id: 'tv-stand', params: { w: 1.6, h: 0.7, screenH: 0.9, glow: '#ff2a3d', color: '#ffe14d' }, x: -4.2, z: 11, yaw: Math.PI },
      { id: 'tv-stand', params: { w: 1.6, h: 0.7, screenH: 0.9, glow: '#3ee6ff', color: '#ffb3e6' }, x: 0, z: 11, yaw: Math.PI },
      { id: 'tv-stand', params: { w: 1.6, h: 0.7, screenH: 0.9, glow: '#7dff6b', color: '#9ff3ff' }, x: 4.2, z: 11, yaw: Math.PI },
      { id: 'screen', params: { w: 6, h: 2.6, color: '#ff4fd8', glow: '#3ee6ff' }, x: 0, z: 20.2, yaw: Math.PI, y: 1.5 }
    ]),
    interiorStyle('arcade', 3, 'space', 'Space pit', 'A very tall pale hall with a cyan strip and a screen row.', {
      w: 30, d: 16, h: 8, floor: '#e8eef4', wall: '#f4f7fb', ceil: '#f8fbfe', glass: ''
    }, [].concat(
      interiorBox(0, 8, 7.7, 24, 0.08, 0.12, '#3ee6ff', null),
      interiorBox(0, 2.4, 0.04, 16, 0.06, 0.1, '#3ee6ff', null),
      interiorRoof({ x0: -3, x1: 3, z0: 9, z1: 14, h: 3.4 }, 'dome', '#d7eef8'),
      interiorBox(0, 15.6, 2.4, 12, 3.6, 0.1, '#e7f7ff', '#3ee6ff')
    ), [
      { id: 'screen', params: { w: 1.3, h: 1.8, color: '#d5e4ee', glow: '#3ee6ff' }, x: -4.5, z: 12.2, yaw: Math.PI, y: 0.6 },
      { id: 'screen', params: { w: 1.3, h: 1.8, color: '#d5e4ee', glow: '#ff4fd8' }, x: -1.5, z: 12.2, yaw: Math.PI, y: 0.6 },
      { id: 'screen', params: { w: 1.3, h: 1.8, color: '#d5e4ee', glow: '#ffe14d' }, x: 1.5, z: 12.2, yaw: Math.PI, y: 0.6 },
      { id: 'screen', params: { w: 1.3, h: 1.8, color: '#d5e4ee', glow: '#7dff6b' }, x: 4.5, z: 12.2, yaw: Math.PI, y: 0.6 },
      { id: 'truss-seg', params: { color: '#d5d8de' }, x: 0, z: 8.5, y: 3.2 }
    ]),
    interiorStyle('arcade', 4, 'block', 'Block arcade', 'Giant red, blue, and yellow cube machines.', {
      w: 28, d: 18, h: 5.6, floor: '#efe6d4', wall: '#f7f1e6', ceil: '#fffaf2', glass: ''
    }, [
      interiorBox(-7, 10, 0, 2.4, 2.4, 2.4, '#ff2a3d', null),
      interiorBox(-7, 10, 2.4, 1.8, 0.5, 0.12, '#ffe14d', null),
      interiorBox(0, 11, 0, 2.6, 2.8, 2.6, '#3ee6ff', null),
      interiorBox(0, 11, 2.8, 2, 0.4, 0.12, '#fffdf8', null),
      interiorBox(7, 10, 0, 2.4, 2.2, 2.4, '#ffe14d', null),
      interiorBox(7, 10, 2.2, 1.6, 0.45, 0.12, '#ff2a3d', null),
      interiorBox(0, 16.5, 0, 3, 1.2, 1.2, '#ffb020', null)
    ], [
      { id: 'screen', params: { w: 1.4, h: 0.9, color: '#1b1e26', glow: '#fffdf8' }, x: -7, z: 11.3, yaw: Math.PI, y: 1.3 },
      { id: 'screen', params: { w: 1.5, h: 1, color: '#1b1e26', glow: '#04140c' }, x: 0, z: 12.4, yaw: Math.PI, y: 1.4 },
      { id: 'screen', params: { w: 1.4, h: 0.9, color: '#1b1e26', glow: '#ff2a3d' }, x: 7, z: 11.3, yaw: Math.PI, y: 1.15 },
      { id: 'kiosk', params: { glow: '#3ee6ff' }, x: 4.2, z: 6.8 }
    ])
  ],
  cafe: [
    interiorStyle('cafe', 1, 'beach', 'Beach shack', 'Sand, aqua glass, palms, and a long snack counter.', {
      w: 28, d: 18, h: 4.8, floor: '#f0d7a8', wall: '#fff6ea', ceil: '#fffaf2', glass: '#c8f0ea'
    }, [].concat(
      interiorPanes(17.85, 0.5, 3.2, [-8, -2.6, 2.6, 8], '#c8f0ea', '#7ec8c0'),
      interiorPots(-11, 5.5, 3, 3.2, '#efe6d4', '#3e8f55'),
      interiorPots(11, 6, 3, 3.2, '#e7d8c4', '#7dff6b'),
      interiorBox(0, 8, 0.02, 8, 0.04, 3, '#f7e7c4', null)
    ), [
      { id: 'snack-counter', params: {}, x: 0, z: 12.4 },
      { id: 'table', params: { w: 1.4, d: 1.4, top: 0.75, color: '#fff6ea', leg: '#c4894a' }, x: -4.2, z: 7.2 },
      { id: 'table', params: { w: 1.4, d: 1.4, top: 0.75, color: '#fff6ea', leg: '#c4894a' }, x: 4.6, z: 7.4 },
      { id: 'screen', params: { w: 1.6, h: 0.9, color: '#1b1e26', glow: '#ffe14d' }, x: 0, z: 16.6, yaw: Math.PI, y: 1.6 }
    ]),
    interiorStyle('cafe', 2, 'wood', 'Wood bakery', 'Warm wood, a long counter, and two tables.', {
      w: 24, d: 16, h: 4.2, floor: '#c4894a', wall: '#f4e4cf', ceil: '#f8efe4', glass: '#d5e6ea'
    }, [].concat(
      interiorPanes(15.85, 1.1, 2.2, [-6, 0, 6], '#d5e6ea', '#9bb8c0'),
      interiorBox(0, 5.4, 0.02, 5, 0.05, 2.2, '#a33b2c', null),
      interiorBox(-8, 11, 0, 1.2, 1.6, 1.2, '#8d4a3a', null)
    ), [
      { id: 'snack-counter', params: { color: '#e6d0b0' }, x: 0, z: 11.6 },
      { id: 'table', params: { w: 1.5, d: 0.9, top: 0.75, color: '#d7b48a', leg: '#5c3b22' }, x: -4, z: 6.8 },
      { id: 'table', params: { w: 1.5, d: 0.9, top: 0.75, color: '#d7b48a', leg: '#5c3b22' }, x: 4.2, z: 6.8 },
      { id: 'screen', params: { w: 1.8, h: 1, color: '#5c3b22', glow: '#ffb020' }, x: 0, z: 14.8, yaw: Math.PI, y: 1.35 }
    ]),
    interiorStyle('cafe', 3, 'pop', 'Pop diner', 'A mint room with cherry booths and a big menu screen.', {
      w: 32, d: 18, h: 5.4, floor: '#d8fff4', wall: '#fffdf8', ceil: '#f3fffb', glass: ''
    }, [
      interiorBox(-10, 8, 0.02, 6, 0.05, 3.2, '#ffb3e6', null),
      interiorBox(10, 8, 0.02, 6, 0.05, 3.2, '#ffe14d', null),
      interiorBox(0, 17.5, 1.6, 8, 2.4, 0.14, '#ff2a3d', null)
    ], [
      { id: 'sofa', params: { w: 2.4, d: 0.9, h: 1, color: '#ff2a3d' }, x: -5.5, z: 8.2, yaw: 1.57 },
      { id: 'sofa', params: { w: 2.4, d: 0.9, h: 1, color: '#ff4fd8' }, x: 5.5, z: 8.2, yaw: -1.57 },
      { id: 'table', params: { w: 1.3, d: 1.3, top: 0.78, color: '#ffe14d', leg: '#ffb020' }, x: -3.2, z: 8.2 },
      { id: 'table', params: { w: 1.3, d: 1.3, top: 0.78, color: '#ffe14d', leg: '#ffb020' }, x: 3.2, z: 8.2 },
      { id: 'screen', params: { w: 5.2, h: 2.2, color: '#ff2a3d', glow: '#fffdf8' }, x: 0, z: 16.6, yaw: Math.PI, y: 1.4 },
      { id: 'snack-counter', params: {}, x: 0, z: 12.8 }
    ]),
    interiorStyle('cafe', 4, 'night', 'Night counter', 'A bright counter, a gold lip, and glass on the night.', {
      w: 26, d: 16, h: 4.8, floor: '#f7f1e8', wall: '#fffaf4', ceil: '#fffdf8', glass: '#1a3048'
    }, [].concat(
      interiorPanes(15.85, 0.4, 3.6, [-7, -2.3, 2.3, 7], '#1a3048', '#3ee6ff'),
      interiorBox(0, 8, 4.55, 18, 0.08, 0.12, '#3ee6ff', null),
      interiorBox(0, 11.2, 0.95, 4.2, 0.08, 0.9, '#e6c56a', null)
    ), [
      { id: 'snack-counter', params: {}, x: 0, z: 11.4 },
      { id: 'table', params: { w: 1.2, d: 0.8, color: '#fffdf8', leg: '#cfc6b8' }, x: -4.4, z: 6.6 },
      { id: 'table', params: { w: 1.2, d: 0.8, color: '#fffdf8', leg: '#cfc6b8' }, x: 4.4, z: 6.6 },
      { id: 'screen', params: { w: 2.2, h: 1.1, color: '#1b1e26', glow: '#3ee6ff' }, x: 0, z: 14.6, yaw: Math.PI, y: 1.5 }
    ])
  ],
  pets: [
    interiorStyle('pets', 1, 'garden', 'Garden yard', 'A long garden with pots, glass, and two low pens.', {
      w: 36, d: 24, h: 5.4, floor: '#e7f2df', wall: '#f4f7f2', ceil: '#f7fbf4', glass: '#e5f6ea'
    }, [].concat(
      interiorPanes(23.85, 0.6, 3.4, [-12, -6, 0, 6, 12], '#e5f6ea', '#b7d7c0'),
      interiorPots(-14, 5, 4, 3.6, '#efe6d4', '#5fa86a'),
      interiorPots(14, 5.4, 4, 3.6, '#e7d8c4', '#7dff6b'),
      interiorBox(-6, 14, 0.02, 5, 0.35, 3.2, '#d7c4a8', '#8a7360'),
      interiorBox(6.5, 14, 0.02, 5, 0.35, 3.2, '#d7c4a8', '#8a7360')
    ), [
      { id: 'table', params: { w: 1.2, d: 0.8, top: 0.28, color: '#7dff6b', leg: '#3d6b48' }, x: -6, z: 14 },
      { id: 'table', params: { w: 1.2, d: 0.8, top: 0.28, color: '#ffb020', leg: '#8a5a32' }, x: 6.5, z: 14 },
      { id: 'sofa', params: { w: 2, d: 0.8, h: 0.7, color: '#d7c4a8' }, x: 0, z: 8.2 }
    ]),
    interiorStyle('pets', 2, 'cabin', 'Cabin den', 'A wood pet room with a window and two pens.', {
      w: 26, d: 18, h: 4.2, floor: '#c4894a', wall: '#f4e4cf', ceil: '#f8efe4', glass: '#d5e6ea'
    }, [].concat(
      interiorPanes(17.85, 0.9, 2.3, [-7, -2.3, 2.3, 7], '#d5e6ea', '#9bb8c0'),
      interiorBox(-6.2, 12, 0, 5.2, 0.7, 0.16, '#e6d0b0', '#8a5a32'),
      interiorBox(6.2, 12, 0, 5.2, 0.7, 0.16, '#e6d0b0', '#8a5a32'),
      interiorBox(0, 6.2, 0.02, 4, 0.06, 2.4, '#a33b2c', null)
    ), [
      { id: 'table', params: { w: 1.15, d: 0.75, top: 0.28, color: '#7dff6b', leg: '#3d6b48' }, x: -6.2, z: 11.2 },
      { id: 'table', params: { w: 1.15, d: 0.75, top: 0.28, color: '#ffb020', leg: '#5c3b22' }, x: 6.2, z: 11.2 },
      { id: 'sofa', params: { w: 2.2, color: '#7a3428' }, x: 0, z: 8.4 },
      { id: 'speaker', params: { h: 0.7, color: '#5c3b22', glow: '#ffb020' }, x: -9, z: 7 }
    ]),
    interiorStyle('pets', 3, 'aqua', 'Aqua bay', 'A bright teal bay with glass and cyan pen rails.', {
      w: 34, d: 20, h: 5.2, floor: '#d7f3f6', wall: '#e8f7fb', ceil: '#f4fcfd', glass: '#b7e7ea'
    }, [].concat(
      interiorPanes(19.85, 0.4, 3.8, [-11, -5.5, 0, 5.5, 11], '#b7e7ea', '#3ee6ff'),
      interiorBox(-7, 12, 0.4, 6, 0.1, 0.12, '#3ee6ff', null),
      interiorBox(7, 12, 0.4, 6, 0.1, 0.12, '#7dff6b', null),
      interiorBox(-7, 12, 0.02, 5.2, 0.08, 3, '#c8ebe8', null),
      interiorBox(7, 12, 0.02, 5.2, 0.08, 3, '#c8ebe8', null),
      interiorBox(0, 10, 4.9, 22, 0.08, 0.1, '#3ee6ff', null)
    ), [
      { id: 'table', params: { w: 1.2, d: 0.8, top: 0.28, color: '#7dfff2', leg: '#3d6b68' }, x: -7, z: 12 },
      { id: 'table', params: { w: 1.2, d: 0.8, top: 0.28, color: '#ffb020', leg: '#3d6b68' }, x: 7, z: 12 },
      { id: 'kiosk', params: { glow: '#3ee6ff' }, x: 0, z: 8.2 }
    ]),
    interiorStyle('pets', 4, 'block', 'Block park', 'Cube pens and a green play pad.', {
      w: 30, d: 22, h: 5.2, floor: '#efe6d4', wall: '#f6f1e6', ceil: '#fffaf2', glass: ''
    }, [
      interiorBox(0, 12, 0.02, 10, 0.08, 6, '#7dff6b', null),
      interiorBox(-8, 10, 0, 2.2, 1.1, 2.2, '#ffb020', null),
      interiorBox(8, 10, 0, 2.2, 1.1, 2.2, '#3ee6ff', null),
      interiorBox(-8, 15, 0, 2.2, 1.6, 2.2, '#ff4fd8', null),
      interiorBox(8, 15, 0, 2.2, 1.6, 2.2, '#ffe14d', null),
      interiorBox(0, 18, 0, 2, 2, 2, '#7dff6b', null)
    ], [
      { id: 'table', params: { w: 1.1, d: 0.7, top: 0.28, color: '#fffdf8', leg: '#c4894a' }, x: -8, z: 10.2 },
      { id: 'table', params: { w: 1.1, d: 0.7, top: 0.28, color: '#fffdf8', leg: '#c4894a' }, x: 8, z: 10.2 }
    ])
  ],
  soccer: [
    interiorStyle('soccer', 1, 'pitch', 'Shop pitch', 'A bright shop, a green pitch, and one goal.', {
      w: 48, d: 30, h: 6.8, floor: '#f4f1ea', wall: '#f7f4ef', ceil: '#fffdf8', glass: '#d7f4fb'
    }, [].concat(
      interiorPanes(29.8, 1.2, 3.2, [-16, -8, 0, 8, 16], '#d7f4fb', '#9ad4e2'),
      interiorBox(0, 16, 0.02, 22, 0.06, 14, '#1c6b32', null),
      interiorBox(0, 16, 0.08, 20, 0.02, 0.08, '#fffdf8', null),
      interiorBox(-8, 16, 0.08, 0.08, 0.02, 12, '#fffdf8', null),
      interiorBox(8, 16, 0.08, 0.08, 0.02, 12, '#fffdf8', null),
      interiorBox(0, 22.6, 0, 0.16, 2.2, 0.16, '#f7f4ef', null),
      interiorBox(-3.2, 22.6, 0, 0.16, 2.2, 0.16, '#f7f4ef', null),
      interiorBox(3.2, 22.6, 0, 0.16, 2.2, 0.16, '#f7f4ef', null),
      interiorBox(0, 22.6, 2.15, 6.6, 0.14, 0.14, '#f7f4ef', null)
    ), [
      { id: 'truss-seg', params: { color: '#f7f4ef' }, x: 0, z: 22.6, y: 2.2 },
      { id: 'sofa', params: { w: 2.2, color: '#e7e2da' }, x: -16, z: 8 },
      { id: 'table', params: { w: 2.4, d: 0.5, top: 1.1, color: '#f7f4ee', leg: '#cfc6b8' }, x: 16, z: 8 },
      { id: 'screen', params: { w: 2.2, h: 1.2, color: '#1b1e26', glow: '#7dff6b' }, x: -16, z: 14, yaw: Math.PI, y: 1.4 }
    ]),
    interiorStyle('soccer', 2, 'beach', 'Beach pitch', 'Sand around a turquoise pitch and a wood goal.', {
      w: 44, d: 28, h: 5.6, floor: '#f0d7a8', wall: '#fff6ea', ceil: '#fffaf2', glass: '#c8f0ea'
    }, [].concat(
      interiorPanes(27.8, 0.6, 3.2, [-14, -7, 0, 7, 14], '#c8f0ea', '#7ec8c0'),
      interiorBox(0, 15, 0.02, 20, 0.06, 12, '#2ec4b6', null),
      interiorBox(0, 20.5, 0, 0.22, 2, 0.22, '#c4894a', null),
      interiorBox(-3, 20.5, 0, 0.22, 2, 0.22, '#c4894a', null),
      interiorBox(3, 20.5, 0, 0.22, 2, 0.22, '#c4894a', null),
      interiorBox(0, 20.5, 1.95, 6.2, 0.18, 0.18, '#c4894a', null),
      interiorPots(16, 6, 3, 3, '#efe6d4', '#3e8f55')
    ), [
      { id: 'table', params: { w: 2.2, d: 0.6, top: 0.9, color: '#e6d0b0', leg: '#5c3b22' }, x: -14, z: 7 },
      { id: 'screen', params: { w: 1.8, h: 1, color: '#5c3b22', glow: '#ffe14d' }, x: 0, z: 26, yaw: Math.PI, y: 1.5 }
    ]),
    interiorStyle('soccer', 3, 'cup', 'Cup night', 'A lit green pitch, blue seats, and a cyan goal.', {
      w: 46, d: 28, h: 7, floor: '#243044', wall: '#31425f', ceil: '#2a3a55', glass: ''
    }, [
      interiorBox(0, 15, 0.02, 22, 0.08, 14, '#3ddc6a', null),
      interiorBox(0, 15, 0.1, 18, 0.03, 0.1, '#fffdf8', null),
      interiorBox(-14, 10, 0.4, 4, 0.5, 8, '#3ee6ff', null),
      interiorBox(14, 10, 0.4, 4, 0.5, 8, '#ff4fd8', null),
      interiorBox(-14, 16, 1.1, 4, 0.45, 6, '#7dfff2', null),
      interiorBox(14, 16, 1.1, 4, 0.45, 6, '#ffe14d', null),
      interiorBox(0, 21.5, 0, 0.16, 2.3, 0.16, '#3ee6ff', null),
      interiorBox(-3.3, 21.5, 0, 0.16, 2.3, 0.16, '#3ee6ff', null),
      interiorBox(3.3, 21.5, 0, 0.16, 2.3, 0.16, '#3ee6ff', null),
      interiorBox(0, 21.5, 2.25, 6.8, 0.14, 0.14, '#3ee6ff', null),
      interiorBox(0, 6, 6.6, 30, 0.1, 0.12, '#ffb020', null)
    ], [
      { id: 'screen', params: { w: 4, h: 1.4, color: '#1b1e26', glow: '#3ee6ff' }, x: 0, z: 25.5, yaw: Math.PI, y: 2.2 },
      { id: 'speaker', params: { h: 1.5, glow: '#ff4fd8' }, x: -10, z: 7 }
    ]),
    interiorStyle('soccer', 4, 'block', 'Block field', 'Chunky seats, a cube goal, and a green pitch.', {
      w: 40, d: 26, h: 6.2, floor: '#efe6d4', wall: '#f7f1e6', ceil: '#fffaf2', glass: ''
    }, [
      interiorBox(0, 14, 0.02, 16, 0.2, 10, '#1c6b32', null),
      interiorBox(-12, 8, 0, 2.4, 1.4, 2.4, '#ff2a3d', null),
      interiorBox(-12, 12, 0, 2.4, 2, 2.4, '#3ee6ff', null),
      interiorBox(-12, 16, 0, 2.4, 2.6, 2.4, '#ffe14d', null),
      interiorBox(12, 8, 0, 2.4, 1.4, 2.4, '#7dff6b', null),
      interiorBox(12, 12, 0, 2.4, 2, 2.4, '#ffb020', null),
      interiorBox(12, 16, 0, 2.4, 2.6, 2.4, '#ff4fd8', null),
      interiorBox(0, 20, 0, 2.2, 2.2, 0.8, '#f7f4ef', null),
      interiorBox(-2.2, 20, 0, 0.8, 2.6, 0.8, '#f7f4ef', null),
      interiorBox(2.2, 20, 0, 0.8, 2.6, 0.8, '#f7f4ef', null)
    ], [
      { id: 'screen', params: { w: 1.4, h: 0.8, glow: '#7dff6b', color: '#1b1e26' }, x: 0, z: 20.5, yaw: Math.PI, y: 1.2 }
    ])
  ],
  builder: [
    interiorStyle('builder', 1, 'studio', 'Glass studio', 'A bright desk, three boards, and a tiny block city.', {
      w: 28, d: 18, h: 5.5, floor: '#f3ecdf', wall: '#f7f4ef', ceil: '#fffdf8', glass: '#d7f4fb'
    }, [].concat(
      interiorPanes(17.85, 0.4, 4, [-8, -2.6, 2.6, 8], '#d7f4fb', '#9ad4e2'),
      interiorBox(-6, 8.2, 0.95, 0.5, 0.5, 0.5, '#f7f4ee', null),
      interiorBox(-5.2, 8.6, 0.95, 0.7, 0.9, 0.7, '#e7e2da', null),
      interiorBox(-4.2, 8.1, 0.95, 0.4, 0.4, 0.4, '#3ee6ff', null)
    ), [
      { id: 'table', params: { w: 3.4, d: 1.1, top: 0.95, color: '#f7f4ee', leg: '#cfc6b8' }, x: -1, z: 8.4 },
      { id: 'screen', params: { w: 1.6, h: 1.1, color: '#d7e3ea', glow: '#3ee6ff' }, x: -4.2, z: 16.4, yaw: Math.PI, y: 1.3 },
      { id: 'screen', params: { w: 1.6, h: 1.1, color: '#d7e3ea', glow: '#ffb020' }, x: 0, z: 16.4, yaw: Math.PI, y: 1.3 },
      { id: 'screen', params: { w: 1.6, h: 1.1, color: '#d7e3ea', glow: '#7dff6b' }, x: 4.2, z: 16.4, yaw: Math.PI, y: 1.3 }
    ]),
    interiorStyle('builder', 2, 'space', 'Space lab', 'A very tall pale lab with a cyan strip and a desk model.', {
      w: 30, d: 16, h: 8, floor: '#e8eef4', wall: '#f4f7fb', ceil: '#f8fbfe', glass: ''
    }, [].concat(
      interiorBox(0, 8, 7.7, 24, 0.08, 0.12, '#3ee6ff', null),
      interiorBox(0, 3, 0.04, 14, 0.05, 0.1, '#3ee6ff', null),
      interiorRoof({ x0: -3.2, x1: 3.2, z0: 8, z1: 13, h: 2.8 }, 'dome', '#d7eef8'),
      interiorBox(0, 15.5, 2.2, 8, 3.2, 0.1, '#e7f7ff', '#3ee6ff')
    ), [
      { id: 'table', params: { w: 2.8, d: 1, top: 0.78, color: '#f7fbff', leg: '#c5d0dc' }, x: 0, z: 7.6 },
      { id: 'screen', params: { w: 2.4, h: 1.2, glow: '#3ee6ff', color: '#d5e4ee' }, x: -6, z: 13.2, yaw: Math.PI, y: 1.2 },
      { id: 'truss-seg', params: { color: '#d5d8de' }, x: 6, z: 10, y: 2.4 },
      { id: 'speaker', params: { glow: '#3ee6ff', color: '#d5d8de' }, x: 8, z: 6.5 }
    ]),
    interiorStyle('builder', 3, 'wood', 'Wood workshop', 'Wood benches, a tool wall, and a high window.', {
      w: 26, d: 18, h: 4.6, floor: '#c4894a', wall: '#f4e4cf', ceil: '#f8efe4', glass: '#d5e6ea'
    }, [].concat(
      interiorPanes(17.85, 2.2, 1.6, [-8, -2.6, 2.6, 8], '#d5e6ea', '#9bb8c0'),
      interiorBox(-8, 10, 0, 0.4, 2.2, 6, '#e6d0b0', '#8a5a32'),
      interiorBox(0, 6.4, 0.02, 4, 0.05, 2, '#a33b2c', null)
    ), [
      { id: 'table', params: { w: 3.2, d: 0.9, top: 0.95, color: '#e6d0b0', leg: '#5c3b22' }, x: 1.2, z: 8.6 },
      { id: 'table', params: { w: 2.2, d: 0.7, top: 0.9, color: '#d7b48a', leg: '#5c3b22' }, x: 6, z: 12 },
      { id: 'screen', params: { w: 1.1, h: 1.4, color: '#5c3b22', glow: '#ffb020' }, x: -8.3, z: 8, yaw: 1.57, y: 1.1 },
      { id: 'screen', params: { w: 1.1, h: 1.4, color: '#5c3b22', glow: '#7dff6b' }, x: -8.3, z: 11, yaw: 1.57, y: 1.1 },
      { id: 'kiosk', params: { glow: '#ffb020' }, x: 8.2, z: 6.8 }
    ]),
    interiorStyle('builder', 4, 'sky', 'Sky office', 'Tall glass, a gold edge, and one model on a stand.', {
      w: 32, d: 18, h: 7.2, floor: '#e7e2da', wall: '#f7f5f1', ceil: '#fbfaf7', glass: '#d5e6ee'
    }, [].concat(
      interiorPanes(17.85, 0.5, 5.4, [-10, -5, 0, 5, 10], '#d5e6ee', '#b7c9ce'),
      interiorBox(0, 9, 0.02, 6, 0.05, 3.2, '#d9c7a0', null),
      interiorBox(-15.6, 9, 1.4, 0.1, 0.08, 14, '#e6c56a', null),
      interiorBox(15.6, 9, 1.4, 0.1, 0.08, 14, '#e6c56a', null),
      interiorBox(2.4, 8.2, 0.78, 0.7, 0.9, 0.7, '#f7f4ee', null),
      interiorBox(3.2, 8.6, 0.78, 0.45, 0.45, 0.45, '#3ee6ff', null),
      interiorRoof({ x0: -15, x1: 15, z0: 1.5, z1: 16, h: 6.75 }, 'flat', '#efe6d4')
    ), [
      { id: 'table', params: { w: 1.4, d: 1.4, top: 0.78, color: '#f7f4ee', leg: '#cfc6b8' }, x: 2.6, z: 8.4 },
      { id: 'sofa', params: { w: 2.6, h: 0.55, color: '#f7f4ee' }, x: -3.2, z: 7.2 },
      { id: 'screen', params: { w: 3.4, h: 1.6, color: '#e7e2da', glow: '#e6c56a' }, x: 0, z: 16.4, yaw: Math.PI, y: 1.4 }
    ])
  ]
};

function interiorList(room) {
  return INTERIOR_STYLES[room] || null;
}

function interiorFind(room, style) {
  const list = interiorList(room);
  if (!list) return null;
  const n = Number(style);
  if (n >= 1 && n <= list.length) return list[n - 1];
  for (let i = 0; i < list.length; i++) if (list[i].id === style) return list[i];
  return null;
}

function interiorKit(spec) {
  const room = {
    id: spec.id,
    name: spec.name,
    w: spec.w, d: spec.d, h: spec.h,
    floor: spec.floor, wall: spec.wall, ceil: spec.ceil,
    glass: spec.glass || ''
  };
  const gear = interiorDrops(spec.drops || []);
  const props = (spec.props || []).concat(gear);
  return { room: room, props: props };
}

function interiorLabel(g, W, H, spec, ms) {
  g.fillStyle = '#04140c';
  g.fillRect(0, H - 78, W, 78);
  g.fillStyle = '#e9fff2';
  g.textAlign = 'left';
  g.font = '700 22px sans-serif';
  g.fillText(INTERIOR_ROOMS[spec.room] + '  ·  ' + spec.n + '  ' + spec.name, 18, H - 50);
  g.font = '600 16px sans-serif';
  g.fillText(spec.line, 18, H - 26);
  const cost = (ms == null ? '' : ms.toFixed(2) + ' ms');
  const fps = ms != null && ms < 9.1 ? '  ·  about 110 fps' : '';
  g.textAlign = 'right';
  g.fillText(cost + fps, W - 18, H - 26);
}

function interiorPaint(g, W, H, spec, opts) {
  opts = opts || {};
  const kit = interiorKit(spec);
  const room = kit.room;
  const view = samplerView(room, W, H);
  g.fillStyle = room.ceil;
  g.fillRect(0, 0, W, H);
  const boxes = kit.props.slice();
  boxes.sort((a, b) => (b.z - b.d / 2) - (a.z - a.d / 2));
  const shell = samplerShell(room);
  for (let i = 0; i < shell.length; i++) samplerDrawBox(g, shell[i], view);
  for (let i = 0; i < boxes.length; i++) samplerDrawBox(g, boxes[i], view);
  const who = opts.ellie === false ? null : {
    x: opts.x != null ? opts.x : INTERIOR_ACTORS.ellie.x,
    z: opts.z != null ? opts.z : INTERIOR_ACTORS.ellie.z,
    petX: opts.petX != null ? opts.petX : INTERIOR_ACTORS.pet.x,
    petZ: opts.petZ != null ? opts.petZ : INTERIOR_ACTORS.pet.z
  };
  if (who) {
    samplerPet(g, who.petX, who.petZ, view);
    samplerPerson(g, who.x, who.z, view);
  }
  if (opts.label !== false) interiorLabel(g, W, H, spec, opts.ms);
  return { room: room, boxes: boxes.length + shell.length, who: who };
}

const INTERIOR_REVIEW = {
  rooms: INTERIOR_ROOMS,
  styles: INTERIOR_STYLES,
  actors: INTERIOR_ACTORS,
  list: interiorList,
  find: interiorFind,
  kit: interiorKit,
  paint: interiorPaint
};

if (typeof globalThis !== 'undefined') globalThis.INTERIOR_REVIEW = INTERIOR_REVIEW;
if (typeof window !== 'undefined') window.INTERIOR_REVIEW = INTERIOR_REVIEW;
