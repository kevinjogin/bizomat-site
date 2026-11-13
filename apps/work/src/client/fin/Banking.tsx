// Bank accounts: the money accounts (bank, cash, credit cards, loans) with their balances, and for each one the
// statement import (CSV, OFX or QIF files the person downloads from their own bank), matching the statement's lines to
// what is recorded, and reconciliation. BIZOMAT never connects to a bank and never asks for banking passwords.
import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { errorMessage, get, post } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Modal, useToast } from '../components/ui/overlays';
import { accountLabel, dateTime, fin, moneyAccounts, shortDate, subtypeLabel, todayLocal, useAccounts, useCurrentOrg, useRefresh, type AccountDTO, type FinOrgDTO } from './lib';
import { AccountSelect, ContactSelect, Hint, Money, MoneyInput, Stat, StatusBadge, TabLinks, TaxCodeSelect } from './ui';

const MONEY_KINDS: { key: string; label: string; hint: string }[] = [
  { key: 'bank', label: 'Bank account', hint: 'Everyday, savings, offset or business accounts.' },
  { key: 'cash', label: 'Cash', hint: 'Notes and coins, petty cash.' },
  { key: 'credit_card', label: 'Credit card', hint: 'The balance is what you owe.' },
  { key: 'loan', label: 'Loan', hint: 'A mortgage, car or business loan: the balance is what you owe.' },
];

const isDebt = (a: Pick<AccountDTO, 'type'>) => a.type === 'liability';
const postsDirectly = (org: FinOrgDTO) => org.perms.banking.approve || !org.settings.approvals.transactions;

// ------------------------------------------------------------------ the accounts

