'use strict';
// Visual-only night detail for world-split.html. Baked once, drawn with a fixed
// budget, no per-frame allocation. Does not touch collision, roads, or physics.
// Baseline layers stay at their tuned distances at every speed, in the air, and
// in both Arcade and Street mode. Street Mode (P.driveMode === 'street', on the
// ground, under crawl m/s) only adds a close-up door frame inside crawlRadius.
(function () {
  if (window.DETAIL || !window.DETAIL_TUNE || typeof CITY === 'undefined' || typeof drawBldg !== 'function') return;
  const T = DETAIL_TUNE;
  const on = {
    windows: !!T.windows, roofTrim: !!T.roofTrim, signs: !!T.signs, shapes: !!T.shapes,
    lanes: !!T.lanes, crosswalks: !!T.crosswalks, sidewalks: !!T.sidewalks,
    streetlights: !!T.streetlights, grass: !!T.grass, river: !!T.river, trees: !!T.trees
  };
  let extraOn = true;
  (function applyUrl() {
    const q = location.search;
    if (/[?&]detail=off(?:&|$)/.test(q) || /[?&]nodetail=1/.test(q)) {
      for (const k in on) on[k] = false;
      extraOn = false;
      return;
    }
    const m = q.match(/[?&]detail=([^&]+)/);
    if (!m) return;
    extraOn = false;
    for (const k in on) on[k] = false;
    m[1].split(/[+,\s]+/).forEach((k) => { if (k in on) on[k] = true; });
  })();

  const stat = { faces: 0, trims: 0, signs: 0, lights: 0, trees: 0, roads: 0, river: 0, grass: 0, close: 0, cruise: 0, winSegs: 0 };
  const NEAR_Z = (typeof NEAR === 'number' ? NEAR : 0.5);
  const BL = CITY.BL;
  const COLS = ['#3ee6ff', '#ff4fd8', '#ffb020', '#ff2a3d', '#fff2c0', '#ffd27a'];
  const WORDS = ['Z-DASH', 'NEON', 'DRIFT', 'NOS', 'ARCADE', 'BEATS'];

  let CY = 1, SY = 0, CP = 1, SP = 0, CR = 1, SR = 0, FOV = 400;
  const A = new Float32Array(3), B = new Float32Array(3);
  const SA = new Float32Array(2), SB = new Float32Array(2);

  function cacheCam() {
    CY = Math.cos(cam.yaw); SY = Math.sin(cam.yaw);
    CP = Math.cos(-cam.pitch); SP = Math.sin(-cam.pitch);
    CR = Math.cos(cam.roll); SR = Math.sin(cam.roll);
    FOV = H * 0.9;
  }
  function camPoint(x, y, z, o) {
    let dx = x - cam.x, dy = y - cam.y, dz = z - cam.z;
    let X = dx * CY - dz * SY, Z = dx * SY + dz * CY;
    let Y = dy * CP - Z * SP; Z = dy * SP + Z * CP;
    o[0] = X * CR - Y * SR; o[1] = X * SR + Y * CR; o[2] = Z;
    return Z >= NEAR_Z;
  }
  function screenOf(o, s) {
    s[0] = W / 2 + o[0] * FOV / o[2];
    s[1] = H / 2 - o[1] * FOV / o[2];
  }
  function dist3(x, y, z) {
    const dx = x - cam.x, dy = y - cam.y, dz = z - cam.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  function seg(x1, y1, z1, x2, y2, z2) {
    const aok = camPoint(x1, y1, z1, A);
    const bok = camPoint(x2, y2, z2, B);
    if (!aok && !bok) return;
    if (aok !== bok) {
      const dz = B[2] - A[2];
      if (dz > -1e-6 && dz < 1e-6) return;
      const t = (NEAR_Z - A[2]) / dz;
      const x = A[0] + (B[0] - A[0]) * t, y = A[1] + (B[1] - A[1]) * t;
      if (!aok) { A[0] = x; A[1] = y; A[2] = NEAR_Z; }
      else { B[0] = x; B[1] = y; B[2] = NEAR_Z; }
    }
    screenOf(A, SA); screenOf(B, SB);
    ctx.moveTo(SA[0], SA[1]); ctx.lineTo(SB[0], SB[1]);
  }
  function boxDist(b) {
    const x = cam.x < b.x0 ? b.x0 : cam.x > b.x1 ? b.x1 : cam.x;
    const y = cam.y < 0 ? 0 : cam.y > b.top ? b.top : cam.y;
    const z = cam.z < b.z0 ? b.z0 : cam.z > b.z1 ? b.z1 : cam.z;
    return dist3(x, y, z);
  }
  function skipKind(b) {
    const k = b.kind;
    return k === 'outline' || k === 'pylon' || k === 'bill' || k === 'hill' || b.towCab;
  }
  function clean() {
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.lineWidth = 1;
    ctx.fillStyle = '#0a0612';
  }

  function makeSign(text, color) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#07030d';
    g.fillRect(0, 0, 256, 64);
    g.strokeStyle = color;
    g.lineWidth = 4;
    g.strokeRect(3, 3, 250, 58);
    g.globalAlpha = 0.35;
    g.lineWidth = 10;
    g.strokeRect(8, 8, 240, 48);
    g.globalAlpha = 1;
    g.font = '900 34px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = color;
    g.fillText(text, 128, 34);
    return c;
  }
  function makeLamp() {
    const c = document.createElement('canvas');
    c.width = 32; c.height = 80;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(16, 14, 1, 16, 14, 14);
    rg.addColorStop(0, 'rgba(233,251,255,.95)');
    rg.addColorStop(0.35, 'rgba(62,230,255,.55)');
    rg.addColorStop(1, 'rgba(62,230,255,0)');
    g.fillStyle = rg;
    g.beginPath(); g.arc(16, 14, 14, 0, 6.2832); g.fill();
    g.fillStyle = '#9ff3ff';
    g.fillRect(11, 10, 10, 7);
    g.strokeStyle = '#ffb020';
    g.strokeRect(11.5, 10.5, 9, 6);
    g.fillStyle = '#8a7a9d';
    g.fillRect(15, 17, 2, 56);
    g.fillStyle = '#ffb020';
    g.fillRect(12, 72, 8, 3);
    return c;
  }
  function makeTree() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 80;
    const g = c.getContext('2d');
    g.fillStyle = '#140810';
    g.fillRect(30, 50, 4, 28);
    g.strokeStyle = '#ffb020';
    g.strokeRect(30.5, 50, 3, 27);
    g.beginPath();
    g.moveTo(32, 4); g.lineTo(58, 36); g.lineTo(32, 60); g.lineTo(6, 36); g.closePath();
    g.fillStyle = '#07140e';
    g.fill();
    g.lineWidth = 2;
    g.strokeStyle = '#7dff6b';
    g.stroke();
    g.lineWidth = 1;
    g.strokeStyle = 'rgba(62,230,255,.8)';
    g.beginPath();
    g.moveTo(32, 16); g.lineTo(32, 50);
    g.moveTo(18, 36); g.lineTo(46, 36);
    g.moveTo(22, 26); g.lineTo(42, 46);
    g.moveTo(42, 26); g.lineTo(22, 46);
    g.stroke();
    g.strokeStyle = '#ff4fd8';
    g.strokeRect(26.5, 30.5, 11, 11);
    return c;
  }

  const signImgs = [];
  let lampImg = null, treeImg = null;
  if (on.signs) {
    for (let i = 0; i < WORDS.length; i++) signImgs.push(makeSign(WORDS[i], COLS[i % COLS.length]));
  }
  if (on.streetlights) lampImg = makeLamp();
  if (on.trees) treeImg = makeTree();

  const MAXL = 900, CELL = 100, OX = -800, OZ = -500, NX = 20, NZ = 32;
  const LX = new Float32Array(MAXL), LZ = new Float32Array(MAXL), LY = new Float32Array(MAXL);
  const LHEAD = new Int32Array(NX * NZ), LNEXT = new Int32Array(MAXL);
  LHEAD.fill(-1);
  let nL = 0;
  function cellOf(x, z) {
    const i = ((x - OX) / CELL) | 0, j = ((z - OZ) / CELL) | 0;
    if (i < 0 || j < 0 || i >= NX || j >= NZ) return -1;
    return j * NX + i;
  }
  function addLight(x, z) {
    if (nL >= MAXL) return;
    if (Math.abs(x) < 148) return;
    if (z > 1764 && z < 1856) return;
    if (x > -470 && x < -430 && z > 490 && z < 710) return;
    const pr = CITY.probe(x, z, 1.2);
    if (pr && pr.wl && !pr.wl.ramp) return;
    const gy = pr && pr.fl > 0 ? pr.fl : 0;
    if (gy > 1.5) return;
    const id = cellOf(x, z);
    if (id < 0) return;
    const i = nL++;
    LX[i] = x; LZ[i] = z; LY[i] = gy;
    LNEXT[i] = LHEAD[id]; LHEAD[id] = i;
  }
  if (on.streetlights) {
    const xs = [150, 250, 350, 450, 550, -150, -250, -350, -450, -550];
    for (let xi = 0; xi < xs.length; xi++) {
      const x = xs[xi], outer = x > 0 ? 1 : -1;
      for (let z = -280; z <= 2080; z += 64) {
        addLight(x + outer * 9.2, z);
        if (Math.abs(x) > 160) addLight(x - outer * 9.2, z);
      }
    }
    for (let z = -300; z <= 2100; z += 200) {
      if (z > 1760 && z < 1860) continue;
      for (let x = -540; x <= 540; x += 64) {
        if (Math.abs(x) < 160) continue;
        addLight(x, z - 9.2);
        addLight(x, z + 9.2);
      }
    }
  }

  const MAXS = 16;
  const SX = new Float32Array(MAXS), SgY = new Float32Array(MAXS), SZ = new Float32Array(MAXS);
  const SNX = new Float32Array(MAXS), SNZ = new Float32Array(MAXS);
  const SW = new Float32Array(MAXS), SH = new Float32Array(MAXS), STX = new Int8Array(MAXS);
  let nS = 0;
  const SIGNF = { nx: 0, nz: 0, x: 0, z: 0, w: 0 };
  function faceOf(b) {
    if (skipKind(b) || b.top < 11 || Math.abs(b.cx) < 150) return false;
    if (b.deco) for (let k = 0; k < b.deco.length; k++) if (b.deco[k][0] === 'sign') return false;
    let best = 30, hit = false;
    for (let z = -300; z <= 2100; z += 200) {
      const raw = Math.abs(b.z0 - z), bw = b.x1 - b.x0;
      const score = raw - 4;
      if (raw <= 18 && bw >= 10 && score < best) {
        best = score; hit = true;
        SIGNF.nx = 0; SIGNF.nz = -1; SIGNF.z = b.z0 - 0.3; SIGNF.x = b.cx;
        SIGNF.w = Math.min(12, bw * 0.46);
      }
    }
    for (let si = 0, xs = [150, 250, 350, 450, 550, -150, -250, -350, -450, -550]; si < xs.length; si++) {
      const sx = xs[si];
      const d0 = Math.abs(b.x0 - sx), d1 = Math.abs(b.x1 - sx), raw = d0 < d1 ? d0 : d1;
      const bw = b.z1 - b.z0;
      if (raw <= 14 && bw >= 10 && raw < best) {
        best = raw; hit = true;
        SIGNF.nx = sx >= b.cx ? 1 : -1; SIGNF.nz = 0;
        SIGNF.x = SIGNF.nx > 0 ? b.x1 + 0.3 : b.x0 - 0.3; SIGNF.z = b.cz;
        SIGNF.w = Math.min(12, bw * 0.42);
      }
    }
    return hit && SIGNF.w >= 7;
  }
  function pushSign(b) {
    if (nS >= 12) return;
    const s = nS++;
    SX[s] = SIGNF.x; SgY[s] = Math.min(b.top - 2.2, 9.4); SZ[s] = SIGNF.z;
    SNX[s] = SIGNF.nx; SNZ[s] = SIGNF.nz; SW[s] = SIGNF.w; SH[s] = 3.1;
    STX[s] = (b.wseed || s) % signImgs.length;
  }
  if (on.signs) {
    // Mid-block signs on the wall that faces the street, centred where a chase
    // cam looking down the block can read them. Intersection signs sit on the
    // cross street, a full block ahead, so the downtown pose never met one.
    const used = new Uint8Array(BL.length);
    function sideOn(b, streetX, zAim) {
      if (skipKind(b) || b.top < 11) return false;
      if (b.deco) for (let k = 0; k < b.deco.length; k++) if (b.deco[k][0] === 'sign') return false;
      const d0 = Math.abs(b.x0 - streetX), d1 = Math.abs(b.x1 - streetX), raw = d0 < d1 ? d0 : d1;
      const bw = b.z1 - b.z0;
      if (raw > 16 || bw < 12 || b.z1 < zAim - 20 || b.z0 > zAim + 10) return false;
      let z = zAim;
      if (z < b.z0 + 5) z = b.z0 + 5;
      if (z > b.z1 - 5) z = b.z1 - 5;
      if (z < b.z0 + 4 || z > b.z1 - 4) return false;
      SIGNF.nx = streetX >= b.cx ? 1 : -1;
      SIGNF.nz = 0;
      SIGNF.x = SIGNF.nx > 0 ? b.x1 + 0.3 : b.x0 - 0.3;
      SIGNF.z = z;
      SIGNF.w = Math.min(12, bw * 0.35);
      return SIGNF.w >= 7;
    }
    for (let si = 0, aims = [450, 1230, -250, 1100, 250, 700]; si < aims.length && nS < 3; si += 2) {
      let bestI = -1, best = 1e9;
      for (let i = 0; i < BL.length; i++) {
        if (used[i] || !sideOn(BL[i], aims[si], aims[si + 1])) continue;
        const dx = SIGNF.x - aims[si], dz = SIGNF.z - aims[si + 1], d2 = dx * dx + dz * dz;
        if (d2 < best) { best = d2; bestI = i; }
      }
      if (bestI < 0) continue;
      used[bestI] = 1;
      sideOn(BL[bestI], aims[si], aims[si + 1]);
      pushSign(BL[bestI]);
    }
    for (let n = 0; n < 4 && nS < 12; n++) {
      let bestI = -1, bestD = 180 * 180;
      for (let i = 0; i < BL.length; i++) {
        if (used[i]) continue;
        const b = BL[i];
        if (!faceOf(b)) continue;
        const dx = SIGNF.x - 450, dz = SIGNF.z - 1235, d2 = dx * dx + dz * dz;
        if (d2 >= bestD) continue;
        bestD = d2; bestI = i;
      }
      if (bestI < 0) break;
      used[bestI] = 1;
      faceOf(BL[bestI]);
      pushSign(BL[bestI]);
    }
    let cand = 0;
    for (let i = 0; i < BL.length; i++) if (!used[i] && faceOf(BL[i])) cand++;
    const stride = Math.max(1, (cand / 8) | 0);
    let seen = 0;
    for (let i = 0; i < BL.length && nS < 12; i++) {
      if (used[i] || !faceOf(BL[i])) continue;
      if ((seen++ % stride) !== 0) continue;
      pushSign(BL[i]);
    }
  }

  const MAXT = 80;
  const TX = new Float32Array(MAXT), TZ = new Float32Array(MAXT), TH = new Float32Array(MAXT);
  const THEAD = new Int32Array(NX * NZ), TNEXT = new Int32Array(MAXT);
  THEAD.fill(-1);
  let nT = 0;
  function addTree(x, z, h) {
    if (nT >= MAXT) return;
    const id = cellOf(x, z);
    if (id < 0) return;
    const i = nT++;
    TX[i] = x; TZ[i] = z; TH[i] = h;
    TNEXT[i] = THEAD[id]; THEAD[id] = i;
  }
  if (on.trees && CITY.TREES) {
    for (let i = 0; i < CITY.TREES.length; i++) {
      const t = CITY.TREES[i];
      addTree(t[0], t[1], t[2] || 6);
    }
  }

  const MAXP = 8;
  const PX0 = new Float32Array(MAXP), PZ0 = new Float32Array(MAXP), PX1 = new Float32Array(MAXP), PZ1 = new Float32Array(MAXP);
  let nP = 0;
  function addPatch(x0, z0, x1, z1) {
    if (nP >= MAXP) return;
    const i = nP++;
    PX0[i] = x0; PZ0[i] = z0; PX1[i] = x1; PZ1[i] = z1;
  }
  if (on.grass && CITY.PARK) {
    const P = CITY.PARK;
    addPatch(P.x0 + 8, P.z0 + 10, P.x0 + 70, P.z0 + 78);
    addPatch((P.x0 + P.x1) / 2 - 20, P.z0 + 24, (P.x0 + P.x1) / 2 + 48, P.z0 + 96);
    addPatch(P.x1 - 78, P.z1 - 86, P.x1 - 8, P.z1 - 12);
  }

  const winId = [-1, -1], winD = [1e9, 1e9];
  const fullId = [-1, -1, -1, -1], fullD = [1e9, 1e9, 1e9, 1e9];
  const simpId = [-1, -1, -1], simpD = [1e9, 1e9, 1e9];
  function resetPick(ids, ds) {
    for (let i = 0; i < ids.length; i++) { ids[i] = -1; ds[i] = 1e9; }
  }
  function insertPick(ids, ds, id, d) {
    const n = ds.length;
    if (d >= ds[n - 1]) return;
    let j = n - 1;
    while (j > 0 && d < ds[j - 1]) { ds[j] = ds[j - 1]; ids[j] = ids[j - 1]; j--; }
    ds[j] = d; ids[j] = id;
  }
  function listed(ids, id) {
    for (let i = 0; i < ids.length; i++) if (ids[i] === id) return true;
    return false;
  }

  let facesLeft = 0, anyTrim = false, anyWin = false, yCut = -1e9;
  function beginFrame() {
    cacheCam();
    stat.faces = stat.trims = stat.signs = stat.lights = stat.trees = stat.roads = stat.river = stat.grass = stat.winSegs = 0;
    stat.cruise = (extraOn && P.driveMode === 'street' && !!P.ground && Math.abs(P.v || 0) < (T.crawl || 12)) ? 1 : 0;
    const cap = (T.maxWindowFaces != null ? T.maxWindowFaces : T.faceBudget) | 0;
    facesLeft = cap > 6 ? 6 : (cap > 0 ? cap : 4);
    anyTrim = false;
    anyWin = false;
    yCut = cam.y - T.mid;
    const wantB = on.windows || on.roofTrim || on.shapes;
    if (!wantB) return;
    if (cam.y > 239 + T.mid) return;
    resetPick(winId, winD);
    resetPick(fullId, fullD);
    resetPick(simpId, simpD);
    const near = Math.min(48, T.nearDist || T.near || 48), mid = T.mid;
    for (let i = 0; i < BL.length; i++) {
      const b = BL[i];
      if (b.top < yCut || skipKind(b)) continue;
      const d = boxDist(b);
      if (d < near) {
        if (on.windows) insertPick(winId, winD, b.id, d);
        if (on.roofTrim || on.shapes) insertPick(fullId, fullD, b.id, d);
      } else if (d < mid && on.roofTrim) insertPick(simpId, simpD, b.id, d);
    }
    anyWin = winId[0] >= 0;
    anyTrim = fullId[0] >= 0 || simpId[0] >= 0;
  }

  // Window bays are fixed on the wall. Slots come from the building span only,
  // never from cam.x / cam.z, so driving does not slide or pop the frames.
  const WSLOT = new Float32Array(4);
  const WIN_W = 1.65, WIN_H = 1.2;
  function fillSlots(u0, u1) {
    const lo = u0 + 1.5, hi = u1 - 1.5, span = hi - lo;
    if (span < 2.4) return 0;
    let n = (span / 5.5) | 0;
    if (n < 1) n = 1;
    if (n > 4) n = 4;
    const step = span / n;
    for (let i = 0; i < n; i++) WSLOT[i] = lo + step * (i + 0.5) - WIN_W * 0.5;
    return n;
  }
  function emitWin(varyZ, plane, yb, u) {
    const yt = yb + WIN_H, uu = u + WIN_W;
    if (varyZ) {
      seg(plane, yb, u, plane, yb, uu);
      seg(plane, yb, uu, plane, yt, uu);
      seg(plane, yt, uu, plane, yt, u);
      seg(plane, yt, u, plane, yb, u);
    } else {
      seg(u, yb, plane, uu, yb, plane);
      seg(uu, yb, plane, uu, yt, plane);
      seg(uu, yt, plane, u, yt, plane);
      seg(u, yt, plane, u, yb, plane);
    }
    stat.winSegs += 4;
  }
  function paintFace(varyZ, plane, y0, y1, u0, u1) {
    if (facesLeft <= 0) return false;
    const n = fillSlots(u0, u1);
    if (!n) return false;
    let any = false;
    for (let r = 0; r < 3; r++) {
      const yb = y0 + 0.45 + r * ((y1 - y0) / 3);
      if (yb + WIN_H > y1) break;
      for (let i = 0; i < n; i++) {
        const u = WSLOT[i];
        if (u < u0 + 0.35 || u + WIN_W > u1 - 0.35) continue;
        emitWin(varyZ, plane, yb, u);
        any = true;
      }
    }
    if (any) { facesLeft--; stat.faces++; }
    return any;
  }
  function windowPass(b) {
    if (!on.windows || !anyWin || facesLeft <= 0 || !listed(winId, b.id) || !b.boxes || !b.boxes.length) return;
    const q = b.boxes[0];
    const y0 = q.y0 > 0 ? q.y0 + 0.8 : q.y0 + 5.1;
    const y1 = Math.min(q.y1 - 0.5, y0 + 9.2);
    if (y1 - y0 < 2.2) return;
    const x0 = q.x0, x1 = q.x1, z0 = q.z0, z1 = q.z1;
    if (x1 - x0 < 3 || z1 - z0 < 3) return;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = COLS[(b.wseed || 0) % COLS.length];
    let drew = false;
    if (cam.x < x0 - 0.4) { if (paintFace(true, x0 - 0.12, y0, y1, z0, z1)) drew = true; }
    else if (cam.x > x1 + 0.4) { if (paintFace(true, x1 + 0.12, y0, y1, z0, z1)) drew = true; }
    if (cam.z < z0 - 0.4) { if (paintFace(false, z0 - 0.12, y0, y1, x0, x1)) drew = true; }
    else if (cam.z > z1 + 0.4) { if (paintFace(false, z1 + 0.12, y0, y1, x0, x1)) drew = true; }
    if (drew) ctx.stroke();
    ctx.restore();
  }

  function post(x, z, s, y, y2) {
    seg(x, y2, z, x + s, y2, z);
    seg(x + s, y2, z, x + s, y2, z + s);
    seg(x + s, y2, z + s, x, y2, z + s);
    seg(x, y2, z + s, x, y2, z);
    seg(x, y, z, x, y2, z);
    seg(x + s, y, z + s, x + s, y2, z + s);
  }
  function addShape(b, q) {
    const y = q.y1;
    const k = (b.wseed || 0) % 4;
    const bw = q.x1 - q.x0, bd = q.z1 - q.z0;
    if (k === 0) {
      const ix = bw * 0.14, iz = bd * 0.14, y2 = y + 1.15;
      seg(q.x0 + ix, y2, q.z0 + iz, q.x1 - ix, y2, q.z0 + iz);
      seg(q.x1 - ix, y2, q.z0 + iz, q.x1 - ix, y2, q.z1 - iz);
      seg(q.x1 - ix, y2, q.z1 - iz, q.x0 + ix, y2, q.z1 - iz);
      seg(q.x0 + ix, y2, q.z1 - iz, q.x0 + ix, y2, q.z0 + iz);
      seg(q.x0 + ix, y, q.z0 + iz, q.x0 + ix, y2, q.z0 + iz);
      seg(q.x1 - ix, y, q.z0 + iz, q.x1 - ix, y2, q.z0 + iz);
      seg(q.x1 - ix, y, q.z1 - iz, q.x1 - ix, y2, q.z1 - iz);
      seg(q.x0 + ix, y, q.z1 - iz, q.x0 + ix, y2, q.z1 - iz);
    } else if (k === 1) {
      const s = Math.min(bw, bd) * 0.18, y2 = y + 3.4;
      post(q.x0, q.z0, s, y, y2);
      post(q.x1 - s, q.z0, s, y, y2);
      post(q.x0, q.z1 - s, s, y, y2);
      post(q.x1 - s, q.z1 - s, s, y, y2);
    } else if (k === 2) {
      const mx = (q.x0 + q.x1) / 2, mz = (q.z0 + q.z1) / 2;
      if (bw >= bd) {
        seg(q.x0, y + 0.2, mz, mx, y + 3.1, mz);
        seg(mx, y + 3.1, mz, q.x1, y + 0.2, mz);
      } else {
        seg(mx, y + 0.2, q.z0, mx, y + 3.1, mz);
        seg(mx, y + 3.1, mz, mx, y + 0.2, q.z1);
      }
    } else {
      const ix = bw * 0.3, iz = bd * 0.3, y2 = y + 3.6;
      seg(q.x0 + ix, y, q.z0 + iz, q.x0 + ix, y2, q.z0 + iz);
      seg(q.x1 - ix, y, q.z0 + iz, q.x1 - ix, y2, q.z0 + iz);
      seg(q.x1 - ix, y, q.z1 - iz, q.x1 - ix, y2, q.z1 - iz);
      seg(q.x0 + ix, y, q.z1 - iz, q.x0 + ix, y2, q.z1 - iz);
      seg(q.x0 + ix, y2, q.z0 + iz, q.x1 - ix, y2, q.z0 + iz);
      seg(q.x1 - ix, y2, q.z0 + iz, q.x1 - ix, y2, q.z1 - iz);
      seg(q.x1 - ix, y2, q.z1 - iz, q.x0 + ix, y2, q.z1 - iz);
      seg(q.x0 + ix, y2, q.z1 - iz, q.x0 + ix, y2, q.z0 + iz);
    }
  }
  function hasPad(b) {
    if (!b.deco) return false;
    for (let i = 0; i < b.deco.length; i++) if (b.deco[i][0] === 'pad') return true;
    return false;
  }
  function roofPass(b) {
    if (!anyTrim) return;
    const full = listed(fullId, b.id), simple = !full && listed(simpId, b.id);
    if (!full && !simple) return;
    const q = b.roofBox || (b.boxes && b.boxes[b.boxes.length - 1]);
    if (!q) return;
    const y = q.y1 + 0.16;
    ctx.beginPath();
    seg(q.x0, y, q.z0, q.x1, y, q.z0);
    seg(q.x1, y, q.z0, q.x1, y, q.z1);
    seg(q.x1, y, q.z1, q.x0, y, q.z1);
    seg(q.x0, y, q.z1, q.x0, y, q.z0);
    if (full && on.roofTrim) {
      const ix = (q.x1 - q.x0) * 0.07, iz = (q.z1 - q.z0) * 0.07;
      seg(q.x0 + ix, y, q.z0 + iz, q.x1 - ix, y, q.z0 + iz);
      seg(q.x1 - ix, y, q.z0 + iz, q.x1 - ix, y, q.z1 - iz);
      seg(q.x1 - ix, y, q.z1 - iz, q.x0 + ix, y, q.z1 - iz);
      seg(q.x0 + ix, y, q.z1 - iz, q.x0 + ix, y, q.z0 + iz);
    }
    if (full && on.shapes && !hasPad(b)) addShape(b, q);
    ctx.strokeStyle = b.c || '#3ee6ff';
    ctx.lineWidth = full ? 1.7 : 1.15;
    ctx.stroke();
    stat.trims++;
  }

  const _drawBldg = drawBldg;
  drawBldg = function (b, d) {
    _drawBldg(b, d);
    if (anyWin) windowPass(b);
    if (anyTrim) roofPass(b);
  };

  // Street paint gaps. Built once from the same blocked spans traffic already skips.
  // kind 'street' only, so highway, tunnel, bridge, and track centerlines stay whole.
  // Probe steps 4 m, so the gap is padded 6 m or the dashes still enter the wall.
  const GAPN = 256, GAP_PAD = 6;
  const GN = [0, 0];
  const GC = [new Float32Array(GAPN), new Float32Array(GAPN)];
  const G0 = [new Float32Array(GAPN), new Float32Array(GAPN)];
  const G1 = [new Float32Array(GAPN), new Float32Array(GAPN)];
  const GU0 = new Float32Array(24), GU1 = new Float32Array(24);
  function addGap(axis, c, u0, u1) {
    if (u1 < u0) { const t = u0; u0 = u1; u1 = t; }
    const C = GC[axis], A0 = G0[axis], A1 = G1[axis];
    let n = GN[axis];
    for (let i = 0; i < n; i++) {
      if (Math.abs(C[i] - c) > 1.5) continue;
      if (u1 < A0[i] - 0.5 || u0 > A1[i] + 0.5) continue;
      if (u0 < A0[i]) A0[i] = u0;
      if (u1 > A1[i]) A1[i] = u1;
      let j = i + 1;
      while (j < n) {
        if (Math.abs(C[j] - c) <= 1.5 && !(A1[j] < A0[i] - 0.5 || A0[j] > A1[i] + 0.5)) {
          if (A0[j] < A0[i]) A0[i] = A0[j];
          if (A1[j] > A1[i]) A1[i] = A1[j];
          n--;
          C[j] = C[n]; A0[j] = A0[n]; A1[j] = A1[n];
        } else j++;
      }
      GN[axis] = n;
      return;
    }
    if (n >= GAPN) return;
    C[n] = c; A0[n] = u0; A1[n] = u1;
    GN[axis] = n + 1;
  }
  function buildGaps() {
    const roads = CITY.ROADS, edges = roads && roads.edges, nodes = roads && roads.nodes;
    if (!edges || !nodes) return;
    for (let ei = 0; ei < edges.length; ei++) {
      const e = edges[ei];
      if (!e || e.kind !== 'street' || !e.blockedBy || !e.blockedBy.length) continue;
      const A = nodes[e.a], B = nodes[e.b];
      const vert = Math.abs(A.x - B.x) < 1, horiz = Math.abs(A.z - B.z) < 1;
      if (!vert && !horiz) continue;
      const ux = (B.x - A.x) / e.len, uz = (B.z - A.z) / e.len;
      for (let bi = 0; bi < e.blockedBy.length; bi++) {
        const b = e.blockedBy[bi];
        if (vert) {
          const z0 = A.z + uz * b.d0, z1 = A.z + uz * b.d1;
          addGap(0, A.x, Math.min(z0, z1) - GAP_PAD, Math.max(z0, z1) + GAP_PAD);
        } else {
          const x0 = A.x + ux * b.d0, x1 = A.x + ux * b.d1;
          addGap(1, A.z, Math.min(x0, x1) - GAP_PAD, Math.max(x0, x1) + GAP_PAD);
        }
      }
    }
  }
  function clipSpan(axis, c, a0, a1, draw) {
    if (a1 < a0) { const t = a0; a0 = a1; a1 = t; }
    if (a1 - a0 < 0.5) return;
    const n = GN[axis];
    if (!n) { draw(a0, a1); return; }
    const C = GC[axis], A0 = G0[axis], A1 = G1[axis];
    let g = 0;
    for (let i = 0; i < n; i++) {
      if (Math.abs(C[i] - c) > 1.5) continue;
      let u0 = A0[i], u1 = A1[i];
      if (u1 <= a0 || u0 >= a1) continue;
      if (u0 < a0) u0 = a0;
      if (u1 > a1) u1 = a1;
      if (g < 24) { GU0[g] = u0; GU1[g] = u1; g++; }
      else {
        if (u0 < GU0[23]) GU0[23] = u0;
        if (u1 > GU1[23]) GU1[23] = u1;
      }
    }
    if (!g) { draw(a0, a1); return; }
    for (let i = 1; i < g; i++) {
      const u0 = GU0[i], u1 = GU1[i];
      let j = i;
      while (j > 0 && GU0[j - 1] > u0) { GU0[j] = GU0[j - 1]; GU1[j] = GU1[j - 1]; j--; }
      GU0[j] = u0; GU1[j] = u1;
    }
    let cursor = a0;
    for (let i = 0; i < g; i++) {
      if (GU0[i] > cursor + 0.5) draw(cursor, GU0[i]);
      if (GU1[i] > cursor) cursor = GU1[i];
    }
    if (a1 > cursor + 0.5) draw(cursor, a1);
  }
  function inGap(axis, c, u) {
    const n = GN[axis], C = GC[axis], A0 = G0[axis], A1 = G1[axis];
    for (let i = 0; i < n; i++) {
      if (Math.abs(C[i] - c) > 1.5) continue;
      if (u >= A0[i] && u <= A1[i]) return true;
    }
    return false;
  }
  buildGaps();
  let cMode = 0, cX = 0, cZ = 0;
  function cDraw(u, v) {
    if (v - u < 0.5) return;
    if (cMode === 0) seg(cX, 0.05, u, cX, 0.05, v);
    else seg(u, 0.05, cZ, v, 0.05, cZ);
  }
  function clipNS(center, x, z0, z1) {
    if (z1 - z0 < 0.5) return;
    cMode = 0; cX = x;
    clipSpan(0, center, z0, z1, cDraw);
  }
  function clipEW(center, z, x0, x1) {
    if (x1 - x0 < 0.5) return;
    cMode = 1; cZ = z;
    clipSpan(1, center, x0, x1, cDraw);
  }

  function snapStreetX(x) {
    const s = x < 0 ? -1 : 1, a = Math.abs(x);
    if (a <= 200) return s * 150;
    const k = Math.round((a - 150) / 100);
    return s * Math.max(150, Math.min(550, 150 + k * 100));
  }
  function snapStreetZ(z) {
    const k = Math.round((z + 300) / 200);
    return Math.max(-300, Math.min(2100, -300 + k * 200));
  }
  function curbNS(center, x, z0, z1, gap0, gap1) {
    if (z0 < gap0) clipNS(center, x, z0, z1 < gap0 ? z1 : gap0);
    if (z1 > gap1) clipNS(center, x, z0 > gap1 ? z0 : gap1, z1);
  }
  function spanX(center, x0, x1, z) {
    if (x0 >= x1) return;
    if (x1 <= -140 || x0 >= 140) clipEW(center, z, x0, x1);
    else {
      if (x0 < -140) clipEW(center, z, x0, x1 < -140 ? x1 : -140);
      if (x1 > 140) clipEW(center, z, x0 > 140 ? x0 : 140, x1);
    }
  }
  function drawRoads() {
    if (!on.lanes && !on.crosswalks && !on.sidewalks) return;
    const sx = snapStreetX(cam.x), sz = snapStreetZ(cam.z);
    const rd = T.roadDist;
    if (dist3(sx, 0, cam.z) < rd + 30 && (on.lanes || on.sidewalks)) {
      ctx.beginPath();
      if (on.lanes) {
        const z0 = cam.z - rd, z1 = cam.z + rd;
        for (let z = z0; z < z1; z += 14) clipNS(sx, sx, z, z + 6);
        ctx.strokeStyle = 'rgba(62,230,255,.7)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      if (on.sidewalks) {
        const z0 = Math.max(-320, cam.z - rd), z1 = Math.min(2120, cam.z + rd);
        const gap0 = sz - 14, gap1 = sz + 14;
        ctx.beginPath();
        curbNS(sx, sx + 9.6, z0, z1, gap0, gap1);
        curbNS(sx, sx - 9.6, z0, z1, gap0, gap1);
        ctx.strokeStyle = 'rgba(255,176,32,.8)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.beginPath();
        curbNS(sx, sx + 12.2, z0, z1, gap0, gap1);
        curbNS(sx, sx - 12.2, z0, z1, gap0, gap1);
        ctx.strokeStyle = 'rgba(62,230,255,.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      stat.roads++;
    }
    if ((on.lanes || on.sidewalks) && dist3(cam.x, 0, sz) < rd + 30) {
      ctx.beginPath();
      if (on.lanes) {
        const x0 = cam.x - rd, x1 = cam.x + rd;
        for (let x = x0; x < x1; x += 14) {
          if (x > -150 && x < 150) continue;
          clipEW(sz, sz, x, Math.min(x + 6, x1));
        }
      }
      ctx.strokeStyle = 'rgba(255,79,216,.65)';
      ctx.lineWidth = 1.3;
      ctx.stroke();
      if (on.sidewalks) {
        const x0 = cam.x - rd, x1 = cam.x + rd, gap0 = sx - 14, gap1 = sx + 14;
        ctx.beginPath();
        if (x0 < gap0) { spanX(sz, x0, x1 < gap0 ? x1 : gap0, sz + 9.6); spanX(sz, x0, x1 < gap0 ? x1 : gap0, sz - 9.6); }
        if (x1 > gap1) { spanX(sz, x0 > gap1 ? x0 : gap1, x1, sz + 9.6); spanX(sz, x0 > gap1 ? x0 : gap1, x1, sz - 9.6); }
        ctx.strokeStyle = 'rgba(255,176,32,.8)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.beginPath();
        if (x0 < gap0) { spanX(sz, x0, x1 < gap0 ? x1 : gap0, sz + 12.2); spanX(sz, x0, x1 < gap0 ? x1 : gap0, sz - 12.2); }
        if (x1 > gap1) { spanX(sz, x0 > gap1 ? x0 : gap1, x1, sz + 12.2); spanX(sz, x0 > gap1 ? x0 : gap1, x1, sz - 12.2); }
        ctx.strokeStyle = 'rgba(62,230,255,.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
    if (on.crosswalks && dist3(sx, 0, sz) < T.crossDist && !inGap(0, sx, sz) && !inGap(1, sz, sx)) {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const o = 10 + i * 2.1;
        seg(sx - 8, 0.06, sz - o, sx + 8, 0.06, sz - o);
        seg(sx - 8, 0.06, sz + o, sx + 8, 0.06, sz + o);
        seg(sx - o, 0.06, sz - 8, sx - o, 0.06, sz + 8);
        seg(sx + o, 0.06, sz - 8, sx + o, 0.06, sz + 8);
      }
      ctx.strokeStyle = 'rgba(255,242,192,.8)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      stat.roads++;
    }
  }
  const GP = new Float32Array(12);
  function drawGrass() {
    if (!on.grass || !nP) return;
    for (let i = 0; i < nP; i++) {
      const x0 = PX0[i], z0 = PZ0[i], x1 = PX1[i], z1 = PZ1[i];
      if (dist3((x0 + x1) / 2, 0, (z0 + z1) / 2) > T.grassDist) continue;
      GP[0] = x0; GP[1] = 0.04; GP[2] = z0;
      GP[3] = x1; GP[4] = 0.04; GP[5] = z0;
      GP[6] = x1; GP[7] = 0.04; GP[8] = z1;
      GP[9] = x0; GP[10] = 0.04; GP[11] = z1;
      ctx.beginPath();
      let ok = true;
      for (let p = 0; p < 4; p++) {
        if (!camPoint(GP[p * 3], GP[p * 3 + 1], GP[p * 3 + 2], A)) { ok = false; break; }
        screenOf(A, SA);
        if (p === 0) ctx.moveTo(SA[0], SA[1]);
        else ctx.lineTo(SA[0], SA[1]);
      }
      if (ok) { ctx.closePath(); ctx.fillStyle = 'rgba(6,26,14,.55)'; ctx.fill(); }
      ctx.beginPath();
      const dx = (x1 - x0) / 3, dz = (z1 - z0) / 3;
      seg(x0 + dx, 0.05, z0, x0 + dx, 0.05, z1);
      seg(x0 + dx * 2, 0.05, z0, x0 + dx * 2, 0.05, z1);
      seg(x0, 0.05, z0 + dz, x1, 0.05, z0 + dz);
      seg(x0, 0.05, z0 + dz * 2, x1, 0.05, z0 + dz * 2);
      seg(x0, 0.05, z0, x1, 0.05, z0);
      seg(x1, 0.05, z0, x1, 0.05, z1);
      seg(x1, 0.05, z1, x0, 0.05, z1);
      seg(x0, 0.05, z1, x0, 0.05, z0);
      ctx.strokeStyle = 'rgba(62,230,255,.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      stat.grass++;
    }
  }
  function drawRiver() {
    if (!on.river || !CITY.RIV) return;
    const R = CITY.RIV, zc = (R.z0 + R.z1) / 2;
    if (dist3(cam.x, 0, zc) > T.riverDist) return;
    const xLo = cam.x - 80, xHi = cam.x + 80;
    ctx.beginPath();
    for (let k = 0; k < 5; k++) {
      const z = R.z0 + 5 + k * ((R.z1 - R.z0 - 10) / 4);
      const shift = (k * 11) % 20;
      const xStart = Math.ceil((xLo - shift) / 20) * 20 + shift;
      for (let x = xStart; x < xHi; x += 20) seg(x, 0.04, z, x + 9, 0.04, z);
    }
    ctx.strokeStyle = 'rgba(255,79,216,.5)';
    ctx.lineWidth = 1.25;
    ctx.stroke();
    ctx.beginPath();
    const a = Math.floor((cam.x - 60) / 40) * 40, b = Math.ceil((cam.x + 60) / 40) * 40;
    for (let k = 0; k < 3; k++) {
      const z = R.z0 + 8 + k * 16;
      seg(a, 0.045, z, b, 0.045, z);
    }
    ctx.strokeStyle = 'rgba(255,176,32,.32)';
    ctx.lineWidth = 1;
    ctx.stroke();
    stat.river = 1;
  }

  const _drawCityGround = drawCityGround;
  drawCityGround = function () {
    beginFrame();
    _drawCityGround();
    if (on.lanes || on.crosswalks || on.sidewalks || on.grass || on.river) {
      drawRoads();
      drawGrass();
      drawRiver();
      clean();
    }
  };

  const SLOTN = 20;
  const slots = new Array(SLOTN);
  const triples = new Array(SLOTN);
  function drawSlot() {
    const k = this.kind, i = this.idx;
    if (k === 1) drawLamp(i);
    else if (k === 2) drawTree(i);
    else if (k === 3) drawSign(i);
  }
  for (let i = 0; i < SLOTN; i++) {
    const o = { kind: 0, idx: 0, draw: drawSlot };
    slots[i] = o;
    triples[i] = [0, 't', o];
  }
  let slotUse = 0;
  function pushSlot(items, d2, kind, idx) {
    if (slotUse >= SLOTN) return;
    const o = slots[slotUse];
    o.kind = kind; o.idx = idx;
    const t = triples[slotUse++];
    t[0] = d2;
    items.push(t);
  }
  const pickI = new Int16Array(8), pickN = { n: 0 };
  const pickD = new Float32Array(8);
  function resetTop(n) {
    pickN.n = 0;
    for (let i = 0; i < n; i++) { pickI[i] = -1; pickD[i] = 1e15; }
  }
  function insertTop(n, idx, d2) {
    if (d2 >= pickD[n - 1]) return;
    let j = n - 1;
    while (j > 0 && d2 < pickD[j - 1]) { pickD[j] = pickD[j - 1]; pickI[j] = pickI[j - 1]; j--; }
    pickD[j] = d2; pickI[j] = idx;
  }
  function scanIdx(head, next, x, z, limit, maxD, fnTake) {
    resetTop(limit);
    const i0 = ((x - OX) / CELL) | 0, j0 = ((z - OZ) / CELL) | 0;
    const max2 = maxD * maxD;
    for (let j = j0 - 1; j <= j0 + 1; j++) {
      if (j < 0 || j >= NZ) continue;
      for (let i = i0 - 1; i <= i0 + 1; i++) {
        if (i < 0 || i >= NX) continue;
        let e = head[j * NX + i];
        while (e >= 0) { fnTake(e, max2, limit); e = next[e]; }
      }
    }
  }
  function takeLight(e, max2, limit) {
    const dx = LX[e] - cam.x, dy = LY[e] - cam.y, dz = LZ[e] - cam.z;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 < max2) insertTop(limit, e, d2);
  }
  function takeTree(e, max2, limit) {
    const dx = TX[e] - cam.x, dy = (TH[e] * 0.5) - cam.y, dz = TZ[e] - cam.z;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 < max2) insertTop(limit, e, d2);
  }
  function blit(img, x, y, z, worldH) {
    if (!camPoint(x, y, z, A)) return;
    screenOf(A, SA);
    const h = FOV / A[2] * worldH;
    if (h < 4) return;
    const w = h * (img.width / img.height);
    ctx.drawImage(img, SA[0] - w * 0.5, SA[1] - h, w, h);
  }
  function drawLamp(i) {
    blit(lampImg, LX[i], LY[i], LZ[i], 7.4);
    stat.lights++;
  }
  function drawTree(i) {
    blit(treeImg, TX[i], 0, TZ[i], TH[i] || 6);
    stat.trees++;
  }
  function drawSign(i) {
    // Billboard, not an affine wall fill. A full-facade transform dropped downtown
    // from 60fps to 27. One capped blit stays in the budget.
    const x = SX[i], y = SgY[i], z = SZ[i];
    if (!camPoint(x, y, z, A)) return;
    screenOf(A, SA);
    const w = Math.min(168, FOV / A[2] * SW[i]);
    if (w < 16) return;
    const h = w * (64 / 256);
    ctx.drawImage(signImgs[STX[i]], SA[0] - w * 0.5, SA[1] - h * 0.5, w, h);
    stat.signs++;
  }

  const _cityItems = cityItems;
  cityItems = function (items) {
    _cityItems(items);
    slotUse = 0;
    if (on.streetlights && nL && cam.y < T.lightDist + 30) {
      const lim = T.lightBudget | 0;
      scanIdx(LHEAD, LNEXT, cam.x, cam.z, lim, T.lightDist, takeLight);
      for (let i = 0; i < lim; i++) if (pickI[i] >= 0) {
        const e = pickI[i];
        const dx = LX[e] - cam.x, dz = LZ[e] - cam.z;
        pushSlot(items, dx * dx + dz * dz, 1, e);
      }
    }
    if (on.trees && nT && cam.y < T.treeDist + 30) {
      const lim = T.treeBudget | 0;
      scanIdx(THEAD, TNEXT, cam.x, cam.z, lim, T.treeDist, takeTree);
      for (let i = 0; i < lim; i++) if (pickI[i] >= 0) {
        const e = pickI[i];
        const dx = TX[e] - cam.x, dz = TZ[e] - cam.z;
        pushSlot(items, dx * dx + dz * dz, 2, e);
      }
    }
    if (on.signs && nS && cam.y < T.signDist + 40) {
      const lim = T.signBudget | 0, max2 = T.signDist * T.signDist;
      resetTop(lim);
      for (let i = 0; i < nS; i++) {
        const dx = SX[i] - cam.x, dy = SgY[i] - cam.y, dz = SZ[i] - cam.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > max2) continue;
        if ((cam.x - SX[i]) * SNX[i] + (cam.z - SZ[i]) * SNZ[i] <= 0.5) continue;
        insertTop(lim, i, d2);
      }
      for (let i = 0; i < lim; i++) if (pickI[i] >= 0) {
        const e = pickI[i];
        const dx = SX[e] - cam.x, dz = SZ[e] - cam.z;
        pushSlot(items, dx * dx + dz * dz, 3, e);
      }
    }
  };

  window.DETAIL = {
    tune: T,
    on: on,
    stat: stat,
    counts: { lights: nL, signs: nS, trees: nT, patches: nP },
    baked: 1,
    clipSpan: clipSpan,
    cruise: function () { return stat.cruise === 1; },
    wallSlots: function (u0, u1) {
      const n = fillSlots(u0, u1), o = [];
      for (let i = 0; i < n; i++) o.push(WSLOT[i]);
      return o;
    },
    gaps: function () { return { ns: GN[0], ew: GN[1] }; }
  };
})();
