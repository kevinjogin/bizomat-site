// Planning: budgets (by category and month, optionally for a department, project or cost centre), savings goals,
// recurring transactions, invoices and bills, and reports generated on a schedule.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { FREQUENCIES, type Frequency, addMonths, isIsoDate, monthOf, nextDate } from '../../shared/fin/dates';
import { type FinAccess, deny, loadAccess, requireBusiness, requireOrg, requirePerm } from './access';
import { accountBalances, chartOf, natural } from './ledger';
import { type TxInput, createTransaction, prepareTransaction } from './transactions';
import { type DocInput, createDoc, prepareDoc } from './docs';
import { auditStmt, finNotify, runBatch } from './util';

export const planRoutes = new Hono<AppEnv>();

const text = (max: number) => z.string().trim().max(max);
const id = () => z.string().max(64);
const isoDate = () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date as YYYY-MM-DD');
const month = () => z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use a month as YYYY-MM');

// ------------------------------------------------------------------ budgets

function budgetDTO(b: any) {
  return { id: b.id, name: b.name, startMonth: b.start_month, months: b.months, departmentId: b.department_id, projectId: b.project_id, costCentreId: b.cost_centre_id, alertPct: b.alert_pct, archived: !!b.archived_at, createdAt: b.created_at };
}

export function budgetMonths(startMonth: string, months: number): string[] {
  return Array.from({ length: months }, (_, i) => monthOf(addMonths(`${startMonth}-01`, i)));
}

planRoutes.get('/orgs/:org/budgets', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'view', 'You cannot see budgets');
  const rows = await c.env.DB.prepare('SELECT * FROM fin_budgets WHERE org_id = ? ORDER BY archived_at IS NOT NULL, start_month DESC, name').bind(a.orgId).all<any>();
  return c.json(rows.results.map(budgetDTO));
});

const budgetInput = z.object({ name: text(120).min(1, 'Name the budget'), startMonth: month(), months: z.number().int().min(1).max(36).optional(), departmentId: id().nullable().optional(), projectId: id().nullable().optional(), costCentreId: id().nullable().optional(), alertPct: z.number().int().min(1).max(1000).optional() });

async function checkTracking(db: D1Database, a: FinAccess, ids: (string | null | undefined)[]) {
  for (const t of ids) {
    if (!t) continue;
    const ok = await db.prepare('SELECT 1 FROM fin_tracking WHERE id = ? AND org_id = ?').bind(t, a.orgId).first();
    if (!ok) throw new HttpError(400, 'Choose a department, project or cost centre from this workspace');
  }
}

planRoutes.post('/orgs/:org/budgets', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change budgets');
  const input = await body(c, budgetInput);
  await checkTracking(c.env.DB, a, [input.departmentId, input.projectId, input.costCentreId]);
  const bid = newId();
  await runBatch(c.env.DB, [
    c.env.DB.prepare('INSERT INTO fin_budgets (id, org_id, name, start_month, months, department_id, project_id, cost_centre_id, alert_pct, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(bid, a.orgId, input.name, input.startMonth, input.months ?? 12, input.departmentId ?? null, input.projectId ?? null, input.costCentreId ?? null, input.alertPct ?? 90, a.userId, now(), now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'budget.created', targetType: 'budget', targetId: bid, after: input }),
  ]);
  return c.json({ id: bid }, 201);
});

async function loadBudget(c: any, a: FinAccess) {
  const b = await c.env.DB.prepare('SELECT * FROM fin_budgets WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first();
  if (!b) throw notFound('Budget');
  return b as any;
}

planRoutes.get('/orgs/:org/budgets/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'view', 'You cannot see budgets');
  const b = await loadBudget(c, a);
  const lines = await c.env.DB.prepare('SELECT account_id, month, amount FROM fin_budget_lines WHERE budget_id = ? AND org_id = ?').bind(b.id, a.orgId).all<any>();
  return c.json({ ...budgetDTO(b), monthsList: budgetMonths(b.start_month, b.months), lines: lines.results.map((l) => ({ accountId: l.account_id, month: l.month, amount: l.amount })) });
});

