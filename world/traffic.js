'use strict';
// Neon World road traffic: Z TAKEOVER level 4 (every car is the player's 370Z).
// The GLB is the one already loaded on ZD.Xray.car. Traffic clones that graph once
// (shared geometry, no second download) and bakes view sprites from X.render of
// that same model. Far cars are boxes or light dots. physics.js / tune.js untouched.
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
  let bakes = 0, bakeErr = '', cloned = 0, built = false;

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
    const c = {sim, on:false, lane:null, s:0, v:0, v0:0, yaw:0, x:0, z:0, y:0, pi:0, turn:null, rollS:-1, blend:0, blend0:0, bx:0, bz:0, by:0, utT:0, was:false, tick:0};
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
  function respawn(c) {
    const sp = c.sim ? spot(28, T.simRadius, true) : spot(T.dotInner, T.dotDist - 40, false);
    if (!sp) { c.on = false; return; }
    c.on = true; c.lane = sp.L; c.s = sp.s; c.x = sp.x; c.z = sp.z; c.yaw = sp.L.yaw; c.y = c.sim ? groundY(sp.x, sp.z) : 0;
    c.pi = (rnd() * T.paints.length) | 0; c.v0 = rollSpeed(sp.L.kind); c.v = c.v0;
    c.turn = null; c.rollS = -1; c.blend = 0; c.was = false; c.utT = 0;
  }
  function switchTo(c, lane, s) {
    s = lim(s, 0.4, lane.len - 0.4);
    if (blocked(lane, s)) { respawn(c); return; }
    const p = lane.at(s);
    const jump = Math.hypot(c.x - p[0], c.z - p[1]);
    const mx = (c.x + p[0]) / 2, mz = (c.z + p[1]) / 2;
    if (jump < 16 && jump > 0.4 && !solidAt(mx, mz) && !runway(mx, mz)) {
      c.bx = c.x; c.bz = c.z; c.by = c.yaw; c.blend0 = 0.28; c.blend = 0.28;
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
    if (c.blend > 0) {
      const k = c.blend / c.blend0;
      c.x = p[0] + (c.bx - p[0]) * k; c.z = p[1] + (c.bz - p[1]) * k;
      c.yaw = yaw + angDiff(c.by, yaw) * k;
    } else { c.x = p[0]; c.z = p[1]; c.yaw = yaw; }
  }
  function crowd(c) {
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);
    let hold = null, hd = T.gap;
    for (const o of cars) {
      if (o === c || !o.on || !o.sim) continue;
      const dx = o.x - c.x, dz = o.z - c.z, d = Math.hypot(dx, dz);
      if (d < hd && dx * fx + dz * fz > 0.4) { hd = d; hold = o; }
    }
    return hold ? {o:hold, d:hd} : null;
  }
  function advance(c, dt) {
    if (c.sim && window.TOWDRIVE && TOWDRIVE.ride(c, dt)) return;
    const L = c.lane;
    if (!L) { respawn(c); return; }
    if (c.utT > 0) c.utT -= dt;
    let target = c.v0;
    if (c.sim) {
      const h = crowd(c);
      if (h) target = Math.min(target, h.d < T.carL + 1.2 ? 1.5 : h.o.v);
    }
    c.v += (target - c.v) * Math.min(1, dt * 2);
    if (c.v < 0.4) c.v = 0.4;
    if (!c.turn) {
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
    const step = c.v * dt;
    if (c.turn && c.s + step >= c.turn.s) { switchTo(c, c.turn.to, c.turn.s2); return; }
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
      return;
    }
    place(c);
    if (c.blend > 0) c.blend = Math.max(0, c.blend - dt);
    if (c.sim || (c.tick++ % 18) === 0) {
      if (runway(c.x, c.z) || solidAt(c.x, c.z)) { if (c.utT > 0) respawn(c); else doUturn(c); return; }
      if (c.sim) c.y = groundY(c.x, c.z);
    }
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

  function projR(yaw, hl, hw, ux, uz) {
    const fx = Math.sin(yaw), fz = Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    return hl * Math.abs(fx * ux + fz * uz) + hw * Math.abs(rx * ux + rz * uz);
  }
  function bump(c) {
    if (!c.sim || !c.on || !P.ground || P.wreck || P.loop) { c.was = false; return; }
    if ((P.y || 0) - c.y > 2.4 || c.y - (P.y || 0) > 1) { c.was = false; return; }
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
    P.x += nx * (best + 0.08); P.z += nz * (best + 0.08);
    if (!c.was) {
      const slower = Math.max(0, P.v - T.bumpDrop);
      P.v = Math.max(0, Math.min(P.v * T.bumpKeep, slower));
      const side = Math.sin(P.yaw || 0) * (c.z - P.z) - Math.cos(P.yaw || 0) * (c.x - P.x);
      const kick = (side < 0 ? -1 : 1) * T.bumpYaw;
      P.yaw = (P.yaw || 0) + kick; P.hd = P.yaw;
      c.v = Math.max(4, c.v * 0.82);
    }
    c.was = true;
  }

  function viewKey(c) {
    const dx = cam.x - c.x, dz = cam.z - c.z, dy = cam.y - (c.y + 0.6);
    const hd = Math.hypot(dx, dz) || 0.001;
    const rel = Math.atan2(Math.sin(Math.atan2(dx, dz) - c.yaw), Math.cos(Math.atan2(dx, dz) - c.yaw));
    const elev = Math.atan2(dy, hd);
    let yb = Math.round(rel / (Math.PI / 8));
    yb = ((yb + 8) % 16 + 16) % 16 - 8;
    const eb = lim(Math.round(elev / 0.35), -1, 5);
    return c.pi + ':' + yb + ':' + eb;
  }
  function ensureClone() {
    if (cloned) return;
    const X = window.ZD && ZD.Xray;
    if (!X || !X.car) return;
    try {
      const g = X.car.clone(true);
      let n = 0;
      g.traverse(o => { if (o.isMesh) n++; });
      TRAFFIC._clone = g;
      cloned = n;
    } catch (e) { bakeErr = String(e); cloned = -1; }
  }
  function bake(key) {
    const X = window.ZD && ZD.Xray;
    if (!X || !X.ready || typeof X.render !== 'function') return false;
    ensureClone();
    const [pi, yb, eb] = key.split(':').map(Number);
    const paint = kids[pi];
    if (!paint) return false;
    const yaw = yb * (Math.PI / 8), elev = eb * 0.35;
    const dist = 7 / (2 * Math.tan(13 * Math.PI / 180));
    const g0 = window.ZGL && ZGL.S ? ZGL.S.g : 0;
    const cr = X.car && X.car.getObjectByName ? X.car.getObjectByName('crew') : null;
    const crV = cr ? cr.visible : false;
    const lv0 = X._gzLv || 0;
    try {
      if (window.ZGL && ZGL.ensure()) ZGL.set(0);
      if (cr) cr.visible = false;
      if (lv0 && X.car) {
        const z0 = m => { if (m && m.uniforms && m.uniforms.zLiv) m.uniforms.zLiv.value = 0; };
        z0(X.solid); z0(X.shell);
        X.car.traverse(m => { if (m.isMesh) (Array.isArray(m.material) ? m.material : [m.material]).forEach(z0); });
      }
      X.render(ctx, 0, 0, T.spritePx, T.spritePx, {
        xray:false, showroom:true, yaw, pitch:elev, dist, tx:0, ty:0.6, fov:26, drl:1, noDraw:true,
        kid:paint, st:{t:performance.now() / 1000, throttle:45, wheelAng:0}
      });
      const src = X.canvas;
      if (!src || src.width < 8) return false;
      const cv = document.createElement('canvas');
      cv.width = src.width; cv.height = src.height;
      cv.getContext('2d', {alpha:true}).drawImage(src, 0, 0);
      if (cache.size > 72) cache.clear();
      cache.set(key, cv); bakes++;
      return true;
    } catch (e) { bakeErr = String(e); return false; }
    finally {
      if (window.ZGL && ZGL.S && ZGL.S.ok) ZGL.set(g0);
      if (cr) cr.visible = crV;
      if (lv0) X._gzSig = null;
      if (typeof ZV !== 'undefined') ZV.lastPx = 0;
    }
  }
  function blit(cv, c) {
    const c0 = camS(c.x, c.y + 0.6, c.z);
    if (!c0 || c0[2] < (typeof NEAR === 'number' ? NEAR : 0.5)) return false;
    const sc = scr(c0), px = H * 0.9 / c0[2] * 7;
    ctx.drawImage(cv, sc[0] - px / 2, sc[1] - px / 2, px, px);
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
  function drawOne(c) {
    if (!c.on) return;
    const dist = c._dist || Math.hypot(c.x - cam.x, c.y - cam.y, c.z - cam.z);
    if (dist > T.dotDist) return;
    ctx.save();
    if (dist < T.fullDist) {
      const cv = cache.get(c._key);
      if (cv && blit(cv, c)) { ctx.restore(); return; }
      drawBox(c); lights(c, dist);
    } else if (dist < T.boxDist) { drawBox(c); lights(c, dist); }
    else lights(c, dist);
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
    for (const c of cars) if (c.on) advance(c, dt);
    for (const c of cars) if (c.on && c.sim) bump(c);
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
      paints:T.paints.map(p => p.id), cache:cache.size, bakes, bakeErr, runErr
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
  return {update, collect, stats, audit, ensure, get cars(){ return cars; }, get lanes(){ return lanes; }};
})();
window.TRAFFIC = TRAFFIC;
