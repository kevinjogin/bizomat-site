// BIZOMAT Finance set-up: the chart of accounts (categories and money accounts, with opening balances), tax codes,
// departments, projects and cost centres, customers and suppliers, invoice templates, categorisation rules, document
// numbering, the period lock and manual journals.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, placeholders } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { SUBTYPES, SUBTYPE_KEYS } from '../../shared/fin/charts';
import { BAS_ORDER, basOf } from '../../shared/fin/tax';
import { DOC_KINDS, type DocKind } from '../../shared/fin/settings';
import { todayIn } from '../../shared/fin/dates';
import { type FinAccess, assertRecord, deny, hasPerm, requireBusiness, requireOrg, requirePerm, scopeSql } from './access';
import { type AccountRow, type LedgerLine, accountBalances, chartOf, forgetChart, journalStmts, natural, reversalStmts, side, validateJournal } from './ledger';
import { auditStmt, csvOf, runBatch, searchText } from './util';

export const setupRoutes = new Hono<AppEnv>();

const text = (max: number) => z.string().trim().max(max);
const id = () => z.string().max(64);
const money = () => z.number().int().min(-1_000_000_000_000).max(1_000_000_000_000);
const isoDate = () => z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date as YYYY-MM-DD');

export function accountDTO(r: AccountRow, balance?: number) {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    type: r.type,
    subtype: r.subtype,
    parentId: r.parent_id,
    description: r.description,
    taxCodeId: r.tax_code_id,
    systemKey: r.system_key,
    bankName: r.bank_name,
    bankNumber: r.bank_number,
    isDefault: !!r.is_default,
    position: r.position,
    archived: !!r.archived_at,
    money: !!SUBTYPES[r.subtype]?.money,
    balance: balance === undefined ? undefined : natural(r.type, balance),
  };
}

/** Balances are shown to people who can see the whole picture (reports, accounting, or every transaction). */
export function seesBalances(a: FinAccess): boolean {
  return a.perms.reports.view || a.perms.accounting.view || a.perms.banking.view === 'all';
}

// ------------------------------------------------------------------ chart of accounts

setupRoutes.get('/orgs/:org/accounts', async (c) => {
  const a = await requireOrg(c);
  const chart = await chartOf(c.env.DB, a);
  const balances = seesBalances(a) ? await accountBalances(c.env.DB, a.orgId) : null;
  return c.json([...chart.accounts.values()].map((r) => accountDTO(r, balances ? (balances.get(r.id) ?? 0) : undefined)));
});

const accountInput = z.object({
  code: text(12).min(1, 'Give the account a code').regex(/^[A-Za-z0-9.-]+$/, 'Codes use letters, digits, dots and dashes'),
  name: text(120).min(1, 'Give the account a name'),
  subtype: z.enum(SUBTYPE_KEYS as [string, ...string[]]),
  parentId: id().nullable().optional(),
  description: text(500).optional(),
  taxCodeId: id().nullable().optional(),
  bankName: text(120).optional(),
  bankNumber: text(40).optional(),
  isDefault: z.boolean().optional(),
  position: z.number().int().min(0).max(1_000_000).optional(),
  openingBalance: money().optional(),
  openingDate: isoDate().optional(),
});

async function checkParent(a: FinAccess, chart: Awaited<ReturnType<typeof chartOf>>, parentId: string | null | undefined, type: string, selfId?: string) {
  if (!parentId) return null;
  const p = chart.accounts.get(parentId);
  if (!p) throw new HttpError(400, 'Choose a parent from this workspace');
  if (p.id === selfId) throw new HttpError(400, 'An account cannot be its own parent');
  if (p.type !== type) throw new HttpError(400, 'A subcategory has the same type as its parent');
  if (p.parent_id) throw new HttpError(400, 'Subcategories go one level deep');
  if (selfId && [...chart.accounts.values()].some((x) => x.parent_id === selfId)) throw new HttpError(400, 'This account has subcategories, so it cannot become one');
  void a;
  return p.id;
}

function checkTax(chart: Awaited<ReturnType<typeof chartOf>>, taxCodeId: string | null | undefined) {
  if (!taxCodeId) return null;
  if (!chart.taxCodes.has(taxCodeId)) throw new HttpError(400, 'Choose a tax code from this workspace');
  return taxCodeId;
}

/** Statements for an opening balance: the account against "Opening balances" (equity), as at a date. */
function openingStmts(c: any, a: FinAccess, chart: Awaited<ReturnType<typeof chartOf>>, acc: { id: string; type: string; name: string }, amount: number, date: string) {
  const opening = chart.system.get('opening');
  if (!opening) throw new HttpError(409, 'This workspace has no opening balances account');
  const signed = acc.type === 'asset' || acc.type === 'expense' ? amount : -amount;
  const lines: LedgerLine[] = [
    { ...side(signed), accountId: acc.id, description: `Opening balance: ${acc.name}` },
    { ...side(-signed), accountId: opening.id, description: `Opening balance: ${acc.name}` },
  ];
  validateJournal(a, { ...chart, accounts: new Map([...chart.accounts, [acc.id, { ...(chart.accounts.get(acc.id) ?? ({} as AccountRow)), id: acc.id, archived_at: null } as AccountRow]]) }, date, lines);
  return journalStmts(c.env.DB, { id: newId(), orgId: a.orgId, date, sourceType: 'opening', sourceId: acc.id, memo: `Opening balance: ${acc.name}`, createdBy: a.userId, lines });
}

