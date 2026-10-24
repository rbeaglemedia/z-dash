'use strict';
/* Neon World frame clock for the dev tools.
   Install with: window.ZD_PERF = ZD_PERF_FACTORY()
   Leave window.ZD_PERF null and the game's zdT/zdAdd checks cost a null read.
   The FPS root-cause agent can:
     - call ZD_PERF.add(name, ms) during a frame for a bucket that is not already timed
     - set window.ZD_PERF_PROBE = function () { return { note: '...' }; }
       Probe results are shown beside the buckets. They are not added into the sum.
   Buckets: physics, traffic, buildings, car, effects, minimap, hud, weather, other.
   other is the residual (including GC that landed between timed sections).
   GC inside a section stays in that section. */
(function (g) {
  var NAMES = ['physics', 'traffic', 'buildings', 'car', 'effects', 'minimap', 'hud', 'weather', 'other'];
  function round(v) { return Math.round(v * 100) / 100; }
  function pct(sorted, p) {
    if (!sorted.length) return 0;
    var i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
    if (lo === hi) return sorted[lo];
    return sorted[lo] * (hi - i) + sorted[hi] * (i - lo);
  }
  function create() {
    var MAX = 480;
    var ring = new Float32Array(MAX);
    var cols = {};
    var buckets = {};
    var i;
    for (i = 0; i < NAMES.length; i++) { cols[NAMES[i]] = new Float32Array(MAX); buckets[NAMES[i]] = 0; }
    var head = 0, count = 0, t0 = 0, draws = 0, objects = 0, budget = 16.7, lastDip = 0, running = false;
    var context = null, stats = null, dips = [], closed = 0;
    function zero() { for (var n = 0; n < NAMES.length; n++) buckets[NAMES[n]] = 0; }
    var api = {
      __owner: 'zd-lab',
      names: NAMES.slice(),
      setBudget: function (ms) { budget = +ms || 16.7; },
      setContext: function (fn) { context = fn; },
      setStats: function (s) { stats = s; },
      note: function (o) {
        if (!o) return;
        if (o.draws != null) draws = o.draws | 0;
        if (o.objects != null) objects = o.objects | 0;
      },
      begin: function () {
        if (stats) { try { stats.begin(); } catch (e) { stats = null; } }
        t0 = performance.now();
        zero();
        running = true;
      },
      add: function (name, ms) {
        if (!running || typeof ms !== 'number' || ms !== ms) return;
        if (typeof buckets[name] !== 'number') buckets[name] = 0;
        buckets[name] += ms;
      },
      end: function () {
        if (!running) return 0;
        var total = performance.now() - t0, sum = 0, k;
        for (k in buckets) sum += buckets[k];
        var gap = total - sum;
        if (gap > 0) buckets.other += gap;
        sum = 0;
        for (k in buckets) sum += buckets[k];
        closed = total - sum;
        var slot = head % MAX;
        ring[slot] = total;
        for (var n = 0; n < NAMES.length; n++) cols[NAMES[n]][slot] = buckets[NAMES[n]] || 0;
        head++; count++;
        if (total > budget && performance.now() - lastDip > 120) {
          lastDip = performance.now();
          var systems = {}, ctx = null;
          for (n = 0; n < NAMES.length; n++) systems[NAMES[n]] = round(buckets[NAMES[n]]);
          if (context) { try { ctx = context(); } catch (e) { ctx = null; } }
          if (dips.length >= 60) dips.shift();
          dips.push({
            ms: round(total), systems: systems,
            mph: ctx && ctx.mph || 0, district: ctx && ctx.district || 'open',
            nos: !!(ctx && ctx.nos), air: !!(ctx && ctx.air),
            draws: draws, objects: objects
          });
        }
        running = false;
        if (stats) { try { stats.end(); } catch (e) { stats = null; } }
        return total;
      },
      snapshot: function () {
        var n = Math.min(count, MAX), arr = [], sums = {}, start = head - n, s, j;
        for (s = 0; s < NAMES.length; s++) sums[NAMES[s]] = 0;
        for (j = 0; j < n; j++) {
          var slot = ((start + j) % MAX + MAX) % MAX;
          arr.push(ring[slot]);
          for (s = 0; s < NAMES.length; s++) sums[NAMES[s]] += cols[NAMES[s]][slot];
        }
        var sorted = arr.slice().sort(function (a, b) { return a - b; });
        var mean = n ? arr.reduce(function (a, b) { return a + b; }, 0) / n : 0;
        var systems = {};
        for (s = 0; s < NAMES.length; s++) systems[NAMES[s]] = round(n ? sums[NAMES[s]] / n : 0);
        var cv = g.document && g.document.getElementById ? g.document.getElementById('c') : null;
        var probe = null;
        if (typeof g.ZD_PERF_PROBE === 'function') {
          try { probe = g.ZD_PERF_PROBE(); } catch (e) { probe = { error: String(e && e.message || e) }; }
        }
        var gl = null;
        try { if (g.GLCITY && g.GLCITY.stats) gl = g.GLCITY.stats(); } catch (e) { gl = { error: String(e && e.message || e) }; }
        var heap = null;
        try { if (performance.memory) heap = Math.round(performance.memory.usedJSHeapSize / 1048576); } catch (e) {}
        return {
          frames: n,
          budget: budget,
          closedMs: round(closed),
          ms: { avg: round(mean), p95: round(pct(sorted, 0.95)), p99: round(pct(sorted, 0.99)), worst: round(sorted.length ? sorted[sorted.length - 1] : 0) },
          fps: {
            avg: mean > 0 ? round(1000 / mean) : 0,
            p95: pct(sorted, 0.95) > 0 ? round(1000 / pct(sorted, 0.95)) : 0,
            p99: pct(sorted, 0.99) > 0 ? round(1000 / pct(sorted, 0.99)) : 0,
            worst: sorted.length && sorted[sorted.length - 1] > 0 ? round(1000 / sorted[sorted.length - 1]) : 0
          },
          systems: systems,
          series: arr,
          dips: dips.length,
          draws: draws,
          objects: objects,
          heapMB: heap,
          canvas: cv ? { w: cv.width, h: cv.height, cssW: cv.clientWidth, cssH: cv.clientHeight, dpr: g.devicePixelRatio || 1 } : { w: 0, h: 0, cssW: 0, cssH: 0, dpr: g.devicePixelRatio || 1 },
          gl: gl,
          probe: probe
        };
      },
      dips: function () { return dips.slice(); },
      reset: function () { head = 0; count = 0; dips.length = 0; closed = 0; },
      frameSums: function () {
        var n = Math.min(count, MAX), start = head - n, out = [], j, s, slot, sum;
        for (j = 0; j < n; j++) {
          slot = ((start + j) % MAX + MAX) % MAX;
          sum = 0;
          for (s = 0; s < NAMES.length; s++) sum += cols[NAMES[s]][slot];
          out.push({ total: ring[slot], sum: sum });
        }
        return out;
      }
    };
    return api;
  }
  g.ZD_PERF_FACTORY = create;
})(window);
