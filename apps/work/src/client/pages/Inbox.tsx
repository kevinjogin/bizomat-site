import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, post } from '../lib/api';
import { useWorkspace } from '../lib/session';
import { timeAgo } from '../lib/format';
import { NOTIFICATION_TYPES, type NotificationDTO } from '../../shared/types';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import '../styles/admin.css';

const ACTIONABLE = ['mention', 'assignment', 'comment', 'reply', 'invitation'];

export const TYPE_META: Record<string, { label: string; icon: string }> = {
  assignment: { label: 'Assignments', icon: 'user' },
  mention: { label: 'Mentions', icon: 'message' },
  comment: { label: 'Comments', icon: 'message' },
  reply: { label: 'Replies', icon: 'message' },
  status_change: { label: 'Status changes', icon: 'activity' },
  due_soon: { label: 'Due soon', icon: 'calendar' },
  overdue: { label: 'Overdue', icon: 'flag' },
  automation: { label: 'Automations', icon: 'bolt' },
  invitation: { label: 'Invitations', icon: 'users' },
};

type Page = { notifications: NotificationDTO[]; unreadCount: number };

export default function Inbox({ mode }: { mode: 'inbox' | 'all' }) {
  const ws = useWorkspace();
  const [type, setType] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const key = ['notifications', ws.id, 'list', mode, type, unreadOnly];
  const q = useInfiniteQuery({
    queryKey: key,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const p = new URLSearchParams({ workspaceId: ws.id });
      if (unreadOnly) p.set('unread', '1');
      if (type) p.set('type', type);
      if (pageParam) p.set('before', String(pageParam));
      return get<Page>(`/notifications?${p}`);
    },
    getNextPageParam: (last) => (last.notifications.length >= 50 ? last.notifications[last.notifications.length - 1].createdAt : undefined),
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ['notifications', ws.id] });
  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const all = (q.data?.pages ?? []).flatMap((p) => p.notifications);
  const list = mode === 'inbox' ? all.filter((n) => ACTIONABLE.includes(n.type)) : all;
  const unread = q.data?.pages[0]?.unreadCount ?? 0;
  const types = mode === 'inbox' ? ACTIONABLE : NOTIFICATION_TYPES;

  const open = async (n: NotificationDTO) => {
    if (!n.readAt) await post(`/notifications/${n.id}/read`).catch(() => {});
    refresh();
    if (n.link) navigate(n.link);
  };

  return (
    <div className="page">
      <PageHeader
        icon={mode === 'inbox' ? 'inbox' : 'bell'}
        title={mode === 'inbox' ? 'Inbox' : 'Notifications'}
        subtitle={mode === 'inbox' ? 'Mentions, assignments, comments and invitations that need you.' : `${unread} unread across this workspace.`}
        actions={
          <button className="btn" disabled={!unread} onClick={() => act(() => post(`/notifications/read-all?workspaceId=${ws.id}`))}>
            <Icon name="check" /> Mark all read
          </button>
        }
      />
      <div className="filters-bar">
        <select className="select sm" style={{ width: 'auto' }} value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{TYPE_META[t]?.label ?? t}</option>
          ))}
        </select>
        <label className="checkbox small">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} /> Unread only
        </label>
      </div>
      {q.isLoading ? <Loading /> : null}
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {q.data ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          {list.length === 0 ? (
            <EmptyState icon={mode === 'inbox' ? 'inbox' : 'bell'} title="You're all caught up">
              {unreadOnly || type ? 'No notifications match these filters.' : 'New activity that involves you will show up here.'}
            </EmptyState>
          ) : (
            list.map((n) => (
              <div key={n.id} className={`notif-row${n.readAt ? '' : ' unread'}`}>
                {n.readAt ? <span style={{ width: 8 }} /> : <span className="unread-dot" aria-label="Unread" />}
                <Icon name={TYPE_META[n.type]?.icon ?? 'bell'} />
                <button className="notif-main" onClick={() => open(n)}>
                  <div style={{ fontWeight: n.readAt ? 500 : 700 }}>{n.title}</div>
                  {n.body ? <div className="muted small" style={{ whiteSpace: 'pre-wrap' }}>{n.body}</div> : null}
                  <div className="muted small">
                    {TYPE_META[n.type]?.label ?? n.type} · {timeAgo(n.createdAt)}
                  </div>
                </button>
                <div className="notif-actions">
                  <button className="btn ghost icon sm" title={n.readAt ? 'Mark as unread' : 'Mark as read'} aria-label={n.readAt ? 'Mark as unread' : 'Mark as read'} onClick={() => act(() => post(`/notifications/${n.id}/read${n.readAt ? '?unread=1' : ''}`))}>
                    <Icon name={n.readAt ? 'eyeOff' : 'check'} size={14} />
                  </button>
                  <button className="btn ghost icon sm" title="Delete" aria-label="Delete notification" onClick={() => act(() => del(`/notifications/${n.id}`))}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
      {q.hasNextPage ? (
        <div className="center-fill" style={{ padding: 16 }}>
          <button className="btn" onClick={() => q.fetchNextPage()} disabled={q.isFetchingNextPage}>
            {q.isFetchingNextPage ? 'Loading…' : 'Load older notifications'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
