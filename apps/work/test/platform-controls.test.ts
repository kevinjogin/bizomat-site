// The Admin Control Centre (Stage 1, R2; src/worker/platform): feature flags, two-factor sign-in and re-authentication
// for platform admins, the kill switch, rollout stages and module switches.
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/worker/index';
import { login, ORIGIN, PASSWORD, randomIp, signup, type Client } from './helpers';
import { base32Decode, hotp, matchStep, stepAt } from '../src/worker/platform/totp';
import { FLAGS, flagValue, MODULES, moduleFlag, resolve } from '../src/worker/platform/flags';
import { ensureOwnCompany } from '../src/worker/system/system';

/** A request as `c`, with extra settings in the worker's environment (for example the billing lock). */
async function call(c: Client, method: string, path: string, body?: unknown, over: Record<string, string> = {}) {
  const h: Record<string, string> = { Origin: ORIGIN, 'CF-Connecting-IP': randomIp(), Accept: 'application/json', Cookie: c.cookie, 'X-CSRF-Token': c.csrf };
  if (body !== undefined) h['Content-Type'] = 'application/json';
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) }), { ...env, ...over } as any, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}
const code = async (res: Response) => ((await res.clone().json()) as any).details?.code;

async function makeAdmin(role: 'founder' | 'admin' = 'admin') {
  const c = await signup('Platform Admin');
  await env.DB.prepare('INSERT INTO platform_admins (user_id, role, granted_at) VALUES (?, ?, ?)').bind(c.userId, role, Date.now()).run();
  return c;
}

/** The current code for a secret, after letting the server accept a step again (a test cannot wait 30 seconds). */
async function freshCode(userId: string, secret: string) {
  await env.DB.prepare('UPDATE user_mfa SET last_step = 0 WHERE user_id = ?').bind(userId).run();
  return hotp(base32Decode(secret), stepAt(Date.now()));
}

