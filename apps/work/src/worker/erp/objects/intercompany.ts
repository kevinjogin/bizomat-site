// Consolidation and intercompany (catalogue 21; docs/erp/consolidation.md). The group is the company's legal entities
// (Organisation structure) that name a Finance business workspace, which may be another company's: every figure comes from
// a workspace the person may read in Finance itself, and one they may not is listed as left out, never added silently.
//
//   An intercompany transaction, once approved by someone else, makes a draft invoice in the seller's workspace to the
//   buyer and a draft bill in the buyer's to the seller, through Finance's own createDoc, once each however often it is
//   asked (erp_integration_events). The bill is converted at the company's exchange rate on the transaction's date when the
//   currencies differ. The Finance contact that stands for each entity in each workspace is remembered (erp_ic_contacts).
//
//   The consolidated report reads each workspace's posted journals (profit and loss for the period, balance sheet at its
//   end), translates every amount at the closing rate into the presentation currency, and eliminates the balances posted
//   against contacts that stand for another entity of the group (on every account except money and tax accounts: a payment
//   between entities is still cash, and GST is still owed to the tax office). A difference between the two sides of the
//   eliminations is shown, never hidden.

import type { Env } from '../../env';
import { HttpError, newId, now } from '../../lib/util';
import { createDoc } from '../../fin/docs';
import { accountBalances, chartOf, natural, type AccountRow } from '../../fin/ledger';
import { hasPerm, type FinAccess } from '../../fin/access';
import { searchText } from '../../fin/util';
import type { ErpAccess } from '../access';
import { badState } from '../util';
import { maybeFin } from '../suppliers';
import type { Data, RecordRow } from './engine';
import { convert, noRate, rateFor } from './fx';
import { entityWorkspaces } from './refs';

/**
 * Why a workspace may not be read for this company now, or null: the company's own are always fine; another company's
 * only in a browser session, and only where the person is that company's owner or an administrator (refs.ts).
 */
async function outsideReason(db: D1Database, a: ErpAccess, user: User, orgId: string, session: boolean): Promise<string | null> {
  const w = (await entityWorkspaces(db, a, user)).find((x) => x.id === orgId);
  if (!w) return 'Its Finance workspace is not this company’s, nor one of a company where you are the owner or an administrator';
  if (!w.own && !session) return 'Another company’s books are read only in a browser, signed in: an API token reaches this company’s own books only';
  return null;
}

type User = { id: string; name: string };
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

export interface Entity {
  id: string;
  number: string;
  name: string;
  legalName: string;
  currency: string;
  orgId: string | null;
  ownershipPct: number | null;
  status: string;
}

async function entities(db: D1Database, companyId: string): Promise<Entity[]> {
  const rows = await db.prepare("SELECT id, number, status, data_json FROM erp_objects WHERE company_id = ? AND object = 'org_entity' AND archived_at IS NULL ORDER BY number LIMIT 200").bind(companyId).all<{ id: string; number: string; status: string; data_json: string }>();
  return rows.results.map((r) => {
    const d = JSON.parse(r.data_json) as Data;
    return { id: r.id, number: r.number, name: str(d.name), legalName: str(d.legalName), currency: str(d.currency), orgId: str(d.finWorkspace) || null, ownershipPct: typeof d.ownershipPct === 'number' ? d.ownershipPct : null, status: r.status };
  });
}

// ------------------------------------------------------------------ the Finance contact standing for an entity

