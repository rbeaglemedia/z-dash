// Lane: Clear room.
import { ESP } from './runtime.js';



// ---------- v3.23 Clear room (active floor only; one undo step; stops a running event first) ----------
ESP.clearKind = function clearKind() { const r = document.querySelector('#clearPick input[name=clearK]:checked'); return r ? r.value : 'items'; }
ESP.clearUI = function clearUI() { const k = ESP.clearKind(), b = ESP.$('#clearGo'); b.textContent = k === 'build' ? 'Clear build' : 'Clear items'; b.classList.toggle('dangerbtn', k === 'build'); b.classList.toggle('primary', k !== 'build'); }
ESP.openClear = function openClear() { const r = document.querySelector('#clearPick input[value=items]'); if (r) r.checked = true; ESP.clearUI(); ESP.$('#clearPick').classList.remove('hidden'); }
ESP.closeClear = function closeClear() { ESP.$('#clearPick').classList.add('hidden'); }
ESP.clearRoom = function clearRoom(kind) { if (ESP.sim) ESP.simStop(); if (typeof ESP.endStamp === 'function' && (ESP.stamp || ESP.picker)) ESP.endStamp(); ESP.select(null); ESP.selDoor = null; ESP.selSeg = null; ESP.active = null; ESP.rub = null;
  if (kind === 'build') { ESP.S.walls = []; ESP.S.items = []; ESP.S.venue = null; ESP.S.fill = null; ESP.S.preset = null; } else { ESP.S.items = []; ESP.S.fill = null; }
  ESP.closeClear(); ESP.syncItems(); ESP.renderPresets(); ESP.buildUI(); ESP.save(); ESP.rebuild(); ESP.toast(kind === 'build' ? 'Build cleared · Undo to bring it back' : 'Items cleared · Undo to bring them back'); }
ESP.$('#btnClear').onclick = () => (ESP.$('#clearPick').classList.contains('hidden') ? ESP.openClear() : ESP.closeClear());
ESP.$$('#clearPick input[name=clearK]').forEach((r) => (r.onchange = ESP.clearUI)); ESP.$('#clearCancel').onclick = ESP.closeClear; ESP.$('#clearGo').onclick = () => ESP.clearRoom(ESP.clearKind());
