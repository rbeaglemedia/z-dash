/* Test walk for the six rooms. Loaded only when world.html?interiorTry=1.
   The four houses and four cafes are real doors on the southeast street.
   Arcade, pet lounge, soccer shop, and Builder HQ get buttons 1 2 3 4.
   This file does not write the kid saves, and it does not set shadowBlur. */
'use strict';

const TRY_SAVE = 'zdash.interior.try.v1';
const TRY_SINGLE = ['ARCADE', 'PETS', 'SOCCER', 'BUILDER'];

function tryLook(n, id, name, line, w, d, h, floor, wall, ceil, panes, boxes) {
  return { n: n, id: id, name: name, line: line, w: w, d: d, h: h, floor: floor, wall: wall, ceil: ceil, panes: panes, boxes: boxes };
}
function tryPanes(z, y, h, xs, fill) {
  return { z: z, y: y, h: h, xs: xs, fill: fill };
}

const TRY_ROOMS = {
  CAFE: {
    title: 'Cafe',
    looks: [
      tryLook(1, 'beach', 'Beach shack', 'Sand, aqua glass, palms, and a long snack counter.', 28, 18, 4.8, '#f0d7a8', '#fff6ea', '#fffaf2', tryPanes(17.6, 0.5, 3.2, [-8, -2.6, 2.6, 8], '#c8f0ea'), [[0, 12.4, 0, 6.4, 1.05, 0.9, '#fff6ea'], [-4.2, 7.2, 0, 1.4, 0.75, 1.4, '#c4894a'], [4.6, 7.4, 0, 1.4, 0.75, 1.4, '#c4894a'], [0, 16.6, 1.6, 1.6, 0.9, 0.08, '#ffe14d'], [-11, 6.2, 0, 0.45, 1.8, 0.45, '#3e8f55'], [11, 6.4, 0, 0.45, 1.8, 0.45, '#7dff6b']]),
      tryLook(2, 'wood', 'Wood bakery', 'Warm wood, a long counter, and two tables.', 24, 16, 4.2, '#c4894a', '#f4e4cf', '#f8efe4', tryPanes(15.6, 1.1, 2.2, [-6, 0, 6], '#d5e6ea'), [[0, 11.6, 0, 5.6, 1.05, 0.85, '#e6d0b0'], [-4, 6.8, 0, 1.5, 0.75, 0.9, '#d7b48a'], [4.2, 6.8, 0, 1.5, 0.75, 0.9, '#d7b48a'], [0, 14.8, 1.35, 1.8, 1, 0.08, '#ffb020'], [-8, 11, 0, 1.2, 1.6, 1.2, '#8d4a3a']]),
      tryLook(3, 'pop', 'Pop diner', 'A mint room with cherry booths and a big menu screen.', 32, 18, 5.4, '#d8fff4', '#fffdf8', '#f3fffb', tryPanes(17.6, 0.6, 3.4, [-8, -2.6, 2.6, 8], '#d7fff6'), [[-5.5, 8.2, 0, 2.4, 1, 0.9, '#ff2a3d'], [5.5, 8.2, 0, 2.4, 1, 0.9, '#ff4fd8'], [-3.2, 8.2, 0, 1.3, 0.78, 1.3, '#ffe14d'], [3.2, 8.2, 0, 1.3, 0.78, 1.3, '#ffe14d'], [0, 12.8, 0, 5.2, 1.05, 0.8, '#fffdf8'], [0, 16.6, 1.4, 5.2, 2.2, 0.08, '#ff2a3d']]),
      tryLook(4, 'night', 'Night counter', 'A bright counter, a gold lip, and glass on the night.', 26, 16, 4.8, '#f7f1e8', '#fffaf4', '#fffdf8', tryPanes(15.6, 0.4, 3.6, [-7, -2.3, 2.3, 7], '#1a3048'), [[0, 11.4, 0, 5.4, 1.05, 0.85, '#fffdf8'], [0, 11.2, 0.95, 4.2, 0.08, 0.9, '#e6c56a'], [-4.4, 6.6, 0, 1.2, 0.75, 0.8, '#cfc6b8'], [4.4, 6.6, 0, 1.2, 0.75, 0.8, '#cfc6b8'], [0, 14.6, 1.5, 2.2, 1.1, 0.08, '#3ee6ff'], [0, 8, 4.55, 18, 0.08, 0.12, '#3ee6ff']])
    ]
  },
  ARCADE: {
    title: 'Arcade',
    looks: [
      tryLook(1, 'retro', 'Retro lane', 'A purple hall of bright cabinets and a gold jackpot.', 36, 16, 5.2, '#4a3568', '#5c427c', '#3a2a55', tryPanes(15.6, 1.2, 2.4, [-8, -2.6, 2.6, 8], '#d7c4f0'), [[-6.2, 10.5, 0, 1.1, 1.5, 0.5, '#ff4fd8'], [-3.4, 10.5, 0, 1.1, 1.5, 0.5, '#3ee6ff'], [-0.6, 10.5, 0, 1.1, 1.5, 0.5, '#ffe14d'], [2.2, 10.5, 0, 1.1, 1.5, 0.5, '#7dff6b'], [6.4, 10.2, 0, 0.5, 1.2, 0.5, '#ffb020'], [0, 15.7, 2.2, 8, 1.4, 0.16, '#ffb020']]),
      tryLook(2, 'pop', 'Pop hall', 'A tall room of pink, mint, and lemon game cabinets.', 32, 22, 6.8, '#fff6ea', '#fffdf8', '#fffaf2', tryPanes(21.4, 0.6, 4.2, [-8, -2.6, 2.6, 8], '#ffd6ef'), [[-4.2, 11, 0, 1.4, 1.6, 0.5, '#ffe14d'], [0, 11, 0, 1.4, 1.6, 0.5, '#ffb3e6'], [4.2, 11, 0, 1.4, 1.6, 0.5, '#9ff3ff'], [0, 20.2, 1.5, 6, 2.6, 0.08, '#ff4fd8'], [-11, 18, 0, 1.8, 3.4, 1.8, '#7dff6b'], [11, 16, 0, 1.8, 4.2, 1.8, '#3ee6ff']]),
      tryLook(3, 'space', 'Space pit', 'A very tall pale hall with a cyan strip and a screen row.', 30, 16, 8, '#e8eef4', '#f4f7fb', '#f8fbfe', tryPanes(15.6, 1.2, 4.8, [-6, -2, 2, 6], '#d5e4ee'), [[0, 8, 7.7, 24, 0.08, 0.12, '#3ee6ff'], [-4.5, 12.2, 0.6, 1.3, 1.8, 0.08, '#3ee6ff'], [-1.5, 12.2, 0.6, 1.3, 1.8, 0.08, '#ff4fd8'], [1.5, 12.2, 0.6, 1.3, 1.8, 0.08, '#ffe14d'], [4.5, 12.2, 0.6, 1.3, 1.8, 0.08, '#7dff6b'], [0, 8.5, 3.2, 2.4, 0.2, 0.2, '#d5d8de']]),
      tryLook(4, 'block', 'Block arcade', 'Giant red, blue, and yellow cube machines.', 28, 18, 5.6, '#efe6d4', '#f7f1e6', '#fffaf2', tryPanes(17.6, 1.4, 2.2, [-6, 0, 6], '#d7e8f2'), [[-7, 10, 0, 2.4, 2.4, 2.4, '#ff2a3d'], [0, 11, 0, 2.6, 2.8, 2.6, '#3ee6ff'], [7, 10, 0, 2.4, 2.2, 2.4, '#ffe14d'], [-7, 11.3, 1.3, 1.4, 0.9, 0.08, '#fffdf8'], [0, 12.4, 1.4, 1.5, 1, 0.08, '#04140c'], [4.2, 6.8, 0, 0.5, 1.2, 0.5, '#3ee6ff']])
    ]
  },
  PETS: {
    title: 'Pet lounge',
    looks: [
      tryLook(1, 'garden', 'Garden yard', 'A long garden with pots, glass, and two low pens.', 36, 24, 5.4, '#e7f2df', '#f4f7f2', '#f7fbf4', tryPanes(23.6, 0.6, 3.4, [-12, -6, 0, 6, 12], '#e5f6ea'), [[-6, 14, 0, 5, 0.35, 3.2, '#d7c4a8'], [6.5, 14, 0, 5, 0.35, 3.2, '#d7c4a8'], [-14, 6, 0, 0.4, 1.4, 0.4, '#5fa86a'], [14, 6.4, 0, 0.4, 1.4, 0.4, '#7dff6b'], [0, 8.2, 0, 2, 0.7, 0.8, '#d7c4a8']]),
      tryLook(2, 'cabin', 'Cabin den', 'A wood pet room with a window and two pens.', 26, 18, 4.2, '#c4894a', '#f4e4cf', '#f8efe4', tryPanes(17.6, 0.9, 2.3, [-7, -2.3, 2.3, 7], '#d5e6ea'), [[-6.2, 12, 0, 5.2, 0.7, 0.5, '#e6d0b0'], [6.2, 12, 0, 5.2, 0.7, 0.5, '#e6d0b0'], [0, 8.4, 0, 2.2, 0.8, 0.9, '#7a3428'], [-9, 7, 0, 0.4, 0.7, 0.4, '#ffb020']]),
      tryLook(3, 'aqua', 'Aqua bay', 'A bright teal bay with glass and cyan pen rails.', 34, 20, 5.2, '#d7f3f6', '#e8f7fb', '#f4fcfd', tryPanes(19.6, 0.4, 3.8, [-11, -5.5, 0, 5.5, 11], '#b7e7ea'), [[-7, 12, 0.4, 6, 0.1, 0.12, '#3ee6ff'], [7, 12, 0.4, 6, 0.1, 0.12, '#7dff6b'], [-7, 12, 0, 1.2, 0.28, 0.8, '#7dfff2'], [7, 12, 0, 1.2, 0.28, 0.8, '#ffb020'], [0, 8.2, 0, 0.46, 1.22, 0.46, '#3ee6ff'], [0, 10, 4.9, 22, 0.08, 0.1, '#3ee6ff']]),
      tryLook(4, 'block', 'Block park', 'Cube pens and a green play pad.', 30, 22, 5.2, '#efe6d4', '#f6f1e6', '#fffaf2', tryPanes(21.6, 1.2, 2.4, [-8, 0, 8], '#d7f0ea'), [[0, 12, 0, 10, 0.08, 6, '#7dff6b'], [-8, 10, 0, 2.2, 1.1, 2.2, '#ffb020'], [8, 10, 0, 2.2, 1.1, 2.2, '#3ee6ff'], [-8, 15, 0, 2.2, 1.6, 2.2, '#ff4fd8'], [8, 15, 0, 2.2, 1.6, 2.2, '#ffe14d'], [0, 18, 0, 2, 2, 2, '#7dff6b']])
    ]
  },
  SOCCER: {
    title: 'Soccer shop',
    looks: [
      tryLook(1, 'pitch', 'Shop pitch', 'A bright shop, a green pitch, and one goal.', 48, 30, 6.8, '#f4f1ea', '#f7f4ef', '#fffdf8', tryPanes(29.6, 1.2, 3.2, [-16, -8, 0, 8, 16], '#d7f4fb'), [[0, 16, 0, 22, 0.06, 14, '#1c6b32'], [0, 22.6, 0, 0.16, 2.2, 0.16, '#f7f4ef'], [-3.2, 22.6, 0, 0.16, 2.2, 0.16, '#f7f4ef'], [3.2, 22.6, 0, 0.16, 2.2, 0.16, '#f7f4ef'], [0, 22.6, 2.15, 6.6, 0.14, 0.14, '#f7f4ef'], [-16, 8, 0, 2.2, 0.8, 0.9, '#e7e2da'], [16, 8, 0, 2.4, 1.1, 0.5, '#f7f4ee']]),
      tryLook(2, 'beach', 'Beach pitch', 'Sand around a turquoise pitch and a wood goal.', 44, 28, 5.6, '#f0d7a8', '#fff6ea', '#fffaf2', tryPanes(27.6, 0.6, 3.2, [-14, -7, 0, 7, 14], '#c8f0ea'), [[0, 15, 0, 20, 0.06, 12, '#2ec4b6'], [0, 20.5, 0, 0.22, 2, 0.22, '#c4894a'], [-3, 20.5, 0, 0.22, 2, 0.22, '#c4894a'], [3, 20.5, 0, 0.22, 2, 0.22, '#c4894a'], [0, 20.5, 1.95, 6.2, 0.18, 0.18, '#c4894a'], [-14, 7, 0, 2.2, 0.9, 0.6, '#e6d0b0']]),
      tryLook(3, 'cup', 'Cup night', 'A lit green pitch, blue seats, and a cyan goal.', 46, 28, 7, '#243044', '#31425f', '#2a3a55', tryPanes(27.6, 1.4, 3.6, [-12, -4, 4, 12], '#9fd8ea'), [[0, 15, 0, 22, 0.08, 14, '#3ddc6a'], [-14, 10, 0.4, 4, 0.5, 8, '#3ee6ff'], [14, 10, 0.4, 4, 0.5, 8, '#ff4fd8'], [0, 21.5, 2.25, 6.8, 0.14, 0.14, '#3ee6ff'], [0, 25.5, 2.2, 4, 1.4, 0.08, '#3ee6ff'], [-10, 7, 0, 0.5, 1.5, 0.5, '#ff4fd8']]),
      tryLook(4, 'block', 'Block field', 'Chunky seats, a cube goal, and a green pitch.', 40, 26, 6.2, '#efe6d4', '#f7f1e6', '#fffaf2', tryPanes(25.6, 1.2, 2.8, [-10, 0, 10], '#d7f0ea'), [[0, 14, 0, 16, 0.2, 10, '#1c6b32'], [-12, 8, 0, 2.4, 1.4, 2.4, '#ff2a3d'], [-12, 12, 0, 2.4, 2, 2.4, '#3ee6ff'], [-12, 16, 0, 2.4, 2.6, 2.4, '#ffe14d'], [12, 8, 0, 2.4, 1.4, 2.4, '#7dff6b'], [12, 16, 0, 2.4, 2.6, 2.4, '#ff4fd8'], [0, 20, 0, 2.2, 2.2, 0.8, '#f7f4ef']])
    ]
  },
  BUILDER: {
    title: 'Builder HQ',
    looks: [
      tryLook(1, 'studio', 'Glass studio', 'A bright desk, three boards, and a tiny block city.', 28, 18, 5.5, '#f3ecdf', '#f7f4ef', '#fffdf8', tryPanes(17.6, 0.4, 4, [-8, -2.6, 2.6, 8], '#d7f4fb'), [[-1, 8.4, 0, 3.4, 0.95, 1.1, '#f7f4ee'], [-6, 8.2, 0.95, 0.5, 0.5, 0.5, '#f7f4ee'], [-5.2, 8.6, 0.95, 0.7, 0.9, 0.7, '#e7e2da'], [-4.2, 8.1, 0.95, 0.4, 0.4, 0.4, '#3ee6ff'], [-4.2, 16.4, 1.3, 1.6, 1.1, 0.08, '#3ee6ff'], [0, 16.4, 1.3, 1.6, 1.1, 0.08, '#ffb020'], [4.2, 16.4, 1.3, 1.6, 1.1, 0.08, '#7dff6b']]),
      tryLook(2, 'space', 'Space lab', 'A very tall pale lab with a cyan strip and a desk model.', 30, 16, 8, '#e8eef4', '#f4f7fb', '#f8fbfe', tryPanes(15.6, 1.4, 4.6, [-8, -2.6, 2.6, 8], '#d5e4ee'), [[0, 8, 7.7, 24, 0.08, 0.12, '#3ee6ff'], [0, 7.6, 0, 2.8, 0.78, 1, '#f7fbff'], [-6, 13.2, 1.2, 2.4, 1.2, 0.08, '#3ee6ff'], [6, 10, 2.4, 2.2, 0.2, 0.2, '#d5d8de'], [8, 6.5, 0, 0.45, 1.4, 0.45, '#3ee6ff']]),
      tryLook(3, 'wood', 'Wood workshop', 'Wood benches, a tool wall, and a high window.', 26, 18, 4.6, '#c4894a', '#f4e4cf', '#f8efe4', tryPanes(17.6, 2.2, 1.6, [-8, -2.6, 2.6, 8], '#d5e6ea'), [[1.2, 8.6, 0, 3.2, 0.95, 0.9, '#e6d0b0'], [6, 12, 0, 2.2, 0.9, 0.7, '#d7b48a'], [-8, 10, 0, 0.4, 2.2, 6, '#e6d0b0'], [-8.3, 8, 1.1, 0.08, 1.4, 1.1, '#ffb020'], [-8.3, 11, 1.1, 0.08, 1.4, 1.1, '#7dff6b'], [8.2, 6.8, 0, 0.46, 1.22, 0.46, '#ffb020']]),
      tryLook(4, 'sky', 'Sky office', 'Tall glass, a gold edge, and one model on a stand.', 32, 18, 7.2, '#e7e2da', '#f7f5f1', '#fbfaf7', tryPanes(17.6, 0.5, 5.4, [-10, -5, 0, 5, 10], '#d5e6ee'), [[-15.6, 9, 1.4, 0.1, 0.08, 14, '#e6c56a'], [15.6, 9, 1.4, 0.1, 0.08, 14, '#e6c56a'], [-3.2, 7.2, 0, 2.6, 0.55, 1, '#f7f4ee'], [2.6, 8.4, 0, 1.4, 0.78, 1.4, '#f7f4ee'], [3.2, 8.6, 0.78, 0.45, 0.45, 0.45, '#3ee6ff'], [0, 16.4, 1.4, 3.4, 1.6, 0.08, '#e6c56a']])
    ]
  }
};

