import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import GUI from 'lil-gui';
import { prepareModel, fitHeight, fitPack, rawHeight, clipNamed } from './adventure-look.js';
import { applyEq, cloneMaterials, stamp, lookSnapshot, setWire, scanFinite, scanMaps } from './apply.js';
import { anatomyLines, measureActor } from './measure.js';
import { buildNeon } from './neon.js';
import { createStage, shotLabel } from './stage.js';
import { el, clear, devUrl, repoUrl, fetchJson, readFavs, writeFav } from './dom.js';

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();

function clipTitle(clip) {
  if (!clip) return 'still';
  const bit = String(clip.name || 'clip').split('|').pop();
  return bit || 'clip';
}

export function createModule() {
  let alive = false;
  let unhook = () => {};
  let stage = null;
  let gui = null;
  let catalog = null;
  let assets = null;
  let scale = null;
  let host = null;
  let ctx = null;
  const templates = new Map();
  const panes = { a: null, b: null };
  let eqA = null;
  let eqB = null;
  let edit = 'a';
  let lightId = 'game';
  let angleId = 'front';
  let compare = false;
  let overlay = false;
  let turn = true;
  let playing = true;
  let speed = 1;
  let wire = false;
  let bonesOn = false;
  let gridOn = true;
  let ready = false;
  let pending = null;
  const errors = [];
  let checkerNote = '';
  let boneLines = null;
  const ui = {};

  function eqOf(which) { return which === 'b' ? eqB : eqA; }
  function defaults() { return Object.assign({}, catalog.defaults); }

  function hookErrors() {
    const orig = console.error;
    console.error = (...args) => {
      errors.push(args.map((x) => (x && x.message) || String(x)).join(' '));
      orig.apply(console, args);
    };
    const onErr = (e) => errors.push(String(e.message || e.error || e));
    const onRej = (e) => errors.push(String((e.reason && e.reason.message) || e.reason || e));
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRej);
    return () => {
      console.error = orig;
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onRej);
    };
  }

  function modelById(id) {
    return assets.models.find((m) => m.id === id) || assets.models[0];
  }

  async function loadTemplate(model) {
    if (templates.has(model.id)) return templates.get(model.id);
    let root;
    let clips = [];
    if (String(model.kind || '').startsWith('neon')) {
      root = buildNeon(model);
      clips = root.animations || [];
      if (model.height) fitHeight(root, model.height);
    } else {
      const url = repoUrl(model.file);
      if (model.format === 'fbx') {
        root = await fbxLoader.loadAsync(url);
        clips = root.animations || [];
      } else {
        const gltf = await gltfLoader.loadAsync(url);
        root = gltf.scene;
        clips = gltf.animations || [];
        root.animations = clips;
      }
      if (model.yaw) root.rotation.y = model.yaw;
      prepareModel(root);
      const raw = rawHeight(root);
      if (model.fit === 'pack' && model.id !== 'ellie') {
        const ellie = modelById('ellie');
        if (!templates.has('ellie')) await loadTemplate(ellie);
        const ellieRaw = templates.get('ellie').raw;
        fitPack(root, ellieRaw);
      } else {
        fitHeight(root, model.height || 1.5);
      }
      root.userData.raw = raw;
    }
    root.userData.raw = root.userData.raw || rawHeight(root);
    const box = new THREE.Box3().setFromObject(root);
    const rec = { model, root, clips, raw: root.userData.raw, height: box.getSize(new THREE.Vector3()).y };
    templates.set(model.id, rec);
    return rec;
  }

  function disposeInstance(inst) {
    if (!inst) return;
    inst.mixer.stopAllAction();
    const list = inst.root.userData.attached || [];
    for (const mesh of list) {
      if (mesh.parent) mesh.parent.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material && mesh.material.dispose) mesh.material.dispose();
    }
    inst.root.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => { if (m && m.dispose) m.dispose(); });
    });
    if (inst.wrapper.parent) inst.wrapper.parent.remove(inst.wrapper);
  }

  function makeInstance(rec) {
    const root = cloneSkinned(rec.root);
    root.animations = rec.clips;
    cloneMaterials(root);
    stamp(root);
    const wrapper = new THREE.Group();
    wrapper.name = 'pane-' + rec.model.id;
    wrapper.add(root);
    const mixer = new THREE.AnimationMixer(root);
    mixer.timeScale = speed;
    const inst = { model: rec.model, root, wrapper, mixer, clips: rec.clips, clip: null, action: null, height: rec.height };
    const idle = clipNamed(rec.clips, 'idle') || rec.clips[0] || null;
    if (idle) {
      const action = mixer.clipAction(idle);
      action.play();
      mixer.setTime(Math.min(0.15 * idle.duration, idle.duration * 0.15));
      inst.clip = idle;
      inst.action = action;
    }
    return inst;
  }

  function applyPane(which) {
    const inst = panes[which];
    if (!inst) return;
    applyEq(inst.root, inst.wrapper, catalog, eqOf(which), inst.height);
    setWire(inst.root, wire);
    if (overlay && which === 'b') setOverlayMats(inst, true);
    inst.mixer.timeScale = speed;
  }

  function frame(which) {
    const inst = panes[which];
    if (!inst) return;
    inst.wrapper.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(inst.wrapper);
    const size = box.getSize(new THREE.Vector3());
    const centerY = Math.max(0.15, (box.min.y + box.max.y) * 0.5);
    const fov = THREE.MathUtils.degToRad(stage.camera.fov);
    const dist = Math.max(size.y, 0.4) * 0.5 / Math.tan(fov / 2) * 1.65;
    if (which === 'a') stage.setTarget('a', centerY, dist);
    else {
      stage.targetB.set(0, centerY, 0);
      stage.setTarget('b', centerY, null);
    }
    const side = Math.max(0.35, size.x * 0.5 + 0.28);
    stage.ruler.position.x = -side;
  }

  async function setModel(which, id) {
    const model = modelById(id);
    ui.status.textContent = 'Loading ' + model.name + '…';
    let rec;
    try {
      rec = await loadTemplate(model);
    } catch (err) {
      if (model.optional) {
        ui.status.textContent = model.name + ' is not in this build. ' + (model.note || '');
        return { missing: true, error: String(err && err.message || err) };
      }
      throw err;
    }
    if (!alive) return null;
    disposeInstance(panes[which]);
    const inst = makeInstance(rec);
    panes[which] = inst;
    stage.scene.add(inst.wrapper);
    applyPane(which);
    frame('a');
    if (panes.b) frame('b');
    fillClips();
    paintBar();
    ui.status.textContent = model.name + (String(model.kind).startsWith('neon') ? ' · Neon tubes' : ' · Adventure rig');
    return inst;
  }

  function angleName() {
    const a = catalog.angles.find((x) => x.id === angleId);
    return a ? a.name : 'Front';
  }

  function makeLabel() {
    const inst = panes.a;
    const name = inst ? inst.model.name : 'model';
    const clip = inst && inst.clip ? clipTitle(inst.clip) : 'still';
    const time = inst ? inst.mixer.time : 0;
    const frame = Math.round(time * 30);
    return name + ' · ' + angleName() + ' · ' + clip + ' · f' + frame;
  }

  function paintBar() {
    const inst = panes[edit] || panes.a;
    if (!inst || !catalog) return;
    const report = anatomyLines(inst.root, inst.model.kind, catalog.anatomy);
    const lines = [
      inst.model.name + '  ' + (String(inst.model.kind).startsWith('neon') ? 'NEON TUBES' : 'GAME RIG'),
      'Ellie ' + scale.ellie.toFixed(2) + ' m · this ' + report.measure.height.toFixed(2) + ' m · 370Z height ' + scale.z.h + ' m',
      checkerNote,
    ].concat(report.lines);
    ui.bar.textContent = lines.filter(Boolean).join('\n');
  }

  function paintChips() {
    clear(ui.chips);
    const sections = el('div', 'zsecs');
    for (const sec of catalog.sections) {
      const b = el('button', 'zsec' + (ui.section === sec.id ? ' on' : ''), sec.name);
      b.type = 'button';
      b.addEventListener('click', () => { ui.section = sec.id; paintChips(); });
      sections.appendChild(b);
    }
    ui.chips.appendChild(sections);
    const row = el('div', 'zitems');
    const eq = eqOf(edit);
    if (ui.section === 'model') {
      const groups = {};
      for (const model of assets.models) {
        (groups[model.group] || (groups[model.group] = [])).push(model);
      }
      for (const [group, list] of Object.entries(groups)) {
        row.appendChild(el('div', 'zgroup', group));
        for (const model of list) {
          const on = panes[edit] && panes[edit].model.id === model.id;
          const b = el('button', 'zchip' + (on ? ' on' : ''), model.name);
          b.type = 'button';
          b.addEventListener('click', () => { setModel(edit, model.id).then(() => { saveSoon(); paintChips(); }); });
          row.appendChild(b);
        }
      }
    } else if (ui.section === 'looks') {
      for (const preset of catalog.presets) {
        const b = el('button', 'zchip', preset.name);
        b.type = 'button';
        b.addEventListener('click', () => {
          const next = Object.assign(defaults(), preset.eq || {});
          if (edit === 'b') eqB = next; else eqA = next;
          applyPane(edit);
          refreshGui();
          paintChips();
          paintBar();
          saveSoon();
        });
        row.appendChild(b);
      }
      const name = el('input', 'zname');
      name.placeholder = 'Favorite name';
      name.maxLength = 32;
      const save = el('button', 'zchip', 'SAVE LOOK');
      save.type = 'button';
      save.addEventListener('click', () => {
        const title = (name.value || 'Look').trim();
        writeFav('character', title, Object.assign({}, eqOf(edit)));
        paintChips();
      });
      row.appendChild(name);
      row.appendChild(save);
      const favs = readFavs('character');
      for (const [title, saved] of Object.entries(favs)) {
        const b = el('button', 'zchip', title);
        b.type = 'button';
        b.addEventListener('click', () => {
          const next = Object.assign(defaults(), saved);
          if (edit === 'b') eqB = next; else eqA = next;
          applyPane(edit);
          refreshGui();
          paintChips();
          paintBar();
        });
        row.appendChild(b);
      }
    } else {
      const sec = catalog.sections.find((s) => s.id === ui.section);
      for (const slot of (sec && sec.slots) || []) {
        const spec = catalog.slots[slot];
        if (!spec) continue;
        row.appendChild(el('div', 'zgroup', spec.name));
        for (const opt of spec.options) {
          const on = eq[slot] === opt.id;
          const b = el('button', 'zchip' + (on ? ' on' : ''), opt.name);
          b.type = 'button';
          if (opt.color) b.style.setProperty('--swatch', opt.color);
          b.addEventListener('click', () => {
            eq[slot] = opt.id;
            if (ui.ctrls[slot]) {
              ui.silent = true;
              ui.ctrls[slot].setValue(opt.id);
              ui.silent = false;
            }
            applyPane(edit);
            paintChips();
            paintBar();
            saveSoon();
          });
          row.appendChild(b);
        }
      }
    }
    ui.chips.appendChild(row);
    const panesRow = el('div', 'zitems');
    for (const id of ['a', 'b']) {
      const b = el('button', 'zchip' + (edit === id ? ' on' : ''), 'EDIT ' + id.toUpperCase());
      b.type = 'button';
      b.disabled = id === 'b' && !compare;
      b.addEventListener('click', () => { edit = id; refreshGui(); paintChips(); paintBar(); });
      panesRow.appendChild(b);
    }
    ui.chips.appendChild(panesRow);
  }

  function refreshGui() {
    if (!gui) return;
    const eq = eqOf(edit);
    ui.silent = true;
    for (const [slot, ctrl] of Object.entries(ui.ctrls)) {
      if (eq[slot] != null) ctrl.setValue(eq[slot]);
    }
    ui.silent = false;
  }

  function buildGui() {
    gui = new GUI({ container: ui.gui, title: 'OPTIONS', autoPlace: false });
    gui.domElement.style.width = '100%';
    ui.viewEq = Object.assign({}, eqA);
    ui.ctrls = {};
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      const choices = {};
      for (const opt of spec.options) choices[opt.name] = opt.id;
      ui.ctrls[slot] = gui.add(ui.viewEq, slot, choices).name(spec.name).onChange((value) => {
        if (ui.silent) return;
        eqOf(edit)[slot] = value;
        applyPane(edit);
        paintChips();
        paintBar();
        saveSoon();
      });
    }
    const view = { light: lightId, speed, wire, bones: bonesOn, grid: gridOn };
    ui.view = view;
    const lights = {};
    for (const lit of catalog.lights) lights[lit.name] = lit.id;
    gui.add(view, 'light', lights).name('LIGHT').onChange((id) => pickLight(id));
    gui.add(view, 'speed', { '¼': 0.25, '½': 0.5, '1×': 1, '2×': 2 }).name('SPEED').onChange((v) => {
      speed = Number(v);
      if (panes.a) panes.a.mixer.timeScale = speed;
      if (panes.b) panes.b.mixer.timeScale = speed;
    });
    gui.add(view, 'wire').name('WIRE').onChange((v) => { wire = !!v; if (panes.a) setWire(panes.a.root, wire); if (panes.b) setWire(panes.b.root, wire); });
    gui.add(view, 'bones').name('BONES').onChange((v) => { bonesOn = !!v; });
    gui.add(view, 'grid').name('GRID').onChange((v) => {
      gridOn = !!v;
      stage.grid.visible = gridOn;
      stage.rings.visible = gridOn;
      stage.ruler.visible = gridOn;
    });
  }

  function pickLight(id) {
    lightId = id;
    const preset = catalog.lights.find((l) => l.id === id) || catalog.lights[0];
    stage.setLights(preset);
    if (ui.view) ui.view.light = id;
  }

  function pickAngle(id) {
    const angle = catalog.angles.find((a) => a.id === id) || catalog.angles[0];
    angleId = angle.id;
    stage.setAngle(angle.azimuth, angle.polar);
    for (const btn of ui.angles.querySelectorAll('button')) btn.classList.toggle('on', btn.dataset.id === angle.id);
  }

  function fillClips() {
    clear(ui.clips);
    const inst = panes.a;
    const clips = (inst && inst.clips) || [];
    if (!clips.length) {
      ui.clips.appendChild(el('span', 'zmeta', 'No clip'));
      return;
    }
    for (const clip of clips) {
      const b = el('button', 'zchip' + (inst.clip === clip ? ' on' : ''), clipTitle(clip));
      b.type = 'button';
      b.addEventListener('click', () => {
        inst.mixer.stopAllAction();
        const action = inst.mixer.clipAction(clip);
        action.play();
        inst.mixer.setTime(0);
        inst.clip = clip;
        inst.action = action;
        playing = true;
        ui.play.textContent = 'PAUSE';
        fillClips();
      });
      ui.clips.appendChild(b);
    }
  }

  function updateBones() {
    if (boneLines) {
      stage.scene.remove(boneLines);
      boneLines.geometry && boneLines.geometry.dispose();
      boneLines.material && boneLines.material.dispose();
      boneLines = null;
    }
    if (!bonesOn || !panes[edit]) return;
    const root = panes[edit].root;
    root.updateMatrixWorld(true);
    const pos = [];
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    root.traverse((o) => {
      if (!o.isBone || !o.parent || !o.parent.isBone) return;
      o.parent.getWorldPosition(a);
      o.getWorldPosition(b);
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    });
    if (!pos.length) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    boneLines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x3ee6ff }));
    boneLines.frustumCulled = false;
    stage.scene.add(boneLines);
  }

  function showPanes(which) {
    if (panes.a) panes.a.wrapper.visible = which !== 'b';
    if (panes.b) panes.b.wrapper.visible = compare && which !== 'a';
    if (boneLines) boneLines.visible = which !== 'b';
  }

  function layout() {
    host.innerHTML = '';
    const spin = el('div', 'zspin');
    const stageHost = el('div', 'zstage');
    ui.ruler = el('div', 'zruler');
    ui.angles = el('div', 'zangles');
    ui.scrub = el('div', 'zscrub');
    ui.clips = el('div', 'zclips');
    const menu = el('aside', 'zmenu');
    ui.status = el('div', 'zstatus', 'Loading characters…');
    ui.chips = el('div', 'zchips');
    ui.gui = el('div', 'zgui');
    ui.bar = el('pre', 'zbar');
    stageHost.append(ui.ruler, ui.angles, ui.scrub);
    ui.scrub.append(ui.clips);
    menu.append(ui.status, ui.chips, ui.gui, ui.bar);
    spin.append(stageHost, menu);
    host.appendChild(spin);
    stage = createStage(stageHost, { fov: 38, bg: 0xd7e6f2, rings: [0.5, 0.8, 1.1], grid: 4, ellie: 1.5 });
    stage.beforePane = showPanes;
    stage.onTick = (dt) => {
      if (playing) {
        if (panes.a) panes.a.mixer.update(dt);
        if (compare && panes.b) panes.b.mixer.update(dt);
      }
      updateBones();
      const inst = panes.a;
      if (inst) {
        const h = inst.height * (inst.wrapper.scale.y || 1);
        ui.ruler.textContent = 'Ellie ' + scale.ellie.toFixed(2) + ' m · this ' + h.toFixed(2) + ' m · f' + Math.round(inst.mixer.time * 30);
      }
    };
    for (const angle of catalog.angles) {
      const b = el('button', 'zbtn' + (angle.id === angleId ? ' on' : ''), angle.name);
      b.type = 'button';
      b.dataset.id = angle.id;
      b.addEventListener('click', () => pickAngle(angle.id));
      ui.angles.appendChild(b);
    }
    const turnBtn = el('button', 'zbtn on', 'TURN');
    turnBtn.type = 'button';
    turnBtn.addEventListener('click', () => {
      turn = !turn;
      stage.setTurn(turn);
      turnBtn.classList.toggle('on', turn);
    });
    ui.angles.appendChild(turnBtn);
    ui.play = el('button', 'zbtn on', 'PAUSE');
    ui.play.type = 'button';
    ui.play.addEventListener('click', () => {
      playing = !playing;
      ui.play.textContent = playing ? 'PAUSE' : 'PLAY';
      ui.play.classList.toggle('on', playing);
    });
    const range = el('input', 'zrange');
    range.type = 'range';
    range.min = '0';
    range.max = '1';
    range.step = '0.001';
    range.value = '0';
    range.addEventListener('input', () => {
      playing = false;
      ui.play.textContent = 'PLAY';
      ui.play.classList.remove('on');
      const inst = panes.a;
      if (!inst || !inst.clip) return;
      inst.mixer.setTime(Number(range.value) * inst.clip.duration);
    });
    ui.scrub.append(ui.play, range);
    const compareBtn = el('button', 'zbtn', 'COMPARE');
    compareBtn.type = 'button';
    compareBtn.addEventListener('click', () => toggleCompare());
    const ellieBtn = el('button', 'zbtn', 'WITH ELLIE');
    ellieBtn.type = 'button';
    ellieBtn.addEventListener('click', () => withEllie());
    const overBtn = el('button', 'zbtn', 'OVERLAY');
    overBtn.type = 'button';
    overBtn.addEventListener('click', () => {
      overlay = !overlay;
      stage.setOverlay(overlay);
      overBtn.classList.toggle('on', overlay);
      setOverlayMats(panes.b, overlay);
      showPanes(overlay ? 'both' : 'a');
    });
    const shot = el('button', 'zbtn', 'SAVE SHOT');
    shot.type = 'button';
    shot.addEventListener('click', () => capture(true));
    ui.angles.append(compareBtn, ellieBtn, overBtn, shot);
    ui.compareBtn = compareBtn;
    ui.overBtn = overBtn;
    ui.section = 'model';
    buildGui();
    pickLight(lightId);
    pickAngle(angleId);
    stage.setTurn(turn);
  }

  async function toggleCompare() {
    compare = !compare;
    stage.setCompare(compare);
    ui.compareBtn.classList.toggle('on', compare);
    if (compare && !panes.b) {
      const id = panes.a && panes.a.model.id === 'ellie' ? 'fox' : 'ellie';
      eqB = defaults();
      await setModel('b', id);
    }
    showPanes('a');
    paintChips();
  }

  async function withEllie() {
    compare = true;
    stage.setCompare(true);
    ui.compareBtn.classList.add('on');
    const id = panes.a && panes.a.model.id === 'ellie' ? 'fox' : 'ellie';
    if (!eqB) eqB = defaults();
    await setModel('b', id);
    showPanes('a');
    paintChips();
  }

  function setOverlayMats(inst, on) {
    if (!inst) return;
    inst.root.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (!m) continue;
        if (on) {
          if (m.userData.over == null) m.userData.over = m.opacity;
          m.transparent = true;
          m.opacity = 0.45;
          m.depthWrite = false;
        } else if (m.userData.over != null) {
          m.opacity = m.userData.src ? m.userData.src.opacity : m.userData.over;
          m.transparent = m.userData.src ? m.userData.src.transparent : false;
          m.depthWrite = m.userData.src ? m.userData.src.depthWrite : true;
          delete m.userData.over;
        }
      }
    });
  }

  function capture(download) {
    showPanes(overlay ? 'both' : 'a');
    stage.render();
    const label = makeLabel();
    const shot = shotLabel(stage.canvas, label);
    ui.status.dataset.shot = label;
    if (download) {
      const a = document.createElement('a');
      a.href = shot.url;
      a.download = label.replace(/[^\w.]+/g, '-').replace(/^-|-$/g, '') + '.png';
      a.click();
    }
    return { label, url: shot.url, bright: shot.bright };
  }

  async function gameMatch() {
    await setModel('a', 'ellie');
    eqA = defaults();
    applyPane('a');
    const wasCompare = compare;
    compare = false;
    stage.setCompare(false);
    stage.hold(true);
    const wrap = panes.a.wrapper;
    const savedRot = wrap.rotation.y;
    const savedFov = stage.camera.fov;
    const savedNear = stage.camera.near;
    stage.grid.visible = false;
    stage.rings.visible = false;
    stage.ruler.visible = false;
    if (boneLines) boneLines.visible = false;
    if (panes.b) panes.b.wrapper.visible = false;
    wrap.visible = true;
    wrap.rotation.y = Math.PI;
    wrap.position.set(0, 0, 0);
    const clip = clipNamed(panes.a.clips, 'idle') || panes.a.clips[0];
    if (clip) {
      panes.a.mixer.stopAllAction();
      const action = panes.a.mixer.clipAction(clip);
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.play();
      panes.a.clip = clip;
      panes.a.action = action;
      panes.a.mixer.setTime(0.15 * clip.duration);
      panes.a.root.updateMatrixWorld(true);
    }
    const preset = catalog.lights.find((l) => l.id === 'game');
    stage.setLights(preset);
    const height = 1.55;
    const lookY = height * 0.48;
    const fov = 38;
    const dist = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2)) * 1.42;
    stage.renderer.setPixelRatio(1);
    stage.renderer.setSize(520, 760, false);
    stage.renderer.setScissorTest(false);
    stage.renderer.setViewport(0, 0, 520, 760);
    stage.camera.fov = fov;
    stage.camera.near = 0.08;
    stage.camera.far = 80;
    stage.camera.aspect = 520 / 760;
    stage.camera.position.set(0, lookY, dist);
    stage.camera.lookAt(0, lookY, 0);
    stage.camera.updateProjectionMatrix();
    stage.renderer.render(stage.scene, stage.camera);
    const url = stage.canvas.toDataURL('image/png');
    const measure = measureActor(panes.a.root);
    wrap.rotation.y = savedRot;
    stage.camera.fov = savedFov;
    stage.camera.near = savedNear;
    stage.grid.visible = gridOn;
    stage.rings.visible = gridOn;
    stage.ruler.visible = gridOn;
    compare = wasCompare;
    stage.setCompare(compare);
    pickLight(lightId);
    pickAngle(angleId);
    stage.resize();
    stage.hold(false);
    return { url, measure };
  }

  function saveSoon() {
    if (ctx && ctx.onSave) ctx.onSave();
  }

  function settings() {
    return {
      modelA: panes.a && panes.a.model.id,
      modelB: panes.b && panes.b.model.id,
      eqA: Object.assign({}, eqA),
      eqB: eqB ? Object.assign({}, eqB) : null,
      light: lightId,
      angle: angleId,
      speed,
      wire,
      bones: bonesOn,
      grid: gridOn,
      compare,
      overlay,
      turn,
      edit,
    };
  }

  async function applySettings(s) {
    if (!s) return;
    if (s.eqA) eqA = Object.assign(defaults(), s.eqA);
    if (s.eqB) eqB = Object.assign(defaults(), s.eqB);
    if (s.modelA) await setModel('a', s.modelA);
    if (s.compare && s.modelB) {
      compare = true;
      stage.setCompare(true);
      ui.compareBtn.classList.add('on');
      await setModel('b', s.modelB);
    }
    applyPane('a');
    if (panes.b) applyPane('b');
    if (s.light) pickLight(s.light);
    if (s.angle) pickAngle(s.angle);
    if (s.speed) speed = s.speed;
    wire = !!s.wire;
    bonesOn = !!s.bones;
    if (s.grid != null) {
      gridOn = !!s.grid;
      stage.grid.visible = gridOn;
      stage.rings.visible = gridOn;
      stage.ruler.visible = gridOn;
    }
    turn = s.turn != null ? !!s.turn : turn;
    stage.setTurn(turn);
    overlay = !!s.overlay;
    stage.setOverlay(overlay);
    edit = s.edit === 'b' ? 'b' : 'a';
    refreshGui();
    paintChips();
    paintBar();
  }

  async function setView(opts) {
    opts = opts || {};
    if (opts.model) await setModel('a', opts.model);
    if (opts.eq) {
      eqA = Object.assign(defaults(), opts.eq);
      applyPane('a');
    }
    if (opts.compare) {
      compare = true;
      stage.setCompare(true);
      ui.compareBtn.classList.add('on');
      if (!eqB) eqB = defaults();
      if (opts.eqB) eqB = Object.assign(defaults(), opts.eqB);
      await setModel('b', opts.compare);
    } else if (opts.compare === false) {
      compare = false;
      stage.setCompare(false);
      ui.compareBtn.classList.remove('on');
    }
    if (opts.overlay != null) {
      overlay = !!opts.overlay;
      stage.setOverlay(overlay);
      ui.overBtn.classList.toggle('on', overlay);
    }
    if (opts.light) pickLight(opts.light);
    if (opts.angle) pickAngle(opts.angle);
    if (opts.turn != null) {
      turn = !!opts.turn;
      stage.setTurn(turn);
    }
    if (opts.scrub != null && panes.a && panes.a.clip) {
      playing = false;
      ui.play.textContent = 'PLAY';
      panes.a.mixer.setTime(Number(opts.scrub) * panes.a.clip.duration);
    }
    if (opts.play != null) playing = !!opts.play;
    showPanes(overlay ? 'both' : 'a');
    paintChips();
    paintBar();
  }

  function angDelta(a, b) {
    let d = Math.abs(a - b) % (Math.PI * 2);
    if (d > Math.PI) d = Math.PI * 2 - d;
    return d;
  }

  async function sweep() {
    const fails = [];
    const notes = [];
    const before = errors.length;
    stage.setTurn(false);
    playing = false;
    compare = false;
    stage.setCompare(false);
    for (const model of assets.models) {
      try {
        const inst = await setModel('a', model.id);
        if (!inst) continue;
        if (inst.missing) {
          notes.push(model.id + ' not in this build');
          continue;
        }
      } catch (err) {
        if (model.optional) {
          notes.push(model.id + ' skipped');
          continue;
        }
        fails.push(model.id + ' load ' + (err && err.message || err));
        continue;
      }
      eqA = defaults();
      applyPane('a');
      panes.a.mixer.update(1 / 60);
      const bad0 = scanFinite(panes.a.wrapper).concat(scanMaps(panes.a.root));
      if (bad0.length) fails.push(model.id + ' base ' + bad0.join(','));
      const base = lookSnapshot(panes.a.root, panes.a.wrapper);
      for (const [slot, spec] of Object.entries(catalog.slots)) {
        for (const opt of spec.options) {
          eqA = defaults();
          eqA[slot] = opt.id;
          try {
            applyPane('a');
            panes.a.mixer.update(1 / 60);
          } catch (err) {
            fails.push(model.id + ' ' + slot + '=' + opt.id + ' ' + (err && err.message || err));
            continue;
          }
          const bad = scanFinite(panes.a.wrapper).concat(scanMaps(panes.a.root));
          if (bad.length) fails.push(model.id + ' ' + slot + '=' + opt.id + ' ' + bad.join(','));
        }
      }
      const mixed = defaults();
      for (const [slot, spec] of Object.entries(catalog.slots)) {
        const alt = spec.options.find((o) => o.id !== catalog.defaults[slot]);
        if (alt) mixed[slot] = alt.id;
      }
      eqA = mixed;
      applyPane('a');
      panes.a.mixer.update(1 / 60);
      const mixedBad = scanFinite(panes.a.wrapper).concat(scanMaps(panes.a.root));
      if (mixedBad.length) fails.push(model.id + ' mixed ' + mixedBad.join(','));
      const mixedSnap = lookSnapshot(panes.a.root, panes.a.wrapper);
      eqA = defaults();
      applyPane('a');
      const back = lookSnapshot(panes.a.root, panes.a.wrapper);
      if (back !== base) fails.push(model.id + ' leftover after reset');
      if (mixedSnap === base) notes.push(model.id + ' mixed look matched the default (check that options are visible)');
    }
    await setModel('a', 'ellie');
    eqA = defaults();
    applyPane('a');
    if (!eqB) eqB = defaults();
    await setModel('b', 'fox');
    compare = true;
    stage.setCompare(true);
    stage.setAngle(0.5, 1.1);
    stage.setAngle(1.15, 0.95);
    const sync = stage.syncState();
    if (angDelta(sync.thetaA, sync.thetaB) > 0.02 || angDelta(sync.phiA, sync.phiB) > 0.02 || Math.abs(sync.radiusA - sync.radiusB) > 0.05) {
      fails.push('compare cameras drifted ' + JSON.stringify(sync));
    }
    compare = false;
    stage.setCompare(false);
    playing = false;
    if (panes.a && panes.a.clip) panes.a.mixer.setTime(0);
    pickAngle('front');
    const shot = capture(false);
    const expect = makeLabel();
    if (shot.label !== expect) fails.push('shot label ' + shot.label + ' != ' + expect);
    if (!(shot.bright > 8)) fails.push('shot label did not draw (' + shot.bright + ' px)');
    const fresh = errors.slice(before).filter((e) => !/skin weight/i.test(e));
    for (const e of fresh) fails.push('error ' + e);
    stage.setTurn(turn);
    playing = true;
    return { fails, notes, label: shot.label, sync, errors: fresh };
  }

  function publish() {
    const api = {
      id: 'character',
      sweep,
      capture,
      gameMatch,
      setView,
      syncState: () => (stage ? stage.syncState() : null),
      frames: () => (stage ? stage.samples() : []),
      measure: () => (panes.a ? measureActor(panes.a.root) : null),
      errors: () => errors.slice(),
    };
    if (window.__SPIN) window.__SPIN.character = api;
    return api;
  }

  return {
    id: 'character',
    title: 'CHARACTERS',
    async mount(container, context) {
      alive = true;
      host = container;
      ctx = context || { onSave() {} };
      unhook = hookErrors();
      try {
        catalog = await fetchJson(devUrl('catalogs/character.json'));
        assets = await fetchJson(devUrl('assets.json'));
        scale = await fetchJson(devUrl('scale.json'));
        try {
          const res = await fetch(repoUrl(catalog.anatomy.checker));
          checkerNote = res.ok
            ? 'Anatomy checker file is in this branch. Numbers below use the same metre rules.'
            : 'Anatomy checker file was not found. Numbers below are the live metre rules.';
        } catch (err) {
          checkerNote = 'Anatomy checker file was not found. Numbers below are the live metre rules.';
        }
        eqA = defaults();
        eqB = defaults();
        layout();
        const first = (pending && pending.modelA) || 'ellie';
        await setModel('a', first);
        if (pending) await applySettings(pending);
        pending = null;
        ready = true;
        paintChips();
        paintBar();
        publish();
        if (ctx.signal) ctx.signal.addEventListener('abort', () => this.unmount());
      } catch (err) {
        this.unmount();
        throw err;
      }
    },
    unmount() {
      if (!alive && !stage) return;
      alive = false;
      ready = false;
      try { unhook(); } catch (err) { /* already restored */ }
      disposeInstance(panes.a);
      disposeInstance(panes.b);
      panes.a = null;
      panes.b = null;
      if (gui) { gui.destroy(); gui = null; }
      if (stage) { stage.dispose(); stage = null; }
      if (host) host.innerHTML = '';
      for (const rec of templates.values()) {
        rec.root.traverse((o) => {
          if (o.geometry && o.geometry.dispose) o.geometry.dispose();
          if (!o.isMesh) return;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => { if (m && m.dispose) m.dispose(); });
        });
      }
      templates.clear();
    },
    save() { return settings(); },
    load(settingsIn) {
      if (!ready) { pending = settingsIn; return; }
      applySettings(settingsIn);
    },
  };
}
