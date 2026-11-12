// Links in emails come from the configured app address only (services/app-url.ts), never from the request's host;
// invitation links are https://<app>/invite/<token>; and the link checker follows Brevo's tracking redirects.

import { SELF, env } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import { addMember, createBoard, signup, uniqueEmail } from './helpers';
import { AppUrlError, appBase, appLink, appUrl, appUrlProblem, inviteUrl, verifyEmailUrl } from '../src/worker/services/app-url';
import { BrevoProvider, setEmailProviderForTests, type EmailProvider, type OutgoingEmail } from '../src/worker/services/email/provider';
import { renderEmail } from '../src/worker/services/email/templates';
import { processOutbox } from '../src/worker/services/email/outbox';
import { checkEmailLink, linkHostAllowed, maskUrl } from '../src/worker/services/email/link-check';

class FakeProvider implements EmailProvider {
  readonly name = 'fake';
  sent: OutgoingEmail[] = [];
  async send(m: OutgoingEmail) {
    this.sent.push(m);
    return { ok: true as const, messageId: `<links${this.sent.length}.${crypto.randomUUID()}@test>` };
  }
}

afterEach(() => setEmailProviderForTests(null));

const PROD = { ENVIRONMENT: 'production', APP_URL: 'https://bizomat.ai/tasks', CANONICAL_URL: 'https://bizomat.ai/tasks' };
const hrefs = (html: string) => Array.from(html.matchAll(/href="([^"]+)"/g), (m) => m[1].replace(/&amp;/g, '&'));

describe('the app address (one builder for every email link)', () => {
  it('builds production invitation links on the canonical address', () => {
    expect(appBase(PROD)).toEqual({ origin: 'https://bizomat.ai', path: '/tasks', href: 'https://bizomat.ai/tasks' });
    expect(inviteUrl(PROD, 'k-EXAMPLE_TOKEN')).toBe('https://bizomat.ai/tasks/invite/k-EXAMPLE_TOKEN');
    expect(inviteUrl({ ...PROD, APP_URL: 'https://bizomat.ai/tasks/' }, 'abc')).toBe('https://bizomat.ai/tasks/invite/abc');
    expect(verifyEmailUrl(PROD, 'abc')).toBe('https://bizomat.ai/tasks/verify-email?token=abc');
    expect(appLink(PROD, '/w/ws1/boards/b1?item=i1')).toBe('https://bizomat.ai/tasks/w/ws1/boards/b1?item=i1');
    expect(appUrl(PROD)).toBe('https://bizomat.ai/tasks/');
    // APP_BASE_URL, when set, is the address used.
    expect(inviteUrl({ ...PROD, APP_BASE_URL: 'https://bizomat.ai/tasks' }, 'x')).toBe('https://bizomat.ai/tasks/invite/x');
  });

  it('allows a local development address', () => {
    expect(inviteUrl({ ENVIRONMENT: 'development', APP_URL: 'http://localhost:8787' }, 'abc')).toBe('http://localhost:8787/invite/abc');
    expect(inviteUrl({ ENVIRONMENT: 'test', APP_URL: 'http://example.com' }, 'abc')).toBe('http://example.com/invite/abc');
  });

  it('encodes a token as one path segment, exactly once', () => {
    const odd = 'a b/c?d%e#f';
    const url = inviteUrl(PROD, odd);
    expect(url).toBe('https://bizomat.ai/tasks/invite/a%20b%2Fc%3Fd%25e%23f');
    expect(decodeURIComponent(new URL(url).pathname.split('/').pop()!)).toBe(odd);
    // Real tokens (base64url) need no encoding at all.
    expect(inviteUrl(PROD, 'Ab9_-xyz')).toBe('https://bizomat.ai/tasks/invite/Ab9_-xyz');
    expect(() => inviteUrl(PROD, '')).toThrow(AppUrlError);
    expect(() => inviteUrl(PROD, '..')).toThrow(AppUrlError);
  });

  it('refuses configurations that would give wrong links in production', () => {
    expect(appUrlProblem(PROD)).toBeNull();
    expect(appUrlProblem({ ENVIRONMENT: 'production' })).toMatch(/not set/);
    expect(appUrlProblem({ ENVIRONMENT: 'production', APP_URL: 'not a url' })).toMatch(/not a URL/);
    expect(appUrlProblem({ ...PROD, APP_URL: 'http://bizomat.ai/tasks', CANONICAL_URL: '' })).toMatch(/https/);
    expect(appUrlProblem({ ENVIRONMENT: 'production', APP_URL: 'https://localhost:3000' })).toMatch(/public host/);
    expect(appUrlProblem({ ENVIRONMENT: 'production', APP_URL: 'https://10.0.0.5/tasks' })).toMatch(/public host/);
    expect(appUrlProblem({ ENVIRONMENT: 'production', APP_URL: 'https://bizomat.ai/tasks?x=1' })).toMatch(/query/);
    expect(appUrlProblem({ ENVIRONMENT: 'production', APP_URL: 'https://user:pw@bizomat.ai/tasks' })).toMatch(/password/);
    // Not the canonical address (www, a tracking host, a missing /tasks): refused, not silently used.
    expect(appUrlProblem({ ...PROD, APP_BASE_URL: 'https://www.bizomat.ai/tasks' })).toMatch(/differs from CANONICAL_URL/);
    expect(appUrlProblem({ ...PROD, APP_BASE_URL: 'https://r.www.bizomat.ai/tasks' })).toMatch(/differs from CANONICAL_URL/);
    expect(appUrlProblem({ ...PROD, APP_BASE_URL: 'https://bizomat.ai' })).toMatch(/differs from CANONICAL_URL/);
    // Links to other sites are never put in emails.
    expect(() => appLink(PROD, 'https://www.bizomat.ai/tasks/x')).toThrow(AppUrlError);
    expect(() => appLink(PROD, 'https://evil.example/tasks/x')).toThrow(AppUrlError);
    expect(appLink(PROD, 'https://bizomat.ai/tasks/w/1')).toBe('https://bizomat.ai/tasks/w/1');
  });
});

