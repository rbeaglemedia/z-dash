/**
 * Standalone test for the Next-world live traffic car.
 * Builds a lighter mesh from the same assets/370z.glb bytes the showroom
 * loads (window.ZD_ASSET_GLB). Merges by material, simplifies only the body
 * at about 1 cm, and leaves the wheels as separate spinning meshes.
 * This page is not world.html and it does not change the live game.
 */
import { MeshoptSimplifier } from '../tools/vendor/meshopt_simplifier.js';

const Q = new URLSearchParams(location.search);
const SHOT = Q.get('shot') || 'rear';
const MODE = Q.get('mode') || 'shot';
const ERR = Number(Q.get('err') || '0.01');
const LOCK = Q.get('lock') === '1';
const TIER = Q.get('tier') || 'pc';
const CAP_MS = 2.5;

const SHOTS = {
  rear:  { id: 'rear',  title: 'REAR',          az: Math.PI,       el: 0.20, steer: 0 },
  front: { id: 'front', title: 'FRONT',         az: 0,             el: 0.22, steer: 0.45 },
  side:  { id: 'side',  title: 'SIDE',          az: Math.PI / 2,   el: 0.18, steer: 0 },
  three: { id: 'three', title: 'THREE-QUARTER', az: Math.PI - 0.7, el: 0.30, steer: 0.45 },
  pair:  { id: 'pair',  title: 'TWO CARS',      az: Math.PI - 0.7, el: 0.28, steer: 0.45 }
};

const BAKE_DIST = 7 / (2 * Math.tan(13 * Math.PI / 180));
const FOV = 26;
const LOOK_Y = 0.6;

const foot = document.getElementById('foot');
const head = document.getElementById('head');
const reportEl = document.getElementById('report');

function say(t) { foot.textContent = t; }

function waitReady() {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      const X = window.ZD && ZD.Xray;
      if (X && X.ready) return resolve(X);
      if (performance.now() - t0 > 40000) return reject(new Error('showroom car did not load'));
      setTimeout(tick, 50);
    };
    tick();
  });
}

function kindOf(mesh) {
  const f = (mesh.userData && mesh.userData.mat) || '';
  const v = (mesh.name + ' ' + f).toLowerCase();
  if (!f) return null;
  if (f === 'TYRE' || /tire|tyre/.test(v)) return 'tyre';
  if (f === 'material' || /rim|wheel/.test(v)) return 'rim';
  if (f === 'BRAKE' || /caliper/.test(v)) return 'brake';
  if (f === 'SILVER' || /rotor|disc/.test(v)) return 'rotor';
  if (f === 'LIGHT' || f === 'LIGHTGLASS') return 'light';
  if (f === 'REARLIGHT') return 'tail';
  return 'body';
}

function bake(mesh) {
  const geo = mesh.geometry;
  const attr = geo && geo.attributes && geo.attributes.position;
  if (!attr) return null;
  const nAttr = geo.attributes.normal || null;
  const index = geo.index;
  const n = attr.count;
  const pos = new Float32Array(n * 3);
  const nrm = nAttr ? new Float32Array(n * 3) : null;
  const e = mesh.matrixWorld.elements;
  for (let i = 0; i < n; i++) {
    const x = attr.getX(i), y = attr.getY(i), z = attr.getZ(i);
    pos[i * 3] = e[0] * x + e[4] * y + e[8] * z + e[12];
    pos[i * 3 + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
    pos[i * 3 + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
    if (nrm) {
      const nx = nAttr.getX(i), ny = nAttr.getY(i), nz = nAttr.getZ(i);
      const ox = e[0] * nx + e[4] * ny + e[8] * nz;
      const oy = e[1] * nx + e[5] * ny + e[9] * nz;
      const oz = e[2] * nx + e[6] * ny + e[10] * nz;
      const l = Math.hypot(ox, oy, oz) || 1;
      nrm[i * 3] = ox / l; nrm[i * 3 + 1] = oy / l; nrm[i * 3 + 2] = oz / l;
    }
  }
  let idx;
  if (index) {
    idx = new Uint32Array(index.count);
    for (let i = 0; i < index.count; i++) idx[i] = index.getX(i);
  } else {
    idx = new Uint32Array(n);
    for (let i = 0; i < n; i++) idx[i] = i;
  }
  return { pos, nrm, idx, mat: mesh.userData.mat, name: mesh.name || '' };
}

function bbox(pos) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      const v = pos[i + a];
      if (v < min[a]) min[a] = v;
      if (v > max[a]) max[a] = v;
    }
  }
  return {
    min, max,
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
    center: [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]
  };
}

