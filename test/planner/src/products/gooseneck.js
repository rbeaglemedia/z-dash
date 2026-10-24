import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { cyl, mat } from './geom.js';

// Podium mic. Code-drawn here. No third-party mesh.
// The missing-products.xlsx row names a podium gooseneck, but it does not list a gooseneck length.
// The only mic body on that row is the Shure SM58 handheld: 1.46 in diameter × 6.93 in long.
// https://content-files.shure.com/publications/specSheet/en/slx-d-spec-sheet.pdf
// This item uses that body, standing on a lectern. The stem is not extended past 6.93 in.
// Bob has not confirmed that mics show on the floor plan.
export const GOOSENECK_IN = { w: 1.46, d: 1.46, h: 6.93 };
export const GOOSENECK_NOTE = 'Unconfirmed. Gooseneck length is not in the size sheet; shown as the sourced handheld body. Not confirmed for the floor plan.';
export const GOOSENECK_FLAGS = [
  'Unconfirmed. missing-products.xlsx names a podium gooseneck and does not list a gooseneck length. No length was invented.',
  'The mesh is the sourced SM58 body, 1.46 in diameter × 6.93 in, standing on a lectern (snaps to a top).',
  'Bob has not confirmed that mics show on the floor plan.',
];

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const neckIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 40h16"/><path d="M24 40V16" stroke="${O}"/><rect x="20" y="8" width="8" height="10" rx="4" stroke="${T}"/></svg>`;

export function drawGooseneck(g, d) {
  const body = mat('neckBody', 0xc5c9d0);
  const cap = mat('neckCap', 0x1a1e24);
  const band = mat('neckBand', hex(T), { emissive: 0x0a3a44 });
  const mic = cyl(g, d.w / 2, d.w / 2, d.h, body, 0, d.h / 2, 0, 20);
  mic.name = 'gooseneckBody';
  cyl(g, d.w / 2 * 0.72, d.w / 2 * 0.72, d.h * 0.08, cap, 0, d.h * 0.9, 0, 16);
  cyl(g, d.w / 2 * 0.86, d.w / 2 * 0.86, d.h * 0.05, band, 0, d.h * 0.22, 0, 16);
}

export const GOOSENECK = product(53, 'gooseneck', 'audio', 'Podium gooseneck mic', GOOSENECK_IN.w, GOOSENECK_IN.d, GOOSENECK_IN.h, 'gooseneck', {
  snapsTo: ['top'], note: GOOSENECK_NOTE, flags: GOOSENECK_FLAGS, icon: neckIcon(), draw: drawGooseneck, unconfirmed: true, showOnPlan: 'unconfirmed',
});
registerProduct(GOOSENECK);
