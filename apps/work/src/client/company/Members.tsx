// The Members page (owner's brief of 19 Nov 2026, Part 4; flag company_members_v2): Members | Invitations | Roles &
// Access | Activity, the invitation form (one, many or a CSV file), and the ownership transfer. Every rule is the
// server's (src/worker/company/members-routes.ts); this page only hides what the server would refuse. While the flag is
// off for the company the server answers 404 MEMBERS_V2_OFF and the earlier People page shows instead.
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, del, errorMessage, get, patch, post, put } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { EmptyState, Loading, PageHeader } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { co } from './lib';

type Role = 'owner' | 'admin' | 'manager' | 'employee' | 'read_only';
type Scope = 'all' | 'team' | 'own';
interface ModuleAccess {
  access: boolean;
  scope: Scope;
}
interface Member {
  userId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  title: string;
  status: 'active' | 'suspended';
  joinedAt: number;
  lastActiveAt: number | null;
  suspendReason: string | null;
  modules: Record<string, ModuleAccess> | null;
  sensitive: boolean | null;
  isMe: boolean;
}
interface Transfer {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromNewRole: Role;
  expiresAt: number;
}
interface TeamPage {
  members: Member[];
  total: number;
  page: number;
  pageSize: number;
  me: { userId: string; role: Role };
  can: { invite: boolean; manageMembers: boolean; manageAdmins: boolean; transferOwnership: boolean };
  pendingTransfer: Transfer | null;
}
interface RolesInfo {
  roles: { key: Role; label: string; defaultScope: Scope }[];
  capabilities: { key: string; label: string; allow: Record<Role, boolean | 'own' | 'config'> }[];
  modules: { key: string; label: string; scopeApplies: 'records' | 'changes' }[];
  scopes: { key: Scope; label: string }[];
  notes: string[];
}

export const ROLE_LABEL: Record<Role, string> = { owner: 'Owner', admin: 'Administrator', manager: 'Manager', employee: 'Employee', read_only: 'Read-only' };
const SCOPE_SHORT: Record<Scope, string> = { all: 'All', team: 'Team', own: 'Own' };

/** Whether the members work is on for the company (the Members API answers 404 MEMBERS_V2_OFF when it is not). */
export function useMembersV2(companyId: string) {
  const q = useQuery({
    queryKey: ['company', companyId, 'team-on'],
    queryFn: () => get<TeamPage>(`${co(companyId, '/team')}?pageSize=5`).then(() => true).catch((e) => (e instanceof ApiError && e.status === 404 ? false : Promise.reject(e))),
    staleTime: 60_000,
  });
  return q.data;
}

const useRoles = (id: string) => useQuery({ queryKey: ['company', id, 'team-roles'], queryFn: () => get<RolesInfo>(co(id, '/team/roles')), staleTime: 300_000 });

