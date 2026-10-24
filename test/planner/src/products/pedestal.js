import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND } from '../brand.js';
import { box, mat } from './geom.js';

// Display pedestal. missing-products.xlsx: 12 × 12 × 42 in.
// https://formdecor.com/products/table-bar-rental/side-table-rental/linea-pedestal-black-large-clear-glass/ (12 × 12 × 42)
// https://setshop.com/cubes-pedestals-rental/ lists 12x12x42 among rental pedestals.
// The sheet asks which pedestal sizes Rentacomputer.com rents. Code-drawn. No photo.
export const PEDESTAL_NOTE = 'UNCONFIRMED. missing-products.xlsx asks which pedestal sizes Rentacomputer.com rents. Size is the sheet\'s 12 × 12 × 42 in display pedestal (FormDecor Linea and the Set Shop list).';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const pedestalIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8h12v32H18z"/><path d="M14 40h20M16 8h16" stroke="${O}"/><path d="M20 14h8" stroke="${T}"/></svg>`;

export function drawPedestal(g, d) {
  const metal = mat('pedMetal', 0x2a3038);
  const panel = mat('pedPanel', 0xf3f1ec);
  const glass = mat('pedGlass', 0xd5e4ee);
  const post = Math.min(0.06, d.w * 0.12);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, post, d.h - 0.04, post, metal, sx * (d.w / 2 - post / 2), (d.h - 0.04) / 2, sz * (d.d / 2 - post / 2));
  box(g, d.w - post * 2, d.h - 0.1, d.d - post * 2, panel, 0, (d.h - 0.1) / 2, 0).name = 'pedestalBody';
  box(g, d.w, 0.04, d.d, glass, 0, d.h - 0.02, 0).name = 'pedestalTop';
}

export const PEDESTAL = product(62, 'pedestal', 'decor', 'Display pedestal', 12, 12, 42, 'pedestal', {
  topIn: 42, snapsTo: ['backwall'], note: PEDESTAL_NOTE, icon: pedestalIcon(), draw: drawPedestal, unconfirmed: true,
});
registerProduct(PEDESTAL);
