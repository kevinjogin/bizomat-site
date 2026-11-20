// Postings to Finance's ledger from the modules framework (docs/erp/postings.md): a fixed asset's monthly depreciation,
// an approved pay run, and a revenue schedule's earned months (and, once, the move of the invoiced amount to deferred
// revenue) become posted journals in the company's Finance business workspace.
//
// Every journal goes through Finance's own ledger code (validateJournal, journalStmts: the database checks the balance
// and the lock date again) into the accounts the company chose (erp_posting_accounts, suggested from its chart), by
// someone whose ERP roles may do it on the record and whose Finance role may post journals. Each journal is recorded in
// erp_integration_events (kind 'finance.journal') in the same transaction, under a key per record and month: a second
// attempt, at the same moment or later, posts nothing. Months in a locked period are posted together on the first open
// day, and the memo says so. Reversing goes through Finance's reversalStmts; the record's keys are then free again.
// A record in another currency than the workspace's is converted at the company's own exchange rate on the journal's
// date (fx.ts), and the memo names the rate; with no rate it is refused, never converted silently.

import type { Env } from '../../env';
import { HttpError, newId, now } from '../../lib/util';
import { chartOf, journalStmts, reversalStmts, validateJournal, type AccountRow, type Chart, type LedgerLine } from '../../fin/ledger';
import { hasPerm, type FinAccess } from '../../fin/access';
import { auditStmt } from '../../fin/util';
import { todayIn } from '../../../shared/fin/dates';
import type { AccountType } from '../../../shared/fin/charts';
import type { ObjectDef } from '../../../shared/erp-objects';
import type { ErpAccess } from '../access';
import { badState, eventStmt } from '../util';
import { financeOrgsFor, maybeFin } from '../suppliers';
import type { Data, Line, RecordRow } from './engine';
import { addDays, depreciationSchedule, monthEnd, monthsBetween } from './hooks';
import { convert, noRate, rateFor } from './fx';

export type PostingKind = 'depreciation' | 'payroll' | 'revenue';

export interface PostingRole {
  role: string;
  kind: PostingKind;
  label: string;
  help: string;
  types: AccountType[];
  /** Names that suggest the account, in order. */
  match: RegExp[];
  /** Suggested when nothing matches by name. */
  fallback?: 'bank' | 'revenue';
  /** Needed only when the amount is not zero. */
  ifUsed?: boolean;
}

export const POSTING_ROLES: PostingRole[] = [
  { role: 'dep_expense', kind: 'depreciation', label: 'Depreciation expense', help: 'Debited with each month’s depreciation.', types: ['expense'], match: [/depreciation/i, /amortis|amortiz/i] },
  { role: 'dep_accumulated', kind: 'depreciation', label: 'Accumulated depreciation', help: 'Credited with each month’s depreciation (a contra asset account).', types: ['asset'], match: [/accumulated depreciation/i, /depreciation/i] },
  { role: 'wages_expense', kind: 'payroll', label: 'Wages and salaries expense', help: 'Debited with the pay run’s gross pay.', types: ['expense'], match: [/wages|salar/i, /payroll/i] },
  { role: 'contribution_expense', kind: 'payroll', label: 'Employer contribution expense', help: 'Debited with the employer’s retirement contribution (superannuation, pension).', types: ['expense'], match: [/superannuation|pension|retirement|kiwisaver|401/i], ifUsed: true },
  { role: 'withholding_payable', kind: 'payroll', label: 'Tax withheld payable', help: 'Credited with the tax withheld from pay (PAYG withholding, PAYE).', types: ['liability'], match: [/payg|withholding|paye|withheld/i], ifUsed: true },
  { role: 'contribution_payable', kind: 'payroll', label: 'Employer contribution payable', help: 'Credited with the employer’s contribution until it is paid to the fund.', types: ['liability'], match: [/(superannuation|super|pension|retirement).*payable/i, /superannuation|pension/i], ifUsed: true },
  { role: 'deductions_payable', kind: 'payroll', label: 'Other deductions payable', help: 'Credited with other deductions from pay (salary sacrifice, union fees, child support).', types: ['liability'], match: [/deduction/i], ifUsed: true },
  { role: 'net_pay', kind: 'payroll', label: 'Net pay owed or paid from', help: 'Credited with the net pay: a wages payable account until you pay, or the bank account you pay from.', types: ['liability', 'asset'], match: [/(wages|salar|net pay|payroll).*(payable|clearing|owing)/i], fallback: 'bank' },
  { role: 'rev_deferred', kind: 'revenue', label: 'Deferred revenue (income in advance)', help: 'Debited as each month is earned. Invoice the customer to this account, or move the invoiced amount here once.', types: ['liability'], match: [/income (received )?in advance|unearned|deferred (revenue|income)|contract liabilit|revenue in advance/i] },
  { role: 'rev_earned', kind: 'revenue', label: 'Revenue earned', help: 'Credited as each month is earned.', types: ['revenue'], match: [], fallback: 'revenue' },
];
export const ROLE_BY_KEY: Record<string, PostingRole> = Object.fromEntries(POSTING_ROLES.map((r) => [r.role, r]));
export const KIND_LABELS: Record<PostingKind, string> = { depreciation: 'Depreciation of fixed assets', payroll: 'Pay runs', revenue: 'Revenue recognition' };

