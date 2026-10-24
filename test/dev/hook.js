'use strict';
/* Runs inside Neon World only after unlock, ?dev=1, or the corner gesture.
   Does not attach the frame clock, kills, speed, or physics until a panel asks.
   ?zdhub=1 means the parent Tools app owns the panels, so this page grows no wrench. */
(function (g) {
  var script = g.document.currentScript;
  var base = (script && script.src) ? script.src.replace(/hook\.js(?:\?.*)?$/, '') : '';
  function banner(text) {
    var b = g.document.getElementById('zd-banner');
    if (!b) {
      b = g.document.createElement('div');
      b.id = 'zd-banner';
      b.setAttribute('role', 'alert');
      (g.document.body || g.document.documentElement).appendChild(b);
    }
    b.hidden = false;
    b.textContent = text;
  }
  g.addEventListener('error', function (e) {
    var f = String(e.filename || '');
    if (f.indexOf('/test/dev/') === -1 && f.indexOf('/test/vendor/') === -1) return;
    banner('A dev tool hit an error: ' + (e.message || 'unknown') + '. The game is still running.');
  });
  function load(src) {
    return new Promise(function (resolve, reject) {
      var s = g.document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Could not load ' + src)); };
      g.document.head.appendChild(s);
    });
  }
  function districtAt(x, z) {
    var list = g.CITY_LAYOUT && g.CITY_LAYOUT.districts;
    if (!list) return 'open';
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (x >= d.x0 && x <= d.x1 && z >= d.z0 && z <= d.z1) return d.label || d.id || 'open';
    }
    return 'open';
  }
  function readContext() {
    var P = g.P || {};
    var mph = (P.v || 0) * (g.ZD_OVR && g.ZD_OVR.MPH || 2.2369362920544);
    return {
      mph: Math.round(mph),
      district: districtAt(P.x || 0, P.z || 0),
      nos: !!(P.nosBurn || P.nosT),
      air: !P.ground
    };
  }
  var hub = false;
  try { hub = /[?&]zdhub=1(?:&|$)/.test(g.location.search); } catch (e) {}
  var statsNode = null;
  var statsPromise = null;
  var panelDestroy = null;

  function mountStats() {
    if (statsNode || !g.ZD_PERF || !g.Stats) return;
    try {
      var stats = new g.Stats();
      stats.showPanel(1);
      stats.dom.className = 'zd-stats';
      stats.dom.style.position = 'fixed';
      stats.dom.style.right = '8px';
      stats.dom.style.bottom = '8px';
      stats.dom.style.zIndex = '80';
      g.document.body.appendChild(stats.dom);
      statsNode = stats.dom;
      g.ZD_PERF.setStats(stats);
    } catch (e) { statsNode = null; }
  }
  function attachPerf() {
    if (!(g.ZD_PERF && g.ZD_PERF.__owner && g.ZD_PERF.__owner !== 'zd-lab' && g.ZD_PERF.add && g.ZD_PERF.begin && g.ZD_PERF.end)) {
      if (!g.ZD_PERF || !g.ZD_PERF.begin) {
        if (typeof g.ZD_PERF_FACTORY !== 'function') throw new Error('Frame clock is not loaded');
        g.ZD_PERF = g.ZD_PERF_FACTORY();
      }
    }
    try { g.ZD_PERF.setContext(readContext); } catch (e) {}
    if (!statsPromise && !g.Stats) {
      statsPromise = load(base + '../vendor/stats.js').then(function () {
        if (g.ZD_PERF) mountStats();
      }).catch(function (e) { notify(e); });
    } else mountStats();
    return g.ZD_PERF;
  }
  function detachPerf() {
    g.ZD_PERF = null;
    if (statsNode && statsNode.parentNode) statsNode.parentNode.removeChild(statsNode);
    statsNode = null;
  }
  function asset(rel) {
    return new URL(rel, base.replace(/dev\/$/, '')).href;
  }
  function notify(err) {
    var msg = err && err.message ? err.message : String(err || 'unknown');
    banner('A dev tool hit an error: ' + msg + '. The game is still running.');
  }
  function ctx() {
    return {
      game: function () { return g; },
      notify: notify,
      open: function (url) { g.location.assign(url); },
      asset: asset,
      reapplyKills: false
    };
  }
  function closePanel() {
    if (panelDestroy) { try { panelDestroy(); } catch (e) { notify(e); } }
    panelDestroy = null;
    detachPerf();
    var panel = g.document.getElementById('zd-panel');
    if (panel) panel.hidden = true;
  }
  function openPanel(id) {
    var panel = g.document.getElementById('zd-panel');
    var dock = g.document.getElementById('zd-panel-dock');
    if (!panel || !dock || !g.ZD_PANELS) return;
    panel.hidden = false;
    if (panelDestroy) { try { panelDestroy(); } catch (e) { notify(e); } panelDestroy = null; }
    dock.innerHTML = '';
    g.ZD_PANELS.mount(id || 'fps', dock, ctx()).then(function (destroy) {
      panelDestroy = destroy;
    }).catch(function (e) { notify(e); });
    var buttons = panel.querySelectorAll('[data-tab]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-selected', buttons[i].getAttribute('data-tab') === (id || 'fps') ? 'true' : 'false');
    }
  }
  function buildWrench() {
    if (hub || g.document.getElementById('zd-wrench')) return;
    var link = g.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'ui.css';
    g.document.head.appendChild(link);
    var btn = g.document.createElement('button');
    btn.id = 'zd-wrench';
    btn.type = 'button';
    btn.className = 'zd-btn';
    btn.textContent = 'Dev';
    btn.setAttribute('aria-label', 'Open dev tools');
    btn.addEventListener('click', function () {
      var panel = g.document.getElementById('zd-panel');
      if (panel && !panel.hidden) closePanel();
      else openPanel(g.sessionStorage && g.sessionStorage.getItem('zdash.dev.wrenchTab') || 'fps');
    });
    var panel = g.document.createElement('div');
    panel.id = 'zd-panel';
    panel.hidden = true;
    var bar = g.document.createElement('div');
    bar.id = 'zd-panel-bar';
    var votes = g.document.createElement('div');
    votes.id = 'zd-votes';
    var close = g.document.createElement('button');
    close.type = 'button';
    close.className = 'zd-btn';
    close.textContent = 'Close';
    close.addEventListener('click', closePanel);
    var nav = g.document.createElement('div');
    nav.id = 'zd-tabs';
    bar.appendChild(close);
    bar.appendChild(votes);
    panel.appendChild(bar);
    panel.appendChild(nav);
    var dock = g.document.createElement('div');
    dock.id = 'zd-panel-dock';
    panel.appendChild(dock);
    g.document.body.appendChild(btn);
    g.document.body.appendChild(panel);
    load(base + 'panels.js').then(function () {
      var tabs = g.ZD_PANELS.tabs;
      for (var i = 0; i < tabs.length; i++) {
        (function (t) {
          var b = g.document.createElement('button');
          b.type = 'button';
          b.className = 'zd-btn';
          b.setAttribute('data-tab', t.id);
          b.textContent = t.title;
          b.addEventListener('click', function () {
            try { g.sessionStorage.setItem('zdash.dev.wrenchTab', t.id); } catch (e) {}
            openPanel(t.id);
          });
          nav.appendChild(b);
        })(tabs[i]);
      }
      return g.ZD_PANELS.mountBar(votes, ctx());
    }).catch(function (e) { notify(e); });
  }
  function finish() {
    g.ZD_DEV = {
      ready: true,
      attachPerf: function () { try { return attachPerf(); } catch (e) { notify(e); return null; } },
      detachPerf: function () { try { detachPerf(); } catch (e) { notify(e); } },
      load: function (file) {
        return load(base + file).catch(function (e) {
          banner('A dev tool failed to load (' + file + '). The game is still running.');
          return null;
        });
      },
      banner: banner,
      closePanel: closePanel
    };
    if (!hub) buildWrench();
  }
  Promise.all([
    load(base + 'ovr.js'),
    load(base + 'kills.js'),
    load(base + 'bench.js'),
    load(base + 'perf.js')
  ]).then(function () {
    try { finish(); }
    catch (e) { banner('A dev tool hit an error: ' + (e.message || e) + '. The game is still running.'); }
  }).catch(function (e) {
    banner('A dev tool failed to load (' + (e.message || e) + '). The game is still running.');
    g.ZD_DEV = { ready: false, error: String(e && e.message || e), attachPerf: function () { return null; }, detachPerf: function () {} };
  });
})(window);
