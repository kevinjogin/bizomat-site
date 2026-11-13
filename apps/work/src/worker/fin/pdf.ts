// Report PDFs for BIZOMAT Finance: any report table. pdf-lib with the standard Helvetica fonts (no external files); text
// the fonts cannot draw is replaced (pdfSafe). Documents (quotes, invoices, credit notes and the rest) are drawn by
// document.ts.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import { pdfSafe } from '../services/reports/pdf';
import { formatMoney } from '../../shared/crm/money';

const A4: [number, number] = [595.28, 841.89];
const M = { left: 46, right: 46, top: 50, bottom: 56 };
const NAVY = rgb(0.039, 0.122, 0.2);
const SLATE = rgb(0.392, 0.455, 0.545);
const TEXT = rgb(0.118, 0.161, 0.231);
const LINE = rgb(0.886, 0.91, 0.941);
const HEAD_BG = rgb(0.945, 0.961, 0.976);

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
