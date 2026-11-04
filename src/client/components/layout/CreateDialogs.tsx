import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post } from '../../lib/api';
import { useSession } from '../../lib/session';
import { Modal, useToast } from '../ui/overlays';
import { Field } from '../ui/ui';
import { Icon } from '../ui/Icon';
import type { BoardDTO } from '../../../shared/types';

export function useBoards(wsId: string, opts: { archived?: boolean; kind?: string } = {}) {
  const qs = new URLSearchParams();
  if (opts.archived) qs.set('archived', '1');
  if (opts.kind) qs.set('kind', opts.kind);
  return useQuery({ queryKey: ['boards', wsId, opts], queryFn: () => get<BoardDTO[]>(`/workspaces/${wsId}/boards?${qs}`) });
}

export function CreateBoardDialog({ wsId, onClose, templateId: initialTemplate, kind = 'board' }: { wsId: string; onClose: () => void; templateId?: string; kind?: 'board' | 'personal' }) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState(initialTemplate ?? 'blank');
  const [visibility, setVisibility] = useState<'workspace' | 'private'>(kind === 'personal' ? 'private' : 'workspace');
  const [withSample, setWithSample] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const templates = useQuery({ queryKey: ['templates', wsId], queryFn: () => get(`/workspaces/${wsId}/templates`) });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const b = await post<BoardDTO>(`/workspaces/${wsId}/boards`, { name: name.trim() || 'Untitled board', templateId: templateId === 'blank' ? undefined : templateId, visibility, kind, withSampleItems: withSample });
      await qc.invalidateQueries({ queryKey: ['boards', wsId] });
      onClose();
      navigate(`/w/${wsId}/boards/${b.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={kind === 'personal' ? 'New personal board' : 'New board'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" form="create-board" disabled={busy}>{busy ? 'Creating…' : 'Create board'}</button>
        </>
      }
    >
      <form id="create-board" onSubmit={submit}>
        <Field label="Board name" htmlFor="board-name">
          <input id="board-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q3 product launch" maxLength={200} autoFocus />
        </Field>
        <Field label="Template" htmlFor="board-template">
          <select id="board-template" className="select" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            {(templates.data?.builtin ?? [{ id: 'blank', name: 'Blank board' }]).map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
            {(templates.data?.workspace ?? []).length ? (
              <optgroup label="Workspace templates">
                {templates.data.workspace.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </optgroup>
            ) : null}
          </select>
        </Field>
        {templateId !== 'blank' ? (
          <label className="checkbox" style={{ marginBottom: 12 }}>
            <input type="checkbox" checked={withSample} onChange={(e) => setWithSample(e.target.checked)} /> Include sample items
          </label>
        ) : null}
        {kind === 'board' ? (
          <Field label="Who can see this board?">
            <div className="row">
              <label className="checkbox"><input type="radio" name="vis" checked={visibility === 'workspace'} onChange={() => setVisibility('workspace')} /> <Icon name="globe" /> Everyone in the workspace</label>
            </div>
            <div className="row">
              <label className="checkbox"><input type="radio" name="vis" checked={visibility === 'private'} onChange={() => setVisibility('private')} /> <Icon name="lock" /> Only board members</label>
            </div>
          </Field>
        ) : null}
        {error ? <div className="error-box">{error}</div> : null}
      </form>
    </Modal>
  );
}

export function CreateWorkspaceDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useSession();
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const ws = await post(`/workspaces`, { name: name.trim() });
      await refresh();
      onClose();
      navigate(`/w/${ws.id}/home`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title="New workspace" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" form="create-ws" disabled={busy || !name.trim()}>Create workspace</button></>}>
      <form id="create-ws" onSubmit={submit}>
        <Field label="Workspace name" htmlFor="ws-name" hint="Workspaces keep boards, members and data completely separate.">
          <input id="ws-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="e.g. Marketing" />
        </Field>
        {error ? <div className="error-box">{error}</div> : null}
      </form>
    </Modal>
  );
}

export function useCreateDocument(wsId: string) {
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  return async (opts: { title?: string; boardId?: string; itemId?: string } = {}) => {
    try {
      const d = await post(`/workspaces/${wsId}/documents`, { title: opts.title ?? 'Untitled document', boardId: opts.boardId, itemId: opts.itemId });
      qc.invalidateQueries({ queryKey: ['documents', wsId] });
      navigate(`/w/${wsId}/docs/${d.id}`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
}

export function CreateDashboardDialog({ wsId, onClose }: { wsId: string; onClose: () => void }) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const boards = useBoards(wsId);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const d = await post(`/workspaces/${wsId}/dashboards`, { name: name.trim() || 'Untitled dashboard', boardIds: selected });
      qc.invalidateQueries({ queryKey: ['dashboards', wsId] });
      onClose();
      navigate(`/w/${wsId}/dashboards/${d.id}`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };
  return (
    <Modal title="New dashboard" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" form="create-dash">Create dashboard</button></>}>
      <form id="create-dash" onSubmit={submit}>
        <Field label="Dashboard name" htmlFor="dash-name">
          <input id="dash-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} placeholder="e.g. Delivery overview" />
        </Field>
        <Field label="Source boards" hint="Leave empty to include every board you can access.">
          <div className="col" style={{ maxHeight: 220, overflow: 'auto', gap: 4 }}>
            {(boards.data ?? []).map((b) => (
              <label key={b.id} className="checkbox">
                <input type="checkbox" checked={selected.includes(b.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, b.id] : selected.filter((x) => x !== b.id))} /> {b.name}
              </label>
            ))}
          </div>
        </Field>
        {error ? <div className="error-box">{error}</div> : null}
      </form>
    </Modal>
  );
}
