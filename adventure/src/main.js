import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const BG = 0xc8f4ff;
const INK_BG = 0xd7e6f2;
const params = new URLSearchParams(location.search);
const SHOW_FPS = params.get('fps') === '1' || params.get('bench') === '1';
const BENCH = params.get('bench') === '1';
const ANATOMY = params.get('anatomy') === '1';
const SHOT = params.get('shot');
const BENCH_FRAMES = Math.max(120, Number(params.get('frames')) || 480);
const WARMUP = 30;

const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  alpha: false,
  powerPreference: 'high-performance',
  failIfMajorPerformanceCaveat: false,
});
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = false;
renderer.setClearColor(ANATOMY ? INK_BG : BG, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(ANATOMY ? INK_BG : BG);
const camera = new THREE.PerspectiveCamera(38, 1, 0.08, 80);

const hemi = new THREE.HemisphereLight(0xfff6e4, 0x8fd0c4, 0.85);
const sun = new THREE.DirectionalLight(0xffffff, 1.15);
sun.position.set(4, 10, 6);
scene.add(hemi, sun);
if (ANATOMY) {
  const fill = new THREE.DirectionalLight(0xffffff, 0.9);
  fill.position.set(0, 1.6, 5);
  scene.add(fill);
}

const loader = new FBXLoader();
const clock = new THREE.Clock();
const keys = new Set();
const stick = { x: 0, y: 0, on: false };
const samples = [];
const MAX_SAMPLES = 600;

const world = {
  ready: false,
  hero: null,
  pet: null,
  heroH: 1.5,
  petTop: 0,
  hipY: 0.78,
};

const _v = new THREE.Vector3();

function skinnedBox(root) {
  const box = new THREE.Box3();
  let any = false;
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isSkinnedMesh || !o.geometry || !o.geometry.attributes.position) return;
    const pos = o.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 4000));
    for (let i = 0; i < pos.count; i += step) {
      _v.fromBufferAttribute(pos, i);
      o.applyBoneTransform(i, _v);
      _v.applyMatrix4(o.matrixWorld);
      box.expandByPoint(_v);
      any = true;
    }
  });
  if (!any) box.setFromObject(root);
  return box;
}

function fitHeight(root, meters) {
  root.updateMatrixWorld(true);
  let box = skinnedBox(root);
  let sizeY = box.getSize(new THREE.Vector3()).y;
  if (!(sizeY > 0.05)) {
    box = new THREE.Box3().setFromObject(root);
    sizeY = box.getSize(new THREE.Vector3()).y;
  }
  const s = meters / Math.max(0.001, sizeY);
  root.scale.multiplyScalar(s);
  root.updateMatrixWorld(true);
  box = skinnedBox(root);
  if (!(box.getSize(new THREE.Vector3()).y > 0.05)) box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
  return skinnedBox(root);
}

function boneKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findBone(root, name) {
  const want = boneKey(name);
  let hit = null;
  root.traverse((o) => {
    if (hit || !o.isBone) return;
    const key = boneKey(o.name.split('|').pop());
    if (key === want || key.endsWith(want)) hit = o;
  });
  return hit;
}

function bonePos(bone, target) {
  bone.updateWorldMatrix(true, false);
  return bone.getWorldPosition(target);
}

function prepareModel(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (!m) continue;
      m.skinning = true;
      m.transparent = false;
      m.opacity = 1;
      m.alphaTest = 0;
      m.depthWrite = true;
      if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
      const name = (m.name || '').toLowerCase();
      if (m.color) {
        if (name.includes('face') || name.includes('skin')) m.color.set('#f0c2a0');
        else if (name.includes('hair')) m.color.set('#c9853a');
        else if (name.includes('shirt') || name.includes('top') || name.includes('jacket')) m.color.set('#3a7bd5');
        else if (name.includes('pant')) m.color.set('#2a3358');
        else if (name.includes('belt') || name.includes('shoe') || name.includes('boot')) m.color.set('#2a211c');
        else if (name.includes('pug') || name.includes('body') || name.includes('fur')) m.color.set('#c48a55');
        else if (Math.max(m.color.r, m.color.g, m.color.b) < 0.12) m.color.multiplyScalar(8);
      }
      m.needsUpdate = true;
    }
  });
}

