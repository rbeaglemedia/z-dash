/* Shared settings keys for the Kid App and the adult dash.
   Adult index.html does not load this file. It keeps its own settings screen
   and writes these same localStorage keys itself. The Kid App settings screen
   reads and writes them here so a value set on either side is the value the
   other side already saves.

   Shared (this file):
     zdash.kid.v1 name field  — car name shown as "HI, ELLIE · NAME"
     zdash.music.vol          — 0–100, default 70
     zdash.music.muted        — "0" / "1"
     zdash.lowdetail          — "1" / "0"
     zdash.wake               — "1" / "0" (also ZD.wake when that script is on the page)
     speed units              — both apps show MPH. There is no saved units key.

   Kid-only (not here): zdash.kidFps, game locks, parent passcode, device role.
   Adult-only (not here): Spotify, OBD, CSV, drive logs, shift light, health,
   maintenance, fuel, sim replay, Stillen, drive-screen layout, join/share. */
(function () {
  var ZD = (window.ZD = window.ZD || {});
  var KID = 'zdash.kid.v1';

  function get(k, d) {
    try { var v = localStorage.getItem(k); return v == null ? d : v; }
    catch (e) { return d; }
  }
  function put(k, v) {
    try { localStorage.setItem(k, String(v)); } catch (e) {}
  }
  function kid() {
    try { return JSON.parse(localStorage.getItem(KID) || 'null') || {}; }
    catch (e) { return {}; }
  }

  ZD.prefs = {
    units: function () { return 'mph'; },
    name: function () {
      var n = kid().name;
      return String(n || 'MY Z').slice(0, 14);
    },
    /* profile, when passed, is the live kid save (every existing field).
       Only the name field changes. No new keys are added. */
    setName: function (name, profile) {
      var n = String(name || '').trim().toUpperCase().slice(0, 14);
      if (!n) return this.name();
      var p = kid();
      if (profile && typeof profile === 'object') {
        try { p = JSON.parse(JSON.stringify(profile)); } catch (e) { p = kid(); }
      }
      p.name = n;
      try { localStorage.setItem(KID, JSON.stringify(p)); } catch (e) {}
      return n;
    },
    vol: function () {
      return Math.max(0, Math.min(100, Math.round(+get('zdash.music.vol', '70') || 0)));
    },
    muted: function () { return get('zdash.music.muted', '0') === '1'; },
    setVol: function (v) {
      var n = Math.max(0, Math.min(100, Math.round(+v || 0)));
      var M = ZD.Music;
      if (M && M.setVol) return M.setVol(n);
      put('zdash.music.vol', n);
      if (n > 0) put('zdash.music.muted', '0');
      return n;
    },
    setMuted: function (on) {
      on = !!on;
      var M = ZD.Music;
      if (M && M.toggleMute && !!M.muted !== on) M.toggleMute();
      else {
        put('zdash.music.muted', on ? '1' : '0');
        if (M) { M.muted = on; if (M.pushVol) M.pushVol(); if (M.emit) M.emit(); }
      }
      return on;
    },
    low: function () { return get('zdash.lowdetail', '0') === '1'; },
    setLow: function (on) {
      on = !!on;
      if (ZD.perf && ZD.perf.set) ZD.perf.set('low', on);
      else put('zdash.lowdetail', on ? '1' : '0');
      return on;
    },
    wake: function () {
      if (ZD.wake) return !!ZD.wake.on;
      return get('zdash.wake', '1') !== '0';
    },
    setWake: function (on) {
      on = !!on;
      if (ZD.wake && ZD.wake.set) ZD.wake.set(on);
      else put('zdash.wake', on ? '1' : '0');
      return on;
    }
  };
})();
