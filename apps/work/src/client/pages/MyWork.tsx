import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post } from '../lib/api';
import { useWorkspace } from '../lib/session';
import { formatDate } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import type { ItemDTO } from '../../shared/types';
import '../styles/admin.css';

export interface WorkItem {
  item: ItemDTO;
  boardId: string;
  boardName: string;
  due: string | null;
  done: boolean;
  statusText: string;
  statusColor: string | null;
}

export type BucketKey = 'overdue' | 'today' | 'upcoming' | 'later' | 'noDate' | 'completed';
export type MyWorkResponse = Record<BucketKey, WorkItem[]> & { date: string };

export function useMyWork(wsId: string) {
  return useQuery({ queryKey: ['my-work', wsId], queryFn: () => get<MyWorkResponse>(`/workspaces/${wsId}/my-work`) });
}

export const BUCKETS: { key: BucketKey; label: string; icon: string; tone?: string }[] = [
  { key: 'overdue', label: 'Overdue', icon: 'flag', tone: 'var(--danger)' },
  { key: 'today', label: 'Today', icon: 'sun', tone: 'var(--accent)' },
  { key: 'upcoming', label: 'Next 7 days', icon: 'calendar' },
  { key: 'later', label: 'Later', icon: 'clock' },
  { key: 'noDate', label: 'No due date', icon: 'checkSquare' },
  { key: 'completed', label: 'Completed', icon: 'check', tone: 'var(--success)' },
];

export function StatusPill({ text, color }: { text: string; color: string | null }) {
  if (!text) return <span className="muted small">—</span>;
  return (
    <span className="pill" style={{ background: color ?? 'var(--text-3)' }}>
      {text}
    </span>
  );
}

export function useAddToMyDay(wsId: string) {
  const toast = useToast();
  const qc = useQueryClient();
  return async (itemId: string, day: string) => {
    try {
      await post(`/workspaces/${wsId}/planner`, { itemId, day });
      qc.invalidateQueries({ queryKey: ['planner', wsId] });
      toast('Added to your plan');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
}

export function WorkRow({ w, wsId, onAdd }: { w: WorkItem; wsId: string; onAdd?: (w: WorkItem) => void }) {
  return (
    <div className="work-row">
      <Link className="item-link ellipsis" to={`/w/${wsId}/tasks/${w.item.id}`}>
        {w.item.parentItemId ? <Icon name="subitem" size={13} /> : null} {w.item.name}
      </Link>
      <Link className="muted small ellipsis hide-sm" to={`/w/${wsId}/boards/${w.boardId}`}>
        {w.boardName}
      </Link>
      <span className="hide-sm">
        <StatusPill text={w.statusText} color={w.statusColor} />
      </span>
      <span className="small hide-sm" style={{ color: !w.done && w.due && w.due < new Date().toISOString().slice(0, 10) ? 'var(--danger)' : undefined }}>
        {w.due ? formatDate(w.due) : ''}
      </span>
      {onAdd && !w.done ? (
        <button className="btn ghost sm" onClick={() => onAdd(w)} aria-label={`Add ${w.item.name} to My Day`} title="Add to My Day">
          <Icon name="sun" size={14} /> <span className="desktop-only">My Day</span>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

export default function MyWork() {
  const ws = useWorkspace();
  const q = useMyWork(ws.id);
  const add = useAddToMyDay(ws.id);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ completed: true, later: false });

  if (q.isLoading) return <Loading />;
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  const data = q.data!;
  const total = BUCKETS.filter((b) => b.key !== 'completed').reduce((s, b) => s + data[b.key].length, 0);

  return (
    <div className="page">
      <PageHeader icon="checkSquare" title="My Work" subtitle="Everything assigned to you across the boards you can access." />
      <SharedWithMe wsId={ws.id} />
      {total === 0 && data.completed.length === 0 ? (
        <div className="card">
          <EmptyState icon="checkSquare" title="Nothing assigned to you yet">
            Items appear here when someone puts you in a person column on any board.
          </EmptyState>
        </div>
      ) : (
        <div className="col" style={{ gap: 14 }}>
          {BUCKETS.map((b) => {
            const list = data[b.key];
            const isCollapsed = collapsed[b.key];
            return (
              <section key={b.key} className="card" aria-labelledby={`bucket-${b.key}`} style={{ overflow: 'hidden' }}>
                <button className="section-toggle" aria-expanded={!isCollapsed} onClick={() => setCollapsed({ ...collapsed, [b.key]: !isCollapsed })} id={`bucket-${b.key}`}>
                  <Icon name={isCollapsed ? 'chevronRight' : 'chevronDown'} size={14} />
                  <span style={{ color: b.tone }}><Icon name={b.icon} /></span>
                  {b.label}
                  <span className="badge">{list.length}</span>
                </button>
                {!isCollapsed ? (
                  list.length ? (
                    list.map((w) => <WorkRow key={w.item.id} w={w} wsId={ws.id} onAdd={(x) => add(x.item.id, data.date)} />)
                  ) : (
                    <div className="muted small" style={{ padding: '6px 14px 14px' }}>Nothing here.</div>
                  )
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Tasks shared with me one by one (task access, not the whole project). */
function SharedWithMe({ wsId }: { wsId: string }) {
  const q = useQuery({ queryKey: ['shared-tasks', wsId], queryFn: () => get<{ id: string; name: string; boardName: string; done: boolean; sharedBy: string | null }[]>(`/workspaces/${wsId}/shared-tasks`) });
  if (!q.data?.length) return null;
  return (
    <section className="card" style={{ marginBottom: 14 }} aria-labelledby="shared-tasks">
      <div className="card-header"><h2 id="shared-tasks" className="grow">Shared with me</h2><span className="badge">{q.data.length}</span></div>
      {q.data.map((t) => (
        <div key={t.id} className="work-row">
          <Link className="item-link ellipsis" to={`/w/${wsId}/tasks/${t.id}`}><Icon name="lock" size={13} /> {t.name}</Link>
          <span className="muted small ellipsis hide-sm">{t.boardName}</span>
          <span className="small hide-sm">{t.done ? 'Done' : ''}</span>
          <span className="muted small hide-sm">{t.sharedBy ? `Shared by ${t.sharedBy}` : ''}</span>
          <span />
        </div>
      ))}
    </section>
  );
}
