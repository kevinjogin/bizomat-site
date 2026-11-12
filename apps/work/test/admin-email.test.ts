// Founder console > Email: the Brevo connection entered in the console, stored encrypted, never returned.

import { env } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import { raw, signup, type Client } from './helpers';
import { setEmailProviderForTests, type EmailProvider, type OutgoingEmail } from '../src/worker/services/email/provider';
import { checkBrevo, emailEnv, encryptSecret, invalidateEmailSettings, saveEmailSettings } from '../src/worker/services/email/settings';

// An obviously fake key in Brevo's format (test only).
const KEY = 'xkeysib-' + '0123456789abcdef'.repeat(4) + '-TESTKEY00000000Ab12';

async function platformAdmin(role: 'founder' | 'admin', name = role === 'founder' ? 'Founder' : 'Console Admin'): Promise<Client> {
  const c = await signup(name);
  await env.DB.prepare('INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, ?, ?, ?)').bind(c.userId, role, 'test', Date.now()).run();
  return c;
}

class FakeProvider implements EmailProvider {
  readonly name = 'fake';
  sent: OutgoingEmail[] = [];
  async send(m: OutgoingEmail) {
    this.sent.push(m);
    return { ok: true as const, messageId: `<console${this.sent.length}.${crypto.randomUUID()}@test>` };
  }
}

afterEach(async () => {
  setEmailProviderForTests(null);
  await env.DB.prepare("DELETE FROM system_kv WHERE key = 'email_settings'").run();
  invalidateEmailSettings();
});

describe('founder console email settings', () => {
  it('is hidden from everyone who is not a platform admin', async () => {
    expect((await raw('GET', '/api/admin/email')).status).toBe(401);
    const u = await signup('Ordinary');
    expect((await u.req('GET', '/api/admin/email')).status).toBe(404);
    expect((await u.req('PUT', '/api/admin/email', { apiKey: KEY })).status).toBe(404);
    expect((await u.req('POST', '/api/admin/email/check', {})).status).toBe(404);
    expect((await u.req('POST', '/api/admin/email/test', {})).status).toBe(404);
    expect((await u.req('POST', '/api/admin/email/webhook-token', {})).status).toBe(404);
    const row = await env.DB.prepare("SELECT value FROM system_kv WHERE key = 'email_settings'").first();
    expect(row).toBeNull();
  });

  it('saves the API key encrypted, turns email on, and never returns or logs the key', async () => {
    const f = await platformAdmin('founder');
    const before = await f.json('GET', '/api/admin/email');
    expect(before.status).toMatchObject({ provider: 'none', configured: false, canSaveSecrets: true, canChange: true });
    expect(before.settings).toMatchObject({ hasApiKey: false, apiKeySource: 'default', fromAddress: 'notifications@bizomat.ai', fromName: 'BIZOMAT' });

    expect((await f.req('PUT', '/api/admin/email', { apiKey: KEY, fromName: 'BIZOMAT', replyTo: 'Help@Example.com' })).status).toBe(200);

    const res = await f.req('GET', '/api/admin/email');
    const text = await res.text();
    expect(text).not.toContain(KEY);
    expect(text).not.toContain(KEY.slice(8, 40));
    const after = JSON.parse(text);
    expect(after.status).toMatchObject({ provider: 'brevo', configured: true, keyUnreadable: false });
    expect(after.settings).toMatchObject({ hasApiKey: true, apiKeyLast4: 'Ab12', apiKeySource: 'console', replyTo: 'help@example.com' });

    // At rest: encrypted, not the key.
    const row = await env.DB.prepare("SELECT value FROM system_kv WHERE key = 'email_settings'").first<{ value: string }>();
    expect(row!.value).not.toContain(KEY.slice(8, 40));
    expect(JSON.parse(row!.value).apiKeyEnc).toMatch(/^v1\./);
    // The server can read it back for sending.
    expect((await emailEnv(env)).BREVO_API_KEY).toBe(KEY);
    // The audit says the key was replaced, never what it is.
    const audit = await env.DB.prepare("SELECT metadata_json AS metadata FROM audit_log WHERE action = 'admin.email_settings_changed' ORDER BY created_at DESC LIMIT 1").first<{ metadata: string }>();
    expect(audit!.metadata).toContain('replaced');
    expect(audit!.metadata).not.toContain(KEY.slice(8, 40));

    // Organisation admins see email as connected too.
    const ws = await f.json('GET', `/api/workspaces/${f.workspaceId}/email`);
    expect(ws).toMatchObject({ provider: 'brevo', configured: true, replyTo: 'help@example.com' });

    // Removing the key turns email off again.
    expect((await f.req('PUT', '/api/admin/email', { apiKey: null })).status).toBe(200);
    const removed = await f.json('GET', '/api/admin/email');
    expect(removed.status.provider).toBe('none');
    expect(removed.settings.hasApiKey).toBe(false);
  });

  it('refuses an SMTP key and anything that is not a key', async () => {
    const f = await platformAdmin('founder');
    const smtp = await f.req('PUT', '/api/admin/email', { apiKey: 'xsmtpsib-' + 'a'.repeat(60) });
    expect(smtp.status).toBe(400);
    expect((await smtp.json<{ error: string }>()).error).toMatch(/SMTP key/);
    expect((await f.req('PUT', '/api/admin/email', { apiKey: 'not a key' })).status).toBe(400);
    expect((await f.req('PUT', '/api/admin/email', { fromAddress: 'nobody' })).status).toBe(400);
    expect((await f.json('GET', '/api/admin/email')).settings.hasApiKey).toBe(false);
  });

  it('lets other platform admins read the status and test, but only the founder change the connection', async () => {
    const a = await platformAdmin('admin');
    const d = await a.json('GET', '/api/admin/email');
    expect(d.status.canChange).toBe(false);
    expect((await a.req('PUT', '/api/admin/email', { apiKey: KEY })).status).toBe(403);
    expect((await a.req('POST', '/api/admin/email/webhook-token', {})).status).toBe(403);
    expect((await a.req('POST', '/api/admin/email/check', {})).status).toBe(403);
  });

  it('switching email off stops sending whatever the key', async () => {
    const f = await platformAdmin('founder');
    await f.json('PUT', '/api/admin/email', { apiKey: KEY, enabled: false });
    const d = await f.json('GET', '/api/admin/email');
    expect(d.status.provider).toBe('none');
    expect(d.settings).toMatchObject({ enabled: false, hasApiKey: true });
    await f.json('PUT', '/api/admin/email', { enabled: true });
    expect((await f.json('GET', '/api/admin/email')).status.provider).toBe('brevo');
  });

  it('sends the test email to the signed-in founder only', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const f = await platformAdmin('founder');
    const r = await f.json('POST', '/api/admin/email/test', {});
    expect(r).toMatchObject({ ok: true, status: 'sent', to: f.email });
    // (The founder's own sign-up confirmation went out too, with email switched on.)
    const tests = fake.sent.filter((m) => m.subject === 'BIZOMAT test email');
    expect(tests).toHaveLength(1);
    expect(tests[0].to.email).toBe(f.email);
    expect(fake.sent.every((m) => m.to.email === f.email)).toBe(true);
  });

  it('a saved key that this server cannot decrypt is reported, not used', async () => {
    const f = await platformAdmin('founder');
    const other = { ...env, SETTINGS_ENCRYPTION_KEY: btoa(String.fromCharCode(...new Uint8Array(32).fill(9))) };
    await saveEmailSettings(env.DB, { apiKeyEnc: await encryptSecret(other, KEY), apiKeyLast4: 'Ab12' });
    invalidateEmailSettings();
    const d = await f.json('GET', '/api/admin/email');
    expect(d.status).toMatchObject({ provider: 'none', keyUnreadable: true });
    expect((await f.req('POST', '/api/admin/email/test', {})).status).toBe(409);
  });

  it('a webhook token created in the console replaces the server one', async () => {
    const f = await platformAdmin('founder');
    const { token, webhookUrl } = await f.json('POST', '/api/admin/email/webhook-token', {});
    expect(token).toMatch(/^[A-Za-z0-9_-]{30,}$/);
    expect(webhookUrl).toMatch(/\/api\/email-webhooks\/brevo$/);
    expect(JSON.stringify(await f.json('GET', '/api/admin/email'))).not.toContain(token);
    const ok = await raw('POST', '/api/email-webhooks/brevo', { body: { event: 'delivered', email: 'x@example.com', 'message-id': '<none@test>' }, headers: { Authorization: `Bearer ${token}` } });
    expect(ok.status).toBe(200);
    const old = await raw('POST', '/api/email-webhooks/brevo', { body: { event: 'delivered' }, headers: { Authorization: 'Bearer test-webhook-token' } });
    expect(old.status).toBe(401);
  });
});

