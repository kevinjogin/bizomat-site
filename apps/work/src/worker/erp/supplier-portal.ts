// The supplier portal (batch 2, item 5; flag supplier_portal, off until the owner switches it on; docs/erp/supplier-portal.md).
//
// A buyer invites one of a supplier's people by email (erp_supplier_portal_users). That person signs in with their own
// BIZOMAT account (one is made from the invitation if they have none), and accepts with the account of the invited
// address. They are never members of the company and have no ERP role: the portal reads only that supplier's records
// in that company, every statement scoped by company and supplier.
//
//   Purchase orders  approved, sent or being received (and closed or cancelled ones that were sent): the lines, prices,
//                    dates and terms, never the company's internal notes; acknowledged once per revision (accepted with
//                    the promised date, or declined), which tells the buyer.
//   Requests         the requests for quotation the supplier is on, once sent; a quotation is sent while the request is
//                    open, and replaces their earlier one. Nobody's other quotation, and not who was chosen.
//   Documents        PDF and images added to an order, with the same checks as every upload; the portal shows the
//                    supplier's own, never the company's attachments.
// Everything is in the company's history (erp_events) and the audit log; revoking ends the access at once.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, randomToken, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { MAX_FILE_BYTES, validateUpload } from '../routes/files';
import { flagOn } from '../platform/flags';
import { audit } from '../services/audit';
import { enqueueEmail, processOutbox } from '../services/email/outbox';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';
import { appBase } from '../services/app-url';
import { checkAddress, loadPolicy } from '../services/signup-guard';
import { requireErp } from './access';
import { badState, dollars, eventStmt, eventStmtIf, zDate, zId, zText } from './util';
import { alert } from './objects/alerts';

const INVITE_DAYS = 14;
const OPEN_PO = ['approved', 'sent', 'partially_received'];
const SHOWN_PO = [...OPEN_PO, 'received', 'closed'];

async function portalOn(db: D1Database, companyId: string): Promise<boolean> {
  return flagOn(db, 'supplier_portal', { companyId }).catch(() => false);
}

const erpUrl = (env: Env, path: string) => `${appBase(env).origin}/erp${path.startsWith('/') ? path : `/${path}`}`;

// ------------------------------------------------------------------ the buyer's side (inside the ERP)

export const supplierPortalStaffRoutes = new Hono<AppEnv>();

