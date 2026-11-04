import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { useDebounced } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox } from '../../components/ui/ui';
import { EVENT_ICON, eventLabel, useAdmin, type ActivityEvent, type AdminUserRow } from '../api';
import { Card, Empty, PageIntro, PageSkeleton, fmtDateTime } from '../ui';

interface Lookups {
  workspaces: { id: string; name: string }[];
  boards: { id: string; name: string; workspaceId: string }[];
  eventTypes: string[];
}

const FILTER_KEYS = ['userId', 'type', 'workspaceId', 'boardId', 'from', 'to'] as const;

export default function Activity() {
  const [params, setParams] = useSearchParams();
  const lookups = useAdmin<Lookups>('/lookups', { staleTime: 60_000 });
  const set = (k: string, v: string) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        if (v) n.set(k, v);
        else n.delete(k);
        return n;
      },
      { replace: true },
    );
  const filters = new URLSearchParams();
  for (const k of FILTER_KEYS) {
    const v = params.get(k);
    if (v) filters.set(k, v);
  }
  const fq = filters.toString();
  const feed = useInfiniteQuery({
    queryKey: ['admin', 'activity', fq],
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) => get<{ events: ActivityEvent[]; nextBefore: number | null }>(`/admin/activity?${fq}${pageParam ? `&before=${pageParam}` : ''}&limit=100`),
    getNextPageParam: (last) => last.nextBefore,
  });
  const events = feed.data?.pages.flatMap((p) => p.events) ?? [];
  const byDay = useMemo(() => {
    const groups: { day: string; items: ActivityEvent[] }[] = [];
    for (const e of events) {
      const day = new Date(e.at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const g = groups[groups.length - 1];
      if (g && g.day === day) g.items.push(e);
      else groups.push({ day, items: [e] });
    }
    return groups;
  }, [events]);
  const boards = (lookups.data?.boards ?? []).filter((b) => !params.get('workspaceId') || b.workspaceId === params.get('workspaceId'));
  return (
    <div className="ac-stack">
      <PageIntro actions={<a className="btn" href={`/api/admin/export/activity.csv${fq ? `?${fq}` : ''}`} download><Icon name="download" /> Export CSV</a>}>
        <p className="muted">Every tracked product event, newest first. Content (task names, descriptions, messages) is never recorded.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <UserPicker
            value={params.get('userId') ?? ''}
            label={params.get('userLabel') ?? ''}
            onChange={(id, label) => setParams((p) => { const n = new URLSearchParams(p); if (id) { n.set('userId', id); n.set('userLabel', label); } else { n.delete('userId'); n.delete('userLabel'); } return n; }, { replace: true })}
          />
          <select className="select" aria-label="Event type" value={params.get('type') ?? ''} onChange={(e) => set('type', e.target.value)}>
            <option value="">All events</option>
            {(lookups.data?.eventTypes ?? []).map((t) => (
              <option key={t} value={t}>{eventLabel(t)}</option>
            ))}
          </select>
          <select className="select" aria-label="Workspace" value={params.get('workspaceId') ?? ''} onChange={(e) => { set('workspaceId', e.target.value); set('boardId', ''); }}>
            <option value="">All workspaces</option>
            {(lookups.data?.workspaces ?? []).map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <select className="select" aria-label="Project" value={params.get('boardId') ?? ''} onChange={(e) => set('boardId', e.target.value)}>
            <option value="">All projects</option>
            {boards.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <label className="ac-inline-field">
            <span>From</span>
            <input className="input" type="date" value={params.get('from') ?? ''} onChange={(e) => set('from', e.target.value)} />
          </label>
          <label className="ac-inline-field">
            <span>to</span>
            <input className="input" type="date" value={params.get('to') ?? ''} onChange={(e) => set('to', e.target.value)} />
          </label>
          {fq ? <button className="btn ghost sm" onClick={() => setParams({}, { replace: true })}>Clear filters</button> : null}
        </div>
        {feed.isLoading ? (
          <PageSkeleton />
        ) : feed.error ? (
          <ErrorBox error={feed.error} retry={() => feed.refetch()} />
        ) : !events.length ? (
          <Empty>No events match these filters.</Empty>
        ) : (
          <div className="ac-feed">
            {byDay.map((g) => (
              <section key={g.day}>
                <h4 className="ac-day">{g.day}</h4>
                <ol className="ac-timeline">
                  {g.items.map((e) => (
                    <li key={e.id}>
                      <span className="ac-tl-icon"><Icon name={EVENT_ICON[e.type] ?? 'activity'} size={13} /></span>
                      <div className="grow" style={{ minWidth: 0 }}>
                        {e.userId ? <Link to={`/admin/users/${e.userId}`}>{e.userEmail ?? 'Unknown user'}</Link> : <span className="muted">{e.metadata.automation ? 'Automation' : 'System'}</span>}{' '}
                        <span>{eventLabel(e.type)}</span>
                        {e.boardName ? <span className="muted"> in {e.boardName}</span> : null}
                        {e.workspaceName ? <span className="muted small"> · {e.workspaceName}</span> : null}
                        {e.metadata.backfilled ? <span className="ac-tag" title="Reconstructed from records stored before tracking began">history</span> : null}
                      </div>
                      <time className="muted small" title={fmtDateTime(e.at)}>{new Date(e.at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</time>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
            {feed.hasNextPage ? (
              <button className="btn" onClick={() => feed.fetchNextPage()} disabled={feed.isFetchingNextPage}>
                {feed.isFetchingNextPage ? 'Loading…' : 'Load more'}
              </button>
            ) : (
              <div className="muted small">End of the timeline.</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

/** Email/name search that resolves to a user id filter. */
function UserPicker({ value, label, onChange }: { value: string; label: string; onChange: (id: string, label: string) => void }) {
  const [text, setText] = useState('');
  const dq = useDebounced(text.trim(), 250);
  const results = useAdmin<{ users: AdminUserRow[] }>(`/users?q=${encodeURIComponent(dq)}&sort=activity`, { enabled: dq.length >= 2 });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!value) setText('');
  }, [value]);
  if (value) {
    return (
      <span className="ac-chip">
        <Icon name="user" size={13} /> {label || 'Selected user'}
        <button aria-label="Clear user filter" onClick={() => onChange('', '')}><Icon name="x" size={12} /></button>
      </span>
    );
  }
  return (
    <div className="ac-picker">
      <label className="ac-search">
        <Icon name="user" />
        <input className="input" placeholder="Filter by user email" aria-label="Filter by user email" value={text} onChange={(e) => { setText(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} />
      </label>
      {open && dq.length >= 2 && results.data?.users.length ? (
        <ul className="ac-picker-list" role="listbox">
          {results.data.users.slice(0, 8).map((u) => (
            <li key={u.id}>
              <button role="option" aria-selected={false} onMouseDown={(e) => { e.preventDefault(); onChange(u.id, u.email); setOpen(false); }}>
                <span className="ellipsis">{u.email}</span> <span className="muted small">{u.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
