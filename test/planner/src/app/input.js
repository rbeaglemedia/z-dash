// Lane: pointer input (drag, snap, draw, doors).
import { ESP } from './runtime.js';
import * as THREE from 'three';
import { segments, snapStep, itemStep, addPoint, fmtFt, WALL_T, boxRect, drawPoint, closePlan, closeWalls, placeDoor, reversePoly, doorList, doorAt, resizeDoor, nearestSeg, dragCornerDoors, openings, DOOR_W, pushWall, segNormal, editOk } from '../walls.js';
import { def, snapPose, applyPose, isValid, descendants, posterGroup, linkPosters, toLocal, stageLinkFlush } from '../logic.js';
import { sanitize, pinch, orbitBy, zoomBy, twoState, passedThreshold, canDragItem, panDelta } from '../camera.js';
import { carrySet } from '../fun.js';


ESP.ray = new THREE.Raycaster(),
  ESP.ndc = new THREE.Vector2(),
  ESP.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  ESP.hitP = new THREE.Vector3();
ESP.setRay = function setRay(e, t) {
  const n = ESP.cv.getBoundingClientRect();
  ESP.ndc.set((e - n.left) / n.width * 2 - 1, -((t - n.top) / n.height) * 2 + 1), ESP.placeCam(), ESP.ray.setFromCamera(ESP.ndc, ESP.camera);
}
ESP.groundAt = function groundAt(e, t) {
  return ESP.setRay(e, t), ESP.ray.ray.intersectPlane(ESP.groundPlane, ESP.hitP) ? [ESP.hitP.x, ESP.hitP.z] : null;
}
ESP.itemAt = function itemAt(e, t) {
  ESP.setRay(e, t);
  const n = ESP.ray.intersectObjects(ESP.itemsG.children, true).filter(i => !i.object.userData.ghost && !i.object.userData.noHit);
  if (!n.length) return null;
  const a = [...new Set(n.filter(i => !i.object.userData.noHit).map(i => i.object.userData.uid))].map(i => ESP.S.items.find(r => r.uid === i)).filter(Boolean),
    o = a.filter(i => !def(i).booth);
  if (!o.length) return a[0] || null;
  const s = o[0];
  return o.filter(i => descendants(ESP.S.items, s).includes(i))[0] || s;
}
ESP.ptrs = new Map();
ESP.editBefore = null,
  ESP.panPtr = null,
  ESP.tapInfo = null,
  ESP.twoPrev = null,
  ESP.orbitPtr = null,
  ESP.drag = null,
  ESP.down = null,
  ESP.needSave = false,
  ESP.corner = null,
  ESP.draw = null;
ESP.panBy = function panBy(e, t) {
  const n = ESP.V.dist * 0.728 / Math.max(1, innerHeight),
    a = Math.cos(ESP.V.yaw),
    o = -Math.sin(ESP.V.yaw),
    s = -Math.sin(ESP.V.yaw),
    l = -Math.cos(ESP.V.yaw);
  ESP.V.tx += (-a * e + s * t) * n, ESP.V.tz += (-o * e + l * t) * n, sanitize(ESP.V);
}
ESP.itemMode = () => ESP.phase === "place" || ESP.tool === "view",
  ESP.drawAt = (e, t) => {
    const n = ESP.groundAt(e, t);
    return n ? drawPoint(ESP.S.walls, ESP.active, n[0], n[1], snapStep(ESP.V.dist), ESP.lock) : null;
  };
