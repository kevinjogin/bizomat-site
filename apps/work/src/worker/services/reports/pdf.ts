// The report as a PDF: A4, white pages, navy headings, a cover page, tables that repeat their header on each page,
// a status chart, and a footer with page numbers on every page. pdf-lib with the standard Helvetica fonts, so the
// file has no external dependency; those fonts cover Western European text, and any other character is replaced
// (the HTML and Excel exports keep every character).

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import { SECTION_LABELS, STATUS_LABELS, type ReportSection } from '../../../shared/reports';
import { parseGroupDescription } from '../../../shared/group-description';
import type { ReportData, RiskRow, TaskRow } from './build';
import type { CategorySection } from './categories';
import { CRITICALITY_LABELS, type Criticality } from '../../../shared/schedule';
import {
  amountText,
  dateText,
  daysText,
  evmMeasures,
  finishVarianceWords,
  indexText,
  moneyText,
  percentText,
  signedDays,
  type BaselineSection,
  type EvmSection,
  type ScheduleSection,
} from './controls';
import { fmtDay, fmtTime } from './html';

const A4: [number, number] = [595.28, 841.89];
const M = { left: 46, right: 46, top: 54, bottom: 58 };
const NAVY = rgb(0.039, 0.122, 0.2);
const TEAL = rgb(0.059, 0.463, 0.431);
const SLATE = rgb(0.392, 0.455, 0.545);
const TEXT = rgb(0.118, 0.161, 0.231);
const LINE = rgb(0.886, 0.91, 0.941);
const HEAD_BG = rgb(0.945, 0.961, 0.976);

const WIN_ANSI_EXTRA = new Set([0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160, 0x2039, 0x0152, 0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178]);

/** Text the standard PDF fonts can draw: WinAnsi characters only, everything else replaced. */
export function pdfSafe(s: unknown): string {
  let out = '';
  for (const ch of String(s ?? '').replace(/[\t\r]/g, ' ').replace(/\u2192/g, '->').replace(/[\u2010\u2011\u2012\u2212]/g, '-').replace(/\u00a0/g, ' ')) {
    const cp = ch.codePointAt(0)!;
    if ((cp >= 32 && cp <= 126) || (cp >= 160 && cp <= 255) || WIN_ANSI_EXTRA.has(cp) || ch === '\n') out += ch;
    else out += '?';
  }
  return out;
}

class Writer {
  doc!: PDFDocument;
  font!: PDFFont;
  bold!: PDFFont;
  page!: PDFPage;
  y = 0;
  readonly width = A4[0] - M.left - M.right;

  static async create() {
    const w = new Writer();
    w.doc = await PDFDocument.create();
    w.font = await w.doc.embedFont(StandardFonts.Helvetica);
    w.bold = await w.doc.embedFont(StandardFonts.HelveticaBold);
    return w;
  }

  newPage() {
    this.page = this.doc.addPage(A4);
    this.y = A4[1] - M.top;
  }

  ensure(h: number) {
    if (!this.page || this.y - h < M.bottom) this.newPage();
  }

