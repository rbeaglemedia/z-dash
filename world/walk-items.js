'use strict';
// Walking-only item menu. Add a future item by appending one object to
// WALK_ITEM_LIST. kind defaults to 'box'. Icons and model thumbnails bake
// the first time that item's category is opened (or a placed prop needs it).
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
    { id: 'seating', name: 'SEATING' },
    { id: 'surfaces', name: 'SURFACES' },
    { id: 'plants', name: 'PLANTS' },
    { id: 'pets', name: 'PETS' },
    { id: 'fun', name: 'FUN' }
  ];
  // Starter set is smaller than a full Brookhaven catalog. menu:false rows
  // stay out of the picker (the dance floor is a saved Home flag only).
  const LIST = [
    { id: 'chair', cat: 'seating', name: 'CHAIR', kind: 'chair', color: '#f7f4ef' },
    { id: 'sofa', cat: 'seating', name: 'SOFA', kind: 'sofa', color: '#ff4fd8', save: 'sofa' },
    { id: 'counter', cat: 'surfaces', name: 'COUNTER', kind: 'counter', color: '#ffffff', save: 'counter' },
    { id: 'plant', cat: 'plants', name: 'PLANT', kind: 'plant', color: '#7dff6b' },
    { id: 'petBed', cat: 'pets', name: 'PET BED', kind: 'bed', color: '#7dff6b', save: 'petBed' },
    { id: 'arcade', cat: 'fun', name: 'ARCADE', kind: 'arcade', color: '#ffe14d', save: 'arcade' },
    { id: 'danceFloor', cat: 'fun', name: 'DANCE FLOOR', kind: 'pad', color: '#ff4fd8', save: 'danceFloor', menu: false }
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
  let currentCat = 'seating';
  let builtCat = '';
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

  function drawKind(g, kind, color, x, z, W, H) {
    const fill = color || '#ffffff';
    const k = kind || 'box';
    if (k === 'chair') {
      walkBox(g, x, 0, z, 0.26, 0.4, 0.26, fill, '#d5dbe3', W, H);
      walkBox(g, x, 0.4, z + 0.16, 0.26, 0.38, 0.06, fill, '#d5dbe3', W, H);
      return;
    }
    if (k === 'sofa') {
      walkBox(g, x, 0, z, 0.78, 0.42, 0.34, fill, '#fff', W, H);
      walkBox(g, x, 0.42, z + 0.2, 0.78, 0.32, 0.08, fill, '#fff', W, H);
      return;
    }
    if (k === 'counter') {
      walkBox(g, x, 0, z, 0.85, 0.7, 0.36, '#ffffff', '#d7dee6', W, H);
      walkBox(g, x - 0.55, 0, z - 0.62, 0.16, 0.46, 0.16, '#f7f4ef', '#d5dbe3', W, H);
      walkBox(g, x + 0.55, 0, z - 0.62, 0.16, 0.46, 0.16, '#f7f4ef', '#d5dbe3', W, H);
      return;
    }
    if (k === 'plant') {
      walkBox(g, x, 0, z, 0.18, 0.26, 0.18, '#f4f7fb', '#c5d0dc', W, H);
      walkBox(g, x, 0.26, z, 0.32, 0.5, 0.32, '#7dff6b', '#1c6b32', W, H);
      return;
    }
    if (k === 'bed') {
      walkBox(g, x, 0, z, 0.52, 0.14, 0.36, fill, '#e9fff2', W, H);
      return;
    }
    if (k === 'arcade') {
      walkBox(g, x, 0, z, 0.36, 1.05, 0.3, '#241434', fill, W, H);
      walkBox(g, x, 0.62, z - 0.22, 0.28, 0.22, 0.05, '#3ee6ff', '#fff', W, H);
      return;
    }
    if (k === 'pad') {
      walkBox(g, x, 0, z, 0.7, 0.04, 0.7, fill, '#fff', W, H);
      return;
    }
    if (k === 'dj') {
      walkBox(g, x, 0, z, 0.62, 0.8, 0.32, '#1a1028', fill, W, H);
      return;
    }
    if (k === 'trophy') {
      walkBox(g, x, 0, z, 0.48, 0.85, 0.26, fill, '#fff', W, H);
      return;
    }
    walkBox(g, x, 0, z, 0.36, 0.42, 0.3, fill, '#d5dbe3', W, H);
  }

  function paintThumb(item, w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    g.shadowBlur = 0;
    g.fillStyle = '#f4f7fb';
    g.fillRect(0, 0, w, h);
    drawKind(g, item.kind || 'box', item.color, 0, 4.15, w, h);
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
      const p = placed[i];
      const item = byId(p.id);
      drawKind(g, item ? (item.kind || 'box') : 'box', item && item.color, p.x, p.z, W, H);
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
      JSON.stringify(placed)
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
      out.push({ id: item.id, space: 'room', purpose: 'HOME', x: slot.x, z: slot.z });
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
  function place(id) {
    const item = byId(id);
    if (!item || item.menu === false) return false;
    const house = walkHouseLoad();
    const base = house.hasPlaced ? house.placed.slice() : seedFrom(house);
    if (base.length >= cap) {
      try { walkToast('TOO MANY ITEMS', '#ffe14d'); } catch (e) {}
      return false;
    }
    const inside = !!(WALK_MODE && WALK_MODE.insideBuilding);
    const spot = inside ? roomSpot(base.length) : worldSpot(base.length);
    base.push({
      id: item.id,
      space: inside ? 'room' : 'world',
      purpose: inside && WALK_MODE.insideDoor ? (WALK_MODE.insideDoor.purpose || '') : '',
      x: spot.x,
      z: spot.z
    });
    const patch = { placed: base };
    if (item.save) patch[item.save] = true;
    walkHouseSave(patch);
    try { if (inside && typeof walkPaintRoom === 'function') walkPaintRoom(); } catch (e) {}
    refreshCount();
    return true;
  }
  function lift() {
    const house = walkHouseLoad();
    if (!house.hasPlaced || !house.placed.length) return false;
    walkHouseSave({ placed: house.placed.slice(0, -1) });
    try { if (WALK_MODE && WALK_MODE.insideBuilding && typeof walkPaintRoom === 'function') walkPaintRoom(); } catch (e) {}
    refreshCount();
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
    node.textContent = n + ' / ' + cap;
  }
  function showCat(catId) {
    currentCat = catId || currentCat || 'seating';
    const pack = ensureCat(currentCat);
    const cats = document.getElementById('walkItemCats');
    if (cats) {
      const buttons = cats.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('on', buttons[i].dataset.cat === currentCat);
      }
    }
    const grid = document.getElementById('walkItemGrid');
    if (!grid || builtCat === currentCat) return;
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
        place(item.id);
      });
      grid.appendChild(b);
    }
  }
  function ensureUi() {
    if (typeof document === 'undefined') return null;
    let btn = document.getElementById('walkItemsBtn');
    if (btn) return btn;
    const css = document.createElement('style');
    css.id = 'walkItemsCss';
    css.textContent = '#walkItemsBtn,#walkItems,#walkItems button,#walkItems span{text-align:center;text-decoration:none}' +
      '#walkItemsBtn{position:fixed;left:8px;top:5px;z-index:96;height:44px;min-width:72px;margin:0;padding:0 12px;border-radius:14px;border:2px solid #243044;background:#f4f7fb;color:#243044;font:900 12px/1 Orbitron,sans-serif;letter-spacing:.4px;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:none;transition:none}' +
      '#walkItems{position:fixed;left:8px;top:64px;z-index:96;width:min(168px,32vw);max-height:42vh;overflow:auto;display:none;flex-direction:column;gap:6px;padding:8px;border-radius:14px;border:2px solid #243044;background:rgba(244,247,251,.96);color:#243044;box-sizing:border-box;transition:none}' +
      '#walkItems button{display:flex;align-items:center;justify-content:center;min-height:36px;border-radius:10px;border:1.5px solid #243044;background:#fff;color:#243044;font:800 11px/1.1 Orbitron,sans-serif;padding:4px 6px;cursor:pointer;transition:none}' +
      '#walkItems .wi-cats{display:flex;flex-wrap:wrap;gap:4px}#walkItems .wi-cats button{flex:1 1 30%}' +
      '#walkItems .wi-cats button.on{background:#243044;color:#f4f7fb}' +
      '#walkItems .wi-items{display:flex;flex-direction:column;gap:4px}' +
      '#walkItems .wi-item{flex-direction:column;gap:2px}' +
      '#walkItems .wi-item img{width:72px;height:48px;object-fit:contain;display:block}' +
      '#walkItems #walkItemCount{font:800 11px/1.2 Orbitron,sans-serif;text-align:center}';
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
      b.textContent = c.name;
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
    const liftBtn = document.createElement('button');
    liftBtn.type = 'button';
    liftBtn.id = 'walkItemLift';
    liftBtn.textContent = 'LIFT LAST';
    liftBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      lift();
    });
    const count = document.createElement('div');
    count.id = 'walkItemCount';
    panel.append(cats, grid, liftBtn, count);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    const root = document.body || document.documentElement;
    root.append(btn, panel);
    return btn;
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
    ensureCat('seating');
    const icon = cache.seating && cache.seating.icons.chair;
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
  function placeChrome(btn, panel) {
    const inside = !!(window.WALK_MODE && WALK_MODE.insideBuilding);
    if (inside) {
      if (btn.style.left) { btn.style.left = ''; btn.style.top = ''; }
      if (panel && panel.style.left) { panel.style.left = ''; panel.style.top = ''; }
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
    }
  }
  function sync() {
    const now = performance.now();
    const show = menuAllowed();
    if (!show) open = false;
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
    refreshCount();
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
    present: present,
    invalidate: invalidate,
    sync: sync,
    still: still,
    place: place,
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
