import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CAD_PATHS, HOSTS, TASKS_PATHS, decide, isPreviewHost, isProductionHost, lowercaseLocation, normalizeHost, platformUpstream,
  previewCookieHeader, previewNext, routingPath, splitTarget,
} from '../routes.mjs';

const get = (host, path = '/', query = '', extra = {}) => decide({ host, method: 'GET', path, query, ...extra });

// CAD Automation's paths on bizomat.ai, as the website's Worker tests them (tests/worker.test.ts), and paths that look
// like them but are the website's.
const CAD = [
  '/cad', '/cad/', '/cad/docs', '/cad/mcp', '/cad/mcp/k3y', '/cad/v2/device/next', '/cad/.well-known/oauth-authorization-server',
  '/.well-known/oauth-protected-resource/cad/mcp', '/.well-known/oauth-authorization-server/cad', '/.well-known/openid-configuration/cad',
  '/.well-known/oauth-protected-resource', '/.well-known/oauth-authorization-server', '/.well-known/oauth-protected-resource/mcp',
  '/.well-known/acme-challenge/t0k3n', '/mcp', '/mcp/', '/mcp/osk_private', '/mcp/sw/next', '/mcp/uploads/u1', '/solidworks/mcp',
  '/solidworks/mcp/k3y', '/oauth/register', '/oauth/token', '/oauth/revoke', '/oauth/authorize', '/v2/keys', '/v2/device/next',
  '/v2/bridge/update.json', '/healthz',
];
const TASKS = ['/tasks', '/tasks/', '/tasks/login', '/tasks/b/7', '/tasks/api/health', '/tasks/api/live/boards/1', '/tasks/assets/index-a1.js'];
const WEBSITE = [
  '/', '/cad-automation/', '/work/', '/tools/', '/reados/', '/engine-room/', '/cadx', '/cad.html', '/cadence', '/mcpx', '/oauthx',
  '/oauth', '/tasksfoo', '/tasks.html', '/.well-known/security.txt', '/healthz/', '/v2', '/api/contact', '/api/discover',
  '/insights/x/', '/__proxy/health', '/cad%2Fdocs', '/%63ad/', '//cad/docs',
];

test('normalizeHost: case, port, trailing dot, IPv6 literals, junk', () => {
  assert.equal(normalizeHost('BIZOMAT.ai'), 'bizomat.ai');
  assert.equal(normalizeHost('bizomat.ai:443'), 'bizomat.ai');
  assert.equal(normalizeHost('bizomat.ai.'), 'bizomat.ai');
  assert.equal(normalizeHost(' cados.kevos.com '), 'cados.kevos.com');
  assert.equal(normalizeHost('[fdaa::3]:8080'), '[fdaa::3]');
  assert.equal(normalizeHost('[fdaa::3'), '');
  assert.equal(normalizeHost('evil.com/x'), '');
  assert.equal(normalizeHost('bizomat.ai:abc'), '');
  assert.equal(normalizeHost('a..b'), '');
  assert.equal(normalizeHost(undefined), '');
  assert.equal(normalizeHost(''), '');
});

test('every production host is in the table, and nothing else is: no subdomains of bizomat.ai but www', () => {
  assert.deepEqual(Object.keys(HOSTS).sort(), ['bizomat.ai', 'cados.fly.dev', 'cados.kevos.com', 'kevos.com', 'work.kevos.com', 'www.bizomat.ai', 'www.kevos.com']);
  for (const h of Object.keys(HOSTS)) assert.ok(isProductionHost(h));
  for (const h of ['bizomat.fly.dev', 'example.com', 'cad.bizomat.ai', 'work.bizomat.ai']) assert.ok(!isProductionHost(h), h);
});

