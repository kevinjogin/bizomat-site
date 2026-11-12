import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EARNING_METHODS, EARNING_METHOD_LABELS, PV_PROFILES, PV_PROFILE_LABELS, type CalendarDefinition, type CalendarException } from '../../../shared/schedule';
import { del, errorMessage, get, put } from '../../lib/api';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { ErrorBox, Field, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { invalidateControls, useSchedule } from './schedule';
import type { ControlsProps } from './ProjectControls';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SettingsTab({ bundle }: ControlsProps) {
  const boardId = bundle.board.id;
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const sched = useSchedule(bundle);
  const calQ = useQuery({ queryKey: ['schedule-calendar', boardId], queryFn: () => get<{ calendar: CalendarDefinition; scope: 'project' | 'organisation' | 'default'; hoursPerDay: number; daysPerWeek: number; canManage: boolean; canSetOrganisation: boolean }>(`/boards/${boardId}/schedule/calendar`) });
  const [s, setS] = useState<any>(null);
  const [cal, setCal] = useState<CalendarDefinition | null>(null);
  const [scope, setScope] = useState<'project' | 'organisation'>('project');
  const [ex, setEx] = useState<CalendarException>({ start: '', end: '', name: '', working: false, kind: 'holiday' });
  useEffect(() => {
    if (sched.data && !s) setS({ ...sched.data.settings });
  }, [sched.data, s]);
  useEffect(() => {
    if (calQ.data && !cal) {
      setCal(calQ.data.calendar);
      setScope(calQ.data.scope === 'organisation' ? 'organisation' : 'project');
    }
  }, [calQ.data, cal]);
  if (sched.isLoading || calQ.isLoading || !s || !cal) return <Loading />;
  if (calQ.error) return <ErrorBox error={calQ.error} />;
  const canManage = !!sched.data?.canManage;
  const timelineCols = bundle.columns.filter((c) => c.type === 'timeline');

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await put(`/boards/${boardId}/schedule/settings`, {
        prefix: s.prefix || undefined,
        timelineColumnId: s.timelineColumnId || null,
        projectStart: s.projectStart || null,
        criticalDays: Number(s.criticalDays),
        nearCriticalDays: Number(s.nearCriticalDays),
        defaultEarningMethod: s.defaultEarningMethod,
        defaultPvProfile: s.defaultPvProfile,
      });
      toast('Schedule settings saved');
      invalidateControls(qc, boardId);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const saveCalendar = async () => {
    try {
      await put(`/boards/${boardId}/schedule/calendar`, { scope, calendar: cal });
      toast(scope === 'organisation' ? 'Organisation calendar saved (projects without their own calendar use it)' : 'Project calendar saved');
      invalidateControls(qc, boardId);
      await calQ.refetch();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const resetCalendar = async () => {
    if (!(await confirm({ title: 'Use the organisation calendar?', message: 'This project’s own calendar is removed; it then follows the organisation’s calendar (or the standard Monday to Friday one).', confirmLabel: 'Remove project calendar' }))) return;
    await del(`/boards/${boardId}/schedule/calendar`);
    setCal(null);
    invalidateControls(qc, boardId);
    await calQ.refetch();
  };
  const ro = !canManage;
  return (
    <div className="pc-grid-2">
      <form className="pc-section" onSubmit={saveSettings}>
        <h3>Schedule settings</h3>
        <div className="pc-form">
          <Field label="Task ID prefix" htmlFor="pc-prefix" hint="New tasks get IDs like PREFIX-0001. Existing IDs never change.">
            <input id="pc-prefix" className="input" value={s.prefix ?? ''} maxLength={10} disabled={ro} onChange={(e) => setS({ ...s, prefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} />
          </Field>
          <Field label="Planned dates column" htmlFor="pc-tl">
            <select id="pc-tl" className="select" value={s.timelineColumnId ?? ''} disabled={ro} onChange={(e) => setS({ ...s, timelineColumnId: e.target.value })}>
              {timelineCols.length ? timelineCols.map((c) => <option key={c.id} value={c.id}>{c.title}</option>) : <option value="">No timeline column</option>}
            </select>
          </Field>
          <Field label="Project start" htmlFor="pc-start" hint="Empty: the earliest planned start">
            <input id="pc-start" className="input" type="date" value={s.projectStart ?? ''} disabled={ro} onChange={(e) => setS({ ...s, projectStart: e.target.value })} />
          </Field>
          <Field label="Critical: float at or below (working days)" htmlFor="pc-crit">
            <input id="pc-crit" className="input" type="number" min={0} step={0.5} value={s.criticalDays} disabled={ro} onChange={(e) => setS({ ...s, criticalDays: e.target.value })} />
          </Field>
          <Field label="Near-critical: float up to (working days)" htmlFor="pc-near">
            <input id="pc-near" className="input" type="number" min={0} step={0.5} value={s.nearCriticalDays} disabled={ro} onChange={(e) => setS({ ...s, nearCriticalDays: e.target.value })} />
          </Field>
          <Field label="Default earning method" htmlFor="pc-earn">
            <select id="pc-earn" className="select" value={s.defaultEarningMethod} disabled={ro} onChange={(e) => setS({ ...s, defaultEarningMethod: e.target.value })}>
              {EARNING_METHODS.map((m) => <option key={m} value={m}>{EARNING_METHOD_LABELS[m]}</option>)}
            </select>
          </Field>
          <Field label="Default planned value curve" htmlFor="pc-pv">
            <select id="pc-pv" className="select" value={s.defaultPvProfile} disabled={ro} onChange={(e) => setS({ ...s, defaultPvProfile: e.target.value })}>
              {PV_PROFILES.map((m) => <option key={m} value={m}>{PV_PROFILE_LABELS[m]}</option>)}
            </select>
          </Field>
        </div>
        {canManage ? <button className="btn primary" style={{ marginTop: 10 }}>Save settings</button> : <p className="small muted">Only project managers change these.</p>}
      </form>

      <div className="pc-section">
        <h3>Working calendar</h3>
        <p className="small muted" style={{ marginTop: 0 }}>
          {calQ.data!.scope === 'project' ? 'This project has its own calendar.' : calQ.data!.scope === 'organisation' ? 'This project uses the organisation calendar.' : 'This project uses the standard calendar (Monday to Friday).'} {calQ.data!.hoursPerDay} working hours a day, {calQ.data!.daysPerWeek} days a week. Durations, lags and float count working time only.
        </p>
        <div className="pc-form">
          <Field label="Name" htmlFor="cal-name"><input id="cal-name" className="input" value={cal.name} disabled={ro} onChange={(e) => setCal({ ...cal, name: e.target.value })} /></Field>
          <Field label="Time zone" htmlFor="cal-tz" hint="IANA name, for example Australia/Sydney"><input id="cal-tz" className="input" value={cal.timezone} disabled={ro} onChange={(e) => setCal({ ...cal, timezone: e.target.value })} /></Field>
          <Field label="Day starts" htmlFor="cal-start"><input id="cal-start" className="input" type="time" value={cal.dayStart} disabled={ro} onChange={(e) => setCal({ ...cal, dayStart: e.target.value })} /></Field>
          <Field label="Day ends" htmlFor="cal-end"><input id="cal-end" className="input" type="time" value={cal.dayEnd} disabled={ro} onChange={(e) => setCal({ ...cal, dayEnd: e.target.value })} /></Field>
        </div>
        <div className="row wrap" style={{ gap: 6, margin: '10px 0' }} role="group" aria-label="Working days">
          {DAYS.map((d, i) => (
            <label key={d} className="row small" style={{ gap: 4 }}>
              <input type="checkbox" disabled={ro} checked={cal.workingDays.includes(i + 1)} onChange={(e) => setCal({ ...cal, workingDays: e.target.checked ? [...cal.workingDays, i + 1].sort() : cal.workingDays.filter((x) => x !== i + 1) })} /> {d}
            </label>
          ))}
        </div>
        <div className="small" style={{ marginBottom: 6 }}>Breaks</div>
        {cal.breaks.map((b, i) => (
          <div key={i} className="row" style={{ gap: 6, marginBottom: 4 }}>
            <input className="input" type="time" aria-label="Break start" value={b.start} disabled={ro} onChange={(e) => setCal({ ...cal, breaks: cal.breaks.map((x, j) => (j === i ? { ...x, start: e.target.value } : x)) })} />
            <input className="input" type="time" aria-label="Break end" value={b.end} disabled={ro} onChange={(e) => setCal({ ...cal, breaks: cal.breaks.map((x, j) => (j === i ? { ...x, end: e.target.value } : x)) })} />
            {!ro ? <button type="button" className="btn ghost icon sm" aria-label="Remove break" onClick={() => setCal({ ...cal, breaks: cal.breaks.filter((_, j) => j !== i) })}><Icon name="x" /></button> : null}
          </div>
        ))}
        {!ro ? <button type="button" className="btn sm" onClick={() => setCal({ ...cal, breaks: [...cal.breaks, { start: '12:00', end: '13:00' }] })}><Icon name="plus" /> Add break</button> : null}
        <div className="small" style={{ margin: '12px 0 6px' }}>Holidays, shutdowns and exceptions</div>
        <table className="pc-table">
          <thead><tr><th>From</th><th>To</th><th>Name</th><th>Type</th><th /></tr></thead>
          <tbody>
            {cal.exceptions.map((e, i) => (
              <tr key={i}>
                <td>{e.start}</td><td>{e.end}</td><td>{e.name}</td><td>{e.working ? 'Working day' : e.kind === 'shutdown' ? 'Shutdown' : e.kind === 'project' ? 'Project non-working' : 'Holiday'}</td>
                <td>{!ro ? <button className="btn ghost icon sm" aria-label={`Remove ${e.name}`} onClick={() => setCal({ ...cal, exceptions: cal.exceptions.filter((_, j) => j !== i) })}><Icon name="trash" /></button> : null}</td>
              </tr>
            ))}
            {!cal.exceptions.length ? <tr><td colSpan={5} className="muted small">None.</td></tr> : null}
          </tbody>
        </table>
        {!ro ? (
          <div className="pc-form" style={{ marginTop: 8 }}>
            <Field label="From" htmlFor="ex-start"><input id="ex-start" className="input" type="date" value={ex.start} onChange={(e) => setEx({ ...ex, start: e.target.value, end: ex.end || e.target.value })} /></Field>
            <Field label="To" htmlFor="ex-end"><input id="ex-end" className="input" type="date" value={ex.end} onChange={(e) => setEx({ ...ex, end: e.target.value })} /></Field>
            <Field label="Name" htmlFor="ex-name"><input id="ex-name" className="input" value={ex.name} placeholder="Australia Day" onChange={(e) => setEx({ ...ex, name: e.target.value })} /></Field>
            <Field label="Type" htmlFor="ex-kind">
              <select id="ex-kind" className="select" value={ex.working ? 'working' : ex.kind} onChange={(e) => setEx({ ...ex, working: e.target.value === 'working', kind: e.target.value as CalendarException['kind'] })}>
                <option value="holiday">Public holiday</option>
                <option value="shutdown">Company shutdown</option>
                <option value="project">Project non-working day</option>
                <option value="working">Extra working day</option>
              </select>
            </Field>
            <button type="button" className="btn" disabled={!ex.start || !ex.end || !ex.name.trim()} onClick={() => { setCal({ ...cal, exceptions: [...cal.exceptions, { ...ex, name: ex.name.trim() }].sort((a, b) => a.start.localeCompare(b.start)) }); setEx({ start: '', end: '', name: '', working: false, kind: 'holiday' }); }}><Icon name="plus" /> Add</button>
          </div>
        ) : null}
        {canManage ? (
          <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
            <select className="select" aria-label="Save for" value={scope} onChange={(e) => setScope(e.target.value as 'project' | 'organisation')}>
              <option value="project">For this project only</option>
              {calQ.data!.canSetOrganisation ? <option value="organisation">For the organisation (projects without their own)</option> : null}
            </select>
            <button className="btn primary" onClick={saveCalendar}>Save calendar</button>
            {calQ.data!.scope === 'project' ? <button className="btn ghost" onClick={resetCalendar}>Use the organisation calendar</button> : null}
          </div>
        ) : <p className="small muted">Only project managers change the calendar.</p>}
      </div>
    </div>
  );
}
