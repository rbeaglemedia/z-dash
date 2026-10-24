import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// Interpretation booth. missing-products.xlsx: ISO 4043 mobile booth, 2 interpreters.
// Envelope is the INTERNAL minimum 63 × 63 × 79 in. Exterior size is UNCONFIRMED.
// Bob has not confirmed booths versus receivers only. Sits against a wall.
export const IBOOTH_NOTE = 'UNCONFIRMED. Bob has not confirmed interpretation booths versus receivers only. Envelope is the ISO 4043 internal minimum for two interpreters, 63 × 63 × 79 in. Exterior size is not confirmed.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 40V14h32v26"/><path d="M8 18h32M24 18v22"/><path d="M14 26h6v8h-6z" stroke="${T}"/><path d="M28 24h8" stroke="${O}"/></svg>`;

export function drawIbooth(g, d) {
  const wall = mat('iboothWall', 0xe7e2d6);
  const trim = mat('iboothTrim', hex(O));
  const glass = mat('iboothGlass', hex(T), { transparent: true, opacity: 0.55 });
  const floor = mat('iboothFloor', 0x2a3140);
  const t = 0.12;
  const sideH = d.h - t - 0.06;
  const sideY = 0.06 + sideH / 2;
  box(g, d.w, 0.06, d.d, floor, 0, 0.03, 0).name = 'iboothFloor';
  box(g, d.w, t, d.d, wall, 0, d.h - t / 2, 0).name = 'iboothRoof';
  box(g, d.w, sideH, t, wall, 0, sideY, -d.d / 2 + t / 2).name = 'iboothBack';
  box(g, t, sideH, d.d - t, wall, -d.w / 2 + t / 2, sideY, t / 2).name = 'iboothSide';
  box(g, t, sideH, d.d - t, wall, d.w / 2 - t / 2, sideY, t / 2);
  const doorW = Math.min(2.2, d.w * 0.4);
  const doorH = Math.min(sideH * 0.86, sideH - 0.4);
  const frontZ = d.d / 2 - t / 2;
  const sideW = (d.w - doorW) / 2;
  const headerH = sideH - doorH;
  box(g, sideW, sideH, t, wall, -d.w / 2 + sideW / 2, sideY, frontZ).name = 'iboothFront';
  box(g, sideW, sideH, t, wall, d.w / 2 - sideW / 2, sideY, frontZ);
  if (headerH > 0.05) box(g, doorW, headerH, t, wall, 0, 0.06 + doorH + headerH / 2, frontZ);
  box(g, sideW * 0.5, 1.05, 0.02, glass, d.w / 2 - sideW / 2, d.h * 0.62, d.d / 2 - 0.01).name = 'iboothWindow';
  box(g, 0.06, sideH * 0.9, d.d * 0.5, trim, 0, sideY, -d.d * 0.1).name = 'iboothDivider';
  box(g, d.w * 0.55, 0.035, 0.015, trim, 0, d.h - t - 0.03, frontZ);
}

export const IBOOTH = product(77, 'ibooth', 'decor', 'Interpretation booth', 63, 63, 79, 'ibooth', {
  snapsTo: ['nearwall'], note: IBOOTH_NOTE, icon, draw: drawIbooth, unconfirmed: true,
  flags: ['Bob has not confirmed interpretation booths versus receivers only.', 'Envelope is the ISO 4043 internal minimum for two interpreters, 63 × 63 × 79 in. Exterior size is not confirmed.', 'Sits against a wall.'],
});
registerProduct(IBOOTH);
