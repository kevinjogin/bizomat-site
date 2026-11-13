// BIZOMAT Finance reports, all computed from posted journal lines when asked for: nothing is stored or typed in. The
// balance sheet balances because the ledger does: retained and current-year earnings are worked out from income and
// expense lines rather than closing entries. Each report returns one table shape that the screen, CSV and PDF share.

import { HttpError, parseJson, placeholders } from '../lib/util';
import { SUBTYPES, CASH_SUBTYPES } from '../../shared/fin/charts';
import { addDays, addMonths, daysBetween, endOfMonth, fyStart, monthOf, monthsBetween, nextDate, startOfMonth } from '../../shared/fin/dates';
import { BAS_LABELS, BAS_ORDER, SIMPLER_BAS, basOf, type BasLabel } from '../../shared/fin/tax';
import type { FinAccess } from './access';
import { type AccountRow, chartOf, natural } from './ledger';
import type { ReportTable } from './pdf';

export interface ReportRow {
  cells: (string | number | null)[];
  style?: 'heading' | 'total' | 'subtotal' | 'normal';
  indent?: number;
  accountId?: string;
}

export interface Report extends ReportTable {
  key: string;
  rows: ReportRow[];
  chart?: { kind: 'bar' | 'line' | 'donut'; series: { label: string; value: number }[]; compare?: { label: string; value: number }[] };
  summary?: Record<string, number | string | boolean | null>;
}

export const REPORTS = {
  profit_loss: 'Profit and loss',
  balance_sheet: 'Balance sheet',
  cash_flow: 'Cash flow statement',
  general_ledger: 'General ledger',
  trial_balance: 'Trial balance',
  account_transactions: 'Account transactions',
  income_expenses: 'Income and expenses by month',
  budget_actual: 'Budget against actual',
  cash_forecast: 'Cash flow forecast',
  aged_receivables: 'Aged receivables',
  aged_payables: 'Aged payables',
  gst: 'GST and BAS worksheet',
} as const;
export type ReportKey = keyof typeof REPORTS;

export interface ReportParams {
  from?: string;
  to?: string;
  date?: string;
  compare?: 'none' | 'previous_period' | 'previous_year' | 'months';
  account?: string;
  department?: string;
  project?: string;
  costCentre?: string;
  person?: string;
  budget?: string;
  basis?: 'cash' | 'accrual';
  weeks?: number;
}

interface Filters {
  department?: string;
  project?: string;
  costCentre?: string;
  person?: string;
}

function filterSql(f: Filters) {
  const where: string[] = [];
  const args: unknown[] = [];
  if (f.department) {
    where.push('l.department_id = ?');
    args.push(f.department);
  }
  if (f.project) {
    where.push('l.project_id = ?');
    args.push(f.project);
  }
  if (f.costCentre) {
    where.push('l.cost_centre_id = ?');
    args.push(f.costCentre);
  }
  if (f.person) {
    where.push('l.person_id = ?');
    args.push(f.person);
  }
  return { sql: where.length ? ` AND ${where.join(' AND ')}` : '', args };
}

/** Debit-minus-credit per account for posted journals between two dates (either may be open). */
export async function sums(db: D1Database, orgId: string, from: string | null, to: string | null, f: Filters = {}): Promise<Map<string, number>> {
  const ff = filterSql(f);
  const rows = await db
    .prepare(`SELECT l.account_id, SUM(l.debit) - SUM(l.credit) AS bal FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ?${ff.sql} GROUP BY l.account_id`)
    .bind(orgId, from ?? '0000-01-01', to ?? '9999-12-31', ...ff.args)
    .all<{ account_id: string; bal: number }>();
  return new Map(rows.results.map((r) => [r.account_id, r.bal]));
}

/** The same per month ('YYYY-MM' -> account -> debit-minus-credit). */
export async function monthlySums(db: D1Database, orgId: string, from: string, to: string, f: Filters = {}): Promise<Map<string, Map<string, number>>> {
  const ff = filterSql(f);
  const rows = await db
    .prepare(`SELECT substr(j.date, 1, 7) AS m, l.account_id, SUM(l.debit) - SUM(l.credit) AS bal FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ?${ff.sql} GROUP BY m, l.account_id`)
    .bind(orgId, from, to, ...ff.args)
    .all<{ m: string; account_id: string; bal: number }>();
  const out = new Map<string, Map<string, number>>();
  for (const r of rows.results) {
    const m = out.get(r.m) ?? new Map<string, number>();
    m.set(r.account_id, r.bal);
    out.set(r.m, m);
  }
  return out;
}

const SECTIONS_PL: { title: string; subtypes: string[]; sign: 1 | -1 }[] = [
  { title: 'Income', subtypes: ['revenue'], sign: 1 },
  { title: 'Cost of goods sold', subtypes: ['direct_cost'], sign: -1 },
  { title: 'Other income', subtypes: ['other_income'], sign: 1 },
  { title: 'Operating expenses', subtypes: ['expense'], sign: -1 },
  { title: 'Other expenses', subtypes: ['other_expense'], sign: -1 },
];

function ordered(accounts: AccountRow[]): AccountRow[] {
  return [...accounts].sort((x, y) => x.position - y.position || x.code.localeCompare(y.code));
}

