export function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function repoUrl(rel) {
  return new URL('../../../' + String(rel).replace(/^\/+/, ''), import.meta.url).href;
}

export function devUrl(rel) {
  return new URL('../' + String(rel).replace(/^\/+/, ''), import.meta.url).href;
}

export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url + ' ' + res.status);
  return res.json();
}

const FAV_KEY = 'zdash.dev.favs.v1';

export function readFavs(moduleId) {
  try {
    const all = JSON.parse(localStorage.getItem(FAV_KEY) || '{}');
    return all[moduleId] || {};
  } catch (err) {
    return {};
  }
}

export function writeFav(moduleId, name, eq) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(FAV_KEY) || '{}'); } catch (err) { all = {}; }
  if (!all[moduleId]) all[moduleId] = {};
  all[moduleId][name] = eq;
  localStorage.setItem(FAV_KEY, JSON.stringify(all));
}

export function eachMaterial(root, fn) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => { if (m) fn(m, o); });
  });
}
