// BIZOMAT ERP's example company (src/worker/system/example.ts, migration 0019): every person's own "Acme Studio
// (example)" of invented data, made through the app's own API, private to them, sending no email, removable and made
// again only when asked.
import { env } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import { signup, type Client } from './helpers';
import { setEmailProviderForTests, type EmailProvider, type OutgoingEmail } from '../src/worker/services/email/provider';
import { notify } from '../src/worker/services/notify';
import { crmNotify } from '../src/worker/crm/notify';
import { finNotify } from '../src/worker/fin/util';
import { systemSvc } from '../src/worker/services/context';
import { EXAMPLE_NAME } from '../src/worker/system/example';

class FakeProvider implements EmailProvider {
  name = 'fake';
  sent: OutgoingEmail[] = [];
  async send(m: OutgoingEmail) {
    this.sent.push(m);
    return { ok: true as const, messageId: `<m${this.sent.length}@test>` };
  }
}
afterEach(() => setEmailProviderForTests(null));

const grantFounder = (c: Client) =>
  env.DB.prepare('INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, ?, ?, ?)').bind(c.userId, 'founder', 'test', Date.now()).run();

async function withExample(name = 'Ex Ample') {
  const a = await signup(name);
  const res = await a.req('POST', '/api/system/demo', {});
  expect(res.status).toBe(201);
  const built = (await res.json()) as { status: string; companyId: string };
  expect(built.status).toBe('ready');
  const row = await env.DB.prepare('SELECT * FROM sys_demo WHERE user_id = ?').bind(a.userId).first<any>();
  return { a, companyId: built.companyId, ws: row.workspace_id as string, crm: row.crm_org_id as string, fin: row.fin_org_id as string };
}

