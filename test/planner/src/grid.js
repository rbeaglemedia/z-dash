// Save / load (v3.3: walls instead of tiles). Pure, no DOM.
import { cleanItems } from './logic.js';
import { cleanWalls, wallsFromTiles } from './walls.js';
export const VERSION = '3.39';
export const SAVE_KEY = 'esp.layout.v3'; // brand-neutral storage key (v3.11)
export const LEGACY_SAVE_KEYS = ['rentourav.esp.v3']; // read once so layouts saved before v3.11 still open
export const SAVE_SCHEMA = 3;
export const MAX = 2000; // world extent in feet
function cleanNames(o) { const out = {}; if (!o || typeof o !== 'object') return out; for (const [k, v] of Object.entries(o)) if (typeof k === 'string' && typeof v === 'string' && v.trim()) out[k] = v.trim().slice(0, 40); return out; }
export function serialize(state) { return JSON.stringify({ schema: SAVE_SCHEMA, app: VERSION, env: state.env, walls: state.walls || [], items: state.items || [], mute: !!state.mute, venue: state.venue || null, fill: state.fill || null, lvl: Number.isInteger(state.lvl) ? state.lvl : 1, levels: state.levels || {}, tech: state.tech || 'showcase', presetNames: cleanNames(state.presetNames), saved: state.saved || Date.now() }); }
export function migrate(o) {
  if (!o || typeof o !== 'object') return null;
  if (!o.schema) o = { schema: 1, env: o.env || 'indoor', tiles: o.tiles || [], mute: !!o.mute };
  if (o.schema < 2) o = { ...o, schema: 2, items: [] };
  if (o.schema < 3) o = { ...o, schema: 3, walls: wallsFromTiles(o.tiles), migratedFromTiles: true };
  return o;
}
export const MIN_LVL = -3, MAX_LVL = 20; // v3.19 floors
export function cleanFloor(o) { const items = cleanItems(o.items), ids = new Set(items.map((i) => i.uid)); items.forEach((i) => { if (i.host && !ids.has(i.host)) { i.host = null; if (i.mode !== 'wall') i.mode = 'free'; } });
  return { walls: cleanWalls(o.walls), items, venue: o.venue && typeof o.venue === 'object' ? o.venue : null, fill: o.fill && typeof o.fill === 'object' && (Array.isArray(o.fill.booths) || Array.isArray(o.fill.seats)) ? o.fill : null }; }
export function deserialize(str) {
  let o; try { o = migrate(JSON.parse(str)); } catch (e) { return null; } if (!o) return null;
  const f = cleanFloor(o), lvl = Number.isInteger(o.lvl) && o.lvl >= MIN_LVL && o.lvl <= MAX_LVL ? o.lvl : 1, levels = {};
  if (o.levels && typeof o.levels === 'object') for (const [k, v] of Object.entries(o.levels)) { const n = +k; if (Number.isInteger(n) && n >= MIN_LVL && n <= MAX_LVL && n !== lvl && v && typeof v === 'object') { const c = cleanFloor(v); if (c.walls.length || c.items.length) levels[n] = c; } }
  return { env: o.env === 'outdoor' ? 'outdoor' : 'indoor', walls: f.walls, items: f.items, mute: !!o.mute, venue: f.venue, fill: f.fill, lvl, levels, tech: ['essentials', 'standard', 'showcase'].includes(o.tech) ? o.tech : 'showcase', presetNames: cleanNames(o.presetNames), saved: o.saved || 0, migrated: !!o.migratedFromTiles };
}
