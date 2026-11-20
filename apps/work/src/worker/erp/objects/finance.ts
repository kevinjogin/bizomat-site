// Draft invoices in Finance from the new modules (subscriptions, timesheets, field service jobs, progress claims), made
// as Release 5 makes a shipment's invoice (src/worker/erp/logistics.ts): through Finance's own createDoc, by someone whose
// Finance role may create invoices, for the company's one customer record, once per key however often or concurrently it
// is asked (erp_integration_events), never posted. A failure is recorded and may be retried.

import type { Env } from '../../env';
import { HttpError, newId, now } from '../../lib/util';
import { createDoc } from '../../fin/docs';
import { todayIn } from '../../../shared/fin/dates';
import { badState } from '../util';
import type { ErpAccess } from '../access';
import { resolveCustomer } from '../sales';
import { financeOrgsFor, maybeFin } from '../suppliers';
import { customerInput } from './refs';

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface DraftInvoice {
  /** The customer reference (crm:<id> or fin:<id>). */
  customer: string | null;
  lines: InvoiceLine[];
  /** Shown on the invoice and used to find one made before a failure. */
  reference: string;
  notes: string;
  /** One invoice per key. */
  key: string;
  sourceType: string;
  sourceId: string;
}

export async function draftInvoice(env: Env, a: ErpAccess, user: { id: string; name: string }, d: DraftInvoice): Promise<{ invoiceId: string; orgId: string; existing: boolean; url: string }> {
  const db = env.DB;
  if (!d.customer) badState('Choose the customer first');
  const lines = d.lines.filter((l) => l.quantity > 0 && l.unitPrice >= 0);
  if (!lines.length) badState('There is nothing to invoice');
  const org = (await financeOrgsFor(db, a))[0];
  if (!org) badState('This company does not run a Finance business workspace to invoice from');
  const cust = await resolveCustomer(db, a, user, customerInput(d.customer));
  if (!cust.finContactId) badState(cust.crmCompanyId && a.kind === 'registered' ? `Link ${cust.name} to its Finance customer first: open the company in the CRM, In Finance` : 'The customer has no Finance customer record to invoice');
  const fa = await maybeFin(db, org.id, user);
  if (!fa) throw new HttpError(403, 'You have no access to the company’s Finance workspace');
  if (!fa.perms.sales.create) throw new HttpError(403, 'Your Finance role cannot create invoices');
  const key = d.key.slice(0, 200);
  const t = now();
  await db
    .prepare("INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, target_org_id, created_by, created_at, updated_at) VALUES (?, ?, 'finance.draft_invoice', ?, ?, 'finance', ?, 'pending', 0, ?, ?, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING")
    .bind(newId(), a.companyId, d.sourceType.slice(0, 40), d.sourceId, key, org.id, a.userId, t, t)
    .run();
  const ev = (await db.prepare('SELECT * FROM erp_integration_events WHERE company_id = ? AND idempotency_key = ?').bind(a.companyId, key).first<any>())!;
  if (!ev) throw new HttpError(409, 'That invoice belongs to another company');
  const url = (id: string) => `/erp/finance/o/${ev.target_org_id ?? org.id}/invoices/${id}`;
  if (ev.status === 'done') return { invoiceId: ev.target_ref, orgId: ev.target_org_id, existing: true, url: url(ev.target_ref) };
  // only one request at a time makes it (attempts moves on, compared and set in one statement)
  const claim = await db
    .prepare("UPDATE erp_integration_events SET attempts = attempts + 1, status = 'pending', updated_at = ? WHERE company_id = ? AND idempotency_key = ? AND attempts = ? AND status IN ('pending','failed') AND (attempts = 0 OR status = 'failed' OR updated_at < ?)")
    .bind(t, a.companyId, key, ev.attempts, t - 120_000)
    .run();
  if (!claim.meta.changes) throw new HttpError(409, 'The draft invoice is being made now: refresh in a moment');
  try {
    const before = await db.prepare("SELECT id FROM fin_docs WHERE org_id = ? AND kind = 'invoice' AND reference = ? AND deleted_at IS NULL").bind(org.id, d.reference.slice(0, 200)).first<{ id: string }>();
    let invoiceId = before?.id;
    if (!invoiceId) {
      const codes = await db.prepare("SELECT id FROM fin_tax_codes WHERE org_id = ? AND system_key = 'gst_sales' AND archived_at IS NULL").bind(org.id).first<{ id: string }>();
      const sales = await db.prepare("SELECT id FROM fin_accounts WHERE org_id = ? AND type = 'revenue' AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1").bind(org.id).first<{ id: string }>();
      const made = await createDoc(env, fa, {
        kind: 'invoice',
        contactId: cust.finContactId,
        issueDate: todayIn(fa.org.timezone || 'Australia/Sydney'),
        reference: d.reference.slice(0, 200),
        notes: d.notes.slice(0, 2000),
        action: 'draft',
        lines: lines.map((l) => ({ itemCode: '', description: l.description.slice(0, 1000), unit: '', quantity: Math.round(l.quantity * 1000) / 1000, unitPrice: Math.round(l.unitPrice), discountBp: 0, accountId: sales?.id ?? null, taxCodeId: codes?.id ?? null })),
      });
      invoiceId = made.id;
    }
    await db.prepare("UPDATE erp_integration_events SET status = 'done', target_ref = ?, target_org_id = ?, last_error = '', amount_cents = ?, updated_at = ? WHERE company_id = ? AND idempotency_key = ?").bind(invoiceId, org.id, Math.round(lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0)), now(), a.companyId, key).run();
    return { invoiceId: invoiceId!, orgId: org.id, existing: !!before, url: url(invoiceId!) };
  } catch (e) {
    const msg = e instanceof HttpError ? e.message : 'Finance could not make the invoice';
    await db.prepare("UPDATE erp_integration_events SET status = 'failed', last_error = ?, updated_at = ? WHERE company_id = ? AND idempotency_key = ?").bind(msg.slice(0, 200), now(), a.companyId, key).run();
    throw e;
  }
}
