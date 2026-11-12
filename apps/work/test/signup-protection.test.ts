// Sign-up protection (12 Nov 2026): only addresses that can receive mail create accounts and sign in.

import { env } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import { PASSWORD, login, raw, signup, signupWith, uniqueEmail, type Client } from './helpers';
import { setEmailProviderForTests, type EmailProvider, type OutgoingEmail } from '../src/worker/services/email/provider';
import { dohMx, savePolicy, setMxResolverForTests, DEFAULT_POLICY, type MxResult } from '../src/worker/services/signup-guard';

class FakeProvider implements EmailProvider {
  readonly name = 'fake';
  sent: OutgoingEmail[] = [];
  async send(m: OutgoingEmail) {
    this.sent.push(m);
    return { ok: true as const, messageId: `<sp${this.sent.length}.${crypto.randomUUID()}@test>` };
  }
}

async function founder(): Promise<Client> {
  const c = await signup('Founder');
  await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'founder', 'test', ?)").bind(c.userId, Date.now()).run();
  return c;
}

const signupRaw = (email: string, extra: Record<string, unknown> = {}) => raw('POST', '/api/auth/signup', { body: { email, name: 'New Person', password: PASSWORD, ...extra } });
const linkFrom = (m: OutgoingEmail) => /\/verify-email\?token=([A-Za-z0-9_-]+)/.exec(m.text)![1];

afterEach(async () => {
  setEmailProviderForTests(null);
  setMxResolverForTests(null);
  await env.DB.prepare("DELETE FROM system_kv WHERE key = 'signup_protection'").run();
});

describe('addresses that cannot receive mail are refused', () => {
  it('refuses disposable services and their subdomains, and logs only the domain', async () => {
    for (const email of [`x${Date.now()}@mailinator.com`, `y${Date.now()}@eu.guerrillamail.com`, `z${Date.now()}@YOPMAIL.com`]) {
      const res = await signupRaw(email);
      expect(res.status, email).toBe(400);
      const j = await res.json<{ error: string; details: { code: string; reason: string } }>();
      expect(j.details).toMatchObject({ code: 'EMAIL_NOT_ALLOWED', reason: 'disposable' });
      expect(j.error).toMatch(/disposable/);
    }
    const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM users WHERE email LIKE '%mailinator.com' OR email LIKE '%guerrillamail.com' OR email LIKE '%yopmail.com'").first<{ n: number }>();
    expect(n!.n).toBe(0);
    const logged = await env.DB.prepare("SELECT metadata_json FROM audit_log WHERE action = 'signup.refused' ORDER BY created_at DESC LIMIT 3").all<{ metadata_json: string }>();
    for (const r of logged.results) {
      expect(r.metadata_json).not.toContain('@');
      expect(JSON.parse(r.metadata_json)).toMatchObject({ where: 'signup', reason: 'disposable' });
    }
  });

  it('refuses domains without mail servers or that do not exist, and lets through when DNS cannot answer', async () => {
    const answers: Record<string, MxResult> = { 'nomail.example.net': 'no_mx', 'nullmx.example.net': 'null_mx', 'gmial.example.net': 'nxdomain', 'dnsdown.example.net': 'unknown', 'real.example.net': 'ok' };
    setMxResolverForTests(async (d) => answers[d] ?? 'ok');
    expect((await signupRaw(`a${Date.now()}@nomail.example.net`)).status).toBe(400);
    expect((await signupRaw(`b${Date.now()}@nullmx.example.net`)).status).toBe(400);
    const nx = await signupRaw(`c${Date.now()}@gmial.example.net`);
    expect(nx.status).toBe(400);
    expect((await nx.json<{ error: string }>()).error).toMatch(/does not exist/);
    expect((await signupRaw(`d${Date.now()}@dnsdown.example.net`)).status).toBe(201);
    expect((await signupRaw(`e${Date.now()}@real.example.net`)).status).toBe(201);
  });

  it('applies the founder’s blocked and always-allowed domains', async () => {
    await savePolicy(env.DB, { ...DEFAULT_POLICY, blockedDomains: ['spam.example.org'], allowedDomains: ['mailinator.com'] });
    const blocked = await signupRaw(`a${Date.now()}@mx.spam.example.org`);
    expect(blocked.status).toBe(400);
    expect((await blocked.json<{ details: { reason: string } }>()).details.reason).toBe('blocked_domain');
    expect((await signupRaw(`b${Date.now()}@mailinator.com`)).status).toBe(201);
  });

  it('refuses the robot that fills the hidden field', async () => {
    const res = await signupRaw(uniqueEmail('bot'), { website: 'http://spam.example' });
    expect(res.status).toBe(400);
    const row = await env.DB.prepare("SELECT metadata_json FROM audit_log WHERE action = 'signup.refused' ORDER BY created_at DESC LIMIT 1").first<{ metadata_json: string }>();
    expect(JSON.parse(row!.metadata_json).reason).toBe('bot');
  });

  it('stops existing accounts on a newly blocked domain from signing in, but never a platform admin', async () => {
    const f = await founder();
    const u = await signup('Later Blocked', `p${Date.now()}@later.example.org`);
    const f2 = await signup('Second founder', `f${Date.now()}@later.example.org`);
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'admin', 'test', ?)").bind(f2.userId, Date.now()).run();
    expect((await f.req('PUT', '/api/admin/signup-protection', { blockedDomains: ['later.example.org'] })).status).toBe(200);
    const res = await raw('POST', '/api/auth/login', { body: { email: u.email, password: PASSWORD } });
    expect(res.status).toBe(403);
    expect((await res.json<{ details: { code: string } }>()).details.code).toBe('EMAIL_NOT_ALLOWED');
    // A wrong password still says only "invalid", so the rule does not reveal accounts.
    expect((await raw('POST', '/api/auth/login', { body: { email: u.email, password: 'wrong-password-1!' } })).status).toBe(401);
    expect((await login(f2.email)).userId).toBe(f2.userId);
  });

  it('refuses an invitation to an address that would be refused', async () => {
    const owner = await signup('Owner');
    const res = await owner.req('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: `x${Date.now()}@10minutemail.com`, role: 'member' });
    expect(res.status).toBe(400);
  });
});

