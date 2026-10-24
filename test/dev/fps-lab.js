'use strict';
(function (g) {
  var KILLS = [
    ['traffic', 'Traffic'],
    ['glow', 'Glow'],
    ['minimap', 'Minimap'],
    ['weather', 'Weather'],
    ['trails', 'Trails'],
    ['far', 'Far buildings']
  ];
  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function readKills() {
    try { return JSON.parse(g.localStorage.getItem('zdash.dev.kills') || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeKills(map) {
    try { g.localStorage.setItem('zdash.dev.kills', JSON.stringify(map)); } catch (e) {}
  }
  function draw(canvas, series, budget) {
    var c = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    c.clearRect(0, 0, w, h);
    c.fillStyle = '#12081c';
    c.fillRect(0, 0, w, h);
    if (!series || !series.length) return;
    var max = budget || 16.7, i;
    for (i = 0; i < series.length; i++) if (series[i] > max) max = series[i];
    var n = series.length;
    var bar = Math.max(1, Math.floor(w / n));
    var yb = h - (budget / max) * (h - 8);
    c.fillStyle = '#ff5a7a';
    c.fillRect(0, yb, w, 1);
    for (i = 0; i < n; i++) {
      var bh = Math.max(1, (series[i] / max) * (h - 8));
      c.fillStyle = series[i] > budget ? '#ff5a7a' : '#3ee6ff';
      c.fillRect(i * bar, h - bh, Math.max(1, bar - 1), bh);
    }
  }
  function report(game) {
    var perf = game.ZD_PERF;
    var snap = perf && perf.snapshot ? perf.snapshot() : null;
    return {
      tool: 'fps-lab',
      t: new Date().toISOString(),
      snap: snap,
      dips: perf && perf.dips ? perf.dips() : [],
      bench: game.ZD_BENCH ? game.ZD_BENCH.last : null,
      kills: game.ZD_KILLS ? game.ZD_KILLS.snapshot() : null
    };
  }
  function summary(data) {
    var s = data && data.snap;
    if (!s) return 'FPS Lab: no frames yet';
    var lines = [
      'Z-DASH FPS Lab',
      'fps avg ' + s.fps.avg + '  p95 ' + s.fps.p95 + '  p99 ' + s.fps.p99 + '  worst ' + s.fps.worst,
      'ms avg ' + s.ms.avg + '  p95 ' + s.ms.p95 + '  p99 ' + s.ms.p99 + '  worst ' + s.ms.worst,
      'draws ' + s.draws + '  objects ' + s.objects + '  dips ' + s.dips,
      'canvas ' + (s.canvas ? s.canvas.w + 'x' + s.canvas.h + ' dpr ' + s.canvas.dpr : ''),
      'heapMB ' + (s.heapMB == null ? 'n/a' : s.heapMB)
    ];
    var k;
    if (s.systems) for (k in s.systems) lines.push(k + ' ' + s.systems[k] + ' ms');
    if (data.bench) lines.push('bench ' + data.bench.id + ' ' + data.bench.seconds + 's fps ' + (data.bench.fps && data.bench.fps.avg));
    return lines.join('\n');
  }
  function mount(host, ctx) {
    var doc = host.ownerDocument;
    var game = ctx.game();
    host.innerHTML = '';
    if (!game || !game.ZD_DEV) {
      var msg = el(doc, 'p', 'zd-msg');
      msg.textContent = ctx.hookExpected
        ? "Dev hook didn't start. The game is still running."
        : 'This page has no Neon World frame clock. Ellie votes still work. Adventure gets the wrench when that page loads the hook.';
      host.appendChild(msg);
      if (ctx.hookExpected && ctx.notify) ctx.notify(msg.textContent);
      return function () {};
    }
    var perf = null;
    try { perf = game.ZD_DEV.attachPerf(); }
    catch (e) { if (ctx.notify) ctx.notify(e); perf = null; }
    if (!perf) {
      host.appendChild(el(doc, 'p', 'zd-msg', 'The frame clock did not start. The game is still running.'));
      return function () {};
    }
    var saved = readKills();
    var names = [], i;
    if (ctx.reapplyKills && game.ZD_KILLS) {
      for (i = 0; i < KILLS.length; i++) if (saved[KILLS[i][0]]) {
        game.ZD_KILLS.set(KILLS[i][0], true);
        names.push(KILLS[i][1]);
      }
      if (names.length && ctx.notify) ctx.notify(names.join(', ') + ' is off (saved kill switch).');
    }
    var graph = el(doc, 'canvas', 'zd-graph');
    graph.width = 320;
    graph.height = 88;
    graph.id = 'zd-graph';
    var nums = el(doc, 'p', 'zd-nums', 'Waiting for frames…');
    nums.id = 'zd-fps-nums';
    var sys = el(doc, 'pre', 'zd-sys', '');
    sys.id = 'zd-fps-sys';
    var row = el(doc, 'div', 'zd-row');
    var buttons = {};
    function paintKill(name, on) {
      var b = buttons[name];
      if (!b) return;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    for (i = 0; i < KILLS.length; i++) {
      (function (name, label) {
        var b = el(doc, 'button', 'zd-btn', label);
        b.type = 'button';
        b.setAttribute('data-kill', name);
        var on = !!(game.ZD_KILLS && game.ZD_KILLS.get(name));
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.addEventListener('click', function () {
          try {
            var next = !(game.ZD_KILLS && game.ZD_KILLS.get(name));
            game.ZD_KILLS.set(name, next);
            var map = readKills();
            map[name] = next;
            writeKills(map);
            paintKill(name, next);
          } catch (e) { if (ctx.notify) ctx.notify(e); }
        });
        buttons[name] = b;
        row.appendChild(b);
      })(KILLS[i][0], KILLS[i][1]);
    }
    var budget = el(doc, 'select');
    budget.id = 'zd-budget';
    [['16.7', 'Budget 16.7 ms (60 fps)'], ['33.3', 'Budget 33 ms (30 fps)']].forEach(function (opt) {
      var o = el(doc, 'option', '', opt[1]);
      o.value = opt[0];
      budget.appendChild(o);
    });
    budget.addEventListener('change', function () {
      try { game.ZD_PERF && game.ZD_PERF.setBudget(+budget.value); } catch (e) { if (ctx.notify) ctx.notify(e); }
    });
    var bench = el(doc, 'button', 'zd-btn', 'Benchmark 60 seconds');
    bench.type = 'button';
    bench.setAttribute('data-bench', '60');
    var benchOut = el(doc, 'p', 'zd-msg', '');
    benchOut.id = 'zd-bench-out';
    bench.addEventListener('click', function () {
      try {
        if (!game.ZD_BENCH) throw new Error('Benchmark is not loaded');
        bench.disabled = true;
        bench.textContent = 'Driving the fixed route…';
        game.ZD_BENCH.start({
          seconds: 60,
          onScore: function (score) {
            bench.disabled = false;
            bench.textContent = 'Benchmark 60 seconds';
            benchOut.textContent = 'Score ' + score.id + ' · ' + score.seconds + 's · fps ' + (score.fps && score.fps.avg);
          }
        });
      } catch (e) {
        bench.disabled = false;
        if (ctx.notify) ctx.notify(e);
      }
    });
    var copy = el(doc, 'button', 'zd-btn', 'Copy JSON');
    copy.type = 'button';
    copy.setAttribute('data-export', 'json');
    var share = el(doc, 'button', 'zd-btn', 'Copy summary');
    share.type = 'button';
    share.setAttribute('data-export', 'share');
    var out = el(doc, 'textarea', 'zd-out');
    out.id = 'zd-fps-out';
    out.readOnly = true;
    function put(text) {
      out.value = text;
      if (g.navigator.clipboard && g.navigator.clipboard.writeText) {
        g.navigator.clipboard.writeText(text).catch(function () {});
      }
    }
    copy.addEventListener('click', function () {
      try { put(JSON.stringify(report(ctx.game()))); }
      catch (e) { if (ctx.notify) ctx.notify(e); }
    });
    share.addEventListener('click', function () {
      try { put(summary(report(ctx.game()))); }
      catch (e) { if (ctx.notify) ctx.notify(e); }
    });
    var spector = el(doc, 'button', 'zd-btn', 'Spector frame capture');
    spector.type = 'button';
    spector.setAttribute('data-spector', '1');
    var specMsg = el(doc, 'p', 'zd-msg', '');
    spector.addEventListener('click', function () {
      try {
        var w = ctx.game();
        var canvases = w.document.querySelectorAll('canvas');
        var glCanvas = null, i2;
        for (i2 = 0; i2 < canvases.length; i2++) {
          var c = canvases[i2];
          if (c.getContext && (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))) {
            try {
              if (c.getContext('webgl2') || c.getContext('webgl')) { glCanvas = c; break; }
            } catch (e) {}
          }
        }
        function findGl() {
          var list = w.document.querySelectorAll('canvas'), j;
          for (j = 0; j < list.length; j++) {
            try {
              var gl = list[j].getContext('webgl2') || list[j].getContext('webgl');
              if (gl) return list[j];
            } catch (e) {}
          }
          return null;
        }
        function run() {
          glCanvas = findGl();
          if (!glCanvas || !w.SPECTOR) {
            specMsg.textContent = 'Neon World WebGL needs ?gl=1. Open the game with WebGL, then capture again.';
            var go = el(doc, 'button', 'zd-btn', 'Reload Neon World with WebGL');
            go.type = 'button';
            go.setAttribute('data-gl', '1');
            go.addEventListener('click', function () { ctx.open('../world.html?dev=1&zdhub=1&gl=1&glow=1'); });
            if (!specMsg.nextSibling || specMsg.nextSibling.getAttribute('data-gl') !== '1') specMsg.insertAdjacentElement('afterend', go);
            return;
          }
          var sp = new w.SPECTOR.Spector();
          sp.displayUI();
          if (sp.spyCanvases) sp.spyCanvases();
          sp.captureCanvas(glCanvas);
          specMsg.textContent = 'Spector is capturing this WebGL canvas.';
        }
        if (!w.SPECTOR) {
          var s = w.document.createElement('script');
          s.src = ctx.asset('vendor/spector.js');
          s.onload = run;
          s.onerror = function () { if (ctx.notify) ctx.notify(new Error('Spector.js failed to load. The game is still running.')); };
          w.document.head.appendChild(s);
        } else run();
      } catch (e) { if (ctx.notify) ctx.notify(e); }
    });
    host.appendChild(graph);
    host.appendChild(nums);
    host.appendChild(sys);
    host.appendChild(budget);
    host.appendChild(row);
    host.appendChild(bench);
    host.appendChild(benchOut);
    host.appendChild(copy);
    host.appendChild(share);
    host.appendChild(spector);
    host.appendChild(specMsg);
    host.appendChild(out);
    var timer = g.setInterval(function () {
      try {
        var w = ctx.game();
        var p = w && w.ZD_PERF;
        if (!p || !p.snapshot) return;
        var snap = p.snapshot();
        draw(graph, snap.series, snap.budget);
        nums.textContent = 'fps avg ' + snap.fps.avg + ' · p95 ' + snap.fps.p95 + ' · p99 ' + snap.fps.p99 + ' · worst ' + snap.fps.worst
          + '    ms avg ' + snap.ms.avg + ' · p95 ' + snap.ms.p95 + ' · p99 ' + snap.ms.p99 + ' · worst ' + snap.ms.worst;
        var lines = [];
        var sum = 0, k;
        for (k in snap.systems) { lines.push(k + '  ' + snap.systems[k]); sum += snap.systems[k]; }
        lines.push('sum ' + (Math.round(sum * 100) / 100) + '  closed ' + snap.closedMs);
        lines.push('draws ' + snap.draws + '  objects ' + snap.objects + '  dips ' + snap.dips);
        if (snap.canvas) lines.push('canvas ' + snap.canvas.w + '×' + snap.canvas.h + '  css ' + snap.canvas.cssW + '×' + snap.canvas.cssH + '  dpr ' + snap.canvas.dpr);
        lines.push('heap MB ' + (snap.heapMB == null ? 'n/a (not a GC timer)' : snap.heapMB));
        if (snap.gl) lines.push('gl ' + JSON.stringify(snap.gl).slice(0, 280));
        if (snap.probe) lines.push('probe ' + JSON.stringify(snap.probe).slice(0, 180));
        var dips = p.dips ? p.dips() : [];
        for (var d = Math.max(0, dips.length - 4); d < dips.length; d++) {
          var dip = dips[d];
          lines.push('dip ' + dip.ms + 'ms  ' + dip.mph + ' mph  ' + dip.district + (dip.nos ? '  NOS' : '') + (dip.air ? '  air' : ''));
        }
        sys.textContent = lines.join('\n');
      } catch (e) { if (ctx.notify) ctx.notify(e); g.clearInterval(timer); }
    }, 250);
    return function () {
      g.clearInterval(timer);
      try { if (ctx.game().ZD_DEV) ctx.game().ZD_DEV.detachPerf(); } catch (e) {}
    };
  }
  g.ZD_FPS_LAB = { mount: mount, report: report };
})(window);
