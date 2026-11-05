import { Hono } from 'hono';
import { z } from 'zod';
import { sanitizeFilter } from '../../shared/filters';
import type { AppEnv } from '../env';
import { badRequest, body, forbidden, newId, notFound, now, parseJson } from '../lib/util';
import { workspaceMembers } from '../services/mappers';
import { accessibleBoardIds, requireWorkspace, wsAtLeast } from '../services/permissions';
import { computeWidget, loadBoardData, makeCtx, type WidgetConfig } from '../services/stats';
import { assertFolder } from './folders';

export const dashboardRoutes = new Hono<AppEnv>();

export const WIDGET_TYPES = ['number', 'chart', 'status', 'priority', 'completion', 'workload', 'overdue', 'upcoming', 'progress', 'activity', 'time'] as const;

interface DashboardRow {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  board_ids_json: string;
  settings_json: string;
  created_by: string;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
  folder_id?: string | null;
}
interface WidgetRow {
  id: string;
  dashboard_id: string;
  type: string;
  title: string;
  config_json: string;
  position: number;
  w: number;
  h: number;
}

const dashDTO = (d: DashboardRow) => ({
  id: d.id,
  workspaceId: d.workspace_id,
  name: d.name,
  description: d.description,
  boardIds: parseJson<string[]>(d.board_ids_json, []),
  settings: parseJson(d.settings_json, {}),
  createdBy: d.created_by,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
  archivedAt: d.archived_at,
  folderId: d.folder_id ?? null,
});
const widgetDTO = (w: WidgetRow) => ({ id: w.id, dashboardId: w.dashboard_id, type: w.type, title: w.title, config: parseJson(w.config_json, {}), position: w.position, w: w.w, h: w.h });

function sanitizeConfig(raw: unknown): WidgetConfig {
  const cfg = (raw && typeof raw === 'object' ? raw : {}) as WidgetConfig;
  const out: WidgetConfig = { ...cfg };
  if (cfg.filter) out.filter = sanitizeFilter(cfg.filter);
  if (cfg.boardIds && !Array.isArray(cfg.boardIds)) out.boardIds = [];
  if (JSON.stringify(out).length > 10000) throw badRequest('Widget configuration too large');
  return out;
}

async function loadDashboard(c: any, needEdit: boolean) {
  const d = (await c.env.DB.prepare('SELECT * FROM dashboards WHERE id = ?').bind(c.req.param('id')).first()) as DashboardRow | null;
  if (!d) throw notFound('Dashboard');
  const role = await requireWorkspace(c.env.DB, d.workspace_id, c.get('user').id);
  if (needEdit && !(wsAtLeast(role, 'member'))) throw forbidden('Viewers cannot edit dashboards');
  return { dashboard: d, role };
}

dashboardRoutes.get('/workspaces/:ws/dashboards', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id);
  const rows = await c.env.DB.prepare(`SELECT * FROM dashboards WHERE workspace_id = ? AND ${c.req.query('archived') === '1' ? 'archived_at IS NOT NULL' : 'archived_at IS NULL'} ORDER BY created_at`).bind(wsId).all<DashboardRow>();
  return c.json(rows.results.map(dashDTO));
});

const DEFAULT_WIDGETS: { type: string; title: string; w: number; h: number; config?: WidgetConfig }[] = [
  { type: 'number', title: 'Open items', w: 1, h: 1, config: { filter: { op: 'and', rules: [{ field: 'done', op: 'is_not' }] } } },
  { type: 'completion', title: 'Completion', w: 1, h: 1 },
  { type: 'overdue', title: 'Overdue', w: 1, h: 1 },
  { type: 'upcoming', title: 'Due in the next 7 days', w: 1, h: 1, config: { days: 7 } },
  { type: 'status', title: 'Status overview', w: 2, h: 2 },
  { type: 'workload', title: 'Workload', w: 2, h: 2 },
  { type: 'priority', title: 'Priority distribution', w: 2, h: 2 },
  { type: 'progress', title: 'Project progress', w: 2, h: 2 },
];

