'use strict';
(function (g) {
  var KEY = 'zdash.dev.speedDraft';
  var STEPS = [100, 150, 200, 250, 300, 360];
  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function mount(host, ctx) {
    var doc = host.ownerDocument;
    host.innerHTML = '';
    var game = ctx.game();
    if (!game || !game.ZD_OVR || !game.TUNE) {
      host.appendChild(el(doc, 'p', 'zd-msg', 'Speed cap needs the Neon World tune. This page is unchanged. The game is still running.'));
      return function () {};
    }
    var defaults = game.ZD_OVR.defaults();
    var nos = defaults.nosBoost || 1.6;
    var real = Math.round(defaults.maxSpeed * nos * game.ZD_OVR.MPH);
    var draft = real;
    try { var saved = +g.localStorage.getItem(KEY); if (saved >= 80 && saved <= 400) draft = saved; } catch (e) {}
    var state = { mph: draft };
    var note = el(doc, 'p', 'zd-msg', 'Real default is about ' + real + ' mph. Nothing is applied until you tap a speed or Apply. Normal play stays on the real default.');
    var live = el(doc, 'p', 'zd-nums', 'Live fps …');
    live.id = 'zd-speed-fps';
    var row = el(doc, 'div', 'zd-row');
    var guiHost = el(doc, 'div', 'zd-gui');
    var gui = null;
    function remember() {
      try { g.localStorage.setItem(KEY, String(state.mph)); } catch (e) {}
    }
    function paint() {
      if (gui) gui.controllersRecursive().forEach(function (c) { c.updateDisplay(); });
      var on = game.ZD_OVR.speedMph();
      var cap = elCap();
      live.dataset.cap = cap == null ? '' : String(Math.round(cap));
    }
    function elCap() {
      var t = game.TUNE;
      if (!t || !game.ZD_OVR.layer('speed')) return null;
      return t.maxSpeed * (t.nosBoost || nos) * game.ZD_OVR.MPH;
    }
    function apply(mph) {
      state.mph = mph;
      remember();
      game.ZD_OVR.set('speed', { __mph: mph });
      paint();
    }
    STEPS.forEach(function (mph) {
      var b = el(doc, 'button', 'zd-btn', String(mph));
      b.type = 'button';
      b.setAttribute('data-mph', String(mph));
      b.addEventListener('click', function () {
        try { apply(mph); } catch (e) { if (ctx.notify) ctx.notify(e); }
      });
      row.appendChild(b);
    });
    var actions = el(doc, 'div', 'zd-row');
    var go = el(doc, 'button', 'zd-btn', 'Apply');
    go.type = 'button';
    go.setAttribute('data-apply', 'speed');
    go.addEventListener('click', function () { try { apply(state.mph); } catch (e) { if (ctx.notify) ctx.notify(e); } });
    var off = el(doc, 'button', 'zd-btn', 'Apply off');
    off.type = 'button';
    off.setAttribute('data-clear', 'speed');
    off.addEventListener('click', function () {
      try { game.ZD_OVR.clear('speed'); paint(); } catch (e) { if (ctx.notify) ctx.notify(e); }
    });
    actions.appendChild(go);
    actions.appendChild(off);
    host.appendChild(note);
    host.appendChild(live);
    host.appendChild(row);
    host.appendChild(guiHost);
    host.appendChild(actions);
    function ensureGui() {
      if (!g.lil || !g.lil.GUI) return;
      gui = new g.lil.GUI({ container: guiHost, title: 'Top speed', width: 280 });
      gui.add(state, 'mph', 80, 400, 10).name('mph').onChange(function () { remember(); });
    }
    var guiPromise = g.lil ? Promise.resolve() : new Promise(function (resolve, reject) {
      var s = doc.createElement('script');
      s.src = ctx.asset('vendor/lil-gui.js');
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('lil-gui failed to load. The game is still running.')); };
      doc.head.appendChild(s);
    });
    guiPromise.then(ensureGui).catch(function (e) { if (ctx.notify) ctx.notify(e); });
    var timer = 0;
    try {
      if (game.ZD_DEV) game.ZD_DEV.attachPerf();
      timer = g.setInterval(function () {
        try {
          var p = ctx.game().ZD_PERF;
          var snap = p && p.snapshot ? p.snapshot() : null;
          var fps = snap ? snap.fps.avg : (ctx.game().FLY && ctx.game().FLY.fps);
          var cap = elCap();
          live.textContent = 'Live fps ' + (fps == null ? '…' : Math.round(fps))
            + (cap == null ? ' · cap not applied' : ' · cap about ' + Math.round(cap) + ' mph');
        } catch (e) {}
      }, 250);
    } catch (e) { if (ctx.notify) ctx.notify(e); }
    g.ZD_SPEED.setDraft = function (mph) { state.mph = +mph; remember(); paint(); };
    g.ZD_SPEED.getDraft = function () { return state.mph; };
    return function () {
      if (timer) g.clearInterval(timer);
      try { if (gui) gui.destroy(); } catch (e) {}
      try { if (ctx.game().ZD_DEV) ctx.game().ZD_DEV.detachPerf(); } catch (e) {}
    };
  }
  g.ZD_SPEED = { mount: mount, setDraft: function () {}, getDraft: function () { return 0; } };
})(window);
