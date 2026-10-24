
/* Z-DASH — Drive-screen layout: which panels show around the car. Saved on the device. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const PANELS = [
    ['tach', 'RPM BAR + SHIFT LIGHT'], ['rpm', 'BIG RPM NUMBER'], ['speed', 'SPEED'], ['gear', 'GEAR'], ['popup', 'SHIFT SCORE POP-UP'],
    ['boost', 'BOOST'], ['score', 'SCORE + COMBO'], ['fuel', 'FUEL'], ['mode', 'MODE TOGGLE'],
    ['ghost', 'RUN TIMER / GHOST'], ['temps', 'TEMPS (COOL/OIL/IAT)'], ['afr', 'AFR + ETHANOL'], ['tpms', 'TIRE PRESSURE'], ['music', 'NOW PLAYING (MUSIC)'],
  ];
  const on = (keys) => Object.fromEntries(PANELS.map(([k]) => [k, keys.includes(k)]));
  const PRESETS = {
    MINIMAL: on(['tach', 'rpm', 'speed', 'gear', 'popup']),
    STANDARD: on(['tach', 'rpm', 'speed', 'gear', 'popup', 'boost', 'score', 'fuel', 'mode', 'ghost']),
    FULL: on(PANELS.map(([k]) => k)),
  };
  // data each panel needs (any one is enough). Used to auto-hide panels a limited adapter profile can't feed.
  const NEEDS = { tach: ['rpm'], rpm: ['rpm'], speed: ['speed'], gear: ['rpm', 'speed'], popup: ['rpm'], score: ['rpm'], boost: ['boost'], temps: ['coolant', 'oil', 'iat'], afr: ['afr', 'ethanol'], tpms: ['tpms'], ghost: ['speed'] };
  const KEY = 'zdash.layout';
  let cur = null;
  const load = () => { try { const j = JSON.parse(localStorage.getItem(KEY)); if (j && typeof j === 'object') return Object.assign({}, PRESETS.STANDARD, j); } catch (e) {} return Object.assign({}, PRESETS.STANDARD); };
  ZD.layout = {
    PANELS, PRESETS,
    get() { return cur || (cur = load()); },
    set(k, v) { this.get()[k] = !!v; this.save(); },
    preset(name) { cur = Object.assign({}, PRESETS[name]); this.save(); },
    save() { try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) {} this.onchange && this.onchange(cur); },
    /** The layout actually drawn: the user's choice minus panels the connected adapter has no data for (caps = Set or null = everything). */
    view(caps) { const c = this.get(); if (!caps) return c; const v = Object.assign({}, c); for (const k in NEEDS) if (!NEEDS[k].some((d) => caps.has(d))) v[k] = false; return v; },
    which() { const c = this.get(); return Object.keys(PRESETS).find((p) => PANELS.every(([k]) => !!PRESETS[p][k] === !!c[k])) || 'CUSTOM'; },
  };
})(typeof window !== 'undefined' ? window : globalThis);

