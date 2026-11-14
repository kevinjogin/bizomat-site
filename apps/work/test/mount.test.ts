// Project Management under a path of another site's address (https://bizomat.ai/tasks): the BIZOMAT website hands
// /tasks/... to this Worker unchanged; the app answers there as it does at the root of its own host.
import { describe, expect, it } from 'vitest';
import { ORIGIN, PASSWORD, raw, signup, uniqueEmail } from './helpers';
import { addBase, appOf, canonicalRedirect, mountOf, remount, suiteRedirect, topOf } from '../src/worker/mount';

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

  it('a signed-out visitor is sent to the sign-in page inside the System, and every page carries <base href>', async () => {
    // One system: Project Management's pages open inside BIZOMAT System.
    const old = await raw('GET', '/tasks/w/abc/home?x=1', { headers: { Accept: 'text/html' } });
    expect(old.status).toBe(302);
    expect(old.headers.get('Location')).toBe('/system/tasks/w/abc/home?x=1');
    const res = await raw('GET', '/system/tasks/w/abc/home?x=1', { headers: { Accept: 'text/html' } });
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe(`/tasks/api/app-carry?to=${encodeURIComponent('/system/tasks/w/abc/home?x=1')}`);
    const again = await raw('GET', '/system/tasks/w/abc/home?x=1', { headers: { Accept: 'text/html', Cookie: 'sys_carry=1' } });
    expect(again.headers.get('Location')).toBe(`/system/tasks/login?next=${encodeURIComponent('/w/abc/home?x=1')}`);
    const page = await raw('GET', '/system/tasks/login', { headers: { Accept: 'text/html' } });
    expect(page.status).toBe(200);
    expect(await page.text()).toContain('<head><base href="/system/tasks/">');
    // The website's Sign in (Project Management's sign-in page without a next) opens the System's own.
    expect((await raw('GET', '/tasks/login', { headers: { Accept: 'text/html' } })).headers.get('Location')).toBe('/system/login');
    expect((await raw('GET', '/tasks/login?next=%2Fw%2Fx', { headers: { Accept: 'text/html' } })).headers.get('Location')).toBe('/system/tasks/login?next=%2Fw%2Fx');
    // The API and files stay where they are.
    expect((await raw('GET', '/tasks/api/health', { headers: { Accept: 'text/html' } })).status).toBe(200);
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
    // Each cookie is written for every path the app is served under (Project Management, the CRM, Finance, the company
    // area and BIZOMAT System share the session), the request's own first; nothing at the root of the host, so the website never receives it.
    expect(out.headers.getSetCookie()).toEqual([
      'a=1; Path=/tasks; HttpOnly',
      'a=1; Path=/crm; HttpOnly',
      'a=1; Path=/finance; HttpOnly',
      'a=1; Path=/company; HttpOnly',
      'a=1; Path=/system; HttpOnly',
      'b=2; Path=/tasks/api/auth/oauth; Max-Age=600',
      'b=2; Path=/crm/api/auth/oauth; Max-Age=600',
      'b=2; Path=/finance/api/auth/oauth; Max-Age=600',
      'b=2; Path=/company/api/auth/oauth; Max-Age=600',
      'b=2; Path=/system/api/auth/oauth; Max-Age=600',
    ]);
    expect(remount(res, '/company').headers.getSetCookie()[0]).toBe('a=1; Path=/company; HttpOnly');
    expect(remount(res, '/crm').headers.getSetCookie()[0]).toBe('a=1; Path=/crm; HttpOnly');
    expect(remount(res, '/finance').headers.getSetCookie()[0]).toBe('a=1; Path=/finance; HttpOnly');
    expect(remount(res, '/system').headers.getSetCookie()[0]).toBe('a=1; Path=/system; HttpOnly');
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

describe('one system: every tool inside /system', () => {
  const page = (path: string, extra: RequestInit = {}) => new Request(`http://example.com${path}`, { headers: { Accept: 'text/html' }, ...extra });

  it('serves each tool under /system/<tool> as well as at its own address', () => {
    const m = (p: string) => mountOf(new URL(`http://example.com${p}`));
    expect(m('/system/crm/o/x')).toBe('/system/crm');
    expect(m('/system/tasks')).toBe('/system/tasks');
    expect(m('/system/finance/api/fin/orgs')).toBe('/system/finance');
    expect(m('/system/company/')).toBe('/system/company');
    expect(m('/system/c/abc/home')).toBe('/system');
    expect(m('/system/crmx')).toBe('/system');
    expect(m('/crm/o/x')).toBe('/crm');
    expect(m('/system-preview/')).toBe('');
    expect(appOf('/system/crm')).toBe('/crm');
    expect(appOf('/system')).toBe('/system');
    expect(appOf('/finance')).toBe('/finance');
    expect(topOf('/system/finance')).toBe('/system');
    expect(topOf('/tasks')).toBe('/tasks');
  });

  it('writes cookies for /system (and the other paths), never for /system/<tool>; sends Location under the tool', () => {
    const res = new Response(null, { status: 302, headers: [['Location', '/login?next=%2Fo%2Fx'], ['Set-Cookie', 'a=1; Path=/; HttpOnly']] });
    const out = remount(res, '/system/crm');
    expect(out.headers.get('Location')).toBe('/system/crm/login?next=%2Fo%2Fx');
    expect(out.headers.getSetCookie()).toEqual(['a=1; Path=/system; HttpOnly', 'a=1; Path=/tasks; HttpOnly', 'a=1; Path=/crm; HttpOnly', 'a=1; Path=/finance; HttpOnly', 'a=1; Path=/company; HttpOnly']);
  });

  it('sends a page at a tool’s own address to the same page inside the System; the API, files and documents stay', () => {
    const to = (path: string, init?: RequestInit) => suiteRedirect(page(path, init), mountOf(new URL(`http://example.com${path}`)))?.headers.get('Location') ?? null;
    expect(to('/crm/o/x/deals?view=board')).toBe('/system/crm/o/x/deals?view=board');
    expect(to('/finance/o/x/invoices/1')).toBe('/system/finance/o/x/invoices/1');
    expect(to('/company/c/x/people')).toBe('/system/company/c/x/people');
    expect(to('/tasks/w/x/boards/y')).toBe('/system/tasks/w/x/boards/y');
    expect(to('/tasks')).toBe('/system/tasks/');
    expect(to('/crm/login?next=%2Fo%2Fx')).toBe('/system/crm/login?next=%2Fo%2Fx');
    // The website's Sign in and sign-up open the System's own pages.
    expect(to('/tasks/login')).toBe('/system/login');
    expect(to('/tasks/signup')).toBe('/system/signup');
    // Not pages: as they are.
    expect(to('/crm/api/crm/orgs')).toBeNull();
    expect(to('/tasks/assets/index-abc.js')).toBeNull();
    expect(to('/tasks/favicon.svg')).toBeNull();
    expect(to('/finance/view/abcdefghijklmnop')).toBeNull();
    expect(to('/system/crm/o/x')).toBeNull();
    expect(to('/system/c/x/home')).toBeNull();
    expect(to('/crm/o/x', { method: 'POST' })).toBeNull();
    expect(suiteRedirect(new Request('http://example.com/crm/o/x', { headers: { Accept: 'application/json' } }), '/crm')).toBeNull();
    expect(suiteRedirect(page('/w/x'), '')).toBeNull();
  });

  it('serves the API and the session of every tool under /system/<tool>', async () => {
    const res = await raw('POST', '/system/crm/api/auth/signup', { body: { email: uniqueEmail('suite'), name: 'Suite Person', password: PASSWORD } });
    expect(res.status).toBe(201);
    const cookies = res.headers.getSetCookie().filter((c) => c.startsWith('workos_sid='));
    expect(cookies.map((c) => /;\s*path=([^;]+)/i.exec(c)?.[1])).toEqual(['/system', '/tasks', '/crm', '/finance', '/company']);
    const cookie = cookies[0].split(';')[0];
    const csrf = ((await res.json()) as any).csrfToken;
    expect((await raw('POST', '/system/crm/api/crm/orgs', { body: { name: 'Suite Org' }, cookie, csrf })).status).toBe(201);
    expect((await raw('GET', '/system/finance/api/fin/orgs', { cookie })).status).toBe(200);
    expect((await raw('GET', '/system/tasks/api/auth/me', { cookie })).status).toBe(200);
    expect((await raw('GET', '/system/company/api/company/mine', { cookie })).status).toBe(200);
    for (const [path, base] of [['/system/tasks/w/x/home', '/system/tasks/'], ['/system/crm/o/x', '/system/crm/'], ['/system/finance/o/x', '/system/finance/'], ['/system/company/', '/system/company/']]) {
      const p = await raw('GET', path, { cookie, headers: { Accept: 'text/html' } });
      expect(p.status).toBe(200);
      expect(await p.text()).toContain(`<head><base href="${base}">`);
    }
  });
});