describe('new accounts confirm their address before signing in (when email is connected)', () => {
  it('without email connected, sign-up works as before (nobody could receive the link)', async () => {
    const res = await signupRaw(uniqueEmail('noemail'));
    expect(res.status).toBe(201);
    expect(res.headers.get('Set-Cookie')).toContain('workos_sid=');
  });

  it('sends a link, refuses sign-in until it is opened, and the link works once', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const email = uniqueEmail('confirm');
    const res = await signupRaw(email);
    expect(res.status).toBe(202);
    expect(await res.json()).toEqual({ verificationRequired: true, email });
    expect(res.headers.get('Set-Cookie') ?? '').not.toContain('workos_sid=');
    const msg = fake.sent.find((m) => m.to.email === email)!;
    expect(msg.subject).toBe('Confirm your email address for BIZOMAT');
    const token = linkFrom(msg);
    // The link's body is not kept in the outbox after sending.
    const row = await env.DB.prepare("SELECT html, text FROM email_outbox WHERE to_email = ? AND template = 'verify_email'").bind(email).first<{ html: string; text: string }>();
    expect(row).toMatchObject({ html: '', text: '' });
    // Only the hash of the token is stored.
    expect(await env.DB.prepare('SELECT 1 FROM email_verifications WHERE token_hash = ?').bind(token).first()).toBeNull();

    const before = await raw('POST', '/api/auth/login', { body: { email, password: PASSWORD } });
    expect(before.status).toBe(403);
    const j = await before.json<{ details: { code: string; email: string } }>();
    expect(j.details).toMatchObject({ code: 'EMAIL_UNVERIFIED', email });

    const ok = await raw('POST', '/api/auth/verify-email', { body: { token } });
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ ok: true, email });
    expect((await login(email)).email).toBe(email);
    // Opening it again is harmless.
    expect((await raw('POST', '/api/auth/verify-email', { body: { token } })).status).toBe(200);
    expect((await raw('POST', '/api/auth/verify-email', { body: { token: 'not-a-real-token-123' } })).status).toBe(400);
  });

  it('an expired link does not confirm; resend answers the same for any address and sends at most one link a few minutes', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const email = uniqueEmail('expire');
    expect((await signupRaw(email)).status).toBe(202);
    const token = linkFrom(fake.sent.find((m) => m.to.email === email)!);
    await env.DB.prepare('UPDATE email_verifications SET expires_at = 1 WHERE user_id = (SELECT id FROM users WHERE email = ?)').bind(email).run();
    const expired = await raw('POST', '/api/auth/verify-email', { body: { token } });
    expect(expired.status).toBe(400);
    expect((await expired.json<{ error: string }>()).error).toMatch(/expired/);
    const sentBefore = fake.sent.length;
    expect((await raw('POST', '/api/auth/verify-email/resend', { body: { email } })).status).toBe(200);
    expect((await raw('POST', '/api/auth/verify-email/resend', { body: { email: uniqueEmail('nobody') } })).status).toBe(200);
    // The sign-up link went out under two minutes ago, so no new one yet.
    expect(fake.sent.length).toBe(sentBefore);
    await env.DB.prepare('UPDATE email_verifications SET created_at = created_at - 600000 WHERE user_id = (SELECT id FROM users WHERE email = ?)').bind(email).run();
    expect((await raw('POST', '/api/auth/verify-email/resend', { body: { email } })).status).toBe(200);
    expect(fake.sent.filter((m) => m.to.email === email)).toHaveLength(2);
  });

  it('an invited person is confirmed by the invitation', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const owner = await signup('Inviter');
    const email = uniqueEmail('invited');
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email, role: 'member' });
    const c = await signupWith('Invited Person', email, inv.inviteUrl.split('/invite/')[1]);
    expect(c.workspaceId).toBe(owner.workspaceId);
    expect((await login(email)).userId).toBe(c.userId);
  });

  it('accounts from before the change are not asked to confirm', async () => {
    const old = await signup('Existing');
    // As migration 0007 did for every account that existed before it.
    await env.DB.prepare('UPDATE users SET email_verified_at = created_at WHERE id = ?').bind(old.userId).run();
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    expect((await login(old.email)).userId).toBe(old.userId);
    // An account made while email was not connected (so not confirmed) is asked once email is.
    await env.DB.prepare('UPDATE users SET email_verified_at = NULL WHERE id = ?').bind(old.userId).run();
    expect((await raw('POST', '/api/auth/login', { body: { email: old.email, password: PASSWORD } })).status).toBe(403);
    expect(fake.sent.some((m) => m.to.email === old.email && m.subject.startsWith('Confirm'))).toBe(true);
  });

  it('the founder can switch confirmation off, and confirm an account by hand', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const f = await founder();
    const email = uniqueEmail('manual');
    expect((await signupRaw(email)).status).toBe(202);
    const id = (await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first<{ id: string }>())!.id;
    const page = await f.json('GET', '/api/admin/signup-protection');
    expect(page.confirmationActive).toBe(true);
    expect(page.unconfirmed.accounts.map((a: { email: string }) => a.email)).toContain(email);
    expect((await f.req('POST', `/api/admin/users/${id}/confirm-email`, {})).status).toBe(200);
    expect((await login(email)).userId).toBe(id);
    await f.json('PUT', '/api/admin/signup-protection', { requireVerification: false });
    expect((await signupRaw(uniqueEmail('off'))).status).toBe(201);
  });
});

