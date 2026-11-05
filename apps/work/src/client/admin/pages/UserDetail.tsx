import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ApiError } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { Avatar } from '../../components/ui/ui';
import { EVENT_ICON, eventLabel, useAdmin, type UserDetail as Detail } from '../api';
import { ActivityStrip } from '../charts';
import { Bar, Card, DeviceCell, Empty, Kpi, QueryState, StatusPill, TableWrap, When, fmtDate, fmtDateTime, num } from '../ui';

const END_REASON: Record<string, string> = { logout: 'Signed out', revoked: 'Revoked', password_change: 'Password changed', password_reset: 'Password reset by the founder', expired: 'Expired' };

/** A strong password suggestion (letters, digits and a symbol; 16 characters) from the browser's secure random source. */
function suggestPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  return `${[...bytes].map((b) => alphabet[b % alphabet.length]).join('')}-${(bytes[0] % 90) + 10}`;
}

/**
 * Account recovery while no email provider is configured: the founder sets a new password for a person who has lost
 * theirs, after confirming who they are outside the app. Every session of that person ends; they should choose their
 * own password in Settings once they are back in.
 */
function PasswordReset({ userId, name }: { userId: string; name: string }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'done' | 'error'; message?: string }>({ kind: 'idle' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ kind: 'busy' });
    try {
      await api(`/admin/users/${userId}/password`, { body: { password } });
      setState({ kind: 'done', message: `Done. ${name} is signed out everywhere and can sign in with the new password. Give it to them by a channel you trust, and ask them to choose their own in Settings.` });
    } catch (err) {
      setState({ kind: 'error', message: err instanceof ApiError ? err.message : 'The password could not be set.' });
    }
  };
  return (
    <Card title="Account recovery">
      <form className="ac-stack" onSubmit={submit}>
        <p className="muted small">Set a new password for {name} if they have lost theirs. Confirm who is asking before you do: this signs them out of every device.</p>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <input className="input grow" type={show ? 'text' : 'password'} autoComplete="new-password" aria-label="New password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={10} maxLength={256} required />
          <button type="button" className="btn sm" onClick={() => setShow((v) => !v)}>{show ? 'Hide' : 'Show'}</button>
          <button type="button" className="btn sm" onClick={() => { setPassword(suggestPassword()); setShow(true); }}>Suggest</button>
          <button type="submit" className="btn primary sm" disabled={state.kind === 'busy' || password.length < 10}>Set password</button>
        </div>
        {state.message ? <p role="status" className={state.kind === 'error' ? 'danger-text small' : 'muted small'}>{state.message}</p> : null}
      </form>
    </Card>
  );
}

