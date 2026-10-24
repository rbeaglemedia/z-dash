'use strict';
/* Kill switches. Each one puts a single flag back when turned off.
   traffic / minimap / weather / trails are read by the game as window.ZD_KILL.*.
   glow patches Canvas shadowBlur and GLCITY.glow, then restores the original descriptor.
   far buildings sets CDRAW.nofar, which city-draw.js already honors, then deletes it. */
(function (g) {
  var NAMES = ['traffic', 'glow', 'minimap', 'weather', 'trails', 'far'];
  function flags() {
    if (!g.ZD_KILL) g.ZD_KILL = { traffic: false, glow: false, minimap: false, weather: false, trails: false, far: false };
    return g.ZD_KILL;
  }
  function glow(on) {
    var proto = g.CanvasRenderingContext2D && g.CanvasRenderingContext2D.prototype;
    if (!proto) return;
    if (on) {
      if (proto.__zdGlowDesc) return;
      var d = Object.getOwnPropertyDescriptor(proto, 'shadowBlur');
      if (!d || typeof d.set !== 'function') return;
      proto.__zdGlowDesc = d;
      Object.defineProperty(proto, 'shadowBlur', {
        configurable: true,
        enumerable: !!d.enumerable,
        get: function () { return d.get ? d.get.call(this) : 0; },
        set: function () { d.set.call(this, 0); }
      });
      if (g.GLCITY) {
        if (!Object.prototype.hasOwnProperty.call(g.GLCITY, '__zdGlow0')) g.GLCITY.__zdGlow0 = g.GLCITY.glow;
        g.GLCITY.glow = false;
      }
    } else if (proto.__zdGlowDesc) {
      Object.defineProperty(proto, 'shadowBlur', proto.__zdGlowDesc);
      delete proto.__zdGlowDesc;
      if (g.GLCITY && Object.prototype.hasOwnProperty.call(g.GLCITY, '__zdGlow0')) {
        g.GLCITY.glow = g.GLCITY.__zdGlow0;
        delete g.GLCITY.__zdGlow0;
      }
    }
  }
  function far(on) {
    var C = g.CDRAW;
    if (!C) return;
    if (on) {
      if (!C.__zdFarSaved) C.__zdFarSaved = { has: Object.prototype.hasOwnProperty.call(C, 'nofar'), value: C.nofar };
      C.nofar = true;
    } else if (C.__zdFarSaved) {
      if (C.__zdFarSaved.has) C.nofar = C.__zdFarSaved.value;
      else delete C.nofar;
      delete C.__zdFarSaved;
    }
  }
  function set(name, on) {
    if (NAMES.indexOf(name) < 0) return;
    flags()[name] = !!on;
    if (name === 'glow') glow(!!on);
    if (name === 'far') far(!!on);
  }
  g.ZD_KILLS = {
    names: NAMES.slice(),
    set: set,
    get: function (name) { return !!(g.ZD_KILL && g.ZD_KILL[name]); },
    allOff: function () { for (var i = 0; i < NAMES.length; i++) set(NAMES[i], false); },
    snapshot: function () {
      var out = {}, i;
      for (i = 0; i < NAMES.length; i++) out[NAMES[i]] = !!(g.ZD_KILL && g.ZD_KILL[i] !== undefined && g.ZD_KILL[NAMES[i]]);
      for (i = 0; i < NAMES.length; i++) out[NAMES[i]] = !!(g.ZD_KILL && g.ZD_KILL[NAMES[i]]);
      out.nofar = g.CDRAW ? g.CDRAW.nofar : undefined;
      out.nofarOwn = !!(g.CDRAW && Object.prototype.hasOwnProperty.call(g.CDRAW, 'nofar'));
      var desc = g.CanvasRenderingContext2D && Object.getOwnPropertyDescriptor(g.CanvasRenderingContext2D.prototype, 'shadowBlur');
      out.glowPatched = !!(g.CanvasRenderingContext2D && g.CanvasRenderingContext2D.prototype.__zdGlowDesc);
      out.shadowSet = desc && desc.set ? true : false;
      return out;
    }
  };
})(window);
