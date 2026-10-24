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
 *   6. adult index.html never loads Kid App scripts or storage, and the
 *      Kid Z launcher stays clickable above the CONNECT LIVE landing screen
 *   7. every app page links a fullscreen manifest whose scope covers the
 *      whole directory, and nothing calls exitFullscreen on its own
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

const KID_KEYS = ['zdash_paint3d_v1', 'zdash_vinyls_v1', 'zdash_garage_v1', 'zdash_neon_paint_v1', 'zdash.neonpaint'];

const KID_SEED = `
try {
  var expect = {
    'zdash_paint3d_v1': '{"v":1,"paint":"#ff00ff"}',
    'zdash_vinyls_v1': '{"v":1,"activeId":"v_cyber","items":[{"id":"v_cyber","name":"CYBER LIGHTNING","strokes":[{"color":"#ff4fd8"}]}]}',
    'zdash_garage_v1': '{"v":1,"spoiler":"gtwing"}',
    'zdash_neon_paint_v1': '{"v":1,"strokes":[{"color":"#ff4fd8"}]}',
    'zdash.neonpaint.v1': '{"version":1,"enabled":true}'
  };
  window.__zdKidExpect = expect;
  Object.keys(expect).forEach(function (k) { localStorage.setItem(k, expect[k]); });
} catch (e) {}
`;

const ADULT_PROBE = `
(async function () {
  const issues = [];
  function bad(kind, msg) { issues.push({ severity: 'error', kind: kind, msg: msg }); }
  const banned = ['neon-paint.js', 'icon-garage.js', 'tablet-opt.js'];
  const urls = performance.getEntriesByType('resource').map(function (r) { return r.name; })
    .concat([].map.call(document.scripts, function (s) { return s.src || ''; }))
    .concat([].map.call(document.querySelectorAll('link[rel=stylesheet]'), function (s) { return s.href || ''; }));
  urls.forEach(function (url) {
    if (!url) return;
    if (banned.some(function (b) { return url.indexOf(b) >= 0; }) || /\\/world\\/(garage|garagez|boot|icon-garage|neon-paint)/.test(url)) {
      bad('kid-script', 'adult index.html loaded a Kid App file: ' + url);
    }
  });
  if (window.NEON_PAINT) bad('kid-script', 'window.NEON_PAINT is loaded on adult index.html');
  if (window.GARAGEZ) bad('kid-script', 'window.GARAGEZ is loaded on adult index.html');
  if (window.GARAGE_HOME_HUB) bad('kid-script', 'garage hub is loaded on adult index.html');
  const expect = window.__zdKidExpect || {};
  Object.keys(expect).forEach(function (k) {
    var now = null;
    try { now = localStorage.getItem(k); } catch (e) { bad('kid-storage', 'could not read ' + k); return; }
    if (now !== expect[k]) bad('kid-storage', 'adult index.html changed kid storage ' + k);
  });
  const btn = document.getElementById('btnNeonZ');
  const splash = document.getElementById('splash');
  const obd = document.getElementById('btnObd2');
  const demo = document.getElementById('btnDemo');
  if (!btn || !splash || !obd || !demo) {
    bad('kid-launcher', 'landing screen is missing the Kid Z launcher or CONNECT LIVE / START DEMO');
  } else {
    const ss = getComputedStyle(splash);
    const splashOpen = !splash.classList.contains('gone') && ss.display !== 'none' && parseFloat(ss.opacity) > 0.5 && ss.visibility !== 'hidden';
    if (!splashOpen) bad('kid-launcher', 'CONNECT LIVE / START DEMO landing is not open');
    const br = btn.getBoundingClientRect();
    const bs = getComputedStyle(btn);
    if (bs.display === 'none' || bs.visibility === 'hidden' || parseFloat(bs.opacity) < 0.5 || br.width < 40 || br.height < 40) {
      bad('kid-launcher', 'Kid Z launcher is not clearly visible');
    }
    const x = br.left + br.width / 2, y = br.top + br.height / 2;
    const top = document.elementFromPoint(x, y);
    if (!top || (top !== btn && !btn.contains(top))) {
      bad('kid-launcher', 'Kid Z launcher is covered. elementFromPoint hit ' + (top ? (top.id || top.tagName) : 'nothing'));
    }
    const bz = parseInt(bs.zIndex, 10) || 0;
    const canvas = document.getElementById('cv-splash');
    const start = document.getElementById('startBtns');
    const cz = canvas ? (parseInt(getComputedStyle(canvas).zIndex, 10) || 0) : 0;
    const sz = start ? (parseInt(getComputedStyle(start).zIndex, 10) || 0) : 0;
    if (!(bz > cz && bz > sz)) bad('kid-launcher', 'Kid Z launcher z-index ' + bz + ' is not above the landing overlay (canvas ' + cz + ', start ' + sz + ')');
    [obd, demo].forEach(function (el) {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || r.width < 20) bad('kid-launcher', (el.id || 'start button') + ' is not visible on the landing screen');
    });
  }
  const t0 = Date.now();
  while (!(window.ZD && ZD.Xray && ZD.Xray.ready && ZD.Xray.car) && Date.now() - t0 < 8000) {
    await new Promise(function (r) { setTimeout(r, 100); });
  }
  const X = window.ZD && ZD.Xray;
  if (!X || !X.ready || !X.car) bad('kid-paint', 'adult wireframe was not ready to check for kid paint');
  else {
    if (X.render && X.render._npPaint) bad('kid-paint', 'kid paint hooked the adult wireframe render');
    const hits = [];
    X.car.traverse(function (o) {
      const ud = o.userData || {};
      if (ud.neonPaint || ud.crew || (o.name && /np-ribbon|vinyl|sticker/i.test(o.name))) hits.push(o.name || 'mesh');
    });
    if (hits.length) bad('kid-paint', 'kid paint, vinyls, or stickers are on the adult wireframe: ' + hits.slice(0, 6).join(', '));
  }
  return issues;
})()
`;