  lines(text: string, size: number, font: PDFFont, width: number): string[] {
    const out: string[] = [];
    for (const para of pdfSafe(text).split('\n')) {
      const words = para.split(/\s+/).filter(Boolean);
      let line = '';
      for (const word of words) {
        const tryLine = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(tryLine, size) <= width) {
          line = tryLine;
          continue;
        }
        if (line) out.push(line);
        if (font.widthOfTextAtSize(word, size) <= width) line = word;
        else {
          // A word wider than the column: break it.
          let part = '';
          for (const ch of word) {
            if (font.widthOfTextAtSize(part + ch, size) > width && part) {
              out.push(part);
              part = ch;
            } else part += ch;
          }
          line = part;
        }
      }
      out.push(line);
    }
    return out;
  }

  text(t: string, o: { size?: number; bold?: boolean; color?: RGB; gap?: number; indent?: number } = {}) {
    const size = o.size ?? 10;
    const font = o.bold ? this.bold : this.font;
    const lh = size * 1.35;
    for (const l of this.lines(t, size, font, this.width - (o.indent ?? 0))) {
      this.ensure(lh);
      this.page.drawText(l, { x: M.left + (o.indent ?? 0), y: this.y - size, size, font, color: o.color ?? TEXT });
      this.y -= lh;
    }
    this.y -= o.gap ?? 4;
  }

  h2(t: string) {
    this.ensure(60);
    this.y -= 10;
    this.page.drawText(pdfSafe(t), { x: M.left, y: this.y - 15, size: 15, font: this.bold, color: NAVY });
    this.y -= 22;
    this.page.drawLine({ start: { x: M.left, y: this.y }, end: { x: M.left + this.width, y: this.y }, thickness: 1.5, color: NAVY });
    this.y -= 10;
  }

  h3(t: string) {
    this.ensure(40);
    this.y -= 4;
    this.text(t, { size: 11, bold: true, color: NAVY, gap: 3 });
  }

  muted(t: string) {
    this.text(t, { size: 8.5, color: SLATE, gap: 6 });
  }

  bullets(items: string[]) {
    for (const i of items) this.text(`•  ${i}`, { size: 9.5, indent: 6, gap: 1 });
    this.y -= 4;
  }

  commentary(t: string | undefined, author: string) {
    if (!t?.trim()) return;
    this.ensure(40);
    const top = this.y;
    this.text(`Management commentary, entered by ${author} (not derived from recorded data)`, { size: 8, bold: true, color: TEAL, indent: 10, gap: 2 });
    this.text(t.trim(), { size: 9.5, indent: 10, gap: 4 });
    this.page.drawLine({ start: { x: M.left + 2, y: top }, end: { x: M.left + 2, y: this.y + 4 }, thickness: 2.5, color: TEAL });
    this.y -= 4;
  }

  kpis(items: { label: string; value: string }[]) {
    const n = Math.min(items.length, 6);
    const gap = 8;
    const w = (this.width - gap * (n - 1)) / n;
    this.ensure(52);
    items.slice(0, 6).forEach((k, i) => {
      const x = M.left + i * (w + gap);
      this.page.drawRectangle({ x, y: this.y - 44, width: w, height: 44, borderColor: LINE, borderWidth: 1, color: rgb(1, 1, 1) });
      this.page.drawText(pdfSafe(k.value).slice(0, 22), { x: x + 8, y: this.y - 22, size: 13, font: this.bold, color: NAVY });
      this.page.drawText(pdfSafe(k.label).slice(0, 34), { x: x + 8, y: this.y - 36, size: 7.5, font: this.font, color: SLATE });
    });
    this.y -= 54;
  }

  bars(items: { label: string; value: number; color: RGB }[]) {
    const max = Math.max(1, ...items.map((i) => i.value));
    const barW = this.width - 150;
    this.ensure(items.length * 18 + 8);
    for (const i of items) {
      this.page.drawText(pdfSafe(i.label), { x: M.left, y: this.y - 11, size: 9, font: this.font, color: TEXT });
      const w = Math.max(2, (i.value / max) * barW);
      this.page.drawRectangle({ x: M.left + 110, y: this.y - 13, width: w, height: 11, color: i.color });
      this.page.drawText(String(i.value), { x: M.left + 116 + w, y: this.y - 11, size: 9, font: this.bold, color: NAVY });
      this.y -= 18;
    }
    this.y -= 6;
  }

  table(headers: string[], rows: string[][], widths: number[], opts: { size?: number } = {}) {
    const size = opts.size ?? 8.3;
    const pad = size < 8 ? 3 : 4;
    const lh = size * 1.3;
    const total = widths.reduce((a, b) => a + b, 0);
    const cols = widths.map((w) => (w / total) * this.width);
    const drawHeader = () => {
      const hl = headers.map((h, i) => this.lines(h, size, this.bold, cols[i] - pad * 2));
      const h = Math.max(...hl.map((l) => l.length)) * lh + pad * 2;
      this.ensure(h + lh * 2);
      this.page.drawRectangle({ x: M.left, y: this.y - h, width: this.width, height: h, color: HEAD_BG });
      let x = M.left;
      hl.forEach((ls, i) => {
        ls.forEach((l, k) => this.page.drawText(l, { x: x + pad, y: this.y - pad - size - k * lh, size, font: this.bold, color: NAVY }));
        x += cols[i];
      });
      this.y -= h;
    };
    drawHeader();
    for (const r of rows) {
      const cl = r.map((cell, i) => this.lines(cell, size, this.font, cols[i] - pad * 2).slice(0, 12));
      const h = Math.max(1, ...cl.map((l) => l.length)) * lh + pad * 2;
      if (this.y - h < M.bottom) {
        this.newPage();
        drawHeader();
      }
      let x = M.left;
      cl.forEach((ls, i) => {
        ls.forEach((l, k) => this.page.drawText(l, { x: x + pad, y: this.y - pad - size - k * lh, size, font: this.font, color: TEXT }));
        x += cols[i];
      });
      this.y -= h;
      this.page.drawLine({ start: { x: M.left, y: this.y }, end: { x: M.left + this.width, y: this.y }, thickness: 0.5, color: LINE });
    }
    this.y -= 10;
  }
}

function tasks(w: Writer, rows: TaskRow[], empty: string) {
  if (!rows.length) return w.muted(empty);
  w.table(
    ['ID', 'Task', 'Group', 'Status', 'Owner', 'Priority', 'Due'],
    rows.map((r) => [r.key ?? '-', r.name, r.group, r.status || '-', r.owners.join(', ') || 'Unassigned', r.priority ?? '-', r.due ? `${r.due}${r.overdue ? ' (overdue)' : ''}` : '-']),
    [12, 25, 13, 12, 16, 9, 13],
  );
}