const tryChoice = { CAFE: 1, ARCADE: 1, PETS: 1, SOCCER: 1, BUILDER: 1 };
let tryCafeN = 0;

function tryQuery() {
  try {
    const q = new URLSearchParams(location.search);
    return {
      on: q.get('interiorTry') === '1',
      shot: q.get('tryShot') || '',
      style: parseInt(q.get('tryStyle') || '', 10) || 0
    };
  } catch (e) { return { on: false, shot: '', style: 0 }; }
}

function tryRoom(purpose) {
  return TRY_ROOMS[purpose] || null;
}

function tryStyle(purpose) {
  const n = tryChoice[purpose] || 1;
  return n >= 1 && n <= 4 ? n : 1;
}

function trySet(purpose, n) {
  if (!tryRoom(purpose) || n < 1 || n > 4) return;
  tryChoice[purpose] = n;
}

function tryReadPicks() {
  try {
    const raw = sessionStorage.getItem(TRY_SAVE);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === 'object' ? data : {};
  } catch (e) { return {}; }
}

function tryWritePick(room, style, name) {
  const data = tryReadPicks();
  data[room] = { style: style, name: name };
  try { sessionStorage.setItem(TRY_SAVE, JSON.stringify(data)); } catch (e) {}
  return data;
}

function tryBox(g, W, H, b) {
  walkBox(g, b[0], b[2], b[1], b[3] / 2, b[4], b[5] / 2, b[6], null, W, H);
}

