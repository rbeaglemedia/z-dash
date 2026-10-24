import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// Event tent. missing-products.xlsx: 20 × 20 ft high-peak frame tent, 8 ft legs, peak 16 ft 9 in.
// Bob has not confirmed tents, or which sizes. Outdoor use. Placement indoors is not blocked.
export const TENT_NOTE = 'UNCONFIRMED. Bob has not confirmed tents, or which sizes to offer. Candidate is a 20 × 20 ft high-peak frame tent, 8 ft legs, peak 16 ft 9 in. Outdoor use.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 34L24 10l18 24H6z"/><path d="M8 40h32M14 34v6M34 34v6"/><path d="M24 10v24" stroke="${O}"/><path d="M16 34h16" stroke="${T}"/></svg>`;

const EAVE = 8;

export function drawTent(g, d) {
  const canvas = mat('tentCanvas', 0xf3f0e8);
  const poleM = mat('tentPole', 0xb7c0ca);
  const band = mat('tentBand', hex(O));
  const shade = mat('tentShade', 0xe4ebf3);
  const pr = 0.12;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(g, pr * 2, EAVE, pr * 2, poleM, sx * (d.w / 2 - pr), EAVE / 2, sz * (d.d / 2 - pr)).name = 'tentPole';
  }
  const bh = 0.12;
  box(g, d.w, bh, pr * 2, poleM, 0, EAVE - bh / 2, d.d / 2 - pr).name = 'tentEave';
  box(g, d.w, bh, pr * 2, poleM, 0, EAVE - bh / 2, -(d.d / 2 - pr));
  box(g, pr * 2, bh, d.d - pr * 4, poleM, d.w / 2 - pr, EAVE - bh / 2, 0);
  box(g, pr * 2, bh, d.d - pr * 4, poleM, -(d.w / 2 - pr), EAVE - bh / 2, 0);
  const vh = 1.1;
  const vy = EAVE - bh - vh / 2;
  box(g, d.w, vh, 0.04, canvas, 0, vy, d.d / 2 - 0.02).name = 'tentValance';
  box(g, d.w, vh, 0.04, canvas, 0, vy, -(d.d / 2 - 0.02));
  box(g, 0.04, vh, d.d - 0.08, canvas, d.w / 2 - 0.02, vy, 0);
  box(g, 0.04, vh, d.d - 0.08, canvas, -(d.w / 2 - 0.02), vy, 0);
  box(g, d.w * 0.46, 0.05, 0.012, band, 0, vy, d.d / 2 - 0.012);
  const rise = d.h - EAVE;
  const steps = 5;
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps;
    const y0 = EAVE + rise * t0;
    const y1 = EAVE + rise * ((i + 1) / steps);
    const ww = Math.max(0.3, d.w * (1 - t0) - 0.04);
    const dd = Math.max(0.3, d.d * (1 - t0) - 0.04);
    box(g, ww, y1 - y0, dd, i % 2 ? shade : canvas, 0, (y0 + y1) / 2, 0).name = 'tentRoof';
  }
  box(g, 0.2, rise, 0.2, poleM, 0, EAVE + rise / 2, 0).name = 'tentPeak';
  box(g, 0.55, 0.08, 0.55, band, 0, d.h - 0.04, 0);
}

export const TENT = product(72, 'tent', 'decor', 'Event tent', 240, 240, 201, 'tent', {
  note: TENT_NOTE, icon, draw: drawTent, unconfirmed: true,
  flags: ['Bob has not confirmed tents, or which sizes to offer.', 'Candidate is a 20 × 20 ft high-peak frame tent with 8 ft legs and a 16 ft 9 in peak.', 'Outdoor use. The planner does not block placing it indoors.'],
});
registerProduct(TENT);
