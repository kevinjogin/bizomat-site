// PDFs for BIZOMAT Finance: an invoice (or bill, purchase order, expense claim) and any report table. pdf-lib with the
// standard Helvetica fonts (no external files); text the fonts cannot draw is replaced (pdfSafe).

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import { pdfSafe } from '../services/reports/pdf';
import { formatMoney } from '../../shared/crm/money';
import { DOC_LABELS } from '../../shared/fin/settings';

const A4: [number, number] = [595.28, 841.89];
const M = { left: 46, right: 46, top: 50, bottom: 56 };
const NAVY = rgb(0.039, 0.122, 0.2);
const SLATE = rgb(0.392, 0.455, 0.545);
const TEXT = rgb(0.118, 0.161, 0.231);
const LINE = rgb(0.886, 0.91, 0.941);
const HEAD_BG = rgb(0.945, 0.961, 0.976);

function hex(color: string | null | undefined, fallback: RGB): RGB {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color ?? '');
  return m ? rgb(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255) : fallback;
}

class Pdf {
  doc!: PDFDocument;
  font!: PDFFont;
  bold!: PDFFont;
  page!: PDFPage;
  y = 0;
  readonly width = A4[0] - M.left - M.right;
  footer = '';

  static async create(title: string) {
    const p = new Pdf();
    p.doc = await PDFDocument.create();
    p.doc.setTitle(pdfSafe(title));
    p.doc.setProducer('BIZOMAT Finance');
    p.doc.setCreator('BIZOMAT Finance');
    p.font = await p.doc.embedFont(StandardFonts.Helvetica);
    p.bold = await p.doc.embedFont(StandardFonts.HelveticaBold);
    p.newPage();
    return p;
  }