async function staffSupplier(c: Context<AppEnv>, cap: 'suppliers.view' | 'suppliers.edit') {
  const a = await requireErp(c, cap);
  if (!(await portalOn(c.env.DB, a.companyId))) throw new HttpError(404, 'The supplier portal is not switched on for this company');
  const s = await c.env.DB.prepare('SELECT id, number, legal_name, trading_name, status, archived_at FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!s) throw notFound('Supplier');
  return { a, s };
}

function portalUserDTO(r: any) {
  return { id: r.id, email: r.email, status: r.status, name: r.user_name ?? null, invitedAt: r.invited_at, expiresAt: r.expires_at, acceptedAt: r.accepted_at, revokedAt: r.revoked_at, invitedBy: r.inviter ?? null, expired: r.status === 'invited' && r.expires_at < now() };
}

async function portalUsers(db: D1Database, companyId: string, supplierId: string) {
  const rows = await db
    .prepare('SELECT p.*, u.name AS user_name, i.name AS inviter FROM erp_supplier_portal_users p LEFT JOIN users u ON u.id = p.user_id LEFT JOIN users i ON i.id = p.invited_by WHERE p.company_id = ? AND p.supplier_id = ? ORDER BY p.invited_at DESC LIMIT 100')
    .bind(companyId, supplierId)
    .all<any>();
  return rows.results.map(portalUserDTO);
}

supplierPortalStaffRoutes.get('/c/:company/suppliers/:id/portal', async (c) => {
  const a = await requireErp(c, 'suppliers.view');
  const on = await portalOn(c.env.DB, a.companyId);
  if (!on) return c.json({ enabled: false, people: [] });
  const { s } = await staffSupplier(c, 'suppliers.view');
  return c.json({ enabled: true, people: await portalUsers(c.env.DB, a.companyId, s.id) });
});

supplierPortalStaffRoutes.post('/c/:company/suppliers/:id/portal/invitations', async (c) => {
  const { a, s } = await staffSupplier(c, 'suppliers.edit');
  const db = c.env.DB;
  await rateLimit(db, `portal-invite:${a.userId}`, 30, 3_600_000);
  if (s.archived_at) badState(`${s.number} is archived`);
  if (s.status === 'blocked') badState(`${s.number} is blocked: unblock the supplier first`);
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email().max(320) }));
  const mail = await checkAddress(c.env, input.email, await loadPolicy(db), { dns: false });
  if (!mail.ok) throw new HttpError(400, mail.message);
  // a company member is not a supplier's person here
  const member = await db.prepare('SELECT 1 FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? AND lower(u.email) = ?').bind(a.companyId, input.email).first();
  if (member) badState('This person works in the company: they see the supplier in the ERP already');
  const active = await db.prepare("SELECT 1 FROM erp_supplier_portal_users WHERE company_id = ? AND supplier_id = ? AND lower(email) = ? AND status = 'active'").bind(a.companyId, s.id, input.email).first();
  if (active) badState('This person already uses the portal for this supplier');
  const token = randomToken(32);
  const id = newId();
  const t = now();
  await db.batch([
    // an earlier invitation to the same address ends: only the newest link works
    db.prepare("UPDATE erp_supplier_portal_users SET status = 'revoked', token_hash = NULL, revoked_at = ?, revoked_by = ? WHERE company_id = ? AND supplier_id = ? AND lower(email) = ? AND status = 'invited'").bind(t, a.userId, a.companyId, s.id, input.email),
    db.prepare("INSERT INTO erp_supplier_portal_users (id, company_id, supplier_id, email, token_hash, status, invited_by, invited_at, expires_at) VALUES (?, ?, ?, ?, ?, 'invited', ?, ?, ?)").bind(id, a.companyId, s.id, input.email, await sha256Hex(token), a.userId, t, t + INVITE_DAYS * 86_400_000),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.portal_invited', entityType: 'supplier', entityId: s.id, summary: `${s.number}: ${input.email} invited to the supplier portal`, at: t }),
  ]);
  const url = erpUrl(c.env, `/supplier-portal/join/${encodeURIComponent(token)}`);
  let delivery = 'not_configured';
  if (emailConfig(await emailEnv(c.env)).provider !== 'none' && a.kind === 'registered') {
    const r = await enqueueEmail(c.env, {
      to: input.email,
      data: { template: 'notification', organisation: a.companyName, title: `${a.companyName} invites you to its supplier portal`, body: `${a.userName} invited you to see ${s.trading_name || s.legal_name}'s purchase orders and requests for quotation from ${a.companyName}, and to answer them. Sign in or create a BIZOMAT account with this address (${input.email}). The link works for ${INVITE_DAYS} days.`, url },
      idempotencyKey: `portal-invite:${id}`,
      sensitive: true,
    });
    delivery = r.queued ? 'queued' : r.reason;
    c.executionCtx?.waitUntil?.(processOutbox(c.env, { max: 5 }).catch(() => null));
  }
  return c.json({ url, delivery, people: await portalUsers(db, a.companyId, s.id) }, 201);
});

supplierPortalStaffRoutes.post('/c/:company/suppliers/:id/portal/:pid/revoke', async (c) => {
  const { a, s } = await staffSupplier(c, 'suppliers.edit');
  const db = c.env.DB;
  const p = await db.prepare('SELECT id, email, status FROM erp_supplier_portal_users WHERE company_id = ? AND supplier_id = ? AND id = ?').bind(a.companyId, s.id, c.req.param('pid')).first<any>();
  if (!p) throw notFound('Portal access');
  if (p.status === 'revoked') return c.json({ people: await portalUsers(db, a.companyId, s.id) });
  const t = now();
  await db.batch([
    db.prepare("UPDATE erp_supplier_portal_users SET status = 'revoked', token_hash = NULL, revoked_at = ?, revoked_by = ? WHERE company_id = ? AND id = ?").bind(t, a.userId, a.companyId, p.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'supplier.portal_revoked', entityType: 'supplier', entityId: s.id, summary: `${s.number}: supplier portal access of ${p.email} ended`, at: t }),
  ]);
  return c.json({ people: await portalUsers(db, a.companyId, s.id) });
});

