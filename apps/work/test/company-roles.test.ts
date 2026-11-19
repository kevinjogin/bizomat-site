// Company roles (Stage 1, R5; docs/platform/roles.md): owner, admin, manager, employee and read_only with presets for
// each tool, nobody but the owner raising their own or anyone's tool role to admin (audit S4), invitations listed only
// to proven addresses (audit L4), the owner's companies handed over when their account is disabled, and support access.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { PASSWORD, reauthenticate, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { base32Decode, hotp, stepAt } from '../src/worker/platform/totp';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registered(c: Client) {
  const res = await c.req('POST', '/api/company/companies', {
    kind: 'business',
    name: 'Roles Works',
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
  return { id: data.company.id as string, tools: data.tools as { tasks: string; crm: string; finance: string } };
}

async function join(owner: Client, companyId: string, person: Client, body: Record<string, unknown>) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: person.email, ...body });
  await person.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
}

const member = (companyId: string, userId: string) => env.DB.prepare('SELECT role, tasks_role, crm_role, fin_role FROM co_members WHERE company_id = ? AND user_id = ?').bind(companyId, userId).first<any>();

describe('company roles and presets', () => {
  it('sets each tool’s role from the company role, and lets the tools be chosen one by one', async () => {
    const owner = await signup('Rho Owner');
    const co = await registered(owner);
    const mgr = await signup('Mo Manager');
    const ro = await signup('Rae Reader');
    const emp = await signup('Em Employee');
    await join(owner, co.id, mgr, { role: 'manager', preset: true });
    await join(owner, co.id, ro, { role: 'read_only', preset: true });
    await join(owner, co.id, emp, { role: 'member', preset: true, crmRole: 'sales' });
    expect(await member(co.id, mgr.userId)).toEqual({ role: 'manager', tasks_role: 'project_manager', crm_role: 'manager', fin_role: 'finance_manager' });
    expect(await member(co.id, ro.userId)).toEqual({ role: 'read_only', tasks_role: 'viewer', crm_role: 'viewer', fin_role: 'viewer' });
    // member is taken as employee; a tool chosen one by one overrides the preset.
    expect(await member(co.id, emp.userId)).toEqual({ role: 'employee', tasks_role: 'member', crm_role: 'sales', fin_role: 'contributor' });
    // The tools follow (each keeps its own members table).
    expect((await env.DB.prepare('SELECT role FROM fin_members WHERE org_id = ? AND user_id = ?').bind(co.tools.finance, ro.userId).first<any>()).role).toBe('viewer');
    // A new company role with its preset.
    await owner.json('PATCH', `/api/company/c/${co.id}/members/${ro.userId}`, { role: 'manager', preset: true });
    expect(await member(co.id, ro.userId)).toMatchObject({ role: 'manager', tasks_role: 'project_manager' });
    // Everyone in the company sees it; only owners and administrators manage people.
    const view = await ro.json('GET', `/api/company/c/${co.id}`);
    expect(view.me.role).toBe('manager');
    expect((await ro.req('POST', `/api/company/c/${co.id}/invitations`, { email: uniqueEmail('x') })).status).toBe(403);
  });

  it('lets only the owner give a tool’s admin role, and nobody but the owner change their own role (audit S4)', async () => {
    const owner = await signup('Sol Owner');
    const co = await registered(owner);
    const admin = await signup('Ada Admin');
    const emp = await signup('Eli Employee');
    await join(owner, co.id, admin, { role: 'admin', tasksRole: 'project_manager', crmRole: 'manager', finRole: 'viewer' });
    await join(owner, co.id, emp, { role: 'employee', preset: true });
    // An administrator raising their own tool roles: refused.
    const self = await admin.req('PATCH', `/api/company/c/${co.id}/members/${admin.userId}`, { crmRole: 'admin' });
    expect(self.status).toBe(403);
    expect((await member(co.id, admin.userId)).crm_role).toBe('manager');
    // An administrator making someone else a tool admin, or inviting one: refused. Lesser roles: allowed.
    expect((await admin.req('PATCH', `/api/company/c/${co.id}/members/${emp.userId}`, { tasksRole: 'admin' })).status).toBe(403);
    expect((await admin.req('POST', `/api/company/c/${co.id}/invitations`, { email: uniqueEmail('y'), role: 'employee', finRole: 'admin' })).status).toBe(403);
    expect((await admin.req('POST', `/api/company/c/${co.id}/invitations`, { email: uniqueEmail('y'), role: 'admin', preset: true })).status).toBe(403);
    expect((await admin.req('PATCH', `/api/company/c/${co.id}/members/${emp.userId}`, { role: 'read_only', preset: true })).status).toBe(200);
    expect(await member(co.id, emp.userId)).toMatchObject({ role: 'read_only', tasks_role: 'viewer' });
    // The owner can.
    expect((await owner.req('PATCH', `/api/company/c/${co.id}/members/${admin.userId}`, { crmRole: 'admin' })).status).toBe(200);
  });

  it('keeps one owner who cannot leave (brief Part 4)', async () => {
    const owner = await signup('Lee Last');
    const co = await registered(owner);
    expect((await owner.req('POST', `/api/company/c/${co.id}/leave`, {})).status).toBe(400);
    await expect(env.DB.prepare("INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES (?, ?, 'owner', 1)").bind(co.id, (await signup('Two Owners')).userId).run()).rejects.toThrow();
  });
});

