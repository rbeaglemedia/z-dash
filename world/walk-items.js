'use strict';
// Walking-only item menu for Ellie's rooms. Add a future item by appending
// one object to WALK_ITEM_LIST. kind defaults to 'box'. Icons and model
// thumbnails bake the first time that item's category is opened.
(function () {
  const HEX = { 'neon-grid': '#3ee6ff', bubblegum: '#ff4fd8', midnight: '#9b5cff', 'lime-loft': '#7dff6b' };
  const SIGN = { ellie: "ELLIE'S Z", arts: 'Z COMPANY ARTS', home: 'WELCOME HOME', glow: 'NEON DREAMS' };
  const SLOTS = {
    chair: { x: -1.15, z: 4.7 },
    sofa: { x: -1.65, z: 5.75 },
    counter: { x: 2.15, z: 5.55 },
    plant: { x: 2.55, z: 3.35 },
    petBed: { x: -2.15, z: 2.85 },
    arcade: { x: -1.85, z: 6.35 },
    danceFloor: { x: -1.2, z: 4.25 }
  };
  const CATS = [
    { id: 'furniture', name: 'FURNITURE', glyph: 'seat' },
    { id: 'kitchen', name: 'KITCHEN', glyph: 'counter' },
    { id: 'pets', name: 'PETS', glyph: 'bed' },
    { id: 'decor', name: 'DECOR', glyph: 'plant' },
    { id: 'lights', name: 'LIGHTS', glyph: 'lamp' },
    { id: 'signs', name: 'SIGNS', glyph: 'sign' }
  ];
  // Small starter set. menu:false rows stay out of the picker (the dance
  // floor is a saved Home flag only). One new row is enough to add an item.
  const LIST = [
    { id: 'chair', cat: 'furniture', name: 'CHAIR', kind: 'chair', color: '#f7f4ef' },
    { id: 'sofa', cat: 'furniture', name: 'SOFA', kind: 'sofa', color: '#ff4fd8', save: 'sofa' },
    { id: 'arcade', cat: 'furniture', name: 'ARCADE', kind: 'arcade', color: '#ffe14d', save: 'arcade' },
    { id: 'counter', cat: 'kitchen', name: 'COUNTER', kind: 'counter', color: '#ffffff', save: 'counter' },
    { id: 'petBed', cat: 'pets', name: 'PET BED', kind: 'bed', color: '#7dff6b', save: 'petBed' },
    { id: 'plant', cat: 'decor', name: 'PLANT', kind: 'plant', color: '#7dff6b' },
    { id: 'lamp', cat: 'lights', name: 'LAMP', kind: 'lamp', color: '#3ee6ff' },
    { id: 'plaque', cat: 'signs', name: 'SIGN', kind: 'plaque', color: '#ff4fd8' },
    { id: 'danceFloor', cat: 'decor', name: 'DANCE FLOOR', kind: 'pad', color: '#ff4fd8', save: 'danceFloor', menu: false }
  ];

  const cache = {};
  const stats = {
    fps: 60, frameMs: 16.7, scale: 1, cap: 8, placed: 0, menuOpen: false,
    menuFps: 0, menuMs: 0, fullFps: 0, fullMs: 0, perPropMs: 0, suggestMore: 0,
    catalogHeadroom: 5, loadedCats: [], atCap: false, worldDrawn: 0
  };
  let cap = 8;
  let scale = 1;
  let open = false;
  let currentCat = 'furniture';
  let builtCat = '';
  let armed = '';
  let armRot = 0;
  let preview = { x: 0, z: 4.6 };
  let selected = -1;
  let drag = null;
  let skipDraw = -1;
  let bake = null;
  let bakeSig = '';
  let propDyn = null;
  let raisedAt = 0;
  let lowSince = 0;
  let highSince = 0;
  let lastTick = 0;
  const recent = [];
  let menuMsAcc = 0;
  let menuN = 0;
  let fullMsAcc = 0;
  let fullN = 0;
  let benched = false;

  function byId(id) {
    for (let i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i];
    return null;
  }
  function isKit(purpose) {
    return purpose === 'HOME' || purpose === 'CAFE' || purpose === 'PETS' || purpose === 'SHOWROOM';
  }
  function viewHouse(h) {
    if (!h) return (typeof walkHouseLoad === 'function') ? walkHouseLoad() : null;
    if (h.accent && h.signText && h.wall) return h;
    const wall = HEX[h.wall] ? h.wall : 'neon-grid';
    const sign = SIGN[h.sign] ? h.sign : 'ellie';
    return {
      wall: wall, accent: HEX[wall], theme: HEX[wall], sign: sign,
      signText: h.neonSign || h.signText || SIGN[sign],
      sofa: h.sofa !== false, arcade: h.arcade !== false, petBed: h.petBed !== false,
      danceFloor: !!h.danceFloor, counter: h.counter === true,
      furniture: h.furniture || 'sofa',
      placed: Array.isArray(h.placed) ? h.placed : [],
      hasPlaced: Array.isArray(h.placed)
    };
  }
  function accentFor(purpose, house) {
    if (purpose === 'CAFE') return '#ff9a2e';
    if (purpose === 'PETS') return '#7dff6b';
    if (purpose === 'SHOWROOM') return '#3ee6ff';
    if (house && house.accent) return house.accent;
    return '#3ee6ff';
  }
  function visible(house, space, purpose) {
    const all = (house && house.placed) || [];
    const out = [];
    const n = Math.min(all.length, cap);
    for (let i = 0; i < n; i++) {
      const p = all[i];
      if (!p || p.space !== space) continue;
      if (space === 'room' && purpose && p.purpose && p.purpose !== purpose) continue;
      out.push(p);
    }
    return out;
  }

  function drawKind(g, kind, color, x, z, W, H, rot) {
    const fill = color || '#ffffff';
    const k = kind || 'box';
    const r = ((rot | 0) % 4 + 4) % 4;
    const turn = function (ox, oz) {
      if (r === 1) return [oz, -ox];
      if (r === 2) return [-ox, -oz];
      if (r === 3) return [-oz, ox];
      return [ox, oz];
    };
    const box = function (ox, oy, oz, w, h, d, f, stroke) {
      const p = turn(ox, oz);
      const swap = r === 1 || r === 3;
      walkBox(g, x + p[0], oy, z + p[1], swap ? d : w, h, swap ? w : d, f, stroke, W, H);
    };
    if (k === 'chair') {
      box(0, 0, 0, 0.26, 0.4, 0.26, fill, '#d5dbe3');
      box(0, 0.4, 0.16, 0.26, 0.38, 0.06, fill, '#d5dbe3');
      return;
    }
    if (k === 'sofa') {
      box(0, 0, 0, 0.78, 0.42, 0.34, fill, '#fff');
      box(0, 0.42, 0.2, 0.78, 0.32, 0.08, fill, '#fff');
      return;
    }
    if (k === 'counter') {
      box(0, 0, 0, 0.85, 0.7, 0.36, '#ffffff', '#d7dee6');
      box(-0.55, 0, -0.62, 0.16, 0.46, 0.16, '#f7f4ef', '#d5dbe3');
      box(0.55, 0, -0.62, 0.16, 0.46, 0.16, '#f7f4ef', '#d5dbe3');
      return;
    }
    if (k === 'plant') {
      box(0, 0, 0, 0.18, 0.26, 0.18, '#f4f7fb', '#c5d0dc');
      box(0, 0.26, 0, 0.32, 0.5, 0.32, '#7dff6b', '#1c6b32');
      return;
    }
    if (k === 'bed') {
      box(0, 0, 0, 0.52, 0.14, 0.36, fill, '#e9fff2');
      return;
    }
    if (k === 'arcade') {
      box(0, 0, 0, 0.36, 1.05, 0.3, '#241434', fill);
      box(0, 0.62, -0.22, 0.28, 0.22, 0.05, '#3ee6ff', '#fff');
      return;
    }
    if (k === 'pad') {
      box(0, 0, 0, 0.7, 0.04, 0.7, fill, '#fff');
      return;
    }
    if (k === 'lamp') {
      box(0, 0, 0, 0.08, 0.85, 0.08, '#243044', '#3ee6ff');
      box(0, 0.85, 0, 0.22, 0.16, 0.22, fill, '#fff');
      return;
    }
    if (k === 'plaque') {
      box(0, 0, 0, 0.08, 0.7, 0.08, '#243044', '#d5dbe3');
      box(0, 0.72, 0, 0.42, 0.28, 0.04, '#ffffff', fill);
      return;
    }
    if (k === 'dj') {
      box(0, 0, 0, 0.62, 0.8, 0.32, '#1a1028', fill);
      return;
    }
    if (k === 'trophy') {
      box(0, 0, 0, 0.48, 0.85, 0.26, fill, '#fff');
      return;
    }
    box(0, 0, 0, 0.36, 0.42, 0.3, fill, '#d5dbe3');
  }

  function paintThumb(item, w, h) {
    const S = 280, T = 220, bg = [197, 208, 220];
    const src = document.createElement('canvas');
    src.width = S;
    src.height = T;
    const sg = src.getContext('2d', { willReadFrequently: true });
    sg.shadowBlur = 0;
    sg.fillStyle = '#c5d0dc';
    sg.fillRect(0, 0, S, T);
    drawKind(sg, item.kind || 'box', item.color, 0, 2.4, S, T);
    const img = sg.getImageData(0, 0, S, T).data;
    let x0 = S, y0 = T, x1 = 0, y1 = 0, ink = 0;
    for (let y = 0; y < T; y++) {
      for (let x = 0; x < S; x++) {
        const i = (y * S + x) * 4;
        if (Math.abs(img[i] - bg[0]) + Math.abs(img[i + 1] - bg[1]) + Math.abs(img[i + 2] - bg[2]) < 36) continue;
        ink++;
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
      }
    }
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    g.shadowBlur = 0;
    g.fillStyle = '#f4f7fb';
    g.fillRect(0, 0, w, h);
    if (ink > 12 && x1 > x0 && y1 > y0) {
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, pad = 4;
      const fit = Math.min((w - pad * 2) / bw, (h - pad * 2) / bh);
      const dw = bw * fit, dh = bh * fit;
      g.drawImage(src, x0, y0, bw, bh, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }
    return c;
  }
  function ensureCat(catId) {
    if (cache[catId]) return cache[catId];
    const pack = { icons: {}, models: {}, modelUrl: {} };
    for (let i = 0; i < LIST.length; i++) {
      const item = LIST[i];
      if (item.cat !== catId || item.menu === false) continue;
      pack.icons[item.id] = paintThumb(item, 64, 64);
      pack.models[item.id] = paintThumb(item, 160, 120);
      pack.modelUrl[item.id] = pack.models[item.id].toDataURL('image/png');
    }
    cache[catId] = pack;
    stats.loadedCats = Object.keys(cache);
    return pack;
  }

  function drawWhiteRoom(g, W, H, accent) {
    const cam = function (x, y, z) { return walkCam(x, y, z, W, H); };
    g.shadowBlur = 0;
    g.fillStyle = '#f4f7fb';
    g.fillRect(0, 0, W, H);
    walkQuad(g, [cam(-4.2, 0, 7.4), cam(4.2, 0, 7.4), cam(4.2, 3.1, 7.4), cam(-4.2, 3.1, 7.4)], '#f7f9fc', null);
    walkQuad(g, [cam(-4.2, 0, 1.1), cam(-4.2, 0, 7.4), cam(-4.2, 3.1, 7.4), cam(-4.2, 3.1, 1.1)], '#eef2f6', null);
    walkQuad(g, [cam(4.2, 0, 1.1), cam(4.2, 0, 7.4), cam(4.2, 3.1, 7.4), cam(4.2, 3.1, 1.1)], '#e7edf4', null);
    walkQuad(g, [cam(-4.2, 0, 1.1), cam(4.2, 0, 1.1), cam(4.2, 0, 7.4), cam(-4.2, 0, 7.4)], '#f6f1ea', null);
    g.save();
    g.strokeStyle = accent;
    g.globalAlpha = 0.18;
    g.lineWidth = 1.5;
    g.shadowBlur = 0;
    for (let i = -3; i <= 3; i += 2) {
      const a = cam(i, 0.02, 1.4), b = cam(i, 0.02, 7.1);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    for (let z = 2; z <= 6; z += 2) {
      const a = cam(-4, 0.02, z), b = cam(4, 0.02, z);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    g.restore();
    const s0 = cam(-3.6, 2.95, 3.4), s1 = cam(3.6, 2.95, 3.4);
    g.strokeStyle = accent;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(s0[0], s0[1]);
    g.lineTo(s1[0], s1[1]);
    g.stroke();
    walkBox(g, 0, 0, 4.7, 0.035, 2.55, 1.85, 'rgba(214,240,255,.5)', null, W, H);
    walkBox(g, 0, 0, 4.7, 0.07, 0.055, 1.85, accent, null, W, H);
  }
  function drawSign(g, W, H, house, accent) {
    const p = walkCam(0.15, 2.32, 7.15, W, H);
    const text = (house && (house.signText || house.neonSign)) || "ELLIE'S Z";
    g.shadowBlur = 0;
    g.font = '800 22px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const w = Math.min(W * 0.72, Math.max(88, g.measureText(text).width + 28));
    g.fillStyle = '#ffffff';
    g.fillRect(p[0] - w / 2, p[1] - 16, w, 32);
    g.fillStyle = accent;
    g.fillText(text, p[0], p[1]);
  }
  function drawLegacy(g, W, H, house) {
    for (let i = 0; i < LIST.length; i++) {
      const item = LIST[i];
      if (!item.save || !house[item.save]) continue;
      const slot = SLOTS[item.id] || { x: 0, z: 5 };
      drawKind(g, item.kind || 'box', item.color, slot.x, slot.z, W, H);
    }
  }
  function counterShown(house, placed) {
    for (let i = 0; i < placed.length; i++) if (placed[i].id === 'counter') return true;
    if (house && house.hasPlaced) return false;
    return !!(house && house.counter);
  }
  function drawKit(g, W, H, purpose, houseOpt) {
    if (!isKit(purpose)) return false;
    const saved = houseOpt || ((typeof walkHouseLoad === 'function') ? walkHouseLoad() : null);
    const house = viewHouse(saved);
    const accent = accentFor(purpose, house);
    const placed = (house && house.hasPlaced) ? visible(house, 'room', purpose) : [];
    g.save();
    g.shadowBlur = 0;
    g.globalAlpha = 1;
    drawWhiteRoom(g, W, H, accent);
    if (purpose === 'CAFE') {
      walkBox(g, 1.7, 0, 6.2, 1.35, 0.72, 0.38, '#ffffff', '#ff9a2e', W, H);
      walkBox(g, 1.7, 0.72, 6.2, 1.35, 0.05, 0.38, '#ff9a2e', null, W, H);
    } else if (purpose === 'PETS') {
      walkBox(g, -1.15, 0, 6.05, 0.42, 0.12, 0.3, '#7dff6b', '#e9fff2', W, H);
      walkBox(g, 1.35, 0, 6.1, 0.36, 0.12, 0.28, '#d9ffd0', '#7dff6b', W, H);
    } else if (purpose === 'SHOWROOM') {
      walkBox(g, 0.15, 0, 5.55, 1.05, 0.1, 0.72, '#f7f9fc', '#3ee6ff', W, H);
    }
    if (purpose === 'HOME' && house && !house.hasPlaced) drawLegacy(g, W, H, house);
    for (let i = 0; i < placed.length; i++) {
      if (i === skipDraw) continue;
      const p = placed[i];
      const item = byId(p.id);
      drawKind(g, item ? (item.kind || 'box') : 'box', item && item.color, p.x, p.z, W, H, p.rot || 0);
    }
    if (purpose === 'HOME' && house && house.furniture === 'dj') drawKind(g, 'dj', accent, 2.55, 6.4, W, H);
    if (purpose === 'HOME' && house && house.furniture === 'trophy') drawKind(g, 'trophy', '#ffe14d', 2.55, 6.4, W, H);
    drawKind(g, 'chair', '#f7f4ef', -3.2, 3.55, W, H);
    drawKind(g, 'chair', '#f7f4ef', -3.2, 4.85, W, H);
    drawKind(g, 'plant', '#7dff6b', 3.25, 3.95, W, H);
    if (!counterShown(house, placed)) walkBox(g, 2.2, 0, 5.6, 0.82, 0.34, 0.32, '#ffffff', '#e4eaf1', W, H);
    if (purpose === 'HOME') drawSign(g, W, H, house, accent);
    g.restore();
    return true;
  }

  function sigFor(purpose, W, H) {
    let house = null;
    try { house = (typeof walkHouseLoad === 'function') ? walkHouseLoad() : null; } catch (e) {}
    const placed = house && house.placed ? house.placed : [];
    return [
      scale, cap, W, H, purpose,
      house && house.wall, house && house.sign, house && house.furniture,
      house && house.sofa, house && house.arcade, house && house.petBed,
      house && house.danceFloor, house && house.counter, house && house.hasPlaced,
      skipDraw, JSON.stringify(placed)
    ].join('|');
  }
  function present(g, W, H, purpose, drawCb) {
    const bw = Math.max(2, Math.round(W * scale));
    const bh = Math.max(2, Math.round(H * scale));
    const next = sigFor(purpose, W, H);
    if (!bake || bake.width !== bw || bake.height !== bh || bakeSig !== next) {
      if (!bake) bake = document.createElement('canvas');
      bake.width = bw;
      bake.height = bh;
      const bg = bake.getContext('2d');
      bg.setTransform(scale, 0, 0, scale, 0, 0);
      bg.shadowBlur = 0;
      drawCb(bg);
      bakeSig = next;
    }
    g.shadowBlur = 0;
    g.drawImage(bake, 0, 0, W, H);
  }
  function invalidate() { bakeSig = ''; }
  function drawMarker(g, x, z, W, H) {
    const p = walkCam(x, 0.04, z, W, H);
    g.shadowBlur = 0;
    g.strokeStyle = '#3ee6ff';
    g.lineWidth = 2;
    g.beginPath();
    g.ellipse(p[0], p[1], 16, 7, 0, 0, 7);
    g.stroke();
  }
  function drawLive(g, W, H, purpose) {
    if (!g || !isKit(purpose)) return;
    g.save();
    g.shadowBlur = 0;
    if (armed) {
      const item = byId(armed);
      if (item) drawKind(g, item.kind || 'box', item.color, preview.x, preview.z, W, H, armRot);
      drawMarker(g, preview.x, preview.z, W, H);
    }
    if (drag) {
      const item = byId(drag.id);
      drawKind(g, item ? (item.kind || 'box') : 'box', item && item.color, drag.x, drag.z, W, H, drag.rot || 0);
      drawMarker(g, drag.x, drag.z, W, H);
    } else if (selected >= 0 && !armed) {
      let house = null;
      try { house = walkHouseLoad(); } catch (e) {}
      const p = house && house.placed && house.placed[selected];
      if (p && p.space === 'room' && (!p.purpose || p.purpose === purpose)) drawMarker(g, p.x, p.z, W, H);
    }
    g.restore();
  }
  function still(canvas, house) {
    if (!canvas || !canvas.getContext) return;
    const W = canvas.width || 640;
    const H = canvas.height || 180;
    const g = canvas.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.shadowBlur = 0;
    drawKit(g, W, H, 'HOME', house || null);
  }

  function pauseOpen() {
    const home = document.getElementById('kHome');
    return !!(home && !home.classList.contains('hidden'));
  }
  function isFlying() {
    try { if (typeof flying !== 'undefined' && flying) return true; } catch (e) {}
    try {
      if (typeof P !== 'undefined' && P && (P.wings || (P.driveMode && P.driveMode !== 'street'))) return true;
    } catch (e) {}
    return false;
  }
  function onFootLive() {
    if (!window.WALK_MODE || !WALK_MODE.onFoot) return false;
    if (isFlying()) return false;
    try {
      if (typeof P !== 'undefined' && P && !P.ground && WALK_MODE._roofY == null) return false;
    } catch (e) {}
    return true;
  }
  function menuAllowed() { return onFootLive() && !pauseOpen(); }

  function seedFrom(house) {
    const out = [];
    for (let i = 0; i < LIST.length; i++) {
      const item = LIST[i];
      if (!item.save || !house[item.save]) continue;
      const slot = SLOTS[item.id] || { x: 0, z: 5 };
      out.push({ id: item.id, space: 'room', purpose: 'HOME', x: slot.x, z: slot.z, rot: 0 });
    }
    return out;
  }
  function roomSpot(n) {
    const room = (WALK_MODE && WALK_MODE.room) || { x: 0, z: 2 };
    const rz = 4.6 - (room.z || 0) * 0.55;
    return {
      x: Math.max(-3.3, Math.min(3.3, (room.x || 0) + ((n % 5) - 2) * 0.62)),
      z: Math.max(2.5, Math.min(6.5, rz + ((n % 3) - 1) * 0.45))
    };
  }
  function worldSpot(n) {
    const yaw = (WALK_MODE && WALK_MODE.yaw) || 0;
    return {
      x: ((WALK_MODE && WALK_MODE.x) || 0) + Math.sin(yaw) * 1.6 + ((n % 4) - 1.5) * 0.8,
      z: ((WALK_MODE && WALK_MODE.z) || 0) + Math.cos(yaw) * 1.6 + ((n % 3) - 1) * 0.8
    };
  }
  function clampRoom(x, z) {
    return {
      x: Math.max(-3.4, Math.min(3.4, x)),
      z: Math.max(1.8, Math.min(6.8, z))
    };
  }
  function inKitRoom() {
    const door = WALK_MODE && WALK_MODE.insideBuilding && WALK_MODE.insideDoor;
    return !!(door && isKit(door.purpose || ''));
  }
  function place(id, at) {
    const item = byId(id);
    if (!item || item.menu === false) return false;
    const house = walkHouseLoad();
    const base = house.hasPlaced ? house.placed.slice() : seedFrom(house);
    if (base.length >= cap) {
      try { walkToast('TOO MANY ITEMS', '#ffe14d'); } catch (e) {}
      return false;
    }
    const inside = !!(WALK_MODE && WALK_MODE.insideBuilding);
    const spot = (at && at.x != null) ? clampRoom(at.x, at.z) : (inside ? roomSpot(base.length) : worldSpot(base.length));
    base.push({
      id: item.id,
      space: inside ? 'room' : 'world',
      purpose: inside && WALK_MODE.insideDoor ? (WALK_MODE.insideDoor.purpose || '') : '',
      x: spot.x,
      z: spot.z,
      rot: (at && at.rot) || 0
    });
    const patch = { placed: base };
    if (item.save) patch[item.save] = true;
    walkHouseSave(patch);
    selected = base.length - 1;
    try { if (inside && typeof walkPaintRoom === 'function') walkPaintRoom(); } catch (e) {}
    refreshCount();
    refreshActs();
    return true;
  }
  function arm(id) {
    const item = byId(id);
    if (!item || item.menu === false) return false;
    if (!inKitRoom()) {
      try { walkToast('STEP INTO A ROOM', '#ffe14d'); } catch (e) {}
      return false;
    }
    armed = item.id;
    armRot = 0;
    preview = { x: 0, z: 4.6 };
    selected = -1;
    drag = null;
    skipDraw = -1;
    refreshActs();
    showCat(item.cat);
    try { walkPaintRoom(); } catch (e) {}
    return true;
  }
  function lift() {
    const house = walkHouseLoad();
    if (!house.hasPlaced || !house.placed.length) return false;
    const next = house.placed.slice();
    const i = selected >= 0 && selected < next.length ? selected : next.length - 1;
    next.splice(i, 1);
    selected = -1;
    drag = null;
    skipDraw = -1;
    walkHouseSave({ placed: next });
    try { if (WALK_MODE && WALK_MODE.insideBuilding && typeof walkPaintRoom === 'function') walkPaintRoom(); } catch (e) {}
    refreshCount();
    refreshActs();
    return true;
  }

  function refreshCount() {
    const node = document.getElementById('walkItemCount');
    if (!node) return;
    let n = 0;
    try {
      const house = walkHouseLoad();
      n = house.hasPlaced ? house.placed.length : 0;
    } catch (e) {}
    node.textContent = n + '/' + cap + ' props';
  }
  function refreshActs() {
    const hint = document.getElementById('walkItemHint');
    if (hint) {
      hint.textContent = armed ? 'TAP THE FLOOR' : (selected >= 0 ? 'DRAG TO MOVE' : 'TAP AN ITEM');
    }
    const grid = document.getElementById('walkItemGrid');
    if (grid) {
      const buttons = grid.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('on', buttons[i].dataset.item === armed);
      }
    }
    const showAct = !!(armed || selected >= 0);
    const rot = document.getElementById('walkItemRotate');
    const rm = document.getElementById('walkItemRemove');
    if (rot) rot.style.display = showAct ? 'flex' : 'none';
    if (rm) rm.style.display = showAct ? 'flex' : 'none';
  }
  function bumpCap() {
    if (cap >= 12) {
      try { walkToast('LIMIT 12', '#ffe14d'); } catch (e) {}
      return false;
    }
    if (!(stats.fps > 55)) {
      try { walkToast('SLOW DEVICE', '#ffe14d'); } catch (e) {}
      return false;
    }
    cap = Math.min(12, cap + 4);
    stats.cap = cap;
    raisedAt = performance.now();
    try { walkToast(cap + ' PROPS', '#7dff6b'); } catch (e) {}
    refreshCount();
    return true;
  }
  function rotatePick() {
    if (armed) {
      armRot = (armRot + 1) % 4;
      try { walkPaintRoom(); } catch (e) {}
      return true;
    }
    const house = walkHouseLoad();
    if (!house.hasPlaced || selected < 0 || !house.placed[selected]) return false;
    const next = house.placed.slice();
    const p = Object.assign({}, next[selected]);
    p.rot = ((p.rot | 0) + 1) % 4;
    next[selected] = p;
    if (drag && drag.index === selected) drag.rot = p.rot;
    walkHouseSave({ placed: next });
    try { walkPaintRoom(); } catch (e) {}
    return true;
  }
  function removePick() {
    if (armed) {
      armed = '';
      armRot = 0;
      refreshActs();
      try { walkPaintRoom(); } catch (e) {}
      return true;
    }
    return lift();
  }
  function showCat(catId) {
    currentCat = catId || currentCat || 'furniture';
    const pack = ensureCat(currentCat);
    const cats = document.getElementById('walkItemCats');
    if (cats) {
      const buttons = cats.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('on', buttons[i].dataset.cat === currentCat);
      }
    }
    const grid = document.getElementById('walkItemGrid');
    if (!grid || builtCat === currentCat) { refreshActs(); return; }
    builtCat = currentCat;
    grid.replaceChildren();
    for (let i = 0; i < LIST.length; i++) {
      const item = LIST[i];
      if (item.cat !== currentCat || item.menu === false) continue;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'wi-item';
      b.dataset.item = item.id;
      const img = document.createElement('img');
      img.alt = '';
      img.src = pack.modelUrl[item.id] || '';
      const span = document.createElement('span');
      span.textContent = item.name;
      b.append(img, span);
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        arm(item.id);
      });
      grid.appendChild(b);
    }
    refreshActs();
  }
  const GLYPH = {};
  function glyphUrl(kind) {
    if (GLYPH[kind]) return GLYPH[kind];
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const g = c.getContext('2d');
    g.fillStyle = '#243044';
    g.fillRect(0, 0, 32, 32);
    if (kind === 'seat') {
      g.fillStyle = '#ff4fd8';
      g.fillRect(8, 16, 16, 8);
      g.fillRect(8, 8, 5, 12);
    } else if (kind === 'counter') {
      g.fillStyle = '#ffffff';
      g.fillRect(5, 14, 22, 10);
      g.fillStyle = '#ff9a2e';
      g.fillRect(5, 11, 22, 4);
    } else if (kind === 'bed') {
      g.fillStyle = '#7dff6b';
      g.fillRect(6, 16, 20, 8);
    } else if (kind === 'plant') {
      g.fillStyle = '#f4f7fb';
      g.fillRect(13, 18, 6, 8);
      g.fillStyle = '#7dff6b';
      g.beginPath();
      g.arc(16, 13, 7, 0, 7);
      g.fill();
    } else if (kind === 'lamp') {
      g.fillStyle = '#3ee6ff';
      g.fillRect(14, 12, 4, 14);
      g.fillStyle = '#ffe14d';
      g.fillRect(9, 6, 14, 7);
    } else {
      g.fillStyle = '#ffffff';
      g.fillRect(6, 9, 20, 14);
      g.fillStyle = '#ff4fd8';
      g.fillRect(6, 9, 20, 4);
    }
    GLYPH[kind] = c.toDataURL('image/png');
    return GLYPH[kind];
  }
  function ensureUi() {
    if (typeof document === 'undefined') return null;
    let btn = document.getElementById('walkItemsBtn');
    if (btn) return btn;
    const css = document.createElement('style');
    css.id = 'walkItemsCss';
    css.textContent = '#walkItemsBtn,#walkItems,#walkItems button,#walkItems span{text-align:center;text-decoration:none}' +
      '#walkItemsBtn{position:fixed;left:8px;top:5px;z-index:96;height:44px;min-width:72px;margin:0;padding:0 12px;border-radius:14px;border:2px solid #243044;background:#f4f7fb;color:#243044;font:900 12px/1 Orbitron,sans-serif;letter-spacing:.4px;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:none;transition:none}' +
      '#walkItems{position:fixed;left:8px;top:56px;z-index:96;width:min(240px,46vw);max-height:min(240px,calc(100vh - 160px));overflow:hidden;display:none;flex-direction:column;gap:8px;padding:8px;border-radius:16px;border:2px solid #243044;background:rgba(244,247,251,.96);color:#243044;box-sizing:border-box;transition:none}' +
      '#walkItems button{display:flex;align-items:center;justify-content:center;min-height:36px;border-radius:10px;border:1.5px solid #243044;background:#fff;color:#243044;font:800 11px/1.1 Orbitron,sans-serif;padding:4px 6px;cursor:pointer;transition:none}' +
      '#walkItems .wi-body{display:flex;gap:8px;min-height:0;flex:1 1 auto;overflow:hidden}' +
      '#walkItems .wi-cats{display:flex;flex-direction:column;gap:8px;width:48px;flex:0 0 48px;min-height:0;overflow-x:hidden;overflow-y:auto;max-height:188px}' +
      '#walkItems .wi-cats button{width:48px;min-height:44px;padding:4px 0}' +
      '#walkItems .wi-cats button.on{background:#243044;color:#f4f7fb}' +
      '#walkItems .wi-cats img{width:26px;height:26px;display:block;border-radius:6px}' +
      '#walkItems .wi-items{display:grid;grid-template-columns:1fr 1fr;gap:8px;overflow:auto;flex:1;min-width:0;align-content:start}' +
      '#walkItems .wi-item{flex-direction:column;gap:2px;min-height:72px}' +
      '#walkItems .wi-item.on{background:#243044;color:#f4f7fb}' +
      '#walkItems .wi-item img{width:64px;height:48px;object-fit:contain;display:block}' +
      '#walkItems .wi-foot,#walkItems .wi-acts{display:flex;align-items:center;justify-content:center;gap:8px}' +
      '#walkItems #walkItemPlus{width:36px;min-width:36px;height:36px;min-height:36px;padding:0;font:900 18px/1 Orbitron,sans-serif}' +
      '#walkItems #walkItemCount,#walkItems #walkItemHint{font:800 11px/1.2 Orbitron,sans-serif;text-align:center}' +
      '#walkItems .wi-acts button{flex:1}';
    document.head.appendChild(css);
    btn = document.createElement('button');
    btn.id = 'walkItemsBtn';
    btn.type = 'button';
    btn.textContent = 'ITEMS';
    btn.setAttribute('aria-label', 'ITEMS');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!menuAllowed()) { open = false; sync(); return; }
      open = !open;
      if (open) { ensureUi(); showCat(currentCat); }
      sync();
    });
    const panel = document.createElement('div');
    panel.id = 'walkItems';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Walking items');
    const cats = document.createElement('div');
    cats.id = 'walkItemCats';
    cats.className = 'wi-cats';
    for (let i = 0; i < CATS.length; i++) {
      const c = CATS[i];
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.cat = c.id;
      b.setAttribute('aria-label', c.name);
      const icon = document.createElement('img');
      icon.alt = '';
      icon.src = glyphUrl(c.glyph);
      b.appendChild(icon);
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        builtCat = '';
        showCat(c.id);
      });
      cats.appendChild(b);
    }
    const grid = document.createElement('div');
    grid.id = 'walkItemGrid';
    grid.className = 'wi-items';
    const body = document.createElement('div');
    body.className = 'wi-body';
    body.append(cats, grid);
    const foot = document.createElement('div');
    foot.className = 'wi-foot';
    const count = document.createElement('div');
    count.id = 'walkItemCount';
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.id = 'walkItemPlus';
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'More props');
    plus.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      bumpCap();
    });
    foot.append(count, plus);
    const acts = document.createElement('div');
    acts.className = 'wi-acts';
    const rotBtn = document.createElement('button');
    rotBtn.type = 'button';
    rotBtn.id = 'walkItemRotate';
    rotBtn.textContent = 'ROTATE';
    rotBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      rotatePick();
    });
    const rmBtn = document.createElement('button');
    rmBtn.type = 'button';
    rmBtn.id = 'walkItemRemove';
    rmBtn.textContent = 'REMOVE';
    rmBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      removePick();
    });
    const hint = document.createElement('div');
    hint.id = 'walkItemHint';
    hint.textContent = 'TAP AN ITEM';
    acts.append(rotBtn, rmBtn);
    panel.append(body, foot, acts, hint);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    const root = document.body || document.documentElement;
    root.append(btn, panel);
    bindRoom();
    return btn;
  }
  function floorAt(px, py, W, H) {
    const s = (py / H - 0.60) / (1.4 * 0.58);
    if (!(s > 0.04) || !isFinite(s)) return null;
    const used = Math.min(s, 1.45 / 0.38);
    const z = 1.45 / used - 1.7;
    const x = (px - W * 0.5) / (used * H * 0.58);
    if (!isFinite(x) || !isFinite(z)) return null;
    return clampRoom(x, z);
  }
  function roomPointer(e) {
    const cv = e.currentTarget;
    const rect = cv.getBoundingClientRect();
    const px = (e.clientX - rect.left) / Math.max(1, rect.width) * cv.width;
    const py = (e.clientY - rect.top) / Math.max(1, rect.height) * cv.height;
    return floorAt(px, py, cv.width, cv.height);
  }
  function hitProp(pt, purpose) {
    let house = null;
    try { house = walkHouseLoad(); } catch (e) { return -1; }
    if (!house || !house.hasPlaced) return -1;
    let best = -1;
    let bd = 0.75;
    const n = Math.min(house.placed.length, cap);
    for (let i = 0; i < n; i++) {
      const p = house.placed[i];
      if (!p || p.space !== 'room') continue;
      if (purpose && p.purpose && p.purpose !== purpose) continue;
      const d = Math.hypot((p.x || 0) - pt.x, (p.z || 0) - pt.z);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  function onRoomDown(e) {
    if (!inKitRoom() || !open) return;
    const pt = roomPointer(e);
    if (!pt) return;
    const purpose = WALK_MODE.insideDoor.purpose || '';
    if (armed) {
      e.preventDefault();
      e.stopPropagation();
      const id = armed;
      const rot = armRot;
      if (place(id, { x: pt.x, z: pt.z, rot: rot })) armed = '';
      refreshActs();
      return;
    }
    const i = hitProp(pt, purpose);
    if (i < 0) return;
    e.preventDefault();
    e.stopPropagation();
    const house = walkHouseLoad();
    const p = house.placed[i];
    selected = i;
    drag = { index: i, id: p.id, x: p.x, z: p.z, rot: p.rot || 0 };
    skipDraw = i;
    refreshActs();
    try { walkPaintRoom(); } catch (err) {}
  }
  function onRoomMove(e) {
    if (!inKitRoom()) return;
    const pt = roomPointer(e);
    if (!pt) return;
    if (armed) { preview = pt; return; }
    if (!drag) return;
    drag.x = pt.x;
    drag.z = pt.z;
  }
  function onRoomUp() {
    if (!drag) return;
    const house = walkHouseLoad();
    const kept = drag;
    drag = null;
    skipDraw = -1;
    if (house.hasPlaced && house.placed[kept.index]) {
      const next = house.placed.slice();
      const p = Object.assign({}, next[kept.index]);
      p.x = kept.x;
      p.z = kept.z;
      p.rot = kept.rot || 0;
      next[kept.index] = p;
      selected = kept.index;
      walkHouseSave({ placed: next });
    }
    try { if (WALK_MODE && WALK_MODE.insideBuilding) walkPaintRoom(); } catch (err) {}
    refreshActs();
  }
  function bindRoom() {
    const cv = document.getElementById('walk-room-cv');
    if (!cv || cv.dataset.wiPlace) return;
    cv.dataset.wiPlace = '1';
    cv.addEventListener('pointerdown', onRoomDown, true);
    cv.addEventListener('pointermove', onRoomMove, true);
    cv.addEventListener('pointerup', onRoomUp, true);
    cv.addEventListener('pointercancel', onRoomUp, true);
  }

  function drawWorldProps() {
    stats.worldDrawn = 0;
    if (!onFootLive() || (WALK_MODE && WALK_MODE.insideBuilding)) return;
    if (typeof ctx === 'undefined' || !ctx || typeof proj !== 'function') return;
    let house = null;
    try { house = walkHouseLoad(); } catch (e) { return; }
    const list = visible(house, 'world');
    if (!list.length) return;
    const cats = {};
    for (let i = 0; i < list.length; i++) {
      const item = byId(list[i].id);
      if (item) cats[item.cat] = 1;
    }
    const keys = Object.keys(cats);
    for (let i = 0; i < keys.length; i++) ensureCat(keys[i]);
    ctx.save();
    ctx.shadowBlur = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const item = byId(p.id);
      const pt = proj(p.x, 0.85, p.z);
      if (!pt || !item) continue;
      const pack = cache[item.cat];
      const icon = pack && pack.icons[item.id];
      if (!icon) continue;
      const dx = p.x - ((typeof cam !== 'undefined' && cam && cam.x) || 0);
      const dz = p.z - ((typeof cam !== 'undefined' && cam && cam.z) || 0);
      const dist = Math.max(1, Math.hypot(dx, dz));
      const size = Math.max(16, Math.min(72, 260 / dist));
      ctx.drawImage(icon, pt[0] - size * 0.5, pt[1] - size, size, size);
      stats.worldDrawn++;
    }
    ctx.restore();
  }
  function ensureDyn() {
    if (propDyn || typeof CITY === 'undefined' || !CITY || !CITY.DYN) return;
    propDyn = { x: 1e7, y: 0, z: 1e7, rad: 30, draw: drawWorldProps };
    CITY.DYN.push(propDyn);
  }
  function moveDyn() {
    ensureDyn();
    if (!propDyn || !window.WALK_MODE) return;
    const live = onFootLive() && !WALK_MODE.insideBuilding;
    if (live) {
      propDyn.x = WALK_MODE.x || 0;
      propDyn.y = WALK_MODE.y || 0;
      propDyn.z = WALK_MODE.z || 0;
    } else {
      propDyn.x = 1e7;
      propDyn.z = 1e7;
    }
  }

  function retune() {
    invalidate();
    try {
      if (window.WALK_MODE && WALK_MODE.insideBuilding && typeof walkPaintRoom === 'function') walkPaintRoom();
    } catch (e) {}
  }
  function noteHeadroom() {
    if (!benched) { bench(); benched = true; }
    const budget = 1000 / 36;
    const frame = stats.fullMs || stats.frameMs || 16.7;
    const per = Math.max(stats.perPropMs || 0, 0.05);
    stats.suggestMore = Math.max(0, Math.floor((budget - frame) / per));
    stats.catalogHeadroom = 5;
  }
  function applyGate(now) {
    const fps = stats.fps;
    let changed = false;
    if (fps < 36) {
      highSince = 0;
      if (!lowSince) lowSince = now;
      if (now - lowSince > 1000) {
        if (cap !== 4) { cap = 4; changed = true; }
        if (scale !== 0.5) { scale = 0.5; changed = true; }
        lowSince = now;
      }
    } else if (fps > 55) {
      lowSince = 0;
      if (!highSince) highSince = now;
      if (now - highSince > 1000) {
        if (scale < 1) { scale = 1; changed = true; }
        if (cap < 12 && now - raisedAt > 1000) {
          cap = Math.min(12, cap + 4);
          raisedAt = now;
          changed = true;
        }
        highSince = now;
      }
    } else {
      lowSince = 0;
      highSince = 0;
    }
    stats.cap = cap;
    stats.scale = scale;
    if (changed) retune();
  }
  function sample(now) {
    if (lastTick) {
      const dt = now - lastTick;
      if (dt > 0 && dt < 2000) {
        recent.push({ t: now, dt: dt });
        if (stats.menuOpen) { menuMsAcc += dt; menuN++; }
        if (stats.atCap) { fullMsAcc += dt; fullN++; }
      }
    }
    lastTick = now;
    const cut = now - 1000;
    while (recent.length && recent[0].t < cut) recent.shift();
    if (menuN >= 12) {
      stats.menuMs = menuMsAcc / menuN;
      stats.menuFps = 1000 / stats.menuMs;
      menuMsAcc = 0;
      menuN = 0;
    }
    if (fullN >= 12) {
      stats.fullMs = fullMsAcc / fullN;
      stats.fullFps = 1000 / stats.fullMs;
      fullMsAcc = 0;
      fullN = 0;
      noteHeadroom();
    }
    if (recent.length < 3) return;
    if (recent.length < 8 && now - recent[0].t < 600) return;
    let acc = 0;
    for (let i = 0; i < recent.length; i++) acc += recent[i].dt;
    const ms = acc / recent.length;
    stats.frameMs = ms;
    stats.fps = ms > 0 ? (1000 / ms) : 60;
    applyGate(now);
  }
  function resetSamples() {
    recent.length = 0;
    menuMsAcc = menuN = fullMsAcc = fullN = 0;
    lastTick = 0;
    stats.menuFps = 0;
    stats.menuMs = 0;
    stats.fullFps = 0;
    stats.fullMs = 0;
  }
  function measure(ms) {
    const wait = Math.max(300, +ms || 1000);
    return new Promise(function (resolve) {
      const t0 = performance.now();
      let last = t0, n = 0, acc = 0, menuAcc = 0, mN = 0, fullAcc = 0, fN = 0;
      function tick(now) {
        const dt = now - last;
        last = now;
        if (dt > 0 && dt < 2000) {
          acc += dt;
          n++;
          if (stats.menuOpen) { menuAcc += dt; mN++; }
          if (stats.atCap) { fullAcc += dt; fN++; }
        }
        if (now - t0 < wait) requestAnimationFrame(tick);
        else {
          const frame = n ? acc / n : 0;
          resolve({
            fps: frame ? 1000 / frame : 0,
            frameMs: frame,
            n: n,
            menuFps: mN ? 1000 / (menuAcc / mN) : 0,
            menuMs: mN ? menuAcc / mN : 0,
            menuN: mN,
            fullFps: fN ? 1000 / (fullAcc / fN) : 0,
            fullMs: fN ? fullAcc / fN : 0,
            fullN: fN,
            cap: cap,
            scale: scale,
            placed: stats.placed,
            atCap: stats.atCap,
            menuOpen: stats.menuOpen
          });
        }
      }
      requestAnimationFrame(tick);
    });
  }
  function bench() {
    ensureCat('furniture');
    const icon = cache.furniture && cache.furniture.icons.chair;
    if (!icon) { stats.perPropMs = 0.02; return stats.perPropMs; }
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 180;
    const g = c.getContext('2d');
    const n = 12;
    const reps = 30;
    const t0 = performance.now();
    for (let r = 0; r < reps; r++) {
      for (let i = 0; i < n; i++) g.drawImage(icon, (i % 6) * 40, (i % 4) * 30, 48, 48);
    }
    stats.perPropMs = (performance.now() - t0) / reps / n;
    return stats.perPropMs;
  }
  function mapEdge() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const desktop = !(navigator.maxTouchPoints > 0) && vw > 1024;
    let W = vw, H = vh, sx = 1, sy = 1;
    if (desktop) {
      const cap = 1280 * 720;
      const area = vw * vh || 1;
      let sc = Math.min(1, Math.sqrt(cap / area));
      W = Math.round(vw * sc);
      H = Math.round(vh * sc);
      if (W * H > cap) {
        const fit = Math.sqrt(cap / (W * H));
        W = Math.max(1, Math.floor(W * fit));
        H = Math.max(1, Math.floor(H * fit));
      }
      sx = vw / W;
      sy = vh / H;
    }
    const s = Math.min(1.35, Math.max(0.72, H / 378));
    const mapW = Math.min(196, Math.max(96, (W / s) / 2 - 79));
    return { r: (12 + mapW) * s * sx, b: 144 * s * sy };
  }
  function obstacleRects() {
    const ids = ['enterBldBtn', 'brk', 'tup', 'wng', 'nos', 'emoteBtn', 'walk-step-out', 'walk-room-tools', 'walk-open-page', 'walkItemsBtn'];
    const out = [];
    for (let i = 0; i < ids.length; i++) {
      const el = document.getElementById(ids[i]);
      if (!el || getComputedStyle(el).display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      out.push({ id: ids[i], x: r.left, y: r.top, r: r.right, b: r.bottom });
    }
    return out;
  }
  function boxHits(box, obs) {
    for (let i = 0; i < obs.length; i++) {
      const o = obs[i];
      const iw = Math.min(box.r, o.r) - Math.max(box.x, o.x);
      const ih = Math.min(box.b, o.b) - Math.max(box.y, o.y);
      if (iw > 2 && ih > 2) return true;
    }
    return false;
  }
  function placeChrome(btn, panel) {
    const inside = !!(window.WALK_MODE && WALK_MODE.insideBuilding);
    if (inside) {
      if (btn.style.left) { btn.style.left = ''; btn.style.top = ''; }
      if (!panel) return;
      const obs = obstacleRects();
      let enterB = 49, brkR = 8, sideL = window.innerWidth - 8, lowT = window.innerHeight - 8;
      for (let i = 0; i < obs.length; i++) {
        const o = obs[i];
        if (o.id === 'enterBldBtn') enterB = Math.max(enterB, o.b);
        if (o.id === 'brk' || o.id === 'nos') brkR = Math.max(brkR, o.r);
        if (o.id === 'wng' || o.id === 'tup' || o.id === 'emoteBtn') sideL = Math.min(sideL, o.x);
        if (o.id === 'walk-step-out' || o.id === 'walk-room-tools' || o.id === 'walk-open-page') lowT = Math.min(lowT, o.y);
      }
      lowT = Math.min(lowT, window.innerHeight - 100);
      const gap = 10;
      const top = Math.round(enterB + gap);
      const left = Math.round(brkR + gap);
      const width = Math.max(168, Math.min(420, Math.round(sideL - gap - left)));
      const height = Math.max(120, Math.min(300, Math.round(lowT - gap - top)));
      let box = { x: left, y: top, w: width, h: height, r: left + width, b: top + height };
      if (boxHits(box, obs)) {
        const fitTop = 56;
        const fitH = Math.max(96, Math.min(height, Math.round(lowT - gap - fitTop)));
        box = { x: 8, y: fitTop, w: Math.min(width, 240), h: fitH, r: 8 + Math.min(width, 240), b: fitTop + fitH };
      }
      panel.style.left = box.x + 'px';
      panel.style.top = box.y + 'px';
      panel.style.width = box.w + 'px';
      panel.style.height = box.h + 'px';
      panel.style.maxHeight = box.h + 'px';
      const grid = document.getElementById('walkItemGrid');
      if (grid) grid.style.gridTemplateColumns = box.w < 220 ? '1fr' : '1fr 1fr';
      return;
    }
    const map = mapEdge();
    const bw = 72;
    let x = Math.round(map.r + 10);
    let y = 8;
    const enter = document.getElementById('enterBldBtn');
    if (enter && getComputedStyle(enter).display !== 'none') {
      const er = enter.getBoundingClientRect();
      if (er.width > 2 && er.height > 2 && x < er.right - 2 && x + bw > er.left + 2) y = Math.round(er.bottom + 10);
    }
    const left = x + 'px';
    const top = y + 'px';
    const pTop = (y + 54) + 'px';
    if (btn.style.left !== left) btn.style.left = left;
    if (btn.style.top !== top) btn.style.top = top;
    if (panel) {
      if (panel.style.left !== left) panel.style.left = left;
      if (panel.style.top !== pTop) panel.style.top = pTop;
      panel.style.width = '168px';
      panel.style.height = '';
      const brk = document.getElementById('brk');
      let maxH = 160;
      if (brk && getComputedStyle(brk).display !== 'none') {
        const r = brk.getBoundingClientRect();
        if (r.height > 2) maxH = Math.max(96, Math.min(160, r.top - (y + 54) - 10));
      }
      panel.style.maxHeight = Math.round(maxH) + 'px';
    }
  }
  function parkRoomButtons(hold) {
    const step = document.getElementById('walk-step-out');
    const page = document.getElementById('walk-open-page');
    if (step) step.style.display = hold ? 'none' : '';
    if (page) page.style.display = hold ? 'none' : '';
  }
  function sync() {
    const now = performance.now();
    const show = menuAllowed();
    if (!show) open = false;
    if (!open) { armed = ''; if (drag) { drag = null; skipDraw = -1; } }
    let placedN = 0;
    try {
      const house = (typeof walkHouseLoad === 'function') ? walkHouseLoad() : null;
      placedN = house && house.hasPlaced ? house.placed.length : 0;
    } catch (e) {}
    stats.placed = placedN;
    stats.menuOpen = !!(show && open);
    stats.atCap = placedN >= cap && cap > 0;
    stats.cap = cap;
    stats.scale = scale;
    sample(now);
    const btn = ensureUi();
    const panel = document.getElementById('walkItems');
    if (btn) btn.style.display = show ? 'flex' : 'none';
    if (panel) panel.style.display = (show && open) ? 'flex' : 'none';
    if (show && btn) placeChrome(btn, panel);
    parkRoomButtons(!!(show && open && window.WALK_MODE && WALK_MODE.insideBuilding));
    try { bindRoom(); } catch (e) {}
    refreshCount();
    refreshActs();
    moveDyn();
  }

  addEventListener('zdash-house', function () {
    invalidate();
    try {
      if (window.WALK_MODE && WALK_MODE.insideBuilding && typeof walkPaintRoom === 'function') walkPaintRoom();
    } catch (e) {}
    try {
      const c = document.getElementById('ghhHomeStill');
      if (c) still(c);
    } catch (e) {}
  });

  window.WALK_ITEM_CATS = CATS;
  window.WALK_ITEM_LIST = LIST;
  window.WALK_ITEMS = {
    isKit: isKit,
    drawKit: drawKit,
    drawLive: drawLive,
    present: present,
    invalidate: invalidate,
    sync: sync,
    still: still,
    place: place,
    arm: arm,
    rotatePick: rotatePick,
    removePick: removePick,
    bumpCap: bumpCap,
    lift: lift,
    ensureCat: ensureCat,
    openMenu: function () { open = true; ensureUi(); showCat(currentCat); sync(); },
    closeMenu: function () { open = false; sync(); },
    resetSamples: resetSamples,
    measure: measure,
    bench: bench,
    stats: stats,
    cats: CATS,
    list: LIST
  };
  try { ensureDyn(); } catch (e) {}
})();
