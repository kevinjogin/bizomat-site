// Company members, roles and ownership transfer (owner's brief of 19 Nov 2026, Part 7; docs/platform/members.md): the
// central permission service and its gate, the Members API and the ownership transfer, with the flag
// company_members_v2 switched on for each test's own company.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { PASSWORD, reauthenticate, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { redact, redactCsv } from '../src/worker/company/members-access';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registered(c: Client, name = 'Members Works') {
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
  return { id: data.company.id as string, name, tools: data.tools as { tasks: string; crm: string; finance: string } };
}

const v2 = (companyId: string) =>
  env.DB.prepare("INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('company_members_v2', 'company', ?, 'on', 'test', 'test', 1)").bind(companyId).run();

/** Invites through the Members API and accepts as the person. */
async function join(owner: Client, companyId: string, person: Client, body: Record<string, unknown> = {}) {
  const r = await owner.json('POST', `/api/company/c/${companyId}/team/invitations`, { emails: [person.email], ...body });
  expect(r.results[0].status).toBe('sent');
  const row = await env.DB.prepare('SELECT id FROM co_invitations WHERE company_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(companyId, person.email).first<{ id: string }>();
  // The link's token is not stored (only its hash): set a known one for the test, as the email would carry it.
  const token = `tok-${row!.id}-${Math.random().toString(36).slice(2)}`;
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))].map((b) => b.toString(16).padStart(2, '0')).join('');
  await env.DB.prepare('UPDATE co_invitations SET token_hash = ? WHERE company_id = ? AND id = ?').bind(hash, companyId, row!.id).run();
  const acc = await person.req('POST', `/api/company/invitations/${token}/accept`, {});
  expect(acc.status).toBe(200);
  return { token, id: row!.id };
}

const confirmEmail = (c: Client) => env.DB.prepare('UPDATE users SET email_verified_at = ? WHERE id = ?').bind(Date.now(), c.userId).run();
const roleOf = async (companyId: string, userId: string) => (await env.DB.prepare('SELECT role FROM co_members WHERE company_id = ? AND user_id = ?').bind(companyId, userId).first<{ role: string }>())?.role;

