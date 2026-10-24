// Shared primitives for code-drawn products. Materials are cached; geometries are per mesh.
import * as THREE from 'three';

const cache = {};
export function mat(key, color, extra = {}) {
  return cache[key] || (cache[key] = new THREE.MeshLambertMaterial({ color, ...extra }));
}

export function box(g, w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  g.add(mesh);
  return mesh;
}

export function cyl(g, rTop, rBot, h, material, x = 0, y = 0, z = 0, seg = 20) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), material);
  mesh.position.set(x, y, z);
  g.add(mesh);
  return mesh;
}