/** A purchase order's answers and documents from the supplier, for the buyer's order page. */
supplierPortalStaffRoutes.get('/c/:company/purchase-orders/:id/portal', async (c) => {
  const a = await requireErp(c, 'purchasing.view');
  const db = c.env.DB;
  const po = await db.prepare('SELECT id, supplier_id FROM erp_purchase_orders WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!po) throw notFound('Purchase order');
  const acks = await db.prepare('SELECT k.*, u.name AS user_name FROM erp_po_acknowledgements k LEFT JOIN users u ON u.id = k.user_id WHERE k.company_id = ? AND k.po_id = ? ORDER BY k.revision DESC').bind(a.companyId, po.id).all<any>();
  return c.json({ enabled: await portalOn(db, a.companyId), acknowledgements: acks.results.map((k) => ({ revision: k.revision, decision: k.decision, promisedDate: k.promised_date, note: k.note, by: k.user_name ?? null, at: k.created_at })) });
});

// ------------------------------------------------------------------ the supplier's side (/api/supplier-portal)

export const supplierPortalRoutes = new Hono<AppEnv>();

/** Browser sessions only: an API token never reaches the portal. */
function person(c: Context<AppEnv>) {
  if (!c.get('session')) throw new HttpError(403, 'The supplier portal is used in a browser, signed in');
  return c.get('user') as { id: string; name: string; email: string };
}

interface Portal {
  companyId: string;
  companyName: string;
  supplierId: string;
  supplierNumber: string;
  supplierName: string;
  userId: string;
  userName: string;
}

/** The person's portal for this company and supplier, or 404 (never saying whether it exists for someone else). */
async function portal(c: Context<AppEnv>): Promise<Portal> {
  const u = person(c);
  const db = c.env.DB;
  const companyId = (c.req.param('company') ?? '').slice(0, 64);
  const supplierId = (c.req.param('supplier') ?? '').slice(0, 64);
  const row = await db
    .prepare(
      `SELECT p.company_id, p.supplier_id, s.number, s.legal_name, s.trading_name, k.name AS company_name
         FROM erp_supplier_portal_users p
         JOIN erp_suppliers s ON s.company_id = p.company_id AND s.id = p.supplier_id AND s.archived_at IS NULL AND s.status <> 'blocked'
         JOIN companies k ON k.id = p.company_id
        WHERE p.company_id = ? AND p.supplier_id = ? AND p.user_id = ? AND p.status = 'active'`,
    )
    .bind(companyId, supplierId, u.id)
    .first<any>();
  if (!row || !(await portalOn(db, companyId))) throw notFound('Supplier portal');
  return { companyId, companyName: row.company_name, supplierId, supplierNumber: row.number, supplierName: row.trading_name || row.legal_name, userId: u.id, userName: u.name };
}

supplierPortalRoutes.get('/', async (c) => {
  const u = person(c);
  const rows = await c.env.DB.prepare(
    `SELECT p.company_id, p.supplier_id, s.number, s.legal_name, s.trading_name, k.name AS company_name
       FROM erp_supplier_portal_users p
       JOIN erp_suppliers s ON s.company_id = p.company_id AND s.id = p.supplier_id AND s.archived_at IS NULL
       JOIN companies k ON k.id = p.company_id
      WHERE p.user_id = ? AND p.status = 'active' ORDER BY k.name COLLATE NOCASE LIMIT 50`,
  )
    .bind(u.id)
    .all<any>();
  const out = [];
  for (const r of rows.results) if (await portalOn(c.env.DB, r.company_id)) out.push({ companyId: r.company_id, companyName: r.company_name, supplierId: r.supplier_id, supplierName: r.trading_name || r.legal_name });
  return c.json({ portals: out });
});

async function invitation(c: Context<AppEnv>) {
  const db = c.env.DB;
  const row = await db
    .prepare('SELECT p.*, s.legal_name, s.trading_name, k.name AS company_name FROM erp_supplier_portal_users p JOIN erp_suppliers s ON s.company_id = p.company_id AND s.id = p.supplier_id JOIN companies k ON k.id = p.company_id WHERE p.token_hash = ?')
    .bind(await sha256Hex(c.req.param('token') ?? ''))
    .first<any>();
  if (!row || !(await portalOn(db, row.company_id))) throw notFound('Invitation');
  return row;
}

supplierPortalRoutes.get('/invitations/:token', async (c) => {
  const u = person(c);
  await rateLimit(c.env.DB, `portal-join:${clientIp(c)}`, 60, 15 * 60_000);
  const r = await invitation(c);
  const status = r.status !== 'invited' ? r.status : r.expires_at < now() ? 'expired' : 'pending';
  return c.json({ companyName: r.company_name, supplierName: r.trading_name || r.legal_name, status, forYou: r.email.toLowerCase() === u.email.toLowerCase(), email: r.email.toLowerCase() === u.email.toLowerCase() ? r.email : null });
});

supplierPortalRoutes.post('/invitations/:token/accept', async (c) => {
  const u = person(c);
  const db = c.env.DB;
  await rateLimit(db, `portal-join:${clientIp(c)}`, 30, 15 * 60_000);
  const r = await invitation(c);
  if (r.status !== 'invited' || r.expires_at < now()) throw new HttpError(410, 'This invitation has ended: ask the company for a new one');
  if (r.email.toLowerCase() !== u.email.toLowerCase()) throw new HttpError(403, `This invitation is for another email address. Sign in with the account of the address it was sent to.`);
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_supplier_portal_users SET status = 'active', user_id = ?, token_hash = NULL, accepted_at = ? WHERE company_id = ? AND id = ? AND status = 'invited'").bind(u.id, t, r.company_id, r.id),
    eventStmt(db, { companyId: r.company_id, actorId: u.id, action: 'supplier.portal_joined', entityType: 'supplier', entityId: r.supplier_id, summary: `${u.email} joined the supplier portal`, at: t }),
  ]);
  if (!res[0].meta.changes) throw new HttpError(409, 'This invitation was just used or ended');
  await audit(db, { actorId: u.id, action: 'supplier_portal.joined', targetType: 'supplier', targetId: r.supplier_id, metadata: { company: r.company_id }, ip: clientIp(c) });
  return c.json({ companyId: r.company_id, supplierId: r.supplier_id });
});

