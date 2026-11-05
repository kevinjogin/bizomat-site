import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { createBoard, login, raw, signup, uniqueEmail, type Client } from './helpers';
import { runMaintenance } from '../src/worker/index';

async function makeFounder(name = 'Founder'): Promise<Client> {
  const c = await signup(name);
  await env.DB.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?, 'founder', 'test', ?)").bind(c.userId, Date.now()).run();
  return c;
}

const ADMIN_GETS = [
  '/api/admin/me',
  '/api/admin/overview',
  '/api/admin/users',
  '/api/admin/sessions',
  '/api/admin/activity',
  '/api/admin/lookups',
  '/api/admin/projects',
  '/api/admin/adoption',
  '/api/admin/health',
  '/api/admin/settings',
  '/api/admin/export/users.csv',
  '/api/admin/export/activity.csv',
  '/api/admin/export/summary.csv',
];

describe('admin authorization', () => {
  it('requires authentication', async () => {
    for (const p of ADMIN_GETS) expect((await raw('GET', p)).status, p).toBe(401);
  });

  it('hides every admin API from normal users (404)', async () => {
    const u = await signup('Normal User');
    for (const p of ADMIN_GETS) expect((await u.req('GET', p)).status, p).toBe(404);
    expect((await u.req('GET', `/api/admin/users/${u.userId}`)).status).toBe(404);
    expect((await u.req('POST', '/api/admin/admins', { email: u.email })).status).toBe(404);
    const me = await u.json('GET', '/api/auth/me');
    expect(me.platformRole).toBeNull();
  });

  it('lets platform admins in and reports the role', async () => {
    const f = await makeFounder();
    for (const p of ADMIN_GETS) expect((await f.req('GET', p)).status, p).toBe(200);
    expect((await f.json('GET', '/api/auth/me')).platformRole).toBe('founder');
  });

  it('does not accept API tokens for admin access', async () => {
    const f = await makeFounder();
    const tok = await f.json('POST', '/api/me/tokens', { name: 'ci' });
    const res = await raw('GET', '/api/admin/overview', { headers: { Authorization: `Bearer ${tok.token}` } });
    expect(res.status).toBe(404);
  });

  it('requires CSRF for admin mutations', async () => {
    const f = await makeFounder();
    const other = await signup('Other');
    const res = await raw('POST', '/api/admin/admins', { cookie: f.cookie, body: { email: other.email } });
    expect(res.status).toBe(403);
  });

  it('only the founder can grant/revoke admins; last founder is protected', async () => {
    const f = await makeFounder();
    const a = await signup('Second Admin');
    expect((await f.req('POST', '/api/admin/admins', { email: a.email })).status).toBe(201);
    expect((await a.req('GET', '/api/admin/overview')).status).toBe(200);
    const b = await signup('Third');
    expect((await a.req('POST', '/api/admin/admins', { email: b.email })).status).toBe(403);
    expect((await a.req('DELETE', `/api/admin/admins/${f.userId}`)).status).toBe(403);
    // Revoking the second admin removes access immediately.
    expect((await f.req('DELETE', `/api/admin/admins/${a.userId}`)).status).toBe(200);
    expect((await a.req('GET', '/api/admin/overview')).status).toBe(404);
    const founders = await env.DB.prepare("SELECT COUNT(*) AS n FROM platform_admins WHERE role = 'founder'").first<{ n: number }>();
    if (founders!.n === 1) expect((await f.req('DELETE', `/api/admin/admins/${f.userId}`)).status).toBe(400);
  });

  it('serves the /admin page only to admins', async () => {
    const u = await signup();
    const nav = (cookie?: string) => raw('GET', '/admin', { cookie, headers: { Accept: 'text/html' } });
    const anon = await nav();
    expect(anon.status).toBe(302);
    expect(anon.headers.get('location')).toContain('/login');
    expect((await nav(u.cookie)).status).toBe(404);
    const f = await makeFounder();
    expect((await nav(f.cookie)).status).toBe(200);
  });
});