describe('members: owner, invitations and the role matrix', () => {
  it('makes the creator the owner, keeps exactly one owner, and invites one or many with modules, scope and a message', async () => {
    const owner = await signup('Ola Owner');
    const co = await registered(owner);
    // 1. The creator is the owner.
    expect(await roleOf(co.id, owner.userId)).toBe('owner');
    // Off: the Members API answers 404.
    expect((await owner.req('GET', `/api/company/c/${co.id}/team`)).status).toBe(404);
    await v2(co.id);
    // 2. Exactly one owner, in the database as well as the API.
    const second = await signup('Sam Second');
    await join(owner, co.id, second, { role: 'manager' });
    await expect(env.DB.prepare("UPDATE co_members SET role = 'owner' WHERE company_id = ? AND user_id = ?").bind(co.id, second.userId).run()).rejects.toThrow();
    expect((await owner.req('PATCH', `/api/company/c/${co.id}/team/${second.userId}/role`, { role: 'owner' })).status).toBe(400);
    // 3. Invitations: many at once, duplicates refused, 7 days, the message and the access given.
    const amy = await signup('Amy Anyone');
    const bulk = await owner.json('POST', `/api/company/c/${co.id}/team/invitations`, {
      emails: [amy.email, second.email, 'not-an-email', amy.email],
      role: 'employee',
      modules: { finance: { access: false, scope: 'own' }, crm: { access: true, scope: 'team' } },
      message: 'Welcome to the team',
    });
    expect(bulk.results.map((r: any) => r.status)).toEqual(['sent', 'already_member', 'invalid']);
    expect(bulk.expiresInDays).toBe(7);
    const again = await owner.json('POST', `/api/company/c/${co.id}/team/invitations`, { emails: [amy.email] });
    expect(again.results[0].status).toBe('already_invited');
    const inv = await env.DB.prepare('SELECT id, expires_at, created_at, message FROM co_invitations WHERE company_id = ? AND email = ? AND accepted_at IS NULL').bind(co.id, amy.email).first<any>();
    expect(inv.message).toBe('Welcome to the team');
    expect(Math.round((inv.expires_at - inv.created_at) / 86_400_000)).toBe(7);
    // Resend: a new link (the earlier one stops) and a new expiry.
    const before = await env.DB.prepare('SELECT token_hash FROM co_invitations WHERE company_id = ? AND id = ?').bind(co.id, inv.id).first<any>();
    expect((await owner.json('POST', `/api/company/c/${co.id}/team/invitations/${inv.id}/resend`, {})).ok).toBe(true);
    const after = await env.DB.prepare('SELECT token_hash, resend_count FROM co_invitations WHERE company_id = ? AND id = ?').bind(co.id, inv.id).first<any>();
    expect(after.token_hash).not.toBe(before.token_hash);
    expect(after.resend_count).toBe(1);
    // Wrong email, expired, reused token.
    const other = await signup('Oli Other');
    const tok = `tok-x-${Math.random().toString(36).slice(2)}`;
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tok)))].map((b) => b.toString(16).padStart(2, '0')).join('');
    await env.DB.prepare('UPDATE co_invitations SET token_hash = ? WHERE company_id = ? AND id = ?').bind(hash, co.id, inv.id).run();
    expect((await other.req('POST', `/api/company/invitations/${tok}/accept`, {})).status).toBe(403);
    await env.DB.prepare('UPDATE co_invitations SET expires_at = ? WHERE company_id = ? AND id = ?').bind(Date.now() - 1000, co.id, inv.id).run();
    expect((await amy.req('POST', `/api/company/invitations/${tok}/accept`, {})).status).toBe(400);
    await env.DB.prepare('UPDATE co_invitations SET expires_at = ? WHERE company_id = ? AND id = ?').bind(Date.now() + 86_400_000, co.id, inv.id).run();
    expect((await amy.req('POST', `/api/company/invitations/${tok}/accept`, {})).status).toBe(200);
    expect(((await (await amy.req('POST', `/api/company/invitations/${tok}/accept`, {})).json()) as any).already).toBe(true);
    // The access chosen at invitation applies.
    const list = await owner.json('GET', `/api/company/c/${co.id}/team?q=amy`);
    expect(list.members[0].modules.finance).toEqual({ access: false, scope: 'own' });
    expect(list.members[0].modules.crm).toEqual({ access: true, scope: 'team' });
    // Revoked: the existing route still revokes.
    const rev = await owner.json('POST', `/api/company/c/${co.id}/team/invitations`, { emails: [uniqueEmail('rev')] });
    expect((await owner.req('DELETE', `/api/company/c/${co.id}/invitations/${rev.results[0].id}`)).status).toBe(200);
  });

  it('lets each role do only what the matrix allows, and blocks escalation (tests 4 and 5)', async () => {
    const owner = await signup('Mat Owner');
    const co = await registered(owner);
    await v2(co.id);
    const admin = await signup('Ada Admin');
    const mgr = await signup('Max Manager');
    const emp = await signup('Eve Employee');
    const ro = await signup('Rob Reader');
    await join(owner, co.id, admin, { role: 'admin' });
    await join(owner, co.id, mgr, { role: 'manager' });
    await join(owner, co.id, emp, { role: 'employee' });
    await join(owner, co.id, ro, { role: 'read_only' });
    // Read-only: can read the CRM, cannot change anything.
    expect((await ro.req('GET', `/api/crm/orgs/${co.tools.crm}/contacts`)).status).toBe(200);
    const roWrite = await ro.req('POST', `/api/crm/orgs/${co.tools.crm}/contacts`, { firstName: 'No' });
    expect(roWrite.status).toBe(403);
    expect(((await roWrite.json()) as any).details.code).toBe('READ_ONLY');
    // ...but may report a hazard (safety reports are open to everyone).
    const hazard = await ro.req('POST', `/api/whs/c/${co.id}/hazards`, {});
    expect([400, 403, 404].includes(hazard.status) ? ((await hazard.json()) as any).details?.code : null).not.toBe('READ_ONLY');
    // Employees: no delete, no approve, no export.
    const del = await emp.req('DELETE', `/api/crm/orgs/${co.tools.crm}/contacts/whatever`);
    expect(((await del.json()) as any).details.capability).toBe('delete');
    const appr = await emp.req('POST', `/api/erp/c/${co.id}/change-orders/whatever/approve`, {});
    expect(((await appr.json()) as any).details.capability).toBe('approve');
    const exp = await emp.req('GET', `/api/crm/orgs/${co.tools.crm}/contacts/export`);
    expect(exp.status).toBe(403);
    expect(((await exp.json()) as any).details.capability).toBe('export');
    // 5. Escalation: changing oneself, an administrator making an administrator, an administrator touching the owner.
    expect(((await (await admin.req('PATCH', `/api/company/c/${co.id}/team/${admin.userId}/role`, { role: 'manager' })).json()) as any).details.code).toBe('SELF_CHANGE');
    expect(((await (await admin.req('PATCH', `/api/company/c/${co.id}/team/${mgr.userId}/role`, { role: 'admin' })).json()) as any).details.code).toBe('ADMIN_PROTECTED');
    expect(((await (await admin.req('PATCH', `/api/company/c/${co.id}/team/${owner.userId}/role`, { role: 'manager' })).json()) as any).details.code).toBe('OWNER_PROTECTED');
    expect(((await (await admin.req('POST', `/api/company/c/${co.id}/team/invitations`, { emails: [uniqueEmail('x')], role: 'admin' })).json()) as any).details.code).toBe('ADMIN_PROTECTED');
    expect((await mgr.req('PATCH', `/api/company/c/${co.id}/team/${emp.userId}/role`, { role: 'read_only' })).status).toBe(403);
    expect((await mgr.req('POST', `/api/company/c/${co.id}/team/invitations`, { emails: [uniqueEmail('y')] })).status).toBe(403);
    // An administrator manages employees; the owner makes administrators.
    expect((await admin.req('PATCH', `/api/company/c/${co.id}/team/${emp.userId}/role`, { role: 'manager' })).status).toBe(200);
    expect(await roleOf(co.id, emp.userId)).toBe('manager');
    expect((await owner.req('PATCH', `/api/company/c/${co.id}/team/${mgr.userId}/role`, { role: 'admin' })).status).toBe(200);
    // The role matrix is the configuration the page shows.
    const roles = await ro.json('GET', `/api/company/c/${co.id}/team/roles`);
    expect(roles.capabilities.find((x: any) => x.key === 'delete').allow).toEqual({ owner: true, admin: true, manager: true, employee: false, read_only: false });
  });
});

