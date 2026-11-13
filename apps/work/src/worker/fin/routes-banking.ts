// Bank statements and reconciliation. A person downloads a statement from their internet banking and uploads it (CSV,
// OFX or QIF): BIZOMAT never connects to a bank and never asks for banking passwords. Each line is then matched to a
// transaction or payment already recorded, or becomes a new transaction; matched entries are marked reconciled, and a
// reconciliation compares the statement balance with the ledger.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, placeholders } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { addDays } from '../../shared/fin/dates';
import { type CsvMapping, type ParsedStatement, dedupeKeys, guessMapping, parseCsvStatement, parseOfx, parseQif, readCsv } from '../../shared/fin/statement';
import { type FinAccess, deny, requireOrg, requirePerm } from './access';
import { accountBalances, chartOf, natural } from './ledger';
import { createTransaction, moneyAccount, postsDirectly, suggest } from './transactions';
import { auditStmt, runBatch } from './util';

export const bankingRoutes = new Hono<AppEnv>();

const id = () => z.string().max(64);
const isoDate = () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date as YYYY-MM-DD');

const mappingSchema = z.object({
  date: z.number().int().min(0).max(100),
  amount: z.number().int().min(0).max(100).optional(),
  debit: z.number().int().min(0).max(100).optional(),
  credit: z.number().int().min(0).max(100).optional(),
  description: z.number().int().min(0).max(100).optional(),
  payee: z.number().int().min(0).max(100).optional(),
  reference: z.number().int().min(0).max(100).optional(),
  dateFormat: z.enum(['dmy', 'mdy', 'ymd']).optional(),
  hasHeader: z.boolean().optional(),
  invert: z.boolean().optional(),
});

const fileSchema = z.object({
  format: z.enum(['csv', 'ofx', 'qif']),
  filename: z.string().trim().max(200).optional(),
  text: z.string().max(3_000_000, 'The file is too large (3 MB at most)'),
  mapping: mappingSchema.optional(),
  dateFormat: z.enum(['dmy', 'mdy', 'ymd']).optional(),
});

function parse(input: z.infer<typeof fileSchema>): ParsedStatement & { header?: string[]; mapping?: CsvMapping } {
  if (input.format === 'ofx') return parseOfx(input.text);
  if (input.format === 'qif') return parseQif(input.text, input.dateFormat ?? 'dmy');
  const header = readCsv(input.text)[0] ?? [];
  const mapping = input.mapping ?? guessMapping(header);
  return { ...parseCsvStatement(input.text, mapping), header, mapping };
}

async function statementAccount(c: any, a: FinAccess) {
  const chart = await chartOf(c.env.DB, a);
  return moneyAccount(chart, c.req.param('id'));
}

bankingRoutes.post('/orgs/:org/accounts/:id/statement/preview', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'banking', 'import', 'You cannot import bank statements');
  const acc = await statementAccount(c, a);
  const input = await body(c, fileSchema);
  const parsed = parse(input);
  const keys = dedupeKeys(parsed.rows);
  const existing = keys.length ? await c.env.DB.prepare(`SELECT dedupe_key FROM fin_statement_lines WHERE org_id = ? AND account_id = ? AND dedupe_key IN (${placeholders(Math.min(keys.length, 900))})`).bind(a.orgId, acc.id, ...keys.slice(0, 900)).all<{ dedupe_key: string }>() : { results: [] };
  const seen = new Set(existing.results.map((r) => r.dedupe_key));
  return c.json({
    header: parsed.header,
    mapping: parsed.mapping,
    errors: parsed.errors.slice(0, 50),
    rows: parsed.rows.slice(0, 500).map((r, i) => ({ ...r, duplicate: seen.has(keys[i]) })),
    total: parsed.rows.length,
    duplicates: keys.filter((k) => seen.has(k)).length,
  });
});

