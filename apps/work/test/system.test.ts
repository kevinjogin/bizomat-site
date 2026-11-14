// BIZOMAT System (src/worker/system): every person's own company, their tools grouped by the company that holds them,
// isolation between companies, CAD Automation status scoped to a company, the CAD status report and the super
// admin's console.
import { SELF, env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { addMember, raw, signup, uniqueEmail, type Client } from './helpers';
import { createOrg, joinOrg } from './crm-helpers';
import { createWs } from './fin-helpers';
import { abnValid } from '../src/worker/company/verify';
import { backfillOwnCompanies } from '../src/worker/system/system';

const CAD_AUTH = `Basic ${btoa('cad:test-cad-status-secret')}`;

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registerCompany(c: Client, name: string) {
  const res = await c.req('POST', '/api/company/companies', {
    kind: 'business',
    name,
    legalName: '',
    abn: newAbn(),
    acn: '',
    email: uniqueEmail('accounts'),
    phone: '(02) 9876 5432',
    addressLine1: '12 Example Street',
    addressLine2: '',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    website: '',
  });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return data as { company: { id: string }; tools: { tasks?: string; crm?: string; finance?: string } };
}

async function joinCompany(owner: Client, companyId: string, invitee: Client, role: 'admin' | 'member') {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role, tasksRole: 'member', crmRole: null, finRole: null });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const confirmEmail = (c: Client) => env.DB.prepare('UPDATE users SET email_verified_at = ? WHERE id = ?').bind(Date.now(), c.userId).run();

function cadReport(accounts: unknown[], auth = CAD_AUTH) {
  return SELF.fetch('http://example.com/api/id/cad-status', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: auth }, body: JSON.stringify({ accounts }) });
}

const grant = (c: Client, role: 'founder' | 'admin') =>
  env.DB.prepare('INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, ?, ?, ?)').bind(c.userId, role, 'test', Date.now()).run();

