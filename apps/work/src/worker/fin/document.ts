// The document engine of BIZOMAT Finance: one renderer for quotes, invoices, credit notes, bills, purchase orders and
// expense claims. The live preview and the PDF a person downloads, prints or sends are the same bytes from this file
// (the preview shows the PDF itself), so they cannot differ.
//
// A4, portrait or landscape; the standard PDF typefaces (Helvetica, Times, Courier: no external font files); the
// workspace's logo, accent colour, titles, payment details, default terms and footer from its template. Every page has
// its number and the document's name; a draft is marked "Draft" on every page.

import { PDFDocument, StandardFonts, degrees, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import { pdfSafe } from '../services/reports/pdf';
import { formatMoney } from '../../shared/crm/money';

export type RenderKind = 'quote' | 'invoice' | 'credit_note' | 'bill' | 'purchase_order' | 'expense_claim';

export interface RenderLine {
  kind: 'item' | 'heading';
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountBp: number;
  /** The line's tax rate (basis points), or null when it has no tax code. */
  taxRateBp: number | null;
  /** The line's amount before any whole-document discount, as entered (including GST when the document is inclusive). */
  amount: number;
  optional: boolean;
}

export interface RenderDoc {
  kind: RenderKind;
  number: string;
  status: string;
  issueDate: string;
  /** Invoices and bills: due; quotes: valid until; purchase orders: delivery. */
  dueDate: string | null;
  reference: string;
  salesRep: string;
  taxMode: 'inclusive' | 'exclusive' | 'none';
  discountBp: number;
  /** The whole-document discount, in the same basis as the line amounts. */
  discountTotal: number;
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  notes: string;
  terms: string;
  deliveryAddress: string;
  /** Credit notes: why, and the invoice corrected. Invoices: the quote they came from. */
  reason?: string;
  relatedNumber?: string;
  acceptedName?: string;
  acceptedAt?: number | null;
  /** Accepted by the customer through the online link (else recorded by the business). */
  acceptedOnline?: boolean;
  /** Invoices: the part of amountPaid that credit notes cover. */
  credited?: number;
  lines: RenderLine[];
}

export interface RenderTemplate {
  title?: string;
  quote_title?: string;
  credit_note_title?: string;
  accent?: string;
  payment_instructions?: string;
  footer?: string;
  quote_terms?: string;
  invoice_terms?: string;
  layout?: 'portrait' | 'landscape';
  font?: 'helvetica' | 'times' | 'courier';
  show_signature?: number | boolean;
  show_remittance?: number | boolean;
}

export interface RenderInput {
  org: { name: string; legal_name: string; abn: string; address: string; email: string; phone: string; currency: string };
  /** The business is registered for GST. */
  gst: boolean;
  doc: RenderDoc;
  contact: { name: string; abn?: string; address?: string; email?: string } | null;
  claimant?: string | null;
  template: RenderTemplate | null;
  logo: Uint8Array | null;
}

const PORTRAIT: [number, number] = [595.28, 841.89];
const M = { left: 46, right: 46, top: 50, bottom: 58 };
const NAVY = rgb(0.039, 0.122, 0.2);
const SLATE = rgb(0.392, 0.455, 0.545);
const TEXT = rgb(0.118, 0.161, 0.231);
const LINE = rgb(0.886, 0.91, 0.941);
const HEAD_BG = rgb(0.945, 0.961, 0.976);

function hex(color: string | null | undefined, fallback: RGB): RGB {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color ?? '');
  return m ? rgb(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255) : fallback;
}

const FONTS = {
  helvetica: [StandardFonts.Helvetica, StandardFonts.HelveticaBold],
  times: [StandardFonts.TimesRoman, StandardFonts.TimesRomanBold],
  courier: [StandardFonts.Courier, StandardFonts.CourierBold],
} as const;

