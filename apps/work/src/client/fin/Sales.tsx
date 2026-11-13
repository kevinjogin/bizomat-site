// Quotes and credit notes (business workspaces), next to invoices in the Sales section.
//
// Quotes: the list with status tabs and totals; the editor with headings, optional lines, item codes, units, a
// whole-quote discount and the live preview (the PDF itself); the quote's page with sending (secure link, email or
// marked sent), the customer's answer, invoicing in full or in parts, versions as sent and the history.
// Credit notes: the list; the editor (from an invoice, or on its own) with the live preview; the page with approval
// (posting), applying credit to invoices, refunds and voids. Every figure that is kept comes from the server.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { useDebounced, usePageTitle } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { TAX_MODE_LABELS, type TaxMode } from '../../shared/fin/tax';
import { accountLabel, addDaysIso, appUrl, dateTime, download, fin, longDate, shortDate, todayLocal, useAccounts, useContacts, useCurrentOrg, useMembers, useMoney, useRefresh, useTaxCodes, type FinOrgDTO } from './lib';
import { AccountSelect, ContactSelect, Hint, Money, MoneyInput, Stat, StatusBadge, taxCodeName, useHasTracking } from './ui';
import { CustomerField, DocumentFrame, LinesEditor, LivePreview, ShareActions, Totals, blankLine, isEmptyLine, lineBody, lineFromDto, percentBpOf, priceLines, type SalesLine } from './sales-ui';
import { VoidDialog } from './Docs';

// ------------------------------------------------------------------ types

type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired' | 'converted' | 'cancelled';

interface LineDTO {
  id: string;
  lineKind: 'item' | 'heading';
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountBp: number;
  optional?: boolean;
  accountId: string | null;
  taxCodeId: string | null;
  net: number;
  tax: number;
  departmentId: string | null;
  projectId: string | null;
  costCentreId: string | null;
}

interface QuoteDTO {
  id: string;
  number: string;
  contactId: string | null;
  contactName: string | null;
  crmDealId: string | null;
  issueDate: string;
  expiryDate: string | null;
  reference: string;
  salesRepId: string | null;
  salesRepName: string | null;
  deliveryAddress: string;
  taxMode: TaxMode;
  discountBp: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  invoicedBp: number;
  status: QuoteStatus;
  version: number;
  templateId: string | null;
  notes: string;
  terms: string;
  online: boolean;
  sentAt: number | null;
  viewedAt: number | null;
  acceptedAt: number | null;
  acceptedName: string;
  acceptedOnline: boolean;
  declinedAt: number | null;
  declineReason: string;
  expiringSoon: boolean;
  createdByName: string | null;
  createdAt: number;
  updatedAt: number;
  lines: LineDTO[];
  events: { id: string; action: string; by: string; detail: Record<string, any>; at: number }[];
  versions: { version: number; at: number }[];
  invoices: { id: string; number: string; status: string; total: number; bp: number }[];
  can: { edit: boolean; send: boolean; respond: boolean; invoice: boolean; cancel: boolean; delete: boolean; duplicate: boolean };
}

interface CreditDTO {
  id: string;
  number: string;
  contactId: string;
  contactName: string | null;
  invoiceId: string | null;
  invoiceNumber: string | null;
  issueDate: string;
  reference: string;
  reason: string;
  taxMode: TaxMode;
  subtotal: number;
  taxTotal: number;
  total: number;
  allocated: number;
  refunded: number;
  remaining: number;
  status: 'draft' | 'approved' | 'applied' | 'void';
  templateId: string | null;
  notes: string;
  journalId: string | null;
  online: boolean;
  sentAt: number | null;
  viewedAt: number | null;
  createdByName: string | null;
  approvedAt: number | null;
  voidedAt: number | null;
  createdAt: number;
  lines: LineDTO[];
  allocations: { id: string; invoiceId: string; invoiceNumber: string; date: string; amount: number; removed: boolean }[];
  refunds: { id: string; accountId: string; accountName: string; date: string; amount: number; reference: string; voided: boolean }[];
  can: { edit: boolean; delete: boolean; approve: boolean; apply: boolean; void: boolean };
}

interface TemplateDTO {
  id: string;
  name: string;
  isDefault: boolean;
}

const quotePath = (orgId: string, id?: string) => `/o/${orgId}/quotes${id ? `/${id}` : ''}`;
const creditPath = (orgId: string, id?: string) => `/o/${orgId}/credit-notes${id ? `/${id}` : ''}`;
const mayApproveSales = (org: FinOrgDTO) => org.perms.sales.approve || (org.perms.sales.create && !org.settings.approvals.invoices);

const EVENT_TEXT: Record<string, string> = {
  created: 'Created',
  updated: 'Changed',
  revised: 'Changed after sending: a new version started',
  sent: 'Marked as sent',
  emailed: 'Emailed to the customer',
  link_created: 'Online link shared',
  link_withdrawn: 'Online link withdrawn',
  viewed: 'Opened by the customer',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
  cancelled: 'Cancelled',
  duplicated: 'Duplicated',
  invoiced: 'Invoiced',
  invoice_removed: 'An invoice from it was voided or deleted',
};

function BusinessOnly() {
  return (
    <div className="page crm-page">
      <EmptyState icon="doc" title="Sales documents are for business workspaces">
        Quotes, invoices and credit notes belong to business workspaces. Personal and household workspaces track money in and out with transactions.
      </EmptyState>
    </div>
  );
}

function NoAccess({ what }: { what: string }) {
  return (
    <div className="page crm-page">
      <EmptyState icon="lock" title={`You cannot see ${what}`}>
        Your role in this workspace does not include sales. An owner or administrator can change it.
      </EmptyState>
    </div>
  );
}

// ------------------------------------------------------------------ quotes: list