export function Members({ companyId, companyName }: { companyId: string; companyName: string }) {
  usePageTitle('Members');
  const [tab, setTab] = useState<'members' | 'invitations' | 'roles' | 'activity'>('members');
  const [filters, setFilters] = useState({ q: '', role: '', status: '', module: '', sort: 'role', page: 1 });
  const params = new URLSearchParams(Object.entries({ ...filters, page: String(filters.page) }).filter(([, v]) => v !== '') as [string, string][]);
  const q = useQuery({ queryKey: ['company', companyId, 'team', params.toString()], queryFn: () => get<TeamPage>(`${co(companyId, '/team')}?${params}`) });
  const roles = useRoles(companyId);
  const admin = q.data ? q.data.can.manageMembers : false;
  const tabs: [typeof tab, string][] = [
    ['members', 'Members'],
    ...(admin ? ([['invitations', 'Invitations']] as [typeof tab, string][]) : []),
    ['roles', 'Roles & Access'],
    ...(admin ? ([['activity', 'Activity']] as [typeof tab, string][]) : []),
  ];
  return (
    <div className="page crm-page">
      <PageHeader title="Members" subtitle="Who is in the company, their role, the modules they use and the records they see. Rules are enforced by the server for every module." />
      <TransferRequests />
      {q.data?.pendingTransfer ? <PendingTransfer companyId={companyId} t={q.data.pendingTransfer} me={q.data.me} members={q.data.members} /> : null}
      <div className="tabs" role="tablist" aria-label="Members">
        {tabs.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      {tab === 'members' ? (
        <MembersTab companyId={companyId} companyName={companyName} q={q} roles={roles.data} filters={filters} setFilters={setFilters} />
      ) : tab === 'invitations' ? (
        <InvitationsTab companyId={companyId} roles={roles.data} me={q.data?.me.role ?? 'admin'} />
      ) : tab === 'roles' ? (
        <RolesTab roles={roles.data} />
      ) : (
        <ActivityTab companyId={companyId} />
      )}
    </div>
  );
}

function MembersTab({ companyId, companyName, q, roles, filters, setFilters }: { companyId: string; companyName: string; q: ReturnType<typeof useQuery<TeamPage>>; roles?: RolesInfo; filters: any; setFilters: (f: any) => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [editing, setEditing] = useState<Member | null>(null);
  const [removing, setRemoving] = useState<Member | null>(null);
  const [transferTo, setTransferTo] = useState<Member | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ['company', companyId] });
  const act = async (fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  if (q.error) return <p className="warning-text">{errorMessage(q.error)}</p>;
  if (!q.data) return <Loading />;
  const d = q.data;
  const meRole = d.me.role;
  const manageable = (m: Member) => d.can.manageMembers && !m.isMe && m.role !== 'owner' && (meRole === 'owner' || m.role !== 'admin');
  const pages = Math.max(1, Math.ceil(d.total / d.pageSize));
  const set = (k: string, v: string) => setFilters({ ...filters, [k]: v, page: 1 });
  return (
    <section className="stack">
      <div className="co-members-filters">
        <input className="input" type="search" placeholder="Search name or email" aria-label="Search members" value={filters.q} onChange={(e) => set('q', e.target.value)} />
        <select className="select" aria-label="Role" value={filters.role} onChange={(e) => set('role', e.target.value)}>
          <option value="">Every role</option>
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
        <select className="select" aria-label="Status" value={filters.status} onChange={(e) => set('status', e.target.value)}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <select className="select" aria-label="Module" value={filters.module} onChange={(e) => set('module', e.target.value)}>
          <option value="">Any module</option>
          {roles?.modules.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
        <select className="select" aria-label="Sort" value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
          <option value="role">Sort by role</option>
          <option value="name">Sort by name</option>
          <option value="joined">Newest first</option>
          <option value="active">Last active</option>
        </select>
      </div>
      <div className="card crm-table-card">
        <div className="crm-table-scroll">
          <table className="data-table crm-table co-members-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Role</th>
                <th>Modules</th>
                <th>Records</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last active</th>
                {d.can.manageMembers ? <th aria-label="Actions" /> : null}
              </tr>
            </thead>
            <tbody>
              {d.members.map((m) => {
                const mods = m.modules ? Object.entries(m.modules) : [];
                const on = mods.filter(([, v]) => v.access).length;
                const scopes = Array.from(new Set(mods.filter(([, v]) => v.access).map(([, v]) => v.scope)));
                return (
                  <tr key={m.userId}>
                    <td>
                      <strong>{m.name}</strong>
                      {m.isMe ? <span className="muted small"> (you)</span> : null}
                      <div className="muted small">{m.email}{m.emailVerified ? '' : ' · email not confirmed'}{m.title ? ` · ${m.title}` : ''}</div>
                    </td>
                    <td>
                      {manageable(m) ? (
                        <select className="select" aria-label={`Role of ${m.name}`} value={m.role} onChange={(e) => act(() => patch(co(companyId, `/team/${m.userId}/role`), { role: e.target.value }), 'Role changed')}>
                          {meRole === 'owner' ? <option value="admin">Administrator</option> : null}
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                          <option value="read_only">Read-only</option>
                        </select>
                      ) : ROLE_LABEL[m.role]}
                    </td>
                    <td className="small">{m.modules ? (on === mods.length ? 'All modules' : `${on} of ${mods.length}`) : <span className="muted">Hidden</span>}</td>
                    <td className="small">{m.modules ? scopes.map((s) => SCOPE_SHORT[s]).join(', ') || 'None' : <span className="muted">Hidden</span>}</td>
                    <td className="small">{m.status === 'suspended' ? <span className="warning-text" title={m.suspendReason ?? ''}>Suspended</span> : 'Active'}</td>
                    <td className="small">{new Date(m.joinedAt).toLocaleDateString()}</td>
                    <td className="small">{m.lastActiveAt ? timeAgo(m.lastActiveAt) : <span className="muted">Not yet</span>}</td>
                    {d.can.manageMembers ? (
                      <td className="small">
                        <div className="co-members-actions">
                          {manageable(m) && m.role !== 'admin' ? <button className="btn ghost sm" onClick={() => setEditing(m)}>Access</button> : null}
                          {manageable(m) ? (
                            m.status === 'suspended' ? (
                              <button className="btn ghost sm" onClick={() => act(() => post(co(companyId, `/team/${m.userId}/reactivate`), {}), `${m.name} can use the company again`)}>Reactivate</button>
                            ) : (
                              <button className="btn ghost sm" onClick={async () => {
                                const reason = window.prompt(`Why suspend ${m.name}? Their records and other companies are not affected.`);
                                if (reason && reason.trim().length >= 3) await act(() => post(co(companyId, `/team/${m.userId}/suspend`), { reason: reason.trim() }), `${m.name} is suspended`);
                              }}>Suspend</button>
                            )
                          ) : null}
                          {manageable(m) ? <button className="btn ghost sm" onClick={() => setRemoving(m)}>Remove</button> : null}
                          {!m.emailVerified && !m.isMe ? (
                            <button className="btn ghost sm" onClick={() => act(() => post(co(companyId, `/team/${m.userId}/verification-reminder`), {}), 'Reminder sent')}>Remind to confirm email</button>
                          ) : null}
                          {d.can.transferOwnership && !m.isMe && m.status === 'active' && m.emailVerified && m.role !== 'read_only' && !d.pendingTransfer ? (
                            <button className="btn ghost sm" onClick={() => setTransferTo(m)}>Transfer ownership</button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!d.members.length ? <EmptyState icon="users" title="No one matches" /> : null}
      </div>
      <div className="co-members-pager">
        <span className="muted small">{d.total} {d.total === 1 ? 'member' : 'members'}</span>
        <button className="btn ghost sm" disabled={d.page <= 1} onClick={() => setFilters({ ...filters, page: d.page - 1 })}>Previous</button>
        <span className="small">Page {d.page} of {pages}</span>
        <button className="btn ghost sm" disabled={d.page >= pages} onClick={() => setFilters({ ...filters, page: d.page + 1 })}>Next</button>
        {!d.members.find((m) => m.isMe && m.role === 'owner') ? (
          <button className="btn ghost sm co-members-leave" onClick={async () => {
            if (await confirm({ title: 'Leave this company?', message: 'You lose access to its tools at once. Your records stay with the company.', confirmLabel: 'Leave', danger: true })) await act(() => post(co(companyId, '/leave'), {}), 'You left the company');
          }}>Leave the company</button>
        ) : null}
      </div>
      {editing && roles ? <AccessDialog companyId={companyId} m={editing} roles={roles} onClose={() => setEditing(null)} onSaved={refresh} /> : null}
      {removing ? <RemoveDialog companyId={companyId} m={removing} members={d.members} onClose={() => setRemoving(null)} onDone={refresh} /> : null}
      {transferTo ? <TransferDialog companyId={companyId} companyName={companyName} m={transferTo} onClose={() => setTransferTo(null)} onDone={refresh} /> : null}
    </section>
  );
}

function ModuleEditor({ roles, value, onChange }: { roles: RolesInfo; value: Record<string, ModuleAccess>; onChange: (v: Record<string, ModuleAccess>) => void }) {
  return (
    <table className="data-table">
      <thead>
        <tr><th>Module</th><th>Access</th><th>Records</th></tr>
      </thead>
      <tbody>
        {roles.modules.map((mod) => {
          const v = value[mod.key] ?? { access: true, scope: 'all' as Scope };
          return (
            <tr key={mod.key}>
              <td>{mod.label}<div className="muted small">{mod.scopeApplies === 'records' ? 'Scope limits what is seen' : 'Scope limits what can be changed'}</div></td>
              <td><input type="checkbox" aria-label={`Access to ${mod.label}`} checked={v.access} onChange={(e) => onChange({ ...value, [mod.key]: { ...v, access: e.target.checked } })} /></td>
              <td>
                <select className="select" aria-label={`Records in ${mod.label}`} value={v.scope} disabled={!v.access} onChange={(e) => onChange({ ...value, [mod.key]: { ...v, scope: e.target.value as Scope } })}>
                  {roles.scopes.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function AccessDialog({ companyId, m, roles, onClose, onSaved }: { companyId: string; m: Member; roles: RolesInfo; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [mods, setMods] = useState<Record<string, ModuleAccess>>(m.modules ?? {});
  const [sensitive, setSensitive] = useState(!!m.sensitive);
  const save = async () => {
    try {
      await put(co(companyId, `/team/${m.userId}/access`), { modules: mods, ...(m.role === 'manager' ? { sensitive } : {}) });
      toast('Access saved. It applies at once.');
      onSaved();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Modal title={`Access of ${m.name}`} onClose={onClose} wide footer={<><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn primary" onClick={save}>Save</button></>}>
      <ModuleEditor roles={roles} value={mods} onChange={setMods} />
      {m.role === 'manager' ? (
        <label className="row small"><input type="checkbox" checked={sensitive} onChange={(e) => setSensitive(e.target.checked)} /> Sees sensitive fields (costs, margins, rates, bank details)</label>
      ) : <p className="muted small">Only managers can be given sensitive fields; owners and administrators always see them.</p>}
    </Modal>
  );
}

function RemoveDialog({ companyId, m, members, onClose, onDone }: { companyId: string; m: Member; members: Member[]; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const items = useQuery({ queryKey: ['company', companyId, 'open-items', m.userId], queryFn: () => get<Record<string, number>>(co(companyId, `/team/${m.userId}/open-items`)) });
  const [to, setTo] = useState('');
  const total = items.data ? Object.values(items.data).reduce((s, n) => s + n, 0) : 0;
  const LABELS: Record<string, string> = { crmDeals: 'open deals', crmLeads: 'open leads', crmActivities: 'open activities', workOrders: 'open work orders', whsActions: 'open safety actions' };
  const remove = async () => {
    try {
      await post(co(companyId, `/team/${m.userId}/remove`), { reassignTo: to || null });
      toast(`${m.name} was removed`);
      onDone();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Modal title={`Remove ${m.name}?`} onClose={onClose} footer={<><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn danger" onClick={remove}>Remove</button></>}>
      <p>Their access to this company ends at once: its tools, its API tokens and live updates. The records they made stay with the company. Their other companies are not affected.</p>
      {!items.data ? <Loading /> : total ? (
        <>
          <p>{Object.entries(items.data).filter(([, n]) => n > 0).map(([k, n]) => `${n} ${LABELS[k] ?? k}`).join(', ')}.</p>
          <div className="field">
            <label htmlFor="reassign">Give them to</label>
            <select id="reassign" className="select" value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">Nobody (leave them unassigned)</option>
              {members.filter((x) => x.userId !== m.userId && x.status === 'active').map((x) => <option key={x.userId} value={x.userId}>{x.name}</option>)}
            </select>
          </div>
        </>
      ) : <p className="muted small">They have no open items.</p>}
    </Modal>
  );
}

function TransferDialog({ companyId, companyName, m, onClose, onDone }: { companyId: string; companyName: string; m: Member; onClose: () => void; onDone: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ newRole: 'admin', companyName: '', password: '', code: '' });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await post(co(companyId, '/team/transfer'), { toUserId: m.userId, newRole: f.newRole, companyName: f.companyName, password: f.password, ...(f.code ? { code: f.code } : {}) });
      toast(`${m.name} has been asked. Ownership moves when they accept.`);
      onDone();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Modal title={`Transfer ownership to ${m.name}`} onClose={onClose} footer={<><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn danger" type="submit" form="transfer-form">Ask {m.name}</button></>}>
      <form id="transfer-form" className="stack" onSubmit={submit}>
        <p>{m.name} becomes the owner of {companyName} when they accept, within 7 days. You can cancel before then. Who created each record does not change.</p>
        <div className="field">
          <label htmlFor="tr-role">Your role afterwards</label>
          <select id="tr-role" className="select" value={f.newRole} onChange={(e) => setF({ ...f, newRole: e.target.value })}>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="read_only">Read-only</option>
          </select>
        </div>
        <div className="field"><label htmlFor="tr-name">Type the company’s name to confirm</label><input id="tr-name" className="input" value={f.companyName} onChange={(e) => setF({ ...f, companyName: e.target.value })} placeholder={companyName} /></div>
        <div className="field"><label htmlFor="tr-pw">Your password</label><input id="tr-pw" className="input" type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        <div className="field"><label htmlFor="tr-code">Code from your authenticator app <span className="muted small">(if you use two-factor sign-in)</span></label><input id="tr-code" className="input" inputMode="numeric" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></div>
      </form>
    </Modal>
  );
}

function PendingTransfer({ companyId, t, me, members }: { companyId: string; t: Transfer; me: { userId: string; role: Role }; members: Member[] }) {
  const qc = useQueryClient();
  const toast = useToast();
  const to = members.find((x) => x.userId === t.toUserId)?.name ?? 'a member';
  if (me.role !== 'owner') return null;
  return (
    <div className="info-box row" role="status">
      <span>Ownership transfer to {to} is waiting for their answer, until {new Date(t.expiresAt).toLocaleDateString()}.</span>
      <button className="btn ghost sm" onClick={async () => {
        try {
          await del(co(companyId, '/team/transfer'));
          toast('Transfer cancelled');
          await qc.invalidateQueries({ queryKey: ['company', companyId] });
        } catch (e) {
          toast(errorMessage(e), 'error');
        }
      }}>Cancel the transfer</button>
    </div>
  );
}

/** Requests to the signed-in person to become an owner (shown on the Members page and the company list). */
export function TransferRequests() {
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['company', 'transfers-mine'], queryFn: () => get<{ transfers: (Transfer & { companyId: string; company: string; from: string | null })[] }>('/company/transfers/mine') });
  if (!q.data?.transfers.length) return null;
  const answer = async (id: string, what: 'accept' | 'decline') => {
    try {
      await post(`/company/transfers/${id}/${what}`, {});
      toast(what === 'accept' ? 'You are now the owner' : 'Declined');
      await qc.invalidateQueries({ queryKey: ['company'] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <>
      {q.data.transfers.map((t) => (
        <div key={t.id} className="info-box row" role="status">
          <span>{t.from ?? 'The owner'} asks you to become the owner of {t.company}. You would manage its members and settings, and could transfer it again.</span>
          <button className="btn primary sm" onClick={() => answer(t.id, 'accept')}>Accept</button>
          <button className="btn ghost sm" onClick={() => answer(t.id, 'decline')}>Decline</button>
        </div>
      ))}
    </>
  );
}

function InvitationsTab({ companyId, roles, me }: { companyId: string; roles?: RolesInfo; me: Role }) {
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery({ queryKey: ['company', companyId, 'invitations'], queryFn: () => get<any[]>(co(companyId, '/invitations')) });
  const [f, setF] = useState({ emails: '', role: 'employee', message: '' });
  const [mods, setMods] = useState<Record<string, ModuleAccess>>({});
  const [showAccess, setShowAccess] = useState(false);
  const [results, setResults] = useState<{ email: string; status: string; message?: string }[] | null>(null);
  const emails = f.emails.split(/[\s,;]+/).map((x) => x.trim()).filter(Boolean);
  const fromCsv = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const found = Array.from(new Set(text.match(/[^\s,;"'<>]+@[^\s,;"'<>]+\.[^\s,;"'<>]+/g) ?? []));
    setF({ ...f, emails: [...emails, ...found].join(', ') });
    toast(`${found.length} addresses read from the file`);
  };
  const send = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const r = await post<{ results: { email: string; status: string; message?: string }[] }>(co(companyId, '/team/invitations'), { emails, role: f.role, message: f.message, ...(showAccess ? { modules: mods } : {}) });
      setResults(r.results);
      setF({ ...f, emails: '' });
      await qc.invalidateQueries({ queryKey: ['company', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const WORDS: Record<string, string> = { sent: 'Invited', invalid: 'Not sent', already_member: 'Already a member', already_invited: 'Already invited', limit: 'Not sent: limit reached' };
  return (
    <section className="stack">
      <form className="card card-pad stack" onSubmit={send}>
        <h2 className="crm-subhead">Invite people</h2>
        <div className="field">
          <label htmlFor="inv-emails">Email addresses (one or many, separated by commas)</label>
          <textarea id="inv-emails" className="input" rows={3} value={f.emails} onChange={(e) => setF({ ...f, emails: e.target.value })} />
          <span className="hint">Or read them from a CSV file: <input type="file" accept=".csv,text/csv,text/plain" aria-label="CSV file of email addresses" onChange={fromCsv} /></span>
        </div>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="inv-role">Role</label>
            <select id="inv-role" className="select" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
              {me === 'owner' ? <option value="admin">Administrator</option> : null}
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="read_only">Read-only</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="inv-msg">Personal message <span className="muted small">(optional)</span></label>
            <input id="inv-msg" className="input" maxLength={1000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          </div>
        </div>
        <label className="row small"><input type="checkbox" checked={showAccess} onChange={(e) => setShowAccess(e.target.checked)} /> Choose modules and records now (otherwise the role’s defaults)</label>
        {showAccess && roles ? <ModuleEditor roles={roles} value={mods} onChange={setMods} /> : null}
        <div className="row">
          <button className="btn primary" type="submit" disabled={!emails.length}>Invite {emails.length > 1 ? `${emails.length} people` : ''}</button>
          <span className="muted small">Invitations work once, only for the address they were sent to, and expire after 7 days.</span>
        </div>
        {results ? (
          <ul className="small">
            {results.map((r) => <li key={r.email}>{r.email}: {WORDS[r.status] ?? r.status}{r.message ? ` (${r.message})` : ''}</li>)}
          </ul>
        ) : null}
      </form>
      <div className="card crm-table-card">
        <table className="data-table crm-table">
          <thead><tr><th>Email</th><th>Role</th><th>Sent</th><th>Expires</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {(list.data ?? []).map((i) => (
              <tr key={i.id}>
                <td>{i.email}</td>
                <td>{ROLE_LABEL[(i.role === 'member' ? 'employee' : i.role) as Role] ?? i.role}</td>
                <td className="small">{timeAgo(i.createdAt)}{i.inviter ? ` by ${i.inviter}` : ''}</td>
                <td className="small">{i.expired ? <span className="warning-text">Expired</span> : new Date(i.expiresAt).toLocaleDateString()}</td>
                <td className="small">
                  <div className="row">
                    <button className="btn ghost sm" onClick={async () => {
                      try {
                        await post(co(companyId, `/team/invitations/${i.id}/resend`), {});
                        toast('Sent again with a new link');
                        await qc.invalidateQueries({ queryKey: ['company', companyId, 'invitations'] });
                      } catch (e) {
                        toast(errorMessage(e), 'error');
                      }
                    }}>Resend</button>
                    <button className="btn ghost sm" onClick={async () => {
                      try {
                        await del(co(companyId, `/invitations/${i.id}`));
                        toast('Invitation revoked');
                        await qc.invalidateQueries({ queryKey: ['company', companyId, 'invitations'] });
                      } catch (e) {
                        toast(errorMessage(e), 'error');
                      }
                    }}>Revoke</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.data && !list.data.length ? <EmptyState icon="mail" title="No invitations waiting" /> : null}
      </div>
    </section>
  );
}

function RolesTab({ roles }: { roles?: RolesInfo }) {
  if (!roles) return <Loading />;
  const mark = (v: boolean | 'own' | 'config'): ReactNode => (v === true ? 'Yes' : v === 'own' ? 'Own records' : v === 'config' ? 'If given' : <span className="muted">No</span>);
  return (
    <section className="stack">
      <div className="card crm-table-card">
        <div className="crm-table-scroll">
          <table className="data-table crm-table">
            <thead>
              <tr><th>What</th>{roles.roles.map((r) => <th key={r.key}>{r.label}</th>)}</tr>
            </thead>
            <tbody>
              {roles.capabilities.map((c) => (
                <tr key={c.key}><td>{c.label}</td>{roles.roles.map((r) => <td key={r.key} className="small">{mark(c.allow[r.key])}</td>)}</tr>
              ))}
              <tr><td>Records seen by default</td>{roles.roles.map((r) => <td key={r.key} className="small">{SCOPE_SHORT[r.defaultScope]}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </div>
      <ul className="small muted">{roles.notes.map((n) => <li key={n}>{n}</li>)}</ul>
      <p className="muted small">Custom roles are planned for a later stage; these are the defaults every company has.</p>
    </section>
  );
}

const ACTION_WORDS: Record<string, string> = {
  'member.role_changed': 'changed the role of',
  'member.access_changed': 'changed the access of',
  'member.suspended': 'suspended',
  'member.reactivated': 'reactivated',
  'member.removed': 'removed',
  'member.left': 'left the company',
  'member.items_reassigned': 'reassigned the open items of',
  'member.verification_reminded': 'reminded to confirm their email',
  'member.added': 'added',
  'invitation.created': 'sent an invitation',
  'invitation.resent': 'sent an invitation again',
  'invitation.revoked': 'revoked an invitation',
  'invitation.accepted': 'joined',
  'invitation.declined': 'declined an invitation',
  'ownership.transfer_requested': 'asked to transfer ownership to',
  'ownership.transfer_cancelled': 'cancelled the ownership transfer to',
  'ownership.transfer_declined': 'declined to become owner',
  'ownership.transfer_expired': 'ownership transfer expired for',
  'ownership.transferred': 'became the owner',
  'ownership.forced_transfer': 'transferred ownership (BIZOMAT recovery) to',
};

function ActivityTab({ companyId }: { companyId: string }) {
  const [page, setPage] = useState(1);
  const q = useQuery({ queryKey: ['company', companyId, 'team-activity', page], queryFn: () => get<{ events: any[]; more: boolean }>(`${co(companyId, '/team/activity')}?page=${page}`) });
  if (!q.data) return <Loading />;
  return (
    <section className="stack">
      <div className="card crm-table-card">
        <table className="data-table crm-table">
          <thead><tr><th>When</th><th>Who</th><th>What</th><th>Details</th></tr></thead>
          <tbody>
            {q.data.events.map((e) => (
              <tr key={e.id}>
                <td className="small">{timeAgo(e.at)}</td>
                <td>{e.actor ?? 'BIZOMAT'}</td>
                <td>{ACTION_WORDS[e.action] ?? e.action} {e.targetType === 'user' && e.target ? <strong>{e.target}</strong> : null}</td>
                <td className="small muted">{detailWords(e.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!q.data.events.length ? <EmptyState icon="list" title="Nothing yet" /> : null}
      </div>
      <div className="row">
        <button className="btn ghost sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Newer</button>
        <button className="btn ghost sm" disabled={!q.data.more} onClick={() => setPage(page + 1)}>Older</button>
      </div>
    </section>
  );
}

function detailWords(d: Record<string, any>): string {
  if (!d) return '';
  if (d.from && d.to && typeof d.from === 'string') return `${ROLE_LABEL[d.from as Role] ?? d.from} to ${ROLE_LABEL[d.to as Role] ?? d.to}`;
  if (d.reason) return `Reason: ${d.reason}`;
  if (d.changes) return Object.keys(d.changes).join(', ');
  if (d.role) return ROLE_LABEL[(d.role === 'member' ? 'employee' : d.role) as Role] ?? d.role;
  return '';
}
