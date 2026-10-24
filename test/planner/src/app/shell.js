// Lane: screens, build-tool chrome, toast and sounds.
import { ESP } from './runtime.js';
import * as THREE from 'three';
import { PRESETS, DEFAULT_PRESET, presetWalls, deleteSegment, sizeLabel, closeWalls, removeDoor } from '../walls.js';
import { def } from '../logic.js';
import { TECH_DEFAULT } from '../fun.js';
import { autoDoor } from '../autodoor.js';
if (typeof ESP.simStop !== 'function') ESP.simStop = function simStop() {};


ESP.showScreen = function showScreen(e) {
  ESP.$$(".screen").forEach(t => t.classList.toggle("on", t.id === e)), e === "build" && (ESP.resize(), ESP.frame()), e === "start" && ESP.startUI();
}
ESP.startUI = function startUI() {
  const e = ESP.loadSaved(),
    t = e && (e.walls.length || e.items.length);
  ESP.$("#btnOpen").disabled = !t, ESP.$("#savedNote").textContent = t ? `Saved layout: ${sizeLabel(e.walls)}, ${e.items.length} item${e.items.length === 1 ? "" : "s"} (${e.env === "outdoor" ? "Outdoor" : "Indoor"})` : "No saved layout yet.";
}
ESP.$("#btnNew").onclick = () => {
  const e = ESP.loadSaved();
  e && (e.walls.length || e.items.length) && !confirm("Start a new layout? This replaces your saved layout.") || (ESP.S.venue = null, ESP.S.fill = null, ESP.S.lvl = 1, ESP.S.levels = {}, ESP.S.walls = [], ESP.S.items = [], ESP.S.env = "indoor", ESP.$$(".choice").forEach(t => t.classList.toggle("on", t.dataset.env === "indoor")), ESP.showScreen("setup"));
};
ESP.$("#btnOpen").onclick = () => {
  const e = ESP.loadSaved();
  e && (Object.assign(ESP.S, {
    env: e.env,
    walls: e.walls,
    items: e.items,
    venue: e.venue || null,
    fill: e.fill || null,
    lvl: e.lvl ?? 1,
    levels: e.levels || {},
    tech: e.tech || TECH_DEFAULT
  }), ESP.active = null, ESP.selSeg = null, ESP.setMute(e.mute), ESP.applyEnv(), ESP.select(null), ESP.setPhase("place"), ESP.resetView(), ESP.showScreen("build"), ESP.toast(e.migrated ? "Layout opened. Your floor was turned into walls." : "Layout opened"), ESP.histReset());
};
ESP.$$("[data-go]").forEach(e => e.onclick = () => ESP.showScreen(e.dataset.go));
ESP.$$(".choice").forEach(e => e.onclick = () => {
  ESP.$$(".choice").forEach(t => t.classList.toggle("on", t === e)), ESP.S.env = e.dataset.env;
});
ESP.$("#btnBuild").onclick = () => {
  ESP.usePreset(DEFAULT_PRESET[ESP.S.env]), ESP.applyEnv(), ESP.select(null), ESP.setPhase("build"), ESP.resetView(), ESP.save(), ESP.showScreen("build"), ESP.histReset();
};
ESP.$("#btnHome").onclick = () => {
  ESP.commitEdit(), ESP.endStamp(), ESP.saveNow(), ESP.closeSheet(), ESP.showScreen("start");
};
ESP.phase = "build",
  ESP.hintShown = false;
