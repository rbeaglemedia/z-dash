/* Kid App seam.
   The menu does not load the adult driver (3D car, Spotify, OBD, dashboard shell).
   ZD.kidLoad(group) fetches those files only when a tile opens them.
   The settings gear does not call kidLoad. Kid settings is shared/app-settings.js.
   Shared data stays in localStorage so a future real-drive sync does not need this page
   to load OBD or index.html. This file never writes those keys and never opens a socket. */
(function () {
  var ZD = (window.ZD = window.ZD || {});

  ZD.seam = {
    kidKey: 'zdash.kid.v1',
    /* Future handoff. Adult index.html does not write this yet.
       A later driver sync or server can set { "shifts": <number> }.
       The kid profile (zdash.kid.v1) keeps its current shape. */
    driveKey: 'zdash.drives.v1',
    read: function (key) {
      try { return JSON.parse(localStorage.getItem(key) || 'null') || {}; }
      catch (e) { return {}; }
    },
    kid: function () { return this.read(this.kidKey); },
    drives: function () { return this.read(this.driveKey); },
    driveShifts: function () {
      var n = Number(this.drives().shifts);
      return n > 0 ? n : 0;
    },
    shifts: function () {
      var n = Number(this.kid().shifts);
      return (n > 0 ? n : 0) + this.driveShifts();
    }
  };

  var GROUPS = {
    play: [
      ['driver/car.js'],
      ['driver/simcar.js'],
      ['driver/scorer.js'],
      ['driver/draw.js'],
      ['driver/embed.js'],
      ['driver/three.module.js', 'module'],
      ['driver/sim-source.js']
    ],
    music: [['driver/music.js']],
    paint: [['world/neon-paint.js?v=28']],
    adult: [
      ['driver/car.js'],
      ['driver/simcar.js'],
      ['driver/scorer.js'],
      ['driver/draw.js'],
      ['driver/embed.js'],
      ['driver/three.module.js', 'module'],
      ['driver/sim-source.js'],
      ['driver/music.js'],
      ['driver/dyno.js'],
      ['driver/codes.js'],
      ['driver/fuel.js'],
      ['driver/extras.js'],
      ['driver/logger.js'],
      ['driver/layout.js'],
      ['driver/clutch.js'],
      ['driver/recorder.js'],
      ['driver/obd-source.js'],
      ['driver/xray.js'],
      ['driver/shell.js'],
      ['driver/qrcode.js'],
      ['driver/jsqr.js'],
      ['driver/link.js']
    ]
  };

  var chain = Promise.resolve();
  var done = Object.create(null);

  function loadOne(url, type) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      if (type) s.type = type;
      s.async = false;
      s.src = url;
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error('kidLoad ' + url)); };
      document.head.appendChild(s);
    });
  }

  function loadGroup(name) {
    var list = GROUPS[name];
    if (!list) return Promise.resolve();
    var run = chain.then(function () {
      var p = Promise.resolve();
      list.forEach(function (item) {
        p = p.then(function () {
          var url = item[0];
          if (done[url]) return done[url];
          var job = loadOne(url, item[1]);
          done[url] = job;
          return job;
        });
      });
      return p;
    });
    chain = run.then(function () { }, function () { });
    return run;
  }

  ZD.kidLoad = function (name) {
    if (!/jr\.html$/.test(location.pathname || '')) return Promise.resolve();
    return loadGroup(name);
  };

  try {
    var q = new URLSearchParams(location.search);
    if ((q.get('code') || q.get('error')) && /jr\.html$/.test(location.pathname || '')) ZD.kidLoad('music');
  } catch (e) {}
})();
