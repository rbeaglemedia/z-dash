
/* Z-DASH — drawing helpers: canvas setup, gauges, front-view + side-view car art. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const RED = '#ff2a3d', MUTE = '#8a7a7d', TXT = '#e9e3e4';
  ZD.COL = { RED, MUTE, TXT, DIM: '#3a0d13', LINE: '#2a0b10', CYAN: '#3ee6ff', AMBER: '#ffb020' };
  ZD.FONT = { num: "'Orbitron', 'Rajdhani', sans-serif", txt: "'Rajdhani', 'Roboto Condensed', sans-serif" };

  // ---- performance: LOW DETAIL (capped pixel ratio, no glow/bloom, simplified 3D) + FPS counter. Saved on the device. ----
  const q = new URLSearchParams(G.location ? G.location.search : '');
  const ls = (k) => { try { return G.localStorage.getItem(k); } catch (e) { return null; } };
  ZD.perf = { low: q.has('low') ? q.get('low') !== '0' : ls('zdash.lowdetail') === '1', fps: q.has('fps') || ls('zdash.fps') === '1',
    set(k, v) { this[k] = !!v; try { G.localStorage.setItem(k === 'low' ? 'zdash.lowdetail' : 'zdash.fps', v ? '1' : '0'); } catch (e) {} this.onchange && this.onchange(k, !!v); },
    dpr(max) { return Math.min(G.devicePixelRatio || 1, this.low ? 1 : max); } };
  // Low detail turns every canvas glow (shadowBlur) off in one place.
  if (G.CanvasRenderingContext2D) { const P = G.CanvasRenderingContext2D.prototype, d = Object.getOwnPropertyDescriptor(P, 'shadowBlur');
    if (d && d.set) Object.defineProperty(P, 'shadowBlur', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, ZD.perf.low ? 0 : v); } }); }
  ZD.fit = function (cv) {
    const dpr = ZD.perf.dpr(3), r = cv.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    return { ctx, w, h };
  };
  ZD.text = function (ctx, s, x, y, size, color, align = 'left', font = 'txt', weight = 600, glow = 0) {
    ctx.font = `${weight} ${size}px ${ZD.FONT[font]}`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = color; if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
    ctx.fillText(s, x, y); ctx.shadowBlur = 0;
  };
  ZD.grid = function (ctx, w, h, step = 24, alpha = 0.07) {
    ctx.strokeStyle = `rgba(255,42,61,${alpha})`; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0.5; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0.5; y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
  };
  ZD.panel = function (ctx, x, y, w, h, title) {
    ctx.strokeStyle = 'rgba(255,42,61,.22)'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.fillStyle = 'rgba(255,42,61,.03)'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = RED; ctx.fillRect(x, y, 10, 2); ctx.fillRect(x, y, 2, 10);
    if (title) ZD.text(ctx, title, x + 8, y + 15, 11, MUTE, 'left', 'txt', 600);
  };
  /** wrap text into lines that fit maxW; returns y after the last line */
  ZD.wrap = function (ctx, s, x, y, maxW, lh, size, color, weight = 600) {
    ctx.font = `${weight} ${size}px ${ZD.FONT.txt}`; ctx.fillStyle = color; ctx.textAlign = 'left';
    let line = '';
    for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; } else line = t; }
    if (line) { ctx.fillText(line, x, y); y += lh; }
    return y;
  };
  const fmt = (v, d) => (v === null || v === undefined || !isFinite(v) ? '--' : v.toFixed(d));
  ZD.fmt = fmt;

  /** 240° arc gauge. opts: {min,max,dec,zero,warn,danger,color,big} */
  ZD.arcGauge = function (ctx, cx, cy, r, val, label, unit, o) {
    const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, has = val !== null && val !== undefined && isFinite(val);
    const norm = (v) => ZD.clamp((v - o.min) / (o.max - o.min), 0, 1);
    ctx.lineCap = 'butt';
    ctx.lineWidth = o.lw || Math.max(4, r * 0.13); ctx.strokeStyle = '#1c0a0d';
    ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke();
    // ticks
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.18)';
    for (let i = 0; i <= 10; i++) { const a = a0 + ((a1 - a0) * i) / 10; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (r - r * 0.22), cy + Math.sin(a) * (r - r * 0.22)); ctx.lineTo(cx + Math.cos(a) * (r - r * 0.3), cy + Math.sin(a) * (r - r * 0.3)); ctx.stroke(); }
    if (o.danger !== undefined) { ctx.strokeStyle = 'rgba(255,42,61,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r + r * 0.12, a0 + (a1 - a0) * norm(o.danger), a1); ctx.stroke(); }
    if (has) {
      const z = o.zero !== undefined ? norm(o.zero) : 0, n = norm(val);
      let col = o.color || RED;
      if (o.colorFn) col = o.colorFn(val);
      ctx.lineWidth = o.lw || Math.max(4, r * 0.13); ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(cx, cy, r, a0 + (a1 - a0) * Math.min(z, n), a0 + (a1 - a0) * Math.max(z, n)); ctx.stroke(); ctx.shadowBlur = 0;
    }
    const big = o.big || r * 0.5;
    ZD.text(ctx, fmt(val, o.dec || 0), cx, cy + big * 0.35, big, has ? TXT : MUTE, 'center', 'num', 700);
    ZD.text(ctx, unit, cx, cy + big * 0.35 + r * 0.32, Math.max(9, r * 0.2), MUTE, 'center');
    ZD.text(ctx, label, cx, cy + r * 0.98, Math.max(10, r * 0.2), TXT, 'center', 'txt', 700);
  };

  /** Front view of Bob's car: Gun Metallic, Stillen bumper w/ big open centre intake (FMIC visible),
      boomerang headlights, dark tint, z1 undertray. lights: {amber 0..1, drl 0..1} */
  ZD.drawFrontCar = function (ctx, cx, gy, s, lights, boost = 0) {
    const C = ZD.CAR.colors;
    const P = (pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * s, gy - y * s) : ctx.moveTo(cx + x * s, gy - y * s))); ctx.closePath(); };
    const M = (pts) => pts.map(([x, y]) => [-x, y]);
    // shadow
    const sh = ctx.createRadialGradient(cx, gy, 10, cx, gy, s * 1.2); sh.addColorStop(0, 'rgba(255,42,61,.18)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sh; ctx.fillRect(cx - s * 1.3, gy - s * 0.15, s * 2.6, s * 0.3);
    // tyres
    ctx.fillStyle = C.tire; for (const sg of [-1, 1]) { ctx.fillRect(cx + sg * 0.62 * s - (sg < 0 ? 0.3 * s : 0), gy - 0.6 * s, 0.3 * s, 0.6 * s); }
    // body
    const body = [[-0.86, 0.13], [0.86, 0.13], [0.93, 0.36], [0.93, 0.6], [0.86, 0.79], [0.7, 0.87], [0.52, 0.8], [0.25, 0.77], [-0.25, 0.77], [-0.52, 0.8], [-0.7, 0.87], [-0.86, 0.79], [-0.93, 0.6], [-0.93, 0.36]];
    const gr = ctx.createLinearGradient(0, gy - 0.9 * s, 0, gy - 0.1 * s); gr.addColorStop(0, C.bodyHi); gr.addColorStop(0.35, C.body); gr.addColorStop(1, C.bodyLo);
    P(body); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = 'rgba(255,42,61,.55)'; ctx.lineWidth = 1.2; ctx.stroke();
    // greenhouse
    const glass = [[-0.62, 0.84], [0.62, 0.84], [0.45, 1.24], [-0.45, 1.24]];
    P([[-0.68, 0.82], [0.68, 0.82], [0.48, 1.3], [-0.48, 1.3]]); ctx.fillStyle = C.body; ctx.fill(); ctx.stroke();
    P(glass); const gg = ctx.createLinearGradient(0, gy - 1.24 * s, 0, gy - 0.84 * s); gg.addColorStop(0, '#15181d'); gg.addColorStop(1, C.glass); ctx.fillStyle = gg; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.beginPath(); ctx.moveTo(cx - 0.3 * s, gy - 1.2 * s); ctx.lineTo(cx + 0.1 * s, gy - 0.88 * s); ctx.stroke();
    // mirrors
    for (const sg of [-1, 1]) { P([[sg * 0.66, 0.86], [sg * 0.94, 0.9], [sg * 0.95, 0.98], [sg * 0.7, 0.95]]); ctx.fillStyle = C.body; ctx.fill(); }
    // z1 aluminium undertray
    ctx.fillStyle = '#9aa0a8'; ctx.fillRect(cx - 0.72 * s, gy - 0.14 * s, 1.44 * s, 0.03 * s);
    // Stillen bumper: big open centre intake (NISMO-style) with the FMIC core showing through
    const intake = [[-0.52, 0.17], [0.52, 0.17], [0.46, 0.47], [0.3, 0.52], [-0.3, 0.52], [-0.46, 0.47]];
    P(intake); ctx.fillStyle = '#060607'; ctx.fill(); ctx.strokeStyle = 'rgba(255,42,61,.7)'; ctx.stroke();
    ctx.save(); P(intake); ctx.clip();
    const glow = ZD.clamp((boost + 2) / 11, 0, 1);
    ctx.fillStyle = `rgba(${60 + 140 * glow},${40 + 10 * glow},${45},0.55)`; ctx.fillRect(cx - 0.42 * s, gy - 0.44 * s, 0.84 * s, 0.22 * s); // intercooler core
    ctx.strokeStyle = 'rgba(160,160,170,.35)'; ctx.lineWidth = 1;
    for (let y = 0.23; y < 0.44; y += 0.022) { ctx.beginPath(); ctx.moveTo(cx - 0.42 * s, gy - y * s); ctx.lineTo(cx + 0.42 * s, gy - y * s); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; for (let x = -0.52; x < 0.52; x += 0.035) { ctx.beginPath(); ctx.moveTo(cx + x * s, gy - 0.17 * s); ctx.lineTo(cx + (x + 0.05) * s, gy - 0.52 * s); ctx.stroke(); }
    ctx.restore();
    // upper slot + side vents
    P([[-0.28, 0.58], [0.28, 0.58], [0.24, 0.63], [-0.24, 0.63]]); ctx.fillStyle = '#08080a'; ctx.fill();
    for (const sg of [-1, 1]) { P([[sg * 0.62, 0.2], [sg * 0.82, 0.22], [sg * 0.84, 0.38], [sg * 0.66, 0.34]]); ctx.fillStyle = '#08080a'; ctx.fill(); ctx.strokeStyle = 'rgba(255,42,61,.4)'; ctx.stroke(); }
    // Nissan badge
    ctx.strokeStyle = '#c9cdd2'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, gy - 0.68 * s, 0.035 * s, 0, Math.PI * 2); ctx.stroke();
    // boomerang headlights
    const hl = [[-0.92, 0.5], [-0.9, 0.66], [-0.8, 0.78], [-0.58, 0.79], [-0.47, 0.74], [-0.6, 0.71], [-0.76, 0.65], [-0.84, 0.54], [-0.86, 0.4]];
    for (const pts of [hl, M(hl)]) {
      P(pts); ctx.fillStyle = '#0d0f12'; ctx.fill();
      if (lights.amber > 0) { ctx.save(); ctx.shadowColor = '#ffa000'; ctx.shadowBlur = 40 * lights.amber; ctx.fillStyle = `rgba(255,170,20,${lights.amber})`; P(pts); ctx.fill(); ctx.restore(); }
      ctx.strokeStyle = 'rgba(200,205,212,.7)'; ctx.lineWidth = 1; P(pts); ctx.stroke();
    }
    for (const sg of [-1, 1]) {
      // projectors + DRL line along the boomerang
      ctx.fillStyle = lights.drl > 0 ? `rgba(220,240,255,${0.3 + 0.7 * lights.drl})` : '#2a2e33';
      ctx.shadowColor = '#bfe8ff'; ctx.shadowBlur = 14 * lights.drl;
      ctx.beginPath(); ctx.arc(cx + sg * 0.7 * s, gy - 0.72 * s, 0.035 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + sg * 0.81 * s, gy - 0.68 * s, 0.028 * s, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  // 370Z side profile (u: 0 rear → 100 front, v: height units, 31 ≈ roof)
  const SIDE = [[97, 4], [100, 9], [99.5, 13.5], [96, 16.5], [85, 18.8], [72, 21], [64, 22.8], [55, 29.6], [47, 31], [40, 30.2], [30, 26.5], [17, 23], [9, 22], [5, 21.5], [1.5, 18], [0.5, 11], [2.5, 4]];
  ZD.SIDE_PROFILE = SIDE;
  /** Side view (front to the right) with rotating silver 10-spoke SSRs and red calipers. */
  ZD.drawSideCar = function (ctx, x0, gy, len, wheelAng = 0) {
    const C = ZD.CAR.colors, k = len / 100;
    const X = (u) => x0 + u * k, Y = (v) => gy - v * k;
    const wr = 8.1, wheels = [20, 80];
    ctx.save();
    ctx.beginPath();
    SIDE.forEach(([u, v], i) => (i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v))));
    ctx.closePath();
    const gr = ctx.createLinearGradient(0, Y(31), 0, Y(3)); gr.addColorStop(0, C.bodyHi); gr.addColorStop(0.4, C.body); gr.addColorStop(1, C.bodyLo);
    ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = 'rgba(255,42,61,.6)'; ctx.lineWidth = 1.2; ctx.stroke();
    // arches
    ctx.fillStyle = '#050506'; for (const u of wheels) { ctx.beginPath(); ctx.arc(X(u), Y(wr), (wr + 1.4) * k, Math.PI, 0); ctx.lineTo(X(u) + (wr + 1.4) * k, Y(3)); ctx.lineTo(X(u) - (wr + 1.4) * k, Y(3)); ctx.fill(); }
    // glass (dark tint)
    ctx.beginPath(); [[64, 22.6], [55.5, 28.8], [47, 30], [39, 29], [31, 25.6], [44, 23]].forEach(([u, v], i) => (i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)))); ctx.closePath(); ctx.fillStyle = C.glass; ctx.fill();
    ctx.strokeStyle = 'rgba(170,176,186,.5)'; ctx.stroke();
    // boomerang head + tail lights
    ctx.fillStyle = '#d8dde3'; ctx.beginPath(); [[98.5, 14], [95.5, 16.4], [88, 18.2], [93, 15.8], [97.6, 12]].forEach(([u, v], i) => (i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)))); ctx.fill();
    ctx.fillStyle = RED; ctx.shadowColor = RED; ctx.shadowBlur = 8; ctx.beginPath(); [[1.8, 18.3], [6, 21.3], [11, 21.8], [5.5, 19.5], [2.6, 15.5]].forEach(([u, v], i) => (i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)))); ctx.fill(); ctx.shadowBlur = 0;
    for (const u of wheels) ZD.drawWheel(ctx, X(u), Y(wr), wr * k, wheelAng);
    ctx.restore();
  };
  ZD.drawWheel = function (ctx, cx, cy, r, ang) {
    const C = ZD.CAR.colors, rim = r * 0.7;
    ctx.fillStyle = C.tire; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1b1d21'; ctx.beginPath(); ctx.arc(cx, cy, rim, 0, Math.PI * 2); ctx.fill();
    // Akebono caliper (red) behind the spokes
    ctx.strokeStyle = '#d4202f'; ctx.lineWidth = rim * 0.28; ctx.beginPath(); ctx.arc(cx, cy, rim * 0.72, -Math.PI * 0.85, -Math.PI * 0.45); ctx.stroke();
    ctx.strokeStyle = C.wheel; ctx.lineWidth = Math.max(1.5, rim * 0.11); ctx.lineCap = 'round';
    for (let i = 0; i < 10; i++) { const a = ang + (i * Math.PI) / 5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * rim * 0.2, cy + Math.sin(a) * rim * 0.2); ctx.lineTo(cx + Math.cos(a) * rim * 0.95, cy + Math.sin(a) * rim * 0.95); ctx.stroke(); }
    ctx.lineWidth = Math.max(1, rim * 0.08); ctx.beginPath(); ctx.arc(cx, cy, rim, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = C.wheelDark; ctx.beginPath(); ctx.arc(cx, cy, rim * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.lineCap = 'butt';
  };
})(typeof window !== 'undefined' ? window : globalThis);