function risks(w: Writer, rows: RiskRow[]) {
  w.table(
    ['ID', 'Type', 'Task', 'Detail', 'Impact', 'Responsible', 'Suggested action'],
    rows.map((r) => [r.taskKey ?? '-', r.kind, r.task, r.detail, r.impact, r.owners.join(', ') || 'Unassigned', r.suggestedAction]),
    [11, 10, 18, 20, 11, 13, 17],
  );
}

/** Section K: a summary table, then each category's description (paragraphs and bullets) and figures. */
function categories(w: Writer, k: CategorySection) {
  w.h2(SECTION_LABELS.categories);
  w.muted(k.note);
  if (!k.rows.length) return w.muted('This board has no groups.');
  w.table(
    ['Category', 'Tasks', 'Completed', 'In progress', 'Outstanding', 'Overdue', 'Owners'],
    k.rows.map((g) => [g.name, String(g.total), String(g.completed), String(g.inProgress), String(g.outstanding), String(g.overdue), g.owners.join(', ') || 'Unassigned']),
    [24, 8, 11, 11, 12, 9, 25],
  );
  for (const g of k.rows) {
    w.h3(g.name);
    const blocks = parseGroupDescription(g.description);
    if (!blocks.length) w.muted('No description.');
    for (const b of blocks) {
      if (b.kind === 'list') w.bullets(b.items);
      else w.text(b.lines.join('\n'), { size: 9.5, gap: 5 });
    }
    w.muted(`${g.total} task(s): ${g.completed} completed, ${g.inProgress} in progress, ${g.outstanding} outstanding${g.overdue ? `, ${g.overdue} overdue` : ''}${g.unassigned ? `, ${g.unassigned} unassigned` : ''}.`);
    const money = (g.finance ?? []).filter((f) => f.count > 0);
    if (money.length) w.table(['Financial column', 'Currency', 'Total', 'Tasks'], money.map((f) => [f.role ? `${f.column} (${f.role})` : f.column, f.currency ?? 'Not set', f.display, String(f.count)]), [40, 16, 28, 16]);
    else if (g.finance) w.muted('No amounts recorded in this category.');
  }
}

// ------------------------------------------------------------------ sections L, M and N (project controls)

/** Dense tables (many columns) use a smaller font so that dates fit their column on A4. */
const DENSE = { size: 7 };