describe('members: module access, scope, sensitive fields and immediate effect', () => {
  it('refuses a module without access, keeps own records own, hides sensitive fields, and acts at once (tests 6 to 9)', async () => {
    const owner = await signup('Kim Owner');
    const co = await registered(owner);
    await v2(co.id);
    const emp = await signup('Ivy Employee');
    const mgr = await signup('Mia Manager');
    await join(owner, co.id, emp, { role: 'employee' });
    await join(owner, co.id, mgr, { role: 'manager' });
    // 7. An employee sees only their own CRM records (the default scope for employees is own).
    const theirs = await owner.json('POST', `/api/crm/orgs/${co.tools.crm}/contacts`, { firstName: 'Owned', lastName: 'ByOwner' });
    const mine = await emp.json('POST', `/api/crm/orgs/${co.tools.crm}/contacts`, { firstName: 'Mine', lastName: 'Employee' });
    expect((await emp.req('GET', `/api/crm/orgs/${co.tools.crm}/contacts/${theirs.id ?? theirs.contact?.id}`)).status).toBe(404);
    expect((await emp.req('GET', `/api/crm/orgs/${co.tools.crm}/contacts/${mine.id ?? mine.contact?.id}`)).status).toBe(200);
    // 6. Without CRM access, every CRM address answers 403.
    expect((await owner.req('PUT', `/api/company/c/${co.id}/team/${emp.userId}/access`, { modules: { crm: { access: false, scope: 'own' } } })).status).toBe(200);
    for (const path of [`/api/crm/orgs/${co.tools.crm}/contacts`, `/api/crm/orgs/${co.tools.crm}/deals`]) {
      const r = await emp.req('GET', path);
      expect(r.status).toBe(403);
      expect(((await r.json()) as any).details.code).toBe('MODULE_ACCESS');
    }
    // 9. Given back: at once (no cache).
    await owner.req('PUT', `/api/company/c/${co.id}/team/${emp.userId}/access`, { modules: { crm: { access: true, scope: 'all' } } });
    expect((await emp.req('GET', `/api/crm/orgs/${co.tools.crm}/contacts/${theirs.id ?? theirs.contact?.id}`)).status).toBe(200);
    // 8. Sensitive fields: a manager without them does not see a product's cost; with them, does.
    await env.DB.prepare("INSERT INTO erp_user_roles (company_id, user_id, role, set_at) VALUES (?, ?, 'viewer', ?)").bind(co.id, mgr.userId, Date.now()).run();
    const p = await owner.json('POST', `/api/erp/c/${co.id}/products`, { name: 'Bracket', type: 'manufactured_part', standardCostCents: 1234 });
    const pid = p.product?.id ?? p.id;
    const seen = await mgr.json('GET', `/api/erp/c/${co.id}/products/${pid}`);
    expect(JSON.stringify(seen)).not.toContain('standardCostCents');
    expect(JSON.stringify(await owner.json('GET', `/api/erp/c/${co.id}/products/${pid}`))).toContain('standardCostCents');
    await owner.req('PUT', `/api/company/c/${co.id}/team/${mgr.userId}/access`, { sensitive: true });
    expect(JSON.stringify(await mgr.json('GET', `/api/erp/c/${co.id}/products/${pid}`))).toContain('standardCostCents');
    // A CSV export without its sensitive columns.
    await owner.req('PUT', `/api/company/c/${co.id}/team/${mgr.userId}/access`, { sensitive: false });
    const csv = await mgr.req('GET', `/api/erp/c/${co.id}/products?format=csv`);
    expect(csv.status).toBe(200);
    const head = (await csv.text()).split(/\r?\n/)[0];
    expect(head).toMatch(/Name/);
    expect(head).not.toMatch(/cost/i);
  });

  it('removes sensitive keys and columns everywhere they appear', () => {
    expect(redact({ a: 1, standardCostCents: 5, nested: [{ unit_cost_cents: 2, costCentreId: 'x', bankAccountId: 'b', bsb: '062-000', marginPct: 3, name: 'n' }] })).toEqual({
      a: 1,
      nested: [{ costCentreId: 'x', bankAccountId: 'b', name: 'n' }],
    });
    expect(redactCsv('Name,Unit cost,Cost centre,"Margin, %"\r\nA,"1,00",X,5\r\n')).toBe('Name,Cost centre\r\nA,X\r\n');
  });
});

