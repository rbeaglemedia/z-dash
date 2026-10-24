/* Test row for interiorTry=1. Loaded after city-layout.js and before city.js.
   Without that query this file adds nothing, so a normal walk keeps the map.
   One house is already on the west sidewalk. This adds the other three,
   and four cafes on the east sidewalk, one style each. */
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
  // West curb x=-226. The house face sits 4 m outside that curb, at x=-230.
  // East curb x=-214. The cafe face sits 4 m outside that curb, at x=-210.
  // Cafe depth stops at x=-170 so it does not meet the x=-160 corridor.
  // The live house stays where it is and becomes HOME 1. Homes 2 to 4 sit
  // north of the pet lounge, still on this lane, clear of the cross streets
  // the architecture check extrudes at z=-128 and z=-80.
  const home = lay.places.filter(function (p) { return p && p.purpose === 'HOME'; })[0];
  if (home) {
    home.sign = 'HOME 1';
    home.tryHouse = 1;
  }
  for (let i = 0; i < lay.districts.length; i++) {
    const d = lay.districts[i];
    if (d && d.id === 'HOMESTEAD' && d.z1 < -370) d.z1 = -370;
  }
  const houses = [
    { n: 2, z0: -548, z1: -515 },
    { n: 3, z0: -507, z1: -474 },
    { n: 4, z0: -466, z1: -433 }
  ];
  const cafes = [
    { n: 1, z0: -678, z1: -630 },
    { n: 2, z0: -548, z1: -515 },
    { n: 3, z0: -507, z1: -474 },
    { n: 4, z0: -466, z1: -433 }
  ];
  for (let i = 0; i < houses.length; i++) {
    const s = houses[i];
    lay.places.push({
      name: 'HOME ' + s.n,
      station: 'try-home',
      kind: 'home',
      purpose: 'HOME',
      district: 'HOMESTEAD',
      x0: -274,
      x1: -230,
      z0: s.z0,
      z1: s.z1,
      h: 7.5,
      sign: 'HOME ' + s.n,
      c: '#7dff6b',
      roof: 'ant',
      antH: 8,
      tryHouse: s.n,
      tryOnly: 1,
      type: 'home',
      cx: -252,
      cz: (s.z0 + s.z1) / 2
    });
  }
  for (let i = 0; i < cafes.length; i++) {
    const s = cafes[i];
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
      h: 7.5,
      sign: 'CAFE ' + s.n,
      c: '#ff2a3d',
      roof: 'ant',
      antH: 8,
      tryCafe: s.n,
      tryOnly: 1,
      type: 'cafe',
      cx: -190,
      cz: (s.z0 + s.z1) / 2
    });
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
