import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';

const BG = 0xc8f4ff;
const INK_BG = 0xd7e6f2;
const params = new URLSearchParams(location.search);
const SHOW_FPS = params.get('fps') === '1' || params.get('bench') === '1';
const SHOW_PERF = params.get('perf') === '1';
const SHOW_METER = SHOW_FPS || SHOW_PERF;
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
const gltfLoader = new GLTFLoader();
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
      if (o.isSkinnedMesh) m.skinning = true;
      m.transparent = false;
      m.opacity = 1;
      m.alphaTest = 0;
      m.depthWrite = true;
      if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
      const name = (m.name || '').toLowerCase();
      if (m.color && !m.map) {
        if (name.includes('face') || name.includes('skin')) m.color.set('#f0c2a0');
        else if (name.includes('hair')) m.color.set('#c9853a');
        else if (name.includes('shirt') || name.includes('top') || name.includes('jacket')) m.color.set('#3a7bd5');
        else if (name.includes('pant')) m.color.set('#2a3358');
        else if (name.includes('belt') || name.includes('shoe') || name.includes('boot')) m.color.set('#2a211c');
        else if (name.includes('dog') || name.includes('fur')) m.color.set('#e0b060');
        else if (name.includes('grey') || name.includes('gray')) m.color.set('#7d8494');
        else if (Math.max(m.color.r, m.color.g, m.color.b) < 0.12) m.color.multiplyScalar(8);
      }
      if (m.map && name.includes('fox')) m.color.set('#d9783a');
    }
    // One skinned program, no picture on it. A second skinned program (the fox
    // texture) pushed the curtain's first draw over 80 ms.
    const flat = mats.map((m) => asLambert(m, o.isSkinnedMesh));
    o.material = Array.isArray(o.material) ? flat : flat[0];
    if (o.geometry && o.geometry.getAttribute('normal')) o.geometry.deleteAttribute('normal');
    coalesceGroups(o.geometry);
  });
}

// The pack FBX splits one material across dozens of ranges. One range per
// material is the same colors in a handful of draws.
function coalesceGroups(geometry) {
  const groups = geometry && geometry.groups;
  if (!groups || groups.length < 8 || geometry.index) return;
  if (geometry.morphAttributes && Object.keys(geometry.morphAttributes).length) return;
  const names = Object.keys(geometry.attributes);
  const byMat = new Map();
  for (const g of groups) {
    if (!byMat.has(g.materialIndex)) byMat.set(g.materialIndex, []);
    byMat.get(g.materialIndex).push(g);
  }
  const copies = {};
  for (const name of names) {
    const src = geometry.attributes[name].array;
    copies[name] = new src.constructor(src.length);
  }
  const next = [];
  let cursor = 0;
  for (const mi of [...byMat.keys()].sort((a, b) => a - b)) {
    const start = cursor;
    for (const g of byMat.get(mi)) {
      for (const name of names) {
        const attr = geometry.attributes[name];
        const item = attr.itemSize;
        copies[name].set(attr.array.subarray(g.start * item, (g.start + g.count) * item), cursor * item);
      }
      cursor += g.count;
    }
    next.push({ start, count: cursor - start, materialIndex: mi });
  }
  for (const name of names) {
    geometry.attributes[name].array.set(copies[name]);
    geometry.attributes[name].needsUpdate = true;
  }
  geometry.clearGroups();
  for (const g of next) geometry.addGroup(g.start, g.count, g.materialIndex);
}

function asLambert(m, skinned) {
  if (!m) return m;
  const next = new THREE.MeshBasicMaterial({
    name: m.name,
    color: m.color ? m.color.clone() : 0xffffff,
    map: null,
  });
  next.skinning = !!skinned;
  next.fog = false;
  next.transparent = false;
  next.opacity = 1;
  next.alphaTest = 0;
  next.depthWrite = true;
  if (next.map) next.map.colorSpace = THREE.SRGBColorSpace;
  if (m !== next) m.dispose();
  return next;
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

const PET_CATALOG = {
  fox: {
    url: 'adventure/assets/pets/Fox.glb',
    height: 0.4,
    yaw: Math.PI,
    label: 'Fox',
    idle: 'survey',
    walk: 'walk',
  },
  cat: {
    url: 'adventure/assets/pets/Cat.glb',
    height: 0.36,
    yaw: Math.PI / 2,
    label: 'Cat',
    idle: 'idle',
    walk: 'walk',
  },
  puppy: {
    url: 'adventure/assets/pets/Puppy.glb',
    height: 0.34,
    yaw: Math.PI / 2,
    label: 'Puppy',
    idle: 'idle',
    walk: 'walk',
  },
};
const PET_NOTE = {
  bunny: 'No free four-legged animated bunny is in this build.',
  aussie: 'No free animated Australian Shepherd is in this build.',
};

function petChoice() {
  const id = (params.get('pet') || 'fox').toLowerCase();
  if (PET_CATALOG[id] || PET_NOTE[id]) return id;
  return 'fox';
}

function actorBox(root) {
  const box = skinnedBox(root);
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isMesh || o.isSkinnedMesh || !o.geometry) return;
    box.union(new THREE.Box3().setFromObject(o));
  });
  return box;
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

