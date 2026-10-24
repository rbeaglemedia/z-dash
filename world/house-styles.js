/* House looks for the homestead doors.
   Painted only while a HOME interior is open. The city frame does not draw these boxes.
   Straight boxes and flat color. Glass on every look. */
'use strict';

const HOUSE_LOOKS = [
  {
    n: 1, id: 'glass', name: 'Glass loft',
    line: 'A bright glass house with a cyan light and a soft sofa.',
    w: 24, d: 18, h: 4.8, floor: '#f3ecdf', wall: '#f7f4ef', ceil: '#fffdf8',
    panes: { z: 17.6, y: 0.4, h: 3.6, xs: [-6, -2, 2, 6], fill: '#d7f4fb', edge: '#9ad4e2' },
    boxes: [
      [0, 9, 4.55, 14, 0.08, 0.12, '#3ee6ff'],
      [0, 7.2, 0.02, 6.4, 0.04, 3.6, '#e7d7c3'],
      [-2.4, 6.8, 0, 2.6, 0.82, 0.95, '#f4efe6'],
      [1.6, 6.6, 0, 1.2, 0.75, 0.7, '#d9c7a6'],
      [3.4, 5.4, 0, 1.15, 0.28, 0.75, '#7dff6b'],
      [0, 16.4, 1.15, 1.9, 1.08, 0.12, '#1b1e26']
    ]
  },
  {
    n: 2, id: 'cabin', name: 'Timber cabin',
    line: 'A warm wood cabin with a big window and a stone hearth.',
    w: 22, d: 16, h: 4.2, floor: '#c4894a', wall: '#f4e4cf', ceil: '#f8efe4',
    panes: { z: 15.6, y: 0.8, h: 2.4, xs: [-4, 0, 4], fill: '#d5e6ea', edge: '#9bb8c0' },
    boxes: [
      [-5.2, 8, 0, 6, 3.2, 0.22, '#e6d0b0'],
      [5.2, 8, 0, 6, 3.2, 0.22, '#e6d0b0'],
      [-4.2, 6.2, 0, 0.7, 1.1, 0.7, '#5c3b22'],
      [-4.2, 6.2, 1.05, 1.3, 0.28, 1.1, '#ffb020'],
      [0, 8, 2.55, 8, 0.32, 5, '#a56b3c'],
      [0, 8, 2.87, 5.2, 0.28, 3.2, '#c4894a'],
      [0, 8, 3.15, 2.6, 0.24, 1.8, '#e6d0b0'],
      [-1.6, 7.2, 0, 2.2, 0.85, 0.9, '#7a3428'],
      [2.2, 7.2, 0, 1.4, 0.75, 0.8, '#c4894a']
    ]
  },
  {
    n: 3, id: 'sky', name: 'Sky penthouse',
    line: 'A tall glass room with a gold edge and a low lounge.',
    w: 30, d: 20, h: 7.2, floor: '#e7e2da', wall: '#f7f5f1', ceil: '#fbfaf7',
    panes: { z: 19.6, y: 0.4, h: 5.2, xs: [-8, -4, 0, 4, 8], fill: '#d5e6ee', edge: '#b7c9ce' },
    boxes: [
      [0, 10, 6.7, 22, 0.12, 14, '#efe6d4'],
      [-12, 10, 1.2, 0.12, 0.08, 14, '#e6c56a'],
      [12, 10, 1.2, 0.12, 0.08, 14, '#e6c56a'],
      [0, 8, 0.02, 8, 0.05, 4, '#d9c7a0'],
      [-2.2, 7.2, 0, 3.2, 0.55, 1.05, '#f7f4ee'],
      [2.4, 7.4, 0, 1.8, 0.42, 0.8, '#f7f4ee'],
      [0, 18.2, 1.3, 3.2, 1.6, 0.1, '#e7e2da']
    ]
  },
  {
    n: 4, id: 'block', name: 'Block home',
    line: 'Chunky wood blocks, a glass window, and a cube seat.',
    w: 24, d: 18, h: 5.4, floor: '#d7c4a2', wall: '#f3ead7', ceil: '#fff8ee',
    panes: { z: 17.6, y: 1.2, h: 2.4, xs: [-4, 0, 4], fill: '#c8efe8', edge: '#8ec9c0' },
    boxes: [
      [-3.4, 8.2, 0, 1.8, 1.8, 1.8, '#c4894a'],
      [-3.4, 8.2, 1.8, 1.2, 1.2, 1.2, '#7dff6b'],
      [3.2, 9.4, 0, 1.8, 1.1, 1.8, '#e6d0b0'],
      [3.2, 9.4, 1.1, 1.2, 1.2, 1.2, '#ffb020'],
      [0.4, 6.6, 0, 1.4, 0.7, 1.4, '#f4efe6'],
      [-1.2, 11, 0, 1.4, 1.4, 1.4, '#3ee6ff'],
      [2.6, 16.2, 1.2, 1.9, 1.08, 0.12, '#1b1e26']
    ]
  }
];

