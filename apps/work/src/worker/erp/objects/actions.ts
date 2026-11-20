// The modules framework's actions: the work a step of one record does across modules. Hiring an applicant makes their
// employee record and onboarding checklist; a pay run is worked out from salaries and approved timesheets; a commission
// statement from won CRM deals (with the person's CRM access); a ticket sends a technician; timesheets, field jobs,
// subscriptions and progress claims become draft invoices in Finance (finance.ts); an invoice match loads its purchase
// order and checks it against the receipts. Every one runs on the server with the caller's access.

import type { Env } from '../../env';
import { HttpError, parseJson } from '../../lib/util';
import type { ErpAccess } from '../access';
import { badState } from '../util';
import { loadAccess as crmAccess, scopeSql as crmScopeSql } from '../../crm/access';
import { crmOrgsFor } from '../sales';
import { OBJECT_BY_KEY, type ObjectDef } from '../../../shared/erp-objects';
import { loadRow, objAccess, parseValue, relation, type Data, type Line, type RecordRow } from './engine';
import { addDays, addMonths, depreciationSchedule, getObj, workingDays } from './hooks';
import { draftInvoice } from './finance';
import { linesOf, saveRecord, statusStmts, todayUtc, type User } from './store';

export interface ActionResult {
  record?: RecordRow;
  message: string;
  /** An ERP page or a Finance address to open. */
  link?: string;
  result?: unknown;
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === 'string' ? v : '');

type Ctx = { env: Env; a: ErpAccess; user: User; def: ObjectDef; row: RecordRow; data: Data; input: Data; waitUntil?: (p: Promise<unknown>) => void };
type Action = (c: Ctx) => Promise<ActionResult>;

async function setLines(c: Ctx, lines: Line[], status?: string) {
  const db = c.env.DB;
  const rec = await saveRecord(c.env, c.a, c.user, c.def, { id: c.row.id, input: {}, lines, system: true });
  if (status && rec.status !== status) {
    await db.batch(statusStmts(db, c.a, c.def, rec, status, `${c.def.label} ${rec.number}: worked out`));
    return loadRow(db, c.a.companyId, c.def, rec.id);
  }
  return rec;
}

/** The first template of a kind in the company that is in use. */
async function templateOf(db: D1Database, companyId: string, kind: 'onboarding' | 'offboarding') {
  const r = await db.prepare("SELECT id FROM erp_objects WHERE company_id = ? AND object = 'ob_template' AND status = 'active' AND archived_at IS NULL AND json_extract(data_json, '$.kind') = ? ORDER BY created_at LIMIT 1").bind(companyId, kind).first<{ id: string }>();
  return r?.id ?? null;
}

async function templateLines(db: D1Database, companyId: string, templateId: string, start: string, people: { hr: string | null; manager: string | null; employee: string | null }): Promise<Line[]> {
  const lines = await linesOf(db, companyId, templateId);
  return lines.map((l) => ({ task: str(l.task), owner: l.owner === 'manager' ? people.manager : l.owner === 'employee' ? people.employee : people.hr, due: addDays(start, num(l.dayOffset)), done: false }));
}

async function checklist(c: Ctx, employeeId: string, kind: 'onboarding' | 'offboarding', start: string) {
  const db = c.env.DB;
  const def = OBJECT_BY_KEY.ob_checklist;
  const emp = await getObj(db, c.a.companyId, 'hr_employee', employeeId);
  const template = await templateOf(db, c.a.companyId, kind);
  const lines = template ? await templateLines(db, c.a.companyId, template, start, { hr: c.a.userId, manager: (emp?.data.manager as string) ?? null, employee: (emp?.data.user as string) ?? null }) : [];
  return saveRecord(c.env, c.a, c.user, def, { input: { employee: employeeId, kind, startDate: start, template }, lines, system: true });
}

/** Money to the cent from a rate and a period fraction. */
const part = (amount: number, fraction: number) => Math.round(amount * fraction);