function tryActors(g, W, H) {
  const x = -0.55, z = 4.15;
  walkBox(g, x, 0, z, 0.18, 0.82, 0.11, '#243044', null, W, H);
  walkBox(g, x, 0.82, z, 0.28, 0.52, 0.16, '#2f7f96', null, W, H);
  walkBox(g, x - 0.34, 0.9, z, 0.08, 0.42, 0.08, '#2f7f96', null, W, H);
  walkBox(g, x + 0.34, 0.9, z, 0.08, 0.42, 0.08, '#2f7f96', null, W, H);
  walkBox(g, x, 1.34, z, 0.16, 0.36, 0.16, '#f0c8a8', null, W, H);
  const px = 1.15, pz = 4.45;
  walkBox(g, px, 0, pz, 0.23, 0.36, 0.35, '#ffb020', null, W, H);
  walkBox(g, px + 0.22, 0.36, pz + 0.12, 0.16, 0.26, 0.16, '#ffb020', null, W, H);
  walkBox(g, px + 0.14, 0.62, pz + 0.12, 0.06, 0.12, 0.06, '#ffb020', null, W, H);
  walkBox(g, px + 0.30, 0.62, pz + 0.12, 0.06, 0.12, 0.06, '#ffb020', null, W, H);
}

function tryPaint(g, W, H, purpose) {
  const room = tryRoom(purpose);
  if (!room) return null;
  const style = tryStyle(purpose);
  const look = room.looks[style - 1];
  const hw = look.w / 2, d = look.d, h = look.h;
  const cam = function (x, y, z) { return walkCam(x, y, z, W, H); };
  const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : 0;
  g.fillStyle = look.ceil;
  g.fillRect(0, 0, W, H);
  walkQuad(g, [cam(-hw, 0, 0.6), cam(hw, 0, 0.6), cam(hw, 0, d), cam(-hw, 0, d)], look.floor, null);
  walkQuad(g, [cam(-hw, 0, d), cam(hw, 0, d), cam(hw, h, d), cam(-hw, h, d)], look.wall, null);
  walkQuad(g, [cam(-hw, 0, 0.6), cam(-hw, 0, d), cam(-hw, h, d), cam(-hw, h, 0.6)], look.wall, null);
  walkQuad(g, [cam(hw, 0, 0.6), cam(hw, 0, d), cam(hw, h, d), cam(hw, h, 0.6)], look.wall, null);
  const panes = look.panes;
  for (let i = 0; i < panes.xs.length; i++) tryBox(g, W, H, [panes.xs[i], panes.z, panes.y, 2.2, panes.h, 0.08, panes.fill]);
  for (let i = 0; i < look.boxes.length; i++) tryBox(g, W, H, look.boxes[i]);
  tryActors(g, W, H);
  const dt = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : 0) - t0;
  if (!look.samples) look.samples = [];
  if (look.samples.length < 40) look.samples.push(dt);
  let sum = 0;
  for (let i = 0; i < look.samples.length; i++) sum += look.samples[i];
  const ms = sum / look.samples.length;
  const fps = ms < 9.1 ? 'about 110 fps' : (ms > 0 ? 'about ' + Math.round(1000 / ms) + ' fps' : '');
  const pickKey = purpose === 'CAFE' && tryCafeN ? ('CAFE ' + tryCafeN) : purpose;
  const picks = tryReadPicks();
  const mine = picks[pickKey];
  const star = mine && mine.style === style ? '  ·  FAVORITE' : '';
  const head = purpose === 'CAFE' && tryCafeN
    ? ('CAFE ' + tryCafeN + '  STYLE ' + style + '  ' + look.name.toUpperCase())
    : ('STYLE ' + style + '  ' + look.name.toUpperCase());
  g.fillStyle = '#04140c';
  g.fillRect(0, H - 64, W, 64);
  g.fillStyle = '#e9fff2';
  g.font = '800 22px sans-serif';
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.fillText(head + star, 16, H - 38);
  g.font = '700 15px sans-serif';
  g.fillText(room.title + '  ·  ' + look.line + '   ' + ms.toFixed(2) + ' ms   ' + fps, 16, H - 14);
  return { ms: ms, style: style, name: look.name, room: pickKey, title: room.title, cafe: tryCafeN || 0 };
}