describe('invitations listed to proven addresses only (audit L4)', () => {
  it('shows a pending company invitation once the address is proven', async () => {
    const owner = await signup('Ivo Inviter');
    const co = await registered(owner);
    const guest = await signup('Gil Guest');
    await owner.json('POST', `/api/company/c/${co.id}/invitations`, { email: guest.email });
    await env.DB.prepare('UPDATE users SET email_verified_at = NULL, email_verified_via = NULL WHERE id = ?').bind(guest.userId).run();
    const before = await guest.json('GET', '/api/company/mine');
    expect(before.invitations ?? []).toEqual([]);
    await env.DB.prepare("UPDATE users SET email_verified_at = ?, email_verified_via = 'link' WHERE id = ?").bind(Date.now(), guest.userId).run();
    const after = await guest.json('GET', '/api/company/mine');
    expect((after.invitations ?? []).length).toBe(1);
  });
});

describe('owner handover when the owner’s account is disabled', () => {
  it('passes each company to its longest-serving active administrator, and records a company nobody could take', async () => {
    const founder = await signup('Fay Founder');
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'founder', 'test', ?)").bind(founder.userId, Date.now()).run();
    await reauthenticate(founder);
    const owner = await signup('Oz Owner');
    const co = await registered(owner);
    const first = await signup('Ana First');
    const second = await signup('Ben Second');
    await join(owner, co.id, first, { role: 'admin', preset: true });
    await join(owner, co.id, second, { role: 'admin', preset: true });
    const lonely = await registered(owner);
    const helper = await signup('Hal Helper');
    await join(owner, lonely.id, helper, { role: 'employee', preset: true });
    const r = await founder.json('POST', `/api/admin/system/users/${owner.userId}/disable`, {});
    expect(r.handovers).toEqual(expect.arrayContaining([{ companyId: co.id, to: first.userId }, { companyId: lonely.id, to: null }]));
    expect((await member(co.id, first.userId)).role).toBe('owner');
    expect((await member(co.id, owner.userId)).role).toBe('admin');
    expect((await env.DB.prepare('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?').bind(co.tools.crm, first.userId).first<any>()).role).toBe('owner');
    expect((await env.DB.prepare('SELECT owner_id FROM companies WHERE id = ?').bind(co.id).first<any>()).owner_id).toBe(first.userId);
    const rec = await env.DB.prepare('SELECT to_user_id FROM co_owner_handovers WHERE company_id = ?').bind(lonely.id).first<any>();
    expect(rec).toEqual({ to_user_id: null });
    expect((await member(lonely.id, owner.userId)).role).toBe('owner');
  });
});

describe('support access', () => {
  it('is time-limited, needs a reason and a re-authentication, shows to the company, and can be ended by it', async () => {
    const admin = await signup('Sue Support');
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'admin', 'test', ?)").bind(admin.userId, Date.now()).run();
    const start = await admin.json('POST', '/api/admin/platform/security/mfa/start', {});
    await admin.json('POST', '/api/admin/platform/security/mfa/confirm', { code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
    const owner = await signup('Cy Customer');
    const co = await registered(owner);
    // No grant: nothing to see.
    expect((await admin.req('GET', `/api/admin/platform/support/${co.id}/view`)).status).toBe(403);
    // Opening needs a fresh password and code.
    expect((await admin.req('POST', `/api/admin/platform/support/${co.id}`, { reason: 'Customer asked about a missing tool', hours: 2 })).status).toBe(403);
    await env.DB.prepare('UPDATE user_mfa SET last_step = 0 WHERE user_id = ?').bind(admin.userId).run();
    await admin.json('POST', '/api/admin/platform/security/reauth', { password: PASSWORD, code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
    expect((await admin.req('POST', `/api/admin/platform/support/${co.id}`, { reason: 'x', hours: 2 })).status).toBe(400);
    expect((await admin.req('POST', `/api/admin/platform/support/${co.id}`, { reason: 'Customer asked', hours: 100 })).status).toBe(400);
    const g = await admin.json('POST', `/api/admin/platform/support/${co.id}`, { reason: 'Customer asked about a missing tool', hours: 2 });
    expect(g.endsAt - Date.now()).toBeLessThanOrEqual(2 * 3_600_000);
    const view = await admin.json('GET', `/api/admin/platform/support/${co.id}/view`);
    expect(view.people.map((p: any) => p.email)).toEqual([owner.email]);
    expect(JSON.stringify(view)).not.toContain('password');
    // The company sees it, with the reason, in its settings and activity, and ends it.
    const list = await owner.json('GET', `/api/company/c/${co.id}/support`);
    expect(list[0]).toMatchObject({ reason: 'Customer asked about a missing tool', active: true, admin: 'Sue Support' });
    const audit = await env.DB.prepare("SELECT action FROM co_audit WHERE company_id = ? AND action LIKE 'support.%' ORDER BY created_at").bind(co.id).all<any>();
    expect(audit.results.map((x) => x.action)).toEqual(['support.access_opened', 'support.viewed']);
    await owner.json('POST', `/api/company/c/${co.id}/support/${g.id}/end`, {});
    expect((await admin.req('GET', `/api/admin/platform/support/${co.id}/view`)).status).toBe(403);
    // People outside the company cannot see or end it.
    const stranger = await signup('Sid Stranger');
    expect((await stranger.req('GET', `/api/company/c/${co.id}/support`)).status).toBe(404);
  });
});
