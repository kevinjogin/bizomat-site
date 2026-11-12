import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CRITICALITY_LABELS, formatLink, type TaskScheduleDTO } from '../../../shared/schedule';
import { labelsOf } from '../../../shared/columns';
import { errorMessage, post } from '../../lib/api';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { CriticalBadge, SCHEDULE_FILTERS, TaskKey, fmtDays, invalidateControls, matchesScheduleFilter, useSchedule, type ScheduleFilter } from './schedule';
import { Bars } from './charts';
import { Tile, type ControlsProps } from './ProjectControls';

type SortKey = 'wbs' | 'key' | 'float' | 'start' | 'finish';

export default function ScheduleTab({ bundle, onOpenItem }: ControlsProps) {
  const q = useSchedule(bundle);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [filter, setFilter] = useState<ScheduleFilter>('all');
  const [sort, setSort] = useState<SortKey>('wbs');
  const [search, setSearch] = useState('');
  const d = q.data;
  const byId = useMemo(() => new Map((d?.tasks ?? []).map((t) => [t.itemId, t])), [d]);

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!d) return null;
  const hpd = d.summary.hoursPerDay;
  const linkText = (id: string, dir: 'pred' | 'succ') =>
    d.links
      .filter((l) => (dir === 'pred' ? l.successorId === id : l.predecessorId === id))
      .map((l) => `${byId.get(dir === 'pred' ? l.predecessorId : l.successorId)?.key ?? '?'} ${formatLink(l.type, l.lagMinutes, l.lagUnit, hpd, 5)}`)
      .join(', ');
  const s = search.trim().toLowerCase();
  const rows = d.tasks
    .filter((t) => matchesScheduleFilter(t, filter))
    .filter((t) => !s || (t.key ?? '').toLowerCase().includes(s) || t.name.toLowerCase().includes(s) || t.wbs.startsWith(s))
    .sort((a, b) => {
      const num = (k: string | null) => Number((k ?? '').split('-').pop()) || 0;
      switch (sort) {
        case 'key':
          return num(a.key) - num(b.key);
        case 'float':
          return (a.totalFloatDays ?? 1e9) - (b.totalFloatDays ?? 1e9);
        case 'start':
          return (a.earlyStart ?? '9').localeCompare(b.earlyStart ?? '9');
        case 'finish':
          return (a.earlyFinish ?? '9').localeCompare(b.earlyFinish ?? '9');
        default: {
          const pa = a.wbs.split('.').map(Number);
          const pb = b.wbs.split('.').map(Number);
          for (let i = 0; i < Math.max(pa.length, pb.length); i++) if ((pa[i] ?? -1) !== (pb[i] ?? -1)) return (pa[i] ?? -1) - (pb[i] ?? -1);
          return 0;
        }
      }
    });
  const leaf = d.tasks.filter((t) => !t.summary);
  const critical = leaf.filter((t) => t.criticality === 'critical');
  const statusCol = bundle.columns.find((c) => c.type === 'status');
  const statusOf = (t: TaskScheduleDTO) => {
    if (!statusCol) return t.percentComplete === 100 ? 'Done' : (t.percentComplete ?? 0) > 0 ? 'Working on it' : 'Not started';
    const v = bundle.items.find((i) => i.id === t.itemId)?.values[statusCol.id];
    return labelsOf(statusCol).find((l) => l.id === v)?.label ?? 'No status';
  };
  const byStatus = new Map<string, number>();
  for (const t of critical) byStatus.set(statusOf(t), (byStatus.get(statusOf(t)) ?? 0) + 1);
  const critProgress = critical.length ? Math.round(critical.reduce((n, t) => n + (t.percentComplete ?? 0), 0) / critical.length) : null;
  const conflicts = d.warnings.filter((w) => w.code === 'date_conflict').length;

  const apply = async () => {
    if (!(await confirm({ title: 'Apply the calculated dates?', message: 'The planned start and finish of every unfinished task becomes its calculated early start and finish (following its dependencies, the calendar and today’s date). Each change is recorded in the task’s activity.', confirmLabel: 'Apply dates' }))) return;
    try {
      const r = await post<{ updated: number }>(`/boards/${bundle.board.id}/schedule/apply`, {});
      toast(r.updated ? `${r.updated} task${r.updated === 1 ? '' : 's'} rescheduled` : 'All planned dates already match the schedule');
      invalidateControls(qc, bundle.board.id);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  return (
    <div>
      <div className="pc-tiles">
        <Tile label="Project start" value={d.summary.projectStart ?? '—'} />
        <Tile label="Forecast finish" value={d.summary.projectFinish ?? '—'} />
        <Tile label="Critical path duration" value={fmtDays(d.summary.criticalDurationDays)} sub={`${hpd} working hours a day`} />
        <Tile label="Critical" value={d.summary.counts.critical} tone={d.summary.counts.critical ? 'bad' : undefined} />
        <Tile label="Near-critical" value={d.summary.counts.near_critical} tone={d.summary.counts.near_critical ? 'warn' : undefined} sub={`Float up to ${d.settings.nearCriticalDays} d`} />
        <Tile label="Critical path progress" value={critProgress == null ? '—' : `${critProgress}%`} sub="Average of critical tasks" />
      </div>
      {d.warnings.length ? <ul className="pc-warnings">{d.warnings.map((w, i) => <li key={i} className={w.code}>{w.message}</li>)}</ul> : null}
      {d.summary.criticalPaths.length ? (
        <div className="pc-section" style={{ marginBottom: 12 }}>
          <h3>Critical path{d.summary.criticalPaths.length > 1 ? `s (${d.summary.criticalPaths.length})` : ''}</h3>
          {d.summary.criticalPaths.map((p, i) => (
            <div key={i} className="small" style={{ lineHeight: 1.9 }}>
              {p.map((id, j) => (
                <span key={id}>
                  {j ? <Icon name="chevronRight" size={11} /> : null}
                  <button className="btn ghost sm" onClick={() => onOpenItem(id)} title={byId.get(id)?.name}><TaskKey value={byId.get(id)?.key ?? null} /> {byId.get(id)?.name}</button>
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : null}
      <div className="row wrap" style={{ marginBottom: 8, gap: 8 }}>
        <input className="input" style={{ maxWidth: 220 }} placeholder="Search ID, WBS or name" aria-label="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="select" aria-label="Filter" value={filter} onChange={(e) => setFilter(e.target.value as ScheduleFilter)}>
          {Object.entries(SCHEDULE_FILTERS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="select" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="wbs">Sort by WBS</option>
          <option value="key">Sort by ID</option>
          <option value="float">Sort by total float</option>
          <option value="start">Sort by early start</option>
          <option value="finish">Sort by early finish</option>
        </select>
        <span className="spacer" />
        {d.canEdit && d.summary.valid ? (
          <button className="btn" onClick={apply} title="Write the calculated dates into the planned dates">
            <Icon name="calendar" /> Apply calculated dates{conflicts ? ` (${conflicts} conflict${conflicts === 1 ? '' : 's'})` : ''}
          </button>
        ) : null}
      </div>
      <div className="pc-table-wrap">
        <table className="pc-table">
          <thead>
            <tr>
              <th>ID</th><th>WBS</th><th>Task</th><th>Early start</th><th>Early finish</th><th>Late start</th><th>Late finish</th><th className="num">Duration</th><th className="num">Total float</th><th className="num">Free float</th><th>Predecessors</th><th>Successors</th><th>Planned</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.itemId} className={`clickable crit-${t.criticality}${t.summary ? ' summary' : ''}`} onClick={() => onOpenItem(t.itemId)}>
                <td><TaskKey value={t.key} /></td>
                <td>{t.wbs}</td>
                <td className="wrap">{t.milestone ? '◆ ' : ''}{t.name}{t.conflicts.length ? <div className="small pc-neg">{t.conflicts[0]}</div> : null}</td>
                <td>{t.earlyStart ?? '—'}</td>
                <td>{t.earlyFinish ?? '—'}</td>
                <td>{t.lateStart ?? '—'}</td>
                <td>{t.lateFinish ?? '—'}</td>
                <td className="num">{fmtDays(t.durationDays)}</td>
                <td className={`num ${(t.totalFloatDays ?? 0) < 0 ? 'pc-neg' : ''}`}>{fmtDays(t.totalFloatDays)}</td>
                <td className="num">{fmtDays(t.freeFloatDays)}</td>
                <td>{linkText(t.itemId, 'pred') || '—'}</td>
                <td>{linkText(t.itemId, 'succ') || '—'}</td>
                <td className="small">{t.plannedStart ? `${t.plannedStart} → ${t.plannedFinish}` : '—'}</td>
                <td>{t.criticality === 'critical' || t.criticality === 'near_critical' ? <CriticalBadge criticality={t.criticality} /> : <span className="small muted">{t.summary ? 'Summary' : CRITICALITY_LABELS[t.criticality]}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">Early and late dates and float come from the critical path calculation (forward and backward passes over the dependencies on the project calendar). Critical: total float at or below {d.settings.criticalDays} working days; near-critical: up to {d.settings.nearCriticalDays}. Change these in Calendar and settings.</p>
      <div className="pc-grid-2" style={{ marginTop: 12 }}>
        <div className="pc-section">
          <h3>Critical and non-critical tasks</h3>
          <Bars rows={(['critical', 'near_critical', 'non_critical', 'unscheduled', 'invalid'] as const).filter((k) => d.summary.counts[k]).map((k) => ({ label: CRITICALITY_LABELS[k], value: d.summary.counts[k] }))} danger={(l) => l === 'Critical'} />
        </div>
        <div className="pc-section">
          <h3>Critical tasks by status</h3>
          {critical.length ? <Bars rows={Array.from(byStatus, ([label, value]) => ({ label, value }))} /> : <p className="muted small">No critical tasks.</p>}
        </div>
      </div>
    </div>
  );
}
