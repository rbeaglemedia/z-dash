'use strict';
// Neon Drawing — finger paint for Ellie's 370Z.
// Shared by the Garage studio (neon-paint.html / NEON_PAINT.openStudio)
// and Neon World (ZD.Xray). Saved art lives in localStorage['zdash.neonpaint.v1']
// and is announced on BroadcastChannel('zdash-neonpaint') plus the storage event.
//
// Record:
//   { version:1, enabled:true, activeSlot:0,
//     slots:[ { name, strokes:[...], updatedAt } ] }
// Stroke:
//   { view:'top'|'sideL'|'sideR'|'hood',
//     brush:'neon'|'rainbow'|'sparkle'|'laser'|'eraser',
//     color:'#ff4fd8', size:8, mirror:true|false, pulse:true|false,
//     pts:[[u,v], ...] }   // u,v in 0..1, v grows downward
//
// Overlay planes are children of the car (and of the wing hinges once ZGL
// opens the doors) so they ride along for free. userData.crew lets the
// traffic cloner drop them; it only strips the clone, not the player's car.
(function () {
  const KEY = 'zdash.neonpaint.v1';
  const CH = 'zdash-neonpaint';
  const TAB = Math.random().toString(36).slice(2);
  const VIEWS = { top: 1, hood: 1, sideL: 1, sideR: 1 };
  const BRUSHES = { neon: 1, rainbow: 1, sparkle: 1, laser: 1, eraser: 1 };
  const HOOD_V = 0.60; // top-view v (0 nose .. 1 tail) where the hood & roof sheet ends
  const COLORS = ['#3ee6ff', '#ff4fd8', '#7dff6b', '#ffe14d', '#9b5cff', '#ff2a3d', '#ffffff'];

  let state = blank();
  let lastJson = '';
  let ch = null;
  let studio = null;
  let live = null;
  let builtCar = null;
  let doorsHooked = false;
  let metrics = null;
  let pulseLoop = false;
  const meshes = [];
  const pulseMeshes = [];
  const cvs = {};
  const lit = {};
  const ui = { view: 'top', mode: '2d', color: '#ff4fd8', style: 'neon', mirror: true, pulse: false, stamp: '', yaw: -0.72, pitch: 0.58 };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function blank() {
    return {
      version: 1, enabled: true, activeSlot: 0,
      slots: [0, 1, 2].map(function (i) { return { name: 'SLOT ' + (i + 1), strokes: [], updatedAt: 0 }; })
    };
  }
  function clipName(s, fallback) {
    s = (typeof s === 'string' && s.trim()) ? s.trim().slice(0, 24) : fallback;
    return s || fallback;
  }
  function cleanStroke(s) {
    if (!s || !VIEWS[s.view] || !BRUSHES[s.brush] || !Array.isArray(s.pts)) return null;
    if (!s.pts.length || s.pts.length > 800) return null;
    const pts = [];
    for (let i = 0; i < s.pts.length; i++) {
      const p = s.pts[i];
      if (!p || p.length < 2) continue;
      const u = +p[0], v = +p[1];
      if (u !== u || v !== v) continue;
      pts.push([clamp(u, 0, 1), clamp(v, 0, 1)]);
    }
    if (!pts.length) return null;
    let size = +s.size;
    if (!(size > 0)) size = 8;
    const color = (typeof s.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(s.color)) ? s.color.toLowerCase() : '#ff4fd8';
    return { view: s.view, brush: s.brush, color: color, size: clamp(size, 1, 48), mirror: !!s.mirror, pulse: !!s.pulse, pts: pts };
  }
  function normalize(data) {
    const slots = [0, 1, 2].map(function (i) {
      const s = data && data.slots && data.slots[i];
      const strokes = [];
      const raw = s && Array.isArray(s.strokes) ? s.strokes : [];
      for (let k = 0; k < raw.length && strokes.length < 400; k++) {
        const c = cleanStroke(raw[k]);
        if (c) strokes.push(c);
      }
      return { name: clipName(s && s.name, 'SLOT ' + (i + 1)), strokes: strokes, updatedAt: (s && +s.updatedAt) || 0 };
    });
    let active = data && data.activeSlot | 0;
    if (active < 0 || active > 2) active = 0;
    return { version: 1, enabled: !data || data.enabled !== false, activeSlot: active, slots: slots };
  }
  function readStore() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      return normalize(JSON.parse(raw));
    } catch (e) { return blank(); }
  }
  function slot() { return state.slots[state.activeSlot] || state.slots[0]; }
  function flipU(s) {
    const pts = s.pts.map(function (p) { return [1 - p[0], p[1]]; });
    return { view: s.view, brush: s.brush, color: s.color, size: s.size, mirror: s.mirror, pulse: s.pulse, pts: pts };
  }
  function jobsFor(s, view) {
    const out = [];
    if (s.view === view) out.push(s);
    if (s.mirror && s.view === view && (view === 'top' || view === 'hood')) out.push(flipU(s));
    if (s.mirror && s.view === 'sideL' && view === 'sideR') out.push(s);
    if (s.mirror && s.view === 'sideR' && view === 'sideL') out.push(s);
    return out;
  }

  function paintStroke(ctx, s, w, h) {
    const src = s.pts;
    if (!src || !src.length) return;
    const px = [];
    for (let i = 0; i < src.length; i++) px.push([src[i][0] * w, src[i][1] * h]);
    const lw = Math.max(1.25, s.size * (w / 260));
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (s.brush === 'eraser') erase(ctx, px, lw * 1.4);
    else if (s.brush === 'laser') tube(ctx, px, Math.max(1, lw * 0.38), s.color, true);
    else if (s.brush === 'sparkle') sparkle(ctx, px, lw, s.color);
    else if (s.brush === 'rainbow') rainbow(ctx, px, lw, s.size);
    else if (s.size >= 16) spray(ctx, px, lw, s.color);
    else tube(ctx, px, lw, s.color, false);
    ctx.restore();
  }
  function pathOf(ctx, px) {
    ctx.beginPath();
    ctx.moveTo(px[0][0], px[0][1]);
    if (px.length === 1) ctx.lineTo(px[0][0] + 0.2, px[0][1]);
    else for (let i = 1; i < px.length; i++) ctx.lineTo(px[i][0], px[i][1]);
  }
  function tube(ctx, px, lw, color, laser) {
    pathOf(ctx, px);
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = laser ? lw * 3.2 : lw * 1.7;
    ctx.lineWidth = lw;
    ctx.globalAlpha = laser ? 1 : 0.95;
    ctx.stroke();
    ctx.shadowBlur = laser ? lw : lw * 0.35;
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = laser ? 0.95 : 0.8;
    ctx.lineWidth = Math.max(1, lw * (laser ? 0.45 : 0.32));
    ctx.stroke();
  }
  function spray(ctx, px, lw, color) {
    ctx.shadowBlur = 0;
    for (let i = 0; i < px.length; i++) {
      const x = px[i][0] + Math.sin(i * 12.989) * lw * 0.35;
      const y = px[i][1] + Math.cos(i * 78.233) * lw * 0.35;
      const g = ctx.createRadialGradient(x, y, 0, x, y, lw);
      g.addColorStop(0, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(x, y, lw, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function rainbow(ctx, px, lw, size) {
    const sprayish = size >= 16;
    const thin = size <= 5;
    const segs = Math.max(1, px.length - 1);
    for (let i = 1; i <= segs; i++) {
      const a = px[Math.max(0, i - 1)], b = px[Math.min(px.length - 1, i)];
      const hue = (i / (segs + 1)) * 360;
      const color = 'hsl(' + hue + ',100%,64%)';
      if (sprayish) spray(ctx, [a, b], lw, color);
      else tube(ctx, [a, b], thin ? Math.max(1, lw * 0.4) : lw, color, thin);
    }
    if (px.length === 1) tube(ctx, px, lw, 'hsl(320,100%,64%)', thin);
  }
  function sparkle(ctx, px, lw, color) {
    tube(ctx, px, Math.max(1, lw * 0.28), color, true);
    const step = Math.max(10, lw * 1.6);
    let run = 0;
    for (let i = 0; i < px.length; i++) {
      if (i > 0) run += Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1]);
      if (i && run < step) continue;
      run = 0;
      star(ctx, px[i][0], px[i][1], Math.max(4, lw * 0.85), color);
    }
  }
  function star(ctx, x, y, r, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * 0.38 : r;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = r * 1.6;
    ctx.globalAlpha = 0.95;
    ctx.fill();
    ctx.restore();
  }
  function erase(ctx, px, lw) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 0;
    ctx.lineWidth = lw;
    pathOf(ctx, px);
    ctx.stroke();
  }

  function ensureCvs() {
    if (cvs.top) return;
    ['top', 'hood', 'sideL', 'sideR'].forEach(function (v) {
      const b = document.createElement('canvas');
      const p = document.createElement('canvas');
      b.width = b.height = p.width = p.height = 512;
      cvs[v] = { base: b, pulse: p };
    });
  }
  function canvasLit(c) {
    let g;
    try { g = c.getContext('2d', { willReadFrequently: true }); } catch (e) { g = c.getContext('2d'); }
    if (!g) return false;
    let data;
    try { data = g.getImageData(0, 0, c.width, c.height).data; } catch (e) { return true; }
    for (let i = 3; i < data.length; i += 64) if (data[i] > 12) return true;
    return false;
  }
  function drawList(canvas, strokes, view, pulseOnly) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < strokes.length; i++) {
      const jobs = jobsFor(strokes[i], view);
      for (let j = 0; j < jobs.length; j++) {
        const job = jobs[j];
        if (pulseOnly) {
          if (job.brush === 'eraser' || job.pulse) paintStroke(ctx, job, w, h);
        } else paintStroke(ctx, job, w, h);
      }
    }
  }
  function bakeCanvases() {
    if (typeof document === 'undefined') return null;
    ensureCvs();
    const strokes = (state.enabled && slot()) ? slot().strokes : [];
    const names = ['top', 'hood', 'sideL', 'sideR'];
    for (let i = 0; i < names.length; i++) {
      const v = names[i];
      drawList(cvs[v].base, strokes, v, false);
      drawList(cvs[v].pulse, strokes, v, true);
      lit[v] = { base: canvasLit(cvs[v].base), pulse: canvasLit(cvs[v].pulse) };
    }
    touchTextures();
    return { top: cvs.top.base, hood: cvs.hood.base, sideL: cvs.sideL.base, sideR: cvs.sideR.base };
  }
  function touchTextures() {
    for (let i = 0; i < meshes.length; i++) {
      const m = meshes[i];
      if (!m.userData || !m.userData.npView || !m.material) continue;
      const bag = lit[m.userData.npView];
      const on = !!(state.enabled && bag && (m.userData.npPulse ? bag.pulse : bag.base));
      m.userData.lit = on;
      if (!m.userData.npPulse) m.visible = on;
      const t = m.material && m.material.map;
      if (t) t.needsUpdate = true;
    }
  }

  function hasPaint() {
    if (!state.enabled) return false;
    const strokes = slot().strokes;
    for (let i = 0; i < strokes.length; i++) if (strokes[i].brush !== 'eraser' && strokes[i].pts.length) return true;
    return false;
  }
  function load() { return JSON.parse(JSON.stringify(state)); }
  function write() {
    const json = JSON.stringify(state);
    lastJson = json;
    try { localStorage.setItem(KEY, json); } catch (e) {}
    try { if (ch) ch.postMessage({ tab: TAB, json: json }); } catch (e) {}
  }
  function save(data) {
    state = normalize(data || state);
    if (slot()) slot().updatedAt = Date.now();
    write();
    bakeCanvases();
    const X = carX();
    if (X) applyToCar(X);
    if (studio) { syncUI(); requestDraw(); }
    armPulse();
    return load();
  }
  function ingest(raw) {
    if (!raw) return;
    let data;
    try { data = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return; }
    const next = normalize(data);
    const json = JSON.stringify(next);
    if (json === lastJson) return;
    state = next;
    lastJson = json;
    bakeCanvases();
    const X = carX();
    if (X) applyToCar(X);
    if (studio) { syncUI(); requestDraw(); }
    armPulse();
  }
  function carX() {
    const X = window.ZD && window.ZD.Xray;
    return (X && X.ready && X.car) ? X : null;
  }

  function armPulse() {
    if (pulseLoop) return;
    const loop = function () {
      if (!tickPulse()) { pulseLoop = false; return; }
      requestAnimationFrame(loop);
    };
    pulseLoop = true;
    requestAnimationFrame(loop);
  }
  function tickPulse() {
    let any = false;
    const nos = !!(window.P && window.P.nosT);
    const t = (window.performance ? performance.now() : Date.now()) * 0.001;
    const wave = nos ? (0.55 + 0.45 * Math.sin(t * 16)) : (0.28 + 0.32 * Math.sin(t * 3.1));
    const boost = nos ? 1 : 0.72;
    for (let i = 0; i < pulseMeshes.length; i++) {
      const m = pulseMeshes[i];
      if (!m.userData.lit) { m.visible = false; continue; }
      any = true;
      m.visible = true;
      if (m.material) m.material.opacity = clamp(wave * boost, 0.12, 1);
    }
    return any;
  }

  function pct(arr, p) {
    if (!arr.length) return null;
    const s = arr.slice().sort(function (a, b) { return a - b; });
    return s[Math.max(0, Math.min(s.length - 1, Math.floor(p * (s.length - 1))))];
  }
  function measure(X) {
    const V = X.THREE_Vector3;
    if (!V) return null;
    X.car.updateMatrixWorld(true);
    const inv = X.car.matrixWorld.clone();
    if (typeof inv.invert !== 'function') return null;
    inv.invert();
    const xs = [], ys = [], zs = [], pts = [];
    X.car.traverse(function (o) {
      if (!o.isMesh || (o.userData && o.userData.neonPaint)) return;
      const mat = o.userData && o.userData.mat;
      if (mat && mat !== 'BODY' && mat !== 'CARBON') return;
      const attr = o.geometry && o.geometry.attributes && o.geometry.attributes.position;
      if (!attr || !attr.count) return;
      const step = Math.max(1, Math.floor(attr.count / 160));
      const p = new V();
      for (let i = 0; i < attr.count; i += step) {
        p.fromBufferAttribute(attr, i).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        if (p.x !== p.x) continue;
        xs.push(p.x); ys.push(p.y); zs.push(Math.abs(p.z));
        pts.push(p.x, p.y, p.z);
      }
    });
    if (xs.length < 40 && X.THREE_Box3) {
      const box = new X.THREE_Box3().setFromObject(X.car);
      if (!box || box.isEmpty && box.isEmpty()) return null;
      return fallbackBox(box.min, box.max);
    }
    const xRear = pct(xs, 0.02), xNose = pct(xs, 0.98);
    const z = pct(zs, 0.86) || 0.9;
    const L = (xNose - xRear) || 4.2;
    function band(v0, v1, zMax, q) {
      const found = [];
      for (let i = 0; i < pts.length; i += 3) {
        const v = (xNose - pts[i]) / L;
        if (v < v0 || v > v1) continue;
        if (Math.abs(pts[i + 2]) > zMax) continue;
        found.push(pts[i + 1]);
      }
      return pct(found, q);
    }
    let hoodY = band(0.04, 0.26, 0.42, 0.72);
    let roofY = band(0.34, 0.54, 0.36, 0.9);
    let deckY = band(0.78, 0.96, 0.34, 0.42);
    const yMin = pct(ys, 0.02) || 0;
    const yMax = pct(ys, 0.98) || 1.2;
    if (hoodY == null) hoodY = yMin + (yMax - yMin) * 0.48;
    if (roofY == null) roofY = yMin + (yMax - yMin) * 0.86;
    if (deckY == null) deckY = yMin + (yMax - yMin) * 0.5;
    // A spoiler or antenna can pull the roof percentile way above the cabin.
    // Keep the sheet on the painted shell, a little above the hood.
    if (roofY > hoodY + 0.55) roofY = hoodY + 0.42;
    if (deckY < hoodY * 0.75) deckY = hoodY * 0.92;
    if (deckY > roofY) deckY = hoodY;
    return { xRear: xRear, xNose: xNose, z: z, hoodY: hoodY, roofY: roofY, deckY: deckY };
  }
  function fallbackBox(min, max) {
    const H = max.y - min.y;
    return {
      xRear: min.x, xNose: max.x, z: Math.min(1.05, (max.z - min.z) * 0.42),
      hoodY: min.y + H * 0.5, roofY: min.y + H * 0.86, deckY: min.y + H * 0.52
    };
  }
  function xAt(v, m) { return m.xNose - v * (m.xNose - m.xRear); }
  function sheetGeo(X, segs, z) {
    const pos = [], uv = [], idx = [];
    for (let i = 0; i < segs.length - 1; i++) {
      const a = segs[i], b = segs[i + 1];
      const o = pos.length / 3;
      pos.push(a.x, a.y, -z, a.x, a.y, z, b.x, b.y, z, b.x, b.y, -z);
      uv.push(0, a.v, 1, a.v, 1, b.v, 0, b.v);
      idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
    }
    return makeGeo(X, pos, uv, idx);
  }
  function makeGeo(X, pos, uv, index) {
    const Geo = X.shadow.geometry.constructor;
    const Attr = X.shadow.geometry.attributes.position.constructor;
    const g = new Geo();
    if (g.deleteAttribute) { g.deleteAttribute('normal'); g.deleteAttribute('uv'); g.deleteAttribute('position'); }
    if (g.clearGroups) g.clearGroups();
    g.setAttribute('position', new Attr(new Float32Array(pos), 3));
    g.setAttribute('uv', new Attr(new Float32Array(uv), 2));
    g.setIndex(index);
    return g;
  }
  function makeMat(X, canvas) {
    const seed = X.shadow && X.shadow.material;
    const mapSeed = X.brakeSprites && X.brakeSprites[0] && X.brakeSprites[0].material && X.brakeSprites[0].material.map;
    if (!seed || !seed.clone || !mapSeed || !mapSeed.clone) return null;
    const mat = seed.clone();
    const tex = mapSeed.clone();
    tex.image = canvas;
    tex.needsUpdate = true;
    tex.flipY = true;
    tex.generateMipmaps = false;
    if ('minFilter' in tex) tex.minFilter = 1006;
    if ('magFilter' in tex) tex.magFilter = 1006;
    mat.map = tex;
    if (mat.color && mat.color.set) mat.color.set('#ffffff');
    mat.transparent = true;
    mat.opacity = 1;
    mat.depthWrite = false;
    mat.depthTest = true;
    mat.blending = 2;
    mat.side = 2;
    mat.fog = false;
    if ('toneMapped' in mat) mat.toneMapped = false;
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -2;
    mat.polygonOffsetUnits = -2;
    return mat;
  }
  function makeMesh(X, geo, mat, view, pulse) {
    const m = new X.shadow.constructor(geo, mat);
    m.name = 'np-' + view + (pulse ? '-pulse' : '');
    m.userData.neonPaint = 1;
    m.userData.crew = 1;
    m.userData.npView = view;
    m.userData.npPulse = pulse ? 1 : 0;
    m.frustumCulled = false;
    m.renderOrder = pulse ? 10 : 9;
    m.castShadow = false;
    m.receiveShadow = false;
    const bag = lit[view];
    m.userData.lit = !!(bag && (pulse ? bag.pulse : bag.base));
    m.visible = pulse ? false : !!m.userData.lit;
    meshes.push(m);
    if (pulse) pulseMeshes.push(m);
    return m;
  }
  function dropMesh(m) {
    if (!m) return;
    if (m.parent) m.parent.remove(m);
    if (m.geometry && m.geometry.dispose) m.geometry.dispose();
    if (m.material) {
      if (m.material.map && m.material.map.dispose) m.material.map.dispose();
      if (m.material.dispose) m.material.dispose();
    }
  }
  function strip(X) {
    const kill = [];
    if (X && X.car) X.car.traverse(function (o) { if (o.userData && o.userData.neonPaint) kill.push(o); });
    for (let i = 0; i < kill.length; i++) dropMesh(kill[i]);
    meshes.length = 0;
    pulseMeshes.length = 0;
    builtCar = null;
    doorsHooked = false;
  }
  function addPair(X, parent, geo, view) {
    const base = makeMat(X, cvs[view].base);
    const pulse = makeMat(X, cvs[view].pulse);
    if (!base || !pulse) return;
    const a = makeMesh(X, geo, base, view, 0);
    const b = makeMesh(X, geo.clone ? geo.clone() : geo, pulse, view, 1);
    parent.add(a);
    parent.add(b);
  }
  function topSegs(m, lift) {
    const rows = [
      { vDown: 1, y: m.deckY },
      { vDown: 0.74, y: m.deckY },
      { vDown: 0.56, y: m.roofY },
      { vDown: 0.34, y: m.roofY },
      { vDown: 0.28, y: m.hoodY },
      { vDown: 0, y: m.hoodY }
    ];
    return rows.map(function (s) {
      return { x: xAt(s.vDown, m), y: s.y + lift, v: 1 - s.vDown };
    });
  }
  function hoodSegs(m, lift) {
    const rows = [
      { vh: 1, y: m.roofY },
      { vh: 0.58, y: m.roofY },
      { vh: 0.46, y: m.hoodY },
      { vh: 0, y: m.hoodY }
    ];
    return rows.map(function (s) {
      return { x: xAt(s.vh * HOOD_V, m), y: s.y + lift, v: 1 - s.vh };
    });
  }
  function localBox(host, V) {
    host.updateMatrixWorld(true);
    const inv = host.matrixWorld.clone();
    if (typeof inv.invert !== 'function') return null;
    inv.invert();
    const min = new V(1e9, 1e9, 1e9), max = new V(-1e9, -1e9, -1e9);
    let n = 0;
    host.traverse(function (o) {
      if (!o.isMesh || (o.userData && o.userData.neonPaint)) return;
      const mat = o.userData && o.userData.mat;
      if (mat && mat !== 'BODY' && mat !== 'BLACK' && mat !== 'CARBON') return;
      const attr = o.geometry && o.geometry.attributes && o.geometry.attributes.position;
      if (!attr) return;
      const step = Math.max(1, Math.floor(attr.count / 180));
      const p = new V();
      for (let i = 0; i < attr.count; i += step) {
        p.fromBufferAttribute(attr, i).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        if (p.x < min.x) min.x = p.x;
        if (p.y < min.y) min.y = p.y;
        if (p.z < min.z) min.z = p.z;
        if (p.x > max.x) max.x = p.x;
        if (p.y > max.y) max.y = p.y;
        if (p.z > max.z) max.z = p.z;
        n++;
      }
    });
    if (n < 12) return null;
    if (max.x - min.x < 0.15 || max.y - min.y < 0.12) return null;
    if (max.x - min.x > 3.2) return null;
    return { min: min, max: max };
  }
  function doorSkinBox(host, V) {
    host.updateMatrixWorld(true);
    const inv = host.matrixWorld.clone();
    if (typeof inv.invert !== 'function') return null;
    inv.invert();
    let best = null;
    host.traverse(function (o) {
      if (!o.isMesh || (o.userData && o.userData.neonPaint)) return;
      if (!o.userData || o.userData.mat !== 'BODY') return;
      const attr = o.geometry && o.geometry.attributes && o.geometry.attributes.position;
      if (!attr || !attr.count) return;
      const min = new V(1e9, 1e9, 1e9), max = new V(-1e9, -1e9, -1e9);
      const step = Math.max(1, Math.floor(attr.count / 140));
      const p = new V();
      let n = 0;
      for (let i = 0; i < attr.count; i += step) {
        p.fromBufferAttribute(attr, i).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        if (p.x < min.x) min.x = p.x;
        if (p.y < min.y) min.y = p.y;
        if (p.z < min.z) min.z = p.z;
        if (p.x > max.x) max.x = p.x;
        if (p.y > max.y) max.y = p.y;
        if (p.z > max.z) max.z = p.z;
        n++;
      }
      const area = (max.x - min.x) * (max.y - min.y);
      if (n < 16 || area < 0.08) return;
      if (!best || area > best.area) best = { min: min, max: max, area: area };
    });
    return best;
  }
  function doorGeo(X, box, side) {
    // Sit on the outer skin. Trim and mirrors stick out past the door panel,
    // so the full-part bbox would float the decal off the paint.
    const z = side > 0 ? box.max.z + 0.02 : box.min.z - 0.02;
    const ex = (box.max.x - box.min.x) * 0.04;
    const ey = (box.max.y - box.min.y) * 0.05;
    const xa = box.min.x + ex, xb = box.max.x - ex, ya = box.min.y + ey * 0.4, yb = box.max.y - ey;
    const pos = [xa, yb, z, xb, yb, z, xb, ya, z, xa, ya, z];
    const uv = [0, 1, 1, 1, 1, 0, 0, 0];
    return makeGeo(X, pos, uv, [0, 1, 2, 0, 2, 3]);
  }
  function doorHosts() {
    const S = window.ZGL && window.ZGL.S;
    if (!S) return null;
    const out = [];
    function push(group, side) {
      if (!group || !group.isObject3D || !side) return;
      out.push({ group: group, side: side > 0 ? 1 : -1, view: side > 0 ? 'sideR' : 'sideL' });
    }
    if (S.doorL && S.doorL.isObject3D) push(S.doorL, -1);
    if (S.doorR && S.doorR.isObject3D) push(S.doorR, 1);
    if (out.length >= 2) return out;
    out.length = 0;
    const hinges = S.hingeD || [];
    for (let i = 0; i < hinges.length; i++) {
      const p = hinges[i];
      const p2 = p && p.userData && p.userData.p2;
      const side = p2 && p2.userData ? p2.userData.side : 0;
      push(p, side);
    }
    return out.length ? out : null;
  }
  function hookDoors(X) {
    try { if (window.ZGL && window.ZGL.ensure) window.ZGL.ensure(); } catch (e) {}
    const hosts = doorHosts();
    if (!hosts || !X.THREE_Vector3) return false;
    let n = 0;
    for (let i = 0; i < hosts.length; i++) {
      const h = hosts[i];
      const box = doorSkinBox(h.group, X.THREE_Vector3) || localBox(h.group, X.THREE_Vector3);
      if (!box) continue;
      addPair(X, h.group, doorGeo(X, box, h.side), h.view);
      // The skin is a few millimetres proud of this plane once the wing lays flat.
      // Skip the depth test so the decal stays visible on the open door.
      for (let k = 0; k < meshes.length; k++) {
        const m = meshes[k];
        if (!m.material || !m.userData || m.userData.npView !== h.view) continue;
        m.material.depthTest = false;
        m.renderOrder = m.userData.npPulse ? 22 : 21;
      }
      n++;
    }
    return n >= 2;
  }
  function fallbackDoors(X, m, parent) {
    const L = m.xNose - m.xRear;
    const x0 = m.xRear + L * 0.36, x1 = m.xRear + L * 0.68;
    const y0 = Math.min(m.hoodY, m.roofY) * 0.55, y1 = m.roofY * 0.92;
    function geo(side) {
      const z = side > 0 ? m.z + 0.02 : -m.z - 0.02;
      const pos = [x0, y1, z, x1, y1, z, x1, y0, z, x0, y0, z];
      return makeGeo(X, pos, [0, 1, 1, 1, 1, 0, 0, 0], [0, 1, 2, 0, 2, 3]);
    }
    addPair(X, parent, geo(-1), 'sideL');
    addPair(X, parent, geo(1), 'sideR');
    for (let i = 0; i < meshes.length; i++) {
      const view = meshes[i].userData && meshes[i].userData.npView;
      if (view === 'sideL' || view === 'sideR') meshes[i].userData.npFallback = 1;
    }
  }
  function dropFallbacks() {
    for (let i = meshes.length - 1; i >= 0; i--) {
      const m = meshes[i];
      if (!m.userData || !m.userData.npFallback) continue;
      dropMesh(m);
      meshes.splice(i, 1);
      const p = pulseMeshes.indexOf(m);
      if (p >= 0) pulseMeshes.splice(p, 1);
    }
  }
  function applyToCar(X) {
    try {
      if (!X || !X.ready || !X.car || !X.shadow || !X.shadow.material) return false;
      bakeCanvases();
      if (builtCar !== X.car || !meshes.length) {
        strip(X);
        metrics = measure(X);
        if (!metrics) return false;
        const Group = X.car.constructor;
        const root = new Group();
        root.name = 'neonpaint';
        root.userData.neonPaint = 1;
        root.userData.crew = 1;
        X.car.add(root);
        meshes.push(root);
        addPair(X, root, sheetGeo(X, topSegs(metrics, 0.028), metrics.z * 0.92), 'top');
        addPair(X, root, sheetGeo(X, hoodSegs(metrics, 0.04), metrics.z * 0.78), 'hood');
        doorsHooked = hookDoors(X);
        if (!doorsHooked) fallbackDoors(X, metrics, root);
        builtCar = X.car;
      } else {
        touchTextures();
        if (!doorsHooked && hookDoors(X)) {
          dropFallbacks();
          doorsHooked = true;
        }
      }
      armPulse();
      return true;
    } catch (e) {
      window.NEON_PAINT._err = String(e && e.stack || e);
      return false;
    }
  }

  function ellipse(cx, cy, rx, ry, n) {
    const p = [];
    for (let i = 0; i <= n; i++) {
      const a = i / n * Math.PI * 2;
      p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return p;
  }
  function heartPath() {
    const p = [];
    for (let i = 0; i <= 42; i++) {
      const t = i / 42 * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      p.push([x / 18, -y / 18]);
    }
    return p;
  }
  function starPath() {
    const p = [];
    for (let i = 0; i <= 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 ? 0.42 : 1;
      p.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return p;
  }
  const STAMPS = {
    bolt: function () { return [[[0.08, -0.52], [-0.28, 0.02], [0.06, -0.02], [-0.1, 0.52], [0.32, -0.06], [0.02, 0.04], [0.08, -0.52]]]; },
    star: function () { return [starPath()]; },
    crown: function () { return [[[-0.48, 0.18], [-0.48, -0.28], [-0.22, -0.28], [-0.22, 0.22], [0, -0.08], [0.22, 0.22], [0.22, -0.28], [0.48, -0.28], [0.48, 0.18], [0.22, 0.18], [0, 0.48], [-0.22, 0.18], [-0.48, 0.18]]]; },
    heart: function () { return [heartPath()]; },
    flame: function () { return [[[0, 0.52], [0.26, 0.08], [0.1, -0.12], [0.32, -0.52], [0, -0.16], [-0.32, -0.52], [-0.1, -0.12], [-0.26, 0.08], [0, 0.52]]]; },
    note: function () { return [[[0.12, 0.46], [0.12, -0.42], [0.46, -0.22]], ellipse(-0.02, 0.4, 0.24, 0.16, 16)]; },
    z: function () { return [[[-0.42, -0.4], [0.42, -0.4], [-0.42, 0.4], [0.42, 0.4]]]; },
    paw: function () {
      return [ellipse(0, 0.18, 0.34, 0.28, 18), ellipse(-0.28, -0.28, 0.12, 0.14, 12), ellipse(-0.08, -0.4, 0.11, 0.13, 12), ellipse(0.12, -0.4, 0.11, 0.13, 12), ellipse(0.3, -0.26, 0.12, 0.14, 12)];
    }
  };
  function brushNow() {
    const color = ui.color === 'rainbow' ? '#ffffff' : ui.color;
    if (ui.style === 'eraser') return { brush: 'eraser', size: 18, color: '#000000' };
    if (ui.style === 'sparkle') return { brush: 'sparkle', size: 10, color: ui.color === 'rainbow' ? '#ff4fd8' : color };
    if (ui.color === 'rainbow') {
      const size = ui.style === 'laser' ? 3.5 : (ui.style === 'spray' ? 18 : 12);
      return { brush: 'rainbow', size: size, color: '#ffffff' };
    }
    if (ui.style === 'laser') return { brush: 'laser', size: 3.5, color: color };
    if (ui.style === 'spray') return { brush: 'neon', size: 20, color: color };
    return { brush: 'neon', size: 12, color: color };
  }
  function viewKey() { return ui.view === 'doors' ? 'sideL' : ui.view; }

  const TOP_R = [[0.5, 0.02], [0.555, 0.06], [0.6, 0.11], [0.645, 0.19], [0.678, 0.31], [0.698, 0.41], [0.662, 0.49], [0.642, 0.53], [0.662, 0.6], [0.715, 0.68], [0.748, 0.77], [0.75, 0.85], [0.705, 0.92], [0.62, 0.962], [0.5, 0.982]];
  function topPoly() {
    const left = [];
    for (let i = TOP_R.length - 2; i >= 0; i--) left.push([1 - TOP_R[i][0], TOP_R[i][1]]);
    return TOP_R.concat(left);
  }
  function poly(ctx, pts, w, h, vScale) {
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const x = pts[i][0] * w, y = (pts[i][1] / vScale) * h;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.closePath();
  }
  function drawTopSheet(ctx, w, h, vScale) {
    const body = topPoly();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#12343c');
    g.addColorStop(0.45, '#0c1e28');
    g.addColorStop(1, '#101820');
    poly(ctx, body, w, h, vScale);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = Math.max(2, w * 0.012);
    ctx.strokeStyle = '#3ee6ff';
    ctx.shadowColor = '#3ee6ff';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
    const cab = [[0.5, 0.31], [0.57, 0.35], [0.598, 0.41], [0.58, 0.49], [0.54, 0.54], [0.5, 0.56]];
    const cabL = [];
    for (let i = cab.length - 2; i >= 0; i--) cabL.push([1 - cab[i][0], cab[i][1]]);
    poly(ctx, cab.concat(cabL), w, h, vScale);
    ctx.fillStyle = 'rgba(18, 36, 62, 0.92)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(62,230,255,0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#d7fbff';
    ctx.shadowColor = '#3ee6ff';
    ctx.shadowBlur = 8;
    [[0.40, 0.07], [0.60, 0.07]].forEach(function (p) {
      ctx.beginPath();
      ctx.ellipse(p[0] * w, (p[1] / vScale) * h, w * 0.045, h * 0.018 / vScale, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowColor = '#ff2a3d';
    ctx.fillStyle = '#ff2a3d';
    [[0.38, 0.955], [0.62, 0.955]].forEach(function (p) {
      if (p[1] / vScale > 1.02) return;
      ctx.beginPath();
      ctx.ellipse(p[0] * w, (p[1] / vScale) * h, w * 0.04, h * 0.016 / vScale, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    if (ui.mirror) {
      ctx.strokeStyle = 'rgba(255,225,77,0.55)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(w * 0.5, 4);
      ctx.lineTo(w * 0.5, h - 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = '#9b5cff';
    ctx.font = '700 ' + Math.max(10, w * 0.045) + 'px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NOSE', w * 0.5, Math.max(16, h * 0.07));
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '700 ' + Math.max(9, w * 0.034) + 'px Orbitron, sans-serif';
    ctx.fillText('370Z', w * 0.5, h * 0.47);
  }
  function drawDoor(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#163842');
    g.addColorStop(1, '#0c1820');
    round(ctx, w * 0.06, h * 0.08, w * 0.9, h * 0.84, 18);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#3ee6ff';
    ctx.shadowColor = '#3ee6ff';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(w * 0.16, h * 0.3);
    ctx.lineTo(w * 0.48, h * 0.2);
    ctx.lineTo(w * 0.84, h * 0.32);
    ctx.lineTo(w * 0.78, h * 0.5);
    ctx.lineTo(w * 0.2, h * 0.52);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 32, 58, 0.95)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(62,230,255,0.4)';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,79,216,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.62);
    ctx.lineTo(w * 0.9, h * 0.56);
    ctx.stroke();
    ctx.fillStyle = '#ffe14d';
    ctx.font = '800 ' + Math.max(12, w * 0.09) + 'px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Z', w * 0.5, h * 0.74);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '700 ' + Math.max(8, w * 0.045) + 'px Orbitron, sans-serif';
    ctx.fillText('NOSE →', w * 0.72, h * 0.16);
  }
  function round(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function paintJobs(ctx, strokes, view, w, h) {
    for (let i = 0; i < strokes.length; i++) {
      const jobs = jobsFor(strokes[i], view);
      for (let j = 0; j < jobs.length; j++) paintStroke(ctx, jobs[j], w, h);
    }
  }
  function drawStage(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#14061f');
    sky.addColorStop(1, '#05020c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(155,92,255,0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    if (ui.mode === '3d') { draw3d(ctx, w, h); return; }
    const strokes = slot().strokes.slice();
    if (live) strokes.push(live);
    if (ui.view === 'doors') {
      const gap = Math.max(10, w * 0.03);
      const pw = (w - gap * 3) / 2;
      const ph = h * 0.9;
      const y = (h - ph) / 2;
      const left = { x: gap, y: y, w: pw, h: ph };
      const right = { x: gap * 2 + pw, y: y, w: pw, h: ph };
      ctx.save(); ctx.translate(left.x, left.y); drawDoor(ctx, pw, ph); ctx.restore();
      ctx.save(); ctx.translate(right.x, right.y); drawDoor(ctx, pw, ph); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(left.x, left.y, pw, ph); ctx.clip(); ctx.translate(left.x, left.y);
      paintJobs(ctx, strokes, 'sideL', pw, ph); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(right.x, right.y, pw, ph); ctx.clip(); ctx.translate(right.x, right.y);
      if (ui.mirror) paintJobs(ctx, strokes, 'sideR', pw, ph);
      else { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, pw, ph); }
      ctx.restore();
      label(ctx, left.x + pw / 2, left.y + 16, 'LEFT DOOR');
      label(ctx, right.x + pw / 2, right.y + 16, ui.mirror ? 'RIGHT DOOR' : 'MIRROR OFF');
      stageRects = { left: left, right: right, one: null };
    } else {
      const pad = ui.view === 'hood' ? 0.08 : 0.06;
      const aw = w * (1 - pad * 2), ah = h * 0.94;
      const rect = { x: (w - aw) / 2, y: (h - ah) / 2, w: aw, h: ah };
      ctx.save();
      ctx.beginPath(); ctx.rect(rect.x, rect.y, aw, ah); ctx.clip();
      ctx.translate(rect.x, rect.y);
      drawTopSheet(ctx, aw, ah, ui.view === 'hood' ? HOOD_V : 1);
      paintJobs(ctx, strokes, ui.view, aw, ah);
      ctx.restore();
      stageRects = { left: null, right: null, one: rect };
    }
  }
  function label(ctx, x, y, text) {
    ctx.font = '700 11px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(5,2,12,0.72)';
    ctx.fillRect(x - 52, y - 10, 104, 16);
    ctx.fillStyle = '#ffe14d';
    ctx.fillText(text, x, y + 2);
  }
  let stageRects = { one: null, left: null, right: null };

  function draw3d(ctx, w, h) {
    const scale = Math.min(w, h) * 0.92;
    const cx = w * 0.5, cy = h * 0.56;
    const yaw = ui.yaw, pitch = ui.pitch;
    const body = [
      [[-1, 0.16, -0.34], [1, 0.14, -0.28], [1, 0.14, 0.28], [-1, 0.16, 0.34], '#102830'],
      [[0.15, 0.36, -0.30], [0.98, 0.3, -0.16], [0.98, 0.3, 0.16], [0.15, 0.36, 0.30], '#143844'],
      [[-0.22, 0.6, -0.22], [0.2, 0.56, -0.2], [0.2, 0.56, 0.2], [-0.22, 0.6, 0.22], '#0e2830'],
      [[-1.02, 0.38, -0.3], [-0.22, 0.42, -0.26], [-0.22, 0.42, 0.26], [-1.02, 0.38, 0.3], '#143844'],
      [[0.12, 0.36, -0.24], [0.24, 0.58, -0.18], [0.24, 0.58, 0.18], [0.12, 0.36, 0.24], '#1a3c5c'],
      [[-0.95, 0.16, -0.34], [0.9, 0.14, -0.3], [0.55, 0.4, -0.28], [-0.9, 0.42, -0.32], '#0c222a'],
      [[-0.95, 0.16, 0.34], [-0.9, 0.42, 0.32], [0.55, 0.4, 0.28], [0.9, 0.14, 0.3], '#0c222a']
    ];
    const drawn = [];
    for (let i = 0; i < body.length; i++) {
      const q = body[i];
      const p = [];
      let z = 0;
      for (let k = 0; k < 4; k++) {
        const c = project(q[k][0], q[k][1], q[k][2], yaw, pitch, cx, cy, scale);
        p.push(c);
        z += c[2];
      }
      drawn.push({ p: p, z: z / 4, color: q[4] });
    }
    drawn.sort(function (a, b) { return b.z - a.z; });
    for (let i = 0; i < drawn.length; i++) paintQuad(ctx, drawn[i]);
    paint3dStrokes(ctx, yaw, pitch, cx, cy, scale);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffe14d';
    ctx.font = '700 12px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DRAG TO SPIN', w / 2, h - 12);
  }
  function modelOf(view, u, v) {
    if (view === 'sideL' || view === 'sideR') {
      return [-0.18 + u * 0.82, 0.50 - v * 0.28, view === 'sideL' ? -0.43 : 0.43];
    }
    const vv = view === 'hood' ? v * HOOD_V : v;
    const x = 1.02 - vv * 2.04;
    const z = (u - 0.5) * 0.56;
    let y = 0.46;
    if (vv < 0.28) y = 0.40;
    else if (vv < 0.56) y = 0.66;
    else y = 0.50;
    return [x, y + 0.04, z];
  }
  function paint3dStrokes(ctx, yaw, pitch, cx, cy, scale) {
    const strokes = slot().strokes;
    const views = ['top', 'hood', 'sideL', 'sideR'];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let s = 0; s < strokes.length; s++) {
      for (let vi = 0; vi < views.length; vi++) {
        const jobs = jobsFor(strokes[s], views[vi]);
        for (let j = 0; j < jobs.length; j++) {
          const job = jobs[j];
          if (!job.pts.length || job.brush === 'eraser') continue;
          ctx.beginPath();
          for (let i = 0; i < job.pts.length; i++) {
            const m = modelOf(views[vi], job.pts[i][0], job.pts[i][1]);
            const p = project(m[0], m[1], m[2], yaw, pitch, cx, cy, scale);
            if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
          }
          const rainbow = job.brush === 'rainbow';
          const color = rainbow ? 'hsl(' + ((s * 47) % 360) + ',100%,64%)' : job.color;
          const lw = Math.max(2.2, job.size * 0.42);
          ctx.strokeStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = job.brush === 'laser' ? 10 : 14;
          ctx.lineWidth = job.brush === 'laser' ? Math.max(1.6, lw * 0.4) : lw;
          ctx.stroke();
        }
      }
    }
    ctx.shadowBlur = 0;
  }
  function project(x, y, z, yaw, pitch, cx, cy, scale) {
    const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
    const x1 = x * cyaw + z * syaw;
    const z1 = -x * syaw + z * cyaw;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const y2 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    const f = scale / (z2 + 4.4);
    return [cx + x1 * f, cy - y2 * f, z2];
  }
  function paintQuad(ctx, q) {
    ctx.beginPath();
    ctx.moveTo(q.p[0][0], q.p[0][1]);
    for (let i = 1; i < 4; i++) ctx.lineTo(q.p[i][0], q.p[i][1]);
    ctx.closePath();
    ctx.fillStyle = q.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(62,230,255,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  let cssDone = false;
  function ensureCss() {
    if (cssDone || document.getElementById('np-css')) return;
    cssDone = true;
    const s = document.createElement('style');
    s.id = 'np-css';
    s.textContent = [
      '#np-studio{position:fixed;inset:0;z-index:80;color:#fff;font-family:Orbitron,sans-serif;background:#07010f}',
      '#np-studio.np-modal{background:rgba(5,0,12,.72);padding:8px}',
      '#np-studio *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
      '.np-panel{height:100%;display:flex;flex-direction:column;background:#07010f;min-height:0}',
      '.np-modal .np-panel{border:2px solid #ff4fd8;border-radius:16px;box-shadow:0 0 24px rgba(255,79,216,.4);overflow:hidden}',
      '.np-top{display:flex;align-items:center;gap:6px;padding:4px 8px;height:36px;flex:none}',
      '.np-top h1{margin:0;font:900 13px Orbitron,sans-serif;letter-spacing:1px;color:#fff;text-shadow:0 0 10px #ff4fd8;white-space:nowrap}',
      '.np-status{margin-left:auto;font:700 9px Orbitron,sans-serif;letter-spacing:.6px;color:#ffe14d;white-space:nowrap}',
      '.np-x{width:28px;height:28px;border-radius:8px;border:1.5px solid #3ee6ff;background:transparent;color:#fff;font:900 14px sans-serif;cursor:pointer}',
      '.np-main{flex:1;min-height:0;display:grid;grid-template-columns:1fr 268px}',
      '.np-stage{min-width:0;min-height:0;position:relative}',
      '.np-stage canvas{width:100%;height:100%;display:block;touch-action:none;cursor:crosshair}',
      '.np-tools{overflow:auto;padding:6px;display:flex;flex-direction:column;gap:5px;border-left:1px solid rgba(62,230,255,.35);background:rgba(8,2,18,.65)}',
      '.np-tools button,.np-top button.np-view{font:800 10px Orbitron,sans-serif;letter-spacing:.4px;color:#fff;background:rgba(62,230,255,.08);border:1.5px solid rgba(62,230,255,.55);border-radius:999px;padding:5px 8px;cursor:pointer}',
      '.np-top button.np-view{padding:4px 8px;border-radius:12px}',
      '.np-tools button.on,.np-top button.np-view.on{background:#ffe14d;color:#1a0633;border-color:#fff;box-shadow:0 0 10px #ffe14d}',
      '.np-row{display:flex;flex-wrap:wrap;gap:4px}',
      '.np-row button{flex:1;min-width:0}',
      '.np-colors{gap:4px}',
      '.np-colors button{flex:0 0 26px;width:26px;height:26px;padding:0;border-radius:50%;border:2px solid rgba(255,255,255,.25)}',
      '.np-colors button.on{box-shadow:0 0 8px #fff;border-color:#fff;background:#ffe14d}',
      '.np-stamps button{flex:1 0 21%;font-size:14px;padding:3px 0;border-radius:10px}',
      '.np-save{background:linear-gradient(90deg,#ffe14d,#ff9a2e);color:#1a0633;border:0;font:900 12px Orbitron,sans-serif;border-radius:12px;padding:8px;letter-spacing:1px;box-shadow:0 0 14px rgba(255,225,77,.55);cursor:pointer}',
      '.np-lab{font:700 8px Orbitron,sans-serif;letter-spacing:1px;color:#3ee6ff;margin:0}'
    ].join('');
    document.head.appendChild(s);
  }
  function swatchStyle(c) {
    if (c === 'rainbow') return 'background:conic-gradient(#ff2a3d,#ffe14d,#7dff6b,#3ee6ff,#9b5cff,#ff4fd8,#ff2a3d)';
    return 'background:' + c;
  }
  function studioHTML(page) {
    const colors = COLORS.concat(['rainbow']).map(function (c) {
      const name = c === 'rainbow' ? 'Rainbow' : c;
      return '<button type="button" data-color="' + c + '" title="' + name + '" style="' + swatchStyle(c) + '"></button>';
    }).join('');
    const stamps = [['bolt', '⚡'], ['star', '★'], ['crown', '♛'], ['heart', '♥'], ['flame', '🔥'], ['note', '♪'], ['z', 'Z'], ['paw', '🐾']];
    return '<div class="np-panel"><header class="np-top"><h1>NEON DRAWING</h1>' +
      '<button type="button" class="np-view" data-view="top">TOP</button>' +
      '<button type="button" class="np-view" data-view="hood" title="Hood and roof">HOOD</button>' +
      '<button type="button" class="np-view" data-view="doors">DOORS</button>' +
      '<button type="button" class="np-view" data-view="3d">3D</button>' +
      '<span class="np-status" id="np-status">MIRROR IS ON</span>' +
      (page ? '' : '<button type="button" class="np-x" data-act="close" aria-label="Close">✕</button>') +
      '</header><div class="np-main"><div class="np-stage"><canvas data-canvas="draw"></canvas></div><div class="np-tools">' +
      '<p class="np-lab">COLOR</p><div class="np-row np-colors">' + colors + '</div>' +
      '<p class="np-lab">BRUSH</p><div class="np-row">' +
      '<button type="button" data-brush="neon">TUBE</button><button type="button" data-brush="laser">LASER</button>' +
      '<button type="button" data-brush="spray">SPRAY</button><button type="button" data-brush="sparkle">SPARK</button>' +
      '<button type="button" data-brush="eraser">ERASE</button></div>' +
      '<div class="np-row"><button type="button" data-act="mirror">🪞 MIRROR</button><button type="button" data-act="pulse" title="Pulses brighter when NOS is on">💓 PULSE</button></div>' +
      '<p class="np-lab">STICKERS</p><div class="np-row np-stamps">' +
      stamps.map(function (s) { return '<button type="button" data-stamp="' + s[0] + '" title="' + s[0] + '">' + s[1] + '</button>'; }).join('') +
      '</div><p class="np-lab">GARAGE SLOTS</p><div class="np-row">' +
      '<button type="button" data-act="slot" data-slot="0">1</button><button type="button" data-act="slot" data-slot="1">2</button><button type="button" data-act="slot" data-slot="2">3</button></div>' +
      '<div class="np-row"><button type="button" data-act="undo">UNDO</button><button type="button" data-act="clear">CLEAR</button></div>' +
      '<button type="button" class="np-save" data-act="save">SAVE</button>' +
      '</div></div></div>';
  }
  function setStatus(text) {
    const el = studio && studio.querySelector('#np-status');
    if (el) el.textContent = text;
  }
  function syncUI() {
    if (!studio) return;
    studio.querySelectorAll('[data-view]').forEach(function (b) {
      const on = b.getAttribute('data-view') === '3d' ? ui.mode === '3d' : (ui.mode !== '3d' && b.getAttribute('data-view') === ui.view);
      b.classList.toggle('on', on);
    });
    studio.querySelectorAll('[data-color]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-color') === ui.color); });
    studio.querySelectorAll('[data-brush]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-brush') === ui.style && !ui.stamp); });
    studio.querySelectorAll('[data-stamp]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-stamp') === ui.stamp); });
    const mirror = studio.querySelector('[data-act="mirror"]');
    const pulse = studio.querySelector('[data-act="pulse"]');
    if (mirror) mirror.classList.toggle('on', ui.mirror);
    if (pulse) pulse.classList.toggle('on', ui.pulse);
    studio.querySelectorAll('[data-act="slot"]').forEach(function (b) {
      const i = +b.getAttribute('data-slot');
      const n = state.slots[i] && state.slots[i].strokes.length;
      b.textContent = (i + 1) + (n ? ' ●' : '');
      b.classList.toggle('on', i === state.activeSlot);
    });
  }
  let drawQueued = false;
  function requestDraw() {
    if (drawQueued) return;
    drawQueued = true;
    requestAnimationFrame(function () { drawQueued = false; if (studio) draw(); });
  }
  function draw() {
    const canvas = studio && studio.querySelector('canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(2, Math.round(rect.width * dpr));
    const h = Math.max(2, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const ctx = canvas.getContext('2d');
    drawStage(ctx, w, h);
  }
  function canvasPoint(e, canvas) {
    const b = canvas.getBoundingClientRect();
    return [(e.clientX - b.left) * (canvas.width / b.width), (e.clientY - b.top) * (canvas.height / b.height)];
  }
  function hitArt(x, y) {
    if (ui.mode === '3d') return null;
    if (ui.view === 'doors') {
      const L = stageRects.left, R = stageRects.right;
      if (L && x >= L.x && x <= L.x + L.w && y >= L.y && y <= L.y + L.h) return { rect: L, view: 'sideL' };
      return null;
    }
    const r = stageRects.one;
    if (!r) return null;
    if (x < r.x || y < r.y || x > r.x + r.w || y > r.y + r.h) return null;
    return { rect: r, view: ui.view };
  }
  function commitLive() {
    if (!live || live.pts.length < 1) { live = null; return; }
    slot().strokes.push(live);
    live = null;
    save(state);
    setStatus('SAVED TO THE GARAGE');
  }
  function placeStamp(u, v, view) {
    const spec = STAMPS[ui.stamp];
    if (!spec) return;
    const base = brushNow();
    const paths = spec();
    const scale = 0.12;
    for (let i = 0; i < paths.length; i++) {
      const pts = paths[i].map(function (p) { return [clamp(u + p[0] * scale, 0, 1), clamp(v + p[1] * scale, 0, 1)]; });
      slot().strokes.push({ view: view, brush: base.brush, color: base.color, size: base.size, mirror: ui.view === 'doors' ? ui.mirror : ui.mirror, pulse: ui.pulse, pts: pts });
    }
    save(state);
    setStatus('STICKER SAVED');
  }
  function bind(root) {
    const canvas = root.querySelector('canvas');
    let down = null;
    root.addEventListener('click', function (e) {
      const t = e.target.closest('button');
      if (!t) return;
      const view = t.getAttribute('data-view');
      const color = t.getAttribute('data-color');
      const brush = t.getAttribute('data-brush');
      const stamp = t.getAttribute('data-stamp');
      const act = t.getAttribute('data-act');
      if (view === '3d') { ui.mode = '3d'; setStatus('DRAG TO SPIN THE 370Z'); }
      else if (view) {
        ui.mode = '2d'; ui.view = view;
        setStatus(view === 'hood' ? 'HOOD & ROOF' : view === 'doors' ? 'SIDE DOORS' : 'TOP');
      }
      if (color) { ui.color = color; ui.stamp = ''; }
      if (brush) { ui.style = brush; ui.stamp = ''; }
      if (stamp) { ui.stamp = ui.stamp === stamp ? '' : stamp; if (ui.stamp && ui.style === 'eraser') ui.style = 'neon'; }
      if (act === 'mirror') { ui.mirror = !ui.mirror; setStatus(ui.mirror ? 'MIRROR IS ON' : 'MIRROR IS OFF'); }
      if (act === 'pulse') { ui.pulse = !ui.pulse; setStatus(ui.pulse ? 'NOS GLOW ON' : 'PULSE OFF'); }
      if (act === 'undo') { slot().strokes.pop(); save(state); setStatus('UNDID'); }
      if (act === 'clear') { slot().strokes = []; save(state); setStatus('CLEARED'); }
      if (act === 'save') { save(state); setStatus('SAVED TO THE GARAGE'); }
      if (act === 'slot') { state.activeSlot = +t.getAttribute('data-slot') || 0; save(state); setStatus('SLOT ' + (state.activeSlot + 1)); }
      if (act === 'close') { closeStudio(); return; }
      syncUI();
      requestDraw();
    });
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    canvas.addEventListener('pointerdown', function (e) {
      if (ui.mode === '3d') { down = { x: e.clientX, y: e.clientY, spin: true }; canvas.setPointerCapture(e.pointerId); return; }
      const pt = canvasPoint(e, canvas);
      const hit = hitArt(pt[0], pt[1]);
      if (!hit) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      const u = (pt[0] - hit.rect.x) / hit.rect.w, v = (pt[1] - hit.rect.y) / hit.rect.h;
      if (ui.stamp) { down = { x: pt[0], y: pt[1], u: u, v: v, view: hit.view, stamp: true }; return; }
      const b = brushNow();
      live = { view: hit.view, brush: b.brush, color: b.color, size: b.size, mirror: ui.mirror, pulse: ui.pulse, pts: [[clamp(u, 0, 1), clamp(v, 0, 1)]] };
      down = { x: pt[0], y: pt[1], view: hit.view, rect: hit.rect };
      requestDraw();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!down) return;
      if (down.spin) {
        ui.yaw += (e.clientX - down.x) * 0.01;
        ui.pitch = clamp(ui.pitch + (e.clientY - down.y) * 0.008, -0.15, 1.15);
        down.x = e.clientX; down.y = e.clientY;
        requestDraw();
        return;
      }
      if (down.stamp || !live) return;
      const pt = canvasPoint(e, canvas);
      const u = clamp((pt[0] - down.rect.x) / down.rect.w, 0, 1);
      const v = clamp((pt[1] - down.rect.y) / down.rect.h, 0, 1);
      const prev = live.pts[live.pts.length - 1];
      if (Math.hypot(u - prev[0], v - prev[1]) < 0.004) return;
      if (live.pts.length < 800) live.pts.push([u, v]);
      requestDraw();
    });
    function endPtr(e) {
      if (!down) return;
      const was = down;
      down = null;
      if (was.spin) return;
      if (was.stamp) {
        const pt = canvasPoint(e, canvas);
        if (Math.hypot(pt[0] - was.x, pt[1] - was.y) < 18) placeStamp(was.u, was.v, was.view);
        return;
      }
      commitLive();
    }
    canvas.addEventListener('pointerup', endPtr);
    canvas.addEventListener('pointercancel', function () { down = null; live = null; requestDraw(); });
    if (!root.classList.contains('np-page')) {
      root.addEventListener('pointerdown', function (e) { if (e.target === root) closeStudio(); });
    }
  }
  function openStudio(opts) {
    if (typeof document === 'undefined') return;
    opts = opts || {};
    closeStudio();
    state = readStore();
    lastJson = JSON.stringify(state);
    bakeCanvases();
    ensureCss();
    const root = document.createElement('div');
    root.id = 'np-studio';
    root.className = opts.page ? 'np-page' : 'np-modal';
    root.innerHTML = studioHTML(!!opts.page);
    document.body.appendChild(root);
    studio = root;
    bind(root);
    syncUI();
    requestDraw();
  }
  function closeStudio() {
    live = null;
    if (studio && studio.parentNode) studio.parentNode.removeChild(studio);
    studio = null;
  }

  function watchCar() {
    const step = function () {
      const X = carX();
      if (!X) return false;
      applyToCar(X);
      return true;
    };
    if (step()) return;
    let n = 0;
    const id = setInterval(function () {
      n++;
      if (step() || n > 80) clearInterval(id);
    }, 250);
  }
  function boot() {
    state = readStore();
    lastJson = JSON.stringify(state);
    try {
      ch = new BroadcastChannel(CH);
      ch.onmessage = function (ev) {
        const d = ev.data;
        if (!d || d.tab === TAB) return;
        ingest(d.json || d.data);
      };
    } catch (e) { ch = null; }
    window.addEventListener('storage', function (e) {
      if (e.key && e.key !== KEY) return;
      ingest(e.newValue || '');
    });
    watchCar();
  }
  if (typeof window !== 'undefined') {
    window.NEON_PAINT = {
      version: 1,
      hasPaint: hasPaint,
      load: load,
      save: save,
      bakeCanvases: bakeCanvases,
      applyToCar: applyToCar,
      openStudio: openStudio,
      closeStudio: closeStudio
    };
    if (typeof document !== 'undefined') boot();
  }
})();