function tryCafeStyle(door) {
  const b = door && door.building;
  const word = b && b.sign ? (b.sign.word || b.sign.t || '') : '';
  const m = /CAFE\s*([1-4])/.exec(String(word).toUpperCase());
  if (m) { tryCafeN = Number(m[1]); return tryCafeN; }
  if (b && b.tryCafe >= 1 && b.tryCafe <= 4) { tryCafeN = b.tryCafe; return tryCafeN; }
  return 0;
}

function tryCafeStreet(hold) {
  window.INTERIOR_TRY_STREET = 1;
  tryHideMenu();
  if (hold && typeof WALK_MODE !== 'undefined') {
    WALK_MODE.onFoot = false;
    WALK_MODE.insideBuilding = false;
    WALK_MODE.insideDoor = null;
  }
  if (hold && typeof walkHideInterior === 'function') walkHideInterior();
  if (typeof P !== 'undefined' && P) {
    P.x = 846; P.z = -723.5; P.y = 0.35; P.v = 0; P.ground = true;
    P.pitch = 0; P.bank = 0; P.gam = 0; P.wreck = null;
    P.yaw = Math.PI / 2; P.hd = P.yaw; P.driveMode = 'street';
  }
  if (hold && typeof FLYCAM !== 'undefined') FLYCAM.orbit = { az: Math.PI, el: 0.16, d: 14 };
}