describe('account recovery by the founder', () => {
  const NEW = 'a-fresh-start-77!';

  it('only the founder can set someone\'s password; others never see the route', async () => {
    const f = await makeFounder();
    const target = await signup('Locked Out');
    const admin = await signup('Second Admin');
    expect((await f.req('POST', '/api/admin/admins', { email: admin.email })).status).toBe(201);
    expect((await admin.req('POST', `/api/admin/users/${target.userId}/password`, { password: NEW })).status).toBe(403);
    const normal = await signup('Normal');
    expect((await normal.req('POST', `/api/admin/users/${target.userId}/password`, { password: NEW })).status).toBe(404);
    expect((await raw('POST', `/api/admin/users/${target.userId}/password`, { body: { password: NEW } })).status).toBe(401);
  });

  it('applies the password rules and never resets the founder\'s own password here', async () => {
    const f = await makeFounder();
    const target = await signup('Weak');
    expect((await f.req('POST', `/api/admin/users/${target.userId}/password`, { password: 'short' })).status).toBe(400);
    expect((await f.req('POST', `/api/admin/users/${f.userId}/password`, { password: NEW })).status).toBe(400);
    expect((await f.req('POST', '/api/admin/users/no-such-user/password', { password: NEW })).status).toBe(404);
  });

  it('sets the password, ends every session, clears a lockout and records it', async () => {
    const f = await makeFounder();
    const target = await signup('Forgetful');
    await env.DB.prepare('UPDATE users SET failed_logins = 9, locked_until = ? WHERE id = ?').bind(Date.now() + 3_600_000, target.userId).run();
    expect((await target.req('GET', '/api/auth/me')).status).toBe(200);
    expect((await f.req('POST', `/api/admin/users/${target.userId}/password`, { password: NEW })).status).toBe(200);
    expect((await target.req('GET', '/api/auth/me')).status, 'the old session ended').toBe(401);
    const old = await raw('POST', '/api/auth/login', { body: { email: target.email, password: 'correct-horse-42!' } });
    expect(old.status).toBe(401);
    const fresh = await login(target.email, NEW);
    expect((await fresh.req('GET', '/api/auth/me')).status).toBe(200);
    const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'admin.password_reset' AND target_id = ? AND actor_id = ?").bind(target.userId, f.userId).first<{ n: number }>();
    expect(row!.n).toBe(1);
    const hash = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(target.userId).first<{ password_hash: string }>();
    expect(hash!.password_hash).toMatch(/^pbkdf2\$100000\$/);
  });
});