// ------------------------------------------------------------------ purchase orders

function poLineDTO(l: any) {
  return { id: l.id, position: l.position, item: l.item || l.product_name || '', productNumber: l.product_number ?? null, specification: l.specification, quantity: l.quantity, uom: l.uom, unitPriceCents: l.unit_price_cents, discountBp: l.discount_bp, taxCode: l.tax_code, netCents: l.net_cents, taxCents: l.tax_cents, receivedQty: l.received_qty, requiredDate: l.required_date ?? null };
}

async function poFor(db: D1Database, p: Portal, id: string) {
  const po = await db
    .prepare(`SELECT * FROM erp_purchase_orders WHERE company_id = ? AND supplier_id = ? AND id = ? AND (status IN (${SHOWN_PO.map(() => '?').join(',')}) OR (status = 'cancelled' AND sent_at IS NOT NULL))`)
    .bind(p.companyId, p.supplierId, id.slice(0, 64), ...SHOWN_PO)
    .first<any>();
  if (!po) throw notFound('Purchase order');
  return po;
}

supplierPortalRoutes.get('/:company/:supplier', async (c) => {
  const p = await portal(c);
  const db = c.env.DB;
  const [orders, rfqs] = await db.batch([
    db.prepare(`SELECT id, number, status, revision, order_date, required_date, currency, total_cents, (SELECT decision FROM erp_po_acknowledgements k WHERE k.company_id = o.company_id AND k.po_id = o.id AND k.revision = o.revision) AS ack FROM erp_purchase_orders o WHERE o.company_id = ? AND o.supplier_id = ? AND (o.status IN (${SHOWN_PO.map(() => '?').join(',')}) OR (o.status = 'cancelled' AND o.sent_at IS NOT NULL)) ORDER BY o.order_date DESC LIMIT 200`).bind(p.companyId, p.supplierId, ...SHOWN_PO),
    db.prepare("SELECT r.id, r.number, r.title, r.status, r.reply_by, r.required_date, r.currency, (SELECT total_cents FROM erp_quotations q WHERE q.company_id = r.company_id AND q.rfq_id = r.id AND q.supplier_id = x.supplier_id) AS quoted FROM erp_rfq_suppliers x JOIN erp_rfqs r ON r.company_id = x.company_id AND r.id = x.rfq_id WHERE x.company_id = ? AND x.supplier_id = ? AND r.status <> 'draft' ORDER BY r.created_at DESC LIMIT 200").bind(p.companyId, p.supplierId),
  ]);
  return c.json({
    company: { id: p.companyId, name: p.companyName },
    supplier: { id: p.supplierId, number: p.supplierNumber, name: p.supplierName },
    orders: (orders.results as any[]).map((o) => ({ id: o.id, number: o.number, status: o.status, revision: o.revision, orderDate: o.order_date, requiredDate: o.required_date, currency: o.currency, totalCents: o.total_cents, acknowledged: o.ack ?? null, needsAnswer: OPEN_PO.includes(o.status) && !o.ack })),
    rfqs: (rfqs.results as any[]).map((r) => ({ id: r.id, number: r.number, title: r.title, open: r.status === 'sent', replyBy: r.reply_by, requiredDate: r.required_date, currency: r.currency, quotedCents: r.quoted ?? null })),
  });
});