async function loadPet(spec) {
  const gltf = await gltfLoader.loadAsync(spec.url);
  const obj = gltf.scene;
  obj.animations = gltf.animations || [];
  // Nose ends up on local -Z, the same way Ellie faces.
  obj.rotation.y = spec.yaw;
  prepareModel(obj);
  const box = fitHeight(obj, spec.height);
  const mixer = new THREE.AnimationMixer(obj);
  const idleClip = clipNamed(obj.animations, spec.idle);
  const walkClip = clipNamed(obj.animations, spec.walk);
  const idle = idleClip ? mixer.clipAction(idleClip) : null;
  const walk = walkClip ? mixer.clipAction(walkClip) : null;
  if (idle) {
    idle.play();
    mixer.setTime(Math.min(0.2, idleClip.duration * 0.15));
    obj.updateMatrixWorld(true);
    const posed = skinnedBox(obj);
    obj.position.y -= posed.min.y;
  }
  return { obj, mixer, idle, walk, clips: obj.animations.map((c) => c.name), box, label: spec.label };
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

const _stamp = new THREE.Object3D();

function stampRing(mesh, count, radius, y, faceIn, spin, parent) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (spin || 0);
    _stamp.position.set(Math.sin(a) * radius, y, Math.cos(a) * radius);
    _stamp.rotation.set(0, 0, 0);
    _stamp.scale.set(1, 1, 1);
    if (faceIn) _stamp.lookAt(0, y, 0);
    _stamp.updateMatrix();
    mesh.setMatrixAt(i, _stamp.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  parent.add(mesh);
}

const detail = new THREE.Group();
const meadow = new THREE.Group();
meadow.visible = false;
const play = {
  post: null,
  crab: null,
  crabHome: new THREE.Vector3(1.3, 0, 2.5),
  crabLegs: [],
  nia: null,
  house: null,
  swing: null,
  spark: null,
  bolt: null,
  motes: null,
  gust: null,
  swingLeft: 0,
  sparkLeft: 0,
  boltLeft: 0,
  moteLeft: 0,
  gustLeft: 0,
  gustReady: -10,
  bowHeld: false,
  aim: 0,
  knocked: false,
  wantSwing: false,
  wantSpark: false,
  wantGust: false,
  bowDown: false,
};

function box(w, h, d, color, x, y, z, parent) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshBasicMaterial({ color }),
  );
  mesh.position.set(x, y, z);
  mesh.frustumCulled = false;
  parent.add(mesh);
  return mesh;
}