function alignAxle(axis, x, y, z) {
  if (axis === 0) return [-z, y, x];
  if (axis === 1) return [x, z, -y];
  return [x, y, z];
}

function toWheelLocal(part, center, axis) {
  const pos = new Float32Array(part.pos.length);
  const nrm = part.nrm ? new Float32Array(part.nrm.length) : null;
  for (let i = 0; i < part.pos.length; i += 3) {
    const p = alignAxle(axis, part.pos[i] - center[0], part.pos[i + 1] - center[1], part.pos[i + 2] - center[2]);
    pos[i] = p[0]; pos[i + 1] = p[1]; pos[i + 2] = p[2];
    if (nrm) {
      const n = alignAxle(axis, part.nrm[i], part.nrm[i + 1], part.nrm[i + 2]);
      const l = Math.hypot(n[0], n[1], n[2]) || 1;
      nrm[i] = n[0] / l; nrm[i + 1] = n[1] / l; nrm[i + 2] = n[2] / l;
    }
  }
  return { pos, nrm, idx: part.idx };
}

function splitByCenters(part, centers) {
  const buckets = centers.map(() => ({ pos: [], idx: [], nrm: [], map: new Map() }));
  const { pos, idx, nrm } = part;
  for (let t = 0; t < idx.length; t += 3) {
    const ids = [idx[t], idx[t + 1], idx[t + 2]];
    const cx = (pos[ids[0] * 3] + pos[ids[1] * 3] + pos[ids[2] * 3]) / 3;
    const cy = (pos[ids[0] * 3 + 1] + pos[ids[1] * 3 + 1] + pos[ids[2] * 3 + 1]) / 3;
    const cz = (pos[ids[0] * 3 + 2] + pos[ids[1] * 3 + 2] + pos[ids[2] * 3 + 2]) / 3;
    let best = 0, bd = 1e18;
    for (let w = 0; w < centers.length; w++) {
      const d = (cx - centers[w][0]) ** 2 + (cy - centers[w][1]) ** 2 + (cz - centers[w][2]) ** 2;
      if (d < bd) { bd = d; best = w; }
    }
    const b = buckets[best];
    for (const id of ids) {
      let m = b.map.get(id);
      if (m == null) {
        m = b.pos.length / 3;
        b.map.set(id, m);
        b.pos.push(pos[id * 3], pos[id * 3 + 1], pos[id * 3 + 2]);
        if (nrm) b.nrm.push(nrm[id * 3], nrm[id * 3 + 1], nrm[id * 3 + 2]);
      }
      b.idx.push(m);
    }
  }
  return buckets.map((b) => b.idx.length ? ({
    pos: Float32Array.from(b.pos),
    idx: Uint32Array.from(b.idx),
    nrm: nrm ? Float32Array.from(b.nrm) : null
  }) : null);
}

function mergeParts(parts) {
  const pos = [], idx = [];
  let base = 0;
  for (const p of parts) {
    for (let i = 0; i < p.idx.length; i++) idx.push(p.idx[i] + base);
    for (let i = 0; i < p.pos.length; i++) pos.push(p.pos[i]);
    base += p.pos.length / 3;
  }
  return { pos: Float32Array.from(pos), idx: Uint32Array.from(idx) };
}

