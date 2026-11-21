// Two-factor sign-in for everyone (src/worker/auth/two-factor.ts; flag account_two_factor, off by default). Off: nobody
// but a platform admin can turn it on and sign-in is unchanged. On: anyone turns it on in Settings, Security; a password
// sign-in then makes no session until a code (or a recovery code, once) is given against a challenge that ends after
// five wrong tries; the session made is marked as having proved the second factor; turning it off needs the password
// and a code; a founder removes it for someone who lost their phone, with a reason.
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import worker from '../src/worker/index';
import { ORIGIN, PASSWORD, randomIp, raw, reauthenticate, signup, type Client } from './helpers';
import { setGoogleExchangeForTests } from '../src/worker/auth/providers';
import { base32Decode, hotp, stepAt } from '../src/worker/platform/totp';

const setFlag = (value: 'on' | 'off') => env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('account_two_factor', 'global', '', ?, 'test switch', 'test', ?) ON CONFLICT(key, scope, scope_id) DO UPDATE SET value = excluded.value").bind(value, Date.now()).run();

async function freshCode(userId: string, secret: string) {
  await env.DB.prepare('UPDATE user_mfa SET last_step = 0 WHERE user_id = ?').bind(userId).run();
  return hotp(base32Decode(secret), stepAt(Date.now()));
}

