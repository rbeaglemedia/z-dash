// Lane: event preset wiring. Layout math stays in src/fun.js and src/fill.js.
import { ESP } from './runtime.js';
import { BRAND } from '../brand.js';
import { SAVE_KEY, serialize } from '../grid.js';
import { wallBounds } from '../walls.js';
import { descendants } from '../logic.js';
import { eventLayout, EVENT_PRESETS, layoutSummary, TECH_LEVELS } from '../fun.js';
import { autoDoor } from '../autodoor.js';


// ---------- v3.9 event presets: one tap fills the room (one undo step, asks before replacing items) ----------
ESP.showEventPresets = function showEventPresets() { ESP.$('#sheet').classList.remove('hidden'); ESP.$('#sheet').classList.add('presetsheet'); ESP.$('#shBack').classList.add('hidden'); ESP.$('#shTitle').textContent = 'Event presets';
  ESP.$('#shBody').innerHTML = ESP.techRowHTML() + '<div class="catgrid">' + EVENT_PRESETS.map((p) => `<button class="cat evp" data-ev="${p.id}">${ESP.EV_ICONS[p.id]}<span>${p.name}</span><small>${p.note}</small></button>`).join('') + '</div>'; ESP.bindTechRow(); ESP.$$('.evp').forEach((b) => (b.onclick = () => ESP.useEventPreset(b.dataset.ev))); }
