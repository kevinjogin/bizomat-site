// The CRM super admin console at /crm/admin: organisations, people and usage of BIZOMAT Customer Relationship
// Management, for platform admins (src/worker/routes/admin-products.ts). Usage only: no contact details, deal values,
// notes or files.
import { useState } from 'react';
import { Link, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { errorMessage, post } from '../../lib/api';
import { useDebounced } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { BRAND } from '../../lib/brand';
import { useAdmin, useRange, type Point } from '../api';
import { TimeChart } from '../charts';
import { Card, Empty, Kpi, PageIntro, QueryState, RangeSelect, TableWrap, When, fmtDate, num } from '../ui';
import { NotFound } from '../AdminApp';
import { ConsoleShell, HealthChecks, ROLE_LABELS, actionLabel, bytes, type AdminMe } from './ConsoleShell';

const NAV = [
  { to: '/admin', label: 'Overview', icon: 'chart', end: true },
  { to: '/admin/orgs', label: 'Organisations', icon: 'building' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/activity', label: 'Activity', icon: 'clock' },
  { to: '/admin/health', label: 'System health', icon: 'shield' },
];

interface OrgRow {
  id: string;
  name: string;
  industry: string;
  country: string;
  currency: string;
  createdAt: number;
  deletedAt: number | null;
  owner: { id: string; name: string; email: string } | null;
  members: number;
  leads: number;
  contacts: number;
  companies: number;
  deals: number;
  activities: number;
  lastActivityAt: number | null;
}

export default function CrmConsole() {
  return (
    <ConsoleShell product="Customer Relationship Management" productKey="crm" nav={NAV} privacy={<>Usage only: organisations, people and counts. Contact details, deal values, notes and files are never shown.</>}>
      {(me) => (
        <Routes>
          <Route index element={<Overview />} />
          <Route path="orgs" element={<Orgs />} />
          <Route path="orgs/:id" element={<OrgDetail me={me} />} />
          <Route path="users" element={<Users />} />
          <Route path="activity" element={<Activity />} />
          <Route path="health" element={<Health />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </ConsoleShell>
  );
}

const C = { brand: BRAND.colors.teal, blue: '#2a78d6', orange: '#eb6834' };

interface Overview {
  generatedAt: number;
  orgs: { active: number; deleted: number; createdInRange: number; activeInRange: number };
  members: number;
  records: { leads: number; convertedLeads: number; contacts: number; companies: number; notes: number; dealsOpen: number; dealsWon: number; dealsLost: number; activitiesOpen: number; activitiesDone: number; files: number; fileBytes: number };
  series: { orgsCreated: Point[]; recordsCreated: Point[]; events: Point[] };
  topOrgs: { id: string; name: string; events: number; members: number }[];
  recentOrgs: OrgRow[];
}

function Overview() {
  const [range, setRange] = useRange();
  const q = useAdmin<Overview>(`/crm/overview?range=${range}`, { refetchInterval: 60_000 });
  return (
    <div className="ac-stack">
      <PageIntro actions={<RangeSelect value={range} onChange={setRange} />}>
        <p className="muted">How the CRM is used: organisations, people and records, from live database records.{q.data ? <> Updated <When ts={q.data.generatedAt} />.</> : null}</p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const o = q.data!;
          const r = o.records;
          return (
            <>
              <div className="ac-kpis">
                <Kpi label="Organisations" value={o.orgs.active} icon="building" tone="brand" hint={`${num(o.orgs.createdInRange)} new in the period · ${num(o.orgs.deleted)} deleted`} />
                <Kpi label="Active organisations" value={o.orgs.activeInRange} icon="activity" hint="With any change in the period" />
                <Kpi label="People" value={o.members} icon="users" hint="Members of an organisation" />
                <Kpi label="Leads" value={r.leads} icon="funnel" hint={`${num(r.convertedLeads)} converted`} />
                <Kpi label="Contacts and companies" value={r.contacts + r.companies} icon="user" hint={`${num(r.contacts)} contacts · ${num(r.companies)} companies`} />
                <Kpi label="Deals" value={r.dealsOpen + r.dealsWon + r.dealsLost} icon="dollar" hint={`${num(r.dealsOpen)} open · ${num(r.dealsWon)} won · ${num(r.dealsLost)} lost`} />
                <Kpi label="Activities" value={r.activitiesOpen + r.activitiesDone} icon="checkSquare" hint={`${num(r.activitiesOpen)} to do · ${num(r.activitiesDone)} done`} />
                <Kpi label="Files" value={r.files} icon="file" hint={bytes(r.fileBytes)} />
              </div>
              <div className="ac-grid-2">
                <Card title="New organisations" subtitle="Created per day">
                  <TimeChart label="Organisations created per day" series={[{ name: 'Organisations', color: C.brand, points: o.series.orgsCreated }]} />
                </Card>
                <Card title="Records and changes" subtitle="Leads, contacts, companies and deals created; every change in the audit trail">
                  <TimeChart kind="line" label="Records created and changes per day" series={[{ name: 'Records created', color: C.blue, points: o.series.recordsCreated }, { name: 'Changes', color: C.orange, points: o.series.events }]} />
                </Card>
                <Card title="Most active organisations" subtitle="Changes in the period" actions={<Link className="btn sm" to="/admin/orgs">All organisations</Link>}>
                  {o.topOrgs.length ? (
                    <ul className="ac-list">
                      {o.topOrgs.map((x) => (
                        <li key={x.id}>
                          <Link to={`/admin/orgs/${x.id}`} className="grow ellipsis">{x.name}</Link>
                          <span className="ac-tag">{num(x.members)} member{x.members === 1 ? '' : 's'}</span>
                          <span className="muted small">{num(x.events)} changes</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No changes in this period.</Empty>
                  )}
                </Card>
                <Card title="Newest organisations">
                  {o.recentOrgs.length ? (
                    <ul className="ac-list">
                      {o.recentOrgs.map((x) => (
                        <li key={x.id}>
                          <Link to={`/admin/orgs/${x.id}`} className="grow ellipsis">{x.name}</Link>
                          {x.deletedAt ? <span className="ac-pill danger">Deleted</span> : null}
                          <span className="muted small ellipsis">{x.owner?.email ?? 'No owner'}</span>
                          <span className="muted small"><When ts={x.createdAt} /></span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No organisations yet.</Empty>
                  )}
                </Card>
              </div>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}

function Orgs() {
  const [q, setQ] = useState('');
  const dq = useDebounced(q.trim(), 300);
  const [status, setStatus] = useState('active');
  const [sort, setSort] = useState('activity');
  const res = useAdmin<{ orgs: OrgRow[] }>(`/crm/orgs?q=${encodeURIComponent(dq)}&status=${status}&sort=${sort}`, { placeholderData: (p) => p });
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">Every CRM organisation, its owner, its people and how many records it holds.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <label className="ac-search">
            <Icon name="search" />
            <input className="input" placeholder="Search organisation or member email" aria-label="Search organisations" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select className="select" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="deleted">Deleted</option>
            <option value="all">All</option>
          </select>
          <select className="select" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="activity">Most recent activity</option>
            <option value="created">Newest</option>
            <option value="members">Most members</option>
            <option value="records">Most records</option>
          </select>
        </div>
        <QueryState q={res}>
          {() => {
            const rows = res.data!.orgs;
            if (!rows.length) return <Empty>{dq ? 'No organisations match your search.' : 'No organisations here.'}</Empty>;
            return (
              <>
                <div className="muted small ac-count">{num(rows.length)} organisation{rows.length === 1 ? '' : 's'}</div>
                <TableWrap label="Organisations">
                  <thead>
                    <tr>
                      <th>Organisation</th>
                      <th>Owner</th>
                      <th className="num">Members</th>
                      <th className="num">Leads</th>
                      <th className="num">Contacts</th>
                      <th className="num">Companies</th>
                      <th className="num">Deals</th>
                      <th className="num">Activities</th>
                      <th>Last activity</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <div className="ac-user-cell">
                            <Link to={`/admin/orgs/${o.id}`} className="ac-user-name">{o.name}</Link>
                            <span className="muted small">{[o.industry, o.country, o.currency].filter(Boolean).join(' · ')}{o.deletedAt ? ' · deleted' : ''}</span>
                          </div>
                        </td>
                        <td className="ellipsis">{o.owner?.email ?? <span className="muted">None</span>}</td>
                        <td className="num">{num(o.members)}</td>
                        <td className="num">{num(o.leads)}</td>
                        <td className="num">{num(o.contacts)}</td>
                        <td className="num">{num(o.companies)}</td>
                        <td className="num">{num(o.deals)}</td>
                        <td className="num">{num(o.activities)}</td>
                        <td><When ts={o.lastActivityAt} /></td>
                        <td>{fmtDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              </>
            );
          }}
        </QueryState>
      </Card>
    </div>
  );
}

interface OrgDetailData {
  org: OrgRow & { website: string; timezone: string };
  members: { userId: string; name: string; email: string; role: string; joinedAt: number; lastActiveAt: number | null; disabled: boolean }[];
  invitations: { email: string; role: string; createdAt: number; status: string }[];
  leadsByStatus: { status: string; count: number }[];
  deals: { open: number; won: number; lost: number };
  activities: { open: number; done: number; overdue: number };
  automations: { total: number; enabled: number; runs30d: number; failed30d: number };
  files: { count: number; bytes: number };
  events: { id: string; action: string; targetType: string | null; at: number; actorEmail: string | null }[];
}

function OrgDetail({ me }: { me: AdminMe }) {
  const { id = '' } = useParams();
  const q = useAdmin<OrgDetailData>(`/crm/orgs/${id}`);
  const qc = useQueryClient();
  const confirm = useConfirm();
  const toast = useToast();
  const [newOwner, setNewOwner] = useState('');
  const refresh = () => qc.invalidateQueries({ predicate: (x) => x.queryKey[0] === 'admin' && String(x.queryKey[1]).startsWith('/crm/') });
  return (
    <div className="ac-stack">
      <QueryState q={q}>
        {() => {
          const d = q.data!;
          const o = d.org;
          const restore = async () => {
            if (!(await confirm({ title: `Restore ${o.name}?`, message: 'Its members can open it again at once. Its records were kept while it was deleted.', confirmLabel: 'Restore' }))) return;
            try {
              await post(`/admin/crm/orgs/${o.id}/restore`);
              toast('Organisation restored');
              refresh();
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
          };
          const transfer = async () => {
            const m = d.members.find((x) => x.userId === newOwner);
            if (!m) return;
            if (!(await confirm({ title: `Make ${m.name} the owner of ${o.name}?`, message: `${o.owner?.name ?? 'The current owner'} becomes an administrator. Use this when the owner cannot do it themselves, for example after leaving the business. It is recorded in the organisation's audit trail.`, confirmLabel: 'Hand over ownership', danger: true }))) return;
            try {
              await post(`/admin/crm/orgs/${o.id}/transfer`, { userId: m.userId });
              toast('Ownership handed over');
              setNewOwner('');
              refresh();
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
          };
          return (
            <>
              <PageIntro actions={<Link className="btn sm" to="/admin/orgs"><Icon name="chevronLeft" size={14} /> Organisations</Link>}>
                <h2 className="ac-h2">{o.name} {o.deletedAt ? <span className="ac-pill danger">Deleted <When ts={o.deletedAt} /></span> : null}</h2>
                <p className="muted">{[o.industry, o.country, o.currency, o.timezone].filter(Boolean).join(' · ')} · created {fmtDate(o.createdAt)} · last activity <When ts={o.lastActivityAt} /></p>
              </PageIntro>
              <div className="ac-kpis">
                <Kpi label="Members" value={o.members} icon="users" />
                <Kpi label="Leads" value={o.leads} icon="funnel" />
                <Kpi label="Contacts" value={o.contacts} icon="user" />
                <Kpi label="Companies" value={o.companies} icon="building" />
                <Kpi label="Deals" value={o.deals} icon="dollar" hint={`${num(d.deals.open)} open · ${num(d.deals.won)} won · ${num(d.deals.lost)} lost`} />
                <Kpi label="Activities" value={o.activities} icon="checkSquare" hint={`${num(d.activities.open)} to do · ${num(d.activities.overdue)} overdue`} tone={d.activities.overdue ? 'warning' : undefined} />
                <Kpi label="Automations" value={d.automations.enabled} icon="bolt" hint={`${num(d.automations.runs30d)} runs, ${num(d.automations.failed30d)} failed (30 days)`} tone={d.automations.failed30d ? 'danger' : undefined} />
                <Kpi label="Files" value={d.files.count} icon="file" hint={bytes(d.files.bytes)} />
              </div>
              <Card title="Support actions" subtitle="Recorded in the organisation's audit trail and the platform's.">
                <div className="ac-stack">
                  {o.deletedAt ? (
                    <div className="row wrap">
                      <span className="grow">The owner deleted this organisation. Restoring it gives its members access again.</span>
                      <button className="btn primary" onClick={restore}>Restore organisation</button>
                    </div>
                  ) : null}
                  {me.role === 'founder' ? (
                    <div className="row wrap">
                      <label htmlFor="new-owner" className="grow">Hand over ownership to a member</label>
                      <select id="new-owner" className="select" value={newOwner} onChange={(e) => setNewOwner(e.target.value)}>
                        <option value="">Choose a member</option>
                        {d.members.filter((m) => m.role !== 'owner' && !m.disabled).map((m) => <option key={m.userId} value={m.userId}>{m.name} ({ROLE_LABELS[m.role] ?? m.role})</option>)}
                      </select>
                      <button className="btn" disabled={!newOwner} onClick={transfer}>Hand over</button>
                    </div>
                  ) : (
                    <p className="muted small">Only the founder can hand over ownership.</p>
                  )}
                </div>
              </Card>
              <div className="ac-grid-2">
                <Card title="Members">
                  <TableWrap label="Members">
                    <thead><tr><th>Person</th><th>Role</th><th>Joined</th><th>Last active</th></tr></thead>
                    <tbody>
                      {d.members.map((m) => (
                        <tr key={m.userId}>
                          <td><div className="ac-user-cell"><a className="ac-user-name" href={`/tasks/admin/users/${m.userId}`}>{m.name}</a><span className="muted small">{m.email}{m.disabled ? ' · disabled' : ''}</span></div></td>
                          <td>{ROLE_LABELS[m.role] ?? m.role}</td>
                          <td>{fmtDate(m.joinedAt)}</td>
                          <td><When ts={m.lastActiveAt} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                </Card>
                <Card title="Records by status">
                  {d.leadsByStatus.length ? (
                    <ul className="ac-list">
                      {d.leadsByStatus.map((l) => <li key={l.status}><span className="grow">Leads: {l.status.replace(/_/g, ' ')}</span><span className="muted small">{num(l.count)}</span></li>)}
                    </ul>
                  ) : (
                    <Empty>No leads.</Empty>
                  )}
                </Card>
                <Card title="Invitations">
                  {d.invitations.length ? (
                    <TableWrap label="Invitations">
                      <thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Sent</th></tr></thead>
                      <tbody>{d.invitations.map((i, k) => <tr key={k}><td className="ellipsis">{i.email}</td><td>{ROLE_LABELS[i.role] ?? i.role}</td><td>{i.status}</td><td>{fmtDate(i.createdAt)}</td></tr>)}</tbody>
                    </TableWrap>
                  ) : (
                    <Empty>No invitations.</Empty>
                  )}
                </Card>
                <Card title="Recent changes" actions={<Link className="btn sm" to={`/admin/activity?org=${o.id}`}>All</Link>}>
                  {d.events.length ? (
                    <ul className="ac-list">
                      {d.events.map((e) => <li key={e.id}><span className="grow ellipsis">{actionLabel(e.action)}</span><span className="muted small ellipsis">{e.actorEmail ?? 'System'}</span><span className="muted small"><When ts={e.at} /></span></li>)}
                    </ul>
                  ) : (
                    <Empty>No changes recorded.</Empty>
                  )}
                </Card>
              </div>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}

function Users() {
  const [q, setQ] = useState('');
  const dq = useDebounced(q.trim(), 300);
  const res = useAdmin<{ users: { id: string; name: string; email: string; registeredAt: number; lastActiveAt: number | null; disabled: boolean; orgs: number; owned: number; firstJoinedAt: number; events30d: number }[] }>(`/crm/users?q=${encodeURIComponent(dq)}`, { placeholderData: (p) => p });
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">People who belong to a CRM organisation. Their account, sign-ins and sessions are in the Project Management console.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <label className="ac-search">
            <Icon name="search" />
            <input className="input" placeholder="Search name or email" aria-label="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </div>
        <QueryState q={res}>
          {() => {
            const rows = res.data!.users;
            if (!rows.length) return <Empty>{dq ? 'Nobody matches your search.' : 'Nobody uses the CRM yet.'}</Empty>;
            return (
              <>
                <div className="muted small ac-count">{num(rows.length)} {rows.length === 1 ? 'person' : 'people'}</div>
                <TableWrap label="Users">
                  <thead><tr><th>Person</th><th className="num">Organisations</th><th className="num">Owner of</th><th className="num">Changes (30 days)</th><th>Last active</th><th>First joined</th></tr></thead>
                  <tbody>
                    {rows.map((u) => (
                      <tr key={u.id}>
                        <td><div className="ac-user-cell"><a className="ac-user-name" href={`/tasks/admin/users/${u.id}`}>{u.name}</a><span className="muted small">{u.email}{u.disabled ? ' · disabled' : ''}</span></div></td>
                        <td className="num">{num(u.orgs)}</td>
                        <td className="num">{num(u.owned)}</td>
                        <td className="num">{num(u.events30d)}</td>
                        <td><When ts={u.lastActiveAt} /></td>
                        <td>{fmtDate(u.firstJoinedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              </>
            );
          }}
        </QueryState>
      </Card>
    </div>
  );
}

const ACTION_FILTERS = [
  ['', 'Every change'],
  ['org.', 'Organisation and settings'],
  ['member', 'Members'],
  ['invitation', 'Invitations'],
  ['lead', 'Leads'],
  ['contact', 'Contacts'],
  ['company', 'Companies'],
  ['deal', 'Deals'],
  ['activity', 'Activities'],
  ['import', 'Imports'],
  ['export', 'Exports'],
] as const;

function Activity() {
  const [params, setParams] = useSearchParams();
  const org = params.get('org') ?? '';
  const [action, setAction] = useState('');
  const [before, setBefore] = useState<number[]>([]);
  const cursor = before[before.length - 1];
  const res = useAdmin<{ events: { id: string; action: string; targetType: string | null; at: number; orgId: string; orgName: string | null; actorId: string | null; actorEmail: string | null }[]; nextBefore: number | null }>(
    `/crm/activity?limit=100${org ? `&org=${encodeURIComponent(org)}` : ''}${action ? `&action=${encodeURIComponent(action)}` : ''}${cursor ? `&before=${cursor}` : ''}`,
    { placeholderData: (p) => p },
  );
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">Every change recorded in the organisations' audit trails: who, what kind of change, and when. What was changed is not shown.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <select className="select" aria-label="Kind of change" value={action} onChange={(e) => { setAction(e.target.value); setBefore([]); }}>
            {ACTION_FILTERS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          {org ? <button className="btn sm" onClick={() => { params.delete('org'); setParams(params); setBefore([]); }}>One organisation <Icon name="x" size={12} /></button> : null}
        </div>
        <QueryState q={res}>
          {() => {
            const rows = res.data!.events;
            if (!rows.length) return <Empty>No changes match.</Empty>;
            return (
              <>
                <TableWrap label="Activity">
                  <thead><tr><th>When</th><th>Change</th><th>Organisation</th><th>By</th></tr></thead>
                  <tbody>
                    {rows.map((e) => (
                      <tr key={e.id}>
                        <td>{new Date(e.at).toLocaleString()}</td>
                        <td>{actionLabel(e.action)}</td>
                        <td>{e.orgName ? <Link to={`/admin/orgs/${e.orgId}`}>{e.orgName}</Link> : <span className="muted">Removed</span>}</td>
                        <td className="ellipsis">{e.actorEmail ?? <span className="muted">System</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="row ac-pager">
                  {before.length ? <button className="btn sm" onClick={() => setBefore((b) => b.slice(0, -1))}>Newer</button> : null}
                  <span className="grow" />
                  {res.data!.nextBefore ? <button className="btn sm" onClick={() => setBefore((b) => [...b, res.data!.nextBefore!])}>Older</button> : null}
                </div>
              </>
            );
          }}
        </QueryState>
      </Card>
    </div>
  );
}

interface HealthData {
  generatedAt: number;
  checks: { key: string; label: string; value: number; ok: boolean; hint: string }[];
  automations: { total: number; enabled: number };
  invitations: { pending: number; expired: number };
  unreadNotifications: number;
  overdueActivities: number;
  failedRuns: { id: string; orgId: string; orgName: string; automation: string | null; trigger: string; detail: string; at: number }[];
}

function Health() {
  const q = useAdmin<HealthData>('/crm/health', { refetchInterval: 60_000 });
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">Checks on the CRM's data and background work.{q.data ? <> Updated <When ts={q.data.generatedAt} />.</> : null}</p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const h = q.data!;
          return (
            <>
              <Card title="Checks"><HealthChecks checks={h.checks} /></Card>
              <div className="ac-kpis">
                <Kpi label="Automations on" value={h.automations.enabled} icon="bolt" hint={`of ${num(h.automations.total)}`} />
                <Kpi label="Invitations pending" value={h.invitations.pending} icon="mail" hint={`${num(h.invitations.expired)} expired unused`} />
                <Kpi label="Unread notifications" value={h.unreadNotifications} icon="bell" />
                <Kpi label="Overdue activities" value={h.overdueActivities} icon="clock" />
              </div>
              <Card title="Automation runs that failed" subtitle="The 20 most recent">
                {h.failedRuns.length ? (
                  <TableWrap label="Failed automation runs">
                    <thead><tr><th>When</th><th>Organisation</th><th>Automation</th><th>What went wrong</th></tr></thead>
                    <tbody>{h.failedRuns.map((r) => <tr key={r.id}><td>{new Date(r.at).toLocaleString()}</td><td><Link to={`/admin/orgs/${r.orgId}`}>{r.orgName}</Link></td><td>{r.automation ?? r.trigger}</td><td className="small">{r.detail || '—'}</td></tr>)}</tbody>
                  </TableWrap>
                ) : (
                  <Empty>No automation run has failed.</Empty>
                )}
              </Card>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
