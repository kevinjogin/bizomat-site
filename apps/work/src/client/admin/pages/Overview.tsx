import { Link } from 'react-router-dom';
import { useAdmin, useRange, type Overview as OverviewData } from '../api';
import { TimeChart } from '../charts';
import { Card, Empty, Kpi, PageIntro, QueryState, RangeSelect, When, fmtDate, num, useTick } from '../ui';

const C = { brand: '#f97316', blue: '#0ea5e9', green: '#00a36c', violet: '#a855f7', slate: '#64748b' };

export default function Overview() {
  const [range, setRange] = useRange();
  const q = useAdmin<OverviewData>(`/overview?range=${range}`, { refetchInterval: 60_000, refetchIntervalInBackground: false });
  useTick(30_000);
  return (
    <div className="ac-stack">
      <PageIntro actions={<RangeSelect value={range} onChange={setRange} />}>
        <p className="muted">
          Who registered, who signs in, who is using Work by KEVOS right now — from live database records.
          {q.data ? <> Updated <When ts={q.data.generatedAt} />.</> : null}
        </p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const o = q.data!;
          const returned = o.users.total - o.users.neverReturned;
          return (
            <>
              <div className="ac-hero">
                <HeroStat label="Registered" value={o.users.total} sub={`${num(o.users.newToday)} new today`} />
                <HeroStat label="Logged in" value={o.loggedIn.users} sub={`${num(o.loggedIn.sessions)} valid session${o.loggedIn.sessions === 1 ? '' : 's'}`} />
                <HeroStat label="Active now" value={o.active.now} sub="heartbeat in the last 5 min" live />
                <HeroStat label="Active today" value={o.active.today} sub="distinct users (UTC day)" />
                <HeroStat label="Returned" value={returned} sub={`${num(o.users.neverReturned)} never came back`} />
              </div>

              <div className="ac-grid-2">
                <Card title="Active right now" subtitle="Open tab with a heartbeat in the last five minutes" actions={<Link className="btn sm" to="/admin/sessions">Live sessions</Link>}>
                  {o.activeNow.length ? (
                    <ul className="ac-list">
                      {o.activeNow.map((u) => (
                        <li key={u.id}>
                          <span className="ac-live-dot" aria-hidden />
                          <Link to={`/admin/users/${u.id}`} className="grow ellipsis">{u.email}</Link>
                          <span className="muted small"><When ts={u.lastActivityAt} /></span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>Nobody is using the app at this moment.</Empty>
                  )}
                </Card>
                <Card title="Recent sign-ups" actions={<Link className="btn sm" to="/admin/users">All users</Link>}>
                  {o.recentSignups.length ? (
                    <ul className="ac-list">
                      {o.recentSignups.map((u) => (
                        <li key={u.id}>
                          <Link to={`/admin/users/${u.id}`} className="grow ellipsis" title={u.name}>{u.email}</Link>
                          <span className="ac-tag">{num(u.projects)} project{u.projects === 1 ? '' : 's'}</span>
                          <span className="muted small" title="Registered"><When ts={u.registeredAt} /></span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No registrations yet.</Empty>
                  )}
                </Card>
              </div>

              <h2 className="ac-h2">Users</h2>
              <div className="ac-kpis">
                <Kpi label="Total registered" value={o.users.total} icon="users" tone="brand" />
                <Kpi label="New today" value={o.users.newToday} />
                <Kpi label="New this week" value={o.users.newThisWeek} hint="since Monday (UTC)" />
                <Kpi label="New this month" value={o.users.newThisMonth} />
                <Kpi label="Daily active (DAU)" value={o.active.today} tone="success" />
                <Kpi label="Weekly active (WAU)" value={o.active.last7Days} hint="last 7 days" />
                <Kpi label="Monthly active (MAU)" value={o.active.last30Days} hint="last 30 days" />
                <Kpi label="Never returned" value={o.users.neverReturned} tone="warning" hint="no sign-in or activity after registration day" />
              </div>

              <h2 className="ac-h2">Engagement</h2>
              <div className="ac-kpis">
                <Kpi label="Workspaces" value={o.content.workspaces} icon="layers" />
                <Kpi label="Projects (boards)" value={o.content.projects} icon="grid" hint={`${num(o.content.activeProjects)} not archived`} />
                <Kpi label="Tasks (items)" value={o.content.tasks} icon="checkSquare" />
                <Kpi label="Tasks completed" value={o.content.tasksCompleted} tone="success" />
                <Kpi label="Tasks pending" value={o.content.tasksPending} />
                <Kpi label="Avg projects / user" value={o.content.avgProjectsPerUser} digits={2} />
                <Kpi label="Users with a project" value={o.content.usersWithProjects} hint={o.users.total ? `${Math.round((o.content.usersWithProjects / o.users.total) * 100)}% of registered` : undefined} />
                <Kpi label="Anonymous page views" value={o.visitors.anonymousPageViewsInRange} hint={`${num(o.visitors.anonymousPageViewsToday)} today · visitors are not identified`} />
              </div>

              <h2 className="ac-h2">Growth</h2>
              <div className="ac-grid-2">
                <Card title="Registrations">
                  <TimeChart label="Registrations per day" series={[{ name: 'New users', color: C.brand, points: o.series.registrations }]} />
                </Card>
                <Card title="Total users">
                  <TimeChart kind="line" label="Cumulative registered users" series={[{ name: 'Registered users', color: C.violet, points: o.series.cumulativeUsers }]} />
                </Card>
                <Card title="Daily active users">
                  <TimeChart label="Daily active users" series={[{ name: 'Active users', color: C.green, points: o.series.dau }]} />
                </Card>
                <Card title="Weekly active users" subtitle="Distinct users per week (weeks start Monday, UTC)">
                  <TimeChart label="Weekly active users" series={[{ name: 'Active users', color: C.blue, points: o.series.wau }]} />
                </Card>
                <Card title="Projects created">
                  <TimeChart label="Projects created per day" series={[{ name: 'Projects', color: C.brand, points: o.series.projectsCreated }]} />
                </Card>
                <Card title="Tasks created vs completed">
                  <TimeChart
                    label="Tasks created and completed per day"
                    series={[
                      { name: 'Created', color: C.slate, points: o.series.tasksCreated },
                      { name: 'Completed', color: C.green, points: o.series.tasksCompleted },
                    ]}
                  />
                </Card>
              </div>
              {o.analyticsStartedAt ? (
                <p className="muted small ac-footnote">
                  Heartbeat and page-view tracking began {fmtDate(o.analyticsStartedAt)}; earlier history is reconstructed from stored records
                  (registrations, sessions, projects, tasks and edits). Charts use UTC days; times are shown in your local time zone.
                </p>
              ) : null}
            </>
          );
        }}
      </QueryState>
    </div>
  );
}

function HeroStat({ label, value, sub, live }: { label: string; value: number; sub: string; live?: boolean }) {
  return (
    <div className={`ac-hero-stat${live ? ' live' : ''}`}>
      <span className="ac-hero-label">
        {live ? <span className="ac-live-dot" aria-hidden /> : null}
        {label}
      </span>
      <span className="ac-hero-value">{num(value)}</span>
      <span className="ac-hero-sub">{sub}</span>
    </div>
  );
}
