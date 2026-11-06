import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { ORIGIN, createBoard, raw, signup } from './helpers';

describe('unauthenticated access (critical test 1)', () => {
  const routes: [string, string][] = [
    ['GET', '/api/workspaces'],
    ['POST', '/api/workspaces'],
    ['GET', '/api/workspaces/x/boards'],
    ['GET', '/api/boards/x'],
    ['POST', '/api/boards/x/items'],
    ['GET', '/api/items/x'],
    ['PATCH', '/api/items/x'],
    ['GET', '/api/items/x/updates'],
    ['GET', '/api/files/x'],
    ['POST', '/api/files'],
    ['GET', '/api/notifications'],
    ['GET', '/api/workspaces/x/dashboards'],
    ['GET', '/api/dashboards/x/data'],
    ['GET', '/api/workspaces/x/documents'],
    ['GET', '/api/documents/x'],
    ['GET', '/api/workspaces/x/goals'],
    ['POST', '/api/workspaces/x/search'],
    ['GET', '/api/boards/x/automations'],
    ['GET', '/api/workspaces/x/integrations'],
    ['GET', '/api/workspaces/x/members'],
    ['GET', '/api/workspaces/x/audit'],
    ['GET', '/api/workspaces/x/export'],
    ['GET', '/api/workspaces/x/my-work'],
    ['GET', '/api/me/sessions'],
    ['GET', '/api/auth/me'],
    ['GET', '/api/users/x/avatar'],
  ];
  for (const [method, path] of routes) {
    it(`${method} ${path} -> 401`, async () => {
      const res = await raw(method, path, { body: method === 'GET' ? undefined : {} });
      expect(res.status).toBe(401);
    });
  }

  it('real resource ids also return 401 without a session', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const item = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'secret' });
    for (const p of [`/api/boards/${b.board.id}`, `/api/items/${item.id}`, `/api/workspaces/${c.workspaceId}/boards`]) {
      expect((await raw('GET', p)).status).toBe(401);
    }
  });

  it('SPA navigations to app pages redirect to /login without a session', async () => {
    const res = await raw('GET', '/w/abc/boards/def', { headers: { Accept: 'text/html' } });
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login?next=%2Fw%2Fabc%2Fboards%2Fdef');
    const root = await raw('GET', '/', { headers: { Accept: 'text/html' } });
    expect(root.status).toBe(302);
    expect(root.headers.get('Location')).toBe('/login');
    const loginPage = await raw('GET', '/login', { headers: { Accept: 'text/html' } });
    expect(loginPage.status).toBe(200);
    expect(loginPage.headers.get('Content-Security-Policy')).toContain("script-src 'self'");
  });

  it('SPA navigation is served when signed in', async () => {
    const c = await signup();
    const res = await raw('GET', '/w/x/boards/y', { cookie: c.cookie, headers: { Accept: 'text/html' } });
    expect(res.status).toBe(200);
  });

  it('unknown API routes 404 (after auth)', async () => {
    const c = await signup();
    expect((await c.req('GET', '/api/does-not-exist')).status).toBe(404);
  });
});

