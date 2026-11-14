// Asset Management and Maintenance in BIZOMAT ERP (Stage 1): the section inside a company, at /erp/c/<company>/maintenance.
// Overview, Assets, Requests, Work orders and Settings (roles and the approval rule). The server
// (src/worker/maintenance) decides who may see and do what; these screens follow its answers.
import { useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, patch, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading, PageHeader, Switch } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import { ROLE_HINTS, ROLE_LABELS, dateText, localToday, mtPage, mtPath, useMtMe, type MtMe, type MtRequest, type MtRole, type WorkOrder } from './api';
import { PriorityBadge, RequestBadge, Section, WoBadge } from './common';
import { AssetDetail, AssetsPage } from './Assets';
import { NewRequestPage, RequestDetail, RequestsPage } from './Requests';
import { NewWorkOrderPage, WorkOrderDetail, WorkOrdersPage } from './WorkOrders';

export function MaintenanceArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const me = useMtMe(companyId);
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Maintenance" subtitle="Asset Management and Maintenance" />
          <section className="co-prompt">
            <p>You do not have access to maintenance in {companyName}. People in the company have access; people who only share a tool with it do not.</p>
          </section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening maintenance…" />;
  const m = me.data;
  const tabs: [string, string, string][] = [
    ['', 'Overview', 'home'],
    ['/assets', 'Assets', 'layers'],
    ['/requests', 'Requests', 'inbox'],
    ['/work-orders', 'Work orders', 'wrench'],
    ['/settings', 'Settings', 'settings'],
  ];
  return (
    <div className="page crm-page">
      <PageHeader title="Maintenance" subtitle={`Asset Management and Maintenance for ${m.company.name}. Your role: ${ROLE_LABELS[m.role]}.`} />
      <nav className="tabs mt-tabs" aria-label="Maintenance sections">
        {tabs.map(([to, label, icon]) => (
          <NavLink key={label} end={to === ''} to={mtPage(companyId, to)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
            <Icon name={icon} size={14} /> {label}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<Overview companyId={companyId} me={m} />} />
        <Route path="assets" element={<AssetsPage companyId={companyId} me={m} />} />
        <Route path="assets/:assetId" element={<AssetDetail companyId={companyId} me={m} />} />
        <Route path="requests" element={<RequestsPage companyId={companyId} me={m} />} />
        <Route path="requests/new" element={<NewRequestPage companyId={companyId} me={m} />} />
        <Route path="requests/:requestId" element={<RequestDetail companyId={companyId} me={m} />} />
        <Route path="work-orders" element={<WorkOrdersPage companyId={companyId} me={m} />} />
        <Route path="work-orders/new" element={<NewWorkOrderPage companyId={companyId} me={m} />} />
        <Route path="work-orders/:workOrderId" element={<WorkOrderDetail companyId={companyId} me={m} />} />
        <Route path="settings" element={<Settings companyId={companyId} me={m} />} />
        <Route path="*" element={<Navigate to={mtPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

// ------------------------------------------------------------------ overview

interface OverviewData {
  today: string;
  awaitingApproval: number;
  infoRequested: number;
  openRequests: number;
  myRequests: number;
  openWorkOrders: number;
  overdue: number;
  myWork: number;
  inProgress: number;
  onHold: number;
  completedNotClosed: number;
  assets: number;
  assetsDown: number;
  myTimers: { workOrderId: string; number: string; startedAt: number }[];
}

function Stat({ label, value, to, hint, tone }: { label: string; value: number; to: string; hint?: string; tone?: 'danger' }) {
  return (
    <Link to={to} className="card crm-stat">
      <span className="crm-stat-label">{label}</span>
      <span className={`crm-stat-value${tone && value ? ` ${tone}` : ''}`}>{value.toLocaleString()}</span>
      {hint ? <span className="crm-stat-hint">{hint}</span> : null}
    </Link>
  );
}

function Overview({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Maintenance');
  const today = localToday();
  const q = useQuery({ queryKey: ['mt', companyId, 'overview', today], queryFn: () => get<OverviewData>(mtPath(companyId, `/overview?today=${today}`)) });
  const manager = me.can.decide;
  const awaiting = useQuery({ queryKey: ['mt', companyId, 'requests', 'awaiting-top'], queryFn: () => get<{ requests: MtRequest[] }>(mtPath(companyId, '/requests?status=awaiting&limit=5&sort=priority')), enabled: manager });
  const mine = useQuery({ queryKey: ['mt', companyId, 'work-orders', 'mine-top', today], queryFn: () => get<{ workOrders: WorkOrder[] }>(mtPath(companyId, `/work-orders?mine=1&status=outstanding&sort=due&limit=5&today=${today}`)), enabled: me.role !== 'requester' });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const o = q.data;
  return (
    <div className="stack">
      <div className="row wrap">
        <Link className="btn primary lg" to={mtPage(companyId, '/requests/new')}><Icon name="alert" /> Report a fault</Link>
        {me.can.manageWork ? <Link className="btn lg" to={mtPage(companyId, '/work-orders/new')}><Icon name="wrench" /> New work order</Link> : null}
        {me.can.manageAssets ? <Link className="btn lg" to={mtPage(companyId, '/assets')}><Icon name="layers" /> Assets</Link> : null}
      </div>
      {o.myTimers.length ? (
        <div className="warn-box row wrap">
          <Icon name="clock" />
          <span className="grow">Your timer is running on {o.myTimers.map((t, i) => <span key={t.workOrderId}>{i ? ', ' : ''}<Link to={mtPage(companyId, `/work-orders/${t.workOrderId}`)}>{t.number}</Link></span>)}.</span>
        </div>
      ) : null}
      <div className="crm-stats">
        {manager ? <Stat label="Requests awaiting approval" value={o.awaitingApproval} to={mtPage(companyId, '/requests?view=awaiting')} hint={o.infoRequested ? `${o.infoRequested} waiting for more information` : undefined} /> : null}
        <Stat label="My open requests" value={o.myRequests} to={mtPage(companyId, '/requests?view=mine')} />
        {me.role !== 'requester' ? <Stat label="Open work orders" value={o.openWorkOrders} to={mtPage(companyId, '/work-orders?view=outstanding')} hint={`${o.inProgress} in progress, ${o.onHold} on hold`} /> : null}
        {me.role !== 'requester' ? <Stat label="Overdue" value={o.overdue} tone="danger" to={mtPage(companyId, '/work-orders?view=overdue')} hint="Past their due finish" /> : null}
        {me.role !== 'requester' ? <Stat label="My work" value={o.myWork} to={mtPage(companyId, '/work-orders?view=mine')} hint="Assigned to you" /> : null}
        {manager ? <Stat label="Completed, not closed" value={o.completedNotClosed} to={mtPage(companyId, '/work-orders?view=all&status=completed')} /> : null}
        <Stat label="Assets in the register" value={o.assets} to={mtPage(companyId, '/assets')} hint={o.assetsDown ? `${o.assetsDown} under maintenance or out of service` : undefined} />
      </div>
      <div className="mt-grid">
        {manager ? (
          <Section title="Awaiting approval" actions={<Link className="btn sm" to={mtPage(companyId, '/requests?view=awaiting')}>All</Link>}>
            {!awaiting.data ? <Loading /> : awaiting.data.requests.length ? (
              <ul className="mt-docs">
                {awaiting.data.requests.map((r) => (
                  <li key={r.id} className="row wrap">
                    <Link className="mt-num mt-primary" to={mtPage(companyId, `/requests/${r.id}`)}>{r.number}</Link>
                    <span className="grow small">{r.description}</span>
                    <PriorityBadge priority={r.priority} />
                    <RequestBadge status={r.status} />
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">Nothing is waiting for approval.</p>}
          </Section>
        ) : null}
        {me.role !== 'requester' ? (
          <Section title="My work" actions={<Link className="btn sm" to={mtPage(companyId, '/work-orders?view=mine')}>All</Link>}>
            {!mine.data ? <Loading /> : mine.data.workOrders.length ? (
              <ul className="mt-docs">
                {mine.data.workOrders.map((w) => (
                  <li key={w.id} className="row wrap">
                    <Link className="mt-num mt-primary" to={mtPage(companyId, `/work-orders/${w.id}`)}>{w.number}</Link>
                    <span className="grow small">{w.assetNumber} · {w.description}</span>
                    {w.dueFinish ? <span className={`small${w.dueFinish < today ? ' mt-overdue' : ''}`}>{dateText(w.dueFinish)}</span> : null}
                    <WoBadge status={w.status} />
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">Nothing is assigned to you.</p>}
          </Section>
        ) : (
          <Section title="What you can do here">
            <p className="small">Report a fault or ask for work with Report a fault. Only the description is needed; add the asset and a photo if you can. Follow your requests under Requests.</p>
          </Section>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ settings: roles and the approval rule

interface RolesData {
  kind: 'registered' | 'own' | 'demo';
  people: { id: string; name: string; email: string; companyRole: 'owner' | 'admin' | 'member'; role: MtRole; roleIsDefault: boolean }[];
}

function Settings({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Maintenance settings');
  const qc = useQueryClient();
  const toast = useToast();
  const roles = useQuery({ queryKey: ['mt', companyId, 'roles'], queryFn: () => get<RolesData>(mtPath(companyId, '/roles')), enabled: me.can.roles });
  const [busy, setBusy] = useState('');
  const setRole = async (userId: string, role: string) => {
    setBusy(userId);
    try {
      await put(mtPath(companyId, `/roles/${userId}`), { role: role === 'default' ? null : role });
      toast('Role saved');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy('');
    }
  };
  const setApproval = async (v: boolean) => {
    try {
      await patch(mtPath(companyId, '/settings'), { requireApproval: v });
      toast(v ? 'New requests need approval' : 'New requests go straight to submitted');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <Section title="Your role">
        <p><strong>{ROLE_LABELS[me.role]}</strong>: {ROLE_HINTS[me.role]}</p>
        {me.roleIsDefault ? <p className="muted small">This is the default for your place in {me.company.name}. A maintenance administrator can change it.</p> : null}
      </Section>
      <Section title="Approval of requests">
        <div className="row wrap">
          <Switch checked={me.approvalRequired} disabled={!me.can.roles} onChange={setApproval} label="New requests need approval" />
          <span className="grow">New requests need approval by a supervisor or administrator</span>
        </div>
        <p className="muted small">{me.approvalRequired ? 'New requests wait as Awaiting approval.' : 'New requests are Submitted straight away; a supervisor can still decline them.'}{me.can.roles ? '' : ' Only maintenance administrators change this.'}</p>
      </Section>
      {me.can.roles ? (
        <Section title="Maintenance roles">
          <ul className="mt-docs small">
            {(['admin', 'supervisor', 'technician', 'requester'] as MtRole[]).map((r) => <li key={r}><strong>{ROLE_LABELS[r]}</strong>: {ROLE_HINTS[r]}</li>)}
          </ul>
          {me.company.kind === 'demo' ? <p className="muted small">This is your example company: invented data, only for you, so you are its only person and its administrator.</p> : me.company.kind === 'own' ? <p className="muted small">This is your own company, so you are its only person and its administrator. Register a company to work with others.</p> : <p className="muted small">The company’s owner and administrators are maintenance administrators unless you choose otherwise; other people are requesters. The owner is always an administrator. People are added in the company area.</p>}
          {roles.error ? <ErrorBox error={roles.error} retry={() => roles.refetch()} /> : !roles.data ? <Loading /> : (
            <table className="data-table mt-table mt-roles">
              <thead><tr><th>Person</th><th>In the company</th><th>Maintenance role</th></tr></thead>
              <tbody>
                {roles.data.people.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Person"><strong>{p.name}</strong><div className="muted small">{p.email}</div></td>
                    <td data-label="In the company">{{ owner: 'Owner', admin: 'Administrator', member: 'Member' }[p.companyRole]}</td>
                    <td data-label="Maintenance role">
                      {p.companyRole === 'owner' ? <span>{ROLE_LABELS.admin} <span className="muted small">(always)</span></span> : (
                        <select className="select" aria-label={`Maintenance role of ${p.name}`} disabled={busy === p.id} value={p.roleIsDefault ? 'default' : p.role} onChange={(e) => void setRole(p.id, e.target.value)}>
                          <option value="default">Default ({ROLE_LABELS[p.companyRole === 'admin' ? 'admin' : 'requester']})</option>
                          {(['admin', 'supervisor', 'technician', 'requester'] as MtRole[]).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>
      ) : null}
      <Section title="Coming in later stages">
        <p className="small">Preventive maintenance plans, meter readings, inspections and prestart checks, spare parts and stocktakes, more than one site, QR code and barcode labels, and AI scheduling are planned. They are not built yet.</p>
      </Section>
    </div>
  );
}
