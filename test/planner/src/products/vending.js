import * as THREE from 'three';
import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// Vending machine. missing-products.xlsx: no model, size UNCONFIRMED.
// Placeholder is one maker's cabinet, not a shared standard. Two AMS sheets agree:
// https://amsvendors.com/wp-content/uploads/2025/04/Classic-Snack-2025.pdf (5-wide: 72 H × 39 W × 35 D)
// http://www.aecosales.com/distributors/AMS/SensitSnack.pdf (AMS-39-SNACK: 72 H × 39 W × 35 D)
// Crane Merchant Ambient is different (72 H × 33 or 44 W × 37.5 D):
// https://www.craneconvenience.com/solutions/vending/snacks/products/merchant-ambient-media2-vending-machine
// Code-drawn. No maker marks.
// The front glass is a portrait touchscreen, one mesh named "screen", with its own
// material (same contract as the touchscreen kiosk). A later video pass can set
// material.map on that mesh. The 24 × 42 in glass is not on either AMS sheet.
export const SCREEN_W_IN = 24;
export const SCREEN_H_IN = 42;
export const VENDING_NOTE = 'PLACEHOLDER. No vending model in missing-products.xlsx. Envelope is the AMS Classic Snack 5-wide, 39 × 35 × 72 in, on two AMS sheets. Crane Merchant cabinets are 33 or 44 in wide, so this is not a shared standard. Not confirmed for Rentacomputer.com. Front portrait screen is drawn 24 × 42 in. Screen size is UNCONFIRMED.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const vendingIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="12" y="4" width="24" height="40" rx="1"/><rect x="16" y="8" width="16" height="26" rx="0.8" stroke="${T}" fill="${T}33"/><path d="M16 38h16" stroke="${O}"/></svg>`;

function addVendScreen(g, d) {
  const sw = SCREEN_W_IN / 12, sh = SCREEN_H_IN / 12, t = 0.012, proud = 0.008;
  const bezel = mat('vendBezel', 0x15181d);
  const y = d.h * 0.58;
  const z = d.d / 2 - t / 2 + proud;
  box(g, sw + 0.14, sh + 0.14, 0.02, bezel, 0, y, z - t / 2 - 0.012).name = 'vendBezel';
  const glass = new THREE.MeshLambertMaterial({ color: 0x1b3a55, emissive: 0x0e2a44 });
  const o = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, t), glass);
  o.position.set(0, y, z);
  o.name = 'screen';
  o.userData.screen = 1;
  o.userData.ownMat = 1;
  g.add(o);
  box(g, sw * 0.28, 0.02, 0.006, mat('vendTick', hex(T)), 0, y - sh / 2 - 0.06, d.d / 2 + 0.004).name = 'vendTick';
  return o;
}

export function drawVending(g, d) {
  const body = mat('vendBody', 0x2a313c);
  const trim = mat('vendTrim', 0x15181d);
  const bin = mat('vendBin', 0x0e1116);
  const t = 0.05;
  box(g, d.w, d.h, d.d - 0.04, body, 0, d.h / 2, -0.02).name = 'vendBody';
  box(g, d.w, t, 0.04, trim, 0, d.h - t / 2, d.d / 2 - 0.02);
  box(g, d.w, t, 0.04, trim, 0, t / 2, d.d / 2 - 0.02);
  box(g, t, d.h, 0.04, trim, d.w / 2 - t / 2, d.h / 2, d.d / 2 - 0.02);
  box(g, t, d.h, 0.04, trim, -d.w / 2 + t / 2, d.h / 2, d.d / 2 - 0.02);
  addVendScreen(g, d);
  box(g, d.w * 0.7, d.h * 0.12, 0.03, bin, 0, d.h * 0.16, d.d / 2 - 0.02).name = 'vendBin';
}

export const VENDING = product(67, 'vending', 'decor', 'Vending machine', 39, 35, 72, 'vending', {
  snapsTo: ['nearwall'], note: VENDING_NOTE, icon: vendingIcon(), draw: drawVending, unconfirmed: true, placeholder: true,
});
registerProduct(VENDING);