bankingRoutes.post('/orgs/:org/accounts/:id/statement/import', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'banking', 'import', 'You cannot import bank statements');
  await rateLimit(c.env.DB, `fin-statement:${a.userId}`, 30, 3_600_000);
  const acc = await statementAccount(c, a);
  const input = await body(c, fileSchema);
  const parsed = parse(input);
  if (!parsed.rows.length) throw new HttpError(400, parsed.errors[0]?.message ?? 'No transactions found in the file');
  if (parsed.rows.length > 5000) throw new HttpError(400, 'Import at most 5,000 lines at a time');
  const keys = dedupeKeys(parsed.rows);
  const importId = newId();
  const t = now();
  const inserts = parsed.rows.map((r, i) =>
    c.env.DB.prepare('INSERT OR IGNORE INTO fin_statement_lines (id, org_id, account_id, import_id, date, amount, description, payee, reference, dedupe_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.orgId, acc.id, importId, r.date, r.amount, r.description, r.payee, r.reference, keys[i], t),
  );
  await c.env.DB.prepare('INSERT INTO fin_statement_imports (id, org_id, account_id, filename, format, rows, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(importId, a.orgId, acc.id, (input.filename ?? '').slice(0, 200), input.format, parsed.rows.length, a.userId, t).run();
  let imported = 0;
  for (let i = 0; i < inserts.length; i += 200) imported += (await c.env.DB.batch(inserts.slice(i, i + 200))).reduce((n, r) => n + (r.meta.changes ?? 0), 0);
  const duplicates = parsed.rows.length - imported;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_statement_imports SET imported = ?, duplicates = ? WHERE id = ?').bind(imported, duplicates, importId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'statement.imported', targetType: 'account', targetId: acc.id, metadata: { format: input.format, rows: parsed.rows.length, imported, duplicates } }),
  ]);
  return c.json({ importId, imported, duplicates, errors: parsed.errors.slice(0, 50) }, 201);
});

interface Candidate {
  type: 'transaction' | 'payment';
  id: string;
  date: string;
  amount: number;
  description: string;
}

/** Posted, unreconciled entries on a money account, signed as the bank sees them (money in positive). */
async function openEntries(db: D1Database, a: FinAccess, accountId: string, from: string, to: string): Promise<Candidate[]> {
  const [tx, pay] = await Promise.all([
    db
      .prepare(
        `SELECT id, kind, account_id, to_account_id, date, total, payee, description FROM fin_transactions
         WHERE org_id = ? AND status = 'posted' AND reconciled = 0 AND deleted_at IS NULL AND (account_id = ? OR to_account_id = ?) AND date BETWEEN ? AND ?`,
      )
      .bind(a.orgId, accountId, accountId, from, to)
      .all<any>(),
    db
      .prepare(
        `SELECT p.id, p.date, p.amount, d.kind, d.number, ct.name AS contact FROM fin_payments p JOIN fin_docs d ON d.id = p.doc_id LEFT JOIN fin_contacts ct ON ct.id = d.contact_id
         WHERE p.org_id = ? AND p.account_id = ? AND p.voided_at IS NULL AND p.reconciled = 0 AND p.date BETWEEN ? AND ?`,
      )
      .bind(a.orgId, accountId, from, to)
      .all<any>(),
  ]);
  const out: Candidate[] = [];
  for (const t of tx.results) {
    const sign = t.kind === 'receive' ? 1 : t.kind === 'spend' ? -1 : t.to_account_id === accountId ? 1 : -1;
    out.push({ type: 'transaction', id: t.id, date: t.date, amount: sign * t.total, description: t.description || t.payee || (t.kind === 'transfer' ? 'Transfer' : '') });
  }
  for (const p of pay.results) out.push({ type: 'payment', id: p.id, date: p.date, amount: (p.kind === 'invoice' ? 1 : -1) * p.amount, description: `Payment ${p.number}${p.contact ? `, ${p.contact}` : ''}` });
  return out;
}

bankingRoutes.get('/orgs/:org/accounts/:id/statement', async (c) => {
  const a = await requireOrg(c);
  if (a.perms.banking.view !== 'all') deny('You cannot see bank statements');
  const acc = await statementAccount(c, a);
  const status = c.req.query('status') ?? 'unmatched';
  const where = ['org_id = ?', 'account_id = ?'];
  const args: unknown[] = [a.orgId, acc.id];
  if (status !== 'all') {
    where.push('status = ?');
    args.push(status);
  }
  const rows = await c.env.DB.prepare(`SELECT * FROM fin_statement_lines WHERE ${where.join(' AND ')} ORDER BY date DESC, created_at DESC LIMIT 300`).bind(...args).all<any>();
  const lines = rows.results;
  let candidates: Candidate[] = [];
  if (status === 'unmatched' && lines.length) {
    const dates = lines.map((l) => l.date).sort();
    candidates = await openEntries(c.env.DB, a, acc.id, addDays(dates[0], -10), addDays(dates[dates.length - 1], 10));
  }
  const out = [];
  for (const l of lines) {
    const matches = status === 'unmatched' ? candidates.filter((x) => x.amount === l.amount && Math.abs(new Date(x.date).getTime() - new Date(l.date).getTime()) <= 10 * 86_400_000).slice(0, 3) : [];
    const suggestions = status === 'unmatched' && !matches.length ? await suggest(c.env.DB, a, `${l.payee} ${l.description}`, l.amount > 0 ? 'in' : 'out') : [];
    out.push({ id: l.id, date: l.date, amount: l.amount, description: l.description, payee: l.payee, reference: l.reference, status: l.status, matchedType: l.matched_type, matchedId: l.matched_id, matches, suggestions });
  }
  const counts = await c.env.DB.prepare('SELECT status, COUNT(*) AS n FROM fin_statement_lines WHERE org_id = ? AND account_id = ? GROUP BY status').bind(a.orgId, acc.id).all<{ status: string; n: number }>();
  return c.json({ lines: out, counts: Object.fromEntries(counts.results.map((r) => [r.status, r.n])) });
});

