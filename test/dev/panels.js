'use strict';
/* Shared tab list for the hub and the in-game wrench. */
(function (g) {
  var script = g.document.currentScript;
  var base = (script && script.src) ? script.src.replace(/panels\.js(?:\?.*)?$/, '') : '';
  var TABS = [
    { id: 'fps', title: 'FPS Lab', file: 'fps-lab.js', global: 'ZD_FPS_LAB', fn: 'mount' },
    { id: 'speed', title: 'Speed', file: 'speed.js', global: 'ZD_SPEED', fn: 'mount' },
    { id: 'physics', title: 'Physics', file: 'tune-ui.js', global: 'ZD_TUNE_UI', fn: 'mount' },
    { id: 'ellie', title: 'Ellie votes', file: 'ellie.js', global: 'ZD_ELLIE', fn: 'mount' },
    { id: 'character', title: 'Character', file: 'slots.js', global: 'ZD_SLOTS', fn: 'character' },
    { id: 'car', title: 'Car & paint', file: 'slots.js', global: 'ZD_SLOTS', fn: 'car' },
    { id: 'building', title: 'Buildings', file: 'slots.js', global: 'ZD_SLOTS', fn: 'building' },
    { id: 'builder', title: 'DEV Builder', file: 'slots.js', global: 'ZD_SLOTS', fn: 'builder' },
    { id: 'device', title: 'Device', file: 'device.js', global: 'ZD_DEVICE', fn: 'mount' }
  ];
  var loading = {};
  function loadScript(src) {
    if (loading[src]) return loading[src];
    loading[src] = new Promise(function (resolve, reject) {
      var s = g.document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Could not load ' + src)); };
      g.document.head.appendChild(s);
    });
    return loading[src];
  }
  function tab(id) {
    for (var i = 0; i < TABS.length; i++) if (TABS[i].id === id) return TABS[i];
    return null;
  }
  function ensure(t) {
    if (t && g[t.global] && typeof g[t.global][t.fn] === 'function') return Promise.resolve();
    if (!t) return Promise.reject(new Error('Unknown tool'));
    return loadScript(base + t.file);
  }
  g.ZD_PANELS = {
    base: base,
    tabs: TABS,
    lastDestroy: null,
    mountBar: function (host, ctx) {
      return ensure({ file: 'ellie.js', global: 'ZD_ELLIE', fn: 'mountBar' }).then(function () {
        if (!g.ZD_ELLIE || !g.ZD_ELLIE.mountBar) throw new Error('Ellie votes did not load');
        return g.ZD_ELLIE.mountBar(host, ctx);
      });
    },
    mount: function (id, host, ctx) {
      var t = tab(id);
      var destroyed = null;
      return ensure(t).then(function () {
        var api = t && g[t.global];
        if (!api || typeof api[t.fn] !== 'function') throw new Error('This tool did not start (' + id + ')');
        var out = api[t.fn](host, ctx);
        if (out && typeof out.then === 'function') return out;
        return out;
      }).then(function (destroy) {
        destroyed = destroy;
        return function () {
          g.ZD_PANELS.lastDestroy = id;
          if (typeof destroyed === 'function') {
            try { destroyed(); } catch (e) { if (ctx && ctx.notify) ctx.notify(e); }
          }
        };
      }).catch(function (e) {
        if (ctx && ctx.notify) ctx.notify(e);
        else throw e;
        host.innerHTML = '';
        var p = g.document.createElement('p');
        p.className = 'zd-msg';
        p.textContent = 'This tool hit an error. The game is still running.';
        host.appendChild(p);
        return function () { g.ZD_PANELS.lastDestroy = id; };
      });
    }
  };
})(window);
