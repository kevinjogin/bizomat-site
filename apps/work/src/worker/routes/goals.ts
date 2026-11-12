import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { badRequest, body, forbidden, newId, notFound, now, parseJson } from '../lib/util';
import { accessibleBoardIds, requireWorkspace, wsAtLeast } from '../services/permissions';
import { boardsCompletion, loadBoardData } from '../services/stats';

export const goalRoutes = new Hono<AppEnv>();

interface GoalRow {
  id: string;
  workspace_id: string;
  parent_goal_id: string | null;
  title: string;
  description: string;
  owner_id: string | null;
  status: string;
  progress_mode: 'manual' | 'boards';
  start_value: number;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string | null;
  due_date: string | null;
  board_ids_json: string;
  created_by: string;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
}

const goalSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional(),
  ownerId: z.string().nullable().optional(),
  parentGoalId: z.string().nullable().optional(),
  status: z.enum(['on_track', 'at_risk', 'off_track', 'achieved', 'cancelled']).optional(),
  progressMode: z.enum(['manual', 'boards']).optional(),
  startValue: z.number().optional(),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
  unit: z.string().max(20).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  boardIds: z.array(z.string()).max(20).optional(),
});

async function progressFor(db: D1Database, g: GoalRow, accessible: Set<string>) {
  if (g.progress_mode === 'boards') {
    const ids = parseJson<string[]>(g.board_ids_json, []).filter((b) => accessible.has(b));
    const c = boardsCompletion(await loadBoardData(db, ids));
    return { percent: c.percent, done: c.done, total: c.total };
  }
  const span = g.target_value - g.start_value;
  const percent = span === 0 ? (g.current_value >= g.target_value ? 100 : 0) : Math.max(0, Math.min(100, Math.round(((g.current_value - g.start_value) / span) * 100)));
  return { percent };
}

function dto(g: GoalRow, progress: { percent: number; done?: number; total?: number }) {
  return {
    id: g.id,
    workspaceId: g.workspace_id,
    parentGoalId: g.parent_goal_id,
    title: g.title,
    description: g.description,
    ownerId: g.owner_id,
    status: g.status,
    progressMode: g.progress_mode,
    startValue: g.start_value,
    targetValue: g.target_value,
    currentValue: g.current_value,
    unit: g.unit,
    startDate: g.start_date,
    dueDate: g.due_date,
    boardIds: parseJson<string[]>(g.board_ids_json, []),
    progress,
    createdAt: g.created_at,
    updatedAt: g.updated_at,
    archivedAt: g.archived_at,
  };
}

goalRoutes.get('/workspaces/:ws/goals', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'viewer');
  const rows = await c.env.DB.prepare(`SELECT * FROM goals WHERE workspace_id = ? AND ${c.req.query('archived') === '1' ? 'archived_at IS NOT NULL' : 'archived_at IS NULL'} ORDER BY created_at`).bind(wsId).all<GoalRow>();
  const accessible = new Set(await accessibleBoardIds(c.env.DB, wsId, user.id));
  const out = [];
  for (const g of rows.results) out.push(dto(g, await progressFor(c.env.DB, g, accessible)));
  return c.json(out);
});