describe('invitation emails', () => {
  it('use the configured address even when the request arrives on another host', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const owner = await signup('Owner');
    const email = uniqueEmail('invitee');
    // The request comes in on www.example.org (an alias, a preview, a forged Host header).
    const res = await SELF.fetch(`http://www.example.org/api/workspaces/${owner.workspaceId}/invitations`, {
      method: 'POST',
      headers: { Origin: 'http://example.com', Cookie: owner.cookie, 'X-CSRF-Token': owner.csrf, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role: 'member' }),
    });
    expect(res.status).toBe(201);
    const inv = await res.json<{ inviteUrl: string; emailDelivery: string }>();
    expect(inv.inviteUrl).toMatch(/^http:\/\/example\.com\/invite\/[A-Za-z0-9_-]{20,}$/);
    expect(inv.inviteUrl).not.toContain('www.example.org');
    await processOutbox(env);
    const msg = fake.sent.find((m) => m.to.email === email)!;
    // The HTML button and its copy-this-address link, and the plain-text part, all carry the same original URL.
    expect(hrefs(msg.html).filter((h) => h.includes('/invite/'))).toEqual([inv.inviteUrl, inv.inviteUrl]);
    expect(msg.html).not.toContain('&amp;amp;');
    expect(msg.text).toContain(`Accept invitation: ${inv.inviteUrl}`);
    expect(msg.text).not.toMatch(/%25|www\.example\.org/);
    // Resending makes a new link on the same address.
    const list = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/invitations`);
    const id = list.find((i: any) => i.email === email).id;
    const again = await SELF.fetch(`http://another.example/api/workspaces/${owner.workspaceId}/invitations/${id}/resend`, {
      method: 'POST',
      headers: { Origin: 'http://example.com', Cookie: owner.cookie, 'X-CSRF-Token': owner.csrf, 'Content-Type': 'application/json' },
      body: '{}',
    });
    expect(again.status).toBe(200);
    expect((await again.json<{ inviteUrl: string }>()).inviteUrl).toMatch(/^http:\/\/example\.com\/invite\//);
  });

  it('the invitation page is public, and opening it never accepts the invitation', async () => {
    const owner = await signup('Owner');
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: uniqueEmail('x'), role: 'member' });
    const path = new URL(inv.inviteUrl).pathname;
    const page = await SELF.fetch(`http://example.com${path}`, { headers: { Accept: 'text/html' }, redirect: 'manual' });
    expect(page.status).toBe(200);
    expect(await page.text()).toContain('<div id="root">');
    const token = path.split('/').pop()!;
    const details = await SELF.fetch(`http://example.com/api/auth/invitations/${token}`);
    expect(details.status).toBe(200);
    expect((await details.json<{ status: string }>()).status).toBe('pending');
    const row = await env.DB.prepare('SELECT accepted_at FROM invitations WHERE id = ?').bind(inv.id).first<{ accepted_at: number | null }>();
    expect(row!.accepted_at).toBeNull();
    expect((await SELF.fetch('http://example.com/api/auth/invitations/not-a-real-token-123')).status).toBe(404);
    // The link-check address used by test emails is a public page too.
    expect((await SELF.fetch('http://example.com/invite/link-check', { headers: { Accept: 'text/html' }, redirect: 'manual' })).status).toBe(200);
  });
});

