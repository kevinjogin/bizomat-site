import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatMoney } from '../../../shared/money';
import { errorMessage, get, post } from '../../lib/api';
import { useSession } from '../../lib/session';
import { todayISO } from '../../lib/format';
import { useToast } from '../../components/ui/overlays';
import { ErrorBox, Field, Loading } from '../../components/ui/ui';
import { TaskKey, fmtDate, invalidateControls } from './schedule';
import { Tile, type ControlsProps } from './ProjectControls';

interface BaselineItem {
  id: string;
  number: number;
  name: string;
  notes: string;
  reason: string;
  approvedBy: string;
  approvedOn: string;
  previousBaselineId: string | null;
  projectStart: string | null;
  projectFinish: string | null;
  currency: string | null;
  bac: string | null;
  createdAt: number;
}

interface CompareRow {
  itemId: string;
  key: string | null;
  wbs: string;
  name: string;
  inBaseline: boolean;
  inPlan: boolean;
  baselineStart: string | null;
  baselineFinish: string | null;
  baselineDurationDays: number | null;
  baselineCost: string | null;
  currentStart: string | null;
  currentFinish: string | null;
  currentDurationDays: number | null;
  currentCost: string | null;
  actualStart: string | null;
  actualFinish: string | null;
  startVarianceDays: number | null;
  finishVarianceDays: number | null;
  durationVarianceDays: number | null;
  costVariance: string | null;
  progressVariance: number | null;
  plannedPercent: number | null;
  percentComplete: number | null;
}

const v = (n: number | null, unit = 'd') => (n == null ? '—' : `${n > 0 ? '+' : ''}${n}${unit}`);
const tone = (n: number | null) => (n == null || n === 0 ? '' : n > 0 ? 'pc-neg' : 'pc-pos');