test('the CAD paths are the website Worker\'s, character for character', () => {
  const worker = readFileSync(new URL('../../../src/worker.ts', import.meta.url), 'utf8');
  const paths = readFileSync(new URL('../../../src/server/platform-paths.ts', import.meta.url), 'utf8');
  const literal = /^export const CAD_PATHS = (\/.+\/[a-z]*);$/m.exec(paths);
  assert.ok(literal, 'src/server/platform-paths.ts exports CAD_PATHS as a regular expression literal');
  assert.equal(CAD_PATHS.toString(), literal[1]);
  assert.match(worker, /\/\^\\\/tasks\(\?:\\\/\|\$\)\/\.test\(url\.pathname\)/, 'the Worker sends /tasks and /tasks/... to Project Management');
  assert.equal(TASKS_PATHS.toString(), '/^\\/tasks(?:\\/|$)/');
});

test('bizomat.ai: /cad, /cad/... and CAD Automation\'s root paths go to cad, Host and path unchanged', () => {
  for (const path of CAD) {
    for (const method of ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']) {
      const d = decide({ host: 'bizomat.ai', method, path });
      assert.deepEqual(d, { host: 'bizomat.ai', production: true, action: 'proxy', upstream: 'cad', preview: false }, `${method} ${path}`);
    }
  }
});

test('bizomat.ai: /tasks and /tasks/... go to work', () => {
  for (const path of TASKS) {
    for (const method of ['GET', 'POST', 'PATCH']) {
      const d = decide({ host: 'bizomat.ai', method, path });
      assert.equal(d.action, 'proxy', `${method} ${path}`);
      assert.equal(d.upstream, 'work', `${method} ${path}`);
      assert.equal(d.production, true);
    }
  }
});

test('bizomat.ai: everything else is the website, on every method', () => {
  for (const path of WEBSITE) {
    for (const method of ['GET', 'HEAD', 'POST']) {
      const d = decide({ host: 'bizomat.ai', method, path });
      assert.equal(d.action, 'proxy', `${method} ${path}`);
      assert.equal(d.upstream, 'web', `${method} ${path}`);
    }
  }
});

test('paths are matched as the website reads them: dot segments resolved, the raw path forwarded', () => {
  assert.equal(routingPath('/./cad/docs'), '/cad/docs');
  assert.equal(routingPath('/x/../tasks/b/7'), '/tasks/b/7');
  assert.equal(routingPath('/%2e/cad/'), '/cad/');
  assert.equal(routingPath('/cad%2Fdocs'), '/cad%2Fdocs', 'an encoded slash is not a separator');
  assert.equal(routingPath('//cad/docs'), '/docs', 'a leading // is read as a host, as the website reads it');
  assert.equal(platformUpstream('/./cad/docs'), 'cad');
  assert.equal(platformUpstream('/x/../tasks/b/7'), 'work');
  assert.equal(platformUpstream('/cad/../tools/'), 'web');
  assert.equal(platformUpstream('/tasks/..'), 'web');
  assert.equal(platformUpstream('//cad/docs'), 'web');
});

test('bizomat.ai: an application\'s path in another case answers 301 to the lowercase path (GET and HEAD only)', () => {
  for (const [from, query, to] of [['/CAD', '', '/cad'], ['/Cad/', '', '/cad/'], ['/CAD/docs', 'q=a%20b', '/cad/docs?q=a%20b'],
    ['/TASKS', '', '/tasks'], ['/Tasks/board/7', 'x=1', '/tasks/board/7?x=1'], ['/cAd/./mcp', '', '/cad/mcp']]) {
    for (const method of ['GET', 'HEAD']) {
      assert.deepEqual(decide({ host: 'bizomat.ai', method, path: from, query }), {
        host: 'bizomat.ai', production: true, action: 'redirect', status: 301, location: to,
      }, `${method} ${from}`);
    }
    // other methods are left alone and find nothing on the website, as with the Worker
    assert.equal(decide({ host: 'bizomat.ai', method: 'POST', path: from, query }).upstream, 'web', from);
  }
  assert.equal(lowercaseLocation('/cad/docs', '', 'GET'), '');
  assert.equal(lowercaseLocation('/Cadence', '', 'GET'), '', 'not an application path');
  assert.equal(lowercaseLocation('/CADX', '', 'GET'), '');
});

