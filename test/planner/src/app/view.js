// Lane: top view, pan, wall height, Same again, and the share picture.
import { ESP } from './runtime.js';
import { BRAND } from '../brand.js';
import { wallBounds, sizeLabel } from '../walls.js';
import { BY_ID } from '../catalog.js';
import { newItem, snapPose, applyPose, isValid, findSpot } from '../logic.js';


// ---------- v3.8 view switches: top-down, one-finger Turn or Pan, walls Low / Full / Hidden ----------
ESP.WALLS_VIEWS = ['low', 'full', 'hidden'], ESP.WV_NAME = { low: 'Low', full: 'Full', hidden: 'Hidden' };
ESP.wallHt = function wallHt() { const o = ESP.S.env === 'outdoor'; return ESP.wallsView === 'full' ? (o ? 3.5 : 9) : ESP.wallsView === 'hidden' ? (o ? 0.05 : 0.08) : o ? 0.35 : ESP.WALL_H; }
ESP.setTop = function setTop(on) { if (on === ESP.topDown) return; ESP.topDown = on; if (on) { ESP.preTop = ESP.V.yaw; ESP.V.yaw = Math.round(ESP.V.yaw / (Math.PI / 2)) * (Math.PI / 2); const b = wallBounds(ESP.S.walls); if (b) { const asp = Math.max(0.3, innerWidth / Math.max(1, innerHeight)), q = Math.abs(Math.sin(ESP.V.yaw)) > 0.5, w = q ? b.l : b.w, l = q ? b.w : b.l; ESP.V.tx = (b.minX + b.maxX) / 2; ESP.V.tz = (b.minZ + b.maxZ) / 2; ESP.V.dist = Math.max(20, Math.max(w / asp, l) * 1.75);  } } /* frame the whole room as a plan */ else if (ESP.preTop != null) ESP.V.yaw = ESP.preTop; ESP.viewUI(); ESP.setHint(); ESP.frame(); }
ESP.setPanMode = function setPanMode(on) { ESP.panMode = !!on; ESP.viewUI(); ESP.setHint(); }
ESP.setWallsView = function setWallsView(v) { ESP.wallsView = v; ESP.viewUI(); ESP.rebuildSoon(); }
ESP.viewUI = function viewUI() { const t = ESP.$('#btnTop'), pm = ESP.$('#btnPanMode'), wv = ESP.$('#btnWallsView'); if (!t) return; t.classList.toggle('on', ESP.topDown); t.querySelector('span').textContent = ESP.topDown ? '3D view' : 'Top view';
  pm.classList.toggle('on', ESP.panMode); pm.querySelector('span').textContent = ESP.panMode ? 'Drag: Pan' : 'Drag: Turn'; wv.querySelector('span').textContent = 'Walls: ' + ESP.WV_NAME[ESP.wallsView]; wv.classList.toggle('on', ESP.wallsView !== 'low'); }
// ---------- v3.8 Same again (tap a placed item to copy it) and keep placing ----------
ESP.stampUI = function stampUI() { const b = ESP.$('#stampBar'); b.classList.toggle('hidden', !(ESP.stamp || ESP.picker)); ESP.$('#btnSame').classList.toggle('on', !!(ESP.stamp || ESP.picker)); ESP.$('#stampTxt').textContent = ESP.stamp ? `Placing ${BY_ID[ESP.stamp.type].name} · tap the floor to add more` : 'Same again: tap an item to copy it'; ESP.setHint(); }
ESP.startStamp = function startStamp(it) { ESP.stamp = { type: it.type, a: it.a }; ESP.picker = false; ESP.select(null); ESP.stampUI(); ESP.sTile(true); }
ESP.endStamp = function endStamp() { ESP.stamp = null; ESP.picker = false; ESP.stampUI(); }
ESP.stampAt = function stampAt(cx, cy) { const g = ESP.groundAt(cx, cy); if (!g) return; const c = newItem(ESP.stamp.type, g[0], g[1], ESP.stamp.a); ESP.S.items.push(c); const p = findSpot(ESP.W, c, g[0], g[1], 4) || snapPose(ESP.W, c, g[0], g[1]); applyPose(ESP.W, c, p);
  if (!isValid(ESP.W, c)) { ESP.S.items.splice(ESP.S.items.indexOf(c), 1); ESP.syncItems(); ESP.sBad(); return ESP.toast('No room there'); } ESP.anim.set(c.uid, performance.now()); ESP.sDrop(); ESP.save(); ESP.syncItems(); ESP.frame(); }
// ---------- Share my layout: a PNG of the current view with the brand logo strip (brand from src/brand.js) ----------
ESP.logoImg = new Image(); ESP.logoImg.src = BRAND.logo;
ESP.layoutPng = function layoutPng() { ESP.endFx(); return new Promise((res) => { ESP.placeCam(); ESP.R.render(ESP.scene, ESP.camera); const src = ESP.R.domElement, w = src.width, h = src.height, bar = Math.round(Math.max(56, h * 0.08)), c = document.createElement('canvas'); c.width = w; c.height = h + bar; const x = c.getContext('2d');
  x.drawImage(src, 0, 0); const C = BRAND.colors; x.fillStyle = C.strip; x.fillRect(0, h, w, bar); let tx = bar * 0.25, logo = false; if (ESP.logoImg.complete && ESP.logoImg.naturalWidth) { const lh = bar * 0.62, lw = lh * (ESP.logoImg.naturalWidth / ESP.logoImg.naturalHeight); x.drawImage(ESP.logoImg, bar * 0.2, h + (bar - lh) / 2, lw, lh); tx = bar * 0.2 + lw + bar * 0.3; logo = true; }
  const fs = Math.round(bar * (tx > w * 0.55 ? 0.2 : 0.28)); x.fillStyle = C.stripText; x.font = `700 ${fs}px ${BRAND.fonts.body}`; x.textBaseline = 'middle'; x.fillText(logo ? BRAND.appName : `${BRAND.name} · ${BRAND.appName}`, tx, h + bar * 0.36); x.fillStyle = C.stripSub; x.font = `600 ${Math.round(fs * 0.8)}px ${BRAND.fonts.body}`; x.fillText(sizeLabel(ESP.S.walls) + ` · ${ESP.S.items.length} item${ESP.S.items.length === 1 ? '' : 's'}`, tx, h + bar * 0.7);
  c.toBlob((b) => { const info = { w: c.width, h: c.height, logo }; c.width = c.height = 0; res({ blob: b, info }); }, 'image/png'); }); }
ESP.lastShare = null;
ESP.shareLayout = async function shareLayout() { const { blob, info } = await ESP.layoutPng(); if (!blob) { ESP.toast('Could not make the picture'); return null; } const file = new File([blob], 'my-event-layout.png', { type: 'image/png' });
  try { if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) { ESP.lastShare = { how: 'share', ...info, size: blob.size }; await navigator.share({ files: [file], title: BRAND.copy.shareTitle, text: BRAND.copy.shareText }); return ESP.lastShare; } } catch (e) { if (e && e.name === 'AbortError') return ESP.lastShare; }
  const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'my-event-layout.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); ESP.lastShare = { how: 'download', ...info, size: blob.size }; ESP.toast('Picture saved'); ESP.sTile(true); return ESP.lastShare; }