function clipNamed(clips, fragment) {
  const f = fragment.toLowerCase();
  const exact = clips.find((c) => c.name.toLowerCase().endsWith('|' + f) || c.name.toLowerCase() === f);
  if (exact) return exact;
  return clips.find((c) => {
    const n = c.name.toLowerCase();
    return n.includes(f) && !n.includes('carry');
  }) || null;
}

async function loadActor(url, height) {
  const obj = await loader.loadAsync(url);
  prepareModel(obj);
  const box = fitHeight(obj, height);
  const mixer = new THREE.AnimationMixer(obj);
  const idleClip = clipNamed(obj.animations, 'idle');
  const walkClip = clipNamed(obj.animations, 'walk');
  const idle = idleClip ? mixer.clipAction(idleClip) : null;
  const walk = walkClip ? mixer.clipAction(walkClip) : null;
  if (idle) idle.play();
  return { obj, mixer, idle, walk, clips: obj.animations.map((c) => c.name), box };
}

function setAction(actor, moving) {
  if (!actor.idle || !actor.walk) {
    if (actor.walk && moving) actor.walk.play();
    return;
  }
  if (moving) {
    actor.walk.enabled = true;
    actor.walk.setEffectiveWeight(1);
    if (!actor.walk.isRunning()) actor.walk.play();
    actor.idle.setEffectiveWeight(0);
  } else {
    actor.idle.enabled = true;
    actor.idle.setEffectiveWeight(1);
    if (!actor.idle.isRunning()) actor.idle.play();
    actor.walk.setEffectiveWeight(0);
  }
}

function buildCourtyard() {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(7.2, 48),
    new THREE.MeshLambertMaterial({ color: 0xe7fff6 }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(6.55, 6.85, 48),
    new THREE.MeshBasicMaterial({ color: 0x3ee6ff, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.012;
  scene.add(ring);
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xf7fbff });
  const trimMat = new THREE.MeshBasicMaterial({ color: 0x3ee6ff });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.15, 0.16), wallMat);
    wall.position.set(Math.sin(a) * 6.2, 0.58, Math.cos(a) * 6.2);
    wall.lookAt(0, 0.58, 0);
    scene.add(wall);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.06, 0.18), trimMat);
    trim.position.copy(wall.position);
    trim.position.y = 1.16;
    trim.rotation.copy(wall.rotation);
    scene.add(trim);
  }
  const postMat = new THREE.MeshLambertMaterial({ color: 0xf4f7fb });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff2a8 });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.7, 8), postMat);
    post.position.set(Math.sin(a) * 4.4, 0.85, Math.cos(a) * 4.4);
    scene.add(post);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), lampMat);
    lamp.position.set(post.position.x, 1.72, post.position.z);
    scene.add(lamp);
  }
}

const heroRig = new THREE.Group();
const petRig = new THREE.Group();
scene.add(heroRig, petRig);

const tmp = new THREE.Vector3();
const follow = new THREE.Vector3();
const camTarget = new THREE.Vector3();
let yaw = 0;
let moving = false;
let run = false;
let stepPhase = 0;
let holdPose = false;

