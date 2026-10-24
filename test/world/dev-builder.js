/* DEV Builder, M2, on the current Neon World.
   Bob only. Hidden until the corner latch. Not a driver-HUD button.
   Map edits save to zdash.city.editor.v1. They change the drive only on /test/.
   Q2 tools: roof, measure, align, group, 15 degree rotate.
   Draws with flat fills. Closed editor does no per-frame work.
   Hold-and-drag: the old hit snapped the finger onto the 2 m grid and then
   tested the exact footprint. At town zoom a building is smaller than a
   finger, so the hold missed and the drag never started. Hits are screen
   pixels, with a larger pad when zoomed out. Move is the default tool.
   The corner latch ignores pointers while this panel is open. This panel
   sits over the game canvas and keeps the pointer. */
'use strict';
(function () {
  if (typeof CITY === 'undefined' || !window.PLANNER_TOOLS) return;
  var T = window.PLANNER_TOOLS;
  var KEY = 'zdash.city.editor.v1';
  var SNAP = 2;
  var DRAG_PX = 8;
  var MIN_PINCH = 12;
  var STREET_YAW = Math.PI / 4;
  var STREET_PITCH = 0.72;
  var base = null;
  var doc = null;
  var hist = T.createHistory(100);
  var ui = null;
  var tool = 'move';
  var looking = false;
  var selected = [];
  var groupIds = [];
  var gesture = null;
  var pointers = {};
  var measureA = null;
  var roadA = null;
  var view = { x: 0, z: 400, mpp: 4, mode: 'top', yaw: STREET_YAW, pitch: STREET_PITCH };
  var open = false;

  function fin(n) { return typeof n === 'number' && isFinite(n); }

  function wrapAng(a) {
    if (!fin(a)) return 0;
    a = a % (2 * Math.PI);
    if (a > Math.PI) a -= 2 * Math.PI;
    if (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  function readView() {
    return { x: view.x, z: view.z, mpp: view.mpp, mode: view.mode, yaw: view.yaw, pitch: view.pitch };
  }

  function writeView(next) {
    if (!next) return;
    view.x = next.x;
    view.z = next.z;
    view.mpp = next.mpp;
    if (next.mode) view.mode = next.mode;
    if (fin(next.yaw)) view.yaw = next.yaw;
    if (fin(next.pitch)) view.pitch = next.pitch;
  }

  var CAM = {
    project: function (v, x, z, y, w, h) {
      y = y || 0;
      var dx = x - v.x, dz = z - v.z;
      if (v.mode !== 'street') return [w / 2 + dx / v.mpp, h / 2 - dz / v.mpp];
      var yaw = fin(v.yaw) ? v.yaw : STREET_YAW;
      var pitch = fin(v.pitch) ? v.pitch : STREET_PITCH;
      var c = Math.cos(yaw), s = Math.sin(yaw);
      var rx = dx * c - dz * s;
      var rz = dx * s + dz * c;
      var sx = rx / v.mpp;
      var sy = (rz * Math.sin(pitch) + y * Math.cos(pitch)) / v.mpp;
      return [w / 2 + sx, h * 0.62 - sy];
    },
    unproject: function (v, px, py, w, h) {
      if (v.mode !== 'street') {
        return { x: v.x + (px - w / 2) * v.mpp, z: v.z + (h / 2 - py) * v.mpp };
      }
      var yaw = fin(v.yaw) ? v.yaw : STREET_YAW;
      var pitch = fin(v.pitch) ? v.pitch : STREET_PITCH;
      var sp = Math.sin(pitch) || 1;
      var rx = (px - w / 2) * v.mpp;
      var rz = (h * 0.62 - py) * v.mpp / sp;
      var c = Math.cos(yaw), s = Math.sin(yaw);
      return { x: v.x + rx * c + rz * s, z: v.z - rx * s + rz * c };
    },
    zoomToward: function (v, px, py, w, h, factor, limits) {
      var next = {
        x: v.x, z: v.z, mpp: v.mpp, mode: v.mode, yaw: v.yaw, pitch: v.pitch
      };
      if (!fin(factor) || factor <= 0) return next;
      limits = limits || { min: 0.05, max: 80 };
      var before = CAM.unproject(v, px, py, w, h);
      next.mpp = Math.max(limits.min, Math.min(limits.max, v.mpp * factor));
      var after = CAM.unproject(next, px, py, w, h);
      next.x += before.x - after.x;
      next.z += before.z - after.z;
      return next;
    },
    panBy: function (v, dxPx, dyPx, w, h, bounds) {
      var a = CAM.unproject(v, w / 2, h / 2, w, h);
      var b = CAM.unproject(v, w / 2 - dxPx, h / 2 - dyPx, w, h);
      return CAM.clamp({
        x: v.x + (b.x - a.x), z: v.z + (b.z - a.z), mpp: v.mpp,
        mode: v.mode, yaw: v.yaw, pitch: v.pitch
      }, bounds);
    },
    clamp: function (v, bounds) {
      var next = { x: v.x, z: v.z, mpp: v.mpp, mode: v.mode, yaw: v.yaw, pitch: v.pitch };
      if (!bounds) return next;
      next.x = Math.max(bounds.minX, Math.min(bounds.maxX, next.x));
      next.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, next.z));
      return next;
    },
    fitMpp: function (bounds, w, h) {
      var sx = Math.max(1, bounds.maxX - bounds.minX);
      var sz = Math.max(1, bounds.maxZ - bounds.minZ);
      return Math.max(sx / (Math.max(1, w) * 0.86), sz / (Math.max(1, h) * 0.78));
    },
    /* Metres per pixel so a building of this width is 72 px, never under 44. */
    openMpp: function (metres) {
      var w = Math.max(8, metres || 16);
      return Math.min(w / 72, w / 44);
    },
    /* Top-left, and bottom-center. Bottom-right is the throttle. */
    latchSpot: function (x, y, w, h) {
      if (x < 72 && y < 72) return 'tl';
      if (Math.abs(x - w / 2) < 44 && y > h - 72) return 'bc';
      return '';
    },
    hitPad: function (v) {
      var t = ((v.mpp || 4) - 0.35) / 12;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      return 28 + t * 16;
    },
    hit: function (buildings, v, px, py, w, h) {
      var pad = CAM.hitPad(v);
      var best = null, bestD = 1e9;
      (buildings || []).forEach(function (b) {
        var box = CAM.box(b, v, w, h);
        if (px < box.l - pad || px > box.r + pad || py < box.t - pad || py > box.b + pad) return;
        var cx = (box.l + box.r) / 2, cy = (box.t + box.b) / 2;
        var d = Math.hypot(px - cx, py - cy);
        if (d < bestD) { bestD = d; best = b; }
      });
      return best;
    },
    box: function (b, v, w, h) {
      var pts = [];
      var height = b.h || 8;
      CAM.corners(b).forEach(function (p) {
        pts.push(CAM.project(v, p[0], p[1], 0, w, h));
        if (v.mode === 'street') pts.push(CAM.project(v, p[0], p[1], height, w, h));
      });
      var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      pts.forEach(function (p) {
        if (p[0] < minX) minX = p[0];
        if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1];
        if (p[1] > maxY) maxY = p[1];
      });
      return { l: minX, r: maxX, t: minY, b: maxY };
    },
    corners: function (b) {
      if (b.w && b.d) return T.cornersOf(b);
      return [[b.x0, b.z0], [b.x1, b.z0], [b.x1, b.z1], [b.x0, b.z1]];
    },
    dragDelta: function (v, x0, y0, x1, y1, w, h) {
      var a = CAM.unproject(v, x0, y0, w, h);
      var b = CAM.unproject(v, x1, y1, w, h);
      var sa = T.snap(a.x, a.z, SNAP);
      var sb = T.snap(b.x, b.z, SNAP);
      return { dx: sb.x - sa.x, dz: sb.z - sa.z };
    },
    classify: function (spec) {
      var button = spec.button || 0;
      if (button === 1 || button === 2 || spec.alt || spec.looking || spec.tool === 'pan') return 'pan';
      if (spec.tool && spec.tool !== 'move') return 'tap';
      if (spec.hit) return 'move';
      return 'pan';
    }
  };

  function applies() {
    if (window.ZD_DEV_APPLY === 0) return false;
    if (window.ZD_DEV_APPLY === 1) return true;
    return /\/test\//.test(location.pathname);
  }

  function footprint(o) {
    var rot90 = ((o.rot || 0) % 180 + 180) % 180 === 90;
    var w = rot90 ? o.d : o.w;
    var d = rot90 ? o.w : o.d;
    return { x0: o.x - w / 2, x1: o.x + w / 2, z0: o.z - d / 2, z1: o.z + d / 2, w: w, d: d };
  }

  function faceOf(o) {
    var s = o.p && o.p.sign;
    if (!s) return 's';
    if (s.nz === 1) return 'n';
    if (s.nz === -1) return 's';
    if (s.nx === 1) return 'e';
    if (s.nx === -1) return 'w';
    return 's';
  }

  function exportDoc() {
    var buildings = [];
    (CITY.OBJS || []).forEach(function (o) {
      if (o.type !== 'building') return;
      var f = footprint(o);
      var p = o.p || {};
      buildings.push({
        id: 'b' + o.id,
        objId: o.id,
        name: p.purposeLabel || p.purpose || o.prefab || 'building',
        kind: o.prefab || 'shop_low',
        purpose: p.purpose || '',
        x: o.x, z: o.z, w: f.w, d: f.d, h: o.h,
        prefabW: o.w, prefabD: o.d, prefabRot: o.rot || 0,
        yaw: 0,
        rot: o.rot || 0,
        x0: f.x0, x1: f.x1, z0: f.z0, z1: f.z1,
        face: faceOf(o),
        roof: null,
        roofParts: null
      });
    });
    return {
      v: 1,
      level: 'M2',
      option: (CITY.LAYOUT && CITY.LAYOUT.id) || 'current',
      snapM: SNAP,
      highwayX: CITY.HW ? CITY.HW.x : -450,
      spawns: [
        { id: 'player', x: 0, z: 0, locked: true },
        { id: 'skydrop', x: 180, z: 520, locked: true }
      ],
      buildings: buildings,
      roads: exportRoads(),
      groups: []
    };
  }

  function exportRoads() {
    var rows = [];
    var lay = (CITY.LAYOUT && CITY.LAYOUT.roads) || [];
    if (!lay.length) {
      return (CITY.ROADS && CITY.ROADS.toJSON ? CITY.ROADS.toJSON() : []).map(function (r) {
        var kind = r.kind || 'street';
        return {
          id: kind + ':' + r.a[0] + ',' + r.a[1] + ':' + r.b[0] + ',' + r.b[1],
          x0: r.a[0], z0: r.a[1], x1: r.b[0], z1: r.b[1],
          w: r.w, kind: kind,
          locked: T.lockedKind(kind)
        };
      });
    }
    lay.forEach(function (r) {
      var kind = r.kind || 'street';
      rows.push({
        id: kind + ':' + r.x0 + ',' + r.z0 + ':' + r.x1 + ',' + r.z1,
        x0: r.x0, z0: r.z0, x1: r.x1, z1: r.z1,
        w: r.w, kind: kind,
        locked: T.lockedKind(kind)
      });
    });
    var graph = CITY.ROADS && CITY.ROADS.toJSON ? CITY.ROADS.toJSON() : [];
    graph.forEach(function (r) {
      if (r.kind !== 'track') return;
      rows.push({
        id: 'track:' + r.a[0] + ',' + r.a[1] + ':' + r.b[0] + ',' + r.b[1],
        x0: r.a[0], z0: r.a[1], x1: r.b[0], z1: r.b[1],
        w: r.w, kind: 'track', locked: true
      });
    });
    return rows;
  }

  function saveLocal(next) {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
  }

  function readLocal() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function sameBuilding(a, b) {
    return a && b && Math.abs(a.x - b.x) < 0.05 && Math.abs(a.z - b.z) < 0.05 && (a.yaw || 0) === (b.yaw || 0) && (a.rot || 0) === (b.rot || 0) && a.roof === b.roof;
  }

  function applyToCity(next) {
    var moved = 0, addedRoads = 0;
    (next.buildings || []).forEach(function (b) {
      if (!b.objId) {
        if (CITY.placePrefab) {
          CITY.placePrefab(b.kind || 'shop_low', b.x, b.z, { w: b.w, d: b.d, h: b.h, rot: b.rot || 0, p: { purpose: b.purpose, purposeLabel: b.name } });
          moved++;
        }
        return;
      }
      var prev = (base.buildings || []).find(function (q) { return q.objId === b.objId; });
      if (prev && sameBuilding(prev, b)) return;
      var o = (CITY.OBJS || []).find(function (q) { return q.id === b.objId; });
      if (!o || !CITY.remove || !CITY.placePrefab) return;
      var p = Object.assign({}, o.p || {});
      CITY.remove(o.id);
      CITY.placePrefab(o.prefab, b.x, b.z, {
        id: o.id,
        w: b.prefabW != null ? b.prefabW : b.w,
        d: b.prefabD != null ? b.prefabD : b.d,
        h: b.h,
        rot: b.prefabRot != null ? b.prefabRot : (b.rot || 0),
        p: p
      });
      moved++;
    });
    (next.roads || []).forEach(function (r) {
      if (!r.added) return;
      if (r.kind !== 'street' || !CITY.ROADS || !CITY.ROADS.addRoad) return;
      var exists = (CITY.ROADS.toJSON() || []).some(function (e) {
        var same = Math.abs(e.a[0] - r.x0) < 0.2 && Math.abs(e.a[1] - r.z0) < 0.2 && Math.abs(e.b[0] - r.x1) < 0.2 && Math.abs(e.b[1] - r.z1) < 0.2;
        var flip = Math.abs(e.a[0] - r.x1) < 0.2 && Math.abs(e.a[1] - r.z1) < 0.2 && Math.abs(e.b[0] - r.x0) < 0.2 && Math.abs(e.b[1] - r.z0) < 0.2;
        return same || flip;
      });
      if (exists) return;
      CITY.ROADS.addRoad(r.x0, r.z0, r.x1, r.z1, { w: r.w || 20, kind: 'street', step: 100 });
      addedRoads++;
    });
    return { moved: moved, addedRoads: addedRoads };
  }

  var layoutSnap = typeof CITY.editorDoc === 'function' ? CITY.editorDoc : null;
  function editorDoc(next) {
    if (next === undefined) return layoutSnap ? layoutSnap() : exportDoc();
    if (!next || !next.buildings) return { ok: false, errors: ['That layout is not a DEV Builder document.'], doc: doc || base };
    if (!base) base = exportDoc();
    var errors = T.guardM2(base, next);
    if (errors.length) return { ok: false, errors: errors, doc: doc || base };
    saveLocal(next);
    if (!applies()) return { ok: true, applied: false, saved: true, doc: next };
    var stats = applyToCity(next);
    return { ok: true, applied: true, saved: true, doc: next, stats: stats };
  }

  CITY.editorDoc = editorDoc;

  function clone(d) { return JSON.parse(JSON.stringify(d)); }

  function commit(next, label) {
    doc = next;
    doc.note = label || '';
    hist.push(doc);
    draw();
  }

  function buildingsByIds(ids) {
    return (doc.buildings || []).filter(function (b) { return ids.indexOf(b.id) >= 0; });
  }

  function idsFor(id) {
    if (groupIds.indexOf(id) >= 0) return groupIds.slice();
    return [id];
  }

  function townBounds() {
    var minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9, any = false;
    function take(x, z) {
      if (!fin(x) || !fin(z)) return;
      any = true;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    (doc && doc.buildings || []).forEach(function (b) { take(b.x0, b.z0); take(b.x1, b.z1); });
    (doc && doc.roads || []).forEach(function (r) {
      if (r.kind === 'track') return;
      take(r.x0, r.z0); take(r.x1, r.z1);
    });
    if (!any) return { minX: -1600, maxX: 1300, minZ: -900, maxZ: 3000 };
    return { minX: minX, maxX: maxX, minZ: minZ, maxZ: maxZ };
  }

  function mppLimits() {
    var w = ui && ui.canvas ? ui.canvas.width : 800;
    var h = ui && ui.canvas ? ui.canvas.height : 600;
    var fit = CAM.fitMpp(townBounds(), w, h);
    return { min: 0.05, max: Math.max(fit, 0.05) };
  }

  function status(text) {
    if (ui && ui.status) ui.status.textContent = text;
  }

  function localPoint(ev) {
    var canvas = ui.canvas;
    var r = canvas.getBoundingClientRect();
    var sx = canvas.width / (r.width || 1);
    var sy = canvas.height / (r.height || 1);
    return { x: (ev.clientX - r.left) * sx, y: (ev.clientY - r.top) * sy };
  }

  function pointerList() {
    var list = [];
    Object.keys(pointers).forEach(function (id) { list.push(pointers[id]); });
    return list;
  }

  function twoOf(list) {
    var a = list[0], b = list[1];
    var dx = b.x - a.x, dy = b.y - a.y;
    return {
      d: Math.hypot(dx, dy),
      ang: Math.atan2(dy, dx),
      mx: (a.x + b.x) / 2,
      my: (a.y + b.y) / 2
    };
  }

  function canvasOfClient(cx, cy) {
    var canvas = ui.canvas;
    var r = canvas.getBoundingClientRect();
    return {
      x: (cx - r.left) * (canvas.width / (r.width || 1)),
      y: (cy - r.top) * (canvas.height / (r.height || 1)),
      w: canvas.width,
      h: canvas.height
    };
  }

  function applyView(next) {
    writeView(CAM.clamp(next, townBounds()));
  }

  function applyMove(id, dx, dz) {
    if (!dx && !dz) return false;
    var members = buildingsByIds(idsFor(id));
    if (!members.length) return false;
    var moved = T.groupMove(members, dx, dz);
    var next = clone(doc);
    var map = {};
    moved.forEach(function (b) { map[b.id] = b; });
    next.buildings = next.buildings.map(function (b) { return map[b.id] || b; });
    var errors = T.guardM2(base, next);
    if (errors.length) { status(errors[0]); return false; }
    doc = next;
    return true;
  }

  function startPan(ev, clearOnTap) {
    gesture = {
      kind: 'pan', x: ev.clientX, y: ev.clientY,
      vx: view.x, vz: view.z, mpp: view.mpp, yaw: view.yaw, pitch: view.pitch, mode: view.mode,
      moved: false, clearOnTap: !!clearOnTap
    };
  }

  function startMove(ev, b, world) {
    if (groupIds.indexOf(b.id) >= 0) selected = groupIds.slice();
    else selected = [b.id];
    var s = T.snap(world.x, world.z, SNAP);
    gesture = {
      kind: 'move', id: b.id, name: b.name || 'building',
      x: ev.clientX, y: ev.clientY, lastX: s.x, lastZ: s.z, moved: false,
      pointer: ev.pointerType || 'mouse',
      from: { x0: b.x0, x1: b.x1, z0: b.z0, z1: b.z1 }
    };
    status(gesture.name + '. Drag to move.');
    draw();
  }

  function onTap(kind, b, world) {
    var p = T.snap(world.x, world.z, SNAP);
    if (kind === 'measure') {
      if (!measureA) { measureA = p; status('Tap the second point.'); }
      else {
        var m = T.measure(measureA, p);
        doc.measure = { a: measureA, b: p, metres: m.metres };
        measureA = null;
        commit(clone(doc), 'measure');
        status(m.metres.toFixed(1) + ' m');
      }
      draw();
      return;
    }
    if (kind === 'road') {
      if (!roadA) { roadA = p; status('Tap the other end. Streets only.'); }
      else {
        var next = clone(doc);
        next.roads.push({
          id: 'new' + Date.now(),
          x0: roadA.x, z0: roadA.z, x1: p.x, z1: p.z,
          w: 20, kind: 'street', locked: false, added: true
        });
        roadA = null;
        if (!tryDoc(next)) roadA = null;
        else status('New street. It is not on the live drive.');
      }
      draw();
      return;
    }
    if (!b) { status('No building there.'); return; }
    if (kind === 'group') {
      var at = groupIds.indexOf(b.id);
      if (at >= 0) groupIds.splice(at, 1); else groupIds.push(b.id);
      selected = groupIds.slice();
      doc.groups = [{ id: 'g1', members: groupIds.slice() }];
      status(groupIds.length ? ('Group of ' + groupIds.length) : 'Group is empty.');
      draw();
      return;
    }
    if (groupIds.indexOf(b.id) >= 0) selected = groupIds.slice();
    else selected = [b.id];
    if (kind === 'rotate') {
      var nextR = clone(doc);
      nextR.buildings = nextR.buildings.map(function (q) {
        if (selected.indexOf(q.id) < 0) return q;
        q.yaw = T.rotate(q.yaw || 0, 'deg15');
        return T.withAabb(q);
      });
      tryDoc(nextR);
      status((b.name || 'Building') + ' turned.');
      return;
    }
    if (kind === 'align') {
      var nextA = clone(doc);
      nextA.buildings = nextA.buildings.map(function (q) {
        if (selected.indexOf(q.id) < 0) return q;
        return T.alignFace(q, nextA.roads);
      });
      if (selected.length > 1) {
        var members = nextA.buildings.filter(function (q) { return selected.indexOf(q.id) >= 0; });
        var aligned = T.alignEdges(members, 'x');
        var map = {};
        aligned.forEach(function (q) { map[q.id] = q; });
        nextA.buildings = nextA.buildings.map(function (q) { return map[q.id] || q; });
      }
      tryDoc(nextA);
      status('Faced the nearest street.');
      return;
    }
    if (kind === 'roof') {
      var nextF = clone(doc);
      var order = [null, 'flat', 'pitch', 'dome'];
      nextF.buildings = nextF.buildings.map(function (q) {
        if (q.id !== b.id) return q;
        var i = order.indexOf(q.roof);
        q.roof = order[(i + 1) % order.length];
        q.roofParts = q.roof ? T.roof(q, q.roof) : null;
        return q;
      });
      tryDoc(nextF);
      status((b.name || 'Building') + ' roof updated.');
    }
  }

  function onPointerDown(ev) {
    if (!open || !ui) return;
    if (ev.button != null && ev.button > 2) return;
    pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    if (ui.canvas.setPointerCapture) {
      try { ui.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    }
    if (ev.cancelable) ev.preventDefault();
    ev.stopPropagation();
    if (pointerList().length >= 2) {
      gesture = { kind: 'pinch', last: twoOf(pointerList()) };
      return;
    }
    var local = localPoint(ev);
    var w = ui.canvas.width, h = ui.canvas.height;
    var world = CAM.unproject(view, local.x, local.y, w, h);
    var b = CAM.hit(doc.buildings, view, local.x, local.y, w, h);
    var kind = CAM.classify({
      tool: tool,
      button: ev.button || 0,
      alt: !!ev.altKey,
      looking: looking,
      pointerType: ev.pointerType || 'mouse',
      hit: !!b
    });
    if (kind === 'pan') {
      startPan(ev, tool === 'move' && !looking && !b && (ev.button || 0) === 0 && !ev.altKey);
      return;
    }
    if (kind === 'tap') {
      gesture = { kind: 'tap' };
      onTap(tool, b, world);
      return;
    }
    startMove(ev, b, world);
  }

  function onPinch(ev) {
    pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    var now = twoOf(pointerList());
    if (!gesture || gesture.kind !== 'pinch' || !gesture.last) {
      gesture = { kind: 'pinch', last: now };
      return;
    }
    var prev = gesture.last;
    var factor = 1;
    if (prev.d >= MIN_PINCH && now.d >= MIN_PINCH) factor = prev.d / now.d;
    var mid = canvasOfClient(now.mx, now.my);
    var next = CAM.zoomToward(readView(), mid.x, mid.y, mid.w, mid.h, factor, mppLimits());
    if (view.mode === 'street' && prev.d >= MIN_PINCH && now.d >= MIN_PINCH) {
      next.yaw = wrapAng((next.yaw || view.yaw) - wrapAng(now.ang - prev.ang));
    }
    var scaleX = mid.w / (ui.canvas.getBoundingClientRect().width || 1);
    var scaleY = mid.h / (ui.canvas.getBoundingClientRect().height || 1);
    next = CAM.panBy(next, (now.mx - prev.mx) * scaleX, (now.my - prev.my) * scaleY, mid.w, mid.h, townBounds());
    applyView(next);
    gesture.last = now;
    draw();
  }

  function onPointerMove(ev) {
    if (!open || !pointers[ev.pointerId]) return;
    if (ev.cancelable) ev.preventDefault();
    if (pointerList().length >= 2) { onPinch(ev); return; }
    pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    if (!gesture || gesture.kind === 'tap' || gesture.kind === 'pinch') return;
    if (gesture.kind === 'pan') {
      var dx = ev.clientX - gesture.x, dy = ev.clientY - gesture.y;
      if (Math.hypot(dx, dy) >= DRAG_PX) gesture.moved = true;
      var held = {
        x: gesture.vx, z: gesture.vz, mpp: gesture.mpp,
        mode: gesture.mode, yaw: gesture.yaw, pitch: gesture.pitch
      };
      var rect = ui.canvas.getBoundingClientRect();
      var sx = ui.canvas.width / (rect.width || 1);
      var sy = ui.canvas.height / (rect.height || 1);
      applyView(CAM.panBy(held, dx * sx, dy * sy, ui.canvas.width, ui.canvas.height, townBounds()));
      draw();
      return;
    }
    if (gesture.kind !== 'move') return;
    if (Math.hypot(ev.clientX - gesture.x, ev.clientY - gesture.y) >= DRAG_PX) gesture.pulled = true;
    if (!gesture.moved && !gesture.pulled) return;
    var local = localPoint(ev);
    var world = CAM.unproject(view, local.x, local.y, ui.canvas.width, ui.canvas.height);
    var s = T.snap(world.x, world.z, SNAP);
    var mx = s.x - gesture.lastX, mz = s.z - gesture.lastZ;
    if (!mx && !mz) { draw(); return; }
    if (applyMove(gesture.id, mx, mz)) {
      gesture.lastX = s.x;
      gesture.lastZ = s.z;
      gesture.moved = true;
      status(gesture.name + '. Drag to move.');
    }
    draw();
  }

  function endPointer(ev) {
    if (pointers[ev.pointerId]) delete pointers[ev.pointerId];
    if (!open) { gesture = null; return; }
    if (pointerList().length >= 1) {
      if (pointerList().length === 1) gesture = null;
      return;
    }
    if (gesture && gesture.kind === 'move' && gesture.moved) {
      hist.push(doc);
      status(gesture.name + ' moved. Save to keep it on the test page.');
    } else if (gesture && gesture.kind === 'move' && gesture.pulled && !gesture.moved) {
      status('Under 2 m. Drag farther.');
    } else if (gesture && gesture.kind === 'pan' && gesture.clearOnTap && !gesture.moved) {
      selected = [];
      status('No building there.');
    }
    gesture = null;
    draw();
  }

  function tryDoc(next) {
    var errors = T.guardM2(base, next);
    if (errors.length) { status(errors[0]); return false; }
    commit(next, '');
    status('Ready. Save writes the test copy.');
    return true;
  }

  function zoomAt(px, py, factor) {
    var w = ui.canvas.width, h = ui.canvas.height;
    applyView(CAM.zoomToward(readView(), px, py, w, h, factor, mppLimits()));
    draw();
  }

  function fit() {
    var bounds = townBounds();
    var w = ui.canvas.width, h = ui.canvas.height;
    view.x = (bounds.minX + bounds.maxX) / 2;
    view.z = (bounds.minZ + bounds.maxZ) / 2;
    view.mpp = CAM.fitMpp(bounds, w, h);
    applyView(readView());
  }

  function paintBox(ctx, box, min) {
    var x = box.l, y = box.t, rw = box.r - box.l, rh = box.b - box.t;
    if (Math.abs(rw) < min) { x -= (min - Math.abs(rw)) / 2; rw = rw < 0 ? -min : min; }
    if (Math.abs(rh) < min) { y -= (min - Math.abs(rh)) / 2; rh = rh < 0 ? -min : min; }
    ctx.fillRect(x, y, rw, rh);
    ctx.strokeRect(x, y, rw, rh);
  }

  function draw() {
    if (!ui || !doc) return;
    var canvas = ui.canvas;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (view.mode === 'street') {
      ctx.fillStyle = '#14081c';
      ctx.fillRect(0, 0, w, h * 0.34);
      ctx.fillStyle = '#07110d';
      ctx.fillRect(0, h * 0.34, w, h);
    } else {
      ctx.fillStyle = '#07110d';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(62,230,255,0.16)';
    ctx.beginPath();
    var step = view.mpp > 8 ? 400 : (view.mpp > 1.2 ? 100 : SNAP);
    var x0 = view.x - (w / 2) * view.mpp, x1 = view.x + (w / 2) * view.mpp;
    var z0 = view.z - (h / 2) * view.mpp, z1 = view.z + (h / 2) * view.mpp;
    if (view.mode === 'street') {
      x0 = view.x - w * view.mpp;
      x1 = view.x + w * view.mpp;
      z0 = view.z - h * view.mpp;
      z1 = view.z + h * view.mpp;
    }
    var gx = Math.floor(x0 / step) * step;
    var nLine = 0;
    for (var x = gx; x <= x1 && nLine < 80; x += step) {
      nLine++;
      var a = CAM.project(view, x, z0, 0, w, h), b = CAM.project(view, x, z1, 0, w, h);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    var gz = Math.floor(z0 / step) * step;
    for (var z = gz; z <= z1 && nLine < 160; z += step) {
      nLine++;
      var c = CAM.project(view, x0, z, 0, w, h), d = CAM.project(view, x1, z, 0, w, h);
      ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]);
    }
    ctx.stroke();
    (doc.roads || []).forEach(function (r) {
      var p = CAM.project(view, r.x0, r.z0, 0, w, h), q = CAM.project(view, r.x1, r.z1, 0, w, h);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
      ctx.strokeStyle = r.added ? '#7dff6b' : (r.locked ? '#c47a3a' : '#3ee6ff');
      ctx.lineWidth = Math.max(r.locked ? 3 : 2, Math.min(8, (r.w || 12) / view.mpp));
      ctx.stroke();
    });
    if (gesture && gesture.from) {
      var ghost = CAM.box({ x0: gesture.from.x0, x1: gesture.from.x1, z0: gesture.from.z0, z1: gesture.from.z1, h: 8 }, view, w, h);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(ghost.l, ghost.t, ghost.r - ghost.l, ghost.b - ghost.t);
    }
    var list = (doc.buildings || []).slice();
    if (view.mode === 'street') {
      list.sort(function (a, b) {
        var da = (a.x - view.x) * Math.sin(view.yaw) + (a.z - view.z) * Math.cos(view.yaw);
        var db = (b.x - view.x) * Math.sin(view.yaw) + (b.z - view.z) * Math.cos(view.yaw);
        return db - da;
      });
    }
    list.forEach(function (b) {
      var on = selected.indexOf(b.id) >= 0 || groupIds.indexOf(b.id) >= 0;
      var box = CAM.box(b, view, w, h);
      if (view.mode === 'street') {
        var cs = CAM.corners(b);
        var y1 = b.h || 8;
        var g = cs.map(function (p) { return CAM.project(view, p[0], p[1], 0, w, h); });
        var top = cs.map(function (p) { return CAM.project(view, p[0], p[1], y1, w, h); });
        var i;
        for (i = 0; i < 4; i++) {
          var j = (i + 1) % 4;
          ctx.beginPath();
          ctx.moveTo(g[i][0], g[i][1]);
          ctx.lineTo(g[j][0], g[j][1]);
          ctx.lineTo(top[j][0], top[j][1]);
          ctx.lineTo(top[i][0], top[i][1]);
          ctx.closePath();
          ctx.fillStyle = on ? 'rgba(255,176,32,0.82)' : (i % 2 ? 'rgba(62,230,255,0.62)' : 'rgba(190,255,255,0.4)');
          ctx.fill();
        }
        ctx.beginPath();
        top.forEach(function (p, k) { if (k) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
        ctx.closePath();
        ctx.fillStyle = on ? '#ffb020' : '#d7fbff';
        ctx.fill();
        ctx.strokeStyle = on ? '#ffb020' : '#d7fbff';
        ctx.lineWidth = on ? 3 : 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = on ? 'rgba(255,176,32,0.72)' : 'rgba(62,230,255,0.38)';
        ctx.strokeStyle = on ? '#ffb020' : '#d7fbff';
        ctx.lineWidth = on ? 3 : 1;
        paintBox(ctx, box, on ? 10 : 4);
        if (b.yaw) {
          var corners = T.cornersOf(b);
          ctx.beginPath();
          corners.forEach(function (pt, k) {
            var s = CAM.project(view, pt[0], pt[1], 0, w, h);
            if (k === 0) ctx.moveTo(s[0], s[1]); else ctx.lineTo(s[0], s[1]);
          });
          ctx.closePath();
          ctx.strokeStyle = '#ffe14d';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      if (on && (box.r - box.l) < 22) {
        var cx = (box.l + box.r) / 2, cy = (box.t + box.b) / 2;
        ctx.strokeStyle = '#ffb020';
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - 14, cy - 14, 28, 28);
      }
      if (b.roofParts && view.mode !== 'street') {
        ctx.strokeStyle = '#ff4fd8';
        b.roofParts.forEach(function (part) {
          var ra = CAM.project(view, part.x0, part.z0, 0, w, h), rc = CAM.project(view, part.x1, part.z1, 0, w, h);
          ctx.strokeRect(ra[0], rc[1], rc[0] - ra[0], ra[1] - rc[1]);
        });
      }
      var wide = box.r - box.l;
      if (on || wide > 48) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 12px Orbitron, sans-serif';
        ctx.fillText(b.name || 'building', box.l + 4, Math.max(16, box.t + 14));
      }
    });
    (doc.spawns || []).forEach(function (s) {
      var p = CAM.project(view, s.x, s.z, 0, w, h);
      ctx.fillStyle = '#ff4fd8';
      ctx.fillRect(p[0] - 4, p[1] - 4, 8, 8);
    });
    if (doc.measure) {
      var ma = CAM.project(view, doc.measure.a.x, doc.measure.a.z, 0, w, h);
      var mb = CAM.project(view, doc.measure.b.x, doc.measure.b.z, 0, w, h);
      ctx.strokeStyle = '#ffe14d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ma[0], ma[1]); ctx.lineTo(mb[0], mb[1]);
      ctx.stroke();
      ctx.fillStyle = '#ffe14d';
      ctx.font = '700 14px Orbitron, sans-serif';
      ctx.fillText(doc.measure.metres.toFixed(1) + ' m', (ma[0] + mb[0]) / 2 + 6, (ma[1] + mb[1]) / 2);
    }
    var fitM = CAM.fitMpp(townBounds(), w, h);
    var zoomName = view.mpp <= 0.35 ? 'Close' : (view.mpp >= fitM * 0.82 ? 'Whole town' : 'Zoomed');
    var modeName = view.mode === 'street' ? 'Street view' : 'Top view';
    var cap = modeName + ' · ' + zoomName + (gesture && gesture.kind === 'move' ? ' · moving' : '');
    ctx.fillStyle = 'rgba(5,6,12,0.88)';
    ctx.fillRect(8, 8, Math.min(w - 16, 280), 28);
    ctx.fillStyle = '#ffe14d';
    ctx.font = '700 14px Orbitron, sans-serif';
    ctx.fillText(cap, 16, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Orbitron, sans-serif';
    ctx.fillText(view.mode === 'street' ? 'Street view' : 'North is up', 12, h - 12);
  }

  function selectedName() {
    var b = (doc && doc.buildings || []).filter(function (q) { return selected.indexOf(q.id) >= 0; })[0];
    return b ? (b.name || 'Building') : '';
  }

  function paintTools() {
    if (!ui) return;
    [].forEach.call(ui.root.querySelectorAll('button'), function (btn) {
      var name = btn.getAttribute('data-tool');
      var act = btn.getAttribute('data-act');
      var on = false;
      if (name && name === tool) on = true;
      if (act === 'look' && looking) on = true;
      if (act === 'view' && view.mode === 'street') on = true;
      btn.classList.toggle('on', on);
    });
  }

  function setTool(name) {
    tool = name;
    measureA = null;
    roadA = null;
    paintTools();
    var named = selectedName();
    var labels = {
      move: named ? (named + '. Drag to move.') : 'Drag a building.',
      road: 'Two taps add a street.',
      measure: 'Two taps measure in metres.',
      align: 'Tap a building to face the street.',
      group: 'Tap buildings to stick them together.',
      rotate: 'Tap a building to turn it.',
      roof: 'Tap a building to change its roof.'
    };
    status(labels[name] || '');
  }

  function setMode(mode) {
    view.mode = mode === 'street' ? 'street' : 'top';
    paintTools();
    var named = selectedName();
    if (tool === 'move' && named) status(named + '. Drag to move.');
    else status(view.mode === 'street' ? 'Street view.' : 'Top view.');
    draw();
  }

  function toggleLook() {
    looking = !looking;
    paintTools();
    var named = selectedName();
    status(looking ? 'Look. Drag the map. Move stays on.' : (named ? (named + '. Drag to move.') : 'Drag a building.'));
  }

  function attachFps() {
    if (!ui || !ui.fps) return;
    var api = window.ZD_DEV_FPS || window.DEV_TEST_FPS;
    if (api && typeof api.attach === 'function') {
      try { api.attach(ui.fps); } catch (e) {}
    }
    var el = document.getElementById('zdDevFps');
    if (el && el.parentNode !== ui.fps) ui.fps.appendChild(el);
  }

  function mount() {
    if (ui) return;
    var root = document.createElement('div');
    root.id = 'devBuilder';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'DEV Builder');
    root.style.cssText = 'display:none;position:fixed;inset:0;z-index:80;background:#05060c;color:#fff;font-family:Orbitron,sans-serif;flex-direction:column;touch-action:none;user-select:none;';
    root.innerHTML = ''
      + '<div id="devBar">'
      + '<strong>Builder</strong>'
      + '<span id="devLabel" class="phone-hide"></span>'
      + '<button type="button" data-act="undo" class="phone-hide">Undo</button>'
      + '<button type="button" data-act="redo" class="phone-hide">Redo</button>'
      + '<button type="button" data-act="save">Save</button>'
      + '<button type="button" data-act="export" class="phone-hide">Export</button>'
      + '<button type="button" data-act="import" class="phone-hide">Import</button>'
      + '<button type="button" data-act="close">Close</button>'
      + '</div>'
      + '<div id="devTools">'
      + '<button type="button" data-tool="move">Move</button>'
      + '<button type="button" data-act="look">Look</button>'
      + '<button type="button" data-tool="rotate">Turn</button>'
      + '<button type="button" data-tool="roof" class="phone-hide">Roof</button>'
      + '<button type="button" data-tool="align" class="phone-hide">Face street</button>'
      + '<button type="button" data-tool="group" class="phone-hide">Stick together</button>'
      + '<button type="button" data-tool="road" class="phone-hide">Street</button>'
      + '<button type="button" data-tool="measure" class="phone-hide">Measure</button>'
      + '<button type="button" data-act="view" class="phone-hide">Street view</button>'
      + '<button type="button" data-act="fit" class="phone-hide">Fit town</button>'
      + '<button type="button" data-act="more" class="phone-show">More</button>'
      + '</div>'
      + '<div id="devStage">'
      + '<canvas id="devMap"></canvas>'
      + '<div id="devFps"></div>'
      + '<div id="devZoom">'
      + '<button type="button" data-act="zoom-in" aria-label="Zoom in">+</button>'
      + '<button type="button" data-act="zoom-out" aria-label="Zoom out">-</button>'
      + '</div>'
      + '<div id="devMore">'
      + '<button type="button" data-tool="roof">Roof</button>'
      + '<button type="button" data-tool="align">Face street</button>'
      + '<button type="button" data-tool="group">Stick together</button>'
      + '<button type="button" data-tool="road">Street</button>'
      + '<button type="button" data-tool="measure">Measure</button>'
      + '<button type="button" data-act="view">Street view</button>'
      + '<button type="button" data-act="fit">Fit town</button>'
      + '<button type="button" data-act="undo">Undo</button>'
      + '<button type="button" data-act="redo">Redo</button>'
      + '<button type="button" data-act="export">Export</button>'
      + '<button type="button" data-act="import">Import</button>'
      + '</div>'
      + '<div id="devStatus"></div>'
      + '</div>'
      + '<input id="devFile" type="file" accept="application/json" hidden>';
    var css = document.createElement('style');
    css.textContent = '#devBar,#devTools{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:2px 8px;background:#12081c;border-bottom:2px solid #3ee6ff}'
      + '#devBar strong{font-size:14px}#devLabel{font-size:12px;color:#ffe14d}'
      + '#devStage{position:relative;flex:1 1 auto;min-height:0}'
      + '#devMap{position:absolute;inset:0;width:100%;height:100%;touch-action:none}'
      + '#devFps{position:absolute;top:8px;right:8px;z-index:3;pointer-events:none}'
      + '#devZoom{position:absolute;right:8px;bottom:48px;z-index:3;display:flex;flex-direction:column;gap:6px}'
      + '#devMore{display:none;position:absolute;left:8px;top:8px;right:64px;z-index:3;gap:6px;flex-wrap:wrap;padding:8px;background:#12081c;border:2px solid #3ee6ff;border-radius:12px}'
      + '#devMore.open{display:flex}'
      + '#devStatus{position:absolute;left:0;right:0;bottom:0;min-height:36px;padding:8px 12px;font-size:13px;background:rgba(18,8,28,0.92);border-top:2px solid #ffb020;pointer-events:none;white-space:normal;overflow-wrap:anywhere}'
      + '#devBuilder button{min-width:44px;min-height:44px;padding:4px 10px;border-radius:12px;border:2px solid #3ee6ff;background:#102028;color:#fff;font:700 13px Orbitron,sans-serif}'
      + '#devBuilder button.on{background:#ffb020;color:#12081c;border-color:#ffb020}'
      + '#devBuilder button:focus{outline:2px solid #fff;outline-offset:2px}'
      + '.phone-show{display:none}'
      + '@media (max-height:450px),(max-width:520px){#devBar,#devTools{flex-wrap:nowrap}.phone-hide{display:none !important}.phone-show{display:inline-flex}}'
      + '#devHold{display:none;position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:70;padding:8px 14px;border-radius:12px;background:#12081c;color:#ffe14d;border:2px solid #ffb020;font:700 14px Orbitron,sans-serif;pointer-events:none}';
    document.head.appendChild(css);
    document.body.appendChild(root);
    var canvas = root.querySelector('#devMap');
    ui = {
      root: root,
      canvas: canvas,
      status: root.querySelector('#devStatus'),
      label: root.querySelector('#devLabel'),
      more: root.querySelector('#devMore'),
      fps: root.querySelector('#devFps')
    };
    [].forEach.call(root.querySelectorAll('button'), function (btn) {
      var act = btn.getAttribute('data-act');
      var name = btn.getAttribute('data-tool');
      btn.addEventListener('click', function () {
        if (act !== 'more' && ui.more) ui.more.classList.remove('open');
        if (name) setTool(name);
        if (act === 'look') toggleLook();
        if (act === 'view') setMode(view.mode === 'street' ? 'top' : 'street');
        if (act === 'undo') {
          var u = hist.undo();
          if (u) { doc = u; selected = []; draw(); status('Undone.'); }
          else status('Nothing to undo.');
        }
        if (act === 'redo') {
          var r = hist.redo();
          if (r) { doc = r; selected = []; draw(); status('Redone.'); }
          else status('Nothing to redo.');
        }
        if (act === 'save') saveNow();
        if (act === 'export') exportFile();
        if (act === 'import') root.querySelector('#devFile').click();
        if (act === 'close') hide();
        if (act === 'fit') { fit(); status('Whole town.'); draw(); }
        if (act === 'zoom-in') zoomAt(canvas.width / 2, canvas.height / 2, 0.8);
        if (act === 'zoom-out') zoomAt(canvas.width / 2, canvas.height / 2, 1.25);
        if (act === 'more' && ui.more) ui.more.classList.toggle('open');
      });
    });
    root.querySelector('#devFile').addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var next = JSON.parse(reader.result);
          var res = editorDoc(next);
          if (!res.ok) { status(res.errors[0]); return; }
          doc = clone(next);
          hist.push(doc);
          draw();
          status(res.applied ? 'Imported onto this test page.' : 'Imported to the test copy. The live drive is unchanged.');
        } catch (e) { status('That file is not a layout.'); }
      };
      reader.readAsText(file);
    });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
    canvas.addEventListener('wheel', function (ev) {
      if (!open) return;
      ev.preventDefault();
      var dy = ev.deltaY;
      if (ev.deltaMode === 1) dy *= 16;
      var local = localPoint(ev);
      zoomAt(local.x, local.y, Math.exp(dy * 0.0018));
    }, { passive: false });
    window.addEventListener('keydown', function (ev) {
      if (!open || !ui) return;
      if (ev.target && ev.target.tagName === 'INPUT') return;
      var step = 48, dx = 0, dy = 0, factor = 0;
      if (ev.key === 'ArrowLeft') dx = -step;
      else if (ev.key === 'ArrowRight') dx = step;
      else if (ev.key === 'ArrowUp') dy = -step;
      else if (ev.key === 'ArrowDown') dy = step;
      else if (ev.key === '+' || ev.key === '=') factor = 0.8;
      else if (ev.key === '-' || ev.key === '_') factor = 1.25;
      else return;
      ev.preventDefault();
      if (factor) zoomAt(ui.canvas.width / 2, ui.canvas.height / 2, factor);
      else {
        var rect = ui.canvas.getBoundingClientRect();
        applyView(CAM.panBy(readView(), dx * (ui.canvas.width / (rect.width || 1)), dy * (ui.canvas.height / (rect.height || 1)), ui.canvas.width, ui.canvas.height, townBounds()));
        draw();
      }
    });
    setTool('move');
    setMode('top');
  }

  function resize() {
    if (!ui) return;
    var canvas = ui.canvas;
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(r.width));
    canvas.height = Math.max(120, Math.floor(r.height));
  }

  function show() {
    mount();
    if (!doc) {
      base = exportDoc();
      var stored = readLocal();
      doc = stored && stored.v === 1 ? stored : clone(base);
      hist.push(doc);
    }
    open = true;
    ui.root.style.display = 'flex';
    ui.label.textContent = applies() ? 'Test page only' : 'View only';
    var hold = document.getElementById('devHold');
    if (hold) hold.style.display = 'none';
    var demo = new URLSearchParams(location.search).get('demo') === '1';
    resize();
    if (!demo) openNeighborhood();
    attachFps();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () {
        if (!open) return;
        resize();
        if (!demo) openNeighborhood();
        else draw();
        attachFps();
      });
    }
    if (demo) runDemo();
  }

  function hide() {
    open = false;
    gesture = null;
    pointers = {};
    if (ui) ui.root.style.display = 'none';
  }

  function saveNow() {
    var res = editorDoc(clone(doc));
    if (!res.ok) { status(res.errors[0]); return; }
    status(res.applied ? 'Saved and loaded on this test page.' : 'Saved for the test page. This drive did not change.');
  }

  function exportFile() {
    var blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'neon-world-layout.json';
    a.click();
    status('Exported the layout.');
  }

  function runDemo() {
    var next = clone(doc);
    var home = next.buildings.filter(function (b) { return b.purpose === 'HOME'; })[0];
    if (home) {
      home.roof = 'pitch';
      home.roofParts = T.roof(home, 'pitch');
      selected = [home.id];
    }
    next.measure = { a: { x: 0, z: 0 }, b: { x: 180, z: 520 }, metres: T.measure({ x: 0, z: 0 }, { x: 180, z: 520 }).metres };
    next.roads.push({
      id: 'new-demo',
      x0: 200, z0: -300, x1: 200, z1: -80,
      w: 20, kind: 'street', locked: false, added: true
    });
    var pair = next.buildings.filter(function (b) { return b.purpose === 'BUILDER'; }).slice(0, 2);
    if (pair.length === 2) {
      groupIds = pair.map(function (b) { return b.id; });
      next.groups = [{ id: 'g1', members: groupIds.slice() }];
    }
    var errors = T.guardM2(base, next);
    if (!errors.length) doc = next;
    hist.push(doc);
    draw();
    status(errors.length ? errors[0] : 'Demo: pitched roof, a measure, a new street, and a group.');
  }

  function openNeighborhood() {
    var b = focusBuilding();
    if (!b || !ui) { fit(); return; }
    view.mode = 'top';
    view.x = b.x;
    view.z = b.z;
    var bw = Math.max(8, b.w || Math.abs(b.x1 - b.x0) || 16);
    view.mpp = Math.max(0.05, CAM.openMpp(bw));
    applyView(readView());
    selected = [b.id];
    tool = 'move';
    paintTools();
    status((b.name || 'Building') + '. Drag to move.');
    draw();
  }

  function focusBuilding() {
    var list = doc.buildings || [];
    var best = list[0], bestD = 1e18;
    list.forEach(function (b) {
      var d = Math.hypot((b.x || 0) - 220, (b.z || 0) - 80);
      var area = Math.abs((b.x1 - b.x0) * (b.z1 - b.z0));
      if (area < 80) return;
      if (d < bestD) { bestD = d; best = b; }
    });
    return best || list[0];
  }

  function frame(opts) {
    opts = opts || {};
    if (!open) show();
    resize();
    if (opts.reset && base) {
      doc = clone(base);
      selected = [];
      groupIds = [];
      gesture = null;
      pointers = {};
      hist.push(doc);
    }
    view.mode = opts.mode === 'street' ? 'street' : 'top';
    view.yaw = STREET_YAW;
    view.pitch = STREET_PITCH;
    var b = focusBuilding();
    if (opts.zoom === 'town') fit();
    else if (opts.zoom === 'open') openNeighborhood();
    else if (b) {
      view.x = b.x;
      view.z = b.z;
      var span = opts.zoom === 'block' ? 180 : Math.max(b.w || (b.x1 - b.x0), b.d || (b.z1 - b.z0), 16) * 1.7;
      var short = Math.min(ui.canvas.width, ui.canvas.height);
      view.mpp = Math.max(0.05, span / short);
      applyView(readView());
    }
    tool = 'move';
    paintTools();
    if (opts.label && ui) ui.label.textContent = opts.label;
    if (b && opts.zoom !== 'town') selected = [b.id];
    draw();
    return {
      mode: view.mode,
      mpp: view.mpp,
      id: b ? b.id : '',
      name: b ? b.name : '',
      x: view.x,
      z: view.z,
      n: (doc.buildings || []).length
    };
  }

  function screenOf(id) {
    var b = (doc.buildings || []).find(function (q) { return q.id === id; });
    if (!b || !ui) return null;
    var p = CAM.project(view, b.x, b.z, 0, ui.canvas.width, ui.canvas.height);
    return { x: p[0], y: p[1], w: ui.canvas.width, h: ui.canvas.height };
  }

  function latch() {
    var holds = {};
    var timer = 0;
    var hint = document.createElement('div');
    hint.id = 'devHold';
    hint.textContent = 'Keep holding';
    if (document.body && document.body.appendChild) document.body.appendChild(hint);
    function spot(ev) {
      return CAM.latchSpot(ev.clientX, ev.clientY, window.innerWidth, window.innerHeight);
    }
    function both() { return holds.tl != null && holds.bc != null; }
    function arm() {
      if (timer || open) return;
      if (!both()) return;
      timer = setTimeout(function () {
        timer = 0;
        if (both()) show();
      }, 2000);
    }
    function syncHint() {
      if (!hint.style) return;
      if (open || (holds.tl == null && holds.bc == null)) hint.style.display = 'none';
      else { hint.textContent = 'Keep holding'; hint.style.display = 'block'; }
    }
    function release(ev) {
      Object.keys(holds).forEach(function (k) { if (holds[k] === ev.pointerId) delete holds[k]; });
      if (!both() && timer) { clearTimeout(timer); timer = 0; }
      syncHint();
    }
    window.addEventListener('pointerdown', function (ev) {
      if (open) return;
      var c = spot(ev);
      if (!c) return;
      holds[c] = ev.pointerId;
      syncHint();
      arm();
    });
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('keydown', function (ev) {
      if (open || ev.repeat) return;
      if (!(ev.ctrlKey && ev.shiftKey)) return;
      if (ev.code !== 'KeyB' && ev.key !== 'B' && ev.key !== 'b') return;
      ev.preventDefault();
      show();
    });
  }

  function boot() {
    base = exportDoc();
    CITY._editorBase = base;
    if (applies()) {
      var stored = readLocal();
      if (stored && stored.v === 1) {
        var res = editorDoc(stored);
        if (!res.ok && window.console) console.warn('DEV Builder refused the test layout', res.errors);
      }
    }
    if (document.body) latch();
    else document.addEventListener('DOMContentLoaded', latch);
    if (window.ZD_DEV_OPEN) {
      if (document.body) show();
      else document.addEventListener('DOMContentLoaded', show);
    }
    window.addEventListener('resize', function () { if (open) { resize(); draw(); } });
  }

  window.DEV_BUILDER = {
    open: show,
    close: hide,
    doc: function () { return doc; },
    applies: applies,
    cam: CAM,
    frame: frame,
    screenOf: screenOf,
    selfCheck: function () {
      var src = '';
      try { src = Function.prototype.toString.call(draw); } catch (e) {}
      return {
        tools: !!(T.roof && T.measure && T.alignFace && T.groupMove && T.guardM2 && T.rotate),
        editorDoc: typeof CITY.editorDoc === 'function',
        noShadow: src.indexOf('shadowBlur') < 0 && (document.getElementById('devBuilder') ? document.getElementById('devBuilder').innerHTML.indexOf('shadowBlur') < 0 : true),
        level: 'M2',
        applies: applies()
      };
    }
  };

  if (typeof document !== 'undefined') boot();
})();
