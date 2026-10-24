/* Character closet. A short list of our own parts, drawn as a jointed person.
   Head sits on the neck. Arms hang from the shoulders. Legs hang from the hips.
   A planted foot stays on the ground and does not slide. */
(function (root) {
  'use strict';
  var KEY = 'zdash.char.v1';
  var STRIP = '#3ee6ff';
  var STRIDE = 0.22;
  var STANCE = 0.62;
  var CATS = [
    { id: 'body', label: 'BODY' },
    { id: 'hair', label: 'HAIR' },
    { id: 'top', label: 'TOP' },
    { id: 'bottom', label: 'BOTTOM' },
    { id: 'shoes', label: 'SHOES' },
    { id: 'hands', label: 'HANDS' },
    { id: 'color', label: 'COLOR' }
  ];
  var ITEMS = {
    body: [{ id: 'standard', name: 'STANDARD' }, { id: 'short', name: 'SHORT' }],
    hair: [{ id: 'bob', name: 'BOB' }, { id: 'ponytail', name: 'PONY' }, { id: 'long', name: 'LONG' }],
    top: [{ id: 'tee', name: 'TEE' }, { id: 'hoodie', name: 'HOODIE' }, { id: 'jacket', name: 'JACKET' }],
    bottom: [{ id: 'jeans', name: 'JEANS' }, { id: 'shorts', name: 'SHORTS' }, { id: 'skirt', name: 'SKIRT' }],
    shoes: [{ id: 'sneakers', name: 'SNEAKERS' }, { id: 'boots', name: 'BOOTS' }],
    hands: [{ id: 'mittens', name: 'MITTENS' }, { id: 'gloves', name: 'GLOVES' }]
  };
  var COLOR_OF = { body: 'skin', hair: 'hair', top: 'top', bottom: 'bottom', shoes: 'shoes', hands: 'hands' };
  var PALETTE = ['#f2c7a5', '#e0a070', '#8d5524', '#c68642', '#3ee6ff', '#ff3df2', '#7cff4f', '#ffb020', '#ff4d5e', '#b48cff', '#fff04d', '#ffffff', '#1c2430', '#2a6fdb', '#c4522a', '#f4a3c0', '#3a2418', '#222222'];
  var HAIR_BACK = { bob: 'bob', ponytail: 'ponytail', long: 'long' };
  var HAIR_FWD = { short: 'bob', spiky: 'bob', bob: 'bob', long: 'long', ponytail: 'ponytail', buns: 'bob', curls: 'bob' };
  var DROP_LOOK = { autumn: 1, swimsuit: 1, tiny: 1 };

  function slowDevice() {
    try {
      var c = root.navigator && root.navigator.connection;
      if (c && (c.saveData || (c.effectiveType && String(c.effectiveType).indexOf('2g') >= 0))) return true;
      if (root.navigator && root.navigator.hardwareConcurrency && root.navigator.hardwareConcurrency <= 2) return true;
    } catch (e) {}
    return false;
  }
  var SLOW = slowDevice();

  function partsOf(gender) {
    return {
      body: 'standard',
      hair: gender === 'male' ? 'bob' : 'ponytail',
      top: 'tee', bottom: 'jeans', shoes: 'sneakers', hands: 'mittens'
    };
  }
  function colorsOf() {
    return { skin: '#f2c7a5', hair: '#3a2418', top: '#ff3df2', bottom: '#2a6fdb', shoes: '#ffffff', hands: '#f2c7a5', eye: '#3ee6ff' };
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function known(slot, id) {
    var list = ITEMS[slot] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return true;
    return false;
  }
  function preset(id, name, gender, parts, colors) {
    var p = partsOf(gender), c = colorsOf();
    if (parts) for (var k in parts) if (known(k, parts[k])) p[k] = parts[k];
    if (colors) for (var k2 in colors) if (typeof colors[k2] === 'string') c[k2] = colors[k2];
    return { id: id, name: name, gender: gender, parts: p, colors: c };
  }
  function starters() {
    return [
      preset('everyday', 'Everyday', 'female', {}, {}),
      preset('sunny', 'Sunny', 'female', { hair: 'bob', top: 'hoodie', bottom: 'shorts', shoes: 'boots', hands: 'gloves' }, { top: '#ffb020', bottom: '#3ee6ff', shoes: '#ffffff', hands: '#222222' })
    ];
  }
  function blank() {
    var s = starters()[0];
    return { v: 2, gender: 'female', parts: clone(s.parts), colors: clone(s.colors), outfits: starters(), active: 'everyday', hair: 'ponytail', glow: '#3ee6ff', outfit: '#ff3df2', updated: 0 };
  }
  function hex(v, fallback) { return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback; }
  function coerceParts(src) {
    var p = partsOf(src && src.gender);
    var s = src && src.parts || {};
    if (known('body', s.body)) p.body = s.body;
    else if (s.legs === 'short' || s.arms === 'short') p.body = 'short';
    var hair = HAIR_FWD[s.hair] || s.hair;
    if (known('hair', hair)) p.hair = hair;
    var top = s.top || s.shirt;
    if (known('top', top)) p.top = top;
    var bottom = s.bottom || s.pants;
    if (known('bottom', bottom)) p.bottom = bottom;
    var shoes = s.shoes === 'none' ? 'sneakers' : s.shoes;
    if (known('shoes', shoes)) p.shoes = shoes;
    var hands = s.hands === 'fingers' ? 'mittens' : s.hands;
    if (known('hands', hands)) p.hands = hands;
    return p;
  }
  function coerceColors(src) {
    var c = colorsOf();
    var s = src && src.colors || {};
    c.skin = hex(s.skin, c.skin);
    c.hair = hex(s.hair, c.hair);
    c.top = hex(s.top || s.shirt, c.top);
    c.bottom = hex(s.bottom || s.pants, c.bottom);
    c.shoes = hex(s.shoes, c.shoes);
    c.hands = hex(s.hands, c.hands);
    c.eye = hex(s.eye, c.eye);
    if ((!s.top && !s.shirt) && src && typeof src.glow === 'string') c.top = hex(src.glow, c.top);
    if (src && typeof src.glow === 'string' && !s.eye) c.eye = hex(src.glow, c.eye);
    return c;
  }
  function packOutfit(o) {
    if (!o || !o.id || DROP_LOOK[o.id]) return null;
    var parts = coerceParts(o);
    var colors = coerceColors(o);
    return { id: String(o.id).slice(0, 24), name: String(o.name || 'Look').slice(0, 18), gender: o.gender === 'male' ? 'male' : 'female', parts: parts, colors: colors };
  }
  function normalize(raw) {
    if (!raw || typeof raw !== 'object') return blank();
    var base = blank();
    if (raw.v === 2 && raw.parts) {
      base.gender = raw.gender === 'male' ? 'male' : 'female';
      base.parts = coerceParts(raw);
      base.colors = coerceColors(raw);
      base.outfits = Array.isArray(raw.outfits) ? raw.outfits.map(packOutfit).filter(Boolean) : [];
      if (!base.outfits.length) base.outfits = starters();
      base.active = raw.active && !DROP_LOOK[raw.active] ? raw.active : base.outfits[0].id;
    } else if (raw.v === 1 || raw.gender || raw.hair || raw.glow || raw.outfit) {
      base.gender = raw.gender === 'male' ? 'male' : 'female';
      base.parts = coerceParts({ gender: base.gender, parts: { hair: raw.hair } });
      var glow = hex(raw.glow || raw.outfit, '#ff3df2');
      base.colors.top = glow;
      base.colors.eye = glow;
      var mine = preset('mine', 'My Look', base.gender, base.parts, base.colors);
      base.outfits = [mine].concat(starters());
      base.active = 'mine';
      base.parts = clone(mine.parts);
      base.colors = clone(mine.colors);
    } else return blank();
    base.hair = HAIR_BACK[base.parts.hair] || 'ponytail';
    base.glow = base.colors.eye;
    base.outfit = base.colors.top;
    base.colors.shirt = base.colors.top;
    base.colors.pants = base.colors.bottom;
    base.v = 2;
    return base;
  }

  function measures(parts) {
    var short = parts && parts.body === 'short';
    var boots = parts && parts.shoes === 'boots';
    return {
      shoeH: boots ? 0.055 : 0.042,
      shoeR: boots ? 0.048 : 0.034,
      thigh: short ? 0.16 : 0.21,
      shin: short ? 0.15 : 0.19,
      torso: short ? 0.22 : 0.28,
      neck: 0.05,
      headR: 0.15,
      uarm: short ? 0.13 : 0.16,
      farm: short ? 0.12 : 0.14,
      hand: 0.046,
      shoulderX: short ? 0.13 : 0.155,
      hipX: short ? 0.058 : 0.072,
      torsoR: short ? 0.09 : 0.105
    };
  }
  function span(parts) {
    var m = measures(parts);
    var leg = m.thigh + m.shin;
    var hipY = m.shoeH + leg - 0.035;
    var top = hipY + m.torso + m.neck + m.headR * 2;
    return { hipY: hipY, top: top, ratio: (m.headR * 2) / top, m: m };
  }

  function vadd(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function vsub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function vmul(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
  function vlen(a) { return Math.hypot(a[0], a[1], a[2]); }
  function vnorm(a) { var l = vlen(a) || 1; return vmul(a, 1 / l); }
  function mod1(u) { return ((u % 1) + 1) % 1; }

  /* Stance slides back at exactly one stride per cycle, so a body that
     travels phase * STRIDE keeps that sole planted on one ground point.
     The foot plants ahead of the hip and lifts once it has trailed behind. */
  function footStep(phase) {
    var u = mod1(phase);
    var travel = STRIDE * STANCE;
    var z0 = travel * 0.55;
    var z1 = z0 - travel;
    if (u < STANCE) return { z: z0 - u * STRIDE, lift: 0, planted: true };
    var t = (u - STANCE) / (1 - STANCE);
    var ease = t * t * (3 - 2 * t);
    return { z: z1 + (z0 - z1) * ease, lift: Math.sin(Math.PI * t) * 0.05, planted: false };
  }
  function leanOf(p, originY, ang) {
    var y = p[1] - originY, z = p[2];
    var c = Math.cos(ang), s = Math.sin(ang);
    return [p[0], originY + y * c - z * s, y * s + z * c];
  }
  function ikKnee(hip, ankle, thigh, shin) {
    var delta = vsub(ankle, hip);
    var dist = vlen(delta);
    var reach = thigh + shin - 0.001;
    if (dist > reach) {
      ankle = vadd(hip, vmul(vnorm(delta), reach));
      delta = vsub(ankle, hip);
      dist = reach;
    }
    if (dist < 0.02) dist = 0.02;
    var n = vmul(delta, 1 / dist);
    var along = (thigh * thigh - shin * shin + dist * dist) / (2 * dist);
    var mid = vadd(hip, vmul(n, along));
    var h = Math.sqrt(Math.max(0, thigh * thigh - along * along));
    var fwd = [0, 0, 1];
    var dot = fwd[0] * n[0] + fwd[1] * n[1] + fwd[2] * n[2];
    var perp = vnorm(vsub(fwd, vmul(n, dot)));
    var knee = vadd(mid, vmul(perp, h));
    if (knee[2] < mid[2]) knee = vadd(mid, vmul(perp, -h));
    return { knee: knee, ankle: ankle };
  }
  function armFK(side, shoulder, swing, uarm, farm, handLen) {
    var dir = vnorm([side * 0.1, -Math.cos(swing), Math.sin(swing)]);
    var elbow = vadd(shoulder, vmul(dir, uarm));
    var dir2 = vnorm([side * 0.06, -Math.cos(swing * 0.45), Math.sin(swing) * 0.55 + 0.08]);
    var wrist = vadd(elbow, vmul(dir2, farm));
    var hand = vadd(wrist, vmul(vnorm(vsub(wrist, elbow)), handLen));
    return { elbow: elbow, wrist: wrist, hand: hand };
  }

  function buildJoints(gait, phase, parts) {
    var m = measures(parts);
    var moving = gait === 'walk' || gait === 'run';
    var bob = moving ? (gait === 'run' ? 0.018 : 0.012) * Math.pow(Math.sin((phase || 0) * Math.PI * 2), 2) : 0.006 * Math.sin((phase || 0) * Math.PI * 2);
    var lean = moving ? (gait === 'run' ? 0.1 : 0.05) : 0;
    var leg = m.thigh + m.shin;
    var hipY = m.shoeH + leg - 0.035 + bob;
    var shoulderY = hipY + m.torso;
    var left = moving ? footStep(phase || 0) : { z: 0.02, lift: 0, planted: true };
    var right = moving ? footStep((phase || 0) + 0.5) : { z: 0.02, lift: 0, planted: true };
    var hipL = [-m.hipX, hipY, 0], hipR = [m.hipX, hipY, 0];
    var ankL = [-m.hipX, m.shoeH + left.lift, left.z];
    var ankR = [m.hipX, m.shoeH + right.lift, right.z];
    var lk = ikKnee(hipL, ankL, m.thigh, m.shin);
    var rk = ikKnee(hipR, ankR, m.thigh, m.shin);
    var soleL = [lk.ankle[0], lk.ankle[1] - m.shoeH + m.shoeR, lk.ankle[2]];
    var soleR = [rk.ankle[0], rk.ankle[1] - m.shoeH + m.shoeR, rk.ankle[2]];
    var toeL = [soleL[0], soleL[1], soleL[2] + 0.07];
    var toeR = [soleR[0], soleR[1], soleR[2] + 0.07];
    var heelL = [soleL[0], soleL[1], soleL[2] - 0.04];
    var heelR = [soleR[0], soleR[1], soleR[2] - 0.04];
    var shL = [-m.shoulderX, shoulderY, 0.02];
    var shR = [m.shoulderX, shoulderY, 0.02];
    var neck = [0, shoulderY + m.neck, 0];
    var head = [0, neck[1] + m.headR, 0];
    var lead = left.z - right.z;
    var arm = moving ? Math.max(-1, Math.min(1, lead / (STRIDE * 0.5))) : 0;
    var aL = armFK(-1, shL, moving ? -arm * 0.62 : 0.1, m.uarm, m.farm, m.hand);
    var aR = armFK(1, shR, moving ? arm * 0.62 : 0.1, m.uarm, m.farm, m.hand);
    var nose = [0, head[1] - m.headR * 0.02, head[2] + m.headR * 0.82];
    var eyeL = [-m.headR * 0.32, head[1] + m.headR * 0.08, head[2] + m.headR * 0.62];
    var eyeR = [m.headR * 0.32, head[1] + m.headR * 0.08, head[2] + m.headR * 0.62];
    var mouth = [0, head[1] - m.headR * 0.28, head[2] + m.headR * 0.7];
    var pony0 = [0, head[1] + m.headR * 0.1, head[2] - m.headR * 0.75];
    var pony1 = [0, neck[1] - m.headR * (parts && parts.hair === 'long' ? 1.15 : 0.35), head[2] - m.headR * 0.85];
    var upper = [shL, shR, neck, head, nose, eyeL, eyeR, mouth, pony0, pony1, aL.elbow, aL.wrist, aL.hand, aR.elbow, aR.wrist, aR.hand];
    for (var i = 0; i < upper.length; i++) upper[i] = leanOf(upper[i], hipY, lean);
    return {
      hipL: hipL, hipR: hipR, kneeL: lk.knee, kneeR: rk.knee, ankleL: lk.ankle, ankleR: rk.ankle,
      soleL: soleL, soleR: soleR, toeL: toeL, toeR: toeR, heelL: heelL, heelR: heelR,
      shoulderL: upper[0], shoulderR: upper[1], neck: upper[2], head: upper[3],
      nose: upper[4], eyeL: upper[5], eyeR: upper[6], mouth: upper[7], pony0: upper[8], pony1: upper[9],
      elbowL: upper[10], wristL: upper[11], handL: upper[12], elbowR: upper[13], wristR: upper[14], handR: upper[15],
      plantedL: left.planted, plantedR: right.planted, bob: bob, stride: STRIDE
    };
  }

  function worldSoleZ(phase, side) {
    var u = mod1(side === 'R' ? phase + 0.5 : phase);
    var local = footStep(u).z;
    return (phase * STRIDE) + local;
  }

  var wear = blank();
  var undo = [];
  var yaw = 0.4;
  var colorSlot = 'top';
  var cat = 'body';
  var icons = {};

  function readStore() {
    try { return JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function read() { wear = normalize(readStore()); return wear; }
  try { if (root.localStorage) read(); } catch (e) {}

  function persist() {
    wear.updated = Date.now();
    wear.v = 2;
    wear.hair = HAIR_BACK[wear.parts.hair] || 'ponytail';
    wear.glow = wear.colors.eye;
    wear.outfit = wear.colors.top;
    wear.colors.shirt = wear.colors.top;
    wear.colors.pants = wear.colors.bottom;
    try { root.localStorage.setItem(KEY, JSON.stringify(wear)); } catch (e) {}
    try { var ch = new root.BroadcastChannel('zdash-char'); ch.postMessage({ v: 2 }); ch.close(); } catch (e2) {}
    icons = {};
    if (api.onChange) api.onChange(wear);
  }
  function pushUndo() {
    undo.push(JSON.stringify({ gender: wear.gender, parts: wear.parts, colors: wear.colors, active: wear.active }));
    if (undo.length > 24) undo.shift();
  }
  function applySnap(snap) {
    wear.gender = snap.gender === 'male' ? 'male' : 'female';
    wear.parts = clone(snap.parts);
    wear.colors = clone(snap.colors);
    wear.active = snap.active || wear.active;
    persist();
  }
  function key() { return wear.gender + '|' + JSON.stringify(wear.parts) + '|' + JSON.stringify(wear.colors); }
  function heightRatio() { return span(wear.parts).ratio; }

  function paintJoints(ctx, J, project, parts, colors) {
    var P = {}, items = [];
    for (var k in J) {
      var p = J[k];
      if (!p || p.length !== 3) continue;
      var s = project(p[0], p[1], p[2]);
      if (s) P[k] = s;
    }
    function px(name, meters) {
      var q = P[name];
      if (!q) return 4;
      return Math.max(1.6, meters * (q[3] || 360) / Math.max(0.25, q[2]));
    }
    function add(z, fn) { items.push({ z: z, fn: fn }); }
    function capsule(a, b, meters, fill) {
      if (!P[a] || !P[b]) return;
      add((P[a][2] + P[b][2]) * 0.5, function () {
        var w = (px(a, meters) + px(b, meters));
        ctx.lineCap = 'round';
        ctx.strokeStyle = STRIP;
        ctx.lineWidth = w + 1.5;
        ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke();
        ctx.strokeStyle = fill;
        ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke();
      });
    }
    var skin = colors.skin, top = colors.top, bottom = colors.bottom, shoe = colors.shoes;
    var hand = colors.hands;
    var legFill = bottom;
    capsule('hipL', 'kneeL', 0.055, legFill);
    capsule('kneeL', 'ankleL', parts.bottom === 'shorts' || parts.bottom === 'skirt' ? 0.04 : 0.048, parts.bottom === 'shorts' || parts.bottom === 'skirt' ? skin : legFill);
    capsule('hipR', 'kneeR', 0.055, legFill);
    capsule('kneeR', 'ankleR', parts.bottom === 'shorts' || parts.bottom === 'skirt' ? 0.04 : 0.048, parts.bottom === 'shorts' || parts.bottom === 'skirt' ? skin : legFill);
    capsule('heelL', 'toeL', measures(parts).shoeR, shoe);
    capsule('heelR', 'toeR', measures(parts).shoeR, shoe);
    capsule('shoulderL', 'elbowL', 0.042, top);
    capsule('elbowL', 'wristL', 0.036, skin);
    capsule('wristL', 'handL', parts.hands === 'gloves' ? 0.04 : 0.034, hand);
    capsule('shoulderR', 'elbowR', 0.042, top);
    capsule('elbowR', 'wristR', 0.036, skin);
    capsule('wristR', 'handR', parts.hands === 'gloves' ? 0.04 : 0.034, hand);
    if (P.shoulderL && P.shoulderR && P.hipL && P.hipR) {
      add((P.shoulderL[2] + P.hipL[2]) * 0.5, function () {
        ctx.beginPath();
        ctx.moveTo(P.shoulderL[0], P.shoulderL[1]);
        ctx.lineTo(P.shoulderR[0], P.shoulderR[1]);
        ctx.lineTo(P.hipR[0], P.hipR[1]);
        ctx.lineTo(P.hipL[0], P.hipL[1]);
        ctx.closePath();
        ctx.fillStyle = top;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = STRIP;
        ctx.stroke();
      });
    }
    capsule('neck', 'head', 0.03, skin);
    if (parts.hair === 'ponytail' || parts.hair === 'long') capsule('pony0', 'pony1', parts.hair === 'long' ? 0.028 : 0.02, colors.hair);
    if (P.head) {
      add(P.head[2] - 0.02, function () {
        var r = px('head', measures(parts).headR);
        if (parts.top === 'hoodie') {
          ctx.fillStyle = top;
          ctx.beginPath(); ctx.arc(P.head[0], P.head[1] - r * 0.05, r * 1.12, 0, 7); ctx.fill();
        }
        ctx.fillStyle = colors.hair;
        ctx.beginPath(); ctx.arc(P.head[0], P.head[1] - r * 0.08, r * 1.02, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
        ctx.fillStyle = skin;
        ctx.beginPath(); ctx.arc(P.head[0], P.head[1], r, 0, 7); ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = STRIP; ctx.stroke();
        ctx.fillStyle = colors.hair;
        if (parts.hair === 'bob' || parts.hair === 'long') {
          ctx.beginPath(); ctx.ellipse(P.head[0], P.head[1] - r * 0.2, r * 1.05, r * 0.62, 0, Math.PI, Math.PI * 2); ctx.fill();
        } else if (parts.hair === 'ponytail') {
          ctx.beginPath(); ctx.ellipse(P.head[0], P.head[1] - r * 0.28, r * 0.95, r * 0.48, 0, Math.PI, Math.PI * 2); ctx.fill();
        }
        var showFace = P.nose && P.nose[2] < P.head[2] + r * 0.15;
        if (showFace) {
          ctx.fillStyle = '#f4a3c0';
          ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.arc(P.head[0] - r * 0.38, P.head[1] + r * 0.16, r * 0.14, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(P.head[0] + r * 0.38, P.head[1] + r * 0.16, r * 0.14, 0, 7); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = colors.eye;
          if (P.eyeL) { ctx.beginPath(); ctx.arc(P.eyeL[0], P.eyeL[1], Math.max(2, r * 0.12), 0, 7); ctx.fill(); }
          if (P.eyeR) { ctx.beginPath(); ctx.arc(P.eyeR[0], P.eyeR[1], Math.max(2, r * 0.12), 0, 7); ctx.fill(); }
          if (P.mouth) {
            ctx.strokeStyle = '#5a3040'; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.lineCap = 'round';
            ctx.beginPath(); ctx.arc(P.mouth[0], P.mouth[1], r * 0.22, 0.2, Math.PI - 0.2); ctx.stroke();
          }
        }
      });
    }
    items.sort(function (a, b) { return b.z - a.z; });
    ctx.save();
    ctx.shadowBlur = 0;
    for (var n = 0; n < items.length; n++) items[n].fn();
    ctx.restore();
  }

  function camera(cx, footY, scale, yaw) {
    return function (x, y, z) {
      var c = Math.cos(yaw), s = Math.sin(yaw);
      var xr = x * c + z * s, zr = -x * s + z * c;
      var Z = 2.7 - zr, f = scale;
      return [cx + xr * f / Z, footY - y * f / Z, Z, f];
    };
  }
  function drawAt(ctx, cx, footY, size, yaw, gait, phase) {
    var sp = span(wear.parts);
    var scale = size * 2.55 / sp.top;
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(62,230,255,.2)';
    ctx.beginPath(); ctx.ellipse(cx, footY, size * 0.22, 7, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(62,230,255,.35)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - size * 0.34, footY); ctx.lineTo(cx + size * 0.34, footY); ctx.stroke();
    paintJoints(ctx, buildJoints(gait, phase, wear.parts), camera(cx, footY, scale, yaw), wear.parts, wear.colors);
  }

  function makeCanvas(w, h) {
    var c = root.document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  function iconFor(slot, item) {
    var id = slot + ':' + item.id + ':' + (wear.colors[COLOR_OF[slot]] || '');
    if (icons[id]) return icons[id];
    var c = makeCanvas(48, 48), g = c.getContext('2d');
    var opt = { parts: clone(wear.parts), colors: clone(wear.colors) };
    opt.parts[slot] = item.id;
    g.fillStyle = '#12081c'; g.fillRect(0, 0, 48, 48);
    var saved = wear;
    wear = { parts: opt.parts, colors: opt.colors };
    paintJoints(g, buildJoints('idle', 0.2, opt.parts), camera(24, 44, 78, 0.4), opt.parts, opt.colors);
    wear = saved;
    icons[id] = c;
    return c;
  }

  var ui = {};
  function el(tag, cls, text) {
    var n = root.document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function renderUI() {
    if (!ui.list) return;
    ui.list.innerHTML = '';
    wear.outfits.forEach(function (o) {
      var b = el('button', wear.active === o.id ? 'on' : '', o.name);
      b.type = 'button';
      b.addEventListener('click', function () {
        pushUndo();
        var packed = packOutfit(o);
        if (!packed) return;
        wear.gender = packed.gender; wear.parts = packed.parts; wear.colors = packed.colors; wear.active = packed.id;
        persist(); renderUI();
      });
      ui.list.appendChild(b);
    });
    ui.tabs.innerHTML = '';
    CATS.forEach(function (c) {
      var b = el('button', cat === c.id ? 'on' : '', c.label);
      b.type = 'button';
      b.addEventListener('click', function () { cat = c.id; renderUI(); });
      ui.tabs.appendChild(b);
    });
    ui.sub.innerHTML = '';
    ui.sub.hidden = cat !== 'body';
    if (cat === 'body') {
      [['female', 'WOMAN'], ['male', 'MAN']].forEach(function (pair) {
        var b = el('button', wear.gender === pair[0] ? 'on' : '', pair[1]);
        b.type = 'button';
        b.addEventListener('click', function () { pushUndo(); wear.gender = pair[0]; persist(); renderUI(); });
        ui.sub.appendChild(b);
      });
    }
    ui.grid.innerHTML = '';
    if (cat === 'color') {
      ui.grid.appendChild(el('div', 'note', 'COLOR FOR ' + colorSlot.toUpperCase()));
      var wheel = makeCanvas(220, 220);
      var g = wheel.getContext('2d');
      PALETTE.forEach(function (col, i) {
        var a = i / PALETTE.length * Math.PI * 2 - Math.PI / 2;
        g.fillStyle = col;
        g.beginPath(); g.arc(110 + Math.cos(a) * 72, 110 + Math.sin(a) * 72, 16, 0, 7); g.fill();
        g.lineWidth = 2; g.strokeStyle = col === wear.colors[colorSlot] ? '#fff' : STRIP; g.stroke();
      });
      wheel.addEventListener('click', function (ev) {
        var r = wheel.getBoundingClientRect();
        var x = (ev.clientX - r.left) * (wheel.width / r.width) - 110;
        var y = (ev.clientY - r.top) * (wheel.height / r.height) - 110;
        var best = PALETTE[0], bd = 1e9;
        PALETTE.forEach(function (col, i) {
          var a = i / PALETTE.length * Math.PI * 2 - Math.PI / 2;
          var dx = x - Math.cos(a) * 72, dy = y - Math.sin(a) * 72, d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = col; }
        });
        pushUndo();
        wear.colors[colorSlot] = best;
        persist(); renderUI();
      });
      ui.grid.appendChild(wheel);
    } else {
      (ITEMS[cat] || []).forEach(function (item) {
        var b = el('button', wear.parts[cat] === item.id ? 'tile on' : 'tile');
        b.type = 'button';
        b.appendChild(iconFor(cat, item));
        b.appendChild(el('span', '', item.name));
        b.addEventListener('click', function () {
          pushUndo();
          wear.parts[cat] = item.id;
          colorSlot = COLOR_OF[cat] || 'top';
          wear.active = '';
          persist(); renderUI();
        });
        ui.grid.appendChild(b);
      });
    }
    ui.worn.innerHTML = '';
    ['body', 'hair', 'top', 'bottom', 'shoes', 'hands'].forEach(function (slot) {
      var id = wear.parts[slot], name = id.toUpperCase();
      (ITEMS[slot] || []).forEach(function (item) { if (item.id === id) name = item.name; });
      var chip = el('div', 'chip');
      var x = el('button', 'x', 'X');
      x.type = 'button';
      x.setAttribute('aria-label', 'Remove ' + slot + ' ' + name);
      x.addEventListener('click', function () {
        pushUndo();
        wear.parts[slot] = partsOf(wear.gender)[slot];
        persist(); renderUI();
      });
      chip.appendChild(el('span', '', name));
      chip.appendChild(x);
      ui.worn.appendChild(chip);
    });
  }

  function mount() {
    if (!root.document || root.document.getElementById('closet')) return;
    var q = new URLSearchParams(root.location && root.location.search || '');
    if (q.get('yaw')) yaw = parseFloat(q.get('yaw')) || 0;
    if (q.get('outfit')) {
      wear.outfits.forEach(function (o) {
        if (o.id === q.get('outfit') || String(o.name).toLowerCase() === q.get('outfit').toLowerCase()) {
          var p = packOutfit(o);
          if (!p) return;
          wear.gender = p.gender; wear.parts = p.parts; wear.colors = p.colors; wear.active = p.id;
        }
      });
    }
    var css = el('style');
    css.textContent = [
      '#closet,#closet *{box-sizing:border-box}',
      '#closet{position:fixed;inset:0;z-index:6;display:grid;grid-template-columns:minmax(112px,18%) minmax(0,1fr) minmax(210px,34%);grid-template-rows:minmax(0,1fr) auto;gap:8px;padding:8px;pointer-events:none;color:#f4ecff;font-family:system-ui,sans-serif}',
      '#closet>*{pointer-events:auto;min-width:0;min-height:0}',
      '#clOutfits,#clCat,#clWorn{background:rgba(7,1,15,.88);border:1px solid rgba(62,230,255,.45);border-radius:12px}',
      '#clOutfits,#clCat{display:flex;flex-direction:column;padding:8px;gap:8px}',
      '#clOutfits h2{margin:0;font-size:12px;letter-spacing:.12em;text-align:center;color:#3ee6ff}',
      '#clList,#clGrid,#clTabs,#clSub,#clWorn{display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;justify-content:center}',
      '#clSub[hidden]{display:none !important}',
      '#clList,#clGrid{overflow:auto;flex:1}',
      '#closet button{font:700 11px/1.15 system-ui,sans-serif;color:#fff;background:#140818;border:1px solid #3ee6ff;border-radius:999px;padding:6px 8px;cursor:pointer;text-decoration:none;text-align:center;display:inline-flex;align-items:center;justify-content:center;min-height:32px}',
      '#closet button.on{background:#3ee6ff;color:#041018}',
      '#closet button span{text-align:center;text-decoration:none;width:100%;white-space:normal}',
      '#clGrid button.tile{flex:1 1 88px;max-width:120px;min-height:86px;border-radius:12px;flex-direction:column;padding:4px}',
      '#clGrid canvas{width:44px;height:44px;display:block}',
      '#clStage{pointer-events:none;position:relative}',
      '#clTools{pointer-events:auto;position:absolute;left:0;right:0;bottom:0;display:flex;flex-wrap:wrap;gap:8px;justify-content:center}',
      '#clWorn{grid-column:1 / -1;display:flex;flex-wrap:nowrap;gap:8px;padding:6px;overflow-x:auto;align-items:center;max-height:56px}',
      '#clWorn .chip{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,79,216,.7);border-radius:999px;padding:2px 4px 2px 8px;min-height:36px}',
      '#clWorn .chip span{font:700 11px/1.15 system-ui,sans-serif;text-align:center;min-width:36px}',
      '#clWorn .x{min-width:32px;min-height:32px;padding:0}',
      '#clName{flex:1;min-width:0;background:#07010f;color:#fff;border:1px solid #3ee6ff;border-radius:999px;padding:6px 8px;font:700 11px system-ui,sans-serif;text-align:center}',
      '#clSaveRow{display:flex;gap:8px}',
      '.note{width:100%;text-align:center;font:700 11px/1.2 system-ui,sans-serif;color:#ffe14d}',
      'body.closet-on #top,body.closet-on #panel,body.closet-on #fit{display:none !important}',
      '@media (max-width:760px), (max-height:420px){#closet{grid-template-columns:minmax(96px,22%) minmax(0,1fr) minmax(150px,40%);padding:6px;gap:8px}#closet button{font-size:11px;padding:4px 6px}}'
    ].join('');
    root.document.head.appendChild(css);
    var rootEl = el('div'); rootEl.id = 'closet';
    var left = el('aside'); left.id = 'clOutfits';
    left.appendChild(el('h2', '', 'MY OUTFITS'));
    ui.list = el('div'); ui.list.id = 'clList'; left.appendChild(ui.list);
    var saveRow = el('div'); saveRow.id = 'clSaveRow';
    ui.name = el('input'); ui.name.id = 'clName'; ui.name.maxLength = 18; ui.name.placeholder = 'Name';
    var save = el('button', '', 'SAVE'); save.type = 'button'; save.id = 'clSave';
    save.addEventListener('click', function () {
      var name = (ui.name.value || '').trim() || ('Look ' + (wear.outfits.length + 1));
      pushUndo();
      var id = 'u' + Date.now().toString(36);
      wear.outfits.push({ id: id, name: name.slice(0, 18), gender: wear.gender, parts: clone(wear.parts), colors: clone(wear.colors) });
      wear.active = id; ui.name.value = '';
      persist(); renderUI();
    });
    saveRow.appendChild(ui.name); saveRow.appendChild(save); left.appendChild(saveRow);
    var stage = el('div'); stage.id = 'clStage';
    var tools = el('div'); tools.id = 'clTools';
    [['clRot', 'ROTATE'], ['clUndo', 'UNDO'], ['clReset', 'RESET']].forEach(function (pair) {
      var b = el('button', '', pair[1]); b.type = 'button'; b.id = pair[0]; tools.appendChild(b);
    });
    stage.appendChild(tools);
    var right = el('aside'); right.id = 'clCat';
    ui.tabs = el('div'); ui.tabs.id = 'clTabs';
    ui.sub = el('div'); ui.sub.id = 'clSub';
    ui.grid = el('div'); ui.grid.id = 'clGrid';
    right.appendChild(ui.tabs); right.appendChild(ui.sub); right.appendChild(ui.grid);
    ui.worn = el('div'); ui.worn.id = 'clWorn';
    var pets = el('button', '', 'PETS'); pets.type = 'button'; pets.id = 'clPets';
    pets.addEventListener('click', function () { root.document.body.classList.remove('closet-on'); });
    tools.appendChild(pets);
    tools.querySelector('#clRot').addEventListener('click', function () { yaw += Math.PI / 4; });
    tools.querySelector('#clUndo').addEventListener('click', function () { var s = undo.pop(); if (!s) return; applySnap(JSON.parse(s)); renderUI(); });
    tools.querySelector('#clReset').addEventListener('click', function () {
      pushUndo();
      var day = starters()[0];
      wear.parts = clone(day.parts); wear.colors = clone(day.colors); wear.active = 'everyday';
      persist(); renderUI();
    });
    rootEl.appendChild(left); rootEl.appendChild(stage); rootEl.appendChild(right); rootEl.appendChild(ui.worn);
    root.document.body.appendChild(rootEl);
    root.document.body.classList.add('closet-on');
    renderUI();
  }

  function frame(ctx, w, h) {
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#07010f';
    ctx.fillRect(0, 0, w, h);
    var stage = root.document.getElementById('clStage');
    var x = w * 0.5, y = h * 0.78, size = Math.min(w, h) * 0.62;
    if (stage) {
      var r = stage.getBoundingClientRect();
      var tools = root.document.getElementById('clTools');
      var tb = tools ? tools.getBoundingClientRect().height + 8 : 0;
      x = r.left + r.width / 2;
      size = Math.max(90, Math.min(r.width * 0.9, (r.height - tb) * 0.92));
      y = r.top + (r.height - tb) * 0.9;
    }
    var t = root.performance ? root.performance.now() / 1000 : 0;
    drawAt(ctx, x, y, size, yaw, 'idle', t * 0.35);
    ctx.restore();
  }
  function poseFrame(ctx, w, h) {
    var q = new URLSearchParams(root.location && root.location.search || '');
    var pose = q.get('pose') || 'front';
    var ang = pose === 'side' ? Math.PI / 2 : pose === 'back' ? Math.PI : 0;
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#07010f';
    ctx.fillRect(0, 0, w, h);
    drawAt(ctx, w * 0.5, h * 0.9, Math.min(w, h) * 0.78, ang, 'idle', 0.2);
    ctx.restore();
  }
  function paintStrip(ctx, w, h) {
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#07010f';
    ctx.fillRect(0, 0, w, h);
    var n = 6;
    var sp = span(wear.parts);
    var markL = worldSoleZ(0, 'L');
    var markR = worldSoleZ(0.5, 'R');
    ctx.font = '700 12px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < n; i++) {
      var phase = i / n;
      var cx = (i + 0.5) * w / n;
      var cell = w / n;
      var size = Math.min(cell * 0.92, h * 0.72);
      var footY = h * 0.82;
      var scale = size * 2.55 / sp.top;
      function gx(worldZ) { return cx + (worldZ - phase * STRIDE) * scale / 2.7; }
      drawAt(ctx, cx, footY, size, Math.PI / 2, 'walk', phase);
      ctx.lineWidth = 3;
      var lx = gx(markL);
      if (Math.abs(lx - cx) < cell * 0.46) {
        ctx.strokeStyle = '#fff04d';
        ctx.beginPath(); ctx.moveTo(lx, footY - 18); ctx.lineTo(lx, footY + 6); ctx.stroke();
      }
      var rx = gx(markR);
      if (Math.abs(rx - cx) < cell * 0.46) {
        ctx.strokeStyle = '#7cff4f';
        ctx.beginPath(); ctx.moveTo(rx, footY - 18); ctx.lineTo(rx, footY + 6); ctx.stroke();
      }
      ctx.fillStyle = '#d7fff8';
      ctx.fillText('STEP ' + (i + 1), cx, 16);
    }
    ctx.fillStyle = '#b7fff0';
    ctx.font = '600 12px system-ui,sans-serif';
    ctx.fillText('Yellow stays under the left foot while it is planted. Green is the right foot.', w * 0.5, h - 16);
    ctx.restore();
  }
  function paintWorld(ctx, spec, project, yaw, origin) {
    var gait = spec && spec.gait || 'idle';
    var phase = spec && typeof spec.phase === 'number' ? spec.phase : 0;
    if (gait !== 'walk' && gait !== 'run') gait = 'idle';
    var J = buildJoints(gait, phase, wear.parts);
    var o = origin || { x: 0, y: 0, z: 0 };
    var c = Math.cos(yaw || 0), s = Math.sin(yaw || 0);
    paintJoints(ctx, J, function (x, y, z) {
      return project(o.x + x * c + z * s, o.y + y, o.z - x * s + z * c);
    }, wear.parts, wear.colors);
  }

  var api = {
    wear: function () { return wear; },
    key: key,
    heightRatio: heightRatio,
    metrics: function (parts) { return span(parts || wear.parts); },
    normalize: normalize,
    joints: function (gait, phase) { return buildJoints(gait || 'idle', phase || 0, wear.parts); },
    worldSoleZ: worldSoleZ,
    stride: STRIDE,
    paintWorld: paintWorld,
    paintStrip: paintStrip,
    poseFrame: poseFrame,
    setGender: function (g) { pushUndo(); wear.gender = g === 'male' ? 'male' : 'female'; persist(); renderUI(); },
    patch: function (o) {
      if (!o) return wear;
      if (o.gender) wear.gender = o.gender === 'male' ? 'male' : 'female';
      if (o.glow) { wear.colors.eye = o.glow; wear.colors.top = o.glow; }
      if (o.hair && HAIR_FWD[o.hair]) wear.parts.hair = HAIR_FWD[o.hair];
      persist();
      return wear;
    },
    mount: mount,
    frame: frame,
    editing: function () { return !!(root.document && root.document.body && root.document.body.classList.contains('closet-on')); },
    onChange: null,
    slow: function () { return SLOW; }
  };
  root.CHARCLOSET = api;
  if (root.addEventListener) root.addEventListener('storage', function (e) { if (!e.key || e.key === KEY) { read(); renderUI(); } });
})(typeof window !== 'undefined' ? window : globalThis);