/** Rows for a set of accounts, children indented under their parent with the parent's total. */
function accountRows(accounts: AccountRow[], value: (acc: AccountRow) => number[], hideZero = true): { rows: ReportRow[]; totals: number[] } {
  const ids = new Set(accounts.map((a) => a.id));
  const tops = ordered(accounts.filter((a) => !a.parent_id || !ids.has(a.parent_id)));
  const rows: ReportRow[] = [];
  let totals: number[] = [];
  const add = (t: number[], v: number[]) => v.map((x, i) => x + (t[i] ?? 0));
  for (const top of tops) {
    const kids = ordered(accounts.filter((a) => a.parent_id === top.id));
    const own = value(top);
    const kidVals = kids.map((k) => ({ k, v: value(k) }));
    const groupTotal = kidVals.reduce((t, x) => add(t, x.v), own);
    const nonZero = (v: number[]) => v.some((x) => x !== 0);
    if (hideZero && !nonZero(groupTotal)) continue;
    totals = add(totals, groupTotal);
    if (!kids.length || !kidVals.some((x) => nonZero(x.v))) {
      rows.push({ cells: [label(top), ...own], indent: 1, accountId: top.id });
      continue;
    }
    rows.push({ cells: [label(top), ...groupTotal.map(() => null)], indent: 1, accountId: top.id, style: 'normal' });
    for (const { k, v } of kidVals) if (!hideZero || nonZero(v)) rows.push({ cells: [label(k), ...v], indent: 2, accountId: k.id });
    if (nonZero(own)) rows.push({ cells: [`${top.name} (other)`, ...own], indent: 2, accountId: top.id });
    rows.push({ cells: [`Total ${top.name.toLowerCase()}`, ...groupTotal], indent: 1, style: 'subtotal' });
  }
  return { rows, totals };
}

const label = (a: AccountRow) => (a.code && !/^\d{4}$/.test(a.code) ? `${a.code} ${a.name}` : a.name);

function periodCols(p: ReportParams, from: string, to: string): { label: string; from: string; to: string }[] {
  const fmt = (f: string, t: string) => `${shortDate(f)} to ${shortDate(t)}`;
  if (p.compare === 'months') {
    const months = monthsBetween(from, to).slice(-12);
    return months.map((m) => ({ label: monthLabel(m), from: `${m}-01` < from ? from : `${m}-01`, to: endOfMonth(`${m}-01`) > to ? to : endOfMonth(`${m}-01`) }));
  }
  const cols = [{ label: fmt(from, to), from, to }];
  if (p.compare === 'previous_period') {
    const days = daysBetween(from, to) + 1;
    const pt = addDays(from, -1);
    cols.push({ label: fmt(addDays(pt, -(days - 1)), pt), from: addDays(pt, -(days - 1)), to: pt });
  } else if (p.compare === 'previous_year') cols.push({ label: fmt(addMonths(from, -12), addMonths(to, -12)), from: addMonths(from, -12), to: addMonths(to, -12) });
  return cols;
}

