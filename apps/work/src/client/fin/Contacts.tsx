// Customers and suppliers (business workspaces): the list with search, type filter, what each owes or is owed, CSV
// export and import; one contact with its details, defaults for new documents, and its open invoices and bills.
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, errorMessage, get, patch, post } from '../lib/api';
import { useDebounced, usePageTitle } from '../lib/hooks';
import { useSession } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { parseCsv } from '../../shared/crm/csv';
import { DOC_LABELS } from '../../shared/fin/settings';
import { accountLabel, appUrl, download, fin, shortDate, useAccounts, useCurrentOrg, useRefresh, useTaxCodes, type ContactDTO, type FinOrgDTO } from './lib';
import { AccountSelect, Hint, Money, StatusBadge, TaxCodeSelect, taxCodeName } from './ui';

type Kind = ContactDTO['kind'];
const KIND_LABELS: Record<Kind, string> = { customer: 'Customer', supplier: 'Supplier', both: 'Customer and supplier' };

function BusinessOnly() {
  return (
    <div className="page crm-page">
      <EmptyState icon="users" title="Customers and suppliers belong to business workspaces">
        Personal and household workspaces record who was paid on each transaction. Create a business workspace from the workspace menu to keep customers and suppliers for invoices and bills.
      </EmptyState>
    </div>
  );
}

function NoAccess() {
  return (
    <div className="page crm-page">
      <EmptyState icon="lock" title="Your role does not include customers and suppliers">
        Ask an owner or administrator of the workspace if you need them.
      </EmptyState>
    </div>
  );
}

/** Whether this person may change this contact (edit scope all, or own and they added it). */
function useCanEdit(org: FinOrgDTO) {
  const { session } = useSession();
  const me = session?.user.id;
  return (c: Pick<ContactDTO, 'createdBy'>) => org.perms.contacts.edit === 'all' || (org.perms.contacts.edit === 'own' && !!me && c.createdBy === me);
}

// ------------------------------------------------------------------ list

export function Contacts() {
  const org = useCurrentOrg();
  usePageTitle('Customers and suppliers');
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms.contacts.view === 'none') return <NoAccess />;
  return <ContactList org={org} />;
}

