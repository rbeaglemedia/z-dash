import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { shotLabel } from './shot.js';

export { shotLabel };

export function createStage(host, opts) {
  const canvas = document.createElement('canvas');
  canvas.className = 'zview';
  host.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: false,
  });
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;
  renderer.setClearColor(opts.bg || 0x12081c, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.bg || 0x12081c);
  const camera = new THREE.PerspectiveCamera(opts.fov || 38, 1, 0.05, 80);
  const cameraB = new THREE.PerspectiveCamera(opts.fov || 38, 1, 0.05, 80);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 4.3;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  controls.target.set(0, 0.75, 0);
  controls.minDistance = 0.3;
  controls.maxDistance = 40;

  const hemi = new THREE.HemisphereLight(0xfff6e8, 0x2a1038, 0.9);
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(4, 8, 5);
  const fill = new THREE.DirectionalLight(0xffd0f4, 0.35);
  fill.position.set(-3, 3, 2);
  scene.add(hemi, key, fill);

  const grid = new THREE.GridHelper(opts.grid || 4, opts.grid ? 10 : 8, 0x3ee6ff, 0x3a1550);
  const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMats.forEach((m) => { m.transparent = true; m.opacity = 0.45; });
  scene.add(grid);

  const rings = new THREE.Group();
  rings.name = 'zd-rings';
  (opts.rings || [0.55, 0.85, 1.15]).forEach((r, i) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(Math.max(0.02, r - 0.015), r, 64),
      new THREE.MeshBasicMaterial({ color: i === 0 ? 0xff4fd8 : 0x3ee6ff, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.006 + i * 0.001;
    rings.add(ring);
  });
  scene.add(rings);

  const ruler = new THREE.Group();
  ruler.name = 'zd-ruler';
  const poleH = opts.ellie || 1.5;
  const pole = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, poleH, 0.02),
    new THREE.MeshBasicMaterial({ color: 0x3ee6ff }),
  );
  pole.position.set(-0.7, poleH / 2, 0);
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.012, 0.012),
    new THREE.MeshBasicMaterial({ color: 0xff4fd8 }),
  );
  cap.position.set(-0.7, poleH, 0);
  ruler.add(pole, cap);
  scene.add(ruler);

  const state = { theta: 0.35, phi: 1.15, radius: 3.2, compare: false, overlay: false };
  const targetA = new THREE.Vector3(0, 0.75, 0);
  const targetB = new THREE.Vector3(0, 0.75, 0);
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
    const offset = new THREE.Vector3().setFromSphericalCoords(state.radius, state.phi, state.theta);
    cam.position.copy(target).add(offset);
    cam.lookAt(target);
    cam.fov = camera.fov;
    cam.updateProjectionMatrix();
  }

  function readA() {
    const offset = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(offset);
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

  controls.addEventListener('change', () => {
    if (hold) return;
    readA();
    syncB();
  });

  canvas.addEventListener('pointerdown', () => {
    controls.autoRotate = false;
    if (resumeTimer) clearTimeout(resumeTimer);
    if (wantTurn) resumeTimer = setTimeout(() => { controls.autoRotate = true; }, 2500);
  });

  function render() {
    const w = canvas.width;
    const h = canvas.height;
    if (!state.compare || state.overlay) {
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, w, h);
      if (beforePane) beforePane(state.overlay ? 'both' : 'a');
      renderer.render(scene, camera);
      return;
    }
    const hw = Math.floor(w / 2);
    renderer.setScissorTest(true);
    renderer.setViewport(0, 0, hw, h);
    renderer.setScissor(0, 0, hw, h);
    if (beforePane) beforePane('a');
    renderer.render(scene, camera);
    renderer.setViewport(hw, 0, w - hw, h);
    renderer.setScissor(hw, 0, w - hw, h);
    syncB();
    if (beforePane) beforePane('b');
    renderer.render(scene, cameraB);
    renderer.setScissorTest(false);
    if (beforePane) beforePane('idle');
  }

  let last = performance.now();
  function loop(now) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000);
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
    set onTick(fn) { onTick = fn; },
    set beforePane(fn) { beforePane = fn; },
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
      scene.background = new THREE.Color(preset.bg);
      renderer.setClearColor(preset.bg, 1);
    },
    setAngle(theta, phi) {
      state.theta = theta;
      state.phi = phi;
      applyAngles();
    },
    setTarget(which, y, radius) {
      const t = which === 'b' ? targetB : targetA;
      t.set(0, y, 0);
      if (radius) state.radius = radius;
      applyAngles();
    },
    setCompare(on) { state.compare = !!on; resize(); },
    setOverlay(on) { state.overlay = !!on; resize(); },
    setTurn(on) {
      wantTurn = !!on;
      controls.autoRotate = wantTurn;
      if (resumeTimer) clearTimeout(resumeTimer);
    },
    hold(on) { hold = !!on; },
    render,
    samples() { return samples.slice(); },
    syncState() {
      const b = new THREE.Spherical().setFromVector3(cameraB.position.clone().sub(targetB));
      return {
        thetaA: state.theta,
        thetaB: b.theta,
        phiA: state.phi,
        phiB: b.phi,
        radiusA: state.radius,
        radiusB: b.radius,
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
    },
  };
}

