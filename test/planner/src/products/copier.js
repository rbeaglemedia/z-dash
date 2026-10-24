import { registerProduct } from '../register.js';
import { product } from './create.js';
import { ft, group, box, finish, icon, white, dark, black, teal } from './draw.js';

// missing-products.xlsx — Copier / multifunction printer.
// Canon imageRUNNER ADVANCE DX C5840i, 24.375 × 28.5 × 36.875 in (maker spec).
// Bob has not confirmed this model. Control-panel size is not published, so no video screen is named.
const W_IN = 24.375, D_IN = 28.5, H_IN = 36.875;

function mesh() {
  const g = group();
  const w = ft(W_IN), d = ft(D_IN), h = ft(H_IN);
  box(g, w, h - 0.08, d - 0.02, white(), 0, (h - 0.08) / 2, -0.01);
  box(g, w * 0.94, 0.08, d * 0.84, dark(), 0, h - 0.04, -d * 0.02);
  box(g, w * 0.62, h * 0.07, 0.012, black(), 0, h * 0.7, d / 2 - 0.008);
  box(g, w * 0.4, 0.035, 0.01, teal(), 0, h * 0.6, d / 2 - 0.008);
  for (const k of [0.22, 0.36, 0.5]) box(g, w * 0.78, 0.02, 0.01, dark(), 0, h * k, d / 2 - 0.008);
  return finish(g);
}

registerProduct(product(43, 'copier', 'computers', 'Copier / multifunction printer', W_IN, D_IN, H_IN, 'copier', {
  snapsTo: ['nearwall'],
  unconfirmed: true,
  note: 'Unconfirmed model. Canon imageRUNNER ADVANCE DX C5840i, 24.375 × 28.5 × 36.875 in, from the maker spec in missing-products.xlsx.',
  gaps: [
    'Which copier model is rented is still open. This is the candidate in missing-products.xlsx.',
    'Control-panel size is not published. The front panel is a drawing inside the body and is not a video screen.',
  ],
  sources: ['https://oip.manual.canon/USRMA-5488-zz-CS-5800-enUS/contents/devu-int-dev_spec-main_unit.html'],
  parts: { body: { wIn: W_IN, dIn: D_IN, hIn: H_IN } },
  mesh,
  icon: icon('<rect x="8" y="6" width="32" height="36" rx="2"/><path d="M12 14h24M14 32h20M14 36h20" stroke="{{T}}"/><rect x="14" y="18" width="20" height="8" rx="1" stroke="{{O}}"/>'),
}));
