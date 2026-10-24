// Lane: floors.
import { ESP } from './runtime.js';
import * as THREE from 'three';
import { MIN_LVL, MAX_LVL } from '../grid.js';
import { dims } from '../logic.js';


ESP.ghostMat = new THREE.LineBasicMaterial({
  color: 9418976,
  transparent: true,
  opacity: 0.35,
  depthWrite: false
});
ESP.isEmpty = function isEmpty(e) {
  return !e || !e.walls.length && !e.items.length && !e.fill;
}
ESP.moveToLevel = function moveToLevel(e) {
  ESP.sim && ESP.simStop();
  const t = {
    walls: ESP.S.walls,
    items: ESP.S.items,
    venue: ESP.S.venue,
    fill: ESP.S.fill
  };
  ESP.isEmpty(t) ? delete ESP.S.levels[ESP.S.lvl] : ESP.S.levels[ESP.S.lvl] = t;
  const n = ESP.S.levels[e] || {
    walls: [],
    items: [],
    venue: null
  };
  delete ESP.S.levels[e], ESP.S.lvl = e, ESP.S.walls = n.walls, ESP.S.items = n.items, ESP.S.venue = n.venue || null, ESP.S.fill = n.fill || null, ESP.S.preset = null, ESP.active = null, ESP.selSeg = null, ESP.rub = null, typeof ESP.select == "function" && ESP.select(null);
}
ESP.switchLevel = function switchLevel(e) {
  const t = ESP.S.lvl + e;
  t < MIN_LVL || t > MAX_LVL || (ESP.moveToLevel(t), ESP.syncItems(), ESP.renderPresets(), ESP.save(), ESP.rebuild(), ESP.toast(ESP.lvlName()));
}
ESP.lvlName = function lvlName() {
  const e = ESP.S.venue;
  return `Level ${ESP.S.lvl}` + (e && e.lvlName && e.lvlName !== `Level ${ESP.S.lvl}` ? ` \xB7 ${e.lvlName}` : "") + (e && e.lvlGuess ? " (estimated)" : "");
}
ESP.usedLevels = function usedLevels() {
  const e = new Set(Object.keys(ESP.S.levels).map(Number));
  return ESP.isEmpty(ESP.S) || e.add(ESP.S.lvl), [...e].sort((t, n) => t - n);
}
ESP.lvlUI = function lvlUI() {
  const e = ESP.$("#lvlTxt");
  if (!e) return;
  const t = ESP.S.venue,
    n = t && t.lvlName && t.lvlName !== `Level ${ESP.S.lvl}` ? t.lvlName : "",
    a = ESP.usedLevels();
  e.textContent = `Level ${ESP.S.lvl}`, ESP.$("#lvlSub").textContent = [n, t && t.lvlGuess ? "(estimated)" : "", !t && a.length > 1 ? `${a.length} floors: ${a.join(", ")}` : ""].filter(Boolean).join(" "), ESP.$("#lvlBar").title = ESP.lvlName() + (a.length > 1 ? ` \xB7 floors used: ${a.join(", ")}` : ""), ESP.$("#lvlUp").disabled = ESP.S.lvl >= MAX_LVL, ESP.$("#lvlDown").disabled = ESP.S.lvl <= MIN_LVL;
}
ESP.drawGhost = function drawGhost() {
  for (const o of [...ESP.ghostG.children]) ESP.ghostG.remove(o), o.geometry.dispose();
  const e = ESP.S.levels[ESP.S.lvl - 1];
  if (ESP.isEmpty(e)) return;
  const t = [];
  for (const o of e.walls) {
    const s = o.pts.length;
    for (let l = 0; l < (o.closed ? s : s - 1); l++) {
      const i = o.pts[l],
        r = o.pts[(l + 1) % s];
      t.push(i[0], 0.03, i[1], r[0], 0.03, r[1]);
    }
  }
  for (const o of e.items) {
    if (o.mode === "top" || o.mode === "wall") continue;
    const {
        w: s,
        d: l
      } = dims(o),
      i = Math.cos(o.a || 0),
      r = Math.sin(o.a || 0),
      h = [[-s / 2, -l / 2], [s / 2, -l / 2], [s / 2, l / 2], [-s / 2, l / 2]].map(([y, f]) => [o.x + y * i + f * r, o.z - y * r + f * i]);
    for (let y = 0; y < 4; y++) {
      const f = h[y],
        p = h[(y + 1) % 4];
      t.push(f[0], 0.03, f[1], p[0], 0.03, p[1]);
    }
  }
  if (!t.length) return;
  const n = new THREE.BufferGeometry();
  n.setAttribute("position", new THREE.Float32BufferAttribute(t, 3));
  const a = new THREE.LineSegments(n, ESP.ghostMat);
  a.name = "ghostBelow", a.renderOrder = -1, ESP.ghostG.add(a);
}
ESP.$("#lvlUp").onclick = () => ESP.switchLevel(1);
ESP.$(".lvlmid").onclick = () => ESP.toast(ESP.lvlName());
ESP.$("#lvlDown").onclick = () => ESP.switchLevel(-1);