describe('founder console > sign-up protection', () => {
  it('is hidden from non-admins; only the founder changes it; domains are checked', async () => {
    const u = await signup('Ordinary');
    expect((await u.req('GET', '/api/admin/signup-protection')).status).toBe(404);
    expect((await u.req('PUT', '/api/admin/signup-protection', { requireMx: false })).status).toBe(404);
    const admin = await signup('Admin');
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'admin', 'test', ?)").bind(admin.userId, Date.now()).run();
    expect((await admin.json('GET', '/api/admin/signup-protection')).canChange).toBe(false);
    expect((await admin.req('PUT', '/api/admin/signup-protection', { requireMx: false })).status).toBe(403);
    const f = await founder();
    expect((await f.req('PUT', '/api/admin/signup-protection', { blockedDomains: ['not a domain!'] })).status).toBe(400);
    const r = await f.json('PUT', '/api/admin/signup-protection', { blockedDomains: ['@Spam.Example.ORG.', 'spam.example.org', ''], allowedDomains: ['partner.example.com'] });
    expect(r.policy.blockedDomains).toEqual(['spam.example.org']);
    const t = await f.json('POST', '/api/admin/signup-protection/check', { email: 'a@trashmail.com' });
    expect(t).toMatchObject({ ok: false, reason: 'disposable' });
    const page = await f.json('GET', '/api/admin/signup-protection');
    expect(page.refusals.last30Days).toBeGreaterThanOrEqual(0);
    expect(page.policy.allowedDomains).toEqual(['partner.example.com']);
  });
});

describe('dohMx', () => {
  const answer = (body: unknown, status = 200): typeof fetch => (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;
  it('reads DNS-over-HTTPS answers', async () => {
    expect(await dohMx('a.example', answer({ Status: 0, Answer: [{ type: 15, data: '10 mx1.a.example.' }] }))).toBe('ok');
    expect(await dohMx('a.example', answer({ Status: 0, Answer: [{ type: 15, data: '0 .' }] }))).toBe('null_mx');
    expect(await dohMx('a.example', answer({ Status: 0 }))).toBe('no_mx');
    expect(await dohMx('a.example', answer({ Status: 3 }))).toBe('nxdomain');
    expect(await dohMx('a.example', answer({ Status: 2 }))).toBe('unknown');
    expect(await dohMx('a.example', answer({}, 500))).toBe('unknown');
    expect(await dohMx('a.example', (async () => { throw new Error('offline'); }) as unknown as typeof fetch)).toBe('unknown');
  });
});
