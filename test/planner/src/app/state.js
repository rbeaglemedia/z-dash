// Lane: save / load / undo, plus the shared room state.
import { ESP } from './runtime.js';
import { BRAND, hex } from '../brand.js';
import { SAVE_KEY, LEGACY_SAVE_KEYS, deserialize } from '../grid.js';
import { createHistory } from '../history.js';
import { TECH_DEFAULT } from '../fun.js';












// ---------- error capture (shown in the hidden debug overlay: triple-tap the version label) ----------
ESP.DBG = { err: '', lost: 0, restored: 0, crashes: 0 };
ESP.noteErr = (e) => { ESP.DBG.err = new Date().toLocaleTimeString() + '  ' + ((e && (e.stack || e.message)) || String(e)); };
addEventListener('error', (e) => ESP.noteErr(e.error || e.message)); addEventListener('unhandledrejection', (e) => ESP.noteErr(e.reason));







ESP.sim = null, ESP.simG = null, ESP.lastEvent = null, ESP.simLast = 0; // v3.12 event simulation state

ESP.HL = hex(BRAND.colors.highlight), ESP.AC = hex(BRAND.colors.accent);
ESP.$ = (s) => document.querySelector(s), ESP.$$ = (s) => [...document.querySelectorAll(s)];
ESP.S = { env: 'indoor', walls: [], items: [], mute: false, preset: '30x40', venue: null, fill: null, lvl: 1, levels: {}, tech: TECH_DEFAULT }; // v3.30 tech level for presets (Showcase preselected)
ESP.selDoor = null, ESP.active = null, ESP.selSeg = null, ESP.rub = null, ESP.tool = 'view', ESP.lock = { axis: null }, ESP.boxA = null, ESP.boxIdx = null, ESP.wasAligned = false; // polyline being drawn, selected wall segment, rubber-band end point
ESP.topDown = false, ESP.panMode = false, ESP.wallsView = 'low', ESP.stamp = null, ESP.picker = false, ESP.pendEdit = null, ESP.push = null, ESP.editPi = null, ESP.editGood = true, ESP.preTop = null; // v3.8 view switches, Same again / keep placing, confirm-or-cancel edits
ESP.W = { get env() { return ESP.S.env; }, get walls() { return ESP.S.walls; }, get items() { return ESP.S.items; }, set items(v) { ESP.S.items = v; }, get cols() { return ESP.S.venue ? ESP.S.venue.cols : []; }, get fill() { return ESP.S.fill; } };
ESP.loadSaved = () => { try { return deserialize(localStorage.getItem(SAVE_KEY) || LEGACY_SAVE_KEYS.map((k) => localStorage.getItem(k)).find(Boolean) || null); } catch (e) { return null; } };
ESP.saveT = 0; ESP.save = () => { clearTimeout(ESP.saveT); ESP.saveT = setTimeout(ESP.saveNow, 300); if (ESP.H.record(ESP.snap())) ESP.histUI(); };
ESP.H = createHistory(); ESP.snap = () => JSON.stringify({ env: ESP.S.env, walls: ESP.S.walls, items: ESP.S.items, venue: ESP.S.venue, fill: ESP.S.fill, lvl: ESP.S.lvl, levels: ESP.S.levels, active: ESP.active }); // every action calls save(), so every real change becomes one undo step
ESP.histUI = function histUI() { ESP.$$('.hUndo').forEach((b) => (b.disabled = !ESP.H.canUndo)); ESP.$$('.hRedo').forEach((b) => (b.disabled = !ESP.H.canRedo)); }
ESP.restore = function restore(js) { if (!js) return; if (typeof ESP.simStop === 'function') ESP.simStop(); const o = JSON.parse(js); ESP.S.env = o.env; ESP.S.walls = o.walls; ESP.S.items = o.items; ESP.S.venue = o.venue || null; ESP.S.fill = o.fill || null; ESP.S.lvl = Number.isInteger(o.lvl) ? o.lvl : 1; ESP.S.levels = o.levels || {}; if (typeof ESP.renderPresets === 'function') ESP.renderPresets(); ESP.active = o.active != null && ESP.S.walls[o.active] && !ESP.S.walls[o.active].closed ? o.active : null;
  ESP.rub = null; ESP.selSeg = null; ESP.selDoor = null; ESP.corner = null; ESP.draw = null; ESP.push = null; ESP.pendEdit = null; ESP.editPi = null; ESP.editGood = true; ESP.confirmUI(); ESP.boxA = ESP.boxIdx = null; ESP.drag = null; ESP.S.preset = null; ESP.renderPresets(); ESP.select(null); ESP.applyEnv(); ESP.syncItems(); clearTimeout(ESP.saveT); ESP.saveT = setTimeout(ESP.saveNow, 300); ESP.histUI(); ESP.rebuildSoon(); } // removed item meshes are disposed by syncItems; walls reuse one shared box
ESP.undo = function undo() { if (ESP.pendEdit) return ESP.cancelEdit(); const s1 = ESP.H.undo(); if (s1) { ESP.restore(s1); ESP.sTile(false); ESP.toast('Undone'); } }
ESP.redo = function redo() { ESP.commitEdit(); const s1 = ESP.H.redo(); if (s1) { ESP.restore(s1); ESP.sTile(true); ESP.toast('Redone'); } }
ESP.histReset = () => { ESP.H.reset(ESP.snap()); ESP.histUI(); };
// ---------- v3.8 confirm or cancel a room edit on touch (Box, corner drag, wall push) ----------
ESP.beginEdit = function beginEdit() { ESP.commitEdit(); return { walls: JSON.stringify(ESP.S.walls), items: JSON.stringify(ESP.S.items), preset: ESP.S.preset }; }
ESP.putBack = (b) => { ESP.S.walls = JSON.parse(b.walls); ESP.S.preset = b.preset; if (b.items) { ESP.S.items = JSON.parse(b.items); ESP.syncItems(); } };
ESP.finishEdit = function finishEdit(before, touch, msg) { // a bad shape is put back; on touch a good one waits for the check or the cross; with a mouse it is kept at once
  if (!ESP.editGood) { ESP.putBack(before); ESP.editPi = null; ESP.editGood = true; ESP.renderPresets(); ESP.buildUI(); ESP.rebuildSoon(); ESP.sBad(); return ESP.toast("That doesn't fit, so it was put back"); }
  if (touch) { ESP.pendEdit = before; ESP.confirmUI(); ESP.S.preset = null; ESP.renderPresets(); ESP.buildUI(); ESP.rebuildSoon(); if (msg) ESP.toast(msg + ' · tap ✓ to keep it'); return; }
  ESP.editPi = null; ESP.wallsChanged(); if (msg) ESP.toast(msg); }
ESP.commitEdit = function commitEdit() { if (!ESP.pendEdit) return; ESP.pendEdit = null; ESP.editPi = null; ESP.confirmUI(); ESP.wallsChanged(); }
ESP.cancelEdit = function cancelEdit() { if (!ESP.pendEdit) return; ESP.putBack(ESP.pendEdit); ESP.pendEdit = null; ESP.editPi = null; ESP.editGood = true; ESP.active = null; ESP.selSeg = null; ESP.selDoor = null; ESP.confirmUI(); ESP.renderPresets(); ESP.buildUI(); ESP.rebuildSoon(); ESP.sTile(false); ESP.toast('Change cancelled'); }
ESP.confirmUI = function confirmUI() { const c = ESP.$('#confirm'); if (c) c.classList.toggle('hidden', !ESP.pendEdit); }