describe('CSRF and CORS', () => {
  it('rejects state-changing requests without or with a wrong CSRF token', async () => {
    const c = await signup();
    let res = await raw('POST', '/api/workspaces', { cookie: c.cookie, body: { name: 'x' } });
    expect(res.status).toBe(403);
    res = await raw('POST', '/api/workspaces', { cookie: c.cookie, csrf: 'wrong', body: { name: 'x' } });
    expect(res.status).toBe(403);
    res = await raw('POST', '/api/workspaces', { cookie: c.cookie, csrf: c.csrf, body: { name: 'x' } });
    expect(res.status).toBe(201);
  });

  it('rejects foreign origins even with a valid CSRF token', async () => {
    const c = await signup();
    const res = await raw('POST', '/api/workspaces', { cookie: c.cookie, csrf: c.csrf, body: { name: 'x' }, headers: { Origin: 'https://evil.example' } });
    expect(res.status).toBe(403);
    const login = await raw('POST', '/api/auth/login', { body: { email: c.email, password: 'x' }, headers: { Origin: 'https://evil.example' } });
    expect(login.status).toBe(403);
  });

  it('refuses CORS preflights and sends no CORS allow headers', async () => {
    const res = await raw('OPTIONS', '/api/workspaces', { headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'POST' } });
    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const c = await signup();
    const g = await raw('GET', '/api/workspaces', { cookie: c.cookie, headers: { Origin: 'https://evil.example' } });
    expect(g.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('sets security headers on API responses', async () => {
    const res = await raw('GET', '/api/health');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(res.headers.get('Strict-Transport-Security')).toContain('max-age=');
  });

  it('WebSocket upgrades require auth and same origin', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const noAuth = await raw('GET', `/api/live/boards/${b.board.id}`, { headers: { Upgrade: 'websocket' } });
    expect(noAuth.status).toBe(401);
    const foreign = await raw('GET', `/api/live/boards/${b.board.id}`, { cookie: c.cookie, headers: { Upgrade: 'websocket', Origin: 'https://evil.example' } });
    expect(foreign.status).toBe(403);
    const other = await signup();
    const idor = await raw('GET', `/api/live/boards/${b.board.id}`, { cookie: other.cookie, headers: { Upgrade: 'websocket' } });
    expect(idor.status).toBe(404);
    const ok = await raw('GET', `/api/live/boards/${b.board.id}`, { cookie: c.cookie, headers: { Upgrade: 'websocket', Origin: ORIGIN } });
    expect(ok.status).toBe(101);
    ok.webSocket?.accept();
    ok.webSocket?.close();
  });
});

describe('injection and secret leakage', () => {
  it('SQL-injection-like strings are stored and searched inertly', async () => {
    const c = await signup();
    const evil = `x'); DROP TABLE items; -- "%_\\`;
    const b = await createBoard(c, evil);
    const item = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: evil });
    expect(item.name).toBe(evil);
    const s = await c.json('POST', `/api/workspaces/${c.workspaceId}/search`, { q: evil });
    expect(s.items.map((i: any) => i.id)).toContain(item.id);
    const wild = await c.json('POST', `/api/workspaces/${c.workspaceId}/search`, { q: '%', types: ['items'] });
    expect(wild.items.every((i: any) => i.name.includes('%'))).toBe(true);
    const t = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='items'").first();
    expect(t).toBeTruthy();
  });

  it('HTML in names is returned as data (rendering is the client\'s escape job) and JSON content type is set', async () => {
    const c = await signup();
    const b = await createBoard(c, '<img src=x onerror=alert(1)>');
    const res = await c.req('GET', `/api/boards/${b.board.id}`);
    expect(res.headers.get('Content-Type')).toContain('application/json');
  });

  it('never returns password hashes, session tokens or token hashes', async () => {
    const c = await signup();
    const responses = await Promise.all([
      c.req('GET', '/api/auth/me'),
      c.req('GET', `/api/workspaces/${c.workspaceId}/members`),
      c.req('GET', '/api/me/sessions'),
      c.req('POST', `/api/workspaces/${c.workspaceId}/search`, { q: '', types: ['users'] }),
    ]);
    for (const r of responses) {
      const text = await r.text();
      expect(text).not.toMatch(/pbkdf2|password_hash|token_hash|csrf_token/);
    }
  });

  it('error responses do not leak internals', async () => {
    const c = await signup();
    const r = await c.req('POST', '/api/workspaces', 'not json' as any);
    expect(r.status).toBe(400);
    const res = await raw('POST', '/api/workspaces', { cookie: c.cookie, csrf: c.csrf, headers: { 'Content-Type': 'application/json' } });
    const text = await res.text();
    expect(text).not.toMatch(/at .*\.ts|stack/i);
  });
});
