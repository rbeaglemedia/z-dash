// Plug-in registries. A new product, preset, panel or sim feature registers itself
// from its own file. src/main.js does not gain a line when one is added.
const products = [];
const categories = [];
const presets = [];
const panels = [];
const sims = [];

export function registerProduct(p) { products.push(p); }
export function registerCategory(c) { categories.push(c); }
export function registerPreset(p) { presets.push(p); }
export function registerPanel(p) { panels.push(p); }
export function registerSim(p) { sims.push(p); }

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.id).localeCompare(String(b.id));
export const registeredProducts = () => products.slice().sort(byOrder);
export const registeredCategories = () => categories.slice().sort(byOrder);
export const registeredPresets = () => presets.slice().sort(byOrder);
export const registeredPanels = () => panels.slice().sort(byOrder);
export const registeredSims = () => sims.slice().sort(byOrder);
export const presetById = (id) => presets.find((p) => p.id === id) || null;
export const simById = (id) => sims.find((s) => s.id === id) || null;