class Page {
  doc!: PDFDocument;
  font!: PDFFont;
  bold!: PDFFont;
  page!: PDFPage;
  size: [number, number] = PORTRAIT;
  y = 0;
  footer = '';
  /** A word across every page (DRAFT, VOID, CANCELLED...), or nothing. */
  mark = '';

  get w() {
    return this.size[0];
  }
  get h() {
    return this.size[1];
  }
  get width() {
    return this.size[0] - M.left - M.right;
  }
  get right() {
    return this.size[0] - M.right;
  }

  static async create(title: string, layout: 'portrait' | 'landscape', font: keyof typeof FONTS) {
    const p = new Page();
    p.size = layout === 'landscape' ? [PORTRAIT[1], PORTRAIT[0]] : PORTRAIT;
    p.doc = await PDFDocument.create();
    p.doc.setTitle(pdfSafe(title));
    p.doc.setProducer('BIZOMAT Finance');
    p.doc.setCreator('BIZOMAT Finance');
    const [regular, bold] = FONTS[font] ?? FONTS.helvetica;
    p.font = await p.doc.embedFont(regular);
    p.bold = await p.doc.embedFont(bold);
    p.newPage();
    return p;
  }

  newPage() {
    this.page = this.doc.addPage(this.size);
    this.y = this.h - M.top;
  }

  ensure(h: number, onBreak?: () => void) {
    if (this.y - h < M.bottom) {
      this.newPage();
      onBreak?.();
    }
  }

  text(s: string, x: number, y: number, o: { size?: number; bold?: boolean; color?: RGB; align?: 'left' | 'right' | 'center'; width?: number } = {}) {
    const font = o.bold ? this.bold : this.font;
    const size = o.size ?? 9.5;
    const t = pdfSafe(s);
    let tx = x;
    if (o.align === 'right') tx = x + (o.width ?? 0) - font.widthOfTextAtSize(t, size);
    if (o.align === 'center') tx = x + ((o.width ?? 0) - font.widthOfTextAtSize(t, size)) / 2;
    this.page.drawText(t, { x: tx, y, size, font, color: o.color ?? TEXT });
  }

  wrap(s: string, width: number, size = 9.5, bold = false): string[] {
    const font = bold ? this.bold : this.font;
    const out: string[] = [];
    for (const para of pdfSafe(s).split('\n')) {
      let line = '';
      for (const word of para.split(/\s+/)) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, size) <= width || !line) line = test;
        else {
          out.push(line);
          line = word;
        }
      }
      out.push(line);
    }
    return out;
  }

  rule(y: number, color = LINE, x1 = M.left, x2 = this.right) {
    this.page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: 0.7, color });
  }

  finish() {
    const pages = this.doc.getPages();
    pages.forEach((pg, i) => {
      const [w, h] = [pg.getWidth(), pg.getHeight()];
      if (this.mark) {
        const label = this.mark;
        const size = label.length > 6 ? 60 : 72;
        pg.drawText(label, { x: w / 2 - this.bold.widthOfTextAtSize(label, size) / 2 + 40, y: h / 2 - 60, size, font: this.bold, color: rgb(0.85, 0.87, 0.9), rotate: degrees(30), opacity: 0.45 });
      }
      const t = pdfSafe(`${this.footer}${this.footer ? '   ' : ''}Page ${i + 1} of ${pages.length}`);
      pg.drawText(t, { x: w - M.right - this.font.widthOfTextAtSize(t, 7.5), y: 28, size: 7.5, font: this.font, color: SLATE });
    });
    return this.doc.save();
  }
}

/** Statuses marked across every page: a document in one of them is not one to act on. */
const MARKS: Record<string, string> = { draft: 'DRAFT', void: 'VOID', cancelled: 'CANCELLED', expired: 'EXPIRED', declined: 'DECLINED' };

