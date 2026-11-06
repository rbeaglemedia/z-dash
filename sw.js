/* Z-DASH offline service worker.
   Adult and kid pages share this worker (one scope: the site) and use separate caches.
   - Adult install precaches index.html, the adult manifest, and the adult icons only.
   - Kid install precaches jr.html, the kid manifest, and the kid icons only.
   - A page also posts {type:'zd-cache', role} so its own shell is cached even if install
     did not see that window. The adult page never asks for the kid shell.
   - An upgrade copies jr.html and the kid icons out of an older combined cache before
     that cache is deleted, so a phone that already had the kid app offline keeps it
     when the adult page activates the new worker. A fresh adult install has no old
     cache, so it does not fetch kid files.
   - Pages are network-first with a 2.5 s timeout. Offline uses that page's own cache.
     A kid navigation does not fall back to index.html.
   - world/, shared/, Neon World, and Adventure keep their own caches and are not precached.
   - /.well-known/ is not intercepted, so assetlinks.json stays the server file.
   - /test/ is not cached here. */
importScripts('shared/version.js?v=42'); // world42
const BUILD = self.ZD_BUILD;
const ADULT_CACHE = 'zdash-adult-' + BUILD;
const JR_CACHE = 'zdash-jr-' + BUILD;
const ADULT_ASSETS = ['index.html', 'manifest.webmanifest', 'icons/zdash-192.png', 'icons/zdash-512.png', 'icons/zdash-apple-180.png', 'icons/zdash-maskable-512.png'];
const JR_ASSETS = ['jr.html', 'manifest-jr.webmanifest', 'icons/zdash-jr-192.png', 'icons/zdash-jr-512.png', 'icons/zdash-jr-apple-180.png', 'icons/zdash-jr-maskable-512.png'];
const NAV_TIMEOUT = 2500;
const SPLIT_CACHE = 'world-split-v' + self.ZD_WORLD;
const ADV_CACHE = 'adventure-v3';