export default function BaselinesTab({ bundle, onOpenItem }: ControlsProps) {
  const boardId = bundle.board.id;
  const qc = useQueryClient();
  const toast = useToast();
  const { session } = useSession();
  const list = useQuery({ queryKey: ['baselines', boardId], queryFn: () => get<{ baselines: BaselineItem[]; canCreate: boolean }>(`/boards/${boardId}/baselines`) });
  const [selected, setSelected] = useState('');
  const cmp = useQuery({
    queryKey: ['baseline-compare', boardId, selected],
    queryFn: () => get<any>(`/boards/${boardId}/baselines/compare${selected ? `?baseline=${selected}` : ''}`),
    enabled: !!list.data?.baselines.length,
  });
  const [form, setForm] = useState({ name: '', approvedBy: session?.user.name ?? '', approvedOn: todayISO(), notes: '', reason: '' });
  const [busy, setBusy] = useState(false);
  if (list.isLoading) return <Loading />;
  if (list.error) return <ErrorBox error={list.error} retry={() => list.refetch()} />;
  const baselines = list.data!.baselines;
  const revising = baselines.length > 0;
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await post<{ number: number; skippedCurrency: number }>(`/boards/${boardId}/baselines`, form);
      toast(`Baseline ${r.number} approved and frozen${r.skippedCurrency ? `; ${r.skippedCurrency} budget value(s) in another currency were left out` : ''}`);
      setForm({ ...form, name: '', notes: '', reason: '' });
      invalidateControls(qc, boardId);
      await list.refetch();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const c = cmp.data;
  const money = (x: string | null) => (x == null ? '—' : formatMoney(x, c?.baseline?.currency ?? null));
  return (
    <div>
      <p className="muted small" style={{ marginTop: 0 }}>A baseline is the approved plan frozen at a point in time: dates, durations, work, owners, budgets and dependencies. It never changes afterwards. A revised baseline is a new one that records why; the original (baseline 0) stays for comparison.</p>
      <div className="pc-grid-2">
        <div className="pc-section">
          <h3>Approved baselines</h3>
          {baselines.length ? (
            <table className="pc-table">
              <thead><tr><th>No.</th><th>Name</th><th>Approved</th><th>Finish</th><th className="num">Budget</th></tr></thead>
              <tbody>
                {baselines.map((b) => (
                  <tr key={b.id} className="clickable" onClick={() => setSelected(b.id)} aria-selected={selected === b.id}>
                    <td>{b.number}{b.number === 0 ? ' (original)' : ''}</td>
                    <td className="wrap">{b.name}{b.reason ? <div className="small muted">Reason: {b.reason}</div> : null}{b.previousBaselineId ? <div className="small muted">Replaces baseline {baselines.find((x) => x.id === b.previousBaselineId)?.number}</div> : null}</td>
                    <td className="small">{fmtDate(b.approvedOn)}<div className="muted">{b.approvedBy}</div></td>
                    <td className="small">{fmtDate(b.projectFinish)}</td>
                    <td className="num small">{b.bac == null ? <span className="pc-unavailable">{b.currency === null && list.data!.baselines.length ? 'not shown' : '—'}</span> : formatMoney(b.bac, b.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="muted small">No approved baseline yet.</p>}
        </div>
        {list.data!.canCreate ? (
          <form className="pc-section" onSubmit={create}>
            <h3>{revising ? 'Approve a revised baseline' : 'Approve the original baseline'}</h3>
            <div className="pc-form">
              <Field label="Name" htmlFor="bl-name"><input id="bl-name" className="input" required maxLength={120} placeholder={revising ? 'Recovery plan' : 'Original approved plan'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Approved by" htmlFor="bl-by"><input id="bl-by" className="input" required maxLength={120} value={form.approvedBy} onChange={(e) => setForm({ ...form, approvedBy: e.target.value })} /></Field>
              <Field label="Approval date" htmlFor="bl-on"><input id="bl-on" className="input" type="date" required value={form.approvedOn} onChange={(e) => setForm({ ...form, approvedOn: e.target.value })} /></Field>
            </div>
            {revising ? <Field label="Reason for the revision (required)" htmlFor="bl-reason"><textarea id="bl-reason" className="input" required rows={2} maxLength={1000} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field> : null}
            <Field label="Approval notes" htmlFor="bl-notes"><textarea id="bl-notes" className="input" rows={2} maxLength={2000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
            <button className="btn primary" disabled={busy || !form.name.trim() || !form.approvedBy.trim() || (revising && !form.reason.trim())}>{busy ? 'Saving…' : 'Approve and freeze'}</button>
            <p className="small muted">It records the current schedule (calculated dates), each task’s budget in the project currency, and the dependencies.</p>
          </form>
        ) : <div className="pc-section"><p className="muted small">Only project managers approve baselines.</p></div>}
      </div>

      {baselines.length ? (
        <div style={{ marginTop: 14 }}>
          <div className="row wrap" style={{ gap: 8, marginBottom: 8 }}>
            <label className="small" htmlFor="bl-compare">Compare with</label>
            <select id="bl-compare" className="select" value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Latest approved baseline</option>
              {baselines.map((b) => <option key={b.id} value={b.id}>Baseline {b.number}: {b.name}</option>)}
            </select>
          </div>
          {cmp.isLoading ? <Loading /> : cmp.error ? <ErrorBox error={cmp.error} /> : c?.available ? (
            <>
              <div className="pc-tiles">
                <Tile label={`Baseline ${c.baseline.number} finish`} value={fmtDate(c.baseline.projectFinish)} sub={`Approved ${fmtDate(c.baseline.approvedOn)} by ${c.baseline.approvedBy}`} />
                <Tile label="Current forecast finish" value={fmtDate(c.forecastFinish)} sub={`Status date ${fmtDate(c.statusDate)}`} />
                <Tile label="Finish variance" value={v(c.projectFinishVarianceDays)} tone={c.projectFinishVarianceDays > 0 ? 'bad' : c.projectFinishVarianceDays < 0 ? 'good' : undefined} sub="Working days" />
                {c.original ? <Tile label="Against the original (0)" value={v(c.original.finishVarianceDays)} sub={`Original finish ${fmtDate(c.original.projectFinish)}`} tone={c.original.finishVarianceDays > 0 ? 'bad' : undefined} /> : null}
              </div>
              <div className="pc-table-wrap">
                <table className="pc-table">
                  <thead>
                    <tr><th>ID</th><th>Task</th><th>Baseline</th><th>Current / forecast</th><th>Actual</th><th className="num">Start var.</th><th className="num">Finish var.</th><th className="num">Duration var.</th><th className="num">Progress var.</th>{c.baseline.currency ? <><th className="num">Baseline cost</th><th className="num">Cost var.</th></> : null}</tr>
                  </thead>
                  <tbody>
                    {(c.rows as CompareRow[]).map((r) => (
                      <tr key={r.itemId} className={r.inPlan ? 'clickable' : ''} onClick={() => r.inPlan && onOpenItem(r.itemId)}>
                        <td><TaskKey value={r.key} /></td>
                        <td className="wrap">{r.name}{!r.inPlan ? <div className="small muted">No longer in the plan</div> : !r.inBaseline ? <div className="small muted">Added after this baseline</div> : null}</td>
                        <td className="small">{r.baselineStart ? `${r.baselineStart} → ${r.baselineFinish}` : '—'}</td>
                        <td className="small">{r.currentStart ? `${r.currentStart} → ${r.currentFinish}` : '—'}</td>
                        <td className="small">{r.actualStart ? `${r.actualStart} → ${r.actualFinish ?? 'in progress'}` : '—'}</td>
                        <td className={`num ${tone(r.startVarianceDays)}`}>{v(r.startVarianceDays)}</td>
                        <td className={`num ${tone(r.finishVarianceDays)}`}>{v(r.finishVarianceDays)}</td>
                        <td className={`num ${tone(r.durationVarianceDays)}`}>{v(r.durationVarianceDays)}</td>
                        <td className={`num ${tone(r.progressVariance == null ? null : -r.progressVariance)}`} title={r.plannedPercent != null ? `Planned ${r.plannedPercent}% by the status date; done ${r.percentComplete ?? 0}%` : ''}>{v(r.progressVariance, ' pts')}</td>
                        {c.baseline.currency ? <><td className="num">{money(r.baselineCost)}</td><td className={`num ${r.costVariance && !r.costVariance.startsWith('-') && r.costVariance !== '0.00' ? 'pc-neg' : ''}`}>{money(r.costVariance)}</td></> : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small muted">Variances are in working days on the project calendar; positive is later or longer than the baseline. Progress variance: percent complete now minus the percent the baseline planned by the status date. Cost variance: current budget minus the baseline budget.</p>
            </>
          ) : <p className="muted">{c?.reason}</p>}
        </div>
      ) : null}
    </div>
  );
}
