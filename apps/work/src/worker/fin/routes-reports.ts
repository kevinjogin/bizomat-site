// Reports (on screen, CSV and PDF) and the dashboard.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { CASH_SUBTYPES } from '../../shared/fin/charts';
import { PERIODS, type PeriodKey, addDays, addMonths, endOfMonth, monthOf, period, startOfMonth, todayIn } from '../../shared/fin/dates';
import { deny, requireOrg, scopeSql } from './access';
import { chartOf, natural } from './ledger';
import { REPORTS, type ReportKey, type ReportParams, defaultParams, monthLabel, monthlySums, reportCsv, runReport, sums } from './reports';
import { reportPdf } from './pdf';
import { lineMap, txDTO } from './transactions';
import { auditStmt, csvOf } from './util';

export const reportRoutes = new Hono<AppEnv>();

const iso = (s: string | undefined) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : undefined);

reportRoutes.get('/orgs/:org/reports', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.reports.view) deny('You cannot see reports');
  const business = a.org.kind === 'business';
  const keys = (Object.keys(REPORTS) as ReportKey[]).filter((k) => (k === 'aged_receivables' || k === 'aged_payables' ? business : k === 'gst' ? a.gst : true));
  return c.json(keys.map((k) => ({ key: k, title: k === 'profit_loss' && !business ? 'Income and spending' : k === 'balance_sheet' && !business ? 'Net worth (assets and debts)' : REPORTS[k] })));
});

reportRoutes.get('/orgs/:org/reports/:key', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.reports.view) deny('You cannot see reports');
  const key = c.req.param('key') as ReportKey;
  if (!(key in REPORTS)) throw new HttpError(404, 'Unknown report');
  const q = c.req.query();
  const today = todayIn(a.org.timezone);
  const defaults = defaultParams(a, key, today);
  const p: ReportParams = {
    ...defaults,
    from: iso(q.from) ?? defaults.from,
    to: iso(q.to) ?? defaults.to,
    date: iso(q.date) ?? defaults.date,
    compare: q.compare === 'previous_period' || q.compare === 'previous_year' || q.compare === 'months' ? q.compare : 'none',
    account: q.account || undefined,
    department: q.department || undefined,
    project: q.project || undefined,
    costCentre: q.costCentre || undefined,
    person: q.person || undefined,
    budget: q.budget || undefined,
    basis: q.basis === 'cash' || q.basis === 'accrual' ? q.basis : undefined,
    weeks: q.weeks ? Number(q.weeks) : undefined,
  };
  const report = await runReport(c.env.DB, a, key, p, today);
  const format = q.format;
  if (format === 'csv' || format === 'pdf') {
    if (!a.perms.reports.export) deny('You cannot export reports');
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'report.exported', targetType: 'report', targetId: key, metadata: { format, ...p } }).run();
    const name = `${report.title.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}`;
    if (format === 'csv') return new Response(csvOf(reportCsv(report)), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}.csv"` } });
    const pdf = await reportPdf(report, { name: a.org.name, currency: a.org.currency });
    return new Response(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${name}.pdf"`, 'Cache-Control': 'private, no-store' } });
  }
  return c.json({ ...report, params: p });
});

// ------------------------------------------------------------------ dashboard