function buildCourtyard() {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(7.2, 32),
    new THREE.MeshBasicMaterial({ color: 0xe7fff6 }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  scene.add(detail);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(6.55, 6.85, 32),
    new THREE.MeshBasicMaterial({ color: 0x3ee6ff, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.012;
  detail.add(ring);
  const walls = new THREE.InstancedMesh(
    new THREE.BoxGeometry(2.15, 1.15, 0.16),
    new THREE.MeshBasicMaterial({ color: 0xf7fbff }),
    8,
  );
  stampRing(walls, 8, 6.2, 0.58, true, Math.PI / 8, detail);
  const trims = new THREE.InstancedMesh(
    new THREE.BoxGeometry(2.15, 0.06, 0.18),
    new THREE.MeshBasicMaterial({ color: 0x3ee6ff }),
    8,
  );
  stampRing(trims, 8, 6.2, 1.16, true, Math.PI / 8, detail);
  const posts = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.06, 0.08, 1.7, 6),
    new THREE.MeshBasicMaterial({ color: 0xf4f7fb }),
    4,
  );
  stampRing(posts, 4, 4.4, 0.85, false, 0, detail);
  const lamps = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.16, 6, 5),
    new THREE.MeshBasicMaterial({ color: 0xfff2a8 }),
    4,
  );
  stampRing(lamps, 4, 4.4, 1.72, false, 0, detail);

  const house = new THREE.Group();
  box(2.4, 0.08, 2.2, 0xd7e4ea, 0, 0.04, 0, house);
  box(0.12, 1.5, 0.12, 0xf7fbff, -1.1, 0.75, -1, house);
  box(0.12, 1.5, 0.12, 0xf7fbff, 1.1, 0.75, -1, house);
  box(0.12, 1.5, 0.12, 0xf7fbff, -1.1, 0.75, 1, house);
  box(0.12, 1.5, 0.12, 0xf7fbff, 1.1, 0.75, 1, house);
  box(2.3, 1.35, 0.08, 0xf4f8fb, 0, 0.72, -1.05, house);
  box(0.08, 1.35, 2.1, 0xf4f8fb, -1.15, 0.72, 0, house);
  box(0.08, 1.35, 2.1, 0xf4f8fb, 1.15, 0.72, 0, house);
  const panes = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.42, 0.55, 0.04),
    new THREE.MeshBasicMaterial({ color: 0x8ef6ff }),
    4,
  );
  panes.frustumCulled = false;
  for (let i = 0; i < 4; i++) {
    _stamp.position.set(-0.7 + i * 0.48, 0.9, -1.08);
    _stamp.rotation.set(0, 0, 0);
    _stamp.scale.set(1, 1, 1);
    _stamp.updateMatrix();
    panes.setMatrixAt(i, _stamp.matrix);
  }
  panes.instanceMatrix.needsUpdate = true;
  house.add(panes);
  house.position.set(4.6, 0, 0.4);
  detail.add(house);
  play.house = house;

  play.post = box(0.18, 1.2, 0.18, 0xf4f7fb, 0.75, 0.6, 1.55, detail);
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 6, 5),
    new THREE.MeshBasicMaterial({ color: 0xfff2a8 }),
  );
  lamp.position.set(0.75, 1.28, 1.55);
  detail.add(lamp);

  const crab = new THREE.Group();
  box(0.46, 0.28, 0.36, 0xc9853a, 0, 0.28, 0, crab);
  play.crabLegs = [];
  for (const s of [-1, 1]) {
    for (const z of [-0.12, 0.12]) {
      play.crabLegs.push(box(0.28, 0.06, 0.06, 0x8a5a28, s * 0.32, 0.12, z, crab));
    }
  }
  crab.position.copy(play.crabHome);
  detail.add(crab);
  play.crab = crab;

  box(0.14, 1.3, 0.14, 0xf7fbff, -0.7, 0.65, -5.35, scene);
  box(0.14, 1.3, 0.14, 0xf7fbff, 0.7, 0.65, -5.35, scene);
  box(1.6, 0.1, 0.12, 0x3ee6ff, 0, 1.25, -5.35, scene);

  const grass = new THREE.Mesh(
    new THREE.CircleGeometry(6.2, 24),
    new THREE.MeshBasicMaterial({ color: 0xb6f2c4 }),
  );
  grass.rotation.x = -Math.PI / 2;
  meadow.add(grass);
  meadow.position.set(0, 0, -12);
  scene.add(meadow);

  play.swing = box(0.9, 0.08, 0.16, 0xfff2a8, 0, 0.9, 0.7, scene);
  play.swing.visible = false;
  play.spark = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0x8ef6ff }),
  );
  play.spark.visible = false;
  scene.add(play.spark);
  play.bolt = box(0.08, 0.08, 0.28, 0xfff2a8, 0, 0.9, 0, scene);
  play.bolt.visible = false;
  play.motes = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.05, 5, 4),
    new THREE.MeshBasicMaterial({ color: 0xfff2a8 }),
    8,
  );
  play.motes.frustumCulled = false;
  play.motes.visible = false;
  scene.add(play.motes);
  play.gust = new THREE.Mesh(
    new THREE.RingGeometry(0.25, 0.4, 16),
    new THREE.MeshBasicMaterial({ color: 0xd8fff4, side: THREE.DoubleSide }),
  );
  play.gust.rotation.x = -Math.PI / 2;
  play.gust.visible = false;
  scene.add(play.gust);
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
  const box = actorBox(root);
  const size = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.y, size.z);
  const dist = Math.max(1.05, span / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.32);
  const bias = yawBias || 0.15;
  camera.position.set(c.x + Math.sin(bias) * dist * 0.22, c.y, c.z + dist);
  camera.lookAt(c.x, c.y, c.z);
}