function scheduleSection(w: Writer, s: ScheduleSection) {
  w.h2(SECTION_LABELS.schedule);
  w.muted(s.note);
  w.kpis([
    { label: 'Status date', value: s.statusDate },
    { label: 'Project start', value: s.projectStart ?? 'Not set' },
    { label: 'Forecast finish', value: s.projectFinish ?? 'Cannot be calculated' },
  ]);
  w.kpis([
    { label: 'Critical path (working days)', value: s.criticalDurationDays == null ? 'Unavailable' : String(s.criticalDurationDays) },
    { label: 'Critical tasks', value: String(s.counts.critical) },
    { label: 'Near-critical tasks', value: String(s.counts.near_critical) },
  ]);
  if (!s.valid) w.text('The schedule cannot be calculated: the dependencies form a loop (see the warnings below). Dates, float and the critical path are not available until it is removed.', { size: 9.5, color: rgb(0.725, 0.11, 0.11) });
  w.h3('Tasks by criticality');
  const counts = (['critical', 'near_critical', 'non_critical', 'unscheduled', 'invalid'] as Criticality[]).filter((k) => k !== 'invalid' || s.counts.invalid);
  w.table(['Criticality', 'Tasks'], counts.map((k) => [CRITICALITY_LABELS[k], String(s.counts[k])]), [70, 30]);
  w.h3('Critical path');
  if (s.criticalPaths.length) w.bullets(s.criticalPaths.map((p) => p.join(' -> ')));
  else w.muted(s.valid ? 'No critical path: no task is scheduled.' : 'Not available: the schedule cannot be calculated.');
  w.h3('Schedule: dates and float');
  if (!s.tasks.length) w.muted('This project has no tasks.');
  else {
    w.table(
      ['ID', 'WBS', 'Task', 'Planned start', 'Planned finish', 'Early start', 'Early finish', 'Duration (d)', 'Total float (d)', 'Free float (d)', 'Criticality'],
      s.tasks.map((t) => [t.key ?? '-', t.wbs, t.milestone ? `${t.name} (milestone)` : t.name, dateText(t.plannedStart), dateText(t.plannedFinish), dateText(t.earlyStart), dateText(t.earlyFinish), daysText(t.durationDays), daysText(t.totalFloatDays), daysText(t.freeFloatDays), t.criticalityLabel]),
      [47, 28, 119, 42, 42, 42, 42, 35, 30, 30, 46],
      DENSE,
    );
    w.h3('Schedule: logic and progress');
    w.table(['ID', 'Task', 'Predecessors', 'Successors', 'Complete'], s.tasks.map((t) => [t.key ?? '-', t.name, t.predecessors.join(', ') || '-', t.successors.join(', ') || '-', percentText(t.percentComplete)]), [47, 150, 130, 130, 46], DENSE);
  }
  w.h3('Dependency register');
  if (s.dependencies.length)
    w.table(
      ['Predecessor ID', 'Predecessor', 'Successor ID', 'Successor', 'Type', 'Lag', 'Float (d)', 'Critical'],
      s.dependencies.map((d) => [d.predecessorKey ?? '-', d.predecessorName, d.successorKey ?? '-', d.successorName, d.source === 'column' ? `${d.type} (Dependency column)` : `${d.type} (${d.typeLabel})`, d.lag, daysText(d.floatDays), d.critical ? 'Yes' : 'No']),
      [47, 105, 47, 105, 70, 35, 35, 35],
      DENSE,
    );
  else w.muted('No dependencies are recorded between the tasks.');
  w.h3('Near-critical activities');
  if (s.nearCritical.length) w.table(['ID', 'Task', 'Total float (d)', 'Early start', 'Early finish'], s.nearCritical.map((t) => [t.key ?? '-', t.name, daysText(t.totalFloatDays), dateText(t.earlyStart), dateText(t.earlyFinish)]), [50, 200, 60, 60, 60], DENSE);
  else w.muted('No task is near-critical.');
  w.h3('Milestones');
  if (s.milestones.length) {
    w.muted(s.milestoneBaseline ? `Baseline dates from baseline ${s.milestoneBaseline.number}: ${s.milestoneBaseline.name}.` : 'No approved baseline: baseline dates are not available.');
    w.table(['ID', 'Milestone', 'Baseline date', 'Forecast date', 'Actual date', 'Criticality'], s.milestones.map((t) => [t.key ?? '-', t.name, dateText(t.baselineDate), dateText(t.forecastDate), dateText(t.actualDate), t.criticalityLabel]), [50, 170, 60, 60, 60, 60], DENSE);
  } else w.muted('No milestone is scheduled (a task with no duration, or marked as a milestone).');
  w.h3('Planned against actual dates');
  if (s.plannedVsActual.length)
    w.table(
      ['ID', 'Task', 'Planned start', 'Actual start', 'Planned finish', 'Actual finish', 'Forecast finish', 'Complete', 'State'],
      s.plannedVsActual.map((t) => [t.key ?? '-', t.name, dateText(t.plannedStart), dateText(t.actualStart), dateText(t.plannedFinish), dateText(t.actualFinish), dateText(t.forecastFinish), percentText(t.percentComplete), t.state]),
      [47, 99, 42, 42, 42, 42, 42, 40, 45],
      DENSE,
    );
  else w.muted('No task has started by the status date.');
  w.h3('Schedule warnings');
  if (s.warnings.length) w.bullets(s.warnings);
  else w.muted('None: the schedule has no loops, conflicts or missing logic.');
}

function baselineSection(w: Writer, b: BaselineSection) {
  w.h2(SECTION_LABELS.baseline);
  if (!b.available || !b.baseline) return w.text(b.reason ?? 'No approved baseline.', { size: 9.5, color: SLATE });
  const bl = b.baseline;
  w.muted(b.note);
  const kv: [string, string][] = [
    ['Baseline', `Baseline ${bl.number}: ${bl.name}`],
    ['Approved', `By ${bl.approvedBy} on ${bl.approvedOn}`],
    ['Baseline finish', dateText(bl.projectFinish)],
    ['Forecast finish', b.forecastFinish ?? 'Cannot be calculated'],
    ['Finish variance', finishVarianceWords(b.projectFinishVarianceDays)],
  ];
  if (b.original) kv.push(['Original baseline (0) finish', `${dateText(b.original.projectFinish)} (${b.original.name}); forecast variance against it: ${signedDays(b.original.finishVarianceDays)} working days`]);
  if (b.costIncluded) kv.push(['Budget at completion', moneyText(b.bac, b.currency)]);
  w.table(['Item', 'Detail'], kv, [30, 70]);
  const flag = (r: BaselineSection['rows'][number]) => (!r.inBaseline ? ' (added after the baseline)' : !r.inPlan ? ' (no longer in the plan)' : '');
  w.h3('Dates');
  w.table(
    ['ID', 'WBS', 'Task', 'Baseline start', 'Current start', 'Start var. (d)', 'Baseline finish', 'Current finish', 'Finish var. (d)'],
    b.rows.map((r) => [r.key ?? '-', r.wbs, r.name + flag(r), dateText(r.baselineStart), dateText(r.currentStart), signedDays(r.startVarianceDays), dateText(r.baselineFinish), dateText(r.currentFinish), signedDays(r.finishVarianceDays)]),
    [47, 28, 130, 42, 42, 35, 42, 42, 35],
    DENSE,
  );
  w.h3(b.costIncluded ? 'Duration, progress and cost' : 'Duration and progress');
  const cur = b.currency ?? 'no currency';
  w.table(
    ['ID', 'Task', 'Baseline duration (d)', 'Current duration (d)', 'Duration var. (d)', 'Planned by status date', 'Complete', 'Progress var. (points)', ...(b.costIncluded ? [`Baseline budget (${cur})`, `Current budget (${cur})`, `Cost variance (${cur})`] : [])],
    b.rows.map((r) => [
      r.key ?? '-',
      r.name,
      daysText(r.baselineDurationDays),
      daysText(r.currentDurationDays),
      signedDays(r.durationVarianceDays),
      percentText(r.plannedPercent),
      percentText(r.percentComplete),
      signedDays(r.progressVariance),
      ...(b.costIncluded ? [amountText(r.baselineCost, b.currency), amountText(r.currentCost, b.currency), amountText(r.costVariance, b.currency)] : []),
    ]),
    b.costIncluded ? [50, 70, 36, 36, 36, 40, 38, 40, 52, 52, 53] : [47, 150, 40, 40, 40, 45, 45, 45],
    DENSE,
  );
}

