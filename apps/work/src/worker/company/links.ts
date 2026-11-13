// Links between the tools a company runs (/api/company/links), the four the owner chose first (13 Nov 2026):
//
//   One customer record   a CRM company and the Finance contact it is billed as (co_customer_links). Made from the CRM
//                         company: link an existing Finance contact or create one from the CRM's details.
//   Won deal to invoice   a won CRM deal becomes a draft Finance invoice for that customer, one line with the deal's
//                         title and value. A draft only: Finance's own approval posts it, after someone checks the
//                         amount, GST and account.
//   Deal to project       a CRM deal starts a project (board) in the company's Project Management workspace.
//   Project costs         a Project Management project gets a Finance tracking project; income and costs posted to it
//                         show on the project, against a budget set here.
//
// Every request checks both tools with their own permissions: the CRM's for the deal or company, Finance's for contacts
// and invoices, Project Management's for the workspace or board. Both records must belong to tools of the same company.
// Links never copy money: figures are read from Finance when asked.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { assertRecord, loadAccess as crmAccess, scopeSql as crmScopeSql, type OrgAccess } from '../crm/access';
import { hasPerm, loadAccess as finAccess, type FinAccess } from '../fin/access';
import { createDoc } from '../fin/docs';
import { createQuote, dealEventStmt } from '../fin/sales';
import { runBatch, searchText } from '../fin/util';
import { fyStart, todayIn } from '../../shared/fin/dates';
import { requireWorkspace } from '../services/permissions';
import { requireProject } from '../services/access';
import { BLANK_TEMPLATE, instantiateTemplate } from '../services/boards';
import { coAuditStmt, companyTools, type ToolApp } from './access';

export const linkRoutes = new Hono<AppEnv>();

/** The company that runs this tool, and its other tools; 404 when no company runs it. */
async function companyOf(db: D1Database, app: ToolApp, refId: string) {
  const row = await db.prepare('SELECT t.company_id FROM co_tools t JOIN co_companies c ON c.id = t.company_id AND c.deleted_at IS NULL AND c.suspended_at IS NULL WHERE t.app = ? AND t.ref_id = ?').bind(app, refId).first<{ company_id: string }>();
  if (!row) return null;
  const co = await db.prepare('SELECT id, name FROM co_companies WHERE id = ?').bind(row.company_id).first<{ id: string; name: string }>();
  return { id: row.company_id, name: co?.name ?? '', tools: await companyTools(db, row.company_id) };
}

async function maybeFin(db: D1Database, orgId: string | undefined, user: { id: string; name: string }): Promise<FinAccess | null> {
  if (!orgId) return null;
  try {
    return await finAccess(db, orgId, user);
  } catch {
    return null;
  }
}

async function maybeTasksRole(db: D1Database, wsId: string | undefined, userId: string): Promise<string | null> {
  if (!wsId) return null;
  try {
    return await requireWorkspace(db, wsId, userId, 'member');
  } catch {
    return null;
  }
}

async function crmRecord(c: any, orgId: string, table: 'crm_deals' | 'crm_companies', id: string, module: 'deals' | 'companies') {
  const db = c.env.DB as D1Database;
  const a: OrgAccess = await crmAccess(db, orgId, c.get('user'));
  const row = await db.prepare(`SELECT * FROM ${table} WHERE id = ? AND org_id = ? AND deleted_at IS NULL`).bind(id, orgId).first<any>();
  if (!row) throw notFound(module === 'deals' ? 'Deal' : 'Company');
  assertRecord(a, module, 'view', row);
  return { a, row };
}

