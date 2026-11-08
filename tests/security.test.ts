// Security hardening: API response headers, edge rate limits, origin and body-size handling,
// the casual-copy guard and the published security contact.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker, { type Env } from '../src/worker.ts';
import { isSameOrigin, readBoundedText, withinEdgeLimit, type RateLimiter } from '../src/server/security.ts';

const assets = { fetch: async () => new Response('page', { status: 200 }) };
const env = (extra: Partial<Env> = {}): Env => ({ ASSETS: assets, ...extra });
const deny: RateLimiter = { limit: async () => ({ success: false }) };
const post = (path: string, body: string, headers: Record<string, string> = {}) =>
  new Request(`https://kevos.com${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body });

test('API responses carry a locked-down CSP and the baseline headers', async () => {
  const res = await worker.fetch(new Request('https://kevos.com/api/contact'), env());
  assert.equal(res.headers.get('Content-Security-Policy'), "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(res.headers.get('X-Frame-Options'), 'DENY');
  assert.equal(res.headers.get('Cross-Origin-Resource-Policy'), 'same-origin');
  assert.match(res.headers.get('Strict-Transport-Security') ?? '', /max-age=31536000/);
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
  // Unknown API paths are covered too.
  assert.equal((await worker.fetch(new Request('https://kevos.com/api/nope'), env())).headers.get('X-Content-Type-Options'), 'nosniff');
});

test('the edge limit answers 429 for the contact form, and only for POST', async () => {
  for (const path of ['/api/contact', '/api/contact/']) {
    const res = await worker.fetch(post(path, '{}'), env({ FORM_LIMITER: deny }));
    assert.equal(res.status, 429, path);
    assert.equal(res.headers.get('Retry-After'), '60');
  }
  assert.equal((await worker.fetch(new Request('https://kevos.com/api/contact'), env({ FORM_LIMITER: deny }))).status, 405);
  assert.equal((await worker.fetch(new Request('https://kevos.com/about/'), env({ FORM_LIMITER: deny }))).status, 200);
});

test('a missing or failing limiter never takes the endpoints down', async () => {
  const req = post('/api/contact', '{}');
  assert.equal(await withinEdgeLimit(undefined, 'form', req), true);
  assert.equal(await withinEdgeLimit({ limit: async () => { throw new Error('down'); } }, 'form', req), true);
  let key = '';
  await withinEdgeLimit({ limit: async (o) => { key = o.key; return { success: true }; } }, 'form', post('/api/contact', '{}', { 'CF-Connecting-IP': '203.0.113.9' }));
  assert.equal(key, 'form:203.0.113.9');
});

test('malformed or cross-site origins are refused instead of throwing', async () => {
  assert.equal(isSameOrigin(post('/api/contact', '{}', { Origin: 'not a url' })), false);
  assert.equal(isSameOrigin(post('/api/contact', '{}', { Origin: 'https://evil.example' })), false);
  assert.equal(isSameOrigin(post('/api/contact', '{}', { 'Sec-Fetch-Site': 'cross-site' })), false);
  assert.equal(isSameOrigin(post('/api/contact', '{}', { Origin: 'https://kevos.com' })), true);
  const contact = await worker.fetch(new Request('https://kevos.com/api/contact', { method: 'POST', headers: { Origin: '::::', 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body: 'a=1' }), env());
  assert.equal(contact.status, 403);
});

test('bounded body reads stop at the limit', async () => {
  assert.equal(await readBoundedText(post('/api/contact', 'abc'), 2), null);
  assert.equal(await readBoundedText(post('/api/contact', 'abc'), 10), 'abc');
});

test('the copy guard is shared by every page and keeps interactive content usable', () => {
  const layout = fs.readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  assert.match(layout, /import '\.\.\/scripts\/content-guard\.ts'/);
  const guard = fs.readFileSync('src/scripts/content-guard.ts', 'utf8');
  for (const exempt of ['input', 'textarea', 'select', 'pre', 'code', 'a[href]', 'output', '[aria-live]', '[data-allow-copy]', 'contenteditable', "'/tools/'"]) assert.ok(guard.includes(exempt), exempt);
  // Never block copying, selection or printing, and never interrupt the visitor.
  assert.doesNotMatch(guard, /addEventListener\('(copy|cut|selectstart|beforeprint)'/);
  assert.doesNotMatch(guard, /alert\(|debugger|location\.(assign|replace|href\s*=)/);
  assert.doesNotMatch(guard, /key === 'p'/);
});

test('security.txt names a real channel and a future expiry', () => {
  const txt = fs.readFileSync('public/.well-known/security.txt', 'utf8');
  assert.match(txt, /^Contact: https:\/\/kevos\.com\/contact\/$/m);
  const expires = txt.match(/^Expires: (.+)$/m)?.[1];
  assert.ok(expires && new Date(expires).getTime() > Date.now(), 'Expires must be in the future');
  assert.ok(new Date(expires!).getTime() - Date.now() < 400 * 86_400_000, 'Expires should be under about a year away');
});

test('fly.toml keeps secrets out of its [env]', () => {
  const toml = fs.readFileSync('fly.toml', 'utf8');
  assert.doesNotMatch(toml, /TURNSTILE_SECRET_KEY\s*=|STRIPE_WEBHOOK_SECRET\s*=|sk_live_|whsec_|FlyV1 |fo1_/);
});
