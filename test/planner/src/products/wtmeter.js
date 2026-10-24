import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// Walk-through metal detector. missing-products.xlsx: CEIA HI-PE Multi-Zone candidate.
// 32.9 W × 26 D × 88.8 H in. Opening 28.3 W × 80.7 H in. Which model is rented is UNCONFIRMED.
export const WT_OPEN_W_IN = 28.3;
export const WT_OPEN_H_IN = 80.7;
export const WT_NOTE = 'UNCONFIRMED model. Walk-through metal detector sized from the CEIA HI-PE Multi-Zone candidate: 32.9 × 26 × 88.8 in, opening 28.3 × 80.7 in. Which detector Rentacomputer.com rents is not confirmed.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 42V10h24v32"/><path d="M12 14h24" stroke="${O}"/><path d="M18 22h4M26 28h4" stroke="${T}"/></svg>`;

export function drawWtmeter(g, d) {
  const body = mat('wtmeterBody', 0x2c3340);
  const panel = mat('wtmeterPanel', 0x1a1f28);
  const lamp = mat('wtmeterLamp', hex(T), { emissive: 0x145868 });
  const tick = mat('wtmeterTick', hex(O));
  const openW = WT_OPEN_W_IN / 12, openH = WT_OPEN_H_IN / 12;
  const uw = (d.w - openW) / 2;
  const hh = d.h - openH;
  box(g, uw, d.h, d.d, body, -d.w / 2 + uw / 2, d.h / 2, 0).name = 'wtmeterUpright';
  box(g, uw, d.h, d.d, body, d.w / 2 - uw / 2, d.h / 2, 0).name = 'wtmeterUpright';
  box(g, d.w, hh, d.d, body, 0, d.h - hh / 2, 0).name = 'wtmeterHeader';
  // Control housing stays inside the right upright so the walk-through stays open to the floor.
  box(g, uw * 0.72, 0.42, 0.04, panel, d.w / 2 - uw / 2, d.h * 0.38, d.d / 2 - 0.03).name = 'wtmeterPanel';
  box(g, uw * 0.28, 0.06, 0.012, lamp, d.w / 2 - uw / 2, d.h * 0.5, d.d / 2 - 0.02);
  box(g, d.w * 0.28, 0.04, 0.012, tick, 0, d.h - hh / 2, d.d / 2 - 0.01).name = 'wtmeterLamp';
}

export const WT = product(71, 'wtmeter', 'decor', 'Walk-through metal detector', 32.9, 26, 88.8, 'wtmeter', {
  note: WT_NOTE, icon, draw: drawWtmeter, unconfirmed: true,
  flags: ['Rental model is not confirmed. Envelope is the CEIA HI-PE Multi-Zone candidate, 32.9 × 26 × 88.8 in.', 'Walk-through opening is 28.3 in wide and 80.7 in tall, from that candidate spec.'],
});
registerProduct(WT);
