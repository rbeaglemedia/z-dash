import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Subwoofer. Code-drawn here. No third-party mesh.
// Same missing-products.xlsx row as the mixer. The columns are the mixer.
// The subwoofer size is in the model text: JBL EON718S, 24 W × 25.1 D × 26.3 H in.
// https://jblpro.com/en/products/jbl-eon718s
// https://www.rentacomputer.com/rentals/audio-visual/sound-systems
// The sheet marks the sub High (manufacturer) and still asks which subwoofer we rent.
export const SUB_IN = { w: 24, d: 25.1, h: 26.3 };
export const SUB_NOTE = 'Unconfirmed size.';
export const SUB_FLAGS = [
  'Unconfirmed. missing-products.xlsx lists a JBL EON718S candidate, 24 × 25.1 × 26.3 in, from the manufacturer page. Rentacomputer.com has not confirmed the subwoofer.',
  'The row\'s W × D × H columns are the mixer (24.84 × 20.16 × 8.39 in). Those numbers are not used for this item.',
];

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const subIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="10" y="8" width="28" height="32" rx="2"/><circle cx="24" cy="22" r="7" stroke="${O}"/><circle cx="24" cy="22" r="2" stroke="${T}"/><path d="M16 36h16"/></svg>`;

export function drawSubwoofer(g, d) {
  const cab = mat('subCab', 0x16191e);
  const grille = mat('subGrille', 0x2a3138);
  const cone = mat('subCone', 0x0e1116);
  const port = mat('subPort', 0x07080a);
  const tick = mat('subTick', hex(T), { emissive: 0x0a3a44 });
  box(g, d.w, d.h, d.d, cab, 0, d.h / 2, 0).name = 'subCab';
  box(g, d.w * 0.86, d.h * 0.78, 0.01, grille, 0, d.h * 0.52, d.d / 2 - 0.012);
  const coneM = cyl(g, d.w * 0.22, d.w * 0.22, 0.01, cone, 0, d.h * 0.58, d.d / 2 - 0.016, 24);
  coneM.rotation.x = Math.PI / 2;
  const portM = cyl(g, d.w * 0.06, d.w * 0.06, 0.01, port, 0, d.h * 0.22, d.d / 2 - 0.016, 16);
  portM.rotation.x = Math.PI / 2;
  box(g, d.w * 0.2, 0.012, 0.012, tick, 0, d.h * 0.1, d.d / 2 - 0.02);
}

export const SUB = product(51, 'subwoofer', 'audio', 'Subwoofer', SUB_IN.w, SUB_IN.d, SUB_IN.h, 'subwoofer', {
  note: SUB_NOTE, flags: SUB_FLAGS, icon: subIcon(), draw: drawSubwoofer, unconfirmed: true,
});
registerProduct(SUB);
