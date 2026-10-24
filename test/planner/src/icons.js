// Our own icons (inline SVG, drawn for this app), coloured from the brand config: light line art, highlight and accent.
import { BRAND } from './brand.js';
const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
const sv = (p) => `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const o = (p) => `<g stroke="${O}">${p}</g>`, t = (p) => `<g stroke="${T}">${p}</g>`, tf = (p) => `<g stroke="${T}" fill="${T}33">${p}</g>`;
const ICON = {
  table: sv('<path d="M5 19h38M9 19l-2 19M39 19l2 19M24 19v4"/>' + o('<path d="M5 19l3-5h32l3 5"/>')),
  conf: sv('<ellipse cx="24" cy="22" rx="18" ry="6"/><path d="M16 27v11M32 27v11"/>' + o('<path d="M12 38h8M28 38h8"/>')),
  round: sv('<ellipse cx="24" cy="16" rx="16" ry="5"/><path d="M8 16c0 8 1 16 3 22M40 16c0 8-1 16-3 22M11 38c8 2 18 2 26 0"/>' + o('<path d="M18 26v8"/>')),
  hightop: sv('<ellipse cx="24" cy="10" rx="10" ry="3"/><path d="M14 10c0 6 8 10 8 16s-4 10-8 12M34 10c0 6-8 10-8 16s4 10 8 12M14 38h20"/>' + o('<path d="M24 20v8"/>')),
  chair: sv('<path d="M15 6h18v16H15zM13 24h22l-2 4H15zM16 28l-2 14M32 28l2 14"/>' + o('<path d="M18 11h12"/>')),
  exec: sv('<path d="M16 5h16v17H16zM14 24h20M24 26v8M14 42l10-8 10 8M24 34v8"/>' + o('<path d="M12 20v6M36 20v6"/>')),
  stool: sv('<ellipse cx="24" cy="9" rx="9" ry="3"/><path d="M24 12v26M15 42h18"/>' + o('<ellipse cx="24" cy="28" rx="7" ry="2"/>')),
  lounge: sv('<path d="M8 20h32v6H8zM6 18v16h36V18M10 34v4M38 34v4M10 20v-6c0-2 2-3 4-3h20c2 0 4 1 4 3v6"/>' + o('<path d="M24 20v6"/>')),
  counter: sv('<path d="M5 13h38M7 13v25h34V13"/>' + o('<path d="M11 30h26"/>') + t('<path d="M11 19h26"/>')),
  tv: sv('<rect x="5" y="8" width="38" height="23" rx="2"/><path d="M24 31v7M15 40h18"/>' + tf('<rect x="9" y="12" width="30" height="15" rx="1"/>')),
  screen: sv('<path d="M7 7v35M41 7v35M7 9h34M7 32h34M4 42h6M38 42h6"/>' + o('<path d="M14 15h20"/>')),
  led: sv('<rect x="4" y="6" width="40" height="26"/><path d="M12 32v8M36 32v8M8 40h8M32 40h8"/>' + tf('<path d="M17.3 6v26M30.6 6v26M4 19h40"/>')),
  ledtrailer: sv('<rect x="8" y="4" width="32" height="18"/><path d="M24 22v8M6 30h34M44 34l-4-4"/><circle cx="16" cy="36" r="4"/><circle cx="28" cy="36" r="4"/>' + tf('<rect x="11" y="7" width="26" height="12"/>')),
  ledposter: sv('<rect x="17" y="3" width="14" height="36" rx="1"/><path d="M13 44h22M24 39v5"/>' + tf('<rect x="20" y="6" width="8" height="30"/>')),
  laptop: sv('<path d="M4 37h40l-3-5H7z"/><rect x="10" y="10" width="28" height="20" rx="2"/>' + tf('<rect x="13" y="13" width="22" height="14"/>')),
  ipad: sv('<rect x="14" y="5" width="20" height="28" rx="3" transform="rotate(8 24 19)"/><path d="M18 42h14M25 33l-2 9"/>' + tf('<rect x="17" y="9" width="14" height="20" rx="1" transform="rotate(8 24 19)"/>')),
  monitor: sv('<rect x="5" y="7" width="38" height="24" rx="2"/><path d="M24 31v7M16 40h16"/>' + tf('<rect x="9" y="11" width="30" height="16"/>')),
  kiosk: sv('<rect x="15" y="4" width="18" height="38" rx="2"/><path d="M11 44h26"/>' + tf('<rect x="18" y="8" width="12" height="18" rx="1"/>') + o('<path d="M18 34h12"/>')),
  tower: sv('<rect x="14" y="4" width="20" height="40" rx="2"/><path d="M18 12h12M18 16h12"/>' + t('<circle cx="24" cy="36" r="2"/>')),
  speaker: sv('<rect x="14" y="3" width="20" height="23" rx="2"/><circle cx="24" cy="17" r="5"/><path d="M24 26v10M24 36l-9 7M24 36l9 7"/>' + o('<circle cx="24" cy="8" r="1.5"/>')),
  podium: sv('<path d="M12 14h24l-2 28H14zM10 10l28 4M18 42h12"/>' + o('<path d="M17 24h14"/>')),
  powerbox: sv('<rect x="7" y="12" width="34" height="24" rx="3"/><path d="M14 8h20M12 40v-4M36 40v-4"/>' + o('<path d="M26 16l-6 9h8l-6 9"/>')),
  drape: sv('<path d="M6 6v36M42 6v36M6 7h36M3 42h6M39 42h6"/>' + o('<path d="M10 9c2 10 2 22 0 31M18 9c-2 10-2 22 0 31M26 9c2 10 2 22 0 31M34 9c-2 10-2 22 0 31"/>')),
  booth: sv('<path d="M6 12l12-6h24v24l-12 6M6 12v24h24M30 36V12M6 12h24M42 6L30 12"/>' + o('<path d="M14 18h12"/>')),
};
const BY_SHAPE = { table: 'table', round: 'round', chair: 'chair', stool: 'stool', lounge: 'lounge', counter: 'counter', tv: 'tv', screen: 'screen', led: 'led', ledtrailer: 'ledtrailer', ledposter: 'ledposter', laptop: 'laptop', ipad: 'ipad', monitor: 'monitor', kiosk: 'kiosk', tower: 'tower', speaker: 'speaker', podium: 'podium', powerbox: 'powerbox', drape: 'drape', booth: 'booth' };
export const itemIcon = (d) => d.icon || ICON[d.id] || ICON[BY_SHAPE[d.shape]] || ICON.table;
export const CAT_ICONS = { tables: ICON.table, seating: ICON.chair, counters: ICON.counter, tvs: ICON.tv, led: ICON.led, computers: ICON.laptop, kiosks: ICON.kiosk, audio: ICON.speaker, power: ICON.powerbox, decor: ICON.drape };
export const ALL_ICONS = ICON;
