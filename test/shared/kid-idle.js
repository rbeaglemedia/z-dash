/* Kid App background audit. Loaded by the /test/ kid pages only.
   Records timers, network, channels, and motion listeners so ?perf=1 can list
   what is still active. Tilt (deviceorientation) is the driving control and is
   reported separately. This file does not start Spotify, OBD, or any link. */
(function () {
  var Z = window.Z_BG = window.Z_BG || { iv: [], to: [], net: [], ch: [], sensors: [], pm: 0 };
  var si = window.setInterval.bind(window);
  var ci = window.clearInterval.bind(window);
  var st = window.setTimeout.bind(window);
  var ct = window.clearTimeout.bind(window);
  function from() {
    try {
      var s = (new Error()).stack.split('\n');
      var line = '';
      for (var i = 0; i < s.length; i++) if (/world\/|jr\.html|shared\/|fly3|dance|neon|crew|garage/.test(s[i])) { line = s[i]; break; }
      if (!line) line = s[3] || '';
      return line.replace(/\s+/g, ' ').slice(0, 160);
    } catch (e) { return ''; }
  }
  window.setInterval = function (fn, ms) {
    var row = { ms: +ms || 0, from: from(), n: 0, self: !!(fn && fn.name === 'zIdlePaint') };
    var id = si(function () { row.n++; return fn.apply(this, arguments); }, ms);
    row.id = id; Z.iv.push(row); return id;
  };
  window.clearInterval = function (id) {
    Z.iv = Z.iv.filter(function (r) { return r.id !== id; });
    return ci(id);
  };
  window.setTimeout = function (fn, ms) {
    var row = { ms: +ms || 0, from: from(), live: 1 };
    var id = st(function () { row.live = 0; return fn.apply(this, arguments); }, ms);
    row.id = id; Z.to.push(row);
    if (Z.to.length > 24) Z.to = Z.to.filter(function (r) { return r.live; }).concat(Z.to.slice(-8));
    return id;
  };
  window.clearTimeout = function (id) {
    var i; for (i = 0; i < Z.to.length; i++) if (Z.to[i].id === id) Z.to[i].live = 0;
    return ct(id);
  };
  var f = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var u = typeof input === 'string' ? input : (input && input.url) || '';
    if (/^(data:|blob:)/.test(u)) return f(input, init);
    var rec = { kind: 'fetch', url: String(u).slice(0, 180), live: 1 };
    Z.net.push(rec);
    if (Z.net.length > 40) Z.net = Z.net.slice(-40);
    return f(input, init).then(function (r) { rec.live = 0; rec.status = r.status; return r; }, function (e) { rec.live = 0; rec.status = 'err'; throw e; });
  };
  var WS = window.WebSocket;
  if (WS) {
    var W = function (url, proto) {
      var rec = { kind: 'ws', url: String(url).slice(0, 180), live: 1 };
      Z.net.push(rec);
      var ws = proto !== undefined ? new WS(url, proto) : new WS(url);
      ws.addEventListener('close', function () { rec.live = 0; });
      return ws;
    };
    W.prototype = WS.prototype;
    window.WebSocket = W;
  }
  var BC = window.BroadcastChannel;
  if (BC) {
    var C = function (name) {
      var rec = { name: String(name), live: 1 };
      Z.ch.push(rec);
      var ch = new BC(name);
      var close = ch.close.bind(ch);
      ch.close = function () { rec.live = 0; return close(); };
      return ch;
    };
    C.prototype = BC.prototype;
    window.BroadcastChannel = C;
  }
  var ael = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opt) {
    if (type === 'deviceorientation' || type === 'devicemotion' || type === 'deviceorientationabsolute') {
      Z.sensors.push({ type: type, ok: type === 'deviceorientation' ? 1 : 0, from: from() });
    }
    return ael.call(this, type, fn, opt);
  };
  var rel = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function (type, fn, opt) {
    if (type === 'devicemotion' || type === 'deviceorientationabsolute') {
      Z.sensors = Z.sensors.filter(function (s) { return s.type !== type; });
    }
    return rel.call(this, type, fn, opt);
  };
  var geo = navigator.geolocation;
  if (geo && geo.getCurrentPosition) {
    var watch = geo.watchPosition && geo.watchPosition.bind(geo);
    var once = geo.getCurrentPosition.bind(geo);
    geo.getCurrentPosition = function () { Z.net.push({ kind: 'geo', url: 'geolocation', live: 1 }); return once.apply(geo, arguments); };
    if (watch) geo.watchPosition = function () { Z.net.push({ kind: 'geo-watch', url: 'geolocation', live: 1 }); return watch.apply(geo, arguments); };
  }
  if (navigator.bluetooth && navigator.bluetooth.requestDevice) {
    var rd = navigator.bluetooth.requestDevice.bind(navigator.bluetooth);
    navigator.bluetooth.requestDevice = function () { Z.net.push({ kind: 'bluetooth', url: 'requestDevice', live: 1 }); return rd.apply(navigator.bluetooth, arguments); };
  }
  if (navigator.serial && navigator.serial.requestPort) {
    var rp = navigator.serial.requestPort.bind(navigator.serial);
    navigator.serial.requestPort = function () { Z.net.push({ kind: 'serial', url: 'requestPort', live: 1 }); return rp.apply(navigator.serial, arguments); };
  }
  if (navigator.getBattery) {
    var gb = navigator.getBattery.bind(navigator);
    navigator.getBattery = function () { Z.net.push({ kind: 'battery', url: 'getBattery', live: 0 }); return gb(); };
  }
  var pm = window.postMessage.bind(window);
  window.postMessage = function () { Z.pm++; return pm.apply(window, arguments); };
  if (window.ServiceWorker && ServiceWorker.prototype.postMessage) {
    var sp = ServiceWorker.prototype.postMessage;
    ServiceWorker.prototype.postMessage = function (msg) {
      Z.pm++;
      Z.net.push({ kind: 'postMessage', url: String(msg).slice(0, 80), live: 0 });
      return sp.apply(this, arguments);
    };
  }
  Z.line = function () {
    var iv = Z.iv.filter(function (r) { return !r.self; });
    var net = Z.net.filter(function (n) { return n.live; });
    var ch = Z.ch.filter(function (c) { return c.live; });
    var seen = {}, sens = [];
    Z.sensors.forEach(function (s) { if (s.ok || seen[s.type]) return; seen[s.type] = 1; sens.push(s.type); });
    var tilt = Z.sensors.some(function (s) { return s.ok && s.type === 'deviceorientation'; });
    function host(u) {
      u = String(u || '');
      if (/^(data:|blob:)/.test(u)) return '';
      return u.slice(0, 72);
    }
    return 'idle iv ' + (iv.length ? iv.map(function (r) { return r.ms + 'ms'; }).join(',') : '0')
      + ' · ch ' + (ch.length ? ch.map(function (c) { return c.name; }).join(',') : '0')
      + ' · net ' + (net.length ? net.map(function (n) { return n.kind + ' ' + (host(n.url) || ''); }).join(' | ') : '0')
      + ' · sensor ' + (sens.length ? sens.join(',') : '0')
      + (tilt ? ' · tilt on' : '')
      + (Z.pm ? ' · pm ' + Z.pm : '');
  };
  if (!/[?&]perf=1(?:&|$)/.test(location.search)) return;
  var watch = si(function zIdlePaint() {
    if (document.getElementById('zPerf')) {
      ci(watch);
      Z.iv = Z.iv.filter(function (r) { return r.id !== watch; });
      var old = document.getElementById('zIdle'); if (old) old.remove();
      return;
    }
    var el = document.getElementById('zIdle');
    if (!el && document.body) {
      el = document.createElement('div');
      el.id = 'zIdle';
      el.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:400;pointer-events:none;padding:6px 8px;border:1px solid #3ee6ff;border-radius:8px;background:rgba(5,2,12,.88);color:#d7fff8;font:700 11px/1.35 ui-monospace,monospace;white-space:pre-line;max-width:460px';
      document.body.appendChild(el);
    }
    if (el) el.textContent = Z.line();
  }, 500);
})();