describe('the Brevo request', () => {
  it('sends the original invitation URL in htmlContent and textContent, with only documented fields', async () => {
    const url = inviteUrl(PROD, 'k-EXAMPLE_TOKEN');
    const r = renderEmail({ template: 'invitation', organisation: 'Example Org', inviter: 'Alex', role: 'Member', expires: '19 Nov 2026', url, existingUser: false });
    let sent: { url: string; body: Record<string, unknown> } | null = null;
    const fakeFetch = (async (u: string, init: RequestInit) => {
      sent = { url: u, body: JSON.parse(String(init.body)) };
      return new Response(JSON.stringify({ messageId: '<m@test>' }), { status: 201 });
    }) as unknown as typeof fetch;
    await new BrevoProvider('test-key', false, fakeFetch).send({ to: { email: 'person@example.com' }, from: { email: 'notifications@bizomat.ai', name: 'BIZOMAT' }, subject: r.subject, html: r.html, text: r.text, tags: ['invitation'], correlationId: 'o1' });
    expect(sent!.url).toBe('https://api.brevo.com/v3/smtp/email');
    // Only documented fields of POST /v3/smtp/email (no invented tracking switches).
    const documented = ['sender', 'to', 'replyTo', 'subject', 'htmlContent', 'textContent', 'tags', 'headers'];
    expect(Object.keys(sent!.body).filter((k) => !documented.includes(k))).toEqual([]);
    expect(hrefs(sent!.body.htmlContent as string).filter((h) => h.includes('/invite/'))).toEqual([url, url]);
    expect(sent!.body.textContent).toContain(`Accept invitation: ${url}`);
    expect(JSON.stringify(sent!.body)).not.toMatch(/www\.bizomat|r\.www|trackClicks|tracking/i);
  });
});

describe('other email links', () => {
  it('task assignments, email confirmation and test emails link to the app address', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const owner = await signup('Owner');
    const member = await signup('Member');
    await addMember(owner, member, 'member');
    const b = await createBoard(owner, 'Links');
    const person = await owner.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Owner', type: 'person' });
    await owner.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Wire the panel', groupId: b.groups[0].id, values: { [person.id]: member.userId } });
    await owner.json('POST', `/api/workspaces/${owner.workspaceId}/email/test`, {});
    await processOutbox(env);
    const toMember = fake.sent.filter((m) => m.to.email === member.email);
    expect(toMember.length).toBeGreaterThan(0);
    const test = fake.sent.find((m) => m.to.email === owner.email && m.subject === 'BIZOMAT test email')!;
    expect(hrefs(test.html)).toContain('http://example.com/invite/link-check');
    for (const m of [...toMember, test]) {
      for (const h of hrefs(m.html)) {
        if (h.startsWith('mailto:') || h.startsWith('https://bizomat.ai/contact')) continue;
        expect(h, m.subject).toMatch(/^http:\/\/example\.com\//);
      }
    }
    // A sign-up confirmation link (email is on in this test) points to /verify-email on the app address.
    const email = uniqueEmail('new');
    await SELF.fetch('http://example.com/api/auth/signup', { method: 'POST', headers: { Origin: 'http://example.com', 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name: 'New', password: 'correct-horse-42!' }) });
    const confirm = fake.sent.find((m) => m.to.email === email)!;
    expect(hrefs(confirm.html)[0]).toMatch(/^http:\/\/example\.com\/verify-email\?token=[A-Za-z0-9_-]+$/);
  });
});

