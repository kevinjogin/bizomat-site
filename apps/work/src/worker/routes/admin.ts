// Founder admin API. Mounted at /api/admin behind requireAuth +
// requirePlatformAdmin (see app.ts). Read-mostly; never returns password
// hashes, token hashes, CSRF tokens or raw IP addresses.

import { Hono } from 'hono';
import { z } from 'zod';
import { parseUserAgent } from '../../shared/ua';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { audit, auditStmt } from '../services/audit';
import { hashPassword, passwordProblems } from '../auth/password';
import { EVENT_TYPES, utcDay } from '../services/analytics';
import { ACTIVE_WINDOW_MS, HEARTBEAT_INTERVAL_MS } from './me';

export const adminRoutes = new Hono<AppEnv>();

const DAY = 86_400_000;
const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const;
type Range = keyof typeof RANGES | 'all';

function parseRange(v: string | undefined): Range {
  return v === '7d' || v === '30d' || v === '90d' || v === 'all' ? v : '30d';
}

async function rangeStart(db: D1Database, range: Range): Promise<string> {
  const today = utcDay();
  if (range !== 'all') return utcDay(Date.parse(today) - (RANGES[range] - 1) * DAY);
  const first = await db.prepare('SELECT MIN(created_at) AS t FROM users').first<{ t: number | null }>();
  const start = first?.t ? utcDay(first.t) : today;
  // Cap the series to two years of daily points.
  return start < utcDay(Date.parse(today) - 729 * DAY) ? utcDay(Date.parse(today) - 729 * DAY) : start;
}

function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  for (let t = Date.parse(from); t <= Date.parse(to); t += DAY) out.push(utcDay(t));
  return out;
}

function fill(days: string[], rows: { d: string; n: number }[]) {
  const m = new Map(rows.map((r) => [r.d, r.n]));
  return days.map((d) => ({ date: d, value: m.get(d) ?? 0 }));
}

const dayExpr = (col: string) => `date(${col} / 1000, 'unixepoch')`;
const activeCutoff = () => now() - ACTIVE_WINDOW_MS;

async function first<T>(db: D1Database, sql: string, ...args: unknown[]): Promise<T> {
  return (await db.prepare(sql).bind(...args).first<T>()) as T;
}
async function all<T>(db: D1Database, sql: string, ...args: unknown[]): Promise<T[]> {
  return (await db.prepare(sql).bind(...args).all<T>()).results;
}

adminRoutes.get('/me', (c) => c.json({ user: c.get('user'), role: c.get('platformRole'), heartbeatIntervalMs: HEARTBEAT_INTERVAL_MS, activeWindowMs: ACTIVE_WINDOW_MS }));

// --------------------------------------------------------------- overview

