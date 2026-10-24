#!/usr/bin/env node
/**
 * Installed-app display check.
 *
 * Headless Chrome on Android and iOS sizes. Standalone is a real --app
 * window (display-mode: standalone). Fullscreen is a matchMedia override
 * because Emulation.setEmulatedMedia ignores display-mode in this Chrome.
 * Walks adult → Kid Z → menu → Neon World → back, then Garage, Paint and
 * Crew. Fails if a navigation calls requestFullscreen / exitFullscreen,
 * opens a second window, or drops the manifest / apple web-app metas.
 *
 *   node tools/pwa-display-audit.js [--out dir] [--port n]
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME || 'google-chrome';

const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

const SPY = `
(function () {
  /* Chrome 156's Emulation.setEmulatedMedia accepts display-mode and then
     ignores it (prefers-color-scheme still works). Standalone is a real
     --app window. Fullscreen is applied here only when the harness set
     sessionStorage zdDisplayMode, because that is the branch --app does not report. */
  try {
    var mode = sessionStorage.getItem('zdDisplayMode') || '';
    if (mode === 'fullscreen' || mode === 'standalone' || mode === 'browser') {
      var origMM = window.matchMedia.bind(window);
      window.matchMedia = function (q) {
        var mql = origMM(q);
        var s = String(q);
        if (s.indexOf('display-mode') === -1) return mql;
        var matches = s.split(',').some(function (part) {
          return part.indexOf('display-mode') !== -1 && part.indexOf(mode) !== -1;
        });
        return new Proxy(mql, { get: function (t, p) {
          if (p === 'matches') return matches;
          var v = t[p];
          return typeof v === 'function' ? v.bind(t) : v;
        } });
      };
    }
  } catch (e) {}
  function bump(kind) {
    try {
      var raw = sessionStorage.getItem('zdPwaFs') || '[]';
      var arr = JSON.parse(raw);
      arr.push({
        kind: kind,
        href: location.href,
        standalone: matchMedia('(display-mode: standalone)').matches,
        fullscreen: matchMedia('(display-mode: fullscreen)').matches
      });
      sessionStorage.setItem('zdPwaFs', JSON.stringify(arr));
    } catch (e) {}
  }
  var orig = Element.prototype.requestFullscreen;
  Element.prototype.requestFullscreen = function () {
    bump('requestFullscreen');
    if (orig) return orig.apply(this, arguments);
    return Promise.reject(new Error('unsupported'));
  };
  var wk = Element.prototype.webkitRequestFullscreen;
  if (wk) Element.prototype.webkitRequestFullscreen = function () { bump('webkitRequestFullscreen'); return wk.apply(this, arguments); };
  var ex = Document.prototype.exitFullscreen;
  if (ex) Document.prototype.exitFullscreen = function () { bump('exitFullscreen'); return ex.apply(this, arguments); };
  var wex = Document.prototype.webkitExitFullscreen;
  if (wex) Document.prototype.webkitExitFullscreen = function () { bump('webkitExitFullscreen'); return wex.apply(this, arguments); };
  var open = window.open;
  window.open = function (url, target) {
    try {
      var u = new URL(url, location.href);
      if (u.origin === location.origin) bump('window.open:' + (target || '') + ':' + u.pathname);
    } catch (e) { bump('window.open'); }
    return open.apply(this, arguments);
  };
})();
`;

function parseArgs(argv) {
  const out = { out: path.join(ROOT, 'test-results', 'pwa-display'), port: 0 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') out.out = path.resolve(argv[++i]);
    else if (a === '--port') out.port = Number(argv[++i]);
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
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function launchChrome(port, extra) {
  const dir = fs.mkdtempSync(path.join('/tmp', 'zd-pwa-chrome-'));
  const args = [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking', '--disable-sync',
    '--autoplay-policy=no-user-gesture-required', '--mute-audio',
    '--remote-debugging-port=' + port, '--user-data-dir=' + dir
  ].concat(extra || []).concat(extra && extra.some((a) => a.indexOf('--app=') === 0) ? [] : ['about:blank']);
  const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return { child, dir };
}

async function waitJson(url, tries) {
  let last = '';
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      last = String(res.status);
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
      }
    });
  }
  async send(method, params, timeout) {
    await this.ready;
    const id = this.next++;
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.pending.delete(id); rej(new Error('timeout ' + method)); }, timeout || 30000);
      this.pending.set(id, {
        res: (v) => { clearTimeout(t); res(v); },
        rej: (e) => { clearTimeout(t); rej(e); }
      });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function evalJson(cdp, expression) {
  const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error((d.exception && d.exception.description) || d.text || 'eval failed');
  }
  return r.result ? r.result.value : undefined;
}

async function waitUntil(cdp, expression, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const ok = await evalJson(cdp, '!!(' + expression + ')');
    if (ok) return true;
    await sleep(200);
  }
  return false;
}

async function clickSel(cdp, sel) {
  const box = await evalJson(cdp, `(() => {
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  })()`);
  if (!box || box.w < 2 || box.h < 2) throw new Error('missing ' + sel);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
}

async function blankTap(cdp) {
  const pt = await evalJson(cdp, `(() => {
    for (let y = 16; y < innerHeight - 8; y += 28) {
      for (let x = 16; x < innerWidth - 8; x += 36) {
        const hit = document.elementFromPoint(x, y);
        if (!hit || hit.closest('button,a,input,select,textarea')) continue;
        return { x: x, y: y, tag: hit.tagName };
      }
    }
    return null;
  })()`);
  if (!pt) throw new Error('no empty tap point');
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pt.x, y: pt.y, button: 'left', clickCount: 1 });
  return pt;
}

function snapExpr() {
  return `(() => {
    const q = (n) => { const el = document.querySelector('meta[name="' + n + '"]'); return el ? el.content : ''; };
    const link = document.querySelector('link[rel="manifest"]');
    let fs = [];
    try { fs = JSON.parse(sessionStorage.getItem('zdPwaFs') || '[]'); } catch (e) {}
    return {
      href: location.href,
      standalone: matchMedia('(display-mode: standalone)').matches,
      fullscreen: matchMedia('(display-mode: fullscreen)').matches,
      manifest: link ? link.getAttribute('href') : '',
      apple: q('apple-mobile-web-app-capable'),
      mobile: q('mobile-web-app-capable'),
      bar: q('apple-mobile-web-app-status-bar-style'),
      theme: q('theme-color'),
      btnFs: document.querySelector('#btnFs') ? document.querySelector('#btnFs').className : '',
      fs: fs
    };
  })()`;
}

async function readState(cdp) {
  await waitUntil(cdp, "!!document.querySelector('link[rel=\"manifest\"]')", 20000);
  return evalJson(cdp, snapExpr());
}

async function pageCount(port) {
  const list = await waitJson('http://127.0.0.1:' + port + '/json/list', 5);
  return list.filter((t) => t.type === 'page').length;
}

async function shot(cdp, file) {
  const pic = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(file, Buffer.from(pic.data, 'base64'));
}

async function goto(cdp, url) {
  await cdp.send('Page.navigate', { url });
  const ok = await waitUntil(cdp, 'document.readyState === "interactive" || document.readyState === "complete"', 45000);
  if (!ok) throw new Error('nav timeout ' + url);
  await sleep(150);
}

function expectInstalled(state, manifest, errors, label) {
  const href = state.href || '';
  if (!/manifest/.test(state.manifest || '') || state.manifest.indexOf(manifest) === -1) {
    errors.push(label + ' manifest ' + state.manifest + ' at ' + href);
  }
  if (String(state.apple).toLowerCase() !== 'yes' || String(state.mobile).toLowerCase() !== 'yes') {
    errors.push(label + ' missing apple/mobile web-app capable at ' + href);
  }
  if (String(state.bar).toLowerCase() !== 'black-translucent') errors.push(label + ' status bar ' + state.bar);
  if (String(state.theme).toLowerCase() !== '#000000') errors.push(label + ' theme ' + state.theme);
  const bad = (state.fs || []).filter((c) => c.kind !== 'note');
  if (bad.length) errors.push(label + ' fullscreen API calls ' + JSON.stringify(bad));
}

async function runProfile(cdp, base, port, profile, errors, shotDir, fullPath) {
  const lines = [];
  const note = (s) => { const line = profile.name + '  ' + s; lines.push(line); console.log(line); };
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: profile.width, height: profile.height, deviceScaleFactor: profile.dpr, mobile: true,
    screenWidth: profile.width, screenHeight: profile.height
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await cdp.send('Emulation.setUserAgentOverride', { userAgent: profile.ua });
  await goto(cdp, base + '/index.html?zdpol=' + encodeURIComponent(profile.name));
  if (profile.mode === 'fullscreen') await evalJson(cdp, 'sessionStorage.setItem("zdDisplayMode","fullscreen")');
  else await evalJson(cdp, 'sessionStorage.removeItem("zdDisplayMode")');
  await evalJson(cdp, 'sessionStorage.removeItem("zdPwaFs")');
  await goto(cdp, base + '/index.html?zdpol=' + encodeURIComponent(profile.name) + '&boot=1');
  let state = await readState(cdp);
  note('index ' + state.href + ' standalone=' + state.standalone + ' fullscreen=' + state.fullscreen + ' manifest=' + state.manifest);
  if (profile.mode === 'standalone' && !state.standalone) errors.push(profile.name + ' display-mode standalone did not apply');
  if (profile.mode === 'fullscreen' && !state.fullscreen) errors.push(profile.name + ' display-mode fullscreen did not apply');
  if (profile.mode === 'browser' && (state.standalone || state.fullscreen)) errors.push(profile.name + ' browser mode looked installed');
  if (profile.mode === 'browser') {
    const before = (state.fs || []).length;
    const pt = await blankTap(cdp);
    await sleep(300);
    state = await evalJson(cdp, snapExpr());
    const calls = (state.fs || []).slice(before);
    note('browser blank tap ' + JSON.stringify(pt) + ' calls ' + JSON.stringify(calls));
    if (!calls.some((c) => c.kind === 'requestFullscreen' || c.kind === 'webkitRequestFullscreen')) {
      errors.push(profile.name + ' browser tab did not request fullscreen on first tap');
    }
    if (calls.some((c) => /exitFullscreen|window.open/.test(c.kind))) errors.push(profile.name + ' browser tap exited fullscreen');
    return lines;
  }
  expectInstalled(state, 'manifest.webmanifest', errors, profile.name + ' index');
  if (state.btnFs && !/\bhidden\b/.test(state.btnFs)) errors.push(profile.name + ' FULL button visible inside the installed app');
  const pagesBefore = await pageCount(port);
  await blankTap(cdp);
  await sleep(200);
  state = await readState(cdp);
  if ((state.fs || []).length) errors.push(profile.name + ' blank tap requested fullscreen ' + JSON.stringify(state.fs));
  if (!(await waitUntil(cdp, "document.querySelector('#btnNeonZ')", 8000))) errors.push(profile.name + ' no KID Z button');
  else await clickSel(cdp, '#btnNeonZ');
  if (!(await waitUntil(cdp, "/jr\\.html/.test(location.pathname) && document.querySelector('#btnKStart')", 20000))) {
    errors.push(profile.name + ' did not reach jr start');
    return lines;
  }
  state = await readState(cdp);
  note('jr start ' + state.manifest + ' standalone=' + state.standalone + ' fullscreen=' + state.fullscreen + ' fs=' + (state.fs || []).length);
  expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' jr');
  if ((await pageCount(port)) !== pagesBefore) errors.push(profile.name + ' KID Z opened another window');
  await clickSel(cdp, '#btnKStart');
  if (!(await waitUntil(cdp, "document.querySelector('[data-tile=\"world\"]')", 15000))) {
    errors.push(profile.name + ' kid menu has no NEON WORLD tile');
    return lines;
  }
  if (shotDir && profile.shot) await shot(cdp, path.join(shotDir, profile.name + '-jr-menu.png'));
  await clickSel(cdp, '[data-tile="world"]');
  if (!(await waitUntil(cdp, "/world\\.html/.test(location.pathname) && typeof goFull === 'function'", 25000))) {
    errors.push(profile.name + ' did not reach Neon World');
    return lines;
  }
  state = await readState(cdp);
  note('world ' + state.manifest + ' mode standalone=' + state.standalone + ' fullscreen=' + state.fullscreen);
  expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' world');
  if ((await pageCount(port)) !== pagesBefore) errors.push(profile.name + ' Neon World opened another window');
  if (shotDir && profile.shot) await shot(cdp, path.join(shotDir, profile.name + '-world.png'));
  await clickSel(cdp, '#ready');
  await sleep(400);
  state = await readState(cdp);
  if ((state.fs || []).some((c) => /requestFullscreen|exitFullscreen|window\.open/.test(c.kind))) {
    errors.push(profile.name + ' READY/goFull called fullscreen API ' + JSON.stringify(state.fs));
  }
  if (!(await waitUntil(cdp, "document.querySelector('#kMenuB') && !document.querySelector('#kMenuB').classList.contains('hidden')", 8000))) {
    errors.push(profile.name + ' world pause button stayed hidden');
  } else {
    await clickSel(cdp, '#kMenuB');
    await sleep(200);
    await clickSel(cdp, '[data-m="full"]');
    await sleep(300);
    state = await readState(cdp);
    note('pause fullscreen fs=' + JSON.stringify(state.fs));
    if ((state.fs || []).length) errors.push(profile.name + ' pause FULLSCREEN called fullscreen API ' + JSON.stringify(state.fs));
    await clickSel(cdp, '#kMenuB');
    await sleep(200);
    await clickSel(cdp, '[data-m="home"]');
  }
  if (!(await waitUntil(cdp, "/jr\\.html/.test(location.pathname)", 20000))) {
    errors.push(profile.name + ' Neon World home did not return to jr');
    return lines;
  }
  state = await readState(cdp);
  note('back ' + state.href);
  expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' back');
  if ((await pageCount(port)) !== pagesBefore) errors.push(profile.name + ' back opened another window');

  async function tileVisible(sel) {
    return evalJson(cdp, `(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2; })()`);
  }
  async function openMenu() {
    for (let i = 0; i < 25; i++) {
      if (await tileVisible('[data-tile="paint"]')) return true;
      if (await tileVisible('#btnKStart')) { await clickSel(cdp, '#btnKStart'); await sleep(300); continue; }
      if (await tileVisible('[data-m="home"]')) { await clickSel(cdp, '[data-m="home"]'); await sleep(300); continue; }
      if (await tileVisible('#kMenuB')) { await clickSel(cdp, '#kMenuB'); await sleep(300); continue; }
      await sleep(200);
    }
    return false;
  }
  if (!(await openMenu())) { errors.push(profile.name + ' menu did not reopen'); return lines; }
  await clickSel(cdp, '[data-tile="garage"]');
  if (!(await waitUntil(cdp, "document.querySelector('#kid') && document.querySelector('#kid').dataset.tab==='garage' && document.querySelector('#kGarage') && !document.querySelector('#kGarage').classList.contains('hidden')", 8000))) {
    errors.push(profile.name + ' GARAGE tile did not open the garage');
  }
  state = await readState(cdp);
  note('garage tab ' + state.href + ' fs=' + (state.fs || []).length);
  expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' garage');
  if (!/jr\.html/.test(state.href)) errors.push(profile.name + ' garage left jr.html');

  if (!(await openMenu())) {
    const info = await evalJson(cdp, `(() => {
      const b = document.querySelector('#kMenuB');
      const r = b && b.getBoundingClientRect();
      const kid = document.querySelector('#kid');
      const st = b ? getComputedStyle(b) : null;
      return { btn: b ? { c: b.className, w: r.width, h: r.height, d: st.display, v: st.visibility } : null, kid: kid ? kid.className + ' tab=' + kid.dataset.tab : null, home: (document.querySelector('#kHome')||{}).className || '' };
    })()`);
    errors.push(profile.name + ' menu missing before paint ' + JSON.stringify(info));
    return lines;
  }
  await clickSel(cdp, '[data-tile="paint"]');
  if (!(await waitUntil(cdp, "/neon-paint\\.html/.test(location.pathname)", 25000))) {
    errors.push(profile.name + ' paint tile did not open neon-paint.html');
  } else {
    state = await readState(cdp);
    note('paint ' + state.manifest);
    expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' paint');
    if ((await pageCount(port)) !== pagesBefore) errors.push(profile.name + ' paint opened another window');
    if (shotDir && profile.shot) await shot(cdp, path.join(shotDir, profile.name + '-paint.png'));
    await goto(cdp, base + '/jr.html?kmenu=1');
  }
  state = await readState(cdp);
  expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' menu-after-paint');
  if (!(await waitUntil(cdp, "(() => { const el = document.querySelector('[data-tile=\"crew\"]'); if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2; })()", 15000))) {
    errors.push(profile.name + ' no CREW tile');
    return lines;
  }
  await clickSel(cdp, '[data-tile="crew"]');
  if (!(await waitUntil(cdp, "/crew\\.html/.test(location.pathname)", 20000))) {
    errors.push(profile.name + ' crew tile did not open crew.html');
    return lines;
  }
  state = await readState(cdp);
  note('crew ' + state.manifest);
  expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' crew');
  if ((await pageCount(port)) !== pagesBefore) errors.push(profile.name + ' crew opened another window');
  if (!(await waitUntil(cdp, "document.querySelector('#kMenuB')", 8000))) errors.push(profile.name + ' crew has no menu');
  else {
    await clickSel(cdp, '#kMenuB');
    await sleep(200);
    if (!(await waitUntil(cdp, "document.querySelector('a[href=\"jr.html?kmenu=1\"]')", 4000))) errors.push(profile.name + ' crew menu has no main-menu link');
    else await clickSel(cdp, 'a[href="jr.html?kmenu=1"]');
  }
  if (!(await waitUntil(cdp, "/jr\\.html/.test(location.pathname)", 20000))) errors.push(profile.name + ' crew did not return home');
  else {
    state = await readState(cdp);
    expectInstalled(state, 'manifest-jr.webmanifest', errors, profile.name + ' after-crew');
  }
  if (!fullPath) return lines;
  const extras = ['dance-stage.html', 'fly3.html', 'char.html', 'world-split.html', 'garage-hub.html'];
  for (const page of extras) {
    await goto(cdp, base + '/' + page);
    if (page === 'garage-hub.html') {
      await waitUntil(cdp, "/jr\\.html/.test(location.pathname)", 10000);
    }
    state = await readState(cdp);
    note(page + ' → ' + state.href + ' manifest=' + state.manifest);
    const want = /index\.html/.test(state.href) ? 'manifest.webmanifest' : 'manifest-jr.webmanifest';
    expectInstalled(state, want, errors, profile.name + ' ' + page);
    if ((await pageCount(port)) !== pagesBefore) errors.push(profile.name + ' ' + page + ' opened another window');
  }
  return lines;
}

async function withChrome(base, extra, profiles, errors, shotDir, transcript) {
  const debugPort = 9600 + Math.floor(Math.random() * 300);
  const chrome = launchChrome(debugPort, extra);
  const kill = () => { try { chrome.child.kill('SIGKILL'); } catch (e) {} };
  process.on('exit', kill);
  try {
    const list = await waitJson('http://127.0.0.1:' + debugPort + '/json/list', 50);
    const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    if (!page) throw new Error('no chrome page ' + JSON.stringify(list.map((t) => t.type + ':' + t.url)));
    const cdp = new Cdp(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: SPY });
    for (const profile of profiles) {
      if (process.env.ONLY && profile.name !== process.env.ONLY) continue;
      const extras = profile.name === 'android-915x412-standalone' || profile.name === 'ios-844x390-standalone';
      try {
        const lines = await runProfile(cdp, base, debugPort, profile, errors, shotDir, extras);
        if (lines) transcript.push.apply(transcript, lines);
      } catch (err) {
        errors.push(profile.name + ' runner ' + err.message);
        console.log(profile.name + ' FAIL ' + err.message);
      }
    }
    cdp.close();
  } finally {
    kill();
    try { fs.rmSync(chrome.dir, { recursive: true, force: true }); } catch (e) {}
  }
}

async function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(args.out, { recursive: true });
  const shotDir = path.join(args.out, 'screenshots');
  fs.mkdirSync(shotDir, { recursive: true });
  const server = await startServer(args.port || 0);
  const addr = server.address();
  const base = 'http://127.0.0.1:' + addr.port;
  const errors = [];
  const transcript = [];
  const standalone = [
    { name: 'android-915x412-standalone', width: 915, height: 412, dpr: 2.5, ua: ANDROID_UA, mode: 'standalone', shot: true },
    { name: 'ios-844x390-standalone', width: 844, height: 390, dpr: 3, ua: IPHONE_UA, mode: 'standalone', shot: true },
    { name: 'ios-1180x820-standalone', width: 1180, height: 820, dpr: 2, ua: IPAD_UA, mode: 'standalone', shot: false }
  ];
  const other = [
    { name: 'android-915x412-fullscreen', width: 915, height: 412, dpr: 2.5, ua: ANDROID_UA, mode: 'fullscreen', shot: false },
    { name: 'android-915x412-browser', width: 915, height: 412, dpr: 2.5, ua: ANDROID_UA, mode: 'browser', shot: false }
  ];
  console.log('standalone: Chrome --app (real display-mode standalone)');
  console.log('fullscreen: matchMedia override (CDP setEmulatedMedia ignores display-mode)');
  transcript.push('standalone: Chrome --app (real display-mode standalone)');
  transcript.push('fullscreen: matchMedia override (CDP setEmulatedMedia ignores display-mode)');
  try {
    await withChrome(base, ['--app=' + base + '/index.html'], standalone, errors, shotDir, transcript);
    await withChrome(base, [], other, errors, shotDir, transcript);
  } finally {
    server.close();
  }
  const body = transcript.join('\n') + '\n' + (errors.length ? errors.map((e) => 'ERROR  ' + e).join('\n') + '\n' : 'ok\n') + 'errors ' + errors.length + '\n';
  fs.writeFileSync(path.join(args.out, 'pwa-standalone.txt'), body);
  console.log(body);
  process.exitCode = errors.length ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
