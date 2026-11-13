// Accounting: the chart of accounts (categories and money accounts), journals, tax codes, departments, projects and
// cost centres, categorisation rules, document numbering and the period lock. The server checks every permission and
// keeps the ledger balanced; these screens only show what the person may use.
import { Fragment, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post, put } from '../lib/api';
import { useDebounced } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { BAS_LABELS, BAS_ORDER, SIMPLER_BAS, type BasLabel } from '../../shared/fin/tax';
import { NUMBERED_KINDS, NUMBERED_LABELS, type NumberedKind } from '../../shared/fin/settings';
import { ACCOUNT_TYPES, type AccountType } from '../../shared/fin/charts';
import {
  ACCOUNT_TYPE_LABELS,
  SUBTYPES,
  accountLabel,
  fin,
  orderedAccounts,
  pct,
  shortDate,
  subtypeLabel,
  todayLocal,
  useAccounts,
  useContacts,
  useCurrentOrg,
  useRefresh,
  useTaxCodes,
  useTracking,
  type AccountDTO,
  type TaxCodeDTO,
  type TrackingDTO,
} from './lib';
import { AccountSelect, ContactSelect, Hint, Money, MoneyInput, TRACKING_LABELS, TabLinks, TaxCodeSelect, TrackingSelect, taxCodeName, useHasTracking, type TrackingKind } from './ui';

type Tab = 'chart' | 'journals' | 'tax-codes' | 'tracking' | 'rules' | 'numbering' | 'lock';