describe('members: suspension, removal and two companies', () => {
  it('suspends at once, removes with reassignment and token revocation, and keeps each company’s role apart (tests 12 and 13)', async () => {
    const owner = await signup('Pat Owner');
    const co = await registered(owner);
    await v2(co.id);
    const emp = await signup('Lee Leaving');
    const mgr = await signup('Gus Gets');
    await join(owner, co.id, emp, { role: 'employee' });
    await join(owner, co.id, mgr, { role: 'manager' });
    const deal = await emp.json('POST', `/api/crm/orgs/${co.tools.crm}/deals`, { title: 'Open deal', value: 10_000 });
    const dealId = deal.id ?? deal.deal?.id;
    // A token limited to this company.
    await env.DB.prepare("INSERT INTO api_tokens (id, user_id, name, prefix, token_hash, created_at, company_id) VALUES (?, ?, 'test', 'wos_test', ?, ?, ?)").bind(`tok-${emp.userId}`, emp.userId, `hash-${emp.userId}`, Date.now(), co.id).run();
    // Suspension: access ends at once, the token too; the other members are untouched.
    expect((await owner.req('POST', `/api/company/c/${co.id}/team/${emp.userId}/suspend`, { reason: 'Leave of absence' })).status).toBe(200);
    const blocked = await emp.req('GET', `/api/crm/orgs/${co.tools.crm}/deals`);
    expect(blocked.status).toBe(403);
    expect(((await blocked.json()) as any).details.code).toBe('MEMBER_SUSPENDED');
    expect((await env.DB.prepare('SELECT revoked_at FROM api_tokens WHERE id = ?').bind(`tok-${emp.userId}`).first<any>()).revoked_at).not.toBeNull();
    expect((await owner.req('POST', `/api/company/c/${co.id}/team/${emp.userId}/reactivate`, {})).status).toBe(200);
    expect((await emp.req('GET', `/api/crm/orgs/${co.tools.crm}/deals`)).status).toBe(200);
    // 12. Removal: open items counted, then reassigned; records stay with the company.
    const open = await owner.json('GET', `/api/company/c/${co.id}/team/${emp.userId}/open-items`);
    expect(open.crmDeals).toBe(1);
    expect((await owner.req('POST', `/api/company/c/${co.id}/team/${emp.userId}/remove`, { reassignTo: mgr.userId })).status).toBe(200);
    expect(await roleOf(co.id, emp.userId)).toBeUndefined();
    expect((await env.DB.prepare('SELECT owner_id FROM crm_deals WHERE id = ?').bind(dealId).first<any>()).owner_id).toBe(mgr.userId);
    expect((await emp.req('GET', `/api/company/c/${co.id}`)).status).toBe(404);
    // Notices: in the app for the person removed.
    const notes = await emp.json('GET', '/api/company/notices');
    expect(notes.notices.map((n: any) => n.kind)).toEqual(expect.arrayContaining(['suspended', 'reactivated', 'removed']));
    // 13. Different roles in two companies.
    const other = await registered(mgr, 'Second Works');
    await v2(other.id);
    await join(mgr, other.id, owner, { role: 'read_only' });
    expect((await owner.req('POST', `/api/crm/orgs/${other.tools.crm}/contacts`, { firstName: 'Nope' })).status).toBe(403);
    expect((await owner.req('POST', `/api/crm/orgs/${co.tools.crm}/contacts`, { firstName: 'Yes' })).status).toBe(201);
    // The activity tab records who did what.
    const act = await owner.json('GET', `/api/company/c/${co.id}/team/activity`);
    expect(act.events.map((e: any) => e.action)).toEqual(expect.arrayContaining(['member.suspended', 'member.reactivated', 'member.removed', 'member.items_reassigned', 'invitation.created']));
  });
});

