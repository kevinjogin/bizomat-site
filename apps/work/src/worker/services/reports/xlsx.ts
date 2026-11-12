// The report as an Excel workbook (Office Open XML, written directly and zipped with fflate) and the task list as
// CSV. Text cells are inline strings, never formulas; amounts are numbers with the currency in its own column.

import { strToU8, zipSync } from 'fflate';
import type { ReportData, TaskRow } from './build';
import type { CategorySection } from './categories';
import type { BaselineSection, EvmSection, ScheduleSection } from './controls';
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

const TASK_HEAD = ['Task ID', 'Task', 'Group', 'Status', 'Owners', 'Priority', 'Due date', 'Overdue', 'Progress %', 'Created', 'Completed', 'Description'];
const TASK_WIDTHS = [16, 40, 18, 16, 26, 12, 12, 9, 11, 18, 18, 60];

function taskCells(r: TaskRow, tz: string): Cell[] {
  return [r.key, r.name, r.group, r.status, r.owners.join(', '), r.priority, r.due, r.overdue ? 'Yes' : 'No', r.progress, fmtTime(r.createdAt, tz), r.completedAt ? fmtTime(r.completedAt, tz) : null, r.description];
}

/** Section K as its own sheet: one row per category; amounts (when the report has financial data) one column each. */
function categoriesSheet(k: CategorySection): Sheet {
  const finCols = k.financeIncluded ? (k.rows.find((g) => g.finance?.length)?.finance ?? []) : [];
  const head: Cell[] = ['Category', 'Description', 'Total tasks', 'Completed', 'In progress', 'Outstanding', 'Overdue', 'Unassigned', 'Owners', ...finCols.map((f) => `${f.column} (${f.currency ?? 'no currency'})`)];
  const rows: Cell[][] = k.rows.map((g) => [
    g.name,
    g.description,
    g.total,
    g.completed,
    g.inProgress,
    g.outstanding,
    g.overdue,
    g.unassigned,
    g.owners.join(', '),
    ...finCols.map((col) => {
      const f = g.finance?.find((x) => x.columnId === col.columnId);
      return f && f.count ? money(f.amount, f.currency) : null;
    }),
  ]);
  return { name: 'Categories', widths: [28, 70, 11, 11, 11, 12, 10, 11, 30, ...finCols.map(() => 20)], rows: [head, ...rows, [], ['Note', k.note]], header: 0 };
}

// ------------------------------------------------------------------ sections L, M and N (project controls)

/** A number, or the text n/a when it is unavailable (never an empty cell that could be read as zero). */
const num = (v: number | null | undefined): Cell => (v == null ? 'n/a' : v);
const amount = (v: string | null | undefined, currency: string | null): Cell => money(v, currency) ?? 'n/a';
const bold = (s: string): Cell => ({ s, bold: true });

/** Section L: the task schedule (task IDs in the first column), then near-critical work, milestones and actuals. */
function scheduleSheet(s: ScheduleSection): Sheet {
  const rows: Cell[][] = [
    ['Task ID', 'WBS', 'Task', 'Summary task', 'Milestone', 'Planned start', 'Planned finish', 'Early start', 'Early finish', 'Late start', 'Late finish', 'Duration (working days)', 'Total float (working days)', 'Free float (working days)', 'Criticality', 'Predecessors', 'Successors', 'Actual start', 'Actual finish', '% complete'],
    ...s.tasks.map((t) => [t.key, t.wbs, t.name, t.summary ? 'Yes' : 'No', t.milestone ? 'Yes' : 'No', t.plannedStart, t.plannedFinish, t.earlyStart, t.earlyFinish, t.lateStart, t.lateFinish, num(t.durationDays), num(t.totalFloatDays), num(t.freeFloatDays), t.criticalityLabel, t.predecessors.join(', '), t.successors.join(', '), t.actualStart, t.actualFinish, t.percentComplete]),
    [],
    [bold('Near-critical activities')],
    ['Task ID', 'Task', 'Total float (working days)', 'Early start', 'Early finish'],
    ...s.nearCritical.map((t) => [t.key, t.name, num(t.totalFloatDays), t.earlyStart, t.earlyFinish]),
    [],
    [bold(s.milestoneBaseline ? `Milestones (baseline dates from baseline ${s.milestoneBaseline.number}: ${s.milestoneBaseline.name})` : 'Milestones (no approved baseline)')],
    ['Task ID', 'Milestone', 'Baseline date', 'Forecast date', 'Actual date', 'Criticality'],
    ...s.milestones.map((t) => [t.key, t.name, t.baselineDate, t.forecastDate, t.actualDate, t.criticalityLabel]),
    [],
    [bold('Planned against actual dates')],
    ['Task ID', 'Task', 'Planned start', 'Actual start', 'Planned finish', 'Actual finish', 'Forecast finish', '% complete', 'State'],
    ...s.plannedVsActual.map((t) => [t.key, t.name, t.plannedStart, t.actualStart, t.plannedFinish, t.actualFinish, t.forecastFinish, t.percentComplete, t.state]),
    [],
    [bold('Critical paths')],
    ...(s.criticalPaths.length ? s.criticalPaths.map((p, i) => [`Path ${i + 1}`, p.join(' -> ')] as Cell[]) : [['None', s.valid ? 'No task is scheduled.' : 'The schedule cannot be calculated.'] as Cell[]]),
    [],
    [bold('Schedule warnings')],
    ...(s.warnings.length ? s.warnings.map((w) => ['Warning', w] as Cell[]) : [['None', 'No loops, conflicts or missing logic.'] as Cell[]]),
    [],
    ['Note', s.note],
  ];
  return { name: 'Schedule', widths: [16, 9, 40, 9, 9, 13, 13, 13, 13, 13, 13, 12, 12, 12, 16, 30, 30, 13, 13, 11], rows, header: 0 };
}