test('the old CAD Automation address reaches cad on all paths, unchanged', () => {
  for (const host of ['cados.kevos.com', 'CADOS.KEVOS.COM:443']) {
    for (const path of ['/', '/login', '/mcp', '/mcp/0123456789abcdef0123456789abcdef', '/solidworks/mcp', '/mcp/sw/next', '/v2/device/next',
      '/.well-known/oauth-protected-resource/mcp', '/healthz', '/tasks/x', '/CAD', '/__proxy/health', '/__preview/web']) {
      const d = decide({ host, method: 'POST', path });
      assert.equal(d.action, 'proxy', `${host} ${path}`);
      assert.equal(d.upstream, 'cad', `${host} ${path}`);
    }
  }
});

test('cados.fly.dev, the single app\'s Fly address and CAD Automation\'s before it, reaches cad on every path but the proxy\'s own health', () => {
  for (const host of ['cados.fly.dev', 'CADOS.FLY.DEV:443']) {
    for (const path of ['/', '/login', '/dashboard', '/mcp', '/mcp/0123456789abcdef0123456789abcdef', '/solidworks/mcp', '/mcp/sw/next',
      '/v2/device/next', '/v2/bridge/update.json', '/oauth/token', '/.well-known/oauth-protected-resource/mcp', '/healthz', '/download/solidworks',
      '/cad/x', '/__preview/web']) {
      for (const method of ['GET', 'POST']) {
        const d = decide({ host, method, path, previewRouting: true, previewCookie: 'web' });
        assert.equal(d.action, 'proxy', `${method} ${host} ${path}`);
        assert.equal(d.upstream, 'cad', `${method} ${host} ${path}`);
        assert.equal(d.preview, false);
      }
    }
    assert.equal(get(host, '/__proxy/health').action, 'health', 'Fly\'s check of the proxy');
    assert.equal(get(host, '/__proxy/ready').action, 'ready');
  }
  // the retired app's address is no longer one of ours: as any other fly.dev name, it is never a second platform address
  assert.equal(get('bizomat.fly.dev', '/work/').action, 'redirect');
});

test('the old Project Management address reaches work on all paths', () => {
  for (const path of ['/', '/login', '/api/health', '/api/live/boards/1', '/cad/x', '/mcp', '/__proxy/ready']) {
    const d = get('work.kevos.com', path);
    assert.equal(d.action, 'proxy', path);
    assert.equal(d.upstream, 'work', path);
  }
});

test('cad.bizomat.ai and work.bizomat.ai are not served: everything lives under bizomat.ai', () => {
  for (const host of ['cad.bizomat.ai', 'work.bizomat.ai']) {
    assert.equal(get(host, '/').status, 421, host);
    assert.equal(get(host, '/mcp').status, 421, host);
  }
});

test('www.bizomat.ai redirects to the apex with path and query', () => {
  assert.deepEqual(get('www.bizomat.ai', '/tools/beam/', 'a=1&b=%20'), {
    host: 'www.bizomat.ai', production: true, action: 'redirect', status: 301,
    location: 'https://bizomat.ai/tools/beam/?a=1&b=%20',
  });
  assert.equal(get('www.bizomat.ai', '/cad/docs', 'x=1').location, 'https://bizomat.ai/cad/docs?x=1');
  assert.equal(decide({ host: 'www.bizomat.ai', method: 'HEAD', path: '/' }).status, 301);
  const post = decide({ host: 'www.bizomat.ai', method: 'POST', path: '/api/contact' });
  assert.equal(post.status, 308);
  assert.equal(post.location, 'https://bizomat.ai/api/contact');
});

test('kevos.com and www.kevos.com: GET and HEAD move to bizomat.ai with the same path and query', () => {
  for (const host of ['kevos.com', 'www.kevos.com']) {
    for (const [path, query] of [['/', ''], ['/tools/beam-deflection/', 'units=si'], ['/reados/books/x/', ''], ['/insights/old-post/', 'utm=1'], ['/api/chat', ''], ['/cad/docs', '']]) {
      for (const method of ['GET', 'HEAD']) {
        const d = decide({ host, method, path, query });
        assert.equal(d.action, 'redirect');
        assert.equal(d.status, 301);
        assert.equal(d.location, `https://bizomat.ai${path}${query ? `?${query}` : ''}`);
        assert.equal(d.production, true);
      }
    }
  }
});