async function loadLine(c: any, a: FinAccess) {
  const l = await c.env.DB.prepare('SELECT * FROM fin_statement_lines WHERE id = ? AND org_id = ?').bind(c.req.param('lineId'), a.orgId).first();
  if (!l) throw notFound('Statement line');
  return l as any;
}

bankingRoutes.post('/orgs/:org/statement-lines/:lineId/match', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.banking.approve) deny('You cannot reconcile');
  const line = await loadLine(c, a);
  if (line.status !== 'unmatched') throw new HttpError(409, 'This line is already matched or ignored');
  const input = await body(c, z.object({ type: z.enum(['transaction', 'payment']), id: id() }));
  const open = await openEntries(c.env.DB, a, line.account_id, '0000-01-01', '9999-12-31');
  const target = open.find((x) => x.type === input.type && x.id === input.id);
  if (!target) throw new HttpError(400, 'Choose a posted, unreconciled entry on this account');
  if (target.amount !== line.amount) throw new HttpError(400, 'The amounts differ');
  await runBatch(c.env.DB, [
    c.env.DB.prepare("UPDATE fin_statement_lines SET status = 'matched', matched_type = ?, matched_id = ? WHERE id = ? AND org_id = ?").bind(input.type, input.id, line.id, a.orgId),
    c.env.DB.prepare(`UPDATE ${input.type === 'transaction' ? 'fin_transactions' : 'fin_payments'} SET reconciled = 1 WHERE id = ? AND org_id = ?`).bind(input.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'statement.matched', targetType: input.type, targetId: input.id, metadata: { line: line.id } }),
  ]);
  return c.json({ ok: true });
});

/** A new transaction from a statement line (categorised, or a transfer), posted, matched and reconciled. */
bankingRoutes.post('/orgs/:org/statement-lines/:lineId/create', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.banking.approve && !postsDirectly(a)) deny('Ask someone who can approve transactions to post this line');
  const line = await loadLine(c, a);
  if (line.status !== 'unmatched') throw new HttpError(409, 'This line is already matched or ignored');
  const input = await body(
    c,
    z.object({
      accountId: id().optional(),
      transferAccountId: id().optional(),
      taxCodeId: id().nullable().optional(),
      contactId: id().nullable().optional(),
      description: z.string().trim().max(500).optional(),
      remember: z.boolean().optional(),
    }),
  );
  if (!input.accountId && !input.transferAccountId) throw new HttpError(400, 'Choose a category, or the account of a transfer');
  const amount = Math.abs(line.amount);
  const inflow = line.amount > 0;
  const base = { date: line.date, payee: line.payee, reference: line.reference, description: input.description ?? line.description, contactId: input.contactId ?? null, action: 'post' as const };
  const tx = input.transferAccountId
    ? { ...base, kind: 'transfer' as const, accountId: inflow ? input.transferAccountId : line.account_id, toAccountId: inflow ? line.account_id : input.transferAccountId, amount }
    : { ...base, kind: inflow ? ('receive' as const) : ('spend' as const), accountId: line.account_id, taxMode: 'inclusive' as const, lines: [{ accountId: input.accountId!, amount, taxCodeId: input.taxCodeId ?? null, description: input.description ?? line.description }] };
  const r = await createTransaction(c.env, a, tx);
  if (r.status !== 'posted') throw new HttpError(409, 'The transaction needs approval before it can be matched');
  const extra: D1PreparedStatement[] = [
    c.env.DB.prepare("UPDATE fin_statement_lines SET status = 'matched', matched_type = 'transaction', matched_id = ? WHERE id = ? AND org_id = ?").bind(r.id, line.id, a.orgId),
    c.env.DB.prepare('UPDATE fin_transactions SET reconciled = 1 WHERE id = ? AND org_id = ?').bind(r.id, a.orgId),
  ];
  // "Remember": a rule so the next line with this payee gets the same category.
  const key = (line.payee || line.description || '').toLowerCase().trim().slice(0, 60);
  if (input.remember && input.accountId && key.length >= 2) {
    extra.push(c.env.DB.prepare('INSERT INTO fin_rules (id, org_id, match_text, direction, account_id, tax_code_id, contact_id, position, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1000, ?, ?)').bind(newId(), a.orgId, key, inflow ? 'in' : 'out', input.accountId, a.gst ? (input.taxCodeId ?? null) : null, input.contactId ?? null, a.userId, now()));
  }
  await runBatch(c.env.DB, extra);
  return c.json({ id: r.id }, 201);
});

