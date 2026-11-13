// The BIZOMAT Finance ledger: double-entry journals built from transactions, invoices, bills, expense claims and
// payments, validated here and posted in one transaction. The database checks the same rules again
// (migrations/0011_finance.sql): a journal posts only when it balances, nothing posts into a locked period, and a
// posted journal never changes: corrections are reversing journals.

import { HttpError, newId, notFound, now } from '../lib/util';
import { isIsoDate } from '../../shared/fin/dates';
import { SUBTYPES, type SystemKey } from '../../shared/fin/charts';
import { codeFits, splitTax, type TaxMode } from '../../shared/fin/tax';
import { lineTotal } from '../../shared/crm/money';
import type { FinAccess } from './access';

export interface AccountRow {
  id: string;
  org_id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subtype: string;
  parent_id: string | null;
  description: string;
  tax_code_id: string | null;
  system_key: SystemKey | null;
  bank_name: string;
  bank_number: string;
  is_default: number;
  position: number;
  archived_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface TaxCodeRow {
  id: string;
  org_id: string;
  code: string;
  name: string;
  rate_bp: number;
  direction: 'sales' | 'purchases' | 'both';
  bas_json: string;
  system_key: string | null;
  archived_at: number | null;
  created_at: number;
}

export interface Chart {
  accounts: Map<string, AccountRow>;
  system: Map<SystemKey, AccountRow>;
  taxCodes: Map<string, TaxCodeRow>;
}

/** The workspace's accounts and tax codes, read once per request. */
export async function chartOf(db: D1Database, a: FinAccess): Promise<Chart> {
  const cached = (a as any).__chart as Chart | undefined;
  if (cached) return cached;
  const [acc, tax] = await Promise.all([
    db.prepare('SELECT * FROM fin_accounts WHERE org_id = ? ORDER BY type, position, code').bind(a.orgId).all<AccountRow>(),
    db.prepare('SELECT * FROM fin_tax_codes WHERE org_id = ? ORDER BY direction, code').bind(a.orgId).all<TaxCodeRow>(),
  ]);
  const chart: Chart = { accounts: new Map(acc.results.map((r) => [r.id, r])), system: new Map(), taxCodes: new Map(tax.results.map((t) => [t.id, t])) };
  for (const r of acc.results) if (r.system_key) chart.system.set(r.system_key, r);
  (a as any).__chart = chart;
  return chart;
}

export function forgetChart(a: FinAccess) {
  delete (a as any).__chart;
}

export function systemAccount(chart: Chart, key: SystemKey): AccountRow {
  const acc = chart.system.get(key);
  if (!acc) throw new HttpError(409, `This workspace has no ${key === 'ar' ? 'accounts receivable' : key === 'ap' ? 'accounts payable' : key === 'gst' ? 'GST' : key === 'claims' ? 'expense claims payable' : key} account`);
  return acc;
}

export const isMoney = (acc: AccountRow) => !!SUBTYPES[acc.subtype]?.money;

export interface LedgerLine {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
  taxCodeId?: string | null;
  /** The tax included with this line, signed like the line: debit positive, credit negative. */
  taxAmount?: number;
  contactId?: string | null;
  departmentId?: string | null;
  projectId?: string | null;
  costCentreId?: string | null;
  personId?: string | null;
}

/** A signed amount as one side of a line: positive is a debit, negative a credit. */
export function side(amount: number): { debit: number; credit: number } {
  return amount >= 0 ? { debit: amount, credit: 0 } : { debit: 0, credit: -amount };
}

export const MAX_AMOUNT = 1_000_000_000_000; // ten billion dollars, in cents

/** The lock date as a refusal for a date on or before it. */
export function assertOpenPeriod(a: FinAccess, date: string) {
  if (!isIsoDate(date)) throw new HttpError(400, 'Use a valid date (YYYY-MM-DD)');
  if (a.org.lock_date && date <= a.org.lock_date) throw new HttpError(409, `The books are locked up to ${a.org.lock_date}. Use a later date, or ask an accountant to change the lock date.`);
}

/** Every rule the database also checks, with a clear message, before anything is written. */
export function validateJournal(a: FinAccess, chart: Chart, date: string, lines: LedgerLine[], opts: { allowArchived?: boolean } = {}) {
  assertOpenPeriod(a, date);
  if (lines.length < 2) throw new HttpError(400, 'A journal needs at least two lines');
  let dr = 0;
  let cr = 0;
  for (const l of lines) {
    if (!Number.isSafeInteger(l.debit) || !Number.isSafeInteger(l.credit) || l.debit < 0 || l.credit < 0 || (l.debit > 0) === (l.credit > 0)) throw new HttpError(400, 'Each line is either a debit or a credit, in whole cents');
    if (l.debit > MAX_AMOUNT || l.credit > MAX_AMOUNT) throw new HttpError(400, 'Amount is too large');
    const acc = chart.accounts.get(l.accountId);
    if (!acc) throw new HttpError(400, 'Choose accounts from this workspace');
    if (acc.archived_at && !opts.allowArchived) throw new HttpError(400, `The account ${acc.name} is archived`);
    if (l.taxCodeId && !chart.taxCodes.has(l.taxCodeId)) throw new HttpError(400, 'Choose tax codes from this workspace');
    dr += l.debit;
    cr += l.credit;
  }
  if (dr !== cr) throw new HttpError(400, `The journal does not balance: debits ${dr / 100} and credits ${cr / 100}`);
}

/** Statements that insert a journal as a draft, add its lines and post it (the database checks the balance). */
export function journalStmts(db: D1Database, j: { id: string; orgId: string; date: string; sourceType: string; sourceId?: string | null; memo?: string; createdBy: string | null; lines: LedgerLine[]; reversesId?: string | null }): D1PreparedStatement[] {
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO fin_journals (id, org_id, number, date, source_type, source_id, memo, status, reverses_id, created_by, created_at)
         VALUES (?, ?, (SELECT COALESCE(MAX(number), 0) + 1 FROM fin_journals WHERE org_id = ?), ?, ?, ?, ?, 'draft', ?, ?, ?)`,
      )
      .bind(j.id, j.orgId, j.orgId, j.date, j.sourceType, j.sourceId ?? null, (j.memo ?? '').slice(0, 500), j.reversesId ?? null, j.createdBy, t),
  ];
  j.lines.forEach((l, i) => {
    stmts.push(
      db
        .prepare(
          `INSERT INTO fin_journal_lines (id, org_id, journal_id, line_no, account_id, debit, credit, description, tax_code_id, tax_amount, contact_id, department_id, project_id, cost_centre_id, person_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(newId(), j.orgId, j.id, i + 1, l.accountId, l.debit, l.credit, (l.description ?? '').slice(0, 500), l.taxCodeId ?? null, l.taxAmount ?? 0, l.contactId ?? null, l.departmentId ?? null, l.projectId ?? null, l.costCentreId ?? null, l.personId ?? null),
    );
  });
  stmts.push(db.prepare("UPDATE fin_journals SET status = 'posted', posted_at = ? WHERE id = ? AND org_id = ?").bind(t, j.id, j.orgId));
  return stmts;
}