function resize() {
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

function readMove() {
  let x = 0;
  let z = 0;
  if (keys.has('keyw') || keys.has('arrowup')) z -= 1;
  if (keys.has('keys') || keys.has('arrowdown')) z += 1;
  if (keys.has('keya') || keys.has('arrowleft')) x -= 1;
  if (keys.has('keyd') || keys.has('arrowright')) x += 1;
  if (stick.on) {
    x += stick.x;
    z += stick.y;
  }
  const len = Math.hypot(x, z);
  run = keys.has('shiftleft') || keys.has('shiftright') || (stick.on && len > 0.82);
  if (len > 1) {
    x /= len;
    z /= len;
  }
  moving = len > 0.12;
  return { x: moving ? x : 0, z: moving ? z : 0 };
}

function frameSubject(root, yawBias) {
  const box = skinnedBox(root);
  const size = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  const dist = Math.max(1.15, size.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.28);
  const bias = yawBias || 0.15;
  camera.position.set(c.x + Math.sin(bias) * dist * 0.22, c.y, c.z + dist);
  camera.lookAt(c.x, c.y, c.z);
}

function frameCamera(mode) {
  if (mode === 'hero') { frameSubject(heroRig, 0.2); return; }
  if (mode === 'pet') { frameSubject(petRig, 0.3); return; }
  if (mode === 'shot' || mode === 'play') {
    const dist = mode === 'shot' ? 3.15 : 4.6;
    const lookY = mode === 'shot' ? 0.78 : 0.9;
    camTarget.set(heroRig.position.x, lookY, heroRig.position.z);
    const back = yaw + Math.PI;
    camera.position.set(
      camTarget.x + Math.sin(back) * dist,
      mode === 'shot' ? 1.15 : 1.85,
      camTarget.z + Math.cos(back) * dist,
    );
    camera.lookAt(camTarget);
    return;
  }
  camera.position.set(0, 1.15, 3.1);
  camera.lookAt(0, 0.8, 0);
}

function seek(actor, clipName, t) {
  if (!actor) return;
  const walkOn = clipName === 'walk';
  const action = walkOn ? actor.walk : actor.idle;
  const other = walkOn ? actor.idle : actor.walk;
  if (!action) return;
  if (other) other.setEffectiveWeight(0);
  action.enabled = true;
  action.setEffectiveWeight(1);
  action.play();
  const dur = Math.max(0.001, action.getClip().duration);
  actor.mixer.setTime((t % 1) * dur);
}

function placeAnatomy(which, viewYaw, t) {
  const walking = t >= 0;
  heroRig.position.set(0, 0, 0);
  petRig.position.set(which === 'both' ? 0.72 : 0, 0, which === 'both' ? 0.15 : 0);
  const face = Math.PI;
  heroRig.rotation.y = viewYaw + face;
  petRig.rotation.y = viewYaw + face;
  heroRig.visible = which !== 'pet';
  petRig.visible = which !== 'hero';
  seek(which === 'pet' ? world.pet : world.hero, walking ? 'walk' : 'idle', walking ? t : 0.15);
  if (which === 'both') seek(world.pet, 'idle', 0.2);
  heroRig.position.y = walking && which !== 'pet' ? Math.abs(Math.sin((t % 1) * Math.PI * 2)) * 0.028 : 0;
  const height = which === 'pet' ? 0.42 : 1.55;
  const lookY = height * 0.48;
  const dist = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.42;
  camera.position.set(0, lookY, dist);
  camera.lookAt(0, lookY, 0);
  camera.updateProjectionMatrix();
  holdPose = true;
  renderer.render(scene, camera);
}

function measureActor(root) {
  root.updateMatrixWorld(true);
  const box = skinnedBox(root);
  const size = box.getSize(new THREE.Vector3());
  const head = findBone(root, 'Head');
  const neck = findBone(root, 'Neck');
  const hips = findBone(root, 'Hips');
  const headEnd = findBone(root, 'Head_end');
  const wp = new THREE.Vector3();
  const headY = head ? bonePos(head, wp).y : box.max.y;
  const neckY = neck ? bonePos(neck, wp).y : headY;
  const hipY = hips ? bonePos(hips, wp).y : box.min.y + size.y * 0.5;
  const headTop = headEnd ? bonePos(headEnd, wp).y : box.max.y;
  const headFrac = (Math.max(headTop, headY) - Math.min(headY, neckY)) / Math.max(0.001, size.y);
  const feet = ['Foot.L', 'Foot.R'].map((n) => findBone(root, n)).filter(Boolean);
  const footY = feet.map((b) => bonePos(b, wp).y);
  return {
    height: size.y,
    minY: box.min.y,
    maxY: box.max.y,
    headFrac,
    headY,
    neckY,
    hipY,
    footY,
    bones: {
      head: !!head, neck: !!neck, hips: !!hips,
      upperArmL: !!findBone(root, 'UpperArm.L'),
      lowerArmL: !!findBone(root, 'LowerArm.L'),
      upperLegL: !!findBone(root, 'UpperLeg.L'),
      lowerLegL: !!findBone(root, 'LowerLeg.L'),
      footL: !!findBone(root, 'Foot.L'),
      footR: !!findBone(root, 'Foot.R'),
    },
  };
}

function walkSamples(actor, frames) {
  const clip = actor.walk.getClip();
  const out = [];
  const wp = new THREE.Vector3();
  actor.walk.enabled = true;
  actor.walk.setEffectiveWeight(1);
  actor.walk.play();
  if (actor.idle) actor.idle.setEffectiveWeight(0);
  for (let i = 0; i < frames; i++) {
    actor.mixer.setTime((i / frames) * clip.duration);
    actor.obj.updateMatrixWorld(true);
    const hips = findBone(actor.obj, 'Hips');
    const lf = findBone(actor.obj, 'Foot.L');
    const rf = findBone(actor.obj, 'Foot.R');
    const la = findBone(actor.obj, 'LowerArm.L');
    const ra = findBone(actor.obj, 'LowerArm.R');
    const hip = bonePos(hips, wp).clone();
    const sample = { hipY: hip.y };
    if (lf) sample.lf = bonePos(lf, wp).clone().sub(hip);
    if (rf) sample.rf = bonePos(rf, wp).clone().sub(hip);
    if (la) sample.la = bonePos(la, wp).clone().sub(hip);
    if (ra) sample.ra = bonePos(ra, wp).clone().sub(hip);
    out.push(sample);
  }
  return out;
}

function summarize(list) {
  if (!list.length) return null;
  const s = list.slice().sort((a, b) => a - b);
  const at = (q) => s[Math.min(s.length - 1, Math.floor(q * (s.length - 1)))];
  const n1 = Math.max(1, Math.ceil(s.length * 0.01));
  const worst1 = s.slice(-n1);
  const avgWorst = worst1.reduce((a, b) => a + b, 0) / worst1.length;
  const buckets = { lt8: 0, lt16: 0, lt33: 0, lt50: 0, gte50: 0 };
  for (const ms of s) {
    if (ms < 8) buckets.lt8++;
    else if (ms < 16.7) buckets.lt16++;
    else if (ms < 33) buckets.lt33++;
    else if (ms < 50) buckets.lt50++;
    else buckets.gte50++;
  }
  return {
    n: s.length,
    p50: at(0.5),
    p95: at(0.95),
    worst: s[s.length - 1],
    onePctLowFps: 1000 / avgWorst,
    p95Fps: 1000 / at(0.95),
    buckets,
  };
}

function stats() {
  if (samples.length <= WARMUP) return null;
  const scored = summarize(samples.slice(WARMUP));
  const hitch = samples.slice(0, WARMUP).reduce((a, b) => Math.max(a, b), 0);
  scored.bootHitch = hitch;
  scored.warmup = WARMUP;
  return scored;
}

function gate(st, kind) {
  if (!st) return { pass: false, kind, reason: 'no frames' };
  if (kind === 'ipad') {
    const pass = st.onePctLowFps >= 30 && st.p95 <= 33 && st.worst <= 50;
    return { pass, kind, need: '1% low >= 30 fps, p95 <= 33 ms, worst <= 50 ms' };
  }
  if (kind === 'pc') {
    const pass = st.onePctLowFps >= 60 && st.p95 <= 16.7 && st.worst <= 33;
    return { pass, kind, need: '1% low >= 60 fps, p95 <= 16.7 ms, worst <= 33 ms' };
  }
  const pass = st.onePctLowFps >= 50 && st.p95 <= 20 && st.worst <= 40;
  return { pass, kind, need: '1% low >= 50 fps, p95 <= 20 ms, worst <= 40 ms' };
}

function deviceKind() {
  const forced = (params.get('kind') || '').toLowerCase();
  if (forced === 'phone' || forced === 'ipad' || forced === 'pc') return forced;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const short = Math.min(w, h);
  const long = Math.max(w, h);
  if (short < 500) return 'phone';
  if (long >= 1280) return 'pc';
  return 'ipad';
}

const overlay = document.getElementById('fps');
function paintOverlay() {
  if (!SHOW_FPS || !overlay) return;
  const st = stats();
  if (!st) return;
  const g = gate(st, deviceKind());
  overlay.hidden = false;
  overlay.textContent = [
    'M0  ' + deviceKind() + '  ' + (g.pass ? 'PASS' : 'FAIL'),
    'frames ' + st.n,
    'p50 ' + st.p50.toFixed(2) + ' ms',
    'p95 ' + st.p95.toFixed(2) + ' ms',
    '1% low ' + st.onePctLowFps.toFixed(1) + ' fps',
    'worst ' + st.worst.toFixed(2) + ' ms',
    g.need,
  ].join('\n');
}

window.addEventListener('keydown', (e) => keys.add(e.code.toLowerCase()));
window.addEventListener('keyup', (e) => keys.delete(e.code.toLowerCase()));

const stickEl = document.getElementById('stick');
function stickPointer(ev, on) {
  if (!stickEl) return;
  const r = stickEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const dx = (ev.clientX - cx) / (r.width / 2);
  const dy = (ev.clientY - cy) / (r.height / 2);
  stick.on = on;
  stick.x = Math.max(-1, Math.min(1, dx));
  stick.y = Math.max(-1, Math.min(1, dy));
  if (!on) { stick.x = 0; stick.y = 0; }
}
if (stickEl) {
  stickEl.addEventListener('pointerdown', (e) => { stickEl.setPointerCapture(e.pointerId); stickPointer(e, true); });
  stickEl.addEventListener('pointermove', (e) => { if (stick.on) stickPointer(e, true); });
  stickEl.addEventListener('pointerup', (e) => stickPointer(e, false));
  stickEl.addEventListener('pointercancel', (e) => stickPointer(e, false));
}


function boneList(root) {
  const out = [];
  const wp = new THREE.Vector3();
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isBone) return;
    o.getWorldPosition(wp);
    out.push({ name: o.name, x: +wp.x.toFixed(3), y: +wp.y.toFixed(3), z: +wp.z.toFixed(3) });
  });
  return out;
}