function tryRowStreet(hold) {
  window.INTERIOR_TRY_STREET = 1;
  tryHideMenu();
  if (hold && typeof WALK_MODE !== 'undefined') {
    WALK_MODE.onFoot = false;
    WALK_MODE.insideBuilding = false;
    WALK_MODE.insideDoor = null;
  }
  if (hold && typeof walkHideInterior === 'function') walkHideInterior();
  if (typeof P !== 'undefined' && P) {
    P.x = 840; P.z = hold ? -662 : -730; P.y = 0.35; P.v = 0; P.ground = true;
    P.pitch = 0; P.bank = 0; P.gam = 0; P.wreck = null;
    P.yaw = 0; P.hd = 0; P.driveMode = 'street';
  }
  if (hold && typeof FLYCAM !== 'undefined') FLYCAM.orbit = { az: Math.PI, el: 0.34, d: 58 };
}

function tryHouseKey(pick) {
  if (!pick) return 'HOME';
  return pick.forced ? ('HOUSE ' + pick.style) : ('HOUSE ' + pick.house);
}

function tryHouseStar(pick) {
  const mine = tryReadPicks()[tryHouseKey(pick)];
  return mine && mine.style === pick.style ? '  ·  FAVORITE' : '';
}

function tryEnsureSwitch() {
  const card = document.getElementById('walk-interior');
  if (!card || document.getElementById('interior-try-switch')) return;
  const bar = document.createElement('div');
  bar.id = 'interior-try-switch';
  bar.hidden = true;
  for (let n = 1; n <= 4; n++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.style = String(n);
    b.textContent = String(n);
    b.addEventListener('click', function () {
      const door = window.WALK_MODE && WALK_MODE.insideDoor;
      if (!door) return;
      trySet(door.purpose, n);
      if (typeof walkPaintRoom === 'function') walkPaintRoom();
      trySync();
    });
    bar.appendChild(b);
  }
  const fav = document.createElement('button');
  fav.type = 'button';
  fav.className = 'fav';
  fav.textContent = 'FAVORITE';
  fav.addEventListener('click', function () {
    const door = window.WALK_MODE && WALK_MODE.insideDoor;
    if (!door) return;
    if (door.purpose === 'HOME' && window.HOUSE_ROW && HOUSE_ROW.last) {
      const row = HOUSE_ROW.last;
      tryWritePick(tryHouseKey(row), row.style, row.name);
    } else if (INTERIOR_TRY.last) {
      tryWritePick(INTERIOR_TRY.last.room, INTERIOR_TRY.last.style, INTERIOR_TRY.last.name);
    }
    tryPaintPicks();
    if (typeof walkPaintRoom === 'function') walkPaintRoom();
  });
  bar.appendChild(fav);
  card.appendChild(bar);
}

