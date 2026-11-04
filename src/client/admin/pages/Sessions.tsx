import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import { useAdmin, type SessionRow } from '../api';
import { Card, DeviceCell, Empty, Kpi, PageIntro, QueryState, StatusPill, TableWrap, When, fmtDateTime, relative, useTick } from '../ui';

interface SessionsResp {
  generatedAt: number;
  activeWindowMs: number;
  heartbeatIntervalMs: number;
  summary: { registeredUsers: number; loggedInUsers: number; loggedInSessions: number; activeUsers: number; activeSessions: number; anonymousPageViewsToday: number };
  sessions: SessionRow[];
}

const TABS = [
  { v: 'active', label: 'Active now' },
  { v: 'logged_in', label: 'Logged in' },
  { v: 'recent', label: 'Last 7 days' },
] as const;

export default function Sessions() {
  const [tab, setTab] = useState<(typeof TABS)[number]['v']>('active');
  const q = useAdmin<SessionsResp>(`/sessions?status=${tab}`, { refetchInterval: 30_000, refetchIntervalInBackground: false, placeholderData: (p) => p });
  useTick(5_000);
  const minutes = q.data ? Math.round(q.data.activeWindowMs / 60_000) : 5;
  return (
    <div className="ac-stack">
      <PageIntro
        actions={
          <>
            <span className="muted small" aria-live="polite">{q.data ? `Updated ${relative(q.dataUpdatedAt)}` : ''}</span>
            <button className="btn" onClick={() => q.refetch()} disabled={q.isFetching}><Icon name="refresh" /> {q.isFetching ? 'Refreshing…' : 'Refresh'}</button>
          </>
        }
      >
        <p className="muted">
          A user is <b>active</b> when an open, visible tab sent a heartbeat in the last {minutes} minutes (tabs send one about every{' '}
          {q.data ? Math.round(q.data.heartbeatIntervalMs / 1000) : 60} s while someone is using them). A valid login cookie alone is only counted as <b>logged in</b>.
          This page refreshes every 30 s while it is visible.
        </p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const d = q.data!;
          return (
            <>
              <div className="ac-kpis four">
                <Kpi label="Registered users" value={d.summary.registeredUsers} icon="users" />
                <Kpi label="Logged in (valid sessions)" value={d.summary.loggedInUsers} icon="key" hint={`${d.summary.loggedInSessions} session${d.summary.loggedInSessions === 1 ? '' : 's'}`} />
                <Kpi label="Active now" value={d.summary.activeUsers} tone="success" icon="activity" hint={`${d.summary.activeSessions} active session${d.summary.activeSessions === 1 ? '' : 's'}`} />
                <Kpi label="Anonymous page views today" value={d.summary.anonymousPageViewsToday} icon="eye" hint="signed-out visitors · identities unknown" />
              </div>
              <Card>
                <div className="ac-tabs" role="tablist">
                  {TABS.map((t) => (
                    <button key={t.v} role="tab" aria-selected={tab === t.v} className={tab === t.v ? 'on' : ''} onClick={() => setTab(t.v)}>
                      {t.label}
                    </button>
                  ))}
                </div>
                {d.sessions.length ? (
                  <TableWrap label="Sessions">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Status</th>
                        <th>Signed in</th>
                        <th>Last activity</th>
                        <th>Device & browser</th>
                        <th>Session ends</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.sessions.map((s) => (
                        <tr key={s.id}>
                          <td>
                            <Link to={`/admin/users/${s.userId}`} className="ac-user-cell">
                              <span className="ac-user-name">{s.userEmail}</span>
                              <span className="muted small">{s.userName}</span>
                            </Link>
                          </td>
                          <td><StatusPill status={s.status === 'active' ? 'active_now' : s.status} /></td>
                          <td title={fmtDateTime(s.loginAt)}>{fmtDateTime(s.loginAt)}</td>
                          <td><When ts={s.lastActivityAt} /></td>
                          <td><DeviceCell device={s.device} browser={s.browser} os={s.os} /></td>
                          <td className="muted">{s.endedAt ? `ended ${fmtDateTime(s.endedAt)}` : fmtDateTime(s.expiresAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                ) : (
                  <Empty>{tab === 'active' ? 'No one is actively using the app right now.' : tab === 'logged_in' ? 'No valid sessions.' : 'No sign-ins in the last 7 days.'}</Empty>
                )}
              </Card>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
