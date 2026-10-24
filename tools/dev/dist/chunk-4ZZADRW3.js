import {
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  OrbitControls,
  PerspectiveCamera,
  RingGeometry,
  SRGBColorSpace,
  Scene,
  SphereGeometry,
  Spherical,
  TOUCH,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  eachMaterial
} from "./chunk-JNBKNBFJ.js";

// tools/dev/src/bones.js
function boneKey(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function leaf(name) {
  return boneKey(String(name || "").split("|").pop());
}
function findBone(root, name) {
  const want = boneKey(name);
  let exact = null;
  let loose = null;
  root.traverse((o) => {
    if (!o.isBone) return;
    const key = leaf(o.name);
    if (!exact && (key === want || key.endsWith(want))) exact = o;
    if (!loose && key.includes(want) && !key.includes("end")) loose = o;
  });
  if (exact) return exact;
  if (loose) return loose;
  if (want === "head" || want === "spine" || want === "neck" || want === "hips") {
    root.updateMatrixWorld(true);
    const v = new Vector3();
    let high = null;
    let highY = -Infinity;
    root.traverse((o) => {
      if (!o.isBone) return;
      o.getWorldPosition(v);
      if (v.y > highY) {
        highY = v.y;
        high = o;
      }
    });
    return high;
  }
  return null;
}
function findBones(root, name) {
  const want = boneKey(name);
  const out = [];
  root.traverse((o) => {
    if (!o.isBone) return;
    const key = leaf(o.name);
    if (key.includes(want) && !key.includes("end")) out.push(o);
  });
  return out;
}
function boneWorld(bone, target) {
  bone.updateWorldMatrix(true, false);
  return bone.getWorldPosition(target);
}

// tools/dev/src/apply.js
var SLOT_ORDER = ["head", "eyes", "skin", "hair", "hairColor", "top", "bottom", "shoes", "extra", "size", "fur", "collar"];
function cloneMaterials(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const next = mats.map((m) => m ? m.clone() : m);
    o.material = Array.isArray(o.material) ? next : next[0];
  });
}
function stamp(root) {
  const bones = [];
  root.traverse((o) => {
    if (o.isBone) bones.push({ id: o.uuid, x: o.scale.x, y: o.scale.y, z: o.scale.z });
  });
  eachMaterial(root, (m) => {
    if (m.userData.src) return;
    m.userData.src = {
      hex: m.color ? m.color.getHexString() : null,
      visible: m.visible !== false,
      opacity: m.opacity,
      transparent: !!m.transparent,
      depthWrite: m.depthWrite !== false,
      wireframe: !!m.wireframe
    };
  });
  root.userData.bone0 = bones;
  root.userData.attached = [];
}
function resetLook(root, wrapper) {
  const byId = /* @__PURE__ */ new Map();
  root.traverse((o) => {
    if (o.isBone) byId.set(o.uuid, o);
  });
  for (const b of root.userData.bone0 || []) {
    const o = byId.get(b.id);
    if (o) o.scale.set(b.x, b.y, b.z);
  }
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach) return;
    const src = m.userData.src;
    if (!src) return;
    if (src.hex) m.color.set("#" + src.hex);
    m.visible = src.visible;
    m.opacity = src.opacity;
    m.transparent = src.transparent;
    m.depthWrite = src.depthWrite;
    m.wireframe = src.wireframe;
    m.needsUpdate = true;
  });
  for (const mesh of root.userData.attached || []) {
    if (mesh.parent) mesh.parent.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material && mesh.material.dispose) mesh.material.dispose();
  }
  root.userData.attached = [];
  if (wrapper) wrapper.scale.set(1, 1, 1);
}
function optionOf(catalog, slot, id) {
  const spec = catalog.slots[slot];
  if (!spec) return null;
  return spec.options.find((o) => o.id === id) || spec.options[0];
}
function hosts(root, boneName) {
  if (!boneName) return [root];
  if (boneName === "foot") {
    const feet = findBones(root, "foot");
    if (!feet.length) {
      const one = findBone(root, "foot");
      return one ? [one] : [root];
    }
    return feet;
  }
  const bone = findBone(root, boneName);
  return bone ? [bone] : [root];
}
function hideNames(root, names) {
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach) return;
    const n = (m.name || "").toLowerCase();
    if (names.some((h) => n.includes(h))) m.visible = false;
  });
}
function tintNames(root, names, color) {
  let count = 0;
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach) return;
    const n = (m.name || "").toLowerCase();
    if (!names.some((h) => n.includes(h))) return;
    m.color.set(color);
    m.visible = true;
    count += 1;
  });
  return count;
}
function tintSlot(root, slotName, color) {
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach && mesh.userData.colorSlot === slotName) m.color.set(color);
  });
}
function partGeometry(part) {
  if (part.prim === "box") return new BoxGeometry(part.w || 0.1, part.h || 0.1, part.d || 0.1);
  if (part.prim === "cone") return new ConeGeometry(part.r || 0.03, part.h || 0.1, 8);
  if (part.prim === "cylinder") return new CylinderGeometry(part.r || 0.03, part.r || 0.03, part.h || 0.1, 10);
  if (part.prim === "torus") return new TorusGeometry(part.r || 0.06, part.tube || 8e-3, 8, 14);
  return new SphereGeometry(part.r || 0.05, 12, 8);
}
function resolveColor(opt, eq, catalog) {
  if (opt.color) return opt.color;
  const slot = opt.colorSlot;
  if (slot) {
    const choice = optionOf(catalog, slot, eq[slot]);
    if (choice && choice.color) return choice.color;
    if (slot === "hair" || slot === "hairColor") return "#c9853a";
  }
  return "#ffffff";
}
function attachParts(root, boneName, parts, color, colorSlot, height) {
  const k = Math.max(0.2, (height || 1.5) / 1.5);
  const mat = new MeshLambertMaterial({ color: color || "#ffffff", name: "attach" });
  mat.userData.attach = true;
  const list = root.userData.attached || (root.userData.attached = []);
  for (const parent of hosts(root, boneName)) {
    for (const part of parts || []) {
      const mesh = new Mesh(partGeometry(part), mat);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      mesh.userData.attach = true;
      mesh.userData.colorSlot = colorSlot || "";
      mesh.position.set((part.x || 0) * k, (part.y || 0) * k, (part.z || 0) * k);
      mesh.scale.setScalar(k);
      mesh.rotation.set(part.rx || 0, part.ry || 0, part.rz || 0);
      parent.add(mesh);
      list.push(mesh);
    }
  }
}
function applyEq(root, wrapper, catalog, eq, height) {
  resetLook(root, wrapper);
  for (const slot of SLOT_ORDER) {
    const spec = catalog.slots[slot];
    if (!spec) continue;
    const opt = optionOf(catalog, slot, eq[slot]);
    if (!opt || opt.kind === "pack") continue;
    if (opt.kind === "hide") {
      hideNames(root, opt.hide || []);
    } else if (opt.kind === "color") {
      const names = catalog.match[spec.tint] || [];
      const hits = tintNames(root, names, opt.color);
      tintSlot(root, spec.tint || slot, opt.color);
      if (!hits && spec.fallbackParts) {
        attachParts(root, spec.fallbackBone, spec.fallbackParts, opt.color, spec.tint || slot, height);
      }
    } else if (opt.kind === "attach") {
      if (opt.hide) hideNames(root, opt.hide);
      attachParts(root, opt.bone, opt.parts, resolveColor(opt, eq, catalog), opt.colorSlot || "", height);
    } else if (opt.kind === "scaleBone") {
      const bone = findBone(root, opt.bone || "head");
      if (bone && opt.scale) bone.scale.set(opt.scale[0], opt.scale[1], opt.scale[2]);
    } else if (opt.kind === "size") {
      const s = opt.scale || 1;
      if (wrapper) wrapper.scale.setScalar(s);
    }
  }
}
function lookSnapshot(root, wrapper) {
  const mats = [];
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach) return;
    mats.push([m.name || "", m.color ? m.color.getHexString() : "", m.visible !== false]);
  });
  const bones = [];
  root.traverse((o) => {
    if (!o.isBone) return;
    bones.push([o.name, +o.scale.x.toFixed(4), +o.scale.y.toFixed(4), +o.scale.z.toFixed(4)]);
  });
  return JSON.stringify({
    mats,
    bones,
    attach: (root.userData.attached || []).length,
    scale: wrapper ? +wrapper.scale.x.toFixed(4) : 1
  });
}
function setWire(root, on) {
  eachMaterial(root, (m) => {
    m.wireframe = !!on;
  });
}
function scanFinite(root) {
  const bad = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    const e = o.matrixWorld.elements;
    for (let i = 0; i < 16; i++) {
      if (!Number.isFinite(e[i])) {
        bad.push((o.name || o.type) + " matrix");
        break;
      }
    }
    if (o.isSkinnedMesh && o.skeleton) {
      o.skeleton.update();
      const b = o.skeleton.boneMatrices;
      for (let i = 0; i < b.length; i++) {
        if (!Number.isFinite(b[i])) {
          bad.push((o.name || "skin") + " boneMatrices");
          break;
        }
      }
    }
  });
  return bad;
}
function scanMaps(root) {
  const missing = [];
  eachMaterial(root, (m) => {
    if (m.map && !m.map.image) missing.push(m.name || "map");
  });
  return missing;
}