function tryEnsureUi() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('interior-try-menu')) {
    const css = document.createElement('style');
    css.textContent = '#interior-try-menu{position:fixed;inset:0;z-index:96;display:flex;flex-direction:column;gap:12px;padding:22px 16px 18px;background:#04140c;color:#e9fff2;font-family:sans-serif;overflow:auto}#interior-try-menu[hidden]{display:none}#interior-try-menu h1{margin:0;font-size:28px}#interior-try-menu p{margin:0;font-size:16px;max-width:640px}#interior-try-menu .row{display:flex;flex-wrap:wrap;gap:10px}#interior-try-menu button{min-height:64px;min-width:148px;padding:10px 14px;border-radius:16px;border:3px solid #7dff6b;background:#102418;color:#e9fff2;font:800 18px sans-serif;cursor:pointer}#interior-try-picks{font-size:16px;font-weight:800}#interior-try-switch{position:absolute;z-index:3;left:0;right:0;bottom:78px;display:flex;justify-content:center;gap:10px;pointer-events:auto}#interior-try-switch[hidden]{display:none}#interior-try-switch button{width:76px;height:76px;border-radius:18px;border:4px solid #e9fff2;background:#102418;color:#e9fff2;font:900 32px sans-serif;cursor:pointer}#interior-try-switch button[hidden]{display:none}#interior-try-switch button.on{background:#7dff6b;color:#04140c}#interior-try-switch button.fav{width:auto;padding:0 18px;font-size:16px;letter-spacing:.4px}#interior-try-back{position:fixed;z-index:97;left:14px;top:14px;min-height:52px;padding:10px 14px;border-radius:16px;border:3px solid #7dff6b;background:#102418;color:#e9fff2;font:800 16px sans-serif;cursor:pointer}#interior-try-back[hidden]{display:none}';
    document.head.appendChild(css);
    const menu = document.createElement('div');
    menu.id = 'interior-try-menu';
    menu.innerHTML = '<h1>Try the rooms</h1><p>Four houses stand on the southeast street, one style each, with the number on the sign. Four cafes stand across that street, one style each. Arcade, pet lounge, soccer shop, and Builder HQ have buttons 1 2 3 4. Tap FAVORITE on the one you like.</p><div class="row" id="interior-try-houses"></div><div class="row" id="interior-try-rooms"></div><div id="interior-try-picks"></div>';
    document.body.appendChild(menu);
    const houses = menu.querySelector('#interior-try-houses');
    const names = ['Glass loft', 'Timber cabin', 'Sky penthouse', 'Block home'];
    for (let n = 1; n <= 4; n++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = 'HOUSE ' + n + ' · STYLE ' + n;
      b.title = names[n - 1];
      b.addEventListener('click', function () { tryOpen('HOME', n); });
      houses.appendChild(b);
    }
    const rooms = menu.querySelector('#interior-try-rooms');
    const street = document.createElement('button');
    street.type = 'button';
    street.textContent = 'THE ROW';
    street.addEventListener('click', function () { tryRowStreet(false); });
    rooms.appendChild(street);
    for (let i = 0; i < TRY_SINGLE.length; i++) {
      const id = TRY_SINGLE[i];
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = TRY_ROOMS[id].title;
      b.addEventListener('click', function () { tryOpen(id, 0); });
      rooms.appendChild(b);
    }
  }
  tryEnsureSwitch();
  if (!document.getElementById('interior-try-back')) {
    const back = document.createElement('button');
    back.id = 'interior-try-back';
    back.type = 'button';
    back.textContent = 'ALL ROOMS';
    back.hidden = true;
    back.addEventListener('click', function () {
      window.INTERIOR_TRY_STREET = 0;
      if (window.WALK_MODE && WALK_MODE.insideBuilding && typeof WALK_MODE.stepBackOutside === 'function') WALK_MODE.stepBackOutside();
      tryShowMenu();
    });
    document.body.appendChild(back);
  }
  const out = document.getElementById('walk-step-out');
  if (out && out.dataset.tryMenu !== '1') {
    out.dataset.tryMenu = '1';
    out.addEventListener('click', function () {
      const door = window.WALK_MODE && WALK_MODE.insideDoor;
      if (window.INTERIOR_TRY_STREET && door && door.purpose === 'CAFE') return;
      window.INTERIOR_TRY_STREET = 0;
      tryShowMenu();
    });
  }
  tryPaintPicks();
}

