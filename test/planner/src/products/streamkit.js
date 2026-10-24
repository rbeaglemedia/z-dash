import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Camera and live-streaming kit on a tripod. Code-drawn here. No third-party mesh.
// missing-products.xlsx "Camera & live streaming kit (camera on tripod)".
// Sheet size: 7.5 W × 16.5 D × 68.9 H in (H is the tripod maximum).
// Sony PXW-Z190 candidate and Manfrotto 504X twin-leg tripod. The sheet says the
// tripod spread footprint is not confirmed, so the legs stay inside this envelope.
// https://pro.sony/s3/2018/11/29115735/PXW-Z190_4-page_Brochure_V2_English_Oct2018.pdf
// https://www.manfrotto.com/global-en/504x-fluid-video-head-with-alu-twin-leg-tripod-gs-mvk504xtwinga/
// The sheet's page link is the microphones page ("Camera & Live Streaming Rentals"). No separate nav page.
export const STREAM_IN = { w: 7.5, d: 16.5, h: 68.9 };
export const STREAM_NOTE = 'Unconfirmed size. Tripod footprint is not confirmed.';
export const STREAM_FLAGS = [
  'Unconfirmed. missing-products.xlsx gives 7.5 × 16.5 × 68.9 in for a Sony PXW-Z190 on a Manfrotto 504X tripod. 68.9 in is the tripod maximum height. Confidence on the row is Medium.',
  'The tripod spread footprint is not in the sheet. Legs and the camera body are drawn inside the published envelope. No wider stance was invented.',
  'Rentacomputer.com has not confirmed which camera kit we rent.',
];

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const kitIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 40l8-24 8 24M18 34h12"/><rect x="14" y="8" width="16" height="10" rx="1" stroke="${O}"/><path d="M30 11h6v4h-6" stroke="${T}"/></svg>`;

export function drawStreamkit(g, d) {
  const poleM = mat('kitPole', 0x2a3038);
  const head = mat('kitHead', 0x1a1e24);
  const body = mat('kitBody', 0x12161c);
  const lens = mat('kitLens', 0x0c1016);
  const glass = mat('kitGlass', 0x1b3a55, { emissive: 0x0e2a44 });
  const tick = mat('kitTick', hex(T), { emissive: 0x0a3a44 });
  const r = Math.min(d.w, d.d) * 0.07;
  const poleH = d.h - r;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    cyl(g, r, r, poleH, poleM, sx * (d.w / 2 - r), poleH / 2, sz * (d.d / 2 - r), 8);
  }
  box(g, d.w - r * 2, r * 0.7, r * 0.7, poleM, 0, d.h * 0.32, 0);
  box(g, r * 0.7, r * 0.7, d.d - r * 2, poleM, 0, d.h * 0.32, 0);
  box(g, d.w * 0.62, r, d.d * 0.28, head, 0, d.h - r / 2, 0).name = 'streamHead';
  const bw = d.w * 0.7, bh = Math.min(d.h * 0.08, d.w * 0.45), bd = d.d * 0.36;
  const by = d.h - r - bh / 2;
  box(g, bw, bh, bd, body, 0, by, -d.d * 0.06).name = 'streamBody';
  const lensLen = d.d * 0.16;
  const lz = -d.d * 0.06 + bd / 2 + lensLen / 2;
  const glassM = cyl(g, bh * 0.22, bh * 0.26, lensLen, lens, 0, by, lz, 16);
  glassM.rotation.x = Math.PI / 2;
  const eye = cyl(g, bh * 0.12, bh * 0.12, 0.008, glass, 0, by, lz + lensLen / 2 - 0.006, 12);
  eye.rotation.x = Math.PI / 2;
  box(g, d.w * 0.16, 0.012, 0.012, tick, 0, by, -d.d * 0.06 - bd / 2 + 0.02);
}

export const STREAM = product(54, 'streamkit', 'tvs', 'Camera and live-streaming kit', STREAM_IN.w, STREAM_IN.d, STREAM_IN.h, 'streamkit', {
  note: STREAM_NOTE, flags: STREAM_FLAGS, icon: kitIcon(), draw: drawStreamkit, unconfirmed: true,
});
registerProduct(STREAM);
