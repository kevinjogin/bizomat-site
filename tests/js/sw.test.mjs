// The service worker (opensketch/sw.js): a hung or failing server falls back to the kept copy of the app, as one
// version, and an unchanged file is not written again.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

class Res {
  constructor(body, { status = 200, etag = null, url = 'http://localhost/' } = {}) {
    this.body = body; this.status = status; this.ok = status >= 200 && status < 300; this.redirected = false; this.type = 'basic'; this.url = url;
    this.headers = { get: (k) => (k.toLowerCase() === 'etag' ? etag : null) };
  }
  clone() { return this; }
}

function load(net) {
  const store = new Map(), puts = [];
  const cache = { match: async (k) => store.get(typeof k === 'string' ? k : k.url) || null, put: async (k, r) => { puts.push(k); store.set(typeof k === 'string' ? k : k.url, r); } };
  const handlers = {};
  const ctx = {
    self: { addEventListener: (t, f) => { handlers[t] = f; }, location: { origin: 'http://localhost' }, skipWaiting: () => {}, clients: { claim: () => {} } },
    caches: { open: async () => cache, match: async () => null, keys: async () => [] },
    fetch: (req) => net(req), URL, Response: Res, setTimeout, Promise,
  };
  const src = readFileSync(new URL('../../opensketch/sw.js', import.meta.url), 'utf8').replace('__VERSION__', 'v1').replace('__ASSETS__', '[]');
  vm.runInNewContext(src, ctx);
  const go = async (url, mode = 'no-cors') => {
    let p;
    handlers.fetch({ request: { method: 'GET', url, mode }, respondWith: (x) => { p = x; } });
    return p;
  };
  return { go, store, puts };
}

test('a server error gives the kept app page, and its files come from the same copy', async () => {
  let mode = 'ok', deploy = 1;
  const net = (req) => {
    if (mode === 'ok') return Promise.resolve(new Res(`v${deploy} ${req.url}`, { etag: `"${deploy}"`, url: req.url }));
    if (mode === '502') return Promise.resolve(new Res('Fly error', { status: 502, url: req.url }));
    return new Promise(() => {}); // hung
  };
  const sw = load(net);
  assert.equal((await sw.go('http://localhost/', 'navigate')).body, 'v1 http://localhost/');
  assert.equal((await sw.go('http://localhost/js/app.js')).body, 'v1 http://localhost/js/app.js');
  mode = '502';
  const page = await sw.go('http://localhost/', 'navigate');
  assert.equal(page.body, 'v1 http://localhost/', 'the kept page, not the 502');
  mode = 'ok'; deploy = 2; // a new version is up, but this page came from the copy: its files do too (one version)
  assert.equal((await sw.go('http://localhost/js/app.js')).body, 'v1 http://localhost/js/app.js');
  assert.equal((await sw.go('http://localhost/', 'navigate')).body, 'v2 http://localhost/', 'a fresh page load uses the new version');
  assert.equal((await sw.go('http://localhost/js/app.js')).body, 'v2 http://localhost/js/app.js', 'and its files');
});

test('an unchanged file (same ETag) is not written to the cache again', async () => {
  const sw = load((req) => Promise.resolve(new Res('x', { etag: '"same"', url: req.url })));
  await sw.go('http://localhost/js/files.js');
  await sw.go('http://localhost/js/files.js');
  await new Promise((ok) => setTimeout(ok, 5));
  assert.equal(sw.puts.filter((k) => k === '/js/files.js').length, 1);
});