function tryPaintPicks() {
  const el = document.getElementById('interior-try-picks');
  if (!el) return;
  const data = tryReadPicks();
  const keys = Object.keys(data);
  if (!keys.length) { el.textContent = 'Favorites: none yet'; return; }
  const bits = [];
  for (let i = 0; i < keys.length; i++) {
    const row = data[keys[i]];
    bits.push(keys[i] + ' style ' + row.style);
  }
  el.textContent = 'Favorites: ' + bits.join('  ·  ');
}

function tryShowMenu() {
  tryEnsureUi();
  const menu = document.getElementById('interior-try-menu');
  if (menu) menu.hidden = false;
  tryPaintPicks();
}

function tryHideMenu() {
  const menu = document.getElementById('interior-try-menu');
  if (menu) menu.hidden = true;
}

function tryOpen(purpose, houseN) {
  if (typeof P !== 'undefined' && P) {
    P.driveMode = 'street'; P.ground = true; P.v = 0; P.wreck = null; P.pitch = 0;
  }
  window.INTERIOR_TRY_HOUSE = purpose === 'HOME' ? houseN : 0;
  if (purpose === 'CAFE') {
    const n = tryQuery().style || tryCafeN || tryStyle('CAFE');
    tryCafeN = n;
    trySet('CAFE', n);
  } else if (purpose !== 'HOME') trySet(purpose, tryQuery().style || tryStyle(purpose));
  const titles = { HOME: 'HOME', CAFE: 'CAFE', ARCADE: 'ARCADE', PETS: 'PET LOUNGE', SOCCER: 'SOCCER SHOP', BUILDER: 'BUILDER HQ' };
  const door = { purpose: purpose, purposeLabel: titles[purpose] || purpose, actionLabel: '', color: '#7dff6b' };
  if (typeof WALK_MODE !== 'undefined') {
    WALK_MODE.onFoot = true;
    WALK_MODE.insideBuilding = true;
    WALK_MODE.insideDoor = door;
  }
  if (typeof walkShowInterior === 'function') walkShowInterior(door);
  tryHideMenu();
  trySync();
}

