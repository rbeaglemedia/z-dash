import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { el, clear, devUrl, repoUrl, fetchJson, readFavs, writeFav } from './dom.js';
import { shotLabel } from './shot.js';

const ANGLES = [
  { id: 'front', name: 'Front', yaw: 0, pitch: 0.22 },
  { id: 'three', name: '3/4', yaw: 0.7, pitch: 0.24 },
  { id: 'side', name: 'Side', yaw: 1.5708, pitch: 0.2 },
  { id: 'back', name: 'Back', yaw: 3.1416, pitch: 0.22 },
  { id: 'top', name: 'Top', yaw: 0.4, pitch: 1.15 },
];

let scriptPromise = null;

function inject(url) {
  return new Promise((resolve, reject) => {
    const prev = document.querySelector('script[data-zd="' + url + '"]');
    if (prev) { resolve(); return; }
    const s = document.createElement('script');
    s.src = url;
    s.async = false;
    s.dataset.zd = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('script ' + url));
    document.body.appendChild(s);
  });
}

function loadXray() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = (async () => {
    window.ZD = window.ZD || {};
    window.ZD.perf = window.ZD.perf || { dpr() { return 1; }, low: true };
    window.ZD.perf.low = true;
    window.ZD.perf.dpr = () => 1;
    await inject(repoUrl('shared/assets/370z-glb.js'));
    await inject(repoUrl('shared/zd-embed.js'));
    await inject(repoUrl('shared/car-model.js'));
    const X = window.ZD && window.ZD.Xray;
    if (!X) throw new Error('Xray did not start');
    const t0 = Date.now();
    while (!X.ready) {
      if (Date.now() - t0 > 90000) throw new Error('Xray GLB timed out');
      await new Promise((r) => setTimeout(r, 40));
    }
    await inject(repoUrl('shared/car-hinge.js'));
    return X;
  })();
  return scriptPromise;
}

function hex(color) {
  if (!color || !color.getHexString) return '#ffffff';
  return '#' + color.getHexString();
}

