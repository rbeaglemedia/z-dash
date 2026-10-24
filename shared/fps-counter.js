'use strict';
/* Shared FPS pill for test pages and tools.
   One-line include from a page at the site root (adventure.html and its test pages):
     <script src="shared/fps-counter.js"></script>
   From a page in /test/ (Tools hub, Character Viewer, car/building spinners, DEV Builder):
     <script src="../shared/fps-counter.js"></script>
   From a page in /test/dev/:
     <script src="../../shared/fps-counter.js"></script>
   Neon World already draws its own FPS (canvas on a phone, #pcFps on a desktop).
   This file loads there and does nothing, so the two never stack.
   The pill is the top-right corner, inside the safe area. If a control already
   owns that corner it stays in that column, just below the corner control
   (and below anything else hanging there). If that column stays blocked it
   sits beside the corner control, still on the right, and records the nudge. */
(function (g) {
  if (g.ZD_FPS_COUNTER) return;
  var doc = g.document;
  if (!doc || !doc.documentElement) return;

  function neonWorldAlreadyShowsFps() {
    if (doc.getElementById('pcFps')) return true;
    var list = doc.getElementsByTagName('script'), i, src;
    for (i = 0; i < list.length; i++) {
      src = list[i].getAttribute('src') || '';
      if (/world\/(?:hud|boot)\.js(?:\?|#|$)/.test(src)) return true;
    }
    return false;
  }

  if (neonWorldAlreadyShowsFps()) {
    g.ZD_FPS_COUNTER = { skipped: 'neon-world', el: null, nudge: '', place: function () {} };
    return;
  }
  if (doc.getElementById('zdFps')) {
    g.ZD_FPS_COUNTER = { skipped: 'already', el: doc.getElementById('zdFps'), nudge: '', place: function () {} };
    return;
  }

  var style = doc.createElement('style');
  style.id = 'zd-fps-style';
  style.textContent = ''
    + '#zdFps{position:fixed;top:calc(env(safe-area-inset-top,0px) + 6px);right:calc(env(safe-area-inset-right,0px) + 6px);'
    + 'z-index:80;pointer-events:none;margin:0;padding:2px 7px;border-radius:8px;'
    + 'border:1px solid rgba(232,255,244,.55);'
    + 'font:700 13px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;'
    + 'letter-spacing:.3px;color:#e8fff4;background:rgba(7,4,16,.86);'
    + 'text-shadow:none;white-space:nowrap;box-shadow:none}';
  (doc.head || doc.documentElement).appendChild(style);

  var el = doc.createElement('div');
  el.id = 'zdFps';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-label', 'Frames per second');
  el.textContent = '-- FPS';
  (doc.body || doc.documentElement).appendChild(el);

  var frames = 0;
  var t0 = 0;
  var started = false;
  var nudge = '';

  function nameOf(node) {
    if (!node) return 'control';
    if (node.id) return '#' + node.id;
    var cls = (node.className && String(node.className).split(/\s+/)[0]) || '';
    return (node.tagName || 'el').toLowerCase() + (cls ? '.' + cls : '');
  }
  function visible(node) {
    if (!node || node === el || el.contains(node)) return false;
    var st = g.getComputedStyle(node);
    if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity || '1') < 0.05) return false;
    var r = node.getBoundingClientRect();
    return r.width >= 8 && r.height >= 8;
  }
  function hit(a, b) {
    return a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
  }
  function controls() {
    return doc.querySelectorAll('button, a, input, select, textarea, [role="button"]');
  }
  function hits(box) {
    var nodes = controls(), out = [], i, r;
    for (i = 0; i < nodes.length; i++) {
      if (!visible(nodes[i])) continue;
      r = nodes[i].getBoundingClientRect();
      if (hit(box, r)) out.push({ rect: r, el: nodes[i] });
    }
    return out;
  }
  function cornerOwner(crowd) {
    var best = crowd[0], i;
    for (i = 1; i < crowd.length; i++) {
      if (crowd[i].rect.right > best.rect.right + 1) best = crowd[i];
      else if (Math.abs(crowd[i].rect.right - best.rect.right) <= 1 && crowd[i].rect.top < best.rect.top) best = crowd[i];
    }
    return best;
  }
  function noteNames(anchor, crowd) {
    var names = [nameOf(anchor.el)], i, n;
    for (i = 0; i < crowd.length; i++) {
      n = nameOf(crowd[i].el);
      if (names.indexOf(n) < 0) names.push(n);
    }
    return names.join(', ');
  }
  function commit(note) {
    nudge = note;
    el.setAttribute('data-nudge', note);
    api.nudge = note;
  }
  function dropBelow(anchor, seen, limit) {
    var gap = 6, floor = anchor.rect.bottom, guard = 0, blocked, i, next;
    el.style.right = '';
    el.style.top = Math.round(floor + gap) + 'px';
    blocked = hits(el.getBoundingClientRect());
    while (blocked.length && guard < 8 && floor + gap < limit) {
      next = floor;
      for (i = 0; i < blocked.length; i++) {
        seen.push(blocked[i]);
        if (blocked[i].rect.bottom > next) next = blocked[i].rect.bottom;
      }
      if (next <= floor) break;
      floor = next;
      el.style.top = Math.round(floor + gap) + 'px';
      blocked = hits(el.getBoundingClientRect());
      guard++;
    }
    return blocked;
  }
  function seekBeside(anchor, natural) {
    var gap = 6, edge = Math.round(anchor.rect.left - gap), guard = 0, jumped = [], blocked, j, leftMost, nextEdge;
    var minEdge = Math.round(g.innerWidth * 0.55);
    while (guard < 12 && edge >= minEdge) {
      el.style.top = Math.round(natural.top) + 'px';
      el.style.right = Math.round(g.innerWidth - edge) + 'px';
      blocked = hits(el.getBoundingClientRect());
      if (!blocked.length) return jumped;
      leftMost = blocked[0].rect.left;
      for (j = 0; j < blocked.length; j++) {
        jumped.push(blocked[j]);
        if (blocked[j].rect.left < leftMost) leftMost = blocked[j].rect.left;
      }
      nextEdge = Math.round(leftMost - gap);
      if (nextEdge >= edge) nextEdge = edge - 8;
      edge = nextEdge;
      guard++;
    }
    return null;
  }
  function place() {
    el.style.top = '';
    el.style.right = '';
    el.style.left = '';
    nudge = '';
    el.removeAttribute('data-nudge');
    var natural = el.getBoundingClientRect();
    var crowd = hits(natural);
    if (!crowd.length) { api.nudge = ''; return; }
    var anchor = cornerOwner(crowd);
    var seen = crowd.slice();
    var blocked = dropBelow(anchor, seen, g.innerHeight * 0.45);
    if (!blocked.length) { commit('below ' + noteNames(anchor, seen)); return; }
    var jumped = seekBeside(anchor, natural);
    if (jumped) { commit('beside ' + noteNames(anchor, crowd.concat(jumped))); return; }
    blocked = dropBelow(anchor, seen, g.innerHeight - 28);
    if (!blocked.length) { commit('below ' + noteNames(anchor, seen)); return; }
    commit('beside ' + nameOf(anchor.el));
  }

  function tick(now) {
    if (!started) { started = true; t0 = now; frames = 0; }
    frames++;
    if (now - t0 >= 500) {
      var fps = Math.round(frames * 1000 / (now - t0));
      var text = fps + ' FPS';
      if (el.textContent !== text) el.textContent = text;
      frames = 0;
      t0 = now;
    }
    g.requestAnimationFrame(tick);
  }

  var api = { skipped: '', el: el, nudge: '', place: place };
  g.ZD_FPS_COUNTER = api;
  place();
  g.addEventListener('resize', place);
  g.setTimeout(place, 400);
  g.setTimeout(place, 1400);
  g.requestAnimationFrame(tick);
})(window);
