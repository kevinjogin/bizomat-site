// The Consolidated report tab of Consolidation and intercompany: each legal entity's profit and loss and balance sheet
// from its own Finance workspace, translated into one currency, the intercompany eliminations and the group total. Worked
// out on the server (src/worker/erp/objects/intercompany.ts) from the workspaces the person may read in Finance.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../../lib/api';
import { usePageTitle } from '../../../lib/hooks';
import { Icon } from '../../../components/ui/Icon';
import { ErrorBox, Loading } from '../../../components/ui/ui';
import { Section } from '../../maintenance/common';
import { moneyText, xHref, xPath } from './api';

interface Row {
  key: string;
  type: string;
  code: string;
  name: string;
  amounts: Record<string, number>;
  eliminated: number;
  total: number;
}

interface Report {
  from: string;
  to: string;
  currency: string;
  entities: { id: string; number: string; name: string; workspace: string; currency: string; rate: number; rateSource: string; ownershipPct: number | null }[];
  excluded: { id: string; number: string; name: string; reason: string }[];
  profitAndLoss: Row[];
  balanceSheet: Row[];
  totals: Record<'revenue' | 'expenses' | 'profit' | 'assets' | 'liabilities' | 'equity', Record<string, number>>;
  intercompanyDifference: { profitAndLoss: number; balanceSheet: number };
  notes: string[];
}

const TYPE_LABELS: Record<string, string> = { revenue: 'Income', expense: 'Expenses', asset: 'Assets', liability: 'Liabilities', equity: 'Equity' };

export function ConsolidationTab({ companyId }: { companyId: string }) {
  usePageTitle('Consolidated report');
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(`${today.slice(0, 4)}-01-01`);
  const [to, setTo] = useState(today);
  const [currency, setCurrency] = useState('AUD');
  const qs = `from=${from}&to=${to}&currency=${encodeURIComponent(currency)}`;
  const q = useQuery({ queryKey: ['erp', companyId, 'x', 'consolidation', qs], queryFn: () => get<Report>(xPath(companyId, `/consolidation?${qs}`)), retry: false, enabled: /^\d{4}-\d{2}-\d{2}$/.test(from) && /^\d{4}-\d{2}-\d{2}$/.test(to) && /^[A-Z]{3}$/.test(currency) });
  return (
    <div className="stack">
      <div className="card card-pad row wrap">
        <div className="field"><label htmlFor="cn-from">From</label><input id="cn-from" className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div className="field"><label htmlFor="cn-to">To</label><input id="cn-to" className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div className="field"><label htmlFor="cn-cur">Presentation currency</label><input id="cn-cur" className="input erp-qty-input" maxLength={3} value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} /></div>
        <a className="btn" href={xHref(companyId, `/consolidation?${qs}&format=csv`)}><Icon name="download" /> Export CSV</a>
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data && !q.error && q.fetchStatus !== 'idle' ? <Loading label="Reading the entities’ books…" /> : null}
      {q.fetchStatus === 'idle' && !q.data ? <p className="muted small">Give both dates and a three-letter currency code.</p> : null}
      {q.data ? <ReportView r={q.data} /> : null}
    </div>
  );
}

function ReportView({ r }: { r: Report }) {
  const cols = r.entities;
  const m = (v: number | undefined) => moneyText(v ?? 0, r.currency);
  const table = (title: string, rows: Row[], totals: [string, Record<string, number>][]) => (
    <Section title={title}>
      {rows.length ? (
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead><tr><th>Account</th>{cols.map((e) => <th key={e.id} className="num">{e.name}</th>)}<th className="num">Eliminations</th><th className="num">Consolidated</th></tr></thead>
            <tbody>
              {rows.map((x, i) => (
                <tr key={x.key}>
                  <td>{i === 0 || rows[i - 1].type !== x.type ? <span className="muted small">{TYPE_LABELS[x.type] ?? x.type}: </span> : null}{x.code ? <span className="mt-num">{x.code}</span> : null} {x.name}</td>
                  {cols.map((e) => <td key={e.id} className="num">{m(x.amounts[e.id])}</td>)}
                  <td className="num">{x.eliminated ? m(x.eliminated) : ''}</td>
                  <td className="num">{m(x.total)}</td>
                </tr>
              ))}
              {totals.map(([label, t]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cols.map((e) => <td key={e.id} className="num"><strong>{m(t[e.id])}</strong></td>)}
                  <td className="num"><strong>{m(t.__elim)}</strong></td>
                  <td className="num"><strong>{m(t.__total)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="muted small">Nothing posted in this period.</p>}
    </Section>
  );
  return (
    <>
      <Section title="Entities">
        {cols.length ? (
          <ul className="erp-list small">
            {cols.map((e) => <li key={e.id}><span className="mt-num">{e.number}</span> {e.name}: {e.workspace} in {e.currency}{e.currency !== r.currency ? `, at ${Number(e.rate.toPrecision(8))} (${e.rateSource})` : ''}{e.ownershipPct !== null && e.ownershipPct < 100 ? `, ${e.ownershipPct}% owned (consolidated in full)` : ''}</li>)}
          </ul>
        ) : <p className="muted small">No legal entity can be consolidated yet: name each entity’s Finance workspace in Organisation structure, Legal entities.</p>}
        {r.excluded.length ? <ul className="erp-list small">{r.excluded.map((e) => <li key={e.id}><span className="mt-num">{e.number}</span> {e.name}: <span className="warning-text">left out. {e.reason}</span></li>)}</ul> : null}
      </Section>
      {table(`Profit and loss, ${r.from} to ${r.to}`, r.profitAndLoss, [['Total income', r.totals.revenue], ['Total expenses', r.totals.expenses], ['Profit', r.totals.profit]])}
      {table(`Balance sheet at ${r.to}`, r.balanceSheet, [['Total assets', r.totals.assets], ['Total liabilities', r.totals.liabilities], ['Total equity', r.totals.equity]])}
      {r.intercompanyDifference.profitAndLoss || r.intercompanyDifference.balanceSheet ? (
        <p className="warning-text small">The two sides of the intercompany balances differ by {m(r.intercompanyDifference.balanceSheet)} on the balance sheet and {m(r.intercompanyDifference.profitAndLoss)} in profit and loss: check that both entities recorded the same amounts, and remember that each is translated at its own rate.</p>
      ) : null}
      <ul className="muted small">{r.notes.map((n) => <li key={n}>{n}</li>)}</ul>
    </>
  );
}
