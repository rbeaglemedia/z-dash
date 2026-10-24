'use strict';
/* Character Viewer agent bc-fb37f92e mounts at ZD_TOOL_MODULES.character
   or ships test/viewer.html with window.__VIEWER { ready, setModel, setEq, setAngle, setCompare, toggle, anatomy, fps, shotDataURL }.
   Car, building, and DEV Builder (agent bc-40642464, branch cursor/planner-port-plan-cbd5) use the same slot. */
(function (g) {
  var PAGES = {
    character: {
      page: 'viewer.html',
      agent: 'bc-fb37f92e',
      contract: 'ZD_TOOL_MODULES.character.mount(host, ctx). Fallback page test/viewer.html. window.__VIEWER fields: ready, setModel, setEq, setAngle, setCompare, toggle, anatomy, fps, shotDataURL.'
    },
    car: {
      page: 'car-spinner.html',
      agent: 'bc-fb37f92e',
      contract: 'ZD_TOOL_MODULES.car.mount(host, ctx). Fallback page test/car-spinner.html. Garage and Neon Paint open in the game frame.'
    },
    building: {
      page: 'building-viewer.html',
      agent: 'bc-fb37f92e',
      contract: 'ZD_TOOL_MODULES.building.mount(host, ctx). Fallback page test/building-viewer.html.'
    },
    builder: {
      page: 'builder.html',
      agent: 'bc-40642464',
      contract: 'ZD_TOOL_MODULES.builder.mount(host, ctx). Fallback page test/builder.html from cursor/planner-port-plan-cbd5.'
    }
  };
  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function placeholder(host, ctx, id) {
    var info = PAGES[id];
    var doc = host.ownerDocument;
    host.innerHTML = '';
    var p = el(doc, 'p', 'zd-msg', info.contract + ' Agent ' + info.agent + '. Dropping the page or the module into this slot needs no hub change. The game is still running.');
    p.setAttribute('data-slot', id);
    host.appendChild(p);
    if (id === 'car') {
      var row = el(doc, 'div', 'zd-row');
      [['Garage', '/garage-hub.html'], ['Neon Paint', '/neon-paint.html']].forEach(function (pair) {
        var b = el(doc, 'button', 'zd-btn', pair[0]);
        b.type = 'button';
        b.setAttribute('data-open', pair[1]);
        b.addEventListener('click', function () {
          try { ctx.open(pair[1] + (pair[1].indexOf('?') >= 0 ? '&' : '?') + 'zdhub=1'); }
          catch (e) { if (ctx.notify) ctx.notify(e); }
        });
        row.appendChild(b);
      });
      host.appendChild(row);
    }
  }
  function mount(id, host, ctx) {
    var doc = host.ownerDocument;
    host.innerHTML = '';
    var mod = g.ZD_TOOL_MODULES && g.ZD_TOOL_MODULES[id];
    if (mod && typeof mod.mount === 'function') return mod.mount(host, ctx) || function () {};
    var info = PAGES[id];
    if (!info) {
      host.appendChild(el(doc, 'p', 'zd-msg', 'Unknown tool. The game is still running.'));
      return function () {};
    }
    var url = ctx.asset(info.page);
    var frame = null;
    var cancelled = false;
    fetch(url, { method: 'GET', cache: 'no-store' }).then(function (res) {
      if (cancelled) return;
      if (!res.ok) { placeholder(host, ctx, id); return; }
      host.innerHTML = '';
      frame = el(doc, 'iframe', 'zd-slot');
      frame.title = id;
      frame.src = url;
      host.appendChild(frame);
      if (id === 'car') placeholder(host, ctx, id);
    }).catch(function (e) {
      if (cancelled) return;
      placeholder(host, ctx, id);
      if (ctx.notify) ctx.notify(e && e.message ? e.message : e);
    });
    return function () { cancelled = true; if (frame && frame.parentNode) frame.parentNode.removeChild(frame); };
  }
  g.ZD_SLOTS = {
    mount: function (host, ctx) { return mount('character', host, ctx); },
    character: function (host, ctx) { return mount('character', host, ctx); },
    car: function (host, ctx) { return mount('car', host, ctx); },
    building: function (host, ctx) { return mount('building', host, ctx); },
    builder: function (host, ctx) { return mount('builder', host, ctx); }
  };
})(window);
