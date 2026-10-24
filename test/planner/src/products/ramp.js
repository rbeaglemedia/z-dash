import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// Cable ramp. missing-products.xlsx: Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in.
// Which ramp is rented is UNCONFIRMED. Sections snap end to end along the 36 in side.
export const RAMP_NOTE = 'UNCONFIRMED which ramp is rented. Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in. Sections snap end to end along the 36 in side.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 34h36l-6-12H12z"/><path d="M14 28h4M22 28h4M30 28h4" stroke="${O}"/><path d="M8 38h32" stroke="${T}"/></svg>`;

export function drawRamp(g, d) {
  const body = mat('rampBody', 0xf2c230);
  const groove = mat('rampGroove', 0x2a2418);
  const tick = mat('rampTick', hex(O));
  const edge = mat('rampEdge', hex(T));
  box(g, d.w, d.h, d.d, body, 0, d.h / 2, 0).name = 'rampBody';
  const gap = d.d / 5;
  for (let i = 0; i < 5; i++) {
    const z = -d.d / 2 + gap * (i + 0.5);
    box(g, d.w * 0.9, d.h * 0.28, gap * 0.42, groove, 0, d.h - d.h * 0.14, z).name = 'rampGroove';
  }
  box(g, 0.08, d.h * 0.4, d.d * 0.7, tick, 0, d.h * 0.45, 0);
  box(g, d.w * 0.2, 0.012, 0.04, edge, 0, d.h - 0.008, 0);
}

export const RAMP = product(75, 'ramp', 'power', 'Cable ramp', 36, 20, 2.31, 'ramp', {
  place: 'end', note: RAMP_NOTE, icon, draw: drawRamp, unconfirmed: true,
  flags: ['Which ramp Rentacomputer.com rents is not confirmed.', 'Envelope is the Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in.', 'Sections snap end to end along the 36 in side, with other cable ramps only.'],
});
registerProduct(RAMP);