planRoutes.patch('/orgs/:org/budgets/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change budgets');
  const b = await loadBudget(c, a);
  const input = await body(c, budgetInput.partial().extend({ archived: z.boolean().optional() }));
  await checkTracking(c.env.DB, a, [input.departmentId, input.projectId, input.costCentreId]);
  await c.env.DB.prepare('UPDATE fin_budgets SET name = ?, start_month = ?, months = ?, department_id = ?, project_id = ?, cost_centre_id = ?, alert_pct = ?, archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?')
    .bind(
      input.name ?? b.name,
      input.startMonth ?? b.start_month,
      input.months ?? b.months,
      input.departmentId !== undefined ? input.departmentId : b.department_id,
      input.projectId !== undefined ? input.projectId : b.project_id,
      input.costCentreId !== undefined ? input.costCentreId : b.cost_centre_id,
      input.alertPct ?? b.alert_pct,
      input.archived === undefined ? b.archived_at : input.archived ? now() : null,
      now(),
      b.id,
      a.orgId,
    )
    .run();
  return c.json({ ok: true });
});

planRoutes.delete('/orgs/:org/budgets/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change budgets');
  const b = await loadBudget(c, a);
  await c.env.DB.batch([c.env.DB.prepare('DELETE FROM fin_budgets WHERE id = ? AND org_id = ?').bind(b.id, a.orgId), auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'budget.deleted', targetType: 'budget', targetId: b.id, before: { name: b.name } })]);
  return c.json({ ok: true });
});

/** Replace the budget's amounts: income and expense categories only, months inside the budget. */
planRoutes.put('/orgs/:org/budgets/:id/lines', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change budgets');
  const b = await loadBudget(c, a);
  const input = await body(c, z.object({ lines: z.array(z.object({ accountId: id(), month: month(), amount: z.number().int().min(-1_000_000_000_000).max(1_000_000_000_000) })).max(5000) }));
  const chart = await chartOf(c.env.DB, a);
  const months = new Set(budgetMonths(b.start_month, b.months));
  for (const l of input.lines) {
    const acc = chart.accounts.get(l.accountId);
    if (!acc || (acc.type !== 'revenue' && acc.type !== 'expense')) throw new HttpError(400, 'Budget income and expense categories of this workspace');
    if (!months.has(l.month)) throw new HttpError(400, `${l.month} is outside the budget`);
  }
  const stmts: D1PreparedStatement[] = [c.env.DB.prepare('DELETE FROM fin_budget_lines WHERE budget_id = ? AND org_id = ?').bind(b.id, a.orgId)];
  for (const l of input.lines) if (l.amount) stmts.push(c.env.DB.prepare('INSERT INTO fin_budget_lines (org_id, budget_id, account_id, month, amount) VALUES (?, ?, ?, ?, ?)').bind(a.orgId, b.id, l.accountId, l.month, l.amount));
  stmts.push(c.env.DB.prepare('UPDATE fin_budgets SET updated_at = ? WHERE id = ?').bind(now(), b.id), auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'budget.amounts_changed', targetType: 'budget', targetId: b.id, metadata: { lines: input.lines.length } }));
  for (let i = 0; i < stmts.length; i += 300) await runBatch(c.env.DB, stmts.slice(i, i + 300));
  return c.json({ ok: true });
});

/** Fill a budget from what actually happened in the same months of an earlier year (posted entries only). */
planRoutes.post('/orgs/:org/budgets/:id/from-actuals', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change budgets');
  const b = await loadBudget(c, a);
  const { fromMonth, upliftPct } = await body(c, z.object({ fromMonth: month(), upliftPct: z.number().min(-100).max(500).optional() }));
  const target = budgetMonths(b.start_month, b.months);
  const source = budgetMonths(fromMonth, b.months);
  const end = `${source[source.length - 1]}-31`;
  const rows = await c.env.DB.prepare(
    `SELECT l.account_id, substr(j.date, 1, 7) AS m, SUM(l.debit) - SUM(l.credit) AS bal, ac.type FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id JOIN fin_accounts ac ON ac.id = l.account_id
     WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ? AND ac.type IN ('revenue','expense') GROUP BY l.account_id, m`,
  )
    .bind(a.orgId, `${fromMonth}-01`, end)
    .all<any>();
  const factor = 1 + (upliftPct ?? 0) / 100;
  const stmts: D1PreparedStatement[] = [c.env.DB.prepare('DELETE FROM fin_budget_lines WHERE budget_id = ? AND org_id = ?').bind(b.id, a.orgId)];
  for (const r of rows.results) {
    const i = source.indexOf(r.m);
    const amount = Math.round(natural(r.type, r.bal) * factor);
    if (i >= 0 && amount) stmts.push(c.env.DB.prepare('INSERT INTO fin_budget_lines (org_id, budget_id, account_id, month, amount) VALUES (?, ?, ?, ?, ?)').bind(a.orgId, b.id, r.account_id, target[i], amount));
  }
  for (let i = 0; i < stmts.length; i += 300) await runBatch(c.env.DB, stmts.slice(i, i + 300));
  return c.json({ lines: stmts.length - 1 });
});

