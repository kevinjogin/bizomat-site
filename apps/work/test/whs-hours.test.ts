// BIZOMAT WHS: hours worked and injury frequency rates (owner's brief of 15 Nov 2026, task 2), and the medical privacy
// review: who may enter hours and what the rules are (no future months, sane amounts, one figure per site and month,
// never a whole-company figure beside site figures), the append-only history with a reason for every change or
// removal, company isolation, LTIFR and TRIFR over whole months only with hours for every site (and the "cannot be
// calculated" note naming what is missing), and that medical details reach nobody but health officers.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { monthLabel, wholeMonths } from '../src/worker/whs/hours';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registerCompany(c: Client, name: string) {
  const res = await c.req('POST', '/api/company/companies', { kind: 'business', name, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return data.company.id as string;
}

async function joinCompany(owner: Client, companyId: string, invitee: Client) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

type Who = 'manager' | 'officer' | 'investigator' | 'hsr' | 'health' | 'worker' | 'exec';

/** A registered company with the WHS roles, and two sites. */
async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const co = await registerCompany(owner, `${label} Works`);
  const people = {} as Record<Who, Client>;
  for (const [key, role] of [
    ['manager', 'whs_manager'],
    ['officer', 'whs_officer'],
    ['investigator', 'whs_investigator'],
    ['hsr', 'whs_hsr'],
    ['health', 'health_officer'],
    ['worker', null],
    ['exec', 'executive'],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p);
    if (role) await owner.json('PUT', `/api/erp/c/${co}/roles/${p.userId}`, { roles: [role] });
    people[key] = p;
  }
  const siteA = await owner.json('POST', `/api/maintenance/c/${co}/sites`, { code: 'A', name: `${label} site A` });
  const siteB = await owner.json('POST', `/api/maintenance/c/${co}/sites`, { code: 'B', name: `${label} site B` });
  return { owner, co, siteA: siteA.id as string, siteB: siteB.id as string, siteAName: `${label} site A`, siteBName: `${label} site B`, ...people };
}

const w = (co: string, path = '') => `/api/whs/c/${co}${path}`;
/** The month `n` months before the current one (UTC), YYYY-MM. */
const mo = (n: number) => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - n, 1)).toISOString().slice(0, 7);
};
const lastDay = (m: string) => `${m}-${String(new Date(Date.UTC(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0)).getUTCDate()).padStart(2, '0')}`;
const put = (c: Client, co: string, entries: unknown[], reason?: string) => c.req('PUT', w(co, '/hours'), { entries, ...(reason === undefined ? {} : { reason }) });
const errorOf = async (res: Response) => ((await res.json()) as any).error as string;

describe('whole months', () => {
  it('counts only the calendar months a period fully covers', () => {
    expect(wholeMonths('2026-01-01', '2026-03-31')).toEqual(['2026-01', '2026-02', '2026-03']);
    expect(wholeMonths('2026-01-02', '2026-03-30')).toEqual(['2026-02']);
    expect(wholeMonths('2024-02-01', '2024-02-29')).toEqual(['2024-02']);
    expect(wholeMonths('2026-01-05', '2026-01-20')).toEqual([]);
    expect(wholeMonths('2010-01-01', '2026-12-31')).toBeNull();
  });
});