describe('the example company', () => {
  it('is made once, through the API, with every tool grouped under it and none in the person\'s own company', async () => {
    const a = await signup('First Visit');
    const before = await a.json('GET', '/api/system/me');
    expect(before.example).toEqual({ status: 'none' });
    const started = Date.now();
    const res = await a.req('POST', '/api/system/demo', {});
    const took = Date.now() - started;
    expect(res.status).toBe(201);
    const built = (await res.json()) as any;
    expect(built).toMatchObject({ status: 'ready', built: true });
    console.log(`example company built in ${took} ms (workerd)`);

    const me = await a.json('GET', '/api/system/me');
    expect(me.example).toMatchObject({ status: 'ready', companyId: built.companyId });
    const demo = me.companies.find((c: any) => c.kind === 'demo');
    expect(demo).toMatchObject({ id: built.companyId, name: EXAMPLE_NAME, role: 'owner', toolCount: 3 });
    expect(me.companies[me.companies.length - 1].kind).toBe('demo');
    const own = me.companies.find((c: any) => c.kind === 'own');
    const ownView = await a.json('GET', `/api/system/companies/${own.id}`);
    expect(ownView.tools.map((t: any) => t.name)).not.toContain(EXAMPLE_NAME);
    expect(ownView.tools.some((t: any) => t.id === a.workspaceId)).toBe(true);

    const view = await a.json('GET', `/api/system/companies/${built.companyId}`);
    expect(view.tools.map((t: any) => t.app).sort()).toEqual(['crm', 'finance', 'tasks']);
    expect(view.tools.every((t: any) => t.name === EXAMPLE_NAME)).toBe(true);

    // The content went through each tool's own API.
    const row = await env.DB.prepare('SELECT * FROM sys_demo WHERE user_id = ?').bind(a.userId).first<any>();
    const boards = await a.json('GET', `/api/workspaces/${row.workspace_id}/boards`);
    expect(boards.map((b: any) => b.name)).toEqual(expect.arrayContaining(['Website relaunch', 'Product launch']));
    const deals = await a.json('GET', `/api/crm/orgs/${row.crm_org_id}/deals`);
    expect((deals.items ?? deals.rows ?? deals).length).toBeGreaterThanOrEqual(3);
    const quotes = await a.json('GET', `/api/fin/orgs/${row.fin_org_id}/quotes`);
    expect((quotes.items ?? quotes.rows ?? quotes).length).toBe(1);
    const overview = await a.json('GET', `/api/maintenance/c/${built.companyId}/overview`);
    expect(overview.assets).toBe(7);
    expect(overview.openWorkOrders).toBe(2);
    expect(overview.openRequests).toBeGreaterThanOrEqual(2);

    // The build's API token is gone.
    const tokens = await env.DB.prepare('SELECT COUNT(*) AS n FROM api_tokens WHERE user_id = ?').bind(a.userId).first<{ n: number }>();
    expect(tokens!.n).toBe(0);

    // Asking again answers with the same company and makes nothing more.
    const again = await a.req('POST', '/api/system/demo', {});
    expect(again.status).toBe(200);
    expect(((await again.json()) as any).companyId).toBe(built.companyId);
    const owned = await env.DB.prepare("SELECT COUNT(*) AS n FROM workspaces w JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = ? AND m.role = 'owner' WHERE w.name = ? AND w.deleted_at IS NULL").bind(a.userId, EXAMPLE_NAME).first<{ n: number }>();
    expect(owned!.n).toBe(1);
  });

  it('is made once when two requests arrive together', async () => {
    const a = await signup('Two Tabs');
    const [r1, r2] = await Promise.all([a.req('POST', '/api/system/demo', {}), a.req('POST', '/api/system/demo', {})]);
    expect([r1.status, r2.status].sort()).toEqual(expect.arrayContaining([201]));
    expect([r1.status, r2.status].filter((s) => s === 201)).toHaveLength(1);
    const owned = await env.DB.prepare("SELECT COUNT(*) AS n FROM crm_orgs o JOIN crm_members m ON m.org_id = o.id AND m.user_id = ? AND m.role = 'owner' WHERE o.name = ? AND o.deleted_at IS NULL").bind(a.userId, EXAMPLE_NAME).first<{ n: number }>();
    expect(owned!.n).toBe(1);
  });

  it('is private: nobody else can see it, open its tools or its maintenance, or be invited to it', async () => {
    const { a, companyId, ws, crm, fin } = await withExample('Private Owner');
    const b = await signup('Someone Else');
    expect((await b.req('GET', `/api/system/companies/${companyId}`)).status).toBe(404);
    expect((await b.req('GET', `/api/maintenance/c/${companyId}/me`)).status).toBe(404);
    expect([403, 404]).toContain((await b.req('GET', `/api/workspaces/${ws}`)).status);
    expect([403, 404]).toContain((await b.req('GET', `/api/crm/orgs/${crm}`)).status);
    expect([403, 404]).toContain((await b.req('GET', `/api/fin/orgs/${fin}`)).status);
    const bMe = await b.json('GET', '/api/system/me');
    expect(bMe.companies.some((c: any) => c.id === companyId)).toBe(false);

    // Invitations into its tools are refused.
    for (const [path, body] of [
      [`/api/workspaces/${ws}/invitations`, { email: b.email, role: 'member' }],
      [`/api/crm/orgs/${crm}/invitations`, { email: b.email, role: 'member' }],
      [`/api/fin/orgs/${fin}/invitations`, { email: b.email, role: 'contributor' }],
    ] as const) {
      const res = await a.req('POST', path, body);
      expect(res.status).toBe(409);
      expect(((await res.json()) as any).details.code).toBe('EXAMPLE_COMPANY');
    }

    // Its maintenance works for its owner, as administrator, with only them in it.
    const mtMe = await a.json('GET', `/api/maintenance/c/${companyId}/me`);
    expect(mtMe).toMatchObject({ role: 'admin', company: { id: companyId, kind: 'demo' } });
    expect(mtMe.people.map((p: any) => p.id)).toEqual([a.userId]);
    const companies = await a.json('GET', '/api/maintenance/companies');
    expect(companies.companies.find((c: any) => c.id === companyId)).toMatchObject({ kind: 'demo', role: 'admin' });
  });

  it('sends no email: notifications stay in the app, and its Finance documents are not emailed', async () => {
    const { a, ws, crm, fin } = await withExample('No Email');
    const provider = new FakeProvider();
    setEmailProviderForTests(provider);
    const svc = systemSvc(env);
    const outbox = async () => (await env.DB.prepare('SELECT COUNT(*) AS n FROM email_outbox WHERE user_id = ?').bind(a.userId).first<{ n: number }>())!.n;

    const start = await outbox();
    expect(await notify(svc, { workspaceId: ws, userIds: [a.userId], type: 'due_soon', title: 'Example item due', entityType: 'item', entityId: 'x1', dedupeKey: `ex:${ws}` })).toBe(1);
    await crmNotify(env, { orgId: crm, orgName: EXAMPLE_NAME, userIds: [a.userId], type: 'overdue', title: 'Example follow-up overdue', dedupeKey: `ex:${crm}` });
    await finNotify(env, { orgId: fin, orgName: EXAMPLE_NAME, userIds: [a.userId], type: 'approval', title: 'Example approval', dedupeKey: `ex:${fin}` });
    expect(await outbox()).toBe(start);
    const inApp = await env.DB.prepare('SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND workspace_id = ?').bind(a.userId, ws).first<{ n: number }>();
    expect(inApp!.n).toBeGreaterThanOrEqual(1);

    // The same notification in the person's real workspace is emailed: the rule is the example's only.
    await notify(svc, { workspaceId: a.workspaceId, userIds: [a.userId], type: 'due_soon', title: 'Real item due', entityType: 'item', entityId: 'x2', dedupeKey: `real:${a.workspaceId}` });
    expect(await outbox()).toBe(start + 1);

    const quotes = await a.json('GET', `/api/fin/orgs/${fin}/quotes`);
    const quote = (quotes.items ?? quotes.rows ?? quotes)[0];
    const res = await a.req('POST', `/api/fin/orgs/${fin}/quotes/${quote.id}/email`, { to: 'someone@example.com' });
    expect(res.status).toBe(409);
    expect(((await res.json()) as any).error).toMatch(/example company/);
  });

  it('is removed on request, stays removed, and is made again only when asked', async () => {
    const { a, companyId, ws, crm, fin } = await withExample('Remove Me');
    const res = await a.req('POST', '/api/system/demo/remove', {});
    expect(res.status).toBe(200);
    const me = await a.json('GET', '/api/system/me');
    expect(me.example).toEqual({ status: 'removed' });
    expect(me.companies.some((c: any) => c.kind === 'demo')).toBe(false);
    for (const [table, id] of [['workspaces', ws], ['crm_orgs', crm], ['fin_orgs', fin]] as const) {
      const r = await env.DB.prepare(`SELECT deleted_at FROM ${table} WHERE id = ?`).bind(id).first<{ deleted_at: number | null }>();
      expect(r!.deleted_at).not.toBeNull();
    }
    const left = await env.DB.prepare('SELECT (SELECT COUNT(*) FROM mt_assets WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_work_orders WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_requests WHERE company_id = ?1) + (SELECT COUNT(*) FROM mt_events WHERE company_id = ?1) AS n').bind(companyId).first<{ n: number }>();
    expect(left!.n).toBe(0);
    expect((await a.req('GET', `/api/maintenance/c/${companyId}/me`)).status).toBe(404);

    // The first-visit request does not bring it back.
    const auto = await a.req('POST', '/api/system/demo', {});
    expect(auto.status).toBe(200);
    expect(((await auto.json()) as any).status).toBe('removed');

    // Asked for again, it is made again with new tools.
    const again = await a.req('POST', '/api/system/demo', { again: true });
    expect(again.status).toBe(201);
    const row = await env.DB.prepare('SELECT * FROM sys_demo WHERE user_id = ?').bind(a.userId).first<any>();
    expect(row.status).toBe('ready');
    expect(row.workspace_id).not.toBe(ws);
    expect((await a.json('GET', `/api/maintenance/c/${companyId}/overview`)).assets).toBe(7);
  });

  it('is counted apart in the super admin console, not in the tool totals', async () => {
    const founder = await signup('Console Founder');
    await grantFounder(founder);
    const before = await founder.json('GET', '/api/admin/system/overview');
    await withExample('Counted Apart');
    const after = await founder.json('GET', '/api/admin/system/overview');
    expect(after.companies.examples).toBe(before.companies.examples + 1);
    // The new account's own sign-up workspace counts; its example workspace does not.
    expect(after.tools.workspaces).toBe(before.tools.workspaces + 1);
    expect(after.tools.crm).toBe(before.tools.crm);
    expect(after.tools.finance).toBe(before.tools.finance);
  });

  it('comes from an additive migration', async () => {
    const m = (env as any).TEST_MIGRATIONS.find((x: any) => x.name.startsWith('0019_'));
    expect(m).toBeTruthy();
    const statements = (m.queries as string[]).map((q) => q.split('\n').filter((l) => !l.trim().startsWith('--')).join(' ').trim().split(/\s+/).slice(0, 2).join(' ').toUpperCase());
    expect(statements.length).toBe(4);
    expect(statements.every((s) => s === 'CREATE TABLE' || s === 'CREATE INDEX')).toBe(true);
  });
});
