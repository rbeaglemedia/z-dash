/* Test cafes for interiorTry=1. Loaded after city-layout.js and before city.js.
   Without that query this file adds nothing, so a normal walk keeps the map.
   Four cafes, styles 1 to 4, on the east sidewalk of the yard lane.
   The house is on the west sidewalk of that same lane. */
'use strict';
(function (root) {
  function on() {
    try {
      if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('interiorTry') === '1') return true;
    } catch (e) {}
    return !!(root && root.__INTERIOR_TRY_MAP);
  }
  if (!on()) return;
  const lay = root.CITY_LAYOUT;
  if (!lay || !lay.places) return;
  if (lay.places.some(function (p) { return p && p.tryCafe; })) return;
  // Yard lane center x=-220, width 12. Pavement is x=-226 to x=-214.
  // East curb x=-214. The road face sits 4 m outside that curb, at x=-210.
  // Depth stops at x=-170. The Car Row connector at x=-160 is extruded by the
  // architecture check as a full-length street, so a 44 m depth would cover it.
  // Frontage is 33 m so all four centers stay inside Homestead (z to -560)
  // and on the lane (the lane ends at z=-716). Gap is 8 m. Height is 12 m.
  // Cafe 2 is the door across from the house.
  const row = [
    { n: 1, z0: -716, z1: -683 },
    { n: 2, z0: -675, z1: -642 },
    { n: 3, z0: -634, z1: -601 },
    { n: 4, z0: -593, z1: -560 }
  ];
  for (let i = 0; i < row.length; i++) {
    const s = row[i];
    lay.places.push({
      name: 'CAFE ' + s.n,
      station: 'try-cafe',
      kind: 'cafe',
      purpose: 'CAFE',
      district: 'HOMESTEAD',
      x0: -210,
      x1: -170,
      z0: s.z0,
      z1: s.z1,
      h: 12,
      sign: 'CAFE ' + s.n,
      c: '#ff2a3d',
      tryCafe: s.n,
      type: 'cafe',
      cx: -190,
      cz: (s.z0 + s.z1) / 2
    });
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
