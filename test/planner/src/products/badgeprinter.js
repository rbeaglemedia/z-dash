import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Badge printer. Sits on a table.
// UNCONFIRMED brand: missing-products.xlsx lists Zebra ZC300 or Epson ColorWorks C3500.
// Footprint uses the sheet's Zebra ZC300 single-sided size, which matches the Zebra spec
// (6.2 W × 15.1 D × 10.2 H in): https://www.zebra.com/us/en/products/spec-sheets/printers/card/zc300-series.html
// Dual-sided ZC300 is 18.4 in deep. Epson C3500 is 12.2 × 11.1 × 10.3 in (W × D × H):
// https://epson.com/For-Work/Printers/Label/ColorWorks-C3500-Color-Label-Printer/p/C31CD54011
// The mesh is a generic tabletop printer. No Zebra or Epson marks.
export const BADGE_NOTE = 'UNCONFIRMED brand (Zebra or Epson). Generic shape. Size is the Zebra ZC300 single-sided candidate, 6.2 × 15.1 × 10.2 in. Dual-sided ZC300 is 18.4 in deep. Epson ColorWorks C3500 is 12.2 × 11.1 × 10.3 in.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const badgeIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="8" width="20" height="28" rx="2"/><path d="M18 36h12v4H18z"/><path d="M20 16h8M18 32h12" stroke="${O}"/><circle cx="24" cy="23" r="3" stroke="${T}"/></svg>`;

export function drawBadge(g, d) {
  const body = mat('badgeBody', 0x2c3138);
  const lid = mat('badgeLid', 0x3d4550);
  const slot = mat('badgeSlot', 0x0c0e12);
  const card = mat('badgeCard', 0xe7e2d8);
  const led = mat('badgeLed', 0x5fd4ff, { emissive: 0x145868 });
  // Outer housing is the candidate footprint. Details sit inside it.
  // Housing is the candidate size. The slot, cards and lamp sit just proud of the faces so they read on the outside.
  box(g, d.w, d.h, d.d, body, 0, d.h / 2, 0).name = 'badgeBody';
  box(g, d.w * 0.86, 0.01, d.d * 0.5, lid, 0, d.h + 0.005, -d.d * 0.1);
  const slotW = d.w * 0.62, slotH = Math.min(0.05, d.h * 0.1);
  box(g, slotW, slotH, 0.01, slot, 0, d.h * 0.42, d.d / 2 + 0.005);
  box(g, slotW * 0.72, 0.008, 0.02, card, 0, d.h * 0.3, d.d / 2 + 0.004);
  const lamp = cyl(g, 0.012, 0.012, 0.012, led, d.w * 0.28, d.h * 0.72, d.d / 2 + 0.006, 10);
  lamp.rotation.x = Math.PI / 2;
}

export const BADGE = product(30, 'badgeprinter', 'computers', 'Badge printer', 6.2, 15.1, 10.2, 'badgeprinter', {
  snapsTo: ['top'], note: BADGE_NOTE, icon: badgeIcon(), draw: drawBadge, unconfirmed: true,
});
registerProduct(BADGE);