// v3.30 tech level: how much tech a preset adds. Essentials = furniture + minimal tech, Standard = about half, Showcase = the full list.
ESP.techRowHTML = () => `<div class="techrow" role="radiogroup" aria-label="Tech level"><b>Tech level</b><div class="seg">${TECH_LEVELS.map((l) => `<button class="tlv${l.id === ESP.S.tech ? ' on' : ''}" role="radio" aria-checked="${l.id === ESP.S.tech}" data-tech="${l.id}">${l.name}</button>`).join('')}</div><small id="techNote">${(TECH_LEVELS.find((l) => l.id === ESP.S.tech) || {}).note || ''}</small></div>`;
ESP.setTech = function setTech(id) { if (!TECH_LEVELS.some((l) => l.id === id)) return; ESP.S.tech = id; ESP.$$('.tlv').forEach((b) => { const on = b.dataset.tech === id; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }); const n = ESP.$('#techNote'); if (n) n.textContent = TECH_LEVELS.find((l) => l.id === id).note || ''; clearTimeout(ESP.saveT); ESP.saveT = setTimeout(ESP.saveNow, 300); }
ESP.bindTechRow = function bindTechRow() { ESP.$$('.tlv').forEach((b) => (b.onclick = () => ESP.setTech(b.dataset.tech))); }
// ---------- v3.27 region restored from the v3.27 build on 2026-10-21 (names re-derived; original comments were lost) ----------
// v3.28: every preset (layouts, registration, venue fills) goes through one path. Items a preset placed carry it.preset.
// When the active floor already has preset items (or a fill), ask: Replace current preset (preselected) / Add alongside / Cancel.
// Manual items always stay. Each apply is one save, so one undo step.
ESP.hasPreset = () => !!ESP.S.fill || ESP.S.items.some((i) => i.preset);
ESP.isFillKind = (kind) => !!ESP.S.venue && kind !== 'registration'; // v3.30: theater is a real layout outside venues
ESP.presetName = (kind) => ({ theater: 'Theater' }[kind] || (EVENT_PRESETS.find((p) => p.id === kind) || {}).name || kind);
ESP.useEventPreset = function useEventPreset(kind, mode) {
  if (!mode && ESP.hasPreset()) { ESP.presetAsk(kind); return 'ask'; }
  return ESP.isFillKind(kind) ? ESP.useVenueFill(kind, mode || 'add') : ESP.applyLayout(kind, mode || 'add');
}
ESP.dropPresetItems = function dropPresetItems() {
  const gone = new Set();
  for (const it of ESP.S.items) if (it.preset) { gone.add(it); for (const d of descendants(ESP.S.items, it)) gone.add(d); }
  ESP.S.items = ESP.S.items.filter((i) => !gone.has(i));
  return gone.size;
}
ESP.presetAsk = function presetAsk(kind) {
  ESP.closePresetAsk();
  const fillClash = ESP.isFillKind(kind) && !!ESP.S.fill, n = ESP.S.items.filter((i) => i.preset).length;
  const cur = ESP.S.fill ? (n ? `a room fill and ${n} preset item${n === 1 ? '' : 's'}` : 'a room fill') : `${n} preset item${n === 1 ? '' : 's'}`;
  const d = document.createElement('div'); d.id = 'presetAsk'; d.className = 'pask'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
  d.innerHTML = `<div class="paskbox"><b>${ESP.presetName(kind)} preset</b><p>This floor already has ${cur}. Items you placed yourself stay either way.</p>
    <label class="paskopt"><input type="radio" name="pask" value="replace" checked><span>Replace current preset</span></label>
    <label class="paskopt${fillClash ? ' off' : ''}"><input type="radio" name="pask" value="add"${fillClash ? ' disabled' : ''}><span>Add alongside${fillClash ? ' <small>(one room fill per floor)</small>' : ''}</span></label>
    <div class="paskbtns"><button id="paskCancel" class="pbtn">Cancel</button><button id="paskOk" class="pbtn on">Apply</button></div></div>`;
  document.body.appendChild(d);
  d.onclick = (e) => { if (e.target === d) ESP.closePresetAsk(); };
  ESP.$('#paskCancel').onclick = () => ESP.closePresetAsk();
  ESP.$('#paskOk').onclick = () => { const m = d.querySelector('input[name=pask]:checked').value; ESP.closePresetAsk(); ESP.useEventPreset(kind, m); };
  ESP.$('#paskOk').focus();
}
ESP.closePresetAsk = function closePresetAsk() { const d = ESP.$('#presetAsk'); if (d) d.remove(); }
ESP.applyLayout = function applyLayout(kind, mode) {
  const name = ESP.presetName(kind), items = eventLayout(kind, ESP.W, ESP.S.tech);
  if (!items.length) return ESP.sBad(), ESP.toast('This room is too small for that layout'), false;
  ESP.closeSheet(); ESP.endStamp(); ESP.select(null); ESP.lastEvent = kind;
  if (mode === 'replace') { ESP.dropPresetItems(); ESP.S.fill = null; }
  for (const it of items) it.preset = kind;
  ESP.S.items = [...ESP.S.items, ...items];
  for (const it of items) it.host || ESP.anim.set(it.uid, performance.now());
  const doorAdded = autoDoor(ESP.W);
  doorAdded && ESP.rebuild(); ESP.syncItems(); ESP.save(); ESP.sSnap();
  const b = wallBounds(ESP.S.walls);
  if (b) ESP.burst((b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2, 70);
  layoutSummary(items);
  ESP.toast(`${name} layout (${ESP.techName()}): ${items.length} items ${mode === 'replace' ? 'replaced the old preset' : 'added'}${doorAdded ? ' + a door' : ''} · Undo to take it back`); ESP.frame();
  return true;
}
ESP.EV_ICONS = Object.fromEntries(Object.entries({
    booth: '<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M6 38V12h16v26M26 38V12h16v26"/><path d="M10 30h8M30 30h8" stroke="#ff6a1a"/></svg>',
    classroom: '<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M18 8h12" stroke="#ff6a1a"/><path d="M8 18h12M28 18h12M8 28h12M28 28h12M8 38h12M28 38h12"/></svg>',
    banquet: '<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><circle cx="24" cy="24" r="9"/><g stroke="#2ce0c6"><circle cx="24" cy="9" r="2.5"/><circle cx="24" cy="39" r="2.5"/><circle cx="9" cy="24" r="2.5"/><circle cx="39" cy="24" r="2.5"/><circle cx="13.5" cy="13.5" r="2.5"/><circle cx="34.5" cy="34.5" r="2.5"/><circle cx="13.5" cy="34.5" r="2.5"/><circle cx="34.5" cy="13.5" r="2.5"/></g></svg>',
    registration: '<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M6 22h36M10 22v14M38 22v14"/><rect x="14" y="13" width="8" height="6" stroke="#2ce0c6"/><rect x="27" y="13" width="8" height="6" stroke="#2ce0c6"/><path d="M24 30v10M20 40h8" stroke="#ff6a1a"/></svg>',
    theater: '<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><rect x="12" y="6" width="24" height="6" rx="1" stroke="#2ce0c6"/><path d="M8 20h8M20 20h8M32 20h8M8 28h8M20 28h8M32 28h8M8 36h8M20 36h8M32 36h8"/></svg>'
  }).map(([e, t]) => [e, t.replace(/#f4efe6/g, BRAND.colors.fg).replace(/#ff6a1a/g, BRAND.colors.highlight).replace(/#2ce0c6/g, BRAND.colors.accent)])),
  ESP.NO_SAVE = /selftest/.test(location.search),
  ESP.saveNow = () => {
    if (!ESP.NO_SAVE) try {
      localStorage.setItem(SAVE_KEY, serialize(ESP.S));
    } catch {}
  };