export function monthLabel(m: string): string {
  const [y, mo] = m.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString('en-AU', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function shortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function need(p: ReportParams, ...keys: (keyof ReportParams)[]) {
  for (const k of keys) if (!p[k]) throw new HttpError(400, `Choose ${k === 'from' ? 'a start date' : k === 'to' ? 'an end date' : k === 'date' ? 'a date' : k === 'account' ? 'an account' : k === 'budget' ? 'a budget' : k}`);
}

// ------------------------------------------------------------------ profit and loss

export async function profitLoss(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'from', 'to');
  const chart = await chartOf(db, a);
  const cols = periodCols(p, p.from!, p.to!);
  const data = await Promise.all(cols.map((c) => sums(db, a.orgId, c.from, c.to, p)));
  const all = [...chart.accounts.values()];
  const rows: ReportRow[] = [];
  const sectionTotals: Record<string, number[]> = {};
  for (const s of SECTIONS_PL) {
    const accs = all.filter((x) => s.subtypes.includes(x.subtype));
    const { rows: r, totals } = accountRows(accs, (acc) => data.map((d) => natural(acc.type, d.get(acc.id) ?? 0)));
    sectionTotals[s.title] = cols.map((_, i) => totals[i] ?? 0);
    if (!r.length) continue;
    rows.push({ cells: [s.title, ...cols.map(() => null)], style: 'heading' }, ...r, { cells: [`Total ${s.title.toLowerCase()}`, ...sectionTotals[s.title]], style: 'subtotal' });
    if (s.title === 'Cost of goods sold') rows.push({ cells: ['Gross profit', ...cols.map((_, i) => sectionTotals.Income[i] - sectionTotals['Cost of goods sold'][i])], style: 'total' });
  }
  const net = cols.map((_, i) => (sectionTotals.Income[i] ?? 0) - (sectionTotals['Cost of goods sold'][i] ?? 0) + (sectionTotals['Other income'][i] ?? 0) - (sectionTotals['Operating expenses'][i] ?? 0) - (sectionTotals['Other expenses'][i] ?? 0));
  rows.push({ cells: [a.org.kind === 'business' ? 'Net profit' : 'Net surplus (income less spending)', ...net], style: 'total' });
  const expenseAccs = all.filter((x) => x.type === 'expense');
  const byCategory = new Map<string, number>();
  for (const acc of expenseAccs) {
    const top = acc.parent_id ? (chart.accounts.get(acc.parent_id) ?? acc) : acc;
    const v = natural(acc.type, data[0].get(acc.id) ?? 0);
    if (v) byCategory.set(top.name, (byCategory.get(top.name) ?? 0) + v);
  }
  return {
    key: 'profit_loss',
    title: a.org.kind === 'business' ? REPORTS.profit_loss : 'Income and spending',
    subtitle: filterLabel(a, p, `${shortDate(p.from!)} to ${shortDate(p.to!)}`),
    columns: [{ label: 'Account' }, ...cols.map((c) => ({ label: c.label, align: 'right' as const }))],
    rows,
    chart: { kind: 'donut', series: [...byCategory.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8).map(([label, value]) => ({ label, value })) },
    summary: { income: (sectionTotals.Income[0] ?? 0) + (sectionTotals['Other income'][0] ?? 0), expenses: (sectionTotals['Cost of goods sold'][0] ?? 0) + (sectionTotals['Operating expenses'][0] ?? 0) + (sectionTotals['Other expenses'][0] ?? 0), net: net[0] },
  };
}

function filterLabel(a: FinAccess, p: ReportParams, base: string): string {
  const parts = [base];
  if (p.department || p.project || p.costCentre) parts.push('filtered by tracking');
  if (p.person) parts.push('one person');
  return `${a.org.name}: ${parts.join(', ')}`;
}

// ------------------------------------------------------------------ balance sheet

/** Income less expenses between two dates (natural: positive is a profit). */
async function earnings(db: D1Database, a: FinAccess, from: string | null, to: string): Promise<number> {
  const r = await db
    .prepare(`SELECT COALESCE(SUM(l.credit) - SUM(l.debit), 0) AS v FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id JOIN fin_accounts ac ON ac.id = l.account_id WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ? AND ac.type IN ('revenue','expense')`)
    .bind(a.orgId, from ?? '0000-01-01', to)
    .first<{ v: number }>();
  return r?.v ?? 0;
}

export async function balanceSheet(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'date');
  const chart = await chartOf(db, a);
  const dates = [p.date!, ...(p.compare === 'previous_year' ? [addMonths(p.date!, -12)] : [])];
  const data = await Promise.all(dates.map((d) => sums(db, a.orgId, null, d)));
  const all = [...chart.accounts.values()];
  const rows: ReportRow[] = [];
  const groups = (type: 'asset' | 'liability'): { title: string; subtypes: string[] }[] =>
    type === 'asset'
      ? [
          { title: 'Bank and cash', subtypes: ['bank', 'cash'] },
          { title: 'Current assets', subtypes: ['receivable', 'current_asset'] },
          { title: 'Fixed assets', subtypes: ['fixed_asset'] },
          { title: 'Investments', subtypes: ['investment'] },
        ]
      : [
          { title: 'Current liabilities', subtypes: ['credit_card', 'payable', 'tax', 'current_liability'] },
          { title: 'Non-current liabilities', subtypes: ['loan', 'non_current_liability'] },
        ];
  const totals: Record<string, number[]> = {};
  for (const type of ['asset', 'liability'] as const) {
    rows.push({ cells: [type === 'asset' ? 'Assets' : 'Liabilities', ...dates.map(() => null)], style: 'heading' });
    let t = dates.map(() => 0);
    for (const g of groups(type)) {
      const accs = all.filter((x) => g.subtypes.includes(x.subtype));
      const r = accountRows(accs, (acc) => data.map((d) => natural(acc.type, d.get(acc.id) ?? 0)));
      if (!r.rows.length) continue;
      const gt = dates.map((_, i) => r.totals[i] ?? 0);
      rows.push({ cells: [g.title, ...dates.map(() => null)], style: 'normal' }, ...r.rows, { cells: [`Total ${g.title.toLowerCase()}`, ...gt], style: 'subtotal' });
      t = t.map((x, i) => x + gt[i]);
    }
    totals[type] = t;
    rows.push({ cells: [`Total ${type === 'asset' ? 'assets' : 'liabilities'}`, ...t], style: 'total' });
  }
  const netAssets = dates.map((_, i) => totals.asset[i] - totals.liability[i]);
  rows.push({ cells: [a.org.kind === 'business' ? 'Net assets' : 'Net worth', ...netAssets], style: 'total' });
  // Equity: accounts, retained earnings (to the start of the year) and the current year's earnings.
  rows.push({ cells: ['Equity', ...dates.map(() => null)], style: 'heading' });
  const eqAccs = all.filter((x) => x.type === 'equity' && x.system_key !== 'retained');
  const eq = accountRows(eqAccs, (acc) => data.map((d) => natural(acc.type, d.get(acc.id) ?? 0)));
  rows.push(...eq.rows);
  const retainedAcc = chart.system.get('retained');
  const retained: number[] = [];
  const current: number[] = [];
  for (let i = 0; i < dates.length; i++) {
    const fy = fyStart(dates[i], a.org.fy_start_month);
    const prior = await earnings(db, a, null, addDays(fy, -1));
    retained.push(prior + (retainedAcc ? natural('equity', data[i].get(retainedAcc.id) ?? 0) : 0));
    current.push(await earnings(db, a, fy, dates[i]));
  }
  rows.push({ cells: ['Retained earnings', ...retained], indent: 1 }, { cells: ['Current year earnings', ...current], indent: 1 });
  const equity = dates.map((_, i) => (eq.totals[i] ?? 0) + retained[i] + current[i]);
  rows.push({ cells: ['Total equity', ...equity], style: 'total' });
  return {
    key: 'balance_sheet',
    title: a.org.kind === 'business' ? REPORTS.balance_sheet : 'Net worth (assets and debts)',
    subtitle: `${a.org.name}: as at ${shortDate(p.date!)}`,
    columns: [{ label: 'Account' }, ...dates.map((d) => ({ label: shortDate(d), align: 'right' as const }))],
    rows,
    summary: { assets: totals.asset[0], liabilities: totals.liability[0], netAssets: netAssets[0], equity: equity[0], balanced: netAssets[0] === equity[0] },
  };
}

// ------------------------------------------------------------------ cash flow statement (direct method)

