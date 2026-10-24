import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Queue barricade. missing-products.xlsx: steel bike-rack, 100 in long, 43 in tall.
// Feet depth is the sheet's ~20 in and is UNCONFIRMED. Sections snap end to end.
export const QBAR_NOTE = 'UNCONFIRMED feet depth. Steel bike-rack queue barricade, 100 in long and 43 in tall. The 20 in depth is the sheet value and is not confirmed. Sections snap end to end into a line.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 40V14M38 40V14M10 16h28M10 28h28"/><path d="M6 40h8M34 40h8" stroke="${O}"/><path d="M14 34h20" stroke="${T}"/></svg>`;

export function drawQbar(g, d) {
  const steel = mat('qbarSteel', 0xc5ccd4);
  const foot = mat('qbarFoot', 0x3a414c);
  const band = mat('qbarBand', hex(O));
  const r = 0.055;
  for (const sx of [-1, 1]) {
    box(g, 0.14, 0.08, d.d, foot, sx * (d.w / 2 - 0.07), 0.04, 0).name = 'qbarFoot';
    box(g, 0.08, d.h - r * 2, 0.08, steel, sx * (d.w / 2 - 0.04), (d.h - r * 2) / 2, 0).name = 'qbarPost';
  }
  const rail = cyl(g, r, r, d.w, steel, 0, d.h - r, 0, 12);
  rail.rotation.z = Math.PI / 2;
  rail.name = 'qbarRail';
  const mid = cyl(g, r * 0.7, r * 0.7, d.w - 0.24, steel, 0, d.h * 0.48, 0, 12);
  mid.rotation.z = Math.PI / 2;
  mid.name = 'qbarMid';
  const stripe = cyl(g, r * 0.72, r * 0.72, 0.35, band, 0, d.h * 0.48, 0, 12);
  stripe.rotation.z = Math.PI / 2;
}

export const QBAR = product(70, 'qbar', 'decor', 'Queue barricade', 100, 20, 43, 'qbar', {
  place: 'end', note: QBAR_NOTE, icon, draw: drawQbar, unconfirmed: true,
  flags: ['Feet depth is the sheet value of about 20 in and is not confirmed.', 'Length 100 in and height 43 in are the steel bike-rack candidate. Sections snap end to end.'],
});
registerProduct(QBAR);
