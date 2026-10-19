// OpenSketch service worker (served at /sw.js with this server's version, see server.py).
//
// It makes OpenSketch installable and keeps it opening when the server is asleep or unreachable:
//  - the app's own files (css, js, vendor, icons) are fetched from the network first, so a new deploy is
//    always used, and kept as a fallback for when the network fails, answers a server error or takes over 10 s;
//  - page loads use the network first, then the last app page this browser loaded (whose files then come
//    from the same cache for a minute, so the page never mixes two versions);
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

const NET_WAIT = 10000; // a cold start after a deploy takes about 10 s; longer than that = use what is kept
const NO_SHELL_WAIT = 30000; // nothing kept yet: wait longer before the offline page
let fallbackUntil = 0; // after a page load from the cache, its files come from the same cache (one version)
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const tag = (r) => r && (r.headers.get('etag') || r.headers.get('last-modified'));

// Keep a copy, unless the kept one is the same file (no rewrite of the whole app on every load).
async function keep(cache, key, res) {
  const old = await cache.match(key);
  if (old && tag(old) && tag(old) === tag(res)) return;
  await cache.put(key, res);
}

// The network's answer in time, or null when it is slow, fails or is a server error (Fly answers 502/503 while a
// machine wakes or a deploy runs). The request goes on: if it answers later, the copy is kept for next time.
async function inTime(live, ms) {
  const res = await Promise.race([live.catch(() => null), sleep(ms).then(() => null)]);
  return res && res.status < 500 ? res : null;
}

async function networkFirst(request, key) {
  const cache = await caches.open(CACHE);
  const k = key || request;
  const kept = async () => (await cache.match(k)) || (await caches.match(k));
  if (Date.now() < fallbackUntil) { const hit = await kept(); if (hit) return hit; }
  const live = fetch(request).then(async (res) => {
    if (res.ok && !res.redirected && res.type === 'basic') await keep(cache, k, res.clone());
    return res;
  });
  const res = await inTime(live, NET_WAIT);
  if (res) return res;
  const hit = await kept();
  if (hit) return hit;
  return live; // nothing kept: the network's own answer (or error)
}

const OFFLINE = () => new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OpenSketch</title>' +
  '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0d0e;color:#e3e4e8;font:14px/1.5 system-ui,sans-serif;text-align:center">' +
  '<div><h1 style="font-size:22px;letter-spacing:-.02em">OpenSketch is offline</h1><p style="color:#8a8f98">The server cannot be reached. Check your connection and try again.</p>' +
  '<button onclick="location.reload()" style="margin-top:8px;height:34px;padding:0 16px;border:0;border-radius:17px;background:#5e6ad2;color:#fff;font:inherit;font-weight:600">Try again</button></div>',
{ headers: { 'Content-Type': 'text/html; charset=utf-8' } });

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    if (url.pathname !== '/') return; // sign-in, reviews, joins: always the network
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const live = fetch(req).then((res) => {
        // keep the app page only when it is the app (not a redirect to sign in)
        if (res.ok && !res.redirected && new URL(res.url).pathname === '/') cache.put(SHELL, res.clone());
        return res;
      });
      const res = await inTime(live, NET_WAIT);
      if (res) { fallbackUntil = 0; return res; }
      const hit = (await cache.match(SHELL)) || (await caches.match(SHELL));
      if (hit) { fallbackUntil = Date.now() + 60000; return hit; } // the last app page, and its own files with it
      const late = await inTime(live, NO_SHELL_WAIT);
      return late || OFFLINE();
    })());
    return;
  }
  if (STATIC.test(url.pathname)) event.respondWith(networkFirst(req, url.pathname));
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
