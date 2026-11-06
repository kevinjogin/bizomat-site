import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { BoardBundle, BoardRole } from '../../shared/types';
import { del, errorMessage, patch, post, put } from '../lib/api';
import { Icon } from '../components/ui/Icon';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { Avatar, Field } from '../components/ui/ui';
import { Cell } from './cells/Cell';

type Tab = 'general' | 'members' | 'defaults' | 'danger';

export function BoardSettingsDialog({ bundle, onClose, initialTab = 'general' }: { bundle: BoardBundle; onClose: () => void; initialTab?: Tab }) {
  const b = bundle.board;
  const isAdmin = b.access === 'admin';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState(b.name);
  const [description, setDescription] = useState(b.description);
  const [visibility, setVisibility] = useState(b.visibility);
  const [defaults, setDefaults] = useState<Record<string, unknown>>((b.settings.defaultValues as Record<string, unknown>) ?? {});
  const [addUser, setAddUser] = useState('');
  const [addRole, setAddRole] = useState<BoardRole>('editor');
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['board', b.id] });
    qc.invalidateQueries({ queryKey: ['boards', b.workspaceId] });
  };
  const run = async (p: Promise<unknown>, msg?: string) => {
    try {
      await p;
      refresh();
      if (msg) toast(msg);
      return true;
    } catch (e) {
      toast(errorMessage(e), 'error');
      return false;
    }
  };
  const nonMembers = bundle.members.filter((m) => !bundle.boardMembers.some((bm) => bm.userId === m.id));
  const fakeItem = { id: 'defaults', boardId: b.id, groupId: '', parentItemId: null, name: '', description: '', position: 0, values: defaults, createdBy: '', createdAt: 0, updatedAt: 0, completedAt: null, archivedAt: null };
  const ctx = { members: bundle.members, items: bundle.items, boardId: b.id, memberName: (id: string) => bundle.members.find((m) => m.id === id)?.name };
  return (
    <Modal title="Board settings" onClose={onClose} wide>
      <div className="tabs" style={{ marginBottom: 16 }}>
        {(['general', 'members', 'defaults', 'danger'] as Tab[]).map((t) => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t === 'danger' ? 'Archive & delete' : t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      {tab === 'general' ? (
        <div>
          <Field label="Name" htmlFor="bs-name"><input id="bs-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} disabled={b.access === 'view'} /></Field>
          <Field label="Description" htmlFor="bs-desc"><textarea id="bs-desc" className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} disabled={b.access === 'view'} /></Field>
          {b.kind !== 'personal' ? (
            <Field label="Visibility" hint={isAdmin ? undefined : 'Only board admins can change visibility.'}>
              <label className="checkbox"><input type="radio" checked={visibility === 'workspace'} disabled={!isAdmin} onChange={() => setVisibility('workspace')} /> <Icon name="globe" /> Workspace — every member can view; members can edit</label>
              <label className="checkbox"><input type="radio" checked={visibility === 'private'} disabled={!isAdmin} onChange={() => setVisibility('private')} /> <Icon name="lock" /> Private — only board members (and workspace admins)</label>
            </Field>
          ) : <div className="info-box">Personal boards are always private to you.</div>}
          <div className="row" style={{ marginTop: 12 }}>
            <span className="spacer" />
            <button className="btn primary" disabled={b.access === 'view'} onClick={() => run(patch(`/boards/${b.id}`, { name, description, ...(isAdmin && visibility !== b.visibility ? { visibility } : {}) }), 'Board updated')}>Save</button>
          </div>
        </div>
      ) : null}
      {tab === 'members' ? (
        <div>
          <p className="muted small">Board roles: <strong>Owner</strong> manages settings, members and columns; <strong>Editor</strong> edits items; <strong>Viewer</strong> can only view and comment. Workspace admins always have full access.</p>
          <div className="list card" style={{ marginBottom: 12 }}>
            {bundle.boardMembers.map((bm) => {
              const m = bundle.members.find((x) => x.id === bm.userId);
              if (!m) return null;
              return (
                <div key={bm.userId} className="list-row">
                  <Avatar id={m.id} name={m.name} url={m.avatarUrl} />
                  <div className="grow"><div>{m.name}</div><div className="muted small">{m.email} · workspace {m.role}</div></div>
                  <select className="select sm" style={{ width: 110 }} value={bm.role} disabled={!isAdmin} aria-label={`Role for ${m.name}`} onChange={(e) => run(put(`/boards/${b.id}/members`, { userId: m.id, role: e.target.value }))}>
                    <option value="owner">Owner</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  {isAdmin ? <button className="btn ghost icon sm" aria-label={`Remove ${m.name}`} onClick={() => run(del(`/boards/${b.id}/members/${m.id}`))}><Icon name="x" /></button> : null}
                </div>
              );
            })}
          </div>
          {isAdmin && nonMembers.length ? (
            <div className="row">
              <select className="select grow" value={addUser} onChange={(e) => setAddUser(e.target.value)} aria-label="Add member">
                <option value="">Add a workspace member…</option>
                {nonMembers.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
              </select>
              <select className="select" style={{ width: 110 }} value={addRole} onChange={(e) => setAddRole(e.target.value as BoardRole)} aria-label="Role">
                <option value="owner">Owner</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <button className="btn primary" disabled={!addUser} onClick={async () => { if (await run(put(`/boards/${b.id}/members`, { userId: addUser, role: addRole }))) setAddUser(''); }}>Add</button>
            </div>
          ) : null}
        </div>
      ) : null}
      {tab === 'defaults' ? (
        <div>
          <p className="muted small">Default values are applied to every new top-level item created on this board.</p>
          <div className="props">
            {bundle.columns.filter((c) => !['formula', 'created_at', 'updated_at', 'files', 'dependency'].includes(c.type)).map((c) => (
              <div key={c.id} style={{ display: 'contents' }}>
                <div className="prop-label">{c.title}</div>
                <div className="prop-value"><Cell column={c} item={fakeItem} value={defaults[c.id]} ctx={ctx} canEdit={isAdmin} onChange={(v) => setDefaults((d) => { const n = { ...d }; if (v == null) delete n[c.id]; else n[c.id] = v; return n; })} variant="panel" /></div>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="spacer" />
            <button className="btn primary" disabled={!isAdmin} onClick={() => run(patch(`/boards/${b.id}`, { settings: { defaultValues: defaults } }), 'Defaults saved')}>Save defaults</button>
          </div>
        </div>
      ) : null}
      {tab === 'danger' ? (
        <div className="stack">
          <div className="card card-pad row">
            <div className="grow"><strong>Save as template</strong><div className="muted small">Reuse this board's groups, columns, views and automations.</div></div>
            <button className="btn" disabled={!isAdmin} onClick={() => run(post(`/boards/${b.id}/save-as-template`, { name: `${b.name} template`, withItems: false }), 'Template saved — find it under Templates')}>Save as template</button>
          </div>
          <div className="card card-pad row">
            <div className="grow"><strong>Duplicate board</strong><div className="muted small">Copy structure and items into a new board.</div></div>
            <button className="btn" onClick={async () => { try { const r = await post(`/boards/${b.id}/duplicate`, { withItems: true }); refresh(); onClose(); navigate(`/w/${b.workspaceId}/boards/${r.id}`); } catch (e) { toast(errorMessage(e), 'error'); } }}>Duplicate</button>
          </div>
          <div className="card card-pad row">
            <div className="grow"><strong>{b.archivedAt ? 'Restore board' : 'Archive board'}</strong><div className="muted small">{b.archivedAt ? 'Make the board editable again.' : 'Archived boards are read-only and hidden from lists. You can restore them anytime.'}</div></div>
            <button className="btn" disabled={!isAdmin} onClick={() => run(post(`/boards/${b.id}/${b.archivedAt ? 'restore' : 'archive'}`), b.archivedAt ? 'Board restored' : 'Board archived')}>{b.archivedAt ? 'Restore' : 'Archive'}</button>
          </div>
          <div className="card card-pad row" style={{ borderColor: 'var(--danger)' }}>
            <div className="grow"><strong className="danger-text">Delete board</strong><div className="muted small">Permanently deletes the board, its items, updates and files. This cannot be undone.</div></div>
            <button className="btn danger" disabled={!isAdmin} onClick={async () => {
              if (!(await confirm({ title: `Delete "${b.name}"?`, message: 'Everything on this board will be permanently deleted.', danger: true, confirmLabel: 'Delete board', typeToConfirm: b.name }))) return;
              if (await run(del(`/boards/${b.id}`, { confirmName: b.name }), 'Board deleted')) { onClose(); navigate(`/w/${b.workspaceId}/boards`); }
            }}>Delete</button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
