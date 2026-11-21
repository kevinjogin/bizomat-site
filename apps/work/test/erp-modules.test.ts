// BIZOMAT ERP modules framework (owner's brief "97-module enterprise expansion", 20 Nov 2026; src/shared/erp-objects,
// src/worker/erp/objects). The definitions and the 97-module catalogue are checked whole; then the owner's workflow 7
// runs end to end (Employee, Recruitment, Onboarding, Training, Performance, Payroll) with leave, timesheets and
// self service; then each rule: sensitive pay fields, segregation of duties, isolation between companies, roles,
// calibration moving its instrument, reminders and workflow escalations made once, draft invoices in Finance made once,
// and every one of the framework's kinds of record created, listed, reported and exported.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { registryProblems, OBJECTS, OBJECT_BY_KEY, MODULE_DEFS, NEW_ROLES, EXISTING_ROLE_LABELS, type FieldDef, type ObjectDef } from '../src/shared/erp-objects';
import { CATALOGUE, catalogueProblems } from '../src/shared/erp-catalogue';
import { ERP_ROLES, ROLE_LABELS } from '../src/worker/erp/access';
import { runObjectReminders } from '../src/worker/erp/objects/alerts';
import { MODULES } from '../src/worker/platform/flags';
import { FRAMEWORK_SWITCHES } from '../src/shared/erp-objects';
import { workingDays, depreciationSchedule, addMonths } from '../src/worker/erp/objects/hooks';

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

async function joinCompany(owner: Client, companyId: string, invitee: Client, crmRole: string | null = null, finRole: string | null = null) {
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: invitee.email, role: 'member', tasksRole: 'member', crmRole, finRole });
  const token = decodeURIComponent(inv.url.split('/join/')[1]);
  await invitee.json('POST', `/api/company/invitations/${token}/accept`, {});
}

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const obj = (co: string, object: string, path = '') => erp(co, `/x/o/${object}${path}`);
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
/** The Monday of this week (UTC). */
function monday(offsetWeeks = 0) {
  const d = new Date();
  const w = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - w + offsetWeeks * 7);
  return d.toISOString().slice(0, 10);
}

type Who = 'hr' | 'officer' | 'payroll' | 'manager' | 'staff' | 'viewer' | 'quality' | 'controller' | 'sales';

async function team(label: string) {
  const owner = await signup(`${label} Owner`);
  const { company, tools } = await registerCompany(owner, `${label} Group`);
  const co = company.id;
  const people = {} as Record<Who, Client>;
  for (const [key, role, crmRole, finRole] of [
    ['hr', 'hr_manager', null, null],
    ['officer', 'hr_officer', null, null],
    ['payroll', 'payroll_officer', null, null],
    ['manager', 'project_manager', null, null],
    ['staff', null, null, null],
    ['viewer', null, null, null],
    ['quality', 'quality_manager', null, null],
    ['controller', 'finance_controller', 'manager', 'finance_manager'],
    ['sales', 'sales_manager', 'manager', 'finance_manager'],
  ] as const) {
    const p = await signup(`${label} ${key}`);
    await joinCompany(owner, co, p, crmRole, finRole);
    if (role) await owner.json('PUT', erp(co, `/roles/${p.userId}`), { roles: [role] });
    people[key] = p;
  }
  return { owner, co, tools, ...people };
}

const create = (c: Client, co: string, object: string, data: Record<string, unknown>, lines?: unknown[]) => c.json('POST', obj(co, object), { data, ...(lines ? { lines } : {}) });
const step = (c: Client, co: string, object: string, id: string, s: string, note?: string) => c.json('POST', obj(co, object, `/${id}/step/${s}`), { note });
const action = (c: Client, co: string, object: string, id: string, a: string, input?: Record<string, unknown>) => c.json('POST', obj(co, object, `/${id}/action/${a}`), { input });

describe('the definitions and the catalogue', () => {
  it('has sound definitions, 97 catalogue entries and roles in step with the ERP', () => {
    expect(registryProblems()).toEqual([]);
    expect(catalogueProblems(new Set(MODULE_DEFS.map((m) => m.key)))).toEqual([]);
    expect(CATALOGUE).toHaveLength(97);
    expect(CATALOGUE.map((e) => e.n)).toEqual(Array.from({ length: 97 }, (_, i) => i + 1));
    // every catalogue number a framework module claims is marked new or improved there, and names that module
    for (const m of MODULE_DEFS) for (const n of m.catalogue) expect(['new', 'improved', 'planned']).toContain(CATALOGUE[n - 1].status);
    for (const r of NEW_ROLES) expect(ERP_ROLES).toContain(r);
    expect(Object.keys(EXISTING_ROLE_LABELS).sort()).toEqual(ERP_ROLES.filter((r) => !(NEW_ROLES as readonly string[]).includes(r)).sort());
    for (const [k, v] of Object.entries(EXISTING_ROLE_LABELS)) expect(ROLE_LABELS[k as keyof typeof ROLE_LABELS]).toBe(v);
    // every module switch the framework uses is a module of the Control Centre
    for (const k of Object.keys(FRAMEWORK_SWITCHES)) expect(Object.keys(MODULES)).toContain(k);
    expect(OBJECTS.length).toBeGreaterThanOrEqual(50);
  });

  it('works out dates, working days and depreciation exactly', () => {
    expect(workingDays('2026-11-16', '2026-11-20')).toBe(5);
    expect(workingDays('2026-11-21', '2026-11-22')).toBe(0);
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    // straight line: 12,000.00 over 12 months to a residual of 0 is 1,000.00 a month
    const s = depreciationSchedule({ cost: 1_200_000, residualValue: 0, usefulLifeMonths: 12, method: 'straight_line', acquisitionDate: '2026-01-15' });
    expect(s).toHaveLength(12);
    expect(s.every((r) => r.depreciation === 100_000)).toBe(true);
    expect(s[11].bookValue).toBe(0);
    // diminishing value never goes below the residual and ends at it
    const dv = depreciationSchedule({ cost: 1_000_000, residualValue: 100_000, usefulLifeMonths: 36, method: 'diminishing_value', acquisitionDate: '2026-01-01' });
    expect(dv.at(-1)!.bookValue).toBe(100_000);
    expect(dv.every((r) => r.bookValue >= 100_000)).toBe(true);
  });
});

