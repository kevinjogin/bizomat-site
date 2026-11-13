// Invoices, bills, purchase orders and expense claims (business workspaces): the list with its status tabs, filters,
// totals and CSV export; one document with its editor, approval, payments, purchase order to bill, PDF, attachments and
// void. Every figure the ledger keeps comes from the server; the editor's totals use the server's own rounding
// (lineTotal and splitTax) so what a person sees before saving is what is saved.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, api, del, errorMessage, get, patch, post } from '../lib/api';
import { useDebounced, usePageTitle } from '../lib/hooks';
import { useSession } from '../lib/session';
import { formatBytes, timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { TAX_MODE_LABELS, type TaxMode } from '../../shared/fin/tax';
import { DOC_LABELS, type DocKind } from '../../shared/fin/settings';
import { accountLabel, addDaysIso, appUrl, dateTime, download, fin, longDate, shortDate, todayLocal, useAccounts, useContacts, useCurrentOrg, useMembers, useMoney, useRefresh, useTaxCodes, type FinOrgDTO } from './lib';
import { AccountSelect, ContactSelect, Hint, Money, MoneyInput, Stat, StatusBadge, taxCodeName, useHasTracking } from './ui';
import { CustomerField, DocumentFrame, LinesEditor, LivePreview, ShareActions, Totals, blankLine, isEmptyLine, lineBody, lineFromDto, percentBpOf, priceLines, type SalesLine } from './sales-ui';

// ------------------------------------------------------------------ types and rules

type DocStatus = 'draft' | 'submitted' | 'approved' | 'part_paid' | 'paid' | 'billed' | 'void';

interface DocLineDTO {
  id: string;
  lineKind: 'item' | 'heading';
  itemCode: string;
  unit: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountBp: number;
  accountId: string | null;
  taxCodeId: string | null;
  net: number;
  tax: number;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
}

interface PaymentDTO {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  amount: number;
  reference: string;
  voided: boolean;
  reconciled: boolean;
}

interface DocDTO {
  id: string;
  kind: DocKind;
  number: string;
  contactId: string | null;
  contactName: string | null;
  claimantId: string | null;
  claimantName: string | null;
  issueDate: string;
  dueDate: string | null;
  reference: string;
  taxMode: TaxMode;
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  status: DocStatus;
  overdue: boolean;
  templateId: string | null;
  notes: string;
  terms: string;
  journalId: string | null;
  sourceDocId: string | null;
  recurringId: string | null;
  sentAt: number | null;
  rejectedNote: string;
  createdBy: string | null;
  createdByName: string | null;
  approvedAt: number | null;
  voidedAt: number | null;
  createdAt: number;
  fileCount: number;
  deliveryAddress: string;
  salesRepId: string | null;
  discountBp: number;
  quoteId: string | null;
  quoteNumber: string | null;
  quoteBp: number;
  online: boolean;
  viewedAt: number | null;
  lines: DocLineDTO[];
  payments: PaymentDTO[];
  credits: { id: string; creditNoteId: string; creditNumber: string; date: string; amount: number; removed: boolean }[];
  can: { edit: boolean; delete: boolean; approve: boolean; pay: boolean; void: boolean; credit: boolean; share: boolean };
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

interface TemplateDTO {
  id: string;
  name: string;
  title: string;
  isDefault: boolean;
}

const moduleOf = (kind: DocKind) => (kind === 'invoice' ? 'sales' : 'purchases') as 'sales' | 'purchases';
const approvalKey = (kind: DocKind) => (kind === 'invoice' ? 'invoices' : kind === 'expense_claim' ? 'expenseClaims' : 'bills') as 'invoices' | 'bills' | 'expenseClaims';

/** The same rule as the server's mayApprove: approvers, or creators when this kind needs no approval. */
function mayApprove(org: FinOrgDTO, kind: DocKind): boolean {
  const p = org.perms[moduleOf(kind)];
  return p.approve || (p.create && !org.settings.approvals[approvalKey(kind)]);
}

const docPath = (orgId: string, kind: DocKind, id?: string) => `/o/${orgId}/${DOC_LABELS[kind].path}${id ? `/${id}` : ''}`;

/** Who the document is with: the customer, the supplier, or for a claim the person reimbursed. */
const partyLabel = (kind: DocKind) => (kind === 'invoice' ? 'Customer' : kind === 'expense_claim' ? 'Claimed by' : 'Supplier');

const KIND_TEXT: Record<DocKind, string> = {
  invoice: 'Invoices to your customers. Approving one posts it to the ledger as money owed to you; record payments as they arrive.',
  bill: 'Bills from your suppliers. Approving one posts it as money you owe; record payments as you make them.',
  purchase_order: 'Orders you send to suppliers. They are not posted to the ledger; once approved, turn one into a bill when the supplier invoices you.',
  expense_claim: 'Money people spent for the business, to be paid back. Approving a claim posts it; record the reimbursement when it is paid.',
};

const PAYMENT_NOTE = 'Recording a payment notes money already received or paid outside BIZOMAT, for example by bank transfer. BIZOMAT does not move money or process payments.';

function BusinessOnly() {
  return (
    <div className="page crm-page">
      <EmptyState icon="doc" title="Invoices and bills belong to business workspaces">
        Personal and household workspaces keep transactions, budgets and goals. Create a business workspace from the workspace menu to send invoices, record bills, raise purchase orders and handle expense claims.
      </EmptyState>
    </div>
  );
}

function NoAccess({ kind }: { kind: DocKind }) {
  return (
    <div className="page crm-page">
      <EmptyState icon="lock" title={`Your role does not include ${DOC_LABELS[kind].many.toLowerCase()}`}>
        Ask an owner or administrator of the workspace if you need them.
      </EmptyState>
    </div>
  );
}

// ------------------------------------------------------------------ list

interface StatusTab {
  key: string;
  label: string;
}

function statusTabs(kind: DocKind): StatusTab[] {
  if (kind === 'purchase_order')
    return [
      { key: '', label: 'All' },
      { key: 'draft', label: 'Drafts' },
      { key: 'submitted', label: 'Awaiting approval' },
      { key: 'approved', label: 'Approved' },
      { key: 'billed', label: 'Billed' },
      { key: 'void', label: 'Void' },
    ];
  return [
    { key: '', label: 'All' },
    { key: 'draft', label: 'Drafts' },
    { key: 'submitted', label: 'Awaiting approval' },
    { key: 'open', label: kind === 'invoice' ? 'Awaiting payment' : 'To pay' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'paid', label: 'Paid' },
    { key: 'void', label: 'Void' },
  ];
}

export function DocList({ kind }: { kind: DocKind }) {
  const org = useCurrentOrg();
  const label = DOC_LABELS[kind];
  usePageTitle(label.many);
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms[moduleOf(kind)].view === 'none') return <NoAccess kind={kind} />;
  return <DocListInner key={kind} kind={kind} org={org} />;
}

function DocListInner({ kind, org }: { kind: DocKind; org: FinOrgDTO }) {
  const label = DOC_LABELS[kind];
  const perms = org.perms[moduleOf(kind)];
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  const contact = params.get('contact') ?? '';
  const [search, setSearch] = useState('');
  const q = useDebounced(search, 300);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  const qs = new URLSearchParams({ kind });
  if (status) qs.set('status', status);
  if (q.trim()) qs.set('q', q.trim());
  if (contact) qs.set('contact', contact);
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const list = useQuery({ queryKey: ['fin', org.id, 'docs', kind, qs.toString()], queryFn: () => get<{ rows: DocDTO[]; totals: { total: number; due: number; overdue: number } }>(`${fin(org.id, '/docs')}?${qs}`), placeholderData: keepPreviousData });
  const rows = list.data?.rows ?? [];
  const totals = list.data?.totals;
  const party = partyLabel(kind);
  const contactKind = kind === 'invoice' ? 'customer' : 'supplier';
  const exportCsv = () => {
    const e = new URLSearchParams(qs);
    e.set('format', 'csv');
    download(appUrl(`/api${fin(org.id, '/docs')}?${e}`));
  };
  return (
    <div className="page crm-page">
      <PageHeader
        title={label.many}
        icon={kind === 'invoice' ? 'doc' : kind === 'expense_claim' ? 'dollar' : kind === 'purchase_order' ? 'checkSquare' : 'file'}
        subtitle={KIND_TEXT[kind]}
        actions={
          <>
            {list.isFetching ? <Spinner /> : null}
            {perms.export ? (
              <button className="btn" onClick={exportCsv}>
                <Icon name="download" /> Export CSV
              </button>
            ) : null}
            {perms.create ? (
              <button className="btn primary" onClick={() => navigate(`${docPath(org.id, kind, 'new')}${contact ? `?contact=${contact}` : ''}`)}>
                <Icon name="plus" /> New {label.one.toLowerCase()}
              </button>
            ) : null}
          </>
        }
      />
      <nav className="crm-views" aria-label="Status">
        {statusTabs(kind).map((t) => (
          <button key={t.key || 'all'} className={`tab${status === t.key ? ' active' : ''}`} aria-current={status === t.key ? 'true' : undefined} onClick={() => setParam('status', t.key)}>
            {t.label}
          </button>
        ))}
      </nav>
      {totals && kind !== 'purchase_order' ? (
        <div className="crm-stats">
          <Stat label="Total in this list" value={<Money value={totals.total} />} hint="Void documents not counted" />
          <Stat label={kind === 'invoice' ? 'Still to be received' : 'Still to be paid'} value={<Money value={totals.due} />} />
          <Stat label="Overdue" value={<Money value={totals.overdue} />} tone={totals.overdue > 0 ? 'danger' : undefined} hint="Past the due date" />
        </div>
      ) : null}
      <div className="row fin-toolbar">
        <div className="crm-search">
          <Icon name="search" />
          <input className="input" type="search" placeholder={`Number, ${kind === 'expense_claim' ? 'reference' : party.toLowerCase()} or reference`} aria-label={`Search ${label.many.toLowerCase()}`} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {kind !== 'expense_claim' ? <ContactSelect value={contact || null} onChange={(v) => setParam('contact', v ?? '')} kind={contactKind} ariaLabel={`Filter by ${party.toLowerCase()}`} emptyLabel={`Every ${party.toLowerCase()}`} /> : null}
        <label className="row small">
          From <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
        </label>
        <label className="row small">
          To <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
        </label>
        {from || to || search || contact ? (
          <button className="btn ghost sm" onClick={() => { setFrom(''); setTo(''); setSearch(''); setParam('contact', ''); }}>
            Clear filters
          </button>
        ) : null}
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {!list.data ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="doc" title={`No ${label.many.toLowerCase()} here`} action={perms.create && !status && !q && !contact ? <button className="btn primary" onClick={() => navigate(docPath(org.id, kind, 'new'))}>New {label.one.toLowerCase()}</button> : undefined}>
          {status || q || contact || from || to ? 'Nothing matches these filters.' : `Create the first one with “New ${label.one.toLowerCase()}”.`}
        </EmptyState>
      ) : (
        <div className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>{party}</th>
                  <th>Date</th>
                  <th>{kind === 'purchase_order' ? 'Delivery' : 'Due'}</th>
                  <th>Status</th>
                  <th className="fin-num">Total</th>
                  {kind !== 'purchase_order' ? <th className="fin-num">Due amount</th> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Link className="crm-primary" to={docPath(org.id, kind, d.id)}>
                        {d.number}
                      </Link>
                      {d.reference ? <div className="muted small">{d.reference}</div> : null}
                    </td>
                    <td>{kind === 'expense_claim' ? (d.claimantName ?? '') : (d.contactName ?? <span className="muted">None</span>)}</td>
                    <td>{shortDate(d.issueDate)}</td>
                    <td>{d.dueDate ? shortDate(d.dueDate) : <span className="muted">None</span>}</td>
                    <td>
                      <StatusBadge status={d.status} overdue={d.overdue} />
                    </td>
                    <td className="fin-num">
                      <Money value={d.total} />
                    </td>
                    {kind !== 'purchase_order' ? (
                      <td className="fin-num">{d.status === 'void' ? <span className="muted">None</span> : <Money value={d.amountDue} />}</td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="muted small crm-pager">
            {rows.length === 500 ? 'The first 500 documents. Narrow the filters to see others.' : rows.length === 1 ? '1 document' : `${rows.length} documents`}
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ one document

export function DocPage({ kind }: { kind: DocKind }) {
  const org = useCurrentOrg();
  const { id = '' } = useParams();
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms[moduleOf(kind)].view === 'none') return <NoAccess kind={kind} />;
  if (id === 'new') return <NewDoc key={kind} kind={kind} org={org} />;
  return <ExistingDoc key={id} kind={kind} org={org} id={id} />;
}

function NewDoc({ kind, org }: { kind: DocKind; org: FinOrgDTO }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  usePageTitle(`New ${DOC_LABELS[kind].one.toLowerCase()}`);
  if (!org.perms[moduleOf(kind)].create) return <NoAccess kind={kind} />;
  return (
    <div className="page crm-page">
      <PageHeader title={`New ${DOC_LABELS[kind].one.toLowerCase()}`} icon="plus" subtitle={KIND_TEXT[kind]} />
      <DocEditor kind={kind} org={org} presetContact={params.get('contact')} onSaved={(id) => navigate(docPath(org.id, kind, id), { replace: true })} onCancel={() => navigate(docPath(org.id, kind))} />
    </div>
  );
}

function ExistingDoc({ kind, org, id }: { kind: DocKind; org: FinOrgDTO; id: string }) {
  const q = useQuery({ queryKey: ['fin', org.id, 'doc', id], queryFn: () => get<DocDTO>(fin(org.id, `/docs/${id}`)) });
  const [editing, setEditing] = useState(false);
  const refresh = useRefresh();
  usePageTitle(q.data ? `${DOC_LABELS[kind].one} ${q.data.number}` : DOC_LABELS[kind].one);
  if (q.error) {
    if (q.error instanceof ApiError && q.error.status === 404)
      return (
        <div className="page crm-page">
          <EmptyState icon="doc" title={`This ${DOC_LABELS[kind].one.toLowerCase()} is not available`} action={<Link className="btn" to={docPath(org.id, kind)}>Back to {DOC_LABELS[kind].many.toLowerCase()}</Link>}>
            It may have been deleted, or your role does not include it.
          </EmptyState>
        </div>
      );
    return (
      <div className="page crm-page">
        <ErrorBox error={q.error} retry={() => q.refetch()} />
      </div>
    );
  }
  if (!q.data) return <Loading />;
  const d = q.data;
  if (d.kind !== kind) return <EmptyState icon="doc" title="Not found" />;
  if (editing)
    return (
      <div className="page crm-page">
        <PageHeader title={`Edit ${DOC_LABELS[kind].one.toLowerCase()} ${d.number}`} icon="edit" subtitle={d.status === 'approved' ? 'This document is approved: saving reverses its entry in the ledger and posts the changed one.' : undefined} />
        <DocEditor
          kind={kind}
          org={org}
          initial={d}
          onSaved={() => {
            setEditing(false);
            refresh();
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  return <DocView doc={d} org={org} onEdit={() => setEditing(true)} reload={() => { q.refetch(); refresh(); }} />;
}

// ------------------------------------------------------------------ editor

function DocEditor({ kind, org, initial, presetContact, onSaved, onCancel }: { kind: DocKind; org: FinOrgDTO; initial?: DocDTO; presetContact?: string | null; onSaved: (id: string) => void; onCancel: () => void }) {
  const toast = useToast();
  const refresh = useRefresh();
  const { session } = useSession();
  const me = session?.user.id ?? '';
  const contacts = useContacts().data ?? [];
  const taxCodes = useTaxCodes().data;
  const members = useMembers().data ?? [];
  const tracking = useHasTracking();
  const anyTracking = tracking.department || tracking.project || tracking.cost_centre;
  const templates = useQuery({ queryKey: ['fin', org.id, 'templates'], queryFn: () => get<TemplateDTO[]>(fin(org.id, '/templates')), enabled: kind === 'invoice' });
  const perms = org.perms[moduleOf(kind)];
  const approver = mayApprove(org, kind);
  const gst = org.gst;
  const direction = kind === 'invoice' ? 'sales' : 'purchases';

  const [contactId, setContactId] = useState<string | null>(initial?.contactId ?? presetContact ?? null);
  const [claimantId, setClaimantId] = useState<string | null>(initial?.claimantId ?? (kind === 'expense_claim' ? me : null));
  const [number, setNumber] = useState(initial?.number ?? '');
  const [reference, setReference] = useState(initial?.reference ?? '');
  const [issueDate, setIssueDate] = useState(initial?.issueDate ?? todayLocal());
  const [dueDate, setDueDate] = useState<string>(initial?.dueDate ?? '');
  const [dueTouched, setDueTouched] = useState(!!initial);
  const [taxMode, setTaxMode] = useState<TaxMode>(initial?.taxMode ?? (gst ? (kind === 'invoice' || kind === 'purchase_order' ? 'exclusive' : 'inclusive') : 'none'));
  const [templateId, setTemplateId] = useState<string | null>(initial?.templateId ?? null);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [terms, setTerms] = useState(initial?.terms ?? '');
  const [lines, setLinesState] = useState<SalesLine[]>(() => (initial?.lines.length ? initial.lines.map(lineFromDto) : [blankLine()]));
  const setLines = (f: (ls: SalesLine[]) => SalesLine[]) => setLinesState(f);
  const [discount, setDiscount] = useState(initial?.discountBp ? String(initial.discountBp / 100) : '');
  const [deliveryAddress, setDeliveryAddress] = useState(initial?.deliveryAddress ?? '');
  const [salesRepId, setSalesRepId] = useState<string | null>(initial?.salesRepId ?? null);
  const [busy, setBusy] = useState(false);
  // Invoices and purchase orders go to other businesses: item codes, units, a whole-document discount and a preview.
  const outgoing = kind === 'invoice' || kind === 'purchase_order';

  const contact = contacts.find((c) => c.id === contactId);
  // The due date follows the date and the contact's terms (else the workspace's) until the person sets it.
  useEffect(() => {
    if (dueTouched || kind === 'purchase_order' || !issueDate) return;
    setDueDate(addDaysIso(issueDate, contact?.termsDays ?? org.settings.termsDays));
  }, [issueDate, contact?.termsDays, dueTouched, kind, org.settings.termsDays]);
  // A contact's default account and tax code fill the lines that have none yet.
  const lastContact = useRef<string | null>(initial?.contactId ?? null);
  useEffect(() => {
    if (!contact || lastContact.current === contact.id) return;
    lastContact.current = contact.id;
    if (!contact.defaultAccountId && !contact.defaultTaxCodeId) return;
    setLines((ls) => ls.map((l) => ({ ...l, accountId: l.accountId ?? contact.defaultAccountId, taxCodeId: gst ? (l.taxCodeId ?? contact.defaultTaxCodeId) : null })));
  }, [contact, gst]);

  const effectiveMode: TaxMode = gst ? taxMode : 'none';
  const discountBp = outgoing ? percentBpOf(discount) : 0;
  const priced = useMemo(() => priceLines(lines, { gst, mode: effectiveMode, discountBp, taxCodes }), [lines, taxCodes, gst, effectiveMode, discountBp]);

  const kept = lines.filter((l) => !isEmptyLine(l));
  const docBody = (): Record<string, unknown> => {
    const body: Record<string, unknown> = {
      contactId,
      issueDate,
      dueDate: dueDate || null,
      reference: reference.trim(),
      taxMode: effectiveMode,
      notes,
      terms,
      lines: kept.map((l) => lineBody(l, gst, false)),
    };
    if (outgoing) Object.assign(body, { discountBp: Number.isFinite(discountBp) ? discountBp : 0, deliveryAddress: deliveryAddress.trim() });
    if (kind === 'invoice') body.salesRepId = salesRepId;
    return body;
  };
  const save = async (action: 'draft' | 'submit' | 'approve' | 'keep') => {
    if (!kept.some((l) => l.lineKind === 'item')) {
      toast('Add at least one line with a description or a price', 'error');
      return;
    }
    if (!priced.valid) {
      toast('Check the quantities and discounts: use numbers, and discounts from 0 to 100%', 'error');
      return;
    }
    const body = docBody();
    if (number.trim()) body.number = number.trim();
    if (kind === 'expense_claim') body.claimantId = claimantId ?? me;
    if (kind === 'invoice') body.templateId = templateId;
    if (action !== 'keep') body.action = action;
    setBusy(true);
    try {
      if (initial) {
        await patch(fin(org.id, `/docs/${initial.id}`), body);
        toast(action === 'approve' ? 'Saved and approved' : action === 'submit' ? 'Saved and submitted for approval' : 'Saved');
        refresh();
        onSaved(initial.id);
      } else {
        const r = await post<{ id: string; number: string; status: DocStatus }>(fin(org.id, '/docs'), { kind, ...body });
        toast(r.status === 'approved' ? `${DOC_LABELS[kind].one} ${r.number} approved` : r.status === 'submitted' ? `${DOC_LABELS[kind].one} ${r.number} submitted for approval` : `${DOC_LABELS[kind].one} ${r.number} saved as a draft`);
        refresh();
        onSaved(r.id);
      }
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  const status = initial?.status;
  const approvedAlready = status === 'approved';
  // A document awaiting approval keeps that status when it is saved; an approved one is re-posted.
  const keepsStatus = approvedAlready || status === 'submitted';
  const canChooseClaimant = kind === 'expense_claim' && (perms.approve || perms.edit === 'all');
  const templateList = templates.data ?? [];

  return (
    <form
      className={outgoing ? 'fin-editor-split' : 'stack-lg'}
      onSubmit={(e) => {
        e.preventDefault();
        void save(keepsStatus ? 'keep' : 'draft');
      }}
    >
      <div className="stack-lg">
      {initial?.rejectedNote && status === 'draft' ? (
        <div className="error-box" role="status">
          Returned for changes: {initial.rejectedNote}
        </div>
      ) : null}
      <section className="card card-pad">
        <div className="fin-form-grid">
          {kind === 'expense_claim' ? (
            <div className="field">
              <label htmlFor="doc-claimant">Claimed by</label>
              {canChooseClaimant ? (
                <select id="doc-claimant" className="select" value={claimantId ?? me} onChange={(e) => setClaimantId(e.target.value)}>
                  {members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.name}
                      {m.userId === me ? ' (you)' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input id="doc-claimant" className="input" readOnly value={members.find((m) => m.userId === (claimantId ?? me))?.name ?? session?.user.name ?? ''} />
              )}
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="doc-contact">{kind === 'expense_claim' ? 'Paid to (optional)' : partyLabel(kind)}</label>
            {kind === 'invoice' ? (
              <CustomerField org={org} id="doc-contact" value={contactId} onChange={setContactId} required />
            ) : (
              <ContactSelect id="doc-contact" value={contactId} onChange={setContactId} kind={kind === 'expense_claim' ? 'any' : 'supplier'} emptyLabel={kind === 'expense_claim' ? 'Not recorded' : `Choose a ${partyLabel(kind).toLowerCase()}`} />
            )}
            {!contacts.length && org.perms.contacts.create ? (
              <span className="muted small">
                No {kind === 'invoice' ? 'customers' : 'suppliers'} yet: <Link to={`/o/${org.id}/contacts`}>add one</Link>.
              </span>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="doc-number">Number</label>
            <input id="doc-number" className="input" maxLength={40} value={number} onChange={(e) => setNumber(e.target.value)} placeholder={`Automatic (${org.settings.prefixes[kind]}0001, …)`} />
          </div>
          <div className="field">
            <label htmlFor="doc-date">Date</label>
            <input id="doc-date" className="input" type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="doc-due">{kind === 'purchase_order' ? 'Delivery by (optional)' : 'Due date'}</label>
            <input
              id="doc-due"
              className="input"
              type="date"
              min={issueDate}
              value={dueDate}
              onChange={(e) => {
                setDueTouched(true);
                setDueDate(e.target.value);
              }}
            />
            {kind !== 'purchase_order' && !dueTouched ? <span className="muted small">{contact?.termsDays !== null && contact?.termsDays !== undefined ? `${contact.name}'s terms: ${contact.termsDays} days` : `Workspace terms: ${org.settings.termsDays} days`}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="doc-ref">Reference</label>
            <input id="doc-ref" className="input" maxLength={200} value={reference} onChange={(e) => setReference(e.target.value)} placeholder={kind === 'bill' ? "The supplier's invoice number" : 'Optional'} />
          </div>
          {gst ? (
            <div className="field">
              <label htmlFor="doc-taxmode">Amounts</label>
              <select id="doc-taxmode" className="select" value={taxMode} onChange={(e) => setTaxMode(e.target.value as TaxMode)}>
                {(['exclusive', 'inclusive', 'none'] as TaxMode[]).map((m) => (
                  <option key={m} value={m}>
                    {TAX_MODE_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {outgoing ? (
            <div className="field">
              <label htmlFor="doc-discount">Discount on the whole {kind === 'invoice' ? 'invoice' : 'order'} (%)</label>
              <input id="doc-discount" className="input crm-num" inputMode="decimal" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
          ) : null}
          {kind === 'invoice' ? (
            <div className="field">
              <label htmlFor="doc-rep">Salesperson</label>
              <select id="doc-rep" className="select" value={salesRepId ?? ''} onChange={(e) => setSalesRepId(e.target.value || null)}>
                <option value="">Not shown</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {outgoing ? (
            <div className="field fin-span-3">
              <label htmlFor="doc-delivery">{kind === 'invoice' ? 'Delivery or site address (optional)' : 'Deliver to (optional)'}</label>
              <textarea id="doc-delivery" className="input" rows={2} maxLength={500} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
            </div>
          ) : null}
          {kind === 'invoice' && templateList.length > 1 ? (
            <div className="field">
              <label htmlFor="doc-template">Template</label>
              <select id="doc-template" className="select" value={templateId ?? ''} onChange={(e) => setTemplateId(e.target.value || null)}>
                <option value="">Default template</option>
                {templateList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                    {t.isDefault ? ' (default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </section>

      <section className="card card-pad">
        <h2 className="crm-subhead">Lines</h2>
        <LinesEditor lines={lines} setLines={setLines} priced={priced} gst={gst} direction={direction} extended={outgoing} tracking={anyTracking} defaults={{ accountId: contact?.defaultAccountId ?? null, taxCodeId: contact?.defaultTaxCodeId ?? null }} />
        <Totals priced={priced} gst={gst} discountBp={Number.isFinite(discountBp) ? discountBp : 0} />
        {kind !== 'purchase_order' ? <Hint>Every line needs an account before the document is approved: it decides where the amount goes in the ledger.</Hint> : null}
      </section>

      <section className="card card-pad">
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="doc-notes">{kind === 'invoice' ? 'Notes for the customer' : 'Notes'}</label>
            <textarea id="doc-notes" className="input" rows={3} maxLength={4000} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {kind === 'invoice' || kind === 'purchase_order' ? (
            <div className="field">
              <label htmlFor="doc-terms">Terms</label>
              <textarea id="doc-terms" className="input" rows={3} maxLength={2000} value={terms} onChange={(e) => setTerms(e.target.value)} placeholder={kind === 'invoice' ? 'For example: payment within 14 days' : ''} />
            </div>
          ) : null}
        </div>
      </section>

      <div className="row wrap">
        {keepsStatus ? (
          <>
            <button type="submit" className={`btn${approvedAlready || !approver ? ' primary' : ''}`} disabled={busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </button>
            {status === 'submitted' && approver ? (
              <button type="button" className="btn primary" disabled={busy} onClick={() => void save('approve')}>
                {kind === 'purchase_order' ? 'Save and approve' : 'Save and approve (post to the ledger)'}
              </button>
            ) : null}
          </>
        ) : (
          <>
            <button type="submit" className="btn" disabled={busy}>
              {busy ? 'Saving…' : 'Save as draft'}
            </button>
            {approver ? (
              <button type="button" className="btn primary" disabled={busy} onClick={() => void save('approve')}>
                {kind === 'purchase_order' ? 'Save and approve' : 'Save and approve (post to the ledger)'}
              </button>
            ) : (
              <button type="button" className="btn primary" disabled={busy} onClick={() => void save('submit')}>
                Save and submit for approval
              </button>
            )}
          </>
        )}
        <button type="button" className="btn ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
      </div>
      {outgoing ? <LivePreview path={fin(org.id, '/docs/preview')} body={kept.some((l) => l.lineKind === 'item') && priced.valid ? { kind, ...docBody(), ...(templateId ? { templateId } : {}), ...(number.trim() ? { number: number.trim() } : {}), ...(initial ? { docId: initial.id } : {}) } : null} label={DOC_LABELS[kind].one} /> : null}
    </form>
  );
}

// ------------------------------------------------------------------ view

function DocView({ doc: d, org, onEdit, reload }: { doc: DocDTO; org: FinOrgDTO; onEdit: () => void; reload: () => void }) {
  const kind = d.kind;
  const label = DOC_LABELS[kind];
  const perms = org.perms[moduleOf(kind)];
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const accounts = useAccounts().data ?? [];
  const taxCodes = useTaxCodes().data;
  const tracking = useHasTracking();
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [voiding, setVoiding] = useState<null | { type: 'doc' } | { type: 'payment'; payment: PaymentDTO }>(null);
  const [applying, setApplying] = useState(false);
  const contacts = useContacts().data ?? [];
  const refreshAll = useRefresh();
  // Credit the customer has not used yet, to apply to this invoice.
  const credits = useQuery({
    queryKey: ['fin', org.id, 'credit-notes', 'open', d.contactId],
    queryFn: () => get<{ rows: { id: string; number: string; remaining: number }[] }>(`${fin(org.id, '/credit-notes')}?status=open&contact=${d.contactId}`),
    enabled: kind === 'invoice' && !!d.contactId && d.can.pay,
  });
  const openCredits = (credits.data?.rows ?? []).filter((c) => c.remaining > 0);
  const livePayments = d.payments.filter((p) => !p.voided);
  const liveCredits = (d.credits ?? []).filter((c) => !c.removed).reduce((n, c) => n + c.amount, 0);
  const members = useMembers().data ?? [];
  const approver = mayApprove(org, kind);
  const run = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await fn();
      toast(done);
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const accountName = (id: string | null) => (id ? accountLabel(accounts.find((a) => a.id === id)) : '');
  const party = kind === 'expense_claim' ? d.claimantName : d.contactName;
  const editScope = perms.edit !== 'none';
  const pdfUrl = appUrl(`/api${fin(org.id, `/docs/${d.id}/pdf`)}`);
  const anyTracking = d.lines.some((l) => l.departmentId || l.projectId || l.costCentreId) && (tracking.department || tracking.project || tracking.cost_centre);
  const trackingNames = useTrackingNames();

  return (
    <div className="page crm-page">
      <PageHeader
        title={
          <span className="row wrap">
            {label.one} {d.number} <StatusBadge status={d.status} overdue={d.overdue} />
          </span>
        }
        icon={kind === 'invoice' ? 'doc' : 'file'}
        subtitle={
          <>
            <Link to={docPath(org.id, kind)}>{label.many}</Link>
            {party ? ` · ${party}` : ''}
          </>
        }
        actions={busy ? <Spinner /> : null}
      />
      {d.rejectedNote && d.status === 'draft' ? (
        <div className="error-box" role="status">
          Returned for changes: {d.rejectedNote}
        </div>
      ) : null}
      <div className="row wrap fin-toolbar">
        {d.can.edit ? (
          <button className="btn" onClick={onEdit} disabled={busy}>
            <Icon name="edit" /> Edit
          </button>
        ) : null}
        {d.status === 'draft' && d.can.edit && !d.can.approve ? (
          <button className="btn primary" disabled={busy} onClick={() => run(() => post(fin(org.id, `/docs/${d.id}/submit`)), 'Submitted for approval')}>
            Submit for approval
          </button>
        ) : null}
        {d.can.approve ? (
          <button className="btn primary" disabled={busy} onClick={() => run(() => post(fin(org.id, `/docs/${d.id}/approve`)), kind === 'purchase_order' ? 'Approved' : 'Approved and posted to the ledger')}>
            <Icon name="check" /> Approve
          </button>
        ) : null}
        {d.status === 'submitted' && perms.approve ? (
          <button className="btn" disabled={busy} onClick={() => setRejecting(true)}>
            Return for changes
          </button>
        ) : null}
        {d.can.pay ? (
          <button className="btn primary" disabled={busy} onClick={() => setPaying(true)}>
            <Icon name="dollar" /> Record a payment
          </button>
        ) : null}
        {kind === 'purchase_order' && d.status === 'approved' && org.perms.purchases.create ? (
          <button
            className="btn primary"
            disabled={busy}
            onClick={async () => {
              if (!(await confirm({ title: `Turn ${d.number} into a bill?`, message: 'A draft bill is created with the same supplier and lines, dated today. Check it against the supplier’s invoice, then approve it.', confirmLabel: 'Create the bill' }))) return;
              setBusy(true);
              try {
                const bill = await post<{ id: string; number: string }>(fin(org.id, `/docs/${d.id}/convert`));
                toast(`Draft bill ${bill.number} created`);
                reload();
                navigate(docPath(org.id, 'bill', bill.id));
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            Convert to bill
          </button>
        ) : null}
        {openCredits.length && d.can.pay ? (
          <button className="btn" disabled={busy} onClick={() => setApplying(true)}>
            Apply credit
          </button>
        ) : null}
        {d.can.share ? <ShareActions org={org} kind="invoice" id={d.id} online={d.online} customerEmail={contacts.find((c) => c.id === d.contactId)?.email ?? null} disabled={busy} onChange={reload} /> : null}
        {d.can.credit ? (
          <button className="btn" disabled={busy} onClick={() => navigate(`/o/${org.id}/credit-notes/new?invoice=${d.id}`)}>
            <Icon name="undo" /> Credit note
          </button>
        ) : null}
        <button className="btn" onClick={() => download(pdfUrl)}>
          <Icon name="download" /> PDF
        </button>
        {(kind === 'invoice' || kind === 'purchase_order') && editScope && ['approved', 'part_paid', 'paid'].includes(d.status) && !d.sentAt ? (
          <button className="btn" disabled={busy} onClick={() => run(() => post(fin(org.id, `/docs/${d.id}/sent`)), 'Marked as sent')}>
            <Icon name="mail" /> Mark as sent
          </button>
        ) : null}
        {d.can.void ? (
          <button
            className="btn danger"
            disabled={busy}
            onClick={() => {
              if (livePayments.length) {
                toast('Void its payments first: a document with payments cannot be voided.', 'error');
                return;
              }
              setVoiding({ type: 'doc' });
            }}
            title={livePayments.length ? 'Void its payments first' : undefined}
          >
            Void
          </button>
        ) : null}
        {d.can.delete ? (
          <button
            className="btn"
            disabled={busy}
            onClick={async () => {
              if (!(await confirm({ title: `Delete ${label.one.toLowerCase()} ${d.number}?`, message: 'Drafts and documents awaiting approval can be deleted. Nothing was posted to the ledger.', confirmLabel: 'Delete', danger: true }))) return;
              setBusy(true);
              try {
                await del(fin(org.id, `/docs/${d.id}`));
                toast('Deleted');
                reload();
                navigate(docPath(org.id, kind));
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            <Icon name="trash" /> Delete
          </button>
        ) : null}
      </div>

      <div className="fin-split">
        <div className="stack-lg">
          <section className="card card-pad">
            <dl className="fin-detail">
              <dt>{partyLabel(kind)}</dt>
              <dd>{kind === 'expense_claim' ? (d.claimantName ?? '') : d.contactId ? <Link to={`/o/${org.id}/contacts/${d.contactId}`}>{d.contactName}</Link> : <span className="muted">None</span>}</dd>
              {kind === 'expense_claim' && d.contactName ? (
                <>
                  <dt>Paid to</dt>
                  <dd>{d.contactName}</dd>
                </>
              ) : null}
              <dt>Date</dt>
              <dd>{longDate(d.issueDate)}</dd>
              <dt>{kind === 'purchase_order' ? 'Delivery by' : 'Due'}</dt>
              <dd>
                {d.dueDate ? longDate(d.dueDate) : <span className="muted">None</span>}
                {d.overdue ? <span className="badge danger"> Overdue</span> : null}
              </dd>
              {d.reference ? (
                <>
                  <dt>Reference</dt>
                  <dd>{d.reference}</dd>
                </>
              ) : null}
              {org.gst ? (
                <>
                  <dt>Amounts</dt>
                  <dd>{TAX_MODE_LABELS[d.taxMode]}</dd>
                </>
              ) : null}
              {d.quoteId ? (
                <>
                  <dt>From quote</dt>
                  <dd>
                    <Link to={`/o/${org.id}/quotes/${d.quoteId}`}>{d.quoteNumber ?? 'The quote'}</Link>
                    {d.quoteBp && d.quoteBp < 10_000 ? ` (${d.quoteBp / 100}% of it)` : ''}
                  </dd>
                </>
              ) : null}
              {d.deliveryAddress ? (
                <>
                  <dt>Delivery</dt>
                  <dd className="crm-text">{d.deliveryAddress}</dd>
                </>
              ) : null}
              {d.salesRepId ? (
                <>
                  <dt>Salesperson</dt>
                  <dd>{members.find((m) => m.userId === d.salesRepId)?.name ?? 'Former member'}</dd>
                </>
              ) : null}
              {d.sourceDocId ? (
                <>
                  <dt>From</dt>
                  <dd>
                    <Link to={docPath(org.id, 'purchase_order', d.sourceDocId)}>The purchase order{d.reference ? ` ${d.reference}` : ''}</Link>
                  </dd>
                </>
              ) : null}
              <dt>Created</dt>
              <dd>
                {d.createdByName ?? 'Former member'}, {dateTime(d.createdAt)}
              </dd>
              {d.approvedAt ? (
                <>
                  <dt>Approved</dt>
                  <dd>{dateTime(d.approvedAt)}</dd>
                </>
              ) : null}
              {d.sentAt ? (
                <>
                  <dt>Sent</dt>
                  <dd>
                    Sent {dateTime(d.sentAt)}
                    {d.online ? <span className="badge accent"> Online link active</span> : null}
                    {d.viewedAt ? <div className="muted small">First opened by the customer {dateTime(d.viewedAt)}</div> : null}
                  </dd>
                </>
              ) : null}
              {d.voidedAt ? (
                <>
                  <dt>Voided</dt>
                  <dd>{dateTime(d.voidedAt)}</dd>
                </>
              ) : null}
              <dt>Ledger</dt>
              <dd>{kind === 'purchase_order' ? 'Purchase orders are not posted.' : d.journalId ? (d.status === 'void' ? 'Posted, then reversed when voided.' : 'Posted.') : 'Not posted yet: it is posted when approved.'}</dd>
            </dl>
          </section>

          <section className="card">
            <div className="crm-table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="fin-num">Quantity</th>
                    <th className="fin-num">Unit price</th>
                    <th className="fin-num">Discount</th>
                    <th>Account</th>
                    {org.gst ? <th>GST</th> : null}
                    {anyTracking ? <th>Tracking</th> : null}
                    <th className="fin-num">Net</th>
                    {org.gst ? <th className="fin-num">GST</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {d.lines.map((l) =>
                    l.lineKind === 'heading' ? (
                      <tr key={l.id} className="fin-heading-row">
                        <td colSpan={9}>
                          <strong>{l.description}</strong>
                        </td>
                      </tr>
                    ) : (
                    <tr key={l.id}>
                      <td className="crm-text">
                        {l.itemCode ? <span className="mono small">{l.itemCode} </span> : null}
                        {l.description || <span className="muted">No description</span>}
                      </td>
                      <td className="fin-num">
                        {l.quantity}
                        {l.unit ? ` ${l.unit}` : ''}
                      </td>
                      <td className="fin-num">
                        <Money value={l.unitPrice} />
                      </td>
                      <td className="fin-num">{l.discountBp ? `${l.discountBp / 100}%` : ''}</td>
                      <td>{accountName(l.accountId) || <span className="muted">None</span>}</td>
                      {org.gst ? <td>{taxCodeName(taxCodes, l.taxCodeId) || <span className="muted">None</span>}</td> : null}
                      {anyTracking ? <td className="small">{[l.departmentId, l.projectId, l.costCentreId].map(trackingNames).filter(Boolean).join(', ')}</td> : null}
                      <td className="fin-num">
                        <Money value={l.net} />
                      </td>
                      {org.gst ? (
                        <td className="fin-num">
                          <Money value={l.tax} />
                        </td>
                      ) : null}
                    </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {d.notes || d.terms ? (
            <section className="card card-pad">
              {d.notes ? (
                <>
                  <h2 className="crm-subhead">Notes</h2>
                  <p className="crm-text">{d.notes}</p>
                </>
              ) : null}
              {d.terms ? (
                <>
                  <h2 className="crm-subhead">Terms</h2>
                  <p className="crm-text">{d.terms}</p>
                </>
              ) : null}
            </section>
          ) : null}
        </div>

        <div className="stack-lg">
          <section className="card card-pad">
            <dl className="fin-totals">
              {d.discountBp ? (
                <>
                  <dt>Discount</dt>
                  <dd>{d.discountBp / 100}% on every line</dd>
                </>
              ) : null}
              <dt>{org.gst && d.taxMode !== 'none' ? 'Subtotal (excluding GST)' : 'Subtotal'}</dt>
              <dd>
                <Money value={d.subtotal} />
              </dd>
              {org.gst ? (
                <>
                  <dt>GST</dt>
                  <dd>
                    <Money value={d.taxTotal} />
                  </dd>
                </>
              ) : null}
              <dt className="total">Total</dt>
              <dd className="total">
                <Money value={d.total} />
              </dd>
              {kind !== 'purchase_order' ? (
                <>
                  {kind === 'invoice' && liveCredits > 0 ? (
                    <>
                      <dt>Credited</dt>
                      <dd>
                        <Money value={liveCredits} />
                      </dd>
                    </>
                  ) : null}
                  <dt>{kind === 'invoice' ? 'Received' : 'Paid'}</dt>
                  <dd>
                    <Money value={d.amountPaid - (kind === 'invoice' ? liveCredits : 0)} />
                  </dd>
                  <dt className="total">{kind === 'invoice' ? 'Still to be received' : 'Still to be paid'}</dt>
                  <dd className="total">
                    <Money value={d.amountDue} />
                  </dd>
                </>
              ) : null}
            </dl>
          </section>

          {kind !== 'purchase_order' ? (
            <section className="card card-pad">
              <h2 className="crm-subhead">Payments</h2>
              {d.payments.length ? (
                <ul className="crm-mini-list">
                  {d.payments.map((p) => (
                    <li key={p.id}>
                      <Icon name="dollar" size={14} />
                      <div className="grow">
                        <div className="row">
                          <strong className="grow">
                            <Money value={p.amount} />
                          </strong>
                          {p.voided ? <span className="badge danger">Void</span> : p.reconciled ? <span className="badge success">Reconciled</span> : null}
                        </div>
                        <div className="muted small">
                          {shortDate(p.date)} · {p.accountName}
                          {p.reference ? ` · ${p.reference}` : ''}
                        </div>
                      </div>
                      {!p.voided && approver ? (
                        <button className="btn ghost sm" disabled={busy || p.reconciled} title={p.reconciled ? 'Reconciled: unmatch it on the bank account first' : undefined} onClick={() => setVoiding({ type: 'payment', payment: p })}>
                          Void
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">No payments recorded.</p>
              )}
              <p className="muted small">{PAYMENT_NOTE}</p>
            </section>
          ) : null}

          {kind === 'invoice' && d.credits?.length ? (
            <section className="card card-pad">
              <h2 className="crm-subhead">Credit applied</h2>
              <ul className="crm-mini-list">
                {d.credits.map((c) => (
                  <li key={c.id}>
                    <Icon name="undo" size={14} />
                    <div className="grow">
                      <Link to={`/o/${org.id}/credit-notes/${c.creditNoteId}`}>{c.creditNumber}</Link> {c.removed ? <span className="badge danger">Removed</span> : null}
                      <div className="muted small">
                        {shortDate(c.date)} · <Money value={c.amount} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <Attachments org={org} doc={d} />
        </div>
      </div>
      {kind === 'invoice' || kind === 'purchase_order' ? <DocumentFrame src={appUrl(`/api${fin(org.id, `/docs/${d.id}/pdf?inline=1`)}`)} label={label.one} stamp={`${d.status}-${d.amountPaid}-${d.total}`} /> : null}
      {applying ? (
        <ApplyCreditToInvoice
          org={org}
          doc={d}
          credits={openCredits}
          onClose={() => setApplying(false)}
          onDone={() => {
            setApplying(false);
            refreshAll();
            reload();
          }}
        />
      ) : null}

      {paying ? <PaymentDialog org={org} doc={d} onClose={() => setPaying(false)} onDone={() => { setPaying(false); reload(); }} /> : null}
      {rejecting ? <RejectDialog org={org} doc={d} onClose={() => setRejecting(false)} onDone={() => { setRejecting(false); reload(); }} /> : null}
      {voiding ? (
        <VoidDialog
          title={voiding.type === 'doc' ? `Void ${label.one.toLowerCase()} ${d.number}?` : `Void the payment of ${shortDate(voiding.payment.date)}?`}
          message={
            voiding.type === 'doc'
              ? d.journalId && d.status !== 'draft' && d.status !== 'submitted'
                ? 'Its entry in the ledger is reversed by a new entry; nothing is deleted. A voided document cannot be used again.'
                : 'Nothing was posted to the ledger. A voided document cannot be used again.'
              : 'The payment is reversed by a new entry in the ledger, and the amount is due again.'
          }
          posted={voiding.type === 'payment' || (!!d.journalId && d.status !== 'draft' && d.status !== 'submitted')}
          lockDate={org.lockDate}
          onClose={() => setVoiding(null)}
          onConfirm={async (date) => {
            const path = voiding.type === 'doc' ? `/docs/${d.id}/void` : `/docs/${d.id}/payments/${voiding.payment.id}/void`;
            await post(fin(org.id, path), { date: date || null });
            toast(voiding.type === 'doc' ? 'Voided' : 'Payment voided');
            setVoiding(null);
            reload();
          }}
        />
      ) : null}
    </div>
  );
}

/** Apply a customer's unused credit (from a credit note) to this invoice. */
function ApplyCreditToInvoice({ org, doc, credits, onClose, onDone }: { org: FinOrgDTO; doc: DocDTO; credits: { id: string; number: string; remaining: number }[]; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const { fmt } = useMoney();
  const [creditId, setCreditId] = useState(credits[0]?.id ?? '');
  const credit = credits.find((c) => c.id === creditId);
  const [amount, setAmount] = useState<number | null>(credit ? Math.min(credit.remaining, doc.amountDue) : null);
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={`Apply credit to ${doc.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy || !credit || !amount}
            onClick={async () => {
              setBusy(true);
              try {
                await post(fin(org.id, `/credit-notes/${creditId}/allocations`), { invoiceId: doc.id, amount });
                toast('Credit applied');
                onDone();
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            Apply
          </button>
        </>
      }
    >
      <div className="stack">
        <div className="field">
          <label htmlFor="aci-credit">Credit note</label>
          <select
            id="aci-credit"
            className="select"
            value={creditId}
            onChange={(e) => {
              setCreditId(e.target.value);
              const c = credits.find((x) => x.id === e.target.value);
              setAmount(c ? Math.min(c.remaining, doc.amountDue) : null);
            }}
          >
            {credits.map((c) => (
              <option key={c.id} value={c.id}>
                {c.number}: {fmt(c.remaining)} left
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="aci-amount">Amount</label>
          <MoneyInput id="aci-amount" value={amount} onChange={setAmount} />
          <span className="muted small">Still owed on this invoice: {fmt(doc.amountDue)}</span>
        </div>
        <Hint>Applying credit lowers what the invoice owes. Nothing new is posted: the credit note already reduced the customer’s balance.</Hint>
      </div>
    </Modal>
  );
}

function useTrackingNames() {
  const orgId = useCurrentOrg().id;
  const q = useQuery({ queryKey: ['fin', orgId, 'tracking'], queryFn: () => get<{ id: string; name: string; code: string }[]>(fin(orgId, '/tracking')), staleTime: 60_000 });
  return (id: string | null) => {
    if (!id) return '';
    const t = q.data?.find((x) => x.id === id);
    return t ? t.name : '';
  };
}

function PaymentDialog({ org, doc, onClose, onDone }: { org: FinOrgDTO; doc: DocDTO; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const { fmt } = useMoney();
  const [date, setDate] = useState(todayLocal());
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(doc.amountDue);
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!accountId) return toast('Choose the account the money went into or out of', 'error');
    if (!amount || amount <= 0) return toast('Enter the amount paid', 'error');
    if (amount > doc.amountDue) return toast(`The payment is more than the ${fmt(doc.amountDue)} still due`, 'error');
    setBusy(true);
    try {
      const r = await post<{ status: DocStatus }>(fin(org.id, `/docs/${doc.id}/payments`), { date, accountId, amount, reference: reference.trim() || undefined });
      toast(r.status === 'paid' ? 'Payment recorded: paid in full' : 'Part payment recorded');
      onDone();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={`Record a payment for ${doc.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" disabled={busy} onClick={submit}>
            {busy ? 'Recording…' : 'Record payment'}
          </button>
        </>
      }
    >
      <div className="stack">
        <Hint>{PAYMENT_NOTE}</Hint>
        <div className="field">
          <label htmlFor="pay-date">Date {doc.kind === 'invoice' ? 'received' : 'paid'}</label>
          <input id="pay-date" className="input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pay-account">{doc.kind === 'invoice' ? 'Received into' : 'Paid from'}</label>
          <AccountSelect id="pay-account" kind="money" value={accountId} onChange={setAccountId} emptyLabel="Choose a bank account, card or cash" required />
        </div>
        <div className="field">
          <label htmlFor="pay-amount">Amount</label>
          <MoneyInput id="pay-amount" value={amount} onChange={setAmount} />
          <span className="muted small">Still due: {fmt(doc.amountDue)}. A smaller amount records a part payment.</span>
        </div>
        <div className="field">
          <label htmlFor="pay-ref">Reference</label>
          <input id="pay-ref" className="input" maxLength={100} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optional, for example the bank reference" />
        </div>
      </div>
    </Modal>
  );
}

function RejectDialog({ org, doc, onClose, onDone }: { org: FinOrgDTO; doc: DocDTO; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={`Return ${doc.number} for changes`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy || !note.trim()}
            onClick={async () => {
              setBusy(true);
              try {
                await post(fin(org.id, `/docs/${doc.id}/reject`), { note: note.trim() });
                toast('Returned to its author as a draft');
                onDone();
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            Return
          </button>
        </>
      }
    >
      <div className="field">
        <label htmlFor="reject-note">What needs to change</label>
        <textarea id="reject-note" className="input" rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
        <span className="muted small">The person who created it is told, and it goes back to being a draft.</span>
      </div>
    </Modal>
  );
}

export function VoidDialog({ title, message, posted, lockDate, onClose, onConfirm }: { title: string; message: string; posted: boolean; lockDate: string | null; onClose: () => void; onConfirm: (date: string) => Promise<void> }) {
  const toast = useToast();
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [needsDate, setNeedsDate] = useState(false);
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn danger"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm(date);
              } catch (e) {
                if (e instanceof ApiError && (e.details as { code?: string } | undefined)?.code === 'PERIOD_LOCKED') setNeedsDate(true);
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Voiding…' : 'Void'}
          </button>
        </>
      }
    >
      <div className="stack">
        <p>{message}</p>
        {posted ? (
          <div className="field">
            <label htmlFor="void-date">Date of the reversal</label>
            <input id="void-date" className="input" type="date" min={lockDate ?? undefined} value={date} onChange={(e) => setDate(e.target.value)} />
            <span className={`small${needsDate ? ' warning-text' : ' muted'}`}>
              Leave empty to reverse on the original date.{lockDate ? ` The books are locked up to ${shortDate(lockDate)}: a reversal in a locked period needs a later date.` : ''}
            </span>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ attachments

function Attachments({ org, doc }: { org: FinOrgDTO; doc: DocDTO }) {
  const toast = useToast();
  const confirm = useConfirm();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const q = useQuery({ queryKey: ['fin', org.id, 'doc-files', doc.id], queryFn: () => get<{ files: FileDTO[] }>(`${fin(org.id, '/files')}?parentType=doc&parentId=${encodeURIComponent(doc.id)}`) });
  const perms = org.perms[moduleOf(doc.kind)];
  const canAdd = org.perms.documents.create && perms.edit !== 'none';
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.set('file', f);
        form.set('parentType', 'doc');
        form.set('parentId', doc.id);
        await api(fin(org.id, '/files'), { method: 'POST', form });
      }
      toast(files.length === 1 ? 'File attached' : `${files.length} files attached`);
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };
  const files = q.data?.files ?? [];
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">{doc.kind === 'invoice' ? 'Attachments' : 'Receipts and attachments'}</h2>
        {busy ? <Spinner /> : null}
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {files.length ? (
        <ul className="crm-mini-list">
          {files.map((f) => (
            <li key={f.id}>
              <Icon name="paperclip" size={14} />
              <div className="grow">
                <a href={appUrl(f.url)} rel="noopener">
                  {f.name}
                </a>
                <div className="muted small">
                  {formatBytes(f.size)} · {f.uploadedByName ?? 'Former member'} · {timeAgo(f.createdAt)}
                </div>
              </div>
              {canAdd ? (
                <button
                  className="btn ghost icon sm"
                  aria-label={`Remove ${f.name}`}
                  onClick={async () => {
                    if (!(await confirm({ title: `Remove ${f.name}?`, message: 'It is taken off this document. The audit history keeps a record that it was there.', confirmLabel: 'Remove', danger: true }))) return;
                    try {
                      await del(fin(org.id, `/files/${f.id}`));
                      q.refetch();
                    } catch (e) {
                      toast(errorMessage(e), 'error');
                    }
                  }}
                >
                  <Icon name="trash" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : q.data ? (
        <p className="muted small">No files attached.</p>
      ) : null}
      {canAdd ? (
        <div>
          <input ref={input} type="file" multiple className="sr-only" id={`attach-${doc.id}`} onChange={(e) => upload(e.target.files)} />
          <label htmlFor={`attach-${doc.id}`} className="btn sm">
            <Icon name="upload" /> Attach a file
          </label>
        </div>
      ) : null}
    </section>
  );
}
