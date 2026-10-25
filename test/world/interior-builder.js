/* Interior Builder. The event planner (build mode and place objects) is the tool.
   A saved layout is that building's walk-in room. Its size is its own,
   in feet, and it may be larger than the building outside.
   Until a layout is saved, the current Interiors room stays the walk default.
   This file does not write zdash.house.v1. */
'use strict';
(function () {
  if (window.INTERIOR_BUILDER) return;
  var STORE = 'zdash.interior.layout.v1';
  var FT = 0.3048;
  var RAD = 0.35;
  var WALK = { HOME: 1, SHOWROOM: 1, NEON_PAINT: 1, GARAGE: 1, DANCE: 1, PETS: 1, CAFE: 1, ARCADE: 1, BUILDER: 1, SOCCER: 1 };
  var rooms = {};
  var frame = null;
  var btn = null;
  var openOpts = null;

  function fin(n) { return typeof n === 'number' && isFinite(n); }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE);
      var data = raw ? JSON.parse(raw) : {};
      return data && typeof data === 'object' ? data : {};
    } catch (e) { return {}; }
  }

  function writeStore() {
    try { localStorage.setItem(STORE, JSON.stringify(rooms)); } catch (e) {}
  }

  function loadStore() {
    var data = readStore();
    Object.keys(data).forEach(function (k) { rooms[k] = data[k]; });
  }

  function hits(solid, x, z, rad) {
    if (!solid) return false;
    var a = solid.a || 0;
    var c = Math.cos(a), s = Math.sin(a);
    var dx = x - solid.x, dz = z - solid.z;
    var lx = dx * c - dz * s;
    var lz = dx * s + dz * c;
    return Math.abs(lx) <= solid.w / 2 + rad && Math.abs(lz) <= solid.d / 2 + rad;
  }

  function pointInPoly(x, z, pts) {
    var ins = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0], zi = pts[i][1], xj = pts[j][0], zj = pts[j][1];
      if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / ((zj - zi) || 1e-9) + xi) ins = !ins;
    }
    return ins;
  }

  function inFloor(floor, x, z) {
    if (!floor) return true;
    var i, r;
    if (floor.rects) {
      for (i = 0; i < floor.rects.length; i++) {
        r = floor.rects[i];
        if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return true;
      }
    }
    if (floor.polys) {
      for (i = 0; i < floor.polys.length; i++) {
        if (pointInPoly(x, z, floor.polys[i])) return true;
      }
    }
    if ((!floor.rects || !floor.rects.length) && (!floor.polys || !floor.polys.length)) {
      return x >= floor.minX && x <= floor.maxX && z >= floor.minZ && z <= floor.maxZ;
    }
    return false;
  }

  function blocked(pack, x, z) {
    if (!pack) return false;
    var list = (pack.walls || []).concat(pack.items || []);
    for (var i = 0; i < list.length; i++) if (hits(list[i], x, z, RAD)) return list[i];
    return null;
  }

  function roomOf(door) {
    var b = (door && door.building) || door || {};
    var id = b.oid != null ? b.oid : (b.objId != null ? b.objId : b.id);
    var purpose = (door && door.purpose) || b.purpose || 'ROOM';
    return purpose + ':' + id;
  }

  function packFor(id) {
    var rec = rooms[id];
    return rec && rec.solids && rec.solids.floor ? rec.solids : null;
  }

  function doorsFromLayout(layout) {
    var data;
    try { data = JSON.parse(layout || ''); } catch (e) { return []; }
    var walls = data && data.walls || [];
    var doors = [];
    walls.forEach(function (p) {
      var pts = p && p.pts || [];
      var n = pts.length;
      (p.doors || []).forEach(function (d) {
        if (!d || d.i == null || !pts[d.i]) return;
        var a = pts[d.i], b = pts[(d.i + 1) % n];
        if (!a || !b) return;
        var L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (!L) return;
        var ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L;
        var w = d.w > 3 ? d.w : 3;
        doors.push({
          x: (a[0] + ux * d.t) * FT,
          z: (a[1] + uz * d.t) * FT,
          ux: ux, uz: uz,
          nx: -uz, nz: ux,
          w: w * FT
        });
      });
    });
    return doors;
  }

  function remember(id, layout, solids) {
    var pack = solids || null;
    if (pack && layout) pack.doors = doorsFromLayout(layout);
    rooms[id] = { layout: layout || '', solids: pack, saved: Date.now() };
    writeStore();
    try {
      if (layout) localStorage.setItem(STORE + ':' + id, layout);
    } catch (e) {}
  }

  function scriptSrc(file) {
    return (/\/test\//.test(location.pathname) ? '../world/' : 'world/') + file;
  }

  function loadScript(src, ready) {
    return new Promise(function (resolve) {
      if (ready()) { resolve(); return; }
      if (typeof document === 'undefined' || !document.createElement) { resolve(); return; }
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { resolve(); };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  function ensureCatalogs() {
    return loadScript(scriptSrc('house-styles.js?v=40'), function () { return !!window.HOUSE_ROW; }).then(function () {
      return loadScript(scriptSrc('interior-try.js?v=40'), function () { return !!window.INTERIOR_TRY; });
    });
  }

  function liveOf(b) {
    var id = b && (b.objId != null ? b.objId : b.oid);
    if (id == null || typeof CITY === 'undefined') return null;
    var list = CITY.BL || [];
    var hit = null;
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      /* BL.id is the list slot. The placed object id is oid. Matching id
         selects a different building, so HOME 1 was read as the NOS depot. */
      if (!o || o.oid !== id) continue;
      if (o.kind === 'b' || o.kind === 'landmark') return o;
      if (!hit) hit = o;
    }
    if (hit) return hit;
    var objs = CITY.OBJS || [];
    for (var j = 0; j < objs.length; j++) {
      var q = objs[j];
      if (q && q.id === id) return q;
    }
    return null;
  }

  function lookFor(door) {
    var purpose = (door && door.purpose) || (door && door.building && door.building.purpose) || '';
    if (purpose === 'HOME' && window.HOUSE_ROW && HOUSE_ROW.pick) {
      var pick = HOUSE_ROW.pick(door);
      if (pick && pick.look) return pick.look;
    }
    var api = window.INTERIOR_TRY;
    if (api && api.rooms && api.rooms[purpose]) {
      var n = 1;
      if (purpose === 'CAFE' && api.cafeStyle) n = api.cafeStyle(door) || 1;
      if (api.styleOf && purpose !== 'CAFE') n = api.styleOf(purpose) || 1;
      var room = api.rooms[purpose];
      return room.looks && room.looks[n - 1];
    }
    return null;
  }

  function feetFor(door, fallbackName) {
    var look = lookFor(door);
    if (look && look.w && look.d) {
      return { fw: +(look.w / FT).toFixed(2), fd: +(look.d / FT).toFixed(2), title: look.name || fallbackName || 'Room' };
    }
    return { fw: 30, fd: 40, title: fallbackName || 'Room' };
  }

  function canEnter(b) {
    if (!b) return false;
    var live = liveOf(b) || b;
    var purpose = live.purpose || (live.p && live.p.purpose) || b.purpose || '';
    return !!WALK[purpose];
  }

  function plannerPage() {
    if (/\/test\//.test(location.pathname)) return 'planner/dist/index.html';
    return '/test/planner/dist/index.html';
  }

  function openFrame(opts) {
    if (typeof document === 'undefined') return;
    openOpts = opts;
    if (opts.layout) {
      try { localStorage.setItem(STORE + ':' + opts.room, opts.layout); } catch (e) {}
    }
    if (!frame) {
      frame = document.createElement('div');
      frame.id = 'zdInterior';
      frame.style.cssText = 'display:none;position:fixed;inset:0;z-index:90;background:#03192f';
      var cv = document.createElement('iframe');
      cv.id = 'zdInteriorFrame';
      cv.setAttribute('title', 'Interior Builder');
      cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#03192f';
      frame.appendChild(cv);
      if (document.body) document.body.appendChild(frame);
    }
    var iframe = frame.querySelector ? frame.querySelector('iframe') : null;
    var src = plannerPage() + '?embed=1&room=' + encodeURIComponent(opts.room)
      + '&fw=' + encodeURIComponent(opts.fw) + '&fd=' + encodeURIComponent(opts.fd)
      + '&title=' + encodeURIComponent(opts.title || 'Room')
      + '&from=' + encodeURIComponent(opts.from || 'dev');
    if (iframe) iframe.src = src;
    frame.style.display = 'block';
  }

  function closeFrame() {
    if (frame && frame.style) frame.style.display = 'none';
    var iframe = frame && frame.querySelector ? frame.querySelector('iframe') : null;
    if (iframe) iframe.src = 'about:blank';
    openOpts = null;
  }

  function openBuilding(b, from) {
    var live = liveOf(b) || {};
    var purpose = live.purpose || (b && b.purpose) || 'ROOM';
    var door = {
      purpose: purpose,
      building: {
        id: live.oid != null ? live.oid : (b && (b.objId != null ? b.objId : b.id)),
        oid: live.oid != null ? live.oid : (b && b.objId),
        purpose: purpose,
        sign: live.sign || null,
        tryHouse: live.tryHouse || 0,
        tryCafe: live.tryCafe || 0
      }
    };
    if (door.building.sign && typeof door.building.sign === 'string') {
      door.building.sign = { t: door.building.sign, word: door.building.sign };
    }
    var id = roomOf(door);
    var rec = rooms[id];
    return ensureCatalogs().then(function () {
      var size = feetFor(door, (b && b.name) || purpose);
      openFrame({
        room: id,
        fw: size.fw,
        fd: size.fd,
        title: size.title,
        from: from || 'dev',
        layout: rec && rec.layout
      });
      return { ok: true, room: id, fw: size.fw, fd: size.fd, title: size.title };
    });
  }

  function onMessage(ev) {
    var data = ev && ev.data;
    if (!data || (data.type !== 'zd-interior-save' && data.type !== 'zd-interior-exit')) return;
    if (data.room && data.solids) remember(data.room, data.layout, data.solids);
    if (data.type === 'zd-interior-exit') {
      closeFrame();
      var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
      if (wm && wm.insideBuilding && wm.insideDoor && exploreOf(wm.insideDoor)) {
        if (wm.room) wm.room._ib = 0;
        wm.onFoot = true;
        if (typeof walkShowInterior === 'function') walkShowInterior(wm.insideDoor);
        if (typeof walkPaintRoom === 'function') walkPaintRoom();
      }
    }
  }

  function showBuildBtn(door) {
    if (btn && btn.style) btn.style.display = 'none';
    if (btn) btn._door = door || null;
  }

  function hideBuildBtn() {
    if (btn && btn.style) btn.style.display = 'none';
  }

  function ensureBtn() {
    if (btn || typeof document === 'undefined' || !document.createElement || !document.body) return;
    var css = document.createElement('style');
    css.textContent = '#zdInteriorBuild{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:46;display:none;min-height:44px;min-width:44px;padding:10px 16px;border:0;border-radius:999px;background:#7dff6b;color:#04140c;font:800 13px Orbitron,sans-serif}';
    if (document.head) document.head.appendChild(css);
    btn = document.createElement('button');
    btn.id = 'zdInteriorBuild';
    btn.type = 'button';
    btn.textContent = 'Interior Builder';
    if (btn.setAttribute) btn.setAttribute('aria-label', 'Interior Builder');
    if (btn.addEventListener) btn.addEventListener('click', function (ev) {
      if (ev.preventDefault) ev.preventDefault();
      var door = (typeof WALK_MODE !== 'undefined' && WALK_MODE.insideDoor) || btn._door;
      if (!door) return;
      openBuilding({ purpose: door.purpose, objId: door.building && (door.building.oid != null ? door.building.oid : door.building.id), name: door.purposeLabel || door.purpose }, 'walk');
    });
    document.body.appendChild(btn);
  }

  function hookShow() {
    if (typeof walkShowInterior === 'function' && !walkShowInterior._ib) {
      var orig = walkShowInterior;
      var wrapped = function (door) {
        var out = orig.apply(this, arguments);
        showBuildBtn(door);
        return out;
      };
      wrapped._ib = 1;
      walkShowInterior = wrapped;
    }
    if (typeof walkHideInterior === 'function' && !walkHideInterior._ib) {
      var origH = walkHideInterior;
      var wrappedH = function () {
        hideBuildBtn();
        return origH.apply(this, arguments);
      };
      wrappedH._ib = 1;
      walkHideInterior = wrappedH;
    }
  }

  function readInput(w) {
    var ix = 0, iz = 0;
    if (typeof K !== 'undefined' && K) {
      ix = (K.ArrowRight || K.KeyD ? 1 : 0) - (K.ArrowLeft || K.KeyA ? 1 : 0);
      iz = (K.ArrowDown || K.KeyS ? 1 : 0) - (K.ArrowUp || K.KeyW ? 1 : 0);
    }
    var n = w.nudge;
    if (n && (Math.abs(n.x) > 0.01 || Math.abs(n.z) > 0.01)) { ix = n.x; iz = n.z; }
    if (!ix && !iz && typeof B !== 'undefined' && B && (B.walk || B.tup)) iz = -1;
    var room = w.room;
    if (!ix && !iz && room && room.tx != null) {
      var dx = room.tx - room.x, dz = room.tz - room.z;
      if (Math.hypot(dx, dz) < 0.08) { room.tx = null; room.tz = null; }
      else { ix = dx; iz = dz; }
    }
    return { ix: ix, iz: iz };
  }

  function placeWalker(room, pack) {
    if (room._ib) return;
    var f = pack.floor;
    var door = (pack.doors || [])[0];
    if (door) {
      room.x = door.x + door.nx * 1.15;
      room.z = door.z + door.nz * 1.15;
    } else {
      room.x = (f.minX + f.maxX) / 2;
      room.z = (f.minZ + f.maxZ) / 2;
    }
    if (blocked(pack, room.x, room.z) || !inFloor(f, room.x, room.z)) {
      room.x = (f.minX + f.maxX) / 2;
      room.z = (f.minZ + f.maxZ) / 2;
    }
    room.petX = room.x + 0.8;
    room.petZ = room.z + 0.4;
    room._ib = 1;
  }

  function stepOk(pack, x, z) {
    var f = pack.floor;
    if (x < f.minX - 0.05 || x > f.maxX + 0.05 || z < f.minZ - 0.05 || z > f.maxZ + 0.05) return false;
    if (blocked(pack, x, z)) return false;
    return true;
  }

  function pathOk(pack, x0, z0, x1, z1) {
    for (var i = 1; i <= 4; i++) {
      var t = i / 4;
      if (!stepOk(pack, x0 + (x1 - x0) * t, z0 + (z1 - z0) * t)) return false;
    }
    return true;
  }

  function hookWalk() {
    if (typeof walkRoomStep !== 'function' || walkRoomStep._ib) return false;
    var orig = walkRoomStep;
    var wrapped = function (w, d) {
      var door = w && w.insideDoor;
      if (w && w._ibCar) holdCar();
      var pack = door && exploreOf(door) && packFor(roomOf(door));
      if (!pack) {
        var plain = orig(w, d);
        if (w && w.room && w.room.z < -2.7 && exploreOf(door) && w._ibCar) leaveToCar(w);
        return plain;
      }
      var room = w.room || (w.room = { x: 0, z: 0, yaw: 0, petX: 0, petZ: 0, tx: null, tz: null });
      placeWalker(room, pack);
      var stick = readInput(w);
      var len = Math.hypot(stick.ix, stick.iz);
      if (len > 0.01) {
        var step = 2.4 * (d || 0.016);
        var nx = room.x + (stick.ix / len) * step;
        var nz = room.z + (stick.iz / len) * step;
        if (leftThroughDoor(pack, room.x, room.z, nx, nz)) { leaveToCar(w); return; }
        if (pathOk(pack, room.x, room.z, nx, nz)) { room.x = nx; room.z = nz; }
        else if (nx !== room.x && pathOk(pack, room.x, room.z, nx, room.z)) room.x = nx;
        else if (nz !== room.z && pathOk(pack, room.x, room.z, room.x, nz)) room.z = nz;
        else if (leftThroughDoor(pack, room.x, room.z, nx, nz)) { leaveToCar(w); return; }
        room.yaw = Math.atan2(stick.ix, -stick.iz);
      }
      if (leftThroughDoor(pack, room.x, room.z, room.x, room.z)) { leaveToCar(w); return; }
      var k = Math.min(1, (d || 0.016) * 3.2);
      var hx = room.x + 0.85, hz = room.z + 0.35;
      if (room.petX == null) room.petX = hx;
      if (room.petZ == null) room.petZ = hz;
      room.petX += (hx - room.petX) * k;
      room.petZ += (hz - room.petZ) * k;
    };
    wrapped._ib = 1;
    walkRoomStep = wrapped;
    return true;
  }

  function poly(g, pts, map) {
    g.beginPath();
    pts.forEach(function (p, i) {
      var q = map(p[0], p[1]);
      if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]);
    });
    g.closePath();
  }

  function corners(solid) {
    var a = solid.a || 0, c = Math.cos(a), s = Math.sin(a);
    var hw = solid.w / 2, hd = solid.d / 2;
    return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(function (p) {
      return [solid.x + p[0] * c + p[1] * s, solid.z - p[0] * s + p[1] * c];
    });
  }

  function paintSaved(pack) {
    var cv = document.getElementById('walk-room-cv');
    if (!cv || !cv.getContext) return;
    var card = document.getElementById('walk-interior');
    var W = Math.max(320, Math.floor((card && card.clientWidth) || window.innerWidth || 844));
    var H = Math.max(180, Math.floor((card && card.clientHeight) || window.innerHeight || 390));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    var g = cv.getContext('2d');
    if (!g) return;
    var f = pack.floor;
    var pad = 28;
    var spanX = Math.max(0.5, f.maxX - f.minX);
    var spanZ = Math.max(0.5, f.maxZ - f.minZ);
    var s = Math.min((W - pad * 2) / spanX, (H - pad * 2 - 36) / spanZ);
    function map(x, z) {
      return [pad + (x - f.minX) * s, H - pad - 28 - (z - f.minZ) * s];
    }
    g.fillStyle = '#03192f';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#d5e2ee';
    if (f.polys && f.polys.length) {
      f.polys.forEach(function (pts) { poly(g, pts, map); g.fill(); });
    } else {
      var a = map(f.minX, f.maxZ), b = map(f.maxX, f.minZ);
      g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
    }
    g.strokeStyle = 'rgba(6,42,80,0.28)';
    g.lineWidth = 1;
    g.beginPath();
    var step = spanX > 40 * FT ? 5 * FT : FT;
    var nLine = 0;
    for (var x = Math.ceil(f.minX / step) * step; x <= f.maxX && nLine < 80; x += step) {
      nLine++;
      var p0 = map(x, f.minZ), p1 = map(x, f.maxZ);
      g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]);
    }
    for (var z = Math.ceil(f.minZ / step) * step; z <= f.maxZ && nLine < 160; z += step) {
      nLine++;
      var q0 = map(f.minX, z), q1 = map(f.maxX, z);
      g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]);
    }
    g.stroke();
    g.fillStyle = '#062a50';
    (pack.walls || []).forEach(function (wall) { poly(g, corners(wall), map); g.fill(); });
    g.fillStyle = '#7dff6b';
    (pack.doors || []).forEach(function (d) {
      var gap = {
        x: d.x, z: d.z, a: Math.atan2(-d.uz, d.ux), w: d.w, d: 0.35
      };
      poly(g, corners(gap), map);
      g.fill();
    });
    var labels = [];
    (pack.items || []).forEach(function (it) {
      poly(g, corners(it), map);
      g.fillStyle = '#2f7ed8';
      g.fill();
      var at = map(it.x, it.z);
      var text = it.name || 'Item';
      var size = 8;
      g.font = '700 8px sans-serif';
      var tw = text.length * 5;
      try { tw = g.measureText(text).width || tw; } catch (e) {}
      labels.push({ text: text, x: at[0], y: at[1], l: at[0] - tw / 2, t: at[1] - size, r: at[0] + tw / 2, b: at[1] + 2, wide: it.w });
    });
    labels.sort(function (a, b) { return b.wide - a.wide; });
    var placed = [];
    labels.forEach(function (lab) {
      var over = false;
      for (var i = 0; i < placed.length; i++) {
        var r = placed[i];
        if (lab.l < r.r && lab.r > r.l && lab.t < r.b && lab.b > r.t) { over = true; break; }
      }
      if (over) return;
      placed.push(lab);
      g.fillStyle = '#04140c';
      g.font = '700 8px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(lab.text, lab.x, lab.y);
    });
    var walker = (typeof WALK_MODE !== 'undefined' && WALK_MODE.room) || null;
    if (walker && fin(walker.x)) {
      var wp = map(walker.x, walker.z);
      g.fillStyle = '#ff4fd8';
      g.beginPath();
      g.arc(wp[0], wp[1], 7, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = '#e9fff2';
    g.font = '800 14px sans-serif';
    g.textAlign = 'left';
    g.textBaseline = 'alphabetic';
    g.fillText((pack.title || 'Room') + '  ·  saved layout', 12, H - 12);
  }

  function hookPaint() {
    if (typeof walkPaintRoom !== 'function' || walkPaintRoom._ib) return false;
    var orig = walkPaintRoom;
    var wrapped = function () {
      var door = (typeof WALK_MODE !== 'undefined' && WALK_MODE.insideDoor) || null;
      var pack = door && packFor(roomOf(door));
      if (!pack) return orig();
      paintSaved(pack);
    };
    wrapped._ib = 1;
    walkPaintRoom = wrapped;
    return true;
  }

  function signText(b) {
    if (!b) return '';
    var s = b.sign;
    var word = '';
    if (s && typeof s === 'object') word = s.word || s.t || '';
    else if (typeof s === 'string') word = s;
    return String(word || b.name || b.purposeLabel || b.label || '');
  }

  function rowMatch(text) {
    var m = String(text || '').toUpperCase().match(/\b(HOME|CAFE)\s+([1-4])\b/);
    if (!m) return null;
    return { purpose: m[1], n: +m[2] };
  }

  function exploreOf(door) {
    var b = (door && door.building) || door || {};
    var live = liveOf(b) || b;
    var purpose = (door && door.purpose) || live.purpose || b.purpose || '';
    if (purpose !== 'HOME' && purpose !== 'CAFE') return null;
    var named = rowMatch(signText(live) + ' ' + signText(b) + ' ' + (b.name || '') + ' ' + (live.purposeLabel || '') + ' ' + (door.purposeLabel || ''));
    if (named && named.purpose === purpose) return named;
    if (typeof CITY === 'undefined' || !CITY.BL) return { purpose: purpose, n: 1 };
    var list = [];
    for (var i = 0; i < CITY.BL.length; i++) {
      var o = CITY.BL[i];
      if (!o || o.purpose !== purpose || rowMatch(signText(o))) continue;
      list.push(o);
    }
    list.sort(function (a, c) { return (a.oid || 0) - (c.oid || 0); });
    if (list.length > 4) return null;
    var id = live.oid != null ? live.oid : (live.id != null ? live.id : b.id);
    for (var j = 0; j < list.length && j < 4; j++) {
      var oid = list[j].oid != null ? list[j].oid : list[j].id;
      if (oid === id) return { purpose: purpose, n: j + 1 };
    }
    return null;
  }

  function nearDoor(pack, x, z) {
    var doors = pack && pack.doors || [];
    for (var i = 0; i < doors.length; i++) {
      var d = doors[i];
      var along = (x - d.x) * d.ux + (z - d.z) * d.uz;
      var perp = (x - d.x) * d.nx + (z - d.z) * d.nz;
      if (Math.abs(along) <= d.w / 2 + 0.15 && perp > -0.45 && perp < 0.85) return d;
    }
    return null;
  }

  function leftThroughDoor(pack, x0, z0, x1, z1) {
    if (!pack || !pack.floor || inFloor(pack.floor, x1, z1) || blocked(pack, x1, z1)) return false;
    return !!(nearDoor(pack, x0, z0) || nearDoor(pack, x1, z1));
  }

  function parkSpot(door) {
    var b = (door && door.building) || {};
    var nx = door && door.nx || 0, nz = door && door.nz || 0;
    var len = Math.hypot(nx, nz) || 1;
    nx /= len; nz /= len;
    var dx = door && door.x != null ? door.x : (typeof P !== 'undefined' ? P.x : 0);
    var dz = door && door.z != null ? door.z : (typeof P !== 'undefined' ? P.z : 0);
    var px = typeof P !== 'undefined' ? P.x : dx;
    var pz = typeof P !== 'undefined' ? P.z : dz;
    var inside = b.x0 != null && px > b.x0 - 0.3 && px < b.x1 + 0.3 && pz > b.z0 - 0.3 && pz < b.z1 + 0.3;
    var close = Math.hypot(px - dx, pz - dz) < 2.4;
    var spot = {
      x: px, z: pz,
      y: typeof P !== 'undefined' ? (P.y || 0) : 0,
      yaw: typeof P !== 'undefined' ? (P.yaw || 0) : 0
    };
    if (inside || close) {
      spot.x = dx + nx * 5.2 - nz * 2.4;
      spot.z = dz + nz * 5.2 + nx * 2.4;
      spot.y = 0;
      spot.yaw = Math.atan2(nx, nz);
    }
    return spot;
  }

  function holdCar() {
    var car = typeof WALK_MODE !== 'undefined' && WALK_MODE && WALK_MODE._ibCar;
    if (!car || typeof P === 'undefined' || !P) return;
    P.x = car.x; P.z = car.z; P.y = car.y || 0; P.v = 0; P.ground = true; P.pitch = 0;
    P.yaw = car.yaw || 0;
    if (P.hd != null) P.hd = P.yaw;
    if (P.bank != null) P.bank = 0;
  }

  function leaveToCar(w) {
    var self = w || (typeof WALK_MODE !== 'undefined' ? WALK_MODE : null);
    var car = self && self._ibCar;
    if (typeof walkHideInterior === 'function') {
      try { walkHideInterior(); } catch (e) {}
    }
    if (!self) return false;
    self.insideBuilding = false;
    self.insideDoor = null;
    self.dancing = false;
    self.vx = 0; self.vz = 0; self.speed = 0; self.gait = 'idle';
    if (car && typeof P !== 'undefined' && P) {
      P.x = car.x; P.z = car.z; P.y = car.y || 0; P.yaw = car.yaw || 0;
      if (P.hd != null) P.hd = P.yaw;
      P.v = 0; P.ground = true; P.pitch = 0;
      if (P.bank != null) P.bank = 0;
      self.onFoot = false;
      self.x = car.x; self.z = car.z; self.y = car.y || 0; self.yaw = car.yaw || 0;
      self.door = null;
      self.parking = null;
    }
    self._ibCar = null;
    if (self.room) self.room._ib = 0;
    if (typeof walkSyncPill === 'function') walkSyncPill();
    if (typeof walkSyncGait === 'function') walkSyncGait();
    if (typeof walkSyncDyn === 'function') walkSyncDyn();
    if (typeof walkSyncEnterBtn === 'function') walkSyncEnterBtn();
    return true;
  }

  function enterExplore(self, door, orig) {
    var spot = parkSpot(door);
    if (orig) {
      try { orig.call(self); } catch (e) {}
    }
    self.onFoot = true;
    self.insideBuilding = true;
    self.insideDoor = door;
    self.door = door;
    self.parking = null;
    self._ibCar = spot;
    self.y = 0;
    if (self.room) self.room._ib = 0;
    if (typeof P !== 'undefined' && P) { P.v = 0; P.ground = true; P.pitch = 0; }
    holdCar();
    if (typeof walkShowInterior === 'function') walkShowInterior(door);
    if (typeof walkSyncEnterBtn === 'function') walkSyncEnterBtn();
    return true;
  }

  function withBuilding(door) {
    if (!door || door.building || door.buildingId == null) return door;
    if (typeof CITY === 'undefined' || !CITY.BL) return door;
    for (var i = 0; i < CITY.BL.length; i++) {
      if (CITY.BL[i] && CITY.BL[i].id === door.buildingId) {
        door.building = CITY.BL[i];
        break;
      }
    }
    return door;
  }

  function closestDoor(maxDist) {
    if (typeof CITY === 'undefined' || !CITY.BL || typeof P === 'undefined' || !P) return null;
    var onFoot = !!(typeof WALK_MODE !== 'undefined' && WALK_MODE && WALK_MODE.onFoot);
    var x = onFoot ? WALK_MODE.x : P.x;
    var z = onFoot ? WALK_MODE.z : P.z;
    if (!fin(x) || !fin(z)) return null;
    var best = null;
    for (var i = 0; i < CITY.BL.length; i++) {
      var b = CITY.BL[i];
      if (!b || !b.doors) continue;
      for (var d = 0; d < b.doors.length; d++) {
        var door = b.doors[d];
        var dx = door[0] - x, dz = door[1] - z, dist = Math.hypot(dx, dz);
        if (!(dist <= maxDist) || (best && dist >= best.dist)) continue;
        var nx = door[2] || 0, nz = door[3] || 0;
        if ((x - door[0]) * nx + (z - door[1]) * nz < -2) continue;
        best = {
          x: door[0], z: door[1], nx: nx, nz: nz, dist: dist, y: 0,
          buildingId: b.id, building: b,
          purpose: b.purpose, purposeLabel: b.purposeLabel, color: b.c
        };
      }
    }
    return best;
  }

  function outsideDoor() {
    if (typeof WALK_MODE === 'undefined' || !WALK_MODE || WALK_MODE.insideBuilding) return null;
    if (typeof P !== 'undefined' && P && (P.wreck || !P.ground || (!WALK_MODE.onFoot && !(P.v < 8)))) return null;
    var door = closestDoor(WALK_MODE.onFoot ? 10 : 12);
    if (!door || !exploreOf(door)) return null;
    return door;
  }

  function atInsideDoor(w) {
    if (!w || !w.insideBuilding || !exploreOf(w.insideDoor)) return false;
    var pack = packFor(roomOf(w.insideDoor));
    var room = w.room;
    if (pack && room && pack.doors && pack.doors.length) return !!nearDoor(pack, room.x, room.z);
    return !!(room && room.z != null && room.z < -1.6);
  }

  var actBtn = null;
  var walkFps = null;

  function ensureContext() {
    if (actBtn || typeof document === 'undefined' || !document.body || !document.createElement) return;
    var css = document.createElement('style');
    css.id = 'zdWalkActCss';
    css.textContent = '#zdWalkAct{position:fixed;left:50%;bottom:calc(20px + min(92px, 23vh) + 10px);transform:translateX(-50%);z-index:96;display:none;min-width:132px;height:48px;padding:0 14px;border-radius:14px;border:2.5px solid #fff;margin:0;background:#7dff6b;color:#04140c;font:900 14px/1 Orbitron,sans-serif;letter-spacing:.4px;align-items:center;justify-content:center;gap:6px;touch-action:manipulation;cursor:pointer}'
      + '#zdWalkAct small{font:800 11px Rajdhani,sans-serif;letter-spacing:.4px}'
      + '#zdWalkAct.show{display:inline-flex}'
      + '#zdWalkAct[data-mode="exit"]{background:#ff4fd8;color:#240014}'
      + '#zdWalkFps{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 6px);right:calc(env(safe-area-inset-right, 0px) + 8px);z-index:97;display:none;pointer-events:none;margin:0;padding:2px 7px;border-radius:8px;border:1px solid rgba(232,255,244,.55);font:700 13px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#e8fff4;background:rgba(7,4,16,.86)}'
      + '#zdWalkFps.show{display:block}';
    if (document.head) document.head.appendChild(css);
    actBtn = document.createElement('button');
    actBtn.id = 'zdWalkAct';
    actBtn.type = 'button';
    actBtn.innerHTML = 'ENTER<small></small>';
    actBtn.addEventListener('click', function (ev) {
      if (ev.preventDefault) ev.preventDefault();
      var mode = actBtn.getAttribute('data-mode');
      var wm = window.WALK_MODE;
      if (mode === 'build') {
        var door = wm && wm.insideDoor;
        if (!door) return;
        openBuilding({
          purpose: door.purpose,
          objId: door.building && (door.building.oid != null ? door.building.oid : door.building.id),
          name: (exploreOf(door) ? exploreOf(door).purpose + ' ' + exploreOf(door).n : door.purpose)
        }, 'walk');
        return;
      }
      if (mode === 'exit') { leaveToCar(wm); return; }
      var near = outsideDoor();
      if (near && wm) enterExplore(wm, near, window.walkEnterDoor && window.walkEnterDoor._ibOrig);
    });
    document.body.appendChild(actBtn);
    walkFps = document.createElement('div');
    walkFps.id = 'zdWalkFps';
    walkFps.setAttribute('aria-label', 'Frames per second');
    walkFps.textContent = '-- FPS';
    document.body.appendChild(walkFps);
  }

  function paintAct(mode, rank) {
    if (!actBtn) return;
    actBtn.setAttribute('data-mode', mode);
    var lead = mode === 'build' ? 'BUILD' : (mode === 'exit' ? 'EXIT' : 'ENTER');
    var sub = mode === 'build' ? 'ROOM' : (mode === 'exit' ? 'STREET' : (rank ? rank.purpose + ' ' + rank.n : ''));
    var small = actBtn.querySelector('small');
    if (actBtn.firstChild && actBtn.firstChild.nodeType === 3) actBtn.firstChild.nodeValue = lead;
    else actBtn.insertBefore(document.createTextNode(lead), actBtn.firstChild);
    if (small) small.textContent = sub;
    actBtn.setAttribute('aria-label', sub ? (lead + ' ' + sub) : lead);
    actBtn.classList.add('show');
  }

  function hideAct() {
    if (!actBtn) return;
    actBtn.classList.remove('show');
    actBtn.setAttribute('data-mode', '');
  }

  function syncContext() {
    ensureContext();
    var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    var mode = '';
    var rank = null;
    if (wm && wm._ibCar) holdCar();
    if (wm && wm.insideBuilding && exploreOf(wm.insideDoor)) {
      rank = exploreOf(wm.insideDoor);
      mode = atInsideDoor(wm) ? 'exit' : 'build';
    } else {
      var door = outsideDoor();
      if (door) { rank = exploreOf(door); mode = 'enter'; }
    }
    var other = typeof document !== 'undefined' && document.getElementById && document.getElementById('enterBldBtn');
    if (other && other.style) {
      if (mode) other.style.display = 'none';
    }
    var step = typeof document !== 'undefined' && document.getElementById && document.getElementById('walk-step-out');
    if (step && step.style) step.style.visibility = mode ? 'hidden' : '';
    if (mode) paintAct(mode, rank);
    else hideAct();
    var card = typeof document !== 'undefined' && document.getElementById && document.getElementById('walk-interior');
    var inside = !!(card && card.classList && card.classList.contains('show') && wm && wm.insideBuilding);
    var pc = typeof document !== 'undefined' && document.getElementById && document.getElementById('pcFps');
    if (pc && pc.style) pc.style.zIndex = inside ? '97' : '';
    if (walkFps && walkFps.classList) {
      var useDom = inside && !(pc && pc.getBoundingClientRect && pc.getBoundingClientRect().width > 8);
      walkFps.classList.toggle('show', !!useDom);
      if (useDom) {
        var v = typeof fps === 'number' ? fps : 0;
        walkFps.textContent = Math.round(v) + ' FPS';
      }
    }
  }

  function hookEnter() {
    var fn = typeof walkEnterDoor === 'function' ? walkEnterDoor : null;
    if (!fn || fn._ibPark) return;
    var orig = fn._ibOrig || fn;
    var wrapped = function () {
      var self = (this && typeof this.nearestDoor === 'function') ? this : (typeof WALK_MODE !== 'undefined' ? WALK_MODE : null);
      var explore = outsideDoor();
      if (explore && self && !self.insideBuilding) return enterExplore(self, explore, orig);
      var target = typeof walkEntryTarget === 'function' ? walkEntryTarget() : null;
      var door = withBuilding(target && target.door);
      if (door && self && exploreOf(door) && !self.insideBuilding) return enterExplore(self, door, orig);
      return orig.apply(this, arguments);
    };
    wrapped._ibPark = 1;
    wrapped._ibOrig = orig;
    try { walkEnterDoor = wrapped; } catch (e) {}
    window.walkEnterDoor = wrapped;
  }

  function hookLeave() {
    var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (!wm || typeof wm.stepBackOutside !== 'function' || wm.stepBackOutside._ib) return;
    var orig = wm.stepBackOutside;
    wm.stepBackOutside = function () {
      if (this && this._ibCar && this.insideDoor && exploreOf(this.insideDoor)) return leaveToCar(this);
      return orig.apply(this, arguments);
    };
    wm.stepBackOutside._ib = 1;
  }

  function hook() {
    hookWalk();
    hookPaint();
    hookShow();
    hookEnter();
    hookLeave();
  }

  function bootUi() {
    ensureBtn();
    ensureContext();
    hook();
    if (typeof window !== 'undefined' && window.syncEnterBldBtn && !window.syncEnterBldBtn._ib) {
      var origSync = window.syncEnterBldBtn;
      var wrappedSync = function () {
        var out = origSync.apply(this, arguments);
        try { syncContext(); } catch (e) {}
        return out;
      };
      wrappedSync._ib = 1;
      window.syncEnterBldBtn = wrappedSync;
    }
    if (typeof requestAnimationFrame === 'function') {
      var loop = function () {
        try { syncContext(); } catch (e) {}
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  loadStore();
  if (typeof window !== 'undefined') window.addEventListener('message', onMessage);
  if (typeof document !== 'undefined') {
    if (document.body) bootUi();
    else document.addEventListener('DOMContentLoaded', function () { bootUi(); });
  }

  /* Later enter flow can call enter(door). It opens this same planner. */
  function enter(door) {
    var b = (door && door.building) || door || {};
    return openBuilding({
      purpose: (door && door.purpose) || b.purpose,
      objId: b.oid != null ? b.oid : b.id,
      name: (door && door.purposeLabel) || b.purpose || 'Room'
    }, 'walk');
  }

  window.INTERIOR_BUILDER = {
    open: openFrame,
    close: closeFrame,
    enter: enter,
    openBuilding: openBuilding,
    canEnter: canEnter,
    remember: remember,
    blocks: function (id, x, z) { return !!blocked(packFor(id), x, z); },
    hits: hits,
    inFloor: inFloor,
    feetFor: feetFor,
    roomOf: roomOf,
    hook: hook,
    pack: packFor,
    FT: FT,
    exploreOf: exploreOf,
    parkSpot: parkSpot,
    doorsOf: doorsFromLayout,
    nearDoor: nearDoor,
    leftThroughDoor: leftThroughDoor,
    holdCar: holdCar,
    leaveToCar: leaveToCar,
    enterExplore: enterExplore
  };
})();
