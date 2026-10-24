/* Character closet. Our own flat shapes: big head, short body, swap-on parts.
   No bloom. Sprites are baked once per outfit, yaw and step, then reused. */
(function (root) {
  'use strict';
  var KEY = 'zdash.char.v1';
  var STRIP = '#3ee6ff';
  var CATS = [
    { id: 'body', label: 'BODY' },
    { id: 'face', label: 'FACE' },
    { id: 'hair', label: 'HAIR' },
    { id: 'shirt', label: 'SHIRT' },
    { id: 'pants', label: 'PANTS' },
    { id: 'shoes', label: 'SHOES' },
    { id: 'hats', label: 'HATS' },
    { id: 'extras', label: 'EXTRAS' },
    { id: 'color', label: 'COLOR' }
  ];
  var SUBS = {
    body: [['head', 'HEAD'], ['body', 'TORSO'], ['arms', 'ARMS'], ['legs', 'LEGS'], ['hands', 'HANDS']],
    face: [['face', 'FACE'], ['blush', 'BLUSH']]
  };
  var ITEMS = {
    head: [{ id: 'round', name: 'ROUND' }, { id: 'square', name: 'SQUARE' }, { id: 'tall', name: 'TALL' }],
    body: [{ id: 'standard', name: 'STANDARD' }, { id: 'short', name: 'SHORT' }],
    arms: [{ id: 'block', name: 'BLOCKS' }, { id: 'short', name: 'SHORT' }],
    legs: [{ id: 'standard', name: 'STANDARD' }, { id: 'short', name: 'SHORT' }],
    hands: [{ id: 'mittens', name: 'MITTENS' }, { id: 'fingers', name: 'FINGERS' }, { id: 'gloves', name: 'GLOVES' }],
    face: [{ id: 'smile', name: 'SMILE' }, { id: 'grin', name: 'GRIN' }, { id: 'wink', name: 'WINK' }],
    blush: [{ id: 'none', name: 'NONE' }, { id: 'soft', name: 'SOFT' }, { id: 'round', name: 'ROUND' }],
    hair: [{ id: 'bob', name: 'BOB' }, { id: 'ponytail', name: 'PONY' }, { id: 'curls', name: 'CURLS' }, { id: 'long', name: 'LONG' }],
    shirt: [{ id: 'tee', name: 'TEE' }, { id: 'hoodie', name: 'HOODIE' }],
    pants: [{ id: 'jeans', name: 'JEANS' }, { id: 'shorts', name: 'SHORTS' }],
    shoes: [{ id: 'sneakers', name: 'SNEAKERS' }, { id: 'boots', name: 'BOOTS' }, { id: 'none', name: 'NONE' }],
    hat: [{ id: 'none', name: 'NONE' }, { id: 'cap', name: 'CAP' }, { id: 'beanie', name: 'BEANIE' }],
    accessory: [{ id: 'none', name: 'NONE' }, { id: 'glasses', name: 'GLASSES' }, { id: 'scarf', name: 'SCARF' }]
  };
  var SLOT_CAT = { head: 'body', body: 'body', arms: 'body', legs: 'body', hands: 'body', face: 'face', blush: 'face', hair: 'hair', shirt: 'shirt', pants: 'pants', shoes: 'shoes', hat: 'hats', accessory: 'extras' };
  var COLOR_OF = { head: 'skin', body: 'skin', arms: 'skin', legs: 'skin', hands: 'hands', face: 'eye', blush: 'blush', hair: 'hair', shirt: 'shirt', pants: 'pants', shoes: 'shoes', hat: 'hat', accessory: 'shirt' };
  var PALETTE = ['#f2c7a5', '#e0a070', '#8d5524', '#c68642', '#3ee6ff', '#ff3df2', '#7cff4f', '#ffb020', '#ff4d5e', '#b48cff', '#fff04d', '#ffffff', '#1c2430', '#2a6fdb', '#c4522a', '#f4a3c0', '#3a2418', '#222222'];
  var HAIR_BACK = { bob: 'bob', ponytail: 'ponytail', curls: 'buns', long: 'long' };
  var HAIR_FWD = { short: 'bob', spiky: 'curls', bob: 'bob', long: 'long', ponytail: 'ponytail', buns: 'curls' };

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
      head: 'round', body: 'standard', arms: 'block', legs: 'standard', hands: 'mittens',
      face: 'smile', blush: 'soft', hair: gender === 'male' ? 'bob' : 'ponytail',
      shirt: 'tee', pants: 'jeans', shoes: 'sneakers', hat: 'none', accessory: 'none'
    };
  }
  function colorsOf() {
    return { skin: '#f2c7a5', hair: '#3a2418', shirt: '#ff3df2', pants: '#2a6fdb', shoes: '#ffffff', hat: '#c4522a', hands: '#f2c7a5', eye: '#3ee6ff', blush: '#f4a3c0' };
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function preset(id, name, gender, parts, colors) {
    var p = partsOf(gender), c = colorsOf();
    if (parts) for (var k in parts) p[k] = parts[k];
    if (colors) for (var k2 in colors) c[k2] = colors[k2];
    return { id: id, name: name, gender: gender, parts: p, colors: c };
  }
  function starters() {
    return [
      preset('everyday', 'Everyday', 'female', {}, {}),
      preset('autumn', 'Autumn', 'female', { hair: 'long', shirt: 'hoodie', shoes: 'boots', hat: 'beanie', hands: 'mittens' }, { shirt: '#c4522a', pants: '#1c2430', shoes: '#3a2418', hat: '#c4522a', hair: '#6b3a22' }),
      preset('swimsuit', 'Swimsuit', 'female', { hair: 'bob', shirt: 'tee', pants: 'shorts', shoes: 'none', hat: 'none', blush: 'round' }, { shirt: '#3ee6ff', pants: '#ff3df2', hair: '#1c2430' }),
      preset('tiny', 'Tiny', 'female', { head: 'round', body: 'short', arms: 'short', legs: 'short', hair: 'curls', shirt: 'tee', pants: 'shorts', hands: 'mittens' }, { shirt: '#fff04d', pants: '#7cff4f', hair: '#ffb020' })
    ];
  }
  function blank() {
    var s = starters()[0];
    return { v: 2, gender: 'female', parts: s.parts, colors: s.colors, outfits: starters(), active: 'everyday', hair: 'ponytail', glow: '#3ee6ff', outfit: '#ff3df2', updated: 0 };
  }
  function known(slot, id) {
    var list = ITEMS[slot] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return true;
    return false;
  }
  function normalize(raw) {
    if (!raw || typeof raw !== 'object') return blank();
    var base = blank();
    var src = raw;
    if (src.v === 2 && src.parts) {
      base.gender = src.gender === 'male' ? 'male' : 'female';
      for (var k in base.parts) if (known(k, src.parts[k])) base.parts[k] = src.parts[k];
      if (src.colors) for (var c in base.colors) if (typeof src.colors[c] === 'string' && /^#[0-9a-fA-F]{6}$/.test(src.colors[c])) base.colors[c] = src.colors[c];
      if (Array.isArray(src.outfits) && src.outfits.length) base.outfits = src.outfits.map(packOutfit).filter(Boolean);
      if (!base.outfits.length) base.outfits = starters();
      base.active = src.active || base.outfits[0].id;
    } else if (src.v === 1 || src.gender || src.hair || src.glow || src.outfit) {
      base.gender = src.gender === 'male' ? 'male' : 'female';
      base.parts.hair = HAIR_FWD[src.hair] || base.parts.hair;
      var glow = (typeof src.glow === 'string' && src.glow) || (typeof src.outfit === 'string' && src.outfit) || '#ff3df2';
      if (!/^#/.test(glow)) glow = '#ff3df2';
      base.colors.shirt = glow;
      base.colors.eye = glow;
      var mine = preset('mine', 'My Look', base.gender, base.parts, base.colors);
      base.outfits = [mine].concat(starters());
      base.active = 'mine';
      base.parts = clone(mine.parts);
      base.colors = clone(mine.colors);
    } else return blank();
    base.hair = HAIR_BACK[base.parts.hair] || 'ponytail';
    base.glow = base.colors.eye;
    base.outfit = base.colors.shirt;
    base.v = 2;
    return base;
  }
  function packOutfit(o) {
    if (!o || !o.id || !o.parts) return null;
    var gender = o.gender === 'male' ? 'male' : 'female';
    var parts = partsOf(gender);
    var colors = colorsOf();
    for (var k in parts) if (known(k, o.parts[k])) parts[k] = o.parts[k];
    if (o.colors) for (var c in colors) if (typeof o.colors[c] === 'string' && /^#[0-9a-fA-F]{6}$/.test(o.colors[c])) colors[c] = o.colors[c];
    return { id: String(o.id).slice(0, 24), name: String(o.name || 'Look').slice(0, 18), gender: gender, parts: parts, colors: colors };
  }
  function metrics(parts) {
    var leg = parts.legs === 'short' ? 0.28 : 0.36;
    var torso = parts.body === 'short' ? 0.18 : 0.24;
    var head = parts.head === 'tall' ? 0.26 : 0.22;
    var arm = parts.arms === 'short' ? 0.16 : 0.22;
    var sum = leg + torso + 0.04 + head;
    return { leg: leg, torso: torso, head: head, arm: arm, neck: 0.04, sum: sum, ratio: head / sum };
  }

  var wear = blank();
  var undo = [];
  var yaw = 0.4;
  var colorSlot = 'shirt';
  var cat = 'body';
  var sub = 'head';
  var icons = {};
  var sprites = [];
  var spriteMap = {};

  function readStore() {
    try { return JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function read() {
    wear = normalize(readStore());
    return wear;
  }
  try { if (root.localStorage) read(); } catch (e) {}

  function persist() {
    wear.updated = Date.now();
    wear.v = 2;
    wear.hair = HAIR_BACK[wear.parts.hair] || 'ponytail';
    wear.glow = wear.colors.eye;
    wear.outfit = wear.colors.shirt;
    try { root.localStorage.setItem(KEY, JSON.stringify(wear)); } catch (e) {}
    try {
      var ch = new root.BroadcastChannel('zdash-char');
      ch.postMessage({ v: 2 });
      ch.close();
    } catch (e2) {}
    spriteMap = {};
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
  function key() {
    return wear.gender + '|' + JSON.stringify(wear.parts) + '|' + JSON.stringify(wear.colors);
  }
  function heightRatio() { return metrics(wear.parts).ratio; }

  function makeCanvas(w, h) {
    var c = root.document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function fillStroke(g, fill) {
    g.fillStyle = fill;
    g.fill();
    g.lineWidth = 2;
    g.strokeStyle = STRIP;
    g.stroke();
  }

  function paintWear(g, w, h, pose, yawRad, opt) {
    var parts = opt.parts, col = opt.colors, m = metrics(parts);
    var scale = h / (m.sum + 0.08);
    var cx = w * 0.5, foot = h * 0.9;
    function P(x, y, z) {
      var c = Math.cos(yawRad), s = Math.sin(yawRad);
      var xr = x * c + z * s, zr = -x * s + z * c;
      return [cx + xr * scale, foot - y * scale, zr];
    }
    var swing = pose ? 0.06 : 0;
    var hipY = m.leg, chestY = hipY + m.torso, headY = chestY + m.neck + m.head * 0.45;
    var armY = chestY + m.torso * 0.35;
    var items = [];
    function add(z, fn) { items.push({ z: z, fn: fn }); }
    function limb(x0, y0, z0, x1, y1, z1, rad, fill) {
      var a = P(x0, y0, z0), b = P(x1, y1, z1);
      add((a[2] + b[2]) * 0.5, function () {
        g.lineCap = 'round';
        g.strokeStyle = STRIP;
        g.lineWidth = rad * scale * 2 + 2;
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        g.strokeStyle = fill;
        g.lineWidth = rad * scale * 2;
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      });
    }
    var skin = col.skin, shirt = col.shirt, pants = col.pants;
    limb(-0.07, hipY, 0, -0.07 - swing, 0.02, swing, 0.055, pants);
    limb(0.07, hipY, 0, 0.07 + swing, 0.02, -swing, 0.055, pants);
    if (parts.shoes !== 'none') {
      limb(-0.07 - swing, 0.04, 0, -0.07 - swing, 0.0, 0.08, 0.04, col.shoes);
      limb(0.07 + swing, 0.04, 0, 0.07 + swing, 0.0, 0.08, 0.04, col.shoes);
    }
    limb(-0.16, armY, 0, -0.2, armY - m.arm * 0.55, 0.02, 0.04, shirt);
    limb(0.16, armY, 0, 0.2, armY - m.arm * 0.55, 0.02, 0.04, shirt);
    var handFill = parts.hands === 'gloves' ? col.hands : (parts.hands === 'mittens' ? col.hands : skin);
    var hy = armY - m.arm;
    [-0.2, 0.2].forEach(function (x) {
      var p = P(x, hy, 0.02);
      add(p[2], function () {
        if (parts.hands === 'fingers') {
          g.strokeStyle = skin;
          g.lineWidth = 3;
          g.lineCap = 'round';
          for (var i = -1; i <= 1; i++) {
            g.beginPath(); g.moveTo(p[0] + i * 3, p[1]); g.lineTo(p[0] + i * 4, p[1] + 10); g.stroke();
          }
        } else {
          g.fillStyle = handFill;
          g.beginPath(); g.arc(p[0], p[1] + 4, parts.hands === 'gloves' ? 8 : 7, 0, 7); g.fill();
          g.strokeStyle = STRIP; g.lineWidth = 2; g.stroke();
        }
        g.strokeStyle = STRIP;
        g.lineWidth = 3;
        g.beginPath(); g.moveTo(p[0] - 6, p[1] - 6); g.lineTo(p[0] + 6, p[1] - 6); g.stroke();
      });
    });
    var torso = [P(-0.12, hipY, 0), P(0.12, hipY, 0), P(0.14, chestY, 0), P(-0.14, chestY, 0)];
    add(0, function () {
      g.beginPath();
      torso.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
      g.closePath();
      fillStroke(g, shirt);
    });
    if (parts.shirt === 'hoodie') {
      var hood = P(0, headY + m.head * 0.15, -0.04);
      add(hood[2] - 0.01, function () {
        g.fillStyle = shirt;
        g.beginPath(); g.arc(hood[0], hood[1], m.head * scale * 0.62, 0, 7); g.fill();
      });
    }
    var hp = P(0, headY, 0);
    var hr = m.head * scale * (parts.head === 'square' ? 0.42 : 0.48);
    add(hp[2], function () {
      g.fillStyle = skin;
      g.beginPath();
      if (parts.head === 'square') roundRect(g, hp[0] - hr, hp[1] - hr, hr * 2, hr * 2.05, 8);
      else g.ellipse(hp[0], hp[1], hr * (parts.head === 'tall' ? 0.82 : 1), hr * (parts.head === 'tall' ? 1.18 : 1), 0, 0, 7);
      fillStroke(g, skin);
      g.fillStyle = col.hair;
      if (parts.hair === 'bob' || parts.hair === 'long') {
        g.beginPath(); g.ellipse(hp[0], hp[1] - hr * 0.15, hr * 1.05, hr * 0.72, 0, Math.PI, Math.PI * 2); g.fill();
      }
      if (parts.hair === 'ponytail' || parts.hair === 'long') {
        g.strokeStyle = col.hair; g.lineWidth = parts.hair === 'long' ? 8 : 6; g.lineCap = 'round';
        g.beginPath(); g.moveTo(hp[0], hp[1] + hr * 0.2); g.lineTo(hp[0] + 6, hp[1] + hr * (parts.hair === 'long' ? 1.7 : 1.05)); g.stroke();
      }
      if (parts.hair === 'curls') {
        [[-hr, 0], [hr, 0], [0, -hr]].forEach(function (o) {
          g.beginPath(); g.arc(hp[0] + o[0], hp[1] + o[1], hr * 0.38, 0, 7); g.fill();
        });
      }
      if (parts.hat === 'cap' || parts.hat === 'beanie') {
        g.fillStyle = col.hat;
        g.fillRect(hp[0] - hr, hp[1] - hr * 1.05, hr * 2, hr * 0.45);
        if (parts.hat === 'cap') g.fillRect(hp[0] - hr * 0.2, hp[1] - hr * 0.7, hr * 1.3, hr * 0.18);
      }
      if (parts.blush !== 'none') {
        g.fillStyle = col.blush;
        g.globalAlpha = 0.85;
        g.beginPath(); g.arc(hp[0] - hr * 0.42, hp[1] + hr * 0.12, parts.blush === 'round' ? 5 : 3.5, 0, 7); g.fill();
        g.beginPath(); g.arc(hp[0] + hr * 0.42, hp[1] + hr * 0.12, parts.blush === 'round' ? 5 : 3.5, 0, 7); g.fill();
        g.globalAlpha = 1;
      }
      g.fillStyle = col.eye;
      g.beginPath(); g.arc(hp[0] - hr * 0.28, hp[1] - hr * 0.05, 3.2, 0, 7); g.fill();
      if (parts.face === 'wink') {
        g.strokeStyle = col.eye; g.lineWidth = 2;
        g.beginPath(); g.moveTo(hp[0] + hr * 0.16, hp[1] - hr * 0.05); g.lineTo(hp[0] + hr * 0.4, hp[1] - hr * 0.05); g.stroke();
      } else {
        g.beginPath(); g.arc(hp[0] + hr * 0.28, hp[1] - hr * 0.05, 3.2, 0, 7); g.fill();
      }
      g.strokeStyle = '#5a3040'; g.lineWidth = 2; g.lineCap = 'round';
      g.beginPath();
      if (parts.face === 'grin') g.arc(hp[0], hp[1] + hr * 0.18, hr * 0.28, 0.15, Math.PI - 0.15);
      else g.arc(hp[0], hp[1] + hr * 0.22, hr * 0.18, 0.2, Math.PI - 0.2);
      g.stroke();
      if (parts.accessory === 'glasses') {
        g.strokeStyle = STRIP; g.lineWidth = 2;
        g.strokeRect(hp[0] - hr * 0.5, hp[1] - hr * 0.22, hr * 0.34, hr * 0.22);
        g.strokeRect(hp[0] + hr * 0.16, hp[1] - hr * 0.22, hr * 0.34, hr * 0.22);
      }
      if (parts.accessory === 'scarf') {
        g.fillStyle = col.shirt;
        g.fillRect(hp[0] - hr * 0.55, hp[1] + hr * 0.85, hr * 1.1, 8);
      }
    });
    items.sort(function (a, b) { return b.z - a.z; });
    for (var i = 0; i < items.length; i++) items[i].fn();
  }

  function sprite(yawRad, pose) {
    var buckets = SLOW ? 4 : 8;
    var a = yawRad % (Math.PI * 2); if (a < 0) a += Math.PI * 2;
    var bucket = Math.round(a / (Math.PI * 2) * buckets) % buckets;
    var frame = SLOW ? 0 : (pose ? 1 : 0);
    var id = key() + '|' + bucket + '|' + frame;
    if (spriteMap[id]) return spriteMap[id];
    var w = SLOW ? 96 : 180, h = SLOW ? 140 : 260;
    var c = makeCanvas(w, h);
    var g = c.getContext('2d');
    g.clearRect(0, 0, w, h);
    paintWear(g, w, h, frame, bucket / buckets * Math.PI * 2, wear);
    spriteMap[id] = c;
    sprites.push(id);
    if (sprites.length > (SLOW ? 12 : 48)) delete spriteMap[sprites.shift()];
    return c;
  }

  function iconFor(slot, item) {
    var id = slot + ':' + item.id + ':' + (wear.colors[COLOR_OF[slot]] || '');
    if (icons[id]) return icons[id];
    var c = makeCanvas(48, 48);
    var g = c.getContext('2d');
    g.fillStyle = '#12081c';
    g.fillRect(0, 0, 48, 48);
    var opt = { parts: clone(wear.parts), colors: clone(wear.colors) };
    opt.parts[slot] = item.id;
    paintWear(g, 48, 48, 0, 0.5, opt);
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
      b.addEventListener('click', function () { pushUndo(); var packed = packOutfit(o); if (!packed) return; wear.gender = packed.gender; wear.parts = packed.parts; wear.colors = packed.colors; wear.active = packed.id; persist(); renderUI(); });
      ui.list.appendChild(b);
    });
    ui.tabs.innerHTML = '';
    CATS.forEach(function (c) {
      var b = el('button', cat === c.id ? 'on' : '', c.label);
      b.type = 'button';
      b.addEventListener('click', function () { cat = c.id; if (SUBS[c.id]) sub = SUBS[c.id][0][0]; renderUI(); });
      ui.tabs.appendChild(b);
    });
    ui.sub.innerHTML = '';
    var subs = SUBS[cat];
    ui.sub.hidden = !subs;
    if (subs) {
      if (cat === 'body') {
        [['female', 'WOMAN'], ['male', 'MAN']].forEach(function (pair) {
          var b = el('button', wear.gender === pair[0] ? 'on' : '', pair[1]);
          b.type = 'button';
          b.addEventListener('click', function () { pushUndo(); wear.gender = pair[0]; persist(); renderUI(); });
          ui.sub.appendChild(b);
        });
      }
      subs.forEach(function (pair) {
        var b = el('button', sub === pair[0] ? 'on' : '', pair[1]);
        b.type = 'button';
        b.addEventListener('click', function () { sub = pair[0]; renderUI(); });
        ui.sub.appendChild(b);
      });
    }
    ui.grid.innerHTML = '';
    if (cat === 'color') {
      var note = el('div', 'note', 'COLOR FOR ' + colorSlot.toUpperCase());
      ui.grid.appendChild(note);
      var wheel = makeCanvas(220, 220);
      wheel.className = 'wheel';
      var g = wheel.getContext('2d');
      PALETTE.forEach(function (col, i) {
        var a = i / PALETTE.length * Math.PI * 2 - Math.PI / 2;
        g.fillStyle = col;
        g.beginPath();
        g.arc(110 + Math.cos(a) * 72, 110 + Math.sin(a) * 72, 16, 0, 7);
        g.fill();
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
        if (colorSlot === 'hands' && wear.parts.hands === 'mittens') wear.colors.hands = best;
        persist();
        renderUI();
      });
      ui.grid.appendChild(wheel);
    } else {
      var slot = subs ? sub : (cat === 'hats' ? 'hat' : cat === 'extras' ? 'accessory' : cat);
      (ITEMS[slot] || []).forEach(function (item) {
        var b = el('button', wear.parts[slot] === item.id ? 'tile on' : 'tile');
        b.type = 'button';
        b.appendChild(iconFor(slot, item));
        b.appendChild(el('span', '', item.name));
        b.addEventListener('click', function () {
          pushUndo();
          wear.parts[slot] = item.id;
          colorSlot = COLOR_OF[slot] || 'shirt';
          wear.active = '';
          persist();
          renderUI();
        });
        ui.grid.appendChild(b);
      });
    }
    ui.worn.innerHTML = '';
    var order = ['head', 'body', 'arms', 'legs', 'hands', 'face', 'blush', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'accessory'];
    order.forEach(function (slot) {
      var id = wear.parts[slot];
      if (id === 'none') return;
      var name = id.toUpperCase();
      (ITEMS[slot] || []).forEach(function (item) { if (item.id === id) name = item.name; });
      var chip = el('div', 'chip');
      var x = el('button', 'x', 'X');
      x.type = 'button';
      x.setAttribute('aria-label', 'Remove ' + slot + ' ' + name);
      x.addEventListener('click', function () {
        pushUndo();
        var fallback = partsOf(wear.gender)[slot];
        var canClear = slot === 'hat' || slot === 'accessory' || slot === 'shoes' || slot === 'blush';
        wear.parts[slot] = canClear ? 'none' : fallback;
        persist();
        renderUI();
      });
      chip.appendChild(el('span', '', name));
      chip.appendChild(x);
      ui.worn.appendChild(chip);
    });
  }

  function mount() {
    if (!root.document || root.document.getElementById('closet')) return;
    var q = new URLSearchParams(root.location && root.location.search || '');
    if (q.get('outfit')) {
      wear.outfits.forEach(function (o) { if (o.id === q.get('outfit') || o.name.toLowerCase() === q.get('outfit').toLowerCase()) { var p = packOutfit(o); wear.gender = p.gender; wear.parts = p.parts; wear.colors = p.colors; wear.active = p.id; } });
    }
    var css = el('style');
    css.textContent = [
      '#closet,#closet *{box-sizing:border-box}',
      '#closet{position:fixed;inset:0;z-index:6;display:grid;grid-template-columns:minmax(112px,18%) minmax(0,1fr) minmax(210px,34%);grid-template-rows:minmax(0,1fr) auto;gap:8px;padding:8px;pointer-events:none;color:#f4ecff;font-family:system-ui,sans-serif}',
      '#closet>*{pointer-events:auto;min-width:0;min-height:0}',
      '#clOutfits,#clCat,#clWorn{background:rgba(7,1,15,.88);border:1px solid rgba(62,230,255,.45);border-radius:12px}',
      '#clOutfits,#clCat{display:flex;flex-direction:column;padding:8px;gap:8px}',
      '#clOutfits h2,#clCat h2{margin:0;font-size:12px;letter-spacing:.12em;text-align:center;color:#3ee6ff}',
      '#clList,#clGrid,#clTabs,#clSub,#clWorn{display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;justify-content:center}',
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
    var rootEl = el('div');
    rootEl.id = 'closet';
    var left = el('aside');
    left.id = 'clOutfits';
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
      wear.active = id;
      ui.name.value = '';
      persist();
      renderUI();
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
      wear.parts = clone(day.parts); wear.colors = clone(day.colors); wear.gender = wear.gender || 'female'; wear.active = '';
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
    var x = w * 0.5, y = h * 0.72, size = Math.min(w, h) * 0.5;
    if (stage) {
      var r = stage.getBoundingClientRect();
      var tools = root.document.getElementById('clTools');
      var tb = tools ? tools.getBoundingClientRect().height + 8 : 0;
      x = r.left + r.width / 2;
      size = Math.max(80, Math.min(r.width * 0.78, (r.height - tb) * 0.86));
      y = r.top + (r.height - tb) * 0.92;
    }
    var bob = Math.sin((root.performance ? root.performance.now() : 0) / 700) * 3;
    var sp = sprite(yaw, 0);
    var dh = size, dw = dh * sp.width / sp.height;
    ctx.fillStyle = 'rgba(62,230,255,.18)';
    ctx.beginPath(); ctx.ellipse(x, y, dw * 0.28, 8, 0, 0, 7); ctx.fill();
    ctx.drawImage(sp, x - dw / 2, y - dh + bob, dw, dh);
    ctx.restore();
  }

  var api = {
    wear: function () { return wear; },
    key: key,
    heightRatio: heightRatio,
    metrics: metrics,
    normalize: normalize,
    sprite: sprite,
    setGender: function (g) { pushUndo(); wear.gender = g === 'male' ? 'male' : 'female'; persist(); renderUI(); },
    patch: function (o) {
      if (!o) return wear;
      if (o.gender) wear.gender = o.gender === 'male' ? 'male' : 'female';
      if (o.glow) { wear.colors.eye = o.glow; wear.colors.shirt = o.glow; }
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
