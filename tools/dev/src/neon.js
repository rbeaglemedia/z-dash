import * as THREE from 'three';

function bone(name, parent, x, y, z) {
  const b = new THREE.Bone();
  b.name = name;
  b.position.set(x, y, z);
  parent.add(b);
  return b;
}

function mat(name, color) {
  const m = new THREE.MeshLambertMaterial({ name, color });
  m.skinning = false;
  return m;
}

function mesh(geo, material, parent, x, y, z, sx, sy, sz) {
  const o = new THREE.Mesh(geo, material);
  o.castShadow = false;
  o.receiveShadow = false;
  o.frustumCulled = false;
  o.position.set(x || 0, y || 0, z || 0);
  if (sx != null) o.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
  parent.add(o);
  return o;
}

function idleClip(boneName, y) {
  const track = new THREE.VectorKeyframeTrack(
    boneName + '.position',
    [0, 0.5, 1],
    [0, y, 0, 0, y + 0.03, 0, 0, y, 0],
  );
  return new THREE.AnimationClip('Idle', 1, [track]);
}

export function buildNeon(model) {
  if (model.kind === 'neon-pet') return buildPet(model);
  return buildHuman(model);
}

function buildHuman(model) {
  const root = new THREE.Group();
  root.name = model.id;
  const H = model.height || 1.75;
  const hipsY = H * 0.52;
  const hips = bone('Hips', root, 0, hipsY, 0);
  const spine = bone('Spine', hips, 0, H * 0.12, 0);
  const neck = bone('Neck', spine, 0, H * 0.2, 0);
  const head = bone('Head', neck, 0, H * 0.06, 0);
  bone('Head_end', head, 0, H * 0.1, 0);
  const legL = bone('UpperLeg.L', hips, -0.08, -H * 0.02, 0);
  const legR = bone('UpperLeg.R', hips, 0.08, -H * 0.02, 0);
  bone('Foot.L', legL, 0, -hipsY + 0.04, 0.02);
  bone('Foot.R', legR, 0, -hipsY + 0.04, 0.02);
  bone('UpperArm.L', spine, -0.16, H * 0.12, 0);
  bone('UpperArm.R', spine, 0.16, H * 0.12, 0);

  const skin = mat('Skin', model.skin || '#f0c8a8');
  const face = mat('Face', model.skin || '#f0c8a8');
  const shirt = mat('Shirt', model.outfit || '#ff3df2');
  const pants = mat('Pants', '#2a1434');
  const shoes = mat('Shoes', '#2a211c');
  const hair = mat('Hair', model.outfit || '#ff4ad8');

  mesh(new THREE.BoxGeometry(0.28, H * 0.28, 0.16), shirt, spine, 0, H * 0.06, 0);
  mesh(new THREE.BoxGeometry(0.26, H * 0.12, 0.15), pants, hips, 0, -0.02, 0);
  mesh(new THREE.SphereGeometry(H * 0.07, 14, 10), skin, head, 0, H * 0.02, 0);
  mesh(new THREE.SphereGeometry(0.012, 8, 6), face, head, -0.025, H * 0.02, H * 0.055);
  mesh(new THREE.SphereGeometry(0.012, 8, 6), face, head, 0.025, H * 0.02, H * 0.055);
  mesh(new THREE.SphereGeometry(0.07, 12, 8), hair, head, 0, H * 0.05, -0.01);
  mesh(new THREE.CylinderGeometry(0.025, 0.03, H * 0.16, 8), hair, head, 0, -0.02, -0.06);
  mesh(new THREE.BoxGeometry(0.08, 0.04, 0.14), shoes, root.getObjectByName('Foot.L'), 0, 0, 0.02);
  mesh(new THREE.BoxGeometry(0.08, 0.04, 0.14), shoes, root.getObjectByName('Foot.R'), 0, 0, 0.02);
  root.animations = [idleClip('Hips', hipsY)];
  return root;
}

function buildPet(model) {
  const rig = model.rig || {};
  const root = new THREE.Group();
  root.name = model.id;
  const color = rig.color || '#ffb020';
  const len = rig.len || 0.26;
  const leg = rig.leg || 0.15;
  const hips = bone('Hips', root, 0, leg, 0);
  const spine = bone('Spine', hips, -len * 0.1, rig.body || 0.06, 0);
  const neck = bone('Neck', hips, len * 0.35, (rig.body || 0.06) * 0.4, 0);
  const head = bone('Head', neck, len * 0.2, (rig.head || 0.08) * 0.2, 0);
  bone('Head_end', head, (rig.head || 0.08), (rig.head || 0.08) * 0.3, 0);
  bone('Foot.L', hips, len * 0.2, -leg + 0.02, 0.05);
  bone('Foot.R', hips, len * 0.2, -leg + 0.02, -0.05);
  bone('Foot.L2', hips, -len * 0.25, -leg + 0.02, 0.05);
  bone('Foot.R2', hips, -len * 0.25, -leg + 0.02, -0.05);

  const fur = mat('Fur', color);
  const nose = mat('Face', '#2a211c');
  mesh(new THREE.BoxGeometry(len, rig.body || 0.07, (rig.body || 0.07) * 0.8), fur, hips, 0, 0, 0);
  mesh(new THREE.SphereGeometry(rig.head || 0.08, 12, 8), fur, head, 0, 0, 0);
  mesh(new THREE.SphereGeometry(0.015, 8, 6), nose, head, (rig.head || 0.08) * 0.8, 0, 0);
  if (rig.ear === 'point' || rig.ear === 'horn') {
    mesh(new THREE.ConeGeometry(0.02, rig.earL || 0.06, 6), fur, head, 0, (rig.head || 0.08), 0.03);
    mesh(new THREE.ConeGeometry(0.02, rig.earL || 0.06, 6), fur, head, 0, (rig.head || 0.08), -0.03);
  } else {
    mesh(new THREE.CylinderGeometry(0.008, 0.008, rig.earL || 0.08, 6), fur, head, 0, (rig.head || 0.08), 0);
  }
  mesh(new THREE.CylinderGeometry(0.015, 0.008, rig.tail || 0.12, 6), fur, spine, -(len * 0.55), 0.02, 0);
  if (rig.wings) {
    const wing = mat('Shirt', '#d8ffe4');
    mesh(new THREE.BoxGeometry(0.02, 0.08, 0.16), wing, spine, 0, 0.04, 0.1);
    mesh(new THREE.BoxGeometry(0.02, 0.08, 0.16), wing, spine, 0, 0.04, -0.1);
  }
  root.animations = [idleClip('Hips', leg)];
  root.position.y = 0;
  // Feet bones sit on y=0.02. Drop the whole pet so the lowest mesh meets y=0.
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;
  return root;
}
