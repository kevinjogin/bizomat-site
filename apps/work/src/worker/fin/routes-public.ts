// What a customer sees through a secure online link (/finance/view/<kind>/<id>?k=<signature>), without signing in: the
// document, its PDF (drawn by the same engine as every other copy), and for a quote, accepting or declining it.
//
// The signature is checked on every request (render.ts, linkValid); withdrawing the link, voiding or deleting the
// record makes it stop working. Opening the link records that the customer viewed it, and nothing else: it never
// marks an invoice paid. Visits by members of the workspace are not counted as the customer's.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, clientIp, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { resolveAuth } from '../auth/session';
import { todayIn } from '../../shared/fin/dates';
import type { FinAccess, FinOrgRow } from './access';
import { type LinkKind, type PartyRow, linkValid, pdfResponse, personName, renderBasics, renderPdf, docRender } from './render';
import { type CreditRow, type QuoteRow, acceptQuote, creditRender, declineQuote, expireQuotes, quoteRender, quoteViewed } from './sales';
import { auditStmt } from './util';

export const publicDocRoutes = new Hono<AppEnv>();

const KINDS: Record<string, LinkKind> = { quote: 'quote', invoice: 'invoice', 'credit-note': 'credit_note' };
const TABLE = { quote: 'fin_quotes', invoice: 'fin_docs', credit_note: 'fin_credit_notes' } as const;

interface Loaded {
  kind: LinkKind;
  row: any;
  org: FinOrgRow;
  /** Rendering needs only the workspace and whether it charges GST. */
  access: FinAccess;
}

async function load(c: any, kindParam: string, id: string): Promise<Loaded> {
  const kind = KINDS[kindParam];
  const k = c.req.query('k') ?? '';
  if (!kind || typeof id !== 'string' || id.length > 64) throw notFound('Document');
  const env = c.env as Env;
  const row = await env.DB.prepare(`SELECT * FROM ${TABLE[kind]} WHERE id = ? AND deleted_at IS NULL${kind === 'invoice' ? " AND kind = 'invoice'" : ''}`).bind(id).first<any>();
  // The same answer whether the record does not exist, the link was withdrawn or the signature is wrong.
  if (!row || !(await linkValid(env, kind, row.id, row.public_nonce, k))) throw new HttpError(404, 'This link is not valid. It may have been withdrawn: ask the sender for a new one.');
  const org = await env.DB.prepare("SELECT * FROM fin_orgs WHERE id = ? AND deleted_at IS NULL AND kind = 'business'").bind(row.org_id).first<FinOrgRow>();
  if (!org) throw notFound('Document');
  return { kind, row, org, access: { org, orgId: org.id, gst: !!org.gst_registered } as FinAccess };
}

/** Whether the visitor is a member of the workspace (their visits are not the customer's). */
async function isMember(c: any, orgId: string): Promise<boolean> {
  const auth = await resolveAuth(c).catch(() => null);
  if (!auth) return false;
  return !!(await c.env.DB.prepare('SELECT 1 FROM fin_members WHERE org_id = ? AND user_id = ?').bind(orgId, auth.user.id).first());
}

const party = (db: D1Database, contactId: string | null) => (contactId ? db.prepare('SELECT name, abn, address, email FROM fin_contacts WHERE id = ?').bind(contactId).first<PartyRow>() : Promise.resolve(null));

async function pdfOf(env: Env, l: Loaded): Promise<Uint8Array> {
  const db = env.DB;
  const basics = await renderBasics(env, l.org.id, l.org.logo_key, l.row.template_id);
  const contact = await party(db, l.row.contact_id);
  if (l.kind === 'quote') {
    const lines = await db.prepare('SELECT * FROM fin_quote_lines WHERE quote_id = ? ORDER BY line_no').bind(l.row.id).all<any>();
    return renderPdf(env, l.access, quoteRender(l.row as QuoteRow, lines.results, basics.rates, await personName(db, l.row.sales_rep_id)), contact, basics);
  }
  if (l.kind === 'credit_note') {
    const lines = await db.prepare('SELECT * FROM fin_credit_note_lines WHERE credit_note_id = ? ORDER BY line_no').bind(l.row.id).all<any>();
    const inv = l.row.invoice_id ? await db.prepare('SELECT number FROM fin_docs WHERE id = ?').bind(l.row.invoice_id).first<{ number: string }>() : null;
    return renderPdf(env, l.access, creditRender({ ...(l.row as CreditRow), invoice_number: inv?.number ?? null }, lines.results, basics.rates), contact, basics);
  }
  const d = l.row;
  const lines = await db.prepare('SELECT * FROM fin_doc_lines WHERE doc_id = ? ORDER BY line_no').bind(d.id).all<any>();
  const credited = (await db.prepare('SELECT COALESCE(SUM(amount), 0) AS n FROM fin_credit_allocations WHERE invoice_id = ? AND voided_at IS NULL').bind(d.id).first<{ n: number }>())?.n ?? 0;
  const quote = d.quote_id ? await db.prepare('SELECT number FROM fin_quotes WHERE id = ?').bind(d.quote_id).first<{ number: string }>() : null;
  const dto = {
    kind: d.kind,
    number: d.number,
    status: d.status,
    issueDate: d.issue_date,
    dueDate: d.due_date,
    reference: d.reference,
    taxMode: d.tax_mode,
    discountBp: d.discount_bp,
    subtotal: d.subtotal,
    taxTotal: d.tax_total,
    total: d.total,
    amountPaid: d.amount_paid,
    amountDue: d.status === 'void' ? 0 : d.total - d.amount_paid,
    notes: d.notes,
    terms: d.terms,
    deliveryAddress: d.delivery_address,
    lines: lines.results.map((x) => ({ lineKind: x.line_kind, itemCode: x.item_code, description: x.description, quantity: x.quantity_milli / 1000, unit: x.unit, unitPrice: x.unit_price, discountBp: x.discount_bp, taxCodeId: x.tax_code_id })),
  };
  return renderPdf(env, l.access, docRender(dto, basics.rates, { salesRep: await personName(db, d.sales_rep_id), relatedNumber: quote?.number, credited }), contact, basics);
}

