'use strict';
// Visual-only night detail for world-split.html. Baked once, drawn with a fixed
// budget, no per-frame allocation. Does not touch collision, roads, or physics.
// Three bands: crawl (ground, under crawlSpeedMax) is close-up inside
// crawlDetailDist; street (ground, up to streetSpeedMax) is the 60fps set;
// rotate and airborne draw nothing. Roof trim and rooftop shapes stay off.
// On-foot eye-level lines (b._footSegs) draw only while WALK_MODE.onFoot.
// Interior room props are not part of that pass. They are built when a front
// door or a garage door actually opens the room, and dropped again on the way out.
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

  const stat = { faces: 0, trims: 0, signs: 0, lights: 0, trees: 0, roads: 0, river: 0, grass: 0, close: 0, cruise: 0, winSegs: 0, segs: 0, band: 2, storefronts: 0, onFoot: 0, footSegs: 0 };
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
    stat.segs++;
    camPoint(x1, y1, z1, A);
    camPoint(x2, y2, z2, B);
    const s = nearSeg(A, B);
    if (!s) return;
    ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]);
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
  const LSKIP = new Uint8Array(MAXL);
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
  let mode = 2, active = false;
  function detailDraw() {
    cacheCam();
    stat.faces = stat.trims = stat.signs = stat.lights = stat.trees = stat.roads = stat.river = stat.grass = stat.winSegs = stat.segs = stat.storefronts = stat.onFoot = stat.footSegs = 0;
    const v = Math.abs(P.v || 0);
    const crawlMax = T.crawlSpeedMax != null ? T.crawlSpeedMax : 12;
    const streetMax = T.streetSpeedMax != null ? T.streetSpeedMax : 48;
    if (!extraOn || !P.ground || v >= streetMax) {
      mode = 2;
      active = false;
      stat.band = 2;
      stat.cruise = 0;
      anyTrim = false;
      anyWin = false;
      return;
    }
    mode = v < crawlMax ? 0 : 1;
    active = true;
    stat.band = mode;
    stat.cruise = mode === 0 ? 1 : 0;
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
    const near = mode === 0 ? (T.crawlDetailDist || 30) : (T.streetWinDist || T.near || 40);
    const mid = T.mid;
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

  // Purpose storefronts. Lines are baked once in world space on b._sfSegs.
  // The frame only projects the camera-facing wall, batched by color.
  const PURPOSES = ['HOME', 'SHOWROOM', 'NEON_PAINT', 'GARAGE', 'NOS', 'DANCE', 'PETS', 'CAFE', 'ARCADE', 'SKY_DROP', 'SOCCER', 'BUILDER'];
  const SFCOL = ['#3ee6ff', '#ff4fd8', '#ffe14d', '#ffb020', '#fff2c0', '#ff2a3d'];
  const SFCAP = 96;
  const SF_N = 6;
  const sfId = new Int16Array(SF_N);
  const sfD = new Float32Array(SF_N);
  const sfSeen = new Uint8Array(SF_N);
  function purposeOf(b) {
    return b.purpose || PURPOSES[(b.id | 0) % 12];
  }
  function shopOk(b) {
    if (!b || skipKind(b) || !b.boxes || !b.boxes.length) return false;
    const q = b.boxes[0];
    if (q.x1 - q.x0 < 8 || q.z1 - q.z0 < 8) return false;
    if (b.purpose) return true;
    const k = b.kind;
    return !k || k === 'b' || k === 'landmark';
  }
  function wantStore() {
    if (!extraOn || T.storefronts === false) return false;
    if (typeof WALK_MODE !== 'undefined' && WALK_MODE && WALK_MODE.onFoot) return true;
    return !!(P && P.driveMode === 'street' && P.ground && Math.abs(P.v || 0) < (T.storefrontMaxSpeed || 12));
  }
  function putSeg(rec, face, col, x1, y1, z1, x2, y2, z2) {
    if (rec.n >= SFCAP) return;
    const o = rec.n * 6, a = rec.xyz;
    a[o] = x1; a[o + 1] = y1; a[o + 2] = z1; a[o + 3] = x2; a[o + 4] = y2; a[o + 5] = z2;
    rec.col[rec.n] = col; rec.face[rec.n] = face; rec.n++;
  }
  function wallL(rec, face, plane, col, u0, y0, u1, y1) {
    if (face < 2) putSeg(rec, face, col, plane, y0, u0, plane, y1, u1);
    else putSeg(rec, face, col, u0, y0, plane, u1, y1, plane);
  }
  function wallR(rec, face, plane, col, u0, y0, u1, y1) {
    wallL(rec, face, plane, col, u0, y0, u1, y0);
    wallL(rec, face, plane, col, u1, y0, u1, y1);
    wallL(rec, face, plane, col, u1, y1, u0, y1);
    wallL(rec, face, plane, col, u0, y1, u0, y0);
  }
  function outPlane(face, plane, extra) {
    return (face === 0 || face === 2) ? plane - extra : plane + extra;
  }
  function motifHome(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, w = Math.min(3.6, (b - a) * 0.22);
    wallR(rec, f, p, 3, mid - w, 0.05, mid + w, 3.1);
    wallL(rec, f, p, 3, mid - w, 0.8, mid + w, 0.8);
    wallL(rec, f, p, 3, mid - w, 1.55, mid + w, 1.55);
    wallL(rec, f, p, 3, mid - w, 2.3, mid + w, 2.3);
    wallL(rec, f, p, 4, mid - w - 1.15, 0.05, mid - w - 1.15, 3.45);
    wallL(rec, f, p, 4, mid + w + 1.15, 0.05, mid + w + 1.15, 3.45);
    wallL(rec, f, p, 4, mid - w - 1.15, 3.45, mid + w + 1.15, 3.45);
    if (mid - w - a > 3.2) wallR(rec, f, p, 0, a + 1.3, 1.15, a + 3.5, 2.85);
  }
  function motifShow(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, h = Math.min(4.2, (b - a) * 0.2);
    wallR(rec, f, p, 0, mid - h - 1.4, 0.2, mid - 0.45, 3.8);
    wallR(rec, f, p, 0, mid + 0.45, 0.2, mid + h + 1.4, 3.8);
    wallL(rec, f, p, 5, mid - h - 1.4, 0.2, mid - 0.45, 1.15);
    wallL(rec, f, p, 5, mid + 0.45, 0.2, mid + h + 1.4, 1.15);
    wallL(rec, f, p, 0, a + 0.6, 4.05, b - 0.6, 4.05);
  }
  function motifPaint(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, h = Math.min(3.4, (b - a) * 0.18);
    wallR(rec, f, p, 1, mid - h - 0.8, 0.3, mid - 0.35, 3.3);
    wallR(rec, f, p, 0, mid + 0.35, 0.3, mid + h + 0.8, 3.3);
    const sw = [1, 0, 2];
    for (let i = 0; i < 3; i++) {
      const u = a + 1.2 + i * ((b - a - 2.4) / 3);
      wallL(rec, f, p, sw[i], u, 3.5, u + 1.15, 4.25);
    }
  }
  function motifGarage(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, w = Math.min(3.2, (b - a) * 0.16);
    const doors = [[mid - w - 0.35, mid - 0.3], [mid + 0.3, mid + w + 0.35]];
    for (let d = 0; d < 2; d++) {
      const u0 = doors[d][0], u1 = doors[d][1];
      wallR(rec, f, p, 3, u0, 0.05, u1, 3.2);
      wallL(rec, f, p, 3, u0, 1.05, u1, 1.05);
      wallL(rec, f, p, 3, u0, 2.1, u1, 2.1);
    }
    const pp = outPlane(f, p, 0.55);
    wallL(rec, f, pp, 2, mid - w - 1.5, 0.1, mid - w - 1.5, 1.55);
    wallL(rec, f, pp, 2, mid - w - 1.5, 1.55, mid - w - 0.7, 0.85);
    wallL(rec, f, pp, 2, mid + w + 1.5, 0.1, mid + w + 1.5, 1.55);
    wallL(rec, f, pp, 2, mid + w + 1.5, 1.55, mid + w + 0.7, 0.85);
  }
  function motifNos(rec, f, p, a, b) {
    wallL(rec, f, p, 0, a + 0.5, 3.3, b - 0.5, 3.3);
    wallL(rec, f, p, 1, a + 0.5, 3.72, b - 0.5, 3.72);
    wallL(rec, f, p, 0, a + 0.5, 3.3, a + 0.5, 3.72);
    wallL(rec, f, p, 0, b - 0.5, 3.3, b - 0.5, 3.72);
    const mid = (a + b) * 0.5, pp = outPlane(f, p, 0.75);
    for (let i = -1; i <= 1; i++) {
      const u = mid + i * Math.min(2.1, (b - a) * 0.12);
      wallL(rec, f, pp, 2, u, 0.05, u, 1.45);
      wallL(rec, f, pp, 1, u - 0.32, 1.45, u + 0.32, 1.45);
    }
  }
  function motifDance(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, h = Math.min(3.6, (b - a) * 0.2);
    wallR(rec, f, p, 1, mid - h, 0.4, mid + h, 3.15);
    const ht = [1.1, 2.1, 1.5, 2.45, 1.25];
    for (let i = 0; i < 5; i++) {
      const u = mid - h + 0.7 + i * ((h * 2 - 1.4) / 4);
      wallL(rec, f, p, i % 2 ? 0 : 1, u, 0.6, u, 0.6 + ht[i]);
    }
    const pp = outPlane(f, p, 0.65);
    wallL(rec, f, pp, 5, mid - 1.2, 0.05, mid - 1.2, 1.1);
    wallL(rec, f, pp, 5, mid + 1.2, 0.05, mid + 1.2, 1.1);
    wallL(rec, f, pp, 1, mid - 1.2, 1.02, mid + 1.2, 1.02);
  }
  function motifPets(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, h = Math.min(3.2, (b - a) * 0.16);
    wallR(rec, f, p, 0, mid - h - 0.5, 0.4, mid - 0.35, 2.55);
    wallR(rec, f, p, 0, mid + 0.35, 0.4, mid + h + 0.5, 2.55);
    wallL(rec, f, p, 2, mid - h - 0.5, 2.55, mid - h * 0.5 - 0.4, 3.25);
    wallL(rec, f, p, 2, mid - h * 0.5 - 0.4, 3.25, mid - 0.35, 2.55);
    wallL(rec, f, p, 2, mid + 0.35, 2.55, mid + h * 0.5 + 0.4, 3.25);
    wallL(rec, f, p, 2, mid + h * 0.5 + 0.4, 3.25, mid + h + 0.5, 2.55);
    const pp = outPlane(f, p, 0.6);
    wallL(rec, f, pp, 4, a + 0.8, 0.7, b - 0.8, 0.7);
    wallL(rec, f, pp, 4, a + 0.8, 0.32, b - 0.8, 0.32);
    wallL(rec, f, pp, 2, a + 1.4, 0.05, a + 1.4, 0.7);
    wallL(rec, f, pp, 2, b - 1.4, 0.05, b - 1.4, 0.7);
  }
  function motifCafe(rec, f, p, a, b) {
    const mid = (a + b) * 0.5;
    wallL(rec, f, p, 1, a + 0.7, 3.15, b - 0.7, 3.15);
    for (let i = 0; i < 4; i++) {
      const u = a + 1.1 + i * ((b - a - 2.2) / 3);
      wallL(rec, f, p, i % 2 ? 2 : 1, u, 2.5, u, 3.15);
    }
    wallR(rec, f, p, 0, mid + 1.2, 1.05, mid + 3.1, 2.55);
    const pp = outPlane(f, p, 1.05);
    wallL(rec, f, pp, 4, mid - 2.6, 0.05, mid - 2.6, 1.65);
    wallL(rec, f, pp, 2, mid - 3.5, 1.65, mid - 2.6, 2.15);
    wallL(rec, f, pp, 2, mid - 2.6, 2.15, mid - 1.7, 1.65);
    wallL(rec, f, pp, 4, mid + 2.2, 0.05, mid + 2.2, 1.65);
    wallL(rec, f, pp, 2, mid + 1.3, 1.65, mid + 2.2, 2.15);
    wallL(rec, f, pp, 2, mid + 2.2, 2.15, mid + 3.1, 1.65);
  }
  function motifArcade(rec, f, p, a, b) {
    wallR(rec, f, p, 1, a + 0.6, 3.2, b - 0.6, 4.2);
    for (let i = 1; i <= 4; i++) {
      const u = a + 0.6 + (b - a - 1.2) * i / 5;
      wallL(rec, f, p, 0, u, 3.2, u, 4.2);
    }
    const mid = (a + b) * 0.5;
    wallR(rec, f, p, 5, mid - 3.2, 0.4, mid - 1.15, 2.15);
    wallL(rec, f, p, 0, mid - 2.95, 1.45, mid - 1.4, 1.45);
    wallR(rec, f, p, 5, mid + 1.15, 0.4, mid + 3.2, 2.15);
    wallL(rec, f, p, 1, mid + 1.4, 1.45, mid + 2.95, 1.45);
  }
  function motifSky(rec, f, p, a, b, q) {
    const mid = (a + b) * 0.5, top = Math.min((q.y1 || 8) - 0.3, 12);
    wallL(rec, f, p, 0, mid - 0.5, 0.2, mid - 0.5, top);
    wallL(rec, f, p, 0, mid + 0.5, 0.2, mid + 0.5, top);
    wallL(rec, f, p, 0, mid - 0.5, top * 0.45, mid + 0.5, top * 0.45);
    wallL(rec, f, p, 0, mid - 0.5, top * 0.75, mid + 0.5, top * 0.75);
    wallL(rec, f, p, 2, mid - 1.7, 0.12, mid - 1.7, 2.7);
    wallL(rec, f, p, 2, mid + 1.7, 0.12, mid + 1.7, 2.7);
    wallL(rec, f, p, 2, mid - 1.7, 2.15, mid, 3.15);
    wallL(rec, f, p, 2, mid, 3.15, mid + 1.7, 2.15);
  }
  function motifSoccer(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, h = Math.min(3.4, (b - a) * 0.16);
    function net(u0, u1) {
      wallR(rec, f, p, 4, u0, 0.4, u1, 2.75);
      wallL(rec, f, p, 0, (u0 + u1) * 0.5, 0.4, (u0 + u1) * 0.5, 2.75);
      wallL(rec, f, p, 0, u0, 1.55, u1, 1.55);
    }
    net(mid - h - 0.4, mid - 0.3);
    net(mid + 0.3, mid + h + 0.4);
    for (let i = 0; i < 3; i++) {
      const u = a + (b - a) * (i + 1) / 4;
      const col = i === 1 ? 1 : 2;
      wallL(rec, f, p, col, u, 3.8, u + 0.65, 3.35);
      wallL(rec, f, p, col, u + 0.65, 3.35, u, 2.95);
    }
  }
  function motifBuilder(rec, f, p, a, b) {
    const mid = (a + b) * 0.5, h = Math.min(3.6, (b - a) * 0.18);
    function panel(u0, u1) {
      wallR(rec, f, p, 0, u0, 0.75, u1, 3.35);
      wallL(rec, f, p, 0, (u0 + u1) * 0.5, 0.75, (u0 + u1) * 0.5, 3.35);
      wallL(rec, f, p, 0, u0, 2.05, u1, 2.05);
    }
    panel(mid - h - 0.45, mid - 0.4);
    panel(mid + 0.4, mid + h + 0.45);
    function cube(u, y) {
      wallL(rec, f, p, 5, u, y, u + 0.7, y);
      wallL(rec, f, p, 5, u + 0.7, y, u + 0.7, y + 0.7);
      wallL(rec, f, p, 5, u, y + 0.7, u + 0.7, y + 0.7);
    }
    cube(mid - 1.35, 0.25);
    cube(mid - 1.35, 1.1);
    cube(mid + 0.65, 0.25);
  }
  const MOTIF = {
    HOME: motifHome, SHOWROOM: motifShow, NEON_PAINT: motifPaint, GARAGE: motifGarage,
    NOS: motifNos, DANCE: motifDance, PETS: motifPets, CAFE: motifCafe,
    ARCADE: motifArcade, SKY_DROP: motifSky, SOCCER: motifSoccer, BUILDER: motifBuilder
  };
  function bakeStore(b) {
    if (b._sfSegs) return b._sfSegs;
    const rec = { n: 0, xyz: new Float32Array(SFCAP * 6), col: new Uint8Array(SFCAP), face: new Uint8Array(SFCAP) };
    const q = b.boxes[0];
    const fn = MOTIF[purposeOf(b)] || motifHome;
    for (let f = 0; f < 4; f++) {
      const a = f < 2 ? q.z0 : q.x0, b1 = f < 2 ? q.z1 : q.x1;
      if (b1 - a < 7) continue;
      let plane = q.x0 - 0.18;
      if (f === 1) plane = q.x1 + 0.18;
      else if (f === 2) plane = q.z0 - 0.18;
      else if (f === 3) plane = q.z1 + 0.18;
      fn(rec, f, plane, a, b1, q);
    }
    b._sfSegs = rec;
    return rec;
  }
  function faceOn(face, q) {
    if (face === 0) return cam.x < q.x0 - 0.4;
    if (face === 1) return cam.x > q.x1 + 0.4;
    if (face === 2) return cam.z < q.z0 - 0.4;
    return cam.z > q.z1 + 0.4;
  }
  function storefrontPass(cx, cz) {
    stat.storefronts = 0;
    if (!wantStore()) return;
    for (let i = 0; i < SF_N; i++) { sfId[i] = -1; sfD[i] = 1e9; sfSeen[i] = 0; }
    const dist = T.storefrontDist || 48;
    for (let i = 0; i < BL.length; i++) {
      const b = BL[i];
      if (!shopOk(b)) continue;
      const d = boxDist(b);
      if (d > dist || d >= sfD[SF_N - 1]) continue;
      let j = SF_N - 1;
      while (j > 0 && d < sfD[j - 1]) { sfD[j] = sfD[j - 1]; sfId[j] = sfId[j - 1]; j--; }
      sfD[j] = d; sfId[j] = i;
    }
    let left = (T.storefrontMaxSegs | 0) || 260;
    if (left < 1) return;
    let drew = 0;
    ctx.save();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.94;
    ctx.lineWidth = 1.7;
    for (let c = 0; c < SFCOL.length; c++) {
      ctx.beginPath();
      let any = false;
      for (let k = 0; k < SF_N && left > 0; k++) {
        const bi = sfId[k];
        if (bi < 0) continue;
        const b = BL[bi], q = b.boxes[0], rec = bakeStore(b), xyz = rec.xyz;
        for (let s = 0; s < rec.n && left > 0; s++) {
          if (rec.col[s] !== c || !faceOn(rec.face[s], q)) continue;
          const o = s * 6;
          seg(xyz[o], xyz[o + 1], xyz[o + 2], xyz[o + 3], xyz[o + 4], xyz[o + 5]);
          any = true;
          left--;
          if (!sfSeen[k]) { sfSeen[k] = 1; drew++; }
        }
      }
      if (any) { ctx.strokeStyle = SFCOL[c]; ctx.stroke(); }
    }
    ctx.restore();
    stat.storefronts = drew;
  }

  // Tier 3: eye-level micro-detail. Baked once per shop into b._footSegs, and only
  // while someone is actually on foot. Driving never scans buildings or allocates.
  const FOOTCAP = 176;
  const FOOT_GEN = 2;
  const FOOT_N = 4;
  const footId = new Int16Array(FOOT_N);
  const footD = new Float32Array(FOOT_N);
  const footSeen = new Uint8Array(FOOT_N);
  let footOx = 1e9, footOz = 1e9, footHold = 99;
  function fput(rec, col, x1, y1, z1, x2, y2, z2) {
    if (rec.n >= FOOTCAP) return;
    const o = rec.n * 6, a = rec.xyz;
    a[o] = x1; a[o + 1] = y1; a[o + 2] = z1;
    a[o + 3] = x2; a[o + 4] = y2; a[o + 5] = z2;
    rec.col[rec.n++] = col;
  }
  function footBasis(b) {
    const d = b.doors && b.doors[0];
    if (!d || !b.boxes || !b.boxes.length) return null;
    let nx = d[2] || 0, nz = d[3] || 0;
    const len = Math.hypot(nx, nz) || 1;
    nx /= len; nz /= len;
    const tx = -nz, tz = nx, q = b.boxes[0];
    let s0, s1;
    if (nz < -0.5) { s0 = q.x0 - d[0]; s1 = q.x1 - d[0]; }
    else if (nz > 0.5) { s0 = d[0] - q.x1; s1 = d[0] - q.x0; }
    else if (nx < -0.5) { s0 = d[1] - q.z1; s1 = d[1] - q.z0; }
    else { s0 = q.z0 - d[1]; s1 = q.z1 - d[1]; }
    if (s0 > s1) { const t = s0; s0 = s1; s1 = t; }
    if (s0 < -8) s0 = -8;
    if (s1 > 8) s1 = 8;
    if (s1 - s0 < 2.4) return null;
    return { x: d[0], z: d[1], nx: nx, nz: nz, tx: tx, tz: tz, s0: s0, s1: s1 };
  }
  function fl(rec, B, col, s1, o1, y1, s2, o2, y2) {
    fput(rec, col,
      B.x + B.tx * s1 + B.nx * o1, y1, B.z + B.tz * s1 + B.nz * o1,
      B.x + B.tx * s2 + B.nx * o2, y2, B.z + B.tz * s2 + B.nz * o2);
  }
  function frect(rec, B, col, s0, o, y0, s1, o1, y1) {
    fl(rec, B, col, s0, o, y0, s1, o1, y0);
    fl(rec, B, col, s1, o1, y0, s1, o1, y1);
    fl(rec, B, col, s1, o1, y1, s0, o, y1);
    fl(rec, B, col, s0, o, y1, s0, o, y0);
  }
  function fflat(rec, B, col, s0, o0, s1, o1, y) {
    fl(rec, B, col, s0, o0, y, s1, o0, y);
    fl(rec, B, col, s1, o0, y, s1, o1, y);
    fl(rec, B, col, s1, o1, y, s0, o1, y);
    fl(rec, B, col, s0, o1, y, s0, o0, y);
  }
  function fbox(rec, B, col, s0, o0, y0, s1, o1, y1) {
    frect(rec, B, col, s0, o0, y0, s1, o0, y1);
    frect(rec, B, col, s0, o1, y0, s1, o1, y1);
    fl(rec, B, col, s0, o0, y0, s0, o1, y0);
    fl(rec, B, col, s1, o0, y0, s1, o1, y0);
    fl(rec, B, col, s0, o0, y1, s0, o1, y1);
    fl(rec, B, col, s1, o0, y1, s1, o1, y1);
  }
  function diaWall(rec, B, col, sc, oc, yc, rs, ry) {
    fl(rec, B, col, sc - rs, oc, yc, sc, oc, yc + ry);
    fl(rec, B, col, sc, oc, yc + ry, sc + rs, oc, yc);
    fl(rec, B, col, sc + rs, oc, yc, sc, oc, yc - ry);
    fl(rec, B, col, sc, oc, yc - ry, sc - rs, oc, yc);
  }
  function diaFace(rec, B, col, s, oc, yc, ro, ry) {
    fl(rec, B, col, s, oc - ro, yc, s, oc, yc + ry);
    fl(rec, B, col, s, oc, yc + ry, s, oc + ro, yc);
    fl(rec, B, col, s, oc + ro, yc, s, oc, yc - ry);
    fl(rec, B, col, s, oc, yc - ry, s, oc - ro, yc);
  }
  function ringFlat(rec, B, col, sc, oc, y, rad, n) {
    let ps = sc + rad, po = oc;
    for (let i = 1; i <= n; i++) {
      const a = i / n * Math.PI * 2;
      const ss = sc + Math.cos(a) * rad, oo = oc + Math.sin(a) * rad;
      fl(rec, B, col, ps, po, y, ss, oo, y);
      ps = ss; po = oo;
    }
  }
  function ringWall(rec, B, col, sc, oc, yc, rad, n) {
    let ps = sc + rad, py = yc;
    for (let i = 1; i <= n; i++) {
      const a = i / n * Math.PI * 2;
      const ss = sc + Math.cos(a) * rad, yy = yc + Math.sin(a) * rad;
      fl(rec, B, col, ps, oc, py, ss, oc, yy);
      ps = ss; py = yy;
    }
  }
  function bakeApron(rec, B) {
    const y = 0.04, curb = 0.08;
    fl(rec, B, 0, B.s0, 0.2, y, B.s1, 0.2, y);
    fl(rec, B, 0, B.s0, 1.8, y, B.s1, 1.8, y);
    fl(rec, B, 2, B.s0, 3.6, curb, B.s1, 3.6, curb);
    fl(rec, B, 2, B.s0, 3.6, 0.03, B.s1, 3.6, 0.03);
    fl(rec, B, 0, B.s0, 0.2, y, B.s0, 3.6, curb);
    fl(rec, B, 0, B.s1, 0.2, y, B.s1, 3.6, curb);
    for (let u = Math.ceil((B.s0 + 0.05) / 4) * 4; u < B.s1 - 0.05; u += 4) {
      if (u > -1.35 && u < 1.35) continue;
      fl(rec, B, 0, u, 0.2, y, u, 3.6, curb);
    }
  }
  function bakeMat(rec, B) {
    const y = 0.075;
    fflat(rec, B, 1, -1.3, 0.35, 1.3, 1.95, y);
    fflat(rec, B, 2, -1.02, 0.58, 1.02, 1.68, 0.082);
    fl(rec, B, 1, -0.72, 1.52, y, 0, 0.62, y);
    fl(rec, B, 1, 0.72, 1.52, y, 0, 0.62, y);
    fl(rec, B, 2, -0.38, 1.28, y, 0, 0.82, y);
    fl(rec, B, 2, 0.38, 1.28, y, 0, 0.82, y);
    fl(rec, B, 1, -0.7, 0.12, 0.08, 0.7, 0.12, 0.08);
  }
  function parkXZ(b) {
    const p = b.parking;
    if (!p) return null;
    if (typeof p.x === 'number' && typeof p.z === 'number') return [p.x, p.z];
    const door = p.door || p;
    if (door && typeof door.length === 'number' && door.length >= 2 && typeof door[0] === 'number' && typeof door[1] === 'number') return [door[0], door[1]];
    if (b.doors && b.doors[1]) return [b.doors[1][0], b.doors[1][1]];
    return null;
  }
  function bakePark(rec, B, b) {
    const p = parkXZ(b);
    if (!p) return;
    const dx = p[0] - B.x, dz = p[1] - B.z;
    const ps = dx * B.tx + dz * B.tz;
    const po = dx * B.nx + dz * B.nz;
    const y = 0.06, o = 2.55;
    fl(rec, B, 1, 0, 1.95, y, 0, o, y);
    fl(rec, B, 1, 0, o, y, ps, o, y);
    fl(rec, B, 2, ps, o, y, ps, po > o ? o : (po < 0.2 ? 0.2 : po), y);
    fl(rec, B, 1, -0.35, o, y, 0.35, o, y);
  }
  function flank(B, sign) {
    const edge = sign < 0 ? B.s0 + 0.75 : B.s1 - 0.75;
    let s = 4.8 * sign;
    if (sign < 0 && s < edge) s = edge;
    if (sign > 0 && s > edge) s = edge;
    if (Math.abs(s) < 2.05) return 0;
    return s;
  }
  function bakePlanter(rec, B, s, lamp) {
    const s0 = s - 0.38, s1 = s + 0.38, o0 = 0.72, o1 = 1.48;
    fl(rec, B, 0, s0, o0, 0.02, s0, o0, 0.58);
    fl(rec, B, 0, s1, o0, 0.02, s1, o0, 0.58);
    fl(rec, B, 0, s0, o1, 0.02, s0, o1, 0.58);
    fl(rec, B, 0, s1, o1, 0.02, s1, o1, 0.58);
    fflat(rec, B, 0, s0, o0, s1, o1, 0.58);
    if (lamp) return;
    fl(rec, B, 2, s, 1.1, 0.58, s - 0.45, 0.62, 2.15);
    fl(rec, B, 2, s, 1.1, 0.58, s + 0.42, 0.68, 2.05);
    fl(rec, B, 1, s, 1.1, 0.58, s, 1.62, 2.25);
    fl(rec, B, 2, s, 1.1, 0.58, s - 0.22, 1.35, 1.72);
    fl(rec, B, 1, s, 1.1, 0.58, s + 0.2, 1.28, 1.78);
  }
  function bakeLamp(rec, B, s) {
    fl(rec, B, 3, s, 1.1, 0.58, s, 1.1, 3.2);
    fl(rec, B, 3, s, 1.1, 3.2, s, 0.32, 3.02);
    fl(rec, B, 2, s, 0.32, 3.02, s, 0.32, 2.48);
    frect(rec, B, 4, s - 0.22, 0.32, 2.28, s + 0.22, 0.32, 2.72);
    fl(rec, B, 2, s - 0.12, 0.32, 2.38, s + 0.12, 0.32, 2.62);
  }
  function bladeS(B) {
    if (B.s1 >= 3.4) return 2.8;
    if (-B.s0 >= 3.4) return -2.8;
    if (B.s1 >= -B.s0 && B.s1 > 2.1) return B.s1 - 0.45;
    if (-B.s0 > 2.1) return B.s0 + 0.45;
    return 0;
  }
  function bayOf(B, bs) {
    const left = -B.s0, right = B.s1;
    const onRight = bs >= 0;
    let sign;
    if (onRight && left > 2.3) sign = -1;
    else if (!onRight && right > 2.3) sign = 1;
    else if (left >= right) sign = -1;
    else sign = 1;
    const room = sign < 0 ? left : right;
    const inner = 1.7;
    const outer = Math.min(room - 0.4, 4.35);
    if (outer < inner + 1.3) return null;
    if (sign < 0) return { s0: -outer, s1: -inner };
    return { s0: inner, s1: outer };
  }
  function bladeMark(rec, B, s, purpose) {
    diaFace(rec, B, 2, s, 1.0, 4.1, 0.5, 0.5);
    if (purpose === 'DANCE') {
      fl(rec, B, 1, s, 0.68, 4.1, s, 1.32, 4.1);
      fl(rec, B, 1, s, 1.0, 3.72, s, 1.0, 4.48);
    } else if (purpose === 'CAFE') {
      fl(rec, B, 3, s, 0.72, 3.82, s, 1.0, 4.32);
      fl(rec, B, 3, s, 1.28, 3.82, s, 1.0, 4.32);
    } else if (purpose === 'HOME') {
      fl(rec, B, 4, s, 0.7, 3.85, s, 1.0, 4.38);
      fl(rec, B, 4, s, 1.3, 3.85, s, 1.0, 4.38);
    } else if (purpose === 'GARAGE' || purpose === 'SHOWROOM') {
      fl(rec, B, 5, s, 0.7, 3.78, s, 1.3, 4.05);
      fl(rec, B, 5, s, 0.7, 4.32, s, 1.3, 4.05);
    } else if (purpose === 'PETS') {
      fl(rec, B, 1, s, 0.75, 3.95, s, 1.0, 4.35);
      fl(rec, B, 1, s, 1.25, 3.95, s, 1.0, 4.35);
    } else if (purpose === 'ARCADE') {
      fl(rec, B, 0, s, 1.0, 3.75, s, 1.0, 4.35);
      fl(rec, B, 0, s, 0.78, 3.78, s, 1.22, 3.78);
    } else if (purpose === 'NEON_PAINT') {
      fl(rec, B, 1, s, 0.72, 3.78, s, 1.05, 4.4);
      fl(rec, B, 0, s, 1.28, 3.78, s, 0.95, 4.4);
    } else if (purpose === 'NOS') {
      fl(rec, B, 5, s, 0.82, 3.75, s, 0.95, 4.4);
      fl(rec, B, 5, s, 1.18, 3.75, s, 1.05, 4.4);
    } else if (purpose === 'SKY_DROP') {
      fl(rec, B, 0, s, 0.72, 4.32, s, 1.0, 3.75);
      fl(rec, B, 0, s, 1.28, 4.32, s, 1.0, 3.75);
    } else if (purpose === 'SOCCER') {
      fl(rec, B, 4, s, 0.72, 4.28, s, 1.28, 4.28);
      fl(rec, B, 4, s, 0.78, 3.75, s, 0.78, 4.28);
    } else if (purpose === 'BUILDER') {
      fl(rec, B, 3, s, 0.72, 3.85, s, 1.28, 3.85);
      fl(rec, B, 3, s, 0.72, 4.25, s, 1.28, 4.25);
    } else {
      fl(rec, B, 1, s, 0.75, 3.8, s, 1.25, 4.4);
      fl(rec, B, 1, s, 1.25, 3.8, s, 0.75, 4.4);
    }
  }
  function bakeBlade(rec, B, purpose) {
    const s = bladeS(B);
    if (!s) return 0;
    const side = s > 0 ? 1 : -1;
    const s0 = s - 0.06 * side, s1 = s + 0.06 * side;
    fl(rec, B, 3, s, 0.02, 3.48, s, 0.5, 3.48);
    fl(rec, B, 3, s, 0.02, 4.72, s, 0.5, 4.72);
    fbox(rec, B, 0, Math.min(s0, s1), 0.15, 3.4, Math.max(s0, s1), 1.85, 4.8);
    bladeMark(rec, B, s0, purpose);
    return s;
  }
  function footDance(rec, B, bay) {
    const s0 = bay.s0, s1 = bay.s1, mid = (s0 + s1) * 0.5;
    frect(rec, B, 1, s0, -1.12, 0.4, s1, -1.12, 3.15);
    fl(rec, B, 1, mid, -1.12, 0.4, mid, -1.12, 3.15);
    fl(rec, B, 2, s0, -0.42, 1.1, s1, -0.42, 1.1);
    fl(rec, B, 2, s0 + 0.12, -0.42, 1.1, s0 + 0.12, -0.16, 0.78);
    fl(rec, B, 2, s1 - 0.12, -0.42, 1.1, s1 - 0.12, -0.16, 0.78);
    fl(rec, B, 0, s0, -0.32, 3.12, s1, -0.32, 3.12);
    fl(rec, B, 0, s0, -1.02, 3.12, s1, -1.02, 3.12);
    fl(rec, B, 0, s0, -0.32, 3.12, s0, -1.02, 3.12);
    fl(rec, B, 0, s1, -0.32, 3.12, s1, -1.02, 3.12);
    fl(rec, B, 0, mid, -0.32, 3.12, mid, -1.02, 3.12);
    for (let i = 0; i < 4; i++) {
      const s = s0 + (s1 - s0) * (i + 0.5) / 4;
      fl(rec, B, 3, s, -0.68, 3.12, s - 0.16, -0.46, 2.32);
      fl(rec, B, 3, s, -0.68, 3.12, s + 0.16, -0.46, 2.32);
    }
    const w = Math.min(0.48, (s1 - s0) * 0.2);
    frect(rec, B, 5, s0, -0.38, 0.18, s0 + w, -0.38, 1.02);
    frect(rec, B, 5, s1 - w, -0.38, 0.18, s1, -0.38, 1.02);
    fl(rec, B, 5, s0, -0.38, 1.02, s0, -0.72, 1.02);
    fl(rec, B, 5, s0 + w, -0.38, 1.02, s0 + w, -0.72, 1.02);
  }
  function footCafe(rec, B, bay) {
    const s0 = bay.s0, s1 = bay.s1, span = s1 - s0, cs = s0 + span * 0.46;
    fl(rec, B, 4, s0, -0.32, 1.02, cs, -0.32, 1.02);
    fl(rec, B, 4, s0, -0.78, 1.02, cs, -0.78, 1.02);
    fl(rec, B, 4, s0, -0.32, 0.4, s0, -0.32, 1.02);
    fl(rec, B, 4, cs, -0.32, 0.4, cs, -0.32, 1.02);
    const e0 = s0 + 0.12, e1 = s0 + span * 0.3;
    frect(rec, B, 3, e0, -0.5, 1.02, e1, -0.5, 1.7);
    fl(rec, B, 2, (e0 + e1) * 0.5, -0.5, 1.7, (e0 + e1) * 0.5, -0.5, 2.08);
    fl(rec, B, 5, e1, -0.5, 1.32, e1 + 0.26, -0.5, 1.18);
    frect(rec, B, 4, s0, -0.18, 1.92, cs, -0.18, 2.95);
    fl(rec, B, 1, s0 + 0.08, -0.18, 2.18, cs - 0.08, -0.18, 2.18);
    fl(rec, B, 1, s0 + 0.08, -0.18, 2.44, cs - 0.08, -0.18, 2.44);
    fl(rec, B, 1, s0 + 0.08, -0.18, 2.7, cs - 0.08, -0.18, 2.7);
    const t0 = s0 + span * 0.52, t1 = s1 - 0.08;
    fflat(rec, B, 0, t0, -0.42, t1, -1.02, 0.76);
    fl(rec, B, 0, t0 + 0.1, -0.52, 0.22, t0 + 0.1, -0.52, 0.76);
    fl(rec, B, 0, t1 - 0.1, -0.92, 0.22, t1 - 0.1, -0.92, 0.76);
    fl(rec, B, 2, t0 + 0.02, -0.52, 0.5, t0 + 0.24, -0.52, 0.5);
    fl(rec, B, 2, t1 - 0.24, -0.92, 0.5, t1 - 0.02, -0.92, 0.5);
    const pc = (t0 + t1) * 0.5;
    fl(rec, B, 2, pc - 0.22, -0.68, 2.65, pc - 0.22, -0.68, 1.62);
    fl(rec, B, 2, pc + 0.22, -0.68, 2.65, pc + 0.22, -0.68, 1.62);
    fl(rec, B, 3, pc - 0.4, -0.68, 1.55, pc - 0.22, -0.68, 1.88);
    fl(rec, B, 3, pc - 0.04, -0.68, 1.55, pc - 0.22, -0.68, 1.88);
    fl(rec, B, 3, pc + 0.04, -0.68, 1.55, pc + 0.22, -0.68, 1.88);
    fl(rec, B, 3, pc + 0.4, -0.68, 1.55, pc + 0.22, -0.68, 1.88);
  }
  function footPets(rec, B, bay) {
    const s0 = bay.s0, s1 = bay.s1, mid = (s0 + s1) * 0.5;
    const rad = Math.min(0.62, (s1 - s0) * 0.22);
    ringFlat(rec, B, 1, mid, -0.72, 0.1, rad, 8);
    ringFlat(rec, B, 4, mid, -0.72, 0.16, rad * 0.55, 8);
    ringWall(rec, B, 0, s0 + (s1 - s0) * 0.22, -0.7, 1.25, 0.48, 8);
    const bs = s1 - (s1 - s0) * 0.24;
    fl(rec, B, 2, bs - 0.42, -0.48, 0.32, bs + 0.42, -0.48, 0.32);
    fl(rec, B, 2, bs - 0.42, -0.48, 0.08, bs - 0.42, -0.48, 0.32);
    fl(rec, B, 2, bs + 0.42, -0.48, 0.08, bs + 0.42, -0.48, 0.32);
    ringFlat(rec, B, 0, bs - 0.2, -0.48, 0.4, 0.14, 6);
    ringFlat(rec, B, 1, bs + 0.2, -0.48, 0.4, 0.14, 6);
    fl(rec, B, 2, s0 + 0.2, -0.3, 2.7, s0 + 0.2, -0.3, 2.15);
    diaWall(rec, B, 2, s0 + 0.2, -0.3, 1.95, 0.16, 0.16);
    fl(rec, B, 1, s1 - 0.15, -0.3, 2.55, s1 - 0.15, -0.3, 2.05);
    diaWall(rec, B, 1, s1 - 0.15, -0.3, 1.85, 0.16, 0.16);
  }
  function footGarage(rec, B, bay) {
    const s0 = bay.s0, s1 = bay.s1, span = s1 - s0;
    const c1 = s0 + span * 0.42;
    frect(rec, B, 5, s0, -0.4, 0.2, c1, -0.4, 1.55);
    for (let i = 1; i <= 5; i++) {
      const y = 0.2 + (1.35 * i) / 6;
      fl(rec, B, 5, s0, -0.4, y, c1, -0.4, y);
    }
    fl(rec, B, 3, s0, -0.4, 1.55, s0, -0.75, 1.55);
    fl(rec, B, 3, c1, -0.4, 1.55, c1, -0.75, 1.55);
    const rail = s0 + span * 0.08;
    fl(rec, B, 0, rail, -0.22, 2.55, s1, -0.22, 2.55);
    for (let i = 0; i < 4; i++) {
      const s = rail + (s1 - rail) * (i + 0.5) / 4;
      diaWall(rec, B, 2, s, -0.22, 2.05, 0.2, 0.26);
    }
    const lp = s0 + span * 0.15;
    fl(rec, B, 0, lp, -0.85, 0.2, lp, -0.85, 2.35);
    fl(rec, B, 0, lp + span * 0.55, -0.85, 0.2, lp + span * 0.55, -0.85, 2.35);
    fl(rec, B, 3, lp, -0.85, 2.15, lp + span * 0.55, -0.85, 2.15);
    fl(rec, B, 3, lp, -0.85, 1.15, lp + 0.35, -0.45, 1.15);
    const ps = s1 - 0.28;
    frect(rec, B, 4, ps - 0.22, -0.35, 0.9, ps + 0.22, -0.35, 1.45);
    fl(rec, B, 2, ps, -0.35, 1.45, ps, -0.35, 1.85);
  }
  function footPaint(rec, B, bay) {
    const span = bay.s1 - bay.s0, s0 = bay.s0, s1 = bay.s0 + span * 0.52, o = -0.48;
    fl(rec, B, 0, s0, o, 0.45, s0, o, 2.55);
    fl(rec, B, 0, s1, o, 0.45, s1, o, 2.55);
    const cans = [5, 1, 0, 2];
    for (let r = 0; r < 3; r++) {
      const y = 0.72 + r * 0.68;
      fl(rec, B, 4, s0, o, y, s1, o, y);
      for (let c = 0; c < 4; c++) {
        const s = s0 + (s1 - s0) * (c + 0.5) / 4;
        fl(rec, B, cans[c], s, o, y, s, o, y + 0.4);
      }
    }
    const ws = bay.s1 - span * 0.22;
    ringWall(rec, B, 1, ws, -0.32, 2.15, 0.46, 8);
    fl(rec, B, 2, ws - 0.22, -0.32, 2.15, ws + 0.22, -0.32, 2.15);
    fl(rec, B, 0, ws, -0.32, 1.92, ws, -0.32, 2.38);
    const es = (bay.s0 + bay.s1) * 0.5;
    fl(rec, B, 3, es, -0.95, 0.28, es + 0.12, -0.28, 2.35);
    fl(rec, B, 3, es + 0.62, -0.95, 0.28, es + 0.42, -0.28, 2.35);
    fl(rec, B, 2, es - 0.02, -0.38, 2.05, es + 0.58, -0.22, 2.42);
  }
  function footArcade(rec, B, bay) {
    const s0 = bay.s0, span = bay.s1 - bay.s0;
    for (let i = 0; i < 3; i++) {
      const a = s0 + span * (0.04 + i * 0.3);
      const b1 = a + span * 0.24;
      const col = i === 1 ? 1 : (i === 2 ? 0 : 5);
      frect(rec, B, col, a, -0.4, 0.35, b1, -0.4, 2.15);
      fl(rec, B, 4, a + span * 0.04, -0.4, 1.2, b1 - span * 0.04, -0.4, 1.2);
      fl(rec, B, 4, a + span * 0.04, -0.4, 1.95, b1 - span * 0.04, -0.4, 1.95);
      fl(rec, B, 2, a, -0.4, 0.95, a, -0.82, 0.8);
      fl(rec, B, 2, b1, -0.4, 0.95, b1, -0.82, 0.8);
      fl(rec, B, 2, a, -0.82, 0.8, b1, -0.82, 0.8);
      fl(rec, B, 1, (a + b1) * 0.5, -0.82, 0.8, (a + b1) * 0.5, -0.82, 1.08);
    }
    const t = bay.s1 - span * 0.06;
    frect(rec, B, 3, t - span * 0.1, -0.34, 0.4, t, -0.34, 1.22);
  }
  function footHome(rec, B, bay) {
    const s0 = bay.s0, s1 = bay.s1;
    const ls = s0 + (s1 - s0) * 0.16;
    fl(rec, B, 3, ls, -0.65, 0.15, ls, -0.65, 1.85);
    diaWall(rec, B, 2, ls, -0.65, 2.05, 0.22, 0.2);
    frect(rec, B, 1, s0, -0.38, 0.32, s1, -0.38, 0.92);
    fl(rec, B, 1, s1 - (s1 - s0) * 0.28, -0.38, 0.42, s1 - (s1 - s0) * 0.28, -1.1, 0.42);
    fl(rec, B, 1, s1, -0.38, 0.32, s1, -1.1, 0.32);
    fl(rec, B, 1, s1 - (s1 - s0) * 0.28, -1.1, 0.32, s1, -1.1, 0.32);
    frect(rec, B, 4, s0 + 0.15, -0.18, 1.7, s0 + (s1 - s0) * 0.55, -0.18, 2.55);
    function sconce(s) {
      if (s < B.s0 + 0.35 || s > B.s1 - 0.35) return;
      fl(rec, B, 3, s, 0.08, 1.55, s, 0.28, 1.9);
      diaFace(rec, B, 2, s, 0.36, 2.0, 0.14, 0.2);
    }
    sconce(-1.15);
    sconce(1.15);
  }
  function footNos(rec, B, bay) {
    const s0 = bay.s0, s1 = bay.s1, y = 1.5, o = -0.42;
    fl(rec, B, 0, s0, o, y, s1, o, y);
    fl(rec, B, 0, s0, o, y, s0, o - 0.4, y + 0.65);
    fl(rec, B, 5, s1, o, y, s1, o - 0.3, y - 0.4);
    for (let i = 0; i < 3; i++) {
      const s = s0 + (s1 - s0) * (i + 0.5) / 3;
      diaWall(rec, B, 2, s, o, y + 0.55, 0.26, 0.26);
      fl(rec, B, 1, s, o, y + 0.55, s + 0.14, o, y + 0.74);
      fl(rec, B, 0, s, o, y, s, o, y + 0.28);
    }
  }
  function footSky(rec, B, bay) {
    const s = (bay.s0 + bay.s1) * 0.5, o = -0.5, y = 1.75;
    ringWall(rec, B, 0, s, o, y, 0.82, 8);
    ringWall(rec, B, 2, s, o, y, 0.4, 8);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + 0.35;
      fl(rec, B, 1, s + Math.cos(a) * 0.16, o, y + Math.sin(a) * 0.16, s + Math.cos(a) * 0.76, o, y + Math.sin(a) * 0.76);
    }
  }
  function footBuilder(rec, B, bay) {
    const s0 = bay.s0 + 0.1, s1 = bay.s1 - 0.1, o0 = -0.32, o1 = -1.0, y = 0.9;
    fflat(rec, B, 0, s0, o0, s1, o1, y);
    fl(rec, B, 0, s0, o0, 0.2, s0, o0, y);
    fl(rec, B, 0, s1, o0, 0.2, s1, o0, y);
    fl(rec, B, 0, s0, o1, 0.2, s0, o1, y);
    fl(rec, B, 0, s1, o1, 0.2, s1, o1, y);
    for (let i = 1; i <= 2; i++) {
      const s = s0 + (s1 - s0) * i / 3;
      const o = o0 + (o1 - o0) * i / 3;
      fl(rec, B, 2, s, o0, y + 0.02, s, o1, y + 0.02);
      fl(rec, B, 2, s0, o, y + 0.02, s1, o, y + 0.02);
    }
    const posts = [0.18, 0.22, 0.72, 0.28, 0.32, 0.68, 0.78, 0.62];
    for (let i = 0; i < 4; i++) {
      const s = s0 + (s1 - s0) * posts[i * 2];
      const o = o0 + (o1 - o0) * posts[i * 2 + 1];
      fl(rec, B, 1, s, o, y, s, o, y + 0.32 + (i % 2) * 0.22);
    }
  }
  function footSoccer(rec, B, bay) {
    const span = bay.s1 - bay.s0, s0 = bay.s0, s1 = bay.s0 + span * 0.58, o = -0.42;
    frect(rec, B, 4, s0, o, 0.28, s1, o, 1.65);
    fl(rec, B, 0, s0, o, 0.28, s1, o - 0.65, 1.65);
    fl(rec, B, 0, s1, o, 0.28, s0, o - 0.65, 1.65);
    fl(rec, B, 0, s0, o - 0.65, 0.28, s1, o - 0.65, 0.28);
    fl(rec, B, 0, s0, o - 0.65, 1.65, s1, o - 0.65, 1.65);
    const s = bay.s1 - span * 0.16;
    fl(rec, B, 2, s, -0.48, 0.22, s, -0.48, 0.82);
    fl(rec, B, 2, s - 0.2, -0.48, 0.82, s, -0.48, 1.22);
    fl(rec, B, 2, s + 0.2, -0.48, 0.82, s, -0.48, 1.22);
    fl(rec, B, 2, s - 0.2, -0.48, 0.82, s + 0.2, -0.48, 0.82);
    fl(rec, B, 3, s - 0.26, -0.48, 0.2, s + 0.26, -0.48, 0.2);
    fl(rec, B, 2, s - 0.2, -0.48, 1.02, s - 0.34, -0.48, 0.9);
    fl(rec, B, 2, s + 0.2, -0.48, 1.02, s + 0.34, -0.48, 0.9);
  }
  function bakeInterior(rec, B, purpose, bs) {
    const bay = bayOf(B, bs);
    if (!bay) return;
    if (purpose === 'DANCE') footDance(rec, B, bay);
    else if (purpose === 'CAFE') footCafe(rec, B, bay);
    else if (purpose === 'PETS') footPets(rec, B, bay);
    else if (purpose === 'GARAGE' || purpose === 'SHOWROOM') footGarage(rec, B, bay);
    else if (purpose === 'NEON_PAINT') footPaint(rec, B, bay);
    else if (purpose === 'ARCADE') footArcade(rec, B, bay);
    else if (purpose === 'HOME') footHome(rec, B, bay);
    else if (purpose === 'NOS') footNos(rec, B, bay);
    else if (purpose === 'SKY_DROP') footSky(rec, B, bay);
    else if (purpose === 'BUILDER') footBuilder(rec, B, bay);
    else if (purpose === 'SOCCER') footSoccer(rec, B, bay);
    else footHome(rec, B, bay);
  }
  function bakeFoot(b) {
    if (b._footSegs && b._footGen === FOOT_GEN) return b._footSegs;
    const B = footBasis(b);
    const rec = { n: 0, xyz: new Float32Array(FOOTCAP * 6), col: new Uint8Array(FOOTCAP) };
    if (!B) { b._footSegs = rec; b._footGen = FOOT_GEN; return rec; }
    const purpose = purposeOf(b);
    bakeApron(rec, B);
    bakeMat(rec, B);
    bakePark(rec, B, b);
    const sl = flank(B, -1), sr = flank(B, 1);
    if (sl) bakePlanter(rec, B, sl, false);
    if (sr) { bakePlanter(rec, B, sr, true); bakeLamp(rec, B, sr); }
    bakeBlade(rec, B, purpose);
    b._footSegs = rec;
    b._footGen = FOOT_GEN;
    return rec;
  }
  let indoorRec = null, indoorId = null;
  function buildingOfDoor(door) {
    if (!door) return null;
    if (door.building && door.building.boxes) return door.building;
    const id = door.buildingId;
    if (id == null) return null;
    for (let i = 0; i < BL.length; i++) if (BL[i] && BL[i].id === id) return BL[i];
    return null;
  }
  function loadInterior(door) {
    unloadInterior();
    const b = buildingOfDoor(door);
    if (!b) return null;
    const B = footBasis(b);
    const rec = { n: 0, xyz: new Float32Array(FOOTCAP * 6), col: new Uint8Array(FOOTCAP) };
    if (B) bakeInterior(rec, B, (door && door.purpose) || purposeOf(b), bladeS(B));
    indoorRec = rec;
    indoorId = b.id;
    return rec;
  }
  function unloadInterior() {
    indoorRec = null;
    indoorId = null;
  }
  function xzDist(b, wx, wz) {
    const x = wx < b.x0 ? b.x0 : wx > b.x1 ? b.x1 : wx;
    const z = wz < b.z0 ? b.z0 : wz > b.z1 ? b.z1 : wz;
    const dx = x - wx, dz = z - wz;
    return Math.sqrt(dx * dx + dz * dz);
  }
  function onFootPick(wx, wz, dist) {
    for (let i = 0; i < FOOT_N; i++) { footId[i] = -1; footD[i] = 1e9; }
    for (let i = 0; i < BL.length; i++) {
      const b = BL[i];
      if (!shopOk(b) || !b.doors || !b.doors.length) continue;
      const d = xzDist(b, wx, wz);
      if (d > dist || d >= footD[FOOT_N - 1]) continue;
      let j = FOOT_N - 1;
      while (j > 0 && d < footD[j - 1]) { footD[j] = footD[j - 1]; footId[j] = footId[j - 1]; j--; }
      footD[j] = d; footId[j] = i;
    }
    footOx = wx; footOz = wz; footHold = 0;
  }
  function onFootPass(c) {
    stat.onFoot = 0;
    stat.footSegs = 0;
    if (!extraOn || T.onFootDetailEnabled === false) return;
    if (typeof WALK_MODE === 'undefined' || !WALK_MODE || !WALK_MODE.onFoot || WALK_MODE.insideBuilding) return;
    const wx = WALK_MODE.wx != null ? +WALK_MODE.wx : +WALK_MODE.x;
    const wz = WALK_MODE.wz != null ? +WALK_MODE.wz : +WALK_MODE.z;
    if (wx !== wx || wz !== wz) return;
    const dist = T.onFootDetailDist || 38;
    if (Math.hypot(wx - footOx, wz - footOz) > 2.5 || footHold > 8 || footId[0] < 0) onFootPick(wx, wz, dist);
    else footHold++;
    for (let i = 0; i < FOOT_N; i++) footSeen[i] = 0;
    let left = 480, drew = 0, segs = 0;
    const g = c || ctx;
    g.save();
    g.setLineDash([]);
    g.globalAlpha = 1;
    g.lineWidth = 2.15;
    for (let col = 0; col < SFCOL.length; col++) {
      g.beginPath();
      let any = false;
      for (let k = 0; k < FOOT_N && left > 0; k++) {
        const bi = footId[k];
        if (bi < 0) continue;
        const rec = bakeFoot(BL[bi]);
        const xyz = rec.xyz;
        for (let s = 0; s < rec.n && left > 0; s++) {
          if (rec.col[s] !== col) continue;
          const o = s * 6;
          seg(xyz[o], xyz[o + 1], xyz[o + 2], xyz[o + 3], xyz[o + 4], xyz[o + 5]);
          any = true;
          left--;
          segs++;
        }
        if (rec.n && !footSeen[k]) { footSeen[k] = 1; drew++; }
      }
      if (any) { g.strokeStyle = SFCOL[col]; g.stroke(); }
    }
    g.restore();
    stat.onFoot = drew;
    stat.footSegs = segs;
  }
  function pass(c) {
    storefrontPass(cam.x, cam.z);
    if (typeof WALK_MODE !== 'undefined' && WALK_MODE && WALK_MODE.onFoot) onFootPass(c || ctx);
  }

  const _drawBldg = drawBldg;
  drawBldg = function (b, d) {
    _drawBldg(b, d);
    if (!active) return;
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
  const FEET = 160;
  const FX0 = new Float32Array(FEET), FX1 = new Float32Array(FEET), FZ0 = new Float32Array(FEET), FZ1 = new Float32Array(FEET);
  let nF = 0;
  const STREET_X = [150, 250, 350, 450, 550, -150, -250, -350, -450, -550];
  function inFoot(x, z) {
    for (let i = 0; i < nF; i++) {
      if (x > FX0[i] && x < FX1[i] && z > FZ0[i] && z < FZ1[i]) return true;
    }
    return false;
  }
  function buildFeet() {
    const ids = Object.create(null);
    const edges = CITY.ROADS && CITY.ROADS.edges;
    if (!edges) return;
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (!e || !e.blockedBy) continue;
      for (let k = 0; k < e.blockedBy.length; k++) {
        const b = e.blockedBy[k];
        if (b && b.oid != null) ids[b.oid] = 1;
      }
    }
    const list = CITY.buildings || CITY.BL || [];
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (!ids[b.oid] || !b.boxes) continue;
      for (let qi = 0; qi < b.boxes.length; qi++) {
        const q = b.boxes[qi];
        if ((q.y0 || 0) > 1.2 || q.y1 <= 1) continue;
        if (nF < FEET) {
          FX0[nF] = q.x0; FX1[nF] = q.x1; FZ0[nF] = q.z0; FZ1[nF] = q.z1; nF++;
        }
        for (let s = 0; s < STREET_X.length; s++) {
          const x = STREET_X[s];
          if (q.x0 < x && q.x1 > x) addGap(0, x, q.z0, q.z1);
        }
        for (let z = -300; z <= 2100; z += 200) {
          if (z > 1760 && z < 1860) continue;
          if (q.z0 < z && q.z1 > z) addGap(1, z, q.x0, q.x1);
        }
      }
    }
    for (let i = 0; i < nL; i++) if (inFoot(LX[i], LZ[i])) LSKIP[i] = 1;
  }
  buildGaps();
  buildFeet();
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
    if (!active || (!on.lanes && !on.crosswalks && !on.sidewalks)) return;
    const sx = snapStreetX(cam.x), sz = snapStreetZ(cam.z);
    const close = mode === 0;
    const rd = close ? (T.crawlDetailDist || 30) : (T.streetDist || T.roadDist || 70);
    const step = close ? 8 : 14, dash = close ? 4 : 6;
    if (dist3(sx, 0, cam.z) < rd + 30 && (on.lanes || on.sidewalks)) {
      ctx.beginPath();
      if (on.lanes) {
        const z0 = cam.z - rd, z1 = cam.z + rd;
        for (let z = z0; z < z1; z += step) clipNS(sx, sx, z, z + dash);
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
        for (let x = x0; x < x1; x += step) {
          if (x > -150 && x < 150) continue;
          clipEW(sz, sz, x, Math.min(x + dash, x1));
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
    const crossD = close ? (T.crawlDetailDist || 30) : (T.streetDist || T.crossDist || 70);
    if (on.crosswalks && dist3(sx, 0, sz) < crossD) {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const o = 10 + i * 2.1;
        clipEW(sz, sz - o, sx - 8, sx + 8);
        clipEW(sz, sz + o, sx - 8, sx + 8);
        clipNS(sx, sx - o, sz - 8, sz + 8);
        clipNS(sx, sx + o, sz - 8, sz + 8);
      }
      ctx.strokeStyle = 'rgba(255,242,192,.8)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      stat.roads++;
    }
  }
  const GP = new Float32Array(12);
  function drawGrass() {
    if (!active || !on.grass || !nP) return;
    for (let i = 0; i < nP; i++) {
      const x0 = PX0[i], z0 = PZ0[i], x1 = PX1[i], z1 = PZ1[i];
      const grassD = mode === 0 ? (T.crawlDetailDist || 30) : T.grassDist;
      if (dist3((x0 + x1) / 2, 0, (z0 + z1) / 2) > grassD) continue;
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
    if (!active || !on.river || !CITY.RIV) return;
    const R = CITY.RIV, zc = (R.z0 + R.z1) / 2;
    const riverD = mode === 0 ? (T.crawlDetailDist || 30) : T.riverDist;
    if (dist3(cam.x, 0, zc) > riverD) return;
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
    detailDraw();
    _drawCityGround();
    // Storefronts and the eye-level pass are stroked once, after the building
    // fills, from the tunnel wrapper. A second copy here only doubled the cost.
    if (!active) return;
    if (on.lanes || on.crosswalks || on.sidewalks || on.grass || on.river) {
      drawRoads();
      drawGrass();
      drawRiver();
      clean();
    }
  };

  // Building faces fill after the ground pass, which hides anything on that wall.
  // Stroke the on-foot layer again once the fills are down, before the HUD.
  if (typeof drawTunnelInside === 'function') {
    const _drawTunnelInside = drawTunnelInside;
    drawTunnelInside = function () {
      _drawTunnelInside();
      pass(ctx);
    };
  }

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
    if (LSKIP[e]) return;
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
    if (LSKIP[i] || inFoot(LX[i], LZ[i])) return;
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
    const capPx = mode === 0 ? 280 : 120;
    const w = Math.min(capPx, FOV / A[2] * SW[i]);
    if (w < (mode === 0 ? 18 : 12)) return;
    const h = w * (64 / 256);
    ctx.drawImage(signImgs[STX[i]], SA[0] - w * 0.5, SA[1] - h * 0.5, w, h);
    stat.signs++;
  }

  const _cityItems = cityItems;
  cityItems = function (items) {
    _cityItems(items);
    if (!active) return;
    slotUse = 0;
    const lampD = mode === 0 ? (T.crawlDetailDist || 30) : (T.streetDist || T.lightDist || 70);
    if (on.streetlights && nL && cam.y < lampD + 30) {
      const lim = T.lightBudget | 0;
      scanIdx(LHEAD, LNEXT, cam.x, cam.z, lim, lampD, takeLight);
      for (let i = 0; i < lim; i++) if (pickI[i] >= 0) {
        const e = pickI[i];
        const dx = LX[e] - cam.x, dz = LZ[e] - cam.z;
        pushSlot(items, dx * dx + dz * dz, 1, e);
      }
    }
    const treeD = mode === 0 ? (T.crawlDetailDist || 30) : T.treeDist;
    if (on.trees && nT && cam.y < treeD + 30) {
      const lim = T.treeBudget | 0;
      scanIdx(THEAD, TNEXT, cam.x, cam.z, lim, treeD, takeTree);
      for (let i = 0; i < lim; i++) if (pickI[i] >= 0) {
        const e = pickI[i];
        const dx = TX[e] - cam.x, dz = TZ[e] - cam.z;
        pushSlot(items, dx * dx + dz * dz, 2, e);
      }
    }
    const signD = mode === 0 ? (T.crawlDetailDist || 30) : (T.streetDist || T.signDist || 70);
    if (on.signs && nS && cam.y < signD + 40) {
      const lim = T.signBudget | 0, max2 = signD * signD;
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
    draw: detailDraw,
    pass: pass,
    loadInterior: loadInterior,
    unloadInterior: unloadInterior,
    interior: function () { return indoorRec ? { id: indoorId, n: indoorRec.n } : null; },
    stats: function () { return stat; },
    counts: { lights: nL, signs: nS, trees: nT, patches: nP },
    baked: 1,
    clipSpan: clipSpan,
    inFoot: inFoot,
    band: function () { return mode === 0 ? 'crawl' : mode === 1 ? 'street' : 'off'; },
    cruise: function () { return stat.cruise === 1; },
    wallSlots: function (u0, u1) {
      const n = fillSlots(u0, u1), o = [];
      for (let i = 0; i < n; i++) o.push(WSLOT[i]);
      return o;
    },
    gaps: function () { return { ns: GN[0], ew: GN[1] }; }
  };
})();
