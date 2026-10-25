/* Interior Builder. HOME 1-4 and CAFE 1-4 open the event planner's 3D room
   (its meshes, its camera, one foot per unit). The outdoor on-foot move drives
   Neon World's real player and pet. Preset NPC actions stay out: that people
   simulation was not ported. The city loop pauses so only the room renders.
   Until a layout is saved the room is 60 by 80 ft, and BUILD can resize it.
   The old flat house screen stays off these doors. This file does not write
   zdash.house.v1. */
'use strict';
(function () {
  if (window.INTERIOR_BUILDER) return;
  var STORE = 'zdash.interior.layout.v1';
  var FT = 0.3048;
  var ROOM_FW = 60;
  var ROOM_FD = 80;
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
    var saved = packFor(roomOf(door));
    if (saved && saved.floor && saved.floor.maxX > saved.floor.minX && saved.floor.maxZ > saved.floor.minZ) {
      return {
        fw: +((saved.floor.maxX - saved.floor.minX) / FT).toFixed(2),
        fd: +((saved.floor.maxZ - saved.floor.minZ) / FT).toFixed(2),
        title: saved.title || fallbackName || 'Room'
      };
    }
    var rank = exploreOf(door);
    if (rank) return { fw: ROOM_FW, fd: ROOM_FD, title: rank.purpose + ' ' + rank.n };
    var look = lookFor(door);
    if (look && look.w && look.d) {
      return { fw: +(look.w / FT).toFixed(2), fd: +(look.d / FT).toFixed(2), title: look.name || fallbackName || 'Room' };
    }
    return { fw: ROOM_FW, fd: ROOM_FD, title: fallbackName || 'Room' };
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
      frame.style.cssText = 'display:none;position:fixed;inset:0;z-index:220;background:#03192f';
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
      + '&from=' + encodeURIComponent(opts.from || 'dev')
      + (opts.mode === 'walk' ? '&walk=1' : '');
    if (!opts.mode) opts.mode = 'edit';
    if (iframe) iframe.src = src;
    frame.style.display = 'block';
    setWalkPointer(opts.mode !== 'walk');
  }

  function closeFrame() {
    if (frame && frame.style) frame.style.display = 'none';
    var iframe = frame && frame.querySelector ? frame.querySelector('iframe') : null;
    if (iframe) iframe.src = 'about:blank';
    openOpts = null;
    hideCrew();
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
    if (!data) return;
    var kind = data.type;
    if (kind !== 'zd-interior-save' && kind !== 'zd-interior-exit' && kind !== 'zd-interior-back' && kind !== 'zd-interior-ready') return;
    if (data.room && data.solids && (!openOpts || openOpts.room === data.room)) remember(data.room, data.layout, data.solids);
    if (kind === 'zd-interior-save' || kind === 'zd-interior-ready') return;
    var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (kind === 'zd-interior-back') {
      if (openOpts) openOpts.mode = 'walk';
      var esp = frameEsp();
      if (esp && typeof esp.setWalk === 'function') esp.setWalk(true);
      setWalkPointer(false);
      if (wm && wm._ibWorld) {
        wm.insideBuilding = true;
        wm.onFoot = true;
        hideLegacyCard();
        settle(wm);
      }
      return;
    }
    closeFrame();
    if (wm && wm._ibWorld && wm.insideDoor && exploreOf(wm.insideDoor)) leaveToCar(wm);
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
        if (exploreOf(door)) {
          hideLegacyCard();
          var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
          if (wm && !wm._ibWorld) enterExplore(wm, door, null);
          else if (wm) { wm.insideBuilding = true; wm.onFoot = true; }
          return;
        }
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

  function stepOk(pack, x, z) {
    var f = pack.floor;
    if (x < f.minX - 0.05 || x > f.maxX + 0.05 || z < f.minZ - 0.05 || z > f.maxZ + 0.05) return false;
    if (blocked(pack, x, z)) return false;
    return true;
  }

  function hookWalk() {
    if (typeof walkRoomStep !== 'function' || walkRoomStep._ib) return false;
    var orig = walkRoomStep;
    var wrapped = function (w, d) {
      if (w && exploreOf(w.insideDoor)) {
        if (!w._ibWorld) enterExplore(w, w.insideDoor, null);
        else { w.insideBuilding = true; w.onFoot = true; hideLegacyCard(); }
        return;
      }
      return orig(w, d);
    };
    wrapped._ib = 1;
    walkRoomStep = wrapped;
    return true;
  }

  function hookIntegrate() {
    if (typeof walkIntegrate !== 'function' || walkIntegrate._ib) return false;
    var orig = walkIntegrate;
    var wrapped = function (w, d) {
      if (!w || !w._ibWorld || !exploreOf(w.insideDoor)) return orig.apply(this, arguments);
      holdCar();
      w.insideBuilding = false;
      var o = w._ibOrigin || { x: 0, z: 0 };
      var x0 = w.x, z0 = w.z;
      orig.call(this, w, d);
      var pack = activePack(w.insideDoor);
      if (!pack) return;
      var lx0 = x0 - o.x, lz0 = z0 - o.z, lx = w.x - o.x, lz = w.z - o.z;
      if (leftThroughDoor(pack, lx0, lz0, lx, lz)) { leaveToCar(w); return; }
      if (!stepOk(pack, lx, lz)) {
        if (stepOk(pack, lx, lz0)) w.z = z0;
        else if (stepOk(pack, lx0, lz)) w.x = x0;
        else { w.x = x0; w.z = z0; }
      }
      if (roomDyn) { roomDyn.x = w.x; roomDyn.z = w.z; }
    };
    wrapped._ib = 1;
    wrapped._ibOrig = orig;
    walkIntegrate = wrapped;
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
    self._ibWorld = 0;
    self._ibOrigin = null;
    closeFrame();
    if (typeof document !== 'undefined' && document.body && document.body.dataset) delete document.body.dataset.ibRoom;
    if (self.room) self.room._ib = 0;
    if (typeof walkSyncPill === 'function') walkSyncPill();
    if (typeof walkSyncGait === 'function') walkSyncGait();
    if (typeof walkSyncDyn === 'function') walkSyncDyn();
    if (typeof walkSyncEnterBtn === 'function') walkSyncEnterBtn();
    return true;
  }

  function defaultPack(door) {
    var rank = exploreOf(door) || { purpose: (door && door.purpose) || 'HOME', n: 1 };
    var W = ROOM_FW * FT, D = ROOM_FD * FT, t = 0.15, gap = 3 * FT, cx = W / 2;
    var walls = [];
    function seg(x, z, a, w, d) {
      walls.push({ kind: 'wall', name: 'Wall', x: x, z: z, a: a, w: w, d: d });
    }
    var left = cx - gap / 2, right = W - (cx + gap / 2);
    if (left > 0.3) seg(left / 2, 0, 0, left, t);
    if (right > 0.3) seg(cx + gap / 2 + right / 2, 0, 0, right, t);
    seg(W / 2, D, 0, W, t);
    seg(0, D / 2, Math.PI / 2, D, t);
    seg(W, D / 2, Math.PI / 2, D, t);
    return {
      title: rank.purpose + ' ' + rank.n,
      floor: {
        minX: 0, maxX: W, minZ: 0, maxZ: D,
        polys: [[[0, 0], [W, 0], [W, D], [0, D]]],
        rects: [{ x0: 0, z0: 0, x1: W, z1: D }]
      },
      walls: walls,
      items: [],
      doors: [{ x: cx, z: 0, ux: 1, uz: 0, nx: 0, nz: 1, w: gap }],
      _default: 1
    };
  }

  function activePack(door) {
    if (!door) return null;
    var saved = packFor(roomOf(door));
    if (saved) return saved;
    return exploreOf(door) ? defaultPack(door) : null;
  }

  function originFor(rank) {
    var n = rank && rank.n || 1;
    var lane = rank && rank.purpose === 'CAFE' ? 4 : 0;
    return { x: 9000, z: 9000 + (lane + n - 1) * 160 };
  }

  function spawnOf(pack) {
    var door = pack && pack.doors && pack.doors[0];
    var f = pack && pack.floor;
    if (door) return { x: door.x + (door.nx || 0) * 1.4, z: door.z + (door.nz || 0) * 1.4, yaw: Math.atan2(door.nx || 0, door.nz || 1) };
    if (!f) return { x: 0, z: 0, yaw: 0 };
    return { x: (f.minX + f.maxX) / 2, z: (f.minZ + f.maxZ) / 2, yaw: 0 };
  }

  function hideLegacyCard() {
    var card = typeof document !== 'undefined' && document.getElementById && document.getElementById('walk-interior');
    if (!card) return;
    card.hidden = true;
    if (card.classList) card.classList.remove('show');
  }

  function settle(w) {
    var pack = activePack(w.insideDoor);
    var o = w._ibOrigin;
    if (!pack || !o) return;
    var lx = w.x - o.x, lz = w.z - o.z;
    if (stepOk(pack, lx, lz)) return;
    var s = spawnOf(pack);
    w.x = o.x + s.x;
    w.z = o.z + s.z;
    w.yaw = s.yaw;
  }

  var roomDyn = null;

  function drawBox(x, y, z, w, d, h, a, col) {
    if (typeof line !== 'function') return;
    var c = Math.cos(a || 0), s = Math.sin(a || 0), hw = w / 2, hd = d / 2;
    var corners = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(function (p) {
      return [x + p[0] * c + p[1] * s, z - p[0] * s + p[1] * c];
    });
    for (var i = 0; i < 4; i++) {
      var a0 = corners[i], b0 = corners[(i + 1) % 4];
      line([a0[0], y, a0[1]], [b0[0], y, b0[1]], col, 2);
      line([a0[0], y + h, a0[1]], [b0[0], y + h, b0[1]], col, 2);
      line([a0[0], y, a0[1]], [a0[0], y + h, a0[1]], col, 2);
    }
  }

  function fillFloor(pack, ox, oz) {
    if (typeof proj !== 'function' || typeof ctx === 'undefined' || !ctx || !pack.floor) return;
    var f = pack.floor;
    var pts = [[f.minX, f.minZ], [f.maxX, f.minZ], [f.maxX, f.maxZ], [f.minX, f.maxZ]];
    var s = [];
    for (var i = 0; i < pts.length; i++) {
      var p = proj(ox + pts[i][0], 0.04, oz + pts[i][1]);
      if (!p) return;
      s.push(p);
    }
    ctx.beginPath();
    ctx.moveTo(s[0][0], s[0][1]);
    for (var j = 1; j < s.length; j++) ctx.lineTo(s[j][0], s[j][1]);
    ctx.closePath();
    ctx.fillStyle = 'rgba(6,42,80,0.94)';
    ctx.fill();
  }

  function drawWorldRoom() {
    var w = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (!w || !w._ibWorld || typeof line !== 'function') return;
    var pack = activePack(w.insideDoor);
    var o = w._ibOrigin;
    if (!pack || !o || !pack.floor) return;
    fillFloor(pack, o.x, o.z);
    var f = pack.floor, step = 5 * FT, n = 0, x, z;
    for (x = Math.ceil(f.minX / step) * step; x <= f.maxX && n < 40; x += step) {
      n++;
      line([o.x + x, 0.05, o.z + f.minZ], [o.x + x, 0.05, o.z + f.maxZ], 'rgba(95,212,255,0.35)', 1);
    }
    for (z = Math.ceil(f.minZ / step) * step; z <= f.maxZ && n < 80; z += step) {
      n++;
      line([o.x + f.minX, 0.05, o.z + z], [o.x + f.maxX, 0.05, o.z + z], 'rgba(95,212,255,0.35)', 1);
    }
    (pack.walls || []).forEach(function (wall) {
      drawBox(o.x + wall.x, 0, o.z + wall.z, wall.w, wall.d, 2.8, wall.a, '#7dff6b');
    });
    (pack.doors || []).forEach(function (d) {
      line([o.x + d.x, 0.06, o.z + d.z], [o.x + d.x, 2.2, o.z + d.z], '#7dff6b', 3);
    });
    (pack.items || []).forEach(function (it) {
      drawBox(o.x + it.x, 0, o.z + it.z, it.w, it.d, 1.05, it.a, '#3ee6ff');
      if (typeof proj !== 'function' || typeof ctx === 'undefined' || !ctx || !it.name) return;
      var p = proj(o.x + it.x, 1.35, o.z + it.z);
      if (!p) return;
      ctx.fillStyle = '#e9fff2';
      ctx.font = '700 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(it.name, p[0], p[1]);
    });
  }

  function ensureDyn() {
    if (roomDyn || typeof CITY === 'undefined' || !CITY || !CITY.DYN) return;
    roomDyn = { x: 9000, z: 9000, y: 1, rad: 40, draw: drawWorldRoom };
    CITY.DYN.push(roomDyn);
  }

  var crewCv = null;
  var crewCtx = null;

  function frameEsp() {
    var iframe = frame && frame.querySelector ? frame.querySelector('iframe') : null;
    try { return iframe && iframe.contentWindow && iframe.contentWindow.ESP; } catch (e) { return null; }
  }

  function setWalkPointer(editing) {
    if (!frame || !frame.style) return;
    frame.style.pointerEvents = editing ? 'auto' : 'none';
    var iframe = frame.querySelector ? frame.querySelector('iframe') : null;
    if (iframe && iframe.style) iframe.style.pointerEvents = editing ? 'auto' : 'none';
  }

  function hideCrew() {
    if (crewCv && crewCv.style) crewCv.style.display = 'none';
  }

  function ensureCrew() {
    if (crewCv || typeof document === 'undefined' || !document.body) return;
    crewCv = document.createElement('canvas');
    crewCv.id = 'zdWalkCrew';
    crewCv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:221;pointer-events:none;background:transparent';
    document.body.appendChild(crewCv);
    crewCtx = crewCv.getContext('2d');
  }

  function sizeCrew() {
    var city = typeof document !== 'undefined' && document.getElementById && document.getElementById('c');
    if (!city || !crewCv) return;
    if (crewCv.width !== city.width) crewCv.width = city.width;
    if (crewCv.height !== city.height) crewCv.height = city.height;
  }

  function roomCam(w) {
    var o = w._ibOrigin || { x: 0, z: 0 };
    var yaw = w.yaw || 0;
    var px = (w.x - o.x) / FT;
    var pz = (w.z - o.z) / FT;
    var py = (w.y || 0) / FT;
    var back = 4.5 / FT;
    return {
      px: px, py: py, pz: pz,
      cx: px - Math.sin(yaw) * back,
      cy: py + 1.85 / FT,
      cz: pz - Math.cos(yaw) * back,
      lx: px, ly: py + 1.10 / FT, lz: pz
    };
  }

  function roomProj(x, y, z) {
    var w = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (!w || !w._ibOrigin || !(typeof W === 'number' && W > 2) || !(typeof H === 'number' && H > 2)) return null;
    var cam = roomCam(w);
    var fx = (x - w._ibOrigin.x) / FT;
    var fy = y / FT;
    var fz = (z - w._ibOrigin.z) / FT;
    var zx = cam.cx - cam.lx, zy = cam.cy - cam.ly, zz = cam.cz - cam.lz;
    var zl = Math.hypot(zx, zy, zz) || 1;
    zx /= zl; zy /= zl; zz /= zl;
    var xx = zz, xy = 0, xz = -zx;
    var xl = Math.hypot(xx, xy, xz) || 1;
    xx /= xl; xy /= xl; xz /= xl;
    var yx = zy * xz - zz * xy;
    var yy = zz * xx - zx * xz;
    var yz = zx * xy - zy * xx;
    var vx = fx - cam.cx, vy = fy - cam.cy, vz = fz - cam.cz;
    var cx = vx * xx + vy * xy + vz * xz;
    var cyv = vx * yx + vy * yy + vz * yz;
    var cz = vx * zx + vy * zy + vz * zz;
    var depth = -cz;
    if (!(depth > 0.25)) return null;
    var focal = (H * 0.5) / Math.tan(20 * Math.PI / 180);
    var sx = W / 2 + (cx / depth) * focal;
    var sy = H / 2 - (cyv / depth) * focal;
    var fakeZ = depth * FT * (H * 0.9) / focal;
    return [sx, sy, fakeZ];
  }

  function paintCrew(w) {
    if (!w || !openOpts || openOpts.mode !== 'walk') { hideCrew(); return; }
    if (typeof CREW === 'undefined' || !CREW || typeof CREW.update !== 'function') return;
    if (typeof proj !== 'function' || typeof ctx === 'undefined' || !ctx) return;
    ensureCrew();
    sizeCrew();
    if (!crewCtx) return;
    if (crewCv && crewCv.style) crewCv.style.display = 'block';
    var savedCtx = ctx;
    var savedProj = proj;
    var savedDw = typeof drawWaterline === 'function' ? drawWaterline : null;
    var savedInside = w.insideBuilding;
    try {
      var dpr = typeof DPR === 'number' && DPR > 0 ? DPR : 1;
      crewCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      crewCtx.clearRect(0, 0, W, H);
      ctx = crewCtx;
      proj = roomProj;
      drawWaterline = undefined;
      w.insideBuilding = false;
      CREW.update();
    } catch (err) {
      try { window.IB_CREW = String(err && err.stack || err); } catch (e) {}
    } finally {
      ctx = savedCtx;
      proj = savedProj;
      if (savedDw) drawWaterline = savedDw;
      w.insideBuilding = savedInside;
    }
  }

  function pushPose(w) {
    if (!w || !openOpts || openOpts.mode !== 'walk') return;
    var esp = frameEsp();
    if (!esp || typeof esp.walkPose !== 'function') return;
    var o = w._ibOrigin || { x: 0, z: 0 };
    esp.walkPose({
      x: (w.x - o.x) / FT,
      z: (w.z - o.z) / FT,
      y: (w.y || 0) / FT,
      yaw: w.yaw || 0
    });
  }

  function roomFps() {
    var esp = frameEsp();
    if (esp && typeof esp.walkFps === 'number' && esp.walkFps > 0) return esp.walkFps;
    return typeof fps === 'number' ? fps : 0;
  }

  function openWalk(door) {
    var id = roomOf(door);
    var rec = rooms[id];
    var size = feetFor(door, (door && door.purpose) || 'Room');
    var esp = frameEsp();
    if (esp && typeof esp.setWalk === 'function' && openOpts && openOpts.room === id && plannerOpen()) {
      openOpts.mode = 'walk';
      openOpts.from = 'walk';
      esp.setWalk(true);
      setWalkPointer(false);
      return;
    }
    openFrame({
      room: id,
      fw: size.fw,
      fd: size.fd,
      title: size.title,
      from: 'walk',
      mode: 'walk',
      layout: rec && rec.layout
    });
  }

  function showTools(door) {
    if (!door) return;
    var id = roomOf(door);
    var esp = frameEsp();
    if (esp && typeof esp.setWalk === 'function' && openOpts && openOpts.room === id && plannerOpen()) {
      openOpts.mode = 'edit';
      esp.setWalk(false);
      setWalkPointer(true);
      hideCrew();
      return;
    }
    var rec = rooms[id];
    var size = feetFor(door, (door && door.purpose) || 'Room');
    openFrame({
      room: id,
      fw: size.fw,
      fd: size.fd,
      title: size.title,
      from: 'walk',
      mode: 'edit',
      layout: rec && rec.layout
    });
  }

  function hookMotion() {
    var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (!wm || typeof wm._update !== 'function' || wm._update._ib) return false;
    var orig = wm._update;
    var wrapped = function (d) {
      if (this._ibWorld && exploreOf(this.insideDoor)) {
        this.insideBuilding = false;
        this.onFoot = true;
        hideLegacyCard();
        try { orig.call(this, d); }
        finally {
          if (this._ibWorld && exploreOf(this.insideDoor)) {
            this.insideBuilding = true;
            if (openOpts && openOpts.mode === 'walk') {
              paintCrew(this);
              pushPose(this);
            } else hideCrew();
          }
        }
        return;
      }
      return orig.call(this, d);
    };
    wrapped._ib = 1;
    wm._update = wrapped;
    return true;
  }

  function enterExplore(self, door, orig) {
    if (!self || !door) return false;
    if (self._ibWorld && self.insideDoor === door) {
      self.insideBuilding = true;
      self.onFoot = true;
      hideLegacyCard();
      openWalk(door);
      return true;
    }
    var spot = parkSpot(door);
    var rank = exploreOf(door) || { purpose: door.purpose || 'HOME', n: 1 };
    var pack = activePack(door);
    var origin = originFor(rank);
    var spawn = spawnOf(pack);
    self.onFoot = true;
    self.insideBuilding = true;
    self.insideDoor = door;
    self.door = null;
    self.parking = null;
    self._ibCar = spot;
    self._ibWorld = 1;
    self._ibOrigin = origin;
    self.y = 0;
    self._roofY = null;
    self.vx = 0;
    self.vz = 0;
    self.speed = 0;
    self.x = origin.x + spawn.x;
    self.z = origin.z + spawn.z;
    self.yaw = spawn.yaw;
    if (typeof P !== 'undefined' && P) {
      P.v = 0;
      P.ground = true;
      P.pitch = 0;
      P.wreck = null;
      if (P.driveMode !== 'street') P.driveMode = 'street';
    }
    holdCar();
    hideLegacyCard();
    openWalk(door);
    if (typeof document !== 'undefined' && document.body && document.body.dataset) {
      document.body.dataset.ibRoom = rank.purpose + ' ' + rank.n;
    }
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
    if (!w || !w._ibWorld || !exploreOf(w.insideDoor)) return false;
    var pack = activePack(w.insideDoor);
    var o = w._ibOrigin || { x: 0, z: 0 };
    if (pack && pack.doors && pack.doors.length) return !!nearDoor(pack, w.x - o.x, w.z - o.z);
    return false;
  }

  function plannerOpen() {
    return !!(frame && frame.style && frame.style.display === 'block');
  }

  var actBtn = null;
  var walkFps = null;

  function ensureContext() {
    if (actBtn || typeof document === 'undefined' || !document.body || !document.createElement) return;
    var css = document.createElement('style');
    css.id = 'zdWalkActCss';
    css.textContent = '#zdWalkAct{position:fixed;left:50%;bottom:calc(20px + min(92px, 23vh) + 10px);transform:translateX(-50%);z-index:234;display:none;min-width:180px;height:56px;padding:0 18px;border-radius:16px;border:3px solid #fff;margin:0;background:#7dff6b;color:#04140c;font:900 18px/1 Orbitron,sans-serif;letter-spacing:.6px;align-items:center;justify-content:center;gap:8px;touch-action:manipulation;cursor:pointer;box-shadow:0 0 18px #7dff6b}'
      + '#zdWalkAct small{font:800 13px Rajdhani,sans-serif;letter-spacing:.4px}'
      + '#zdWalkAct.show{display:inline-flex}'
      + '#zdWalkAct[data-mode="exit"]{background:#ff4fd8;color:#240014;box-shadow:0 0 18px #ff4fd8}'
      + '#zdWalkFps{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 6px);right:calc(env(safe-area-inset-right, 0px) + 8px);z-index:233;display:none;pointer-events:none;margin:0;padding:2px 7px;border-radius:8px;border:1px solid rgba(232,255,244,.55);font:700 13px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#e8fff4;background:rgba(7,4,16,.86)}'
      + '#zdWalkFps.show{display:block}'
      + 'body[data-ib-room] #enterBldBtn{display:none!important}';
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
        if (door) showTools(door);
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
    if (wm && wm._ibWorld) {
      hideLegacyCard();
      wm.insideBuilding = true;
      wm.onFoot = true;
    }
    var editing = plannerOpen() && openOpts && openOpts.mode === 'edit';
    var dev = typeof document !== 'undefined' && document.getElementById && document.getElementById('devOpen');
    if (dev && dev.style) dev.style.zIndex = (wm && wm._ibWorld) ? '236' : '65';
    if (editing) {
      hideAct();
      hideCrew();
    } else if (wm && wm._ibWorld && exploreOf(wm.insideDoor)) {
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
    var inRoom = !!(wm && wm._ibWorld);
    var inside = inRoom || !!(card && card.classList && card.classList.contains('show') && wm && wm.insideBuilding);
    var pc = typeof document !== 'undefined' && document.getElementById && document.getElementById('pcFps');
    if (pc && pc.style) pc.style.zIndex = inside ? '97' : '';
    if (walkFps && walkFps.classList) {
      var useDom = inRoom || (inside && !(pc && pc.getBoundingClientRect && pc.getBoundingClientRect().width > 8));
      walkFps.classList.toggle('show', !!useDom);
      if (useDom) {
        var v = roomFps();
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
    hookIntegrate();
    hookPaint();
    hookShow();
    hookEnter();
    hookLeave();
    hookMotion();
  }

  function bootUi() {
    try {
    ensureBtn();
    ensureContext();
    hook();
    } catch (err) {
      try { window.IB_ERR = String(err && err.stack || err); } catch (e) {}
    }
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
        try { syncContext(); hookMotion(); } catch (e) {}
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
    enterExplore: enterExplore,
    activePack: activePack,
    originFor: originFor
  };
})();
