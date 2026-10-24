import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, cyl, mat } from './geom.js';

// Generator. missing-products.xlsx: Honda EU7000is, handles folded, 33.4 × 27.6 × 28.4 in.
// Portable versus towable is UNCONFIRMED. Sits outside a closed room (mode wall, real depth).
export const GEN_NOTE = 'UNCONFIRMED portable versus towable. Candidate is a Honda EU7000is with the handles folded, 33.4 × 27.6 × 28.4 in. Sits outside a closed room, on the outer face of the wall. Power distribution stays inside; this unit stays outside.';

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const icon = `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="14" width="32" height="22" rx="2"/><path d="M14 36v4M34 36v4M16 14v-4h16v4"/><path d="M24 20l-4 6h6l-4 6" stroke="${O}"/><path d="M14 30h20" stroke="${T}"/></svg>`;

export function drawGenerator(g, d) {
  const body = mat('genBody', 0x3d4450);
  const rubber = mat('genRubber', 0x1a1d22);
  const yellow = mat('genStripe', 0xf2c230);
  const panel = mat('genPanel', 0x171b22);
  const handle = mat('genHandle', 0xc5ccd4);
  const lamp = mat('genLamp', hex(T), { emissive: 0x145868 });
  const bolt = mat('genBolt', hex(O));
  const lift = 0.22, handleH = 0.1;
  const bodyH = d.h - lift - handleH;
  box(g, d.w, bodyH, d.d, body, 0, lift + bodyH / 2, 0).name = 'genBody';
  box(g, d.w * 0.62, handleH, 0.08, handle, 0, d.h - handleH / 2, -d.d * 0.22).name = 'genHandle';
  box(g, d.w * 0.86, 0.07, 0.012, yellow, 0, lift + bodyH * 0.62, d.d / 2 - 0.01).name = 'genStripe';
  box(g, d.w * 0.32, bodyH * 0.42, 0.016, panel, d.w * 0.16, lift + bodyH * 0.48, d.d / 2 - 0.012).name = 'genPanel';
  box(g, 0.08, 0.1, 0.01, bolt, -d.w * 0.22, lift + bodyH * 0.7, d.d / 2 - 0.008);
  box(g, 0.05, 0.05, 0.012, lamp, d.w * 0.34, lift + bodyH * 0.72, d.d / 2 - 0.01);
  const wr = 0.11;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const wheel = cyl(g, wr, wr, 0.08, rubber, sx * (d.w / 2 - 0.24), wr, sz * (d.d / 2 - 0.26), 14);
    wheel.rotation.z = Math.PI / 2;
    wheel.name = 'genWheel';
  }
}

export const GEN = product(73, 'generator', 'power', 'Generator', 33.4, 27.6, 28.4, 'generator', {
  place: 'outside', wallDIn: 27.6, panelIn: 1,
  note: GEN_NOTE, icon, draw: drawGenerator, unconfirmed: true,
  flags: ['Portable versus towable is not confirmed. Envelope is the Honda EU7000is with handles folded, 33.4 × 27.6 × 28.4 in.', 'Indoors it sits outside the room, on the outer face of the wall. Outdoors it sits free on the ground.', 'Power distribution boxes stay inside the room. This unit stays outside.'],
});
registerProduct(GEN);
