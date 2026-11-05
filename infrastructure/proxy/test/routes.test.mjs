import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HOSTS, decide, isPreviewHost, isProductionHost, normalizeHost, previewCookieHeader, previewNext, splitTarget,
} from '../routes.mjs';

const get = (host, path = '/', query = '', extra = {}) => decide({ host, method: 'GET', path, query, ...extra });

test('normalizeHost: case, port, trailing dot, IPv6 literals, junk', () => {
  assert.equal(normalizeHost('BIZOMAT.ai'), 'bizomat.ai');
  assert.equal(normalizeHost('bizomat.ai:443'), 'bizomat.ai');
  assert.equal(normalizeHost('bizomat.ai.'), 'bizomat.ai');
  assert.equal(normalizeHost(' cad.bizomat.ai '), 'cad.bizomat.ai');
  assert.equal(normalizeHost('[fdaa::3]:8080'), '[fdaa::3]');
  assert.equal(normalizeHost('[fdaa::3'), '');
  assert.equal(normalizeHost('evil.com/x'), '');
  assert.equal(normalizeHost('bizomat.ai:abc'), '');
  assert.equal(normalizeHost('a..b'), '');
  assert.equal(normalizeHost(undefined), '');
  assert.equal(normalizeHost(''), '');
});

test('every production host is in the table, and nothing else is', () => {
  assert.deepEqual(Object.keys(HOSTS).sort(), [
    'bizomat.ai', 'cad.bizomat.ai', 'cados.kevos.com', 'kevos.com', 'work.bizomat.ai', 'work.kevos.com',
    'www.bizomat.ai', 'www.kevos.com',
  ]);
  for (const h of Object.keys(HOSTS)) assert.ok(isProductionHost(h));
  assert.ok(!isProductionHost('bizomat.fly.dev'));
  assert.ok(!isProductionHost('example.com'));
});

test('bizomat.ai serves the website on every path and method', () => {
  for (const [method, path] of [['GET', '/'], ['GET', '/tools/'], ['POST', '/api/contact'], ['GET', '/insights/x/'], ['GET', '/__proxy/health']]) {
    const d = decide({ host: 'bizomat.ai', method, path });
    assert.equal(d.action, 'proxy', `${method} ${path}`);
    assert.equal(d.upstream, 'web');
    assert.equal(d.production, true);
  }
});

test('cad hosts reach cad on all paths, unchanged', () => {
  for (const host of ['cad.bizomat.ai', 'cados.kevos.com', 'CADOS.KEVOS.COM:443']) {
    for (const path of ['/', '/mcp', '/mcp/0123456789abcdef0123456789abcdef', '/solidworks/mcp', '/mcp/sw/next', '/v2/device/next',
      '/.well-known/oauth-protected-resource/mcp', '/healthz', '/__proxy/health', '/__preview/web']) {
      const d = decide({ host, method: 'POST', path });
      assert.equal(d.action, 'proxy', `${host} ${path}`);
      assert.equal(d.upstream, 'cad');
    }
  }
});

test('work hosts reach work on all paths', () => {
  for (const host of ['work.bizomat.ai', 'work.kevos.com']) {
    for (const path of ['/', '/login', '/api/health', '/api/live/boards/1', '/__proxy/ready']) {
      const d = get(host, path);
      assert.equal(d.action, 'proxy');
      assert.equal(d.upstream, 'work');
    }
  }
});

test('www.bizomat.ai redirects to the apex with path and query', () => {
  assert.deepEqual(get('www.bizomat.ai', '/tools/beam/', 'a=1&b=%20'), {
    host: 'www.bizomat.ai', production: true, action: 'redirect', status: 301,
    location: 'https://bizomat.ai/tools/beam/?a=1&b=%20',
  });
  assert.equal(decide({ host: 'www.bizomat.ai', method: 'HEAD', path: '/' }).status, 301);
  const post = decide({ host: 'www.bizomat.ai', method: 'POST', path: '/api/contact' });
  assert.equal(post.status, 308);
  assert.equal(post.location, 'https://bizomat.ai/api/contact');
});

test('kevos.com and www.kevos.com: GET and HEAD move to bizomat.ai with the same path and query', () => {
  for (const host of ['kevos.com', 'www.kevos.com']) {
    for (const [path, query] of [['/', ''], ['/tools/beam-deflection/', 'units=si'], ['/reados/books/x/', ''], ['/insights/old-post/', 'utm=1'], ['/api/chat', '']]) {
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

test('the preview host goes to web unless preview routing is on and a valid cookie is set', () => {
  assert.ok(isPreviewHost('bizomat.fly.dev'));
  assert.ok(!isPreviewHost('a.b.fly.dev'));
  assert.ok(!isPreviewHost('fly.dev'));
  assert.equal(get('bizomat.fly.dev', '/').upstream, 'web');
  assert.equal(get('bizomat.fly.dev', '/', '', { previewCookie: 'cad' }).upstream, 'web', 'off: cookie ignored');
  for (const target of ['cad', 'work', 'web']) {
    const d = get('bizomat.fly.dev', '/login', '', { previewCookie: target, previewRouting: true });
    assert.equal(d.action, 'proxy');
    assert.equal(d.upstream, target);
    assert.equal(d.preview, true);
    assert.equal(d.production, false);
  }
  assert.equal(get('bizomat.fly.dev', '/', '', { previewCookie: 'evil', previewRouting: true }).upstream, 'web');
  // the cookie means nothing on a production host
  assert.equal(get('bizomat.ai', '/', '', { previewCookie: 'cad', previewRouting: true }).upstream, 'web');
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
});

test('the proxy endpoints answer on non-product hosts only', () => {
  for (const host of ['bizomat.fly.dev', '172.19.0.2:8080', '[fdaa::3]:8080', 'localhost:8080', '', 'unknown.example']) {
    assert.equal(get(host, '/__proxy/health').action, 'health', host);
    assert.equal(get(host, '/__proxy/ready').action, 'ready', host);
    assert.equal(get(host, '/__proxy/other').status, 404, host);
  }
});

test('unknown hosts get 421', () => {
  for (const host of ['example.com', 'bizomat.ai.evil.com', 'evilbizomat.ai', '10.0.0.1', '', 'kevos.com.attacker.net']) {
    const d = get(host, '/');
    assert.equal(d.action, 'error', host);
    assert.equal(d.status, 421);
  }
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
