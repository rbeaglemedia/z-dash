'use strict';
/* Device PIN. The hash stays in localStorage. The PIN is never written into the repo or the page. */
(function (g) {
  var script = g.document.currentScript;
  var base = (script && script.src) ? script.src.replace(/unlock\.js(?:\?.*)?$/, '') : '';
  function sha(pin) {
    var data = new TextEncoder().encode('zdash-dev-v1:' + pin);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      var bytes = new Uint8Array(buf), out = '', i;
      for (i = 0; i < bytes.length; i++) out += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
      return out;
    });
  }
  function fail(msg) {
    var b = g.document.getElementById('zd-banner');
    if (!b) {
      b = g.document.createElement('div');
      b.id = 'zd-banner';
      b.setAttribute('role', 'alert');
      (g.document.body || g.document.documentElement).appendChild(b);
    }
    b.hidden = false;
    b.textContent = msg;
  }
  if (!g.crypto || !g.crypto.subtle) {
    fail('Could not save the PIN on this browser. The game is still running.');
    return;
  }
  var existing = null;
  try { existing = g.localStorage.getItem('zdash.dev.pin'); } catch (e) {}
  var creating = !existing;
  var first = '';
  var digits = '';
  var root = g.document.getElementById('zd-gate') || g.document.body || g.document.documentElement;
  var box = g.document.createElement('div');
  box.id = 'zd-pin';
  var title = g.document.createElement('p');
  title.className = 'zd-msg';
  title.id = 'zd-pin-title';
  title.textContent = creating ? 'Create a dev PIN for this device' : 'Enter the dev PIN';
  var dots = g.document.createElement('p');
  dots.className = 'zd-dots';
  dots.id = 'zd-pin-dots';
  dots.textContent = '····';
  var keys = g.document.createElement('div');
  keys.className = 'zd-keys';
  box.appendChild(title);
  box.appendChild(dots);
  box.appendChild(keys);
  root.appendChild(box);
  function paint() {
    var shown = '';
    for (var i = 0; i < 4; i++) shown += i < digits.length ? '●' : '·';
    dots.textContent = shown;
  }
  function done() {
    try { g.localStorage.setItem('zdash.dev.unlock', '1'); } catch (e) { fail('Could not save the unlock on this browser. The game is still running.'); return; }
    if (typeof g.ZD_UNLOCK_DONE === 'function') { g.ZD_UNLOCK_DONE(); return; }
    var s = g.document.createElement('script');
    s.src = base + 'hook.js';
    s.async = false;
    s.onerror = function () { fail('A dev tool failed to load (hook.js). The game is still running.'); };
    g.document.head.appendChild(s);
  }
  function submit() {
    var pin = digits;
    digits = '';
    paint();
    sha(pin).then(function (hash) {
      if (creating && !first) {
        first = hash;
        title.textContent = 'Enter it again';
        return;
      }
      if (creating && first !== hash) {
        first = '';
        title.textContent = 'Those did not match. Create a PIN';
        return;
      }
      if (!creating && hash !== existing) {
        title.textContent = 'Wrong PIN. The tools stay locked.';
        return;
      }
      if (creating) {
        try { g.localStorage.setItem('zdash.dev.pin', hash); } catch (e) { fail('Could not save the PIN on this browser. The game is still running.'); return; }
      }
      title.textContent = 'Unlocked on this device';
      done();
    }).catch(function () {
      fail('Could not save the PIN on this browser. The game is still running.');
    });
  }
  function press(n) {
    if (digits.length >= 4) return;
    digits += String(n);
    paint();
    if (digits.length === 4) submit();
  }
  for (var n = 1; n <= 9; n++) add(n);
  add(0);
  function add(n) {
    var b = g.document.createElement('button');
    b.type = 'button';
    b.className = 'zd-btn';
    b.setAttribute('data-key', String(n));
    b.textContent = String(n);
    b.addEventListener('click', function () { press(n); });
    keys.appendChild(b);
  }
})(window);