const ACTIONS: Record<string, Action> = {
  'hr_employee.offboard': async (c) => {
    const start = str(c.data.endDate) || todayUtc();
    const made = await checklist(c, c.row.id, 'offboarding', start);
    return { record: c.row, message: `Offboarding checklist ${made.number} made`, link: `/c/${c.a.companyId}/m/onboarding/ob_checklist/${made.id}` };
  },

  'rc_applicant.hire': async (c) => {
    const db = c.env.DB;
    const start = parseValue({ key: 'startDate', label: 'Start date', type: 'date' }, c.input.startDate);
    if (!start) throw new HttpError(400, 'Give the start date');
    if (c.data.consent !== true) badState('The applicant has not agreed to us keeping their details');
    const job = await getObj(db, c.a.companyId, 'rc_job', c.data.job);
    const emp = await saveRecord(c.env, c.a, c.user, OBJECT_BY_KEY.hr_employee, {
      input: {
        firstName: c.data.firstName,
        lastName: c.data.lastName,
        email: c.data.email ?? null,
        phone: c.data.phone ?? null,
        position: job?.data.title ?? null,
        department: job?.data.department ?? null,
        location: job?.data.location ?? null,
        employmentType: job?.data.employmentType ?? 'full_time',
        startDate: start,
      },
      system: true,
    });
    const list = await checklist(c, emp.id, 'onboarding', String(start));
    const data = { ...c.data, employee: emp.id };
    await db.batch([
      ...statusStmts(db, c.a, c.def, c.row, 'hired', `Applicant ${c.row.number} hired: employee ${emp.number}, onboarding checklist ${list.number}`, data),
      db.prepare("INSERT OR IGNORE INTO erp_object_refs (company_id, record_id, field, kind, target_id, label) VALUES (?, ?, 'employee', 'obj:hr_employee', ?, ?)").bind(c.a.companyId, c.row.id, emp.id, `${emp.number} ${emp.title}`),
    ]);
    return { record: await loadRow(db, c.a.companyId, c.def, c.row.id), message: `Hired: employee ${emp.number} and onboarding checklist ${list.number} made`, link: `/c/${c.a.companyId}/m/hr/hr_employee/${emp.id}` };
  },

  'ob_checklist.apply_template': async (c) => {
    const db = c.env.DB;
    const template = str(c.data.template) || (await templateOf(db, c.a.companyId, c.data.kind === 'offboarding' ? 'offboarding' : 'onboarding'));
    if (!template) badState('Choose a template, or make one in Checklist templates');
    const emp = await getObj(db, c.a.companyId, 'hr_employee', c.data.employee);
    const add = await templateLines(db, c.a.companyId, template, str(c.data.startDate) || todayUtc(), { hr: c.a.userId, manager: (emp?.data.manager as string) ?? null, employee: (emp?.data.user as string) ?? null });
    if (!add.length) badState('The template has no steps');
    const current = await linesOf(db, c.a.companyId, c.row.id);
    const have = new Set(current.map((l) => str(l.task)));
    const rec = await setLines(c, [...current, ...add.filter((l) => !have.has(str(l.task)))]);
    return { record: rec, message: 'The template’s steps were added' };
  },

  'py_run.calculate': async (c) => {
    const db = c.env.DB;
    const from = str(c.data.periodStart);
    const to = str(c.data.periodEnd);
    const freq = str(c.data.frequency);
    const fraction = freq === 'weekly' ? 1 / 52 : freq === 'monthly' ? 1 / 12 : 1 / 26;
    const contribution = num(c.data.contributionPct) / 100;
    const emps = await db.prepare("SELECT id, data_json FROM erp_objects WHERE company_id = ? AND object = 'hr_employee' AND status IN ('active','on_leave') AND archived_at IS NULL ORDER BY number LIMIT 1000").bind(c.a.companyId).all<{ id: string; data_json: string }>();
    // approved timesheet hours in the period, per employee
    const hours = await db
      .prepare(
        `SELECT json_extract(e.data_json, '$.employee') AS emp, COALESCE(SUM(CAST(json_extract(l.data_json, '$.hours') AS REAL)), 0) AS h
           FROM erp_object_lines l JOIN erp_objects e ON e.company_id = l.company_id AND e.id = l.record_id
          WHERE l.company_id = ? AND e.object = 'ts_sheet' AND e.status IN ('approved','billed') AND json_extract(l.data_json, '$.date') BETWEEN ? AND ?
          GROUP BY json_extract(e.data_json, '$.employee')`,
      )
      .bind(c.a.companyId, from, to)
      .all<{ emp: string; h: number }>();
    const hoursOf = new Map(hours.results.map((r) => [r.emp, Math.round(num(r.h) * 100) / 100]));
    const lines: Line[] = [];
    for (const e of emps.results) {
      const d = parseJson<Data>(e.data_json, {});
      // started after the period or left before it: not paid in it
      if (str(d.startDate) > to || (d.endDate && str(d.endDate) < from)) continue;
      const h = hoursOf.get(e.id) ?? 0;
      const gross = d.payBasis === 'hourly' ? Math.round(h * num(d.hourlyRate)) : part(num(d.annualSalary), fraction);
      if (!gross) continue;
      const withheld = Math.round((gross * num(d.withholdingPct)) / 100);
      lines.push({ employee: e.id, hours: d.payBasis === 'hourly' ? h : null, gross, withheld, deductions: 0, contribution: Math.round(gross * contribution), net: gross - withheld });
    }
    if (!lines.length) badState('No active employee has pay for this period: check their pay basis, salary or rate, and approved timesheets');
    const rec = await setLines(c, lines, 'calculated');
    return { record: rec, message: `Pay worked out for ${lines.length} ${lines.length === 1 ? 'person' : 'people'}` };
  },

  'cm_statement.calculate': async (c) => {
    const db = c.env.DB;
    const plan = await getObj(db, c.a.companyId, 'cm_plan', c.data.plan);
    if (!plan) badState('Choose the plan');
    const rate = num(plan.data.ratePct);
    const person = str(plan.data.salesperson);
    const from = Date.parse(`${str(c.data.periodFrom)}T00:00:00Z`);
    const to = Date.parse(`${str(c.data.periodTo)}T00:00:00Z`) + 86_400_000;
    const orgs = await crmOrgsFor(db, c.a);
    if (!orgs.length) badState('This company does not run a CRM');
    const lines: Line[] = [];
    let currency: string | null = null;
    for (const o of orgs) {
      const ca = await crmAccess(db, o.id, c.user).catch(() => null);
      if (!ca) throw new HttpError(403, 'You have no access to the company’s CRM, so you cannot read its deals');
      const scope = crmScopeSql(ca, 'deals', 'd', 'view');
      const deals = await db.prepare(`SELECT d.title, d.value, d.currency, d.won_at FROM crm_deals d WHERE d.org_id = ? AND d.deleted_at IS NULL AND d.status = 'won' AND d.owner_id = ? AND d.won_at >= ? AND d.won_at < ? AND ${scope.sql} ORDER BY d.won_at LIMIT 2000`).bind(o.id, person, from, to, ...scope.args).all<any>();
      for (const d of deals.results) {
        currency = currency ?? d.currency;
        lines.push({ deal: String(d.title).slice(0, 200), wonDate: new Date(d.won_at).toISOString().slice(0, 10), dealValue: num(d.value), ratePct: rate, commission: Math.round((num(d.value) * rate) / 100) });
      }
    }
    const rec = await setLines(c, lines, 'calculated');
    if (currency && !c.data.currency) await saveRecord(c.env, c.a, c.user, c.def, { id: rec.id, input: { currency }, system: true });
    return { record: await loadRow(db, c.a.companyId, c.def, rec.id), message: lines.length ? `${lines.length} won ${lines.length === 1 ? 'deal' : 'deals'} in the period` : 'No deals were won by this salesperson in the period' };
  },

  'sv_ticket.job': async (c) => {
    const job = await saveRecord(c.env, c.a, c.user, OBJECT_BY_KEY.sv_job, { input: { title: str(c.data.subject).slice(0, 200), customer: c.data.customer ?? null, ticket: c.row.id, scheduledDate: todayUtc() } });
    return { record: c.row, message: `Field service job ${job.number} made: schedule and dispatch it`, link: `/c/${c.a.companyId}/m/service/sv_job/${job.id}` };
  },

  'sv_job.invoice': async (c) => {
    const lines = [];
    if (num(c.data.hoursWorked) > 0 && num(c.data.labourRate) > 0) lines.push({ description: `Labour: ${str(c.data.title)} (${c.row.number})`, quantity: num(c.data.hoursWorked), unitPrice: num(c.data.labourRate) });
    if (num(c.data.partsCost) > 0) lines.push({ description: `Parts: ${str(c.data.title)} (${c.row.number})`, quantity: 1, unitPrice: num(c.data.partsCost) });
    if (c.data.chargeable === false) badState('This job is not charged to the customer');
    const inv = await draftInvoice(c.env, c.a, c.user, { customer: (c.data.customer as string) ?? null, lines, reference: `${c.row.number} field service`, notes: `Made from BIZOMAT ERP field service job ${c.row.number}. Check the amounts, tax and accounts before approving.`, key: `invoice:sv_job:${c.a.companyId}:${c.row.id}`, sourceType: 'sv_job', sourceId: c.row.id });
    const db = c.env.DB;
    if (c.row.status !== 'invoiced') await db.batch(statusStmts(db, c.a, c.def, c.row, 'invoiced', `Draft invoice made in Finance for ${c.row.number}`));
    return { record: await loadRow(db, c.a.companyId, c.def, c.row.id), message: inv.existing ? 'The draft invoice was already made' : 'Draft invoice made in Finance', link: inv.url };
  },

  'sb_subscription.invoice': async (c) => {
    const db = c.env.DB;
    const period = str(c.data.nextInvoiceDate);
    if (!period) badState('Give the next invoice date');
    if (c.data.endDate && period > str(c.data.endDate)) badState('The subscription has ended');
    const months = { monthly: 1, quarterly: 3, yearly: 12 }[str(c.data.interval)] ?? 1;
    const until = addDays(addMonths(period, months), -1);
    const inv = await draftInvoice(c.env, c.a, c.user, { customer: (c.data.customer as string) ?? null, lines: [{ description: `${str(c.data.description) || str(c.data.plan)}: ${period} to ${until}`, quantity: 1, unitPrice: num(c.data.amount) }], reference: `${c.row.number} ${period}`, notes: `Made from BIZOMAT ERP subscription ${c.row.number}. Check the amounts, tax and accounts before approving.`, key: `invoice:sb:${c.a.companyId}:${c.row.id}:${period}`, sourceType: 'sb_subscription', sourceId: c.row.id });
    // the next period, once (a repeated request finds the invoice made and the date already moved)
    const next = addMonths(period, months);
    await db
      .prepare("UPDATE erp_objects SET data_json = json_set(data_json, '$.nextInvoiceDate', ?), due_date = ?, version = version + 1, updated_at = ? WHERE company_id = ? AND id = ? AND json_extract(data_json, '$.nextInvoiceDate') = ?")
      .bind(next, next, Date.now(), c.a.companyId, c.row.id, period)
      .run();
    return { record: await loadRow(db, c.a.companyId, c.def, c.row.id), message: inv.existing ? `The invoice for ${period} was already made` : `Draft invoice made for ${period}; the next is ${next}`, link: inv.url };
  },

  'cn_claim.invoice': async (c) => {
    const db = c.env.DB;
    if (!(num(c.data.thisClaim) > 0)) badState('This claim has nothing to invoice');
    const inv = await draftInvoice(c.env, c.a, c.user, { customer: (c.data.customer as string) ?? null, lines: [{ description: `Progress claim ${c.row.number}: work to ${str(c.data.periodEnd)}, less retention and earlier claims`, quantity: 1, unitPrice: num(c.data.thisClaim) }], reference: `${c.row.number} progress claim`, notes: `Made from BIZOMAT ERP progress claim ${c.row.number} (certificate ${str(c.data.certificateReference)}). Retention held: ${(num(c.data.retention) / 100).toFixed(2)}.`, key: `invoice:cn_claim:${c.a.companyId}:${c.row.id}`, sourceType: 'cn_claim', sourceId: c.row.id });
    if (c.row.status !== 'invoiced') await db.batch(statusStmts(db, c.a, c.def, c.row, 'invoiced', `Draft invoice made in Finance for ${c.row.number}`));
    return { record: await loadRow(db, c.a.companyId, c.def, c.row.id), message: inv.existing ? 'The draft invoice was already made' : 'Draft invoice made in Finance', link: inv.url };
  },

  'ts_sheet.bill': async (c) => {
    const db = c.env.DB;
    const customer = parseValue({ key: 'customer', label: 'Customer', type: 'ref' }, c.input.customer) as string | null;
    const rate = parseValue({ key: 'rate', label: 'Rate an hour', type: 'money' }, c.input.rate) as number | null;
    if (!customer) throw new HttpError(400, 'Choose the customer');
    if (!rate) throw new HttpError(400, 'Give the rate an hour');
    const hours = num(c.data.billableHours);
    if (!(hours > 0)) badState('This timesheet has no billable hours');
    const inv = await draftInvoice(c.env, c.a, c.user, { customer, lines: [{ description: `${str(c.data.summary)}: billable hours (${c.row.number})`, quantity: hours, unitPrice: rate }], reference: `${c.row.number} timesheet`, notes: `Made from BIZOMAT ERP timesheet ${c.row.number}. Check the amounts, tax and accounts before approving.`, key: `invoice:ts:${c.a.companyId}:${c.row.id}`, sourceType: 'ts_sheet', sourceId: c.row.id });
    if (c.row.status !== 'billed') await db.batch(statusStmts(db, c.a, c.def, c.row, 'billed', `Draft invoice made in Finance for ${c.row.number}: ${hours} hours`, { ...c.data, billedRate: rate, billedCustomer: customer }));
    return { record: await loadRow(db, c.a.companyId, c.def, c.row.id), message: inv.existing ? 'The draft invoice was already made' : 'Draft invoice made in Finance', link: inv.url };
  },

  'im_match.load': async (c) => {
    const db = c.env.DB;
    const po = str(c.data.purchaseOrder);
    const rows = await db.prepare('SELECT id, position, item, quantity, unit_price_cents, received_qty FROM erp_po_lines WHERE company_id = ? AND po_id = ? ORDER BY position').bind(c.a.companyId, po).all<any>();
    if (!rows.results.length) badState('The purchase order has no lines');
    const current = await linesOf(db, c.a.companyId, c.row.id);
    const byLine = new Map(current.map((l) => [str(l.poLineId), l]));
    const lines = rows.results.map((r: any) => {
      const had = byLine.get(r.id);
      return { poLineId: r.id, description: String(r.item ?? '').slice(0, 300), orderedQty: num(r.quantity), receivedQty: num(r.received_qty), orderPrice: num(r.unit_price_cents), invoicedQty: had ? had.invoicedQty : num(r.received_qty), invoicedPrice: had ? had.invoicedPrice : num(r.unit_price_cents) };
    });
    return { record: await setLines(c, lines), message: `${lines.length} order ${lines.length === 1 ? 'line' : 'lines'} loaded: enter what the supplier invoiced, then check the match` };
  },

  'im_match.check': async (c) => {
    const db = c.env.DB;
    const current = await linesOf(db, c.a.companyId, c.row.id);
    if (!current.length) badState('Load the order lines first');
    // receipts may have moved on since the lines were loaded
    const po = await db.prepare('SELECT id, received_qty, quantity, unit_price_cents FROM erp_po_lines WHERE company_id = ? AND po_id = ?').bind(c.a.companyId, str(c.data.purchaseOrder)).all<any>();
    const fresh = new Map(po.results.map((r: any) => [r.id, r]));
    const lines = current.map((l) => {
      const r: any = fresh.get(str(l.poLineId));
      return r ? { ...l, orderedQty: num(r.quantity), receivedQty: num(r.received_qty), orderPrice: num(r.unit_price_cents) } : l;
    });
    const rec = await saveRecord(c.env, c.a, c.user, c.def, { id: c.row.id, input: {}, lines, system: true });
    const checked = await linesOf(db, c.a.companyId, rec.id);
    const ok = checked.every((l) => l.result === 'match');
    const to = ok ? 'matched' : 'variance';
    if (rec.status !== to) await db.batch(statusStmts(db, c.a, c.def, rec, to, ok ? `Invoice ${str(c.data.invoiceNumber)} matches the order and receipts` : `Invoice ${str(c.data.invoiceNumber)} differs from the order or receipts`));
    return { record: await loadRow(db, c.a.companyId, c.def, rec.id), message: ok ? 'Matched within the tolerance' : 'A variance: a procurement manager approves it, or dispute it with the supplier' };
  },

  'fa_asset.schedule': async (c) => {
    const rows = depreciationSchedule(c.data);
    return { record: c.row, message: rows.length ? `${rows.length} months of depreciation` : 'Give the cost, useful life and acquisition date first', result: rows };
  },
};