/** The Finance contact a CRM company is billed as, creating it from the CRM's details when asked. */
async function customerFor(c: any, companyId: string, fa: FinAccess, crmCompany: any, create: boolean): Promise<string | null> {
  const db = c.env.DB as D1Database;
  const linked = await db.prepare('SELECT l.fin_contact_id FROM co_customer_links l JOIN fin_contacts f ON f.id = l.fin_contact_id AND f.org_id = ? WHERE l.company_id = ? AND l.crm_company_id = ?').bind(fa.orgId, companyId, crmCompany.id).first<{ fin_contact_id: string }>();
  if (linked) return linked.fin_contact_id;
  if (!create) return null;
  if (!fa.perms.contacts.create) throw new HttpError(403, 'Your Finance role cannot add customers');
  const id = newId();
  const t = now();
  await runBatch(db, [
    db
      .prepare("INSERT INTO fin_contacts (id, org_id, name, kind, email, phone, abn, address, search, created_by, created_at, updated_at) VALUES (?, ?, ?, 'customer', ?, ?, '', ?, ?, ?, ?, ?)")
      .bind(id, fa.orgId, crmCompany.name, crmCompany.email ?? '', crmCompany.phone ?? '', crmCompany.address ?? '', searchText(crmCompany.name, crmCompany.email, crmCompany.phone), fa.userId, t, t),
    db.prepare('INSERT INTO co_customer_links (company_id, crm_company_id, fin_contact_id, created_by, created_at) VALUES (?, ?, ?, ?, ?)').bind(companyId, crmCompany.id, id, fa.userId, t),
    coAuditStmt(db, { companyId, actorId: fa.userId, action: 'link.customer', targetType: 'crm_company', targetId: crmCompany.id, metadata: { created: true }, ip: clientIp(c) }),
  ]);
  return id;
}

