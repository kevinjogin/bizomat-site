// Asset register import from a CSV file: parse, validate each row, find duplicates (the same asset number, or the same
// manufacturer and serial number, already in the company or earlier in the file) and place each asset under its parent
// by number. The preview (dry run) and the import use the same plan, so what the preview says is what is imported.

import { ASSET_NUMBER_RE, ASSET_STATUS, CRITICALITY, STRATEGY, validDate } from './util';

export const MAX_IMPORT_ROWS = 2000;
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

/** RFC 4180 CSV: commas, double-quoted fields with "" for a quote, CRLF or LF line ends. Blank lines are skipped. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let i = 0;
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const pushRow = () => {
    row.push(field);
    field = '';
    if (row.length > 1 || row[0].trim() !== '') rows.push(row);
    row = [];
  };
  while (i < s.length) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"' && field.trim() === '') {
      field = '';
      quoted = true;
      i++;
    } else if (ch === ',') {
      row.push(field);
      field = '';
      i++;
    } else if (ch === '\r' || ch === '\n') {
      pushRow();
      i += ch === '\r' && s[i + 1] === '\n' ? 2 : 1;
    } else {
      field += ch;
      i++;
    }
  }
  if (field !== '' || row.length) pushRow();
  return rows;
}

/** Column names people use, by field. Matched without case, spaces or punctuation. */
const COLUMNS: Record<string, string[]> = {
  number: ['number', 'assetnumber', 'assetno', 'assetnum', 'asset', 'assetid', 'assetcode', 'code'],
  name: ['name', 'assetname', 'title'],
  description: ['description', 'details'],
  category: ['category', 'assetcategory', 'class'],
  type: ['type', 'assettype'],
  manufacturer: ['manufacturer', 'make', 'brand', 'maker'],
  model: ['model', 'modelnumber', 'modelno'],
  serialNumber: ['serialnumber', 'serial', 'serialno', 'sn'],
  registrationNumber: ['registrationnumber', 'registration', 'rego', 'regono', 'regonumber', 'registrationno'],
  purchaseDate: ['purchasedate', 'purchased', 'dateofpurchase'],
  commissioningDate: ['commissioningdate', 'commissioned', 'commissiondate', 'datecommissioned'],
  warrantyUntil: ['warrantyuntil', 'warrantyexpiry', 'warrantyend', 'warranty', 'warrantyexpires'],
  supplier: ['supplier', 'vendor'],
  purchaseCost: ['purchasecost', 'cost', 'purchaseprice', 'price'],
  replacementCost: ['replacementcost', 'replacementvalue'],
  location: ['location', 'site', 'area'],
  department: ['department', 'dept'],
  criticality: ['criticality', 'critical'],
  status: ['status', 'operatingstatus', 'assetstatus'],
  strategy: ['strategy', 'maintenancestrategy'],
  parentNumber: ['parent', 'parentnumber', 'parentasset', 'parentassetnumber', 'parentno'],
};
const LIMITS: Record<string, number> = { number: 40, name: 200, description: 5000, category: 80, type: 80, manufacturer: 120, model: 120, serialNumber: 120, registrationNumber: 120, supplier: 200, location: 200, department: 120, parentNumber: 40 };

const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');
const code = (v: string) => v.trim().toLowerCase().replace(/[\s-]+/g, '_');

/** "14/11/2026" (Australian day first) or "2026-11-14" to YYYY-MM-DD; null when it is not a real date. */
export function csvDate(v: string): string | null {
  const t = v.trim();
  if (validDate(t)) return t;
  const m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(t);
  if (!m) return null;
  const iso = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return validDate(iso) ? iso : null;
}

