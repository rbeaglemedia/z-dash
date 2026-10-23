'use strict';
/* Menus & Garage/Home Hub.
   Owns the Neon World pause-menu icons, the game-tile grid, and GARAGE_HOME_HUB.
   Reads zdash.kid.v1 and writes only sv.eq and sv.house (plus a fresh profile when no save exists).
   Never replaces window.KID, window.GZ, or window.GARAGEZ. Live paint goes through GARAGEZ.sync().
   Track color is copied onto KID.trackColor after that sync. House decor is also stored in zdash.house.v1. */
(function () {
  if (window.GARAGE_HOME_HUB) return;

  const KID_KEY = 'zdash.kid.v1';
  const CREW_KEY = 'zdash.crew.v1';
  const CHAR_KEY = 'zdash.char.v1';
  const PET_KEY = 'zdash.pet.v1';
  const PAINT_KEY = 'zdash.neonpaint.v1';
  const DANCE_KEY = 'zdash.customdance.v1';
  const PETDANCE_KEY = 'zdash.petdance.v1';
  const STAGE_KEY = 'zdash.dancestage.v1';
  const HOUSE_KEY = 'zdash.house.v1';
  const DANCE_IDS = ['default', 'slot0', 'slot1', 'slot2'];
  const SLOT_IDS = ['slot0', 'slot1', 'slot2'];

  const DEFAULT_EQ = {
    paint: 'cyan', windows: 'win-clear', rims: 'gtx04', size: 19, wheels: 'w-gun', tires: 'street',
    roof: 'r-match', bumper: 'bp-stock', bcan: 'bc-off', nos: 'n-stock', heads: 'h-clear', tails: 't-red',
    spoiler: 'none-s', spcol: 'sc-match', underglow: 'ug-off', caliper: 'cal-red', stance: 'st-stock',
    camber: 'cb-off', lip: 'lip-none', skirts: 'sk-none', diffuser: 'df-none', kitmat: 'km-black',
    tips: 'tip-stock', wings: 'none-w', extra: 'none-x', tracks: 'tr-match'
  };
  const FREE_IDS = ['cyan', 'pink', 'gun', 'gunmetal', 'win-clear', 'win-smoke', 'gtx04', 'stock', '5spoke', 'steel', 'w-gun', 'street', 'n-stock', 'r-match', 'h-clear', 't-red', 'none-s', 'sc-match', 'ug-off', 'cal-red', 'st-stock', 'cb-off', 'lip-none', 'bp-stock', 'bc-off', 'bc-on', 'sk-none', 'df-none', 'km-black', 'tip-stock', 'tip-invidia', 'none-w', 'none-x', 'tr-match', 'tr-cyan', 'tr-pink'];

  const CATS = {
    paint: [
      { id: 'cyan', name: 'CYBER CYAN', hex: '#1aa6c8' },
      { id: 'pink', name: 'BUBBLEGUM', hex: '#e0359f' },
      { id: 'gun', name: "DAD'S GUNMETAL", hex: '#5c6068' },
      { id: 'gunmetal', name: 'GUN METALLIC', hex: '#5c6068' },
      { id: 'lime', name: 'LASER LIME', hex: '#3cc24a', cost: 40 },
      { id: 'purple', name: 'GALAXY PURPLE', hex: '#6a33d6', cost: 60 },
      { id: 'gold', name: 'SUNNY GOLD', hex: '#d9a514', cost: 80 },
      { id: 'rainbow', name: 'RAINBOW', hex: '#ff4fd8', how: 'box' },
      { id: 'red40', name: '40TH ANNIV RED', hex: '#8a0f1a', how: 'box' },
      { id: 'blackout', name: 'MIDNIGHT BLACK', hex: '#121318', cost: 60 },
      { id: 'tuner-orange', name: 'TUNER ORANGE', hex: '#ff7a1a', cost: 50 },
      { id: 'cop_bw', name: 'COP BLACK & WHITE', hex: '#0e0f13', cost: 3000 },
      { id: 'cop_white', name: 'PATROL WHITE', hex: '#e6e9ef', cost: 3000 },
      { id: 'cop_stealth', name: 'STEALTH GRAY', hex: '#2a2d33', cost: 3000 },
      { id: 'cop_interceptor', name: 'GOLD INTERCEPTOR', hex: '#0b0b0e', cost: 3000 }
    ],
    wheels: [
      { id: 'w-gun', name: 'GUNMETAL', hex: '#4a4f57' },
      { id: 'w-black', name: 'GLOSS BLACK', hex: '#15161a', cost: 30 },
      { id: 'w-chrome', name: 'CHROME', hex: '#d8dde4', cost: 30 },
      { id: 'w-gold', name: 'GOLD', hex: '#e0b020', cost: 50 },
      { id: 'w-cyan', name: 'NEON CYAN', hex: '#3ee6ff', cost: 70 },
      { id: 'w-pink', name: 'NEON PINK', hex: '#ff4fd8', how: 'box' },
      { id: 'w-rainbow', name: 'RAINBOW GLOW', hex: '#ff4fd8', how: 'combo' },
      { id: 'w-fire', name: 'FIRE GLOW', hex: '#ff9a2e', how: 'box' }
    ],
    spoiler: [
      { id: 'none-s', name: 'NONE' },
      { id: 'duck', name: 'DUCK TAIL', cost: 40 },
      { id: 'gtwing', name: 'GT WING', cost: 90 },
      { id: 'twin', name: 'DOUBLE DECKER', how: 'box' },
      { id: 'bolt', name: 'LIGHTNING WING', how: 'combo' }
    ],
    windows: [
      { id: 'win-clear', name: 'CLEAR', hex: '#cfe6f5' },
      { id: 'win-smoke', name: 'LIGHT SMOKE', hex: '#5a6470' },
      { id: 'win-limo', name: 'LIMO DARK', hex: '#08090c', cost: 40 },
      { id: 'win-ice', name: 'ICE BLUE', hex: '#8fe3ff', cost: 30 },
      { id: 'win-purple', name: 'PURPLE', hex: '#8a4dff', cost: 60 },
      { id: 'win-rose', name: 'ROSE GOLD', hex: '#e8a598', how: 'box' }
    ],
    underglow: [
      { id: 'ug-off', name: 'OFF' },
      { id: 'ug-pink', name: 'NEON PINK', hex: '#ff4fd8', cost: 60 },
      { id: 'ug-cyan', name: 'CYBER CYAN', hex: '#3ee6ff', cost: 60 },
      { id: 'ug-purple', name: 'ULTRA VIOLET', hex: '#9b5cff', cost: 70 },
      { id: 'ug-lime', name: 'TOXIC LIME', hex: '#7dff6b', cost: 70 },
      { id: 'ug-red', name: 'RED HOT', hex: '#ff2a3d', cost: 70 },
      { id: 'ug-blue', name: 'DEEP BLUE', hex: '#2a5bff', cost: 70 },
      { id: 'ug-rainbow', name: 'RAINBOW', hex: '#ff4fd8', how: 'box' }
    ],
    tracks: [
      { id: 'tr-match', name: 'MATCH CAR GLOW', hex: '#3ee6ff' },
      { id: 'tr-cyan', name: 'CYBER CYAN', hex: '#3ee6ff' },
      { id: 'tr-pink', name: 'NEON PINK', hex: '#ff4fd8' },
      { id: 'tr-lime', name: 'LASER LIME', hex: '#7dff6b', cost: 40 },
      { id: 'tr-purple', name: 'ULTRA VIOLET', hex: '#9b5cff', cost: 40 },
      { id: 'tr-gold', name: 'SOLAR GOLD', hex: '#ffe14d', cost: 50 },
      { id: 'tr-red', name: 'RED HOT', hex: '#ff2a3d', cost: 50 },
      { id: 'tr-rainbow', name: 'RAINBOW TRACKS', hex: '#ff4fd8', cost: 80 }
    ]
  };
  const HOUSE_WALLS = [
    { id: 'neon-grid', name: 'NEON GRID', hex: '#3ee6ff' },
    { id: 'bubblegum', name: 'BUBBLEGUM', hex: '#ff4fd8' },
    { id: 'midnight', name: 'MIDNIGHT', hex: '#9b5cff' },
    { id: 'lime-loft', name: 'LIME LOFT', hex: '#7dff6b' }
  ];
  const HOUSE_SIGNS = [
    { id: 'ellie', name: "ELLIE'S Z", text: "ELLIE'S Z" },
    { id: 'arts', name: 'Z COMPANY ARTS', text: 'Z COMPANY ARTS' },
    { id: 'home', name: 'WELCOME HOME', text: 'WELCOME HOME' },
    { id: 'glow', name: 'NEON DREAMS', text: 'NEON DREAMS' }
  ];
  const HOUSE_ITEMS = [
    { id: 'sofa', name: '🛋 SOFA' },
    { id: 'arcade', name: '🕹 ARCADE' },
    { id: 'petBed', name: '🛏 PET BED' },
    { id: 'danceFloor', name: '💃 DANCE FLOOR' }
  ];
  const DEFAULT_HOUSE = { v: 1, wall: 'neon-grid', sign: 'ellie', sofa: true, arcade: true, petBed: true, danceFloor: true };
  const PRESETS = [
    { id: 'dad', name: 'CLASSIC DAD', eq: { paint: 'gunmetal', wheels: 'w-gun', spoiler: 'none-s', windows: 'win-clear', underglow: 'ug-off', rims: 'gtx04', caliper: 'cal-red' } },
    { id: 'neon', name: 'NEON RACER', eq: { paint: 'pink', wheels: 'w-cyan', spoiler: 'duck', windows: 'win-ice', underglow: 'ug-cyan' } },
    { id: 'tuner', name: 'STREET TUNER', eq: { paint: 'tuner-orange', wheels: 'w-chrome', spoiler: 'gtwing', windows: 'win-smoke', underglow: 'ug-purple' } }
  ];
  const CREW_CHARS = [['woman', 'Neon Woman'], ['man', 'Neon Man'], ['none', 'None']];
  const CREW_PETS = [['dog', 'Cyber Pup Dog'], ['cat', 'Neon Kitty Cat'], ['bunny', 'Star Bunny'], ['dragon', 'Mini Dragon'], ['fox', 'Nova Fox'], ['none', 'None']];
  const CREW_ANIMS = [['ride', 'Ride'], ['walk', 'Walk'], ['run', 'Run'], ['dance', 'Dance']];
  const PET_TYPE = { dog: 'robo', cat: 'cat', bunny: 'fox', dragon: 'dragon', fox: 'fox' };

  function svg(body) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }
  const ICONS = {
    play: svg('<path d="M8 5 L19 12 L8 19 Z" fill="currentColor" stroke="none"/>'),
    exit: svg('<path d="M10 5 H6 V19 H10"/><path d="M10 12 H19"/><path d="M16 9 L19 12 L16 15"/>'),
    tilt: svg('<circle cx="12" cy="12" r="7"/><path d="M12 5 V8 M12 16 V19 M5 12 H8 M16 12 H19"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'),
    full: svg('<path d="M5 9 V5 H9 M15 5 H19 V9 M19 15 V19 H15 M9 19 H5 V15"/>'),
    runway: svg('<path d="M4 18 H20"/><path d="M7 18 L12 6 L17 18"/><path d="M12 9 V14"/>'),
    sky: svg('<path d="M12 3 V7"/><path d="M8 8 H16 L12 14 Z"/><path d="M6 17 C7 20 17 20 18 17"/>'),
    eye: svg('<path d="M2 12 C6 7 18 7 22 12 C18 17 6 17 2 12"/><circle cx="12" cy="12" r="2.4"/>'),
    garage: svg('<path d="M3 11 L12 4 L21 11"/><path d="M5 10.5 V20 H19 V10.5"/><path d="M8 20 V13 H16 V20"/><path d="M8 15.5 H16 M8 17.6 H16"/>'),
    home: svg('<path d="M4 11 L12 4 L20 11"/><path d="M7 10 V20 H17 V10"/><path d="M10 20 V14 H14 V20"/>'),
    car: svg('<path d="M3 15 L6 10 H18 L21 15 V18 H3 Z"/><circle cx="7.5" cy="18" r="1.4" fill="currentColor"/><circle cx="16.5" cy="18" r="1.4" fill="currentColor"/>'),
    paint: svg('<path d="M12 3 L20 12 L12 21 L4 12 Z"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'),
    dance: svg('<circle cx="9" cy="5" r="1.6" fill="currentColor"/><path d="M9 8 L9 13 L6 19 M9 13 L13 19 M9 10 L14 8 L16 11"/>'),
    crew: svg('<circle cx="8" cy="7" r="2"/><circle cx="16" cy="8" r="1.5"/><path d="M4 19 C4 14 6 13 8 13 C10 13 12 14 12 19"/><path d="M13 19 C13 16 14.4 14.5 16 14.5 C17.8 14.5 19 16 19 19"/>'),
    ball: svg('<circle cx="12" cy="12" r="7"/><path d="M12 5 L14 9 H18 L15 12 L16 16 L12 14 L8 16 L9 12 L6 9 H10 Z"/>'),
    city: svg('<path d="M3 20 V9 H8 V20"/><path d="M8 20 V4 H14 V20"/><path d="M14 20 V11 H21 V20"/><path d="M3 20 H21"/>'),
    pet: svg('<circle cx="7" cy="8" r="1.6"/><circle cx="12" cy="6" r="1.7"/><circle cx="17" cy="8" r="1.6"/><circle cx="12" cy="14" r="4"/>'),
    world: svg('<path d="M4 16 V10 H8 V16"/><path d="M8 16 V6 H13 V16"/><path d="M13 16 V9 H18 V16"/><path d="M3 16 H21"/><path d="M12 6 V3"/><circle cx="12" cy="3" r="0.8" fill="currentColor"/>'),
    stunt: svg('<circle cx="12" cy="8" r="3"/><path d="M5 20 C7 14 17 14 19 20"/><path d="M8 20 H16"/>'),
    chase: svg('<path d="M3 16 L7 11 H12 L14 13 H19 L21 16 V18 H3 Z"/><path d="M7 11 L9 8 H13"/>'),
    road: svg('<path d="M8 20 L11 4 M16 20 L13 4"/><path d="M12 5 V8 M12 11 V14 M12 17 V20"/>'),
    drag: svg('<path d="M12 3 V21"/><circle cx="12" cy="6" r="1.6" fill="currentColor"/><circle cx="12" cy="11" r="1.6" fill="currentColor"/><circle cx="12" cy="16" r="1.6" fill="#7dff6b"/>'),
    fly: svg('<path d="M3 16 L12 12 L21 16"/><path d="M8 14 L12 6 L16 14"/><path d="M5 19 Q12 16 19 19"/>'),
    ride: svg('<path d="M5 16 A7 7 0 0 1 19 16"/><path d="M12 16 V7"/><circle cx="12" cy="16" r="1.3" fill="currentColor"/>'),
    wall: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M2 7 H22 M2 12 H22 M2 17 H22 M6 7 V2 M10 12 V7 M14 17 V12 M18 7 V2 M8 12 V7 M16 12 V7" fill="none" stroke="#ff4fd8" stroke-width="1.3"/><path d="M15 21c1.6-2.4 2.4-3.4 2.4-5a1.8 1.8 0 0 0-3.6 0c0 1.6.8 2.6 1.2 5z" fill="#3ee6ff" stroke="#e9fbff" stroke-width="1"/><path d="M14.2 21 H20" stroke="#ffe14d" stroke-width="1.5" stroke-linecap="round"/></svg>'
  };

  const games = [];
  let hub = null;
  let current = 'home';
  let opened = false;
  let pausedByHub = false;
  let doorAt = 0;
  let crewCh = null;

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svgSpan(html) {
    const s = el('span', 'ghh-svg');
    s.innerHTML = html || ICONS.play;
    return s;
  }
  function readObj(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null || raw === '') return null;
      const o = JSON.parse(raw);
      if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
      return o;
    } catch (e) { return null; }
  }
  function readKid() {
    let raw;
    try { raw = localStorage.getItem(KID_KEY); } catch (e) { return { corrupt: true }; }
    if (raw == null || raw === '') return { missing: true };
    try {
      const sv = JSON.parse(raw);
      if (!sv || typeof sv !== 'object' || Array.isArray(sv)) return { missing: true };
      return { sv: sv };
    } catch (e) { return { corrupt: true }; }
  }
  function defaultSv() {
    return {
      coins: 0, stars: 0, owned: FREE_IDS.slice(), eq: Object.assign({}, DEFAULT_EQ),
      name: "ELLIE'S Z", boxes: 0, ride: 0, bestCombo: 0, best060: null, shifts: 0,
      roadBest: 0, dragBest: null, dragWins: 0
    };
  }
  function syncCar() {
    try {
      if (window.GARAGEZ && typeof GARAGEZ.sync === 'function') { GARAGEZ.sync(); return; }
    } catch (e) {}
    applyTrackColor();
  }
  function hookGarageSync() {
    const gz = window.GARAGEZ;
    if (!gz || gz.__ghhTracks || typeof gz.sync !== 'function') return;
    const orig = gz.sync.bind(gz);
    gz.sync = function () {
      let result;
      try { result = orig(); } finally { applyTrackColor(); }
      return result;
    };
    try { Object.defineProperty(gz, '__ghhTracks', { value: 1 }); } catch (e) {}
  }
  function trackColorFor(id) {
    const item = meta('tracks', id) || meta('tracks', 'tr-match');
    if (!item) return '#3ee6ff';
    if (item.id === 'tr-match') {
      try {
        if (typeof KID !== 'undefined' && KID && typeof KID.glow === 'string' && /^#/.test(KID.glow)) return KID.glow;
      } catch (e) {}
    }
    return item.hex || '#3ee6ff';
  }
  function applyTrackColor() {
    const color = trackColorFor(readEq().tracks || 'tr-match');
    try { if (typeof KID !== 'undefined' && KID) KID.trackColor = color; } catch (e) {}
    try { if (window.KID) window.KID.trackColor = color; } catch (e) {}
    return color;
  }
  function houseKnown(list, id) {
    for (let i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function signText(id) {
    const row = houseKnown(HOUSE_SIGNS, id);
    return row ? row.text : (id ? String(id) : "ELLIE'S Z");
  }
  function houseBool(value, fallback) {
    return typeof value === 'boolean' ? value : fallback;
  }
  function normalizeHouse(src) {
    const base = src && typeof src === 'object' && !Array.isArray(src) ? src : {};
    const items = base.items && typeof base.items === 'object' && !Array.isArray(base.items) ? base.items : {};
    const wallId = base.wall || base.wallTheme || DEFAULT_HOUSE.wall;
    const signId = base.sign || DEFAULT_HOUSE.sign;
    const next = Object.assign({}, base, {
      v: 1,
      wall: houseKnown(HOUSE_WALLS, wallId) ? wallId : DEFAULT_HOUSE.wall,
      sign: houseKnown(HOUSE_SIGNS, signId) ? signId : DEFAULT_HOUSE.sign,
      sofa: houseBool(base.sofa, houseBool(items.sofa, DEFAULT_HOUSE.sofa)),
      arcade: houseBool(base.arcade, houseBool(items.arcade, DEFAULT_HOUSE.arcade)),
      petBed: houseBool(base.petBed, houseBool(items.petBed, DEFAULT_HOUSE.petBed)),
      danceFloor: houseBool(base.danceFloor, houseBool(items.danceFloor, DEFAULT_HOUSE.danceFloor))
    });
    next.wallTheme = next.wall;
    next.neonSign = signText(next.sign);
    next.items = { sofa: !!next.sofa, arcade: !!next.arcade, petBed: !!next.petBed, danceFloor: !!next.danceFloor };
    return next;
  }
  function readHouse() {
    const file = readObj(HOUSE_KEY);
    const got = readKid();
    const fromKid = got.sv && got.sv.house && typeof got.sv.house === 'object' && !Array.isArray(got.sv.house) ? got.sv.house : null;
    return normalizeHouse(Object.assign({}, fromKid || {}, file || {}));
  }
  function publishHouse(next) {
    window.HOUSE_STATE = next;
    try { window.dispatchEvent(new CustomEvent('zdash-house', { detail: next })); } catch (e) {}
    return next;
  }
  function saveHouse(patch) {
    const next = normalizeHouse(Object.assign({}, readHouse(), patch || {}));
    try { localStorage.setItem(HOUSE_KEY, JSON.stringify(next)); } catch (e) {}
    const got = readKid();
    if (!got.corrupt) {
      const sv = got.missing ? defaultSv() : got.sv;
      const prev = sv.house && typeof sv.house === 'object' && !Array.isArray(sv.house) ? sv.house : {};
      sv.house = Object.assign({}, prev, next);
      try { localStorage.setItem(KID_KEY, JSON.stringify(sv)); } catch (e) {}
    }
    publishHouse(next);
    decorateInterior();
    if (opened && current === 'home') render();
    return next;
  }
  function interiorIsHome() {
    let door = null;
    try { door = window.WALK_MODE && (WALK_MODE.insideDoor || WALK_MODE.door); } catch (e) {}
    if (door && door.purpose) return door.purpose === 'HOME';
    const card = document.getElementById('walk-interior');
    const title = card && card.querySelector('[data-k="title"]');
    return !!(card && card.classList.contains('show') && title && /HOME|HOUSE/.test(title.textContent || ''));
  }
  function decorateInterior() {
    const card = document.getElementById('walk-interior');
    if (!card) return;
    let box = document.getElementById('ghh-room');
    if (!interiorIsHome()) {
      if (box) box.hidden = true;
      return;
    }
    const house = readHouse();
    const wall = houseKnown(HOUSE_WALLS, house.wall) || HOUSE_WALLS[0];
    if (!box) {
      box = el('div', 'ghh-room');
      box.id = 'ghh-room';
      const step = card.querySelector('#walk-step-out');
      if (step) card.insertBefore(box, step);
      else card.appendChild(box);
    }
    box.hidden = false;
    box.style.setProperty('--wall', wall.hex);
    box.replaceChildren();
    box.appendChild(el('b', 'ghh-room-sign', house.neonSign || signText(house.sign)));
    const row = el('div', 'ghh-room-items');
    HOUSE_ITEMS.forEach(function (item) {
      if (!house[item.id]) return;
      row.appendChild(el('span', 'ghh-room-item', item.name));
    });
    box.appendChild(row);
    box.appendChild(el('small', '', wall.name + ' WALLS'));
  }
  function watchInterior() {
    const room = document.getElementById('walk-interior');
    if (!room || room.dataset.ghhHouse) return;
    room.dataset.ghhHouse = '1';
    if (window.MutationObserver) {
      new MutationObserver(function () { decorateInterior(); }).observe(room, { attributes: true, attributeFilter: ['class', 'hidden'] });
    }
    decorateInterior();
  }
  function commitEq(patch) {
    const got = readKid();
    if (got.corrupt) { note('Car save left untouched'); return false; }
    const sv = got.missing ? defaultSv() : got.sv;
    if (!sv.eq || typeof sv.eq !== 'object' || Array.isArray(sv.eq)) sv.eq = Object.assign({}, DEFAULT_EQ);
    Object.keys(patch).forEach(function (k) { sv.eq[k] = patch[k]; });
    try { localStorage.setItem(KID_KEY, JSON.stringify(sv)); } catch (e) { return false; }
    syncCar();
    return true;
  }
  function readEq() {
    const got = readKid();
    const eq = got.sv && got.sv.eq && typeof got.sv.eq === 'object' && !Array.isArray(got.sv.eq) ? got.sv.eq : {};
    return Object.assign({}, DEFAULT_EQ, eq);
  }
  function meta(cat, id) {
    const list = CATS[cat] || [];
    for (let i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function unlocked(item) {
    if (!item) return false;
    if (!item.how && !(item.cost > 0)) return true;
    const got = readKid();
    const owned = got.sv && Array.isArray(got.sv.owned) ? got.sv.owned : [];
    return owned.indexOf(item.id) >= 0;
  }
  function labelOf(cat, id) {
    const m = meta(cat, id);
    return m ? m.name : String(id || '—');
  }
  function hexOf(cat, id) {
    const m = meta(cat, id);
    if (m && m.hex) return m.hex;
    try {
      if (cat === 'paint' && typeof KID !== 'undefined' && KID && /^#/.test(String(KID.paint || '')) && window.GARAGEZ && GARAGEZ.id === id) return KID.paint;
    } catch (e) {}
    return '#3ee6ff';
  }

  function hasRec(item) {
    if (!item) return false;
    if (typeof item === 'string') return item.length > 8;
    if (Array.isArray(item)) return item.length > 0;
    if (typeof item !== 'object') return false;
    if (item.deleted || item.empty) return false;
    const frames = item.frames || item.samples || item.clip || item.poses || item.keys || item.track || item.points;
    if (Array.isArray(frames)) return frames.length > 0;
    if (typeof item.count === 'number' && item.count > 0) return true;
    if (item.recorded || item.saved || item.ready) return true;
    if ((item.name || item.title) && (item.duration || item.ms || item.len || item.t)) return true;
    return false;
  }
  function recordedSlots(key) {
    const root = readObj(key);
    const out = [];
    if (!root) return out;
    const bags = [root];
    if (root.slots && typeof root.slots === 'object') bags.push(root.slots);
    if (root.dances && typeof root.dances === 'object') bags.push(root.dances);
    if (root.clips && typeof root.clips === 'object') bags.push(root.clips);
    SLOT_IDS.forEach(function (id, index) {
      let item = null;
      for (let b = 0; b < bags.length; b++) {
        const bag = bags[b];
        if (Array.isArray(bag)) { if (hasRec(bag[index])) item = bag[index]; }
        else if (bag && hasRec(bag[id])) item = bag[id];
      }
      if (!item && index === 0 && !root.slots && !root.slot0 && !root.dances && !root.clips && (Array.isArray(root.frames) || Array.isArray(root.samples))) item = root;
      if (!item) return;
      const name = item && typeof item === 'object' && !Array.isArray(item) ? (item.name || item.title || item.label) : '';
      out.push({ id: id, name: name ? String(name) : ('Camera Dance ' + (index + 1)) });
    });
    return out;
  }
  function frameCount(key) {
    const slots = recordedSlots(key);
    return slots.length;
  }
  function crewNow() {
    return readObj(CREW_KEY) || {};
  }
  function broadcast(crew) {
    try {
      const ch = new BroadcastChannel('zdash-crew');
      ch.postMessage({
        source: 'garage-home-hub',
        charDanceOpt: crew.charDanceOpt || 'default',
        petDanceOpt: crew.petDanceOpt || 'default',
        crew: crew
      });
      ch.close();
    } catch (e) {}
  }
  function mirrorCrew(state) {
    if (state.character === 'woman' || state.character === 'man') {
      const cur = readObj(CHAR_KEY) || { v: 1, gender: 'female', hair: 'ponytail', outfit: '#ff3df2', glow: '#ff3df2' };
      cur.v = 1;
      cur.gender = state.character === 'man' ? 'male' : 'female';
      if (!cur.glow) cur.glow = '#ff3df2';
      cur.outfit = cur.glow;
      try { localStorage.setItem(CHAR_KEY, JSON.stringify(cur)); } catch (e) {}
    }
    if (state.pet && PET_TYPE[state.pet]) {
      const cur = readObj(PET_KEY) || { v: 1, type: 'fox', glow: '#ffb020', spot: 'hatch' };
      const colors = ['#3ee6ff', '#ff3df2', '#7cff4f', '#ffb020', '#ff4d5e', '#b48cff', '#fff04d', '#ffffff'];
      cur.v = 1;
      cur.type = PET_TYPE[state.pet];
      if (colors.indexOf(cur.glow) < 0) cur.glow = '#ffb020';
      try { localStorage.setItem(PET_KEY, JSON.stringify(cur)); } catch (e) {}
    }
    try { if (window.CREW && typeof CREW.reload === 'function') CREW.reload(); } catch (e) {}
  }
  function saveCrew(patch) {
    const cur = readObj(CREW_KEY) || {};
    const next = Object.assign({}, cur, patch);
    if (!next.v) next.v = 1;
    try { localStorage.setItem(CREW_KEY, JSON.stringify(next)); } catch (e) { return cur; }
    window.CREW_STATE = Object.assign(window.CREW_STATE || {}, next);
    mirrorCrew(next);
    broadcast(next);
    return next;
  }
  function crewLabel() {
    const c = crewNow();
    const ch = readObj(CHAR_KEY);
    const pet = readObj(PET_KEY);
    let character = c.character;
    if (!character) character = ch && ch.gender === 'male' ? 'man' : 'woman';
    let petId = c.pet;
    if (!petId) petId = pet && pet.type === 'robo' ? 'dog' : (pet && pet.type ? pet.type : 'fox');
    if (petId === 'robo') petId = 'dog';
    const cn = nameIn(CREW_CHARS, character);
    const pn = nameIn(CREW_PETS, petId);
    return { character: character, pet: petId, characterName: cn, petName: pn, anim: c.anim || 'ride', charDanceOpt: c.charDanceOpt || 'default', petDanceOpt: c.petDanceOpt || 'default' };
  }
  function nameIn(list, id) {
    for (let i = 0; i < list.length; i++) if (list[i][0] === id) return list[i][1];
    return id || '—';
  }

  function note(s) {
    const t = document.getElementById('ghhToast');
    if (t) {
      t.textContent = s;
      t.classList.add('on');
      clearTimeout(note._t);
      note._t = setTimeout(function () { t.classList.remove('on'); }, 1700);
    }
    try { if (typeof kToast === 'function') kToast(s); } catch (e) {}
  }
  function wakeWorld() {
    try { flying = true; } catch (e) {}
    const over = document.getElementById('kOver');
    if (over) over.classList.add('hidden');
    const mb = document.getElementById('kMenuB');
    if (mb) mb.classList.remove('hidden');
    const wr = document.getElementById('kWreck');
    if (wr) wr.classList.add('hidden');
  }
  function goWorld(fn) {
    close();
    try { if (typeof kPause === 'function') kPause(false); } catch (e) {}
    try { paused = false; } catch (e) {}
    wakeWorld();
    try { fn(); } catch (e) { console.error(e); }
  }
  function parkAt(x, z, yaw, street) {
    if (typeof P === 'undefined') return false;
    const spot = snapGround(x, z);
    P.x = spot.x; P.z = spot.z; P.y = spot.y; P.gy = spot.y; P.gT = 1;
    P.v = 0; P.thr = 0; P.vs = 0; P.pitch = 0; P.bank = 0; P.stall = false;
    P.wreck = null; P.ground = true; P.yaw = yaw || 0; P.hd = P.yaw; P.gam = 0;
    P._lv = 0; P._ly = P.y; P.fromSkyDrop = false; P.floating = 0;
    try { if (typeof setWings === 'function') setWings(0, true); } catch (e) {}
    try { if (typeof showWreck === 'function') showWreck(false); } catch (e) {}
    if (street) {
      P.driveMode = 'street';
      try { if (typeof setDriveMode === 'function') setDriveMode('street', true); } catch (e) {}
    }
    return true;
  }
  function snapGround(x, z) {
    try {
      if (typeof CITY !== 'undefined' && CITY.probe) {
        const pr = CITY.probe(x, z, 1.2);
        if (pr && pr.wl) {
          const tries = [[8, 0], [-8, 0], [0, 8], [0, -8], [14, 0], [-14, 0], [0, 14], [0, -14]];
          for (let i = 0; i < tries.length; i++) {
            const p2 = CITY.probe(x + tries[i][0], z + tries[i][1], 1.2);
            if (p2 && !p2.wl) return { x: x + tries[i][0], z: z + tries[i][1], y: p2.fl || 0 };
          }
        }
        if (pr && isFinite(pr.fl)) return { x: x, z: z, y: pr.fl || 0 };
      }
    } catch (e) {}
    return { x: x, z: z, y: 0 };
  }
  function applySkyDrop() {
    const y = 320;
    const pitch = -28 * Math.PI / 180;
    P.x = 180; P.z = 520; P.y = y;
    P.v = 42; P.ground = false; P.wings = 0; P.tf = 0;
    P.yaw = -0.25; P.hd = P.yaw; P.pitch = pitch; P.gam = pitch; P.bank = 0;
    P.vs = P.v * Math.sin(pitch);
    P._lv = P.v; P._ly = P.y; P.fromSkyDrop = true; P.stall = false; P.wreck = null;
    P.nosTank = 1; P.driveMode = 'arcade'; P.floating = 0;
    try { if (typeof setWings === 'function') setWings(0, true); } catch (e) {}
    try { if (typeof setDriveMode === 'function') setDriveMode('arcade', true); } catch (e) {}
    try { if (typeof VP !== 'undefined') VP.cp = null; } catch (e) {}
  }
  function startSkyDrop() {
    if (typeof P === 'undefined') { location.assign('world-split.html?entry=skydrop'); return; }
    goWorld(function () {
      let ran = false;
      try {
        if (window.SKY_DROP && typeof SKY_DROP.start === 'function') { SKY_DROP.start(); ran = true; }
      } catch (e) {}
      if (!ran || !(P.y > 200)) applySkyDrop();
      else {
        P.nosTank = 1; P.fromSkyDrop = true; P.driveMode = 'arcade';
        try { if (typeof setDriveMode === 'function') setDriveMode('arcade', true); } catch (e) {}
      }
      note('SKY DROP · 320 M');
    });
  }
  function startStreet() {
    if (typeof P === 'undefined') { location.assign('world-split.html?entry=street'); return; }
    goWorld(function () {
      const dt = (typeof CITY !== 'undefined' && CITY.DT) ? CITY.DT : { x: 420, z: 1250 };
      parkAt(dt.x > 200 ? 450 : dt.x, 1250, 0, true);
      P.driveMode = 'street';
      try { if (typeof setDriveMode === 'function') setDriveMode('street', true); } catch (e) {}
      try { if (window.WALK_MODE && typeof WALK_MODE.exitDoor === 'function') WALK_MODE.exitDoor(); } catch (e) {}
      note('STREET CRUISE · 62 MPH');
    });
  }
  function buildingText(b) {
    if (!b || typeof b !== 'object') return '';
    const bits = [b.kind, b.prefab, b.nm, b.name, b.label, b.use, b.type];
    if (b.p) bits.push(b.p.nm, b.p.name, b.p.t, b.p.kind, b.p.use);
    if (Array.isArray(b.deco)) {
      b.deco.forEach(function (d) {
        if (!d) return;
        if (d[0] === 'sign') bits.push(typeof d[1] === 'string' ? d[1] : (d[1] && d[1].t));
      });
    }
    return bits.filter(function (x) { return x != null && x !== ''; }).join(' ').toUpperCase();
  }
  function standOutside(b) {
    if (b && b.doors && b.doors[0]) {
      const d = b.doors[0];
      const nx = d[2] || 0, nz = d[3] || 0;
      return { x: d[0] + nx * 3.4, z: d[1] + nz * 3.4, yaw: Math.atan2(-nx, -nz) };
    }
    const box = (b && b.boxes && b.boxes[0]) || b || {};
    if (isFinite(box.x0) && isFinite(box.z0)) return { x: (box.x0 + box.x1) / 2, z: box.z0 - 4.5, yaw: 0 };
    if (isFinite(b.cx)) return { x: b.cx, z: (b.cz || 0) - 6, yaw: 0 };
    return null;
  }
  function findBuilding(re) {
    if (typeof CITY === 'undefined' || !CITY.BL) return null;
    for (let i = 0; i < CITY.BL.length; i++) {
      if (re.test(buildingText(CITY.BL[i]))) return CITY.BL[i];
    }
    return null;
  }
  function wallSpot() {
    const api = window.ARTS_WALL || window.GRAFFITI_WALL || (window.NEON_PAINT && (NEON_PAINT.wall || NEON_PAINT.wallSpot));
    if (api && isFinite(api.x) && isFinite(api.z)) return { x: api.x, z: api.z, yaw: isFinite(api.yaw) ? api.yaw : 0 };
    const named = findBuilding(/GRAFFITI|Z COMPANY|Z-COMPANY|ARTS/);
    const dance = named || findBuilding(/DANCE/);
    const stood = dance ? standOutside(dance) : null;
    if (stood) return stood;
    return { x: 450, z: 1100, yaw: Math.PI / 2 };
  }
  function viewWall() {
    if (typeof P === 'undefined') { location.assign('world-split.html?entry=wall'); return; }
    goWorld(function () {
      const s = wallSpot();
      parkAt(s.x, s.z, s.yaw || 0, true);
      P.driveMode = 'street';
      try { if (typeof setDriveMode === 'function') setDriveMode('street', true); } catch (e) {}
      note('Z COMPANY ARTS WALL');
    });
  }
  function openPaintStudio(mode) {
    try {
      if (window.NEON_PAINT && typeof NEON_PAINT.openStudio === 'function') {
        if (mode) NEON_PAINT.openStudio(mode);
        else NEON_PAINT.openStudio();
        return;
      }
    } catch (e) {}
    location.assign(mode ? 'neon-paint.html?mode=' + encodeURIComponent(mode) : 'neon-paint.html');
  }
  function openDance(mode) {
    const D = window.DANCE_STAGE;
    try {
      if (D) {
        if (mode === 'char' && typeof D.recordCharacter === 'function') return D.recordCharacter();
        if (mode === 'dog' && typeof D.recordDog === 'function') return D.recordDog();
        if (mode === 'char' && typeof D.record === 'function') return D.record('character');
        if (mode === 'dog' && typeof D.record === 'function') return D.record('dog');
        if (typeof D.open === 'function') return D.open(mode ? { record: mode } : undefined);
      }
    } catch (e) {}
    const q = mode === 'char' ? '?record=character' : mode === 'dog' ? '?record=dog' : '';
    location.assign('dance-stage.html' + q);
  }
  function playSoccer() {
    if (typeof P === 'undefined') { location.assign('world-split.html'); return; }
    goWorld(function () {
      parkAt(660, 300, Math.PI / 2, true);
      try {
        if (window.SOCCER && typeof SOCCER.resetMatch === 'function') SOCCER.resetMatch();
        else if (window.SOCCER && typeof SOCCER.reset === 'function') SOCCER.reset();
      } catch (e) {}
      note('CAR SOCCER DOME');
    });
  }
  function playCity() {
    if (typeof P === 'undefined') { location.assign('world-split.html'); return; }
    goWorld(function () {
      parkAt(0, 1920, 0, true);
      try { if (window.BUILDER && typeof BUILDER.open === 'function') BUILDER.open(); } catch (e) {}
      note('CITY BUILDER');
    });
  }
  function playStunt() {
    if (typeof P === 'undefined') { location.assign('world-split.html'); return; }
    goWorld(function () {
      let x = 120, z = 640;
      try {
        if (typeof CITY !== 'undefined' && CITY.HOOPS && CITY.HOOPS[0]) { x = CITY.HOOPS[0].x; z = CITY.HOOPS[0].z; }
      } catch (e) {}
      parkAt(x, z + 12, 0, false);
      P.driveMode = 'arcade';
      P.nosTank = 1;
      try { if (typeof setDriveMode === 'function') setDriveMode('arcade', true); } catch (e) {}
      note('ROOFTOP STUNT RUN');
    });
  }
  function playTakeover() {
    if (typeof P === 'undefined') { location.assign('world-split.html'); return; }
    goWorld(function () {
      parkAt(450, 1100, 0, true);
      try { if (window.TRAFFIC && typeof TRAFFIC.ensure === 'function') TRAFFIC.ensure(); } catch (e) {}
      try {
        if (window.TAKEOVER && typeof TAKEOVER.start === 'function') TAKEOVER.start();
        else if (window.Z_TAKEOVER && typeof Z_TAKEOVER.start === 'function') Z_TAKEOVER.start();
      } catch (e) {}
      note('Z TAKEOVER');
    });
  }
  function driveHomePad() {
    if (typeof P === 'undefined') { location.assign('world-split.html?entry=street'); return; }
    goWorld(function () {
      const g = findBuilding(/GARAGE/);
      const s = (g && standOutside(g)) || { x: 250, z: 100, yaw: 0 };
      parkAt(s.x, s.z, s.yaw || 0, true);
      note("ELLIE'S GARAGE");
    });
  }

  function normalizeGame(def) {
    if (!def || typeof def !== 'object') return null;
    const id = String(def.id || '').trim();
    if (!id) return null;
    const modes = Array.isArray(def.modes) ? def.modes.filter(function (m) { return m && m.id && typeof m.onPlay === 'function'; }).map(function (m) {
      return { id: String(m.id), label: String(m.label || m.id), onPlay: m.onPlay };
    }) : null;
    return {
      id: id,
      title: String(def.title || id),
      subtitle: String(def.subtitle || ''),
      iconSvg: typeof def.iconSvg === 'string' ? def.iconSvg : ICONS.world,
      color: def.color || '#3ee6ff',
      badge: def.badge ? String(def.badge) : '',
      onPlay: typeof def.onPlay === 'function' ? def.onPlay : null,
      onDrive: typeof def.onDrive === 'function' ? def.onDrive : null,
      driveLabel: def.driveLabel ? String(def.driveLabel) : '',
      doorPurpose: def.doorPurpose ? String(def.doorPurpose) : '',
      hero: !!def.hero,
      modes: modes && modes.length ? modes : null
    };
  }
  function registerGame(def) {
    const row = normalizeGame(def);
    if (!row) return null;
    const i = games.findIndex(function (g) { return g.id === row.id; });
    if (i >= 0) games[i] = row;
    else Array.prototype.push.call(games, row);
    paintGrids();
    return row;
  }
  function gameCard(game) {
    const card = el('article', 'ghh-card' + (game.hero ? ' hero' : ''));
    card.dataset.game = game.id;
    card.style.setProperty('--ghh', game.color || '#3ee6ff');
    card.appendChild(svgSpan(game.iconSvg));
    const text = el('div', 'ghh-card-text');
    text.appendChild(el('b', '', game.title));
    text.appendChild(el('small', '', game.subtitle));
    if (game.badge) text.appendChild(el('em', '', game.badge));
    card.appendChild(text);
    const acts = el('div', 'ghh-acts');
    if (game.modes) {
      game.modes.forEach(function (m) {
        const b = el('button', '', m.label);
        b.type = 'button';
        b.dataset.ghhMode = m.id;
        b.dataset.ghhGame = game.id;
        acts.appendChild(b);
      });
    } else if (game.onPlay) {
      const b = el('button', '', '▶ PLAY');
      b.type = 'button';
      b.dataset.ghhPlay = game.id;
      acts.appendChild(b);
    }
    if (game.onDrive) {
      const b = el('button', 'ghh-mini', game.driveLabel || (game.doorPurpose === 'wall' ? '📍 VIEW WALL IN CITY' : '📍 DRIVE THERE'));
      b.type = 'button';
      b.dataset.ghhDrive = game.id;
      acts.appendChild(b);
    }
    card.appendChild(acts);
    return card;
  }
  function paintGrids() {
    document.querySelectorAll('[data-ghh-grid]').forEach(function (host) {
      const mode = host.getAttribute('data-ghh-grid');
      const list = mode === 'studio' ? games.filter(function (g) { return g.id === 'neon-paint' || g.id === 'arts-wall'; }) : games;
      host.replaceChildren();
      list.forEach(function (g) { host.appendChild(gameCard(g)); });
    });
  }
  function goJr(tab) {
    const hashTabs = { garage: 'garage', car: 'car', road: 'road', drag: 'drag', wanted: 'wanted', boost: 'boost', drive: 'drive', ride: 'boost' };
    if (tab === 'home' || tab === 'menu') { location.assign('jr.html?kmenu=1'); return; }
    const h = hashTabs[tab];
    if (h) location.assign('jr.html#' + h);
    else location.assign('jr.html?ktab=' + encodeURIComponent(tab || 'drive'));
  }
  function installGames() {
    registerGame({
      id: 'car',
      title: 'SHOWROOM CAR',
      subtitle: 'spin your Z',
      badge: 'CAR',
      color: '#3ee6ff',
      iconSvg: ICONS.car,
      onPlay: function () { goJr('car'); }
    });
    registerGame({
      id: 'road',
      title: 'ROAD',
      subtitle: 'coins & ramps',
      badge: 'ROAD',
      color: '#7dff6b',
      iconSvg: ICONS.road,
      onPlay: function () { goJr('road'); }
    });
    registerGame({
      id: 'drag',
      title: 'DRAG',
      subtitle: 'race a rival',
      badge: 'DRAG',
      color: '#ffe14d',
      iconSvg: ICONS.drag,
      onPlay: function () { goJr('drag'); }
    });
    registerGame({
      id: 'fly',
      title: 'NEON FLYING',
      subtitle: 'take to the sky',
      badge: 'FLY',
      color: '#3ee6ff',
      iconSvg: ICONS.fly,
      onPlay: function () { location.assign('fly3.html'); }
    });
    registerGame({
      id: 'world',
      title: 'NEON WORLD',
      subtitle: 'fly & drive 3D city',
      badge: 'CITY',
      color: '#ff4fd8',
      iconSvg: ICONS.world,
      onPlay: function () { location.assign('world.html'); }
    });
    registerGame({
      id: 'garage',
      title: 'GARAGE',
      subtitle: 'paint & parts',
      badge: 'LOOK',
      color: '#ffb020',
      iconSvg: ICONS.garage,
      onPlay: function () { location.assign('jr.html#garage'); }
    });
    registerGame({
      id: 'wanted',
      title: 'WANTED',
      subtitle: '1.0 + Z TAKEOVER',
      badge: 'WANTED',
      color: '#ff2a3d',
      iconSvg: ICONS.chase,
      onPlay: function () { goJr('wanted'); }
    });
    registerGame({
      id: 'boost',
      title: 'RIDE ALONG',
      subtitle: 'shift + BOOST',
      badge: 'RIDE',
      color: '#ff4fd8',
      iconSvg: ICONS.ride,
      onPlay: function () { goJr('boost'); }
    });
    registerGame({
      id: 'soccer',
      title: 'CAR SOCCER',
      subtitle: 'stadium arena match',
      badge: 'MATCH',
      color: '#7dff6b',
      iconSvg: ICONS.ball,
      onPlay: playSoccer
    });
    registerGame({
      id: 'skydrop',
      title: 'SKY DROP',
      subtitle: 'drop 320m over city',
      badge: 'SKY',
      color: '#3ee6ff',
      iconSvg: ICONS.sky,
      onPlay: startSkyDrop
    });
    registerGame({
      id: 'paint',
      title: 'NEON PAINT',
      subtitle: 'draw on your 3D Z',
      badge: 'DECALS',
      color: '#ffe14d',
      iconSvg: ICONS.paint,
      onPlay: function () { openPaintStudio(); }
    });
    registerGame({
      id: 'wall',
      title: 'GRAFFITI WALL',
      subtitle: 'Z Co Arts 3D sign',
      badge: 'DRAW',
      color: '#ff4fd8',
      iconSvg: ICONS.wall,
      onPlay: function () { openPaintStudio('wall'); }
    });
    registerGame({
      id: 'dance',
      title: 'RECORD DANCE',
      subtitle: 'Z Co Arts mo-cap',
      badge: 'DANCE',
      color: '#ff4fd8',
      iconSvg: ICONS.dance,
      onPlay: function () { openDance('char'); }
    });
    registerGame({
      id: 'petdance',
      title: 'RECORD MY PET',
      subtitle: 'pet camera dance',
      badge: 'PET',
      color: '#ffe14d',
      iconSvg: ICONS.pet,
      onPlay: function () { openDance('dog'); }
    });
    registerGame({
      id: 'crew',
      title: 'CREW & PETS',
      subtitle: 'characters & pets',
      badge: 'CREW',
      color: '#b48cff',
      iconSvg: ICONS.crew,
      onPlay: function () { location.assign('crew.html'); }
    });
  }

  function dress(btn, icon, label) {
    const first = btn.firstElementChild;
    if (first && first.classList.contains('ghh-svg') && btn.dataset.ghhIcon === icon) {
      if (label == null) return;
      const have = btn.querySelector('.ghh-lbl');
      if (have && have.textContent === label) return;
    }
    const live = btn.querySelector('.ghh-lbl');
    const text = label != null ? label : String((live ? live.textContent : btn.textContent) || '').replace(/\s+/g, ' ').trim();
    btn.dataset.ghhIcon = icon;
    const ico = svgSpan(ICONS[icon] || ICONS.play);
    const lbl = el('span', 'ghh-lbl', text);
    btn.replaceChildren(ico, lbl);
  }
  function dressMenu() {
    const home = document.getElementById('kHome');
    if (!home || home.dataset.ghhReady === '1') return;
    home.dataset.ghhReady = '1';
    home.classList.add('ghh-ready');
    const labels = { resume: 'RESUME', home: 'HOME / MAIN MENU', recal: 'TILT CENTER', full: 'FULLSCREEN', runway: 'BACK TO RUNWAY', skydrop: 'SKY DROP' };
    const icons = { resume: 'play', home: 'exit', recal: 'tilt', full: 'full', runway: 'runway', skydrop: 'sky', xray: 'eye' };
    home.querySelectorAll('button[data-m]').forEach(function (btn) {
      const key = btn.dataset.m;
      if (!icons[key]) return;
      dress(btn, icons[key], key === 'xray' ? null : labels[key]);
    });
    const xb = home.querySelector('[data-m="xray"]');
    if (xb && window.MutationObserver) {
      new MutationObserver(function () { dress(xb, 'eye'); }).observe(xb, { childList: true, characterData: true, subtree: true });
    }
    const anchor = home.querySelector('#kPzRow') || home.firstChild;
    const wrap = el('section', 'ghh-wrap');
    wrap.id = 'kGamesWrap';
    wrap.appendChild(el('div', 'ghh-kicker', 'GAMES'));
    const grid = el('div', 'ghh-grid');
    grid.id = 'kGameGrid';
    grid.setAttribute('data-ghh-grid', 'all');
    wrap.appendChild(grid);
    home.insertBefore(wrap, anchor);
  }

  function picks(parent, list, currentId, attr, extra) {
    const row = el('div', 'ghh-picks');
    list.forEach(function (pair) {
      const id = pair[0], name = pair[1];
      const b = el('button', 'ghh-pick' + (id === currentId ? ' on' : ''), name);
      b.type = 'button';
      b.dataset[attr] = id;
      if (extra) b.dataset[extra] = id;
      row.appendChild(b);
    });
    parent.appendChild(row);
    return row;
  }
  function danceBlock(which) {
    const wrap = el('section', 'ghh-block');
    const char = which === 'char';
    wrap.appendChild(el('h3', '', char ? '💃 CHARACTER DANCE OPTION' : "🐾 MY PET'S DANCE OPTION"));
    wrap.appendChild(el('p', 'ghh-note', char
      ? 'Classic Groove, or a dance you recorded with the camera.'
      : 'Plays on the companion already with you — dog, cat, bunny, dragon, or fox. A recorded dance never adds a second pet.'));
    const saved = crewNow();
    const cur = (char ? saved.charDanceOpt : saved.petDanceOpt) || 'default';
    const slots = recordedSlots(char ? DANCE_KEY : PETDANCE_KEY);
    const row = el('div', 'ghh-picks');
    const opts = [{ id: 'default', name: char ? '✨ Classic Groove' : '✨ Signature Pet Dance' }].concat(slots);
    opts.forEach(function (o) {
      const b = el('button', 'ghh-pick' + (o.id === cur ? ' on' : ''), o.id === 'default' ? o.name : (o.name + ' · ' + o.id));
      b.type = 'button';
      b.dataset.ghhDance = which;
      b.dataset.ghhOpt = o.id;
      row.appendChild(b);
    });
    wrap.appendChild(row);
    if (cur !== 'default' && !opts.some(function (o) { return o.id === cur; })) {
      wrap.appendChild(el('p', 'ghh-note', 'Saved option ' + cur + ' has no recording on this device yet.'));
    }
    const rec = el('button', 'ghh-go', char ? '+ Record New Character Dance' : '+ Record New Pet Dance');
    rec.type = 'button';
    rec.dataset.ghhRec = char ? 'char' : 'dog';
    wrap.appendChild(rec);
    return wrap;
  }
  function statusCards(parent) {
    const eq = readEq();
    const crew = crewLabel();
    const paintN = frameCount(PAINT_KEY);
    const paint = readObj(PAINT_KEY);
    const stage = readObj(STAGE_KEY);
    const rank = stage ? (stage.rank || stage.stage || stage.best || stage.title || 'Unranked') : 'No rank yet';
    const cards = [
      ['370Z GARAGE LOOK', labelOf('paint', eq.paint) + ' · ' + labelOf('wheels', eq.wheels) + ' · ' + (eq.spoiler || 'none') + ' · ' + labelOf('underglow', eq.underglow), hexOf('paint', eq.paint)],
      ['NEON CREW & PET', crew.characterName + ' + ' + crew.petName, '#b48cff'],
      ['CAMERA DANCES', 'Character ' + (crew.charDanceOpt || 'default') + ' · Pet ' + (crew.petDanceOpt || 'default') + ' · Rank ' + rank, '#ff4fd8'],
      ['NEON PAINT DECALS', (paint && paint.on === false ? 'Off' : 'On') + ' · slot ' + ((paint && (paint.slot || paint.active)) || 1) + ' · ' + paintN + ' camera slot' + (paintN === 1 ? '' : 's'), '#ffe14d']
    ];
    const grid = el('div', 'ghh-stats');
    cards.forEach(function (c) {
      const card = el('article', 'ghh-stat');
      const sw = el('i', 'ghh-swatch');
      sw.style.background = c[2];
      card.appendChild(sw);
      const t = el('div');
      t.appendChild(el('b', '', c[0]));
      t.appendChild(el('small', '', c[1]));
      card.appendChild(t);
      grid.appendChild(card);
    });
    parent.appendChild(grid);
  }
  function catRow(parent, cat, title) {
    parent.appendChild(el('h3', '', title));
    const eq = readEq();
    const row = el('div', 'ghh-picks');
    (CATS[cat] || []).forEach(function (item) {
      const on = eq[cat] === item.id;
      const ok = unlocked(item);
      const b = el('button', 'ghh-pick' + (on ? ' on' : '') + (ok ? '' : ' lock'), (ok ? '' : '🔒 ') + item.name);
      b.type = 'button';
      b.dataset.ghhEq = cat;
      b.dataset.ghhVal = item.id;
      if (item.hex) b.style.setProperty('--chip', item.hex);
      if (!ok) b.setAttribute('aria-disabled', 'true');
      row.appendChild(b);
    });
    parent.appendChild(row);
  }
  function renderHome(body) {
    body.appendChild(el('h2', 'ghh-hi', 'HI, ELLIE — WELCOME HOME'));
    body.appendChild(el('div', 'ghh-kicker', 'NEON WORLD GAMES'));
    const grid = el('div', 'ghh-grid');
    grid.setAttribute('data-ghh-grid', 'all');
    body.appendChild(grid);
    statusCards(body);
    renderHouse(body);
  }
  function renderHouse(body) {
    const house = readHouse();
    const block = el('section', 'ghh-block');
    block.appendChild(el('h3', '', "🏠 ELLIE'S HOUSE"));
    block.appendChild(el('p', 'ghh-note', 'These choices are saved on this device. When Ellie walks into a HOME building, the wall, neon sign, and furniture show up in her room.'));
    block.appendChild(el('h3', '', 'WALL THEME'));
    const walls = el('div', 'ghh-picks');
    HOUSE_WALLS.forEach(function (w) {
      const b = el('button', 'ghh-pick' + (house.wall === w.id ? ' on' : ''), w.name);
      b.type = 'button';
      b.dataset.ghhWall = w.id;
      b.style.setProperty('--chip', w.hex);
      walls.appendChild(b);
    });
    block.appendChild(walls);
    block.appendChild(el('h3', '', 'NEON SIGN'));
    const signs = el('div', 'ghh-picks');
    HOUSE_SIGNS.forEach(function (s) {
      const b = el('button', 'ghh-pick' + (house.sign === s.id ? ' on' : ''), s.name);
      b.type = 'button';
      b.dataset.ghhSign = s.id;
      signs.appendChild(b);
    });
    block.appendChild(signs);
    block.appendChild(el('h3', '', 'ROOM ITEMS'));
    const items = el('div', 'ghh-picks');
    HOUSE_ITEMS.forEach(function (item) {
      const on = !!house[item.id];
      const b = el('button', 'ghh-pick' + (on ? ' on' : ''), (on ? '' : '＋ ') + item.name);
      b.type = 'button';
      b.dataset.ghhItem = item.id;
      items.appendChild(b);
    });
    block.appendChild(items);
    body.appendChild(block);
  }
  function renderGarage(body) {
    const eq = readEq();
    body.appendChild(el('h2', '', 'GARAGE Z'));
    body.appendChild(el('p', 'ghh-note', 'Changes write only the equipped look. Coins, stars, and owned parts stay as they are. The 370Z updates through Garage Z sync.'));
    const look = el('div', 'ghh-look');
    const sw = el('i', 'ghh-swatch big');
    sw.style.background = hexOf('paint', eq.paint);
    look.appendChild(sw);
    const lines = el('div');
    lines.appendChild(el('b', '', labelOf('paint', eq.paint)));
    lines.appendChild(el('small', '', 'Rims ' + (eq.rims || 'gtx04') + ' · Wheels ' + labelOf('wheels', eq.wheels) + ' · Spoiler ' + labelOf('spoiler', eq.spoiler)));
    lines.appendChild(el('small', '', 'Windows ' + labelOf('windows', eq.windows) + ' · Underglow ' + labelOf('underglow', eq.underglow) + ' · Caliper ' + (eq.caliper || 'cal-red')));
    lines.appendChild(el('small', '', 'Track marks ' + labelOf('tracks', eq.tracks)));
    look.appendChild(lines);
    body.appendChild(look);
    body.appendChild(el('h3', '', 'QUICK PRESETS'));
    const presets = el('div', 'ghh-picks');
    PRESETS.forEach(function (p) {
      const b = el('button', 'ghh-pick', p.name);
      b.type = 'button';
      b.dataset.ghhPreset = p.id;
      presets.appendChild(b);
    });
    body.appendChild(presets);
    catRow(body, 'paint', 'PAINT');
    catRow(body, 'wheels', 'WHEEL COLOR');
    catRow(body, 'spoiler', 'SPOILER');
    catRow(body, 'windows', 'WINDOWS');
    catRow(body, 'underglow', 'UNDERGLOW');
    catRow(body, 'tracks', 'TRACK MARKS');
    const jr = el('a', 'ghh-go', 'OPEN FULL Z-DASH JR GARAGE ›');
    jr.href = 'jr.html#garage';
    body.appendChild(jr);
  }
  function renderPaint(body) {
    const saved = readObj(PAINT_KEY) || {};
    const slot = Number(saved.slot || saved.active || 1) || 1;
    const on = saved.on !== false && saved.enabled !== false;
    body.appendChild(el('h2', '', 'NEON PAINT'));
    body.appendChild(el('p', 'ghh-note', 'Decals on the 370Z, and a graffiti wall that becomes the side of Z Company Arts.'));
    body.appendChild(el('p', '', (on ? 'Decals ON' : 'Decals OFF') + ' · Slot ' + slot));
    const toggles = el('div', 'ghh-picks');
    [['on', on ? 'DECALS ON' : 'TURN DECALS ON'], ['off', on ? 'TURN DECALS OFF' : 'DECALS OFF']].forEach(function (pair) {
      const b = el('button', 'ghh-pick' + ((pair[0] === 'on' && on) || (pair[0] === 'off' && !on) ? ' on' : ''), pair[1]);
      b.type = 'button';
      b.dataset.ghhPaintOn = pair[0];
      toggles.appendChild(b);
    });
    [1, 2, 3].forEach(function (n) {
      const b = el('button', 'ghh-pick' + (slot === n ? ' on' : ''), 'Slot ' + n);
      b.type = 'button';
      b.dataset.ghhSlot = String(n);
      toggles.appendChild(b);
    });
    body.appendChild(toggles);
    const launch = el('button', 'ghh-go', '🎨 LAUNCH 3D NEON PAINT STUDIO');
    launch.type = 'button';
    launch.dataset.ghhStudio = 'car';
    body.appendChild(launch);
    body.appendChild(el('h3', '', 'Z COMPANY ARTS GRAFFITI WALL'));
    const studio = el('div', 'ghh-grid');
    studio.setAttribute('data-ghh-grid', 'studio');
    body.appendChild(studio);
  }
  function renderArts(body) {
    const stage = readObj(STAGE_KEY);
    const rank = stage ? (stage.rank || stage.stage || stage.best || 'Unranked') : 'No rank yet';
    body.appendChild(el('h2', '', 'Z COMPANY ARTS'));
    body.appendChild(el('p', 'ghh-note', 'Stage rank ' + rank + '. Character recordings: ' + recordedSlots(DANCE_KEY).length + '. Pet recordings: ' + recordedSlots(PETDANCE_KEY).length + '.'));
    const go = el('button', 'ghh-go', '💃 ENTER Z COMPANY ARTS STAGE (PUT PHONE DOWN & DANCE)');
    go.type = 'button';
    go.dataset.ghhRec = 'stage';
    body.appendChild(go);
    const recC = el('button', 'ghh-go alt', '📹 RECORD CHARACTER DANCE WITH CAMERA');
    recC.type = 'button';
    recC.dataset.ghhRec = 'char';
    body.appendChild(recC);
    const recD = el('button', 'ghh-go alt', "🐶 RECORD YOUR DOG'S DANCE WITH CAMERA");
    recD.type = 'button';
    recD.dataset.ghhRec = 'dog';
    body.appendChild(recD);
    body.appendChild(danceBlock('char'));
    body.appendChild(danceBlock('pet'));
  }
  function renderCrew(body) {
    const view = crewLabel();
    body.appendChild(el('h2', '', 'CREW & PETS'));
    body.appendChild(el('p', 'ghh-note', 'Neon Woman or Neon Man, plus the one companion who rides, walks, and dances with Ellie.'));
    body.appendChild(el('h3', '', 'CHARACTER'));
    picks(body, CREW_CHARS, view.character, 'ghhChar');
    body.appendChild(el('h3', '', 'COMPANION PET'));
    picks(body, CREW_PETS, view.pet, 'ghhPet');
    body.appendChild(el('h3', '', 'MOVE'));
    picks(body, CREW_ANIMS, view.anim, 'ghhAnim');
    body.appendChild(danceBlock('char'));
    body.appendChild(danceBlock('pet'));
    const walk = el('button', 'ghh-go alt', '🚶 STEP OUT ON FOOT');
    walk.type = 'button';
    walk.dataset.ghhFoot = '1';
    body.appendChild(walk);
  }
  function render() {
    if (!hub) return;
    hub.querySelectorAll('[data-ghh-tab]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.ghhTab === current);
      b.setAttribute('aria-selected', b.dataset.ghhTab === current ? 'true' : 'false');
    });
    const body = hub.querySelector('#ghhBody');
    body.replaceChildren();
    if (current === 'garage') renderGarage(body);
    else if (current === 'paint') renderPaint(body);
    else if (current === 'arts') renderArts(body);
    else if (current === 'crew') renderCrew(body);
    else renderHome(body);
    paintGrids();
  }
  function ensureHub() {
    if (hub) return hub;
    hub = el('section', 'ghh ghh-hide');
    hub.id = 'ghh';
    hub.setAttribute('role', 'dialog');
    hub.setAttribute('aria-modal', 'true');
    hub.setAttribute('aria-label', 'Garage and Home Hub');
    hub.setAttribute('aria-hidden', 'true');
    const head = el('header', 'ghh-head');
    head.appendChild(svgSpan(ICONS.garage));
    const titles = el('div');
    titles.appendChild(el('strong', '', 'GARAGE & HOME HUB'));
    titles.appendChild(el('small', '', "Ellie's city, car, crew, and games"));
    head.appendChild(titles);
    const x = el('button', 'ghh-x', '✕');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close hub');
    x.dataset.ghhClose = '1';
    head.appendChild(x);
    hub.appendChild(head);
    const tabs = el('nav', 'ghh-tabs');
    [['home', '🏠 HOME PAD'], ['garage', '🚗 GARAGE Z'], ['paint', '🎨 NEON PAINT'], ['arts', '💃 Z COMPANY ARTS'], ['crew', '🐾 CREW & PETS']].forEach(function (pair) {
      const b = el('button', '', pair[1]);
      b.type = 'button';
      b.dataset.ghhTab = pair[0];
      b.setAttribute('aria-label', pair[1]);
      tabs.appendChild(b);
    });
    hub.appendChild(tabs);
    hub.appendChild(el('div', 'ghh-body', ''));
    hub.querySelector('.ghh-body').id = 'ghhBody';
    const toast = el('div', 'ghh-toast');
    toast.id = 'ghhToast';
    hub.appendChild(toast);
    document.body.appendChild(hub);
    return hub;
  }
  function tabName(tab) {
    const t = String(tab || 'home');
    if (t === 'garage' || t === 'paint' || t === 'arts' || t === 'crew' || t === 'home') return t;
    if (t === 'wall') return 'paint';
    return 'home';
  }
  function holdPhysics() {
    let was = false;
    try { was = !!paused; } catch (e) { return; }
    if (!was) { try { paused = true; pausedByHub = true; } catch (e) {} }
  }
  function releasePhysics() {
    if (!pausedByHub) return;
    pausedByHub = false;
    const menu = document.getElementById('kHome');
    if (!(menu && !menu.classList.contains('hidden'))) { try { paused = false; } catch (e) {} }
  }
  function isOpen() { return opened; }
  function open() {
    syncCar();
    location.assign('jr.html#garage');
  }
  function close() {
    opened = false;
    const stray = document.getElementById('ghh');
    if (stray) stray.remove();
    document.getElementById('ghhPill') && document.getElementById('ghhPill').remove();
    document.getElementById('ghhOpen') && document.getElementById('ghhOpen').remove();
    releasePhysics();
  }
  function toggle() { close(); }

  function onEq(cat, id) {
    const item = meta(cat, id);
    if (!item) return;
    if (!unlocked(item)) { note('Locked — earn it in Z-DASH JR'); return; }
    if (commitEq((function () { const p = {}; p[cat] = id; return p; })())) {
      note(item.name + ' ON THE Z');
      if (opened) render();
    }
  }
  function onPreset(id) {
    const preset = PRESETS.filter(function (p) { return p.id === id; })[0];
    if (!preset) return;
    const patch = {};
    Object.keys(preset.eq).forEach(function (k) {
      const item = meta(k, preset.eq[k]);
      if (item && !unlocked(item)) return;
      if (!item && k !== 'rims' && k !== 'caliper') return;
      patch[k] = preset.eq[k];
    });
    if (!Object.keys(patch).length) { note('Preset parts are still locked'); return; }
    if (commitEq(patch)) { note(preset.name); if (opened) render(); }
  }
  function onDance(which, id) {
    if (DANCE_IDS.indexOf(id) < 0) return;
    const patch = which === 'char' ? { charDanceOpt: id } : { petDanceOpt: id };
    saveCrew(patch);
    note(which === 'char' ? 'Character dance set' : "Pet dance set");
    if (opened) render();
  }
  function writePaint(patch) {
    const cur = readObj(PAINT_KEY) || { v: 1, on: true, slot: 1, slots: { 1: [], 2: [], 3: [] } };
    const next = Object.assign({}, cur, patch);
    if (!next.v) next.v = 1;
    try { localStorage.setItem(PAINT_KEY, JSON.stringify(next)); } catch (e) {}
    if (opened) render();
  }
  function onClick(e) {
    const t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    const mainB = t.closest('[data-m="home"]');
    if (mainB && document.getElementById('kHome') && document.getElementById('kHome').contains(mainB)) {
      e.preventDefault();
      e.stopPropagation();
      location.assign('jr.html?kmenu=1');
      return;
    }
    const openB = t.closest('[data-ghh-open]');
    const closeB = t.closest('[data-ghh-close]');
    const tabB = t.closest('[data-ghh-tab]');
    const modeB = t.closest('[data-ghh-mode]');
    const playB = t.closest('[data-ghh-play]');
    const driveB = t.closest('[data-ghh-drive]');
    const eqB = t.closest('[data-ghh-eq]');
    const preB = t.closest('[data-ghh-preset]');
    const danceB = t.closest('[data-ghh-dance]');
    const recB = t.closest('[data-ghh-rec]');
    const charB = t.closest('[data-ghh-char]');
    const petB = t.closest('[data-ghh-pet]');
    const animB = t.closest('[data-ghh-anim]');
    const slotB = t.closest('[data-ghh-slot]');
    const onB = t.closest('[data-ghh-paint-on]');
    const studioB = t.closest('[data-ghh-studio]');
    const footB = t.closest('[data-ghh-foot]');
    const wallB = t.closest('[data-ghh-wall]');
    const signB = t.closest('[data-ghh-sign]');
    const itemB = t.closest('[data-ghh-item]');
    if (!(openB || closeB || tabB || modeB || playB || driveB || eqB || preB || danceB || recB || charB || petB || animB || slotB || onB || studioB || footB || wallB || signB || itemB)) return;
    e.preventDefault();
    e.stopPropagation();
    if (openB) { open('home'); return; }
    if (closeB) { close(); return; }
    if (tabB) { open(tabB.dataset.ghhTab); return; }
    if (modeB) {
      const game = games.filter(function (g) { return g.id === modeB.dataset.ghhGame; })[0];
      const mode = game && game.modes && game.modes.filter(function (m) { return m.id === modeB.dataset.ghhMode; })[0];
      if (mode) mode.onPlay();
      return;
    }
    if (driveB) {
      const game = games.filter(function (g) { return g.id === driveB.dataset.ghhDrive; })[0];
      if (game && game.onDrive) game.onDrive();
      return;
    }
    if (playB) {
      const game = games.filter(function (g) { return g.id === playB.dataset.ghhPlay; })[0];
      if (game && game.onPlay) game.onPlay();
      return;
    }
    if (eqB) { onEq(eqB.dataset.ghhEq, eqB.dataset.ghhVal); return; }
    if (preB) { onPreset(preB.dataset.ghhPreset); return; }
    if (danceB) { onDance(danceB.dataset.ghhDance, danceB.dataset.ghhOpt); return; }
    if (recB) {
      const kind = recB.dataset.ghhRec;
      if (kind === 'stage') openDance();
      else openDance(kind);
      return;
    }
    if (charB) { saveCrew({ character: charB.dataset.ghhChar }); if (opened) render(); return; }
    if (petB) { saveCrew({ pet: petB.dataset.ghhPet }); if (opened) render(); return; }
    if (animB) { saveCrew({ anim: animB.dataset.ghhAnim }); if (opened) render(); return; }
    if (onB) { writePaint({ on: onB.dataset.ghhPaintOn === 'on' }); return; }
    if (slotB) { writePaint({ slot: Number(slotB.dataset.ghhSlot) || 1 }); return; }
    if (studioB) { openPaintStudio(studioB.dataset.ghhStudio === 'wall' ? 'wall' : undefined); return; }
    if (footB) {
      goWorld(function () {
        try {
          if (window.WALK_MODE && typeof WALK_MODE.toggleGetOut === 'function' && !WALK_MODE.onFoot) WALK_MODE.toggleGetOut();
        } catch (err) {}
        note('ON FOOT');
      });
      return;
    }
    if (wallB) { saveHouse({ wall: wallB.dataset.ghhWall }); note('WALL THEME SET'); return; }
    if (signB) { saveHouse({ sign: signB.dataset.ghhSign }); note('NEON SIGN SET'); return; }
    if (itemB) {
      const key = itemB.dataset.ghhItem;
      const cur = readHouse();
      const patch = {};
      patch[key] = !cur[key];
      saveHouse(patch);
      note((patch[key] ? 'ADDED ' : 'REMOVED ') + key);
    }
  }
  function onEnterDoor() {}
  function hookWalk() {
    try {
      let currentWM = window.WALK_MODE;
      const wrap = function (wm) {
        if (!wm || wm.__ghhDoor) return;
        let impl = wm.enterDoor;
        const wrapped = function (b) {
          let result;
          if (typeof impl === 'function') result = impl.apply(this, arguments);
          try { onEnterDoor(b); } catch (e) {}
          try { decorateInterior(); } catch (e) {}
          return result;
        };
        try {
          Object.defineProperty(wm, 'enterDoor', {
            configurable: true, enumerable: true,
            get: function () { return wrapped; },
            set: function (fn) { impl = fn; }
          });
        } catch (e) {}
        try { Object.defineProperty(wm, '__ghhDoor', { value: 1 }); } catch (e2) {}
      };
      wrap(currentWM);
      Object.defineProperty(window, 'WALK_MODE', {
        configurable: true, enumerable: true,
        get: function () { return currentWM; },
        set: function (v) { currentWM = v; wrap(v); }
      });
    } catch (e) {}
  }
  function readEntry() {
    try {
      const u = new URL(location.href);
      let q = (u.searchParams.get('entry') || u.searchParams.get('game') || '').toLowerCase();
      if (!q && u.hash) q = decodeURIComponent(u.hash.replace(/^#/, '')).toLowerCase();
      if (q === 'skydrop' || q === 'sky') return 'skydrop';
      if (q === 'street' || q === 'cruise' || q === 'walk') return 'street';
      if (q === 'wall' || q === 'graffiti') return 'wall';
      if (q === 'soccer') return 'soccer';
      if (q === 'builder' || q === 'city') return 'builder';
      if (q === 'stunt' || q === 'rings') return 'stunt';
      if (q === 'hub') return 'hub';
      return '';
    } catch (e) { return ''; }
  }
  function dismissStartOverlay() {
    try {
      const ov = document.getElementById('kOver');
      if (ov) ov.classList.add('hidden');
      const mb = document.getElementById('kMenuB');
      if (mb) mb.classList.remove('hidden');
      if (typeof kPause === 'function') kPause(false);
    } catch (e) {}
  }
  function consumeEntry() {
    const entry = readEntry();
    if (!entry) return;
    dismissStartOverlay();
    if (entry === 'skydrop') startSkyDrop();
    else if (entry === 'street') startStreet();
    else if (entry === 'wall') viewWall();
    else if (entry === 'soccer') playSoccer();
    else if (entry === 'builder') playCity();
    else if (entry === 'stunt') playStunt();
    else if (entry === 'hub') open();
  }
  function listenCrew() {
    try {
      crewCh = new BroadcastChannel('zdash-crew');
      crewCh.onmessage = function () { if (opened) render(); };
    } catch (e) {}
    window.addEventListener('storage', function (e) {
      if (!opened || !e.key) return;
      if (e.key === CREW_KEY || e.key === DANCE_KEY || e.key === PETDANCE_KEY || e.key === KID_KEY || e.key === PAINT_KEY || e.key === STAGE_KEY || e.key === HOUSE_KEY) {
        if (e.key === KID_KEY) applyTrackColor();
        decorateInterior();
        render();
      }
    });
  }
  function css() {
    if (document.getElementById('ghh-style')) return;
    const s = document.createElement('style');
    s.id = 'ghh-style';
    s.textContent = [
      '#kHome.ghh-ready{width:min(828px,calc(100vw - 8px));max-height:calc(100% - 6px);align-items:stretch;padding:40px 8px 8px;box-sizing:border-box}',
      '#ghhPill{position:absolute;top:5px;left:42px;z-index:3;height:30px;display:inline-flex;align-items:center;gap:6px;padding:0 10px;border-radius:999px;border:1.5px solid #3ee6ff;background:rgba(8,2,20,.94);color:#fff;font:800 10px/1 Orbitron,sans-serif;cursor:pointer;box-shadow:0 0 12px rgba(62,230,255,.5)}',
      '#kHubRow{order:0;width:100%}',
      '#ghhOpen{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;min-height:34px;border-radius:14px;border:2px solid #ff4fd8;background:linear-gradient(90deg,rgba(255,79,216,.28),rgba(62,230,255,.16));color:#fff;font:900 12px Orbitron,sans-serif;cursor:pointer;box-shadow:0 0 16px rgba(255,79,216,.4)}',
      '#kGamesWrap{order:1;width:100%}',
      '#kHome.ghh-ready .kpzrow button,#kHome.ghh-ready .ktabs button{display:inline-flex;align-items:center;justify-content:center;gap:6px}',
      '#kHome .ghh-svg{display:inline-flex;width:18px;height:18px;flex:none}',
      '#kHome .ghh-svg svg{width:18px;height:18px;display:block;filter:drop-shadow(0 0 4px currentColor)}',
      '.ghh-kicker{font:900 10px Orbitron,sans-serif;letter-spacing:1.6px;color:#3ee6ff;text-align:center;margin:4px 0}',
      '.ghh-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%}',
      '.ghh-card{display:grid;grid-template-columns:24px 1fr;grid-template-areas:"ico text" "acts acts";gap:2px 5px;padding:5px 6px;border-radius:11px;border:1.5px solid var(--ghh,#3ee6ff);background:rgba(10,4,24,.88);box-shadow:0 0 12px color-mix(in srgb,var(--ghh,#3ee6ff) 45%,transparent);min-width:0}',
      '.ghh-card.hero{grid-column:1 / -1;grid-template-columns:32px 1fr}',
      '.ghh-card .ghh-svg{grid-area:ico;width:28px;height:28px;color:var(--ghh,#3ee6ff)}',
      '.ghh-card .ghh-svg svg{width:28px;height:28px}',
      '.ghh-card-text{grid-area:text;min-width:0}',
      '.ghh-card-text b{display:block;font:900 10px/1.15 Orbitron,sans-serif;color:#fff;letter-spacing:.3px}',
      '.ghh-card-text small{display:block;font:600 9px/1.25 Rajdhani,sans-serif;color:#d7c6ef;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.ghh-card-text em{display:inline-block;margin-top:2px;font:800 8px Orbitron,sans-serif;font-style:normal;color:#12051a;background:var(--ghh,#3ee6ff);border-radius:999px;padding:1px 5px}',
      '.ghh-acts{grid-area:acts;display:flex;flex-wrap:wrap;gap:4px}',
      '.ghh-grid button,.ghh-acts button{font:800 9px/1.1 Orbitron,sans-serif;color:#fff;background:rgba(62,230,255,.1);border:1.5px solid rgba(62,230,255,.7);border-radius:999px;padding:4px 7px;min-height:24px;cursor:pointer}',
      '.ghh-mini{border-color:#ffe14d !important;color:#ffe14d !important}',
      '.ghh{position:fixed;inset:0;z-index:80;display:flex;flex-direction:column;gap:6px;padding:8px;background:radial-gradient(1200px 400px at 10% -10%,rgba(255,79,216,.2),transparent 50%),radial-gradient(900px 400px at 100% 0%,rgba(62,230,255,.16),transparent 46%),#07010f;color:#fff;font-family:Orbitron,Rajdhani,sans-serif}',
      '.ghh.ghh-hide{display:none}',
      '.ghh-head{display:flex;align-items:center;gap:8px}',
      '.ghh-head strong{display:block;font:900 14px Orbitron,sans-serif;letter-spacing:1px}',
      '.ghh-head small{display:block;font:600 11px Rajdhani,sans-serif;color:#c9b6e8}',
      '.ghh-head .ghh-svg{color:#3ee6ff}',
      '.ghh-x{margin-left:auto;width:34px;height:34px;border-radius:10px;border:1.5px solid #3ee6ff;background:rgba(62,230,255,.1);color:#fff;font:900 16px sans-serif;cursor:pointer}',
      '.ghh-tabs{display:flex;gap:4px;overflow:auto}',
      '.ghh-tabs button{flex:1 1 0;min-width:0;border-radius:12px;border:1.5px solid rgba(62,230,255,.45);background:rgba(255,255,255,.04);color:#efe7ff;font:800 9px/1.15 Orbitron,sans-serif;padding:6px 4px;cursor:pointer}',
      '.ghh-tabs button.on{border-color:#ff4fd8;background:rgba(255,79,216,.2);color:#fff;box-shadow:0 0 12px rgba(255,79,216,.45)}',
      '.ghh-body{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:8px;padding-bottom:12px}',
      '.ghh-hi{margin:0;font:900 16px Orbitron,sans-serif;letter-spacing:1px;text-shadow:0 0 12px #ff4fd8}',
      '.ghh h2{margin:0;font:900 14px Orbitron,sans-serif}',
      '.ghh h3{margin:6px 0 0;font:800 10px Orbitron,sans-serif;color:#3ee6ff;letter-spacing:1px}',
      '.ghh-note{margin:0;font:600 12px/1.3 Rajdhani,sans-serif;color:#d9c8ef}',
      '.ghh-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px}',
      '.ghh-stat{display:flex;gap:6px;align-items:center;padding:6px;border-radius:12px;border:1px solid rgba(62,230,255,.35);background:rgba(255,255,255,.03)}',
      '.ghh-stat b{display:block;font:800 8px Orbitron,sans-serif;letter-spacing:.6px}',
      '.ghh-stat small{display:block;font:600 11px/1.25 Rajdhani,sans-serif;color:#efe7ff}',
      '.ghh-swatch{width:18px;height:18px;border-radius:50%;flex:none;box-shadow:0 0 8px currentColor;border:1px solid #fff}',
      '.ghh-swatch.big{width:42px;height:42px}',
      '.ghh-look{display:flex;gap:8px;align-items:center}',
      '.ghh-look small{display:block;font:600 12px Rajdhani,sans-serif;color:#efe7ff}',
      '.ghh-picks{display:flex;flex-wrap:wrap;gap:4px}',
      '.ghh-pick{border-radius:999px;border:1.5px solid rgba(62,230,255,.5);background:rgba(8,4,20,.8);color:#fff;font:800 9px Orbitron,sans-serif;padding:5px 8px;cursor:pointer}',
      '.ghh-pick.on{border-color:#ffe14d;background:#ffe14d;color:#1a0633}',
      '.ghh-pick.lock{opacity:.55}',
      '.ghh-go{display:flex;align-items:center;justify-content:center;text-align:center;text-decoration:none;border-radius:14px;border:2px solid #ff4fd8;background:rgba(255,79,216,.16);color:#fff;font:900 11px Orbitron,sans-serif;padding:8px;cursor:pointer}',
      '.ghh-go.alt{border-color:#3ee6ff;background:rgba(62,230,255,.1)}',
      '.ghh-block{display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:14px;border:1px solid rgba(255,79,216,.35);background:rgba(255,255,255,.03)}',
      '.ghh-toast{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);padding:6px 12px;border-radius:999px;border:1.5px solid #ffe14d;background:rgba(12,6,24,.94);color:#fff;font:800 11px Orbitron,sans-serif;opacity:0;pointer-events:none;transition:opacity .2s}',
      '.ghh-toast.on{opacity:1}',
      '#ghh-room{display:flex;flex-direction:column;align-items:center;gap:8px;width:min(520px,100%);padding:16px;border-radius:18px;border:2px solid var(--wall,#3ee6ff);background:rgba(8,4,20,.72);box-shadow:0 0 24px var(--wall,#3ee6ff)}',
      '#ghh-room[hidden]{display:none}',
      '#ghh-room .ghh-room-sign{font:900 22px Orbitron,sans-serif;color:var(--wall,#3ee6ff);text-shadow:0 0 12px var(--wall,#3ee6ff);letter-spacing:1px}',
      '#ghh-room .ghh-room-items{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}',
      '#ghh-room .ghh-room-item{border:1.5px solid var(--wall,#3ee6ff);border-radius:12px;padding:8px 10px;background:rgba(255,255,255,.06)}',
      '#ghh-room small{font:700 11px Rajdhani,sans-serif;letter-spacing:1px}',
      '@media (max-width:700px){.ghh-grid,.ghh-stats{grid-template-columns:1fr}}'
    ].join('');
    document.head.appendChild(s);
  }

  css();
  dressMenu();
  installGames();
  hookWalk();
  listenCrew();
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && opened) { e.preventDefault(); close(); }
  });
  const bootLine = document.getElementById('ghhBoot');
  if (bootLine) bootLine.hidden = true;
  if (!document.getElementById('kHome')) location.replace('jr.html#garage');

  window.GARAGE_HOME_HUB = {
    open: open,
    close: close,
    toggle: toggle,
    onEnterDoor: onEnterDoor,
    registerGame: registerGame,
    games: games,
    get tab() { return current; },
    get isOpen() { return opened; },
    get house() { return readHouse(); }
  };
  publishHouse(readHouse());
  hookGarageSync();
  syncCar();

  function afterBoot(fn) {
    const go = function () { setTimeout(fn, 0); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();
  }
  afterBoot(function () {
    applyTrackColor();
    watchInterior();
    consumeEntry();
  });
})();
