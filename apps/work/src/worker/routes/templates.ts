import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { builtinTemplates } from '../services/boards';
import { requireWorkspace } from '../services/permissions';

export const templateRoutes = new Hono<AppEnv>();

templateRoutes.get('/workspaces/:ws/templates', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id);
  const custom = await c.env.DB.prepare(
    "SELECT b.id, b.name, b.description, b.icon, b.created_at, u.name AS created_by_name FROM boards b JOIN users u ON u.id = b.created_by WHERE b.workspace_id = ? AND b.kind = 'template' AND b.archived_at IS NULL ORDER BY b.created_at DESC",
  )
    .bind(wsId)
    .all<any>();
  return c.json({
    builtin: builtinTemplates().map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      icon: t.icon,
      columns: t.columns.map((col) => ({ title: col.title, type: col.type })),
      views: (t.views ?? []).map((v) => v.type),
      groups: t.groups.map((g) => g.name),
    })),
    workspace: custom.results.map((t) => ({ id: t.id, name: t.name, description: t.description, icon: t.icon, createdAt: t.created_at, createdByName: t.created_by_name })),
  });
});