/** The kind of posting a framework object makes. */
export const POSTING_OF: Record<string, PostingKind> = { fa_asset: 'depreciation', py_run: 'payroll', rr_schedule: 'revenue' };
export const POSTING_MODULES: Record<string, PostingKind> = { fixed_assets: 'depreciation', payroll: 'payroll', revenue: 'revenue' };

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1] ?? ym} ${ym.slice(0, 4)}`;
const keyOf = (companyId: string, object: string, id: string, part?: string) => `fin:${companyId}:${object}:${id}${part ? `:${part}` : ''}`;

// ------------------------------------------------------------------ the company's Finance workspace

export interface FinTarget {
  org: { id: string; name: string };
  fa: FinAccess;
}

/** The company's Finance business workspace with the person's access there: 'journal' to post, 'view' to read. */
export async function financeTarget(env: Env, a: ErpAccess, user: { id: string; name: string }, need: 'view' | 'journal'): Promise<FinTarget> {
  const org = (await financeOrgsFor(env.DB, a))[0];
  if (!org) badState('This company does not run a Finance business workspace to post to');
  const fa = await maybeFin(env.DB, org.id, user);
  if (!fa) throw new HttpError(403, `You have no access to the company’s Finance workspace ${org.name}`);
  if (need === 'journal' && !hasPerm(fa, 'accounting', 'journal')) throw new HttpError(403, 'Your Finance role cannot post journals: ask a Finance owner, administrator or accountant');
  if (need === 'view' && !hasPerm(fa, 'accounting', 'view')) throw new HttpError(403, 'Your Finance role cannot see the chart of accounts');
  return { org, fa };
}

function suggest(chart: Chart, r: PostingRole): AccountRow | null {
  const open = [...chart.accounts.values()].filter((acc) => !acc.archived_at && r.types.includes(acc.type));
  for (const re of r.match) {
    const hit = open.find((acc) => re.test(acc.name));
    if (hit) return hit;
  }
  if (r.fallback === 'bank') return open.find((acc) => acc.subtype === 'bank' && acc.is_default) ?? open.find((acc) => acc.subtype === 'bank') ?? null;
  if (r.fallback === 'revenue') return open.find((acc) => acc.type === 'revenue' && acc.is_default) ?? open.find((acc) => acc.subtype === 'revenue') ?? null;
  return null;
}

/** The accounts chosen for the workspace (only accounts still in its chart). */
async function chosen(db: D1Database, companyId: string, chart: Chart, orgId: string): Promise<Map<string, AccountRow>> {
  const rows = await db.prepare('SELECT role, account_id FROM erp_posting_accounts WHERE company_id = ? AND fin_org_id = ?').bind(companyId, orgId).all<{ role: string; account_id: string }>();
  const out = new Map<string, AccountRow>();
  for (const r of rows.results) {
    const acc = chart.accounts.get(r.account_id);
    if (acc) out.set(r.role, acc);
  }
  return out;
}

const accountDTO = (acc: AccountRow | null | undefined) => (acc ? { id: acc.id, code: acc.code, name: acc.name, type: acc.type, archived: !!acc.archived_at } : null);

/** The posting settings screen: each role with its account (or a suggestion), and the accounts to choose from. */
export async function postingSettings(env: Env, a: ErpAccess, user: { id: string; name: string }, editor: boolean) {
  const t = await financeTarget(env, a, user, 'view');
  const chart = await chartOf(env.DB, t.fa);
  const set = await chosen(env.DB, a.companyId, chart, t.org.id);
  return {
    workspace: { id: t.org.id, name: t.org.name, currency: t.fa.org.currency, lockDate: t.fa.org.lock_date },
    canEdit: editor && hasPerm(t.fa, 'accounting', 'view'),
    canPost: hasPerm(t.fa, 'accounting', 'journal'),
    kinds: (Object.keys(KIND_LABELS) as PostingKind[]).map((k) => ({ kind: k, label: KIND_LABELS[k] })),
    roles: POSTING_ROLES.map((r) => ({ role: r.role, kind: r.kind, label: r.label, help: r.help, types: r.types, ifUsed: !!r.ifUsed, account: accountDTO(set.get(r.role)), suggested: set.has(r.role) ? null : accountDTO(suggest(chart, r)) })),
    accounts: [...chart.accounts.values()].filter((acc) => !acc.archived_at).map((acc) => ({ id: acc.id, code: acc.code, name: acc.name, type: acc.type })),
  };
}

/** Saves the accounts for the roles given (null clears one); each must be in the chart, of an allowed type. */
export async function savePostingSettings(env: Env, a: ErpAccess, user: { id: string; name: string }, input: Record<string, string | null>) {
  const db = env.DB;
  const t = await financeTarget(env, a, user, 'view');
  const chart = await chartOf(db, t.fa);
  const before = await chosen(db, a.companyId, chart, t.org.id);
  const stmts: D1PreparedStatement[] = [];
  const at = now();
  const changes: string[] = [];
  for (const [role, accountId] of Object.entries(input)) {
    const r = ROLE_BY_KEY[role];
    if (!r) throw new HttpError(400, `Unknown posting account ${role}`);
    if (accountId === null) {
      if (before.has(role)) changes.push(`${r.label}: not chosen`);
      stmts.push(db.prepare('DELETE FROM erp_posting_accounts WHERE company_id = ? AND fin_org_id = ? AND role = ?').bind(a.companyId, t.org.id, role));
      continue;
    }
    const acc = chart.accounts.get(accountId);
    if (!acc || acc.archived_at) throw new HttpError(400, `${r.label}: choose an account of the workspace’s chart`);
    if (!r.types.includes(acc.type)) throw new HttpError(400, `${r.label}: choose ${r.types.map((x) => (x === 'asset' ? 'an asset' : x === 'expense' ? 'an expense' : x === 'liability' ? 'a liability' : 'an income')).join(' or ')} account`);
    if (before.get(role)?.id !== acc.id) changes.push(`${r.label}: ${acc.code} ${acc.name}`);
    stmts.push(
      db
        .prepare('INSERT INTO erp_posting_accounts (company_id, fin_org_id, role, account_id, updated_by, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6) ON CONFLICT(company_id, fin_org_id, role) DO UPDATE SET account_id = ?4, updated_by = ?5, updated_at = ?6')
        .bind(a.companyId, t.org.id, role, acc.id, a.userId, at),
    );
  }
  if (changes.length) stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'postings.accounts', entityType: 'settings', entityId: a.companyId, summary: `Finance posting accounts: ${changes.join('; ')}`.slice(0, 500), at }));
  if (stmts.length) await db.batch(stmts);
  return postingSettings(env, a, user, true);
}

// ------------------------------------------------------------------ what a record has posted

export interface Posting {
  key: string;
  journalId: string;
  number: number | null;
  date: string | null;
  amount: number;
  part: string;
  /** Reversed, here or in Finance itself. */
  reversed: boolean;
  /** The record's key is free again (reversed from here, or noticed as reversed in Finance). */
  freed: boolean;
  reversalNumber: number | null;
}

/** The record's journals in Finance, newest first; a journal reversed in Finance itself counts as reversed. */
export async function postingsOf(db: D1Database, companyId: string, object: string, id: string): Promise<Posting[]> {
  const rows = await db
    .prepare(
      `SELECT ev.idempotency_key AS key, ev.kind, ev.target_ref, ev.target_org_id, ev.amount_cents, j.number, j.date, j.reversed_by_id, rj.number AS rnum
         FROM erp_integration_events ev
         LEFT JOIN fin_journals j ON j.id = ev.target_ref AND j.org_id = ev.target_org_id
         LEFT JOIN fin_journals rj ON rj.id = j.reversed_by_id AND rj.org_id = j.org_id
        WHERE ev.company_id = ? AND ev.source_type = ? AND ev.source_id = ? AND ev.kind IN ('finance.journal', 'finance.reversed') AND ev.status = 'done'
        ORDER BY j.date DESC, ev.idempotency_key DESC LIMIT 1000`,
    )
    .bind(companyId, object, id)
    .all<any>();
  return rows.results.map((r) => ({
    key: String(r.key).split('#')[0],
    journalId: r.target_ref,
    number: r.number ?? null,
    date: r.date ?? null,
    amount: r.amount_cents ?? 0,
    part: String(r.key).split('#')[0].split(':').slice(4).join(':') || 'whole',
    reversed: r.kind === 'finance.reversed' || !!r.reversed_by_id,
    freed: r.kind === 'finance.reversed',
    reversalNumber: r.rnum ?? null,
  }));
}

/** Frees the keys of journals reversed in Finance itself, so the record can post those parts again. */
async function syncReversed(db: D1Database, companyId: string, object: string, id: string) {
  const stale = (await postingsOf(db, companyId, object, id)).filter((p) => p.reversed && !p.freed);
  if (!stale.length) return;
  const t = now();
  await db.batch([...new Set(stale.map((p) => p.journalId))].map((jid) => db.prepare("UPDATE erp_integration_events SET kind = 'finance.reversed', idempotency_key = idempotency_key || '#rev:finance', last_error = 'Reversed in Finance', updated_at = ? WHERE company_id = ? AND kind = 'finance.journal' AND target_ref = ?").bind(t, companyId, jid)));
}

/** The parts (months, 'whole', 'deferral') posted and not reversed. */
export async function postedParts(db: D1Database, companyId: string, object: string, id: string): Promise<Set<string>> {
  return new Set((await postingsOf(db, companyId, object, id)).filter((p) => !p.reversed).map((p) => p.part));
}

// ------------------------------------------------------------------ journals

interface Planned {
  /** The parts this journal posts (each a key of its own). */
  parts: string[];
  date: string;
  memo: string;
  lines: LedgerLine[];
  amount: number;
}

interface PostCtx {
  env: Env;
  a: ErpAccess;
  user: { id: string; name: string };
  def: ObjectDef;
  row: RecordRow;
  data: Data;
}

function needAccounts(set: Map<string, AccountRow>, kind: PostingKind, used: Record<string, number>): Record<string, string> {
  const out: Record<string, string> = {};
  const missing: string[] = [];
  for (const r of POSTING_ROLES.filter((x) => x.kind === kind)) {
    if (r.ifUsed && !used[r.role]) continue;
    const acc = set.get(r.role);
    if (!acc) missing.push(r.label);
    else if (acc.archived_at) missing.push(`${r.label} (its account ${acc.name} is archived)`);
    else out[r.role] = acc.id;
  }
  if (missing.length) badState(`Choose the Finance posting accounts first (Finance postings tab of the module): ${missing.join(', ')}`);
  return out;
}

/** Plans in the record's currency converted to the workspace's at the rate on each journal's date (balanced again). */
async function inWorkspaceCurrency(db: D1Database, companyId: string, fa: FinAccess, data: Data, plans: Planned[]): Promise<Planned[]> {
  const cur = str(data.currency) || fa.org.currency;
  if (cur === fa.org.currency) return plans;
  const out: Planned[] = [];
  for (const p of plans) {
    const r = await rateFor(db, companyId, cur, fa.org.currency, p.date);
    if (!r) badState(noRate(cur, fa.org.currency, p.date));
    const lines = p.lines.map((l) => ({ ...l, debit: convert(l.debit, r.rate), credit: convert(l.credit, r.rate) }));
    // rounding each line can leave a cent over: the largest line on the short side takes it
    const diff = lines.reduce((sum, l) => sum + l.debit - l.credit, 0);
    if (diff) {
      const side = diff > 0 ? 'credit' : 'debit';
      const target = lines.filter((l) => l[side] > 0).sort((x, y) => y[side] - x[side])[0];
      target[side] += Math.abs(diff);
    }
    out.push({ ...p, lines, memo: `${p.memo} (${cur} ${(p.amount / 100).toFixed(2)} at ${Number(r.rate.toPrecision(8))}, exchange rate ${r.source})`.slice(0, 500) });
  }
  return out;
}

/** The date a journal can take: its own, or the first open day when that is in a locked period (the memo says so). */
function openDate(fa: FinAccess, date: string): { date: string; moved: boolean } {
  const lock = fa.org.lock_date;
  if (lock && date <= lock) return { date: addDays(lock, 1), moved: true };
  return { date, moved: false };
}

const line = (accountId: string, amount: number, description: string): LedgerLine => (amount >= 0 ? { accountId, debit: amount, credit: 0, description } : { accountId, debit: 0, credit: -amount, description });

/** Months grouped as Finance can take them: each open month on its last day, the locked ones together. */
function monthlyPlans(fa: FinAccess, months: { month: string; amount: number }[], build: (amount: number, label: string) => { memo: string; lines: LedgerLine[] }): Planned[] {
  const out: Planned[] = [];
  const locked = months.filter((m) => openDate(fa, monthEnd(m.month)).moved);
  if (locked.length) {
    const amount = locked.reduce((s, m) => s + m.amount, 0);
    const label = locked.length === 1 ? monthName(locked[0].month) : `${monthName(locked[0].month)} to ${monthName(locked[locked.length - 1].month)}`;
    const b = build(amount, `${label} (the books are locked up to ${fa.org.lock_date}, so it is posted on the first open day)`);
    out.push({ parts: locked.map((m) => m.month), date: addDays(fa.org.lock_date!, 1), memo: b.memo, lines: b.lines, amount });
  }
  for (const m of months.filter((x) => !locked.includes(x))) {
    const b = build(m.amount, monthName(m.month));
    out.push({ parts: [m.month], date: monthEnd(m.month), memo: b.memo, lines: b.lines, amount: m.amount });
  }
  return out;
}

async function plansFor(c: PostCtx, t: FinTarget, set: Map<string, AccountRow>, opts: { upTo?: string; part?: 'deferral' }): Promise<Planned[]> {
  const { def, row, data } = c;
  const kind = POSTING_OF[def.key];
  const done = await postedParts(c.env.DB, c.a.companyId, def.key, row.id);
  const today = todayIn(t.fa.org.timezone || 'Australia/Sydney');
  const upTo = opts.upTo ?? today;
  if (upTo > today) badState('Post up to today at the latest');
  const what = `${def.label} ${row.number}`;
  if (kind === 'depreciation') {
    if (!['in_service', 'disposed', 'written_off'].includes(row.status)) badState('Place the asset in service first');
    const acc = needAccounts(set, 'depreciation', {});
    const stop = str(data.disposalDate).slice(0, 7);
    const months = depreciationSchedule(data)
      .filter((m) => m.depreciation > 0 && monthEnd(m.month) <= upTo && (!stop || m.month < stop) && !done.has(m.month))
      .map((m) => ({ month: m.month, amount: m.depreciation }));
    return monthlyPlans(t.fa, months, (amount, label) => ({
      memo: `BIZOMAT ERP: depreciation of ${what} ${row.title}, ${label}`,
      lines: [line(acc.dep_expense, amount, `Depreciation ${row.number} ${row.title}`), line(acc.dep_accumulated, -amount, `Accumulated depreciation ${row.number}`)],
    }));
  }
  if (kind === 'revenue') {
    if (!['active', 'completed'].includes(row.status)) badState('Approve the revenue schedule first');
    const acc = needAccounts(set, 'revenue', {});
    if (opts.part === 'deferral') {
      if (done.has('deferral')) badState('The invoiced amount was already moved to deferred revenue');
      const total = Math.round(num(data.total));
      if (total <= 0) badState('The schedule has no amount');
      const d = openDate(t.fa, str(data.startDate) || today);
      return [{ parts: ['deferral'], date: d.date, amount: total, memo: `BIZOMAT ERP: ${what} ${row.title}, the invoiced amount moved from revenue to deferred revenue${d.moved ? ` (the books are locked up to ${t.fa.org.lock_date})` : ''}`, lines: [line(acc.rev_earned, total, `Deferred: ${row.number} ${row.title}`), line(acc.rev_deferred, -total, `Deferred revenue ${row.number}`)] }];
    }
    const start = str(data.startDate);
    const end = str(data.endDate);
    if (!start || !end) badState('Give the dates the revenue is earned between');
    const total = Math.round(num(data.total));
    const all = monthsBetween(start, end);
    const each = Math.floor(total / all.length);
    const months = all
      .map((m, i) => ({ month: m, amount: i === all.length - 1 ? total - each * (all.length - 1) : each }))
      .filter((m) => m.amount > 0 && monthEnd(m.month) <= upTo && !done.has(m.month));
    return monthlyPlans(t.fa, months, (amount, label) => ({
      memo: `BIZOMAT ERP: revenue earned on ${what} ${row.title}, ${label}`,
      lines: [line(acc.rev_deferred, amount, `Earned: ${row.number} ${row.title}`), line(acc.rev_earned, -amount, `Revenue ${row.number} ${row.title}`)],
    }));
  }
  // payroll: one journal for the run
  if (!['approved', 'paid'].includes(row.status)) badState('Only an approved pay run is posted');
  if (done.has('whole')) badState('This pay run is already posted to Finance');
  const lines = (await c.env.DB.prepare('SELECT data_json FROM erp_object_lines WHERE company_id = ? AND record_id = ? ORDER BY position').bind(c.a.companyId, row.id).all<{ data_json: string }>()).results.map((r) => JSON.parse(r.data_json) as Line);
  if (!lines.length) badState('The pay run has no payslips');
  const sum = { gross: 0, withheld: 0, deductions: 0, contribution: 0, net: 0 };
  for (const l of lines) {
    const g = Math.round(num(l.gross));
    const w = Math.round(num(l.withheld));
    const dd = Math.round(num(l.deductions));
    const n = Math.round(num(l.net));
    if (w + dd > g) badState('A payslip’s tax withheld and deductions are more than its gross pay: correct it before posting');
    if (g - w - dd !== n) badState('A payslip’s net pay is not its gross less tax withheld and deductions: work out the pay again before posting');
    sum.gross += g;
    sum.withheld += w;
    sum.deductions += dd;
    sum.contribution += Math.round(num(l.contribution));
    sum.net += n;
  }
  if (sum.gross <= 0) badState('The pay run has no gross pay to post');
  const acc = needAccounts(set, 'payroll', { contribution_expense: sum.contribution, contribution_payable: sum.contribution, withholding_payable: sum.withheld, deductions_payable: sum.deductions });
  const label = `${str(data.periodStart)} to ${str(data.periodEnd)}`;
  const jl: LedgerLine[] = [line(acc.wages_expense, sum.gross, `Gross pay ${row.number}`)];
  if (sum.contribution) jl.push(line(acc.contribution_expense, sum.contribution, `Employer contribution ${row.number}`));
  if (sum.withheld) jl.push(line(acc.withholding_payable, -sum.withheld, `Tax withheld ${row.number}`));
  if (sum.contribution) jl.push(line(acc.contribution_payable, -sum.contribution, `Employer contribution payable ${row.number}`));
  if (sum.deductions) jl.push(line(acc.deductions_payable, -sum.deductions, `Other deductions ${row.number}`));
  if (sum.net) jl.push(line(acc.net_pay, -sum.net, `Net pay ${row.number}`));
  const d = openDate(t.fa, str(data.payDate) || today);
  return [{ parts: ['whole'], date: d.date, amount: sum.gross + sum.contribution, memo: `BIZOMAT ERP: ${what}, pay period ${label}${d.moved ? ` (the books are locked up to ${t.fa.org.lock_date}, so it is posted on the first open day)` : ''}`, lines: jl }];
}

export interface PostResult {
  posted: { journalId: string; date: string; amount: number; parts: string[] }[];
  skipped: number;
  workspace: { id: string; name: string };
  url: string;
}

/** Posts what the record has not posted yet (up to a date for monthly kinds); returns the journals made. */
export async function postRecord(c: PostCtx, opts: { upTo?: string; part?: 'deferral' } = {}, target?: FinTarget): Promise<PostResult> {
  const db = c.env.DB;
  const t = target ?? (await financeTarget(c.env, c.a, c.user, 'journal'));
  await syncReversed(db, c.a.companyId, c.def.key, c.row.id);
  const chart = await chartOf(db, t.fa);
  const set = await chosen(db, c.a.companyId, chart, t.org.id);
  const plans = await inWorkspaceCurrency(db, c.a.companyId, t.fa, c.data, await plansFor(c, t, set, opts));
  const out: PostResult = { posted: [], skipped: 0, workspace: t.org, url: `/erp/finance/o/${t.org.id}/accounting/journals` };
  for (const p of plans.slice(0, 120)) {
    validateJournal(t.fa, chart, p.date, p.lines);
    const id = newId();
    const at = now();
    const stmts: D1PreparedStatement[] = [
      ...journalStmts(db, { id, orgId: t.org.id, date: p.date, sourceType: 'manual', sourceId: c.row.id, memo: p.memo, createdBy: c.user.id, lines: p.lines }),
      // one key per part: a second attempt fails here and the whole journal with it
      ...p.parts.map((part) =>
        db
          .prepare("INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, target_ref, target_org_id, amount_cents, created_by, created_at, updated_at) VALUES (?, ?, 'finance.journal', ?, ?, 'finance', ?, 'done', 1, ?, ?, ?, ?, ?, ?)")
          .bind(newId(), c.a.companyId, c.def.key, c.row.id, keyOf(c.a.companyId, c.def.key, c.row.id, part), id, t.org.id, p.parts.length === 1 ? p.amount : null, c.user.id, at, at),
      ),
      auditStmt(db, { orgId: t.org.id, actorId: c.user.id, action: 'journal.posted', targetType: 'journal', targetId: id, after: { date: p.date, memo: p.memo }, metadata: { source: 'erp', object: c.def.key, record: c.row.number, parts: p.parts.length } }),
      eventStmt(db, { companyId: c.a.companyId, actorId: c.user.id, action: 'record.posted', entityType: 'record', entityId: c.row.id, summary: `Posted to Finance (${t.org.name}): ${p.memo.replace(/^BIZOMAT ERP: /, '')}`.slice(0, 500), at }),
    ];
    if (p.parts.length > 1) stmts.push(db.prepare('UPDATE erp_integration_events SET amount_cents = ? WHERE company_id = ? AND idempotency_key = ?').bind(p.amount, c.a.companyId, keyOf(c.a.companyId, c.def.key, c.row.id, p.parts[0])));
    try {
      await db.batch(stmts);
    } catch (e) {
      const msg = String((e as Error)?.message ?? e);
      if (/UNIQUE constraint failed/i.test(msg) && /erp_integration_events/i.test(msg)) {
        out.skipped++;
        continue;
      }
      if (/lock/i.test(msg)) throw new HttpError(409, 'The books were locked meanwhile: try again');
      throw e;
    }
    out.posted.push({ journalId: id, date: p.date, amount: p.amount, parts: p.parts });
  }
  return out;
}

/** Reverses every journal the record posted that is not reversed yet (dated today where the original is locked). */
export async function reverseRecord(c: PostCtx, reason: string): Promise<{ reversed: number; workspace: { id: string; name: string }; url: string }> {
  const db = c.env.DB;
  const t = await financeTarget(c.env, c.a, c.user, 'journal');
  await syncReversed(db, c.a.companyId, c.def.key, c.row.id);
  const journals = [...new Set((await postingsOf(db, c.a.companyId, c.def.key, c.row.id)).filter((p) => !p.freed).map((p) => p.journalId))];
  if (!journals.length) badState('Nothing of this record is posted to Finance');
  const today = todayIn(t.fa.org.timezone || 'Australia/Sydney');
  let reversed = 0;
  for (const jid of journals) {
    const j = await db.prepare('SELECT id, date FROM fin_journals WHERE id = ? AND org_id = ?').bind(jid, t.org.id).first<{ id: string; date: string }>();
    if (!j) badState('A journal of this record is in another Finance workspace: reverse it there');
    const at = now();
    const date = t.fa.org.lock_date && j.date <= t.fa.org.lock_date ? today : null;
    const r = await reversalStmts(db, t.fa, jid, { date, memo: `BIZOMAT ERP: reversal for ${c.def.label} ${c.row.number}${reason ? `: ${reason}` : ''}`.slice(0, 500) });
    await db.batch([
      ...r.stmts,
      db.prepare("UPDATE erp_integration_events SET kind = 'finance.reversed', idempotency_key = idempotency_key || '#rev:' || ?, last_error = ?, updated_at = ? WHERE company_id = ? AND kind = 'finance.journal' AND target_ref = ?").bind(r.reversalId, reason.slice(0, 200), at, c.a.companyId, jid),
      auditStmt(db, { orgId: t.org.id, actorId: c.user.id, action: 'journal.reversed', targetType: 'journal', targetId: jid, metadata: { source: 'erp', object: c.def.key, record: c.row.number, reversalId: r.reversalId } }),
      eventStmt(db, { companyId: c.a.companyId, actorId: c.user.id, action: 'record.unposted', entityType: 'record', entityId: c.row.id, summary: `Finance journal reversed (${t.org.name})${reason ? `: ${reason}` : ''}`.slice(0, 500), at }),
    ]);
    reversed++;
  }
  return { reversed, workspace: t.org, url: `/erp/finance/o/${t.org.id}/accounting/journals` };
}

/** Whether anything of the record is posted and not reversed (for the steps that would contradict the ledger). */
export async function isPosted(db: D1Database, companyId: string, object: string, id: string, parts?: (part: string) => boolean): Promise<boolean> {
  const done = await postedParts(db, companyId, object, id);
  return parts ? [...done].some(parts) : done.size > 0;
}