function isKidPath(pathname) {
  return /\/(jr|neon-paint|world|world-split|fly2|fly3|garage-hub|crew|dance-stage|char|adventure)\.html$/.test(pathname) || pathname.includes('/adventure/');
}
function fill(cacheName, assets) {
  return caches.open(cacheName).then((c) => c.addAll(assets.map((a) => new Request(a, { cache: 'reload' }))));
}
function whichClients() {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    let adult = false, kid = false;
    cs.forEach((c) => { if (isKidPath(new URL(c.url).pathname)) kid = true; else adult = true; });
    return { adult: adult, kid: kid, any: cs.length > 0 };
  });
}
self.addEventListener('install', (e) => {
  e.waitUntil(whichClients().then((w) => {
    const jobs = [];
    // No window (some browser updates): cache the adult shell only. Do not fetch kid files.
    if (w.adult || !w.any) jobs.push(fill(ADULT_CACHE, ADULT_ASSETS));
    if (w.kid) jobs.push(fill(JR_CACHE, JR_ASSETS));
    return Promise.all(jobs);
  }).then(() => self.skipWaiting()));
});
function copyAsset(from, to, asset) {
  return to.match(asset).then((already) => {
    if (already) return;
    return from.match(asset).then((hit) => {
      if (hit) return to.put(asset, hit);
      return from.keys().then((reqs) => {
        const found = reqs.find((r) => { try { return new URL(r.url).pathname.endsWith('/' + asset); } catch (e) { return false; } });
        if (!found) return;
        return from.match(found).then((res) => { if (res) return to.put(asset, res); });
      });
    });
  });
}
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => {
    const old = ks.filter((k) => k !== ADULT_CACHE && k !== JR_CACHE && k !== SPLIT_CACHE && k !== ADV_CACHE && (k.startsWith('zdash-') || k.startsWith('world-split-') || k.startsWith('adventure-')));
    const sources = old.filter((k) => k.startsWith('zdash-'));
    const migrate = sources.length ? caches.open(JR_CACHE).then((jr) => Promise.all(sources.map((k) => caches.open(k).then((from) => Promise.all(JR_ASSETS.map((asset) => copyAsset(from, jr, asset))))))) : Promise.resolve();
    return migrate.then(() => Promise.all(old.map((k) => caches.delete(k))));
  }).then(() => self.clients.claim()).then(() => self.clients.matchAll({ type: 'window' })).then((cs) => cs.forEach((c) => c.postMessage({ type: 'zd-sw', build: BUILD }))));
});
self.addEventListener('message', (e) => {
  if (e.data === 'zd-build?' && e.source) e.source.postMessage({ type: 'zd-sw', build: BUILD });
  if (e.data && e.data.type === 'zd-cache') {
    const job = e.data.role === 'jr' ? fill(JR_CACHE, JR_ASSETS) : (e.data.role === 'adult' ? fill(ADULT_CACHE, ADULT_ASSETS) : Promise.resolve());
    e.waitUntil(job);
  }
});
const isSplitPath = (url) => { const p = url.pathname; return p.endsWith('/world-split.html') || p.endsWith('/world.html') || p.endsWith('/crew.html') || p.endsWith('/dance-stage.html') || p.endsWith('/garage-hub.html') || p.endsWith('/neon-paint.html') || p.includes('/world/') || p.includes('/shared/'); };
const isAdvPath = (url) => { const p = url.pathname; return p.endsWith('/adventure.html') || p.includes('/adventure/'); };
function navSpec(url) {
  const p = url.pathname;
  if (p.endsWith('/jr.html')) return { cache: JR_CACHE, key: 'jr.html' };
  if (p.endsWith('/fly3.html')) return { cache: JR_CACHE, key: 'fly3.html' };
  if (p.endsWith('/fly2.html')) return { cache: JR_CACHE, key: 'fly2.html' };
  return { cache: ADULT_CACHE, key: 'index.html' };
}
function fromNetwork(req, cacheName, key) {
  return fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
    if (res.redirected) return Response.redirect(res.url, 302);
    if (res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(cacheName).then((c) => c.put(key, cp)); }
    return res;
  });
}
function netFirst(cacheName, req) {
  return caches.open(cacheName).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => {
    let timer;
    const timeout = new Promise((ok) => { timer = setTimeout(() => ok(hit || null), NAV_TIMEOUT); });
    const net = fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
      clearTimeout(timer);
      if (res.ok && res.type === 'basic') c.put(req, res.clone());
      return res.ok ? res : (hit || res);
    }, () => { clearTimeout(timer); if (hit) return hit; return Promise.reject(new Error(cacheName)); });
    return Promise.race([net, timeout]).then((res) => res || net);
  }));
}
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname === '/.well-known' || url.pathname.startsWith('/.well-known/')) return;
  if (url.pathname === '/test' || url.pathname.startsWith('/test/')) return;
  if (isAdvPath(url)) { e.respondWith(netFirst(ADV_CACHE, req)); return; }
  if (isSplitPath(url)) { e.respondWith(netFirst(SPLIT_CACHE, req)); return; }
  if (req.mode === 'navigate') {
    const spec = navSpec(url), net = fromNetwork(req, spec.cache, spec.key);
    e.waitUntil(net.then(() => {}, () => {}));
    e.respondWith(caches.open(spec.cache).then((c) => c.match(spec.key)).then((hit) => {
      if (!hit) return net;
      const slow = new Promise((ok) => setTimeout(() => ok(hit), NAV_TIMEOUT));
      return Promise.race([net.then((res) => (res.ok ? res : hit), () => hit), slow]);
    }));
    return;
  }
  const box = (url.pathname.indexOf('zdash-jr') !== -1 || url.pathname.endsWith('/manifest-jr.webmanifest')) ? JR_CACHE : ADULT_CACHE;
  e.respondWith(caches.open(box).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => {
    const net = fetch(req).then((res) => { if (res.ok && res.type === 'basic') c.put(req, res.clone()); return res; });
    if (hit) { e.waitUntil(net.then(() => {}, () => {})); return hit; }
    return net;
  })));
});
