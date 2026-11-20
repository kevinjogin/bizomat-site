// The Company Admin console (owner's request of 20 Nov 2026; docs/platform/company-admin.md): only the owner and
// administrators of a registered company, only with the flag on for it, never another company's data; the overview's
// counts and what needs attention; the company's API tokens listed and revoked (never the owner's by an administrator,
// never another company's); the access review as JSON and CSV, each recorded in the company's activity.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { raw, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

const flag = (key: string, scope: 'global' | 'company', scopeId = '', value = 'on') =>
  env.DB.prepare('INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1)').bind(key, scope, scopeId, value, 'test', 'test').run();

async function company(owner: Client, name: string) {
  const res = await owner.req('POST', '/api/company/companies', { kind: 'business', name, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  expect(res.status).toBe(201);
  return ((await res.json()) as any).company.id as string;
}

async function join(owner: Client, co: string, p: Client, role: 'admin' | 'manager' | 'employee' | 'read_only') {
  const inv = await owner.json('POST', `/api/company/c/${co}/invitations`, { email: p.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  await p.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
  await env.DB.prepare('UPDATE co_members SET role = ? WHERE company_id = ? AND user_id = ?').bind(role, co, p.userId).run();
}

async function token(p: Client, co: string, name: string) {
  const res = await p.req('POST', '/api/me/tokens', { name, companyId: co });
  expect(res.status).toBe(201);
  return (await res.json()) as { id: string; token: string };
}

describe('Company Admin console', () => {
  it('is off until the flag is on, and only for the owner and administrators of that company', async () => {
    const owner = await signup('Ca Owner');
    const co = await company(owner, 'Console Pty');
    const admin = await signup('Ca Admin');
    const manager = await signup('Ca Manager');
    const outsider = await signup('Ca Outsider');
    await join(owner, co, admin, 'admin');
    await join(owner, co, manager, 'manager');

    const off = await owner.req('GET', `/api/company/c/${co}/admin/overview`);
    expect(off.status).toBe(404);
    expect(((await off.json()) as any).details.code).toBe('COMPANY_ADMIN_OFF');
    expect((await owner.json('GET', '/api/company/admin/companies')).companies).toEqual([]);

    await flag('company_admin_console', 'company', co);
    expect((await owner.json('GET', '/api/company/admin/companies')).companies).toEqual([{ id: co, name: 'Console Pty', role: 'owner' }]);
    expect((await admin.json('GET', '/api/company/admin/companies')).companies.map((x: any) => x.id)).toEqual([co]);
    expect((await manager.json('GET', '/api/company/admin/companies')).companies).toEqual([]);

    expect((await owner.req('GET', `/api/company/c/${co}/admin/overview`)).status).toBe(200);
    expect((await admin.req('GET', `/api/company/c/${co}/admin/overview`)).status).toBe(200);
    expect((await manager.req('GET', `/api/company/c/${co}/admin/overview`)).status).toBe(403);
    expect((await outsider.req('GET', `/api/company/c/${co}/admin/overview`)).status).toBe(404);
    expect((await raw('GET', `/api/company/c/${co}/admin/overview`)).status).toBe(401);

    // a suspended administrator is refused
    await env.DB.prepare("UPDATE co_members SET status = 'suspended' WHERE company_id = ? AND user_id = ?").bind(co, admin.userId).run();
    expect((await admin.req('GET', `/api/company/c/${co}/admin/overview`)).status).toBe(403);
    expect((await admin.json('GET', '/api/company/admin/companies')).companies).toEqual([]);

    // another company's administrator sees nothing of this one
    const other = await signup('Ca Other');
    const co2 = await company(other, 'Other Console Pty');
    await flag('company_admin_console', 'company', co2);
    expect((await other.req('GET', `/api/company/c/${co}/admin/overview`)).status).toBe(404);
    expect((await other.req('GET', `/api/company/c/${co}/admin/tokens`)).status).toBe(404);
  });

  it('shows the team at a glance and what needs attention', async () => {
    const owner = await signup('Ov Owner');
    const co = await company(owner, 'Overview Pty');
    await flag('company_admin_console', 'company', co);
    const emp = await signup('Ov Employee');
    await join(owner, co, emp, 'employee');
    await owner.json('POST', `/api/company/c/${co}/invitations`, { email: uniqueEmail('later'), role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
    const v = await owner.json('GET', `/api/company/c/${co}/admin/overview`);
    expect(v.company.name).toBe('Overview Pty');
    expect(v.people.active).toBe(2);
    expect(v.people.roles).toMatchObject({ owner: 1, employee: 1 });
    expect(v.people.invitations.pending).toBe(1);
    const keys = v.attention.map((x: any) => x.key);
    expect(keys).toContain('one_admin');
    expect(keys).toContain('email');
    expect(v.company.registration.label).not.toMatch(/^Verified$/);
    expect(v.recent.length).toBeGreaterThan(0);
    // levels come first by importance
    const rank = { high: 0, medium: 1, info: 2 } as Record<string, number>;
    expect(v.attention.map((x: any) => rank[x.level])).toEqual([...v.attention.map((x: any) => rank[x.level])].sort());
  });

  it('lists the company’s API tokens and lets an administrator revoke them, never the owner’s', async () => {
    const owner = await signup('Tk Owner');
    const co = await company(owner, 'Tokens Pty');
    await flag('company_admin_console', 'company', co);
    const admin = await signup('Tk Admin');
    const emp = await signup('Tk Employee');
    await join(owner, co, admin, 'admin');
    await join(owner, co, emp, 'employee');
    const empTok = await token(emp, co, 'Reporting script');
    const ownerTok = await token(owner, co, 'Owner script');
    // a token of another company is never listed here
    const other = await signup('Tk Other');
    const co2 = await company(other, 'Other Tokens Pty');
    await token(other, co2, 'Elsewhere');

    const list = await admin.json('GET', `/api/company/c/${co}/admin/tokens`);
    expect(list.tokens.map((t: any) => t.name).sort()).toEqual(['Owner script', 'Reporting script']);
    expect(list.tokens.find((t: any) => t.name === 'Owner script').canRevoke).toBe(false);
    expect(JSON.stringify(list)).not.toContain(empTok.token);

    expect((await admin.req('POST', `/api/company/c/${co}/admin/tokens/${ownerTok.id}/revoke`, { reason: 'Not ours' })).status).toBe(403);
    expect((await admin.req('POST', `/api/company/c/${co}/admin/tokens/${empTok.id}/revoke`, { reason: '' })).status).toBe(400);
    const ok = await admin.req('POST', `/api/company/c/${co}/admin/tokens/${empTok.id}/revoke`, { reason: 'The script is retired' });
    expect(ok.status).toBe(200);
    expect((await raw('GET', '/api/me', { headers: { Authorization: `Bearer ${empTok.token}` } })).status).toBe(401);
    const row = await env.DB.prepare('SELECT revoked_reason FROM api_tokens WHERE id = ?').bind(empTok.id).first<{ revoked_reason: string }>();
    expect(row!.revoked_reason).toContain('The script is retired');
    const note = await env.DB.prepare("SELECT title FROM co_member_notices WHERE company_id = ? AND user_id = ? AND kind = 'token_revoked'").bind(co, emp.userId).first<{ title: string }>();
    expect(note!.title).toContain('Reporting script');
    const log = await env.DB.prepare("SELECT COUNT(*) AS n FROM co_audit WHERE company_id = ? AND action = 'company.token_revoked'").bind(co).first<{ n: number }>();
    expect(log!.n).toBe(1);
    // the owner may revoke their own; nobody here can reach another company's token
    expect((await owner.req('POST', `/api/company/c/${co}/admin/tokens/${ownerTok.id}/revoke`, { reason: 'Rotating it' })).status).toBe(200);
    const elsewhere = await env.DB.prepare("SELECT id FROM api_tokens WHERE company_id = ? AND name = 'Elsewhere'").bind(co2).first<{ id: string }>();
    expect((await owner.req('POST', `/api/company/c/${co}/admin/tokens/${elsewhere!.id}/revoke`, { reason: 'Not mine' })).status).toBe(404);
  });

  it('exports an access review as JSON and CSV, recorded in the company’s activity', async () => {
    const owner = await signup('Ar Owner');
    const co = await company(owner, 'Review Pty');
    await flag('company_admin_console', 'company', co);
    const emp = await signup('Ar Employee');
    await join(owner, co, emp, 'employee');
    const j = await owner.json('GET', `/api/company/c/${co}/admin/access-review`);
    expect(j.rows.map((r: any) => r.role).sort()).toEqual(['Employee', 'Owner']);
    const csv = await owner.req('GET', `/api/company/c/${co}/admin/access-review?format=csv`);
    expect(csv.status).toBe(200);
    expect(csv.headers.get('content-type')).toContain('text/csv');
    const text = await csv.text();
    expect(text.split('\n')[0]).toContain('Company role');
    expect(text).toContain(emp.email);
    const log = await env.DB.prepare("SELECT COUNT(*) AS n FROM co_audit WHERE company_id = ? AND action = 'company.access_review'").bind(co).first<{ n: number }>();
    expect(log!.n).toBe(2);
    expect((await emp.req('GET', `/api/company/c/${co}/admin/access-review?format=csv`)).status).toBe(403);
  });
});
