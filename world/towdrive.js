'use strict';
// The six rollback tow trucks drive the same road lanes as Z traffic.
// Speed is towFrac (half) of a Z roll from TRAFFIC_TUNE. The tilted bed and the
// cab-guard plate stay the shapes towtruck.js built; only their place on the road changes.
// A Z that catches a truck in its lane sometimes hops the bed (scripted arc). The rest
// follow or change lanes. physics.js is not edited. At the bed lip the truck hands the
// player a forward + upward launch: closed wings stay a stunt jump, open wings get a
// small extra pop so the wings can take over.
const TOWDRIVE = (() => {
  const T = window.TRAFFIC_TUNE;
  const OFF = /[?&]notow=1/.test(location.search);
  let seed = 0x70fd11a3;
  function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  function lim(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ang(a, b) { return Math.atan2(Math.sin(a - b), Math.cos(a - b)); }
  const DIRS = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  function cardinal(yaw) {
    const a = Math.atan2(Math.sin(yaw), Math.cos(yaw));
    let best = -1, bd = 0.42;
    for (let i = 0; i < 4; i++) {
      const d = Math.abs(ang(a, DIRS[i]));
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  const trucks = [];
  let ready = false, rideT = null, err = '';

  function cruise(kind) {
    const add = (kind === 'highway' || kind === 'bridge' || kind === 'tunnel') ? T.highwayAdd : 0;
    return (T.speedMin + add + rnd() * (T.speedMax - T.speedMin)) * T.towFrac;
  }
  function blocked(L, s) {
    for (const iv of L.blocks) if (s >= iv[0] - 1 && s <= iv[1] + 1) return true;
    return false;
  }
  function nearest(x, z, yaw) {
    const lanes = TRAFFIC.lanes;
    let best = null, bd = 18;
    for (let i = 0; i < lanes.length; i++) {
      const L = lanes[i];
      if (cardinal(L.yaw) < 0 || Math.abs(ang(L.yaw, yaw)) > 0.5) continue;
      const dx = L.x1 - L.x0, dz = L.z1 - L.z0, den = L.len * L.len || 1;
      const u = lim(((x - L.x0) * dx + (z - L.z0) * dz) / den, 0, 1);
      const s = u * L.len, p = L.at(s), d = Math.hypot(p[0] - x, p[1] - z);
      if (d < bd && !blocked(L, s)) { bd = d; best = {L, s}; }
    }
    return best;
  }
  function bind(t) {
    const parts = [];
    for (const r of CITY.RAMPS) if (r.nm === 'tow' && r.oid === t.oid) parts.push(r);
    t.bedRamp = parts.find(r => !r.yb) || parts[0];
    t.guard = parts.find(r => r !== t.bedRamp) || null;
    t.cabB = null; t.cabQ = null;
    for (const b of CITY.BL) if (b.towCab && b.oid === t.oid) { t.cabB = b; t.cabQ = b.boxes[0]; break; }
    t.dyn = null;
    for (const m of CITY.DYN) if (m.rad === 9 && Math.abs(m.x - t.x) < 0.2 && Math.abs(m.z - t.z) < 0.2) { t.dyn = m; break; }
    if (CITY.live) { CITY.live(t.bedRamp); CITY.live(t.guard); CITY.live(t.cabQ); }
  }
  function setRamp(q, x, z, dir, w, d) {
    if (!q) return;
    const swap = dir % 2 === 1, W = swap ? d : w, D = swap ? w : d;
    q.x0 = x - W / 2; q.x1 = x + W / 2; q.z0 = z - D / 2; q.z1 = z + D / 2; q.dir = dir;
  }
  function layout(tr) {
    const p = tr.lane.at(tr.s), dir = cardinal(tr.lane.yaw);
    if (dir < 0) return;
    const u = [[0, 1], [1, 0], [0, -1], [-1, 0]][dir];
    const x = p[0], z = p[1], L = tr.L, bed = tr.bed, w = tr.w, cabL = tr.cabL;
    tr.x = x; tr.z = z; tr.u = u; tr.dir = dir;
    setRamp(tr.bedRamp, x - u[0] * (L / 2 - bed / 2), z - u[1] * (L / 2 - bed / 2), dir, w, bed);
    const gap = L - bed - cabL;
    setRamp(tr.guard, x + u[0] * (L / 2 - cabL - gap / 2), z + u[1] * (L / 2 - cabL - gap / 2), dir, w, gap);
    const cx = x + u[0] * (L / 2 - cabL / 2), cz = z + u[1] * (L / 2 - cabL / 2);
    const hw = (dir % 2 ? cabL : w) / 2, hd = (dir % 2 ? w : cabL) / 2;
    const q = tr.cabQ, b = tr.cabB;
    if (q) { q.x0 = cx - hw; q.x1 = cx + hw; q.z0 = cz - hd; q.z1 = cz + hd; }
    if (b) { b.x0 = cx - hw; b.x1 = cx + hw; b.z0 = cz - hd; b.z1 = cz + hd; b.cx = cx; b.cz = cz; }
    if (tr.dyn) { tr.dyn.x = x; tr.dyn.z = z; }
  }
  function boot() {
    if (ready) return;
    TRAFFIC.ensure();
    if (!TRAFFIC.lanes.length || !CITY.TOWS.length) return;
    for (let i = 0; i < CITY.TOWS.length; i++) {
      const t = CITY.TOWS[i];
      bind(t);
      const yaw = Math.atan2(t.u[0], t.u[1]);
      const hit = nearest(t.x, t.z, yaw);
      if (!hit) continue;
      t.lane = hit.L; t.s = hit.s; t.v0 = cruise(hit.L.kind); t.v = t.v0;
      t.id = i; t.homeX = t.x; t.homeZ = t.z; t.gone = 0; t.turn = null; t.rollS = -1; t.hopper = null; t.dx = 0; t.dz = 0;
      t.ut = 0;
      trucks.push(t);
      layout(t);
    }
    for (let i = 0; i < trucks.length; i++) for (let j = 0; j < i; j++) {
      const a = trucks[i], b = trucks[j];
      if (a.lane === b.lane && Math.abs(a.s - b.s) < a.L + 4) a.s = lim(a.s + a.L + 8, 2, a.lane.len - 2);
    }
    ready = trucks.length > 0;
  }
  function sibling(L) {
    const lanes = TRAFFIC.lanes;
    for (let i = 0; i < lanes.length; i++) {
      const M = lanes[i];
      if (M !== L && M.edge === L.edge && M.li === L.li && M.slot !== L.slot && cardinal(M.yaw) >= 0) return M;
    }
    return null;
  }
  function reverse(L) {
    const lanes = TRAFFIC.lanes;
    for (let i = 0; i < lanes.length; i++) {
      const M = lanes[i];
      if (M.edge === L.edge && M.li !== L.li && M.slot === L.slot && cardinal(M.yaw) >= 0) return M;
    }
    return null;
  }
  function noseHit(tr) {
    const u = tr.u, x = tr.x + u[0] * (tr.L * 0.5 + 2), z = tr.z + u[1] * (tr.L * 0.5 + 2);
    if (Math.abs(x) < 20 && z > -80 && z < 1520) return true;
    const pr = CITY.probe(x, z, 0.6);
    return !!(pr.wl && !pr.wl.ramp && pr.wl.oid !== tr.oid);
  }
  function leadOf(tr) {
    let best = null, bd = tr.L + 8;
    for (let i = 0; i < trucks.length; i++) {
      const o = trucks[i];
      if (o === tr || o.lane !== tr.lane) continue;
      const ds = o.s - tr.s;
      if (ds > 1 && ds < bd) { bd = ds; best = o; }
    }
    return best;
  }
  function drive(tr, dt) {
    const x0 = tr.x, z0 = tr.z;
    if (tr.ut > 0) tr.ut -= dt;
    const lead = leadOf(tr);
    tr.v = lead ? Math.min(tr.v0, lead.v) : tr.v0;
    const L = tr.lane;
    if (!tr.turn) {
      let near = null;
      for (const t of L.turns) {
        if (cardinal(t.to.yaw) < 0) continue;
        if (t.s < tr.s + 1 || t.s > tr.s + 20) continue;
        if (!near) near = [t];
        else if (t.s > near[0].s + 1.5) break;
        else near.push(t);
      }
      if (near && tr.rollS !== near[0].s) {
        tr.rollS = near[0].s;
        if (rnd() < T.turnP * 0.6) tr.turn = near[(rnd() * near.length) | 0];
      }
    }
    const step = tr.v * dt;
    const take = (lane, s) => { tr.lane = lane; tr.s = lim(s, 1, lane.len - 1); tr.turn = null; tr.rollS = -1; };
    if (tr.turn && tr.s + step >= tr.turn.s && !blocked(tr.turn.to, tr.turn.s2)) { take(tr.turn.to, tr.turn.s2); }
    else if (blocked(L, tr.s + 6) || noseHit(tr)) {
      const rev = reverse(L);
      if (rev && tr.ut <= 0) { take(rev, rev.len - tr.s); tr.ut = 1.6; }
      else tr.s = Math.max(1, tr.s - 0.2);
    } else {
      tr.s += step;
      if (tr.s >= L.len - 0.3) {
        if (L.straight && cardinal(L.straight.yaw) >= 0) take(L.straight, 0.8);
        else {
          const ends = L.turns.filter(t => t.s > L.len - 18 && cardinal(t.to.yaw) >= 0);
          const rev = reverse(L);
          if (ends.length) { const e = ends[(rnd() * ends.length) | 0]; take(e.to, e.s2); }
          else if (rev) { take(rev, 1); tr.ut = 1.6; }
          else tr.s = L.len - 1;
        }
      }
    }
    layout(tr);
    tr.dx = tr.x - x0; tr.dz = tr.z - z0;
    tr.gone = Math.hypot(tr.x - tr.homeX, tr.z - tr.homeZ);
  }
  function localOf(tr, x, z) {
    const u = tr.u, dx = x - tr.x, dz = z - tr.z;
    return {along: dx * u[0] + dz * u[1], lat: dx * u[1] - dz * u[0]};
  }
  // Moving bed: keep the player's speed up the deck, add the truck's forward speed,
  // and make sure the lip still throws them up. Wings closed = that stunt arc.
  // Wings open = the same handoff plus a short upward assist so lift can catch.
  function boost(tr) {
    const slope = Math.atan2(tr.h || 2.6, Math.max(1.5, tr.bed || 8));
    const ux = tr.u[0], uz = tr.u[1];
    const hd = P.hd || P.yaw || 0;
    const wings = !!P.wings && (P.tf || 0) > 0.2;
    const gNow = P.ground ? 0 : (P.gam || 0);
    const spd = P.v || 0;
    const vh = spd * Math.cos(gNow);
    let vy = spd * Math.sin(gNow);
    let vx = Math.sin(hd) * vh + ux * (tr.v || 0);
    let vz = Math.cos(hd) * vh + uz * (tr.v || 0);
    const relAlong = Math.sin(hd) * vh * ux + Math.cos(hd) * vh * uz;
    const climb = Math.max(0, relAlong);
    const gam = wings ? Math.min(1, slope + 0.18) : slope;
    const need = climb * Math.sin(gam);
    if (P.ground) {
      vx += ux * (climb * Math.cos(slope) - climb);
      vz += uz * (climb * Math.cos(slope) - climb);
      vy = need;
    } else if (vy < need) vy = need;
    if (wings) vy += Math.min(3, 1.15 + climb * 0.045);
    const wasGround = !!P.ground;
    const vhOut = Math.hypot(vx, vz) || 0.01;
    P.ground = false;
    P.v = Math.min(90, Math.hypot(vhOut, vy));
    P.gam = Math.atan2(vy, vhOut);
    P.hd = Math.atan2(vx, vz);
    P.yaw = P.hd;
    if ((P.pitch || 0) < P.gam) P.pitch = P.gam;
    P.toT = P.simT || 0;
    P.gT = 0;
    P.x += ux * 0.85; P.z += uz * 0.85;
    P.y = Math.max(P.y || 0, (tr.h || 2) + 0.35);
    if (wasGround) { P.ramps = (P.ramps || 0) + 1; if (typeof toast === 'function') toast('RAMP JUMP!'); }
  }
  let lipOid = 0;
  function overBed(tr, past) {
    if (P.wreck || P.loop || !tr || !tr.u) return null;
    const loc = localOf(tr, P.x, P.z);
    const rear = -tr.L / 2 - 0.55, lip = -tr.L / 2 + tr.bed;
    if (loc.along < rear || loc.along > lip + (past || 0.4)) return null;
    if (Math.abs(loc.lat) > tr.w / 2 + 0.55) return null;
    const deck = (tr.h || 0) * Math.max(0, Math.min(1, (loc.along + tr.L / 2) / Math.max(0.5, tr.bed)));
    if ((P.y || 0) > deck + 2.5) return null;
    return loc;
  }
  function carry() {
    if (rideT) {
      const tr = rideT, loc = localOf(tr, P.x, P.z), lip = -tr.L / 2 + tr.bed;
      const nearLip = Math.abs(loc.lat) < tr.w / 2 + 0.8 && (P.y || 0) < (tr.h || 2) + 3 && loc.along >= lip - 0.35 && loc.along < lip + 3;
      const on = overBed(tr, 1.2);
      if (nearLip) { boost(tr); lipOid = tr.oid; rideT = null; }
      else if (on) { P.x += tr.dx; P.z += tr.dz; }
      else rideT = null;
    }
    if (P.ground && (P.y || 0) < 0.85) lipOid = 0;
    if (!rideT && P.ground && !P.wreck) {
      for (let i = 0; i < trucks.length; i++) {
        const tr = trucks[i];
        if (lipOid && tr.oid === lipOid) continue;
        if (overBed(tr, 0)) { rideT = tr; break; }
      }
    }
    if (P.ground && !P.wreck) {
      for (let i = 0; i < trucks.length; i++) {
        const tr = trucks[i];
        const loc = localOf(tr, P.x, P.z);
        const cab0 = tr.L / 2 - tr.cabL - 0.15;
        if (loc.along < cab0 || loc.along > tr.L / 2 + 0.4 || Math.abs(loc.lat) > tr.w / 2 + 0.15) continue;
        if ((P.y || 0) > (tr.ch || 2.7) - 0.35) continue;
        const side = loc.lat < 0 ? -1 : 1, out = side * (tr.w / 2 + 0.85);
        P.x += tr.u[1] * (out - loc.lat); P.z -= tr.u[0] * (out - loc.lat);
        break;
      }
    }
  }
  function put(c, lane, s, y) {
    s = lim(s, 0.4, lane.len - 0.4);
    const p = lane.at(s);
    c.lane = lane; c.s = s; c.x = p[0]; c.z = p[1]; c.yaw = lane.yaw; c.y = y; c.blend = 0;
  }
  function hopStep(c, dt) {
    const h = c.hop, tr = h.tr;
    if (!tr || !tr.lane) { c.hop = null; return false; }
    if (h.phase === 'bed') {
      h.prog += Math.max(3.5, c.v - tr.v) * dt;
      const along = -tr.L / 2 + Math.min(h.prog, tr.bed);
      const y = tr.h * lim(h.prog / tr.bed, 0, 1);
      put(c, tr.lane, tr.s + along, y);
      if (h.prog >= tr.bed) { h.phase = 'air'; h.t = 0; h.y0 = tr.h; h.vy = T.hopVy; h.s = c.s; h.lane = tr.lane; }
      return true;
    }
    h.t += dt;
    h.s += Math.max(c.v, tr.v + 2) * dt;
    let lane = h.lane, s = h.s;
    if (s >= lane.len - 0.4 && lane.straight && cardinal(lane.straight.yaw) >= 0) { s = s - lane.len + 0.6; lane = lane.straight; h.lane = lane; h.s = s; }
    const y = h.y0 + h.vy * h.t - 4.9 * h.t * h.t;
    put(c, lane, s, Math.max(0, y));
    if ((y <= 0.2 && h.t > 0.35) || h.t > 3) {
      c.y = 0; c.hop = null; c.towKey = ''; if (tr.hopper === c) tr.hopper = null;
      c.v0 = Math.max(c.v0, tr.v + 3); c.v = c.v0;
    }
    return true;
  }
  function ride(c, dt) {
    if (OFF || !ready || !c || !c.sim || !c.on || !c.lane) return false;
    if (c.hop) return hopStep(c, dt);
    let tr = null, ds = 1e9;
    for (let i = 0; i < trucks.length; i++) {
      const o = trucks[i];
      if (o.lane !== c.lane) continue;
      const d = o.s - c.s;
      if (d > -2 && d < 26 && d < ds) { ds = d; tr = o; }
    }
    if (!tr) { c.towKey = ''; return false; }
    if (c.towKey !== tr.id) {
      c.towKey = tr.id;
      const r = rnd();
      if (!tr.hopper && r < T.hopP) c.towPick = 'hop';
      else if (r < T.hopP + (1 - T.hopP) * T.hopLane) c.towPick = 'lane';
      else c.towPick = 'follow';
      c.towDid = 0;
    }
    if (c.towPick === 'hop' && !tr.hopper && ds < tr.L * 0.5 + 8) {
      tr.hopper = c;
      c.hop = {tr, phase:'bed', prog: Math.max(0, tr.L * 0.5 - ds)};
      c.v = Math.max(c.v, tr.v + 4);
      return hopStep(c, dt);
    }
    if (c.towPick === 'lane' && !c.towDid) {
      c.towDid = 1;
      const side = sibling(tr.lane);
      if (side && !blocked(side, c.s)) { put(c, side, c.s, 0); c.towKey = ''; return true; }
      c.towPick = 'follow';
    }
    const rear = tr.s - tr.L * 0.5 - T.gap;
    if (c.s > rear) {
      c.v = tr.v; c.v0 = Math.min(c.v0, tr.v + 1);
      put(c, c.lane, rear, 0);
      return true;
    }
    return false;
  }
  function update(dt) {
    if (OFF || !window.TRAFFIC || !T) return;
    try {
      dt = Math.min(0.05, dt || 0.016);
      if (!ready) boot();
      if (!ready) return;
      for (let i = 0; i < trucks.length; i++) drive(trucks[i], dt);
      carry();
    } catch (e) { err = String(e && e.stack || e); }
  }
  function stats() {
    return {
      enabled:!OFF, n:trucks.length, err, frac:T.towFrac, hopP:T.hopP,
      trucks:trucks.map(tr => ({id:tr.id, v:+tr.v.toFixed(2), v0:+tr.v0.toFixed(2), gone:+tr.gone.toFixed(1), x:+tr.x.toFixed(1), z:+tr.z.toFixed(1), kind:tr.lane && tr.lane.kind, hop:tr.hopper ? 1 : 0}))
    };
  }
  return {update, ride, stats, get trucks(){ return trucks; }};
})();
window.TOWDRIVE = TOWDRIVE;