export function Accounting() {
  const org = useCurrentOrg();
  const { tab = 'chart' } = useParams();
  const business = org.kind === 'business';
  const p = org.perms.accounting;
  if (!p.view) {
    return (
      <div className="page crm-page">
        <PageHeader title="Accounting" icon="layers" />
        <EmptyState icon="lock" title="Your role does not include accounting">Ask the workspace owner or an administrator if you need to see the chart of accounts and journals.</EmptyState>
      </div>
    );
  }
  const base = `/o/${org.id}/accounting`;
  const tabs: { key: Tab; label: string; to: string; hidden?: boolean }[] = [
    { key: 'chart', label: business ? 'Chart of accounts' : 'Categories and accounts', to: `${base}/chart` },
    { key: 'journals', label: 'Journals', to: `${base}/journals` },
    { key: 'tax-codes', label: 'Tax codes', to: `${base}/tax-codes`, hidden: !business },
    { key: 'tracking', label: 'Departments and projects', to: `${base}/tracking` },
    { key: 'rules', label: 'Rules', to: `${base}/rules` },
    { key: 'numbering', label: 'Numbering', to: `${base}/numbering`, hidden: !business },
    { key: 'lock', label: 'Period lock', to: `${base}/lock` },
  ];
  const visible = tabs.filter((t) => !t.hidden);
  const current = (visible.find((t) => t.key === tab) ?? visible[0]).key;
  return (
    <div className="page crm-page">
      <PageHeader
        title="Accounting"
        icon="layers"
        subtitle={business ? `${org.name}: the chart of accounts, journals, GST codes and the period lock` : `${org.name}: your categories, accounts and the journals underneath them`}
      />
      <TabLinks tabs={visible} active={current} />
      {current === 'chart' ? <Chart /> : null}
      {current === 'journals' ? <Journals /> : null}
      {current === 'tax-codes' ? <TaxCodes /> : null}
      {current === 'tracking' ? <Tracking /> : null}
      {current === 'rules' ? <Rules /> : null}
      {current === 'numbering' ? <Numbering /> : null}
      {current === 'lock' ? <PeriodLock /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ chart of accounts

const SYSTEM_LABELS: Record<string, string> = {
  ar: 'Money customers owe (accounts receivable)',
  ap: 'Money owed to suppliers (accounts payable)',
  gst: 'GST collected and paid',
  claims: 'Expense claims owed to people',
  retained: 'Retained earnings',
  opening: 'Opening balances',
};

/** The next free code after `start` in the chart (numbers only), for a new account or sub-category. */
function suggestCode(accounts: AccountDTO[], start: string): string {
  if (!/^\d+$/.test(start)) return '';
  const used = new Set(accounts.map((a) => a.code));
  let n = Number(start) + 1;
  for (let i = 0; i < 500; i++, n++) {
    const code = String(n).padStart(start.length, '0');
    if (!used.has(code)) return code;
  }
  return '';
}

function Chart() {
  const org = useCurrentOrg();
  const q = useAccounts();
  const taxCodes = useTaxCodes().data;
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<{ account: AccountDTO | null; parent?: AccountDTO; type?: AccountType } | null>(null);
  const [opening, setOpening] = useState<AccountDTO | null>(null);
  const [filter, setFilter] = useState('');
  const can = org.perms.accounting.manage;
  const business = org.kind === 'business';
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const all = q.data;
  const needle = filter.trim().toLowerCase();
  const shown = all.filter((a) => (showArchived || !a.archived) && (!needle || `${a.code} ${a.name}`.toLowerCase().includes(needle)));
  const hasChildren = (a: AccountDTO) => all.some((x) => x.parentId === a.id);
  const archive = async (a: AccountDTO, archived: boolean) => {
    try {
      await post(fin(org.id, `/accounts/${a.id}/archive`), { archived });
      toast(archived ? `${a.name} archived` : `${a.name} restored`);
      await refresh('accounts');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const remove = async (a: AccountDTO) => {
    if (!(await confirm({ title: `Delete ${accountLabel(a)}?`, message: 'Only an account that has never been used can be deleted. Rules and budget amounts for it are deleted too.', confirmLabel: 'Delete', danger: true }))) return;
    try {
      await del(fin(org.id, `/accounts/${a.id}`));
      toast(`${a.name} deleted`);
      await refresh('accounts');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <Hint>
        {business
          ? 'Every category is an account in a double-entry ledger: each transaction debits one account and credits another by the same amount. System accounts are marked: the books need them, so they cannot be archived or deleted.'
          : 'Categories (income and spending) and accounts (bank, cards, loans) sit in a double-entry ledger underneath, so balances always add up. Rename, add sub-categories, or archive what you do not use.'}
      </Hint>
      <div className="row fin-toolbar">
        <input className="input" type="search" placeholder="Find an account" aria-label="Find an account" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <label className="checkbox small">
          <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived
        </label>
        <span className="grow" />
        {can ? (
          <button className="btn primary" onClick={() => setEditing({ account: null })}>
            <Icon name="plus" /> {business ? 'Add account' : 'Add category or account'}
          </button>
        ) : null}
      </div>
      {ACCOUNT_TYPES.map((type) => {
        const list = orderedAccounts(shown.filter((a) => a.type === type));
        if (!list.length) return null;
        return (
          <section key={type} className="card">
            <div className="row crm-pad">
              <h2 className="crm-subhead grow">{ACCOUNT_TYPE_LABELS[type]}</h2>
              {can ? (
                <button className="btn ghost sm" onClick={() => setEditing({ account: null, type })}>
                  <Icon name="plus" size={14} /> Add
                </button>
              ) : null}
            </div>
            <div className="crm-table-scroll">
              <table className="data-table crm-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Kind</th>
                    {org.gst ? <th>Default GST</th> : null}
                    <th className="fin-num">Balance</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {list.map((a) => {
                    const child = !!a.parentId && all.some((x) => x.id === a.parentId);
                    return (
                      <tr key={a.id}>
                        <td className="mono">{a.code}</td>
                        <td>
                          <div className={`row${child ? ' fin-child' : ''}`}>
                            {child ? <Icon name="subitem" size={14} /> : null}
                            <span className={a.archived ? 'muted' : 'crm-primary'}>{a.name}</span>
                            {a.systemKey ? <span className="badge accent" title={SYSTEM_LABELS[a.systemKey] ?? 'Needed by the books'}>System</span> : null}
                            {a.isDefault ? <span className="badge">Default</span> : null}
                            {a.archived ? <span className="badge">Archived</span> : null}
                          </div>
                          {a.description || a.bankName ? <div className="muted small">{[a.bankName, a.bankNumber, a.description].filter(Boolean).join(' · ')}</div> : null}
                        </td>
                        <td className="small">{subtypeLabel(a.subtype)}</td>
                        {org.gst ? <td className="small">{taxCodeName(taxCodes, a.taxCodeId)}</td> : null}
                        <td className="fin-num">{a.balance === undefined ? '' : <Money value={a.balance} />}</td>
                        <td>
                          {can ? (
                            <div className="row">
                              <button className="btn ghost sm" onClick={() => setEditing({ account: a })}>Edit</button>
                              {!a.parentId && !a.money && !a.systemKey && (a.type === 'revenue' || a.type === 'expense') && !a.archived ? (
                                <button className="btn ghost sm" onClick={() => setEditing({ account: null, parent: a })}>Add sub-category</button>
                              ) : null}
                              {(a.type === 'asset' || a.type === 'liability' || a.type === 'equity') && !a.archived && !a.systemKey ? (
                                <button className="btn ghost sm" onClick={() => setOpening(a)}>Opening balance</button>
                              ) : null}
                              {!a.systemKey ? (
                                <button className="btn ghost sm" onClick={() => archive(a, !a.archived)}>{a.archived ? 'Restore' : 'Archive'}</button>
                              ) : null}
                              {!a.systemKey && !hasChildren(a) ? (
                                <button className="btn ghost sm" aria-label={`Delete ${a.name}`} onClick={() => remove(a)}>
                                  <Icon name="trash" size={14} />
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
      {!shown.length ? <EmptyState icon="layers" title="No accounts match" /> : null}
      {editing ? <AccountDialog account={editing.account} parent={editing.parent} type={editing.type} accounts={all} onClose={() => setEditing(null)} /> : null}
      {opening ? <OpeningDialog account={opening} onClose={() => setOpening(null)} /> : null}
    </div>
  );
}

function AccountDialog({ account, parent, type, accounts, onClose }: { account: AccountDTO | null; parent?: AccountDTO; type?: AccountType; accounts: AccountDTO[]; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const firstSubtype = (t: AccountType) => Object.keys(SUBTYPES).find((k) => SUBTYPES[k].type === t) ?? 'expense';
  const initialSubtype = account?.subtype ?? parent?.subtype ?? (type ? firstSubtype(type) : 'expense');
  const [f, setF] = useState({
    code: account?.code ?? (parent ? suggestCode(accounts, parent.code) : ''),
    name: account?.name ?? '',
    subtype: initialSubtype,
    parentId: account?.parentId ?? parent?.id ?? null,
    description: account?.description ?? '',
    taxCodeId: account?.taxCodeId ?? parent?.taxCodeId ?? null,
    bankName: account?.bankName ?? '',
    bankNumber: account?.bankNumber ?? '',
    isDefault: account?.isDefault ?? false,
  });
  const [openingBalance, setOpeningBalance] = useState<number | null>(null);
  const [openingDate, setOpeningDate] = useState(todayLocal());
  const [busy, setBusy] = useState(false);
  const def = SUBTYPES[f.subtype];
  const accType = def?.type ?? 'expense';
  const system = !!account?.systemKey;
  const hasKids = !!account && accounts.some((x) => x.parentId === account.id);
  const parents = orderedAccounts(accounts.filter((a) => a.type === accType && !a.parentId && !a.archived && a.id !== account?.id && !a.money && !a.systemKey));
  const subtypesByType = ACCOUNT_TYPES.map((t) => ({ t, keys: Object.keys(SUBTYPES).filter((k) => SUBTYPES[k].type === t) }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        code: f.code.trim(),
        name: f.name.trim(),
        parentId: f.parentId,
        description: f.description,
        bankName: def?.money ? f.bankName : '',
        bankNumber: def?.money ? f.bankNumber : '',
        isDefault: f.isDefault,
      };
      if (!system) body.subtype = f.subtype;
      if (org.gst) body.taxCodeId = f.taxCodeId;
      if (account) {
        await patch(fin(org.id, `/accounts/${account.id}`), body);
        toast('Saved');
      } else {
        body.subtype = f.subtype;
        if (openingBalance && accType !== 'revenue' && accType !== 'expense') Object.assign(body, { openingBalance, openingDate });
        await post(fin(org.id, '/accounts'), body);
        toast(`${f.name.trim()} added`);
      }
      await refresh();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const title = account ? `Edit ${accountLabel(account)}` : parent ? `New sub-category of ${parent.name}` : 'New account';
  return (
    <Modal
      title={title}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="fin-account-form" disabled={busy || !f.code.trim() || !f.name.trim()}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </>
      }
    >
      <form id="fin-account-form" className="stack" onSubmit={save}>
        {system ? <div className="info-box">This is a system account ({SYSTEM_LABELS[account!.systemKey!] ?? 'needed by the books'}). You can rename it and change its code; its kind stays as it is.</div> : null}
        <div className="fin-form-grid">
          <div className="field">
            <label htmlFor="acc-code">Code</label>
            <input id="acc-code" className="input mono" required maxLength={12} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.replace(/[^A-Za-z0-9.-]/g, '') })} />
            <span className="hint">Letters, digits, dots and dashes. Each code is used once.</span>
          </div>
          <div className="field">
            <label htmlFor="acc-name">Name</label>
            <input id="acc-name" className="input" required maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="acc-subtype">Kind</label>
            <select id="acc-subtype" className="select" value={f.subtype} disabled={system || !!parent} onChange={(e) => setF({ ...f, subtype: e.target.value, parentId: SUBTYPES[e.target.value].type === accType ? f.parentId : null })}>
              {subtypesByType.map(({ t, keys }) => (
                <optgroup key={t} label={ACCOUNT_TYPE_LABELS[t]}>
                  {keys.map((k) => (
                    <option key={k} value={k}>{SUBTYPES[k].label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="hint">{ACCOUNT_TYPE_LABELS[accType]}{def?.money ? ': a money account you record transactions on' : ''}</span>
          </div>
          {!def?.money && !system && !hasKids ? (
            <div className="field">
              <label htmlFor="acc-parent">Sub-category of</label>
              <select id="acc-parent" className="select" value={f.parentId ?? ''} onChange={(e) => setF({ ...f, parentId: e.target.value || null })}>
                <option value="">None (a main {accType === 'revenue' || accType === 'expense' ? 'category' : 'account'})</option>
                {parents.map((a) => (
                  <option key={a.id} value={a.id}>{accountLabel(a)}</option>
                ))}
              </select>
              <span className="hint">One level deep, within the same type.</span>
            </div>
          ) : null}
          {org.gst && (accType === 'revenue' || accType === 'expense' || accType === 'asset') && !def?.money ? (
            <div className="field">
              <label htmlFor="acc-tax">Default GST code</label>
              <TaxCodeSelect id="acc-tax" value={f.taxCodeId} onChange={(v) => setF({ ...f, taxCodeId: v })} direction={accType === 'revenue' ? 'sales' : 'purchases'} />
              <span className="hint">Suggested on new lines; can be changed on each line.</span>
            </div>
          ) : null}
          {def?.money ? (
            <>
              <div className="field">
                <label htmlFor="acc-bank">Bank or card issuer</label>
                <input id="acc-bank" className="input" maxLength={120} value={f.bankName} onChange={(e) => setF({ ...f, bankName: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="acc-number">Account number (last digits)</label>
                <input id="acc-number" className="input" maxLength={40} value={f.bankNumber} onChange={(e) => setF({ ...f, bankNumber: e.target.value })} />
                <span className="hint">For your reference. BIZOMAT never asks for banking passwords.</span>
              </div>
            </>
          ) : null}
          <div className="field crm-span">
            <label htmlFor="acc-desc">Description</label>
            <input id="acc-desc" className="input" maxLength={500} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </div>
          {!account && accType !== 'revenue' && accType !== 'expense' ? (
            <>
              <div className="field">
                <label htmlFor="acc-opening">Opening balance (optional)</label>
                <MoneyInput id="acc-opening" signed value={openingBalance} onChange={setOpeningBalance} />
                <span className="hint">{accType === 'asset' ? 'What the account holds.' : 'What is owed.'} Posted against Opening balances.</span>
              </div>
              <div className="field">
                <label htmlFor="acc-opening-date">As at</label>
                <input id="acc-opening-date" className="input" type="date" value={openingDate} onChange={(e) => setOpeningDate(e.target.value)} />
              </div>
            </>
          ) : null}
          <label className="checkbox crm-span">
            <input type="checkbox" checked={f.isDefault} onChange={(e) => setF({ ...f, isDefault: e.target.checked })} /> The default {ACCOUNT_TYPE_LABELS[accType].toLowerCase()} account (chosen first on new records)
          </label>
        </div>
      </form>
    </Modal>
  );
}

function OpeningDialog({ account, onClose }: { account: AccountDTO; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState(todayLocal());
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await post(fin(org.id, `/accounts/${account.id}/opening-balance`), { amount, date });
      toast('Opening balance posted');
      await refresh();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={`Opening balance: ${accountLabel(account)}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy || !amount || !date} onClick={save}>{busy ? 'Posting…' : 'Post opening balance'}</button>
        </>
      }
    >
      <div className="stack">
        <p className="muted small">
          The amount is posted as its own journal, against the Opening balances account. {account.type === 'asset' ? 'Enter what the account held on the date.' : 'Enter what was owed on the date.'} To change it later, reverse that journal in Journals and post a new one.
        </p>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="ob-amount">Amount</label>
            <MoneyInput id="ob-amount" signed value={amount} onChange={setAmount} />
          </div>
          <div className="field">
            <label htmlFor="ob-date">As at</label>
            <input id="ob-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            {org.lockDate ? <span className="hint">Periods up to {shortDate(org.lockDate)} are locked.</span> : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ journals

interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  taxCodeId: string | null;
  taxAmount: number;
  contactId: string | null;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
  personId: string | null;
}

interface JournalDTO {
  id: string;
  number: number;
  date: string;
  sourceType: string;
  sourceId: string | null;
  memo: string;
  reversesId: string | null;
  reversedById: string | null;
  createdBy: string | null;
  postedAt: number | null;
  lines: JournalLine[];
}

const SOURCE_LABELS: Record<string, string> = {
  manual: 'Manual journal',
  transaction: 'Transaction',
  invoice: 'Invoice',
  credit_note: 'Credit note',
  credit_refund: 'Credit refund',
  bill: 'Bill',
  expense_claim: 'Expense claim',
  payment: 'Payment',
  opening: 'Opening balance',
  reversal: 'Reversal',
};

const SOURCE_PATHS: Record<string, string> = { transaction: 'transactions', invoice: 'invoices', credit_note: 'credit-notes', credit_refund: 'credit-notes', bill: 'bills', expense_claim: 'expense-claims' };

function Journals() {
  const org = useCurrentOrg();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [type, setType] = useState('');
  const [text, setText] = useState('');
  const search = useDebounced(text, 200).trim().toLowerCase();
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [reversing, setReversing] = useState<JournalDTO | null>(null);
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  if (type) qs.set('type', type);
  const q = useQuery({ queryKey: ['fin', org.id, 'journals', qs.toString()], queryFn: () => get<JournalDTO[]>(`${fin(org.id, '/journals')}?${qs.toString()}`) });
  const can = org.perms.accounting.journal;
  const list = useMemo(() => {
    const rows = [...(q.data ?? [])].reverse();
    if (!search) return rows;
    return rows.filter((j) => `${j.number} ${j.memo} ${j.lines.map((l) => `${l.accountCode} ${l.accountName} ${l.description}`).join(' ')}`.toLowerCase().includes(search));
  }, [q.data, search]);
  return (
    <div className="stack">
      <Hint>Every posted entry is a journal whose debits equal its credits. Posted journals never change: a correction is a reversing journal, dated in an open period. Records (transactions, invoices, bills, payments) are corrected from the record itself.</Hint>
      <div className="row fin-toolbar">
        <label className="row small">From <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From" /></label>
        <label className="row small">To <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To" /></label>
        <select className="select" aria-label="Kind of journal" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Every kind</option>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <input className="input" type="search" placeholder="Search memo, account or number" aria-label="Search journals" value={text} onChange={(e) => setText(e.target.value)} />
        <span className="grow" />
        {can ? (
          <button className="btn primary" onClick={() => setCreating(true)}>
            <Icon name="plus" /> New journal
          </button>
        ) : null}
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data ? (
        <Loading />
      ) : !list.length ? (
        <EmptyState icon="list" title="No journals">{from || to || type || search ? 'Nothing matches these filters.' : 'Journals appear as transactions, invoices and bills are posted.'}</EmptyState>
      ) : (
        <div className="card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>No.</th>
                  <th>Memo</th>
                  <th>Kind</th>
                  <th className="fin-num">Amount</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {list.map((j) => {
                  const total = j.lines.reduce((n, l) => n + l.debit, 0);
                  const expanded = open === j.id;
                  const reversible = can && (j.sourceType === 'manual' || j.sourceType === 'opening') && !j.reversedById;
                  return (
                    <JournalRows key={j.id} j={j} total={total} expanded={expanded} onToggle={() => setOpen(expanded ? null : j.id)} onReverse={reversible ? () => setReversing(j) : undefined} />
                  );
                })}
              </tbody>
            </table>
          </div>
          {q.data.length >= 200 ? <p className="muted small crm-pad">Showing the latest 200 journals. Narrow the dates to see earlier ones.</p> : null}
        </div>
      )}
      {creating ? <JournalEditor onClose={() => setCreating(false)} /> : null}
      {reversing ? <ReverseDialog journal={reversing} onClose={() => setReversing(null)} /> : null}
    </div>
  );
}

function JournalRows({ j, total, expanded, onToggle, onReverse }: { j: JournalDTO; total: number; expanded: boolean; onToggle: () => void; onReverse?: () => void }) {
  const org = useCurrentOrg();
  const codes = useTaxCodes().data;
  const path = j.sourceId ? SOURCE_PATHS[j.sourceType] : undefined;
  return (
    <>
      <tr>
        <td className="small">{shortDate(j.date)}</td>
        <td className="mono">{j.number}</td>
        <td>
          <button className="btn ghost sm" aria-expanded={expanded} onClick={onToggle}>
            <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={14} /> {j.memo || SOURCE_LABELS[j.sourceType]}
          </button>
          {j.reversedById ? <span className="badge">Reversed</span> : null}
          {j.reversesId ? <span className="badge warning">Reversal</span> : null}
        </td>
        <td className="small">
          {path ? <Link to={`/o/${org.id}/${path}/${j.sourceId}`}>{SOURCE_LABELS[j.sourceType]}</Link> : SOURCE_LABELS[j.sourceType] ?? j.sourceType}
        </td>
        <td className="fin-num"><Money value={total} /></td>
        <td>{onReverse ? <button className="btn ghost sm" onClick={onReverse}>Reverse</button> : null}</td>
      </tr>
      {expanded ? (
        <tr>
          <td colSpan={6}>
            <table className="fin-lines">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Description</th>
                  {org.gst ? <th>GST</th> : null}
                  <th className="fin-num">Debit</th>
                  <th className="fin-num">Credit</th>
                </tr>
              </thead>
              <tbody>
                {j.lines.map((l, i) => (
                  <tr key={i}>
                    <td>{accountLabel({ code: l.accountCode, name: l.accountName })}</td>
                    <td className="small">{l.description}</td>
                    {org.gst ? (
                      <td className="small">
                        {taxCodeName(codes, l.taxCodeId)} {l.taxAmount ? <Money value={Math.abs(l.taxAmount)} /> : null}
                      </td>
                    ) : null}
                    <td className="fin-num">{l.debit ? <Money value={l.debit} /> : ''}</td>
                    <td className="fin-num">{l.credit ? <Money value={l.credit} /> : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted small">{j.createdBy ? `Posted by ${j.createdBy}.` : ''}</p>
          </td>
        </tr>
      ) : null}
    </>
  );
}

interface DraftLine {
  key: number;
  accountId: string | null;
  description: string;
  debit: number | null;
  credit: number | null;
  taxCodeId: string | null;
  taxAmount: number | null;
  contactId: string | null;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
}

let lineKey = 1;
const emptyLine = (): DraftLine => ({ key: lineKey++, accountId: null, description: '', debit: null, credit: null, taxCodeId: null, taxAmount: null, contactId: null, departmentId: null, projectId: null, costCentreId: null });

function JournalEditor({ onClose }: { onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const tracking = useHasTracking();
  const business = org.kind === 'business';
  const [date, setDate] = useState(todayLocal());
  const [memo, setMemo] = useState('');
  const [lines, setLines] = useState<DraftLine[]>([emptyLine(), emptyLine()]);
  const [busy, setBusy] = useState(false);
  const debits = lines.reduce((n, l) => n + (l.debit ?? 0), 0);
  const credits = lines.reduce((n, l) => n + (l.credit ?? 0), 0);
  const difference = debits - credits;
  const used = lines.filter((l) => l.accountId || l.debit || l.credit);
  const problems: string[] = [];
  if (used.length < 2) problems.push('Add at least two lines.');
  if (used.some((l) => !l.accountId)) problems.push('Choose an account on every line.');
  if (used.some((l) => (l.debit ?? 0) > 0 && (l.credit ?? 0) > 0)) problems.push('A line is a debit or a credit, not both.');
  if (used.some((l) => !(l.debit ?? 0) && !(l.credit ?? 0))) problems.push('Enter an amount on every line.');
  if (difference !== 0) problems.push('Debits and credits must be equal.');
  if (!memo.trim()) problems.push('Describe the journal.');
  const set = (key: number, change: Partial<DraftLine>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...change } : l)));
  const save = async () => {
    setBusy(true);
    try {
      await post(fin(org.id, '/journals'), {
        date,
        memo: memo.trim(),
        lines: used.map((l) => ({
          accountId: l.accountId,
          debit: l.debit ?? 0,
          credit: l.credit ?? 0,
          description: l.description || undefined,
          taxCodeId: org.gst ? l.taxCodeId : null,
          taxAmount: org.gst && l.taxCodeId && l.taxAmount ? l.taxAmount : undefined,
          contactId: l.contactId,
          departmentId: l.departmentId,
          projectId: l.projectId,
          costCentreId: l.costCentreId,
        })),
      });
      toast('Journal posted');
      await refresh();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="New manual journal"
      onClose={onClose}
      xl
      footer={
        <>
          <span className={`grow small ${difference ? 'warning-text' : 'muted'}`}>{problems[0] ?? 'Balanced and ready to post.'}</span>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy || problems.length > 0} onClick={save}>{busy ? 'Posting…' : 'Post journal'}</button>
        </>
      }
    >
      <div className="stack">
        <Hint>Use a manual journal for entries that are not a transaction, invoice or bill: depreciation, accruals, corrections between accounts. Once posted it cannot be changed, only reversed.</Hint>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="j-date">Date</label>
            <input id="j-date" className="input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            {org.lockDate ? <span className="hint">Periods up to {shortDate(org.lockDate)} are locked.</span> : null}
          </div>
          <div className="field">
            <label htmlFor="j-memo">Memo</label>
            <input id="j-memo" className="input" maxLength={500} required value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="For example: Depreciation for October" />
          </div>
        </div>
        <div className="crm-table-scroll">
          <table className="fin-lines">
            <thead>
              <tr>
                <th>Account</th>
                <th>Description</th>
                {org.gst ? <th>GST code</th> : null}
                {org.gst ? <th>GST included</th> : null}
                {business ? <th>Contact</th> : null}
                {tracking.department ? <th>{TRACKING_LABELS.department}</th> : null}
                {tracking.project ? <th>{TRACKING_LABELS.project}</th> : null}
                {tracking.cost_centre ? <th>{TRACKING_LABELS.cost_centre}</th> : null}
                <th className="fin-num">Debit</th>
                <th className="fin-num">Credit</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.key}>
                  <td><AccountSelect kind="posting" ariaLabel={`Account, line ${i + 1}`} value={l.accountId} onChange={(v) => set(l.key, { accountId: v })} /></td>
                  <td><input className="input" aria-label={`Description, line ${i + 1}`} maxLength={500} value={l.description} onChange={(e) => set(l.key, { description: e.target.value })} /></td>
                  {org.gst ? <td><TaxCodeSelect ariaLabel={`GST code, line ${i + 1}`} value={l.taxCodeId} onChange={(v) => set(l.key, { taxCodeId: v })} /></td> : null}
                  {org.gst ? <td><MoneyInput ariaLabel={`GST included, line ${i + 1}`} value={l.taxAmount} onChange={(v) => set(l.key, { taxAmount: v })} disabled={!l.taxCodeId} /></td> : null}
                  {business ? <td><ContactSelect ariaLabel={`Contact, line ${i + 1}`} value={l.contactId} onChange={(v) => set(l.key, { contactId: v })} /></td> : null}
                  {tracking.department ? <td><TrackingSelect kind="department" value={l.departmentId} onChange={(v) => set(l.key, { departmentId: v })} /></td> : null}
                  {tracking.project ? <td><TrackingSelect kind="project" value={l.projectId} onChange={(v) => set(l.key, { projectId: v })} /></td> : null}
                  {tracking.cost_centre ? <td><TrackingSelect kind="cost_centre" value={l.costCentreId} onChange={(v) => set(l.key, { costCentreId: v })} /></td> : null}
                  <td><MoneyInput ariaLabel={`Debit, line ${i + 1}`} value={l.debit} onChange={(v) => set(l.key, { debit: v, credit: v ? null : l.credit })} /></td>
                  <td><MoneyInput ariaLabel={`Credit, line ${i + 1}`} value={l.credit} onChange={(v) => set(l.key, { credit: v, debit: v ? null : l.debit })} /></td>
                  <td className="fin-line-actions">
                    {lines.length > 2 ? (
                      <button className="btn ghost icon sm" aria-label={`Remove line ${i + 1}`} onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}>
                        <Icon name="x" size={14} />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row wrap">
          <button className="btn sm" onClick={() => setLines((ls) => [...ls, emptyLine()])}><Icon name="plus" size={14} /> Add a line</button>
          <div className="fin-totals">
            <span>Total debits</span>
            <Money value={debits} />
            <span>Total credits</span>
            <Money value={credits} />
            <span className="total">Difference</span>
            <span className="total"><Money value={difference} tone /></span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ReverseDialog({ journal, onClose }: { journal: JournalDTO; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const locked = !!org.lockDate && journal.date <= org.lockDate;
  const [date, setDate] = useState(locked ? todayLocal() : journal.date);
  const [memo, setMemo] = useState(`Reversal of journal ${journal.number}`);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      const r = await post<{ date: string }>(fin(org.id, `/journals/${journal.id}/reverse`), { date, memo });
      toast(`Reversed on ${shortDate(r.date)}`);
      await refresh();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={`Reverse journal ${journal.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn danger" disabled={busy || !date} onClick={save}>{busy ? 'Reversing…' : 'Post the reversal'}</button>
        </>
      }
    >
      <div className="stack">
        <p>A reversing journal swaps every debit and credit of "{journal.memo}", so its effect is undone. The original stays in the books.</p>
        {locked ? <div className="info-box">The original date is in a locked period (up to {shortDate(org.lockDate)}), so the reversal needs a later date.</div> : null}
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="rev-date">Date of the reversal</label>
            <input id="rev-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="rev-memo">Memo</label>
            <input id="rev-memo" className="input" maxLength={500} value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ tax codes

const DIRECTION_LABELS = { sales: 'Sales', purchases: 'Purchases', both: 'Sales and purchases' } as const;

function TaxCodes() {
  const org = useCurrentOrg();
  const q = useTaxCodes();
  const toast = useToast();
  const refresh = useRefresh();
  const [editing, setEditing] = useState<TaxCodeDTO | 'new' | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const can = org.perms.accounting.manage;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const list = q.data.filter((t) => showArchived || !t.archived);
  const archive = async (t: TaxCodeDTO, archived: boolean) => {
    try {
      await patch(fin(org.id, `/tax-codes/${t.id}`), { archived });
      await refresh('tax-codes', 'accounts');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <Hint>
        These codes follow the ATO's common GST treatments: GST at 10% on sales and purchases, GST-free sales and exports, input-taxed sales, capital purchases and purchases without GST. Each counts toward BAS labels
        {org.basMethod === 'simpler' ? ' (Simpler BAS reports G1, 1A and 1B)' : ''}. The GST report is a worksheet to help you prepare a BAS: check it before you lodge. BIZOMAT does not lodge with the ATO.
      </Hint>
      {!org.gstRegistered ? <div className="info-box">This business is not registered for GST, so lines carry no GST. Turn on GST registration in Settings, Workspace, when you register.</div> : null}
      <div className="row fin-toolbar">
        <label className="checkbox small"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived</label>
        <span className="grow" />
        {can ? <button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" /> Add tax code</button> : null}
      </div>
      <div className="card">
        <div className="crm-table-scroll">
          <table className="data-table crm-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th className="fin-num">Rate</th>
                <th>Used on</th>
                <th>BAS labels</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.code}</td>
                  <td>
                    <span className={t.archived ? 'muted' : ''}>{t.name}</span> {t.archived ? <span className="badge">Archived</span> : null}
                  </td>
                  <td className="fin-num">{pct(t.rateBp)}</td>
                  <td className="small">{DIRECTION_LABELS[t.direction]}</td>
                  <td className="small">
                    {t.bas.length ? t.bas.map((b) => <span key={b} className="badge" title={BAS_LABELS[b as BasLabel]}>{b}</span>) : <span className="muted">Not reported</span>}
                  </td>
                  <td>
                    {can ? (
                      <div className="row">
                        <button className="btn ghost sm" onClick={() => setEditing(t)}>Edit</button>
                        <button className="btn ghost sm" onClick={() => archive(t, !t.archived)}>{t.archived ? 'Restore' : 'Archive'}</button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!list.length ? <EmptyState icon="dollar" title="No tax codes" /> : null}
      </div>
      <section className="card card-pad">
        <h2 className="crm-subhead">BAS labels</h2>
        <dl className="fin-detail small">
          {BAS_ORDER.map((b) => (
            <Fragment key={b}>
              <dt>{b}</dt>
              <dd>{BAS_LABELS[b]}{SIMPLER_BAS.includes(b) ? '' : ' (full reporting only)'}</dd>
            </Fragment>
          ))}
        </dl>
      </section>
      {editing ? <TaxCodeDialog code={editing === 'new' ? null : editing} onClose={() => setEditing(null)} /> : null}
    </div>
  );
}

function TaxCodeDialog({ code, onClose }: { code: TaxCodeDTO | null; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const [f, setF] = useState({ code: code?.code ?? '', name: code?.name ?? '', rate: code ? String(code.rateBp / 100) : '10', direction: code?.direction ?? ('sales' as TaxCodeDTO['direction']), bas: (code?.bas ?? []) as string[] });
  const [busy, setBusy] = useState(false);
  const rateBp = Math.round(Number(f.rate) * 100);
  const validRate = f.rate.trim() !== '' && Number.isFinite(rateBp) && rateBp >= 0 && rateBp <= 10_000;
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { code: f.code.trim(), name: f.name.trim(), rateBp, direction: f.direction, bas: BAS_ORDER.filter((b) => f.bas.includes(b)) };
      if (code) await patch(fin(org.id, `/tax-codes/${code.id}`), body);
      else await post(fin(org.id, '/tax-codes'), body);
      toast('Saved');
      await refresh('tax-codes', 'accounts');
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={code ? `Edit ${code.code}` : 'New tax code'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" type="submit" form="fin-tax-form" disabled={busy || !f.code.trim() || !f.name.trim() || !validRate}>{busy ? 'Saving…' : 'Save'}</button>
        </>
      }
    >
      <form id="fin-tax-form" className="stack" onSubmit={save}>
        {code?.systemKey ? <div className="info-box">A standard code. Changing its rate or labels changes how new lines are calculated and reported; lines already posted keep their amounts.</div> : null}
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="tc-code">Code</label><input id="tc-code" className="input mono" required maxLength={12} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.replace(/[^A-Za-z0-9_-]/g, '').toUpperCase() })} /></div>
          <div className="field"><label htmlFor="tc-name">Name</label><input id="tc-name" className="input" required maxLength={80} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="field"><label htmlFor="tc-rate">Rate (%)</label><input id="tc-rate" className="input" inputMode="decimal" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value.replace(/[^0-9.]/g, '') })} aria-invalid={!validRate || undefined} /></div>
          <div className="field">
            <label htmlFor="tc-dir">Used on</label>
            <select id="tc-dir" className="select" value={f.direction} onChange={(e) => setF({ ...f, direction: e.target.value as TaxCodeDTO['direction'] })}>
              {(Object.keys(DIRECTION_LABELS) as (keyof typeof DIRECTION_LABELS)[]).map((d) => <option key={d} value={d}>{DIRECTION_LABELS[d]}</option>)}
            </select>
          </div>
        </div>
        <fieldset className="crm-fieldset">
          <legend>Counts toward these BAS labels</legend>
          {BAS_ORDER.map((b) => (
            <label key={b} className="checkbox small">
              <input type="checkbox" checked={f.bas.includes(b)} onChange={(e) => setF({ ...f, bas: e.target.checked ? [...f.bas, b] : f.bas.filter((x) => x !== b) })} /> {b}: {BAS_LABELS[b]}
            </label>
          ))}
        </fieldset>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ departments, projects and cost centres

function Tracking() {
  const org = useCurrentOrg();
  const q = useTracking();
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<TrackingDTO | null>(null);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <Hint>Tag lines with a department, project or cost centre, then filter reports and budgets by them. Each line can carry one of each.</Hint>
      <label className="checkbox small"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived</label>
      {(Object.keys(TRACKING_LABELS) as TrackingKind[]).map((kind) => (
        <TrackingSection key={kind} kind={kind} items={q.data.filter((t) => t.kind === kind && (showArchived || !t.archived))} can={org.perms.accounting.manage} onEdit={setEditing} />
      ))}
      {editing ? <TrackingDialog item={editing} onClose={() => setEditing(null)} /> : null}
    </div>
  );
}

function TrackingSection({ kind, items, can, onEdit }: { kind: TrackingKind; items: TrackingDTO[]; can: boolean; onEdit: (t: TrackingDTO) => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const plural = { department: 'Departments', project: 'Projects', cost_centre: 'Cost centres' }[kind];
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post(fin(org.id, '/tracking'), { kind, name: name.trim(), code: code.trim() || undefined });
      setName('');
      setCode('');
      await refresh('tracking');
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const archive = async (t: TrackingDTO) => {
    try {
      await patch(fin(org.id, `/tracking/${t.id}`), { archived: !t.archived });
      await refresh('tracking');
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">{plural}</h2>
      {items.length ? (
        <ul className="crm-mini-list">
          {items.map((t) => (
            <li key={t.id} className="row">
              <span className="grow">
                {t.code ? <span className="mono">{t.code} </span> : null}
                <span className={t.archived ? 'muted' : ''}>{t.name}</span> {t.archived ? <span className="badge">Archived</span> : null}
              </span>
              {can ? (
                <>
                  <button className="btn ghost sm" onClick={() => onEdit(t)}>Edit</button>
                  <button className="btn ghost sm" onClick={() => archive(t)}>{t.archived ? 'Restore' : 'Archive'}</button>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">None yet.</p>
      )}
      {can ? (
        <form className="row wrap" onSubmit={add}>
          <input className="input" aria-label={`New ${TRACKING_LABELS[kind].toLowerCase()} name`} placeholder={`New ${TRACKING_LABELS[kind].toLowerCase()}`} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input mono" aria-label="Code (optional)" placeholder="Code (optional)" maxLength={20} value={code} onChange={(e) => setCode(e.target.value)} />
          <button className="btn" type="submit" disabled={!name.trim()}><Icon name="plus" size={14} /> Add</button>
        </form>
      ) : null}
    </section>
  );
}

function TrackingDialog({ item, onClose }: { item: TrackingDTO; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const [name, setName] = useState(item.name);
  const [code, setCode] = useState(item.code);
  const save = async () => {
    try {
      await patch(fin(org.id, `/tracking/${item.id}`), { name: name.trim(), code: code.trim() });
      await refresh('tracking');
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Modal title={`Edit ${TRACKING_LABELS[item.kind].toLowerCase()}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!name.trim()} onClick={save}>Save</button></>}>
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="tr-name">Name</label><input id="tr-name" className="input" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label htmlFor="tr-code">Code</label><input id="tr-code" className="input mono" maxLength={20} value={code} onChange={(e) => setCode(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ categorisation rules

interface RuleDTO {
  id: string;
  matchText: string;
  direction: 'in' | 'out' | 'any';
  accountId: string;
  taxCodeId: string | null;
  contactId: string | null;
  position: number;
}

const RULE_DIRECTIONS = { any: 'Money in or out', in: 'Money in', out: 'Money out' } as const;

function Rules() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const accounts = useAccounts().data ?? [];
  const contacts = useContacts(org.kind === 'business').data ?? [];
  const codes = useTaxCodes().data;
  const q = useQuery({ queryKey: ['fin', org.id, 'rules'], queryFn: () => get<RuleDTO[]>(fin(org.id, '/rules')) });
  const [editing, setEditing] = useState<RuleDTO | 'new' | null>(null);
  const can = org.perms.banking.approve || org.perms.accounting.manage;
  const reload = () => qc.invalidateQueries({ queryKey: ['fin', org.id, 'rules'] });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const list = q.data;
  const move = async (i: number, by: -1 | 1) => {
    const order = [...list];
    const j = i + by;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    try {
      for (let k = 0; k < order.length; k++) {
        const position = (k + 1) * 10;
        if (order[k].position !== position) await patch(fin(org.id, `/rules/${order[k].id}`), { position });
      }
      await reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const remove = async (r: RuleDTO) => {
    if (!(await confirm({ title: `Delete the rule for "${r.matchText}"?`, confirmLabel: 'Delete', danger: true }))) return;
    try {
      await del(fin(org.id, `/rules/${r.id}`));
      await reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const account = (id: string) => accounts.find((a) => a.id === id);
  return (
    <div className="stack">
      <Hint>When a bank statement line or a new transaction mentions the text of a rule, its category is suggested (the first matching rule comes first). Suggestions are checked by you before anything is posted. Ticking "Remember" when you categorise a statement line adds a rule here.</Hint>
      {can ? <div><button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" /> Add rule</button></div> : null}
      {!list.length ? (
        <EmptyState icon="bolt" title="No rules yet">Add one, for example: text contains "woolworths", category Groceries.</EmptyState>
      ) : (
        <div className="card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Text contains</th>
                  <th>Applies to</th>
                  <th>Category</th>
                  {org.gst ? <th>GST</th> : null}
                  {org.kind === 'business' ? <th>Contact</th> : null}
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {list.map((r, i) => (
                  <tr key={r.id}>
                    <td>
                      {can ? (
                        <div className="row">
                          <span className="small">{i + 1}</span>
                          <button className="btn ghost sm" aria-label={`Move the rule for ${r.matchText} up`} disabled={i === 0} onClick={() => move(i, -1)}>Up</button>
                          <button className="btn ghost sm" aria-label={`Move the rule for ${r.matchText} down`} disabled={i === list.length - 1} onClick={() => move(i, 1)}>Down</button>
                        </div>
                      ) : (
                        i + 1
                      )}
                    </td>
                    <td className="mono">{r.matchText}</td>
                    <td className="small">{RULE_DIRECTIONS[r.direction]}</td>
                    <td>{accountLabel(account(r.accountId)) || <span className="muted">Deleted account</span>}</td>
                    {org.gst ? <td className="small">{taxCodeName(codes, r.taxCodeId)}</td> : null}
                    {org.kind === 'business' ? <td className="small">{contacts.find((c) => c.id === r.contactId)?.name ?? ''}</td> : null}
                    <td>
                      {can ? (
                        <div className="row">
                          <button className="btn ghost sm" onClick={() => setEditing(r)}>Edit</button>
                          <button className="btn ghost sm" aria-label={`Delete the rule for ${r.matchText}`} onClick={() => remove(r)}><Icon name="trash" size={14} /></button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {editing ? <RuleDialog rule={editing === 'new' ? null : editing} nextPosition={(list.length + 1) * 10} onClose={() => setEditing(null)} onSaved={reload} /> : null}
    </div>
  );
}

function RuleDialog({ rule, nextPosition, onClose, onSaved }: { rule: RuleDTO | null; nextPosition: number; onClose: () => void; onSaved: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const [f, setF] = useState({ matchText: rule?.matchText ?? '', direction: rule?.direction ?? ('out' as RuleDTO['direction']), accountId: rule?.accountId ?? null, taxCodeId: rule?.taxCodeId ?? null, contactId: rule?.contactId ?? null });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      const body = { matchText: f.matchText.trim(), direction: f.direction, accountId: f.accountId, taxCodeId: org.gst ? f.taxCodeId : null, contactId: f.contactId };
      if (rule) await patch(fin(org.id, `/rules/${rule.id}`), body);
      else await post(fin(org.id, '/rules'), { ...body, position: nextPosition });
      onSaved();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={rule ? 'Edit rule' : 'New rule'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || f.matchText.trim().length < 2 || !f.accountId} onClick={save}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="crm-form-grid">
        <div className="field crm-span"><label htmlFor="rule-text">When the payee or description contains</label><input id="rule-text" className="input" maxLength={120} value={f.matchText} onChange={(e) => setF({ ...f, matchText: e.target.value })} placeholder="For example: officeworks" /><span className="hint">Not case-sensitive. At least two characters.</span></div>
        <div className="field">
          <label htmlFor="rule-dir">For</label>
          <select id="rule-dir" className="select" value={f.direction} onChange={(e) => setF({ ...f, direction: e.target.value as RuleDTO['direction'] })}>
            {(Object.keys(RULE_DIRECTIONS) as RuleDTO['direction'][]).map((d) => <option key={d} value={d}>{RULE_DIRECTIONS[d]}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="rule-acc">Suggest the category</label><AccountSelect id="rule-acc" kind="category" direction={f.direction} value={f.accountId} onChange={(v) => setF({ ...f, accountId: v })} /></div>
        {org.gst ? <div className="field"><label htmlFor="rule-tax">And the GST code</label><TaxCodeSelect id="rule-tax" direction={f.direction === 'in' ? 'sales' : f.direction === 'out' ? 'purchases' : 'both'} value={f.taxCodeId} onChange={(v) => setF({ ...f, taxCodeId: v })} /></div> : null}
        {org.kind === 'business' ? <div className="field"><label htmlFor="rule-contact">And the contact</label><ContactSelect id="rule-contact" value={f.contactId} onChange={(v) => setF({ ...f, contactId: v })} /></div> : null}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ numbering

function Numbering() {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['fin', org.id, 'numbering'], queryFn: () => get<{ kind: NumberedKind; prefix: string; next: number }[]>(fin(org.id, '/numbering')) });
  const can = org.perms.settings.manage;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <Hint>New quotes, invoices, credit notes, bills, purchase orders and expense claims are numbered in order: the prefix, then the number with four digits (INV-0001). A number can also be typed on a record; each is used once.</Hint>
      <div className="card">
        <div className="crm-table-scroll">
          <table className="data-table crm-table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Prefix</th>
                <th>Next number</th>
                <th>Next looks like</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {NUMBERED_KINDS.map((k) => {
                const row = q.data.find((r) => r.kind === k) ?? { kind: k, prefix: org.settings.prefixes[k], next: 1 };
                return <NumberingRow key={k} row={row} can={can} onSaved={() => q.refetch()} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
      {!can ? <p className="muted small">Only people who manage the workspace settings can change numbering.</p> : null}
    </div>
  );
}

function NumberingRow({ row, can, onSaved }: { row: { kind: NumberedKind; prefix: string; next: number }; can: boolean; onSaved: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const [prefix, setPrefix] = useState(row.prefix);
  const [next, setNext] = useState(String(row.next));
  const changed = prefix !== row.prefix || Number(next) !== row.next;
  const valid = /^[A-Za-z0-9 _/-]{0,12}$/.test(prefix) && Number.isInteger(Number(next)) && Number(next) >= 1;
  const save = async () => {
    try {
      if (prefix !== row.prefix) {
        await patch(fin(org.id), { settings: { prefixes: { [row.kind]: prefix } } });
        await refresh('org');
      }
      if (Number(next) !== row.next) await put(fin(org.id, `/numbering/${row.kind}`), { next: Number(next) });
      toast('Saved');
      onSaved();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <tr>
      <td>{NUMBERED_LABELS[row.kind].many}</td>
      <td>{can ? <input className="input mono" aria-label={`${NUMBERED_LABELS[row.kind].one} prefix`} maxLength={12} value={prefix} onChange={(e) => setPrefix(e.target.value)} /> : <span className="mono">{row.prefix}</span>}</td>
      <td>{can ? <input className="input" type="number" min={1} aria-label={`Next ${NUMBERED_LABELS[row.kind].one.toLowerCase()} number`} value={next} onChange={(e) => setNext(e.target.value)} /> : row.next}</td>
      <td className="mono">{valid ? `${prefix}${String(Number(next)).padStart(4, '0')}` : ''}</td>
      <td>{can && changed ? <button className="btn sm primary" disabled={!valid} onClick={save}>Save</button> : null}</td>
    </tr>
  );
}

// ------------------------------------------------------------------ period lock

function PeriodLock() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const [date, setDate] = useState(org.lockDate ?? '');
  const seesAudit = org.role === 'owner' || org.role === 'admin' || org.perms.accounting.manage;
  const can = org.perms.accounting.lock;
  const save = async (lockDate: string | null) => {
    if (!lockDate && !(await confirm({ title: 'Unlock every period?', message: 'Entries could then be posted, changed or voided on any date again.', confirmLabel: 'Unlock', danger: true }))) return;
    try {
      await put(fin(org.id, '/lock'), { lockDate });
      toast(lockDate ? `Locked up to ${shortDate(lockDate)}` : 'Every period is open');
      await refresh('org');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Period lock</h2>
        <p>
          {org.lockDate ? (
            <>
              The books are locked up to and including <strong>{shortDate(org.lockDate)}</strong>.
            </>
          ) : (
            'No period is locked.'
          )}
        </p>
        <Hint>Nothing can be posted, changed or voided on or before the lock date, for example once a BAS has been lodged or a year has been closed. A correction then goes in a later, open period, as a reversal or a new entry.</Hint>
        {can ? (
          <div className="row wrap">
            <label className="row">
              Lock up to <input className="input" type="date" max={todayLocal()} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Lock date" />
            </label>
            <button className="btn primary" disabled={!date || date === org.lockDate} onClick={() => save(date)}>
              <Icon name="lock" /> Lock
            </button>
            {org.lockDate ? <button className="btn" onClick={() => save(null)}>Unlock every period</button> : null}
          </div>
        ) : (
          <p className="muted small">Only people with the "Lock periods" permission can change the lock date.</p>
        )}
      </section>
      {seesAudit ? (
        <p className="muted small">
          Every change to the lock is recorded in the <Link to={`/o/${org.id}/settings/audit`}>audit trail</Link>.
        </p>
      ) : null}
    </div>
  );
}
