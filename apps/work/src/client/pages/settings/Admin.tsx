import { Link } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { useWorkspace } from '../../lib/session';
import { formatBytes, timeAgo } from '../../lib/format';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';

export function AdminOverview() {
  const ws = useWorkspace();
  const q = useQuery({ queryKey: ['admin-overview', ws.id], queryFn: () => get<Record<string, number>>(`/workspaces/${ws.id}/admin/overview`) });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const d = q.data!;
  const stats: [string, string | number, string][] = [
    ['Members', d.members, 'users'],
    ['Pending invitations', d.pendingInvitations, 'users'],
    ['Active boards', d.boards, 'grid'],
    ['Items', d.items, 'checkSquare'],
    ['Documents', d.documents, 'doc'],
    ['Enabled automations', d.automations, 'bolt'],
    ['File storage', formatBytes(d.storageBytes), 'paperclip'],
  ];
  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="stat-tiles">
        {stats.map(([label, value, icon]) => (
          <div key={label} className="stat-tile">
            <span className="stat-label row"><Icon name={icon} size={13} /> {label}</span>
            <span className="stat-value">{value}</span>
          </div>
        ))}
      </div>
      <section className="card card-pad">
        <h2 style={{ marginBottom: 8 }}>Data export & backups</h2>
        <p className="muted">
          Download a complete JSON export of this workspace: boards, groups, columns, items, updates, documents, dashboards, goals, automations, teams, time entries and file metadata.
          File contents remain in secure storage. Exports are rate-limited and recorded in the audit log.
        </p>
        <a className="btn primary" href={`/api/workspaces/${ws.id}/export`} download>
          <Icon name="download" /> Export workspace data
        </a>
        <p className="muted small" style={{ marginTop: 12 }}>
          Point-in-time database recovery and scheduled backups are handled at the platform level (see DEPLOYMENT.md).
        </p>
      </section>
      <section className="card card-pad">
        <h2 style={{ marginBottom: 8 }}>Administration</h2>
        <div className="row wrap">
          <Link className="btn" to={`/w/${ws.id}/settings/members`}><Icon name="users" /> Users & roles</Link>
          <Link className="btn" to={`/w/${ws.id}/settings/audit`}><Icon name="history" /> Audit log</Link>
          <Link className="btn" to={`/w/${ws.id}/integrations`}><Icon name="plug" /> Integrations</Link>
          <Link className="btn" to={`/w/${ws.id}/automations`}><Icon name="bolt" /> Automations</Link>
        </div>
      </section>
    </div>
  );
}

interface AuditRow {
  id: string;
  action: string;
  actor_name: string | null;
  actor_email: string | null;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  created_at: number;
}

export function AuditLog() {
  const ws = useWorkspace();
  const q = useInfiniteQuery({
    queryKey: ['audit', ws.id],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => get<AuditRow[]>(`/workspaces/${ws.id}/audit${pageParam ? `?before=${pageParam}` : ''}`),
    getNextPageParam: (last) => (last.length >= 100 ? last[last.length - 1].created_at : undefined),
  });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const rows = (q.data?.pages ?? []).flat();
  return (
    <section className="card">
      <div className="card-header"><h2 className="grow">Audit log</h2><span className="muted small">Security-relevant actions in this workspace</span></div>
      {rows.length === 0 ? <EmptyState icon="history" title="No audit events yet" /> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table responsive">
            <thead><tr><th>When</th><th>Who</th><th>Action</th><th>Target</th><th>Details</th><th>IP</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td title={new Date(r.created_at).toLocaleString()} style={{ whiteSpace: 'nowrap' }}>{timeAgo(r.created_at)}</td>
                  <td>{r.actor_name ?? 'System'}<div className="muted small">{r.actor_email}</div></td>
                  <td><span className="badge accent">{r.action}</span></td>
                  <td className="small">{r.target_type ? `${r.target_type} ${r.target_id ?? ''}` : '—'}</td>
                  <td className="mono" style={{ maxWidth: 260, wordBreak: 'break-word' }}>{Object.keys(r.metadata ?? {}).length ? JSON.stringify(r.metadata) : ''}</td>
                  <td className="small">{r.ip ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {q.hasNextPage ? (
        <div className="center-fill" style={{ padding: 12 }}>
          <button className="btn" onClick={() => q.fetchNextPage()} disabled={q.isFetchingNextPage}>{q.isFetchingNextPage ? 'Loading…' : 'Load older events'}</button>
        </div>
      ) : null}
    </section>
  );
}
