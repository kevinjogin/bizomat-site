// Worker routing tests: static assets, API routes and response headers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { type Env } from '../src/worker.ts';

const env = (): Env => ({
  ASSETS: { fetch: async (input) => new Response(`asset:${new URL(String(input instanceof Request ? input.url : input)).pathname}`, { status: 200 }) },
});

test('static requests are served from the site assets', async () => {
  const res = await worker.fetch(new Request('https://gocore.com.au/about/'), env());
  assert.equal(await res.text(), 'asset:/about/');
});

test('/api/chat reaches the assistant (503 until the AI binding is added)', async () => {
  const res = await worker.fetch(
    new Request('https://gocore.com.au/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] }) }),
    env(),
  );
  assert.equal(res.status, 503);
  assert.match(((await res.json()) as { error: string }).error, /not switched on/);
});

test('/api/contact reaches the contact handler; unknown API paths 404', async () => {
  assert.equal((await worker.fetch(new Request('https://gocore.com.au/api/contact'), env())).status, 405);
  assert.equal((await worker.fetch(new Request('https://gocore.com.au/api/other'), env())).status, 404);
});

test('hashed assets get long caching; pages.dev is kept out of search engines', async () => {
  const asset = await worker.fetch(new Request('https://gocore.com.au/_astro/site.abc123.css'), env());
  assert.match(asset.headers.get('Cache-Control') ?? '', /immutable/);
  const preview = await worker.fetch(new Request('https://gocore.pages.dev/'), env());
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex');
  const live = await worker.fetch(new Request('https://gocore.com.au/'), env());
  assert.equal(live.headers.get('X-Robots-Tag'), null);
});
