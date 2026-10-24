'use strict';
// Option 1, The Boulevards. Data only: no drawing, no physics.
// Loaded before world/city.js on world.html and world-split.html.
//
// Other agents should read window.CITY_LAYOUT (this file) and, after the
// city boots, window.CITY.LAYOUT (the same records plus the curb spurs the
// game actually drives). Do not scrape shop() calls.
//
// Format
//   id            'option1-boulevards'
//   bounds        {x0,x1,z0,z1} metres. +x east, +z north. Spawn is (0,0).
//   anchors       runway, river, highway, tunnel, bridges, track, field, trailerPad
//   weather[]     {name, x0, x1, z0, z1} open-land rectangles. Not built yet.
//   districts[]   {id, label, x0, x1, z0, z1}
//   places[]      one approved footprint. kind 'arch' is a gate, not a solid.
//                 {name, station, kind, purpose, x0, x1, z0, z1, h, sign, c, pad, roof, antH, district}
//   roads[]       approved centerlines {x0,z0,x1,z1,w,kind}
//                 kind: street | lane | highway | bridge | water
//   places[].type the same as kind (arch, nos, snack, bay, pad, home, ...)
//   places[].cx/cz footprint centre. x0,x1,z0,z1 are the corners.
//   anchors.river    {z0,z1}
//   anchors.bridges  [{x0,x1,z0,z1}, ...] both decks
//   After boot, CITY.LAYOUT and CITY.LAYOUT.minimap repeat roads (the
//   driven centerlines, including curb spurs), river, bridges, districts,
//   and every place with position and type. The minimap bakes from that.
//   buildNetwork()  returns {roads, faces}
//                 roads: centerlines with buildings cut out and a curb spur
//                 added where a door was more than 16 m from a lane.
//                 faces: station -> 'n'|'s'|'e'|'w' (the street face)
//
// Lane graph (traffic, including a later rebase of PR #78):
//   CITY.ROADS.addRoad(x0,z0,x1,z1,{w,kind,kindAt,step,noRebuild})
//   CITY.ROADS.rebuild()
//   After rebuild, each edge has .lanes[{from,to,dir,yaw,off}] and .kind.
//   world/traffic.js (the live model) reads those lanes. It does not own the map.
(function (root) {
  const places = [
    {name:'HOME', station:'yard', kind:'home', purpose:'HOME', district:'HOMESTEAD', x0:-272, x1:-228, z0:-664, z1:-616, h:11, sign:'HOME', c:'#7dff6b'},
    {name:'PETS', station:'yard', kind:'pets', purpose:'PETS', district:'HOMESTEAD', x0:-212, x1:-168, z0:-664, z1:-616, h:13, sign:'PETS', c:'#7dff6b'},
    {name:'GARAGE', station:'yard', kind:'garage', purpose:'GARAGE', district:'HOMESTEAD', x0:-302, x1:-138, z0:-792, z1:-728, h:26, sign:'GARAGE', c:'#ffb020', pad:1},
    {name:'TOWER', station:'tower', kind:'tower', purpose:'SKY_DROP', district:'RIVERBANK', x0:365, x1:435, z0:1685, z1:1755, h:239, sign:'JUMP', c:'#3ee6ff', landmark:1},
    {name:'JUMP ROOF', station:'deck', kind:'deck', purpose:'SKY_DROP', district:'DECK', x0:-242, x1:-178, z0:1158, z1:1322, h:62, sign:'JUMP', c:'#3ee6ff', pad:1},
    {name:'SHOWROOM', station:'car-w', kind:'show', purpose:'SHOWROOM', district:'CAR_ROW', x0:-602, x1:-438, z0:2288, z1:2352, h:18, sign:'Z-DASH', c:'#3ee6ff', pad:1},
    {name:'BAY', station:'car-w', kind:'bay', purpose:'GARAGE', district:'CAR_ROW', x0:-530, x1:-510, z0:2393, z1:2407, h:8, sign:'GARAGE', c:'#ffb020'},
    {name:'PAINT', station:'car-c', kind:'paint', purpose:'NEON_PAINT', district:'CAR_ROW', x0:-22, x1:22, z0:2292, z1:2340, h:14, sign:'NEON', c:'#ff4fd8'},
    {name:'SNACK', station:'car-c', kind:'snack', purpose:'SNACK', district:'CAR_ROW', x0:-6, x1:6, z0:2391, z1:2401, h:5, sign:'SNACK', c:'#ff9a2e'},
    {name:'NOS', station:'car-e', kind:'nos', purpose:'NOS', district:'CAR_ROW', x0:458, x1:622, z0:2288, z1:2352, h:34, sign:'NOS', c:'#ffe14d', pad:1},
    {name:'PAD', station:'car-e', kind:'pad', purpose:'SKY_DROP', district:'CAR_ROW', x0:526, x1:554, z0:2386, z1:2414, h:8, sign:'JUMP', c:'#3ee6ff', pad:1},
    {name:'CAR ROW', station:'car-gate', kind:'arch', purpose:'', district:'CAR_ROW', x0:-993, x1:-967, z0:2256, z1:2264, h:12, sign:'CAR ROW', c:'#ff4fd8'},
    {name:'THE STAGE', station:'dance-gate', kind:'arch', purpose:'', district:'STAGE', x0:-994, x1:-986, z0:-633, z1:-607, h:12, sign:'THE STAGE', c:'#ff4fd8'},
    {name:'BAY', station:'dance-gate', kind:'bay', purpose:'GARAGE', district:'STAGE', x0:-907, x1:-893, z0:-630, z1:-610, h:8, sign:'GARAGE', c:'#ffb020'},
    {name:'CAFE', station:'dance-s', kind:'cafe', purpose:'CAFE', district:'STAGE', x0:-1082, x1:-1038, z0:-104, z1:-56, h:12, sign:'PIZZA', c:'#ff2a3d'},
    {name:'NOS', station:'dance-s', kind:'kitnos', purpose:'NOS', district:'STAGE', x0:-908, x1:-892, z0:-86, z1:-74, h:6, sign:'NOS', c:'#ffe14d'},
    {name:'DANCE', station:'dance-n', kind:'dance', purpose:'DANCE', district:'STAGE', x0:-1090, x1:-1030, z0:428, z1:492, h:18, sign:'Z COMPANY ARTS', c:'#ff4fd8', roof:'ant', antH:14},
    {name:'PAD', station:'dance-n', kind:'pad', purpose:'SKY_DROP', district:'STAGE', x0:-914, x1:-886, z0:446, z1:474, h:8, sign:'JUMP', c:'#3ee6ff', pad:1},
    {name:'BUILDER BAY', station:'build-gate', kind:'arch', purpose:'', district:'BUILDER_BAY', x0:836, x1:844, z0:-633, z1:-607, h:12, sign:'BUILDER BAY', c:'#7dff6b'},
    {name:'BAY', station:'build-gate', kind:'bay', purpose:'GARAGE', district:'BUILDER_BAY', x0:953, x1:967, z0:-630, z1:-610, h:8, sign:'GARAGE', c:'#ffb020'},
    {name:'ARCADE', station:'build-s', kind:'arcade', purpose:'ARCADE', district:'BUILDER_BAY', x0:872, x1:928, z0:-112, z1:-48, h:18, sign:'ARCADE', c:'#3ee6ff'},
    {name:'SNACK', station:'build-s', kind:'snack', purpose:'SNACK', district:'BUILDER_BAY', x0:974, x1:986, z0:-85, z1:-75, h:5, sign:'SNACK', c:'#ff9a2e'},
    {name:'BUILDER', station:'build-n', kind:'builder', purpose:'BUILDER', district:'BUILDER_BAY', x0:878, x1:922, z0:444, z1:476, h:15, sign:'PIXEL', c:'#7dff6b'},
    {name:'PAD', station:'build-n', kind:'pad', purpose:'SKY_DROP', district:'BUILDER_BAY', x0:966, x1:994, z0:446, z1:474, h:8, sign:'JUMP', c:'#3ee6ff', pad:1},
    {name:'NOS', station:'build-nos', kind:'kitnos', purpose:'NOS', district:'BUILDER_BAY', x0:1172, x1:1188, z0:194, z1:206, h:6, sign:'NOS', c:'#ffe14d'},
    {name:'THE TRACK', station:'track-e', kind:'arch', purpose:'', district:'TRACK', x0:-573, x1:-547, z0:856, z1:864, h:12, sign:'THE TRACK', c:'#ffb020'},
    {name:'SNACK', station:'track-e', kind:'snack', purpose:'SNACK', district:'TRACK', x0:-566, x1:-554, z0:795, z1:805, h:5, sign:'SNACK', c:'#ff9a2e'},
    {name:'BAY', station:'track-w', kind:'bay', purpose:'GARAGE', district:'TRACK', x0:-1490, x1:-1470, z0:853, z1:867, h:8, sign:'GARAGE', c:'#ffb020'},
    {name:'NOS', station:'track-w', kind:'kitnos', purpose:'NOS', district:'TRACK', x0:-1488, x1:-1472, z0:794, z1:806, h:6, sign:'NOS', c:'#ffe14d'},
    {name:'PAD', station:'track-pad', kind:'pad', purpose:'SKY_DROP', district:'TRACK', x0:-1214, x1:-1186, z0:1566, z1:1594, h:8, sign:'JUMP', c:'#3ee6ff', pad:1},
    {name:'SOCCER', station:'field-shop', kind:'soccer', purpose:'SOCCER', district:'FIELD', x0:732, x1:788, z0:1236, z1:1324, h:16, sign:'TURBO', c:'#ffb020'},
    {name:'PAD', station:'field-shop', kind:'pad', purpose:'SKY_DROP', district:'FIELD', x0:666, x1:694, z0:1266, z1:1294, h:8, sign:'JUMP', c:'#3ee6ff', pad:1},
    {name:'THE FIELD', station:'field-s', kind:'arch', purpose:'', district:'FIELD', x0:967, x1:993, z0:856, z1:864, h:12, sign:'THE FIELD', c:'#7dff6b'},
    {name:'SNACK', station:'field-s', kind:'snack', purpose:'SNACK', district:'FIELD', x0:1034, x1:1046, z0:855, z1:865, h:5, sign:'SNACK', c:'#ff9a2e'},
    {name:'BAY', station:'field-e', kind:'bay', purpose:'GARAGE', district:'FIELD', x0:1170, x1:1190, z0:1273, z1:1287, h:8, sign:'GARAGE', c:'#ffb020'},
    {name:'NOS', station:'field-e', kind:'kitnos', purpose:'NOS', district:'FIELD', x0:1172, x1:1188, z0:1334, z1:1346, h:6, sign:'NOS', c:'#ffe14d'}
  ];

  // Approved centerlines, plus the yard lane slid into the 16 m gap between
  // the house and the pet lounge, and short joins the picture left implied
  // (center bridge, builder NOS, track pit to the oval, field arch).
  const roads = [
    {x0:-450, z0:-900, x1:-450, z1:3000, w:30, kind:'highway'},
    {x0:0, z0:1640, x1:0, z1:1960, w:28, kind:'bridge'},
    {x0:-1400, z0:1640, x1:-160, z1:1640, w:20, kind:'water'},
    {x0:160, z0:1640, x1:1100, z1:1640, w:20, kind:'water'},
    {x0:-220, z0:40, x1:-220, z1:-716, w:12, kind:'lane'},
    {x0:-980, z0:0, x1:-40, z1:0, w:20, kind:'street'},
    {x0:40, z0:0, x1:900, z1:0, w:20, kind:'street'},
    {x0:-1100, z0:2260, x1:720, z1:2260, w:20, kind:'street'},
    {x0:-640, z0:2370, x1:660, z1:2370, w:12, kind:'lane'},
    {x0:-230, z0:2260, x1:-230, z1:2370, w:12, kind:'lane'},
    {x0:250, z0:2260, x1:250, z1:2370, w:12, kind:'lane'},
    {x0:-450, z0:1640, x1:-450, z1:2260, w:20, kind:'street'},
    {x0:-990, z0:-760, x1:-990, z1:620, w:20, kind:'street'},
    {x0:-990, z0:-80, x1:-450, z1:-80, w:20, kind:'street'},
    {x0:760, z0:-760, x1:1100, z1:-760, w:20, kind:'street'},
    {x0:840, z0:-760, x1:840, z1:620, w:20, kind:'street'},
    {x0:840, z0:-128, x1:1000, z1:-128, w:12, kind:'lane'},
    {x0:966, z0:-128, x1:966, z1:-40, w:12, kind:'lane'},
    {x0:840, z0:500, x1:1020, z1:500, w:12, kind:'lane'},
    {x0:958, z0:430, x1:958, z1:500, w:12, kind:'lane'},
    {x0:160, z0:200, x1:1160, z1:200, w:20, kind:'street'},
    {x0:-1560, z0:860, x1:-450, z1:860, w:20, kind:'street'},
    {x0:-1180, z0:860, x1:-1180, z1:910, w:18, kind:'street'},
    {x0:160, z0:860, x1:1100, z1:860, w:20, kind:'street'},
    {x0:1040, z0:860, x1:1040, z1:1180, w:20, kind:'street'},
    {x0:1040, z0:1380, x1:1040, z1:1640, w:20, kind:'street'},
    {x0:640, z0:1280, x1:948, z1:1280, w:20, kind:'street'},
    {x0:1120, z0:1280, x1:1280, z1:1280, w:20, kind:'street'}
  ];

  const weather = [
    {name:'Sand', x0:-350, x1:-170, z0:40, z1:1000},
    {name:'Fog', x0:-180, x1:250, z0:1530, z1:1660},
    {name:'Rain', x0:240, x1:640, z0:240, z1:760},
    {name:'Fog', x0:-480, x1:-80, z0:-400, z1:-160}
  ];

  const districts = [
    {id:'HOMESTEAD', label:'Homestead', x0:-360, x1:-100, z0:-900, z1:-560},
    {id:'CAR_ROW', label:'Car Row', x0:-1150, x1:760, z0:2180, z1:2460},
    {id:'STAGE', label:'The Stage', x0:-1140, x1:-820, z0:-820, z1:680},
    {id:'BUILDER_BAY', label:'Builder Bay', x0:760, x1:1240, z0:-820, z1:680},
    {id:'TRACK', label:'The Track', x0:-1620, x1:-500, z0:760, z1:1680},
    {id:'FIELD', label:'The Field', x0:600, x1:1360, z0:780, z1:1680},
    {id:'RIVERBANK', label:'Riverbank', x0:300, x1:500, z0:1640, z1:1820},
    {id:'DECK', label:'Jump Roof', x0:-280, x1:-140, z0:1120, z1:1360}
  ];

  const anchors = {
    runway: {x0:-16, x1:16, z0:-60, z1:1500},
    river: {z0:1780, z1:1840},
    highway: {x:-450, hw:15},
    tunnel: {z0:500, z1:700, x0:-530, x1:-370, bx0:-465, bx1:-435},
    bridges: [{x0:-14, x1:14, z0:1640, z1:1960}, {x0:-465, x1:-435, z0:1640, z1:1960}],
    track: {cx:-1180, cz:1160, L:270, R:115, w:22},
    field: {cx:1000, cz:1280, rx:100, ry:80},
    trailerPad: {x0:-280, x1:-160, z0:-880, z1:-830, label:'LED trailer pad'}
  };

  function len(s) { return Math.hypot(s.x1 - s.x0, s.z1 - s.z0); }
  function vertical(s) { return Math.abs(s.x0 - s.x1) < 1.5; }
  function horizontal(s) { return Math.abs(s.z0 - s.z1) < 1.5; }
  function copy(s, x0, z0, x1, z1) {
    return {x0:x0, z0:z0, x1:x1, z1:z1, w:s.w, kind:s.kind, spur:s.spur || 0};
  }

  function cutOne(s, b) {
    if (b.kind === 'arch') return [s];
    const pad = 4;
    if (vertical(s)) {
      const x = s.x0;
      if (x <= b.x0 || x >= b.x1) return [s];
      let z0 = Math.min(s.z0, s.z1), z1 = Math.max(s.z0, s.z1);
      const c0 = b.z0 - pad, c1 = b.z1 + pad;
      if (z1 <= c0 || z0 >= c1) return [s];
      const up = s.z0 < s.z1;
      const parts = [];
      if (z0 < c0 - 6) parts.push(copy(s, x, up ? z0 : c0, x, up ? c0 : z0));
      if (z1 > c1 + 6) parts.push(copy(s, x, up ? c1 : z1, x, up ? z1 : c1));
      return parts;
    }
    if (horizontal(s)) {
      const z = s.z0;
      if (z <= b.z0 || z >= b.z1) return [s];
      let x0 = Math.min(s.x0, s.x1), x1 = Math.max(s.x0, s.x1);
      const c0 = b.x0 - pad, c1 = b.x1 + pad;
      if (x1 <= c0 || x0 >= c1) return [s];
      const up = s.x0 < s.x1;
      const parts = [];
      if (x0 < c0 - 6) parts.push(copy(s, up ? x0 : c0, z, up ? c0 : x0, z));
      if (x1 > c1 + 6) parts.push(copy(s, up ? c1 : x1, z, up ? x1 : c1, z));
      return parts;
    }
    return [s];
  }

  function closest(b, segs) {
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    let best = null;
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      if (s.kind === 'highway' || s.kind === 'bridge' || s.kind === 'tunnel') continue;
      let x, z, d;
      if (vertical(s)) {
        const z0 = Math.min(s.z0, s.z1), z1 = Math.max(s.z0, s.z1);
        z = Math.max(z0, Math.min(z1, cz));
        x = s.x0;
        d = Math.hypot(cx - x, cz - z);
      } else if (horizontal(s)) {
        const x0 = Math.min(s.x0, s.x1), x1 = Math.max(s.x0, s.x1);
        x = Math.max(x0, Math.min(x1, cx));
        z = s.z0;
        d = Math.hypot(cx - x, cz - z);
      } else continue;
      if (!best || d < best.d) best = {s:s, x:x, z:z, d:d};
    }
    return best;
  }

  function faceToward(b, hit) {
    const faces = [
      {face:'s', fix:b.z0, nx:0, nz:-1, ax:'x'},
      {face:'n', fix:b.z1, nx:0, nz:1, ax:'x'},
      {face:'w', fix:b.x0, nx:-1, nz:0, ax:'z'},
      {face:'e', fix:b.x1, nx:1, nz:0, ax:'z'}
    ];
    let best = faces[0], score = 1e9;
    for (let i = 0; i < faces.length; i++) {
      const f = faces[i];
      const outward = f.ax === 'z' ? (hit.x - f.fix) * f.nx : (hit.z - f.fix) * f.nz;
      const lateral = f.ax === 'z' ? Math.abs(hit.z - (b.z0 + b.z1) / 2) : Math.abs(hit.x - (b.x0 + b.x1) / 2);
      const sc = (outward > 4 ? outward : 400) + lateral * 0.25;
      if (sc < score) { score = sc; best = f; best.outward = outward; }
    }
    return best;
  }

  function hitsBox(x0, z0, x1, z1, b, gap) {
    if (b.kind === 'arch') return false;
    const pad = gap || 1;
    const xa = Math.min(x0, x1) - pad, xb = Math.max(x0, x1) + pad;
    const za = Math.min(z0, z1) - pad, zb = Math.max(z0, z1) + pad;
    return xb > b.x0 && xa < b.x1 && zb > b.z0 && za < b.z1;
  }

  function runwayClip(x0, z0, x1, z1) {
    const xa = Math.min(x0, x1), xb = Math.max(x0, x1);
    const za = Math.min(z0, z1), zb = Math.max(z0, z1);
    return xb > -22 && xa < 22 && zb > -70 && za < 1520;
  }

  function buildNetwork() {
    let segs = roads.map(function (r) { return {x0:r.x0, z0:r.z0, x1:r.x1, z1:r.z1, w:r.w, kind:r.kind, spur:0}; });
    for (let p = 0; p < places.length; p++) {
      const next = [];
      for (let i = 0; i < segs.length; i++) {
        const bits = cutOne(segs[i], places[p]);
        for (let k = 0; k < bits.length; k++) if (len(bits[k]) > 6) next.push(bits[k]);
      }
      segs = next;
    }
    const faces = {};
    for (let p = 0; p < places.length; p++) {
      const b = places[p];
      if (b.kind === 'arch') continue;
      const hit = closest(b, segs);
      if (!hit) continue;
      const f = faceToward(b, hit);
      faces[b.station + ':' + b.name] = f.face;
      const along = f.ax === 'z' ? (b.z0 + b.z1) / 2 : (b.x0 + b.x1) / 2;
      const tx = f.ax === 'z' ? f.fix + f.nx * 4 : along;
      const tz = f.ax === 'x' ? f.fix + f.nz * 4 : along;
      const near = f.outward <= 16 && (
        (vertical(hit.s) && f.ax === 'z' && Math.abs(hit.x - f.fix) <= 18) ||
        (horizontal(hit.s) && f.ax === 'x' && Math.abs(hit.z - f.fix) <= 18)
      );
      if (near && hit.d < 24) continue;
      let x0 = hit.x, z0 = hit.z, x1 = tx, z1 = tz;
      if (Math.abs(x1 - x0) >= Math.abs(z1 - z0)) z1 = z0;
      else x1 = x0;
      if (Math.hypot(x1 - x0, z1 - z0) < 6) continue;
      if (runwayClip(x0, z0, x1, z1)) continue;
      let blocked = false;
      for (let q = 0; q < places.length; q++) {
        if (places[q] === b) continue;
        if (hitsBox(x0, z0, x1, z1, places[q], 0.5)) { blocked = true; break; }
      }
      if (blocked) continue;
      segs.push({x0:x0, z0:z0, x1:x1, z1:z1, w:14, kind:'street', spur:1});
    }
    return {roads:segs, faces:faces};
  }

  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    p.type = p.kind;
    p.cx = (p.x0 + p.x1) / 2;
    p.cz = (p.z0 + p.z1) / 2;
  }

  root.CITY_LAYOUT = {
    id:'option1-boulevards',
    bounds:{x0:-1600, x1:1400, z0:-900, z1:3000},
    anchors:anchors,
    weather:weather,
    districts:districts,
    places:places,
    roads:roads,
    river:anchors.river,
    bridges:anchors.bridges,
    trailerPad:anchors.trailerPad,
    buildNetwork:buildNetwork
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
