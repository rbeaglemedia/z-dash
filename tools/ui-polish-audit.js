#!/usr/bin/env node
/**
 * Z-DASH UI polish & layout audit.
 *
 * Headless Chrome, no npm dependencies. Serves this repo, opens each screen
 * at the standard phone and desktop viewports, and checks:
 *   1. bounding-box overlaps of visible controls (intersection > 2px)
 *   2. viewport clipping and non-intentional overflow
 *   3. text clipping and font sizes under 9px on buttons and pills
 *   4. clutter: control count, duplicate labels, touch gaps under 6px
 *   5. PNG screenshots (and a contact sheet when Pillow is available)
 *
 * Usage:
 *   node tools/ui-polish-audit.js --out /opt/cursor/artifacts/ui-polish/before
 *   node tools/ui-polish-audit.js --only jr-menu,neon-car --port 8765
 *
 * Viewports:
 *   phone-844x390   844×390  touch  dpr 3
 *   phone-667x375   667×375  touch  dpr 2
 *   ipad-1180x820   1180×820 touch  dpr 2
 *   ipad-1024x768   1024×768 touch  dpr 2
 *   ipad-820x1180   820×1180 touch  dpr 2   (portrait)
 *   pc-1366x768     1366×768        dpr 1
 *   pc-1920x1080    1920×1080       dpr 1
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';

const VIEWPORTS = {
  'phone-844x390': { width: 844, height: 390, hasTouch: true, dpr: 3 },
  'phone-667x375': { width: 667, height: 375, hasTouch: true, dpr: 2 },
  'ipad-1180x820': { width: 1180, height: 820, hasTouch: true, dpr: 2 },
  'ipad-1024x768': { width: 1024, height: 768, hasTouch: true, dpr: 2 },
  'ipad-820x1180': { width: 820, height: 1180, hasTouch: true, dpr: 2 },
  'pc-1366x768': { width: 1366, height: 768, hasTouch: false, dpr: 1 },
  'pc-1920x1080': { width: 1920, height: 1080, hasTouch: false, dpr: 1 }
};

const PHONE_WIDE = ['phone-844x390'];
const PHONE_BOTH = ['phone-844x390', 'phone-667x375'];
const PC_LAP = ['pc-1366x768'];
const PC_BOTH = ['pc-1366x768', 'pc-1920x1080'];
const IPAD_VP = ['ipad-1180x820', 'ipad-1024x768', 'ipad-820x1180'];
const ALL_VP = PHONE_BOTH.concat(IPAD_VP, PC_BOTH);

const VINYL_SEED = `
try {
  localStorage.setItem('zdash_vinyls_v1', JSON.stringify({
    v: 1,
    activeId: 'v_cyber',
    items: [
      { id: 'v_cyber', name: 'CYBER LIGHTNING', updatedAt: 1, colors: ['#ff4fd8', '#3ee6ff'], strokes: [{ color: '#ff4fd8', part: 'hood', pts: [[0, 1, 0, 0, 1, 0], [0.2, 1, 0.1, 0, 1, 0]] }] },
      { id: 'v_midnight', name: 'MIDNIGHT FLAME', updatedAt: 2, colors: ['#ffe14d'], strokes: [{ color: '#ffe14d', part: 'door', pts: [[0, 1, 0, 0, 1, 0]] }] }
    ]
  }));
} catch (e) {}
`;

function parseArgs(argv) {
  const out = { out: path.join(ROOT, 'test-results', 'ui-polish'), port: 0, only: null, base: '' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') out.out = path.resolve(argv[++i]);
    else if (a === '--port') out.port = Number(argv[++i]);
    else if (a === '--only') out.only = String(argv[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--base') out.base = argv[++i];
    else if (a === '--help') out.help = true;
    else throw new Error('Unknown arg ' + a);
  }
  return out;
}

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json',
    '.woff2': 'font/woff2', '.woff': 'font/woff'
  })[ext] || 'application/octet-stream';
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('no'); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); res.end('missing ' + rel); return; }
      res.writeHead(200, { 'Content-Type': mime(file), 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function launchChrome(port) {
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-polish-chrome-'));
  const args = [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--disable-sync',
    '--autoplay-policy=no-user-gesture-required', '--mute-audio',
    '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    'about:blank'
  ];
  const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return { child, dir };
}

async function waitJson(url, tries) {
  let last = '';
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = res.status + '';
    } catch (e) { last = e.message; }
    await sleep(150);
  }
  throw new Error('Chrome debug endpoint not ready: ' + last);
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.next = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.ready = new Promise((res, rej) => {
      this.ws.addEventListener('open', res);
      this.ws.addEventListener('error', () => rej(new Error('cdp socket error')));
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.rej(new Error((msg.error && msg.error.message) || JSON.stringify(msg.error)));
        else p.res(msg.result || {});
      } else if (msg.method) {
        for (const fn of this.listeners.get(msg.method) || []) fn(msg.params || {});
      }
    });
  }
  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 45000);
      this.pending.set(id, {
        res: (v) => { clearTimeout(t); res(v); },
        rej: (e) => { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

const AUDIT_JS = String.raw`
(function audit(opts) {
  opts = opts || {};
  const budget = opts.budget || 24;
  const vw = window.innerWidth, vh = window.innerHeight;
  const SEL = [
    'button', 'a', 'input', 'select', 'textarea',
    '.btn', '.ctl', '[role="button"]',
    '.ktile', '.kpill', '.kround', '.gitem',
    '.zd-ds-top', '.zd-ds-foot', '.zd-top-pause-card',
    '.np-top', '.np-modes', '.np-tools', '.np-pausec',
    '#kHome', '#kOver', '#kStart', '#kMenu', '#walkHud', '#walk-interior',
    '.khome', '.kcard', '.kmenub', '#kGarage', '#bar'
  ].join(',');

  function cssVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') return false;
    if (parseFloat(st.opacity || '1') < 0.05) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    return true;
  }
  function boxOf(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom };
  }
  function hitVisible(el, box) {
    const pts = [
      [box.x + box.w / 2, box.y + box.h / 2],
      [box.x + Math.min(8, box.w / 3), box.y + Math.min(8, box.h / 3)],
      [box.x + box.w - Math.min(8, box.w / 3), box.y + box.h - Math.min(8, box.h / 3)]
    ];
    for (const p of pts) {
      if (p[0] < 0 || p[1] < 0 || p[0] >= vw || p[1] >= vh) continue;
      const top = document.elementFromPoint(p[0], p[1]);
      if (!top) continue;
      if (top === el || el.contains(top) || top.contains(el)) return true;
    }
    return false;
  }
  function labelOf(el) {
    const t = (el.getAttribute('aria-label') || el.innerText || el.value || '').replace(/\s+/g, ' ').trim();
    return t.slice(0, 80);
  }
  function isControl(el) {
    if (el.matches('button, a, input, select, textarea, [role="button"], .btn, .ctl, .ktile, .kpill, .kround, .gitem')) return true;
    return false;
  }
  function isCard(el) {
    return el.matches('#kHome, #kOver, #kStart, #kMenu, #walk-interior, #walkHud, .kcard, .zd-top-pause-card, .np-pausec, #kGarage, .np-tools, .np-top, .np-modes, #bar, .khome');
  }
  function intentionalScroll(el) {
    const st = getComputedStyle(el);
    const oy = st.overflowY, ox = st.overflowX;
    return oy === 'auto' || oy === 'scroll' || ox === 'auto' || ox === 'scroll';
  }
  function fontPx(el) {
    return parseFloat(getComputedStyle(el).fontSize) || 0;
  }

  const nodes = [];
  const seen = new Set();
  for (const el of document.querySelectorAll(SEL)) {
    if (seen.has(el)) continue;
    seen.add(el);
    if (!cssVisible(el)) continue;
    if (el.closest('[hidden]') && getComputedStyle(el).display === 'none') continue;
    const box = boxOf(el);
    const role = isControl(el) ? 'control' : (isCard(el) ? 'card' : 'chrome');
    const item = {
      id: el.id || '',
      name: (el.id || el.className || el.tagName).toString().slice(0, 60),
      tag: el.tagName.toLowerCase(),
      role: role,
      label: labelOf(el),
      font: Math.round(fontPx(el) * 10) / 10,
      x: Math.round(box.x * 10) / 10,
      y: Math.round(box.y * 10) / 10,
      w: Math.round(box.w * 10) / 10,
      h: Math.round(box.h * 10) / 10,
      r: box.r, b: box.b,
      hit: hitVisible(el, box),
      el: el
    };
    nodes.push(item);
  }

  // Canvas HUD (minimap, tilt gauge, speedometer) is drawn in world/hud.js.
  // Reconstruct the same boxes in CSS pixels so they can overlap DOM controls.
  const hud = [];
  const cv = document.getElementById('c');
  const over = document.getElementById('kOver');
  const home = document.getElementById('kHome');
  const interior = document.getElementById('walk-interior');
  const overlayOn = over && cssVisible(over) && !over.classList.contains('hidden');
  const pauseOn = home && cssVisible(home) && !home.classList.contains('hidden');
  const inside = interior && (interior.classList.contains('show') || (cssVisible(interior) && interior.getBoundingClientRect().width > vw * 0.8));
  if (cv && cssVisible(cv) && !overlayOn && !pauseOn && !inside) {
    const touch = (navigator.maxTouchPoints > 0);
    const desktop = !touch && vw > 1024;
    let W = vw, H = vh, sx = 1, sy = 1;
    if (desktop) {
      const cap = 1280 * 720, area = vw * vh || 1;
      let scale = Math.min(1, Math.sqrt(cap / area));
      W = Math.round(vw * scale); H = Math.round(vh * scale);
      if (W * H > cap) {
        const fit = Math.sqrt(cap / (W * H));
        W = Math.max(1, Math.floor(W * fit));
        H = Math.max(1, Math.floor(H * fit));
      }
      sx = vw / W; sy = vh / H;
    }
    const s = Math.min(1.35, Math.max(0.72, H / 378));
    const Wd = W / s;
    const to = (x, y, w, h, id, name) => {
      const box = { x: x * s * sx, y: y * s * sy, w: w * s * sx, h: h * s * sy };
      hud.push({
        id: id, name: name, tag: 'hud', role: 'hud', label: name,
        font: 0, x: Math.round(box.x), y: Math.round(box.y),
        w: Math.round(box.w), h: Math.round(box.h),
        r: box.x + box.w, b: box.y + box.h, hit: true, el: null
      });
    };
    const mapW = Math.min(196, Math.max(96, Wd / 2 - 79));
    to(12, 10, mapW, 134, 'hud-minimap', 'minimap');
    to(Wd / 2 - 59, 6, 118, 86, 'hud-tilt', 'tilt gauge');
    to(Wd - 200, 8, 200, 68, 'hud-speedometer', 'speedometer');
  }

  const visible = nodes.filter(n => n.hit || n.role === 'card');
  const controls = visible.filter(n => n.role === 'control');
  const issues = [];
  function add(severity, kind, msg, extra) {
    issues.push(Object.assign({ severity: severity, kind: kind, msg: msg }, extra || {}));
  }

  function clippedBox(n) {
    let x = n.x, y = n.y, r = n.r, b = n.b;
    let p = n.el && n.el.parentElement;
    while (p && p !== document.body) {
      const st = getComputedStyle(p);
      const clipX = st.overflowX === 'auto' || st.overflowX === 'scroll' || st.overflowX === 'hidden';
      const clipY = st.overflowY === 'auto' || st.overflowY === 'scroll' || st.overflowY === 'hidden';
      if (clipX || clipY) {
        const pr = p.getBoundingClientRect();
        if (clipX) { x = Math.max(x, pr.left); r = Math.min(r, pr.right); }
        if (clipY) { y = Math.max(y, pr.top); b = Math.min(b, pr.bottom); }
      }
      p = p.parentElement;
    }
    return { x: x, y: y, r: r, b: b };
  }
  function overlapAmount(a, b) {
    const A = clippedBox(a), B = clippedBox(b);
    const iw = Math.min(A.r, B.r) - Math.max(A.x, B.x);
    const ih = Math.min(A.b, B.b) - Math.max(A.y, B.y);
    return { iw: iw, ih: ih };
  }
  const crowd = controls.concat(hud);
  for (let i = 0; i < crowd.length; i++) {
    for (let j = i + 1; j < crowd.length; j++) {
      const a = crowd[i], b = crowd[j];
      if (a.role === 'hud' && b.role === 'hud') continue;
      if (a.el && b.el && (a.el.contains(b.el) || b.el.contains(a.el))) continue;
      const o = overlapAmount(a, b);
      if (o.iw > 2 && o.ih > 2) {
        add('error', 'overlap', (a.label || a.name) + ' overlaps ' + (b.label || b.name) + ' by ' + Math.round(o.iw) + '×' + Math.round(o.ih) + 'px', {
          a: a.name, b: b.name
        });
      }
    }
  }

  function outside(n) {
    return n.x < -2 || n.y < -2 || n.r > vw + 2 || n.b > vh + 2;
  }
  function inOnScreenScroll(el) {
    let p = el && el.parentElement;
    while (p && p !== document.documentElement) {
      const st = getComputedStyle(p);
      const scrolls = st.overflowY === 'auto' || st.overflowY === 'scroll' || st.overflowX === 'auto' || st.overflowX === 'scroll';
      if (scrolls) {
        const pr = p.getBoundingClientRect();
        if (pr.width > 2 && pr.height > 2 && pr.bottom > 2 && pr.right > 2 && pr.top < vh - 2 && pr.left < vw - 2) return true;
      }
      p = p.parentElement;
    }
    return false;
  }
  function flowClipped(el) {
    if (!el) return null;
    const kids = [...el.children];
    const abs = kids.filter(c => {
      const p = getComputedStyle(c).position;
      return p === 'absolute' || p === 'fixed';
    });
    if (!abs.length) {
      if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
        return [el.scrollWidth, el.scrollHeight, el.clientWidth, el.clientHeight];
      }
      return null;
    }
    for (const c of kids) {
      const p = getComputedStyle(c).position;
      if (p === 'absolute' || p === 'fixed' || !cssVisible(c)) continue;
      const txt = (c.innerText || '').replace(/\s+/g, ' ').trim();
      if (!txt) continue;
      if (c.scrollWidth > c.clientWidth + 2 || c.scrollHeight > c.clientHeight + 2 || c.getBoundingClientRect().width > el.clientWidth + 2) {
        return [c.scrollWidth, c.scrollHeight, c.clientWidth, c.clientHeight];
      }
    }
    return null;
  }
  for (const n of visible) {
    if (n.role !== 'control' && n.role !== 'card') continue;
    if (!outside(n)) continue;
    if (n.el && inOnScreenScroll(n.el)) continue;
    add('error', 'viewport', (n.label || n.name) + ' extends outside the viewport', {
      name: n.name, box: [n.x, n.y, Math.round(n.w), Math.round(n.h)]
    });
  }
  for (const n of visible) {
    if (!n.el) continue;
    if (n.role !== 'card' && n.role !== 'control') continue;
    const el = n.el;
    const sh = el.scrollHeight, ch = el.clientHeight, sw = el.scrollWidth, cw = el.clientWidth;
    const clippedY = sh > ch + 2;
    const clippedX = sw > cw + 2;
    if (n.role === 'card') {
      if (!clippedY && !clippedX) continue;
      if (intentionalScroll(el)) {
        if (opts.flagScrollCards && clippedY) {
          add('warn', 'scroll', (n.label || n.name) + ' needs an inner scroll (' + sh + ' > ' + ch + ')', { name: n.name });
        }
        continue;
      }
      add('error', 'overflow', (n.label || n.name) + ' content is clipped without a scroll container', {
        name: n.name, scroll: [sw, sh], client: [cw, ch]
      });
      continue;
    }
    const flow = flowClipped(el);
    if (flow) {
      add('error', 'text-clip', (n.label || n.name) + ' text overflows its control', {
        name: n.name, scroll: [flow[0], flow[1]], client: [flow[2], flow[3]]
      });
    }
  }

  for (const n of controls) {
    if (!n.el) continue;
    if (n.el.matches('input[type="range"]')) continue;
    const text = (n.el.innerText || '').replace(/\s+/g, '').trim();
    if (!text) continue;
    const f = fontPx(n.el);
    if (f > 0 && f < 9) add('error', 'font', (n.label || n.name) + ' is ' + f.toFixed(1) + 'px', { name: n.name, font: f });
    const kids = n.el.querySelectorAll('span, b, small, i, em');
    for (const k of kids) {
      if (!cssVisible(k)) continue;
      const fk = fontPx(k);
      if (fk > 0 && fk < 9) {
        const lt = (k.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
        if (!lt) continue;
        add('error', 'font', lt + ' inside ' + (n.name) + ' is ' + fk.toFixed(1) + 'px', { name: n.name, font: fk });
      }
    }
  }

  if (controls.length > budget) {
    add('warn', 'clutter', controls.length + ' controls visible (budget ' + budget + ')', { count: controls.length, budget: budget });
  }
  const dup = new Map();
  for (const n of controls) {
    const key = (n.label || '').toUpperCase();
    if (key.length < 3) continue;
    if (!dup.has(key)) dup.set(key, []);
    dup.get(key).push(n.name);
  }
  for (const [k, names] of dup) {
    if (names.length > 1) add('warn', 'duplicate', 'Repeated label "' + k + '" ×' + names.length, { names: names });
  }

  const touch = !!opts.hasTouch;
  if (touch) {
    let gaps = 0;
    const shown = [];
    for (let i = 0; i < controls.length; i++) {
      for (let j = i + 1; j < controls.length; j++) {
        const a = controls[i], b = controls[j];
        if (a.el && b.el && (a.el.contains(b.el) || b.el.contains(a.el))) continue;
        const o = overlapAmount(a, b);
        if (o.iw > 0 && o.ih > 0) continue;
        const gx = o.iw > 0 ? 0 : -o.iw;
        const gy = o.ih > 0 ? 0 : -o.ih;
        const gap = Math.hypot(Math.max(0, gx), Math.max(0, gy));
        const face = (o.iw > -2 && gy > 0 && gy < 6) || (o.ih > -2 && gx > 0 && gx < 6);
        if (!face || gap >= 6 || gap < 0.5) continue;
        gaps++;
        if (shown.length < 12) shown.push((a.label || a.name) + ' ↔ ' + (b.label || b.name) + ' (' + gap.toFixed(1) + 'px)');
      }
    }
    if (gaps) add('warn', 'gap', gaps + ' touch targets sit under 6px apart', { pairs: shown });
  }

  const slim = visible.concat(hud).map(n => ({
    id: n.id, name: n.name, role: n.role, label: n.label, font: n.font,
    x: n.x, y: n.y, w: n.w, h: n.h
  }));
  return {
    viewport: [vw, vh],
    dpr: window.devicePixelRatio,
    touch: navigator.maxTouchPoints || 0,
    controls: controls.length,
    cards: visible.filter(n => n.role === 'card').length,
    hud: hud.length,
    issues: issues,
    nodes: slim.slice(0, 80)
  };
})
`;

function inject(code) {
  return `(() => { const s = document.createElement('script'); s.textContent = ${JSON.stringify(code)}; document.documentElement.appendChild(s); s.remove(); })()`;
}

const SCREENS = [
  {
    id: 'jr-menu', title: 'JR main 15-tile menu',
    url: '/jr.html?kmenu=1', viewports: PHONE_BOTH.concat(PC_BOTH),
    budget: 18, wait: '#kTilesM .ktile', settle: 700
  },
  {
    id: 'jr-l1', title: 'JR garage Level 1',
    url: '/jr.html#garage', viewports: ALL_VP,
    budget: 12, wait: '#kid[data-tab="garage"] .gbig[data-groot="garage"]', settle: 700
  },
  {
    id: 'jr-l2g', title: 'JR garage Level 2 categories',
    url: '/jr.html?gopen=garage#garage', viewports: ALL_VP,
    budget: 16, wait: '#kid[data-tab="garage"] [data-gbroad="paintvinyl"]', settle: 700
  },
  {
    id: 'jr-l2h', title: 'JR home Level 2 categories',
    url: '/jr.html?gopen=home#garage', viewports: ALL_VP,
    budget: 16, wait: '#kid[data-tab="garage"] [data-gbroad="living"]', settle: 700
  },
  {
    id: 'jr-l3v', title: 'JR garage Level 3 VINYLS',
    url: '/jr.html?gopen=vinyls#garage', viewports: ALL_VP, seed: true,
    budget: 28, wait: '#kid[data-tab="garage"] .gcats [data-c="vinyls"].on', settle: 800,
    after: '.vinyl-card'
  },
  {
    id: 'ix-l1', title: 'Index garage Level 1',
    url: '/index.html#garage', viewports: ALL_VP,
    budget: 12, wait: '#kid[data-tab="garage"] .gbig[data-groot="garage"]', settle: 700
  },
  {
    id: 'ix-l2g', title: 'Index garage Level 2 categories',
    url: '/index.html?gopen=garage#garage', viewports: ALL_VP,
    budget: 16, wait: '#kid[data-tab="garage"] [data-gbroad="paintvinyl"]', settle: 700
  },
  {
    id: 'ix-l2h', title: 'Index home Level 2 categories',
    url: '/index.html?gopen=home#garage', viewports: ALL_VP,
    budget: 16, wait: '#kid[data-tab="garage"] [data-gbroad="living"]', settle: 700
  },
  {
    id: 'ix-l3v', title: 'Index garage Level 3 VINYLS',
    url: '/index.html?gopen=vinyls#garage', viewports: ALL_VP, seed: true,
    budget: 28, wait: '#kid[data-tab="garage"] .gcats [data-c="vinyls"].on', settle: 800,
    after: '.vinyl-card'
  },
  {
    id: 'neon-car', title: 'Neon paint — 3D car, vinyl name, saved vinyls',
    url: '/neon-paint.html', viewports: ALL_VP, seed: true,
    budget: 64, wait: '#np-studio #vinylNameInp', settle: 900,
    after: '#npVinylBar [data-vinyl-act="edit"]'
  },
  {
    id: 'neon-wall', title: 'Neon paint — graffiti wall',
    url: '/neon-paint.html?mode=wall', viewports: ALL_VP,
    budget: 64, wait: '#np-studio [data-panel="wall"]:not(.np-off)', settle: 800
  },
  {
    id: 'neon-pause', title: 'Neon paint — pause menu',
    url: '/neon-paint.html', viewports: PHONE_WIDE.concat(PC_LAP),
    budget: 8, wait: '#np-studio #kMenuB', settle: 500,
    setup: `document.querySelector('#np-studio #kMenuB')?.click();`
  },
  {
    id: 'world-start', title: 'Neon World start card',
    url: '/world-split.html', viewports: PHONE_WIDE.concat(PC_LAP),
    budget: 12, wait: '#kOver #ready', settle: 600, flagScrollCards: true
  },
  {
    id: 'world-drive', title: 'Neon World driving HUD',
    url: '/world-split.html', viewports: PHONE_WIDE.concat(PC_LAP),
    budget: 10, wait: '#brk', settle: 900,
    setup: inject(`
      document.getElementById('kOver').classList.add('hidden');
      document.getElementById('kMenuB').classList.remove('hidden');
      flying = false;
      P.driveMode = 'street'; P.ground = true; P.v = 8; P.y = 0; P.wreck = false; P.wings = false;
      if (typeof syncOnFootButtons === 'function') syncOnFootButtons();
    `)
  },
  {
    id: 'world-walk', title: 'Neon World on-foot HUD',
    url: '/world-split.html', viewports: PHONE_WIDE.concat(PC_LAP),
    budget: 12, wait: '#brk', settle: 900,
    setup: inject(`
      document.getElementById('kOver').classList.add('hidden');
      document.getElementById('kMenuB').classList.remove('hidden');
      flying = false;
      P.driveMode = 'street'; P.ground = true; P.v = 0; P.y = 0; P.wreck = false; P.wings = false;
      var list = (typeof CITY !== 'undefined' && CITY.BL) || [];
      var bld = null, i;
      for (i = 0; i < list.length; i++) { if (list[i] && list[i].doors && list[i].doors.length && list[i].purpose === 'DANCE') { bld = list[i]; break; } }
      if (!bld) { for (i = 0; i < list.length; i++) { if (list[i] && list[i].doors && list[i].doors.length) { bld = list[i]; break; } } }
      var door = bld && bld.doors[0];
      if (door) {
        var nx = door[2] || 0, nz = door[3] || 0;
        WALK_MODE.x = door[0] + nx * 1.2; WALK_MODE.z = door[1] + nz * 1.2; WALK_MODE.y = 0;
        P.x = WALK_MODE.x; P.z = WALK_MODE.z;
      }
      WALK_MODE.onFoot = true;
      if (typeof syncOnFootButtons === 'function') syncOnFootButtons();
    `)
  },
  {
    id: 'world-interior', title: 'Neon World building interior',
    url: '/world-split.html', viewports: PHONE_WIDE.concat(PC_LAP),
    budget: 12, wait: '#brk', settle: 800,
    setup: inject(`
      document.getElementById('kOver').classList.add('hidden');
      document.getElementById('kMenuB').classList.remove('hidden');
      flying = false;
      P.driveMode = 'street'; P.ground = true; P.v = 0; P.y = 0; P.wreck = false;
      var door = { dist: 0, x: P.x, z: P.z, nx: 0, nz: 1, purpose: 'DANCE', purposeLabel: 'Z COMPANY ARTS — DANCE STUDIO', actionLabel: 'ENTER Z COMPANY ARTS' };
      WALK_MODE.onFoot = true; WALK_MODE.insideBuilding = true; WALK_MODE.insideDoor = door; WALK_MODE.door = door;
      if (typeof walkShowInterior === 'function') walkShowInterior(door);
      if (typeof syncOnFootButtons === 'function') syncOnFootButtons();
    `)
  },
  {
    id: 'wz-l1', title: 'World pause Garage/Home Level 1',
    url: '/world-split.html', viewports: ALL_VP,
    budget: 56, wait: '#kGarageDrill', settle: 800,
    after: '#kHome:not(.hidden) #kGarageDrill .gbig[data-groot="garage"]',
    setup: `
      document.getElementById('kOver') && document.getElementById('kOver').classList.add('hidden');
      document.getElementById('kMenuB') && document.getElementById('kMenuB').classList.remove('hidden');
      if (typeof openGarage === 'function') openGarage('level1');
      else if (typeof kPause === 'function') kPause(true);
    `
  },
  {
    id: 'wz-l2g', title: 'World pause Garage Level 2',
    url: '/world-split.html', viewports: ALL_VP,
    budget: 56, wait: '#kGarageDrill', settle: 800,
    after: '#kHome:not(.hidden) #kGarageDrill [data-gbroad="paintvinyl"]',
    setup: `
      document.getElementById('kOver') && document.getElementById('kOver').classList.add('hidden');
      document.getElementById('kMenuB') && document.getElementById('kMenuB').classList.remove('hidden');
      if (typeof openGarage === 'function') openGarage('garage');
    `
  },
  {
    id: 'wz-l2h', title: 'World pause Home Level 2',
    url: '/world-split.html', viewports: ALL_VP,
    budget: 56, wait: '#kGarageDrill', settle: 800,
    after: '#kHome:not(.hidden) #kGarageDrill [data-gbroad="living"]',
    setup: `
      document.getElementById('kOver') && document.getElementById('kOver').classList.add('hidden');
      document.getElementById('kMenuB') && document.getElementById('kMenuB').classList.remove('hidden');
      if (typeof openGarage === 'function') openGarage('home');
    `
  },
  {
    id: 'wz-l3v', title: 'World pause Garage Level 3 VINYLS',
    url: '/world-split.html', viewports: ALL_VP, seed: true,
    budget: 64, wait: '#kGarageDrill', settle: 800,
    after: '#kHome:not(.hidden) #kGarageDrill .gcats [data-c="vinyls"].on',
    setup: `
      document.getElementById('kOver') && document.getElementById('kOver').classList.add('hidden');
      document.getElementById('kMenuB') && document.getElementById('kMenuB').classList.remove('hidden');
      if (typeof openGarage === 'function') openGarage('vinyls');
    `
  },
  {
    id: 'dance', title: 'Dance stage',
    url: '/dance-stage.html', viewports: PHONE_WIDE.concat(PC_LAP),
    budget: 14, wait: '#zd-ds.zd-ds-on, .zd-ds-top', settle: 700
  },
  {
    id: 'crew', title: 'Crew',
    url: '/crew.html', viewports: PHONE_WIDE.concat(PC_LAP),
    budget: 18, wait: '#bar button', settle: 600
  }
];

async function runScreen(cdp, base, screen, vp, outDir) {
  const shotDir = path.join(outDir, 'screenshots');
  fs.mkdirSync(shotDir, { recursive: true });
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: !!vp.hasTouch,
    screenWidth: vp.width, screenHeight: vp.height
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: !!vp.hasTouch, maxTouchPoints: vp.hasTouch ? 5 : 1 });
  let seedId = null;
  if (screen.seed) {
    const added = await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: VINYL_SEED });
    seedId = added.identifier;
  }
  const loaded = new Promise((res) => {
    const t = setTimeout(res, 25000);
    cdp.on('Page.loadEventFired', () => { clearTimeout(t); res(); });
  });
  const hashAt = screen.url.indexOf('#');
  const urlPath = hashAt >= 0 ? screen.url.slice(0, hashAt) : screen.url;
  const urlHash = hashAt >= 0 ? screen.url.slice(hashAt) : '';
  const navUrl = base + urlPath + (urlPath.includes('?') ? '&' : '?') + 'zdpol=' + encodeURIComponent(screen.id + '-' + vp.name) + urlHash;
  await cdp.send('Page.navigate', { url: navUrl });
  await loaded;
  await cdp.send('Runtime.evaluate', { expression: 'document.fonts && document.fonts.ready', awaitPromise: true });
  const waitExpr = `(() => {
    const t0 = Date.now();
    return new Promise((resolve) => {
      const tick = () => {
        if (document.querySelector(${JSON.stringify(screen.wait)})) return resolve(true);
        if (Date.now() - t0 > 12000) return resolve(false);
        setTimeout(tick, 100);
      };
      tick();
    });
  })()`;
  const waited = await cdp.send('Runtime.evaluate', { expression: waitExpr, awaitPromise: true, returnByValue: true });
  if (!vp.hasTouch) {
    await cdp.send('Runtime.evaluate', { expression: `
      document.documentElement.classList.remove('ipad-mode');
      document.documentElement.classList.add('pc-mode');
      if (document.body) { document.body.classList.remove('ipad-mode'); document.body.classList.add('pc-mode'); }
      window.Z_IS_IPAD = false;
    ` });
  }
  if (screen.setup) {
    await cdp.send('Runtime.evaluate', { expression: screen.setup });
    await sleep(180);
  }
  if (screen.after) {
    const afterExpr = waitExpr.replace(JSON.stringify(screen.wait), JSON.stringify(screen.after));
    await cdp.send('Runtime.evaluate', { expression: afterExpr, awaitPromise: true, returnByValue: true });
  }
  if (seedId) {
    try { await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: seedId }); } catch (e) {}
  }
  await cdp.send('Runtime.evaluate', {
    expression: `(() => { const s = document.createElement('style'); s.textContent = '*{animation:none !important;transition:none !important;}'; document.head.appendChild(s); })()`
  });
  await sleep(screen.settle || 500);
  const expr = `(${AUDIT_JS})(${JSON.stringify({
    budget: screen.budget,
    hasTouch: !!vp.hasTouch,
    flagScrollCards: !!screen.flagScrollCards
  })})`;
  const ev = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true });
  if (ev.exceptionDetails) {
    throw new Error('audit threw: ' + JSON.stringify(ev.exceptionDetails).slice(0, 500));
  }
  const result = ev.result && ev.result.value;
  const png = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const file = path.join(shotDir, screen.id + '__' + vp.name + '.png');
  fs.writeFileSync(file, Buffer.from(png.data, 'base64'));
  const errors = (result && result.issues || []).filter(i => i.severity === 'error').length;
  const warns = (result && result.issues || []).filter(i => i.severity === 'warn').length;
  return {
    id: screen.id,
    title: screen.title,
    url: screen.url,
    viewport: vp.name,
    size: [vp.width, vp.height],
    hasTouch: vp.hasTouch,
    dpr: vp.dpr,
    ready: !!(waited.result && waited.result.value),
    screenshot: file,
    errors: errors,
    warns: warns,
    audit: result
  };
}

function writeReport(outDir, rows) {
  const lines = ['# Z-DASH UI polish audit', '', 'Screens: ' + rows.length, ''];
  let errors = 0, warns = 0;
  for (const row of rows) {
    errors += row.errors; warns += row.warns;
    lines.push('## ' + row.title + ' — ' + row.viewport);
    lines.push('');
    lines.push('- URL: `' + row.url + '`');
    lines.push('- Ready: ' + (row.ready ? 'yes' : 'NO (selector missing)'));
    lines.push('- Controls: ' + ((row.audit && row.audit.controls) || 0) + ' · errors ' + row.errors + ' · warnings ' + row.warns);
    lines.push('- Screenshot: `' + row.screenshot + '`');
    const issues = (row.audit && row.audit.issues) || [];
    if (!issues.length) lines.push('- Clean.');
    for (const issue of issues) {
      lines.push('- **' + issue.severity + ' / ' + issue.kind + ':** ' + issue.msg);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('Total errors: ' + errors + '. Total warnings: ' + warns + '.');
  const md = lines.join('\n');
  fs.writeFileSync(path.join(outDir, 'audit.md'), md);
  fs.writeFileSync(path.join(outDir, 'audit.json'), JSON.stringify(rows, null, 2));
  return { errors, warns, md };
}

async function contactSheet(outDir) {
  const dir = path.join(outDir, 'screenshots');
  if (!fs.existsSync(dir)) return;
  const py = `
import os, glob
from PIL import Image, ImageDraw
src = ${JSON.stringify(dir)}
files = sorted(glob.glob(os.path.join(src, '*.png')))
if not files:
    raise SystemExit(0)
thumb_w = 480
rows = []
for f in files:
    im = Image.open(f).convert('RGB')
    h = max(1, int(im.height * thumb_w / im.width))
    im = im.resize((thumb_w, h), Image.Resampling.LANCZOS)
    rows.append((os.path.basename(f), im))
pad = 28
label_h = 22
W = thumb_w + pad * 2
H = pad + sum(im.height + label_h + 12 for _, im in rows)
sheet = Image.new('RGB', (W, H), (12, 8, 24))
draw = ImageDraw.Draw(sheet)
y = pad
for name, im in rows:
    draw.text((pad, y), name, fill=(180, 245, 255))
    y += label_h
    sheet.paste(im, (pad, y))
    y += im.height + 12
out = os.path.join(${JSON.stringify(outDir)}, 'contact-sheet.png')
sheet.save(out, optimize=True)
print(out)
`;
  await new Promise((resolve) => {
    const child = spawn('python3', ['-c', py], { stdio: ['ignore', 'inherit', 'inherit'] });
    child.on('exit', () => resolve());
  });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('node tools/ui-polish-audit.js [--out dir] [--port n] [--only a,b] [--base url]');
    return;
  }
  fs.mkdirSync(args.out, { recursive: true });
  const server = await startServer(args.port || 0);
  const addr = server.address();
  const base = args.base || ('http://127.0.0.1:' + addr.port);
  const debugPort = 9300 + Math.floor(Math.random() * 500);
  const chrome = launchChrome(debugPort);
  const kill = () => { try { chrome.child.kill('SIGKILL'); } catch (e) {} };
  process.on('exit', kill);
  try {
    const list = await waitJson('http://127.0.0.1:' + debugPort + '/json/list', 40);
    const page = list.find(t => t.type === 'page');
    if (!page) throw new Error('no chrome page');
    const cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    const screens = SCREENS.filter(s => !args.only || args.only.includes(s.id));
    const rows = [];
    for (const screen of screens) {
      for (const name of screen.viewports) {
        const vp = Object.assign({ name }, VIEWPORTS[name]);
        process.stdout.write('audit ' + screen.id + ' ' + name + ' ... ');
        try {
          const row = await runScreen(cdp, base, screen, vp, args.out);
          rows.push(row);
          console.log((row.ready ? 'ready' : 'NOT READY') + ' e=' + row.errors + ' w=' + row.warns);
        } catch (err) {
          console.log('FAIL ' + err.message);
          rows.push({
            id: screen.id, title: screen.title, url: screen.url, viewport: name,
            size: [vp.width, vp.height], ready: false, errors: 1, warns: 0,
            screenshot: '', audit: { issues: [{ severity: 'error', kind: 'runner', msg: err.message }] }
          });
        }
      }
    }
    cdp.close();
    const summary = writeReport(args.out, rows);
    await contactSheet(args.out);
    console.log('Wrote ' + path.join(args.out, 'audit.md'));
    console.log('errors ' + summary.errors + ' warnings ' + summary.warns);
    process.exitCode = summary.errors ? 1 : 0;
  } finally {
    kill();
    server.close();
    try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
