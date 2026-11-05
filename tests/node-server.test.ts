// The website's Node server (src/node/): Cloudflare-compatible static assets, the Worker's API routes, rate limits,
// proxy trust and health. Runs against a small fixture site so it does not need a full build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAssets, parseHeaders, parseRedirects } from '../src/node/assets.ts';
import { memoryLimiter, workersAiRest } from '../src/node/bindings.ts';
import { startWebServer } from '../src/node/server.ts';

function fixture(): string {
  const dir = mkdtempSync(join(tmpdir(), 'bz-web-'));
  mkdirSync(join(dir, 'about'), { recursive: true });
  mkdirSync(join(dir, '_astro'), { recursive: true });
  writeFileSync(join(dir, 'index.html'), `<!doctype html><title>Home</title>${'<p>BIZOMAT</p>'.repeat(200)}`);
  writeFileSync(join(dir, 'about', 'index.html'), '<!doctype html><title>About</title>');
  writeFileSync(join(dir, '404.html'), '<!doctype html><title>Not found</title>');
  writeFileSync(join(dir, '_astro', 'app.123.js'), 'console.log(1)');
  writeFileSync(join(dir, 'file.pdf'), Buffer.alloc(5000, 7));
  writeFileSync(join(dir, '_redirects'), '# comment\n/old/ /about/ 301\n/insights/category/* /reados/ 301\n/b/:slug/ /about/?b=:slug 302\n');
  writeFileSync(join(dir, '_headers'), '/*\n  X-Frame-Options: DENY\n  Content-Security-Policy: default-src \'self\'\n\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n\nhttps://:project.pages.dev/*\n  X-Robots-Tag: noindex\n');
  return dir;
}
const req = (path: string, init: RequestInit = {}) => new Request(`https://bizomat.ai${path}`, init);

test('_redirects: exact rules, splats and placeholders, first match wins', () => {
  const r = parseRedirects('/a/ /b/ 301\n/a/ /c/ 302\n/x/* /y/ 301\n/p/:id/ /q/:id/\n');
  assert.equal(r.exact.get('/a/')?.to, '/b/');
  assert.equal(r.dynamic.length, 2);
  assert.ok(r.dynamic[0].re!.test('/x/anything/here'));
});

test('_headers: path blocks match with splats; absolute-URL blocks are ignored', () => {
  const rules = parseHeaders('/*\n  A: 1\n/_astro/*\n  B: 2\nhttps://:project.pages.dev/*\n  C: 3\n');
  assert.equal(rules.length, 2);
  assert.ok(rules[1].re.test('/_astro/x.js'));
  assert.ok(!rules[1].re.test('/other/x.js'));
});

test('assets: trailing slash, 404 page, redirects, headers, hidden files and no traversal', async () => {
  const assets = createAssets({ dir: fixture() });
  const home = await assets.fetch(req('/'));
  assert.equal(home.status, 200);
  assert.equal(home.headers.get('X-Frame-Options'), 'DENY');
  const about = await assets.fetch(req('/about'));
  assert.equal(about.status, 307);
  assert.equal(about.headers.get('Location'), '/about/');
  assert.equal((await assets.fetch(req('/about/'))).status, 200);
  const old = await assets.fetch(req('/old/?q=1'));
  assert.equal(old.status, 301);
  assert.equal(old.headers.get('Location'), '/about/?q=1');
  assert.equal((await assets.fetch(req('/insights/category/engineering/'))).headers.get('Location'), '/reados/');
  assert.equal((await assets.fetch(req('/b/hello/'))).headers.get('Location'), '/about/?b=hello');
  const missing = await assets.fetch(req('/nope/'));
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Not found/);
  for (const hidden of ['/_redirects', '/_headers', '/%2e%2e/%2e%2e/etc/passwd', '/..%2f..%2fetc/passwd']) assert.equal((await assets.fetch(req(hidden))).status, 404, hidden);
  const js = await assets.fetch(req('/_astro/app.123.js'));
  assert.equal(js.headers.get('Cache-Control'), 'public, max-age=31536000, immutable');
  assert.equal((await assets.fetch(req('/', { method: 'POST' }))).status, 405);
});