function evmSection(w: Writer, e: EvmSection) {
  w.h2(SECTION_LABELS.evm);
  if (!e.financeAllowed || !e.available || !e.metrics || !e.baseline) return w.text(e.reason ?? 'Earned value is not available.', { size: 9.5, color: SLATE });
  const m = e.metrics;
  const cur = e.currency;
  w.table(
    ['Item', 'Detail'],
    [
      ['Baseline', `Baseline ${e.baseline.number}: ${e.baseline.name}, approved by ${e.baseline.approvedBy} on ${e.baseline.approvedOn}`],
      ['Status date', e.statusDate],
      ['Currency', cur ?? 'Not set'],
    ],
    [30, 70],
  );
  // Money needs room: two rows of three.
  w.kpis([
    { label: 'Budget at completion (BAC)', value: moneyText(m.bac, cur) },
    { label: 'Planned value (PV)', value: moneyText(m.pv, cur) },
    { label: 'Earned value (EV)', value: moneyText(m.ev, cur) },
  ]);
  w.kpis([
    { label: 'Actual cost (AC)', value: moneyText(m.ac, cur) },
    { label: 'Cost performance index (CPI)', value: indexText(m.cpi) },
    { label: 'Schedule performance index (SPI)', value: indexText(m.spi) },
  ]);
  w.bullets([e.cpiText ?? '', e.spiText ?? ''].filter(Boolean));
  if (e.caution) w.text(e.caution, { size: 9, bold: true, color: rgb(0.706, 0.325, 0.035) });
  w.h3('Measures at the status date');
  w.table(['Measure', 'Value'], evmMeasures(e), [55, 45]);
  w.h3('Forecasts at completion');
  w.table(['Method', 'How it is calculated', 'Estimate at completion (EAC)', 'Estimate to complete (ETC)', 'Variance at completion (VAC)'], e.forecasts.map((f) => [f.label, f.formula, moneyText(f.eac, cur), moneyText(f.etc, cur), moneyText(f.vac, cur)]), [16, 33, 17, 17, 17]);
  w.h3('By task');
  if (e.tasks.length) {
    w.muted(`Amounts in ${cur ?? 'no currency'}. n/a: not available (for example, no actual cost is recorded for the task).`);
    w.table(
      ['ID', 'Task', 'Earning method', 'BAC', 'PV', 'EV', 'AC', 'CV', 'SV'],
      e.tasks.map((t) => [t.key ?? '-', t.name, t.methodLabel, amountText(t.bac, cur), amountText(t.pv, cur), amountText(t.ev, cur), amountText(t.ac, cur), amountText(t.cv, cur), amountText(t.sv, cur)]),
      [47, 90, 60, 51, 51, 51, 51, 51, 51],
      DENSE,
    );
  } else w.muted('No task in the baseline has a budget.');
  w.h3('Trend');
  if (e.trend.length) {
    w.muted(`${e.trend.length < e.trendPoints ? `The latest ${e.trend.length} of ${e.trendPoints} points. ` : ''}Cumulative values at each date, in ${cur ?? 'no currency'}.`);
    w.table(['Date', 'PV', 'EV', 'AC', 'CPI', 'SPI'], e.trend.map((p) => [p.date, amountText(p.pv, cur), amountText(p.ev, cur), amountText(p.ac, cur), indexText(p.cpi, 'n/a'), indexText(p.spi, 'n/a')]), [18, 19, 19, 19, 12, 13]);
  } else w.muted('No trend yet: the status date is before the baseline start.');
  w.h3('Warnings');
  if (e.warnings.length) w.bullets(e.warnings);
  else w.muted('None.');
  w.h3('Definitions');
  w.table(['Term', 'Definition'], Object.entries(e.definitions), [12, 88]);
}

