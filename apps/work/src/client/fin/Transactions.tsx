// Transactions: the list with its filters, totals, bulk changes and CSV export; the form for money in, money out and
// transfers (split lines, GST, tracking, duplicates and category suggestions); and one transaction's page with its
// lines, approval, voiding, attachments and history. The server decides posting, approval and every permission.
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, api, del, errorMessage, get, patch, post } from '../lib/api';
import { useDebounced, usePageTitle } from '../lib/hooks';
import { useSession } from '../lib/session';
import { formatBytes, timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Dropdown, MenuItem, Modal, useConfirm, useToast } from '../components/ui/overlays';
import { TAX_MODE_LABELS, splitTax, type TaxMode } from '../../shared/fin/tax';
import { accountLabel, addDaysIso, appUrl, dateTime, download, fin, moneyAccounts, shortDate, todayLocal, useAccounts, useCurrentOrg, useMembers, usePeople, useRefresh, useTaxCodes, useTracking, type AccountDTO, type FinOrgDTO } from './lib';
import { AccountSelect, ContactSelect, Money, MoneyInput, Pager, StatusBadge, TaxCodeSelect, TrackingSelect, useHasTracking } from './ui';

// ------------------------------------------------------------------ types

export type TxKind = 'receive' | 'spend' | 'transfer';
export type TxStatus = 'draft' | 'submitted' | 'posted' | 'void';

export interface TxLineDTO {
  id: string;
  accountId: string;
  description: string;
  /** As typed: including GST when the transaction's amounts include it. */
  amount: number;
  net: number;
  tax: number;
  taxCodeId: string | null;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
}

export interface TxDTO {
  id: string;
  kind: TxKind;
  accountId: string;
  toAccountId: string | null;
  date: string;
  contactId: string | null;
  contactName: string | null;
  payee: string;
  reference: string;
  description: string;
  taxMode: TaxMode;
  total: number;
  tax: number;
  status: TxStatus;
  journalId: string | null;
  reconciled: boolean;
  recurringId: string | null;
  notes: string;
  personId: string | null;
  createdBy: string | null;
  createdByName: string | null;
  submittedAt: number | null;
  approvedBy: string | null;
  approvedAt: number | null;
  rejectedNote: string;
  voidedAt: number | null;
  createdAt: number;
  updatedAt: number;
  fileCount: number;
  lines: TxLineDTO[];
  can: { edit: boolean; delete: boolean; approve: boolean; void: boolean };
}

interface TxList {
  rows: TxDTO[];
  total: number;
  page: number;
  pageSize: number;
  moneyIn: number;
  moneyOut: number;
}

interface FileDTO {
  id: string;
  name: string;
  mime: string;
  size: number;
  version: number;
  uploadedByName: string | null;
  createdAt: number;
  url: string;
}

export const KIND_LABELS: Record<TxKind, string> = { receive: 'Money in', spend: 'Money out', transfer: 'Transfer' };
const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: '', label: 'Any status' },
  { key: 'posted', label: 'Posted' },
  { key: 'submitted', label: 'Awaiting approval' },
  { key: 'draft', label: 'Draft' },
  { key: 'void', label: 'Void' },
];
const PAGE_SIZE = 50;
const FILTER_KEYS = ['account', 'from', 'to', 'q', 'status', 'kind', 'category', 'contact', 'person', 'reconciled'] as const;

/** Posting straight away (approve rights, or the workspace does not ask for approval): else it waits for approval. */
export function postsDirectly(org: FinOrgDTO): boolean {
  return org.perms.banking.approve || !org.settings.approvals.transactions;
}

const isBusiness = (org: FinOrgDTO) => org.kind === 'business';
const showContacts = (org: FinOrgDTO) => isBusiness(org) && org.perms.contacts.view !== 'none';

function statusMessage(status: string): string {
  if (status === 'posted') return 'Posted to the ledger';
  if (status === 'submitted') return 'Submitted for approval';
  return 'Saved as a draft';
}

/** The amount as seen from one account: money in positive, money out negative; transfers by direction. */
function signedAmount(t: TxDTO, accountId?: string): number {
  if (t.kind === 'receive') return t.total;
  if (t.kind === 'spend') return -t.total;
  if (accountId === t.toAccountId) return t.total;
  if (accountId === t.accountId) return -t.total;
  return t.total;
}

function txTitle(t: Pick<TxDTO, 'description' | 'payee' | 'contactName' | 'kind'>): string {
  return t.description || t.payee || t.contactName || KIND_LABELS[t.kind];
}

// ------------------------------------------------------------------ list