function frameCamera(mode) {
  if (mode === 'hero') { frameSubject(heroRig, 0.2); return; }
  if (mode === 'pet') { frameSubject(petRig, 0.3); return; }
  if (mode === 'house' && play.house) { frameSubject(play.house, 0.5); return; }
  if (mode === 'nia' && play.nia) { frameSubject(play.nia.obj, 0.4); return; }
  if (mode === 'crab' && play.crab) { frameSubject(play.crab, 0.6); return; }
  if (mode === 'meadow') {
    camera.position.set(1.4, 2.4, -6.4);
    camera.lookAt(0, 0.75, -9.2);
    return;
  }
  if (mode === 'shot' || mode === 'play') {
    // Play sits past the lamp ring (radius 4.4). A camera on that ring fills the picture with one lamp.
    const dist = mode === 'shot' ? 3.15 : 5.5;
    const side = mode === 'shot' ? 0 : 0.9;
    const lookY = mode === 'shot' ? 0.78 : 0.9;
    camTarget.set(heroRig.position.x, lookY, heroRig.position.z);
    const back = yaw + Math.PI;
    camera.position.set(
      camTarget.x + Math.sin(back) * dist + Math.cos(back) * side,
      mode === 'shot' ? 1.15 : 2.05,
      camTarget.z + Math.cos(back) * dist - Math.sin(back) * side,
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
  petRig.position.set(which === 'both' ? 1.05 : 0, 0, which === 'both' ? 0.15 : 0);
  const face = Math.PI;
  heroRig.rotation.y = viewYaw + face;
  petRig.rotation.y = viewYaw + face;
  heroRig.visible = which !== 'pet';
  petRig.visible = which !== 'hero';
  seek(which === 'pet' ? world.pet : world.hero, walking ? 'walk' : 'idle', walking ? t : 0.15);
  if (which === 'both') seek(world.pet, 'idle', 0.2);
  heroRig.position.y = walking && which !== 'pet' ? Math.abs(Math.sin((t % 1) * Math.PI * 2)) * 0.028 : 0;
  const height = which === 'pet' ? 0.7 : 1.55;
  const lookY = which === 'pet' ? 0.24 : height * 0.48;
  let dist = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.42;
  if (which === 'pet') dist *= 1.35;
  if (which === 'both') dist *= 1.18;
  camera.position.set(0, lookY, dist);
  camera.lookAt(0, lookY, 0);
  camera.updateProjectionMatrix();
  holdPose = true;
  renderer.render(scene, camera);
}

function spanLength(root) {
  const q = root.quaternion.clone();
  const pos = root.position.clone();
  root.quaternion.identity();
  root.updateMatrixWorld(true);
  const box = skinnedBox(root);
  const size = box.getSize(new THREE.Vector3());
  root.quaternion.copy(q);
  root.position.copy(pos);
  root.updateMatrixWorld(true);
  return Math.max(size.x, size.z);
}

function measureActor(root) {
  root.updateMatrixWorld(true);
  const box = actorBox(root);
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
    length: Math.max(size.x, size.z, spanLength(root)),
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
    if (!hips) return out;
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
    p99: at(0.99),
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
  scored.shaderMs = world.shaderMs || 0;
  scored.compileMs = world.compileMs || 0;
  scored.warmMs = world.warmMs || 0;
  scored.warmTinyMs = world.warmTinyMs || 0;
  const avg = {};
  for (let i = 0; i < SLICE_NAMES.length; i++) {
    const key = SLICE_NAMES[i];
    avg[key] = sliceFrames ? +(sliceSum[key] / sliceFrames).toFixed(3) : 0;
  }
  scored.slices = avg;
  scored.dips = dipCount;
  scored.calls = renderer.info.render.calls;
  scored.tris = renderer.info.render.triangles;
  const logged = Math.min(50, dipCount);
  const dipLog = [];
  for (let i = 0; i < logged; i++) {
    const s = dipSlots[(dipCount - logged + i) % 50];
    dipLog.push({
      ms: +s.ms.toFixed(1),
      slice: s.slice,
      what: s.what,
      calls: s.calls,
      tris: s.tris,
    });
  }
  scored.dipLog = dipLog;
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
    'M8  ' + deviceKind() + '  ' + (g.pass ? 'PASS' : 'FAIL'),
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
    petId: world.petId,
    petNote: world.petNote || null,
    clips: world.hero ? { hero: world.hero.clips, pet: world.pet ? world.pet.clips : null } : null,
    bones() {
      return { hero: boneList(heroRig), pet: world.pet ? boneList(petRig) : null };
    },
    measure() {
      return {
        hero: measureActor(heroRig),
        pet: world.pet ? measureActor(petRig) : null,
        petId: world.petId,
      };
    },
    walkSamples(frames) {
      return {
        hero: walkSamples(world.hero, frames || 8),
        pet: world.pet ? walkSamples(world.pet, frames || 8) : null,
      };
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

const SLICE_NAMES = ['world', 'player', 'pet', 'swing', 'spark', 'bow', 'foes', 'meter', 'draw', 'spare'];
const slice = { world: 0, player: 0, pet: 0, swing: 0, spark: 0, bow: 0, foes: 0, meter: 0, draw: 0, spare: 0 };
const sliceSum = { world: 0, player: 0, pet: 0, swing: 0, spark: 0, bow: 0, foes: 0, meter: 0, draw: 0, spare: 0 };
let sliceFrames = 0;
const bars = new Float32Array(120);
let barWrite = 0;
let meterTick = 0;
const dipSlots = [];
for (let i = 0; i < 50; i++) {
  dipSlots.push({ t: 0, ms: 0, slice: '', calls: 0, tris: 0, tex: 0, what: '', step: '' });
}
let dipCount = 0;
let sliceCursor = 'world';
let sliceT = 0;

function zeroSlices() {
  for (let i = 0; i < SLICE_NAMES.length; i++) slice[SLICE_NAMES[i]] = 0;
  sliceCursor = 'world';
  sliceT = performance.now();
}

function takeSlice(next) {
  const n = performance.now();
  slice[sliceCursor] += n - sliceT;
  sliceCursor = next;
  sliceT = n;
}

function foeCap() {
  const k = deviceKind();
  if (k === 'ipad') return 3;
  if (k === 'pc') return 6;
  return 4;
}

function frameBudget() {
  const k = deviceKind();
  if (k === 'ipad') return 33;
  if (k === 'pc') return 16.7;
  return 20;
}

function activity() {
  if (world.chunk) return 'chunk';
  if (play.boltLeft > 0 || play.bowHeld) return 'shot';
  if (play.sparkLeft > 0) return 'spark';
  if (play.swingLeft > 0) return 'swing';
  if (run && moving) return 'run';
  if (moving) return 'walk';
  return 'idle';
}

function biggestSlice() {
  let name = 'spare';
  let best = -1;
  for (let i = 0; i < SLICE_NAMES.length; i++) {
    const key = SLICE_NAMES[i];
    if (slice[key] > best) { best = slice[key]; name = key; }
  }
  return name;
}

function noteDip(ms, why) {
  const slot = dipSlots[dipCount % 50];
  dipCount += 1;
  slot.t = performance.now();
  slot.ms = ms;
  slot.slice = why || biggestSlice();
  const info = renderer.info.render;
  slot.calls = info.calls;
  slot.tris = info.triangles;
  slot.tex = world.texBytes || 0;
  slot.what = activity();
  slot.step = 'M8';
}

function paintMeter(frameMs) {
  meterTick += 1;
  const meter = document.getElementById('meter');
  const lines = document.getElementById('slices');
  if (!meter || !lines) return;
  if ((meterTick & 3) !== 0) return;
  bars[barWrite % 120] = frameMs;
  barWrite += 1;
  const g = meter.getContext('2d');
  const w = meter.width;
  const h = meter.height;
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#142033';
  g.fillRect(0, 0, w, h);
  const budget = frameBudget();
  const yLine = h - (budget / 40) * h;
  g.strokeStyle = '#ffb020';
  g.beginPath();
  g.moveTo(0, yLine);
  g.lineTo(w, yLine);
  g.stroke();
  g.fillStyle = '#9af7e2';
  const n = Math.min(120, barWrite);
  const start = barWrite - n;
  for (let i = 0; i < n; i++) {
    const ms = bars[(start + i) % 120];
    const bh = Math.min(h, (ms / 40) * h);
    g.fillRect(i * (w / 120), h - bh, Math.max(1, w / 120 - 1), bh);
  }
  if ((meterTick % 12) !== 0) return;
  const info = renderer.info.render;
  const parts = [];
  for (let i = 0; i < SLICE_NAMES.length; i++) {
    const key = SLICE_NAMES[i];
    parts.push(key + ' ' + slice[key].toFixed(2));
  }
  lines.textContent = parts.join('\n')
    + '\ncalls ' + info.calls + '  tris ' + info.triangles
    + '\ntex ' + (world.texBytes || 0) + ' B  cap ' + foeCap()
    + '\ndips ' + dipCount;
}

let meterNodesReady = false;
function bindActs() {
  const root = document.getElementById('acts');
  if (!root) return;
  const buttons = root.querySelectorAll('button');
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const act = btn.getAttribute('data-act');
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (act === 'swing') play.wantSwing = true;
      if (act === 'spark') play.wantSpark = true;
      if (act === 'gust') play.wantGust = true;
      if (act === 'bow') play.bowDown = true;
    });
    btn.addEventListener('pointerup', () => { if (act === 'bow') play.bowDown = false; });
    btn.addEventListener('pointercancel', () => { if (act === 'bow') play.bowDown = false; });
  }
}

function ensureMeter() {
  if (meterNodesReady || !SHOW_METER) return;
  meterNodesReady = true;
  const meter = document.createElement('canvas');
  meter.id = 'meter';
  meter.width = 240;
  meter.height = 72;
  meter.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:4;background:#142033;border-radius:8px;';
  const lines = document.createElement('pre');
  lines.id = 'slices';
  lines.style.cssText = 'position:fixed;right:12px;bottom:92px;z-index:4;margin:0;background:rgba(7,1,15,.88);color:#d8fff4;padding:8px;border-radius:8px;font:11px/1.35 ui-monospace,monospace;';
  document.body.appendChild(meter);
  document.body.appendChild(lines);
  if (SHOW_PERF) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Copy dips';
    btn.style.cssText = 'position:fixed;left:12px;top:12px;z-index:5;font:700 14px system-ui,sans-serif;';
    btn.addEventListener('click', () => {
      const n = Math.min(50, dipCount);
      const start = dipCount - n;
      const rows = [];
      for (let i = 0; i < n; i++) {
        const s = dipSlots[(start + i) % 50];
        rows.push(s.step + ' ' + s.what + ' ' + s.ms.toFixed(1) + 'ms ' + s.slice + ' calls ' + s.calls);
      }
      const text = rows.join('\n') || 'no dips';
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
      btn.textContent = text ? 'Copied' : 'Copy dips';
    });
    document.body.appendChild(btn);
  }
}

