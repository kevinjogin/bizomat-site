// BIZOMAT company accounts (src/worker/company): registration checks, the tools a company runs, people with a role
// in each tool, departments in every tool, who sees what, and BIZOMAT sign-in for other applications.
import { env } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import { PASSWORD, raw, signup, uniqueEmail, type Client } from './helpers';
import { abnValid, acnValid, checkPostcode, namesMatch, parsePhone, setAbrFetchForTests, statesForPostcode } from '../src/worker/company/verify';
import { checkDetails, type Details } from '../src/worker/company/routes';
import { setMxResolverForTests } from '../src/worker/services/signup-guard';
import { sha256Hex } from '../src/worker/lib/util';
import { pkceChallenge } from '../src/worker/auth/providers';

afterEach(() => {
  setAbrFetchForTests(null);
  setMxResolverForTests(null);
});

/** A fresh ABN with valid check digits (each company needs its own). */
function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

function details(over: Partial<Details> = {}): Details {
  return {
    kind: 'business',
    name: 'Harbour Fabrication',
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
    ...over,
  };
}

async function createCompany(c: Client, over: Partial<Details> & { tools?: unknown } = {}) {
  const res = await c.req('POST', '/api/company/companies', details(over));
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return data as { company: any; tools: { tasks?: string; crm?: string; finance?: string } };
}

async function invite(owner: Client, companyId: string, invitee: Client, body: Record<string, unknown> = {}) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, ...body });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  return { inv, token };
}

describe('registration checks (verify.ts)', () => {
  it('checks ABN and ACN check digits, phone numbers, postcodes and names', () => {
    expect(abnValid('51824753556')).toBe(true); // the register's published example
    expect(abnValid('51824753557')).toBe(false);
    expect(abnValid('5182475355')).toBe(false);
    expect(acnValid('000000019')).toBe(true);
    expect(acnValid('000000018')).toBe(false);

    expect(parsePhone('0413 579 246')).toMatchObject({ ok: true, kind: 'mobile', value: '+61413579246', display: '0413 579 246' });
    expect(parsePhone('+61 2 9876 5432')).toMatchObject({ ok: true, kind: 'landline', value: '+61298765432', display: '(02) 9876 5432' });
    expect(parsePhone('1300 123 457')).toMatchObject({ ok: true, kind: 'local_rate', value: '1300123457' });
    expect(parsePhone('1800 222 333')).toMatchObject({ ok: true, kind: 'freecall' });
    expect(parsePhone('0412 345 678').ok).toBe(false); // a placeholder
    expect(parsePhone('0400 000 000').ok).toBe(false);
    expect(parsePhone('(02) 5550 1234').ok).toBe(false); // reserved for fiction
    expect(parsePhone('0491 570 156').ok).toBe(false);
    expect(parsePhone('+1 415 555 0100').ok).toBe(false); // Australia only for now
    expect(parsePhone('12345').ok).toBe(false);

    expect(checkPostcode('2000', 'NSW').ok).toBe(true);
    expect(checkPostcode('2600', 'ACT').ok).toBe(true);
    expect(checkPostcode('0800', 'NT').ok).toBe(true);
    const wrong = checkPostcode('3000', 'NSW');
    expect(wrong.ok).toBe(false);
    expect(!wrong.ok && wrong.message).toContain('Victoria');
    expect(checkPostcode('200', 'NSW').ok).toBe(false);
    expect(statesForPostcode('6000')).toEqual(['WA']);

    expect(namesMatch('Harbour Fabrication', 'HARBOUR FABRICATION PTY LTD')).toBe(true);
    expect(namesMatch('Kevin Example', 'EXAMPLE, KEVIN')).toBe(true);
    expect(namesMatch('Harbour Fabrication', 'Ridge Electrical Pty Ltd')).toBe(false);
  });

  it('looks the ABN up on the register when ABR_GUID is set, and refuses cancelled or unknown numbers', async () => {
    setMxResolverForTests(async () => 'ok');
    const abn = newAbn();
    const answers: Record<string, unknown> = {};
    const seen: string[] = [];
    setAbrFetchForTests(async (url) => {
      seen.push(url);
      const n = new URL(url).searchParams.get('abn')!;
      return new Response(`abr(${JSON.stringify(answers[n] ?? { Abn: '', Message: 'No records found' })})`);
    });
    const withGuid = { ...env, ABR_GUID: 'test-guid' } as any;

    answers[abn] = { Abn: abn, AbnStatus: 'Active', EntityName: 'HARBOUR FABRICATION PTY LTD', EntityTypeName: 'Australian Private Company', Gst: '2015-07-01', AddressState: 'VIC', AddressPostcode: '3000', Acn: abn.slice(2), BusinessName: [] };
    const ok = await checkDetails(withGuid, details({ abn }));
    expect(ok.problems).toEqual([]);
    expect(ok.abnStatus).toBe('active');
    expect(ok.legalName).toBe('HARBOUR FABRICATION PTY LTD');
    expect(ok.warnings.join(' ')).toContain('main business location in VIC 3000');
    expect(seen[0]).toContain('guid=test-guid');

    const other = await checkDetails(withGuid, details({ abn, name: 'Ridge Electrical' }));
    expect(other.warnings.join(' ')).toContain('The name differs from the Australian Business Register');

    const cancelled = newAbn();
    answers[cancelled] = { Abn: cancelled, AbnStatus: 'Cancelled', EntityName: 'OLD CO', AddressState: 'NSW', AddressPostcode: '2000' };
    expect((await checkDetails(withGuid, details({ abn: cancelled }))).problems[0].message).toContain('cancelled');

    expect((await checkDetails(withGuid, details({ abn: newAbn() }))).problems[0].message).toContain('not on the Australian Business Register');

    // Without the GUID: the check digits only, said plainly.
    const noGuid = await checkDetails(env as any, details());
    expect(noGuid.abnStatus).toBe('format_ok');
    expect(noGuid.warnings.join(' ')).toContain('not been looked up');
  });
});

