import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, parseJson, randomToken, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { audit, auditStmt } from '../services/audit';
import { eventStmt } from '../services/analytics';
import { svcFromContext } from '../services/context';
import { workspaceMembers } from '../services/mappers';
import { notify } from '../services/notify';
import { requireWorkspace, wsAtLeast } from '../services/permissions';
import { createWorkspaceStmts, listWorkspaces } from './helpers';

export const workspaceRoutes = new Hono<AppEnv>();

const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

workspaceRoutes.get('/workspaces', async (c) => c.json(await listWorkspaces(c.env.DB, c.get('user').id)));

workspaceRoutes.post('/workspaces', async (c) => {
  const user = c.get('user');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(100), description: z.string().max(1000).optional(), color: colorSchema.optional() }));
  const count = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM workspace_members WHERE user_id = ? AND role = 'owner'").bind(user.id).first<{ n: number }>();
  if ((count?.n ?? 0) >= 50) throw new HttpError(400, 'Workspace limit reached');
  const { id, stmts } = createWorkspaceStmts(c.env.DB, { ...input, ownerId: user.id });
  await c.env.DB.batch([...stmts, auditStmt(c.env.DB, { workspaceId: id, actorId: user.id, action: 'workspace.created', targetType: 'workspace', targetId: id, ip: clientIp(c) })]);
  const ws = (await listWorkspaces(c.env.DB, user.id)).find((w) => w.id === id);
  return c.json(ws, 201);
});

workspaceRoutes.get('/workspaces/:ws', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const ws = (await listWorkspaces(c.env.DB, user.id)).find((w) => w.id === wsId);
  if (!ws) throw notFound('Workspace');
  const row = await c.env.DB.prepare('SELECT settings_json FROM workspaces WHERE id = ?').bind(wsId).first<{ settings_json: string }>();
  return c.json({ ...ws, settings: parseJson(row?.settings_json, {}) });
});

workspaceRoutes.patch('/workspaces/:ws', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const input = await body(
    c,
    z.object({
      name: z.string().trim().min(1).max(100).optional(),
      description: z.string().max(1000).optional(),
      color: colorSchema.optional(),
      settings: z.object({ defaultMemberRole: z.enum(['member', 'viewer']).optional(), allowMembersToInvite: z.boolean().optional() }).optional(),
    }),
  );
  const cur = await c.env.DB.prepare('SELECT * FROM workspaces WHERE id = ?').bind(wsId).first<{ name: string; description: string; color: string; settings_json: string }>();
  const settings = { ...parseJson<Record<string, unknown>>(cur!.settings_json, {}), ...(input.settings ?? {}) };
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE workspaces SET name = ?, description = ?, color = ?, settings_json = ?, updated_at = ? WHERE id = ?').bind(
      input.name ?? cur!.name,
      input.description ?? cur!.description,
      input.color ?? cur!.color,
      JSON.stringify(settings),
      now(),
      wsId,
    ),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'workspace.updated', metadata: input, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

workspaceRoutes.delete('/workspaces/:ws', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'owner');
  const input = await body(c, z.object({ confirmName: z.string() }));
  const ws = await c.env.DB.prepare('SELECT name FROM workspaces WHERE id = ?').bind(wsId).first<{ name: string }>();
  if (ws?.name !== input.confirmName) throw new HttpError(400, 'Type the workspace name to confirm deletion');
  // Soft delete: data stays recoverable from backups / by an operator.
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE workspaces SET deleted_at = ? WHERE id = ?').bind(now(), wsId),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'workspace.deleted', ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ members

workspaceRoutes.get('/workspaces/:ws/members', async (c) => {
  await requireWorkspace(c.env.DB, c.req.param('ws'), c.get('user').id);
  return c.json(await workspaceMembers(c.env.DB, c.req.param('ws')));
});