/** A customer's open invoices in Finance (when the person may see sales there). */
async function receivables(db: D1Database, fa: FinAccess, contactId: string) {
  if (!hasPerm(fa, 'sales', 'view')) return null;
  const r = await db
    .prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(total - amount_paid), 0) AS due, MAX(issue_date) AS last FROM fin_docs WHERE org_id = ? AND contact_id = ? AND kind = 'invoice' AND status IN ('approved','part_paid') AND deleted_at IS NULL`)
    .bind(fa.orgId, contactId)
    .first<{ n: number; due: number; last: string | null }>();
  return { openInvoices: r?.n ?? 0, owed: r?.due ?? 0, currency: fa.org.currency, lastIssued: r?.last ?? null };
}

// ------------------------------------------------------------------ one customer record (CRM company <-> Finance)

linkRoutes.get('/crm/:org/companies/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const orgId = c.req.param('org');
  const company = await companyOf(db, 'crm', orgId);
  const { row } = await crmRecord(c, orgId, 'crm_companies', c.req.param('id'), 'companies');
  if (!company || !company.tools.finance) return c.json({ company: company ? { id: company.id, name: company.name } : null, finance: null });
  const fa = await maybeFin(db, company.tools.finance, user);
  if (!fa) return c.json({ company: { id: company.id, name: company.name }, finance: { access: false } });
  const contactId = await customerFor(c, company.id, fa, row, false);
  const contact = contactId ? await db.prepare('SELECT id, name FROM fin_contacts WHERE id = ? AND org_id = ?').bind(contactId, fa.orgId).first<{ id: string; name: string }>() : null;
  return c.json({
    company: { id: company.id, name: company.name },
    finance: {
      access: true,
      orgId: fa.orgId,
      canCreate: !!fa.perms.contacts.create,
      contact: contact ? { ...contact, url: `/finance/o/${fa.orgId}/contacts/${contact.id}` } : null,
      receivables: contact ? await receivables(db, fa, contact.id) : null,
    },
  });
});

linkRoutes.post('/crm/:org/companies/:id/customer', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  await rateLimit(db, `co-link:${user.id}`, 60, 60_000);
  const orgId = c.req.param('org');
  const company = await companyOf(db, 'crm', orgId);
  if (!company?.tools.finance) throw new HttpError(400, 'This CRM organisation does not belong to a company that runs Finance');
  const { row } = await crmRecord(c, orgId, 'crm_companies', c.req.param('id'), 'companies');
  const fa = await maybeFin(db, company.tools.finance, user);
  if (!fa) throw new HttpError(403, 'You have no access to the company’s Finance');
  const input = await body(c, z.object({ finContactId: z.string().max(64).optional() }));
  if (input.finContactId) {
    if (!hasPerm(fa, 'contacts', 'view')) throw new HttpError(403, 'Your Finance role cannot see customers');
    const contact = await db.prepare("SELECT id FROM fin_contacts WHERE id = ? AND org_id = ? AND kind IN ('customer','both') AND archived_at IS NULL").bind(input.finContactId, fa.orgId).first();
    if (!contact) throw notFound('Finance customer');
    const t = now();
    await db.batch([
      db.prepare('DELETE FROM co_customer_links WHERE company_id = ? AND (crm_company_id = ? OR fin_contact_id = ?)').bind(company.id, row.id, input.finContactId),
      db.prepare('INSERT INTO co_customer_links (company_id, crm_company_id, fin_contact_id, created_by, created_at) VALUES (?, ?, ?, ?, ?)').bind(company.id, row.id, input.finContactId, user.id, t),
      coAuditStmt(db, { companyId: company.id, actorId: user.id, action: 'link.customer', targetType: 'crm_company', targetId: row.id, metadata: { created: false }, ip: clientIp(c) }),
    ]);
    return c.json({ contactId: input.finContactId });
  }
  return c.json({ contactId: await customerFor(c, company.id, fa, row, true) }, 201);
});

// ------------------------------------------------------------------ deals: invoice and project

async function dealView(c: any, orgId: string, dealId: string) {
  const db = c.env.DB as D1Database;
  const user = c.get('user');
  const company = await companyOf(db, 'crm', orgId);
  const { row } = await crmRecord(c, orgId, 'crm_deals', dealId, 'deals');
  if (!company) return { company: null, deal: row, link: null, fa: null as FinAccess | null, tasksRole: null as string | null };
  const link = await db.prepare('SELECT * FROM co_deal_links WHERE company_id = ? AND crm_deal_id = ?').bind(company.id, row.id).first<{ fin_invoice_id: string | null; pm_board_id: string | null }>();
  return { company, deal: row, link, fa: await maybeFin(db, company.tools.finance, user), tasksRole: await maybeTasksRole(db, company.tools.tasks, user.id) };
}

linkRoutes.get('/crm/:org/deals/:id', async (c) => {
  const db = c.env.DB;
  const v = await dealView(c, c.req.param('org'), c.req.param('id'));
  if (!v.company) return c.json({ company: null });
  const invoice = v.link?.fin_invoice_id && v.fa && hasPerm(v.fa, 'sales', 'view') ? await db.prepare('SELECT id, number, status, total FROM fin_docs WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(v.link.fin_invoice_id, v.fa.orgId).first<{ id: string; number: string; status: string; total: number }>() : null;
  const board = v.link?.pm_board_id && v.tasksRole ? await db.prepare('SELECT id, name FROM boards WHERE id = ? AND workspace_id = ? AND archived_at IS NULL').bind(v.link.pm_board_id, v.company.tools.tasks!).first<{ id: string; name: string }>() : null;
  return c.json({
    company: { id: v.company.id, name: v.company.name },
    deal: { status: v.deal.status, value: v.deal.value, currency: v.deal.currency },
    finance: v.company.tools.finance
      ? {
          access: !!v.fa,
          canInvoice: !!v.fa?.perms.sales.create && v.deal.status === 'won' && !v.link?.fin_invoice_id,
          sameCurrency: !v.fa || v.fa.org.currency === v.deal.currency,
          invoice: invoice ? { ...invoice, currency: v.fa!.org.currency, url: `/finance/o/${v.fa!.orgId}/invoices/${invoice.id}` } : v.link?.fin_invoice_id ? { hidden: true } : null,
          canQuote: !!v.fa?.perms.sales.create && v.deal.status !== 'lost' && (!v.fa || v.fa.org.currency === v.deal.currency),
          quotes: v.fa && hasPerm(v.fa, 'sales', 'view') ? await dealQuotes(db, v.fa, v.deal.id) : null,
        }
      : null,
    tasks: v.company.tools.tasks
      ? { access: !!v.tasksRole, canStart: !!v.tasksRole && !v.link?.pm_board_id, project: board ? { ...board, url: `/tasks/w/${v.company.tools.tasks}/boards/${board.id}` } : v.link?.pm_board_id ? { hidden: true } : null }
      : null,
  });
});

async function saveDealLink(db: D1Database, companyId: string, dealId: string, userId: string, set: { fin_invoice_id?: string; pm_board_id?: string }) {
  const t = now();
  const cols = Object.keys(set) as ('fin_invoice_id' | 'pm_board_id')[];
  return db
    .prepare(
      `INSERT INTO co_deal_links (company_id, crm_deal_id, ${cols.join(', ')}, created_by, created_at, updated_at) VALUES (?, ?, ${cols.map(() => '?').join(', ')}, ?, ?, ?)
       ON CONFLICT(company_id, crm_deal_id) DO UPDATE SET ${cols.map((k) => `${k} = excluded.${k}`).join(', ')}, updated_at = excluded.updated_at`,
    )
    .bind(companyId, dealId, ...cols.map((k) => set[k]), userId, t, t);
}

linkRoutes.post('/crm/:org/deals/:id/invoice', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  await rateLimit(db, `co-link:${user.id}`, 60, 60_000);
  const v = await dealView(c, c.req.param('org'), c.req.param('id'));
  if (!v.company?.tools.finance) throw new HttpError(400, 'This CRM organisation does not belong to a company that runs Finance');
  if (!v.fa) throw new HttpError(403, 'You have no access to the company’s Finance');
  if (!v.fa.perms.sales.create) throw new HttpError(403, 'Your Finance role cannot create invoices');
  if (v.deal.status !== 'won') throw new HttpError(400, 'Only a won deal becomes an invoice');
  if (v.link?.fin_invoice_id) throw new HttpError(409, 'This deal already has an invoice');
  if (v.fa.org.currency !== v.deal.currency) throw new HttpError(400, `The deal is in ${v.deal.currency} and Finance keeps ${v.fa.org.currency}: make the invoice in Finance`);
  if (!v.deal.company_id) throw new HttpError(400, 'Give the deal a company first: the invoice is made out to it');
  const crmCompany = await db.prepare('SELECT * FROM crm_companies WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(v.deal.company_id, v.deal.org_id).first<any>();
  if (!crmCompany) throw notFound('Company');
  const contactId = await customerFor(c, v.company.id, v.fa, crmCompany, true);
  const sales = await db.prepare("SELECT id, tax_code_id FROM fin_accounts WHERE org_id = ? AND type = 'revenue' AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1").bind(v.fa.orgId).first<{ id: string; tax_code_id: string | null }>();
  const today = todayIn(v.fa.org.timezone || 'Australia/Sydney');
  const doc = await createDoc(
    c.env,
    v.fa,
    {
      kind: 'invoice',
      contactId,
      issueDate: today,
      reference: v.deal.title.slice(0, 200),
      lines: [{ description: v.deal.title, quantity: 1, unitPrice: v.deal.value, accountId: sales?.id ?? null, taxCodeId: v.fa.gst ? (sales?.tax_code_id ?? null) : null }],
      notes: 'From a won deal in the CRM. Check the amount, GST and account before approving.',
      action: 'draft',
    },
    (p) => c.executionCtx.waitUntil(p),
  );
  await db.batch([
    await saveDealLink(db, v.company.id, v.deal.id, user.id, { fin_invoice_id: doc.id }),
    coAuditStmt(db, { companyId: v.company.id, actorId: user.id, action: 'link.deal_invoice', targetType: 'crm_deal', targetId: v.deal.id, ip: clientIp(c) }),
  ]);
  return c.json({ invoiceId: doc.id, number: doc.number, url: `/finance/o/${v.fa.orgId}/invoices/${doc.id}` }, 201);
});

/** The deal's quotes in Finance (newest first), with their status: what the CRM shows on the deal. */
async function dealQuotes(db: D1Database, fa: FinAccess, dealId: string) {
  const rows = await db
    .prepare("SELECT id, number, status, total, version, expiry_date, accepted_at, created_by FROM fin_quotes WHERE org_id = ? AND crm_deal_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 20")
    .bind(fa.orgId, dealId)
    .all<{ id: string; number: string; status: string; total: number; version: number; expiry_date: string | null; accepted_at: number | null; created_by: string | null }>();
  // A role that sees only its own sales records sees only its own quotes here too.
  return rows.results
    .filter((q) => fa.perms.sales.view === 'all' || q.created_by === fa.userId)
    .map((q) => ({ id: q.id, number: q.number, status: q.status, total: q.total, version: q.version, expiryDate: q.expiry_date, currency: fa.org.currency, url: `/finance/o/${fa.orgId}/quotes/${q.id}` }));
}

/**
 * A quote for the deal: a draft in the company's Finance, made out to the deal's company (its Finance customer, made
 * once), with one line for the deal's value to change there. Its progress shows on the deal and its timeline.
 */
linkRoutes.post('/crm/:org/deals/:id/quote', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  await rateLimit(db, `co-link:${user.id}`, 60, 60_000);
  const v = await dealView(c, c.req.param('org'), c.req.param('id'));
  if (!v.company?.tools.finance) throw new HttpError(400, 'This CRM organisation does not belong to a company that runs Finance');
  if (!v.fa) throw new HttpError(403, 'You have no access to the company’s Finance');
  if (!v.fa.perms.sales.create) throw new HttpError(403, 'Your Finance role cannot create quotes');
  if (v.deal.status === 'lost') throw new HttpError(400, 'This deal is lost');
  if (v.fa.org.currency !== v.deal.currency) throw new HttpError(400, `The deal is in ${v.deal.currency} and Finance keeps ${v.fa.org.currency}: make the quote in Finance`);
  if (!v.deal.company_id) throw new HttpError(400, 'Give the deal a company first: the quote is made out to it');
  const crmCompany = await db.prepare('SELECT * FROM crm_companies WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(v.deal.company_id, v.deal.org_id).first<any>();
  if (!crmCompany) throw notFound('Company');
  const contactId = await customerFor(c, v.company.id, v.fa, crmCompany, true);
  const sales = await db.prepare("SELECT id, tax_code_id FROM fin_accounts WHERE org_id = ? AND type = 'revenue' AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1").bind(v.fa.orgId).first<{ id: string; tax_code_id: string | null }>();
  const today = todayIn(v.fa.org.timezone || 'Australia/Sydney');
  const q = await createQuote(
    c.env,
    v.fa,
    {
      contactId,
      issueDate: today,
      reference: v.deal.title.slice(0, 200),
      lines: [{ description: v.deal.title, quantity: 1, unitPrice: v.deal.value, accountId: sales?.id ?? null, taxCodeId: v.fa.gst ? (sales?.tax_code_id ?? null) : null }],
    },
    { crmDealId: v.deal.id, from: 'CRM deal' },
  );
  const ev = await dealEventStmt(db, v.fa.orgId, v.deal.id, user.id, `Quote ${q.number} started in Finance`, { quoteId: q.id, number: q.number });
  await db.batch([...(ev ? [ev] : []), coAuditStmt(db, { companyId: v.company.id, actorId: user.id, action: 'link.deal_quote', targetType: 'crm_deal', targetId: v.deal.id, ip: clientIp(c) })]);
  return c.json({ quoteId: q.id, number: q.number, url: `/finance/o/${v.fa.orgId}/quotes/${q.id}` }, 201);
});

// ------------------------------------------------------------------ Finance: customers from the CRM

/**
 * The CRM's companies, for choosing a customer in Finance: one customer record across the company. Each shows the
 * Finance contact it is already billed as, so choosing it never makes a second record. Only companies the person may
 * see in the CRM are listed.
 */
linkRoutes.get('/finance/:org/crm-customers', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const orgId = c.req.param('org');
  const fa = await finAccess(db, orgId, user);
  const company = await companyOf(db, 'finance', orgId);
  if (!company?.tools.crm) return c.json({ available: false, rows: [] });
  let ca: OrgAccess;
  try {
    ca = await crmAccess(db, company.tools.crm, user);
  } catch {
    return c.json({ available: true, access: false, rows: [] });
  }
  if (ca.perms.companies.view === 'none') return c.json({ available: true, access: false, rows: [] });
  const q = (c.req.query('q') ?? '').trim().toLowerCase().replace(/[%_]/g, '');
  const scope = crmScopeSql(ca, 'companies', 'co');
  const rows = await db
    .prepare(
      `SELECT co.id, co.name, co.email, co.phone, l.fin_contact_id
       FROM crm_companies co LEFT JOIN co_customer_links l ON l.company_id = ? AND l.crm_company_id = co.id
       WHERE co.org_id = ? AND co.deleted_at IS NULL ${q ? 'AND lower(co.name) LIKE ?' : ''} AND ${scope.sql}
       ORDER BY co.name COLLATE NOCASE LIMIT 25`,
    )
    .bind(company.id, company.tools.crm, ...(q ? [`%${q}%`] : []), ...scope.args)
    .all<any>();
  const linked = rows.results.filter((r) => r.fin_contact_id).map((r) => r.fin_contact_id);
  const live = linked.length ? new Set((await db.prepare(`SELECT id FROM fin_contacts WHERE org_id = ? AND id IN (${linked.map(() => '?').join(',')})`).bind(fa.orgId, ...linked).all<{ id: string }>()).results.map((r) => r.id)) : new Set<string>();
  return c.json({
    available: true,
    access: true,
    canCreate: !!fa.perms.contacts.create,
    rows: rows.results.map((r) => ({ id: r.id, name: r.name, email: r.email ?? '', phone: r.phone ?? '', contactId: r.fin_contact_id && live.has(r.fin_contact_id) ? r.fin_contact_id : null })),
  });
});

/** Choose a CRM company as a Finance customer: its linked contact, or a new one made from its details and linked. */
linkRoutes.post('/finance/:org/crm-customers/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  await rateLimit(db, `co-link:${user.id}`, 60, 60_000);
  const orgId = c.req.param('org');
  const fa = await finAccess(db, orgId, user);
  const company = await companyOf(db, 'finance', orgId);
  if (!company?.tools.crm) throw new HttpError(400, 'This Finance workspace does not belong to a company that runs the CRM');
  const { row } = await crmRecord(c, company.tools.crm, 'crm_companies', c.req.param('id'), 'companies');
  return c.json({ contactId: await customerFor(c, company.id, fa, row, true) });
});

linkRoutes.post('/crm/:org/deals/:id/project', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  await rateLimit(db, `co-link:${user.id}`, 60, 60_000);
  const v = await dealView(c, c.req.param('org'), c.req.param('id'));
  if (!v.company?.tools.tasks) throw new HttpError(400, 'This CRM organisation does not belong to a company that runs Project Management');
  if (!v.tasksRole) throw new HttpError(403, 'You cannot create projects in the company’s Project Management');
  if (v.link?.pm_board_id) throw new HttpError(409, 'This deal already has a project');
  const wsId = v.company.tools.tasks;
  const boardId = await instantiateTemplate(db, { ...BLANK_TEMPLATE, description: '' }, { workspaceId: wsId, name: v.deal.title.slice(0, 200), createdBy: user.id, kind: 'board', visibility: 'workspace', withItems: false });
  await db.batch([
    db.prepare('UPDATE boards SET description = ? WHERE id = ?').bind('Started from a deal in the CRM.', boardId),
    await saveDealLink(db, v.company.id, v.deal.id, user.id, { pm_board_id: boardId }),
    coAuditStmt(db, { companyId: v.company.id, actorId: user.id, action: 'link.deal_project', targetType: 'crm_deal', targetId: v.deal.id, ip: clientIp(c) }),
  ]);
  return c.json({ boardId, url: `/tasks/w/${wsId}/boards/${boardId}` }, 201);
});

// ------------------------------------------------------------------ projects: costs and budget from Finance

/** A project's income and costs in Finance: this financial year and since it began, from posted journals. */
async function projectFigures(db: D1Database, fa: FinAccess, trackingId: string, budget: number | null) {
  const today = todayIn(fa.org.timezone || 'Australia/Sydney');
  const from = fyStart(today, fa.org.fy_start_month ?? 7);
  const rows = await db
    .prepare(
      `SELECT a.type, SUM(CASE WHEN j.date >= ? THEN l.debit - l.credit ELSE 0 END) AS year, SUM(l.debit - l.credit) AS total
       FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id AND j.org_id = l.org_id JOIN fin_accounts a ON a.id = l.account_id AND a.org_id = l.org_id
       WHERE l.org_id = ? AND l.project_id = ? AND j.status = 'posted' AND a.type IN ('revenue','expense') GROUP BY a.type`,
    )
    .bind(from, fa.orgId, trackingId)
    .all<{ type: 'revenue' | 'expense'; year: number; total: number }>();
  const rev = rows.results.find((r) => r.type === 'revenue');
  const exp = rows.results.find((r) => r.type === 'expense');
  const costs = exp?.total ?? 0;
  return {
    currency: fa.org.currency,
    income: -(rev?.total ?? 0),
    costs,
    incomeThisYear: -(rev?.year ?? 0),
    costsThisYear: exp?.year ?? 0,
    budget,
    remaining: budget === null ? null : budget - costs,
    overBudget: budget !== null && costs > budget,
  };
}

linkRoutes.get('/projects/:board', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const { board } = await requireProject(db, c.req.param('board'), user.id, 'view');
  const company = await companyOf(db, 'tasks', board.workspace_id);
  if (!company) return c.json({ company: null });
  const link = await db.prepare('SELECT * FROM co_project_links WHERE company_id = ? AND pm_board_id = ?').bind(company.id, board.id).first<{ fin_tracking_id: string; budget: number | null }>();
  const fa = await maybeFin(db, company.tools.finance, user);
  const seesFinance = !!fa && hasPerm(fa, 'reports', 'view');
  const deal = await db.prepare('SELECT crm_deal_id FROM co_deal_links WHERE company_id = ? AND pm_board_id = ?').bind(company.id, board.id).first<{ crm_deal_id: string }>();
  return c.json({
    company: { id: company.id, name: company.name },
    finance: company.tools.finance
      ? {
          access: seesFinance,
          linked: !!link,
          canLink: !!fa && hasPerm(fa, 'accounting', 'manage'),
          figures: link && fa && seesFinance ? await projectFigures(db, fa, link.fin_tracking_id, link.budget) : null,
        }
      : null,
    deal: deal && company.tools.crm ? { id: deal.crm_deal_id, url: `/crm/o/${company.tools.crm}/deals/${deal.crm_deal_id}` } : null,
  });
});

linkRoutes.post('/projects/:board/finance', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  await rateLimit(db, `co-link:${user.id}`, 60, 60_000);
  const { board } = await requireProject(db, c.req.param('board'), user.id, 'view');
  const company = await companyOf(db, 'tasks', board.workspace_id);
  if (!company?.tools.finance) throw new HttpError(400, 'This workspace does not belong to a company that runs Finance');
  const fa = await maybeFin(db, company.tools.finance, user);
  if (!fa || !hasPerm(fa, 'accounting', 'manage')) throw new HttpError(403, 'Your Finance role cannot add tracking projects');
  const input = await body(c, z.object({ budget: z.number().int().min(0).max(1e13).nullable().optional() }));
  const existing = await db.prepare('SELECT fin_tracking_id FROM co_project_links WHERE company_id = ? AND pm_board_id = ?').bind(company.id, board.id).first<{ fin_tracking_id: string }>();
  const t = now();
  if (existing) {
    await db.batch([
      db.prepare('UPDATE co_project_links SET budget = ?, updated_at = ? WHERE company_id = ? AND pm_board_id = ?').bind(input.budget ?? null, t, company.id, board.id),
      coAuditStmt(db, { companyId: company.id, actorId: user.id, action: 'link.project_budget', targetType: 'board', targetId: board.id, ip: clientIp(c) }),
    ]);
    return c.json({ trackingId: existing.fin_tracking_id });
  }
  const trackingId = newId();
  await db.batch([
    db.prepare("INSERT INTO fin_tracking (id, org_id, kind, name, code, created_at) VALUES (?, ?, 'project', ?, '', ?)").bind(trackingId, fa.orgId, board.name.slice(0, 120), t),
    db.prepare('INSERT INTO co_project_links (company_id, pm_board_id, fin_tracking_id, budget, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(company.id, board.id, trackingId, input.budget ?? null, user.id, t, t),
    coAuditStmt(db, { companyId: company.id, actorId: user.id, action: 'link.project_finance', targetType: 'board', targetId: board.id, ip: clientIp(c) }),
  ]);
  return c.json({ trackingId }, 201);
});

/** The company's projects with their Finance figures, for the control centre (people who see Finance reports). */
export async function companyProjects(db: D1Database, tools: Partial<Record<ToolApp, string>>, companyId: string, user: { id: string; name: string }) {
  if (!tools.tasks) return [];
  const boards = await db.prepare("SELECT b.id, b.name, l.fin_tracking_id, l.budget, d.crm_deal_id FROM boards b LEFT JOIN co_project_links l ON l.company_id = ? AND l.pm_board_id = b.id LEFT JOIN co_deal_links d ON d.company_id = ? AND d.pm_board_id = b.id WHERE b.workspace_id = ? AND b.kind = 'board' AND b.visibility = 'workspace' AND b.archived_at IS NULL ORDER BY b.name COLLATE NOCASE LIMIT 200").bind(companyId, companyId, tools.tasks).all<{ id: string; name: string; fin_tracking_id: string | null; budget: number | null; crm_deal_id: string | null }>();
  const fa = await maybeFin(db, tools.finance, user);
  const sees = !!fa && hasPerm(fa, 'reports', 'view');
  const out = [];
  for (const b of boards.results) {
    out.push({ id: b.id, name: b.name, url: `/tasks/w/${tools.tasks}/boards/${b.id}`, fromDeal: !!b.crm_deal_id, finance: b.fin_tracking_id && sees && fa ? await projectFigures(db, fa, b.fin_tracking_id, b.budget) : null, linked: !!b.fin_tracking_id });
  }
  return out;
}
