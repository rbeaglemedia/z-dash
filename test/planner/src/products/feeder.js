import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { cyl, mat } from './geom.js';

// Feeder cable section. missing-products.xlsx gives the cable ramp only (36 × 20 × 2.31 in).
// No sourced cable diameter or length. This section uses that ramp's 36 in length and 2.31 in
// height for both depth and height so a run lines up with the ramps. Not a sourced cable size.
export const FEEDER_NOTE = 'UNCONFIRMED cable size. The sheet gives the cable ramp only. This section uses that ramp\'s 36 in length and 2.31 in height for both depth and height so a run lines up with the ramps. It is not a sourced cable diameter or length. Sections snap end to end with other feeder cables.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 30c6-10 10-10 16 0s10 10 16 0"/><path d="M8 18h8M32 18h8" stroke="${O}"/><path d="M22 34h6" stroke="${T}"/></svg>`;

export function drawFeeder(g, d) {
  const rubber = mat('feederRubber', 0x23262c);
  const band = mat('feederBand', hex(O));
  const tick = mat('feederTick', hex(T));
  const rad = d.h / 2;
  const cable = cyl(g, rad, rad, d.w, rubber, 0, rad, 0, 18);
  cable.rotation.z = Math.PI / 2;
  cable.name = 'feederCable';
  const stripe = cyl(g, rad * 0.9, rad * 0.9, d.w * 0.14, band, 0, rad, 0, 16);
  stripe.rotation.z = Math.PI / 2;
  stripe.name = 'feederBand';
  const mark = cyl(g, rad * 0.55, rad * 0.55, 0.04, tick, d.w * 0.28, rad, 0, 12);
  mark.rotation.z = Math.PI / 2;
}

export const FEEDER = product(74, 'feeder', 'power', 'Feeder cable', 36, 2.31, 2.31, 'feeder', {
  place: 'end', note: FEEDER_NOTE, icon, draw: drawFeeder, unconfirmed: true,
  flags: ['No sourced cable diameter or length. The sheet only lists the cable ramp.', 'Section length is the ramp\'s 36 in. Depth and height are the ramp\'s 2.31 in so the run lines up. This is not a sourced cable size.', 'Sections snap end to end with other feeder cables only.'],
});
registerProduct(FEEDER);