export async function cashFlow(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'from', 'to');
  const chart = await chartOf(db, a);
  const isCash = (id: string) => CASH_SUBTYPES.includes(chart.accounts.get(id)?.subtype ?? '');
  const cashIds = [...chart.accounts.values()].filter((x) => isCash(x.id)).map((x) => x.id);
  const lines = cashIds.length
    ? await db
        .prepare(
          `SELECT l.journal_id, l.account_id, l.debit - l.credit AS amt FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id
           WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ?
             AND l.journal_id IN (SELECT x.journal_id FROM fin_journal_lines x WHERE x.org_id = ? AND x.account_id IN (${placeholders(cashIds.length)}))`,
        )
        .bind(a.orgId, p.from, p.to, a.orgId, ...cashIds)
        .all<{ journal_id: string; account_id: string; amt: number }>()
    : { results: [] };
  // Each journal's change in cash is attributed to its other lines: what the money was for.
  const byAccount = new Map<string, number>();
  for (const l of lines.results) if (!isCash(l.account_id)) byAccount.set(l.account_id, (byAccount.get(l.account_id) ?? 0) - l.amt);
  const rows: ReportRow[] = [];
  let net = 0;
  for (const cls of ['operating', 'investing', 'financing'] as const) {
    const accs = [...byAccount.entries()].filter(([id]) => SUBTYPES[chart.accounts.get(id)!.subtype].cashflow === cls).sort((x, y) => (chart.accounts.get(x[0])!.code > chart.accounts.get(y[0])!.code ? 1 : -1));
    const total = accs.reduce((n, [, v]) => n + v, 0);
    net += total;
    if (!accs.length) continue;
    rows.push({ cells: [`${cls[0].toUpperCase()}${cls.slice(1)} activities`, null], style: 'heading' });
    for (const [id, v] of accs) rows.push({ cells: [label(chart.accounts.get(id)!), v], indent: 1, accountId: id });
    rows.push({ cells: [`Net cash from ${cls} activities`, total], style: 'subtotal' });
  }
  const opening = await sums(db, a.orgId, null, addDays(p.from!, -1));
  const closing = await sums(db, a.orgId, null, p.to!);
  const open = cashIds.reduce((n, id) => n + (opening.get(id) ?? 0), 0);
  const close = cashIds.reduce((n, id) => n + (closing.get(id) ?? 0), 0);
  rows.push({ cells: ['Net change in cash', net], style: 'total' }, { cells: ['Cash at the start', open] }, { cells: ['Cash at the end', close], style: 'total' });
  return {
    key: 'cash_flow',
    title: REPORTS.cash_flow,
    subtitle: `${a.org.name}: ${shortDate(p.from!)} to ${shortDate(p.to!)}. Cash is bank and cash accounts.`,
    columns: [{ label: 'Item' }, { label: 'Amount', align: 'right' }],
    rows,
    summary: { opening: open, closing: close, net, reconciles: open + net === close },
  };
}

// ------------------------------------------------------------------ trial balance

export async function trialBalance(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'date');
  const chart = await chartOf(db, a);
  const fy = fyStart(p.date!, a.org.fy_start_month);
  const balanceSheetSums = await sums(db, a.orgId, null, p.date!);
  const yearSums = await sums(db, a.orgId, fy, p.date!);
  const prior = await earnings(db, a, null, addDays(fy, -1));
  const rows: ReportRow[] = [];
  let dr = 0;
  let cr = 0;
  const push = (name: string, bal: number, accountId?: string) => {
    if (!bal) return;
    rows.push({ cells: [name, bal > 0 ? bal : null, bal < 0 ? -bal : null], accountId });
    if (bal > 0) dr += bal;
    else cr -= bal;
  };
  for (const acc of ordered([...chart.accounts.values()]).sort((x, y) => ['asset', 'liability', 'equity', 'revenue', 'expense'].indexOf(x.type) - ['asset', 'liability', 'equity', 'revenue', 'expense'].indexOf(y.type))) {
    const pl = acc.type === 'revenue' || acc.type === 'expense';
    let bal = pl ? (yearSums.get(acc.id) ?? 0) : (balanceSheetSums.get(acc.id) ?? 0);
    if (acc.system_key === 'retained') bal -= prior; // earlier years' profit (a credit) belongs in retained earnings
    push(label(acc), bal, acc.id);
  }
  if (!chart.system.get('retained') && prior) push('Retained earnings', -prior);
  rows.push({ cells: ['Total', dr, cr], style: 'total' });
  return {
    key: 'trial_balance',
    title: REPORTS.trial_balance,
    subtitle: `${a.org.name}: as at ${shortDate(p.date!)}. Income and expenses from ${shortDate(fy)}.`,
    columns: [{ label: 'Account' }, { label: 'Debit', align: 'right' }, { label: 'Credit', align: 'right' }],
    rows,
    summary: { debits: dr, credits: cr, balanced: dr === cr },
  };
}

// ------------------------------------------------------------------ ledger and account transactions

async function ledgerLines(db: D1Database, a: FinAccess, from: string, to: string, accountIds: string[] | null, f: Filters = {}) {
  const ff = filterSql(f);
  const accSql = accountIds ? ` AND l.account_id IN (${placeholders(accountIds.length)})` : '';
  return db
    .prepare(
      `SELECT l.account_id, l.debit, l.credit, l.description, j.date, j.number, j.memo, j.source_type, j.source_id, ct.name AS contact FROM fin_journal_lines l
       JOIN fin_journals j ON j.id = l.journal_id LEFT JOIN fin_contacts ct ON ct.id = l.contact_id
       WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ?${accSql}${ff.sql} ORDER BY j.date, j.number, l.line_no LIMIT 20000`,
    )
    .bind(a.orgId, from, to, ...(accountIds ?? []), ...ff.args)
    .all<any>();
}

export async function generalLedger(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'from', 'to');
  const chart = await chartOf(db, a);
  const ids = p.account ? [p.account] : null;
  if (p.account && !chart.accounts.has(p.account)) throw new HttpError(400, 'Choose an account from this workspace');
  const [lines, opening] = await Promise.all([ledgerLines(db, a, p.from!, p.to!, ids, p), sums(db, a.orgId, null, addDays(p.from!, -1), p)]);
  const rows: ReportRow[] = [];
  const accounts = ordered([...chart.accounts.values()]).filter((acc) => !ids || ids.includes(acc.id));
  for (const acc of accounts) {
    const pl = acc.type === 'revenue' || acc.type === 'expense';
    const open = pl ? 0 : (opening.get(acc.id) ?? 0);
    const mine = lines.results.filter((l) => l.account_id === acc.id);
    if (!mine.length && !open) continue;
    rows.push({ cells: [label(acc), null, null, null, null, null], style: 'heading', accountId: acc.id });
    let bal = open;
    rows.push({ cells: ['Opening balance', '', '', null, null, natural(acc.type, bal)], indent: 1 });
    for (const l of mine) {
      bal += l.debit - l.credit;
      rows.push({ cells: [l.description || l.memo || '', l.date, `${l.number}`, l.debit || null, l.credit || null, natural(acc.type, bal)], indent: 1 });
    }
    rows.push({ cells: ['Closing balance', '', '', mine.reduce((n, l) => n + l.debit, 0), mine.reduce((n, l) => n + l.credit, 0), natural(acc.type, bal)], style: 'subtotal' });
  }
  return {
    key: 'general_ledger',
    title: p.account ? `${REPORTS.account_transactions}: ${chart.accounts.get(p.account)!.name}` : REPORTS.general_ledger,
    subtitle: filterLabel(a, p, `${shortDate(p.from!)} to ${shortDate(p.to!)}`),
    columns: [{ label: 'Description' }, { label: 'Date', align: 'left' }, { label: 'Journal', align: 'left' }, { label: 'Debit', align: 'right' }, { label: 'Credit', align: 'right' }, { label: 'Balance', align: 'right' }],
    rows,
    notes: lines.results.length >= 20000 ? ['Only the first 20,000 lines are shown: choose a shorter period or one account.'] : undefined,
  };
}

