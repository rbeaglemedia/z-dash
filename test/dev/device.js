'use strict';
(function (g) {
  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function row(doc, dl, name, value) {
    dl.appendChild(el(doc, 'dt', '', name));
    dl.appendChild(el(doc, 'dd', '', value == null ? 'n/a' : String(value)));
  }
  function mount(host, ctx) {
    var doc = host.ownerDocument;
    host.innerHTML = '';
    var dl = el(doc, 'dl', 'zd-device');
    dl.id = 'zd-device';
    var nav = g.navigator || {};
    var game = null;
    try { game = ctx.game(); } catch (e) { game = null; }
    var cv = game && game.document && game.document.getElementById('c');
    var glInfo = 'n/a';
    try {
      var probe = doc.createElement('canvas');
      var gl = probe.getContext('webgl') || probe.getContext('experimental-webgl');
      if (gl) {
        var ext = gl.getExtension('WEBGL_debug_renderer_info');
        glInfo = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      }
    } catch (e) { glInfo = 'unavailable'; }
    var pad = '';
    try { pad = getComputedStyle(doc.documentElement).getPropertyValue('env(safe-area-inset-top)') || ''; } catch (e) {}
    row(doc, dl, 'viewport', g.innerWidth + ' × ' + g.innerHeight);
    row(doc, dl, 'dpr', g.devicePixelRatio || 1);
    row(doc, dl, 'touch', (nav.maxTouchPoints || 0) > 0 ? 'yes (' + nav.maxTouchPoints + ')' : 'no');
    row(doc, dl, 'hover', g.matchMedia && g.matchMedia('(hover: hover)').matches ? 'yes' : 'no');
    row(doc, dl, 'deviceMemory', nav.deviceMemory == null ? 'n/a' : nav.deviceMemory + ' GB');
    row(doc, dl, 'cores', nav.hardwareConcurrency || 'n/a');
    row(doc, dl, 'webgl', glInfo);
    row(doc, dl, 'ua', nav.userAgent || '');
    row(doc, dl, 'safe area top', pad || '0');
    row(doc, dl, 'connection', nav.connection && nav.connection.effectiveType || 'n/a');
    row(doc, dl, 'game canvas', cv ? (cv.width + ' × ' + cv.height) : 'none');
    host.appendChild(dl);
    host.appendChild(el(doc, 'p', 'zd-msg', 'Free tools to use alongside this page: Chrome remote debugging of an Android phone at chrome://inspect, the DevTools Performance panel, and the Spector button on FPS Lab.'));
    return function () {};
  }
  g.ZD_DEVICE = { mount: mount };
})(window);
