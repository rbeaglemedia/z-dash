'use strict';
// Neon World road traffic. Every car is the player's 370Z, following CITY lanes.
// No pursuit, no police, no ramming. A car that meets the player slows and stays in its lane.
// Near cars are a photo of his showroom Z: same GLB, same paint, same tyre and
// rim meshes in the wells. The only source is ZD.Xray.car, which init() loads
// from shared/assets/370z-glb.js (ZD_EMBED.cfg file assets/370z.glb). Other
// embedded cars are not this Z. Copying that picture off the GL canvas is not
// cheap, so each view is photographed once and blitted. The wheels stay on the
// axle. They are not flat stars turned toward the camera.
// Farther cars are boxes or dots. No shadowBlur.
// Lanes come only from the road net (nodes, edges, lanes, len, w, kind).
// Neon World fills that net. A later world can too, and traffic follows it
// without reading that world's buildings.
const TRAFFIC = (() => {
  const T = window.TRAFFIC_TUNE;
  const OFF = /[?&]notraffic=1/.test(location.search);
  let seed = 0x5a7f13c1;
  function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function lim(v, a, b) { return v < a ? a : v > b ? b : v; }
  function angDiff(a, b) { return Math.atan2(Math.sin(a - b), Math.cos(a - b)); }
  const lanes = [];
  const cars = [];
  const cache = new Map();
  const sparks = [];
  const warmSet = new Set();
  let bakes = 0, bakeErr = '', cloned = 0, built = false, sparkN = 0;
  let roadSig = 0, warmKeys = null, warmAt = 0, frameN = 0, dotHold = 0;
  let wingHinges = 0, crewN = 0;

  function kidOf(p) {
    return {paint:p.paint, glow:p.glow, grid:p.grid, wheel:'#4a4f57', wheelGlow:false, spoiler:null, wings:null, extra:null, extras:[]};
  }
  const kids = T.paints.map(kidOf);

  function cityObj() {
    return typeof CITY === 'undefined' ? null : CITY;
  }
  function runway(x, z) {
    // Neon World's strip. A later world with no strip sets CITY.noRunway.
    const C = cityObj();
    if (C && C.noRunway) return false;
    return Math.abs(x) < 20 && z > -80 && z < 1520;
  }
  function groundProbe(x, z, y) {
    const C = cityObj();
    if (!C || typeof C.probe !== 'function') return {fl:0, wl:null};
    return C.probe(x, z, y) || {fl:0, wl:null};
  }
  function roadNet() {
    const C = cityObj();
    const R = C && C.ROADS;
    if (!R || !R.nodes || !R.edges) return null;
    return R;
  }
  function solidAt(x, z) {
    if (runway(x, z)) return true;
    const pr = groundProbe(x, z, 0.7);
    if (!pr.wl || pr.wl.ramp) return false;
    const b = pr.wl.b;
    if (b && b.kind === 'pylon' && !b.towCab) return false;
    if (b && (b.kind === 'bill' || b.kind === 'outline')) return false;
    return true;
  }
  function groundY(x, z) {
    const pr = groundProbe(x, z, 2);
    return Math.max(0, pr.fl || 0);
  }
  function blocked(L, s) {
    for (const iv of L.blocks) if (s >= iv[0] && s <= iv[1]) return true;
    return false;
  }
  function blockedAhead(L, s) {
    const a = s, b = s + 7;
    for (const iv of L.blocks) if (iv[1] >= a && iv[0] <= b) return true;
    return false;
  }

  const towOid = id => { const C = cityObj(); const ts = (C && C.TOWS) || []; for (let i = 0; i < ts.length; i++) if (ts[i].oid === id) return true; return false; };
  function roadsSig() {
    const R = roadNet();
    if (!R) return 0;
    let h = R.nodes.length * 100003 + R.edges.length;
    for (let i = 0; i < R.edges.length; i++) {
      const e = R.edges[i];
      if (!e) { h = (h * 33 + 7) | 0; continue; }
      h = (h * 33 + (((e.len || 0) * 10) | 0) + (e.a | 0) * 17 + (e.b | 0) * 131 + (((e.w || 0) * 4) | 0)) | 0;
    }
    return h >>> 0;
  }
  function build() {
    const sig = roadsSig();
    if (built && sig === roadSig) return;
    const again = built;
    if (again) {
      lanes.length = 0;
      for (const c of cars) { c.on = false; c.lane = null; c.turn = null; c.arc = null; c.blend = 0; }
    }
    const R = roadNet();
    if (!R) { built = false; return; }
    built = true;
    roadSig = sig;
    const nodes = R.nodes;
    const edges = [];
    for (const e of R.edges) {
      if (!e || !e.lanes || !e.lanes.length || e.len < 8) continue;
      const A = nodes[e.a], B = nodes[e.b];
      if (!A || !B) continue;
      const o = Math.hypot(e.lanes[0].off[0], e.lanes[0].off[1]) || (e.w / 4);
      const dists = e.w >= 28 ? [o, Math.min(e.w / 2 - 1.6, o + 3.6)] : [o];
      const el = {id:e.id, kind:e.kind, ax:A.x, az:A.z, bx:B.x, bz:B.z, len:e.len, lanes:[]};
      for (let li = 0; li < 2; li++) {
        const base = e.lanes[li];
        dists.forEach((dist, slot) => {
          const k = dist / o, ox = base.off[0] * k, oz = base.off[1] * k;
          const x0 = (li ? B.x : A.x) + ox, z0 = (li ? B.z : A.z) + oz;
          const x1 = (li ? A.x : B.x) + ox, z1 = (li ? A.z : B.z) + oz;
          const len = Math.hypot(x1 - x0, z1 - z0);
          if (len < 8) return;
          const blocks = [];
          for (const b of e.blockedBy || []) {
            if (towOid(b.oid)) continue;
            let s0, s1;
            if (!li) { s0 = b.d0 - 4; s1 = b.d1 + 4; }
            else { s0 = e.len - (b.d1 + 4); s1 = e.len - (b.d0 - 4); }
            s0 = lim(s0, 0, len); s1 = lim(s1, 0, len);
            if (s1 - s0 > 1) blocks.push([s0, s1]);
          }
          const L = {id:lanes.length, edge:e.id, li, slot, kind:e.kind, x0, z0, x1, z1, len, yaw:Math.atan2(x1 - x0, z1 - z0), blocks, straight:null, turns:[]};
          L.at = s => { const t = lim(s, 0, L.len) / L.len; return [L.x0 + (L.x1 - L.x0) * t, L.z0 + (L.z1 - L.z0) * t]; };
          lanes.push(L); el.lanes.push(L);
        });
      }
      if (el.lanes.length) edges.push(el);
    }
    const cell = 24, buckets = new Map();
    const ck = (x, z) => ((Math.round(x / cell) + 4000) * 8001 + (Math.round(z / cell) + 4000));
    for (const L of lanes) {
      const p = L.at(0), k = ck(p[0], p[1]);
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(L);
    }
    for (const L of lanes) {
      const p = L.at(L.len);
      let best = null, bd = 6;
      for (let ix = -1; ix <= 1; ix++) for (let iz = -1; iz <= 1; iz++) {
        const bucket = buckets.get(ck(p[0] + ix * cell, p[1] + iz * cell));
        if (!bucket) continue;
        for (const M of bucket) {
          if (M === L || M.edge === L.edge || M.slot !== L.slot) continue;
          if (Math.abs(angDiff(L.yaw, M.yaw)) > 0.55) continue;
          const q = M.at(0), d = Math.hypot(p[0] - q[0], p[1] - q[1]);
          if (d < bd) { bd = d; best = M; }
        }
      }
      L.straight = best;
    }
    const cross = (x1, z1, x2, z2, x3, z3, x4, z4) => {
      const d = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4);
      if (Math.abs(d) < 1e-6) return null;
      const t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / d;
      const u = ((x1 - x3) * (z1 - z2) - (z1 - z3) * (x1 - x2)) / d;
      if (t < -0.02 || t > 1.02 || u < -0.02 || u > 1.02) return null;
      return {t:lim(t, 0, 1), u:lim(u, 0, 1)};
    };
    let tid = 1;
    const link = (A, sA, B, sB) => {
      const ang = Math.abs(angDiff(A.yaw, B.yaw));
      if (ang < 0.55 || ang > 2.55) return;
      if (sA < 0 || sA > A.len || sB < 0 || sB > B.len) return;
      A.turns.push({s:sA, to:B, s2:Math.max(0.4, Math.min(B.len - 0.4, sB)), id:tid++});
    };
    for (let i = 0; i < edges.length; i++) {
      const A = edges[i];
      const a0x = Math.min(A.ax, A.bx), a1x = Math.max(A.ax, A.bx), a0z = Math.min(A.az, A.bz), a1z = Math.max(A.az, A.bz);
      for (let j = i + 1; j < edges.length; j++) {
        const B = edges[j];
        if (Math.max(a0x, Math.min(B.ax, B.bx)) - 2 > Math.min(a1x, Math.max(B.ax, B.bx))) continue;
        if (Math.max(a0z, Math.min(B.az, B.bz)) - 2 > Math.min(a1z, Math.max(B.az, B.bz))) continue;
        const hit = cross(A.ax, A.az, A.bx, A.bz, B.ax, B.az, B.bx, B.bz);
        if (!hit) continue;
        for (const LA of A.lanes) for (const LB of B.lanes) {
          const sA = LA.li ? (1 - hit.t) * LA.len : hit.t * LA.len;
          const sB = LB.li ? (1 - hit.u) * LB.len : hit.u * LB.len;
          link(LA, sA, LB, sB);
          link(LB, sB, LA, sA);
        }
      }
    }
    for (const L of lanes) L.turns.sort((a, b) => a.s - b.s);
    if (!again) {
      for (let i = 0; i < T.simCap; i++) cars.push(blank(true));
      for (let i = 0; i < T.dotCap; i++) cars.push(blank(false));
    } else {
      for (const c of cars) respawn(c);
    }
  }
  function blank(sim) {
    const c = {sim, on:false, lane:null, s:0, v:0, v0:0, yaw:0, x:0, z:0, y:0, pi:0, turn:null, rollS:-1, blend:0, blend0:0, bx:0, bz:0, by:0, utT:0, was:false, tick:0, hit:false, hitT:0, fade:1, vx:0, vy:0, vz:0, spin:0, roll:0, vroll:0, braking:false, yawRate:0, accel:0, bodyRoll:0, pitch:0, nose:0, noseV:0, steer:0, wheelA:0, slip:0, suspY:0, suspV:0, ground:true, gy:0, airVx:0, airVz:0, arc:null, rampSeen:0, rampYes:false, _blend:0};
    c.slot = {draw:() => drawOne(c)};
    return c;
  }
  function rollSpeed(kind) {
    const add = (kind === 'highway' || kind === 'bridge' || kind === 'tunnel') ? T.highwayAdd : 0;
    return T.speedMin + add + rnd() * (T.speedMax - T.speedMin);
  }
  function tooClose(L, s, sim) {
    if (!sim) return false;
    for (const o of cars) {
      if (!o.on || !o.sim || o.lane !== L) continue;
      let ds = Math.abs(o.s - s);
      ds = Math.min(ds, L.len - ds);
      if (ds < T.gap) return true;
      if (Math.hypot(o.x - L.at(s)[0], o.z - L.at(s)[1]) < T.gap * 0.8) return true;
    }
    return false;
  }
  function spot(minR, maxR, sim) {
    const px = P.x, pz = P.z;
    for (let n = 0; n < 70; n++) {
      const L = lanes[(rnd() * lanes.length) | 0];
      if (!L) return null;
      const s = 3 + rnd() * (L.len - 6);
      if (blocked(L, s) || blockedAhead(L, s)) continue;
      const p = L.at(s), d = Math.hypot(p[0] - px, p[1] - pz);
      if (d < minR || d > maxR) continue;
      if (runway(p[0], p[1]) || solidAt(p[0], p[1])) continue;
      if (tooClose(L, s, sim)) continue;
      return {L, s, x:p[0], z:p[1]};
    }
    return null;
  }
  function clearWreck(c) {
    c.hit = false; c.hitT = 0; c.fade = 1; c.roll = 0; c.vroll = 0; c.spin = 0; c.vy = 0; c.vx = 0; c.vz = 0; c.was = false;
  }
  function respawn(c) {
    clearWreck(c);
    const sp = c.sim ? spot(28, T.simRadius, true) : spot(T.dotInner, T.dotDist - 40, false);
    if (!sp) { c.on = false; return; }
    c.on = true; c.lane = sp.L; c.s = sp.s; c.x = sp.x; c.z = sp.z; c.yaw = sp.L.yaw; c.y = c.sim ? groundY(sp.x, sp.z) : 0;
    c.pi = (rnd() * T.paints.length) | 0; c.v0 = rollSpeed(sp.L.kind); c.v = c.v0;
    c.turn = null; c.rollS = -1; c.blend = 0; c.was = false; c.utT = 0; c.arc = null;
    c.braking = false; c.yawRate = 0; c.accel = 0; c.bodyRoll = 0; c.pitch = 0; c.slip = 0;
    c.nose = 0; c.noseV = 0; c.steer = 0; c.wheelA = 0; c._blend = 0;
    c.suspY = 0; c.suspV = 0; c.ground = true; c.gy = c.y; c.airVx = 0; c.airVz = 0;
    c.rampSeen = 0; c.rampYes = false;
  }
  function blendDur() { return (T.blendMin || 0.65) + rnd() * ((T.blendMax || 0.85) - (T.blendMin || 0.65)); }
  function switchTo(c, lane, s) {
    s = lim(s, 0.4, lane.len - 0.4);
    if (blocked(lane, s)) { respawn(c); return; }
    const p = lane.at(s);
    const jump = Math.hypot(c.x - p[0], c.z - p[1]);
    const mx = (c.x + p[0]) / 2, mz = (c.z + p[1]) / 2;
    if (jump < 16 && jump > 0.4 && !solidAt(mx, mz) && !runway(mx, mz)) {
      const dur = blendDur();
      c.bx = c.x; c.bz = c.z; c.by = c.yaw; c.blend0 = dur; c.blend = dur;
    } else c.blend = 0;
    c.lane = lane; c.s = s; c.turn = null; c.rollS = -1;
    place(c);
  }
  function doUturn(c) {
    const L = c.lane;
    let rev = null;
    for (const M of lanes) if (M.edge === L.edge && M.li !== L.li && M.slot === L.slot) { rev = M; break; }
    if (!rev) { respawn(c); return; }
    const s2 = lim(rev.len - c.s, 0.4, rev.len - 0.4);
    if (blocked(rev, s2)) { respawn(c); return; }
    switchTo(c, rev, s2);
    c.utT = 1.4;
  }
  function place(c) {
    const p = c.lane.at(c.s), yaw = c.lane.yaw;
    if (c.blend > 0 && c.blend0 > 0) {
      const u = 1 - c.blend / c.blend0, e = u * u * (3 - 2 * u);
      c.x = c.bx + (p[0] - c.bx) * e; c.z = c.bz + (p[1] - c.bz) * e;
      c.yaw = c.by + angDiff(yaw, c.by) * e;
    } else { c.x = p[0]; c.z = p[1]; c.yaw = yaw; }
  }
  function crowd(c) {
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);
    let hold = null, hd = T.gap;
    const see = o => {
      if (!o || o.x == null) return;
      const dx = o.x - c.x, dz = o.z - c.z, d = Math.hypot(dx, dz);
      if (d > 0.05 && d < hd && dx * fx + dz * fz > 0.4) { hd = d; hold = o; }
    };
    for (const o of cars) {
      if (o === c || !o.on || !o.sim) continue;
      see(o);
    }
    const trucks = window.TOWDRIVE && TOWDRIVE.trucks;
    if (trucks) for (let i = 0; i < trucks.length; i++) see(trucks[i]);
    return hold ? {o:hold, d:hd} : null;
  }
  function noteBrake(c) {
    c.braking = false;
    const h = crowd(c);
    if (h) {
      const cap = h.d < T.carL + 1.2 ? 1.5 : (h.o.v == null ? c.v : h.o.v);
      if (cap < c.v - 0.35) c.braking = true;
    }
    const ds = c.turn ? c.turn.s - c.s : 99;
    if (c.arc || (c.turn && ds < (T.cornerDist || 18) && ds > -2)) {
      if (c.v > (T.cornerFrac || 0.58) * c.v0 + 0.4) c.braking = true;
    }
    return h;
  }
  function pace(c, dt) {
    let target = c.v0;
    const h = noteBrake(c);
    if (h) {
      const cap = h.d < T.carL + 1.2 ? 1.5 : (h.o.v == null ? c.v : h.o.v);
      if (cap < target) target = cap;
    }
    const ds = c.turn ? c.turn.s - c.s : 99;
    if (c.arc || (c.turn && ds < (T.cornerDist || 18) && ds > -2)) {
      const corner = (T.cornerFrac || 0.58) * c.v0;
      if (corner < target) target = corner;
    }
    if (c.v < target) c.v = Math.min(target, c.v + (T.accel || 5.5) * dt);
    else c.v = Math.max(target, c.v - (T.brake || 6.8) * dt);
    if (c.v < 0.4) c.v = 0.4;
  }
  function beginArc(c) {
    const dest = c.turn && c.turn.to;
    if (!dest) return false;
    const s2 = lim((c.turn.s2 || 0) + 4.2, 0.8, dest.len - 0.8);
    if (blocked(dest, s2)) return false;
    const p0 = [c.x, c.z];
    const p2 = dest.at(s2);
    const apex = c.lane.at(lim(c.turn.s, 0.2, c.lane.len - 0.2));
    const ctrl = [2 * apex[0] - 0.5 * (p0[0] + p2[0]), 2 * apex[1] - 0.5 * (p0[1] + p2[1])];
    const dur = blendDur();
    c.arc = {p0, p2, ctrl, yaw0:c.yaw, yaw2:dest.yaw, t:0, dur, lane:dest, s2};
    c.blend0 = dur; c.blend = dur;
    return true;
  }
  function stepArc(c, dt) {
    const a = c.arc;
    a.t += dt;
    const u = lim(a.t / a.dur, 0, 1), e = u * u * (3 - 2 * u), o = 1 - e;
    c.x = o * o * a.p0[0] + 2 * o * e * a.ctrl[0] + e * e * a.p2[0];
    c.z = o * o * a.p0[1] + 2 * o * e * a.ctrl[1] + e * e * a.p2[1];
    c.yaw = a.yaw0 + angDiff(a.yaw2, a.yaw0) * e;
    c.s = Math.min(c.lane.len - 0.2, c.s + c.v * dt * 0.45);
    if (u < 1) return;
    c.lane = a.lane; c.s = a.s2; c.yaw = a.lane.yaw; c.turn = null; c.rollS = -1; c.arc = null; c.blend = 0;
  }
  function sameCard(yaw, dir) {
    const d = [0, Math.PI / 2, Math.PI, -Math.PI / 2][dir] || 0;
    return Math.abs(angDiff(yaw, d)) < 0.55;
  }
  function rampHere(c) {
    const C = cityObj();
    const R = C && C.RAMPS;
    if (!R || !R.length) return null;
    const grab = T.rampGrab || 3.5;
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);
    const ax = c.x + fx * 6, az = c.z + fz * 6;
    let best = null, bd = grab;
    for (let i = 0; i < R.length; i++) {
      const q = R[i];
      if (!q || q.hid || q.nm === 'tow') continue;
      if (!sameCard(c.yaw, q.dir || 0)) continue;
      const near = (x, z) => {
        const cx = lim(x, q.x0, q.x1), cz = lim(z, q.z0, q.z1);
        return Math.hypot(x - cx, z - cz);
      };
      const d = Math.min(near(c.x, c.z), near(ax, az));
      if (d < bd) { bd = d; best = q; }
    }
    return best;
  }
  function rampSeek(c, dt) {
    if (c.ground === false || c.arc || c.hop) return;
    const q = rampHere(c);
    if (!q) { c.rampSeen = 0; return; }
    const id = q.oid != null ? q.oid : (q.x0 + ',' + q.z0);
    if (c.rampSeen !== id) { c.rampSeen = id; c.rampYes = rnd() < 0.62; }
    if (!c.rampYes) return;
    let tx, tz;
    if ((q.dir || 0) % 2 === 0) { tx = (q.x0 + q.x1) / 2; tz = lim(c.z + Math.cos(c.yaw) * 2.2, q.z0, q.z1); }
    else { tz = (q.z0 + q.z1) / 2; tx = lim(c.x + Math.sin(c.yaw) * 2.2, q.x0, q.x1); }
    const k = Math.min(1, dt * 3.6);
    c.x += (tx - c.x) * k; c.z += (tz - c.z) * k;
  }
  function susp(c, dt) {
    const y = c.suspY || 0, v = c.suspV || 0;
    const k = T.susK || 140, d = T.susD || 8;
    const hold = c.braking ? (T.susBrake == null ? -0.07 : T.susBrake) : 0;
    c.suspV = v + ((hold - y) * k - v * d) * dt;
    c.suspY = lim(y + c.suspV * dt, T.susLo == null ? -0.18 : T.susLo, T.susHi == null ? 0.10 : T.susHi);
  }
  function puff(c) {
    for (let i = 0; i < 4; i++) {
      sparks.push({
        x: c.x + (rnd() - 0.5) * 1.4, y: (c.gy || 0) + 0.12, z: c.z + (rnd() - 0.5) * 1.4,
        vx: (rnd() - 0.5) * 3, vy: 0.5 + rnd() * 1.1, vz: (rnd() - 0.5) * 3,
        col: i % 2 ? '#d8d2e6' : '#ffffff', life: 0.32 + rnd() * 0.15, t: 0
      });
    }
  }
  function body(c, dt, prevYaw, prevV) {
    const raw = angDiff(c.yaw, prevYaw) / Math.max(0.001, dt);
    c.yawRate = (c.yawRate || 0) + (raw - (c.yawRate || 0)) * Math.min(1, dt * 8);
    c.accel = (c.v - prevV) / Math.max(0.001, dt);
    const rollMax = T.rollMax || 0.42;
    const targetRoll = lim(-c.yawRate * (T.rollGain || 0.28), -rollMax, rollMax);
    c.bodyRoll = (c.bodyRoll || 0) + (targetRoll - (c.bodyRoll || 0)) * Math.min(1, dt * 8);
    c.slip = lim(c.yawRate * 0.12, -0.22, 0.22);
    c.steer = lim(c.yawRate * 0.45, -0.55, 0.55);
    const brakeN = c.braking ? (T.noseBrake || 0.30) : 0;
    const accelN = (c.accel || 0) > 0.8 ? Math.min(T.noseAccel || 0.10, (c.accel || 0) * 0.012) : 0;
    const noseT = brakeN - accelN;
    c.noseV = (c.noseV || 0) + ((noseT - (c.nose || 0)) * 90 - (c.noseV || 0) * 11) * dt;
    c.nose = lim((c.nose || 0) + c.noseV * dt, -0.16, 0.42);
    const wr = T.wheelR || 0.33;
    const spinV = c.ground === false ? c.v * 0.2 : c.v;
    c.wheelA = (c.wheelA || 0) + spinV * dt / wr;
  }
  function vertSim(c, dt, prevX, prevZ) {
    const stepDist = Math.hypot(c.x - prevX, c.z - prevZ);
    const pr = groundProbe(c.x, c.z, (c.y || 0) + 1.6);
    const gy = Math.max(0, pr.fl || 0);
    const prevGy = c.gy == null ? gy : c.gy;
    const hopping = c.hop && c.hop.phase === 'air';
    if (c.ground !== false && !hopping) {
      const slope = lim((gy - prevGy) / Math.max(0.12, stepDist), -0.40, 0.48);
      c.pitch = (c.pitch || 0) + (slope - (c.pitch || 0)) * Math.min(1, dt * 14);
      if (slope > 0.04) c.vy = Math.max(c.vy || 0, c.v * Math.sin(slope));
      const lip = (c.y - gy > 0.32) || (prevGy > 0.5 && gy < prevGy - 0.35);
      if (lip) {
        c.ground = false;
        c.vy = Math.max(c.vy || 0, 2.4 + c.v * Math.sin(Math.max(0.14, c.pitch || 0.18)));
        c.v = Math.max(c.v, 14);
        c.airVx = Math.sin(c.yaw) * c.v; c.airVz = Math.cos(c.yaw) * c.v;
      } else {
        c.y = gy; c.ground = true;
        if (slope <= 0.04) {
          c.vy = 0;
          c.pitch += (0 - (c.pitch || 0)) * Math.min(1, dt * 6);
        }
      }
    } else if (!hopping) {
      c.y += (c.vy || 0) * dt;
      c.vy = (c.vy || 0) - 13.5 * dt;
      const airPitch = lim(Math.atan2(c.vy, Math.max(5, c.v)) * 0.85, -0.30, 0.36);
      c.pitch += (airPitch - (c.pitch || 0)) * Math.min(1, dt * 8);
      c.bodyRoll = (c.bodyRoll || 0) * Math.max(0, 1 - 3 * dt);
      if (c.y <= gy && c.vy <= 0) {
        const drop = c.vy;
        c.y = gy; c.ground = true;
        c.suspV = lim(drop * 0.45, -4, -0.9);
        c.vy = 0;
        if (drop < -2.2) puff(c);
      }
    }
    c.gy = gy;
    susp(c, dt);
  }
  function afterTow(c, dt, prevX, prevZ, prevY, prevYaw, prevV) {
    const dy = c.y - prevY, ds = Math.hypot(c.x - prevX, c.z - prevZ);
    const pit = lim(Math.atan2(dy, Math.max(0.15, ds)), -0.32, 0.38);
    c.pitch = (c.pitch || 0) + (pit - (c.pitch || 0)) * Math.min(1, dt * 10);
    c.gy = groundY(c.x, c.z);
    const air = c.hop && c.hop.phase === 'air';
    if (air) {
      c.ground = false;
      const vy = dy / Math.max(0.001, dt);
      c.vy = vy;
      const airPitch = lim(Math.atan2(vy, Math.max(5, c.v)) * 0.85, -0.30, 0.36);
      c.pitch += (airPitch - c.pitch) * Math.min(1, dt * 8);
      c.bodyRoll = (c.bodyRoll || 0) * Math.max(0, 1 - 3 * dt);
    } else if (!c.hop && prevY > 0.2) {
      c.ground = true;
      c.y = Math.max(c.gy || 0, 0);
      c.suspV = -1.15;
      c.vy = 0;
      puff(c);
    } else c.ground = true;
    susp(c, dt);
    body(c, dt, prevYaw, prevV);
  }
  function advance(c, dt) {
    const prevX = c.x, prevZ = c.z, prevY = c.y || 0, prevYaw = c.yaw || 0, prevV = c.v || 0;
    if (c.sim) noteBrake(c);
    if (c.sim && window.TOWDRIVE && TOWDRIVE.ride(c, dt)) {
      afterTow(c, dt, prevX, prevZ, prevY, prevYaw, prevV);
      return;
    }
    const L = c.lane;
    if (!L) { respawn(c); return; }
    if (c.utT > 0) c.utT -= dt;
    if (c.sim) pace(c, dt);
    else {
      let target = c.v0;
      c.v += (target - c.v) * Math.min(1, dt * 2);
      if (c.v < 0.4) c.v = 0.4;
    }
    if (!c.turn && !c.arc) {
      let near = null;
      for (const t of L.turns) {
        if (t.s < c.s + 0.8) continue;
        if (t.s > c.s + 22) break;
        if (!near) near = [t];
        else if (t.s > near[0].s + 1.5) break;
        else near.push(t);
      }
      if (near && c.rollS !== near[0].s) {
        c.rollS = near[0].s;
        if (rnd() < T.turnP) c.turn = near[(rnd() * near.length) | 0];
      }
    }
    if (c.sim && c.turn && !c.arc && c.turn.s - c.s <= (T.arcLead || 4.5)) {
      if (!beginArc(c) && c.s + c.v * dt >= c.turn.s - 0.15) {
        switchTo(c, c.turn.to, c.turn.s2);
        vertSim(c, dt, prevX, prevZ); body(c, dt, prevYaw, prevV);
        return;
      }
    }
    if (c.arc) {
      stepArc(c, dt);
      if (c.sim) { rampSeek(c, dt); vertSim(c, dt, prevX, prevZ); body(c, dt, prevYaw, prevV); }
      return;
    }
    const step = c.v * dt;
    if (!c.sim && c.turn && c.s + step >= c.turn.s) { switchTo(c, c.turn.to, c.turn.s2); return; }
    if (blockedAhead(L, c.s + step)) { if (c.utT > 0) respawn(c); else doUturn(c); return; }
    c.s += step;
    if (c.s >= L.len - 0.15) {
      if (L.straight) switchTo(c, L.straight, c.s - L.len + 0.4);
      else {
        const ends = [];
        for (let i = L.turns.length - 1; i >= 0; i--) { if (L.turns[i].s > L.len - 16) ends.push(L.turns[i]); else break; }
        if (ends.length) { const end = ends[(rnd() * ends.length) | 0]; switchTo(c, end.to, end.s2); }
        else if (c.utT > 0) respawn(c);
        else doUturn(c);
      }
      if (c.sim) { vertSim(c, dt, prevX, prevZ); body(c, dt, prevYaw, prevV); }
      return;
    }
    place(c);
    if (c.blend > 0) c.blend = Math.max(0, c.blend - dt);
    if (c.sim) rampSeek(c, dt);
    if (c.sim || (c.tick++ % 18) === 0) {
      if (c.ground !== false && (runway(c.x, c.z) || solidAt(c.x, c.z))) { if (c.utT > 0) respawn(c); else doUturn(c); return; }
    }
    if (c.sim) { vertSim(c, dt, prevX, prevZ); body(c, dt, prevYaw, prevV); }
  }
  function horiz(c) { return Math.hypot(c.x - P.x, c.z - P.z); }
  function maintain() {
    for (const c of cars) {
      if (!c.on) { respawn(c); continue; }
      const d = horiz(c);
      if (c.sim) { if (d > T.recycle) respawn(c); }
      else if (d > T.dotDist - 15 || d < T.dotInner - 25) respawn(c);
    }
  }

  // The player is not a target. Overlap only slows this car. It does not push her, spin, or leave the lane.
  function yieldCar(c) {
    if (!c.sim || !c.on || typeof P === 'undefined' || P.x == null) return;
    const dx = P.x - c.x, dz = P.z - c.z;
    const d = Math.hypot(dx, dz);
    if (d >= (T.carL || 4.25) + 0.6 || Math.abs((P.y || 0) - (c.y || 0)) > 2.2) return;
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);
    const ahead = dx * fx + dz * fz;
    if (ahead > -0.4) c.v = Math.min(c.v, Math.max(0.4, d * 0.45));
  }
  function stepSparks(dt) {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.t += dt;
      if (s.t > s.life) { sparks.splice(i, 1); continue; }
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt; s.vy -= 12 * dt;
    }
  }

  function aimOf(x, y, z, yaw, pitch) {
    const dx = cam.x - x, dz = cam.z - z, dy = cam.y - ((y || 0) + 0.6);
    const hd = Math.hypot(dx, dz) || 0.001;
    const ca = Math.atan2(dx, dz);
    const rel = Math.atan2(Math.sin(ca - yaw), Math.cos(ca - yaw));
    const elev = Math.atan2(dy, hd) - (pitch || 0) * Math.cos(rel);
    return {rel, elev};
  }
  // A car headed with Ellie is photographed from the chase camera's view of her
  // Z, so a car one lane over still reads as the same face. Oncoming traffic
  // keeps its own aim, or a car in front of her would show its tail.
  function photoAim(c) {
    const own = aimOf(c.x, c.y, c.z, c.yaw + (c.slip || 0), c.pitch);
    if (typeof P === 'undefined' || P.x == null) return own;
    if (Math.abs(angDiff(c.yaw, P.yaw || 0)) > 0.9) return own;
    return aimOf(P.x, P.y, P.z, P.yaw || 0, P.pitch || 0);
  }
  function viewKey(c) {
    const aim = photoAim(c);
    const rel = aim.rel, elev = aim.elev;
    const step = T.yawStep || (Math.PI / 12);
    const bins = Math.max(4, Math.round((Math.PI * 2) / step));
    const half = bins / 2;
    const wrap = y => ((y % bins) + bins) % bins;
    let y0 = wrap(Math.round(rel / step));
    if (y0 >= half) y0 -= bins;
    const eStep = T.elevStep || 0.1;
    const eb = lim(Math.round(elev / eStep), -3, 8);
    c._relExact = rel;
    c._elevExact = elev;
    const sb = lim(Math.round((c.steer || 0) / (T.steerStep || 0.15)), -4, 4);
    // One photo. A crossfade of two yaws ghosts the silhouette.
    c._blend = 0;
    c._key = c.pi + ':' + y0 + ':' + eb + ':' + sb;
    c._key2 = c._key;
    return c._key;
  }
  // Low-poly copy of his Z. Built once. Drawn on traffic's own canvas.
  const lod = {
    built: false, ok: false, err: '', tris: 0, draws: 0, wheels: 0, src: 0,
    ms: 0, n: 0, corners: [], scene: null, cam: null, renderer: null, pool: [],
    bodyMat: null, copy: null, copyG: null, atlasW: 0, atlasH: 0
  };
  function skipped(o) {
    for (let p = o; p; p = p.parent) {
      const n = p.name;
      if (n === 'crew' || n === 'kidGrp' || n === 'partsGrp') return true;
      if (p.userData && p.userData.crew) return true;
    }
    return false;
  }
  // Same tags loadGLB uses on this file. "material" is the rim. Material.002 is
  // the bolt pile, left off so the copy is less detailed than the showroom Z.
  function partKind(mat, name) {
    const m = mat || '';
    const u = m.toUpperCase();
    const n = (name || '').toLowerCase();
    if (u === 'TYRE' || /tyre|tire/.test(n)) return 'tyre';
    if (u === 'BRAKE' || /caliper/.test(n)) return 'brake';
    if (m === 'material' || /rim|wheel/.test(n)) return 'rim';
    if (u === 'SILVER' || /rotor|disc/.test(n)) return 'silver';
    if (u === 'GLASS') return 'glass';
    if (u === 'LIGHT' || u === 'LIGHTGLASS') return 'head';
    if (u === 'REARLIGHT') return 'tail';
    if (u === 'BODY' || u === 'CARBON') return 'body';
    if (u === 'MATERIAL.002') return '';
    if (!m) return '';
    return 'trim';
  }
  function eachVert(mesh, fn) {
    const g = mesh.geometry;
    if (!g || !g.attributes || !g.attributes.position) return 0;
    const pos = g.attributes.position, nrm = g.attributes.normal, idx = g.index;
    const n = idx ? idx.count : pos.count;
    const v = lod._v, N = lod._N;
    for (let i = 0; i < n; i++) {
      const vi = idx ? idx.getX(i) : i;
      v.fromBufferAttribute(pos, vi).applyMatrix4(mesh.matrixWorld);
      if (nrm) N.fromBufferAttribute(nrm, vi).transformDirection(mesh.matrixWorld);
      else N.set(0, 1, 0);
      fn(v.x, v.y, v.z, N.x, N.y, N.z);
    }
    return n / 3;
  }
  // GLB meshes keep userData.mat from the file. Edges, crew props, and the
  // procedural wheel cards do not. Kenney traffic models never carry BODY.
  function modelSig(root) {
    let meshes = 0, tris = 0;
    const mats = {};
    if (!root) return {meshes, tris, mats};
    root.traverse(o => {
      if (!o.isMesh || !o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;
      const mat = o.userData && o.userData.mat;
      if (!mat) return;
      meshes++;
      const idx = o.geometry.index, pos = o.geometry.attributes.position;
      tris += (idx ? idx.count : pos.count) / 3;
      mats[mat] = (mats[mat] || 0) + 1;
    });
    return {meshes, tris: Math.round(tris), mats};
  }
  function assertPlayerZ(X, clone) {
    const credit = X.credit || {};
    const file = credit.file || '';
    if (X.source !== 'glb') throw new Error('traffic source is not the player GLB (source ' + (X.source || 'none') + ')');
    if (!/370z\.glb/i.test(file)) throw new Error('traffic source file is ' + (file || 'missing') + ', player Z is assets/370z.glb');
    const player = modelSig(X.car);
    const copy = modelSig(clone);
    if (!player.mats.BODY || player.meshes < 100) {
      throw new Error('player Z has no BODY shell (' + player.meshes + ' tagged meshes). Traffic will not substitute another model.');
    }
    if (player.meshes !== copy.meshes || player.tris !== copy.tris) {
      throw new Error('traffic clone is not the player Z (' + copy.meshes + ' meshes / ' + copy.tris + ' tris vs player ' + player.meshes + ' / ' + player.tris + ')');
    }
    lod.modelFile = file;
    lod.modelTitle = credit.title || '';
    lod.modelMeshes = player.meshes;
    lod.modelTris = player.tris;
    lod.modelMats = player.mats;
  }
  function grabShowroom(X) {
    let env = null, paint = null, lights = [];
    const orig = X.renderer.render.bind(X.renderer);
    X.renderer.render = function (scene, camera) {
      if (scene) {
        if (scene.environment) env = scene.environment;
        if (!lights.length) scene.traverse(o => { if (o.isLight) lights.push(o.clone()); });
        if (!paint) scene.traverse(o => {
          if (paint || !o.isMesh || !o.material || !(o.material.clearcoat > 0.5)) return;
          paint = o.material;
        });
      }
      return orig(scene, camera);
    };
    try {
      X.render(ctx, 0, 0, 64, 64, {
        xray: false, showroom: true, yaw: 0.8, pitch: 0.25, dist: 15,
        tx: 0, ty: 0.6, fov: 26, drl: 1, noDraw: true,
        kid: kids[0], st: { t: 0, throttle: 18 }
      });
    } finally {
      X.renderer.render = orig;
      try { if (X.kidApply) X.kidApply(typeof KID !== 'undefined' ? KID : null, {}); } catch (e) {}
      X._w = 0; X._h = 0;
    }
    return {env, paint, lights};
  }
  function buildLod() {
    if (lod.built) return lod.ok;
    const X = window.ZD && ZD.Xray;
    if (!X || !X.ready || !X.car || !X.renderer || !X.render) return false;
    if (window.ZGL && ZGL.ensure && !ZGL.ensure()) return false;
    const g0 = window.ZGL && ZGL.S ? ZGL.S.g : 0;
    const saved = [];
    const force = (o, name) => { if (!o) return; saved.push([o, o.name]); o.name = name; };
    try {
      if (window.ZGL && ZGL.set) ZGL.set(0);
      force(X.car.getObjectByName && X.car.getObjectByName('crew'), 'crew');
      force(X.kidGrp, 'kidGrp');
      force(X.partsGrp, 'partsGrp');
      const parked = [];
      X.car.traverse(o => {
        const ud = o.userData;
        if (!ud) return;
        let safe = true;
        try { JSON.stringify(ud); } catch (e) { safe = false; }
        if (safe) return;
        const keep = {};
        if (ud.mat) keep.mat = ud.mat;
        if (ud.crew) keep.crew = ud.crew;
        parked.push([o, ud]);
        o.userData = keep;
      });
      let g;
      try { g = X.car.clone(true); }
      finally {
        for (const [o, ud] of parked) o.userData = ud;
        for (const [o, name] of saved) o.name = name;
        if (window.ZGL && ZGL.set) ZGL.set(g0);
      }
      assertPlayerZ(X, g);
      const show = grabShowroom(X);
      if (!show.paint) throw new Error('showroom paint missing');
      g.updateMatrixWorld(true);
      const sample = [];
      g.traverse(o => { if (o.isMesh && o.geometry && o.geometry.attributes && o.geometry.attributes.position) sample.push(o); });
      if (!sample.length) throw new Error('car has no meshes');
      lod.Geo = sample[0].geometry.constructor;
      lod.BA = sample[0].geometry.attributes.position.constructor;
      lod.Mesh = sample[0].constructor;
      lod.Group = g.constructor;
      lod._v = new X.THREE_Vector3();
      lod._N = new X.THREE_Vector3();
      const Mat = show.paint.constructor;
      lod.bodyMat = new Mat({
        color:'#1aa6c8', metalness:0.55, roughness:0.32,
        clearcoat:1, clearcoatRoughness:0.06, envMapIntensity:1.25
      });
      lod.trimMat = new Mat({color:'#17181d', metalness:0.45, roughness:0.5});
      lod.glassMat = new Mat({color:'#cfe6f5', transparent:true, opacity:0.3, roughness:0.05, metalness:0.4, depthWrite:false});
      lod.tyreMat = new Mat({color:'#141416', roughness:0.92, metalness:0.05});
      lod.rimMat = new Mat({color:'#3e434b', metalness:0.45, roughness:0.55, envMapIntensity:0.4});
      lod.brakeMat = new Mat({color:'#d1121f', emissive:'#ff2a3d', emissiveIntensity:0.25, roughness:0.4, metalness:0.4});
      lod.headMat = new Mat({color:'#e7fbff', emissive:'#e7fbff', emissiveIntensity:1.3, roughness:0.2, metalness:0.1});
      lod.tailMat = new Mat({color:'#ff2a3d', emissive:'#ff2a3d', emissiveIntensity:1.2, roughness:0.3, metalness:0.1});
      for (const m of [lod.bodyMat, lod.trimMat, lod.glassMat, lod.tyreMat, lod.rimMat, lod.brakeMat, lod.headMat, lod.tailMat]) {
        m.side = 2;
        if (show.env) m.envMap = show.env;
      }
      // Keep the loader's placement (nose +X, ground at y = 0, centred). A second
      // recenter, or welding the shell onto a 2 cm grid, was what broke the silhouette.
      const lists = {body:[], trim:[], glass:[], head:[], tail:[]};
      const wheels = [];
      let wing = 0, crew = 0, dropped = 0;
      const V = X.THREE_Vector3;
      function meshCenter(mesh) {
        const acc = new V();
        let n = 0;
        eachVert(mesh, (x, y, z) => { acc.x += x; acc.y += y; acc.z += z; n++; });
        if (!n) return new V();
        return acc.multiplyScalar(1 / n);
      }
      g.traverse(o => {
        if (o.name === 'crew' || (o.userData && o.userData.crew)) crew++;
        if (o.userData && (o.userData.ax || o.userData.p2)) wing++;
        if (!o.isMesh || skipped(o) || !o.geometry) return;
        const matName = o.userData && o.userData.mat;
        if (!matName) return;
        const kind = partKind(matName, o.name);
        if (!kind) { dropped++; return; }
        lod.src++;
        if (kind === 'tyre' || kind === 'rim' || kind === 'brake' || kind === 'silver') {
          wheels.push({mesh:o, kind, c:meshCenter(o)});
        } else lists[kind].push(o);
      });
      const tyres = wheels.filter(w => w.kind === 'tyre');
      const seeds = [];
      for (const fx of [true, false]) for (const fz of [true, false]) {
        const q = tyres.filter(w => (w.c.x >= 0) === fx && (w.c.z >= 0) === fz);
        if (!q.length) continue;
        const c = new V();
        q.forEach(w => c.add(w.c));
        c.multiplyScalar(1 / q.length);
        seeds.push({c, front: fx, side: c.z >= 0 ? 1 : -1, tyre:[], rim:[], brake:[]});
      }
      if (seeds.length !== 4) throw new Error('expected 4 wheels, got ' + seeds.length + ' from ' + tyres.length + ' tyres');
      for (const w of wheels) {
        let best = seeds[0], bd = 1e9;
        for (const s of seeds) {
          const d = (w.c.x - s.c.x) ** 2 + (w.c.y - s.c.y) ** 2 + (w.c.z - s.c.z) ** 2;
          if (d < bd) { bd = d; best = s; }
        }
        if (w.kind === 'silver' && bd > 0.2) { lists.trim.push(w.mesh); continue; }
        const slot = w.kind === 'tyre' ? 'tyre' : w.kind === 'brake' ? 'brake' : 'rim';
        best[slot].push(w.mesh);
      }
      function bakeGeo(mesh) {
        const geo = mesh.geometry.clone();
        geo.applyMatrix4(mesh.matrixWorld);
        return geo;
      }
      function shiftGeo(geo, c) {
        if (geo.translate) geo.translate(-c.x, -c.y, -c.z);
        else {
          const p = geo.attributes.position;
          for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) - c.x, p.getY(i) - c.y, p.getZ(i) - c.z);
          p.needsUpdate = true;
        }
        if (geo.computeBoundingSphere) geo.computeBoundingSphere();
        return geo;
      }
      function nTris(geo) {
        if (!geo || !geo.attributes || !geo.attributes.position) return 0;
        const idx = geo.index, pos = geo.attributes.position;
        return (idx ? idx.count : pos.count) / 3;
      }
      const baked = {
        body: lists.body.map(bakeGeo),
        trim: lists.trim.map(bakeGeo),
        glass: lists.glass.map(bakeGeo),
        head: lists.head.map(bakeGeo),
        tail: lists.tail.map(bakeGeo)
      };
      const wheelGeo = seeds.map(s => ({
        tyre: s.tyre.map(m => shiftGeo(bakeGeo(m), s.c)),
        rim: s.rim.map(m => shiftGeo(bakeGeo(m), s.c)),
        brake: s.brake.map(m => shiftGeo(bakeGeo(m), s.c))
      }));
      const countList = arr => arr.reduce((n, geo) => n + nTris(geo), 0);
      let tris = countList(baked.body) + countList(baked.trim) + countList(baked.glass) + countList(baked.head) + countList(baked.tail);
      wheelGeo.forEach(w => { tris += countList(w.tyre) + countList(w.rim) + countList(w.brake); });
      lod.dropped = dropped;
      // Same GL context as the player so the studio environment map still applies.
      const renderer = X.renderer;
      const scene = new X.scene.constructor();
      scene.environment = show.env || null;
      show.lights.forEach(l => scene.add(l));
      const camL = new X.cam.constructor(26, 1, 0.05, 80);
      function addMesh(parent, geo, mat, order) {
        if (!geo) return null;
        const m = new lod.Mesh(geo, mat);
        m.frustumCulled = false;
        m.userData.part = mat === lod.bodyMat ? 'body' : '';
        if (order) m.renderOrder = order;
        parent.add(m);
        return m;
      }
      function makeCar() {
        const root = new lod.Group();
        let draws = 0;
        const put = (geos, mat, order) => { for (const geo of geos) if (addMesh(root, geo, mat, order)) draws++; };
        put(baked.body, lod.bodyMat);
        put(baked.trim, lod.trimMat);
        put(baked.glass, lod.glassMat, 2);
        put(baked.head, lod.headMat, 3);
        put(baked.tail, lod.tailMat, 3);
        root.wheels = seeds.map((s, i) => {
          const pivot = new lod.Group();
          pivot.position.copy(s.c);
          const spin = new lod.Group();
          pivot.add(spin);
          for (const geo of wheelGeo[i].tyre) if (addMesh(spin, geo, lod.tyreMat)) draws++;
          for (const geo of wheelGeo[i].rim) if (addMesh(spin, geo, lod.rimMat)) draws++;
          for (const geo of wheelGeo[i].brake) if (addMesh(pivot, geo, lod.brakeMat)) draws++;
          root.add(pivot);
          return {pivot, spin, front: s.front, side: s.side};
        });
        root.userData.draws = draws;
        root.visible = false;
        scene.add(root);
        return root;
      }
      const pool = [];
      for (let i = 0; i < 12; i++) pool.push(makeCar());
      lod.scene = scene; lod.cam = camL; lod.renderer = renderer; lod.pool = pool;
      lod.tris = Math.round(tris); lod.draws = pool[0].userData.draws; lod.wheels = seeds.length;
      lod.corners = seeds.map(s => [+s.c.x.toFixed(3), +s.c.y.toFixed(3), +s.c.z.toFixed(3), s.front ? 1 : 0, s.side]);
      const bb = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9];
      let sx = 0, sy = 0, sz = 0, n = 0;
      for (const geo of baked.body) {
        const arr = geo.attributes.position.array;
        for (let i = 0; i < arr.length; i += 3) {
          const x = arr[i], y = arr[i + 1], z = arr[i + 2];
          if (x < bb[0]) bb[0] = x; if (x > bb[3]) bb[3] = x;
          if (y < bb[1]) bb[1] = y; if (y > bb[4]) bb[4] = y;
          if (z < bb[2]) bb[2] = z; if (z > bb[5]) bb[5] = z;
          sx += x; sy += y; sz += z; n++;
        }
      }
      lod.bodyBox = bb.map(v => +v.toFixed(3));
      lod.radius = n ? +Math.hypot((bb[3] - bb[0]) / 2, (bb[4] - bb[1]) / 2, (bb[5] - bb[2]) / 2).toFixed(3) : 0;
      if (n) {
        const mx = sx / n, my = sy / n, mz = sz / n;
        lod.bodyStat = { n, mean: [mx, my, mz].map(v => +v.toFixed(3)), dropped };
      }
      lod.partTris = {
        body: countList(baked.body) | 0, trim: countList(baked.trim) | 0, glass: countList(baked.glass) | 0,
        tyre: wheelGeo.reduce((n, w) => n + countList(w.tyre), 0) | 0,
        rim: wheelGeo.reduce((n, w) => n + countList(w.rim), 0) | 0,
        brake: wheelGeo.reduce((n, w) => n + countList(w.brake), 0) | 0
      };
      lod.env = !!show.env;
      lod.lightN = show.lights.length;
      wingHinges = wing; crewN = crew; cloned = lod.src;
      lod.built = true; lod.ok = true;
      return true;
    } catch (e) {
      lod.err = String(e && e.stack || e);
      bakeErr = lod.err;
      try { if (window.ZGL && ZGL.set) ZGL.set(g0); } catch (e2) {}
      for (const [o, name] of saved) o.name = name;
      lod.built = true; lod.ok = false;
      return false;
    }
  }
  function viewAngles(c) {
    if (c._rel != null) return {rel: c._rel, elev: c._elev || 0};
    const yDraw = (c.y || 0) + (c.suspY || 0);
    const dx = cam.x - c.x, dz = cam.z - c.z, dy = cam.y - (yDraw + 0.6);
    const hd = Math.hypot(dx, dz) || 0.001;
    const vis = (c.yaw || 0) + (c.slip || 0);
    const ca = Math.atan2(dx, dz);
    const rel = Math.atan2(Math.sin(ca - vis), Math.cos(ca - vis));
    return {rel, elev: Math.atan2(dy, hd)};
  }
  function poseCar(inst, c) {
    const paint = T.paints[c.pi | 0] || T.paints[0];
    lod.bodyMat.color.set(paint.paint);
    const nose = (c.nose || 0) + (c.pitch || 0);
    const roll = (c.bodyRoll || 0) + (c.roll || 0);
    inst.rotation.set(roll, 0, -nose);
    inst.position.set(0, 0, 0);
    inst.visible = true;
    const only = c.only;
    inst.traverse(o => {
      if (!o.isMesh) return;
      if (!only) { o.visible = true; return; }
      if (only === 'body') {
        const isBody = o.material === lod.bodyMat || o.userData.part === 'body';
        o.visible = isBody;
        if (isBody) o.material = lod.tyreMat;
        return;
      }
      if (only === 'wheels') o.visible = o.material === lod.tyreMat || o.material === lod.rimMat;
    });
    lod.bodyMat.wireframe = only === 'body';
    const steer = c.steer || 0, spin = c.wheelA || 0;
    for (const w of inst.wheels) {
      w.pivot.rotation.set(0, w.front ? steer : 0, 0);
      w.spin.rotation.set(0, 0, -spin * w.side);
    }
    inst.updateMatrixWorld(true);
  }
  function placeCam(c) {
    const a = viewAngles(c);
    const dist = 7 / (2 * Math.tan(13 * Math.PI / 180));
    const ty = 0.6, ce = Math.cos(a.elev), se = Math.sin(a.elev);
    lod.cam.fov = 26;
    lod.cam.aspect = 1;
    lod.cam.near = 0.05;
    lod.cam.far = 80;
    lod.cam.updateProjectionMatrix();
    lod.cam.position.set(Math.cos(a.rel) * ce * dist, ty + se * dist, Math.sin(a.rel) * ce * dist);
    lod.cam.lookAt(0, ty, 0);
    lod.cam.updateMatrixWorld();
  }
  function renderTiles(list, px) {
    if (!list.length || !buildLod()) return false;
    if (list.length > lod.pool.length) list = list.slice(0, lod.pool.length);
    const n = list.length;
    const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
    const rows = Math.ceil(n / cols);
    const w = cols * px, h = rows * px;
    const R = lod.renderer;
    const Xr = window.ZD && ZD.Xray;
    if (lod.atlasW !== w || lod.atlasH !== h || !lod.copy) {
      lod.atlasW = w; lod.atlasH = h;
      lod.copy = document.createElement('canvas');
      lod.copy.width = w; lod.copy.height = h;
      lod.copyG = lod.copy.getContext('2d', {alpha:true});
    }
    const prevAuto = R.autoClear;
    const prevDpr = R.getPixelRatio();
    const tResize = performance.now();
    try {
    R.setPixelRatio(1);
    R.setSize(w, h, false);
    lod.resizeMs = performance.now() - tResize;
    const tGpu = performance.now();
    R.setScissorTest(true);
    R.autoClear = false;
    R.setClearColor(0x000000, 0);
    for (let i = 0; i < lod.pool.length; i++) lod.pool[i].visible = false;
    for (let i = 0; i < n; i++) {
      const col = i % cols, row = (i / cols) | 0;
      const x = col * px, yTop = row * px;
      const inst = lod.pool[i];
      poseCar(inst, list[i]);
      placeCam(list[i]);
      R.setViewport(x, h - yTop - px, px, px);
      R.setScissor(x, h - yTop - px, px, px);
      R.clear(true, true, true);
      R.render(lod.scene, lod.cam);
      inst.visible = false;
    }
    lod.copyG.clearRect(0, 0, w, h);
    lod.copyG.drawImage(R.domElement, 0, 0, w, h, 0, 0, w, h);
    lod.gpuMs = performance.now() - tGpu;
    } finally {
    R.setScissorTest(false);
    R.setViewport(0, 0, w, h);
    R.autoClear = prevAuto;
    R.setPixelRatio(prevDpr);
    if (Xr) { Xr._w = 0; Xr._h = 0; }
    }
    for (let i = 0; i < n; i++) {
      const c = list[i];
      const col = i % cols, row = (i / cols) | 0;
      if (!c._liveCv || c._liveCv.width !== px) {
        c._liveCv = document.createElement('canvas');
        c._liveCv.width = c._liveCv.height = px;
        c._liveG = c._liveCv.getContext('2d', {alpha:true});
      }
      c._liveG.clearRect(0, 0, px, px);
      c._liveG.drawImage(lod.copy, col * px, row * px, px, px, 0, 0, px, px);
      c._live = c._liveCv;
    }
    lod.n = n;
    return true;
  }
  function renderLive(list) {
    const t0 = performance.now();
    try {
      const ok = renderTiles(list, T.livePx || 512);
      lod.ms = performance.now() - t0;
      return ok;
    } catch (e) {
      lod.err = String(e && e.stack || e);
      lod.ms = performance.now() - t0;
      return false;
    }
  }
  // Front tyres, rims, and calipers yaw about the upright through the hub.
  // The mesh origin is the car, so the turn is T(hub) * Ry * T(-hub), then put back.
  function steerFrontWheels(angle) {
    const restores = [];
    if (!angle) return restores;
    const X = window.ZD && ZD.Xray;
    if (!X || !X.car) return restores;
    X.car.updateMatrixWorld(true);
    const hits = [];
    X.car.traverse(o => {
      if (!o.isMesh || !o.geometry || skipped(o)) return;
      const kind = partKind(o.userData && o.userData.mat, o.name);
      if (kind !== 'tyre' && kind !== 'rim' && kind !== 'brake') return;
      if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      const c = o.geometry.boundingSphere.center.clone().applyMatrix4(o.matrixWorld);
      if (c.x > 0.3) hits.push({mesh:o, c});
    });
    for (const w of hits) {
      const mesh = w.mesh, parent = mesh.parent;
      if (!parent) continue;
      const center = w.c.clone();
      parent.worldToLocal(center);
      const saved = mesh.matrix.clone();
      const auto = mesh.matrixAutoUpdate;
      mesh.updateMatrix();
      const M = mesh.matrix.clone();
      const T1 = new M.constructor().makeTranslation(center.x, center.y, center.z);
      const R = new M.constructor().makeRotationY(angle);
      const T2 = new M.constructor().makeTranslation(-center.x, -center.y, -center.z);
      mesh.matrixAutoUpdate = false;
      mesh.matrix.copy(T1.multiply(R).multiply(T2).multiply(M));
      restores.push(() => {
        mesh.matrix.copy(saved);
        mesh.matrixAutoUpdate = auto;
        if (auto && mesh.matrix.decompose) mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      });
    }
    X.car.updateMatrixWorld(true);
    return restores;
  }
  // Same copy the player sprite uses. Punching low alpha out of this canvas
  // opened holes in the glass, and the side silhouette stopped matching his Z.
  // Showroom headlamp housings bake as flat gray discs. His Z shows those as
  // the cool running light. Wheels sit in the lower half and stay chrome.
  function copyPhoto(src) {
    const sw = src.width || 2, sh = src.height || 2;
    const cv = document.createElement('canvas');
    cv.width = sw; cv.height = sh;
    const g = cv.getContext('2d', {alpha:true});
    g.clearRect(0, 0, sw, sh);
    g.drawImage(src, 0, 0);
    try {
      const img = g.getImageData(0, 0, sw, sh);
      const d = img.data;
      let minY = sh, maxY = 0, n = 0;
      for (let y = 0, p = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++, p += 4) {
          if (d[p + 3] < 20) continue;
          n++;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      const cut = n ? minY + (maxY - minY) * 0.55 : sh;
      const a = 0.42;
      for (let y = 0, p = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++, p += 4) {
          if (y > cut || d[p + 3] < 20) continue;
          const r = d[p], gg = d[p + 1], b = d[p + 2];
          const mx = r > gg ? (r > b ? r : b) : (gg > b ? gg : b);
          const mn = r < gg ? (r < b ? r : b) : (gg < b ? gg : b);
          if (mx - mn >= 40) continue;
          const L = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
          if (L <= 115 || L >= 220) continue;
          d[p] = r * (1 - a) + 159 * a;
          d[p + 1] = gg * (1 - a) + 216 * a;
          d[p + 2] = b * (1 - a) + 255 * a;
        }
      }
      g.putImageData(img, 0, 0);
    } catch (e) {}
    return cv;
  }
  function bake(key) {
    if (!buildLod()) return false;
    const X = window.ZD && ZD.Xray;
    const parts = key.split(':').map(Number);
    const pi = parts[0], yb = parts[1], eb = parts[2], sb = parts.length > 3 ? parts[3] : 0;
    if (!T.paints[pi] || !X || !X.render) return false;
    const px = T.spritePx || 256;
    let yaw = yb * (T.yawStep || Math.PI / 12);
    let elev = eb * (T.elevStep || 0.1);
    // The hub stays as modeled. Turning it in the photo lifts the rim face toward
    // the lens and the checker counts that as a camera-facing wheel.
    const steer = 0;
    for (const c of cars) {
      if (c._key === key && c._relExact != null) { yaw = c._relExact; elev = c._elevExact; break; }
    }
    const dist = (window.ZV && ZV.win ? ZV.win : 7) / (2 * Math.tan(13 * Math.PI / 180));
    // The showroom photo is the same shell the player draws. Front wheels yaw
    // about the hub for a steered bin. Bolt meshes stay, so the outline stays his.
    const restores = steerFrontWheels(steer);
    const hidden = [];
    try {
      X.render(ctx, 0, 0, px, px, {
        xray: false, showroom: true, yaw: yaw, pitch: elev, dist: dist,
        tx: 0, ty: (window.ZV && ZV.ty) || 0.6, fov: 26, drl: 1, noDraw: true,
        kid: (typeof KID !== 'undefined' && KID) ? Object.assign({}, KID, {paint: kids[pi].paint, glow: kids[pi].glow, grid: kids[pi].grid}) : kids[pi],
        st: { t: 0, throttle: 30 }
      });
      const src = X.canvas;
      if (!src) return false;
      const cv = copyPhoto(src);
      const cap = T.cacheMax || 240;
      while (cache.size >= cap) {
        let oldest = null;
        for (const k of cache.keys()) { if (!warmSet.has(k)) { oldest = k; break; } }
        if (oldest == null) break;
        cache.delete(oldest);
      }
      cache.set(key, cv); bakes++;
      return true;
    } catch (e) { bakeErr = String(e); return false; }
    finally {
      for (const o of hidden) o.visible = true;
      for (const undo of restores) undo();
      X._w = 0; X._h = 0;
      try { if (X.kidApply) X.kidApply(typeof KID !== 'undefined' ? KID : null, {}); } catch (e2) {}
    }
  }
  function shadow(c) {
    const gy = c.gy || 0, hAir = Math.max(0, (c.y || 0) - gy);
    const p = proj(c.x, gy + 0.04, c.z);
    if (!p) return;
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw), rx = Math.cos(c.yaw), rz = -Math.sin(c.yaw);
    const a = proj(c.x + fx * 1.7, gy + 0.04, c.z + fz * 1.7);
    const b = proj(c.x + rx * 0.72, gy + 0.04, c.z + rz * 0.72);
    if (!a || !b) return;
    const spread = 1 + hAir * 0.35, fade = lim(0.42 - hAir * 0.045, 0.08, 0.42);
    const ang = Math.atan2(a[1] - p[1], a[0] - p[0]);
    const len = Math.hypot(a[0] - p[0], a[1] - p[1]) * spread;
    const wid = Math.hypot(b[0] - p[0], b[1] - p[1]) * spread;
    ctx.save();
    ctx.translate(p[0], p[1]);
    ctx.rotate(ang);
    ctx.fillStyle = 'rgba(0,0,0,' + fade + ')';
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(2, len), Math.max(1.4, wid), 0, 0, 6.3);
    ctx.fill();
    ctx.restore();
  }
  function dress(c) {
    const hard = Math.abs(c.yawRate || 0) > 0.35;
    if (!c.braking && !hard) return;
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw), rx = Math.cos(c.yaw), rz = -Math.sin(c.yaw);
    const y = (c.y || 0) + (c.suspY || 0) + 0.42;
    ctx.save();
    if (c.braking || hard) {
      for (const s of [-0.55, 0.55]) {
        const p = proj(c.x - fx * 2.05 + rx * s * 0.7, y, c.z - fz * 2.05 + rz * s * 0.7);
        if (!p) continue;
        const rad = Math.max(1.6, H * 0.9 / p[2] * 0.16);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#ff2a3d';
        ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, 6.3); ctx.fill();
      }
    }
    if (hard) {
      ctx.strokeStyle = 'rgba(180,180,190,.55)';
      ctx.lineWidth = 2;
      for (const s of [-0.7, 0.7]) {
        const a = proj(c.x - fx * 1.3 + rx * s, (c.gy || 0) + 0.05, c.z - fz * 1.3 + rz * s);
        const b = proj(c.x - fx * 3.1 + rx * s, (c.gy || 0) + 0.05, c.z - fz * 3.1 + rz * s);
        if (!a || !b) continue;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    }
    ctx.restore();
  }
  function screenPose(c) {
    const yDraw = (c.y || 0) + (c.suspY || 0);
    const c0 = camS(c.x, yDraw + 0.6, c.z);
    if (!c0 || c0[2] < (typeof NEAR === 'number' ? NEAR : 0.5)) return null;
    const pose = (c.pitch || 0) + (c.nose || 0);
    const px = H * 0.9 / c0[2] * 7;
    return {
      sc: scr(c0), px, depth: c0[2],
      roll: (c.roll || 0) + (c.bodyRoll || 0),
      squash: lim(1 - pose * (T.pitchDraw || 0.95), 0.62, 1.22),
      yShift: pose * px * 0.14
    };
  }
  function blit(cv, c) {
    const sp = screenPose(c);
    if (!sp) return false;
    ctx.save();
    ctx.translate(sp.sc[0], sp.sc[1] + sp.yShift);
    ctx.rotate(sp.roll);
    ctx.scale(1, sp.squash);
    ctx.drawImage(cv, -sp.px / 2, -sp.px / 2, sp.px, sp.px);
    ctx.restore();
    return true;
  }
  // The live photo already has his pitch, roll, and wheels. Do not squash it.
  function blitLive(cv, c) {
    const yDraw = (c.y || 0) + (c.suspY || 0);
    const c0 = camS(c.x, yDraw + 0.6, c.z);
    if (!c0 || c0[2] < (typeof NEAR === 'number' ? NEAR : 0.5)) return false;
    const sc = scr(c0);
    const px = H * 0.9 / c0[2] * 7;
    ctx.drawImage(cv, sc[0] - px / 2, sc[1] - px / 2, px, px);
    return true;
  }
  function paintCar(c) {
    const a = cache.get(c._key);
    const b = (c._blend || 0) > 0.05 ? cache.get(c._key2) : null;
    if (a) { cache.delete(c._key); cache.set(c._key, a); }
    if (!a && !b) return false;
    if (a && b) {
      const base = ctx.globalAlpha;
      ctx.globalAlpha = base * (1 - c._blend);
      const okA = blit(a, c);
      ctx.globalAlpha = base * c._blend;
      const okB = blit(b, c);
      ctx.globalAlpha = base;
      return okA || okB;
    }
    return blit(a || b, c);
  }
  function lights(c, dist) {
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw), rx = Math.cos(c.yaw), rz = -Math.sin(c.yaw);
    const y = c.y + 0.52, n = T.carL / 2 - 0.12, w = T.carW * 0.32;
    const far = dist >= T.boxDist;
    const spots = [[n, w, '#e7fbff'], [n, -w, '#e7fbff'], [-n, w, '#ff2a3d'], [-n, -w, '#ff2a3d']];
    for (const s of spots) {
      const p = proj(c.x + fx * s[0] + rx * s[1], y, c.z + fz * s[0] + rz * s[1]);
      if (!p) continue;
      const rad = far ? Math.max(2.4, H * 0.9 / p[2] * 0.4) : Math.max(2.6, H * 0.9 / p[2] * 0.55);
      ctx.fillStyle = s[2];
      ctx.globalAlpha = far ? 0.28 : 0.4;
      ctx.beginPath(); ctx.arc(p[0], p[1], rad * 2.3, 0, 6.3); ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, 6.3); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawBox(c) {
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw), rx = Math.cos(c.yaw), rz = -Math.sin(c.yaw);
    const L = T.carL / 2, W = T.carW / 2, yb = c.y + 0.12, ym = c.y + 0.58, yt = c.y + T.carH;
    const P = (a, l, y) => [c.x + fx * a + rx * l, y, c.z + fz * a + rz * l];
    const paint = T.paints[c.pi];
    ctx.beginPath();
    wpoly([P(-L, -W, yb), P(L, -W, yb), P(L, W, ym), P(-L, W, ym)]);
    wpoly([P(-L * 0.2, -W * 0.82, ym), P(L * 0.62, -W * 0.82, ym), P(L * 0.42, W * 0.82, yt), P(-L * 0.35, W * 0.82, yt)]);
    ctx.fillStyle = paint.paint; ctx.globalAlpha = 0.94; ctx.fill();
    ctx.globalAlpha = 1; ctx.strokeStyle = paint.glow; ctx.lineWidth = 1.5; ctx.stroke();
  }
  function drawSparks() {
    if (!sparks.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const s of sparks) {
      const p = proj(s.x, s.y, s.z);
      if (!p) continue;
      const a = Math.max(0, 1 - s.t / s.life);
      const rad = Math.max(2.2, H * 0.9 / p[2] * 0.22);
      ctx.globalAlpha = a;
      ctx.fillStyle = s.col;
      ctx.beginPath(); ctx.arc(p[0], p[1], rad * 2.4, 0, 6.3); ctx.fill();
      ctx.globalAlpha = Math.min(1, a + 0.25);
      ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, 6.3); ctx.fill();
    }
    ctx.restore();
  }
  const sparkSlot = {draw(){ drawSparks(); }};
  function drawOne(c) {
    if (!c.on) return;
    const dist = c._dist || Math.hypot(c.x - cam.x, c.y - cam.y, c.z - cam.z);
    if (dist > T.dotDist) return;
    ctx.save();
    ctx.globalAlpha = c.fade == null ? 1 : c.fade;
    const closePhoto = (c.hit || dist < T.fullDist) && ((c._live) || (c._key && cache.has(c._key)));
    // The showroom photo already has its contact shadow. A second ground
    // ellipse sits in the crop and the player sprite does not have one.
    if (c.sim && dist < T.boxDist && !closePhoto) shadow(c);
    if (c.hit || dist < T.fullDist) {
      if (c._live && blitLive(c._live, c)) {
        if (c.sim && !c.hit) dress(c);
        ctx.restore();
        return;
      }
      if (paintCar(c)) {
        if (c.sim && !c.hit) dress(c);
        ctx.restore();
        return;
      }
      drawBox(c); lights(c, dist);
    } else if (dist < T.boxDist) { drawBox(c); lights(c, dist); }
    else lights(c, dist);
    if (c.sim && !c.hit) dress(c);
    ctx.restore();
  }

  let runErr = '';
  function update(dt) {
    if (OFF || !T) return;
    try {
    build();
    if (!lanes.length) return;
    dt = Math.min(0.05, dt || 0.016);
    maintain();
    stepSparks(dt);
    dotHold ^= 1;
    for (const c of cars) if (c.on) {
      if (!c.sim && dotHold) continue;
      advance(c, c.sim ? dt : dt * 2);
    }
    for (const c of cars) if (c.on && c.sim) yieldCar(c);
    } catch (e) { runErr = String(e && e.stack || e); }
  }
  function warmList() {
    if (warmKeys) return;
    const keys = [];
    // Chase elevation atan2(2, 10) lands in bin 2 (0.20 rad). Straight wheels.
    // Other elevations and a steered axle are photographed when a car actually needs them.
    for (let yb = -12; yb <= 11; yb++) {
      for (let pi = 0; pi < T.paints.length; pi++) keys.push(pi + ':' + yb + ':2:0');
    }
    warmKeys = keys;
    for (let i = 0; i < keys.length; i++) warmSet.add(keys[i]);
  }
  function nextWarm() {
    warmList();
    while (warmAt < warmKeys.length && cache.has(warmKeys[warmAt])) warmAt++;
    return warmAt < warmKeys.length ? warmKeys[warmAt] : null;
  }
  function bakeBudget() {
    frameN++;
    const playing = typeof flying !== 'undefined' && flying;
    if (!playing) return 2;
    if (typeof ZV !== 'undefined' && (ZV.every | 0) > 1 && ((ZV.frame + 1) % (ZV.every | 0)) === 0) return 0;
    if ((frameN & 1) === 0) return 0;
    return T.bakePerFrame || 1;
  }
  function collect(items) {
    if (OFF || !built) return;
    try {
    const misses = [];
    const near = [];
    for (const c of cars) {
      if (!c.on) continue;
      const dx = c.x - cam.x, dy = (c.y + 0.6) - cam.y, dz = c.z - cam.z;
      const dist = Math.hypot(dx, dy, dz);
      c._dist = dist;
      if (dist > T.dotDist) continue;
      if (c.sim && dist < T.fullDist) near.push(c);
      items.push([dx * dx + dz * dz, 't', c.slot]);
    }
    near.sort((a, b) => a._dist - b._dist);
    const cap = T.liveCap | 0;
    const live = near.slice(0, cap);
    const liveSet = new Set(live);
    for (const c of cars) if (!liveSet.has(c)) c._live = null;
    const playing = typeof flying !== 'undefined' && flying;
    if (playing && live.length) renderLive(live);
    for (const c of near) {
      if (liveSet.has(c) && c._live) continue;
      viewKey(c);
      if (!cache.has(c._key)) misses.push(c._key);
      if ((c._blend || 0) > 0.05 && c._key2 && !cache.has(c._key2)) misses.push(c._key2);
    }
    let budget = bakeBudget();
    let baked = 0;
    for (let i = 0; i < misses.length && baked < budget; i++) { if (bake(misses[i])) baked++; }
    while (baked < budget) {
      const k = nextWarm();
      if (!k) break;
      if (!bake(k)) break;
      warmAt++;
      baked++;
    }
    if (sparks.length) items.push([0, 't', sparkSlot]);
    } catch (e) { runErr = String(e && e.stack || e); }
  }
  function stats() {
    let sim = 0, dots = 0, turns = 0, straight = 0;
    for (const c of cars) if (c.on) c.sim ? sim++ : dots++;
    for (const L of lanes) { turns += L.turns.length; if (L.straight) straight++; }
    return {
      enabled:!OFF, model:'z370-lod', modelFile:lod.modelFile || '', modelTitle:lod.modelTitle || '',
      modelMeshes:lod.modelMeshes || 0, modelTris:lod.modelTris || 0, clonedMeshes:cloned, simCap:T.simCap, dotCap:T.dotCap,
      liveMs:+lod.ms.toFixed(2), liveN:lod.n, lodTris:lod.tris, lodDraws:lod.draws,
      lodWheels:lod.wheels, lodErr:lod.err, lodCorners:lod.corners, lodRadius:lod.radius,
      lodEnv:lod.env, lodLights:lod.lightN, lodBox:lod.bodyBox, lodStat:lod.bodyStat, lodResize:+(lod.resizeMs || 0).toFixed(2),
      lodGpu:+(lod.gpuMs || 0).toFixed(2), lodParts:lod.partTris, livePx:T.livePx, liveCap:T.liveCap,
      sim, dots, alive:sim + dots, lanes:lanes.length, straight, turns,
      fullDist:T.fullDist, boxDist:T.boxDist, dotDist:T.dotDist,
      speedMin:T.speedMin, speedMax:T.speedMax, highwayAdd:T.highwayAdd,
      paints:T.paints.map(p => p.id), cache:cache.size, bakes, bakeErr, runErr,
      warmAt, warmTotal: warmKeys ? warmKeys.length : 0, roadSig,
      wingHinges, crewN, sparkN, sparks:sparks.length
    };
  }
  function audit() {
    let n = 0, onRunway = 0, inSolid = 0, offLane = 0;
    for (const c of cars) if (c.on) {
      n++;
      if (runway(c.x, c.z)) onRunway++;
      if (solidAt(c.x, c.z)) inSolid++;
      if (c.lane && c.blend <= 0) {
        const p = c.lane.at(c.s);
        if (Math.hypot(c.x - p[0], c.z - p[1]) > 3) offLane++;
      }
    }
    return {n, onRunway, inSolid, offLane};
  }
  function ensure() { build(); }
  function bench(n, px, pose) {
    if (!buildLod()) return {ok:false, err:lod.err};
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push(Object.assign({
        pi: i % T.paints.length, yaw: 0, x: (cam.x || 0) + 6, y: 0, z: (cam.z || 0) + i * 3,
        suspY: 0, nose: 0.12, pitch: 0, bodyRoll: -0.2, roll: 0, steer: 0.35, wheelA: 1.2, slip: 0
      }, pose || {}));
    }
    const t0 = performance.now();
    const ok = renderTiles(list, px || T.livePx || 512);
    return {ok, ms: performance.now() - t0, tris: lod.tris, draws: lod.draws, wheels: lod.wheels, err: lod.err, corners: lod.corners, src: lod.src, shots: list.map(c => c._live), gpu: lod.gpuMs, resize: lod.resizeMs};
  }
  function pass(n, px) {
    if (!buildLod()) return {ok:false, err:lod.err};
    const R = lod.renderer;
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push({pi: i % T.paints.length, yaw: 0, x: 0, y: 0, z: 0, suspY: 0, nose: 0, pitch: 0, bodyRoll: 0, roll: 0, steer: 0.3, wheelA: 1, slip: 0, _rel: 2.2, _elev: 0.25});
    }
    R.setPixelRatio(1);
    R.setSize(px, px, false);
    R.setScissorTest(false);
    R.setViewport(0, 0, px, px);
    R.autoClear = true;
    R.setClearColor(0x000000, 0);
    for (let i = 0; i < lod.pool.length; i++) {
      const inst = lod.pool[i];
      if (i < n) { poseCar(inst, list[i]); inst.position.x = (i - (n - 1) / 2) * 5.2; inst.visible = true; }
      else inst.visible = false;
    }
    lod.cam.aspect = 1; lod.cam.fov = 26; lod.cam.updateProjectionMatrix();
    lod.cam.position.set(9, 3.2, 9);
    lod.cam.lookAt(0, 0.5, 0);
    const tR = performance.now();
    R.render(lod.scene, lod.cam);
    const gpu = performance.now() - tR;
    const tB = performance.now();
    const cv = document.createElement('canvas');
    cv.width = px; cv.height = px;
    cv.getContext('2d', {alpha:true}).drawImage(R.domElement, 0, 0, px, px);
    const blit = performance.now() - tB;
    if (window.ZD && ZD.Xray) { ZD.Xray._w = 0; ZD.Xray._h = 0; }
    return {gpu, blit, ms: gpu + blit};
  }
  return {update, collect, stats, audit, ensure, _bake:bake, _bench:bench, _pass:pass, _lod:lod, get cars(){ return cars; }, get lanes(){ return lanes; }, get _cache(){ return cache; }};
})();
window.TRAFFIC = TRAFFIC;