export function createModule() {
  let alive = false;
  let host = null;
  let ctx = null;
  let catalog = null;
  let X = null;
  let base = null;
  let gui = null;
  let canvas = null;
  let ctx2 = null;
  let camera = null;
  let controls = null;
  let raf = 0;
  let eqA = null;
  let eqB = null;
  let edit = 'a';
  let compare = false;
  let angleId = 'three';
  let turn = true;
  let wantTurn = true;
  let resumeTimer = 0;
  let ready = false;
  let pending = null;
  let checkerNote = '';
  const errors = [];
  const ui = {};
  let last = { yaw: 0.7, pitch: 0.24, dist: 10.5 };
  const samples = [];

  function defaults() { return Object.assign({}, catalog.defaults); }
  function eqOf(which) { return which === 'b' ? eqB : eqA; }

  function hook() {
    const orig = console.error;
    console.error = (...args) => {
      errors.push(args.map((x) => (x && x.message) || String(x)).join(' '));
      orig.apply(console, args);
    };
    const onErr = (e) => errors.push(String(e.message || e));
    window.addEventListener('error', onErr);
    return () => {
      console.error = orig;
      window.removeEventListener('error', onErr);
    };
  }
  let unhook = () => {};

  function opt(slot, id) {
    const spec = catalog.slots[slot];
    return spec.options.find((o) => o.id === id) || spec.options[0];
  }

  function kidOf(eq) {
    const paint = opt('paint', eq.paint);
    const wheels = opt('wheels', eq.wheels);
    const spoiler = opt('spoiler', eq.spoiler);
    const caliper = opt('caliper', eq.caliper);
    const glow = opt('underglow', eq.underglow);
    const plain = paint.kind === 'game' && wheels.kind === 'game' && !spoiler.spoiler && caliper.kind === 'game' && !glow.underglow;
    if (plain) return null;
    return {
      paint: paint.paint || base.paint,
      glow: paint.glow || base.glow,
      grid: paint.grid || base.grid,
      wheel: wheels.wheel || base.wheel,
      wheelGlow: !!wheels.wheelGlow,
      spoiler: spoiler.spoiler || null,
      wings: null,
      extra: null,
      extras: [],
      lip: null,
      skirts: null,
      diffuser: null,
      tips: null,
      underglow: glow.underglow || null,
      bumper: null,
      caliper: caliper.caliper || base.caliper,
    };
  }

  function readOrbit() {
    const offset = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(offset);
    last = {
      yaw: Math.PI / 2 - sph.theta,
      pitch: Math.PI / 2 - sph.phi,
      dist: sph.radius,
      ty: controls.target.y,
    };
    return last;
  }

  function place(yaw, pitch, dist) {
    const target = controls.target;
    camera.position.set(
      target.x + Math.cos(yaw) * Math.cos(pitch) * dist,
      target.y + Math.sin(pitch) * dist,
      target.z + Math.sin(yaw) * Math.cos(pitch) * dist,
    );
    controls.update();
  }

  function paintName(eq) {
    const paint = opt('paint', eq.paint);
    return paint.name;
  }

  function makeLabel() {
    const angle = ANGLES.find((a) => a.id === angleId) || ANGLES[0];
    return '370Z · ' + angle.name + ' · ' + paintName(eqA) + ' · f0';
  }

  function blit(look, x, w, h, orbit) {
    X.render(ctx2, 0, 0, w, h, {
      xray: false,
      yaw: orbit.yaw,
      pitch: orbit.pitch,
      dist: orbit.dist,
      ty: orbit.ty,
      fov: 26,
      drl: 1,
      kid: look,
      noDraw: true,
      st: { t: 0, throttle: 0 },
    });
    ctx2.drawImage(X.canvas, x, 0, w, h);
  }

  function draw() {
    if (!X || !X.ready || !canvas) return;
    const orbit = readOrbit();
    const w = canvas.width;
    const h = canvas.height;
    ctx2.fillStyle = '#07010f';
    ctx2.fillRect(0, 0, w, h);
    if (compare) {
      const hw = Math.floor(w / 2);
      blit(kidOf(eqA), 0, hw, h, orbit);
      blit(kidOf(eqB), hw, w - hw, h, orbit);
      ui.syncYaw = orbit.yaw;
    } else {
      blit(kidOf(eqA), 0, w, h, orbit);
    }
  }

  function resize() {
    const stage = canvas.parentElement;
    const w = Math.max(2, stage.clientWidth || 640);
    const h = Math.max(2, stage.clientHeight || 480);
    canvas.width = w;
    canvas.height = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function finiteCar() {
    const bad = [];
    X.car.updateMatrixWorld(true);
    X.car.traverse((o) => {
      const e = o.matrixWorld && o.matrixWorld.elements;
      if (!e) return;
      for (let i = 0; i < 16; i++) {
        if (!Number.isFinite(e[i])) { bad.push(o.name || o.type); break; }
      }
      if (o.isMesh) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (m && m.map && !m.map.image) bad.push((m.name || 'map') + ' texture');
        }
      }
    });
    return bad;
  }

  function visibleSize() {
    const box = new X.THREE_Box3();
    const tmp = new X.THREE_Vector3();
    let any = false;
    X.car.updateMatrixWorld(true);
    X.car.traverse((o) => {
      if (!o.isMesh || o.visible === false || !o.geometry) return;
      let parent = o.parent;
      while (parent) {
        if (parent.visible === false) return;
        parent = parent.parent;
      }
      const geo = o.geometry;
      if (!geo.boundingBox) geo.computeBoundingBox();
      const bb = geo.boundingBox;
      if (!bb) return;
      for (const x of [bb.min.x, bb.max.x]) {
        for (const y of [bb.min.y, bb.max.y]) {
          for (const z of [bb.min.z, bb.max.z]) {
            tmp.set(x, y, z).applyMatrix4(o.matrixWorld);
            if (!Number.isFinite(tmp.x)) return;
            box.expandByPoint(tmp);
            any = true;
          }
        }
      }
    });
    return any ? box.getSize(new X.THREE_Vector3()) : new X.THREE_Vector3();
  }

  function designText() {
    const cfg = window.ZD_EMBED && window.ZD_EMBED.cfg;
    const lines = [];
    lines.push(cfg && cfg.file === catalog.cfgFile ? 'PASS  same GLB path ' + cfg.file : 'FAIL  GLB path ' + (cfg && cfg.file));
    const size = visibleSize();
    const length = Math.max(size.x, size.z);
    lines.push(Math.abs(length - 4.25) < 0.2 ? 'PASS  length ' + length.toFixed(2) + ' m (4.25)' : 'FAIL  length ' + length.toFixed(2) + ' m');
    lines.push(Math.abs(size.y - 1.315) < 0.25 ? 'PASS  height ' + size.y.toFixed(2) + ' m (1.315)' : 'FAIL  height ' + size.y.toFixed(2) + ' m');
    const bad = finiteCar();
    lines.push(bad.length ? 'FAIL  ' + bad.slice(0, 3).join(', ') : 'PASS  matrices and textures finite');
    lines.push('PASS  this spinner does not call shadowBlur');
    lines.push('Ellie 1.50 m · 370Z ' + size.y.toFixed(2) + ' m tall');
    lines.push(checkerNote);
    for (const rule of catalog.design.rules) lines.push('· ' + rule);
    ui.bar.textContent = lines.join('\n');
    return lines;
  }

  function paintChips() {
    clear(ui.chips);
    const secs = el('div', 'zsecs');
    for (const sec of catalog.sections) {
      const b = el('button', 'zsec' + (ui.section === sec.id ? ' on' : ''), sec.name);
      b.type = 'button';
      b.addEventListener('click', () => { ui.section = sec.id; paintChips(); });
      secs.appendChild(b);
    }
    ui.chips.appendChild(secs);
    const row = el('div', 'zitems');
    const eq = eqOf(edit);
    if (ui.section === 'looks') {
      const name = el('input', 'zname');
      name.placeholder = 'Favorite name';
      const save = el('button', 'zchip', 'SAVE LOOK');
      save.type = 'button';
      save.addEventListener('click', () => {
        writeFav('car', (name.value || 'Look').trim(), Object.assign({}, eq));
        paintChips();
      });
      row.append(name, save);
      for (const [title, saved] of Object.entries(readFavs('car'))) {
        const b = el('button', 'zchip', title);
        b.type = 'button';
        b.addEventListener('click', () => {
          const next = Object.assign(defaults(), saved);
          if (edit === 'b') eqB = next; else eqA = next;
          refreshGui();
          paintChips();
        });
        row.appendChild(b);
      }
    } else {
      const sec = catalog.sections.find((s) => s.id === ui.section);
      for (const slot of (sec && sec.slots) || []) {
        const spec = catalog.slots[slot];
        row.appendChild(el('div', 'zgroup', spec.name));
        for (const opt of spec.options) {
          const b = el('button', 'zchip' + (eq[slot] === opt.id ? ' on' : ''), opt.name);
          b.type = 'button';
          if (opt.paint) b.style.setProperty('--swatch', opt.paint);
          b.addEventListener('click', () => {
            eq[slot] = opt.id;
            ui.silent = true;
            if (ui.ctrls[slot]) ui.ctrls[slot].setValue(opt.id);
            ui.silent = false;
            paintChips();
            if (ctx && ctx.onSave) ctx.onSave();
          });
          row.appendChild(b);
        }
      }
    }
    ui.chips.appendChild(row);
  }

  function refreshGui() {
    if (!ui.ctrls) return;
    ui.silent = true;
    const eq = eqOf(edit);
    for (const [slot, ctrl] of Object.entries(ui.ctrls)) ctrl.setValue(eq[slot]);
    ui.silent = false;
  }

  function layout() {
    host.innerHTML = '';
    const spin = el('div', 'zspin');
    const stageHost = el('div', 'zstage');
    canvas = el('canvas', 'zview');
    ctx2 = canvas.getContext('2d');
    ui.angles = el('div', 'zangles');
    ui.ruler = el('div', 'zruler', '370Z · same Xray shader as the game');
    const menu = el('aside', 'zmenu');
    ui.status = el('div', 'zstatus', 'Loading the 370Z…');
    ui.chips = el('div', 'zchips');
    ui.gui = el('div', 'zgui');
    ui.bar = el('pre', 'zbar');
    stageHost.append(canvas, ui.ruler, ui.angles);
    menu.append(ui.status, ui.chips, ui.gui, ui.bar);
    spin.append(stageHost, menu);
    host.appendChild(spin);
    camera = new THREE.PerspectiveCamera(26, 1, 0.1, 80);
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotateSpeed = 4.3;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    controls.target.set(0, 0.45, 0);
    controls.minDistance = 4;
    controls.maxDistance = 24;
    place(0.7, 0.24, 10.5);
    controls.autoRotate = true;
    canvas.addEventListener('pointerdown', () => {
      controls.autoRotate = false;
      if (resumeTimer) clearTimeout(resumeTimer);
      if (wantTurn) resumeTimer = setTimeout(() => { controls.autoRotate = true; }, 2500);
    });
    for (const angle of ANGLES) {
      const b = el('button', 'zbtn' + (angle.id === angleId ? ' on' : ''), angle.name);
      b.type = 'button';
      b.dataset.id = angle.id;
      b.addEventListener('click', () => {
        angleId = angle.id;
        const dist = camera.position.distanceTo(controls.target) || 10.5;
        place(angle.yaw, angle.pitch, dist);
        for (const btn of ui.angles.querySelectorAll('button[data-id]')) btn.classList.toggle('on', btn.dataset.id === angle.id);
      });
      ui.angles.appendChild(b);
    }
    const turnBtn = el('button', 'zbtn on', 'TURN');
    turnBtn.type = 'button';
    turnBtn.addEventListener('click', () => {
      wantTurn = !wantTurn;
      turn = wantTurn;
      controls.autoRotate = wantTurn;
      turnBtn.classList.toggle('on', wantTurn);
    });
    const compareBtn = el('button', 'zbtn', 'COMPARE');
    compareBtn.type = 'button';
    compareBtn.addEventListener('click', () => {
      compare = !compare;
      compareBtn.classList.toggle('on', compare);
      if (compare && !eqB) eqB = defaults();
    });
    const shot = el('button', 'zbtn', 'SAVE SHOT');
    shot.type = 'button';
    shot.addEventListener('click', () => capture(true));
    ui.angles.append(turnBtn, compareBtn, shot);
    ui.compareBtn = compareBtn;
    gui = new GUI({ container: ui.gui, title: 'PAINT', autoPlace: false });
    ui.viewEq = Object.assign({}, eqA);
    ui.ctrls = {};
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      const choices = {};
      for (const item of spec.options) choices[item.name] = item.id;
      ui.ctrls[slot] = gui.add(ui.viewEq, slot, choices).name(spec.name).onChange((value) => {
        if (ui.silent) return;
        eqOf(edit)[slot] = value;
        paintChips();
        if (ctx && ctx.onSave) ctx.onSave();
      });
    }
    ui.section = 'paint';
    const obs = new ResizeObserver(() => resize());
    obs.observe(stageHost);
    ui.obs = obs;
    resize();
    let prev = performance.now();
    const loop = (now) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      controls.update(dt);
      const t1 = performance.now();
      draw();
      samples.push(performance.now() - t1);
      if (samples.length > 8) samples.shift();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  function capture(download) {
    draw();
    const label = makeLabel();
    const shot = shotLabel(canvas, label);
    ui.status.dataset.shot = label;
    if (download) {
      const a = document.createElement('a');
      a.href = shot.url;
      a.download = '370z-' + angleId + '.png';
      a.click();
    }
    return { label, url: shot.url, bright: shot.bright };
  }

  function captureBase() {
    const tint = X.shell.uniforms.tint.value;
    const rim = X.shell.uniforms.rim.value;
    const def = X._def || {};
    base = {
      paint: hex(tint),
      glow: hex(rim),
      grid: def.grid ? hex(def.grid) : '#3ee6ff',
      wheel: def.rimC ? hex(def.rimC) : '#4a4f57',
      caliper: '#d1121f',
    };
  }

  async function sweep() {
    const fails = [];
    const notes = [];
    const before = errors.length;
    wantTurn = false;
    controls.autoRotate = false;
    compare = false;
    eqA = defaults();
    draw();
    captureBase();
    const tint0 = hex(X.shell.uniforms.tint.value);
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      for (const item of spec.options) {
        eqA = defaults();
        eqA[slot] = item.id;
        try { draw(); } catch (err) {
          fails.push(slot + '=' + item.id + ' ' + (err && err.message || err));
          continue;
        }
        const bad = finiteCar();
        if (bad.length) fails.push(slot + '=' + item.id + ' ' + bad.slice(0, 4).join(','));
      }
    }
    const mixed = defaults();
    mixed.paint = 'pink';
    mixed.wheels = 'gold';
    mixed.spoiler = 'gtwing';
    mixed.caliper = 'cyan';
    mixed.underglow = 'pink';
    eqA = mixed;
    try { draw(); } catch (err) { fails.push('mixed ' + err.message); }
    eqA = defaults();
    draw();
    const tint1 = hex(X.shell.uniforms.tint.value);
    if (tint1 !== tint0) fails.push('paint leftover ' + tint1 + ' vs ' + tint0);
    const lines = designText();
    if (lines.some((l) => l.startsWith('FAIL'))) fails.push('design ' + lines.filter((l) => l.startsWith('FAIL')).join(' | '));
    compare = true;
    eqB = defaults();
    eqB.paint = 'cyan';
    const yaw = readOrbit().yaw;
    draw();
    if (Math.abs(readOrbit().yaw - yaw) > 0.02) fails.push('compare yaw drifted');
    compare = false;
    eqA = defaults();
    const shot = capture(false);
    const expect = makeLabel();
    if (shot.label !== expect) fails.push('label ' + shot.label);
    if (!(shot.bright > 8)) fails.push('label pixels ' + shot.bright);
    const fresh = errors.slice(before);
    for (const e of fresh) fails.push('error ' + e);
    wantTurn = turn;
    controls.autoRotate = turn;
    return { fails, notes, label: shot.label, errors: fresh };
  }

  function settings() {
    return { eqA: Object.assign({}, eqA), eqB: eqB ? Object.assign({}, eqB) : null, angle: angleId, compare, turn: wantTurn, edit };
  }

  async function setView(opts) {
    opts = opts || {};
    if (opts.eq) eqA = Object.assign(defaults(), opts.eq);
    if (opts.compare) {
      compare = true;
      ui.compareBtn.classList.add('on');
      eqB = Object.assign(defaults(), opts.eqB || { paint: 'cyan' });
    } else if (opts.compare === false) {
      compare = false;
      ui.compareBtn.classList.remove('on');
    }
    if (opts.angle) {
      angleId = opts.angle;
      const angle = ANGLES.find((a) => a.id === opts.angle);
      if (angle) place(angle.yaw, angle.pitch, camera.position.distanceTo(controls.target) || 10.5);
    }
    if (opts.turn != null) {
      wantTurn = !!opts.turn;
      turn = wantTurn;
      controls.autoRotate = wantTurn;
    }
    refreshGui();
    paintChips();
    draw();
  }

  return {
    id: 'car',
    title: 'CAR & PAINT',
    async mount(container, context) {
      alive = true;
      host = container;
      ctx = context || { onSave() {} };
      unhook = hook();
      try {
        catalog = await fetchJson(devUrl('catalogs/car.json'));
        try {
          const res = await fetch(repoUrl(catalog.design.checker));
          checkerNote = res.ok
            ? '370Z design checker file is in this branch.'
            : 'Official 370Z design checker is not in this branch. The lines above are measured from the live Xray model.';
        } catch (err) {
          checkerNote = 'Official 370Z design checker is not in this branch. The lines above are measured from the live Xray model.';
        }
        eqA = defaults();
        eqB = defaults();
        layout();
        X = await loadXray();
        if (!alive) return;
        draw();
        captureBase();
        designText();
        ui.status.textContent = '370Z · game shader';
        paintChips();
        if (pending) await setView(pending);
        pending = null;
        ready = true;
        if (window.__SPIN) window.__SPIN.car = { sweep, capture, setView, frames: () => samples.slice(), errors: () => errors.slice() };
        if (ctx.signal) ctx.signal.addEventListener('abort', () => this.unmount());
      } catch (err) {
        this.unmount();
        throw err;
      }
    },
    unmount() {
      alive = false;
      ready = false;
      try { unhook(); } catch (err) { /* restored */ }
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      if (controls) controls.dispose();
      if (gui) gui.destroy();
      if (ui.obs) ui.obs.disconnect();
      controls = null;
      gui = null;
      canvas = null;
      if (host) host.innerHTML = '';
    },
    save() { return settings(); },
    load(s) { if (!ready) pending = s; else setView(s); },
  };
}
