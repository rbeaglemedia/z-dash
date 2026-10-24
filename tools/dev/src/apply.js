import * as THREE from 'three';
import { findBone, findBones } from './bones.js';
import { eachMaterial } from './dom.js';

const SLOT_ORDER = ['head', 'eyes', 'skin', 'hair', 'hairColor', 'top', 'bottom', 'shoes', 'extra', 'size', 'fur', 'collar'];

export function cloneMaterials(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const next = mats.map((m) => (m ? m.clone() : m));
    o.material = Array.isArray(o.material) ? next : next[0];
  });
}

export function stamp(root) {
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
      wireframe: !!m.wireframe,
    };
  });
  root.userData.bone0 = bones;
  root.userData.attached = [];
}

export function resetLook(root, wrapper) {
  const byId = new Map();
  root.traverse((o) => { if (o.isBone) byId.set(o.uuid, o); });
  for (const b of root.userData.bone0 || []) {
    const o = byId.get(b.id);
    if (o) o.scale.set(b.x, b.y, b.z);
  }
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach) return;
    const src = m.userData.src;
    if (!src) return;
    if (src.hex) m.color.set('#' + src.hex);
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
  if (boneName === 'foot') {
    const feet = findBones(root, 'foot');
    if (!feet.length) {
      const one = findBone(root, 'foot');
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
    const n = (m.name || '').toLowerCase();
    if (names.some((h) => n.includes(h))) m.visible = false;
  });
}

function tintNames(root, names, color) {
  let count = 0;
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach) return;
    const n = (m.name || '').toLowerCase();
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
  if (part.prim === 'box') return new THREE.BoxGeometry(part.w || 0.1, part.h || 0.1, part.d || 0.1);
  if (part.prim === 'cone') return new THREE.ConeGeometry(part.r || 0.03, part.h || 0.1, 8);
  if (part.prim === 'cylinder') return new THREE.CylinderGeometry(part.r || 0.03, part.r || 0.03, part.h || 0.1, 10);
  if (part.prim === 'torus') return new THREE.TorusGeometry(part.r || 0.06, part.tube || 0.008, 8, 14);
  return new THREE.SphereGeometry(part.r || 0.05, 12, 8);
}

function resolveColor(opt, eq, catalog) {
  if (opt.color) return opt.color;
  const slot = opt.colorSlot;
  if (slot) {
    const choice = optionOf(catalog, slot, eq[slot]);
    if (choice && choice.color) return choice.color;
    if (slot === 'hair' || slot === 'hairColor') return '#c9853a';
  }
  return '#ffffff';
}

function attachParts(root, boneName, parts, color, colorSlot, height) {
  const k = Math.max(0.2, (height || 1.5) / 1.5);
  const mat = new THREE.MeshBasicMaterial({ color: color || '#ffffff', name: 'attach' });
  mat.fog = false;
  mat.userData.attach = true;
  const list = root.userData.attached || (root.userData.attached = []);
  for (const parent of hosts(root, boneName)) {
    for (const part of parts || []) {
      const mesh = new THREE.Mesh(partGeometry(part), mat);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      mesh.userData.attach = true;
      mesh.userData.colorSlot = colorSlot || '';
      mesh.position.set((part.x || 0) * k, (part.y || 0) * k, (part.z || 0) * k);
      mesh.scale.setScalar(k);
      mesh.rotation.set(part.rx || 0, part.ry || 0, part.rz || 0);
      parent.add(mesh);
      list.push(mesh);
    }
  }
}

export function applyEq(root, wrapper, catalog, eq, height) {
  resetLook(root, wrapper);
  for (const slot of SLOT_ORDER) {
    const spec = catalog.slots[slot];
    if (!spec) continue;
    const opt = optionOf(catalog, slot, eq[slot]);
    if (!opt || opt.kind === 'pack') continue;
    if (opt.kind === 'hide') {
      hideNames(root, opt.hide || []);
    } else if (opt.kind === 'color') {
      const names = catalog.match[spec.tint] || [];
      const hits = tintNames(root, names, opt.color);
      tintSlot(root, spec.tint || slot, opt.color);
      if (!hits && spec.fallbackParts) {
        attachParts(root, spec.fallbackBone, spec.fallbackParts, opt.color, spec.tint || slot, height);
      }
    } else if (opt.kind === 'attach') {
      if (opt.hide) hideNames(root, opt.hide);
      attachParts(root, opt.bone, opt.parts, resolveColor(opt, eq, catalog), opt.colorSlot || '', height);
    } else if (opt.kind === 'scaleBone') {
      const bone = findBone(root, opt.bone || 'head');
      if (bone && opt.scale) bone.scale.set(opt.scale[0], opt.scale[1], opt.scale[2]);
    } else if (opt.kind === 'size') {
      const s = opt.scale || 1;
      if (wrapper) wrapper.scale.setScalar(s);
    }
  }
}

export function lookSnapshot(root, wrapper) {
  const mats = [];
  eachMaterial(root, (m, mesh) => {
    if (mesh.userData.attach) return;
    mats.push([m.name || '', m.color ? m.color.getHexString() : '', m.visible !== false]);
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
    scale: wrapper ? +wrapper.scale.x.toFixed(4) : 1,
  });
}

export function setWire(root, on) {
  eachMaterial(root, (m) => { m.wireframe = !!on; });
}

export function scanFinite(root) {
  const bad = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    const e = o.matrixWorld.elements;
    for (let i = 0; i < 16; i++) {
      if (!Number.isFinite(e[i])) {
        bad.push((o.name || o.type) + ' matrix');
        break;
      }
    }
    if (o.isSkinnedMesh && o.skeleton) {
      o.skeleton.update();
      const b = o.skeleton.boneMatrices;
      for (let i = 0; i < b.length; i++) {
        if (!Number.isFinite(b[i])) {
          bad.push((o.name || 'skin') + ' boneMatrices');
          break;
        }
      }
    }
  });
  return bad;
}

export function scanMaps(root) {
  const missing = [];
  eachMaterial(root, (m) => {
    if (m.map && !m.map.image) missing.push(m.name || 'map');
  });
  return missing;
}
