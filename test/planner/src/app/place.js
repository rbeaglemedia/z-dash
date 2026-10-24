// Lane: select, rotate, copy, and the add-item sheet.
import { ESP } from './runtime.js';
import * as THREE from 'three';
import { CATS, ITEMS, sizeText } from '../catalog.js';
import { def, newItem, snapPose, applyPose, isValid, removeItem, findSpot, freePose, posterGroup, unlinkPoster, toWorld } from '../logic.js';
import { CAT_ICONS, itemIcon } from '../icons.js';
import { EVENT_PRESETS } from '../fun.js';


ESP.selUid = null;
ESP.selItem = () => ESP.S.items.find(e => e.uid === ESP.selUid) || null;
ESP.select = function select(e) {
  ESP.selUid = e ? e.uid : null, e && ESP.$("#presetTip") && ESP.$("#presetTip").classList.add("hidden"), ESP.$("#selBar").classList.toggle("hidden", !e), e && (ESP.$("#selName").textContent = def(e).name), ESP.$("#btnSplit").classList.toggle("hidden", !(e && e.type === "ledposter" && (e.links || []).length)), e && e.type === "ledposter" && posterGroup(ESP.S.items, e).length > 1 && (ESP.$("#selName").textContent = `LED poster wall (${posterGroup(ESP.S.items, e).length} wide)`), ESP.showHl(null), ESP.syncItems(), ESP.frame();
}
ESP.dropped = function dropped(e, t) {
  isValid(ESP.W, e) ? (ESP.anim.set(e.uid, performance.now()), e.host || ["wall", "wallfloor"].includes(e.mode) ? ESP.sSnap() : ESP.sDrop()) : (ESP.sBad(), t && (applyPose(ESP.W, e, t), ESP.toast("That spot does not fit"))), ESP.showHl(null), ESP.save(), ESP.syncItems(), ESP.frame();
}
ESP.poseOf = e => ({
  x: e.x,
  z: e.z,
  a: e.a,
  y: e.y,
  host: e.host,
  mode: e.mode
});
ESP.$("#btnRot").onclick = () => {
  const e = ESP.selItem();
  if (!e) return;
  (e.type === "ledposter" || e.type === "stage") && unlinkPoster(ESP.S.items, e); // v3.35 decks too; v3.30 rotating takes a poster out of its wall
  const t = ESP.poseOf(e),
    n = e.a + Math.PI / 2,
    a = {
      ...e,
      a: n
    };
  let o = snapPose(ESP.W, a, e.x, e.z);
  ["edge", "wall", "wallfloor", "backwall"].includes(o.mode) && (o = {
    ...freePose(a, e.x, e.z, n)
  }), applyPose(ESP.W, e, o), ESP.dropped(e, isValid(ESP.W, e) ? null : t);
};
ESP.$("#btnCopy").onclick = () => {
  const e = ESP.selItem();
  if (!e) return;
  const t = newItem(e.type, e.x, e.z, e.a);
  ESP.S.items.push(t);
  const n = findSpot(ESP.W, t, e.x + def(e).w + 0.5, e.z) || freePose(t, e.x + 1, e.z + 1);
  applyPose(ESP.W, t, n), ESP.select(t), ESP.dropped(t, null);
};
ESP.$("#btnDel").onclick = () => {
  const e = ESP.selItem();
  if (!e) return;
  const t = removeItem(ESP.W, e);
  ESP.select(null), ESP.toast(t > 1 ? `Removed ${t} items` : "Removed"), ESP.save(), ESP.syncItems(), ESP.frame();
};
ESP.$("#btnDone").onclick = () => ESP.select(null);
// v3.30 poster walls: carry the linked posters rigidly with the dragged one; Separate takes the selected poster out of its wall
ESP.moveGroup = function moveGroup(t) { if (!ESP.drag || !ESP.drag.grp) return; for (const g of ESP.drag.grp) { const [x, z] = toWorld(t.x, t.z, t.a, g.l[0], g.l[1]); g.o.x = x; g.o.z = z; g.o.a = t.a + g.da; g.o.y = 0; } }
ESP.separatePoster = function separatePoster(e = ESP.selItem()) { if (!e || e.type !== "ledposter" || !(e.links || []).length) return false; unlinkPoster(ESP.S.items, e); ESP.toast("Separated from the poster wall · drag it away"); ESP.save(); ESP.select(e); return true; }
ESP.$("#btnSplit").onclick = () => ESP.separatePoster();
ESP.openSheet = function openSheet() {
  ESP.$("#sheet").classList.remove("hidden", "presetsheet"), ESP.showCats();
}
ESP.closeSheet = function closeSheet() {
  ESP.$("#sheet").classList.add("hidden"), ESP.$("#sheet").classList.remove("presetsheet");
}
ESP.showCats = function showCats() {
  ESP.$("#shBack").classList.add("hidden"), ESP.$("#shTitle").textContent = "Add to your space", ESP.$("#shBody").innerHTML = '<div class="evrow"><b>Event presets</b>' + ESP.techRowHTML() + '<div>' + EVENT_PRESETS.map(e => `<button class="evchip" data-ev="${e.id}">${ESP.EV_ICONS[e.id]}<span>${e.name}</span></button>`).join("") + '</div></div><div class="catgrid">' + CATS.map(e => `<button class="cat" data-cat="${e.id}">${CAT_ICONS[e.id]}<span>${e.name}</span></button>`).join("") + "</div>", ESP.$$(".cat").forEach(e => e.onclick = () => ESP.showProducts(e.dataset.cat)), ESP.bindTechRow(), ESP.$$(".evchip").forEach(e => e.onclick = () => ESP.useEventPreset(e.dataset.ev));
}
ESP.showProducts = function showProducts(e) {
  ESP.$("#shBack").classList.remove("hidden"), ESP.$("#shTitle").textContent = CATS.find(t => t.id === e).name, ESP.$("#shBody").innerHTML = ITEMS.filter(t => t.cat === e).map(t => `<button class="prod" data-id="${t.id}"><i class="picon">${itemIcon(t)}</i><div><b>${t.name}</b><span>${sizeText(t)}</span>${t.note ? `<small class="pnote">${t.note}</small>` : ""}</div><span class="plus">+</span></button>`).join(""), ESP.$$(".prod").forEach(t => t.onclick = () => ESP.addItem(t.dataset.id));
}
ESP.$("#btnAdd").onclick = ESP.openSheet;
ESP.$("#shClose").onclick = ESP.closeSheet;
ESP.$("#shBack").onclick = ESP.showCats;
ESP.viewCenter = function viewCenter() {
  return ESP.placeCam(), ESP.ray.setFromCamera(new THREE.Vector2(0, 0.1), ESP.camera), ESP.ray.ray.intersectPlane(ESP.groundPlane, ESP.hitP) ? [ESP.hitP.x, ESP.hitP.z] : [ESP.V.tx, ESP.V.tz];
}
ESP.addItem = function addItem(e) {
  const [t, n] = ESP.viewCenter(),
    a = newItem(e, t, n);
  ESP.S.items.push(a);
  const o = findSpot(ESP.W, a, t, n, 30);
  applyPose(ESP.W, a, o || freePose(a, t, n)), ESP.closeSheet(), ESP.setMode("move"), ESP.select(a), ESP.dropped(a, null), o || ESP.toast("No free spot found. Drag it to a clear area."), ESP.$("#keepPlacing").checked && (ESP.startStamp(a), ESP.toast(`Keep placing: tap the floor to add more ${def(a).name}`));
}
