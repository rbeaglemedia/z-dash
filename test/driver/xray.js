
/* Z-DASH — rotating low-poly 370Z with x-ray "highlight parts" (GTM Stage 1 Rotrex layout).
   World coords in metres: x forward, y to the passenger (right) side, z up. Origin = mid-wheelbase.
   Part positions are approximate, based on GTM kit descriptions: Rotrex (GTM Stage 1) mounted low at the
   front of the engine (under the alternator), bar-and-plate intercooler centred behind the bumper
   brace, Rotrex fluid cooler above the IC, fluid reservoir high on the driver side, polished
   charge piping up to the twin throttle bodies. */
(function (G) {
  const ZD = (G.ZD = G.ZD || {});
  const H = 1.315 / 31, L = 4.25, XOFF = -2.11;
  const ux = (u) => XOFF + (u / 100) * L;
  const top = (u) => ZD.interp(ZD.SIDE_PROFILE.slice(1, 16).map(([a, b]) => [a, b]).sort((p, q) => p[0] - q[0]), u) * H;
  const halfW = (u) => ZD.interp([[0, 0.72], [5, 0.84], [14, 0.91], [21, 0.93], [31, 0.85], [50, 0.82], [68, 0.85], [79, 0.91], [89, 0.89], [96, 0.8], [100, 0.62]], u);
  const BELT = 0.89, ZB = 0.17;

  // ---------- mesh ----------
  const stations = [0.6, 2, 5, 9, 14, 20, 26, 32, 38, 44, 50, 56, 61, 66, 72, 78, 84, 90, 95, 98, 99.7];
  const rings = stations.map((u) => {
    const w = halfW(u), t = top(u), b = Math.min(t, BELT), cabin = t > BELT + 0.03;
    const wt = cabin ? 0.5 : w * 0.72, zb = u < 3 || u > 98 ? 0.3 : ZB, x = ux(u);
    return { u, cabin, pts: [[x, -w * 0.86, zb], [x, -w, 0.5], [x, -w * 0.94, b], [x, -wt, t], [x, wt, t], [x, w * 0.94, b], [x, w, 0.5], [x, w * 0.86, zb]] };
  });
  const faces = [];
  for (let i = 0; i < rings.length - 1; i++) {
    const A = rings[i], B = rings[i + 1], um = (A.u + B.u) / 2;
    for (let k = 0; k < 7; k++) {
      let kind = 'body';
      const side = k === 2 || k === 4, roof = k === 3;
      if (side && A.cabin && B.cabin && um > 31 && um < 63) kind = 'glass';
      if (roof && um > 55 && um < 66) kind = 'glass'; // windshield
      if (roof && um > 14 && um < 40) kind = 'glass'; // fastback hatch glass
      faces.push({ kind, p: [A.pts[k], B.pts[k], B.pts[k + 1], A.pts[k + 1]] });
    }
  }
  faces.push({ kind: 'body', p: rings[0].pts.slice() }, { kind: 'body', p: rings[rings.length - 1].pts.slice() });

  // wheels: centre, half-track, radius (295/35R19 rear, 255/35R19 front-ish)
  const WHEELS = [
    { x: 1.29, y: 0.79, r: 0.33, front: true }, { x: 1.29, y: -0.79, r: 0.33, front: true },
    { x: -1.26, y: 0.81, r: 0.345, front: false }, { x: -1.26, y: -0.81, r: 0.345, front: false },
  ];

  // ---------- parts (GTM Stage 1 Rotrex) ----------
  const PARTS = {
    sc: { label: 'ROTREX (GTM STAGE 1)', pos: [1.6, 0.4, 0.42] },
    reservoir: { pos: [1.42, -0.55, 0.78] },
    ic: { label: 'GTM FRONT-MOUNT INTERCOOLER', box: [1.98, -0.45, 0.22, 0.45, 0.45] },
    pipeHot: [[1.6, 0.4, 0.52], [1.82, 0.42, 0.5], [1.98, 0.45, 0.36]], // blower → IC (hot side)
    pipeCold: [[1.98, -0.45, 0.36], [1.86, -0.5, 0.6], [1.62, -0.32, 0.8], [1.38, 0, 0.84], [1.18, 0.16, 0.8]], // IC → throttle bodies
    pipeY: [[1.38, 0, 0.84], [1.18, -0.16, 0.8]],
    cooler: [1.95, 0, 0.56],
    diff: { label: 'REAR DIFF (VLSD)', pos: [-1.26, 0, 0.36] },
  };

  function makeProj(w, h, yaw, pitch, scale) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), D = 9, f = scale * D;
    const ox = w / 2, oy = h * 0.62;
    return ([x, y, z]) => {
      const xr = x * cy - y * sy, yr = x * sy + y * cy, zc = z - 0.55;
      const u = -yr, d = xr, v2 = zc * cp - d * sp, d2 = d * cp + zc * sp, k = f / (D - d2);
      return [ox + u * k, oy - v2 * k, d2];
    };
  }

  /** state: { t, boost, brake, throttle, lonG, speedMph, iat, on:{sc,ic,brakes,diff} } */
  ZD.drawCar3D = function (ctx, w, h, yaw, pitch, st) {
    const scale = Math.min(w / 6.6, h / 3.3);
    const P = makeProj(w, h, yaw, pitch, scale);
    const C = ZD.CAR.colors;
    // ground grid
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      const a = 0.1 * (1 - Math.abs(i) / 7);
      ctx.strokeStyle = `rgba(255,42,61,${a})`;
      let p1 = P([i * 0.6, -4, 0]), p2 = P([i * 0.6, 4, 0]); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
      p1 = P([-4, i * 0.6, 0]); p2 = P([4, i * 0.6, 0]); ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    }
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,.55)'; poly(ctx, [[-2.1, -0.9, 0], [2.1, -0.9, 0], [2.1, 0.9, 0], [-2.1, 0.9, 0]].map(P)); ctx.fill();

    // collect drawables
    const items = [];
    for (const f of faces) {
      const q = f.p.map(P); const d = q.reduce((s, p) => s + p[2], 0) / q.length;
      items.push({ d, draw: () => drawFace(ctx, f, q) });
    }
    st.wheelAng = (st.wheelAng || 0);
    // far-side wheels go behind the body, near-side wheels in front (no arch cut-outs needed)
    const near = [], far = [];
    for (const wh of WHEELS) {
      const sgn = Math.sign(wh.y), yo = wh.y + sgn * 0.08;
      const out = P([wh.x, wh.y, wh.r])[2] > P([wh.x, 0, wh.r])[2];
      (out ? near : far).push(() => drawWheel3D(ctx, P, wh, yo, st));
    }
    far.forEach((d) => d());
    items.sort((a, b) => a.d - b.d).forEach((it) => it.draw());
    near.forEach((d) => d());

    // ---------- x-ray highlights (additive glow over the body) ----------
    const on = st.on || {}, boostN = ZD.clamp((st.boost + 1) / (ZD.CAR.boostPeakPsi + 1), 0, 1);
    const callouts = [];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (on.sc) {
      const p = P(PARTS.sc.pos), r = 0.12 * scale * 1.1;
      glowBlob(ctx, p, r, 0.35 + 0.65 * boostN);
      const rv = P(PARTS.reservoir.pos); glowBlob(ctx, rv, r * 0.45, 0.3 + 0.3 * boostN);
      callouts.push({ p, title: PARTS.sc.label, val: `${ZD.fmt(st.boost, 1)} PSI`, hot: boostN });
    }
    if (on.ic) {
      const [x, y0, z0, y1, z1] = PARTS.ic.box;
      const q = [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]].map(P);
      ctx.fillStyle = `rgba(255,42,61,${0.12 + 0.3 * boostN})`; poly(ctx, q); ctx.fill();
      ctx.strokeStyle = `rgba(255,90,100,${0.5 + 0.5 * boostN})`; ctx.lineWidth = 1.5; poly(ctx, q); ctx.stroke();
      glowBlob(ctx, P(PARTS.cooler), 0.05 * scale, 0.3);
      pipe(ctx, PARTS.pipeHot.map(P), boostN, st.t, true);
      pipe(ctx, PARTS.pipeCold.map(P), boostN, st.t, false);
      pipe(ctx, PARTS.pipeY.map(P), boostN, st.t, false);
      const c = P([x, 0, (z0 + z1) / 2]);
      callouts.push({ p: c, title: PARTS.ic.label, val: st.iat != null ? `IAT ${Math.round(st.iat)}°F` : 'CHARGE PIPES', hot: boostN * 0.8 });
    }
    if (on.brakes) {
      const b = st.brake ? 1 : 0.25;
      let best = null;
      for (const wh of WHEELS) {
        const sgn = Math.sign(wh.y), p = P([wh.x - 0.08 * (wh.front ? 1 : -1), wh.y + sgn * 0.02, wh.r + 0.12]);
        glowBlob(ctx, p, 0.07 * scale, b, st.brake ? [255, 120, 60] : [255, 42, 61]);
        if (!best || p[2] > best[2]) best = p;
      }
      callouts.push({ p: best, title: 'AKEBONO BRAKES', val: st.brake ? 'BRAKING' : 'RED CALIPERS', hot: b });
    }
    if (on.diff) {
      const p = P(PARTS.diff.pos), load = ZD.clamp((st.throttle || 0) / 100, 0, 1);
      const l = P([-1.26, -0.8, 0.345]), r = P([-1.26, 0.8, 0.345]);
      ctx.strokeStyle = `rgba(255,42,61,${0.3 + 0.5 * load})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(r[0], r[1]); ctx.stroke();
      const prop = P([0.9, 0, 0.32]); ctx.beginPath(); ctx.moveTo(prop[0], prop[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
      glowBlob(ctx, p, 0.11 * scale, 0.3 + 0.6 * load);
      callouts.push({ p, title: PARTS.diff.label, val: `${Math.round(st.throttle || 0)}% THROTTLE`, hot: load });
    }
    ctx.restore();
    drawCallouts(ctx, w, h, callouts);
  };

  function poly(ctx, q) { ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
  function drawFace(ctx, f, q) {
    // flat shading from screen-space normal
    const ax = q[1][0] - q[0][0], ay = q[1][1] - q[0][1], bx = q[q.length - 1][0] - q[0][0], by = q[q.length - 1][1] - q[0][1];
    const area = Math.abs(ax * by - ay * bx); if (area < 0.5) return;
    const zN = (q[2][1] + q[1][1]) / 2 - (q[0][1] + q[3 % q.length][1]) / 2;
    const shade = ZD.clamp(0.55 + zN * 0.01 + (q[0][2] * 0.08), 0.35, 1.05);
    poly(ctx, q);
    if (f.kind === 'glass') { ctx.fillStyle = 'rgba(10,12,16,.96)'; ctx.fill(); ctx.strokeStyle = 'rgba(150,160,175,.18)'; }
    else { ctx.fillStyle = `rgb(${Math.round(92 * shade)},${Math.round(96 * shade)},${Math.round(104 * shade)})`; ctx.fill(); ctx.strokeStyle = 'rgba(190,196,206,.16)'; }
    ctx.lineWidth = 0.7; ctx.stroke();
  }
  function drawWheel3D(ctx, P, wh, yo, st) {
    const N = 22, ang = st.wheelAng;
    const circ = (r, y) => Array.from({ length: N }, (_, i) => { const a = (i / N) * Math.PI * 2; return P([wh.x + Math.cos(a) * r, y, wh.r + Math.sin(a) * r]); });
    ctx.fillStyle = '#101114'; poly(ctx, circ(wh.r, yo)); ctx.fill(); ctx.strokeStyle = 'rgba(255,42,61,.25)'; ctx.lineWidth = 1; ctx.stroke();
    const rim = 0.241;
    ctx.fillStyle = '#1a1c20'; poly(ctx, circ(rim, yo + Math.sign(wh.y) * 0.005)); ctx.fill();
    // caliper (red Akebono) peeking through the spokes
    const cal = []; for (let i = 0; i <= 6; i++) { const a = Math.PI * (0.55 + i * 0.05) * (wh.front ? 1 : 1); cal.push(P([wh.x - Math.cos(a) * 0.17 * (wh.front ? 1 : -1), yo, wh.r + Math.sin(a) * 0.17])); }
    ctx.strokeStyle = '#d4202f'; ctx.lineWidth = 4; ctx.beginPath(); cal.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    // procedural 10-spoke (fallback look; Dad's real rims are SSR GTX04)
    ctx.strokeStyle = ZD.CAR.colors.wheel; ctx.lineWidth = 2.2;
    for (let i = 0; i < 10; i++) {
      const a = ang + (i * Math.PI) / 5, p1 = P([wh.x + Math.cos(a) * 0.05, yo, wh.r + Math.sin(a) * 0.05]), p2 = P([wh.x + Math.cos(a) * rim * 0.96, yo, wh.r + Math.sin(a) * rim * 0.96]);
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    }
    ctx.lineWidth = 1.6; poly(ctx, circ(rim, yo)); ctx.stroke();
  }
  function glowBlob(ctx, p, r, a, rgb = [255, 42, 61]) {
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 2.4);
    g.addColorStop(0, `rgba(255,255,255,${0.7 * a})`); g.addColorStop(0.25, `rgba(${rgb},${0.8 * a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], r * 2.4, 0, Math.PI * 2); ctx.fill();
  }
  function pipe(ctx, q, n, t, hot) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = `rgba(255,${hot ? 60 : 110},${hot ? 60 : 120},${0.25 + 0.6 * n})`; ctx.lineWidth = 5; ctx.shadowColor = '#ff2a3d'; ctx.shadowBlur = 6 + 14 * n;
    poly(ctx, q); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    // airflow pulses move faster with boost
    ctx.setLineDash([4, 10]); ctx.lineDashOffset = -t * (20 + 160 * n); ctx.strokeStyle = `rgba(255,255,255,${0.2 + 0.6 * n})`; ctx.lineWidth = 2;
    ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    ctx.setLineDash([]); ctx.shadowBlur = 0;
  }
  function drawCallouts(ctx, w, h, list) {
    const L = list.filter((c) => c.p[0] < w / 2).sort((a, b) => a.p[1] - b.p[1]);
    const R = list.filter((c) => c.p[0] >= w / 2).sort((a, b) => a.p[1] - b.p[1]);
    for (const [arr, x, al] of [[L, 16, 'left'], [R, w - 16, 'right']]) {
      arr.forEach((c, i) => {
        const y = 52 + i * 62, lx = al === 'left' ? x + 170 : x - 170;
        ctx.strokeStyle = `rgba(255,42,61,${0.45 + 0.5 * c.hot})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(c.p[0], c.p[1]); ctx.lineTo(lx, y + 6); ctx.lineTo(x, y + 6); ctx.stroke();
        ctx.fillStyle = '#ff2a3d'; ctx.beginPath(); ctx.arc(c.p[0], c.p[1], 2.5, 0, Math.PI * 2); ctx.fill();
        ZD.text(ctx, c.title, x, y, 12, '#e9e3e4', al, 'txt', 700);
        ZD.text(ctx, c.val, x, y + 24, 15, c.hot > 0.6 ? '#ff5a66' : '#c9b9bc', al, 'num', 700, c.hot > 0.6 ? 8 : 0);
      });
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);