ESP.HINT_KEY = "esp.presetHint.v1";
ESP.hintT = 0;
ESP.showPresetHint = function showPresetHint() {
  if (ESP.hintShown || ESP.S.items.length || ESP.S.fill || ESP.sim) return;
  ESP.hintShown = true;
  try {
    if (!ESP.NO_SAVE) {
      if (localStorage.getItem(ESP.HINT_KEY)) return;
      localStorage.setItem(ESP.HINT_KEY, "1");
    }
  } catch {}
  const e = ESP.$("#presetTip");
  e.classList.remove("hidden"), ESP.$("#btnEvents").classList.add("pulse"), clearTimeout(ESP.hintT), ESP.hintT = setTimeout(() => {
    e.classList.add("hidden"), ESP.$("#btnEvents").classList.remove("pulse");
  }, 6e3);
}
ESP.setPhase = function setPhase(e) {
  ESP.phase = e, e !== "place" && ESP.simStop(), ESP.$("#btnRun") && ESP.$("#btnRun").classList.toggle("hidden", e !== "place"), e === "place" && ESP.$("#presetTip") ? setTimeout(ESP.showPresetHint, 0) : ESP.$("#presetTip") && ESP.$("#presetTip").classList.add("hidden"), e !== "place" && (ESP.stamp || ESP.picker) && ESP.$("#stampBar") && (ESP.stamp = null, ESP.picker = false, ESP.stampUI()), e === "build" && ESP.$("#drawTools") && (ESP.tool = "view", ESP.active = null, ESP.rub = null, ESP.$$("#drawTools button").forEach(n => n.classList.toggle("on", n.dataset.tool === "view"))), ESP.$$("#modes button").forEach(n => n.classList.toggle("on", n.dataset.phase === e)), ESP.$("#toolsBuild").classList.toggle("hidden", e !== "build"), ESP.$("#toolsPlace").classList.toggle("hidden", e !== "place"), e === "build" ? ESP.select(null) : (ESP.active = null, ESP.selSeg = null, ESP.rub = null), ESP.$("#presets").classList.toggle("hidden", e !== "build"), ESP.cursorDot.visible = false;
  const t = ESP.$("#hint");
  t.style.opacity = 1, ESP.setHint(), ESP.$("#drawTools").classList.toggle("hidden", e !== "build"), ESP.buildUI(), ESP.rebuildSoon();
}
ESP.setMode = e => ESP.setPhase(e === "move" ? "place" : "build");
ESP.usePreset = function usePreset(e) {
  ESP.S.preset = e, ESP.S.venue = null, ESP.S.fill = null, ESP.S.walls = presetWalls(e), ESP.active = null, ESP.selSeg = null, ESP.rub = null, ESP.renderPresets();
}
ESP.renderPresets = function renderPresets() {
  ESP.$("#presets").innerHTML = PRESETS.map(e => `<button data-p="${e.id}" class="${ESP.S.preset === e.id ? "on" : ""}">${e.name}</button>`).join(""), ESP.$$("#presets button[data-p]").forEach(e => e.onclick = () => {
    ESP.usePreset(e.dataset.p), autoDoor(ESP.W), ESP.resetView(), ESP.save(), ESP.rebuild(), ESP.sDrop();
  });
}
ESP.buildUI = function buildUI() {
  const e = ESP.$("#drawTools [data-tool=door]");
  e && e.classList.toggle("hidden", ESP.S.env === "outdoor" && !ESP.S.walls.some(n => n.pts.length >= 2)), e && e.classList.contains("hidden") && ESP.tool === "door" && (ESP.tool = "view", ESP.$$("#drawTools button").forEach(n => n.classList.toggle("on", n.dataset.tool === "view")), ESP.setHint()), ESP.$("#btnDelWall").textContent = ESP.selDoor ? "Delete door" : "Delete wall", ESP.$("#btnDelWall").disabled = !ESP.selSeg && !ESP.selDoor;
  const t = ESP.active != null && ESP.S.walls[ESP.active];
  ESP.$("#btnCloseWalls").classList.toggle("hidden", !(ESP.tool === "walls" && t && !t.closed && t.pts.length >= 3));
}
ESP.wallsChanged = function wallsChanged() {
  ESP.S.preset = null, ESP.renderPresets(), ESP.buildUI(), ESP.save(), ESP.rebuildSoon();
}
ESP.$$(".hUndo").forEach(e => e.onclick = ESP.undo);
ESP.$$(".hRedo").forEach(e => e.onclick = ESP.redo);
ESP.$("#btnDelWall").onclick = () => {
  if (ESP.selDoor) return removeDoor(ESP.S.walls, ESP.selDoor.pi, ESP.selDoor.k), ESP.selDoor = null, ESP.sTile(false), ESP.toast("Door removed"), ESP.wallsChanged();
  ESP.selSeg && (deleteSegment(ESP.S.walls, ESP.selSeg.pi, ESP.selSeg.i), ESP.selSeg = null, ESP.active = null, ESP.wallsChanged(), ESP.toast("Wall removed"));
};
ESP.setTool = function setTool(e) {
  ESP.tool = e, ESP.$$("#drawTools button").forEach(t => t.classList.toggle("on", t.dataset.tool === e)), ESP.tool !== "walls" && (ESP.active = null, ESP.rub = null, ESP.lock.axis = null), ESP.selDoor = null, ESP.selSeg = null, ESP.cursorDot.visible = false, ESP.setHint(), ESP.buildUI(), ESP.rebuildSoon();
}
ESP.$$("#drawTools button").forEach(e => e.onclick = () => ESP.commitEdit() || ESP.setTool(e.dataset.tool === ESP.tool && ESP.tool !== "view" ? "view" : e.dataset.tool));
ESP.setHint = function setHint() {
  const e = ESP.$("#hint");
  e.style.opacity = 1;
  const t = a => ` \xB7 Tap ${a} again to stop drawing`,
    n = ESP.topDown || ESP.panMode ? "pan" : "turn the view";
  e.textContent = ESP.phase !== "build" ? ESP.stamp ? "Tap the floor to add another \xB7 Tap Done when finished" : ESP.picker ? "Tap a placed item to copy it" : `Tap an item to select it \xB7 Drag items to move \xB7 Drag empty space to ${n}` : ESP.tool === "view" ? `Drag to ${n} \xB7 Pick Box, Walls or Door to draw or edit walls` : ESP.tool === "box" ? "Drag corner to corner to make a room \xB7 Drag a wall arrow to push or pull it" + t("Box") : ESP.tool === "door" ? "Tap a wall to add a 3 ft door" + t("Door") : "Tap point to point \xB7 Walls stay square" + t("Walls");
}
ESP.$("#btnCloseWalls").onclick = () => {
  if (ESP.active == null) return;
  const e = ESP.active;
  ESP.active = closeWalls(ESP.S.walls, ESP.active), ESP.celebrate(ESP.S.walls[e] && ESP.S.walls[e].closed ? ESP.S.walls[e] : ESP.S.walls[ESP.S.walls.length - 1]), ESP.rub = null, ESP.lock.axis = null, ESP.sSnap(), ESP.toast("Room closed"), ESP.wallsChanged(), ESP.setTool("view");
};
ESP.$("#btnWallsDone").onclick = () => {
  ESP.commitEdit(), ESP.active = null, ESP.rub = null, ESP.selSeg = null, ESP.setPhase("place"), ESP.save();
};
ESP.$$("[data-phase]").forEach(e => e.onclick = () => {
  ESP.commitEdit(), ESP.setPhase(e.dataset.phase);
});
ESP.$("#btnOk").onclick = () => {
  ESP.commitEdit(), ESP.sSnap(), ESP.toast("Kept");
};
ESP.$("#btnCancel").onclick = ESP.cancelEdit;
ESP.$("#btnTop").onclick = () => ESP.setTop(!ESP.topDown);
ESP.$("#btnPanMode").onclick = () => ESP.setPanMode(!ESP.panMode);
ESP.$("#btnWallsView").onclick = () => {
  ESP.setWallsView(ESP.WALLS_VIEWS[(ESP.WALLS_VIEWS.indexOf(ESP.wallsView) + 1) % 3]), ESP.toast("Walls: " + ESP.WV_NAME[ESP.wallsView]);
};
ESP.$("#btnSame").onclick = () => {
  if (ESP.stamp || ESP.picker) return ESP.endStamp();
  const e = ESP.selItem();
  e ? (ESP.startStamp(e), ESP.toast("Same again: " + def(e).name)) : (ESP.picker = true, ESP.stampUI());
};
ESP.$("#btnStampDone").onclick = ESP.endStamp;
ESP.$("#btnEvents").onclick = () => {
  ESP.$("#presetTip").classList.add("hidden"), ESP.$("#btnEvents").classList.remove("pulse"), ESP.showEventPresets();
};
ESP.$("#presetTip").onclick = () => ESP.$("#btnEvents").click();
ESP.$("#btnShare").onclick = () => {
  ESP.commitEdit(), ESP.shareLayout();
};
ESP.$("#btnReset").onclick = () => {
  ESP.resetView(), ESP.frame();
};
ESP.$("#btnMute").onclick = () => {
  ESP.setMute(!ESP.S.mute), ESP.save();
};
ESP.setMute = function setMute(e) {
  ESP.S.mute = e, ESP.$("#icoSnd .w").style.display = e ? "none" : "", ESP.$("#icoSnd .x").style.display = e ? "" : "none";
}
ESP.toastT;
ESP.toast = function toast(e) {
  const t = ESP.$("#toast");
  t.textContent = e, t.classList.add("on"), clearTimeout(ESP.toastT), ESP.toastT = setTimeout(() => t.classList.remove("on"), 1600);
}
ESP.actx,
  ESP.lastTone = 0;
