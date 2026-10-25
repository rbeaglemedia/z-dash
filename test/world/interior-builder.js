/* Interior Builder. Any enterable building opens one blank planner room.
   Floor, walls, and furniture come only from that building's saved BUILD data.
   The outdoor on-foot player and pet walk inside the angled room. The city
   loop pauses. The old flat house screen stays off these doors. This file
   does not write zdash.house.v1. DEV Builder is unchanged. */
'use strict';
(function () {
  if (window.INTERIOR_BUILDER) return;
  var STORE = 'zdash.interior.layout.v1';
  var FT = 0.3048;
  var ROOM_FW = 60;
  var ROOM_FD = 80;
  var RAD = 0.35;
  var WALK = { HOME: 1, SHOWROOM: 1, NEON_PAINT: 1, GARAGE: 1, DANCE: 1, PETS: 1, CAFE: 1, ARCADE: 1, BUILDER: 1, SOCCER: 1, SKY_DROP: 1 };
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
        title: interiorLabel(door),
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
        wm.onFoot = true;
        hideLegacyCard();
        settle(wm);
        holdCity(true);
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
          else if (wm) { wm.onFoot = true; holdCity(true); }
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
        if (!w._ibWorld && w.onFoot) enterExplore(w, w.insideDoor, null);
        else { w.onFoot = true; hideLegacyCard(); holdCity(true); }
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
      if (!w || !w._ibWorld || !exploreOf(w.insideDoor)) {
        if (typeof window !== 'undefined') window.ZD_ROOM_NOCAR = 0;
        return orig.apply(this, arguments);
      }
      if (typeof window !== 'undefined') window.ZD_ROOM_NOCAR = 1;
      holdCar(w);
      w.insideBuilding = false;
      var o = w._ibOrigin || { x: 0, z: 0 };
      var x0 = w.x, z0 = w.z;
      orig.call(this, w, d);
      holdCar(w);
      w.y = 0;
      w._roofY = null;
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
    if (!WALK[purpose]) return null;
    var named = rowMatch(signText(live) + ' ' + signText(b) + ' ' + (b.name || '') + ' ' + (live.purposeLabel || '') + ' ' + ((door && door.purposeLabel) || ''));
    var title = (named && named.purpose === purpose) ? (named.purpose + ' ' + named.n) : (signText(live) || signText(b) || (door && door.purposeLabel) || purpose);
    return { purpose: purpose, n: named && named.purpose === purpose ? named.n : 1, title: title || purpose };
  }

  function interiorLabel(door) {
    var rank = exploreOf(door);
    var base = 'Room';
    if (door && door.direct) base = 'HOME';
    else if (rank && rank.title) base = rank.title;
    else if (rank) base = rank.purpose + ' ' + rank.n;
    if (!/interior\s*$/i.test(base)) base += ' Interior';
    return base;
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

  function holdCar(w) {
    var wm = (w && w._ibCar) ? w : (typeof WALK_MODE !== 'undefined' ? WALK_MODE : null);
    var car = wm && wm._ibCar;
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
    if (typeof window !== 'undefined') window.ZD_ROOM_NOCAR = 0;
    closeFrame();
    if (typeof document !== 'undefined' && document.body && document.body.dataset) {
      delete document.body.dataset.ibRoom;
      delete document.body.dataset.ibWorld;
    }
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

  function originFor() {
    return { x: 9000, z: 9000 };
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

  function frameEsp() {
    var iframe = frame && frame.querySelector ? frame.querySelector('iframe') : null;
    try { return iframe && iframe.contentWindow && iframe.contentWindow.ESP; } catch (e) { return null; }
  }

  function setWalkPointer() {
    if (!frame || !frame.style) return;
    frame.style.pointerEvents = 'auto';
    var iframe = frame.querySelector ? frame.querySelector('iframe') : null;
    if (iframe && iframe.style) iframe.style.pointerEvents = 'auto';
  }

  function hideCrew() {}

  var LOOK = {
    girl: { hip: .10, shoulder: .15, thigh: .40, shin: .38, torso: .40, neck: .045, head: .125, uarm: .26, farm: .23, armR: .036, legR: .055, pony: 1,
      cloth: '#1c0e22', cloth2: '#2a1434', trim: '#ff4ad8', accent: '#3ee6ff', sole: '#ffe14d', hair: '#ff4ad8' },
    boy: { hip: .11, shoulder: .185, thigh: .42, shin: .40, torso: .42, neck: .05, head: .12, uarm: .28, farm: .24, armR: .042, legR: .06, hood: 1,
      cloth: '#10161f', cloth2: '#1a2838', trim: '#3ee6ff', accent: '#7aa6ff', sole: '#b6ff4a', hair: '#102033' }
  };

  function V3(x, y, z) { return { x: x, y: y, z: z }; }
  function add3(a, b) { return V3(a.x + b.x, a.y + b.y, a.z + b.z); }
  function mul3(a, s) { return V3(a.x * s, a.y * s, a.z * s); }
  function rx3(p, a) { var c = Math.cos(a), s = Math.sin(a); return V3(p.x, p.y * c - p.z * s, p.y * s + p.z * c); }
  function rz3(p, a) { var c = Math.cos(a), s = Math.sin(a); return V3(p.x * c - p.y * s, p.x * s + p.y * c, p.z); }
  function basis3(forward, out) {
    return { x: rz3(V3(1, 0, 0), out), y: rz3(rx3(V3(0, 1, 0), -forward), out), z: rz3(rx3(V3(0, 0, 1), -forward), out) };
  }
  function apply3(B, p) { return V3(B.x.x * p.x + B.y.x * p.y + B.z.x * p.z, B.x.y * p.x + B.y.y * p.y + B.z.y * p.z, B.x.z * p.x + B.y.z * p.y + B.z.z * p.z); }
  function chain3(forward, bend, l1, l2, out) {
    var B = basis3(forward, out);
    var knee = mul3(apply3(B, V3(0, -1, 0)), l1);
    var ankle = add3(knee, mul3(apply3(B, rx3(V3(0, -1, 0), bend)), l2));
    return { knee: knee, ankle: ankle };
  }
  function figurePts(look, spec) {
    var hip = V3((spec.sway || 0) * .04, look.thigh + look.shin + (spec.bob || 0), 0);
    var sway = spec.sway || 0, lean = spec.lean || 0;
    var up = rz3(rx3(V3(0, 1, 0), lean), sway), side = rz3(rx3(V3(1, 0, 0), lean), sway);
    var chest = add3(hip, mul3(up, look.torso)), neck = add3(chest, mul3(up, look.neck)), head = add3(neck, mul3(up, look.head * .85));
    var shL = add3(chest, mul3(side, -look.shoulder)), shR = add3(chest, mul3(side, look.shoulder));
    var hpL = add3(hip, V3(-look.hip, -.02, 0)), hpR = add3(hip, V3(look.hip, -.02, 0));
    var out = spec.armOut == null ? 0.2 : spec.armOut;
    var aL = chain3(spec.armL || 0, spec.elbL || 0, look.uarm, look.farm, -out);
    var aR = chain3(spec.armR || 0, spec.elbR || 0, look.uarm, look.farm, out);
    var lL = chain3(spec.legL || 0, spec.kneeL || 0, look.thigh, look.shin, -.05);
    var lR = chain3(spec.legR || 0, spec.kneeR || 0, look.thigh, look.shin, .05);
    return {
      hip: hip, chest: chest, head: head, shL: shL, shR: shR, hpL: hpL, hpR: hpR,
      elL: add3(shL, aL.knee), wrL: add3(shL, aL.ankle), elR: add3(shR, aR.knee), wrR: add3(shR, aR.ankle),
      knL: add3(hpL, lL.knee), anL: add3(hpL, lL.ankle), knR: add3(hpR, lR.knee), anR: add3(hpR, lR.ankle),
      ftL: add3(add3(hpL, lL.ankle), V3(0, -.02, .09)), ftR: add3(add3(hpR, lR.ankle), V3(0, -.02, .09))
    };
  }
  function roomPt(p, x, y, z, yaw, o) {
    var c = Math.cos(yaw || 0), s = Math.sin(yaw || 0);
    return [(x - o.x + p.x * c + p.z * s) / FT, (y + p.y) / FT, (z - o.z - p.x * s + p.z * c) / FT];
  }
  function seg(segs, a, b, r, col) {
    if (!a || !b) return;
    segs.push({ a: a, b: b, r: r / FT, c: col });
  }
  function actorSegs(w) {
    var segs = [];
    var o = w._ibOrigin || { x: 0, z: 0 };
    var st = (typeof CREW !== 'undefined' && CREW && CREW.state) || {};
    var who = st.who === 'boy' ? 'boy' : 'girl';
    var look = LOOK[who];
    var gait = w.gait || st.gait || 'idle';
    var phase = w.stridePhase || 0;
    var spec = { bob: 0, sway: 0, lean: 0, armL: .1, armR: .1, elbL: .28, elbR: .28, legL: 0, legR: 0, kneeL: .06, kneeR: .06 };
    if (typeof CREW !== 'undefined' && CREW && typeof CREW.debugHuman === 'function') {
      try { spec = CREW.debugHuman(gait, (performance.now() / 1000), phase) || spec; } catch (e) {}
    }
    var pts = figurePts(look, spec);
    var y = (w.y || 0) + (w.jumpY || 0);
    var yaw = w.yaw || 0;
    function P(k) { return roomPt(pts[k], w.x, y, w.z, yaw, o); }
    seg(segs, P('hpL'), P('knL'), look.legR, look.cloth);
    seg(segs, P('knL'), P('anL'), look.legR * .82, look.cloth2);
    seg(segs, P('hpR'), P('knR'), look.legR, look.cloth);
    seg(segs, P('knR'), P('anR'), look.legR * .82, look.cloth2);
    seg(segs, P('anL'), P('ftL'), look.legR * .7, look.sole);
    seg(segs, P('anR'), P('ftR'), look.legR * .7, look.sole);
    seg(segs, P('shL'), P('elL'), look.armR, look.cloth);
    seg(segs, P('elL'), P('wrL'), look.armR * .85, look.accent);
    seg(segs, P('shR'), P('elR'), look.armR, look.cloth);
    seg(segs, P('elR'), P('wrR'), look.armR * .85, look.accent);
    seg(segs, P('shL'), P('shR'), look.armR, look.trim);
    seg(segs, P('hpL'), P('hpR'), look.legR, look.trim);
    seg(segs, P('shL'), P('hpL'), 0.05, look.cloth);
    seg(segs, P('shR'), P('hpR'), 0.05, look.cloth);
    var head = P('head');
    segs.push({ a: head, b: [head[0], head[1] + look.head / FT, head[2]], r: look.head / FT, c: look.hair, head: 1 });
    var pet = st.petWorld;
    var px = pet && fin(pet.x) ? pet.x : (w.x - Math.cos(yaw) * 0.65 - Math.sin(yaw) * 0.52);
    var pz = pet && fin(pet.z) ? pet.z : (w.z + Math.sin(yaw) * 0.65 - Math.cos(yaw) * 0.52);
    var pyaw = pet && fin(pet.yaw) ? pet.yaw : yaw;
    var pgait = (pet && pet.gait) || gait;
    var type = st.petType || 'fox';
    var D = window.CREWDATA;
    if (D && typeof D.petFk === 'function' && typeof CREW !== 'undefined' && CREW && typeof CREW.debugGround === 'function') {
      try {
        var q = CREW.debugGround(type, pgait, phase, performance.now() / 1000) || {};
        q.yaw = pyaw * 180 / Math.PI + (q.yaw || 0);
        var J = D.petFk(q, type);
        var parts = D.petParts(type) || [];
        var scale = 1.25;
        var glow = st.petGlow || '#ffb020';
        function pj(name) {
          var v = J[name];
          if (!v) return null;
          return [(px - o.x + v[0] * scale) / FT, (y + v[1] * scale) / FT, (pz - o.z + v[2] * scale) / FT];
        }
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          var a = pj(part[0]), b = pj(part[1]);
          if (!a || !b) continue;
          if (part[0] === part[1]) segs.push({ a: a, b: [a[0], a[1] + part[2] * scale / FT, a[2]], r: part[2] * scale / FT, c: glow, head: 1 });
          else seg(segs, a, b, part[2] * scale, glow);
        }
      } catch (err) {}
    }
    return segs;
  }

  function stepCrew() {
    if (typeof CREW === 'undefined' || !CREW || typeof CREW.update !== 'function') return;
    try { CREW.update(); } catch (e) {}
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
      yaw: w.yaw || 0,
      segs: actorSegs(w)
    });
  }

  function roomFps() {
    var esp = frameEsp();
    if (esp && typeof esp.walkFps === 'number' && esp.walkFps > 0) return esp.walkFps;
    return typeof fps === 'number' ? fps : 0;
  }

  function sheetOpen() {
    var esp = frameEsp();
    if (esp && typeof esp.sheetOpen === 'function') {
      try { return !!esp.sheetOpen(); } catch (e) {}
    }
    return false;
  }

  function openWalk(door) {
    var id = roomOf(door);
    var rec = rooms[id];
    var size = feetFor(door, (door && door.purpose) || 'Room');
    size.title = interiorLabel(door);
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
      return;
    }
    var rec = rooms[id];
    var size = feetFor(door, (door && door.purpose) || 'Room');
    size.title = interiorLabel(door);
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

  function holdCity(on) {
    var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (!wm) return;
    wm._ibHold = on ? 1 : 0;
    if (wm._ibHeld) return;
    var value = !!wm.insideBuilding;
    try {
      Object.defineProperty(wm, 'insideBuilding', {
        configurable: true,
        enumerable: true,
        get: function () {
          if (this._ibHold) {
            var stack = '';
            try { stack = String(new Error().stack || ''); } catch (e) {}
            if (stack.indexOf('walkCityLoop') !== -1) return true;
          }
          return value;
        },
        set: function (v) { value = !!v; }
      });
      wm._ibHeld = 1;
    } catch (e) {}
  }

  function hookMotion() {
    var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (!wm || typeof wm._update !== 'function' || wm._update._ib) return false;
    var orig = wm._update;
    var wrapped = function (d) {
      if (this._ibWorld && exploreOf(this.insideDoor)) {
        this.onFoot = true;
        hideLegacyCard();
        holdCity(true);
        orig.call(this, d);
        if (this._ibWorld && exploreOf(this.insideDoor) && openOpts && openOpts.mode === 'walk') {
          stepCrew();
          pushPose(this);
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
      self.onFoot = true;
      hideLegacyCard();
      holdCity(true);
      openWalk(door);
      return true;
    }
    var spot = parkSpot(door);
    var rank = exploreOf(door) || { purpose: door.purpose || 'HOME', n: 1 };
    var pack = activePack(door);
    var origin = originFor(rank);
    var spawn = spawnOf(pack);
    self.onFoot = true;
    self.insideBuilding = false;
    self.insideDoor = door;
    self.door = null;
    self.parking = null;
    self._ibCar = spot;
    self._ibWorld = 1;
    self._ibOrigin = origin;
    self.y = 0;
    self._roofY = null;
    self.jumpY = 0;
    self.jumpVy = 0;
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
    if (typeof window !== 'undefined') window.ZD_ROOM_NOCAR = 1;
    holdCar(self);
    hideLegacyCard();
    holdCity(true);
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
        var rank = !WALK[b.purpose] ? 0 : (b.purpose === 'SKY_DROP' ? 1 : 2);
        if (!rank) continue;
        if (best && (rank < best.rank || (rank === best.rank && dist >= best.dist))) continue;
        best = {
          x: door[0], z: door[1], nx: nx, nz: nz, dist: dist, y: 0, rank: rank,
          buildingId: b.id, building: b,
          purpose: b.purpose, purposeLabel: b.purposeLabel, color: b.c,
          top: 0, cx: b.cx, cz: b.cz
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
    css.textContent = '#zdWalkAct{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 8px);left:calc(env(safe-area-inset-left, 0px) + 8px);z-index:232;display:none;min-width:78px;height:44px;padding:0 10px;border-radius:12px;border:2px solid #fff;margin:0;background:#7dff6b;color:#04140c;font:800 11px/1 Orbitron,sans-serif;letter-spacing:.3px;align-items:center;justify-content:center;gap:4px;touch-action:manipulation;cursor:pointer}'
      + '#zdWalkAct small{font:700 9px Rajdhani,sans-serif;letter-spacing:.3px}'
      + '#zdWalkAct.show{display:inline-flex}'
      + '#zdWalkExit{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 8px);left:calc(env(safe-area-inset-left, 0px) + 94px);z-index:232;display:none;min-width:78px;height:44px;padding:0 10px;border-radius:12px;border:2px solid #fff;margin:0;background:#ff4fd8;color:#240014;font:800 11px/1 Orbitron,sans-serif;align-items:center;justify-content:center;touch-action:manipulation;cursor:pointer}'
      + '#zdWalkExit.show{display:inline-flex}'
      + 'body[data-ib-room] #zdWalkExit{pointer-events:auto!important}'
      + '#zdWalkFps{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 8px);right:calc(env(safe-area-inset-right, 0px) + 88px);z-index:232;display:none;pointer-events:none;margin:0;padding:2px 7px;border-radius:8px;border:1px solid rgba(232,255,244,.55);font:700 13px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#e8fff4;background:rgba(7,4,16,.86)}'
      + 'body[data-ib-world] #devOpen{top:60px!important;left:8px!important;z-index:236!important}'
      + 'body[data-ib-world] #kOver{display:none!important}'
      + 'html.room-direct #kOver{display:none!important}'
      + '#zdWalkTitle{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 12px);left:172px;right:96px;transform:none;z-index:234;display:none;margin:0;padding:4px 8px;border-radius:10px;border:2px solid #3ee6ff;background:rgba(8,4,20,.9);color:#fff;font:800 12px/1.2 Orbitron,sans-serif;text-align:center;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + 'body[data-ib-world] #zdWalkTitle.show{display:block}'
      + 'body[data-ib-world] #zdWalkFps{right:calc(env(safe-area-inset-right, 0px) + 8px)!important;top:calc(env(safe-area-inset-top, 0px) + 8px)!important}'
      + '#zdWalkFps.show{display:block}'
      + 'body[data-ib-room] #kid{z-index:230!important;background:transparent!important;pointer-events:none!important}'
      + 'body[data-ib-room] #kid .kbody{background:transparent!important;pointer-events:none!important}'
      + 'body[data-ib-room] #c{visibility:hidden!important}'
      + '#zdWalkCam{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 108px);left:calc(env(safe-area-inset-left, 0px) + 8px);z-index:232;display:none;min-width:64px;height:28px;padding:0 8px;border-radius:12px;border:2px solid #fff;margin:0;background:#0b2e55;color:#f4f8fc;font:800 10px/1 Orbitron,sans-serif;align-items:center;justify-content:center;touch-action:manipulation;cursor:pointer}'
      + 'body[data-ib-room] #zdWalkCam.show{display:inline-flex}'
      + 'body[data-ib-sheet] #zdWalkCam{display:none!important}'
      + 'body[data-ib-room] #tup,body[data-ib-room] #nos,body[data-ib-room] #brk,body[data-ib-room] #emoteBtn,body[data-ib-room] #kMenuB,body[data-ib-room] #zdWalkAct,body[data-ib-room] #zdWalkCam,body[data-ib-room] #devOpen{pointer-events:auto!important}'
      + 'body[data-ib-sheet] #tup,body[data-ib-sheet] #nos,body[data-ib-sheet] #brk,body[data-ib-sheet] #emoteBtn{visibility:hidden!important}'
      + 'body[data-ib-world] #wng,body[data-ib-world] #exitCarBtn,body[data-ib-world] #enterBldBtn{display:none!important;visibility:hidden!important}'
      + 'body[data-ib-world]:not([data-ib-room]) #tup,body[data-ib-world]:not([data-ib-room]) #nos,body[data-ib-world]:not([data-ib-room]) #brk,body[data-ib-world]:not([data-ib-room]) #emoteBtn,body[data-ib-world]:not([data-ib-room]) #emoteWheel,body[data-ib-world]:not([data-ib-room]) #kMenuB{visibility:hidden!important;pointer-events:none!important}'
      + 'body[data-ib-world] #c,body[data-ib-world] #cgl,body[data-ib-world] #cback{visibility:hidden!important}';
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
    var exitBtn = document.createElement('button');
    exitBtn.id = 'zdWalkExit';
    exitBtn.type = 'button';
    exitBtn.textContent = 'EXIT';
    exitBtn.setAttribute('aria-label', 'EXIT');
    exitBtn.addEventListener('click', function (ev) {
      if (ev.preventDefault) ev.preventDefault();
      var wm = window.WALK_MODE;
      if (wm) leaveToCar(wm);
    });
    document.body.appendChild(exitBtn);
    walkFps = document.createElement('div');
    walkFps.id = 'zdWalkFps';
    walkFps.setAttribute('aria-label', 'Frames per second');
    walkFps.textContent = '-- FPS';
    document.body.appendChild(walkFps);
    var camBtn = document.createElement('button');
    camBtn.id = 'zdWalkCam';
    camBtn.type = 'button';
    camBtn.textContent = 'CHASE';
    camBtn.setAttribute('aria-label', 'Chase camera');
    camBtn.addEventListener('click', function (ev) {
      if (ev.preventDefault) ev.preventDefault();
      var esp = frameEsp();
      if (!esp || typeof esp.setWalkCam !== 'function') return;
      var next = esp.walkCam === 'room' ? 'chase' : 'room';
      esp.setWalkCam(next);
      camBtn.textContent = next === 'room' ? 'ROOM' : 'CHASE';
      camBtn.setAttribute('aria-label', next === 'room' ? 'Room camera' : 'Chase camera');
    });
    document.body.appendChild(camBtn);
    var title = document.createElement('div');
    title.id = 'zdWalkTitle';
    title.textContent = 'Room Interior';
    document.body.appendChild(title);
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
    var editing = plannerOpen() && openOpts && openOpts.mode === 'edit';
    var inWalk = !!(wm && wm._ibWorld && !editing);
    if (wm && wm._ibWorld) {
      hideLegacyCard();
      wm.onFoot = true;
      holdCity(inWalk);
    } else holdCity(false);
    if (document.body && document.body.dataset) {
      if (wm && wm._ibWorld) document.body.dataset.ibWorld = '1';
      else delete document.body.dataset.ibWorld;
      if (inWalk) document.body.dataset.ibRoom = (wm.insideDoor && wm.insideDoor.direct) ? 'ROOM' : ((exploreOf(wm.insideDoor) || {}).title || 'room');
      else delete document.body.dataset.ibRoom;
      if (inWalk && sheetOpen()) document.body.dataset.ibSheet = '1';
      else delete document.body.dataset.ibSheet;
    }
    if (typeof window !== 'undefined') window.ZD_ROOM_NOCAR = (wm && wm._ibWorld) ? 1 : 0;
    var dev = typeof document !== 'undefined' && document.getElementById && document.getElementById('devOpen');
    if (dev && dev.style) dev.style.zIndex = (wm && wm._ibWorld) ? '236' : '65';
    if (editing) {
      hideAct();
      hideCrew();
    } else if (wm && wm._ibWorld && exploreOf(wm.insideDoor)) {
      rank = exploreOf(wm.insideDoor);
      mode = 'build';
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
    var exitBtn = typeof document !== 'undefined' && document.getElementById && document.getElementById('zdWalkExit');
    if (exitBtn && exitBtn.classList) exitBtn.classList.toggle('show', !!(inWalk && wm && atInsideDoor(wm)));
    var titleEl = typeof document !== 'undefined' && document.getElementById && document.getElementById('zdWalkTitle');
    if (titleEl && titleEl.classList) {
      var named = wm && wm._ibWorld ? interiorLabel(wm.insideDoor) : '';
      titleEl.textContent = named;
      titleEl.classList.toggle('show', !!named);
    }
    var camBtn = typeof document !== 'undefined' && document.getElementById && document.getElementById('zdWalkCam');
    if (camBtn && camBtn.classList) {
      camBtn.classList.toggle('show', !!inWalk);
      if (inWalk) {
        var camMode = 'chase';
        try {
          var camEsp = frameEsp();
          if (camEsp && camEsp.walkCam) camMode = camEsp.walkCam;
        } catch (eCam) {}
        var camLabel = camMode === 'room' ? 'ROOM' : 'CHASE';
        if (camBtn.textContent !== camLabel) camBtn.textContent = camLabel;
        camBtn.setAttribute('aria-label', camMode === 'room' ? 'Room camera' : 'Chase camera');
      }
    }
    var card = typeof document !== 'undefined' && document.getElementById && document.getElementById('walk-interior');
    var inRoom = !!(wm && wm._ibWorld);
    var inside = inRoom || !!(card && card.classList && card.classList.contains('show') && wm && wm.insideBuilding);
    var pc = typeof document !== 'undefined' && document.getElementById && document.getElementById('pcFps');
    if (pc && pc.style) {
      pc.style.zIndex = inside ? '97' : '';
      pc.style.visibility = inRoom ? 'hidden' : '';
    }
    if (inWalk || editing) {
      try {
        var frFit = document.getElementById('zdInteriorFrame');
        var espFit = frFit && frFit.contentWindow && frFit.contentWindow.ESP;
        if (espFit && typeof espFit.fitWalkRail === 'function') espFit.fitWalkRail();
      } catch (eFit) {}
    }
    if (walkFps && walkFps.classList) {
      var useDom = !!inRoom;
      walkFps.classList.toggle('show', useDom);
      if (useDom) {
        var v = roomFps();
        walkFps.textContent = Math.round(v) + ' FPS';
        placeWalkFps();
      }
    }
  }

  function hudBox(el) {
    if (!el || !el.getBoundingClientRect) return null;
    var s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return null;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    return { x: r.left, y: r.top, r: r.right, b: r.bottom };
  }

  function placeWalkFps() {
    if (!walkFps) return;
    var obs = [];
    ['kMenuB', 'exitCarBtn', 'tup', 'nos', 'brk', 'wng', 'emoteBtn', 'zdWalkAct', 'zdWalkExit', 'zdWalkCam', 'devOpen', 'enterBldBtn'].forEach(function (id) {
      var b = hudBox(document.getElementById(id));
      if (b) obs.push(b);
    });
    var frame = document.getElementById('zdInteriorFrame');
    var doc = frame && frame.contentDocument;
    var rail = doc && doc.getElementById('rail');
    if (rail && frame) {
      var fr = frame.getBoundingClientRect();
      [].forEach.call(rail.querySelectorAll('button'), function (btn) {
        if (btn.classList && btn.classList.contains('hidden')) return;
        var q = btn.getBoundingClientRect();
        if (q.width < 2 || q.height < 2) return;
        obs.push({ x: q.left + fr.left, y: q.top + fr.top, r: q.right + fr.left, b: q.bottom + fr.top });
      });
    }
    var fw = Math.max(walkFps.offsetWidth || 0, 86);
    var fh = Math.max(walkFps.offsetHeight || 0, 22);
    function clearOf(box) {
      for (var i = 0; i < obs.length; i++) {
        var o = obs[i];
        if (Math.min(box.r, o.r) - Math.max(box.x, o.x) > 2 && Math.min(box.b, o.b) - Math.max(box.y, o.y) > 2) return false;
      }
      return true;
    }
    var rights = [88, 170, 252, 8];
    var tops = [8, 36, 64, 96];
    var pick = null;
    for (var ri = 0; ri < rights.length && !pick; ri++) {
      for (var ti = 0; ti < tops.length; ti++) {
        var x = window.innerWidth - rights[ri] - fw;
        if (x < 188) continue;
        var box = { x: x, y: tops[ti], r: x + fw, b: tops[ti] + fh };
        if (box.b > window.innerHeight - 4) continue;
        if (clearOf(box)) { pick = { right: rights[ri], top: tops[ti] }; break; }
      }
    }
    if (!pick) pick = { right: 88, top: 8 };
    var sig = pick.top + '|' + pick.right;
    if (walkFps.dataset.fit === sig) return;
    walkFps.dataset.fit = sig;
    walkFps.style.top = 'calc(env(safe-area-inset-top, 0px) + ' + pick.top + 'px)';
    walkFps.style.right = 'calc(env(safe-area-inset-right, 0px) + ' + pick.right + 'px)';
    walkFps.style.left = 'auto';
  }

  function roomDoor() {
    var near = outsideDoor();
    if (near && exploreOf(near)) return near;
    var target = null;
    try { target = typeof walkEntryTarget === 'function' ? walkEntryTarget() : null; } catch (e) {}
    var door = withBuilding(target && target.door);
    if (door && exploreOf(door)) return door;
    return null;
  }

  function hookAct() {
    if (typeof walkAct !== 'function' || walkAct._ibRoom) return;
    var orig = walkAct;
    var wrapped = function (door) {
      if (door && door.purpose === 'SKY_DROP') return;
      return orig.apply(this, arguments);
    };
    wrapped._ibRoom = 1;
    try { walkAct = wrapped; } catch (e) {}
    try { window.walkAct = wrapped; } catch (e2) {}
  }

  function hookEnter() {
    var fn = typeof walkEnterDoor === 'function' ? walkEnterDoor : null;
    if (!fn || fn._ibPark) return;
    var orig = fn._ibOrig || fn;
    var wrapped = function () {
      var self = (this && typeof this.nearestDoor === 'function') ? this : (typeof WALK_MODE !== 'undefined' ? WALK_MODE : null);
      var room = null;
      try { room = roomDoor(); } catch (e) { room = null; }
      if (room && self && !self._ibWorld) {
        try { return enterExplore(self, room, orig); }
        catch (err) {
          try { window.IB_ERR = String(err && err.stack || err); } catch (e2) {}
          return false;
        }
      }
      if (room && self && self._ibWorld) return true;
      var target = null;
      try { target = typeof walkEntryTarget === 'function' ? walkEntryTarget() : null; } catch (e3) {}
      if (target && target.door && target.door.purpose === 'SKY_DROP') return false;
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
    hookAct();
    hookEnter();
    hookLeave();
    hookMotion();
  }

  function enterDirect() {
    if (typeof window !== 'undefined' && window.__zdRoomEntered) return true;
    var wm = typeof WALK_MODE !== 'undefined' ? WALK_MODE : null;
    if (!wm || typeof P === 'undefined' || !P) return false;
    var door = {
      direct: 1,
      purpose: 'HOME',
      purposeLabel: 'ROOM',
      x: 0, z: 0, nx: 0, nz: 1, top: 0,
      building: {
        purpose: 'HOME', id: 'direct-room', oid: 'direct', name: 'ROOM',
        doors: [[0, 0, 0, 1]], x0: -2, x1: 2, z0: -2, z1: 2, cx: 0, cz: 0
      }
    };
    wm.onFoot = true;
    P.v = 0;
    P.ground = true;
    try {
      try { flying = true; paused = false; } catch (eFly) {}
      var menu = typeof document !== 'undefined' && document.getElementById && document.getElementById('kOver');
      if (menu && menu.classList) menu.classList.add('hidden');
      if (document.documentElement && document.documentElement.classList) document.documentElement.classList.add('room-direct');
      enterExplore(wm, door, null);
      if (typeof window !== 'undefined') window.__zdRoomEntered = 1;
      return true;
    } catch (err) {
      try { window.IB_ERR = String(err && err.stack || err); } catch (e) {}
      return false;
    }
  }

  function bootUi() {
    try {
    ensureBtn();
    ensureContext();
    hook();
    if (typeof window !== 'undefined' && window.ZD_ROOM_DIRECT) {
      var tries = 0;
      var kick = function () {
        if (enterDirect() || ++tries > 80) return;
        setTimeout(kick, 50);
      };
      kick();
    }
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
    interiorLabel: interiorLabel,
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
