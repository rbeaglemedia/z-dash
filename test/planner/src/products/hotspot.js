import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Wi-Fi hotspot. Code-drawn here. No third-party mesh. Small; sits on a table.
// missing-products.xlsx "Wi-Fi hotspot / cellular router".
// Pepwave MAX BR1 Pro 5G candidate, 5.78 × 5.08 × 1.15 in.
// https://download.peplink.com/resources/pepwave_br1_pro_5g_datasheet.pdf
// https://www.rentacomputer.com/rentals/wireless/internet-hotspots
// Bob has not confirmed that this shows on the floor plan.
export const HOTSPOT_IN = { w: 5.78, d: 5.08, h: 1.15 };
export const HOTSPOT_NOTE = 'Unconfirmed size. Not confirmed for the floor plan.';
export const HOTSPOT_FLAGS = [
  'Unconfirmed. missing-products.xlsx lists a Pepwave MAX BR1 Pro 5G candidate, 5.78 × 5.08 × 1.15 in, from the manufacturer datasheet. Rentacomputer.com has not confirmed the router.',
  'Bob has not confirmed that the hotspot shows on the floor plan. The sheet asks whether it is a small table-top icon.',
];

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const hotIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="18" width="32" height="16" rx="2"/><path d="M16 18c0-4 4-6 8-6s8 2 8 6" stroke="${O}"/><circle cx="24" cy="26" r="2" stroke="${T}"/></svg>`;

export function drawHotspot(g, d) {
  const body = mat('hotBody', 0x242a32);
  const top = mat('hotTop', 0x343c48);
  const led = mat('hotLed', hex(T), { emissive: 0x0a3a44 });
  const mark = mat('hotMark', hex(O));
  box(g, d.w, d.h, d.d, body, 0, d.h / 2, 0).name = 'hotspotBody';
  box(g, d.w * 0.84, d.h * 0.22, d.d * 0.72, top, 0, d.h * 0.72, 0);
  const lamp = cyl(g, d.w * 0.04, d.w * 0.04, 0.006, led, -d.w * 0.22, d.h * 0.62, d.d / 2 - 0.012, 8);
  lamp.rotation.x = Math.PI / 2;
  box(g, d.w * 0.18, d.h * 0.12, 0.006, mark, d.w * 0.2, d.h * 0.55, d.d / 2 - 0.01);
}

export const HOTSPOT = product(57, 'hotspot', 'computers', 'Wi-Fi hotspot', HOTSPOT_IN.w, HOTSPOT_IN.d, HOTSPOT_IN.h, 'hotspot', {
  snapsTo: ['top'], note: HOTSPOT_NOTE, flags: HOTSPOT_FLAGS, icon: hotIcon(), draw: drawHotspot, unconfirmed: true, showOnPlan: 'unconfirmed',
});
registerProduct(HOTSPOT);
