import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { isAdmin, useMembers, useSession, useUser, useWorkspace } from '../../lib/session';
import { timeAgo } from '../../lib/format';
import { Avatar, ErrorBox, Field, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { ROLE_HELP, ROLE_LABELS, ROLE_RANK } from '../../../shared/permissions';
import type { WorkspaceRole } from '../../../shared/types';
import '../../styles/platform.css';

interface DirectoryRow {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: WorkspaceRole;
  status: 'active' | 'suspended';
  joinedAt: number;
  lastActiveAt: number | null;
  invitedBy: string | null;
  projects: { id: string; name: string; role: string }[];
  taskGrants: number;
}

interface InvitationRow {
  id: string;
  email: string;
  role: WorkspaceRole;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  created_at: number;
  expires_at: number;
  last_sent_at: number | null;
  send_count: number;
  invited_by_name: string;
  grants: { kind: string; id: string }[];
  delivery: { status: string; error: string | null; event: string | null; sentAt: number | null } | null;
}

const ROLES: WorkspaceRole[] = ['owner', 'admin', 'project_manager', 'member', 'viewer', 'guest'];
const DELIVERY: Record<string, string> = {
  queued: 'Email queued for delivery',
  not_configured: 'Email is not configured on this deployment: share the link below',
  suppressed: 'Not emailed: this address bounced or was blocked earlier. Share the link below',
  invalid_address: 'Not emailed: the address looks invalid',
  duplicate: 'Already queued',
};

export function MembersSettings() {
  const ws = useWorkspace();
  const admin = isAdmin(ws.role);
  return (
    <div className="col" style={{ gap: 16 }}>
      {ROLE_RANK[ws.role] >= ROLE_RANK.project_manager || ws.role === 'member' ? <InviteCard /> : null}
      {admin ? <Directory /> : <SimpleList />}
      {admin ? <Invitations /> : null}
      <RoleGuide />
    </div>
  );
}

function RoleGuide() {
  return (
    <section className="card card-pad">
      <h2 style={{ marginBottom: 8 }}>Roles</h2>
      <table className="data-table">
        <tbody>
          {ROLES.map((r) => <tr key={r}><td style={{ width: 170 }}><strong>{ROLE_LABELS[r]}</strong></td><td className="small">{ROLE_HELP[r]}</td></tr>)}
        </tbody>
      </table>
      <p className="muted small" style={{ marginTop: 8 }}>Project access can be adjusted per person on each project (board settings, Permissions), and single tasks can be shared from a task's Access tab.</p>
    </section>
  );
}

function useLeave() {
  const ws = useWorkspace();
  const { refresh } = useSession();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  return async (userId: string) => {
    if (!(await confirm({ title: `Leave ${ws.name}?`, message: 'You will lose access to every board and document in this organisation.', danger: true, confirmLabel: 'Leave' }))) return;
    try {
      await del(`/workspaces/${ws.id}/members/${userId}`);
      await refresh();
      navigate('/', { replace: true });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
}

function SimpleList() {
  const ws = useWorkspace();
  const me = useUser();
  const members = useMembers(ws.id);
  const leave = useLeave();
  return (
    <section className="card">
      <div className="card-header"><h2 className="grow">Members</h2><span className="badge">{members.data?.length ?? 0}</span></div>
      {members.isLoading ? <Loading /> : members.error ? <div className="card-pad"><ErrorBox error={members.error} /></div> : null}
      <div className="list">
        {(members.data ?? []).map((m) => (
          <div key={m.id} className="list-row">
            <Avatar name={m.name} id={m.id} url={m.avatarUrl} />
            <span className="grow" style={{ minWidth: 0 }}><strong>{m.name}</strong> {m.id === me.id ? <span className="badge accent">You</span> : null}<div className="muted small ellipsis">{m.email}</div></span>
            <span className="badge" title={ROLE_HELP[m.role]}>{ROLE_LABELS[m.role]}</span>
            {m.id === me.id ? <button className="btn sm" onClick={() => leave(m.id)}>Leave</button> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function Directory() {
  const ws = useWorkspace();
  const me = useUser();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const leave = useLeave();
  const q = useQuery({ queryKey: ['directory', ws.id], queryFn: () => get<DirectoryRow[]>(`/workspaces/${ws.id}/members/directory`) });
  const [filter, setFilter] = useState('');
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['directory', ws.id] });
    qc.invalidateQueries({ queryKey: ['members', ws.id] });
  };
  const act = async (p: Promise<unknown>, msg: string) => {
    try {
      await p;
      refresh();
      toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const rows = (q.data ?? []).filter((m) => !filter || `${m.name} ${m.email}`.toLowerCase().includes(filter.toLowerCase()));
  return (
    <section className="card">
      <div className="card-header"><h2 className="grow">Members</h2><span className="badge">{q.data?.length ?? 0}</span></div>
      <div className="card-pad" style={{ paddingBottom: 0 }}><input className="input" placeholder="Find a member" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Find a member" /></div>
      {q.isLoading ? <Loading /> : q.error ? <div className="card-pad"><ErrorBox error={q.error} /></div> : (
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>Person</th><th>Role</th><th>Projects</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((m) => {
                const self = m.id === me.id;
                const canTouch = !self && (m.role !== 'owner' || ws.role === 'owner');
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="row" style={{ gap: 8 }}>
                        <Avatar name={m.name} id={m.id} url={m.avatarUrl} size="sm" />
                        <div style={{ minWidth: 0 }}>
                          <strong>{m.name}</strong> {self ? <span className="badge accent">You</span> : null}
                          <div className="muted small ellipsis">{m.email}</div>
                          <div className="muted small">Joined {timeAgo(m.joinedAt)}{m.invitedBy ? `, invited by ${m.invitedBy}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {canTouch ? (
                        <select className="select sm" value={m.role} aria-label={`Role for ${m.name}`} title={ROLE_HELP[m.role]} onChange={(e) => act(patch(`/workspaces/${ws.id}/members/${m.id}`, { role: e.target.value }), 'Role updated')}>
                          {ROLES.filter((r) => r !== 'owner' || ws.role === 'owner').map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                        </select>
                      ) : <span className="badge" title={ROLE_HELP[m.role]}>{ROLE_LABELS[m.role]}</span>}
                    </td>
                    <td className="small">
                      {m.projects.length ? m.projects.slice(0, 4).map((p) => <span key={p.id} className="badge" style={{ marginRight: 4 }} title={`${p.role}`}>{p.name}</span>) : <span className="muted">{m.role === 'guest' ? 'None shared' : 'Organisation projects'}</span>}
                      {m.projects.length > 4 ? <span className="muted"> +{m.projects.length - 4}</span> : null}
                      {m.taskGrants ? <div className="muted">{m.taskGrants} shared task(s)</div> : null}
                    </td>
                    <td>{m.status === 'suspended' ? <span className="badge danger">Suspended</span> : <span className="badge success">Active</span>}</td>
                    <td>
                      <div className="row" style={{ gap: 4, justifyContent: 'flex-end' }}>
                        {self ? <button className="btn sm" onClick={() => leave(m.id)}>Leave</button> : null}
                        {canTouch ? (
                          <button className="btn ghost sm" onClick={async () => {
                            const suspend = m.status === 'active';
                            if (suspend && !(await confirm({ title: `Suspend ${m.name}?`, message: 'They keep their account and history but cannot open anything in this organisation until restored.', confirmLabel: 'Suspend' }))) return;
                            act(post(`/workspaces/${ws.id}/members/${m.id}/suspend`, { suspended: suspend }), suspend ? 'Member suspended' : 'Member restored');
                          }}>{m.status === 'active' ? 'Suspend' : 'Restore'}</button>
                        ) : null}
                        {canTouch ? (
                          <button className="btn ghost icon sm" aria-label={`Remove ${m.name}`} onClick={async () => {
                            if (!(await confirm({ title: `Remove ${m.name}?`, message: `${m.name} loses access to this organisation, its projects and shared tasks immediately.`, danger: true, confirmLabel: 'Remove member' }))) return;
                            act(del(`/workspaces/${ws.id}/members/${m.id}`), 'Member removed');
                          }}><Icon name="trash" size={14} /></button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function InviteCard() {
  const ws = useWorkspace();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('member');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<{ link: string; delivery: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();
  const admin = isAdmin(ws.role);
  const roles: WorkspaceRole[] = admin ? ['admin', 'project_manager', 'member', 'viewer', 'guest'] : ['member', 'viewer', 'guest'];
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await post(`/workspaces/${ws.id}/invitations`, { email: email.trim(), role, ...(message.trim() ? { message: message.trim() } : {}) });
      setResult({ link: r.inviteUrl, delivery: r.emailDelivery, email: r.email });
      setEmail('');
      setMessage('');
      qc.invalidateQueries({ queryKey: ['invitations', ws.id] });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="card card-pad" onSubmit={submit}>
      <h2 style={{ marginBottom: 12 }}>Invite people</h2>
      <div className="row wrap" style={{ alignItems: 'flex-end' }}>
        <div className="grow" style={{ minWidth: 220 }}>
          <Field label="Email address" htmlFor="inv-email"><input id="inv-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required /></Field>
        </div>
        <Field label="Role" htmlFor="inv-role">
          <select id="inv-role" className="select" value={role} onChange={(e) => setRole(e.target.value as WorkspaceRole)}>
            {roles.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </Field>
        <div className="field"><button className="btn primary" disabled={busy || !email.trim()}><Icon name="plus" /> Invite</button></div>
      </div>
      <p className="muted small" style={{ marginTop: -4 }}>{ROLE_HELP[role]}</p>
      <Field label="Personal message (optional)" htmlFor="inv-msg"><textarea id="inv-msg" className="textarea" rows={2} maxLength={600} value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
      {error ? <div className="error-box" role="alert">{error}</div> : null}
      {result ? (
        <div className="info-box">
          <p style={{ marginBottom: 6 }}>Invitation to {result.email} created, valid for 7 days and usable once. {DELIVERY[result.delivery] ?? result.delivery}.</p>
          {result.delivery !== 'queued' ? (
            <>
              <div className="token-reveal">{result.link}</div>
              <button type="button" className="btn sm" style={{ marginTop: 8 }} onClick={() => navigator.clipboard?.writeText(result.link).then(() => toast('Link copied'))}><Icon name="copy" size={14} /> Copy link</button>
            </>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function Invitations() {
  const ws = useWorkspace();
  const q = useQuery({ queryKey: ['invitations', ws.id], queryFn: () => get<InvitationRow[]>(`/workspaces/${ws.id}/invitations`) });
  const qc = useQueryClient();
  const toast = useToast();
  const [show, setShow] = useState<'pending' | 'all'>('pending');
  const [link, setLink] = useState<{ id: string; url: string } | null>(null);
  const rows = (q.data ?? []).filter((i) => show === 'all' || i.status === 'pending');
  const refresh = () => qc.invalidateQueries({ queryKey: ['invitations', ws.id] });
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="grow">Invitations</h2>
        <select className="select sm" style={{ width: 'auto' }} value={show} onChange={(e) => setShow(e.target.value as 'pending' | 'all')} aria-label="Show invitations">
          <option value="pending">Pending</option>
          <option value="all">All</option>
        </select>
      </div>
      {q.isLoading ? <Loading /> : null}
      {q.data && rows.length === 0 ? <div className="card-pad muted small">No {show === 'pending' ? 'pending ' : ''}invitations.</div> : null}
      <div className="list">
        {rows.map((i) => {
          const status = i.delivery;
          return (
            <div key={i.id} className="list-row" style={{ alignItems: 'flex-start' }}>
              <Icon name="users" />
              <span className="grow" style={{ minWidth: 0 }}>
                <strong>{i.email}</strong> <span className="badge">{ROLE_LABELS[i.role]}</span>{' '}
                <span className={`badge${i.status === 'pending' ? ' accent' : i.status === 'accepted' ? ' success' : ''}`}>{i.status}</span>
                {i.grants?.length ? <span className="badge">{i.grants.length} shared item(s)</span> : null}
                <div className="muted small">Invited by {i.invited_by_name} {timeAgo(i.created_at)}{i.send_count > 1 ? `, sent ${i.send_count} times` : ''} · expires {new Date(i.expires_at).toLocaleDateString()}</div>
                {status ? <div className="muted small">Email: {status.status}{status.event ? ` (${status.event})` : ''}{status.error ? ` - ${status.error}` : ''}</div> : null}
                {link?.id === i.id ? <div className="token-reveal" style={{ marginTop: 6 }}>{link.url}</div> : null}
              </span>
              {i.status === 'pending' || i.status === 'expired' ? (
                <>
                  {i.status === 'pending' ? (
                    <button className="btn sm" onClick={async () => {
                      try {
                        const r = await post(`/workspaces/${ws.id}/invitations/${i.id}/resend`, {});
                        refresh();
                        if (r.emailDelivery !== 'queued') setLink({ id: i.id, url: r.inviteUrl });
                        toast(r.emailDelivery === 'queued' ? 'Invitation sent again (the earlier link no longer works)' : 'New link created (the earlier link no longer works)');
                      } catch (e) {
                        toast(errorMessage(e), 'error');
                      }
                    }}>Resend</button>
                  ) : null}
                  {i.status === 'pending' ? (
                    <button className="btn sm" onClick={async () => {
                      try {
                        await del(`/workspaces/${ws.id}/invitations/${i.id}`);
                        refresh();
                        toast('Invitation revoked');
                      } catch (e) {
                        toast(errorMessage(e), 'error');
                      }
                    }}>Revoke</button>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
