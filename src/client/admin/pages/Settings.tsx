import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, post } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { RANGE_LABELS, useAdmin, type Range } from '../api';
import { Card, Empty, PageIntro, QueryState, TableWrap, When, fmtDate, fmtDateTime } from '../ui';

interface SettingsResp {
  you: { id: string; role: 'founder' | 'admin' };
  admins: { userId: string; name: string; email: string; role: 'founder' | 'admin'; grantedBy: string | null; grantedAt: number }[];
  adminAudit: { action: string; created_at: number; target_type: string | null; target_id: string | null; actor_email: string | null }[];
  tracking: { heartbeatIntervalMs: number; activeWindowMs: number; analyticsStartedAt: number | null; retention: { data: string; keptFor: string }[] };
}

const AUDIT_LABELS: Record<string, string> = {
  'admin.user_viewed': 'Viewed a user profile',
  'admin.export_users': 'Exported users (CSV)',
  'admin.export_activity': 'Exported activity (CSV)',
  'admin.export_summary': 'Exported daily summary (CSV)',
  'platform_admin.granted': 'Granted admin access',
  'platform_admin.revoked': 'Revoked admin access',
};

export default function Settings({ role }: { role: 'founder' | 'admin' }) {
  const q = useAdmin<SettingsResp>('/settings');
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [summaryRange, setSummaryRange] = useState<Range>('all');
  const isFounder = role === 'founder';
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin', '/settings'] });
  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await post('/admin/admins', { email: email.trim() });
      toast(`Admin access granted to ${email.trim()}`);
      setEmail('');
      refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">Who can open this console, how tracking works, and how long data is kept.</p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const d = q.data!;
          return (
            <>
              <Card title="Platform administrators" subtitle="Separate from workspace roles. Every admin request is checked on the server; non-admins receive “not found”.">
                <TableWrap label="Administrators">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Granted</th>
                      <th>By</th>
                      {isFounder ? <th aria-label="Actions" /> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {d.admins.map((a) => (
                      <tr key={a.userId}>
                        <td>
                          <div className="ac-user-cell">
                            <span className="ac-user-name">{a.name}{a.userId === d.you.id ? <span className="ac-tag">you</span> : null}</span>
                            <span className="muted small">{a.email}</span>
                          </div>
                        </td>
                        <td><span className={`ac-role ${a.role}`}>{a.role}</span></td>
                        <td>{fmtDate(a.grantedAt) === '—' ? '—' : fmtDateTime(a.grantedAt)}</td>
                        <td className="muted">{a.grantedBy === 'migration-0004' ? 'Initial setup' : a.grantedBy === 'github-actions' ? 'Admin operations workflow' : d.admins.find((x) => x.userId === a.grantedBy)?.email ?? a.grantedBy ?? '—'}</td>
                        {isFounder ? (
                          <td className="num">
                            {a.role !== 'founder' ? (
                              <button
                                className="btn ghost sm"
                                onClick={async () => {
                                  if (!(await confirm({ title: `Remove admin access for ${a.email}?`, message: 'They will immediately lose access to the founder console.', danger: true, confirmLabel: 'Remove access' }))) return;
                                  try {
                                    await del(`/admin/admins/${a.userId}`);
                                    toast('Admin access removed');
                                    refresh();
                                  } catch (err) {
                                    toast(errorMessage(err), 'error');
                                  }
                                }}
                              >
                                Revoke
                              </button>
                            ) : null}
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                {isFounder ? (
                  <form className="ac-grant" onSubmit={grant}>
                    <label className="ac-search grow">
                      <Icon name="user" />
                      <input className="input" type="email" placeholder="Existing account email" aria-label="Email of the account to make an admin" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <button className="btn primary" disabled={busy || !email.trim()}>Grant admin access</button>
                  </form>
                ) : (
                  <p className="muted small">Only the founder can add or remove administrators.</p>
                )}
                <p className="muted small">
                  The account must already exist. Admins can view all dashboards and exports; only the founder manages admins. To change the founder, use the
                  “Admin operations” GitHub workflow.
                </p>
              </Card>

              <div className="ac-grid-2">
                <Card title="Session tracking">
                  <dl className="ac-dl">
                    <dt>Heartbeat</dt>
                    <dd>Every {Math.round(d.tracking.heartbeatIntervalMs / 1000)} s from a visible tab the user has interacted with recently</dd>
                    <dt>“Active now”</dt>
                    <dd>Heartbeat within the last {Math.round(d.tracking.activeWindowMs / 60_000)} minutes</dd>
                    <dt>Anonymous visitors</dt>
                    <dd>Counted as daily page-view totals only — no cookies, no identifiers</dd>
                    <dt>Tracking started</dt>
                    <dd>{fmtDateTime(d.tracking.analyticsStartedAt)}</dd>
                  </dl>
                  <a className="btn sm" href="/privacy" target="_blank" rel="noopener noreferrer">View privacy notice</a>
                </Card>
                <Card title="Data retention">
                  <TableWrap label="Retention">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Kept for</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.tracking.retention.map((r) => (
                        <tr key={r.data}>
                          <td>{r.data}</td>
                          <td className="muted">{r.keptFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                </Card>
              </div>

              <Card title="Exports" subtitle="CSV files, generated on demand from live data. Downloads are logged and contain no passwords or tokens.">
                <div className="ac-exports">
                  <a className="btn" href="/api/admin/export/users.csv" download><Icon name="download" /> Registered users</a>
                  <a className="btn" href="/api/admin/export/activity.csv" download><Icon name="download" /> Activity log</a>
                  <span className="row" style={{ gap: 6 }}>
                    <select className="select" aria-label="Summary range" value={summaryRange} onChange={(e) => setSummaryRange(e.target.value as Range)} style={{ width: 'auto' }}>
                      {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
                        <option key={r} value={r}>{RANGE_LABELS[r]}</option>
                      ))}
                    </select>
                    <a className="btn" href={`/api/admin/export/summary.csv?range=${summaryRange}`} download><Icon name="download" /> Daily summary</a>
                  </span>
                </div>
              </Card>

              <Card title="Admin audit log" subtitle="Recent actions taken in this console.">
                {d.adminAudit.length ? (
                  <ol className="ac-timeline">
                    {d.adminAudit.map((a, i) => (
                      <li key={i}>
                        <span className="ac-tl-icon"><Icon name="shield" size={13} /></span>
                        <div className="grow" style={{ minWidth: 0 }}>
                          <span>{a.actor_email ?? 'Automation'}</span> <span className="muted">· {AUDIT_LABELS[a.action] ?? a.action}</span>
                        </div>
                        <span className="muted small" title={fmtDateTime(a.created_at)}><When ts={a.created_at} /></span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <Empty>No admin actions recorded yet.</Empty>
                )}
              </Card>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