bankingRoutes.post('/orgs/:org/statement-lines/:lineId/ignore', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.banking.approve) deny('You cannot reconcile');
  const line = await loadLine(c, a);
  const { ignored } = await body(c, z.object({ ignored: z.boolean() }));
  if (line.status === 'matched') throw new HttpError(409, 'Unmatch the line first');
  await c.env.DB.prepare('UPDATE fin_statement_lines SET status = ? WHERE id = ? AND org_id = ?').bind(ignored ? 'ignored' : 'unmatched', line.id, a.orgId).run();
  return c.json({ ok: true });
});

bankingRoutes.post('/orgs/:org/statement-lines/:lineId/unmatch', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.banking.approve) deny('You cannot reconcile');
  const line = await loadLine(c, a);
  if (line.status !== 'matched') throw new HttpError(409, 'This line is not matched');
  await runBatch(c.env.DB, [
    c.env.DB.prepare("UPDATE fin_statement_lines SET status = 'unmatched', matched_type = NULL, matched_id = NULL WHERE id = ? AND org_id = ?").bind(line.id, a.orgId),
    c.env.DB.prepare(`UPDATE ${line.matched_type === 'payment' ? 'fin_payments' : 'fin_transactions'} SET reconciled = 0 WHERE id = ? AND org_id = ?`).bind(line.matched_id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'statement.unmatched', targetType: line.matched_type, targetId: line.matched_id }),
  ]);
  return c.json({ ok: true });
});

/** Where the account stands on a date: the ledger balance, what is not yet reconciled, and lines still to match. */
bankingRoutes.get('/orgs/:org/accounts/:id/reconcile', async (c) => {
  const a = await requireOrg(c);
  if (a.perms.banking.view !== 'all') deny('You cannot reconcile');
  const acc = await statementAccount(c, a);
  const date = c.req.query('date') ?? '9999-12-31';
  const bal = (await accountBalances(c.env.DB, a.orgId, { to: date, accountIds: [acc.id] })).get(acc.id) ?? 0;
  const open = await openEntries(c.env.DB, a, acc.id, '0000-01-01', date);
  const unmatched = await c.env.DB.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(amount), 0) AS total FROM fin_statement_lines WHERE org_id = ? AND account_id = ? AND status = 'unmatched' AND date <= ?").bind(a.orgId, acc.id, date).first<{ n: number; total: number }>();
  const history = await c.env.DB.prepare('SELECT r.*, u.name AS by_name FROM fin_reconciliations r LEFT JOIN users u ON u.id = r.created_by WHERE r.org_id = ? AND r.account_id = ? ORDER BY r.statement_date DESC, r.created_at DESC LIMIT 24').bind(a.orgId, acc.id).all<any>();
  return c.json({
    ledgerBalance: natural(acc.type, bal),
    // Bank-side balance: money in positive. A credit card or loan reads as a negative balance at the bank.
    bankSideBalance: bal,
    unreconciled: { count: open.length, total: open.reduce((n, x) => n + x.amount, 0), items: open.slice(0, 100) },
    unmatchedLines: { count: unmatched?.n ?? 0, total: unmatched?.total ?? 0 },
    history: history.results.map((r) => ({ id: r.id, statementDate: r.statement_date, statementBalance: r.statement_balance, ledgerBalance: r.ledger_balance, difference: r.statement_balance - r.ledger_balance, by: r.by_name, at: r.created_at })),
  });
});

/** Record a reconciliation: the statement's closing balance on a date against the ledger's (money in positive). */
bankingRoutes.post('/orgs/:org/accounts/:id/reconcile', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.banking.approve) deny('You cannot reconcile');
  const acc = await statementAccount(c, a);
  const input = await body(c, z.object({ statementDate: isoDate(), statementBalance: z.number().int().min(-1_000_000_000_000).max(1_000_000_000_000) }));
  const bal = (await accountBalances(c.env.DB, a.orgId, { to: input.statementDate, accountIds: [acc.id] })).get(acc.id) ?? 0;
  const rid = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO fin_reconciliations (id, org_id, account_id, statement_date, statement_balance, ledger_balance, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(rid, a.orgId, acc.id, input.statementDate, input.statementBalance, bal, a.userId, now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'account.reconciled', targetType: 'account', targetId: acc.id, after: { ...input, ledgerBalance: bal, difference: input.statementBalance - bal } }),
  ]);
  return c.json({ id: rid, ledgerBalance: bal, difference: input.statementBalance - bal, balanced: input.statementBalance === bal }, 201);
});