test('kevos.com/cad/ was the CAD Automation page: it moves to /cad-automation/, because bizomat.ai/cad is the app', () => {
  for (const host of ['kevos.com', 'www.kevos.com']) {
    for (const path of ['/cad', '/cad/']) {
      assert.equal(get(host, path, 'ref=x').location, 'https://bizomat.ai/cad-automation/?ref=x', `${host}${path}`);
      assert.equal(decide({ host, method: 'HEAD', path }).location, 'https://bizomat.ai/cad-automation/');
    }
    assert.equal(decide({ host, method: 'POST', path: '/cad/' }).status, 308, 'a POST keeps its method and address');
  }
});

test('kevos.com: other methods to /api are proxied to web (old cached forms), elsewhere 308', () => {
  for (const host of ['kevos.com', 'www.kevos.com']) {
    for (const path of ['/api', '/api/contact', '/api/assessment/', '/api/chat']) {
      const d = decide({ host, method: 'POST', path });
      assert.equal(d.action, 'proxy', path);
      assert.equal(d.upstream, 'web');
    }
    assert.equal(decide({ host, method: 'OPTIONS', path: '/api/contact' }).action, 'proxy');
    const other = decide({ host, method: 'POST', path: '/contact/', query: 'x=1' });
    assert.equal(other.action, 'redirect');
    assert.equal(other.status, 308);
    assert.equal(other.location, 'https://bizomat.ai/contact/?x=1');
    assert.equal(decide({ host, method: 'POST', path: '/apiary' }).status, 308);
  }
});

test('the preview host routes as bizomat.ai does, by path, while preview routing is on', () => {
  assert.ok(isPreviewHost('bizomat.fly.dev'));
  assert.ok(!isPreviewHost('a.b.fly.dev'));
  assert.ok(!isPreviewHost('fly.dev'));
  for (const previewRouting of [true]) {
    for (const [paths, upstream] of [[CAD, 'cad'], [TASKS, 'work'], [WEBSITE.filter((p) => p !== '/__proxy/health'), 'web']]) {
      for (const path of paths) {
        const d = get('bizomat.fly.dev', path, '', { previewRouting });
        assert.deepEqual(d, { host: 'bizomat.fly.dev', production: false, action: 'proxy', upstream, preview: true }, path);
      }
    }
    const lower = get('bizomat.fly.dev', '/Tasks/b', 'x=1', { previewRouting });
    assert.equal(lower.status, 301);
    assert.equal(lower.location, '/tasks/b?x=1');
    assert.equal(lower.production, false, 'no HSTS on the preview host');
  }
});

test('preview routing off: the preview host sends every request to the same address on bizomat.ai', () => {
  for (const [method, status] of [['GET', 301], ['HEAD', 301], ['POST', 308], ['PUT', 308]]) {
    for (const [path, query] of [['/', ''], ['/login', ''], ['/tasks/b/7', 'x=1'], ['/cad/mcp', ''], ['/api/contact', ''], ['/__preview/x/y', '']]) {
      const d = decide({ host: 'bizomat.fly.dev', method, path, query, previewCookie: 'cad' });
      if (path.startsWith('/__preview/')) { assert.equal(d.status, 404, 'the switch is off'); continue; }
      assert.deepEqual(d, { host: 'bizomat.fly.dev', production: false, action: 'redirect', status, location: `https://bizomat.ai${path}${query ? `?${query}` : ''}` }, `${method} ${path}`);
    }
  }
  // the proxy's own endpoints stay, for the deploy checks and monitoring
  assert.equal(get('bizomat.fly.dev', '/__proxy/health').action, 'health');
  assert.equal(get('bizomat.fly.dev', '/__proxy/ready').action, 'ready');
});

