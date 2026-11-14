// Module screens that are more than a list: the CRM overview and pipeline board, the Finance dashboard, banking,
// accounting, GST and BAS, budgets, teams, the project schedule, supplier performance, warehouses and bins,
// production planning, the delivery schedule and the demand plan.
import { useState, type CSSProperties, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/overlays';
import { DEPARTMENTS, PEOPLE, itemName } from '../data/core';
import * as OP from '../data/operations';
import * as SF from '../data/sales-finance';
import { addDays, compactMoney, fmtDate, money, parseDate, PHONE, TODAY, useMedia } from '../format';
import { PIcon } from '../icons';
import { Avatar, Facts, Meter, Panel, StatusBadge, Tabs } from '../kit';
import { RecLink } from '../links';
import { ListView } from '../patterns/ListView';
import { ENTITIES, useRows } from '../registry';
import { useErp } from '../state';
import type { NavPage } from '../types';
import { HBarChart } from '../widgets/charts';
import { WIDGETS } from '../widgets/catalog';
import { ModulePage } from './common';

function WidgetBox({ id, size = 'm' }: { id: string; size?: 's' | 'm' | 'l' | 'f' }) {
  const w = WIDGETS[id];
  return (
    <section className={`card erp-widget size-${size} kind-${w.kind.toLowerCase()}`} aria-labelledby={`mw-${id}`}>
      <div className="erp-widget-head">
        <h2 id={`mw-${id}`}>{w.title}</h2>
      </div>
      <div className="erp-widget-body">{w.render()}</div>
    </section>
  );
}

// ------------------------------------------------------------------ Sales & Customers

export function SalesOverview({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="The CRM overview: pipeline, quotes and follow-ups.">
      <div className="erp-dash">
        <WidgetBox id="sa-pipeline" size="s" />
        <WidgetBox id="sa-winrate" size="s" />
        <WidgetBox id="sa-quotes" size="s" />
        <WidgetBox id="sa-orders" size="s" />
        <WidgetBox id="sa-pipeline-stage" />
        <WidgetBox id="sa-followups" />
        <WidgetBox id="ceo-top-customers" size="f" />
      </div>
    </ModulePage>
  );
}

const STAGES = ['Qualify', 'Proposal', 'Negotiation', 'Won', 'Lost'];
export function Pipeline({ page }: { page: NavPage }) {
  const rows = useRows('opportunity');
  const { patchRecord, site } = useErp();
  const toast = useToast();
  const [mode, setMode] = useState<'board' | 'list'>('board');
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const move = (id: string, stage: string) => {
    const r = rows.find((x) => x.id === id);
    if (!r || r.stage === stage) return;
    const before = { stage: r.stage, probability: r.probability };
    patchRecord('opportunity', id, { stage, probability: { Qualify: 20, Proposal: 45, Negotiation: 70, Won: 100, Lost: 0 }[stage] });
    toast(`${id} moved to ${stage}.`, 'info', { label: 'Undo', run: () => patchRecord('opportunity', id, before) });
  };
  const visible = rows.filter((r) => site === 'All sites' || r.site === site);
  return (
    <ModulePage
      page={page}
      actions={
        <>
          <div className="erp-seg" role="radiogroup" aria-label="View">
            <button type="button" role="radio" aria-checked={mode === 'board'} className={`btn${mode === 'board' ? ' active' : ''}`} onClick={() => setMode('board')}>
              <PIcon name="kanban" /> Board
            </button>
            <button type="button" role="radio" aria-checked={mode === 'list'} className={`btn${mode === 'list' ? ' active' : ''}`} onClick={() => setMode('list')}>
              <PIcon name="list" /> List
            </button>
          </div>
          <Link to="/sales/opportunities/new" className="btn primary">
            <PIcon name="plus" /> New opportunity
          </Link>
        </>
      }
    >
      {mode === 'list' ? (
        <ListView def={ENTITIES.opportunity} basePath={page.path} label="Opportunities" />
      ) : (
        <div className="erp-board" role="list" aria-label="Pipeline by stage">
          {STAGES.map((st) => {
            const cards = visible.filter((r) => r.stage === st);
            return (
              <section
                key={st}
                role="listitem"
                className={`erp-lane${over === st ? ' drop' : ''}`}
                aria-labelledby={`lane-${st}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(st);
                }}
                onDragLeave={() => setOver((o) => (o === st ? null : o))}
                onDrop={(e: DragEvent) => {
                  e.preventDefault();
                  if (drag) move(drag, st);
                  setDrag(null);
                  setOver(null);
                }}
              >
                <h2 id={`lane-${st}`} className="erp-lane-head">
                  <span className="grow">{st}</span>
                  <span className="muted small">
                    {cards.length} · {compactMoney(cards.reduce((s, c) => s + c.value, 0))}
                  </span>
                </h2>
                <ul className="erp-lane-body">
                  {cards.map((c) => (
                    <li key={c.id} className={`erp-kcard${drag === c.id ? ' dragging' : ''}`} draggable onDragStart={() => setDrag(c.id)} onDragEnd={() => setDrag(null)} data-hl={c.id}>
                      <Link to={`/sales/opportunities/${c.id}`} className="erp-kcard-title">
                        {c.title}
                      </Link>
                      <span className="muted small">{c.customer}</span>
                      <span className="erp-kcard-meta">
                        <strong>{compactMoney(c.value)}</strong>
                        <span className="muted small">Close {fmtDate(c.close)}</span>
                      </span>
                      <label className="sr-only" htmlFor={`stage-${c.id}`}>
                        Stage of {c.title}
                      </label>
                      <select id={`stage-${c.id}`} className="select sm" value={c.stage} onChange={(e) => move(c.id, e.target.value)}>
                        {STAGES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </li>
                  ))}
                  {!cards.length ? <li className="muted small erp-lane-empty">No opportunities</li> : null}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Finance

export function FinanceDashboard({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="Cash, receivables, payables and GST from Finance.">
      <div className="erp-dash">
        <WidgetBox id="fi-cash" size="s" />
        <WidgetBox id="fi-ar" size="s" />
        <WidgetBox id="fi-ap" size="s" />
        <WidgetBox id="fi-gst" size="s" />
        <WidgetBox id="fi-forecast" />
        <WidgetBox id="fi-overdue" />
        <WidgetBox id="ac-ageing" />
        <WidgetBox id="fi-bills" />
      </div>
    </ModulePage>
  );
}

export function Banking({ page }: { page: NavPage }) {
  const toast = useToast();
  const [lines, setLines] = useState(SF.statementLines);
  return (
    <ModulePage page={page} subtitle="Bank accounts and statement lines to match. Finance never connects to banks: statements are imported as files.">
      <div className="erp-cardgrid">
        {SF.bankAccounts.map((a) => (
          <div key={a.id} className="card erp-acct">
            <span className="muted small">
              {a.name} · {a.number}
            </span>
            <strong className="erp-acct-bal">{money(a.balance, true)}</strong>
            <span className={a.unreconciled ? 'warning-text small' : 'muted small'}>{a.unreconciled ? `${a.unreconciled} lines to match` : 'All matched'}</span>
          </div>
        ))}
      </div>
      <Panel title="Statement lines, operating account">
        <div className="erp-table-scroll">
          <table className="data-table erp-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col" className="num">
                  Amount
                </th>
                <th scope="col">Suggested match</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id}>
                  <td>{fmtDate(l.date)}</td>
                  <td>{l.description}</td>
                  <td className={`num${l.amount < 0 ? ' danger-text' : ''}`}>{money(l.amount, true)}</td>
                  <td>{l.suggestion ? <RecLink id={l.suggestion} /> : <span className="muted">None</span>}</td>
                  <td>
                    <StatusBadge status={l.status} />
                  </td>
                  <td>
                    {l.status === 'To match' ? (
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => {
                          setLines((ls) => ls.map((x) => (x.id === l.id ? { ...x, status: 'Matched' } : x)));
                          toast(l.suggestion ? `Matched to ${l.suggestion}.` : 'Transaction created (prototype).');
                        }}
                      >
                        {l.suggestion ? 'Match' : 'Create transaction'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModulePage>
  );
}

export function Accounting({ page }: { page: NavPage }) {
  const [tab, setTab] = useState('chart');
  return (
    <ModulePage page={page}>
      <Tabs
        tabs={[
          { id: 'chart', label: 'Chart of accounts' },
          { id: 'journals', label: 'Journals' },
          { id: 'tax', label: 'Tax codes' },
          { id: 'lock', label: 'Period lock' },
        ]}
        active={tab}
        onChange={setTab}
        label="Accounting"
      />
      <div role="tabpanel" className="erp-tabpanel">
        {tab === 'chart' ? (
          <Panel title="Chart of accounts">
            <div className="erp-table-scroll">
              <table className="data-table erp-table">
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Account</th>
                    <th scope="col">Type</th>
                    <th scope="col" className="num">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SF.chartOfAccounts.map((a) => (
                    <tr key={a.code}>
                      <td className="mono">{a.code}</td>
                      <td>{a.name}</td>
                      <td>{a.type}</td>
                      <td className="num">{money(Number(a.balance), true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        ) : tab === 'journals' ? (
          <Panel title="Journals this month">
            <ul className="erp-plain-list">
              <li>JNL-1184 · Stock valuation from System receipts (planned link) · {fmtDate('2026-11-12')}</li>
              <li>JNL-1183 · Payroll, fortnight to 7 Nov · {fmtDate('2026-11-08')}</li>
              <li>JNL-1182 · Depreciation, October · {fmtDate('2026-11-01')}</li>
            </ul>
          </Panel>
        ) : tab === 'tax' ? (
          <Panel title="Tax codes">
            <Facts items={[['GST', '10% on sales and purchases'], ['GST free', 'Exports and some services'], ['Input taxed', 'Financial supplies'], ['BAS excluded', 'Wages, transfers']]} columns={2} />
          </Panel>
        ) : (
          <Panel title="Period lock">
            <Facts items={[['Locked up to', fmtDate('2026-10-31')], ['Locked by', 'Daniel Okafor'], ['Effect', 'No changes to transactions on or before the lock date']]} />
          </Panel>
        )}
      </div>
    </ModulePage>
  );
}

export function GstBas({ page }: { page: NavPage }) {
  const [sel, setSel] = useState(0);
  const p = SF.gstPeriods[sel];
  return (
    <ModulePage page={page} subtitle="The GST worksheet helps you prepare figures for your own lodgement. Finance never lodges with the ATO and is not a certified tax product.">
      <div className="erp-two">
        <Panel title="GST worksheet (working)">
          <label htmlFor="gst-period" className="label">
            Period
          </label>
          <select id="gst-period" className="select erp-inline-select" value={sel} onChange={(e) => setSel(Number(e.target.value))}>
            {SF.gstPeriods.map((g, i) => (
              <option key={g.period} value={i}>
                {g.period}
              </option>
            ))}
          </select>
          <Facts
            columns={2}
            items={[
              ['Total sales (G1)', money(p.sales)],
              ['GST on sales (1A)', money(p.gstOnSales)],
              ['Purchases', money(p.purchases)],
              ['GST on purchases (1B)', money(p.gstOnPurchases)],
              ['GST payable (1A minus 1B)', <strong key="n">{money(p.gstOnSales - p.gstOnPurchases)}</strong>],
              ['Status', <StatusBadge key="s" status={p.status} />],
            ]}
          />
        </Panel>
        <Panel title="BAS module (planned)">
          <p className="small">Planned for Stage 2 of the Finance brief: keep a snapshot of each period you have lodged yourself, so the figures behind it never change.</p>
          <ul className="erp-plain-list">
            {SF.gstPeriods
              .filter((g) => g.status === 'Lodged')
              .map((g) => (
                <li key={g.period}>
                  {g.period}: snapshot kept · GST payable {money(g.gstOnSales - g.gstOnPurchases)}
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </ModulePage>
  );
}

export function Budgets({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="Budget against actual for this financial year.">
      <Panel title="Budget 2026 to 2027">
        <div className="erp-table-scroll">
          <table className="data-table erp-table">
            <thead>
              <tr>
                <th scope="col">Account</th>
                <th scope="col" className="num">
                  Budget
                </th>
                <th scope="col" className="num">
                  Actual
                </th>
                <th scope="col" className="num">
                  Variance
                </th>
                <th scope="col">Used</th>
              </tr>
            </thead>
            <tbody>
              {SF.budgets.map((b) => (
                <tr key={b.name}>
                  <td>{b.name}</td>
                  <td className="num">{money(Number(b.budget))}</td>
                  <td className="num">{money(Number(b.actual))}</td>
                  <td className="num">{money(Number(b.actual) - Number(b.budget))}</td>
                  <td>
                    <Meter value={Number(b.actual)} max={Number(b.budget)} label={`${Math.round((Number(b.actual) / Number(b.budget)) * 100)}% of budget`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Projects & Tasks

export function Teams({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="Members and teams from Project Management, and company departments.">
      <div className="erp-cardgrid">
        {DEPARTMENTS.map((d) => {
          const people = PEOPLE.filter((p) => p.dept === d);
          if (!people.length) return null;
          return (
            <Panel key={d} title={d}>
              <ul className="erp-people">
                {people.map((p) => (
                  <li key={p.id}>
                    <Avatar name={p.name} />
                    <span className="grow">
                      <strong>{p.name}</strong>
                      <span className="muted small">
                        {p.title} · {p.site}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </ModulePage>
  );
}

export function Schedule({ page }: { page: NavPage }) {
  const phone = useMedia(PHONE);
  const start = '2026-08-01';
  const end = '2027-03-31';
  const span = (parseDate(end).getTime() - parseDate(start).getTime()) / 86_400_000;
  const pct = (iso: string) => Math.max(0, Math.min(100, ((parseDate(iso).getTime() - parseDate(start).getTime()) / 86_400_000 / span) * 100));
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  return (
    <ModulePage page={page} subtitle="Projects and milestones on a timeline. The working screen in Project Management also shows workload.">
      {phone ? (
        <ul className="erp-cards">
          {OP.projects.map((p) => (
            <li key={p.id} className="erp-card">
              <Link to={`/projects/projects/${p.id}`} className="erp-card-link">
                <span className="erp-card-top">
                  <span className="erp-id">{p.id}</span>
                  <StatusBadge status={p.status} />
                </span>
                <span className="erp-card-title">{p.name}</span>
                <span className="erp-card-row">
                  <span className="muted small">Dates</span>
                  <span>
                    {fmtDate(p.start)} to {fmtDate(p.end)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card erp-timeline-chart">
          <div className="erp-tl-head" aria-hidden>
            <span className="erp-tl-name">Project</span>
            <span className="erp-tl-months">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </span>
          </div>
          <ul className="erp-tl-rows" aria-label="Project timeline">
            {OP.projects.map((p) => {
              const ms = OP.milestones.filter((m) => m.project === p.id);
              return (
                <li key={p.id} className="erp-tl-row">
                  <Link to={`/projects/projects/${p.id}`} className="erp-tl-name">
                    <span className="erp-id">{p.id}</span> {p.name}
                  </Link>
                  <span className="erp-tl-track">
                    <span className="erp-tl-today" style={{ '--x': `${pct(TODAY)}%` } as CSSProperties} aria-hidden />
                    <span className={`erp-tl-bar s-${p.status.replace(/\s+/g, '').toLowerCase()}`} style={{ '--s': `${pct(p.start)}%`, '--w': `${Math.max(1, pct(p.end) - pct(p.start))}%` } as CSSProperties} role="img" aria-label={`${p.name}: ${fmtDate(p.start)} to ${fmtDate(p.end)}, ${p.progress}% done, ${p.status}`}>
                      <span className="erp-tl-fill" style={{ '--p': `${p.progress}%` } as CSSProperties} />
                    </span>
                    {ms.map((m) => (
                      <span key={m.name} className="erp-tl-ms" style={{ '--x': `${pct(m.date)}%` } as CSSProperties} title={`${m.name}, ${fmtDate(m.date)}`} role="img" aria-label={`Milestone: ${m.name}, ${fmtDate(m.date)}`} />
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="muted small erp-pad">
            Bars show each project’s dates and progress; diamonds are milestones; the vertical line is today ({fmtDate(TODAY)}).
          </p>
        </div>
      )}
    </ModulePage>
  );
}

export function ProjectDashboards({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page}>
      <div className="erp-dash">
        <WidgetBox id="pj-active" size="s" />
        <WidgetBox id="pj-overdue" size="s" />
        <WidgetBox id="pj-budget" size="s" />
        <WidgetBox id="mywork" size="s" />
        <WidgetBox id="pj-burndown" />
        <WidgetBox id="pj-overdue-list" />
      </div>
    </ModulePage>
  );
}

export function ProjectCosts({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="Company projects with their Finance figures.">
      <Panel title="Project costs">
        <div className="erp-table-scroll">
          <table className="data-table erp-table">
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col" className="num">
                  Budget
                </th>
                <th scope="col" className="num">
                  Spent
                </th>
                <th scope="col" className="num">
                  Remaining
                </th>
                <th scope="col">Budget used</th>
              </tr>
            </thead>
            <tbody>
              {OP.projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <RecLink id={p.id} /> {p.name}
                  </td>
                  <td className="num">{money(p.budget)}</td>
                  <td className="num">{money(p.spent)}</td>
                  <td className={`num${p.budget - p.spent < 0 ? ' danger-text' : ''}`}>{money(p.budget - p.spent)}</td>
                  <td>
                    <Meter value={p.spent} max={p.budget || 1} label={`${p.budget ? Math.round((p.spent / p.budget) * 100) : 0}% used`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Procurement

export function SupplierPerformancePage({ page }: { page: NavPage }) {
  const sorted = [...OP.suppliers].sort((a, b) => b.onTime - a.onTime);
  return (
    <ModulePage page={page} subtitle="On-time delivery, quality at receiving inspection and lead time, from purchase orders and goods receipts.">
      <div className="erp-two">
        <Panel title="On-time delivery by supplier">
          <HBarChart label="On-time delivery by supplier, this year" items={sorted.map((s) => ({ label: s.name, value: s.onTime, over: s.onTime < 85, note: s.onTime < 85 ? 'Below 85% goal' : undefined }))} format={(n) => `${n}%`} limit={85} limitLabel="Goal (85%)" />
        </Panel>
        <Panel title="Scorecard">
          <div className="erp-table-scroll">
            <table className="data-table erp-table">
              <thead>
                <tr>
                  <th scope="col">Supplier</th>
                  <th scope="col" className="num">
                    On time
                  </th>
                  <th scope="col" className="num">
                    Quality
                  </th>
                  <th scope="col" className="num">
                    Lead time
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <RecLink id={s.id}>{s.name}</RecLink>
                    </td>
                    <td className="num">{s.onTime}%</td>
                    <td className="num">{s.quality}%</td>
                    <td className="num">{s.leadTime} d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Inventory & Warehouse

export function Warehouses({ page }: { page: NavPage }) {
  const [wh, setWh] = useState(OP.WAREHOUSES[0].id);
  const [bin, setBin] = useState<string | null>('A-01-02');
  const w = OP.WAREHOUSES.find((x) => x.id === wh)!;
  const stockHere = OP.stock.filter((s) => s.warehouse === wh);
  const inBin = (b: string) => stockHere.filter((s) => s.bin.startsWith(b.slice(0, 4)) || s.bin === b);
  return (
    <ModulePage page={page} subtitle="Warehouses, zones and bin locations.">
      <Tabs tabs={OP.WAREHOUSES.map((x) => ({ id: x.id, label: `${x.name} (${x.site})` }))} active={wh} onChange={(id) => { setWh(id); setBin(null); }} label="Warehouses" />
      <div className="erp-two erp-tabpanel" role="tabpanel">
        <Panel title="Bin map">
          {w.zones.map((z) => (
            <div key={z.zone} className="erp-zone">
              <h3 className="erp-subhead">
                Zone {z.zone}: {z.label}
              </h3>
              <div className="erp-bins" role="group" aria-label={`Bins in zone ${z.zone}`}>
                {Array.from({ length: z.bins }, (_, i) => {
                  const code = `${z.zone}-${String(Math.floor(i / 3) + 1).padStart(2, '0')}-${String((i % 3) + 1).padStart(2, '0')}`;
                  const used = stockHere.some((s) => s.bin === code) || (i * 7) % 5 < 3;
                  return (
                    <button key={code} type="button" className={`erp-bin${used ? ' used' : ''}${bin === code ? ' active' : ''}`} aria-pressed={bin === code} onClick={() => setBin(code)} aria-label={`Bin ${code}, ${used ? 'in use' : 'empty'}`}>
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="muted small">Filled bins hold stock. Select a bin to see what is in it.</p>
        </Panel>
        <Panel title={bin ? `Bin ${bin}` : 'Choose a bin'}>
          {bin ? (
            inBin(bin).length ? (
              <ul className="erp-plain-list">
                {inBin(bin).map((s) => (
                  <li key={s.id}>
                    <RecLink id={s.id}>{s.item}</RecLink> {s.name} · {s.onHand} {s.uom} <StatusBadge status={s.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No stock recorded in this bin in the demonstration data.</p>
            )
          ) : (
            <p className="muted">Select a bin on the map.</p>
          )}
          <Facts columns={2} items={[['Warehouse', w.name], ['Site', w.site], ['Zones', String(w.zones.length)], ['Bins', String(w.zones.reduce((s, z) => s + z.bins, 0))]]} />
        </Panel>
      </div>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Manufacturing

const DAYS = ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20'];
export function Planning({ page }: { page: NavPage }) {
  const toast = useToast();
  const open = OP.workOrders.filter((w) => w.status !== 'Completed');
  const [plan, setPlan] = useState<Record<string, string>>(() => Object.fromEntries(open.map((w, i) => [w.id, i % 6 === 5 ? 'unscheduled' : DAYS[i % 5]])));
  const [drag, setDrag] = useState<string | null>(null);
  const cols = [...DAYS, 'unscheduled'];
  const hours = (id: string) => (id === 'WO-1042' ? 9 : 4 + (Number(id.slice(-1)) % 4) * 1.5);
  const move = (id: string, to: string) => {
    if (plan[id] === to) return;
    setPlan((p) => ({ ...p, [id]: to }));
    toast(`${id} moved to ${to === 'unscheduled' ? 'Unscheduled' : fmtDate(to)}.`);
  };
  return (
    <ModulePage page={page} wide subtitle="Next week at the Brisbane factory. Drag a work order to another day, or choose the day from its menu.">
      <div className="erp-board erp-plan" role="list" aria-label="Production plan by day">
        {cols.map((d) => {
          const items = open.filter((w) => plan[w.id] === d);
          const load = items.reduce((s, w) => s + hours(w.id), 0);
          return (
            <section
              key={d}
              role="listitem"
              className="erp-lane"
              aria-labelledby={`pl-${d}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (drag) move(drag, d);
                setDrag(null);
              }}
            >
              <h2 id={`pl-${d}`} className="erp-lane-head">
                <span className="grow">{d === 'unscheduled' ? 'Unscheduled' : new Date(`${d}T00:00:00Z`).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}</span>
                {d !== 'unscheduled' ? <span className={`small ${load > 30 ? 'danger-text' : 'muted'}`}>{load.toFixed(1)} of 30 h</span> : null}
              </h2>
              {d !== 'unscheduled' ? <Meter value={load} max={30} label={`${load.toFixed(1)} of 30 hours planned`} /> : null}
              <ul className="erp-lane-body">
                {items.map((w) => (
                  <li key={w.id} className={`erp-kcard${w.status === 'Delayed' ? ' late' : ''}`} draggable onDragStart={() => setDrag(w.id)} onDragEnd={() => setDrag(null)}>
                    <Link to={`/manufacturing/work-orders/${w.id}`} className="erp-kcard-title">
                      {w.id}
                    </Link>
                    <span className="small">
                      {w.itemName} × {w.qty}
                    </span>
                    <span className="erp-kcard-meta">
                      <StatusBadge status={w.status} />
                      <span className="muted small">{hours(w.id)} h</span>
                    </span>
                    <label className="sr-only" htmlFor={`day-${w.id}`}>
                      Day for {w.id}
                    </label>
                    <select id={`day-${w.id}`} className="select sm" value={plan[w.id]} onChange={(e) => move(w.id, e.target.value)}>
                      {cols.map((c) => (
                        <option key={c} value={c}>
                          {c === 'unscheduled' ? 'Unscheduled' : fmtDate(c)}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
                {!items.length ? <li className="muted small erp-lane-empty">Nothing planned</li> : null}
              </ul>
            </section>
          );
        })}
      </div>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Supply Chain

export function DeliverySchedule({ page }: { page: NavPage }) {
  const days = Array.from({ length: 10 }, (_, i) => addDays(TODAY, i));
  const all = [
    ...OP.shipments.map((s) => ({ id: s.id, date: s.date, title: `${s.customer} · ${s.carrier}`, status: s.status })),
    ...SF.deliveries.filter((d) => d.status === 'Scheduled').map((d) => ({ id: d.id, date: d.date, title: `${d.customer} · ${d.carrier}`, status: d.status })),
    ...OP.purchaseOrders.filter((p) => ['Sent', 'Partly received', 'Awaiting approval'].includes(p.status)).map((p) => ({ id: p.id, date: p.expected, title: `Inbound from ${p.supplier}`, status: p.expected < TODAY ? 'Late' : 'Scheduled' })),
  ];
  return (
    <ModulePage page={page} subtitle="Outbound shipments and inbound deliveries for the next ten days.">
      <div className="erp-schedule">
        {days.map((d) => {
          const items = all.filter((x) => x.date === d);
          return (
            <Panel key={d} title={new Date(`${d}T00:00:00Z`).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}>
              {items.length ? (
                <ul className="erp-plain-list">
                  {items.map((x) => (
                    <li key={x.id}>
                      <RecLink id={x.id} /> {x.title} <StatusBadge status={x.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">Nothing scheduled.</p>
              )}
            </Panel>
          );
        })}
      </div>
    </ModulePage>
  );
}

export function DemandPlan({ page }: { page: NavPage }) {
  const months = OP.demandPlan[0].months;
  return (
    <ModulePage page={page} subtitle="Forecast and confirmed demand for the next six months, in units.">
      <Panel title="Demand plan">
        <div className="erp-table-scroll">
          <table className="data-table erp-table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                {months.map((m) => (
                  <th key={m} scope="col" className="num">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OP.demandPlan.map((d) => (
                <tr key={d.item}>
                  <td>
                    <RecLink id={d.item} /> {itemName(d.item)}
                  </td>
                  {d.forecast.map((f, i) => (
                    <td key={i} className="num">
                      {f}
                      {d.confirmed[i] ? <span className="muted small"> ({d.confirmed[i]} confirmed)</span> : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModulePage>
  );
}
