import { registerProduct } from '../register.js';
import { product } from './create.js';
import { ft, group, box, addScreen, finish, icon, black, metal, dark, bezel, teal } from './draw.js';

// missing-products.xlsx — Large format TV (85–98 in).
// Drawn model: Samsung QM85C. Panel width 74.97 in, panel height 42.71 in.
// Stand STN-L6585C footprint 31.97 × 13.07 in. On-stand overall height is UNCONFIRMED.
// QM85C panel thickness is not in the sheet. The 3.8 in depth is the QM98T alternate and is not used.
// Wall-mount height is not published: on a wall the panel bottom sits on the floor.
// Wall collision depth uses the sourced stand depth because a wall thickness is not published.
const PANEL_W = 74.97, PANEL_H = 42.71, STAND_W = 31.97, STAND_D = 13.07;
const CABINET_D = 0.12; // drawing thickness only; QM85C panel depth is not published

function mesh(mode) {
  const g = group();
  const w = ft(PANEL_W), h = ft(PANEL_H), d = ft(STAND_D), sW = ft(STAND_W);
  if (mode === 'wall') {
    box(g, w, h, CABINET_D, bezel(), 0, h / 2, 0);
    addScreen(g, w - 0.12, h - 0.12, 0, h / 2, CABINET_D / 2 + 0.01);
    box(g, w * 0.35, h * 0.4, 0.04, metal(), 0, h / 2, -CABINET_D / 2 - 0.015);
    return finish(g);
  }
  const pZ = d / 2 - CABINET_D / 2 - 0.04;
  box(g, sW, 0.07, d, black(), 0, 0.035, 0);
  for (const sx of [-1, 1]) box(g, 0.08, h * 0.42, 0.08, dark(), sx * sW * 0.32, 0.07 + h * 0.21, pZ - CABINET_D / 2 - 0.05);
  box(g, w, h, CABINET_D, bezel(), 0, h / 2, pZ);
  addScreen(g, w - 0.14, h - 0.14, 0, h / 2, pZ + CABINET_D / 2 + 0.01);
  box(g, w * 0.22, 0.035, 0.008, teal(), 0, 0.12, pZ + CABINET_D / 2 + 0.014);
  return finish(g);
}

registerProduct(product(41, 'tv85', 'tvs', 'Large-format TV (85 in)', PANEL_W, STAND_D, PANEL_H, 'tv85', {
  snapsTo: ['wall'],
  panelIn: PANEL_H,
  wallDIn: STAND_D,
  mountCenterIn: PANEL_H / 2,
  unconfirmed: true,
  note: 'Unconfirmed on-stand height. Samsung QM85C panel 74.97 × 42.71 in, stand footprint 31.97 × 13.07 in. Panel thickness and wall-mount height are not published.',
  gaps: [
    'On-stand overall height is not published. Item height is the QM85C panel height 42.71 in. The panel is not raised on an unsourced pole.',
    'QM85C panel thickness is not in the sheet. The 3.8 in depth belongs to the QM98T alternate and is not used. The cabinet depth is a drawing thickness inside the 13.07 in stand.',
    'Wall-mount height is not published. On a wall the panel bottom sits at the floor.',
    'Wall collision depth uses the sourced stand depth 13.07 in because a wall-mount thickness is not published.',
    '98 in QM98T (86.5 × 3.8 × 49.24 in) is an alternate and is not the model drawn.',
  ],
  sources: [
    'https://knitec.com/pages/samsung-qm-c-series-specifications',
    'https://s7d9.scene7.com/is/content/techdata/Samsung-QM98T-CORP-Datasheetpdf',
  ],
  parts: { panel: { wIn: PANEL_W, hIn: PANEL_H }, stand: { wIn: STAND_W, dIn: STAND_D } },
  mesh,
  icon: icon('<rect x="3" y="10" width="42" height="24" rx="1.5"/><path d="M14 34v6M34 34v6M12 42h24" stroke="{{T}}"/><rect x="7" y="14" width="34" height="16" rx="1" stroke="{{O}}"/>'),
}));