const isPng = (b: Uint8Array) => b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
const isJpeg = (b: Uint8Array) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8;

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function fmtQty(q: number): string {
  return Number.isInteger(q) ? String(q) : q.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

export function formatAbn(abn: string): string {
  const d = abn.replace(/\D/g, '');
  return d.length === 11 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : abn;
}

const bool = (v: unknown, dflt: boolean) => (v === undefined || v === null ? dflt : !!v);

/** The title a document carries. A GST-registered business's invoice with GST on it is a tax invoice. */
export function documentTitle(kind: RenderKind, gstOnIt: boolean, tpl: RenderTemplate | null): string {
  if (kind === 'invoice') {
    if (gstOnIt) return tpl?.title && /tax invoice/i.test(tpl.title) ? tpl.title : 'Tax invoice';
    return tpl?.title && !/^tax invoice$/i.test(tpl.title) ? tpl.title : 'Invoice';
  }
  if (kind === 'quote') return tpl?.quote_title || 'Quote';
  if (kind === 'credit_note') return tpl?.credit_note_title || 'Credit note';
  return { bill: 'Bill', purchase_order: 'Purchase order', expense_claim: 'Expense claim' }[kind];
}

export async function documentPdf(i: RenderInput): Promise<Uint8Array> {
  const d = i.doc;
  const tpl = i.template;
  const accent = hex(tpl?.accent, rgb(0.059, 0.463, 0.431));
  const money = (n: number) => formatMoney(n, i.org.currency);
  const gstOnIt = i.gst && d.taxMode !== 'none' && d.taxTotal !== 0;
  const title = documentTitle(d.kind, gstOnIt, tpl);
  const p = await Page.create(`${title} ${d.number}`, tpl?.layout === 'landscape' ? 'landscape' : 'portrait', tpl?.font ?? 'helvetica');
  p.footer = `${i.org.legal_name || i.org.name} | ${title} ${d.number}`;
  p.mark = MARKS[d.status] ?? '';

  // Header: logo or name on the left, title and number on the right.
  let top = p.y;
  if (i.logo && (isPng(i.logo) || isJpeg(i.logo))) {
    const img = isPng(i.logo) ? await p.doc.embedPng(i.logo) : await p.doc.embedJpg(i.logo);
    const scale = Math.min(150 / img.width, 56 / img.height, 1);
    p.page.drawImage(img, { x: M.left, y: top - img.height * scale, width: img.width * scale, height: img.height * scale });
    top -= img.height * scale + 10;
  } else {
    p.text(i.org.name, M.left, top - 16, { size: 16, bold: true, color: NAVY });
    top -= 26;
  }
  p.text(title.toUpperCase(), M.left, p.y - 16, { size: 18, bold: true, color: accent, align: 'right', width: p.width });
  p.text(d.number, M.left, p.y - 32, { size: 11, bold: true, align: 'right', width: p.width });
  if (d.kind === 'credit_note' && gstOnIt) p.text('Adjustment note', M.left, p.y - 45, { size: 8.5, color: SLATE, align: 'right', width: p.width });

  // The seller, then the dates and references.
  let y = top - 4;
  const seller = [
    i.org.legal_name || i.org.name,
    i.org.legal_name && i.org.legal_name !== i.org.name ? `Trading as ${i.org.name}` : '',
    i.org.abn ? `ABN ${formatAbn(i.org.abn)}` : '',
    ...i.org.address.split('\n'),
    i.org.email,
    i.org.phone,
  ].filter(Boolean);
  for (const s of seller) {
    p.text(s, M.left, y, { size: 8.5, color: SLATE });
    y -= 11;
  }
  const dueLabel = d.kind === 'quote' ? 'Valid until' : d.kind === 'purchase_order' ? 'Delivery' : 'Due';
  const meta: [string, string][] = [
    ['Date', fmtDate(d.issueDate)],
    ...(d.dueDate && d.kind !== 'credit_note' ? ([[dueLabel, fmtDate(d.dueDate)]] as [string, string][]) : []),
    ...(d.reference ? ([['Reference', d.reference]] as [string, string][]) : []),
    ...(d.relatedNumber ? ([[d.kind === 'credit_note' ? 'For invoice' : 'Quote', d.relatedNumber]] as [string, string][]) : []),
    ...(d.salesRep ? ([['Contact', d.salesRep]] as [string, string][]) : []),
  ];
  let my = p.y - (d.kind === 'credit_note' && gstOnIt ? 62 : 52);
  for (const [k, v] of meta) {
    p.text(k, p.right - 200, my, { size: 8.5, color: SLATE });
    p.text(v, p.right - 130, my, { size: 9, align: 'right', width: 130 });
    my -= 13;
  }
  y = Math.min(y, my) - 14;

  // The other party, and where goods go.
  const party = d.kind === 'quote' ? 'Prepared for' : d.kind === 'invoice' || d.kind === 'credit_note' ? 'Bill to' : d.kind === 'expense_claim' ? 'Claimed by' : 'Supplier';
  const partyLines = d.kind === 'expense_claim'
    ? [i.claimant ?? '']
    : [i.contact?.name ?? '', i.contact?.abn ? `ABN ${formatAbn(i.contact.abn)}` : '', ...(i.contact?.address ?? '').split('\n'), i.contact?.email ?? ''].filter(Boolean);
  const startY = y;
  p.text(party.toUpperCase(), M.left, y, { size: 7.5, bold: true, color: SLATE });
  y -= 13;
  for (const s of partyLines.length ? partyLines : ['-']) {
    p.text(s, M.left, y, { size: 9.5, bold: s === partyLines[0] });
    y -= 12;
  }
  if (d.deliveryAddress) {
    let dy = startY;
    const dx = M.left + p.width / 2;
    p.text((d.kind === 'purchase_order' ? 'Deliver to' : 'Delivery address').toUpperCase(), dx, dy, { size: 7.5, bold: true, color: SLATE });
    dy -= 13;
    for (const s of d.deliveryAddress.split('\n')) {
      p.text(s, dx, dy, { size: 9.5 });
      dy -= 12;
    }
    y = Math.min(y, dy);
  }
  p.y = y - 14;

  // Lines. Columns that no line uses are left out.
  const hasCode = d.lines.some((l) => l.kind === 'item' && l.itemCode);
  const hasUnit = d.lines.some((l) => l.kind === 'item' && l.unit);
  const hasDisc = d.lines.some((l) => l.kind === 'item' && l.discountBp);
  const showGst = i.gst && d.taxMode !== 'none';
  type Col = { key: string; label: string; w: number; align: 'left' | 'right' };
  const fixed: Col[] = [
    ...(hasCode ? [{ key: 'code', label: 'Code', w: 58, align: 'left' as const }] : []),
    { key: 'desc', label: 'Description', w: 0, align: 'left' },
    { key: 'qty', label: 'Qty', w: 40, align: 'right' },
    ...(hasUnit ? [{ key: 'unit', label: 'Unit', w: 38, align: 'left' as const }] : []),
    { key: 'price', label: 'Unit price', w: 70, align: 'right' },
    ...(hasDisc ? [{ key: 'disc', label: 'Disc.', w: 36, align: 'right' as const }] : []),
    ...(showGst ? [{ key: 'gst', label: 'GST', w: 36, align: 'right' as const }] : []),
    { key: 'amount', label: d.taxMode === 'inclusive' ? 'Amount incl.' : 'Amount', w: 78, align: 'right' },
  ];
  const used = fixed.reduce((n, c) => n + c.w, 0);
  const cols = fixed.map((c) => (c.key === 'desc' ? { ...c, w: p.width - used } : c));
  const xs = cols.map((_, k) => M.left + cols.slice(0, k).reduce((n, c) => n + c.w, 0));
  const header = () => {
    p.page.drawRectangle({ x: M.left, y: p.y - 6, width: p.width, height: 18, color: HEAD_BG });
    cols.forEach((c, k) => p.text(c.label, xs[k] + 3, p.y, { size: 8, bold: true, color: SLATE, align: c.align, width: c.w - 6 }));
    p.y -= 20;
  };
  header();
  const col = (key: string) => cols.findIndex((c) => c.key === key);
  const cell = (key: string, s: string, o: { bold?: boolean; color?: RGB } = {}) => {
    const k = col(key);
    if (k < 0) return;
    p.text(s, xs[k] + 3, p.y, { size: 9, align: cols[k].align, width: cols[k].w - 6, ...o });
  };
  let anyOptional = false;
  for (const l of d.lines) {
    const dk = col('desc');
    if (l.kind === 'heading') {
      const words = p.wrap(l.description || '', p.width - 6, 9.5, true);
      const h = words.length * 12 + 8;
      p.ensure(h + 6, header);
      p.y -= 2;
      words.forEach((s, k) => p.text(s, M.left + 3, p.y - k * 12, { size: 9.5, bold: true, color: NAVY }));
      p.y -= h - 2;
      p.rule(p.y + 8);
      continue;
    }
    const desc = p.wrap(`${l.description || '-'}${l.optional ? ' (optional)' : ''}`, cols[dk].w - 6, 9);
    const h = desc.length * 11.5 + 6;
    p.ensure(h + 6, header);
    const color = l.optional ? SLATE : TEXT;
    desc.forEach((s, k) => p.text(s, xs[dk] + 3, p.y - k * 11.5, { size: 9, color }));
    cell('code', l.itemCode, { color });
    cell('qty', fmtQty(l.quantity), { color });
    cell('unit', l.unit, { color });
    cell('price', money(l.unitPrice), { color });
    cell('disc', l.discountBp ? `${l.discountBp / 100}%` : '', { color });
    cell('gst', l.taxRateBp === null ? '' : `${l.taxRateBp / 100}%`, { color });
    cell('amount', l.optional ? `(${money(l.amount)})` : money(l.amount), { color });
    if (l.optional) anyOptional = true;
    p.y -= h;
    p.rule(p.y + 8);
  }

  // Totals.
  const totals: [string, string, boolean][] = [];
  const gross = d.lines.filter((l) => l.kind === 'item' && !l.optional).reduce((n, l) => n + l.amount, 0);
  if (d.discountBp) {
    totals.push([d.taxMode === 'inclusive' ? 'Subtotal incl. GST' : 'Subtotal', money(gross), false]);
    totals.push([`Discount ${d.discountBp / 100}%`, money(-d.discountTotal), false]);
  }
  if (d.taxMode !== 'inclusive') totals.push([d.discountBp ? 'Net' : 'Subtotal', money(d.subtotal), false]);
  if (showGst) totals.push([d.taxMode === 'inclusive' ? 'Includes GST' : 'GST', money(d.taxTotal), false]);
  totals.push([d.kind === 'credit_note' ? 'Total credit' : 'Total', money(d.total), true]);
  if (d.amountPaid && d.kind !== 'quote') {
    const credited = d.kind === 'invoice' ? (d.credited ?? 0) : 0;
    if (credited) totals.push(['Credited', money(-credited), false]);
    if (d.amountPaid - credited) totals.push([d.kind === 'credit_note' ? 'Used' : 'Paid', money(-(d.amountPaid - credited)), false]);
    totals.push([d.kind === 'credit_note' ? 'Credit remaining' : 'Amount due', money(d.amountDue), true]);
  }
  p.ensure(totals.length * 16 + 24);
  p.y -= 6;
  for (const [k, v, strong] of totals) {
    p.text(k, p.right - 220, p.y, { size: strong ? 10.5 : 9.5, bold: strong });
    p.text(v, p.right - 120, p.y, { size: strong ? 10.5 : 9.5, bold: strong, align: 'right', width: 120 });
    p.y -= 16;
  }
  if (anyOptional) {
    p.text('Optional items are shown in brackets and are not included in the total.', M.left, p.y, { size: 8.5, color: SLATE });
    p.y -= 14;
  }
  if (!i.gst && (d.kind === 'invoice' || d.kind === 'quote')) {
    p.text('No GST has been charged.', M.left, p.y, { size: 8.5, color: SLATE });
    p.y -= 14;
  }

  // Text blocks.
  const terms = d.terms || (d.kind === 'quote' ? (tpl?.quote_terms ?? '') : d.kind === 'invoice' ? (tpl?.invoice_terms ?? '') : '');
  const payment = d.kind === 'invoice' && d.amountDue > 0 ? [tpl?.payment_instructions ?? '', `Please use ${d.number} as the payment reference.`].filter(Boolean).join('\n') : '';
  const blocks: [string, string][] = [
    ['Reason', d.kind === 'credit_note' ? (d.reason ?? '') : ''],
    ['How to pay', payment],
    ['Notes', d.notes],
    [d.kind === 'quote' ? 'Terms and conditions' : 'Terms', terms],
  ];
  for (const [label, text] of blocks) {
    if (!text) continue;
    const lines = p.wrap(text, p.width, 9);
    p.ensure(Math.min(lines.length, 6) * 12 + 26);
    p.y -= 10;
    p.text(label.toUpperCase(), M.left, p.y, { size: 7.5, bold: true, color: SLATE });
    p.y -= 13;
    for (const s of lines) {
      p.ensure(12);
      p.text(s, M.left, p.y, { size: 9 });
      p.y -= 12;
    }
  }

  // A quote's acceptance: who accepted it online, or a place to sign.
  if (d.kind === 'quote' && (d.acceptedName || bool(tpl?.show_signature, true))) {
    p.ensure(80);
    p.y -= 16;
    p.text('ACCEPTANCE', M.left, p.y, { size: 7.5, bold: true, color: SLATE });
    p.y -= 14;
    if (d.acceptedName) {
      p.text(`Accepted${d.acceptedOnline ? ' online' : ''} by ${d.acceptedName}${d.acceptedAt ? ` on ${new Date(d.acceptedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}.`, M.left, p.y, { size: 9 });
      p.y -= 14;
    } else {
      p.text('To accept this quote, sign below or use the online link if one was sent to you.', M.left, p.y, { size: 9 });
      p.y -= 30;
      const third = p.width / 3;
      for (const [k, label] of ['Name', 'Signature', 'Date'].entries()) {
        const x = M.left + k * third;
        p.rule(p.y, NAVY, x, x + third - 18);
        p.text(label, x, p.y - 11, { size: 8, color: SLATE });
      }
      p.y -= 24;
    }
  }

  if (tpl?.footer) {
    const lines = p.wrap(tpl.footer, p.width, 8);
    p.ensure(lines.length * 11 + 16);
    p.y -= 12;
    for (const s of lines) {
      p.text(s, M.left, p.y, { size: 8, color: SLATE });
      p.y -= 11;
    }
  }

  // An invoice's remittance slip, to return with a payment.
  if (d.kind === 'invoice' && d.amountDue > 0 && bool(tpl?.show_remittance, true)) {
    p.ensure(96);
    p.y -= 18;
    p.page.drawLine({ start: { x: M.left, y: p.y }, end: { x: p.right, y: p.y }, thickness: 0.7, color: SLATE, dashArray: [4, 3] });
    p.y -= 16;
    p.text('REMITTANCE ADVICE', M.left, p.y, { size: 7.5, bold: true, color: SLATE });
    p.y -= 14;
    const rows: [string, string][] = [
      ['To', i.org.legal_name || i.org.name],
      ['From', i.contact?.name ?? ''],
      ['Invoice', d.number],
      ['Due', d.dueDate ? fmtDate(d.dueDate) : ''],
      ['Amount due', money(d.amountDue)],
      ['Amount paid', ''],
    ];
    for (const [k, v] of rows) {
      p.text(k, M.left, p.y, { size: 8.5, color: SLATE });
      if (v) p.text(v, M.left + 90, p.y, { size: 9, bold: k === 'Amount due' });
      else p.rule(p.y - 2, NAVY, M.left + 90, M.left + 250);
      p.y -= 13;
    }
  }
  return p.finish();
}
