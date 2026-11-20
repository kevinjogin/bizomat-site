// Postings to Finance's ledger from the modules framework (src/worker/erp/objects/postings.ts): the accounts suggested
// from the chart and chosen by an ERP administrator or finance controller; a fixed asset's depreciation posted month by
// month, once however often or concurrently it is asked, locked months together on the first open day, refused to a
// Finance role that cannot post journals, guarded against changes that would contradict the ledger, reversed and posted
// again; a pay run's one balanced journal; a revenue schedule's earned months and its deferral, once.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { monthEnd } from '../src/worker/erp/objects/hooks';

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
  return data as { company: { id: string }; tools: { tasks: string; crm: string; finance: string } };
}

async function joinCompany(owner: Client, companyId: string, invitee: Client, finRole: string | null = null) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole: null, finRole });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const obj = (co: string, object: string, path = '') => erp(co, `/x/o/${object}${path}`);
const create = (c: Client, co: string, object: string, data: Record<string, unknown>, lines?: unknown[]) => c.json('POST', obj(co, object), { data, ...(lines ? { lines } : {}) });
const step = (c: Client, co: string, object: string, id: string, s: string, note?: string) => c.json('POST', obj(co, object, `/${id}/step/${s}`), { note });
const action = (c: Client, co: string, object: string, id: string, a: string, input?: Record<string, unknown>) => c.json('POST', obj(co, object, `/${id}/action/${a}`), { input });
const actionRes = (c: Client, co: string, object: string, id: string, a: string, input?: Record<string, unknown>) => c.req('POST', obj(co, object, `/${id}/action/${a}`), { input });

/** The month k months before this one (YYYY-MM, UTC). */
function ym(k: number) {
  const d = new Date();
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - k, 1));
  return t.toISOString().slice(0, 7);
}

async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company, tools } = await registerCompany(owner, `${label} Holdings`);
  const co = company.id;
  // a finance controller who is an accountant in Finance (posts journals), one who is a finance manager there (cannot),
  // the HR manager and payroll officer (no Finance role), and someone with no ERP role
  const people: Record<string, Client> = {};
  for (const [key, role, finRole] of [
    ['accountant', 'finance_controller', 'accountant'],
    ['controller', 'finance_controller', 'finance_manager'],
    ['hr', 'hr_manager', null],
    ['payroll', 'payroll_officer', null],
    ['staff', null, null],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p, finRole);
    if (role) await owner.json('PUT', erp(co, `/roles/${p.userId}`), { roles: [role] });
    people[key] = p;
  }
  return { owner, co, fin: tools.finance, ...people } as { owner: Client; co: string; fin: string; accountant: Client; controller: Client; hr: Client; payroll: Client; staff: Client };
}

async function accountId(org: string, code: string) {
  return (await env.DB.prepare('SELECT id FROM fin_accounts WHERE org_id = ? AND code = ?').bind(org, code).first<{ id: string }>())!.id;
}

/** Each posted journal balances; the balance (debit less credit) of an account over the posted journals. */
async function balance(org: string, code: string) {
  const r = await env.DB.prepare("SELECT COALESCE(SUM(l.debit - l.credit), 0) AS b FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id JOIN fin_accounts a ON a.id = l.account_id WHERE j.org_id = ? AND j.status = 'posted' AND a.code = ?").bind(org, code).first<{ b: number }>();
  return r!.b;
}

async function unbalanced(org: string) {
  const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM (SELECT j.id FROM fin_journals j JOIN fin_journal_lines l ON l.journal_id = j.id WHERE j.org_id = ? AND j.status = 'posted' GROUP BY j.id HAVING SUM(l.debit) <> SUM(l.credit))").bind(org).first<{ n: number }>();
  return r!.n;
}

const journalsOf = async (org: string, sourceId: string) => (await env.DB.prepare("SELECT id, date, memo, source_type, reverses_id, reversed_by_id FROM fin_journals WHERE org_id = ? AND source_id = ? AND status = 'posted' ORDER BY number").bind(org, sourceId).all<any>()).results;