describe('company accounts', () => {
  it('refuses details that do not check out, field by field', async () => {
    const c = await signup('Ada Owner');
    const bad = async (over: Partial<Details>, field: string) => {
      const res = await c.req('POST', '/api/company/companies', details(over));
      expect(res.status).toBe(400);
      const body = (await res.json()) as any;
      expect(body.details.problems.map((p: any) => p.field)).toContain(field);
    };
    await bad({ abn: '' }, 'abn');
    await bad({ abn: '51824753557' }, 'abn');
    await bad({ postcode: '3000' }, 'postcode');
    await bad({ phone: '0412 345 678' }, 'phone');
    await bad({ addressLine1: 'Example Street' }, 'addressLine1');
    await bad({ email: 'someone@mailinator.com' }, 'email');
    await bad({ acn: '123456789' }, 'acn');
  });

  it('makes a company with its three tools, the creator owning all of them', async () => {
    const c = await signup('Bea Owner');
    // The owner's sign-in address, once confirmed, is the company's confirmed contact address.
    await env.DB.prepare('UPDATE users SET email_verified_at = ? WHERE id = ?').bind(Date.now(), c.userId).run();
    const { company, tools } = await createCompany(c, { name: 'Bea Engineering', email: c.email });
    expect(company.kind).toBe('business');
    expect(company.abnStatus).toBe('format_ok');
    expect(company.emailConfirmed).toBe(true); // the owner's own confirmed address
    expect(company.phone).toBe('(02) 9876 5432');
    expect(Object.keys(tools).sort()).toEqual(['crm', 'finance', 'tasks']);
    const ws = await env.DB.prepare("SELECT w.name, m.role FROM workspaces w JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = ? WHERE w.id = ?").bind(c.userId, tools.tasks).first<any>();
    expect(ws).toMatchObject({ name: 'Bea Engineering', role: 'owner' });
    expect((await env.DB.prepare('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?').bind(tools.crm, c.userId).first<any>()).role).toBe('owner');
    const fin = await env.DB.prepare('SELECT o.kind, o.abn, m.role FROM fin_orgs o JOIN fin_members m ON m.org_id = o.id AND m.user_id = ? WHERE o.id = ?').bind(c.userId, tools.finance).first<any>();
    expect(fin.kind).toBe('business');
    expect(fin.role).toBe('owner');
    expect(fin.abn).toHaveLength(11);
    const view = await c.json('GET', `/api/company/c/${company.id}`);
    expect(view.me.role).toBe('owner');
    expect(view.tools.tasks.myRole).toBe('owner');
    const mine = await c.json('GET', '/api/company/mine');
    expect(mine.companies.map((x: any) => x.id)).toContain(company.id);
  });

  it('one company per ABN; a person registers once in their own name, with or without an ABN', async () => {
    const a = await signup('Cal First');
    const b = await signup('Dee Second');
    const abn = newAbn();
    await createCompany(a, { abn });
    const dup = await b.req('POST', '/api/company/companies', details({ abn }));
    expect(dup.status).toBe(400);
    expect(((await dup.json()) as any).error).toContain('already uses this ABN');

    const own = await createCompany(b, { kind: 'individual', name: 'Dee Second', abn: '' });
    expect(own.company.kind).toBe('individual');
    expect(own.company.abnStatus).toBe('none');
    expect(own.company.legalName).toBe('Dee Second');
    const again = await b.req('POST', '/api/company/companies', details({ kind: 'individual', name: 'Dee Second', abn: '' }));
    expect(again.status).toBe(400);
  });

  it('takes on tools the owner already runs, never a personal Finance workspace or someone else’s', async () => {
    const a = await signup('Eve Owner');
    const b = await signup('Finn Other');
    const personal = await a.json('POST', '/api/fin/orgs', { name: 'My money', kind: 'personal' });
    const refused = await a.req('POST', '/api/company/companies', { ...details(), tools: { tasks: null, crm: null, finance: { link: personal.id } } });
    expect(refused.status).toBe(400);
    expect(((await refused.json()) as any).error).toContain('Personal and household workspaces stay private');
    const notMine = await a.req('POST', '/api/company/companies', { ...details(), tools: { tasks: { link: b.workspaceId }, crm: null, finance: null } });
    expect(notMine.status).toBe(400);

    const { tools } = await createCompany(a, { tools: { tasks: { link: a.workspaceId }, crm: { create: true }, finance: null } } as any);
    expect(tools.tasks).toBe(a.workspaceId);
    expect(tools.finance).toBeUndefined();
    // Each tool belongs to one company only.
    const twice = await a.req('POST', '/api/company/companies', { ...details(), tools: { tasks: { link: a.workspaceId }, crm: null, finance: null } });
    expect(twice.status).toBe(409);
  });

  it('invites people with a role in each tool and a department; accepting puts them in every tool', async () => {
    const owner = await signup('Gus Owner');
    const { company, tools } = await createCompany(owner);
    const dept = await owner.json('POST', `/api/company/c/${company.id}/departments`, { name: 'Sales', headId: owner.userId });
    const bob = await signup('Hal Seller');
    const { token } = await invite(owner, company.id, bob, { tasksRole: 'member', crmRole: 'sales', finRole: 'viewer', departmentIds: [dept.id], title: 'Account manager' });

    const preview = await raw('GET', `/api/company-public/invitations/${token}`);
    expect(preview.status).toBe(200);
    const p = (await preview.json()) as any;
    expect(p).toMatchObject({ company: company.name, status: 'pending', role: 'member', hasAccount: true });
    expect(p.tools).toContain('Customer Relationship Management');
    expect(JSON.stringify(p)).not.toContain(bob.email);

    const stranger = await signup('Ivy Stranger');
    expect((await stranger.req('POST', `/api/company/invitations/${token}/accept`, {})).status).toBe(403);
    await bob.json('POST', `/api/company/invitations/${token}/accept`, {});

    const role = async (sql: string, id: string) => (await env.DB.prepare(sql).bind(id, bob.userId).first<any>())?.role ?? null;
    expect(await role('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?', tools.tasks!)).toBe('member');
    expect(await role('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?', tools.crm!)).toBe('sales');
    expect(await role('SELECT role FROM fin_members WHERE org_id = ? AND user_id = ?', tools.finance!)).toBe('viewer');
    const d = await env.DB.prepare('SELECT * FROM co_departments WHERE id = ?').bind(dept.id).first<any>();
    expect(d.pm_team_id && d.crm_team_id && d.fin_tracking_id).toBeTruthy();
    expect(await env.DB.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').bind(d.pm_team_id, bob.userId).first()).toBeTruthy();
    expect(await env.DB.prepare('SELECT 1 FROM crm_team_members WHERE team_id = ? AND user_id = ?').bind(d.crm_team_id, bob.userId).first()).toBeTruthy();
    expect((await env.DB.prepare('SELECT kind, name FROM fin_tracking WHERE id = ?').bind(d.fin_tracking_id).first<any>())).toMatchObject({ kind: 'department', name: 'Sales' });
    expect((await env.DB.prepare('SELECT lead_id FROM crm_teams WHERE id = ?').bind(d.crm_team_id).first<any>()).lead_id).toBe(owner.userId);

    // Changing a tool role changes it in that tool only; taking it away takes them out of the tool and its team.
    await owner.json('PATCH', `/api/company/c/${company.id}/members/${bob.userId}`, { crmRole: null, finRole: 'accountant' });
    expect(await role('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?', tools.crm!)).toBeNull();
    expect(await env.DB.prepare('SELECT 1 FROM crm_team_members WHERE team_id = ? AND user_id = ?').bind(d.crm_team_id, bob.userId).first()).toBeNull();
    expect(await role('SELECT role FROM fin_members WHERE org_id = ? AND user_id = ?', tools.finance!)).toBe('accountant');
    expect(await role('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?', tools.tasks!)).toBe('member');

    // Leaving the company leaves every tool.
    await bob.json('POST', `/api/company/c/${company.id}/leave`, {});
    expect(await role('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?', tools.tasks!)).toBeNull();
    expect(await role('SELECT role FROM fin_members WHERE org_id = ? AND user_id = ?', tools.finance!)).toBeNull();
    expect(await env.DB.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').bind(d.pm_team_id, bob.userId).first()).toBeNull();
  });

  it('keeps companies apart and roles in their place', async () => {
    const owner = await signup('Jo Owner');
    const { company } = await createCompany(owner);
    const outsider = await signup('Kai Outsider');
    expect((await outsider.req('GET', `/api/company/c/${company.id}`)).status).toBe(404);
    expect((await outsider.req('GET', `/api/company/c/${company.id}/members`)).status).toBe(404);
    expect((await outsider.req('GET', `/api/company/c/${company.id}/overview`)).status).toBe(404);

    const member = await signup('Lee Member');
    const { token } = await invite(owner, company.id, member, { tasksRole: 'viewer' });
    await member.json('POST', `/api/company/invitations/${token}/accept`, {});
    expect((await member.req('PATCH', `/api/company/c/${company.id}`, details())).status).toBe(403);
    expect((await member.req('POST', `/api/company/c/${company.id}/invitations`, { email: uniqueEmail() })).status).toBe(403);
    expect((await member.req('POST', `/api/company/c/${company.id}/departments`, { name: 'Ops' })).status).toBe(403);
    expect((await member.req('GET', `/api/company/c/${company.id}/activity`)).status).toBe(403);
    expect((await member.req('POST', `/api/company/c/${company.id}/transfer`, { userId: member.userId })).status).toBe(403);
    // Members see the people, without their last activity.
    const people = await member.json('GET', `/api/company/c/${company.id}/members`);
    expect(people.members.every((m: any) => m.lastActiveAt === null)).toBe(true);
    expect(people.toolOnly).toEqual([]);
  });

  it('shows each person only the numbers they could see in the tool; a head sees their department', async () => {
    const owner = await signup('Max Owner');
    const { company, tools } = await createCompany(owner);
    await owner.json('POST', `/api/crm/orgs/${tools.crm}/deals`, { title: 'Conveyor upgrade', value: 1500000 });
    const head = await signup('Nia Head');
    const plain = await signup('Oli Plain');
    const t1 = await invite(owner, company.id, head, { crmRole: 'sales', tasksRole: 'member' });
    await head.json('POST', `/api/company/invitations/${t1.token}/accept`, {});
    // Every CRM role sees every deal, so the CRM's numbers would be theirs to see: this person has Tasks only.
    const t2 = await invite(owner, company.id, plain, { tasksRole: 'viewer' });
    await plain.json('POST', `/api/company/invitations/${t2.token}/accept`, {});
    const dept = await owner.json('POST', `/api/company/c/${company.id}/departments`, { name: 'Projects', headId: head.userId, memberIds: [owner.userId] });

    const mine = await owner.json('GET', `/api/company/c/${company.id}/overview`);
    expect(mine.seesAll).toEqual({ tasks: true, crm: true, finance: true });
    expect(mine.company.crm).toMatchObject({ openDeals: 1, openValue: 1500000 });
    expect(mine.company.finance).toMatchObject({ income: 0, expenses: 0, receivable: 0 });
    expect(mine.company.tasks.projects).toBeGreaterThanOrEqual(0);

    const theirs = await plain.json('GET', `/api/company/c/${company.id}/overview`);
    expect(theirs.seesAll).toEqual({ tasks: false, crm: false, finance: false });
    expect(theirs.company).toEqual({ tasks: null, crm: null, finance: null });
    expect(theirs.departments[0]).toMatchObject({ id: dept.id, crm: null, finance: null });

    const heads = await head.json('GET', `/api/company/c/${company.id}/overview`);
    expect(heads.company.finance).toBeNull();
    const d = heads.departments.find((x: any) => x.id === dept.id);
    expect(d.crm).toMatchObject({ openDeals: 1 }); // the owner's deal: the owner is in the department
    expect(d.finance).toMatchObject({ income: 0 });
    // The head may change who is in the department; a plain member may not.
    await head.json('PUT', `/api/company/c/${company.id}/departments/${dept.id}/members`, { userIds: [owner.userId, plain.userId] });
    expect((await plain.req('PUT', `/api/company/c/${company.id}/departments/${dept.id}/members`, { userIds: [] })).status).toBe(403);
  });

  it('nests departments, refuses loops, and archives cleanly in every tool', async () => {
    const owner = await signup('Pat Owner');
    const { company } = await createCompany(owner);
    const ops = await owner.json('POST', `/api/company/c/${company.id}/departments`, { name: 'Operations' });
    const site = await owner.json('POST', `/api/company/c/${company.id}/departments`, { name: 'Site works', parentId: ops.id });
    expect((await owner.req('PATCH', `/api/company/c/${company.id}/departments/${ops.id}`, { parentId: site.id })).status).toBe(400);
    expect((await owner.req('POST', `/api/company/c/${company.id}/departments/${ops.id}/archive`, {})).status).toBe(400);
    const before = await env.DB.prepare('SELECT * FROM co_departments WHERE id = ?').bind(site.id).first<any>();
    await owner.json('POST', `/api/company/c/${company.id}/departments/${site.id}/archive`, {});
    expect(await env.DB.prepare('SELECT 1 FROM teams WHERE id = ?').bind(before.pm_team_id).first()).toBeNull();
    expect(await env.DB.prepare('SELECT 1 FROM crm_teams WHERE id = ?').bind(before.crm_team_id).first()).toBeNull();
    expect((await env.DB.prepare('SELECT archived_at FROM fin_tracking WHERE id = ?').bind(before.fin_tracking_id).first<any>()).archived_at).toBeTruthy();
    await owner.json('POST', `/api/company/c/${company.id}/departments/${site.id}/restore`, {});
    const after = await env.DB.prepare('SELECT * FROM co_departments WHERE id = ?').bind(site.id).first<any>();
    expect(after.pm_team_id).toBeTruthy();
    expect(after.fin_tracking_id).toBe(before.fin_tracking_id);
    expect((await env.DB.prepare('SELECT archived_at FROM fin_tracking WHERE id = ?').bind(before.fin_tracking_id).first<any>()).archived_at).toBeNull();
  });

  it('hands the company and its tools to an administrator', async () => {
    const owner = await signup('Quinn Owner');
    const { company, tools } = await createCompany(owner);
    const next = await signup('Rae Next');
    const { token } = await invite(owner, company.id, next, { role: 'admin', tasksRole: 'admin', crmRole: 'admin', finRole: 'admin' });
    await next.json('POST', `/api/company/invitations/${token}/accept`, {});
    await owner.json('POST', `/api/company/c/${company.id}/transfer`, { userId: next.userId });
    const roleIn = async (sql: string, id: string, uid: string) => (await env.DB.prepare(sql).bind(id, uid).first<any>())?.role;
    expect(await roleIn('SELECT role FROM co_members WHERE company_id = ? AND user_id = ?', company.id, next.userId)).toBe('owner');
    expect(await roleIn('SELECT role FROM co_members WHERE company_id = ? AND user_id = ?', company.id, owner.userId)).toBe('admin');
    expect(await roleIn('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?', tools.crm!, next.userId)).toBe('owner');
    expect(await roleIn('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?', tools.crm!, owner.userId)).toBe('admin');
    expect(await roleIn('SELECT role FROM fin_members WHERE org_id = ? AND user_id = ?', tools.finance!, next.userId)).toBe('owner');
    expect(await roleIn('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?', tools.tasks!, next.userId)).toBe('owner');
    expect(await roleIn('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?', tools.tasks!, owner.userId)).toBe('admin');
  });

  it('confirms a separate contact address by its link', async () => {
    const owner = await signup('Sam Owner');
    const { company } = await createCompany(owner, { email: uniqueEmail('office') });
    expect(company.emailConfirmed).toBe(false);
    const token = 'confirm-token-for-the-test-0123456789';
    await env.DB.prepare('INSERT INTO co_email_confirmations (token_hash, company_id, email, created_at, expires_at) VALUES (?, ?, ?, ?, ?)').bind(await sha256Hex(token), company.id, company.email, Date.now(), Date.now() + 60_000).run();
    const res = await raw('POST', '/api/company-public/confirm-email', { body: { token } });
    expect(res.status).toBe(200);
    expect((await owner.json('GET', `/api/company/c/${company.id}`)).company.emailConfirmed).toBe(true);
    expect((await raw('POST', '/api/company-public/confirm-email', { body: { token } })).status).toBe(400);
  });
});

describe('BIZOMAT sign-in for other applications', () => {
  const redirect = 'https://cad.example.com/auth/bizomat/callback';
  const verifier = 'v'.repeat(20) + 'erifier-for-the-bizomat-sign-in-test-0123';

  async function authorize(c: Client, over: Record<string, unknown> = {}) {
    return c.req('POST', '/api/company/id/authorize', { clientId: 'cad-test', redirectUri: redirect, state: 'state-12345', codeChallenge: await pkceChallenge(verifier), codeChallengeMethod: 'S256', ...over });
  }
  async function fetchToken(form: Record<string, string>) {
    const { SELF } = await import('cloudflare:test');
    return SELF.fetch('http://example.com/api/id/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(form).toString() });
  }

  it('gives a configured application a one-time code, a token and the account', async () => {
    const c = await signup('Tia Designer');
    const { company } = await createCompany(c, { name: 'Tia Design' });
    expect((await authorize(c, { redirectUri: 'https://evil.example.com/cb' })).status).toBe(400);
    expect((await authorize(c, { clientId: 'unknown' })).status).toBe(400);
    const denied = (await (await authorize(c, { deny: true })).json()) as any;
    expect(denied.redirect).toContain('error=access_denied');

    const r = (await (await authorize(c)).json()) as any;
    const url = new URL(r.redirect);
    expect(url.origin + url.pathname).toBe(redirect);
    expect(url.searchParams.get('state')).toBe('state-12345');
    const code = url.searchParams.get('code')!;

    const base = { grant_type: 'authorization_code', code, redirect_uri: redirect, client_id: 'cad-test' };
    expect((await fetchToken({ ...base, client_secret: 'wrong', code_verifier: verifier })).status).toBe(401);
    expect((await fetchToken({ ...base, client_secret: 'test-client-secret', code_verifier: 'x'.repeat(50) })).status).toBe(400);
    const ok = await fetchToken({ ...base, client_secret: 'test-client-secret', code_verifier: verifier });
    expect(ok.status).toBe(200);
    const t = (await ok.json()) as any;
    expect(t.token_type).toBe('Bearer');
    // A code works once.
    expect((await fetchToken({ ...base, client_secret: 'test-client-secret', code_verifier: verifier })).status).toBe(400);

    const { SELF } = await import('cloudflare:test');
    const info = (await (await SELF.fetch('http://example.com/api/id/userinfo', { headers: { Authorization: `Bearer ${t.access_token}` } })).json()) as any;
    expect(info).toMatchObject({ sub: c.userId, email: c.email, name: 'Tia Designer' });
    expect(info.companies).toEqual([{ id: company.id, name: 'Tia Design', role: 'owner', abn_status: 'format_ok' }]);
    expect((await SELF.fetch('http://example.com/api/id/userinfo', { headers: { Authorization: 'Bearer nope' } })).status).toBe(401);
    // Nothing secret is kept in the clear.
    expect(await env.DB.prepare('SELECT 1 FROM id_access_tokens WHERE token_hash = ?').bind(t.access_token).first()).toBeNull();
  });
});

describe('the /company address', () => {
  it('serves the company area under /company with its own title; a page without a cookie goes through /tasks once', async () => {
    const email = uniqueEmail('comount');
    const res = await raw('POST', '/company/api/auth/signup', { body: { email, name: 'Co Mount', password: PASSWORD } });
    expect(res.status).toBe(201);
    const cookies = res.headers.getSetCookie().filter((c) => c.startsWith('workos_sid='));
    expect(cookies.map((c) => /;\s*path=([^;]+)/i.exec(c)?.[1])).toEqual(['/company', '/tasks', '/crm', '/finance', '/system']);
    const cookie = cookies[0].split(';')[0];
    const csrf = ((await res.json()) as any).csrfToken;
    expect((await raw('GET', '/company/api/company/mine', { cookie, csrf })).status).toBe(200);
    // One system: the company area's pages open inside BIZOMAT System, at /system/company.
    const old = await raw('GET', '/company/c/x', { cookie, headers: { Accept: 'text/html' } });
    expect(old.status).toBe(302);
    expect(old.headers.get('Location')).toBe('/system/company/c/x');
    const page = await raw('GET', '/system/company/c/x', { cookie, headers: { Accept: 'text/html' } });
    expect(page.status).toBe(200);
    const html = await page.text();
    expect(html).toContain('<base href="/system/company/">');
    expect(html).toContain('<title>BIZOMAT System</title>');
    expect((await raw('GET', '/system/company/api/company/mine', { cookie, csrf })).status).toBe(200);
    // Without a cookie: through /tasks, where a session from before the System existed carries over.
    const anon = await raw('GET', '/system/company/c/abc/people', { headers: { Accept: 'text/html' } });
    expect(anon.status).toBe(302);
    const carry = anon.headers.get('Location')!;
    expect(carry).toBe(`/tasks/api/app-carry?to=${encodeURIComponent('/system/company/c/abc/people')}`);
    const pm = await raw('POST', '/tasks/api/auth/signup', { body: { email: uniqueEmail('cocarry'), name: 'Co Carry', password: PASSWORD } });
    const tasksCookie = pm.headers.getSetCookie().find((c) => /path=\/tasks/i.test(c))!.split(';')[0];
    const carried = await raw('GET', carry, { cookie: tasksCookie });
    expect(carried.headers.get('Location')).toBe('/system/company/c/abc/people');
    expect(carried.headers.getSetCookie().some((c) => c.startsWith('sys_carry=1'))).toBe(true);
    expect((await raw('GET', carry)).headers.get('Location')).toBe(`/system/login?next=${encodeURIComponent('/company/c/abc/people')}`);
    for (const to of ['//evil.example.com/x', 'https://evil.example.com/company/', '/company\\evil']) {
      const loc = (await raw('GET', `/tasks/api/app-carry?to=${encodeURIComponent(to)}`, { cookie: tasksCookie })).headers.get('Location')!;
      expect(loc.startsWith('/') && !loc.startsWith('//') && !loc.includes('evil.example')).toBe(true);
    }
    // Invitation and confirmation pages are public inside the System; their old addresses lead there.
    expect((await raw('GET', '/company/join/abcdefghijklmnopqrstuvwxyz', { headers: { Accept: 'text/html' } })).headers.get('Location')).toBe('/system/company/join/abcdefghijklmnopqrstuvwxyz');
    expect((await raw('GET', '/system/company/join/abcdefghijklmnopqrstuvwxyz', { headers: { Accept: 'text/html' } })).status).toBe(200);
    expect((await raw('GET', '/system/company/confirm-email?token=abc', { headers: { Accept: 'text/html' } })).status).toBe(200);
    // The sign-in provider's server endpoints answer without a session under /company.
    expect((await raw('GET', '/company/api/id/userinfo')).status).toBe(401);
  });
});