function dependenciesSheet(s: ScheduleSection): Sheet {
  return {
    name: 'Dependencies',
    widths: [16, 36, 16, 36, 8, 18, 9, 12, 12, 9, 18],
    rows: [
      ['Predecessor ID', 'Predecessor', 'Successor ID', 'Successor', 'Type', 'Type name', 'Lag', 'Lag (working days)', 'Float (working days)', 'Critical', 'Source'],
      ...s.dependencies.map((d) => [d.predecessorKey, d.predecessorName, d.successorKey, d.successorName, d.type, d.typeLabel, d.lag, d.lagDays, num(d.floatDays), d.critical ? 'Yes' : 'No', d.source === 'column' ? 'Dependency column' : 'Link']),
    ],
    header: 0,
  };
}

/** Section M: per-task variances (task IDs first), then the baseline identification and the project finish. */
function baselineSheet(b: BaselineSection): Sheet {
  if (!b.available || !b.baseline) return { name: 'Baseline', widths: [24, 100], rows: [['Baseline comparison', b.reason ?? 'No approved baseline.']], header: -1 };
  const bl = b.baseline;
  const cur = b.currency ?? 'no currency';
  const rows: Cell[][] = [
    [
      'Task ID', 'WBS', 'Task', 'In baseline', 'In current plan', 'Baseline start', 'Current start', 'Start variance (working days)', 'Baseline finish', 'Current finish', 'Finish variance (working days)',
      'Baseline duration (working days)', 'Current duration (working days)', 'Duration variance (working days)', 'Planned % by status date', '% complete', 'Progress variance (points)', 'Actual start', 'Actual finish',
      ...(b.costIncluded ? [`Baseline budget (${cur})`, `Current budget (${cur})`, `Cost variance (${cur})`] : []),
    ],
    ...b.rows.map((r) => [
      r.key, r.wbs, r.name, r.inBaseline ? 'Yes' : 'No', r.inPlan ? 'Yes' : 'No', r.baselineStart, r.currentStart, num(r.startVarianceDays), r.baselineFinish, r.currentFinish, num(r.finishVarianceDays),
      num(r.baselineDurationDays), num(r.currentDurationDays), num(r.durationVarianceDays), num(r.plannedPercent), num(r.percentComplete), num(r.progressVariance), r.actualStart, r.actualFinish,
      ...(b.costIncluded ? [amount(r.baselineCost, b.currency), amount(r.currentCost, b.currency), amount(r.costVariance, b.currency)] : []),
    ]),
    [],
    [bold('Baseline')],
    ['Baseline', `Baseline ${bl.number}: ${bl.name}`],
    ['Approved by', bl.approvedBy],
    ['Approved on', bl.approvedOn],
    ['Status date', b.statusDate],
    ['Baseline finish', bl.projectFinish],
    ['Forecast finish', b.forecastFinish ?? 'Cannot be calculated'],
    ['Finish variance (working days)', num(b.projectFinishVarianceDays)],
    ...(b.original ? [['Original baseline (0) finish', b.original.projectFinish] as Cell[], ['Variance against the original (working days)', num(b.original.finishVarianceDays)] as Cell[]] : []),
    ...(b.costIncluded ? [[`Budget at completion (${cur})`, amount(b.bac, b.currency)] as Cell[]] : []),
    [],
    ['Note', b.note],
  ];
  return { name: 'Baseline', widths: [16, 9, 40, 10, 10, 13, 13, 12, 13, 13, 12, 12, 12, 12, 12, 11, 12, 13, 13, 18, 18, 18], rows, header: 0 };
}

