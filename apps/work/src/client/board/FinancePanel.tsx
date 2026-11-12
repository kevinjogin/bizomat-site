// The project's finances: totals per currency (approved budget, estimated and actual cost, committed, remaining,
// variance, utilisation), per column, per group. Computed by the server in integer arithmetic; never mixes currencies.

import { useQuery } from '@tanstack/react-query';
import type { BoardBundle } from '../../shared/types';
import type { FinanceSummary, MoneyFigure } from '../../shared/finance';
import { get } from '../lib/api';
import { ErrorBox, Loading } from '../components/ui/ui';
import { Modal } from '../components/ui/overlays';
import '../styles/platform.css';

type Summary = FinanceSummary & { boardCurrency: string | null; workspaceCurrency: string | null; canEdit: boolean };

function Tile({ label, f, note }: { label: string; f: MoneyFigure | null; note?: string }) {
  return (
    <div className="money-tile">
      <div className="v">{f ? f.display : '-'}</div>
      <div className="l">{label}{note ? ` (${note})` : ''}</div>
    </div>
  );
}

export function FinancePanel({ bundle, onClose }: { bundle: BoardBundle; onClose: () => void }) {
  const q = useQuery({ queryKey: ['board-finance', bundle.board.id], queryFn: () => get<Summary>(`/boards/${bundle.board.id}/finance`) });
  const s = q.data;
  return (
    <Modal title={`Finance · ${bundle.board.name}`} onClose={onClose} wide>
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} /> : s ? (
        <div className="col" style={{ gap: 12 }}>
          <p className="muted small">
            Currency: {s.boardCurrency ? `${s.boardCurrency} (project)` : s.workspaceCurrency ? `${s.workspaceCurrency} (organisation)` : 'not set yet: an administrator chooses it in Settings > Finance'}. Totals add top-level tasks only (a parent's amount is its total), are exact to the cent, and are never added across currencies.
          </p>
          {s.unsetCurrencyColumns ? <div className="info-box">{s.unsetCurrencyColumns} financial column(s) have no currency. Their totals are shown without one.</div> : null}
          {s.columns.some((c) => c.currencySource === 'column' && !c.currencyConfirmed) ? (
            <div className="info-box">Some columns keep the currency code they were created with and nobody has confirmed it. An administrator can confirm or change it in Settings &gt; Finance; the amounts do not change.</div>
          ) : null}
          {s.byRole.map((r) => (
            <section key={r.currency ?? 'none'}>
              <h3 style={{ marginBottom: 6 }}>{r.currency ?? 'No currency'}</h3>
              <div className="money-grid">
                <Tile label="Approved budget" f={r.approvedBudget} />
                <Tile label="Estimated cost" f={r.estimatedCost} note="estimate" />
                <Tile label="Actual cost" f={r.actualCost} note="actual" />
                <Tile label="Committed" f={r.committed} />
                <Tile label="Remaining budget" f={r.remaining} />
                <Tile label="Variance (budget - actual)" f={r.variance} />
                <div className="money-tile"><div className="v">{r.utilisation ? `${r.utilisation}%` : '-'}</div><div className="l">Budget utilisation</div></div>
              </div>
            </section>
          ))}
          {!s.byRole.length ? <p className="muted small">No column has a finance role yet (approved budget, estimated cost, actual cost, committed). Set it in each column's settings to see remaining budget and variance.</p> : null}
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Column</th><th>Role</th><th>Currency</th><th>Total</th><th>Tasks</th></tr></thead>
              <tbody>
                {s.columns.map((c) => (
                  <tr key={c.columnId}>
                    <td>{c.title}</td>
                    <td>{c.roleLabel ?? <span className="muted">Not set</span>}</td>
                    <td>{c.currency ?? <span className="muted">Not set</span>} {c.currencyConfirmed ? null : <span className="badge warning">Unconfirmed</span>}</td>
                    <td><strong>{c.total.display}</strong></td>
                    <td>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {s.groups.length && s.columns.length ? (
            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Group</th>{s.columns.map((c) => <th key={c.columnId}>{c.title}</th>)}</tr></thead>
                <tbody>
                  {s.groups.map((g) => (
                    <tr key={g.groupId}><td>{g.name}</td>{g.totals.map((t) => <td key={t.columnId}>{t.count ? t.total.display : '-'}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
