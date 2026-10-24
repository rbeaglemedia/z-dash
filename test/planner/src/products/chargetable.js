import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Phone charging table.
// UNCONFIRMED model. missing-products.xlsx gives the ChargeTech Hightop Power Table CT-300124,
// 23.6 × 23.6 × 43.3 in, which matches the maker sheet:
// https://chargetech.com/cdn/shop/files/Hightop_Power_Table_Spec_Sheet.pdf
// The same sheet row also lists a Pop-Up Power Table at 23.2 × 23.2 × 43.3 in (not re-measured here).
// Square top. A circular top is not confirmed. The pedestal diameter is not in the spec; only the outer size is.
// The candidate has cables and a wireless pad. This mesh shows a generic pad and four wells, not that brand's layout.
export const CHARGE_NOTE = 'UNCONFIRMED model. Size is the ChargeTech Hightop Power Table candidate, 23.6 × 23.6 × 43.3 in. A pop-up table at 23.2 × 23.2 × 43.3 in is also listed. Square top; a round top is not confirmed.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const chargeIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="10" width="32" height="8" rx="1"/><path d="M24 18v18M16 40h16"/><path d="M18 14h4M26 14h4" stroke="${O}"/><circle cx="24" cy="14" r="1.4" stroke="${T}"/></svg>`;

export function drawCharge(g, d) {
  const top = mat('chargeTop', 0xf4f1ea);
  const edge = mat('chargeEdge', 0x2a3240);
  const pad = mat('chargePad', hex(BRAND.colors.accent), { emissive: 0x0a3a44 });
  const well = mat('chargeWell', 0x1a2028);
  const topT = 1.5 / 12;
  box(g, d.w, topT, d.d, top, 0, d.h - topT / 2, 0).name = 'chargeTop';
  const baseT = 1 / 12, baseW = d.w * 0.62;
  box(g, baseW, baseT, baseW, edge, 0, baseT / 2, 0);
  cyl(g, 0.22, 0.26, d.h - topT - baseT, edge, 0, baseT + (d.h - topT - baseT) / 2, 0, 20);
  // Pad and wells sit on the top. A few hundredths of a foot keeps them visible without changing the table size.
  cyl(g, 0.16, 0.16, 0.02, pad, 0, d.h + 0.004, 0, 24);
  const reach = d.w * 0.28;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    cyl(g, 0.04, 0.04, 0.016, well, sx * reach, d.h + 0.002, sz * reach, 12);
  }
}

export const CHARGE = product(32, 'chargetable', 'tables', 'Phone charging table', 23.6, 23.6, 43.3, 'chargetable', {
  topIn: 43.3, note: CHARGE_NOTE, icon: chargeIcon(), draw: drawCharge, unconfirmed: true,
});
registerProduct(CHARGE);