/** Section N: per-task earned value (task IDs first), then the measures, forecasts, trend, warnings and definitions. */
function evmSheet(e: EvmSection): Sheet {
  if (!e.financeAllowed || !e.available || !e.metrics || !e.baseline) return { name: 'Earned value', widths: [24, 110], rows: [['Earned value', e.reason ?? 'Earned value is not available.']], header: -1 };
  const m = e.metrics;
  const cur = e.currency;
  const c = cur ?? 'no currency';
  const rows: Cell[][] = [
    ['Task ID', 'WBS', 'Task', 'Earning method', `BAC (${c})`, `PV (${c})`, `EV (${c})`, `AC (${c})`, `CV (${c})`, `SV (${c})`, 'Planned %', 'Earned %', 'Note'],
    ...e.tasks.map((t) => [t.key, t.wbs, t.name, t.methodLabel, amount(t.bac, cur), amount(t.pv, cur), amount(t.ev, cur), amount(t.ac, cur), amount(t.cv, cur), amount(t.sv, cur), num(t.plannedPercent), num(t.earnedPercent), t.note]),
    [],
    [bold('Measures at the status date')],
    ['Baseline', `Baseline ${e.baseline.number}: ${e.baseline.name}, approved by ${e.baseline.approvedBy} on ${e.baseline.approvedOn}`],
    ['Status date', e.statusDate],
    ['Currency', cur ?? 'Not set'],
    [`BAC (${c})`, amount(m.bac, cur)],
    [`PV (${c})`, amount(m.pv, cur)],
    [`EV (${c})`, amount(m.ev, cur)],
    [`AC (${c})`, money(m.ac, cur) ?? 'Unavailable'],
    [`CV (${c})`, money(m.cv, cur) ?? 'Unavailable'],
    [`SV (${c})`, money(m.sv, cur) ?? 'Unavailable'],
    ['CPI', m.cpi ?? 'Unavailable'],
    ['SPI', m.spi ?? 'Unavailable'],
    ['TCPI to meet BAC', m.tcpiBac ?? 'Unavailable'],
    ['TCPI to meet EAC by CPI', m.tcpiEac ?? 'Unavailable'],
    ['Cost performance', e.cpiText],
    ['Schedule performance', e.spiText],
    ...(e.caution ? [['Caution', e.caution] as Cell[]] : []),
    ['Actual cost coverage', `Recorded for ${m.acCoverage.withActuals} of ${m.acCoverage.tasks} budgeted tasks`],
    [],
    [bold('Forecasts at completion')],
    ['Method', 'How it is calculated', `EAC (${c})`, `ETC (${c})`, `VAC (${c})`],
    ...e.forecasts.map((f) => [f.label, f.formula, money(f.eac, cur) ?? 'Unavailable', money(f.etc, cur) ?? 'Unavailable', money(f.vac, cur) ?? 'Unavailable']),
    [],
    [bold(e.trend.length < e.trendPoints ? `Trend (the latest ${e.trend.length} of ${e.trendPoints} points)` : 'Trend')],
    ['Date', `PV (${c})`, `EV (${c})`, `AC (${c})`, 'CPI', 'SPI'],
    ...e.trend.map((p) => [p.date, amount(p.pv, cur), amount(p.ev, cur), amount(p.ac, cur), num(p.cpi), num(p.spi)]),
    [],
    [bold('Warnings')],
    ...(e.warnings.length ? e.warnings.map((w) => ['Warning', w] as Cell[]) : [['None', ''] as Cell[]]),
    [],
    [bold('Definitions')],
    ...Object.entries(e.definitions).map(([k, v]) => [k, v] as Cell[]),
  ];
  return { name: 'Earned value', widths: [26, 9, 40, 26, 16, 16, 16, 16, 16, 16, 11, 11, 40], rows, header: 0 };
}

