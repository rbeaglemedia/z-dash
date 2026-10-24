import * as THREE from 'three';

// Copied from adventure/src/main.js so the spinner uses the same fit and
// Lambert colors as the game. Do not edit adventure/src/main.js from here.
const _v = new THREE.Vector3();

export function skinnedBox(root) {
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

export function fitHeight(root, meters) {
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

export function fitPack(root, ellieRawHeight) {
  const s = 1.5 / Math.max(0.001, ellieRawHeight);
  root.scale.set(1, 1, 1);
  root.scale.multiplyScalar(s);
  root.updateMatrixWorld(true);
  let box = skinnedBox(root);
  if (!(box.getSize(new THREE.Vector3()).y > 0.05)) box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
  return skinnedBox(root);
}

export function rawHeight(root) {
  root.updateMatrixWorld(true);
  let box = skinnedBox(root);
  let sizeY = box.getSize(new THREE.Vector3()).y;
  if (!(sizeY > 0.05)) {
    box = new THREE.Box3().setFromObject(root);
    sizeY = box.getSize(new THREE.Vector3()).y;
  }
  return sizeY;
}

export function prepareModel(root) {
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
    }
    const flat = mats.map((m) => asLambert(m, o.isSkinnedMesh));
    o.material = Array.isArray(o.material) ? flat : flat[0];
    coalesceGroups(o.geometry);
  });
}

export function coalesceGroups(geometry) {
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

export function asLambert(m, skinned) {
  if (!m) return m;
  const next = new THREE.MeshLambertMaterial({
    name: m.name,
    color: m.color ? m.color.clone() : 0xffffff,
    map: m.map || null,
  });
  next.skinning = !!skinned;
  next.transparent = false;
  next.opacity = 1;
  next.alphaTest = 0;
  next.depthWrite = true;
  if (next.map) next.map.colorSpace = THREE.SRGBColorSpace;
  if (m !== next) m.dispose();
  return next;
}

export function clipNamed(clips, fragment) {
  const f = fragment.toLowerCase();
  const exact = clips.find((c) => c.name.toLowerCase().endsWith('|' + f) || c.name.toLowerCase() === f);
  if (exact) return exact;
  return clips.find((c) => {
    const n = c.name.toLowerCase();
    return n.includes(f) && !n.includes('carry');
  }) || null;
}
