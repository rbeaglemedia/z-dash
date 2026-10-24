'use strict';
(function (g) {
  var doc = g.document;
  var UI = 'zdash.dev.ui';
  function $(id) { return doc.getElementById(id); }
  function readUi() {
    try { return JSON.parse(g.localStorage.getItem(UI) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeUi(patch) {
    var cur = readUi(), k;
    for (k in patch) cur[k] = patch[k];
    try { g.localStorage.setItem(UI, JSON.stringify(cur)); } catch (e) {}
  }
  function notify(err) {
    var box = $('zd-error');
    var msg = err && err.message ? err.message : String(err || '');
    if (!box) return;
    if (!msg) { box.hidden = true; box.textContent = ''; return; }
    box.hidden = false;
    box.textContent = msg.indexOf('game is still running') >= 0 || msg.indexOf("didn't start") >= 0
      ? msg
      : 'A dev tool hit an error: ' + msg + '. The game is still running.';
  }
  function gameWin() {
    var frame = $('zd-game-frame');
    try { return frame && frame.contentWindow; } catch (e) { return null; }
  }
  var games = [
    { id: 'world', label: 'Neon World', src: '../world.html?dev=1&zdhub=1', hook: true },
    { id: 'jr', label: 'Kid menu', src: '../jr.html?zdhub=1', hook: false },
    { id: 'adult', label: 'Adult', src: '../index.html?zdhub=1', hook: false }
  ];
  function ctx() {
    return {
      game: gameWin,
      notify: notify,
      open: function (url) {
        var frame = $('zd-game-frame');
        if (frame) frame.src = url;
      },
      asset: function (rel) { return new URL(rel, g.location.origin + '/test/').href; },
      reapplyKills: true,
      hookExpected: false
    };
  }
  var current = null;
  var seq = 0;
  function showTab(id) {
    var mine = ++seq;
    if (current) { try { current(); } catch (e) { notify(e); } current = null; }
    var c = ctx();
    var game = games.filter(function (item) { return item.id === ($('zd-game').value || 'world'); })[0] || games[0];
    c.hookExpected = !!game.hook && id === 'fps';
    var buttons = doc.querySelectorAll('#zd-tabs [data-tab]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-selected', buttons[i].getAttribute('data-tab') === id ? 'true' : 'false');
    }
    writeUi({ tab: id });
    var dock = $('dock');
    return g.ZD_PANELS.mount(id, dock, c).then(function (destroy) {
      if (mine !== seq) { if (destroy) destroy(); return; }
      current = destroy;
      if (g.ZD_FPS_COUNTER && g.ZD_FPS_COUNTER.place) g.ZD_FPS_COUNTER.place();
    });
  }
  function bootApp() {
    $('zd-gate').hidden = true;
    $('zd-shell').hidden = false;
    var ui = readUi();
    var select = $('zd-game');
    games.forEach(function (item) {
      var o = doc.createElement('option');
      o.value = item.id;
      o.textContent = item.label;
      select.appendChild(o);
    });
    fetch('../adventure.html', { method: 'GET', cache: 'no-store' }).then(function (res) {
      if (!res.ok) return;
      games.push({ id: 'adventure', label: 'Adventure', src: '../adventure.html?dev=1&zdhub=1', hook: false });
      var o = doc.createElement('option');
      o.value = 'adventure';
      o.textContent = 'Adventure';
      select.appendChild(o);
      if (ui.game === 'adventure') select.value = 'adventure';
    }).catch(function () {});
    select.value = ui.game && ui.game !== 'adventure' ? ui.game : 'world';
    var tabs = g.ZD_PANELS.tabs, nav = $('zd-tabs'), i;
    for (i = 0; i < tabs.length; i++) {
      (function (t) {
        var b = doc.createElement('button');
        b.type = 'button';
        b.className = 'zd-btn';
        b.setAttribute('data-tab', t.id);
        b.textContent = t.title;
        b.addEventListener('click', function () { showTab(t.id).catch(notify); });
        nav.appendChild(b);
      })(tabs[i]);
    }
    if (ui.collapsed) {
      doc.body.classList.add('zd-collapsed');
      $('zd-collapse').textContent = 'Show dock';
    }
    $('zd-collapse').addEventListener('click', function () {
      var on = doc.body.classList.toggle('zd-collapsed');
      $('zd-collapse').textContent = on ? 'Show dock' : 'Hide dock';
      writeUi({ collapsed: on });
    });
    $('zd-lock').addEventListener('click', function () {
      try { g.localStorage.removeItem('zdash.dev.unlock'); } catch (e) {}
      g.location.href = g.location.pathname;
    });
    var frame = $('zd-game-frame');
    function loadGame() {
      var id = select.value || 'world';
      var game = games.filter(function (item) { return item.id === id; })[0] || games[0];
      writeUi({ game: game.id });
      frame.src = game.src;
      if (!game.hook) return;
      var t0 = Date.now();
      (function poll() {
        var w = gameWin();
        if (w && w.ZD_DEV && w.ZD_DEV.ready) return;
        if (Date.now() - t0 > 15000) {
          notify("Dev hook didn't start. The game is still running.");
          return;
        }
        g.setTimeout(poll, 200);
      })();
    }
    select.addEventListener('change', function () { loadGame(); showTab(readUi().tab || 'fps').catch(notify); });
    frame.addEventListener('load', function () {
      if (g.ZD_FPS_COUNTER && g.ZD_FPS_COUNTER.place) g.ZD_FPS_COUNTER.place();
    });
    g.ZD_PANELS.mountBar($('zd-votes'), ctx()).catch(notify);
    loadGame();
    showTab(ui.tab || 'fps').catch(notify);
    if ('serviceWorker' in g.navigator) {
      g.navigator.serviceWorker.register('sw.js', { scope: '/test/', updateViaCache: 'none' }).catch(function () {});
    }
  }
  function showGate() {
    $('zd-shell').hidden = true;
    g.ZD_UNLOCK_DONE = function () { g.location.reload(); };
    var s = doc.createElement('script');
    s.src = 'dev/unlock.js';
    s.onerror = function () { notify('Could not load the PIN pad. The game is still running.'); };
    doc.head.appendChild(s);
  }
  var unlocked = false, devQuery = false;
  try { unlocked = g.localStorage.getItem('zdash.dev.unlock') === '1'; } catch (e) {}
  try { devQuery = /[?&]dev=1(?:&|$)/.test(g.location.search); } catch (e) {}
  if (unlocked || devQuery) bootApp();
  else showGate();
})(window);