function trySync() {
  const bar = document.getElementById('interior-try-switch');
  const door = window.WALK_MODE && WALK_MODE.insideDoor;
  const single = !!(door && TRY_SINGLE.indexOf(door.purpose) >= 0);
  const home = !!(door && door.purpose === 'HOME');
  const cafe = !!(door && door.purpose === 'CAFE');
  if (bar) {
    bar.hidden = !(single || home || cafe);
    const n = single ? tryStyle(door.purpose) : 0;
    const buttons = bar.querySelectorAll('button[data-style]');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].hidden = !single;
      buttons[i].classList.toggle('on', Number(buttons[i].dataset.style) === n);
    }
  }
  const tools = document.getElementById('walk-room-tools');
  if (tools && tryQuery().on) tools.style.display = 'none';
  const open = document.getElementById('walk-open-page');
  if (open && tryQuery().on) open.hidden = true;
  const card = document.getElementById('walk-interior');
  if (card && tryQuery().on) {
    const nodes = card.querySelectorAll('h2,p');
    for (let i = 0; i < nodes.length; i++) nodes[i].style.visibility = 'hidden';
  }
  const out = document.getElementById('walk-step-out');
  if (out && tryQuery().on) out.textContent = (window.INTERIOR_TRY_STREET && cafe) ? 'STEP OUTSIDE' : 'ALL ROOMS';
}

function tryHold() {
  if (typeof P !== 'undefined' && P) {
    P.driveMode = 'street'; P.ground = true; P.v = 0; P.wreck = null; P.pitch = 0;
  }
}

let tryShotN = 0;
function tryTick() {
  const q = tryQuery();
  if (!q.on || typeof document === 'undefined' || !document.body) return;
  const ids = ['kOver', 'kWreck', 'brk', 'wng', 'tup', 'nos', 'mdpad', 'ebpad', 'kMenuB', 'kToast'];
  for (let i = 0; i < ids.length; i++) {
    const el = document.getElementById(ids[i]);
    if (el) el.style.display = 'none';
  }
  if (window.WALK_MODE && WALK_MODE.insideBuilding) tryHold();
  tryEnsureUi();
  const back = document.getElementById('interior-try-back');
  if (back) back.hidden = !!q.shot || !window.INTERIOR_TRY_STREET || !!(window.WALK_MODE && WALK_MODE.insideBuilding);
  if (!q.shot) {
    if (window.INTERIOR_TRY_STREET) { tryHideMenu(); return; }
    if (!window.WALK_MODE || !WALK_MODE.insideBuilding) tryShowMenu();
    return;
  }
  tryShotN++;
  if (q.shot === 'row' || q.shot === 'cafes') {
    if (q.shot === 'row') tryRowStreet(true);
    else tryCafeStreet(true);
    if (tryShotN > 36 && document.body.dataset.ready !== '1') {
      document.body.dataset.ready = '1';
      document.body.dataset.shot = q.shot;
      if (typeof P !== 'undefined' && P) {
        document.body.dataset.px = P.x.toFixed(1);
        document.body.dataset.pz = P.z.toFixed(1);
      }
    }
    return;
  }
  if (q.shot === 'menu') {
    if (window.WALK_MODE) { WALK_MODE.insideBuilding = false; WALK_MODE.insideDoor = null; }
    if (typeof walkHideInterior === 'function') walkHideInterior();
    tryShowMenu();
    if (tryShotN > 8) document.body.dataset.ready = '1';
    return;
  }
  const key = q.shot === 'house' ? 'HOME' : q.shot.toUpperCase();
  if (key !== 'HOME' && !tryRoom(key)) return;
  if (key === 'HOME' && !window.HOUSE_ROW) {
    if (typeof walkEnsureHomeStyles === 'function') walkEnsureHomeStyles();
    return;
  }
  const cardNow = document.getElementById('walk-interior');
  if (!window.WALK_MODE || !WALK_MODE.insideBuilding || !cardNow || cardNow.hidden) {
    tryOpen(key, q.shot === 'house' ? (q.style || 1) : 0);
  }
  if (q.style && tryRoom(key)) trySet(key, q.style);
  trySync();
  const info = key === 'HOME' ? (window.HOUSE_ROW && HOUSE_ROW.last) : INTERIOR_TRY.last;
  if (info && info.style && tryShotN > 12 && document.body.dataset.ready !== '1') {
    document.body.dataset.ready = '1';
    document.body.dataset.shot = q.shot;
    document.body.dataset.style = String(info.style);
    document.body.dataset.name = info.name || '';
    document.body.dataset.ms = String(info.ms);
    document.body.dataset.room = key;
  }
}

const INTERIOR_TRY = {
  saveKey: TRY_SAVE,
  rooms: TRY_ROOMS,
  single: TRY_SINGLE,
  has: function (purpose) { return TRY_SINGLE.indexOf(purpose) >= 0; },
  cafeStyle: tryCafeStyle,
  styleOf: tryStyle,
  setStyle: function (purpose, n) { if (purpose === 'CAFE') tryCafeN = n; trySet(purpose, n); },
  paint: tryPaint,
  picks: tryReadPicks,
  houseStar: tryHouseStar,
  open: tryOpen,
  sync: trySync,
  tick: tryTick,
  query: tryQuery
};
if (typeof window !== 'undefined') window.INTERIOR_TRY = INTERIOR_TRY;
if (typeof globalThis !== 'undefined') globalThis.INTERIOR_TRY = INTERIOR_TRY;