// tools/dev/src/stage.js
function createStage(host, opts) {
  const canvas = document.createElement("canvas");
  canvas.className = "zview";
  host.appendChild(canvas);
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: false
  });
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = false;
  renderer.setClearColor(opts.bg || 1181724, 1);
  const scene = new Scene();
  scene.background = new Color(opts.bg || 1181724);
  const camera = new PerspectiveCamera(opts.fov || 38, 1, 0.05, 80);
  const cameraB = new PerspectiveCamera(opts.fov || 38, 1, 0.05, 80);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 4.3;
  controls.touches.ONE = TOUCH.ROTATE;
  controls.touches.TWO = TOUCH.DOLLY_PAN;
  controls.target.set(0, 0.75, 0);
  controls.minDistance = 0.3;
  controls.maxDistance = 40;
  const hemi = new HemisphereLight(16774888, 2756664, 0.9);
  const key = new DirectionalLight(16777215, 1.2);
  key.position.set(4, 8, 5);
  const fill = new DirectionalLight(16765172, 0.35);
  fill.position.set(-3, 3, 2);
  scene.add(hemi, key, fill);
  const grid = new GridHelper(opts.grid || 4, opts.grid ? 10 : 8, 4122367, 3806544);
  const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMats.forEach((m) => {
    m.transparent = true;
    m.opacity = 0.45;
  });
  scene.add(grid);
  const rings = new Group();
  rings.name = "zd-rings";
  (opts.rings || [0.55, 0.85, 1.15]).forEach((r, i) => {
    const ring = new Mesh(
      new RingGeometry(Math.max(0.02, r - 0.015), r, 64),
      new MeshBasicMaterial({ color: i === 0 ? 16732120 : 4122367, side: DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 6e-3 + i * 1e-3;
    rings.add(ring);
  });
  scene.add(rings);
  const ruler = new Group();
  ruler.name = "zd-ruler";
  const poleH = opts.ellie || 1.5;
  const pole = new Mesh(
    new BoxGeometry(0.02, poleH, 0.02),
    new MeshBasicMaterial({ color: 4122367 })
  );
  pole.position.set(-0.7, poleH / 2, 0);
  const cap = new Mesh(
    new BoxGeometry(0.16, 0.012, 0.012),
    new MeshBasicMaterial({ color: 16732120 })
  );
  cap.position.set(-0.7, poleH, 0);
  ruler.add(pole, cap);
  scene.add(ruler);
  const state = { theta: 0.35, phi: 1.15, radius: 3.2, compare: false, overlay: false };
  const targetA = new Vector3(0, 0.75, 0);
  const targetB = new Vector3(0, 0.75, 0);
  let hold = false;
  let alive = true;
  let raf = 0;
  let onTick = null;
  let beforePane = null;
  const samples = [];
  let resumeTimer = 0;
  let wantTurn = false;
  function sizeOf() {
    const w = Math.max(2, host.clientWidth || 2);
    const h = Math.max(2, host.clientHeight || 2);
    return { w, h };
  }
  function resize() {
    const { w, h } = sizeOf();
    renderer.setPixelRatio(1);
    renderer.setSize(w, h, false);
    const split = state.compare && !state.overlay;
    camera.aspect = (split ? w / 2 : w) / h;
    camera.updateProjectionMatrix();
    cameraB.aspect = camera.aspect;
    cameraB.fov = camera.fov;
    cameraB.updateProjectionMatrix();
  }
  function place(cam, target) {
    const offset = new Vector3().setFromSphericalCoords(state.radius, state.phi, state.theta);
    cam.position.copy(target).add(offset);
    cam.lookAt(target);
    cam.fov = camera.fov;
    cam.updateProjectionMatrix();
  }
  function readA() {
    const offset = camera.position.clone().sub(controls.target);
    const sph = new Spherical().setFromVector3(offset);
    if (sph.radius > 0.01) {
      state.radius = sph.radius;
      state.phi = sph.phi;
      state.theta = sph.theta;
    }
    targetA.copy(controls.target);
  }
  function syncB() {
    place(cameraB, targetB);
  }
  controls.addEventListener("change", () => {
    if (hold) return;
    readA();
    syncB();
  });
  canvas.addEventListener("pointerdown", () => {
    controls.autoRotate = false;
    if (resumeTimer) clearTimeout(resumeTimer);
    if (wantTurn) resumeTimer = setTimeout(() => {
      controls.autoRotate = true;
    }, 2500);
  });
  function render() {
    const w = canvas.width;
    const h = canvas.height;
    if (!state.compare || state.overlay) {
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, w, h);
      if (beforePane) beforePane(state.overlay ? "both" : "a");
      renderer.render(scene, camera);
      return;
    }
    const hw = Math.floor(w / 2);
    renderer.setScissorTest(true);
    renderer.setViewport(0, 0, hw, h);
    renderer.setScissor(0, 0, hw, h);
    if (beforePane) beforePane("a");
    renderer.render(scene, camera);
    renderer.setViewport(hw, 0, w - hw, h);
    renderer.setScissor(hw, 0, w - hw, h);
    syncB();
    if (beforePane) beforePane("b");
    renderer.render(scene, cameraB);
    renderer.setScissorTest(false);
    if (beforePane) beforePane("idle");
  }
  let last = performance.now();
  function loop(now) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    if (!hold) controls.update(dt);
    if (onTick) onTick(dt);
    render();
    const ms = performance.now() - now;
    samples.push(ms);
    if (samples.length > 8) samples.shift();
    raf = requestAnimationFrame(loop);
  }
  function applyAngles() {
    place(camera, targetA);
    controls.target.copy(targetA);
    controls.update();
    readA();
    syncB();
  }
  const observer = new ResizeObserver(() => resize());
  observer.observe(host);
  resize();
  applyAngles();
  raf = requestAnimationFrame(loop);
  return {
    scene,
    camera,
    canvas,
    renderer,
    controls,
    grid,
    rings,
    ruler,
    state,
    targetA,
    targetB,
    set onTick(fn) {
      onTick = fn;
    },
    set beforePane(fn) {
      beforePane = fn;
    },
    resize,
    setLights(preset) {
      hemi.color.set(preset.hemi[0]);
      hemi.groundColor.set(preset.hemi[1]);
      hemi.intensity = preset.hemi[2];
      key.color.set(preset.key[0]);
      key.intensity = preset.key[1];
      key.position.set(preset.key[2][0], preset.key[2][1], preset.key[2][2]);
      fill.color.set(preset.fill[0]);
      fill.intensity = preset.fill[1];
      fill.position.set(preset.fill[2][0], preset.fill[2][1], preset.fill[2][2]);
      scene.background = new Color(preset.bg);
      renderer.setClearColor(preset.bg, 1);
    },
    setAngle(theta, phi) {
      state.theta = theta;
      state.phi = phi;
      applyAngles();
    },
    setTarget(which, y, radius) {
      const t = which === "b" ? targetB : targetA;
      t.set(0, y, 0);
      if (radius) state.radius = radius;
      applyAngles();
    },
    setCompare(on) {
      state.compare = !!on;
      resize();
    },
    setOverlay(on) {
      state.overlay = !!on;
      resize();
    },
    setTurn(on) {
      wantTurn = !!on;
      controls.autoRotate = wantTurn;
      if (resumeTimer) clearTimeout(resumeTimer);
    },
    hold(on) {
      hold = !!on;
    },
    render,
    samples() {
      return samples.slice();
    },
    syncState() {
      const b = new Spherical().setFromVector3(cameraB.position.clone().sub(targetB));
      return {
        thetaA: state.theta,
        thetaB: b.theta,
        phiA: state.phi,
        phiB: b.phi,
        radiusA: state.radius,
        radiusB: b.radius
      };
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      observer.disconnect();
      controls.dispose();
      renderer.dispose();
      host.removeChild(canvas);
    }
  };
}

export {
  findBone,
  boneWorld,
  cloneMaterials,
  stamp,
  applyEq,
  lookSnapshot,
  setWire,
  scanFinite,
  scanMaps,
  createStage
};
