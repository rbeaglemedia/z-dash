/* Interior Builder on /test/ only.
   The event planner (build mode and place objects) is the tool.
   A saved layout is that building's walk-in room. Its size is its own,
   in feet, and it may be larger than the building outside.
   Until a layout is saved, the current Interiors room stays the walk default.
   This file does not write zdash.house.v1. */
'use strict';
(function () {
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

  function remember(id, layout, solids) {
    rooms[id] = { layout: layout || '', solids: solids || null, saved: Date.now() };
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
    var lists = [];
    if (typeof CITY !== 'undefined') { if (CITY.BL) lists.push(CITY.BL); if (CITY.OBJS) lists.push(CITY.OBJS); }
    for (var L = 0; L < lists.length; L++) {
      var list = lists[L];
      for (var i = 0; i < list.length; i++) {
        var o = list[i];
        if (o && (o.oid === id || o.id === id)) return o;
      }
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
    var purpose = live.purpose || b.purpose || '';
    return !!WALK[purpose];
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
    var src = 'planner/dist/index.html?embed=1&room=' + encodeURIComponent(opts.room)
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
      if (data.from === 'walk' && typeof walkHideInterior === 'function') {
        try {
          if (typeof WALK_MODE !== 'undefined') {
            WALK_MODE.insideBuilding = false;
            WALK_MODE.insideDoor = null;
          }
          walkHideInterior();
        } catch (e) {}
      }
    }
  }

  function showBuildBtn(door) {
    if (!btn || !btn.style) return;
    if (!door || !WALK[door.purpose || (door.building && door.building.purpose)]) {
      btn.style.display = 'none';
      return;
    }
    btn.style.display = 'block';
    btn._door = door;
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
    room.x = (f.minX + f.maxX) / 2;
    room.z = (f.minZ + f.maxZ) / 2;
    if (blocked(pack, room.x, room.z) || !inFloor(f, room.x, room.z)) {
      room.x = f.minX + 0.8;
      room.z = f.minZ + 0.8;
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
      var pack = door && packFor(roomOf(door));
      if (!pack) return orig(w, d);
      var room = w.room || (w.room = { x: 0, z: 0, yaw: 0, petX: 0, petZ: 0, tx: null, tz: null });
      placeWalker(room, pack);
      var stick = readInput(w);
      var len = Math.hypot(stick.ix, stick.iz);
      if (len > 0.01) {
        var step = 2.4 * (d || 0.016);
        var nx = room.x + (stick.ix / len) * step;
        var nz = room.z + (stick.iz / len) * step;
        if (pathOk(pack, room.x, room.z, nx, nz)) { room.x = nx; room.z = nz; }
        else if (nx !== room.x && pathOk(pack, room.x, room.z, nx, room.z)) room.x = nx;
        else if (nz !== room.z && pathOk(pack, room.x, room.z, room.x, nz)) room.z = nz;
        room.yaw = Math.atan2(stick.ix, -stick.iz);
      }
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

  function hook() {
    hookWalk();
    hookPaint();
    hookShow();
  }

  loadStore();
  if (typeof window !== 'undefined') window.addEventListener('message', onMessage);
  if (typeof document !== 'undefined') {
    if (document.body) { ensureBtn(); hook(); }
    else document.addEventListener('DOMContentLoaded', function () { ensureBtn(); hook(); });
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
    FT: FT
  };
})();
