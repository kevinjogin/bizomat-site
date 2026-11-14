// The super admin consoles for BIZOMAT CRM and Finance (src/worker/routes/admin-products.ts): only platform admins,
// usage rather than content, Finance without amounts or personal workspace names, audited support actions, and the
// founder grant of migration 0012.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { raw, signup, type Client } from './helpers';
import { createOrg, joinOrg } from './crm-helpers';
import { accounts, byCode, createWs, fin, joinWs } from './fin-helpers';

async function makeAdmin(role: 'founder' | 'admin', name = 'Super Admin'): Promise<Client> {
  const c = await signup(name);
  await env.DB.prepare('INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, ?, ?, ?)').bind(c.userId, role, 'test', Date.now()).run();
  return c;
}

const GETS = ['/api/admin/crm/overview', '/api/admin/crm/orgs', '/api/admin/crm/users', '/api/admin/crm/activity', '/api/admin/crm/health', '/api/admin/fin/overview', '/api/admin/fin/workspaces', '/api/admin/fin/users', '/api/admin/fin/activity', '/api/admin/fin/health'];

describe('who can open the CRM and Finance super admin consoles', () => {
  it('signed out: 401; signed in without a platform role (even an organisation owner): 404; platform admins: 200', async () => {
    for (const p of GETS) expect((await raw('GET', p)).status, p).toBe(401);
    const owner = await signup('Org Owner');
    await createOrg(owner, 'Owner Co');
    await createWs(owner, 'business');
    for (const p of GETS) expect((await owner.req('GET', p)).status, p).toBe(404);
    const admin = await makeAdmin('admin', 'Support Admin');
    for (const p of GETS) expect((await admin.req('GET', p)).status, p).toBe(200);
    // The pages themselves are not served to non-admins either.
    expect((await raw('GET', '/system/crm/admin', { cookie: owner.cookie, headers: { Accept: 'text/html' } })).status).toBe(404);
    expect((await raw('GET', '/system/finance/admin/workspaces', { cookie: owner.cookie, headers: { Accept: 'text/html' } })).status).toBe(404);
    expect((await raw('GET', '/system/finance/admin', { cookie: admin.cookie, headers: { Accept: 'text/html' } })).status).toBe(200);
    expect((await raw('GET', '/crm/admin', { cookie: owner.cookie, headers: { Accept: 'text/html' } })).headers.get('Location')).toBe('/system/crm/admin');
  });
});