function houseHomes() {
  const list = [];
  const BL = (typeof CITY !== 'undefined' && CITY && CITY.BL) || [];
  for (let i = 0; i < BL.length; i++) if (BL[i] && BL[i].purpose === 'HOME') list.push(BL[i]);
  list.sort(function (a, b) { return (a.z0 - b.z0) || (a.x0 - b.x0) || ((a.id || 0) - (b.id || 0)); });
  return list;
}

function houseUrlStyle() {
  try {
    const n = parseInt(new URLSearchParams(location.search).get('homeStyle') || '', 10);
    if (n >= 1 && n <= 4) return n;
  } catch (e) {}
  return 0;
}

function houseMarked(door) {
  const b = door && door.building;
  if (!b) return 0;
  if (b.tryHouse >= 1 && b.tryHouse <= 4) return b.tryHouse;
  const text = b.sign && (b.sign.t || b.sign.word || '');
  const m = /HOME\s*([1-4])/.exec(String(text).toUpperCase());
  return m ? Number(m[1]) : 0;
}

function housePick(door) {
  const homes = houseHomes();
  let i = 0;
  if (door && door.building) {
    for (let n = 0; n < homes.length; n++) {
      if (homes[n] === door.building || homes[n].id === door.building.id) { i = n; break; }
    }
  }
  const url = houseUrlStyle();
  const marked = houseMarked(door);
  const held = (!url && !marked && typeof window !== 'undefined' && window.INTERIOR_TRY_HOUSE >= 1 && window.INTERIOR_TRY_HOUSE <= 4)
    ? window.INTERIOR_TRY_HOUSE : 0;
  const style = url || marked || held || ((i % 4) + 1);
  const house = marked || held || url || (i + 1);
  const look = HOUSE_LOOKS[style - 1];
  return { house: house, style: style, homes: homes.length, look: look, forced: !!(url || held) };
}

function houseBox(g, W, H, b) {
  walkBox(g, b[0], b[2], b[1], b[3] / 2, b[4], b[5] / 2, b[6], null, W, H);
}

function houseActors(g, W, H) {
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

function housePaint(g, W, H, door) {
  const pick = housePick(door);
  const look = pick.look;
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
  for (let i = 0; i < panes.xs.length; i++) {
    houseBox(g, W, H, [panes.xs[i], panes.z, panes.y, 2.2, panes.h, 0.08, panes.fill]);
  }
  for (let i = 0; i < look.boxes.length; i++) houseBox(g, W, H, look.boxes[i]);
  houseActors(g, W, H);
  const dt = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : 0) - t0;
  if (!look.samples) look.samples = [];
  if (look.samples.length < 40) look.samples.push(dt);
  let sum = 0;
  for (let i = 0; i < look.samples.length; i++) sum += look.samples[i];
  const ms = sum / look.samples.length;
  const fps = ms < 9.1 ? 'about 110 fps' : (ms > 0 ? 'about ' + Math.round(1000 / ms) + ' fps' : '');
  g.fillStyle = '#04140c';
  g.fillRect(0, H - 64, W, 64);
  g.fillStyle = '#e9fff2';
  g.font = '800 20px sans-serif';
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  const where = 'HOUSE ' + pick.house + '  STYLE ' + pick.style + '  ' + look.name.toUpperCase();
  const star = (typeof window !== 'undefined' && window.INTERIOR_TRY && INTERIOR_TRY.houseStar)
    ? INTERIOR_TRY.houseStar(pick) : '';
  g.fillText(where + star, 16, H - 38);
  g.font = '700 15px sans-serif';
  g.fillText(look.line + '   ' + ms.toFixed(2) + ' ms   ' + fps, 16, H - 14);
  return { ms: ms, house: pick.house, style: pick.style, name: look.name, homes: pick.homes, forced: pick.forced };
}

const HOUSE_ROW = {
  looks: HOUSE_LOOKS,
  homes: houseHomes,
  pick: housePick,
  paint: housePaint
};
if (typeof window !== 'undefined') window.HOUSE_ROW = HOUSE_ROW;
if (typeof globalThis !== 'undefined') globalThis.HOUSE_ROW = HOUSE_ROW;
