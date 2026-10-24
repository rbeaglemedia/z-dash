/* Z-DASH offline service worker. Everything (app, 3D model, fonts) is inside index.html / jr.html, so caching these
   few files makes the whole app work with no internet.
   - Pages (index.html, jr.html): NETWORK FIRST with a 2.5 s timeout, so a new deploy shows on the first load. Offline or slow
     network -> the cached copy. Every good network answer refreshes the cache.
   - Other files (manifests, icons): stale-while-revalidate inside a versioned cache.
   - /.well-known/ is not intercepted and not cached, so assetlinks.json is always the file from the server.
   - A new deploy changes VERSION/BUILD -> installs at once (skipWaiting), takes over open pages (clients.claim), deletes the
     old cache and tells the pages its BUILD so a stale page can reload itself (only when no game/drive is in progress). */
importScripts('shared/version.js?v=40'); // world40
const VERSION = 'zdash-f5f4db3cffe9-world' + self.ZD_WORLD;
const BUILD = self.ZD_BUILD;
const ASSETS = ["index.html", "jr.html", "manifest.webmanifest", "manifest-jr.webmanifest", "icons/zdash-192.png", "icons/zdash-512.png", "icons/zdash-apple-180.png", "icons/zdash-jr-192.png", "icons/zdash-jr-512.png", "icons/zdash-jr-apple-180.png", "icons/zdash-jr-maskable-512.png", "icons/zdash-maskable-512.png"];
const NAV_TIMEOUT = 2500;
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS.map((a) => new Request(a, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => (k.startsWith('zdash-') && k !== VERSION) || (k.startsWith('world-split-') && k !== SPLIT_CACHE) || (k.startsWith('adventure-') && k !== ADV_CACHE)).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: 'window' })).then((cs) => cs.forEach((c) => c.postMessage({ type: 'zd-sw', build: BUILD }))));
});
self.addEventListener('message', (e) => { if (e.data === 'zd-build?' && e.source) e.source.postMessage({ type: 'zd-sw', build: BUILD }); });
const pageKey = (url) => (url.pathname.endsWith('jr.html') ? 'jr.html' : url.pathname.endsWith('fly3.html') ? 'fly3.html' : url.pathname.endsWith('world.html') ? 'world.html' : 'index.html'); // ?passenger / ?code= etc. share one cached copy
// world-split.html is a hidden page. Its HTML, world/ modules and shared/ assets live in their own cache.
// They are not added to ASSETS and are not stored under the index/jr/fly3/world page keys. Without this
// branch, pageKey() would treat world-split.html as index.html and overwrite that cached page.
// activate drops every world-split-* cache except SPLIT_CACHE, and the fetch handler is network-first.
const SPLIT_CACHE = 'world-split-v' + self.ZD_WORLD;
const isSplitPath = (url) => { const p = url.pathname; return p.endsWith('/world-split.html') || p.endsWith('/world.html') || p.endsWith('/crew.html') || p.endsWith('/dance-stage.html') || p.endsWith('/garage-hub.html') || p.endsWith('/neon-paint.html') || p.includes('/world/') || p.includes('/shared/'); };
// Adventure World is its own page. Its HTML and /adventure/ files live in ADV_CACHE only.
// They are not in ASSETS and must not be stored under the index.html key. Bump ADV_CACHE
// when those files change. Do not bump ZD_WORLD for an adventure-only deploy.
const ADV_CACHE = 'adventure-v2';
const isAdvPath = (url) => { const p = url.pathname; return p.endsWith('/adventure.html') || p.includes('/adventure/'); };
function fromNetwork(req, key) { // revalidate with the server (bypasses the 10-min HTTP cache on GitHub Pages; an unchanged page is a cheap 304)
  return fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
    if (res.redirected) return Response.redirect(res.url, 302); // e.g. /z-dash -> /z-dash/: let the browser follow it
    if (res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(VERSION).then((c) => c.put(key, cp)); }
    return res; });
}
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // Spotify etc. go straight to the network
  if (url.pathname === '/.well-known' || url.pathname.startsWith('/.well-known/')) return; // asset links: network only, never the page cache
  // Dev tools live under /test/ with their own manifest and test/sw.js (scope /test/ only).
  // Do not cache them and do not let pageKey() serve index.html for a /test/ navigation.
  if (url.pathname === '/test' || url.pathname.startsWith('/test/')) return;
  if (isAdvPath(url)) { // own cache, NETWORK FIRST. A miss must not fall through to the index.html key.
    e.respondWith(caches.open(ADV_CACHE).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => {
      let timer;
      const timeout = new Promise((ok) => { timer = setTimeout(() => ok(hit || null), NAV_TIMEOUT); });
      const net = fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
        clearTimeout(timer);
        if (res.ok && res.type === 'basic') c.put(req, res.clone());
        return res.ok ? res : (hit || res);
      }, () => { clearTimeout(timer); if (hit) return hit; return Promise.reject(new Error('adventure')); });
      return Promise.race([net, timeout]).then((res) => res || net);
    })));
    return;
  }
  if (isSplitPath(url)) { // own cache, NETWORK FIRST (a phone refresh must get the new world/ and shared/ scripts on the first load)
    e.respondWith(caches.open(SPLIT_CACHE).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => {
      let timer;
      const timeout = new Promise((ok) => { timer = setTimeout(() => ok(hit || null), NAV_TIMEOUT); });
      const net = fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' })).then((res) => {
        clearTimeout(timer);
        if (res.ok && res.type === 'basic') c.put(req, res.clone());
        return res.ok ? res : (hit || res);
      }, () => { clearTimeout(timer); if (hit) return hit; return Promise.reject(new Error('split')); });
      return Promise.race([net, timeout]).then((res) => res || net);
    })));
    return;
  }
  if (req.mode === 'navigate') {
    const key = pageKey(url), net = fromNetwork(req, key); e.waitUntil(net.then(() => {}, () => {}));
    e.respondWith(caches.match(key).then((hit) => {
      if (!hit) return net.catch(() => caches.match('index.html')); // first visit: wait for the network
      const slow = new Promise((ok) => setTimeout(() => ok(hit), NAV_TIMEOUT)); // slow / flaky network: cached page after 2.5 s
      return Promise.race([net.then((res) => (res.ok ? res : hit), () => hit), slow]);
    }));
    return;
  }
  e.respondWith(caches.open(VERSION).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => {
    const net = fetch(req).then((res) => { if (res.ok && res.type === 'basic') c.put(req, res.clone()); return res; });
    if (hit) { e.waitUntil(net.then(() => {}, () => {})); return hit; }
    return net;
  })));
});
