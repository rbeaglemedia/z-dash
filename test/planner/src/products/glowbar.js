import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// LED glow bar. The spreadsheet sizes only the 16 in cube and asks whether bars are rented.
// Three rental pages publish 72 × 24 × 42 in. Others differ, so this stays flagged.
// https://moderneventrentalchi.com/product/6ft-led-bar/ (72 × 24 × 42)
// https://www.moderneventrental.com/product/6ft-led-light-up-bar/ (72 × 24 × 42)
// https://www.aonerentals.com/bar-6-with-accessories/ (72 × 24 × 42)
// Differing: https://magicspecialevents.com/event-rentals/rental-item/glow-bar (72 × 12 × 42)
// https://www.shagcarpetprops.com/LED-Bar-p/13120.htm (72 × 22 × 48)
// Code-drawn. No photo.
export const GLOWBAR_NOTE = 'UNCONFIRMED. The spreadsheet sizes only the 16 in cube and asks whether Rentacomputer.com rents bars. Placeholder 72 × 24 × 42 in from three rental pages. Other glow bars are listed at 72 × 12 × 42 and 72 × 22 × 48.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const glowBarIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h36v14H6z"/><path d="M8 32v6M40 32v6M6 38h36" stroke="${O}"/><path d="M10 22h28" stroke="${T}"/></svg>`;

export function drawGlowBar(g, d) {
  const frame = mat('glowBarFrame', 0xc5ccd4);
  const top = mat('glowBarTop', 0x1c222b);
  const face = mat('glowBarFace', hex(BRAND.colors.accent), { emissive: 0x1458d0, emissiveIntensity: 0.8 });
  const post = 0.07;
  box(g, d.w, 0.08, d.d, top, 0, d.h - 0.04, 0).name = 'glowBarTop';
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, post, d.h - 0.08, post, frame, sx * (d.w / 2 - post / 2), (d.h - 0.08) / 2, sz * (d.d / 2 - post / 2));
  box(g, d.w - 0.3, d.h * 0.55, 0.04, face, 0, d.h * 0.38, d.d / 2 - 0.06).name = 'glowBarFace';
  box(g, d.w - 0.5, 0.04, d.d * 0.55, frame, 0, d.h * 0.42, -0.05);
}

export const GLOWBAR = product(61, 'glowbar', 'decor', 'LED glow bar', 72, 24, 42, 'glowbar', {
  topIn: 42, note: GLOWBAR_NOTE, icon: glowBarIcon(), draw: drawGlowBar, unconfirmed: true,
});
registerProduct(GLOWBAR);
