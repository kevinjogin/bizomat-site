// The report as one self-contained, print-ready HTML page (white background, navy headings, A4 print rules). The
// in-app preview shows exactly this page, so what people preview is what they export.

import { SECTION_LABELS, STATUS_LABELS, type ReportSection } from '../../../shared/reports';
import type { ReportData, RiskRow, TaskRow } from './build';

const NAVY = '#0a1f33';
const TEAL = '#0f766e';

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);
}

export function fmtTime(ms: number, tz: string): string {
  try {
    return new Date(ms).toLocaleString('en-AU', { timeZone: tz, day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return new Date(ms).toISOString().replace('T', ' ').slice(0, 16);
  }
}

export function fmtDay(ms: number, tz: string): string {
  try {
    return new Date(ms).toLocaleDateString('en-AU', { timeZone: tz, day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return new Date(ms).toISOString().slice(0, 10);
  }
}

function taskTable(rows: TaskRow[], empty: string, opts: { status?: boolean; desc?: boolean } = {}): string {
  if (!rows.length) return `<p class="muted">${esc(empty)}</p>`;
  return `<table><thead><tr><th>Task</th><th>Group</th>${opts.status !== false ? '<th>Status</th>' : ''}<th>Owner</th><th>Priority</th><th>Due</th></tr></thead><tbody>${rows
    .map(
      (r) =>
        `<tr><td>${esc(r.name)}${opts.desc && r.description ? `<div class="desc">${esc(r.description)}</div>` : ''}</td><td>${esc(r.group)}</td>${opts.status !== false ? `<td><span class="pill ${r.statusClass}">${esc(r.status || '-')}</span></td>` : ''}<td>${esc(r.owners.join(', ') || 'Unassigned')}</td><td>${esc(r.priority ?? '-')}</td><td class="${r.overdue ? 'late' : ''}">${esc(r.due ?? '-')}${r.overdue ? ' (overdue)' : ''}</td></tr>`,
    )
    .join('')}</tbody></table>`;
}

function riskTable(rows: RiskRow[]): string {
  return `<table><thead><tr><th>Type</th><th>Task</th><th>Detail</th><th>Impact</th><th>Responsible</th><th>Suggested action</th></tr></thead><tbody>${rows
    .map((r) => `<tr><td>${esc(r.kind)}</td><td>${esc(r.task)}</td><td>${esc(r.detail)}</td><td>${esc(r.impact)}</td><td>${esc(r.owners.join(', ') || 'Unassigned')}</td><td class="muted">${esc(r.suggestedAction)}</td></tr>`)
    .join('')}</tbody></table>`;
}

function kpi(label: string, value: string | number, tone = ''): string {
  return `<div class="kpi ${tone}"><div class="kpi-v">${esc(value)}</div><div class="kpi-l">${esc(label)}</div></div>`;
}

function bars(items: { label: string; value: number; color: string }[]): string {
  const max = Math.max(1, ...items.map((i) => i.value));
  const w = 520;
  const rowH = 26;
  return `<svg class="chart" viewBox="0 0 ${w + 160} ${items.length * rowH + 4}" role="img" aria-label="Task status breakdown">${items
    .map(
      (i, k) =>
        `<text x="0" y="${k * rowH + 17}" font-size="12" fill="#334155">${esc(i.label)}</text><rect x="130" y="${k * rowH + 5}" width="${Math.max(2, (i.value / max) * w)}" height="16" rx="3" fill="${i.color}"/><text x="${136 + (i.value / max) * w}" y="${k * rowH + 17}" font-size="12" fill="#0a1f33">${i.value}</text>`,
    )
    .join('')}</svg>`;
}

function commentaryBlock(text: string | undefined, author: string): string {
  if (!text?.trim()) return '';
  return `<div class="commentary"><div class="commentary-h">Management commentary, entered by ${esc(author)} (not derived from recorded data)</div><p>${esc(text.trim()).replace(/\n/g, '<br>')}</p></div>`;
}

export function renderReportHtml(r: ReportData): string {
  const tz = r.meta.period.timezone;
  const has = (s: ReportSection) => r.meta.sections.includes(s);
  const c = r.summary.commentary;
  const parts: string[] = [];
  const statusTone = r.summary.status.calculated === 'off_track' ? 'red' : r.summary.status.calculated === 'at_risk' ? 'amber' : r.summary.status.calculated === 'complete' || r.summary.status.calculated === 'on_track' ? 'green' : '';
  if (has('cover')) {
    parts.push(`<section class="cover">
<div class="brand">BIZOMAT<span class="dot"></span><span class="sub">Project Management</span></div>
<div class="cover-body">
<div class="eyebrow">${esc(r.meta.typeLabel)}</div>
<h1>${esc(r.meta.projectName)}</h1>
<p class="lead">${esc(r.meta.organisation)}</p>
<table class="kv">
<tr><th>Organisation</th><td>${esc(r.meta.organisation)}</td></tr>
<tr><th>Project</th><td>${esc(r.meta.projectName)}</td></tr>
<tr><th>Project manager</th><td>${esc(r.meta.projectManager ?? 'Not recorded')}</td></tr>
<tr><th>Project start date</th><td>${esc(r.meta.projectStart)}</td></tr>
<tr><th>Reporting period</th><td>${esc(r.meta.period.label)} (${esc(tz)})</td></tr>
<tr><th>Report generated</th><td>${esc(fmtTime(r.meta.generatedAt, tz))} by ${esc(r.meta.generatedBy)}</td></tr>
<tr><th>Report version</th><td>${r.meta.reportVersion ? `Version ${r.meta.reportVersion}` : 'Draft preview (not saved)'}</td></tr>
${r.meta.confidentiality ? `<tr><th>Classification</th><td>${esc(r.meta.confidentiality)}</td></tr>` : ''}
</table>
</div></section>`);
  }
  if (has('summary')) {
    parts.push(`<section><h2>${SECTION_LABELS.summary}</h2>
<div class="kpis">${kpi('Overall status (calculated)', r.summary.status.label, statusTone)}${kpi('Completion', `${r.summary.completion.percent}%`)}${kpi('Tasks done', `${r.summary.completion.done} of ${r.summary.completion.total}`)}${kpi('Overdue', r.overview.overdue, r.overview.overdue ? 'red' : '')}</div>
<p class="muted small">${esc(r.summary.status.rule)}</p>
${c.statusAssessment ? `<div class="commentary"><div class="commentary-h">Status assessment by ${esc(c.author)} (management judgement)</div><p><strong>${esc(STATUS_LABELS[c.statusAssessment])}</strong></p></div>` : ''}
${commentaryBlock(c.summary, c.author)}
<h3>Key achievements</h3>${r.summary.achievements.length ? `<ul>${r.summary.achievements.map((a) => `<li>${esc(a)} (completed)</li>`).join('')}</ul>` : '<p class="muted">No task was recorded as completed in this period.</p>'}
${commentaryBlock(c.achievements, c.author)}
<h3>Important developments</h3>${r.summary.developments.length ? `<ul>${r.summary.developments.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : '<p class="muted">No new, started, reassigned or reopened tasks were recorded.</p>'}
<h3>Current problems</h3>${r.summary.problems.length ? `<ul>${r.summary.problems.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : '<p class="muted">No overdue, blocked or waiting tasks were recorded at the end of the period.</p>'}
${commentaryBlock(c.problems, c.author)}
<h3>Decisions required from management</h3>${r.summary.decisions.length ? `<ul>${r.summary.decisions.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : '<p class="muted">No task was waiting for an approval or review.</p>'}
${commentaryBlock(c.decisions, c.author)}
</section>`);
  }
  if (has('overview')) {
    const o = r.overview;
    parts.push(`<section><h2>${SECTION_LABELS.overview}</h2>
<div class="kpis">${kpi('Total tasks', o.total)}${kpi('Completed', o.completed, 'green')}${kpi('In progress', o.inProgress)}${kpi('Not started', o.notStarted)}${kpi('Blocked', o.blocked, o.blocked ? 'red' : '')}${kpi('Overdue', o.overdue, o.overdue ? 'red' : '')}</div>
${o.hasStatusColumn ? bars([
      { label: 'Completed', value: o.completed, color: '#15803d' },
      { label: 'In progress', value: o.inProgress, color: TEAL },
      { label: 'Pending approval', value: o.pendingApproval, color: '#7c3aed' },
      { label: 'Blocked', value: o.blocked, color: '#b91c1c' },
      { label: 'Not started', value: o.notStarted, color: '#94a3b8' },
    ]) : ''}
<p>Completion: <strong>${o.percent}%</strong> of ${o.total} top-level tasks${o.subitems.total ? `; subitems: ${o.subitems.done} of ${o.subitems.total} done` : ''}.</p>
<h3>Milestones</h3>${taskTable(o.milestones, 'No milestones are recorded on this board (a task with the same start and end date, or named Milestone).')}
</section>`);
  }
  if (has('previous')) {
    const p = r.previous;
    parts.push(`<section><h2>${SECTION_LABELS.previous}</h2>
<p class="muted">${esc(r.meta.period.label)}. ${p.updatedCount} task(s) had recorded changes in this period.</p>
<h3>Tasks completed</h3>${taskTable(p.completed, 'None recorded.')}
<h3>Tasks started</h3>${taskTable(p.started, 'None recorded.')}
<h3>New tasks</h3>${taskTable(p.created, 'None recorded.')}
<h3>Tasks reassigned</h3>${taskTable(p.reassigned, 'None recorded.')}
${p.reopened.length ? `<h3>Tasks reopened</h3>${taskTable(p.reopened, '')}` : ''}
<h3>Milestones achieved</h3>${taskTable(p.milestones, 'None recorded.')}
<h3>Important comments and decisions</h3>${p.comments.length ? `<table><thead><tr><th>Date</th><th>Author</th><th>Task</th><th>Comment</th></tr></thead><tbody>${p.comments.map((x) => `<tr><td>${esc(fmtDay(x.at, tz))}</td><td>${esc(x.author)}</td><td>${esc(x.task)}</td><td>${esc(x.text)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No comments were posted in this period.</p>'}
</section>`);
  }
  if (has('current')) {
    parts.push(`<section><h2>${SECTION_LABELS.current}</h2><p class="muted">Tasks in progress, blocked or awaiting approval at the end of the period.</p>${taskTable(r.current.active, 'No task was in progress at the end of the period.', { desc: true })}</section>`);
  }
  if (has('remaining')) {
    const m = r.remaining;
    parts.push(`<section><h2>${SECTION_LABELS.remaining}</h2>
<div class="kpis">${kpi('Outstanding', m.outstanding.length)}${kpi('Overdue', m.overdue.length, m.overdue.length ? 'red' : '')}${kpi('Blocked', m.blocked.length, m.blocked.length ? 'red' : '')}${kpi('Carried forward', m.carriedForward.length)}${kpi('Unassigned', m.unassigned, m.unassigned ? 'amber' : '')}</div>
<h3>Overdue tasks</h3>${taskTable(m.overdue, 'No open task is overdue.')}
<h3>Blockers</h3>${taskTable(m.blocked, 'No task is blocked.')}
<h3>Pending approvals</h3>${taskTable(m.pendingApprovals, 'No task is awaiting approval.')}
<h3>Carried forward from before the period</h3>${taskTable(m.carriedForward, 'None.')}
<h3>All outstanding tasks</h3>${taskTable(m.outstanding, 'Every task is complete.')}
</section>`);
  }
  if (has('risks')) {
    parts.push(`<section><h2>${SECTION_LABELS.risks}</h2><p class="muted small">${esc(r.risks.note)}</p>
${r.risks.recorded.length ? `<h3>Recorded risks and issues</h3>${riskTable(r.risks.recorded)}` : ''}
<h3>Issues derived from task states</h3>${r.risks.derived.length ? riskTable(r.risks.derived) : '<p class="muted">None: no open task is blocked, overdue, waiting on another task or awaiting approval.</p>'}
</section>`);
  }
  if (has('finance') && r.finance) {
    const f = r.finance;
    const fig = (x: { display: string } | null) => (x ? esc(x.display) : '-');
    parts.push(`<section><h2>${SECTION_LABELS.finance}</h2>
<p class="muted small">${esc(f.note)} As recorded on ${esc(f.asOf)}.</p>
${f.byRole.length ? `<table><thead><tr><th>Currency</th><th>Approved budget</th><th>Estimated cost</th><th>Actual cost</th><th>Committed</th><th>Remaining budget</th><th>Variance</th><th>Utilisation</th></tr></thead><tbody>${f.byRole
      .map((b) => `<tr><td><strong>${esc(b.currency ?? 'Not set')}</strong></td><td>${fig(b.approvedBudget)}</td><td>${fig(b.estimatedCost)} <span class="tag">estimate</span></td><td>${fig(b.actualCost)} <span class="tag">actual</span></td><td>${fig(b.committed)}</td><td>${fig(b.remaining)}</td><td>${fig(b.variance)}</td><td>${b.utilisation ? `${esc(b.utilisation)}%` : '-'}</td></tr>`)
      .join('')}</tbody></table>` : '<p class="muted">No column has a finance role (approved budget, estimated or actual cost, committed), so remaining budget and variance cannot be calculated. Column totals follow.</p>'}
<h3>By column</h3><table><thead><tr><th>Column</th><th>Finance role</th><th>Currency</th><th>Total</th><th>Tasks with an amount</th></tr></thead><tbody>${f.columns
      .map((col) => `<tr><td>${esc(col.title)}</td><td>${esc(col.roleLabel ?? 'Not set')}</td><td>${esc(col.currency ?? 'Not set')}${col.currencyConfirmed ? '' : ' <span class="tag">unconfirmed</span>'}</td><td><strong>${esc(col.total.display)}</strong></td><td>${col.count}</td></tr>`)
      .join('')}</tbody></table>
${f.mixedCurrencies ? '<p class="small">This project uses more than one currency. Totals are shown per currency and are not added together.</p>' : ''}
<h3>By group</h3><table><thead><tr><th>Group</th>${f.columns.map((col) => `<th>${esc(col.title)}</th>`).join('')}</tr></thead><tbody>${f.groups
      .map((g) => `<tr><td>${esc(g.name)}</td>${g.totals.map((t) => `<td>${t.count ? esc(t.total.display) : '-'}</td>`).join('')}</tr>`)
      .join('')}</tbody></table>
<h3>By task</h3>${f.tasks.length ? `<table><thead><tr><th>Task</th>${f.columns.map((col) => `<th>${esc(col.title)}</th>`).join('')}</tr></thead><tbody>${f.tasks
      .slice(0, 300)
      .map((t) => `<tr><td>${esc(t.name)}</td>${f.columns.map((col) => `<td>${esc(t.amounts.find((a) => a.columnId === col.columnId)?.amount.display ?? '-')}</td>`).join('')}</tr>`)
      .join('')}</tbody></table>` : '<p class="muted">No task has an amount.</p>'}
${f.changes.length ? `<h3>Financial changes recorded in the period</h3><table><thead><tr><th>Date</th><th>Task</th><th>Column</th><th>Before</th><th>After</th><th>By</th></tr></thead><tbody>${f.changes.map((x) => `<tr><td>${esc(fmtDay(x.at, tz))}</td><td>${esc(x.task)}</td><td>${esc(x.column)}</td><td>${esc(x.before)}</td><td>${esc(x.after)}</td><td>${esc(x.actor ?? '-')}</td></tr>`).join('')}</tbody></table>` : ''}
</section>`);
  }
  if (has('next')) {
    const n = r.next;
    parts.push(`<section><h2>${SECTION_LABELS.next}</h2><p class="muted">${esc(n.start)} to ${esc(n.end)}: open tasks due or starting in this window.</p>
<h3>Planned tasks</h3>${taskTable(n.planned, 'No open task is due or starts in the next period.')}
<h3>Upcoming milestones</h3>${taskTable(n.milestones, 'None.')}
<h3>Key priorities (critical and high priority open tasks)</h3>${taskTable(n.priorities, 'None.')}
${commentaryBlock(c.nextPriorities, c.author)}
<h3>Resource requirements (open tasks per person)</h3>${n.workload.length ? `<table><thead><tr><th>Person</th><th>Open tasks</th><th>Of which overdue</th></tr></thead><tbody>${n.workload.map((w) => `<tr><td>${esc(w.owner)}</td><td>${w.open}</td><td>${w.overdue}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No open tasks.</p>'}
${n.unscheduled ? `<p class="small">${n.unscheduled} open task(s) have no date.</p>` : ''}
${commentaryBlock(c.resources, c.author)}
</section>`);
  }
  if (has('timeline')) {
    parts.push(`<section><h2>${SECTION_LABELS.timeline}</h2>${r.timeline.events.length ? `<table><thead><tr><th>Date and time</th><th>Event</th><th>By</th></tr></thead><tbody>${r.timeline.events.map((e) => `<tr><td class="nowrap">${esc(fmtTime(e.at, tz))}</td><td>${esc(e.text)}</td><td>${esc(e.actor ?? '-')}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No significant events were recorded in this period.</p>'}${r.timeline.truncated ? '<p class="small">Only the latest 1,000 events are listed.</p>' : ''}</section>`);
  }
  const notes = [...r.history.notes, ...r.truncated];
  parts.push(`<section class="notes"><h2>About this report</h2>
<p>Every figure, task and date comes from the activity recorded in BIZOMAT Project Management. Past statuses are taken from the recorded history of changes, not inferred from today's values. ${r.history.reliableFrom ? `Reliable activity history for this board is available from ${esc(fmtDay(r.history.reliableFrom, tz))}.` : 'No activity has been recorded on this board.'}</p>
${notes.length ? `<ul>${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
${r.meta.filters.statuses.length || r.meta.filters.owners.length ? `<p class="small">Task lists are filtered${r.meta.filters.statuses.length ? ` to statuses: ${esc(r.meta.filters.statuses.join(', '))}` : ''}${r.meta.filters.owners.length ? ` and owners: ${esc(r.meta.filters.owners.join(', '))}` : ''}. Totals count every task.</p>` : ''}
</section>`);

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(r.meta.title)}</title>
<style>
@page{size:A4;margin:16mm 14mm 18mm}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:#1e293b;font:13px/1.5 "Inter Tight",Inter,"Segoe UI",Helvetica,Arial,sans-serif}
.page{max-width:900px;margin:0 auto;padding:28px}
h1,h2,h3{font-family:Oxanium,"Inter Tight",Helvetica,Arial,sans-serif;color:${NAVY};margin:0}
h1{font-size:30px;margin:6px 0 4px}
h2{font-size:19px;padding-bottom:6px;border-bottom:2px solid ${NAVY};margin:28px 0 12px}
h3{font-size:14px;margin:18px 0 8px}
p{margin:0 0 8px}
.muted{color:#64748b}.small{font-size:11.5px}
table{width:100%;border-collapse:collapse;margin:6px 0 12px;font-size:12px}
th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #e2e8f0;vertical-align:top}
thead th{background:#f1f5f9;color:${NAVY};font-weight:600}
tr{page-break-inside:avoid}
.kv th{width:200px;background:none;color:#475569;font-weight:500}
.cover{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;page-break-after:always}
.brand{background:${NAVY};color:#fff;padding:18px 24px;font:700 20px/1 Oxanium,Helvetica,Arial,sans-serif;letter-spacing:.06em}
.brand .dot{display:inline-block;width:8px;height:8px;background:#14b8a6;border-radius:2px;margin-left:6px}
.brand .sub{display:block;font:400 12px/1.6 "Inter Tight",Helvetica,Arial,sans-serif;color:#cbd5e1;letter-spacing:0;margin-top:4px}
.cover-body{padding:28px 24px}
.eyebrow{color:${TEAL};font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:12px}
.lead{font-size:16px;color:#334155}
.kpis{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0 12px}
.kpi{flex:1 1 120px;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px}
.kpi-v{font:700 20px/1.2 Oxanium,Helvetica,Arial,sans-serif;color:${NAVY}}
.kpi-l{font-size:11px;color:#64748b}
.kpi.green{border-color:#86efac}.kpi.amber{border-color:#fcd34d}.kpi.red{border-color:#fca5a5}
.pill{display:inline-block;padding:1px 8px;border-radius:10px;background:#f1f5f9;font-size:11px}
.pill.done{background:#dcfce7}.pill.blocked{background:#fee2e2}.pill.in_progress{background:#ccfbf1}.pill.pending_approval{background:#ede9fe}
.late{color:#b91c1c}
.desc{color:#64748b;font-size:11px;margin-top:2px}
.tag{display:inline-block;font-size:10px;color:#475569;border:1px solid #cbd5e1;border-radius:4px;padding:0 4px;margin-left:4px}
.commentary{border-left:3px solid ${TEAL};background:#f0fdfa;padding:8px 12px;margin:8px 0 12px}
.commentary-h{font-size:11px;color:${TEAL};font-weight:600;margin-bottom:2px}
.chart{width:100%;max-width:680px;height:auto;margin:4px 0 8px}
.notes{border-top:1px solid #e2e8f0;margin-top:24px}
.nowrap{white-space:nowrap}
.footer{margin-top:28px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;display:flex;justify-content:space-between;gap:10px}
section{page-break-inside:auto}
@media print{.page{padding:0}h2{page-break-after:avoid}h3{page-break-after:avoid}}
</style></head><body><main class="page">
${parts.join('\n')}
<div class="footer"><span>${esc(r.meta.organisation)} - ${esc(r.meta.projectName)} - ${esc(r.meta.period.label)}</span><span>${r.meta.confidentiality ? `${esc(r.meta.confidentiality)} - ` : ''}Generated ${esc(fmtTime(r.meta.generatedAt, tz))} - BIZOMAT Project Management</span></div>
</main></body></html>`;
}