workspaceRoutes.patch('/workspaces/:ws/members/:userId', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const targetId = c.req.param('userId');
  const myRole = await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const { role } = await body(c, z.object({ role: z.enum(['owner', 'admin', 'member', 'viewer']) }));
  const target = await c.env.DB.prepare('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId).first<{ role: string }>();
  if (!target) throw notFound('Member');
  if ((role === 'owner' || target.role === 'owner') && myRole !== 'owner') throw new HttpError(403, 'Only owners can grant or remove the owner role');
  if (target.role === 'owner' && role !== 'owner') {
    const owners = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM workspace_members WHERE workspace_id = ? AND role = 'owner'").bind(wsId).first<{ n: number }>();
    if ((owners?.n ?? 0) <= 1) throw new HttpError(400, 'A workspace must keep at least one owner');
  }
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE workspace_members SET role = ? WHERE workspace_id = ? AND user_id = ?').bind(role, wsId, targetId),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'member.role_changed', targetType: 'user', targetId, metadata: { from: target.role, to: role }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

workspaceRoutes.delete('/workspaces/:ws/members/:userId', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const targetId = c.req.param('userId');
  const myRole = await requireWorkspace(c.env.DB, wsId, user.id);
  const self = targetId === user.id;
  if (!self && !wsAtLeast(myRole, 'admin')) throw new HttpError(403, 'Only admins can remove members');
  const target = await c.env.DB.prepare('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId).first<{ role: string }>();
  if (!target) throw notFound('Member');
  if (target.role === 'owner') {
    if (!self && myRole !== 'owner') throw new HttpError(403, 'Only owners can remove owners');
    const owners = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM workspace_members WHERE workspace_id = ? AND role = 'owner'").bind(wsId).first<{ n: number }>();
    if ((owners?.n ?? 0) <= 1) throw new HttpError(400, 'Transfer ownership before the last owner leaves');
  }
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM board_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM team_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM document_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: self ? 'member.left' : 'member.removed', targetType: 'user', targetId, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

// -------------------------------------------------------------- invitations

workspaceRoutes.get('/workspaces/:ws/invitations', async (c) => {
  await requireWorkspace(c.env.DB, c.req.param('ws'), c.get('user').id, 'admin');
  const rows = await c.env.DB.prepare(
    `SELECT i.id, i.email, i.role, i.created_at, i.expires_at, i.accepted_at, i.revoked_at, u.name AS invited_by_name
     FROM invitations i JOIN users u ON u.id = i.invited_by WHERE i.workspace_id = ? ORDER BY i.created_at DESC LIMIT 200`,
  )
    .bind(c.req.param('ws'))
    .all();
  return c.json(rows.results);
});

workspaceRoutes.post('/workspaces/:ws/invitations', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const role = await requireWorkspace(c.env.DB, wsId, user.id, 'member');
  const ws = await c.env.DB.prepare('SELECT name, settings_json FROM workspaces WHERE id = ?').bind(wsId).first<{ name: string; settings_json: string }>();
  const settings = parseJson<{ allowMembersToInvite?: boolean }>(ws?.settings_json, {});
  if (!wsAtLeast(role, 'admin') && !settings.allowMembersToInvite) throw new HttpError(403, 'Only admins can invite members');
  await rateLimit(c.env.DB, `invite:user:${user.id}`, 50, 60 * 60_000);
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email().max(320), role: z.enum(['admin', 'member', 'viewer']).default('member') }));
  if (input.role === 'admin' && !wsAtLeast(role, 'admin')) throw new HttpError(403, 'Only admins can invite admins');
  const existingMember = await c.env.DB.prepare('SELECT u.id FROM users u JOIN workspace_members m ON m.user_id = u.id WHERE m.workspace_id = ? AND u.email = ?').bind(wsId, input.email).first();
  if (existingMember) throw new HttpError(409, 'That person is already a member');
  const token = randomToken(32);
  const id = newId();
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE invitations SET revoked_at = ? WHERE workspace_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL").bind(t, wsId, input.email),
    c.env.DB.prepare('INSERT INTO invitations (id, workspace_id, email, role, token_hash, invited_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(
      id,
      wsId,
      input.email,
      input.role,
      await sha256Hex(token),
      user.id,
      t,
      t + 7 * 86_400_000,
    ),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'invitation.created', targetType: 'invitation', targetId: id, metadata: { email: input.email, role: input.role }, ip: clientIp(c) }),
    eventStmt(c.env.DB, { type: 'member.invited', userId: user.id, workspaceId: wsId, entityType: 'invitation', entityId: id, metadata: { role: input.role }, at: t }),
  ]);
  // Existing users get an in-app notification in their other workspaces' inbox.
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(input.email).first<{ id: string }>();
  if (existingUser) {
    const other = await c.env.DB.prepare('SELECT workspace_id FROM workspace_members WHERE user_id = ? LIMIT 1').bind(existingUser.id).first<{ workspace_id: string }>();
    if (other) {
      await notify(svcFromContext(c), {
        workspaceId: other.workspace_id,
        userIds: [existingUser.id],
        type: 'invitation',
        title: `${user.name} invited you to ${ws?.name}`,
        body: `Role: ${input.role}`,
        link: `/invite/${token}`,
        entityType: 'workspace',
        entityId: wsId,
      });
    }
  }
  // No email provider is configured, so the link is returned for the inviter to share.
  const origin = new URL(c.req.url).origin;
  return c.json({ id, email: input.email, role: input.role, inviteUrl: `${origin}/invite/${token}`, emailDelivery: 'not_configured' }, 201);
});

