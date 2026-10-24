'use strict';
/* Fixed 60s auto-drive. The car is moved along highway x=-450 then onto Car Row.
   Physics step() is skipped while drive is true so the route stays repeatable.
   Traffic, buildings, the car draw, and the HUD still run. */
(function (g) {
  var PATH = [
    { t: 0, x: -450, z: -200, y: 0.7, air: false, nos: false, mph: 80 },
    { t: 20, x: -450, z: 900, y: 0.7, air: false, nos: false, mph: 80 },
    { t: 28, x: -450, z: 1400, y: 0.7, air: false, nos: true, mph: 140 },
    { t: 35, x: -450, z: 1700, y: 28, air: true, nos: false, mph: 90 },
    { t: 42, x: -450, z: 2100, y: 0.7, air: false, nos: false, mph: 80 },
    { t: 60, x: 400, z: 2260, y: 0.7, air: false, nos: false, mph: 70 }
  ];
  var MPH = 2.2369362920544;
  function at(seconds) {
    var t = Math.max(0, Math.min(60, seconds));
    var i = 0;
    while (i < PATH.length - 2 && PATH[i + 1].t < t) i++;
    var a = PATH[i], b = PATH[Math.min(PATH.length - 1, i + 1)];
    var span = Math.max(0.001, b.t - a.t);
    var u = Math.max(0, Math.min(1, (t - a.t) / span));
    return {
      x: a.x + (b.x - a.x) * u,
      z: a.z + (b.z - a.z) * u,
      y: a.y + (b.y - a.y) * u,
      air: u < 0.5 ? a.air : b.air,
      nos: u < 0.5 ? a.nos : b.nos,
      mph: a.mph + (b.mph - a.mph) * u,
      yaw: Math.atan2(b.x - a.x, b.z - a.z)
    };
  }
  var elapsed = 0, seconds = 60, onScore = null, running = false;
  function place(p) {
    var P = g.P;
    if (!P) return;
    P.x = p.x; P.z = p.z; P.y = p.y; P.yaw = p.yaw; P.hd = p.yaw;
    P.v = p.mph / MPH; P.ground = !p.air; P.nosBurn = !!p.nos; P.nosT = p.nos ? 1 : 0;
    P.pitch = p.air ? -0.15 : 0; P.gam = P.pitch; P.bank = 0; P.wreck = null;
  }
  function tick(dt) {
    if (!running) return;
    elapsed += dt;
    place(at(elapsed));
    if (elapsed >= seconds) g.ZD_BENCH.stop();
  }
  function score() {
    var snap = g.ZD_PERF && g.ZD_PERF.snapshot ? g.ZD_PERF.snapshot() : null;
    var cv = g.document && g.document.getElementById('c');
    return {
      id: 'highway-west-v1',
      seconds: Math.round(elapsed * 10) / 10,
      asked: seconds,
      frames: snap ? snap.frames : 0,
      fps: snap ? snap.fps : null,
      ms: snap ? snap.ms : null,
      systems: snap ? snap.systems : null,
      dips: snap ? snap.dips : null,
      dpr: g.devicePixelRatio || 1,
      canvas: cv ? { w: cv.width, h: cv.height } : null
    };
  }
  g.ZD_BENCH = {
    drive: false,
    tick: null,
    path: 'highway-west-v1',
    at: at,
    last: null,
    start: function (opts) {
      opts = opts || {};
      seconds = Math.max(0.4, Math.min(60, +opts.seconds || 60));
      onScore = opts.onScore || null;
      elapsed = 0;
      running = true;
      this.drive = true;
      this.tick = tick;
      if (typeof g.flying !== 'undefined') g.flying = true;
      try {
        var over = g.document && g.document.getElementById('kOver');
        if (over) over.classList.add('hidden');
        var menu = g.document && g.document.getElementById('kMenuB');
        if (menu) menu.classList.remove('hidden');
      } catch (e) {}
      place(at(0));
      if (g.ZD_PERF && g.ZD_PERF.reset) g.ZD_PERF.reset();
    },
    stop: function () {
      if (!running && !this.drive) return this.last;
      running = false;
      this.drive = false;
      this.tick = null;
      this.last = score();
      var fn = onScore;
      onScore = null;
      if (fn) { try { fn(this.last); } catch (e) {} }
      return this.last;
    }
  };
})(window);