describe('own companies and tools by company', () => {
  it('gives each person a company of their own holding the tools they own, made once', async () => {
    const a = await signup('Ola Own');
    const me = await a.json('GET', '/api/system/me');
    const own = me.companies.find((c: any) => c.kind === 'own');
    expect(own).toMatchObject({ name: 'Ola Own', role: 'owner' });
    expect(own.apps).toEqual(['tasks']);
    const again = await a.json('GET', '/api/system/me');
    expect(again.companies.filter((c: any) => c.kind === 'own')).toHaveLength(1);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM sys_companies WHERE owner_id = ?').bind(a.userId).first<{ n: number }>())?.n).toBe(1);

    const crm = await createOrg(a, 'Ola Leads');
    const fin = await createWs(a, 'business');
    const view = await a.json('GET', `/api/system/companies/${own.id}`);
    expect(view.tools.map((t: any) => `${t.app}:${t.id}`).sort()).toEqual([`crm:${crm}`, `finance:${fin}`, `tasks:${a.workspaceId}`].sort());
    const ws = view.tools.find((t: any) => t.app === 'tasks');
    expect(ws.url).toBe(`/system/tasks/w/${a.workspaceId}/home`);
    expect(ws.numbers).toMatchObject({ open: 0, projects: expect.any(Number) });
    // Someone added to the workspace as a member sees it under Ola's company, without the workspace's figures.
    const m = await signup('Max Member');
    await addMember(a, m, 'member');
    const mme = await m.json('GET', '/api/system/me');
    expect(mme.companies.find((c: any) => c.id === own.id)).toMatchObject({ role: 'guest', apps: ['tasks'] });
    const mview = await m.json('GET', `/api/system/companies/${own.id}`);
    expect(mview.tools).toHaveLength(1);
    expect(mview.tools[0]).toMatchObject({ id: a.workspaceId, role: 'member', numbers: null });

    await a.json('PATCH', `/api/system/companies/${own.id}`, { name: 'Ola Studio' });
    expect((await a.json('GET', '/api/system/me')).companies.find((c: any) => c.id === own.id).name).toBe('Ola Studio');
  });

  it('the maintenance backfill makes the missing own companies and is idempotent', async () => {
    const a = await signup('Bea Backfill');
    expect(await env.DB.prepare('SELECT 1 FROM sys_companies WHERE owner_id = ?').bind(a.userId).first()).toBeNull();
    await backfillOwnCompanies(env.DB as any, 5000);
    const row = await env.DB.prepare("SELECT name, created_via FROM sys_companies WHERE owner_id = ?").bind(a.userId).first<any>();
    expect(row).toMatchObject({ name: 'Bea Backfill', created_via: 'backfill' });
    expect(await backfillOwnCompanies(env.DB as any, 5000)).toBe(0);
  });

  it('puts a registered company’s tools in that company, and a tool shared with someone under its owner’s company', async () => {
    const owner = await signup('Reg Owner');
    const { company, tools } = await registerCompany(owner, 'Harbour Works');
    const me = await owner.json('GET', '/api/system/me');
    const reg = me.companies.find((c: any) => c.id === company.id);
    expect(reg).toMatchObject({ kind: 'registered', role: 'owner', name: 'Harbour Works' });
    expect(reg.apps.sort()).toEqual(['crm', 'finance', 'tasks']);
    // The company's tools are not also listed in the owner's own company.
    const own = me.companies.find((c: any) => c.kind === 'own');
    const ownView = await owner.json('GET', `/api/system/companies/${own.id}`);
    expect(ownView.tools.map((t: any) => t.id)).not.toContain(tools.crm);

    // Someone added straight to a tool (not to the company) sees that tool under the company, as a guest, and nothing else.
    const guest = await signup('Gil Guest');
    await joinOrg(owner, tools.crm!, guest, 'sales');
    const gme = await guest.json('GET', '/api/system/me');
    const shared = gme.companies.find((c: any) => c.id === company.id);
    expect(shared).toMatchObject({ role: 'guest', toolCount: 1, apps: ['crm'] });
    const gview = await guest.json('GET', `/api/system/companies/${company.id}`);
    expect(gview.tools.map((t: any) => t.id)).toEqual([tools.crm]);
    expect(gview.people).toBeNull();
    expect((await guest.req('PATCH', `/api/system/companies/${company.id}`, { name: 'Taken' })).status).toBe(403);
    // A tool shared from someone's own company sits under that person's own company.
    const solo = await signup('Sol Solo');
    const soloCrm = await createOrg(solo, 'Solo Leads');
    await joinOrg(solo, soloCrm, guest, 'member');
    const after = await guest.json('GET', '/api/system/me');
    const soloOwn = await env.DB.prepare('SELECT id FROM sys_companies WHERE owner_id = ?').bind(solo.userId).first<{ id: string }>();
    expect(after.companies.find((c: any) => c.id === soloOwn!.id)).toMatchObject({ kind: 'own', role: 'guest', apps: ['crm'] });
  });

  it('never shows one company to people outside it', async () => {
    const a = await signup('Ann Alpha');
    const b = await signup('Ben Beta');
    const { company } = await registerCompany(a, 'Alpha Pty Ltd');
    const aOwn = (await a.json('GET', '/api/system/me')).companies.find((c: any) => c.kind === 'own');
    for (const id of [company.id, aOwn.id]) {
      expect((await b.req('GET', `/api/system/companies/${id}`)).status).toBe(404);
      expect((await b.req('GET', `/api/system/companies/${id}/cad`)).status).toBe(404);
      expect((await b.req('PATCH', `/api/system/companies/${id}`, { name: 'Mine now' })).status).toBe(404);
    }
    expect((await b.json('GET', '/api/system/me')).companies.map((c: any) => c.id)).not.toContain(company.id);
    expect((await raw('GET', '/api/system/me')).status).toBe(401);
    // The same API under the System's own address.
    expect((await raw('GET', '/system/api/system/me')).status).toBe(401);
    expect((await SELF.fetch('http://example.com/system/login')).status).toBe(200);
  });
});

