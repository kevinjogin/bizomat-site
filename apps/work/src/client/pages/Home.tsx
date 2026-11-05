import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { canEdit, useUser, useWorkspace } from '../lib/session';
import { timeAgo, todayISO } from '../lib/format';
import { usePageTitle } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { ErrorBox, Spinner } from '../components/ui/ui';
import { entityPath } from '../components/layout/AppShell';
import { CreateBoardDialog, CreateDashboardDialog, useCreateDocument } from '../components/layout/CreateDialogs';
import { useMyWork, WorkRow } from './MyWork';
import '../styles/admin.css';

interface EntityRef {
  type: string;
  id: string;
  name: string;
  boardId?: string;
  at: number;
}

const ENTITY_ICON: Record<string, string> = { board: 'grid', dashboard: 'chart', document: 'doc', goal: 'target', item: 'checkSquare' };

export function describeAction(action: string): string {
  const a = action.replace(/:automation$/, '');
  const map: Record<string, string> = {
    item_created: 'created',
    subitem_created: 'added a subitem to',
    value_changed: 'updated',
    renamed: 'renamed',
    description_changed: 'edited the description of',
    moved: 'moved',
    archived: 'archived',
    restored: 'restored',
    item_deleted: 'deleted an item',
    update_posted: 'commented on',
    reply_posted: 'replied on',
    file_uploaded: 'attached a file to',
    file_deleted: 'removed a file from',
    group_created: 'created a group',
    group_deleted: 'deleted a group',
    column_created: 'added a column',
    column_deleted: 'deleted a column',
    column_renamed: 'renamed a column',
    column_type_changed: 'changed a column type',
  };
  return map[a] ?? a.replace(/_/g, ' ');
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Home() {
  const ws = useWorkspace();
  usePageTitle('Home');
  const user = useUser();
  const base = `/w/${ws.id}`;
  const today = todayISO();
  const work = useMyWork(ws.id);
  const recents = useQuery({ queryKey: ['recents', ws.id], queryFn: () => get<EntityRef[]>(`/workspaces/${ws.id}/recents`) });
  const favs = useQuery({ queryKey: ['favourites', ws.id], queryFn: () => get<EntityRef[]>(`/workspaces/${ws.id}/favourites`) });
  const activity = useQuery({ queryKey: ['ws-activity', ws.id], queryFn: () => get<any[]>(`/workspaces/${ws.id}/activity`) });
  const planner = useQuery({ queryKey: ['planner', ws.id, today, today], queryFn: () => get<any[]>(`/workspaces/${ws.id}/planner?from=${today}&to=${today}`) });
  const createDoc = useCreateDocument(ws.id);
  const [create, setCreate] = useState<null | 'board' | 'dashboard'>(null);

  const stats = [
    { label: 'Overdue', value: work.data?.overdue.length, to: `${base}/my-work`, color: 'var(--danger)' },
    { label: 'Due today', value: work.data?.today.length, to: `${base}/my-work`, color: 'var(--accent)' },
    { label: 'Next 7 days', value: work.data?.upcoming.length, to: `${base}/my-work` },
    { label: 'Planned today', value: planner.data?.length, to: `${base}/my-day` },
  ];
  const focus = [...(work.data?.overdue ?? []), ...(work.data?.today ?? [])].slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div className="grow">
          <h1>
            {greeting()}, {user.name.split(' ')[0]}
          </h1>
          <p>
            Here's what's happening in <strong>{ws.name}</strong>.
          </p>
        </div>
        {canEdit(ws.role) ? (
          <div className="row wrap">
            <button className="btn" onClick={() => setCreate('board')}><Icon name="grid" /> New board</button>
            <button className="btn" onClick={() => createDoc()}><Icon name="doc" /> New doc</button>
            <button className="btn" onClick={() => setCreate('dashboard')}><Icon name="chart" /> New dashboard</button>
          </div>
        ) : null}
      </div>

      <div className="stat-tiles" style={{ marginBottom: 20 }}>
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="stat-tile">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value" style={{ color: s.color }}>{s.value ?? <Spinner />}</span>
          </Link>
        ))}
      </div>

      <div className="home-grid">
        <div className="col" style={{ gap: 16 }}>
          <section className="card" aria-labelledby="focus-h">
            <div className="card-header">
              <h2 id="focus-h" className="grow">Needs your attention</h2>
              <Link to={`${base}/my-work`} className="small">Open My Work</Link>
            </div>
            {work.isLoading ? <div className="card-pad"><Spinner /></div> : null}
            {work.error ? <div className="card-pad"><ErrorBox error={work.error} /></div> : null}
            {work.data && focus.length === 0 ? <div className="card-pad muted">No overdue or due-today work. Nice.</div> : null}
            {focus.map((w) => <WorkRow key={w.item.id} w={w} wsId={ws.id} />)}
          </section>

          <section className="card" aria-labelledby="activity-h">
            <div className="card-header"><h2 id="activity-h">Recent activity</h2></div>
            {activity.isLoading ? <div className="card-pad"><Spinner /></div> : null}
            {activity.data && activity.data.length === 0 ? <div className="card-pad muted">No activity yet. Create a board to get started.</div> : null}
            <div className="list">
              {(activity.data ?? []).slice(0, 15).map((a) => (
                <div key={a.id} className="list-row">
                  <Icon name={String(a.action).endsWith(':automation') ? 'bolt' : 'activity'} />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <strong>{a.actor_name ?? (String(a.action).endsWith(':automation') ? 'Automation' : 'Someone')}</strong> {describeAction(a.action)}{' '}
                    {a.item_name && a.item_id ? <Link to={`${base}/boards/${a.board_id}?item=${a.item_id}`}>{a.item_name}</Link> : null}
                    {a.board_name ? <span className="muted"> · {a.board_name}</span> : null}
                  </span>
                  <span className="muted small" style={{ flex: 'none' }}>{timeAgo(a.created_at)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <section className="card" aria-labelledby="myday-h">
            <div className="card-header">
              <h2 id="myday-h" className="grow">My Day</h2>
              <Link to={`${base}/my-day`} className="small">Plan</Link>
            </div>
            <div className="list">
              {(planner.data ?? []).map((p) => (
                <Link key={p.id} to={`${base}/boards/${p.boardId}?item=${p.itemId}`} className="list-row">
                  <Icon name={p.done ? 'checkSquare' : 'sun'} />
                  <span className="grow ellipsis" style={{ textDecoration: p.done ? 'line-through' : undefined }}>{p.itemName}</span>
                </Link>
              ))}
            </div>
            {planner.data && planner.data.length === 0 ? <div className="card-pad muted small">Nothing planned for today. <Link to={`${base}/my-day`}>Plan your day</Link></div> : null}
          </section>

          <EntityList title="Favourites" icon="star" items={favs.data} loading={favs.isLoading} base={base} empty="Star boards, docs and dashboards to pin them here." />
          <EntityList title="Recently visited" icon="clock" items={recents.data?.slice(0, 8)} loading={recents.isLoading} base={base} empty="Places you visit will appear here." />
        </div>
      </div>
      {create === 'board' ? <CreateBoardDialog wsId={ws.id} onClose={() => setCreate(null)} /> : null}
      {create === 'dashboard' ? <CreateDashboardDialog wsId={ws.id} onClose={() => setCreate(null)} /> : null}
    </div>
  );
}

function EntityList({ title, icon, items, loading, base, empty }: { title: string; icon: string; items?: EntityRef[]; loading: boolean; base: string; empty: string }) {
  return (
    <section className="card">
      <div className="card-header"><Icon name={icon} /><h2>{title}</h2></div>
      {loading ? <div className="card-pad"><Spinner /></div> : null}
      {items && items.length === 0 ? <div className="card-pad muted small">{empty}</div> : null}
      <div className="list">
        {(items ?? []).map((e) => (
          <Link key={`${e.type}:${e.id}`} to={entityPath(base, e)} className="list-row">
            <Icon name={ENTITY_ICON[e.type] ?? 'grid'} />
            <span className="grow ellipsis">{e.name}</span>
            <span className="muted small">{e.type}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
