/* Shared planner tools for the DEV Builder and for Ellie's Builder.
   Interiors agent bc-80a1fc6f: load this file. Do not copy it.
   Call PLANNER_TOOLS. The room tool uses snap, rotate, moveHosts, copySpot, and history.
   A walk-in room's size comes from Bob's saved Interior Builder layout
   (zdash.interior.layout.v1). Until that save exists, the current Interiors
   room stays the default. The builder's unit is 1 foot. Item snap is 0.5 ft.
   A saved room may be larger than the building's outside footprint.
   The DEV Builder also uses roof, measure, alignFace, groupMove, and guardM2.
   Units are metres. There is no canvas shadowBlur in this file. */
'use strict';
(function (root) {
  var FT = 0.3048;

  function round(n, step) {
    return Math.round(n / step) * step;
  }

  function snap(x, z, step) {
    step = step || 2;
    return { x: round(x, step), z: round(z, step) };
  }

  /* Planner item snap is 0.5 ft. Ellie's room can pass 0.5 for the half-metre step. */
  function itemSnap(x, z) {
    return snap(x, z, 0.5 * FT);
  }

  function rotate(yawDeg, mode) {
    var step = mode === 'deg15' ? 15 : 90;
    var y = ((yawDeg || 0) + step) % 360;
    if (y < 0) y += 360;
    return y;
  }

  function moveHosts(host, dx, dz, items) {
    return items.map(function (it) {
      if (it.id !== host.id && it.host !== host.id) return it;
      return Object.assign({}, it, {
        x: it.x + dx, z: it.z + dz,
        x0: it.x0 + dx, x1: it.x1 + dx, z0: it.z0 + dz, z1: it.z1 + dz
      });
    });
  }

  function copySpot(item, gap) {
    var w = Math.abs(item.x1 - item.x0);
    var dx = w + (gap == null ? 0.5 * FT : gap);
    return Object.assign({}, item, {
      id: null, objId: null,
      x: item.x + dx, z: item.z,
      x0: item.x0 + dx, x1: item.x1 + dx
    });
  }

  function createHistory(limit) {
    var stack = [];
    var i = -1;
    limit = limit || 100;
    return {
      push: function (doc) {
        var s = JSON.stringify(doc);
        if (i >= 0 && stack[i] === s) return;
        stack.splice(i + 1);
        stack.push(s);
        while (stack.length > limit) { stack.shift(); i--; }
        i = stack.length - 1;
      },
      undo: function () {
        if (i <= 0) return null;
        i--;
        return JSON.parse(stack[i]);
      },
      redo: function () {
        if (i < 0 || i >= stack.length - 1) return null;
        i++;
        return JSON.parse(stack[i]);
      },
      canUndo: function () { return i > 0; },
      canRedo: function () { return i >= 0 && i < stack.length - 1; }
    };
  }

  function measure(a, b) {
    var dx = b.x - a.x, dz = b.z - a.z;
    return { dx: dx, dz: dz, metres: Math.hypot(dx, dz) };
  }

  function distPointSeg(px, pz, r) {
    var dx = r.x1 - r.x0, dz = r.z1 - r.z0;
    var L2 = dx * dx + dz * dz || 1;
    var t = Math.max(0, Math.min(1, ((px - r.x0) * dx + (pz - r.z0) * dz) / L2));
    return Math.hypot(px - (r.x0 + dx * t), pz - (r.z0 + dz * t));
  }

  function alignFace(b, roads) {
    var cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    var best = null, bestD = 1e9;
    (roads || []).forEach(function (r) {
      if (r.kind && r.kind !== 'street' && r.kind !== 'lane') return;
      var d = distPointSeg(cx, cz, r);
      if (d < bestD) { bestD = d; best = r; }
    });
    if (!best) return Object.assign({}, b);
    var horiz = Math.abs(best.x1 - best.x0) >= Math.abs(best.z1 - best.z0);
    var face = horiz ? (cz >= (best.z0 + best.z1) / 2 ? 'n' : 's') : (cx >= (best.x0 + best.x1) / 2 ? 'e' : 'w');
    var yaw = face === 'n' ? 0 : face === 'e' ? 90 : face === 's' ? 180 : 270;
    return Object.assign({}, b, { face: face, yaw: yaw });
  }

  function alignEdges(members, axis) {
    if (!members.length) return members;
    var key0 = axis === 'z' ? 'z0' : 'x0';
    var edge = members[0][key0];
    var deltaKey = axis === 'z' ? 'z' : 'x';
    return members.map(function (b) {
      var d = edge - b[key0];
      var next = Object.assign({}, b);
      next[deltaKey] = b[deltaKey] + d;
      next.x0 = b.x0 + (axis === 'z' ? 0 : d);
      next.x1 = b.x1 + (axis === 'z' ? 0 : d);
      next.z0 = b.z0 + (axis === 'z' ? d : 0);
      next.z1 = b.z1 + (axis === 'z' ? d : 0);
      return next;
    });
  }

  function groupMove(members, dx, dz) {
    return members.map(function (b) {
      return Object.assign({}, b, {
        x: b.x + dx, z: b.z + dz,
        x0: b.x0 + dx, x1: b.x1 + dx,
        z0: b.z0 + dz, z1: b.z1 + dz
      });
    });
  }

  function box(part, x0, x1, y0, y1, z0, z1) {
    if (x1 < x0) { var tx = x0; x0 = x1; x1 = tx; }
    if (z1 < z0) { var tz = z0; z0 = z1; z1 = tz; }
    return { part: part, x0: x0, x1: x1, y0: y0, y1: y1, z0: z0, z1: z1 };
  }

  /* Closed rectangle. Flat, pitched, and dome roofs are stacked boxes. No rotated mesh. */
  function roof(b, kind) {
    var x0 = b.x0, x1 = b.x1, z0 = b.z0, z1 = b.z1;
    var y = b.h || 8;
    kind = kind || 'flat';
    if (kind === 'pitch') {
      var parts = [];
      var span = Math.min(x1 - x0, z1 - z0);
      var steps = 4;
      for (var i = 0; i < steps; i++) {
        var u0 = i / steps;
        var inset = (span / 2) * u0 * 0.85;
        parts.push(box('roof-pitch', x0 + inset, x1 - inset, y + i * 0.45, y + (i + 1) * 0.45, z0 + inset * 0.35, z1 - inset * 0.35));
      }
      return parts;
    }
    if (kind === 'dome') {
      var rings = [];
      var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      var rad = Math.min(x1 - x0, z1 - z0) / 2;
      for (var k = 0; k < 4; k++) {
        var rr = rad * (1 - k / 4);
        rings.push(box('roof-dome', cx - rr, cx + rr, y + k * 0.4, y + (k + 1) * 0.4, cz - rr, cz + rr));
      }
      return rings;
    }
    return [box('roof-flat', x0 - 0.4, x1 + 0.4, y, y + 0.16, z0 - 0.4, z1 + 0.4)];
  }

  function cornersOf(b) {
    var yaw = ((b.yaw || 0) * Math.PI) / 180;
    var c = Math.cos(yaw), s = Math.sin(yaw);
    var w = b.w, d = b.d;
    return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(function (p) {
      return [b.x + p[0] * c - p[1] * s, b.z + p[0] * s + p[1] * c];
    });
  }

  function withAabb(b) {
    var cs = b.corners || cornersOf(b);
    var xs = cs.map(function (p) { return p[0]; });
    var zs = cs.map(function (p) { return p[1]; });
    return Object.assign({}, b, {
      corners: cs,
      x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs),
      z0: Math.min.apply(null, zs), z1: Math.max.apply(null, zs)
    });
  }

  function inside(b, x, z, pad) {
    pad = pad || 0;
    return x >= b.x0 - pad && x <= b.x1 + pad && z >= b.z0 - pad && z <= b.z1 + pad;
  }

  function samples(r, step) {
    var dx = r.x1 - r.x0, dz = r.z1 - r.z0;
    var L = Math.hypot(dx, dz);
    var n = Math.max(1, Math.ceil(L / (step || 4)));
    var out = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      out.push({ x: r.x0 + dx * t, z: r.z0 + dz * t });
    }
    return out;
  }

  function lockedKind(kind) {
    return kind === 'highway' || kind === 'bridge' || kind === 'tunnel' || kind === 'track' || kind === 'water';
  }

  /* M2: new streets and boulevard lanes can move in the document.
     Highway, bridge, tunnel, track, river water, and both spawns stay put. */
  function guardM2(base, next) {
    var errors = [];
    if (!next || next.v !== 1) errors.push('The layout is not version 1.');
    (base.spawns || []).forEach(function (s) {
      var n = (next.spawns || []).find(function (q) { return q.id === s.id; });
      if (!n || n.x !== s.x || n.z !== s.z) errors.push('Spawn ' + s.id + ' is locked.');
    });
    (base.roads || []).forEach(function (r) {
      if (!r.locked) return;
      var n = (next.roads || []).find(function (q) { return q.id === r.id; });
      if (!n || n.x0 !== r.x0 || n.z0 !== r.z0 || n.x1 !== r.x1 || n.z1 !== r.z1 || n.kind !== r.kind) {
        errors.push('Locked road ' + r.id + ' cannot change.');
      }
    });
    var hw = base.highwayX;
    (next.roads || []).forEach(function (r) {
      var known = (base.roads || []).some(function (b) { return b.id === r.id; });
      if (known) return;
      if (r.kind !== 'street') errors.push('A new road has to be a street.');
      if (hw != null && Math.abs(r.x0 - hw) < 2 && Math.abs(r.x1 - hw) < 2) errors.push('The highway is locked.');
      samples(r, 4).forEach(function (p) {
        (next.buildings || []).forEach(function (b) {
          if (inside(b, p.x, p.z, 0)) errors.push('That street runs through ' + (b.name || b.id) + '.');
        });
      });
    });
    (next.buildings || []).forEach(function (b) {
      (base.spawns || []).forEach(function (s) {
        if (inside(b, s.x, s.z, 3)) errors.push((b.name || b.id) + ' covers the ' + s.id + ' spawn.');
      });
    });
    var seen = {};
    errors.forEach(function (e) { seen[e] = 1; });
    return Object.keys(seen);
  }

  root.PLANNER_TOOLS = {
    FT: FT,
    snap: snap,
    itemSnap: itemSnap,
    rotate: rotate,
    moveHosts: moveHosts,
    copySpot: copySpot,
    createHistory: createHistory,
    measure: measure,
    alignFace: alignFace,
    alignEdges: alignEdges,
    groupMove: groupMove,
    roof: roof,
    cornersOf: cornersOf,
    withAabb: withAabb,
    inside: inside,
    samples: samples,
    lockedKind: lockedKind,
    guardM2: guardM2,
    distPointSeg: distPointSeg
  };
})(typeof window !== 'undefined' ? window : global);