describe('forced new password and security reset', () => {
  const TEMP = 'temporary-pass-77!';
  const MINE = 'my-own-choice-88!';

  it('a temporary password from the founder must be replaced before anything else works', async () => {
    const f = await makeFounder();
    const target = await signup('Exposed');
    expect((await f.req('POST', `/api/admin/users/${target.userId}/password`, { password: TEMP })).status).toBe(200);
    const s = await login(target.email, TEMP);
    const me = await (await s.req('GET', '/api/auth/me')).json<any>();
    expect(me.user.passwordResetRequired).toBe(true);
    const blocked = await s.req('GET', '/api/workspaces');
    expect(blocked.status).toBe(403);
    expect((await blocked.json<any>()).details.code).toBe('PASSWORD_RESET_REQUIRED');
    const live = await s.req('GET', '/api/live/boards/any-board', undefined, { Upgrade: 'websocket' });
    expect(live.status, 'no live board updates either').toBe(403);
    expect((await s.req('POST', '/api/me/password', { currentPassword: TEMP, newPassword: TEMP })).status, 'must really change').toBe(400);
    expect((await s.req('POST', '/api/me/password', { currentPassword: 'wrong-pass-99!', newPassword: MINE })).status).toBe(403);
    expect((await s.req('POST', '/api/me/password', { currentPassword: TEMP, newPassword: MINE })).status).toBe(200);
    expect((await s.req('GET', '/api/workspaces')).status).toBe(200);
    const again = await login(target.email, MINE);
    expect((await (await again.req('GET', '/api/auth/me')).json<any>()).user.passwordResetRequired).toBe(false);
  });

  it('a flagged account can still sign out, and its personal API tokens are refused too', async () => {
    const f = await makeFounder();
    const target = await signup('Token Holder');
    const tok = await (await target.req('POST', '/api/me/tokens', { name: 'script' })).json<any>();
    expect((await f.req('POST', `/api/admin/users/${target.userId}/password`, { password: TEMP })).status).toBe(200);
    const viaToken = await raw('GET', '/api/workspaces', { headers: { Authorization: `Bearer ${tok.token}` } });
    expect(viaToken.status).toBe(403);
    const s = await login(target.email, TEMP);
    expect((await s.req('POST', '/api/auth/logout')).status).toBe(200);
  });

  it('only the founder can end every session; the founder keeps their own', async () => {
    const f = await makeFounder();
    const a = await signup('Member A');
    const b = await signup('Member B');
    const admin = await signup('Other Admin');
    expect((await f.req('POST', '/api/admin/admins', { email: admin.email })).status).toBe(201);
    expect((await admin.req('POST', '/api/admin/security-reset', { requirePasswordReset: true })).status).toBe(403);
    expect((await a.req('POST', '/api/admin/security-reset', {})).status).toBe(404);
    const r = await f.req('POST', '/api/admin/security-reset', { requirePasswordReset: true });
    expect(r.status).toBe(200);
    const out = await r.json<any>();
    expect(out.sessionsEnded).toBeGreaterThanOrEqual(3);
    expect(out.accountsToChoosePassword).toBeGreaterThanOrEqual(3);
    expect((await a.req('GET', '/api/auth/me')).status).toBe(401);
    expect((await b.req('GET', '/api/auth/me')).status).toBe(401);
    expect((await f.req('GET', '/api/auth/me')).status, 'the founder stays signed in').toBe(200);
    const founderMe = await (await f.req('GET', '/api/auth/me')).json<any>();
    expect(founderMe.user.passwordResetRequired).toBe(false);
    const again = await login(a.email);
    expect((await again.req('GET', '/api/workspaces')).status).toBe(403);
    const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'admin.security_reset' AND actor_id = ?").bind(f.userId).first<{ n: number }>();
    expect(row!.n).toBe(1);
  });
});