function placeNia(heroObj) {
  const nia = cloneSkinned(heroObj);
  nia.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const next = [];
    for (let i = 0; i < mats.length; i++) {
      const src = mats[i];
      if (!src) { next.push(src); continue; }
      const copy = src.clone();
      if ((copy.name || '').toLowerCase().includes('shirt')) copy.color.set('#e85d4c');
      next.push(copy);
    }
    o.material = Array.isArray(o.material) ? next : next[0];
  });
  nia.position.set(3.3, heroObj.position.y, 1.15);
  nia.rotation.y = Math.PI * 0.85;
  detail.add(nia);
  const mixer = new THREE.AnimationMixer(nia);
  const idleClip = clipNamed(heroObj.animations, 'idle');
  const idle = idleClip ? mixer.clipAction(idleClip) : null;
  if (idle) idle.play();
  play.nia = { obj: nia, mixer, idle };
}

function beginSwing() {
  if (play.swingLeft > 0) return;
  play.swingLeft = 0.28;
  play.swing.visible = true;
}

function beginSpark() {
  play.sparkLeft = 0.22;
  play.spark.visible = true;
  play.spark.position.set(play.post.position.x, 0.9, play.post.position.z);
}

function looseBolt() {
  play.boltLeft = 0.45;
  play.bolt.visible = true;
  play.bolt.userData.vx = Math.sin(yaw + play.aim);
  play.bolt.userData.vz = Math.cos(yaw + play.aim);
  play.bolt.position.set(heroRig.position.x, 0.9, heroRig.position.z);
}