function ContactList({ org }: { org: FinOrgDTO }) {
  const perms = org.perms.contacts;
  const toast = useToast();
  const refresh = useRefresh();
  const canEdit = useCanEdit(org);
  const [search, setSearch] = useState('');
  const q = useDebounced(search, 300);
  const [kind, setKind] = useState<'' | 'customer' | 'supplier'>('');
  const [archived, setArchived] = useState(false);
  const [editing, setEditing] = useState<ContactDTO | 'new' | null>(null);
  const [importing, setImporting] = useState(false);
  const qs = new URLSearchParams();
  if (q.trim()) qs.set('q', q.trim());
  if (kind) qs.set('kind', kind);
  if (archived) qs.set('archived', '1');
  const list = useQuery({ queryKey: ['fin', org.id, 'contacts', 'list', qs.toString()], queryFn: () => get<ContactDTO[]>(`${fin(org.id, '/contacts')}?${qs}`), placeholderData: keepPreviousData });
  const rows = list.data ?? [];
  const totals = rows.reduce((t, c) => ({ receivable: t.receivable + c.receivable, payable: t.payable + c.payable }), { receivable: 0, payable: 0 });
  const setArchivedFlag = async (c: ContactDTO, value: boolean) => {
    try {
      await patch(fin(org.id, `/contacts/${c.id}`), { archived: value });
      toast(value ? `${c.name} archived` : `${c.name} restored`);
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="page crm-page">
      <PageHeader
        title="Customers and suppliers"
        icon="users"
        subtitle="The people and businesses you invoice and the suppliers whose bills you record. What each owes, or is owed, comes from approved invoices and bills."
        actions={
          <>
            {list.isFetching ? <Spinner /> : null}
            {perms.export ? (
              <button className="btn" onClick={() => download(appUrl(`/api${fin(org.id, '/contacts')}?${new URLSearchParams([...qs.entries(), ['format', 'csv']])}`))}>
                <Icon name="download" /> Export CSV
              </button>
            ) : null}
            {perms.import && perms.create ? (
              <button className="btn" onClick={() => setImporting(true)}>
                <Icon name="upload" /> Import CSV
              </button>
            ) : null}
            {perms.create ? (
              <button className="btn primary" onClick={() => setEditing('new')}>
                <Icon name="plus" /> New contact
              </button>
            ) : null}
          </>
        }
      />
      <div className="row fin-toolbar">
        <div className="crm-search">
          <Icon name="search" />
          <input className="input" type="search" placeholder="Name, email, phone or ABN" aria-label="Search customers and suppliers" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="">Customers and suppliers</option>
          <option value="customer">Customers</option>
          <option value="supplier">Suppliers</option>
        </select>
        <label className="row small">
          <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} /> Show archived
        </label>
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {!list.data ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="users" title={q || kind ? 'Nothing matches' : 'No customers or suppliers yet'} action={perms.create && !q && !kind ? <button className="btn primary" onClick={() => setEditing('new')}>New contact</button> : undefined}>
          {q || kind ? 'Try another search or type.' : 'Add the businesses and people you invoice or buy from, or import them from a CSV file.'}
        </EmptyState>
      ) : (
        <div className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="fin-num">Owed to you</th>
                  <th className="fin-num">You owe</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link className="crm-primary" to={`/o/${org.id}/contacts/${c.id}`}>
                        {c.name}
                      </Link>
                      {c.archived ? <span className="badge"> Archived</span> : null}
                    </td>
                    <td>{KIND_LABELS[c.kind]}</td>
                    <td>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : <span className="muted">None</span>}</td>
                    <td>{c.phone || <span className="muted">None</span>}</td>
                    <td className="fin-num">{c.receivable ? <Money value={c.receivable} /> : <span className="muted">None</span>}</td>
                    <td className="fin-num">{c.payable ? <Money value={c.payable} /> : <span className="muted">None</span>}</td>
                    <td className="fin-num">
                      {canEdit(c) ? (
                        <>
                          <button className="btn ghost sm" onClick={() => setEditing(c)}>
                            Edit
                          </button>
                          <button className="btn ghost sm" onClick={() => setArchivedFlag(c, !c.archived)}>
                            {c.archived ? 'Restore' : 'Archive'}
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="muted small">
                    {rows.length === 1 ? '1 contact' : `${rows.length} contacts`}
                  </td>
                  <td className="fin-num">
                    <Money value={totals.receivable} strong />
                  </td>
                  <td className="fin-num">
                    <Money value={totals.payable} strong />
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      {editing ? (
        <ContactDialog
          org={org}
          contact={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      ) : null}
      {importing ? (
        <ImportDialog
          org={org}
          onClose={() => setImporting(false)}
          onDone={() => {
            setImporting(false);
            refresh();
          }}
        />
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ create and edit

function ContactDialog({ org, contact, onClose, onSaved, presetKind }: { org: FinOrgDTO; contact: ContactDTO | null; onClose: () => void; onSaved: (id: string) => void; presetKind?: Kind }) {
  const toast = useToast();
  const [f, setF] = useState({
    name: contact?.name ?? '',
    kind: (contact?.kind ?? presetKind ?? 'customer') as Kind,
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    abn: contact?.abn ?? '',
    address: contact?.address ?? '',
    termsDays: contact?.termsDays === null || contact?.termsDays === undefined ? '' : String(contact.termsDays),
    defaultAccountId: contact?.defaultAccountId ?? null,
    defaultTaxCodeId: contact?.defaultTaxCodeId ?? null,
    notes: contact?.notes ?? '',
  });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!f.name.trim()) return toast('Give the contact a name', 'error');
    const terms = f.termsDays.trim() === '' ? null : Number(f.termsDays);
    if (terms !== null && (!Number.isInteger(terms) || terms < 0 || terms > 365)) return toast('Payment terms are whole days, from 0 to 365', 'error');
    const body = { name: f.name.trim(), kind: f.kind, email: f.email.trim(), phone: f.phone.trim(), abn: f.abn.trim(), address: f.address.trim(), termsDays: terms, defaultAccountId: f.defaultAccountId, defaultTaxCodeId: org.gst ? f.defaultTaxCodeId : null, notes: f.notes };
    setBusy(true);
    try {
      if (contact) {
        await patch(fin(org.id, `/contacts/${contact.id}`), body);
        toast('Saved');
        onSaved(contact.id);
      } else {
        const r = await post<{ id: string }>(fin(org.id, '/contacts'), body);
        toast(`${body.name} added`);
        onSaved(r.id);
      }
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const direction = f.kind === 'supplier' ? 'out' : f.kind === 'customer' ? 'in' : 'any';
  return (
    <Modal
      title={contact ? `Edit ${contact.name}` : 'New contact'}
      wide
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" disabled={busy || !f.name.trim()} onClick={save}>
            {busy ? 'Saving…' : contact ? 'Save' : 'Add contact'}
          </button>
        </>
      }
    >
      <form
        className="crm-form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div className="field">
          <label htmlFor="ct-name">Name</label>
          <input id="ct-name" className="input" required maxLength={160} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ct-kind">Type</label>
          <select id="ct-kind" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as Kind })}>
            {(Object.keys(KIND_LABELS) as Kind[]).map((k) => (
              <option key={k} value={k}>
                {KIND_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ct-email">Email</label>
          <input id="ct-email" className="input" type="email" maxLength={320} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ct-phone">Phone</label>
          <input id="ct-phone" className="input" maxLength={60} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ct-abn">ABN</label>
          <input id="ct-abn" className="input" inputMode="numeric" maxLength={20} value={f.abn} onChange={(e) => setF({ ...f, abn: e.target.value.replace(/[^0-9 ]/g, '') })} placeholder="11 digits" />
        </div>
        <div className="field">
          <label htmlFor="ct-terms">Payment terms (days)</label>
          <input id="ct-terms" className="input" inputMode="numeric" value={f.termsDays} onChange={(e) => setF({ ...f, termsDays: e.target.value.replace(/\D/g, '') })} placeholder={`Workspace default: ${org.settings.termsDays}`} />
        </div>
        <div className="field crm-span">
          <label htmlFor="ct-address">Address</label>
          <textarea id="ct-address" className="input" rows={3} maxLength={400} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ct-account">Default account for new lines</label>
          <AccountSelect id="ct-account" kind="category" direction={direction} allowEmpty emptyLabel="None" value={f.defaultAccountId} onChange={(v) => setF({ ...f, defaultAccountId: v })} />
        </div>
        {org.gst ? (
          <div className="field">
            <label htmlFor="ct-tax">Default GST code</label>
            <TaxCodeSelect id="ct-tax" direction={f.kind === 'supplier' ? 'purchases' : f.kind === 'customer' ? 'sales' : 'both'} value={f.defaultTaxCodeId} onChange={(v) => setF({ ...f, defaultTaxCodeId: v })} />
          </div>
        ) : null}
        <div className="field crm-span">
          <label htmlFor="ct-notes">Notes</label>
          <textarea id="ct-notes" className="input" rows={3} maxLength={2000} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </div>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ CSV import

const FIELDS = [
  { key: 'name', label: 'Name', match: /^(name|contact|contact name|company|business name|customer|supplier)$/i },
  { key: 'kind', label: 'Type', match: /^(type|kind|contact type)$/i },
  { key: 'email', label: 'Email', match: /e-?mail/i },
  { key: 'phone', label: 'Phone', match: /phone|mobile|tel/i },
  { key: 'abn', label: 'ABN', match: /^abn$/i },
  { key: 'address', label: 'Address', match: /address/i },
] as const;
type FieldKey = (typeof FIELDS)[number]['key'];

function kindFrom(text: string): Kind | undefined {
  const t = text.trim().toLowerCase();
  if (!t) return undefined;
  const c = /customer|client/.test(t);
  const s = /supplier|vendor/.test(t);
  if (t === 'both' || (c && s)) return 'both';
  if (s) return 'supplier';
  if (c) return 'customer';
  return undefined;
}

function ImportDialog({ org, onClose, onDone }: { org: FinOrgDTO; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [rows, setRows] = useState<string[][] | null>(null);
  const [fileName, setFileName] = useState('');
  const [map, setMap] = useState<Record<FieldKey, number>>({ name: -1, kind: -1, email: -1, phone: -1, abn: -1, address: -1 });
  const [fallbackKind, setFallbackKind] = useState<Kind>('customer');
  const [busy, setBusy] = useState(false);
  const header = rows?.[0] ?? [];
  const body = (rows ?? []).slice(1).filter((r) => r.some((c) => c.trim()));
  const read = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 3_000_000) return toast('The file is too large (3 MB at most)', 'error');
    const parsed = parseCsv(await file.text(), 2001);
    if (parsed.length < 2) return toast('The file has no rows under its header', 'error');
    setRows(parsed);
    setFileName(file.name);
    const guess = { name: -1, kind: -1, email: -1, phone: -1, abn: -1, address: -1 } as Record<FieldKey, number>;
    for (const f of FIELDS) guess[f.key] = parsed[0].findIndex((h) => f.match.test(h.trim()));
    if (guess.name < 0) guess.name = 0;
    setMap(guess);
  };
  const cell = (r: string[], k: FieldKey) => (map[k] >= 0 ? (r[map[k]] ?? '').trim() : '');
  const payload = body
    .map((r) => ({
      name: cell(r, 'name').slice(0, 160),
      kind: kindFrom(cell(r, 'kind')) ?? fallbackKind,
      email: cell(r, 'email').slice(0, 320),
      phone: cell(r, 'phone').slice(0, 60),
      abn: cell(r, 'abn').replace(/\D/g, '').slice(0, 20),
      address: cell(r, 'address').slice(0, 400),
    }))
    .filter((r) => r.name);
  const run = async () => {
    if (!payload.length) return toast('No row has a name', 'error');
    if (payload.length > 2000) return toast('Import at most 2,000 contacts at a time', 'error');
    setBusy(true);
    try {
      const r = await post<{ created: number; skipped: number }>(fin(org.id, '/contacts/import'), { rows: payload });
      toast(`${r.created} ${r.created === 1 ? 'contact' : 'contacts'} added${r.skipped ? `, ${r.skipped} skipped (already there or without a name)` : ''}`);
      onDone();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="Import customers and suppliers"
      wide
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" disabled={busy || !payload.length} onClick={run}>
            {busy ? 'Importing…' : `Import ${payload.length || ''} ${payload.length === 1 ? 'contact' : 'contacts'}`}
          </button>
        </>
      }
    >
      <div className="stack">
        <Hint>Choose a CSV file with a header row. Match its columns to the fields below. Names already in the workspace are skipped, so importing the same file twice adds nothing.</Hint>
        <div className="field">
          <label htmlFor="ct-import-file">CSV file</label>
          <input id="ct-import-file" type="file" accept=".csv,text/csv" onChange={(e) => read(e.target.files?.[0])} />
          {fileName ? (
            <span className="muted small">
              {fileName}: {body.length} {body.length === 1 ? 'row' : 'rows'}
            </span>
          ) : null}
        </div>
        {rows ? (
          <>
            <div className="crm-form-grid">
              {FIELDS.map((f) => (
                <div className="field" key={f.key}>
                  <label htmlFor={`ct-map-${f.key}`}>{f.label}</label>
                  <select id={`ct-map-${f.key}`} className="select" value={map[f.key]} onChange={(e) => setMap({ ...map, [f.key]: Number(e.target.value) })}>
                    <option value={-1}>{f.key === 'name' ? 'Choose a column' : 'Not in the file'}</option>
                    {header.map((h, i) => (
                      <option key={i} value={i}>
                        {h || `Column ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="field">
                <label htmlFor="ct-import-kind">Type when the file does not say</label>
                <select id="ct-import-kind" className="select" value={fallbackKind} onChange={(e) => setFallbackKind(e.target.value as Kind)}>
                  {(Object.keys(KIND_LABELS) as Kind[]).map((k) => (
                    <option key={k} value={k}>
                      {KIND_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {payload.length ? (
              <div className="crm-table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payload.slice(0, 5).map((r, i) => (
                      <tr key={i}>
                        <td>{r.name}</td>
                        <td>{KIND_LABELS[r.kind]}</td>
                        <td>{r.email}</td>
                        <td>{r.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payload.length > 5 ? <p className="muted small">The first 5 of {payload.length}.</p> : null}
              </div>
            ) : (
              <p className="muted small">No row has a name in the chosen column.</p>
            )}
          </>
        ) : null}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ one contact

interface DocRow {
  id: string;
  kind: 'invoice' | 'bill';
  number: string;
  issueDate: string;
  dueDate: string | null;
  status: string;
  overdue: boolean;
  total: number;
  amountDue: number;
}

export function ContactPage() {
  const org = useCurrentOrg();
  const { id = '' } = useParams();
  if (org.kind !== 'business') return <BusinessOnly />;
  if (org.perms.contacts.view === 'none') return <NoAccess />;
  return <ContactDetail key={id} org={org} id={id} />;
}

function ContactDetail({ org, id }: { org: FinOrgDTO; id: string }) {
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const canEdit = useCanEdit(org);
  const accounts = useAccounts().data;
  const taxCodes = useTaxCodes().data;
  const [editing, setEditing] = useState(false);
  const q = useQuery({ queryKey: ['fin', org.id, 'contact', id], queryFn: () => get<ContactDTO>(fin(org.id, `/contacts/${id}`)) });
  usePageTitle(q.data?.name ?? 'Contact');
  if (q.error) {
    if (q.error instanceof ApiError && (q.error.status === 404 || q.error.status === 403))
      return (
        <div className="page crm-page">
          <EmptyState icon="users" title="This contact is not available" action={<Link className="btn" to={`/o/${org.id}/contacts`}>Back to customers and suppliers</Link>}>
            It may not exist, or your role does not include it.
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
  const c = q.data;
  const sells = c.kind !== 'supplier';
  const buys = c.kind !== 'customer';
  const editable = canEdit(c);
  const account = accounts?.find((a) => a.id === c.defaultAccountId);
  return (
    <div className="page crm-page">
      <PageHeader
        title={
          <span className="row wrap">
            {c.name} {c.archived ? <span className="badge">Archived</span> : null}
          </span>
        }
        icon="users"
        subtitle={
          <>
            <Link to={`/o/${org.id}/contacts`}>Customers and suppliers</Link> · {KIND_LABELS[c.kind]}
          </>
        }
        actions={
          <>
            {sells && org.perms.sales.create ? (
              <button className="btn" onClick={() => navigate(`/o/${org.id}/${DOC_LABELS.invoice.path}/new?contact=${c.id}`)}>
                <Icon name="plus" /> New invoice
              </button>
            ) : null}
            {buys && org.perms.purchases.create ? (
              <button className="btn" onClick={() => navigate(`/o/${org.id}/${DOC_LABELS.bill.path}/new?contact=${c.id}`)}>
                <Icon name="plus" /> New bill
              </button>
            ) : null}
            {editable ? (
              <>
                <button className="btn" onClick={() => setEditing(true)}>
                  <Icon name="edit" /> Edit
                </button>
                <button
                  className="btn"
                  onClick={async () => {
                    if (!c.archived && !(await confirm({ title: `Archive ${c.name}?`, message: 'It no longer appears in lists and pickers. Its invoices, bills and history stay, and you can restore it at any time.', confirmLabel: 'Archive' }))) return;
                    try {
                      await patch(fin(org.id, `/contacts/${c.id}`), { archived: !c.archived });
                      toast(c.archived ? 'Restored' : 'Archived');
                      q.refetch();
                      refresh('contacts');
                    } catch (e) {
                      toast(errorMessage(e), 'error');
                    }
                  }}
                >
                  <Icon name={c.archived ? 'restore' : 'archive'} /> {c.archived ? 'Restore' : 'Archive'}
                </button>
              </>
            ) : null}
          </>
        }
      />
      <div className="fin-split">
        <div className="stack-lg">
          {sells && org.perms.sales.view !== 'none' ? <OpenDocs org={org} contactId={c.id} kind="invoice" /> : null}
          {buys && org.perms.purchases.view !== 'none' ? <OpenDocs org={org} contactId={c.id} kind="bill" /> : null}
        </div>
        <div className="stack-lg">
          <section className="card card-pad">
            <dl className="fin-totals">
              {sells ? (
                <>
                  <dt>Owed to you</dt>
                  <dd>
                    <Money value={c.receivable} strong />
                  </dd>
                </>
              ) : null}
              {buys ? (
                <>
                  <dt>You owe</dt>
                  <dd>
                    <Money value={c.payable} strong />
                  </dd>
                </>
              ) : null}
            </dl>
          </section>
          <section className="card card-pad">
            <h2 className="crm-subhead">Details</h2>
            <dl className="fin-detail">
              <dt>Email</dt>
              <dd>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : <span className="muted">None</span>}</dd>
              <dt>Phone</dt>
              <dd>{c.phone ? <a href={`tel:${c.phone.replace(/\s+/g, '')}`}>{c.phone}</a> : <span className="muted">None</span>}</dd>
              <dt>ABN</dt>
              <dd>{c.abn ? formatAbn(c.abn) : <span className="muted">None</span>}</dd>
              <dt>Address</dt>
              <dd className="crm-text">{c.address || <span className="muted">None</span>}</dd>
              <dt>Payment terms</dt>
              <dd>{c.termsDays === null ? `Workspace default (${org.settings.termsDays} days)` : `${c.termsDays} days`}</dd>
              <dt>Default account</dt>
              <dd>{account ? accountLabel(account) : <span className="muted">None</span>}</dd>
              {org.gst ? (
                <>
                  <dt>Default GST code</dt>
                  <dd>{taxCodeName(taxCodes, c.defaultTaxCodeId) || <span className="muted">None</span>}</dd>
                </>
              ) : null}
            </dl>
            {c.notes ? (
              <>
                <h2 className="crm-subhead">Notes</h2>
                <p className="crm-text">{c.notes}</p>
              </>
            ) : null}
          </section>
        </div>
      </div>
      {editing ? (
        <ContactDialog
          org={org}
          contact={c}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            q.refetch();
            refresh('contacts');
          }}
        />
      ) : null}
    </div>
  );
}

function formatAbn(abn: string) {
  const d = abn.replace(/\D/g, '');
  return d.length === 11 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : abn;
}

function OpenDocs({ org, contactId, kind }: { org: FinOrgDTO; contactId: string; kind: 'invoice' | 'bill' }) {
  const label = DOC_LABELS[kind];
  const q = useQuery({ queryKey: ['fin', org.id, 'docs', kind, `contact=${contactId}&status=open`], queryFn: () => get<{ rows: DocRow[]; totals: { due: number } }>(`${fin(org.id, '/docs')}?kind=${kind}&contact=${encodeURIComponent(contactId)}&status=open`) });
  const rows = q.data?.rows ?? [];
  return (
    <section className="card">
      <div className="row card-pad">
        <h2 className="crm-subhead grow">{kind === 'invoice' ? 'Open invoices' : 'Bills to pay'}</h2>
        {q.isFetching ? <Spinner /> : null}
        <Link className="small" to={`/o/${org.id}/${label.path}?contact=${contactId}`}>
          All {label.many.toLowerCase()}
        </Link>
      </div>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!q.data ? null : !rows.length ? (
        <p className="muted small crm-pad">{kind === 'invoice' ? 'Nothing waiting to be received.' : 'Nothing waiting to be paid.'}</p>
      ) : (
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Date</th>
                <th>Due</th>
                <th>Status</th>
                <th className="fin-num">Total</th>
                <th className="fin-num">Due amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link to={`/o/${org.id}/${label.path}/${d.id}`}>{d.number}</Link>
                  </td>
                  <td>{shortDate(d.issueDate)}</td>
                  <td>{d.dueDate ? shortDate(d.dueDate) : ''}</td>
                  <td>
                    <StatusBadge status={d.status} overdue={d.overdue} />
                  </td>
                  <td className="fin-num">
                    <Money value={d.total} />
                  </td>
                  <td className="fin-num">
                    <Money value={d.amountDue} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
