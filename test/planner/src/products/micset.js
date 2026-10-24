import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Wireless mic set on a table. Code-drawn here. No third-party mesh.
// missing-products.xlsx "Wireless microphones (handheld/lav/headset) + podium gooseneck mic".
// Sourced parts on that row: Shure SLXD4 receiver 7.76 W × 5.98 D × 1.65 H in;
// SLXD24/SM58 handheld 1.46 in diameter × 6.93 in long.
// https://content-files.shure.com/publications/specSheet/en/slx-d-spec-sheet.pdf
// Lav and headset body sizes are not in the sheet, so they are not given a size.
// Footprint is the zero-gap union of the receiver and one handheld: 9.22 × 6.93 × 1.65 in.
// The same row lists an Atlas MS-12C stand, 10 in base, 34–62 in tall. That stand is not
// drawn: Bob has not confirmed stands, mics, or this set on the floor plan.
// https://www.atlasied.com/ats/4131/MS-10C(CE)-&-MS-12C(CE)-Datasheet-RevB.pdf
export const MIC_RX_IN = { w: 7.76, d: 5.98, h: 1.65 };
export const MIC_HH_IN = { dia: 1.46, len: 6.93 };
export const MICSET_IN = { w: MIC_RX_IN.w + MIC_HH_IN.dia, d: Math.max(MIC_RX_IN.d, MIC_HH_IN.len), h: Math.max(MIC_RX_IN.h, MIC_HH_IN.dia) };
export const MICSET_NOTE = 'Unconfirmed size. Not confirmed for the floor plan.';
export const MICSET_FLAGS = [
  'Unconfirmed. Receiver is the Shure SLXD4 candidate, 7.76 × 5.98 × 1.65 in. Handheld is the SM58 candidate, 1.46 in diameter × 6.93 in. The footprint is those two parts with no gap between them.',
  'Lav and headset body sizes are not in missing-products.xlsx, so they are not drawn as sized parts.',
  'Bob has not confirmed that mics show on the floor plan. The Atlas MS-12C stand (10 in base, 34–62 in) is listed on the same row and is not a separate item.',
];

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const micIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="18" width="22" height="12" rx="1"/><rect x="30" y="16" width="8" height="16" rx="4" stroke="${O}"/><path d="M10 24h8" stroke="${T}"/></svg>`;

export function drawMicset(g, d) {
  const rx = mat('micRx', 0x2a3138);
  const face = mat('micRxFace', 0x1a1e24);
  const hand = mat('micHand', 0xc5c9d0);
  const band = mat('micBand', 0x1a1e24);
  const led = mat('micLed', hex(T), { emissive: 0x0a3a44 });
  const rw = d.w * (MIC_RX_IN.w / MICSET_IN.w);
  const hw = d.w - rw;
  const rd = d.d * (MIC_RX_IN.d / MICSET_IN.d);
  const hh = d.h * (MIC_HH_IN.dia / MICSET_IN.h);
  box(g, rw, d.h, rd, rx, -d.w / 2 + rw / 2, d.h / 2, 0).name = 'micReceiver';
  box(g, rw * 0.7, d.h * 0.28, 0.006, face, -d.w / 2 + rw / 2, d.h * 0.62, rd / 2 - 0.006);
  const lamp = cyl(g, Math.min(0.01, rw * 0.04), Math.min(0.01, rw * 0.04), 0.006, led, -d.w / 2 + rw * 0.72, d.h * 0.7, rd / 2 - 0.008, 8);
  lamp.rotation.x = Math.PI / 2;
  const mic = cyl(g, hw / 2, hw / 2, d.d, hand, d.w / 2 - hw / 2, hh / 2, 0, 16);
  mic.rotation.x = Math.PI / 2;
  mic.name = 'micHandheld';
  const grip = cyl(g, hw / 2 * 0.98, hw / 2 * 0.98, d.d * 0.28, band, d.w / 2 - hw / 2, hh / 2, d.d * 0.12, 12);
  grip.rotation.x = Math.PI / 2;
}

export const MICSET = product(52, 'micset', 'audio', 'Wireless mic set', MICSET_IN.w, MICSET_IN.d, MICSET_IN.h, 'micset', {
  snapsTo: ['top'], note: MICSET_NOTE, flags: MICSET_FLAGS, icon: micIcon(), draw: drawMicset, unconfirmed: true, showOnPlan: 'unconfirmed',
});
registerProduct(MICSET);
