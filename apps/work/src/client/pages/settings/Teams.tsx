import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../../lib/api';
import { isAdmin, useMembers, useWorkspace } from '../../lib/session';
import { Avatar, ColorSwatches, EmptyState, ErrorBox, Field, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';

interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  memberIds: string[];
}

export function TeamsSettings() {
  const ws = useWorkspace();
  const admin = isAdmin(ws.role);
  const q = useQuery({ queryKey: ['teams', ws.id], queryFn: () => get<Team[]>(`/workspaces/${ws.id}/teams`) });
  const members = useMembers(ws.id);
  const [editing, setEditing] = useState<Team | 'new' | null>(null);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const byId = new Map((members.data ?? []).map((m) => [m.id, m]));
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="grow">Teams</h2>
        {admin ? <button className="btn sm primary" onClick={() => setEditing('new')}><Icon name="plus" size={14} /> New team</button> : null}
      </div>
      {q.isLoading ? <Loading /> : null}
      {q.error ? <div className="card-pad"><ErrorBox error={q.error} /></div> : null}
      {q.data && q.data.length === 0 ? <EmptyState icon="users" title="No teams yet">Group members into teams such as Design or Engineering.</EmptyState> : null}
      <div className="list">
        {(q.data ?? []).map((t) => (
          <div key={t.id} className="list-row">
            <span className="icon-dot" style={{ background: t.color, width: 14, height: 14 }} />
            <span className="grow" style={{ minWidth: 0 }}>
              <strong>{t.name}</strong>
              {t.description ? <div className="muted small">{t.description}</div> : null}
            </span>
            <span className="avatar-stack" aria-label={`${t.memberIds.length} members`}>
              {t.memberIds.slice(0, 5).map((id) => {
                const m = byId.get(id);
                return m ? <Avatar key={id} name={m.name} id={id} url={m.avatarUrl} size="sm" /> : null;
              })}
            </span>
            <span className="muted small">{t.memberIds.length}</span>
            {admin ? (
              <>
                <button className="btn ghost icon sm" aria-label={`Edit ${t.name}`} onClick={() => setEditing(t)}><Icon name="edit" size={14} /></button>
                <button
                  className="btn ghost icon sm"
                  aria-label={`Delete ${t.name}`}
                  onClick={async () => {
                    if (!(await confirm({ title: `Delete team ${t.name}?`, danger: true, confirmLabel: 'Delete' }))) return;
                    try {
                      await del(`/workspaces/${ws.id}/teams/${t.id}`);
                      qc.invalidateQueries({ queryKey: ['teams', ws.id] });
                    } catch (e) {
                      toast(errorMessage(e), 'error');
                    }
                  }}
                >
                  <Icon name="trash" size={14} />
                </button>
              </>
            ) : null}
          </div>
        ))}
      </div>
      {editing ? <TeamDialog team={editing === 'new' ? null : editing} onClose={() => setEditing(null)} /> : null}
    </section>
  );
}

function TeamDialog({ team, onClose }: { team: Team | null; onClose: () => void }) {
  const ws = useWorkspace();
  const members = useMembers(ws.id);
  const [name, setName] = useState(team?.name ?? '');
  const [description, setDescription] = useState(team?.description ?? '');
  const [color, setColor] = useState(team?.color ?? '#0ea5e9');
  const [memberIds, setMemberIds] = useState<string[]>(team?.memberIds ?? []);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = { name: name.trim(), description, color, memberIds };
      if (team) await patch(`/workspaces/${ws.id}/teams/${team.id}`, body);
      else await post(`/workspaces/${ws.id}/teams`, body);
      qc.invalidateQueries({ queryKey: ['teams', ws.id] });
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    }
  };
  const list = (members.data ?? []).filter((m) => !filter || m.name.toLowerCase().includes(filter.toLowerCase()) || m.email.toLowerCase().includes(filter.toLowerCase()));
  return (
    <Modal title={team ? 'Edit team' : 'New team'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" form="team-form" disabled={!name.trim()}>Save</button></>}>
      <form id="team-form" onSubmit={submit}>
        <Field label="Team name" htmlFor="team-name"><input id="team-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></Field>
        <Field label="Description" htmlFor="team-desc"><input id="team-desc" className="input" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} /></Field>
        <Field label="Colour"><ColorSwatches value={color} onChange={setColor} /></Field>
        <Field label={`Members (${memberIds.length})`}>
          <input className="input sm" placeholder="Filter members…" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter members" />
          <div className="col" style={{ maxHeight: 220, overflow: 'auto', gap: 4, marginTop: 6 }}>
            {list.map((m) => (
              <label key={m.id} className="checkbox">
                <input type="checkbox" checked={memberIds.includes(m.id)} onChange={(e) => setMemberIds(e.target.checked ? [...memberIds, m.id] : memberIds.filter((x) => x !== m.id))} />
                <Avatar name={m.name} id={m.id} url={m.avatarUrl} size="sm" /> {m.name} <span className="muted small">{m.email}</span>
              </label>
            ))}
          </div>
        </Field>
        {error ? <div className="error-box">{error}</div> : null}
      </form>
    </Modal>
  );
}
