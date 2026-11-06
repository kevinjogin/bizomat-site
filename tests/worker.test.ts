// Worker routing tests: static assets, API routes and response headers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker, { CAD_PATHS, type Env } from '../src/worker.ts';

const env = (): Env => ({
  ASSETS: { fetch: async (input) => new Response(`asset:${new URL(String(input instanceof Request ? input.url : input)).pathname}`, { status: 200 }) },
});

test('static requests are served from the site assets', async () => {
  const res = await worker.fetch(new Request('https://kevos.com/about/'), env());
  assert.equal(await res.text(), 'asset:/about/');
});

test('/api/chat reaches the assistant (503 until the AI binding is added)', async () => {
  const res = await worker.fetch(
    new Request('https://kevos.com/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] }) }),
    env(),
  );
  assert.equal(res.status, 503);
  assert.match(((await res.json()) as { error: string }).error, /not switched on/);
});

test('/api/contact reaches the contact handler; unknown API paths 404', async () => {
  assert.equal((await worker.fetch(new Request('https://kevos.com/api/contact'), env())).status, 405);
  assert.equal((await worker.fetch(new Request('https://kevos.com/api/other'), env())).status, 404);
});

test('hashed assets get long caching; pages.dev is kept out of search engines', async () => {
  const asset = await worker.fetch(new Request('https://kevos.com/_astro/site.abc123.css'), env());
  assert.match(asset.headers.get('Cache-Control') ?? '', /immutable/);
  const preview = await worker.fetch(new Request('https://gocore.pages.dev/'), env());
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex');
  const live = await worker.fetch(new Request('https://kevos.com/'), env());
  assert.equal(live.headers.get('X-Robots-Tag'), null);
});

test('plain HTTP page requests on the production domain are upgraded to HTTPS', async () => {
  const res = await worker.fetch(new Request('http://kevos.com/services/?a=1'), env());
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('Location'), 'https://kevos.com/services/?a=1');
  assert.equal((await worker.fetch(new Request('https://kevos.com/services/'), env())).status, 200);
});

// ----------------------------------------------------------------------------- bizomat.ai: the applications

/** Runs fn with the global fetch (the zone's origin: the CAD app on Fly) replaced by a recorder. */
async function withOrigin(fn: (seen: Request[]) => Promise<void>): Promise<void> {
  const real = globalThis.fetch;
  const seen: Request[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const req = input instanceof Request && !init ? input : new Request(input, init);
    seen.push(req);
    return new Response(`origin:${new URL(req.url).pathname}`, { status: 200, headers: { 'Content-Security-Policy': "default-src 'none'", 'X-From': 'cad' } });
  }) as typeof fetch;
  try {
    await fn(seen);
  } finally {
    globalThis.fetch = real;
  }
}

test('bizomat.ai/cad/... reaches the CAD app as it was asked, with the app\'s own headers', async () => {
  await withOrigin(async (seen) => {
    for (const path of ['/cad', '/cad/', '/cad/docs?x=1', '/cad/login?next=%2Fdashboard', '/cad/ui/app.js', '/cad/mcp']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `origin:${new URL(path, 'https://bizomat.ai').pathname}`, path);
      assert.equal(res.headers.get('X-From'), 'cad', path);
      assert.equal(res.headers.get('Content-Security-Policy'), "default-src 'none'", `${path}: the website's headers are not added`);
    }
    assert.equal(seen.at(-1)?.url, 'https://bizomat.ai/cad/mcp');
    const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    await worker.fetch(new Request('https://bizomat.ai/cad/mcp', { method: 'POST', body, headers: { Authorization: 'Bearer x', 'Content-Type': 'application/json' } }), env());
    const post = seen.at(-1)!;
    assert.equal(post.method, 'POST');
    assert.equal(post.headers.get('Authorization'), 'Bearer x');
    assert.equal(await post.text(), body);
  });
});

test('the OAuth metadata and the program addresses CAD keeps at the root of bizomat.ai reach the CAD app', async () => {
  await withOrigin(async (seen) => {
    const programs = [
      '/.well-known/oauth-protected-resource/cad/mcp', '/.well-known/oauth-authorization-server/cad', '/.well-known/openid-configuration/cad',
      '/.well-known/oauth-protected-resource', '/.well-known/oauth-authorization-server', '/.well-known/oauth-protected-resource/mcp',
      '/mcp', '/mcp/', '/mcp/osk_private', '/mcp/sw/next', '/mcp/uploads/u1', '/solidworks/mcp', '/oauth/register', '/oauth/token',
      '/oauth/revoke', '/v2/keys', '/v2/device/next', '/healthz',
    ];
    for (const path of programs) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`, { method: path.startsWith('/oauth/') ? 'POST' : 'GET' }), env());
      assert.equal(await res.text(), `origin:${path.replace(/\?.*$/, '')}`, path);
    }
    assert.equal(seen.length, programs.length);
  });
});

test('the rest of bizomat.ai is the website', async () => {
  await withOrigin(async (seen) => {
    for (const path of ['/', '/cad-automation/', '/work/', '/cadx', '/cad.html', '/mcpx', '/oauthx', '/tasksfoo', '/.well-known/security.txt', '/healthz/', '/v2']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `asset:${path}`, path);
      assert.ok(res.headers.get('X-Content-Type-Options'), `${path}: the website's headers`);
    }
    assert.equal((await worker.fetch(new Request('https://bizomat.ai/api/other'), env())).status, 404); // /api/ stays the website's
    assert.equal(seen.length, 0);
  });
});

