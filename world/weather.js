'use strict';
// Kid-world weather. One curtain outside a zone, one scrolling full-screen pass inside.
// No shadowBlur, no per-particle work. Coordinates live in zone data, not in this file.
// Load order: window.ZD_LAYOUT_INTERFACES, then docs/city-layout/interfaces.json,
// then world/weather-zones.json. Adult index.html must not load this script.
//
// Traffic API:
//   weather.inZone(x, z) -> {id, kind, name, x0, x1, z0, z1} or null
//   weather.density      -> 0 outside, ~0.3 light, up to ~0.8 thick
//   weather.kind, weather.thick, weather.viewDist, weather.prep
//   weather.onHeadroom(fn) fires once per entry when the far draw is short
// Player speed is not read or written here.

(function () {
  const FAR = 320;
  const WALL_M = 280;
  const LOOKS = {
    sand: {
      band: ['rgba(255,214,120,0.28)', 'rgba(230,170,70,0.16)', 'rgba(255,236,190,0.07)'],
      line: 'rgba(255,236,190,0.90)',
      tint: [255, 196, 110],
      scroll: [28, 12],
      size: [96, 64]
    },
    fog: {
      band: ['rgba(226,236,246,0.34)', 'rgba(190,210,226,0.18)', 'rgba(255,255,255,0.08)'],
      line: 'rgba(244,250,255,0.92)',
      tint: [214, 228, 242],
      scroll: [8, 5],
      size: [128, 128]
    },
    rain: {
      band: ['rgba(150,206,236,0.26)', 'rgba(110,176,220,0.14)', 'rgba(210,236,255,0.07)'],
      line: 'rgba(210,240,255,0.92)',
      tint: [150, 205, 235],
      scroll: [22, 96],
      size: [80, 140]
    }
  };

  let zones = [];
  let clear = [];
  let sourceName = 'none';
  let locked = false;
  let ifaceSeen = null;
  let zone = null;
  let lastKind = 'fog';
  let density = 0;
  let thickMix = 0;
  let presence = 0;
  let ema = 120;
  let below = 0;
  let armed = false;
  let warm = 0.8;
  let prep = false;
  let told = false;
  let bench = 'auto';
  let debugFps = null;
  let baseDist = null;
  let baseOutline = null;
  const heads = [];
  const patterns = {};

  function lim(v, a, b) { return v < a ? a : v > b ? b : v; }
  function num(v) { const n = +v; return n === n ? n : null; }

  function asRect(o, fallbackKind) {
    if (!o) return null;
    let kind = fallbackKind || 'fog';
    let x0, x1, z0, z1, id, name;
    if (Array.isArray(o)) {
      if (typeof o[0] === 'string' && num(o[1]) != null) {
        kind = o[0]; x0 = num(o[1]); x1 = num(o[2]); z0 = num(o[3]); z1 = num(o[4]); id = o[5] || kind;
      } else return null;
    } else {
      if (o.min && o.max) {
        x0 = num(o.min[0]); z0 = num(o.min[1]); x1 = num(o.max[0]); z1 = num(o.max[1]);
      } else {
        x0 = num(o.x0 != null ? o.x0 : o.xa != null ? o.xa : o.minX);
        x1 = num(o.x1 != null ? o.x1 : o.xb != null ? o.xb : o.maxX);
        z0 = num(o.z0 != null ? o.z0 : o.za != null ? o.za : o.minZ);
        z1 = num(o.z1 != null ? o.z1 : o.zb != null ? o.zb : o.maxZ);
      }
      kind = o.kind || o.type || o.weather || o.name || fallbackKind || 'fog';
      name = o.name || o.label || String(kind);
      id = o.id || (name + ':' + (num(o.z0 != null ? o.z0 : z0)) + ':' + (num(o.x0 != null ? o.x0 : x0)));
    }
    if (x0 == null || x1 == null || z0 == null || z1 == null) return null;
    const k = String(kind).toLowerCase();
    const canon = k.indexOf('sand') >= 0 ? 'sand' : k.indexOf('rain') >= 0 ? 'rain' : 'fog';
    if (x0 > x1) { const t = x0; x0 = x1; x1 = t; }
    if (z0 > z1) { const t = z0; z0 = z1; z1 = t; }
    return { id: String(id), kind: canon, name: name || canon, x0: x0, x1: x1, z0: z0, z1: z1 };
  }

  function packOf(data) {
    if (!data) return null;
    if (Array.isArray(data)) return { zones: data, clear: [] };
    if (data.weather && data.weather !== data) return packOf(data.weather);
    const list = data.zones || data.weatherZones || data.stretches || data.bands;
    if (!list) return null;
    return { zones: list, clear: data.clear || data.keepClear || data.holes || [] };
  }

  function adopt(data, name) {
    if (locked && name !== 'interfaces') return false;
    const pack = packOf(data);
    if (!pack) return false;
    const next = [];
    for (let i = 0; i < pack.zones.length; i++) {
      const r = asRect(pack.zones[i]);
      if (r) next.push(r);
    }
    if (!next.length) return false;
    const holes = [];
    const rawClear = pack.clear || [];
    for (let i = 0; i < rawClear.length; i++) {
      const r = asRect(rawClear[i], 'clear');
      if (r) holes.push(r);
    }
    zones = next;
    clear = holes;
    sourceName = name;
    if (name === 'interfaces') locked = true;
    return true;
  }

  function watchInterfaces() {
    const src = window.ZD_LAYOUT_INTERFACES;
    if (!src || src === ifaceSeen) return false;
    if (adopt(src, 'interfaces')) { ifaceSeen = src; return true; }
    return false;
  }

  // City Layout Interfaces (PR #85): CITY.LAYOUT.weather[] {name,x0,x1,z0,z1}.
  // Anchors on that same object punch the runway, tunnel, and bridges back out.
  function layoutObject() {
    if (typeof CITY !== 'undefined' && CITY && CITY.LAYOUT && CITY.LAYOUT.weather) return CITY.LAYOUT;
    if (window.CITY_LAYOUT && window.CITY_LAYOUT.weather) return window.CITY_LAYOUT;
    return null;
  }

  function holesFromLayout(src) {
    const holes = [];
    const a = src.anchors || {};
    if (a.runway) holes.push(Object.assign({ id: 'runway', kind: 'clear' }, a.runway));
    if (a.tunnel) holes.push(Object.assign({ id: 'tunnel', kind: 'clear' }, a.tunnel));
    const bridges = a.bridges || [];
    for (let i = 0; i < bridges.length; i++) holes.push(Object.assign({ id: 'bridge-' + i, kind: 'clear' }, bridges[i]));
    const extra = src.clear || src.keepClear || src.holes || [];
    for (let i = 0; i < extra.length; i++) holes.push(extra[i]);
    return holes;
  }

  function watchLayout() {
    const src = layoutObject();
    if (!src || src === ifaceSeen) return false;
    if (adopt({ zones: src.weather, clear: holesFromLayout(src) }, 'interfaces')) {
      ifaceSeen = src;
      return true;
    }
    return false;
  }

  function inClear(x, z) {
    for (let i = 0; i < clear.length; i++) {
      const c = clear[i];
      if (x >= c.x0 && x <= c.x1 && z >= c.z0 && z <= c.z1) return true;
    }
    return false;
  }

  function inZone(x, z) {
    if (inClear(x, z)) return null;
    let best = null;
    let area = Infinity;
    for (let i = 0; i < zones.length; i++) {
      const zn = zones[i];
      if (x < zn.x0 || x > zn.x1 || z < zn.z0 || z > zn.z1) continue;
      const a = (zn.x1 - zn.x0) * (zn.z1 - zn.z0);
      if (a < area) { best = zn; area = a; }
    }
    return best;
  }

  function insideRect(zn, x, z) {
    return x >= zn.x0 && x <= zn.x1 && z >= zn.z0 && z <= zn.z1;
  }

  function applyLod() {
    if (typeof CDRAW === 'undefined') return;
    if (baseDist == null) { baseDist = CDRAW.dist; baseOutline = CDRAW.outline; }
    const off = bench === 'off';
    const m = off ? 0 : thickMix;
    CDRAW.dist = baseDist + (FAR - baseDist) * m;
    CDRAW.outline = baseOutline + (FAR - baseOutline) * m;
    api.gridN = Math.max(6, Math.min(22, Math.round(CDRAW.dist / 40)));
  }

  function tick(dt, fpsNow) {
    if (!(dt > 0) || dt > 0.5) dt = 1 / 60;
    watchInterfaces();
    watchLayout();
    const x = (typeof P !== 'undefined') ? P.x : 0;
    const z = (typeof P !== 'undefined') ? P.z : 0;
    zone = inZone(x, z);
    if (zone) lastKind = zone.kind;
    const sample = debugFps != null ? debugFps : (fpsNow > 1 ? fpsNow : ema);
    if (warm > 0) warm -= dt;
    else {
      const k = 1 - Math.exp(-dt / 0.45);
      ema += (sample - ema) * k;
    }
    const slow = ema < 108;
    const recovered = ema > 116;
    if (zone && slow && warm <= 0) below = Math.min(1, below + dt);
    else below = Math.max(0, below - dt);
    if (!armed && zone && below > 0.30 && ema < 110) armed = true;
    if (armed && (!zone || (recovered && below < 0.05))) armed = false;
    const short = lim((110 - ema) / 55, 0, 1);
    const target = (bench === 'off' || !armed) ? 0 : Math.max(short, 0.15);
    const tau = target > thickMix ? 0.35 : 1.15;
    thickMix += (target - thickMix) * (1 - Math.exp(-dt / tau));
    if (thickMix < 0.004) thickMix = 0;
    const want = zone ? 1 : 0;
    const pt = want > presence ? 0.12 : 0.4;
    presence += (want - presence) * (1 - Math.exp(-dt / pt));
    if (presence < 0.004) presence = 0;
    const light = 0.30;
    const heavy = 0.78;
    density = zone ? light + (heavy - light) * thickMix : 0;
    applyLod();
    const readyPrep = !!(zone && armed && thickMix > 0.55 && bench !== 'off');
    prep = readyPrep;
    if (readyPrep && !told) {
      told = true;
      const info = { zone: zone, density: density, viewDist: api.viewDist };
      for (let i = 0; i < heads.length; i++) { try { heads[i](info); } catch (e) {} }
    }
    if (!zone) told = false;
  }

  function bake(kind) {
    if (patterns[kind]) return patterns[kind];
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    if (kind === 'sand') {
      c.width = 96; c.height = 64;
      g.clearRect(0, 0, 96, 64);
      g.fillStyle = 'rgba(255,214,120,0.80)';
      g.fillRect(0, 6, 96, 3);
      g.fillStyle = 'rgba(232,160,64,0.55)';
      g.fillRect(0, 28, 96, 4);
      g.fillStyle = 'rgba(255,236,190,0.70)';
      g.fillRect(0, 48, 96, 2);
      g.fillStyle = 'rgba(255,248,220,0.9)';
      for (let i = 0; i < 10; i++) g.fillRect((i * 37) % 92, (i * 19) % 60, 2, 2);
    } else if (kind === 'rain') {
      c.width = 80; c.height = 140;
      g.strokeStyle = 'rgba(214,244,255,0.85)';
      g.lineWidth = 1.6;
      g.lineCap = 'round';
      g.beginPath();
      for (let i = 0; i < 8; i++) {
        const x = 8 + (i * 10) % 72;
        const y = (i * 17) % 100;
        g.moveTo(x, y);
        g.lineTo(x - 8, y + 26);
      }
      g.stroke();
    } else {
      c.width = 128; c.height = 128;
      g.fillStyle = 'rgba(236,244,250,0.55)';
      g.beginPath(); g.arc(34, 46, 30, 0, 6.3); g.fill();
      g.fillStyle = 'rgba(190,214,228,0.40)';
      g.beginPath(); g.arc(92, 78, 36, 0, 6.3); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.35)';
      g.beginPath(); g.arc(70, 28, 18, 0, 6.3); g.fill();
    }
    patterns[kind] = ctx.createPattern(c, 'repeat');
    return patterns[kind];
  }

  function face(x0, z0, x1, z1, look) {
    const bands = [[0.4, 11], [11, 22], [22, 34]];
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      wpoly([[x0, bands[i][0], z0], [x1, bands[i][0], z1], [x1, bands[i][1], z1], [x0, bands[i][1], z0]]);
      ctx.fillStyle = look.band[i];
      ctx.fill();
    }
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(4, Math.min(8, Math.round(len / 36)));
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const x = x0 + (x1 - x0) * t;
      const z = z0 + (z1 - z0) * t;
      pathSeg([x, 2, z], [x, 28, z]);
    }
    ctx.strokeStyle = look.line;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    ctx.stroke();
  }

  function drawWall() {
    if (bench === 'off' || typeof wpoly !== 'function' || !zones.length) return;
    if (typeof PT !== 'undefined') PT = null;
    const x = cam.x, z = cam.z;
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    for (let i = 0; i < zones.length; i++) {
      const zn = zones[i];
      if (insideRect(zn, P.x, P.z)) continue;
      const dx = x < zn.x0 ? zn.x0 - x : x > zn.x1 ? x - zn.x1 : 0;
      const dz = z < zn.z0 ? zn.z0 - z : z > zn.z1 ? z - zn.z1 : 0;
      const dist = Math.hypot(dx, dz);
      if (dist > WALL_M) continue;
      const look = LOOKS[zn.kind] || LOOKS.fog;
      ctx.globalAlpha = lim(1 - (dist - 180) / 100, 0.35, 1);
      if (x < zn.x0) face(zn.x0, zn.z0, zn.x0, zn.z1, look);
      else if (x > zn.x1) face(zn.x1, zn.z1, zn.x1, zn.z0, look);
      if (z < zn.z0) face(zn.x0, zn.z0, zn.x1, zn.z0, look);
      else if (z > zn.z1) face(zn.x1, zn.z1, zn.x0, zn.z1, look);
    }
    ctx.restore();
  }

  function drawFilter() {
    if (bench === 'off' || presence < 0.02) return;
    const kind = (zone && zone.kind) || lastKind;
    const look = LOOKS[kind] || LOOKS.fog;
    const tintA = (0.10 + 0.12 * thickMix) * presence;
    const patA = (0.34 + 0.28 * thickMix) * presence;
    const t = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
    const sx = (t * look.scroll[0]) % look.size[0];
    const sy = (t * look.scroll[1]) % look.size[1];
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = tintA;
    ctx.fillStyle = 'rgb(' + look.tint[0] + ',' + look.tint[1] + ',' + look.tint[2] + ')';
    ctx.fillRect(0, 0, W, H);
    const pat = bake(kind);
    if (pat) {
      ctx.globalAlpha = patA;
      ctx.translate(sx, sy);
      ctx.fillStyle = pat;
      ctx.fillRect(-sx - look.size[0], -sy - look.size[1], W + look.size[0] * 2, H + look.size[1] * 2);
    }
    ctx.restore();
  }

  let readyResolve;
  const ready = new Promise(function (res) { readyResolve = res; });

  function load() {
    if (watchInterfaces() || watchLayout()) { readyResolve(); return; }
    fetch('docs/city-layout/interfaces.json', { cache: 'no-store' }).then(function (r) {
      return r.ok ? r.json() : null;
    }, function () { return null; }).then(function (iface) {
      if (watchInterfaces() || watchLayout()) return null;
      if (iface && adopt(iface, 'interfaces')) return 'done';
      return fetch('world/weather-zones.json', { cache: 'no-store' }).then(function (r) {
        return r.ok ? r.json() : null;
      }, function () { return null; });
    }).then(function (fall) {
      if (fall && fall !== 'done') adopt(fall, 'stand-in');
      watchInterfaces();
      watchLayout();
    }).then(function () { readyResolve(); }, function () { readyResolve(); });
  }

  const api = {
    gridN: 22,
    ready: ready,
    inZone: inZone,
    setZones: function (data) { return adopt(data, locked ? 'interfaces' : 'pushed'); },
    onHeadroom: function (fn) { if (typeof fn === 'function') heads.push(fn); return api; },
    tick: tick,
    drawWall: drawWall,
    drawFilter: drawFilter,
    bench: function (mode) {
      bench = mode === 'off' ? 'off' : 'auto';
      if (bench === 'off') { thickMix = 0; presence = 0; armed = false; below = 0; }
      applyLod();
    },
    get density() { return density; },
    get kind() { return zone ? zone.kind : null; },
    get zone() { return zone; },
    get thick() { return bench !== 'off' && thickMix > 0.45; },
    get thickMix() { return thickMix; },
    get viewDist() { return (typeof CDRAW !== 'undefined') ? CDRAW.dist : 950; },
    get prep() { return prep; },
    get source() { return sourceName; },
    get zones() { return zones; },
    get ema() { return ema; },
    set debugFps(v) { debugFps = v == null ? null : +v; },
    get debugFps() { return debugFps; }
  };

  window.weather = window.WEATHER = api;
  load();
})();
