import { registerProduct } from '../register.js';
import { product } from './create.js';
import { BRAND, hex } from '../brand.js';
import { box, mat } from './geom.js';

// Audio mixer on a table (front of house). Code-drawn here. No third-party mesh.
// missing-products.xlsx "Mixer / audio console + subwoofer".
// The W × D × H columns are the mixer, not the subwoofer: 24.84 × 20.16 × 8.39 in.
// Behringer X32 Compact candidate (retailer listing; the sheet marks the mixer Medium).
// https://www.musiciansfriend.com/pro-audio/behringer-x32-compact-40-channel-digital-mixer/h98028000000000
// https://www.rentacomputer.com/rentals/audio-visual/sound-systems
// The sheet asks whether this sits on a 6 ft table. It snaps onto a table top. It is not a table.
export const MIXER_IN = { w: 24.84, d: 20.16, h: 8.39 };
export const MIXER_NOTE = 'Unconfirmed size. Sits on a table (front of house).';
export const MIXER_FLAGS = [
  'Unconfirmed. missing-products.xlsx lists a Behringer X32 Compact candidate, 24.84 × 20.16 × 8.39 in, from a retailer listing (Medium). Rentacomputer.com has not confirmed the mixer.',
  'The sheet asks whether the mixer sits on a 6 ft table at the back of the room. This item snaps onto a table top. It does not include its own table.',
];

const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const mixerIcon = () => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="14" width="40" height="22" rx="2"/><path d="M10 28v6M16 24v10M22 26v8M28 22v12" stroke="${O}"/><rect x="32" y="18" width="8" height="6" rx="1" stroke="${T}"/></svg>`;

export function drawMixer(g, d) {
  const body = mat('mixerBody', 0x1c2128);
  const deck = mat('mixerDeck', 0x2c3440);
  const fader = mat('mixerFader', 0xd5dbe3);
  const screen = mat('mixerScreen', 0x143044, { emissive: 0x0c3048 });
  const tick = mat('mixerTick', hex(T), { emissive: 0x0a3a44 });
  // Housing is the candidate envelope. Knobs, faders and the screen sit inside it.
  box(g, d.w, d.h, d.d, body, 0, d.h / 2, 0).name = 'mixerBody';
  const deckH = d.h * 0.22;
  box(g, d.w * 0.92, deckH, d.d * 0.62, deck, 0, d.h - 0.012 - deckH / 2, d.d * 0.1);
  box(g, d.w * 0.26, d.h * 0.28, d.d * 0.2, screen, -d.w * 0.28, d.h * 0.62, -d.d * 0.26);
  for (let i = 0; i < 8; i++) {
    const x = -d.w * 0.08 + i * (d.w * 0.055);
    box(g, d.w * 0.012, d.h * 0.2, d.d * 0.22, fader, x, d.h * 0.62, d.d * 0.16);
  }
  box(g, d.w * 0.16, 0.012, 0.012, tick, d.w * 0.32, d.h * 0.55, d.d / 2 - 0.02);
}

export const MIXER = product(50, 'mixer', 'audio', 'Audio mixer', MIXER_IN.w, MIXER_IN.d, MIXER_IN.h, 'mixer', {
  snapsTo: ['top'], note: MIXER_NOTE, flags: MIXER_FLAGS, icon: mixerIcon(), draw: drawMixer, unconfirmed: true,
});
registerProduct(MIXER);