function compact(idxIn, posIn) {
  const map = new Map();
  const pos = [];
  const idx = new Uint32Array(idxIn.length);
  for (let i = 0; i < idxIn.length; i++) {
    const v = idxIn[i];
    let m = map.get(v);
    if (m == null) {
      m = pos.length / 3;
      map.set(v, m);
      pos.push(posIn[v * 3], posIn[v * 3 + 1], posIn[v * 3 + 2]);
    }
    idx[i] = m;
  }
  return { pos: Float32Array.from(pos), idx };
}

function triCount(idx) { return idx.length / 3; }

async function simplifyBody(parts) {
  const by = {};
  for (const p of parts) (by[p.mat] || (by[p.mat] = [])).push(p);
  const flags = ['ErrorAbsolute'];
  if (LOCK) flags.push('LockBorder');
  await MeshoptSimplifier.ready;
  const out = [];
  const stats = {};
  for (const mat of Object.keys(by)) {
    const merged = mergeParts(by[mat]);
    const before = triCount(merged.idx);
    let idx = merged.idx, pos = merged.pos, err = 0;
    try {
      const res = MeshoptSimplifier.simplify(merged.idx, merged.pos, 3, 3, ERR, flags);
      idx = res[0]; err = res[1];
      const c = compact(idx, merged.pos);
      idx = c.idx; pos = c.pos;
    } catch (e) {
      err = -1;
      const c = compact(merged.idx, merged.pos);
      idx = c.idx; pos = c.pos;
    }
    stats[mat] = { before, after: triCount(idx), error: err };
    out.push({ mat, pos, idx });
  }
  return { parts: out, stats };
}

