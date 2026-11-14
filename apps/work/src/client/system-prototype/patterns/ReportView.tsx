// The report pattern: date range and company, department and site filters, figures, charts, a detailed table,
// drill-down from chart to table to record, CSV export and saved reports (kept on this computer in the prototype).
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, useToast } from '../../components/ui/overlays';
import { COMPANIES, DEPARTMENTS } from '../data/core';
import { addDays, compactMoney, downloadCsv, exportMessage, fmtDate, money, monthLabel, PHONE, readStore, TODAY, useMedia, writeStore } from '../format';
import { PIcon } from '../icons';
import { Empty, Panel, StatusBadge } from '../kit';
import { RecLink } from '../links';
import { BarChart, ChartFrame, HBarChart, Legend } from '../widgets/charts';

export interface ReportRow {
  id: string;
  date: string;
  label: string;
  company: string;
  department: string;
  site: string;
  value: number;
  cost: number;
  status?: string;
  /** The breakdown of the second chart, when it is not a column of its own. */
  group?: string;
}
export interface ReportDef {
  id: string;
  title: string;
  valueLabel: string;
  breakdownLabel: string;
  breakdown: (r: ReportRow) => string;
  rows: ReportRow[];
  target?: (month: string) => number;
  labelHeader: string;
}
export interface Filters {
  from: string;
  to: string;
  company: string;
  department: string;
  site: string;
}
const DEFAULT: Filters = { from: '2025-12-01', to: TODAY, company: COMPANIES[0].name, department: 'All departments', site: 'All sites' };
const PRESETS: [string, () => Partial<Filters>][] = [
  ['This month', () => ({ from: `${TODAY.slice(0, 7)}-01`, to: TODAY })],
  ['Last 3 months', () => ({ from: addDays(TODAY, -91), to: TODAY })],
  ['Year to date', () => ({ from: `${TODAY.slice(0, 4)}-01-01`, to: TODAY })],
  ['Last 12 months', () => ({ from: '2025-12-01', to: TODAY })],
];
interface Saved {
  id: string;
  name: string;
  report: string;
  filters: Filters;
}
export const savedReports = (): Saved[] => readStore('reports', []);

