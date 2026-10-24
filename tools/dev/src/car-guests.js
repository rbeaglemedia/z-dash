import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const manager = new THREE.LoadingManager();
let colormapUrl = '';
manager.setURLModifier((url) => (colormapUrl && url.indexOf('colormap') !== -1 ? colormapUrl : url));
const loader = new GLTFLoader(manager);
loader.setMeshoptDecoder(MeshoptDecoder);
const cache = new Map();
let colormapJob = null;

function trafficBase(url) {
  const i = String(url || '').lastIndexOf('/');
  return i >= 0 ? url.slice(0, i + 1) : '';
}

function ensureColormap(base) {
  if (colormapUrl || !base) return Promise.resolve();
  if (colormapJob) return colormapJob;
  colormapJob = fetch(base + 'colormap.js').then((res) => res.text()).then((text) => {
    const start = text.indexOf('data:image/png;base64,');
    const end = text.indexOf('"', start);
    if (start >= 0 && end > start) colormapUrl = text.slice(start, end);
  }).catch(() => { colormapJob = null; });
  return colormapJob;
}

function b64(text, id) {
  const token = "['" + id + "']=\"";
  const at = text.indexOf(token);
  if (at < 0) throw new Error('traffic asset ' + id + ' missing');
  const start = at + token.length;
  const end = text.indexOf('"', start);
  if (end < 0) throw new Error('traffic asset ' + id + ' truncated');
  const raw = atob(text.slice(start, end));
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

function asBasic(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const next = mats.map((m) => {
      if (!m) return m;
      const basic = new THREE.MeshBasicMaterial({
        name: m.name || '',
        color: m.color ? m.color.clone() : 0xffffff,
        map: m.map || null,
      });
      basic.fog = false;
      basic.skinning = !!o.isSkinnedMesh;
      return basic;
    });
    o.material = Array.isArray(o.material) ? next : next[0];
  });
}

function sit(root) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
  const sized = new THREE.Box3().setFromObject(root);
  const size = sized.getSize(new THREE.Vector3());
  if (size.x > size.z) root.rotation.y = Math.PI / 2;
  root.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
}

export function modelById(catalog, id) {
  return (catalog.models || []).find((m) => m.id === id) || catalog.models[0];
}

export async function guestGroup(model) {
  if (cache.has(model.id)) return cache.get(model.id);
  let group;
  let size;
  if (model.kind === 'tow') {
    group = buildTow(model);
    size = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
  } else if (model.kind === 'kenney') {
    const res = await fetch(model.url);
    if (!res.ok) throw new Error('missing ' + model.file);
    await Promise.all([MeshoptDecoder.ready, ensureColormap(trafficBase(model.url))]);
    const buf = b64(await res.text(), model.asset);
    const gltf = await new Promise((resolve, reject) => {
      loader.parse(buf, '', resolve, reject);
    });
    group = gltf.scene;
    asBasic(group);
    size = sit(group);
  } else {
    throw new Error('not a guest ' + model.id);
  }
  group.userData.size = { x: size.x, y: size.y, z: size.z };
  cache.set(model.id, group);
  return group;
}

export function buildTow(spec) {
  const g = new THREE.Group();
  const mat = (color) => {
    const m = new THREE.MeshBasicMaterial({ color });
    m.fog = false;
    return m;
  };
  const L = spec.l;
  const w = spec.w;
  const h = spec.h;
  const bed = spec.bed;
  const cabL = spec.cabL;
  const cabH = spec.cabH;
  const bedMesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 0.18, bed), mat('#c9853a'));
  bedMesh.position.set(0, 0.35 + h * 0.35, -L / 2 + bed / 2);
  bedMesh.rotation.x = -Math.atan2(h * 0.75, bed);
  bedMesh.userData.role = 'bed';
  const cab = new THREE.Mesh(new THREE.BoxGeometry(w, cabH, cabL), mat('#ffb020'));
  cab.position.set(0, cabH / 2, L / 2 - cabL / 2);
  cab.userData.role = 'cab';
  const glass = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, cabH * 0.28, 0.06), mat('#9ff3ff'));
  glass.position.set(0, cabH * 0.62, L / 2 - 0.04);
  const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.28, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const zs = [-L / 2 + 1.6, -L / 2 + bed - 1.2, L / 2 - cabL * 0.45];
  for (const z of zs) {
    for (const x of [-w / 2, w / 2]) {
      const wheel = new THREE.Mesh(wheelGeo, mat('#14161c'));
      wheel.position.set(x, 0.55, z);
      wheel.userData.role = 'wheel';
      g.add(wheel);
    }
  }
  g.add(bedMesh, cab, glass);
  return g;
}

export function scanGroup(root) {
  const bad = [];
  if (!root) return bad;
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    const e = o.matrixWorld && o.matrixWorld.elements;
    if (e) {
      for (let i = 0; i < 16; i++) {
        if (!Number.isFinite(e[i])) { bad.push((o.name || o.type) + ' nan'); break; }
      }
    }
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (m && m.map && !m.map.image) bad.push((m.name || 'map') + ' texture');
    }
    if (o.skeleton && o.skeleton.boneMatrices) {
      const bones = o.skeleton.boneMatrices;
      for (let i = 0; i < bones.length; i++) {
        if (!Number.isFinite(bones[i])) { bad.push('nan bone'); break; }
      }
    }
  });
  return bad;
}
