// The report as an Excel workbook (Office Open XML, written directly and zipped with fflate) and the task list as
// CSV. Text cells are inline strings, never formulas; amounts are numbers with the currency in its own column.

import { strToU8, zipSync } from 'fflate';
import type { ReportData, TaskRow } from './build';
import { fmtTime } from './html';

type Cell = string | number | null | { n: number; style: 'money0' | 'money2' | 'pct' } | { s: string; bold: true };

function xml(s: unknown): string {
  return String(s ?? '')
    // Characters XML 1.0 does not allow.
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function colName(i: number): string {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

const STYLE = { header: 1, bold: 2, money2: 3, money0: 4, pct: 5, wrap: 6 } as const;

interface Sheet {
  name: string;
  widths: number[];
  rows: Cell[][];
  /** Index of the header row to freeze under (or -1). */
  header: number;
}

function sheetXml(s: Sheet): string {
  const rows = s.rows
    .map((r, ri) => {
      const cells = r
        .map((v, ci) => {
          const ref = `${colName(ci)}${ri + 1}`;
          if (v == null || v === '') return '';
          if (typeof v === 'number') return Number.isFinite(v) ? `<c r="${ref}"><v>${v}</v></c>` : '';
          if (typeof v === 'object' && 'n' in v) return `<c r="${ref}" s="${STYLE[v.style]}"><v>${v.n}</v></c>`;
          const text = typeof v === 'object' ? v.s : v;
          const style = ri === s.header ? ` s="${STYLE.header}"` : typeof v === 'object' ? ` s="${STYLE.bold}"` : String(text).length > 60 ? ` s="${STYLE.wrap}"` : '';
          return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${xml(String(text).slice(0, 32000))}</t></is></c>`;
        })
        .join('');
      return `<row r="${ri + 1}">${cells}</row>`;
    })
    .join('');
  const pane = s.header >= 0 ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${s.header + 1}" topLeftCell="A${s.header + 2}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` : '';
  const cols = `<cols>${s.widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${pane}${cols}<sheetData>${rows}</sheetData></worksheet>`;
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="3"><numFmt numFmtId="164" formatCode="#,##0.00"/><numFmt numFmtId="165" formatCode="#,##0"/><numFmt numFmtId="166" formatCode="0.0&quot;%&quot;"/></numFmts>
<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF0A1F33"/><name val="Calibri"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0A1F33"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

function money(amount: string | null | undefined, currency: string | null): Cell {
  if (amount == null) return null;
  const n = Number(amount);
  return Number.isFinite(n) ? { n, style: currency === 'JPY' ? 'money0' : 'money2' } : null;
}

const TASK_HEAD = ['Task', 'Group', 'Status', 'Owners', 'Priority', 'Due date', 'Overdue', 'Progress %', 'Created', 'Completed', 'Description'];

function taskCells(r: TaskRow, tz: string): Cell[] {
  return [r.name, r.group, r.status, r.owners.join(', '), r.priority, r.due, r.overdue ? 'Yes' : 'No', r.progress, fmtTime(r.createdAt, tz), r.completedAt ? fmtTime(r.completedAt, tz) : null, r.description];
}

export function renderReportXlsx(r: ReportData): Uint8Array {
  const tz = r.meta.period.timezone;
  const o = r.overview;
  const summary: Cell[][] = [
    [{ s: r.meta.title, bold: true }],
    ['Organisation', r.meta.organisation],
    ['Project', r.meta.projectName],
    ['Project manager', r.meta.projectManager ?? 'Not recorded'],
    ['Project start date', r.meta.projectStart],
    ['Reporting period', `${r.meta.period.start} to ${r.meta.period.end} (${tz})`],
    ['Generated', `${fmtTime(r.meta.generatedAt, tz)} by ${r.meta.generatedBy}`],
    ['Report version', r.meta.reportVersion ?? 'Draft'],
    ...(r.meta.confidentiality ? [['Classification', r.meta.confidentiality] as Cell[]] : []),
    [],
    [{ s: 'Overview (recorded data)', bold: true }],
    ['Overall status (calculated)', r.summary.status.label],
    ['Status rule', r.summary.status.rule],
    ['Completion %', { n: o.percent, style: 'pct' }],
    ['Total tasks', o.total],
    ['Completed', o.completed],
    ['In progress', o.inProgress],
    ['Not started', o.notStarted],
    ['Blocked', o.blocked],
    ['Pending approval', o.pendingApproval],
    ['Overdue', o.overdue],
    ['Completed in the period', r.previous.completed.length],
    ['Started in the period', r.previous.started.length],
    ['New in the period', r.previous.created.length],
    ['Reassigned in the period', r.previous.reassigned.length],
    ['Carried forward', r.remaining.carriedForward.length],
    [],
    [{ s: 'Notes', bold: true }],
    ['History', r.history.reliableFrom ? `Reliable activity history from ${fmtTime(r.history.reliableFrom, tz)}` : 'No activity recorded'],
    ...[...r.history.notes, ...r.truncated].map((n) => ['Note', n] as Cell[]),
  ];
  const c = r.summary.commentary;
  const comm: [string, string | undefined][] = [
    ['Summary', c.summary],
    ['Achievements', c.achievements],
    ['Problems', c.problems],
    ['Decisions required', c.decisions],
    ['Next priorities', c.nextPriorities],
    ['Resources', c.resources],
  ];
  if (comm.some(([, v]) => v?.trim()) || c.statusAssessment) {
    summary.push([], [{ s: `Management commentary by ${c.author} (not recorded data)`, bold: true }]);
    if (c.statusAssessment) summary.push(['Status assessment', c.statusAssessment.replace('_', ' ')]);
    for (const [k, v] of comm) if (v?.trim()) summary.push([k, v.trim()]);
  }
  const sheets: Sheet[] = [
    { name: 'Summary', widths: [30, 90], rows: summary, header: -1 },
    { name: 'Tasks', widths: [40, 18, 16, 26, 12, 12, 9, 11, 18, 18, 60], rows: [TASK_HEAD, ...r.tasks.map((t) => taskCells(t, tz))], header: 0 },
    { name: 'Completed', widths: [40, 18, 16, 26, 12, 12, 9, 11, 18, 18, 60], rows: [TASK_HEAD, ...r.previous.completed.map((t) => taskCells(t, tz))], header: 0 },
    { name: 'Outstanding', widths: [40, 18, 16, 26, 12, 12, 9, 11, 18, 18, 60], rows: [TASK_HEAD, ...r.remaining.outstanding.map((t) => taskCells(t, tz))], header: 0 },
    {
      name: 'Risks',
      widths: [16, 40, 40, 18, 26, 40],
      rows: [['Type', 'Task', 'Detail', 'Impact', 'Responsible', 'Suggested action (rule-based)'], ...[...r.risks.recorded, ...r.risks.derived].map((x) => [x.kind, x.task, x.detail, x.impact, x.owners.join(', '), x.suggestedAction])],
      header: 0,
    },
  ];
  if (r.finance && r.meta.sections.includes('finance')) {
    const f = r.finance;
    const rows: Cell[][] = [
      ['Currency', 'Approved budget', 'Estimated cost (estimate)', 'Actual cost (actual)', 'Committed', 'Remaining budget', 'Variance', 'Utilisation %'],
      ...f.byRole.map((b) => [
        b.currency ?? 'Not set',
        money(b.approvedBudget?.amount, b.currency),
        money(b.estimatedCost?.amount, b.currency),
        money(b.actualCost?.amount, b.currency),
        money(b.committed?.amount, b.currency),
        money(b.remaining?.amount, b.currency),
        money(b.variance?.amount, b.currency),
        b.utilisation ? { n: Number(b.utilisation), style: 'pct' as const } : null,
      ]),
      [],
      [{ s: 'By column', bold: true }],
      ['Column', 'Finance role', 'Currency', 'Total', 'Tasks with an amount', 'Currency confirmed'],
      ...f.columns.map((col) => [col.title, col.roleLabel ?? 'Not set', col.currency ?? 'Not set', money(col.total.amount, col.currency), col.count, col.currencyConfirmed ? 'Yes' : 'No']),
      [],
      [{ s: 'By group', bold: true }],
      ['Group', ...f.columns.map((col) => `${col.title} (${col.currency ?? 'no currency'})`)],
      ...f.groups.map((g) => [g.name, ...g.totals.map((t) => (t.count ? money(t.total.amount, t.total.currency) : null))]),
      [],
      [{ s: 'By task', bold: true }],
      ['Task', ...f.columns.map((col) => `${col.title} (${col.currency ?? 'no currency'})`)],
      ...f.tasks.map((t) => [t.name, ...f.columns.map((col) => {
        const a = t.amounts.find((x) => x.columnId === col.columnId);
        return a ? money(a.amount.amount, a.amount.currency) : null;
      })]),
      [],
      ['Note', f.note],
    ];
    sheets.push({ name: 'Finance', widths: [34, 18, 22, 20, 16, 18, 16, 14], rows, header: 0 });
  }
  sheets.push({ name: 'Timeline', widths: [20, 80, 24], rows: [['Date and time', 'Event', 'By'], ...r.timeline.events.map((e) => [fmtTime(e.at, tz), e.text, e.actor])], header: 0 });

  const files: Record<string, Uint8Array> = {
    '[Content_Types].xml': strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`,
    ),
    '_rels/.rels': strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
    ),
    'docProps/core.xml': strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(r.meta.title)}</dc:title><dc:creator>BIZOMAT Project Management</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date(r.meta.generatedAt).toISOString()}</dcterms:created></cp:coreProperties>`,
    ),
    'xl/workbook.xml': strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${xml(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`,
    ),
    'xl/_rels/workbook.xml.rels': strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    ),
    'xl/styles.xml': strToU8(STYLES),
  };
  sheets.forEach((s, i) => (files[`xl/worksheets/sheet${i + 1}.xml`] = strToU8(sheetXml(s))));
  // Fixed timestamps inside the zip: the same report always gives the same bytes.
  const mtime = new Date(r.meta.generatedAt);
  return zipSync(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, [v, { mtime }]])) as any, { level: 6 });
}

/** A spreadsheet cell that begins with = + - @ (or a tab or return) would run as a formula: prefix it. */
export function csvCell(v: unknown): string {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function renderTasksCsv(r: ReportData): string {
  const tz = r.meta.period.timezone;
  const lines = [TASK_HEAD.map(csvCell).join(',')];
  for (const t of r.tasks) lines.push(taskCells(t, tz).map((c) => csvCell(c as string | number | null)).join(','));
  // A byte-order mark so Excel opens the file as UTF-8.
  return `\ufeff${lines.join('\r\n')}\r\n`;
}