describe('members: ownership transfer', () => {
  it('needs the password and the name, waits for acceptance, can be cancelled or expire, and moves everything at once (test 10)', async () => {
    const owner = await signup('Tia Owner');
    const co = await registered(owner, 'Transfer Works');
    await v2(co.id);
    const next = await signup('Neo Next');
    const ro = await signup('Ray Reader');
    await join(owner, co.id, next, { role: 'manager' });
    await join(owner, co.id, ro, { role: 'read_only' });
    const ask = (body: Record<string, unknown>) => owner.req('POST', `/api/company/c/${co.id}/team/transfer`, { toUserId: next.userId, newRole: 'admin', companyName: 'Transfer Works', password: PASSWORD, ...body });
    // The old immediate transfer is replaced.
    expect((await owner.req('POST', `/api/company/c/${co.id}/transfer`, { userId: next.userId })).status).toBe(409);
    expect(((await (await ask({ password: 'wrong-password-1' })).json()) as any).details.code).toBe('REAUTH_INVALID');
    expect(((await (await ask({ companyName: 'Other' })).json()) as any).details.code).toBe('NAME_MISMATCH');
    // Accepting an invitation confirms the address; one not confirmed cannot become owner.
    await env.DB.prepare('UPDATE users SET email_verified_at = NULL WHERE id = ?').bind(next.userId).run();
    expect(((await (await ask({})).json()) as any).details.code).toBe('EMAIL_UNVERIFIED');
    await confirmEmail(next);
    await confirmEmail(ro);
    expect(((await (await ask({ toUserId: ro.userId })).json()) as any).details.code).toBe('TARGET_READ_ONLY');
    expect((await ask({})).status).toBe(201);
    expect(((await (await ask({})).json()) as any).details.code).toBe('TRANSFER_PENDING');
    // Nothing moves before acceptance.
    expect(await roleOf(co.id, owner.userId)).toBe('owner');
    // Cancel, ask again, then let it expire.
    expect((await owner.req('DELETE', `/api/company/c/${co.id}/team/transfer`)).status).toBe(200);
    expect((await ask({})).status).toBe(201);
    const pending = await next.json('GET', '/api/company/transfers/mine');
    expect(pending.transfers).toHaveLength(1);
    const id = pending.transfers[0].id;
    await env.DB.prepare('UPDATE co_ownership_transfers SET expires_at = ? WHERE company_id = ? AND id = ?').bind(Date.now() - 1, co.id, id).run();
    expect((await next.req('POST', `/api/company/transfers/${id}/accept`, {})).status).toBe(409);
    // A fresh request, accepted: one transaction moves the company and every tool.
    expect((await ask({ newRole: 'manager' })).status).toBe(201);
    const id2 = (await next.json('GET', '/api/company/transfers/mine')).transfers[0].id;
    expect((await next.req('POST', `/api/company/transfers/${id2}/accept`, {})).status).toBe(200);
    expect(await roleOf(co.id, next.userId)).toBe('owner');
    expect(await roleOf(co.id, owner.userId)).toBe('manager');
    expect((await env.DB.prepare('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?').bind(co.tools.crm, next.userId).first<any>()).role).toBe('owner');
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM co_members WHERE company_id = ? AND role = 'owner'").bind(co.id).first<any>()).n).toBe(1);
    // Notified and audited.
    expect((await owner.json('GET', '/api/company/notices')).notices.map((n: any) => n.kind)).toContain('ownership_transferred');
    expect(await env.DB.prepare("SELECT 1 FROM co_audit WHERE company_id = ? AND action = 'ownership.transferred'").bind(co.id).first()).not.toBeNull();
  });

  it('lets a platform admin force a transfer with a reason and evidence (test 11)', async () => {
    const owner = await signup('Gone Owner');
    const co = await registered(owner, 'Recovery Works');
    await v2(co.id);
    const heir = await signup('Hal Heir');
    await join(owner, co.id, heir, { role: 'manager' });
    const pa = await signup('Pia Platform');
    await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'admin', 'test', ?)").bind(pa.userId, Date.now()).run();
    await reauthenticate(pa);
    const short = await pa.req('POST', `/api/admin/platform/members/companies/${co.id}/force-transfer`, { toUserId: heir.userId, reason: 'gone', evidence: 'x' });
    expect(short.status).toBe(400);
    const r = await pa.req('POST', `/api/admin/platform/members/companies/${co.id}/force-transfer`, { toUserId: heir.userId, reason: 'The owner left the business and cannot be reached', evidence: 'Signed letter from the directors, ticket 42' });
    expect(r.status).toBe(200);
    expect(await roleOf(co.id, heir.userId)).toBe('owner');
    expect(await roleOf(co.id, owner.userId)).toBe('admin');
    const row = await env.DB.prepare("SELECT kind, reason, evidence FROM co_ownership_transfers WHERE company_id = ? AND kind = 'forced'").bind(co.id).first<any>();
    expect(row).toMatchObject({ kind: 'forced', reason: 'The owner left the business and cannot be reached' });
    expect(await env.DB.prepare("SELECT 1 FROM audit_log WHERE action = 'platform.ownership_forced' AND target_id = ?").bind(co.id).first()).not.toBeNull();
  });
});
