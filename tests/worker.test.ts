// Worker routing tests: static assets, API routes and response headers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker, { type Env } from '../src/worker.ts';
import * as entry from '../src/worker.ts';
import { CAD_PATHS } from '../src/server/platform-paths.ts';

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
  const res = await worker.fetch(new Request('http://bizomat.ai/services/?a=1'), env());
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('Location'), 'https://bizomat.ai/services/?a=1');
  assert.equal((await worker.fetch(new Request('https://bizomat.ai/services/'), env())).status, 200);
  // kevos.com is the KEVOS site on its own Worker: this one does not answer for it as a production host
  assert.equal((await worker.fetch(new Request('http://kevos.com/services/'), env())).status, 200);
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
    for (const path of ['/', '/cad-automation/', '/work/', '/cadx', '/cad.html', '/mcpx', '/oauthx', '/tasksfoo', '/crmx', '/crm.html', '/financex', '/finance.html', '/companyx', '/company.html', '/systemx', '/system.html', '/system-preview/', '/system-preview/assets/index-a1.js', '/erp-design-preview/', '/finance-platform/', '/finance-platform/guide/', '/.well-known/security.txt', '/healthz/', '/v2']) {
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
    for (const [from, to] of [['/CAD', '/cad'], ['/Cad/', '/cad/'], ['/CAD/docs?q=a%20b', '/cad/docs?q=a%20b'], ['/TASKS', '/tasks'], ['/Tasks/board/7?x=1', '/tasks/board/7?x=1'], ['/CRM', '/crm'], ['/Crm/o/1/deals?view=board', '/crm/o/1/deals?view=board'], ['/FINANCE', '/finance'], ['/Finance/o/1/transactions?q=a', '/finance/o/1/transactions?q=a'], ['/Company/c/1?x=1', '/company/c/1?x=1'], ['/SYSTEM', '/system'], ['/System/admin?x=1', '/system/admin?x=1'], ['/ERP', '/erp'], ['/Erp/crm?x=1', '/erp/crm?x=1']]) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${from}`), env());
      assert.equal(res.status, 301, from);
      assert.equal(res.headers.get('Location'), to, from);
    }
    assert.equal(seen.length, 0);
  });
});

test('with the CAD binding, CAD Automation\'s paths go to bizomat-mcp as they were asked; certificate checks stay at the origin', async () => {
  await withOrigin(async (seen) => {
    const handed: Request[] = [];
    const bound = (): Env => ({ ...env(), CAD: { fetch: async (r: Request) => (handed.push(r), new Response(`cad:${new URL(r.url).pathname}`, { headers: { 'X-From': 'bizomat-mcp' } })) } });
    for (const path of ['/cad/', '/cad/login?next=%2F', '/mcp', '/solidworks/mcp/k', '/oauth/token', '/v2/device/next?session=s&wait=25', '/healthz',
      '/.well-known/oauth-protected-resource/cad/mcp', '/.well-known/oauth-authorization-server/cad', '/.well-known/openid-configuration/cad']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), bound());
      assert.equal(await res.text(), `cad:${path.split('?')[0]}`, path);
      assert.equal(res.headers.get('X-From'), 'bizomat-mcp', path);
    }
    const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    await worker.fetch(new Request('https://bizomat.ai/cad/mcp', { method: 'POST', body, headers: { Authorization: 'Bearer t', 'Content-Type': 'application/json' } }), bound());
    const post = handed.at(-1)!;
    assert.equal(post.method, 'POST');
    assert.equal(post.url, 'https://bizomat.ai/cad/mcp');
    assert.equal(post.headers.get('Authorization'), 'Bearer t');
    assert.equal(await post.text(), body);
    assert.equal(seen.length, 0, 'nothing went to the origin');
    // Fly renews the origin's certificate through Cloudflare: that path stays with the origin
    assert.equal(await (await worker.fetch(new Request('http://bizomat.ai/.well-known/acme-challenge/t0k3n'), bound())).text(), 'origin:/.well-known/acme-challenge/t0k3n');
    // the website itself is not handed on
    assert.equal(await (await worker.fetch(new Request('https://bizomat.ai/cad-automation/'), bound())).text(), 'asset:/cad-automation/');
  });
});

test('bizomat.ai/tasks/... reaches Project Management: its Worker once bound, the origin until then', async () => {
  await withOrigin(async (seen) => {
    for (const path of ['/tasks', '/tasks/', '/tasks/login', '/tasks/b/7?view=board']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `origin:${path.split('?')[0]}`, path);
    }
    assert.equal(seen.at(-1)?.url, 'https://bizomat.ai/tasks/b/7?view=board');
  });
  const got: Request[] = [];
  const bound: Env = { ...env(), TASKS: { fetch: async (req) => (got.push(req), new Response('tasks app')) } };
  const res = await worker.fetch(new Request('https://bizomat.ai/tasks/b/7?view=board', { method: 'POST', body: 'x' }), bound);
  assert.equal(await res.text(), 'tasks app');
  assert.equal(got[0].url, 'https://bizomat.ai/tasks/b/7?view=board');
  assert.equal(got[0].method, 'POST');
});

test('bizomat.ai/crm/... reaches the same app as Project Management (BIZOMAT CRM): its Worker once bound, the origin until then', async () => {
  await withOrigin(async (seen) => {
    for (const path of ['/crm', '/crm/', '/crm/login', '/crm/o/1/deals?view=board', '/crm/api/crm/orgs']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `origin:${path.split('?')[0]}`, path);
    }
    assert.equal(seen.at(-1)?.url, 'https://bizomat.ai/crm/api/crm/orgs');
  });
  const got: Request[] = [];
  const bound: Env = { ...env(), TASKS: { fetch: async (req) => (got.push(req), new Response('crm app')) } };
  const res = await worker.fetch(new Request('https://bizomat.ai/crm/api/crm/orgs', { method: 'POST', body: '{}' }), bound);
  assert.equal(await res.text(), 'crm app');
  assert.equal(got[0].url, 'https://bizomat.ai/crm/api/crm/orgs');
  assert.equal(got[0].method, 'POST');
});

test('bizomat.ai/finance/... reaches the same app as Project Management (BIZOMAT Finance): its Worker once bound, the origin until then', async () => {
  await withOrigin(async (seen) => {
    for (const path of ['/finance', '/finance/', '/finance/login', '/finance/o/1/transactions?q=a', '/finance/api/fin/orgs', '/finance/join/t0k3n']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `origin:${path.split('?')[0]}`, path);
    }
    assert.equal(seen.at(-1)?.url, 'https://bizomat.ai/finance/join/t0k3n');
  });
  const got: Request[] = [];
  const bound: Env = { ...env(), TASKS: { fetch: async (req) => (got.push(req), new Response('finance app')) } };
  const res = await worker.fetch(new Request('https://bizomat.ai/finance/api/fin/orgs', { method: 'POST', body: '{}' }), bound);
  assert.equal(await res.text(), 'finance app');
  assert.equal(got[0].url, 'https://bizomat.ai/finance/api/fin/orgs');
  assert.equal(got[0].method, 'POST');
});

test('bizomat.ai/company/... reaches the same app (BIZOMAT company accounts): its Worker once bound, the origin until then', async () => {
  await withOrigin(async (seen) => {
    for (const path of ['/company', '/company/', '/company/login', '/company/c/1/people', '/company/api/company/mine', '/company/api/id/token', '/company/join/t0k3n']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `origin:${path}`, path);
    }
    assert.equal(seen.at(-1)?.url, 'https://bizomat.ai/company/join/t0k3n');
  });
  const got: Request[] = [];
  const bound: Env = { ...env(), TASKS: { fetch: async (req) => (got.push(req), new Response('company app')) } };
  const res = await worker.fetch(new Request('https://bizomat.ai/company/api/company/companies', { method: 'POST', body: '{}' }), bound);
  assert.equal(await res.text(), 'company app');
  assert.equal(got[0].method, 'POST');
});

test('bizomat.ai/system/... reaches the same app (BIZOMAT System): its Worker once bound, the origin until then; /system-preview/ stays the website\'s', async () => {
  await withOrigin(async (seen) => {
    for (const path of ['/system', '/system/', '/system/login', '/system/admin', '/system/api/system/me', '/system/assets/index-a1.js']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `origin:${path}`, path);
    }
    assert.equal(seen.at(-1)?.url, 'https://bizomat.ai/system/assets/index-a1.js');
    const count = seen.length;
    for (const path of ['/system-preview/', '/System-Preview/']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(res.status, 200, path);
      assert.equal(await res.text(), `asset:${path}`, path);
    }
    assert.equal(seen.length, count, 'the design preview never reaches the app');
  });
  const got: Request[] = [];
  const bound: Env = { ...env(), TASKS: { fetch: async (req) => (got.push(req), new Response('system app')) } };
  const res = await worker.fetch(new Request('https://bizomat.ai/system/api/system/me', { method: 'POST', body: '{}' }), bound);
  assert.equal(await res.text(), 'system app');
  assert.equal(got[0].url, 'https://bizomat.ai/system/api/system/me');
  assert.equal(got[0].method, 'POST');
});

test('bizomat.ai/erp/... reaches the same app (BIZOMAT ERP, the one workspace); /erp-design-preview stays the website\'s', async () => {
  await withOrigin(async () => {
    for (const path of ['/erp', '/erp/', '/erp/login', '/erp/crm/o/1/overview', '/erp/api/system/me', '/erp/assets/index-a1.js']) {
      const res = await worker.fetch(new Request(`https://bizomat.ai${path}`), env());
      assert.equal(await res.text(), `origin:${path}`, path);
    }
  });
  const got: Request[] = [];
  const bound: Env = { ...env(), TASKS: { fetch: async (req) => (got.push(req), new Response('erp app')) } };
  const res = await worker.fetch(new Request('https://bizomat.ai/erp/finance/api/fin/orgs'), bound);
  assert.equal(await res.text(), 'erp app');
  assert.equal(got[0].url, 'https://bizomat.ai/erp/finance/api/fin/orgs');
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
        assert.equal(res.headers.get('Location'), '/systems/engineering/?ref=x', `${host}${path}`);
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
  const appPath = /^\/(cad|tasks|crm|finance|company|system|erp)(\/|$)/i;
  // The BIZOMAT System preview (added to the image by infrastructure/fly/Dockerfile) is the website's, not /system's.
  for (const path of ['/system-preview', '/system-preview/index.html', '/system-preview/assets/index-a1.js', '/erp-design-preview']) assert.ok(!appPath.test(path), path);
  for (const root of ['src/pages', 'public']) {
    for (const file of taken(root)) {
      const path = file.slice(root.length).replace(/\.(astro|md|mdx|ts|js|html)$/, '').replace(/\/index$/, '') || '/';
      assert.ok(!appPath.test(path), `${file} would take an application's address`);
      assert.ok(!CAD_PATHS.test(path) || path.startsWith('/.well-known/security'), `${file} is under a path CAD Automation keeps`);
    }
  }
  const toml = fs.readFileSync('wrangler.toml', 'utf8');
  // run_worker_first as a list stops the Worker from being the fallback for paths that are not files: /api/* and
  // /insights then answer the 404 page (it happened in production on 6 Nov 2026). Paths reach the Worker by having no file.
  assert.doesNotMatch(toml, /^\s*run_worker_first\s*=/m, 'run_worker_first must stay unset');
  assert.match(toml, /pattern = "bizomat\.ai\/\*", zone_name = "bizomat\.ai"/);
  // bizomat.ai/tasks is the Worker bizomat-tasks and bizomat.ai/cad the Worker bizomat-mcp, bound by name
  assert.match(toml, /^\[\[services\]\]\nbinding = "TASKS"\nservice = "bizomat-tasks"$/m);
  assert.match(toml, /^\[\[services\]\]\nbinding = "CAD"\nservice = "bizomat-mcp"$/m);
  const tasks = fs.readFileSync('apps/work/wrangler.jsonc', 'utf8');
  assert.match(tasks, /"bizomat": \{\n\s+"name": "bizomat-tasks",\n\s+"workers_dev": false,/, 'bizomat-tasks has no address of its own');
});

test('the Worker\'s main module exports only its handler: the runtime refuses any other value there', () => {
  assert.deepEqual(Object.keys(entry), ['default']);
  assert.equal(typeof worker.fetch, 'function');
});
