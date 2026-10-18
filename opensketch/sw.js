// OpenSketch service worker (served at /sw.js with this server's version, see server.py).
//
// It makes OpenSketch installable and keeps it opening when the server is asleep or unreachable:
//  - the app's own files (css, js, vendor, icons) are fetched from the network first, so a new deploy is
//    always used, and kept as a fallback for when the network fails;
//  - page loads use the network first, then the last app page this browser loaded;
//  - everything else (/api, /mcp, /review, sign-in pages, other sites) is never touched.
// A new version replaces the old caches when it takes over.

const VERSION = '__VERSION__';
const CACHE = 'opensketch-' + VERSION;
const SHELL = '/__shell';
const ASSETS = __ASSETS__;
const STATIC = /^\/(css|js|vendor|icons)\/|^\/(favicon\.svg|manifest\.webmanifest)$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(ASSETS.map((u) => fetch(u, { cache: 'no-cache' }).then((r) => (r.ok && !r.redirected ? c.put(u, r) : null)).catch(() => null))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('opensketch-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request, key) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    if (res.ok && !res.redirected && res.type === 'basic') cache.put(key || request, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(key || request) || await caches.match(key || request);
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    if (url.pathname !== '/') return; // sign-in, reviews, joins: always the network
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req);
        // keep the app page only when it is the app (not a redirect to sign in)
        if (res.ok && !res.redirected && new URL(res.url).pathname === '/') cache.put(SHELL, res.clone());
        return res;
      } catch (err) {
        const hit = await cache.match(SHELL) || await caches.match(SHELL);
        if (hit) return hit;
        return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OpenSketch</title>' +
          '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0d0e;color:#e3e4e8;font:14px/1.5 system-ui,sans-serif;text-align:center">' +
          '<div><h1 style="font-size:22px;letter-spacing:-.02em">OpenSketch is offline</h1><p style="color:#8a8f98">The server cannot be reached. Check your connection and try again.</p>' +
          '<button onclick="location.reload()" style="margin-top:8px;height:34px;padding:0 16px;border:0;border-radius:17px;background:#5e6ad2;color:#fff;font:inherit;font-weight:600">Try again</button></div>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }
  if (STATIC.test(url.pathname)) event.respondWith(networkFirst(req, url.pathname));
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
