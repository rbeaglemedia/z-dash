import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const OUT = path.join(ROOT, 'test-results/remove-adult-share');
const ART = '/opt/cursor/artifacts';
const PORT = 8766;
const CDP = 9333;
const URL_BASE = `http://127.0.0.1:${PORT}`;
const DEEP = '/index.html?passenger=1&kmenu=1&ktab=drive&kplay=1&pair=1&join=1&share=1#garage';

const SIZES = [
  { name: '844x390', w: 844, h: 390, landscape: true, shot: true },
  { name: '780x360', w: 780, h: 360, landscape: true },
  { name: '1024x768', w: 1024, h: 768, landscape: true, overview: true },
  { name: '1366x768', w: 1366, h: 768, landscape: true },
  { name: '390x844', w: 390, h: 844, landscape: false },
];

function mime(p) {
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  if (p.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (p.endsWith('.css')) return 'text/css; charset=utf-8';
  if (p.endsWith('.json')) return 'application/json';
  if (p.endsWith('.webmanifest')) return 'application/manifest+json';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.glb')) return 'model/gltf-binary';
  return 'application/octet-stream';
}

function serve() {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const u = new URL(req.url, URL_BASE);
      let rel = decodeURIComponent(u.pathname);
      if (rel.endsWith('/')) rel += 'index.html';
      const file = path.join(ROOT, rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404); res.end('no'); return;
      }
      res.writeHead(200, { 'content-type': mime(file), 'cache-control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

const PRE = `(() => {
  window.__gum = [];
  window.__rtc = 0;
  const fake = {
    getUserMedia(c) { window.__gum.push(JSON.parse(JSON.stringify(c || {}))); return Promise.reject(new Error('gum-blocked')); },
    enumerateDevices() { return Promise.resolve([]); }
  };
  try { Object.defineProperty(navigator, 'mediaDevices', { configurable: true, get() { return fake; } }); } catch (e) {}
  function Block() { window.__rtc++; throw new Error('rtc-blocked'); }
  window.RTCPeerConnection = Block;
  window.webkitRTCPeerConnection = Block;
  try {
    localStorage.setItem('zdash.link.last', JSON.stringify({ at: 1, role: 'host', code: 'Z0.OLD' }));
    localStorage.setItem('zdash.roles.v1', JSON.stringify({ role: 'passenger', pass: { hash: 'x', salt: 'y', it: 1, at: 1, driver: 'dad' } }));
    localStorage.setItem('zdash.devMode', 'kid');
    localStorage.setItem('zdash.peers', JSON.stringify({ abc: { dev: 'abc', seen: 1 } }));
  } catch (e) {}
})();`;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function cdpConnect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  let n = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id);
      if (m.error) p.rej(new Error(m.error.message || JSON.stringify(m.error)));
      else p.res(m.result);
    } else if (m.method) listeners.forEach((fn) => fn(m));
  });
  function send(method, params = {}, timeout = 30000) {
    const id = ++n;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => {
      const t = setTimeout(() => { pending.delete(id); rej(new Error('timeout ' + method)); }, timeout);
      pending.set(id, { res: (v) => { clearTimeout(t); res(v); }, rej: (e) => { clearTimeout(t); rej(e); } });
    });
  }
  return { ws, send, on: (fn) => listeners.push(fn) };
}

async function evalJson(cdp, expr, timeout = 20000) {
  const r = await cdp.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }, timeout);
  if (r.exceptionDetails) {
    const d = r.exceptionDetails;
    throw new Error((d.exception && d.exception.description) || d.text || 'eval failed');
  }
  return r.result.value;
}

function label(src, dest, text) {
  const py = `from PIL import Image, ImageDraw
im = Image.open(${JSON.stringify(src)}).convert('RGB')
bar = 36
out = Image.new('RGB', (im.width, im.height + bar), (8, 8, 10))
out.paste(im, (0, 0))
d = ImageDraw.Draw(out)
d.text((10, im.height + 10), ${JSON.stringify(text)}, fill=(230, 230, 230))
out.save(${JSON.stringify(dest)})
`;
  fs.writeFileSync('/tmp/label-shot.py', py);
  const r = spawn('python3', ['/tmp/label-shot.py'], { stdio: 'inherit' });
  return new Promise((res, rej) => r.on('exit', (c) => c ? rej(new Error('label ' + c)) : res()));
}

