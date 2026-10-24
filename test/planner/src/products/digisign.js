import { registerProduct } from '../register.js';
import { product } from './create.js';
import { ft, group, box, cyl, addScreen, finish, icon, black, metal, dark, rubber, teal, bezel } from './draw.js';

// missing-products.xlsx — Digital signage on a floor stand (TV on stand / agenda board).
// Samsung QM55C panel 48.7 × 1.1 × 27.9 in. Chief PFQUB cart base 36.1 W × 25.3 D.
// Column H is "UNCONFIRMED overall" (mount height depends on the cart setting).
// The model is only as tall as the panel. It does not invent a pole height.
const PANEL = { wIn: 48.7, dIn: 1.1, hIn: 27.9 };
const BASE = { wIn: 36.1, dIn: 25.3 };

function mesh() {
  const g = group();
  const w = ft(PANEL.wIn), d = ft(BASE.dIn), h = ft(PANEL.hIn), bW = ft(BASE.wIn);
  const pD = Math.min(PANEL.dIn / 12, d * 0.4);
  const pZ = d / 2 - pD / 2 - 0.03;
  box(g, bW, 0.06, d, dark(), 0, 0.03, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, 0.04, 0.05, rubber(), sx * (bW / 2 - 0.14), 0.025, sz * (d / 2 - 0.14));
  for (const sx of [-1, 1]) box(g, 0.05, h * 0.72, 0.05, metal(), sx * (w * 0.28), h * 0.36, pZ - pD / 2 - 0.04);
  box(g, w, h, pD, bezel(), 0, h / 2, pZ);
  addScreen(g, w - 0.1, h - 0.12, 0, h / 2 + 0.02, pZ + pD / 2 + 0.01);
  box(g, w * 0.28, 0.03, 0.008, teal(), 0, 0.1, pZ + pD / 2 + 0.012);
  return finish(g);
}

registerProduct(product(40, 'digisign', 'tvs', 'Digital signage on a floor stand', PANEL.wIn, BASE.dIn, PANEL.hIn, 'digisign', {
  snapsTo: ['nearwall'],
  unconfirmed: true,
  note: 'Unconfirmed overall height. Samsung QM55C panel 48.7 × 1.1 × 27.9 in on a Chief PFQUB base 36.1 × 25.3 in. Mount height is not published, so the model is only as tall as the panel.',
  gaps: [
    'Overall stand height is not in missing-products.xlsx (column H is UNCONFIRMED). Item height is the panel height 27.9 in only.',
    'Cart base thickness, pole height and caster size are not published. The 36.1 × 25.3 in base is a thin plate inside the panel height.',
    'Candidate model only. Bob has not confirmed the stand or portrait versus landscape. The panel proportions are landscape.',
  ],
  sources: [
    'https://www.samsung.com/latin_en/business/smart-signage/uhd-4k-signage/crystal-uhd-signage-qmc-lh55qmcebgcxgo/',
    'https://shop.ccisolutions.com/StoreFront/jsp/pdf/CHI-PFQUB_drawing.pdf',
  ],
  parts: { panel: PANEL, base: BASE },
  mesh,
  icon: icon('<rect x="8" y="6" width="32" height="20" rx="1.5"/><path d="M16 26v8M32 26v8M10 36h28M8 42h8M32 42h8" stroke="{{T}}"/><rect x="12" y="10" width="24" height="12" rx="1" stroke="{{O}}"/>'),
}));