describe('workflow 7: employee, recruitment, onboarding, training, performance and payroll', () => {
  it('hires an applicant into an employee with onboarding, takes leave, trains, reviews and pays them', async () => {
    const t = await team('Kappa');
    const { owner, co, hr, officer, payroll, manager, staff, viewer } = t;

    // the catalogue opens for everyone in the company
    const cat = await viewer.json('GET', erp(co, '/catalogue'));
    expect(cat.modules).toHaveLength(97);
    expect(cat.counts.total).toBe(97);
    expect(cat.modules.find((m: any) => m.n === 85).path).toBe(`/c/${co}/m/hr`);

    // set-up: a leave type of 20 days and an onboarding template
    const annual = await create(hr, co, 'hr_leave_type', { name: 'Annual leave', paid: true, annualDays: 20 });
    const tmpl = await create(hr, co, 'ob_template', { name: 'Standard start', kind: 'onboarding' }, [
      { task: 'Contract signed', owner: 'hr', dayOffset: -5 },
      { task: 'Laptop ready', owner: 'manager', dayOffset: 0 },
    ]);
    expect(tmpl.lines).toHaveLength(2);

    // a job opening: an HR officer drafts it, only the HR manager approves it
    const job = await create(officer, co, 'rc_job', { title: 'Site engineer', employmentType: 'full_time', openings: 1, salaryFrom: 9_000_000, salaryTo: 11_000_000 });
    expect(job.record.number).toMatch(/^JOB-\d{5}$/);
    await step(officer, co, 'rc_job', job.record.id, 'submit');
    const refused = await officer.req('POST', obj(co, 'rc_job', `/${job.record.id}/step/approve`), {});
    expect(refused.status).toBe(403);
    const opened = await step(hr, co, 'rc_job', job.record.id, 'approve');
    expect(opened.record.status).toBe('open');

    // an applicant through to an offer, then hired: the employee record and onboarding checklist are made
    const app = await create(officer, co, 'rc_applicant', { firstName: 'Riley', lastName: 'Stone', email: staff.email, job: job.record.id, consent: true, appliedDate: day(-10) });
    await step(officer, co, 'rc_applicant', app.record.id, 'interview');
    expect((await officer.req('POST', obj(co, 'rc_applicant', `/${app.record.id}/step/offer`), {})).status).toBe(403);
    await step(hr, co, 'rc_applicant', app.record.id, 'offer');
    const start = day(14);
    const hired = await action(officer, co, 'rc_applicant', app.record.id, 'hire', { startDate: start });
    expect(hired.detail.record.status).toBe('hired');
    const empId = hired.link.split('/').pop();
    const emp = await hr.json('GET', obj(co, 'hr_employee', `/${empId}`));
    expect(emp.record.status).toBe('onboarding');
    expect(emp.record.data.position).toBe('Site engineer');
    expect(emp.related.some((r: any) => r.object === 'ob_checklist')).toBe(true);
    const checklistId = emp.related.find((r: any) => r.object === 'ob_checklist').id;
    const list = await hr.json('GET', obj(co, 'ob_checklist', `/${checklistId}`));
    expect(list.lines.map((l: any) => l.task)).toEqual(['Contract signed', 'Laptop ready']);
    expect(list.lines[1].due).toBe(start);
    // completing needs every step done
    expect((await hr.req('POST', obj(co, 'ob_checklist', `/${checklistId}/step/complete`), {})).status).toBe(409);
    await hr.json('PATCH', obj(co, 'ob_checklist', `/${checklistId}`), { data: {}, lines: list.lines.map((l: any) => ({ ...l, done: true })), version: list.record.version });
    expect((await step(hr, co, 'ob_checklist', checklistId, 'complete')).record.status).toBe('completed');

    // HR links the employee to their account and manager and sets their pay; an HR officer never sees the pay
    const linked = await hr.json('PATCH', obj(co, 'hr_employee', `/${empId}`), { data: { user: staff.userId, manager: manager.userId, startDate: day(-60), payBasis: 'salary', annualSalary: 7_800_000, withholdingPct: 20, costRate: 6_000 }, version: emp.record.version });
    expect(linked.record.data.annualSalary).toBe(7_800_000);
    await step(hr, co, 'hr_employee', empId, 'activate');
    const asOfficer = await officer.json('GET', obj(co, 'hr_employee', `/${empId}`));
    expect(asOfficer.record.data.annualSalary).toBeUndefined();
    expect(asOfficer.record.hidden).toContain('annualSalary');
    // an officer's change cannot touch the pay either
    await officer.json('PATCH', obj(co, 'hr_employee', `/${empId}`), { data: { phone: '0400 000 000', annualSalary: 1 } });
    expect((await hr.json('GET', obj(co, 'hr_employee', `/${empId}`))).record.data.annualSalary).toBe(7_800_000);
    // the person sees their own record, pay included; someone else in the company sees nothing
    const mine = await staff.json('GET', obj(co, 'hr_employee', `/${empId}`));
    expect(mine.record.data.annualSalary).toBe(7_800_000);
    expect((await viewer.req('GET', obj(co, 'hr_employee', `/${empId}`))).status).toBe(404);
    expect((await viewer.json('GET', obj(co, 'hr_employee'))).total).toBe(0);
    // nor its name through a lookup by id
    expect((await viewer.json('GET', erp(co, `/x/lookup/${encodeURIComponent('obj:hr_employee')}?id=${empId}`))).options).toEqual([]);
    expect((await hr.json('GET', erp(co, `/x/lookup/${encodeURIComponent('obj:hr_employee')}?id=${empId}`))).options[0].label).toContain('Riley');
    // the history names the pay change without its value
    const history = (await hr.json('GET', obj(co, 'hr_employee', `/${empId}`))).history;
    expect(JSON.stringify(history)).not.toContain('7800000');

    // leave in self service: 3 working days, approved by the manager, never by the person
    const from = monday(2);
    const leave = await create(staff, co, 'hr_leave', { employee: empId, leaveType: annual.record.id, fromDate: from, toDate: new Date(Date.parse(`${from}T00:00:00Z`) + 2 * 86_400_000).toISOString().slice(0, 10), reason: 'Family' });
    expect(leave.record.data.days).toBe(3);
    expect(leave.record.approverId).toBe(manager.userId);
    await step(staff, co, 'hr_leave', leave.record.id, 'submit');
    expect((await staff.req('POST', obj(co, 'hr_leave', `/${leave.record.id}/step/approve`), {})).status).toBe(403);
    const managerAlerts = await manager.json('GET', erp(co, '/x/alerts'));
    expect(managerAlerts.alerts.some((x: any) => x.kind === 'approval' && x.title.includes(leave.record.number))).toBe(true);
    const inbox = await manager.json('GET', erp(co, '/x/inbox'));
    expect(inbox.waiting.some((x: any) => x.id === leave.record.id)).toBe(true);
    const approved = await step(manager, co, 'hr_leave', leave.record.id, 'approve');
    expect(approved.record.status).toBe('approved');
    expect((await staff.json('GET', erp(co, '/x/alerts'))).alerts.some((x: any) => x.title.includes(leave.record.number))).toBe(true);
    // the balance: 20 days less 3; a request for 18 more is refused
    const bal = await hr.json('GET', obj(co, 'hr_leave', '/report/balances'));
    const row = bal.report.rows.find((r: any) => r.leaveType === 'Annual leave');
    expect(row).toMatchObject({ allowed: 20, taken: 3, left: 17 });
    const big = await create(staff, co, 'hr_leave', { employee: empId, leaveType: annual.record.id, fromDate: monday(4), toDate: new Date(Date.parse(`${monday(4)}T00:00:00Z`) + 23 * 86_400_000).toISOString().slice(0, 10) });
    expect(big.record.data.days).toBe(18);
    const over = await staff.req('POST', obj(co, 'hr_leave', `/${big.record.id}/step/submit`), {});
    expect(over.status).toBe(409);
    expect(await over.text()).toContain('Only 17 days');
    // nobody makes leave for someone else in self service
    const otherEmp = await create(hr, co, 'hr_employee', { firstName: 'Other', lastName: 'Person', startDate: day(-100), employmentType: 'casual' });
    expect((await staff.req('POST', obj(co, 'hr_leave'), { data: { employee: otherEmp.record.id, leaveType: annual.record.id, fromDate: monday(6), toDate: monday(6) } })).status).toBe(403);

    // training: a course valid 12 months expires a year after completion
    const course = await create(hr, co, 'tr_course', { name: 'First aid', validityMonths: 12, mandatory: true });
    const tr = await create(officer, co, 'tr_record', { employee: empId, course: course.record.id, completedDate: '2026-03-10', result: 'passed' });
    expect(tr.record.data.expiryDate).toBe('2027-03-10');
    expect((await staff.json('GET', obj(co, 'tr_record', `/${tr.record.id}`))).record.data.expiryDate).toBe('2027-03-10');

    // a performance review: the person rates themselves, the reviewer rates and completes, the person acknowledges
    const review = await create(hr, co, 'pf_review', { employee: empId, reviewer: manager.userId, periodFrom: '2026-01-01', periodTo: '2026-06-30' }, [
      { objective: 'Safety', weight: 60 },
      { objective: 'Delivery', weight: 40 },
    ]);
    await step(hr, co, 'pf_review', review.record.id, 'start');
    let r = await staff.json('GET', obj(co, 'pf_review', `/${review.record.id}`));
    r = await staff.json('PATCH', obj(co, 'pf_review', `/${review.record.id}`), { data: {}, lines: r.lines.map((l: any) => ({ ...l, selfRating: 4, managerRating: 5 })), version: r.record.version });
    expect(r.lines.map((l: any) => [l.selfRating, l.managerRating])).toEqual([
      [4, null],
      [4, null],
    ]);
    await step(staff, co, 'pf_review', review.record.id, 'submit_self');
    r = await manager.json('GET', obj(co, 'pf_review', `/${review.record.id}`));
    r = await manager.json('PATCH', obj(co, 'pf_review', `/${review.record.id}`), { data: {}, lines: [{ ...r.lines[0], managerRating: 5, selfRating: 1 }, { ...r.lines[1], managerRating: 3 }], version: r.record.version });
    expect(r.lines[0].selfRating).toBe(4);
    expect(r.record.data.overallScore).toBe(4.2);
    await step(manager, co, 'pf_review', review.record.id, 'complete');
    expect((await step(staff, co, 'pf_review', review.record.id, 'acknowledge')).record.status).toBe('acknowledged');

    // a timesheet: submitted by the person, approved by their manager
    const wk = monday(-1);
    const ts = await create(staff, co, 'ts_sheet', { employee: empId, weekStart: wk }, [
      { date: wk, task: 'Design', hours: 8, billable: true },
      { date: new Date(Date.parse(`${wk}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10), task: 'Admin', hours: 6, billable: false },
    ]);
    expect(ts.record.data).toMatchObject({ totalHours: 14, billableHours: 8 });
    expect((await staff.req('POST', obj(co, 'ts_sheet'), { data: { employee: empId, weekStart: wk }, lines: [{ date: day(30), hours: 2 }] })).status).toBe(400);
    await step(staff, co, 'ts_sheet', ts.record.id, 'submit');
    expect((await step(manager, co, 'ts_sheet', ts.record.id, 'approve')).record.status).toBe('approved');

    // payroll: worked out for the fortnight, approved by someone other than the payroll officer who made it
    const run = await create(payroll, co, 'py_run', { periodStart: monday(-2), periodEnd: day(0), payDate: day(1), frequency: 'fortnightly', contributionPct: 12, currency: 'AUD' });
    const calc = await action(payroll, co, 'py_run', run.record.id, 'calculate');
    expect(calc.detail.record.status).toBe('calculated');
    const slip = calc.detail.lines.find((l: any) => l.employee === empId);
    expect(slip).toMatchObject({ gross: 300_000, withheld: 60_000, contribution: 36_000, net: 240_000 });
    expect((await payroll.req('POST', obj(co, 'py_run', `/${run.record.id}/step/approve`), {})).status).toBe(403);
    expect((await hr.req('GET', obj(co, 'py_run', `/${run.record.id}`))).status).toBe(200);
    expect((await officer.req('GET', obj(co, 'py_run', `/${run.record.id}`))).status).toBe(404);
    await step(hr, co, 'py_run', run.record.id, 'approve');
    const slips = await staff.json('GET', erp(co, '/x/payslips'));
    expect(slips.payslips).toHaveLength(1);
    expect(slips.payslips[0]).toMatchObject({ gross: 300_000, net: 240_000 });
    expect((await viewer.json('GET', erp(co, '/x/payslips'))).payslips).toHaveLength(0);

    // project hours and costs from the approved timesheet: 14 hours at 60.00
    const costs = await manager.json('GET', obj(co, 'ts_sheet', '/report/project-costs'));
    expect(costs.report.rows[0]).toMatchObject({ hours: 14, billable: 8, cost: 84_000 });

    // search finds the records the person may see, and nothing of another company
    const found = await hr.json('GET', erp(co, '/x/search?q=riley'));
    expect(found.results.some((x: any) => x.kind === 'Employee')).toBe(true);
    const stranger = await signup('Kappa Stranger');
    expect((await stranger.req('GET', erp(co, '/x/search?q=riley'))).status).toBe(404);
    expect((await stranger.req('GET', obj(co, 'hr_employee', `/${empId}`))).status).toBe(404);
    // CSV export of employees leaves the pay out for an HR officer
    const csv = await (await officer.req('GET', obj(co, 'hr_employee', '?format=csv'))).text();
    expect(csv).toContain('Riley');
    expect(csv).not.toContain('Annual salary');
    expect(owner.userId).toBeTruthy();
  });
});

describe('isolation, roles and segregation', () => {
  it('keeps each company’s records to itself and checks roles on the server', async () => {
    const a = await team('Lambda');
    const b = await team('Mu');
    const ent = await create(a.owner, a.co, 'org_entity', { name: 'Lambda NZ', entityType: 'subsidiary', country: 'NZ', currency: 'NZD', fiscalYearStart: '4', language: 'en', timezone: 'Pacific/Auckland' });
    // another company: 404 on the record, nothing in its lists, a reference to it refused
    expect((await b.owner.req('GET', obj(a.co, 'org_entity', `/${ent.record.id}`))).status).toBe(404);
    expect((await b.owner.req('GET', obj(b.co, 'org_entity', `/${ent.record.id}`))).status).toBe(404);
    expect((await b.owner.json('GET', obj(b.co, 'org_entity'))).total).toBe(0);
    const refusedRef = await b.owner.req('POST', obj(b.co, 'org_unit'), { data: { name: 'Wrong', unitType: 'team', entity: ent.record.id } });
    expect(refusedRef.status).toBe(400);
    // everyone in the company reads legal entities; only operations or finance control changes them
    expect((await a.viewer.json('GET', obj(a.co, 'org_entity'))).total).toBe(1);
    expect((await a.viewer.req('POST', obj(a.co, 'org_entity'), { data: { name: 'X', entityType: 'branch', country: 'AU', currency: 'AUD' } })).status).toBe(403);
    expect((await a.viewer.req('PATCH', obj(a.co, 'org_entity', `/${ent.record.id}`), { data: { name: 'Y' } })).status).toBe(403);
    // fields are checked on the server
    expect((await a.owner.req('POST', obj(a.co, 'org_entity'), { data: { name: 'Bad', entityType: 'branch', country: 'Australia', currency: 'AUD' } })).status).toBe(400);
    expect((await a.owner.req('POST', obj(a.co, 'org_entity'), { data: { name: 'Bad', entityType: 'nonsense', country: 'AU', currency: 'AUD' } })).status).toBe(400);
    expect((await a.owner.req('POST', obj(a.co, 'org_entity'), { data: { name: 'Bad', entityType: 'branch', country: 'AU', currency: 'AUD', sneaky: 1 } })).status).toBe(400);
    expect((await a.owner.req('POST', obj(a.co, 'nonsense_object'), { data: {} })).status).toBe(404);
    // two saves of the same version: the second is refused
    const v = ent.record.version;
    await a.owner.json('PATCH', obj(a.co, 'org_entity', `/${ent.record.id}`), { data: { name: 'Lambda New Zealand' }, version: v });
    expect((await a.owner.req('PATCH', obj(a.co, 'org_entity', `/${ent.record.id}`), { data: { name: 'Stale' }, version: v })).status).toBe(409);
    // segregation: the controller who placed an asset in service is not the one who drafted it
    const asset = await create(a.controller, a.co, 'fa_asset', { name: 'CNC router', category: 'plant', acquisitionDate: '2026-01-01', cost: 1_200_000, usefulLifeMonths: 60, method: 'straight_line' });
    const sod = await a.controller.req('POST', obj(a.co, 'fa_asset', `/${asset.record.id}/step/place`), {});
    expect(sod.status).toBe(403);
    expect(await sod.text()).toContain('segregation of duties');
    const placed = await step(a.owner, a.co, 'fa_asset', asset.record.id, 'place');
    expect(placed.record.status).toBe('in_service');
    expect(placed.record.data.bookValue).toBeLessThan(1_200_000);
    const reg = await a.controller.json('GET', obj(a.co, 'fa_asset', '/report/register'));
    expect(reg.report.rows[0].cost).toBe(1_200_000);
    // the HR role does not open the finance controller's assets
    expect((await a.hr.req('GET', obj(a.co, 'fa_asset', `/${asset.record.id}`))).status).toBe(404);
    // a draft nobody refers to may be deleted; one referred to is archived instead
    const unit = await create(a.owner, a.co, 'org_unit', { name: 'North', unitType: 'region', entity: ent.record.id });
    expect((await a.owner.req('DELETE', obj(a.co, 'org_entity', `/${ent.record.id}`))).status).toBe(409);
    expect((await a.owner.json('DELETE', obj(a.co, 'org_unit', `/${unit.record.id}`))).deleted).toBe(true);
    const archived = await a.owner.json('DELETE', obj(a.co, 'org_entity', `/${ent.record.id}?archive=1`));
    expect(archived.record.archivedAt).toBeTruthy();
    // a module switched off by a platform admin answers 403 MODULE_DISABLED to the company's people
    await env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('module_organisation_enabled', 'company', ?, 'off', 'test switch', 'test', ?)").bind(a.co, Date.now()).run();
    const off = await a.owner.req('GET', obj(a.co, 'org_entity'));
    expect(off.status).toBe(403);
    expect(await off.text()).toContain('MODULE_DISABLED');
    await env.DB.prepare("DELETE FROM feature_flags WHERE key = 'module_organisation_enabled' AND scope_id = ?").bind(a.co).run();
    expect((await a.owner.req('GET', obj(a.co, 'org_entity'))).status).toBe(200);
  });
});

describe('calibration, reminders and workflow rules', () => {
  it('moves an instrument’s due date on a pass, takes it out of service on a fail, and reminds once', async () => {
    const t = await team('Nu');
    const { co, quality, hr, owner, staff } = t;
    const ins = await create(quality, co, 'cal_instrument', { name: 'Micrometer 0-25', instrumentType: 'Micrometer', intervalDays: 180 });
    expect(ins.record.data.nextDue).toBe(day(0));
    const pass = await create(quality, co, 'cal_record', { instrument: ins.record.id, date: '2026-11-01', performedBy: 'internal' }, [{ point: '10 mm', nominal: 10, measured: 10.001, tolerance: 0.002 }]);
    expect(pass.record.data.asLeft).toBe('pass');
    await step(quality, co, 'cal_record', pass.record.id, 'complete');
    let i = await quality.json('GET', obj(co, 'cal_instrument', `/${ins.record.id}`));
    expect(i.record.data).toMatchObject({ lastCalibrated: '2026-11-01', nextDue: '2027-04-30' });
    expect(i.record.status).toBe('in_service');
    const fail = await create(quality, co, 'cal_record', { instrument: ins.record.id, date: '2026-11-15' }, [{ point: '20 mm', nominal: 20, measured: 20.01, tolerance: 0.002 }]);
    expect(fail.record.data.asLeft).toBe('fail');
    await step(quality, co, 'cal_record', fail.record.id, 'complete');
    i = await quality.json('GET', obj(co, 'cal_instrument', `/${ins.record.id}`));
    expect(i.record.status).toBe('out_of_service');

    // a contract whose notice date has come: one reminder however often the run runs
    const contract = await create(owner, co, 'ct_contract', { title: 'Cleaning', partyType: 'other', otherParty: 'Shine Co', startDate: day(-300), endDate: day(10), noticeDays: 30, owner: staff.userId });
    expect(contract.record.dueDate).toBe(day(-20));
    await runObjectReminders(env, day(0));
    await runObjectReminders(env, day(0));
    const rows = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_alerts WHERE company_id = ? AND record_id = ? AND kind = 'overdue'").bind(co, contract.record.id).first<{ n: number }>();
    expect(rows!.n).toBe(1);
    expect((await staff.json('GET', erp(co, '/x/alerts'))).alerts.some((x: any) => x.title.includes(contract.record.number))).toBe(true);

    // a workflow rule: leave waiting for approval tells the HR manager, and escalates to the owner after 2 days
    const rule = await create(owner, co, 'wf_rule', { name: 'Leave waiting', object: 'hr_leave', status: 'submitted', notifyRole: 'hr_manager', escalateDays: 2, escalateRole: 'erp_admin' });
    expect(rule.record.status).toBe('active');
    expect((await owner.req('POST', obj(co, 'wf_rule'), { data: { name: 'Bad', object: 'hr_leave', status: 'nonsense', notifyRole: 'hr_manager' } })).status).toBe(400);
    expect((await hr.req('POST', obj(co, 'wf_rule'), { data: { name: 'HR cannot', object: 'hr_leave', status: 'submitted', notifyRole: 'hr_manager' } })).status).toBe(403);
    const lt = await create(hr, co, 'hr_leave_type', { name: 'Sick leave', paid: true, annualDays: 10 });
    const emp = await create(hr, co, 'hr_employee', { firstName: 'Sam', lastName: 'Lee', startDate: day(-50), employmentType: 'full_time', user: staff.userId });
    const lv = await create(staff, co, 'hr_leave', { employee: emp.record.id, leaveType: lt.record.id, fromDate: monday(3), toDate: monday(3) });
    await step(staff, co, 'hr_leave', lv.record.id, 'submit');
    expect((await hr.json('GET', erp(co, '/x/alerts'))).alerts.some((x: any) => x.kind === 'workflow' && x.title.includes(lv.record.number))).toBe(true);
    await env.DB.prepare('UPDATE erp_objects SET status_at = ? WHERE company_id = ? AND id = ?').bind(Date.now() - 3 * 86_400_000, co, lv.record.id).run();
    await runObjectReminders(env, day(0));
    await runObjectReminders(env, day(0));
    const esc = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_alerts WHERE company_id = ? AND record_id = ? AND kind = 'escalation'").bind(co, lv.record.id).first<{ n: number }>();
    expect(esc!.n).toBe(1);
  });
});

describe('draft invoices in Finance', () => {
  it('invoices a subscription period once and moves the next date on; a service job and a progress claim too', async () => {
    const t = await team('Xi');
    const { co, tools, sales, controller, owner } = t;
    const customer = await owner.json('POST', `/api/fin/orgs/${tools.finance}/contacts`, { name: 'Orbit Media', kind: 'customer' });
    const opts = await sales.json('GET', erp(co, `/x/lookup/customer?q=orbit`));
    expect(opts.options.map((o: any) => o.id)).toContain(`fin:${customer.id}`);
    const sub = await create(sales, co, 'sb_subscription', { customer: `fin:${customer.id}`, plan: 'Support plan', amount: 120_000, interval: 'quarterly', startDate: '2026-10-01', nextInvoiceDate: '2026-10-01', currency: 'AUD' });
    expect(sub.record.data.mrr).toBe(40_000);
    const inv = await action(sales, co, 'sb_subscription', sub.record.id, 'invoice');
    expect(inv.link).toContain('/invoices/');
    expect(inv.detail.record.data.nextInvoiceDate).toBe('2027-01-01');
    const invoices = await env.DB.prepare("SELECT COUNT(*) AS n, MAX(total) AS total FROM fin_docs WHERE org_id = ? AND kind = 'invoice' AND status = 'draft'").bind(tools.finance).first<any>();
    expect(invoices.n).toBe(1);
    // the same period asked again (the next date was moved): a new period is invoiced, never the old one twice
    await env.DB.prepare("UPDATE erp_objects SET data_json = json_set(data_json, '$.nextInvoiceDate', '2026-10-01') WHERE company_id = ? AND id = ?").bind(co, sub.record.id).run();
    const again = await action(sales, co, 'sb_subscription', sub.record.id, 'invoice');
    expect(again.message).toContain('already made');
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM fin_docs WHERE org_id = ? AND kind = 'invoice'").bind(tools.finance).first<any>()).n).toBe(1);

    // a progress claim: 50% of 100,000.00 less 5% retention is 47,500.00; certified by someone else; then invoiced
    const pm = t.manager;
    const contract = await create(owner, co, 'ct_contract', { title: 'Warehouse fit-out', partyType: 'customer', customer: `fin:${customer.id}`, contractType: 'construction', startDate: '2026-09-01', endDate: '2027-03-01', value: 10_000_000 });
    // the project manager has no Finance role, so cannot choose a Finance customer (one customer record, Finance's own permissions)
    expect((await pm.req('POST', obj(co, 'cn_claim'), { data: { contract: contract.record.id, customer: `fin:${customer.id}`, periodEnd: '2026-11-30' } })).status).toBe(403);
    const claim = await create(controller, co, 'cn_claim', { contract: contract.record.id, customer: `fin:${customer.id}`, periodEnd: '2026-11-30', retentionPct: 5 }, [{ item: 'Fit-out', contractValue: 10_000_000, percentComplete: 50 }]);
    expect(claim.record.data).toMatchObject({ valueToDate: 5_000_000, retention: 250_000, previouslyClaimed: 0, thisClaim: 4_750_000 });
    await step(controller, co, 'cn_claim', claim.record.id, 'submit');
    expect((await pm.req('POST', obj(co, 'cn_claim', `/${claim.record.id}/step/certify`), {})).status).toBe(400);
    await env.DB.prepare("UPDATE erp_objects SET data_json = json_set(data_json, '$.certificateReference', 'PC-1') WHERE company_id = ? AND id = ?").bind(co, claim.record.id).run();
    expect((await controller.req('POST', obj(co, 'cn_claim', `/${claim.record.id}/step/certify`), {})).status).toBe(403);
    await step(pm, co, 'cn_claim', claim.record.id, 'certify');
    // Finance refuses the project manager the invoice; the finance controller makes it
    expect((await pm.req('POST', obj(co, 'cn_claim', `/${claim.record.id}/action/invoice`), {})).status).toBe(403);
    const ci = await action(controller, co, 'cn_claim', claim.record.id, 'invoice');
    expect(ci.detail.record.status).toBe('invoiced');
    const second = await create(controller, co, 'cn_claim', { contract: contract.record.id, customer: `fin:${customer.id}`, periodEnd: '2026-12-31', retentionPct: 5 }, [{ item: 'Fit-out', contractValue: 10_000_000, percentComplete: 80 }]);
    expect(second.record.data).toMatchObject({ valueToDate: 8_000_000, retention: 400_000, previouslyClaimed: 4_750_000, thisClaim: 2_850_000 });
  });
});

// ------------------------------------------------------------------ every kind of record

/** A value for a field, making the records a reference needs. */
async function valueFor(c: Client, co: string, f: FieldDef, ctx: { customer: string; supplier: string; product: string; made: Map<string, string> }, depth: number): Promise<unknown> {
  switch (f.type) {
    case 'text':
    case 'textarea':
      return `${f.label} ${Math.random().toString(36).slice(2, 6)}`.slice(0, Math.min(f.max ?? 200, 60));
    case 'email':
      return uniqueEmail('x');
    case 'phone':
      return '02 9000 0000';
    case 'url':
      return 'https://example.com';
    case 'number':
    case 'percent':
      return Math.max(f.min ?? 0, Math.min(f.max ?? 100, 5));
    case 'integer':
      return Math.max(f.min ?? 0, Math.min(f.max ?? 100, 3));
    case 'money':
      return 12_345;
    case 'date':
      return day(0);
    case 'time':
      return '09:00';
    case 'select':
      return f.default ?? Object.keys(f.options ?? {})[0];
    case 'bool':
      return true;
    case 'currency':
      return 'AUD';
    case 'country':
      return 'AU';
    case 'ref': {
      const r = f.ref!;
      if (r === 'customer') return ctx.customer;
      if (r === 'supplier') return ctx.supplier;
      if (r === 'product') return ctx.product;
      if (r === 'user') return c.userId;
      if (r.startsWith('obj:')) return makeOne(c, co, OBJECT_BY_KEY[r.slice(4)], ctx, depth + 1);
      return null;
    }
  }
}

async function makeOne(c: Client, co: string, def: ObjectDef, ctx: { customer: string; supplier: string; product: string; made: Map<string, string> }, depth = 0): Promise<string> {
  if (ctx.made.has(def.key)) return ctx.made.get(def.key)!;
  if (depth > 4) throw new Error(`references too deep at ${def.key}`);
  const data: Record<string, unknown> = {};
  for (const f of def.fields) if (f.required && !f.computed) data[f.key] = await valueFor(c, co, f, ctx, depth);
  // the few cross-field rules
  if (def.key === 'ct_contract') Object.assign(data, { partyType: 'other', otherParty: 'Someone' });
  if (def.key === 'fx_rate') Object.assign(data, { fromCurrency: 'AUD', toCurrency: 'USD', rate: 0.65 });
  if (def.key === 'wf_rule') Object.assign(data, { object: 'hr_leave', status: 'submitted', notifyRole: 'hr_manager' });
  if (def.key === 'fl_trip') Object.assign(data, { startOdometer: 100, endOdometer: 150 });
  if (def.key === 'hr_leave') Object.assign(data, { fromDate: monday(1), toDate: monday(1) });
  if (def.key === 'hr_attendance') Object.assign(data, { clockIn: '08:00', clockOut: '16:30', breakMinutes: 30 });
  if (def.key === 'ic_transaction') data.buyer = (await c.json('POST', obj(co, 'org_entity'), { data: { name: 'Second entity', entityType: 'subsidiary', country: 'NZ', currency: 'NZD' } })).record.id;
  const lines = def.lines ? [] : undefined;
  const res = await c.req('POST', obj(co, def.key), { data, ...(lines ? { lines } : {}) });
  const body = await res.text();
  if (res.status !== 201) throw new Error(`create ${def.key} -> ${res.status}: ${body}`);
  const id = JSON.parse(body).record.id as string;
  ctx.made.set(def.key, id);
  return id;
}

describe('every kind of record', () => {
  it('is created, read, changed, listed with filters, reported and exported by an ERP administrator', async () => {
    const t = await team('Omicron');
    const { owner, co } = t;
    const customer = await owner.json('POST', `/api/fin/orgs/${t.tools.finance}/contacts`, { name: 'Every Customer', kind: 'customer' });
    const supplier = await owner.json('POST', erp(co, '/suppliers'), { legalName: 'Every Supplier' });
    const product = await owner.json('POST', erp(co, '/products'), { name: 'Every product', type: 'finished_product', priceCents: 1000 });
    const ctx = { customer: `fin:${customer.id}`, supplier: supplier.id, product: product.id, made: new Map<string, string>() };
    const skipped: string[] = [];
    for (const def of OBJECTS) {
      // an invoice match needs a purchase order: tested with Release 2's purchasing elsewhere
      if (def.fields.some((f) => f.required && f.type === 'ref' && ['purchase_order', 'sales_order', 'mfg_order', 'shipment', 'project', 'asset', 'warehouse', 'department'].includes(f.ref!))) {
        skipped.push(def.key);
        continue;
      }
      const id = await makeOne(owner, co, def, ctx);
      const got = await owner.json('GET', obj(co, def.key, `/${id}`));
      expect(got.record.number.startsWith(def.prefix)).toBe(true);
      expect(got.history.length).toBeGreaterThan(0);
      if (got.can.edit) await owner.json('PATCH', obj(co, def.key, `/${id}`), { data: {}, version: got.record.version });
      const list = await owner.json('GET', obj(co, def.key, `?q=&sort=number&dir=asc&status=${got.record.status}`));
      expect(list.records.some((r: any) => r.id === id)).toBe(true);
      const csv = await owner.req('GET', obj(co, def.key, '?format=csv'));
      expect(csv.status).toBe(200);
      expect(csv.headers.get('Content-Type')).toContain('text/csv');
      for (const r of def.reports ?? []) {
        const rep = await owner.req('GET', obj(co, def.key, `/report/${r.key}`));
        expect(rep.status, `${def.key} report ${r.key}`).toBe(200);
      }
      const m = await owner.json('GET', erp(co, `/x/m/${def.module}`));
      expect(m.objects.some((o: any) => o.key === def.key)).toBe(true);
    }
    expect(skipped).toEqual(['im_match']);
    const mods = await owner.json('GET', erp(co, '/x/modules'));
    expect(mods.modules.every((m: any) => m.opens)).toBe(true);
  });

  it('imports records from CSV only when every row is right', async () => {
    const t = await team('Pi');
    const { owner, co, viewer } = t;
    const bad = await owner.req('POST', obj(co, 'org_location', '/import'), { csv: 'Name,Kind,Country\nSydney office,Office,AU\nBroken,Spaceship,AU\n' });
    expect(bad.status).toBe(400);
    expect((await owner.json('GET', obj(co, 'org_location'))).total).toBe(0);
    const ok = await owner.json('POST', obj(co, 'org_location', '/import'), { csv: 'Name,Kind,Country\nSydney office,Office,AU\nMelbourne plant,Plant,AU\n' });
    expect(ok.made).toHaveLength(2);
    expect((await owner.json('GET', obj(co, 'org_location', '?f.locationType=plant'))).total).toBe(1);
    expect((await viewer.req('POST', obj(co, 'org_location', '/import'), { csv: 'Name,Kind\nX,Office\n' })).status).toBe(403);
  });
});
