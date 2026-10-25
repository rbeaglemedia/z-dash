/* Hidden preview worker. Its scope is /test/ only. It does not cache, and it
   does not write the live app caches. If the live worker stored a /test/ page
   under a live page key, this worker deletes that entry.
   dev51: every same-origin read reloads, so a phone cannot keep an old world. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(scrub().then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'reload' }));
});
self.addEventListener('message', function () {});
function scrub() {
  return caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      return caches.open(k).then(function (c) {
        var logical = ['/jr.html', '/index.html', '/world.html', '/world-split.html', '/fly3.html'].map(function (p) {
          var req = new Request(self.location.origin + p);
          return c.match(req).then(function (hit) {
            if (hit && String(hit.url).indexOf('/test/') !== -1) return c.delete(req);
          });
        });
        return Promise.all(logical).then(function () {
          return c.keys().then(function (reqs) {
            return Promise.all(reqs.map(function (req) {
              try {
                if (new URL(req.url).pathname.indexOf('/test/') === 0) return c.delete(req);
              } catch (err) {}
            }));
          });
        });
      });
    }));
  });
}