export async function renderReportPdf(r: ReportData): Promise<Uint8Array> {
  const w = await Writer.create();
  const tz = r.meta.period.timezone;
  const has = (s: ReportSection) => r.meta.sections.includes(s);
  const c = r.summary.commentary;
  w.doc.setTitle(pdfSafe(r.meta.title));
  w.doc.setAuthor('BIZOMAT Project Management');
  w.doc.setSubject(pdfSafe(`${r.meta.typeLabel} - ${r.meta.period.label}`));
  w.doc.setCreator('BIZOMAT Project Management');
  w.doc.setProducer('BIZOMAT Project Management');
  w.doc.setCreationDate(new Date(r.meta.generatedAt));
  w.doc.setModificationDate(new Date(r.meta.generatedAt));

  // Cover.
  w.newPage();
  if (has('cover')) {
    const p = w.page;
    p.drawRectangle({ x: 0, y: A4[1] - 150, width: A4[0], height: 150, color: NAVY });
    p.drawText('BIZOMAT', { x: M.left, y: A4[1] - 80, size: 30, font: w.bold, color: rgb(1, 1, 1) });
    p.drawRectangle({ x: M.left + w.bold.widthOfTextAtSize('BIZOMAT', 30) + 6, y: A4[1] - 80, width: 9, height: 9, color: rgb(0.078, 0.722, 0.651) });
    p.drawText('Project Management', { x: M.left, y: A4[1] - 104, size: 12, font: w.font, color: rgb(0.8, 0.84, 0.88) });
    w.y = A4[1] - 210;
    w.text(r.meta.typeLabel.toUpperCase(), { size: 10, bold: true, color: TEAL, gap: 6 });
    w.text(r.meta.projectName, { size: 24, bold: true, color: NAVY, gap: 4 });
    w.text(r.meta.organisation, { size: 13, color: SLATE, gap: 22 });
    const kv: [string, string][] = [
      ['Organisation', r.meta.organisation],
      ['Project', r.meta.projectName],
      ['Project manager', r.meta.projectManager ?? 'Not recorded'],
      ['Project start date', r.meta.projectStart],
      ['Reporting period', `${r.meta.period.label} (${tz})`],
      ['Report generated', `${fmtTime(r.meta.generatedAt, tz)} by ${r.meta.generatedBy}`],
      ['Report version', r.meta.reportVersion ? `Version ${r.meta.reportVersion}` : 'Draft preview (not saved)'],
    ];
    if (r.meta.confidentiality) kv.push(['Classification', r.meta.confidentiality]);
    w.table(['Item', 'Detail'], kv.map(([a, b]) => [a, b]), [30, 70]);
    w.newPage();
  }

  if (has('summary')) {
    w.h2(SECTION_LABELS.summary);
    w.kpis([
      { label: 'Overall status (calculated)', value: r.summary.status.label },
      { label: 'Completion', value: `${r.summary.completion.percent}%` },
      { label: 'Tasks done', value: `${r.summary.completion.done} of ${r.summary.completion.total}` },
      { label: 'Overdue', value: String(r.overview.overdue) },
    ]);
    w.muted(r.summary.status.rule);
    if (c.statusAssessment) w.commentary(`Status assessment: ${STATUS_LABELS[c.statusAssessment]}`, c.author);
    w.commentary(c.summary, c.author);
    w.h3('Key achievements');
    if (r.summary.achievements.length) w.bullets(r.summary.achievements.map((a) => `${a} (completed)`));
    else w.muted('No task was recorded as completed in this period.');
    w.commentary(c.achievements, c.author);
    w.h3('Important developments');
    if (r.summary.developments.length) w.bullets(r.summary.developments);
    else w.muted('No new, started, reassigned or reopened tasks were recorded.');
    w.h3('Current problems');
    if (r.summary.problems.length) w.bullets(r.summary.problems);
    else w.muted('No overdue, blocked or waiting tasks were recorded at the end of the period.');
    w.commentary(c.problems, c.author);
    w.h3('Decisions required from management');
    if (r.summary.decisions.length) w.bullets(r.summary.decisions);
    else w.muted('No task was waiting for an approval or review.');
    w.commentary(c.decisions, c.author);
  }

  if (has('overview')) {
    const o = r.overview;
    w.h2(SECTION_LABELS.overview);
    w.kpis([
      { label: 'Total tasks', value: String(o.total) },
      { label: 'Completed', value: String(o.completed) },
      { label: 'In progress', value: String(o.inProgress) },
      { label: 'Not started', value: String(o.notStarted) },
      { label: 'Blocked', value: String(o.blocked) },
      { label: 'Overdue', value: String(o.overdue) },
    ]);
    if (o.hasStatusColumn)
      w.bars([
        { label: 'Completed', value: o.completed, color: rgb(0.082, 0.502, 0.239) },
        { label: 'In progress', value: o.inProgress, color: TEAL },
        { label: 'Pending approval', value: o.pendingApproval, color: rgb(0.486, 0.227, 0.929) },
        { label: 'Blocked', value: o.blocked, color: rgb(0.725, 0.11, 0.11) },
        { label: 'Not started', value: o.notStarted, color: rgb(0.58, 0.639, 0.722) },
      ]);
    w.text(`Completion: ${o.percent}% of ${o.total} top-level tasks${o.subitems.total ? `; subitems: ${o.subitems.done} of ${o.subitems.total} done` : ''}.`, { size: 9.5 });
    w.h3('Milestones');
    tasks(w, o.milestones, 'No milestones are recorded on this board.');
  }

  if (has('previous')) {
    const p = r.previous;
    w.h2(SECTION_LABELS.previous);
    w.muted(`${r.meta.period.label}. ${p.updatedCount} task(s) had recorded changes in this period.`);
    w.h3('Tasks completed');
    tasks(w, p.completed, 'None recorded.');
    w.h3('Tasks started');
    tasks(w, p.started, 'None recorded.');
    w.h3('New tasks');
    tasks(w, p.created, 'None recorded.');
    w.h3('Tasks reassigned');
    tasks(w, p.reassigned, 'None recorded.');
    if (p.reopened.length) {
      w.h3('Tasks reopened');
      tasks(w, p.reopened, '');
    }
    w.h3('Milestones achieved');
    tasks(w, p.milestones, 'None recorded.');
    w.h3('Important comments and decisions');
    if (p.comments.length) w.table(['Date', 'Author', 'Task', 'Comment'], p.comments.map((x) => [fmtDay(x.at, tz), x.author, x.task, x.text]), [14, 16, 22, 48]);
    else w.muted('No comments were posted in this period.');
  }

  if (has('current')) {
    w.h2(SECTION_LABELS.current);
    w.muted('Tasks in progress, blocked or awaiting approval at the end of the period.');
    tasks(w, r.current.active, 'No task was in progress at the end of the period.');
  }

  if (has('remaining')) {
    const m = r.remaining;
    w.h2(SECTION_LABELS.remaining);
    w.kpis([
      { label: 'Outstanding', value: String(m.outstanding.length) },
      { label: 'Overdue', value: String(m.overdue.length) },
      { label: 'Blocked', value: String(m.blocked.length) },
      { label: 'Carried forward', value: String(m.carriedForward.length) },
      { label: 'Unassigned', value: String(m.unassigned) },
    ]);
    w.h3('Overdue tasks');
    tasks(w, m.overdue, 'No open task is overdue.');
    w.h3('Blockers');
    tasks(w, m.blocked, 'No task is blocked.');
    w.h3('Pending approvals');
    tasks(w, m.pendingApprovals, 'No task is awaiting approval.');
    w.h3('Carried forward from before the period');
    tasks(w, m.carriedForward, 'None.');
    w.h3('All outstanding tasks');
    tasks(w, m.outstanding, 'Every task is complete.');
  }

  if (has('risks')) {
    w.h2(SECTION_LABELS.risks);
    w.muted(r.risks.note);
    if (r.risks.recorded.length) {
      w.h3('Recorded risks and issues');
      risks(w, r.risks.recorded);
    }
    w.h3('Issues derived from task states');
    if (r.risks.derived.length) risks(w, r.risks.derived);
    else w.muted('None: no open task is blocked, overdue, waiting on another task or awaiting approval.');
  }

  if (has('finance') && r.finance) {
    const f = r.finance;
    const fig = (x: { display: string } | null) => (x ? x.display : '-');
    w.h2(SECTION_LABELS.finance);
    w.muted(`${f.note} As recorded on ${f.asOf}.`);
    if (f.byRole.length)
      w.table(
        ['Currency', 'Approved budget', 'Estimated cost (estimate)', 'Actual cost (actual)', 'Committed', 'Remaining budget', 'Variance', 'Utilisation'],
        f.byRole.map((b) => [b.currency ?? 'Not set', fig(b.approvedBudget), fig(b.estimatedCost), fig(b.actualCost), fig(b.committed), fig(b.remaining), fig(b.variance), b.utilisation ? `${b.utilisation}%` : '-']),
        [9, 14, 14, 13, 12, 14, 13, 11],
      );
    else w.muted('No column has a finance role, so remaining budget and variance cannot be calculated. Column totals follow.');
    w.h3('By column');
    w.table(['Column', 'Finance role', 'Currency', 'Total', 'Tasks'], f.columns.map((col) => [col.title, col.roleLabel ?? 'Not set', `${col.currency ?? 'Not set'}${col.currencyConfirmed ? '' : ' (unconfirmed)'}`, col.total.display, String(col.count)]), [26, 20, 18, 24, 12]);
    if (f.mixedCurrencies) w.text('This project uses more than one currency. Totals are shown per currency and are not added together.', { size: 9 });
    w.h3('By group');
    w.table(['Group', ...f.columns.map((col) => col.title)], f.groups.map((g) => [g.name, ...g.totals.map((t) => (t.count ? t.total.display : '-'))]), [24, ...f.columns.map(() => 76 / Math.max(1, f.columns.length))]);
    w.h3('By task');
    if (f.tasks.length) w.table(['ID', 'Task', ...f.columns.map((col) => col.title)], f.tasks.slice(0, 300).map((t) => [t.key ?? '-', t.name, ...f.columns.map((col) => t.amounts.find((a) => a.columnId === col.columnId)?.amount.display ?? '-')]), [11, 25, ...f.columns.map(() => 64 / Math.max(1, f.columns.length))]);
    else w.muted('No task has an amount.');
    if (f.changes.length) {
      w.h3('Financial changes recorded in the period');
      w.table(['Date', 'Task', 'Column', 'Before', 'After', 'By'], f.changes.map((x) => [fmtDay(x.at, tz), x.task, x.column, x.before, x.after, x.actor ?? '-']), [13, 25, 15, 15, 15, 17]);
    }
  }

  if (has('next')) {
    const n = r.next;
    w.h2(SECTION_LABELS.next);
    w.muted(`${n.start} to ${n.end}: open tasks due or starting in this window.`);
    w.h3('Planned tasks');
    tasks(w, n.planned, 'No open task is due or starts in the next period.');
    w.h3('Upcoming milestones');
    tasks(w, n.milestones, 'None.');
    w.h3('Key priorities (critical and high priority open tasks)');
    tasks(w, n.priorities, 'None.');
    w.commentary(c.nextPriorities, c.author);
    w.h3('Resource requirements (open tasks per person)');
    if (n.workload.length) w.table(['Person', 'Open tasks', 'Of which overdue'], n.workload.map((x) => [x.owner, String(x.open), String(x.overdue)]), [50, 25, 25]);
    else w.muted('No open tasks.');
    if (n.unscheduled) w.text(`${n.unscheduled} open task(s) have no date.`, { size: 9 });
    w.commentary(c.resources, c.author);
  }

  if (has('timeline')) {
    w.h2(SECTION_LABELS.timeline);
    if (r.timeline.events.length) w.table(['Date and time', 'Event', 'By'], r.timeline.events.map((e) => [fmtTime(e.at, tz), e.text, e.actor ?? '-']), [22, 58, 20]);
    else w.muted('No significant events were recorded in this period.');
  }

  if (has('categories') && r.categories) categories(w, r.categories);
  if (has('schedule') && r.schedule) scheduleSection(w, r.schedule);
  if (has('baseline') && r.baseline) baselineSection(w, r.baseline);
  if (has('evm') && r.evm) evmSection(w, r.evm);

  w.h2('About this report');
  w.text(
    `Every figure, task and date comes from the activity recorded in BIZOMAT Project Management. Past statuses are taken from the recorded history of changes, not inferred from today's values. ${r.history.reliableFrom ? `Reliable activity history for this board is available from ${fmtDay(r.history.reliableFrom, tz)}.` : 'No activity has been recorded on this board.'}`,
    { size: 9 },
  );
  const notes = [...r.history.notes, ...r.truncated];
  if (notes.length) w.bullets(notes);

  // Footer on every page.
  const pages = w.doc.getPages();
  const left = pdfSafe(`${r.meta.projectName} - ${r.meta.period.label}`).slice(0, 90);
  const right = pdfSafe(`${r.meta.confidentiality ? `${r.meta.confidentiality} - ` : ''}Generated ${fmtDay(r.meta.generatedAt, tz)}`);
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M.left, y: 40 }, end: { x: A4[0] - M.right, y: 40 }, thickness: 0.5, color: LINE });
    p.drawText(left, { x: M.left, y: 28, size: 7.5, font: w.font, color: SLATE });
    const label = `Page ${i + 1} of ${pages.length}`;
    p.drawText(label, { x: A4[0] - M.right - w.font.widthOfTextAtSize(label, 7.5), y: 28, size: 7.5, font: w.font, color: SLATE });
    p.drawText(right, { x: M.left, y: 18, size: 7, font: w.font, color: SLATE });
  });
  return w.doc.save({ useObjectStreams: true });
}
