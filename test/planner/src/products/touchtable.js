import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { ALL_ICONS } from '../icons.js';
import { addBox, addCyl, addScreen, inch, installShape, LAND_W_IN, LAND_H_IN, solid } from './screenface.js';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
ALL_ICONS.touchtable = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h36v6H6zM10 24v16M38 24v16"/><g stroke="${T}" fill="${T}33"><rect x="12" y="20" width="24" height="3.2" rx="0.4"/></g><g stroke="${O}"><path d="M16 16h16"/></g></svg>`;

// Envelope: Visionair-e 55 in Designer Interactive Touch Table, 71.0 x 35.6 x 29.0 in (L x W x H).
// https://www.visionair-e.com/alpha-touch-screen-tables-wall-panels
// One maker page. missing-products.xlsx still asks 55 or 65 in, table or tilt.
// 16:9 is that page's standard-size heading. The 55 in paragraph does not repeat it.
// Glass position, top thickness and leg size are not published. Legs and the top stay inside the envelope.
export const TOUCHTABLE_FLAGS = [
  'Rental model is not confirmed. missing-products.xlsx asks which touch table Rentacomputer.com rents (55 or 65 in, table or tilt). One manufacturer page only.',
  'Envelope 71.0 x 35.6 x 29.0 in (L x W x H) is the Visionair-e 55 in Designer Interactive Touch Table line on that page.',
  '16:9 is the page heading over the standard sizes, including 55 in. The 55 in paragraph does not repeat the aspect. Glass is the 55 in 16:9 area centered in the top. The page does not give the glass position.',
  'Top thickness and leg size are not published. They are drawn inside the published envelope. The page describes clear glass legs; the model uses a pale solid leg.',
];

const item = product(29, 'touchtable', 'kiosks', '55 in touchscreen table', 71, 35.6, 29, 'touchtable', {
  note: 'Candidate size (Visionair-e 55 in table). Model not confirmed.',
  flags: TOUCHTABLE_FLAGS,
});
registerProduct(item);

const TOP_T = 0.10; // visual only, flagged above. Not a measured top thickness.

installShape(item.w, item.h, item.d, (g) => {
  const { w, h, d } = item;
  const sw = inch(LAND_W_IN), sd = inch(LAND_H_IN), t = 0.012, bezel = 0.07;
  addBox(g, w, TOP_T, d, solid('tableTop', 0xf4f6f8), 0, h - TOP_T / 2, 0);
  addBox(g, sw + bezel * 2, 0.016, sd + bezel * 2, solid('tableBezel', 0x1a1e24), 0, h + 0.002, 0);
  addScreen(g, sw, t, sd, 0, h + 0.012, 0);
  const legH = h - TOP_T, ix = w / 2 - 0.34, iz = d / 2 - 0.28;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) addCyl(g, 0.055, legH, solid('tableLeg', 0xd5dee8), sx * ix, legH / 2, sz * iz);
  addBox(g, w * 0.22, 0.012, 0.02, solid('tableTick', hex(O)), 0, h - TOP_T - 0.02, d / 2 - 0.02);
});
