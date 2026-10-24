import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// LED glow cube. missing-products.xlsx: 16 × 16 × 16 in, three rental listings.
// https://glowmi.com/products/led-illuminated-cube-chair
// https://rsvpparty.com/product/led-cube-16-x-16-cordless/
// https://www.magicjumprentals.com/rentals/51_furniture/933_led-cube-16
// The sheet still asks which LED furniture pieces Rentacomputer.com rents. Code-drawn. No photo.
export const GLOWCUBE_NOTE = 'UNCONFIRMED. missing-products.xlsx asks which LED furniture pieces Rentacomputer.com rents. Size is the sheet\'s 16 × 16 × 16 in glow cube (three rental listings agree).';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const glowCubeIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 30V16l14-8 14 8v14l-14 8z"/><path d="M10 16l14 8 14-8M24 24v16" stroke="${O}"/><path d="M16 20l8 4 8-4" stroke="${T}"/></svg>`;

export function drawGlowCube(g, d) {
  const edge = mat('glowCubeEdge', 0x12161c);
  const face = mat('glowCubeFace', hex(BRAND.colors.accent), { emissive: 0x1a6cff, emissiveIntensity: 0.85 });
  const t = 0.05;
  box(g, d.w, d.h, t, face, 0, d.h / 2, d.d / 2 - t / 2).name = 'glowFace';
  box(g, d.w, d.h, t, face, 0, d.h / 2, -d.d / 2 + t / 2);
  box(g, t, d.h, d.d - t * 2, face, d.w / 2 - t / 2, d.h / 2, 0);
  box(g, t, d.h, d.d - t * 2, face, -d.w / 2 + t / 2, d.h / 2, 0);
  box(g, d.w - t * 2, t, d.d - t * 2, face, 0, d.h - t / 2, 0);
  box(g, d.w - 0.08, 0.04, d.d - 0.08, edge, 0, 0.02, 0);
}

export const GLOWCUBE = product(60, 'glowcube', 'decor', 'LED glow cube', 16, 16, 16, 'glowcube', {
  topIn: 16, note: GLOWCUBE_NOTE, icon: glowCubeIcon(), draw: drawGlowCube, unconfirmed: true,
});
registerProduct(GLOWCUBE);