export default function UserDetail() {
  const { userId } = useParams();
  const q = useAdmin<Detail>(`/users/${userId}`);
  const me = useAdmin<{ user: { id: string }; role: 'founder' | 'admin' }>('/me', { staleTime: 60_000 });
  return (
    <div className="ac-stack">
      <Link to="/admin/users" className="ac-back"><Icon name="chevronLeft" size={14} /> All users</Link>
      <QueryState q={q}>
        {() => {
          const d = q.data!;
          const u = d.user;
          return (
            <>
              <div className="ac-profile">
                <Avatar id={u.id} name={u.name} size="lg" />
                <div className="grow" style={{ minWidth: 0 }}>
                  <h2 className="ac-profile-name">
                    {u.name}
                    {u.activeNow ? <span className="ac-pill success"><span className="ac-live-dot" aria-hidden /> Active now</span> : null}
                    {u.status !== 'active' ? <StatusPill status={u.status} /> : null}
                    {u.platformRole ? <span className={`ac-role ${u.platformRole}`}>{u.platformRole}</span> : null}
                  </h2>
                  <div className="muted ellipsis">{u.email}</div>
                  <div className="ac-profile-meta">
                    <span><b>Registered</b> {fmtDateTime(u.registeredAt)}</span>
                    <span><b>Last login</b> {fmtDateTime(u.lastLoginAt)}</span>
                    <span><b>Last activity</b> <When ts={u.lastActiveAt} /></span>
                    <span><b>Sign-in</b> {u.signInMethods.join(', ')}</span>
                    <span><b>Time zone</b> {u.timezone}</span>
                    <span><b>Failed sign-ins (30 d)</b> {num(u.failedLoginsLast30Days)}</span>
                  </div>
                </div>
              </div>

              <div className="ac-kpis five">
                <Kpi label="Logins" value={u.logins} icon="key" />
                <Kpi label="Workspaces" value={d.workspaces.length} icon="layers" />
                <Kpi label="Projects created" value={d.projects.length} icon="grid" tone="brand" />
                <Kpi label="Tasks created" value={d.tasks.created} icon="checkSquare" hint={d.tasks.firstCreatedAt ? `first on ${fmtDate(d.tasks.firstCreatedAt)}` : 'none yet'} />
                <Kpi label="Tasks completed" value={d.tasks.completed} tone="success" />
              </div>

              <Card title="Activity, last 90 days">
                <ActivityStrip days={d.dailyActivity} />
              </Card>

              <Card title="Sessions & login history" subtitle="Each row is one sign-in. Active = a heartbeat from an open tab in the last 5 minutes.">
                {d.sessions.length ? (
                  <TableWrap label="Sessions">
                    <thead>
                      <tr>
                        <th>Signed in</th>
                        <th>Last activity</th>
                        <th>Status</th>
                        <th>Ended</th>
                        <th>Device</th>
                        <th>Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.sessions.map((s) => (
                        <tr key={s.id}>
                          <td>{fmtDateTime(s.loginAt)}</td>
                          <td><When ts={s.lastActivityAt} /></td>
                          <td><StatusPill status={s.status === 'active' ? 'active_now' : s.status} /></td>
                          <td>{s.endedAt ? <>{fmtDateTime(s.endedAt)} <span className="muted small">· {END_REASON[s.endReason ?? ''] ?? s.endReason}</span></> : s.status === 'expired' ? <span className="muted">Expired {fmtDate(s.expiresAt)}</span> : <span className="muted">expires {fmtDate(s.expiresAt)}</span>}</td>
                          <td><DeviceCell device={s.device} browser={s.browser} os={s.os} /></td>
                          <td className="muted">{s.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                ) : (
                  <Empty>No sessions on record.</Empty>
                )}
              </Card>

              <div className="ac-grid-2">
                <Card title={`Workspaces (${d.workspaces.length})`}>
                  {d.workspaces.length ? (
                    <ul className="ac-list">
                      {d.workspaces.map((w) => (
                        <li key={w.id}>
                          <Icon name="layers" size={15} />
                          <span className="grow ellipsis">{w.name}</span>
                          {w.createdByUser ? <span className="ac-tag">created</span> : null}
                          <span className="ac-tag">{w.role}</span>
                          <span className="muted small">{num(w.members)} member{w.members === 1 ? '' : 's'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>Not a member of any workspace.</Empty>
                  )}
                </Card>
                <Card title={`Projects created (${d.projects.length})`}>
                  {d.projects.length ? (
                    <ul className="ac-list">
                      {d.projects.map((p) => (
                        <li key={p.id} className="col-li">
                          <div className="row" style={{ width: '100%' }}>
                            <Icon name="grid" size={15} />
                            <span className="grow ellipsis" title={p.name}>{p.name}</span>
                            {p.archived ? <span className="ac-tag">archived</span> : null}
                            <span className="muted small">{num(p.completed)}/{num(p.tasks)} done</span>
                          </div>
                          <div className="row" style={{ width: '100%' }}>
                            <span className="muted small ellipsis grow">{p.workspaceName} · created {fmtDate(p.createdAt)}</span>
                            <div style={{ width: 90 }}><Bar value={p.completed} max={p.tasks} color="var(--success)" /></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>Has not created a project yet.</Empty>
                  )}
                </Card>
              </div>

              {me.data?.role === 'founder' && me.data.user.id !== u.id ? <PasswordReset userId={u.id} name={u.name} /> : null}

              <Card title="Recent activity" actions={<Link className="btn sm" to={`/admin/activity?userId=${u.id}&userLabel=${encodeURIComponent(u.email)}`}>Full timeline</Link>}>
                {d.events.length ? (
                  <ol className="ac-timeline">
                    {d.events.map((e) => (
                      <li key={e.id}>
                        <span className="ac-tl-icon"><Icon name={EVENT_ICON[e.type] ?? 'activity'} size={13} /></span>
                        <div className="grow">
                          <span>{eventLabel(e.type)}</span>
                          {e.boardName ? <span className="muted"> · {e.boardName}</span> : e.workspaceName ? <span className="muted"> · {e.workspaceName}</span> : null}
                          {e.metadata.backfilled ? <span className="ac-tag" title="Reconstructed from stored records">history</span> : null}
                        </div>
                        <time className="muted small" title={fmtDateTime(e.at)}>{fmtDateTime(e.at)}</time>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <Empty>No activity recorded.</Empty>
                )}
              </Card>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