describe('checking a link from a received email (Brevo click tracking)', () => {
  const APP = { appHost: 'bizomat.ai', expected: 'https://bizomat.ai/tasks/' };
  const routes = (map: Record<string, { status: number; location?: string } | Error>): typeof fetch =>
    (async (url: string | URL | Request) => {
      const r = map[String(url)];
      if (!r) throw new Error(`unexpected fetch ${String(url)}`);
      if (r instanceof Error) throw r;
      return new Response(null, { status: r.status, headers: r.location ? { location: r.location } : {} });
    }) as typeof fetch;
  const found = async () => ({ resolves: true, detail: 'CNAME r.brevolinks.com' });

  it('follows a working tracking redirect to the invitation page', async () => {
    const r = await checkEmailLink('https://r.mail.bizomat.ai/tr/cl/abc123', {
      ...APP,
      resolve: found,
      fetchImpl: routes({ 'https://r.mail.bizomat.ai/tr/cl/abc123': { status: 302, location: 'https://bizomat.ai/tasks/invite/SECRETTOKEN' }, 'https://bizomat.ai/tasks/invite/SECRETTOKEN': { status: 200 } }),
    });
    expect(r.ok).toBe(true);
    expect(r.finalUrl).toBe('https://bizomat.ai/tasks/invite/••••••');
    expect(JSON.stringify(r)).not.toContain('SECRETTOKEN');
    expect(r.verdict).toMatch(/email links work/);
  });

  it('explains a tracking host missing from DNS', async () => {
    const r = await checkEmailLink('https://r.www.bizomat.ai/tr/cl/abc', {
      ...APP,
      resolve: async () => ({ resolves: false, detail: 'The name does not exist (NXDOMAIN)' }),
      fetchImpl: routes({ 'https://r.www.bizomat.ai/tr/cl/abc': Object.assign(new Error('fetch failed'), { cause: new Error('getaddrinfo ENOTFOUND r.www.bizomat.ai') }) }),
    });
    expect(r.ok).toBe(false);
    expect(r.verdict).toMatch(/r\.www\.bizomat\.ai does not exist in DNS/);
    expect(r.verdict).toMatch(/CNAME/);
  });

  it('reports a certificate problem and a redirect to the wrong address', async () => {
    const tls = await checkEmailLink('https://r.www.bizomat.ai/tr/cl/abc', { ...APP, resolve: found, fetchImpl: routes({ 'https://r.www.bizomat.ai/tr/cl/abc': Object.assign(new Error('fetch failed'), { cause: new Error('certificate has expired') }) }) });
    expect(tls.ok).toBe(false);
    expect(tls.verdict).toMatch(/certificate/);
    const wrong = await checkEmailLink('https://r.brevolinks.com/tr/cl/x', { ...APP, resolve: found, fetchImpl: routes({ 'https://r.brevolinks.com/tr/cl/x': { status: 302, location: 'https://www.bizomat.ai/tasks/invite/T0K' }, 'https://www.bizomat.ai/tasks/invite/T0K': { status: 404 } }) });
    expect(wrong.ok).toBe(false);
    expect(wrong.verdict).toMatch(/ends at https:\/\/www\.bizomat\.ai\/tasks\/invite\/••••••/);
  });

  it('only checks links on the app domain or Brevo, and masks tokens', async () => {
    expect(linkHostAllowed('r.www.bizomat.ai', 'bizomat.ai')).toBe(true);
    expect(linkHostAllowed('r.brevolinks.com', 'bizomat.ai')).toBe(true);
    expect(linkHostAllowed('abc.r.bh.d.sendibt3.com', 'bizomat.ai')).toBe(true);
    expect(linkHostAllowed('169.254.169.254', 'bizomat.ai')).toBe(false);
    expect(linkHostAllowed('evil.example', 'bizomat.ai')).toBe(false);
    const r = await checkEmailLink('https://evil.example/x', { ...APP, resolve: found, fetchImpl: routes({}) });
    expect(r.ok).toBe(false);
    expect(r.hops).toEqual([]);
    expect(maskUrl('https://bizomat.ai/tasks/verify-email?token=abc')).toBe('https://bizomat.ai/tasks/verify-email?token=••••••');
  });
});
