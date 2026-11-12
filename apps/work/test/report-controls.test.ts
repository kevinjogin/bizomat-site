// Project controls in project reports: sections L (Schedule and critical path), M (Baseline comparison) and N (Earned
// value and forecasts), the report types built on them, their finance gating, and every export format. The numbers
// must be the live project controls numbers at the same status date (GET /schedule, /baselines/compare, /evm).

import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { strFromU8, unzipSync } from 'fflate';
import { PDFDocument } from 'pdf-lib';
import { addMember, createBoard, signup, type Client } from './helpers';
import { DEFAULT_SECTIONS, REPORT_SECTIONS, REPORT_TYPES, REPORT_TYPE_LABELS, SECTION_LABELS, type ReportType } from '../src/shared/reports';

const STATUS = '2026-11-06';

/**
 * A small project on the standard calendar (Monday to Friday, 8 hours):
 * A (2-4 Nov) -> B (5-10 Nov) -> D (11-17 Nov) -> Handover (milestone), and A -> C (5-6 Nov) -> D with one day of lag.
 * Budgets 30,000 / 40,000 / 10,000 / 20,000 AUD. Baseline 0 is approved; B, D and the handover are then re-planned a day
 * later and baseline 1 approved; then D slips by two more days. A is finished, B half done; costs are recorded on dated entries.
 */
async function controlsProject(owner: Client) {
  const b = await createBoard(owner, 'Laser installation');
  const boardId = b.board.id as string;
  const groupId = b.groups[0].id as string;
  const tl = await owner.json('POST', `/api/boards/${boardId}/columns`, { title: 'Plan', type: 'timeline' });
  await owner.json('PATCH', `/api/boards/${boardId}/project`, { currency: 'AUD' });
  const budget = await owner.json('POST', `/api/boards/${boardId}/columns`, { title: 'Budget', type: 'currency', settings: { currencyMode: 'inherit', financeRole: 'approved_budget' } });
  const add = async (name: string, start: string, end: string, cost?: number) =>
    (await owner.json('POST', `/api/boards/${boardId}/items`, { name, groupId, values: { [tl.id]: { start, end }, ...(cost != null ? { [budget.id]: cost } : {}) } })) as { id: string; key: string };
  const A = await add('Site preparation', '2026-11-02', '2026-11-04', 30000);
  const B = await add('Machine installation', '2026-11-05', '2026-11-10', 40000);
  const C = await add('Compressed air', '2026-11-05', '2026-11-06', 10000);
  const D = await add('Commissioning', '2026-11-11', '2026-11-17', 20000);
  const M = await add('Handover', '2026-11-18', '2026-11-18');
  await owner.json('PATCH', `/api/items/${M.id}/schedule`, { milestone: true });
  const link = (from: { id: string }, to: { id: string }, extra: Record<string, unknown> = {}) => owner.json('POST', `/api/boards/${boardId}/links`, { predecessorId: from.id, successorId: to.id, ...extra });
  await link(A, B);
  await link(A, C);
  await link(B, D);
  await link(C, D, { type: 'FS', lag: 1, lagUnit: 'days' });
  await link(D, M);
  await owner.json('POST', `/api/boards/${boardId}/baselines`, { name: 'Original', approvedBy: 'Project sponsor', approvedOn: '2026-10-30' });
  const plan = (task: { id: string }, start: string, end: string) => owner.json('PATCH', `/api/items/${task.id}`, { values: { [tl.id]: { start, end } } });
  await plan(B, '2026-11-05', '2026-11-11');
  await plan(D, '2026-11-12', '2026-11-18');
  await plan(M, '2026-11-19', '2026-11-19');
  await owner.json('POST', `/api/boards/${boardId}/baselines`, { name: 'Recovery plan', approvedBy: 'Project sponsor', approvedOn: '2026-11-03', reason: 'Late delivery of the machine' });
  await plan(D, '2026-11-12', '2026-11-20');
  // Progress and actual cost, dated.
  await owner.json('PATCH', `/api/items/${A.id}/schedule`, { actualStart: '2026-11-02', actualFinish: '2026-11-04' });
  await owner.json('POST', `/api/items/${A.id}/progress`, { asOf: '2026-11-04', percentComplete: 100 });
  await owner.json('PATCH', `/api/items/${B.id}/schedule`, { actualStart: '2026-11-05' });
  await owner.json('POST', `/api/items/${B.id}/progress`, { asOf: '2026-11-06', percentComplete: 50 });
  await owner.json('POST', `/api/items/${A.id}/costs`, { spentOn: '2026-11-04', amount: '31500', category: 'Labour' });
  await owner.json('POST', `/api/items/${B.id}/costs`, { spentOn: '2026-11-06', amount: '18000', category: 'Materials' });
  await owner.json('POST', `/api/items/${B.id}/costs`, { spentOn: '2026-11-10', amount: '9000', category: 'Labour' });
  return { boardId, groupId, tl, budget, A, B, C, D, M };
}