/** Key figures of sections L to N for the Summary sheet. */
function controlsSummary(r: ReportData): Cell[][] {
  const out: Cell[][] = [];
  const has = (s: string) => r.meta.sections.includes(s as never);
  if (r.schedule && has('schedule')) {
    const s = r.schedule;
    out.push(
      [],
      [bold(`Schedule and critical path (status date ${s.statusDate})`)],
      ['Project start', s.projectStart ?? 'Not set'],
      ['Forecast finish', s.projectFinish ?? 'Cannot be calculated'],
      ['Critical path duration (working days)', num(s.criticalDurationDays)],
      ['Schedule can be calculated', s.valid ? 'Yes' : 'No: the dependencies form a loop'],
      ['Critical tasks', s.counts.critical],
      ['Near-critical tasks', s.counts.near_critical],
      ['Non-critical tasks', s.counts.non_critical],
      ['Not scheduled', s.counts.unscheduled],
    );
  }
  if (r.baseline && has('baseline')) {
    const b = r.baseline;
    out.push([], [bold('Baseline comparison')]);
    if (b.available && b.baseline) out.push(['Baseline', `Baseline ${b.baseline.number}: ${b.baseline.name}`], ['Baseline finish', b.baseline.projectFinish], ['Forecast finish', b.forecastFinish ?? 'Cannot be calculated'], ['Finish variance (working days)', num(b.projectFinishVarianceDays)]);
    else out.push(['Baseline', b.reason ?? 'No approved baseline.']);
  }
  if (r.evm && has('evm')) {
    const e = r.evm;
    out.push([], [bold(`Earned value (status date ${e.statusDate})`)]);
    if (e.financeAllowed && e.available && e.metrics) {
      const c = e.currency ?? 'no currency';
      out.push([`BAC (${c})`, amount(e.metrics.bac, e.currency)], [`EV (${c})`, amount(e.metrics.ev, e.currency)], [`AC (${c})`, money(e.metrics.ac, e.currency) ?? 'Unavailable'], ['CPI', e.metrics.cpi ?? 'Unavailable'], ['SPI', e.metrics.spi ?? 'Unavailable'], [`EAC by CPI (${c})`, money(e.metrics.eac.cpi, e.currency) ?? 'Unavailable']);
    } else out.push(['Earned value', e.reason ?? 'Earned value is not available.']);
  }
  return out;
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
    ...controlsSummary(r),
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
    { name: 'Tasks', widths: TASK_WIDTHS, rows: [TASK_HEAD, ...r.tasks.map((t) => taskCells(t, tz))], header: 0 },
    { name: 'Completed', widths: TASK_WIDTHS, rows: [TASK_HEAD, ...r.previous.completed.map((t) => taskCells(t, tz))], header: 0 },
    { name: 'Outstanding', widths: TASK_WIDTHS, rows: [TASK_HEAD, ...r.remaining.outstanding.map((t) => taskCells(t, tz))], header: 0 },
    {
      name: 'Risks',
      widths: [16, 16, 40, 40, 18, 26, 40],
      rows: [['Task ID', 'Type', 'Task', 'Detail', 'Impact', 'Responsible', 'Suggested action (rule-based)'], ...[...r.risks.recorded, ...r.risks.derived].map((x) => [x.taskKey, x.kind, x.task, x.detail, x.impact, x.owners.join(', '), x.suggestedAction])],
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
      ['Task ID', 'Task', ...f.columns.map((col) => `${col.title} (${col.currency ?? 'no currency'})`)],
      ...f.tasks.map((t) => [t.key, t.name, ...f.columns.map((col) => {
        const a = t.amounts.find((x) => x.columnId === col.columnId);
        return a ? money(a.amount.amount, a.amount.currency) : null;
      })]),
      [],
      ['Note', f.note],
    ];
    sheets.push({ name: 'Finance', widths: [34, 18, 22, 20, 16, 18, 16, 14], rows, header: 0 });
  }
  sheets.push({ name: 'Timeline', widths: [20, 80, 24], rows: [['Date and time', 'Event', 'By'], ...r.timeline.events.map((e) => [fmtTime(e.at, tz), e.text, e.actor])], header: 0 });
  if (r.categories && r.meta.sections.includes('categories')) sheets.push(categoriesSheet(r.categories));
  if (r.schedule && r.meta.sections.includes('schedule')) sheets.push(scheduleSheet(r.schedule), dependenciesSheet(r.schedule));
  if (r.baseline && r.meta.sections.includes('baseline')) sheets.push(baselineSheet(r.baseline));
  if (r.evm && r.meta.sections.includes('evm')) sheets.push(evmSheet(r.evm));

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
  // With section K, each task also carries its category's description, in a last column so the others keep their place.
  // Tasks name their group, so two groups with the same name and different descriptions leave the cell empty.
  let described: Map<string, string> | null = null;
  if (r.categories && r.meta.sections.includes('categories')) {
    described = new Map();
    for (const g of r.categories.rows) described.set(g.name, described.has(g.name) && described.get(g.name) !== g.description ? '' : g.description);
  }
  const lines = [[...TASK_HEAD, ...(described ? ['Category description'] : [])].map(csvCell).join(',')];
  for (const t of r.tasks) lines.push([...taskCells(t, tz), ...(described ? [described.get(t.group) ?? ''] : [])].map((c) => csvCell(c as string | number | null)).join(','));
  // A byte-order mark so Excel opens the file as UTF-8.
  return `\ufeff${lines.join('\r\n')}\r\n`;
}