test('assets: compression, conditional requests and byte ranges', async () => {
  const assets = createAssets({ dir: fixture() });
  const br = await assets.fetch(req('/', { headers: { 'Accept-Encoding': 'gzip, br' } }));
  assert.equal(br.headers.get('Content-Encoding'), 'br');
  const etag = br.headers.get('ETag')!;
  assert.equal((await assets.fetch(req('/', { headers: { 'If-None-Match': etag } }))).status, 304);
  const part = await assets.fetch(req('/file.pdf', { headers: { Range: 'bytes=100-199' } }));
  assert.equal(part.status, 206);
  assert.equal((await part.arrayBuffer()).byteLength, 100);
  assert.equal((await assets.fetch(req('/file.pdf', { headers: { Range: 'bytes=9000-' } }))).status, 416);
});

test('rate limiter: a fixed window per key', async () => {
  let t = 0;
  const lim = memoryLimiter(2, 60, () => t);
  assert.equal((await lim.limit({ key: 'a' })).success, true);
  assert.equal((await lim.limit({ key: 'a' })).success, true);
  assert.equal((await lim.limit({ key: 'a' })).success, false);
  assert.equal((await lim.limit({ key: 'b' })).success, true);
  t = 61_000;
  assert.equal((await lim.limit({ key: 'a' })).success, true);
});

test('Workers AI over REST: account id checked, result returned, errors raised', async () => {
  assert.throws(() => workersAiRest('not-an-id', 't'));
  const calls: string[] = [];
  const ok = workersAiRest('0123456789abcdef0123456789abcdef', 'token', (async (url: string, init: RequestInit) => {
    calls.push(String(url));
    assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer token');
    return new Response(JSON.stringify({ success: true, result: { response: '{"terms":["x"]}' } }));
  }) as typeof fetch);
  assert.deepEqual(await ok.run('@cf/meta/llama-3.1-8b-instruct-fp8', { messages: [] }), { response: '{"terms":["x"]}' });
  assert.match(calls[0], /\/accounts\/0123456789abcdef0123456789abcdef\/ai\/run\/@cf\/meta\//);
  await assert.rejects(ok.run('../../evil', {}));
  const bad = workersAiRest('0123456789abcdef0123456789abcdef', 'token', (async () => new Response(JSON.stringify({ success: false, errors: [{ message: 'nope' }] }), { status: 403 })) as typeof fetch);
  await assert.rejects(bad.run('@cf/meta/llama-3.1-8b-instruct-fp8', {}), /403/);
});

test('server: health, pages, API through the Worker, rate limit by client and proxy trust', async () => {
  const lines: Record<string, unknown>[] = [];
  const { ready, close } = startWebServer({ port: 0, host: '127.0.0.1', distDir: fixture(), trustProxy: true, env: {}, log: (l) => lines.push(l) });
  const port = await ready;
  const base = `http://127.0.0.1:${port}`;
  try {
    const health = await fetch(`${base}/healthz`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).service, 'web');
    assert.equal((await fetch(`${base}/about/`)).status, 200);
    assert.equal((await fetch(`${base}/api/unknown`)).status, 404);
    const discover = await fetch(`${base}/api/discover`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-Proto': 'https', 'X-Forwarded-Host': 'bizomat.ai', Origin: 'https://bizomat.ai', 'CF-Connecting-IP': '203.0.113.9' }, body: JSON.stringify({ question: 'bolt torque' }) });
    assert.equal(discover.status, 200);
    assert.equal((await discover.json()).ai, false, 'no AI configured: the browser falls back to keyword search');
    // Five contact posts a minute per client address, then 429 (the form limiter, keyed by the proxy's client IP).
    const post = (ip: string) => fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip, Origin: base }, body: '{}' });
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await post('198.51.100.1')).status);
    assert.equal(statuses.at(-1), 429);
    assert.notEqual((await post('198.51.100.2')).status, 429, 'another client is not limited');
    assert.ok(lines.every((l) => !JSON.stringify(l).includes('198.51.100')), 'logs never contain client addresses');
  } finally {
    await close();
  }
});

test('server: without proxy trust a client cannot choose its own address for rate limits', async () => {
  const { ready, close } = startWebServer({ port: 0, host: '127.0.0.1', distDir: fixture(), trustProxy: false, env: {}, log: () => {} });
  const port = await ready;
  try {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await fetch(`http://127.0.0.1:${port}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': `192.0.2.${i}` }, body: '{}' })).status);
    assert.equal(statuses.at(-1), 429, 'spoofed CF-Connecting-IP headers are replaced by the socket address');
  } finally {
    await close();
  }
});
