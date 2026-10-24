import * as THREE from 'three';
import { skinnedBox } from './adventure-look.js';
import { findBone, boneWorld } from './bones.js';

const _v = new THREE.Vector3();

function actorBox(root) {
  const box = skinnedBox(root);
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isMesh || o.isSkinnedMesh || !o.geometry) return;
    if (o.userData.attach) return;
    box.union(new THREE.Box3().setFromObject(o));
  });
  return box;
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

export function measureActor(root) {
  root.updateMatrixWorld(true);
  const box = actorBox(root);
  const size = box.getSize(new THREE.Vector3());
  const head = findBone(root, 'Head');
  const neck = findBone(root, 'Neck');
  const hips = findBone(root, 'Hips') || findBone(root, 'Hip') || findBone(root, 'Pelvis');
  const headEnd = findBone(root, 'Head_end');
  const headY = head ? boneWorld(head, _v).y : box.max.y;
  const neckY = neck ? boneWorld(neck, _v).y : headY;
  const hipY = hips ? boneWorld(hips, _v).y : box.min.y + size.y * 0.5;
  const headTop = headEnd ? boneWorld(headEnd, _v).y : box.max.y;
  const headFrac = (Math.max(headTop, headY) - Math.min(headY, neckY)) / Math.max(0.001, size.y);
  const feet = [];
  root.traverse((o) => {
    if (!o.isBone) return;
    const n = o.name.toLowerCase();
    if (n.includes('foot') || n.includes('paw')) feet.push(boneWorld(o, _v).y);
  });
  return {
    height: size.y,
    minY: box.min.y,
    maxY: box.max.y,
    length: Math.max(size.x, size.z, spanLength(root)),
    headFrac,
    headY,
    neckY,
    hipY,
    footY: feet,
    bones: {
      head: !!head,
      neck: !!neck,
      hips: !!hips,
    },
  };
}

export function anatomyLines(root, kind, rules) {
  const m = measureActor(root);
  const lines = [];
  let pass = true;
  const fail = (text) => { pass = false; lines.push('FAIL  ' + text); };
  const ok = (text) => lines.push('PASS  ' + text);
  lines.push('height ' + m.height.toFixed(2) + ' m   feet ' + m.minY.toFixed(3) + ' m');
  const feetOk = m.minY <= rules.feet[1] && m.minY >= rules.feet[0];
  if (feetOk) ok('feet meet the ground');
  else fail('feet at ' + m.minY.toFixed(3) + ' m');
  const pet = kind === 'pet' || kind === 'neon-pet';
  if (pet) {
    if (m.height >= rules.petMin) ok('pet height ' + m.height.toFixed(2) + ' m');
    else fail('pet height ' + m.height.toFixed(2) + ' m is under ' + rules.petMin);
    if (m.length > m.height * rules.petLong) ok('longer than tall (' + m.length.toFixed(2) + ' m)');
    else fail('length ' + m.length.toFixed(2) + ' m is not above height × ' + rules.petLong);
    if (m.maxY <= m.hipY + rules.petAboveHip) ok('back stays near the hip');
    else fail('top ' + m.maxY.toFixed(2) + ' m is above the hip line');
  } else {
    const [lo, hi] = rules.humanHeight;
    if (m.height >= lo && m.height <= hi) ok('standing height ' + m.height.toFixed(2) + ' m');
    else fail('standing height ' + m.height.toFixed(2) + ' m outside ' + lo + '–' + hi);
    const pct = Math.round(m.headFrac * 100);
    const [a, b] = rules.headFrac;
    if (m.headFrac >= a && m.headFrac <= b) ok('bone head span ' + pct + '%');
    else fail('bone head span ' + pct + '% outside ' + Math.round(a * 100) + '–' + Math.round(b * 100));
    if (m.bones.head && m.bones.neck) ok('head sits on a neck bone');
    else fail('missing head or neck bone');
  }
  return { lines, pass, measure: m };
}
