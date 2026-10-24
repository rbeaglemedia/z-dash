'use strict';
(function (g) {
  var KEY = 'zdash.dev.ellie';
  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function read() {
    try { return JSON.parse(g.localStorage.getItem(KEY) || '[]') || []; }
    catch (e) { return []; }
  }
  function write(list) {
    var attempt = list.slice(-80);
    while (attempt.length) {
      try {
        g.localStorage.setItem(KEY, JSON.stringify(attempt));
        return attempt;
      } catch (e) {
        if (!attempt.length) break;
        var dropped = false;
        for (var i = 0; i < attempt.length; i++) {
          if (attempt[i].thumb) { attempt[i] = Object.assign({}, attempt[i]); delete attempt[i].thumb; dropped = true; break; }
        }
        if (!dropped) attempt.shift();
      }
    }
    throw new Error('Could not save that vote. Older votes are still here. The game is still running.');
  }
  function texts(doc, sel, n) {
    var nodes = doc.querySelectorAll(sel), out = [], i;
    for (i = 0; i < nodes.length && out.length < n; i++) {
      var t = (nodes[i].innerText || '').replace(/\s+/g, ' ').trim();
      if (t) out.push(t.slice(0, 80));
    }
    return out;
  }
  function thumb(game) {
    try {
      if (game.__VIEWER && typeof game.__VIEWER.shotDataURL === 'function') {
        var shot = game.__VIEWER.shotDataURL();
        if (shot) return shot;
      }
    } catch (e) {}
    try {
      var doc = game.document;
      var c = doc.getElementById('c') || doc.querySelector('canvas');
      if (!c || !c.width || !c.height) return '';
      var s = doc.createElement('canvas');
      s.width = 160;
      s.height = Math.max(1, Math.round(160 * c.height / c.width));
      s.getContext('2d').drawImage(c, 0, 0, s.width, s.height);
      return s.toDataURL('image/jpeg', 0.5);
    } catch (e) { return ''; }
  }
  function viewer(game) {
    var v = game.__VIEWER;
    if (!v) return null;
    var out = {};
    ['ready', 'model', 'eq', 'angle', 'anatomy'].forEach(function (k) {
      if (v[k] != null && typeof v[k] !== 'function') out[k] = v[k];
    });
    return out;
  }
  function cast(vote, ctx) {
    var game = ctx.game();
    if (!game || !game.document) throw new Error('Nothing is on screen to vote on yet.');
    var doc = game.document;
    var item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      t: new Date().toISOString(),
      vote: vote,
      href: game.location.href,
      title: doc.title || '',
      headings: texts(doc, 'h1, h2, h3', 8),
      on: texts(doc, 'button.on, .on', 12),
      viewer: viewer(game),
      thumb: thumb(game)
    };
    var list = read();
    list.push(item);
    write(list);
    return item;
  }
  function exportVotes() { return read(); }
  function mountBar(host, ctx) {
    if (!host) return function () {};
    host.innerHTML = '';
    [['love', 'Love it'], ['meh', 'Meh'], ['no', 'No']].forEach(function (pair) {
      var b = el(host.ownerDocument, 'button', 'zd-btn', pair[1]);
      b.type = 'button';
      b.setAttribute('data-vote', pair[0]);
      b.addEventListener('click', function () {
        try {
          cast(pair[0], ctx);
          if (ctx.notify) ctx.notify('Saved: ' + pair[1]);
        } catch (e) { if (ctx.notify) ctx.notify(e); }
      });
      host.appendChild(b);
    });
    return function () { host.innerHTML = ''; };
  }
  function mount(host, ctx) {
    var doc = host.ownerDocument;
    host.innerHTML = '';
    var filter = el(doc, 'select');
    filter.id = 'zd-ellie-filter';
    [['all', 'All'], ['love', 'Love it'], ['meh', 'Meh'], ['no', 'No']].forEach(function (pair) {
      var o = el(doc, 'option', '', pair[1]);
      o.value = pair[0];
      filter.appendChild(o);
    });
    var list = el(doc, 'div', 'zd-list');
    list.id = 'zd-ellie-list';
    var box = el(doc, 'textarea', 'zd-out');
    box.id = 'zd-ellie-out';
    box.readOnly = true;
    function paint() {
      var votes = read().filter(function (v) { return filter.value === 'all' || v.vote === filter.value; });
      list.innerHTML = '';
      if (!votes.length) {
        list.appendChild(el(doc, 'p', 'zd-msg', 'No votes yet. Love it, Meh, and No stay on every screen.'));
        return;
      }
      votes.slice().reverse().forEach(function (v) {
        var card = el(doc, 'article', 'zd-card');
        var title = el(doc, 'p', 'zd-nums', v.vote + ' · ' + (v.title || v.href || ''));
        var meta = el(doc, 'p', 'zd-msg', (v.t || '') + ' ' + (v.href || ''));
        card.appendChild(title);
        card.appendChild(meta);
        if (v.thumb) {
          var img = el(doc, 'img');
          img.alt = '';
          img.src = v.thumb;
          img.width = 160;
          card.appendChild(img);
        }
        list.appendChild(card);
      });
    }
    filter.addEventListener('change', paint);
    var row = el(doc, 'div', 'zd-row');
    function button(label, name, fn) {
      var b = el(doc, 'button', 'zd-btn', label);
      b.type = 'button';
      b.setAttribute('data-ellie', name);
      b.addEventListener('click', function () { try { fn(); } catch (e) { if (ctx.notify) ctx.notify(e); } });
      row.appendChild(b);
    }
    button('Copy JSON', 'copy', function () { box.value = JSON.stringify(exportVotes()); });
    button('Download', 'download', function () {
      var blob = new Blob([JSON.stringify(exportVotes(), null, 2)], { type: 'application/json' });
      var a = doc.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ellie-votes.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    button('Clear', 'clear', function () {
      g.localStorage.removeItem(KEY);
      box.value = '[]';
      paint();
    });
    host.appendChild(filter);
    host.appendChild(row);
    host.appendChild(list);
    host.appendChild(box);
    paint();
    return function () {};
  }
  g.ZD_ELLIE = { mount: mount, mountBar: mountBar, cast: cast, export: exportVotes };
})(window);
