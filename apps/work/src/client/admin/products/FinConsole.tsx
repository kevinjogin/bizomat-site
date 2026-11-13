// The Finance super admin console at /finance/admin: workspaces, people, usage and ledger integrity of BIZOMAT
// Finance, for platform admins (src/worker/routes/admin-products.ts). Counts only: no amounts, balances, account
// names, payees or descriptions; personal and household workspaces appear by their kind, not their name.
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
  { to: '/admin/workspaces', label: 'Workspaces', icon: 'layers' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/activity', label: 'Activity', icon: 'clock' },
  { to: '/admin/health', label: 'System health', icon: 'shield' },
];

const KINDS: Record<string, string> = { personal: 'Personal', household: 'Household', business: 'Business' };

interface WsRow {
  id: string;
  label: string;
  kind: 'personal' | 'household' | 'business';
  currency: string;
  gstRegistered: boolean;
  createdAt: number;
  deletedAt: number | null;
  lockDate: string | null;
  owner: { id: string; name: string; email: string } | null;
  members: number;
  accounts: number;
  transactions: number;
  docs: number;
  journals: number;
  lastActivityAt: number | null;
}

export default function FinConsole() {
  return (
    <ConsoleShell product="Finance" productKey="finance" nav={NAV} privacy={<>Counts only: no amounts, balances, account names, payees or descriptions. Personal and household workspaces are shown by their kind, not their name.</>}>
      {(me) => (
        <Routes>
          <Route index element={<Overview />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="workspaces/:id" element={<WorkspaceDetail me={me} />} />
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
  workspaces: { active: number; deleted: number; createdInRange: number; activeInRange: number; personal: number; household: number; business: number; gstRegistered: number };
  members: number;
  records: Record<string, number>;
  series: { workspacesCreated: Point[]; recordsCreated: Point[]; events: Point[] };
  topWorkspaces: { id: string; label: string; kind: string; events: number; members: number }[];
  recentWorkspaces: WsRow[];
}

function Overview() {
  const [range, setRange] = useRange();
  const q = useAdmin<Overview>(`/fin/overview?range=${range}`, { refetchInterval: 60_000 });
  return (
    <div className="ac-stack">
      <PageIntro actions={<RangeSelect value={range} onChange={setRange} />}>
        <p className="muted">How Finance is used: workspaces, people and records, from live database records.{q.data ? <> Updated <When ts={q.data.generatedAt} />.</> : null}</p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const o = q.data!;
          const r = o.records;
          return (
            <>
              <div className="ac-kpis">
                <Kpi label="Workspaces" value={o.workspaces.active} icon="layers" tone="brand" hint={`${num(o.workspaces.personal)} personal · ${num(o.workspaces.household)} household · ${num(o.workspaces.business)} business`} />
                <Kpi label="Active workspaces" value={o.workspaces.activeInRange} icon="activity" hint={`${num(o.workspaces.createdInRange)} new in the period · ${num(o.workspaces.deleted)} deleted`} />
                <Kpi label="People" value={o.members} icon="users" hint="Members of a workspace" />
                <Kpi label="Registered for GST" value={o.workspaces.gstRegistered} icon="doc" hint="Business workspaces" />
                <Kpi label="Transactions posted" value={r.transactionsPosted} icon="list" hint={`${num(r.transactionsAwaiting)} awaiting approval · ${num(r.transactionsDraft)} drafts`} />
                <Kpi label="Invoices and bills" value={r.invoices + r.bills} icon="file" hint={`${num(r.invoices)} invoices · ${num(r.bills)} bills · ${num(r.purchaseOrders)} orders · ${num(r.expenseClaims)} claims`} />
                <Kpi label="Statement lines" value={r.statementLines} icon="building" hint={`${num(r.statementLinesMatched)} matched · ${num(r.statementLinesToMatch)} to match`} />
                <Kpi label="Journals posted" value={r.journalsPosted} icon="layers" hint={`${num(r.budgets)} budgets · ${num(r.goals)} goals · ${num(r.recurringActive)} recurring`} />
              </div>
              <div className="ac-grid-2">
                <Card title="New workspaces" subtitle="Created per day">
                  <TimeChart label="Workspaces created per day" series={[{ name: 'Workspaces', color: C.brand, points: o.series.workspacesCreated }]} />
                </Card>
                <Card title="Records and changes" subtitle="Transactions and documents created; every change in the audit trail">
                  <TimeChart kind="line" label="Records created and changes per day" series={[{ name: 'Records created', color: C.blue, points: o.series.recordsCreated }, { name: 'Changes', color: C.orange, points: o.series.events }]} />
                </Card>
                <Card title="Most active workspaces" subtitle="Changes in the period" actions={<Link className="btn sm" to="/admin/workspaces">All workspaces</Link>}>
                  {o.topWorkspaces.length ? (
                    <ul className="ac-list">
                      {o.topWorkspaces.map((x) => (
                        <li key={x.id}>
                          <Link to={`/admin/workspaces/${x.id}`} className="grow ellipsis">{x.label}</Link>
                          <span className="ac-tag">{KINDS[x.kind]}</span>
                          <span className="muted small">{num(x.events)} changes</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No changes in this period.</Empty>
                  )}
                </Card>
                <Card title="Newest workspaces">
                  {o.recentWorkspaces.length ? (
                    <ul className="ac-list">
                      {o.recentWorkspaces.map((x) => (
                        <li key={x.id}>
                          <Link to={`/admin/workspaces/${x.id}`} className="grow ellipsis">{x.label}</Link>
                          {x.deletedAt ? <span className="ac-pill danger">Deleted</span> : null}
                          <span className="muted small ellipsis">{x.owner?.email ?? 'No owner'}</span>
                          <span className="muted small"><When ts={x.createdAt} /></span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No workspaces yet.</Empty>
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

function Workspaces() {
  const [q, setQ] = useState('');
  const dq = useDebounced(q.trim(), 300);
  const [status, setStatus] = useState('active');
  const [kind, setKind] = useState('');
  const [sort, setSort] = useState('activity');
  const res = useAdmin<{ workspaces: WsRow[] }>(`/fin/workspaces?q=${encodeURIComponent(dq)}&status=${status}&kind=${kind}&sort=${sort}`, { placeholderData: (p) => p });
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">Every Finance workspace, its owner, its people and how much it is used. Search finds business names and members' email addresses.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <label className="ac-search">
            <Icon name="search" />
            <input className="input" placeholder="Search business name or member email" aria-label="Search workspaces" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select className="select" aria-label="Kind" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">Every kind</option>
            <option value="personal">Personal</option>
            <option value="household">Household</option>
            <option value="business">Business</option>
          </select>
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
            const rows = res.data!.workspaces;
            if (!rows.length) return <Empty>{dq ? 'No workspaces match your search.' : 'No workspaces here.'}</Empty>;
            return (
              <>
                <div className="muted small ac-count">{num(rows.length)} workspace{rows.length === 1 ? '' : 's'}</div>
                <TableWrap label="Workspaces">
                  <thead>
                    <tr>
                      <th>Workspace</th>
                      <th>Owner</th>
                      <th className="num">Members</th>
                      <th className="num">Accounts</th>
                      <th className="num">Transactions</th>
                      <th className="num">Invoices and bills</th>
                      <th className="num">Journals</th>
                      <th>Last activity</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((w) => (
                      <tr key={w.id}>
                        <td>
                          <div className="ac-user-cell">
                            <Link to={`/admin/workspaces/${w.id}`} className="ac-user-name">{w.label}</Link>
                            <span className="muted small">{KINDS[w.kind]} · {w.currency}{w.gstRegistered ? ' · GST' : ''}{w.deletedAt ? ' · deleted' : ''}</span>
                          </div>
                        </td>
                        <td className="ellipsis">{w.owner?.email ?? <span className="muted">None</span>}</td>
                        <td className="num">{num(w.members)}</td>
                        <td className="num">{num(w.accounts)}</td>
                        <td className="num">{num(w.transactions)}</td>
                        <td className="num">{num(w.docs)}</td>
                        <td className="num">{num(w.journals)}</td>
                        <td><When ts={w.lastActivityAt} /></td>
                        <td>{fmtDate(w.createdAt)}</td>
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

const DOC_LABELS: Record<string, string> = { invoice: 'Invoices', bill: 'Bills', purchase_order: 'Purchase orders', expense_claim: 'Expense claims' };

interface WsDetail {
  workspace: WsRow & { timezone: string; fyStartMonth: number; gstBasis: string | null };
  members: { userId: string; name: string; email: string; role: string; joinedAt: number; lastActiveAt: number | null; disabled: boolean }[];
  invitations: { email: string; role: string; createdAt: number; status: string }[];
  transactions: { posted: number; draft: number; awaiting: number; void: number };
  docs: { kind: string; status: string; count: number }[];
  statementLines: { total: number; toMatch: number };
  recurring: { active: number; pausedWithError: number };
  files: { count: number; bytes: number };
  ledger: { balanced: boolean; unbalancedJournals: number; unbalancedWorkspaces: number; staleDrafts: number };
  events: { id: string; action: string; targetType: string | null; at: number; actorEmail: string | null }[];
}

function WorkspaceDetail({ me }: { me: AdminMe }) {
  const { id = '' } = useParams();
  const q = useAdmin<WsDetail>(`/fin/workspaces/${id}`);
  const qc = useQueryClient();
  const confirm = useConfirm();
  const toast = useToast();
  const [newOwner, setNewOwner] = useState('');
  const refresh = () => qc.invalidateQueries({ predicate: (x) => x.queryKey[0] === 'admin' && String(x.queryKey[1]).startsWith('/fin/') });
  return (
    <div className="ac-stack">
      <QueryState q={q}>
        {() => {
          const d = q.data!;
          const w = d.workspace;
          const docsByKind = Object.entries(d.docs.reduce<Record<string, number>>((m, x) => ({ ...m, [x.kind]: (m[x.kind] ?? 0) + x.count }), {}));
          const restore = async () => {
            if (!(await confirm({ title: `Restore ${w.label}?`, message: 'Its members can open it again at once. Its records were kept while it was deleted. Recurring records and scheduled reports stay paused until someone switches them back on.', confirmLabel: 'Restore' }))) return;
            try {
              await post(`/admin/fin/workspaces/${w.id}/restore`);
              toast('Workspace restored');
              refresh();
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
          };
          const transfer = async () => {
            const m = d.members.find((x) => x.userId === newOwner);
            if (!m) return;
            if (!(await confirm({ title: `Make ${m.name} the owner?`, message: `${w.owner?.name ?? 'The current owner'} becomes an administrator. Use this when the owner cannot do it themselves. It is recorded in the workspace's audit trail.`, confirmLabel: 'Hand over ownership', danger: true }))) return;
            try {
              await post(`/admin/fin/workspaces/${w.id}/transfer`, { userId: m.userId });
              toast('Ownership handed over');
              setNewOwner('');
              refresh();
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
          };
          return (
            <>
              <PageIntro actions={<Link className="btn sm" to="/admin/workspaces"><Icon name="chevronLeft" size={14} /> Workspaces</Link>}>
                <h2 className="ac-h2">{w.label} {w.deletedAt ? <span className="ac-pill danger">Deleted <When ts={w.deletedAt} /></span> : null}</h2>
                <p className="muted">{KINDS[w.kind]} · {w.currency}{w.gstRegistered ? ` · GST (${w.gstBasis} basis)` : ''} · {w.timezone} · created {fmtDate(w.createdAt)} · last activity <When ts={w.lastActivityAt} />{w.lockDate ? ` · locked to ${w.lockDate}` : ''}</p>
              </PageIntro>
              <div className="ac-kpis">
                <Kpi label="Ledger" value={null} text={d.ledger.balanced ? 'Balanced' : 'Check'} tone={d.ledger.balanced ? 'success' : 'danger'} icon="shield" hint={`${num(d.ledger.unbalancedJournals)} unbalanced journals · ${num(d.ledger.staleDrafts)} lasting drafts`} />
                <Kpi label="Members" value={w.members} icon="users" />
                <Kpi label="Accounts" value={w.accounts} icon="building" />
                <Kpi label="Transactions" value={w.transactions} icon="list" hint={`${num(d.transactions.posted)} posted · ${num(d.transactions.awaiting)} awaiting · ${num(d.transactions.draft)} drafts`} />
                <Kpi label="Journals posted" value={w.journals} icon="layers" />
                <Kpi label="Statement lines" value={d.statementLines.total} icon="file" hint={`${num(d.statementLines.toMatch)} to match`} />
                <Kpi label="Recurring" value={d.recurring.active} icon="refresh" hint={`${num(d.recurring.pausedWithError)} paused by an error`} tone={d.recurring.pausedWithError ? 'warning' : undefined} />
                <Kpi label="Documents" value={d.files.count} icon="folder" hint={bytes(d.files.bytes)} />
              </div>
              <Card title="Support actions" subtitle="Recorded in the workspace's audit trail and the platform's.">
                <div className="ac-stack">
                  {w.deletedAt ? (
                    <div className="row wrap">
                      <span className="grow">The owner deleted this workspace. Restoring it gives its members access again.</span>
                      <button className="btn primary" onClick={restore}>Restore workspace</button>
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
                <Card title="Invoices, bills, orders and claims">
                  {docsByKind.length ? (
                    <ul className="ac-list">{docsByKind.map(([k, c]) => <li key={k}><span className="grow">{DOC_LABELS[k] ?? k}</span><span className="muted small">{num(c)}</span></li>)}</ul>
                  ) : (
                    <Empty>None.</Empty>
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
                <Card title="Recent changes" actions={<Link className="btn sm" to={`/admin/activity?org=${w.id}`}>All</Link>}>
                  {d.events.length ? (
                    <ul className="ac-list">{d.events.map((e) => <li key={e.id}><span className="grow ellipsis">{actionLabel(e.action)}</span><span className="muted small ellipsis">{e.actorEmail ?? 'System'}</span><span className="muted small"><When ts={e.at} /></span></li>)}</ul>
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
  const res = useAdmin<{ users: { id: string; name: string; email: string; lastActiveAt: number | null; disabled: boolean; workspaces: number; owned: number; personal: number; household: number; business: number; firstJoinedAt: number; events30d: number }[] }>(`/fin/users?q=${encodeURIComponent(dq)}`, { placeholderData: (p) => p });
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">People who belong to a Finance workspace. Their account, sign-ins and sessions are in the Project Management console.</p>
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
            if (!rows.length) return <Empty>{dq ? 'Nobody matches your search.' : 'Nobody uses Finance yet.'}</Empty>;
            return (
              <>
                <div className="muted small ac-count">{num(rows.length)} {rows.length === 1 ? 'person' : 'people'}</div>
                <TableWrap label="Users">
                  <thead><tr><th>Person</th><th className="num">Workspaces</th><th>Kinds</th><th className="num">Owner of</th><th className="num">Changes (30 days)</th><th>Last active</th><th>First joined</th></tr></thead>
                  <tbody>
                    {rows.map((u) => (
                      <tr key={u.id}>
                        <td><div className="ac-user-cell"><a className="ac-user-name" href={`/tasks/admin/users/${u.id}`}>{u.name}</a><span className="muted small">{u.email}{u.disabled ? ' · disabled' : ''}</span></div></td>
                        <td className="num">{num(u.workspaces)}</td>
                        <td className="small">{[u.personal ? `${u.personal} personal` : '', u.household ? `${u.household} household` : '', u.business ? `${u.business} business` : ''].filter(Boolean).join(' · ')}</td>
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
  ['org.', 'Workspace and settings'],
  ['member', 'Members'],
  ['invitation', 'Invitations'],
  ['transaction', 'Transactions'],
  ['doc', 'Invoices, bills, orders and claims'],
  ['payment', 'Payments'],
  ['journal', 'Journals'],
  ['account', 'Accounts and categories'],
  ['statement', 'Statements and reconciliation'],
  ['report', 'Reports'],
] as const;

function Activity() {
  const [params, setParams] = useSearchParams();
  const org = params.get('org') ?? '';
  const [action, setAction] = useState('');
  const [before, setBefore] = useState<number[]>([]);
  const cursor = before[before.length - 1];
  const res = useAdmin<{ events: { id: string; action: string; targetType: string | null; at: number; workspaceId: string; workspaceLabel: string | null; kind: string | null; actorEmail: string | null }[]; nextBefore: number | null }>(
    `/fin/activity?limit=100${org ? `&org=${encodeURIComponent(org)}` : ''}${action ? `&action=${encodeURIComponent(action)}` : ''}${cursor ? `&before=${cursor}` : ''}`,
    { placeholderData: (p) => p },
  );
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">Every change recorded in the workspaces' audit trails: who, what kind of change, and when. Amounts and details are not shown.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <select className="select" aria-label="Kind of change" value={action} onChange={(e) => { setAction(e.target.value); setBefore([]); }}>
            {ACTION_FILTERS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          {org ? <button className="btn sm" onClick={() => { params.delete('org'); setParams(params); setBefore([]); }}>One workspace <Icon name="x" size={12} /></button> : null}
        </div>
        <QueryState q={res}>
          {() => {
            const rows = res.data!.events;
            if (!rows.length) return <Empty>No changes match.</Empty>;
            return (
              <>
                <TableWrap label="Activity">
                  <thead><tr><th>When</th><th>Change</th><th>Workspace</th><th>By</th></tr></thead>
                  <tbody>
                    {rows.map((e) => (
                      <tr key={e.id}>
                        <td>{new Date(e.at).toLocaleString()}</td>
                        <td>{actionLabel(e.action)}</td>
                        <td>{e.workspaceLabel ? <Link to={`/admin/workspaces/${e.workspaceId}`}>{e.workspaceLabel}</Link> : <span className="muted">Removed</span>}</td>
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
  recurring: { active: number; pausedWithError: number };
  reportSchedules: { active: number; stopped: number };
  statementLinesToMatch: number;
  unreadNotifications: number;
  invitations: { pending: number; expired: number };
  pausedRecurring: { id: string; workspaceId: string; workspaceLabel: string; kind: string; error: string; nextDate: string; at: number }[];
}

function Health() {
  const q = useAdmin<HealthData>('/fin/health', { refetchInterval: 60_000 });
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">Checks on the ledger and Finance's background work. Each check is a count; no amount is read out.{q.data ? <> Updated <When ts={q.data.generatedAt} />.</> : null}</p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const h = q.data!;
          return (
            <>
              <Card title="Checks"><HealthChecks checks={h.checks} /></Card>
              <div className="ac-kpis">
                <Kpi label="Recurring records on" value={h.recurring.active} icon="refresh" hint={`${num(h.recurring.pausedWithError)} paused by an error`} />
                <Kpi label="Scheduled reports" value={h.reportSchedules.active} icon="chart" hint={`${num(h.reportSchedules.stopped)} stopped`} />
                <Kpi label="Statement lines to match" value={h.statementLinesToMatch} icon="building" />
                <Kpi label="Unread notifications" value={h.unreadNotifications} icon="bell" hint={`${num(h.invitations.pending)} invitations pending`} />
              </div>
              <Card title="Recurring records paused by an error" subtitle="The 20 most recent">
                {h.pausedRecurring.length ? (
                  <TableWrap label="Paused recurring records">
                    <thead><tr><th>When</th><th>Workspace</th><th>Kind</th><th>What went wrong</th><th>Next date</th></tr></thead>
                    <tbody>{h.pausedRecurring.map((r) => <tr key={r.id}><td>{new Date(r.at).toLocaleString()}</td><td><Link to={`/admin/workspaces/${r.workspaceId}`}>{r.workspaceLabel}</Link></td><td>{r.kind}</td><td className="small">{r.error}</td><td>{r.nextDate}</td></tr>)}</tbody>
                  </TableWrap>
                ) : (
                  <Empty>No recurring record is paused by an error.</Empty>
                )}
              </Card>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
