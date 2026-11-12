// Project controls in the browser: one schedule query per board (the server calculates; nothing is recalculated
// here), shared by every view through ScheduleContext, plus small shared pieces (task key, criticality badge).

import { createContext, useContext, useMemo, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { BoardBundle } from '../../../shared/types';
import { CRITICALITY_LABELS, type Criticality, type ScheduleDTO, type TaskScheduleDTO } from '../../../shared/schedule';
import { get } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import '../../styles/controls.css';

/** Changes whenever a task, group or column of the board changes, so the schedule is fetched again. */
export function bundleVersion(bundle: BoardBundle | undefined): string {
  if (!bundle) return '';
  let max = 0;
  for (const i of bundle.items) if (i.updatedAt > max) max = i.updatedAt;
  return `${bundle.items.length}:${max}:${bundle.groups.map((g) => `${g.id}${g.position}`).join(',').length}:${bundle.columns.length}:${bundle.board.updatedAt}`;
}

export function useSchedule(bundle: BoardBundle | undefined, statusDate?: string | null) {
  const boardId = bundle?.board.id;
  return useQuery({
    queryKey: ['schedule', boardId, bundleVersion(bundle), statusDate ?? ''],
    queryFn: () => get<ScheduleDTO>(`/boards/${boardId}/schedule${statusDate ? `?statusDate=${statusDate}` : ''}`),
    enabled: !!boardId,
    staleTime: 15_000,
    placeholderData: keepPreviousData,
  });
}

/** After a change to scheduling data, links, calendars or baselines. */
export function invalidateControls(qc: QueryClient, boardId: string) {
  for (const k of ['schedule', 'controls', 'evm', 'baselines', 'baseline-compare', 'item-schedule', 'schedule-calendar']) void qc.invalidateQueries({ queryKey: [k] });
  void qc.invalidateQueries({ queryKey: ['board', boardId] });
}

export function useInvalidateControls(boardId: string) {
  const qc = useQueryClient();
  return () => invalidateControls(qc, boardId);
}

export interface ScheduleIndex {
  data: ScheduleDTO | null;
  byItem: Map<string, TaskScheduleDTO>;
}

const EMPTY: ScheduleIndex = { data: null, byItem: new Map() };
export const ScheduleContext = createContext<ScheduleIndex>(EMPTY);
export const useScheduleIndex = () => useContext(ScheduleContext);

export function useScheduleIndexValue(data: ScheduleDTO | undefined | null): ScheduleIndex {
  return useMemo(() => (data ? { data, byItem: new Map(data.tasks.map((t) => [t.itemId, t])) } : EMPTY), [data]);
}

// ---------------------------------------------------------------- filtering by criticality (all views)

export const SCHEDULE_FILTERS = {
  all: 'All tasks',
  critical: 'Critical',
  critical_near: 'Critical and near-critical',
  near_critical: 'Near-critical',
  non_critical: 'Non-critical',
  no_links: 'No dependencies',
  conflicts: 'Scheduling conflicts',
} as const;
export type ScheduleFilter = keyof typeof SCHEDULE_FILTERS;

export function matchesScheduleFilter(t: TaskScheduleDTO | undefined, f: ScheduleFilter): boolean {
  if (f === 'all') return true;
  if (!t) return false;
  switch (f) {
    case 'critical':
      return t.criticality === 'critical';
    case 'critical_near':
      return t.criticality === 'critical' || t.criticality === 'near_critical';
    case 'near_critical':
      return t.criticality === 'near_critical';
    case 'non_critical':
      return t.criticality === 'non_critical';
    case 'no_links':
      return !t.summary && !t.predecessors.length && !t.successors.length;
    case 'conflicts':
      return t.conflicts.length > 0;
    default:
      return true;
  }
}

// ---------------------------------------------------------------- small shared pieces

/** The permanent key, with a copy button. */
export function TaskKey({ value, copy = false }: { value: string | null | undefined; copy?: boolean }) {
  const [done, setDone] = useState(false);
  if (!value) return null;
  if (!copy) return <span className="task-key">{value}</span>;
  return (
    <button
      type="button"
      className="task-key copy"
      title={done ? 'Copied' : `Copy ${value}`}
      aria-label={`Copy task ID ${value}`}
      onClick={(e) => {
        e.stopPropagation();
        void navigator.clipboard?.writeText(value).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        });
      }}
    >
      {value} <Icon name={done ? 'check' : 'copy'} size={11} />
    </button>
  );
}

/** Critical and near-critical marks: an icon and a word, never colour alone. */
export function CriticalBadge({ criticality, compact = false }: { criticality: Criticality | undefined; compact?: boolean }) {
  if (criticality !== 'critical' && criticality !== 'near_critical') return null;
  const label = CRITICALITY_LABELS[criticality];
  return (
    <span className={`crit-badge ${criticality}`} title={`${label} path`} aria-label={`${label} path`}>
      <Icon name={criticality === 'critical' ? 'flag' : 'clock'} size={11} />
      {compact ? null : <span>{criticality === 'critical' ? 'Critical' : 'Near-critical'}</span>}
    </span>
  );
}

export const fmtDays = (v: number | null | undefined) => (v == null ? '—' : `${Math.round(v * 100) / 100} d`);
export const fmtDate = (v: string | null | undefined) => (v ? new Date(`${v}T00:00:00Z`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '—');