function makeGeo(X, pos, idx, nrm) {
  const sample = X.shellMeshes[0];
  const geo = new sample.geometry.constructor();
  const Attr = sample.geometry.attributes.position.constructor;
  geo.setAttribute('position', new Attr(pos, 3));
  if (nrm) geo.setAttribute('normal', new Attr(nrm, 3));
  // This Three build only wraps a plain Array into an index attribute.
  geo.setIndex(Array.from(idx));
  if (!nrm) geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

function cloneSolid(X, hex) {
  const src = X.solid;
  const mat = src.clone();
  mat.uniforms.tint.value = src.uniforms.tint.value.clone();
  mat.uniforms.rim.value = src.uniforms.rim.value.clone();
  mat.uniforms.zLivC.value = src.uniforms.zLivC.value.clone();
  mat.uniforms.arches.value = 1;
  mat.uniforms.solid.value = 1;
  if (hex) mat.uniforms.tint.value.set(hex);
  return mat;
}

function buildCars(X, bodyParts, lightParts, wheels) {
  const Group = X.car.constructor;
  const Mesh = X.shellMeshes[0].constructor;
  const scoreMat = cloneSolid(X, null);
  const altMat = cloneSolid(X, '#1aa6c8');
  const bodyGeos = bodyParts.map((p) => ({ mat: p.mat, geo: makeGeo(X, p.pos, p.idx, null) }));
  const lightGeos = lightParts.map((p) => ({
    kind: p.kind,
    geo: makeGeo(X, p.pos, p.idx, p.nrm),
    mat: p.kind === 'tail' ? X.tailLens : X.lensMat
  }));
  const wheelGeos = wheels.map((w) => ({
    front: w.front,
    center: w.center,
    axis: w.axis,
    parts: w.parts.map((p) => ({
      role: p.role,
      geo: makeGeo(X, p.local.pos, p.local.idx, p.local.nrm),
      mat: p.role === 'tyre' ? X.tireMat : (p.role === 'brake' ? X.calMat : X.rimMat),
      spin: p.role !== 'brake'
    }))
  }));

  function oneCar(bodyMat, z) {
    const root = new Group();
    root.position.z = z;
    const bodyMats = [];
    for (const b of bodyGeos) {
      const m = new Mesh(b.geo, bodyMat);
      m.renderOrder = 2;
      root.add(m);
      bodyMats.push(bodyMat);
    }
    for (const L of lightGeos) {
      const m = new Mesh(L.geo, L.mat);
      m.renderOrder = 5;
      root.add(m);
    }
    const wheelNodes = [];
    for (const w of wheelGeos) {
      const steer = new Group();
      steer.position.set(w.center[0], w.center[1], w.center[2]);
      const spin = new Group();
      steer.add(spin);
      for (const p of w.parts) {
        const m = new Mesh(p.geo, p.mat);
        (p.spin ? spin : steer).add(m);
      }
      root.add(steer);
      wheelNodes.push({ steer, spin, front: w.front });
    }
    return { root, bodyMat, wheelNodes };
  }

  const cars = [oneCar(scoreMat, 0), oneCar(altMat, 0)];
  return { cars, scoreMat, altMat };
}

function poseCar(car, spin, steer) {
  for (const w of car.wheelNodes) {
    w.spin.rotation.z = spin;
    w.steer.rotation.y = w.front ? steer : 0;
  }
}

function hideShowroomExtras(X) {
  X.grid && (X.grid.visible = false);
  X.shadow && (X.shadow.visible = false);
  X.wire && (X.wire.visible = false);
  X.crease && (X.crease.visible = false);
  X.partsGrp && (X.partsGrp.visible = false);
  (X.brakeSprites || []).forEach((s) => { s.visible = false; });
  (X.wheels || []).forEach((w) => { w.visible = false; });
  (X.detailEdges || []).forEach((e) => { e.visible = false; });
  (X.brakes || []).forEach((b) => { if (b.rot) b.rot.visible = false; if (b.cal) b.cal.visible = false; });
  X.shellMeshes.forEach((m) => {
    m.material = X.solid;
    m.children.forEach((c) => { c.visible = false; });
  });
}

function setCamera(X, spec, look, dist) {
  const yaw = spec.az, pitch = spec.el;
  const d = dist || BAKE_DIST;
  const cam = X.cam;
  cam.fov = FOV;
  cam.aspect = (X.canvas.width / X.canvas.height) || 1;
  cam.near = 0.05;
  cam.far = 80;
  cam.position.set(
    look[0] + Math.cos(yaw) * Math.cos(pitch) * d,
    look[1] + Math.sin(pitch) * d,
    look[2] + Math.sin(yaw) * Math.cos(pitch) * d
  );
  cam.lookAt(look[0], look[1], look[2]);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
}

function sizeRenderer(X, w, h) {
  X.renderer.setPixelRatio(1);
  X.renderer.setSize(w, h, false);
  X.renderer.setClearColor(0x05020c, 1);
}

function renderTo(X, canvas) {
  X.renderer.render(X.scene, X.cam);
  const w = X.canvas.width, h = X.canvas.height;
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const g = canvas.getContext('2d', { willReadFrequently: true });
  g.drawImage(X.canvas, 0, 0);
  return g;
}

function sample(canvas) {
  const g = canvas.getContext('2d', { willReadFrequently: true });
  const w = canvas.width, h = canvas.height;
  const data = g.getImageData(0, 0, w, h).data;
  const border = [];
  const push = (i) => border.push([data[i], data[i + 1], data[i + 2]]);
  for (let x = 0; x < w; x++) { push(x * 4); push(((h - 1) * w + x) * 4); }
  for (let y = 0; y < h; y++) { push((y * w) * 4); push((y * w + (w - 1)) * 4); }
  border.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
  const mid = border[border.length >> 1] || [0, 0, 0];
  const mask = new Uint8Array(w * h);
  let n = 0, sat = 0, lum = 0, lum2 = 0, edge = 0;
  const lums = new Float32Array(w * h);
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i], gg = data[i + 1], b = data[i + 2];
    const dr = r - mid[0], dg = gg - mid[1], db = b - mid[2];
    const L = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
    lums[p] = L;
    if (dr * dr + dg * dg + db * db > 28 * 28) {
      mask[p] = 1; n++;
      const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
      sat += mx === 0 ? 0 : (mx - mn) / mx;
      lum += L; lum2 += L * L;
      const x = p % w, y = (p / w) | 0;
      if (x < minX) minX = x; if (y < minY) minY = y;
      if (x > maxX) maxX = x; if (y > maxY) maxY = y;
    }
  }
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    if (!mask[p]) continue;
    const gx = lums[p + 1] - lums[p - 1];
    const gy = lums[p + w] - lums[p - w];
    if (gx * gx + gy * gy > 35 * 35) edge++;
  }
  const mean = n ? lum / n : 0;
  return {
    w, h, mask, lums, maskN: n,
    sat: n ? sat / n : 0,
    lum: mean,
    lumStd: Math.sqrt(n ? Math.max(0, lum2 / n - mean * mean) : 0),
    edge: n ? edge / n : 0,
    box: n ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } : null
  };
}