// ------------------------------------------------------------------ savings goals

planRoutes.get('/orgs/:org/goals', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'view', 'You cannot see goals');
  const rows = await c.env.DB.prepare('SELECT * FROM fin_goals WHERE org_id = ? ORDER BY archived_at IS NOT NULL, created_at').bind(a.orgId).all<any>();
  const chart = await chartOf(c.env.DB, a);
  const bal = await accountBalances(c.env.DB, a.orgId, { accountIds: rows.results.map((g) => g.account_id).filter(Boolean) });
  return c.json(
    rows.results.map((g) => {
      const acc = g.account_id ? chart.accounts.get(g.account_id) : undefined;
      const saved = acc ? natural(acc.type, bal.get(acc.id) ?? 0) : g.saved_amount;
      return { id: g.id, name: g.name, targetAmount: g.target_amount, targetDate: g.target_date, accountId: g.account_id, saved, progressPct: Math.max(0, Math.min(100, Math.round((saved / g.target_amount) * 100))), achieved: saved >= g.target_amount, archived: !!g.archived_at };
    }),
  );
});

const goalInput = z.object({ name: text(120).min(1), targetAmount: z.number().int().min(1).max(1_000_000_000_000), targetDate: isoDate().nullable().optional(), accountId: id().nullable().optional(), savedAmount: z.number().int().min(0).max(1_000_000_000_000).optional() });

planRoutes.post('/orgs/:org/goals', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change goals');
  const input = await body(c, goalInput);
  if (input.accountId && !(await chartOf(c.env.DB, a)).accounts.has(input.accountId)) throw new HttpError(400, 'Choose an account from this workspace');
  const gid = newId();
  await c.env.DB.prepare('INSERT INTO fin_goals (id, org_id, name, target_amount, target_date, account_id, saved_amount, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(gid, a.orgId, input.name, input.targetAmount, input.targetDate ?? null, input.accountId ?? null, input.savedAmount ?? 0, a.userId, now(), now()).run();
  return c.json({ id: gid }, 201);
});

planRoutes.patch('/orgs/:org/goals/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change goals');
  const g = await c.env.DB.prepare('SELECT * FROM fin_goals WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<any>();
  if (!g) throw notFound('Goal');
  const input = await body(c, goalInput.partial().extend({ archived: z.boolean().optional() }));
  if (input.accountId && !(await chartOf(c.env.DB, a)).accounts.has(input.accountId)) throw new HttpError(400, 'Choose an account from this workspace');
  await c.env.DB.prepare('UPDATE fin_goals SET name = ?, target_amount = ?, target_date = ?, account_id = ?, saved_amount = ?, archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?')
    .bind(input.name ?? g.name, input.targetAmount ?? g.target_amount, input.targetDate !== undefined ? input.targetDate : g.target_date, input.accountId !== undefined ? input.accountId : g.account_id, input.savedAmount ?? g.saved_amount, input.archived === undefined ? g.archived_at : input.archived ? now() : null, now(), g.id, a.orgId)
    .run();
  return c.json({ ok: true });
});