function beginGust() {
  const now = performance.now() / 1000;
  if (now - play.gustReady < 6) return;
  play.gustReady = now;
  play.gustLeft = 0.28;
  play.gust.visible = true;
  play.gust.position.set(heroRig.position.x, 0.05, heroRig.position.z);
  if (!play.crab) return;
  const dx = play.crab.position.x - heroRig.position.x;
  const dz = play.crab.position.z - heroRig.position.z;
  const dist = Math.hypot(dx, dz);
  const fx = Math.sin(yaw);
  const fz = Math.cos(yaw);
  if (dist < 3 && dist > 0.01 && (dx * fx + dz * fz) / dist > 0.35) {
    play.crab.position.x += fx * 0.8;
    play.crab.position.z += fz * 0.8;
  }
}

function updatePlay(dt) {
  if (play.wantSwing) { play.wantSwing = false; beginSwing(); }
  if (play.wantSpark) { play.wantSpark = false; beginSpark(); }
  if (play.wantGust) { play.wantGust = false; beginGust(); }
  const bow = keys.has('digit3') || play.bowDown;
  if (bow) {
    play.bowHeld = true;
    if (keys.has('arrowleft')) play.aim -= dt;
    if (keys.has('arrowright')) play.aim += dt;
  } else if (play.bowHeld) {
    play.bowHeld = false;
    looseBolt();
  }
  if (keys.has('digit1')) beginSwing();
  if (keys.has('digit2')) beginSpark();
  if (keys.has('keyq')) beginGust();
  if (keys.has('keye') && play.nia) {
    const dx = play.nia.obj.position.x - heroRig.position.x;
    const dz = play.nia.obj.position.z - heroRig.position.z;
    if (dx * dx + dz * dz < 2.6) {
      play.knocked = true;
      const hint = document.getElementById('hint');
      if (hint) hint.textContent = 'You knocked. Nia is home.';
    }
  }
  takeSlice('swing');
  if (play.swingLeft > 0) {
    play.swingLeft -= dt;
    const face = yaw;
    play.swing.position.set(
      heroRig.position.x + Math.sin(face) * 0.7,
      0.9,
      heroRig.position.z + Math.cos(face) * 0.7,
    );
    play.swing.rotation.y = face;
    const px = play.post.position.x - play.swing.position.x;
    const pz = play.post.position.z - play.swing.position.z;
    play.post.material.color.set(px * px + pz * pz < 0.8 ? 0xffffff : 0xf4f7fb);
    if (play.swingLeft <= 0) play.swing.visible = false;
  }
  takeSlice('spark');
  if (play.sparkLeft > 0) {
    play.sparkLeft -= dt;
    if (play.sparkLeft <= 0) play.spark.visible = false;
  }
  takeSlice('bow');
  if (play.boltLeft > 0) {
    play.boltLeft -= dt;
    play.bolt.position.x += play.bolt.userData.vx * 8 * dt;
    play.bolt.position.z += play.bolt.userData.vz * 8 * dt;
    if (play.boltLeft <= 0) {
      play.bolt.visible = false;
      play.moteLeft = 0.35;
      play.motes.visible = true;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        _stamp.position.set(
          play.bolt.position.x + Math.cos(a) * 0.2,
          0.9,
          play.bolt.position.z + Math.sin(a) * 0.2,
        );
        _stamp.rotation.set(0, 0, 0);
        _stamp.scale.set(1, 1, 1);
        _stamp.updateMatrix();
        play.motes.setMatrixAt(i, _stamp.matrix);
      }
      play.motes.instanceMatrix.needsUpdate = true;
    }
  }
  if (play.moteLeft > 0) {
    play.moteLeft -= dt;
    if (play.moteLeft <= 0) play.motes.visible = false;
  }
  if (play.gustLeft > 0) {
    play.gustLeft -= dt;
    if (play.gustLeft <= 0) play.gust.visible = false;
  }
  takeSlice('foes');
  if (play.nia) play.nia.mixer.update(dt);
  if (play.crab) {
    const t = performance.now() / 1000;
    for (let i = 0; i < play.crabLegs.length; i++) {
      play.crabLegs[i].rotation.z = Math.sin(t * 4 + i) * 0.4;
    }
    const home = play.crabHome;
    const dx = play.crab.position.x - home.x;
    const dz = play.crab.position.z - home.z;
    if (dx * dx + dz * dz > 1.6) {
      play.crab.position.x = home.x + dx * 0.9;
      play.crab.position.z = home.z + dz * 0.9;
    }
  }
  takeSlice('world');
  const gate = -5.35;
  if (!world.inMeadow && heroRig.position.z < gate) {
    world.inMeadow = true;
    world.chunk = true;
    detail.visible = false;
    meadow.visible = true;
  } else if (world.inMeadow && heroRig.position.z > gate + 1.1) {
    world.inMeadow = false;
    world.chunk = true;
    detail.visible = true;
    meadow.visible = false;
  } else {
    world.chunk = false;
  }
}