function publish(extra) {
  const st = stats();
  window.__ADV = Object.assign({
    ready: world.ready,
    clips: world.hero ? { hero: world.hero.clips, pet: world.pet.clips } : null,
    bones() {
      return { hero: boneList(heroRig), pet: boneList(petRig) };
    },
    measure() {
      return { hero: measureActor(heroRig), pet: measureActor(petRig) };
    },
    walkSamples(frames) {
      return { hero: walkSamples(world.hero, frames || 8), pet: walkSamples(world.pet, frames || 8) };
    },
    pose(which, viewYaw, t) {
      placeAnatomy(which, viewYaw, t);
      return true;
    },
    stats: st,
    gate: st ? gate(st, deviceKind()) : null,
    benchDone: BENCH && samples.length >= BENCH_FRAMES,
  }, extra || {});
}

async function boot() {
  if (!ANATOMY) buildCourtyard();
  const hero = await loadActor('adventure/assets/Casual_Female.fbx', 1.5);
  const pet = await loadActor('adventure/assets/Pug.fbx', 0.4);
  heroRig.add(hero.obj);
  petRig.add(pet.obj);
  world.hero = hero;
  world.pet = pet;
  world.ready = true;
  if (SHOT === 'pet') {
    heroRig.visible = false;
    petRig.position.set(0, 0, 0);
  } else if (SHOT === 'hero') {
    petRig.visible = false;
    heroRig.position.set(0, 0, 0);
    heroRig.rotation.y = 0.35;
  } else {
    petRig.position.set(0.85, 0, 0.45);
    heroRig.rotation.y = 0.4;
  }
  resize();
  seek(hero, 'idle', 0.15);
  seek(pet, 'idle', 0.2);
  const hm = measureActor(heroRig);
  const pm = measureActor(petRig);
  world.hipY = hm.hipY;
  world.petTop = pm.maxY;
  if (SHOT === '1') {
    const ground = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.15, 0.02, 0.15),
      new THREE.Vector3(1.7, 0.02, 0.15),
    ]);
    const hip = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.15, hm.hipY, 0.15),
      new THREE.Vector3(1.7, hm.hipY, 0.15),
    ]);
    scene.add(new THREE.Line(ground, new THREE.LineBasicMaterial({ color: 0xc9a000 })));
    scene.add(new THREE.Line(hip, new THREE.LineBasicMaterial({ color: 0xff4d8d })));
  }
  if (SHOT) {
    yaw = 0.35;
    const mode = SHOT === 'hero' || SHOT === 'pet' ? SHOT : 'shot';
    frameCamera(mode);
    renderer.render(scene, camera);
    const label = document.getElementById('label');
    if (label) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const kind = deviceKind();
      const title = kind === 'ipad' ? 'iPad' : (kind === 'pc' ? 'PC' : 'Phone');
      const who = SHOT === 'pet' ? 'Pug' : (SHOT === 'hero' ? 'Ellie' : 'Ellie and pug');
      label.hidden = false;
      label.textContent = title + ' ' + w + '×' + h + ' · ' + who
        + ' · Ellie ' + hm.height.toFixed(2) + ' m, hip ' + hm.hipY.toFixed(2) + ' m'
        + ' · pug ' + pm.height.toFixed(2) + ' m, feet ' + pm.minY.toFixed(2) + ' m'
        + (SHOT === '1' ? ' · pink = hip, gold = ground' : '');
    }
  }
  publish({ heroMeasure: hm, petMeasure: pm, tris: { hero: triCount(hero.obj), pet: triCount(pet.obj) } });
  document.getElementById('boot').hidden = true;
}

