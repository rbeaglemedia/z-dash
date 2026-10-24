'use strict';
/* In-memory tune layers. Never writes shared/tune.js and never touches the game's save keys.
   The live TUNE object is restored from PRESETS.wings, then the active layers are copied on.
   Speed is applied after the physics draft, so a test cap wins on the keys it sets. */
(function (g) {
  var MPH = 2.2369362920544;
  var frozen = null;
  var layers = {};
  var speedMph = null;
  function seed() {
    var src = (g.PRESETS && g.PRESETS.wings) || g.TUNE || {};
    var out = {};
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      var v = src[k];
      if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string') out[k] = v;
    }
    return out;
  }
  function defaults() {
    if (!frozen) frozen = seed();
    return frozen;
  }
  function speedPatch(mph) {
    var b = defaults();
    var tune = layers.tune || {};
    var nos = +(tune.nosBoost != null ? tune.nosBoost : b.nosBoost);
    if (!(nos > 0.05)) nos = 1.6;
    var ms = (+mph) / MPH / nos;
    return { maxSpeed: ms, airCruiseMax: ms, ovV: ms * 0.9 };
  }
  function apply() {
    var t = g.TUNE;
    if (!t) return;
    var b = defaults(), k, name;
    for (k in b) t[k] = b[k];
    var order = ['tune', 'speed'];
    for (var i = 0; i < order.length; i++) {
      var patch = layers[order[i]];
      if (!patch) continue;
      for (k in patch) t[k] = patch[k];
    }
    for (name in layers) {
      if (name === 'tune' || name === 'speed') continue;
      var extra = layers[name];
      if (!extra) continue;
      for (k in extra) t[k] = extra[k];
    }
  }
  g.ZD_OVR = {
    MPH: MPH,
    defaults: function () {
      var d = defaults(), c = {}, k;
      for (k in d) c[k] = d[k];
      return c;
    },
    speedPatch: speedPatch,
    speedMph: function () { return speedMph; },
    set: function (name, patch) {
      if (name === 'speed' && patch && patch.__mph != null) {
        speedMph = +patch.__mph;
        patch = speedPatch(speedMph);
      }
      layers[name] = patch;
      if (name === 'tune' && speedMph != null) layers.speed = speedPatch(speedMph);
      apply();
    },
    clear: function (name) {
      delete layers[name];
      if (name === 'speed') speedMph = null;
      if (name === 'tune' && speedMph != null) layers.speed = speedPatch(speedMph);
      apply();
    },
    layer: function (name) { return layers[name] || null; },
    active: function () { return Object.keys(layers); },
    matchesDefaults: function () {
      var t = g.TUNE, b = defaults(), k;
      if (!t) return true;
      for (k in b) if (t[k] !== b[k]) return false;
      return true;
    }
  };
})(window);
