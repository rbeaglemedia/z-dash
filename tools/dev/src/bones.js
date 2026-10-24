import * as THREE from 'three';

export function boneKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function leaf(name) {
  return boneKey(String(name || '').split('|').pop());
}

// Game findBone, plus a looser match so fox b_Head_05 and unnamed pet bones
// still take a hat. The exact match wins when the rig has Head / Neck / Hips.
export function findBone(root, name) {
  const want = boneKey(name);
  let exact = null;
  let loose = null;
  root.traverse((o) => {
    if (!o.isBone) return;
    const key = leaf(o.name);
    if (!exact && (key === want || key.endsWith(want))) exact = o;
    if (!loose && key.includes(want) && !key.includes('end')) loose = o;
  });
  if (exact) return exact;
  if (loose) return loose;
  if (want === 'head' || want === 'spine' || want === 'neck' || want === 'hips') {
    root.updateMatrixWorld(true);
    const v = new THREE.Vector3();
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

export function findBones(root, name) {
  const want = boneKey(name);
  const out = [];
  root.traverse((o) => {
    if (!o.isBone) return;
    const key = leaf(o.name);
    if (key.includes(want) && !key.includes('end')) out.push(o);
  });
  return out;
}

export function boneWorld(bone, target) {
  bone.updateWorldMatrix(true, false);
  return bone.getWorldPosition(target);
}