test('sign-in addresses people type go to the platform sign-in page', () => {
  for (const host of ['bizomat.ai', 'bizomat.fly.dev']) {
    for (const path of ['/login', '/login/', '/Login', '/LOG-IN', '/signin', '/SignIn/', '/logon']) {
      const d = get(host, path, 'from=menu', { previewRouting: true });
      assert.equal(d.action, 'redirect', `${host} ${path}`);
      assert.equal(d.status, 301);
      assert.equal(d.location, '/sign-in/?from=menu');
    }
  }
  assert.equal(get('bizomat.ai', '/login').location, '/sign-in/');
  // the page itself, each application's sign-in, other methods and longer paths are served as before
  assert.equal(get('bizomat.ai', '/sign-in/').upstream, 'web');
  assert.equal(get('bizomat.ai', '/tasks/login').upstream, 'work');
  assert.equal(get('bizomat.ai', '/cad/login').upstream, 'cad');
  assert.equal(decide({ host: 'bizomat.ai', method: 'POST', path: '/login' }).upstream, 'web');
  assert.equal(get('bizomat.ai', '/login/help').upstream, 'web');
  assert.equal(get('bizomat.ai', '/loginx').upstream, 'web');
  // the old addresses keep their own /login
  assert.equal(get('work.kevos.com', '/login').upstream, 'work');
  assert.equal(get('cados.kevos.com', '/login').upstream, 'cad');
});

test('the preview cookie (preview routing on) sends every path to one backend at the root, as the old addresses do', () => {
  for (const target of ['cad', 'work', 'web']) {
    for (const path of ['/login', '/', '/tasks/x', '/cad/x', '/mcp', '/CAD']) {
      const d = get('bizomat.fly.dev', path, '', { previewCookie: target, previewRouting: true });
      assert.equal(d.action, 'proxy', `${target} ${path}`);
      assert.equal(d.upstream, target, `${target} ${path}`);
      assert.equal(d.preview, true);
      assert.equal(d.production, false);
    }
  }
  assert.equal(get('bizomat.fly.dev', '/', '', { previewCookie: 'evil', previewRouting: true }).upstream, 'web');
  assert.equal(get('bizomat.fly.dev', '/cad/', '', { previewCookie: 'evil', previewRouting: true }).upstream, 'cad');
  // the cookie means nothing on a production host
  assert.equal(get('bizomat.ai', '/', '', { previewCookie: 'cad', previewRouting: true }).upstream, 'web');
  assert.equal(get('bizomat.ai', '/tasks/', '', { previewCookie: 'cad', previewRouting: true }).upstream, 'work');
});

test('the /__preview switch: only on *.fly.dev, only when enabled, only GET and HEAD', () => {
  for (const target of ['cad', 'work', 'web', 'clear']) {
    assert.deepEqual(get('bizomat.fly.dev', `/__preview/${target}`, '', { previewRouting: true }), { action: 'preview', target, host: 'bizomat.fly.dev' });
  }
  assert.equal(get('bizomat.fly.dev', '/__preview/cad/', '', { previewRouting: true }).target, 'cad');
  assert.equal(get('bizomat.fly.dev', '/__preview/cad').status, 404, 'off');
  assert.equal(get('bizomat.fly.dev', '/__preview/nope', '', { previewRouting: true }).status, 404);
  assert.equal(decide({ host: 'bizomat.fly.dev', method: 'POST', path: '/__preview/cad', previewRouting: true }).status, 405);
  // not a fly.dev host: the switch does not exist
  assert.equal(get('example.com', '/__preview/cad', '', { previewRouting: true }).status, 421);
  assert.equal(get('localhost', '/__preview/cad', '', { previewRouting: true }).status, 421);
  // on bizomat.ai the path is the website's
  assert.equal(get('bizomat.ai', '/__preview/cad', '', { previewRouting: true }).upstream, 'web');
});

test('the proxy endpoints answer on non-product hosts only', () => {
  for (const host of ['bizomat.fly.dev', '172.19.0.2:8080', '[fdaa::3]:8080', 'localhost:8080', '', 'unknown.example']) {
    assert.equal(get(host, '/__proxy/health').action, 'health', host);
    assert.equal(get(host, '/__proxy/ready').action, 'ready', host);
    assert.equal(get(host, '/__proxy/other').status, 404, host);
  }
});