ESP.tone = function tone(e, t, n, a, o = "sine") {
  if (ESP.S.mute) return;
  const s = performance.now();
  if (!(s - ESP.lastTone < 40)) {
    ESP.lastTone = s, ESP.DBG.tones = (ESP.DBG.tones || 0) + 1;
    try {
      ESP.actx = ESP.actx || new (window.AudioContext || window.webkitAudioContext)();
      const l = ESP.actx.createOscillator(),
        i = ESP.actx.createGain(),
        r = ESP.actx.currentTime;
      l.type = o, l.frequency.setValueAtTime(e, r), l.frequency.exponentialRampToValueAtTime(t, r + n * 0.6), i.gain.setValueAtTime(1e-4, r), i.gain.exponentialRampToValueAtTime(a, r + 5e-3), i.gain.exponentialRampToValueAtTime(1e-4, r + n), l.connect(i).connect(ESP.actx.destination), l.start(r), l.stop(r + n + 0.01);
    } catch {}
  }
}
ESP.buzz = e => {
    if (!ESP.S.mute && navigator.vibrate) try {
      navigator.vibrate(e);
    } catch {}
  },
  ESP.sTile = e => {
    ESP.tone(e ? 880 : 520, e ? 1320 : 340, 0.08, 0.12), ESP.buzz(6);
  },
  ESP.sDrop = () => {
    ESP.tone(420, 260, 0.12, 0.16), ESP.buzz(10);
  },
  ESP.sSnap = () => {
    ESP.tone(1500, 2400, 0.06, 0.14, "triangle"), ESP.buzz([8, 30, 8]);
  },
  ESP.sBad = () => {
    ESP.tone(150, 110, 0.22, 0.18, "square"), ESP.buzz([40, 40, 40]);
  },
  ESP.cv = ESP.$("#cv"),
  ESP.R = new THREE.WebGLRenderer({
    canvas: ESP.cv,
    antialias: true
  });
