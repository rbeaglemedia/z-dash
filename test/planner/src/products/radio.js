import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Two-way radio. missing-products.xlsx: Motorola CP200d, 2.4 × 1.7 × 5 in.
// Staff-desk add-on (snaps onto a counter or table top).
// Bob has not confirmed whether radios show on the plan.
export const RADIO_NOTE = 'UNCONFIRMED. Bob has not confirmed whether radios show on the plan. Candidate is a Motorola CP200d handheld, 2.4 × 1.7 × 5 in. Sits on a staff desk.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="16" y="10" width="16" height="30" rx="2"/><path d="M22 8h4v4"/><path d="M19 16h10" stroke="${T}"/><circle cx="24" cy="28" r="3" stroke="${O}"/></svg>`;

export function drawRadio(g, d) {
  const body = mat('radioBody', 0x2a3038);
  const screen = mat('radioScreen', hex(T), { emissive: 0x0e3a4a });
  const btn = mat('radioBtn', hex(O));
  const ant = mat('radioAnt', 0xd5dbe3);
  const stub = 0.045;
  const bodyH = d.h - stub;
  box(g, d.w, bodyH, d.d, body, 0, bodyH / 2, 0).name = 'radioBody';
  box(g, d.w * 0.62, bodyH * 0.22, 0.008, screen, 0, bodyH * 0.72, d.d / 2 - 0.006).name = 'radioScreen';
  cyl(g, 0.012, 0.012, 0.01, btn, 0, bodyH * 0.42, d.d / 2 - 0.004, 10).rotation.x = Math.PI / 2;
  const antenna = cyl(g, 0.01, 0.01, stub, ant, d.w / 2 - 0.03, bodyH + stub / 2, 0, 8);
  antenna.name = 'radioAntenna';
}

export const RADIO = product(76, 'radio', 'audio', 'Two-way radio', 2.4, 1.7, 5, 'radio', {
  snapsTo: ['top'], note: RADIO_NOTE, icon, draw: drawRadio, unconfirmed: true,
  flags: ['Bob has not confirmed whether radios show on the plan.', 'Candidate is a Motorola CP200d handheld, 2.4 × 1.7 × 5 in.', 'Staff-desk add-on. It sits on a counter or table top.'],
});
registerProduct(RADIO);