function scanAdultIndex() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const issues = [];
  const tagRe = /<(script|link)\b[^>]*>/gi;
  let m;
  while ((m = tagRe.exec(html))) {
    const tag = m[0];
    const kind = m[1].toLowerCase();
    if (kind === 'link' && !/\brel\s*=\s*["']stylesheet["']/i.test(tag)) continue;
    const src = ((tag.match(/\b(?:src|href)\s*=\s*["']([^"']+)["']/i) || [])[1] || '').split('?')[0];
    if (!src) continue;
    if (/(?:^|\/)(?:neon-paint\.js|icon-garage\.js|tablet-opt\.js)$/.test(src) || /(?:^|\/)world\//.test(src) || /tablet-opt/.test(src)) {
      issues.push({ severity: 'error', kind: 'kid-script', msg: 'adult index.html loads a Kid App file: ' + src });
    }
  }
  for (const key of KID_KEYS) {
    if (html.includes(key)) issues.push({ severity: 'error', kind: 'kid-storage', msg: 'adult index.html references Kid App storage ' + key });
  }
  return issues;
}

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
    else if (a === '--root') out.root = path.resolve(argv[++i]);
    else if (a === '--menus-only') out.menusOnly = true;
    else if (a === '--pwa-only') out.pwaOnly = true;
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
    id: 'adult-landing', title: 'Adult landing — Kid Z launcher, no kid paint',
    url: '/index.html', viewports: ALL_VP,
    budget: 8, wait: '#btnObd2', settle: 500,
    seedScript: KID_SEED, probe: ADULT_PROBE
  },
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
    url: '/index.html?gopen=vinyls#garage', viewports: ALL_VP,
    budget: 28, wait: '#kid[data-tab="garage"] .gcats [data-c="vinyls"].on', settle: 800
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
  const seedSource = screen.seedScript || (screen.seed ? VINYL_SEED : null);
  if (seedSource) {
    const added = await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: seedSource });
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
  if (result && screen.probe) {
    const probed = await cdp.send('Runtime.evaluate', { expression: screen.probe, awaitPromise: true, returnByValue: true });
    if (!result.issues) result.issues = [];
    if (probed.exceptionDetails) {
      result.issues.push({ severity: 'error', kind: 'kid-probe', msg: 'adult isolation probe failed' });
    } else if (Array.isArray(probed.result && probed.result.value)) {
      result.issues.push.apply(result.issues, probed.result.value);
    }
  }
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