ESP.handleAt = function handleAt(e, t) {
  ESP.setRay(e, t);
  const n = ESP.ray.intersectObjects(ESP.handlesG.children, false)[0];
  if (n) return n.object.userData.corner ? {
    corner: n.object.userData.corner
  } : {
    mid: n.object.userData.mid
  };
  const a = ESP.cv.getBoundingClientRect(),
    o = (r, h, y) => (ESP.lblV.set(r, h, y).project(ESP.camera), Math.hypot(a.left + (ESP.lblV.x + 1) / 2 * a.width - e, a.top + (1 - ESP.lblV.y) / 2 * a.height - t));
  let s = null,
    l = 40;
  for (const r of ESP.handlesG.children) {
    let h = Math.min(o(r.position.x, r.position.y, r.position.z), o(r.position.x, 0, r.position.z));
    r.userData.mid && (h += 6), h < l && (l = h, s = r.userData);
  }
  if (s) return s.corner ? {
    corner: s.corner
  } : {
    mid: s.mid
  };
  const i = ESP.ray.intersectObjects(ESP.wallsG.children, false)[0];
  return i ? {
    seg: i.object.userData.seg
  } : {};
}
ESP.addPt = function addPt(e) {
  if (!e || e.idle && ESP.active != null) return;
  if (ESP.lock.axis = null, e.close && ESP.active != null) {
    const n = ESP.active;
    return ESP.active = closeWalls(ESP.S.walls, ESP.active), ESP.celebrate(ESP.S.walls[n] && ESP.S.walls[n].closed ? ESP.S.walls[n] : ESP.S.walls[ESP.S.walls.length - 1]), ESP.rub = null, ESP.sSnap(), ESP.toast("Room closed"), ESP.wallsChanged(), ESP.setTool("view");
  }
  const t = ESP.active;
  ESP.active = addPoint(ESP.S.walls, ESP.active, e), e.close ? (ESP.sSnap(), ESP.toast("Room closed")) : ESP.sTile(true), t == null && ESP.active != null && ESP.S.walls[ESP.active].pts.length, ESP.rub = null, ESP.wallsChanged();
}
ESP.tapBuild = function tapBuild(e, t, n) {
  if (ESP.tool === "door") return ESP.tapDoor(e, t);
  if (n.corner) {
    const {
        pi: s,
        j: l
      } = n.corner,
      i = ESP.S.walls[s];
    if (s === ESP.active && l === 0 && i.pts.length >= 3) return ESP.addPt({
      x: i.pts[0][0],
      z: i.pts[0][1],
      close: true
    });
    if (ESP.active == null && !i.closed && (l === 0 || l === i.pts.length - 1)) return l === 0 && reversePoly(i), ESP.active = s, ESP.selSeg = null, ESP.toast("Continue drawing from here"), ESP.sTile(true), ESP.rebuildSoon();
  }
  if (n.mid) {
    ESP.toast("Drag the arrow to push or pull this wall");
    return;
  }
  if (n.seg && ESP.active == null) return ESP.selSeg = ESP.selSeg && ESP.selSeg.pi === n.seg.pi && ESP.selSeg.i === n.seg.i ? null : n.seg, ESP.buildUI(), ESP.rebuildSoon();
  if (ESP.selSeg = null, ESP.tool === "door") return ESP.tapDoor(e, t);
  if (ESP.tool === "box") {
    ESP.toast("Drag from one corner to the opposite corner");
    return;
  }
  const a = ESP.active != null && closePlan(ESP.S.walls[ESP.active]),
    o = ESP.groundAt(e, t);
  if (a && o && ESP.nearGhost(a.ghost, o, Math.max(2, snapStep(ESP.V.dist)))) {
    ESP.$("#btnCloseWalls").click();
    return;
  }
  ESP.addPt(ESP.drawAt(e, t));
}
ESP.wallPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  ESP.wallHitP = new THREE.Vector3();
ESP.wallPointAt = function wallPointAt(e, t) {
  ESP.setRay(e, t);
  const n = ESP.ray.intersectObjects(ESP.wallsG.children, false)[0];
  if (n) return [n.point.x, n.point.z];
  ESP.wallPlane.constant = -Math.max(0.5, ESP.wallHt() / 2);
  const a = ESP.ray.ray.intersectPlane(ESP.wallPlane, ESP.wallHitP) ? [ESP.wallHitP.x, ESP.wallHitP.z] : null,
    o = ESP.groundAt(e, t);
  return a && (!o || (nearestSeg(ESP.S.walls, a[0], a[1]) || {
    dist: 1e9
  }).dist <= (nearestSeg(ESP.S.walls, o[0], o[1]) || {
    dist: 1e9
  }).dist) ? a : o;
}
ESP.tapDoor = function tapDoor(e, t) {
  const n = ESP.wallPointAt(e, t);
  if (!n) return;
  const a = doorAt(ESP.S.walls, n[0], n[1], 1.2);
  if (a) return ESP.selDoor = ESP.selDoor && ESP.selDoor.pi === a.pi && ESP.selDoor.k === a.k ? null : {
    pi: a.pi,
    k: a.k
  }, ESP.selSeg = null, ESP.buildUI(), ESP.sTile(true), ESP.rebuildSoon();
  ESP.selDoor = null;
  const o = nearestSeg(ESP.S.walls, n[0], n[1]);
  if (!o || o.dist > Math.max(1.5, snapStep(ESP.V.dist) * 0.5)) return ESP.buildUI(), ESP.rebuildSoon(), ESP.toast(ESP.S.walls.length ? "Tap on a wall to add a door" : "Draw walls first, then add doors");
  const s = placeDoor(ESP.S.walls, o.pi, o.i, o.t, 0.5);
  if (s.error) return ESP.sBad(), ESP.toast(s.error);
  const l = ESP.S.walls[o.pi],
    i = openings(l, o.i).some(([r, h]) => h - r > DOOR_W + 0.01 && s.door.t >= r && s.door.t <= h);
  ESP.sSnap(), ESP.toast(i ? "Double door (6 ft)" : "Door added (3 ft) \xB7 tap it, then drag its ends to resize"), ESP.wallsChanged();
}
ESP.doorSpot = function doorSpot(e, t) {
  const n = ESP.wallPointAt(e, t);
  if (!n) return null;
  const a = nearestSeg(ESP.S.walls, n[0], n[1]);
  if (!a || a.dist > Math.max(1.5, snapStep(ESP.V.dist) * 0.5)) return {
    g: n,
    n: null
  };
  const o = ESP.S.walls[a.pi],
    s = o.pts[a.i],
    l = o.pts[(a.i + 1) % o.pts.length],
    i = Math.hypot(l[0] - s[0], l[1] - s[1]),
    r = (l[0] - s[0]) / i,
    h = (l[1] - s[1]) / i,
    y = WALL_T / 2 + DOOR_W / 2,
    f = Math.min(i - y, Math.max(y, Math.round(a.t * 2) / 2));
  return {
    g: n,
    n: a,
    x: s[0] + r * f,
    z: s[1] + h * f,
    ux: r,
    uz: h,
    t: f,
    wx: s[0] + r * a.t,
    wz: s[1] + h * a.t
  };
}
ESP.hoverDoor = function hoverDoor(e, t) {
  const n = ESP.doorSpot(e, t);
  if (ESP.cursorDot.visible = false, !n || !n.n) {
    ESP.doorGhost.visible = false, ESP.ghostAt = n ? {
      ...n,
      on: false
    } : null, ESP.frame();
    return;
  }
  ESP.doorGhost.position.set(n.x, 0, n.z), ESP.doorGhost.rotation.y = Math.atan2(n.ux, n.uz) + Math.PI / 2, ESP.doorGhost.scale.set(DOOR_W, Math.max(0.3, ESP.wallHt() * 0.9), WALL_T + 0.35), ESP.doorGhost.visible = true, ESP.ghostAt = {
    ...n,
    on: true,
    cx: e,
    cy: t
  }, ESP.frame();
}
ESP.doorEndAt = function doorEndAt(e, t) {
  if (!ESP.selDoor || ESP.tool !== "door") return null;
  const n = ESP.cv.getBoundingClientRect(),
    a = new THREE.Vector3();
  let o = null,
    s = 30;
  for (const l of ESP.doorsG.children) {
    if (!l.userData.doorEnd) continue;
    a.copy(l.position).project(ESP.camera);
    const i = Math.hypot(n.left + (a.x + 1) / 2 * n.width - e, n.top + (1 - a.y) / 2 * n.height - t);
    i < s && (s = i, o = l.userData.doorEnd);
  }
  return o;
}
ESP.nearGhost = function nearGhost(e, t, n) {
  for (let a = 0; a < e.length - 1; a++) {
    const [o, s] = e[a],
      [l, i] = e[a + 1],
      r = (l - o) ** 2 + (i - s) ** 2;
    let h = r ? ((t[0] - o) * (l - o) + (t[1] - s) * (i - s)) / r : 0;
    if (h = Math.max(0, Math.min(1, h)), Math.hypot(t[0] - o - h * (l - o), t[1] - s - h * (i - s)) <= n) return true;
  }
  return false;
}
ESP.twoNow = () => {
    const [e, t] = [...ESP.ptrs.values()];
    return twoState(e, t);
  },
  ESP.endDrag = e => {
    if (!ESP.drag) return;
    const t = ESP.selItem();
    if (t && ESP.drag.grp && ESP.drag.grp.length) { // v3.30 poster wall: the whole group must fit, else it all goes back
      const back = () => { applyPose(ESP.W, t, ESP.drag.start); for (const g of ESP.drag.grp) applyPose(ESP.W, g.o, g.start); };
      if (e) back(); else if (ESP.drag.moved) { if ([t, ...ESP.drag.grp.map(g => g.o)].every(o => isValid(ESP.W, o))) { ESP.drag.join && (linkPosters(t, ESP.S.items.find(o => o.uid === ESP.drag.join)), t.type === "stage" && stageLinkFlush(ESP.S.items, t)); ESP.anim.set(t.uid, performance.now()); ESP.sDrop(); ESP.save(); } else ESP.sBad(), back(), ESP.toast("That spot does not fit"); }
    } else if (t) { if (e) applyPose(ESP.W, t, ESP.drag.start); else if (ESP.drag.moved) { ESP.drag.join && isValid(ESP.W, t) && (linkPosters(t, ESP.S.items.find(o => o.uid === ESP.drag.join)), t.type === "stage" && stageLinkFlush(ESP.S.items, t)); ESP.dropped(t, ESP.drag.start); } }
    ESP.drag = null, ESP.showHl(null), ESP.syncItems(), ESP.frame();
  },
  ESP.guard = e => t => {
    try {
      e(t);
    } catch (n) {
      ESP.crash(n);
    }
  };
