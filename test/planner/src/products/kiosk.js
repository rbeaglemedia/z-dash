import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import * as THREE from 'three';
import { addBox, addCyl, addScreen, inch, installShape, solid } from './screenface.js';

// iPad / tablet kiosk. Published envelope stays 18 x 18 x 48 in (flagged, unconfirmed).
// The 3D shape is the floor pedestal below. Shape stays "kiosk" so Run Event still
// binds the glass: src/sim/screens.js lists "kiosk" and paints any panel-coloured mesh.
// meshes.js already draws shape "kiosk" as the older full-width slab, so this file
// drops the same white envelope placeholder installShape swaps for the touch products.
// That slab case is left untouched. buildSavedSlabKioskMesh is a copy for a later product.
const item = product(20, 'kiosk', 'kiosks', 'iPad / tablet kiosk', 18, 18, 48, 'kiosk', { snapsTo: ['backwall'] });

const WHITE = 0xf7f8fa;
const PAD = 0x1c2128;
const BEZEL = 0x14181e;
const ACCENT = hex(BRAND.colors.accent);
const TILT_DEG = 40;

const rad = (deg) => deg * Math.PI / 180;

function buildPedestal(g) {
  const { w, h, d } = item;
  const padH = inch(0.45), baseH = inch(0.65);
  const pad = addBox(g, w, padH, d, solid('ipadPad', PAD), 0, padH / 2, 0);
  pad.name = 'kioskPad';
  const base = addBox(g, w - inch(0.35), baseH, d - inch(0.35), solid('ipadWhite', WHITE), 0, padH + baseH / 2, 0);
  base.name = 'kioskBase';

  const colW = inch(9), colD = inch(4.5);
  const colY0 = padH + baseH;
  const headW = inch(13.5), headH = inch(5.4), headD = inch(5.6);
  const tabW = inch(12.2), tabH = inch(8.5), tabT = inch(0.62);
  const a = rad(TILT_DEG);
  const halfY = (tabH / 2) * Math.cos(a) + (tabT / 2) * Math.sin(a);
  const tabCenterY = h - halfY - inch(0.15);
  const tabZ = inch(1.15);
  const headTop = tabCenterY - (tabH / 2) * Math.cos(a) + inch(0.35);
  const headCenterY = headTop - headH / 2;
  const headZ = inch(0.35);
  const colTop = headCenterY - headH / 2 + inch(0.4);
  const colH = colTop - colY0;
  const col = addBox(g, colW, colH, colD, solid('ipadWhite', WHITE), 0, colY0 + colH / 2, inch(0.05));
  col.name = 'kioskPedestal';

  const head = addBox(g, headW, headH, headD, solid('ipadWhite', WHITE), 0, headCenterY, headZ);
  head.name = 'kioskHead';
  const faceZ = headZ + headD / 2;
  const recess = addBox(g, inch(4.6), inch(2.8), inch(0.12), solid('ipadRecess', 0x14181e), inch(-1.6), headCenterY + inch(0.2), faceZ + inch(0.02));
  recess.name = 'kioskSensor';
  const lens = addCyl(g, inch(0.7), inch(0.08), solid('ipadLens', 0x0c1016), inch(-1.6), headCenterY + inch(0.2), faceZ + inch(0.1));
  lens.rotation.x = Math.PI / 2;
  addBox(g, inch(1.5), inch(1.05), inch(0.08), solid('ipadWell', 0xe8eef4), inch(1.85), headCenterY - inch(0.05), faceZ + inch(0.02));
  addBox(g, inch(0.28), inch(0.28), inch(0.05), solid('ipadAccent', ACCENT), inch(1.45), headCenterY + inch(0.7), faceZ + inch(0.05));
  addBox(g, inch(0.22), inch(0.22), inch(0.05), solid('ipadPip', 0xf4f7fb), inch(2.15), headCenterY + inch(0.7), faceZ + inch(0.05));

  const tab = new THREE.Group();
  tab.name = 'kioskTablet';
  tab.position.set(0, tabCenterY, tabZ);
  tab.rotation.x = -a;
  addBox(tab, tabW, tabH, tabT, solid('ipadBezel', BEZEL), 0, 0, 0);
  const sw = tabW - inch(0.72), sh = tabH - inch(0.72), st = inch(0.08);
  const screen = addScreen(tab, sw, sh, st, 0, 0, tabT / 2 - st / 2 + inch(0.02));
  screen.userData.isScreenFace = true;
  g.add(tab);

  // Black arm under the head, tipped toward the user. The white reader hangs
  // below the head and in front of the column, not off to the side.
  const rg = new THREE.Group();
  rg.name = 'kioskReaderMount';
  rg.rotation.x = -rad(34);
  const headBottom = headCenterY - headH / 2;
  rg.position.set(0, headBottom - inch(0.7), faceZ + inch(1.7));
  const bracket = addBox(rg, inch(3.2), inch(0.7), inch(3.4), solid('ipadBracket', 0x1a1e24), 0, inch(0.85), inch(-1.15));
  bracket.name = 'kioskReaderBracket';
  const reader = addBox(rg, inch(3.5), inch(3.3), inch(0.46), solid('ipadReader', 0xfbfcfd), 0, inch(-0.15), inch(0.28));
  reader.name = 'kioskReader';
  addBox(rg, inch(2.2), inch(0.11), inch(0.04), solid('ipadSlot', 0x8e98a3), 0, inch(0.7), inch(0.54));
  const mark = addCyl(rg, inch(0.24), inch(0.04), solid('ipadMark', 0x6e7884), 0, inch(-0.35), inch(0.55));
  mark.rotation.x = Math.PI / 2;
  g.add(rg);
}

