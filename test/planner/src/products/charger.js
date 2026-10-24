import { registerProduct } from '../register.js';
import { product } from './create.js';
import { ft, group, box, finish, icon, dark, black, metal, teal } from './draw.js';

// missing-products.xlsx — Charging locker.
// ChargeTech 8-bay UV charging locker CT-300119, 19 × 8 × 26 in.
// Retailer listings agree; the maker sheet was not opened. Medium confidence.
// Stand versus table is not confirmed. Placed on the floor against a wall.
// Bay opening size is not published. Eight doors are drawn 2 × 4 to show the bay count.
const W_IN = 19, D_IN = 8, H_IN = 26;

function mesh() {
  const g = group();
  const w = ft(W_IN), d = ft(D_IN), h = ft(H_IN);
  box(g, w, h, d - 0.02, dark(), 0, h / 2, -0.01);
  const cols = 2, rows = 4, gap = 0.03, m = 0.06;
  const dw = (w - m * 2 - gap) / cols, dh = (h - m * 2 - gap * (rows - 1)) / rows;
  const z = d / 2 - 0.01;
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
    const x = -w / 2 + m + dw / 2 + c * (dw + gap);
    const y = m + dh / 2 + r * (dh + gap);
    box(g, dw * 0.9, dh * 0.88, 0.012, black(), x, y, z);
    box(g, 0.02, dh * 0.22, 0.008, metal(), x + dw * 0.28, y, z + 0.004);
    box(g, 0.018, 0.018, 0.008, teal(), x - dw * 0.26, y + dh * 0.26, z + 0.004);
  }
  return finish(g);
}

registerProduct(product(44, 'charger', 'kiosks', 'Charging locker', W_IN, D_IN, H_IN, 'charger', {
  snapsTo: ['nearwall'],
  unconfirmed: true,
  note: 'Unconfirmed. ChargeTech 8-bay locker CT-300119, 19 × 8 × 26 in (retailer listings; maker sheet not opened). Floor unit against a wall; stand versus table is not confirmed.',
  gaps: [
    'Maker spec sheet was not opened. Size is from two retailer listings in missing-products.xlsx.',
    'Stand versus table is not confirmed. It is placed on the floor and can snap against a wall.',
    'Bay opening size and door layout are not published. Eight doors are drawn 2 × 4 inside the 19 × 8 × 26 in body.',
  ],
  sources: [
    'https://www.staples.com/chargetech-8-bay-charging-uv-disinfecting-locker-ct-300119/product_24467533',
    'https://chargetech.com/products/guardian-8-charging-locker',
  ],
  parts: { body: { wIn: W_IN, dIn: D_IN, hIn: H_IN }, bays: 8 },
  mesh,
  icon: icon('<rect x="10" y="4" width="28" height="40" rx="2"/><path d="M24 8v32M14 14h20M14 24h20M14 34h20" stroke="{{T}}"/><circle cx="18" cy="18" r="1.2" stroke="{{O}}"/>'),
}));
