import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Backbar. The spreadsheet row is only the CORT Posh front bar. No backbar size is in the sheet.
// Placeholder from rental listings that cluster around 72 in wide and about 84 in tall:
// https://www.luxerentals.com/furniture/bar-backs-towers/bar-back/essex-bar-back/ (72 × 18 × 84)
// https://1978eventrentals.com/product/essex-gold-bar-back/ (72 × 18.5 × 84)
// https://www.illusionsrentals.com/product/essex-bar-back-black/ (72 × 18 × 83)
// Bob has not confirmed that Rentacomputer.com rents bars. Code-drawn. No photo. No bottle brands.
export const BACKBAR_NOTE = 'UNCONFIRMED. Bob has not confirmed that Rentacomputer.com rents bars. The spreadsheet sizes only the front bar. Placeholder backbar 72 × 18 × 84 in (Luxe). Nearby listings are 72 × 18.5 × 84 and 72 × 18 × 83.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const backBarIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h32v36H8z"/><path d="M8 18h32M8 30h32" stroke="${O}"/><path d="M16 12h4M28 12h4M18 24h4" stroke="${T}"/></svg>`;

export function drawBackbar(g, d) {
  const frame = mat('bbarFrame', 0x2c323c);
  const shelf = mat('bbarShelf', 0x8d6a45);
  const bottle = mat('bbarBottle', 0x1c4a3a);
  const amber = mat('bbarAmber', 0xc4a15a);
  const post = 0.06;
  for (const sx of [-1, 1]) box(g, post, d.h, post, frame, sx * (d.w / 2 - post / 2), d.h / 2, 0);
  box(g, d.w, post, post, frame, 0, d.h - post / 2, 0).name = 'backbarFrame';
  box(g, d.w, post, d.d, frame, 0, post / 2, 0);
  const levels = [0.28, 0.5, 0.72];
  for (const k of levels) {
    box(g, d.w - post * 2, 0.04, d.d * 0.72, shelf, 0, d.h * k, -d.d * 0.08);
  }
  const y = d.h * 0.72 + 0.22;
  let x = -d.w * 0.32;
  for (let i = 0; i < 7; i++) {
    cyl(g, 0.045, 0.05, 0.32, i % 2 ? amber : bottle, x, y, -d.d * 0.05, 10);
    x += d.w * 0.1;
  }
}

export const BACKBAR = product(65, 'backbar', 'counters', 'Backbar', 72, 18, 84, 'backbar', {
  snapsTo: ['nearwall'], note: BACKBAR_NOTE, icon: backBarIcon(), draw: drawBackbar, unconfirmed: true,
});
registerProduct(BACKBAR);