describe('postings to Finance’s ledger', () => {
  it('suggests accounts from the chart, saves them only for the right people and types, and needs them before posting', async () => {
    const t = await team('Lu');
    const { co, fin, accountant, controller, hr, staff, owner } = t;
    const s = await accountant.json('GET', erp(co, '/x/postings'));
    expect(s.workspace.id).toBe(fin);
    expect(s.canEdit).toBe(true);
    expect(s.canPost).toBe(true);
    const sug = Object.fromEntries(s.roles.map((r: any) => [r.role, r.suggested?.code ?? null]));
    expect(sug).toMatchObject({ dep_expense: '416', dep_accumulated: '790', wages_expense: '477', contribution_expense: '478', withholding_payable: '825', contribution_payable: '826', net_pay: '090', rev_deferred: null, rev_earned: '200' });
    expect(s.roles.every((r: any) => r.account === null)).toBe(true);
    // the finance manager reads but cannot post; the HR manager has no Finance access; staff have no record that posts
    expect((await controller.json('GET', erp(co, '/x/postings'))).canPost).toBe(false);
    expect((await hr.req('GET', erp(co, '/x/postings'))).status).toBe(403);
    expect((await staff.req('GET', erp(co, '/x/postings'))).status).toBe(403);
    expect((await hr.req('PUT', erp(co, '/x/postings'), { accounts: { dep_expense: await accountId(fin, '416') } })).status).toBe(403);
    // types are checked: a bank account is not a depreciation expense; unknown roles and other workspaces' accounts refused
    expect((await accountant.req('PUT', erp(co, '/x/postings'), { accounts: { dep_expense: await accountId(fin, '090') } })).status).toBe(400);
    expect((await accountant.req('PUT', erp(co, '/x/postings'), { accounts: { nonsense: await accountId(fin, '416') } })).status).toBe(400);
    const other = await team('Lv');
    expect((await accountant.req('PUT', erp(co, '/x/postings'), { accounts: { dep_expense: await accountId(other.fin, '416') } })).status).toBe(400);

    // a fixed asset in service cannot post until the accounts are saved
    const asset = await create(controller, co, 'fa_asset', { name: 'Laser cutter', category: 'plant', acquisitionDate: `${ym(3)}-10`, cost: 2_400_000, usefulLifeMonths: 24, method: 'straight_line', currency: 'AUD' });
    await step(owner, co, 'fa_asset', asset.record.id, 'place');
    const early = await actionRes(accountant, co, 'fa_asset', asset.record.id, 'post', { upTo: monthEnd(ym(1)) });
    expect(early.status).toBe(409);
    expect(((await early.json()) as any).error).toContain('Choose the Finance posting accounts first');
    const saved = await accountant.json('PUT', erp(co, '/x/postings'), { accounts: { dep_expense: await accountId(fin, '416'), dep_accumulated: await accountId(fin, '790') } });
    expect(saved.roles.find((r: any) => r.role === 'dep_expense').account.code).toBe('416');
    const hist = await env.DB.prepare("SELECT summary FROM erp_events WHERE company_id = ? AND action = 'postings.accounts'").bind(co).first<any>();
    expect(hist.summary).toContain('416 Depreciation');
    // another company never sees this company's choices
    expect((await other.accountant.json('GET', erp(other.co, '/x/postings'))).roles.every((r: any) => r.account === null)).toBe(true);
  });

  it('posts depreciation month by month, once, with locked months on the first open day; guards, reverses and posts again', async () => {
    const t = await team('Mo');
    const { co, fin, accountant, controller, owner } = t;
    await accountant.json('PUT', erp(co, '/x/postings'), { accounts: { dep_expense: await accountId(fin, '416'), dep_accumulated: await accountId(fin, '790') } });
    // 24,000.00 over 24 months from ten months ago: 1,000.00 a month
    const asset = await create(controller, co, 'fa_asset', { name: 'CNC router', category: 'plant', acquisitionDate: `${ym(10)}-05`, cost: 2_400_000, usefulLifeMonths: 24, method: 'straight_line', currency: 'AUD' });
    const id = asset.record.id;
    // only an asset in service posts
    expect((await actionRes(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(1)) })).status).toBe(409);
    await step(owner, co, 'fa_asset', id, 'place');
    // the finance manager cannot post journals in Finance; the payroll officer cannot see fixed assets; the future is refused
    expect((await actionRes(controller, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(5)) })).status).toBe(403);
    expect((await actionRes(t.payroll, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(5)) })).status).toBe(404);
    expect((await actionRes(accountant, co, 'fa_asset', id, 'post', { upTo: '2999-01-31' })).status).toBe(409);

    const first = await action(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(5)) });
    expect(first.message).toContain('6 journals posted');
    expect(first.result).toHaveLength(6);
    expect(first.result[0]).toMatchObject({ date: monthEnd(ym(10)), amount: 100_000, covers: ym(10) });
    expect(await balance(fin, '416')).toBe(600_000);
    expect(await balance(fin, '790')).toBe(-600_000);
    expect(await unbalanced(fin)).toBe(0);
    // asked again: nothing; asked twice at the same moment for the next month: one journal
    expect((await action(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(5)) })).message).toContain('Nothing to post');
    await Promise.all([
      actionRes(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(4)) }),
      actionRes(owner, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(4)) }),
    ]);
    expect(await balance(fin, '416')).toBe(700_000);
    expect(await journalsOf(fin, id)).toHaveLength(7);

    // the books are locked to the end of two months ago: those months post together on the first open day
    await owner.json('PUT', `/api/fin/orgs/${fin}/lock`, { lockDate: monthEnd(ym(2)) });
    const locked = await action(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(1)) });
    expect(locked.result).toHaveLength(2);
    const catchUp = locked.result.find((r: any) => r.covers.includes(','));
    expect(catchUp).toMatchObject({ amount: 200_000, covers: `${ym(3)}, ${ym(2)}` });
    expect(catchUp.date > monthEnd(ym(2))).toBe(true);
    expect(await balance(fin, '416')).toBe(1_000_000);
    const js = await journalsOf(fin, id);
    expect(js).toHaveLength(9);
    expect(js.every((j: any) => j.source_type === 'manual' && j.memo.startsWith('BIZOMAT ERP: depreciation of Fixed asset'))).toBe(true);
    expect(js.find((j: any) => j.memo.includes('locked'))).toBeTruthy();

    // the record shows its journals; changes that would contradict the ledger are refused
    const detail = await accountant.json('GET', obj(co, 'fa_asset', `/${id}`));
    expect(detail.postings.journals).toHaveLength(9);
    expect(detail.postings.url).toBe(`/erp/finance/o/${fin}/accounting/journals`);
    expect(detail.record.data.accumulated).toBe(1_000_000);
    const change = await controller.req('PATCH', obj(co, 'fa_asset', `/${id}`), { data: { cost: 3_000_000 }, version: detail.record.version });
    expect(change.status).toBe(409);
    expect(((await change.json()) as any).error).toContain('reverse the Finance postings');
    expect((await controller.json('PATCH', obj(co, 'fa_asset', `/${id}`), { data: { assetTag: 'CNC-1' }, version: detail.record.version })).record.data.assetTag).toBe('CNC-1');
    const now2 = await controller.json('GET', obj(co, 'fa_asset', `/${id}`));
    await env.DB.prepare("UPDATE erp_objects SET data_json = json_set(data_json, '$.disposalDate', ?) WHERE company_id = ? AND id = ?").bind(`${ym(1)}-15`, co, id).run();
    expect((await controller.req('POST', obj(co, 'fa_asset', `/${id}/step/dispose`), {})).status).toBe(409);

    // reversed: the locked originals are reversed today, the open one on its own date; the ledger nets to nothing
    expect((await actionRes(accountant, co, 'fa_asset', id, 'unpost', {})).status).toBe(400);
    const rev = await action(accountant, co, 'fa_asset', id, 'unpost', { reason: 'Wrong useful life' });
    expect(rev.message).toContain('9 journals reversed');
    expect(await balance(fin, '416')).toBe(0);
    expect(await unbalanced(fin)).toBe(0);
    const after = await accountant.json('GET', obj(co, 'fa_asset', `/${id}`));
    expect(after.postings.journals.every((j: any) => j.reversed)).toBe(true);
    // now the change is allowed, and the depreciation posts again on the new figures
    await env.DB.prepare("UPDATE erp_objects SET data_json = json_remove(data_json, '$.disposalDate') WHERE company_id = ? AND id = ?").bind(co, id).run();
    const fresh = await controller.json('GET', obj(co, 'fa_asset', `/${id}`));
    await controller.json('PATCH', obj(co, 'fa_asset', `/${id}`), { data: { usefulLifeMonths: 12, cost: 1_200_000 }, version: fresh.record.version });
    const again = await action(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(1)) });
    // ten months: the nine up to the lock date in one journal, the last on its own date
    expect(again.result).toHaveLength(2);
    expect(await balance(fin, '416')).toBe(1_000_000);
    void now2;

    // a journal reversed in Finance itself frees its month, which then posts again once
    await owner.json('PUT', `/api/fin/orgs/${fin}/lock`, { lockDate: null });
    const open = (await journalsOf(fin, id)).filter((j: any) => !j.reversed_by_id && !j.reverses_id && j.date === monthEnd(ym(1)));
    expect(open).toHaveLength(1);
    await owner.json('POST', `/api/fin/orgs/${fin}/journals/${open[0].id}/reverse`, { memo: 'Reversed by hand' });
    expect(await balance(fin, '416')).toBe(900_000);
    const repost = await action(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(1)) });
    expect(repost.result).toHaveLength(1);
    expect(await balance(fin, '416')).toBe(1_000_000);
    expect((await action(accountant, co, 'fa_asset', id, 'post', { upTo: monthEnd(ym(1)) })).message).toContain('Nothing to post');

    // another company's people cannot reach the asset or its postings
    const other = await team('Mp');
    expect((await other.accountant.req('POST', obj(co, 'fa_asset', `/${id}/action/post`), { input: { upTo: monthEnd(ym(1)) } })).status).toBe(404);
  });

  it('posts an approved pay run as one balanced journal, once; refuses reopening it until reversed', async () => {
    const t = await team('Ny');
    const { co, fin, accountant, hr, payroll, owner } = t;
    const emp = await create(hr, co, 'hr_employee', { firstName: 'Ana', lastName: 'Lopez', employmentType: 'full_time', startDate: `${ym(6)}-01`, payBasis: 'salary', annualSalary: 7_800_000, withholdingPct: 20 });
    await step(hr, co, 'hr_employee', emp.record.id, 'activate');
    const run = await create(payroll, co, 'py_run', { periodStart: `${ym(1)}-01`, periodEnd: monthEnd(ym(1)), payDate: monthEnd(ym(1)), frequency: 'monthly', contributionPct: 12, currency: 'AUD' });
    const calc = await action(payroll, co, 'py_run', run.record.id, 'calculate');
    expect(calc.detail.lines[0]).toMatchObject({ gross: 650_000, withheld: 130_000, contribution: 78_000, net: 520_000 });
    // not before approval; approved by the HR manager (someone else)
    expect((await actionRes(hr, co, 'py_run', run.record.id, 'post')).status).toBe(409);
    await step(hr, co, 'py_run', run.record.id, 'approve');
    // the HR manager may post on the ERP side but has no Finance role; the payroll officer has no approve role
    expect((await actionRes(hr, co, 'py_run', run.record.id, 'post')).status).toBe(403);
    expect((await actionRes(payroll, co, 'py_run', run.record.id, 'post')).status).toBe(403);
    // the owner (a Finance owner, and ERP administrator) posts once the payroll accounts are chosen
    const s = await owner.json('GET', erp(co, '/x/postings'));
    const pay = Object.fromEntries(s.roles.filter((r: any) => r.kind === 'payroll' && r.suggested).map((r: any) => [r.role, r.suggested.id]));
    await owner.json('PUT', erp(co, '/x/postings'), { accounts: pay });
    const posted = await action(owner, co, 'py_run', run.record.id, 'post');
    expect(posted.message).toContain('One journal posted');
    expect(await balance(fin, '477')).toBe(650_000);
    expect(await balance(fin, '478')).toBe(78_000);
    expect(await balance(fin, '825')).toBe(-130_000);
    expect(await balance(fin, '826')).toBe(-78_000);
    expect(await balance(fin, '090')).toBe(-520_000);
    expect(await unbalanced(fin)).toBe(0);
    expect((await actionRes(owner, co, 'py_run', run.record.id, 'post')).status).toBe(409);
    expect((await journalsOf(fin, run.record.id))[0].date).toBe(monthEnd(ym(1)));
    // a posted pay run is not taken back to worked out; after reversing it is
    expect((await hr.req('POST', obj(co, 'py_run', `/${run.record.id}/step/reopen`), {})).status).toBe(409);
    await action(owner, co, 'py_run', run.record.id, 'unpost', { reason: 'Wrong rate' });
    expect(await balance(fin, '477')).toBe(0);
    await step(hr, co, 'py_run', run.record.id, 'reopen');
    // the payroll officer, who may not read Finance, never sees an account id through the run's detail
    const seen = await payroll.json('GET', obj(co, 'py_run', `/${run.record.id}`));
    expect(seen.postings.journals).toHaveLength(1);
    expect(JSON.stringify(seen.postings)).not.toContain(pay.wages_expense);
    void accountant;
  });

  it('posts a revenue schedule’s earned months and its deferral once, in bulk too', async () => {
    const t = await team('Qi');
    const { co, fin, accountant, controller, owner } = t;
    const deferred = await owner.json('POST', `/api/fin/orgs/${fin}/accounts`, { code: '835', name: 'Income in advance', subtype: 'current_liability' });
    const s = await accountant.json('GET', erp(co, '/x/postings'));
    expect(s.roles.find((r: any) => r.role === 'rev_deferred').suggested.id).toBe(deferred.id ?? deferred.account?.id);
    await accountant.json('PUT', erp(co, '/x/postings'), { accounts: { rev_deferred: s.roles.find((r: any) => r.role === 'rev_deferred').suggested.id, rev_earned: await accountId(fin, '200') } });
    // 12,000.00 earned evenly over twelve months from four months ago
    const sch = await create(controller, co, 'rr_schedule', { name: 'Annual support', total: 1_200_000, startDate: `${ym(4)}-01`, endDate: monthEnd(ym(-7)), currency: 'AUD' });
    await step(owner, co, 'rr_schedule', sch.record.id, 'activate');
    // the invoice went to Sales: move it once to deferred revenue
    await action(accountant, co, 'rr_schedule', sch.record.id, 'defer');
    expect(await balance(fin, '200')).toBe(1_200_000);
    expect(await balance(fin, '835')).toBe(-1_200_000);
    expect((await actionRes(accountant, co, 'rr_schedule', sch.record.id, 'defer')).status).toBe(409);
    // bulk: every schedule's earned months up to the end of last month (four months)
    const bulk = await accountant.json('POST', erp(co, '/x/postings/run'), { kind: 'revenue', upTo: monthEnd(ym(1)) });
    expect(bulk).toMatchObject({ checked: 1, records: 1, journals: 4, problems: [] });
    expect(await balance(fin, '835')).toBe(-800_000);
    expect(await balance(fin, '200')).toBe(800_000);
    expect((await accountant.json('POST', erp(co, '/x/postings/run'), { kind: 'revenue', upTo: monthEnd(ym(1)) })).journals).toBe(0);
    expect(await unbalanced(fin)).toBe(0);
    // cancelling with journals is refused until they are reversed
    expect((await owner.req('POST', obj(co, 'rr_schedule', `/${sch.record.id}/step/cancel`), { note: 'Lost the customer' })).status).toBe(409);
    // the bulk run needs the edit role and a Finance role that posts
    expect((await controller.req('POST', erp(co, '/x/postings/run'), { kind: 'revenue', upTo: monthEnd(ym(1)) })).status).toBe(403);
    expect((await t.hr.req('POST', erp(co, '/x/postings/run'), { kind: 'depreciation', upTo: monthEnd(ym(1)) })).status).toBe(403);
  });

  it('allocates an overhead across departments by percentage as one journal, once, and again after reversing', async () => {
    const t = await team('Ra');
    const { co, fin, accountant, controller, owner } = t;
    const workshop = await owner.json('POST', `/api/company/c/${co}/departments`, { name: 'Workshop' });
    const office = await owner.json('POST', `/api/company/c/${co}/departments`, { name: 'Office' });
    const rent = await accountId(fin, '469');
    const bank = await accountId(fin, '090');
    // 1,000.00 of rent with no department, and 200.00 already booked to the office (not reallocated)
    const tracking = await env.DB.prepare('SELECT fin_tracking_id FROM co_departments WHERE company_id = ? AND id = ?').bind(co, office.id ?? office.department?.id).first<any>();
    await owner.json('POST', `/api/fin/orgs/${fin}/journals`, { date: `${ym(1)}-05`, memo: 'Rent', lines: [{ accountId: rent, debit: 100_000 }, { accountId: bank, credit: 100_000 }] });
    await owner.json('POST', `/api/fin/orgs/${fin}/journals`, { date: `${ym(1)}-06`, memo: 'Office rent', lines: [{ accountId: rent, debit: 20_000, departmentId: tracking.fin_tracking_id }, { accountId: bank, credit: 20_000 }] });
    const wid = workshop.id ?? workshop.department?.id;
    const oid = office.id ?? office.department?.id;
    const alloc = await controller.json('POST', obj(co, 'ca_allocation'), { data: { name: 'Rent by floor area', sourceAccount: '469', periodFrom: `${ym(1)}-01`, periodTo: monthEnd(ym(1)) }, lines: [{ department: wid, percent: 70 }, { department: oid, percent: 20 }] });
    expect(alloc.record.data.totalPct).toBe(90);
    // shares must add up to 100% before approval; the maker does not approve
    expect((await owner.req('POST', obj(co, 'ca_allocation', `/${alloc.record.id}/step/approve`), {})).status).toBe(409);
    await controller.json('PATCH', obj(co, 'ca_allocation', `/${alloc.record.id}`), { data: {}, lines: [{ department: wid, percent: 70 }, { department: oid, percent: 30 }], version: alloc.record.version });
    expect((await controller.req('POST', obj(co, 'ca_allocation', `/${alloc.record.id}/step/approve`), {})).status).toBe(403);
    await step(owner, co, 'ca_allocation', alloc.record.id, 'approve');
    // the finance manager cannot post journals; the accountant posts it
    expect((await actionRes(controller, co, 'ca_allocation', alloc.record.id, 'post')).status).toBe(403);
    const posted = await action(accountant, co, 'ca_allocation', alloc.record.id, 'post');
    expect(posted.detail.record.status).toBe('posted');
    const byDept = async () => (await env.DB.prepare("SELECT l.department_id AS d, SUM(l.debit - l.credit) AS b FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id WHERE j.org_id = ? AND j.status = 'posted' AND l.account_id = ? GROUP BY l.department_id").bind(fin, rent).all<any>()).results;
    const tWork = (await env.DB.prepare('SELECT fin_tracking_id FROM co_departments WHERE company_id = ? AND id = ?').bind(co, wid).first<any>()).fin_tracking_id;
    const sums = Object.fromEntries((await byDept()).map((r: any) => [r.d ?? 'none', r.b]));
    // 1,000.00 moved: 700.00 to the workshop, 300.00 to the office (which also keeps its own 200.00)
    expect(sums).toEqual({ none: 0, [tWork]: 70_000, [tracking.fin_tracking_id]: 50_000 });
    expect(await unbalanced(fin)).toBe(0);
    expect((await actionRes(accountant, co, 'ca_allocation', alloc.record.id, 'post')).status).toBe(409);
    // reversed: the rent is back without a department, and the allocation can be posted again
    const rev = await action(accountant, co, 'ca_allocation', alloc.record.id, 'unpost', { reason: 'Wrong shares' });
    expect(rev.detail.record.status).toBe('approved');
    expect(Object.fromEntries((await byDept()).map((r: any) => [r.d ?? 'none', r.b])).none).toBe(100_000);
    await action(accountant, co, 'ca_allocation', alloc.record.id, 'post');
    expect(Object.fromEntries((await byDept()).map((r: any) => [r.d ?? 'none', r.b])).none).toBe(0);
  });
});