workspaceRoutes.delete('/workspaces/:ws/invitations/:id', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const r = await c.env.DB.prepare('UPDATE invitations SET revoked_at = ? WHERE id = ? AND workspace_id = ? AND accepted_at IS NULL').bind(now(), c.req.param('id'), wsId).run();
  if (!r.meta.changes) throw notFound('Invitation');
  await audit(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'invitation.revoked', targetId: c.req.param('id') });
  return c.json({ ok: true });
});

// -------------------------------------------------------------------- teams

workspaceRoutes.get('/workspaces/:ws/teams', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id);
  const teams = await c.env.DB.prepare('SELECT * FROM teams WHERE workspace_id = ? ORDER BY name').bind(wsId).all<{ id: string; name: string; description: string; color: string }>();
  const members = await c.env.DB.prepare('SELECT team_id, user_id FROM team_members WHERE workspace_id = ?').bind(wsId).all<{ team_id: string; user_id: string }>();
  return c.json(teams.results.map((t) => ({ ...t, memberIds: members.results.filter((m) => m.team_id === t.id).map((m) => m.user_id) })));
});

const teamSchema = z.object({ name: z.string().trim().min(1).max(100), description: z.string().max(500).optional(), color: colorSchema.optional(), memberIds: z.array(z.string()).max(500).optional() });

async function setTeamMembers(db: D1Database, wsId: string, teamId: string, memberIds: string[]) {
  const valid = await db.prepare('SELECT user_id FROM workspace_members WHERE workspace_id = ?').bind(wsId).all<{ user_id: string }>();
  const ok = new Set(valid.results.map((v) => v.user_id));
  const ids = memberIds.filter((m) => ok.has(m));
  await db.batch([
    db.prepare('DELETE FROM team_members WHERE team_id = ?').bind(teamId),
    ...ids.map((uid) => db.prepare('INSERT INTO team_members (team_id, workspace_id, user_id) VALUES (?, ?, ?)').bind(teamId, wsId, uid)),
  ]);
}

workspaceRoutes.post('/workspaces/:ws/teams', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const input = await body(c, teamSchema);
  const id = newId();
  await c.env.DB.prepare('INSERT INTO teams (id, workspace_id, name, description, color, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, wsId, input.name, input.description ?? '', input.color ?? '#0ea5e9', now()).run();
  if (input.memberIds) await setTeamMembers(c.env.DB, wsId, id, input.memberIds);
  return c.json({ id }, 201);
});

workspaceRoutes.patch('/workspaces/:ws/teams/:id', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const input = await body(c, teamSchema.partial());
  const team = await c.env.DB.prepare('SELECT * FROM teams WHERE id = ? AND workspace_id = ?').bind(c.req.param('id'), wsId).first<{ id: string; name: string; description: string; color: string }>();
  if (!team) throw notFound('Team');
  await c.env.DB.prepare('UPDATE teams SET name = ?, description = ?, color = ? WHERE id = ?').bind(input.name ?? team.name, input.description ?? team.description, input.color ?? team.color, team.id).run();
  if (input.memberIds) await setTeamMembers(c.env.DB, wsId, team.id, input.memberIds);
  return c.json({ ok: true });
});

workspaceRoutes.delete('/workspaces/:ws/teams/:id', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const r = await c.env.DB.prepare('DELETE FROM teams WHERE id = ? AND workspace_id = ?').bind(c.req.param('id'), wsId).run();
  if (!r.meta.changes) throw notFound('Team');
  return c.json({ ok: true });
});