async function enrol(c: Client) {
  const start = await c.json('POST', '/api/auth/two-factor/start', {});
  const out = await c.json('POST', '/api/auth/two-factor/confirm', { code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
  return { secret: start.secret as string, recovery: out.recoveryCodes as string[] };
}

const cookieOf = (res: Response) => (res.headers.getSetCookie?.() ?? []).map((x) => x.split(';')[0]).filter((x) => x.startsWith('workos_sid=')).join('; ');

describe('two-factor sign-in for everyone', () => {
  afterEach(async () => {
    await setFlag('off');
  });

  it('is not offered while the flag is off, and sign-in is unchanged', async () => {
    const c = await signup('Tf Off');
    expect((await c.json('GET', '/api/auth/two-factor')).available).toBe(false);
    expect((await c.req('POST', '/api/auth/two-factor/start', {})).status).toBe(404);
    const res = await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } });
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).csrfToken).toBeTruthy();
  });

  it('asks for a code at sign-in once turned on; a recovery code works once; wrong codes end the challenge', async () => {
    await setFlag('on');
    const c = await signup('Tf Person');
    expect((await c.json('GET', '/api/auth/two-factor')).available).toBe(true);
    // an API token never manages the second factor
    const own = (await c.json('GET', '/api/maintenance/companies')).companies.find((x: any) => x.kind === 'own');
    const tok = await c.json('POST', '/api/me/tokens', { name: 'script', companyId: own.id });
    expect((await raw('POST', '/api/auth/two-factor/start', { body: {}, headers: { Authorization: `Bearer ${tok.token}` } })).status).toBe(403);
    const { secret, recovery } = await enrol(c);
    expect(recovery).toHaveLength(10);
    expect((await c.json('GET', '/api/auth/two-factor')).enrolled).toBe(true);
    // the stored secret is encrypted and the recovery codes hashed
    const row = await env.DB.prepare('SELECT secret_enc, recovery_json FROM user_mfa WHERE user_id = ?').bind(c.userId).first<any>();
    expect(row.secret_enc).not.toContain(secret);
    expect(row.recovery_json).not.toContain(recovery[0]);

    // the password alone makes no session, only a challenge
    const first = await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } });
    expect(first.status).toBe(200);
    expect(cookieOf(first)).toBe('');
    const ch = (await first.json()) as any;
    expect(ch).toMatchObject({ secondFactorRequired: true });
    expect(ch.csrfToken).toBeUndefined();
    const stored = await env.DB.prepare('SELECT token_hash FROM login_challenges WHERE user_id = ? AND used_at IS NULL').bind(c.userId).first<any>();
    expect(stored.token_hash).not.toBe(ch.challenge);
    // a wrong code says how many tries are left; the right one makes a session that already proved the factor
    const wrong = await raw('POST', '/api/auth/login/two-factor', { body: { challenge: ch.challenge, code: '000000' } });
    expect(wrong.status).toBe(400);
    expect(((await wrong.json()) as any).error).toContain('4 tries are left');
    const ok = await raw('POST', '/api/auth/login/two-factor', { body: { challenge: ch.challenge, code: await freshCode(c.userId, secret) } });
    expect(ok.status).toBe(200);
    const cookie = cookieOf(ok);
    expect(cookie).toContain('workos_sid=');
    const session = await env.DB.prepare('SELECT mfa_at, provider FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').bind(c.userId).first<any>();
    expect(session.mfa_at).toBeTruthy();
    expect(session.provider).toBe('password');
    // the challenge is used up
    expect((await raw('POST', '/api/auth/login/two-factor', { body: { challenge: ch.challenge, code: await freshCode(c.userId, secret) } })).status).toBe(401);

    // a recovery code works once
    const second = (await (await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } })).json()) as any;
    const rec = await raw('POST', '/api/auth/login/two-factor', { body: { challenge: second.challenge, recoveryCode: recovery[0].toUpperCase() } });
    expect(rec.status).toBe(200);
    expect(((await rec.json()) as any).usedRecoveryCode).toBe(true);
    const third = (await (await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } })).json()) as any;
    expect((await raw('POST', '/api/auth/login/two-factor', { body: { challenge: third.challenge, recoveryCode: recovery[0] } })).status).toBe(400);
    // five wrong tries end it, even with the right code after
    for (let i = 0; i < 4; i++) await raw('POST', '/api/auth/login/two-factor', { body: { challenge: third.challenge, code: '111111' } });
    expect((await raw('POST', '/api/auth/login/two-factor', { body: { challenge: third.challenge, code: await freshCode(c.userId, secret) } })).status).toBe(401);
    // a new sign-in ends the challenge before it
    const a1 = (await (await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } })).json()) as any;
    const a2 = (await (await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } })).json()) as any;
    expect((await raw('POST', '/api/auth/login/two-factor', { body: { challenge: a1.challenge, code: await freshCode(c.userId, secret) } })).status).toBe(401);
    expect((await raw('POST', '/api/auth/login/two-factor', { body: { challenge: a2.challenge, code: await freshCode(c.userId, secret) } })).status).toBe(200);
    // a made-up challenge is refused
    expect((await raw('POST', '/api/auth/login/two-factor', { body: { challenge: 'x'.repeat(40), code: '123456' } })).status).toBe(401);

    // new recovery codes and turning it off need the password and a code
    expect((await c.req('POST', '/api/auth/two-factor/disable', { password: 'wrong-password-1!', code: await freshCode(c.userId, secret) })).status).toBe(400);
    const fresh = await c.json('POST', '/api/auth/two-factor/recovery-codes', { password: PASSWORD, code: await freshCode(c.userId, secret) });
    expect(fresh.recoveryCodes).toHaveLength(10);
    await c.json('POST', '/api/auth/two-factor/disable', { password: PASSWORD, code: await freshCode(c.userId, secret) });
    const plain = await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } });
    expect(((await plain.json()) as any).csrfToken).toBeTruthy();
    const audited = await env.DB.prepare("SELECT action FROM audit_log WHERE actor_id = ? AND (action LIKE 'account.mfa_%' OR action LIKE 'auth.second_factor_%' OR action = 'auth.recovery_code_used')").bind(c.userId).all<any>();
    const actions = audited.results.map((r: any) => r.action);
    for (const a of ['account.mfa_enrolled', 'auth.second_factor_asked', 'auth.second_factor_failed', 'auth.second_factor_proved', 'auth.recovery_code_used', 'account.mfa_disabled']) expect(actions).toContain(a);
    expect(JSON.stringify(audited.results)).not.toContain(secret);
  });

  it('asks for the code after Google too, and goes where the sign-in was going', async () => {
    await setFlag('on');
    const c = await signup('Tf Google');
    const { secret } = await enrol(c);
    setGoogleExchangeForTests(async () => ({ subject: `g-${c.email}`, email: c.email, emailVerified: true, name: 'Tf Google' }));
    await env.DB.prepare("INSERT INTO oauth_states (state, provider, code_verifier, redirect_to, link_user_id, created_at, expires_at) VALUES ('st-2fa', 'google', 'v', '/erp/tasks', NULL, ?, ?)").bind(Date.now(), Date.now() + 600_000).run();
    const ctx = createExecutionContext();
    const res = await worker.fetch(new Request(`${ORIGIN}/api/auth/oauth/google/callback?code=c&state=st-2fa`, { headers: { 'CF-Connecting-IP': randomIp(), Cookie: 'workos_oauth_state=st-2fa' } }), { ...env, GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret' } as any, ctx);
    await waitOnExecutionContext(ctx);
    expect(res.status).toBe(302);
    // no session yet: the sign-in page asks for the code
    expect(cookieOf(res)).toBe('');
    const to = new URL(res.headers.get('Location')!, ORIGIN);
    expect(to.pathname).toBe('/login');
    const challenge = to.searchParams.get('challenge')!;
    const ok = await raw('POST', '/api/auth/login/two-factor', { body: { challenge, code: await freshCode(c.userId, secret) } });
    expect(ok.status).toBe(200);
    expect(((await ok.json()) as any).redirectTo).toBe('/erp/tasks');
    expect((await env.DB.prepare('SELECT provider FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').bind(c.userId).first<any>()).provider).toBe('google');
  });

  it('is removed by the founder for someone who lost their phone, with a reason, ending their sessions', async () => {
    await setFlag('on');
    const person = await signup('Tf Lost');
    await enrol(person);
    const founder = await signup('Tf Founder');
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_at) VALUES (?, 'founder', ?)").bind(founder.userId, Date.now()).run();
    const admin = await signup('Tf Admin');
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_at) VALUES (?, 'admin', ?)").bind(admin.userId, Date.now()).run();
    expect((await admin.req('POST', `/api/admin/users/${person.userId}/two-factor/remove`, { reason: 'Lost phone, identity checked by video call' })).status).toBe(403);
    await reauthenticate(founder);
    expect((await founder.req('POST', `/api/admin/users/${person.userId}/two-factor/remove`, { reason: 'short' })).status).toBe(400);
    await founder.json('POST', `/api/admin/users/${person.userId}/two-factor/remove`, { reason: 'Lost phone, identity checked by video call' });
    expect(await env.DB.prepare('SELECT 1 FROM user_mfa WHERE user_id = ?').bind(person.userId).first()).toBeNull();
    expect((await person.req('GET', '/api/auth/two-factor')).status).toBe(401);
    const res = await raw('POST', '/api/auth/login', { body: { email: person.email, password: PASSWORD } });
    expect(((await res.json()) as any).csrfToken).toBeTruthy();
  });
});