/** The contact for `entity` in workspace `fa` (customer for invoices, supplier for bills), found or made. */
async function contactFor(db: D1Database, companyId: string, fa: FinAccess, entity: Entity, role: 'customer' | 'supplier'): Promise<{ id: string; name: string; stmts: D1PreparedStatement[] }> {
  const kinds = role === 'customer' ? "('customer','both')" : "('supplier','both')";
  const linked = await db
    .prepare(`SELECT c.id, c.name FROM erp_ic_contacts l JOIN fin_contacts c ON c.id = l.contact_id AND c.org_id = l.fin_org_id WHERE l.company_id = ? AND l.entity_id = ? AND l.fin_org_id = ? AND c.archived_at IS NULL AND c.kind IN ${kinds} LIMIT 1`)
    .bind(companyId, entity.id, fa.orgId)
    .first<{ id: string; name: string }>();
  if (linked) return { ...linked, stmts: [] };
  const name = entity.legalName || entity.name;
  const byName = await db.prepare(`SELECT id, name FROM fin_contacts WHERE org_id = ? AND archived_at IS NULL AND kind IN ${kinds} AND lower(name) = lower(?) LIMIT 1`).bind(fa.orgId, name).first<{ id: string; name: string }>();
  const t = now();
  const link = (contactId: string) => db.prepare('INSERT INTO erp_ic_contacts (company_id, entity_id, fin_org_id, contact_id, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id, entity_id, fin_org_id) DO UPDATE SET contact_id = excluded.contact_id').bind(companyId, entity.id, fa.orgId, contactId, t);
  if (byName) return { ...byName, stmts: [link(byName.id)] };
  if (!fa.perms.contacts.create) throw new HttpError(403, `Your Finance role in ${fa.org.name} cannot add ${name} as a ${role}`);
  const id = newId();
  return {
    id,
    name,
    stmts: [db.prepare('INSERT INTO fin_contacts (id, org_id, name, kind, email, phone, abn, address, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, fa.orgId, name, role, '', '', '', '', searchText(name), fa.userId, t, t), link(id)],
  };
}

// ------------------------------------------------------------------ the invoice and the bill

async function oneDoc(env: Env, a: ErpAccess, key: string, sourceId: string, fa: FinAccess, make: () => Promise<string>): Promise<{ id: string; number: string }> {
  const db = env.DB;
  const t = now();
  await db
    .prepare("INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, target_org_id, created_by, created_at, updated_at) VALUES (?, ?, ?, 'ic_transaction', ?, 'finance', ?, 'pending', 0, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING")
    .bind(newId(), a.companyId, key.endsWith(':bill') ? 'finance.draft_bill' : 'finance.draft_invoice', sourceId, key, fa.orgId, a.userId, t, t)
    .run();
  const ev = await db.prepare('SELECT * FROM erp_integration_events WHERE company_id = ? AND idempotency_key = ?').bind(a.companyId, key).first<any>();
  if (!ev) throw new HttpError(409, 'That document belongs to another company');
  const numberOf = async (id: string) => (await db.prepare('SELECT number FROM fin_docs WHERE id = ? AND org_id = ?').bind(id, ev.target_org_id).first<{ number: string }>())?.number ?? '';
  if (ev.status === 'done') return { id: ev.target_ref, number: await numberOf(ev.target_ref) };
  const claim = await db
    .prepare("UPDATE erp_integration_events SET attempts = attempts + 1, status = 'pending', updated_at = ? WHERE company_id = ? AND idempotency_key = ? AND attempts = ? AND status IN ('pending','failed') AND (attempts = 0 OR status = 'failed' OR updated_at < ?)")
    .bind(t, a.companyId, key, ev.attempts, t - 120_000)
    .run();
  if (!claim.meta.changes) throw new HttpError(409, 'The documents are being made now: refresh in a moment');
  try {
    const id = await make();
    await db.prepare("UPDATE erp_integration_events SET status = 'done', target_ref = ?, last_error = '', updated_at = ? WHERE company_id = ? AND idempotency_key = ?").bind(id, now(), a.companyId, key).run();
    return { id, number: await numberOf(id) };
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : 'Finance could not make the document';
    await db.prepare("UPDATE erp_integration_events SET status = 'failed', last_error = ?, updated_at = ? WHERE company_id = ? AND idempotency_key = ?").bind(msg.slice(0, 200), now(), a.companyId, key).run();
    throw e;
  }
}

/** The draft invoice (seller) and draft bill (buyer) of an approved intercompany transaction; returns the new data. */
export async function intercompanyDocuments(env: Env, a: ErpAccess, user: User, row: RecordRow, data: Data, session = false): Promise<{ data: Data; message: string }> {
  const db = env.DB;
  const all = await entities(db, a.companyId);
  const seller = all.find((e) => e.id === data.seller);
  const buyer = all.find((e) => e.id === data.buyer);
  if (!seller || !buyer) badState('Choose the seller and the buyer from the legal entities');
  if (seller.id === buyer.id) badState('The seller and the buyer are the same entity');
  if (!seller.orgId || !buyer.orgId) badState(`Name the Finance workspace of ${!seller.orgId ? seller.name : buyer.name} first (Organisation structure, Legal entities)`);
  if (seller.orgId === buyer.orgId) badState('The seller and the buyer keep their books in the same Finance workspace: record it there as a journal');
  for (const [e, orgId] of [[seller, seller.orgId], [buyer, buyer.orgId]] as const) {
    const why = await outsideReason(db, a, user, orgId, session);
    if (why) throw new HttpError(403, `${e.name}: ${why}`);
  }
  const fs = await maybeFin(db, seller.orgId, user);
  const fb = await maybeFin(db, buyer.orgId, user);
  if (!fs || !fs.perms.sales.create) throw new HttpError(403, `Your Finance role cannot create invoices in ${seller.name}’s workspace`);
  if (!fb || !fb.perms.purchases.create) throw new HttpError(403, `Your Finance role cannot create bills in ${buyer.name}’s workspace`);
  const date = str(data.date);
  const amount = Math.round(num(data.amount));
  const cur = str(data.currency) || fs.org.currency;
  if (cur !== fs.org.currency) badState(`The seller keeps its books in ${fs.org.currency}: give the amount in ${fs.org.currency}`);
  const rate = await rateFor(db, a.companyId, cur, fb.org.currency, date);
  if (!rate) badState(noRate(cur, fb.org.currency, date));
  const billAmount = convert(amount, rate.rate);
  const reference = `${row.number}${data.reference ? ` ${str(data.reference)}` : ''}`.slice(0, 200);
  const description = str(data.description).slice(0, 1000);
  const customer = await contactFor(db, a.companyId, fs, buyer, 'customer');
  const supplier = await contactFor(db, a.companyId, fb, seller, 'supplier');
  if (customer.stmts.length || supplier.stmts.length) await db.batch([...customer.stmts, ...supplier.stmts]);
  const accountOf = async (orgId: string, type: 'revenue' | 'expense') => (await db.prepare('SELECT id FROM fin_accounts WHERE org_id = ? AND type = ? AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1').bind(orgId, type).first<{ id: string }>())?.id ?? null;
  const taxOf = async (orgId: string, key: string) => (await db.prepare('SELECT id FROM fin_tax_codes WHERE org_id = ? AND system_key = ? AND archived_at IS NULL').bind(orgId, key).first<{ id: string }>())?.id ?? null;
  const notes = `Intercompany: ${seller.name} to ${buyer.name}, BIZOMAT ERP ${row.number}. A draft: check the amount, tax and account before approving.`;
  const invoice = await oneDoc(env, a, `ic:${a.companyId}:${row.id}:invoice`, row.id, fs, async () =>
    (await createDoc(env, fs, { kind: 'invoice', contactId: customer.id, issueDate: date, reference, notes, action: 'draft', lines: [{ itemCode: '', description, unit: '', quantity: 1, unitPrice: amount, discountBp: 0, accountId: await accountOf(fs.orgId, 'revenue'), taxCodeId: fs.gst ? await taxOf(fs.orgId, 'gst_sales') : null }] } as any)).id,
  );
  const bill = await oneDoc(env, a, `ic:${a.companyId}:${row.id}:bill`, row.id, fb, async () =>
    (await createDoc(env, fb, { kind: 'bill', contactId: supplier.id, issueDate: date, reference, notes: `${notes}${rate.rate !== 1 ? ` Converted from ${cur} at ${Number(rate.rate.toPrecision(8))} (exchange rate ${rate.source}).` : ''}`, action: 'draft', lines: [{ itemCode: '', description, unit: '', quantity: 1, unitPrice: billAmount, discountBp: 0, accountId: await accountOf(fb.orgId, 'expense'), taxCodeId: fb.gst ? await taxOf(fb.orgId, 'gst_purchases') : null }] } as any)).id,
  );
  return {
    data: { ...data, currency: cur, buyerAmount: `${fb.org.currency} ${(billAmount / 100).toFixed(2)}`, rateUsed: cur === fb.org.currency ? `Same currency (${cur})` : `${cur} to ${fb.org.currency} at ${Number(rate.rate.toPrecision(8))}, ${rate.source}`, invoiceNumber: `${invoice.number} in ${fs.org.name}`, billNumber: `${bill.number} in ${fb.org.name}` },
    message: `Draft invoice ${invoice.number} made in ${fs.org.name} and draft bill ${bill.number} in ${fb.org.name}`,
  };
}

// ------------------------------------------------------------------ the consolidated report

interface Row {
  key: string;
  type: AccountRow['type'];
  code: string;
  name: string;
  /** Natural balance per entity, translated (cents of the presentation currency). */
  amounts: Record<string, number>;
  eliminated: number;
  total: number;
}

export interface Consolidation {
  from: string;
  to: string;
  currency: string;
  entities: { id: string; number: string; name: string; workspace: string; currency: string; rate: number; rateSource: string; ownershipPct: number | null }[];
  excluded: { id: string; number: string; name: string; reason: string }[];
  profitAndLoss: Row[];
  balanceSheet: Row[];
  totals: {
    revenue: Record<string, number>;
    expenses: Record<string, number>;
    profit: Record<string, number>;
    assets: Record<string, number>;
    liabilities: Record<string, number>;
    equity: Record<string, number>;
  };
  intercompanyDifference: { profitAndLoss: number; balanceSheet: number };
  notes: string[];
}

const PL: AccountRow['type'][] = ['revenue', 'expense'];
const add = (o: Record<string, number>, k: string, v: number) => (o[k] = (o[k] ?? 0) + v);

/** Balances posted against the given contacts, by account (debit minus credit), excluding money and tax accounts. */
async function contactBalances(db: D1Database, orgId: string, contactIds: string[], opts: { from?: string; to: string }): Promise<Map<string, number>> {
  if (!contactIds.length) return new Map();
  const where = ['l.org_id = ?', "j.status = 'posted'", 'j.date <= ?', `l.contact_id IN (${contactIds.map(() => '?').join(',')})`];
  const args: unknown[] = [orgId, opts.to, ...contactIds];
  if (opts.from) {
    where.push('j.date >= ?');
    args.push(opts.from);
  }
  const rows = await db.prepare(`SELECT l.account_id, SUM(l.debit) - SUM(l.credit) AS bal FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id WHERE ${where.join(' AND ')} GROUP BY l.account_id`).bind(...args).all<{ account_id: string; bal: number }>();
  return new Map(rows.results.map((r) => [r.account_id, r.bal]));
}

export async function consolidate(env: Env, a: ErpAccess, user: User, opts: { from: string; to: string; currency: string; session?: boolean }): Promise<Consolidation> {
  const db = env.DB;
  const group = (await entities(db, a.companyId)).filter((e) => e.status === 'active');
  const out: Consolidation = { from: opts.from, to: opts.to, currency: opts.currency, entities: [], excluded: [], profitAndLoss: [], balanceSheet: [], totals: { revenue: {}, expenses: {}, profit: {}, assets: {}, liabilities: {}, equity: {} }, intercompanyDifference: { profitAndLoss: 0, balanceSheet: 0 }, notes: [] };
  const seen = new Set<string>();
  const members: { e: Entity; fa: FinAccess; rate: number }[] = [];
  for (const e of group) {
    if (!e.orgId) {
      out.excluded.push({ id: e.id, number: e.number, name: e.name, reason: 'No Finance workspace is named for it' });
      continue;
    }
    if (seen.has(e.orgId)) {
      out.excluded.push({ id: e.id, number: e.number, name: e.name, reason: 'Its Finance workspace is already counted for another entity' });
      continue;
    }
    const outside = await outsideReason(db, a, user, e.orgId, !!opts.session);
    if (outside) {
      out.excluded.push({ id: e.id, number: e.number, name: e.name, reason: outside });
      continue;
    }
    const fa = await maybeFin(db, e.orgId, user);
    if (!fa || !(hasPerm(fa, 'reports', 'view') || hasPerm(fa, 'accounting', 'view'))) {
      out.excluded.push({ id: e.id, number: e.number, name: e.name, reason: 'You may not read its books in Finance' });
      continue;
    }
    const r = await rateFor(db, a.companyId, fa.org.currency, opts.currency, opts.to);
    if (!r) {
      out.excluded.push({ id: e.id, number: e.number, name: e.name, reason: noRate(fa.org.currency, opts.currency, opts.to) });
      continue;
    }
    seen.add(e.orgId);
    members.push({ e, fa, rate: r.rate });
    out.entities.push({ id: e.id, number: e.number, name: e.name, workspace: fa.org.name, currency: fa.org.currency, rate: r.rate, rateSource: r.source, ownershipPct: e.ownershipPct });
  }
  // the contacts that stand for a group member, in each workspace: remembered ones, and ones with an entity's name
  const names = new Map<string, string>();
  for (const m of members) for (const n of [m.e.name, m.e.legalName]) if (n) names.set(n.toLowerCase(), m.e.id);
  const links = await db.prepare('SELECT entity_id, fin_org_id, contact_id FROM erp_ic_contacts WHERE company_id = ?').bind(a.companyId).all<{ entity_id: string; fin_org_id: string; contact_id: string }>();
  const memberIds = new Set(members.map((m) => m.e.id));
  const plRows = new Map<string, Row>();
  const bsRows = new Map<string, Row>();
  const rowOf = (map: Map<string, Row>, type: AccountRow['type'], code: string, name: string) => {
    const key = `${type}:${code || name}`;
    let r = map.get(key);
    if (!r) map.set(key, (r = { key, type, code, name, amounts: {}, eliminated: 0, total: 0 }));
    return r;
  };
  for (const m of members) {
    const chart = await chartOf(db, m.fa);
    const ic = new Set(links.results.filter((l) => l.fin_org_id === m.fa.orgId && memberIds.has(l.entity_id) && l.entity_id !== m.e.id).map((l) => l.contact_id));
    const contacts = await db.prepare('SELECT id, name FROM fin_contacts WHERE org_id = ? AND archived_at IS NULL').bind(m.fa.orgId).all<{ id: string; name: string }>();
    for (const c of contacts.results) {
      const other = names.get(c.name.toLowerCase());
      if (other && other !== m.e.id) ic.add(c.id);
    }
    const [pl, bs, icPl, icBs] = await Promise.all([
      accountBalances(db, m.fa.orgId, { from: opts.from, to: opts.to }),
      accountBalances(db, m.fa.orgId, { to: opts.to }),
      contactBalances(db, m.fa.orgId, [...ic], { from: opts.from, to: opts.to }),
      contactBalances(db, m.fa.orgId, [...ic], { to: opts.to }),
    ]);
    // a payment between entities is still cash, and GST is still owed to the tax office; an intercompany loan is not
    const eliminable = (acc: AccountRow) => !['bank', 'cash', 'credit_card', 'tax'].includes(acc.subtype);
    // the balance sheet at the end of the period; earnings not yet closed to retained earnings sit in equity
    const earnings = rowOf(bsRows, 'equity', '', 'Earnings to date (not yet closed)');
    for (const [accId, bal] of bs) {
      const acc = chart.accounts.get(accId);
      if (!acc) continue;
      const elim = eliminable(acc) ? (icBs.get(accId) ?? 0) : 0;
      const r = PL.includes(acc.type) ? earnings : rowOf(bsRows, acc.type, acc.code, acc.name);
      // earnings read credit-positive, like equity
      const nat = (b: number) => (PL.includes(acc.type) ? -b : natural(acc.type, b));
      add(r.amounts, m.e.id, convert(nat(bal), m.rate));
      r.eliminated -= convert(nat(elim), m.rate);
      out.intercompanyDifference.balanceSheet += convert(elim, m.rate);
    }
    // profit and loss for the period
    for (const [accId, bal] of pl) {
      const acc = chart.accounts.get(accId);
      if (!acc || !PL.includes(acc.type)) continue;
      const r = rowOf(plRows, acc.type, acc.code, acc.name);
      const elim = eliminable(acc) ? (icPl.get(accId) ?? 0) : 0;
      add(r.amounts, m.e.id, convert(natural(acc.type, bal), m.rate));
      r.eliminated -= convert(natural(acc.type, elim), m.rate);
      out.intercompanyDifference.profitAndLoss += convert(elim, m.rate);
    }
  }
  const rows = new Map<string, Row>([...[...plRows].map(([k, v]) => [`pl:${k}`, { ...v, key: `pl:${k}` }] as [string, Row]), ...bsRows]);
  for (const r of rows.values()) r.total = Object.values(r.amounts).reduce((s, v) => s + v, 0) + r.eliminated;
  const sort = (x: Row, y: Row) => x.type.localeCompare(y.type) || x.code.localeCompare(y.code, undefined, { numeric: true }) || x.name.localeCompare(y.name);
  const nonZero = (r: Row) => r.total !== 0 || Object.values(r.amounts).some((v) => v !== 0) || r.eliminated !== 0;
  out.profitAndLoss = [...rows.values()].filter((r) => r.key.startsWith('pl:') && nonZero(r)).sort(sort);
  out.balanceSheet = [...rows.values()].filter((r) => !r.key.startsWith('pl:') && nonZero(r)).sort(sort);
  const col = (r: Row, k: string) => (k === '__elim' ? r.eliminated : k === '__total' ? r.total : (r.amounts[k] ?? 0));
  for (const k of [...out.entities.map((e) => e.id), '__elim', '__total']) {
    for (const r of out.profitAndLoss) add(r.type === 'revenue' ? out.totals.revenue : out.totals.expenses, k, col(r, k));
    out.totals.profit[k] = (out.totals.revenue[k] ?? 0) - (out.totals.expenses[k] ?? 0);
    for (const r of out.balanceSheet) add(r.type === 'asset' ? out.totals.assets : r.type === 'liability' ? out.totals.liabilities : out.totals.equity, k, col(r, k));
  }
  out.notes.push(
    `Every amount is translated into ${opts.currency} at the closing rate on or before ${opts.to}; no translation reserve is worked out, so a group with more than one currency may not balance to the cent.`,
    'Every entity is consolidated in full, whatever its ownership: no minority interest is worked out.',
    'Intercompany balances are those posted against a Finance contact that stands for another entity of the group (remembered from intercompany transactions, or with the entity’s name), except bank, cash, card and tax accounts. A difference between the two sides can come from what each entity recorded, or from translating them at different rates.',
  );
  return out;
}
