// One company identity (Stage 1, R3; src/worker/company/identity.ts, migration 0030): every company of every kind has one
// row in `companies` with its own id, kept in step by every write and repaired by the maintenance run.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { companyById, companyDrift, syncAllCompanies, syncCompany } from '../src/worker/company/identity';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function createCompany(c: Client, abn = newAbn()) {
  const res = await c.req('POST', '/api/company/companies', {
    kind: 'business',
    name: 'Harbour Fabrication',
    legalName: '',
    abn,
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
  return data.company as { id: string; name: string };
}

const row = (id: string) => env.DB.prepare('SELECT * FROM companies WHERE id = ?').bind(id).first<any>();

describe('the registry of every company', () => {
  it('records a registered company with its ABN, its owner and no more than the checks found', async () => {
    const owner = await signup('Ola Owner');
    const abn = newAbn();
    const company = await createCompany(owner, abn);
    expect(await row(company.id)).toMatchObject({
      type: 'registered',
      name: 'Harbour Fabrication',
      owner_id: owner.userId,
      country: 'AU',
      legal_structure: 'business',
      registration_type: 'ABN',
      registration_number: abn,
      registration_status: 'registration_pending',
      status_source: 'format',
      verified_at: null,
      deleted_at: null,
    });
    expect((await companyById(env.DB, company.id))?.type).toBe('registered');
  });

  it('follows a new owner, a suspension and a deletion', async () => {
    const owner = await signup('Pat Owner');
    const company = await createCompany(owner);
    const next = await signup('Rae Next');
    const inv = await owner.json('POST', `/api/company/c/${company.id}/invitations`, { email: next.email, role: 'admin' });
    await next.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
    await owner.json('POST', `/api/company/c/${company.id}/transfer`, { userId: next.userId });
    expect((await row(company.id)).owner_id).toBe(next.userId);
    await env.DB.prepare('UPDATE co_companies SET suspended_at = 5 WHERE id = ?').bind(company.id).run();
    await syncCompany(env.DB, company.id);
    expect((await row(company.id)).suspended_at).toBe(5);
    await env.DB.prepare('UPDATE co_companies SET suspended_at = NULL WHERE id = ?').bind(company.id).run();
    await syncCompany(env.DB, company.id);
    const del = await next.req('DELETE', `/api/company/c/${company.id}`, { confirm: company.name });
    expect(del.status).toBe(200);
    expect((await row(company.id)).deleted_at).not.toBeNull();
    expect(await companyById(env.DB, company.id)).toBeNull();
  });

  it('records each person’s own company and its new name', async () => {
    const solo = await signup('Sam Solo');
    const me = await solo.json('GET', '/api/system/me');
    const own = (me.companies as any[]).find((c) => c.kind === 'own');
    expect(await row(own.id)).toMatchObject({ type: 'personal', owner_id: solo.userId, registration_status: 'not_registered', registration_number: null });
    await solo.json('PATCH', `/api/system/companies/${own.id}`, { name: 'Sam Studio' });
    expect((await row(own.id)).name).toBe('Sam Studio');
  });

  it('records the example company, and marks it deleted when it is removed', async () => {
    const learner = await signup('Lee Learner');
    const made = await learner.json('POST', '/api/system/demo', {});
    expect(made.companyId).toBeTruthy();
    expect(await row(made.companyId)).toMatchObject({ type: 'example', owner_id: learner.userId, deleted_at: null });
    await learner.json('POST', '/api/system/demo/remove', {});
    expect((await row(made.companyId)).deleted_at).not.toBeNull();
  });

  it('finds what is out of step and the maintenance run puts it right', async () => {
    const owner = await signup('Dee Drift');
    const company = await createCompany(owner);
    const me = await owner.json('GET', '/api/system/me');
    const own = (me.companies as any[]).find((c) => c.kind === 'own');
    expect(await companyDrift(env.DB)).toEqual({ missing: 0, mismatched: 0, orphaned: 0 });
    // A write that missed the registry, a lost row, and a company whose source is gone.
    await env.DB.prepare("UPDATE co_companies SET name = 'Renamed Directly' WHERE id = ?").bind(company.id).run();
    await env.DB.prepare('DELETE FROM companies WHERE id = ?').bind(own.id).run();
    await env.DB.prepare("INSERT INTO companies (id, type, name, created_at, updated_at) VALUES ('ghost-personal', 'personal', 'Ghost', 1, 1)").run();
    expect(await companyDrift(env.DB)).toEqual({ missing: 1, mismatched: 1, orphaned: 1 });
    const fixed = await syncAllCompanies(env.DB);
    expect(fixed.changed).toBeGreaterThanOrEqual(2);
    expect(fixed.orphaned).toBe(1);
    expect(await companyDrift(env.DB)).toEqual({ missing: 0, mismatched: 0, orphaned: 0 });
    expect((await row(company.id)).name).toBe('Renamed Directly');
    expect((await row('ghost-personal')).deleted_at).not.toBeNull();
    // Nothing left to do: a second run changes nothing.
    expect(await syncAllCompanies(env.DB)).toEqual({ changed: 0, orphaned: 0 });
  });

  it('keeps a status a platform admin set while the number is the same, and resets it when the number changes', async () => {
    const owner = await signup('Mo Manual');
    const company = await createCompany(owner);
    await env.DB.prepare("UPDATE companies SET registration_status = 'manual_review', status_source = 'manual' WHERE id = ?").bind(company.id).run();
    await env.DB.prepare("UPDATE co_companies SET name = 'Manual Two' WHERE id = ?").bind(company.id).run();
    await syncCompany(env.DB, company.id);
    expect(await row(company.id)).toMatchObject({ name: 'Manual Two', registration_status: 'manual_review', status_source: 'manual' });
    const other = newAbn();
    await env.DB.prepare('UPDATE co_companies SET abn = ? WHERE id = ?').bind(other, company.id).run();
    await syncCompany(env.DB, company.id);
    expect(await row(company.id)).toMatchObject({ registration_number: other, registration_status: 'registration_pending', status_source: 'format' });
  });

  it('refuses a second company with the same country, registration type and number', async () => {
    const owner = await signup('Uma Unique');
    const company = await createCompany(owner);
    const reg = await row(company.id);
    await expect(
      env.DB.prepare("INSERT INTO companies (id, type, name, country, registration_type, registration_number, created_at, updated_at) VALUES ('dupe', 'registered', 'Copy', 'AU', 'ABN', ?, 1, 1)").bind(reg.registration_number).run(),
    ).rejects.toThrow();
  });
});

describe('how an email was proven', () => {
  it('says invitation when an invitation proves it, and stays empty while unproven', async () => {
    const owner = await signup('Ivy Inviter');
    const company = await createCompany(owner);
    const guest = await signup('Gus Guest');
    const before = await env.DB.prepare('SELECT email_verified_at, email_verified_via FROM users WHERE id = ?').bind(guest.userId).first<any>();
    if (!before.email_verified_at) expect(before.email_verified_via).toBeNull();
    const inv = await owner.json('POST', `/api/company/c/${company.id}/invitations`, { email: guest.email });
    await guest.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
    const after = await env.DB.prepare('SELECT email_verified_at, email_verified_via FROM users WHERE id = ?').bind(guest.userId).first<any>();
    expect(after.email_verified_at).not.toBeNull();
    expect(after.email_verified_via).toBe(before.email_verified_at ? before.email_verified_via : 'invitation');
  });
});