// ------------------------------------------------------------------ income and expenses by month

export async function incomeExpenses(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'from', 'to');
  const chart = await chartOf(db, a);
  const months = monthsBetween(p.from!, p.to!).slice(-24);
  const data = await monthlySums(db, a.orgId, p.from!, p.to!, p);
  const rows: ReportRow[] = [];
  const series: { label: string; value: number }[] = [];
  const compare: { label: string; value: number }[] = [];
  let ti = 0;
  let te = 0;
  for (const m of months) {
    let inc = 0;
    let exp = 0;
    for (const [id, v] of data.get(m) ?? []) {
      const acc = chart.accounts.get(id);
      if (acc?.type === 'revenue') inc -= v;
      else if (acc?.type === 'expense') exp += v;
    }
    ti += inc;
    te += exp;
    rows.push({ cells: [monthLabel(m), inc, exp, inc - exp, inc ? `${Math.round(((inc - exp) / inc) * 100)}%` : ''] });
    series.push({ label: monthLabel(m).slice(0, 3), value: inc });
    compare.push({ label: monthLabel(m).slice(0, 3), value: exp });
  }
  rows.push({ cells: ['Total', ti, te, ti - te, ti ? `${Math.round(((ti - te) / ti) * 100)}%` : ''], style: 'total' });
  return {
    key: 'income_expenses',
    title: REPORTS.income_expenses,
    subtitle: filterLabel(a, p, `${shortDate(p.from!)} to ${shortDate(p.to!)}`),
    columns: [{ label: 'Month' }, { label: 'Income', align: 'right' }, { label: 'Expenses', align: 'right' }, { label: 'Net', align: 'right' }, { label: 'Kept', align: 'right' }],
    rows,
    chart: { kind: 'bar', series, compare },
    summary: { income: ti, expenses: te, net: ti - te },
  };
}

// ------------------------------------------------------------------ budget against actual

export async function budgetActual(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'budget');
  const b = await db.prepare('SELECT * FROM fin_budgets WHERE id = ? AND org_id = ?').bind(p.budget, a.orgId).first<any>();
  if (!b) throw new HttpError(404, 'Budget not found');
  const chart = await chartOf(db, a);
  const all = Array.from({ length: b.months }, (_, i) => monthOf(addMonths(`${b.start_month}-01`, i)));
  const months = all.filter((m) => (!p.from || m >= p.from.slice(0, 7)) && (!p.to || m <= p.to.slice(0, 7)));
  if (!months.length) throw new HttpError(400, 'The dates are outside the budget');
  const from = `${months[0]}-01`;
  const to = endOfMonth(`${months[months.length - 1]}-01`);
  const lines = await db.prepare('SELECT account_id, month, amount FROM fin_budget_lines WHERE budget_id = ? AND org_id = ?').bind(b.id, a.orgId).all<any>();
  const budget = new Map<string, number>();
  for (const l of lines.results) if (months.includes(l.month)) budget.set(l.account_id, (budget.get(l.account_id) ?? 0) + l.amount);
  const actual = await sums(db, a.orgId, from, to, { department: b.department_id ?? undefined, project: b.project_id ?? undefined, costCentre: b.cost_centre_id ?? undefined });
  const rows: ReportRow[] = [];
  const totals: Record<string, [number, number]> = {};
  for (const type of ['revenue', 'expense'] as const) {
    const accs = ordered([...chart.accounts.values()].filter((x) => x.type === type && (budget.has(x.id) || actual.has(x.id))));
    if (!accs.length) continue;
    rows.push({ cells: [type === 'revenue' ? 'Income' : 'Expenses', null, null, null, null], style: 'heading' });
    let tb = 0;
    let ta = 0;
    for (const acc of accs) {
      const bv = budget.get(acc.id) ?? 0;
      const av = natural(acc.type, actual.get(acc.id) ?? 0);
      if (!bv && !av) continue;
      tb += bv;
      ta += av;
      const variance = type === 'revenue' ? av - bv : bv - av;
      rows.push({ cells: [label(acc), bv, av, variance, bv ? `${Math.round((av / bv) * 100)}%` : ''], indent: 1, accountId: acc.id });
    }
    totals[type] = [tb, ta];
    rows.push({ cells: [`Total ${type === 'revenue' ? 'income' : 'expenses'}`, tb, ta, type === 'revenue' ? ta - tb : tb - ta, tb ? `${Math.round((ta / tb) * 100)}%` : ''], style: 'subtotal' });
  }
  const [ib, ia] = totals.revenue ?? [0, 0];
  const [eb, ea] = totals.expense ?? [0, 0];
  rows.push({ cells: ['Net', ib - eb, ia - ea, ia - ea - (ib - eb), ''], style: 'total' });
  return {
    key: 'budget_actual',
    title: `${REPORTS.budget_actual}: ${b.name}`,
    subtitle: `${a.org.name}: ${monthLabel(months[0])} to ${monthLabel(months[months.length - 1])}. A positive variance is better than budget.`,
    columns: [{ label: 'Category' }, { label: 'Budget', align: 'right' }, { label: 'Actual', align: 'right' }, { label: 'Variance', align: 'right' }, { label: 'Used', align: 'right' }],
    rows,
    summary: { incomeBudget: ib, incomeActual: ia, expenseBudget: eb, expenseActual: ea },
  };
}

// ------------------------------------------------------------------ cash flow forecast