installShape(item.w, item.h, item.d, buildPedestal);

// Same white full-envelope box meshes.js uses for an unknown shape. installShape
// replaces it. Kept off the shared white() material so that cache is not disposed.
item.mesh = () => {
  const g = new THREE.Group();
  const ph = new THREE.Mesh(new THREE.BoxGeometry(item.w, item.h, item.d), solid('ipadPlaceholder', 0xf1efe9));
  ph.position.set(0, item.h / 2, 0);
  g.add(ph);
  return g;
};

registerProduct(item);

// The slab drawn by meshes.js case 'kiosk', rebuilt here so a later product can
// reuse it without editing that file. Widths match that case (body is 0.7 x the
// footprint), so it still reads as a full-width slab rather than this pedestal.
export function buildSavedSlabKioskMesh(w, h, d) {
  const g = new THREE.Group();
  const dark = solid('slabDark', 0x2a3240), white = solid('slabWhite', 0xf1efe9), black = solid('slabBlack', 0x15181d);
  const navy = solid('slabNavy', 0x0b1f3a), grille = solid('slabGrille', 0x23272e);
  const hi = solid('slabHi', hex(BRAND.colors.highlight)), accent = solid('slabAccent', hex(BRAND.colors.accent));
  addBox(g, w, 0.08, d, dark, 0, 0.04, 0).name = 'slabBase';
  const body = addBox(g, w * 0.7, h - 0.3, 0.35, white, 0, 0.08 + (h - 0.3) / 2, -0.05);
  body.name = 'slabBody';
  const t = new THREE.Group();
  t.name = 'slabTablet';
  t.position.set(0, h - 1.4, 0.13);
  t.rotation.x = -0.12;
  addBox(t, w * 0.62, 1.45, 0.06, black, 0, 0.7, 0);
  const glass = addBox(t, w * 0.56, 1.35, 0.005, solid('slabGlass', 0x1b3a55, { emissive: 0x0e2a44 }), 0, 0.7, 0.033);
  glass.name = 'slabScreen';
  g.add(t);
  addBox(g, w * 0.7, 0.12, 0.36, hi, 0, h - 0.06, -0.05).name = 'slabCap';
  addBox(g, w * 0.5, 0.5, 0.005, navy, 0, 0.9, 0.13);
  addBox(g, 0.28, 0.18, 0.12, black, w * 0.22, h - 1.75, 0.17).name = 'slabCard';
  addBox(g, 0.2, 0.02, 0.01, accent, w * 0.22, h - 1.7, 0.235);
  for (const s of [-1, 1]) addBox(g, 0.05, 0.4, 0.006, grille, s * w * 0.28, h - 0.7, 0.17);
  return g;
}
