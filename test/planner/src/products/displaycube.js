import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND } from '../brand.js';
import { box, mat } from './geom.js';

// Display cube. The spreadsheet's only numbered size in this row is the 12 × 12 × 42 pedestal.
// A separate cube standard, flagged: Set Shop lists 24x24x24, and Pro Party Rental publishes 24 × 24 × 24.
// https://setshop.com/cubes-pedestals-rental/
// https://propartyrental.myshopify.com/products/display-cube-white-24in-x-24in-x-24in-df
// Code-drawn. No photo. Not a seat; the glow cube is the lit 16 in seat.
export const CUBE_NOTE = 'UNCONFIRMED size. The spreadsheet only numbers a 12 × 12 × 42 in pedestal. This display cube is a separate 24 × 24 × 24 in rental listing (Set Shop and Pro Party Rental). Not confirmed for Rentacomputer.com.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const cubeIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 18l16-8 16 8-16 8z"/><path d="M8 18v14l16 8 16-8V18" stroke="${O}"/><path d="M24 26v14" stroke="${T}"/></svg>`;

export function drawDisplayCube(g, d) {
  const body = mat('cubeBody', 0xf7f5f0);
  const cap = mat('cubeCap', 0xe4e0d8);
  const seam = mat('cubeSeam', 0x2a3240);
  box(g, d.w, d.h - 0.08, d.d, body, 0, (d.h - 0.08) / 2, 0).name = 'cubeBody';
  box(g, d.w, 0.08, d.d, cap, 0, d.h - 0.04, 0);
  box(g, d.w * 0.72, 0.015, 0.012, seam, 0, d.h * 0.55, d.d / 2 - 0.004);
}

export const DISPLAYCUBE = product(63, 'displaycube', 'decor', 'Display cube', 24, 24, 24, 'displaycube', {
  topIn: 24, snapsTo: ['backwall'], note: CUBE_NOTE, icon: cubeIcon(), draw: drawDisplayCube, unconfirmed: true,
});
registerProduct(DISPLAYCUBE);