setupRoutes.post('/orgs/:org/accounts', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change the chart of accounts');
  const input = await body(c, accountInput);
  const chart = await chartOf(c.env.DB, a);
  const type = SUBTYPES[input.subtype].type;
  const parentId = await checkParent(a, chart, input.parentId, type);
  const taxCodeId = a.gst ? checkTax(chart, input.taxCodeId) : null;
  const accId = newId();
  const t = now();
  const stmts: D1PreparedStatement[] = [
    c.env.DB.prepare('INSERT INTO fin_accounts (id, org_id, code, name, type, subtype, parent_id, description, tax_code_id, bank_name, bank_number, is_default, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(
      accId,
      a.orgId,
      input.code,
      input.name,
      type,
      input.subtype,
      parentId,
      input.description ?? '',
      taxCodeId,
      input.bankName ?? '',
      input.bankNumber ?? '',
      input.isDefault ? 1 : 0,
      input.position ?? (chart.accounts.size + 1) * 10,
      t,
      t,
    ),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'account.created', targetType: 'account', targetId: accId, after: { code: input.code, name: input.name, subtype: input.subtype } }),
  ];
  if (input.openingBalance) {
    if (type === 'revenue' || type === 'expense') throw new HttpError(400, 'Income and expense categories start at zero; opening balances are for assets, debts and equity');
    stmts.push(...openingStmts(c, a, chart, { id: accId, type, name: input.name }, input.openingBalance, input.openingDate ?? todayIn(a.org.timezone)));
  }
  if (input.isDefault) stmts.unshift(c.env.DB.prepare('UPDATE fin_accounts SET is_default = 0 WHERE org_id = ? AND type = ?').bind(a.orgId, type));
  await runBatch(c.env.DB, stmts);
  forgetChart(a);
  return c.json({ id: accId }, 201);
});

