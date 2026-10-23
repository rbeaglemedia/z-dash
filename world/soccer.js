'use strict';
// Car soccer. The player's Z pushes one big ball around a neon pitch.
// The ball has gravity, bounce, roll, and spin. Boundary lines are walls for the
// ball only — the car drives straight through them. A goal flashes, ticks a side,
// and sends the ball back to center. No per-frame allocation: scratch, typed
// lines, and one ball record.
const SOCCER = (() => {
  const T = window.SOCCER_TUNE;
  const CAR_H = (typeof ZDM !== 'undefined' && ZDM.h) || 1.32;
  const G = 9.8;
  const YL = 0.07;

  const F = {
    cx: T.fieldCx, cz: T.fieldCz, hw: T.fieldHw, hl: T.fieldHl,
    x0: 0, x1: 0, z0: 0, z1: 0,
    goalW: 0, goalH: 0, goalD: 0, mouth: 0
  };
  // East of the city limit, on flat grass. Probed clear of walls, ramps, and water
  // from x 640–960, z 140–460. The spur is the only pavement, and it stops short.
  F.x0 = F.cx - F.hw; F.x1 = F.cx + F.hw;
  F.z0 = F.cz - F.hl; F.z1 = F.cz + F.hl;

  const S = {
    x: F.cx, y: 1, z: F.cz,
    vx: 0, vy: 0, vz: 0,
    wx: 0, wy: 0, wz: 0,
    px: F.cx, pz: F.cz,
    R: CAR_H * T.diameterMul * 0.5,
    south: 0, north: 0,
    flash: 0, hold: 0, goalLock: 0, side: 0,
    label: 'SOUTH  0      NORTH  0', ls: 0, ln: 0, relabel: 1
  };
  S.y = S.R;

  const U = {x: 1, y: 0, z: 0};
  const V = {x: 0, y: 0, z: 1};
  const prev = {x: 0, y: 0, z: 0, yaw: 0, ok: false};
  const car = {x: 0, y: 0, z: 0, yaw: 0, vx: 0, vy: 0, vz: 0, yawRate: 0};

  const LINES = new Float32Array(220 * 7);
  let nLines = 0;
  const A = [0, 0, 0], B = [0, 0, 0];
  const CX = new Float32Array(8), CY = new Float32Array(8), CZ = new Float32Array(8);
  const DX = new Float32Array(8), DY = new Float32Array(8), DZ = new Float32Array(8);

  function add(x0, y0, z0, x1, y1, z1, g) {
    const i = nLines * 7;
    if (i + 7 > LINES.length) return;
    LINES[i] = x0; LINES[i + 1] = y0; LINES[i + 2] = z0;
    LINES[i + 3] = x1; LINES[i + 4] = y1; LINES[i + 5] = z1;
    LINES[i + 6] = g;
    nLines++;
  }
  function arc(cx, cz, r, a0, a1, n, g) {
    let px = cx + Math.cos(a0) * r, pz = cz + Math.sin(a0) * r;
    for (let i = 1; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r;
      add(px, YL, pz, x, YL, z, g);
      px = x; pz = z;
    }
  }
  function layout() {
    nLines = 0;
    const d = S.R * 2;
    F.goalW = Math.min((F.x1 - F.x0) * 0.46, d * 4.6);
    F.goalH = d * 2.2;
    F.goalD = d * 1.55;
    F.mouth = F.goalW * 0.5 - 0.4;
    const x0 = F.x0, x1 = F.x1, z0 = F.z0, z1 = F.z1, cx = F.cx, cz = F.cz;
    add(x0, YL, z0, x1, YL, z0, 0);
    add(x1, YL, z0, x1, YL, z1, 0);
    add(x1, YL, z1, x0, YL, z1, 0);
    add(x0, YL, z1, x0, YL, z0, 0);
    add(x0, YL, cz, x1, YL, cz, 1);
    const cr = Math.max(8, d * 2.8);
    arc(cx, cz, cr, 0, Math.PI * 2, 28, 1);
    add(cx - 0.7, YL, cz, cx + 0.7, YL, cz, 1);
    add(cx, YL, cz - 0.7, cx, YL, cz + 0.7, 1);
    const pbW = Math.min((x1 - x0) * 0.62, F.goalW + d * 3.2);
    const pbD = Math.min((z1 - z0) * 0.22, Math.max(14, d * 4.4));
    const gbW = Math.min(pbW - 4, F.goalW + d * 1.4);
    const gbD = Math.min(pbD * 0.42, Math.max(6, d * 1.8));
    box3(cx, pbW, z0, pbD, 1);
    box3(cx, pbW, z1, -pbD, 1);
    box3(cx, gbW, z0, gbD, 1);
    box3(cx, gbW, z1, -gbD, 1);
    const spot = Math.min(pbD - 2, Math.max(9, d * 3.2));
    spotAt(cx, z0 + spot);
    spotAt(cx, z1 - spot);
    arc(cx, z0 + spot, Math.max(4, d * 1.5), 0.55, Math.PI - 0.55, 10, 1);
    arc(cx, z1 - spot, Math.max(4, d * 1.5), Math.PI + 0.55, Math.PI * 2 - 0.55, 10, 1);
    const ca = Math.min(2.2, d * 0.55);
    arc(x0, z0, ca, 0, Math.PI * 0.5, 5, 1);
    arc(x1, z0, ca, Math.PI * 0.5, Math.PI, 5, 1);
    arc(x1, z1, ca, Math.PI, Math.PI * 1.5, 5, 1);
    arc(x0, z1, ca, Math.PI * 1.5, Math.PI * 2, 5, 1);
    goalGeom(z0, -1, 2);
    goalGeom(z1, 1, 3);
    S.y = S.R;
  }
  function box3(cx, w, zLine, depth, g) {
    const x0 = cx - w * 0.5, x1 = cx + w * 0.5, z = zLine + depth;
    add(x0, YL, zLine, x0, YL, z, g);
    add(x1, YL, zLine, x1, YL, z, g);
    add(x0, YL, z, x1, YL, z, g);
  }
  function spotAt(x, z) {
    add(x - 0.45, YL, z, x + 0.45, YL, z, 1);
    add(x, YL, z - 0.45, x, YL, z + 0.45, 1);
  }
  function goalGeom(zPlane, sign, g) {
    const hw = F.goalW * 0.5, h = F.goalH, dep = F.goalD;
    const zB = zPlane + sign * dep;
    const xL = F.cx - hw, xR = F.cx + hw;
    add(xL, 0, zPlane, xL, h, zPlane, g);
    add(xR, 0, zPlane, xR, h, zPlane, g);
    add(xL, h, zPlane, xR, h, zPlane, g);
    add(xL, 0, zB, xL, h * 0.86, zB, g);
    add(xR, 0, zB, xR, h * 0.86, zB, g);
    add(xL, h * 0.86, zB, xR, h * 0.86, zB, g);
    add(xL, h, zPlane, xL, h * 0.86, zB, g);
    add(xR, h, zPlane, xR, h * 0.86, zB, g);
    const nets = 4;
    for (let i = 1; i < nets; i++) {
      const t = i / nets;
      const x = xL + (xR - xL) * t;
      add(x, 0.15, zPlane, x, 0.15, zB, g);
      add(x, h * 0.45, zPlane, x, h * 0.4, zB, g);
    }
    for (let i = 1; i <= 3; i++) {
      const y = h * i / 4;
      add(xL, y, zPlane, xL, y * 0.86, zB, g);
      add(xR, y, zPlane, xR, y * 0.86, zB, g);
    }
  }

  function angDiff(a, b) { return Math.atan2(Math.sin(a - b), Math.cos(a - b)); }
  function lim(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rodrigues(p, ang, kx, ky, kz) {
    const x = p.x, y = p.y, z = p.z;
    const c = Math.cos(ang), s = Math.sin(ang), d = kx * x + ky * y + kz * z;
    const cx = ky * z - kz * y, cy = kz * x - kx * z, cz = kx * y - ky * x;
    p.x = x * c + cx * s + kx * d * (1 - c);
    p.y = y * c + cy * s + ky * d * (1 - c);
    p.z = z * c + cz * s + kz * d * (1 - c);
  }
  function norm3(p) {
    const m = Math.hypot(p.x, p.y, p.z) || 1;
    p.x /= m; p.y /= m; p.z /= m;
  }
  function spinBasis(h) {
    const w = Math.hypot(S.wx, S.wy, S.wz);
    if (w < 1e-4) return;
    const ang = w * h, kx = S.wx / w, ky = S.wy / w, kz = S.wz / w;
    rodrigues(U, ang, kx, ky, kz);
    rodrigues(V, ang, kx, ky, kz);
  }
  function orthoBasis() {
    norm3(U);
    const d = U.x * V.x + U.y * V.y + U.z * V.z;
    V.x -= U.x * d; V.y -= U.y * d; V.z -= U.z * d;
    norm3(V);
  }

  function resetBall() {
    S.x = F.cx; S.y = S.R; S.z = F.cz;
    S.vx = S.vy = S.vz = 0;
    S.wx = S.wy = S.wz = 0;
    S.px = S.x; S.pz = S.z;
    S.hold = 0; S.goalLock = 0;
    U.x = 1; U.y = 0; U.z = 0;
    V.x = 0; V.y = 0; V.z = 1;
  }
  function score(sign) {
    if (S.goalLock) return;
    S.goalLock = 1;
    if (sign > 0) S.north++; else S.south++;
    S.flash = 1.25;
    S.hold = 1.05;
    S.side = sign;
    if (S.ls !== S.south || S.ln !== S.north) {
      S.ls = S.south; S.ln = S.north;
      S.label = 'SOUTH  ' + S.south + '      NORTH  ' + S.north;
      S.relabel = 1;
    }
  }

  function ground(h) {
    const R = S.R;
    if (S.y >= R) return;
    S.y = R;
    if (S.vy < 0) {
      S.vy = -S.vy * T.bounciness;
      if (S.vy < 0.7) S.vy = 0;
    }
    const mu = T.friction;
    const sx = S.vx + S.wz * R;
    const sz = S.vz - S.wx * R;
    const slip = Math.hypot(sx, sz);
    if (slip > 1e-4) {
      const grip = lim(mu * 8 * h, 0, 1);
      S.vx -= sx * grip * 0.45;
      S.vz -= sz * grip * 0.45;
      S.wx += (S.vz / R - S.wx) * grip;
      S.wz += (-S.vx / R - S.wz) * grip;
    }
    const sp = Math.hypot(S.vx, S.vz);
    const drop = Math.min(sp, mu * 0.55 * G * h);
    if (sp > 1e-4) {
      S.vx -= S.vx / sp * drop;
      S.vz -= S.vz / sp * drop;
    }
    S.wx = S.vz / R;
    S.wz = -S.vx / R;
    S.wy *= Math.max(0, 1 - mu * 2 * h);
  }

  function walls() {
    const R = S.R, e = T.bounciness;
    if (S.x < F.x0 + R) { S.x = F.x0 + R; if (S.vx < 0) S.vx = -S.vx * e; }
    else if (S.x > F.x1 - R) { S.x = F.x1 - R; if (S.vx > 0) S.vx = -S.vx * e; }
    endWall(-1, e);
    endWall(1, e);
  }
  function endWall(sign, e) {
    const R = S.R;
    const plane = sign > 0 ? F.z1 : F.z0;
    const back = plane + sign * F.goalD;
    const open = Math.abs(S.x - F.cx) < F.mouth && S.y < F.goalH - 0.15;
    if (open) {
      const crossed = sign > 0 ? (S.pz <= plane && S.z > plane) : (S.pz >= plane && S.z < plane);
      if (crossed) score(sign);
      const past = sign > 0 ? S.z > plane : S.z < plane;
      if (past) {
        if (sign > 0 && S.z > back - R) { S.z = back - R; if (S.vz > 0) S.vz = -S.vz * e; }
        if (sign < 0 && S.z < back + R) { S.z = back + R; if (S.vz < 0) S.vz = -S.vz * e; }
        const limX = F.goalW * 0.5 - R * 0.35;
        if (S.x > F.cx + limX) { S.x = F.cx + limX; if (S.vx > 0) S.vx = -S.vx * e; }
        else if (S.x < F.cx - limX) { S.x = F.cx - limX; if (S.vx < 0) S.vx = -S.vx * e; }
      }
      return;
    }
    if (sign > 0 && S.z > plane - R) { S.z = plane - R; if (S.vz > 0) S.vz = -S.vz * e; }
    else if (sign < 0 && S.z < plane + R) { S.z = plane + R; if (S.vz < 0) S.vz = -S.vz * e; }
  }

  // Nose sphere sits on the bumper so a front hit's normal points forward and up.
  // The cabin box covers side and rear contact. Deepest hit wins.
  const BUMP = {x: 0, y: 0.4, z: 1.58, r: 0.52};
  const BOX = {x0: -0.93, x1: 0.93, y0: 0.16, y1: 1.32, z0: -2.12, z1: 1.2};
  const hitN = {x: 0, y: 0, z: 0, pen: 0};

  function consider(nx, ny, nz, pen) {
    if (pen <= hitN.pen) return;
    const m = Math.hypot(nx, ny, nz) || 1;
    hitN.x = nx / m; hitN.y = ny / m; hitN.z = nz / m; hitN.pen = pen;
  }
  function carContact(car) {
    hitN.pen = 0;
    const sy = Math.sin(car.yaw), cy = Math.cos(car.yaw);
    const dx = S.x - car.x, dy = S.y - car.y, dz = S.z - car.z;
    const lz = dx * sy + dz * cy;
    const lx = dx * cy - dz * sy;
    const ly = dy;
    const qx = lim(lx, BOX.x0, BOX.x1), qy = lim(ly, BOX.y0, BOX.y1), qz = lim(lz, BOX.z0, BOX.z1);
    let nx = lx - qx, ny = ly - qy, nz = lz - qz;
    const dist = Math.hypot(nx, ny, nz);
    if (dist >= 1e-5) consider(nx, ny, nz, S.R - dist);
    else {
      const faces = [
        lx - BOX.x0, BOX.x1 - lx, ly - BOX.y0, BOX.y1 - ly, lz - BOX.z0, BOX.z1 - lz
      ];
      let k = 0;
      for (let i = 1; i < 6; i++) if (faces[i] < faces[k]) k = i;
      const dirs = [-1, 0, 0, 1, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, -1, 0, 0, 1];
      consider(dirs[k * 3], dirs[k * 3 + 1], dirs[k * 3 + 2], S.R + faces[k]);
    }
    if (lz > 0.15) {
      const bx = lx - BUMP.x, by = ly - BUMP.y, bz = lz - BUMP.z;
      const bd = Math.hypot(bx, by, bz);
      if (bd >= 1e-5) consider(bx, by, bz, S.R + BUMP.r - bd);
    }
    if (hitN.pen <= 0.0008) return;
    const pen = hitN.pen;
    const nxl = hitN.x, nyl = hitN.y, nzl = hitN.z;
    const nwx = nxl * cy + nzl * sy;
    const nwy = nyl;
    const nwz = -nxl * sy + nzl * cy;
    S.x += nwx * pen; S.y += nwy * pen; S.z += nwz * pen;
    const R = S.R;
    const rx = -nwx * R, ry = -nwy * R, rz = -nwz * R;
    const cpx = S.x + rx - car.x, cpy = S.y + ry - car.y, cpz = S.z + rz - car.z;
    const yr = car.yawRate;
    const cvx = car.vx + yr * cpz;
    const cvy = car.vy;
    const cvz = car.vz - yr * cpx;
    const vbx = S.vx + (S.wy * rz - S.wz * ry);
    const vby = S.vy + (S.wz * rx - S.wx * rz);
    const vbz = S.vz + (S.wx * ry - S.wy * rx);
    const rvx = vbx - cvx, rvy = vby - cvy, rvz = vbz - cvz;
    const vn = rvx * nwx + rvy * nwy + rvz * nwz;
    if (vn >= 0) return;
    const invB = 1 / T.ballMass, invC = 1 / T.carMass;
    let J = -(1 + T.bounciness) * vn / (invB + invC) * T.hitStrength;
    if (J < 0) J = 0;
    S.vx += nwx * J * invB;
    S.vy += nwy * J * invB;
    S.vz += nwz * J * invB;
    const cbx = S.vx + (S.wy * rz - S.wz * ry);
    const cby = S.vy + (S.wz * rx - S.wx * rz);
    const cbz = S.vz + (S.wx * ry - S.wy * rx);
    const vnb = (cbx - cvx) * nwx + (cby - cvy) * nwy + (cbz - cvz) * nwz;
    const tx = (cbx - cvx) - vnb * nwx;
    const ty = (cby - cvy) - vnb * nwy;
    const tz = (cbz - cvz) - vnb * nwz;
    const tmag = Math.hypot(tx, ty, tz);
    if (tmag < 1e-5) return;
    const I = 0.4 * T.ballMass * R * R;
    const invEff = invB + (R * R) / I;
    const jt = Math.min(T.friction * J, tmag / invEff);
    const s = jt / tmag;
    const jx = -tx * s, jy = -ty * s, jz = -tz * s;
    S.vx += jx * invB; S.vy += jy * invB; S.vz += jz * invB;
    S.wx += (ry * jz - rz * jy) / I;
    S.wy += (rz * jx - rx * jz) / I;
    S.wz += (rx * jy - ry * jx) / I;
  }

  function substep(h, car) {
    S.px = S.x; S.pz = S.z;
    S.vy -= G * h;
    if (S.y > S.R + 0.04) {
      const k = Math.max(0, 1 - 0.045 * h);
      S.vx *= k; S.vy *= k; S.vz *= k;
    }
    S.x += S.vx * h; S.y += S.vy * h; S.z += S.vz * h;
    const sp = Math.hypot(S.vx, S.vy, S.vz);
    if (sp > 75) { const s = 75 / sp; S.vx *= s; S.vy *= s; S.vz *= s; }
    carContact(car);
    ground(h);
    walls();
    spinBasis(h);
  }

  function sim(dt) {
    if (!(dt > 0)) return;
    if (S.flash > 0) S.flash -= dt;
    if (S.hold > 0) {
      S.hold -= dt;
      if (S.hold <= 0) resetBall();
    }
    if (!prev.ok) {
      prev.x = P.x; prev.y = P.y; prev.z = P.z; prev.yaw = P.yaw || 0; prev.ok = true;
    }
    const jump = Math.hypot(P.x - prev.x, P.z - prev.z);
    if (jump > 28) { prev.x = P.x; prev.y = P.y; prev.z = P.z; prev.yaw = P.yaw || 0; }
    const yaw = P.yaw || 0;
    const dyaw = angDiff(yaw, prev.yaw);
    const steps = dt > 0.034 ? 4 : dt > 0.02 ? 3 : 2;
    const h = dt / steps;
    const hd = P.hd != null ? P.hd : yaw;
    const hv = (P.v || 0) * Math.cos(P.ground ? 0 : (P.gam || 0));
    car.vx = Math.sin(hd) * hv;
    car.vy = P.ground ? 0 : (P.v || 0) * Math.sin(P.gam || 0);
    car.vz = Math.cos(hd) * hv;
    car.yawRate = dyaw / dt;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      car.x = prev.x + (P.x - prev.x) * t;
      car.y = prev.y + ((P.y || 0) - prev.y) * t;
      car.z = prev.z + (P.z - prev.z) * t;
      car.yaw = prev.yaw + dyaw * t;
      substep(h, car);
    }
    prev.x = P.x; prev.y = P.y || 0; prev.z = P.z; prev.yaw = yaw;
    orthoBasis();
    const cap = 42;
    if (Math.hypot(S.wx, S.wy, S.wz) > cap) {
      const s = cap / Math.hypot(S.wx, S.wy, S.wz);
      S.wx *= s; S.wy *= s; S.wz *= s;
    }
  }

  function frame(dt) {
    if (typeof flying !== 'undefined' && flying && !(typeof paused !== 'undefined' && paused)) sim(dt);
    if (ballItem) { ballItem.x = S.x; ballItem.y = S.y; ballItem.z = S.z; }
  }

  function seg(x0, y0, z0, x1, y1, z1) {
    A[0] = x0; A[1] = y0; A[2] = z0; B[0] = x1; B[1] = y1; B[2] = z1;
    pathSeg(A, B);
  }
  function strokeGroup(g, color, width) {
    ctx.beginPath();
    for (let i = 0; i < nLines; i++) {
      const o = i * 7;
      if (LINES[o + 6] !== g) continue;
      seg(LINES[o], LINES[o + 1], LINES[o + 2], LINES[o + 3], LINES[o + 4], LINES[o + 5]);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  function clipNear(n, X, Y, Z, X2, Y2, Z2) {
    let m = 0;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const aIn = Z[i] >= NEAR, bIn = Z[j] >= NEAR;
      if (aIn && bIn) { X2[m] = X[j]; Y2[m] = Y[j]; Z2[m] = Z[j]; m++; }
      else if (aIn !== bIn) {
        const t = (NEAR - Z[i]) / (Z[j] - Z[i]);
        X2[m] = X[i] + (X[j] - X[i]) * t;
        Y2[m] = Y[i] + (Y[j] - Y[i]) * t;
        Z2[m] = NEAR;
        m++;
        if (bIn) { X2[m] = X[j]; Y2[m] = Y[j]; Z2[m] = Z[j]; m++; }
      }
    }
    return m;
  }
  function fillQuad(x0, z0, x1, z1, x2, z2, x3, z3, y, color) {
    const c0 = camS(x0, y, z0), c1 = camS(x1, y, z1), c2 = camS(x2, y, z2), c3 = camS(x3, y, z3);
    CX[0] = c0[0]; CY[0] = c0[1]; CZ[0] = c0[2];
    CX[1] = c1[0]; CY[1] = c1[1]; CZ[1] = c1[2];
    CX[2] = c2[0]; CY[2] = c2[1]; CZ[2] = c2[2];
    CX[3] = c3[0]; CY[3] = c3[1]; CZ[3] = c3[2];
    const m = clipNear(4, CX, CY, CZ, DX, DY, DZ);
    if (m < 3) return;
    const f = H * 0.9;
    ctx.beginPath();
    for (let i = 0; i < m; i++) {
      const X = W / 2 + DX[i] * f / DZ[i], Y = H / 2 - DY[i] * f / DZ[i];
      if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  function drawRoad() {
    const x0 = T.roadX0, x1 = T.roadX1, z = T.roadZ, w = T.roadHalfW;
    if (!(x1 > x0) || !(w > 0)) return;
    fillQuad(x0, z - w, x1, z - w, x1, z + w, x0, z + w, 0.02, '#120a18');
    ctx.beginPath();
    seg(x0, 0.03, z - w, x1, 0.03, z - w);
    seg(x0, 0.03, z + w, x1, 0.03, z + w);
    ctx.strokeStyle = 'rgba(62,230,255,.55)';
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  function paved(x, z) {
    return x >= T.roadX0 && x <= T.roadX1 && Math.abs(z - T.roadZ) <= T.roadHalfW;
  }
  function drawPitch() {
    if (typeof cam === 'undefined') return;
    const dx = F.cx - cam.x, dz = F.cz - cam.z;
    if (dx * dx + dz * dz > 1050 * 1050) return;
    drawRoad();
    const y = 0.035;
    fillQuad(F.x0, F.z0, F.x1, F.z0, F.x1, F.z1, F.x0, F.z1, y, '#07160f');
    strokeGroup(0, '#3ee6ff', 2.4);
    strokeGroup(1, 'rgba(236,255,248,.82)', 1.35);
  }
  function ballCloser() {
    if (typeof cam === 'undefined' || typeof P === 'undefined') return false;
    const db = (S.x - cam.x) ** 2 + (S.y - cam.y) ** 2 + (S.z - cam.z) ** 2;
    const dc = (P.x - cam.x) ** 2 + ((P.y || 0) + 0.6 - cam.y) ** 2 + (P.z - cam.z) ** 2;
    return db + 0.4 < dc;
  }
  function paintBall() {
    if (typeof proj !== 'function') return;
    const c = proj(S.x, S.y, S.z);
    if (!c) return;
    const f = H * 0.9;
    const pr = Math.max(2.5, f * S.R / c[2]);
    const sh = proj(S.x, 0.04, S.z);
    if (sh) {
      const k = c[2] / Math.max(sh[2], 0.5);
      ctx.fillStyle = 'rgba(0,0,0,.38)';
      ctx.beginPath();
      ctx.ellipse(sh[0], sh[1], pr * k * 0.92, Math.max(1.5, pr * k * 0.32), 0, 0, 6.3);
      ctx.fill();
    }
    ctx.fillStyle = '#f4fffb';
    ctx.beginPath();
    ctx.arc(c[0], c[1], pr, 0, 6.3);
    ctx.fill();
    ctx.strokeStyle = '#9ffff0';
    ctx.lineWidth = Math.max(1.4, pr * 0.07);
    ctx.stroke();
    seam(S.R, 0);
    seam(S.R, 1);
  }
  function seam(R, which) {
    ctx.beginPath();
    let started = false;
    const wx = U.y * V.z - U.z * V.y, wy = U.z * V.x - U.x * V.z, wz = U.x * V.y - U.y * V.x;
    for (let i = 0; i <= 16; i++) {
      const a = i / 16 * Math.PI * 2;
      const c0 = Math.cos(a), s0 = Math.sin(a);
      let ox, oy, oz;
      if (which === 0) { ox = U.x * c0 + V.x * s0; oy = U.y * c0 + V.y * s0; oz = U.z * c0 + V.z * s0; }
      else { ox = U.x * c0 + wx * s0; oy = U.y * c0 + wy * s0; oz = U.z * c0 + wz * s0; }
      const p = proj(S.x + ox * R, S.y + oy * R, S.z + oz * R);
      if (!p) { started = false; continue; }
      if (!started) { ctx.moveTo(p[0], p[1]); started = true; }
      else ctx.lineTo(p[0], p[1]);
    }
    ctx.strokeStyle = which ? '#ff4fd8' : '#12323a';
    ctx.lineWidth = which ? 1.6 : 1.3;
    ctx.stroke();
  }

  let ballItem = null;
  let scoreW = 196;
  function drawGoalNorth() { strokeGroup(3, '#7dfff2', 2.6); }
  function drawGoalSouth() { strokeGroup(2, '#ff4fd8', 2.6); }
  const goalN = {x: F.cx, y: 3, z: F.z1, rad: 12, draw: drawGoalNorth};
  const goalS = {x: F.cx, y: 3, z: F.z0, rad: 12, draw: drawGoalSouth};
  function drawBallItem() {
    if (ballCloser()) return;
    paintBall();
  }

  function hud() {
    if (typeof ctx === 'undefined') return;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (T.showScore) {
      ctx.font = '800 13px Orbitron, sans-serif';
      ctx.fillStyle = 'rgba(8,4,18,.72)';
      if (S.relabel) { scoreW = Math.max(168, ctx.measureText(S.label).width + 28); S.relabel = 0; }
      const tw = scoreW;
      const x = W * 0.5 - tw * 0.5, y = H - 36;
      ctx.beginPath();
      ctx.roundRect(x, y - 12, tw, 24, 12);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#3ee6ff';
      ctx.stroke();
      ctx.fillStyle = '#f4fffb';
      ctx.fillText(S.label, W * 0.5, y);
    }
    if (S.flash > 0) {
      const a = lim(S.flash / 0.28, 0, 1);
      const sc = 1 + Math.max(0, S.flash - 0.85) * 0.9;
      ctx.globalAlpha = a;
      ctx.translate(W * 0.5, H * 0.4);
      ctx.scale(sc, sc);
      ctx.font = '900 64px Orbitron, sans-serif';
      ctx.fillStyle = S.side > 0 ? '#7dfff2' : '#ff4fd8';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 18;
      ctx.fillText('GOAL!', 0, 0);
      ctx.shadowBlur = 0;
      ctx.font = '800 16px Orbitron, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(S.side > 0 ? 'NORTH' : 'SOUTH', 0, 46);
    }
    ctx.restore();
  }

  function install() {
    layout();
    if (typeof CITY !== 'undefined' && CITY.DYN) {
      ballItem = {x: S.x, y: S.y, z: S.z, rad: S.R + 1, draw: drawBallItem};
      CITY.DYN.push(ballItem, goalN, goalS);
    }
    if (typeof drawCityGround === 'function') {
      const base = drawCityGround;
      drawCityGround = function () { base(); drawPitch(); };
    }
    if (typeof drawZ === 'function') {
      const baseZ = drawZ;
      drawZ = function () { baseZ(); if (ballCloser()) paintBall(); };
    }
    if (typeof drawHud === 'function') {
      const baseH = drawHud;
      drawHud = function (dt) { baseH(dt); hud(); };
    }
  }
  install();

  return {
    frame,
    reset: resetBall,
    state: S,
    field: F,
    sim,
    paved
  };
})();
window.SOCCER = SOCCER;