function cropOf(shot, box, destH) {
  const padX = Math.max(8, box.w * 0.08);
  const padY = Math.max(8, box.h * 0.12);
  let x = Math.max(0, Math.floor(box.x - padX));
  let y = Math.max(0, Math.floor(box.y - padY));
  let w = Math.min(shot.width - x, Math.ceil(box.w + padX * 2));
  let h = Math.min(shot.height - y, Math.ceil(box.h + padY * 2));
  const scale = destH / h;
  const out = document.createElement('canvas');
  out.width = Math.max(2, Math.round(w * scale));
  out.height = Math.max(2, Math.round(destH));
  const g = out.getContext('2d', { willReadFrequently: true });
  g.imageSmoothingEnabled = false;
  g.drawImage(shot, x, y, w, h, 0, 0, out.width, out.height);
  return out;
}

function gridMask(info, canvas) {
  const gw = 96, gh = 64;
  const g = new Uint8Array(gw * gh);
  const sw = canvas.width, sh = canvas.height;
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
    const sx = Math.min(sw - 1, Math.floor((x + 0.5) / gw * sw));
    const sy = Math.min(sh - 1, Math.floor((y + 0.5) / gh * sh));
    g[y * gw + x] = info.mask[sy * sw + sx] ? 1 : 0;
  }
  return g;
}

function iouGrids(a, b) {
  let inter = 0, union = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] || b[i]) union++;
    if (a[i] && b[i]) inter++;
  }
  return union ? inter / union : 0;
}

function scorePair(playerCanvas, lodCanvas) {
  const pInfo = sample(playerCanvas);
  const tInfo = sample(lodCanvas);
  if (!pInfo.box || !tInfo.box) return { iou: 0, error: 'car left the frame', player: pInfo, traffic: tInfo };
  const pCrop = cropOf(playerCanvas, pInfo.box, 460);
  const tCrop = cropOf(lodCanvas, tInfo.box, 460);
  const p2 = sample(pCrop);
  const t2 = sample(tCrop);
  const iou = iouGrids(gridMask(p2, pCrop), gridMask(t2, tCrop));
  const satR = t2.sat / Math.max(0.02, p2.sat);
  const lumR = t2.lumStd / Math.max(1, p2.lumStd);
  const edgeR = t2.edge / Math.max(0.01, p2.edge);
  return {
    iou: +iou.toFixed(3),
    satRatio: +satR.toFixed(2),
    lumRatio: +lumR.toFixed(2),
    edgeRatio: +edgeR.toFixed(2),
    player: { maskN: p2.maskN, sat: +p2.sat.toFixed(3), lumStd: +p2.lumStd.toFixed(1), edge: +p2.edge.toFixed(3) },
    traffic: { maskN: t2.maskN, sat: +t2.sat.toFixed(3), lumStd: +t2.lumStd.toFixed(1), edge: +t2.edge.toFixed(3) }
  };
}

