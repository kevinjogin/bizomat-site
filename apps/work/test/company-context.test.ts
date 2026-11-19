// Company context (Stage 1, R4; src/worker/platform/context.ts): which company an address is for, API tokens limited
// to one company (audit E3 and S5), and the module switches of every module.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { PASSWORD, raw, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { companyOfTool, contextOfPath } from '../src/worker/platform/context';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registered(c: Client) {
  const res = await c.req('POST', '/api/company/companies', {
    kind: 'business',
    name: 'Context Works',
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
  return { id: data.company.id as string, tools: data.tools as { tasks?: string; crm?: string; finance?: string } };
}

const ownOf = async (c: Client) => (await c.json('GET', '/api/system/me')).companies.find((x: any) => x.kind === 'own').id as string;
const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
const switchOff = (module: string, companyId: string) =>
  env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, 'company', ?, 'off', 'test', 'test', 1)").bind(`module_${module}_enabled`, companyId).run();

describe('the company of an address', () => {
  it('finds a tool’s company: the registered company that runs it, else its owner’s own company', async () => {
    const owner = await signup('Cara Context');
    const co = await registered(owner);
    const own = await ownOf(owner);
    expect(await companyOfTool(env.DB, 'crm', co.tools.crm!)).toBe(co.id);
    expect(await companyOfTool(env.DB, 'tasks', owner.workspaceId)).toBe(own);
    expect(await contextOfPath(env.DB, `/workspaces/${owner.workspaceId}/boards`)).toMatchObject({ companyId: own, app: 'tasks', module: 'tasks' });
    expect(await contextOfPath(env.DB, `/fin/orgs/${co.tools.finance}/quotes`)).toMatchObject({ companyId: co.id, app: 'finance', module: 'finance' });
    expect(await contextOfPath(env.DB, `/erp/c/${co.id}/suppliers`)).toMatchObject({ companyId: co.id, app: 'erp', module: 'procurement' });
    expect(await contextOfPath(env.DB, `/erp/c/${co.id}/overview`)).toMatchObject({ companyId: co.id, module: null });
    // Encoded ids find the same company (audit S11), and addresses of no single company give none.
    expect((await contextOfPath(env.DB, `/crm/orgs/${encodeURIComponent(co.tools.crm!)}/companies`))?.companyId).toBe(co.id);
    expect(await contextOfPath(env.DB, '/notifications')).toBeNull();
    expect(await contextOfPath(env.DB, '/workspaces/nope/boards')).toBeNull();
  });
});