adminRoutes.get('/overview', async (c) => {
  const db = c.env.DB;
  const range = parseRange(c.req.query('range'));
  const t = now();
  const today = utcDay(t);
  const dow = (new Date(Date.parse(today)).getUTCDay() + 6) % 7;
  const weekStart = utcDay(Date.parse(today) - dow * DAY);
  const monthStart = today.slice(0, 8) + '01';
  const ms = (d: string) => Date.parse(d + 'T00:00:00Z');
  const d7 = utcDay(t - 6 * DAY);
  const d30 = utcDay(t - 29 * DAY);

  const users = await first<any>(
    db,
    `SELECT COUNT(*) AS total,
       SUM(CASE WHEN created_at >= ?1 THEN 1 ELSE 0 END) AS today,
       SUM(CASE WHEN created_at >= ?2 THEN 1 ELSE 0 END) AS week,
       SUM(CASE WHEN created_at >= ?3 THEN 1 ELSE 0 END) AS month,
       SUM(CASE WHEN COALESCE(login_count, 0) <= 1 AND NOT EXISTS (
         SELECT 1 FROM user_daily_activity a WHERE a.user_id = users.id AND a.day > date(users.created_at / 1000, 'unixepoch')) THEN 1 ELSE 0 END) AS never_returned
     FROM users`,
    ms(today),
    ms(weekStart),
    ms(monthStart),
  );
  const active = await first<any>(
    db,
    `SELECT COUNT(DISTINCT CASE WHEN day = ?1 THEN user_id END) AS today,
            COUNT(DISTINCT CASE WHEN day >= ?2 THEN user_id END) AS d7,
            COUNT(DISTINCT CASE WHEN day >= ?3 THEN user_id END) AS d30
     FROM user_daily_activity WHERE day >= ?3`,
    today,
    d7,
    d30,
  );
  const sessions = await first<any>(
    db,
    `SELECT COUNT(DISTINCT CASE WHEN last_activity_at >= ?2 THEN user_id END) AS active_now_users,
            SUM(CASE WHEN last_activity_at >= ?2 THEN 1 ELSE 0 END) AS active_now_sessions,
            COUNT(DISTINCT user_id) AS logged_in_users,
            COUNT(*) AS logged_in_sessions
     FROM sessions WHERE ended_at IS NULL AND revoked_at IS NULL AND expires_at > ?1`,
    t,
    activeCutoff(),
  );
  const content = await first<any>(
    db,
    `SELECT (SELECT COUNT(*) FROM workspaces WHERE deleted_at IS NULL) AS workspaces,
            (SELECT COUNT(*) FROM boards WHERE kind != 'template') AS projects,
            (SELECT COUNT(*) FROM boards WHERE kind != 'template' AND archived_at IS NULL) AS active_projects,
            (SELECT COUNT(*) FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template') AS tasks,
            (SELECT COUNT(*) FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template' AND i.completed_at IS NOT NULL) AS tasks_completed,
            (SELECT COUNT(*) FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template' AND i.completed_at IS NULL AND i.archived_at IS NULL) AS tasks_pending,
            (SELECT COUNT(DISTINCT created_by) FROM boards WHERE kind != 'template') AS users_with_projects`,
  );
  const visits = await first<any>(
    db,
    `SELECT SUM(CASE WHEN metric = 'pageview_anonymous' AND day = ?1 THEN value ELSE 0 END) AS anon_today,
            SUM(CASE WHEN metric = 'pageview_anonymous' AND day >= ?2 THEN value ELSE 0 END) AS anon_range
     FROM analytics_daily WHERE day >= ?2`,
    today,
    await rangeStart(db, range),
  );

  // ---- series
  const from = await rangeStart(db, range);
  const days = daysBetween(from, today);
  const fromMs = ms(from);
  const [regs, dau, projects, tasksCreated, tasksDone, anon] = await Promise.all([
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM users WHERE created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, 'SELECT day AS d, COUNT(DISTINCT user_id) AS n FROM user_daily_activity WHERE day >= ? GROUP BY day', from),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM boards WHERE kind != 'template' AND created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('i.created_at')} AS d, COUNT(*) AS n FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template' AND i.created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('i.completed_at')} AS d, COUNT(*) AS n FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template' AND i.completed_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, "SELECT day AS d, value AS n FROM analytics_daily WHERE metric = 'pageview_anonymous' AND day >= ?", from),
  ]);
  const weekly = await all<{ d: string; n: number }>(
    db,
    `SELECT date(day, '-' || ((CAST(strftime('%w', day) AS INTEGER) + 6) % 7) || ' days') AS d, COUNT(DISTINCT user_id) AS n
     FROM user_daily_activity WHERE day >= ? GROUP BY d ORDER BY d`,
    from,
  );
  let regCumulative = (await first<{ n: number }>(db, 'SELECT COUNT(*) AS n FROM users WHERE created_at < ?', fromMs)).n;
  const growth = fill(days, regs).map((p) => ({ date: p.date, value: (regCumulative += p.value) }));

  const recentSignups = await all<any>(
    db,
    `SELECT u.id, u.name, u.email, u.created_at, u.last_active_at, u.login_count,
       (SELECT COUNT(*) FROM boards b WHERE b.created_by = u.id AND b.kind != 'template') AS projects
     FROM users u ORDER BY u.created_at DESC LIMIT 8`,
  );
  const activeNow = await all<any>(
    db,
    `SELECT u.id, u.name, u.email, MAX(s.last_activity_at) AS last_activity_at FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.ended_at IS NULL AND s.revoked_at IS NULL AND s.expires_at > ? AND s.last_activity_at >= ? GROUP BY u.id ORDER BY last_activity_at DESC LIMIT 12`,
    t,
    activeCutoff(),
  );
  const started = await first<{ value: string } | null>(db, "SELECT value FROM system_kv WHERE key = 'analytics_started_at'");

  return c.json({
    range,
    generatedAt: t,
    analyticsStartedAt: started ? Number(started.value) : null,
    users: { total: users.total ?? 0, newToday: users.today ?? 0, newThisWeek: users.week ?? 0, newThisMonth: users.month ?? 0, neverReturned: users.never_returned ?? 0 },
    active: { today: active.today ?? 0, last7Days: active.d7 ?? 0, last30Days: active.d30 ?? 0, now: sessions.active_now_users ?? 0, nowSessions: sessions.active_now_sessions ?? 0 },
    loggedIn: { users: sessions.logged_in_users ?? 0, sessions: sessions.logged_in_sessions ?? 0 },
    visitors: { anonymousPageViewsToday: visits.anon_today ?? 0, anonymousPageViewsInRange: visits.anon_range ?? 0 },
    content: {
      workspaces: content.workspaces,
      projects: content.projects,
      activeProjects: content.active_projects,
      tasks: content.tasks,
      tasksCompleted: content.tasks_completed,
      tasksPending: content.tasks_pending,
      usersWithProjects: content.users_with_projects,
      avgProjectsPerUser: users.total ? Math.round((content.projects / users.total) * 100) / 100 : 0,
    },
    series: {
      registrations: fill(days, regs),
      cumulativeUsers: growth,
      dau: fill(days, dau),
      wau: weekly.map((w) => ({ date: w.d, value: w.n })),
      projectsCreated: fill(days, projects),
      tasksCreated: fill(days, tasksCreated),
      tasksCompleted: fill(days, tasksDone),
      anonymousPageViews: fill(days, anon),
    },
    recentSignups: recentSignups.map((u) => ({ id: u.id, name: u.name, email: u.email, registeredAt: u.created_at, lastActiveAt: u.last_active_at, logins: u.login_count, projects: u.projects })),
    activeNow: activeNow.map((u) => ({ id: u.id, name: u.name, email: u.email, lastActivityAt: u.last_activity_at })),
  });
});

// ------------------------------------------------------------------ users