async function accountUsed(db: D1Database, orgId: string, accountId: string): Promise<boolean> {
  const r = await db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM fin_journal_lines WHERE org_id = ?1 AND account_id = ?2) + (SELECT COUNT(*) FROM fin_transaction_lines WHERE org_id = ?1 AND account_id = ?2)
        + (SELECT COUNT(*) FROM fin_transactions WHERE org_id = ?1 AND (account_id = ?2 OR to_account_id = ?2)) + (SELECT COUNT(*) FROM fin_doc_lines WHERE org_id = ?1 AND account_id = ?2) AS n`,
    )
    .bind(orgId, accountId)
    .first<{ n: number }>();
  return (r?.n ?? 0) > 0;
}

setupRoutes.patch('/orgs/:org/accounts/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change the chart of accounts');
  const input = await body(c, accountInput.partial().omit({ openingBalance: true, openingDate: true }));
  const chart = await chartOf(c.env.DB, a);
  const acc = chart.accounts.get(c.req.param('id'));
  if (!acc) throw notFound('Account');
  let subtype = acc.subtype;
  if (input.subtype && input.subtype !== acc.subtype) {
    if (acc.system_key) throw new HttpError(400, 'The type of this account is fixed: the books need it');
    if (SUBTYPES[input.subtype].type !== acc.type && (await accountUsed(c.env.DB, a.orgId, acc.id))) throw new HttpError(409, 'An account in use keeps its type (asset, liability, equity, income or expense)');
    subtype = input.subtype;
  }
  const type = SUBTYPES[subtype].type;
  const parentId = input.parentId !== undefined ? await checkParent(a, chart, input.parentId, type, acc.id) : acc.parent_id;
  const taxCodeId = input.taxCodeId !== undefined ? checkTax(chart, input.taxCodeId) : acc.tax_code_id;
  const stmts: D1PreparedStatement[] = [];
  if (input.isDefault) stmts.push(c.env.DB.prepare('UPDATE fin_accounts SET is_default = 0 WHERE org_id = ? AND type = ?').bind(a.orgId, type));
  stmts.push(
    c.env.DB.prepare('UPDATE fin_accounts SET code = ?, name = ?, type = ?, subtype = ?, parent_id = ?, description = ?, tax_code_id = ?, bank_name = ?, bank_number = ?, is_default = ?, position = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(
      input.code ?? acc.code,
      input.name ?? acc.name,
      type,
      subtype,
      parentId,
      input.description ?? acc.description,
      taxCodeId,
      input.bankName ?? acc.bank_name,
      input.bankNumber ?? acc.bank_number,
      input.isDefault !== undefined ? (input.isDefault ? 1 : 0) : acc.is_default,
      input.position ?? acc.position,
      now(),
      acc.id,
      a.orgId,
    ),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'account.updated', targetType: 'account', targetId: acc.id, before: { code: acc.code, name: acc.name, subtype: acc.subtype }, after: input }),
  );
  await runBatch(c.env.DB, stmts);
  forgetChart(a);
  return c.json({ ok: true });
});

setupRoutes.post('/orgs/:org/accounts/:id/archive', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change the chart of accounts');
  const { archived } = await body(c, z.object({ archived: z.boolean() }));
  const chart = await chartOf(c.env.DB, a);
  const acc = chart.accounts.get(c.req.param('id'));
  if (!acc) throw notFound('Account');
  if (archived && acc.system_key) throw new HttpError(400, 'This account cannot be archived: the books need it');
  if (archived && (acc.type === 'asset' || acc.type === 'liability')) {
    const bal = (await accountBalances(c.env.DB, a.orgId, { accountIds: [acc.id] })).get(acc.id) ?? 0;
    if (bal !== 0) throw new HttpError(409, 'Bring the balance to zero before archiving this account');
  }
  if (archived && [...chart.accounts.values()].some((x) => x.parent_id === acc.id && !x.archived_at)) throw new HttpError(409, 'Archive its subcategories first');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_accounts SET archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(archived ? now() : null, now(), acc.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: archived ? 'account.archived' : 'account.restored', targetType: 'account', targetId: acc.id }),
  ]);
  forgetChart(a);
  return c.json({ ok: true });
});

setupRoutes.delete('/orgs/:org/accounts/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change the chart of accounts');
  const chart = await chartOf(c.env.DB, a);
  const acc = chart.accounts.get(c.req.param('id'));
  if (!acc) throw notFound('Account');
  if (acc.system_key) throw new HttpError(400, 'This account cannot be deleted: the books need it');
  if (await accountUsed(c.env.DB, a.orgId, acc.id)) throw new HttpError(409, 'This account has been used; archive it instead');
  if ([...chart.accounts.values()].some((x) => x.parent_id === acc.id)) throw new HttpError(409, 'Move or delete its subcategories first');
  await runBatch(c.env.DB, [
    c.env.DB.prepare('DELETE FROM fin_rules WHERE org_id = ? AND account_id = ?').bind(a.orgId, acc.id),
    c.env.DB.prepare('DELETE FROM fin_budget_lines WHERE org_id = ? AND account_id = ?').bind(a.orgId, acc.id),
    c.env.DB.prepare('UPDATE fin_contacts SET default_account_id = NULL WHERE org_id = ? AND default_account_id = ?').bind(a.orgId, acc.id),
    c.env.DB.prepare('UPDATE fin_goals SET account_id = NULL WHERE org_id = ? AND account_id = ?').bind(a.orgId, acc.id),
    c.env.DB.prepare('DELETE FROM fin_accounts WHERE id = ? AND org_id = ?').bind(acc.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'account.deleted', targetType: 'account', targetId: acc.id, before: { code: acc.code, name: acc.name } }),
  ]);
  forgetChart(a);
  return c.json({ ok: true });
});

/** An opening balance for an existing account (its own journal; reverse it from Journals to change it). */
setupRoutes.post('/orgs/:org/accounts/:id/opening-balance', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change opening balances');
  const input = await body(c, z.object({ amount: money(), date: isoDate() }));
  const chart = await chartOf(c.env.DB, a);
  const acc = chart.accounts.get(c.req.param('id'));
  if (!acc) throw notFound('Account');
  if (acc.type === 'revenue' || acc.type === 'expense') throw new HttpError(400, 'Opening balances are for assets, debts and equity');
  if (!input.amount) throw new HttpError(400, 'Enter an amount');
  await runBatch(c.env.DB, [...openingStmts(c, a, chart, acc, input.amount, input.date), auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'account.opening_balance', targetType: 'account', targetId: acc.id, after: input })]);
  return c.json({ ok: true }, 201);
});

// ------------------------------------------------------------------ tax codes

function taxDTO(t: any) {
  return { id: t.id, code: t.code, name: t.name, rateBp: t.rate_bp, direction: t.direction, bas: basOf(t.bas_json), systemKey: t.system_key, archived: !!t.archived_at };
}

setupRoutes.get('/orgs/:org/tax-codes', async (c) => {
  const a = await requireOrg(c);
  const chart = await chartOf(c.env.DB, a);
  return c.json([...chart.taxCodes.values()].map(taxDTO));
});

const taxInput = z.object({
  code: text(12).min(1).regex(/^[A-Za-z0-9_-]+$/, 'Codes use letters, digits, dashes and underscores'),
  name: text(80).min(1),
  rateBp: z.number().int().min(0).max(10_000),
  direction: z.enum(['sales', 'purchases', 'both']),
  bas: z.array(z.enum(BAS_ORDER as [string, ...string[]])).max(7),
});

setupRoutes.post('/orgs/:org/tax-codes', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  requirePerm(a, 'accounting', 'manage', 'You cannot change tax codes');
  const input = await body(c, taxInput);
  const tid = newId();
  await runBatch(c.env.DB, [
    c.env.DB.prepare('INSERT INTO fin_tax_codes (id, org_id, code, name, rate_bp, direction, bas_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(tid, a.orgId, input.code.toUpperCase(), input.name, input.rateBp, input.direction, JSON.stringify(input.bas), now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'tax_code.created', targetType: 'tax_code', targetId: tid, after: input }),
  ]);
  return c.json({ id: tid }, 201);
});

setupRoutes.patch('/orgs/:org/tax-codes/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change tax codes');
  const input = await body(c, taxInput.partial().extend({ archived: z.boolean().optional() }));
  const chart = await chartOf(c.env.DB, a);
  const t = chart.taxCodes.get(c.req.param('id'));
  if (!t) throw notFound('Tax code');
  await runBatch(c.env.DB, [
    c.env.DB.prepare('UPDATE fin_tax_codes SET code = ?, name = ?, rate_bp = ?, direction = ?, bas_json = ?, archived_at = ? WHERE id = ? AND org_id = ?').bind(
      (input.code ?? t.code).toUpperCase(),
      input.name ?? t.name,
      input.rateBp ?? t.rate_bp,
      input.direction ?? t.direction,
      input.bas ? JSON.stringify(input.bas) : t.bas_json,
      input.archived === undefined ? t.archived_at : input.archived ? now() : null,
      t.id,
      a.orgId,
    ),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'tax_code.updated', targetType: 'tax_code', targetId: t.id, before: taxDTO(t), after: input }),
  ]);
  forgetChart(a);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ departments, projects and cost centres

setupRoutes.get('/orgs/:org/tracking', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT * FROM fin_tracking WHERE org_id = ? ORDER BY kind, name COLLATE NOCASE').bind(a.orgId).all<any>();
  return c.json(rows.results.map((r) => ({ id: r.id, kind: r.kind, name: r.name, code: r.code, archived: !!r.archived_at })));
});

setupRoutes.post('/orgs/:org/tracking', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change tracking categories');
  const input = await body(c, z.object({ kind: z.enum(['department', 'project', 'cost_centre']), name: text(120).min(1), code: text(20).optional() }));
  const tid = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO fin_tracking (id, org_id, kind, name, code, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(tid, a.orgId, input.kind, input.name, input.code ?? '', now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'tracking.created', targetType: 'tracking', targetId: tid, after: input }),
  ]);
  return c.json({ id: tid }, 201);
});

setupRoutes.patch('/orgs/:org/tracking/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'manage', 'You cannot change tracking categories');
  const input = await body(c, z.object({ name: text(120).min(1).optional(), code: text(20).optional(), archived: z.boolean().optional() }));
  const row = await c.env.DB.prepare('SELECT * FROM fin_tracking WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<any>();
  if (!row) throw notFound('Tracking category');
  await c.env.DB.prepare('UPDATE fin_tracking SET name = ?, code = ?, archived_at = ? WHERE id = ? AND org_id = ?').bind(input.name ?? row.name, input.code ?? row.code, input.archived === undefined ? row.archived_at : input.archived ? now() : null, row.id, a.orgId).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ customers and suppliers

function contactDTO(r: any) {
  return {
    id: r.id,
    name: r.name,
    kind: r.kind,
    email: r.email,
    phone: r.phone,
    abn: r.abn,
    address: r.address,
    termsDays: r.terms_days,
    defaultAccountId: r.default_account_id,
    defaultTaxCodeId: r.default_tax_code_id,
    notes: r.notes,
    archived: !!r.archived_at,
    createdBy: r.created_by,
    createdAt: r.created_at,
    receivable: r.receivable ?? 0,
    payable: r.payable ?? 0,
  };
}

const contactInput = z.object({
  name: text(160).min(1, 'Give the contact a name'),
  kind: z.enum(['customer', 'supplier', 'both']).optional(),
  email: z.union([z.literal(''), z.string().trim().toLowerCase().email().max(320)]).optional(),
  phone: text(60).optional(),
  abn: z.string().trim().max(20).regex(/^[0-9 ]*$/, 'An ABN is digits only').optional(),
  address: text(400).optional(),
  termsDays: z.number().int().min(0).max(365).nullable().optional(),
  defaultAccountId: id().nullable().optional(),
  defaultTaxCodeId: id().nullable().optional(),
  notes: text(2000).optional(),
});

const OUTSTANDING = `
  (SELECT COALESCE(SUM(d.total - d.amount_paid), 0) FROM fin_docs d WHERE d.org_id = c.org_id AND d.contact_id = c.id AND d.kind = 'invoice' AND d.status IN ('approved','part_paid') AND d.deleted_at IS NULL) AS receivable,
  (SELECT COALESCE(SUM(d.total - d.amount_paid), 0) FROM fin_docs d WHERE d.org_id = c.org_id AND d.contact_id = c.id AND d.kind = 'bill' AND d.status IN ('approved','part_paid') AND d.deleted_at IS NULL) AS payable`;

setupRoutes.get('/orgs/:org/contacts', async (c) => {
  const a = await requireOrg(c);
  const scope = scopeSql(a, 'contacts', 'c');
  const where = ['c.org_id = ?', scope.sql];
  const args: unknown[] = [a.orgId, ...scope.args];
  const q = (c.req.query('q') ?? '').trim().toLowerCase();
  if (q) {
    where.push('c.search LIKE ?');
    args.push(`%${q.replace(/[%_]/g, '')}%`);
  }
  const kind = c.req.query('kind');
  if (kind === 'customer' || kind === 'supplier') {
    where.push("(c.kind = ? OR c.kind = 'both')");
    args.push(kind);
  }
  if (c.req.query('archived') !== '1') where.push('c.archived_at IS NULL');
  const rows = await c.env.DB.prepare(`SELECT c.*, ${OUTSTANDING} FROM fin_contacts c WHERE ${where.join(' AND ')} ORDER BY c.name COLLATE NOCASE LIMIT 1000`).bind(...args).all<any>();
  if (c.req.query('format') === 'csv') {
    requirePerm(a, 'contacts', 'export', 'You cannot export contacts');
    const csv = csvOf([['Name', 'Type', 'Email', 'Phone', 'ABN', 'Address', 'Terms (days)', 'Owed to us', 'We owe'], ...rows.results.map((r) => [r.name, r.kind, r.email, r.phone, r.abn, r.address, r.terms_days ?? '', (r.receivable / 100).toFixed(2), (r.payable / 100).toFixed(2)])]);
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'contacts.exported', targetType: 'contact', metadata: { rows: rows.results.length } }).run();
    return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="contacts.csv"' } });
  }
  return c.json(rows.results.map(contactDTO));
});

async function loadContact(db: D1Database, a: FinAccess, contactId: string) {
  const r = await db.prepare(`SELECT c.*, ${OUTSTANDING} FROM fin_contacts c WHERE c.id = ? AND c.org_id = ?`).bind(contactId, a.orgId).first<any>();
  if (!r) throw notFound('Contact');
  return r;
}

setupRoutes.get('/orgs/:org/contacts/:id', async (c) => {
  const a = await requireOrg(c);
  const r = await loadContact(c.env.DB, a, c.req.param('id'));
  assertRecord(a, 'contacts', 'view', r, 'Contact');
  return c.json(contactDTO(r));
});

async function checkContactRefs(a: FinAccess, chart: Awaited<ReturnType<typeof chartOf>>, input: { defaultAccountId?: string | null; defaultTaxCodeId?: string | null }) {
  if (input.defaultAccountId && !chart.accounts.has(input.defaultAccountId)) throw new HttpError(400, 'Choose an account from this workspace');
  if (input.defaultTaxCodeId && !chart.taxCodes.has(input.defaultTaxCodeId)) throw new HttpError(400, 'Choose a tax code from this workspace');
  void a;
}

setupRoutes.post('/orgs/:org/contacts', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'contacts', 'create', 'You cannot add contacts');
  const input = await body(c, contactInput);
  await checkContactRefs(a, await chartOf(c.env.DB, a), input);
  const cid = newId();
  const t = now();
  await runBatch(c.env.DB, [
    c.env.DB.prepare('INSERT INTO fin_contacts (id, org_id, name, kind, email, phone, abn, address, terms_days, default_account_id, default_tax_code_id, notes, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(
      cid,
      a.orgId,
      input.name,
      input.kind ?? 'customer',
      input.email ?? '',
      input.phone ?? '',
      (input.abn ?? '').replace(/\s+/g, ''),
      input.address ?? '',
      input.termsDays ?? null,
      input.defaultAccountId ?? null,
      input.defaultTaxCodeId ?? null,
      input.notes ?? '',
      searchText(input.name, input.email, input.phone, input.abn),
      a.userId,
      t,
      t,
    ),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'contact.created', targetType: 'contact', targetId: cid, after: { name: input.name, kind: input.kind ?? 'customer' } }),
  ]);
  return c.json({ id: cid }, 201);
});

setupRoutes.patch('/orgs/:org/contacts/:id', async (c) => {
  const a = await requireOrg(c);
  const r = await loadContact(c.env.DB, a, c.req.param('id'));
  assertRecord(a, 'contacts', 'edit', r, 'Contact');
  const input = await body(c, contactInput.partial().extend({ archived: z.boolean().optional() }));
  await checkContactRefs(a, await chartOf(c.env.DB, a), input);
  const next = {
    name: input.name ?? r.name,
    kind: input.kind ?? r.kind,
    email: input.email ?? r.email,
    phone: input.phone ?? r.phone,
    abn: input.abn !== undefined ? input.abn.replace(/\s+/g, '') : r.abn,
    address: input.address ?? r.address,
    terms: input.termsDays !== undefined ? input.termsDays : r.terms_days,
    acc: input.defaultAccountId !== undefined ? input.defaultAccountId : r.default_account_id,
    tax: input.defaultTaxCodeId !== undefined ? input.defaultTaxCodeId : r.default_tax_code_id,
    notes: input.notes ?? r.notes,
    archived: input.archived === undefined ? r.archived_at : input.archived ? now() : null,
  };
  await runBatch(c.env.DB, [
    c.env.DB.prepare('UPDATE fin_contacts SET name = ?, kind = ?, email = ?, phone = ?, abn = ?, address = ?, terms_days = ?, default_account_id = ?, default_tax_code_id = ?, notes = ?, archived_at = ?, search = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(
      next.name,
      next.kind,
      next.email,
      next.phone,
      next.abn,
      next.address,
      next.terms,
      next.acc,
      next.tax,
      next.notes,
      next.archived,
      searchText(next.name, next.email, next.phone, next.abn),
      now(),
      r.id,
      a.orgId,
    ),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: input.archived === true ? 'contact.archived' : 'contact.updated', targetType: 'contact', targetId: r.id, after: input }),
  ]);
  return c.json({ ok: true });
});

/** Contacts from a CSV file: name, type, email, phone, ABN, address (columns chosen by the person). */
setupRoutes.post('/orgs/:org/contacts/import', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'contacts', 'import', 'You cannot import contacts');
  requirePerm(a, 'contacts', 'create', 'You cannot add contacts');
  await rateLimit(c.env.DB, `fin-import:${a.userId}`, 20, 3_600_000);
  const input = await body(c, z.object({ rows: z.array(z.object({ name: text(160), kind: z.enum(['customer', 'supplier', 'both']).optional(), email: text(320).optional(), phone: text(60).optional(), abn: text(20).optional(), address: text(400).optional() })).max(2000) }));
  const existing = await c.env.DB.prepare('SELECT name FROM fin_contacts WHERE org_id = ?').bind(a.orgId).all<{ name: string }>();
  const names = new Set(existing.results.map((r) => r.name.toLowerCase()));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let skipped = 0;
  for (const r of input.rows) {
    if (!r.name || names.has(r.name.toLowerCase())) {
      skipped++;
      continue;
    }
    names.add(r.name.toLowerCase());
    const email = r.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email) ? r.email.toLowerCase() : '';
    stmts.push(c.env.DB.prepare('INSERT INTO fin_contacts (id, org_id, name, kind, email, phone, abn, address, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.orgId, r.name, r.kind ?? 'customer', email, r.phone ?? '', (r.abn ?? '').replace(/\D/g, ''), r.address ?? '', searchText(r.name, email, r.phone, r.abn), a.userId, t, t));
  }
  stmts.push(auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'contacts.imported', targetType: 'contact', metadata: { created: stmts.length, skipped } }));
  for (let i = 0; i < stmts.length; i += 200) await c.env.DB.batch(stmts.slice(i, i + 200));
  return c.json({ created: stmts.length - 1, skipped });
});

// ------------------------------------------------------------------ invoice templates

function templateDTO(t: any) {
  return { id: t.id, name: t.name, title: t.title, accent: t.accent, paymentInstructions: t.payment_instructions, footer: t.footer, isDefault: !!t.is_default };
}

setupRoutes.get('/orgs/:org/templates', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT * FROM fin_doc_templates WHERE org_id = ? ORDER BY is_default DESC, name').bind(a.orgId).all<any>();
  return c.json(rows.results.map(templateDTO));
});

const templateInput = z.object({ name: text(80).min(1), title: text(40).optional(), accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), paymentInstructions: text(1000).optional(), footer: text(1000).optional(), isDefault: z.boolean().optional() });

setupRoutes.post('/orgs/:org/templates', async (c) => {
  const a = await requireOrg(c);
  requireBusiness(a);
  requirePerm(a, 'settings', 'manage', 'You cannot change invoice templates');
  const input = await body(c, templateInput);
  const tid = newId();
  const stmts: D1PreparedStatement[] = [];
  if (input.isDefault) stmts.push(c.env.DB.prepare('UPDATE fin_doc_templates SET is_default = 0 WHERE org_id = ?').bind(a.orgId));
  stmts.push(c.env.DB.prepare('INSERT INTO fin_doc_templates (id, org_id, name, title, accent, payment_instructions, footer, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(tid, a.orgId, input.name, input.title ?? '', input.accent ?? '#0f766e', input.paymentInstructions ?? '', input.footer ?? '', input.isDefault ? 1 : 0, now(), now()));
  await c.env.DB.batch(stmts);
  return c.json({ id: tid }, 201);
});

setupRoutes.patch('/orgs/:org/templates/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'settings', 'manage', 'You cannot change invoice templates');
  const input = await body(c, templateInput.partial());
  const t = await c.env.DB.prepare('SELECT * FROM fin_doc_templates WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<any>();
  if (!t) throw notFound('Template');
  const stmts: D1PreparedStatement[] = [];
  if (input.isDefault) stmts.push(c.env.DB.prepare('UPDATE fin_doc_templates SET is_default = 0 WHERE org_id = ?').bind(a.orgId));
  stmts.push(
    c.env.DB.prepare('UPDATE fin_doc_templates SET name = ?, title = ?, accent = ?, payment_instructions = ?, footer = ?, is_default = ?, updated_at = ? WHERE id = ? AND org_id = ?').bind(
      input.name ?? t.name,
      input.title ?? t.title,
      input.accent ?? t.accent,
      input.paymentInstructions ?? t.payment_instructions,
      input.footer ?? t.footer,
      input.isDefault !== undefined ? (input.isDefault ? 1 : 0) : t.is_default,
      now(),
      t.id,
      a.orgId,
    ),
  );
  await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

setupRoutes.delete('/orgs/:org/templates/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'settings', 'manage', 'You cannot change invoice templates');
  const t = await c.env.DB.prepare('SELECT * FROM fin_doc_templates WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<any>();
  if (!t) throw notFound('Template');
  if (t.is_default) throw new HttpError(400, 'Make another template the default first');
  await c.env.DB.batch([c.env.DB.prepare('UPDATE fin_docs SET template_id = NULL WHERE org_id = ? AND template_id = ?').bind(a.orgId, t.id), c.env.DB.prepare('DELETE FROM fin_doc_templates WHERE id = ? AND org_id = ?').bind(t.id, a.orgId)]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ categorisation rules

setupRoutes.get('/orgs/:org/rules', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT * FROM fin_rules WHERE org_id = ? ORDER BY position, created_at').bind(a.orgId).all<any>();
  return c.json(rows.results.map((r) => ({ id: r.id, matchText: r.match_text, direction: r.direction, accountId: r.account_id, taxCodeId: r.tax_code_id, contactId: r.contact_id, position: r.position })));
});

const ruleInput = z.object({ matchText: text(120).min(2, 'Match at least two characters'), direction: z.enum(['in', 'out', 'any']).optional(), accountId: id(), taxCodeId: id().nullable().optional(), contactId: id().nullable().optional(), position: z.number().int().min(0).max(100_000).optional() });

setupRoutes.post('/orgs/:org/rules', async (c) => {
  const a = await requireOrg(c);
  if (!hasPerm(a, 'banking', 'approve') && !a.perms.accounting.manage) deny('You cannot change categorisation rules');
  const input = await body(c, ruleInput);
  const rid = newId();
  await runBatch(c.env.DB, [c.env.DB.prepare('INSERT INTO fin_rules (id, org_id, match_text, direction, account_id, tax_code_id, contact_id, position, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(rid, a.orgId, input.matchText.toLowerCase(), input.direction ?? 'any', input.accountId, a.gst ? (input.taxCodeId ?? null) : null, input.contactId ?? null, input.position ?? 0, a.userId, now())]);
  return c.json({ id: rid }, 201);
});

setupRoutes.patch('/orgs/:org/rules/:id', async (c) => {
  const a = await requireOrg(c);
  if (!hasPerm(a, 'banking', 'approve') && !a.perms.accounting.manage) deny('You cannot change categorisation rules');
  const input = await body(c, ruleInput.partial());
  const r = await c.env.DB.prepare('SELECT * FROM fin_rules WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<any>();
  if (!r) throw notFound('Rule');
  await runBatch(c.env.DB, [
    c.env.DB.prepare('UPDATE fin_rules SET match_text = ?, direction = ?, account_id = ?, tax_code_id = ?, contact_id = ?, position = ? WHERE id = ? AND org_id = ?').bind(
      (input.matchText ?? r.match_text).toLowerCase(),
      input.direction ?? r.direction,
      input.accountId ?? r.account_id,
      input.taxCodeId !== undefined ? input.taxCodeId : r.tax_code_id,
      input.contactId !== undefined ? input.contactId : r.contact_id,
      input.position ?? r.position,
      r.id,
      a.orgId,
    ),
  ]);
  return c.json({ ok: true });
});

setupRoutes.delete('/orgs/:org/rules/:id', async (c) => {
  const a = await requireOrg(c);
  if (!hasPerm(a, 'banking', 'approve') && !a.perms.accounting.manage) deny('You cannot change categorisation rules');
  const r = await c.env.DB.prepare('DELETE FROM fin_rules WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).run();
  if (!r.meta.changes) throw notFound('Rule');
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ document numbering

setupRoutes.get('/orgs/:org/numbering', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT key, last_number FROM fin_counters WHERE org_id = ?').bind(a.orgId).all<{ key: string; last_number: number }>();
  const last = new Map(rows.results.map((r) => [r.key, r.last_number]));
  return c.json(DOC_KINDS.map((k) => ({ kind: k, prefix: a.settings.prefixes[k], next: (last.get(k) ?? 0) + 1 })));
});

setupRoutes.put('/orgs/:org/numbering/:kind', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'settings', 'manage', 'You cannot change numbering');
  const kind = c.req.param('kind') as DocKind;
  if (!DOC_KINDS.includes(kind)) throw notFound('Document kind');
  const { next } = await body(c, z.object({ next: z.number().int().min(1).max(99_999_999) }));
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO fin_counters (org_id, key, last_number) VALUES (?, ?, ?) ON CONFLICT(org_id, key) DO UPDATE SET last_number = excluded.last_number').bind(a.orgId, kind, next - 1),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'numbering.changed', targetType: 'org', targetId: a.orgId, after: { kind, next } }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ period lock

setupRoutes.put('/orgs/:org/lock', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'lock', 'You cannot lock or unlock periods');
  const { lockDate } = await body(c, z.object({ lockDate: isoDate().nullable() }));
  const today = todayIn(a.org.timezone);
  if (lockDate && lockDate > today) throw new HttpError(400, 'Lock up to today at the latest');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_orgs SET lock_date = ?, updated_at = ? WHERE id = ?').bind(lockDate, now(), a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: lockDate ? 'period.locked' : 'period.unlocked', targetType: 'org', targetId: a.orgId, before: { lockDate: a.org.lock_date }, after: { lockDate }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ journals

export async function journalDTOs(db: D1Database, orgId: string, ids: string[]) {
  if (!ids.length) return [];
  const [js, ls] = await Promise.all([
    db.prepare(`SELECT j.*, u.name AS created_by_name FROM fin_journals j LEFT JOIN users u ON u.id = j.created_by WHERE j.org_id = ? AND j.id IN (${placeholders(ids.length)}) ORDER BY j.date, j.number`).bind(orgId, ...ids).all<any>(),
    db.prepare(`SELECT l.*, a.code, a.name AS account_name FROM fin_journal_lines l JOIN fin_accounts a ON a.id = l.account_id WHERE l.org_id = ? AND l.journal_id IN (${placeholders(ids.length)}) ORDER BY l.line_no`).bind(orgId, ...ids).all<any>(),
  ]);
  return js.results.map((j) => ({
    id: j.id,
    number: j.number,
    date: j.date,
    sourceType: j.source_type,
    sourceId: j.source_id,
    memo: j.memo,
    reversesId: j.reverses_id,
    reversedById: j.reversed_by_id,
    createdBy: j.created_by_name,
    postedAt: j.posted_at,
    lines: ls.results
      .filter((l) => l.journal_id === j.id)
      .map((l) => ({ accountId: l.account_id, accountCode: l.code, accountName: l.account_name, debit: l.debit, credit: l.credit, description: l.description, taxCodeId: l.tax_code_id, taxAmount: l.tax_amount, contactId: l.contact_id, departmentId: l.department_id, projectId: l.project_id, costCentreId: l.cost_centre_id, personId: l.person_id })),
  }));
}

setupRoutes.get('/orgs/:org/journals', async (c) => {
  const a = await requireOrg(c);
  if (!a.perms.accounting.view && !a.perms.reports.view) deny('You cannot see journals');
  const where = ['org_id = ?', "status = 'posted'"];
  const args: unknown[] = [a.orgId];
  const source = c.req.query('source');
  if (source) {
    where.push('source_id = ?');
    args.push(source);
  }
  const type = c.req.query('type');
  if (type) {
    where.push('source_type = ?');
    args.push(type);
  }
  const from = c.req.query('from');
  const to = c.req.query('to');
  if (from) {
    where.push('date >= ?');
    args.push(from);
  }
  if (to) {
    where.push('date <= ?');
    args.push(to);
  }
  const ids = await c.env.DB.prepare(`SELECT id FROM fin_journals WHERE ${where.join(' AND ')} ORDER BY date DESC, number DESC LIMIT 200`).bind(...args).all<{ id: string }>();
  return c.json((await journalDTOs(c.env.DB, a.orgId, ids.results.map((r) => r.id))).reverse());
});

const journalLineInput = z.object({
  accountId: id(),
  debit: z.number().int().min(0).max(1_000_000_000_000).default(0),
  credit: z.number().int().min(0).max(1_000_000_000_000).default(0),
  description: text(500).optional(),
  taxCodeId: id().nullable().optional(),
  taxAmount: z.number().int().min(0).max(1_000_000_000_000).optional(),
  contactId: id().nullable().optional(),
  departmentId: id().nullable().optional(),
  projectId: id().nullable().optional(),
  costCentreId: id().nullable().optional(),
});

/** A manual journal (accountants): any balanced set of lines. Tax on a line is entered as the GST it includes. */
setupRoutes.post('/orgs/:org/journals', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'journal', 'You cannot post manual journals');
  const input = await body(c, z.object({ date: isoDate(), memo: text(500).min(1, 'Describe the journal'), lines: z.array(journalLineInput).min(2).max(200) }));
  const chart = await chartOf(c.env.DB, a);
  const lines: LedgerLine[] = input.lines.map((l) => ({
    accountId: l.accountId,
    debit: l.debit,
    credit: l.credit,
    description: l.description,
    taxCodeId: a.gst ? (l.taxCodeId ?? null) : null,
    taxAmount: a.gst && l.taxCodeId && l.taxAmount ? (l.debit > 0 ? l.taxAmount : -l.taxAmount) : 0,
    contactId: l.contactId ?? null,
    departmentId: l.departmentId ?? null,
    projectId: l.projectId ?? null,
    costCentreId: l.costCentreId ?? null,
  }));
  validateJournal(a, chart, input.date, lines);
  const jid = newId();
  await runBatch(c.env.DB, [
    ...journalStmts(c.env.DB, { id: jid, orgId: a.orgId, date: input.date, sourceType: 'manual', memo: input.memo, createdBy: a.userId, lines }),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'journal.posted', targetType: 'journal', targetId: jid, after: { date: input.date, memo: input.memo, lines: lines.length } }),
  ]);
  return c.json({ id: jid }, 201);
});

/** Reverse a manual or opening-balance journal. Records (transactions, invoices, bills) are voided from the record. */
setupRoutes.post('/orgs/:org/journals/:id/reverse', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'accounting', 'journal', 'You cannot reverse journals');
  const input = await body(c, z.object({ date: isoDate().nullable().optional(), memo: text(500).optional() }));
  const j = await c.env.DB.prepare('SELECT source_type FROM fin_journals WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<{ source_type: string }>();
  if (!j) throw notFound('Journal');
  if (j.source_type !== 'manual' && j.source_type !== 'opening') throw new HttpError(400, 'Void this entry from its transaction, invoice, bill or payment');
  const r = await reversalStmts(c.env.DB, a, c.req.param('id'), { date: input.date, memo: input.memo });
  await runBatch(c.env.DB, [...r.stmts, auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'journal.reversed', targetType: 'journal', targetId: c.req.param('id'), after: { reversal: r.reversalId, date: r.date } })]);
  return c.json({ id: r.reversalId, date: r.date }, 201);
});