const controlsOptions = { type: 'project_controls', end: STATUS, timezone: 'UTC' };

describe('report definitions', () => {
  it('adds sections L to N after K and the project controls report types, leaving the existing types unchanged', () => {
    expect(REPORT_SECTIONS.slice(-4)).toEqual(['categories', 'schedule', 'baseline', 'evm']);
    expect([SECTION_LABELS.schedule, SECTION_LABELS.baseline, SECTION_LABELS.evm]).toEqual(['L. Schedule and critical path', 'M. Baseline comparison', 'N. Earned value and forecasts']);
    expect(REPORT_TYPE_LABELS).toMatchObject({
      project_controls: 'Project controls report',
      critical_path: 'Critical path report',
      baseline_comparison: 'Baseline comparison report',
      earned_value: 'Earned value report',
      completion_forecast: 'Project completion forecast',
    });
    expect(DEFAULT_SECTIONS).toMatchObject({
      project_controls: ['cover', 'summary', 'schedule', 'baseline', 'evm'],
      critical_path: ['cover', 'schedule'],
      baseline_comparison: ['cover', 'baseline'],
      earned_value: ['cover', 'evm'],
      completion_forecast: ['cover', 'summary', 'schedule', 'evm'],
    });
    // The existing report types keep exactly the sections they had.
    const before: Record<string, string[]> = {
      inception: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
      previous_month: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
      current_month: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'next', 'categories'],
      custom: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
      monthly: ['cover', 'summary', 'overview', 'previous', 'current', 'remaining', 'risks', 'finance', 'next', 'timeline', 'categories'],
      completion: ['cover', 'summary', 'overview', 'previous', 'remaining', 'risks', 'finance', 'timeline', 'categories'],
      financial: ['cover', 'summary', 'finance'],
      outstanding: ['cover', 'overview', 'current', 'remaining', 'risks', 'next', 'categories'],
    };
    for (const [type, sections] of Object.entries(before)) expect(DEFAULT_SECTIONS[type as ReportType]).toEqual(sections);
    expect(REPORT_TYPES.slice(0, 8)).toEqual(Object.keys(before));
  });
});

