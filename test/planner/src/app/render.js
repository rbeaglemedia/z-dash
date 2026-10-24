// Lane: rebuild the room, item meshes, the camera and the draw loop.
import { ESP } from './runtime.js';
import * as THREE from 'three';
import { segments, floorOf, floorBounds, wallBounds, snapStep, itemStep, sizeLabel, fmtFt, WALL_T, closePlan, doorList, wallPieces, isRect, polyArea } from '../walls.js';
import { sizeText } from '../catalog.js';
import { def, dims, isValid, posterJoins, stageJoins } from '../logic.js';
import { buildMesh, disposeTree } from '../meshes.js';
import { sanitize, TOP_PITCH } from '../camera.js';


ESP.dirty = false;
ESP.rebuildSoon = () => {
  ESP.dirty = true, ESP.frame();
};
ESP.rebuild = function rebuild() {
  ESP.rebuildNow(), ESP.frame();
}
ESP.placeBar = (e, t, n, a, o, s, l) => {
  const i = Math.hypot(a - t, o - n);
  e.scale.set(i + l, s, l), e.position.set((t + a) / 2, s / 2, (n + o) / 2), e.rotation.y = Math.atan2(-(o - n), a - t);
};
ESP.rebuildNow = function rebuildNow() {
  const e = ESP.ENV_COL[ESP.S.env];
  ESP.setFloorColors(e.a, e.b), ESP.drawVenue(), ESP.drawGhost(), ESP.lvlUI(), ESP.drawFill();
  for (const n of [...ESP.floorG.children]) ESP.floorG.remove(n), n.geometry.dispose();
  const t = floorOf(ESP.S.walls);
  for (const n of t.polys) {
    const a = new THREE.Shape(n.map(([l, i]) => new THREE.Vector2(l, -i))),
      o = new THREE.ShapeGeometry(a).rotateX(-Math.PI / 2),
      s = new THREE.Mesh(o, ESP.floorMat);
    s.position.y = -6e-3, ESP.floorG.add(s);
  }
  for (const n of t.rects) {
    const a = new THREE.Shape([new THREE.Vector2(n.x0, -n.z0), new THREE.Vector2(n.x1, -n.z0), new THREE.Vector2(n.x1, -n.z1), new THREE.Vector2(n.x0, -n.z1)]),
      o = new THREE.Mesh(new THREE.ShapeGeometry(a).rotateX(-Math.PI / 2), ESP.floorMat);
    o.position.y = -8e-3, ESP.floorG.add(o);
  }
  ESP.doorsG.clear();
  for (const n of doorList(ESP.S.walls)) {
    const a = ESP.selDoor && ESP.selDoor.pi === n.pi && ESP.selDoor.k === n.k,
      o = new THREE.Mesh(ESP.unitBox, a ? ESP.doorSelMat : n.dock ? ESP.dockMat : n.svc ? ESP.svcMat : ESP.doorMat),
      s = n.w / 2 - (n.dock ? 0 : 0.04);
    if (ESP.placeBar(o, n.x - n.ux * s, n.z - n.uz * s, n.x + n.ux * s, n.z + n.uz * s, n.dock ? 0.05 : 0.02, WALL_T + (n.dock ? 0.6 : 0.25)), o.name = n.dock ? "dockDoor" : n.svc ? "svcDoor" : "door", ESP.doorsG.add(o), n.dock) {
      const l = new THREE.Mesh(ESP.unitBox, ESP.lintelMat);
      ESP.placeBar(l, n.x - n.ux * s, n.z - n.uz * s, n.x + n.ux * s, n.z + n.uz * s, 0.6, WALL_T + 0.1), l.position.y = ESP.wallHt() - 0.6, l.name = "dockLintel", ESP.doorsG.add(l);
    }
    if (a && ESP.phase === "build" && ESP.tool === "door") for (const l of [-1, 1]) {
      const i = new THREE.Mesh(ESP.dotGeo, ESP.doorEndMat);
      i.scale.set(1.5, 3, 1.5), i.position.set(n.x + n.ux * l * n.w / 2, 0.3, n.z + n.uz * l * n.w / 2), i.name = "doorEnd", i.userData.doorEnd = {
        pi: n.pi,
        k: n.k,
        end: l
      }, ESP.doorsG.add(i);
    }
  }
  ESP.doorGhost.visible = false, ESP.wallsG.clear();
  for (const n of wallPieces(ESP.S.walls)) {
    const a = ESP.selSeg && ESP.selSeg.pi === n.pi && ESP.selSeg.i === n.i,
      o = new THREE.Mesh(ESP.unitBox, ESP.editPi === n.pi ? ESP.editGood ? ESP.wallOkMat : ESP.wallBadMat : a ? ESP.wallSelMat : ESP.S.env === "outdoor" ? ESP.fenceMat : ESP.wallMat);
    ESP.placeBar(o, n.a[0], n.a[1], n.b[0], n.b[1], ESP.wallHt(), ESP.S.env === "outdoor" ? 0.18 : WALL_T), o.userData.seg = {
      pi: n.pi,
      i: n.i
    }, ESP.wallsG.add(o);
  }
  ESP.handlesG.clear(), ESP.phase === "build" && ESP.tool !== "view" && ESP.S.walls.forEach((n, a) => n.pts.forEach(([o, s], l) => {
    const i = new THREE.Mesh(ESP.dotGeo, a === ESP.active && l === 0 && !n.closed ? ESP.dotStartMat : ESP.dotMat);
    i.position.set(o, ESP.wallHt() + 0.15, s), i.userData.corner = {
      pi: a,
      j: l
    }, ESP.handlesG.add(i);
  })), ESP.phase === "build" && ESP.tool !== "view" && ESP.S.walls.forEach((n, a) => {
    if (a === ESP.active) return;
    const o = n.closed ? n.pts.length : n.pts.length - 1;
    for (let s = 0; s < o; s++) {
      const l = n.pts[s],
        i = n.pts[(s + 1) % n.pts.length];
      if (Math.hypot(i[0] - l[0], i[1] - l[1]) < 2) continue;
      const r = new THREE.Mesh(ESP.midGeo, ESP.midMat);
      r.position.set((l[0] + i[0]) / 2, ESP.wallHt() + 0.15, (l[1] + i[1]) / 2), r.rotation.y = Math.atan2(i[0] - l[0], i[1] - l[1]), r.userData.mid = {
        pi: a,
        i: s
      }, ESP.handlesG.add(r);
    }
  }), ESP.$("#sizeLbl").textContent = sizeLabel(ESP.S.walls), ESP.syncItems(), ESP.buildUI();
}
ESP.meshes = new Map(),
  ESP.anim = new Map(),
  ESP.fpGeoRect = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
  ESP.fpGeoCirc = new THREE.CircleGeometry(0.5, 40).rotateX(-Math.PI / 2),
  ESP.lineGeo = e => new THREE.BufferGeometry().setFromPoints(e.map(([t, n]) => new THREE.Vector3(t, 0, n))),
  ESP.fpLineRect = ESP.lineGeo([[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]),
  ESP.fpLineCirc = ESP.lineGeo([...Array(48)].map((e, t) => [0.5 * Math.cos(t * Math.PI / 24), 0.5 * Math.sin(t * Math.PI / 24)])),
  ESP.fpFill = new THREE.MeshBasicMaterial({
    color: ESP.AC,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2
  }),
  ESP.fpEdge = new THREE.LineBasicMaterial({
    color: ESP.AC,
    transparent: true,
    opacity: 0.7
  }),
  ESP.FP_SHARED = {
    fpGeoRect: ESP.fpGeoRect,
    fpGeoCirc: ESP.fpGeoCirc,
    fpLineRect: ESP.fpLineRect,
    fpLineCirc: ESP.fpLineCirc,
    fpFill: ESP.fpFill,
    fpEdge: ESP.fpEdge
  };
ESP.makeFp = function makeFp(e, t) {
  if (t.mode === "wall") return;
  const n = def(t),
    {
      w: a,
      d: o
    } = dims(t),
    s = !!n.round,
    l = new THREE.Group();
  l.userData.fp = 1, l.userData.noHit = 1;
  const i = new THREE.Mesh(s ? ESP.fpGeoCirc : ESP.fpGeoRect, ESP.fpFill),
    r = new THREE.LineLoop(s ? ESP.fpLineCirc : ESP.fpLineRect, ESP.fpEdge);
  for (const h of [i, r]) h.userData.sharedGeo = 1, h.userData.noHit = 1, h.userData.uid = t.uid, h.renderOrder = 1, h.raycast = () => {}, l.add(h);
  return l.scale.set(a, 1, o), ESP.fpG.add(l), l;
}
ESP.fpG = new THREE.Group();
ESP.scene.add(ESP.fpG);
ESP.wallGhostMat = new THREE.MeshLambertMaterial({
  color: 14275786,
  transparent: true,
  opacity: 0.28,
  depthWrite: false
});
ESP.syncItems = function syncItems() {
  const e = new Set(ESP.S.items.map(t => t.uid));
  for (const [t, n] of ESP.meshes) e.has(t) || (ESP.itemsG.remove(n.g), disposeTree(n.g), n.fp && ESP.fpG.remove(n.fp), ESP.meshes.delete(t));
  for (const t of ESP.anim.keys()) e.has(t) || ESP.anim.delete(t);
  for (const t of ESP.S.items) {
    const n = def(t),
      pj = t.type === "ledposter" ? posterJoins(ESP.S.items, t) : t.type === "stage" ? stageJoins(ESP.S.items, t) : null, // v3.35 decks drop skirt/stairs on joined edges // v3.31 seamless poster wall: rebuild when the joined sides change
      a = (t.mode === "wall" ? "wall" : "floor") + (pj ? (pj.joinL ? "L" : "") + (pj.joinR ? "R" : "") + (pj.joinF ? "F" : "") + (pj.joinB ? "B" : "") : "");
    let o = ESP.meshes.get(t.uid);
    if (!o || o.k !== a) {
      o && (ESP.itemsG.remove(o.g), disposeTree(o.g), o.fp && ESP.fpG.remove(o.fp));
      const i = buildMesh(n, t.mode, pj || {});
      if (i.traverse(r => r.userData.uid = t.uid), t.mode === "wall" && !t.host) {
        const r = n.panel + 0.6,
          h = new THREE.Mesh(new THREE.BoxGeometry(n.w + 1, t.y + r, 0.06), ESP.wallGhostMat);
        h.position.set(0, (r - t.y) / 2, -n.wallD / 2 - 0.05), h.userData.uid = t.uid, h.userData.ghost = 1, i.add(h);
      }
      o = {
        g: i,
        k: a,
        fp: ESP.makeFp(i, t)
      }, ESP.meshes.set(t.uid, o), ESP.itemsG.add(i);
    }
    o.fp && (o.fp.visible = t.uid !== ESP.selUid, o.fp.position.set(t.x, (t.mode === "top" ? t.y : 0) + 0.025, t.z), o.fp.rotation.y = t.a);
    const s = ESP.anim.get(t.uid);
    let l = 0;
    if (s) {
      const i = (performance.now() - s) / 380;
      i >= 1 ? ESP.anim.delete(t.uid) : l = Math.abs(Math.sin(i * Math.PI * 2)) * (1 - i) * 0.6;
    }
    o.g.position.set(t.x, t.y + l, t.z), o.g.rotation.y = t.a;
  }
  ESP.selUI();
}
ESP.selUI = function selUI() {
  const e = ESP.selItem();
  if (!e) {
    ESP.selMark.visible = false;
    return;
  }
  const {
      w: t,
      d: n
    } = dims(e),
    a = isValid(ESP.W, e);
  ESP.selMark.visible = e.mode !== "wall" || !a, ESP.selMark.scale.set(t + 0.1, 1, n + 0.1), ESP.selMark.rotation.y = e.a, ESP.selMark.position.set(e.x, (e.mode === "top" ? e.y : (e.mode === "wall", 0)) + 0.03, e.z), ESP.selMark.geometry = def(e).round ? ESP.selCircGeo : ESP.selRectGeo, ESP.selMark.material.color.set(ESP.drag ? a ? 2278750 : 15680580 : a ? ESP.HL : 15680580), ESP.selMark.material.opacity = ESP.drag ? 0.45 : 0.4, ESP.selMark.userData.state = ESP.drag ? a ? "ok" : "bad" : a ? "sel" : "bad", ESP.$("#selInfo").textContent = `${sizeText(def(e))}${a ? "" : " \xB7 Not a valid spot"}`;
}
ESP.showHl = function showHl(e) {
  if (ESP.hlItem.visible = ESP.hlSeg.visible = false, !(!e || !e.hl)) {
    if (e.hl.item) {
      const t = ESP.S.items.find(a => a.uid === e.hl.item);
      if (!t) return;
      const n = def(t);
      ESP.hlItem.visible = true, ESP.hlItem.scale.set(n.w + 0.3, 1, n.d + 0.3), ESP.hlItem.rotation.y = t.a, ESP.hlItem.position.set(t.x, (n.top || 0) + 0.02, t.z);
    }
    if (e.hl.seg) {
      const t = e.hl.seg,
        n = Math.hypot(t.x2 - t.x1, t.z2 - t.z1);
      ESP.hlSeg.visible = true;
      const a = e.mode === "wall" ? 8 : 2;
      ESP.hlSeg.scale.set(n, a, 1), ESP.hlSeg.position.set((t.x1 + t.x2) / 2 + t.nx * 0.05, a / 2, (t.z1 + t.z2) / 2 + t.nz * 0.05), ESP.hlSeg.rotation.y = Math.atan2(t.nx, t.nz);
    }
  }
}
ESP.V = {
  yaw: Math.PI / 4,
  pitch: 0.95,
  dist: 46,
  tx: 0,
  tz: 0
};
ESP.resetView = function resetView() {
  const e = wallBounds(ESP.S.walls) || floorBounds(floorOf(ESP.S.walls));
  Object.assign(ESP.V, {
    yaw: Math.PI / 4,
    pitch: 0.95
  }), ESP.V.tx = (e.minX + e.maxX) / 2, ESP.V.tz = (e.minZ + e.maxZ) / 2, ESP.V.dist = Math.max(24, Math.max(e.w, e.l) * 1.9), sanitize(ESP.V);
}
ESP.placeCam = function placeCam() {
  sanitize(ESP.V);
  const e = ESP.topDown ? TOP_PITCH : ESP.V.pitch,
    t = Math.cos(e);
  ESP.camera.position.set(ESP.V.tx + ESP.V.dist * t * Math.sin(ESP.V.yaw), ESP.V.dist * Math.sin(e), ESP.V.tz + ESP.V.dist * t * Math.cos(ESP.V.yaw)), ESP.camera.lookAt(ESP.V.tx, 0, ESP.V.tz), ESP.camera.updateMatrixWorld();
}
ESP.resize = function resize() {
  const e = Math.round(innerWidth),
    t = Math.round(innerHeight);
  e > 0 && t > 0 && (ESP.R.setPixelRatio(Math.min(devicePixelRatio || 1, 2)), ESP.R.setSize(e, t, false), ESP.camera.aspect = e / t, ESP.camera.updateProjectionMatrix());
}
ESP.crashed = false,
  ESP.ctxLost = false;
ESP.crash = function crash(e, t) {
  e && ESP.noteErr(e), ESP.DBG.crashes++, ESP.crashed = true, ESP.saveNow(), ESP.$("#crash").classList.remove("hidden"), ESP.$("#crash b").textContent = t || "Something went wrong", ESP.$("#crash p").textContent = t ? "Your layout is saved." : "Your layout is saved. Tap to reload the view.", ESP.$("#btnRecover").classList.toggle("hidden", !!t);
}
ESP.recover = function recover() {
  try {
    ESP.crashed = false, ESP.$("#crash").classList.add("hidden"), ESP.ptrs.clear(), ESP.tapInfo = ESP.twoPrev = ESP.orbitPtr = ESP.drag = ESP.down = null, ESP.anim.clear(), ESP.endFx();
    for (const [, e] of ESP.meshes) ESP.itemsG.remove(e.g), disposeTree(e.g);
    ESP.fpG.clear(), ESP.meshes.clear(), sanitize(ESP.V), ESP.resize(), ESP.applyEnv(), ESP.select(ESP.selItem()), ESP.frame();
  } catch (e) {
    ESP.noteErr(e), ESP.saveNow(), location.reload();
  }
}
ESP.$("#btnRecover").onclick = ESP.recover;
ESP.cv.addEventListener("webglcontextlost", e => {
  e.preventDefault(), ESP.DBG.lost++, ESP.ctxLost = true, ESP.noteErr("WebGL context lost"), ESP.crash(null, "Restoring the 3D view\u2026");
});
ESP.cv.addEventListener("webglcontextrestored", () => {
  ESP.DBG.restored++, ESP.ctxLost = false, ESP.recover();
});
ESP.raf = 0;
ESP.frame = function frame() {
  ESP.raf || ESP.crashed || ESP.ctxLost || (ESP.raf = requestAnimationFrame(() => {
    ESP.raf = 0;
    try {
      ESP.dirty && (ESP.dirty = false, ESP.rebuildNow()), ESP.anim.size && (ESP.syncItems(), ESP.frame()), ESP.fx && (ESP.stepFx(), ESP.fx && ESP.frame()), ESP.sim && !ESP.sim.paused && (ESP.simTick(), ESP.frame()), sanitize(ESP.V), ESP.placeCam(), ESP.overlays(), ESP.R.render(ESP.scene, ESP.camera);
    } catch (e) {
      ESP.crash(e);
    }
  }));
}
ESP.lbls = [],
  ESP.lblV = new THREE.Vector3();
ESP.label = function label(e, t, n, a, o) {
  let s = ESP.lbls[e];
  if (s || (s = document.createElement("div"), ESP.$("#labels").appendChild(s), ESP.lbls[e] = s), ESP.lblV.set(t, ESP.wallHt() + 0.5, n).project(ESP.camera), ESP.lblV.z > 1) {
    s.style.display = "none";
    return;
  }
  s.style.display = "", s.className = "lbl " + (o || ""), s.textContent = a, s.style.transform = `translate(${(ESP.lblV.x + 1) / 2 * innerWidth}px, ${(1 - ESP.lblV.y) / 2 * innerHeight}px) translate(-50%,${o === "seg" ? "-150%" : "-50%"})`;
}
ESP.overlays = function overlays() {
  const e = ESP.V.dist >= 160,
    t = ESP.V.dist >= 600;
  ESP.grid1.visible = !e, ESP.grid10.visible = e && !t, ESP.grid100.visible = t;
  const n = Math.max(0.5, ESP.V.dist * 0.017);
  ESP.handlesG.children.forEach(s => s.scale.set(n, 1, n)), ESP.cursorDot.scale.set(n, 1, n);
  let a = 0;
  const o = snapStep(ESP.V.dist);
  if (ESP.$("#snapHint").textContent = ESP.phase === "build" ? `Snap: ${o} ft` : `Move snap: ${itemStep(ESP.V.dist)} ft`, ESP.phase === "build") {
    const s = segments(ESP.S.walls);
    if (s.length <= 60) for (const f of s) ESP.corner && f.pi === ESP.corner.pi || ESP.push && f.pi === ESP.push.pi || ESP.label(a++, (f.a[0] + f.b[0]) / 2, (f.a[1] + f.b[1]) / 2, fmtFt(Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])), ESP.tool !== "view" ? "seg" : "");
    const l = ESP.tool === "walls" && ESP.active != null && closePlan(ESP.S.walls[ESP.active]);
    ESP.closeGhosts.forEach((f, p) => {
      const g = l && l.ghost[p],
        x = l && l.ghost[p + 1];
      f.visible = !!(g && x), f.visible && ESP.placeBar(f, g[0], g[1], x[0], x[1], ESP.wallHt(), WALL_T);
    });
    const i = ESP.rub && ESP.rub.guides || [];
    ESP.guides.forEach((f, p) => {
      const g = i[p];
      if (f.visible = !!g, g) {
        const x = f.geometry.attributes.position;
        x.setXYZ(0, g[0][0], ESP.wallHt() + 0.2, g[0][1]), x.setXYZ(1, g[1][0], ESP.wallHt() + 0.2, g[1][1]), x.needsUpdate = true, f.computeLineDistances();
      }
    }), ESP.cursorDot.material.color.set(ESP.rub && (ESP.rub.aligned || ESP.rub.close) ? ESP.AC : ESP.HL);
    const r = ESP.corner ? ESP.corner.pi : ESP.push ? ESP.push.pi : ESP.pendEdit ? ESP.editPi : null,
      h = r != null && ESP.S.walls[r];
    if (h && h.closed && !ESP.boxA) {
      const f = wallBounds([h]),
        p = Math.round(polyArea(h.pts));
      ESP.label(a++, (f.minX + f.maxX) / 2, (f.minZ + f.maxZ) / 2, (isRect(h) ? `${f.w} x ${f.l} ft \xB7 ` : "") + `${p} sq ft`, ESP.editGood ? "live" : "live bad");
    }
    if (h && (ESP.corner || ESP.push)) for (const f of segments([h])) ESP.label(a++, (f.a[0] + f.b[0]) / 2, (f.a[1] + f.b[1]) / 2, fmtFt(Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1])), ESP.editGood ? "live" : "live bad");
    if (ESP.boxA && ESP.S.walls[ESP.boxIdx] && ESP.S.walls[ESP.boxIdx].closed) {
      const f = wallBounds([ESP.S.walls[ESP.boxIdx]]);
      ESP.label(a++, (f.minX + f.maxX) / 2, (f.minZ + f.maxZ) / 2, `${f.w} x ${f.l} ft \xB7 ${Math.round(f.w * f.l)} sq ft`, ESP.editGood ? "live" : "live bad");
    }
    const y = ESP.active != null && ESP.S.walls[ESP.active];
    if (y && ESP.rub && y.pts.length) {
      const [f, p] = y.pts[y.pts.length - 1];
      ESP.rubber.visible = true, ESP.placeBar(ESP.rubber, f, p, ESP.rub.x, ESP.rub.z, ESP.wallHt(), WALL_T), ESP.label(a++, (f + ESP.rub.x) / 2, (p + ESP.rub.z) / 2, fmtFt(Math.hypot(ESP.rub.x - f, ESP.rub.z - p)) + (ESP.rub.close ? " \xB7 close room" : ""), "live");
    } else ESP.rubber.visible = false;
  } else ESP.rubber.visible = false, ESP.closeGhosts.forEach(s => s.visible = false), ESP.guides.forEach(s => s.visible = false);
  for (let s = a; s < ESP.lbls.length; s++) ESP.lbls[s].style.display = "none";
}
addEventListener("resize", () => {
  ESP.resize(), ESP.frame();
});
addEventListener("orientationchange", () => setTimeout(() => {
  ESP.resize(), ESP.frame();
}, 300));
window.visualViewport && visualViewport.addEventListener("resize", () => {
  ESP.resize(), ESP.frame();
});
