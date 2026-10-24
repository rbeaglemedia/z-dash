import { registerProduct } from '../register.js';
import { product } from './create.js';
import { ft, group, box, addScreen, finish, icon, black, metal, dark, bezel, teal } from './draw.js';

// missing-products.xlsx — Desktop computer (tower + monitor).
// Tower: Dell OptiPlex Tower 7020, 6.06 × 11.5 × 12.77 in (manufacturer).
// Monitor: the existing catalog item (24 × 8 × 18 in), which is flagged — no confident source.
// The sheet does not publish a combined envelope or a gap. The two sit side by side with no gap.
const TOWER = { wIn: 6.06, dIn: 11.5, hIn: 12.77 };
const MONITOR = { wIn: 24, dIn: 8, hIn: 18, flagged: true };
const W_IN = MONITOR.wIn + TOWER.wIn, D_IN = TOWER.dIn, H_IN = MONITOR.hIn;

function mesh() {
  const g = group();
  const mon = { w: ft(MONITOR.wIn), d: ft(MONITOR.dIn), h: ft(MONITOR.hIn) };
  const tw = { w: ft(TOWER.wIn), d: ft(TOWER.dIn), h: ft(TOWER.hIn) };
  const w = ft(W_IN), d = ft(D_IN);
  const monX = -w / 2 + mon.w / 2, twX = w / 2 - tw.w / 2;
  const monZ = d / 2 - mon.d / 2, twZ = d / 2 - tw.d / 2;
  const pH = mon.h * 0.64, pW = mon.w * 0.94, pD = 0.07, pY = mon.h - pH / 2;
  box(g, mon.w, 0.05, mon.d * 0.9, metal(), monX, 0.025, monZ);
  box(g, 0.06, Math.max(0.08, pY - pH / 2 - 0.05), 0.05, metal(), monX, 0.05 + Math.max(0.08, pY - pH / 2 - 0.05) / 2, monZ + mon.d * 0.08);
  box(g, pW, pH, pD, bezel(), monX, pY, monZ + mon.d / 2 - pD / 2 - 0.03);
  addScreen(g, pW - 0.08, pH - 0.1, monX, pY, monZ + mon.d / 2 - 0.012);
  box(g, tw.w, tw.h, tw.d - 0.02, black(), twX, tw.h / 2, twZ - 0.01);
  box(g, tw.w * 0.72, tw.h * 0.5, 0.012, dark(), twX, tw.h * 0.55, d / 2 - 0.008);
  box(g, 0.04, 0.04, 0.01, teal(), twX, tw.h * 0.18, d / 2 - 0.008);
  return finish(g);
}

registerProduct(product(42, 'desktop', 'computers', 'Desktop computer (tower and monitor)', W_IN, D_IN, H_IN, 'desktop', {
  snapsTo: ['top'],
  unconfirmed: true,
  note: 'Unconfirmed bundle. Dell OptiPlex Tower 7020 is 6.06 × 11.5 × 12.77 in. The monitor is the existing flagged 24 × 8 × 18 in item, beside the tower with no gap.',
  gaps: [
    'Combined size is not in missing-products.xlsx. The sheet sizes the tower only and says "+ existing monitor item".',
    'Monitor 24 × 8 × 18 in is the existing catalog item and is flagged (no confident source).',
    'The monitor panel-versus-stand split is not published. The display is drawn inside that flagged envelope.',
    'No gap is published between tower and monitor. They are drawn touching.',
  ],
  sources: ['https://www.dell.com/support/manuals/en-us/optiplex-7020t-desktop/optiplex-tower-7020-owners-manual/dimensions-and-weight'],
  parts: { tower: TOWER, monitor: MONITOR },
  mesh,
  icon: icon('<rect x="3" y="8" width="28" height="18" rx="1.5"/><path d="M17 26v5M10 33h14" stroke="{{T}}"/><rect x="6" y="11" width="22" height="12" rx="1" stroke="{{O}}"/><rect x="34" y="14" width="10" height="22" rx="1"/>'),
}));