supplierPortalRoutes.get('/:company/:supplier/orders/:po', async (c) => {
  const p = await portal(c);
  const db = c.env.DB;
  const po = await poFor(db, p, c.req.param('po'));
  const [lines, acks, files] = await db.batch([
    db.prepare('SELECT l.*, pr.number AS product_number, pr.name AS product_name FROM erp_po_lines l LEFT JOIN erp_products pr ON pr.company_id = l.company_id AND pr.id = l.product_id WHERE l.company_id = ? AND l.po_id = ? ORDER BY l.position').bind(p.companyId, po.id),
    db.prepare('SELECT revision, decision, promised_date, note, created_at FROM erp_po_acknowledgements WHERE company_id = ? AND po_id = ? ORDER BY revision DESC').bind(p.companyId, po.id),
    // the supplier's own documents only: the company's attachments are its own
    db.prepare("SELECT f.id, f.name, f.mime, f.size, f.created_at FROM erp_record_files f WHERE f.company_id = ? AND f.entity_type = 'purchase_order' AND f.entity_id = ? AND f.deleted_at IS NULL AND f.uploaded_by IN (SELECT user_id FROM erp_supplier_portal_users WHERE company_id = ? AND supplier_id = ? AND user_id IS NOT NULL) ORDER BY f.created_at DESC LIMIT 100").bind(p.companyId, po.id, p.companyId, p.supplierId),
  ]);
  const ack = (acks.results as any[]).find((k) => k.revision === po.revision) ?? null;
  return c.json({
    order: { id: po.id, number: po.number, status: po.status, revision: po.revision, orderDate: po.order_date, requiredDate: po.required_date, deliveryAddress: po.delivery_address, paymentTermsDays: po.payment_terms_days, currency: po.currency, taxMode: po.tax_mode, terms: po.terms, subtotalCents: po.subtotal_cents, taxCents: po.tax_cents, totalCents: po.total_cents, cancelled: po.status === 'cancelled' },
    lines: (lines.results as any[]).map(poLineDTO),
    acknowledgement: ack ? { decision: ack.decision, promisedDate: ack.promised_date, note: ack.note, at: ack.created_at } : null,
    canAnswer: OPEN_PO.includes(po.status) && !ack,
    history: (acks.results as any[]).map((k) => ({ revision: k.revision, decision: k.decision, promisedDate: k.promised_date, at: k.created_at })),
    files: (files.results as any[]).map((f) => ({ id: f.id, name: f.name, mime: f.mime, size: f.size, createdAt: f.created_at, url: `/api/supplier-portal/${p.companyId}/${p.supplierId}/files/${f.id}` })),
  });
});