test('an application path in another case answers 301 to the lowercase one', async () => {
  await withOrigin(async (seen) => {
    for (const [from, to] of [['/CAD', '/cad'], ['/Cad/', '/cad/'], ['/CAD/docs?q=a%20b', '/cad/docs?q=a%20b'], ['/TASKS', '/tasks'], ['/Tasks/board/7?x=1', '/tasks/board/7?x=1']]) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${from}`), env());
      assert.equal(res.status, 301, from);
      assert.equal(res.headers.get('Location'), to, from);
    }
    assert.equal(seen.length, 0);
  });
});

test('bizomat.ai/tasks/... reaches Project Management: its Worker once bound, its current address until then', async () => {
  for (const [path, to] of [['/tasks', 'https://work.kevos.com/'], ['/tasks/', 'https://work.kevos.com/'], ['/tasks/login', 'https://work.kevos.com/login'], ['/tasks/b/7?view=board', 'https://work.kevos.com/b/7?view=board']]) {
    const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
    assert.equal(res.status, 302, path);
    assert.equal(res.headers.get('Location'), to, path);
    assert.equal(res.headers.get('Cache-Control'), 'no-store', `${path}: temporary`);
  }
  const got: Request[] = [];
  const bound: Env = { ...env(), TASKS: { fetch: async (req) => (got.push(req), new Response('tasks app')) } };
  const res = await worker.fetch(new Request('https://bizomat.ai/tasks/b/7?view=board', { method: 'POST', body: 'x' }), bound);
  assert.equal(await res.text(), 'tasks app');
  assert.equal(got[0].url, 'https://bizomat.ai/tasks/b/7?view=board');
  assert.equal(got[0].method, 'POST');
});

test('www.bizomat.ai answers with bizomat.ai; plain HTTP is upgraded before the applications are reached', async () => {
  await withOrigin(async (seen) => {
    const page = await worker.fetch(new Request('http://www.bizomat.ai/cad/docs?x=1'), env());
    assert.equal(page.status, 301);
    assert.equal(page.headers.get('Location'), 'https://bizomat.ai/cad/docs?x=1');
    const post = await worker.fetch(new Request('https://www.bizomat.ai/api/contact', { method: 'POST', body: '{}' }), env());
    assert.equal(post.status, 308); // a POST keeps its method and body
    assert.equal(post.headers.get('Location'), 'https://bizomat.ai/api/contact');
    const plain = await worker.fetch(new Request('http://bizomat.ai/cad/'), env());
    assert.equal(plain.status, 301);
    assert.equal(plain.headers.get('Location'), 'https://bizomat.ai/cad/');
    // certificate checks for the CAD app's origin go there over either scheme
    assert.equal(await (await worker.fetch(new Request('http://bizomat.ai/.well-known/acme-challenge/t0k3n'), env())).text(), 'origin:/.well-known/acme-challenge/t0k3n');
    assert.equal(seen.length, 1);
  });
});

test('the applications are reached only on bizomat.ai; elsewhere the old CAD page address finds its new page', async () => {
  await withOrigin(async (seen) => {
    for (const host of ['kevos.com', 'www.kevos.com', 'throbbing-block-6c61.example.workers.dev']) {
      for (const path of ['/cad', '/cad/']) {
        const res = await worker.fetch(new Request(`https://${host}${path}?ref=x`), env());
        assert.equal(res.status, 301, `${host}${path}`);
        assert.equal(res.headers.get('Location'), '/cad-automation/?ref=x', `${host}${path}`);
      }
      assert.equal(await (await worker.fetch(new Request(`https://${host}/mcp`), env())).text(), 'asset:/mcp', host);
      assert.equal(await (await worker.fetch(new Request(`https://${host}/tasks/`), env())).text(), 'asset:/tasks/', host);
    }
    assert.equal(seen.length, 0);
  });
});

test('no page or file of the website takes an application\'s path, so those paths reach the Worker', () => {
  const taken = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const rel = `${dir}/${e.name}`;
      return e.isDirectory() ? [rel, ...taken(rel)] : [rel];
    });
  for (const root of ['src/pages', 'public']) {
    for (const file of taken(root)) {
      const path = file.slice(root.length).replace(/\.(astro|md|mdx|ts|js|html)$/, '').replace(/\/index$/, '') || '/';
      assert.ok(!/^\/(cad|tasks)(\/|$)/i.test(path), `${file} would take an application's address`);
      assert.ok(!CAD_PATHS.test(path) || path.startsWith('/.well-known/security'), `${file} is under a path CAD Automation keeps`);
    }
  }
  const toml = fs.readFileSync('wrangler.toml', 'utf8');
  // run_worker_first as a list stops the Worker from being the fallback for paths that are not files: /api/* and
  // /insights then answer the 404 page (it happened in production on 6 Nov 2026). Paths reach the Worker by having no file.
  assert.doesNotMatch(toml, /^\s*run_worker_first\s*=/m, 'run_worker_first must stay unset');
  assert.match(toml, /pattern = "bizomat\.ai\/\*", zone_name = "bizomat\.ai"/);
  // bizomat.ai/tasks is Project Management's Worker (the one behind work.kevos.com), bound by name
  assert.match(toml, /^\[\[services\]\]\nbinding = "TASKS"\nservice = "workos-platform-preview"$/m);
});