ESP.cv.addEventListener("contextmenu", e => e.preventDefault());
ESP.cv.addEventListener("pointerdown", ESP.guard(e => {
  if (ESP.walkOn && ESP.phase !== "build") return;
  try {
    ESP.cv.setPointerCapture(e.pointerId);
  } catch {}
  if (ESP.ptrs.set(e.pointerId, {
    x: e.clientX,
    y: e.clientY
  }), ESP.$("#hint").style.opacity = 0, e.pointerType === "mouse" && e.button === 2) {
    ESP.panPtr = {
      x: e.clientX,
      y: e.clientY
    };
    return;
  }
  if (e.pointerType === "mouse" && e.button === 1) {
    ESP.orbitPtr = {
      x: e.clientX,
      y: e.clientY
    };
    return;
  }
  if (ESP.ptrs.size >= 2) {
    ESP.tapInfo = null, ESP.down = null, (ESP.corner || ESP.push) && (ESP.editBefore && (ESP.putBack(ESP.editBefore), ESP.editBefore = null), ESP.corner = ESP.push = null, ESP.editPi = null, ESP.editGood = true, ESP.rebuildSoon()), ESP.boxA && (ESP.S.walls.splice(ESP.boxIdx, 1), ESP.boxA = ESP.boxIdx = null, ESP.editPi = null, ESP.editGood = true, ESP.rebuildSoon()), ESP.draw && (ESP.draw = null, ESP.rub = null), ESP.endDrag(false), ESP.orbitPtr = null, ESP.twoPrev = ESP.twoNow(), ESP.cursorDot.visible = false, ESP.frame();
    return;
  }
  e.pointerType === "mouse" && e.button !== 0 || (ESP.pendEdit && ESP.commitEdit(), ESP.down = {
    de: ESP.phase === "build" ? ESP.doorEndAt(e.clientX, e.clientY) : null,
    x0: e.clientX,
    y0: e.clientY,
    started: false,
    item: ESP.itemMode() ? ESP.itemAt(e.clientX, e.clientY) : null,
    hb: ESP.itemMode() ? null : ESP.handleAt(e.clientX, e.clientY)
  });
}));
ESP.cv.addEventListener("pointermove", ESP.guard(e => {
  if (ESP.walkOn && ESP.phase !== "build") return;
  if (!ESP.ptrs.has(e.pointerId)) {
    if (e.pointerType === "mouse" && ESP.phase === "build" && ESP.tool === "door") {
      ESP.hoverDoor(e.clientX, e.clientY);
      return;
    }
    if (e.pointerType === "mouse" && ESP.phase === "build" && ESP.tool !== "view") {
      const t = ESP.drawAt(e.clientX, e.clientY);
      t && (ESP.cursorDot.position.set(t.x, ESP.wallHt() + 0.15, t.z), ESP.cursorDot.visible = true, ESP.rub = ESP.active != null ? t : null, ESP.frame());
    }
    return;
  }
  if (ESP.ptrs.set(e.pointerId, {
    x: e.clientX,
    y: e.clientY
  }), ESP.twoPrev && ESP.ptrs.size >= 2) {
    const t = ESP.twoNow(),
      [n, a] = panDelta(ESP.twoPrev, t);
    pinch(ESP.V, ESP.twoPrev, t), ESP.panBy(n, a), ESP.twoPrev = t, ESP.frame();
    return;
  }
  if (ESP.panPtr) {
    ESP.panBy(e.clientX - ESP.panPtr.x, e.clientY - ESP.panPtr.y), ESP.panPtr.x = e.clientX, ESP.panPtr.y = e.clientY, ESP.frame();
    return;
  }
  if (ESP.orbitPtr) {
    orbitBy(ESP.V, e.clientX - ESP.orbitPtr.x, e.clientY - ESP.orbitPtr.y), ESP.orbitPtr.x = e.clientX, ESP.orbitPtr.y = e.clientY, ESP.frame();
    return;
  }
  if (ESP.down && !ESP.down.started) {
    if (!passedThreshold(ESP.down.x0, ESP.down.y0, e.clientX, e.clientY)) return;
    ESP.down.started = true;
    const t = ESP.down.item;
    if (ESP.itemMode()) {
      if (t && canDragItem(def(t), ESP.selUid === t.uid)) {
        ESP.select(t);
        const n = ESP.groundAt(ESP.down.x0, ESP.down.y0) || [t.x, t.z];
        ESP.drag = {
          off: [t.x - n[0], t.z - n[1]],
          start: ESP.poseOf(t),
          moved: true,
          grp: posterGroup(ESP.S.items, t).filter(o => o !== t).map(o => ({ o, l: toLocal(t.x, t.z, t.a, o.x, o.z), da: o.a - t.a, start: ESP.poseOf(o) })) // v3.30 a poster wall moves as one
        };
      } else ESP.topDown || ESP.panMode ? ESP.panPtr = {
        x: e.clientX,
        y: e.clientY
      } : ESP.orbitPtr = {
        x: e.clientX,
        y: e.clientY
      };
    } else {
      const n = ESP.down.hb || {};
      if (ESP.down.de) ESP.doorDrag = {
        ...ESP.down.de,
        before: JSON.stringify(ESP.S.walls[ESP.down.de.pi].doors)
      }, ESP.doorGhost.visible = false;else if (n.mid && ESP.S.walls[n.mid.pi]) {
        const a = ESP.groundAt(ESP.down.x0, ESP.down.y0);
        a && (ESP.editBefore = ESP.beginEdit(), ESP.push = {
          ...n.mid,
          n: segNormal(ESP.S.walls[n.mid.pi], n.mid.i),
          g0: a,
          base: JSON.stringify(ESP.S.walls[n.mid.pi]),
          last: 0,
          carry: carrySet(ESP.S.walls, n.mid.pi, n.mid.i, ESP.S.items).map(o => ({
            uid: o.uid,
            x: o.x,
            z: o.z
          }))
        }, ESP.editPi = n.mid.pi, ESP.editGood = true, ESP.selSeg = null, ESP.selDoor = null);
      } else if (n.corner && !(n.corner.pi === ESP.active && n.corner.j === ESP.S.walls[ESP.active].pts.length - 1)) ESP.editBefore = ESP.beginEdit(), ESP.corner = n.corner, ESP.selSeg = null, ESP.editPi = ESP.corner.pi, ESP.editGood = true;else if (ESP.tool === "door") ESP.topDown || ESP.panMode ? ESP.panPtr = {
        x: e.clientX,
        y: e.clientY
      } : ESP.orbitPtr = {
        x: e.clientX,
        y: e.clientY
      };else if (ESP.tool === "box") {
        const a = ESP.groundAt(ESP.down.x0, ESP.down.y0);
        a && (ESP.editBefore = ESP.beginEdit(), ESP.S.preset && (ESP.S.walls = []), ESP.boxA = a, ESP.active = null, ESP.S.walls.push({
          pts: [],
          closed: false
        }), ESP.boxIdx = ESP.S.walls.length - 1, ESP.editPi = ESP.boxIdx, ESP.editGood = false);
      } else ESP.draw = true, ESP.active == null && ESP.addPt(ESP.drawAt(ESP.down.x0, ESP.down.y0));
    }
  }
  if (ESP.drag) {
    const t = ESP.selItem(),
      n = ESP.groundAt(e.clientX, e.clientY);
    if (!t || !n) return;
    const a = snapPose(ESP.W, t, n[0] + ESP.drag.off[0], n[1] + ESP.drag.off[1], itemStep(ESP.V.dist)),
      o = t.host || t.mode;
    applyPose(ESP.W, t, a), ESP.moveGroup(t), ESP.drag.join = a.join || null, ESP.showHl(a), ((a.host || a.mode) !== o || a.join) && a.hl && ESP.drag.lastJoin !== a.join && ESP.sSnap(), ESP.drag.lastJoin = a.join, ESP.syncItems(), ESP.frame();
    return;
  }
  if (ESP.doorDrag) {
    const t = ESP.groundAt(e.clientX, e.clientY),
      n = doorList(ESP.S.walls).find(s => s.pi === ESP.doorDrag.pi && s.k === ESP.doorDrag.k);
    if (!t || !n) return;
    const a = n.t + (t[0] - n.x) * n.ux + (t[1] - n.z) * n.uz,
      o = resizeDoor(ESP.S.walls, ESP.doorDrag.pi, ESP.doorDrag.k, ESP.doorDrag.end, a, 0.5);
    o && o.w !== ESP.doorDrag.w && (ESP.doorDrag.w = o.w, ESP.toast(`Door ${fmtFt(o.w)} wide`)), ESP.S.preset = null, ESP.rebuildSoon();
    return;
  }
  if (ESP.boxA) {
    const t = ESP.groundAt(e.clientX, e.clientY);
    if (!t) return;
    const n = boxRect(ESP.boxA, t, snapStep(ESP.V.dist));
    ESP.S.walls[ESP.boxIdx] = n || {
      pts: [],
      closed: false
    }, ESP.S.preset = null, ESP.editGood = !!n && editOk(ESP.S.walls, ESP.boxIdx), ESP.rebuildSoon();
    return;
  }
  if (ESP.corner) {
    const t = ESP.groundAt(e.clientX, e.clientY);
    if (!t) return;
    const n = snapStep(ESP.V.dist),
      a = ESP.S.walls[ESP.corner.pi];
    if (!a) return;
    dragCornerDoors(a, ESP.corner.j, Math.round(t[0] / n) * n, Math.round(t[1] / n) * n), ESP.S.preset = null, ESP.editGood = editOk(ESP.S.walls, ESP.corner.pi), ESP.rebuildSoon();
    return;
  }
  if (ESP.push) {
    const t = ESP.groundAt(e.clientX, e.clientY);
    if (!t) return;
    const n = snapStep(ESP.V.dist),
      a = Math.round(((t[0] - ESP.push.g0[0]) * ESP.push.n[0] + (t[1] - ESP.push.g0[1]) * ESP.push.n[1]) / n) * n,
      o = JSON.parse(ESP.push.base);
    if (pushWall(o, ESP.push.i, a)) ESP.S.walls[ESP.push.pi] = o, ESP.push.last = a, ESP.editGood = editOk(ESP.S.walls, ESP.push.pi);else {
      const s = JSON.parse(ESP.push.base);
      pushWall(s, ESP.push.i, ESP.push.last), ESP.S.walls[ESP.push.pi] = s, ESP.editGood = false;
    }
    for (const s of ESP.push.carry) {
      const l = ESP.S.items.find(i => i.uid === s.uid);
      l && (l.x = s.x + ESP.push.n[0] * ESP.push.last, l.z = s.z + ESP.push.n[1] * ESP.push.last);
    }
    ESP.S.preset = null, ESP.syncItems(), ESP.rebuildSoon();
    return;
  }
  if (ESP.draw) {
    const t = ESP.drawAt(e.clientX, e.clientY);
    if (t) {
      const n = !!(t.aligned || t.close);
      n && !ESP.wasAligned && ESP.sSnap(), ESP.wasAligned = n, ESP.rub = t, ESP.cursorDot.position.set(t.x, ESP.wallHt() + 0.15, t.z), ESP.cursorDot.visible = true, ESP.frame();
    }
    return;
  }
}));
ESP.onUp = ESP.guard(e => {
  if (ESP.walkOn && ESP.phase !== "build") { ESP.ptrs.delete(e.pointerId); return; }
  ESP.ptrs.delete(e.pointerId), ESP.ptrs.size < 2 && (ESP.twoPrev = null);
  const t = e.pointerType !== "mouse";
  if (!ESP.ptrs.size) {
    if (ESP.down && !ESP.down.started && (ESP.phase === "place" && (ESP.stamp || ESP.picker) ? ESP.down.item ? (ESP.startStamp(ESP.down.item), ESP.toast("Same again: " + def(ESP.down.item).name)) : ESP.stamp ? ESP.stampAt(ESP.down.x0, ESP.down.y0) : ESP.toast("Tap a placed item to copy it") : ESP.itemMode() ? ESP.select(ESP.down.item || null) : ESP.tapBuild(ESP.down.x0, ESP.down.y0, ESP.down.hb || {})), ESP.draw && (ESP.rub && ESP.addPt(ESP.rub), ESP.draw = null, ESP.rub = null, ESP.cursorDot.visible = false), ESP.corner && (ESP.corner = null, ESP.selDoor = null, ESP.sTile(true), ESP.finishEdit(ESP.editBefore, t), ESP.editBefore = null), ESP.doorDrag) {
      const n = JSON.stringify(ESP.S.walls[ESP.doorDrag.pi].doors) !== ESP.doorDrag.before;
      ESP.doorDrag = null, n && (ESP.sSnap(), ESP.wallsChanged());
    }
    if (ESP.push) {
      const n = ESP.push.last !== 0 || !ESP.editGood;
      ESP.push = null, n ? (ESP.sTile(true), ESP.finishEdit(ESP.editBefore, t, ESP.editGood ? "Wall moved" : "")) : (ESP.editPi = null, ESP.editGood = true, ESP.rebuildSoon()), ESP.editBefore = null;
    }
    if (ESP.boxA) {
      const n = ESP.boxIdx,
        a = ESP.S.walls[ESP.boxIdx] && ESP.S.walls[ESP.boxIdx].closed;
      a || ESP.S.walls.splice(ESP.boxIdx, 1), ESP.boxA = null, ESP.boxIdx = null, a ? (ESP.editGood && (ESP.sSnap(), ESP.celebrate(ESP.S.walls[n])), ESP.finishEdit(ESP.editBefore, t, "Room made"), ESP.setTool("view")) : (ESP.editPi = null, ESP.editGood = true, ESP.wallsChanged()), ESP.editBefore = null;
    }
    ESP.down = null, ESP.orbitPtr = null, ESP.panPtr = null, ESP.tapInfo = null, ESP.endDrag(false), ESP.needSave && (ESP.needSave = false, ESP.save());
  }
});
ESP.cv.addEventListener("pointerup", ESP.onUp);
ESP.cv.addEventListener("pointercancel", ESP.guard(e => {
  if (ESP.walkOn && ESP.phase !== "build") { ESP.ptrs.delete(e.pointerId); return; }
  ESP.ptrs.delete(e.pointerId), ESP.ptrs.size < 2 && (ESP.twoPrev = null), ESP.ptrs.size || (ESP.endDrag(true), (ESP.corner || ESP.push) && ESP.editBefore && ESP.putBack(ESP.editBefore), ESP.editBefore = null, ESP.editPi = null, ESP.editGood = true, ESP.orbitPtr = ESP.panPtr = ESP.tapInfo = ESP.down = ESP.corner = ESP.push = ESP.draw = ESP.rub = null, ESP.boxA && (ESP.S.walls.splice(ESP.boxIdx, 1), ESP.boxA = ESP.boxIdx = null), ESP.rebuildSoon(), ESP.needSave && (ESP.needSave = false, ESP.save()));
}));
ESP.cv.addEventListener("pointerleave", e => {
  if (ESP.walkOn && ESP.phase !== "build") return;
  e.pointerType === "mouse" && !ESP.ptrs.size && (ESP.cursorDot.visible = false, ESP.doorGhost.visible = false, ESP.frame());
});
ESP.cv.addEventListener("wheel", e => {
  if (ESP.walkOn && ESP.phase !== "build") { e.preventDefault(); return; }
  e.preventDefault(), zoomBy(ESP.V, e.deltaY > 0 ? 1.1 : 0.9), ESP.frame();
}, {
  passive: false
});
ESP.verTaps = [];
ESP.$("#verBuild").addEventListener("pointerdown", () => {
  const e = performance.now();
  if (ESP.verTaps = ESP.verTaps.filter(t => e - t < 700).concat(e), ESP.verTaps.length >= 3) {
    ESP.verTaps = [];
    const t = ESP.$("#dbg");
    t.classList.toggle("hidden"), t.classList.contains("hidden") || ESP.dbgUI();
  }
});
ESP.dbgUI = function dbgUI() {
  const e = ESP.R.info;
  ESP.$("#dbg").textContent = `Event Space Planner v3.39 debug
${navigator.userAgent}
screen ${innerWidth}x${innerHeight} dpr ${devicePixelRatio} (render ${ESP.R.getPixelRatio()})
phase ${ESP.phase} items ${ESP.S.items.length} walls ${segments(ESP.S.walls).length} drawing ${ESP.active}
view ${JSON.stringify(ESP.V)}
GPU geometries ${e.memory.geometries} textures ${e.memory.textures} draw calls ${e.render.calls}
context lost ${ESP.DBG.lost} restored ${ESP.DBG.restored} crashes ${ESP.DBG.crashes}
last error: ${ESP.DBG.err || "none"}`;
}
addEventListener("keydown", e => {
  if (!ESP.$("#build").classList.contains("on")) return;
  const t = e.key.toLowerCase();
  (e.ctrlKey || e.metaKey) && (t === "y" || t === "z" && e.shiftKey) ? (e.preventDefault(), ESP.redo()) : (e.ctrlKey || e.metaKey) && t === "z" ? (e.preventDefault(), ESP.undo()) : t === "r" && ESP.selItem() ? ESP.$("#btnRot").click() : (t === "delete" || t === "backspace") && ESP.selItem() ? ESP.$("#btnDel").click() : t === "t" && !e.ctrlKey && !e.metaKey ? ESP.setTop(!ESP.topDown) : t === "escape" && ESP.pendEdit ? ESP.cancelEdit() : t === "escape" && (ESP.stamp || ESP.picker) ? ESP.endStamp() : t === "escape" && ESP.phase === "build" && ESP.tool !== "view" ? ESP.setTool("view") : t === "escape" && (ESP.select(null), ESP.closeSheet());
});
addEventListener("pagehide", ESP.saveNow);