dashboardRoutes.post('/workspaces/:ws/dashboards', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'member');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(200), description: z.string().max(2000).optional(), boardIds: z.array(z.string()).max(50).default([]), withDefaultWidgets: z.boolean().default(true), folderId: z.string().nullable().optional() }));
  await assertFolder(c.env.DB, wsId, 'dashboards', input.folderId);
  const allowed = new Set(await accessibleBoardIds(c.env.DB, wsId, user.id));
  const boardIds = input.boardIds.filter((b) => allowed.has(b));
  const id = newId();
  const t = now();
  const stmts = [
    c.env.DB.prepare('INSERT INTO dashboards (id, workspace_id, name, description, board_ids_json, created_by, created_at, updated_at, folder_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, wsId, input.name, input.description ?? '', JSON.stringify(boardIds), user.id, t, t, input.folderId ?? null),
  ];
  if (input.withDefaultWidgets) {
    DEFAULT_WIDGETS.forEach((w, i) =>
      stmts.push(c.env.DB.prepare('INSERT INTO dashboard_widgets (id, workspace_id, dashboard_id, type, title, config_json, position, w, h, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), wsId, id, w.type, w.title, JSON.stringify(w.config ?? {}), (i + 1) * 1000, w.w, w.h, t)),
    );
  }
  await c.env.DB.batch(stmts);
  const row = await c.env.DB.prepare('SELECT * FROM dashboards WHERE id = ?').bind(id).first<DashboardRow>();
  return c.json(dashDTO(row!), 201);
});

dashboardRoutes.get('/dashboards/:id', async (c) => {
  const { dashboard } = await loadDashboard(c, false);
  const widgets = await c.env.DB.prepare('SELECT * FROM dashboard_widgets WHERE dashboard_id = ? ORDER BY position').bind(dashboard.id).all<WidgetRow>();
  c.executionCtx.waitUntil(
    c.env.DB.prepare("INSERT INTO recents (user_id, workspace_id, entity_type, entity_id, visited_at) VALUES (?, ?, 'dashboard', ?, ?) ON CONFLICT(user_id, entity_type, entity_id) DO UPDATE SET visited_at = excluded.visited_at")
      .bind(c.get('user').id, dashboard.workspace_id, dashboard.id, now())
      .run(),
  );
  return c.json({ dashboard: dashDTO(dashboard), widgets: widgets.results.map(widgetDTO) });
});

dashboardRoutes.patch('/dashboards/:id', async (c) => {
  const user = c.get('user');
  const { dashboard } = await loadDashboard(c, true);
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(200).optional(), description: z.string().max(2000).optional(), boardIds: z.array(z.string()).max(50).optional(), settings: z.record(z.string(), z.unknown()).optional(), folderId: z.string().nullable().optional() }));
  if (input.folderId) await assertFolder(c.env.DB, dashboard.workspace_id, 'dashboards', input.folderId);
  let boardIds = parseJson<string[]>(dashboard.board_ids_json, []);
  if (input.boardIds) {
    const allowed = new Set(await accessibleBoardIds(c.env.DB, dashboard.workspace_id, user.id));
    boardIds = input.boardIds.filter((b) => allowed.has(b));
  }
  await c.env.DB.prepare('UPDATE dashboards SET name = ?, description = ?, board_ids_json = ?, settings_json = ?, folder_id = ?, updated_at = ? WHERE id = ?')
    .bind(input.name ?? dashboard.name, input.description ?? dashboard.description, JSON.stringify(boardIds), input.settings ? JSON.stringify(input.settings) : dashboard.settings_json, input.folderId !== undefined ? input.folderId : dashboard.folder_id ?? null, now(), dashboard.id)
    .run();
  return c.json({ ok: true });
});

dashboardRoutes.post('/dashboards/:id/duplicate', async (c) => {
  const user = c.get('user');
  const { dashboard } = await loadDashboard(c, true);
  const widgets = await c.env.DB.prepare('SELECT * FROM dashboard_widgets WHERE dashboard_id = ?').bind(dashboard.id).all<WidgetRow>();
  const id = newId();
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO dashboards (id, workspace_id, name, description, board_ids_json, settings_json, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, dashboard.workspace_id, `${dashboard.name} (copy)`, dashboard.description, dashboard.board_ids_json, dashboard.settings_json, user.id, t, t),
    ...widgets.results.map((w) => c.env.DB.prepare('INSERT INTO dashboard_widgets (id, workspace_id, dashboard_id, type, title, config_json, position, w, h, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), dashboard.workspace_id, id, w.type, w.title, w.config_json, w.position, w.w, w.h, t)),
  ]);
  return c.json({ id }, 201);
});

dashboardRoutes.post('/dashboards/:id/archive', async (c) => {
  const { dashboard } = await loadDashboard(c, true);
  const { archived } = await body(c, z.object({ archived: z.boolean() }));
  await c.env.DB.prepare('UPDATE dashboards SET archived_at = ? WHERE id = ?').bind(archived ? now() : null, dashboard.id).run();
  return c.json({ ok: true });
});

