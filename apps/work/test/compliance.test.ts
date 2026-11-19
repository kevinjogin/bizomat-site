// Existing users and the company rule (Stage 1, R7; docs/platform/compliance.md): the classification report, the
// individual accounts policy (brief test 17), notices with an approved list and recorded delivery, deadlines,
// suspension and restoring, exports (test 18), the deletion gate (test 19), password reset (S6), Google linking (L1)
// and the founder bootstrap. Every flag ships off; each test switches on what it needs and takes it back.
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { unzipSync, strFromU8 } from 'fflate';
import { afterEach, describe, expect, it } from 'vitest';
import worker from '../src/worker/index';
import { ORIGIN, PASSWORD, raw, randomIp, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { base32Decode, hotp, stepAt } from '../src/worker/platform/totp';
import { classify, runCompliance, saveSettings, DEFAULT_SETTINGS } from '../src/worker/compliance/core';
import { runExports } from '../src/worker/compliance/export';
import { blockers, dryRun, runDeletion } from '../src/worker/compliance/deletion';
import { bootstrapFounder } from '../src/worker/services/platform-admin';
import { setGoogleExchangeForTests } from '../src/worker/auth/providers';

const DAY = 86_400_000;
afterEach(async () => {
  setGoogleExchangeForTests(null);
  await env.DB.prepare("DELETE FROM feature_flags WHERE key IN ('company_registration_required', 'individual_accounts_policy', 'migration_notifications', 'compliance_countdown', 'auto_suspension', 'auto_deletion', 'legal_review_completed', 'self_service_password_reset')").run();
});

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registered(c: Client) {
  const res = await c.req('POST', '/api/company/companies', { kind: 'business', name: 'Rule Works', legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return { id: data.company.id as string, tools: data.tools as { tasks: string; crm: string; finance: string } };
}

const setFlag = (key: string, value = 'on') => env.DB.prepare("INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, 'global', '', ?, 'test', 'test', 1)").bind(key, value).run();

async function founder() {
  const a = await signup('Fern Founder');
  await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'founder', 'test', ?)").bind(a.userId, Date.now()).run();
  const start = await a.json('POST', '/api/admin/platform/security/mfa/start', {});
  await a.json('POST', '/api/admin/platform/security/mfa/confirm', { code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
  const reauth = async () => {
    await env.DB.prepare('UPDATE user_mfa SET last_step = 0 WHERE user_id = ?').bind(a.userId).run();
    await a.json('POST', '/api/admin/platform/security/reauth', { password: PASSWORD, code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
  };
  return { a, reauth };
}

describe('classification and the individual accounts policy (brief 7.1, 7.6, test 17)', () => {
  it('counts the people the company rule concerns, before anything is enforced', async () => {
    const solo = await signup('Cl Solo');
    const r = await classify(env.DB);
    expect(r.activeAccounts).toBeGreaterThan(0);
    expect(r.noCompany).toBeGreaterThanOrEqual(1);
    expect(r.policy).toBe('ALLOW_PERSONAL_WORKSPACE');
    const before = r.noCompany;
    await env.DB.prepare("INSERT INTO compliance_exemptions (user_id, reason, created_at) VALUES (?, 'Tester', ?)").bind(solo.userId, Date.now()).run();
    expect((await classify(env.DB)).noCompany).toBe(before - 1);
  });

  it('changes nothing while company registration is not required, whatever the policy says', async () => {
    const solo = await signup('Off Solo');
    await setFlag('individual_accounts_policy', 'INVITATION_ONLY');
    expect((await solo.req('GET', `/api/workspaces/${solo.workspaceId}`)).status).toBe(200);
    expect(await solo.json('GET', '/api/compliance/me')).toEqual({ required: false });
  });

  it('ALLOW_PERSONAL_WORKSPACE: the personal workspace works but cannot invite; INVITATION_ONLY: only registering or accepting; exempt people are not touched', async () => {
    const solo = await signup('Al Solo');
    await setFlag('company_registration_required');
    expect((await solo.req('GET', `/api/workspaces/${solo.workspaceId}`)).status).toBe(200);
    const inv = await solo.req('POST', `/api/workspaces/${solo.workspaceId}/invitations`, { email: uniqueEmail('x'), role: 'member' });
    expect(inv.status).toBe(403);
    expect(((await inv.json()) as any).details).toMatchObject({ code: 'PERSONAL_WORKSPACE_NO_INVITES' });

    await setFlag('individual_accounts_policy', 'INVITATION_ONLY');
    const blocked = await solo.req('GET', `/api/workspaces/${solo.workspaceId}`);
    expect(blocked.status).toBe(403);
    expect(((await blocked.json()) as any).details).toMatchObject({ code: 'COMPANY_REQUIRED' });
    // Still open: their account, their export, registering a company, the notice.
    expect((await solo.req('GET', '/api/compliance/me')).status).toBe(200);
    expect((await solo.req('GET', '/api/exports')).status).toBe(200);
    const co = await registered(solo);
    const after = await solo.req('GET', `/api/workspaces/${co.tools.tasks}`);
    expect(after.status, await after.clone().text()).toBe(200);
    expect((await solo.req('GET', `/api/workspaces/${solo.workspaceId}`)).status).toBe(200);

    const tester = await signup('Ty Tester');
    await env.DB.prepare("INSERT INTO compliance_exemptions (user_id, reason, created_at) VALUES (?, 'Internal tester', ?)").bind(tester.userId, Date.now()).run();
    expect((await tester.req('GET', `/api/workspaces/${tester.workspaceId}`)).status).toBe(200);
  });

  it('upgrading to a company keeps the personal workspace’s data', async () => {
    const solo = await signup('Up Solo');
    const board = await solo.json('POST', `/api/workspaces/${solo.workspaceId}/boards`, { name: 'My plans' });
    await registered(solo);
    expect((await solo.json('GET', `/api/boards/${board.id}`)).name ?? (await solo.json('GET', `/api/boards/${board.id}`)).board?.name).toBe('My plans');
  });
});

describe('notices, deadlines and suspension (brief 7.2 to 7.4)', () => {
  it('builds a dry-run list, sends only once approved and switched on, starts the deadline at delivery, suspends after it and restores on compliance', async () => {
    const { a, reauth } = await founder();
    const solo = await signup('Dee Deadline');
    await setFlag('company_registration_required');
    await setFlag('individual_accounts_policy', 'REQUIRE_COMPANY');
    const list = await a.json('POST', '/api/admin/platform/compliance/recipient-lists', {});
    expect(list.count).toBeGreaterThanOrEqual(1);
    const review = await a.json('GET', `/api/admin/platform/compliance/recipient-lists/${list.id}`);
    expect(review.people.map((p: any) => p.email)).toContain(solo.email);
    expect(review.people.map((p: any) => p.email)).not.toContain(a.email);
    expect(review.text.title).toMatch(/Register your company/);
    // Not approved: nothing goes. Approved but switched off: nothing goes.
    expect((await a.req('POST', `/api/admin/platform/compliance/recipient-lists/${list.id}/send`, {})).status).toBe(409);
    await reauth();
    await a.json('POST', `/api/admin/platform/compliance/recipient-lists/${list.id}/approve`, {});
    expect((await a.req('POST', `/api/admin/platform/compliance/recipient-lists/${list.id}/send`, {})).status).toBe(409);
    await setFlag('migration_notifications');
    const sent = await a.json('POST', `/api/admin/platform/compliance/recipient-lists/${list.id}/send`, {});
    expect(sent.sent).toBeGreaterThanOrEqual(1);
    // The countdown starts only once a notice was delivered or displayed, and only when switched on.
    await runCompliance(env as any);
    expect((await env.DB.prepare('SELECT deadline_at FROM compliance_accounts WHERE user_id = ?').bind(solo.userId).first<any>()).deadline_at).toBeNull();
    const notice = await solo.json('GET', '/api/compliance/me');
    expect(notice).toMatchObject({ required: true, policy: 'REQUIRE_COMPANY', suspended: false });
    await setFlag('compliance_countdown');
    await runCompliance(env as any);
    const acc = await env.DB.prepare('SELECT notified_at, deadline_at FROM compliance_accounts WHERE user_id = ?').bind(solo.userId).first<any>();
    expect(acc.deadline_at - acc.notified_at).toBe(7 * DAY);
    // An extension for everyone moves the deadline.
    await a.json('POST', '/api/admin/platform/compliance/extensions', { scope: 'user', scopeId: solo.userId, days: 3, reason: 'Waiting for the ABN' });
    await runCompliance(env as any);
    expect((await env.DB.prepare('SELECT deadline_at FROM compliance_accounts WHERE user_id = ?').bind(solo.userId).first<any>()).deadline_at - acc.notified_at).toBe(10 * DAY);
    // After the deadline, with suspension switched on: suspended, with the allowed addresses still open.
    await setFlag('auto_suspension');
    await runCompliance(env as any, acc.notified_at + 11 * DAY);
    const closed = await solo.req('GET', `/api/workspaces/${solo.workspaceId}`);
    expect(closed.status).toBe(403);
    expect(((await closed.json()) as any).details).toMatchObject({ code: 'ACCOUNT_SUSPENDED' });
    expect((await solo.req('POST', '/api/me/export', {})).status).toBe(201);
    // Registering a company restores access at once.
    await registered(solo);
    expect((await solo.req('GET', `/api/workspaces/${solo.workspaceId}`)).status).toBe(200);
    await runCompliance(env as any);
    expect((await env.DB.prepare('SELECT suspended_at, restored_at FROM compliance_accounts WHERE user_id = ?').bind(solo.userId).first<any>())).toMatchObject({ suspended_at: null });
  });
});

describe('data export (brief 7.6, test 18)', () => {
  it('builds a personal export of the person’s own data only, behind a link only they can use, that expires, all audited', async () => {
    const me = await signup('Ex Person');
    const other = await signup('Ex Other');
    await me.json('POST', `/api/workspaces/${me.workspaceId}/boards`, { name: 'Mine' });
    await other.json('POST', `/api/workspaces/${other.workspaceId}/boards`, { name: 'Theirs' });
    const x = await me.json('POST', '/api/me/export', {});
    expect((await me.req('POST', '/api/me/export', {})).status).toBe(409);
    expect((await runExports(env as any)).built).toBeGreaterThanOrEqual(1);
    const list = await me.json('GET', '/api/exports');
    expect(list.find((e: any) => e.id === x.id).status).toBe('ready');
    expect((await other.req('GET', `/api/exports/${x.id}/download`)).status).toBe(404);
    const res = await me.req('GET', `/api/exports/${x.id}/download`);
    expect(res.status).toBe(200);
    const files = unzipSync(new Uint8Array(await res.arrayBuffer()));
    const profile = JSON.parse(strFromU8(files['profile.json']));
    expect(profile[0].email).toBe(me.email);
    expect(JSON.stringify(profile)).not.toContain('password_hash');
    expect(Object.keys(files)).toContain('profile.csv');
    expect(JSON.stringify(Object.values(files).map((f) => strFromU8(f)))).not.toContain(other.email);
    const audit = await env.DB.prepare("SELECT action FROM audit_log WHERE target_id = ? ORDER BY created_at").bind(x.id).all<any>();
    expect(audit.results.map((r) => r.action)).toEqual(['export.requested', 'export.built', 'export.downloaded']);
    // After 7 days the link is gone.
    await runExports(env as any, Date.now() + 8 * DAY);
    expect((await me.req('GET', `/api/exports/${x.id}/download`)).status).toBe(410);
  });

  it('builds a company export for its owner and administrators only, with that company’s data only', async () => {
    const owner = await signup('Co Exporter');
    const co = await registered(owner);
    const second = await registered(await signup('Co Elsewhere'));
    const emp = await signup('Co Employee');
    const inv = await owner.json('POST', `/api/company/c/${co.id}/invitations`, { email: emp.email, role: 'employee' });
    await emp.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
    expect((await emp.req('POST', `/api/company/c/${co.id}/export`, {})).status).toBe(403);
    await owner.json('POST', `/api/crm/orgs/${co.tools.crm}/companies`, { name: 'Customer One' });
    const x = await owner.json('POST', `/api/company/c/${co.id}/export`, {});
    await runExports(env as any);
    const files = unzipSync(new Uint8Array(await (await owner.req('GET', `/api/exports/${x.id}/download`)).arrayBuffer()));
    expect(JSON.parse(strFromU8(files['company.json']))[0].id).toBe(co.id);
    expect(strFromU8(files['crm/crm_companies.json'])).toContain('Customer One');
    expect(Object.values(files).map((f) => strFromU8(f)).join('')).not.toContain(second.id);
  });
});

describe('the deletion gate (brief 7.5, 7.6, test 19)', () => {
  it('refuses automatic deletion until a legal review is recorded, warns first, deletes in reviewed batches within the limit, and anonymises', async () => {
    const { a, reauth } = await founder();
    // Without a recorded legal review, auto_deletion cannot be switched on.
    await reauth();
    const refused = await a.req('PUT', '/api/admin/platform/flags/auto_deletion', { scope: 'global', value: 'on', reason: 'test', confirm: 'auto_deletion' });
    expect(refused.status).toBe(409);
    await reauth();
    await a.json('POST', '/api/admin/platform/compliance/legal-review', { reviewer: 'Example Legal', reviewedOn: '2026-11-19', jurisdictions: ['Australia', 'UK/EU'], retention: { accounts: '30 days after suspension' } });
    expect((await env.DB.prepare("SELECT value FROM feature_flags WHERE key = 'legal_review_completed'").first<any>()).value).toBe('on');
    await reauth();
    expect((await a.req('PUT', '/api/admin/platform/flags/auto_deletion', { scope: 'global', value: 'on', reason: 'Reviewed', confirm: 'auto_deletion' })).status).toBe(200);

    await saveSettings(env.DB, { ...DEFAULT_SETTINGS, batchMax: 1 });
    const t0 = Date.now();
    const people: Client[] = [];
    for (const n of ['Del One', 'Del Two']) {
      const p = await signup(n);
      people.push(p);
      await env.DB.prepare('INSERT INTO compliance_accounts (user_id, notified_at, deadline_at, suspended_at, updated_at) VALUES (?, ?, ?, ?, ?)').bind(p.userId, t0 - 50 * DAY, t0 - 43 * DAY, t0 - 40 * DAY, t0).run();
    }
    const held = await signup('Del Held');
    await env.DB.prepare('INSERT INTO compliance_accounts (user_id, notified_at, deadline_at, suspended_at, legal_hold, updated_at) VALUES (?, ?, ?, ?, 1, ?)').bind(held.userId, t0 - 50 * DAY, t0 - 43 * DAY, t0 - 40 * DAY, t0).run();
    expect(await blockers(env.DB, held.userId)).toContain('legal_hold');
    // The final warning first: nobody is due for deletion before it.
    const run1 = await runDeletion({ ...env, EMAIL_PROVIDER: 'log' } as any, t0);
    expect(run1).toMatchObject({ warned: 2, deleted: 0 });
    const warn = await env.DB.prepare('SELECT final_warning_at, deletion_due_at FROM compliance_accounts WHERE user_id = ?').bind(people[0].userId).first<any>();
    expect(warn.deletion_due_at - warn.final_warning_at).toBe(7 * DAY);
    // A dry run after the warning period: at most the batch limit, nothing deleted.
    const later = t0 + 8 * DAY;
    const d = await dryRun(env.DB, a.userId, undefined, later);
    expect(d.toDelete).toBe(1);
    expect((await env.DB.prepare('SELECT disabled_at FROM users WHERE id = ?').bind(d.accounts[0]).first<any>()).disabled_at).toBeNull();
    // Not approved: not deleted. Approved (founder, re-authenticated): deleted by the maintenance run.
    expect((await runDeletion(env as any, later)).deleted).toBe(0);
    await reauth();
    await a.json('POST', `/api/admin/platform/compliance/deletion/${d.id}/approve`, {});
    expect((await runDeletion(env as any, later)).deleted).toBe(1);
    const gone = await env.DB.prepare('SELECT email, name, password_hash, disabled_at FROM users WHERE id = ?').bind(d.accounts[0]).first<any>();
    expect(gone).toMatchObject({ name: 'Deleted user', password_hash: null });
    expect(gone.email).toMatch(/^deleted\+.*@deleted\.invalid$/);
    expect(gone.disabled_at).not.toBeNull();
    const batch = await env.DB.prepare('SELECT status, backups_expire_at FROM deletion_batches WHERE id = ?').bind(d.id).first<any>();
    expect(batch.status).toBe('done');
    expect(batch.backups_expire_at).toBeGreaterThan(later);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE id = ? AND disabled_at IS NULL').bind(held.userId).first<any>()).n).toBe(1);
    // No public way to start a deletion.
    expect((await raw('POST', '/api/compliance/deletion/run', { body: {} })).status).toBeGreaterThanOrEqual(400);
  });
});

describe('account safety', () => {
  it('resets a forgotten password only while switched on, only to a proven address, once, ending every session (audit S6)', async () => {
    const p = await signup('Pw Person');
    await env.DB.prepare("UPDATE users SET email_verified_at = ?, email_verified_via = 'link' WHERE id = ?").bind(Date.now(), p.userId).run();
    expect((await raw('POST', '/api/auth/password-reset', { body: { email: p.email } })).status).toBe(404);
    await setFlag('self_service_password_reset');
    const ask = async (email: string) => {
      const ctx = createExecutionContext();
      const res = await worker.fetch(new Request(`${ORIGIN}/api/auth/password-reset`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN, 'CF-Connecting-IP': randomIp() }, body: JSON.stringify({ email }) }), { ...env, EMAIL_PROVIDER: 'log' } as any, ctx);
      await waitOnExecutionContext(ctx);
      return res;
    };
    const unknown = await (await ask(uniqueEmail('nobody'))).json();
    const known = await (await ask(p.email)).json();
    expect(known).toEqual(unknown);
    const row = await env.DB.prepare("SELECT body FROM email_outbox WHERE to_email = ? ORDER BY created_at DESC LIMIT 1").bind(p.email).first<any>().catch(() => null);
    const url = (await env.DB.prepare("SELECT html FROM email_outbox WHERE to_email = ? AND template = 'notification' ORDER BY created_at DESC LIMIT 1").bind(p.email).first<any>())?.html ?? row?.body ?? '';
    const token = decodeURIComponent(/reset-password#([^"&<\s]+)/.exec(url)?.[1] ?? '');
    expect(token.length).toBeGreaterThan(20);
    expect((await raw('POST', '/api/auth/password-reset/confirm', { body: { token, password: 'short' } })).status).toBe(400);
    expect((await raw('POST', '/api/auth/password-reset/confirm', { body: { token, password: 'a-brand-new-horse-42!' } })).status).toBe(200);
    expect((await raw('POST', '/api/auth/password-reset/confirm', { body: { token, password: 'another-new-horse-43!' } })).status).toBe(400);
    expect((await p.req('GET', '/api/auth/me')).status).toBe(401);
  });

  it('removes an unproven password before Google links the account (audit L1 and S3)', async () => {
    const victim = uniqueEmail('victim');
    const squatter = await signup('Squatter', victim);
    await env.DB.prepare('UPDATE users SET email_verified_at = NULL WHERE id = ?').bind(squatter.userId).run();
    setGoogleExchangeForTests(async () => ({ subject: `g-${victim}`, email: victim, emailVerified: true, name: 'Real Owner' }));
    await env.DB.prepare("INSERT INTO oauth_states (state, provider, code_verifier, redirect_to, link_user_id, created_at, expires_at) VALUES ('st-l1', 'google', 'v', NULL, NULL, ?, ?)").bind(Date.now(), Date.now() + 600_000).run();
    const ctx = createExecutionContext();
    const res = await worker.fetch(new Request(`${ORIGIN}/api/auth/oauth/google/callback?code=c&state=st-l1`, { headers: { 'CF-Connecting-IP': randomIp(), Cookie: 'workos_oauth_state=st-l1' } }), { ...env, GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret' } as any, ctx);
    await waitOnExecutionContext(ctx);
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).not.toContain('error=');
    const u = await env.DB.prepare('SELECT password_hash, email_verified_via FROM users WHERE id = ?').bind(squatter.userId).first<any>();
    expect(u).toEqual({ password_hash: null, email_verified_via: 'google' });
    expect((await squatter.req('GET', '/api/auth/me')).status).toBe(401);
  });

  it('makes the first founder from the server setting only while there is none', async () => {
    const p = await signup('Boot Strap');
    const r = await bootstrapFounder({ DB: env.DB, PLATFORM_ADMIN_BOOTSTRAP: p.email });
    const founders = await env.DB.prepare("SELECT COUNT(*) AS n FROM platform_admins WHERE role = 'founder'").first<any>();
    if (r === 'granted') expect(founders.n).toBe(1);
    else expect(r).toBe('exists');
    expect(await bootstrapFounder({ DB: env.DB, PLATFORM_ADMIN_BOOTSTRAP: (await signup('Second Boot')).email })).toBe('exists');
  });

  it('keeps the audit log append only (audit S10)', async () => {
    await signup('Au Log');
    await expect(env.DB.prepare('DELETE FROM audit_log').run()).rejects.toThrow(/append only/);
    await expect(env.DB.prepare("UPDATE audit_log SET action = 'x'").run()).rejects.toThrow(/append only/);
  });
});