function readRepo(root, rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

function pageOf(url) {
  return String(url || '').split('?')[0].split('#')[0];
}

function auditMenuReachability(root) {
  const issues = [];
  const lines = [];
  function err(kind, msg) { issues.push({ severity: 'error', kind: kind, msg: msg }); }
  const jr = readRepo(root, 'jr.html');
  const world = readRepo(root, 'world.html');
  const icon = readRepo(root, 'world/icon-garage.js');
  const boot = readRepo(root, 'world/boot.js') || '';
  const hud = readRepo(root, 'world/hud.js') || '';
  const crew = readRepo(root, 'crew.html') || '';
  if (!jr || !world || !icon) {
    err('menu', 'Kid App menu sources are missing under ' + root);
    return { issues: issues, tree: lines.join('\n'), errors: issues.length };
  }
  function exists(url) {
    const rel = pageOf(url);
    if (!rel || /^(https?:|data:|javascript:)/.test(rel)) return rel ? !rel.startsWith('javascript:') : false;
    return fs.existsSync(path.join(root, rel));
  }

  const tiles = [];
  const tilesBlock = (jr.match(/const KTILES = \[([\s\S]*?)\n  \];/) || ['', ''])[1];
  let m;
  const tileRe = /\{\s*k:\s*'([^']+)',\s*name:\s*'([^']+)',\s*sub:\s*'([^']*)'/g;
  while ((m = tileRe.exec(tilesBlock))) tiles.push({ id: m[1], name: m[2], sub: m[3] });
  const nav = {};
  const navBlock = (jr.match(/const navMap = \{([^}]*)\}/) || ['', ''])[1];
  const navRe = /(\w+):\s*'([^']+)'/g;
  while ((m = navRe.exec(navBlock))) nav[m[1]] = m[2];
  const knownTabs = new Set(['drive', 'car', 'road', 'drag', 'wanted', 'boost', 'garage']);

  const start = [];
  const startRe = /<button[^>]*data-sm="([^"]+)"[^>]*>([^<]*)</g;
  while ((m = startRe.exec(world))) start.push({ id: m[1], label: m[2].replace(/\s+/g, ' ').trim() });
  const pause = [];
  const pauseRe = /<button[^>]*data-m="([^"]+)"[^>]*>([^<]*)</g;
  while ((m = pauseRe.exec(world))) pause.push({ id: m[1], label: m[2].replace(/\s+/g, ' ').trim() });
  const pauseHandled = new Set();
  const modeRe = /m==='([^']+)'/g;
  while ((m = modeRe.exec(hud))) pauseHandled.add(m[1]);
  if (/data-m="skydrop"|data-m='skydrop'/.test(boot)) pauseHandled.add('skydrop');

  const games = [];
  const gameRe = /registerGame\(\{([\s\S]*?)\n    \}\);/g;
  while ((m = gameRe.exec(icon))) {
    const block = m[1];
    const id = (block.match(/id:\s*'([^']+)'/) || [])[1];
    const title = (block.match(/title:\s*'([^']+)'/) || [])[1];
    const onPlay = (block.match(/onPlay:\s*([\s\S]*)$/) || [])[1] || '';
    if (id && title) games.push({ id: id, title: title, onPlay: onPlay });
  }
  const entries = [];
  const entryRe = /entry === '([^']+)'\)\s*(\w+)\(/g;
  while ((m = entryRe.exec(icon))) entries.push({ id: m[1], fn: m[2] });

  function backToJr(game) {
    return /goJr\(/.test(game.onPlay) || /jr\.html/.test(game.onPlay);
  }
  const submenuNeeds = games.filter(function (g) { return !backToJr(g) && g.id !== 'fly' && g.id !== 'world'; });
  function offered(game) {
    const title = game.title.toUpperCase();
    return start.some(function (s) {
      const label = s.label.toUpperCase();
      return s.id.toLowerCase() === game.id.toLowerCase() || label.indexOf(title) >= 0;
    });
  }

  lines.push('MENU TREE');
  lines.push('MAIN MENU  jr.html');
  if (!tiles.length) err('menu', 'Could not read the Kid App main-menu tiles');
  tiles.forEach(function (tile) {
    const target = nav[tile.id];
    lines.push('  ' + tile.name + '  [' + tile.id + ']  ' + (tile.sub || ''));
    if (target) {
      lines.push('    -> ' + target);
      if (!exists(target)) err('dead', 'Menu tile ' + tile.name + ' opens a missing page: ' + target);
      const worldHome = pageOf(target) === 'world.html' && target.indexOf('entry=') < 0;
      if (worldHome) {
        lines.push('    NEON WORLD SUBMENU  (first screen of world.html)');
        if (!start.length) err('dead', 'Neon World submenu has no mode buttons');
        start.forEach(function (s) {
          lines.push('      ' + s.label + '  [' + s.id + ']');
          if (s.id !== 'runway' && s.id !== 'skydrop') {
            err('dead', 'Neon World start button ' + s.label + ' does not start that mode (unknown modes fall through to the runway)');
          }
        });
        const missing = submenuNeeds.filter(function (g) { return !offered(g); });
        if (missing.length) {
          lines.push('      -- not on this submenu --');
          missing.forEach(function (g) { lines.push('      (missing) ' + g.title + '  [' + g.id + ']'); });
        }
        lines.push('    PAUSE MENU');
        pause.forEach(function (p) {
          lines.push('      ' + p.label + '  [' + p.id + ']');
          if (!pauseHandled.has(p.id)) err('dead', 'Pause button ' + p.label + ' has no handler');
        });
        lines.push('    PAUSE GAME GRID  (after START, then pause)');
        games.forEach(function (g) { lines.push('      ' + g.title + '  [' + g.id + ']'); });
        appendDrillTree(lines, icon, 'WDRILL');
      }
    } else if (knownTabs.has(tile.id)) {
      lines.push('    -> in-app tab ' + tile.id);
      if (tile.id === 'garage') appendDrillTree(lines, jr, 'GDRILL');
    } else {
      lines.push('    -> NO HANDLER');
      err('dead', 'Menu tile ' + tile.name + ' [' + tile.id + '] has no handler');
    }
  });

  lines.push('CREW & PETS  crew.html');
  const pets = [];
  const petRe = /\['([^']+)',\s*'([^']+)'\]/g;
  const petBlock = (icon.match(/const CREW_PETS = \[([\s\S]*?)\];/) || ['', ''])[1];
  while ((m = petRe.exec(petBlock))) pets.push(m[2] + ' [' + m[1] + ']');
  const chars = [];
  const charBlock = (icon.match(/const CREW_CHARS = \[([\s\S]*?)\];/) || ['', ''])[1];
  const charRe = /\['([^']+)',\s*'([^']+)'\]/g;
  while ((m = charRe.exec(charBlock))) chars.push(m[2] + ' [' + m[1] + ']');
  if (chars.length) lines.push('  characters: ' + chars.join(', '));
  if (pets.length) lines.push('  pets: ' + pets.join(', '));
  else lines.push('  (no pet list in the crew menu catalog)');
  const linkRe = /<a[^>]*href="([^"]+)"[^>]*>([^<]*)</g;
  while ((m = linkRe.exec(crew))) {
    const href = m[1];
    const label = m[2].replace(/\s+/g, ' ').trim();
    if (!label) continue;
    lines.push('  ' + label + ' -> ' + href);
    if (!exists(href)) err('dead', 'Crew menu "' + label + '" opens a missing page: ' + href);
    if (/RECORD/i.test(label) && /DANCE/i.test(label) && href.indexOf('dance-stage.html') < 0) {
      err('dead', 'Crew menu "' + label + '" does not open the dance recorder (' + href + ')');
    }
  }

  submenuNeeds.forEach(function (g) {
    if (offered(g)) return;
    const home = tiles.some(function (t) { return t.id === g.id || t.name.toUpperCase() === g.title.toUpperCase(); });
    err('submenu', 'Neon World submenu does not offer ' + g.title + '. The start card only reaches ' + (start.map(function (s) { return s.label; }).join(', ') || 'nothing') + '.' + (home ? ' A separate main-menu tile also exists, which is why a layout pass missed this.' : ''));
  });

  entries.forEach(function (e) {
    if (e.id === 'hub') return;
    const inNav = Object.keys(nav).some(function (k) { return String(nav[k]).indexOf('entry=' + e.id) >= 0; });
    const inStart = start.some(function (s) { return s.id === e.id; });
    const inGames = games.some(function (g) { return g.id === e.id; });
    if (!inNav && !inStart && !inGames) {
      const names = { street: 'STREET CRUISE', builder: 'CITY BUILDER', stunt: 'ROOFTOP STUNT RUN' };
      err('unreachable', 'World mode "' + (names[e.id] || e.id) + '" (' + e.fn + ', entry=' + e.id + ') is built and no menu tile reaches it.');
    }
  });
  const takeoverCalls = (icon.match(/playTakeover\(/g) || []).length;
  if (icon.indexOf('function playTakeover') >= 0 && takeoverCalls < 2) {
    err('unreachable', 'Z TAKEOVER inside Neon World (playTakeover) is built and no menu calls it.');
  }

  const holdRe = /\{[^{}]*\bhold:\s*true\b[^{}]*\}/g;
  while ((m = holdRe.exec(jr))) {
    const name = (m[0].match(/name:\s*(?:"([^"]*)"|'([^']*)')/) || []);
    err('placeholder', 'Garage menu offers "' + (name[1] || name[2] || 'unnamed item') + '" but it is a coming-soon placeholder (on hold).');
  }

  const menuBlob = [jr, world, readRepo(root, 'world-split.html') || '', icon, boot, hud, crew].join('\n');
  ['fly2.html', 'fly3.html', 'neon-paint.html', 'dance-stage.html', 'crew.html', 'char.html', 'world.html', 'world-split.html', 'garage-hub.html'].forEach(function (page) {
    if (menuBlob.indexOf(page) >= 0) return;
    const html = readRepo(root, page);
    if (!html) return;
    if (/location\.replace\(['"]jr\.html|url=jr\.html/.test(html)) return;
    lines.push('ORPHAN PAGE  ' + page);
    err('unreachable', 'Kid App page ' + page + ' ships in the repo and no menu tile opens it.');
  });

  lines.push('');
  lines.push('FINDINGS');
  if (!issues.length) lines.push('Every shipped kid game, mode, and app is reachable from a live menu tile.');
  issues.forEach(function (issue) { lines.push(issue.severity.toUpperCase() + ' / ' + issue.kind + ': ' + issue.msg); });
  return { issues: issues, tree: lines.join('\n'), errors: issues.filter(function (i) { return i.severity === 'error'; }).length };
}

function appendDrillTree(lines, source, name) {
  const re = new RegExp('(?:const|var) ' + name + ' = \\{([\\s\\S]*?)\\n  \\};');
  const block = (source.match(re) || ['', ''])[1];
  if (!block) { lines.push('    (' + name + ' drill not found)'); return; }
  lines.push('    ' + name + '  GARAGE / HOME DRILL');
  const roots = block.match(/roots:\s*\[([\s\S]*?)\],\s*broad:/);
  if (roots) {
    const rootRe = /id: '([^']+)'[\s\S]*?title: '([^']+)'/g;
    let rm;
    while ((rm = rootRe.exec(roots[1]))) lines.push('      ' + rm[2] + '  [' + rm[1] + ']');
  }
  const broadAt = block.indexOf('broad:');
  const broadBlock = broadAt >= 0 ? block.slice(broadAt) : '';
  const broadRe = /\{ id: '([^']+)', emoji: '[^']*', title: '([^']+)'[\s\S]*?subs: \[([\s\S]*?)\] \}/g;
  let m;
  while ((m = broadRe.exec(broadBlock))) {
    lines.push('      ' + m[2] + '  [' + m[1] + ']');
    const subs = m[3].match(/\['([^']+)',\s*'([^']+)'\]/g) || [];
    subs.forEach(function (row) {
      const parts = row.match(/\['([^']+)',\s*'([^']+)'\]/);
      if (!parts) return;
      lines.push('        ' + parts[2] + '  [' + parts[1] + ']');
      if (parts[1] === 'paintapp') lines.push('          -> neon-paint.html');
      if (parts[1] === 'wallapp') lines.push('          -> neon-paint.html?mode=wall');
      if (parts[1] === 'danceapp') lines.push('          -> dance-stage.html');
      if (parts[1] === 'enter') lines.push('          -> crew.html, world.html');
    });
  }
}

const PWA_PAGES = [
  { file: 'index.html', manifest: 'manifest.webmanifest' },
  { file: 'jr.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'world.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'world-split.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'neon-paint.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'crew.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'dance-stage.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'fly3.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'char.html', manifest: 'manifest-jr.webmanifest' },
  { file: 'garage-hub.html', manifest: 'manifest-jr.webmanifest' }
];

function tagAttr(tag, name) {
  const m = tag.match(new RegExp('\\b' + name + '\\s*=\\s*["\']([^"\']*)["\']', 'i'));
  return m ? m[1] : '';
}

function metaContents(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const vals = [];
  tags.forEach(function (tag) {
    if (tagAttr(tag, 'name').toLowerCase() !== name.toLowerCase()) return;
    vals.push(tagAttr(tag, 'content'));
  });
  return vals;
}

function manifestHref(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const hrefs = [];
  tags.forEach(function (tag) {
    if (tagAttr(tag, 'rel').toLowerCase() !== 'manifest') return;
    hrefs.push(tagAttr(tag, 'href').split('?')[0]);
  });
  return hrefs;
}

function scopePath(scope) {
  let s = String(scope || '').split('#')[0].split('?')[0];
  if (s.startsWith('./')) s = s.slice(2);
  if (s.startsWith('/')) s = s.slice(1);
  return s;
}

function scopeCoversDirectory(scope) {
  const s = scopePath(scope);
  return s === '' || s.endsWith('/');
}

function startInScope(start, scope) {
  const sc = scopePath(scope);
  const st = scopePath(start);
  if (sc === '' || sc.endsWith('/')) return st.indexOf('..') === -1;
  return st === sc;
}

function scanPwaDisplay(root) {
  const issues = [];
  const lines = ['pwa display'];
  function bad(kind, msg) {
    issues.push({ severity: 'error', kind: kind, msg: msg });
    lines.push('  ERROR  ' + msg);
  }
  const manifests = {};
  ['manifest.webmanifest', 'manifest-jr.webmanifest'].forEach(function (name) {
    const file = path.join(root, name);
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (e) { bad('manifest', name + ' is not readable JSON'); return; }
    manifests[name] = data;
    const display = data.display;
    const over = Array.isArray(data.display_override) ? data.display_override : [];
    if (display !== 'fullscreen') bad('display', name + ' display is ' + JSON.stringify(display) + ' (need fullscreen)');
    if (over[0] !== 'fullscreen') bad('display', name + ' display_override must start with fullscreen');
    if (!scopeCoversDirectory(data.scope)) bad('scope', name + ' scope ' + JSON.stringify(data.scope) + ' does not cover the app directory');
    if (!startInScope(data.start_url, data.scope)) bad('scope', name + ' start_url ' + JSON.stringify(data.start_url) + ' is outside scope ' + JSON.stringify(data.scope));
    if (String(data.theme_color || '').toLowerCase() !== '#000000') bad('theme', name + ' theme_color must be #000000');
    if (String(data.background_color || '').toLowerCase() !== '#000000') bad('theme', name + ' background_color must be #000000');
    if (data.orientation !== 'landscape') bad('display', name + ' orientation must be landscape');
    lines.push('  ' + name + '  scope ' + data.scope + '  start ' + data.start_url + '  display ' + display + '  id ' + data.id);
  });
  const adult = manifests['manifest.webmanifest'];
  const kid = manifests['manifest-jr.webmanifest'];
  if (adult && kid) {
    const fields = ['display', 'orientation', 'theme_color', 'background_color'];
    fields.forEach(function (key) {
      if (adult[key] !== kid[key]) bad('display', 'manifest mismatch ' + key + ': ' + adult[key] + ' vs ' + kid[key]);
    });
    if (JSON.stringify(adult.display_override || []) !== JSON.stringify(kid.display_override || [])) {
      bad('display', 'manifest display_override mismatch');
    }
  }
  PWA_PAGES.forEach(function (page) {
    const file = path.join(root, page.file);
    let html;
    try { html = fs.readFileSync(file, 'utf8'); }
    catch (e) { bad('page', page.file + ' is missing'); return; }
    const hrefs = manifestHref(html);
    if (hrefs.length !== 1 || hrefs[0] !== page.manifest) {
      bad('manifest', page.file + ' manifest link is ' + JSON.stringify(hrefs) + ' (need ' + page.manifest + ')');
    }
    const man = manifests[page.manifest];
    if (man && !startInScope(page.file, man.scope)) bad('scope', page.file + ' is outside ' + page.manifest + ' scope ' + man.scope);
    const apple = metaContents(html, 'apple-mobile-web-app-capable');
    const mobile = metaContents(html, 'mobile-web-app-capable');
    const bar = metaContents(html, 'apple-mobile-web-app-status-bar-style');
    const theme = metaContents(html, 'theme-color');
    if (apple.length !== 1 || String(apple[0]).toLowerCase() !== 'yes') bad('meta', page.file + ' needs apple-mobile-web-app-capable=yes');
    if (mobile.length !== 1 || String(mobile[0]).toLowerCase() !== 'yes') bad('meta', page.file + ' needs mobile-web-app-capable=yes');
    if (bar.length !== 1 || String(bar[0]).toLowerCase() !== 'black-translucent') bad('meta', page.file + ' needs apple-mobile-web-app-status-bar-style=black-translucent');
    if (!theme.length || theme.some(function (v) { return String(v).toLowerCase() !== '#000000'; })) bad('theme', page.file + ' theme-color must be #000000');
    if (!issues.some(function (i) { return i.msg.indexOf(page.file + ' ') === 0; })) {
      lines.push('  ' + page.file + '  ' + page.manifest + '  apple yes  theme #000000');
    }
  });
  const skip = new Set(['node_modules', 'test-results', 'tools', '.git']);
  function walk(dir) {
    fs.readdirSync(dir).forEach(function (name) {
      if (skip.has(name)) return;
      const p = path.join(dir, name);
      let st;
      try { st = fs.statSync(p); } catch (e) { return; }
      if (st.isDirectory()) walk(p);
      else if (/\.(html|js)$/.test(name)) scanFsFile(p);
    });
  }
  function scanFsFile(file) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const exitRe = /\.(?:webkit)?exitFullscreen\s*\(/g;
    let m;
    while ((m = exitRe.exec(text))) {
      const prev = text.slice(Math.max(0, m.index - 500), m.index);
      if (!/click|pointerup|onclick/i.test(prev)) bad('exit-fullscreen', rel + ' calls exitFullscreen without a user gesture');
    }
    const reqRe = /\.(?:webkit)?requestFullscreen\s*\(/g;
    while ((m = reqRe.exec(text))) {
      const prev = text.slice(Math.max(0, m.index - 900), m.index);
      if (!/display-mode:\s*standalone/.test(prev) && !/display-mode:\s*fullscreen/.test(prev)) {
        bad('display-guard', rel + ' calls requestFullscreen without a standalone/fullscreen display-mode guard');
      }
    }
    const openRe = /window\.open\s*\([^)]{0,240}_blank/g;
    while ((m = openRe.exec(text))) bad('pwa-popup', rel + ' opens a same-app window with window.open _blank');
  }
  walk(root);
  lines.push('pwa errors ' + issues.length);
  return { issues: issues, text: lines.join('\n'), errors: issues.length };
}

function writeMenuReport(outDir, report) {
  fs.mkdirSync(outDir, { recursive: true });
  const body = report.tree + '\n';
  fs.writeFileSync(path.join(outDir, 'menu-reach.txt'), body);
  return body;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('node tools/ui-polish-audit.js [--out dir] [--port n] [--only a,b] [--base url] [--root dir] [--menus-only] [--pwa-only]');
    return;
  }
  const menuRoot = args.root || ROOT;
  fs.mkdirSync(args.out, { recursive: true });
  const pwaReport = scanPwaDisplay(menuRoot);
  fs.writeFileSync(path.join(args.out, 'pwa-display.txt'), pwaReport.text + '\n');
  console.log(pwaReport.text);
  if (args.pwaOnly) {
    process.exitCode = pwaReport.errors ? 1 : 0;
    return;
  }
  const wantMenus = args.menusOnly || !args.only || args.only.includes('menu-reach');
  let menuReport = null;
  if (wantMenus) {
    fs.mkdirSync(args.out, { recursive: true });
    menuReport = auditMenuReachability(menuRoot);
    writeMenuReport(args.out, menuReport);
    console.log(menuReport.tree);
    console.log('menu-reach errors ' + menuReport.errors + '  root ' + menuRoot);
    if (args.menusOnly) {
      process.exitCode = (menuReport.errors || pwaReport.errors) ? 1 : 0;
      return;
    }
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
    if (!args.only || args.only.includes('adult-source')) {
      const sourceIssues = scanAdultIndex();
      rows.push({
        id: 'adult-source',
        title: 'Adult index.html source has no Kid App scripts or storage',
        url: '/index.html',
        viewport: 'source',
        size: [0, 0],
        ready: sourceIssues.length === 0,
        errors: sourceIssues.filter(i => i.severity === 'error').length,
        warns: sourceIssues.filter(i => i.severity === 'warn').length,
        screenshot: '',
        audit: { issues: sourceIssues, controls: 0 }
      });
      console.log('audit adult-source e=' + sourceIssues.length);
    }
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
    const menuErrors = menuReport ? menuReport.errors : 0;
    console.log('errors ' + summary.errors + ' warnings ' + summary.warns + ' menu-reach ' + menuErrors + ' pwa ' + pwaReport.errors);
    process.exitCode = (summary.errors || menuErrors || pwaReport.errors) ? 1 : 0;
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
