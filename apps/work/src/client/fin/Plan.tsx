// Planning: budgets (amounts by category and month, for the whole workspace or one department, project or cost centre),
// savings goals, and recurring transactions, invoices and bills. The server checks every template when it is saved, so
// a schedule that cannot run is refused at once rather than failing later; recurring records run in the app's
// scheduled maintenance with their creator's permissions.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post, put } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { useSession } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { FREQUENCIES, FREQUENCY_LABELS, type Frequency, addMonths, fyStart, monthOf } from '../../shared/fin/dates';
import { accountLabel, fin, longDate, orderedAccounts, shortDate, todayLocal, useAccounts, useCurrentOrg, useMoney, useTracking, type AccountDTO } from './lib';
import { AccountSelect, ContactSelect, Hint, MoneyInput, TaxCodeSelect, TrackingSelect, useHasTracking, type TrackingKind } from './ui';

// ------------------------------------------------------------------ shared

const monthLabel = (ym: string) => new Date(`${ym}-01T00:00:00`).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });

function NoPlanning({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="page crm-page">
      <PageHeader title={title} icon={icon} />
      <EmptyState icon={icon} title="Your role does not include budgets and goals">Ask an owner or administrator of this workspace if you need them.</EmptyState>
    </div>
  );
}

// ------------------------------------------------------------------ budgets

interface BudgetDTO {
  id: string;
  name: string;
  startMonth: string;
  months: number;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
  alertPct: number;
  archived: boolean;
  createdAt: number;
}

interface BudgetDetail extends BudgetDTO {
  monthsList: string[];
  lines: { accountId: string; month: string; amount: number }[];
}

function useBudgets() {
  const org = useCurrentOrg();
  return useQuery({ queryKey: ['fin', org.id, 'budgets'], queryFn: () => get<BudgetDTO[]>(fin(org.id, '/budgets')), enabled: org.perms.budgets.view });
}

function budgetEnd(b: { startMonth: string; months: number }) {
  return monthOf(addMonths(`${b.startMonth}-01`, b.months - 1));
}

function useTrackingName() {
  const list = useTracking().data ?? [];
  return (id: string | null) => (id ? (list.find((t) => t.id === id)?.name ?? 'Archived tracking') : '');
}

