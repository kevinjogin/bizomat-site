import { Hono } from 'hono';
import { z } from 'zod';
import { sanitizeFilter } from '../../shared/filters';
import type { AppEnv } from '../env';
import { badRequest, body, newId, notFound, now, parseJson } from '../lib/util';
import { auditStmt } from '../services/audit';
import { automationSchema, runAutomation, validateAutomationRefs, type AutomationRow } from '../services/automations';
import { svcFromContext } from '../services/context';
import { loadColumns } from '../services/mappers';
import { requireBoard, requireItem } from '../services/permissions';

export const automationRoutes = new Hono<AppEnv>();

function dto(a: AutomationRow) {
  return {
    id: a.id,
    boardId: a.board_id,
    name: a.name,
    enabled: !!a.enabled,
    trigger: parseJson(a.trigger_json, null),
    conditions: parseJson(a.conditions_json, { op: 'and', rules: [] }),
    actions: parseJson(a.actions_json, []),
    createdBy: a.created_by,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
    lastRunAt: a.last_run_at,
    runCount: a.run_count,
  };
}

automationRoutes.get('/boards/:id/automations', async (c) => {
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), c.get('user').id, 'view');
  const rows = await c.env.DB.prepare('SELECT * FROM automations WHERE board_id = ? ORDER BY created_at').bind(board.id).all<AutomationRow>();
  return c.json(rows.results.map(dto));
});

automationRoutes.get('/workspaces/:ws/automations', async (c) => {
  const user = c.get('user');
  const { accessibleBoardIds } = await import('../services/permissions');
  const boards = await accessibleBoardIds(c.env.DB, c.req.param('ws'), user.id);
  if (!boards.length) return c.json([]);
  const rows = await c.env.DB.prepare(
    `SELECT a.*, b.name AS board_name FROM automations a JOIN boards b ON b.id = a.board_id WHERE a.board_id IN (${boards.map(() => '?').join(',')}) ORDER BY b.name, a.created_at`,
  )
    .bind(...boards)
    .all<AutomationRow & { board_name: string }>();
  return c.json(rows.results.map((r) => ({ ...dto(r), boardName: r.board_name })));
});

automationRoutes.post('/boards/:id/automations', async (c) => {
  const user = c.get('user');
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'edit');
  const input = await body(c, automationSchema);
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM automations WHERE board_id = ?').bind(board.id).first<{ n: number }>();
  if ((count?.n ?? 0) >= 50) throw badRequest('Automation limit reached for this board');
  const cols = await loadColumns(c.env.DB, board.id);
  const err = await validateAutomationRefs(c.env.DB, board, input, cols);
  if (err) throw badRequest(err);
  const id = newId();
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO automations (id, workspace_id, board_id, name, enabled, trigger_json, conditions_json, actions_json, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(
      id,
      board.workspace_id,
      board.id,
      input.name,
      input.enabled === false ? 0 : 1,
      JSON.stringify(input.trigger),
      JSON.stringify(sanitizeFilter(input.conditions)),
      JSON.stringify(input.actions),
      user.id,
      t,
      t,
    ),
    auditStmt(c.env.DB, { workspaceId: board.workspace_id, actorId: user.id, action: 'automation.created', targetType: 'automation', targetId: id }),
  ]);
  const row = await c.env.DB.prepare('SELECT * FROM automations WHERE id = ?').bind(id).first<AutomationRow>();
  return c.json(dto(row!), 201);
});

async function loadAutomation(c: any, need: 'view' | 'edit') {
  const a = (await c.env.DB.prepare('SELECT * FROM automations WHERE id = ?').bind(c.req.param('autoId')).first()) as AutomationRow | null;
  if (!a) throw notFound('Automation');
  const auth = await requireBoard(c.env.DB, a.board_id, c.get('user').id, need);
  return { automation: a, ...auth };
}

automationRoutes.patch('/automations/:autoId', async (c) => {
  const { automation, board } = await loadAutomation(c, 'edit');
  const input = await body(c, automationSchema.partial());
  const merged = {
    name: input.name ?? automation.name,
    enabled: input.enabled ?? !!automation.enabled,
    trigger: input.trigger ?? parseJson(automation.trigger_json, null),
    conditions: input.conditions !== undefined ? input.conditions : parseJson(automation.conditions_json, {}),
    actions: input.actions ?? parseJson(automation.actions_json, []),
  };
  const parsed = automationSchema.safeParse(merged);
  if (!parsed.success) throw badRequest('Invalid automation');
  const err = await validateAutomationRefs(c.env.DB, board, parsed.data, await loadColumns(c.env.DB, board.id));
  if (err) throw badRequest(err);
  await c.env.DB.prepare('UPDATE automations SET name = ?, enabled = ?, trigger_json = ?, conditions_json = ?, actions_json = ?, updated_at = ? WHERE id = ?')
    .bind(merged.name, merged.enabled ? 1 : 0, JSON.stringify(merged.trigger), JSON.stringify(sanitizeFilter(merged.conditions)), JSON.stringify(merged.actions), now(), automation.id)
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM automations WHERE id = ?').bind(automation.id).first<AutomationRow>();
  return c.json(dto(row!));
});

automationRoutes.delete('/automations/:autoId', async (c) => {
  const { automation, board } = await loadAutomation(c, 'edit');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM automations WHERE id = ?').bind(automation.id),
    auditStmt(c.env.DB, { workspaceId: board.workspace_id, actorId: c.get('user').id, action: 'automation.deleted', targetType: 'automation', targetId: automation.id }),
  ]);
  return c.json({ ok: true });
});

automationRoutes.get('/automations/:autoId/runs', async (c) => {
  const { automation } = await loadAutomation(c, 'view');
  const rows = await c.env.DB.prepare(
    `SELECT r.id, r.item_id, r.status, r.attempts, r.depth, r.error, r.result_json, r.started_at, r.finished_at, r.next_retry_at, i.name AS item_name
     FROM automation_runs r LEFT JOIN items i ON i.id = r.item_id WHERE r.automation_id = ? ORDER BY r.started_at DESC LIMIT 100`,
  )
    .bind(automation.id)
    .all<any>();
  return c.json(rows.results.map((r) => ({ ...r, result: parseJson(r.result_json, null) })));
});

/** Manually run an automation against one item (useful for testing rules). */
automationRoutes.post('/automations/:autoId/run', async (c) => {
  const { automation, board } = await loadAutomation(c, 'edit');
  const input = await body(c, z.object({ itemId: z.string().optional() }));
  const cols = await loadColumns(c.env.DB, board.id);
  let event: any;
  if (input.itemId) {
    const { item } = await requireItem(c.env.DB, input.itemId, c.get('user').id, 'edit');
    if (item.board_id !== board.id) throw badRequest('Item is not on this board');
    event = { type: 'item_created', item, isSubitem: !!item.parent_item_id };
  } else event = { type: 'recurring', periodKey: `manual-${newId()}` };
  const result = await runAutomation(svcFromContext(c), board, automation, event, `${automation.id}:manual:${newId()}`, cols);
  return c.json(result);
});
