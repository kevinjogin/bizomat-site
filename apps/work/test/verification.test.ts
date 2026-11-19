// Registration and verification (Stage 1, R6; docs/platform/verification.md). Every capability is behind a flag that
// ships off; these tests switch each one on in the database for their own companies.
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import worker from '../src/worker/index';
import { ORIGIN, PASSWORD, randomIp, signup, uniqueEmail, type Client } from './helpers';
import { abnValid, setAbrFetchForTests } from '../src/worker/company/verify';
import { checkIdentifier, providerFor } from '../src/worker/company/countries';
import { matchNames, runScheduledVerification, setCompaniesHouseFetchForTests, setRetrySleepForTests, statusFrom, verifyCompany } from '../src/worker/company/verification';
import { base32Decode, hotp, stepAt } from '../src/worker/platform/totp';

afterEach(() => {
  setAbrFetchForTests(null);
  setCompaniesHouseFetchForTests(null);
  setRetrySleepForTests(null);
});

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registered(c: Client, o: { abn?: string; legalName?: string; name?: string } = {}) {
  const res = await c.req('POST', '/api/company/companies', {
    kind: 'business',
    name: o.name ?? 'Harbour Fabrication',
    legalName: o.legalName ?? 'Harbour Fabrication Pty Ltd',
    abn: o.abn ?? newAbn(),
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

/** A flag on for one company, one country or everyone (as the Control Centre would store it). */
async function flag(key: string, scope: 'global' | 'company' | 'country' = 'global', scopeId = '') {
  await env.DB.prepare("INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, ?, ?, 'on', 'test', 'test', 1)").bind(key, scope, scopeId).run();
}

const abrAnswer = (o: { status?: string; name?: string; found?: boolean }) => async () =>
  new Response(`abr(${JSON.stringify(o.found === false ? { Message: 'No record found' } : { Abn: '1', AbnStatus: o.status ?? 'Active', EntityName: o.name ?? 'HARBOUR FABRICATION PTY LTD', BusinessName: [] })})`);

const withAbr = { ...env, ABR_GUID: 'test-guid' } as any;
const offAU = () => env.DB.prepare("DELETE FROM feature_flags WHERE key = 'registry_verification_enabled' AND scope = 'country' AND scope_id = 'AU'").run();
const statusOf = async (id: string) => (await env.DB.prepare('SELECT registration_status, status_source, verified_at, next_check_at FROM companies WHERE id = ?').bind(id).first<any>())!;

/** A request with extra settings in the worker's environment (a register's key). */
async function call(c: Client, method: string, path: string, body: unknown, over: Record<string, string>) {
  const h: Record<string, string> = { Origin: ORIGIN, 'CF-Connecting-IP': randomIp(), Accept: 'application/json', Cookie: c.cookie, 'X-CSRF-Token': c.csrf, 'Content-Type': 'application/json' };
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, { method, headers: h, body: JSON.stringify(body) }), { ...env, ...over } as any, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

async function platformAdmin() {
  const a = await signup('Vera Verifier');
  await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'admin', 'test', ?)").bind(a.userId, Date.now()).run();
  const start = await a.json('POST', '/api/admin/platform/security/mfa/start', {});
  await a.json('POST', '/api/admin/platform/security/mfa/confirm', { code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
  const reauth = async () => {
    await env.DB.prepare('UPDATE user_mfa SET last_step = 0 WHERE user_id = ?').bind(a.userId).run();
    await a.json('POST', '/api/admin/platform/security/reauth', { password: PASSWORD, code: await hotp(base32Decode(start.secret), stepAt(Date.now())) });
  };
  return { a, reauth };
}

describe('country rules and names', () => {
  it('checks each country’s registration numbers, and knows which register can verify them', () => {
    expect(checkIdentifier('AU', 'ABN', '51 824 753 556')).toMatchObject({ ok: true, value: '51824753556' });
    expect(checkIdentifier('AU', 'ABN', '51 824 753 557').ok).toBe(false);
    expect(checkIdentifier('GB', 'CRN', 'sc 123456')).toMatchObject({ ok: true, value: 'SC123456' });
    expect(checkIdentifier('IN', 'CIN', 'U72900KA2015PTC123456').ok).toBe(true);
    expect(checkIdentifier('US', 'EIN', '12-3456789')).toMatchObject({ ok: true, value: '123456789' });
    expect(checkIdentifier('NZ', 'OTHER', '1234567')).toMatchObject({ ok: true });
    expect(checkIdentifier('GB', 'ABN', '51824753556').ok).toBe(false);
    expect(providerFor('AU', 'ABN')).toBe('abr');
    expect(providerFor('GB', 'CRN')).toBe('companies_house');
    expect(providerFor('US', 'EIN')).toBeNull();
    expect(providerFor('IN', 'CIN')).toBeNull();
  });

  it('compares names after case, punctuation and company suffixes, and sends close matches to review', () => {
    expect(matchNames('Harbour Fabrication Pty Ltd', ['HARBOUR FABRICATION PTY. LTD.'])).toBe('exact');
    expect(matchNames('Acme Widgets LLC', ['ACME WIDGETS, L.L.C.'])).toBe('exact');
    expect(matchNames('Harbour Fabrication', ['Harbour Fabrication and Welding Pty Ltd'])).toBe('close');
    expect(matchNames('Harbour Fabrication', ['Mountain Bakery Pty Ltd'])).toBe('different');
    expect(statusFrom('active', 'exact', 'registration_pending')).toBe('verified');
    expect(statusFrom('active', 'close', 'registration_pending')).toBe('manual_review');
    expect(statusFrom('inactive', null, 'verified')).toBe('status_changed');
    expect(statusFrom('not_found', null, 'registration_pending')).toBe('verification_failed');
  });
});

describe('the verification service', () => {
  it('does nothing while automatic registry checks are off', async () => {
    const owner = await signup('Off Owner');
    const co = await registered(owner);
    expect(await verifyCompany(withAbr, co.id, 'on_demand')).toEqual({ result: 'flag_off' });
    expect((await statusOf(co.id)).registration_status).toBe('registration_pending');
  });

  it('verifies a same-name active ABN, records the check and the change, and tells the owner', async () => {
    const owner = await signup('Ver Owner');
    const co = await registered(owner);
    await flag('registry_verification_enabled', 'country', 'AU');
    setAbrFetchForTests(abrAnswer({}));
    const r = await verifyCompany({ ...withAbr, EMAIL_PROVIDER: 'log' }, co.id, 'on_demand', owner.userId);
    expect(r).toMatchObject({ result: 'checked', status: 'verified', match: 'exact' });
    const s = await statusOf(co.id);
    expect(s).toMatchObject({ registration_status: 'verified', status_source: 'registry' });
    expect(s.next_check_at - Date.now()).toBeGreaterThan(29 * 86_400_000);
    const h = await env.DB.prepare('SELECT old_status, new_status, source FROM company_verification_history WHERE company_id = ?').bind(co.id).all<any>();
    expect(h.results).toEqual([{ old_status: 'registration_pending', new_status: 'verified', source: 'registry' }]);
    await expect(env.DB.prepare('DELETE FROM company_verification_history WHERE company_id = ?').bind(co.id).run()).rejects.toThrow(/append only/);
    const mail = await env.DB.prepare("SELECT COUNT(*) AS n FROM email_outbox WHERE idempotency_key LIKE ?").bind(`verification:${co.id}:%`).first<any>();
    expect(mail.n).toBeGreaterThanOrEqual(1);
    // The registry sync does not undo it.
    await env.DB.prepare("UPDATE co_companies SET name = 'Renamed' WHERE id = ?").bind(co.id).run();
    const { syncCompany } = await import('../src/worker/company/identity');
    await syncCompany(env.DB, co.id);
    expect((await statusOf(co.id)).registration_status).toBe('verified');
    await offAU();
  });

  it('sends a similar name to manual review, an unknown number to failed, and never fails on an outage', async () => {
    setRetrySleepForTests(async () => {});
    const owner = await signup('Mix Owner');
    const close = await registered(owner, { legalName: 'Harbour Fabrication' });
    await flag('registry_verification_enabled', 'country', 'AU');
    setAbrFetchForTests(abrAnswer({ name: 'HARBOUR FABRICATION AND WELDING PTY LTD' }));
    expect(await verifyCompany(withAbr, close.id, 'on_demand')).toMatchObject({ status: 'manual_review', match: 'close' });

    const missing = await registered(owner, { name: 'Second Co', legalName: 'Second Co Pty Ltd' });
    setAbrFetchForTests(abrAnswer({ found: false }));
    expect(await verifyCompany(withAbr, missing.id, 'on_demand')).toMatchObject({ status: 'verification_failed' });

    const down = await registered(owner, { name: 'Third Co', legalName: 'Third Co Pty Ltd' });
    let calls = 0;
    setAbrFetchForTests(async () => {
      calls++;
      throw new Error('network down');
    });
    expect(await verifyCompany(withAbr, down.id, 'on_demand')).toEqual({ result: 'unavailable' });
    expect(calls).toBe(3);
    const s = await statusOf(down.id);
    expect(s.registration_status).toBe('registration_pending');
    expect(s.next_check_at - Date.now()).toBeLessThanOrEqual(3_600_000);
    const health = await env.DB.prepare("SELECT consecutive_failures FROM company_registry_providers WHERE id = 'abr'").first<any>();
    expect(health.consecutive_failures).toBeGreaterThanOrEqual(1);
    // Without the register's key, nothing is asked.
    expect(await verifyCompany(env as any, down.id, 'on_demand')).toEqual({ result: 'not_configured' });
    await offAU();
  });

  it('runs the due checks from the maintenance run only while scheduled re-verification is on', async () => {
    const owner = await signup('Sched Owner');
    const co = await registered(owner);
    await flag('registry_verification_enabled', 'country', 'AU');
    setAbrFetchForTests(abrAnswer({}));
    expect(await runScheduledVerification(withAbr)).toEqual({ checked: 0, skipped: 'flag_off' });
    await flag('scheduled_reverification');
    await env.DB.prepare('UPDATE companies SET next_check_at = 1 WHERE id = ?').bind(co.id).run();
    const r = await runScheduledVerification(withAbr, Date.now(), 500);
    expect(r.checked).toBeGreaterThanOrEqual(1);
    expect((await statusOf(co.id)).registration_status).toBe('verified');
    await env.DB.prepare("DELETE FROM feature_flags WHERE key = 'scheduled_reverification'").run();
    await offAU();
  });
});

describe('manual review, evidence and decisions', () => {
  it('takes PDF and image evidence only, lets a platform admin decide with a reason, and never lets a company verify itself', async () => {
    const owner = await signup('Ev Owner');
    const co = await registered(owner);
    const upload = async (type: string, bytes: Uint8Array, name = 'certificate.pdf') => {
      const fd = new FormData();
      fd.append('file', new File([bytes], name, { type }));
      return owner.req('POST', `/api/company/c/${co.id}/verification/evidence`, fd as any);
    };
    const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    expect((await upload('application/pdf', pdf)).status).toBe(201);
    expect((await upload('image/png', pdf, 'fake.png')).status).toBe(400);
    expect((await upload('text/html', new TextEncoder().encode('<script>'), 'x.html')).status).toBe(400);
    // The company asks for a manual review; it cannot choose its status.
    await owner.json('POST', `/api/company/c/${co.id}/verification/review`, { note: 'Our certificate is attached' });
    const mine = await owner.json('GET', `/api/company/c/${co.id}/verification`);
    expect(mine).toMatchObject({ status: 'manual_review', checksOn: false, enforced: false });
    expect(mine.evidence).toHaveLength(1);
    // The platform admin decides, after a fresh password and code; history keeps old and new status.
    const { a, reauth } = await platformAdmin();
    const queue = await a.json('GET', '/api/admin/platform/verification');
    expect(queue.queue.map((q: any) => q.id)).toContain(co.id);
    expect(queue.totals.manual_review).toBeGreaterThanOrEqual(1);
    const ev = (await a.json('GET', `/api/admin/platform/verification/${co.id}`)).evidence[0];
    const file = await a.req('GET', `/api/admin/platform/verification/${co.id}/evidence/${ev.id}`);
    expect(file.headers.get('Content-Disposition')).toContain('attachment');
    expect((await a.req('POST', `/api/admin/platform/verification/${co.id}/decision`, { status: 'verified', reason: 'Certificate matches' })).status).toBe(403);
    await reauth();
    const d = await a.json('POST', `/api/admin/platform/verification/${co.id}/decision`, { status: 'verified', reason: 'Certificate matches the register', evidence: [{ id: ev.id, status: 'accepted' }] });
    expect(d).toMatchObject({ changed: true, from: 'manual_review', to: 'verified' });
    const h = await env.DB.prepare("SELECT old_status, new_status, source, reason, actor_id FROM company_verification_history WHERE company_id = ? AND source = 'manual'").bind(co.id).first<any>();
    expect(h).toMatchObject({ old_status: 'manual_review', new_status: 'verified', reason: 'Certificate matches the register', actor_id: a.userId });
    expect((await owner.req('POST', `/api/company/c/${co.id}/verification/review`, { note: 'again please' })).status).toBe(409);
  });
});

describe('verification enforcement', () => {
  it('closes an unverified company’s tools to its people, keeps its company area, and opens them once verified', async () => {
    const owner = await signup('Enf Owner');
    const co = await registered(owner);
    expect((await owner.req('GET', `/api/workspaces/${co.tools.tasks}`)).status).toBe(200);
    await flag('verification_enforcement', 'company', co.id);
    const closed = await owner.req('GET', `/api/workspaces/${co.tools.tasks}`);
    expect(closed.status).toBe(403);
    expect(((await closed.json()) as any).details).toMatchObject({ code: 'VERIFICATION_REQUIRED' });
    expect((await owner.req('GET', `/api/erp/c/${co.id}/overview`)).status).toBe(403);
    expect((await owner.req('GET', `/api/company/c/${co.id}`)).status).toBe(200);
    expect((await owner.req('GET', `/api/company/c/${co.id}/verification`)).status).toBe(200);
    // Someone outside gets the usual answer.
    const outsider = await signup('Enf Outsider');
    expect(JSON.stringify(await (await outsider.req('GET', `/api/workspaces/${co.tools.tasks}`)).json())).not.toContain('VERIFICATION_REQUIRED');
    await env.DB.prepare("UPDATE companies SET registration_status = 'verified' WHERE id = ?").bind(co.id).run();
    expect((await owner.req('GET', `/api/workspaces/${co.tools.tasks}`)).status).toBe(200);
  });
});

describe('request to join and registration outside Australia', () => {
  it('asks the owner of an existing company, answers the same for an unknown number, and joins with a role’s preset', async () => {
    const owner = await signup('Jo Owner');
    const abn = newAbn();
    const co = await registered(owner, { abn });
    const asker = await signup('Ash Asker');
    expect((await asker.req('POST', '/api/company/join-requests', { country: 'AU', type: 'ABN', number: abn })).status).toBe(403);
    await flag('join_requests');
    const yes = await asker.json('POST', '/api/company/join-requests', { country: 'AU', type: 'ABN', number: abn, message: 'I work here' });
    const no = await asker.json('POST', '/api/company/join-requests', { country: 'AU', type: 'ABN', number: newAbn() });
    expect(yes).toEqual(no);
    const list = await owner.json('GET', `/api/company/c/${co.id}/join-requests`);
    expect(list).toEqual([expect.objectContaining({ email: asker.email, message: 'I work here' })]);
    await owner.json('POST', `/api/company/c/${co.id}/join-requests/${list[0].id}/approve`, { role: 'read_only' });
    const m = await env.DB.prepare('SELECT role, crm_role FROM co_members WHERE company_id = ? AND user_id = ?').bind(co.id, asker.userId).first<any>();
    expect(m).toEqual({ role: 'read_only', crm_role: 'viewer' });
    expect((await env.DB.prepare('SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?').bind(co.tools.crm, asker.userId).first<any>()).role).toBe('viewer');
    await env.DB.prepare("DELETE FROM feature_flags WHERE key = 'join_requests'").run();
  });

  it('registers a United Kingdom company when switched on, checks it with Companies House, and refuses a second one with the same number', async () => {
    const owner = await signup('Uk Owner');
    const crn = `${10000000 + Math.floor(Math.random() * 89999999)}`;
    const form = { country: 'GB', name: 'Thames Tools', legalName: 'Thames Tools Limited', structure: 'limited_company', registrationType: 'CRN', registrationNumber: crn, email: uniqueEmail('uk'), phone: '+44 20 7946 0000', addressLine1: '1 Example Road', city: 'London', postcode: 'SW1A 1AA' };
    expect((await owner.req('POST', '/api/company/companies/international', form)).status).toBe(403);
    const closed = (await (await owner.req('GET', '/api/company/registration-options')).json()) as any;
    expect(closed.international).toBe(false);
    await flag('international_registration', 'country', 'GB');
    // On for one country: the page offers that country only.
    const open = (await (await owner.req('GET', '/api/company/registration-options')).json()) as any;
    expect(open).toMatchObject({ international: true, internationalCountries: ['GB'], internationalOff: [] });
    await flag('registry_verification_enabled', 'country', 'GB');
    setCompaniesHouseFetchForTests(async (url) => (url.endsWith(`/company/${crn}`) ? Response.json({ company_name: 'THAMES TOOLS LIMITED', company_status: 'active' }) : new Response('', { status: 404 })));
    const res = await call(owner, 'POST', '/api/company/companies/international', form, { COMPANIES_HOUSE_API_KEY: 'test-key' });
    expect(res.status).toBe(201);
    const id = ((await res.json()) as any).company.id;
    const reg = await env.DB.prepare('SELECT country, registration_type, registration_number, registration_status, legal_structure FROM companies WHERE id = ?').bind(id).first<any>();
    expect(reg).toEqual({ country: 'GB', registration_type: 'CRN', registration_number: crn, registration_status: 'verified', legal_structure: 'limited_company' });
    expect((await env.DB.prepare('SELECT country, phone_kind FROM co_companies WHERE id = ?').bind(id).first<any>())).toEqual({ country: 'GB', phone_kind: 'international' });
    const again = await owner.req('POST', '/api/company/companies/international', form);
    expect(again.status).toBe(409);
    expect(((await again.json()) as any).details).toMatchObject({ code: 'COMPANY_EXISTS' });
    // The registry sync keeps the number (it is not an ABN).
    const { syncAllCompanies, companyDrift } = await import('../src/worker/company/identity');
    await syncAllCompanies(env.DB);
    expect((await env.DB.prepare('SELECT registration_number FROM companies WHERE id = ?').bind(id).first<any>()).registration_number).toBe(crn);
    expect(await companyDrift(env.DB)).toEqual({ missing: 0, mismatched: 0, orphaned: 0 });
    await env.DB.prepare("DELETE FROM feature_flags WHERE key IN ('international_registration', 'registry_verification_enabled') AND scope = 'country'").run();
  });
});
