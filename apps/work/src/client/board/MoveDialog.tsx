// Move tasks to another project, in this company or another one the person works in (owner, 20 Nov 2026: tasks entered in
// the wrong company or department, one at a time or many at once). One popup: where to, then what carries over, then
// the move. The server decides everything (services/item-transfer.ts); flag move_records, off until a platform admin
// switches it on for both companies.
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { errorMessage, get, post } from '../lib/api';
import { Modal, useToast } from '../components/ui/overlays';

interface Target {
  id: string;
  name: string;
  kind: string;
  current: boolean;
  projects: { id: string; name: string; workspaceId: string; groups: { id: string; name: string }[] }[];
}

interface Preview {
  sameCompany: boolean;
  target: { companyId: string; boardId: string; boardName: string; groupId: string; groupName: string };
  columns: { from: { id: string; title: string; type: string }; to: { id: string; title: string } | null; note?: string }[];
  tasks: { id: string; name: string; key: string | null; subtasks: number; ok: boolean; error?: string; notCarried: { column: string; reason: string }[]; newKey?: string }[];
  moved: number;
}

/** Whether moving tasks out of this project is switched on (one small call, cached). */
export function useMoveEnabled(boardId: string, enabled = true): boolean {
  const q = useQuery({
    queryKey: ['transfer-status', boardId],
    queryFn: () => get<{ enabled: boolean }>(`/transfer/status?from=${encodeURIComponent(boardId)}`),
    enabled: enabled && !!boardId && !boardId.startsWith('tmp-'),
    staleTime: 5 * 60_000,
    retry: false,
  });
  return !!q.data?.enabled;
}

export function MoveDialog({ boardId, itemIds, names, onClose, onMoved }: { boardId: string; itemIds: string[]; names?: string; onClose: () => void; onMoved: (movedIds: string[]) => void }) {
  const toast = useToast();
  const targets = useQuery({ queryKey: ['transfer-targets', boardId], queryFn: () => get<{ enabled: boolean; companies: Target[] }>(`/transfer/targets?from=${encodeURIComponent(boardId)}`), retry: false });
  const companies = useMemo(() => targets.data?.companies ?? [], [targets.data]);
  const [companyId, setCompanyId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId && companies.length) setCompanyId(companies[0].id);
  }, [companies, companyId]);
  const company = companies.find((c) => c.id === companyId);
  const project = company?.projects.find((p) => p.id === projectId);
  useEffect(() => {
    setProjectId(company?.projects[0]?.id ?? '');
  }, [companyId]);
  useEffect(() => {
    setGroupId(project?.groups[0]?.id ?? '');
    setPreview(null);
  }, [projectId]);
  useEffect(() => setPreview(null), [groupId]);

  const count = itemIds.length;
  const what = count === 1 ? (names ? `"${names}"` : 'this task') : `${count} tasks`;
  const request = { itemIds, toBoardId: projectId, toGroupId: groupId || undefined };

  async function check() {
    setBusy(true);
    setError(null);
    try {
      setPreview(await post<Preview>(`/boards/${boardId}/items/transfer/preview`, request));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function move() {
    setBusy(true);
    setError(null);
    try {
      const r = await post<Preview & { ok: boolean }>(`/boards/${boardId}/items/transfer`, request);
      const moved = r.tasks.filter((t) => t.ok && t.newKey).map((t) => t.id);
      const left = r.tasks.filter((t) => !t.ok);
      toast(`${moved.length === 1 ? '1 task' : `${moved.length} tasks`} moved to ${r.target.boardName}${left.length ? `; ${left.length} left where ${left.length === 1 ? 'it was' : 'they were'}` : ''}`, left.length ? 'error' : undefined);
      onMoved(moved);
      if (left.length) setPreview(r);
      else onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const movable = preview ? preview.tasks.filter((t) => t.ok).length : 0;
  const footer = (
    <>
      <button className="btn" onClick={onClose}>Cancel</button>
      {preview ? (
        <button className="btn primary" disabled={busy || !movable} onClick={() => void move()}>
          {busy ? 'Moving...' : movable === 1 ? 'Move 1 task' : `Move ${movable} tasks`}
        </button>
      ) : (
        <button className="btn primary" disabled={busy || !projectId} onClick={() => void check()}>{busy ? 'Checking...' : 'Check what moves'}</button>
      )}
    </>
  );

  return (
    <Modal title={`Move ${what}`} onClose={onClose} footer={footer} wide>
      <div className="stack">
        <p className="muted">
          Move to another project in this company, or in another company you work in. Subtasks, comments, files, time and history go with
          {count === 1 ? ' it' : ' them'}. Each task gets a new key in the new project.
        </p>
        {targets.isLoading ? <p className="muted">Loading the projects you can move to...</p> : null}
        {targets.error ? <p className="error-box">{errorMessage(targets.error)}</p> : null}
        {targets.data && !companies.length ? <p className="muted">There is no other project you can add tasks to, in a company where moving is switched on.</p> : null}
        {companies.length ? (
          <div className="move-pickers">
            <label className="field">
              <span>Company</span>
              <select className="select" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}{c.current ? ' (this company)' : ''}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Project</span>
              <select className="select" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                {company?.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Group</span>
              <select className="select" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                {project?.groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>
          </div>
        ) : null}
        {error ? <p className="error-box" role="alert">{error}</p> : null}
        {preview ? <PreviewList p={preview} /> : null}
      </div>
    </Modal>
  );
}

function PreviewList({ p }: { p: Preview }) {
  const ok = p.tasks.filter((t) => t.ok);
  const refused = p.tasks.filter((t) => !t.ok);
  const unmatched = p.columns.filter((c) => !c.to && c.note !== 'Worked out again in the new project');
  return (
    <div className="stack move-preview" aria-live="polite">
      <p>
        <strong>{ok.length === 1 ? '1 task' : `${ok.length} tasks`}</strong> will move to <strong>{p.target.boardName}</strong>, group <strong>{p.target.groupName}</strong>
        {p.sameCompany ? '' : ', in another company'}. People there who could not see {ok.length === 1 ? 'it' : 'them'} before will see {ok.length === 1 ? 'it' : 'them'}; people here lose {ok.length === 1 ? 'it' : 'them'} unless they work there too.
      </p>
      {unmatched.length ? (
        <p className="muted">Columns with no match in the new project: {unmatched.map((c) => c.from.title).join(', ')}. Their values are kept in the task’s history, not in a column.</p>
      ) : null}
      <ul className="move-tasks">
        {p.tasks.map((t) => (
          <li key={t.id} className={t.ok ? '' : 'refused'}>
            <span className="move-task-name">{t.key ? <code>{t.key}</code> : null} {t.name}{t.subtasks ? ` (and ${t.subtasks === 1 ? '1 subtask' : `${t.subtasks} subtasks`})` : ''}{t.newKey ? <> moved, now <code>{t.newKey}</code></> : null}</span>
            {t.error ? <span className="danger-text">{t.error}</span> : null}
            {t.ok && t.notCarried.length ? <span className="muted">Not carried over: {t.notCarried.map((n) => `${n.column} (${n.reason})`).join('; ')}</span> : null}
          </li>
        ))}
      </ul>
      {refused.length ? <p className="muted">{refused.length === 1 ? 'That task stays' : 'Those tasks stay'} where {refused.length === 1 ? 'it is' : 'they are'}.</p> : null}
    </div>
  );
}