export function Budgets() {
  const org = useCurrentOrg();
  const q = useBudgets();
  const toast = useToast();
  const confirm = useConfirm();
  const trackingName = useTrackingName();
  const [creating, setCreating] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  usePageTitle('Budgets');
  if (!org.perms.budgets.view) return <NoPlanning title="Budgets" icon="target" />;
  const manage = org.perms.budgets.manage;
  const base = `/o/${org.id}`;
  const rows = (q.data ?? []).filter((b) => showArchived || !b.archived);
  const archivedCount = (q.data ?? []).filter((b) => b.archived).length;
  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="page crm-page">
      <PageHeader
        title="Budgets"
        icon="target"
        subtitle="Plan income and spending by category and month, then compare with what actually happened."
        actions={manage ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" size={14} /> New budget</button> : null}
      />
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="target" title={archivedCount ? 'No current budgets' : 'No budgets yet'} action={manage ? <button className="btn primary" onClick={() => setCreating(true)}>Create a budget</button> : undefined}>
          A budget sets an amount for each income and expense category, month by month. You are warned when spending passes the level you choose.
        </EmptyState>
      ) : (
        <div className="card crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Budget</th>
                <th>Months</th>
                <th>Covers</th>
                <th>Warn at</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const scope = [trackingName(b.departmentId), trackingName(b.projectId), trackingName(b.costCentreId)].filter(Boolean).join(', ');
                return (
                  <tr key={b.id}>
                    <td>
                      <Link to={`${base}/budgets/${b.id}`} className="crm-primary">{b.name}</Link> {b.archived ? <span className="badge">Archived</span> : null}
                    </td>
                    <td>{monthLabel(b.startMonth)} to {monthLabel(budgetEnd(b))}</td>
                    <td>{scope || 'The whole workspace'}</td>
                    <td>{b.alertPct}%</td>
                    <td className="fin-num">
                      <div className="row">
                        <Link className="btn sm ghost" to={`${base}/reports/budget_actual?budget=${b.id}`}>Against actual</Link>
                        {manage ? (
                          <>
                            <button className="btn sm ghost" onClick={() => act(() => patch(fin(org.id, `/budgets/${b.id}`), { archived: !b.archived }))}>{b.archived ? 'Restore' : 'Archive'}</button>
                            <button
                              className="btn sm ghost"
                              onClick={async () => {
                                if (await confirm({ title: `Delete ${b.name}?`, message: 'Its amounts are deleted too. Posted transactions are not affected.', confirmLabel: 'Delete', danger: true })) act(() => del(fin(org.id, `/budgets/${b.id}`)));
                              }}
                            >
                              Delete
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {archivedCount ? (
        <label className="row small muted crm-pad-top">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived budgets ({archivedCount})
        </label>
      ) : null}
      {creating ? <BudgetForm onClose={() => setCreating(false)} /> : null}
    </div>
  );
}

function BudgetForm({ budget, onClose, onSaved }: { budget?: BudgetDTO; onClose: () => void; onSaved?: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const navigate = useNavigate();
  const budgets = useBudgets();
  const tracking = useHasTracking();
  const [f, setF] = useState({
    name: budget?.name ?? '',
    startMonth: budget?.startMonth ?? monthOf(fyStart(todayLocal(), org.fyStartMonth)),
    months: budget?.months ?? 12,
    departmentId: budget?.departmentId ?? null,
    projectId: budget?.projectId ?? null,
    costCentreId: budget?.costCentreId ?? null,
    alertPct: budget?.alertPct ?? 90,
  });
  const [busy, setBusy] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (budget) {
        await patch(fin(org.id, `/budgets/${budget.id}`), f);
        onSaved?.();
        onClose();
      } else {
        const r = await post<{ id: string }>(fin(org.id, '/budgets'), f);
        await budgets.refetch();
        onClose();
        navigate(`/o/${org.id}/budgets/${r.id}`);
      }
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const trackingFields: { kind: TrackingKind; key: 'departmentId' | 'projectId' | 'costCentreId'; label: string }[] = [
    { kind: 'department', key: 'departmentId', label: 'Department' },
    { kind: 'project', key: 'projectId', label: 'Project' },
    { kind: 'cost_centre', key: 'costCentreId', label: 'Cost centre' },
  ];
  return (
    <Modal
      title={budget ? 'Budget details' : 'New budget'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="fin-budget" disabled={busy || !f.name.trim()}>{busy ? 'Saving…' : budget ? 'Save' : 'Create budget'}</button>
        </>
      }
    >
      <form id="fin-budget" onSubmit={save}>
        <div className="field">
          <label htmlFor="bud-name">Name</label>
          <input id="bud-name" className="input" required maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="For example: 2026-27 budget" />
        </div>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="bud-start">First month</label>
            <input id="bud-start" className="input" type="month" required value={f.startMonth} onChange={(e) => e.target.value && setF({ ...f, startMonth: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="bud-months">Number of months</label>
            <input id="bud-months" className="input" type="number" min={1} max={36} required value={f.months} onChange={(e) => setF({ ...f, months: Math.max(1, Math.min(36, Number(e.target.value) || 1)) })} />
          </div>
          <div className="field">
            <label htmlFor="bud-alert">Warn when spending reaches</label>
            <div className="row">
              <input id="bud-alert" className="input sm crm-num" type="number" min={1} max={1000} value={f.alertPct} onChange={(e) => setF({ ...f, alertPct: Math.max(1, Math.min(1000, Number(e.target.value) || 90)) })} />
              <span className="muted">% of a month’s amount</span>
            </div>
          </div>
          {trackingFields.filter((t) => tracking[t.kind] || f[t.key]).map((t) => (
            <div className="field" key={t.key}>
              <label htmlFor={`bud-${t.kind}`}>{t.label}</label>
              <TrackingSelect id={`bud-${t.kind}`} kind={t.kind} value={f[t.key]} onChange={(v) => setF({ ...f, [t.key]: v })} />
            </div>
          ))}
        </div>
        <p className="muted small">The budget runs from {monthLabel(f.startMonth)} to {monthLabel(budgetEnd(f))}. {tracking.department || tracking.project || tracking.cost_centre ? 'Choose a department, project or cost centre to budget only for it; leave them empty for the whole workspace.' : ''}</p>
      </form>
    </Modal>
  );
}

export function BudgetPage() {
  const org = useCurrentOrg();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const { fmt, plain, parse } = useMoney();
  const accounts = useAccounts().data ?? [];
  const trackingName = useTrackingName();
  const q = useQuery({ queryKey: ['fin', org.id, 'budgets', id], queryFn: () => get<BudgetDetail>(fin(org.id, `/budgets/${id}`)), enabled: org.perms.budgets.view && !!id });
  const b = q.data;
  const [cells, setCells] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [filling, setFilling] = useState(false);
  usePageTitle(b?.name ?? 'Budget');
  // Load the saved amounts into the grid (again after every save or fill).
  useEffect(() => {
    if (!b) return;
    const next: Record<string, string> = {};
    for (const l of b.lines) next[`${l.accountId}|${l.month}`] = plain(l.amount);
    setCells(next);
    setDirty(false);
  }, [b]);
  const used = useMemo(() => new Set((b?.lines ?? []).map((l) => l.accountId)), [b]);
  if (!org.perms.budgets.view) return <NoPlanning title="Budget" icon="target" />;
  if (q.error) return <div className="page crm-page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!b) return <Loading />;
  const manage = org.perms.budgets.manage && !b.archived;
  const months = b.monthsList;
  const categories = (type: 'revenue' | 'expense') => orderedAccounts(accounts.filter((a) => a.type === type && !a.money && (!a.archived || used.has(a.id))));
  const amount = (accId: string, m: string): number => {
    const t = cells[`${accId}|${m}`];
    if (!t) return 0;
    try {
      return parse(t) ?? 0;
    } catch {
      return 0;
    }
  };
  const invalid = (accId: string, m: string) => {
    const t = cells[`${accId}|${m}`];
    if (!t) return false;
    try {
      parse(t);
      return false;
    } catch {
      return true;
    }
  };
  const setCell = (accId: string, m: string, v: string) => {
    setCells((c) => ({ ...c, [`${accId}|${m}`]: v }));
    setDirty(true);
  };
  const fillAcross = (accId: string) => {
    const first = months.map((m) => cells[`${accId}|${m}`]).find((t) => t && t.trim());
    if (!first) {
      toast('Type an amount in the first month, then fill across');
      return;
    }
    setCells((c) => ({ ...c, ...Object.fromEntries(months.map((m) => [`${accId}|${m}`, first])) }));
    setDirty(true);
  };
  const rowTotal = (accId: string) => months.reduce((n, m) => n + amount(accId, m), 0);
  const income = categories('revenue');
  const expenses = categories('expense');
  const colTotal = (list: AccountDTO[], m: string) => list.reduce((n, a) => n + amount(a.id, m), 0);
  const save = async () => {
    const lines: { accountId: string; month: string; amount: number }[] = [];
    for (const [k, t] of Object.entries(cells)) {
      if (!t.trim()) continue;
      const [accountId, month] = k.split('|');
      let v: number | null;
      try {
        v = parse(t);
      } catch {
        toast(`"${t}" is not an amount (${accountLabel(accounts.find((a) => a.id === accountId))}, ${monthLabel(month)})`, 'error');
        return;
      }
      if (v) lines.push({ accountId, month, amount: v });
    }
    setSaving(true);
    try {
      await put(fin(org.id, `/budgets/${b.id}/lines`), { lines });
      await q.refetch();
      toast('Budget saved');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setSaving(false);
    }
  };
  const section = (title: string, list: AccountDTO[]) =>
    list.length ? (
      <>
        <tr className="heading">
          <td>{title}</td>
          {months.map((m) => <td key={m} />)}
          <td />
          {manage ? <td /> : null}
        </tr>
        {list.map((a) => (
          <tr key={a.id}>
            <td className={a.parentId ? 'indent-2' : 'indent-1'}>{accountLabel(a)}</td>
            {months.map((m) =>
              manage ? (
                <td key={m} className="fin-num">
                  <input
                    className={`input sm crm-num${invalid(a.id, m) ? ' invalid' : ''}`}
                    inputMode="decimal"
                    aria-label={`${accountLabel(a)}, ${monthLabel(m)}`}
                    value={cells[`${a.id}|${m}`] ?? ''}
                    onChange={(e) => setCell(a.id, m, e.target.value)}
                  />
                </td>
              ) : (
                <td key={m} className="fin-num">{amount(a.id, m) ? fmt(amount(a.id, m)) : ''}</td>
              ),
            )}
            <td className="fin-num"><strong>{fmt(rowTotal(a.id))}</strong></td>
            {manage ? (
              <td>
                <button className="btn sm ghost" type="button" onClick={() => fillAcross(a.id)} title="Copy the first month’s amount to every month">Fill across</button>
              </td>
            ) : null}
          </tr>
        ))}
        <tr className="subtotal">
          <td>Total {title.toLowerCase()}</td>
          {months.map((m) => <td key={m} className="fin-num">{fmt(colTotal(list, m))}</td>)}
          <td className="fin-num">{fmt(list.reduce((n, a) => n + rowTotal(a.id), 0))}</td>
          {manage ? <td /> : null}
        </tr>
      </>
    ) : null;
  const scope = [trackingName(b.departmentId), trackingName(b.projectId), trackingName(b.costCentreId)].filter(Boolean).join(', ');
  const personal = org.kind !== 'business';
  return (
    <div className="page crm-page">
      <PageHeader
        title={b.name}
        icon="target"
        subtitle={`${monthLabel(b.startMonth)} to ${monthLabel(budgetEnd(b))}${scope ? `, ${scope}` : ''}. Warns at ${b.alertPct}% of a month’s amount.${b.archived ? ' Archived.' : ''}`}
        actions={
          <>
            <button className="btn" onClick={() => navigate(`/o/${org.id}/budgets`)}><Icon name="chevronLeft" size={14} /> Budgets</button>
            {org.perms.reports.view ? <Link className="btn" to={`/o/${org.id}/reports/budget_actual?budget=${b.id}`}>Against actual</Link> : null}
            {org.perms.budgets.manage ? <button className="btn" onClick={() => setEditing(true)}>Details</button> : null}
            {manage ? <button className="btn" onClick={() => setFilling(true)}>Fill from actuals</button> : null}
          </>
        }
      />
      {manage ? <Hint>Type an amount for each category and month (for example 450 or 1,250.50), or one month then Fill across. Income and spending are both entered as positive amounts. Save when you are done.</Hint> : null}
      <div className="card crm-table-scroll">
        <table className="data-table fin-report-table">
          <thead>
            <tr>
              <th>Category</th>
              {months.map((m) => <th key={m} className="fin-num">{monthLabel(m)}</th>)}
              <th className="fin-num">Total</th>
              {manage ? <th /> : null}
            </tr>
          </thead>
          <tbody>
            {section('Income', income)}
            {section(personal ? 'Spending' : 'Expenses', expenses)}
            <tr className="total">
              <td>{personal ? 'Income less spending' : 'Net'}</td>
              {months.map((m) => {
                const v = colTotal(income, m) - colTotal(expenses, m);
                return <td key={m} className="fin-num"><span className={`fin-amount${v < 0 ? ' neg' : ''}`}>{fmt(v)}</span></td>;
              })}
              <td className="fin-num">{fmt(income.reduce((n, a) => n + rowTotal(a.id), 0) - expenses.reduce((n, a) => n + rowTotal(a.id), 0))}</td>
              {manage ? <td /> : null}
            </tr>
          </tbody>
        </table>
      </div>
      {manage ? (
        <div className="row crm-pad-top">
          <button className="btn primary" disabled={!dirty || saving} onClick={save}>{saving ? 'Saving…' : 'Save budget'}</button>
          <button
            className="btn"
            disabled={!dirty || saving}
            onClick={async () => {
              if (await confirm({ title: 'Discard your changes?', confirmLabel: 'Discard', danger: true })) {
                const next: Record<string, string> = {};
                for (const l of b.lines) next[`${l.accountId}|${l.month}`] = plain(l.amount);
                setCells(next);
                setDirty(false);
              }
            }}
          >
            Discard changes
          </button>
          {dirty ? <span className="small warning-text">Unsaved changes</span> : null}
        </div>
      ) : null}
      {editing ? <BudgetForm budget={b} onClose={() => setEditing(false)} onSaved={() => q.refetch()} /> : null}
      {filling ? <FromActuals budget={b} onClose={() => setFilling(false)} onDone={() => q.refetch()} /> : null}
    </div>
  );
}

function FromActuals({ budget, onClose, onDone }: { budget: BudgetDetail; onClose: () => void; onDone: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const [fromMonth, setFromMonth] = useState(monthOf(addMonths(`${budget.startMonth}-01`, -12)));
  const [uplift, setUplift] = useState('0');
  const [busy, setBusy] = useState(false);
  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const upliftPct = Number(uplift);
    if (!Number.isFinite(upliftPct) || upliftPct < -100 || upliftPct > 500) {
      toast('Use a change between -100% and 500%', 'error');
      return;
    }
    setBusy(true);
    try {
      const r = await post<{ lines: number }>(fin(org.id, `/budgets/${budget.id}/from-actuals`), { fromMonth, upliftPct });
      toast(r.lines ? `${r.lines} amounts filled from what happened` : 'Nothing was posted in those months, so the budget is now empty');
      onDone();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="Fill from actuals"
      onClose={onClose}
      footer={
        <>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="fin-from-actuals" disabled={busy}>{busy ? 'Filling…' : 'Replace the amounts'}</button>
        </>
      }
    >
      <form id="fin-from-actuals" onSubmit={run}>
        <p className="muted small">Each category gets what was actually posted in the same months of an earlier period, changed by the percentage you choose. This replaces every amount in the budget.</p>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="fa-from">Copy from, starting</label>
            <input id="fa-from" className="input" type="month" required value={fromMonth} onChange={(e) => e.target.value && setFromMonth(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="fa-up">Change by</label>
            <div className="row">
              <input id="fa-up" className="input sm crm-num" type="number" min={-100} max={500} step="0.1" value={uplift} onChange={(e) => setUplift(e.target.value)} />
              <span className="muted">%</span>
            </div>
          </div>
        </div>
        <p className="muted small">{monthLabel(fromMonth)} to {monthLabel(monthOf(addMonths(`${fromMonth}-01`, budget.months - 1)))} become {monthLabel(budget.startMonth)} to {monthLabel(budgetEnd(budget))}.</p>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ savings goals

interface GoalDTO {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string | null;
  accountId: string | null;
  saved: number;
  progressPct: number;
  achieved: boolean;
  archived: boolean;
}

export function Goals() {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const toast = useToast();
  const confirm = useConfirm();
  const accounts = useAccounts().data ?? [];
  const q = useQuery({ queryKey: ['fin', org.id, 'goals'], queryFn: () => get<GoalDTO[]>(fin(org.id, '/goals')), enabled: org.perms.budgets.view });
  const [editing, setEditing] = useState<GoalDTO | 'new' | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  usePageTitle('Savings goals');
  if (!org.perms.budgets.view) return <NoPlanning title="Savings goals" icon="trophy" />;
  const manage = org.perms.budgets.manage;
  const all = q.data ?? [];
  const rows = all.filter((g) => showArchived || !g.archived);
  const archivedCount = all.filter((g) => g.archived).length;
  const today = todayLocal();
  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const perMonth = (g: GoalDTO) => {
    if (!g.targetDate || g.achieved || g.targetDate <= today) return null;
    const months = (Number(g.targetDate.slice(0, 4)) - Number(today.slice(0, 4))) * 12 + Number(g.targetDate.slice(5, 7)) - Number(today.slice(5, 7));
    return Math.ceil((g.targetAmount - g.saved) / Math.max(1, months));
  };
  return (
    <div className="page crm-page">
      <PageHeader
        title="Savings goals"
        icon="trophy"
        subtitle="Set an amount to save by a date. Progress comes from a linked account’s balance, or from an amount you keep up to date."
        actions={manage ? <button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" size={14} /> New goal</button> : null}
      />
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="trophy" title="No savings goals yet" action={manage ? <button className="btn primary" onClick={() => setEditing('new')}>Create a goal</button> : undefined}>
          For example a holiday, a house deposit or an emergency fund.
        </EmptyState>
      ) : (
        <div className="grid-cards">
          {rows.map((g) => {
            const acc = accounts.find((a) => a.id === g.accountId);
            const monthly = perMonth(g);
            return (
              <div key={g.id} className="card card-pad stack">
                <div className="row">
                  <strong className="grow ellipsis">{g.name}</strong>
                  {g.achieved ? <span className="badge success">Reached</span> : null}
                  {g.archived ? <span className="badge">Archived</span> : null}
                </div>
                <div className="fin-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={g.progressPct} aria-label={`${g.name}: ${g.progressPct}% saved`}>
                  <span style={{ width: `${g.progressPct}%` }} />
                </div>
                <div className="small">
                  <strong>{fmt(g.saved)}</strong> of {fmt(g.targetAmount)} ({g.progressPct}%)
                </div>
                <div className="muted small">
                  {g.targetDate ? `By ${longDate(g.targetDate)}. ` : ''}
                  {acc ? `From ${accountLabel(acc)}.` : 'Amount saved kept by hand.'}
                  {monthly && monthly > 0 ? ` About ${fmt(monthly)} a month to reach it.` : ''}
                </div>
                {manage ? (
                  <div className="row wrap">
                    <button className="btn sm" onClick={() => setEditing(g)}>Edit</button>
                    <button className="btn sm ghost" onClick={() => act(() => patch(fin(org.id, `/goals/${g.id}`), { archived: !g.archived }))}>{g.archived ? 'Restore' : 'Archive'}</button>
                    <button
                      className="btn sm ghost"
                      onClick={async () => {
                        if (await confirm({ title: `Delete ${g.name}?`, message: 'The goal is deleted. Accounts and transactions are not affected.', confirmLabel: 'Delete', danger: true })) act(() => del(fin(org.id, `/goals/${g.id}`)));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      {archivedCount ? (
        <label className="row small muted crm-pad-top">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived goals ({archivedCount})
        </label>
      ) : null}
      {editing ? <GoalForm goal={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} onSaved={() => q.refetch()} /> : null}
    </div>
  );
}

function GoalForm({ goal, onClose, onSaved }: { goal?: GoalDTO; onClose: () => void; onSaved: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const [f, setF] = useState({
    name: goal?.name ?? '',
    targetAmount: goal?.targetAmount ?? null as number | null,
    targetDate: goal?.targetDate ?? '',
    source: goal ? (goal.accountId ? 'account' : 'manual') : 'account',
    accountId: goal?.accountId ?? null as string | null,
    savedAmount: goal && !goal.accountId ? goal.saved : (null as number | null),
  });
  const [busy, setBusy] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.targetAmount) {
      toast('Enter the amount to save', 'error');
      return;
    }
    if (f.source === 'account' && !f.accountId) {
      toast('Choose the account the savings are in, or keep the amount by hand', 'error');
      return;
    }
    const body = { name: f.name, targetAmount: f.targetAmount, targetDate: f.targetDate || null, accountId: f.source === 'account' ? f.accountId : null, savedAmount: f.source === 'manual' ? (f.savedAmount ?? 0) : 0 };
    setBusy(true);
    try {
      if (goal) await patch(fin(org.id, `/goals/${goal.id}`), body);
      else await post(fin(org.id, '/goals'), body);
      onSaved();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={goal ? 'Edit goal' : 'New savings goal'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="fin-goal" disabled={busy || !f.name.trim()}>{busy ? 'Saving…' : 'Save goal'}</button>
        </>
      }
    >
      <form id="fin-goal" onSubmit={save}>
        <div className="field">
          <label htmlFor="goal-name">Goal</label>
          <input id="goal-name" className="input" required maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="For example: Holiday in Japan" />
        </div>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="goal-target">Amount to save</label>
            <MoneyInput id="goal-target" value={f.targetAmount} onChange={(v) => setF({ ...f, targetAmount: v })} required />
          </div>
          <div className="field">
            <label htmlFor="goal-date">By (optional)</label>
            <input id="goal-date" className="input" type="date" value={f.targetDate} onChange={(e) => setF({ ...f, targetDate: e.target.value })} />
          </div>
        </div>
        <fieldset className="crm-fieldset">
          <legend>Progress comes from</legend>
          <label className="row">
            <input type="radio" name="goal-src" checked={f.source === 'account'} onChange={() => setF({ ...f, source: 'account' })} /> The balance of an account
          </label>
          {f.source === 'account' ? (
            <AccountSelect value={f.accountId} onChange={(v) => setF({ ...f, accountId: v })} include={(a) => a.type === 'asset'} emptyLabel="Choose an account…" ariaLabel="Savings account" />
          ) : null}
          <label className="row">
            <input type="radio" name="goal-src" checked={f.source === 'manual'} onChange={() => setF({ ...f, source: 'manual' })} /> An amount I keep up to date
          </label>
          {f.source === 'manual' ? <MoneyInput value={f.savedAmount} onChange={(v) => setF({ ...f, savedAmount: v })} ariaLabel="Amount saved so far" /> : null}
        </fieldset>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ recurring

type RecurringKind = 'transaction' | 'invoice' | 'bill';

interface RecurringDTO {
  id: string;
  kind: RecurringKind;
  name: string;
  template: Record<string, any>;
  frequency: Frequency;
  nextDate: string;
  endDate: string | null;
  remaining: number | null;
  autoPost: boolean;
  active: boolean;
  lastRunAt: number | null;
  lastError: string;
  createdBy: string | null;
}

const KIND_LABELS: Record<RecurringKind, string> = { transaction: 'Transaction', invoice: 'Invoice', bill: 'Bill' };

function templateTotal(r: { kind: RecurringKind; template: Record<string, any> }): number {
  const t = r.template;
  if (r.kind === 'transaction') return t.kind === 'transfer' ? Number(t.amount) || 0 : (t.lines ?? []).reduce((n: number, l: any) => n + (Number(l.amount) || 0), 0);
  return (t.lines ?? []).reduce((n: number, l: any) => n + Math.round((Number(l.unitPrice) || 0) * (l.quantity === undefined || l.quantity === null ? 1 : Number(l.quantity))), 0);
}

export function Recurring() {
  const org = useCurrentOrg();
  const { session } = useSession();
  const { fmt } = useMoney();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const accounts = useAccounts().data ?? [];
  const q = useQuery({ queryKey: ['fin', org.id, 'recurring'], queryFn: () => get<RecurringDTO[]>(fin(org.id, '/recurring')) });
  const [editing, setEditing] = useState<RecurringDTO | 'new' | null>(null);
  usePageTitle('Recurring');
  const business = org.kind === 'business';
  const kinds: RecurringKind[] = [
    ...(org.perms.banking.create ? (['transaction'] as const) : []),
    ...(business && org.perms.sales.create ? (['invoice'] as const) : []),
    ...(business && org.perms.purchases.create ? (['bill'] as const) : []),
  ];
  const canChange = (r: RecurringDTO) => r.createdBy === session?.user.id || org.role === 'owner' || org.role === 'admin' || org.perms.accounting.manage;
  const base = `/o/${org.id}`;
  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const runNow = (r: RecurringDTO) =>
    act(async () => {
      const res = await post<{ id: string; status: string; nextDate: string | null }>(fin(org.id, `/recurring/${r.id}/run`), {});
      const to = r.kind === 'transaction' ? `${base}/transactions/${res.id}` : `${base}/${r.kind === 'invoice' ? 'invoices' : 'bills'}/${res.id}`;
      const what = res.status === 'posted' ? 'posted' : res.status === 'approved' ? 'approved' : res.status === 'submitted' ? 'sent for approval' : 'saved as a draft';
      toast(`${KIND_LABELS[r.kind]} for ${shortDate(r.nextDate)} ${what}${res.nextDate ? `. Next: ${shortDate(res.nextDate)}` : '. The schedule has finished'}`, 'info', { label: 'Open', run: () => navigate(to) });
    });
  const describe = (r: RecurringDTO) => {
    const t = r.template;
    if (r.kind === 'transaction') {
      const acc = accounts.find((a) => a.id === t.accountId);
      if (t.kind === 'transfer') return `Transfer from ${accountLabel(acc)} to ${accountLabel(accounts.find((a) => a.id === t.toAccountId))}`;
      return `${t.kind === 'receive' ? 'Money in to' : 'Money out of'} ${accountLabel(acc)}${t.payee ? `, ${t.payee}` : ''}`;
    }
    return `${KIND_LABELS[r.kind]}${t.lines?.[0]?.description ? `: ${t.lines[0].description}` : ''}`;
  };
  const rows = q.data ?? [];
  return (
    <div className="page crm-page">
      <PageHeader
        title="Recurring"
        icon="refresh"
        subtitle="Transactions, invoices and bills that repeat. Each one is created on its date, posted or left as a draft as you choose."
        actions={kinds.length ? <button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" size={14} /> New recurring</button> : null}
      />
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="refresh" title="Nothing recurring yet" action={kinds.length ? <button className="btn primary" onClick={() => setEditing('new')}>Set one up</button> : undefined}>
          For example rent, a salary, a subscription or a monthly invoice to a customer.
        </EmptyState>
      ) : (
        <div className="card crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>What</th>
                <th className="fin-num">Amount</th>
                <th>Every</th>
                <th>Next</th>
                <th>Ends</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="crm-primary">{r.name}</td>
                  <td className="muted">{describe(r)}</td>
                  <td className="fin-num">{fmt(templateTotal(r))}{r.kind !== 'transaction' && r.template.taxMode === 'exclusive' ? <span className="muted small"> + GST</span> : null}</td>
                  <td>{FREQUENCY_LABELS[r.frequency]}</td>
                  <td>{r.active ? shortDate(r.nextDate) : ''}</td>
                  <td>{r.endDate ? shortDate(r.endDate) : r.remaining !== null ? `After ${r.remaining} more` : 'No end'}</td>
                  <td>
                    {r.lastError ? (
                      <span className="badge danger" title={r.lastError}>Paused: {r.lastError.slice(0, 60)}</span>
                    ) : r.active ? (
                      <span className="badge success">{r.autoPost ? (r.kind === 'transaction' ? 'Posts' : 'Approves') : 'Drafts'}</span>
                    ) : (
                      <span className="badge">{r.lastRunAt ? 'Paused or finished' : 'Paused'}</span>
                    )}
                  </td>
                  <td className="fin-num">
                    {canChange(r) ? (
                      <div className="row">
                        {r.active ? <button className="btn sm" onClick={() => runNow(r)} title={`Create the one due ${shortDate(r.nextDate)} now`}>Run now</button> : null}
                        <button className="btn sm ghost" onClick={() => act(() => patch(fin(org.id, `/recurring/${r.id}`), { active: !r.active }))}>{r.active ? 'Pause' : 'Resume'}</button>
                        <button className="btn sm ghost" onClick={() => setEditing(r)}>Edit</button>
                        <button
                          className="btn sm ghost"
                          onClick={async () => {
                            if (await confirm({ title: `Delete ${r.name}?`, message: 'Nothing more is created. Records it already created stay.', confirmLabel: 'Delete', danger: true })) act(() => del(fin(org.id, `/recurring/${r.id}`)));
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="muted small crm-pad-top">Recurring records are created by BIZOMAT on their date with the permissions of the person who set them up. If one cannot be created (for example its account was archived), the schedule pauses and that person is notified.</p>
      {editing ? <RecurringForm kinds={kinds} existing={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} onSaved={() => q.refetch()} /> : null}
    </div>
  );
}

interface TxLineDraft {
  accountId: string | null;
  amount: number | null;
  taxCodeId: string | null;
  description: string;
}

interface DocLineDraft {
  description: string;
  quantity: string;
  unitPrice: number | null;
  accountId: string | null;
  taxCodeId: string | null;
}

function RecurringForm({ kinds, existing, onClose, onSaved }: { kinds: RecurringKind[]; existing?: RecurringDTO; onClose: () => void; onSaved: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const business = org.kind === 'business';
  const t = existing?.template ?? {};
  const [kind, setKind] = useState<RecurringKind>(existing?.kind ?? kinds[0] ?? 'transaction');
  const [f, setF] = useState({
    name: existing?.name ?? '',
    frequency: existing?.frequency ?? ('monthly' as Frequency),
    nextDate: existing?.nextDate ?? todayLocal(),
    ends: existing?.endDate ? 'date' : existing?.remaining !== null && existing?.remaining !== undefined ? 'count' : 'never',
    endDate: existing?.endDate ?? '',
    remaining: existing?.remaining ? String(existing.remaining) : '12',
    autoPost: existing?.autoPost ?? true,
  });
  // A transaction's template.
  const [tx, setTx] = useState({
    kind: (existing?.kind === 'transaction' ? t.kind : 'spend') as 'spend' | 'receive' | 'transfer',
    accountId: (existing?.kind === 'transaction' ? t.accountId : null) as string | null,
    toAccountId: (t.toAccountId ?? null) as string | null,
    amount: (t.kind === 'transfer' ? Number(t.amount) : null) as number | null,
    payee: (t.payee ?? '') as string,
    description: (t.description ?? '') as string,
    contactId: (t.contactId ?? null) as string | null,
    taxMode: (t.taxMode ?? (org.gst ? 'inclusive' : 'none')) as 'inclusive' | 'exclusive' | 'none',
  });
  const [txLines, setTxLines] = useState<TxLineDraft[]>(existing?.kind === 'transaction' && t.kind !== 'transfer' && Array.isArray(t.lines) && t.lines.length ? t.lines.map((l: any) => ({ accountId: l.accountId ?? null, amount: Number(l.amount) || null, taxCodeId: l.taxCodeId ?? null, description: l.description ?? '' })) : [{ accountId: null, amount: null, taxCodeId: null, description: '' }]);
  // An invoice's or bill's template.
  const [doc, setDoc] = useState({
    contactId: (existing && existing.kind !== 'transaction' ? t.contactId : null) as string | null,
    reference: (t.reference ?? '') as string,
    notes: (t.notes ?? '') as string,
    taxMode: (existing && existing.kind !== 'transaction' ? t.taxMode : org.gst ? 'exclusive' : 'none') as 'inclusive' | 'exclusive' | 'none',
  });
  const [docLines, setDocLines] = useState<DocLineDraft[]>(existing && existing.kind !== 'transaction' && Array.isArray(t.lines) && t.lines.length ? t.lines.map((l: any) => ({ description: l.description ?? '', quantity: String(l.quantity ?? 1), unitPrice: Number(l.unitPrice) || null, accountId: l.accountId ?? null, taxCodeId: l.taxCodeId ?? null })) : [{ description: '', quantity: '1', unitPrice: null, accountId: null, taxCodeId: null }]);
  const [busy, setBusy] = useState(false);
  const direction = kind === 'invoice' || (kind === 'transaction' && tx.kind === 'receive') ? 'in' : 'out';
  const taxDir = direction === 'in' ? 'sales' : 'purchases';

  const template = (): Record<string, unknown> | string => {
    if (kind === 'transaction') {
      if (!tx.accountId) return 'Choose the bank or card account';
      if (tx.kind === 'transfer') {
        if (!tx.toAccountId) return 'Choose the account the money goes to';
        if (!tx.amount) return 'Enter the amount transferred';
        return { kind: 'transfer', accountId: tx.accountId, toAccountId: tx.toAccountId, amount: tx.amount, description: tx.description, payee: tx.payee };
      }
      const lines = txLines.filter((l) => l.accountId || l.amount);
      if (!lines.length || lines.some((l) => !l.accountId || !l.amount)) return 'Each line needs a category and an amount';
      return {
        kind: tx.kind,
        accountId: tx.accountId,
        payee: tx.payee,
        description: tx.description,
        contactId: business ? tx.contactId : null,
        taxMode: org.gst ? tx.taxMode : 'none',
        lines: lines.map((l) => ({ accountId: l.accountId, amount: l.amount, taxCodeId: org.gst ? l.taxCodeId : null, description: l.description })),
      };
    }
    const lines = docLines.filter((l) => l.description || l.unitPrice || l.accountId);
    if (!lines.length) return 'Add at least one line';
    for (const l of lines) {
      const qn = Number(l.quantity);
      if (!Number.isFinite(qn) || qn <= 0) return 'Each quantity must be more than zero';
      if (l.unitPrice === null) return 'Each line needs a price';
      if (!l.accountId) return 'Each line needs an account';
    }
    if (!doc.contactId) return kind === 'invoice' ? 'Choose the customer' : 'Choose the supplier';
    return {
      contactId: doc.contactId,
      reference: doc.reference,
      notes: doc.notes,
      taxMode: org.gst ? doc.taxMode : 'none',
      lines: lines.map((l) => ({ description: l.description, quantity: Number(l.quantity), unitPrice: l.unitPrice, accountId: l.accountId, taxCodeId: org.gst ? l.taxCodeId : null })),
    };
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const tpl = template();
    if (typeof tpl === 'string') {
      toast(tpl, 'error');
      return;
    }
    if (f.ends === 'date' && (!f.endDate || f.endDate < f.nextDate)) {
      toast('The end date must be on or after the first date', 'error');
      return;
    }
    const remaining = Number(f.remaining);
    if (f.ends === 'count' && (!Number.isInteger(remaining) || remaining < 1 || remaining > 1000)) {
      toast('Choose how many times, from 1 to 1,000', 'error');
      return;
    }
    // The day of the month to keep (31st -> 28 February -> 31 March): from the first date, kept while it does not change.
    const anchorDay = existing && existing.nextDate === f.nextDate && t.anchorDay ? t.anchorDay : Number(f.nextDate.slice(8));
    const body = {
      name: f.name,
      template: { ...tpl, anchorDay },
      frequency: f.frequency,
      nextDate: f.nextDate,
      endDate: f.ends === 'date' ? f.endDate : null,
      remaining: f.ends === 'count' ? remaining : null,
      autoPost: f.autoPost,
    };
    setBusy(true);
    try {
      if (existing) await patch(fin(org.id, `/recurring/${existing.id}`), body);
      else await post(fin(org.id, '/recurring'), { ...body, kind });
      onSaved();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const setTxLine = (i: number, p: Partial<TxLineDraft>) => setTxLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...p } : l)));
  const setDocLine = (i: number, p: Partial<DocLineDraft>) => setDocLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...p } : l)));

  return (
    <Modal
      wide
      title={existing ? `Edit ${existing.name}` : 'New recurring'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="fin-recurring" disabled={busy || !f.name.trim()}>{busy ? 'Saving…' : 'Save'}</button>
        </>
      }
    >
      <form id="fin-recurring" onSubmit={save}>
        <div className="crm-form-grid">
          {!existing && kinds.length > 1 ? (
            <div className="field">
              <label htmlFor="rec-kind">Create a</label>
              <select id="rec-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as RecurringKind)}>
                {kinds.map((k) => (
                  <option key={k} value={k}>{KIND_LABELS[k]}</option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="rec-name">Name</label>
            <input id="rec-name" className="input" required maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder={kind === 'transaction' ? 'For example: Rent' : 'For example: Monthly support'} />
          </div>
          <div className="field">
            <label htmlFor="rec-freq">Every</label>
            <select id="rec-freq" className="select" value={f.frequency} onChange={(e) => setF({ ...f, frequency: e.target.value as Frequency })}>
              {FREQUENCIES.map((fr) => (
                <option key={fr} value={fr}>{FREQUENCY_LABELS[fr]}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rec-next">{existing ? 'Next date' : 'First date'}</label>
            <input id="rec-next" className="input" type="date" required value={f.nextDate} onChange={(e) => e.target.value && setF({ ...f, nextDate: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="rec-ends">Ends</label>
            <select id="rec-ends" className="select" value={f.ends} onChange={(e) => setF({ ...f, ends: e.target.value })}>
              <option value="never">Never</option>
              <option value="date">On a date</option>
              <option value="count">After a number of times</option>
            </select>
          </div>
          {f.ends === 'date' ? (
            <div className="field">
              <label htmlFor="rec-end">Last date</label>
              <input id="rec-end" className="input" type="date" required value={f.endDate} min={f.nextDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} />
            </div>
          ) : null}
          {f.ends === 'count' ? (
            <div className="field">
              <label htmlFor="rec-count">Times{existing ? ' still to run' : ''}</label>
              <input id="rec-count" className="input sm crm-num" type="number" min={1} max={1000} required value={f.remaining} onChange={(e) => setF({ ...f, remaining: e.target.value })} />
            </div>
          ) : null}
        </div>
        <label className="row">
          <input type="checkbox" checked={f.autoPost} onChange={(e) => setF({ ...f, autoPost: e.target.checked })} />
          {kind === 'transaction' ? 'Post each one straight away (it waits for approval if your role needs it)' : 'Approve each one straight away (it waits for approval if your role needs it)'}
        </label>
        <p className="muted small">{f.autoPost ? '' : 'Each one is saved as a draft for you to check and post.'}</p>

        {kind === 'transaction' ? (
          <fieldset className="crm-fieldset">
            <legend>Transaction</legend>
            <div className="crm-form-grid">
              <div className="field">
                <label htmlFor="rec-txkind">Type</label>
                <select id="rec-txkind" className="select" value={tx.kind} onChange={(e) => setTx({ ...tx, kind: e.target.value as 'spend' | 'receive' | 'transfer' })}>
                  <option value="spend">Money out</option>
                  <option value="receive">Money in</option>
                  <option value="transfer">Transfer between accounts</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="rec-acc">{tx.kind === 'transfer' ? 'From account' : 'Account'}</label>
                <AccountSelect id="rec-acc" kind="money" value={tx.accountId} onChange={(v) => setTx({ ...tx, accountId: v })} emptyLabel="Choose an account…" />
              </div>
              {tx.kind === 'transfer' ? (
                <>
                  <div className="field">
                    <label htmlFor="rec-to">To account</label>
                    <AccountSelect id="rec-to" kind="money" value={tx.toAccountId} onChange={(v) => setTx({ ...tx, toAccountId: v })} emptyLabel="Choose an account…" include={(a) => a.id !== tx.accountId} />
                  </div>
                  <div className="field">
                    <label htmlFor="rec-amt">Amount</label>
                    <MoneyInput id="rec-amt" value={tx.amount} onChange={(v) => setTx({ ...tx, amount: v })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="rec-payee">{tx.kind === 'receive' ? 'From' : 'Paid to'}</label>
                    <input id="rec-payee" className="input" maxLength={200} value={tx.payee} onChange={(e) => setTx({ ...tx, payee: e.target.value })} />
                  </div>
                  {business ? (
                    <div className="field">
                      <label htmlFor="rec-contact">Contact</label>
                      <ContactSelect id="rec-contact" value={tx.contactId} onChange={(v) => setTx({ ...tx, contactId: v })} kind={tx.kind === 'receive' ? 'customer' : 'supplier'} />
                    </div>
                  ) : null}
                  {org.gst ? (
                    <div className="field">
                      <label htmlFor="rec-taxmode">Amounts</label>
                      <select id="rec-taxmode" className="select" value={tx.taxMode} onChange={(e) => setTx({ ...tx, taxMode: e.target.value as 'inclusive' | 'exclusive' })}>
                        <option value="inclusive">Include GST</option>
                        <option value="exclusive">Exclude GST</option>
                      </select>
                    </div>
                  ) : null}
                </>
              )}
              <div className="field crm-span">
                <label htmlFor="rec-desc">Description</label>
                <input id="rec-desc" className="input" maxLength={500} value={tx.description} onChange={(e) => setTx({ ...tx, description: e.target.value })} />
              </div>
            </div>
            {tx.kind !== 'transfer' ? (
              <div className="crm-table-scroll">
                <table className="fin-lines">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                      {org.gst ? <th>GST</th> : null}
                      <th>Amount</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {txLines.map((l, i) => (
                      <tr key={i}>
                        <td><AccountSelect kind="category" direction={tx.kind === 'receive' ? 'in' : 'out'} value={l.accountId} onChange={(v) => setTxLine(i, { accountId: v })} emptyLabel="Choose…" ariaLabel={`Line ${i + 1} category`} /></td>
                        <td><input className="input" maxLength={500} aria-label={`Line ${i + 1} description`} value={l.description} onChange={(e) => setTxLine(i, { description: e.target.value })} /></td>
                        {org.gst ? <td><TaxCodeSelect direction={taxDir} value={l.taxCodeId} onChange={(v) => setTxLine(i, { taxCodeId: v })} ariaLabel={`Line ${i + 1} tax code`} /></td> : null}
                        <td><MoneyInput value={l.amount} onChange={(v) => setTxLine(i, { amount: v })} ariaLabel={`Line ${i + 1} amount`} /></td>
                        <td className="fin-line-actions">{txLines.length > 1 ? <button type="button" className="btn ghost icon sm" aria-label={`Remove line ${i + 1}`} onClick={() => setTxLines((ls) => ls.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button> : null}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn sm" onClick={() => setTxLines((ls) => [...ls, { accountId: null, amount: null, taxCodeId: null, description: '' }])}><Icon name="plus" size={14} /> Split into another category</button>
              </div>
            ) : null}
          </fieldset>
        ) : (
          <fieldset className="crm-fieldset">
            <legend>{KIND_LABELS[kind]}</legend>
            <div className="crm-form-grid">
              <div className="field">
                <label htmlFor="rec-dcontact">{kind === 'invoice' ? 'Customer' : 'Supplier'}</label>
                <ContactSelect id="rec-dcontact" value={doc.contactId} onChange={(v) => setDoc({ ...doc, contactId: v })} kind={kind === 'invoice' ? 'customer' : 'supplier'} emptyLabel="Choose…" />
              </div>
              <div className="field">
                <label htmlFor="rec-ref">Reference</label>
                <input id="rec-ref" className="input" maxLength={100} value={doc.reference} onChange={(e) => setDoc({ ...doc, reference: e.target.value })} />
              </div>
              {org.gst ? (
                <div className="field">
                  <label htmlFor="rec-dtax">Prices</label>
                  <select id="rec-dtax" className="select" value={doc.taxMode} onChange={(e) => setDoc({ ...doc, taxMode: e.target.value as 'inclusive' | 'exclusive' | 'none' })}>
                    <option value="exclusive">Exclude GST</option>
                    <option value="inclusive">Include GST</option>
                    <option value="none">No GST</option>
                  </select>
                </div>
              ) : null}
            </div>
            <div className="crm-table-scroll">
              <table className="fin-lines">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Account</th>
                    {org.gst ? <th>GST</th> : null}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {docLines.map((l, i) => (
                    <tr key={i}>
                      <td><input className="input" maxLength={500} aria-label={`Line ${i + 1} description`} value={l.description} onChange={(e) => setDocLine(i, { description: e.target.value })} /></td>
                      <td><input className="input sm crm-num" type="number" min={0} step="0.001" aria-label={`Line ${i + 1} quantity`} value={l.quantity} onChange={(e) => setDocLine(i, { quantity: e.target.value })} /></td>
                      <td><MoneyInput value={l.unitPrice} onChange={(v) => setDocLine(i, { unitPrice: v })} ariaLabel={`Line ${i + 1} price`} /></td>
                      <td><AccountSelect kind="category" direction={kind === 'invoice' ? 'in' : 'out'} value={l.accountId} onChange={(v) => setDocLine(i, { accountId: v })} emptyLabel="Choose…" ariaLabel={`Line ${i + 1} account`} /></td>
                      {org.gst ? <td><TaxCodeSelect direction={taxDir} value={l.taxCodeId} onChange={(v) => setDocLine(i, { taxCodeId: v })} ariaLabel={`Line ${i + 1} tax code`} /></td> : null}
                      <td className="fin-line-actions">{docLines.length > 1 ? <button type="button" className="btn ghost icon sm" aria-label={`Remove line ${i + 1}`} onClick={() => setDocLines((ls) => ls.filter((_, j) => j !== i))}><Icon name="x" size={14} /></button> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="btn sm" onClick={() => setDocLines((ls) => [...ls, { description: '', quantity: '1', unitPrice: null, accountId: null, taxCodeId: null }])}><Icon name="plus" size={14} /> Add a line</button>
            </div>
            <div className="field crm-pad-top">
              <label htmlFor="rec-notes">Notes</label>
              <textarea id="rec-notes" className="input" rows={2} maxLength={2000} value={doc.notes} onChange={(e) => setDoc({ ...doc, notes: e.target.value })} />
            </div>
            <p className="muted small">The due date of each one follows the {kind === 'invoice' ? 'customer’s' : 'supplier’s'} payment terms, or the workspace’s.</p>
          </fieldset>
        )}
      </form>
    </Modal>
  );
}
