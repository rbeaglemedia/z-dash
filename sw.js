/* Z-DASH offline service worker. Everything (app, 3D model, fonts) is inside index.html / jr.html, so caching these
   few files makes the whole app work with no internet. A new deploy changes VERSION -> new cache -> old one deleted. */
const VERSION = 'zdash-cbf1095d5bbf';
const ASSETS = ["index.html", "jr.html", "manifest.webmanifest", "manifest-jr.webmanifest", "icons/zdash-192.png", "icons/zdash-512.png", "icons/zdash-apple-180.png", "icons/zdash-jr-192.png", "icons/zdash-jr-512.png", "icons/zdash-jr-apple-180.png", "icons/zdash-jr-maskable-512.png", "icons/zdash-maskable-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS.map((a) => new Request(a, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('zdash-') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // Spotify etc. go straight to the network
  if (req.mode === 'navigate') {
    // cache first (ignore ?passenger / ?code= etc.); fall back to the network, then to the cached dash
    const key = url.pathname.endsWith('/') ? 'index.html' : req; // /z-dash/ is index.html (cached once, not twice)
    e.respondWith(caches.match(key, { ignoreSearch: true }).then((hit) => hit || fetch(req).catch(() => caches.match(url.pathname.endsWith('jr.html') ? 'jr.html' : 'index.html'))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(VERSION).then((c) => c.put(req, cp)); } return res; })));
});