describe('the CRM console', () => {
  it('shows organisations, members and counts, restores a deleted organisation and hands over ownership (founder only)', async () => {
    const founder = await makeAdmin('founder', 'Crm Founder');
    const support = await makeAdmin('admin', 'Crm Support');
    const owner = await signup('Crm Owner');
    const colleague = await signup('Crm Colleague');
    const org = await createOrg(owner, 'Admin Visible Pty Ltd');
    await joinOrg(owner, org, colleague, 'manager');
    await owner.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: 'Secret', lastName: 'Lead', email: 'secret.lead@example.com' });
    const list = await founder.json('GET', '/api/admin/crm/orgs?q=admin%20visible');
    expect(list.orgs).toHaveLength(1);
    expect(list.orgs[0]).toMatchObject({ name: 'Admin Visible Pty Ltd', members: 2, leads: 1, owner: { email: owner.email } });
    const detail = await founder.json('GET', `/api/admin/crm/orgs/${org}`);
    expect(detail.members.map((m: any) => m.role).sort()).toEqual(['manager', 'owner']);
    expect(JSON.stringify(detail)).not.toContain('secret.lead@example.com');
    expect(JSON.stringify(detail)).not.toContain('Secret');
    const overview = await founder.json('GET', '/api/admin/crm/overview?range=7d');
    expect(overview.orgs.active).toBeGreaterThanOrEqual(1);
    expect(overview.series.orgsCreated).toHaveLength(7);
    expect((await founder.json('GET', `/api/admin/crm/activity?org=${org}`)).events.length).toBeGreaterThan(0);
    expect((await founder.json('GET', '/api/admin/crm/users?q=crm%20colleague')).users[0]).toMatchObject({ email: colleague.email, orgs: 1, owned: 0 });
    // Restore after the owner deletes it.
    await owner.json('DELETE', `/api/crm/orgs/${org}`, { confirmName: 'Admin Visible Pty Ltd' });
    expect((await owner.req('GET', `/api/crm/orgs/${org}`)).status).toBe(404);
    expect((await founder.json('GET', '/api/admin/crm/orgs?status=deleted')).orgs.some((o: any) => o.id === org)).toBe(true);
    await support.json('POST', `/api/admin/crm/orgs/${org}/restore`, {});
    expect((await owner.json('GET', `/api/crm/orgs/${org}`)).name).toBe('Admin Visible Pty Ltd');
    expect((await support.req('POST', `/api/admin/crm/orgs/${org}/restore`, {})).status).toBe(400);
    // Ownership: an admin may not; the founder may, to a member only.
    expect((await support.req('POST', `/api/admin/crm/orgs/${org}/transfer`, { userId: colleague.userId })).status).toBe(403);
    expect((await founder.req('POST', `/api/admin/crm/orgs/${org}/transfer`, { userId: support.userId })).status).toBe(400);
    await founder.json('POST', `/api/admin/crm/orgs/${org}/transfer`, { userId: colleague.userId });
    const after = await founder.json('GET', `/api/admin/crm/orgs/${org}`);
    expect(Object.fromEntries(after.members.map((m: any) => [m.email, m.role]))).toEqual({ [colleague.email]: 'owner', [owner.email]: 'admin' });
    // Both actions are in the organisation's audit trail and the platform's.
    const actions = (await founder.json('GET', `/api/admin/crm/activity?org=${org}`)).events.map((e: any) => e.action);
    expect(actions).toEqual(expect.arrayContaining(['org.restored_by_platform_admin', 'org.ownership_transferred_by_platform_admin']));
    const platform = await env.DB.prepare("SELECT action FROM audit_log WHERE action LIKE 'admin.crm_%' AND target_id = ?").bind(org).all<{ action: string }>();
    expect(platform.results.map((r) => r.action).sort()).toEqual(['admin.crm_org_restored', 'admin.crm_ownership_transferred']);
  });
});