async function validate(db: D1Database, wsId: string, userId: string, input: z.infer<typeof goalSchema> | Partial<z.infer<typeof goalSchema>>, selfId?: string) {
  if (input.ownerId) {
    const m = await db.prepare('SELECT 1 FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, input.ownerId).first();
    if (!m) throw badRequest('Owner must be a workspace member');
  }
  if (input.parentGoalId) {
    if (input.parentGoalId === selfId) throw badRequest('A goal cannot be its own parent');
    const p = await db.prepare('SELECT 1 FROM goals WHERE id = ? AND workspace_id = ?').bind(input.parentGoalId, wsId).first();
    if (!p) throw badRequest('Parent goal not found');
  }
  if (input.boardIds) {
    const allowed = new Set(await accessibleBoardIds(db, wsId, userId));
    input.boardIds = input.boardIds.filter((b) => allowed.has(b));
  }
}

goalRoutes.post('/workspaces/:ws/goals', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'member');
  const input = await body(c, goalSchema);
  await validate(c.env.DB, wsId, user.id, input);
  const id = newId();
  const t = now();
  await c.env.DB.prepare(
    `INSERT INTO goals (id, workspace_id, parent_goal_id, title, description, owner_id, status, progress_mode, start_value, target_value, current_value, unit, start_date, due_date, board_ids_json, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, wsId, input.parentGoalId ?? null, input.title, input.description ?? '', input.ownerId ?? user.id, input.status ?? 'on_track', input.progressMode ?? 'manual', input.startValue ?? 0, input.targetValue ?? 100, input.currentValue ?? 0, input.unit ?? '%', input.startDate ?? null, input.dueDate ?? null, JSON.stringify(input.boardIds ?? []), user.id, t, t)
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM goals WHERE id = ?').bind(id).first<GoalRow>();
  return c.json(dto(row!, await progressFor(c.env.DB, row!, new Set(await accessibleBoardIds(c.env.DB, wsId, user.id)))), 201);
});

goalRoutes.patch('/goals/:id', async (c) => {
  const user = c.get('user');
  const g = await c.env.DB.prepare('SELECT * FROM goals WHERE id = ?').bind(c.req.param('id')).first<GoalRow>();
  if (!g) throw notFound('Goal');
  const role = await requireWorkspace(c.env.DB, g.workspace_id, user.id, 'member');
  if (g.owner_id !== user.id && g.created_by !== user.id && !wsAtLeast(role, 'admin') && role !== 'member') throw forbidden();
  const input = await body(c, goalSchema.partial().extend({ archived: z.boolean().optional() }));
  await validate(c.env.DB, g.workspace_id, user.id, input, g.id);
  await c.env.DB.prepare(
    `UPDATE goals SET parent_goal_id = ?, title = ?, description = ?, owner_id = ?, status = ?, progress_mode = ?, start_value = ?, target_value = ?, current_value = ?, unit = ?, start_date = ?, due_date = ?, board_ids_json = ?, archived_at = ?, updated_at = ? WHERE id = ?`,
  )
    .bind(
      input.parentGoalId !== undefined ? input.parentGoalId : g.parent_goal_id,
      input.title ?? g.title,
      input.description ?? g.description,
      input.ownerId !== undefined ? input.ownerId : g.owner_id,
      input.status ?? g.status,
      input.progressMode ?? g.progress_mode,
      input.startValue ?? g.start_value,
      input.targetValue ?? g.target_value,
      input.currentValue ?? g.current_value,
      input.unit ?? g.unit,
      input.startDate !== undefined ? input.startDate : g.start_date,
      input.dueDate !== undefined ? input.dueDate : g.due_date,
      input.boardIds ? JSON.stringify(input.boardIds) : g.board_ids_json,
      input.archived === undefined ? g.archived_at : input.archived ? now() : null,
      now(),
      g.id,
    )
    .run();
  return c.json({ ok: true });
});

goalRoutes.delete('/goals/:id', async (c) => {
  const user = c.get('user');
  const g = await c.env.DB.prepare('SELECT * FROM goals WHERE id = ?').bind(c.req.param('id')).first<GoalRow>();
  if (!g) throw notFound('Goal');
  const role = await requireWorkspace(c.env.DB, g.workspace_id, user.id, 'member');
  if (g.created_by !== user.id && !wsAtLeast(role, 'admin')) throw forbidden('Only the creator or an admin can delete a goal');
  await c.env.DB.batch([c.env.DB.prepare('UPDATE goals SET parent_goal_id = NULL WHERE parent_goal_id = ?').bind(g.id), c.env.DB.prepare('DELETE FROM goals WHERE id = ?').bind(g.id)]);
  return c.json({ ok: true });
});
