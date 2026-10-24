/* Home menu room preview. Same walkCam / white-room kit as Ellie's House.
   This file does not load house.js: that script starts a walk loop and
   replaces requestAnimationFrame. The camera math matches walkCam when
   yaw is 0 and zoom is 1. One buffer, paused when paint() is not called. */
(function () {
  'use strict';
  const HEX = { 'neon-grid': '#3ee6ff', bubblegum: '#ff4fd8', midnight: '#9b5cff', 'lime-loft': '#7dff6b' };
  const SIGN = { ellie: "ELLIE'S Z", arts: 'Z COMPANY ARTS', home: 'WELCOME HOME', glow: 'NEON DREAMS' };
  let orbit = { yaw: 0, zoom: 1 };
  let buf = null;
  let paints = 0;
  let on = false;
  let last = { bw: 0, bh: 0, dpr: 1, yaw: 0, zoom: 1, wall: '', who: '', pet: '' };

  if (typeof window.walkCam !== 'function') {
    window.walkCam = function (x, y, z, W, H) {
      const yaw = orbit.yaw, zoom = orbit.zoom, cz = 4.25;
      const dx = x, dz = z - cz;
      const c = Math.cos(yaw), s = Math.sin(yaw);
      const rx = dx * c - dz * s;
      const rz = cz + dx * s + dz * c;
      const sc = (1.45 * zoom) / Math.max(0.38, rz + 1.7);
      return [W * 0.5 + rx * sc * H * 0.58, H * 0.60 - (y - 1.4) * sc * H * 0.58, sc];
    };
  }
  if (typeof window.walkQuad !== 'function') {
    window.walkQuad = function (g, pts, fill, stroke) {
      g.beginPath();
      pts.forEach(function (p, i) { i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); });
      g.closePath();
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = 2; g.stroke(); }
    };
  }
  if (typeof window.walkBox !== 'function') {
    window.walkBox = function (g, x, y, z, w, h, d, fill, stroke, W, H) {
      const f = function (px, py, pz) { return walkCam(px, py, pz, W, H); };
      const a = f(x - w, y, z - d), b = f(x + w, y, z - d), c = f(x + w, y, z + d), e = f(x - w, y, z + d);
      const A = f(x - w, y + h, z - d), B = f(x + w, y + h, z - d), C = f(x + w, y + h, z + d), E = f(x - w, y + h, z + d);
      walkQuad(g, [e, c, C, E], fill, stroke);
      walkQuad(g, [a, b, B, A], fill, stroke);
      walkQuad(g, [a, e, E, A], fill, stroke);
      walkQuad(g, [b, c, C, B], fill, stroke);
      walkQuad(g, [A, B, C, E], fill, stroke);
    };
  }

  /* City plan (one buffer, no second DPR stacked on top): phone uses
     min(devicePixelRatio, 2) at the pane's CSS size. iPad and desktop use
     DPR 1, and only shrink if that pane itself exceeds the city area cap. */
  function budget(cssW, cssH) {
    const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const desktop = !touch && window.innerWidth > 1024;
    const shortSide = Math.min(window.innerWidth, window.innerHeight);
    const longSide = Math.max(window.innerWidth, window.innerHeight);
    const ipad = touch && (shortSide >= 680 && longSide >= 900);
    const dpr = (!desktop && !ipad) ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    let bw = Math.max(2, Math.round(cssW * dpr));
    let bh = Math.max(2, Math.round(cssH * dpr));
    const cap = ipad ? 1440 * 1080 : desktop ? 1280 * 720 : 0;
    if (cap && bw * bh > cap) {
      const sc = Math.sqrt(cap / (bw * bh));
      bw = Math.max(2, Math.floor(bw * sc));
      bh = Math.max(2, Math.floor(bh * sc));
    }
    return { bw: bw, bh: bh, dpr: dpr };
  }

  function kitHouse(h) {
    const src = h || {};
    const wall = HEX[src.wall] ? src.wall : 'neon-grid';
    const sign = SIGN[src.sign] ? src.sign : 'ellie';
    return {
      wall: wall,
      accent: HEX[wall],
      theme: HEX[wall],
      sign: sign,
      signText: src.signText || SIGN[sign],
      sofa: src.sofa !== false,
      arcade: src.arcade !== false,
      petBed: src.petBed !== false,
      danceFloor: !!src.danceFloor,
      counter: src.counter === true,
      furniture: src.furniture || 'sofa',
      placed: [],
      hasPlaced: false
    };
  }

  function paint(ctx, x, y, w, h, house, view) {
    const WI = window.WALK_ITEMS;
    if (!ctx || w < 8 || h < 8 || !WI || typeof WI.drawKit !== 'function') {
      on = false;
      return false;
    }
    const size = budget(w, h);
    if (!buf) buf = document.createElement('canvas');
    if (buf.width !== size.bw || buf.height !== size.bh) {
      buf.width = size.bw;
      buf.height = size.bh;
    }
    const v = view || {};
    orbit.yaw = +v.yaw || 0;
    orbit.zoom = Math.max(1, Math.min(2.4, +v.zoom || 1));
    const kit = kitHouse(house);
    const g = buf.getContext('2d');
    g.setTransform(size.bw / w, 0, 0, size.bh / h, 0, 0);
    g.shadowBlur = 0;
    let drew = false;
    try {
      drew = !!WI.drawKit(g, w, h, 'HOME', kit);
    } catch (e) {
      drew = false;
    }
    if (!drew) { on = false; return false; }
    const crew = window.CREW;
    if (crew && typeof crew.paintRoomPeople === 'function') {
      const project = function (px, py, pz) {
        const p = walkCam(px, py, pz, w, h);
        return [p[0], p[1], Math.max(0.38, pz + 1.7), 1.45 * h * 0.58];
      };
      const rz = 4.6 - 2.45 * 0.55;
      const pz = 4.6 - 2.15 * 0.55;
      try {
        g.save();
        g.shadowBlur = 0;
        crew.paintRoomPeople(g, project, { x: 0, y: 0, z: rz, yaw: Math.PI }, { x: 1.1, y: 0, z: pz, yaw: Math.PI + 0.5 }, { who: v.who || '', pet: v.pet || '' });
      } catch (e) { /* the room still shows if a figure fails */ }
      finally { g.restore(); }
    }
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.drawImage(buf, x, y, w, h);
    ctx.restore();
    paints++;
    on = true;
    last = {
      bw: size.bw, bh: size.bh, dpr: size.dpr,
      yaw: +orbit.yaw.toFixed(3), zoom: +orbit.zoom.toFixed(3),
      wall: kit.wall, who: v.who || '', pet: v.pet || ''
    };
    return true;
  }

  function pause() { on = false; }

  window.GROOM = {
    paint: paint,
    pause: pause,
    get state() {
      return {
        on: on, paints: paints, bw: last.bw, bh: last.bh, dpr: last.dpr,
        yaw: last.yaw, zoom: last.zoom, wall: last.wall, who: last.who, pet: last.pet
      };
    }
  };
})();
