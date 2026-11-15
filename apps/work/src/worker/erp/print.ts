// Purchase orders and requests for quotation as PDFs, drawn by Finance's document engine (src/worker/fin/document.ts):
// the same renderer as Finance's quotes and purchase orders, so the live preview and the PDF a person downloads or prints
// are the same bytes. The company's own details head the document (a registered company's legal name, ABN, address,
// email and phone); its Finance business workspace, when it runs one, lends its template and logo.

import type { Env } from '../env';
import { docLineAmount } from '../fin/ledger';
import { renderBasics } from '../fin/render';
import { documentPdf, type RenderDoc, type RenderInput, type RenderLine } from '../fin/document';
import type { ErpAccess } from './access';
import { financeOrgsFor } from './suppliers';

export async function companyParty(db: D1Database, a: ErpAccess): Promise<RenderInput['org']> {
  if (a.kind === 'registered') {
    const co = await db.prepare('SELECT name, legal_name, abn, email, phone, address_line1, address_line2, suburb, state, postcode FROM co_companies WHERE id = ?').bind(a.companyId).first<any>();
    if (co) {
      const address = [co.address_line1, co.address_line2, [co.suburb, co.state, co.postcode].filter(Boolean).join(' ')].filter(Boolean).join('\n');
      return { name: co.name, legal_name: co.legal_name ?? '', abn: co.abn ?? '', address, email: co.email ?? '', phone: co.phone ?? '', currency: 'AUD' };
    }
  }
  return { name: a.companyName, legal_name: '', abn: '', address: '', email: '', phone: '', currency: 'AUD' };
}

/** The company's Finance template and logo (its business workspace), else none; and whether it is registered for GST. */
async function basicsFor(env: Env, a: ErpAccess) {
  const org = (await financeOrgsFor(env.DB, a))[0];
  if (!org) return { template: null, logo: null, gst: null as boolean | null };
  const row = await env.DB.prepare('SELECT logo_key, gst_registered FROM fin_orgs WHERE id = ?').bind(org.id).first<{ logo_key: string | null; gst_registered: number }>();
  const b = await renderBasics(env, org.id, row?.logo_key ?? null);
  return { template: b.template, logo: b.logo, gst: row ? !!row.gst_registered : null };
}

export interface PrintLine {
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceCents: number;
  discountBp: number;
  taxRateBp: number | null;
}

export async function purchaseOrderPdf(
  env: Env,
  a: ErpAccess,
  po: { number: string; status: string; revision: number; orderDate: string; requiredDate: string | null; reference: string; buyer: string; taxMode: 'inclusive' | 'exclusive' | 'none'; subtotal: number; tax: number; total: number; notes: string; terms: string; deliveryAddress: string; currency: string; paymentTermsDays: number | null },
  supplier: { name: string; abn?: string; address?: string; email?: string },
  lines: PrintLine[],
) {
  const org = await companyParty(env.DB, a);
  const b = await basicsFor(env, a);
  const renderLines: RenderLine[] = lines.map((l) => ({
    kind: 'item',
    itemCode: l.itemCode,
    description: l.description,
    quantity: l.quantity,
    unit: l.unit,
    unitPrice: l.unitPriceCents,
    discountBp: l.discountBp,
    taxRateBp: po.taxMode === 'none' ? null : l.taxRateBp,
    amount: docLineAmount(l.unitPriceCents, Math.round(l.quantity * 1000), l.discountBp),
    optional: false,
  }));
  const terms = [po.paymentTermsDays !== null ? `Payment terms: ${po.paymentTermsDays} days from invoice.` : '', po.terms].filter(Boolean).join('\n');
  const doc: RenderDoc = {
    kind: 'purchase_order',
    number: po.revision > 1 ? `${po.number} rev ${po.revision}` : po.number,
    // not approved yet: marked DRAFT on every page
    status: po.status === 'draft' || po.status === 'awaiting_approval' ? 'draft' : po.status,
    issueDate: po.orderDate,
    dueDate: po.requiredDate,
    reference: po.reference,
    salesRep: po.buyer,
    taxMode: po.taxMode,
    discountBp: 0,
    discountTotal: 0,
    subtotal: po.subtotal,
    taxTotal: po.tax,
    total: po.total,
    amountPaid: 0,
    amountDue: 0,
    notes: po.notes,
    terms,
    deliveryAddress: po.deliveryAddress,
    lines: renderLines,
  };
  return documentPdf({ org: { ...org, currency: po.currency }, gst: b.gst ?? po.taxMode !== 'none', doc, contact: supplier, template: b.template, logo: b.logo });
}

export async function rfqPdf(
  env: Env,
  a: ErpAccess,
  rfq: { number: string; status: string; date: string; replyBy: string | null; requiredDate: string | null; buyer: string; notes: string; deliveryAddress: string; currency: string },
  supplier: { name: string; abn?: string; address?: string; email?: string } | null,
  lines: { itemCode: string; description: string; quantity: number; unit: string }[],
) {
  const org = await companyParty(env.DB, a);
  const b = await basicsFor(env, a);
  const reply = [
    'Please quote your unit price, lead time, freight, payment terms and how long your prices are valid, for each line.',
    rfq.requiredDate ? `We need the goods by ${rfq.requiredDate}.` : '',
    `Quote in ${rfq.currency}. Reply to the contact named above, quoting ${rfq.number}.`,
    rfq.notes,
  ]
    .filter(Boolean)
    .join('\n');
  const doc: RenderDoc = {
    kind: 'rfq',
    number: rfq.number,
    status: rfq.status === 'cancelled' ? 'cancelled' : 'open',
    issueDate: rfq.date,
    dueDate: rfq.replyBy,
    reference: '',
    salesRep: rfq.buyer,
    taxMode: 'none',
    discountBp: 0,
    discountTotal: 0,
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    amountPaid: 0,
    amountDue: 0,
    notes: reply,
    terms: '',
    deliveryAddress: rfq.deliveryAddress,
    lines: lines.map((l) => ({ kind: 'item', itemCode: l.itemCode, description: l.description, quantity: l.quantity, unit: l.unit, unitPrice: 0, discountBp: 0, taxRateBp: null, amount: 0, optional: false })),
  };
  return documentPdf({ org: { ...org, currency: rfq.currency }, gst: false, doc, contact: supplier, template: b.template, logo: b.logo });
}
