// Shared drawing helpers for code-built products. three.js primitives only (MIT).
// No third-party models, no photos, no textures. Own work.
import * as THREE from 'three';
import { BRAND } from '../brand.js';

const M = {};
export const mat = (k, c, o = {}) => (M[k] ||= new THREE.MeshLambertMaterial({ color: c, ...o }));
export const ft = (i) => Math.round((i / 12) * 1000) / 1000; // same rounding as create.js
export const black = () => mat('p40black', 0x15181d);
export const dark = () => mat('p40dark', 0x2a3240);
export const metal = () => mat('p40metal', 0x8e97a3);
export const white = () => mat('p40white', 0xe7e4dc);
export const rubber = () => mat('p40rubber', 0x101216);
export const teal = () => mat('p40teal', 0x1a6a62, { emissive: 0x0a3a34 });
export const bezel = () => mat('p40bezel', 0x0e1218);

export function group() { return new THREE.Group(); }
export function box(g, w, h, d, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y, z); g.add(o); return o;
}
export function cyl(g, r, h, m, x, y, z) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 12), m);
  o.position.set(x, y, z); g.add(o); return o;
}
// One material per screen so a later video texture does not paint every display at once.
export function addScreen(g, w, h, x, y, z) {
  const m = new THREE.MeshLambertMaterial({ color: 0x14344f, emissive: 0x165e96, emissiveIntensity: 0.5 });
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), m);
  o.name = 'screen'; o.userData.ownMat = 1; o.position.set(x, y, z); g.add(o); return o;
}
export function finish(g) { g.traverse((o) => { if (o.isMesh) o.castShadow = false; }); return g; }
export function icon(inner) {
  const C = BRAND.colors.fg, O = BRAND.colors.highlight, T = BRAND.colors.accent;
  return `<svg viewBox="0 0 48 48" fill="none" stroke="${C}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner.replaceAll('{{O}}', O).replaceAll('{{T}}', T)}</svg>`;
}