describe('BIZOMAT WHS hours worked', () => {
  it('lets only WHS managers and ERP administrators enter hours, within the rules', async () => {
    const t = await team('Hours rules');
    const ok = { siteId: t.siteA, month: mo(1), hours: 1000 };
    for (const who of [t.worker, t.officer, t.investigator, t.hsr, t.health, t.exec]) expect((await put(who, t.co, [ok])).status, who.name).toBe(403);
    expect(await t.manager.json('PUT', w(t.co, '/hours'), { entries: [ok] })).toEqual({ ok: true, changed: 1 });
    expect(await t.owner.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: t.siteB, month: mo(1), hours: 812.346 }] })).toEqual({ ok: true, changed: 1 });
    // the current month may be entered; a month that has not started may not
    expect((await put(t.manager, t.co, [{ siteId: t.siteA, month: mo(0), hours: 10 }])).status).toBe(200);
    const next = await put(t.manager, t.co, [{ siteId: t.siteA, month: mo(-2), hours: 10 }]);
    expect(next.status).toBe(400);
    expect(await errorOf(next)).toMatch(/has not started yet/);
    for (const bad of [
      { siteId: t.siteA, month: '1999-12', hours: 10 },
      { siteId: t.siteA, month: '2026-13', hours: 10 },
      { siteId: t.siteA, month: '2026-1', hours: 10 },
      { siteId: t.siteA, month: mo(2), hours: -1 },
      { siteId: t.siteA, month: mo(2), hours: 10_000_001 },
      { siteId: 'not-a-site', month: mo(2), hours: 10 },
    ]) expect((await put(t.manager, t.co, [bad])).status, JSON.stringify(bad)).toBe(400);
    expect(await errorOf(await put(t.manager, t.co, [{ siteId: t.siteA, month: mo(2), hours: 1 }, { siteId: t.siteA, month: mo(2), hours: 2 }]))).toMatch(/each site and month once/);
    // a site of another company
    const other = await team('Hours other');
    expect(await errorOf(await put(t.manager, t.co, [{ siteId: other.siteA, month: mo(2), hours: 1 }]))).toMatch(/site of this company/);
    // never a whole-company figure beside site figures for the same month, either way round
    expect(await errorOf(await put(t.manager, t.co, [{ siteId: null, month: mo(1), hours: 500 }]))).toMatch(/already has hours by site/);
    await t.manager.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: null, month: mo(2), hours: 500 }] });
    expect(await errorOf(await put(t.manager, t.co, [{ siteId: t.siteA, month: mo(2), hours: 300 }]))).toMatch(/already has hours for the whole company/);
    // replacing the whole-company figure by site figures in one save is allowed, with a reason
    expect(await t.manager.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: null, month: mo(2), hours: null }, { siteId: t.siteA, month: mo(2), hours: 300 }, { siteId: t.siteB, month: mo(2), hours: 200 }], reason: 'Split by site' })).toEqual({ ok: true, changed: 3 });
    const s = await t.manager.json('GET', w(t.co, '/settings'));
    expect(s.hours.find((h: any) => h.siteId === t.siteB && h.month === mo(1))).toMatchObject({ hours: 812.35, enteredByName: t.owner.name });
    expect(s.hours.some((h: any) => h.siteId === null)).toBe(false);
    expect(s.hoursSites.map((x: any) => x.id).sort()).toEqual([t.siteA, t.siteB].sort());
    expect(s.hoursLimits).toMatchObject({ latestMonth: expect.stringMatching(/^\d{4}-\d{2}$/), maxHours: 10_000_000 });
  });

  it('keeps every entry, change and removal with its reason, and nobody can rewrite that history', async () => {
    const t = await team('Hours history');
    const m = mo(3);
    await t.manager.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: t.siteA, month: m, hours: 1000 }, { siteId: t.siteB, month: m, hours: 50 }] });
    expect(await errorOf(await put(t.manager, t.co, [{ siteId: t.siteA, month: m, hours: 1200 }]))).toMatch(/reason/);
    expect(await errorOf(await put(t.manager, t.co, [{ siteId: t.siteA, month: m, hours: 1200 }], ' ab '))).toMatch(/reason/);
    expect(await t.manager.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: t.siteA, month: m, hours: 1200 }], reason: 'Payroll figures corrected' })).toEqual({ ok: true, changed: 1 });
    // the same figure again changes nothing and needs no reason
    expect(await t.manager.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: t.siteA, month: m, hours: 1200 }] })).toEqual({ ok: true, changed: 0 });
    expect(await errorOf(await put(t.manager, t.co, [{ siteId: t.siteA, month: m, hours: null }]))).toMatch(/reason/);
    expect(await t.manager.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: t.siteA, month: m, hours: null }], reason: 'Entered against the wrong site' })).toEqual({ ok: true, changed: 1 });
    const s = await t.manager.json('GET', w(t.co, '/settings'));
    const forA = s.hoursHistory.filter((r: any) => r.siteId === t.siteA && r.month === m);
    expect(forA).toEqual([
      expect.objectContaining({ before: 1200, after: null, reason: 'Entered against the wrong site', byName: t.manager.name }),
      expect.objectContaining({ before: 1000, after: 1200, reason: 'Payroll figures corrected', byName: t.manager.name }),
      expect.objectContaining({ before: null, after: 1000, reason: '', byName: t.manager.name, siteName: t.siteAName }),
    ]);
    expect(s.hours).toEqual([expect.objectContaining({ siteId: t.siteB, month: m, hours: 50 })]);
    // the WHS history names the change and its reason too
    const ev = await env.DB.prepare("SELECT after_json FROM whs_events WHERE company_id = ? AND action = 'settings.hours' ORDER BY created_at DESC, rowid DESC LIMIT 1").bind(t.co).first<{ after_json: string }>();
    expect(JSON.parse(ev!.after_json)).toMatchObject({ reason: 'Entered against the wrong site', entries: [{ siteId: t.siteA, month: m, hours: null }] });
    // the database refuses to change or delete the history
    await expect(env.DB.prepare("UPDATE whs_hours_revisions SET reason = 'rewritten' WHERE company_id = ?").bind(t.co).run()).rejects.toThrow(/append-only/);
    await expect(env.DB.prepare('UPDATE whs_hours_revisions SET after_hours = 1 WHERE company_id = ?').bind(t.co).run()).rejects.toThrow(/append-only/);
    await expect(env.DB.prepare('DELETE FROM whs_hours_revisions WHERE company_id = ?').bind(t.co).run()).rejects.toThrow(/append-only/);
    // who reads hours: people who read the WHS registers; a worker sees none of it
    const mine = await t.worker.json('GET', w(t.co, '/settings'));
    expect(mine).toMatchObject({ hours: [], hoursHistory: [], hoursSites: [], hoursVisible: false });
    expect((await t.exec.json('GET', w(t.co, '/settings'))).hours.length).toBe(1);
    // another company sees nothing and can change nothing
    const other = await team('Hours isolation');
    expect((await put(other.manager, t.co, [{ siteId: null, month: m, hours: 1 }])).status).toBe(404);
    expect((await other.manager.req('GET', w(t.co, '/settings'))).status).toBe(404);
    expect((await other.manager.json('GET', w(other.co, '/settings'))).hoursHistory).toEqual([]);
  });

  it('works out LTIFR and TRIFR over whole months with hours for every site, and says what is missing', async () => {
    const t = await team('Rates');
    const [m3, m2, m1] = [mo(3), mo(2), mo(1)];
    const dash = (q: string, who: Client = t.manager) => who.json('GET', w(t.co, `/dashboard?${q}`));
    const period = `from=${m3}-01&to=${lastDay(m1)}`;
    // a lost time injury and a medical treatment injury at the sites, first aid only, and a restricted duties injury
    // with no site; plus a first aid injury whose confidential health record says days were lost (never counted)
    await t.manager.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Crushed foot', occurredDate: `${m2}-10`, siteId: t.siteA, outcome: 'lost_time', severity: 'moderate' });
    await t.manager.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Cut hand', occurredDate: `${m2}-15`, siteId: t.siteB, outcome: 'medical_treatment' });
    await t.manager.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Splinter', occurredDate: `${m3}-03`, siteId: t.siteA, outcome: 'first_aid' });
    await t.manager.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Strained back', occurredDate: `${m1}-07`, outcome: 'restricted_duties' });
    await t.manager.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Bruised arm', occurredDate: `${m1}-08`, siteId: t.siteA, outcome: 'first_aid', health: { personName: 'Test person', daysLost: 10 } });

    // no hours: no figure, and the note names every site and month missing
    let d = await dash(period);
    expect(d.rates).toMatchObject({ available: false, ltifr: null, trifr: null, period: { from: m3, to: m1, months: 3 } });
    expect(d.rates.missing).toHaveLength(6);
    expect(d.rates.note).toMatch(/^Cannot be calculated: hours worked missing for /);
    expect(d.rates.note).toContain(`${t.siteAName} (${monthLabel(m3)}, ${monthLabel(m2)}, ${monthLabel(m1)})`);
    expect(d.rates.note).toContain(t.siteBName);
    expect(d.rates.formula).toEqual({ ltifr: 'LTIFR = lost time injuries x 1,000,000 / hours worked', trifr: 'TRIFR = recordable injuries x 1,000,000 / hours worked' });
    expect(d.rates.counting).toMatch(/not a regulator's definition; medical details are never used/);
    expect(d.sites.find((s: any) => s.id === t.siteA).rates).toMatchObject({ available: false, ltifr: null });

    // hours for site A in every month, site B in two of three: site A has rates, the company and site B do not
    await t.manager.json('PUT', w(t.co, '/hours'), { entries: [m3, m2, m1].map((m) => ({ siteId: t.siteA, month: m, hours: 10_000 })).concat([m3, m2].map((m) => ({ siteId: t.siteB, month: m, hours: 5_000 }))) });
    d = await dash(period);
    expect(d.rates.available).toBe(false);
    expect(d.rates.missing).toEqual([{ month: m1, siteId: t.siteB, siteName: t.siteBName, reason: 'missing' }]);
    expect(d.rates.note).toBe(`Cannot be calculated: hours worked missing for ${t.siteBName} (${monthLabel(m1)}). A WHS manager enters hours in WHS settings.`);
    expect(d.sites.find((s: any) => s.id === t.siteA).rates).toMatchObject({ available: true, hours: 30_000, ltifr: 33.33, trifr: 33.33 });
    expect(d.sites.find((s: any) => s.id === t.siteB).rates.available).toBe(false);

    // with every site's hours: company-wide figures count the incident with no site too
    await t.manager.json('PUT', w(t.co, '/hours'), { entries: [{ siteId: t.siteB, month: m1, hours: 0 }] });
    d = await dash(period);
    expect(d.rates).toMatchObject({ available: true, hours: 40_000, lti: 1, recordable: 3, ltifr: 25, trifr: 75 });
    expect(d.rates.note).toMatch(/^Per million hours worked, over the whole months/);
    expect(d.sites.find((s: any) => s.id === t.siteB).rates).toMatchObject({ available: true, hours: 10_000, ltifr: 0, trifr: 100 });
    // the site filter gives that site's figures
    expect((await dash(`${period}&site=${t.siteA}`)).rates).toMatchObject({ available: true, hours: 30_000, lti: 1, recordable: 1 });
    // a period that starts mid-month covers its whole months only
    expect((await dash(`from=${m2}-15&to=${lastDay(m1)}`)).rates).toMatchObject({ available: true, period: { from: m1, to: m1, months: 1 }, hours: 10_000, lti: 0, recordable: 1, trifr: 100 });
    // no whole month, or a department or incident type: no figure, and why
    expect((await dash(`from=${m1}-05&to=${m1}-20`)).rates).toMatchObject({ available: false, note: expect.stringMatching(/whole calendar months/) });
    expect((await dash(`${period}&kind=injury`)).rates).toMatchObject({ available: false, note: expect.stringMatching(/hours worked are entered by site/) });
    // a month with a whole-company figure beside site figures (kept from before this release): not counted twice
    await env.DB.prepare('INSERT INTO whs_hours (company_id, site_id, month, hours, entered_by, entered_at) VALUES (?, ?, ?, ?, ?, ?)').bind(t.co, '', m3, 99, t.manager.userId, Date.now()).run();
    d = await dash(period);
    expect(d.rates).toMatchObject({ available: false, missing: [{ month: m3, siteId: null, reason: 'both' }] });
    expect(d.rates.note).toMatch(/hours for the whole company and by site; keep one, so no hours are counted twice/);
    await env.DB.prepare("DELETE FROM whs_hours WHERE company_id = ? AND site_id = '' AND month = ?").bind(t.co, m3).run();
    // a supervisor's figures count the incidents they can see, and the screen says so; a WHS manager's need no note
    expect((await dash(period, t.officer)).rates.scope).toMatch(/Counts the incidents you can see/);
    expect((await dash(period)).rates.scope).toBeNull();
  });

  it('says when hours add up to zero, and needs a whole-company figure where there are no sites', async () => {
    const s = await signup('Hours solo');
    const own = (await s.json('GET', '/api/maintenance/companies')).companies.find((c: any) => c.kind === 'own');
    const m = mo(1);
    const q = `/dashboard?from=${m}-01&to=${lastDay(m)}`;
    expect((await s.json('GET', w(own.id, q))).rates.missing).toEqual([{ month: m, siteId: null, siteName: null, reason: 'missing' }]);
    expect((await s.json('GET', w(own.id, q))).rates.note).toContain(`the whole company (${monthLabel(m)})`);
    await s.json('PUT', w(own.id, '/hours'), { entries: [{ siteId: null, month: m, hours: 0 }] });
    expect((await s.json('GET', w(own.id, q))).rates).toMatchObject({ available: false, note: 'Cannot be calculated: the hours worked entered for this period add up to zero.' });
    await s.json('PUT', w(own.id, '/hours'), { entries: [{ siteId: null, month: m, hours: 2000 }], reason: 'Forgot the part-time staff' });
    expect((await s.json('GET', w(own.id, q))).rates).toMatchObject({ available: true, hours: 2000, ltifr: 0, trifr: 0 });
  });
});