export function Transactions() {
  const org = useCurrentOrg();
  usePageTitle('Transactions');
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const accounts = useAccounts().data ?? [];
  const members = useMembers().data ?? [];
  const [params, setParams] = useSearchParams();
  const param = (k: string) => params.get(k) ?? '';
  const setFilters = (patchSet: Record<string, string>) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        for (const [k, v] of Object.entries(patchSet)) {
          if (v) n.set(k, v);
          else n.delete(k);
        }
        if (!('page' in patchSet)) n.delete('page');
        return n;
      },
      { replace: true },
    );
  const [text, setText] = useState(param('q'));
  const dq = useDebounced(text, 300);
  useEffect(() => {
    if (dq !== param('q')) setFilters({ q: dq });
  }, [dq]);
  const page = Math.max(1, Number(param('page')) || 1);
  const filterQs = useMemo(() => {
    const qs = new URLSearchParams();
    for (const k of FILTER_KEYS) if (params.get(k)) qs.set(k, params.get(k)!);
    return qs;
  }, [params]);
  const listQs = `${filterQs.toString()}${filterQs.toString() ? '&' : ''}page=${page}&pageSize=${PAGE_SIZE}`;
  const list = useQuery({ queryKey: ['fin', org.id, 'transactions', listQs], queryFn: () => get<TxList>(`${fin(org.id, '/transactions')}?${listQs}`), placeholderData: keepPreviousData, enabled: org.perms.banking.view !== 'none' });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  useEffect(() => setSelected(new Set()), [listQs]);
  const [creating, setCreating] = useState(false);
  const [bulkModal, setBulkModal] = useState<'categorise' | 'contact' | null>(null);
  const [showFilters, setShowFilters] = useState(() => FILTER_KEYS.some((k) => k !== 'q' && params.get(k)));
  const byId = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);
  const perms = org.perms.banking;
  const household = org.kind === 'household';

  if (perms.view === 'none') return <div className="page"><EmptyState icon="list" title="Your role does not include transactions">Ask an owner or administrator of {org.name} if you need them.</EmptyState></div>;

  const rows = list.data?.rows ?? [];
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filterAccount = param('account') || undefined;

  const bulk = async (action: string, extra: Record<string, unknown> = {}) => {
    if ((action === 'delete' || action === 'void') && !(await confirm({ title: action === 'delete' ? `Delete ${selected.size} ${selected.size === 1 ? 'draft' : 'drafts'}?` : `Void ${selected.size} ${selected.size === 1 ? 'transaction' : 'transactions'}?`, message: action === 'delete' ? 'Only drafts and transactions awaiting approval are deleted. Posted ones are voided instead.' : 'Each posted transaction is reversed in the ledger on its own date. Reconciled ones are skipped.', confirmLabel: action === 'delete' ? 'Delete' : 'Void', danger: true }))) return;
    try {
      const r = await post<{ done: number; errors: { id: string; message: string }[] }>(fin(org.id, '/transactions/bulk'), { ids: [...selected], action, ...extra });
      toast(`${r.done} of ${selected.size} changed${r.errors.length ? `. ${r.errors.length} not changed: ${r.errors[0].message}` : ''}`, r.errors.length && !r.done ? 'error' : 'info');
      setSelected(new Set());
      setBulkModal(null);
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const exportCsv = () => download(appUrl(`/api${fin(org.id, '/transactions')}?${filterQs.toString()}${filterQs.toString() ? '&' : ''}format=csv`));
  const activeFilters = FILTER_KEYS.filter((k) => k !== 'q' && params.get(k)).length;

  return (
    <div className="page crm-page">
      <PageHeader
        title="Transactions"
        icon="list"
        subtitle={perms.view === 'own' ? 'The transactions you recorded.' : `Money in, money out and transfers in ${org.name}.`}
        actions={
          <>
            {list.isFetching ? <Spinner /> : null}
            {perms.export ? (
              <button className="btn" onClick={exportCsv}>
                <Icon name="download" size={14} /> Export CSV
              </button>
            ) : null}
            {perms.create ? (
              <button className="btn primary" onClick={() => setCreating(true)}>
                <Icon name="plus" size={14} /> New transaction
              </button>
            ) : null}
          </>
        }
      />
      <div className="row wrap fin-toolbar">
        <div className="crm-search">
          <Icon name="search" />
          <input className="input" type="search" placeholder="Search payee, description, reference" aria-label="Search transactions" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <select className="select" aria-label="Account" value={param('account')} onChange={(e) => setFilters({ account: e.target.value })}>
          <option value="">All accounts</option>
          {moneyAccounts(accounts).map((a) => (
            <option key={a.id} value={a.id}>{accountLabel(a)}</option>
          ))}
        </select>
        <select className="select" aria-label="Status" value={param('status')} onChange={(e) => setFilters({ status: e.target.value })}>
          {STATUS_FILTERS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <button className="btn" aria-expanded={showFilters} onClick={() => setShowFilters((s) => !s)}>
          <Icon name="filter" size={14} /> More filters{activeFilters ? ` (${activeFilters})` : ''}
        </button>
        {activeFilters || param('q') ? (
          <button className="btn ghost" onClick={() => { setText(''); setFilters(Object.fromEntries(FILTER_KEYS.map((k) => [k, '']))); }}>
            Clear filters
          </button>
        ) : null}
      </div>
      {showFilters ? (
        <div className="card card-pad crm-filter-panel">
          <div className="fin-form-grid">
            <div className="field">
              <label htmlFor="tx-from">From</label>
              <input id="tx-from" className="input" type="date" value={param('from')} onChange={(e) => setFilters({ from: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="tx-to">To</label>
              <input id="tx-to" className="input" type="date" value={param('to')} onChange={(e) => setFilters({ to: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="tx-kind">Type</label>
              <select id="tx-kind" className="select" value={param('kind')} onChange={(e) => setFilters({ kind: e.target.value })}>
                <option value="">Any type</option>
                <option value="receive">Money in</option>
                <option value="spend">Money out</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="tx-cat">Category</label>
              <AccountSelect id="tx-cat" kind="category" value={param('category') || null} onChange={(v) => setFilters({ category: v ?? '' })} allowEmpty emptyLabel="Any category" />
            </div>
            {showContacts(org) ? (
              <div className="field">
                <label htmlFor="tx-contact">Contact</label>
                <ContactSelect id="tx-contact" value={param('contact') || null} onChange={(v) => setFilters({ contact: v ?? '' })} emptyLabel="Any contact" />
              </div>
            ) : null}
            {household ? (
              <div className="field">
                <label htmlFor="tx-person">Person</label>
                <select id="tx-person" className="select" value={param('person')} onChange={(e) => setFilters({ person: e.target.value })}>
                  <option value="">Everyone</option>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>{m.name}</option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="tx-rec">Reconciled</label>
              <select id="tx-rec" className="select" value={param('reconciled')} onChange={(e) => setFilters({ reconciled: e.target.value })}>
                <option value="">Either</option>
                <option value="1">Reconciled</option>
                <option value="0">Not reconciled</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {list.data ? (
        <div className="row wrap fin-toolbar small">
          <span className="muted">Posted, in these filters:</span>
          <span>Money in <Money value={list.data.moneyIn} strong /></span>
          <span>Money out <Money value={list.data.moneyOut} strong /></span>
          <span>Net <Money value={list.data.moneyIn - list.data.moneyOut} tone strong /></span>
        </div>
      ) : null}
      {!list.data ? (
        list.error ? null : <Loading />
      ) : !rows.length ? (
        <EmptyState icon="list" title={filterQs.toString() ? 'No transactions match these filters' : 'No transactions yet'} action={perms.create && !filterQs.toString() ? <button className="btn primary" onClick={() => setCreating(true)}>New transaction</button> : undefined}>
          {filterQs.toString() ? 'Change or clear the filters.' : 'Record money in, money out and transfers here, or import a bank statement from Bank accounts.'}
        </EmptyState>
      ) : (
        <div className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead>
                <tr>
                  <th className="crm-check">
                    <input type="checkbox" aria-label="Select all on this page" checked={allChecked} onChange={(e) => setSelected(e.target.checked ? new Set(rows.map((r) => r.id)) : new Set())} />
                  </th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Account</th>
                  <th>Category</th>
                  <th className="fin-num">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className={selected.has(t.id) ? 'selected' : undefined}>
                    <td className="crm-check">
                      <input
                        type="checkbox"
                        aria-label={`Select ${txTitle(t)}`}
                        checked={selected.has(t.id)}
                        onChange={(e) => {
                          const s = new Set(selected);
                          if (e.target.checked) s.add(t.id);
                          else s.delete(t.id);
                          setSelected(s);
                        }}
                      />
                    </td>
                    <td>{shortDate(t.date)}</td>
                    <td>
                      <Link to={`/o/${org.id}/transactions/${t.id}`} className="crm-primary">{txTitle(t)}</Link>
                      <div className="muted small">
                        {[t.description && t.payee ? t.payee : '', t.contactName, t.reference, household && t.createdByName ? t.createdByName : ''].filter(Boolean).join(' · ')}
                      </div>
                    </td>
                    <td className="small">{accountLabel(byId.get(t.accountId))}</td>
                    <td className="small">{categoryText(t, byId)}</td>
                    <td className="fin-num"><Money value={signedAmount(t, filterAccount)} tone={t.kind !== 'transfer' || !!filterAccount} /></td>
                    <td>
                      <div className="row">
                        <StatusBadge status={t.status} />
                        {t.reconciled ? <span title="Reconciled" aria-label="Reconciled"><Icon name="check" size={14} /></span> : null}
                        {t.fileCount ? <span className="muted small" title={`${t.fileCount} attached`}><Icon name="paperclip" size={13} />{t.fileCount}</span> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={page} pageSize={PAGE_SIZE} total={list.data.total} onPage={(p) => setFilters({ page: String(p) })} />
        </div>
      )}
      {selected.size ? (
        <div className="bulk-bar" role="toolbar" aria-label="Actions for the selected transactions">
          <strong>{selected.size} selected</strong>
          {perms.approve ? <button className="btn sm" onClick={() => bulk('post')}><Icon name="check" size={14} /> Post</button> : null}
          {perms.edit !== 'none' ? <button className="btn sm" onClick={() => setBulkModal('categorise')}>Categorise</button> : null}
          {perms.edit !== 'none' && showContacts(org) ? <button className="btn sm" onClick={() => setBulkModal('contact')}>Set contact</button> : null}
          {perms.approve ? (
            <Dropdown label="Reconciled" trigger={(open, ref) => <button ref={ref} className="btn sm" onClick={open}>Reconciled</button>}>
              {(close) => (
                <>
                  <MenuItem onClick={() => { close(); bulk('reconcile'); }}>Mark reconciled</MenuItem>
                  <MenuItem onClick={() => { close(); bulk('unreconcile'); }}>Mark not reconciled</MenuItem>
                </>
              )}
            </Dropdown>
          ) : null}
          {perms.approve ? <button className="btn sm" onClick={() => bulk('void')}>Void</button> : null}
          {perms.delete !== 'none' ? <button className="btn sm danger" onClick={() => bulk('delete')}><Icon name="trash" size={14} /> Delete drafts</button> : null}
          <button className="btn sm ghost" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      ) : null}
      {bulkModal ? <BulkModal mode={bulkModal} count={selected.size} onClose={() => setBulkModal(null)} onApply={(v) => bulk(bulkModal, bulkModal === 'categorise' ? { accountId: v } : { contactId: v })} /> : null}
      {creating ? (
        <TxForm
          presetAccountId={filterAccount}
          onClose={() => setCreating(false)}
          onSaved={(r) => {
            setCreating(false);
            refresh();
            toast(statusMessage(r.status), 'info', { label: 'Open', run: () => navigate(`/o/${org.id}/transactions/${r.id}`) });
          }}
        />
      ) : null}
    </div>
  );
}

function categoryText(t: TxDTO, byId: Map<string, AccountDTO>): string {
  if (t.kind === 'transfer') return `Transfer to ${accountLabel(byId.get(t.toAccountId ?? '')) || 'another account'}`;
  if (t.lines.length > 1) return `Split: ${t.lines.length} lines`;
  return accountLabel(byId.get(t.lines[0]?.accountId ?? '')) || '';
}

function BulkModal({ mode, count, onClose, onApply }: { mode: 'categorise' | 'contact'; count: number; onClose: () => void; onApply: (v: string | null) => void }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Modal
      title={mode === 'categorise' ? `Categorise ${count} ${count === 1 ? 'transaction' : 'transactions'}` : `Set the contact of ${count} ${count === 1 ? 'transaction' : 'transactions'}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={mode === 'categorise' && !value} onClick={() => onApply(value)}>Apply</button>
        </>
      }
    >
      <div className="field">
        <label htmlFor="bulk-value">{mode === 'categorise' ? 'Category' : 'Contact'}</label>
        {mode === 'categorise' ? <AccountSelect id="bulk-value" kind="category" value={value} onChange={setValue} /> : <ContactSelect id="bulk-value" value={value} onChange={setValue} />}
      </div>
      <p className="muted small">
        {mode === 'categorise'
          ? 'Split transactions and transfers are skipped: change those one at a time. A posted transaction is reversed and posted again with the new category.'
          : 'A posted transaction is reversed and posted again with the new contact.'}
      </p>
    </Modal>
  );
}

// ------------------------------------------------------------------ the form

interface LineState {
  key: number;
  accountId: string | null;
  amount: number | null;
  taxCodeId: string | null;
  description: string;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
}

let lineKey = 1;
const emptyLine = (): LineState => ({ key: lineKey++, accountId: null, amount: null, taxCodeId: null, description: '', departmentId: null, projectId: null, costCentreId: null });

interface Suggestion {
  accountId: string;
  taxCodeId: string | null;
  contactId: string | null;
  reason: string;
}

interface Duplicate {
  id: string;
  date: string;
  total: number;
  description: string;
  status: string;
}

/** New transaction, or a change to one (`initial`). */
export function TxForm({ initial, presetAccountId, onClose, onSaved }: { initial?: TxDTO; presetAccountId?: string; onClose: () => void; onSaved: (r: { id: string; status: string }) => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const accounts = useAccounts().data ?? [];
  const taxCodes = useTaxCodes().data ?? [];
  const members = useMembers().data ?? [];
  const tracking = useHasTracking();
  const money = moneyAccounts(accounts);
  const defaultAccount = presetAccountId ?? money.find((a) => a.isDefault)?.id ?? money[0]?.id ?? '';
  const [kind, setKind] = useState<TxKind>(initial?.kind ?? 'spend');
  const [accountId, setAccountId] = useState<string>(initial?.accountId ?? defaultAccount);
  const [toAccountId, setToAccountId] = useState<string | null>(initial?.toAccountId ?? null);
  const [amount, setAmount] = useState<number | null>(initial?.kind === 'transfer' ? initial.total : null);
  const [date, setDate] = useState(initial?.date ?? todayLocal());
  const [payee, setPayee] = useState(initial?.payee ?? '');
  const [contactId, setContactId] = useState<string | null>(initial?.contactId ?? null);
  const [reference, setReference] = useState(initial?.reference ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [personId, setPersonId] = useState<string | null>(initial?.personId ?? null);
  const [taxMode, setTaxMode] = useState<TaxMode>(initial ? initial.taxMode : org.gst ? 'inclusive' : 'none');
  const [lines, setLines] = useState<LineState[]>(() =>
    initial && initial.kind !== 'transfer' && initial.lines.length
      ? initial.lines.map((l) => ({ key: lineKey++, accountId: l.accountId, amount: l.amount, taxCodeId: l.taxCodeId, description: l.description, departmentId: l.departmentId, projectId: l.projectId, costCentreId: l.costCentreId }))
      : [emptyLine()],
  );
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [duplicates, setDuplicates] = useState<Duplicate[] | null>(null);
  const dupConfirmed = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId && defaultAccount) setAccountId(defaultAccount);
  }, [accountId, defaultAccount]);

  const editing = !!initial;
  const locked = !!initial && initial.status === 'posted' && initial.reconciled;
  const gst = org.gst && kind !== 'transfer';
  const effectiveMode: TaxMode = gst ? taxMode : 'none';
  const direction = kind === 'receive' ? 'in' : 'out';
  const rate = (id: string | null) => (id ? (taxCodes.find((t) => t.id === id)?.rateBp ?? 0) : 0);
  const priced = lines.map((l) => (l.amount === null ? { net: 0, tax: 0, gross: 0 } : splitTax(l.amount, gst ? rate(l.taxCodeId) : 0, effectiveMode)));
  const subtotal = priced.reduce((n, p) => n + p.net, 0);
  const taxTotal = priced.reduce((n, p) => n + p.tax, 0);
  const total = kind === 'transfer' ? (amount ?? 0) : subtotal + taxTotal;
  const showTracking = tracking.department || tracking.project || tracking.cost_centre;

  const setLine = (key: number, p: Partial<LineState>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...p } : l)));
  const chooseCategory = (key: number, id: string | null) => {
    const acc = accounts.find((a) => a.id === id);
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, accountId: id, taxCodeId: org.gst && acc?.taxCodeId && !l.taxCodeId ? acc.taxCodeId : l.taxCodeId } : l)));
  };

  const askSuggestions = async () => {
    const text = `${payee} ${description}`.trim();
    if (!text) return;
    try {
      const r = await get<Suggestion[]>(`${fin(org.id, '/suggest')}?text=${encodeURIComponent(text)}&direction=${direction}`);
      setSuggestions(r);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const applySuggestion = (s: Suggestion) => {
    const first = lines[0];
    setLines((ls) => ls.map((l) => (l.key === first.key ? { ...l, accountId: s.accountId, taxCodeId: org.gst ? (s.taxCodeId ?? l.taxCodeId) : null } : l)));
    if (s.contactId && showContacts(org) && !contactId) setContactId(s.contactId);
    setSuggestions(null);
  };

  const payload = () => {
    const base: Record<string, unknown> = { kind, accountId, date, payee, reference, description, notes };
    if (kind === 'transfer') {
      base.toAccountId = toAccountId;
      base.amount = amount ?? 0;
    } else {
      base.taxMode = effectiveMode;
      // Same keys in the same order as the server reads a transaction back, so an unchanged line is not reposted.
      base.lines = lines.map((l) => ({ accountId: l.accountId ?? '', description: l.description, amount: l.amount ?? 0, taxCodeId: gst ? l.taxCodeId : null, departmentId: l.departmentId, projectId: l.projectId, costCentreId: l.costCentreId }));
    }
    if (showContacts(org)) base.contactId = kind === 'transfer' ? null : contactId;
    if (org.kind === 'household') base.personId = personId;
    return base;
  };

  const validate = (): string | null => {
    if (!accountId) return 'Choose the account';
    if (!date) return 'Choose the date';
    if (kind === 'transfer') {
      if (!toAccountId) return 'Choose the account the money goes to';
      if (toAccountId === accountId) return 'Choose two different accounts';
      if (!amount || amount <= 0) return 'Enter the amount transferred';
      return null;
    }
    if (lines.some((l) => !l.accountId)) return 'Choose a category on every line';
    if (lines.some((l) => l.amount === null || l.amount === 0)) return 'Enter an amount on every line';
    if (total <= 0) return kind === 'receive' ? 'Money in must be more than zero (record a refund as money out)' : 'Money out must be more than zero (record a refund as money in)';
    return null;
  };

  const save = async (action?: 'draft' | 'post' | 'submit') => {
    const problem = validate();
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      // A possible duplicate is pointed out once; the person may save anyway.
      if (!editing && action !== 'draft' && !dupConfirmed.current) {
        const d = await post<Duplicate[]>(fin(org.id, '/transactions/duplicates'), { accountId, date, total, kind });
        if (d.length) {
          setDuplicates(d);
          setBusy(false);
          return;
        }
      }
      const body = { ...payload(), ...(action ? { action } : {}) };
      if (editing) {
        const r = await patch<{ status: string }>(fin(org.id, `/transactions/${initial!.id}`), body);
        onSaved({ id: initial!.id, status: r.status });
      } else {
        const r = await post<{ id: string; status: string }>(fin(org.id, '/transactions'), body);
        onSaved(r);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editing || initial!.status === 'draft') save('post');
    else save();
  };

  const primaryLabel = !editing || initial!.status === 'draft' ? (postsDirectly(org) ? 'Save and post' : 'Submit for approval') : 'Save changes';
  const otherMoney = money.filter((a) => a.id !== accountId);

  return (
    <Modal
      wide
      title={editing ? 'Change the transaction' : 'New transaction'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          {!editing || initial!.status === 'draft' ? (
            <button className="btn" type="button" disabled={busy} onClick={() => save('draft')}>Save draft</button>
          ) : null}
          <button className="btn primary" type="submit" form="tx-form" disabled={busy}>{busy ? 'Saving…' : primaryLabel}</button>
        </>
      }
    >
      <form id="tx-form" className="stack" onSubmit={onSubmit}>
        {locked ? <div className="error-box">This transaction is reconciled. Its amounts, accounts and date stay as they are until it is marked not reconciled; the payee, description, reference and notes can change.</div> : null}
        {editing && initial!.status === 'posted' && !locked ? <p className="muted small">It is posted: a change to its amounts, accounts, contact or date reverses the entry in the ledger and posts it again on the same date.</p> : null}
        <div className="row wrap" role="radiogroup" aria-label="Type">
          {(['spend', 'receive', 'transfer'] as TxKind[]).map((k) => (
            <label key={k} className="row">
              <input type="radio" name="tx-kind" value={k} checked={kind === k} disabled={locked} onChange={() => setKind(k)} /> {KIND_LABELS[k]}
            </label>
          ))}
        </div>
        <div className="fin-form-grid">
          <div className="field">
            <label htmlFor="tx-account">{kind === 'transfer' ? 'From account' : kind === 'receive' ? 'Paid into' : 'Paid from'}</label>
            {locked ? <input id="tx-account" className="input" disabled value={accountLabel(accounts.find((a) => a.id === accountId))} /> : <AccountSelect id="tx-account" kind="money" value={accountId} onChange={(v) => setAccountId(v ?? '')} required />}
          </div>
          {kind === 'transfer' ? (
            <div className="field">
              <label htmlFor="tx-to-account">To account</label>
              <select id="tx-to-account" className="select" disabled={locked} value={toAccountId ?? ''} onChange={(e) => setToAccountId(e.target.value || null)}>
                <option value="">Choose…</option>
                {otherMoney.map((a) => (
                  <option key={a.id} value={a.id}>{accountLabel(a)}</option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="tx-date">Date</label>
            <input id="tx-date" className="input" type="date" required disabled={locked} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {kind === 'transfer' ? (
            <div className="field">
              <label htmlFor="tx-amount">Amount</label>
              <MoneyInput id="tx-amount" value={amount} onChange={setAmount} disabled={locked} />
            </div>
          ) : null}
          {kind !== 'transfer' ? (
            <div className="field">
              <label htmlFor="tx-payee">{kind === 'receive' ? 'Received from' : 'Paid to'}</label>
              <input id="tx-payee" className="input" maxLength={200} value={payee} onChange={(e) => setPayee(e.target.value)} />
            </div>
          ) : null}
          {kind !== 'transfer' && showContacts(org) ? (
            <div className="field">
              <label htmlFor="tx-contact">Contact</label>
              {locked ? <input id="tx-contact" className="input" disabled value={initial?.contactName ?? ''} /> : <ContactSelect id="tx-contact" kind={kind === 'receive' ? 'customer' : 'supplier'} value={contactId} onChange={setContactId} />}
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="tx-ref">Reference</label>
            <input id="tx-ref" className="input" maxLength={100} value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          {org.kind === 'household' ? (
            <div className="field">
              <label htmlFor="tx-person">Whose money</label>
              <select id="tx-person" className="select" disabled={locked} value={personId ?? ''} onChange={(e) => setPersonId(e.target.value || null)}>
                <option value="">Shared</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>{m.name}</option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="field crm-span">
            <label htmlFor="tx-desc">Description</label>
            <input id="tx-desc" className="input" maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        {kind !== 'transfer' ? (
          <section className="stack">
            <div className="row wrap">
              <h3 className="crm-subhead grow">Categories</h3>
              {gst ? (
                <select className="select" aria-label="GST" value={taxMode} disabled={locked} onChange={(e) => setTaxMode(e.target.value as TaxMode)}>
                  {(['inclusive', 'exclusive', 'none'] as TaxMode[]).map((m) => (
                    <option key={m} value={m}>{TAX_MODE_LABELS[m]}</option>
                  ))}
                </select>
              ) : null}
              {!locked && (payee.trim() || description.trim()) ? (
                <button type="button" className="btn sm" onClick={askSuggestions}>
                  <Icon name="bolt" size={14} /> Suggest a category
                </button>
              ) : null}
            </div>
            {suggestions ? (
              <div className="card card-pad stack">
                {suggestions.length ? (
                  suggestions.map((s, i) => (
                    <div key={i} className="row wrap">
                      <span className="grow">
                        <strong>{accountLabel(accounts.find((a) => a.id === s.accountId))}</strong> <span className="muted small">{s.reason}</span>
                      </span>
                      <button type="button" className="btn sm" onClick={() => applySuggestion(s)}>Use</button>
                    </div>
                  ))
                ) : (
                  <p className="muted small">No suggestion yet for this text. Choose the category; rules and past choices make later suggestions.</p>
                )}
                <div><button type="button" className="btn ghost sm" onClick={() => setSuggestions(null)}>Close</button></div>
              </div>
            ) : null}
            <div className="crm-table-scroll">
              <table className="fin-lines">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    {gst ? <th>GST code</th> : null}
                    {showTracking ? <th>Tracking</th> : null}
                    <th className="fin-num">Amount</th>
                    <th className="fin-line-actions"><span className="sr-only">Remove</span></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={l.key}>
                      <td>{locked ? <input className="input" disabled aria-label={`Category, line ${i + 1}`} value={accountLabel(accounts.find((a) => a.id === l.accountId))} /> : <AccountSelect kind="category" direction={direction} value={l.accountId} onChange={(v) => chooseCategory(l.key, v)} ariaLabel={`Category, line ${i + 1}`} />}</td>
                      <td><input className="input" aria-label={`Description, line ${i + 1}`} maxLength={300} value={l.description} disabled={locked} onChange={(e) => setLine(l.key, { description: e.target.value })} /></td>
                      {gst ? <td>{locked ? <input className="input" disabled aria-label={`GST code, line ${i + 1}`} value={taxCodes.find((x) => x.id === l.taxCodeId)?.code ?? 'No GST'} /> : <TaxCodeSelect direction={kind === 'receive' ? 'sales' : 'purchases'} value={l.taxCodeId} onChange={(v) => setLine(l.key, { taxCodeId: v })} ariaLabel={`GST code, line ${i + 1}`} />}</td> : null}
                      {showTracking && locked ? <td className="small"><TrackingNames ids={[l.departmentId, l.projectId, l.costCentreId]} /></td> : null}
                      {showTracking && !locked ? (
                        <td className="stack">
                          <TrackingSelect kind="department" value={l.departmentId} onChange={(v) => setLine(l.key, { departmentId: v })} />
                          <TrackingSelect kind="project" value={l.projectId} onChange={(v) => setLine(l.key, { projectId: v })} />
                          <TrackingSelect kind="cost_centre" value={l.costCentreId} onChange={(v) => setLine(l.key, { costCentreId: v })} />
                        </td>
                      ) : null}
                      <td><MoneyInput signed value={l.amount} onChange={(v) => setLine(l.key, { amount: v })} ariaLabel={`Amount, line ${i + 1}`} disabled={locked} /></td>
                      <td className="fin-line-actions">
                        {lines.length > 1 && !locked ? (
                          <button type="button" className="btn ghost icon sm" aria-label={`Remove line ${i + 1}`} onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}>
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
              {!locked ? (
                <button type="button" className="btn sm" onClick={() => setLines((ls) => [...ls, emptyLine()])}>
                  <Icon name="plus" size={14} /> Split: add a line
                </button>
              ) : null}
              <div className="fin-totals">
                {gst ? (
                  <>
                    <span>Before GST</span>
                    <Money value={subtotal} />
                    <span>GST</span>
                    <Money value={taxTotal} />
                  </>
                ) : null}
                <span className="total">Total</span>
                <span className="total"><Money value={total} /></span>
              </div>
            </div>
          </section>
        ) : null}

        <div className="field">
          <label htmlFor="tx-notes">Notes</label>
          <textarea id="tx-notes" className="input" rows={2} maxLength={4000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {duplicates?.length ? (
          <div className="error-box stack" role="alert">
            <strong>This may already be recorded.</strong>
            <ul>
              {duplicates.map((d) => (
                <li key={d.id}>
                  <Link to={`/o/${org.id}/transactions/${d.id}`} target="_blank" rel="noopener">{shortDate(d.date)}: {d.description || 'Transaction'}</Link> <Money value={d.total} /> <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
            <div className="row">
              <button type="button" className="btn sm primary" onClick={() => { dupConfirmed.current = true; setDuplicates(null); save('post'); }}>Save anyway</button>
              <button type="button" className="btn sm" onClick={onClose}>Do not save</button>
            </div>
          </div>
        ) : null}
        {error ? <div className="error-box" role="alert">{error}</div> : null}
        {!editing && !postsDirectly(org) ? <p className="muted small">Transactions you add wait for approval by someone who can approve them, then they are posted.</p> : null}
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ one transaction

export function TransactionPage() {
  const { id = '' } = useParams();
  const org = useCurrentOrg();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const accounts = useAccounts().data ?? [];
  const taxCodes = useTaxCodes().data ?? [];
  const people = usePeople();
  const tracking = useHasTracking();
  const q = useQuery({ queryKey: ['fin', org.id, 'transaction', id], queryFn: () => get<TxDTO>(fin(org.id, `/transactions/${id}`)), retry: (n, e) => !(e instanceof ApiError && (e.status === 404 || e.status === 403)) && n < 2 });
  const t = q.data;
  usePageTitle(t ? txTitle(t) : 'Transaction');
  const [editing, setEditing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [voidDate, setVoidDate] = useState<{ lockDate: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const byId = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);

  if (q.error) return <div className="page crm-page"><ErrorBox error={q.error} retry={() => q.refetch()} /><p><Link to={`/o/${org.id}/transactions`}>Back to transactions</Link></p></div>;
  if (!t) return <Loading />;

  const run = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await fn();
      toast(done);
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  const doVoid = async (date?: string) => {
    setBusy(true);
    try {
      await post(fin(org.id, `/transactions/${t.id}/void`), date ? { date } : {});
      toast('Voided: the entry is reversed in the ledger');
      setVoidDate(null);
      refresh();
    } catch (e) {
      if (e instanceof ApiError && e.status === 409 && (e.details as { code?: string } | undefined)?.code === 'PERIOD_LOCKED') {
        setVoidDate({ lockDate: String((e.details as { lockDate?: string }).lockDate ?? '') });
      } else toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  const askVoid = async () => {
    if (!(await confirm({ title: 'Void this transaction?', message: 'Its entry is reversed in the ledger. The transaction stays on record, marked void.', confirmLabel: 'Void', danger: true }))) return;
    doVoid();
  };

  const remove = async () => {
    if (!(await confirm({ title: 'Delete this draft?', message: 'Nothing was posted, so nothing changes in the ledger.', confirmLabel: 'Delete', danger: true }))) return;
    try {
      await del(fin(org.id, `/transactions/${t.id}`));
      toast('Deleted');
      refresh();
      navigate(`/o/${org.id}/transactions`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const gstShown = org.gst && t.kind !== 'transfer';
  const showTracking = tracking.department || tracking.project || tracking.cost_centre;

  return (
    <div className="page crm-page">
      <PageHeader
        title={txTitle(t)}
        icon={t.kind === 'transfer' ? 'refresh' : 'dollar'}
        subtitle={`${KIND_LABELS[t.kind]} on ${shortDate(t.date)} · ${accountLabel(byId.get(t.accountId))}`}
        actions={
          <>
            {busy ? <Spinner /> : null}
            {t.can.edit ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" size={14} /> Change</button> : null}
            {t.status === 'draft' && t.can.edit && !t.can.approve ? <button className="btn primary" disabled={busy} onClick={() => run(() => post(fin(org.id, `/transactions/${t.id}/submit`)), 'Submitted for approval')}>Submit for approval</button> : null}
            {t.can.approve ? <button className="btn primary" disabled={busy} onClick={() => run(() => post(fin(org.id, `/transactions/${t.id}/approve`)), 'Approved and posted')}><Icon name="check" size={14} /> {t.status === 'submitted' ? 'Approve and post' : 'Post'}</button> : null}
            {t.can.approve && t.status === 'submitted' ? <button className="btn" onClick={() => setRejecting(true)}>Return</button> : null}
            {t.can.void ? <button className="btn" disabled={busy} onClick={askVoid}>Void</button> : null}
            {t.can.delete ? <button className="btn danger" onClick={remove}><Icon name="trash" size={14} /> Delete</button> : null}
          </>
        }
      />
      <p><Link to={`/o/${org.id}/transactions`} className="small"><Icon name="chevronLeft" size={12} /> All transactions</Link></p>
      {t.status === 'draft' && t.rejectedNote ? <div className="error-box">Returned for changes: {t.rejectedNote}</div> : null}
      <div className="fin-split">
        <div className="stack">
          <section className="card card-pad">
            <dl className="fin-detail">
              <dt>Status</dt>
              <dd className="row wrap"><StatusBadge status={t.status} />{t.reconciled ? <span className="badge success">Reconciled</span> : null}</dd>
              <dt>Type</dt>
              <dd>{KIND_LABELS[t.kind]}</dd>
              <dt>Date</dt>
              <dd>{shortDate(t.date)}</dd>
              <dt>{t.kind === 'transfer' ? 'From' : t.kind === 'receive' ? 'Paid into' : 'Paid from'}</dt>
              <dd><Link to={`/o/${org.id}/banking/${t.accountId}`}>{accountLabel(byId.get(t.accountId))}</Link></dd>
              {t.kind === 'transfer' ? (
                <>
                  <dt>To</dt>
                  <dd>{t.toAccountId ? <Link to={`/o/${org.id}/banking/${t.toAccountId}`}>{accountLabel(byId.get(t.toAccountId))}</Link> : null}</dd>
                </>
              ) : null}
              {t.payee ? (<><dt>{t.kind === 'receive' ? 'Received from' : 'Paid to'}</dt><dd>{t.payee}</dd></>) : null}
              {t.contactName ? (<><dt>Contact</dt><dd>{t.contactId && org.kind === 'business' ? <Link to={`/o/${org.id}/contacts/${t.contactId}`}>{t.contactName}</Link> : t.contactName}</dd></>) : null}
              {t.reference ? (<><dt>Reference</dt><dd>{t.reference}</dd></>) : null}
              {t.description ? (<><dt>Description</dt><dd>{t.description}</dd></>) : null}
              {org.kind === 'household' ? (<><dt>Whose money</dt><dd>{t.personId ? people.name(t.personId) : 'Shared'}</dd></>) : null}
              <dt>Total</dt>
              <dd><Money value={t.total} strong /></dd>
              {gstShown ? (<><dt>GST</dt><dd><Money value={t.tax} /> <span className="muted small">({TAX_MODE_LABELS[t.taxMode]})</span></dd></>) : null}
              <dt>Recorded by</dt>
              <dd>{t.createdByName ?? people.name(t.createdBy)} <span className="muted small">{dateTime(t.createdAt)}</span></dd>
              {t.approvedAt ? (<><dt>Approved</dt><dd>{people.name(t.approvedBy) || 'Approved'} <span className="muted small">{dateTime(t.approvedAt)}</span></dd></>) : null}
              {t.voidedAt ? (<><dt>Voided</dt><dd>{dateTime(t.voidedAt)}</dd></>) : null}
              {t.journalId ? (
                <>
                  <dt>Ledger</dt>
                  <dd>
                    {t.status === 'void' ? 'Posted, then reversed' : 'Posted as a balanced journal entry'}
                    {org.perms.accounting.view ? <> · <Link to={`/o/${org.id}/accounting/journals`}>Journals</Link></> : null}
                  </dd>
                </>
              ) : null}
              {t.recurringId ? (<><dt>Recurring</dt><dd><Link to={`/o/${org.id}/recurring`}>Created by a recurring schedule</Link></dd></>) : null}
            </dl>
            {t.notes ? <p className="crm-text">{t.notes}</p> : null}
            {t.status === 'posted' && org.perms.banking.approve ? (
              <div className="row crm-pad-top">
                <label className="row small">
                  <input type="checkbox" checked={t.reconciled} disabled={busy} onChange={(e) => run(() => post(fin(org.id, `/transactions/${t.id}/reconciled`), { reconciled: e.target.checked }), e.target.checked ? 'Marked reconciled' : 'Marked not reconciled')} />
                  Reconciled with the bank statement
                </label>
              </div>
            ) : null}
          </section>
          {t.kind !== 'transfer' ? (
            <section className="card">
              <div className="crm-table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                      {showTracking ? <th>Tracking</th> : null}
                      {gstShown ? <th>GST code</th> : null}
                      {gstShown ? <th className="fin-num">Net</th> : null}
                      {gstShown ? <th className="fin-num">GST</th> : null}
                      <th className="fin-num">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.lines.map((l) => (
                      <tr key={l.id}>
                        <td>{accountLabel(byId.get(l.accountId))}</td>
                        <td>{l.description}</td>
                        {showTracking ? <td className="small"><TrackingNames ids={[l.departmentId, l.projectId, l.costCentreId]} /></td> : null}
                        {gstShown ? <td>{taxCodes.find((x) => x.id === l.taxCodeId)?.code ?? 'No GST'}</td> : null}
                        {gstShown ? <td className="fin-num"><Money value={l.net} /></td> : null}
                        {gstShown ? <td className="fin-num"><Money value={l.tax} /></td> : null}
                        <td className="fin-num"><Money value={l.net + l.tax} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
        <div className="stack">
          <Attachments tx={t} />
          <History txId={t.id} />
        </div>
      </div>
      {editing ? (
        <TxForm
          initial={t}
          onClose={() => setEditing(false)}
          onSaved={(r) => {
            setEditing(false);
            toast(r.status === t.status ? 'Saved' : statusMessage(r.status));
            refresh();
          }}
        />
      ) : null}
      {rejecting ? (
        <RejectModal
          onClose={() => setRejecting(false)}
          onSend={(note) =>
            run(async () => {
              await post(fin(org.id, `/transactions/${t.id}/reject`), { note });
              setRejecting(false);
            }, 'Returned to the person who recorded it')
          }
        />
      ) : null}
      {voidDate ? <VoidDateModal lockDate={voidDate.lockDate} busy={busy} onClose={() => setVoidDate(null)} onVoid={(d) => doVoid(d)} /> : null}
    </div>
  );
}

function TrackingNames({ ids }: { ids: (string | null)[] }) {
  const list = useTracking().data ?? [];
  return <>{ids.filter(Boolean).map((i) => list.find((x) => x.id === i)?.name ?? '').filter(Boolean).join(', ')}</>;
}

function RejectModal({ onClose, onSend }: { onClose: () => void; onSend: (note: string) => void }) {
  const [note, setNote] = useState('');
  return (
    <Modal
      title="Return for changes"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!note.trim()} onClick={() => onSend(note.trim())}>Return</button>
        </>
      }
    >
      <div className="field">
        <label htmlFor="reject-note">What needs to change</label>
        <textarea id="reject-note" className="input" rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <p className="muted small">It goes back to draft and the person who recorded it is told why.</p>
    </Modal>
  );
}

function VoidDateModal({ lockDate, busy, onClose, onVoid }: { lockDate: string; busy: boolean; onClose: () => void; onVoid: (date: string) => void }) {
  const first = lockDate ? addDaysIso(lockDate, 1) : todayLocal();
  const [date, setDate] = useState(first > todayLocal() ? first : todayLocal());
  return (
    <Modal
      title="Choose a date for the reversal"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn danger" disabled={busy || !date || (!!lockDate && date <= lockDate)} onClick={() => onVoid(date)}>Void</button>
        </>
      }
    >
      <p>The books are locked up to {shortDate(lockDate)}, so the locked period stays as it is. The reversal is dated in the open period instead.</p>
      <div className="field">
        <label htmlFor="void-date">Reversal date</label>
        <input id="void-date" className="input" type="date" min={first} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
    </Modal>
  );
}

function Attachments({ tx }: { tx: TxDTO }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const me = useSession().session?.user.id;
  const q = useQuery({ queryKey: ['fin', org.id, 'tx-files', tx.id], queryFn: () => get<{ files: FileDTO[] }>(`${fin(org.id, '/files')}?parentType=transaction&parentId=${tx.id}`) });
  // The server lets whoever may change the transaction add or remove its files (posted or not).
  const edit = org.perms.banking.edit;
  const canUpload = org.perms.documents.create && tx.status !== 'void' && (edit === 'all' || (edit === 'own' && !!me && tx.createdBy === me));
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.set('file', f);
        form.set('parentType', 'transaction');
        form.set('parentId', tx.id);
        await api(fin(org.id, '/files'), { method: 'POST', form });
      }
      toast(files.length === 1 ? 'Attached' : `${files.length} files attached`);
      q.refetch();
      refresh('transactions');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };
  const remove = async (f: FileDTO) => {
    if (!(await confirm({ title: `Remove ${f.name}?`, confirmLabel: 'Remove', danger: true }))) return;
    try {
      await del(fin(org.id, `/files/${f.id}`));
      q.refetch();
      refresh('transactions');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">Receipts and attachments</h2>
        {busy ? <Spinner /> : null}
        {canUpload ? (
          <>
            <input ref={input} type="file" multiple hidden onChange={(e) => upload(e.target.files)} />
            <button className="btn sm" onClick={() => input.current?.click()} disabled={busy}><Icon name="upload" size={14} /> Attach</button>
          </>
        ) : null}
      </div>
      {q.error ? <ErrorBox error={q.error} /> : !q.data ? <Spinner /> : !q.data.files.length ? (
        <p className="muted small">No files yet.{canUpload ? ' Attach a receipt, invoice or other proof.' : ''}</p>
      ) : (
        <ul className="crm-mini-list">
          {q.data.files.map((f) => (
            <li key={f.id}>
              <Icon name="paperclip" size={14} />
              <div className="grow">
                <a href={appUrl(f.url)} rel="noopener">{f.name}</a>
                <div className="muted small">{formatBytes(f.size)}{f.version > 1 ? ` · version ${f.version}` : ''} · {f.uploadedByName ?? ''} {timeAgo(f.createdAt)}</div>
              </div>
              {canUpload ? <button className="btn ghost icon sm" aria-label={`Remove ${f.name}`} onClick={() => remove(f)}><Icon name="trash" size={14} /></button> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const ACTION_TEXT: Record<string, string> = {
  'transaction.posted': 'Recorded and posted',
  'transaction.submitted': 'Submitted for approval',
  'transaction.drafted': 'Saved as a draft',
  'transaction.updated': 'Changed',
  'transaction.reposted': 'Changed: reversed and posted again',
  'transaction.approved': 'Approved and posted',
  'transaction.returned': 'Returned for changes',
  'transaction.voided': 'Voided',
  'transaction.deleted': 'Deleted',
  'transaction.reconciled': 'Marked reconciled',
  'transaction.unreconciled': 'Marked not reconciled',
  'statement.matched': 'Matched to a bank statement line',
  'statement.unmatched': 'Unmatched from a bank statement line',
  'file.uploaded': 'File attached',
  'file.deleted': 'File removed',
};

function History({ txId }: { txId: string }) {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['fin', org.id, 'tx-history', txId], queryFn: () => get<{ action: string; actor: string | null; at: number }[]>(fin(org.id, `/history/transaction/${txId}`)) });
  return (
    <section className="card card-pad">
      <h2 className="crm-subhead">History</h2>
      {q.error ? <ErrorBox error={q.error} /> : !q.data ? <Spinner /> : !q.data.length ? <p className="muted small">Nothing recorded yet.</p> : (
        <ul className="crm-mini-list">
          {q.data.map((h, i) => (
            <li key={i}>
              <Icon name="history" size={14} />
              <div className="grow">
                <div>{ACTION_TEXT[h.action] ?? h.action.replace(/[._]/g, ' ')}</div>
                <div className="muted small">{h.actor ?? 'BIZOMAT'} · {dateTime(h.at)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