planRoutes.delete('/orgs/:org/goals/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'budgets', 'manage', 'You cannot change goals');
  const r = await c.env.DB.prepare('DELETE FROM fin_goals WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).run();
  if (!r.meta.changes) throw notFound('Goal');
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ recurring

function recurringDTO(r: any) {
  return { id: r.id, kind: r.kind, name: r.name, template: parseJson(r.template_json, {}), frequency: r.frequency, nextDate: r.next_date, endDate: r.end_date, remaining: r.remaining, autoPost: !!r.auto_post, active: !!r.active, lastRunAt: r.last_run_at, lastError: r.last_error, createdBy: r.created_by };
}

const recurringInput = z.object({
  kind: z.enum(['transaction', 'invoice', 'bill']),
  name: text(120).min(1, 'Name the schedule'),
  template: z.record(z.string(), z.unknown()),
  frequency: z.enum(FREQUENCIES as [Frequency, ...Frequency[]]),
  nextDate: isoDate(),
  endDate: isoDate().nullable().optional(),
  remaining: z.number().int().min(1).max(1000).nullable().optional(),
  autoPost: z.boolean().optional(),
});

/** Check a recurring template now, so a bad one is refused when it is saved rather than at 2 am. */
async function checkTemplate(db: D1Database, a: FinAccess, kind: 'transaction' | 'invoice' | 'bill', template: Record<string, unknown>, date: string) {
  if (kind === 'transaction') {
    if (!a.perms.banking.create) deny('You cannot add transactions');
    await prepareTransaction(db, a, { ...(template as unknown as TxInput), date, action: 'draft' });
  } else {
    requireBusiness(a);
    if (!a.perms[kind === 'invoice' ? 'sales' : 'purchases'].create) deny('You cannot create these records');
    await prepareDoc(db, a, { ...(template as unknown as DocInput), kind, issueDate: date, dueDate: null }, false);
  }
}

planRoutes.get('/orgs/:org/recurring', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT * FROM fin_recurring WHERE org_id = ? ORDER BY active DESC, next_date').bind(a.orgId).all<any>();
  // Each person sees the schedules of the records they could see.
  return c.json(rows.results.filter((r) => (r.kind === 'transaction' ? a.perms.banking.view : a.perms[r.kind === 'invoice' ? 'sales' : 'purchases'].view) === 'all' || r.created_by === a.userId).map(recurringDTO));
});

planRoutes.post('/orgs/:org/recurring', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, recurringInput);
  await checkTemplate(c.env.DB, a, input.kind, input.template, input.nextDate);
  const rid = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO fin_recurring (id, org_id, kind, name, template_json, frequency, next_date, end_date, remaining, auto_post, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(rid, a.orgId, input.kind, input.name, JSON.stringify({ ...input.template, anchorDay: Number(input.nextDate.slice(8)) }), input.frequency, input.nextDate, input.endDate ?? null, input.remaining ?? null, input.autoPost ? 1 : 0, a.userId, now(), now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'recurring.created', targetType: 'recurring', targetId: rid, after: { name: input.name, kind: input.kind, frequency: input.frequency } }),
  ]);
  return c.json({ id: rid }, 201);
});

async function loadRecurring(c: any, a: FinAccess) {
  const r = await c.env.DB.prepare('SELECT * FROM fin_recurring WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first();
  if (!r) throw notFound('Recurring schedule');
  if ((r as any).created_by !== a.userId && a.role !== 'owner' && a.role !== 'admin' && !a.perms.accounting.manage) deny('Only its creator, an administrator or an accountant can change this schedule');
  return r as any;
}

planRoutes.patch('/orgs/:org/recurring/:id', async (c) => {
  const a = await requireOrg(c);
  const r = await loadRecurring(c, a);
  const input = await body(c, recurringInput.partial().omit({ kind: true }).extend({ active: z.boolean().optional() }));
  const template = input.template ?? parseJson(r.template_json, {});
  if (input.template || input.nextDate) await checkTemplate(c.env.DB, a, r.kind, template, input.nextDate ?? r.next_date);
  await c.env.DB.prepare('UPDATE fin_recurring SET name = ?, template_json = ?, frequency = ?, next_date = ?, end_date = ?, remaining = ?, auto_post = ?, active = ?, last_error = ?, updated_at = ? WHERE id = ? AND org_id = ?')
    .bind(input.name ?? r.name, JSON.stringify(template), input.frequency ?? r.frequency, input.nextDate ?? r.next_date, input.endDate !== undefined ? input.endDate : r.end_date, input.remaining !== undefined ? input.remaining : r.remaining, input.autoPost !== undefined ? (input.autoPost ? 1 : 0) : r.auto_post, input.active !== undefined ? (input.active ? 1 : 0) : r.active, input.active ? '' : r.last_error, now(), r.id, a.orgId)
    .run();
  return c.json({ ok: true });
});

planRoutes.delete('/orgs/:org/recurring/:id', async (c) => {
  const a = await requireOrg(c);
  const r = await loadRecurring(c, a);
  await c.env.DB.batch([c.env.DB.prepare('DELETE FROM fin_recurring WHERE id = ? AND org_id = ?').bind(r.id, a.orgId), auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'recurring.deleted', targetType: 'recurring', targetId: r.id })]);
  return c.json({ ok: true });
});

planRoutes.post('/orgs/:org/recurring/:id/run', async (c) => {
  const a = await requireOrg(c);
  const r = await loadRecurring(c, a);
  if (!r.active) throw new HttpError(409, 'This schedule is paused');
  return c.json(await runRecurringOnce(c.env, r, a), 201);
});

