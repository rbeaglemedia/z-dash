/* DEV Builder, M2, on the current Neon World.
   Bob only. Hidden until the corner latch. Not a driver-HUD button.
   Map edits save to zdash.city.editor.v1. They change the drive only on /test/.
   Q2 tools: roof, measure, align, group, 15 degree rotate.
   Draws with flat fills. No shadowBlur. */
'use strict';
(function () {
  if (typeof CITY === 'undefined' || !window.PLANNER_TOOLS) return;
  var T = window.PLANNER_TOOLS;
  var KEY = 'zdash.city.editor.v1';
  var SNAP = 2;
  var base = null;
  var doc = null;
  var hist = T.createHistory(100);
  var ui = null;
  var tool = 'move';
  var selected = [];
  var groupIds = [];
  var drag = null;
  var measureA = null;
  var roadA = null;
  var view = { x: 0, z: 400, mpp: 4 };
  var open = false;

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
        x: o.x, z: o.z,         w: f.w, d: f.d, h: o.h,
        prefabW: o.w, prefabD: o.d, prefabRot: o.rot || 0,
        yaw: 0,
        rot: o.rot || 0,
        x0: f.x0, x1: f.x1, z0: f.z0, z1: f.z1,
        face: faceOf(o),
        roof: null,
        roofParts: null
      });
    });
    var roads = (CITY.ROADS.toJSON ? CITY.ROADS.toJSON() : []).map(function (r, i) {
      var kind = r.kind || 'street';
      return {
        id: kind + ':' + r.a[0] + ',' + r.a[1] + ':' + r.b[0] + ',' + r.b[1],
        x0: r.a[0], z0: r.a[1], x1: r.b[0], z1: r.b[1],
        w: r.w, kind: kind,
        locked: T.lockedKind(kind)
      };
    });
    return {
      v: 1,
      level: 'M2',
      option: 'current',
      snapM: SNAP,
      highwayX: CITY.HW ? CITY.HW.x : -450,
      spawns: [
        { id: 'player', x: 0, z: 0, locked: true },
        { id: 'skydrop', x: 180, z: 520, locked: true }
      ],
      buildings: buildings,
      roads: roads,
      groups: []
    };
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

  function editorDoc(next) {
    if (next === undefined) return exportDoc();
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

  function replaceBuildings(list) {
    var map = {};
    list.forEach(function (b) { map[b.id] = b; });
    doc.buildings = doc.buildings.map(function (b) { return map[b.id] || b; });
  }

  function selectedBuildings() {
    var ids = selected.slice();
    if (tool === 'group' || groupIds.length) {
      groupIds.forEach(function (id) { if (ids.indexOf(id) < 0 && selected.indexOf(id) >= 0) ids.push(id); });
    }
    var moveIds = selected.slice();
    if (moveIds.length === 1 && groupIds.indexOf(moveIds[0]) >= 0) moveIds = groupIds.slice();
    return buildingsByIds(moveIds);
  }

  function hitBuilding(x, z) {
    var found = null;
    (doc.buildings || []).forEach(function (b) {
      if (x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) found = b;
    });
    return found;
  }

  function toWorld(ev, canvas) {
    var r = canvas.getBoundingClientRect();
    var px = (ev.clientX - r.left) * (canvas.width / r.width);
    var py = (ev.clientY - r.top) * (canvas.height / r.height);
    return {
      x: view.x + (px - canvas.width / 2) * view.mpp,
      z: view.z + (canvas.height / 2 - py) * view.mpp
    };
  }

  function snapped(p) { return T.snap(p.x, p.z, SNAP); }

  function tryDoc(next) {
    var errors = T.guardM2(base, next);
    if (errors.length) { status(errors[0]); return false; }
    commit(next, '');
    status('Ready. Save writes the test copy.');
    return true;
  }

  function status(text) {
    if (ui && ui.status) ui.status.textContent = text;
  }

  function onPointerDown(ev) {
    if (!open || !ui) return;
    var p = snapped(toWorld(ev, ui.canvas));
    if (tool === 'pan' || ev.button === 1 || ev.altKey) {
      drag = { kind: 'pan', x: ev.clientX, y: ev.clientY, vx: view.x, vz: view.z };
      return;
    }
    if (tool === 'measure') {
      if (!measureA) { measureA = p; status('Measure: tap the second point.'); }
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
    if (tool === 'road') {
      if (!roadA) { roadA = p; status('Road: tap the other end. Streets only.'); }
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
    var b = hitBuilding(p.x, p.z);
    if (tool === 'group') {
      if (!b) return;
      var at = groupIds.indexOf(b.id);
      if (at >= 0) groupIds.splice(at, 1); else groupIds.push(b.id);
      selected = groupIds.slice();
      doc.groups = [{ id: 'g1', members: groupIds.slice() }];
      status(groupIds.length ? ('Group of ' + groupIds.length) : 'Group is empty.');
      draw();
      return;
    }
    if (!b) { selected = []; draw(); return; }
    if (groupIds.indexOf(b.id) >= 0) selected = groupIds.slice();
    else selected = [b.id];
    if (tool === 'rotate') {
      var nextR = clone(doc);
      nextR.buildings = nextR.buildings.map(function (q) {
        if (selected.indexOf(q.id) < 0) return q;
        q.yaw = T.rotate(q.yaw || 0, 'deg15');
        return T.withAabb(q);
      });
      tryDoc(nextR);
      status('Rotated 15 degrees.');
      return;
    }
    if (tool === 'align') {
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
    if (tool === 'roof') {
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
      status(b.name + ' roof updated.');
      return;
    }
    drag = { kind: 'move', id: b.id, x: p.x, z: p.z, lastX: p.x, lastZ: p.z };
  }

  function onPointerMove(ev) {
    if (!drag) return;
    if (drag.kind === 'pan') {
      view.x = drag.vx - (ev.clientX - drag.x) * view.mpp;
      view.z = drag.vz + (ev.clientY - drag.y) * view.mpp;
      draw();
      return;
    }
    var p = snapped(toWorld(ev, ui.canvas));
    var dx = p.x - drag.lastX, dz = p.z - drag.lastZ;
    if (!dx && !dz) return;
    var ids = groupIds.indexOf(drag.id) >= 0 ? groupIds.slice() : [drag.id];
    var members = buildingsByIds(ids);
    var moved = T.groupMove(members, dx, dz);
    var next = clone(doc);
    var map = {};
    moved.forEach(function (b) { map[b.id] = b; });
    next.buildings = next.buildings.map(function (b) { return map[b.id] || b; });
    var errors = T.guardM2(base, next);
    if (errors.length) { status(errors[0]); return; }
    doc = next;
    drag.lastX = p.x;
    drag.lastZ = p.z;
    draw();
  }

  function onPointerUp() {
    if (drag && drag.kind === 'move') {
      hist.push(doc);
      status('Moved. Save keeps this on the test copy.');
    }
    drag = null;
    draw();
  }

  function fit() {
    var minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
    function take(x, z) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    (doc.buildings || []).forEach(function (b) { take(b.x0, b.z0); take(b.x1, b.z1); });
    (doc.roads || []).forEach(function (r) {
      if (r.kind === 'track') return;
      take(r.x0, r.z0); take(r.x1, r.z1);
    });
    if (minX > maxX) return;
    view.x = (minX + maxX) / 2;
    view.z = (minZ + maxZ) / 2;
    var cw = ui.canvas.width, ch = ui.canvas.height;
    view.mpp = Math.max((maxX - minX) / (cw * 0.86), (maxZ - minZ) / (ch * 0.78));
  }

  function project(x, z, canvas) {
    return [
      canvas.width / 2 + (x - view.x) / view.mpp,
      canvas.height / 2 - (z - view.z) / view.mpp
    ];
  }

  function draw() {
    if (!ui) return;
    var canvas = ui.canvas;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#07110d';
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(62,230,255,0.16)';
    ctx.beginPath();
    var step = view.mpp > 1.2 ? 100 : SNAP;
    var x0 = view.x - (w / 2) * view.mpp, x1 = view.x + (w / 2) * view.mpp;
    var z0 = view.z - (h / 2) * view.mpp, z1 = view.z + (h / 2) * view.mpp;
    var gx = Math.floor(x0 / step) * step;
    for (var x = gx; x <= x1; x += step) {
      var a = project(x, z0, canvas), b = project(x, z1, canvas);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    var gz = Math.floor(z0 / step) * step;
    for (var z = gz; z <= z1; z += step) {
      var c = project(x0, z, canvas), d = project(x1, z, canvas);
      ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]);
    }
    ctx.stroke();
    (doc.roads || []).forEach(function (r) {
      var p = project(r.x0, r.z0, canvas), q = project(r.x1, r.z1, canvas);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
      ctx.strokeStyle = r.added ? '#7dff6b' : (r.locked ? '#c47a3a' : '#3ee6ff');
      ctx.lineWidth = r.locked ? 3 : 2;
      ctx.stroke();
    });
    (doc.buildings || []).forEach(function (b) {
      var p = project(b.x0, b.z0, canvas), q = project(b.x1, b.z1, canvas);
      var on = selected.indexOf(b.id) >= 0 || groupIds.indexOf(b.id) >= 0;
      ctx.fillStyle = on ? 'rgba(255,176,32,0.55)' : 'rgba(62,230,255,0.28)';
      ctx.strokeStyle = on ? '#ffb020' : '#d7fbff';
      ctx.lineWidth = on ? 2 : 1;
      ctx.fillRect(p[0], q[1], q[0] - p[0], p[1] - q[1]);
      ctx.strokeRect(p[0], q[1], q[0] - p[0], p[1] - q[1]);
      if (b.yaw) {
        var cs = T.cornersOf(b);
        ctx.beginPath();
        cs.forEach(function (pt, i) {
          var s = project(pt[0], pt[1], canvas);
          if (i === 0) ctx.moveTo(s[0], s[1]); else ctx.lineTo(s[0], s[1]);
        });
        ctx.closePath();
        ctx.strokeStyle = '#ffe14d';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      if (b.roofParts) {
        ctx.strokeStyle = '#ff4fd8';
        b.roofParts.forEach(function (part) {
          var a = project(part.x0, part.z0, canvas), c2 = project(part.x1, part.z1, canvas);
          ctx.strokeRect(a[0], c2[1], c2[0] - a[0], a[1] - c2[1]);
        });
      }
    });
    (doc.spawns || []).forEach(function (s) {
      var p = project(s.x, s.z, canvas);
      ctx.fillStyle = '#ff4fd8';
      ctx.fillRect(p[0] - 4, p[1] - 4, 8, 8);
    });
    if (doc.measure) {
      var a = project(doc.measure.a.x, doc.measure.a.z, canvas);
      var b = project(doc.measure.b.x, doc.measure.b.z, canvas);
      ctx.strokeStyle = '#ffe14d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.stroke();
      ctx.fillStyle = '#ffe14d';
      ctx.font = '700 14px Orbitron, sans-serif';
      ctx.fillText(doc.measure.metres.toFixed(1) + ' m', (a[0] + b[0]) / 2 + 6, (a[1] + b[1]) / 2);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Orbitron, sans-serif';
    ctx.fillText('North is up', 12, h - 12);
  }

  function setTool(name) {
    tool = name;
    measureA = null;
    roadA = null;
    if (ui) {
      [].forEach.call(ui.root.querySelectorAll('[data-tool]'), function (btn) {
        btn.classList.toggle('on', btn.getAttribute('data-tool') === name);
      });
    }
    var labels = {
      move: 'Drag a building. Snap is 2 m.',
      road: 'Two taps add a street. The highway stays locked.',
      measure: 'Two taps measure in metres.',
      align: 'Face the nearest street. A group lines up on the left edge.',
      group: 'Tap buildings to stick them together.',
      rotate: 'Tap a building to turn it 15 degrees.',
      roof: 'Tap a building to cycle flat, pitched, and dome roofs.',
      pan: 'Drag to look around the map.'
    };
    status(labels[name] || '');
  }

  function mount() {
    if (ui) return;
    var root = document.createElement('div');
    root.id = 'devBuilder';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'DEV Builder');
    root.style.cssText = 'display:none;position:fixed;inset:0;z-index:80;background:#05060c;color:#fff;font-family:Orbitron,sans-serif;flex-direction:column;';
    root.innerHTML = ''
      + '<div id="devBar" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px;background:#12081c;border-bottom:2px solid #3ee6ff">'
      + '<strong style="font-size:14px;letter-spacing:0.5px">DEV Builder M2</strong>'
      + '<span id="devLabel" style="font-size:12px;color:#ffe14d"></span>'
      + '<span style="flex:1"></span>'
      + '<button type="button" data-act="undo">Undo</button>'
      + '<button type="button" data-act="redo">Redo</button>'
      + '<button type="button" data-act="save">Save test</button>'
      + '<button type="button" data-act="export">Export</button>'
      + '<button type="button" data-act="import">Import</button>'
      + '<button type="button" data-act="close">Close</button>'
      + '</div>'
      + '<div id="devTools" style="display:flex;gap:8px;flex-wrap:wrap;padding:8px;background:#0c0614">'
      + '<button type="button" data-tool="move">Move</button>'
      + '<button type="button" data-tool="road">Road</button>'
      + '<button type="button" data-tool="measure">Measure</button>'
      + '<button type="button" data-tool="align">Align</button>'
      + '<button type="button" data-tool="group">Group</button>'
      + '<button type="button" data-tool="rotate">Rotate 15</button>'
      + '<button type="button" data-tool="roof">Roof</button>'
      + '<button type="button" data-tool="pan">Pan</button>'
      + '</div>'
      + '<canvas id="devMap" style="flex:1;width:100%;min-height:160px;touch-action:none"></canvas>'
      + '<div id="devStatus" style="min-height:44px;padding:10px 12px;font-size:13px;background:#12081c;border-top:2px solid #ffb020"></div>'
      + '<input id="devFile" type="file" accept="application/json" hidden>';
    var css = document.createElement('style');
    css.textContent = '#devBuilder button{min-width:44px;min-height:44px;padding:8px 12px;border-radius:12px;border:2px solid #3ee6ff;background:#102028;color:#fff;font:700 13px Orbitron,sans-serif;letter-spacing:0.3px}'
      + '#devBuilder button.on{background:#ffb020;color:#12081c;border-color:#ffb020}'
      + '#devBuilder button:focus{outline:2px solid #fff;outline-offset:2px}'
      + '#devStatus{white-space:normal;overflow-wrap:anywhere}';
    document.head.appendChild(css);
    document.body.appendChild(root);
    var canvas = root.querySelector('#devMap');
    ui = { root: root, canvas: canvas, status: root.querySelector('#devStatus'), label: root.querySelector('#devLabel') };
    [].forEach.call(root.querySelectorAll('button'), function (btn) {
      var act = btn.getAttribute('data-act');
      var name = btn.getAttribute('data-tool');
      btn.addEventListener('click', function () {
        if (name) setTool(name);
        if (act === 'undo') { var u = hist.undo(); if (u) { doc = u; draw(); } }
        if (act === 'redo') { var r = hist.redo(); if (r) { doc = r; draw(); } }
        if (act === 'save') saveNow();
        if (act === 'export') exportFile();
        if (act === 'import') root.querySelector('#devFile').click();
        if (act === 'close') hide();
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
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', function (ev) {
      if (!open) return;
      ev.preventDefault();
      view.mpp = Math.max(0.4, Math.min(20, view.mpp * (ev.deltaY > 0 ? 1.1 : 0.9)));
      draw();
    }, { passive: false });
    setTool('move');
  }

  function resize() {
    if (!ui) return;
    var canvas = ui.canvas;
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(r.width));
    canvas.height = Math.max(160, Math.floor(r.height));
  }

  function show() {
    mount();
    if (!doc) {
      base = exportDoc();
      var stored = readLocal();
      doc = stored && stored.v === 1 ? stored : clone(base);
      if (!stored) hist.push(doc);
      else hist.push(doc);
    }
    open = true;
    ui.root.style.display = 'flex';
    var params = new URLSearchParams(location.search);
    ui.label.textContent = (params.get('label') || 'Bob only') + (applies() ? ' · this /test/ page drives the save' : ' · live drive stays on the published map');
    resize();
    fit();
    draw();
    if (params.get('demo') === '1') runDemo();
  }

  function hide() {
    open = false;
    if (ui) ui.root.style.display = 'none';
  }

  function saveNow() {
    var res = editorDoc(clone(doc));
    if (!res.ok) { status(res.errors[0]); return; }
    status(res.applied ? 'Saved and loaded on this test page.' : 'Saved for /test/world.html. This drive did not change.');
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
    status(errors.length ? errors[0] : 'Demo: pitched roof, a measure, a new street, and a group. Not published.');
  }

  function latch() {
    var holds = {};
    var timer = 0;
    function corner(ev) {
      var x = ev.clientX, y = ev.clientY;
      var w = window.innerWidth, h = window.innerHeight;
      if (x < 72 && y < 72) return 'tl';
      if (x > w - 72 && y > h - 72) return 'br';
      return '';
    }
    function arm() {
      if (timer || open) return;
      if (holds.tl == null || holds.br == null) return;
      timer = setTimeout(function () {
        timer = 0;
        if (holds.tl != null && holds.br != null) show();
      }, 2000);
    }
    window.addEventListener('pointerdown', function (ev) {
      if (open) return;
      var c = corner(ev);
      if (!c) return;
      holds[c] = ev.pointerId;
      arm();
    });
    window.addEventListener('pointerup', function (ev) {
      Object.keys(holds).forEach(function (k) { if (holds[k] === ev.pointerId) delete holds[k]; });
      if (holds.tl == null || holds.br == null) {
        if (timer) { clearTimeout(timer); timer = 0; }
      }
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

  boot();
})();