  newPage() {
    this.page = this.doc.addPage(A4);
    this.y = A4[1] - M.top;
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

  rule(y: number, color = LINE) {
    this.page.drawLine({ start: { x: M.left, y }, end: { x: A4[0] - M.right, y }, thickness: 0.7, color });
  }

  finish() {
    const pages = this.doc.getPages();
    pages.forEach((pg, i) => {
      const t = pdfSafe(`${this.footer}${this.footer ? '   ' : ''}Page ${i + 1} of ${pages.length}`);
      pg.drawText(t, { x: A4[0] - M.right - this.font.widthOfTextAtSize(t, 7.5), y: 28, size: 7.5, font: this.font, color: SLATE });
    });
    return this.doc.save();
  }
}

const isPng = (b: Uint8Array) => b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
const isJpeg = (b: Uint8Array) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8;

export interface InvoicePdfInput {
  org: { name: string; legal_name: string; abn: string; address: string; email: string; phone: string; currency: string };
  gst: boolean;
  doc: any;
  contact: any | null;
  template: any | null;
  taxCodes: { id: string; code: string; name: string; rate_bp: number }[];
  logo: Uint8Array | null;
  logoType?: string | null;
}

export async function invoicePdf(i: InvoicePdfInput): Promise<Uint8Array> {
  const d = i.doc;
  const accent = hex(i.template?.accent, rgb(0.059, 0.463, 0.431));
  const money = (n: number) => formatMoney(n, i.org.currency);
  const hasGst = i.gst && d.taxTotal !== 0;
  const title = d.kind === 'invoice' ? i.template?.title || (hasGst ? 'Tax invoice' : 'Invoice') : DOC_LABELS[d.kind as keyof typeof DOC_LABELS].one;
  const p = await Pdf.create(`${title} ${d.number}`);
  p.footer = `${i.org.legal_name || i.org.name} | ${title} ${d.number}`;

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

  // Seller, then the customer or supplier.
  let y = top - 4;
  const seller = [i.org.legal_name || i.org.name, i.org.abn ? `ABN ${formatAbn(i.org.abn)}` : '', ...i.org.address.split('\n'), i.org.email, i.org.phone].filter(Boolean);
  for (const s of seller) {
    p.text(s, M.left, y, { size: 8.5, color: SLATE });
    y -= 11;
  }
  const meta: [string, string][] = [
    ['Date', fmtDate(d.issueDate)],
    ...(d.dueDate ? ([[d.kind === 'purchase_order' ? 'Delivery' : 'Due', fmtDate(d.dueDate)]] as [string, string][]) : []),
    ...(d.reference ? ([['Reference', d.reference]] as [string, string][]) : []),
  ];
  let my = p.y - 52;
  for (const [k, v] of meta) {
    p.text(k, A4[0] - M.right - 190, my, { size: 8.5, color: SLATE });
    p.text(v, A4[0] - M.right - 120, my, { size: 9, align: 'right', width: 120 });
    my -= 13;
  }
  y = Math.min(y, my) - 14;
  const party = d.kind === 'invoice' ? 'Bill to' : d.kind === 'expense_claim' ? 'Claimed by' : 'Supplier';
  p.text(party.toUpperCase(), M.left, y, { size: 7.5, bold: true, color: SLATE });
  y -= 13;
  const partyLines = d.kind === 'expense_claim' ? [d.claimantName ?? ''] : [i.contact?.name ?? d.contactName ?? '', i.contact?.abn ? `ABN ${formatAbn(i.contact.abn)}` : '', ...(i.contact?.address ?? '').split('\n'), i.contact?.email ?? ''].filter(Boolean);
  for (const s of partyLines) {
    p.text(s, M.left, y, { size: 9.5, bold: s === partyLines[0] });
    y -= 12;
  }
  p.y = y - 14;

  // Lines.
  const cols = [
    { label: 'Description', x: M.left, w: 230, align: 'left' as const },
    { label: 'Qty', x: M.left + 232, w: 44, align: 'right' as const },
    { label: 'Unit price', x: M.left + 278, w: 70, align: 'right' as const },
    { label: 'Disc.', x: M.left + 350, w: 34, align: 'right' as const },
    { label: i.gst ? 'GST' : '', x: M.left + 386, w: 46, align: 'right' as const },
    { label: d.taxMode === 'inclusive' ? 'Amount incl.' : 'Amount', x: M.left + 434, w: p.width - 434, align: 'right' as const },
  ];
  const header = () => {
    p.page.drawRectangle({ x: M.left, y: p.y - 6, width: p.width, height: 18, color: HEAD_BG });
    for (const c of cols) p.text(c.label, c.x + 3, p.y, { size: 8, bold: true, color: SLATE, align: c.align, width: c.w - 6 });
    p.y -= 20;
  };
  header();
  const codeOf = (id: string | null) => i.taxCodes.find((t) => t.id === id);
  for (const l of d.lines) {
    const desc = p.wrap(l.description || '-', cols[0].w - 6, 9);
    const h = desc.length * 11.5 + 6;
    p.ensure(h + 6, header);
    desc.forEach((s, k) => p.text(s, cols[0].x + 3, p.y - k * 11.5, { size: 9 }));
    p.text(fmtQty(l.quantity), cols[1].x + 3, p.y, { size: 9, align: 'right', width: cols[1].w - 6 });
    p.text(money(l.unitPrice), cols[2].x + 3, p.y, { size: 9, align: 'right', width: cols[2].w - 6 });
    p.text(l.discountBp ? `${l.discountBp / 100}%` : '', cols[3].x + 3, p.y, { size: 9, align: 'right', width: cols[3].w - 6 });
    if (i.gst) p.text(codeOf(l.taxCodeId)?.rate_bp ? `${codeOf(l.taxCodeId)!.rate_bp / 100}%` : l.taxCodeId ? '0%' : '', cols[4].x + 3, p.y, { size: 9, align: 'right', width: cols[4].w - 6 });
    p.text(money(d.taxMode === 'inclusive' ? l.net + l.tax : l.net), cols[5].x + 3, p.y, { size: 9, align: 'right', width: cols[5].w - 6 });
    p.y -= h;
    p.rule(p.y + 8);
  }

  // Totals.
  const totals: [string, string, boolean][] = [];
  if (d.taxMode !== 'inclusive') totals.push(['Subtotal', money(d.subtotal), false]);
  if (i.gst && d.taxMode !== 'none') totals.push([d.taxMode === 'inclusive' ? 'Includes GST' : 'GST', money(d.taxTotal), false]);
  totals.push(['Total', money(d.total), true]);
  if (d.amountPaid) totals.push(['Paid', money(-d.amountPaid), false], ['Amount due', money(d.amountDue), true]);
  p.ensure(totals.length * 16 + 20);
  p.y -= 6;
  for (const [k, v, strong] of totals) {
    p.text(k, A4[0] - M.right - 200, p.y, { size: strong ? 10.5 : 9.5, bold: strong });
    p.text(v, A4[0] - M.right - 110, p.y, { size: strong ? 10.5 : 9.5, bold: strong, align: 'right', width: 110 });
    p.y -= 16;
  }
  if (hasGst && d.taxMode === 'inclusive') {
    p.text(`Total price includes GST of ${money(d.taxTotal)}.`, M.left, p.y, { size: 8.5, color: SLATE });
    p.y -= 14;
  }

  const blocks: [string, string][] = [
    ['Payment instructions', d.kind === 'invoice' ? (i.template?.payment_instructions ?? '') : ''],
    ['Notes', d.notes],
    ['Terms', d.terms],
  ];
  for (const [label, body] of blocks) {
    if (!body) continue;
    const lines = p.wrap(body, p.width, 9);
    p.ensure(lines.length * 12 + 26);
    p.y -= 10;
    p.text(label.toUpperCase(), M.left, p.y, { size: 7.5, bold: true, color: SLATE });
    p.y -= 13;
    for (const s of lines) {
      p.text(s, M.left, p.y, { size: 9 });
      p.y -= 12;
    }
  }
  if (i.template?.footer) {
    const lines = p.wrap(i.template.footer, p.width, 8);
    p.ensure(lines.length * 11 + 16);
    p.y -= 12;
    for (const s of lines) {
      p.text(s, M.left, p.y, { size: 8, color: SLATE });
      p.y -= 11;
    }
  }
  return p.finish();
}

// ------------------------------------------------------------------ reports

export interface ReportTable {
  title: string;
  subtitle?: string;
  columns: { label: string; align?: 'left' | 'right'; width?: number }[];
  rows: { cells: (string | number | null)[]; style?: 'heading' | 'total' | 'subtotal' | 'normal'; indent?: number }[];
  notes?: string[];
}

/** A report table on A4 (landscape when it has more than six columns). Numbers are cents, formatted as money. */
export async function reportPdf(r: ReportTable, org: { name: string; currency: string }): Promise<Uint8Array> {
  const p = await Pdf.create(`${r.title} - ${org.name}`);
  const landscape = r.columns.length > 6;
  if (landscape) {
    p.doc.removePage(0);
    p.page = p.doc.addPage([A4[1], A4[0]]);
    p.y = A4[0] - M.top;
    (p as any).width = A4[1] - M.left - M.right;
    p.newPage = function () {
      this.page = this.doc.addPage([A4[1], A4[0]]);
      this.y = A4[0] - M.top;
    };
  }
  const width = landscape ? A4[1] - M.left - M.right : p.width;
  p.footer = `${org.name} | ${r.title}`;
  p.text(org.name, M.left, p.y, { size: 9, color: SLATE });
  p.y -= 20;
  p.text(r.title, M.left, p.y, { size: 17, bold: true, color: NAVY });
  p.y -= 16;
  if (r.subtitle) {
    p.text(r.subtitle, M.left, p.y, { size: 9.5, color: SLATE });
    p.y -= 14;
  }
  p.y -= 8;
  const first = Math.max(width - (r.columns.length - 1) * 82, 150);
  const widths = r.columns.map((c, i) => c.width ?? (i === 0 ? first : (width - first) / Math.max(r.columns.length - 1, 1)));
  const xs = widths.map((_, i) => M.left + widths.slice(0, i).reduce((a, b) => a + b, 0));
  const header = () => {
    p.page.drawRectangle({ x: M.left, y: p.y - 6, width, height: 18, color: HEAD_BG });
    r.columns.forEach((c, i) => p.text(c.label, xs[i] + 3, p.y, { size: 8, bold: true, color: SLATE, align: c.align ?? (i === 0 ? 'left' : 'right'), width: widths[i] - 6 }));
    p.y -= 20;
  };
  header();
  const fmt = (v: string | number | null) => (v === null || v === undefined ? '' : typeof v === 'number' ? formatMoney(v, org.currency) : v);
  for (const row of r.rows) {
    p.ensure(16, header);
    const strong = row.style === 'heading' || row.style === 'total' || row.style === 'subtotal';
    if (row.style === 'total') p.page.drawLine({ start: { x: M.left, y: p.y + 11 }, end: { x: M.left + width, y: p.y + 11 }, thickness: 0.8, color: NAVY });
    row.cells.forEach((v, i) => {
      const s = fmt(v);
      const align = r.columns[i]?.align ?? (i === 0 ? 'left' : 'right');
      const indent = i === 0 ? (row.indent ?? 0) * 10 : 0;
      p.text(i === 0 ? clip(p, s, widths[i] - 6 - indent) : s, xs[i] + 3 + indent, p.y, { size: 8.8, bold: strong, color: row.style === 'heading' ? NAVY : TEXT, align, width: widths[i] - 6 - indent });
    });
    p.y -= row.style === 'heading' ? 16 : 14;
  }
  if (r.notes?.length) {
    p.y -= 8;
    for (const n of r.notes) {
      for (const s of p.wrap(n, width, 8)) {
        p.ensure(12);
        p.text(s, M.left, p.y, { size: 8, color: SLATE });
        p.y -= 11;
      }
    }
  }
  return p.finish();
}

function clip(p: Pdf, s: string, width: number): string {
  let t = pdfSafe(s);
  while (t.length > 3 && p.font.widthOfTextAtSize(t, 8.8) > width) t = `${t.slice(0, -2)}…`.replace(/……$/, '…');
  return t;
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function fmtQty(q: number): string {
  return Number.isInteger(q) ? String(q) : q.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

export function formatAbn(abn: string): string {
  const d = abn.replace(/\D/g, '');
  return d.length === 11 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : abn;
}