/**
 * One occurrence of a recurring schedule, created with its creator's permissions (they may have changed): the record
 * is posted or approved when the schedule says so and the person may, else it is left as a draft. The schedule then
 * moves to its next date, and stops at its end date or count.
 */
export async function runRecurringOnce(env: Env, r: any, access?: FinAccess) {
  const db = env.DB;
  let a = access;
  if (!a) {
    const user = r.created_by ? await db.prepare('SELECT id, name FROM users WHERE id = ? AND disabled_at IS NULL').bind(r.created_by).first<{ id: string; name: string }>() : null;
    if (!user) throw new HttpError(409, 'The person who set up this schedule no longer has an account');
    a = await loadAccess(db, r.org_id, user);
  }
  const template = parseJson<Record<string, unknown>>(r.template_json, {});
  const date = r.next_date as string;
  let created: { id: string; status: string };
  if (r.kind === 'transaction') created = await createTransaction(env, a, { ...(template as unknown as TxInput), date, action: r.auto_post ? 'post' : 'draft', recurringId: r.id });
  else created = await createDoc(env, a, { ...(template as unknown as DocInput), kind: r.kind, issueDate: date, dueDate: null, number: undefined, action: r.auto_post ? 'approve' : 'draft', recurringId: r.id });
  const anchor = Number(String(template.anchorDay ?? date.slice(8)));
  const next = nextDate(date, r.frequency, Number.isFinite(anchor) ? anchor : undefined);
  const remaining = r.remaining === null ? null : r.remaining - 1;
  const finished = (remaining !== null && remaining <= 0) || (r.end_date && next > r.end_date);
  await db.prepare('UPDATE fin_recurring SET next_date = ?, remaining = ?, active = ?, last_run_at = ?, last_error = ?, updated_at = ? WHERE id = ?').bind(next, remaining, finished ? 0 : 1, now(), '', now(), r.id).run();
  await finNotify(env, { orgId: a.orgId, orgName: a.org.name, userIds: [r.created_by], type: 'recurring', title: `${r.name}: ${r.kind === 'transaction' ? 'transaction' : r.kind} created for ${date}`, body: created.status === 'posted' || created.status === 'approved' ? 'Posted to the ledger.' : 'Left as a draft for you to check.', link: r.kind === 'transaction' ? `/o/${a.orgId}/transactions/${created.id}` : `/o/${a.orgId}/${r.kind === 'invoice' ? 'invoices' : 'bills'}/${created.id}`, dedupeKey: `recurring:${r.id}:${date}` });
  return { ...created, nextDate: finished ? null : next };
}

// ------------------------------------------------------------------ scheduled reports

planRoutes.get('/orgs/:org/report-schedules', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'reports', 'view', 'You cannot see reports');
  const rows = await c.env.DB.prepare('SELECT * FROM fin_report_schedules WHERE org_id = ? ORDER BY created_at').bind(a.orgId).all<any>();
  return c.json(rows.results.map((r) => ({ id: r.id, reportKey: r.report_key, params: parseJson(r.params_json, {}), frequency: r.frequency, format: r.format, nextDate: r.next_date, active: !!r.active, lastRunAt: r.last_run_at })));
});

planRoutes.post('/orgs/:org/report-schedules', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'reports', 'export', 'You cannot schedule reports');
  const input = await body(c, z.object({ reportKey: z.enum(['profit_loss', 'balance_sheet', 'cash_flow', 'trial_balance', 'income_expenses', 'budget_actual', 'aged_receivables', 'aged_payables', 'gst']), frequency: z.enum(['monthly', 'quarterly']), format: z.enum(['pdf', 'csv']).optional(), nextDate: isoDate() }));
  if (!isIsoDate(input.nextDate)) throw new HttpError(400, 'Use a valid date');
  const sid = newId();
  await c.env.DB.prepare('INSERT INTO fin_report_schedules (id, org_id, report_key, params_json, frequency, format, next_date, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(sid, a.orgId, input.reportKey, '{}', input.frequency, input.format ?? 'pdf', input.nextDate, a.userId, now()).run();
  return c.json({ id: sid }, 201);
});

planRoutes.delete('/orgs/:org/report-schedules/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'reports', 'export', 'You cannot schedule reports');
  const r = await c.env.DB.prepare('DELETE FROM fin_report_schedules WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).run();
  if (!r.meta.changes) throw notFound('Schedule');
  return c.json({ ok: true });
});