async function boot() {
  if (!ANATOMY) buildCourtyard();
  const hero = await loadActor('adventure/assets/Casual_Female.fbx', 1.5);
  const petId = petChoice();
  const spec = PET_CATALOG[petId];
  const pet = spec ? await loadPet(spec) : null;
  heroRig.add(hero.obj);
  if (pet) petRig.add(pet.obj);
  if (!ANATOMY) placeNia(hero.obj);
  world.hero = hero;
  world.pet = pet;
  world.petId = petId;
  world.petNote = spec ? null : (PET_NOTE[petId] || null);
  const hint = document.getElementById('hint');
  if (hint) {
    hint.textContent = pet
      ? 'WASD walks. Shift runs. The ' + spec.label.toLowerCase() + ' stays at your heel.'
      : 'WASD walks. Shift runs. ' + world.petNote;
  }
  if (SHOT === 'pet') {
    heroRig.visible = false;
    petRig.position.set(0, 0, 0);
  } else if (SHOT === 'hero') {
    petRig.visible = false;
    heroRig.position.set(0, 0, 0);
    heroRig.rotation.y = 0.35;
  } else {
    petRig.position.set(1.05, 0, 0.35);
    heroRig.rotation.y = 0.4;
    petRig.rotation.y = 0.4;
  }
  resize();
  seek(hero, 'idle', 0.15);
  if (pet) seek(pet, 'idle', 0.2);
  const hm = measureActor(heroRig);
  const pm = pet ? measureActor(petRig) : null;
  world.hipY = hm.hipY;
  world.petTop = pm ? pm.maxY : 0;
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
  if (SHOT) document.body.classList.add('shot');
  if (SHOT === 'swing') beginSwing();
  if (SHOT === 'spark') beginSpark();
  if (SHOT === 'bow') {
    play.boltLeft = 0.2;
    play.bolt.visible = true;
    play.bolt.position.set(0.2, 0.9, 1.1);
  }
  if (SHOT === 'gust') {
    play.gust.visible = true;
    play.gust.position.set(0.4, 0.05, 0.8);
  }
  if (SHOT === 'meadow') {
    world.inMeadow = true;
    detail.visible = false;
    meadow.visible = true;
    heroRig.position.set(0, 0, -9);
  }
  if (SHOT) {
    yaw = 0.35;
    const framed = SHOT === 'hero' || SHOT === 'pet' || SHOT === 'house' || SHOT === 'nia' || SHOT === 'crab' || SHOT === 'meadow';
    frameCamera(framed ? SHOT : 'shot');
    const label = document.getElementById('label');
    if (label) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const kind = deviceKind();
      const title = kind === 'ipad' ? 'iPad' : (kind === 'pc' ? 'PC' : 'Phone');
      const petLabel = spec ? spec.label : petId;
      const who = SHOT === 'pet' ? petLabel : (SHOT === 'hero' ? 'Ellie' : 'Ellie and ' + petLabel.toLowerCase());
      label.hidden = false;
      label.textContent = title + ' ' + w + '×' + h + ' · ' + who
        + ' · Ellie ' + hm.height.toFixed(2) + ' m, hip ' + hm.hipY.toFixed(2) + ' m'
        + (pm
          ? ' · ' + petLabel.toLowerCase() + ' ' + pm.height.toFixed(2) + ' m × ' + pm.length.toFixed(2) + ' m, feet ' + pm.minY.toFixed(2) + ' m'
          : ' · ' + (world.petNote || ''))
        + (SHOT === '1' ? ' · pink = hip, gold = ground' : '');
    }
  } else if (!ANATOMY) {
    frameCamera('play');
  }
  const shadeT = performance.now();
  const fullW = canvas.clientWidth || window.innerWidth;
  const fullH = canvas.clientHeight || window.innerHeight;
  renderer.setSize(16, 16, false);
  camera.aspect = 1;
  camera.updateProjectionMatrix();
  await renderer.compileAsync(scene, camera);
  const tinyT = performance.now();
  renderer.render(scene, camera);
  world.warmTinyMs = performance.now() - tinyT;
  renderer.setSize(fullW, fullH, false);
  camera.aspect = fullW / Math.max(1, fullH);
  camera.updateProjectionMatrix();
  world.compileMs = performance.now() - shadeT - world.warmTinyMs;
  const warmT = performance.now();
  renderer.render(scene, camera);
  world.fullDrawMs = performance.now() - warmT;
  // The curtain's first draw is the tiny one. The full frame after it is cheap.
  world.warmMs = world.warmTinyMs;
  world.shaderMs = world.compileMs + world.warmTinyMs + world.fullDrawMs;
  world.texBytes = 0;
  if (world.warmMs >= 80) noteDip(world.warmMs, 'draw');
  bindActs();
  ensureMeter();
  world.ready = true;
  publish({
    heroMeasure: hm,
    petMeasure: pm,
    tris: { hero: triCount(hero.obj), pet: pet ? triCount(pet.obj) : 0 },
  });
  if (!SHOT && world.petNote) {
    const label = document.getElementById('label');
    if (label) {
      label.hidden = false;
      label.textContent = world.petNote;
    }
  }
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
  zeroSlices();
  const dt = Math.min(0.05, clock.getDelta());
  resize();
  if (ANATOMY && holdPose && world.ready) renderer.render(scene, camera);
  if (world.ready && !ANATOMY) {
    if (!SHOT) {
      takeSlice('player');
      let mv = readMove();
      if (BENCH) {
        moving = true;
        run = false;
        mv = { x: 0, z: 1 };
      }
      const speed = (run ? 4.02 : 1.56);
      if (moving) {
        yaw = Math.atan2(mv.x, mv.z);
        heroRig.rotation.y = yaw;
        stepPhase += dt * (run ? 2.35 : 1.55);
        heroRig.position.y = Math.abs(Math.sin(stepPhase * Math.PI * 2)) * 0.028;
        heroRig.position.x += Math.sin(yaw) * speed * dt;
        heroRig.position.z += Math.cos(yaw) * speed * dt;
        const limit = world.inMeadow ? 16 : 5.5;
        const r = Math.hypot(heroRig.position.x, heroRig.position.z);
        if (r > limit) {
          heroRig.position.x *= limit / r;
          heroRig.position.z *= limit / r;
        }
      } else {
        heroRig.position.y = 0;
      }
      setAction(world.hero, moving);
      world.hero.mixer.update(dt);
      takeSlice('pet');
      if (world.pet) {
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
      }
      updatePlay(dt);
      frameCamera('play');
    } else {
      const framed = SHOT === 'hero' || SHOT === 'pet' || SHOT === 'house' || SHOT === 'nia' || SHOT === 'crab' || SHOT === 'meadow';
      frameCamera(framed ? SHOT : 'shot');
    }
    takeSlice('draw');
    renderer.render(scene, camera);
    takeSlice('meter');
    if (SHOW_METER) paintMeter(performance.now() - t0);
    takeSlice('spare');
  }
  const ms = performance.now() - t0;
  if (world.ready && !ANATOMY) {
    let used = 0;
    for (let i = 0; i < SLICE_NAMES.length; i++) {
      if (SLICE_NAMES[i] !== 'spare') used += slice[SLICE_NAMES[i]];
    }
    slice.spare = Math.max(0, ms - used);
    samples.push(ms);
    if (samples.length > WARMUP) {
      sliceFrames += 1;
      for (let i = 0; i < SLICE_NAMES.length; i++) sliceSum[SLICE_NAMES[i]] += slice[SLICE_NAMES[i]];
    }
    if (samples.length > MAX_SAMPLES) samples.shift();
    if (SHOW_PERF && (ms > frameBudget() || ms > 50)) noteDip(ms);
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
