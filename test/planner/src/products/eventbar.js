import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND } from '../brand.js';
import { box, mat } from './geom.js';

// Event bar. missing-products.xlsx candidate: CORT Posh 6 ft bar, 72 × 30 × 40.25 in.
// https://www.cortevents.com/posh-6-bar
// Bob has not confirmed that Rentacomputer.com rents bars. Generic shape. No maker marks. Code-drawn.
export const EVENTBAR_NOTE = 'UNCONFIRMED. Bob has not confirmed that Rentacomputer.com rents bars. missing-products.xlsx asks: Do we rent bars? Which model? Size is the CORT Posh 6 ft bar candidate, 72 × 30 × 40.25 in.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const eventBarIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 16h38v6H5z"/><path d="M8 22v16M40 22v16M8 32h32" stroke="${O}"/><path d="M12 26h10" stroke="${T}"/></svg>`;

export function drawEventBar(g, d) {
  const chrome = mat('ebarChrome', 0xc9ced6);
  const panel = mat('ebarPanel', 0xf6f4ef);
  const top = mat('ebarTop', 0x1a1e24);
  const post = 0.07;
  box(g, d.w, 0.08, d.d, top, 0, d.h - 0.04, 0).name = 'eventBarTop';
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, post, d.h - 0.08, post, chrome, sx * (d.w / 2 - post / 2), (d.h - 0.08) / 2, sz * (d.d / 2 - post / 2));
  box(g, d.w - post * 2, d.h * 0.62, 0.04, panel, 0, d.h * 0.36, d.d / 2 - 0.06);
  box(g, d.w - 0.4, 0.04, d.d * 0.5, chrome, 0, d.h * 0.45, -0.04);
  box(g, d.w - 0.3, 0.035, 0.035, chrome, 0, 0.35, d.d / 2 - 0.08);
}

export const EVENTBAR = product(64, 'eventbar', 'counters', 'Event bar', 72, 30, 40.25, 'eventbar', {
  topIn: 40.25, snapsTo: ['nearwall'], note: EVENTBAR_NOTE, icon: eventBarIcon(), draw: drawEventBar, unconfirmed: true,
});
registerProduct(EVENTBAR);
