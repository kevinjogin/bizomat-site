import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, newId, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { audit, auditEventStmt, auditStmt } from '../services/audit';
import { isHexColor, sameColor, workspaceNameKey } from '../../shared/workspace-colors';
import { workspaceMembers } from '../services/mappers';
import { requireWorkspace } from '../services/permissions';
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

/**
 * Rename, recolour or change the settings of a workspace (owners and admins). Renaming keeps the workspace's id, so
 * every link and every board, item and member stays where it is. A new name must be 1 to 100 characters once trimmed
 * and must differ (ignoring letter case) from every other workspace the person belongs to.
 */
workspaceRoutes.patch('/workspaces/:ws', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const input = await body(
    c,
    z.object({
      name: z.string().max(1000).optional(),
      description: z.string().max(1000).optional(),
      color: z.string().max(100).optional(),
      settings: z.object({ defaultMemberRole: z.enum(['member', 'viewer']).optional(), allowMembersToInvite: z.boolean().optional() }).optional(),
    }),
  );
  const name = input.name?.trim();
  if (name !== undefined) {
    if (!name) throw badRequest('Enter a workspace name.', [{ path: 'name', message: 'Enter a workspace name.' }]);
    if (name.length > 100) throw badRequest('A workspace name can be up to 100 characters long.', [{ path: 'name', message: 'Up to 100 characters.' }]);
  }
  if (input.color !== undefined && !isHexColor(input.color)) {
    throw badRequest('Choose a colour from the palette or enter a hex colour such as #0f766e.', [{ path: 'color', message: 'Use #rrggbb.' }]);
  }
  const cur = await c.env.DB.prepare('SELECT * FROM workspaces WHERE id = ?').bind(wsId).first<{ name: string; description: string; color: string; settings_json: string }>();
  if (!cur) throw notFound('Workspace');
  const renamed = name !== undefined && name !== cur.name;
  if (renamed) {
    const key = workspaceNameKey(name);
    const clash = (await listWorkspaces(c.env.DB, user.id)).find((w) => w.id !== wsId && workspaceNameKey(w.name) === key);
    if (clash) throw new HttpError(409, `You already belong to a workspace called "${clash.name}". Choose a different name.`, { code: 'WORKSPACE_NAME_TAKEN' });
  }
  const recoloured = input.color !== undefined && !sameColor(input.color, cur.color);
  const settings = { ...parseJson<Record<string, unknown>>(cur.settings_json, {}), ...(input.settings ?? {}) };
  const ip = clientIp(c);
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE workspaces SET name = ?, description = ?, color = ?, settings_json = ?, updated_at = ? WHERE id = ?').bind(
      name ?? cur.name,
      input.description ?? cur.description,
      input.color ?? cur.color,
      JSON.stringify(settings),
      now(),
      wsId,
    ),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'workspace.updated', metadata: { ...input, ...(name !== undefined ? { name } : {}) }, ip }),
    ...(renamed
      ? [
          auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'workspace.renamed', targetType: 'workspace', targetId: wsId, metadata: { from: cur.name, to: name }, ip }),
          auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: 'workspace.renamed', before: cur.name, after: name }),
        ]
      : []),
    ...(recoloured
      ? [
          auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'workspace.color_changed', targetType: 'workspace', targetId: wsId, metadata: { from: cur.color, to: input.color }, ip }),
          auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: 'workspace.color_changed', before: cur.color, after: input.color }),
        ]
      : []),
  ]);
  const workspace = (await listWorkspaces(c.env.DB, user.id)).find((w) => w.id === wsId) ?? null;
  return c.json({ ok: true, workspace });
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

// -------------------------------------------------------------------- teams

workspaceRoutes.get('/workspaces/:ws/teams', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'viewer');
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
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="bizomat-workspace-export-${wsId}.json"` },
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
    .all<Record<string, any>>();
  // Amounts in financial columns are not shown where the person may not see financial data.
  const { financeHiddenBoards } = await import('../services/access');
  const hiddenBoards = await financeHiddenBoards(c.env.DB, wsId, user.id, Array.from(new Set(rows.results.map((r) => r.board_id).filter(Boolean))));
  if (!hiddenBoards.size) return c.json(rows.results);
  const cols = await c.env.DB.prepare(`SELECT id, type, settings_json FROM columns WHERE workspace_id = ? AND type IN ('currency','number')`).bind(wsId).all<{ id: string; type: string; settings_json: string }>();
  const { isFinancialColumn } = await import('../../shared/permissions');
  const fin = new Set(cols.results.filter((col) => isFinancialColumn({ type: col.type, settings: parseJson(col.settings_json, {}) })).map((col) => col.id));
  return c.json(rows.results.map((r) => (hiddenBoards.has(r.board_id) && fin.has(r.column_id) ? { ...r, old_value: null, new_value: null, restricted: true } : r)));
});