export async function cashForecast(db: D1Database, a: FinAccess, p: ReportParams, today: string): Promise<Report> {
  const weeks = Math.min(Math.max(p.weeks ?? 13, 4), 26);
  const chart = await chartOf(db, a);
  const cashIds = [...chart.accounts.values()].filter((x) => CASH_SUBTYPES.includes(x.subtype)).map((x) => x.id);
  const bal = await sums(db, a.orgId, null, today);
  let cash = cashIds.reduce((n, id) => n + (bal.get(id) ?? 0), 0);
  const end = addDays(today, weeks * 7 - 1);
  const docs = await db.prepare("SELECT kind, number, due_date, total - amount_paid AS due FROM fin_docs WHERE org_id = ? AND deleted_at IS NULL AND status IN ('approved','part_paid') AND kind IN ('invoice','bill','expense_claim') AND (due_date IS NULL OR due_date <= ?)").bind(a.orgId, end).all<any>();
  const recurring = await db.prepare("SELECT kind, template_json, frequency, next_date, end_date, remaining FROM fin_recurring WHERE org_id = ? AND active = 1 AND next_date <= ?").bind(a.orgId, end).all<any>();
  const weekOf = (d: string | null) => Math.max(0, Math.min(weeks - 1, d ? Math.floor(daysBetween(today, d) / 7) : 0));
  const inflow = Array(weeks).fill(0);
  const outflow = Array(weeks).fill(0);
  for (const d of docs.results) (d.kind === 'invoice' ? inflow : outflow)[weekOf(d.due_date)] += d.due;
  for (const r of recurring.results) {
    const t = parseJson<any>(r.template_json, {});
    const amount = r.kind === 'transaction' ? (t.kind === 'transfer' ? 0 : (t.lines ?? []).reduce((n: number, l: any) => n + (Number(l.amount) || 0), 0)) : (t.lines ?? []).reduce((n: number, l: any) => n + Math.round(((Number(l.unitPrice) || 0) * (Number(l.quantity) || 1))), 0);
    if (!amount) continue;
    const isIn = r.kind === 'invoice' || (r.kind === 'transaction' && t.kind === 'receive');
    let d = r.next_date as string;
    let left = r.remaining ?? 1e9;
    for (let i = 0; i < 60 && d <= end && left > 0 && (!r.end_date || d <= r.end_date); i++, left--) {
      if (d >= today) {
        const due = r.kind === 'transaction' ? d : addDays(d, a.settings.termsDays);
        if (due <= end) (isIn ? inflow : outflow)[weekOf(due)] += amount;
      }
      d = nextDate(d, r.frequency, Number(t.anchorDay) || undefined);
    }
  }
  const rows: ReportRow[] = [];
  const series: { label: string; value: number }[] = [];
  let low = cash;
  let lowWeek = today;
  for (let w = 0; w < weeks; w++) {
    const start = addDays(today, w * 7);
    const open = cash;
    cash = open + inflow[w] - outflow[w];
    if (cash < low) {
      low = cash;
      lowWeek = start;
    }
    rows.push({ cells: [`Week of ${shortDate(start)}`, open, inflow[w], outflow[w], cash] });
    series.push({ label: shortDate(start).replace(/ \d{4}$/, ''), value: cash });
  }
  return {
    key: 'cash_forecast',
    title: REPORTS.cash_forecast,
    subtitle: `${a.org.name}: ${weeks} weeks from ${shortDate(today)}. Open invoices and bills by due date (overdue ones in the first week), and recurring items as scheduled.`,
    columns: [{ label: 'Week' }, { label: 'Opening cash', align: 'right' }, { label: 'Money in', align: 'right' }, { label: 'Money out', align: 'right' }, { label: 'Closing cash', align: 'right' }],
    rows,
    chart: { kind: 'line', series },
    summary: { lowest: low, lowestWeek: lowWeek },
    notes: ['A forecast, not a promise: it assumes customers and you pay on the due dates, and recurring items run as set.'],
  };
}

// ------------------------------------------------------------------ aged receivables and payables