reportRoutes.get('/orgs/:org/dashboard', async (c) => {
  const a = await requireOrg(c);
  const db = c.env.DB;
  const today = todayIn(a.org.timezone);
  const periodKey = (c.req.query('period') as PeriodKey) in PERIODS ? (c.req.query('period') as PeriodKey) : a.org.kind === 'business' ? 'this_fy' : 'this_month';
  const range = period(periodKey, today, a.org.fy_start_month);
  const business = a.org.kind === 'business';

  // Recent transactions the person may see.
  let recent: unknown[] = [];
  if (a.perms.banking.view !== 'none') {
    const scope = scopeSql(a, 'banking', 't');
    const rows = await db.prepare(`SELECT t.*, ct.name AS contact_name FROM fin_transactions t LEFT JOIN fin_contacts ct ON ct.id = t.contact_id WHERE t.org_id = ? AND t.deleted_at IS NULL AND ${scope.sql} ORDER BY t.date DESC, t.created_at DESC LIMIT 8`).bind(a.orgId, ...scope.args).all<any>();
    const lines = await lineMap(db, a.orgId, rows.results.map((r) => r.id));
    recent = rows.results.map((r) => txDTO(a, r, lines.get(r.id) ?? []));
  }
  const approvals = { transactions: 0, documents: 0 };
  if (a.perms.banking.approve) approvals.transactions = (await db.prepare("SELECT COUNT(*) AS n FROM fin_transactions WHERE org_id = ? AND status = 'submitted' AND deleted_at IS NULL").bind(a.orgId).first<{ n: number }>())?.n ?? 0;
  if (business && (a.perms.sales.approve || a.perms.purchases.approve)) approvals.documents = (await db.prepare("SELECT COUNT(*) AS n FROM fin_docs WHERE org_id = ? AND status = 'submitted' AND deleted_at IS NULL").bind(a.orgId).first<{ n: number }>())?.n ?? 0;
  if (!a.perms.reports.view) return c.json({ limited: true, period: { key: periodKey, ...range }, recent, approvals });

  const chart = await chartOf(db, a);
  const accounts = [...chart.accounts.values()];
  const [periodSums, balances] = await Promise.all([sums(db, a.orgId, range.from, range.to), sums(db, a.orgId, null, today)]);
  let income = 0;
  let expenses = 0;
  const byCategory = new Map<string, number>();
  for (const acc of accounts) {
    const v = periodSums.get(acc.id) ?? 0;
    if (acc.type === 'revenue') income -= v;
    if (acc.type === 'expense') {
      expenses += v;
      const top = acc.parent_id ? (chart.accounts.get(acc.parent_id) ?? acc) : acc;
      if (v) byCategory.set(top.name, (byCategory.get(top.name) ?? 0) + v);
    }
  }
  const moneyAccounts = accounts.filter((x) => ['bank', 'cash', 'credit_card', 'loan'].includes(x.subtype) && !x.archived_at).map((x) => ({ id: x.id, name: x.name, subtype: x.subtype, balance: natural(x.type, balances.get(x.id) ?? 0) }));
  const cash = moneyAccounts.filter((x) => CASH_SUBTYPES.includes(x.subtype)).reduce((n, x) => n + x.balance, 0);
  const debt = moneyAccounts.filter((x) => !CASH_SUBTYPES.includes(x.subtype)).reduce((n, x) => n + x.balance, 0);

  // Twelve months of income and expenses, and the cash balance at each month's end.
  const firstMonth = addMonths(startOfMonth(today), -11);
  const monthly = await monthlySums(db, a.orgId, firstMonth, endOfMonth(today));
  const cashIds = new Set(accounts.filter((x) => CASH_SUBTYPES.includes(x.subtype)).map((x) => x.id));
  const before = await sums(db, a.orgId, null, addDays(firstMonth, -1));
  let running = [...cashIds].reduce((n, id) => n + (before.get(id) ?? 0), 0);
  const trend: { month: string; label: string; income: number; expenses: number; cash: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const m = monthOf(addMonths(firstMonth, i));
    let inc = 0;
    let exp = 0;
    for (const [id, v] of monthly.get(m) ?? []) {
      const acc = chart.accounts.get(id);
      if (acc?.type === 'revenue') inc -= v;
      else if (acc?.type === 'expense') exp += v;
      if (cashIds.has(id)) running += v;
    }
    trend.push({ month: m, label: monthLabel(m).slice(0, 3), income: inc, expenses: exp, cash: running });
  }

  let receivables = null;
  let payables = null;
  const upcoming: { kind: string; id: string; title: string; date: string; amount: number; direction: 'in' | 'out'; overdue: boolean }[] = [];
  if (business) {
    const docs = await db.prepare("SELECT d.id, d.kind, d.number, d.due_date, d.total - d.amount_paid AS due, ct.name AS contact FROM fin_docs d LEFT JOIN fin_contacts ct ON ct.id = d.contact_id WHERE d.org_id = ? AND d.deleted_at IS NULL AND d.status IN ('approved','part_paid') AND d.kind IN ('invoice','bill','expense_claim')").bind(a.orgId).all<any>();
    const agg = (kinds: string[]) => {
      const list = docs.results.filter((d) => kinds.includes(d.kind));
      const overdue = list.filter((d) => d.due_date && d.due_date < today);
      return { count: list.length, amount: list.reduce((n, d) => n + d.due, 0), overdueCount: overdue.length, overdueAmount: overdue.reduce((n, d) => n + d.due, 0) };
    };
    receivables = agg(['invoice']);
    payables = agg(['bill', 'expense_claim']);
    const horizon = addDays(today, 14);
    for (const d of docs.results.filter((x) => x.due_date && x.due_date <= horizon).sort((x, y) => (x.due_date < y.due_date ? -1 : 1)).slice(0, 12)) {
      upcoming.push({ kind: d.kind, id: d.id, title: `${d.number}${d.contact ? `, ${d.contact}` : ''}`, date: d.due_date, amount: d.due, direction: d.kind === 'invoice' ? 'in' : 'out', overdue: d.due_date < today });
    }
  }
  const rec = await db.prepare("SELECT id, kind, name, next_date, template_json FROM fin_recurring WHERE org_id = ? AND active = 1 AND next_date <= ? ORDER BY next_date LIMIT 8").bind(a.orgId, addDays(today, 14)).all<any>();
  for (const r of rec.results) {
    const t = JSON.parse(r.template_json || '{}');
    const amount = r.kind === 'transaction' ? (t.kind === 'transfer' ? Number(t.amount) || 0 : (t.lines ?? []).reduce((n: number, l: any) => n + (Number(l.amount) || 0), 0)) : 0;
    upcoming.push({ kind: 'recurring', id: r.id, title: r.name, date: r.next_date, amount, direction: r.kind === 'invoice' || t.kind === 'receive' ? 'in' : 'out', overdue: false });
  }
  upcoming.sort((x, y) => (x.date < y.date ? -1 : 1));

  // Budget performance: the first budget covering this month.
  let budget = null;
  if (a.perms.budgets.view) {
    const b = await db.prepare("SELECT * FROM fin_budgets WHERE org_id = ? AND archived_at IS NULL AND start_month <= ? ORDER BY start_month DESC LIMIT 5").bind(a.orgId, monthOf(today)).all<any>();
    const cur = b.results.find((x) => monthOf(addMonths(`${x.start_month}-01`, x.months - 1)) >= monthOf(today));
    if (cur) {
      const lines = await db.prepare('SELECT bl.account_id, bl.month, bl.amount, ac.type FROM fin_budget_lines bl JOIN fin_accounts ac ON ac.id = bl.account_id WHERE bl.budget_id = ? AND bl.org_id = ?').bind(cur.id, a.orgId).all<any>();
      const month = monthOf(today);
      const ytdFrom = `${cur.start_month}-01`;
      const filters = { department: cur.department_id ?? undefined, project: cur.project_id ?? undefined, costCentre: cur.cost_centre_id ?? undefined };
      const [mtd, ytd] = await Promise.all([sums(db, a.orgId, `${month}-01`, today, filters), sums(db, a.orgId, ytdFrom, today, filters)]);
      const spend = (s: Map<string, number>) => accounts.filter((x) => x.type === 'expense').reduce((n, x) => n + (s.get(x.id) ?? 0), 0);
      budget = {
        id: cur.id,
        name: cur.name,
        monthBudget: lines.results.filter((l) => l.type === 'expense' && l.month === month).reduce((n, l) => n + l.amount, 0),
        monthActual: spend(mtd),
        yearBudget: lines.results.filter((l) => l.type === 'expense' && l.month <= month).reduce((n, l) => n + l.amount, 0),
        yearActual: spend(ytd),
      };
    }
  }

  let goals: unknown[] = [];
  if (!business && a.perms.budgets.view) {
    const g = await db.prepare('SELECT * FROM fin_goals WHERE org_id = ? AND archived_at IS NULL ORDER BY created_at LIMIT 4').bind(a.orgId).all<any>();
    goals = g.results.map((x) => {
      const acc = x.account_id ? chart.accounts.get(x.account_id) : undefined;
      const saved = acc ? natural(acc.type, balances.get(acc.id) ?? 0) : x.saved_amount;
      return { id: x.id, name: x.name, targetAmount: x.target_amount, saved, progressPct: Math.max(0, Math.min(100, Math.round((saved / x.target_amount) * 100))) };
    });
  }

  const unmatched = a.perms.banking.view === 'all' ? ((await db.prepare("SELECT COUNT(*) AS n FROM fin_statement_lines WHERE org_id = ? AND status = 'unmatched'").bind(a.orgId).first<{ n: number }>())?.n ?? 0) : 0;
  return c.json({
    limited: false,
    period: { key: periodKey, ...range },
    income,
    expenses,
    net: income - expenses,
    cash,
    debt,
    moneyAccounts,
    receivables,
    payables,
    budget,
    upcoming: upcoming.slice(0, 12),
    recent,
    approvals,
    unmatched,
    goals,
    trend,
    spending: [...byCategory.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8).map(([label, value]) => ({ label, value })),
  });
});