function likeEscape(s: string) {
  return `%${s.toLowerCase().replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
}

const USER_STATUS_SQL = `CASE
  WHEN u.disabled_at IS NOT NULL THEN 'disabled'
  WHEN active_now.last_activity_at IS NOT NULL THEN 'active_now'
  WHEN u.last_active_at >= :d7 THEN 'active'
  WHEN COALESCE(u.login_count, 0) <= 1 AND NOT EXISTS (SELECT 1 FROM user_daily_activity a WHERE a.user_id = u.id AND a.day > date(u.created_at / 1000, 'unixepoch')) THEN 'never_returned'
  ELSE 'inactive' END`;

async function queryUsers(db: D1Database, f: { q?: string; status?: string; regFrom?: string; regTo?: string; sort?: string; limit: number; offset: number }) {
  const t = now();
  const where: string[] = [];
  const args: unknown[] = [];
  if (f.q) {
    where.push("(lower(u.name) LIKE ? ESCAPE '\\' OR lower(u.email) LIKE ? ESCAPE '\\')");
    args.push(likeEscape(f.q), likeEscape(f.q));
  }
  if (f.regFrom) {
    where.push('u.created_at >= ?');
    args.push(Date.parse(f.regFrom + 'T00:00:00Z'));
  }
  if (f.regTo) {
    where.push('u.created_at < ?');
    args.push(Date.parse(f.regTo + 'T00:00:00Z') + DAY);
  }
  const statusExpr = USER_STATUS_SQL.replace(':d7', String(t - 7 * DAY));
  const having = f.status && ['active_now', 'active', 'inactive', 'never_returned', 'disabled'].includes(f.status) ? `WHERE status = '${f.status}'` : '';
  const order = f.sort === 'activity' ? 'last_active_at IS NULL, last_active_at DESC' : f.sort === 'name' ? 'lower(name)' : f.sort === 'oldest' ? 'created_at ASC' : 'created_at DESC';
  const sql = `SELECT * FROM (
      SELECT u.id, u.name, u.email, u.created_at, u.last_login_at, u.last_active_at, u.login_count, u.disabled_at, u.locked_until,
        (SELECT COUNT(*) FROM boards b WHERE b.created_by = u.id AND b.kind != 'template') AS projects,
        (SELECT COUNT(*) FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id WHERE m.user_id = u.id AND w.deleted_at IS NULL) AS workspaces,
        (SELECT COUNT(*) FROM items i WHERE i.created_by = u.id) AS tasks,
        (SELECT role FROM platform_admins p WHERE p.user_id = u.id) AS platform_role,
        active_now.last_activity_at AS active_now_at,
        ${statusExpr} AS status
      FROM users u
      LEFT JOIN (SELECT user_id, MAX(last_activity_at) AS last_activity_at FROM sessions
                 WHERE ended_at IS NULL AND revoked_at IS NULL AND expires_at > ${t} AND last_activity_at >= ${activeCutoff()} GROUP BY user_id) active_now ON active_now.user_id = u.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ) ${having} ORDER BY ${order} LIMIT ? OFFSET ?`;
  const rows = await all<any>(db, sql, ...args, f.limit, f.offset);
  const total = await first<{ n: number }>(
    db,
    `SELECT COUNT(*) AS n FROM (SELECT ${statusExpr} AS status FROM users u
       LEFT JOIN (SELECT user_id, MAX(last_activity_at) AS last_activity_at FROM sessions WHERE ended_at IS NULL AND revoked_at IS NULL AND expires_at > ${t} AND last_activity_at >= ${activeCutoff()} GROUP BY user_id) active_now ON active_now.user_id = u.id
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}) ${having}`,
    ...args,
  );
  return {
    total: total.n,
    users: rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      registeredAt: u.created_at,
      lastLoginAt: u.last_login_at,
      lastActiveAt: u.last_active_at,
      logins: u.login_count,
      projects: u.projects,
      workspaces: u.workspaces,
      tasks: u.tasks,
      status: u.status as string,
      activeNow: !!u.active_now_at,
      platformRole: u.platform_role,
      locked: !!(u.locked_until && u.locked_until > t),
    })),
  };
}

const usersQuery = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(['active_now', 'active', 'inactive', 'never_returned', 'disabled']).optional(),
  regFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  regTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sort: z.enum(['registered', 'oldest', 'activity', 'name']).optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
});

adminRoutes.get('/users', async (c) => {
  const parsed = usersQuery.safeParse(c.req.query());
  if (!parsed.success) throw badRequest('Invalid filters');
  const f = parsed.data;
  const r = await queryUsers(c.env.DB, { ...f, limit: 50, offset: (f.page - 1) * 50 });
  return c.json({ ...r, page: f.page, pageSize: 50 });
});

function sessionStatus(s: { ended_at: number | null; revoked_at: number | null; expires_at: number; last_activity_at: number | null }, t: number) {
  if (s.ended_at || s.revoked_at) return 'ended';
  if (s.expires_at <= t) return 'expired';
  if (s.last_activity_at && s.last_activity_at >= t - ACTIVE_WINDOW_MS) return 'active';
  return 'idle';
}

function sessionDTO(s: any, t: number) {
  const d = parseUserAgent(s.user_agent);
  return {
    id: s.id,
    userId: s.user_id,
    userName: s.user_name,
    userEmail: s.user_email,
    provider: s.provider,
    loginAt: s.created_at,
    lastActivityAt: s.last_activity_at,
    lastSeenAt: s.last_seen_at,
    expiresAt: s.expires_at,
    endedAt: s.ended_at ?? s.revoked_at,
    endReason: s.end_reason ?? (s.revoked_at ? 'revoked' : s.expires_at <= t ? 'expired' : null),
    status: sessionStatus(s, t),
    device: d.device,
    browser: d.browser,
    os: d.os,
  };
}

adminRoutes.get('/users/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const t = now();
  const u = await first<any>(db, 'SELECT id, name, email, timezone, locale, created_at, updated_at, last_login_at, last_active_at, login_count, disabled_at, locked_until, failed_logins, avatar_key FROM users WHERE id = ?', id);
  if (!u) throw notFound('User');
  const [sessions, workspaces, projects, taskStats, events, daily, identities, failed, role] = await Promise.all([
    all<any>(db, 'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', id),
    all<any>(
      db,
      `SELECT w.id, w.name, w.created_at, m.role, m.joined_at, (w.created_by = ?1) AS created_by_user,
         (SELECT COUNT(*) FROM workspace_members x WHERE x.workspace_id = w.id) AS members
       FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id WHERE m.user_id = ?1 AND w.deleted_at IS NULL ORDER BY m.joined_at`,
      id,
    ),
    all<any>(
      db,
      `SELECT b.id, b.name, b.workspace_id, w.name AS workspace_name, b.created_at, b.updated_at, b.archived_at,
         (SELECT COUNT(*) FROM items i WHERE i.board_id = b.id) AS tasks,
         (SELECT COUNT(*) FROM items i WHERE i.board_id = b.id AND i.completed_at IS NOT NULL) AS completed
       FROM boards b JOIN workspaces w ON w.id = b.workspace_id WHERE b.created_by = ? AND b.kind != 'template' ORDER BY b.created_at DESC LIMIT 100`,
      id,
    ),
    first<any>(db, 'SELECT COUNT(*) AS created, SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completed, MIN(created_at) AS first_at FROM items WHERE created_by = ?', id),
    all<any>(
      db,
      `SELECT e.id, e.event_type, e.created_at, e.workspace_id, e.board_id, e.metadata_json, w.name AS workspace_name, b.name AS board_name
       FROM user_activity_events e LEFT JOIN workspaces w ON w.id = e.workspace_id LEFT JOIN boards b ON b.id = e.board_id
       WHERE e.user_id = ? ORDER BY e.created_at DESC LIMIT 60`,
      id,
    ),
    all<any>(db, 'SELECT day, heartbeats, first_seen_at, last_seen_at FROM user_daily_activity WHERE user_id = ? AND day >= ? ORDER BY day', id, utcDay(t - 89 * DAY)),
    all<any>(db, 'SELECT provider, created_at FROM user_identities WHERE user_id = ?', id),
    first<{ n: number }>(db, "SELECT COUNT(*) AS n FROM audit_log WHERE actor_id = ? AND action = 'auth.login_failed' AND created_at >= ?", id, t - 30 * DAY),
    first<{ role: string } | null>(db, 'SELECT role FROM platform_admins WHERE user_id = ?', id),
  ]);
  await audit(db, { actorId: c.get('user').id, action: 'admin.user_viewed', targetType: 'user', targetId: id, ip: clientIp(c) });
  const sessionList = sessions.map((s) => sessionDTO({ ...s, user_name: u.name, user_email: u.email }, t));
  return c.json({
    user: {
      id: u.id,
      name: u.name,
      email: u.email,
      timezone: u.timezone,
      locale: u.locale,
      registeredAt: u.created_at,
      lastLoginAt: u.last_login_at,
      lastActiveAt: u.last_active_at,
      logins: u.login_count,
      status: u.disabled_at ? 'disabled' : u.locked_until && u.locked_until > t ? 'locked' : 'active',
      hasAvatar: !!u.avatar_key,
      signInMethods: [...(identities.length ? identities.map((i) => i.provider) : []), 'password'].filter((v, i, a) => a.indexOf(v) === i),
      failedLoginsLast30Days: failed.n,
      platformRole: role?.role ?? null,
      activeNow: sessionList.some((s) => s.status === 'active'),
    },
    sessions: sessionList,
    workspaces: workspaces.map((w) => ({ id: w.id, name: w.name, role: w.role, joinedAt: w.joined_at, createdByUser: !!w.created_by_user, members: w.members })),
    projects: projects.map((p) => ({ id: p.id, name: p.name, workspaceId: p.workspace_id, workspaceName: p.workspace_name, createdAt: p.created_at, updatedAt: p.updated_at, archived: !!p.archived_at, tasks: p.tasks, completed: p.completed })),
    tasks: { created: taskStats.created ?? 0, completed: taskStats.completed ?? 0, firstCreatedAt: taskStats.first_at },
    events: events.map((e) => ({ id: e.id, type: e.event_type, at: e.created_at, workspaceName: e.workspace_name, boardName: e.board_name, metadata: parseJson(e.metadata_json, {}) })),
    dailyActivity: daily.map((d) => ({ date: d.day, heartbeats: d.heartbeats })),
  });
});

// --------------------------------------------------------- live sessions

adminRoutes.get('/sessions', async (c) => {
  const db = c.env.DB;
  const t = now();
  const status = c.req.query('status') ?? 'active';
  if (!['active', 'logged_in', 'recent'].includes(status)) throw badRequest('Invalid status');
  const [where, args] =
    status === 'active'
      ? ['s.ended_at IS NULL AND s.revoked_at IS NULL AND s.expires_at > ? AND s.last_activity_at >= ?', [t, activeCutoff()]]
      : status === 'logged_in'
        ? ['s.ended_at IS NULL AND s.revoked_at IS NULL AND s.expires_at > ?', [t]]
        : ['s.created_at >= ?', [t - 7 * DAY]];
  const rows = await all<any>(
    db,
    `SELECT s.id, s.user_id, s.provider, s.user_agent, s.created_at, s.last_seen_at, s.last_activity_at, s.expires_at, s.ended_at, s.end_reason, s.revoked_at,
            u.name AS user_name, u.email AS user_email
     FROM sessions s JOIN users u ON u.id = s.user_id WHERE ${where} ORDER BY COALESCE(s.last_activity_at, s.created_at) DESC LIMIT 300`,
    ...args,
  );
  const summary = await first<any>(
    db,
    `SELECT (SELECT COUNT(*) FROM users) AS registered,
            COUNT(DISTINCT user_id) AS logged_in_users, COUNT(*) AS logged_in_sessions,
            COUNT(DISTINCT CASE WHEN last_activity_at >= ?2 THEN user_id END) AS active_users,
            SUM(CASE WHEN last_activity_at >= ?2 THEN 1 ELSE 0 END) AS active_sessions
     FROM sessions WHERE ended_at IS NULL AND revoked_at IS NULL AND expires_at > ?1`,
    t,
    activeCutoff(),
  );
  const anon = await first<{ n: number | null }>(db, "SELECT value AS n FROM analytics_daily WHERE metric = 'pageview_anonymous' AND day = ?", utcDay(t));
  return c.json({
    generatedAt: t,
    activeWindowMs: ACTIVE_WINDOW_MS,
    heartbeatIntervalMs: HEARTBEAT_INTERVAL_MS,
    summary: {
      registeredUsers: summary.registered ?? 0,
      loggedInUsers: summary.logged_in_users ?? 0,
      loggedInSessions: summary.logged_in_sessions ?? 0,
      activeUsers: summary.active_users ?? 0,
      activeSessions: summary.active_sessions ?? 0,
      anonymousPageViewsToday: anon?.n ?? 0,
    },
    sessions: rows.map((s) => sessionDTO(s, t)),
  });
});

// --------------------------------------------------------------- activity

const activityQuery = z.object({
  userId: z.string().max(64).optional(),
  type: z.string().max(40).optional(),
  workspaceId: z.string().max(64).optional(),
  boardId: z.string().max(64).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  before: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});

function activityWhere(f: z.infer<typeof activityQuery>) {
  const where: string[] = [];
  const args: unknown[] = [];
  if (f.userId) {
    where.push('e.user_id = ?');
    args.push(f.userId);
  }
  if (f.type) {
    if (!(EVENT_TYPES as string[]).includes(f.type)) throw badRequest('Unknown event type');
    where.push('e.event_type = ?');
    args.push(f.type);
  }
  if (f.workspaceId) {
    where.push('e.workspace_id = ?');
    args.push(f.workspaceId);
  }
  if (f.boardId) {
    where.push('e.board_id = ?');
    args.push(f.boardId);
  }
  if (f.from) {
    where.push('e.created_at >= ?');
    args.push(Date.parse(f.from + 'T00:00:00Z'));
  }
  if (f.to) {
    where.push('e.created_at < ?');
    args.push(Date.parse(f.to + 'T00:00:00Z') + DAY);
  }
  if (f.before) {
    where.push('e.created_at < ?');
    args.push(f.before);
  }
  return { sql: where.length ? 'WHERE ' + where.join(' AND ') : '', args };
}

const ACTIVITY_SELECT = `SELECT e.id, e.event_type, e.created_at, e.user_id, e.workspace_id, e.board_id, e.entity_type, e.entity_id, e.metadata_json,
    u.name AS user_name, u.email AS user_email, w.name AS workspace_name, b.name AS board_name
  FROM user_activity_events e LEFT JOIN users u ON u.id = e.user_id LEFT JOIN workspaces w ON w.id = e.workspace_id LEFT JOIN boards b ON b.id = e.board_id`;

const activityDTO = (e: any) => ({
  id: e.id,
  type: e.event_type,
  at: e.created_at,
  userId: e.user_id,
  userName: e.user_name,
  userEmail: e.user_email,
  workspaceId: e.workspace_id,
  workspaceName: e.workspace_name,
  boardId: e.board_id,
  boardName: e.board_name,
  entityType: e.entity_type,
  metadata: parseJson(e.metadata_json, {}),
});

adminRoutes.get('/activity', async (c) => {
  const parsed = activityQuery.safeParse(c.req.query());
  if (!parsed.success) throw badRequest('Invalid filters');
  const { sql, args } = activityWhere(parsed.data);
  const rows = await all<any>(c.env.DB, `${ACTIVITY_SELECT} ${sql} ORDER BY e.created_at DESC LIMIT ?`, ...args, parsed.data.limit);
  return c.json({ events: rows.map(activityDTO), eventTypes: EVENT_TYPES, nextBefore: rows.length === parsed.data.limit ? rows[rows.length - 1].created_at : null });
});

adminRoutes.get('/lookups', async (c) => {
  const db = c.env.DB;
  const [workspaces, boards] = await Promise.all([
    all<any>(db, 'SELECT id, name FROM workspaces WHERE deleted_at IS NULL ORDER BY name LIMIT 1000'),
    all<any>(db, "SELECT id, name, workspace_id FROM boards WHERE kind != 'template' ORDER BY name LIMIT 2000"),
  ]);
  return c.json({ workspaces, boards: boards.map((b) => ({ id: b.id, name: b.name, workspaceId: b.workspace_id })), eventTypes: EVENT_TYPES });
});

// --------------------------------------------------------------- projects

adminRoutes.get('/projects', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  const sort = c.req.query('sort') === 'created' ? 'b.created_at DESC' : c.req.query('sort') === 'tasks' ? 'tasks DESC' : 'last_activity DESC';
  const rows = await all<any>(
    c.env.DB,
    `SELECT b.id, b.name, b.created_at, b.archived_at, b.visibility, b.workspace_id, w.name AS workspace_name, u.id AS owner_id, u.name AS owner_name, u.email AS owner_email,
       (SELECT COUNT(*) FROM items i WHERE i.board_id = b.id) AS tasks,
       (SELECT COUNT(*) FROM items i WHERE i.board_id = b.id AND i.completed_at IS NOT NULL) AS completed,
       (SELECT COUNT(DISTINCT e.user_id) FROM user_activity_events e WHERE e.board_id = b.id) AS contributors,
       COALESCE((SELECT MAX(e.created_at) FROM user_activity_events e WHERE e.board_id = b.id), b.updated_at) AS last_activity
     FROM boards b JOIN workspaces w ON w.id = b.workspace_id LEFT JOIN users u ON u.id = b.created_by
     WHERE b.kind != 'template' ${q ? "AND (lower(b.name) LIKE ? ESCAPE '\\' OR lower(u.email) LIKE ? ESCAPE '\\' OR lower(w.name) LIKE ? ESCAPE '\\')" : ''}
     ORDER BY ${sort} LIMIT 500`,
    ...(q ? [likeEscape(q), likeEscape(q), likeEscape(q)] : []),
  );
  return c.json({
    projects: rows.map((p) => ({
      id: p.id,
      name: p.name,
      createdAt: p.created_at,
      archived: !!p.archived_at,
      visibility: p.visibility,
      workspaceId: p.workspace_id,
      workspaceName: p.workspace_name,
      ownerId: p.owner_id,
      ownerName: p.owner_name,
      ownerEmail: p.owner_email,
      tasks: p.tasks,
      completed: p.completed,
      contributors: p.contributors,
      lastActivityAt: p.last_activity,
    })),
  });
});

// --------------------------------------------------------------- adoption

adminRoutes.get('/adoption', async (c) => {
  const db = c.env.DB;
  const range = parseRange(c.req.query('range'));
  const from = await rangeStart(db, range);
  const fromMs = Date.parse(from + 'T00:00:00Z');
  const t = now();
  const cohort = await all<any>(
    db,
    `SELECT u.id, u.name, u.email, u.created_at, u.last_active_at, COALESCE(u.login_count, 0) AS logins,
       (SELECT COUNT(*) FROM workspace_members m WHERE m.user_id = u.id) AS workspaces,
       (SELECT COUNT(*) FROM boards b WHERE b.created_by = u.id AND b.kind != 'template') AS projects,
       (SELECT MIN(b.created_at) FROM boards b WHERE b.created_by = u.id AND b.kind != 'template') AS first_project_at,
       (SELECT COUNT(*) FROM items i WHERE i.created_by = u.id) AS tasks,
       (SELECT COUNT(*) FROM user_activity_events e WHERE e.user_id = u.id AND e.event_type = 'task.completed')
         + (SELECT COUNT(*) FROM items i WHERE i.created_by = u.id AND i.completed_at IS NOT NULL) AS completed,
       (SELECT COUNT(*) FROM user_daily_activity a WHERE a.user_id = u.id AND a.day > date(u.created_at / 1000, 'unixepoch')) AS return_days,
       (SELECT COUNT(*) FROM user_daily_activity a WHERE a.user_id = u.id AND a.day >= ?2) AS days_last14,
       (SELECT COUNT(*) FROM user_daily_activity a WHERE a.user_id = u.id) AS active_days
     FROM users u WHERE u.created_at >= ?1 ORDER BY u.created_at DESC`,
    fromMs,
    utcDay(t - 13 * DAY),
  );
  const visits = await first<{ n: number | null }>(db, "SELECT SUM(value) AS n FROM analytics_daily WHERE metric = 'pageview_anonymous' AND day >= ?", from);
  const n = (pred: (u: any) => boolean) => cohort.filter(pred).length;
  const stages = [
    { key: 'visited', label: 'Visited the website (anonymous page views)', count: visits?.n ?? 0, note: 'Page views by signed-out visitors, counted without identifying anyone.' },
    { key: 'registered', label: 'Registered', count: cohort.length },
    { key: 'logged_in', label: 'Logged in', count: n((u) => u.logins >= 1), note: 'Sign-up signs the user in automatically.' },
    { key: 'workspace', label: 'Has a workspace', count: n((u) => u.workspaces >= 1), note: 'Created at sign-up unless the user joined by invitation.' },
    { key: 'project', label: 'Created a first project', count: n((u) => u.projects >= 1) },
    { key: 'task', label: 'Created a first task', count: n((u) => u.tasks >= 1) },
    { key: 'completed', label: 'Completed a first task', count: n((u) => u.completed >= 1) },
    { key: 'returned', label: 'Came back on a later day', count: n((u) => u.return_days >= 1) },
  ];
  const withRates = stages.map((s, i) => {
    const prev = i === 0 ? null : stages[i - 1].count;
    const base = stages[1].count;
    return {
      ...s,
      conversionFromPrevious: i <= 1 || !prev ? null : Math.round((s.count / prev) * 1000) / 10,
      conversionFromRegistered: i < 1 || !base ? null : Math.round((s.count / base) * 1000) / 10,
    };
  });
  const brief = (u: any) => ({ id: u.id, name: u.name, email: u.email, registeredAt: u.created_at, lastActiveAt: u.last_active_at, projects: u.projects, tasks: u.tasks, activeDays: u.active_days });
  const fourteenAgo = t - 14 * DAY;
  const ttfp = cohort.filter((u) => u.first_project_at).map((u) => u.first_project_at - u.created_at).sort((a, b) => a - b);
  return c.json({
    range,
    from,
    stages: withRates,
    segments: {
      registeredNoProject: cohort.filter((u) => u.projects === 0).slice(0, 100).map(brief),
      projectNoTasks: cohort.filter((u) => u.projects > 0 && u.tasks === 0).slice(0, 100).map(brief),
      notReturned: cohort.filter((u) => u.return_days === 0).slice(0, 100).map(brief),
      consistentlyActive: cohort.filter((u) => u.days_last14 >= 4).slice(0, 100).map(brief),
      stoppedUsing: cohort.filter((u) => u.active_days >= 2 && (u.last_active_at ?? 0) < fourteenAgo).slice(0, 100).map(brief),
    },
    definitions: {
      consistentlyActive: 'Active on at least 4 of the last 14 days.',
      stoppedUsing: 'Active on 2+ days in total, but not in the last 14 days.',
      notReturned: 'No activity on any day after the registration day.',
    },
    medianTimeToFirstProjectMs: ttfp.length ? ttfp[Math.floor(ttfp.length / 2)] : null,
  });
});

// ------------------------------------------------------------------ health

adminRoutes.get('/health', async (c) => {
  const db = c.env.DB;
  const t = now();
  const timed = async <T,>(fn: () => Promise<T>) => {
    const s = Date.now();
    try {
      await fn();
      return { ok: true, ms: Date.now() - s };
    } catch {
      return { ok: false, ms: Date.now() - s };
    }
  };
  const [dbCheck, r2Check, kvCheck] = await Promise.all([
    timed(() => db.prepare('SELECT 1').first()),
    timed(() => c.env.FILES.list({ limit: 1 })),
    timed(() => c.env.CACHE.get('__health')),
  ]);
  const from = utcDay(t - 13 * DAY);
  const days = daysBetween(from, utcDay(t));
  const metrics = await all<{ day: string; metric: string; value: number }>(db, 'SELECT day, metric, value FROM analytics_daily WHERE day >= ?', from);
  const series = (m: string) => days.map((d) => ({ date: d, value: metrics.find((x) => x.day === d && x.metric === m)?.value ?? 0 }));
  const errors = await all<any>(db, 'SELECT id, created_at, method, route, status, error_name, message FROM app_errors ORDER BY created_at DESC LIMIT 50');
  const lastMaint = await first<{ value: string; updated_at: number } | null>(db, "SELECT value, updated_at FROM system_kv WHERE key = 'last_maintenance'");
  const failedAutomations = await first<{ n: number }>(db, "SELECT COUNT(*) AS n FROM automation_runs WHERE status = 'failed' AND started_at >= ?", t - DAY);
  const v = c.env.CF_VERSION_METADATA;
  const sum = (m: string, d = 1) => series(m).slice(-d).reduce((s, p) => s + p.value, 0);
  return c.json({
    generatedAt: t,
    environment: c.env.ENVIRONMENT,
    version: v ? { id: v.id, tag: v.tag || null, deployedAt: v.timestamp } : null,
    checks: { api: { ok: true }, database: dbCheck, fileStorage: r2Check, cache: kvCheck },
    last24h: {
      serverErrors: sum('api_5xx'),
      clientErrors: sum('api_4xx') + sum('api_403'),
      authFailures: sum('api_401') + sum('auth_login_failed'),
      failedLogins: sum('auth_login_failed'),
      rateLimited: sum('api_429'),
      failedAutomationRuns: failedAutomations.n,
    },
    series: { serverErrors: series('api_5xx'), clientErrors: series('api_4xx'), authFailures: series('api_401'), failedLogins: series('auth_login_failed'), rateLimited: series('api_429') },
    recentErrors: errors.map((e) => ({ id: e.id, at: e.created_at, method: e.method, route: e.route, status: e.status, name: e.error_name, message: e.message })),
    maintenance: lastMaint ? { lastRunAt: lastMaint.updated_at, ...parseJson<Record<string, unknown>>(lastMaint.value, {}) } : null,
    observability: c.env.RUNTIME === 'node'
      ? 'The server writes one log line per request (method, path, status, time; no IP addresses or content): fly logs -a bizomat.'
      : 'Cloudflare Workers Logs are enabled for this Worker (dashboard → Workers & Pages → the Worker → Logs).',
  });
});

// ---------------------------------------------------------------- settings

adminRoutes.get('/settings', async (c) => {
  const admins = await all<any>(
    c.env.DB,
    'SELECT p.user_id, p.role, p.granted_by, p.granted_at, u.name, u.email FROM platform_admins p JOIN users u ON u.id = p.user_id ORDER BY p.granted_at',
  );
  const auditRows = await all<any>(
    c.env.DB,
    "SELECT a.action, a.created_at, a.target_type, a.target_id, u.email AS actor_email FROM audit_log a LEFT JOIN users u ON u.id = a.actor_id WHERE a.action LIKE 'admin.%' OR a.action LIKE 'platform_admin.%' ORDER BY a.created_at DESC LIMIT 50",
  );
  const started = await first<{ value: string } | null>(c.env.DB, "SELECT value FROM system_kv WHERE key = 'analytics_started_at'");
  return c.json({
    you: { id: c.get('user').id, role: c.get('platformRole') },
    admins: admins.map((a) => ({ userId: a.user_id, name: a.name, email: a.email, role: a.role, grantedBy: a.granted_by, grantedAt: a.granted_at })),
    adminAudit: auditRows,
    tracking: {
      heartbeatIntervalMs: HEARTBEAT_INTERVAL_MS,
      activeWindowMs: ACTIVE_WINDOW_MS,
      analyticsStartedAt: started ? Number(started.value) : null,
      retention: [
        { data: 'Activity events, daily activity, daily counters', keptFor: 'Indefinitely (aggregate product history)' },
        { data: 'Sessions / login history', keptFor: '365 days after the session ends' },
        { data: 'IP address on sessions', keptFor: '30 days (security only; never shown in the admin dashboard)' },
        { data: 'Session token hashes', keptFor: 'Removed as soon as a session ends' },
        { data: 'Sanitised server errors', keptFor: '90 days' },
      ],
    },
  });
});

adminRoutes.post('/admins', async (c) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can grant admin access');
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email().max(320) }));
  const target = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(input.email).first<{ id: string }>();
  if (!target) throw notFound('User');
  await c.env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at, note) VALUES (?, 'admin', ?, ?, '') ON CONFLICT(user_id) DO NOTHING")
    .bind(target.id, c.get('user').id, now())
    .run();
  await audit(c.env.DB, { actorId: c.get('user').id, action: 'platform_admin.granted', targetType: 'user', targetId: target.id, metadata: { role: 'admin' }, ip: clientIp(c) });
  return c.json({ ok: true }, 201);
});

adminRoutes.delete('/admins/:userId', async (c) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can revoke admin access');
  const userId = c.req.param('userId');
  const row = await c.env.DB.prepare('SELECT role FROM platform_admins WHERE user_id = ?').bind(userId).first<{ role: string }>();
  if (!row) throw notFound('Admin');
  if (row.role === 'founder') {
    const founders = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM platform_admins WHERE role = 'founder'").first<{ n: number }>();
    if ((founders?.n ?? 0) <= 1) throw badRequest('The last founder cannot be removed here; use the Admin operations workflow');
  }
  await c.env.DB.prepare('DELETE FROM platform_admins WHERE user_id = ?').bind(userId).run();
  await audit(c.env.DB, { actorId: c.get('user').id, action: 'platform_admin.revoked', targetType: 'user', targetId: userId, ip: clientIp(c) });
  return c.json({ ok: true });
});

// Account recovery while no email provider is configured: the founder sets a new password for a person who has lost
// theirs (after confirming who they are outside the app). The same password rules apply as for a person's own change;
// every session of that person ends at once, a lockout is cleared, and the change is audited. The person should then
// choose their own password in Settings. The founder changes their own password in Settings, not here.
adminRoutes.post('/users/:id/password', async (c) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can set a password for someone');
  const actor = c.get('user');
  await rateLimit(c.env.DB, `admin-password:${actor.id}`, 10, 60 * 60_000);
  const id = c.req.param('id');
  const input = await body(c, z.object({ password: z.string().max(256) }));
  const target = await c.env.DB.prepare('SELECT id, email, disabled_at FROM users WHERE id = ?').bind(id).first<{ id: string; email: string; disabled_at: number | null }>();
  if (!target) throw notFound('User');
  if (target.id === actor.id) throw badRequest('Change your own password in Settings');
  const problem = passwordProblems(input.password, target.email);
  if (problem) throw badRequest(problem);
  const t = now();
  await c.env.DB.batch([
    // A password someone else chose is temporary: the person must choose their own when they next sign in.
    c.env.DB.prepare('UPDATE users SET password_hash = ?, password_reset_required = 1, failed_logins = 0, locked_until = NULL, updated_at = ? WHERE id = ?').bind(await hashPassword(input.password), t, target.id),
    c.env.DB.prepare("UPDATE sessions SET revoked_at = ?1, ended_at = ?1, end_reason = 'password_reset' WHERE user_id = ?2 AND revoked_at IS NULL").bind(t, target.id),
    auditStmt(c.env.DB, { actorId: actor.id, action: 'admin.password_reset', targetType: 'user', targetId: target.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

// Security reset (founder only): end every session but the founder's own, everywhere, at once; optionally require
// everyone who signs in with a password to choose a new one first. For a suspected exposure of sessions or password
// hashes. People keep their accounts and data; they sign in again (with their current password, then a new one).
adminRoutes.post('/security-reset', async (c) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can end every session');
  const actor = c.get('user');
  await rateLimit(c.env.DB, `admin-security-reset:${actor.id}`, 5, 60 * 60_000);
  const input = await body(c, z.object({ requirePasswordReset: z.boolean().default(false) }));
  const keep = c.get('session')?.id ?? '';
  const t = now();
  const ended = await c.env.DB.prepare("UPDATE sessions SET revoked_at = ?1, ended_at = ?1, end_reason = 'security_reset' WHERE revoked_at IS NULL AND id != ?2").bind(t, keep).run();
  let flagged = 0;
  if (input.requirePasswordReset) {
    const r = await c.env.DB.prepare('UPDATE users SET password_reset_required = 1, updated_at = ?1 WHERE id != ?2 AND password_hash IS NOT NULL AND disabled_at IS NULL').bind(t, actor.id).run();
    flagged = r.meta.changes ?? 0;
  }
  const sessionsEnded = ended.meta.changes ?? 0;
  await auditStmt(c.env.DB, { actorId: actor.id, action: 'admin.security_reset', metadata: { sessionsEnded, passwordResetRequired: input.requirePasswordReset, accounts: flagged }, ip: clientIp(c) }).run();
  return c.json({ sessionsEnded, accountsToChoosePassword: flagged });
});

// ----------------------------------------------------------------- exports

/** CSV cell with formula-injection protection. */
function csvCell(v: unknown): string {
  let s = v == null ? '' : typeof v === 'number' ? String(v) : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function csv(rows: unknown[][]): string {
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
const iso = (t: number | null | undefined) => (t ? new Date(t).toISOString() : '');

/** Download names people see: bizomat-project-management-<export>-<day>.csv */
const EXPORT_PREFIX = 'bizomat-project-management';

function csvResponse(name: string, content: string) {
  return new Response(content, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'no-store' },
  });
}

adminRoutes.get('/export/users.csv', async (c) => {
  await rateLimit(c.env.DB, `admin-export:${c.get('user').id}`, 30, 60 * 60_000);
  const { users } = await queryUsers(c.env.DB, { limit: 100_000, offset: 0 });
  await audit(c.env.DB, { actorId: c.get('user').id, action: 'admin.export_users', metadata: { rows: users.length }, ip: clientIp(c) });
  return csvResponse(
    `${EXPORT_PREFIX}-users-${utcDay()}.csv`,
    csv([
      ['user_id', 'name', 'email', 'registered_at_utc', 'last_login_at_utc', 'last_active_at_utc', 'logins', 'status', 'workspaces', 'projects', 'tasks'],
      ...users.map((u) => [u.id, u.name, u.email, iso(u.registeredAt), iso(u.lastLoginAt), iso(u.lastActiveAt), u.logins, u.status, u.workspaces, u.projects, u.tasks]),
    ]),
  );
});

adminRoutes.get('/export/activity.csv', async (c) => {
  await rateLimit(c.env.DB, `admin-export:${c.get('user').id}`, 30, 60 * 60_000);
  const parsed = activityQuery.safeParse({ ...c.req.query(), limit: 200 });
  if (!parsed.success) throw badRequest('Invalid filters');
  const { sql, args } = activityWhere(parsed.data);
  const rows = await all<any>(c.env.DB, `${ACTIVITY_SELECT} ${sql} ORDER BY e.created_at DESC LIMIT 50000`, ...args);
  await audit(c.env.DB, { actorId: c.get('user').id, action: 'admin.export_activity', metadata: { rows: rows.length }, ip: clientIp(c) });
  return csvResponse(
    `${EXPORT_PREFIX}-activity-${utcDay()}.csv`,
    csv([
      ['event_id', 'occurred_at_utc', 'event_type', 'user_id', 'user_email', 'workspace', 'project', 'entity_type'],
      ...rows.map((e) => [e.id, iso(e.created_at), e.event_type, e.user_id ?? '', e.user_email ?? '', e.workspace_name ?? '', e.board_name ?? '', e.entity_type ?? '']),
    ]),
  );
});

adminRoutes.get('/export/summary.csv', async (c) => {
  await rateLimit(c.env.DB, `admin-export:${c.get('user').id}`, 30, 60 * 60_000);
  const db = c.env.DB;
  const range = parseRange(c.req.query('range') ?? 'all');
  const from = await rangeStart(db, range);
  const days = daysBetween(from, utcDay());
  const fromMs = Date.parse(from + 'T00:00:00Z');
  const [regs, dau, projects, tasksC, tasksD, anon] = await Promise.all([
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM users WHERE created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, 'SELECT day AS d, COUNT(DISTINCT user_id) AS n FROM user_daily_activity WHERE day >= ? GROUP BY day', from),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('created_at')} AS d, COUNT(*) AS n FROM boards WHERE kind != 'template' AND created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('i.created_at')} AS d, COUNT(*) AS n FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template' AND i.created_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, `SELECT ${dayExpr('i.completed_at')} AS d, COUNT(*) AS n FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template' AND i.completed_at >= ? GROUP BY d`, fromMs),
    all<{ d: string; n: number }>(db, "SELECT day AS d, value AS n FROM analytics_daily WHERE metric = 'pageview_anonymous' AND day >= ?", from),
  ]);
  const m = (rows: { d: string; n: number }[]) => new Map(rows.map((r) => [r.d, r.n]));
  const [R, D, P, TC, TD, A] = [regs, dau, projects, tasksC, tasksD, anon].map(m);
  await audit(db, { actorId: c.get('user').id, action: 'admin.export_summary', metadata: { range }, ip: clientIp(c) });
  return csvResponse(
    `${EXPORT_PREFIX}-daily-summary-${utcDay()}.csv`,
    csv([
      ['date_utc', 'registrations', 'daily_active_users', 'projects_created', 'tasks_created', 'tasks_completed', 'anonymous_page_views'],
      ...days.map((d) => [d, R.get(d) ?? 0, D.get(d) ?? 0, P.get(d) ?? 0, TC.get(d) ?? 0, TD.get(d) ?? 0, A.get(d) ?? 0]),
    ]),
  );
});
