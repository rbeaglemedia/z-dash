import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { ALL_ICONS } from '../icons.js';
import { addBox, addScreen, inch, installShape, LAND_W_IN, LAND_H_IN, solid } from './screenface.js';

// Our own icon. Falls back through icons.js only if this id is missing.
const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
ALL_ICONS.touchkiosk = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="3" width="20" height="38" rx="1.5"/><path d="M10 44h28"/><g stroke="${T}" fill="${T}33"><rect x="17" y="7" width="14" height="24" rx="0.8"/></g><g stroke="${O}"><path d="M18 35h12"/></g></svg>`;

// Envelope: Peerless-AV KIPICT2555 spec, 34.00 x 75.06 x 19.00 in (W x H x D).
// https://files.focusedtechnology.com/libimages/peerless-kipict2555-spec.pdf
// missing-products.xlsx names the candidate "KIPICT555"; that sheet's URL is this KIPICT2555 spec.
// Glass is 55 in, 16:9, portrait. The spec does not locate the glass, so it is centered on the front.
export const TOUCHKIOSK_FLAGS = [
  'Rental model is not confirmed. missing-products.xlsx asks which touchscreen kiosk Rentacomputer.com rents.',
  'The spreadsheet candidate name is KIPICT555. The cited spec sheet is Peerless-AV KIPICT2555. The envelope is that spec: 34.00 x 75.06 x 19.00 in (W x H x D).',
  'Glass size is the spec 55 in diagonal at 16:9, turned portrait. The spec does not give the glass position. It is centered on the front of the published envelope.',
];

const item = product(28, 'touchkiosk', 'kiosks', '55 in touchscreen kiosk', 34, 19, 75.06, 'touchkiosk', {
  snapsTo: ['backwall', 'nearwall'],
  note: 'Candidate size (Peerless-AV KIPICT2555). Model not confirmed.',
  flags: TOUCHKIOSK_FLAGS,
});
registerProduct(item);

installShape(item.w, item.h, item.d, (g) => {
  const { w, h, d } = item;
  const sw = inch(LAND_H_IN), sh = inch(LAND_W_IN), t = 0.012, proud = 0.008;
  addBox(g, w, h, d, solid('kioskBody', 0x16191e), 0, h / 2, 0);
  addScreen(g, sw, sh, t, 0, h / 2, d / 2 - t / 2 + proud);
  const tickY = h / 2 - sh / 2 - 0.09;
  addBox(g, sw * 0.42, 0.022, 0.006, solid('kioskTick', hex(O)), 0, tickY, d / 2 + 0.004);
});