function triCount(root) {
  let n = 0;
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    const idx = o.geometry.index;
    n += idx ? idx.count / 3 : (o.geometry.attributes.position ? o.geometry.attributes.position.count / 3 : 0);
  });
  return n;
}

function tick() {
  const t0 = performance.now();
  const dt = Math.min(0.05, clock.getDelta());
  resize();
  if (ANATOMY && holdPose && world.ready) renderer.render(scene, camera);
  if (world.ready && !ANATOMY) {
    if (!SHOT) {
      const mv = readMove();
      const speed = (run ? 4.02 : 1.56);
      if (moving) {
        yaw = Math.atan2(mv.x, mv.z);
        heroRig.rotation.y = yaw;
        stepPhase += dt * (run ? 2.35 : 1.55);
        heroRig.position.y = Math.abs(Math.sin(stepPhase * Math.PI * 2)) * 0.028;
        heroRig.position.x += Math.sin(yaw) * speed * dt;
        heroRig.position.z += Math.cos(yaw) * speed * dt;
        const r = Math.hypot(heroRig.position.x, heroRig.position.z);
        if (r > 5.6) {
          heroRig.position.x *= 5.6 / r;
          heroRig.position.z *= 5.6 / r;
        }
      } else {
        heroRig.position.y = 0;
      }
      setAction(world.hero, moving);
      world.hero.mixer.update(dt);
      follow.set(
        heroRig.position.x - Math.sin(yaw) * 1.15 + Math.cos(yaw) * 0.45,
        0,
        heroRig.position.z - Math.cos(yaw) * 1.15 - Math.sin(yaw) * 0.45,
      );
      petRig.position.lerp(follow, 1 - Math.exp(-dt * 5));
      petRig.position.y = 0;
      const dx = heroRig.position.x - petRig.position.x;
      const dz = heroRig.position.z - petRig.position.z;
      const gap = Math.hypot(dx, dz);
      if (gap > 0.2) petRig.rotation.y = Math.atan2(dx, dz);
      const petMoving = gap > 0.35 || moving;
      setAction(world.pet, petMoving);
      world.pet.mixer.update(dt);
      frameCamera('play');
    } else {
      frameCamera(SHOT === 'hero' || SHOT === 'pet' ? SHOT : 'shot');
    }
    renderer.render(scene, camera);
  }
  const ms = performance.now() - t0;
  if (world.ready && !ANATOMY) {
    samples.push(ms);
    if (samples.length > MAX_SAMPLES) samples.shift();
    paintOverlay();
    if (BENCH && samples.length >= BENCH_FRAMES) {
      publish({ benchDone: true });
    } else if (samples.length % 30 === 0) {
      publish();
    }
  }
  if (!(BENCH && samples.length >= BENCH_FRAMES)) requestAnimationFrame(tick);
}

boot().then(() => {
  publish();
  if (!BENCH || !world.ready) requestAnimationFrame(tick);
  else requestAnimationFrame(tick);
}).catch((err) => {
  const el = document.getElementById('boot');
  el.hidden = false;
  el.textContent = 'Could not open the courtyard. ' + err.message;
  window.__ADV = { ready: false, error: String(err && err.stack || err) };
});
