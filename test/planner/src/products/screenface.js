// Shared by the touchscreen kiosk and touchscreen table. meshes.js is a shared file
// and this job only adds product files, so an unknown shape still comes out of
// buildMesh as one white box of the product envelope. That box is swapped here for
// the real code-drawn mesh. The lit glass is its own mesh, named "screen", with its
// own material (the LED poster names its glass "posterScreen" the same way). A later
// video pass can set material.map on that mesh, or replace the material, without
// changing any other screen.
import * as THREE from 'three';

const M = {};
export const solid = (k, c, o = {}) => (M[k] ||= new THREE.MeshLambertMaterial({ color: c, ...o }));
export const inch = (i) => i / 12;

// 55 in class, 16:9. Landscape width then height, in inches. Portrait swaps them.
const HYP169 = Math.hypot(16, 9);
export const DIAG_IN = 55;
export const LAND_W_IN = (DIAG_IN * 16) / HYP169;
export const LAND_H_IN = (DIAG_IN * 9) / HYP169;

export function addBox(g, w, h, d, m, x, y, z) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z);
  g.add(o);
  return o;
}

export function addCyl(g, r, h, m, x, y, z) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), m);
  o.position.set(x, y, z);
  g.add(o);
  return o;
}

// Proud of the face it sits on, so it does not z-fight the body. Own material so
// disposeTree frees it and a video texture stays on this item only.
export function addScreen(g, w, h, d, x, y, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x1b3a55, emissive: 0x0e2a44 });
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  o.position.set(x, y, z);
  o.name = 'screen';
  o.userData.screen = 1;
  o.userData.ownMat = 1;
  g.add(o);
  return o;
}

const keyOf = (w, h, d) => [w, h, d].map((n) => Math.round(n * 1000)).join(',');
const shapes = new Map();
const WHITE = 0xf1efe9; // meshes.js default placeholder
let installed = false;

export function installShape(w, h, d, build) {
  shapes.set(keyOf(w, h, d), build);
  if (installed) return;
  installed = true;
  const orig = THREE.Group.prototype.add;
  THREE.Group.prototype.add = function add(obj) {
    const p = obj && obj.isMesh && obj.geometry && obj.geometry.parameters;
    const hex = obj && obj.material && obj.material.color && obj.material.color.getHex();
    const buildShape = p && !this.userData._espShape && this.children.length === 0 && hex === WHITE && shapes.get(keyOf(p.width, p.height, p.depth));
    if (buildShape && Math.abs(obj.position.y * 2 - p.height) < 1e-4 && obj.position.x === 0 && obj.position.z === 0) {
      this.userData._espShape = 1;
      try { buildShape(this); }
      finally { delete this.userData._espShape; obj.geometry.dispose(); }
      return this;
    }
    return orig.apply(this, arguments);
  };
}