export async function aged(db: D1Database, a: FinAccess, p: ReportParams, kind: 'invoice' | 'bill'): Promise<Report> {
  need(p, 'date');
  const rows0 = await db
    .prepare(
      `SELECT d.id, d.number, d.due_date, d.issue_date, d.total, ct.name AS contact, d.contact_id,
         (SELECT COALESCE(SUM(p.amount), 0) FROM fin_payments p WHERE p.doc_id = d.id AND p.date <= ? AND (p.voided_at IS NULL))
         + (SELECT COALESCE(SUM(ca.amount), 0) FROM fin_credit_allocations ca WHERE ca.org_id = d.org_id AND ca.invoice_id = d.id AND ca.date <= ? AND ca.voided_at IS NULL) AS paid
       FROM fin_docs d LEFT JOIN fin_contacts ct ON ct.id = d.contact_id
       WHERE d.org_id = ? AND d.kind = ? AND d.deleted_at IS NULL AND d.issue_date <= ? AND d.approved_at IS NOT NULL AND d.status <> 'void'`,
    )
    .bind(p.date, p.date, a.orgId, kind, p.date)
    .all<any>();
  const buckets = ['Current', '1 to 30 days', '31 to 60 days', '61 to 90 days', 'Over 90 days'];
  const byContact = new Map<string, { name: string; v: number[] }>();
  for (const d of rows0.results) {
    const due = d.total - d.paid;
    if (due <= 0) continue;
    const late = d.due_date ? daysBetween(d.due_date, p.date!) : 0;
    const i = late <= 0 ? 0 : late <= 30 ? 1 : late <= 60 ? 2 : late <= 90 ? 3 : 4;
    const key = d.contact_id ?? '-';
    const e = byContact.get(key) ?? { name: d.contact ?? 'No contact', v: [0, 0, 0, 0, 0] };
    e.v[i] += due;
    byContact.set(key, e);
  }
  if (kind === 'invoice') {
    // Credit a customer has not used yet (not applied to an invoice or paid back) lowers what they owe, shown as current.
    const credits = await db
      .prepare(
        `SELECT cn.contact_id, ct.name AS contact, cn.total
           - (SELECT COALESCE(SUM(ca.amount), 0) FROM fin_credit_allocations ca WHERE ca.org_id = cn.org_id AND ca.credit_note_id = cn.id AND ca.date <= ? AND ca.voided_at IS NULL)
           - (SELECT COALESCE(SUM(r.amount), 0) FROM fin_credit_refunds r WHERE r.org_id = cn.org_id AND r.credit_note_id = cn.id AND r.date <= ? AND r.voided_at IS NULL) AS unused
         FROM fin_credit_notes cn JOIN fin_contacts ct ON ct.id = cn.contact_id
         WHERE cn.org_id = ? AND cn.deleted_at IS NULL AND cn.issue_date <= ? AND cn.approved_at IS NOT NULL AND (cn.voided_at IS NULL)`,
      )
      .bind(p.date, p.date, a.orgId, p.date)
      .all<any>();
    for (const cn of credits.results) {
      if (cn.unused <= 0) continue;
      const e = byContact.get(cn.contact_id) ?? { name: cn.contact, v: [0, 0, 0, 0, 0] };
      e.v[0] -= cn.unused;
      byContact.set(cn.contact_id, e);
    }
  }
  const rows: ReportRow[] = [...byContact.values()].sort((x, y) => x.name.localeCompare(y.name)).map((e) => ({ cells: [e.name, ...e.v, e.v.reduce((n, x) => n + x, 0)] }));
  const totals = [0, 1, 2, 3, 4].map((i) => [...byContact.values()].reduce((n, e) => n + e.v[i], 0));
  rows.push({ cells: ['Total', ...totals, totals.reduce((n, x) => n + x, 0)], style: 'total' });
  return {
    key: kind === 'invoice' ? 'aged_receivables' : 'aged_payables',
    title: kind === 'invoice' ? REPORTS.aged_receivables : REPORTS.aged_payables,
    subtitle: `${a.org.name}: as at ${shortDate(p.date!)}, by days past the due date`,
    columns: [{ label: kind === 'invoice' ? 'Customer' : 'Supplier' }, ...buckets.map((b) => ({ label: b, align: 'right' as const })), { label: 'Total', align: 'right' }],
    rows,
    chart: { kind: 'bar', series: buckets.map((b, i) => ({ label: b, value: totals[i] })) },
    summary: { total: totals.reduce((n, x) => n + x, 0), overdue: totals.slice(1).reduce((n, x) => n + x, 0) },
  };
}

// ------------------------------------------------------------------ GST and the BAS worksheet