describe('checkBrevo', () => {
  const fakeFetch = (routes: Record<string, { status: number; body: unknown }>): typeof fetch =>
    (async (url: string | URL | Request, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('api-key')).toBe(KEY);
      const path = new URL(String(url)).pathname.replace('/v3', '');
      const r = routes[path] ?? { status: 404, body: {} };
      return new Response(JSON.stringify(r.body), { status: r.status, headers: { 'content-type': 'application/json' } });
    }) as typeof fetch;

  it('explains a refused key', async () => {
    const r = await checkBrevo(KEY, fakeFetch({ '/account': { status: 401, body: { code: 'unauthorized', message: 'Key not found' } } }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/refused the key \(401: Key not found\)/);
  });

  it('reads the account, senders and domains', async () => {
    const r = await checkBrevo(
      KEY,
      fakeFetch({
        '/account': { status: 200, body: { email: 'owner@example.com', companyName: 'Example', plan: [{ type: 'free', credits: 300, creditsType: 'sendLimit' }] } },
        '/senders': { status: 200, body: { senders: [{ email: 'notifications@bizomat.ai', name: 'BIZOMAT', active: true }] } },
        '/senders/domains': { status: 200, body: { domains: [{ domain_name: 'bizomat.ai', authenticated: true, verified: true }] } },
      }),
    );
    expect(r).toMatchObject({
      ok: true,
      account: { email: 'owner@example.com', companyName: 'Example', plans: [{ type: 'free', credits: 300 }] },
      senders: [{ email: 'notifications@bizomat.ai', active: true }],
      domains: [{ name: 'bizomat.ai', authenticated: true }],
    });
  });
});