test('unknown hosts get 421', () => {
  for (const host of ['example.com', 'bizomat.ai.evil.com', 'evilbizomat.ai', '10.0.0.1', '', 'kevos.com.attacker.net', 'cad.bizomat.ai']) {
    const d = get(host, '/');
    assert.equal(d.action, 'error', host);
    assert.equal(d.status, 421);
  }
  assert.equal(get('evil.example', '/cad/').status, 421, 'an application path on another host is not served');
});

test('splitTarget keeps the raw path and query and refuses non-origin forms', () => {
  assert.deepEqual(splitTarget('/a/b?c=d&e'), { path: '/a/b', query: 'c=d&e' });
  assert.deepEqual(splitTarget('/'), { path: '/', query: '' });
  assert.deepEqual(splitTarget('/x?'), { path: '/x', query: '' });
  assert.equal(splitTarget('http://bizomat.ai/'), null);
  assert.equal(splitTarget('*'), null);
  assert.equal(splitTarget('bizomat.ai:443'), null);
});

test('preview cookie and next', () => {
  assert.equal(previewCookieHeader('cad', true), 'bizomat_preview=cad; Max-Age=28800; Path=/; HttpOnly; SameSite=Lax; Secure');
  assert.equal(previewCookieHeader('clear', false), 'bizomat_preview=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax');
  assert.ok(!/Domain=/i.test(previewCookieHeader('work', true)), 'host-only');
  assert.equal(previewNext('next=/login'), '/login');
  assert.equal(previewNext(''), '/');
  assert.equal(previewNext('next=//evil.com'), '/');
  assert.equal(previewNext('next=https://evil.com'), '/');
  assert.equal(previewNext('next=/%5C%5Cevil'), '/', 'decoded backslashes');
  assert.equal(previewNext('next=/work/boards?x=1'), '/work/boards?x=1');
  assert.equal(previewNext('next=/\\evil'), '/');
});

test('with TASKS_REDIRECT_ORIGIN, bizomat.ai/tasks/... redirects there, prefix off, temporarily; the rest is unchanged', () => {
  const tasksOrigin = 'https://work.kevos.com';
  const at = (path, query = '', method = 'GET', host = 'bizomat.ai') => decide({ host, method, path, query, tasksOrigin });
  assert.deepEqual(at('/tasks'), { host: 'bizomat.ai', production: true, action: 'redirect', status: 302, location: 'https://work.kevos.com/', temporary: true });
  assert.equal(at('/tasks/').location, 'https://work.kevos.com/');
  assert.equal(at('/tasks/w/7/boards', 'view=kanban').location, 'https://work.kevos.com/w/7/boards?view=kanban');
  assert.equal(at('/tasks/login', '', 'HEAD').status, 302);
  const post = at('/tasks/api/auth/login', '', 'POST');
  assert.equal(post.status, 307); // method and body kept
  assert.equal(post.location, 'https://work.kevos.com/api/auth/login');
  assert.equal(at('/tasks/../tasks/x').location, 'https://work.kevos.com/x'); // matched as the website reads paths
  assert.equal(at('/Tasks/x').status, 301); // another case: the lowercase path first
  assert.equal(at('/Tasks/x').location, '/tasks/x');
  // nothing else changes: the website, CAD Automation, other paths that merely start with "tasks"
  assert.equal(at('/').upstream, 'web');
  assert.equal(at('/tasksfoo').upstream, 'web');
  assert.equal(at('/cad/docs').upstream, 'cad');
  assert.equal(at('/mcp').upstream, 'cad');
  // the preview host routes as bizomat.ai does while preview routing is on; off, it sends people to bizomat.ai first
  assert.equal(decide({ host: 'bizomat.fly.dev', method: 'GET', path: '/tasks/x', query: '', tasksOrigin, previewRouting: true }).location, 'https://work.kevos.com/x');
  assert.equal(at('/tasks/x', '', 'GET', 'bizomat.fly.dev').location, 'https://bizomat.ai/tasks/x');
  // without the setting /tasks/... goes to the work backend, as before
  assert.equal(decide({ host: 'bizomat.ai', method: 'GET', path: '/tasks/x', query: '' }).upstream, 'work');
});
