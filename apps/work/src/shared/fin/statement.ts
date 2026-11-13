// Bank statement files for BIZOMAT Finance: CSV (with column mapping), OFX and QIF, read into one shape. Nothing here
// talks to a bank: statements are files a person downloads from their own internet banking and uploads.

import { parseCsv } from '../crm/csv';
import { isIsoDate } from './dates';

export interface StatementRow {
  date: string;
  /** Signed cents: money in positive, money out negative. */
  amount: number;
  description: string;
  payee: string;
  reference: string;
  /** The bank's own id for the line (OFX FITID), when it gives one. */
  fitid?: string;
}

export interface ParsedStatement {
  rows: StatementRow[];
  errors: { line: number; message: string }[];
}

export type DateFormat = 'dmy' | 'mdy' | 'ymd';

/** A date as written in a statement ("13/11/2026", "13-11-26", "2026-11-13", "20261113", "13 Nov 2026"). */
export function parseStatementDate(raw: string, format: DateFormat = 'dmy'): string | null {
  const s = raw.trim().replace(/'/g, '/');
  let y: number, m: number, d: number;
  let match = /^(\d{4})(\d{2})(\d{2})/.exec(s);
  if (match) [y, m, d] = [+match[1], +match[2], +match[3]];
  else if ((match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(s))) [y, m, d] = [+match[1], +match[2], +match[3]];
  else if ((match = /^(\d{1,2})[-/. ]([A-Za-z]{3,})[-/. ,]+(\d{2,4})/.exec(s))) {
    const mi = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(match[2].slice(0, 3).toLowerCase());
    if (mi < 0) return null;
    [d, m, y] = [+match[1], mi + 1, +match[3]];
  } else if ((match = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/.exec(s))) {
    const a = +match[1];
    const b = +match[2];
    y = +match[3];
    if (format === 'mdy') [m, d] = [a, b];
    else [d, m] = [a, b];
  } else return null;
  if (y < 100) y += y < 70 ? 2000 : 1900;
  const iso = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return isIsoDate(iso) ? iso : null;
}

/** An amount as written in a statement ("$1,234.56", "(12.00)", "-12", "12.00 DR"), in cents; null if unreadable. */
export function parseStatementAmount(raw: string): number | null {
  let s = raw.trim();
  if (!s) return null;
  let neg = false;
  if (/^\(.*\)$/.test(s)) {
    neg = true;
    s = s.slice(1, -1);
  }
  if (/\s*DR$/i.test(s)) {
    neg = true;
    s = s.replace(/\s*DR$/i, '');
  } else s = s.replace(/\s*CR$/i, '');
  s = s.replace(/[$€£A-Z\s,]/gi, '');
  if (s.startsWith('-')) {
    neg = !neg;
    s = s.slice(1);
  } else if (s.startsWith('+')) s = s.slice(1);
  if (!/^\d+(\.\d{1,4})?$/.test(s)) return null;
  const [int, frac = ''] = s.split('.');
  const cents = Number(int) * 100 + Number((frac + '00').slice(0, 2)) + (Number(frac[2] ?? 0) >= 5 ? 1 : 0);
  if (!Number.isSafeInteger(cents) || cents > 1e13) return null;
  return neg ? -cents : cents;
}

export interface CsvMapping {
  date: number;
  /** One signed amount column, or separate money-out (debit) and money-in (credit) columns. */
  amount?: number;
  debit?: number;
  credit?: number;
  description?: number;
  payee?: number;
  reference?: number;
  dateFormat?: DateFormat;
  hasHeader?: boolean;
  /** The bank writes money out as positive and money in as negative. */
  invert?: boolean;
}

export function readCsv(text: string): string[][] {
  return parseCsv(text).filter((r) => r.some((c) => c.trim() !== ''));
}

/** Guess a mapping from the header row (Date, Amount / Debit / Credit, Description, Payee, Reference). */
export function guessMapping(header: string[]): CsvMapping {
  const find = (re: RegExp) => {
    const i = header.findIndex((h) => re.test(h.trim()));
    return i >= 0 ? i : undefined;
  };
  const amount = find(/^(amount|value|transaction amount)$/i);
  const debit = find(/^(debit|withdrawals?|money out|paid out)$/i);
  const credit = find(/^(credit|deposits?|money in|paid in)$/i);
  return {
    date: find(/date/i) ?? 0,
    amount: amount ?? (debit === undefined && credit === undefined ? 1 : undefined),
    debit: amount === undefined ? debit : undefined,
    credit: amount === undefined ? credit : undefined,
    description: find(/^(description|details|narrative|memo|transaction details)$/i) ?? find(/desc|detail|narr/i),
    payee: find(/^(payee|merchant|name)$/i),
    reference: find(/^(reference|ref|cheque|check number)$/i),
    dateFormat: 'dmy',
    hasHeader: true,
  };
}

export function parseCsvStatement(text: string, map: CsvMapping): ParsedStatement {
  const rows = readCsv(text);
  const out: ParsedStatement = { rows: [], errors: [] };
  const body = map.hasHeader === false ? rows : rows.slice(1);
  const offset = map.hasHeader === false ? 1 : 2;
  body.forEach((r, i) => {
    const line = i + offset;
    const cell = (c: number | undefined) => (c === undefined ? '' : (r[c] ?? '').trim());
    const date = parseStatementDate(cell(map.date), map.dateFormat ?? 'dmy');
    if (!date) return out.errors.push({ line, message: `Unreadable date "${cell(map.date).slice(0, 30)}"` });
    let amount: number | null;
    if (map.amount !== undefined) amount = parseStatementAmount(cell(map.amount));
    else {
      const out_ = cell(map.debit) ? parseStatementAmount(cell(map.debit)) : 0;
      const in_ = cell(map.credit) ? parseStatementAmount(cell(map.credit)) : 0;
      amount = out_ === null || in_ === null ? null : Math.abs(in_) - Math.abs(out_);
    }
    if (amount === null) return out.errors.push({ line, message: 'Unreadable amount' });
    if (amount === 0) return;
    if (map.invert) amount = -amount;
    out.rows.push({ date, amount, description: cell(map.description).slice(0, 300), payee: cell(map.payee).slice(0, 200), reference: cell(map.reference).slice(0, 100) });
  });
  return out;
}

/** OFX 1.x (SGML, unclosed tags) and 2.x (XML): every <STMTTRN>. */
export function parseOfx(text: string): ParsedStatement {
  const out: ParsedStatement = { rows: [], errors: [] };
  const blocks = text.split(/<STMTTRN>/i).slice(1);
  if (!blocks.length) out.errors.push({ line: 0, message: 'No transactions found in the OFX file' });
  blocks.forEach((b, i) => {
    const block = b.split(/<\/STMTTRN>/i)[0];
    const tag = (name: string) => {
      const m = new RegExp(`<${name}>([^<\\r\\n]*)`, 'i').exec(block);
      return m ? m[1].trim() : '';
    };
    const date = parseStatementDate(tag('DTPOSTED').slice(0, 8), 'ymd');
    const amount = parseStatementAmount(tag('TRNAMT'));
    if (!date || amount === null) return out.errors.push({ line: i + 1, message: `Transaction ${i + 1}: unreadable date or amount` });
    if (amount === 0) return;
    const name = decodeEntities(tag('NAME'));
    const memo = decodeEntities(tag('MEMO'));
    out.rows.push({ date, amount, payee: name.slice(0, 200), description: (memo || name).slice(0, 300), reference: (tag('CHECKNUM') || tag('REFNUM')).slice(0, 100), fitid: tag('FITID').slice(0, 120) || undefined });
  });
  return out;
}

/** QIF bank records: D date, T or U amount, P payee, M memo, N number, ^ end of record. */
export function parseQif(text: string, dateFormat: DateFormat = 'dmy'): ParsedStatement {
  const out: ParsedStatement = { rows: [], errors: [] };
  let cur: Record<string, string> = {};
  let n = 0;
  const flush = () => {
    if (!Object.keys(cur).length) return;
    n++;
    const date = parseStatementDate(cur.D ?? '', dateFormat);
    const amount = parseStatementAmount(cur.T ?? cur.U ?? '');
    if (!date || amount === null) out.errors.push({ line: n, message: `Record ${n}: unreadable date or amount` });
    else if (amount !== 0) out.rows.push({ date, amount, payee: (cur.P ?? '').slice(0, 200), description: (cur.M || cur.P || '').slice(0, 300), reference: (cur.N ?? '').slice(0, 100) });
    cur = {};
  };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (!line || line.startsWith('!')) continue;
    if (line.startsWith('^')) flush();
    else cur[line[0]] = line.slice(1).trim();
  }
  flush();
  return out;
}

function decodeEntities(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

/**
 * The key that recognises a line imported before: the bank's id when it gives one, otherwise the date, amount and
 * text plus the line's position among identical lines of the same file (two equal coffees on one day are two lines;
 * importing the same file again matches both).
 */
export function dedupeKeys(rows: StatementRow[]): string[] {
  const seen = new Map<string, number>();
  return rows.map((r) => {
    if (r.fitid) return `id:${r.fitid}`;
    const base = `${r.date}|${r.amount}|${r.description.toLowerCase().replace(/\s+/g, ' ').trim()}|${r.reference}`;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return `${base}|${n}`;
  });
}