const log = [];
function note(s) { log.push(s); console.log(s); }

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });
  const server = await serve();
  const chrome = spawn('google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', `--remote-debugging-port=${CDP}`, `--user-data-dir=/tmp/chrome-share-test`,
    '--no-first-run', '--no-default-browser-check', 'about:blank',
  ], { stdio: 'ignore' });
  let wsUrl = '';
  for (let i = 0; i < 50; i++) {
    try {
      const j = await fetch(`http://127.0.0.1:${CDP}/json/version`).then((r) => r.json());
      wsUrl = j.webSocketDebuggerUrl; break;
    } catch { await sleep(200); }
  }
  if (!wsUrl) throw new Error('chrome cdp did not start');
  const browser = await cdpConnect(wsUrl);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  browser.ws.close();
  const list = await fetch(`http://127.0.0.1:${CDP}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.id === targetId) || list.find((t) => t.type === 'page');
  const cdp = await cdpConnect(page.webSocketDebuggerUrl);
  const errors = [];
  cdp.on((m) => {
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      const text = (d.exception && (d.exception.description || d.exception.value)) || d.text || 'exception';
      errors.push(String(text).slice(0, 400));
    }
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      const args = (m.params.args || []).map((a) => a.value || a.description || '').join(' ');
      if (!/favicon|Failed to load resource/i.test(args)) errors.push(('console ' + args).slice(0, 400));
    }
  });
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: PRE });

  async function load(size) {
    errors.length = 0;
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: size.w, height: size.h, deviceScaleFactor: 1, mobile: size.w < 1100,
      screenOrientation: size.landscape ? { type: 'landscapePrimary', angle: 90 } : { type: 'portraitPrimary', angle: 0 },
    });
    await evalJson(cdp, `document.documentElement.dataset.nav='old'`).catch(() => {});
    await cdp.send('Page.navigate', { url: URL_BASE + DEEP.replace('#', '&v=' + size.name + '#') });
    const ready = await evalJson(cdp, `new Promise((res) => {
      const t0 = Date.now();
      const tick = () => {
        const el = document.documentElement;
        const fresh = !!(el && el.dataset.nav !== 'old');
        if (fresh && window.ZD && window.ZD.perf && location.search.indexOf(${JSON.stringify(size.name)}) >= 0) return res({ ok: true, ms: Date.now() - t0, href: location.href });
        if (Date.now() - t0 > 25000) return res({ ok: false, fresh, ms: Date.now() - t0, title: document.title, href: location.href });
        setTimeout(tick, 150);
      };
      tick();
    })`, 30000);
    await sleep(300);
    return ready;
  }

  const probe = `(() => {
    const secs = [...document.querySelectorAll('details.setsec')];
    const sp = document.getElementById('spCid');
    return {
      title: document.title,
      href: location.href,
      kidon: document.body.classList.contains('kidon'),
      link: !!(window.ZD && window.ZD.Link),
      roles: !!(window.ZD && window.ZD.Roles),
      share: !!document.getElementById('btnShare'),
      panel: !!document.getElementById('linkPanel'),
      video: !!document.querySelector('#lkVideo, .lkpanel, video'),
      gum: window.__gum || [],
      rtc: window.__rtc || 0,
      sections: secs.map((d) => d.querySelector('.setlab').textContent),
      connectionOpen: !!(secs[0] && secs[0].open),
      rotate: getComputedStyle(document.getElementById('rotate')).display,
      connect: (document.getElementById('btnObd2') || {}).textContent || '',
      demo: (document.getElementById('btnDemo') || {}).textContent || '',
      chip: (document.querySelector('#srcChip b') || {}).textContent || '',
      adapter: !!document.getElementById('adapterSel'),
      native: !!(window.ZDNative),
      exportBtn: !!document.getElementById('btnExportRun'),
      replay: !!document.getElementById('btnSpeed') && !!document.getElementById('btnSplash'),
      close: !!document.getElementById('btnClose'),
      music: !!document.getElementById('musicSet'),
      tank: !!document.getElementById('tankGal'),
      flags: {
        link: localStorage.getItem('zdash.link.last'),
        roles: localStorage.getItem('zdash.roles.v1'),
        dev: localStorage.getItem('zdash.devMode'),
      },
      spLen: sp ? (sp.value || '').length : -1,
    };
  })()`;

  for (const size of SIZES) {
    const ready = await load(size);
    const p = await evalJson(cdp, probe);
    const fail = [];
    if (!ready.ok) fail.push('ZD.perf not ready');
    if (p.kidon) fail.push('kid mode class');
    if (p.link || p.roles) fail.push('link or roles object created');
    if (p.share || p.panel) fail.push('share UI present');
    if (p.video) fail.push('camera or link video present');
    if (p.rtc) fail.push('RTCPeerConnection constructed ' + p.rtc);
    const videoCalls = (p.gum || []).filter((c) => c && c.video);
    if (videoCalls.length) fail.push('video getUserMedia ' + videoCalls.length);
    if (p.sections.join('|') !== 'CONNECTION|DISPLAY|MUSIC|LOGS & REPLAY|CAR & ALERTS') fail.push('sections ' + p.sections.join('|'));
    if (!p.connectionOpen) fail.push('connection not open by default');
    if (!/CONNECT LIVE/.test(p.connect)) fail.push('connect live missing');
    if (!/START DEMO/.test(p.demo)) fail.push('demo button missing');
    if (!p.adapter || !p.exportBtn || !p.replay || !p.close || !p.music || !p.tank) fail.push('adult control missing');
    if (p.flags.dev !== 'kid' || !p.flags.link || !p.flags.roles) fail.push('setup flags were cleared');
    if (!/Z-DASH/.test(p.title)) fail.push('title ' + p.title);
    let ui = null;
    if (size.landscape) {
      if (p.rotate !== 'none') fail.push('rotate gate showing in landscape');
      ui = await evalJson(cdp, `(() => {
        const problems = [];
        const gear = document.getElementById('btnSettings');
        gear.click();
        const sheet = document.getElementById('settings');
        if (sheet.classList.contains('hidden')) problems.push('settings did not open');
        const x = document.getElementById('btnCloseX');
        const xh = x ? x.getBoundingClientRect().height : 0;
        const ch = document.getElementById('btnClose').getBoundingClientRect().height;
        if (!x || xh < 40) problems.push('close X height ' + xh);
        if (ch < 16) problems.push('close button not visible, height ' + ch);
        const secs = [...document.querySelectorAll('details.setsec')];
        const opened = [];
        for (const d of secs) {
          if (!d.open) d.querySelector('summary').click();
          opened.push(d.open);
          const body = d.querySelector('.setbody');
          const r = body.getBoundingClientRect();
          if (r.height < 8) problems.push('body collapsed while open: ' + d.querySelector('.setlab').textContent);
        }
        document.getElementById('btnClose').click();
        const closed = sheet.classList.contains('hidden');
        gear.click();
        document.getElementById('btnCloseX').click();
        const closedX = sheet.classList.contains('hidden');
        const tabs = [...document.querySelectorAll('#tabs button')].filter((b) => getComputedStyle(b).display !== 'none');
        const tabIds = [];
        for (const b of tabs) { b.click(); tabIds.push(b.dataset.scr + ':' + document.getElementById('scr-' + b.dataset.scr).classList.contains('on')); }
        document.querySelector('#tabs button[data-scr="drive"]').click();
        const names = secs.map((d) => ({ name: d.querySelector('.setlab').textContent, top: d.querySelector('summary').getBoundingClientRect().top }));
        return { problems, opened, closed, closedX, tabIds, xh, ch };
      })()`);
      if (ui.problems.length) fail.push(ui.problems.join('; '));
      if (ui.opened.some((v) => !v)) fail.push('a section did not open');
      if (!ui.closed || !ui.closedX) fail.push('close controls failed');
      if (!ui.tabIds.every((t) => t.endsWith(':true'))) fail.push('tabs ' + ui.tabIds.join(','));
      const demo = await evalJson(cdp, `new Promise((res) => {
        document.getElementById('btnDemo').click();
        const t0 = Date.now();
        const tick = () => {
          const splash = document.getElementById('splash');
          const gone = splash.classList.contains('gone');
          const chip = (document.querySelector('#srcChip b') || {}).textContent || '';
          if (gone && chip === 'SIM') return res({ ok: true, ms: Date.now() - t0, chip });
          if (Date.now() - t0 > 12000) return res({ ok: false, ms: Date.now() - t0, chip, cls: splash.className });
          setTimeout(tick, 200);
        };
        tick();
      })`, 20000);
      if (!demo.ok) fail.push('demo splash ' + JSON.stringify(demo));
      const after = await evalJson(cdp, `({ gum: window.__gum, rtc: window.__rtc, link: !!(window.ZD && ZD.Link) })`);
      if ((after.gum || []).some((c) => c && c.video)) fail.push('video getUserMedia after demo');
      if (after.rtc || after.link) fail.push('pairing started after demo');
      if (size.shot) {
        await sleep(900);
        await evalJson(cdp, `(() => { const sp = document.getElementById('spCid'); if (sp) { sp.value = ''; sp.placeholder = ''; } document.getElementById('settings').classList.add('hidden'); })()`);
        const raw = path.join(OUT, 'demo-driver-raw.png');
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(raw, Buffer.from(shot.data, 'base64'));
        await label(raw, path.join(OUT, 'demo-driver-sim.png'), 'Z-DASH demo driver · 844x390 · chip SIM · simulated demo drive, not a live OBD connection');
        await label(raw, path.join(ART, 'demo-driver-sim.png'), 'Z-DASH demo driver · 844x390 · chip SIM · simulated demo drive, not a live OBD connection');
      }
      if (size.overview) {
        await evalJson(cdp, `(() => {
          document.getElementById('btnSettings').click();
          const sp = document.getElementById('spCid'); if (sp) { sp.value = ''; sp.placeholder = ''; }
          const first = document.querySelector('details.setsec');
          if (!first.open) first.querySelector('summary').click();
          [...document.querySelectorAll('details.setsec')].slice(1).forEach((d) => { if (d.open) d.querySelector('summary').click(); });
        })()`);
        await sleep(200);
        const vis = await evalJson(cdp, `(() => {
          const secs = [...document.querySelectorAll('details.setsec')];
          return secs.map((d) => {
            const r = d.querySelector('summary').getBoundingClientRect();
            return { name: d.querySelector('.setlab').textContent, open: d.open, top: Math.round(r.top), bottom: Math.round(r.bottom), in: r.top >= 0 && r.bottom <= innerHeight };
          });
        })()`);
        if (!vis.every((v) => v.in)) fail.push('overview headers clipped ' + JSON.stringify(vis));
        if (!vis[0].open || vis.slice(1).some((v) => v.open)) fail.push('overview open state ' + JSON.stringify(vis));
        const raw = path.join(OUT, 'settings-overview-raw.png');
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(raw, Buffer.from(shot.data, 'base64'));
        const cap = 'Z-DASH Settings · 1024x768 · five sections · Connection open · Passenger Sharing removed · demo, not live OBD';
        await label(raw, path.join(OUT, 'settings-overview-five-sections.png'), cap);
        await label(raw, path.join(ART, 'settings-overview-five-sections.png'), cap);
        note('overview ' + JSON.stringify(vis));
      }
    } else if (p.rotate !== 'flex') fail.push('portrait rotate gate display ' + p.rotate);
    note(size.name + ' ' + (fail.length ? 'FAIL ' + fail.join(' | ') : 'PASS') + ' ready=' + JSON.stringify(ready) + ' gum=' + JSON.stringify(p.gum) + ' errs=' + errors.length + (size.landscape ? ' closeX=' + ui.xh + ' close=' + ui.ch + ' tabs=' + ui.tabIds.join(',') : ' rotate=' + p.rotate));
    if (errors.length) note('  errors: ' + errors.slice(0, 6).join(' || '));
    if (fail.length || errors.length) process.exitCode = 1;
  }

  note('--- offline ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 844, height: 390, deviceScaleFactor: 1, mobile: true,
    screenOrientation: { type: 'landscapePrimary', angle: 90 },
  });
  await cdp.send('Network.enable').catch(() => {});
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await cdp.send('Page.navigate', { url: URL_BASE + '/index.html' });
  const sw = await evalJson(cdp, `new Promise((res) => {
    const t0 = Date.now();
    const tick = async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      const keys = await caches.keys();
      if (navigator.serviceWorker.controller && keys.some((k) => k.startsWith('zdash-adult-'))) {
        const adult = keys.find((k) => k.startsWith('zdash-adult-'));
        const c = await caches.open(adult);
        const names = (await c.keys()).map((r) => new URL(r.url).pathname.split('/').pop());
        return res({ ok: true, ms: Date.now() - t0, keys, names, controller: true });
      }
      if (Date.now() - t0 > 15000) return res({ ok: false, ms: Date.now() - t0, keys, controller: !!navigator.serviceWorker.controller });
      setTimeout(tick, 300);
    };
    tick();
  })`, 20000);
  note('adult cache ' + JSON.stringify(sw));
  if (!sw.ok || (sw.names || []).includes('jr.html')) { note('FAIL adult cache'); process.exitCode = 1; }
  await cdp.send('Page.navigate', { url: URL_BASE + '/jr.html?stay=1' });
  const jr = await evalJson(cdp, `new Promise((res) => {
    const t0 = Date.now();
    const tick = async () => {
      const keys = await caches.keys();
      if (document.title && keys.some((k) => k.startsWith('zdash-jr-'))) {
        const adult = keys.find((k) => k.startsWith('zdash-adult-'));
        const c = await caches.open(adult);
        const names = (await c.keys()).map((r) => new URL(r.url).pathname.split('/').pop());
        return res({ ok: true, title: document.title, keys, adultHasJr: names.includes('jr.html') });
      }
      if (Date.now() - t0 > 20000) return res({ ok: false, title: document.title, keys });
      setTimeout(tick, 300);
    };
    tick();
  })`, 25000);
  note('kid online ' + JSON.stringify(jr));
  if (!jr.ok || !/JR/.test(jr.title || '') || jr.adultHasJr) { note('FAIL kid online cache'); process.exitCode = 1; }
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
  await cdp.send('Page.navigate', { url: URL_BASE + '/index.html?passenger=1' });
  const offA = await evalJson(cdp, `new Promise((res) => {
    const t0 = Date.now();
    const tick = () => {
      if (document.title && document.getElementById('btnObd2')) return res({ title: document.title, connect: document.getElementById('btnObd2').textContent, share: !!document.getElementById('btnShare'), ms: Date.now() - t0 });
      if (Date.now() - t0 > 8000) return res({ title: document.title, ms: Date.now() - t0 });
      setTimeout(tick, 200);
    };
    tick();
  })`, 15000);
  note('adult offline ' + JSON.stringify(offA));
  if (!/Z-DASH · 370Z/.test(offA.title || '') || offA.share) { note('FAIL adult offline'); process.exitCode = 1; }
  await cdp.send('Page.navigate', { url: URL_BASE + '/jr.html?stay=1' });
  const offJ = await evalJson(cdp, `new Promise((res) => {
    const t0 = Date.now();
    const tick = () => {
      if (document.title && /JR/.test(document.title)) return res({ title: document.title, ms: Date.now() - t0 });
      if (Date.now() - t0 > 8000) return res({ title: document.title, ms: Date.now() - t0 });
      setTimeout(tick, 200);
    };
    tick();
  })`, 15000);
  note('kid offline ' + JSON.stringify(offJ));
  if (!/Z-DASH JR/.test(offJ.title || '')) { note('FAIL kid offline'); process.exitCode = 1; }

  fs.writeFileSync(path.join(OUT, 'checks.txt'), log.join('\n') + '\nexit ' + (process.exitCode || 0) + '\n');
  cdp.ws.close();
  chrome.kill('SIGKILL');
  server.close();
  process.exit(process.exitCode || 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