interface JournalRow {
  id: string;
  org_id: string;
  number: number;
  date: string;
  source_type: string;
  source_id: string | null;
  memo: string;
  status: string;
  reverses_id: string | null;
  reversed_by_id: string | null;
}

/**
 * A reversing journal for a posted one: every line on the other side, dated the original's date, or `date` when the
 * original's period is locked (or a date is chosen). The original is marked as reversed, never changed.
 */
export async function reversalStmts(db: D1Database, a: FinAccess, journalId: string, opts: { date?: string | null; memo?: string } = {}) {
  const j = await db.prepare('SELECT * FROM fin_journals WHERE id = ? AND org_id = ?').bind(journalId, a.orgId).first<JournalRow>();
  if (!j || j.status !== 'posted') throw notFound('Journal');
  if (j.reversed_by_id) throw new HttpError(409, 'This entry has already been reversed');
  const date = opts.date || j.date;
  if (a.org.lock_date && date <= a.org.lock_date) {
    throw new HttpError(409, opts.date ? `The books are locked up to ${a.org.lock_date}. Choose a later date.` : `This entry is in a locked period (up to ${a.org.lock_date}). Choose a later date for the reversal.`, { code: 'PERIOD_LOCKED', lockDate: a.org.lock_date });
  }
  if (!isIsoDate(date)) throw new HttpError(400, 'Use a valid date (YYYY-MM-DD)');
  const rows = await db.prepare('SELECT * FROM fin_journal_lines WHERE journal_id = ? AND org_id = ? ORDER BY line_no').bind(j.id, a.orgId).all<any>();
  const lines: LedgerLine[] = rows.results.map((l) => ({
    accountId: l.account_id,
    debit: l.credit,
    credit: l.debit,
    description: l.description,
    taxCodeId: l.tax_code_id,
    taxAmount: -l.tax_amount,
    contactId: l.contact_id,
    departmentId: l.department_id,
    projectId: l.project_id,
    costCentreId: l.cost_centre_id,
    personId: l.person_id,
  }));
  const id = newId();
  const stmts = [
    ...journalStmts(db, { id, orgId: a.orgId, date, sourceType: 'reversal', sourceId: j.source_id, memo: opts.memo ?? `Reversal of journal ${j.number}`, createdBy: a.userId, lines, reversesId: j.id }),
    db.prepare('UPDATE fin_journals SET reversed_by_id = ? WHERE id = ? AND org_id = ? AND reversed_by_id IS NULL').bind(id, j.id, a.orgId),
  ];
  return { stmts, reversalId: id, date };
}