// ------------------------------------------------------------ administration

workspaceRoutes.get('/workspaces/:ws/audit', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const before = Number(c.req.query('before') ?? Date.now() + 1);
  const rows = await c.env.DB.prepare(
    `SELECT a.*, u.name AS actor_name, u.email AS actor_email FROM audit_log a LEFT JOIN users u ON u.id = a.actor_id
     WHERE a.workspace_id = ? AND a.created_at < ? ORDER BY a.created_at DESC LIMIT 100`,
  )
    .bind(wsId, before)
    .all<{ metadata_json: string }>();
  return c.json(rows.results.map((r) => ({ ...r, metadata: parseJson(r.metadata_json, {}) })));
});

workspaceRoutes.get('/workspaces/:ws/admin/overview', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const q = (sql: string) => c.env.DB.prepare(sql).bind(wsId).first<{ n: number }>();
  const [members, boards, items, docs, automations, storage, invites] = await Promise.all([
    q('SELECT COUNT(*) AS n FROM workspace_members WHERE workspace_id = ?'),
    q('SELECT COUNT(*) AS n FROM boards WHERE workspace_id = ? AND archived_at IS NULL'),
    q('SELECT COUNT(*) AS n FROM items WHERE workspace_id = ? AND archived_at IS NULL'),
    q('SELECT COUNT(*) AS n FROM documents WHERE workspace_id = ? AND archived_at IS NULL'),
    q('SELECT COUNT(*) AS n FROM automations WHERE workspace_id = ? AND enabled = 1'),
    q('SELECT COALESCE(SUM(size), 0) AS n FROM attachments WHERE workspace_id = ? AND deleted_at IS NULL'),
    q('SELECT COUNT(*) AS n FROM invitations WHERE workspace_id = ? AND accepted_at IS NULL AND revoked_at IS NULL'),
  ]);
  return c.json({
    members: members?.n ?? 0,
    boards: boards?.n ?? 0,
    items: items?.n ?? 0,
    documents: docs?.n ?? 0,
    automations: automations?.n ?? 0,
    storageBytes: storage?.n ?? 0,
    pendingInvitations: invites?.n ?? 0,
  });
});

/** Full JSON export of workspace data (admins). Files are listed with metadata; binaries stay in R2. */
workspaceRoutes.get('/workspaces/:ws/export', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  await rateLimit(c.env.DB, `export:${wsId}`, 10, 60 * 60_000);
  const tables = ['boards', 'groups', 'columns', 'items', 'views', 'updates', 'attachments', 'dashboards', 'dashboard_widgets', 'documents', 'goals', 'automations', 'teams', 'time_entries'];
  const out: Record<string, unknown> = { exportedAt: new Date().toISOString(), workspaceId: wsId, format: 'workos-export-v1' };
  const ws = await c.env.DB.prepare('SELECT id, name, description, color, settings_json, created_at FROM workspaces WHERE id = ?').bind(wsId).first();
  out.workspace = ws;
  out.members = await workspaceMembers(c.env.DB, wsId);
  for (const t of tables) {
    const rows = await c.env.DB.prepare(`SELECT * FROM ${t} WHERE workspace_id = ?`).bind(wsId).all();
    out[t] = rows.results;
  }
  await audit(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'workspace.exported', ip: clientIp(c) });
  return new Response(JSON.stringify(out), {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="workos-export-${wsId}.json"` },
  });
});

workspaceRoutes.get('/workspaces/:ws/activity', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id);
  const { accessibleBoardIds } = await import('../services/permissions');
  const boards = await accessibleBoardIds(c.env.DB, wsId, user.id);
  if (!boards.length) return c.json([]);
  const rows = await c.env.DB.prepare(
    `SELECT a.*, u.name AS actor_name, i.name AS item_name, b.name AS board_name FROM activity_log a
     LEFT JOIN users u ON u.id = a.actor_id LEFT JOIN items i ON i.id = a.item_id LEFT JOIN boards b ON b.id = a.board_id
     WHERE a.workspace_id = ? AND a.board_id IN (${boards.map(() => '?').join(',')}) ORDER BY a.created_at DESC LIMIT 50`,
  )
    .bind(wsId, ...boards)
    .all();
  return c.json(rows.results);
});