dashboardRoutes.delete('/dashboards/:id', async (c) => {
  const { dashboard, role } = await loadDashboard(c, true);
  if (dashboard.created_by !== c.get('user').id && !wsAtLeast(role, 'admin')) throw forbidden('Only the creator or an admin can delete this dashboard');
  await c.env.DB.prepare('DELETE FROM dashboards WHERE id = ?').bind(dashboard.id).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ widgets

dashboardRoutes.post('/dashboards/:id/widgets', async (c) => {
  const { dashboard } = await loadDashboard(c, true);
  const input = await body(c, z.object({ type: z.enum(WIDGET_TYPES), title: z.string().trim().min(1).max(200), config: z.unknown().optional(), w: z.number().int().min(1).max(4).default(1), h: z.number().int().min(1).max(4).default(1) }));
  const agg = await c.env.DB.prepare('SELECT MAX(position) AS hi, COUNT(*) AS n FROM dashboard_widgets WHERE dashboard_id = ?').bind(dashboard.id).first<{ hi: number | null; n: number }>();
  if ((agg?.n ?? 0) >= 40) throw badRequest('Widget limit reached');
  const id = newId();
  await c.env.DB.prepare('INSERT INTO dashboard_widgets (id, workspace_id, dashboard_id, type, title, config_json, position, w, h, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, dashboard.workspace_id, dashboard.id, input.type, input.title, JSON.stringify(sanitizeConfig(input.config)), (agg?.hi ?? 0) + 1000, input.w, input.h, now())
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM dashboard_widgets WHERE id = ?').bind(id).first<WidgetRow>();
  return c.json(widgetDTO(row!), 201);
});

async function loadWidget(c: any) {
  const w = (await c.env.DB.prepare('SELECT * FROM dashboard_widgets WHERE id = ?').bind(c.req.param('widgetId')).first()) as (WidgetRow & { workspace_id: string }) | null;
  if (!w) throw notFound('Widget');
  const role = await requireWorkspace(c.env.DB, w.workspace_id, c.get('user').id);
  if (!wsAtLeast(role, 'member')) throw forbidden('Viewers cannot edit dashboards');
  return w;
}

dashboardRoutes.patch('/widgets/:widgetId', async (c) => {
  const w = await loadWidget(c);
  const input = await body(c, z.object({ title: z.string().trim().min(1).max(200).optional(), config: z.unknown().optional(), w: z.number().int().min(1).max(4).optional(), h: z.number().int().min(1).max(4).optional(), position: z.number().optional() }));
  await c.env.DB.prepare('UPDATE dashboard_widgets SET title = ?, config_json = ?, w = ?, h = ?, position = ? WHERE id = ?')
    .bind(input.title ?? w.title, input.config !== undefined ? JSON.stringify(sanitizeConfig(input.config)) : w.config_json, input.w ?? w.w, input.h ?? w.h, input.position ?? w.position, w.id)
    .run();
  return c.json({ ok: true });
});

dashboardRoutes.delete('/widgets/:widgetId', async (c) => {
  const w = await loadWidget(c);
  await c.env.DB.prepare('DELETE FROM dashboard_widgets WHERE id = ?').bind(w.id).run();
  return c.json({ ok: true });
});

/**
 * Computes every widget from live data. Each viewer only sees data from boards
 * THEY can access, even when the dashboard references other boards.
 */
dashboardRoutes.get('/dashboards/:id/data', async (c) => {
  const user = c.get('user');
  const { dashboard } = await loadDashboard(c, false);
  const accessible = new Set(await accessibleBoardIds(c.env.DB, dashboard.workspace_id, user.id));
  const configured = parseJson<string[]>(dashboard.board_ids_json, []);
  const boardIds = (configured.length ? configured : Array.from(accessible)).filter((b) => accessible.has(b));
  const [data, members, widgets, tz] = await Promise.all([
    loadBoardData(c.env.DB, boardIds),
    workspaceMembers(c.env.DB, dashboard.workspace_id),
    c.env.DB.prepare('SELECT * FROM dashboard_widgets WHERE dashboard_id = ? ORDER BY position').bind(dashboard.id).all<WidgetRow>(),
    c.env.DB.prepare('SELECT timezone FROM users WHERE id = ?').bind(user.id).first<{ timezone: string }>(),
  ]);
  const ctx = makeCtx(data, members, user.id, tz?.timezone);
  const out: Record<string, unknown> = {};
  for (const w of widgets.results) {
    try {
      out[w.id] = await computeWidget(c.env.DB, w.type, parseJson(w.config_json, {}), ctx);
    } catch (e) {
      out[w.id] = { error: e instanceof Error ? e.message : 'Failed to compute' };
    }
  }
  return c.json({ boardIds, boards: Array.from(data.boards.values()), widgets: out, computedAt: Date.now() });
});

/** Board-scoped chart data used by the board Chart view (same engine as dashboards). */
dashboardRoutes.post('/boards/:id/chart', async (c) => {
  const user = c.get('user');
  const { requireBoard } = await import('../services/permissions');
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'view');
  const cfg = sanitizeConfig(await c.req.json().catch(() => ({})));
  const [data, members] = await Promise.all([loadBoardData(c.env.DB, [board.id]), workspaceMembers(c.env.DB, board.workspace_id)]);
  return c.json(await computeWidget(c.env.DB, 'chart', { ...cfg, boardIds: [board.id] }, makeCtx(data, members, user.id)));
});