describe('project controls report', () => {
  it('reports the live schedule, baseline comparison and earned value at the status date, in every format', async () => {
    const o = await signup('Pat Manager');
    const p = await controlsProject(o);
    const { report, html } = await o.json('POST', `/api/boards/${p.boardId}/reports/preview`, controlsOptions);
    expect(report.meta.sections).toEqual(['cover', 'summary', 'schedule', 'baseline', 'evm']);
    expect(report.meta.period.end).toBe(STATUS);
    expect(report.meta.period.start <= STATUS).toBe(true);

    // L: the same numbers as GET /schedule at the status date.
    const live = await o.json('GET', `/api/boards/${p.boardId}/schedule?statusDate=${STATUS}`);
    const s = report.schedule;
    expect(s.statusDate).toBe(STATUS);
    expect(s).toMatchObject({ projectStart: live.summary.projectStart, projectFinish: live.summary.projectFinish, criticalDurationDays: live.summary.criticalDurationDays, valid: true, counts: live.summary.counts });
    expect(s.projectFinish).toBeTruthy();
    const keyOf = (id: string) => live.tasks.find((t: any) => t.itemId === id).key;
    expect(s.criticalPaths).toEqual(live.summary.criticalPaths.map((path: string[]) => path.map(keyOf)));
    expect(s.criticalPaths[0]).toEqual(expect.arrayContaining([p.B.key, p.D.key, p.M.key]));
    expect(s.tasks).toHaveLength(live.tasks.length);
    for (const t of live.tasks) {
      const { itemId, key, wbs, name, plannedStart, plannedFinish, earlyStart, earlyFinish, lateStart, lateFinish, durationDays, totalFloatDays, freeFloatDays, criticality, actualStart, actualFinish, percentComplete, milestone, summary } = t;
      expect(s.tasks.find((x: any) => x.itemId === t.itemId)).toMatchObject({ itemId, key, wbs, name, plannedStart, plannedFinish, earlyStart, earlyFinish, lateStart, lateFinish, durationDays, totalFloatDays, freeFloatDays, criticality, actualStart, actualFinish, percentComplete, milestone, summary });
    }
    const row = (id: string) => s.tasks.find((x: any) => x.itemId === id);
    expect(row(p.D.id).predecessors).toEqual([`${p.B.key} FS`, `${p.C.key} FS+1d`]);
    expect(row(p.A.id).successors).toEqual([`${p.B.key} FS`, `${p.C.key} FS`]);
    expect(s.dependencies).toHaveLength(live.links.length);
    for (const l of live.links) {
      expect(s.dependencies.find((d: any) => d.linkId === l.id)).toMatchObject({ predecessorKey: keyOf(l.predecessorId), successorKey: keyOf(l.successorId), type: l.type, floatDays: l.floatDays, critical: l.critical });
    }
    expect(s.dependencies.find((d: any) => d.successorKey === p.D.key && d.predecessorKey === p.C.key)).toMatchObject({ lag: '+1d', lagDays: 1, typeLabel: 'Finish to start' });
    expect(s.nearCritical.map((t: any) => t.key).sort()).toEqual(live.tasks.filter((t: any) => !t.summary && t.criticality === 'near_critical').map((t: any) => t.key).sort());
    expect(s.nearCritical.map((t: any) => t.key)).toContain(p.C.key);
    expect(s.milestones).toEqual([expect.objectContaining({ key: p.M.key, forecastDate: row(p.M.id).earlyFinish, actualDate: null })]);
    expect(s.milestones[0].baselineDate).toBeTruthy();
    expect(s.milestoneBaseline).toEqual({ number: 1, name: 'Recovery plan' });
    expect(s.plannedVsActual.map((t: any) => [t.key, t.state])).toEqual([[p.A.key, 'Finished'], [p.B.key, 'In progress']]);
    expect(s.warnings).toEqual(live.warnings.map((w: any) => w.message));

    // M: the same comparison as GET /baselines/compare (latest baseline, 1; the original, 0, alongside).
    const cmp = await o.json('GET', `/api/boards/${p.boardId}/baselines/compare?statusDate=${STATUS}`);
    const b = report.baseline;
    expect(b.available).toBe(true);
    expect(b.baseline).toMatchObject({ number: 1, name: 'Recovery plan', approvedBy: 'Project sponsor', approvedOn: '2026-11-03', projectFinish: cmp.baseline.projectFinish });
    expect(b.forecastFinish).toBe(cmp.forecastFinish);
    expect(b.projectFinishVarianceDays).toBe(cmp.projectFinishVarianceDays);
    expect(b.projectFinishVarianceDays).toBeGreaterThan(0);
    expect(b.original).toEqual(cmp.original);
    expect(b.original.finishVarianceDays).toBeGreaterThan(b.projectFinishVarianceDays);
    expect(b.rows).toEqual(cmp.rows);
    expect(b.costIncluded).toBe(true);
    expect(b.bac).toBe('100000.0000');

    // N: exactly the metrics of GET /evm at the status date.
    const ev = await o.json('GET', `/api/boards/${p.boardId}/evm?statusDate=${STATUS}`);
    const e = report.evm;
    expect(ev.available).toBe(true);
    expect(e).toMatchObject({ statusDate: STATUS, financeAllowed: true, available: true, currency: 'AUD' });
    expect(e.metrics).toEqual(ev.metrics);
    expect(e.baseline).toEqual({ id: ev.baseline.id, number: 1, name: 'Recovery plan', approvedOn: '2026-11-03', approvedBy: 'Project sponsor' });
    expect(e.tasks.map((t: any) => [t.key, t.bac, t.pv, t.ev, t.ac, t.cv, t.sv])).toEqual(ev.tasks.map((t: any) => [t.key, t.bac, t.pv, t.ev, t.ac, t.cv, t.sv]));
    expect(e.metrics.ac).toBe('49500.00'); // the 10 Nov cost is after the status date
    expect(e.forecasts.map((f: any) => [f.label, f.eac, f.etc, f.vac])).toEqual([
      ['EAC by CPI', ev.metrics.eac.cpi, ev.metrics.etc.cpi, ev.metrics.vac.cpi],
      ['EAC by budget rate', ev.metrics.eac.budget, ev.metrics.etc.budget, ev.metrics.vac.budget],
      ['EAC by CPI x SPI', ev.metrics.eac.cpiSpi, ev.metrics.etc.cpiSpi, ev.metrics.vac.cpiSpi],
    ]);
    expect(e.cpiText).toMatch(ev.metrics.cpiStatus === 'below' ? /^Over budget/ : /^(Under|On) budget/);
    expect(e.spiText).toMatch(ev.metrics.spiStatus === 'below' ? /^Behind plan/ : /^(Ahead of|On) plan/);
    expect(e.trend.at(-1)).toEqual(ev.trend.at(-1));
    expect(e.warnings).toEqual(ev.warnings);
    expect(Object.keys(e.definitions)).toEqual(expect.arrayContaining(['BAC', 'EAC', 'TCPI']));

    // The page shows the sections, task IDs, the formatted links and labelled forecasts.
    for (const text of ['L. Schedule and critical path', 'M. Baseline comparison', 'N. Earned value and forecasts', `${p.C.key} FS+1d`, 'Dependency register', 'EAC by CPI x SPI', 'Baseline 1: Recovery plan', 'AUD 100,000.00']) expect(html).toContain(text);

    // Saved: the snapshot holds the same sections, the report is marked as containing finances, every file downloads.
    const saved = await o.json('POST', `/api/boards/${p.boardId}/reports`, controlsOptions);
    const rec = await env.DB.prepare('SELECT snapshot_key, includes_finance, report_type FROM reports WHERE id = ?').bind(saved.id).first<{ snapshot_key: string; includes_finance: number; report_type: string }>();
    expect(rec).toMatchObject({ includes_finance: 1, report_type: 'project_controls' });
    const snap = JSON.parse(await (await env.FILES.get(rec!.snapshot_key))!.text());
    expect(snap.schedule.tasks).toEqual(s.tasks);
    expect(snap.evm.metrics).toEqual(ev.metrics);
    expect(snap.baseline.rows).toEqual(cmp.rows);
    const list = await o.json('GET', `/api/boards/${p.boardId}/reports`);
    expect(list.reports.find((r: any) => r.id === saved.id)).toMatchObject({ typeLabel: 'Project controls report', includesFinance: true });

    const dl = async (f: string) => {
      const res = await o.req('GET', `/api/reports/${saved.id}/download/${f}`);
      expect(res.status).toBe(200);
      return new Uint8Array(await res.arrayBuffer());
    };
    const pdf = await dl('pdf');
    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe('%PDF-');
    expect((await PDFDocument.load(pdf)).getPageCount()).toBeGreaterThanOrEqual(3);
    const zip = unzipSync(await dl('xlsx'));
    const wb = strFromU8(zip['xl/workbook.xml']);
    for (const name of ['Schedule', 'Dependencies', 'Baseline', 'Earned value']) expect(wb).toContain(`name="${name}"`);
    const sheet = (name: string) => {
      const i = Array.from(wb.matchAll(/<sheet name="([^"]+)"/g)).findIndex((m) => m[1] === name);
      return strFromU8(zip[`xl/worksheets/sheet${i + 1}.xml`]);
    };
    const firstCells = (xml: string) => Array.from(xml.matchAll(/<c r="A(\d+)"[^>]*><is><t[^>]*>([^<]*)<\/t>/g)).map((m) => m[2]);
    expect(firstCells(sheet('Schedule')).slice(0, 2)).toEqual(['Task ID', p.A.key]);
    expect(firstCells(sheet('Dependencies')).slice(0, 2)).toEqual(['Predecessor ID', p.A.key]);
    expect(firstCells(sheet('Baseline'))[0]).toBe('Task ID');
    expect(firstCells(sheet('Earned value')).slice(0, 2)).toEqual(['Task ID', p.A.key]);
    expect(sheet('Earned value')).toContain('49500');
    // The task list holds the tasks that existed at the status date (none here: they were recorded later).
    expect(firstCells(sheet('Tasks'))).toEqual(['Task ID']);
    const savedHtml = new TextDecoder().decode(await dl('html'));
    expect(savedHtml).toContain('N. Earned value and forecasts');
    const csv = new TextDecoder().decode(await dl('csv')).replace(/^\ufeff/, '');
    expect(csv.split('\r\n')[0]).toMatch(/^Task ID,Task,Group,/);
  });

  it('shows earned value only to people who may see finances, and hides reports that contain it from everyone else', async () => {
    const o = await signup('Owner');
    const p = await controlsProject(o);
    const member = await signup('Member');
    await addMember(o, member, 'member');
    await o.json('PUT', `/api/workspaces/${o.workspaceId}/finance`, { visibility: 'managers' });
    await o.json('PUT', `/api/boards/${p.boardId}/access/${member.userId}`, { level: 'edit', overrides: { generateReports: true } });
    expect((await member.req('GET', `/api/boards/${p.boardId}/evm?statusDate=${STATUS}`)).status).toBe(403);

    const { report, html } = await member.json('POST', `/api/boards/${p.boardId}/reports/preview`, controlsOptions);
    expect(report.meta.sections).toContain('evm');
    expect(report.evm).toMatchObject({ financeAllowed: false, available: false, metrics: null, tasks: [], trend: [], forecasts: [], currency: null });
    expect(report.evm.reason).toMatch(/access .* does not include this project's finances/);
    expect(JSON.stringify(report.evm)).not.toMatch(/\d\.\d\d/);
    // The baseline comparison keeps dates and progress but no money.
    expect(report.baseline).toMatchObject({ available: true, costIncluded: false, bac: null, currency: null });
    expect(report.baseline.rows.every((r: any) => r.baselineCost === null && r.currentCost === null && r.costVariance === null)).toBe(true);
    expect(report.baseline.rows.some((r: any) => r.finishVarianceDays !== null)).toBe(true);
    // The schedule is the same for everyone.
    const ownerView = (await o.json('POST', `/api/boards/${p.boardId}/reports/preview`, controlsOptions)).report;
    expect(report.schedule.tasks).toEqual(ownerView.schedule.tasks);
    expect(html).toContain(report.evm.reason.replace(/'/g, '&#39;'));
    expect(html).not.toContain('AUD');
    expect(html).not.toContain('EAC by CPI');

    // The member's own report has no money in it, so it is not marked as financial; the owner's is, and stays hidden.
    const mine = await member.json('POST', `/api/boards/${p.boardId}/reports`, controlsOptions);
    const ownerReport = await o.json('POST', `/api/boards/${p.boardId}/reports`, controlsOptions);
    const list = await member.json('GET', `/api/boards/${p.boardId}/reports`);
    expect(list.reports.map((r: any) => r.id)).toEqual([mine.id]);
    expect(list.reports[0].includesFinance).toBe(false);
    expect(list.hiddenWithFinance).toBe(1);
    expect((await member.req('GET', `/api/reports/${ownerReport.id}/download/pdf`)).status).toBe(403);
    expect((await member.req('GET', `/api/reports/${mine.id}/download/xlsx`)).status).toBe(200);

    // Only the cost part makes a baseline comparison financial; leaving finances out keeps the report open to all.
    const bc = await o.json('POST', `/api/boards/${p.boardId}/reports`, { type: 'baseline_comparison', end: STATUS, timezone: 'UTC' });
    const bcOpen = await o.json('POST', `/api/boards/${p.boardId}/reports`, { type: 'baseline_comparison', end: STATUS, timezone: 'UTC', includeFinance: false });
    const evOpen = (await o.json('POST', `/api/boards/${p.boardId}/reports/preview`, { type: 'earned_value', end: STATUS, timezone: 'UTC', includeFinance: false })).report;
    expect(evOpen.evm).toMatchObject({ financeAllowed: false, metrics: null });
    expect(evOpen.evm.reason).toMatch(/finances were left out/);
    const flags = await env.DB.prepare('SELECT id, includes_finance FROM reports WHERE id IN (?, ?)').bind(bc.id, bcOpen.id).all<{ id: string; includes_finance: number }>();
    expect(Object.fromEntries(flags.results.map((r) => [r.id, r.includes_finance]))).toEqual({ [bc.id]: 1, [bcOpen.id]: 0 });
  });

  it('says why a comparison or earned value is unavailable, and never shows an unavailable figure as zero', async () => {
    const o = await signup('Owner');
    const b = await createBoard(o, 'Pump station');
    const boardId = b.board.id as string;
    const tl = await o.json('POST', `/api/boards/${boardId}/columns`, { title: 'Plan', type: 'timeline' });
    await o.json('PATCH', `/api/boards/${boardId}/project`, { currency: 'AUD' });
    const budget = await o.json('POST', `/api/boards/${boardId}/columns`, { title: 'Budget', type: 'currency', settings: { currencyMode: 'inherit', financeRole: 'approved_budget' } });
    await o.json('POST', `/api/boards/${boardId}/items`, { name: 'Pump', groupId: b.groups[0].id, values: { [tl.id]: { start: '2026-11-02', end: '2026-11-13' }, [budget.id]: 5000 } });

    const none = (await o.json('POST', `/api/boards/${boardId}/reports/preview`, controlsOptions)).report;
    expect(none.baseline).toMatchObject({ available: false, rows: [] });
    expect(none.baseline.reason).toMatch(/no approved baseline/);
    expect(none.evm).toMatchObject({ financeAllowed: true, available: false, metrics: null });
    expect(none.evm.reason).toMatch(/baseline/);
    const unknown = (await o.json('POST', `/api/boards/${boardId}/reports/preview`, { ...controlsOptions, baselineId: 'not-a-baseline' })).report;
    expect(unknown.baseline.reason).toMatch(/selected baseline is not one of/);

    await o.json('POST', `/api/boards/${boardId}/baselines`, { name: 'Original', approvedBy: 'Sponsor', approvedOn: '2026-10-30' });
    const { report, html } = await o.json('POST', `/api/boards/${boardId}/reports/preview`, controlsOptions);
    const ev = await o.json('GET', `/api/boards/${boardId}/evm?statusDate=${STATUS}`);
    expect(report.evm.metrics).toEqual(ev.metrics);
    expect(report.evm.metrics.ac).toBeNull();
    expect(report.evm.metrics.cpi).toBeNull();
    expect(report.evm.cpiText).toMatch(/unavailable: no actual cost/);
    expect(html).toMatch(/Actual cost \(AC\)<\/td><td>Unavailable/);
    expect(html).toMatch(/Cost performance index \(CPI = EV \/ AC\)<\/td><td>Unavailable/);
    expect(html).toContain('<div class="kpi-v">Unavailable</div><div class="kpi-l">AC</div>');
    // Without an end date the status date is today; a future end date is never used.
    const today = new Date().toISOString().slice(0, 10);
    const later = (await o.json('POST', `/api/boards/${boardId}/reports/preview`, { type: 'critical_path', end: '2099-01-01', timezone: 'UTC' })).report;
    expect(later.meta.period.end).toBe(today);
    expect(later.schedule.statusDate).toBe(today);
    expect(later.meta.sections).toEqual(['cover', 'schedule']);
    expect(later.baseline).toBeUndefined();
    expect(later.evm).toBeUndefined();
  });
});

describe('existing reports', () => {
  it('produce the same sections as before, with task IDs in their task lists and no project controls data', async () => {
    const o = await signup('Owner');
    const p = await controlsProject(o);
    for (const type of ['inception', 'current_month', 'custom', 'completion', 'financial', 'outstanding'] as const) {
      const { report } = await o.json('POST', `/api/boards/${p.boardId}/reports/preview`, { type, timezone: 'UTC', includeActivity: true });
      const expected = DEFAULT_SECTIONS[type].filter((s) => s !== 'finance' || report.finance);
      expect(report.meta.sections).toEqual(expected);
      expect(report.schedule).toBeUndefined();
      expect(report.baseline).toBeUndefined();
      expect(report.evm).toBeUndefined();
    }
    const { report, html } = await o.json('POST', `/api/boards/${p.boardId}/reports/preview`, { type: 'inception', timezone: 'UTC' });
    expect(report.tasks.find((t: any) => t.id === p.A.id).key).toBe(p.A.key);
    expect(html).toContain('<th>ID</th><th>Task</th>');
    expect(html).not.toContain('L. Schedule and critical path');
    // Saved: the task ID is the first column of the Excel task sheets and of the CSV.
    const saved = await o.json('POST', `/api/boards/${p.boardId}/reports`, { type: 'inception', timezone: 'UTC' });
    const zip = unzipSync(new Uint8Array(await (await o.req('GET', `/api/reports/${saved.id}/download/xlsx`)).arrayBuffer()));
    const wb = strFromU8(zip['xl/workbook.xml']);
    expect(wb).not.toContain('name="Schedule"');
    const tasksSheet = strFromU8(zip[`xl/worksheets/sheet${Array.from(wb.matchAll(/<sheet name="([^"]+)"/g)).findIndex((m) => m[1] === 'Tasks') + 1}.xml`]);
    expect(tasksSheet).toMatch(/<c r="A1"[^>]*><is><t[^>]*>Task ID<\/t>/);
    expect(tasksSheet).toMatch(/<c r="A2"[^>]*><is><t[^>]*>LASER-\d{4}<\/t>/);
    const csv = (await (await o.req('GET', `/api/reports/${saved.id}/download/csv`)).text()).replace(/^\ufeff/, '').split('\r\n');
    expect(csv[0]).toMatch(/^Task ID,Task,Group,Status,/);
    expect(csv[0]).toMatch(/,Category description$/);
    expect(csv.slice(1, 6).every((l) => /^LASER-\d{4},/.test(l))).toBe(true);
    // The new sections can still be added to an existing type by choice.
    const chosen = (await o.json('POST', `/api/boards/${p.boardId}/reports/preview`, { type: 'monthly', month: '2026-11', timezone: 'UTC', sections: ['cover', 'schedule'] })).report;
    expect(chosen.meta.sections).toEqual(['cover', 'schedule']);
    expect(chosen.schedule.statusDate).toBe(chosen.meta.period.end);
  });
});
