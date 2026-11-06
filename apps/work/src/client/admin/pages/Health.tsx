import { Icon } from '../../components/ui/Icon';
import { useAdmin, type Point } from '../api';
import { TimeChart } from '../charts';
import { Card, Empty, Kpi, PageIntro, QueryState, TableWrap, When, fmtDateTime, num, relative, useTick } from '../ui';

interface Check {
  ok: boolean;
  ms?: number;
}
interface HealthResp {
  generatedAt: number;
  environment: string;
  version: { id: string; tag: string | null; deployedAt: string } | null;
  checks: { api: Check; database: Check; fileStorage: Check; cache: Check };
  last24h: { serverErrors: number; clientErrors: number; authFailures: number; failedLogins: number; rateLimited: number; failedAutomationRuns: number };
  series: { serverErrors: Point[]; clientErrors: Point[]; authFailures: Point[]; failedLogins: Point[]; rateLimited: Point[] };
  recentErrors: { id: string; at: number; method: string; route: string; status: number; name: string; message: string }[];
  maintenance: ({ lastRunAt: number } & Record<string, unknown>) | null;
  observability: string;
}

export default function Health() {
  const q = useAdmin<HealthResp>('/health', { refetchInterval: 60_000, refetchIntervalInBackground: false, placeholderData: (p) => p });
  useTick(10_000);
  return (
    <div className="ac-stack">
      <PageIntro
        actions={
          <>
            <span className="muted small">{q.data ? `Checked ${relative(q.dataUpdatedAt)}` : ''}</span>
            <button className="btn" onClick={() => q.refetch()} disabled={q.isFetching}><Icon name="refresh" /> {q.isFetching ? 'Checking…' : 'Run checks'}</button>
          </>
        }
      >
        <p className="muted">Live checks of the API, database, file storage and cache, plus failure counters recorded by the API.</p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const h = q.data!;
          const allOk = Object.values(h.checks).every((c) => c.ok);
          const maintAge = h.maintenance ? Date.now() - h.maintenance.lastRunAt : null;
          return (
            <>
              <div className={`ac-banner ${allOk ? 'ok' : 'bad'}`} role="status">
                <Icon name={allOk ? 'check' : 'x'} /> {allOk ? 'All systems operational' : 'One or more checks are failing'}
                <span className="spacer" />
                <span className="muted small">Environment: {h.environment}</span>
              </div>
              <div className="ac-health-grid">
                <StatusTile label="Application (API)" ok={h.checks.api.ok} detail="Responding" />
                <StatusTile label="Database (D1)" ok={h.checks.database.ok} detail={h.checks.database.ms != null ? `${h.checks.database.ms} ms query` : ''} />
                <StatusTile label="File storage (R2)" ok={h.checks.fileStorage.ok} detail={h.checks.fileStorage.ms != null ? `${h.checks.fileStorage.ms} ms` : ''} />
                <StatusTile label="Cache (KV)" ok={h.checks.cache.ok} detail={h.checks.cache.ms != null ? `${h.checks.cache.ms} ms` : ''} />
                <div className="ac-tile">
                  <span className="ac-tile-label">Deployed version</span>
                  {h.version ? (
                    <>
                      <span className="ac-tile-value mono" title={h.version.id}>{h.version.tag || h.version.id.slice(0, 8)}</span>
                      <span className="muted small">{h.version.deployedAt ? `deployed ${fmtDateTime(Date.parse(h.version.deployedAt))}` : ''}</span>
                    </>
                  ) : (
                    <span className="muted small">Version metadata unavailable (local or older deployment)</span>
                  )}
                </div>
                <div className="ac-tile">
                  <span className="ac-tile-label">Scheduled maintenance</span>
                  {h.maintenance ? (
                    <>
                      <span className={`ac-tile-value ${maintAge != null && maintAge > 45 * 60_000 ? 'warn' : ''}`}><When ts={h.maintenance.lastRunAt} /></span>
                      <span className="muted small">runs every 15 minutes</span>
                    </>
                  ) : (
                    <span className="muted small">No run recorded yet (runs every 15 minutes)</span>
                  )}
                </div>
              </div>
              <h2 className="ac-h2">Last 24 hours</h2>
              <div className="ac-kpis six">
                <Kpi label="Server errors (5xx)" value={h.last24h.serverErrors} tone={h.last24h.serverErrors ? 'danger' : undefined} />
                <Kpi label="Client errors (4xx)" value={h.last24h.clientErrors} />
                <Kpi label="Auth failures" value={h.last24h.authFailures} hint="401s + failed logins" />
                <Kpi label="Failed logins" value={h.last24h.failedLogins} tone={h.last24h.failedLogins > 20 ? 'warning' : undefined} />
                <Kpi label="Rate limited (429)" value={h.last24h.rateLimited} />
                <Kpi label="Failed automation runs" value={h.last24h.failedAutomationRuns} />
              </div>
              <div className="ac-grid-2">
                <Card title="Server errors · 14 days">
                  <TimeChart height={150} label="Server errors per day" series={[{ name: '5xx responses', color: '#e5484d', points: h.series.serverErrors }]} />
                </Card>
                <Card title="Authentication failures · 14 days">
                  <TimeChart
                    height={150}
                    label="Authentication failures per day"
                    series={[
                      { name: 'Unauthorised (401)', color: '#f5a524', points: h.series.authFailures },
                      { name: 'Failed logins', color: '#a855f7', points: h.series.failedLogins },
                    ]}
                  />
                </Card>
              </div>
              <Card title="Recent server errors" subtitle="Sanitised: route patterns and first-line messages only — no stack traces, IDs or personal data.">
                {h.recentErrors.length ? (
                  <TableWrap label="Recent errors">
                    <thead>
                      <tr>
                        <th>When</th>
                        <th>Request</th>
                        <th className="num">Status</th>
                        <th>Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {h.recentErrors.map((e) => (
                        <tr key={e.id}>
                          <td title={fmtDateTime(e.at)}><When ts={e.at} /></td>
                          <td className="mono">{e.method} {e.route}</td>
                          <td className="num">{e.status}</td>
                          <td><b>{e.name}</b> <span className="muted">{e.message}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                ) : (
                  <Empty>No server errors recorded in the last 90 days.</Empty>
                )}
              </Card>
              <p className="muted small ac-footnote">
                {h.observability} Request volume, latency and CPU time are available there; this page only stores aggregate counters. {num(h.recentErrors.length)} error record(s) shown.
              </p>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}

function StatusTile({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="ac-tile">
      <span className="ac-tile-label">{label}</span>
      <span className={`ac-tile-value ${ok ? 'ok' : 'bad'}`}>
        <span className={`ac-status-dot ${ok ? 'ok' : 'bad'}`} aria-hidden /> {ok ? 'Operational' : 'Failing'}
      </span>
      {detail ? <span className="muted small">{detail}</span> : null}
    </div>
  );
}
