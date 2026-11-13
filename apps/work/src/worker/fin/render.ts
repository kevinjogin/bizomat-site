// From stored (or unsaved) records to the document engine (document.ts): the workspace's template, logo and tax rates,
// and each kind of record mapped onto one shape. Used by the PDF downloads, the live previews, the secure online links
// and the emails, so every one of them shows the same document.

import type { Env } from '../env';
import { HttpError, base64url, sha256Hex, timingSafeEqual } from '../lib/util';
import { docLineAmount } from './ledger';
import type { FinAccess } from './access';
import { documentPdf, type RenderDoc, type RenderKind, type RenderLine, type RenderTemplate } from './document';

export interface RenderBasics {
  template: (RenderTemplate & { id: string }) | null;
  logo: Uint8Array | null;
  rates: Map<string, number>;
}

/** The template (the one chosen, else the default), the logo and every tax code's rate. */
export async function renderBasics(env: Env, orgId: string, logoKey: string | null, templateId?: string | null): Promise<RenderBasics> {
  const db = env.DB;
  const template = await db
    .prepare(templateId ? 'SELECT * FROM fin_doc_templates WHERE id = ? AND org_id = ?' : 'SELECT * FROM fin_doc_templates WHERE org_id = ? ORDER BY is_default DESC, created_at LIMIT 1')
    .bind(...(templateId ? [templateId, orgId] : [orgId]))
    .first<any>();
  const rates = new Map((await db.prepare('SELECT id, rate_bp FROM fin_tax_codes WHERE org_id = ?').bind(orgId).all<{ id: string; rate_bp: number }>()).results.map((r) => [r.id, r.rate_bp]));
  let logo: Uint8Array | null = null;
  if (logoKey) {
    const obj = await env.FILES.get(logoKey);
    if (obj) logo = new Uint8Array(await obj.arrayBuffer());
  }
  return { template, logo, rates };
}

/** A stored or priced line, as the engine draws it. */
export function renderLine(
  l: { lineKind?: string | null; itemCode?: string | null; description?: string | null; quantity?: number; unit?: string | null; unitPrice?: number; discountBp?: number; taxCodeId?: string | null; optional?: boolean | number },
  rates: Map<string, number>,
): RenderLine {
  const quantity = l.quantity ?? 1;
  const amount = l.lineKind === 'heading' ? 0 : docLineAmount(l.unitPrice ?? 0, Math.round(quantity * 1000), l.discountBp ?? 0);
  return {
    kind: l.lineKind === 'heading' ? 'heading' : 'item',
    itemCode: l.itemCode ?? '',
    description: l.description ?? '',
    quantity,
    unit: l.unit ?? '',
    unitPrice: l.unitPrice ?? 0,
    discountBp: l.discountBp ?? 0,
    taxRateBp: l.taxCodeId ? (rates.get(l.taxCodeId) ?? 0) : null,
    amount,
    optional: !!l.optional,
  };
}

/** The whole-document discount in the lines' own basis: what came off the counted lines. */
export function discountOf(lines: RenderLine[], bp: number): number {
  if (!bp) return 0;
  return lines.filter((l) => l.kind === 'item' && !l.optional).reduce((n, l) => n + Math.round((l.amount * bp) / 10_000), 0);
}

/** A person's name in this app (the salesperson on a document). */
export async function personName(db: D1Database, userId: string | null | undefined): Promise<string> {
  if (!userId) return '';
  return (await db.prepare('SELECT name FROM users WHERE id = ?').bind(userId).first<{ name: string }>())?.name ?? '';
}

/** An invoice, bill, purchase order or expense claim (its DTO from docs.ts) as the engine draws it. */
export function docRender(
  d: { kind: string; number: string; status: string; issueDate: string; dueDate: string | null; reference: string; taxMode: string; discountBp?: number; subtotal: number; taxTotal: number; total: number; amountPaid: number; amountDue: number; notes: string; terms: string; deliveryAddress?: string; lines: any[] },
  rates: Map<string, number>,
  extras: { salesRep?: string; relatedNumber?: string; credited?: number } = {},
): RenderDoc {
  const lines = d.lines.map((l) => renderLine(l, rates));
  return {
    kind: d.kind as RenderKind,
    number: d.number,
    status: d.status,
    issueDate: d.issueDate,
    dueDate: d.dueDate,
    reference: d.reference ?? '',
    salesRep: extras.salesRep ?? '',
    taxMode: d.taxMode as RenderDoc['taxMode'],
    discountBp: d.discountBp ?? 0,
    discountTotal: discountOf(lines, d.discountBp ?? 0),
    subtotal: d.subtotal,
    taxTotal: d.taxTotal,
    total: d.total,
    amountPaid: d.amountPaid,
    amountDue: d.amountDue,
    notes: d.notes ?? '',
    terms: d.terms ?? '',
    deliveryAddress: d.deliveryAddress ?? '',
    relatedNumber: extras.relatedNumber,
    credited: extras.credited ?? 0,
    lines,
  };
}

export interface PartyRow {
  name: string;
  abn?: string | null;
  address?: string | null;
  email?: string | null;
}

/** The PDF of one document. */
export async function renderPdf(env: Env, a: FinAccess, doc: RenderDoc, contact: PartyRow | null, basics: RenderBasics, claimant?: string | null) {
  return documentPdf({
    org: a.org,
    gst: a.gst,
    doc,
    contact: contact ? { name: contact.name, abn: contact.abn ?? '', address: contact.address ?? '', email: contact.email ?? '' } : null,
    claimant: claimant ?? null,
    template: basics.template,
    logo: basics.logo,
  });
}

/** A PDF to download, or to show inline (then it may be framed by pages of the same origin, the preview). */
export function pdfResponse(bytes: Uint8Array, name: string, inline: boolean) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${name.replace(/[^A-Za-z0-9_-]/g, '_')}.pdf"`,
    'Cache-Control': 'private, no-store',
  };
  if (inline) {
    headers['X-Frame-Options'] = 'SAMEORIGIN';
    headers['Content-Security-Policy'] = "frame-ancestors 'self'";
  }
  return new Response(bytes, { headers });
}

// ------------------------------------------------------------------ secure online links

export type LinkKind = 'quote' | 'invoice' | 'credit_note';

/**
 * A secure online link: a signature over the kind, the record and a value stored with it (its "nonce"). Nothing
 * secret is stored: the signature is recomputed to check a link, and clearing the nonce withdraws every link to the
 * record. The key is the server's settings key (SETTINGS_ENCRYPTION_KEY), never sent anywhere.
 */
export async function linkSignature(env: Env, kind: LinkKind, id: string, nonce: string): Promise<string> {
  const key = env.SETTINGS_ENCRYPTION_KEY;
  if (!key) throw new HttpError(503, 'Online links are not set up on this service');
  const hmacKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(`fin-link:${key}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(`${kind}:${id}:${nonce}`))));
}

/** The path of a record's online page (under /finance), with its signature. */
export async function linkPath(env: Env, kind: LinkKind, id: string, nonce: string): Promise<string> {
  return `/view/${kind.replace('_', '-')}/${id}?k=${await linkSignature(env, kind, id, nonce)}`;
}

/** Whether a presented signature is the record's. Compared in constant time on hashes. */
export async function linkValid(env: Env, kind: LinkKind, id: string, nonce: string | null, presented: string): Promise<boolean> {
  if (!nonce || !presented || presented.length > 100) return false;
  const expected = await linkSignature(env, kind, id, nonce);
  return timingSafeEqual(await sha256Hex(expected), await sha256Hex(presented));
}

export type { RenderDoc, RenderKind, RenderLine };
