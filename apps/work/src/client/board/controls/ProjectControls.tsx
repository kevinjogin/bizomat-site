// Project controls: one place for the critical path, baselines, earned value and the management summary. Advanced
// features stay out of the way of people who only manage tasks: they live behind the board's "Project controls" button.

import { lazy, Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { BoardBundle } from '../../../shared/types';
import { CRITICALITY_LABELS, type ScheduleSummaryDTO, type ScheduleWarning } from '../../../shared/schedule';
import { formatMoney } from '../../../shared/money';
import { get } from '../../lib/api';
import { Modal } from '../../components/ui/overlays';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { TaskKey, fmtDate, fmtDays } from './schedule';
import { Bars } from './charts';

const ScheduleTab = lazy(() => import('./ScheduleTab'));
const BaselinesTab = lazy(() => import('./BaselinesTab'));
const EarnedValueTab = lazy(() => import('./EarnedValueTab'));
const SettingsTab = lazy(() => import('./SettingsTab'));

type Tab = 'overview' | 'schedule' | 'baselines' | 'evm' | 'settings';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'schedule', label: 'Critical path' },
  { id: 'baselines', label: 'Baselines' },
  { id: 'evm', label: 'Earned value' },
  { id: 'settings', label: 'Calendar and settings' },
];

export interface ControlsProps {
  bundle: BoardBundle;
  onOpenItem: (id: string) => void;
}

export default function ProjectControls({ bundle, onClose, onOpenItem }: ControlsProps & { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const open = (id: string) => {
    onClose();
    onOpenItem(id);
  };
  return (
    <Modal title={`Project controls · ${bundle.board.name}`} onClose={onClose} xl>
      <div className="pc-root">
      <div className="pc-tabs" role="tablist" aria-label="Project controls">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <Suspense fallback={<Loading />}>
        {tab === 'overview' ? <Overview bundle={bundle} onOpenItem={open} onTab={setTab} /> : null}
        {tab === 'schedule' ? <ScheduleTab bundle={bundle} onOpenItem={open} /> : null}
        {tab === 'baselines' ? <BaselinesTab bundle={bundle} onOpenItem={open} /> : null}
        {tab === 'evm' ? <EarnedValueTab bundle={bundle} onOpenItem={open} /> : null}
        {tab === 'settings' ? <SettingsTab bundle={bundle} onOpenItem={open} /> : null}
      </Suspense>
      </div>
    </Modal>
  );
}

interface TaskRef {
  itemId: string;
  key: string | null;
  name: string;
}

interface ControlsSummary {
  statusDate: string;
  valid: boolean;
  schedule: ScheduleSummaryDTO;
  warnings: ScheduleWarning[];
  baseline: { id: string; number: number; name: string; projectFinish: string | null } | null;
  forecastFinish: string | null;
  finishVarianceDays: number | null;
  remainingWorkingDays: number | null;
  openTasks: number;
  completedTasks: number;
  criticalTasks: (TaskRef & { totalFloatDays: number | null; earlyFinish: string | null; owners: string[] })[];
  nearCriticalCount: number;
  delayedCritical: (TaskRef & { finishVarianceDays: number | null; totalFloatDays: number | null })[];
  overdue: (TaskRef & { plannedFinish: string | null; criticality: string })[];
  upcomingMilestones: (TaskRef & { date: string | null; criticality: string })[];
  criticalByOwner: { userId: string; count: number }[];
  intervention: (TaskRef & { reason: string })[];
  evm: null | {
    currency: string | null;
    bac: string | null;
    ac: string | null;
    cpi: number | null;
    spi: number | null;
    cpiStatus: string;
    spiStatus: string;
    eac: { cpi: string | null; budget: string | null; cpiSpi: string | null };
    vac: { cpi: string | null };
    earlyStage: boolean;
  };
  evmReason: string | null;
}

const Unavailable = ({ children = 'Unavailable' }: { children?: string }) => <span className="pc-unavailable">{children}</span>;

export function Tile({ label, value, sub, tone, title }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'warn' | 'bad'; title?: string }) {
  return (
    <div className={`pc-tile${tone ? ` ${tone}` : ''}`} title={title}>
      <div className="lbl">{label}{title ? <Icon name="info" size={11} /> : null}</div>
      <div className="val">{value}</div>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
  );
}

function TaskLink({ t, onOpen }: { t: TaskRef; onOpen: (id: string) => void }) {
  return (
    <button className="btn ghost sm" style={{ justifyContent: 'flex-start', gap: 6 }} onClick={() => onOpen(t.itemId)}>
      <TaskKey value={t.key} /> <span className="ellipsis">{t.name}</span>
    </button>
  );
}

