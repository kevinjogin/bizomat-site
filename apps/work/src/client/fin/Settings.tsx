// Finance settings of one workspace (details, GST, approvals and alerts, the audit trail, deleting it) and the
// person's own notification preferences. The server checks every change.
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, del, errorMessage, get, patch, put } from '../lib/api';
import { appUrl } from '../lib/base';
import { CURRENCIES } from '../../shared/money';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Switch } from '../components/ui/ui';
import { useConfirm, useToast } from '../components/ui/overlays';
import { WORKSPACE_KIND_LABELS } from '../../shared/fin/roles';
import type { FinSettings } from '../../shared/fin/settings';
import { dateTime, fin, useCurrentOrg, useRefresh } from './lib';
import { Hint } from './ui';

type TabKey = 'workspace' | 'approvals' | 'notifications' | 'audit' | 'danger';

export function Settings() {
  const org = useCurrentOrg();
  const { tab = 'workspace' } = useParams();
  const manage = org.perms.settings.manage;
  const audit = org.role === 'owner' || org.role === 'admin' || org.perms.accounting.manage;
  const tabs: { key: TabKey; label: string; icon: string; show: boolean }[] = [
    { key: 'workspace', label: 'Workspace', icon: 'building', show: true },
    { key: 'approvals', label: org.kind === 'business' ? 'Approvals and alerts' : 'Alerts', icon: 'checkSquare', show: manage },
    { key: 'notifications', label: 'My notifications', icon: 'bell', show: true },
    { key: 'audit', label: 'Audit trail', icon: 'history', show: audit },
    { key: 'danger', label: 'Delete workspace', icon: 'trash', show: org.role === 'owner' },
  ];
  const visible = tabs.filter((t) => t.show);
  const current = (visible.find((t) => t.key === tab) ?? visible[0]).key;
  return (
    <div className="page crm-page">
      <PageHeader title="Settings" icon="settings" subtitle={`${org.name}: workspace settings, and your own preferences`} />
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings">
          {visible.map((t) => (
            <NavLink key={t.key} to={`/o/${org.id}/settings/${t.key}`} className={() => `nav-item${current === t.key ? ' active' : ''}`}>
              <Icon name={t.icon} /> {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="stack-lg crm-settings-body">
          {current === 'workspace' ? <WorkspaceSettings /> : null}
          {current === 'approvals' ? <ApprovalsAndAlerts /> : null}
          {current === 'notifications' ? <NotificationPrefs /> : null}
          {current === 'audit' ? <AuditTrail /> : null}
          {current === 'danger' ? <DangerZone /> : null}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ workspace details

const MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2026, i, 1).toLocaleDateString('en-AU', { month: 'long' }));

function WorkspaceSettings() {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const qc = useQueryClient();
  const logo = useRef<HTMLInputElement>(null);
  const business = org.kind === 'business';
  const manage = org.perms.settings.manage;
  const initial = () => ({
    name: org.name,
    legalName: org.legalName,
    abn: org.abn,
    address: org.address,
    email: org.email,
    phone: org.phone,
    country: org.country,
    currency: org.currency,
    timezone: org.timezone,
    fyStartMonth: org.fyStartMonth,
    gstRegistered: org.gstRegistered,
    gstBasis: org.gstBasis,
    gstPeriod: org.gstPeriod,
    basMethod: org.basMethod,
  });
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  useEffect(() => setF(initial()), [org]);
  const zones = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.('timeZone') ?? [org.timezone];
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        name: f.name.trim(),
        address: f.address,
        email: f.email.trim(),
        phone: f.phone,
        country: f.country,
        currency: f.currency,
        timezone: f.timezone,
        fyStartMonth: f.fyStartMonth,
      };
      if (business) Object.assign(body, { legalName: f.legalName, abn: f.abn, gstRegistered: f.gstRegistered, gstBasis: f.gstBasis, gstPeriod: f.gstPeriod, basMethod: f.basMethod });
      await patch(fin(org.id), body);
      toast('Saved');
      await refresh();
      await qc.invalidateQueries({ queryKey: ['fin', 'orgs'] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const uploadLogo = async (file: File) => {
    const form = new FormData();
    form.set('file', file);
    try {
      await api(fin(org.id, '/logo'), { method: 'POST', form });
      toast('Logo saved');
      await refresh('org');
      await qc.invalidateQueries({ queryKey: ['fin', 'orgs'] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <form className="card card-pad stack" onSubmit={save}>
      <p className="muted small">
        A {WORKSPACE_KIND_LABELS[org.kind].toLowerCase()} workspace. {manage ? '' : 'Only people who manage the workspace settings can change these details.'}
      </p>
      {business ? (
        <div className="row">
          <button type="button" className="crm-avatar" disabled={!manage} onClick={() => logo.current?.click()} aria-label="Change the logo shown on invoices">
            {org.logoUrl ? <img className="crm-avatar-img" src={appUrl(org.logoUrl)} alt="" /> : <span className="crm-avatar-icon"><Icon name="image" size={22} /></span>}
          </button>
          <input
            ref={logo}
            type="file"
            hidden
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) uploadLogo(file);
            }}
          />
          <p className="muted small">The logo on your invoices and purchase orders (PNG or JPEG, up to 5 MB).</p>
        </div>
      ) : null}
      <fieldset className="crm-fieldset" disabled={!manage}>
        <legend>Details</legend>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="ws-name">Workspace name</label>
            <input id="ws-name" className="input" required maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </div>
          {business ? (
            <>
              <div className="field">
                <label htmlFor="ws-legal">Legal name</label>
                <input id="ws-legal" className="input" maxLength={160} value={f.legalName} onChange={(e) => setF({ ...f, legalName: e.target.value })} />
                <span className="hint">Shown on tax invoices.</span>
              </div>
              <div className="field">
                <label htmlFor="ws-abn">ABN</label>
                <input id="ws-abn" className="input" inputMode="numeric" maxLength={20} value={f.abn} onChange={(e) => setF({ ...f, abn: e.target.value.replace(/[^0-9 ]/g, '') })} />
                <span className="hint">A tax invoice shows the seller's ABN.</span>
              </div>
            </>
          ) : null}
          <div className="field">
            <label htmlFor="ws-email">Email</label>
            <input id="ws-email" className="input" type="email" maxLength={320} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="ws-phone">Phone</label>
            <input id="ws-phone" className="input" maxLength={60} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="ws-country">Country</label>
            <input id="ws-country" className="input" maxLength={100} value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} />
          </div>
          <div className="field crm-span">
            <label htmlFor="ws-address">Address</label>
            <textarea id="ws-address" className="textarea" rows={2} maxLength={300} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
          </div>
        </div>
      </fieldset>
      <fieldset className="crm-fieldset" disabled={!manage}>
        <legend>Money and dates</legend>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="ws-currency">Currency</label>
            <select id="ws-currency" className="select" value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code}: {c.name}</option>
              ))}
            </select>
            <span className="hint">Fixed once anything has been posted.</span>
          </div>
          <div className="field">
            <label htmlFor="ws-tz">Time zone</label>
            <select id="ws-tz" className="select" value={f.timezone} onChange={(e) => setF({ ...f, timezone: e.target.value })}>
              {[...new Set([org.timezone, 'Australia/Sydney', ...zones])].map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
            <span className="hint">Decides "today" for due dates, recurring records and alerts.</span>
          </div>
          <div className="field">
            <label htmlFor="ws-fy">Financial year starts in</label>
            <select id="ws-fy" className="select" value={f.fyStartMonth} onChange={(e) => setF({ ...f, fyStartMonth: Number(e.target.value) })}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}{i === 6 ? ' (Australia)' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>
      {business ? (
        <fieldset className="crm-fieldset" disabled={!manage}>
          <legend>GST</legend>
          <label className="checkbox">
            <input type="checkbox" checked={f.gstRegistered} onChange={(e) => setF({ ...f, gstRegistered: e.target.checked })} /> Registered for GST
          </label>
          {f.gstRegistered ? (
            <div className="crm-form-grid">
              <div className="field">
                <label htmlFor="ws-basis">Accounting basis for GST</label>
                <select id="ws-basis" className="select" value={f.gstBasis} onChange={(e) => setF({ ...f, gstBasis: e.target.value as 'cash' | 'accrual' })}>
                  <option value="accrual">Accrual (non-cash): when invoiced or billed</option>
                  <option value="cash">Cash: when paid</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="ws-period">Reporting period</label>
                <select id="ws-period" className="select" value={f.gstPeriod} onChange={(e) => setF({ ...f, gstPeriod: e.target.value as 'monthly' | 'quarterly' | 'annual' })}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="ws-bas">BAS reporting method</label>
                <select id="ws-bas" className="select" value={f.basMethod} onChange={(e) => setF({ ...f, basMethod: e.target.value as 'simpler' | 'full' })}>
                  <option value="simpler">Simpler BAS (G1, 1A, 1B)</option>
                  <option value="full">Full reporting (adds G2, G3, G10, G11)</option>
                </select>
              </div>
            </div>
          ) : null}
          <Hint>
            Use the settings the ATO has recorded for your business. The GST report is a worksheet to help you prepare your BAS: check it before you lodge. BIZOMAT does not lodge with the ATO and is not certified tax software. Registering adds the standard GST codes if the workspace has none.
          </Hint>
        </fieldset>
      ) : null}
      {manage ? (
        <div>
          <button className="btn primary" type="submit" disabled={busy || !f.name.trim()}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      ) : null}
    </form>
  );
}

// ------------------------------------------------------------------ approvals and alerts

function ApprovalsAndAlerts() {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const business = org.kind === 'business';
  const [s, setS] = useState<FinSettings>(org.settings);
  const [busy, setBusy] = useState(false);
  useEffect(() => setS(org.settings), [org.settings]);
  const dirty = JSON.stringify(s) !== JSON.stringify(org.settings);
  const save = async () => {
    setBusy(true);
    try {
      await patch(fin(org.id), { settings: { approvals: s.approvals, alerts: s.alerts, termsDays: s.termsDays, duplicateDays: s.duplicateDays } });
      toast('Saved');
      await refresh('org');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const approval = (key: keyof FinSettings['approvals'], label: string, hint: string) => (
    <div className="row">
      <Switch checked={s.approvals[key]} onChange={(v) => setS({ ...s, approvals: { ...s.approvals, [key]: v } })} label={label} />
      <div className="grow">
        <div>{label}</div>
        <div className="muted small">{hint}</div>
      </div>
    </div>
  );
  const alert = (key: 'overdueInvoices' | 'overdueBills' | 'budgets' | 'monthlySummary', label: string, hint: string) => (
    <div className="row">
      <Switch checked={s.alerts[key]} onChange={(v) => setS({ ...s, alerts: { ...s.alerts, [key]: v } })} label={label} />
      <div className="grow">
        <div>{label}</div>
        <div className="muted small">{hint}</div>
      </div>
    </div>
  );
  const days = (key: 'invoiceDueDays' | 'billDueDays', label: string) => (
    <div className="field">
      <label htmlFor={`al-${key}`}>{label}</label>
      <input id={`al-${key}`} className="input" type="number" min={0} max={60} value={s.alerts[key]} onChange={(e) => setS({ ...s, alerts: { ...s.alerts, [key]: Math.max(0, Math.min(60, Math.round(Number(e.target.value) || 0))) } })} />
      <span className="hint">0 turns the reminder off.</span>
    </div>
  );
  return (
    <>
      {business ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Approvals</h2>
          <Hint>When approval is on, records created by people who cannot approve wait as "Awaiting approval" until someone who can approves them. Nothing reaches the ledger before that. Owners, administrators, accountants and finance managers approve by default.</Hint>
          {approval('transactions', 'Transactions', 'Money in and out added by contributors.')}
          {approval('bills', 'Bills and purchase orders', 'Bills and purchase orders added by contributors.')}
          {approval('expenseClaims', 'Expense claims', 'Claims people make for money they spent.')}
          {approval('invoices', 'Invoices', 'Sales invoices drafted by contributors.')}
        </section>
      ) : (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Approvals</h2>
          {approval('transactions', 'Transactions need approval', 'Off by default at home: everyone records their own spending straight away.')}
        </section>
      )}
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Alerts</h2>
        <Hint>Alerts appear in the app's notifications, and by email for people who chose email in My notifications. Each is sent once.</Hint>
        {business ? (
          <>
            <div className="crm-form-grid">
              {days('invoiceDueDays', 'Remind before an invoice is due (days)')}
              {days('billDueDays', 'Remind before a bill is due (days)')}
            </div>
            {alert('overdueInvoices', 'Overdue invoices', 'A weekly reminder while a customer has not paid after the due date. Send the customer a reminder from your own email.')}
            {alert('overdueBills', 'Overdue bills', 'A weekly reminder while a bill or expense claim is unpaid after the due date.')}
          </>
        ) : null}
        {alert('budgets', 'Budget warnings', 'When spending in a category reaches the warning level of a budget.')}
        {alert('monthlySummary', 'Monthly summary', 'Income, expenses and the surplus or shortfall of the month just finished, early each month.')}
      </section>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Defaults</h2>
        <div className="crm-form-grid">
          {business ? (
            <div className="field">
              <label htmlFor="set-terms">Payment terms (days)</label>
              <input id="set-terms" className="input" type="number" min={0} max={365} value={s.termsDays} onChange={(e) => setS({ ...s, termsDays: Math.max(0, Math.min(365, Math.round(Number(e.target.value) || 0))) })} />
              <span className="hint">Due date of a new invoice or bill when the contact has no terms of its own.</span>
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="set-dup">Possible duplicates within (days)</label>
            <input id="set-dup" className="input" type="number" min={0} max={30} value={s.duplicateDays} onChange={(e) => setS({ ...s, duplicateDays: Math.max(0, Math.min(30, Math.round(Number(e.target.value) || 0))) })} />
            <span className="hint">A new transaction with the same amount on the same account within these days is pointed out. 0 turns it off.</span>
          </div>
        </div>
      </section>
      <div className="row">
        <button className="btn primary" disabled={!dirty || busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
        {dirty ? <button className="btn" onClick={() => setS(org.settings)}>Undo changes</button> : null}
      </div>
    </>
  );
}

// ------------------------------------------------------------------ my notifications

interface PrefDTO {
  type: string;
  label: string;
  inApp: boolean;
  email: boolean;
}

function NotificationPrefs() {
  const org = useCurrentOrg();
  const toast = useToast();
  const q = useQuery({ queryKey: ['fin', 'notification-prefs'], queryFn: () => get<PrefDTO[]>('/fin/me/notification-prefs') });
  const [prefs, setPrefs] = useState<PrefDTO[] | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (q.data) setPrefs(q.data);
  }, [q.data]);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!prefs) return <Loading />;
  const dirty = JSON.stringify(prefs) !== JSON.stringify(q.data);
  const set = (type: string, change: Partial<PrefDTO>) => setPrefs(prefs.map((p) => (p.type === type ? { ...p, ...change } : p)));
  const save = async () => {
    setBusy(true);
    try {
      await put('/fin/me/notification-prefs', prefs.map(({ type, inApp, email }) => ({ type, inApp, email })));
      toast('Saved');
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card card-pad stack">
      <Hint>Your own choices, for every Finance workspace you belong to. {org.emailConnected ? '' : 'Email is not connected for BIZOMAT yet, so for now notifications appear in the app only.'}</Hint>
      <div className="crm-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Notification</th>
              <th>In the app</th>
              <th>By email</th>
            </tr>
          </thead>
          <tbody>
            {prefs.map((p) => (
              <tr key={p.type}>
                <td>{p.label}</td>
                <td><Switch checked={p.inApp} onChange={(v) => set(p.type, { inApp: v })} label={`${p.label}: in the app`} /></td>
                <td><Switch checked={p.email} onChange={(v) => set(p.type, { email: v })} label={`${p.label}: by email`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button className="btn primary" disabled={!dirty || busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ audit trail

interface AuditEntry {
  id: string;
  action: string;
  actorId: string | null;
  actorName: string | null;
  targetType: string | null;
  targetId: string | null;
  before: unknown;
  after: unknown;
  metadata: Record<string, unknown>;
  createdAt: number;
}

const TARGET_TYPES: Record<string, string> = {
  transaction: 'Transactions',
  doc: 'Invoices, bills, orders and claims',
  account: 'Accounts',
  journal: 'Journals',
  contact: 'Contacts',
  budget: 'Budgets',
  recurring: 'Recurring records',
  tax_code: 'Tax codes',
  tracking: 'Departments and projects',
  file: 'Files',
  report: 'Reports',
  org: 'Workspace',
  user: 'Members',
  invitation: 'Invitations',
  role: 'Permissions',
};

/** "transaction.voided" to "Transaction voided". */
function actionText(action: string): string {
  const t = action.replace(/[._]/g, ' ').trim();
  return t ? t[0].toUpperCase() + t.slice(1) : action;
}

function details(e: AuditEntry): string {
  const parts: string[] = [];
  const show = (v: unknown) => (v && typeof v === 'object' && Object.keys(v as object).length ? JSON.stringify(v).slice(0, 200) : '');
  if (e.before) parts.push(`before ${show(e.before)}`);
  if (e.after) parts.push(`${e.before ? 'after ' : ''}${show(e.after)}`);
  if (Object.keys(e.metadata ?? {}).length) parts.push(show(e.metadata));
  return parts.filter((p) => p.trim()).join(' · ');
}

function AuditTrail() {
  const org = useCurrentOrg();
  const [type, setType] = useState('');
  const [pages, setPages] = useState<AuditEntry[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [done, setDone] = useState(false);
  const load = async (before: number | null, reset: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (type) qs.set('type', type);
      if (before) qs.set('before', String(before));
      const rows = await get<AuditEntry[]>(`${fin(org.id, '/audit')}?${qs.toString()}`);
      setPages((p) => (reset ? [rows] : [...p, rows]));
      setDone(rows.length < 100);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => void load(null, true), [type, org.id]);
  const rows = pages.flat();
  return (
    <section className="card stack">
      <div className="row fin-toolbar crm-pad">
        <Hint>Every change to the workspace and its records, who made it and when. Entries cannot be edited or deleted.</Hint>
        <span className="grow" />
        <select className="select" aria-label="Show changes to" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Everything</option>
          {Object.entries(TARGET_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      {error ? <ErrorBox error={error} retry={() => load(null, true)} /> : null}
      {!rows.length && loading ? (
        <Loading />
      ) : !rows.length ? (
        <EmptyState icon="history" title="Nothing recorded yet" />
      ) : (
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>What</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id}>
                  <td className="small">{dateTime(e.createdAt)}</td>
                  <td className="small">{e.actorName ?? (e.actorId ? 'Former member' : 'BIZOMAT (scheduled)')}</td>
                  <td className="small">{actionText(e.action)}</td>
                  <td className="small muted mono">{details(e)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length && !done ? (
        <div className="crm-pad">
          <button className="btn" disabled={loading} onClick={() => load(rows[rows.length - 1].createdAt, false)}>{loading ? 'Loading…' : 'Show older entries'}</button>
        </div>
      ) : null}
    </section>
  );
}

// ------------------------------------------------------------------ delete the workspace

function DangerZone() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const qc = useQueryClient();
  if (org.role !== 'owner') return <EmptyState icon="lock" title="Only the owner can delete the workspace" />;
  const remove = async () => {
    const ok = await confirm({
      title: `Delete ${org.name}?`,
      message: 'Every member loses access at once, pending invitations stop working, and recurring records and scheduled reports stop. The records stay stored and can be recovered by a BIZOMAT operator on request.',
      confirmLabel: 'Delete the workspace',
      danger: true,
      typeToConfirm: org.name,
    });
    if (!ok) return;
    try {
      await del(fin(org.id), { confirmName: org.name });
      toast(`${org.name} was deleted`);
      await qc.invalidateQueries({ queryKey: ['fin', 'orgs'] });
      navigate('/');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section className="card card-pad stack crm-danger-zone">
      <h2 className="crm-subhead">Delete the workspace</h2>
      <p className="muted small">Every member loses access at once and pending invitations stop working. The records stay stored and can be recovered by a BIZOMAT operator on request. To hand the workspace to someone else instead, transfer ownership in Team.</p>
      <div>
        <button className="btn danger" onClick={remove}>Delete {org.name}</button>
      </div>
    </section>
  );
}