/** "$1,234.50" to 123450 cents; null when it is not an amount of zero or more. */
export function csvCents(v: string): number | null {
  const t = v.trim().replace(/^\$|^AUD\s*/i, '').replace(/,/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  const cents = Math.round(Number(t) * 100);
  return Number.isSafeInteger(cents) && cents <= 1e13 ? cents : null;
}

export interface ImportValues {
  number: string;
  name: string;
  description: string;
  category: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  registrationNumber: string;
  purchaseDate: string | null;
  commissioningDate: string | null;
  warrantyUntil: string | null;
  supplier: string;
  purchaseCostCents: number | null;
  replacementCostCents: number | null;
  location: string;
  department: string;
  criticality: string;
  status: string;
  strategy: string;
  specs: { key: string; value: string }[];
  parentNumber: string;
}

export interface PlanRow {
  line: number;
  status: 'ok' | 'duplicate' | 'error';
  number: string;
  name: string;
  parentNumber: string;
  messages: string[];
  values?: ImportValues;
  /** The parent: an asset already in the company, or the line of a row in this file. */
  parentId?: string | null;
  parentLine?: number | null;
}

export interface ImportPlan {
  columns: { header: string; field: string | null }[];
  rows: PlanRow[];
  summary: { total: number; ok: number; duplicates: number; errors: number };
}

export interface ExistingAsset {
  id: string;
  number: string;
  manufacturer: string;
  serial_number: string;
}

const serialKey = (manufacturer: string, serial: string) => (serial.trim() ? `${manufacturer.trim().toLowerCase()}\u0001${serial.trim().toLowerCase()}` : null);

/** The plan for a CSV file against the assets already in the company. */
export function planImport(text: string, existing: ExistingAsset[]): ImportPlan {
  const table = parseCsv(text);
  if (!table.length) return { columns: [], rows: [], summary: { total: 0, ok: 0, duplicates: 0, errors: 0 } };
  const header = table[0];
  const columns = header.map((h) => {
    const n = norm(h);
    if (/^spec(ification)?s?:/i.test(h.trim()) && h.split(':')[1]?.trim()) return { header: h, field: `spec:${h.split(':').slice(1).join(':').trim().slice(0, 80)}` };
    const field = Object.keys(COLUMNS).find((f) => COLUMNS[f].includes(n)) ?? null;
    return { header: h, field };
  });
  // A field named twice: only the first column counts.
  const seenFields = new Set<string>();
  for (const c of columns) {
    if (!c.field) continue;
    if (seenFields.has(c.field)) c.field = null;
    else seenFields.add(c.field);
  }
  const body = table.slice(1, MAX_IMPORT_ROWS + 1);
  const byNumber = new Map(existing.map((a) => [a.number.toLowerCase(), a]));
  const bySerial = new Map<string, ExistingAsset>();
  for (const a of existing) {
    const k = serialKey(a.manufacturer, a.serial_number);
    if (k && !bySerial.has(k)) bySerial.set(k, a);
  }
  const fileNumbers = new Map<string, number>(); // number -> index in rows
  const fileSerials = new Map<string, number>();
  const rows: PlanRow[] = [];

  body.forEach((cells, idx) => {
    const line = idx + 2;
    const get = (field: string) => {
      const i = columns.findIndex((c) => c.field === field);
      return i >= 0 ? (cells[i] ?? '').trim() : '';
    };
    const messages: string[] = [];
    const text = (field: string) => {
      const v = get(field);
      if (v.length > (LIMITS[field] ?? 200)) messages.push(`${field} is longer than ${LIMITS[field]} characters`);
      return v.slice(0, LIMITS[field] ?? 200);
    };
    const date = (field: string, label: string) => {
      const v = get(field);
      if (!v) return null;
      const d = csvDate(v);
      if (!d) messages.push(`${label} "${v}" is not a date (use 2026-11-14 or 14/11/2026)`);
      return d;
    };
    const cents = (field: string, label: string) => {
      const v = get(field);
      if (!v) return null;
      const c = csvCents(v);
      if (c === null) messages.push(`${label} "${v}" is not an amount`);
      return c;
    };
    const choice = (field: string, label: string, allowed: readonly string[], fallback: string) => {
      const v = get(field);
      if (!v) return fallback;
      const c = code(v);
      if (!allowed.includes(c)) {
        messages.push(`${label} "${v}" is not one of: ${allowed.map((x) => x.replace(/_/g, ' ')).join(', ')}`);
        return fallback;
      }
      return c;
    };
    const values: ImportValues = {
      number: text('number'),
      name: text('name'),
      description: text('description'),
      category: text('category'),
      type: text('type'),
      manufacturer: text('manufacturer'),
      model: text('model'),
      serialNumber: text('serialNumber'),
      registrationNumber: text('registrationNumber'),
      purchaseDate: date('purchaseDate', 'Purchase date'),
      commissioningDate: date('commissioningDate', 'Commissioning date'),
      warrantyUntil: date('warrantyUntil', 'Warranty until'),
      supplier: text('supplier'),
      purchaseCostCents: cents('purchaseCost', 'Purchase cost'),
      replacementCostCents: cents('replacementCost', 'Replacement cost'),
      location: text('location'),
      department: text('department'),
      criticality: choice('criticality', 'Criticality', CRITICALITY, 'medium'),
      status: choice('status', 'Status', ASSET_STATUS, 'operating'),
      strategy: choice('strategy', 'Maintenance strategy', STRATEGY, 'run_to_failure'),
      specs: columns
        .map((c, i) => (c.field?.startsWith('spec:') && (cells[i] ?? '').trim() ? { key: c.field.slice(5), value: (cells[i] ?? '').trim().slice(0, 500) } : null))
        .filter((x): x is { key: string; value: string } => !!x)
        .slice(0, 60),
      parentNumber: text('parentNumber'),
    };
    if (!values.name) messages.push('Name is missing');
    if (values.number && !ASSET_NUMBER_RE.test(values.number)) messages.push(`Asset number "${values.number}" may use only letters, digits and . _ / -`);
    if (values.parentNumber && values.number && values.parentNumber.toLowerCase() === values.number.toLowerCase()) messages.push('An asset cannot be its own parent');
    let status: PlanRow['status'] = messages.length ? 'error' : 'ok';
    // Duplicates: the same number, or the same manufacturer and serial number, in the company or earlier in this file.
    const dupes: string[] = [];
    if (values.number) {
      const n = values.number.toLowerCase();
      if (byNumber.has(n)) dupes.push(`Asset number ${byNumber.get(n)!.number} is already in the register`);
      else if (fileNumbers.has(n)) dupes.push(`Asset number ${values.number} is also on line ${rows[fileNumbers.get(n)!].line}`);
    }
    const sk = serialKey(values.manufacturer, values.serialNumber);
    if (sk) {
      if (bySerial.has(sk)) dupes.push(`Serial number ${values.serialNumber}${values.manufacturer ? ` (${values.manufacturer})` : ''} is already in the register as ${bySerial.get(sk)!.number}`);
      else if (fileSerials.has(sk)) dupes.push(`Serial number ${values.serialNumber} is also on line ${rows[fileSerials.get(sk)!].line}`);
    }
    if (dupes.length && status === 'ok') status = 'duplicate';
    messages.push(...dupes);
    const index = rows.length;
    if (values.number && !fileNumbers.has(values.number.toLowerCase())) fileNumbers.set(values.number.toLowerCase(), index);
    if (sk && !fileSerials.has(sk)) fileSerials.set(sk, index);
    rows.push({ line, status, number: values.number, name: values.name, parentNumber: values.parentNumber, messages, values });
  });

  // Parents: an asset already in the company, else a row of this file that will be imported.
  for (const r of rows) {
    if (r.status !== 'ok' || !r.parentNumber) continue;
    const p = r.parentNumber.toLowerCase();
    const inFile = fileNumbers.get(p);
    if (inFile !== undefined && rows[inFile] !== r) {
      const pr = rows[inFile];
      if (pr.status === 'ok') {
        r.parentLine = pr.line;
        continue;
      }
      // The parent row repeats an asset already in the register: use that asset.
      if (byNumber.has(p)) {
        r.parentId = byNumber.get(p)!.id;
        continue;
      }
      r.status = 'error';
      r.messages.push(`Its parent ${r.parentNumber} (line ${pr.line}) cannot be imported`);
      continue;
    }
    if (byNumber.has(p)) {
      r.parentId = byNumber.get(p)!.id;
      continue;
    }
    r.status = 'error';
    r.messages.push(`Parent asset ${r.parentNumber} is not in the register or in this file`);
  }
  // Rows whose parent row fails (now, or through a loop) fail too.
  const byLine = new Map(rows.map((r) => [r.line, r]));
  let changed = true;
  while (changed) {
    changed = false;
    for (const r of rows) {
      if (r.status !== 'ok' || !r.parentLine) continue;
      const parent = byLine.get(r.parentLine)!;
      if (parent.status !== 'ok') {
        r.status = 'error';
        r.messages.push(`Its parent ${r.parentNumber} (line ${parent.line}) cannot be imported`);
        changed = true;
      }
    }
  }
  for (const r of rows) {
    if (r.status !== 'ok' || !r.parentLine) continue;
    const seen = new Set<number>([r.line]);
    let cur: PlanRow | undefined = byLine.get(r.parentLine);
    while (cur && cur.parentLine) {
      if (seen.has(cur.line)) {
        r.status = 'error';
        r.messages.push('Its parents make a loop in this file');
        break;
      }
      seen.add(cur.line);
      cur = byLine.get(cur.parentLine);
    }
  }
  // A row under a row that failed in the loop check fails too (repeat until nothing changes).
  changed = true;
  while (changed) {
    changed = false;
    for (const r of rows) {
      if (r.status === 'ok' && r.parentLine && byLine.get(r.parentLine)!.status !== 'ok') {
        r.status = 'error';
        r.messages.push(`Its parent ${r.parentNumber} cannot be imported`);
        changed = true;
      }
    }
  }
  const summary = { total: rows.length, ok: rows.filter((r) => r.status === 'ok').length, duplicates: rows.filter((r) => r.status === 'duplicate').length, errors: rows.filter((r) => r.status === 'error').length };
  return { columns, rows, summary };
}

/** The rows to import, each after its parent row. */
export function importOrder(plan: ImportPlan): PlanRow[] {
  const ok = plan.rows.filter((r) => r.status === 'ok');
  const byLine = new Map(ok.map((r) => [r.line, r]));
  const placed = new Set<number>();
  const out: PlanRow[] = [];
  const place = (r: PlanRow, depth: number) => {
    if (placed.has(r.line) || depth > MAX_IMPORT_ROWS) return;
    if (r.parentLine && byLine.has(r.parentLine)) place(byLine.get(r.parentLine)!, depth + 1);
    placed.add(r.line);
    out.push(r);
  };
  for (const r of ok) place(r, 0);
  return out;
}