export async function gstReport(db: D1Database, a: FinAccess, p: ReportParams): Promise<Report> {
  need(p, 'from', 'to');
  if (!a.gst) throw new HttpError(400, 'GST reports are for business workspaces registered for GST (Settings, Workspace)');
  const chart = await chartOf(db, a);
  const basis = p.basis ?? a.org.gst_basis;
  // Per tax code: net and GST, signed as the business sees them (sales positive, purchases positive).
  const per = new Map<string, { net: number; gst: number }>();
  const add = (codeId: string, net: number, gst: number) => {
    const e = per.get(codeId) ?? { net: 0, gst: 0 };
    e.net += net;
    e.gst += gst;
    per.set(codeId, e);
  };
  const dirOf = (codeId: string) => chart.taxCodes.get(codeId)?.direction ?? 'both';
  const lineSql = (extra: string) =>
    `SELECT l.tax_code_id, SUM(l.debit) - SUM(l.credit) AS amt, SUM(l.tax_amount) AS tax FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id
     WHERE l.org_id = ? AND j.status = 'posted' AND j.date >= ? AND j.date <= ? AND l.tax_code_id IS NOT NULL ${extra} GROUP BY l.tax_code_id`;
  const fold = (rows: { tax_code_id: string; amt: number; tax: number }[]) => {
    for (const r of rows) {
      const sign = dirOf(r.tax_code_id) === 'sales' ? -1 : 1;
      add(r.tax_code_id, sign * r.amt, sign * r.tax);
    }
  };
  if (basis === 'accrual') {
    fold((await db.prepare(lineSql('')).bind(a.orgId, p.from, p.to).all<any>()).results);
  } else {
    // Cash basis: bank transactions and journals by their date; invoices, bills and claims as they are paid.
    fold((await db.prepare(lineSql(`AND (j.source_type IN ('transaction','manual','opening') OR (j.source_type = 'reversal' AND COALESCE(j.source_id, '') NOT IN (SELECT id FROM fin_docs WHERE org_id = ?) AND COALESCE(j.source_id, '') NOT IN (SELECT id FROM fin_credit_notes WHERE org_id = ?)))`)).bind(a.orgId, p.from, p.to, a.orgId, a.orgId).all<any>()).results);
    const pays = await db
      .prepare(`SELECT p.amount, d.total, d.kind, d.id FROM fin_payments p JOIN fin_docs d ON d.id = p.doc_id WHERE p.org_id = ? AND p.date >= ? AND p.date <= ? AND p.voided_at IS NULL AND d.total > 0`)
      .bind(a.orgId, p.from, p.to)
      .all<any>();
    const docIds = [...new Set(pays.results.map((x) => x.id))];
    const dl = docIds.length ? await db.prepare(`SELECT doc_id, tax_code_id, net, tax FROM fin_doc_lines WHERE org_id = ? AND tax_code_id IS NOT NULL AND doc_id IN (${placeholders(docIds.length)})`).bind(a.orgId, ...docIds).all<any>() : { results: [] };
    for (const pay of pays.results) {
      const share = pay.amount / pay.total;
      for (const l of dl.results.filter((x) => x.doc_id === pay.id)) add(l.tax_code_id, Math.round(l.net * share), Math.round(l.tax * share));
    }
    // A credit note paid back to the customer lowers sales when the money goes out. A credit applied to an unpaid
    // invoice needs nothing here: that part of the invoice is never received, so it is never counted.
    const refunds = await db
      .prepare(`SELECT r.amount, cn.total, cn.id FROM fin_credit_refunds r JOIN fin_credit_notes cn ON cn.id = r.credit_note_id WHERE r.org_id = ? AND r.date >= ? AND r.date <= ? AND r.voided_at IS NULL AND cn.total > 0`)
      .bind(a.orgId, p.from, p.to)
      .all<any>();
    const noteIds = [...new Set(refunds.results.map((x) => x.id))];
    const nl = noteIds.length ? await db.prepare(`SELECT credit_note_id, tax_code_id, net, tax FROM fin_credit_note_lines WHERE org_id = ? AND tax_code_id IS NOT NULL AND credit_note_id IN (${placeholders(noteIds.length)})`).bind(a.orgId, ...noteIds).all<any>() : { results: [] };
    for (const r of refunds.results) {
      const share = r.amount / r.total;
      for (const l of nl.results.filter((x) => x.credit_note_id === r.id)) add(l.tax_code_id, -Math.round(l.net * share), -Math.round(l.tax * share));
    }
  }
  const rows: ReportRow[] = [];
  const bas = Object.fromEntries(BAS_ORDER.map((k) => [k, 0])) as Record<BasLabel, number>;
  for (const dir of ['sales', 'purchases', 'both'] as const) {
    const codes = [...per.entries()].filter(([id]) => dirOf(id) === dir);
    if (!codes.length) continue;
    rows.push({ cells: [dir === 'sales' ? 'Sales' : dir === 'purchases' ? 'Purchases' : 'Other', null, null, null], style: 'heading' });
    for (const [codeId, v] of codes) {
      const tc = chart.taxCodes.get(codeId)!;
      rows.push({ cells: [`${tc.code} ${tc.name}`, v.net, v.gst, v.net + v.gst], indent: 1 });
      for (const lbl of basOf(tc.bas_json)) bas[lbl] += lbl === '1A' || lbl === '1B' ? v.gst : v.net + v.gst;
    }
  }
  const shown = a.org.bas_method === 'simpler' ? SIMPLER_BAS : BAS_ORDER;
  rows.push({ cells: ['BAS worksheet', null, null, null], style: 'heading' });
  // The BAS reports whole dollars (cents dropped).
  for (const k of shown) rows.push({ cells: [`${k}  ${BAS_LABELS[k]}`, null, null, Math.trunc(bas[k] / 100) * 100], indent: 1 });
  const net = Math.trunc(bas['1A'] / 100) * 100 - Math.trunc(bas['1B'] / 100) * 100;
  rows.push({ cells: [net >= 0 ? 'GST payable (1A less 1B)' : 'GST refundable (1B more than 1A)', null, null, Math.abs(net)], style: 'total' });
  return {
    key: 'gst',
    title: REPORTS.gst,
    subtitle: `${a.org.name}: ${shortDate(p.from!)} to ${shortDate(p.to!)}, ${basis} basis, ${a.org.bas_method === 'simpler' ? 'Simpler BAS' : 'full reporting'}`,
    columns: [{ label: 'Tax code' }, { label: 'Net', align: 'right' }, { label: 'GST', align: 'right' }, { label: 'Total', align: 'right' }],
    rows,
    summary: { ...bas, net },
    notes: [
      'A worksheet to help prepare your Business Activity Statement, from the tax codes on your records. BAS labels show whole dollars.',
      'BIZOMAT does not lodge a BAS and is not certified tax software. Check the figures against ATO guidance or with your registered tax or BAS agent before you lodge.',
    ],
  };
}

export async function runReport(db: D1Database, a: FinAccess, key: ReportKey, p: ReportParams, today: string): Promise<Report> {
  switch (key) {
    case 'profit_loss':
      return profitLoss(db, a, p);
    case 'balance_sheet':
      return balanceSheet(db, a, p);
    case 'cash_flow':
      return cashFlow(db, a, p);
    case 'general_ledger':
      return generalLedger(db, a, p);
    case 'account_transactions':
      need(p, 'account');
      return generalLedger(db, a, p);
    case 'trial_balance':
      return trialBalance(db, a, p);
    case 'income_expenses':
      return incomeExpenses(db, a, p);
    case 'budget_actual':
      return budgetActual(db, a, p);
    case 'cash_forecast':
      return cashForecast(db, a, p, today);
    case 'aged_receivables':
      return aged(db, a, { date: today, ...p }, 'invoice');
    case 'aged_payables':
      return aged(db, a, { date: today, ...p }, 'bill');
    case 'gst':
      return gstReport(db, a, p);
  }
}

/** Default parameters for a report (this financial year, or today), for scheduled runs and first views. */
export function defaultParams(a: FinAccess, key: ReportKey, today: string): ReportParams {
  const fy = fyStart(today, a.org.fy_start_month);
  if (key === 'balance_sheet' || key === 'trial_balance' || key === 'aged_receivables' || key === 'aged_payables') return { date: today };
  if (key === 'gst') {
    const m = Number(today.slice(5, 7)) - 1;
    const qStart = `${today.slice(0, 4)}-${String(Math.floor(m / 3) * 3 + 1).padStart(2, '0')}-01`;
    return { from: qStart, to: endOfMonth(addMonths(qStart, 2)) };
  }
  if (key === 'income_expenses') return { from: addMonths(startOfMonth(today), -11), to: endOfMonth(today) };
  // A budget's own months, unless dates are asked for (the financial year may lie outside the budget).
  if (key === 'budget_actual') return {};
  return { from: fy, to: today };
}

/** A report as CSV rows: amounts as decimal dollars and cents. */
export function reportCsv(r: Report): unknown[][] {
  return [[r.title], [r.subtitle ?? ''], [], r.columns.map((c) => c.label), ...r.rows.map((row) => row.cells.map((v, i) => (typeof v === 'number' ? (v / 100).toFixed(2) : i === 0 ? `${'  '.repeat(Math.max(0, (row.indent ?? 0) - 1))}${v ?? ''}` : (v ?? '')))), ...(r.notes?.length ? [[], ...r.notes.map((n) => [n])] : [])];
}
