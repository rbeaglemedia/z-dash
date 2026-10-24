'use strict';
// Neon World road traffic: Z TAKEOVER level 4 (every car is the player's 370Z).
// The GLB is the one already loaded on ZD.Xray.car. Traffic clones that graph once
// (shared geometry, no second download) into its own scene and bakes view sprites
// with X.renderer only. It never calls X.render, never touches X.car after the
// clone, and never opens the player's wings. Far cars are boxes or light dots.
// physics.js / tune.js untouched. A hit wrecks the traffic car (WANTED wKnock / wFlip).
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
  let bakes = 0, bakeErr = '', cloned = 0, built = false, sparkN = 0;
  let wingHinges = 0, crewN = 0;

  function kidOf(p) {
    return {paint:p.paint, glow:p.glow, grid:p.grid, wheel:'#4a4f57', wheelGlow:false, spoiler:null, wings:null, extra:null, extras:[]};
  }
  const kids = T.paints.map(kidOf);

  function runway(x, z) { return Math.abs(x) < 20 && z > -80 && z < 1520; }
  function solidAt(x, z) {
    if (runway(x, z)) return true;
    const pr = CITY.probe(x, z, 0.7);
    if (!pr.wl || pr.wl.ramp) return false;
    const b = pr.wl.b;
    if (b && b.kind === 'pylon' && !b.towCab) return false;
    if (b && (b.kind === 'bill' || b.kind === 'outline')) return false;
    return true;
  }
  function groundY(x, z) {
    const pr = CITY.probe(x, z, 2);
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

  const towOid = id => { const ts = CITY.TOWS || []; for (let i = 0; i < ts.length; i++) if (ts[i].oid === id) return true; return false; };
  function build() {
    if (built) return;
    built = true;
    const R = CITY.ROADS, nodes = R.nodes;
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
    for (let i = 0; i < T.simCap; i++) cars.push(blank(true));
    for (let i = 0; i < T.dotCap; i++) cars.push(blank(false));
  }
  function blank(sim) {
    const c = {sim, on:false, lane:null, s:0, v:0, v0:0, yaw:0, x:0, z:0, y:0, pi:0, turn:null, rollS:-1, blend:0, blend0:0, bx:0, bz:0, by:0, utT:0, was:false, tick:0, hit:false, hitT:0, fade:1, vx:0, vy:0, vz:0, spin:0, roll:0, vroll:0, braking:false, yawRate:0, accel:0, bodyRoll:0, pitch:0, slip:0, suspY:0, suspV:0, ground:true, gy:0, airVx:0, airVz:0, arc:null, rampSeen:0, rampYes:false};
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
    const R = CITY.RAMPS;
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
    c.suspV = v + (-y * 42 - v * 7.5) * dt;
    c.suspY = lim(y + c.suspV * dt, -0.42, 0.12);
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
    const camTurnTilt = lim(angDiff(c.yaw, (typeof cam !== 'undefined' && cam && cam.yaw) || c.yaw) * 0.015, -0.03, 0.03);
    const targetRoll = lim(-c.yawRate * 0.095 + camTurnTilt, -0.16, 0.16);
    c.bodyRoll = (c.bodyRoll || 0) + (targetRoll - (c.bodyRoll || 0)) * Math.min(1, dt * 8);
    c.slip = lim(c.yawRate * 0.08, -0.14, 0.14);
  }
  function vertSim(c, dt, prevX, prevZ) {
    const stepDist = Math.hypot(c.x - prevX, c.z - prevZ);
    const pr = CITY.probe(c.x, c.z, (c.y || 0) + 1.6);
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
          const dive = lim((c.accel || 0) * 0.012, -0.05, 0.05);
          c.pitch += (dive - c.pitch) * Math.min(1, dt * 8);
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
        c.suspV = lim(drop * 0.22, -2.4, -0.5);
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
      if (c.sim) { if (!c.hit && d > T.recycle) respawn(c); }
      else if (d > T.dotDist - 15 || d < T.dotInner - 25) respawn(c);
    }
  }

  function projR(yaw, hl, hw, ux, uz) {
    const fx = Math.sin(yaw), fz = Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    return hl * Math.abs(fx * ux + fz * uz) + hw * Math.abs(rx * ux + rz * uz);
  }
  function bump(c) {
    if (!c.sim || !c.on || c.hit || P.wreck || P.loop) { c.was = false; return; }
    if (Math.abs((P.y || 0) - c.y) >= 2.2) { c.was = false; return; }
    const hl = T.carL / 2, hw = T.carW / 2;
    const axes = [[Math.sin(P.yaw), Math.cos(P.yaw)], [Math.cos(P.yaw), -Math.sin(P.yaw)], [Math.sin(c.yaw), Math.cos(c.yaw)], [Math.cos(c.yaw), -Math.sin(c.yaw)]];
    let best = 1e9, nx = 0, nz = 0, hit = true;
    for (const ax of axes) {
      const dist = (P.x - c.x) * ax[0] + (P.z - c.z) * ax[1];
      const pen = projR(P.yaw || 0, hl, hw, ax[0], ax[1]) + projR(c.yaw, hl, hw, ax[0], ax[1]) - Math.abs(dist);
      if (pen <= 0) { hit = false; break; }
      if (pen < best) { best = pen; const s = dist < 0 ? -1 : 1; nx = ax[0] * s; nz = ax[1] * s; }
    }
    if (!hit) { c.was = false; return; }
    P.x += nx * Math.min(best, 0.35); P.z += nz * Math.min(best, 0.35);
    const side = Math.sign((c.x - P.x) * Math.cos(P.yaw) - (c.z - P.z) * Math.sin(P.yaw)) || (rnd() < 0.5 ? -1 : 1);
    P.v = Math.max(0, P.v * T.bumpKeep);
    P.yaw = (P.yaw || 0) + side * T.bumpYaw; P.hd = P.yaw;
    const fx = Math.sin(P.yaw), fz = Math.cos(P.yaw), rx = Math.cos(P.yaw), rz = -Math.sin(P.yaw);
    const fwdV = Math.max(c.v, P.v * 0.88) + 4, sideV = side * (7 + P.v * 0.18);
    c.hit = true; c.hitT = 0; c.fade = 1; c.was = true;
    c.vx = fx * fwdV + rx * sideV; c.vz = fz * fwdV + rz * sideV;
    c.vy = 3.8 + Math.min(5, P.v * 0.08);
    c.spin = side * (5.5 + rnd() * 3.0); c.roll = 0; c.vroll = side * (4.5 + rnd() * 2.5);
    burst(c);
  }
  function burst(c) {
    const cols = ['#ffe14d', '#ffffff', '#ff4fd8'];
    for (let i = 0; i < 16; i++) {
      sparks.push({
        x: c.x + (rnd() - 0.5) * 1.2, y: c.y + 0.7 + rnd() * 0.35, z: c.z + (rnd() - 0.5) * 1.2,
        vx: (rnd() - 0.5) * 14, vy: 2 + rnd() * 6, vz: (rnd() - 0.5) * 14,
        col: cols[i % 3], life: 0.45 + rnd() * 0.35, t: 0
      });
      sparkN++;
    }
    if (sparks.length > 240) sparks.splice(0, sparks.length - 240);
    if (typeof FX !== 'undefined' && FX && FX.push) {
      for (let i = 0; i < 6; i++) FX.push({k:'spark', x:c.x + (rnd() - 0.5), y:c.y + 0.7, z:c.z + (rnd() - 0.5), vx:(rnd() - 0.5) * 8, vy:2 + rnd() * 4, vz:(rnd() - 0.5) * 8, life:0.35 + rnd() * 0.3, t:0, s:0});
      if (FX.length > 600) FX.splice(0, FX.length - 600);
    }
    try { navigator.vibrate && navigator.vibrate(20); } catch (e) {}
  }
  function knocked(c, dt) {
    c.hitT += dt;
    c.x += c.vx * dt; c.z += c.vz * dt; c.y += c.vy * dt; c.vy -= 14 * dt;
    const gy = groundY(c.x, c.z);
    if (c.y < gy && c.hitT > 0.12) { c.y = gy; c.vy = Math.abs(c.vy) * 0.38; c.vx *= 0.68; c.vz *= 0.68; }
    const drag = Math.max(0, 1 - 1.2 * dt);
    c.vx *= drag; c.vz *= drag;
    c.yaw += c.spin * dt; c.spin *= Math.max(0, 1 - 0.9 * dt);
    c.roll += c.vroll * dt; c.vroll *= Math.max(0, 1 - 1.1 * dt);
    if (c.hitT > 1.3) c.fade = Math.max(0, c.fade - dt * 1.4);
    if (c.fade <= 0 || c.hitT > 2.6) respawn(c);
  }
  function stepSparks(dt) {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.t += dt;
      if (s.t > s.life) { sparks.splice(i, 1); continue; }
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt; s.vy -= 12 * dt;
    }
  }

  function viewKey(c) {
    const dx = cam.x - c.x, dz = cam.z - c.z, dy = cam.y - (c.y + 0.6);
    const hd = Math.hypot(dx, dz) || 0.001;
    const visYaw = c.yaw + (c.slip || 0);
    const rel = Math.atan2(Math.sin(Math.atan2(dx, dz) - visYaw), Math.cos(Math.atan2(dx, dz) - visYaw));
    const elev = Math.atan2(dy, hd) - (c.pitch || 0) * 0.9;
    const step = T.yawStep || (Math.PI / 12);
    let yb = Math.round(rel / step);
    yb = ((yb + 12) % 24 + 24) % 24 - 12;
    const eb = lim(Math.round(elev / 0.35), -1, 5);
    return c.pi + ':' + yb + ':' + eb;
  }
  const packs = [];
  function stdMat() {
    const X = window.ZD && ZD.Xray;
    let Std = null;
    const seek = o => {
      if (Std || !o || !o.isMesh || !o.material) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if (m && m.type === 'MeshStandardMaterial') Std = m.constructor;
    };
    if (X && X.car) X.car.traverse(seek);
    if (!Std && X && X._tr && X._tr.scene) X._tr.scene.traverse(seek);
    return Std;
  }
  function paintPack(pi) {
    if (packs[pi]) return packs[pi];
    const Std = stdMat(), p = T.paints[pi];
    if (!Std || !p) return null;
    const body = new Std({color:p.paint, metalness:0.55, roughness:0.32, emissive:p.glow, emissiveIntensity:0.12});
    const trim = new Std({color:'#17181d', metalness:0.4, roughness:0.45});
    const glass = new Std({color:'#cfe6f5', transparent:true, opacity:0.3, roughness:0.05, metalness:0.4, depthWrite:false});
    const rim = new Std({color:'#4a4f57', metalness:0.85, roughness:0.32});
    const tyre = new Std({color:'#141416', roughness:0.9, metalness:0.05});
    packs[pi] = {body, trim, glass, rim, tyre};
    return packs[pi];
  }
  function applyPaint(root, pi) {
    const pack = paintPack(pi);
    root.traverse(o => {
      if (!o.isMesh) return;
      const k = (o.userData && o.userData.mat) || '';
      if (pack) {
        let mat = pack.trim;
        if (k === 'BODY' || k === 'CARBON') mat = pack.body;
        else if (k === 'GLASS') mat = pack.glass;
        else if (k === 'RIM') mat = pack.rim;
        else if (k === 'TYRE' || k === 'BRAKE') mat = pack.tyre;
        o.material = mat;
      } else if (o.material && o.material.color && T.paints[pi]) {
        if (k === 'BODY' || k === 'CARBON') o.material.color.set(T.paints[pi].paint);
      }
    });
  }
  function ensureClone() {
    if (cloned) return cloned > 0;
    const X = window.ZD && ZD.Xray;
    if (!X || !X.ready || !X.car || !X.renderer || !window.ZGL || !ZGL.ensure()) return false;
    const g0 = ZGL.S.g;
    try {
      ZGL.set(0);
      const tag = (o, name) => { if (o && !o.name) o.name = name; };
      tag(X.car.getObjectByName && X.car.getObjectByName('crew'), 'crew');
      tag(X.kidGrp, 'kidGrp');
      tag(X.partsGrp, 'partsGrp');
      // Hinge pivots stash Object3D refs on userData (circular). Park those so clone(true) can copy the closed car, then put them straight back.
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
      finally { for (const [o, ud] of parked) o.userData = ud; }
      ZGL.set(g0);
      const kill = [];
      g.traverse(o => {
        const tagN = o.name;
        if (tagN === 'crew' || tagN === 'kidGrp' || tagN === 'partsGrp' || (o.userData && o.userData.crew)) kill.push(o);
      });
      kill.forEach(o => { if (o.parent) o.parent.remove(o); });
      g.updateMatrixWorld(true);
      const inv = g.matrixWorld.clone();
      if (inv.invert) inv.invert();
      const baked = [];
      const matMap = new Map();
      const cloneMat = m => {
        if (!m) return m;
        if (Array.isArray(m)) return m.map(cloneMat);
        if (matMap.has(m.uuid)) return matMap.get(m.uuid);
        const c = m.clone ? m.clone() : m;
        matMap.set(m.uuid, c);
        return c;
      };
      g.traverse(o => {
        if (!o.isMesh || !o.visible) return;
        const m = o.clone(false);
        m.material = cloneMat(o.material);
        m.userData = {mat: (o.userData && o.userData.mat) || ''};
        const wm = o.matrixWorld.clone().premultiply(inv);
        wm.decompose(m.position, m.quaternion, m.scale);
        m.matrixAutoUpdate = true;
        baked.push(m);
      });
      while (g.children.length) g.remove(g.children[0]);
      g.position.set(0, 0, 0); g.rotation.set(0, 0, 0); g.scale.set(1, 1, 1); g.updateMatrix();
      baked.forEach(m => g.add(m));
      const scene = new X.scene.constructor();
      const tr = X.loadTraffic ? X.loadTraffic() : null;
      if (tr && tr.scene) tr.scene.children.forEach(c => { if (c.isLight) scene.add(c.clone()); });
      if (!scene.children.length) {
        X.scene.children.forEach(c => { if (c.isLight) scene.add(c.clone()); });
      }
      scene.add(g);
      const camT = new X.cam.constructor(26, 1, 0.05, 80);
      TRAFFIC._clone = g;
      TRAFFIC._scene = scene;
      TRAFFIC._cam = camT;
      let wing = 0, crew = 0;
      g.traverse(o => {
        if (o.name === 'crew' || (o.userData && o.userData.crew)) crew++;
        if (o.userData && (o.userData.ax || o.userData.p2)) wing++;
        if (window.ZGL && ZGL.S) {
          if (o === ZGL.S.hingeH || (ZGL.S.hingeD && ZGL.S.hingeD.indexOf(o) >= 0)) wing++;
        }
      });
      wingHinges = wing; crewN = crew; cloned = baked.length;
      for (let i = 0; i < T.paints.length; i++) bake(i + ':0:0');
      return cloned > 0;
    } catch (e) { bakeErr = String(e); try { ZGL.set(g0); } catch (e2) {} cloned = -1; return false; }
  }
  function bake(key) {
    const X = window.ZD && ZD.Xray;
    if (!X || !X.renderer) return false;
    if (!TRAFFIC._clone && !ensureClone()) return false;
    if (!TRAFFIC._clone || !TRAFFIC._scene || !TRAFFIC._cam) return false;
    const [pi, yb, eb] = key.split(':').map(Number);
    if (!T.paints[pi]) return false;
    const R = X.renderer, px = T.spritePx;
    const box = {set(w, h){ this.w = w; this.h = h; return this; }, w:1, h:1};
    const dpr = R.getPixelRatio ? R.getPixelRatio() : 1;
    const rt = R.getRenderTarget ? R.getRenderTarget() : null;
    const scissor = R.getScissorTest ? R.getScissorTest() : false;
    if (R.getSize) R.getSize(box);
    try {
      applyPaint(TRAFFIC._clone, pi);
      const yaw = yb * (T.yawStep || Math.PI / 12), elev = eb * 0.35;
      const dist = 7 / (2 * Math.tan(13 * Math.PI / 180)), ty = 0.6;
      const camT = TRAFFIC._cam;
      camT.fov = 26; camT.aspect = 1; camT.near = 0.05; camT.far = 80;
      camT.position.set(Math.cos(yaw) * Math.cos(elev) * dist, ty + Math.sin(elev) * dist, Math.sin(yaw) * Math.cos(elev) * dist);
      camT.lookAt(0, ty, 0);
      camT.updateProjectionMatrix();
      camT.updateMatrixWorld();
      if (R.setRenderTarget) R.setRenderTarget(null);
      if (R.setScissorTest) R.setScissorTest(false);
      if (R.setPixelRatio) R.setPixelRatio(1);
      R.setSize(px, px, false);
      if (R.setViewport) R.setViewport(0, 0, px, px);
      R.setClearColor(0x000000, 0);
      if (R.clear) R.clear();
      R.render(TRAFFIC._scene, camT);
      const src = R.domElement || X.canvas;
      if (!src || src.width < 8) return false;
      const cv = document.createElement('canvas');
      cv.width = px; cv.height = px;
      if (typeof zResNoteCanvas === 'function') zResNoteCanvas('traffic', cv, px, px);
      cv.getContext('2d', {alpha:true}).drawImage(src, 0, 0, src.width, src.height, 0, 0, px, px);
      const cap = T.cacheMax || 140;
      while (cache.size >= cap) {
        const oldest = cache.keys().next().value;
        if (oldest == null) break;
        cache.delete(oldest);
      }
      cache.set(key, cv); bakes++;
      return true;
    } catch (e) { bakeErr = String(e); return false; }
    finally {
      try {
        if (R.setPixelRatio) R.setPixelRatio(dpr);
        R.setSize(box.w || 1, box.h || 1, false);
        if (R.setViewport) R.setViewport(0, 0, box.w || 1, box.h || 1);
        if (R.setScissorTest) R.setScissorTest(scissor);
        if (rt && R.setRenderTarget) R.setRenderTarget(rt);
      } catch (e2) {}
      X._w = 0; X._h = 0;
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
  function blit(cv, c) {
    const yDraw = (c.y || 0) + (c.suspY || 0);
    const c0 = camS(c.x, yDraw + 0.6, c.z);
    if (!c0 || c0[2] < (typeof NEAR === 'number' ? NEAR : 0.5)) return false;
    const sc = scr(c0), px = H * 0.9 / c0[2] * 7;
    const squash = 1 - (c.pitch || 0) * 0.10;
    ctx.save();
    ctx.translate(sc[0], sc[1]);
    ctx.rotate((c.roll || 0) + (c.bodyRoll || 0));
    ctx.scale(1, squash);
    ctx.drawImage(cv, -px / 2, -px / 2, px, px);
    ctx.restore();
    return true;
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
    if (c.sim && dist < T.boxDist) shadow(c);
    if (c.hit || dist < T.fullDist) {
      const cv = cache.get(c._key);
      if (cv) { cache.delete(c._key); cache.set(c._key, cv); }
      if (cv && blit(cv, c)) { if (c.sim && !c.hit) dress(c); ctx.restore(); return; }
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
    for (const c of cars) if (c.on) { if (c.hit) knocked(c, dt); else advance(c, dt); }
    for (const c of cars) if (c.on && c.sim && !c.hit) bump(c);
    } catch (e) { runErr = String(e && e.stack || e); }
  }
  function collect(items) {
    if (OFF || !built) return;
    try {
    let baked = 0;
    for (const c of cars) {
      if (!c.on) continue;
      const dx = c.x - cam.x, dy = (c.y + 0.6) - cam.y, dz = c.z - cam.z;
      const dist = Math.hypot(dx, dy, dz);
      c._dist = dist;
      if (dist > T.dotDist) continue;
      if (dist < T.fullDist) {
        c._key = viewKey(c);
        if (!cache.has(c._key) && baked < T.bakePerFrame) { if (bake(c._key)) baked++; }
      }
      items.push([dx * dx + dz * dz, 't', c.slot]);
    }
    if (sparks.length) items.push([0, 't', sparkSlot]);
    } catch (e) { runErr = String(e && e.stack || e); }
  }
  function stats() {
    let sim = 0, dots = 0, turns = 0, straight = 0;
    for (const c of cars) if (c.on) c.sim ? sim++ : dots++;
    for (const L of lanes) { turns += L.turns.length; if (L.straight) straight++; }
    return {
      enabled:!OFF, model:'z370', clonedMeshes:cloned, simCap:T.simCap, dotCap:T.dotCap,
      sim, dots, alive:sim + dots, lanes:lanes.length, straight, turns,
      fullDist:T.fullDist, boxDist:T.boxDist, dotDist:T.dotDist,
      speedMin:T.speedMin, speedMax:T.speedMax, highwayAdd:T.highwayAdd,
      paints:T.paints.map(p => p.id), cache:cache.size, bakes, bakeErr, runErr,
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
  return {update, collect, stats, audit, ensure, _bake:bake, get cars(){ return cars; }, get lanes(){ return lanes; }, get _cache(){ return cache; }};
})();
window.TRAFFIC = TRAFFIC;