export function ReportView({ def }: { def: ReportDef }) {
  const toast = useToast();
  const phone = useMedia(PHONE);
  const [params] = useSearchParams();
  const fromSaved = savedReports().find((s) => s.id === params.get('saved'));
  const [filters, setFilters] = useState<Filters>(fromSaved?.filters ?? DEFAULT);
  const [drill, setDrill] = useState<{ month?: string; group?: string }>({});
  const [saved, setSaved] = useState<Saved[]>(savedReports);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState('');
  const set = (p: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...p }));
    setDrill({});
  };
  const inScope = useMemo(
    () =>
      def.rows.filter(
        (r) =>
          r.date >= filters.from &&
          r.date <= filters.to &&
          r.company === filters.company &&
          (filters.department === 'All departments' || r.department === filters.department) &&
          (filters.site === 'All sites' || r.site === filters.site),
      ),
    [def, filters],
  );
  const months = Array.from(new Set(inScope.map((r) => r.date.slice(0, 7)))).sort();
  const byMonth = months.map((m) => inScope.filter((r) => r.date.startsWith(m)).reduce((s, r) => s + r.value, 0));
  const groups = Array.from(new Set(inScope.map(def.breakdown)));
  const byGroup = groups.map((g) => ({ g, value: inScope.filter((r) => def.breakdown(r) === g).reduce((s, r) => s + r.value, 0), cost: inScope.filter((r) => def.breakdown(r) === g).reduce((s, r) => s + r.cost, 0) })).sort((a, b) => b.value - a.value);
  const table = inScope.filter((r) => (!drill.month || r.date.startsWith(drill.month)) && (!drill.group || def.breakdown(r) === drill.group)).sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = inScope.reduce((s, r) => s + r.value, 0);
  const cost = inScope.reduce((s, r) => s + r.cost, 0);
  const margin = total ? ((total - cost) / total) * 100 : 0;
  const exportCsv = () => {
    void downloadCsv(`${def.id}.csv`, ['Number', def.labelHeader, 'Date', 'Department', 'Site', def.valueLabel, 'Gross margin'], table.map((r) => [r.id, r.label, r.date, r.department, r.site, r.value.toFixed(2), (r.value - r.cost).toFixed(2)])).then((o) => toast(exportMessage(o, `${table.length} rows`, `${def.id}.csv`)));
  };
  return (
    <div className="erp-report">
      <section className="card erp-report-filters" aria-label="Report filters" data-hl="report-filters">
        <div className="erp-filter-grid">
          <div className="field">
            <label htmlFor="rf-from">From</label>
            <input id="rf-from" type="date" className="input sm" value={filters.from} onChange={(e) => set({ from: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="rf-to">To</label>
            <input id="rf-to" type="date" className="input sm" value={filters.to} onChange={(e) => set({ to: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="rf-company">Company</label>
            <select id="rf-company" className="select sm" value={filters.company} onChange={(e) => set({ company: e.target.value })}>
              {COMPANIES.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rf-dept">Department</label>
            <select id="rf-dept" className="select sm" value={filters.department} onChange={(e) => set({ department: e.target.value })} data-hl="report-department">
              <option>All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rf-site">Site</label>
            <select id="rf-site" className="select sm" value={filters.site} onChange={(e) => set({ site: e.target.value })}>
              <option>All sites</option>
              <option>Brisbane</option>
              <option>Sydney</option>
            </select>
          </div>
        </div>
        <div className="row wrap erp-report-actions">
          <div className="erp-presets" role="group" aria-label="Date range presets">
            {PRESETS.map(([label, fn]) => (
              <button key={label} type="button" className="btn sm" onClick={() => set(fn())}>
                {label}
              </button>
            ))}
          </div>
          <span className="spacer" />
          {saved.filter((s) => s.report === def.id).length ? (
            <>
              <label htmlFor="rf-saved" className="sr-only">
                Saved reports
              </label>
              <select
                id="rf-saved"
                className="select sm erp-saved-select"
                value=""
                onChange={(e) => {
                  const s = saved.find((x) => x.id === e.target.value);
                  if (s) {
                    setFilters(s.filters);
                    setDrill({});
                    toast(`Loaded "${s.name}".`);
                  }
                }}
              >
                <option value="">Saved reports…</option>
                {saved
                  .filter((s) => s.report === def.id)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </>
          ) : null}
          <button type="button" className="btn sm" onClick={() => { setName(''); setSaveOpen(true); }}>
            <PIcon name="star" size={14} /> Save report
          </button>
          <button type="button" className="btn primary sm" onClick={exportCsv} data-hl="report-export">
            <PIcon name="download" size={14} /> Export CSV
          </button>
        </div>
      </section>

      {!inScope.length ? (
        <Empty icon="chart" title="No figures for these filters" action={<button type="button" className="btn" onClick={() => set(DEFAULT)}>Reset filters</button>}>
          {filters.company !== COMPANIES[0].name ? 'The demonstration data has figures for Example Engineering only.' : 'Widen the date range or choose all departments and sites.'}
        </Empty>
      ) : (
        <>
          <div className="erp-kpis" role="list" aria-label="Key figures">
            <div className="erp-kpi" role="listitem">
              <span className="erp-kpi-label">{def.valueLabel}</span>
              <span className="erp-kpi-value">{compactMoney(total)}</span>
            </div>
            <div className="erp-kpi" role="listitem">
              <span className="erp-kpi-label">Gross margin</span>
              <span className="erp-kpi-value">{margin.toFixed(1)}%</span>
            </div>
            <div className="erp-kpi" role="listitem">
              <span className="erp-kpi-label">Records</span>
              <span className="erp-kpi-value">{inScope.length}</span>
            </div>
            <div className="erp-kpi" role="listitem">
              <span className="erp-kpi-label">Average</span>
              <span className="erp-kpi-value">{compactMoney(total / inScope.length)}</span>
            </div>
          </div>
          <div className="erp-report-charts">
            <Panel title={`${def.valueLabel} by month`} hl="report-chart">
              <ChartFrame
                headers={['Month', def.valueLabel, ...(def.target ? ['Target'] : [])]}
                rows={months.map((m, i) => [monthLabel(`${m}-01`), money(byMonth[i]), ...(def.target ? [money(def.target(m))] : [])])}
                legend={def.target ? <Legend items={[{ name: def.valueLabel, cls: 'erp-s1' }, { name: 'Target', cls: 'target', dashed: true }]} /> : undefined}
              >
                <BarChart
                  label={`${def.valueLabel} by month. Select a month to filter the table.`}
                  labels={months.map((m) => monthLabel(`${m}-01`))}
                  series={[{ name: def.valueLabel, values: byMonth }]}
                  target={def.target ? { name: 'Target', values: months.map((m) => def.target!(m)) } : undefined}
                  format={compactMoney}
                  height={210}
                  selected={drill.month ? months.indexOf(drill.month) : null}
                  onSelect={(i) => setDrill((d) => ({ ...d, month: d.month === months[i] ? undefined : months[i] }))}
                />
              </ChartFrame>
              <p className="muted small">Select a month to see its records in the table.</p>
            </Panel>
            <Panel title={`${def.valueLabel} by ${def.breakdownLabel.toLowerCase()}`}>
              <HBarChart
                label={`${def.valueLabel} by ${def.breakdownLabel.toLowerCase()}`}
                items={byGroup.slice(0, 8).map((g) => ({ label: g.g, value: g.value, note: `${g.value ? (((g.value - g.cost) / g.value) * 100).toFixed(0) : 0}% margin` }))}
                format={compactMoney}
                onSelect={(i) => setDrill((d) => ({ ...d, group: d.group === byGroup[i].g ? undefined : byGroup[i].g }))}
              />
            </Panel>
          </div>
          <Panel
            title="Detailed records"
            hl="report-table"
            actions={
              drill.month || drill.group ? (
                <span className="row wrap">
                  {drill.month ? <span className="badge erp-badge-accent">Month: {monthLabel(`${drill.month}-01`)}</span> : null}
                  {drill.group ? <span className="badge erp-badge-accent">{def.breakdownLabel}: {drill.group}</span> : null}
                  <button type="button" className="btn ghost sm" onClick={() => setDrill({})}>
                    Show all
                  </button>
                </span>
              ) : null
            }
          >
            {phone ? (
              <ul className="erp-cards">
                {table.slice(0, 30).map((r) => (
                  <li key={r.id} className="erp-card">
                    <div className="erp-card-top">
                      <RecLink id={r.id} />
                      {r.status ? <StatusBadge status={r.status} /> : null}
                    </div>
                    <div className="erp-card-title">{r.label}</div>
                    <div className="erp-card-row">
                      <span className="muted small">{fmtDate(r.date)}</span>
                      <span>{money(r.value)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="erp-table-scroll">
                <table className="data-table erp-table">
                  <caption className="sr-only">Records behind the figures, {table.length} rows</caption>
                  <thead>
                    <tr>
                      <th scope="col">Number</th>
                      <th scope="col">{def.labelHeader}</th>
                      <th scope="col">Date</th>
                      <th scope="col">Department</th>
                      <th scope="col">Site</th>
                      <th scope="col" className="num">
                        {def.valueLabel}
                      </th>
                      <th scope="col" className="num">
                        Gross margin
                      </th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.slice(0, 40).map((r) => (
                      <tr key={r.id}>
                        <td>
                          <RecLink id={r.id} />
                        </td>
                        <td>{r.label}</td>
                        <td>{fmtDate(r.date)}</td>
                        <td>{r.department}</td>
                        <td>{r.site}</td>
                        <td className="num">{money(r.value)}</td>
                        <td className="num">{money(r.value - r.cost)}</td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {table.length > 40 ? <p className="muted small">Showing 40 of {table.length}. Export to see every row.</p> : null}
          </Panel>
        </>
      )}

      {saveOpen ? (
        <Modal
          title="Save this report"
          onClose={() => setSaveOpen(false)}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setSaveOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                disabled={!name.trim()}
                onClick={() => {
                  const next = [...saved, { id: `r${Date.now()}`, name: name.trim(), report: def.id, filters }];
                  setSaved(next);
                  writeStore('reports', next);
                  setSaveOpen(false);
                  toast(`Report "${name.trim()}" saved on this computer.`);
                }}
              >
                Save report
              </button>
            </>
          }
        >
          <div className="field">
            <label htmlFor="report-name">Name</label>
            <input id="report-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="For example: Sydney, last 3 months" />
            <span className="hint">Keeps the date range and filters. Scheduling by email is planned.</span>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