describe('medical details in BIZOMAT WHS', () => {
  it('reach nobody but health officers: not in incidents, lists, exports, search, the dashboard, settings, alerts or history', async () => {
    const t = await team('Medical');
    const secret = `Sutured by Dr Example ${Math.random().toString(36).slice(2, 8)}`;
    const provider = `Example Clinic ${Math.random().toString(36).slice(2, 8)}`;
    const inc = await t.worker.json('POST', w(t.co, '/incidents'), { kind: 'injury', title: 'Cut on a sheet edge', occurredDate: mo(0) + '-01', siteId: t.siteA, outcome: 'medical_treatment', health: { personName: 'Injured worker (test)', treatment: secret, provider, restrictions: `No lifting ${secret}`, notes: secret, daysLost: 3 } });
    await t.health.json('PUT', w(t.co, `/incidents/${inc.id}/health`), { notes: `${secret} follow-up` });
    for (const who of [t.manager, t.officer, t.investigator, t.hsr, t.exec, t.owner, t.worker]) {
      const seen: string[] = [];
      for (const path of [`/incidents/${inc.id}`, '/incidents', '/incidents?format=csv', `/incidents?q=${encodeURIComponent(secret.split(' ').pop()!)}`, '/me', '/settings', '/alerts', '/summary']) {
        const res = await who.req('GET', w(t.co, path));
        if (res.ok) seen.push(await res.text());
      }
      if (who !== t.worker) seen.push(await (await who.req('GET', w(t.co, '/dashboard'))).text());
      seen.push(await (await who.req('GET', '/api/whs/my-work')).text());
      expect((await who.req('GET', w(t.co, `/incidents/${inc.id}/health`))).status, who.name).toBe(403);
      const all = seen.join('\n');
      expect(all, who.name).not.toContain(secret.split(' ').pop()!);
      expect(all, who.name).not.toContain(provider);
    }
    // the incident says only that health details exist, and who reads them
    expect(await t.manager.json('GET', w(t.co, `/incidents/${inc.id}`))).toMatchObject({ healthRecorded: true });
    // the health officer reads them; the history names fields, never values
    const h = await t.health.json('GET', w(t.co, `/incidents/${inc.id}/health`));
    expect(h.health).toMatchObject({ treatment: secret, provider, daysLost: 3 });
    expect(JSON.stringify(h.history)).not.toContain(secret);
    // owners and administrators cannot be given the health officer role: medical access is granted to a member only
    expect((await t.owner.req('PUT', `/api/erp/c/${t.co}/roles/${t.owner.userId}`, { roles: ['health_officer'] })).status).toBe(400);
  });
});
