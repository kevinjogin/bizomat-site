// Project Management under a path of another site's address (https://bizomat.ai/tasks): the BIZOMAT website hands
// /tasks/... to this Worker unchanged; the app answers there as it does at the root of its own host.
import { describe, expect, it } from 'vitest';
import { ORIGIN, PASSWORD, raw, signup, uniqueEmail } from './helpers';
import { addBase, canonicalRedirect, remount } from '../src/worker/mount';

describe('under /tasks', () => {
  it('the API answers with the same data and security headers', async () => {
    const res = await raw('GET', '/tasks/api/health');
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).status).toBe('ok');
    expect(res.headers.get('Content-Security-Policy')).toContain("frame-ancestors 'none'");
    expect((await raw('GET', '/tasks/api/no-such-thing')).status).toBe((await raw('GET', '/api/no-such-thing')).status);
  });

  it('a sign-up gets a session cookie scoped to /tasks, and the session works there', async () => {
    const res = await raw('POST', '/tasks/api/auth/signup', { body: { email: uniqueEmail('mount'), name: 'Mo Unt', password: PASSWORD } });
    expect(res.status).toBe(201);
    const set = res.headers.getSetCookie().find((c) => c.startsWith('workos_sid='))!;
    expect(set).toMatch(/;\s*path=\/tasks(;|$)/i);
    const me = await raw('GET', '/tasks/api/auth/me', { cookie: set.split(';')[0] });
    expect(me.status).toBe(200);
    expect(((await me.json()) as any).user.name).toBe('Mo Unt');
  });

  it('a signed-out visitor is sent to the sign-in page under /tasks, and every page carries <base href>', async () => {
    const res = await raw('GET', '/tasks/w/abc/home?x=1', { headers: { Accept: 'text/html' } });
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe(`/tasks/login?next=${encodeURIComponent('/w/abc/home?x=1')}`);
    const page = await raw('GET', '/tasks/login', { headers: { Accept: 'text/html' } });
    expect(page.status).toBe(200);
    expect(await page.text()).toContain('<head><base href="/tasks/">');
    const atRoot = await raw('GET', '/login', { headers: { Accept: 'text/html' } });
    expect(await atRoot.text()).toContain('<head><base href="/">');
  });

  it('invitation links use the configured app address, whichever path or host the request came in on', async () => {
    // Links come from APP_URL (production: https://bizomat.ai/tasks, which includes the mount), never from the
    // request (services/app-url.ts). Here APP_URL is http://example.com, so both give http://example.com/invite/...
    const owner = await signup('Owner');
    const res = await raw('POST', `/tasks/api/workspaces/${owner.workspaceId}/invitations`, {
      body: { email: uniqueEmail('invitee'), role: 'member' }, cookie: owner.cookie, csrf: owner.csrf,
    });
    expect(res.status).toBe(201);
    expect(((await res.json()) as any).inviteUrl).toMatch(new RegExp(`^${ORIGIN}/invite/`));
    const atRoot = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: uniqueEmail('invitee'), role: 'member' });
    expect(atRoot.inviteUrl).toMatch(new RegExp(`^${ORIGIN}/invite/`));
  });
});

describe('mount helpers', () => {
  it('root paths the app writes get the mount; absolute ones, other hosts and a WebSocket upgrade do not', () => {
    expect(addBase('/login?next=%2F', '/tasks')).toBe('/tasks/login?next=%2F');
    expect(addBase('/', '/tasks')).toBe('/tasks/');
    expect(addBase('/tasks/x', '/tasks')).toBe('/tasks/x');
    expect(addBase('//evil.example/x', '/tasks')).toBe('//evil.example/x');
    expect(addBase('https://accounts.google.com/o/oauth2', '/tasks')).toBe('https://accounts.google.com/o/oauth2');
    const res = new Response(null, { status: 302, headers: [['Location', '/settings/security?linked=1'], ['Set-Cookie', 'a=1; Path=/; HttpOnly'], ['Set-Cookie', 'b=2; Path=/api/auth/oauth; Max-Age=600']] });
    const out = remount(res, '/tasks');
    expect(out.headers.get('Location')).toBe('/tasks/settings/security?linked=1');
    // Each cookie is written for every path the app is served under (Project Management, the CRM and Finance share the
    // session), the request's own first; nothing at the root of the host, so the website never receives it.
    expect(out.headers.getSetCookie()).toEqual([
      'a=1; Path=/tasks; HttpOnly',
      'a=1; Path=/crm; HttpOnly',
      'a=1; Path=/finance; HttpOnly',
      'b=2; Path=/tasks/api/auth/oauth; Max-Age=600',
      'b=2; Path=/crm/api/auth/oauth; Max-Age=600',
      'b=2; Path=/finance/api/auth/oauth; Max-Age=600',
    ]);
    expect(remount(res, '/crm').headers.getSetCookie()[0]).toBe('a=1; Path=/crm; HttpOnly');
    expect(remount(res, '/finance').headers.getSetCookie()[0]).toBe('a=1; Path=/finance; HttpOnly');
    expect(addBase('/crm/o/1', '/tasks')).toBe('/crm/o/1');
    expect(remount(res, '')).toBe(res);
  });

  it('with CANONICAL_URL, a page on another host answers 301 there; the API, files and the canonical host stay', () => {
    const env = { CANONICAL_URL: 'https://bizomat.ai/tasks' };
    const page = (u: string, init: RequestInit = {}) => canonicalRedirect(new Request(u, { headers: { Accept: 'text/html' }, ...init }), env);
    expect(page('https://work.kevos.com/w/1/boards?x=1')?.headers.get('Location')).toBe('https://bizomat.ai/tasks/w/1/boards?x=1');
    expect(page('https://work.kevos.com/')?.headers.get('Location')).toBe('https://bizomat.ai/tasks/');
    expect(page('https://work.kevos.com/w/1')?.status).toBe(301);
    expect(page('https://work.kevos.com/api/health')).toBeNull();
    expect(page('https://work.kevos.com/login', { method: 'POST' })).toBeNull();
    expect(canonicalRedirect(new Request('https://work.kevos.com/assets/index.js'), env)).toBeNull();
    expect(page('https://bizomat.ai/w/1')).toBeNull();
    expect(canonicalRedirect(new Request('https://work.kevos.com/w/1', { headers: { Accept: 'text/html' } }), {})).toBeNull();
  });
});
