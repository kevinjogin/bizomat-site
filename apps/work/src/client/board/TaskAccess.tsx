// Share one task with specific people (for example an external contractor) without giving them the project, and set
// what they may do on it. Shown to people who manage the project's members or allocate its tasks.

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ROLE_LABELS, TASK_GRANT_LABELS, type TaskGrant } from '../../shared/permissions';
import type { BoardBundle, ItemDTO, WorkspaceRole } from '../../shared/types';
import { del, errorMessage, get, post, put } from '../lib/api';
import { useWorkspace } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { Avatar, ErrorBox, Field, Loading } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import '../styles/platform.css';

interface Grant {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  orgRole: WorkspaceRole;
  grant: TaskGrant;
}

const KEYS = Object.keys(TASK_GRANT_LABELS) as (keyof TaskGrant)[];
const DEFAULT_GRANT: TaskGrant = { canEdit: false, canUpdateStatus: true, canComment: true, canUpload: true, canManageAssignments: false, canViewFinance: false };

export function TaskAccessTab({ item, bundle, canViewFinance }: { item: ItemDTO; bundle: BoardBundle; canViewFinance: boolean }) {
  const ws = useWorkspace();
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['item-access', item.id], queryFn: () => get<Grant[]>(`/items/${item.id}/access`) });
  const [userId, setUserId] = useState('');
  const [grant, setGrant] = useState<TaskGrant>(DEFAULT_GRANT);
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const refresh = () => {
    q.refetch();
    qc.invalidateQueries({ queryKey: ['assignable', item.id] });
  };
  const save = async (uid: string, g: TaskGrant) => {
    try {
      await put(`/items/${item.id}/access/${uid}`, g);
      refresh();
      toast('Task access saved');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const remove = async (uid: string) => {
    try {
      await del(`/items/${item.id}/access/${uid}`);
      refresh();
      toast('Task access removed');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await post<{ inviteUrl: string; emailDelivery: string }>(`/workspaces/${ws.id}/invitations`, {
        email: email.trim(),
        role: 'guest',
        grants: [{ kind: 'item', id: item.id, canEdit: grant.canEdit, canUpdateStatus: grant.canUpdateStatus, canComment: grant.canComment, canUpload: grant.canUpload, canViewFinance: grant.canViewFinance }],
      });
      setEmail('');
      setInviteLink(r.emailDelivery === 'queued' ? null : r.inviteUrl);
      toast(r.emailDelivery === 'queued' ? 'Invitation emailed' : 'Invitation created: share the link');
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const granted = new Set((q.data ?? []).map((g) => g.userId));
  // People already on the project do not need task access; offer the others.
  const candidates = bundle.members.filter((m) => !granted.has(m.id) && (bundle.memberAccess?.[m.id] ?? 'none') === 'none');
  return (
    <div className="stack">
      <p className="muted small">People added here can open this task and its subitems without seeing the rest of {bundle.board.name}. Choose what they may do.</p>
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} /> : (
        <div className="list">
          {(q.data ?? []).map((g) => (
            <div key={g.userId} className="list-row" style={{ alignItems: 'flex-start' }}>
              <Avatar id={g.userId} name={g.name} url={g.avatarUrl} size="sm" />
              <div className="grow" style={{ minWidth: 0 }}>
                <strong>{g.name}</strong> <span className="badge">{ROLE_LABELS[g.orgRole]}</span>
                <div className="muted small ellipsis">{g.email}</div>
                <div className="check-grid" style={{ marginTop: 6 }}>
                  {KEYS.filter((k) => k !== 'canViewFinance' || canViewFinance).map((k) => (
                    <label key={k} className="checkbox"><input type="checkbox" checked={g.grant[k]} onChange={(e) => save(g.userId, { ...g.grant, [k]: e.target.checked })} /> {TASK_GRANT_LABELS[k]}</label>
                  ))}
                </div>
              </div>
              <button className="btn ghost icon sm" aria-label={`Remove ${g.name}'s access`} onClick={() => remove(g.userId)}><Icon name="trash" size={14} /></button>
            </div>
          ))}
          {!q.data?.length ? <div className="muted small">Nobody has access to this task alone.</div> : null}
        </div>
      )}
      <div className="card card-pad">
        <h3 style={{ marginBottom: 8 }}>Give a member access to this task</h3>
        <div className="check-grid" style={{ marginBottom: 8 }}>
          {KEYS.filter((k) => k !== 'canViewFinance' || canViewFinance).filter((k) => k !== 'canManageAssignments').map((k) => (
            <label key={k} className="checkbox"><input type="checkbox" checked={grant[k]} onChange={(e) => setGrant({ ...grant, [k]: e.target.checked })} /> {TASK_GRANT_LABELS[k]}</label>
          ))}
        </div>
        <div className="row">
          <select className="select grow" value={userId} onChange={(e) => setUserId(e.target.value)} aria-label="Member">
            <option value="">Choose a member without project access…</option>
            {candidates.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
          </select>
          <button className="btn primary" disabled={!userId} onClick={async () => { await save(userId, grant); setUserId(''); }}>Add</button>
        </div>
        <form onSubmit={invite} style={{ marginTop: 12 }}>
          <Field label="Or invite someone new (as a guest with access to this task only)" htmlFor="ta-email">
            <div className="row">
              <input id="ta-email" className="input grow" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contractor@company.com" required />
              <button className="btn" disabled={!email.trim()}><Icon name="plus" /> Invite</button>
            </div>
          </Field>
          {inviteLink ? <div className="info-box"><p style={{ marginBottom: 6 }}>Email is not configured, so share this link with them (valid 7 days, works once):</p><div className="token-reveal">{inviteLink}</div></div> : null}
        </form>
      </div>
    </div>
  );
}