// ------------------------------------------------------------------ amounts with tax

export interface AmountLineInput {
  accountId: string;
  description?: string;
  /** As entered: including or excluding tax per the record's tax mode. */
  amount: number;
  taxCodeId?: string | null;
  departmentId?: string | null;
  projectId?: string | null;
  costCentreId?: string | null;
}

export interface PricedLine extends AmountLineInput {
  net: number;
  tax: number;
}

/**
 * Net and tax for each line. Without GST (personal and household workspaces, or a business not registered) the tax
 * mode is "none" and no tax code applies. A tax code must suit the direction (sales for money in, purchases for money
 * out) and come from this workspace.
 */
export function priceLines(a: FinAccess, chart: Chart, lines: AmountLineInput[], mode: TaxMode, use: 'sales' | 'purchases'): { lines: PricedLine[]; mode: TaxMode; subtotal: number; tax: number; total: number } {
  const effective: TaxMode = a.gst ? mode : 'none';
  const out: PricedLine[] = [];
  for (const l of lines) {
    const acc = chart.accounts.get(l.accountId);
    if (!acc) throw new HttpError(400, 'Choose a category or account from this workspace');
    if (acc.archived_at) throw new HttpError(400, `The account ${acc.name} is archived`);
    if (!Number.isSafeInteger(l.amount) || Math.abs(l.amount) > MAX_AMOUNT) throw new HttpError(400, 'Amounts are whole cents');
    let taxCodeId = a.gst ? (l.taxCodeId ?? null) : null;
    let rate = 0;
    if (taxCodeId) {
      const tc = chart.taxCodes.get(taxCodeId);
      if (!tc) throw new HttpError(400, 'Choose a tax code from this workspace');
      if (tc.archived_at) throw new HttpError(400, `The tax code ${tc.code} is archived`);
      if (!codeFits(tc.direction, use)) throw new HttpError(400, `${tc.code} is a ${tc.direction === 'sales' ? 'sales' : 'purchases'} tax code`);
      rate = tc.rate_bp;
    } else taxCodeId = null;
    const s = splitTax(l.amount, rate, effective);
    out.push({ ...l, taxCodeId, net: s.net, tax: s.tax });
  }
  const subtotal = out.reduce((n, l) => n + l.net, 0);
  const tax = out.reduce((n, l) => n + l.tax, 0);
  return { lines: out, mode: effective, subtotal, tax, total: subtotal + tax };
}

/** A document line's amount before tax: unit price x quantity, less the discount. */
export function docLineAmount(unitPrice: number, quantityMilli: number, discountBp: number): number {
  return lineTotal(unitPrice, quantityMilli, discountBp);
}

// ------------------------------------------------------------------ the entries each record posts

/**
 * Money in (receive): the money account up by the total, each category credited with its net, GST credited with the
 * tax. Money out (spend): the reverse. A transfer: one money account up, the other down.
 */
export function transactionLines(
  chart: Chart,
  tx: { kind: 'receive' | 'spend' | 'transfer'; accountId: string; toAccountId?: string | null; total: number; contactId?: string | null; personId?: string | null; description?: string },
  lines: PricedLine[],
): LedgerLine[] {
  const base = { contactId: tx.contactId ?? null, personId: tx.personId ?? null };
  if (tx.kind === 'transfer') {
    if (!tx.toAccountId) throw new HttpError(400, 'Choose the account the money goes to');
    return [
      { ...side(tx.total), accountId: tx.toAccountId, description: tx.description, ...base },
      { ...side(-tx.total), accountId: tx.accountId, description: tx.description, ...base },
    ];
  }
  const dir = tx.kind === 'receive' ? -1 : 1; // categories: credit for money in, debit for money out
  const out: LedgerLine[] = [{ ...side(-dir * tx.total), accountId: tx.accountId, description: tx.description, ...base }];
  let tax = 0;
  for (const l of lines) {
    if (l.net === 0 && l.tax === 0) continue;
    tax += l.tax;
    if (l.net !== 0) out.push({ ...side(dir * l.net), accountId: l.accountId, description: l.description || tx.description, taxCodeId: l.taxCodeId, taxAmount: dir * l.tax, departmentId: l.departmentId, projectId: l.projectId, costCentreId: l.costCentreId, ...base });
  }
  if (tax !== 0) out.push({ ...side(dir * tax), accountId: systemAccount(chart, 'gst').id, description: 'GST', ...base });
  return out;
}

