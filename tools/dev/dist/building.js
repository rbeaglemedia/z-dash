import {
  createStage,
  scanFinite
} from "./chunk-7CUFA5YL.js";
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  GUI,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  RingGeometry,
  SRGBColorSpace,
  clear,
  devUrl,
  el,
  fetchJson,
  readFavs,
  repoUrl,
  shotLabel,
  writeFav
} from "./chunk-JNBKNBFJ.js";

// tools/dev/src/building.js
var ANGLES = [
  { id: "front", name: "Front", azimuth: 0, polar: 1.15 },
  { id: "three", name: "3/4", azimuth: 0.7, polar: 1.05 },
  { id: "side", name: "Side", azimuth: 1.5708, polar: 1.15 },
  { id: "back", name: "Back", azimuth: 3.1416, polar: 1.15 },
  { id: "top", name: "Top", azimuth: 0.4, polar: 0.35 }
];
function createModule() {
  let alive = false;
  let host = null;
  let ctx = null;
  let catalog = null;
  let scale = null;
  let stage = null;
  let gui = null;
  let eqA = null;
  let eqB = null;
  let edit = "a";
  let compare = false;
  let angleId = "three";
  let turn = false;
  let ready = false;
  let pending = null;
  let checkerNote = "";
  const errors = [];
  const groups = { a: null, b: null };
  const ui = {};
  function defaults() {
    return Object.assign({}, catalog.defaults);
  }
  function eqOf(w) {
    return w === "b" ? eqB : eqA;
  }
  function hook() {
    const orig = console.error;
    console.error = (...a) => {
      errors.push(a.map(String).join(" "));
      orig.apply(console, a);
    };
    const onErr = (e) => errors.push(String(e.message || e));
    window.addEventListener("error", onErr);
    return () => {
      console.error = orig;
      window.removeEventListener("error", onErr);
    };
  }
  let unhook = () => {
  };
  function purpose(eq) {
    return catalog.purposes[eq.purpose] || catalog.purposes.garage;
  }
  function door(eq) {
    return catalog.slots.door.options.find((o) => o.id === eq.door) || catalog.slots.door.options[0];
  }
  function roof(eq) {
    return catalog.slots.roof.options.find((o) => o.id === eq.roof) || catalog.slots.roof.options[0];
  }
  function wall(eq) {
    return catalog.slots.wall.options.find((o) => o.id === eq.wall) || catalog.slots.wall.options[0];
  }
  function disposeGroup(g) {
    if (!g) return;
    g.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material && o.material.dispose) o.material.dispose();
    });
    if (g.parent) g.parent.remove(g);
  }
  function signTexture(text, accent) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = "#140818";
    g.fillRect(0, 0, 512, 128);
    g.strokeStyle = accent;
    g.lineWidth = 8;
    g.strokeRect(8, 8, 496, 112);
    g.fillStyle = "#fff6fb";
    g.font = "700 72px Orbitron, system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 256, 68);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }
  function build(eq) {
    const g = new Group();
    const bay = catalog.bay;
    const p = purpose(eq);
    const d = door(eq);
    const r = roof(eq);
    const w = wall(eq);
    const shell = w.color || p.wall || "#140818";
    const mat = (color) => new MeshLambertMaterial({ color });
    const basic = (color) => new MeshBasicMaterial({ color });
    const floor = new Mesh(new BoxGeometry(bay.w, 0.08, bay.d), mat(p.floor));
    floor.position.y = 0.04;
    const left = new Mesh(new BoxGeometry(0.16, bay.h, bay.d), mat(shell));
    left.position.set(-bay.w / 2, bay.h / 2, 0);
    const right = left.clone();
    right.position.x = bay.w / 2;
    right.material = mat(shell);
    const back = new Mesh(new BoxGeometry(bay.w, bay.h, 0.16), mat(shell));
    back.position.set(0, bay.h / 2, -bay.d / 2);
    const frontL = new Mesh(new BoxGeometry((bay.w - d.w) / 2, bay.h, 0.16), mat(shell));
    frontL.position.set(-(d.w / 2 + (bay.w - d.w) / 4), bay.h / 2, bay.d / 2);
    const frontR = frontL.clone();
    frontR.material = mat(shell);
    frontR.position.x *= -1;
    const lintelH = Math.max(0.08, bay.h - d.h);
    const lintel = new Mesh(new BoxGeometry(d.w, lintelH, 0.16), mat(shell));
    lintel.position.set(0, d.h + lintelH / 2, bay.d / 2);
    const doorMesh = new Mesh(new BoxGeometry(d.w, d.h, 0.08), mat("#14081c"));
    doorMesh.position.set(0, d.h / 2, bay.d / 2 + 0.02);
    doorMesh.name = "zd-door";
    doorMesh.userData.size = { w: d.w, h: d.h };
    g.add(floor, left, right, back, frontL, frontR, lintel, doorMesh);
    const winMat = basic(p.accent);
    for (let i = 0; i < 3; i++) {
      const win = new Mesh(new BoxGeometry(0.7, 0.5, 0.04), winMat);
      win.position.set(-1.2 + i * 1.2, bay.h * 0.62, bay.d / 2 + 0.1);
      g.add(win);
    }
    const roofMat = mat(p.ceil || "#14120c");
    const slab = new Mesh(new BoxGeometry(bay.w + 0.4, 0.12, bay.d + 0.4), roofMat);
    slab.position.y = bay.h + 0.06;
    g.add(slab);
    if (r.kind === "pad") {
      const pad = new Mesh(new RingGeometry(1.2, 1.7, 24), basic(p.accent));
      pad.rotation.x = -Math.PI / 2;
      pad.position.y = bay.h + 0.14;
      g.add(pad);
    } else if (r.kind === "tank") {
      const tank = new Mesh(new CylinderGeometry(0.7, 0.7, 0.8, 16), mat("#3a1550"));
      tank.position.y = bay.h + 0.5;
      g.add(tank);
    } else if (r.kind === "antenna") {
      const ant = new Mesh(new CylinderGeometry(0.04, 0.04, 1.4, 8), basic(p.accent));
      ant.position.set(bay.w * 0.3, bay.h + 0.8, 0);
      g.add(ant);
    }
    const sign = new Mesh(new PlaneGeometry(2.4, 0.6), new MeshBasicMaterial({ map: signTexture(p.sign, p.accent) }));
    sign.position.set(0, bay.h - 0.5, bay.d / 2 + 0.18);
    g.add(sign);
    const z = scale.z;
    const car = new Mesh(
      new BoxGeometry(z.l, z.h, z.w),
      new MeshBasicMaterial({ color: 4122367, wireframe: true })
    );
    car.position.set(0, z.h / 2, bay.d / 2 + 2.4);
    car.name = "zd-z";
    g.add(car);
    const pole = new Mesh(new BoxGeometry(0.06, scale.ellie, 0.06), basic(16732120));
    pole.position.set(d.w / 2 + 0.4, scale.ellie / 2, bay.d / 2 + 0.4);
    pole.name = "zd-ellie-pole";
    g.add(pole);
    return g;
  }
  function show(which) {
    if (groups.a) groups.a.visible = which !== "b";
    if (groups.b) groups.b.visible = compare && which !== "a";
  }
  function rebuild(which) {
    disposeGroup(groups[which]);
    const g = build(eqOf(which));
    if (which === "b") g.position.x = 0;
    groups[which] = g;
    stage.scene.add(g);
    if (which === "a") {
      const bay = catalog.bay;
      const dist = Math.max(bay.w, bay.h) * 0.9;
      stage.setTarget("a", bay.h * 0.45, dist);
      stage.ruler.visible = false;
    }
  }
  function archLines(eq) {
    const d = door(eq);
    const r = roof(eq);
    const rules = catalog.architecture;
    const needW = rules.carClear.w + rules.carClear.spare;
    const needH = rules.carClear.h + rules.carClear.spare;
    const lines = [];
    lines.push((d.w >= needW ? "PASS  " : "FAIL  ") + "door width " + d.w.toFixed(2) + " m vs car " + rules.carClear.w + " + " + rules.carClear.spare);
    lines.push((d.h >= needH ? "PASS  " : "FAIL  ") + "door height " + d.h.toFixed(2) + " m vs car " + rules.carClear.h + " + " + rules.carClear.spare);
    lines.push((d.w >= rules.ellieDoor ? "PASS  " : "FAIL  ") + "person clearance " + d.w.toFixed(2) + " m vs " + rules.ellieDoor + " m");
    lines.push((r.kind === "slab" ? "FAIL  " : "PASS  ") + "roof " + r.name + (r.kind === "slab" ? " is a blank slab" : " has a roof feature"));
    const dist = stage ? stage.state.radius : 12;
    const fov = 32 * Math.PI / 180;
    const px = 0.6 / Math.max(0.1, dist) / (2 * Math.tan(fov / 2)) * 760;
    lines.push((px >= rules.signMinPx ? "PASS  " : "FAIL  ") + "sign about " + Math.round(px) + " px");
    lines.push("Ellie pole " + scale.ellie.toFixed(2) + " m \xB7 370Z " + scale.z.l + " \xD7 " + scale.z.w + " \xD7 " + scale.z.h + " m");
    lines.push(checkerNote);
    return lines;
  }
  function paintBar() {
    ui.bar.textContent = archLines(eqOf(edit)).join("\n");
  }
  function paintChips() {
    clear(ui.chips);
    const secs = el("div", "zsecs");
    const sections = [{ id: "purpose", name: "PLACE" }].concat(catalog.sections.filter((s) => s.id !== "purpose"));
    for (const sec of catalog.sections) {
      const b = el("button", "zsec" + (ui.section === sec.id ? " on" : ""), sec.name);
      b.type = "button";
      b.addEventListener("click", () => {
        ui.section = sec.id;
        paintChips();
      });
      secs.appendChild(b);
    }
    ui.chips.appendChild(secs);
    const row = el("div", "zitems");
    const eq = eqOf(edit);
    if (ui.section === "purpose") {
      for (const [id, p] of Object.entries(catalog.purposes)) {
        const b = el("button", "zchip" + (eq.purpose === id ? " on" : ""), p.name);
        b.type = "button";
        b.addEventListener("click", () => {
          eq.purpose = id;
          rebuild(edit);
          paintChips();
          paintBar();
        });
        row.appendChild(b);
      }
    } else if (ui.section === "looks") {
      const name = el("input", "zname");
      name.placeholder = "Favorite name";
      const save = el("button", "zchip", "SAVE LOOK");
      save.type = "button";
      save.addEventListener("click", () => {
        writeFav("building", (name.value || "Look").trim(), Object.assign({}, eq));
        paintChips();
      });
      row.append(name, save);
      for (const [title, saved] of Object.entries(readFavs("building"))) {
        const b = el("button", "zchip", title);
        b.type = "button";
        b.addEventListener("click", () => {
          const next = Object.assign(defaults(), saved);
          if (edit === "b") eqB = next;
          else eqA = next;
          rebuild(edit);
          refreshGui();
          paintChips();
          paintBar();
        });
        row.appendChild(b);
      }
    } else {
      const sec = catalog.sections.find((s) => s.id === ui.section);
      for (const slot of sec && sec.slots || []) {
        const spec = catalog.slots[slot];
        if (!spec) continue;
        row.appendChild(el("div", "zgroup", spec.name));
        for (const opt of spec.options) {
          const b = el("button", "zchip" + (eq[slot] === opt.id ? " on" : ""), opt.name);
          b.type = "button";
          b.addEventListener("click", () => {
            eq[slot] = opt.id;
            ui.silent = true;
            if (ui.ctrls[slot]) ui.ctrls[slot].setValue(opt.id);
            ui.silent = false;
            rebuild(edit);
            paintChips();
            paintBar();
          });
          row.appendChild(b);
        }
      }
    }
    ui.chips.appendChild(row);
    void sections;
  }
  function refreshGui() {
    if (!ui.ctrls) return;
    const eq = eqOf(edit);
    ui.silent = true;
    for (const [slot, ctrl] of Object.entries(ui.ctrls)) if (eq[slot] != null) ctrl.setValue(eq[slot]);
    ui.silent = false;
  }
  function makeLabel() {
    const angle = ANGLES.find((a) => a.id === angleId) || ANGLES[1];
    const p = purpose(eqA);
    return p.name + " \xB7 " + angle.name + " \xB7 " + door(eqA).name + " \xB7 f0";
  }
  function capture(download) {
    show(compare ? "a" : "a");
    stage.render();
    const label = makeLabel();
    const shot = shotLabel(stage.canvas, label);
    ui.status.dataset.shot = label;
    if (download) {
      const a = document.createElement("a");
      a.href = shot.url;
      a.download = "building-" + (eqA.purpose || "garage") + ".png";
      a.click();
    }
    return { label, url: shot.url, bright: shot.bright };
  }
  function layout() {
    host.innerHTML = "";
    const spin = el("div", "zspin");
    const stageHost = el("div", "zstage");
    ui.angles = el("div", "zangles");
    ui.ruler = el("div", "zruler", "Wire box is the 370Z. Pink pole is 1.50 m.");
    const menu = el("aside", "zmenu");
    ui.status = el("div", "zstatus", "Buildings");
    ui.chips = el("div", "zchips");
    ui.gui = el("div", "zgui");
    ui.bar = el("pre", "zbar");
    stageHost.append(ui.ruler, ui.angles);
    menu.append(ui.status, ui.chips, ui.gui, ui.bar);
    spin.append(stageHost, menu);
    host.appendChild(spin);
    stage = createStage(stageHost, { fov: 32, bg: 459023, rings: [4, 6, 8], grid: 16, ellie: scale.ellie });
    stage.ruler.visible = false;
    stage.beforePane = show;
    const gameLight = { hemi: ["#ff4fd8", "#041018", 0.55], key: ["#3ee6ff", 1.2, [-6, 10, 8]], fill: ["#ff4fd8", 0.35, [4, 3, -2]], bg: "#07010f" };
    stage.setLights(gameLight);
    for (const angle of ANGLES) {
      const b = el("button", "zbtn" + (angle.id === angleId ? " on" : ""), angle.name);
      b.type = "button";
      b.dataset.id = angle.id;
      b.addEventListener("click", () => {
        angleId = angle.id;
        stage.setAngle(angle.azimuth, angle.polar);
        for (const btn of ui.angles.querySelectorAll("button[data-id]")) btn.classList.toggle("on", btn.dataset.id === angle.id);
        paintBar();
      });
      ui.angles.appendChild(b);
    }
    const turnBtn = el("button", "zbtn", "TURN");
    turnBtn.type = "button";
    turnBtn.addEventListener("click", () => {
      turn = !turn;
      stage.setTurn(turn);
      turnBtn.classList.toggle("on", turn);
    });
    const compareBtn = el("button", "zbtn", "COMPARE");
    compareBtn.type = "button";
    compareBtn.addEventListener("click", () => {
      compare = !compare;
      stage.setCompare(compare);
      compareBtn.classList.toggle("on", compare);
      if (compare && !groups.b) rebuild("b");
    });
    const shot = el("button", "zbtn", "SAVE SHOT");
    shot.type = "button";
    shot.addEventListener("click", () => capture(true));
    ui.angles.append(turnBtn, compareBtn, shot);
    ui.compareBtn = compareBtn;
    gui = new GUI({ container: ui.gui, title: "ROOM", autoPlace: false });
    const names = {};
    for (const [id, p] of Object.entries(catalog.purposes)) names[p.name] = id;
    ui.viewEq = Object.assign({}, eqA);
    ui.ctrls = {};
    ui.ctrls.purpose = gui.add(ui.viewEq, "purpose", names).name("PLACE").onChange((v) => {
      if (ui.silent) return;
      eqOf(edit).purpose = v;
      rebuild(edit);
      paintChips();
      paintBar();
    });
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      const choices = {};
      for (const opt of spec.options) choices[opt.name] = opt.id;
      ui.ctrls[slot] = gui.add(ui.viewEq, slot, choices).name(spec.name).onChange((v) => {
        if (ui.silent) return;
        eqOf(edit)[slot] = v;
        rebuild(edit);
        paintChips();
        paintBar();
      });
    }
    ui.section = "purpose";
    stage.setAngle(0.7, 1.05);
  }
  async function setView(opts) {
    opts = opts || {};
    if (opts.eq) eqA = Object.assign(defaults(), opts.eq);
    if (opts.purpose) eqA.purpose = opts.purpose;
    if (opts.door) eqA.door = opts.door;
    rebuild("a");
    if (opts.compare) {
      compare = true;
      stage.setCompare(true);
      ui.compareBtn.classList.add("on");
      eqB = Object.assign(defaults(), opts.eqB || { door: "car" });
      rebuild("b");
    } else if (opts.compare === false) {
      compare = false;
      stage.setCompare(false);
    }
    if (opts.angle) {
      angleId = opts.angle;
      const angle = ANGLES.find((a) => a.id === opts.angle);
      if (angle) stage.setAngle(angle.azimuth, angle.polar);
    }
    if (opts.turn != null) {
      turn = !!opts.turn;
      stage.setTurn(turn);
    }
    refreshGui();
    paintChips();
    paintBar();
  }
  async function sweep() {
    const fails = [];
    const notes = [];
    const before = errors.length;
    const baseDoor = door(defaults());
    const lines0 = archLines(defaults());
    if (!lines0.some((l) => l.startsWith("FAIL") && l.includes("door width"))) fails.push("game door should fail the car width bar");
    eqA = defaults();
    rebuild("a");
    let bad = scanFinite(groups.a);
    if (bad.length) fails.push("base " + bad.join(","));
    for (const id of Object.keys(catalog.purposes)) {
      eqA = defaults();
      eqA.purpose = id;
      rebuild("a");
      bad = scanFinite(groups.a);
      if (bad.length) fails.push("purpose " + id + " " + bad.join(","));
    }
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      for (const opt of spec.options) {
        eqA = defaults();
        eqA[slot] = opt.id;
        try {
          rebuild("a");
        } catch (err) {
          fails.push(slot + " " + opt.id + " " + err.message);
          continue;
        }
        bad = scanFinite(groups.a);
        if (bad.length) fails.push(slot + "=" + opt.id + " " + bad.join(","));
        if (slot === "door") {
          const mesh = groups.a.getObjectByName("zd-door");
          const size = mesh && mesh.userData.size;
          if (!size || Math.abs(size.w - opt.w) > 1e-3 || Math.abs(size.h - opt.h) > 1e-3) {
            fails.push("door size leftover " + opt.id);
          }
        }
      }
    }
    eqA = Object.assign(defaults(), { purpose: "showroom", door: "car", roof: "antenna", wall: "cyan" });
    rebuild("a");
    const mixedDoor = groups.a.getObjectByName("zd-door").userData.size;
    eqA = defaults();
    rebuild("a");
    const back = groups.a.getObjectByName("zd-door").userData.size;
    if (Math.abs(back.w - baseDoor.w) > 1e-3 || Math.abs(back.h - baseDoor.h) > 1e-3) fails.push("door leftover after reset");
    if (Math.abs(mixedDoor.w - 2.4) > 1e-3) fails.push("clears-the-z door was not applied");
    const wide = archLines(Object.assign(defaults(), { door: "car", roof: "antenna" }));
    if (wide.filter((l) => l.startsWith("FAIL") && (l.includes("door") || l.includes("roof"))).length) {
      fails.push("clears-the-z should pass door and roof " + wide.filter((l) => l.startsWith("FAIL")).join(" | "));
    }
    compare = true;
    stage.setCompare(true);
    eqB = Object.assign(defaults(), { door: "car" });
    rebuild("b");
    stage.setAngle(0.4, 1);
    stage.setAngle(1.2, 0.8);
    const sync = stage.syncState();
    const d = (a, b) => {
      let x = Math.abs(a - b) % (Math.PI * 2);
      return x > Math.PI ? Math.PI * 2 - x : x;
    };
    if (d(sync.thetaA, sync.thetaB) > 0.02 || d(sync.phiA, sync.phiB) > 0.02 || Math.abs(sync.radiusA - sync.radiusB) > 0.05) {
      fails.push("compare drifted");
    }
    compare = false;
    stage.setCompare(false);
    eqA = defaults();
    rebuild("a");
    angleId = "front";
    stage.setAngle(0, 1.15);
    const shot = capture(false);
    if (shot.label !== makeLabel()) fails.push("label " + shot.label + " != " + makeLabel());
    if (!(shot.bright > 8)) fails.push("label pixels " + shot.bright);
    const fresh = errors.slice(before);
    for (const e of fresh) fails.push("error " + e);
    paintBar();
    return { fails, notes, label: shot.label, errors: fresh };
  }
  return {
    id: "building",
    title: "BUILDINGS",
    async mount(container, context) {
      alive = true;
      host = container;
      ctx = context || { onSave() {
      } };
      unhook = hook();
      try {
        catalog = await fetchJson(devUrl("catalogs/building.json"));
        scale = await fetchJson(devUrl("scale.json"));
        try {
          const res = await fetch(repoUrl(catalog.architecture.checker));
          checkerNote = res.ok ? "Architecture checker file is in this branch." : "Official architecture checker is not in this branch. The bar uses the same metre rules. The game door is still the narrow one.";
        } catch (err) {
          checkerNote = "Official architecture checker is not in this branch. The bar uses the same metre rules. The game door is still the narrow one.";
        }
        eqA = defaults();
        eqB = defaults();
        layout();
        rebuild("a");
        paintChips();
        paintBar();
        if (pending) await setView(pending);
        pending = null;
        ready = true;
        if (window.__SPIN) {
          window.__SPIN.building = {
            sweep,
            capture,
            setView,
            frames: () => stage.samples(),
            errors: () => errors.slice()
          };
        }
        if (ctx.signal) ctx.signal.addEventListener("abort", () => this.unmount());
      } catch (err) {
        this.unmount();
        throw err;
      }
    },
    unmount() {
      alive = false;
      ready = false;
      try {
        unhook();
      } catch (err) {
      }
      disposeGroup(groups.a);
      disposeGroup(groups.b);
      groups.a = null;
      groups.b = null;
      if (gui) gui.destroy();
      if (stage) stage.dispose();
      gui = null;
      stage = null;
      if (host) host.innerHTML = "";
    },
    save() {
      return { eqA: Object.assign({}, eqA), eqB: eqB ? Object.assign({}, eqB) : null, angle: angleId, compare, turn, edit };
    },
    load(s) {
      if (!ready) pending = s;
      else setView(s);
    }
  };
}
export {
  createModule
};