function publicStatus(l: Loaded, today: string): string {
  const r = l.row;
  if (l.kind === 'invoice') {
    if (r.status === 'void') return 'void';
    if (r.status === 'paid') return 'paid';
    if (r.due_date && r.due_date < today) return 'overdue';
    return r.status === 'part_paid' ? 'part_paid' : 'due';
  }
  if (l.kind === 'credit_note') return r.status === 'void' ? 'void' : 'issued';
  return r.status === 'viewed' ? 'sent' : r.status;
}

publicDocRoutes.get('/view/:kind/:id', async (c) => {
  await rateLimit(c.env.DB, `fin-view:${clientIp(c)}`, 120, 15 * 60_000);
  let l = await load(c, c.req.param('kind'), c.req.param('id'));
  const today = todayIn(l.org.timezone);
  if (l.kind === 'quote') {
    await expireQuotes(c.env.DB, l.org.id, today);
    l = await load(c, c.req.param('kind'), c.req.param('id'));
  }
  if (!(await isMember(c, l.org.id))) {
    if (l.kind === 'quote') await quoteViewed(c.env.DB, l.row as QuoteRow);
    else if (!l.row.viewed_at) await c.env.DB.prepare(`UPDATE ${TABLE[l.kind]} SET viewed_at = ? WHERE id = ? AND viewed_at IS NULL`).bind(now(), l.row.id).run();
  }
  const r = l.row;
  const contact = await party(c.env.DB, r.contact_id);
  const k = c.req.query('k');
  const kindPath = c.req.param('kind');
  return c.json(
    {
      kind: l.kind,
      number: r.number,
      organisation: { name: l.org.legal_name || l.org.name, abn: l.org.abn, email: l.org.email, phone: l.org.phone },
      customer: contact?.name ?? null,
      issueDate: r.issue_date,
      dueDate: l.kind === 'invoice' ? r.due_date : null,
      expiryDate: l.kind === 'quote' ? r.expiry_date : null,
      currency: l.org.currency,
      total: r.total,
      amountDue: l.kind === 'invoice' ? (r.status === 'void' ? 0 : r.total - r.amount_paid) : l.kind === 'credit_note' ? r.total - r.allocated - r.refunded : null,
      status: publicStatus(l, today),
      version: l.kind === 'quote' ? r.version : null,
      canRespond: l.kind === 'quote' && ['sent', 'viewed'].includes(r.status) && (!r.expiry_date || r.expiry_date >= today),
      accepted: l.kind === 'quote' && r.accepted_at ? { name: r.accepted_name, at: r.accepted_at } : null,
      declined: l.kind === 'quote' && r.status === 'declined',
      pdf: `api/fin-public/view/${kindPath}/${r.id}/pdf?k=${encodeURIComponent(k ?? '')}`,
    },
    200,
    { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  );
});

publicDocRoutes.get('/view/:kind/:id/pdf', async (c) => {
  await rateLimit(c.env.DB, `fin-view:${clientIp(c)}`, 120, 15 * 60_000);
  const l = await load(c, c.req.param('kind'), c.req.param('id'));
  const res = pdfResponse(await pdfOf(c.env, l), l.row.number, c.req.query('download') !== '1');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
});

const acceptSchema = z.object({ name: z.string().trim().min(2, 'Type your full name').max(120), agree: z.literal(true, { message: 'Confirm that you accept the quote' }) });

publicDocRoutes.post('/view/quote/:id/accept', async (c) => {
  await rateLimit(c.env.DB, `fin-respond:${clientIp(c)}`, 20, 15 * 60_000);
  const l = await load(c, 'quote', c.req.param('id'));
  const today = todayIn(l.org.timezone);
  if (l.row.expiry_date && l.row.expiry_date < today) throw new HttpError(409, 'This quote has expired. Ask the sender for a new one.');
  const input = await body(c, acceptSchema);
  await acceptQuote(c.env, null, l.row as QuoteRow, { name: input.name, online: true, actorId: null, ip: clientIp(c) });
  await c.env.DB.batch([auditStmt(c.env.DB, { orgId: l.org.id, actorId: null, action: 'quote.accepted_online', targetType: 'quote', targetId: l.row.id, ip: clientIp(c) })]);
  return c.json({ ok: true });
});

publicDocRoutes.post('/view/quote/:id/decline', async (c) => {
  await rateLimit(c.env.DB, `fin-respond:${clientIp(c)}`, 20, 15 * 60_000);
  const l = await load(c, 'quote', c.req.param('id'));
  const input = await body(c, z.object({ reason: z.string().trim().max(1000).optional(), name: z.string().trim().max(120).optional() }));
  await declineQuote(c.env, null, l.row as QuoteRow, { reason: input.reason ?? '', online: true, actorId: null, name: input.name ?? '', ip: clientIp(c) });
  await c.env.DB.batch([auditStmt(c.env.DB, { orgId: l.org.id, actorId: null, action: 'quote.declined_online', targetType: 'quote', targetId: l.row.id, ip: clientIp(c) })]);
  return c.json({ ok: true });
});