const QUOTE_TABS: { key: string; label: string }[] = [
  { key: '', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'draft', label: 'Drafts' },
  { key: 'won', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
  { key: 'expired', label: 'Expired' },
  { key: 'converted', label: 'Invoiced' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function QuoteList() {
  const org = useCurrentOrg();
  usePageTitle('Quotes');
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms.sales.view === 'none') return <NoAccess what="quotes" />;
  return <QuoteListInner org={org} />;
}

function QuoteListInner({ org }: { org: FinOrgDTO }) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  const contact = params.get('contact') ?? '';
  const [search, setSearch] = useState('');
  const q = useDebounced(search, 300);
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  const qs = new URLSearchParams();
  if (status) qs.set('status', status);
  if (q.trim()) qs.set('q', q.trim());
  if (contact) qs.set('contact', contact);
  const list = useQuery({ queryKey: ['fin', org.id, 'quotes', qs.toString()], queryFn: () => get<{ rows: QuoteDTO[]; totals: { open: number; openCount: number; won: number; wonCount: number; winRate: number | null } }>(`${fin(org.id, '/quotes')}?${qs}`), placeholderData: keepPreviousData });
  const rows = list.data?.rows ?? [];
  const totals = list.data?.totals;
  return (
    <div className="page crm-page">
      <PageHeader
        title="Quotes"
        icon="doc"
        subtitle="Price work for a customer, send it, and turn the accepted quote into invoices. A quote is never posted to the ledger."
        actions={
          <>
            {list.isFetching ? <Spinner /> : null}
            {org.perms.sales.export ? (
              <button
                className="btn"
                onClick={() => {
                  const e = new URLSearchParams(qs);
                  e.set('format', 'csv');
                  download(appUrl(`/api${fin(org.id, '/quotes')}?${e}`));
                }}
              >
                <Icon name="download" /> Export CSV
              </button>
            ) : null}
            {org.perms.sales.create ? (
              <button className="btn primary" onClick={() => navigate(`${quotePath(org.id, 'new')}${contact ? `?contact=${contact}` : ''}`)}>
                <Icon name="plus" /> New quote
              </button>
            ) : null}
          </>
        }
      />
      <nav className="crm-views" aria-label="Status">
        {QUOTE_TABS.map((t) => (
          <button key={t.key || 'all'} className={`tab${status === t.key ? ' active' : ''}`} aria-current={status === t.key ? 'true' : undefined} onClick={() => setParam('status', t.key)}>
            {t.label}
          </button>
        ))}
      </nav>
      {totals ? (
        <div className="crm-stats">
          <Stat label="Open quotes" value={<Money value={totals.open} />} hint={`${totals.openCount} draft, sent or viewed`} />
          <Stat label="Accepted" value={<Money value={totals.won} />} hint={`${totals.wonCount} accepted or invoiced`} tone="success" />
          <Stat label="Win rate" value={totals.winRate === null ? 'None yet' : `${totals.winRate}%`} hint="Accepted out of those answered" />
        </div>
      ) : null}
      <div className="row fin-toolbar">
        <div className="crm-search">
          <Icon name="search" />
          <input className="input" type="search" placeholder="Number, customer or reference" aria-label="Search quotes" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <ContactSelect value={contact || null} onChange={(v) => setParam('contact', v ?? '')} kind="customer" ariaLabel="Filter by customer" emptyLabel="Every customer" />
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {!list.data ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="doc" title="No quotes here" action={org.perms.sales.create && !status && !q ? <button className="btn primary" onClick={() => navigate(quotePath(org.id, 'new'))}>New quote</button> : undefined}>
          {status || q || contact ? 'Nothing matches these filters.' : 'Create the first one with “New quote”.'}
        </EmptyState>
      ) : (
        <div className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Valid until</th>
                  <th>Status</th>
                  <th className="fin-num">Total</th>
                  <th className="fin-num">Invoiced</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Link className="crm-primary" to={quotePath(org.id, d.id)}>
                        {d.number}
                      </Link>
                      {d.version > 1 ? <span className="muted small"> v{d.version}</span> : null}
                      {d.reference ? <div className="muted small">{d.reference}</div> : null}
                    </td>
                    <td>{d.contactName ?? <span className="muted">None</span>}</td>
                    <td>{shortDate(d.issueDate)}</td>
                    <td>
                      {d.expiryDate ? shortDate(d.expiryDate) : <span className="muted">None</span>}
                      {d.expiringSoon ? <span className="badge warning"> Soon</span> : null}
                    </td>
                    <td>
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="fin-num">
                      <Money value={d.total} />
                    </td>
                    <td className="fin-num">{d.invoicedBp ? `${d.invoicedBp / 100}%` : <span className="muted">None</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="muted small crm-pager">{rows.length === 500 ? 'The first 500 quotes. Narrow the filters to see others.' : rows.length === 1 ? '1 quote' : `${rows.length} quotes`}</div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ quotes: one quote

export function QuotePage() {
  const org = useCurrentOrg();
  const { id = '' } = useParams();
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms.sales.view === 'none') return <NoAccess what="quotes" />;
  return id === 'new' ? <NewQuote org={org} /> : <ExistingQuote key={id} org={org} id={id} />;
}

function NewQuote({ org }: { org: FinOrgDTO }) {
  usePageTitle('New quote');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  if (!org.perms.sales.create) return <NoAccess what="new quotes" />;
  return (
    <div className="page crm-page">
      <PageHeader title="New quote" icon="doc" subtitle={<Link to={quotePath(org.id)}>Quotes</Link>} />
      <QuoteEditor org={org} presetContact={params.get('contact')} onSaved={(id) => navigate(quotePath(org.id, id), { replace: true })} onCancel={() => navigate(quotePath(org.id))} />
    </div>
  );
}

function ExistingQuote({ org, id }: { org: FinOrgDTO; id: string }) {
  const q = useQuery({ queryKey: ['fin', org.id, 'quote', id], queryFn: () => get<QuoteDTO>(fin(org.id, `/quotes/${id}`)) });
  const [editing, setEditing] = useState(false);
  usePageTitle(q.data ? `Quote ${q.data.number}` : 'Quote');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  if (editing) {
    return (
      <div className="page crm-page">
        <PageHeader title={`Change quote ${q.data.number}`} icon="doc" subtitle={<Link to={quotePath(org.id)}>Quotes</Link>} />
        <QuoteEditor
          org={org}
          initial={q.data}
          onSaved={() => {
            setEditing(false);
            void q.refetch();
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }
  return <QuoteView org={org} quote={q.data} onEdit={() => setEditing(true)} reload={() => void q.refetch()} />;
}

function useTemplates(org: FinOrgDTO) {
  return useQuery({ queryKey: ['fin', org.id, 'templates'], queryFn: () => get<TemplateDTO[]>(fin(org.id, '/templates')), staleTime: 60_000 }).data ?? [];
}

function QuoteEditor({ org, initial, presetContact, onSaved, onCancel }: { org: FinOrgDTO; initial?: QuoteDTO; presetContact?: string | null; onSaved: (id: string) => void; onCancel: () => void }) {
  const toast = useToast();
  const refresh = useRefresh();
  const taxCodes = useTaxCodes().data;
  const members = useMembers().data ?? [];
  const templates = useTemplates(org);
  const contacts = useContacts().data ?? [];
  const gst = org.gst;
  const [contactId, setContactId] = useState<string | null>(initial?.contactId ?? presetContact ?? null);
  const [number, setNumber] = useState(initial?.number ?? '');
  const [issueDate, setIssueDate] = useState(initial?.issueDate ?? todayLocal());
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? addDaysIso(todayLocal(), 30));
  const [reference, setReference] = useState(initial?.reference ?? '');
  const [salesRepId, setSalesRepId] = useState<string | null>(initial?.salesRepId ?? null);
  const [deliveryAddress, setDeliveryAddress] = useState(initial?.deliveryAddress ?? '');
  const [taxMode, setTaxMode] = useState<TaxMode>(initial?.taxMode ?? (gst ? 'exclusive' : 'none'));
  const [discount, setDiscount] = useState(initial?.discountBp ? String(initial.discountBp / 100) : '');
  const [templateId, setTemplateId] = useState<string | null>(initial?.templateId ?? null);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [terms, setTerms] = useState(initial?.terms ?? '');
  const [lines, setLinesState] = useState<SalesLine[]>(() => (initial?.lines.length ? initial.lines.map(lineFromDto) : [blankLine()]));
  const [busy, setBusy] = useState(false);
  const setLines = (f: (ls: SalesLine[]) => SalesLine[]) => setLinesState(f);
  const contact = contacts.find((c) => c.id === contactId);
  const discountBp = percentBpOf(discount);
  const priced = useMemo(() => priceLines(lines, { gst, mode: taxMode, discountBp, taxCodes }), [lines, gst, taxMode, discountBp, taxCodes]);
  const kept = lines.filter((l) => !isEmptyLine(l));
  const body = {
    contactId,
    issueDate,
    expiryDate: expiryDate || null,
    reference: reference.trim(),
    salesRepId,
    deliveryAddress: deliveryAddress.trim(),
    taxMode: gst ? taxMode : 'none',
    discountBp: Number.isFinite(discountBp) ? discountBp : 0,
    templateId,
    notes,
    terms,
    lines: kept.map((l) => lineBody(l, gst, true)),
    ...(number.trim() ? { number: number.trim() } : {}),
  };
  const sentBefore = !!initial && initial.status !== 'draft';
  const save = async () => {
    if (!kept.some((l) => l.lineKind === 'item')) return toast('Add at least one line with a description or a price', 'error');
    if (!priced.valid) return toast('Check the quantities and discounts: use numbers, and discounts from 0 to 100%', 'error');
    setBusy(true);
    try {
      if (initial) {
        await patch(fin(org.id, `/quotes/${initial.id}`), body);
        toast(sentBefore ? `Saved as version ${initial.version + 1}, a draft: send it again when it is ready` : 'Saved');
        refresh('quotes', 'quote');
        onSaved(initial.id);
      } else {
        const r = await post<{ id: string; number: string }>(fin(org.id, '/quotes'), body);
        toast(`Quote ${r.number} saved as a draft`);
        refresh('quotes');
        onSaved(r.id);
      }
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const previewBody = kept.some((l) => l.lineKind === 'item') && priced.valid ? { ...body, ...(initial ? { quoteId: initial.id } : {}) } : null;
  return (
    <form
      className="fin-editor-split"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="stack-lg">
        {sentBefore ? <div className="warn-box">This quote was sent as version {initial!.version}. Saving keeps that version exactly as the customer saw it and starts version {initial!.version + 1} as a draft. The link you shared stops working until you send the new version.</div> : null}
        <section className="card card-pad">
          <div className="fin-form-grid">
            <div className="field fin-span-2">
              <label htmlFor="q-contact">Customer</label>
              <CustomerField org={org} id="q-contact" value={contactId} onChange={setContactId} />
            </div>
            <div className="field">
              <label htmlFor="q-number">Number</label>
              <input id="q-number" className="input" maxLength={40} value={number} onChange={(e) => setNumber(e.target.value)} placeholder={`Automatic (${org.settings.prefixes.quote}0001, …)`} />
            </div>
            <div className="field">
              <label htmlFor="q-date">Date</label>
              <input id="q-date" className="input" type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="q-expiry">Valid until</label>
              <input id="q-expiry" className="input" type="date" min={issueDate} value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="q-ref">Reference</label>
              <input id="q-ref" className="input" maxLength={200} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optional, for example the job name" />
            </div>
            <div className="field">
              <label htmlFor="q-rep">Salesperson</label>
              <select id="q-rep" className="select" value={salesRepId ?? ''} onChange={(e) => setSalesRepId(e.target.value || null)}>
                <option value="">Not shown</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            {gst ? (
              <div className="field">
                <label htmlFor="q-taxmode">Amounts</label>
                <select id="q-taxmode" className="select" value={taxMode} onChange={(e) => setTaxMode(e.target.value as TaxMode)}>
                  {(['exclusive', 'inclusive', 'none'] as TaxMode[]).map((m) => (
                    <option key={m} value={m}>
                      {TAX_MODE_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="q-discount">Discount on the whole quote (%)</label>
              <input id="q-discount" className="input crm-num" inputMode="decimal" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            {templates.length > 1 ? (
              <div className="field">
                <label htmlFor="q-template">Template</label>
                <select id="q-template" className="select" value={templateId ?? ''} onChange={(e) => setTemplateId(e.target.value || null)}>
                  <option value="">Default template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="field fin-span-3">
              <label htmlFor="q-delivery">Delivery or site address (optional)</label>
              <textarea id="q-delivery" className="input" rows={2} maxLength={500} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder={contact?.address ? `Billing address: ${contact.address}` : 'Where the work is done or goods are delivered, if not the billing address'} />
            </div>
          </div>
        </section>

        <section className="card card-pad">
          <h2 className="crm-subhead">Lines</h2>
          <LinesEditor lines={lines} setLines={setLines} priced={priced} gst={gst} direction="sales" extended allowOptional tracking={false} defaults={{ accountId: contact?.defaultAccountId ?? null, taxCodeId: contact?.defaultTaxCodeId ?? null }} />
          <Totals priced={priced} gst={gst} discountBp={Number.isFinite(discountBp) ? discountBp : 0} />
          <Hint>Optional lines show their price in brackets and are not in the total. Accounts are optional on a quote; the invoice made from it uses the default sales account for lines without one.</Hint>
        </section>

        <section className="card card-pad">
          <div className="crm-form-grid">
            <div className="field">
              <label htmlFor="q-notes">Notes for the customer</label>
              <textarea id="q-notes" className="input" rows={3} maxLength={4000} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="q-terms">Terms</label>
              <textarea id="q-terms" className="input" rows={3} maxLength={4000} value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Leave empty to use the template’s quote terms" />
            </div>
          </div>
        </section>

        <div className="row wrap">
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Saving…' : sentBefore ? `Save as version ${initial!.version + 1}` : 'Save'}
          </button>
          <button type="button" className="btn ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
      <LivePreview path={fin(org.id, '/quotes/preview')} body={previewBody} label="Quote" />
    </form>
  );
}

function QuoteView({ org, quote: d, onEdit, reload }: { org: FinOrgDTO; quote: QuoteDTO; onEdit: () => void; reload: () => void }) {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const accounts = useAccounts().data ?? [];
  const taxCodes = useTaxCodes().data;
  const contacts = useContacts().data ?? [];
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<null | 'accept' | 'decline' | 'invoice'>(null);
  const run = async (fn: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try {
      await fn();
      toast(done);
      refresh('quotes');
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const customerEmail = contacts.find((c) => c.id === d.contactId)?.email ?? null;
  const pdf = appUrl(`/api${fin(org.id, `/quotes/${d.id}/pdf`)}`);
  return (
    <div className="page crm-page">
      <PageHeader
        title={
          <span className="row wrap">
            Quote {d.number} <StatusBadge status={d.status} />
            {d.version > 1 ? <span className="badge">Version {d.version}</span> : null}
          </span>
        }
        icon="doc"
        subtitle={
          <>
            <Link to={quotePath(org.id)}>Quotes</Link>
            {d.contactName ? ` · ${d.contactName}` : ''}
          </>
        }
        actions={busy ? <Spinner /> : null}
      />
      <div className="row wrap fin-toolbar">
        {d.can.edit ? (
          <button className="btn" onClick={onEdit} disabled={busy}>
            <Icon name="edit" /> Edit
          </button>
        ) : null}
        {d.can.send && d.status === 'draft' ? (
          <button className="btn" disabled={busy || !d.contactId} title={!d.contactId ? 'Choose the customer first' : undefined} onClick={() => run(() => post(fin(org.id, `/quotes/${d.id}/sent`)), 'Marked as sent')}>
            <Icon name="check" /> Mark as sent
          </button>
        ) : null}
        {d.can.send ? <ShareActions org={org} kind="quote" id={d.id} online={d.online} customerEmail={customerEmail} disabled={busy || !d.contactId} onChange={() => { refresh('quotes'); reload(); }} /> : null}
        {d.can.respond ? (
          <>
            <button className="btn primary" disabled={busy} onClick={() => setDialog('accept')}>
              <Icon name="check" /> Record acceptance
            </button>
            {d.status !== 'declined' ? (
              <button className="btn" disabled={busy} onClick={() => setDialog('decline')}>
                Record a decline
              </button>
            ) : null}
          </>
        ) : null}
        {d.can.invoice ? (
          <button className="btn primary" disabled={busy} onClick={() => setDialog('invoice')}>
            <Icon name="doc" /> {d.invoicedBp ? 'Invoice the rest' : 'Create invoice'}
          </button>
        ) : null}
        <button className="btn" onClick={() => download(pdf)}>
          <Icon name="download" /> PDF
        </button>
        {d.can.duplicate ? (
          <button className="btn" disabled={busy} onClick={async () => {
            setBusy(true);
            try {
              const r = await post<{ id: string; number: string }>(fin(org.id, `/quotes/${d.id}/duplicate`));
              toast(`Quote ${r.number} made as a draft`);
              refresh('quotes');
              navigate(quotePath(org.id, r.id));
            } catch (e) {
              toast(errorMessage(e), 'error');
            } finally {
              setBusy(false);
            }
          }}>
            <Icon name="copy" /> Duplicate
          </button>
        ) : null}
        {d.can.cancel ? (
          <button className="btn danger" disabled={busy} onClick={async () => {
            if (!(await confirm({ title: `Cancel quote ${d.number}?`, message: 'The customer can no longer accept it and its online link stops working. It stays in the list as cancelled.', confirmLabel: 'Cancel the quote', danger: true }))) return;
            await run(() => post(fin(org.id, `/quotes/${d.id}/cancel`)), 'Cancelled');
          }}>
            Cancel quote
          </button>
        ) : null}
        {d.can.delete ? (
          <button className="btn" disabled={busy} onClick={async () => {
            if (!(await confirm({ title: `Delete quote ${d.number}?`, message: 'It was never sent, so it can be deleted.', confirmLabel: 'Delete', danger: true }))) return;
            setBusy(true);
            try {
              await del(fin(org.id, `/quotes/${d.id}`));
              toast('Deleted');
              refresh('quotes');
              navigate(quotePath(org.id));
            } catch (e) {
              toast(errorMessage(e), 'error');
            } finally {
              setBusy(false);
            }
          }}>
            <Icon name="trash" /> Delete
          </button>
        ) : null}
      </div>

      {d.status === 'accepted' || d.status === 'converted' ? (
        <div className="ok-box">
          Accepted by {d.acceptedName}
          {d.acceptedOnline ? ' online' : ' (recorded by a member)'} on {dateTime(d.acceptedAt)}.
          {d.invoicedBp ? ` ${d.invoicedBp / 100}% invoiced.` : ' Not invoiced yet.'}
        </div>
      ) : null}
      {d.status === 'declined' ? <div className="warn-box">Declined {dateTime(d.declinedAt)}{d.declineReason ? `: ${d.declineReason}` : '.'}</div> : null}

      <div className="fin-split">
        <div className="stack-lg">
          <section className="card card-pad">
            <dl className="fin-detail">
              <dt>Customer</dt>
              <dd>{d.contactId ? <Link to={`/o/${org.id}/contacts/${d.contactId}`}>{d.contactName}</Link> : <span className="muted">None yet</span>}</dd>
              <dt>Date</dt>
              <dd>{longDate(d.issueDate)}</dd>
              <dt>Valid until</dt>
              <dd>
                {d.expiryDate ? longDate(d.expiryDate) : <span className="muted">No expiry</span>}
                {d.expiringSoon ? <span className="badge warning"> Expires soon</span> : null}
              </dd>
              {d.reference ? (
                <>
                  <dt>Reference</dt>
                  <dd>{d.reference}</dd>
                </>
              ) : null}
              {d.salesRepName ? (
                <>
                  <dt>Salesperson</dt>
                  <dd>{d.salesRepName}</dd>
                </>
              ) : null}
              {d.deliveryAddress ? (
                <>
                  <dt>Delivery</dt>
                  <dd className="crm-text">{d.deliveryAddress}</dd>
                </>
              ) : null}
              {org.gst ? (
                <>
                  <dt>Amounts</dt>
                  <dd>{TAX_MODE_LABELS[d.taxMode]}</dd>
                </>
              ) : null}
              {d.crmDealId ? (
                <>
                  <dt>CRM</dt>
                  <dd>Made for a deal in the CRM; its progress shows on the deal.</dd>
                </>
              ) : null}
              <dt>Sent</dt>
              <dd>{d.sentAt ? dateTime(d.sentAt) : <span className="muted">Not yet</span>}{d.online ? <span className="badge accent"> Online link active</span> : null}</dd>
              {d.viewedAt ? (
                <>
                  <dt>Opened</dt>
                  <dd>First opened by the customer {dateTime(d.viewedAt)}</dd>
                </>
              ) : null}
              <dt>Created</dt>
              <dd>
                {d.createdByName ?? 'Former member'}, {dateTime(d.createdAt)}
              </dd>
              <dt>Ledger</dt>
              <dd>Quotes are not posted. Invoices made from it are posted when approved.</dd>
            </dl>
          </section>
          <LinesTable org={org} lines={d.lines} accounts={accounts} taxCodes={taxCodes} />
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
          <DocumentFrame src={appUrl(`/api${fin(org.id, `/quotes/${d.id}/pdf?inline=1`)}`)} label="Quote" stamp={d.updatedAt} />
        </div>
        <div className="stack-lg">
          <section className="card card-pad">
            <dl className="fin-totals">
              {d.discountBp ? (
                <>
                  <dt>Discount {d.discountBp / 100}%</dt>
                  <dd>
                    <Money value={-d.discountTotal} />
                  </dd>
                </>
              ) : null}
              <dt>{org.gst && d.taxMode !== 'none' ? 'Net (excluding GST)' : 'Subtotal'}</dt>
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
            </dl>
          </section>
          <section className="card card-pad">
            <h2 className="crm-subhead">Invoices from this quote</h2>
            {d.invoices.length ? (
              <ul className="crm-mini-list">
                {d.invoices.map((i) => (
                  <li key={i.id}>
                    <Icon name="doc" size={14} />
                    <div className="grow">
                      <Link to={`/o/${org.id}/invoices/${i.id}`}>{i.number}</Link> <StatusBadge status={i.status} />
                      <div className="muted small">
                        {i.bp ? `${i.bp / 100}% of the quote · ` : ''}
                        <Money value={i.total} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">None yet. An accepted quote becomes a draft invoice, in full or in parts.</p>
            )}
          </section>
          <section className="card card-pad">
            <h2 className="crm-subhead">Versions sent</h2>
            {d.versions.length ? (
              <ul className="crm-mini-list">
                {d.versions.map((v) => (
                  <li key={v.version}>
                    <Icon name="file" size={14} />
                    <div className="grow">
                      Version {v.version}
                      <div className="muted small">{dateTime(v.at)}</div>
                    </div>
                    <button className="btn ghost sm" onClick={() => download(appUrl(`/api${fin(org.id, `/quotes/${d.id}/versions/${v.version}/pdf`)}`))}>
                      <Icon name="download" /> PDF
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">Nothing sent yet. Each version is kept exactly as it was sent.</p>
            )}
          </section>
          <section className="card card-pad">
            <h2 className="crm-subhead">History</h2>
            <ul className="crm-mini-list">
              {d.events.map((e) => (
                <li key={e.id}>
                  <Icon name="history" size={14} />
                  <div className="grow">
                    {EVENT_TEXT[e.action] ?? e.action}
                    {e.action === 'invoiced' && e.detail.number ? ` as ${e.detail.number}${e.detail.bp && e.detail.bp < 10_000 ? ` (${e.detail.bp / 100}%)` : ''}` : ''}
                    <div className="muted small">
                      {e.by ? `${e.by} · ` : e.action === 'viewed' ? 'The customer · ' : ''}
                      {dateTime(e.at)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {dialog === 'accept' ? <AcceptDialog org={org} quote={d} onClose={() => setDialog(null)} onDone={() => { setDialog(null); refresh('quotes'); reload(); }} /> : null}
      {dialog === 'decline' ? <DeclineDialog org={org} quote={d} onClose={() => setDialog(null)} onDone={() => { setDialog(null); refresh('quotes'); reload(); }} /> : null}
      {dialog === 'invoice' ? (
        <InvoiceQuoteDialog
          org={org}
          quote={d}
          onClose={() => setDialog(null)}
          onDone={(invoiceId) => {
            setDialog(null);
            refresh();
            navigate(`/o/${org.id}/invoices/${invoiceId}`);
          }}
        />
      ) : null}
    </div>
  );
}

function LinesTable({ org, lines, accounts, taxCodes }: { org: FinOrgDTO; lines: LineDTO[]; accounts: ReturnType<typeof useAccounts>['data']; taxCodes: ReturnType<typeof useTaxCodes>['data'] }) {
  const accountName = (id: string | null) => (id ? accountLabel((accounts ?? []).find((a) => a.id === id)) : '');
  const extended = lines.some((l) => l.itemCode || l.unit);
  return (
    <section className="card">
      <div className="crm-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {extended ? <th>Code</th> : null}
              <th>Description</th>
              <th className="fin-num">Quantity</th>
              {extended ? <th>Unit</th> : null}
              <th className="fin-num">Unit price</th>
              <th className="fin-num">Discount</th>
              <th>Account</th>
              {org.gst ? <th>GST</th> : null}
              <th className="fin-num">Net</th>
              {org.gst ? <th className="fin-num">GST</th> : null}
            </tr>
          </thead>
          <tbody>
            {lines.map((l) =>
              l.lineKind === 'heading' ? (
                <tr key={l.id} className="fin-heading-row">
                  <td colSpan={8 + (extended ? 2 : 0)}>
                    <strong>{l.description}</strong>
                  </td>
                </tr>
              ) : (
                <tr key={l.id} className={l.optional ? 'fin-optional-row' : undefined}>
                  {extended ? <td>{l.itemCode}</td> : null}
                  <td className="crm-text">
                    {l.description || <span className="muted">No description</span>}
                    {l.optional ? <span className="badge"> Optional</span> : null}
                  </td>
                  <td className="fin-num">{l.quantity}</td>
                  {extended ? <td>{l.unit}</td> : null}
                  <td className="fin-num">
                    <Money value={l.unitPrice} />
                  </td>
                  <td className="fin-num">{l.discountBp ? `${l.discountBp / 100}%` : ''}</td>
                  <td>{accountName(l.accountId) || <span className="muted">None</span>}</td>
                  {org.gst ? <td>{taxCodeName(taxCodes, l.taxCodeId) || <span className="muted">None</span>}</td> : null}
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
  );
}

function AcceptDialog({ org, quote, onClose, onDone }: { org: FinOrgDTO; quote: QuoteDTO; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={`Record acceptance of ${quote.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy || name.trim().length < 2}
            onClick={async () => {
              setBusy(true);
              try {
                await post(fin(org.id, `/quotes/${quote.id}/accept`), { name: name.trim() });
                toast('Acceptance recorded');
                onDone();
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            Record acceptance
          </button>
        </>
      }
    >
      <p>Use this when the customer accepted in person, by signature or by email. Customers can also accept through the online link themselves.</p>
      <div className="field">
        <label htmlFor="acc-name">Name of the person who accepted</label>
        <input id="acc-name" className="input" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <p className="muted small">Version {quote.version} is kept exactly as it was accepted.</p>
    </Modal>
  );
}

function DeclineDialog({ org, quote, onClose, onDone }: { org: FinOrgDTO; quote: QuoteDTO; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={`Record that ${quote.number} was declined`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await post(fin(org.id, `/quotes/${quote.id}/decline`), { reason: reason.trim() || undefined });
                toast('Recorded as declined');
                onDone();
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            Record decline
          </button>
        </>
      }
    >
      <div className="field">
        <label htmlFor="dec-reason">Reason (optional)</label>
        <textarea id="dec-reason" className="input" rows={3} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <p className="muted small">A declined quote can still be changed into a new version and sent again.</p>
    </Modal>
  );
}

function InvoiceQuoteDialog({ org, quote, onClose, onDone }: { org: FinOrgDTO; quote: QuoteDTO; onClose: () => void; onDone: (invoiceId: string) => void }) {
  const toast = useToast();
  const { fmt } = useMoney();
  const left = 10_000 - quote.invoicedBp;
  const [mode, setMode] = useState<'rest' | 'part'>('rest');
  const [percent, setPercent] = useState('');
  const optional = quote.lines.filter((l) => l.optional);
  const [chosen, setChosen] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const p = Number(percent.replace('%', '').replace(',', '.'));
  const valid = mode === 'rest' || (Number.isFinite(p) && p >= 0.01 && p * 100 <= left);
  return (
    <Modal
      title={`Invoice quote ${quote.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy || !valid}
            onClick={async () => {
              setBusy(true);
              try {
                const r = await post<{ id: string; number: string }>(fin(org.id, `/quotes/${quote.id}/invoice`), { ...(mode === 'part' ? { percent: p } : {}), optionalLineIds: chosen });
                toast(`Draft invoice ${r.number} created`);
                onDone(r.id);
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Creating…' : 'Create the draft invoice'}
          </button>
        </>
      }
    >
      <div className="stack">
        <label className="row">
          <input type="radio" name="inv-mode" checked={mode === 'rest'} onChange={() => setMode('rest')} />
          {quote.invoicedBp ? `The rest: ${left / 100}% of the quote` : `All of it: ${fmt(quote.total)}`}
        </label>
        <label className="row">
          <input type="radio" name="inv-mode" checked={mode === 'part'} onChange={() => setMode('part')} />
          A part (progress invoice)
        </label>
        {mode === 'part' ? (
          <div className="field">
            <label htmlFor="inv-pct">Percentage of the whole quote</label>
            <input id="inv-pct" className="input crm-num" inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} placeholder={`Up to ${left / 100}`} />
            {Number.isFinite(p) && p > 0 ? <span className="muted small">About {fmt(Math.round((quote.total * p) / 100))}. Every line is invoiced at this share; the parts’ amounts add up to the quote exactly, with GST worked out on each invoice.</span> : null}
          </div>
        ) : null}
        {optional.length ? (
          <fieldset className="field">
            <legend>Optional lines the customer took</legend>
            {optional.map((l) => (
              <label key={l.id} className="row">
                <input type="checkbox" checked={chosen.includes(l.id)} onChange={(e) => setChosen(e.target.checked ? [...chosen, l.id] : chosen.filter((x) => x !== l.id))} />
                {l.description || l.itemCode}
              </label>
            ))}
          </fieldset>
        ) : null}
        <Hint>The invoice is a draft: check it, then approve it to post it to the ledger. Voiding or deleting it gives its share back to the quote.</Hint>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ credit notes: list

const CREDIT_TABS = [
  { key: '', label: 'All' },
  { key: 'draft', label: 'Drafts' },
  { key: 'open', label: 'Credit left' },
  { key: 'applied', label: 'Used' },
  { key: 'void', label: 'Void' },
];

export function CreditList() {
  const org = useCurrentOrg();
  usePageTitle('Credit notes');
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms.sales.view === 'none') return <NoAccess what="credit notes" />;
  return <CreditListInner org={org} />;
}

function CreditListInner({ org }: { org: FinOrgDTO }) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  const contact = params.get('contact') ?? '';
  const [search, setSearch] = useState('');
  const q = useDebounced(search, 300);
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  const qs = new URLSearchParams();
  if (status) qs.set('status', status);
  if (q.trim()) qs.set('q', q.trim());
  if (contact) qs.set('contact', contact);
  const list = useQuery({ queryKey: ['fin', org.id, 'credit-notes', qs.toString()], queryFn: () => get<{ rows: CreditDTO[]; totals: { total: number; remaining: number } }>(`${fin(org.id, '/credit-notes')}?${qs}`), placeholderData: keepPreviousData });
  const rows = list.data?.rows ?? [];
  return (
    <div className="page crm-page">
      <PageHeader
        title="Credit notes"
        icon="doc"
        subtitle="Credit a customer for returns, corrections or goodwill. Approving one posts it; its credit is applied to invoices or paid back."
        actions={
          <>
            {list.isFetching ? <Spinner /> : null}
            {org.perms.sales.export ? (
              <button
                className="btn"
                onClick={() => {
                  const e = new URLSearchParams(qs);
                  e.set('format', 'csv');
                  download(appUrl(`/api${fin(org.id, '/credit-notes')}?${e}`));
                }}
              >
                <Icon name="download" /> Export CSV
              </button>
            ) : null}
            {org.perms.sales.create ? (
              <button className="btn primary" onClick={() => navigate(creditPath(org.id, 'new'))}>
                <Icon name="plus" /> New credit note
              </button>
            ) : null}
          </>
        }
      />
      <nav className="crm-views" aria-label="Status">
        {CREDIT_TABS.map((t) => (
          <button key={t.key || 'all'} className={`tab${status === t.key ? ' active' : ''}`} aria-current={status === t.key ? 'true' : undefined} onClick={() => setParam('status', t.key)}>
            {t.label}
          </button>
        ))}
      </nav>
      {list.data ? (
        <div className="crm-stats">
          <Stat label="Credited in this list" value={<Money value={list.data.totals.total} />} hint="Approved credit notes" />
          <Stat label="Credit not used yet" value={<Money value={list.data.totals.remaining} />} hint="To apply to invoices or pay back" />
        </div>
      ) : null}
      <div className="row fin-toolbar">
        <div className="crm-search">
          <Icon name="search" />
          <input className="input" type="search" placeholder="Number, customer or reference" aria-label="Search credit notes" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <ContactSelect value={contact || null} onChange={(v) => setParam('contact', v ?? '')} kind="customer" ariaLabel="Filter by customer" emptyLabel="Every customer" />
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {!list.data ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="doc" title="No credit notes here">
          {status || q || contact ? 'Nothing matches these filters.' : 'Create one from an invoice (“Credit note” on the invoice) or with “New credit note”.'}
        </EmptyState>
      ) : (
        <div className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>For invoice</th>
                  <th>Status</th>
                  <th className="fin-num">Total</th>
                  <th className="fin-num">Credit left</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Link className="crm-primary" to={creditPath(org.id, d.id)}>
                        {d.number}
                      </Link>
                      {d.reason ? <div className="muted small">{d.reason}</div> : null}
                    </td>
                    <td>{d.contactName}</td>
                    <td>{shortDate(d.issueDate)}</td>
                    <td>{d.invoiceId ? <Link to={`/o/${org.id}/invoices/${d.invoiceId}`}>{d.invoiceNumber}</Link> : <span className="muted">None</span>}</td>
                    <td>
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="fin-num">
                      <Money value={d.total} />
                    </td>
                    <td className="fin-num">{d.status === 'draft' || d.status === 'void' ? <span className="muted">None</span> : <Money value={d.remaining} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ credit notes: one credit note

export function CreditPage() {
  const org = useCurrentOrg();
  const { id = '' } = useParams();
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms.sales.view === 'none') return <NoAccess what="credit notes" />;
  return id === 'new' ? <NewCredit org={org} /> : <ExistingCredit key={id} org={org} id={id} />;
}

interface CreditDraft {
  contactId: string | null;
  invoiceId: string | null;
  issueDate: string;
  reference: string;
  reason?: string;
  taxMode: TaxMode;
  templateId: string | null;
  lines: Parameters<typeof lineFromDto>[0][];
}

function NewCredit({ org }: { org: FinOrgDTO }) {
  usePageTitle('New credit note');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const invoice = params.get('invoice');
  const from = useQuery({ queryKey: ['fin', org.id, 'credit-from', invoice], queryFn: () => get<CreditDraft>(fin(org.id, `/credit-notes/from-invoice/${invoice}`)), enabled: !!invoice });
  if (!org.perms.sales.create) return <NoAccess what="new credit notes" />;
  if (invoice && from.error) return <ErrorBox error={from.error} retry={() => from.refetch()} />;
  if (invoice && !from.data) return <Loading />;
  return (
    <div className="page crm-page">
      <PageHeader title="New credit note" icon="doc" subtitle={<Link to={creditPath(org.id)}>Credit notes</Link>} />
      <CreditEditor org={org} draft={from.data ?? null} presetContact={params.get('contact')} onSaved={(id) => navigate(creditPath(org.id, id), { replace: true })} onCancel={() => navigate(-1)} />
    </div>
  );
}

function ExistingCredit({ org, id }: { org: FinOrgDTO; id: string }) {
  const q = useQuery({ queryKey: ['fin', org.id, 'credit-note', id], queryFn: () => get<CreditDTO>(fin(org.id, `/credit-notes/${id}`)) });
  const [editing, setEditing] = useState(false);
  usePageTitle(q.data ? `Credit note ${q.data.number}` : 'Credit note');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  if (editing) {
    return (
      <div className="page crm-page">
        <PageHeader title={`Change credit note ${q.data.number}`} icon="doc" subtitle={<Link to={creditPath(org.id)}>Credit notes</Link>} />
        <CreditEditor
          org={org}
          initial={q.data}
          draft={null}
          onSaved={() => {
            setEditing(false);
            void q.refetch();
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }
  return <CreditView org={org} note={q.data} onEdit={() => setEditing(true)} reload={() => void q.refetch()} />;
}

function CreditEditor({ org, initial, draft, presetContact, onSaved, onCancel }: { org: FinOrgDTO; initial?: CreditDTO; draft: CreditDraft | null; presetContact?: string | null; onSaved: (id: string) => void; onCancel: () => void }) {
  const toast = useToast();
  const refresh = useRefresh();
  const taxCodes = useTaxCodes().data;
  const templates = useTemplates(org);
  const tracking = useHasTracking();
  const gst = org.gst;
  const src = initial ?? draft;
  const [contactId, setContactId] = useState<string | null>(src?.contactId ?? presetContact ?? null);
  const [invoiceId, setInvoiceId] = useState<string | null>(src?.invoiceId ?? null);
  const [number, setNumber] = useState(initial?.number ?? '');
  const [issueDate, setIssueDate] = useState(src?.issueDate ?? todayLocal());
  const [reference, setReference] = useState(src?.reference ?? '');
  const [reason, setReason] = useState(src?.reason ?? '');
  const [taxMode, setTaxMode] = useState<TaxMode>(src?.taxMode ?? (gst ? 'exclusive' : 'none'));
  const [templateId, setTemplateId] = useState<string | null>(src?.templateId ?? null);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [lines, setLinesState] = useState<SalesLine[]>(() => (src?.lines.length ? src.lines.map(lineFromDto) : [blankLine()]));
  const [busy, setBusy] = useState(false);
  const invoices = useQuery({
    queryKey: ['fin', org.id, 'docs', 'credit-invoices', contactId],
    queryFn: () => get<{ rows: { id: string; number: string; status: string; total: number; issueDate: string }[] }>(`${fin(org.id, '/docs')}?kind=invoice&contact=${contactId}`),
    enabled: !!contactId,
  });
  const invoiceChoices = (invoices.data?.rows ?? []).filter((i) => ['approved', 'part_paid', 'paid'].includes(i.status));
  const priced = useMemo(() => priceLines(lines, { gst, mode: taxMode, discountBp: 0, taxCodes }), [lines, gst, taxMode, taxCodes]);
  const kept = lines.filter((l) => !isEmptyLine(l));
  const approver = mayApproveSales(org);
  const body = {
    contactId,
    invoiceId,
    issueDate,
    reference: reference.trim(),
    reason: reason.trim(),
    taxMode: gst ? taxMode : 'none',
    templateId,
    notes,
    lines: kept.map((l) => lineBody(l, gst, false)),
    ...(number.trim() ? { number: number.trim() } : {}),
  };
  const save = async (approve: boolean) => {
    if (!contactId) return toast('Choose the customer', 'error');
    if (!kept.some((l) => l.lineKind === 'item')) return toast('Add at least one line', 'error');
    if (!priced.valid) return toast('Check the quantities and discounts', 'error');
    setBusy(true);
    try {
      if (initial) {
        await patch(fin(org.id, `/credit-notes/${initial.id}`), { ...body, ...(approve ? { action: 'approve' } : {}) });
        toast(approve ? 'Saved and approved' : 'Saved');
        refresh();
        onSaved(initial.id);
      } else {
        const r = await post<{ id: string; number: string }>(fin(org.id, '/credit-notes'), { ...body, action: approve ? 'approve' : 'draft' });
        toast(approve ? `Credit note ${r.number} approved and posted` : `Credit note ${r.number} saved as a draft`);
        refresh();
        onSaved(r.id);
      }
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const previewBody = kept.some((l) => l.lineKind === 'item') && priced.valid ? { ...body, contactId: contactId ?? undefined, ...(initial ? { creditNoteId: initial.id } : {}) } : null;
  return (
    <form
      className="fin-editor-split"
      onSubmit={(e) => {
        e.preventDefault();
        void save(false);
      }}
    >
      <div className="stack-lg">
        <section className="card card-pad">
          <div className="fin-form-grid">
            <div className="field fin-span-2">
              <label htmlFor="cn-contact">Customer</label>
              <CustomerField
                org={org}
                id="cn-contact"
                value={contactId}
                required
                onChange={(v) => {
                  setContactId(v);
                  if (v !== contactId) setInvoiceId(null);
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="cn-invoice">For invoice</label>
              <select id="cn-invoice" className="select" value={invoiceId ?? ''} onChange={(e) => setInvoiceId(e.target.value || null)} disabled={!contactId}>
                <option value="">None: credit to use later</option>
                {invoiceChoices.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.number} ({shortDate(i.issueDate)})
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cn-number">Number</label>
              <input id="cn-number" className="input" maxLength={40} value={number} onChange={(e) => setNumber(e.target.value)} placeholder={`Automatic (${org.settings.prefixes.credit_note}0001, …)`} />
            </div>
            <div className="field">
              <label htmlFor="cn-date">Date</label>
              <input id="cn-date" className="input" type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="cn-ref">Reference</label>
              <input id="cn-ref" className="input" maxLength={200} value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            {gst ? (
              <div className="field">
                <label htmlFor="cn-taxmode">Amounts</label>
                <select id="cn-taxmode" className="select" value={taxMode} onChange={(e) => setTaxMode(e.target.value as TaxMode)}>
                  {(['exclusive', 'inclusive', 'none'] as TaxMode[]).map((m) => (
                    <option key={m} value={m}>
                      {TAX_MODE_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {templates.length > 1 ? (
              <div className="field">
                <label htmlFor="cn-template">Template</label>
                <select id="cn-template" className="select" value={templateId ?? ''} onChange={(e) => setTemplateId(e.target.value || null)}>
                  <option value="">Default template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="field fin-span-3">
              <label htmlFor="cn-reason">Reason</label>
              <input id="cn-reason" className="input" maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="For example: goods returned, price corrected" />
            </div>
          </div>
        </section>
        <section className="card card-pad">
          <h2 className="crm-subhead">Lines</h2>
          <LinesEditor lines={lines} setLines={(f) => setLinesState(f)} priced={priced} gst={gst} direction="sales" extended tracking={tracking.department || tracking.project || tracking.cost_centre} />
          <Totals priced={priced} gst={gst} discountBp={0} labels={{ total: 'Total credit' }} />
          {draft?.invoiceId ? <Hint>The lines of the invoice are filled in. Change quantities or remove lines to credit part of it.</Hint> : null}
          <Hint>Approving posts the credit note: income and GST go down and the customer owes less. With an invoice chosen, the credit is applied to it straight away, up to what it still owes.</Hint>
        </section>
        <section className="card card-pad">
          <div className="field">
            <label htmlFor="cn-notes">Notes for the customer</label>
            <textarea id="cn-notes" className="input" rows={3} maxLength={4000} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </section>
        <div className="row wrap">
          <button type="submit" className="btn" disabled={busy}>
            {busy ? 'Saving…' : 'Save as draft'}
          </button>
          {approver ? (
            <button type="button" className="btn primary" disabled={busy} onClick={() => void save(true)}>
              Save and approve (post to the ledger)
            </button>
          ) : null}
          <button type="button" className="btn ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
      <LivePreview path={fin(org.id, '/credit-notes/preview')} body={previewBody} label="Credit note" />
    </form>
  );
}

function CreditView({ org, note: d, onEdit, reload }: { org: FinOrgDTO; note: CreditDTO; onEdit: () => void; reload: () => void }) {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const accounts = useAccounts().data ?? [];
  const taxCodes = useTaxCodes().data;
  const contacts = useContacts().data ?? [];
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<null | 'apply' | 'refund' | 'void' | { refund: string }>(null);
  const done = () => {
    refresh();
    reload();
  };
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    setBusy(true);
    try {
      await fn();
      toast(msg);
      done();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const live = d.status === 'approved' || d.status === 'applied';
  const pdf = appUrl(`/api${fin(org.id, `/credit-notes/${d.id}/pdf`)}`);
  return (
    <div className="page crm-page">
      <PageHeader
        title={
          <span className="row wrap">
            Credit note {d.number} <StatusBadge status={d.status} />
          </span>
        }
        icon="doc"
        subtitle={
          <>
            <Link to={creditPath(org.id)}>Credit notes</Link> · {d.contactName}
          </>
        }
        actions={busy ? <Spinner /> : null}
      />
      <div className="row wrap fin-toolbar">
        {d.can.edit ? (
          <button className="btn" onClick={onEdit} disabled={busy}>
            <Icon name="edit" /> Edit
          </button>
        ) : null}
        {d.can.approve ? (
          <button className="btn primary" disabled={busy} onClick={() => run(() => post(fin(org.id, `/credit-notes/${d.id}/approve`)), 'Approved and posted to the ledger')}>
            <Icon name="check" /> Approve
          </button>
        ) : null}
        {d.can.apply && d.remaining > 0 ? (
          <>
            <button className="btn primary" disabled={busy} onClick={() => setDialog('apply')}>
              Apply to an invoice
            </button>
            <button className="btn" disabled={busy} onClick={() => setDialog('refund')}>
              <Icon name="dollar" /> Record a refund
            </button>
          </>
        ) : null}
        {live && org.perms.sales.edit !== 'none' ? <ShareActions org={org} kind="credit_note" id={d.id} online={d.online} customerEmail={contacts.find((c) => c.id === d.contactId)?.email ?? null} disabled={busy} onChange={done} /> : null}
        <button className="btn" onClick={() => download(pdf)}>
          <Icon name="download" /> PDF
        </button>
        {d.can.void ? (
          <button className="btn danger" disabled={busy} onClick={() => setDialog('void')}>
            Void
          </button>
        ) : null}
        {d.can.delete ? (
          <button className="btn" disabled={busy} onClick={async () => {
            if (!(await confirm({ title: `Delete credit note ${d.number}?`, message: 'It is a draft: nothing was posted.', confirmLabel: 'Delete', danger: true }))) return;
            setBusy(true);
            try {
              await del(fin(org.id, `/credit-notes/${d.id}`));
              toast('Deleted');
              refresh();
              navigate(creditPath(org.id));
            } catch (e) {
              toast(errorMessage(e), 'error');
            } finally {
              setBusy(false);
            }
          }}>
            <Icon name="trash" /> Delete
          </button>
        ) : null}
      </div>
      <div className="fin-split">
        <div className="stack-lg">
          <section className="card card-pad">
            <dl className="fin-detail">
              <dt>Customer</dt>
              <dd>
                <Link to={`/o/${org.id}/contacts/${d.contactId}`}>{d.contactName}</Link>
              </dd>
              <dt>Date</dt>
              <dd>{longDate(d.issueDate)}</dd>
              <dt>For invoice</dt>
              <dd>{d.invoiceId ? <Link to={`/o/${org.id}/invoices/${d.invoiceId}`}>{d.invoiceNumber}</Link> : <span className="muted">None: credit to use later</span>}</dd>
              {d.reason ? (
                <>
                  <dt>Reason</dt>
                  <dd>{d.reason}</dd>
                </>
              ) : null}
              {d.reference ? (
                <>
                  <dt>Reference</dt>
                  <dd>{d.reference}</dd>
                </>
              ) : null}
              <dt>Created</dt>
              <dd>
                {d.createdByName ?? 'Former member'}, {dateTime(d.createdAt)}
              </dd>
              {d.sentAt ? (
                <>
                  <dt>Sent</dt>
                  <dd>{dateTime(d.sentAt)}</dd>
                </>
              ) : null}
              <dt>Ledger</dt>
              <dd>{d.journalId ? (d.status === 'void' ? 'Posted, then reversed when voided.' : 'Posted: income and GST reduced, the customer owes less.') : 'Not posted yet: it is posted when approved.'}</dd>
            </dl>
          </section>
          <LinesTable org={org} lines={d.lines} accounts={accounts} taxCodes={taxCodes} />
          {d.notes ? (
            <section className="card card-pad">
              <h2 className="crm-subhead">Notes</h2>
              <p className="crm-text">{d.notes}</p>
            </section>
          ) : null}
          <DocumentFrame src={appUrl(`/api${fin(org.id, `/credit-notes/${d.id}/pdf?inline=1`)}`)} label="Credit note" stamp={`${d.status}-${d.allocated}-${d.refunded}`} />
        </div>
        <div className="stack-lg">
          <section className="card card-pad">
            <dl className="fin-totals">
              <dt>{org.gst && d.taxMode !== 'none' ? 'Net (excluding GST)' : 'Subtotal'}</dt>
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
              <dt className="total">Total credit</dt>
              <dd className="total">
                <Money value={d.total} />
              </dd>
              <dt>Applied to invoices</dt>
              <dd>
                <Money value={d.allocated} />
              </dd>
              <dt>Paid back</dt>
              <dd>
                <Money value={d.refunded} />
              </dd>
              <dt className="total">Credit left</dt>
              <dd className="total">
                <Money value={d.remaining} />
              </dd>
            </dl>
          </section>
          <section className="card card-pad">
            <h2 className="crm-subhead">Applied to invoices</h2>
            {d.allocations.length ? (
              <ul className="crm-mini-list">
                {d.allocations.map((a) => (
                  <li key={a.id}>
                    <Icon name="doc" size={14} />
                    <div className="grow">
                      <Link to={`/o/${org.id}/invoices/${a.invoiceId}`}>{a.invoiceNumber}</Link> {a.removed ? <span className="badge danger">Removed</span> : null}
                      <div className="muted small">
                        {shortDate(a.date)} · <Money value={a.amount} />
                      </div>
                    </div>
                    {!a.removed && mayApproveSales(org) ? (
                      <button className="btn ghost sm" disabled={busy} onClick={() => run(() => post(fin(org.id, `/credit-notes/${d.id}/allocations/${a.id}/remove`)), 'Removed: the invoice owes it again')}>
                        Remove
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">Not applied to an invoice.</p>
            )}
          </section>
          <section className="card card-pad">
            <h2 className="crm-subhead">Refunds</h2>
            {d.refunds.length ? (
              <ul className="crm-mini-list">
                {d.refunds.map((r) => (
                  <li key={r.id}>
                    <Icon name="dollar" size={14} />
                    <div className="grow">
                      <Money value={r.amount} /> {r.voided ? <span className="badge danger">Void</span> : null}
                      <div className="muted small">
                        {shortDate(r.date)} · {r.accountName}
                        {r.reference ? ` · ${r.reference}` : ''}
                      </div>
                    </div>
                    {!r.voided && mayApproveSales(org) ? (
                      <button className="btn ghost sm" disabled={busy} onClick={() => setDialog({ refund: r.id })}>
                        Void
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">No refunds recorded.</p>
            )}
            <p className="muted small">A refund records money already paid back to the customer. BIZOMAT does not move money.</p>
          </section>
        </div>
      </div>
      {dialog === 'apply' ? <ApplyCreditDialog org={org} note={d} onClose={() => setDialog(null)} onDone={() => { setDialog(null); done(); }} /> : null}
      {dialog === 'refund' ? <RefundDialog org={org} note={d} onClose={() => setDialog(null)} onDone={() => { setDialog(null); done(); }} /> : null}
      {dialog === 'void' || (dialog && typeof dialog === 'object') ? (
        <VoidDialog
          title={dialog === 'void' ? `Void credit note ${d.number}?` : 'Void this refund?'}
          message={dialog === 'void' ? (d.journalId ? 'Its entry in the ledger is reversed by a new entry; nothing is deleted.' : 'Nothing was posted to the ledger.') : 'The refund is reversed by a new entry in the ledger, and the credit is available again.'}
          posted={dialog !== 'void' || !!d.journalId}
          lockDate={org.lockDate}
          onClose={() => setDialog(null)}
          onConfirm={async (date) => {
            const path = dialog === 'void' ? `/credit-notes/${d.id}/void` : `/credit-notes/${d.id}/refunds/${(dialog as { refund: string }).refund}/void`;
            await post(fin(org.id, path), { date: date || null });
            toast('Voided');
            setDialog(null);
            done();
          }}
        />
      ) : null}
    </div>
  );
}

function ApplyCreditDialog({ org, note, onClose, onDone }: { org: FinOrgDTO; note: CreditDTO; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const { fmt } = useMoney();
  const open = useQuery({ queryKey: ['fin', org.id, 'docs', 'open-for-credit', note.contactId], queryFn: () => get<{ rows: { id: string; number: string; amountDue: number; dueDate: string | null }[] }>(`${fin(org.id, '/docs')}?kind=invoice&status=open&contact=${note.contactId}`) });
  const rows = open.data?.rows ?? [];
  const [invoiceId, setInvoiceId] = useState<string>('');
  const inv = rows.find((r) => r.id === invoiceId);
  const [amount, setAmount] = useState<number | null>(null);
  useEffect(() => {
    if (inv) setAmount(Math.min(inv.amountDue, note.remaining));
  }, [inv, note.remaining]);
  const [date, setDate] = useState(todayLocal());
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={`Apply credit from ${note.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy || !inv || !amount}
            onClick={async () => {
              setBusy(true);
              try {
                await post(fin(org.id, `/credit-notes/${note.id}/allocations`), { invoiceId, amount, date });
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
        <p className="muted small">Credit left: {fmt(note.remaining)}. Applying it lowers what the invoice still owes; nothing new is posted, because both are in the customer’s balance.</p>
        {open.isLoading ? <Spinner /> : null}
        {!open.isLoading && !rows.length ? <p>{note.contactName} has no open invoices.</p> : null}
        {rows.length ? (
          <div className="field">
            <label htmlFor="ap-inv">Invoice</label>
            <select id="ap-inv" className="select" value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
              <option value="">Choose an open invoice</option>
              {rows.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.number}: {fmt(r.amountDue)} owing
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {inv ? (
          <>
            <div className="field">
              <label htmlFor="ap-amount">Amount</label>
              <MoneyInput id="ap-amount" value={amount} onChange={setAmount} />
            </div>
            <div className="field">
              <label htmlFor="ap-date">Date</label>
              <input id="ap-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

function RefundDialog({ org, note, onClose, onDone }: { org: FinOrgDTO; note: CreditDTO; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const { fmt } = useMoney();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [date, setDate] = useState(todayLocal());
  const [amount, setAmount] = useState<number | null>(note.remaining);
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={`Record a refund for ${note.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={busy || !accountId || !amount}
            onClick={async () => {
              setBusy(true);
              try {
                await post(fin(org.id, `/credit-notes/${note.id}/refunds`), { accountId, date, amount, reference: reference.trim() || undefined });
                toast('Refund recorded');
                onDone();
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            Record refund
          </button>
        </>
      }
    >
      <div className="stack">
        <Hint>Record money you have already paid back to the customer, for example by bank transfer. BIZOMAT does not move money.</Hint>
        <div className="field">
          <label htmlFor="rf-account">Paid from</label>
          <AccountSelect id="rf-account" kind="money" value={accountId} onChange={setAccountId} emptyLabel="Choose a bank account, card or cash" required />
        </div>
        <div className="field">
          <label htmlFor="rf-date">Date paid</label>
          <input id="rf-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="rf-amount">Amount</label>
          <MoneyInput id="rf-amount" value={amount} onChange={setAmount} />
          <span className="muted small">Credit left: {fmt(note.remaining)}</span>
        </div>
        <div className="field">
          <label htmlFor="rf-ref">Reference</label>
          <input id="rf-ref" className="input" maxLength={100} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optional" />
        </div>
      </div>
    </Modal>
  );
}