supplierPortalRoutes.post('/:company/:supplier/orders/:po/acknowledge', async (c) => {
  const p = await portal(c);
  const db = c.env.DB;
  await rateLimit(db, `portal-write:${p.userId}`, 60, 60_000);
  const po = await poFor(db, p, c.req.param('po'));
  if (!OPEN_PO.includes(po.status)) badState(`${po.number} is ${po.status.replace('_', ' ')}: it is no longer answered`);
  const input = await body(c, z.object({ decision: z.enum(['accepted', 'declined']), promisedDate: zDate.nullable().optional(), note: zText(1000).optional() }));
  if (input.decision === 'accepted' && !input.promisedDate) throw new HttpError(400, 'Give the date you promise to deliver');
  if (input.decision === 'declined' && !(input.note ?? '').trim()) throw new HttpError(400, 'Say why you decline the order');
  const t = now();
  try {
    await db.batch([
      db.prepare('INSERT INTO erp_po_acknowledgements (id, company_id, po_id, revision, decision, promised_date, note, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), p.companyId, po.id, po.revision, input.decision, input.promisedDate ?? null, (input.note ?? '').trim(), p.userId, t),
      eventStmt(db, { companyId: p.companyId, actorId: p.userId, action: `po.${input.decision === 'accepted' ? 'acknowledged' : 'declined_by_supplier'}`, entityType: 'purchase_order', entityId: po.id, summary: `${po.number} revision ${po.revision} ${input.decision === 'accepted' ? `accepted by ${p.supplierName} for ${input.promisedDate}` : `declined by ${p.supplierName}: ${(input.note ?? '').trim()}`} (supplier portal)`.slice(0, 500), at: t }),
    ]);
  } catch (e) {
    if (/UNIQUE/i.test(String((e as Error)?.message ?? e))) badState('This revision of the order is already answered');
    throw e;
  }
  const co = { companyId: p.companyId, kind: 'registered' as const, companyName: p.companyName };
  await alert(c.env, co, { userIds: [po.created_by, po.submitted_by], kind: 'portal', title: `${po.number} ${input.decision === 'accepted' ? `accepted by ${p.supplierName}, promised for ${input.promisedDate}` : `declined by ${p.supplierName}`}`, body: (input.note ?? '').slice(0, 300), link: `/c/${p.companyId}/procurement/purchase-orders/${po.id}`, dedupe: `portal-ack:${po.id}:${po.revision}` }).catch(() => 0);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ requests for quotation

async function rfqFor(db: D1Database, p: Portal, id: string) {
  const r = await db
    .prepare("SELECT r.* FROM erp_rfq_suppliers x JOIN erp_rfqs r ON r.company_id = x.company_id AND r.id = x.rfq_id WHERE x.company_id = ? AND x.supplier_id = ? AND r.id = ? AND r.status <> 'draft'")
    .bind(p.companyId, p.supplierId, id.slice(0, 64))
    .first<any>();
  if (!r) throw notFound('Request for quotation');
  return r;
}

supplierPortalRoutes.get('/:company/:supplier/rfqs/:rfq', async (c) => {
  const p = await portal(c);
  const db = c.env.DB;
  const r = await rfqFor(db, p, c.req.param('rfq'));
  const [lines, mine] = await db.batch([
    db.prepare('SELECT l.*, pr.number AS product_number, pr.name AS product_name FROM erp_rfq_lines l LEFT JOIN erp_products pr ON pr.company_id = l.company_id AND pr.id = l.product_id WHERE l.company_id = ? AND l.rfq_id = ? ORDER BY l.position').bind(p.companyId, r.id),
    db.prepare('SELECT q.*, (SELECT json_group_array(json_object(\'rfqLineId\', ql.rfq_line_id, \'unitPriceCents\', ql.unit_price_cents, \'leadTimeDays\', ql.lead_time_days, \'note\', ql.note)) FROM erp_quotation_lines ql WHERE ql.company_id = q.company_id AND ql.quotation_id = q.id) AS lines_json FROM erp_quotations q WHERE q.company_id = ? AND q.rfq_id = ? AND q.supplier_id = ?').bind(p.companyId, r.id, p.supplierId),
  ]);
  const q = (mine.results as any[])[0];
  return c.json({
    rfq: { id: r.id, number: r.number, title: r.title, open: r.status === 'sent', replyBy: r.reply_by, requiredDate: r.required_date, currency: r.currency, deliveryAddress: r.delivery_address, notes: r.notes },
    lines: (lines.results as any[]).map((l) => ({ id: l.id, position: l.position, item: l.item || l.product_name || '', productNumber: l.product_number ?? null, specification: l.specification, quantity: l.quantity, uom: l.uom })),
    quotation: q ? { reference: q.reference, validUntil: q.valid_until, leadTimeDays: q.lead_time_days, freightCents: q.freight_cents, paymentTermsDays: q.payment_terms_days, currency: q.currency, notes: q.notes, totalCents: q.total_cents, source: q.source, lines: JSON.parse(q.lines_json || '[]') } : null,
  });
});

supplierPortalRoutes.put('/:company/:supplier/rfqs/:rfq/quotation', async (c) => {
  const p = await portal(c);
  const db = c.env.DB;
  await rateLimit(db, `portal-write:${p.userId}`, 60, 60_000);
  const r = await rfqFor(db, p, c.req.param('rfq'));
  if (r.status !== 'sent') badState(`${r.number} is closed for quotations`);
  const input = await body(
    c,
    z.object({
      reference: zText(100).optional(),
      validUntil: zDate.optional(),
      leadTimeDays: z.number().int().min(0).max(1000).nullable().optional(),
      freightCents: z.number().int().min(0).max(1e11).optional(),
      paymentTermsDays: z.number().int().min(0).max(365).nullable().optional(),
      notes: zText(4000).optional(),
      lines: z.array(z.object({ rfqLineId: zId, unitPriceCents: z.number().int().min(0).max(1e11).nullable().optional(), leadTimeDays: z.number().int().min(0).max(1000).nullable().optional(), note: zText(500).optional() })).min(1).max(200),
    }),
  );
  const lines = await db.prepare('SELECT id, quantity FROM erp_rfq_lines WHERE company_id = ? AND rfq_id = ?').bind(p.companyId, r.id).all<{ id: string; quantity: number }>();
  const byId = new Map(lines.results.map((l) => [l.id, l]));
  for (const l of input.lines) if (!byId.has(l.rfqLineId)) throw new HttpError(400, 'A price is for a line of this request');
  const subtotal = input.lines.reduce((s, l) => s + (l.unitPriceCents === null || l.unitPriceCents === undefined ? 0 : Math.round(l.unitPriceCents * byId.get(l.rfqLineId)!.quantity)), 0);
  const freight = input.freightCents ?? 0;
  const existing = await db.prepare('SELECT id FROM erp_quotations WHERE company_id = ? AND rfq_id = ? AND supplier_id = ?').bind(p.companyId, r.id, p.supplierId).first<{ id: string }>();
  const id = existing?.id ?? newId();
  const t = now();
  // the request stays open while the quotation is written: a request closed at the same moment refuses it
  const res = await db.batch([
    db
      .prepare(
        `INSERT INTO erp_quotations (id, company_id, rfq_id, supplier_id, reference, received_date, valid_until, lead_time_days, freight_cents, payment_terms_days, currency, notes, subtotal_cents, total_cents, created_by, created_at, updated_at, source)
         SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?16, 'portal' WHERE EXISTS (SELECT 1 FROM erp_rfqs WHERE company_id = ?2 AND id = ?3 AND status = 'sent')
         ON CONFLICT(company_id, rfq_id, supplier_id) DO UPDATE SET reference = ?5, received_date = ?6, valid_until = ?7, lead_time_days = ?8, freight_cents = ?9, payment_terms_days = ?10, notes = ?12, subtotal_cents = ?13, total_cents = ?14, updated_at = ?16, source = 'portal'`,
      )
      .bind(id, p.companyId, r.id, p.supplierId, input.reference ?? '', new Date(t).toISOString().slice(0, 10), input.validUntil ?? null, input.leadTimeDays ?? null, freight, input.paymentTermsDays ?? null, r.currency, input.notes ?? '', subtotal, subtotal + freight, p.userId, t),
    db.prepare("DELETE FROM erp_quotation_lines WHERE company_id = ? AND quotation_id = ? AND EXISTS (SELECT 1 FROM erp_rfqs WHERE company_id = ? AND id = ? AND status = 'sent')").bind(p.companyId, id, p.companyId, r.id),
    ...input.lines.map((l) => db.prepare("INSERT INTO erp_quotation_lines (company_id, quotation_id, rfq_line_id, unit_price_cents, lead_time_days, note) SELECT ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM erp_rfqs WHERE company_id = ? AND id = ? AND status = 'sent')").bind(p.companyId, id, l.rfqLineId, l.unitPriceCents ?? null, l.leadTimeDays ?? null, l.note ?? '', p.companyId, r.id)),
    eventStmtIf(db, { companyId: p.companyId, actorId: p.userId, action: existing ? 'quotation.updated' : 'quotation.recorded', entityType: 'rfq', entityId: r.id, summary: `${r.number}: quotation from ${p.supplierNumber} ${p.supplierName} ${existing ? 'changed' : 'sent'} through the supplier portal, ${dollars(subtotal + freight)} ${r.currency} with freight`, after: { quotation: id, totalCents: subtotal + freight, source: 'portal' }, at: t }, "EXISTS (SELECT 1 FROM erp_rfqs WHERE company_id = ? AND id = ? AND status = 'sent')", [p.companyId, r.id]),
  ]);
  if (!res[0].meta.changes) badState(`${r.number} was closed for quotations meanwhile`);
  await alert(c.env, { companyId: p.companyId, kind: 'registered', companyName: p.companyName }, { userIds: [r.created_by], kind: 'portal', title: `${r.number}: quotation from ${p.supplierName} (${dollars(subtotal + freight)} ${r.currency})`, link: `/c/${p.companyId}/procurement/rfqs/${r.id}`, dedupe: `portal-quote:${r.id}:${p.supplierId}:${t}` }).catch(() => 0);
  return c.json({ id, totalCents: subtotal + freight });
});

// ------------------------------------------------------------------ documents

supplierPortalRoutes.post('/:company/:supplier/orders/:po/files', async (c) => {
  const p = await portal(c);
  const db = c.env.DB;
  await rateLimit(db, `portal-upload:${p.userId}`, 30, 60_000);
  const po = await poFor(db, p, c.req.param('po'));
  if (po.status === 'cancelled' || po.status === 'closed') badState(`${po.number} is ${po.status}`);
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const { name, type, bytes } = await validateUpload(file);
  if (!(type === 'application/pdf' || type.startsWith('image/'))) throw new HttpError(400, 'Add a PDF or a picture');
  const id = newId();
  const key = `erp/${p.companyId}/purchase_order/${po.id}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: p.userId, source: 'supplier-portal' } });
  const t = now();
  await db.batch([
    db.prepare("INSERT INTO erp_record_files (id, company_id, entity_type, entity_id, name, mime, size, r2_key, uploaded_by, created_at) VALUES (?, ?, 'purchase_order', ?, ?, ?, ?, ?, ?, ?)").bind(id, p.companyId, po.id, name, type, bytes.byteLength, key, p.userId, t),
    eventStmt(db, { companyId: p.companyId, actorId: p.userId, action: 'file.uploaded', entityType: 'purchase_order', entityId: po.id, summary: `File added to purchase order ${po.number} by ${p.supplierName} (supplier portal): ${name}`, after: { file: id, name, size: bytes.byteLength, source: 'portal' }, at: t }),
  ]);
  return c.json({ id, name, mime: type, size: bytes.byteLength, createdAt: t, url: `/api/supplier-portal/${p.companyId}/${p.supplierId}/files/${id}` }, 201);
});

supplierPortalRoutes.get('/:company/:supplier/files/:id', async (c) => {
  const p = await portal(c);
  const f = await c.env.DB.prepare("SELECT f.* FROM erp_record_files f JOIN erp_purchase_orders o ON o.company_id = f.company_id AND o.id = f.entity_id AND o.supplier_id = ? WHERE f.company_id = ? AND f.id = ? AND f.entity_type = 'purchase_order' AND f.deleted_at IS NULL AND f.uploaded_by IN (SELECT user_id FROM erp_supplier_portal_users WHERE company_id = ? AND supplier_id = ? AND user_id IS NOT NULL)").bind(p.supplierId, p.companyId, (c.req.param('id') ?? '').slice(0, 64), p.companyId, p.supplierId).first<any>();
  if (!f) throw notFound('File');
  const obj = await c.env.FILES.get(f.r2_key);
  if (!obj) throw notFound('File');
  return new Response(obj.body, { headers: { 'Content-Type': f.mime, 'Content-Disposition': `attachment; filename="${String(f.name).replace(/[^\w.\- ]/g, '_')}"`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
});