/** An admin with two-factor sign-in set up in this session; returns the secret and the recovery codes. */
async function enrolled(role: 'founder' | 'admin' = 'admin') {
  const c = await makeAdmin(role);
  const start = await c.json('POST', '/api/admin/platform/security/mfa/start', {});
  const out = await c.json('POST', '/api/admin/platform/security/mfa/confirm', { code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
  return { c, secret: start.secret as string, recovery: out.recoveryCodes as string[] };
}

async function reauth(a: { c: Client; secret: string }) {
  return a.c.json('POST', '/api/admin/platform/security/reauth', { password: PASSWORD, code: await freshCode(a.c.userId, a.secret) });
}

describe('authenticator codes (RFC 6238)', () => {
  it('match the RFC test vectors and refuse a code twice', async () => {
    const key = new TextEncoder().encode('12345678901234567890');
    expect(await hotp(key, Math.floor(59 / 30), 8)).toBe('94287082');
    expect(await hotp(key, Math.floor(1111111109 / 30), 8)).toBe('07081804');
    expect(await hotp(key, Math.floor(1234567890 / 30), 8)).toBe('89005924');
    expect(await hotp(key, Math.floor(2000000000 / 30), 8)).toBe('69279037');
    const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'; // base32 of the same key
    const now = Date.now();
    const c = await hotp(base32Decode(secret), stepAt(now));
    const step = await matchStep(secret, c, now, 0);
    expect(step).toBe(stepAt(now));
    expect(await matchStep(secret, c, now, step!)).toBeNull();
    expect(await matchStep(secret, '000000x', now, 0)).toBeNull();
  });
});

describe('the Control Centre', () => {
  it('is hidden from everyone but platform admins, and needs two-factor sign-in', async () => {
    const someone = await signup();
    expect((await someone.req('GET', '/api/admin/platform/flags')).status).toBe(404);
    expect((await someone.req('GET', '/api/admin/platform/security')).status).toBe(404);
    const admin = await makeAdmin();
    const r = await admin.req('GET', '/api/admin/platform/flags');
    expect(r.status).toBe(403);
    expect(await code(r)).toBe('MFA_ENROLMENT_REQUIRED');
    // The console as it is today keeps working until the admin enrols.
    expect((await admin.req('GET', '/api/admin/overview')).status).toBe(200);
    expect((await admin.json('GET', '/api/admin/platform/security')).mfa).toMatchObject({ enrolled: false, pending: false });
  });

  it('enrols an authenticator app, then requires a code in every new session, and accepts a recovery code once', async () => {
    const a = await enrolled();
    expect(a.recovery).toHaveLength(10);
    expect((await a.c.req('GET', '/api/admin/platform/flags')).status).toBe(200);
    const row = await env.DB.prepare('SELECT secret_enc, recovery_json FROM user_mfa WHERE user_id = ?').bind(a.c.userId).first<{ secret_enc: string; recovery_json: string }>();
    expect(row!.secret_enc).not.toContain(a.secret);
    expect(row!.recovery_json).not.toContain(a.recovery[0]);
    // A new session: the whole console asks for the second factor first.
    const other = await login(a.c.email);
    for (const path of ['/api/admin/overview', '/api/admin/platform/flags']) {
      const r = await other.req('GET', path);
      expect(r.status, path).toBe(403);
      expect(await code(r), path).toBe('MFA_REQUIRED');
    }
    expect((await other.req('GET', '/api/admin/me')).status).toBe(200);
    expect((await other.req('POST', '/api/admin/platform/security/verify', { code: '123456' })).status).toBe(400);
    expect((await other.json('POST', '/api/admin/platform/security/verify', { recoveryCode: a.recovery[0].toUpperCase() })).usedRecoveryCode).toBe(true);
    expect((await other.req('GET', '/api/admin/overview')).status).toBe(200);
    const third = await login(a.c.email);
    expect((await third.req('POST', '/api/admin/platform/security/verify', { recoveryCode: a.recovery[0] })).status).toBe(400);
    expect((await third.json('POST', '/api/admin/platform/security/verify', { code: await freshCode(a.c.userId, a.secret) })).ok).toBe(true);
    const audited = await env.DB.prepare("SELECT action FROM audit_log WHERE actor_id = ? AND action LIKE 'platform_admin.mfa_%' ORDER BY created_at").bind(a.c.userId).all<{ action: string }>();
    expect(audited.results.map((x) => x.action)).toEqual(expect.arrayContaining(['platform_admin.mfa_started', 'platform_admin.mfa_enrolled', 'platform_admin.mfa_recovery_used', 'platform_admin.mfa_failed', 'platform_admin.mfa_verified']));
  });

  it('lists every flag, off by default (modules on), with the billing lock', async () => {
    const a = await enrolled();
    const out = await a.c.json('GET', '/api/admin/platform/flags');
    const keys = out.flags.map((f: any) => f.key);
    for (const k of ['company_registration_required', 'registry_verification_enabled', 'verification_enforcement', 'scheduled_reverification', 'migration_notifications', 'compliance_countdown', 'auto_suspension', 'auto_deletion', 'billing_mode', 'individual_accounts_policy', 'legal_review_completed', ...Object.keys(MODULES).map((m) => moduleFlag(m as any))]) {
      expect(keys).toContain(k);
    }
    for (const f of out.flags) {
      if (f.key.startsWith('module_')) expect(f.default).toBe('on');
      else if (f.key === 'billing_mode') expect(f.default).toBe('free');
      else if (f.key === 'individual_accounts_policy') expect(f.default).toBe('ALLOW_PERSONAL_WORKSPACE');
      else expect(f.default, f.key).toBe('off');
    }
    expect((await a.c.json('GET', '/api/admin/platform/flags')).billingLocked).toBe(false);
    expect((await (await call(a.c, 'GET', '/api/admin/platform/flags', undefined, { BIZOMAT_BILLING_LOCK: 'true' })).json() as any).billingLocked).toBe(true);
  });

  it('records every change with its reason, keeps history append only, and resets to inherit', async () => {
    const a = await enrolled();
    expect((await a.c.req('PUT', '/api/admin/platform/flags/registry_verification_enabled', { scope: 'global', value: 'on' })).status).toBe(400);
    await a.c.json('PUT', '/api/admin/platform/flags/registry_verification_enabled', { scope: 'country', scopeId: 'au', value: 'on', reason: 'Australia first' });
    expect(await flagValue(env.DB, 'registry_verification_enabled', { country: 'AU' })).toBe('on');
    expect(await flagValue(env.DB, 'registry_verification_enabled', { country: 'GB' })).toBe('off');
    const h = await a.c.json('GET', '/api/admin/platform/flags/registry_verification_enabled/history');
    expect(h.history[0]).toMatchObject({ scope: 'country', scope_id: 'AU', old_value: null, new_value: 'on', reason: 'Australia first', kind: 'change' });
    await expect(env.DB.prepare('UPDATE feature_flag_changes SET reason = ? WHERE key = ?').bind('edited', 'registry_verification_enabled').run()).rejects.toThrow(/append only/);
    await expect(env.DB.prepare('DELETE FROM feature_flag_changes WHERE key = ?').bind('registry_verification_enabled').run()).rejects.toThrow(/append only/);
    await a.c.json('POST', '/api/admin/platform/flags/registry_verification_enabled/reset', { scope: 'country', scopeId: 'AU', reason: 'Back to default' });
    expect(await flagValue(env.DB, 'registry_verification_enabled', { country: 'AU' })).toBe('off');
    const audited = await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE actor_id = ? AND action IN ('platform.flag_changed', 'platform.flag_reset')").bind(a.c.userId).first<{ n: number }>();
    expect(audited!.n).toBe(2);
  });

  it('refuses scopes a flag does not take, unknown companies and malformed ids', async () => {
    const a = await enrolled();
    const put = (key: string, b: object) => a.c.req('PUT', `/api/admin/platform/flags/${key}`, { reason: 'test', ...b });
    expect((await put('scheduled_reverification', { scope: 'company', scopeId: 'x', value: 'on' })).status).toBe(400);
    expect((await put('module_maintenance_enabled', { scope: 'company', scopeId: 'no-such-company', value: 'off' })).status).toBe(404);
    expect((await put('module_maintenance_enabled', { scope: 'stage', scopeId: 'beta', value: 'off' })).status).toBe(400);
    expect((await put('registry_verification_enabled', { scope: 'country', scopeId: 'AUS', value: 'on' })).status).toBe(400);
    expect((await put('registry_verification_enabled', { scope: 'global', value: 'maybe' })).status).toBe(400);
    expect((await put('no_such_flag', { scope: 'global', value: 'on' })).status).toBe(404);
  });

  it('keeps high-risk changes to the founder, with the key typed and a re-authentication', async () => {
    const admin = await enrolled('admin');
    const body = { scope: 'global', value: 'on', reason: 'Pilot', confirm: 'verification_enforcement' };
    expect((await admin.c.req('PUT', '/api/admin/platform/flags/verification_enforcement', body)).status).toBe(403);
    const f = await enrolled('founder');
    const noConfirm = await f.c.req('PUT', '/api/admin/platform/flags/verification_enforcement', { ...body, confirm: 'yes' });
    expect(await code(noConfirm)).toBe('CONFIRMATION_REQUIRED');
    const noReauth = await f.c.req('PUT', '/api/admin/platform/flags/verification_enforcement', body);
    expect(await code(noReauth)).toBe('REAUTH_REQUIRED');
    expect((await f.c.req('POST', '/api/admin/platform/security/reauth', { password: 'wrong-password-1', code: await freshCode(f.c.userId, f.secret) })).status).toBe(400);
    await reauth(f);
    expect((await f.c.json('PUT', '/api/admin/platform/flags/verification_enforcement', body)).value).toBe('on');
    await f.c.json('POST', '/api/admin/platform/flags/verification_enforcement/reset', { scope: 'global', reason: 'Not yet', confirm: 'verification_enforcement' });
    // An expired re-authentication no longer counts.
    await env.DB.prepare('UPDATE sessions SET reauth_at = ? WHERE user_id = ?').bind(Date.now() - 11 * 60_000, f.c.userId).run();
    expect(await code(await f.c.req('PUT', '/api/admin/platform/flags/verification_enforcement', body))).toBe('REAUTH_REQUIRED');
  });

  it('keeps billing free while the server lock is set, deletion off until a legal review, and managed flags out of reach', async () => {
    const f = await enrolled('founder');
    await reauth(f);
    const paid = await call(f.c, 'PUT', '/api/admin/platform/flags/billing_mode', { scope: 'global', value: 'paid', reason: 'test', confirm: 'billing_mode' }, { BIZOMAT_BILLING_LOCK: 'true' });
    expect(paid.status).toBe(403);
    expect(await code(paid)).toBe('BILLING_LOCKED');
    const del = await f.c.req('PUT', '/api/admin/platform/flags/auto_deletion', { scope: 'global', value: 'on', reason: 'test', confirm: 'auto_deletion' });
    expect(del.status).toBe(409);
    expect(await code(del)).toBe('FLAG_REQUIREMENT');
    const legal = await f.c.req('PUT', '/api/admin/platform/flags/legal_review_completed', { scope: 'global', value: 'on', reason: 'test', confirm: 'legal_review_completed' });
    expect(await code(legal)).toBe('FLAG_MANAGED');
  });

  it('resolves company over stage over country over global, for each company', async () => {
    const def = Object.keys(FLAGS).find((k) => k === 'verification_enforcement')!;
    const rows = [
      { scope: 'global' as const, scope_id: '', value: 'on' },
      { scope: 'country' as const, scope_id: 'AU', value: 'off' },
      { scope: 'stage' as const, scope_id: 'pilot', value: 'on' },
      { scope: 'company' as const, scope_id: 'c1', value: 'off' },
    ];
    expect(resolve(def, rows, {})).toEqual({ value: 'on', from: 'global' });
    expect(resolve(def, rows, { country: 'AU' })).toEqual({ value: 'off', from: 'country' });
    expect(resolve(def, rows, { country: 'AU', stage: 'pilot' })).toEqual({ value: 'on', from: 'stage' });
    expect(resolve(def, rows, { country: 'AU', stage: 'pilot', companyId: 'c1' })).toEqual({ value: 'off', from: 'company' });
    // A stored value a flag does not take (or a scope it does not take) is ignored.
    expect(resolve('scheduled_reverification', [{ scope: 'company', scope_id: 'c1', value: 'on' }], { companyId: 'c1' })).toEqual({ value: 'off', from: 'default' });
    expect(resolve('scheduled_reverification', [{ scope: 'global', scope_id: '', value: 'sometimes' }], {})).toEqual({ value: 'off', from: 'default' });
  });

  it('switches a module off for one company: its people are told, everyone else gets 404, other companies are untouched', async () => {
    const owner = await signup('Company Owner');
    const own = await ensureOwnCompany(env.DB, { id: owner.userId, name: owner.name, email: owner.email });
    const neighbour = await signup('Neighbour');
    const theirs = await ensureOwnCompany(env.DB, { id: neighbour.userId, name: neighbour.name, email: neighbour.email });
    const path = (id: string) => `/api/maintenance/c/${id}/assets`;
    expect((await owner.req('GET', path(own))).status).toBe(200);
    const f = await enrolled('founder');
    await f.c.json('PUT', '/api/admin/platform/flags/module_maintenance_enabled', { scope: 'company', scopeId: own, value: 'off', reason: 'Not used by this company' });
    const off = await owner.req('GET', path(own));
    expect(off.status).toBe(403);
    expect(await code(off)).toBe('MODULE_DISABLED');
    expect((await neighbour.req('GET', path(own))).status).toBe(404);
    expect((await neighbour.req('GET', path(theirs))).status).toBe(200);
    await f.c.json('POST', '/api/admin/platform/flags/module_maintenance_enabled/reset', { scope: 'company', scopeId: own, reason: 'Back on' });
    expect((await owner.req('GET', path(own))).status).toBe(200);
  });

  it('turns every enforcement flag back to its default at once with the kill switch, and leaves the others', async () => {
    const f = await enrolled('founder');
    await reauth(f);
    const set = (key: string, b: object) => f.c.json('PUT', `/api/admin/platform/flags/${key}`, { reason: 'pilot', confirm: key, ...b });
    await set('verification_enforcement', { scope: 'stage', scopeId: 'pilot', value: 'on' });
    await set('compliance_countdown', { scope: 'global', value: 'on' });
    await set('individual_accounts_policy', { scope: 'global', value: 'INVITATION_ONLY' });
    await set('registry_verification_enabled', { scope: 'global', value: 'on' });
    const admin = await enrolled('admin');
    expect(await code(await admin.c.req('POST', '/api/admin/platform/kill-switch', { reason: 'Incident', confirm: 'stop' }))).toBe('CONFIRMATION_REQUIRED');
    expect(await code(await admin.c.req('POST', '/api/admin/platform/kill-switch', { reason: 'Incident', confirm: 'KILL SWITCH' }))).toBe('REAUTH_REQUIRED');
    await reauth(admin);
    const out = await admin.c.json('POST', '/api/admin/platform/kill-switch', { reason: 'Incident', confirm: 'KILL SWITCH' });
    expect(out.cleared).toBeGreaterThanOrEqual(3);
    expect(await flagValue(env.DB, 'verification_enforcement', { companyId: 'x' })).toBe('off');
    expect(await flagValue(env.DB, 'compliance_countdown')).toBe('off');
    expect(await flagValue(env.DB, 'individual_accounts_policy')).toBe('ALLOW_PERSONAL_WORKSPACE');
    expect(await flagValue(env.DB, 'registry_verification_enabled')).toBe('on');
    const killed = await env.DB.prepare("SELECT COUNT(*) AS n FROM feature_flag_changes WHERE kind = 'kill_switch' AND actor_id = ?").bind(admin.c.userId).first<{ n: number }>();
    expect(killed!.n).toBe(out.cleared);
    await f.c.json('POST', '/api/admin/platform/flags/registry_verification_enabled/reset', { scope: 'global', reason: 'cleanup' });
  });

  it('puts companies in the internal or pilot stage (founder, re-authenticated), and their stage takes its flags', async () => {
    const owner = await signup('Pilot Owner');
    const own = await ensureOwnCompany(env.DB, { id: owner.userId, name: owner.name, email: owner.email });
    const f = await enrolled('founder');
    expect(await code(await f.c.req('PUT', `/api/admin/platform/rollout/${own}`, { stage: 'pilot', reason: 'First pilot' }))).toBe('REAUTH_REQUIRED');
    await reauth(f);
    await f.c.json('PUT', `/api/admin/platform/rollout/${own}`, { stage: 'pilot', reason: 'First pilot' });
    expect((await f.c.json('GET', '/api/admin/platform/rollout')).companies.some((r: any) => r.company_id === own && r.stage === 'pilot')).toBe(true);
    await f.c.json('PUT', '/api/admin/platform/flags/migration_notifications', { scope: 'stage', scopeId: 'pilot', value: 'on', reason: 'Pilot notices' });
    expect(await flagValue(env.DB, 'migration_notifications', { companyId: own })).toBe('on');
    expect(await flagValue(env.DB, 'migration_notifications', { companyId: 'someone-else' })).toBe('off');
    await f.c.json('POST', '/api/admin/platform/flags/migration_notifications/reset', { scope: 'stage', scopeId: 'pilot', reason: 'cleanup' });
    await f.c.json('PUT', `/api/admin/platform/rollout/${own}`, { stage: null, reason: 'Pilot over' });
  });
});