describe('API tokens limited to one company (audit E3 and S5)', () => {
  it('stay in their company, and in their applications', async () => {
    const owner = await signup('Tess Token');
    const co = await registered(owner);
    const own = await ownOf(owner);
    const t = await owner.json('POST', '/api/me/tokens', { name: 'own only', companyId: own });
    expect(t.companyId).toBe(own);
    expect((await raw('GET', `/api/workspaces/${owner.workspaceId}`, { headers: bearer(t.token) })).status).toBe(200);
    expect((await raw('GET', `/api/system/companies/${own}`, { headers: bearer(t.token) })).status).toBe(200);
    // Another company's tool, a list across companies, and the other company itself: refused.
    for (const path of [`/api/workspaces/${co.tools.tasks}`, `/api/crm/orgs/${co.tools.crm}/automations`, '/api/notifications', `/api/erp/c/${co.id}/overview`]) {
      const res = await raw('GET', path, { headers: bearer(t.token) });
      expect(res.status, path).toBe(403);
      expect(((await res.json()) as any).details, path).toMatchObject({ code: 'TOKEN_SCOPE' });
    }
    // Limited to the CRM of the registered company.
    const crmOnly = await owner.json('POST', '/api/me/tokens', { name: 'crm', companyId: co.id, apps: ['crm'] });
    expect((await raw('GET', `/api/crm/orgs/${co.tools.crm}/automations`, { headers: bearer(crmOnly.token) })).status).toBe(200);
    expect((await raw('GET', `/api/workspaces/${co.tools.tasks}`, { headers: bearer(crmOnly.token) })).status).toBe(403);
  });

  it('read only tokens only read; new tokens expire in 90 days; a company must be one of the person’s', async () => {
    const owner = await signup('Rita Reader');
    const own = await ownOf(owner);
    const other = await signup('Otto Other');
    const theirs = await ownOf(other);
    expect((await owner.req('POST', '/api/me/tokens', { name: 'theirs', companyId: theirs })).status).toBe(400);
    expect((await owner.req('POST', '/api/me/tokens', { name: 'none' })).status).toBe(400);
    const t = await owner.json('POST', '/api/me/tokens', { name: 'reader', companyId: own, readOnly: true });
    expect((await raw('GET', `/api/workspaces/${owner.workspaceId}`, { headers: bearer(t.token) })).status).toBe(200);
    const write = await raw('POST', `/api/workspaces/${owner.workspaceId}/boards`, { body: { name: 'x' }, headers: bearer(t.token) });
    expect(write.status).toBe(403);
    const row = await env.DB.prepare('SELECT expires_at, created_at, read_only FROM api_tokens WHERE id = ?').bind(t.id).first<any>();
    expect(row.read_only).toBe(1);
    expect(row.expires_at - row.created_at).toBe(90 * 86_400_000);
    const list = await owner.json('GET', '/api/me/tokens');
    expect(list.find((x: any) => x.id === t.id)).toMatchObject({ company_id: own, readOnly: true, apps: null });
  });

  it('end when the person changes their password; tokens made before R4 keep acting as their person', async () => {
    const owner = await signup('Pia Password');
    const own = await ownOf(owner);
    const t = await owner.json('POST', '/api/me/tokens', { name: 'script', companyId: own });
    // A token from before R4: no company, no expiry.
    const legacy = 'wos_' + 'a'.repeat(43);
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(legacy))), (b) => b.toString(16).padStart(2, '0')).join('');
    await env.DB.prepare('INSERT INTO api_tokens (id, user_id, name, token_hash, prefix, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(`legacy-${owner.userId}`, owner.userId, 'old', hash, legacy.slice(0, 10), 1).run();
    expect((await raw('GET', '/api/notifications', { headers: bearer(legacy) })).status).toBe(200);
    expect((await owner.req('POST', '/api/me/password', { currentPassword: PASSWORD, newPassword: 'another-horse-77!x' })).status).toBe(200);
    expect((await raw('GET', `/api/workspaces/${owner.workspaceId}`, { headers: bearer(t.token) })).status).toBe(401);
    expect((await raw('GET', '/api/notifications', { headers: bearer(legacy) })).status).toBe(401);
    const reasons = await env.DB.prepare('SELECT revoked_reason FROM api_tokens WHERE user_id = ? ORDER BY id').bind(owner.userId).all<any>();
    expect(reasons.results.map((r) => r.revoked_reason)).toEqual(['password_change', 'password_change']);
  });
});

describe('module switches for every module', () => {
  it('a module switched off answers 403 MODULE_DISABLED to the company’s people only, and leaves other companies alone', async () => {
    const owner = await signup('Mia Modules');
    const co = await registered(owner);
    const outsider = await signup('Ned Outsider');
    const second = await registered(outsider);
    expect((await owner.req('GET', `/api/crm/orgs/${co.tools.crm}/automations`)).status).toBe(200);
    await switchOff('crm', co.id);
    await switchOff('procurement', co.id);
    await switchOff('tasks', co.id);
    const crm = await owner.req('GET', `/api/crm/orgs/${co.tools.crm}/automations`);
    expect(crm.status).toBe(403);
    expect(((await crm.json()) as any).details).toMatchObject({ code: 'MODULE_DISABLED', module: 'crm' });
    expect((await owner.req('GET', `/api/workspaces/${co.tools.tasks}`)).status).toBe(403);
    expect((await owner.req('GET', `/api/erp/c/${co.id}/suppliers`)).status).toBe(403);
    // The rest of the ERP, the person's own company and another company keep working.
    expect((await owner.req('GET', `/api/erp/c/${co.id}/overview`)).status).toBe(200);
    expect((await owner.req('GET', `/api/workspaces/${owner.workspaceId}`)).status).toBe(200);
    expect((await outsider.req('GET', `/api/crm/orgs/${second.tools.crm}/automations`)).status).toBe(200);
    // Someone outside the company gets the usual answer, never MODULE_DISABLED.
    const probe = await outsider.req('GET', `/api/crm/orgs/${co.tools.crm}/automations`);
    expect(probe.status).not.toBe(200);
    expect(JSON.stringify(await probe.json())).not.toContain('MODULE_DISABLED');
    const erpProbe = await outsider.req('GET', `/api/erp/c/${co.id}/suppliers`);
    expect(erpProbe.status).toBe(404);
  });
});
