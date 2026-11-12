import { Fragment, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { formatMoney, toScaled } from '../../../shared/money';
import { errorMessage, get, post } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { todayISO } from '../../lib/format';
import { useToast } from '../../components/ui/overlays';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { TaskKey, fmtDate } from './schedule';
import { Bars, LineChart } from './charts';
import { Tile, type ControlsProps } from './ProjectControls';

type Method = 'cpi' | 'budget' | 'cpiSpi';
const METHOD_LABELS: Record<Method, string> = {
  cpi: 'Current cost performance continues (EAC = BAC / CPI)',
  budget: 'Remaining work at the budgeted rate (EAC = AC + (BAC − EV))',
  cpiSpi: 'Cost and schedule performance continue (EAC = AC + (BAC − EV) / (CPI × SPI))',
};

export default function EarnedValueTab({ bundle, onOpenItem }: ControlsProps) {
  const boardId = bundle.board.id;
  const toast = useToast();
  const [statusDate, setStatusDate] = useState(todayISO());
  const [baseline, setBaseline] = useState('');
  const [group, setGroup] = useState('');
  const [method, setMethod] = useState<Method>('cpi');
  const [report, setReport] = useState<{ id: string; files: Record<string, unknown> } | null>(null);
  const [busy, setBusy] = useState(false);
  const q = useQuery({
    queryKey: ['evm', boardId, statusDate, baseline, group],
    queryFn: () => get<any>(`/boards/${boardId}/evm?statusDate=${statusDate}${baseline ? `&baseline=${baseline}` : ''}${group ? `&group=${group}` : ''}`),
    placeholderData: keepPreviousData,
    retry: false,
  });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const d = q.data;
  const cur = d.currency as string | null;
  const m = (v: string | null | undefined) => (v == null ? <span className="pc-unavailable">Unavailable</span> : formatMoney(v, cur));
  const num = (v: string | null | undefined) => (v == null ? null : Number(toScaled(v) ?? 0n) / 10000);
  const r2 = (v: number | null | undefined) => (v == null ? <span className="pc-unavailable">Unavailable</span> : v.toFixed(2));
  const defs: Record<string, string> = d.definitions ?? {};

  const controls = (
    <div className="row wrap" style={{ gap: 10, marginBottom: 12 }}>
      <label className="small">Status date <input className="input" type="date" value={statusDate} max={todayISO()} onChange={(e) => e.target.value && setStatusDate(e.target.value)} /></label>
      <label className="small">Baseline{' '}
        <select className="select" value={baseline} onChange={(e) => setBaseline(e.target.value)}>
          <option value="">Latest approved</option>
          {(d.baselines ?? []).map((b: any) => <option key={b.id} value={b.id}>Baseline {b.number}: {b.name}</option>)}
        </select>
      </label>
      <label className="small">Category{' '}
        <select className="select" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Whole project</option>
          {bundle.groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </label>
      <span className="spacer" />
      {d.available && bundle.board.caps?.generateReports ? (
        <button
          className="btn"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              setReport(await post(`/boards/${boardId}/reports`, { type: 'earned_value', end: statusDate, ...(baseline ? { baselineId: baseline } : {}) }));
              toast('Earned value report saved (PDF, Excel, HTML, CSV)');
            } catch (e) {
              toast(errorMessage(e), 'error');
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? 'Creating…' : 'Create earned value report'}
        </button>
      ) : null}
      {report ? ['pdf', 'xlsx'].map((f) => <a key={f} className="btn sm" href={appUrl(`/api/reports/${report.id}/download/${f}`)} download>{f === 'pdf' ? 'PDF' : 'Excel'}</a>) : null}
    </div>
  );

  if (!d.available) return <div>{controls}<p className="muted">{d.reason}</p></div>;
  const mt = d.metrics;
  const eac = mt.eac[method];
  const etc = mt.etc[method];
  const vac = mt.vac[method];
  const vacNeg = vac && vac.startsWith('-');
  const cpiWord = mt.cpi == null ? 'Unavailable: no actual cost recorded' : mt.cpiStatus === 'below' ? 'Over budget for the work done' : mt.cpiStatus === 'above' ? 'Better cost efficiency than planned' : 'On budget';
  const spiWord = mt.spi == null ? 'Unavailable: nothing was planned yet' : mt.spiStatus === 'below' ? 'Behind planned progress' : mt.spiStatus === 'above' ? 'Ahead of planned progress' : 'On planned progress';
  const trend = (d.trend ?? []) as { date: string; pv: string | null; ev: string | null; ac: string | null; cpi: number | null; spi: number | null }[];
  const labels = trend.map((t) => t.date);
  const bac = num(mt.bac) || 0;
  const pct = (v: string | null) => (v == null || !bac ? null : Math.round(((num(v) ?? 0) / bac) * 1000) / 10);
  const fmtShort = (v: number) => formatMoney(String(Math.round(v)), cur, { digits: 0 });
  return (
    <div>
      {controls}
      <p className="small muted" style={{ marginTop: 0 }}>
        Baseline {d.baseline.number} ({d.baseline.name}), approved {fmtDate(d.baseline.approvedOn)} by {d.baseline.approvedBy}. Status date {fmtDate(d.statusDate)}. Amounts in {cur}.
      </p>
      {d.warnings?.length ? <ul className="pc-warnings">{d.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul> : null}
      <div className="pc-tiles">
        <Tile label="BAC" value={m(mt.bac)} title={defs.BAC} sub="Budget at completion" />
        <Tile label="PV" value={m(mt.pv)} title={defs.PV} sub="Planned value" />
        <Tile label="EV" value={m(mt.ev)} title={defs.EV} sub="Earned value" />
        <Tile label="AC" value={m(mt.ac)} title={defs.AC} sub={mt.ac == null ? 'Not recorded' : `Actual cost (${mt.acCoverage.withActuals} of ${mt.acCoverage.tasks} tasks)`} />
        <Tile label="CV" value={m(mt.cv)} title={defs.CV} tone={mt.cv == null ? undefined : mt.cv.startsWith('-') ? 'bad' : 'good'} sub="EV − AC" />
        <Tile label="SV" value={m(mt.sv)} title={defs.SV} tone={mt.sv.startsWith('-') ? 'bad' : 'good'} sub="EV − PV" />
        <Tile label="CPI" value={r2(mt.cpi)} title={defs.CPI} tone={mt.cpiStatus === 'below' ? 'bad' : mt.cpiStatus === 'unavailable' ? undefined : 'good'} sub={cpiWord} />
        <Tile label="SPI" value={r2(mt.spi)} title={defs.SPI} tone={mt.spiStatus === 'below' ? 'bad' : mt.spiStatus === 'unavailable' ? undefined : 'good'} sub={spiWord} />
        <Tile label="EAC" value={m(eac)} title={defs.EAC} sub="Estimate at completion" tone={vacNeg ? 'bad' : undefined} />
        <Tile label="ETC" value={m(etc)} title={defs.ETC} sub="Estimate to complete" />
        <Tile label="VAC" value={m(vac)} title={defs.VAC} tone={vac == null ? undefined : vacNeg ? 'bad' : 'good'} sub="BAC − EAC" />
        <Tile label="TCPI" value={r2(mt.tcpiBac)} title={defs.TCPI} sub={`To meet BAC; to meet EAC: ${mt.tcpiEac == null ? 'unavailable' : mt.tcpiEac.toFixed(2)}`} tone={mt.tcpiBac != null && mt.tcpiBac > 1.1 ? 'bad' : undefined} />
      </div>
      <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
        <label className="small" htmlFor="evm-method">Forecast method</label>
        <select id="evm-method" className="select" value={method} onChange={(e) => setMethod(e.target.value as Method)}>
          {(Object.keys(METHOD_LABELS) as Method[]).map((k) => <option key={k} value={k}>{METHOD_LABELS[k]}</option>)}
        </select>
      </div>
      {mt.earlyStage ? <p className="small muted">Less than 10% of the budget is earned: treat CPI and SPI with caution.</p> : null}

      <div className="pc-grid-2">
        <div className="pc-section">
          <h3>A. Planned value, earned value and actual cost (cumulative)</h3>
          <LineChart title="PV, EV and AC over time" labels={labels} format={fmtShort} series={[{ key: 'pv', label: 'Planned value (PV)', cls: 'pv', values: trend.map((t) => num(t.pv)) }, { key: 'ev', label: 'Earned value (EV)', cls: 'ev', values: trend.map((t) => num(t.ev)) }, { key: 'ac', label: 'Actual cost (AC)', cls: 'ac', values: trend.map((t) => num(t.ac)) }]} />
        </div>
        <div className="pc-section">
          <h3>B. CPI and C. SPI</h3>
          <LineChart title="CPI and SPI over time" labels={labels} refLine={1} format={(v) => v.toFixed(2)} series={[{ key: 'cpi', label: 'CPI', cls: 'cpi', values: trend.map((t) => t.cpi) }, { key: 'spi', label: 'SPI', cls: 'spi', values: trend.map((t) => t.spi) }]} />
        </div>
        <div className="pc-section">
          <h3>D. Budget and forecast</h3>
          <Bars rows={[{ label: 'Budget (BAC)', value: num(mt.bac) }, { label: 'EAC by CPI', value: num(mt.eac.cpi) }, { label: 'EAC at budget rate', value: num(mt.eac.budget) }, { label: 'EAC by CPI × SPI', value: num(mt.eac.cpiSpi) }]} format={fmtShort} danger={(l) => l.startsWith('EAC') && !!bac} />
        </div>
        <div className="pc-section">
          <h3>E. Planned and actual progress</h3>
          <LineChart title="Planned and earned progress, percent of budget" labels={labels} format={(v) => `${Math.round(v)}%`} series={[{ key: 'pp', label: 'Planned (PV / BAC)', cls: 'pv', values: trend.map((t) => pct(t.pv)) }, { key: 'ep', label: 'Earned (EV / BAC)', cls: 'ev', values: trend.map((t) => pct(t.ev)) }]} />
        </div>
        <div className="pc-section">
          <h3>F. Planned cost distribution</h3>
          <LineChart title="Cumulative planned value of the baseline" labels={(d.plan ?? []).map((p: any) => p.date)} format={fmtShort} series={[{ key: 'plan', label: 'Baseline planned value', cls: 'plan', values: (d.plan ?? []).map((p: any) => num(p.pv)) }]} />
        </div>
        <div className="pc-section">
          <h3>Actual cost by category</h3>
          {d.costByCategory?.length ? <Bars rows={d.costByCategory.map((c: any) => ({ label: c.category, value: num(c.amount) }))} format={fmtShort} /> : <p className="muted small">No dated cost entries yet. Record costs in a task’s Schedule tab.</p>}
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Tasks</h3>
      <div className="pc-table-wrap">
        <table className="pc-table">
          <thead><tr><th>ID</th><th>Task</th><th>Earning method</th><th className="num">BAC</th><th className="num">Planned %</th><th className="num">Earned %</th><th className="num">PV</th><th className="num">EV</th><th className="num">AC</th><th className="num">CV</th><th className="num">SV</th></tr></thead>
          <tbody>
            {d.tasks.map((t: any) => (
              <tr key={t.itemId} className="clickable" onClick={() => onOpenItem(t.itemId)}>
                <td><TaskKey value={t.key} /></td>
                <td className="wrap">{t.name}{t.note ? <div className="small muted">{t.note}</div> : null}</td>
                <td className="small">{t.methodLabel}</td>
                <td className="num">{m(t.bac)}</td>
                <td className="num">{t.plannedPercent}%</td>
                <td className="num">{t.earnedPercent}%</td>
                <td className="num">{m(t.pv)}</td>
                <td className="num">{m(t.ev)}</td>
                <td className="num">{m(t.ac)}</td>
                <td className={`num ${t.cv?.startsWith('-') ? 'pc-neg' : ''}`}>{m(t.cv)}</td>
                <td className={`num ${t.sv?.startsWith('-') ? 'pc-neg' : ''}`}>{m(t.sv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details style={{ marginTop: 12 }}>
        <summary>Definitions and formulas</summary>
        <dl className="pc-defs" style={{ marginTop: 8 }}>
          {Object.entries(defs).map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}
        </dl>
      </details>
    </div>
  );
}
