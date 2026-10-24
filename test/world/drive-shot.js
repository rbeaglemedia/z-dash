/* Still frames for the /test/ drive. Runs only when the address has ?shot=1.
   Parks the 370Z on Car Row and records five frame gaps. No shadowBlur. */
'use strict';
(function () {
  var q;
  try { q = new URLSearchParams(location.search); } catch (e) { return; }
  if (q.get('shot') !== '1') return;
  var label = q.get('label') || 'test';

  function banner() {
    if (document.getElementById('zdShotLabel')) return;
    var el = document.createElement('div');
    el.id = 'zdShotLabel';
    el.textContent = label + ' · Boulevards · 370Z · /test/';
    el.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:70;max-width:92vw;text-align:center;background:#12081c;color:#ffe14d;border:2px solid #3ee6ff;border-radius:12px;padding:8px 14px;font:700 14px Orbitron,sans-serif;letter-spacing:0.4px;pointer-events:none';
    (document.body || document.documentElement).appendChild(el);
  }

  function park() {
    var over = document.getElementById('kOver');
    if (over) over.classList.add('hidden');
    var kid = document.getElementById('kid');
    if (kid) kid.setAttribute('data-tab', 'drive');
    try { flying = true; } catch (e) {}
    if (typeof P !== 'undefined') {
      P.x = 80;
      P.z = 2260;
      P.y = 0.4;
      P.yaw = Math.PI / 2;
      P.hd = Math.PI / 2;
      P.v = 0;
      P.ground = true;
      P.pitch = 0;
      P.bank = 0;
    }
    if (window.FLYCAM) {
      FLYCAM.back = 4.8;
      FLYCAM.up = 1.35;
      FLYCAM.orbit = null;
    }
    banner();
  }

  function carReady() {
    try {
      return !!(window.ZD && ZD.Xray && ZD.Xray.ready && window.ZGL && ZGL.ensure && ZGL.ensure());
    } catch (e) { return false; }
  }

  var frames = [];
  var last = 0;
  var n = 0;
  var armed = false;
  function finish(car) {
    window.__zdShot = {
      label: label,
      samples: frames.slice(Math.max(0, frames.length - 5)),
      car: car,
      x: typeof P !== 'undefined' ? P.x : null,
      z: typeof P !== 'undefined' ? P.z : null
    };
  }
  function tick(t) {
    n++;
    park();
    if (!armed) {
      if (carReady() && document.querySelector('canvas')) armed = true;
      else if (n > 480) { finish(false); return; }
      else { requestAnimationFrame(tick); return; }
    }
    if (last) frames.push(t - last);
    last = t;
    if (frames.length < 8) requestAnimationFrame(tick);
    else finish(true);
  }
  function start() { requestAnimationFrame(tick); }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