describe('tracking', () => {
  it('records registration and login', async () => {
    const email = uniqueEmail('track');
    const u = await signup('Tracked', email);
    const row = await env.DB.prepare('SELECT login_count, last_login_at FROM users WHERE id = ?').bind(u.userId).first<any>();
    expect(row.login_count).toBe(1);
    expect(row.last_login_at).toBeGreaterThan(0);
    await login(email);
    const after = await env.DB.prepare('SELECT login_count FROM users WHERE id = ?').bind(u.userId).first<any>();
    expect(after.login_count).toBe(2);
    const events = await env.DB.prepare('SELECT event_type FROM user_activity_events WHERE user_id = ? ORDER BY created_at').bind(u.userId).all<{ event_type: string }>();
    const types = events.results.map((e) => e.event_type);
    expect(types).toContain('user.registered');
    expect(types.filter((t) => t === 'user.login')).toHaveLength(2);
    expect(types).toContain('workspace.created');
  });

  it('tracks project, task and completion events without content', async () => {
    const u = await signup();
    const bundle = await createBoard(u, 'Secret project name');
    const status = bundle.columns.find((c: any) => c.type === 'status');
    const item = await u.json('POST', `/api/boards/${bundle.board.id}/items`, { name: 'Private task title', groupId: bundle.groups[0].id });
    await u.json('PATCH', `/api/items/${item.id}`, { values: { [status.id]: 'done' } });
    const rows = await env.DB.prepare('SELECT event_type, metadata_json FROM user_activity_events WHERE user_id = ?').bind(u.userId).all<any>();
    const types = rows.results.map((r) => r.event_type);
    expect(types).toEqual(expect.arrayContaining(['project.created', 'task.created', 'task.updated', 'task.completed']));
    expect(JSON.stringify(rows.results)).not.toContain('Private task title');
  });

  it('heartbeat marks a session active; it expires after five minutes', async () => {
    const f = await makeFounder();
    const u = await signup('Heartbeat User');
    expect((await u.req('POST', '/api/heartbeat', {})).status).toBe(200);
    let live = await f.json('GET', '/api/admin/sessions?status=active');
    expect(live.sessions.some((s: any) => s.userId === u.userId && s.status === 'active')).toBe(true);
    // Simulate 6 minutes without heartbeats.
    await env.DB.prepare('UPDATE sessions SET last_activity_at = ? WHERE user_id = ?').bind(Date.now() - 6 * 60_000, u.userId).run();
    live = await f.json('GET', '/api/admin/sessions?status=active');
    expect(live.sessions.some((s: any) => s.userId === u.userId)).toBe(false);
    const loggedIn = await f.json('GET', '/api/admin/sessions?status=logged_in');
    const mine = loggedIn.sessions.find((s: any) => s.userId === u.userId);
    expect(mine.status).toBe('idle');
    expect(mine).not.toHaveProperty('ip');
    expect(JSON.stringify(loggedIn)).not.toMatch(/token_hash|csrf|pbkdf2|password_hash/i);
  });

  it('logout ends the session but keeps it as history through maintenance', async () => {
    const email = uniqueEmail('hist');
    const u = await signup('History', email);
    await u.json('POST', '/api/auth/logout', {});
    await runMaintenance(env, Date.now());
    const s = await env.DB.prepare('SELECT ended_at, end_reason, token_hash FROM sessions WHERE user_id = ?').bind(u.userId).first<any>();
    expect(s.ended_at).toBeGreaterThan(0);
    expect(s.end_reason).toBe('logout');
    expect(s.token_hash.startsWith('ended:')).toBe(true);
    const ev = await env.DB.prepare("SELECT COUNT(*) AS n FROM user_activity_events WHERE user_id = ? AND event_type = 'user.logout'").bind(u.userId).first<{ n: number }>();
    expect(ev!.n).toBe(1);
  });

  it('expired sessions are ended (not deleted) by maintenance', async () => {
    const u = await signup();
    await env.DB.prepare('UPDATE sessions SET expires_at = ? WHERE user_id = ?').bind(Date.now() - 1000, u.userId).run();
    await runMaintenance(env, Date.now());
    const s = await env.DB.prepare('SELECT ended_at, end_reason FROM sessions WHERE user_id = ?').bind(u.userId).first<any>();
    expect(s.end_reason).toBe('expired');
  });

  it('counts anonymous page views without identifying visitors', async () => {
    const before = await env.DB.prepare("SELECT COALESCE(SUM(value), 0) AS n FROM analytics_daily WHERE metric = 'pageview_anonymous'").first<{ n: number }>();
    await raw('GET', '/login', { headers: { Accept: 'text/html' } });
    const after = await env.DB.prepare("SELECT COALESCE(SUM(value), 0) AS n FROM analytics_daily WHERE metric = 'pageview_anonymous'").first<{ n: number }>();
    expect(after!.n).toBe(before!.n + 1);
  });
});