describe('CAD Automation in the System', () => {
  it('takes status reports only from the CAD client with its secret', async () => {
    const one = { email: uniqueEmail('cad'), emailVerified: true, computers: [], jobs: [], assistants: [] };
    expect((await cadReport([one], `Basic ${btoa('cad:wrong-secret')}`)).status).toBe(401);
    expect((await cadReport([one], `Basic ${btoa('cad-test:test-client-secret')}`)).status).toBe(403);
    expect((await cadReport([one], '')).status).toBe(401);
    const bad = await cadReport([{ ...one, computers: Array.from({ length: 21 }, (_, i) => ({ name: `PC${i}`, online: true })) }]);
    expect(bad.status).toBe(400);
    const ok = await cadReport([one]);
    expect(ok.status).toBe(200);
    expect(((await ok.json()) as any).accounts).toBe(1);
    // A later report replaces the earlier one.
    await cadReport([{ ...one, computers: [{ name: 'WS-1', online: true }] }]);
    const row = await env.DB.prepare('SELECT computers_json FROM sys_cad_status WHERE email = ?').bind(one.email).first<{ computers_json: string }>();
    expect(JSON.parse(row!.computers_json)).toEqual([{ name: 'WS-1', online: true }]);
  });

  it('shows the company’s owner and administrators everyone’s computers, each member only their own, and no other company anything', async () => {
    const owner = await signup('Cora Owner');
    const admin = await signup('Abe Admin');
    const member = await signup('Mia Member');
    const outsider = await signup('Oz Outsider');
    for (const c of [owner, admin, member, outsider]) await confirmEmail(c);
    const { company } = await registerCompany(owner, 'Cora Engineering');
    await joinCompany(owner, company.id, admin, 'admin');
    await joinCompany(owner, company.id, member, 'member');
    const report = (c: Client, pc: string) => ({ email: c.email, emailVerified: true, computers: [{ name: pc, online: true, solidworks: '2024 SP2' }], jobs: [{ id: `job-${pc}`, tool: 'sw_add_features', status: 'done', at: Date.now() }], assistants: [{ app: 'Claude', lastUsed: Date.now() }] });
    // The member's report is matched by their BIZOMAT account id, the others' by confirmed email.
    const res = await cadReport([report(owner, 'OWNER-PC'), report(admin, 'ADMIN-PC'), { ...report(member, 'MEMBER-PC'), email: uniqueEmail('elsewhere'), sub: member.userId }, report(outsider, 'OUTSIDER-PC')]);
    expect(res.status).toBe(200);

    const pcs = (r: any) => r.people.flatMap((p: any) => (p.status?.computers ?? []).map((m: any) => m.name)).sort();
    const asOwner = await owner.json('GET', `/api/system/companies/${company.id}/cad`);
    expect(asOwner.scope).toBe('company');
    expect(pcs(asOwner)).toEqual(['ADMIN-PC', 'MEMBER-PC', 'OWNER-PC']);
    const asAdmin = await admin.json('GET', `/api/system/companies/${company.id}/cad`);
    expect(pcs(asAdmin)).toEqual(['ADMIN-PC', 'MEMBER-PC', 'OWNER-PC']);
    const asMember = await member.json('GET', `/api/system/companies/${company.id}/cad`);
    expect(asMember.scope).toBe('self');
    expect(pcs(asMember)).toEqual(['MEMBER-PC']);
    expect((await outsider.req('GET', `/api/system/companies/${company.id}/cad`)).status).toBe(404);
    const outsiderOwn = (await outsider.json('GET', '/api/system/me')).companies.find((c: any) => c.kind === 'own');
    expect(pcs(await outsider.json('GET', `/api/system/companies/${outsiderOwn.id}/cad`))).toEqual(['OUTSIDER-PC']);
    expect(JSON.stringify(asOwner)).not.toContain('OUTSIDER-PC');

    // A guest (one tool shared, not a company member) sees no CAD computers in that company.
    const guest = await signup('Gwen Guest');
    const tools = (await owner.json('GET', `/api/system/companies/${company.id}`)).tools;
    await joinOrg(owner, tools.find((t: any) => t.app === 'crm').id, guest, 'sales');
    expect(await guest.json('GET', `/api/system/companies/${company.id}/cad`)).toEqual({ scope: 'none', people: [] });
  });

  it('matches by email only when both sides have confirmed it', async () => {
    const a = await signup('Una Unconfirmed');
    await env.DB.prepare('UPDATE users SET email_verified_at = NULL WHERE id = ?').bind(a.userId).run();
    await cadReport([{ email: a.email, emailVerified: true, computers: [{ name: 'X-PC', online: false }], jobs: [], assistants: [] }]);
    const own = (await a.json('GET', '/api/system/me')).companies.find((c: any) => c.kind === 'own');
    expect((await a.json('GET', `/api/system/companies/${own.id}/cad`)).people[0].status).toBeNull();
    await confirmEmail(a);
    await cadReport([{ email: a.email, emailVerified: false, computers: [{ name: 'X-PC', online: false }], jobs: [], assistants: [] }]);
    expect((await a.json('GET', `/api/system/companies/${own.id}/cad`)).people[0].status).toBeNull();
    await cadReport([{ email: a.email, emailVerified: true, computers: [{ name: 'X-PC', online: false }], jobs: [], assistants: [] }]);
    expect((await a.json('GET', `/api/system/companies/${own.id}/cad`)).people[0].status.computers[0].name).toBe('X-PC');
  });
});

