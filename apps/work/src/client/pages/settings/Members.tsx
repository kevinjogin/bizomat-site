import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { canEdit, isAdmin, useMembers, useSession, useUser, useWorkspace } from '../../lib/session';
import { timeAgo } from '../../lib/format';
import { Avatar, ErrorBox, Field, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { useConfirm, useToast } from '../../components/ui/overlays';
import type { WorkspaceRole } from '../../../shared/types';

const ROLE_HELP: Record<WorkspaceRole, string> = {
  owner: 'Full control, including deleting the workspace',
  admin: 'Manage members, settings, integrations and all boards',
  member: 'Create and edit boards, docs and dashboards',
  viewer: 'Read and comment only',
};

export function MembersSettings() {
  const ws = useWorkspace();
  const me = useUser();
  const admin = isAdmin(ws.role);
  const members = useMembers(ws.id);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const { refresh } = useSession();
  const navigate = useNavigate();
  const refreshMembers = () => qc.invalidateQueries({ queryKey: ['members', ws.id] });

  const changeRole = async (userId: string, role: WorkspaceRole) => {
    try {
      await patch(`/workspaces/${ws.id}/members/${userId}`, { role });
      refreshMembers();
      toast('Role updated');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const remove = async (userId: string, name: string) => {
    const self = userId === me.id;
    const ok = await confirm({
      title: self ? `Leave ${ws.name}?` : `Remove ${name}?`,
      message: self ? 'You will lose access to every board and document in this workspace.' : `${name} will lose access to this workspace immediately.`,
      danger: true,
      confirmLabel: self ? 'Leave workspace' : 'Remove member',
    });
    if (!ok) return;
    try {
      await del(`/workspaces/${ws.id}/members/${userId}`);
      if (self) {
        await refresh();
        navigate('/', { replace: true });
      } else {
        refreshMembers();
        toast('Member removed');
      }
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      {canEdit(ws.role) ? <InviteCard /> : null}
      <section className="card">
        <div className="card-header"><h2 className="grow">Members</h2><span className="badge">{members.data?.length ?? 0}</span></div>
        {members.isLoading ? <Loading /> : null}
        {members.error ? <div className="card-pad"><ErrorBox error={members.error} /></div> : null}
        <div className="list">
          {(members.data ?? []).map((m) => (
            <div key={m.id} className="list-row">
              <Avatar name={m.name} id={m.id} url={m.avatarUrl} />
              <span className="grow" style={{ minWidth: 0 }}>
                <strong>{m.name}</strong> {m.id === me.id ? <span className="badge accent">You</span> : null}
                <div className="muted small ellipsis">{m.email}</div>
              </span>
              {admin && (m.role !== 'owner' || ws.role === 'owner') ? (
                <select className="select sm" style={{ width: 'auto' }} value={m.role} aria-label={`Role for ${m.name}`} onChange={(e) => changeRole(m.id, e.target.value as WorkspaceRole)} title={ROLE_HELP[m.role]}>
                  {(['owner', 'admin', 'member', 'viewer'] as WorkspaceRole[]).filter((r) => r !== 'owner' || ws.role === 'owner').map((r) => (
                    <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              ) : (
                <span className="badge" title={ROLE_HELP[m.role]}>{m.role}</span>
              )}
              {m.id === me.id ? (
                <button className="btn sm" onClick={() => remove(m.id, m.name)}>Leave</button>
              ) : admin && (m.role !== 'owner' || ws.role === 'owner') ? (
                <button className="btn ghost icon sm" aria-label={`Remove ${m.name}`} onClick={() => remove(m.id, m.name)}><Icon name="trash" size={14} /></button>
              ) : null}
            </div>
          ))}
        </div>
      </section>
      {admin ? <PendingInvites /> : null}
    </div>
  );
}

function InviteCard() {
  const ws = useWorkspace();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'viewer' | 'admin'>('member');
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await post(`/workspaces/${ws.id}/invitations`, { email: email.trim(), role });
      setLink(r.inviteUrl);
      setEmail('');
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
          <Field label="Email address" htmlFor="inv-email">
            <input id="inv-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required />
          </Field>
        </div>
        <Field label="Role" htmlFor="inv-role">
          <select id="inv-role" className="select" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
            {isAdmin(ws.role) ? <option value="admin">Admin</option> : null}
          </select>
        </Field>
        <div className="field"><button className="btn primary" disabled={busy || !email.trim()}><Icon name="plus" /> Invite</button></div>
      </div>
      {error ? <div className="error-box" role="alert">{error}</div> : null}
      {link ? (
        <div className="info-box">
          <p style={{ marginBottom: 6 }}>
            Invitation created. Email delivery is not configured on this deployment, so share this link with the person directly (valid for 7 days):
          </p>
          <div className="token-reveal">{link}</div>
          <button type="button" className="btn sm" style={{ marginTop: 8 }} onClick={() => navigator.clipboard?.writeText(link).then(() => toast('Link copied'))}><Icon name="copy" size={14} /> Copy link</button>
        </div>
      ) : null}
    </form>
  );
}

function PendingInvites() {
  const ws = useWorkspace();
  const q = useQuery({ queryKey: ['invitations', ws.id], queryFn: () => get<any[]>(`/workspaces/${ws.id}/invitations`) });
  const qc = useQueryClient();
  const toast = useToast();
  const pending = (q.data ?? []).filter((i) => !i.accepted_at && !i.revoked_at && i.expires_at > Date.now());
  return (
    <section className="card">
      <div className="card-header"><h2 className="grow">Pending invitations</h2><span className="badge">{pending.length}</span></div>
      {q.isLoading ? <Loading /> : null}
      {q.data && pending.length === 0 ? <div className="card-pad muted small">No pending invitations.</div> : null}
      <div className="list">
        {pending.map((i) => (
          <div key={i.id} className="list-row">
            <Icon name="users" />
            <span className="grow">
              <strong>{i.email}</strong> <span className="badge">{i.role}</span>
              <div className="muted small">Invited by {i.invited_by_name} {timeAgo(i.created_at)} · expires {new Date(i.expires_at).toLocaleDateString()}</div>
            </span>
            <button
              className="btn sm"
              onClick={async () => {
                try {
                  await del(`/workspaces/${ws.id}/invitations/${i.id}`);
                  qc.invalidateQueries({ queryKey: ['invitations', ws.id] });
                  toast('Invitation revoked');
                } catch (e) {
                  toast(errorMessage(e), 'error');
                }
              }}
            >
              Revoke
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
