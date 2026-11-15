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
import { SUITE } from '../lib/base';
import '../styles/admin.css';
import '../styles/whs.css';

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
      <HealthAndSafetyWork />
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

interface WhsWorkItem {
  type: 'action' | 'hazard' | 'investigation' | 'notification';
  id: string;
  number: string;
  title: string;
  due: string | null;
  dueNote?: string;
  overdue: boolean;
  link: string;
}

const WHS_TYPE: Record<WhsWorkItem['type'], string> = { action: 'Action', hazard: 'Hazard', investigation: 'Investigation', notification: 'Regulator notification' };

/**
 * BIZOMAT WHS (Release 1): health and safety work assigned to you in every company: your actions (overdue first), the
 * hazards you are responsible for, the investigations you are on, the notifications you are to make, and risk
 * assessments waiting for your approval. Each opens in BIZOMAT ERP's Health and Safety module. Hidden when empty.
 */
function HealthAndSafetyWork() {
  const q = useQuery({ queryKey: ['whs', 'my-work'], queryFn: () => get<{ companies: { company: { id: string; name: string }; items: WhsWorkItem[]; toApprove: number; unreadAlerts: number }[] }>(`/whs/my-work?today=${new Date().toISOString().slice(0, 10)}`), retry: false });
  const companies = q.data?.companies ?? [];
  if (!companies.length) return null;
  const erp = SUITE || '/erp';
  return (
    <section className="card whs-my-work" aria-labelledby="whs-my-work">
      <div className="card-header"><h2 id="whs-my-work" className="grow">Health and safety</h2><span className="badge">{companies.reduce((s, c) => s + c.items.length, 0)}</span></div>
      {companies.map((c) => (
        <div key={c.company.id} className="whs-my-company">
          {companies.length > 1 ? <div className="muted small whs-my-name">{c.company.name}</div> : null}
          {[...c.items].sort((a, b) => Number(b.overdue) - Number(a.overdue)).map((x) => (
            <div key={`${x.type}:${x.id}`} className="work-row">
              <a className="item-link ellipsis" href={`${erp}${x.link}`}><Icon name={x.type === 'action' ? 'checkSquare' : x.type === 'hazard' ? 'alert' : 'flag'} size={13} /> {x.number} {x.title}</a>
              <span className="muted small hide-sm">{WHS_TYPE[x.type]}</span>
              <span className={`small hide-sm${x.overdue ? ' whs-overdue' : ''}`}>{x.due ? formatDate(x.due.slice(0, 10)) : x.dueNote ?? ''}{x.overdue ? ' (overdue)' : ''}</span>
              <span />
              <span />
            </div>
          ))}
          {c.toApprove ? <div className="work-row"><a className="item-link" href={`${erp}/c/${encodeURIComponent(c.company.id)}/whs/risk?status=submitted`}><Icon name="target" size={13} /> {c.toApprove} risk assessment{c.toApprove === 1 ? '' : 's'} waiting for approval</a><span /><span /><span /><span /></div> : null}
          {c.unreadAlerts ? <div className="work-row"><a className="item-link" href={`${erp}/c/${encodeURIComponent(c.company.id)}/whs`}><Icon name="bell" size={13} /> {c.unreadAlerts} unread health and safety alert{c.unreadAlerts === 1 ? '' : 's'}</a><span /><span /><span /><span /></div> : null}
        </div>
      ))}
    </section>
  );
}