describe('super admin console', () => {
  const GETS = ['/api/admin/system/overview', '/api/admin/system/users', '/api/admin/system/companies', '/api/admin/system/activity'];

  it('answers 404 to everyone but platform admins', async () => {
    const c = await signup('Pat Plain');
    for (const p of GETS) expect((await c.req('GET', p)).status).toBe(404);
    expect((await c.req('POST', '/api/admin/system/backfill', {})).status).toBe(404);
    expect((await raw('GET', GETS[0])).status).toBe(401);
  });

  it('lists every account and company with activity across the tools; only the founder changes anything', async () => {
    const founder = await signup('Fay Founder');
    const support = await signup('Sam Support');
    await grant(founder, 'founder');
    await grant(support, 'admin');
    const owner = await signup('Rob Registered');
    const { company } = await registerCompany(owner, 'Rob Fabrication');
    await createOrg(owner, 'Rob Leads');

    for (const p of GETS) expect((await support.req('GET', p)).status).toBe(200);
    const overview = await founder.json('GET', '/api/admin/system/overview');
    expect(overview.users.total).toBeGreaterThan(2);
    expect(overview.companies.registered).toBeGreaterThan(0);

    const users = await founder.json('GET', `/api/admin/system/users?q=${encodeURIComponent(owner.email)}`);
    expect(users.users).toHaveLength(1);
    expect(users.users[0]).toMatchObject({ id: owner.userId, tasks: 2, crm: 2 });
    expect(users.users[0].registered).toContain('Rob Fabrication (owner)');
    const companies = await founder.json('GET', '/api/admin/system/companies?q=Rob%20Fabrication');
    expect(companies.companies[0]).toMatchObject({ id: company.id, kind: 'registered', owner_email: owner.email, people: 1, tools: 3 });

    const activity = await founder.json('GET', `/api/admin/system/activity?user=${owner.userId}`);
    const apps = new Set(activity.events.map((e: any) => e.app));
    expect(apps.has('sign-in')).toBe(true);
    expect(apps.has('company')).toBe(true);
    expect(activity.events.every((e: any) => e.actor_id === owner.userId)).toBe(true);
    const crmOnly = await founder.json('GET', '/api/admin/system/activity?app=crm');
    expect(crmOnly.events.every((e: any) => e.app === 'crm')).toBe(true);
    // Usage only: the record's name is never in the feed.
    expect(JSON.stringify(crmOnly)).not.toContain('secret');

    // Only the founder acts.
    expect((await support.req('POST', `/api/admin/system/users/${owner.userId}/disable`, {})).status).toBe(403);
    expect((await support.req('POST', `/api/admin/system/companies/${company.id}/suspend`, {})).status).toBe(403);
    expect((await support.req('POST', '/api/admin/system/backfill', {})).status).toBe(403);
    expect((await founder.req('POST', `/api/admin/system/users/${founder.userId}/disable`, {})).status).toBe(400);

    await founder.json('POST', `/api/admin/system/users/${owner.userId}/disable`, {});
    expect((await owner.req('GET', '/api/system/me')).status).toBe(401);
    await founder.json('POST', `/api/admin/system/users/${owner.userId}/enable`, {});
    expect((await env.DB.prepare('SELECT disabled_at FROM users WHERE id = ?').bind(owner.userId).first<any>()).disabled_at).toBeNull();

    await founder.json('POST', `/api/admin/system/companies/${company.id}/suspend`, {});
    expect((await env.DB.prepare('SELECT suspended_at FROM co_companies WHERE id = ?').bind(company.id).first<any>()).suspended_at).toBeTruthy();
    await founder.json('POST', `/api/admin/system/companies/${company.id}/resume`, {});
    expect((await env.DB.prepare('SELECT suspended_at FROM co_companies WHERE id = ?').bind(company.id).first<any>()).suspended_at).toBeNull();

    const made = await founder.json('POST', '/api/admin/system/backfill', {});
    expect(made.made).toBeGreaterThanOrEqual(0);
    expect((await founder.json('POST', '/api/admin/system/backfill', {})).made).toBe(0);
    const audit = await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE actor_id = ? AND action LIKE 'system.%'").bind(founder.userId).first<{ n: number }>();
    expect(audit!.n).toBeGreaterThanOrEqual(4);
  });
});
