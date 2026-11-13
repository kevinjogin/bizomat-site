// CSV (RFC 4180) for CRM import and export: quoted fields, embedded commas, quotes and line breaks.

/** Text that a spreadsheet would run as a formula is prefixed with an apostrophe (CSV injection). */
function safeCell(v: string): string {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

const BOM = String.fromCharCode(0xfeff);

export function toCsv(header: string[], rows: (string | number | null | undefined)[][]): string {
  const cell = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? '' : typeof v === 'number' ? String(v) : safeCell(String(v));
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // A byte order mark so spreadsheet programs read UTF-8.
  return `${BOM}${[header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')}\r\n`;
}

export function parseCsv(text: string, maxRows = 5001): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let i = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  // Detect a semicolon-separated file (common in some locales) from the first line.
  const firstLine = text.slice(i, text.indexOf('\n') > 0 ? text.indexOf('\n') : undefined);
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
  for (; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"' && field === '') quoted = true;
    else if (ch === sep) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
      if (rows.length >= maxRows) return rows;
    } else field += ch;
  }
  row.push(field);
  if (row.some((x) => x !== '')) rows.push(row);
  return rows;
}