describe('the Finance console', () => {
  it('counts without amounts, hides personal and household names, checks the ledger, and restores and transfers', async () => {
    const founder = await makeAdmin('founder', 'Fin Founder');
    const owner = await signup('Fin Ws Owner');
    const partner = await signup('Fin Ws Partner');
    const personal = await createWs(owner, 'personal', { name: 'Kevins private money' });
    const biz = await createWs(owner, 'business', { name: 'Visible Trading Pty Ltd' });
    await joinWs(owner, biz, partner, 'accountant');
    const acc = await accounts(owner, biz);
    await owner.json('POST', fin(biz, '/transactions'), { kind: 'spend', accountId: byCode(acc, '090'), date: '2026-10-01', payee: 'Very Private Payee', taxMode: 'none', lines: [{ accountId: byCode(acc, '453'), amount: 123_456 }] });
    const pacc = await accounts(owner, personal);
    await owner.json('POST', fin(personal, '/transactions'), { kind: 'spend', accountId: byCode(pacc, '1000'), date: '2026-10-01', payee: 'Private Pharmacy', lines: [{ accountId: byCode(pacc, '5001'), amount: 98_765 }] });

    const all = JSON.stringify(await Promise.all(['/overview', '/workspaces', `/workspaces/${biz}`, `/workspaces/${personal}`, '/activity', '/health', '/users'].map((p) => founder.json('GET', `/api/admin/fin${p}`))));
    for (const secret of ['Kevins private money', 'Private Pharmacy', 'Very Private Payee', '123456', '1234.56', '98765', '987.65']) expect(all, secret).not.toContain(secret);
    const list = await founder.json('GET', `/api/admin/fin/workspaces?q=${encodeURIComponent(owner.email)}`);
    expect(list.workspaces.map((w: any) => w.label).sort()).toEqual(['Personal workspace', 'Visible Trading Pty Ltd']);
    // A personal workspace's name cannot be found by searching for it either.
    expect((await founder.json('GET', '/api/admin/fin/workspaces?q=kevins%20private')).workspaces).toEqual([]);
    const detail = await founder.json('GET', `/api/admin/fin/workspaces/${biz}`);
    expect(detail.transactions.posted).toBe(1);
    expect(detail.ledger).toMatchObject({ balanced: true, unbalancedJournals: 0, unbalancedWorkspaces: 0, staleDrafts: 0 });
    const health = await founder.json('GET', '/api/admin/fin/health');
    expect(health.checks.find((x: any) => x.key === 'unbalanced_journals')).toMatchObject({ value: 0, ok: true });
    const overview = await founder.json('GET', '/api/admin/fin/overview?range=30d');
    expect(overview.workspaces.business).toBeGreaterThanOrEqual(1);
    expect(overview.records.transactionsPosted).toBeGreaterThanOrEqual(2);
    // Restore and transfer, audited.
    await owner.json('DELETE', fin(biz), { confirmName: 'Visible Trading Pty Ltd' });
    await founder.json('POST', `/api/admin/fin/workspaces/${biz}/restore`, {});
    expect((await owner.json('GET', fin(biz))).name).toBe('Visible Trading Pty Ltd');
    await founder.json('POST', `/api/admin/fin/workspaces/${biz}/transfer`, { userId: partner.userId });
    expect((await partner.json('GET', fin(biz))).role).toBe('owner');
    expect((await owner.json('GET', fin(biz))).role).toBe('admin');
    const actions = (await founder.json('GET', `/api/admin/fin/activity?org=${biz}`)).events.map((e: any) => e.action);
    expect(actions).toEqual(expect.arrayContaining(['org.restored_by_platform_admin', 'org.ownership_transferred_by_platform_admin']));
  });
});

describe('migration 0012: the super admin', () => {
  it('makes a confirmed kevin@kevos.com account founder (upgrading an admin row), and nobody else', async () => {
    const migration = env.TEST_MIGRATIONS.find((m) => m.name === '0012_super_admin.sql')!;
    const run = async () => {
      for (const q of migration.queries) await env.DB.prepare(q).run();
    };
    const kevin = await signup('Kevin', 'kevin@kevos.com');
    const other = await signup('Someone Else');
    await env.DB.prepare('INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, ?, ?, ?)').bind(kevin.userId, 'admin', 'test', Date.now()).run();
    // An address nobody has confirmed gets nothing.
    await env.DB.prepare('UPDATE users SET email_verified_at = NULL WHERE id = ?').bind(kevin.userId).run();
    await run();
    expect((await env.DB.prepare('SELECT role FROM platform_admins WHERE user_id = ?').bind(kevin.userId).first<{ role: string }>())?.role).toBe('admin');
    await env.DB.prepare('UPDATE users SET email_verified_at = ? WHERE id = ?').bind(Date.now(), kevin.userId).run();
    await run();
    await run(); // idempotent
    const role = (id: string) => env.DB.prepare('SELECT role FROM platform_admins WHERE user_id = ?').bind(id).first<{ role: string }>();
    expect((await role(kevin.userId))?.role).toBe('founder');
    expect(await role(other.userId)).toBeNull();
    expect((await kevin.json('GET', '/api/admin/crm/overview')).orgs).toBeDefined();
    expect((await kevin.json('GET', '/api/admin/fin/overview')).workspaces).toBeDefined();
    expect((await kevin.json('GET', '/api/admin/me')).role).toBe('founder');
  });
});