function Overview({ bundle, onOpenItem, onTab }: ControlsProps & { onTab: (t: Tab) => void }) {
  const q = useQuery({ queryKey: ['controls', bundle.board.id], queryFn: () => get<ControlsSummary>(`/boards/${bundle.board.id}/controls`) });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const d = q.data!;
  const name = (id: string) => bundle.members.find((m) => m.id === id)?.name ?? 'Former member';
  const money = (v: string | null | undefined) => (v == null ? null : formatMoney(v, d.evm?.currency ?? null));
  const fv = d.finishVarianceDays;
  const cpiWord = d.evm?.cpi == null ? null : d.evm.cpiStatus === 'below' ? 'over budget for the work done' : d.evm.cpiStatus === 'above' ? 'under budget for the work done' : 'on budget';
  const spiWord = d.evm?.spi == null ? null : d.evm.spiStatus === 'below' ? 'behind planned progress' : d.evm.spiStatus === 'above' ? 'ahead of planned progress' : 'on planned progress';
  const firstCritical = d.criticalTasks.filter((t) => t.earlyFinish).slice(0, 3);
  return (
    <div>
      <p className="muted small" style={{ marginTop: 0 }}>Status date {fmtDate(d.statusDate)}. Every figure is calculated from the plan, its dependencies, the calendar and recorded progress and costs.</p>
      {!d.valid ? (
        <ul className="pc-warnings"><li className="cycle">{d.warnings.find((w) => w.code === 'cycle')?.message ?? 'The schedule has a dependency loop.'} <button className="btn sm" onClick={() => onTab('schedule')}>Open the critical path</button></li></ul>
      ) : null}
      <div className="pc-tiles">
        <Tile label="Forecast finish" value={d.forecastFinish ? fmtDate(d.forecastFinish) : <Unavailable>No dated tasks</Unavailable>} sub={d.baseline ? `Baseline ${d.baseline.number}: ${fmtDate(d.baseline.projectFinish)}` : 'No approved baseline'} />
        <Tile label="Finish variance" value={fv == null ? <Unavailable /> : `${fv > 0 ? '+' : ''}${fv} d`} tone={fv == null ? undefined : fv > 0 ? 'bad' : 'good'} sub="Working days against the baseline" />
        <Tile label="Critical path" value={fmtDays(d.schedule.criticalDurationDays)} sub={`${d.schedule.counts.critical} critical, ${d.nearCriticalCount} near-critical`} tone={d.schedule.counts.critical ? 'warn' : undefined} />
        <Tile label="Remaining" value={d.remainingWorkingDays == null ? <Unavailable /> : `${d.remainingWorkingDays} d`} sub={`${d.openTasks} open, ${d.completedTasks} completed tasks`} />
        <Tile label="CPI" value={d.evm?.cpi == null ? <Unavailable /> : d.evm.cpi.toFixed(2)} tone={d.evm?.cpi == null ? undefined : d.evm.cpiStatus === 'below' ? 'bad' : 'good'} sub={cpiWord ?? d.evmReason ?? 'No actual cost recorded'} title="Cost performance index = EV / AC" />
        <Tile label="SPI" value={d.evm?.spi == null ? <Unavailable /> : d.evm.spi.toFixed(2)} tone={d.evm?.spi == null ? undefined : d.evm.spiStatus === 'below' ? 'bad' : 'good'} sub={spiWord ?? d.evmReason ?? 'No planned value yet'} title="Schedule performance index = EV / PV" />
        <Tile label="Forecast final cost" value={money(d.evm?.eac.cpi) ?? <Unavailable />} sub={d.evm ? `EAC by CPI; budget ${money(d.evm.bac) ?? 'unavailable'}` : d.evmReason ?? ''} tone={d.evm?.vac.cpi && d.evm.vac.cpi.startsWith('-') ? 'bad' : undefined} />
        <Tile label="Overdue" value={d.overdue.length} tone={d.overdue.length ? 'bad' : 'good'} sub="Open tasks past their planned finish" />
      </div>
      {d.evm?.earlyStage ? <p className="small muted">Early in the project: little work is earned yet, so CPI and SPI can change a lot.</p> : null}

      <div className="pc-section" style={{ marginBottom: 14 }}>
        <h3>Management summary</h3>
        <ul className="pc-qa">
          <li><b>Are we on schedule?</b><span>{fv == null ? (d.baseline ? 'The baseline has no finish date to compare.' : 'No approved baseline yet: approve one in Baselines to measure against.') : fv > 0 ? `No: the forecast finish is ${fv} working days after baseline ${d.baseline!.number}.` : fv < 0 ? `Yes: ${-fv} working days ahead of baseline ${d.baseline!.number}.` : `Yes: on baseline ${d.baseline!.number}'s finish date.`}{spiWord ? ` SPI ${d.evm!.spi!.toFixed(2)}: ${spiWord}.` : ''}</span></li>
          <li><b>Are we on budget?</b><span>{d.evm?.cpi != null ? `CPI ${d.evm.cpi.toFixed(2)}: ${cpiWord}. Forecast final cost ${money(d.evm.eac.cpi) ?? 'unavailable'} against a budget of ${money(d.evm.bac)}.` : d.evmReason ?? 'Unavailable: no actual cost is recorded yet.'}</span></li>
          <li><b>What is delaying completion?</b><span>{d.delayedCritical.length ? `${d.delayedCritical.length} critical task${d.delayedCritical.length === 1 ? ' is' : 's are'} late or short of float: ${d.delayedCritical.slice(0, 3).map((t) => t.key ?? t.name).join(', ')}.` : firstCritical.length ? `Nothing is late; the finish depends on ${firstCritical.map((t) => t.key ?? t.name).join(', ')}${d.criticalTasks.length > 3 ? ' and more' : ''}.` : 'No critical tasks.'}</span></li>
          <li><b>Which activities are critical?</b><span>{d.criticalTasks.length ? `${d.criticalTasks.length} (listed below).` : 'None.'}</span></li>
          <li><b>What work is remaining?</b><span>{d.openTasks} open task{d.openTasks === 1 ? '' : 's'}; {d.remainingWorkingDays ?? 'unknown'} working days to the forecast finish.</span></li>
          <li><b>Projected completion date</b><span>{d.forecastFinish ? fmtDate(d.forecastFinish) : 'Unavailable: no task has dates or a duration.'}</span></li>
          <li><b>Forecast final cost</b><span>{d.evm?.eac.cpi ? `${money(d.evm.eac.cpi)} (EAC by CPI); ${money(d.evm.eac.budget) ?? 'unavailable'} if the remaining work goes to budget.` : d.evmReason ?? 'Unavailable.'}</span></li>
          <li><b>Needs management attention</b><span>{d.intervention.length ? `${d.intervention.length} task${d.intervention.length === 1 ? '' : 's'} (listed below).` : 'Nothing at the moment.'}</span></li>
        </ul>
      </div>

      <div className="pc-grid-2">
        <div className="pc-section">
          <h3>Needs attention</h3>
          {d.intervention.length ? d.intervention.map((t) => <div key={t.itemId}><TaskLink t={t} onOpen={onOpenItem} /><div className="small muted" style={{ marginLeft: 10 }}>{t.reason}</div></div>) : <p className="muted small">Nothing needs intervention.</p>}
        </div>
        <div className="pc-section">
          <h3>Critical activities</h3>
          {d.criticalTasks.length ? (
            <table className="pc-table">
              <thead><tr><th>Task</th><th>Finish</th><th className="num">Float</th></tr></thead>
              <tbody>{d.criticalTasks.slice(0, 15).map((t) => <tr key={t.itemId}><td><TaskLink t={t} onOpen={onOpenItem} /></td><td>{fmtDate(t.earlyFinish)}</td><td className={`num ${(t.totalFloatDays ?? 0) < 0 ? 'pc-neg' : ''}`}>{fmtDays(t.totalFloatDays)}</td></tr>)}</tbody>
            </table>
          ) : <p className="muted small">No critical activities.</p>}
        </div>
        <div className="pc-section">
          <h3>Upcoming milestones (next 20 working days)</h3>
          {d.upcomingMilestones.length ? d.upcomingMilestones.map((t) => <div key={t.itemId} className="row"><TaskLink t={t} onOpen={onOpenItem} /><span className="small">{fmtDate(t.date)}</span><span className="small muted">{CRITICALITY_LABELS[t.criticality as keyof typeof CRITICALITY_LABELS]}</span></div>) : <p className="muted small">None.</p>}
        </div>
        <div className="pc-section">
          <h3>People on critical tasks</h3>
          {d.criticalByOwner.length ? <Bars rows={d.criticalByOwner.map((o) => ({ label: name(o.userId), value: o.count }))} format={(v) => `${v} task${v === 1 ? '' : 's'}`} /> : <p className="muted small">No owners are assigned to critical tasks.</p>}
          <p className="small muted">Each critical task counts once per person assigned to it.</p>
        </div>
        <div className="pc-section">
          <h3>Delayed tasks</h3>
          {d.overdue.length ? d.overdue.slice(0, 12).map((t) => <div key={t.itemId} className="row"><TaskLink t={t} onOpen={onOpenItem} /><span className="small pc-neg">due {fmtDate(t.plannedFinish)}</span></div>) : <p className="muted small">No open task is past its planned finish.</p>}
        </div>
        <div className="pc-section">
          <h3>Schedule quality</h3>
          {d.warnings.length ? <ul className="pc-warnings">{d.warnings.slice(0, 8).map((w, i) => <li key={i} className={w.code}>{w.message}</li>)}</ul> : <p className="muted small">No scheduling problems found.</p>}
        </div>
      </div>
    </div>
  );
}
