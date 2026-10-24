'use strict';
(function (g) {
  var GROUPS = [
    ['Grip', ['groundFric', 'groundSteer', 'slideK', 'slipMax', 'offRoad']],
    ['Drift', ['eBrakeSteer', 'eBrakeSlipMax', 'eBrakeSlipSlow', 'eBrakeDecel', 'eBrakeDrag']],
    ['E-brake', ['eBrakePivotMph', 'eBrakePivotDecel', 'eBrakeDonutV', 'eBrakeIn', 'eBrakeOut']],
    ['Jump', ['liftAccel', 'bounce', 'rebMax', 'rebK', 'skimMax', 'bumpSink']],
    ['Air', ['pitchRate', 'bankRate', 'turnK', 'airThrust', 'maxPitch', 'pitchResp', 'airCruiseMax']],
    ['NOS', ['nosBoost', 'airNosAccel', 'nosChunkT', 'nosFill', 'nosTank']],
    ['Gravity', ['gravityAir', 'gravityK', 'climbG', 'diveG', 'airSinkMax']]
  ];
  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function copy(src) {
    var o = {}, k;
    for (k in src) o[k] = src[k];
    return o;
  }
  function range(v) {
    var a = Math.abs(v);
    var min = v >= 0 ? 0 : -4 * a;
    var max = a === 0 ? 1 : 4 * a;
    var step = a >= 50 ? 1 : a >= 5 ? 0.1 : a >= 0.5 ? 0.01 : 0.001;
    return [min, max, step];
  }
  function readPresets() {
    try { return JSON.parse(g.localStorage.getItem('zdash.dev.presets') || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writePresets(map) {
    g.localStorage.setItem('zdash.dev.presets', JSON.stringify(map));
  }
  function mount(host, ctx) {
    var doc = host.ownerDocument;
    host.innerHTML = '';
    var game = ctx.game();
    if (!game || !game.ZD_OVR || !game.TUNE) {
      host.appendChild(el(doc, 'p', 'zd-msg', 'Physics tuner needs Neon World. This page is unchanged. The game is still running.'));
      return function () {};
    }
    var defaults = game.ZD_OVR.defaults();
    var draft = copy(defaults);
    try {
      var saved = JSON.parse(g.localStorage.getItem('zdash.dev.tuneDraft') || 'null');
      if (saved && typeof saved === 'object') {
        for (var k in saved) if (k in draft && typeof saved[k] === typeof draft[k]) draft[k] = saved[k];
      }
    } catch (e) {}
    var gui = null;
    var used = {};
    function remember() {
      try { g.localStorage.setItem('zdash.dev.tuneDraft', JSON.stringify(draft)); } catch (e) {}
    }
    function refresh() {
      if (!gui) return;
      gui.controllersRecursive().forEach(function (c) { c.updateDisplay(); });
    }
    function apply() {
      remember();
      game.ZD_OVR.set('tune', copy(draft));
    }
    function reset() {
      var d = game.ZD_OVR.defaults(), key;
      for (key in draft) if (key in d) draft[key] = d[key];
      if (gui) gui.reset();
      for (key in draft) if (key in d) draft[key] = d[key];
      refresh();
      game.ZD_OVR.clear('tune');
      try { g.localStorage.removeItem('zdash.dev.tuneDraft'); } catch (e) {}
    }
    var note = el(doc, 'p', 'zd-msg', 'Test only. Apply sends these numbers to this drive. Reset restores the real defaults. A speed cap, if applied, still wins on top speed. Nothing is written into tune.js or a normal visit.');
    var guiHost = el(doc, 'div', 'zd-gui');
    var name = el(doc, 'input');
    name.id = 'zd-preset-name';
    name.type = 'text';
    name.placeholder = 'Preset name';
    name.setAttribute('aria-label', 'Preset name');
    var list = el(doc, 'select');
    list.id = 'zd-presets';
    function refill() {
      var map = readPresets(), key, cur = list.value;
      list.innerHTML = '';
      var empty = el(doc, 'option', '', 'Presets');
      empty.value = '';
      list.appendChild(empty);
      for (key in map) {
        var o = el(doc, 'option', '', key);
        o.value = key;
        list.appendChild(o);
      }
      if (cur) list.value = cur;
    }
    function loadPreset(key) {
      var map = readPresets();
      var item = map[key];
      if (!item || !item.values) return;
      var k;
      for (k in item.values) if (k in draft) draft[k] = item.values[k];
      if (gui && item.gui) { try { gui.load(item.gui); } catch (e) {} }
      refresh();
      remember();
    }
    var row = el(doc, 'div', 'zd-row');
    function button(label, attr, fn) {
      var b = el(doc, 'button', 'zd-btn', label);
      b.type = 'button';
      b.setAttribute(attr[0], attr[1]);
      b.addEventListener('click', function () { try { fn(); } catch (e) { if (ctx.notify) ctx.notify(e); } });
      row.appendChild(b);
      return b;
    }
    button('Apply', ['data-apply', 'tune'], apply);
    button('Reset to defaults', ['data-reset', 'tune'], reset);
    button('Save preset', ['data-save-preset', '1'], function () {
      var id = (name.value || '').trim();
      if (!id) throw new Error('Name the preset first.');
      var map = readPresets();
      map[id] = { values: copy(draft), gui: gui ? gui.save() : null, t: Date.now() };
      writePresets(map);
      refill();
      list.value = id;
      remember();
    });
    button('Load', ['data-load-preset', '1'], function () {
      if (!list.value) throw new Error('Pick a preset to load.');
      loadPreset(list.value);
    });
    button('Share JSON', ['data-share-preset', '1'], function () {
      box.value = JSON.stringify(readPresets());
    });
    button('Delete', ['data-delete-preset', '1'], function () {
      if (!list.value) return;
      var map = readPresets();
      delete map[list.value];
      writePresets(map);
      refill();
    });
    var box = el(doc, 'textarea', 'zd-out');
    box.id = 'zd-tune-out';
    box.readOnly = true;
    host.appendChild(note);
    host.appendChild(guiHost);
    host.appendChild(name);
    host.appendChild(list);
    host.appendChild(row);
    host.appendChild(box);
    refill();
    function build() {
      gui = new g.lil.GUI({ container: guiHost, title: 'Physics', width: 300 });
      var seen = {};
      GROUPS.forEach(function (group) {
        var folder = gui.addFolder(group[0]);
        group[1].forEach(function (key) {
          if (!(key in draft) || typeof draft[key] !== 'number') return;
          seen[key] = true;
          var r = range(defaults[key]);
          folder.add(draft, key, r[0], r[1], r[2]).onChange(remember);
        });
      });
      var rest = gui.addFolder('Everything else');
      var key;
      for (key in draft) {
        if (seen[key]) continue;
        if (typeof draft[key] === 'number') {
          var r = range(defaults[key]);
          rest.add(draft, key, r[0], r[1], r[2]).onChange(remember);
        } else if (typeof draft[key] === 'boolean') {
          rest.add(draft, key).onChange(remember);
        }
      }
      rest.close();
    }
    var pending = g.lil ? Promise.resolve() : new Promise(function (resolve, reject) {
      var s = doc.createElement('script');
      s.src = ctx.asset('vendor/lil-gui.js');
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('lil-gui failed to load. The game is still running.')); };
      doc.head.appendChild(s);
    });
    pending.then(build).catch(function (e) { if (ctx.notify) ctx.notify(e); });
    g.ZD_TUNE_UI.setDraft = function (key, value) {
      if (!(key in draft)) throw new Error('Unknown tune key ' + key);
      draft[key] = value;
      remember();
      refresh();
    };
    g.ZD_TUNE_UI.draft = draft;
    return function () {
      try { if (gui) gui.destroy(); } catch (e) {}
    };
  }
  g.ZD_TUNE_UI = { mount: mount, setDraft: function () {}, draft: null };
})(window);