/**
 * An approved invoice: receivable up by the total (for the customer), income credited, GST credited. A bill: payable up,
 * expenses debited, GST debited. An expense claim: the same against expense claims payable, for the person reimbursed.
 */
export function documentLines(chart: Chart, doc: { kind: 'invoice' | 'bill' | 'expense_claim'; total: number; contactId?: string | null; claimantId?: string | null; number: string }, lines: PricedLine[]): LedgerLine[] {
  const control = systemAccount(chart, doc.kind === 'invoice' ? 'ar' : doc.kind === 'bill' ? 'ap' : 'claims');
  const dir = doc.kind === 'invoice' ? -1 : 1;
  const base = { contactId: doc.contactId ?? null, personId: doc.claimantId ?? null };
  const out: LedgerLine[] = [{ ...side(-dir * doc.total), accountId: control.id, description: doc.number, ...base }];
  let tax = 0;
  for (const l of lines) {
    tax += l.tax;
    if (l.net !== 0) out.push({ ...side(dir * l.net), accountId: l.accountId, description: l.description || doc.number, taxCodeId: l.taxCodeId, taxAmount: dir * l.tax, departmentId: l.departmentId, projectId: l.projectId, costCentreId: l.costCentreId, ...base });
  }
  if (tax !== 0) out.push({ ...side(dir * tax), accountId: systemAccount(chart, 'gst').id, description: `GST ${doc.number}`, ...base });
  return out;
}

/** A payment: money in against a receivable, or money out against a payable or an expense claim. */
export function paymentLines(chart: Chart, p: { kind: 'invoice' | 'bill' | 'expense_claim'; accountId: string; amount: number; contactId?: string | null; claimantId?: string | null; description: string }): LedgerLine[] {
  const control = systemAccount(chart, p.kind === 'invoice' ? 'ar' : p.kind === 'bill' ? 'ap' : 'claims');
  const base = { contactId: p.contactId ?? null, personId: p.claimantId ?? null, description: p.description };
  if (p.kind === 'invoice') return [{ ...side(p.amount), accountId: p.accountId, ...base }, { ...side(-p.amount), accountId: control.id, ...base }];
  return [{ ...side(p.amount), accountId: control.id, ...base }, { ...side(-p.amount), accountId: p.accountId, ...base }];
}

// ------------------------------------------------------------------ balances

/** Debit-minus-credit balance per account up to a date (posted journals only). */
export async function accountBalances(db: D1Database, orgId: string, opts: { to?: string; from?: string; accountIds?: string[] } = {}): Promise<Map<string, number>> {
  const where = ['l.org_id = ?', "j.status = 'posted'"];
  const args: unknown[] = [orgId];
  if (opts.to) {
    where.push('j.date <= ?');
    args.push(opts.to);
  }
  if (opts.from) {
    where.push('j.date >= ?');
    args.push(opts.from);
  }
  if (opts.accountIds?.length) {
    where.push(`l.account_id IN (${opts.accountIds.map(() => '?').join(', ')})`);
    args.push(...opts.accountIds);
  }
  const rows = await db
    .prepare(`SELECT l.account_id, SUM(l.debit) - SUM(l.credit) AS bal FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id WHERE ${where.join(' AND ')} GROUP BY l.account_id`)
    .bind(...args)
    .all<{ account_id: string; bal: number }>();
  return new Map(rows.results.map((r) => [r.account_id, r.bal]));
}

/** A balance as people read it: assets and expenses debit-positive, the rest credit-positive. */
export function natural(type: AccountRow['type'], debitMinusCredit: number): number {
  // `+ 0` turns -0 into 0, so a zero balance never reads "-$0".
  return (type === 'asset' || type === 'expense' ? debitMinusCredit : -debitMinusCredit) + 0;
}
