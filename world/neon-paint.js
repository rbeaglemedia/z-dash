'use strict';
// Neon Drawing — paint glowing strokes on the real 3D 370Z.
// The studio (neon-paint.html) is the Car Spin view: ZD.Xray.render,
// the glowing turntable rings, and GARAGEZ.apply for her saved look.
//
// Saved in localStorage['zdash.neonpaint.v1'] and announced on
// BroadcastChannel('zdash-neonpaint') plus the storage event.
//
// Record:
//   { version:1, enabled:true, activeSlot:0,
//     slots:[ { name, strokes:[...], updatedAt } ] }
// Stroke (points are in the part hinge's local space, wings closed):
//   { part:'body'|'doorL'|'doorR'|'hatch',
//     brush:'neon'|'rainbow'|'sparkle'|'laser'|'eraser',
//     color:'#ff4fd8', size:14, mirror:true|false, pulse:true|false,
//     group:1,
//     pts:[[x,y,z,nx,ny,nz], ...] }
//
// Two draws, so the paint cannot hide inside the body:
//   1. A ribbon mesh lifted 1.8 cm along the surface normal.
//   2. A 2D neon stroke projected onto the car image after X.render,
//      so drawZ's copy of X.canvas and the studio both show it.
(function () {
  const KEY = 'zdash.neonpaint.v1';
  const CH = 'zdash-neonpaint';
  const TAB = Math.random().toString(36).slice(2);
  const PARTS = { body: 1, doorL: 1, doorR: 1, hatch: 1 };
  const BRUSHES = { neon: 1, rainbow: 1, sparkle: 1, laser: 1, eraser: 1 };
  const COLORS = ['#3ee6ff', '#ff4fd8', '#7dff6b', '#ffe14d', '#9b5cff', '#ff2a3d', '#ffffff'];
  const LIFT = 0.018;
  const MAX_TRIS = 4200;

  let state = blank();
  let lastJson = '';
  let ch = null;
  let studio = null;
  let live = null;
  let liveMirror = null;
  let builtCar = null;
  let ribbons = [];
  let pulseMeshes = [];
  let pulseLoop = false;
  let surf = null;
  let hooked = false;
  let origRender = null;
  let blit = null;
  let scratch = null;
  let loopOn = false;
  let groupN = 1;
  const WALL_KEY = 'zdash.wallgraffiti.v1';
  const WALL_CH = 'zdash-wallgraffiti';
  const WALL_W = 22;
  const WALL_H = 14;
  const ARTS_SPOTS = [[-145, 760], [425, 1135]];
  let wallState = wallBlank();
  let wallJson = '';
  let wallCh = null;
  let wallLive = null;
  let wallLiveMirror = null;
  let wallGroup = 1;
  let artsCache = null;
  let grafFrame = 0;
  let grafArmed = false;
  const ui = {
    mode: 'spin', color: '#ff4fd8', style: 'neon', mirror: true, pulse: false,
    stamp: '', wings: false, yaw: 0.62, pitch: 0.38, zoom: 1,
    canvas: 'car', wallYaw: 0.30, wallZoom: 1, wallMirror: true, wallLook: false, stencil: ''
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function blank() {
    return {
      version: 1, enabled: true, activeSlot: 0,
      slots: [0, 1, 2].map(function (i) { return { name: 'SLOT ' + (i + 1), strokes: [], updatedAt: 0 }; })
    };
  }
  function clipName(s, fallback) {
    s = (typeof s === 'string' && s.trim()) ? s.trim().slice(0, 24) : fallback;
    return s || fallback;
  }
  function cleanStroke(s) {
    if (!s || !PARTS[s.part] || !BRUSHES[s.brush] || !Array.isArray(s.pts)) return null;
    const pts = [];
    for (let i = 0; i < s.pts.length && pts.length < 700; i++) {
      const p = s.pts[i];
      if (!p || p.length < 6) continue;
      const x = +p[0], y = +p[1], z = +p[2], nx = +p[3], ny = +p[4], nz = +p[5];
      if (x !== x || y !== y || z !== z || nx !== nx) continue;
      pts.push([x, y, z, nx, ny, nz]);
    }
    if (!pts.length || s.brush === 'eraser') return null;
    let size = +s.size;
    if (!(size > 0)) size = 14;
    const color = (typeof s.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(s.color)) ? s.color.toLowerCase() : '#ff4fd8';
    return {
      part: s.part, brush: s.brush, color: color, size: clamp(size, 1, 48),
      mirror: !!s.mirror, pulse: !!s.pulse, group: s.group | 0, pts: pts
    };
  }
  function normalize(data) {
    const slots = [0, 1, 2].map(function (i) {
      const s = data && data.slots && data.slots[i];
      const strokes = [];
      const raw = s && Array.isArray(s.strokes) ? s.strokes : [];
      for (let k = 0; k < raw.length && strokes.length < 400; k++) {
        const c = cleanStroke(raw[k]);
        if (c) strokes.push(c);
      }
      return { name: clipName(s && s.name, 'SLOT ' + (i + 1)), strokes: strokes, updatedAt: (s && +s.updatedAt) || 0 };
    });
    let active = data && data.activeSlot | 0;
    if (active < 0 || active > 2) active = 0;
    return { version: 1, enabled: !data || data.enabled !== false, activeSlot: active, slots: slots };
  }
  function readStore() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      return normalize(JSON.parse(raw));
    } catch (e) { return blank(); }
  }
  function slot() { return state.slots[state.activeSlot] || state.slots[0]; }
  function carX() {
    const X = window.ZD && window.ZD.Xray;
    return (X && X.ready && X.car) ? X : null;
  }
  function hasPaint() {
    if (!state.enabled) return false;
    const strokes = slot().strokes;
    for (let i = 0; i < strokes.length; i++) if (strokes[i].pts.length) return true;
    return false;
  }
  function load() { return JSON.parse(JSON.stringify(state)); }
  function write() {
    const json = JSON.stringify(state);
    lastJson = json;
    try { localStorage.setItem(KEY, json); } catch (e) {}
    try { if (ch) ch.postMessage({ tab: TAB, json: json }); } catch (e) {}
  }
  function save(data) {
    state = normalize(data || state);
    if (slot()) slot().updatedAt = Date.now();
    write();
    const X = carX();
    if (X) applyToCar(X);
    if (studio) syncUI();
    armPulse();
    return load();
  }
  function ingest(raw) {
    if (!raw) return;
    let data;
    try { data = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return; }
    const next = normalize(data);
    const json = JSON.stringify(next);
    if (json === lastJson) return;
    state = next;
    lastJson = json;
    const X = carX();
    if (X) applyToCar(X);
    if (studio) syncUI();
    armPulse();
  }

  function hostFor(X, part) {
    const S = window.ZGL && window.ZGL.S;
    if (S && (part === 'doorL' || part === 'doorR')) {
      if (part === 'doorL' && S.doorL && S.doorL.isObject3D) return S.doorL;
      if (part === 'doorR' && S.doorR && S.doorR.isObject3D) return S.doorR;
      const hinges = S.hingeD || [];
      for (let i = 0; i < hinges.length; i++) {
        const p = hinges[i];
        const side = p.userData && p.userData.p2 && p.userData.p2.userData.side;
        if (part === 'doorR' && side > 0) return p;
        if (part === 'doorL' && side < 0) return p;
      }
    }
    if (part === 'hatch' && S) {
      if (S.hatchP && S.hatchP.isObject3D) return S.hatchP;
      if (S.hingeH && S.hingeH.isObject3D) return S.hingeH;
    }
    return X.car;
  }
  function partOfMesh(mesh) {
    const S = window.ZGL && window.ZGL.S;
    function under(root) {
      if (!root) return false;
      let p = mesh;
      while (p) { if (p === root) return true; p = p.parent; }
      return false;
    }
    if (!S) return 'body';
    if (S.doorL && under(S.doorL)) return 'doorL';
    if (S.doorR && under(S.doorR)) return 'doorR';
    const hinges = S.hingeD || [];
    for (let i = 0; i < hinges.length; i++) {
      const h = hinges[i];
      if (!under(h)) continue;
      const side = h.userData && h.userData.p2 && h.userData.p2.userData.side;
      return side > 0 ? 'doorR' : 'doorL';
    }
    if ((S.hatchP && under(S.hatchP)) || (S.hingeH && under(S.hingeH))) return 'hatch';
    return 'body';
  }

  function buildSurface(X) {
    try { if (window.ZGL && window.ZGL.ensure) window.ZGL.ensure(); } catch (e) {}
    const V = X.THREE_Vector3;
    if (!V) return null;
    X.car.updateMatrixWorld(true);
    const tris = [];
    const meshes = [];
    X.car.traverse(function (o) {
      if (!o.isMesh || (o.userData && (o.userData.neonPaint || o.userData.crew))) return;
      const mat = o.userData && o.userData.mat;
      if (mat !== 'BODY' && mat !== 'CARBON') return;
      const geo = o.geometry;
      const pos = geo && geo.attributes && geo.attributes.position;
      const index = geo && geo.index;
      if (!pos || !index || !index.count) return;
      meshes.push(o);
    });
    let total = 0;
    for (let m = 0; m < meshes.length; m++) total += meshes[m].geometry.index.count / 3;
    const step = Math.max(1, Math.ceil(total / MAX_TRIS));
    const p = new V(), q = new V(), r = new V();
    for (let m = 0; m < meshes.length; m++) {
      const o = meshes[m];
      const part = partOfMesh(o);
      const host = hostFor(X, part);
      host.updateMatrixWorld(true);
      const inv = host.matrixWorld.clone();
      if (typeof inv.invert !== 'function') continue;
      inv.invert();
      const pos = o.geometry.attributes.position;
      const index = o.geometry.index;
      const nTri = index.count / 3;
      for (let t = 0; t < nTri; t += step) {
        const a = index.getX(t * 3), b = index.getX(t * 3 + 1), c = index.getX(t * 3 + 2);
        p.fromBufferAttribute(pos, a).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        q.fromBufferAttribute(pos, b).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        r.fromBufferAttribute(pos, c).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        const e1x = q.x - p.x, e1y = q.y - p.y, e1z = q.z - p.z;
        const e2x = r.x - p.x, e2y = r.y - p.y, e2z = r.z - p.z;
        let nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
        const nl = Math.hypot(nx, ny, nz);
        if (nl < 1e-6) continue;
        nx /= nl; ny /= nl; nz /= nl;
        const area = nl * 0.5;
        if (area < 1e-5) continue;
        tris.push({
          part: part,
          ax: p.x, ay: p.y, az: p.z,
          bx: q.x, by: q.y, bz: q.z,
          cx: r.x, cy: r.y, cz: r.z,
          nx: nx, ny: ny, nz: nz,
          mx: (p.x + q.x + r.x) / 3, my: (p.y + q.y + r.y) / 3, mz: (p.z + q.z + r.z) / 3
        });
      }
    }
    surf = { car: X.car, tris: tris };
    return surf;
  }
  function ensureSurface(X) {
    if (!surf || surf.car !== X.car || !surf.tris.length) buildSurface(X);
    return surf;
  }

  function projectWorld(X, x, y, z) {
    if (!X._rect || !X.cam || !X.THREE_Vector3) return null;
    const p = new X.THREE_Vector3(x, y, z).project(X.cam);
    if (p.z > 1) return null;
    const n = X._rect;
    const py = n[1] + (1 - p.y) / 2 * n[3];
    const up = new X.THREE_Vector3(x, y + 1, z).project(X.cam);
    const uy = n[1] + (1 - up.y) / 2 * n[3];
    return { x: n[0] + (p.x + 1) / 2 * n[2], y: py, z: p.z, m: Math.abs(py - uy) };
  }

  function pick(X, sx, sy) {
    const bag = ensureSurface(X);
    if (!bag || !bag.tris.length || !X.cam) return null;
    X.car.updateMatrixWorld(true);
    const cam = X.cam.position;
    const V = X.THREE_Vector3;
    const w = new V();
    let best = null;
    const tris = bag.tris;
    const near = [];
    for (let i = 0; i < tris.length; i++) {
      const t = tris[i];
      const host = hostFor(X, t.part);
      w.set(t.mx, t.my, t.mz);
      if (host.localToWorld) host.localToWorld(w);
      const s = projectWorld(X, w.x, w.y, w.z);
      if (!s) continue;
      const d = (s.x - sx) * (s.x - sx) + (s.y - sy) * (s.y - sy);
      if (d > 96 * 96) continue;
      near.push({ t: t, d: d, sx: s.x, sy: s.y });
    }
    near.sort(function (a, b) { return a.d - b.d; });
    const limit = Math.min(near.length, 14);
    for (let i = 0; i < limit; i++) {
      const t = near[i].t;
      const host = hostFor(X, t.part);
      function wp(x, y, z) {
        const v = new V(x, y, z);
        if (host.localToWorld) host.localToWorld(v);
        return v;
      }
      const A = wp(t.ax, t.ay, t.az), B = wp(t.bx, t.by, t.bz), C = wp(t.cx, t.cy, t.cz);
      const As = projectWorld(X, A.x, A.y, A.z);
      const Bs = projectWorld(X, B.x, B.y, B.z);
      const Cs = projectWorld(X, C.x, C.y, C.z);
      if (!As || !Bs || !Cs) continue;
      const hit = inside(sx, sy, As, Bs, Cs, t);
      if (!hit) continue;
      const lx = t.ax * hit.w + t.bx * hit.v + t.cx * hit.u;
      const ly = t.ay * hit.w + t.by * hit.v + t.cy * hit.u;
      const lz = t.az * hit.w + t.bz * hit.v + t.cz * hit.u;
      const n = new V(t.nx, t.ny, t.nz);
      if (n.transformDirection) n.transformDirection(host.matrixWorld);
      const wx = A.x * hit.w + B.x * hit.v + C.x * hit.u;
      const wy = A.y * hit.w + B.y * hit.v + C.y * hit.u;
      const wz = A.z * hit.w + B.z * hit.v + C.z * hit.u;
      const vx = cam.x - wx, vy = cam.y - wy, vz = cam.z - wz;
      const vl = Math.hypot(vx, vy, vz) || 1;
      let dot = (n.x * vx + n.y * vy + n.z * vz) / vl;
      let nx = t.nx, ny = t.ny, nz = t.nz;
      if (dot < 0) { nx = -nx; ny = -ny; nz = -nz; dot = -dot; }
      if (dot < 0.08) continue;
      best = { part: t.part, x: lx, y: ly, z: lz, nx: nx, ny: ny, nz: nz, d: near[i].d };
      break;
    }
    if (best) return best;
    if (near.length && near[0].d < 36 * 36) {
      const t = near[0].t;
      return { part: t.part, x: t.mx, y: t.my, z: t.mz, nx: t.nx, ny: t.ny, nz: t.nz, d: near[0].d };
    }
    return null;
  }
  function inside(px, py, A, B, C, t) {
    const v0x = C.x - A.x, v0y = C.y - A.y;
    const v1x = B.x - A.x, v1y = B.y - A.y;
    const v2x = px - A.x, v2y = py - A.y;
    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;
    const den = dot00 * dot11 - dot01 * dot01;
    if (Math.abs(den) < 1e-4) return null;
    const u = (dot11 * dot02 - dot01 * dot12) / den;
    const v = (dot00 * dot12 - dot01 * dot02) / den;
    const w = 1 - u - v;
    if (u < -0.04 || v < -0.04 || w < -0.04) return null;
    return { u: u, v: v, w: w, t: t };
  }

  function mirrorHit(X, hit) {
    const host = hostFor(X, hit.part);
    const destPart = hit.part === 'doorL' ? 'doorR' : hit.part === 'doorR' ? 'doorL' : hit.part;
    const dest = hostFor(X, destPart);
    host.updateMatrixWorld(true);
    dest.updateMatrixWorld(true);
    X.car.updateMatrixWorld(true);
    const V = X.THREE_Vector3;
    const p = new V(hit.x, hit.y, hit.z);
    if (host.localToWorld) host.localToWorld(p);
    if (X.car.worldToLocal) X.car.worldToLocal(p);
    p.z = -p.z;
    const n = new V(hit.nx, hit.ny, hit.nz);
    if (n.transformDirection) n.transformDirection(host.matrixWorld);
    const invCar = X.car.matrixWorld.clone();
    invCar.invert();
    n.transformDirection(invCar);
    n.z = -n.z;
    if (X.car.localToWorld) X.car.localToWorld(p);
    n.transformDirection(X.car.matrixWorld);
    if (dest.worldToLocal) dest.worldToLocal(p);
    const invDest = dest.matrixWorld.clone();
    invDest.invert();
    n.transformDirection(invDest);
    const nl = Math.hypot(n.x, n.y, n.z) || 1;
    return { part: destPart, x: p.x, y: p.y, z: p.z, nx: n.x / nl, ny: n.y / nl, nz: n.z / nl };
  }

  function brushNow() {
    const color = ui.color === 'rainbow' ? '#ffffff' : ui.color;
    if (ui.style === 'eraser') return { brush: 'eraser', size: 22, color: '#000000' };
    if (ui.style === 'sparkle') return { brush: 'sparkle', size: 12, color: ui.color === 'rainbow' ? '#ff4fd8' : color };
    if (ui.color === 'rainbow') {
      const size = ui.style === 'laser' ? 6 : (ui.style === 'spray' ? 22 : 16);
      return { brush: 'rainbow', size: size, color: '#ffffff' };
    }
    if (ui.style === 'laser') return { brush: 'laser', size: 6, color: color };
    if (ui.style === 'spray') return { brush: 'neon', size: 22, color: color };
    return { brush: 'neon', size: 16, color: color };
  }
  function halfWidth(size, brush) {
    const s = brush === 'laser' ? size * 0.42 : size;
    return clamp(s * 0.0036, 0.018, 0.08);
  }

  function activeStrokes() {
    const list = slot().strokes.slice();
    if (live && live.pts.length) list.push(live);
    if (liveMirror && liveMirror.pts.length) list.push(liveMirror);
    return list;
  }

  function dropMesh(m) {
    if (!m) return;
    if (m.parent) m.parent.remove(m);
    if (m.geometry && m.geometry.dispose) m.geometry.dispose();
    if (m.material && m.material.dispose) m.material.dispose();
  }
  function clearRibbons() {
    for (let i = 0; i < ribbons.length; i++) dropMesh(ribbons[i]);
    ribbons.length = 0;
    pulseMeshes.length = 0;
  }
  function makeGeo(X, pos, index) {
    const Geo = X.shadow.geometry.constructor;
    const Attr = X.shadow.geometry.attributes.position.constructor;
    const g = new Geo();
    if (g.deleteAttribute) {
      g.deleteAttribute('normal');
      g.deleteAttribute('uv');
      g.deleteAttribute('position');
    }
    if (g.clearGroups) g.clearGroups();
    g.setAttribute('position', new Attr(new Float32Array(pos), 3));
    g.setIndex(index);
    return g;
  }
  function ribbonMat(X, color) {
    // Brake sprites use SpriteMaterial, which cannot shade a mesh and
    // crashes the car renderer. Clone that material only when it is
    // already an unlit mesh material; otherwise clone the shadow plane.
    const brake = X.brakeSprites && X.brakeSprites[0] && X.brakeSprites[0].material;
    const seed = (brake && brake.isMeshBasicMaterial) ? brake : (X.shadow && X.shadow.material);
    if (!seed || !seed.clone) return null;
    const mat = seed.clone();
    mat.map = null;
    if (mat.color && mat.color.set) mat.color.set(color);
    mat.transparent = true;
    mat.opacity = 0.95;
    mat.blending = 2;
    mat.depthWrite = false;
    mat.depthTest = true;
    mat.side = 2;
    mat.fog = false;
    if ('toneMapped' in mat) mat.toneMapped = false;
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -4;
    mat.polygonOffsetUnits = -4;
    return mat;
  }
  function addRibbon(X, host, pts, color, pulse) {
    if (!pts || pts.length < 2) return;
    const half = halfWidth(pts.size || 16, pts.brush || 'neon');
    const lifted = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const nl = Math.hypot(p[3], p[4], p[5]) || 1;
      lifted.push([
        p[0] + p[3] / nl * LIFT,
        p[1] + p[4] / nl * LIFT,
        p[2] + p[5] / nl * LIFT,
        p[3] / nl, p[4] / nl, p[5] / nl
      ]);
    }
    const pos = [];
    const index = [];
    for (let i = 0; i < lifted.length; i++) {
      const p = lifted[i];
      const prev = lifted[Math.max(0, i - 1)];
      const next = lifted[Math.min(lifted.length - 1, i + 1)];
      const tx = next[0] - prev[0], ty = next[1] - prev[1], tz = next[2] - prev[2];
      let sx = ty * p[5] - tz * p[4];
      let sy = tz * p[3] - tx * p[5];
      let sz = tx * p[4] - ty * p[3];
      const sl = Math.hypot(sx, sy, sz) || 1;
      sx = sx / sl * half; sy = sy / sl * half; sz = sz / sl * half;
      pos.push(p[0] + sx, p[1] + sy, p[2] + sz, p[0] - sx, p[1] - sy, p[2] - sz);
    }
    for (let i = 0; i < lifted.length - 1; i++) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const mat = ribbonMat(X, color);
    if (!mat || !X.shadow) return;
    const mesh = new X.shadow.constructor(makeGeo(X, pos, index), mat);
    mesh.name = 'np-ribbon';
    mesh.userData.neonPaint = 1;
    mesh.userData.crew = 1;
    mesh.frustumCulled = false;
    mesh.renderOrder = 25;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    host.add(mesh);
    ribbons.push(mesh);
    if (pulse) pulseMeshes.push(mesh);
  }
  function applyToCar(X) {
    try {
      if (!X || !X.ready || !X.car || !X.shadow || !X.shadow.material) return false;
      try { if (window.ZGL && window.ZGL.ensure) window.ZGL.ensure(); } catch (e) {}
      if (window.GARAGEZ && window.GARAGEZ.apply) { try { window.GARAGEZ.apply(X); } catch (e) {} }
      ensureSurface(X);
      hookRender(X);
      if (builtCar !== X.car) {
        clearRibbons();
        builtCar = X.car;
      } else clearRibbons();
      const strokes = state.enabled ? slot().strokes : [];
      for (let i = 0; i < strokes.length; i++) {
        const s = strokes[i];
        const host = hostFor(X, s.part);
        if (s.brush === 'rainbow') {
          const chunk = 8;
          for (let k = 0; k < s.pts.length - 1; k += chunk - 1) {
            const slice = s.pts.slice(k, k + chunk);
            if (slice.length < 2) continue;
            const hue = (k / s.pts.length) * 360;
            addRibbon(X, host, tag(slice, s), 'hsl(' + hue + ',100%,62%)', s.pulse);
          }
        } else addRibbon(X, host, tag(s.pts, s), s.color, s.pulse);
      }
      armPulse();
      return true;
    } catch (e) {
      window.NEON_PAINT._err = String(e && e.stack || e);
      return false;
    }
  }
  function tag(pts, s) {
    pts.size = s.size;
    pts.brush = s.brush;
    return pts;
  }

  function armPulse() {
    if (pulseLoop) return;
    let any = false;
    const strokes = slot().strokes;
    for (let i = 0; i < strokes.length; i++) if (strokes[i].pulse) any = true;
    if (!any && !pulseMeshes.length) return;
    const loop = function () {
      if (!tickPulse()) { pulseLoop = false; return; }
      requestAnimationFrame(loop);
    };
    pulseLoop = true;
    requestAnimationFrame(loop);
  }
  function tickPulse() {
    let any = false;
    const strokes = slot().strokes;
    for (let i = 0; i < strokes.length; i++) if (strokes[i].pulse) any = true;
    if (!any) return false;
    const nos = !!(window.P && window.P.nosT);
    const t = (window.performance ? performance.now() : Date.now()) * 0.001;
    const wave = nos ? (0.55 + 0.45 * Math.sin(t * 16)) : (0.45 + 0.5 * Math.sin(t * 3.1));
    for (let i = 0; i < pulseMeshes.length; i++) {
      const m = pulseMeshes[i];
      if (m.material) m.material.opacity = clamp(wave, 0.25, 1);
    }
    return true;
  }

  function paintGlow(X) {
    if (!X || !X.canvas || !X._rect || !state.enabled) return;
    const strokes = activeStrokes();
    if (!strokes.length) return;
    const src = X.canvas;
    if (!scratch) scratch = document.createElement('canvas');
    if (scratch.width !== src.width || scratch.height !== src.height) {
      scratch.width = src.width;
      scratch.height = src.height;
    }
    const g = scratch.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, scratch.width, scratch.height);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    const rect = X._rect;
    const sx = src.width / (rect[2] || src.width);
    const sy = src.height / (rect[3] || src.height);
    const nos = !!(window.P && window.P.nosT);
    const tsec = (window.performance ? performance.now() : Date.now()) * 0.001;
    X.car.updateMatrixWorld(true);
    for (let i = 0; i < strokes.length; i++) {
      const s = strokes[i];
      const host = hostFor(X, s.part);
      if (host.updateMatrixWorld) host.updateMatrixWorld(true);
      const seq = [];
      for (let k = 0; k < s.pts.length; k++) {
        const p = s.pts[k];
        const w = new X.THREE_Vector3(p[0], p[1], p[2]);
        if (host.localToWorld) host.localToWorld(w);
        const n = new X.THREE_Vector3(p[3], p[4], p[5]);
        if (n.transformDirection) n.transformDirection(host.matrixWorld);
        const cam = X.cam.position;
        const vx = cam.x - w.x, vy = cam.y - w.y, vz = cam.z - w.z;
        const vl = Math.hypot(vx, vy, vz) || 1;
        const dot = (n.x * vx + n.y * vy + n.z * vz) / vl;
        const pr = projectWorld(X, w.x, w.y, w.z);
        if (!pr) { seq.push(null); continue; }
        if (dot < 0.02) { seq.push(null); continue; }
        seq.push(pr);
      }
      const pulse = s.pulse ? (nos ? 0.65 + 0.35 * Math.sin(tsec * 16) : 0.7 + 0.3 * Math.sin(tsec * 3)) : 1;
      stroke2d(g, seq, s, sx, sy, pulse, src.width, rect);
    }
    blitGlow(src, scratch);
    return scratch;
  }
  function stroke2d(g, seq, s, sx, sy, pulse, bufW, rect) {
    const runs = [];
    let cur = [];
    for (let i = 0; i < seq.length; i++) {
      if (!seq[i]) { if (cur.length) runs.push(cur); cur = []; continue; }
      cur.push(seq[i]);
    }
    if (cur.length) runs.push(cur);
    function xy(p) { return [(p.x - rect[0]) * sx, (p.y - rect[1]) * sy]; }
    for (let r = 0; r < runs.length; r++) {
      const run = runs[r];
      if (!run.length) continue;
      const m = run[0].m || 40;
      const lw = Math.max(bufW * 0.022, halfWidth(s.size, s.brush) * 2.6 * m) * (0.85 + 0.15 * pulse);
      const color = s.brush === 'rainbow' ? 'hsl(' + ((r * 48 + (s.group || 0) * 30) % 360) + ',100%,64%)' : s.color;
      g.save();
      g.globalAlpha = 0.95 * pulse;
      g.beginPath();
      for (let i = 0; i < run.length; i++) {
        const p = xy(run[i]);
        if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
      }
      if (run.length === 1) {
        const p = xy(run[0]);
        g.lineTo(p[0] + 0.8, p[1]);
      }
      g.strokeStyle = color;
      g.shadowColor = color;
      g.shadowBlur = lw * 1.7;
      g.lineWidth = s.brush === 'laser' ? Math.max(bufW * 0.008, lw * 0.45) : lw;
      g.stroke();
      g.shadowBlur = lw * 0.35;
      g.strokeStyle = '#ffffff';
      g.globalAlpha = 0.9 * pulse;
      g.lineWidth = Math.max(2, g.lineWidth * 0.34);
      g.stroke();
      if (s.brush === 'sparkle') {
        for (let i = 0; i < run.length; i += 3) {
          const p = xy(run[i]);
          star2d(g, p[0], p[1], Math.max(7, lw * 0.7), color);
        }
      }
      g.restore();
    }
  }
  function star2d(g, x, y, r, color) {
    g.save();
    g.translate(x, y);
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * 0.4 : r;
      g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    g.closePath();
    g.fillStyle = color;
    g.shadowColor = color;
    g.shadowBlur = r;
    g.fill();
    g.restore();
  }

  function blitGlow(glCanvas, image) {
    const gl = glCanvas.getContext('webgl2') || glCanvas.getContext('webgl');
    if (!gl) return;
    const prog = blitProg(gl);
    if (!prog) return;
    const is2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    const prevProg = gl.getParameter(gl.CURRENT_PROGRAM);
    const prevFB = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    const prevActive = gl.getParameter(gl.ACTIVE_TEXTURE);
    const prevTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
    const prevArr = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    const prevView = gl.getParameter(gl.VIEWPORT);
    const depth = gl.isEnabled(gl.DEPTH_TEST);
    const blend = gl.isEnabled(gl.BLEND);
    const cull = gl.isEnabled(gl.CULL_FACE);
    const scissor = gl.isEnabled(gl.SCISSOR_TEST);
    let prevVAO = null;
    if (is2 && gl.bindVertexArray) {
      prevVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
      gl.bindVertexArray(null);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.SCISSOR_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(prog.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, prog.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindBuffer(gl.ARRAY_BUFFER, prog.buf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (is2 && gl.bindVertexArray) gl.bindVertexArray(prevVAO);
    gl.useProgram(prevProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevFB);
    gl.activeTexture(prevActive);
    gl.bindTexture(gl.TEXTURE_2D, prevTex);
    gl.bindBuffer(gl.ARRAY_BUFFER, prevArr);
    gl.viewport(prevView[0], prevView[1], prevView[2], prevView[3]);
    if (depth) gl.enable(gl.DEPTH_TEST); else gl.disable(gl.DEPTH_TEST);
    if (blend) gl.enable(gl.BLEND); else gl.disable(gl.BLEND);
    if (cull) gl.enable(gl.CULL_FACE); else gl.disable(gl.CULL_FACE);
    if (scissor) gl.enable(gl.SCISSOR_TEST); else gl.disable(gl.SCISSOR_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  function blitProg(gl) {
    if (blit && blit.gl === gl) return blit;
    const vs = 'attribute vec2 aPos;attribute vec2 aUv;varying vec2 vUv;void main(){vUv=aUv;gl_Position=vec4(aPos,0.0,1.0);}';
    const fs = 'precision mediump float;varying vec2 vUv;uniform sampler2D uMap;void main(){vec4 c=texture2D(uMap,vUv);gl_FragColor=vec4(c.rgb*c.a,c.a);}';
    function sh(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.bindAttribLocation(p, 1, 'aUv');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1,
      -1, -1, 0, 0, 1, 1, 1, 1, -1, 1, 0, 1
    ]), gl.STATIC_DRAW);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const loc = gl.getUniformLocation(p, 'uMap');
    gl.useProgram(p);
    gl.uniform1i(loc, 0);
    blit = { gl: gl, p: p, buf: buf, tex: tex };
    return blit;
  }

  function hookRender(X) {
    if (!X || !X.render || hooked) return;
    hooked = true;
    origRender = X.render.bind(X);
    X.render = function (ctx, x, y, w, h, opts) {
      const out = origRender(ctx, x, y, w, h, opts);
      try {
        const glow = paintGlow(X);
        if (glow && ctx && ctx.drawImage && opts && !opts.noDraw && X._rect) {
          const r = X._rect;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(glow, r[0], r[1], r[2], r[3]);
          ctx.restore();
        }
      } catch (e) { window.NEON_PAINT._err = String(e && e.message || e); }
      return out;
    };
  }

  function basis(nx, ny, nz) {
    const ax = Math.abs(ny) < 0.85 ? 0 : 1;
    const ay = Math.abs(ny) < 0.85 ? 1 : 0;
    const az = 0;
    let tx = ay * nz - az * ny, ty = az * nx - ax * nz, tz = ax * ny - ay * nx;
    let tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl; ty /= tl; tz /= tl;
    const bx = ny * tz - nz * ty, by = nz * tx - nx * tz, bz = nx * ty - ny * tx;
    return { tx: tx, ty: ty, tz: tz, bx: bx, by: by, bz: bz };
  }
  function stampPolys(kind) {
    if (kind === 'star') return [starPoly()];
    if (kind === 'heart') return [heartPoly()];
    if (kind === 'bolt') return [[[-0.35, 0.95], [0.15, 0.05], [-0.15, 0.05], [0.4, -1], [-0.1, -0.05], [0.2, -0.05], [-0.4, 1]]];
    if (kind === 'crown') return [[[-0.9, -0.2], [-0.9, 0.25], [-0.45, -0.05], [0, 0.7], [0.45, -0.05], [0.9, 0.25], [0.9, -0.2], [-0.9, -0.2]]];
    if (kind === 'flame') return [[[0, 1], [-0.45, 0.2], [-0.2, 0.25], [-0.55, -0.35], [0, -1], [0.55, -0.35], [0.2, 0.25], [0.45, 0.2], [0, 1]]];
    if (kind === 'note') return [[[-0.15, -0.2], [-0.15, 0.85], [0.55, 0.65], [0.55, -0.35]], ellipse(-0.15, -0.35, 0.38, 0.28), ellipse(0.55, 0.05, 0.38, 0.28)];
    if (kind === 'z') return [[[-0.7, 0.7], [0.7, 0.7], [-0.7, -0.7], [0.7, -0.7]]];
    if (kind === 'paw') return [ellipse(0, -0.15, 0.48, 0.4), ellipse(-0.48, 0.42, 0.2, 0.26), ellipse(-0.16, 0.62, 0.18, 0.24), ellipse(0.18, 0.62, 0.18, 0.24), ellipse(0.5, 0.38, 0.2, 0.26)];
    return [starPoly()];
  }
  function ellipse(cx, cy, rx, ry) {
    const p = [];
    for (let i = 0; i <= 18; i++) {
      const a = i / 18 * Math.PI * 2;
      p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return p;
  }
  function starPoly() {
    const p = [];
    for (let i = 0; i <= 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 ? 0.4 : 1;
      p.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return p;
  }
  function heartPoly() {
    const p = [];
    for (let i = 0; i <= 36; i++) {
      const t = i / 36 * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      p.push([x / 18, y / 18]);
    }
    return p;
  }
  function placeStamp(X, hit) {
    const polys = stampPolys(ui.stamp);
    const b = brushNow();
    if (b.brush === 'eraser') return;
    const scale = 0.2;
    const B = basis(hit.nx, hit.ny, hit.nz);
    const group = groupN++;
    function bake(one, part) {
      const strokes = [];
      for (let i = 0; i < polys.length; i++) {
        const pts = [];
        for (let k = 0; k < polys[i].length; k++) {
          const u = polys[i][k][0] * scale, v = polys[i][k][1] * scale;
          pts.push([
            one.x + B.tx * u + B.bx * v,
            one.y + B.ty * u + B.by * v,
            one.z + B.tz * u + B.bz * v,
            one.nx, one.ny, one.nz
          ]);
        }
        strokes.push({
          part: part, brush: b.brush === 'eraser' ? 'neon' : b.brush, color: b.color,
          size: Math.max(b.size, 14), mirror: false, pulse: ui.pulse, group: group, pts: pts
        });
      }
      return strokes;
    }
    const made = bake(hit, hit.part);
    for (let i = 0; i < made.length; i++) slot().strokes.push(made[i]);
    if (ui.mirror) {
      const m = mirrorHit(X, hit);
      const Bm = basis(m.nx, m.ny, m.nz);
      const alt = bake(m, m.part);
      for (let i = 0; i < alt.length; i++) {
        // Rebuild on the mirrored tangent so the sticker sits on that skin.
        const pts = [];
        const poly = polys[i % polys.length];
        for (let k = 0; k < poly.length; k++) {
          const u = poly[k][0] * scale, v = -poly[k][1] * scale;
          pts.push([
            m.x + Bm.tx * u + Bm.bx * v,
            m.y + Bm.ty * u + Bm.by * v,
            m.z + Bm.tz * u + Bm.bz * v,
            m.nx, m.ny, m.nz
          ]);
        }
        alt[i].pts = pts;
        alt[i].part = m.part;
        slot().strokes.push(alt[i]);
      }
    }
    save(state);
    setStatus('STICKER SAVED');
  }

  function pushPoint(stroke, hit) {
    const prev = stroke.pts[stroke.pts.length - 1];
    if (prev) {
      const dx = hit.x - prev[0], dy = hit.y - prev[1], dz = hit.z - prev[2];
      if (Math.hypot(dx, dy, dz) < 0.012) return;
    }
    if (stroke.pts.length < 700) stroke.pts.push([hit.x, hit.y, hit.z, hit.nx, hit.ny, hit.nz]);
  }
  function commitLive(X) {
    if (live && live.pts.length > 1) slot().strokes.push(live);
    if (liveMirror && liveMirror.pts.length > 1) slot().strokes.push(liveMirror);
    live = null;
    liveMirror = null;
    save(state);
    setStatus('SAVED TO THE GARAGE');
  }
  function eraseNear(X, hit) {
    const host = hostFor(X, hit.part);
    const strokes = slot().strokes;
    const keep = [];
    for (let i = 0; i < strokes.length; i++) {
      const s = strokes[i];
      if (s.part !== hit.part) { keep.push(s); continue; }
      let close = false;
      for (let k = 0; k < s.pts.length; k++) {
        const p = s.pts[k];
        if (Math.hypot(p[0] - hit.x, p[1] - hit.y, p[2] - hit.z) < 0.09) { close = true; break; }
      }
      if (!close) keep.push(s);
    }
    slot().strokes = keep;
    save(state);
  }

  function hookReady() {
    const X = carX();
    if (!X) return false;
    hookRender(X);
    if (hasPaint()) applyToCar(X);
    else ensureSurface(X);
    return true;
  }

  let cssDone = false;
  function ensureCss() {
    if (cssDone || document.getElementById('np-css')) return;
    cssDone = true;
    const s = document.createElement('style');
    s.id = 'np-css';
    s.textContent = [
      '#np-studio{position:fixed;inset:0;z-index:80;color:#fff;font-family:Orbitron,sans-serif;background:#07010f;display:flex;flex-direction:column}',
      '#np-studio *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
      '.np-top{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:4px 6px;flex:none}',
      '.np-top h1{margin:0;font:900 12px Orbitron,sans-serif;letter-spacing:.6px;color:#fff;text-shadow:0 0 8px #ff4fd8}',
      '.np-status{margin-left:auto;font:700 9px Orbitron,sans-serif;color:#ffe14d}',
      '.np-top button,.np-tools button{font:800 8px Orbitron,sans-serif;letter-spacing:.3px;color:#fff;background:rgba(62,230,255,.08);border:1.5px solid rgba(62,230,255,.55);border-radius:999px;padding:4px 7px;cursor:pointer}',
      '.np-top button.on,.np-tools button.on{background:#ffe14d;color:#1a0633;border-color:#fff;box-shadow:0 0 8px #ffe14d}',
      '.np-main{flex:1;min-height:0;display:grid;grid-template-columns:1fr 228px}',
      '.np-stage{min-width:0;min-height:0;position:relative;background:radial-gradient(circle at 50% 70%,#1a0a2e,#05020c 70%)}',
      '.np-stage canvas{width:100%;height:100%;display:block;touch-action:none;cursor:crosshair}',
      '.np-stage.spin canvas{cursor:grab}',
      '.np-tools{overflow:auto;min-height:0;padding:6px;display:flex;flex-direction:column;gap:5px;border-left:1px solid rgba(62,230,255,.35);background:rgba(8,2,18,.72)}',
      '.np-row{display:flex;flex-wrap:wrap;gap:4px}',
      '.np-row button{flex:1;min-width:0}',
      '.np-colors button{flex:0 0 24px;width:24px;height:24px;padding:0;border-radius:50%;border:2px solid rgba(255,255,255,.3)}',
      '.np-stamps button{flex:1 0 21%;font-size:14px;padding:3px 0;border-radius:10px}',
      '.np-save{background:linear-gradient(90deg,#ffe14d,#ff9a2e);color:#1a0633;border:0;font:900 12px Orbitron,sans-serif;border-radius:12px;padding:8px;letter-spacing:1px;cursor:pointer}',
      '.np-lab{font:700 8px Orbitron,sans-serif;letter-spacing:1px;color:#3ee6ff;margin:0}',
      '.np-zoom{width:100%;accent-color:#ff4fd8}',
      '.np-modes{display:flex;gap:6px;padding:6px 6px 0;flex:none}',
      '.np-modes button{flex:1;font:900 11px Orbitron,sans-serif;letter-spacing:.4px;padding:8px 6px;border-radius:12px;color:#fff;background:rgba(22,11,40,.9);border:1.5px solid rgba(255,79,216,.65);cursor:pointer}',
      '.np-modes button.on{background:#ff4fd8;color:#1a0633;border-color:#fff;box-shadow:0 0 14px #ff4fd8}',
      '.np-off{display:none !important}'
    ].join('');
    document.head.appendChild(s);
  }
  function swatchStyle(c) {
    if (c === 'rainbow') return 'background:conic-gradient(#ff2a3d,#ffe14d,#7dff6b,#3ee6ff,#9b5cff,#ff4fd8,#ff2a3d)';
    return 'background:' + c;
  }
  function studioHTML() {
    const colors = COLORS.concat(['rainbow']).map(function (c) {
      return '<button type="button" data-color="' + c + '" style="' + swatchStyle(c) + '"></button>';
    }).join('');
    const stamps = [['bolt', '⚡'], ['star', '⭐'], ['crown', '👑'], ['heart', '♥'], ['flame', '🔥'], ['note', '♪'], ['z', 'Z'], ['paw', '🐾']];
    const stampBtns = stamps.map(function (s) {
      return '<button type="button" data-stamp="' + s[0] + '">' + s[1] + '</button>';
    }).join('');
    return '<div class="np-modes">' +
      '<button type="button" data-canvas-mode="car">🚗 3D CAR PAINT (370Z)</button>' +
      '<button type="button" data-canvas-mode="wall">🧱 Z COMPANY ARTS GRAFFITI WALL (BUILDING SIGN)</button></div>' +
      '<div class="np-top" data-panel="car"><h1>NEON DRAW</h1>' +
      '<button type="button" data-mode="spin" class="on">🔄 SPIN</button>' +
      '<button type="button" data-mode="draw">✏️ DRAW</button>' +
      '<button type="button" data-cam="hood">FRONT / HOOD</button>' +
      '<button type="button" data-cam="top">TOP / ROOF</button>' +
      '<button type="button" data-cam="left">LEFT DOOR</button>' +
      '<button type="button" data-cam="right">RIGHT DOOR</button>' +
      '<button type="button" data-cam="rear">REAR</button>' +
      '<button type="button" data-act="wings">WINGS CLOSED</button>' +
      '<div class="np-status" id="np-status">DRAG TO SPIN</div></div>' +
      '<div class="np-top np-off" data-panel="wall"><h1>GRAFFITI WALL</h1>' +
      '<button type="button" data-act="wall-look">🔄 ANGLE</button>' +
      '<button type="button" data-act="wall-draw">✏️ DRAW</button>' +
      '<div class="np-status" id="np-status-wall">DRAW THE SIGN</div></div>' +
      '<div class="np-main"><div class="np-stage spin"><canvas data-canvas="spin"></canvas></div>' +
      '<div class="np-tools" data-panel="car">' +
      '<p class="np-lab">COLOR</p><div class="np-row np-colors">' + colors + '</div>' +
      '<p class="np-lab">BRUSH</p><div class="np-row">' +
      '<button type="button" data-brush="neon" class="on">TUBE</button>' +
      '<button type="button" data-brush="laser">LASER</button>' +
      '<button type="button" data-brush="spray">SPRAY</button>' +
      '<button type="button" data-brush="sparkle">SPARK</button>' +
      '<button type="button" data-brush="eraser">ERASE</button></div>' +
      '<div class="np-row"><button type="button" data-act="mirror" class="on">🪞 SYM</button>' +
      '<button type="button" data-act="pulse">💓 PULSE</button></div>' +
      '<p class="np-lab">STICKERS</p><div class="np-row np-stamps">' + stampBtns + '</div>' +
      '<p class="np-lab">ZOOM</p><input class="np-zoom" data-act="zoom" type="range" min="70" max="160" value="100">' +
      '<div class="np-row"><button type="button" data-act="slot" data-slot="0" class="on">1</button>' +
      '<button type="button" data-act="slot" data-slot="1">2</button>' +
      '<button type="button" data-act="slot" data-slot="2">3</button></div>' +
      '<div class="np-row"><button type="button" data-act="undo">UNDO</button>' +
      '<button type="button" data-act="clear">CLEAR</button></div>' +
      '<button type="button" class="np-save" data-act="save">SAVE</button></div>' +
      '<div class="np-tools np-off" data-panel="wall">' +
      '<p class="np-lab">COLOR</p><div class="np-row np-colors">' + colors + '</div>' +
      '<p class="np-lab">BRUSH</p><div class="np-row">' +
      '<button type="button" data-brush="neon">TUBE</button>' +
      '<button type="button" data-brush="spray">SPRAY</button>' +
      '<button type="button" data-brush="ribbon">RIBBON</button>' +
      '<button type="button" data-brush="line">LINE</button>' +
      '<button type="button" data-brush="rainbow">RAINBOW</button></div>' +
      '<div class="np-row"><button type="button" data-act="wall-mirror" class="on">🪞 MIRROR</button></div>' +
      '<p class="np-lab">STAMPS</p><div class="np-row np-stamps">' +
      '<button type="button" data-stamp="star">⭐</button>' +
      '<button type="button" data-stamp="heart">♥</button>' +
      '<button type="button" data-stamp="crown">👑</button>' +
      '<button type="button" data-stamp="note">♪</button>' +
      '<button type="button" data-stamp="dance">💃</button></div>' +
      '<p class="np-lab">LETTER STENCILS</p><div class="np-row">' +
      '<button type="button" data-stencil="Z CO">Z CO</button>' +
      '<button type="button" data-stencil="ELLIE">ELLIE</button>' +
      '<button type="button" data-stencil="DANCE">DANCE</button>' +
      '<button type="button" data-stencil="★">★</button></div>' +
      '<p class="np-lab">WALL ANGLE</p><input class="np-zoom" data-act="wall-yaw" type="range" min="-80" max="80" value="17">' +
      '<div class="np-row"><button type="button" data-act="wall-slot" data-slot="0">Slot 1</button>' +
      '<button type="button" data-act="wall-slot" data-slot="1">Slot 2</button>' +
      '<button type="button" data-act="wall-slot" data-slot="2">Slot 3</button></div>' +
      '<div class="np-row"><button type="button" data-act="wall-undo">↶ UNDO</button>' +
      '<button type="button" data-act="wall-clear">🗑️ CLEAR WALL</button></div>' +
      '<button type="button" class="np-save" data-act="wall-demo">✨ DEMO GRAFFITI</button>' +
      '<button type="button" class="np-save" data-act="wall-apply">🏙️ APPLY TO Z COMPANY ARTS BUILDING</button></div></div>';
  }
  function setStatus(text) {
    if (!studio) return;
    const els = studio.querySelectorAll('#np-status, #np-status-wall');
    for (let i = 0; i < els.length; i++) els[i].textContent = text;
  }
  function syncUI() {
    if (!studio) return;
    const buttons = studio.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      const mode = b.getAttribute('data-mode');
      const cam = b.getAttribute('data-cam');
      const color = b.getAttribute('data-color');
      const brush = b.getAttribute('data-brush');
      const stamp = b.getAttribute('data-stamp');
      const act = b.getAttribute('data-act');
      let on = false;
      if (mode) on = ui.mode === mode;
      if (color) on = ui.color === color;
      if (brush) on = ui.style === brush && !ui.stamp;
      if (stamp) on = ui.stamp === stamp;
      if (act === 'mirror') on = ui.mirror;
      if (act === 'pulse') on = ui.pulse;
      if (act === 'slot') on = state.activeSlot === (+b.getAttribute('data-slot') || 0);
      if (act === 'wings') {
        b.textContent = ui.wings ? 'WINGS OPEN' : 'WINGS CLOSED';
        on = ui.wings;
      }
      if (act === 'wall-mirror') on = ui.wallMirror;
      if (act === 'wall-look') on = ui.wallLook;
      if (act === 'wall-draw') on = !ui.wallLook;
      if (act === 'wall-slot') on = wallState.activeSlot === (+b.getAttribute('data-slot') || 0);
      const canvasMode = b.getAttribute('data-canvas-mode');
      if (canvasMode) on = ui.canvas === canvasMode;
      const stencil = b.getAttribute('data-stencil');
      if (stencil) on = ui.stencil === stencil;
      b.classList.toggle('on', on);
    }
    const panels = studio.querySelectorAll('[data-panel]');
    for (let i = 0; i < panels.length; i++) {
      panels[i].classList.toggle('np-off', panels[i].getAttribute('data-panel') !== ui.canvas);
    }
    const stage = studio.querySelector('.np-stage');
    if (stage) stage.classList.toggle('spin', ui.canvas === 'car' && ui.mode === 'spin');
  }
  const CAMS = {
    hood: { yaw: 0.18, pitch: 0.72 },
    top: { yaw: 0.45, pitch: 1.18 },
    left: { yaw: -1.35, pitch: 0.28 },
    right: { yaw: 1.35, pitch: 0.28 },
    rear: { yaw: Math.PI - 0.1, pitch: 0.34 },
    front: { yaw: 0.05, pitch: 0.3 }
  };

  function frameStudio() {
    if (!studio) { loopOn = false; return; }
    loopOn = true;
    const canvas = studio.querySelector('canvas');
    if (ui.canvas === 'wall' && canvas) {
      try { drawWallCanvas(canvas); } catch (e) { window.NEON_PAINT._err = String(e && e.stack || e); }
      requestAnimationFrame(frameStudio);
      return;
    }
    const X = window.ZD && window.ZD.Xray;
    if (canvas && X && X.ready && X.car) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = Math.max(2, Math.round(rect.width * dpr));
      const h = Math.max(2, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      try { if (window.ZGL && window.ZGL.ensure) window.ZGL.ensure(); } catch (e) {}
      if (window.ZGL && window.ZGL.set) window.ZGL.set(ui.wings ? 1 : 0);
      if (window.GARAGEZ && window.GARAGEZ.apply) { try { window.GARAGEZ.apply(X); } catch (e) {} }
      hookRender(X);
      if (!surf || surf.car !== X.car) ensureSurface(X);
      const ctx = canvas.getContext('2d');
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#14061f');
      sky.addColorStop(1, '#05020c');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      const fov = 26;
      const vt = Math.tan((fov * Math.PI) / 360);
      const asp = w / h;
      const dist = Math.max(4.25 / (0.78 * 2 * vt * asp), 2.45 / (2 * vt)) * ui.zoom;
      const kid = window.KID || null;
      try {
        X.render(ctx, 0, 0, w, h, {
          xray: false, showroom: true, yaw: ui.yaw, pitch: ui.pitch, dist: dist,
          ty: 0.5, fov: fov, drl: 1, kid: kid, noDraw: true, st: { t: performance.now() / 1000, throttle: 30 }
        });
        if (X.groundRing) {
          ctx.save();
          const glow = (kid && kid.glow) || '#3ee6ff';
          [2.5, 2.9, 3.3].forEach(function (r, i) {
            const pts = X.groundRing(r);
            if (!pts || pts.length < 3) return;
            ctx.beginPath();
            for (let k = 0; k < pts.length; k++) {
              if (!pts[k]) return;
              if (k) ctx.lineTo(pts[k].x, pts[k].y); else ctx.moveTo(pts[k].x, pts[k].y);
            }
            ctx.closePath();
            ctx.strokeStyle = glow;
            ctx.globalAlpha = 0.5 - i * 0.13;
            ctx.lineWidth = 5 - i;
            ctx.shadowColor = glow;
            ctx.shadowBlur = 14;
            ctx.stroke();
          });
          ctx.restore();
        }
      } catch (e) {
        window.NEON_PAINT._err = String(e && e.stack || e);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      try { ctx.drawImage(X.canvas, 0, 0, w, h); } catch (e) {}
    }
    requestAnimationFrame(frameStudio);
  }

  function bind(root) {
    const canvas = root.querySelector('canvas');
    let drag = null;
    let pointers = {};
    root.addEventListener('click', function (e) {
      const t = e.target.closest('button');
      if (!t || !root.contains(t)) return;
      const mode = t.getAttribute('data-mode');
      const cam = t.getAttribute('data-cam');
      const color = t.getAttribute('data-color');
      const brush = t.getAttribute('data-brush');
      const stamp = t.getAttribute('data-stamp');
      const act = t.getAttribute('data-act');
      const canvasMode = t.getAttribute('data-canvas-mode');
      const stencil = t.getAttribute('data-stencil');
      if (canvasMode) {
        ui.canvas = canvasMode;
        ui.stamp = '';
        ui.stencil = '';
        setStatus(canvasMode === 'wall' ? 'DRAW THE Z COMPANY ARTS WALL' : (ui.mode === 'draw' ? 'DRAW ON THE CAR' : 'DRAG TO SPIN'));
      }
      if (mode) { ui.mode = mode; ui.stamp = ''; setStatus(mode === 'draw' ? 'DRAW ON THE CAR' : 'DRAG TO SPIN'); }
      if (stencil) {
        ui.stencil = ui.stencil === stencil ? '' : stencil;
        ui.stamp = '';
        ui.wallLook = false;
        ui.canvas = 'wall';
        setStatus(ui.stencil ? 'TAP THE WALL' : 'DRAW THE SIGN');
      }
      if (cam && CAMS[cam]) {
        ui.yaw = CAMS[cam].yaw; ui.pitch = CAMS[cam].pitch;
        setStatus(t.textContent);
      }
      if (color) { ui.color = color; ui.stamp = ''; ui.stencil = ''; }
      if (brush) { ui.style = brush; ui.stamp = ''; ui.stencil = ''; ui.wallLook = false; }
      if (stamp) {
        ui.stamp = ui.stamp === stamp ? '' : stamp;
        if (ui.stamp && ui.style === 'eraser') ui.style = 'neon';
        ui.stencil = '';
        ui.wallLook = false;
        if (ui.canvas !== 'wall') ui.mode = 'draw';
        setStatus(ui.stamp ? (ui.canvas === 'wall' ? 'TAP THE WALL' : 'TAP THE CAR') : (ui.canvas === 'wall' ? 'DRAW THE SIGN' : 'DRAW ON THE CAR'));
      }
      if (act === 'mirror') { ui.mirror = !ui.mirror; setStatus(ui.mirror ? 'SYM IS ON' : 'SYM IS OFF'); }
      if (act === 'pulse') { ui.pulse = !ui.pulse; setStatus(ui.pulse ? 'NOS GLOW ON' : 'PULSE OFF'); }
      if (act === 'wings') { ui.wings = !ui.wings; setStatus(ui.wings ? 'WINGS OPEN' : 'WINGS CLOSED'); }
      if (act === 'undo') {
        const g = slot().strokes.length ? slot().strokes[slot().strokes.length - 1].group : 0;
        slot().strokes = slot().strokes.filter(function (s) { return !g || s.group !== g; });
        save(state); setStatus('UNDID');
      }
      if (act === 'clear') { slot().strokes = []; save(state); setStatus('CLEARED'); }
      if (act === 'save') { save(state); setStatus('SAVED TO THE GARAGE'); }
      if (act === 'slot') { state.activeSlot = +t.getAttribute('data-slot') || 0; save(state); setStatus('SLOT ' + (state.activeSlot + 1)); }
      if (act === 'wall-slot') { wallState.activeSlot = +t.getAttribute('data-slot') || 0; saveWall(); setStatus('Slot ' + (wallState.activeSlot + 1)); }
      if (act === 'wall-undo') {
        const g = wallSlot().strokes.length ? wallSlot().strokes[wallSlot().strokes.length - 1].group : 0;
        wallSlot().strokes = wallSlot().strokes.filter(function (s) { return !g || s.group !== g; });
        saveWall(); setStatus('UNDID');
      }
      if (act === 'wall-clear') {
        wallLive = null;
        wallLiveMirror = null;
        wallSlot().strokes = [];
        wallSlot().cleared = true;
        wallState.cleared = true;
        saveWall();
        setStatus('WALL CLEARED');
      }
      if (act === 'wall-demo') loadDemoWall();
      if (act === 'wall-apply') { saveWall(); setStatus('ON THE Z COMPANY ARTS BUILDING'); }
      if (act === 'wall-mirror') { ui.wallMirror = !ui.wallMirror; setStatus(ui.wallMirror ? 'MIRROR IS ON' : 'MIRROR IS OFF'); }
      if (act === 'wall-look') { ui.wallLook = true; ui.stamp = ''; ui.stencil = ''; setStatus('DRAG TO TURN THE WALL'); }
      if (act === 'wall-draw') { ui.wallLook = false; setStatus('DRAW THE SIGN'); }
      syncUI();
    });
    const zoom = root.querySelector('[data-act="zoom"]');
    if (zoom) zoom.addEventListener('input', function () { ui.zoom = (+zoom.value || 100) / 100; });
    const yawSlide = root.querySelector('[data-act="wall-yaw"]');
    if (yawSlide) yawSlide.addEventListener('input', function () { ui.wallYaw = (+yawSlide.value || 0) * Math.PI / 180; });
    function point(e) {
      const b = canvas.getBoundingClientRect();
      return [(e.clientX - b.left) * (canvas.width / b.width), (e.clientY - b.top) * (canvas.height / b.height)];
    }
    canvas.addEventListener('pointerdown', function (e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      const ids = Object.keys(pointers);
      if (ids.length >= 2) { drag = { pinch: distPointers() }; return; }
      const pt = point(e);
      if (ui.canvas === 'wall') { wallDown(e, pt); return; }
      if (ui.mode === 'spin' && !ui.stamp) { drag = { x: e.clientX, y: e.clientY, spin: true }; return; }
      const X = carX();
      if (!X) return;
      const hit = pick(X, pt[0], pt[1]);
      if (!hit) { drag = null; return; }
      if (ui.stamp) { placeStamp(X, hit); drag = { stamp: true }; return; }
      const b = brushNow();
      if (b.brush === 'eraser') { eraseNear(X, hit); drag = { erase: true, x: pt[0], y: pt[1] }; return; }
      const group = groupN++;
      live = { part: hit.part, brush: b.brush, color: b.color, size: b.size, mirror: ui.mirror, pulse: ui.pulse, group: group, pts: [[hit.x, hit.y, hit.z, hit.nx, hit.ny, hit.nz]] };
      liveMirror = null;
      if (ui.mirror) {
        const m = mirrorHit(X, hit);
        liveMirror = { part: m.part, brush: b.brush, color: b.color, size: b.size, mirror: true, pulse: ui.pulse, group: group, pts: [[m.x, m.y, m.z, m.nx, m.ny, m.nz]] };
      }
      drag = { draw: true };
    });
    function distPointers() {
      const ids = Object.keys(pointers);
      if (ids.length < 2) return 0;
      const a = pointers[ids[0]], b = pointers[ids[1]];
      return Math.hypot(a.x - b.x, a.y - b.y) || 1;
    }
    canvas.addEventListener('pointermove', function (e) {
      if (pointers[e.pointerId]) pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (!drag) return;
      if (drag.pinch) {
        const d = distPointers();
        if (d) { ui.zoom = clamp(ui.zoom * (drag.pinch / d), 0.7, 1.6); drag.pinch = d; }
        return;
      }
      if (drag.spin) {
        ui.yaw -= (e.clientX - drag.x) * 0.01;
        ui.pitch = clamp(ui.pitch + (e.clientY - drag.y) * 0.008, -0.2, 1.25);
        drag.x = e.clientX; drag.y = e.clientY;
        return;
      }
      if (drag.wallSpin) {
        ui.wallYaw += (e.clientX - drag.x) * 0.008;
        drag.x = e.clientX;
        const slide = root.querySelector('[data-act="wall-yaw"]');
        if (slide) slide.value = String(Math.round(ui.wallYaw * 180 / Math.PI));
        return;
      }
      if (drag.wall) {
        const pt = point(e);
        const hit = unprojectPad(wallViewOf(canvas.width, canvas.height), pt[0], pt[1]);
        if (!hit || !wallLive) return;
        if (drag.line) {
          wallLive.points = [[drag.u, drag.v], [hit.u, hit.v]];
          if (wallLiveMirror) wallLiveMirror.points = [[-drag.u, drag.v], [-hit.u, hit.v]];
        } else {
          pushWall(wallLive, hit);
          if (wallLiveMirror && ui.wallMirror) pushWall(wallLiveMirror, { u: -hit.u, v: hit.v });
        }
        return;
      }
      const X = carX();
      if (!X) return;
      const pt = point(e);
      const hit = pick(X, pt[0], pt[1]);
      if (!hit) return;
      if (drag.erase) { eraseNear(X, hit); return; }
      if (!drag.draw || !live) return;
      if (hit.part !== live.part) return;
      pushPoint(live, hit);
      if (liveMirror && ui.mirror) {
        const m = mirrorHit(X, hit);
        pushPoint(liveMirror, m);
      }
    });
    function endPtr(e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length) return;
      const was = drag;
      drag = null;
      if (was && was.draw) commitLive(carX());
      if (was && was.wall) commitWall();
    }
    function wallDown(e, pt) {
      if (ui.wallLook && !ui.stamp && !ui.stencil) { drag = { x: e.clientX, y: e.clientY, wallSpin: true }; return; }
      const hit = unprojectPad(wallViewOf(canvas.width, canvas.height), pt[0], pt[1]);
      if (!hit) { drag = null; return; }
      if (ui.stencil) { placeWallStencil(hit); drag = { wallStamp: true }; return; }
      if (ui.stamp) { placeWallStamp(hit); drag = { wallStamp: true }; return; }
      const b = wallBrushNow();
      const group = wallGroup++;
      wallLive = { brush: b.brush, color: b.color, size: b.size, mirror: ui.wallMirror, group: group, points: [[hit.u, hit.v]] };
      wallLiveMirror = ui.wallMirror ? { brush: b.brush, color: b.color, size: b.size, mirror: true, group: group, points: [[-hit.u, hit.v]] } : null;
      drag = { wall: true, line: b.brush === 'line', u: hit.u, v: hit.v };
    }
    canvas.addEventListener('pointerup', endPtr);
    canvas.addEventListener('pointercancel', endPtr);
  }

  function wallBlank() {
    return {
      version: 1, activeSlot: 0,
      slots: [0, 1, 2].map(function (i) { return { name: 'Slot ' + (i + 1), strokes: [], updatedAt: 0 }; })
    };
  }
  function cleanWallStroke(s) {
    if (!s || !Array.isArray(s.points) && !Array.isArray(s.pts)) return null;
    const raw = Array.isArray(s.points) ? s.points : s.pts;
    const points = [];
    for (let i = 0; i < raw.length && points.length < 800; i++) {
      const p = raw[i];
      if (!p || p.length < 2) continue;
      const u = +p[0], v = +p[1];
      if (u !== u || v !== v) continue;
      points.push([clamp(u, -1.2, 1.2), clamp(v, -0.05, 1.05)]);
    }
    if (points.length < 1) return null;
    const brush = (typeof s.brush === 'string' && s.brush) ? s.brush.slice(0, 16) : 'neon';
    const color = (typeof s.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(s.color)) ? s.color.toLowerCase() : '#ff4fd8';
    let size = +s.size;
    if (!(size > 0)) size = 16;
    return { brush: brush, color: color, size: clamp(size, 1, 64), mirror: !!s.mirror, group: s.group | 0, points: points };
  }
  function normalizeWall(data) {
    const slots = [0, 1, 2].map(function (i) {
      const s = data && data.slots && data.slots[i];
      const strokes = [];
      const raw = s && (Array.isArray(s.strokes) ? s.strokes : (Array.isArray(s.points) ? [s] : []));
      for (let k = 0; k < raw.length && strokes.length < 400; k++) {
        const c = cleanWallStroke(raw[k]);
        if (c) strokes.push(c);
      }
      return {
        name: clipName(s && s.name, 'Slot ' + (i + 1)),
        strokes: strokes,
        updatedAt: (s && +s.updatedAt) || 0,
        cleared: !!(s && s.cleared)
      };
    });
    let active = data && data.activeSlot | 0;
    if (active < 0 || active > 2) active = 0;
    return { version: 1, activeSlot: active, cleared: !!(data && data.cleared), slots: slots };
  }
  function readWall() {
    try {
      const raw = localStorage.getItem(WALL_KEY);
      if (!raw) return wallBlank();
      return normalizeWall(JSON.parse(raw));
    } catch (e) { return wallBlank(); }
  }
  function wallSlot() { return wallState.slots[wallState.activeSlot] || wallState.slots[0]; }
  function wallAnySaved() {
    for (let i = 0; i < wallState.slots.length; i++) if (wallState.slots[i].strokes.length) return true;
    return false;
  }
  function glyphStrokes(ch) {
    const g = {
      Z: [[[0, 1], [1, 1], [0, 0], [1, 0]]],
      C: [[[0.9, 0.85], [0.15, 1], [0, 0.5], [0.15, 0], [0.9, 0.15]]],
      O: [[[0.15, 0], [0.15, 1], [0.85, 1], [0.85, 0], [0.15, 0]]],
      E: [[[1, 1], [0, 1], [0, 0], [1, 0]], [[0, 0.5], [0.75, 0.5]]],
      L: [[[0, 1], [0, 0], [1, 0]]],
      I: [[[0.15, 1], [0.85, 1]], [[0.5, 1], [0.5, 0]], [[0.15, 0], [0.85, 0]]],
      D: [[[0, 0], [0, 1], [0.55, 1], [1, 0.5], [0.55, 0], [0, 0]]],
      A: [[[0, 0], [0.5, 1], [1, 0]], [[0.22, 0.38], [0.78, 0.38]]],
      N: [[[0, 0], [0, 1], [1, 0], [1, 1]]],
      ' ': []
    };
    if (ch === '★' || ch === '*') return [starPoly().map(function (p) { return [(p[0] + 1) / 2, (p[1] + 1) / 2]; })];
    return g[ch] || g[ch && ch.toUpperCase()] || [];
  }
  function textWallStrokes(text, u, v, meters, color, size, brush) {
    const chars = String(text).split('');
    const gw = meters / 11;
    const gh = meters / 14;
    const gap = gw * 0.22;
    const total = chars.length * gw + Math.max(0, chars.length - 1) * gap;
    let x = u - total / 2;
    const out = [];
    for (let i = 0; i < chars.length; i++) {
      const parts = glyphStrokes(chars[i]);
      for (let p = 0; p < parts.length; p++) {
        const pts = [];
        for (let k = 0; k < parts[p].length; k++) {
          pts.push([x + parts[p][k][0] * gw, v + (parts[p][k][1] - 0.5) * gh]);
        }
        if (pts.length) out.push({ brush: brush || 'neon', color: color, size: size || 18, mirror: false, group: 0, points: pts });
      }
      x += gw + gap;
    }
    return out;
  }
  function uvPoly(poly, u, v, meters) {
    const pts = [];
    for (let i = 0; i < poly.length; i++) {
      pts.push([u + poly[i][0] * meters / 11, v + poly[i][1] * meters / 14]);
    }
    return pts;
  }
  function demoWall() {
    const strokes = [];
    function add(list, group) {
      for (let i = 0; i < list.length; i++) { list[i].group = group; strokes.push(list[i]); }
    }
    add(textWallStrokes('Z', -0.55, 0.62, 5.2, '#ff4fd8', 26, 'neon'), 1);
    add(textWallStrokes('CO', 0.12, 0.62, 4.4, '#3ee6ff', 24, 'ribbon'), 1);
    const star = starPoly();
    strokes.push({ brush: 'star', color: '#ffe14d', size: 18, mirror: false, group: 2, points: uvPoly(star, 0.72, 0.78, 2.4) });
    const heart = heartPoly();
    strokes.push({ brush: 'heart', color: '#ff4fd8', size: 16, mirror: false, group: 3, points: uvPoly(heart, -0.78, 0.28, 2.2) });
    add(textWallStrokes('DANCE', 0.05, 0.28, 2.3, '#7dff6b', 16, 'neon'), 4);
    const swoosh = [];
    for (let i = 0; i <= 18; i++) {
      const t = i / 18;
      swoosh.push([-0.85 + t * 1.7, 0.12 + Math.sin(t * Math.PI) * 0.08]);
    }
    strokes.push({ brush: 'spray', color: '#9b5cff', size: 30, mirror: false, group: 5, points: swoosh });
    strokes.push({ brush: 'line', color: '#ffe14d', size: 10, mirror: false, group: 6, points: [[-0.8, 0.48], [0.8, 0.48]] });
    return strokes;
  }
  function wallShowing() {
    const slot = wallSlot();
    const own = slot.strokes;
    if (own.length) return own.slice();
    if (slot.cleared || wallState.cleared) return [];
    if (wallLive && wallLive.points && wallLive.points.length) return [];
    if (!wallAnySaved()) return demoWall();
    return [];
  }
  function saveWall() {
    wallSlot().updatedAt = Date.now();
    const json = JSON.stringify(wallState);
    wallJson = json;
    try { localStorage.setItem(WALL_KEY, json); } catch (e) {}
    if (wallCh) { try { wallCh.postMessage({ tab: TAB, json: json }); } catch (e) {} }
    if (studio && ui.canvas === 'wall') syncUI();
    return JSON.parse(json);
  }
  function ingestWall(raw) {
    if (!raw) return;
    let data;
    try { data = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return; }
    const next = normalizeWall(data);
    const json = JSON.stringify(next);
    if (json === wallJson) return;
    wallState = next;
    wallJson = json;
    if (studio && ui.canvas === 'wall') syncUI();
  }
  function wallViewOf(w, h) {
    const yaw = ui.wallYaw || 0;
    const dist = 20 / (ui.wallZoom || 1);
    return {
      yaw: yaw, dist: dist, camY: 7.2, f: h * 0.92, cx: w * 0.5, cy: h * 0.52,
      cos: Math.cos(yaw), sin: Math.sin(yaw)
    };
  }
  function projectUV(view, u, v) {
    const lx = u * (WALL_W / 2);
    const ly = v * WALL_H;
    const vx = lx * view.cos;
    const vy = ly - view.camY;
    const vz = view.dist - lx * view.sin;
    if (vz < 0.35) return null;
    return [view.cx + vx * view.f / vz, view.cy - vy * view.f / vz, vz];
  }
  function unprojectUV(view, sx, sy) {
    const k = (sx - view.cx) / view.f;
    const den = view.cos + k * view.sin;
    if (Math.abs(den) < 1e-4) return null;
    const lx = k * view.dist / den;
    const vz = view.dist - lx * view.sin;
    if (vz < 0.35) return null;
    const m = (view.cy - sy) / view.f;
    const ly = view.camY + m * vz;
    const u = lx / (WALL_W / 2);
    const v = ly / WALL_H;
    if (u < -1.04 || u > 1.04 || v < -0.04 || v > 1.04) return null;
    return { u: clamp(u, -1, 1), v: clamp(v, 0, 1) };
  }
  function unprojectPad(view, sx, sy) {
    const direct = unprojectUV(view, sx, sy);
    if (direct) return direct;
    const rings = [10, 22, 36, 52];
    for (let r = 0; r < rings.length; r++) {
      const rad = rings[r];
      for (let a = 0; a < 8; a++) {
        const ang = a * Math.PI / 4;
        const hit = unprojectUV(view, sx + Math.cos(ang) * rad, sy + Math.sin(ang) * rad);
        if (hit) return hit;
      }
    }
    return null;
  }
  function drawWallCanvas(canvas) {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(2, Math.round(rect.width * dpr));
    const h = Math.max(2, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const g = canvas.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1a0830');
    sky.addColorStop(0.55, '#12061c');
    sky.addColorStop(1, '#07010f');
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    const view = wallViewOf(w, h);
    function poly(uvs) {
      g.beginPath();
      let n = 0;
      for (let i = 0; i < uvs.length; i++) {
        const p = projectUV(view, uvs[i][0], uvs[i][1]);
        if (!p) return false;
        if (n) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
        n++;
      }
      g.closePath();
      return true;
    }
    if (poly([[-1, 0], [1, 0], [1, 1], [-1, 1]])) {
      g.fillStyle = '#160b28';
      g.fill();
    }
    g.beginPath();
    for (let i = 0; i <= 22; i++) {
      const u = -1 + i / 11;
      const a = projectUV(view, u, 0), b = projectUV(view, u, 1);
      if (a && b) { g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
    }
    for (let i = 0; i <= 18; i++) {
      const v = i / 18;
      const a = projectUV(view, -1, v), b = projectUV(view, 1, v);
      if (a && b) { g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
    }
    g.strokeStyle = 'rgba(90, 48, 140, 0.55)';
    g.lineWidth = 1;
    g.stroke();
    if (poly([[-1.04, -0.02], [1.04, -0.02], [1.04, 1.03], [-1.04, 1.03]])) {
      g.strokeStyle = '#ff4fd8';
      g.lineWidth = 4;
      g.shadowColor = '#ff4fd8';
      g.shadowBlur = 16;
      g.stroke();
      g.shadowBlur = 0;
    }
    if (poly([[-0.96, 0.9], [0.96, 0.9], [0.96, 1.0], [-0.96, 1.0]])) {
      g.fillStyle = 'rgba(8, 2, 18, 0.72)';
      g.fill();
      g.strokeStyle = '#3ee6ff';
      g.lineWidth = 2;
      g.shadowColor = '#3ee6ff';
      g.shadowBlur = 10;
      g.stroke();
      g.shadowBlur = 0;
    }
    drawWallLabel(g, view, 'Z COMPANY ARTS — SIDE WALL MURAL', 0.95, {
      color: '#3ee6ff', weight: '900', blur: 12, band: [0.9, 1], bandFit: 0.62
    });
    const show = wallShowing();
    if (wallLive && wallLive.points.length) show.push(wallLive);
    if (wallLiveMirror && wallLiveMirror.points.length) show.push(wallLiveMirror);
    for (let i = 0; i < show.length; i++) strokeWall2d(g, view, show[i]);
    drawWallLabel(g, view, ui.wallLook ? 'DRAG TO TURN THE WALL' : '22m × 14m  ·  DRAW THE SIGN', -0.06, {
      color: '#ffe14d', weight: '700', blur: 8, size: Math.max(11, h * 0.034)
    });
  }
  function drawWallLabel(g, view, text, v, style) {
    const mid = projectUV(view, 0, v);
    const left = projectUV(view, -0.92, v);
    const right = projectUV(view, 0.92, v);
    const edgeL = projectUV(view, -0.96, v);
    const edgeR = projectUV(view, 0.96, v);
    if (!mid || !left || !right || !edgeL || !edgeR) return;
    const ang = Math.atan2(right[1] - left[1], right[0] - left[0]);
    const span = Math.hypot(edgeR[0] - edgeL[0], edgeR[1] - edgeL[1]);
    if (span < 12) return;
    let fs = style.size || 16;
    if (style.band) {
      const a = projectUV(view, 0, style.band[0]);
      const b = projectUV(view, 0, style.band[1]);
      if (a && b) fs = Math.max(8, Math.hypot(b[0] - a[0], b[1] - a[1]) * (style.bandFit || 0.62));
    }
    g.save();
    g.translate(mid[0], mid[1]);
    g.rotate(ang);
    g.font = (style.weight || '900') + ' ' + fs.toFixed(1) + 'px Orbitron, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = style.color;
    g.shadowColor = style.color;
    g.shadowBlur = style.blur || 0;
    const tw = g.measureText(text).width || 1;
    g.scale(Math.min(1, (span * 0.94) / tw), 1);
    g.fillText(text, 0, 0);
    g.restore();
  }
  function strokeWall2d(g, view, s) {
    const seq = [];
    for (let i = 0; i < s.points.length; i++) {
      const p = projectUV(view, s.points[i][0], s.points[i][1]);
      seq.push(p);
    }
    const runs = [];
    let cur = [];
    for (let i = 0; i < seq.length; i++) {
      if (!seq[i]) { if (cur.length) runs.push(cur); cur = []; continue; }
      cur.push(seq[i]);
    }
    if (cur.length) runs.push(cur);
    const color = s.brush === 'rainbow'
      ? 'hsl(' + (((s.group || 0) * 47) % 360) + ',100%,64%)'
      : s.color;
    const base = s.brush === 'laser' || s.brush === 'line' ? 0.55 : (s.brush === 'spray' ? 1.7 : (s.brush === 'ribbon' ? 1.35 : 1));
    for (let r = 0; r < runs.length; r++) {
      const run = runs[r];
      const lw = Math.max(3, (s.size || 16) * 0.42 * base);
      g.save();
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.beginPath();
      for (let i = 0; i < run.length; i++) {
        if (i) g.lineTo(run[i][0], run[i][1]); else g.moveTo(run[i][0], run[i][1]);
      }
      if (run.length === 1) g.lineTo(run[0][0] + 0.8, run[0][1]);
      g.strokeStyle = color;
      g.shadowColor = color;
      g.globalAlpha = s.brush === 'spray' ? 0.55 : 0.95;
      g.shadowBlur = lw * (s.brush === 'spray' ? 2.4 : 1.5);
      g.lineWidth = lw;
      g.stroke();
      if (s.brush === 'spray') { g.globalAlpha = 0.35; g.lineWidth = lw * 1.8; g.stroke(); }
      g.shadowBlur = lw * 0.25;
      g.globalAlpha = 0.9;
      g.strokeStyle = '#ffffff';
      g.lineWidth = Math.max(1.5, lw * 0.28);
      g.stroke();
      g.restore();
    }
  }
  function wallBrushNow() {
    if (ui.stencil) return { brush: 'neon', size: 18, color: ui.color === 'rainbow' ? '#ffffff' : ui.color };
    if (ui.stamp) return { brush: ui.stamp, size: 16, color: ui.color === 'rainbow' ? '#ff4fd8' : ui.color };
    if (ui.color === 'rainbow' || ui.style === 'rainbow') return { brush: 'rainbow', size: ui.style === 'spray' ? 28 : 18, color: '#ffffff' };
    if (ui.style === 'spray') return { brush: 'spray', size: 28, color: ui.color };
    if (ui.style === 'ribbon') return { brush: 'ribbon', size: 20, color: ui.color };
    if (ui.style === 'line') return { brush: 'line', size: 12, color: ui.color };
    return { brush: 'neon', size: 18, color: ui.color };
  }
  function pushWall(stroke, hit) {
    const prev = stroke.points[stroke.points.length - 1];
    if (prev && Math.hypot(hit.u - prev[0], hit.v - prev[1]) < 0.008) return;
    if (stroke.points.length < 800) stroke.points.push([hit.u, hit.v]);
  }
  function commitWall() {
    if (wallLive && wallLive.points.length > 1) wallSlot().strokes.push(wallLive);
    if (wallLiveMirror && wallLiveMirror.points.length > 1) wallSlot().strokes.push(wallLiveMirror);
    wallLive = null;
    wallLiveMirror = null;
    saveWall();
    setStatus('SAVED ON THE WALL');
  }
  function placeWallStamp(hit) {
    const b = wallBrushNow();
    const polys = ui.stamp === 'dance' ? dancePolys() : (ui.stamp === 'note' ? stampPolys('note') : stampPolys(ui.stamp || 'star'));
    const group = wallGroup++;
    const meters = ui.stamp === 'dance' ? 5.2 : 4.2;
    function bake(u, v, flip) {
      for (let i = 0; i < polys.length; i++) {
        const pts = [];
        for (let k = 0; k < polys[i].length; k++) {
          const pu = polys[i][k][0] * (flip ? -1 : 1);
          const pv = polys[i][k][1];
          pts.push([u + pu * meters / 11, v + pv * meters / 14]);
        }
        wallSlot().strokes.push({ brush: b.brush, color: b.color, size: b.size, mirror: false, group: group, points: pts });
      }
    }
    bake(hit.u, hit.v, false);
    if (ui.wallMirror) bake(-hit.u, hit.v, true);
    saveWall();
    setStatus('STICKER ON THE WALL');
  }
  function dancePolys() {
    return [
      ellipse(0, 0.62, 0.18, 0.18),
      [[0, 0.44], [0.05, 0.05]],
      [[0, 0.32], [-0.55, 0.7]],
      [[0, 0.32], [0.5, 0.75]],
      [[0.05, 0.05], [-0.42, -0.55]],
      [[0.05, 0.05], [0.48, -0.4]]
    ];
  }
  function placeWallStencil(hit) {
    const word = ui.stencil || 'Z';
    const color = ui.color === 'rainbow' ? '#ff4fd8' : ui.color;
    const letters = word.replace(/\s/g, '');
    const n = letters.length || 1;
    const meters = n <= 1 ? 6.4 : (n <= 3 ? 4.6 : 3.4);
    const group = wallGroup++;
    const made = textWallStrokes(word, hit.u, hit.v, meters, color, 20, 'neon');
    for (let i = 0; i < made.length; i++) { made[i].group = group; wallSlot().strokes.push(made[i]); }
    if (ui.wallMirror && Math.abs(hit.u) > 0.08) {
      const alt = textWallStrokes(word, -hit.u, hit.v, meters, color, 20, 'neon');
      for (let i = 0; i < alt.length; i++) { alt[i].group = group; wallSlot().strokes.push(alt[i]); }
    }
    saveWall();
    setStatus(word + ' ON THE WALL');
  }
  function loadDemoWall() {
    const group = wallGroup++;
    const demo = demoWall();
    wallSlot().strokes = [];
    wallSlot().cleared = false;
    wallState.cleared = false;
    for (let i = 0; i < demo.length; i++) { demo[i].group = group; wallSlot().strokes.push(demo[i]); }
    saveWall();
    setStatus('DEMO GRAFFITI ON');
  }
  function uniqueB(list) {
    const out = [];
    for (let i = 0; i < list.length; i++) if (list[i] && out.indexOf(list[i]) < 0) out.push(list[i]);
    return out;
  }
  function signText(b) {
    const bits = [];
    if (b.sign) bits.push(b.sign.text || b.sign.t || '');
    if (b.deco) for (let i = 0; i < b.deco.length; i++) {
      const k = b.deco[i];
      if (k && k[0] === 'sign' && k[1]) bits.push(k[1].text || k[1].t || '');
    }
    return bits.join(' ');
  }
  function isTaggedArts(b) {
    if (!b) return false;
    if (b.purpose === 'DANCE') return true;
    return signText(b).indexOf('Z COMPANY') !== -1;
  }
  function realBuilding(b) {
    if (!b || b.x0 == null || b.x1 == null) return false;
    const k = b.kind;
    return k !== 'outline' && k !== 'pylon' && k !== 'bill' && k !== 'hill' && !b.towCab;
  }
  function worldCity() {
    if (window.CITY && (window.CITY.buildings || window.CITY.BL)) return window.CITY;
    if (typeof CITY !== 'undefined' && CITY && (CITY.buildings || CITY.BL)) return CITY;
    if (window.FLY && FLY.CITY && (FLY.CITY.buildings || FLY.CITY.BL)) return FLY.CITY;
    return null;
  }
  function worldCam() {
    if (window.cam && window.cam.x != null) return window.cam;
    if (typeof cam !== 'undefined' && cam && cam.x != null) return cam;
    if (window.FLY && FLY.cam && FLY.cam.x != null) return FLY.cam;
    return null;
  }
  function artsList() {
    const C = worldCity();
    if (!C) return [];
    const list = C.buildings || C.BL || [];
    if (artsCache && artsCache.src === list) return artsCache.list;
    const tagged = [];
    for (let i = 0; i < list.length; i++) if (isTaggedArts(list[i])) tagged.push(list[i]);
    let chosen = tagged;
    if (!chosen.length) {
      chosen = [];
      const pool = [];
      for (let i = 0; i < list.length; i++) if (realBuilding(list[i])) pool.push(list[i]);
      for (let s = 0; s < ARTS_SPOTS.length; s++) {
        let best = null, bd = 1e9;
        for (let i = 0; i < pool.length; i++) {
          const b = pool[i];
          const cx = b.cx != null ? b.cx : (b.x0 + b.x1) / 2;
          const cz = b.cz != null ? b.cz : (b.z0 + b.z1) / 2;
          const d = Math.hypot(cx - ARTS_SPOTS[s][0], cz - ARTS_SPOTS[s][1]);
          if (d < bd) { bd = d; best = b; }
        }
        if (best) chosen.push(best);
      }
    }
    artsCache = { src: list, list: uniqueB(chosen) };
    return artsCache.list;
  }
  function beginGrafFrame() {
    if (!grafArmed) { grafFrame++; grafArmed = true; }
    return grafFrame;
  }
  function muralFrame(b) {
    const dx = Math.abs(b.x1 - b.x0) || b.dx || WALL_W;
    const dz = Math.abs(b.z1 - b.z0) || b.dz || WALL_W;
    const bh = b.h || b.top || WALL_H;
    const want = Math.min(dx, dz) * 1.55;
    const height = Math.min(14, bh * 0.55);
    const y0 = 3.2;
    const faces = [
      { nx: 1, nz: 0, len: dz, cx: b.x1, cz: (b.z0 + b.z1) / 2, tx: 0, tz: 1 },
      { nx: -1, nz: 0, len: dz, cx: b.x0, cz: (b.z0 + b.z1) / 2, tx: 0, tz: -1 },
      { nx: 0, nz: 1, len: dx, cx: (b.x0 + b.x1) / 2, cz: b.z1, tx: -1, tz: 0 },
      { nx: 0, nz: -1, len: dx, cx: (b.x0 + b.x1) / 2, cz: b.z0, tx: 1, tz: 0 }
    ];
    const cam = worldCam();
    let best = null, score = -1e9;
    for (let i = 0; i < faces.length; i++) {
      const f = faces[i];
      const dot = cam ? ((cam.x - f.cx) * f.nx + (cam.z - f.cz) * f.nz) : f.len;
      if (cam && dot <= 1) continue;
      const s = dot + f.len * 0.15;
      if (s > score) { score = s; best = f; }
    }
    if (!best) best = faces[0];
    best.width = Math.min(want, best.len * 0.92);
    best.height = Math.min(height, Math.max(2.4, (b.h || b.top || WALL_H) - 3.5));
    best.y0 = y0;
    best.out = 0.16;
    return best;
  }
  function muralPoint(f, u, v) {
    const along = u * f.width * 0.5;
    const up = f.y0 + clamp(v, 0, 1) * f.height;
    return [f.cx + f.nx * f.out + f.tx * along, up, f.cz + f.nz * f.out + f.tz * along];
  }
  function drawBuildingGraffiti(ctx, b) {
    try {
      if (!ctx || !b || b.x0 == null) return;
      const id = beginGrafFrame();
      const arts = artsList();
      if (arts.indexOf(b) < 0 && !isTaggedArts(b)) return;
      if (b._grafFrame === id) return;
      const cam = worldCam();
      if (cam) {
        const dx = (b.cx != null ? b.cx : (b.x0 + b.x1) / 2) - cam.x;
        const dz = (b.cz != null ? b.cz : (b.z0 + b.z1) / 2) - cam.z;
        if (dx * dx + dz * dz > 260 * 260) return;
      }
      b._grafFrame = id;
      paintMural(ctx, b);
    } catch (e) { window.NEON_PAINT._err = String(e && e.message || e); }
  }
  function drawAllWallGraffiti(ctx) {
    try {
      beginGrafFrame();
      const list = artsList();
      for (let i = 0; i < list.length; i++) drawBuildingGraffiti(ctx, list[i]);
    } catch (e) { window.NEON_PAINT._err = String(e && e.message || e); }
    grafArmed = false;
  }
  function paintMural(ctx, b) {
    const project = (typeof proj === 'function') ? proj : (window.R && window.R.proj);
    if (!project) return;
    const f = muralFrame(b);
    const strokes = wallShowing();
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    function quad(u0, v0, u1, v1) {
      const p = [muralPoint(f, u0, v0), muralPoint(f, u1, v0), muralPoint(f, u1, v1), muralPoint(f, u0, v1)];
      const s = [];
      for (let i = 0; i < 4; i++) {
        const q = project(p[i][0], p[i][1], p[i][2]);
        if (!q) return null;
        s.push(q);
      }
      ctx.beginPath();
      ctx.moveTo(s[0][0], s[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(s[i][0], s[i][1]);
      ctx.closePath();
      return s;
    }
    if (quad(-1.04, -0.03, 1.04, 1.04)) {
      ctx.fillStyle = 'rgba(22, 11, 40, 0.88)';
      ctx.fill();
    }
    ctx.beginPath();
    for (let i = 0; i <= 14; i++) {
      const u = -1 + i / 7;
      const a = project.apply(null, muralPoint(f, u, 0));
      const c = project.apply(null, muralPoint(f, u, 1));
      if (a && c) { ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); }
    }
    for (let i = 0; i <= 10; i++) {
      const v = i / 10;
      const a = project.apply(null, muralPoint(f, -1, v));
      const c = project.apply(null, muralPoint(f, 1, v));
      if (a && c) { ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); }
    }
    ctx.strokeStyle = 'rgba(120, 70, 180, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (quad(-1.02, -0.02, 1.02, 1.02)) {
      ctx.strokeStyle = '#ff4fd8';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#ff4fd8';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    if (quad(-0.98, 0.9, 0.98, 1.0)) {
      ctx.fillStyle = 'rgba(6, 2, 16, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#3ee6ff';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#3ee6ff';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    const mid = project.apply(null, muralPoint(f, 0, 0.95));
    const leftPt = project.apply(null, muralPoint(f, -0.92, 0.95));
    const rightPt = project.apply(null, muralPoint(f, 0.92, 0.95));
    const edgeL = project.apply(null, muralPoint(f, -0.96, 0.95));
    const edgeR = project.apply(null, muralPoint(f, 0.96, 0.95));
    const bandA = project.apply(null, muralPoint(f, 0, 0.9));
    const bandB = project.apply(null, muralPoint(f, 0, 1));
    if (mid && leftPt && rightPt && edgeL && edgeR) {
      const span = Math.hypot(edgeR[0] - edgeL[0], edgeR[1] - edgeL[1]);
      const thick = (bandA && bandB) ? Math.hypot(bandB[0] - bandA[0], bandB[1] - bandA[1]) : span * 0.08;
      const fs = Math.max(8, thick * 0.62);
      if (span > 16 && fs >= 8) {
        const ang = Math.atan2(rightPt[1] - leftPt[1], rightPt[0] - leftPt[0]);
        const label = "🎨 Z COMPANY ARTS — ELLIE'S GRAFFITI WALL";
        ctx.save();
        ctx.translate(mid[0], mid[1]);
        ctx.rotate(ang);
        ctx.font = '900 ' + fs.toFixed(1) + 'px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#3ee6ff';
        ctx.shadowColor = '#3ee6ff';
        ctx.shadowBlur = 8;
        const tw = ctx.measureText(label).width || 1;
        ctx.scale(Math.min(1, (span * 0.94) / tw), 1);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    }
    for (let i = 0; i < strokes.length; i++) {
      const s = strokes[i];
      const seq = [];
      let depth = 40;
      for (let k = 0; k < s.points.length; k++) {
        const wpt = muralPoint(f, s.points[k][0], s.points[k][1]);
        const q = project(wpt[0], wpt[1], wpt[2]);
        if (q && q[2]) depth = q[2];
        seq.push(q);
      }
      const Hpx = (typeof H === 'number' ? H : 390);
      const px = (Hpx * 0.9) / Math.max(8, depth);
      const mul = s.brush === 'spray' ? 1.8 : (s.brush === 'ribbon' ? 1.35 : (s.brush === 'line' ? 0.7 : 1));
      const lw = Math.max(2.2, (s.size || 16) / 34 * f.height * px * 0.22 * mul);
      const color = s.brush === 'rainbow' ? 'hsl(' + ((i * 36) % 360) + ',100%,64%)' : s.color;
      const runs = [];
      let cur = [];
      for (let k = 0; k < seq.length; k++) {
        if (!seq[k]) { if (cur.length) runs.push(cur); cur = []; continue; }
        cur.push(seq[k]);
      }
      if (cur.length) runs.push(cur);
      for (let r = 0; r < runs.length; r++) {
        const run = runs[r];
        ctx.beginPath();
        for (let k = 0; k < run.length; k++) {
          if (k) ctx.lineTo(run[k][0], run[k][1]); else ctx.moveTo(run[k][0], run[k][1]);
        }
        if (run.length === 1) ctx.lineTo(run[0][0] + 0.6, run[0][1]);
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.globalAlpha = s.brush === 'spray' ? 0.5 : 0.95;
        ctx.shadowBlur = lw * (s.brush === 'spray' ? 2.2 : 1.4);
        ctx.lineWidth = lw;
        ctx.stroke();
        if (s.brush === 'spray') { ctx.globalAlpha = 0.35; ctx.lineWidth = lw * 1.7; ctx.stroke(); }
        ctx.globalAlpha = 0.92;
        ctx.shadowBlur = Math.max(2, lw * 0.3);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1.2, lw * 0.28);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  }
  function hookWorldGraffiti() {
    if (typeof proj === 'function') {
      window.R = window.R || {};
      if (!window.R.proj) window.R.proj = proj;
    }
    if (typeof drawBldg === 'function' && !drawBldg._npGraf) {
      const prev = drawBldg;
      const wrapped = function (b, d) {
        const out = prev.apply(this, arguments);
        try { drawBuildingGraffiti(ctx, b); } catch (e) {}
        return out;
      };
      wrapped._npGraf = 1;
      drawBldg = wrapped;
    }
    if (typeof drawZ === 'function' && !drawZ._npGraf) {
      const prevZ = drawZ;
      const wrappedZ = function () {
        try { drawAllWallGraffiti(ctx); } catch (e) {}
        return prevZ.apply(this, arguments);
      };
      wrappedZ._npGraf = 1;
      drawZ = wrappedZ;
    }
    if (window.DETAIL && typeof DETAIL.pass === 'function' && !DETAIL.pass._npGraf) {
      const prevP = DETAIL.pass;
      const wrappedP = function () {
        const out = prevP.apply(this, arguments);
        try { drawAllWallGraffiti(ctx); } catch (e) {}
        return out;
      };
      wrappedP._npGraf = 1;
      DETAIL.pass = wrappedP;
    }
  }

  function openStudio(opts) {
    if (typeof document === 'undefined') return;
    if (typeof opts === 'string') opts = { page: true, canvas: opts === 'wall' ? 'wall' : 'car' };
    opts = opts || {};
    ui.canvas = (opts.canvas === 'wall' || opts.mode === 'wall') ? 'wall' : 'car';
    closeStudio();
    state = readStore();
    lastJson = JSON.stringify(state);
    ensureCss();
    const root = document.createElement('div');
    root.id = 'np-studio';
    root.innerHTML = studioHTML();
    document.body.appendChild(root);
    studio = root;
    bind(root);
    syncUI();
    setStatus(ui.canvas === 'wall' ? 'DRAW THE Z COMPANY ARTS WALL' : 'LOADING THE 370Z');
    if (!loopOn) frameStudio();
    const wait = setInterval(function () {
      if (ui.canvas === 'wall' || hookReady()) { clearInterval(wait); if (ui.canvas !== 'wall') setStatus(ui.mode === 'draw' ? 'DRAW ON THE CAR' : 'DRAG TO SPIN'); }
    }, 200);
  }
  function closeStudio() {
    live = null;
    liveMirror = null;
    if (studio && studio.parentNode) studio.parentNode.removeChild(studio);
    studio = null;
  }
  function bakeCanvases() {
    const X = carX();
    if (X) applyToCar(X);
    return { strokes: slot().strokes.length };
  }
  function boot() {
    state = readStore();
    lastJson = JSON.stringify(state);
    try {
      ch = new BroadcastChannel(CH);
      ch.onmessage = function (ev) {
        const d = ev.data;
        if (!d || d.tab === TAB) return;
        ingest(d.json || d.data);
      };
    } catch (e) { ch = null; }
    wallState = readWall();
    wallJson = JSON.stringify(wallState);
    try {
      wallCh = new BroadcastChannel(WALL_CH);
      wallCh.onmessage = function (ev) {
        const d = ev.data;
        if (!d || d.tab === TAB) return;
        ingestWall(d.json || d.data);
      };
    } catch (e) { wallCh = null; }
    window.addEventListener('storage', function (e) {
      if (!e.key || e.key === KEY) ingest(e.newValue || '');
      if (e.key === WALL_KEY) ingestWall(e.newValue || '');
    });
    hookWorldGraffiti();
    let tries = 0;
    const hookTimer = setInterval(function () {
      tries++;
      hookWorldGraffiti();
      if (tries > 40) clearInterval(hookTimer);
    }, 250);
    if (hookReady()) return;
    let n = 0;
    const id = setInterval(function () {
      n++;
      if (hookReady() || n > 120) clearInterval(id);
    }, 250);
  }
  if (typeof window !== 'undefined') {
    window.NEON_PAINT = {
      version: 1,
      hasPaint: hasPaint,
      load: load,
      save: save,
      bakeCanvases: bakeCanvases,
      applyToCar: applyToCar,
      openStudio: openStudio,
      closeStudio: closeStudio,
      drawBuildingGraffiti: drawBuildingGraffiti,
      drawAllWallGraffiti: drawAllWallGraffiti
    };
    if (typeof document !== 'undefined') boot();
  }
})();