async function sha12() {
  const raw = atob(window.ZD_ASSET_GLB);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return { sha12: hex.slice(0, 12), bytes: bytes.length, file: (window.ZD_EMBED && ZD_EMBED.cfg && ZD_EMBED.cfg.file) || '' };
}

function median(xs) {
  const a = xs.slice().sort((p, q) => p - q);
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function publish(obj) {
  reportEl.textContent = JSON.stringify(obj);
  document.body.dataset.ready = '1';
}

async function main() {
  say('Loading Bob\'s Z from assets/370z.glb…');
  const X = await waitReady();
  if (X.source !== 'glb') throw new Error('showroom fell back to the procedural body');
  hideShowroomExtras(X);
  X.car.updateMatrixWorld(true);
  const baked = [];
  X.car.traverse((o) => {
    if (!o.isMesh) return;
    const k = kindOf(o);
    if (!k) return;
    const b = bake(o);
    if (b && b.idx.length) baked.push(Object.assign(b, { kind: k }));
  });
  const tyres = baked.filter((b) => b.kind === 'tyre');
  if (tyres.length < 4) throw new Error('expected 4 tyres, found ' + tyres.length);
  const wheels = tyres.map((t) => {
    const box = bbox(t.pos);
    const axis = box.size[0] < box.size[1] && box.size[0] < box.size[2] ? 0 : (box.size[1] < box.size[2] ? 1 : 2);
    return { center: box.center, axis, front: box.center[0] > 0, parts: [] };
  });
  const centers = wheels.map((w) => w.center);
  for (const t of tyres) {
    const box = bbox(t.pos);
    let best = 0, bd = 1e18;
    for (let i = 0; i < centers.length; i++) {
      const d = (box.center[0] - centers[i][0]) ** 2 + (box.center[1] - centers[i][1]) ** 2 + (box.center[2] - centers[i][2]) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    wheels[best].parts.push({ role: 'tyre', local: toWheelLocal(t, wheels[best].center, wheels[best].axis) });
  }
  for (const part of baked) {
    if (part.kind === 'tyre' || part.kind === 'body' || part.kind === 'light' || part.kind === 'tail') continue;
    const pieces = splitByCenters(part, centers);
    pieces.forEach((piece, i) => {
      if (!piece) return;
      wheels[i].parts.push({ role: part.kind, local: toWheelLocal(piece, wheels[i].center, wheels[i].axis) });
    });
  }
  const bodyIn = baked.filter((b) => b.kind === 'body');
  const lightsIn = ['light', 'tail'].map((kind) => {
    const parts = baked.filter((b) => b.kind === kind);
    if (!parts.length) return null;
    const m = mergeParts(parts);
    return { kind, pos: m.pos, idx: m.idx, nrm: null };
  }).filter(Boolean);
  say('Simplifying the body at ' + (ERR * 100).toFixed(1) + ' cm…');
  const simplified = await simplifyBody(bodyIn);
  const pack = buildCars(X, simplified.parts, lightsIn, wheels);
  const lodRoot = new X.car.constructor();
  X.scene.add(lodRoot);
  for (const c of pack.cars) lodRoot.add(c.root);

  const id = await sha12();
  const bodyTris = simplified.parts.reduce((s, p) => s + triCount(p.idx), 0);
  const lightTris = lightsIn.reduce((s, p) => s + triCount(p.idx), 0);
  let wheelTris = 0;
  for (const w of wheels) for (const p of w.parts) wheelTris += triCount(p.local.idx);
  const total = bodyTris + lightTris + wheelTris;
  const counts = {
    body: simplified.stats,
    bodyTris, lightTris, wheelTris, total,
    wheels: wheels.map((w) => ({
      front: w.front, axis: w.axis,
      center: w.center.map((v) => +v.toFixed(3)),
      parts: w.parts.map((p) => p.role + ':' + triCount(p.local.idx)).join(',')
    }))
  };

  const viewW = MODE === 'probe' ? Number(Q.get('w') || window.innerWidth) : 640;
  const viewH = MODE === 'probe' ? Number(Q.get('h') || window.innerHeight) : 720;

  function show(which) {
    X.car.visible = which === 'bob' || which === 'both';
    pack.cars[0].root.visible = which === 'lod' || which === 'both' || which === 'two';
    pack.cars[1].root.visible = which === 'two';
    pack.cars[0].root.position.z = which === 'two' ? -2.5 : 0;
    pack.cars[1].root.position.z = 2.5;
    const arches = which === 'two' ? 0 : 1;
    pack.scoreMat.uniforms.arches.value = arches;
    pack.altMat.uniforms.arches.value = arches;
  }

  if (MODE === 'probe') {
    sizeRenderer(X, viewW, viewH);
    show('two');
    const spec = SHOTS.three;
    setCamera(X, spec, [0, LOOK_Y, 0], 16);
    let spin = 0.4;
    const warm = () => { spin += 0.3; poseCar(pack.cars[0], spin, 0.45); poseCar(pack.cars[1], spin, 0.45); X.renderer.render(X.scene, X.cam); };
    for (let i = 0; i < 8; i++) warm();
    const pairs = [];
    for (let i = 0; i < 5; i++) {
      show('bob');
      X.car.visible = false;
      pack.cars[0].root.visible = false;
      pack.cars[1].root.visible = false;
      const t0 = performance.now();
      X.renderer.render(X.scene, X.cam);
      const off = performance.now() - t0;
      show('two');
      spin += 0.5;
      poseCar(pack.cars[0], spin, 0.45);
      poseCar(pack.cars[1], spin, 0.45);
      const t1 = performance.now();
      X.renderer.render(X.scene, X.cam);
      const on = performance.now() - t1;
      pairs.push({ off: +off.toFixed(3), on: +on.toFixed(3), delta: +(on - off).toFixed(3) });
    }
    const deltas = pairs.map((p) => p.delta);
    const med = median(deltas);
    const info = X.renderer.info;
    show('two');
    poseCar(pack.cars[0], 0.9, 0.45);
    poseCar(pack.cars[1], 0.9, 0.45);
    info.reset();
    X.renderer.render(X.scene, X.cam);
    const calls = info.render && info.render.calls;
    const tris = info.render && info.render.triangles;
    renderTo(X, document.getElementById('viewL'));
    document.getElementById('viewR').getContext('2d').canvas.width = 2;
    document.body.classList.add('single');
    document.getElementById('tagL').textContent = 'TWO LIVE CARS';
    document.getElementById('tagR').textContent = 'FRAME TIME';
    const gl = X.renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const probe = {
      tier: TIER, w: viewW, h: viewH, pairs, medianMs: +med.toFixed(3),
      maxMs: +Math.max(...deltas).toFixed(3), minMs: +Math.min(...deltas).toFixed(3),
      capMs: CAP_MS, pass: med <= CAP_MS, calls, triangles: tris, gpu: String(gpu)
    };
    head.textContent = 'FRAME TIME · ' + TIER + ' · ' + viewW + '×' + viewH + ' · median ' + probe.medianMs.toFixed(2) + ' ms · cap ' + CAP_MS + ' ms · ' + (probe.pass ? 'UNDER CAP' : 'OVER CAP');
    say(pairs.map((p, i) => 'pair ' + (i + 1) + '  off ' + p.off + '  on ' + p.on + '  delta ' + p.delta).join('\n')
      + '\n' + total + ' tris × 2 cars · draws ' + calls + ' · ' + gpu);
    publish({ ok: true, mode: 'probe', id, counts, probe, errM: ERR, lockBorder: LOCK });
    return;
  }

  const spec = SHOTS[SHOT] || SHOTS.rear;
  sizeRenderer(X, 640, 720);
  const left = document.getElementById('viewL');
  const right = document.getElementById('viewR');
  if (spec.id === 'pair') {
    show('two');
    poseCar(pack.cars[0], 0.85, spec.steer);
    poseCar(pack.cars[1], 0.85, spec.steer);
    setCamera(X, spec, [0, LOOK_Y, 0], 16);
    sizeRenderer(X, 1280, 720);
    renderTo(X, left);
    right.width = 2; right.height = 2;
    document.body.classList.add('single');
    document.getElementById('tagL').textContent = 'TWO LIVE LOD CARS · SHARED MESH';
    document.getElementById('tagR').textContent = 'SHARED MESH';
    head.textContent = 'TWO CARS · front wheels steered 0.45 rad · wheels spun 0.85 rad · ' + total + ' tris each';
    say('Same bytes ' + id.file + ' sha256 ' + id.sha12 + '\nGun car and cyan car share one simplified mesh. Wheels are not simplified.');
    publish({ ok: true, mode: 'pair', id, counts, errM: ERR, lockBorder: LOCK, total });
    return;
  }

  show('bob');
  setCamera(X, spec, [0, LOOK_Y, 0], BAKE_DIST);
  renderTo(X, left);
  const bobSnap = document.createElement('canvas');
  bobSnap.width = left.width; bobSnap.height = left.height;
  bobSnap.getContext('2d').drawImage(left, 0, 0);

  show('lod');
  poseCar(pack.cars[0], spec.steer ? 0.15 : 0.7, spec.steer);
  renderTo(X, right);
  const lodSnap = document.createElement('canvas');
  lodSnap.width = right.width; lodSnap.height = right.height;
  lodSnap.getContext('2d').drawImage(right, 0, 0);

  const metrics = scorePair(bobSnap, lodSnap);
  let straight = null;
  if (spec.steer) {
    poseCar(pack.cars[0], 0.7, 0);
    const tmp = document.createElement('canvas');
    renderTo(X, tmp);
    straight = scorePair(bobSnap, tmp).iou;
    poseCar(pack.cars[0], 0.15, spec.steer);
    renderTo(X, right);
  }
  const pass = metrics.iou >= 0.55;
  head.textContent = spec.title + '  ·  overlap ' + metrics.iou.toFixed(2) + '  ·  ' + (pass ? 'PASS' : 'FAIL') + '  ·  bar 0.55';
  document.getElementById('tagL').textContent = "BOB'S Z";
  document.getElementById('tagR').textContent = 'LIVE LOD';
  const lines = [
    id.file + '  sha256 ' + id.sha12 + (id.sha12 === 'fdba257f6422' ? '  (same GLB)' : '  (WRONG GLB)'),
    'body simplified at ' + (ERR * 100).toFixed(1) + ' cm' + (LOCK ? ' with locked borders' : '') + '  ·  ' + total + ' tris on one car',
    'wheels ' + wheelTris + ' tris, not simplified  ·  lights ' + lightTris + '  ·  body ' + bodyTris,
    'camera fov ' + FOV + '  pitch ' + spec.el.toFixed(2) + '  yaw ' + spec.az.toFixed(2) + '  dist ' + BAKE_DIST.toFixed(2) + ' m',
    spec.steer ? ('front axle steered ' + spec.steer + ' rad  ·  straight-wheel overlap ' + straight) : 'wheels straight, spun so the rim is a disc',
    'sat ' + metrics.satRatio + '  lum ' + metrics.lumRatio + '  edge ' + metrics.edgeRatio
  ];
  say(lines.join('\n'));
  publish({
    ok: true, mode: 'shot', shot: spec.id, pass, iou: metrics.iou, straight,
    metrics, id, counts, errM: ERR, lockBorder: LOCK, total,
    steer: spec.steer, title: spec.title
  });
}

main().catch((e) => {
  say(String(e && e.stack || e));
  publish({ ok: false, error: String(e && e.message || e) });
});
