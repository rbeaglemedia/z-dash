/**
 * Page half of the Neon World architecture check. Loaded by tools/arch-check.mjs.
 * Test-only. It does not ship in the game.
 *
 * The city, the building drawer, the detail tiers, and the dance mural are the
 * real scripts. This file only poses the camera, measures what they draw, and
 * paints the review shots.
 */
(function () {
  const PERSON = 1.7;
  const PET = 0.74;
  const CAR = { len: 4.25, w: 1.85, h: 1.32, name: '370Z' };
  const PALETTE = {
    '#ff2a3d': 1, '#3ee6ff': 1, '#ffb020': 1, '#ff4fd8': 1, '#7dff6b': 1,
    '#ffe14d': 1, '#fff2c0': 1, '#ffd27a': 1, '#9ff3ff': 1, '#ffb3e6': 1,
    '#8a7a9d': 1
  };
  const VIEWS = ['front', 'three', 'roof', 'foot'];
  const VIEWPORTS = [
    { id: 'phone', w: 844, h: 390, dpr: 1 },
    { id: 'ipad', w: 1024, h: 768, dpr: 1 },
    { id: 'pc', w: 1280, h: 720, dpr: 1 }
  ];
  const FPS_VIEW = {
    phone: { w: 844, h: 390, dpr: 2 },
    ipad: { w: 1024, h: 768, dpr: 1 },
    pc: { w: 1280, h: 720, dpr: 1 }
  };

  function rnd(n) { return Math.round((+n || 0) * 100) / 100; }
  function hexOf(c) { return String(c || '').trim().toLowerCase(); }

  function archList() {
    const list = (CITY.buildings || CITY.BL || []).filter(function (b) {
      return b && (b.kind === 'b' || b.kind === 'landmark') && b.boxes && b.boxes.length && !b.towCab;
    });
    return list;
  }

  function labelOf(b) {
    return (b.purposeLabel || b.label || b.purpose || b.kind || 'building') + '';
  }

  function refOf(b) {
    return { id: b.id, purpose: b.purpose || '', label: labelOf(b) };
  }

  function personDoorData(b) {
    return (b.doors || []).filter(function (d) { return d && d[4] !== 'garage' && d[4] !== 'lot'; });
  }

  function faceNormal(b) {
    const s = b.sign || {};
    let nx = s.nx || 0, nz = s.nz || 0;
    if (!nx && !nz) {
      const d = personDoorData(b)[0] || (b.doors && b.doors[0]);
      if (d) { nx = d[2] || 0; nz = d[3] || 0; }
    }
    if (!nx && !nz) nz = -1;
    const len = Math.hypot(nx, nz) || 1;
    return { nx: nx / len, nz: nz / len };
  }

  function aim(camAt, look) {
    const lx = look[0] - camAt.x, ly = look[1] - camAt.y, lz = look[2] - camAt.z;
    camAt.yaw = Math.atan2(lx, lz);
    camAt.pitch = Math.atan2(-ly, Math.hypot(lx, lz));
    camAt.roll = 0;
  }

  function pose(spec) {
    FLYCAM.orbit = spec.foot ? null : true;
    WALK_MODE.onFoot = !!spec.foot;
    WALK_MODE.insideBuilding = false;
    WALK_MODE.x = spec.wx;
    WALK_MODE.y = 0;
    WALK_MODE.z = spec.wz;
    WALK_MODE.yaw = spec.wyaw || 0;
    WALK_MODE.wx = spec.wx;
    WALK_MODE.wz = spec.wz;
    P.x = spec.wx;
    P.y = spec.air ? 40 : 0;
    P.z = spec.wz;
    P.yaw = spec.wyaw || 0;
    P.hd = P.yaw;
    P.pitch = 0;
    P.ground = !spec.air;
    P.v = spec.air ? 36 : (spec.foot ? 0 : 4);
    P.driveMode = spec.air ? 'arcade' : 'street';
    P.simT = 1;
    if (spec.foot && typeof camSeatFoot === 'function') camSeatFoot();
    else {
      cam.x = spec.x; cam.y = spec.y; cam.z = spec.z;
      aim(cam, spec.look);
    }
  }

  function facePoint(b) {
    const n = faceNormal(b);
    const g = b.sign;
    if (g && ((g.nx || 0) || (g.nz || 0))) return { x: g.x, z: g.z, y: g.y || 6, n: n };
    const door = personDoorData(b)[0] || (b.doors && b.doors[0]);
    if (door) return { x: door[0], z: door[1], y: 2, n: { nx: door[2] || n.nx, nz: door[3] || n.nz } };
    return { x: (b.x0 + b.x1) / 2, z: (b.z0 + b.z1) / 2, y: 4, n: n };
  }

  function frontSpec(b, distScale) {
    const f = facePoint(b);
    const n = f.n;
    const span = Math.max(b.x1 - b.x0, b.z1 - b.z0, 8);
    const h = b.top || 12;
    const dist = Math.min(70, Math.max(16, span * (distScale || 0.55), Math.min(h, 28) * 0.85));
    const lookY = Math.min(Math.max(3.2, Math.min(f.y || h * 0.35, 14)), Math.min(h * 0.72, 16));
    return {
      x: f.x + n.nx * dist, y: 2.35, z: f.z + n.nz * dist,
      look: [f.x, lookY, f.z],
      wx: f.x + n.nx * 8, wz: f.z + n.nz * 8, wyaw: Math.atan2(-n.nx, -n.nz)
    };
  }

  function viewSpec(b, view) {
    const f = facePoint(b);
    const n = f.n;
    const base = frontSpec(b, view === 'three' ? 0.72 : 0.55);
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    const h = b.top || 12;
    if (view === 'front') return base;
    if (view === 'three') {
      const tx = -n.nz, tz = n.nx;
      const dist = Math.hypot(base.x - f.x, base.z - f.z);
      const ang = 0.7;
      const dx = n.nx * Math.cos(ang) + tx * Math.sin(ang);
      const dz = n.nz * Math.cos(ang) + tz * Math.sin(ang);
      return {
        x: f.x + dx * dist, y: Math.max(3.2, Math.min(8, h * 0.22)), z: f.z + dz * dist,
        look: [f.x, Math.min(Math.max((f.y || 6) * 0.55, 4), 16), f.z],
        wx: f.x + dx * 8, wz: f.z + dz * 8, wyaw: Math.atan2(-dx, -dz)
      };
    }
    if (view === 'roof') {
      const span = Math.max(b.x1 - b.x0, b.z1 - b.z0, 12);
      const back = Math.max(span * 0.9, Math.min(h * 0.45, 48), 22);
      const up = Math.max(Math.min(h * 0.42, 50), span * 0.45, 16);
      return {
        air: true,
        x: cx + n.nx * back, y: h + up, z: cz + n.nz * back,
        look: [cx, h * 0.72, cz],
        wx: cx, wz: cz, wyaw: Math.atan2(-n.nx, -n.nz)
      };
    }
    const door = personDoorData(b)[0] || (b.doors && b.doors[0]) || [cx, b.z0, 0, -1];
    const nx = door[2] || n.nx, nz = door[3] || n.nz;
    const len = Math.hypot(nx, nz) || 1;
    const fx = nx / len, fz = nz / len;
    const standX = door[0] + fx * 2.15, standZ = door[1] + fz * 2.15;
    const yaw = Math.atan2(-fx, -fz);
    return { foot: true, wx: standX, wz: standZ, wyaw: yaw, x: standX, y: 1.6, z: standZ, look: [door[0], 1.4, door[1]] };
  }

  function setViewport(vp) {
    DPR = vp.dpr || 1;
    W = vp.w;
    H = vp.h;
    const cv = document.getElementById('c');
    cv.width = Math.max(1, Math.round(W * DPR));
    cv.height = Math.max(1, Math.round(H * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function clearNight() {
    ctx.save();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = '#05010c';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function wireBox(x0, y0, z0, x1, y1, z1, color) {
    const c = [
      [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
      [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]
    ];
    const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    ctx.beginPath();
    for (let i = 0; i < edges.length; i++) pathSeg(c[edges[i][0]], c[edges[i][1]]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    ctx.stroke();
  }

  function groundPad(cx, cz) {
    ctx.beginPath();
    wpoly([[cx - 70, 0, cz - 70], [cx + 70, 0, cz - 70], [cx + 70, 0, cz + 70], [cx - 70, 0, cz + 70]]);
    ctx.fillStyle = '#07060e';
    ctx.fill();
    ctx.beginPath();
    for (let i = -40; i <= 40; i += 5) {
      pathSeg([cx + i, 0.02, cz - 40], [cx + i, 0.02, cz + 40]);
      pathSeg([cx - 40, 0.02, cz + i], [cx + 40, 0.02, cz + i]);
    }
    ctx.strokeStyle = 'rgba(62,230,255,.28)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.stroke();
  }

  function scaleFigures(b) {
    const n = faceNormal(b);
    const door = personDoorData(b)[0] || (b.doors && b.doors[0]);
    const px = door ? door[0] : (b.x0 + b.x1) / 2;
    const pz = door ? door[1] : (b.z0 + b.z1) / 2;
    const tx = -n.nz, tz = n.nx;
    const ox = px + n.nx * 3.1, oz = pz + n.nz * 3.1;
    wireBox(ox - 0.22, 0, oz - 0.16, ox + 0.22, PERSON, oz + 0.16, '#ffe14d');
    wireBox(ox + tx * 0.85 - 0.18, 0, oz + tz * 0.85 - 0.14, ox + tx * 0.85 + 0.18, PET, oz + tz * 0.85 + 0.14, '#7dff6b');
    const cx0 = ox - tx * 3.4 - n.nx * 1.2;
    const cz0 = oz - tz * 3.4 - n.nz * 1.2;
    wireBox(cx0, 0, cz0, cx0 + tx * CAR.len, CAR.h, cz0 + tz * CAR.w, '#3ee6ff');
  }

  function hud(b, view, vp) {
    ctx.save();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.font = '700 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(5,1,12,.72)';
    ctx.fillRect(8, 8, Math.min(W - 16, 560), 36);
    ctx.fillStyle = '#e9fff2';
    ctx.fillText(labelOf(b) + '  ·  ' + view + '  ·  ' + vp, 14, 12);
    ctx.fillStyle = '#9ff3ff';
    ctx.fillText(CAR.name + ' ' + CAR.len + '×' + CAR.w + '×' + CAR.h + ' m   Ellie ' + PERSON + ' m   pet ' + PET + ' m', 14, 28);
    ctx.restore();
  }

  function paintBuilding(b, view, vp) {
    const spec = viewSpec(b, view);
    setViewport(vp);
    pose(spec);
    clearNight();
    if (window.DETAIL && typeof DETAIL.draw === 'function') DETAIL.draw();
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    groundPad(cx, cz);
    const d = Math.hypot((spec.foot ? cam.x : spec.x) - cx, (spec.foot ? cam.z : spec.z) - cz);
    drawBldg(b, Math.max(8, d));
    if (window.DETAIL && typeof DETAIL.pass === 'function') DETAIL.pass(ctx);
    scaleFigures(b);
    hud(b, view, vp.id || vp);
  }

  function shotName(b, view, vp) {
    const p = String(b.purpose || b.kind || 'b').toLowerCase().replace(/[^a-z0-9]+/g, '');
    return 'b' + b.id + '-' + p + '-' + view + '-' + vp + '.png';
  }

  function sig(b) {
    const boxes = (b.boxes || []).map(function (q) {
      return [rnd(q.x0), rnd(q.y0 || 0), rnd(q.z0), rnd(q.x1), rnd(q.y1), rnd(q.z1)].join(',');
    }).join('|');
    const doors = (b.doors || []).map(function (d) {
      return [rnd(d[0]), rnd(d[1]), d[2], d[3], d[4] || ''].join(',');
    }).join('|');
    const p = b.parking;
    const park = p ? [p.type, rnd(p.x0), rnd(p.x1), rnd(p.z0), rnd(p.z1), rnd(p.doorX), rnd(p.doorZ), rnd(p.h || 0), p.nx, p.nz].join(',') : '';
    return boxes + '#' + doors + '#' + park + '#' + rnd(b.top || 0);
  }

  function capturePath(fn) {
    const orig = pathLine;
    const segs = [];
    pathLine = function (pts) {
      if (pts && pts.length) segs.push(pts.map(function (p) { return [p[0], p[1], p[2]]; }));
      return orig.apply(this, arguments);
    };
    try { fn(); }
    finally { pathLine = orig; }
    return segs;
  }

  function quadSize(pts) {
    let y0 = 1e9, y1 = -1e9;
    const bottom = [];
    for (let i = 0; i < pts.length; i++) {
      y0 = Math.min(y0, pts[i][1]);
      y1 = Math.max(y1, pts[i][1]);
      if (pts[i][1] < 0.2) bottom.push(pts[i]);
    }
    let width = 0;
    for (let i = 0; i < bottom.length; i++) for (let j = i + 1; j < bottom.length; j++) {
      width = Math.max(width, Math.hypot(bottom[i][0] - bottom[j][0], bottom[i][2] - bottom[j][2]));
    }
    let cx = 0, cz = 0;
    for (let i = 0; i < pts.length; i++) { cx += pts[i][0]; cz += pts[i][2]; }
    cx /= pts.length; cz /= pts.length;
    return { y0: y0, y1: y1, height: y1 - y0, width: width, cx: cx, cz: cz };
  }

  function judgeDoor(d) {
    const fails = [];
    if (d.y0 > 0.15) fails.push('floating ' + rnd(d.y0) + ' m above the street');
    if (d.y0 < -0.05) fails.push('buried ' + rnd(-d.y0) + ' m under the street');
    if (d.kind === 'person' || d.kind === 'lot') {
      if (d.height < PERSON + 0.25) fails.push('too short for a ' + PERSON + ' m person (' + rnd(d.height) + ' m)');
      if (d.width < 0.85) fails.push('too narrow for a person (' + rnd(d.width) + ' m)');
      if (d.height < PET) fails.push('shorter than the pet');
    }
    if (d.kind === 'garage') {
      if (d.width < CAR.w + 0.25) fails.push('narrower than the ' + CAR.name + ' (' + rnd(d.width) + ' m door, car is ' + CAR.w + ' m wide)');
      if (d.height < CAR.h + 0.35) fails.push('lower than the ' + CAR.name + ' (' + rnd(d.height) + ' m door, car is ' + CAR.h + ' m tall)');
    }
    return fails;
  }

  function measureDrawnDoors(b) {
    const people = [];
    FLYCAM.orbit = true;
    WALK_MODE.onFoot = false;
    P.ground = true;
    P.driveMode = 'street';
    P.v = 4;
    const doors = personDoorData(b);
    for (let i = 0; i < doors.length; i++) {
      const d = doors[i];
      const nx = d[2] || 0, nz = d[3] || 0;
      const len = Math.hypot(nx, nz) || 1;
      cam.x = d[0] + nx / len * 12;
      cam.y = 2.2;
      cam.z = d[1] + nz / len * 12;
      aim(cam, [d[0], 1.2, d[1]]);
      let segs = [];
      try { segs = capturePath(function () { drawDoors(b, 16); }); }
      catch (e) { return { error: String(e && e.message || e), people: people, garage: null }; }
      for (let s = 0; s < segs.length; s++) {
        const q = quadSize(segs[s]);
        if (q.y0 > 0.08 || q.height < 1.8 || q.height > 3.1 || q.width < 0.7 || q.width > 3) continue;
        if (Math.hypot(q.cx - d[0], q.cz - d[1]) > 3) continue;
        let dup = false;
        for (let k = 0; k < people.length; k++) if (Math.hypot(people[k].cx - q.cx, people[k].cz - q.cz) < 0.4) dup = true;
        if (!dup) people.push(q);
      }
    }
    let garage = null;
    if (b.parking && b.parking.type === 'garage') {
      const p = b.parking;
      const nx = p.nx || 0, nz = p.nz || 0;
      cam.x = p.doorX + nx * 12;
      cam.y = 2.2;
      cam.z = p.doorZ + nz * 12;
      aim(cam, [p.doorX, 1.2, p.doorZ]);
      let segs = [];
      try { segs = capturePath(function () { drawParking(b, 16); }); }
      catch (e) { segs = []; }
      for (let i = 0; i < segs.length; i++) {
        const q = quadSize(segs[i]);
        if (q.y0 > 0.05 || q.height < 2 || q.height > 3.2 || q.width < 0.8 || q.width > 6) continue;
        if (!garage || q.width > garage.width) garage = q;
      }
    }
    return { people: people, garage: garage };
  }

  function judgeWindows(wins, face) {
    const fails = [];
    const cols = [];
    for (let i = 0; i < wins.length; i++) {
      const w = wins[i];
      if (w.u < face.u0 - 0.02 || w.u + w.w > face.u1 + 0.02) fails.push('crosses a side edge');
      if (w.y < face.y0 - 0.02 || w.y + w.h > face.y1 + 0.02) fails.push('cut off by the roof or the floor');
      if (cols.indexOf(rnd(w.u)) < 0) cols.push(rnd(w.u));
      for (let j = i + 1; j < wins.length; j++) {
        const o = wins[j];
        const ou = w.u < o.u + o.w - 0.05 && o.u < w.u + w.w - 0.05;
        const oy = w.y < o.y + o.h - 0.05 && o.y < w.y + w.h - 0.05;
        if (ou && oy) fails.push('two panes overlap');
      }
    }
    cols.sort(function (a, b) { return a - b; });
    if (cols.length >= 3) {
      const step = cols[1] - cols[0];
      for (let i = 2; i < cols.length; i++) {
        if (Math.abs((cols[i] - cols[i - 1]) - step) > 0.08) fails.push('columns are not on one grid');
      }
    }
    return fails;
  }

  function detailPanes(b) {
    if (!window.DETAIL || typeof DETAIL.wallSlots !== 'function') return { skip: 'no detail probe' };
    const q = b.boxes[0];
    const y0 = q.y0 > 0 ? q.y0 + 0.8 : (q.y0 || 0) + 5.1;
    const y1 = Math.min(q.y1 - 0.5, y0 + 9.2);
    if (y1 - y0 < 2.2) return { skip: 'face too short', wins: [] };
    if ((q.x1 - q.x0) < 3 || (q.z1 - q.z0) < 3) return { skip: 'face too narrow', wins: [] };
    const winW = (DETAIL.arch && DETAIL.arch.winW) || 1.65;
    const winH = (DETAIL.arch && DETAIL.arch.winH) || 1.2;
    const faces = [
      { axis: 'z', u0: q.x0, u1: q.x1, y0: y0, y1: y1 },
      { axis: 'x', u0: q.z0, u1: q.z1, y0: y0, y1: y1 }
    ];
    const wins = [];
    const faceFails = [];
    for (let f = 0; f < faces.length; f++) {
      const face = faces[f];
      const slots = DETAIL.wallSlots(face.u0, face.u1);
      const rows = [];
      for (let r = 0; r < 3; r++) {
        const yb = y0 + 0.45 + r * ((y1 - y0) / 3);
        if (yb + winH > y1) break;
        rows.push(yb);
      }
      const local = [];
      for (let s = 0; s < slots.length; s++) {
        const u = slots[s];
        if (u < face.u0 + 0.35 || u + winW > face.u1 - 0.35) continue;
        for (let r = 0; r < rows.length; r++) local.push({ u: u, y: rows[r], w: winW, h: winH });
      }
      if ((face.u1 - face.u0) > 8 && !local.length) faceFails.push('a wide face draws no window panes');
      const bad = judgeWindows(local, { u0: face.u0, u1: face.u1, y0: 0, y1: q.y1 });
      for (let i = 0; i < bad.length; i++) if (faceFails.indexOf(bad[i]) < 0) faceFails.push(bad[i]);
      for (let i = 0; i < local.length; i++) wins.push(local[i]);
    }
    return { wins: wins, y0: y0, y1: y1, fails: faceFails, winH: winH };
  }

  function baseRows(b) {
    const q = b.boxes[0];
    const gfh = (typeof GFH === 'number') ? GFH : 4.5;
    const st = 5.5;
    const rows = [];
    for (let y = (q.y0 || 0) + ((q.y0 || 0) > 0 ? 2 : gfh + 1.8); y < q.y1 - 1.5; y += st) {
      if (((Math.floor(y / st) * 31 + (b.wseed || 0)) % 7) === 0) continue;
      rows.push(y);
    }
    return { rows: rows, inset: 2, gfh: gfh };
  }

  function overlapVol(a, b) {
    const x = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
    const y = Math.min(a.y1, b.y1) - Math.max(a.y0 || 0, b.y0 || 0);
    const z = Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0);
    if (x <= 0.12 || y <= 0.12 || z <= 0.12) return 0;
    return x * y * z;
  }

  function zFight(a, b) {
    const pairs = [
      ['x', a.x0, b.x0], ['x', a.x0, b.x1], ['x', a.x1, b.x0], ['x', a.x1, b.x1],
      ['y', a.y0 || 0, b.y0 || 0], ['y', a.y0 || 0, b.y1], ['y', a.y1, b.y0 || 0], ['y', a.y1, b.y1],
      ['z', a.z0, b.z0], ['z', a.z0, b.z1], ['z', a.z1, b.z0], ['z', a.z1, b.z1]
    ];
    for (let i = 0; i < pairs.length; i++) {
      const gap = Math.abs(pairs[i][1] - pairs[i][2]);
      if (gap < 0.004 || gap > 0.03) continue;
      const axis = pairs[i][0];
      const u = axis === 'x' ? 'z' : 'x';
      const v = axis === 'y' ? 'z' : 'y';
      const u0 = u === 'x' ? 'x0' : (u === 'y' ? 'y0' : 'z0');
      const u1 = u === 'x' ? 'x1' : (u === 'y' ? 'y1' : 'z1');
      const v0 = v === 'y' ? 'y0' : 'z0';
      const v1 = v === 'y' ? 'y1' : 'z1';
      const du = Math.min(a[u1], b[u1]) - Math.max(a[u0] || 0, b[u0] || 0);
      const dv = Math.min(a[v1], b[v1]) - Math.max(a[v0] || 0, b[v0] || 0);
      if (du > 1 && dv > 1 && du * dv > 4) return rnd(gap);
    }
    return 0;
  }

  function supported(box, boxes) {
    if ((box.y0 || 0) <= 0.15) return true;
    for (let i = 0; i < boxes.length; i++) {
      const u = boxes[i];
      if (u === box) continue;
      if (Math.abs(u.y1 - (box.y0 || 0)) > 0.08) continue;
      const x = Math.min(box.x1, u.x1) - Math.max(box.x0, u.x0);
      const z = Math.min(box.z1, u.z1) - Math.max(box.z0, u.z0);
      if (x > 0.4 && z > 0.4) return true;
    }
    return false;
  }

  function roofFeature(b) {
    const deco = b.deco || [];
    for (let i = 0; i < deco.length; i++) {
      const k = deco[i][0];
      if (k === 'pad' || k === 'ant' || k === 'tank') return k;
    }
    return '';
  }

  function signGap(b) {
    const g = b.sign;
    if (!g || !b.boxes) return null;
    const y = g.y != null ? g.y : 0;
    let host = null;
    for (let i = 0; i < b.boxes.length; i++) {
      const q = b.boxes[i];
      if ((q.y0 || 0) - 0.2 <= y && q.y1 + 0.2 >= y) host = q;
    }
    host = host || b.boxes[0];
    const nx = g.nx || 0, nz = g.nz || 0;
    let gap = 0;
    if (nx < 0) gap = host.x0 - g.x;
    else if (nx > 0) gap = g.x - host.x1;
    else if (nz < 0) gap = host.z0 - g.z;
    else gap = g.z - host.z1;
    return { gap: gap, host: host, above: (g.y1 != null ? g.y1 : y) - (b.top || host.y1) };
  }

  function signFontPx(b, spec) {
    const g = b.sign;
    if (!g || !g.t) return 0;
    pose(spec);
    setViewport(VIEWPORTS[2]);
    const y0 = g.y0 != null ? g.y0 : g.y - (g.h || 2) / 2;
    const y1 = g.y1 != null ? g.y1 : g.y + (g.h || 2) / 2;
    const tx = -(g.nz || 0), tz = g.nx || 0;
    const hw = (g.w || 4) / 2;
    const a = proj(g.x - tx * hw, y0, g.z - tz * hw);
    const c = proj(g.x + tx * hw, y0, g.z + tz * hw);
    const e = proj(g.x, y1, g.z);
    const m = proj(g.x, (y0 + y1) / 2, g.z);
    if (!a || !c || !e || !m) return 0;
    const pw = Math.hypot(c[0] - a[0], c[1] - a[1]);
    const ph = Math.abs(e[1] - m[1]) * 1.65;
    let fs = Math.min(ph * 0.72, pw / (String(g.t).length * 0.52));
    if (!(fs >= 5)) return rnd(fs || 0);
    ctx.font = '900 ' + fs.toFixed(1) + 'px sans-serif';
    const tw = ctx.measureText(g.t).width;
    if (tw > pw * 0.88) fs *= pw * 0.88 / tw;
    return rnd(fs);
  }

  function muralQuad(f) {
    function p(u, v) {
      const along = (u - 0.5) * f.width;
      return [f.cx + f.nx * f.out + f.tx * along, f.y0 + v * f.height, f.cz + f.nz * f.out + f.tz * along];
    }
    return [p(0, 0), p(1, 0), p(1, 1), p(0, 1)];
  }

  function flatMural(b, f) {
    const q = muralQuad(f);
    const ax = Math.abs(f.nx) >= Math.abs(f.nz);
    let flat = true;
    const ref = ax ? q[0][0] : q[0][2];
    for (let i = 1; i < q.length; i++) {
      const v = ax ? q[i][0] : q[i][2];
      if (Math.abs(v - ref) > 0.08) flat = false;
    }
    const span = ax ? Math.abs(b.z1 - b.z0) : Math.abs(b.x1 - b.x0);
    const hung = f.width > span + 0.2;
    const cut = f.y0 < -0.05 || f.y0 + f.height > (b.top || f.y0 + f.height) + 0.15;
    return { flat: flat, hung: hung, cut: cut, area: f.width * f.height, corners: q };
  }

  function sampleMural(b) {
    const f = NEON_PAINT.muralFrame(b);
    paintBuilding(b, 'front', VIEWPORTS[2]);
    const info = flatMural(b, f);
    const mid = proj(f.cx + f.nx * (f.out + 0.05), f.y0 + f.height * 0.55, f.cz + f.nz * (f.out + 0.05));
    let pink = 0, lift = 0, seen = 0;
    if (mid) {
      const x0 = Math.max(0, Math.floor(mid[0] * DPR - 18));
      const y0 = Math.max(0, Math.floor(mid[1] * DPR - 18));
      const img = ctx.getImageData(x0, y0, 36, 36).data;
      for (let i = 0; i < img.length; i += 4) {
        seen++;
        const r = img[i], g = img[i + 1], bl = img[i + 2];
        if (r > 180 && bl > 140 && r > g + 40) pink++;
        if (bl > r + 8 && bl > 28 && r < 80) lift++;
      }
    }
    info.pink = pink;
    info.lift = lift;
    info.seen = seen;
    info.intact = pink > 2 || lift > 8;
    info.frame = { width: rnd(f.width), height: rnd(f.height), area: rnd(f.width * f.height), y0: rnd(f.y0), cx: rnd(f.cx), cz: rnd(f.cz) };
    return info;
  }

  function installBlurProbe() {
    if (installBlurProbe.done) return;
    installBlurProbe.done = true;
    installBlurProbe.hits = [];
    const proto = CanvasRenderingContext2D.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'shadowBlur');
    if (!desc || !desc.set) return;
    Object.defineProperty(proto, 'shadowBlur', {
      configurable: true,
      get: function () { return desc.get.call(this); },
      set: function (v) {
        if (v > 0.5) installBlurProbe.hits.push(v);
        desc.set.call(this, 0);
      }
    });
  }

  function calibrate() {
    const errors = [];
    function expect(name, fails, shouldFail) {
      const bad = Array.isArray(fails) ? fails.length > 0 : !!fails;
      const got = Array.isArray(fails) ? (bad ? fails.join('; ') : 'pass') : (bad ? 'fail' : 'pass');
      if (bad !== shouldFail) errors.push(name + ' expected ' + (shouldFail ? 'fail' : 'pass') + ' got ' + got);
    }
    expect('person door', judgeDoor({ kind: 'person', y0: 0, height: 2.4, width: 1.4 }), false);
    expect('floating door', judgeDoor({ kind: 'person', y0: 1.1, height: 2.4, width: 1.4 }), true);
    expect('short door', judgeDoor({ kind: 'person', y0: 0, height: 1.4, width: 1.4 }), true);
    expect('narrow door', judgeDoor({ kind: 'person', y0: 0, height: 2.4, width: 0.45 }), true);
    expect('buried door', judgeDoor({ kind: 'person', y0: -0.4, height: 2.4, width: 1.4 }), true);
    expect('garage fits', judgeDoor({ kind: 'garage', y0: 0, height: 2.6, width: 2.4 }), false);
    expect('garage mouth', judgeDoor({ kind: 'garage', y0: 0, height: 2.45, width: 1.44 }), true);
    const face = { u0: 0, u1: 20, y0: 0, y1: 12 };
    expect('window grid', judgeWindows([{ u: 2, y: 6, w: 1.65, h: 1.2 }, { u: 7.5, y: 6, w: 1.65, h: 1.2 }, { u: 13, y: 6, w: 1.65, h: 1.2 }], face), false);
    expect('window overlap', judgeWindows([{ u: 2, y: 6, w: 1.65, h: 1.2 }, { u: 3, y: 6.2, w: 1.65, h: 1.2 }], face), true);
    expect('window cut', judgeWindows([{ u: 18.6, y: 6, w: 1.65, h: 1.2 }], face), true);
    expect('stacked tiers', overlapVol({ x0: 0, x1: 10, y0: 0, y1: 6, z0: 0, z1: 10 }, { x0: 1, x1: 9, y0: 6, y1: 12, z0: 1, z1: 9 }) > 1, false);
    expect('intersect', overlapVol({ x0: 0, x1: 10, y0: 0, y1: 8, z0: 0, z1: 10 }, { x0: 8, x1: 14, y0: 0, y1: 8, z0: 0, z1: 10 }) > 1, true);
    expect('z-fight', zFight({ x0: 0, x1: 12, y0: 0, y1: 10, z0: 0, z1: 12 }, { x0: 0.02, x1: 12.02, y0: 0, y1: 10, z0: 0, z1: 12 }) > 0, true);
    expect('blur zero', [0, 0].some(function (v) { return v > 0.5; }), false);
    expect('blur glow', [0, 10].some(function (v) { return v > 0.5; }), true);
    if (PET >= PERSON) errors.push('pet reference is not shorter than the person');
    if (!(CAR.w > 1 && CAR.h > 1 && CAR.len > 3)) errors.push('car reference is not the 370Z');
    return { ok: errors.length === 0, errors: errors };
  }

  function readCar() {
    return fetch('/shared/car-wire.js').then(function (r) { return r.text(); }).then(function (t) {
      const m = /ZDM=\{([^}]+)\}/.exec(t);
      if (!m) return;
      const len = /len:([0-9.]+)/.exec(m[1]);
      const hw = /hw:([0-9.]+)/.exec(m[1]);
      const h = /(?:^|,)h:([0-9.]+)/.exec(m[1]);
      if (len) CAR.len = +len[1];
      if (hw) CAR.w = rnd(+hw[1] * 2);
      if (h) CAR.h = +h[1];
    }).catch(function () {});
  }

  function timeDraw(fn, n) {
    for (let i = 0; i < 3; i++) fn();
    const samples = [];
    for (let i = 0; i < n; i++) {
      const t0 = performance.now();
      fn();
      samples.push(performance.now() - t0);
    }
    samples.sort(function (a, b) { return a - b; });
    return { median: rnd(samples[Math.floor(samples.length / 2)]), max: rnd(samples[samples.length - 1]), n: n };
  }

  function buildingsNear(origin, limit) {
    const out = [];
    for (let i = 0; i < CITY.BL.length; i++) {
      const b = CITY.BL[i];
      const d = Math.hypot(b.cx - origin.x, b.cz - origin.z);
      if (d < limit) out.push(b);
    }
    return out;
  }

  const RAMP_LOT = 24;

  function riverLip(r) {
    const dir = r.dir || 0;
    if (dir === 0) return { x: (r.x0 + r.x1) / 2, z: r.z1 };
    if (dir === 1) return { x: r.x1, z: (r.z0 + r.z1) / 2 };
    if (dir === 2) return { x: (r.x0 + r.x1) / 2, z: r.z0 };
    return { x: r.x0, z: (r.z0 + r.z1) / 2 };
  }

  function rampRecord(r) {
    const riv = CITY.RIV || { z0: 0, z1: 0 };
    const lip = riverLip(r);
    const along = (r.dir % 2) ? (r.x1 - r.x0) : (r.z1 - r.z0);
    const across = (r.dir % 2) ? (r.z1 - r.z0) : (r.x1 - r.x0);
    const mid = (riv.z0 + riv.z1) / 2;
    const south = lip.z <= mid;
    const water = south ? riv.z0 : riv.z1;
    const lipToWater = south ? water - lip.z : lip.z - water;
    return {
      cx: rnd((r.x0 + r.x1) / 2),
      cz: rnd((r.z0 + r.z1) / 2),
      h: rnd(r.h || ((r.y1 || 0) - (r.yb || 0))),
      len: rnd(along),
      wid: rnd(across),
      dir: r.dir || 0,
      sz: r.sz || '',
      nm: r.nm || '',
      bank: south ? 'south' : 'north',
      lipToWater: rnd(lipToWater)
    };
  }

  function checkRamps(baseline, add) {
    const all = (CITY.RAMPS || []).filter(function (r) { return r && r.nm !== 'tow'; });
    const smallRiver = all.filter(function (r) {
      return r.nm === 'river' && (r.sz === 'small' || (r.h || 0) < 2.2);
    });
    const live = smallRiver.map(rampRecord);
    if (all.length < RAMP_LOT) {
      add('ramps', 'fail', 'Not enough ramps', 'The city should have a lot of ramps. This layout has ' + all.length + ', and the light floor is ' + RAMP_LOT + '. There is no upper limit, and a layout is not failed for having more.', null);
    }
    const floors = (baseline && baseline.riverEdge) || [];
    for (let i = 0; i < floors.length; i++) {
      const f = floors[i];
      let hit = null;
      for (let k = 0; k < live.length; k++) {
        if (Math.hypot(live[k].cx - f.cx, live[k].cz - f.cz) < 8) hit = live[k];
      }
      if (!hit) {
        add('ramps', 'fail', 'River-edge ramp moved', 'The small ramp that clears the river at about 80 mph is gone from the ' + f.bank + ' bank near ' + f.cx + ', ' + f.cz + '. Extra ramps are fine. This one stays.', null);
        continue;
      }
      const changed = Math.abs(hit.h - f.h) > 0.2 || Math.abs(hit.len - f.len) > 1 || Math.abs(hit.lipToWater - f.lipToWater) > 2 || hit.dir !== f.dir;
      if (changed) {
        add('ramps', 'fail', 'River-edge ramp changed', 'That small jump stays the same height, length, direction, and distance from the water. It was ' + f.h + ' m high and ' + f.len + ' m long, lip ' + f.lipToWater + ' m from the water. It is now ' + hit.h + ' m high and ' + hit.len + ' m long, lip ' + hit.lipToWater + ' m from the water.', null);
      }
    }
    return { count: all.length, lot: RAMP_LOT, riverEdge: live, locked: floors.length };
  }

  const ARCH = {
    preload: function () { return readCar().then(function () { return ARCH.scales(); }); },
    scales: function () { return { person: PERSON, pet: PET, car: { len: CAR.len, w: CAR.w, h: CAR.h, name: CAR.name } }; },
    plan: function () {
      return archList().map(function (b) {
        const names = [];
        for (let v = 0; v < VIEWS.length; v++) for (let p = 0; p < VIEWPORTS.length; p++) names.push(shotName(b, VIEWS[v], VIEWPORTS[p].id));
        return { id: b.id, purpose: b.purpose || '', label: labelOf(b), shots: names };
      });
    },
    shot: function (name) {
      const list = archList();
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        for (let v = 0; v < VIEWS.length; v++) for (let p = 0; p < VIEWPORTS.length; p++) {
          if (shotName(b, VIEWS[v], VIEWPORTS[p].id) !== name) continue;
          paintBuilding(b, VIEWS[v], VIEWPORTS[p]);
          return document.getElementById('c').toDataURL('image/png').split(',')[1];
        }
      }
      return '';
    },
    timeFps: function (viewport) {
      const vp = FPS_VIEW[viewport] || FPS_VIEW.pc;
      setViewport(vp);
      const list = archList();
      let subject = list[0];
      let best = -1;
      for (let i = 0; i < list.length; i++) {
        const n = buildingsNear(list[i], 120).length;
        if (n > best) { best = n; subject = list[i]; }
      }
      const spec = frontSpec(subject, 0.7);
      pose(spec);
      installBlurProbe();
      const before = installBlurProbe.hits.length;
      const one = timeDraw(function () {
        clearNight();
        if (window.DETAIL) DETAIL.draw();
        drawBldg(subject, 24);
        if (window.DETAIL) DETAIL.pass(ctx);
      }, 11);
      const blurOne = installBlurProbe.hits.length - before;
      const crowd = buildingsNear({ x: spec.x, z: spec.z }, (typeof CDRAW !== 'undefined' && CDRAW.dist) || 950);
      const pass = timeDraw(function () {
        clearNight();
        if (window.DETAIL) DETAIL.draw();
        for (let i = 0; i < crowd.length; i++) {
          const b = crowd[i];
          drawBldg(b, Math.hypot(b.cx - cam.x, b.cz - cam.z));
        }
        if (window.DETAIL) DETAIL.pass(ctx);
      }, 9);
      return {
        viewport: viewport,
        buffer: Math.round(vp.w * vp.dpr) + 'x' + Math.round(vp.h * vp.dpr),
        subject: refOf(subject),
        neighbors: crowd.length,
        one: one,
        pass: pass,
        blurHits: blurOne
      };
    },
    run: function (baseline) {
      installBlurProbe();
      const findings = [];
      const passes = [];
      function add(check, severity, title, detail, building) {
        let f = null;
        for (let i = 0; i < findings.length; i++) {
          if (findings[i].check === check && findings[i].title === title && findings[i].severity === severity) f = findings[i];
        }
        if (!f) {
          f = { check: check, severity: severity, title: title, detail: detail, buildings: [] };
          findings.push(f);
        }
        if (building) f.buildings.push(building);
      }
      const calib = calibrate();
      const list = archList();
      const summaries = [];
      const blurBefore = installBlurProbe.hits.length;

      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        const ref = refOf(b);
        const w = rnd(b.x1 - b.x0), d = rnd(b.z1 - b.z0), h = rnd(b.top || 0);
        const summary = { id: b.id, purpose: b.purpose || '', label: labelOf(b), district: b.district || '', w: w, d: d, h: h, color: b.c || '', roof: roofFeature(b) || 'flat', parking: b.parking ? b.parking.type : '', doors: (b.doors || []).length };
        summaries.push(summary);
        const minSide = Math.min(w, d);
        if (minSide < CAR.len * 1.2) add('scale', 'fail', 'Building is smaller than the car', 'A purpose building should read bigger than the ' + CAR.name + ' (' + CAR.len + ' m).', Object.assign({ note: minSide + ' m on the short side' }, ref));
        if (h < PERSON * 3) add('scale', 'fail', 'Building is short next to a person', 'The roof is under three person-heights (' + PERSON + ' m).', Object.assign({ note: h + ' m tall' }, ref));
        if (h / Math.max(minSide, 1) > 8) add('scale', 'fail', 'Tower is a needle', 'Height is more than eight times the short side.', Object.assign({ note: h + ' m on a ' + minSide + ' m side' }, ref));
        const gfh = (typeof GFH === 'number') ? GFH : 4.5;
        if (gfh < PERSON + 0.5 || gfh > 7) add('scale', 'fail', 'Ground floor is the wrong height', 'The ground floor is ' + gfh + ' m. A ' + PERSON + ' m person wants headroom without a cavern.', ref);

        const col = hexOf(b.c);
        if (!PALETTE[col]) add('style', 'fail', 'Color is outside the neon set', 'Stroke ' + (b.c || '(none)') + ' is not in the night palette.', ref);
        if (typeof b.draw === 'function') add('style', 'fail', 'Building uses a different draw path', 'This block does not go through the shared neon box drawer.', ref);

        const drawn = measureDrawnDoors(b);
        if (drawn.error) add('doors', 'fail', 'Door draw threw', drawn.error, ref);
        if (!personDoorData(b).length) add('doors', 'fail', 'No person door', 'A building needs a street door a person can walk through.', ref);
        if (!drawn.people.length && personDoorData(b).length) add('doors', 'fail', 'Person door did not draw', 'The door list is set, and the street camera did not get a door quad.', ref);
        for (let k = 0; k < drawn.people.length; k++) {
          const q = drawn.people[k];
          const bad = judgeDoor({ kind: 'person', y0: q.y0, height: q.height, width: q.width });
          for (let t = 0; t < bad.length; t++) add('doors', 'fail', 'Person door fails the bar', bad[t], ref);
          const data = personDoorData(b);
          let on = false;
          for (let t = 0; t < data.length; t++) {
            if (Math.hypot(data[t][0] - q.cx, data[t][1] - q.cz) < 2.5) on = true;
          }
          if (!on) add('doors', 'fail', 'Person door is off the wall', 'The drawn door does not sit on a door in the building data.', Object.assign({ note: rnd(q.width) + '×' + rnd(q.height) + ' m' }, ref));
        }
        if (b.parking && b.parking.type === 'garage') {
          const bayW = Math.abs(b.parking.nx) ? (b.parking.z1 - b.parking.z0) : (b.parking.x1 - b.parking.x0);
          const bayD = Math.abs(b.parking.nx) ? (b.parking.x1 - b.parking.x0) : (b.parking.z1 - b.parking.z0);
          const bayH = b.parking.h || 0;
          if (bayW < CAR.w + 0.4 || bayD < CAR.len + 0.6 || bayH < CAR.h + 0.5) {
            add('garage', 'fail', 'Garage bay does not fit the car', 'The bay is ' + rnd(bayW) + '×' + rnd(bayD) + '×' + rnd(bayH) + ' m. The ' + CAR.name + ' is ' + CAR.len + '×' + CAR.w + '×' + CAR.h + ' m.', ref);
          }
          if (!drawn.garage) add('garage', 'fail', 'Garage mouth did not draw', 'The bay is marked garage and the mouth quad was not captured.', ref);
          else {
            const bad = judgeDoor({ kind: 'garage', y0: drawn.garage.y0, height: drawn.garage.height, width: drawn.garage.width });
            if (bad.length) {
              add('garage', 'fail', 'Garage door is not car-sized', 'The mouth graphic sits on the center of the bay. It has to clear the ' + CAR.name + ' (' + CAR.w + ' m wide, ' + CAR.h + ' m tall) with room to spare.', Object.assign({ note: rnd(drawn.garage.width) + '×' + rnd(drawn.garage.height) + ' m door on a ' + rnd(bayW) + '×' + rnd(bayD) + '×' + rnd(bayH) + ' m bay. ' + bad.join('; ') + '.' }, ref));
            }
          }
        }

        const panes = detailPanes(b);
        if (panes.fails) for (let t = 0; t < panes.fails.length; t++) add('windows', 'fail', 'Window panes break the grid', panes.fails[t], ref);
        const rows = baseRows(b);
        for (let t = 0; t < rows.rows.length; t++) {
          if (rows.rows[t] < 2.55) add('windows', 'fail', 'Window band cuts the door', 'A facade line sits at ' + rnd(rows.rows[t]) + ' m, through the 2.4 m door.', ref);
          if (rows.rows[t] > (b.top || 0) - 1.2) add('windows', 'fail', 'Window band is cut by the roof', 'A facade line sits at ' + rnd(rows.rows[t]) + ' m on a ' + h + ' m building.', ref);
        }
        if (panes.wins && panes.wins.length && rows.rows.length) {
          let clash = false;
          for (let a = 0; a < rows.rows.length && !clash; a++) {
            for (let c = 0; c < panes.wins.length; c++) {
              const y = rows.rows[a];
              if (y > panes.wins[c].y + 0.08 && y < panes.wins[c].y + panes.wins[c].h - 0.08) clash = true;
            }
          }
          if (clash) add('windows', 'fail', 'Two window systems share the wall', 'The close view draws dashed floor lines every 5.5 m and 1.65×1.2 m panes on a different pitch. A floor line cuts through a pane.', ref);
        }

        for (let a = 0; a < b.boxes.length; a++) {
          const q = b.boxes[a];
          if (!supported(q, b.boxes)) add('geometry', 'fail', 'Box is floating', 'A volume starts at ' + rnd(q.y0 || 0) + ' m with nothing under it.', ref);
        }
        const feature = roofFeature(b);
        const roof = b.roofBox || b.boxes[b.boxes.length - 1];
        if (!roof || !(roof.y1 > 1)) add('roofs', 'fail', 'Roof is open', 'There is no cap on the top of the building.', ref);
        else if (Math.abs(roof.y1 - (b.top || roof.y1)) > 0.5) add('roofs', 'fail', 'Roof does not meet the stated top', 'The cap is at ' + rnd(roof.y1) + ' m and the building says ' + h + ' m.', ref);
        else if (!feature) add('roofs', 'fail', 'Roof is a blank slab from the air', 'The cap is closed and the neon edge draws. Nothing else is on the roof: no pad, tank, or antenna. A flying view cannot tell this roof from a lid.', ref);
        if (b.sign) {
          const gap = signGap(b);
          const fs = signFontPx(b, frontSpec(b, 0.72));
          summary.sign = b.sign.t || '';
          summary.signPx = fs;
          if (!b.sign.t) add('signs', 'fail', 'Sign has no word', 'The marquee is mounted and blank.', ref);
          if (!b.sign.mounted) add('signs', 'fail', 'Sign is not mounted', 'The sign record is missing the mounted flag.', ref);
          if (gap && (gap.gap < -0.05 || gap.gap > 0.45)) add('signs', 'fail', 'Sign is off the wall', 'The marquee sits ' + rnd(gap.gap) + ' m off the face.', ref);
          if (gap && gap.above > 0.08) add('signs', 'fail', 'Sign sticks above the roof', 'The top of the word is ' + rnd(gap.above) + ' m over the cap.', ref);
          if (b.sign.t && fs < 10) add('signs', 'fail', 'Sign is not readable from the street', 'At the front camera the word "' + b.sign.t + '" is ' + fs + ' px.', ref);
        } else add('signs', 'fail', 'Building has no sign', 'A street building needs a word on the face.', ref);
      }

      const boxes = [];
      for (let i = 0; i < list.length; i++) {
        for (let a = 0; a < list[i].boxes.length; a++) boxes.push({ b: list[i], q: list[i].boxes[a] });
      }
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        if (boxes[i].b === boxes[j].b) {
          const vol = overlapVol(boxes[i].q, boxes[j].q);
          if (vol > 1) add('geometry', 'fail', 'Volumes intersect inside one building', rnd(vol) + ' m³ overlap.', refOf(boxes[i].b));
          const gap = zFight(boxes[i].q, boxes[j].q);
          if (gap) add('geometry', 'fail', 'Faces z-fight', 'Two faces sit ' + gap + ' m apart and overlap.', refOf(boxes[i].b));
        } else {
          const vol = overlapVol(boxes[i].q, boxes[j].q);
          if (vol > 1) add('geometry', 'fail', 'Buildings intersect', rnd(vol) + ' m³ shared with ' + labelOf(boxes[j].b) + '.', refOf(boxes[i].b));
        }
      }

      const tier = { arcade: '', street: '', foot: '', stats: {} };
      if (list.length) {
        const subject = list[0];
        const snap0 = list.map(sig).join('||');
        function outsideDoor(b, meters) {
          const door = personDoorData(b)[0] || (b.doors && b.doors[0]) || [(b.x0 + b.x1) / 2, b.z0, 0, -1];
          const nlen = Math.hypot(door[2] || 0, door[3] || 0) || 1;
          const fx = (door[2] || 0) / nlen, fz = (door[3] || 0) / nlen;
          return {
            x: door[0] + fx * meters, y: 2.2, z: door[1] + fz * meters,
            look: [door[0], 2, door[1]],
            wx: door[0] + fx * meters, wz: door[1] + fz * meters,
            wyaw: Math.atan2(-fx, -fz)
          };
        }
        function runTier(mode) {
          const spec = outsideDoor(subject, mode === 'foot' ? 6 : 12);
          if (mode === 'arcade') { spec.air = true; spec.y = 6; }
          if (mode === 'foot') spec.foot = true;
          pose(spec);
          setViewport(VIEWPORTS[2]);
          clearNight();
          if (window.DETAIL) DETAIL.draw();
          drawBldg(subject, 18);
          if (window.DETAIL) DETAIL.pass(ctx);
          const st = window.DETAIL ? DETAIL.stats() : {};
          return { sig: list.map(sig).join('||'), store: st.storefronts || 0, foot: st.footSegs || 0, band: window.DETAIL ? DETAIL.band() : '' };
        }
        const arcade = runTier('arcade');
        const street = runTier('street');
        const foot = runTier('foot');
        tier.stats = { arcade: arcade, street: street, foot: foot };
        if (arcade.sig !== snap0 || street.sig !== snap0 || foot.sig !== snap0) {
          add('tiers', 'fail', 'Shape, doors, or garages change with the detail tier', 'Arcade, Street, and on-foot must keep the same boxes, doors, and garage. Only surface lines may change.', null);
        } else passes.push('Shape, doors, and garages match on Arcade, Street, and on foot.');
        if (arcade.store || arcade.foot) add('tiers', 'fail', 'Arcade tier is drawing street detail', 'The airborne pass still stroked storefronts or on-foot lines.', null);
        if (!street.store) add('tiers', 'fail', 'Street tier did not add storefronts', 'Standing in front of ' + labelOf(subject) + ' in Street mode produced no storefront segments.', refOf(subject));
        if (!foot.foot) add('tiers', 'fail', 'On-foot tier did not add eye-level detail', 'The on-foot pass produced no foot segments.', refOf(subject));
      }

      const murals = [];
      if (!(window.NEON_PAINT && typeof NEON_PAINT.muralFrame === 'function')) {
        add('mural', 'fail', 'Mural measurer missing', 'neon-paint.js did not export muralFrame to the checker.', null);
      } else {
        const dances = list.filter(function (b) { return b.purpose === 'DANCE' || (NEON_PAINT.isTaggedArts && NEON_PAINT.isTaggedArts(b)); });
        const floors = (baseline && baseline.murals) || [];
        for (let i = 0; i < dances.length; i++) {
          const b = dances[i];
          let info = null;
          try { info = sampleMural(b); }
          catch (e) { add('mural', 'fail', 'Mural draw threw', String(e && e.message || e), refOf(b)); continue; }
          murals.push(Object.assign({ id: b.id, purpose: b.purpose || '', label: labelOf(b) }, info.frame, { flat: info.flat, intact: info.intact }));
          if (!info.flat) add('mural', 'fail', 'Dance wall is not a flat mural', 'The mural quad leaves a single plane.', refOf(b));
          if (info.hung) add('mural', 'fail', 'Mural hangs off the wall', 'The quad is wider than the face it is mounted on.', refOf(b));
          if (info.cut) add('mural', 'fail', 'Mural is cut off the building', 'The quad starts below the street or climbs past the roof.', refOf(b));
          if (!info.intact) add('mural', 'fail', 'Mural did not draw', 'The front shot of the dance wall has no mural fill and no pink frame.', refOf(b));
          let floor = null;
          for (let k = 0; k < floors.length; k++) {
            if (Math.hypot((floors[k].cx || 0) - info.frame.cx, (floors[k].cz || 0) - info.frame.cz) < 40) floor = floors[k];
          }
          if (!floor && floors.length) floor = floors.slice().sort(function (a, c) { return a.area - c.area; })[0];
          if (floor && info.frame.area + 0.5 < floor.area * 0.98) {
            add('mural', 'fail', 'Dance mural shrank', 'This wall is ' + info.frame.width + '×' + info.frame.height + ' m (' + info.frame.area + ' m²). The floor for this spot is ' + floor.area + ' m².', refOf(b));
          }
        }
        if (!dances.length) add('mural', 'fail', 'Z dance building is missing', 'No DANCE building is in the city, so the mural wall is gone.', null);
        else if (!findings.some(function (f) { return f.check === 'mural'; })) {
          passes.push('Dance mural walls are flat, on the face, and at least as big as the recorded floor.');
        }
      }

      const ramps = checkRamps(baseline, add);
      if (!findings.some(function (f) { return f.check === 'ramps'; })) {
        passes.push('Lots of ramps (' + ramps.count + '). No upper limit. The small river-edge jump stays the one that clears the river at about 80 mph.');
      }

      const blurHits = installBlurProbe.hits.length - blurBefore;
      if (blurHits) add('shadow', 'fail', 'Building pass set shadowBlur', 'A review draw assigned a non-zero shadowBlur ' + blurHits + ' times. The probe forced the value back to 0 so the shot still shows the building. Glow belongs off this path.', null);

      const styled = findings.some(function (f) { return f.check === 'style' && f.severity === 'fail'; });
      if (!styled && list.length) passes.push('Every reviewed building uses the shared neon palette and the shared box drawer.');
      if (!findings.some(function (f) { return f.check === 'doors'; })) passes.push('Person doors sit on the street, wide enough and tall enough for a ' + PERSON + ' m person.');
      if (!findings.some(function (f) { return f.check === 'scale'; })) passes.push('Footprints clear the ' + CAR.name + ', and heights clear a ' + PERSON + ' m person and a ' + PET + ' m pet.');
      if (!findings.some(function (f) { return f.check === 'geometry'; })) passes.push('No floating boxes, intersecting volumes, or z-fighting faces in the reviewed set.');
      if (!findings.some(function (f) { return f.check === 'signs'; })) passes.push('Signs have a word, sit on the wall, and read at least 10 px from the front camera.');

      return {
        ok: calib.ok && !findings.some(function (f) { return f.severity === 'fail'; }),
        calib: calib,
        counts: { buildings: list.length, fails: findings.filter(function (f) { return f.severity === 'fail'; }).length },
        scales: ARCH.scales(),
        buildings: summaries,
        findings: findings,
        passes: passes,
        murals: murals,
        ramps: ramps,
        tier: tier.stats,
        blurHits: blurHits
      };
    }
  };
  window.ARCH = ARCH;

  readCar();
})();