export async function runAction(env: Env, a: ErpAccess, user: User, def: ObjectDef, id: string, key: string, input: Data, waitUntil?: (p: Promise<unknown>) => void): Promise<ActionResult> {
  const action = def.actions?.find((x) => x.key === key);
  const fn = ACTIONS[`${def.key}.${key}`];
  if (!action || !fn) throw new HttpError(404, 'Action not found');
  const x = objAccess(a, def);
  const row = await loadRow(env.DB, a.companyId, def, id);
  const rel = relation(x, row, a.userId);
  if (!rel.sees) throw new HttpError(404, `${def.label} not found`);
  if (row.archived_at) throw new HttpError(409, 'This record is archived');
  if (action.statuses && !action.statuses.includes(row.status)) throw new HttpError(409, `${action.label} is not possible while it is ${def.statuses.find((s) => s.key === row.status)?.label.toLowerCase() ?? row.status}`);
  const allowed = action.cap === 'edit' ? x.edit : action.cap === 'approve' ? x.approve || rel.approver : x.edit || rel.own;
  if (!allowed) throw new HttpError(403, `Your ERP roles do not let you ${action.label.toLowerCase()}`);
  return fn({ env, a, user, def, row, data: parseJson<Data>(row.data_json, {}), input: input ?? {}, waitUntil });
}

export { workingDays };