export function BankAccounts() {
  const org = useCurrentOrg();
  usePageTitle('Bank accounts');
  const q = useAccounts();
  const [adding, setAdding] = useState(false);
  const refresh = useRefresh();
  const toast = useToast();
  const navigate = useNavigate();
  if (org.perms.banking.view === 'none') return <div className="page"><EmptyState icon="building" title="Your role does not include bank accounts">Ask an owner or administrator of {org.name} if you need them.</EmptyState></div>;
  const list = moneyAccounts(q.data ?? []);
  const cashAccounts = list.filter((a) => !isDebt(a));
  const debts = list.filter(isDebt);
  const seesBalances = list.some((a) => a.balance !== undefined);
  const cash = cashAccounts.reduce((n, a) => n + (a.balance ?? 0), 0);
  const owed = debts.reduce((n, a) => n + (a.balance ?? 0), 0);
  const canManage = org.perms.accounting.manage;

  const table = (title: string, rows: AccountDTO[]) =>
    rows.length ? (
      <section className="card">
        <h2 className="crm-group-head">{title}</h2>
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Bank details</th>
                {seesBalances ? <th className="fin-num">{rows === debts ? 'Owed' : 'Balance'}</th> : null}
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/o/${org.id}/banking/${a.id}`} className="crm-primary">{accountLabel(a)}</Link>
                    {a.isDefault ? <span className="badge accent">Default</span> : null}
                  </td>
                  <td className="small">{subtypeLabel(a.subtype)}</td>
                  <td className="small">{[a.bankName, a.bankNumber].filter(Boolean).join(' · ')}</td>
                  {seesBalances ? <td className="fin-num"><Money value={a.balance} tone={!isDebt(a)} strong /></td> : null}
                  <td>
                    <div className="row wrap">
                      <Link className="btn sm" to={`/o/${org.id}/transactions?account=${a.id}`}>Transactions</Link>
                      {org.perms.banking.view === 'all' ? <Link className="btn sm" to={`/o/${org.id}/banking/${a.id}`}>Statement and reconcile</Link> : null}
                      {org.perms.banking.import ? <Link className="btn sm" to={`/o/${org.id}/banking/${a.id}?tab=import`}><Icon name="upload" size={13} /> Import</Link> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    ) : null;

  return (
    <div className="page crm-page">
      <PageHeader
        title="Bank accounts"
        icon="building"
        subtitle="Bank, cash, credit card and loan accounts: where money comes in and goes out."
        actions={canManage ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add an account</button> : null}
      />
      <Hint>BIZOMAT never connects to your bank and never asks for your internet banking password. To bring in what the bank recorded, download a statement from your bank (CSV, OFX or QIF) and import it on the account.</Hint>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data ? (
        q.error ? null : <Loading />
      ) : !list.length ? (
        <EmptyState icon="building" title="No money accounts yet" action={canManage ? <button className="btn primary" onClick={() => setAdding(true)}>Add an account</button> : undefined}>
          Add the bank accounts, cards and loans you want to keep track of.
        </EmptyState>
      ) : (
        <div className="stack-lg">
          {seesBalances ? (
            <div className="crm-stats">
              <Stat label="Cash at bank and in hand" value={<Money value={cash} />} hint={`${cashAccounts.length} ${cashAccounts.length === 1 ? 'account' : 'accounts'}`} />
              {debts.length ? <Stat label="Owed on cards and loans" value={<Money value={owed} />} hint={`${debts.length} ${debts.length === 1 ? 'account' : 'accounts'}`} /> : null}
              {debts.length ? <Stat label="Cash less what is owed" value={<Money value={cash - owed} tone />} /> : null}
            </div>
          ) : null}
          {table('Bank and cash', cashAccounts)}
          {table('Credit cards and loans', debts)}
        </div>
      )}
      {adding ? (
        <AddAccount
          existing={q.data ?? []}
          onClose={() => setAdding(false)}
          onSaved={(id) => {
            setAdding(false);
            refresh();
            toast('Account added', 'info', { label: 'Open', run: () => navigate(`/o/${org.id}/banking/${id}`) });
          }}
        />
      ) : null}
    </div>
  );
}

/** A free code next to the workspace's other money accounts ("091" after "090"; "1030" after "1020"). */
function suggestCode(existing: AccountDTO[], subtype: string, business: boolean): string {
  const used = new Set(existing.map((a) => a.code));
  const debt = subtype === 'credit_card' || subtype === 'loan';
  const peers = existing.filter((a) => a.money && (a.type === 'liability') === debt && /^\d+$/.test(a.code));
  const width = peers[0]?.code.length ?? (business ? 3 : 4);
  const step = width >= 4 ? 10 : 1;
  let n = peers.length ? Math.max(...peers.map((a) => Number(a.code))) + step : business ? (debt ? 805 : 91) : debt ? 2010 : 1030;
  for (let i = 0; i < 200; i++) {
    const code = String(n).padStart(width, '0');
    if (!used.has(code)) return code;
    n += step;
  }
  return '';
}

function AddAccount({ existing, onClose, onSaved }: { existing: AccountDTO[]; onClose: () => void; onSaved: (id: string) => void }) {
  const org = useCurrentOrg();
  const [subtype, setSubtype] = useState('bank');
  const [name, setName] = useState('');
  const [code, setCode] = useState(() => suggestCode(existing, 'bank', org.kind === 'business'));
  const [bankName, setBankName] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [opening, setOpening] = useState<number | null>(null);
  const [openingDate, setOpeningDate] = useState(todayLocal());
  const [isDefault, setIsDefault] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debt = subtype === 'credit_card' || subtype === 'loan';
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await post<{ id: string }>(fin(org.id, '/accounts'), {
        code: code.trim(),
        name: name.trim(),
        subtype,
        bankName: bankName.trim(),
        bankNumber: bankNumber.trim(),
        isDefault,
        ...(opening ? { openingBalance: opening, openingDate } : {}),
      });
      onSaved(r.id);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="Add a money account"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="add-money-account" disabled={busy || !name.trim() || !code.trim()}>{busy ? 'Adding…' : 'Add account'}</button>
        </>
      }
    >
      <form id="add-money-account" className="stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="acc-kind">Kind</label>
          <select id="acc-kind" className="select" value={subtype} onChange={(e) => { setSubtype(e.target.value); setCode(suggestCode(existing, e.target.value, org.kind === 'business')); }}>
            {MONEY_KINDS.map((k) => (
              <option key={k.key} value={k.key}>{k.label}</option>
            ))}
          </select>
          <span className="hint">{MONEY_KINDS.find((k) => k.key === subtype)?.hint}</span>
        </div>
        <div className="crm-form-grid">
          <div className="field crm-span">
            <label htmlFor="acc-name">Name</label>
            <input id="acc-name" className="input" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder={debt ? 'For example: Visa card' : 'For example: Business cheque account'} />
          </div>
          <div className="field">
            <label htmlFor="acc-code">Code</label>
            <input id="acc-code" className="input" required maxLength={12} value={code} onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9.-]/g, ''))} />
          </div>
          <div className="field">
            <label htmlFor="acc-bank">Bank or lender</label>
            <input id="acc-bank" className="input" maxLength={120} value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </div>
          <div className="field crm-span">
            <label htmlFor="acc-number">{subtype === 'bank' ? 'BSB and account number' : 'Account number (optional)'}</label>
            <input id="acc-number" className="input" maxLength={40} value={bankNumber} onChange={(e) => setBankNumber(e.target.value)} />
            <span className="hint">For your reference and on invoices. Never a password or PIN.</span>
          </div>
          <div className="field">
            <label htmlFor="acc-opening">{debt ? 'Owed at the start' : 'Balance at the start'}</label>
            <MoneyInput id="acc-opening" signed={!debt} value={opening} onChange={setOpening} placeholder="0.00" />
          </div>
          <div className="field">
            <label htmlFor="acc-opening-date">On</label>
            <input id="acc-opening-date" className="input" type="date" value={openingDate} onChange={(e) => setOpeningDate(e.target.value)} />
          </div>
        </div>
        <label className="row small">
          <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} /> Use this account first for new transactions
        </label>
        <p className="muted small">The starting balance is posted against Opening balances, so the books stay balanced. Leave it empty to start at zero.</p>
        {error ? <div className="error-box" role="alert">{error}</div> : null}
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ one account

type Tab = 'lines' | 'import' | 'reconcile';

export function AccountPage() {
  const { accountId = '' } = useParams();
  const org = useCurrentOrg();
  const [params] = useSearchParams();
  const q = useAccounts();
  const account = q.data?.find((a) => a.id === accountId);
  usePageTitle(account ? accountLabel(account) : 'Bank account');
  const seesStatement = org.perms.banking.view === 'all';
  const canImport = org.perms.banking.import;
  const requested = (params.get('tab') as Tab | null) ?? (seesStatement ? 'lines' : 'import');
  const tab: Tab = requested === 'import' && canImport ? 'import' : requested === 'reconcile' && seesStatement ? 'reconcile' : seesStatement ? 'lines' : 'import';
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data) return <Loading />;
  if (!account || !account.money) return <div className="page"><EmptyState icon="building" title="This is not a money account">Statements are imported on bank, cash, credit card and loan accounts. <Link to={`/o/${org.id}/banking`}>See the bank accounts</Link>.</EmptyState></div>;
  if (!seesStatement && !canImport) return <div className="page"><EmptyState icon="building" title="Your role does not include statements">You can still see your own transactions on this account. <Link to={`/o/${org.id}/transactions?account=${account.id}`}>Open them</Link>.</EmptyState></div>;
  const base = `/o/${org.id}/banking/${account.id}`;
  return (
    <div className="page crm-page">
      <PageHeader
        title={accountLabel(account)}
        icon="building"
        subtitle={
          <>
            {subtypeLabel(account.subtype)}
            {account.bankName ? ` · ${account.bankName}` : ''}
            {account.balance !== undefined ? <> · {isDebt(account) ? 'Owed' : 'Balance'} <Money value={account.balance} strong /></> : null}
          </>
        }
        actions={<Link className="btn" to={`/o/${org.id}/transactions?account=${account.id}`}><Icon name="list" size={14} /> Transactions</Link>}
      />
      <p><Link to={`/o/${org.id}/banking`} className="small"><Icon name="chevronLeft" size={12} /> All bank accounts</Link></p>
      <TabLinks
        active={tab}
        tabs={[
          { key: 'lines', label: 'Statement lines', to: `${base}?tab=lines`, hidden: !seesStatement },
          { key: 'import', label: 'Import a statement', to: `${base}?tab=import`, hidden: !canImport },
          { key: 'reconcile', label: 'Reconcile', to: `${base}?tab=reconcile`, hidden: !seesStatement },
        ]}
      />
      {tab === 'lines' ? <StatementLines account={account} /> : tab === 'import' ? <ImportStatement account={account} /> : <Reconcile account={account} />}
    </div>
  );
}

// ------------------------------------------------------------------ import

type Format = 'csv' | 'ofx' | 'qif';
type DateFormat = 'dmy' | 'mdy' | 'ymd';

interface Mapping {
  date: number;
  amount?: number;
  debit?: number;
  credit?: number;
  description?: number;
  payee?: number;
  reference?: number;
  dateFormat?: DateFormat;
  hasHeader?: boolean;
  invert?: boolean;
}

interface PreviewRow {
  date: string;
  amount: number;
  description: string;
  payee: string;
  reference: string;
  duplicate: boolean;
}

interface Preview {
  header?: string[];
  mapping?: Mapping;
  errors: { line: number; message: string }[];
  rows: PreviewRow[];
  total: number;
  duplicates: number;
}

const MAX_BYTES = 3_000_000;
const DATE_FORMATS: { key: DateFormat; label: string }[] = [
  { key: 'dmy', label: 'Day, month, year (13/11/2026)' },
  { key: 'mdy', label: 'Month, day, year (11/13/2026)' },
  { key: 'ymd', label: 'Year, month, day (2026-11-13)' },
];

function formatOf(filename: string): Format {
  const ext = filename.toLowerCase().split('.').pop() ?? '';
  if (ext === 'ofx' || ext === 'qfx') return 'ofx';
  if (ext === 'qif') return 'qif';
  return 'csv';
}

function ImportStatement({ account }: { account: AccountDTO }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [format, setFormat] = useState<Format>('csv');
  const [dateFormat, setDateFormat] = useState<DateFormat>('dmy');
  const [mapping, setMapping] = useState<Mapping | null>(null);
  const [amountMode, setAmountMode] = useState<'one' | 'two'>('one');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const body = (f: { name: string; text: string }, fmt: Format, m: Mapping | null, df: DateFormat) => ({
    format: fmt,
    filename: f.name.slice(0, 200),
    text: f.text,
    ...(fmt === 'csv' && m ? { mapping: m } : {}),
    ...(fmt === 'qif' ? { dateFormat: df } : {}),
  });

  const runPreview = async (f: { name: string; text: string }, fmt: Format, m: Mapping | null, df: DateFormat) => {
    setBusy(true);
    setError(null);
    try {
      const r = await post<Preview>(fin(org.id, `/accounts/${account.id}/statement/preview`), body(f, fmt, m, df));
      setPreview(r);
      if (fmt === 'csv' && r.mapping) {
        setMapping(r.mapping);
        setAmountMode(r.mapping.amount === undefined && (r.mapping.debit !== undefined || r.mapping.credit !== undefined) ? 'two' : 'one');
        if (r.mapping.dateFormat) setDateFormat(r.mapping.dateFormat);
      }
    } catch (e) {
      setPreview(null);
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const choose = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError('The file is too large (3 MB at most). Download a shorter period from your bank.');
      return;
    }
    const text = await f.text();
    const fmt = formatOf(f.name);
    const next = { name: f.name, text };
    setFile(next);
    setFormat(fmt);
    setMapping(null);
    setPreview(null);
    runPreview(next, fmt, null, dateFormat);
  };

  const changeMapping = (m: Mapping) => {
    setMapping(m);
    if (file) runPreview(file, format, m, dateFormat);
  };

  const doImport = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const r = await post<{ imported: number; duplicates: number; errors: { line: number; message: string }[] }>(fin(org.id, `/accounts/${account.id}/statement/import`), body(file, format, format === 'csv' ? mapping : null, dateFormat));
      toast(`${r.imported} ${r.imported === 1 ? 'line' : 'lines'} imported${r.duplicates ? `, ${r.duplicates} already there` : ''}${r.errors.length ? `, ${r.errors.length} unreadable` : ''}`);
      setFile(null);
      setPreview(null);
      setMapping(null);
      if (input.current) input.current.value = '';
      refresh();
      if (org.perms.banking.view === 'all') navigate(`/o/${org.id}/banking/${account.id}?tab=lines`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const columns = (preview?.header ?? []).map((h, i) => ({ i, label: `Column ${i + 1}${h ? `: ${h.slice(0, 40)}` : ''}` }));
  const colSelect = (label: string, key: keyof Mapping, optional: boolean) => (
    <div className="field">
      <label htmlFor={`map-${key}`}>{label}</label>
      <select
        id={`map-${key}`}
        className="select"
        value={mapping?.[key] === undefined ? '' : String(mapping[key])}
        onChange={(e) => {
          const m: Record<string, unknown> = { ...(mapping ?? { date: 0 }) };
          if (e.target.value === '') delete m[key];
          else m[key] = Number(e.target.value);
          changeMapping(m as unknown as Mapping);
        }}
      >
        {optional ? <option value="">Not in the file</option> : null}
        {columns.map((c) => (
          <option key={c.i} value={c.i}>{c.label}</option>
        ))}
      </select>
    </div>
  );

  const newRows = preview ? preview.total - preview.duplicates : 0;

  return (
    <div className="stack">
      <section className="card card-pad stack">
        <p>
          <strong>BIZOMAT never connects to your bank and never asks for your internet banking password.</strong> Sign in to your bank yourself, download a statement for {accountLabel(account)} as CSV, OFX or QIF, and upload the file here. Lines already imported are recognised and skipped.
        </p>
        <div className="row wrap">
          <input ref={input} type="file" accept=".csv,.txt,.ofx,.qfx,.qif" aria-label="Statement file" onChange={(e) => choose(e.target.files)} />
          {busy ? <Spinner /> : null}
        </div>
        {file ? (
          <div className="fin-form-grid">
            <div className="field">
              <label htmlFor="stmt-format">File type</label>
              <select id="stmt-format" className="select" value={format} onChange={(e) => { const f = e.target.value as Format; setFormat(f); setMapping(null); runPreview(file, f, null, dateFormat); }}>
                <option value="csv">CSV (spreadsheet)</option>
                <option value="ofx">OFX or QFX</option>
                <option value="qif">QIF</option>
              </select>
            </div>
            {format !== 'ofx' ? (
              <div className="field">
                <label htmlFor="stmt-dates">Dates in the file</label>
                <select
                  id="stmt-dates"
                  className="select"
                  value={dateFormat}
                  onChange={(e) => {
                    const df = e.target.value as DateFormat;
                    setDateFormat(df);
                    if (format === 'csv') changeMapping({ ...(mapping ?? { date: 0 }), dateFormat: df });
                    else runPreview(file, format, mapping, df);
                  }}
                >
                  {DATE_FORMATS.map((d) => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        ) : null}
        {error ? <div className="error-box" role="alert">{error}</div> : null}
      </section>

      {file && format === 'csv' && mapping && preview ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Which column holds what</h2>
          <p className="muted small">The columns were guessed from the file. Check them against the preview below and change any that are wrong.</p>
          <div className="fin-form-grid">
            {colSelect('Date', 'date', false)}
            <div className="field">
              <label htmlFor="map-amount-mode">Amounts</label>
              <select
                id="map-amount-mode"
                className="select"
                value={amountMode}
                onChange={(e) => {
                  const mode = e.target.value as 'one' | 'two';
                  setAmountMode(mode);
                  const m: Mapping = { ...mapping };
                  if (mode === 'one') {
                    m.amount = m.amount ?? m.debit ?? m.credit ?? 1;
                    delete m.debit;
                    delete m.credit;
                  } else {
                    delete m.amount;
                  }
                  changeMapping(m);
                }}
              >
                <option value="one">One column, money out negative</option>
                <option value="two">Separate money out and money in columns</option>
              </select>
            </div>
            {amountMode === 'one' ? colSelect('Amount', 'amount', false) : (
              <>
                {colSelect('Money out (debit)', 'debit', true)}
                {colSelect('Money in (credit)', 'credit', true)}
              </>
            )}
            {colSelect('Description', 'description', true)}
            {colSelect('Payee', 'payee', true)}
            {colSelect('Reference', 'reference', true)}
          </div>
          <div className="row wrap">
            <label className="row small">
              <input type="checkbox" checked={mapping.hasHeader !== false} onChange={(e) => changeMapping({ ...mapping, hasHeader: e.target.checked })} /> The first row holds column names
            </label>
            {amountMode === 'one' ? (
              <label className="row small">
                <input type="checkbox" checked={!!mapping.invert} onChange={(e) => changeMapping({ ...mapping, invert: e.target.checked })} /> The bank shows money out as positive (swap the signs)
              </label>
            ) : null}
          </div>
        </section>
      ) : null}

      {preview ? (
        <section className="card">
          <div className="row wrap crm-pad">
            <strong className="grow">
              {preview.total} {preview.total === 1 ? 'line' : 'lines'} read: {newRows} new{preview.duplicates ? `, ${preview.duplicates} already imported` : ''}
            </strong>
            <button className="btn primary" disabled={busy || newRows <= 0} onClick={doImport}>
              <Icon name="upload" size={14} /> Import {newRows} {newRows === 1 ? 'line' : 'lines'}
            </button>
          </div>
          {preview.errors.length ? (
            <div className="error-box crm-errors">
              <strong>Lines that could not be read (they are left out):</strong>
              <ul>
                {preview.errors.slice(0, 20).map((e, i) => (
                  <li key={i}>{e.line ? `Line ${e.line}: ` : ''}{e.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {preview.rows.length ? (
            <div className="crm-table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Payee</th>
                    <th>Reference</th>
                    <th className="fin-num">Amount</th>
                    <th><span className="sr-only">Status</span></th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 100).map((r, i) => (
                    <tr key={i}>
                      <td>{shortDate(r.date)}</td>
                      <td>{r.description}</td>
                      <td>{r.payee}</td>
                      <td>{r.reference}</td>
                      <td className="fin-num"><Money value={r.amount} tone /></td>
                      <td>{r.duplicate ? <span className="badge">Already imported</span> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {preview.rows.length > 100 ? <p className="muted small crm-pad">The first 100 lines are shown; all {preview.total} are imported.</p> : null}
        </section>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ matching

interface Candidate {
  type: 'transaction' | 'payment';
  id: string;
  date: string;
  amount: number;
  description: string;
}

interface Suggestion {
  accountId: string;
  taxCodeId: string | null;
  contactId: string | null;
  reason: string;
}

interface StatementLine {
  id: string;
  date: string;
  amount: number;
  description: string;
  payee: string;
  reference: string;
  status: 'unmatched' | 'matched' | 'ignored';
  matchedType: 'transaction' | 'payment' | null;
  matchedId: string | null;
  matches: Candidate[];
  suggestions: Suggestion[];
}

const LINE_STATUSES: { key: string; label: string }[] = [
  { key: 'unmatched', label: 'To match' },
  { key: 'matched', label: 'Matched' },
  { key: 'ignored', label: 'Ignored' },
  { key: 'all', label: 'All' },
];

function StatementLines({ account }: { account: AccountDTO }) {
  const org = useCurrentOrg();
  const [status, setStatus] = useState('unmatched');
  const q = useQuery({
    queryKey: ['fin', org.id, 'statement', account.id, status],
    queryFn: () => get<{ lines: StatementLine[]; counts: Record<string, number> }>(`${fin(org.id, `/accounts/${account.id}/statement`)}?status=${status}`),
    placeholderData: keepPreviousData,
  });
  const counts = q.data?.counts ?? {};
  const total = Object.values(counts).reduce((n, x) => n + x, 0);
  return (
    <div className="stack">
      <div className="crm-views" role="tablist" aria-label="Statement lines">
        {LINE_STATUSES.map((s) => (
          <button key={s.key} role="tab" aria-selected={status === s.key} className={`tab${status === s.key ? ' active' : ''}`} onClick={() => setStatus(s.key)}>
            {s.label} <span className="muted small">{s.key === 'all' ? total : (counts[s.key] ?? 0)}</span>
          </button>
        ))}
        {q.isFetching ? <Spinner /> : null}
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data ? (
        q.error ? null : <Loading />
      ) : !q.data.lines.length ? (
        <EmptyState icon="check" title={status === 'unmatched' ? (total ? 'Every line is matched' : 'No statement lines yet') : 'Nothing here'} action={!total && org.perms.banking.import ? <Link className="btn primary" to={`/o/${org.id}/banking/${account.id}?tab=import`}>Import a statement</Link> : undefined}>
          {status === 'unmatched' && !total ? 'Import a statement from your bank, then match each line to what is recorded here.' : null}
        </EmptyState>
      ) : (
        <div className="card">
          {q.data.lines.map((l) => (
            <LineRow key={l.id} account={account} line={l} />
          ))}
          {q.data.lines.length >= 300 ? <p className="muted small crm-pad">The 300 most recent lines are shown. Match these to see older ones.</p> : null}
        </div>
      )}
    </div>
  );
}

function LineRow({ account, line }: { account: AccountDTO; line: StatementLine }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const accounts = useAccounts().data ?? [];
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const canMatch = org.perms.banking.approve;
  const canCreate = org.perms.banking.approve || postsDirectly(org);
  const name = (id: string) => accountLabel(accounts.find((a) => a.id === id));

  const act = async (path: string, payload: unknown, done: string): Promise<boolean> => {
    setBusy(true);
    try {
      await post(fin(org.id, `/statement-lines/${line.id}/${path}`), payload);
      toast(done);
      refresh();
      return true;
    } catch (e) {
      toast(errorMessage(e), 'error');
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="crm-invite-row crm-pad stack">
      <div className="row wrap">
        <span className="muted small">{shortDate(line.date)}</span>
        <div className="grow">
          <strong>{line.payee || line.description || 'Statement line'}</strong>
          <div className="muted small">{[line.payee ? line.description : '', line.reference].filter(Boolean).join(' · ')}</div>
        </div>
        <Money value={line.amount} tone strong />
        <StatusBadge status={line.status} />
        {busy ? <Spinner /> : null}
      </div>

      {line.status === 'matched' ? (
        <div className="row wrap small">
          <span className="grow">
            Matched to {line.matchedType === 'transaction' && line.matchedId ? <Link to={`/o/${org.id}/transactions/${line.matchedId}`}>a transaction</Link> : 'an invoice or bill payment'}.
          </span>
          {canMatch ? <button className="btn sm" disabled={busy} onClick={() => act('unmatch', {}, 'Unmatched')}>Unmatch</button> : null}
        </div>
      ) : line.status === 'ignored' ? (
        <div className="row wrap small">
          <span className="grow muted">Ignored: left out of matching.</span>
          {canMatch ? <button className="btn sm" disabled={busy} onClick={() => act('ignore', { ignored: false }, 'Back to match')}>Restore</button> : null}
        </div>
      ) : (
        <>
          {line.matches.length ? (
            <div className="stack">
              {line.matches.map((m) => (
                <div key={`${m.type}:${m.id}`} className="row wrap small">
                  <Icon name="link" size={13} />
                  <span className="grow">
                    Recorded: {shortDate(m.date)} · {m.type === 'transaction' ? <Link to={`/o/${org.id}/transactions/${m.id}`}>{m.description || 'Transaction'}</Link> : m.description} · <Money value={m.amount} />
                  </span>
                  {canMatch ? <button className="btn sm primary" disabled={busy} onClick={() => act('match', { type: m.type, id: m.id }, 'Matched and reconciled')}>Match</button> : null}
                </div>
              ))}
            </div>
          ) : null}
          {!line.matches.length && line.suggestions.length && canCreate ? (
            <div className="stack">
              {line.suggestions.slice(0, 3).map((s, i) => (
                <div key={i} className="row wrap small">
                  <Icon name="bolt" size={13} />
                  <span className="grow">
                    {name(s.accountId)} <span className="muted">{s.reason}</span>
                  </span>
                  <button className="btn sm" disabled={busy} onClick={() => act('create', { accountId: s.accountId, taxCodeId: org.gst ? s.taxCodeId : null, contactId: org.kind === 'business' ? s.contactId : null }, 'Recorded, matched and reconciled')}>
                    Record as {name(s.accountId)}
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <div className="row wrap">
            {canCreate ? <button className="btn sm" disabled={busy} onClick={() => setCreating((c) => !c)} aria-expanded={creating}><Icon name="plus" size={13} /> Record it</button> : null}
            {canMatch ? <button className="btn sm ghost" disabled={busy} onClick={() => act('ignore', { ignored: true }, 'Ignored')}>Ignore</button> : null}
            {!canMatch && !canCreate ? <span className="muted small">Someone who can approve transactions matches this line.</span> : null}
          </div>
          {creating ? <CreateFromLine account={account} line={line} busy={busy} onCreate={(payload) => act('create', payload, 'Recorded, matched and reconciled').then((ok) => ok && setCreating(false))} /> : null}
        </>
      )}
    </div>
  );
}

function CreateFromLine({ account, line, busy, onCreate }: { account: AccountDTO; line: StatementLine; busy: boolean; onCreate: (payload: Record<string, unknown>) => void }) {
  const org = useCurrentOrg();
  const accounts = useAccounts().data ?? [];
  const inflow = line.amount > 0;
  const [mode, setMode] = useState<'category' | 'transfer'>('category');
  const first = line.suggestions[0];
  const [accountId, setAccountId] = useState<string | null>(first?.accountId ?? null);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [taxCodeId, setTaxCodeId] = useState<string | null>(org.gst ? (first?.taxCodeId ?? null) : null);
  const [contactId, setContactId] = useState<string | null>(first?.contactId ?? null);
  const [description, setDescription] = useState(line.description);
  const [remember, setRemember] = useState(false);
  const others = moneyAccounts(accounts).filter((a) => a.id !== account.id);
  const chooseCategory = (id: string | null) => {
    setAccountId(id);
    const acc = accounts.find((a) => a.id === id);
    if (org.gst && acc?.taxCodeId && !taxCodeId) setTaxCodeId(acc.taxCodeId);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'transfer') onCreate({ transferAccountId: transferId, description });
    else onCreate({ accountId, taxCodeId: org.gst ? taxCodeId : null, contactId: org.kind === 'business' ? contactId : null, description, remember });
  };
  return (
    <form className="card card-pad stack" onSubmit={submit}>
      <div className="row wrap" role="radiogroup" aria-label="Record as">
        <label className="row small"><input type="radio" name={`mode-${line.id}`} checked={mode === 'category'} onChange={() => setMode('category')} /> {inflow ? 'Money in' : 'Money out'} with a category</label>
        {others.length ? <label className="row small"><input type="radio" name={`mode-${line.id}`} checked={mode === 'transfer'} onChange={() => setMode('transfer')} /> A transfer {inflow ? 'from' : 'to'} another account</label> : null}
      </div>
      <div className="fin-form-grid">
        {mode === 'category' ? (
          <>
            <div className="field">
              <label htmlFor={`cat-${line.id}`}>Category</label>
              <AccountSelect id={`cat-${line.id}`} kind="category" direction={inflow ? 'in' : 'out'} value={accountId} onChange={chooseCategory} required />
            </div>
            {org.gst ? (
              <div className="field">
                <label htmlFor={`tax-${line.id}`}>GST code</label>
                <TaxCodeSelect id={`tax-${line.id}`} direction={inflow ? 'sales' : 'purchases'} value={taxCodeId} onChange={setTaxCodeId} />
                <span className="hint">The statement amount includes GST.</span>
              </div>
            ) : null}
            {org.kind === 'business' && org.perms.contacts.view !== 'none' ? (
              <div className="field">
                <label htmlFor={`contact-${line.id}`}>Contact</label>
                <ContactSelect id={`contact-${line.id}`} kind={inflow ? 'customer' : 'supplier'} value={contactId} onChange={setContactId} />
              </div>
            ) : null}
          </>
        ) : (
          <div className="field">
            <label htmlFor={`transfer-${line.id}`}>{inflow ? 'From account' : 'To account'}</label>
            <select id={`transfer-${line.id}`} className="select" required value={transferId ?? ''} onChange={(e) => setTransferId(e.target.value || null)}>
              <option value="">Choose…</option>
              {others.map((a) => (
                <option key={a.id} value={a.id}>{accountLabel(a)}</option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor={`desc-${line.id}`}>Description</label>
          <input id={`desc-${line.id}`} className="input" maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
      {mode === 'category' ? (
        <label className="row small">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember: suggest this category for the next line from {line.payee || line.description || 'this payee'}
        </label>
      ) : null}
      <div>
        <button className="btn primary sm" type="submit" disabled={busy || (mode === 'category' ? !accountId : !transferId)}>
          Record, match and reconcile
        </button>
      </div>
    </form>
  );
}

// ------------------------------------------------------------------ reconcile

interface ReconcileState {
  ledgerBalance: number;
  bankSideBalance: number;
  unreconciled: { count: number; total: number; items: Candidate[] };
  unmatchedLines: { count: number; total: number };
  history: { id: string; statementDate: string; statementBalance: number; ledgerBalance: number; difference: number; by: string | null; at: number }[];
}

function Reconcile({ account }: { account: AccountDTO }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const debt = isDebt(account);
  const [date, setDate] = useState(todayLocal());
  const [balance, setBalance] = useState<number | null>(null);
  const [result, setResult] = useState<{ difference: number; balanced: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const q = useQuery({ queryKey: ['fin', org.id, 'reconcile', account.id, date], queryFn: () => get<ReconcileState>(`${fin(org.id, `/accounts/${account.id}/reconcile`)}?date=${date}`), enabled: !!date, placeholderData: keepPreviousData });
  // The bank's side: money in positive. A card or loan is entered as the amount owed and compared as a debt.
  const toBank = (natural: number) => (debt ? -natural : natural);
  const toNatural = (bank: number) => (debt ? -bank : bank);
  const canRecord = org.perms.banking.approve;
  const s = q.data;
  const preview = balance === null || !s ? null : toBank(balance) - s.bankSideBalance;

  const record = async (e: FormEvent) => {
    e.preventDefault();
    if (balance === null) return;
    setBusy(true);
    try {
      const r = await post<{ difference: number; balanced: boolean }>(fin(org.id, `/accounts/${account.id}/reconcile`), { statementDate: date, statementBalance: toBank(balance) });
      setResult(r);
      toast(r.balanced ? 'Reconciled: the statement and the books agree' : 'Recorded: the statement and the books differ');
      refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const differenceText = (bankDiff: number) => {
    const d = toNatural(bankDiff);
    if (!d) return 'The statement and the books agree.';
    return `The statement shows ${d > 0 ? 'more' : 'less'}${debt ? ' owed' : ''} than the books, by`;
  };

  return (
    <div className="stack">
      <section className="card card-pad stack">
        <p className="muted small">Compare the closing balance on your bank statement with the books on the same date. Match or record every statement line first; what is left over explains any difference.</p>
        <form className="fin-form-grid" onSubmit={record}>
          <div className="field">
            <label htmlFor="rec-date">Statement date</label>
            <input id="rec-date" className="input" type="date" required value={date} onChange={(e) => { setDate(e.target.value); setResult(null); }} />
          </div>
          <div className="field">
            <label htmlFor="rec-balance">{debt ? 'Owed on the statement' : 'Closing balance on the statement'}</label>
            <MoneyInput id="rec-balance" signed value={balance} onChange={(v) => { setBalance(v); setResult(null); }} />
          </div>
          <div className="field">
            <span className="hint">&nbsp;</span>
            {canRecord ? <button className="btn primary" type="submit" disabled={busy || balance === null || !date}>Record the reconciliation</button> : <span className="muted small">Someone who can approve transactions records reconciliations.</span>}
          </div>
        </form>
        {result ? (
          <div className={result.balanced ? 'card card-pad' : 'error-box'} role="status">
            {result.balanced ? <strong>Reconciled. The statement and the books agree.</strong> : <>{differenceText(result.difference)} <Money value={Math.abs(toNatural(result.difference))} strong />. Look at the lines still to match and the unreconciled entries below.</>}
          </div>
        ) : preview !== null && preview !== 0 ? (
          <p className="small">{differenceText(preview)} <Money value={Math.abs(toNatural(preview))} strong />.</p>
        ) : preview === 0 ? (
          <p className="small"><Icon name="check" size={13} /> The statement and the books agree.</p>
        ) : null}
      </section>

      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {s ? (
        <>
          <div className="crm-stats">
            <Stat label={`${debt ? 'Owed' : 'Balance'} in the books on ${shortDate(date)}`} value={<Money value={s.ledgerBalance} />} />
            <Stat label="Recorded, not yet reconciled" value={String(s.unreconciled.count)} hint={<>Net <Money value={s.unreconciled.total} /></>} />
            <Stat label="Statement lines to match" value={String(s.unmatchedLines.count)} hint={<>Net <Money value={s.unmatchedLines.total} /></>} to={`/o/${org.id}/banking/${account.id}?tab=lines`} tone={s.unmatchedLines.count ? 'danger' : undefined} />
          </div>
          {s.unreconciled.items.length ? (
            <section className="card">
              <h2 className="crm-group-head">Recorded, not yet reconciled</h2>
              <div className="crm-table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th className="fin-num">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.unreconciled.items.map((x) => (
                      <tr key={`${x.type}:${x.id}`}>
                        <td>{shortDate(x.date)}</td>
                        <td>{x.type === 'transaction' ? <Link to={`/o/${org.id}/transactions/${x.id}`}>{x.description || 'Transaction'}</Link> : x.description}</td>
                        <td className="fin-num"><Money value={x.amount} tone /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {s.unreconciled.count > s.unreconciled.items.length ? <p className="muted small crm-pad">The first {s.unreconciled.items.length} of {s.unreconciled.count} are shown.</p> : null}
            </section>
          ) : null}
          <section className="card">
            <h2 className="crm-group-head">Reconciliations</h2>
            {!s.history.length ? (
              <p className="muted small crm-pad">None recorded yet.</p>
            ) : (
              <div className="crm-table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Statement date</th>
                      <th className="fin-num">Statement</th>
                      <th className="fin-num">Books</th>
                      <th className="fin-num">Difference</th>
                      <th>By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.history.map((h) => (
                      <tr key={h.id}>
                        <td>{shortDate(h.statementDate)}</td>
                        <td className="fin-num"><Money value={toNatural(h.statementBalance)} /></td>
                        <td className="fin-num"><Money value={toNatural(h.ledgerBalance)} /></td>
                        <td className="fin-num">{h.difference ? <Money value={toNatural(h.difference)} tone /> : <span className="badge success">Agrees</span>}</td>
                        <td className="small">{h.by ?? ''} <span className="muted">{dateTime(h.at)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : q.error ? null : (
        <Loading />
      )}
    </div>
  );
}