describe('dashboard accuracy', () => {
  it('overview matches the database', async () => {
    const f = await makeFounder();
    const u = await signup('Builder');
    await createBoard(u, 'P1');
    const o = await f.json('GET', '/api/admin/overview?range=7d');
    const db = await env.DB.prepare(
      `SELECT (SELECT COUNT(*) FROM users) AS users, (SELECT COUNT(*) FROM boards WHERE kind != 'template') AS projects,
              (SELECT COUNT(*) FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template') AS tasks,
              (SELECT COUNT(*) FROM workspaces WHERE deleted_at IS NULL) AS workspaces`,
    ).first<any>();
    expect(o.users.total).toBe(db.users);
    expect(o.content.projects).toBe(db.projects);
    expect(o.content.tasks).toBe(db.tasks);
    expect(o.content.workspaces).toBe(db.workspaces);
    expect(o.users.newToday).toBe(db.users); // every test user registered today
    expect(o.series.registrations).toHaveLength(7);
    expect(o.series.registrations.reduce((s: number, p: any) => s + p.value, 0)).toBe(db.users);
    expect(o.active.today).toBeGreaterThanOrEqual(2);
  });

  it('users list and detail show real per-user counts without secrets', async () => {
    const f = await makeFounder();
    const u = await signup('Counted User');
    const b = await createBoard(u, 'Counted board');
    await u.json('POST', `/api/boards/${b.board.id}/items`, { name: 'one', groupId: b.groups[0].id });
    const list = await f.json('GET', `/api/admin/users?q=${encodeURIComponent(u.email)}`);
    expect(list.total).toBe(1);
    const row = list.users[0];
    expect(row.projects).toBe(1);
    expect(row.workspaces).toBe(1);
    const dbTasks = await env.DB.prepare('SELECT COUNT(*) AS n FROM items WHERE created_by = ?').bind(u.userId).first<{ n: number }>();
    expect(row.tasks).toBe(dbTasks!.n);
    const detail = await f.json('GET', `/api/admin/users/${u.userId}`);
    expect(detail.projects[0].name).toBe('Counted board');
    expect(detail.sessions.length).toBeGreaterThanOrEqual(1);
    const text = JSON.stringify(detail);
    expect(text).not.toMatch(/password_hash|token_hash|csrf_token|pbkdf2/);
    // Viewing a user's details is audited.
    const aud = await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'admin.user_viewed' AND target_id = ?").bind(u.userId).first<{ n: number }>();
    expect(aud!.n).toBe(1);
  });

  it('adoption funnel reflects real progress', async () => {
    const f = await makeFounder();
    const a = await f.json('GET', '/api/admin/adoption?range=all');
    const registered = a.stages.find((s: any) => s.key === 'registered').count;
    const projectStage = a.stages.find((s: any) => s.key === 'project').count;
    const dbProjUsers = await env.DB.prepare("SELECT COUNT(DISTINCT created_by) AS n FROM boards WHERE kind != 'template'").first<{ n: number }>();
    const dbUsers = await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first<{ n: number }>();
    expect(registered).toBe(dbUsers!.n);
    expect(projectStage).toBe(dbProjUsers!.n);
  });

  it('activity feed filters by type and user', async () => {
    const f = await makeFounder();
    const u = await signup('Feed user');
    const r = await f.json('GET', `/api/admin/activity?userId=${u.userId}&type=user.registered`);
    expect(r.events).toHaveLength(1);
    expect(r.events[0].userEmail).toBe(u.email);
    expect((await f.req('GET', '/api/admin/activity?type=drop table')).status).toBe(400);
  });
});

describe('exports and health', () => {
  it('CSV exports are admin-only, safe and contain no credentials', async () => {
    const f = await makeFounder();
    await signup('=HYPERLINK("http://evil")');
    const res = await f.req('GET', '/api/admin/export/users.csv');
    expect(res.headers.get('Content-Type')).toContain('text/csv');
    const text = await res.text();
    expect(text.split('\r\n')[0]).toContain('email');
    expect(text).toContain(`'=HYPERLINK`);
    expect(text).not.toMatch(/pbkdf2|token_hash/);
    const s = await f.req('GET', '/api/admin/export/summary.csv?range=7d');
    expect((await s.text()).split('\r\n')[0]).toBe('date_utc,registrations,daily_active_users,projects_created,tasks_created,tasks_completed,anonymous_page_views');
  });

  it('health reports checks without leaking internals', async () => {
    const f = await makeFounder();
    const h = await f.json('GET', '/api/admin/health');
    expect(h.checks.database.ok).toBe(true);
    expect(h.checks.fileStorage.ok).toBe(true);
    expect(JSON.stringify(h)).not.toMatch(/stack|CLOUDFLARE_API_TOKEN|GOOGLE_CLIENT_SECRET/);
  });
});
