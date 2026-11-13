// Managing CRM automations: list, create from scratch or from a preset, edit, switch on and off, delete, and read the
// execution history. Only triggers and actions the engine runs are accepted (src/shared/crm/automations.ts).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { badRequest, body, newId, notFound, now, parseJson } from '../lib/util';
import { ACTION_TYPES, CONDITION_FIELDS, PRESETS, TRIGGERS, TRIGGER_TYPES, actionsFor, type TriggerType } from '../../shared/crm/automations';
import type { AutomationDTO, AutomationRunDTO } from '../../shared/crm/types';
import { requireOrg, requirePerm } from './access';
import { auditStmt } from './util';

export const automationRoutes = new Hono<AppEnv>();

function dto(r: any): AutomationDTO {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    trigger: r.trigger_type,
    config: parseJson(r.trigger_json, {}),
    conditions: parseJson(r.conditions_json, []),
    actions: parseJson(r.actions_json, []),
    enabled: !!r.enabled,
    preset: r.preset,
    runCount: r.run_count,
    lastRunAt: r.last_run_at,
    createdAt: r.created_at,
  };
}

const condition = z.object({ field: z.string().max(40), op: z.enum(['eq', 'neq', 'gte', 'lte', 'in', 'contains', 'empty', 'not_empty']), value: z.unknown().optional() });
const action = z.discriminatedUnion('type', [
  z.object({ type: z.literal('notify'), to: z.enum(['owner', 'assignee', 'actor', 'managers', 'admins', 'everyone', 'users']), userIds: z.array(z.string().max(64)).max(50).optional(), message: z.string().trim().max(300).optional() }),
  z.object({ type: z.literal('create_activity'), activityType: z.string().max(40), title: z.string().trim().min(1).max(200), dueInDays: z.number().int().min(0).max(365), assignTo: z.enum(['owner', 'actor', 'user']), userId: z.string().max(64).nullable().optional(), priority: z.enum(['low', 'medium', 'high', 'urgent']).optional() }),
  z.object({ type: z.literal('set_priority'), priority: z.enum(['low', 'medium', 'high', 'urgent']) }),
  z.object({ type: z.literal('flag_deal'), reason: z.string().trim().max(200).optional() }),
  z.object({ type: z.literal('assign_owner'), userId: z.string().max(64) }),
]);
const automationInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  trigger: z.enum(TRIGGER_TYPES as [TriggerType, ...TriggerType[]]),
  config: z.object({ pipelineId: z.string().max(64).nullable().optional(), stageId: z.string().max(64).nullable().optional(), outcome: z.enum(['won', 'lost', 'any']).optional(), days: z.number().int().min(0).max(365).optional() }).default({}),
  conditions: z.array(condition).max(10).default([]),
  actions: z.array(action).min(1).max(10),
  enabled: z.boolean().default(true),
});

/** Every reference in an automation must belong to this organisation, and every action must suit the trigger. */
async function validate(db: D1Database, orgId: string, input: z.infer<typeof automationInput>) {
  const entity = TRIGGERS[input.trigger].entity;
  const allowed = actionsFor(entity);
  for (const a of input.actions) if (!allowed.includes(a.type)) throw badRequest(`"${a.type}" cannot be used with this trigger`);
  const fields = CONDITION_FIELDS[entity].map((f) => f.key);
  for (const cnd of input.conditions) if (!fields.includes(cnd.field)) throw badRequest(`Unknown condition field ${cnd.field}`);
  const users = new Set<string>();
  for (const a of input.actions) {
    if (a.type === 'notify' && a.to === 'users') {
      if (!a.userIds?.length) throw badRequest('Choose who to notify');
      a.userIds.forEach((u) => users.add(u));
    }
    if (a.type === 'create_activity' && a.assignTo === 'user') {
      if (!a.userId) throw badRequest('Choose who the activity is for');
      users.add(a.userId);
    }
    if (a.type === 'assign_owner') users.add(a.userId);
  }
  for (const u of users) {
    const m = await db.prepare('SELECT 1 FROM crm_members WHERE org_id = ? AND user_id = ?').bind(orgId, u).first();
    if (!m) throw badRequest('Everyone named in an automation must be a member of the organisation');
  }
  if (input.config.pipelineId) {
    const p = await db.prepare('SELECT 1 FROM crm_pipelines WHERE org_id = ? AND id = ?').bind(orgId, input.config.pipelineId).first();
    if (!p) throw badRequest('Unknown pipeline');
  }
  if (input.config.stageId) {
    const s = await db.prepare('SELECT pipeline_id FROM crm_stages WHERE org_id = ? AND id = ?').bind(orgId, input.config.stageId).first<{ pipeline_id: string }>();
    if (!s) throw badRequest('Unknown stage');
    if (input.config.pipelineId && s.pipeline_id !== input.config.pipelineId) throw badRequest('That stage is not in that pipeline');
  }
}

automationRoutes.get('/orgs/:org/automations', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'automations', 'view', 'You cannot see automations');
  const rows = await c.env.DB.prepare('SELECT * FROM crm_automations WHERE org_id = ? ORDER BY created_at').bind(a.orgId).all<any>();
  return c.json({ automations: rows.results.map(dto), presets: PRESETS, actionTypes: ACTION_TYPES });
});

automationRoutes.post('/orgs/:org/automations', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'automations', 'manage', 'You cannot manage automations');
  const input = await body(c, automationInput);
  await validate(c.env.DB, a.orgId, input);
  const n = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM crm_automations WHERE org_id = ?').bind(a.orgId).first<{ n: number }>();
  if ((n?.n ?? 0) >= 100) throw badRequest('An organisation can have at most 100 automations');
  const id = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO crm_automations (id, org_id, name, description, trigger_type, trigger_json, conditions_json, actions_json, enabled, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.orgId, input.name, input.description ?? '', input.trigger, JSON.stringify(input.config), JSON.stringify(input.conditions), JSON.stringify(input.actions), input.enabled ? 1 : 0, a.userId, now(), now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'automation.created', targetType: 'automation', targetId: id, after: { name: input.name, trigger: input.trigger } }),
  ]);
  return c.json(dto(await c.env.DB.prepare('SELECT * FROM crm_automations WHERE id = ?').bind(id).first()), 201);
});

automationRoutes.put('/orgs/:org/automations/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'automations', 'manage', 'You cannot manage automations');
  const cur = await c.env.DB.prepare('SELECT * FROM crm_automations WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!cur) throw notFound('Automation');
  const input = await body(c, automationInput);
  await validate(c.env.DB, a.orgId, input);
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_automations SET name = ?, description = ?, trigger_type = ?, trigger_json = ?, conditions_json = ?, actions_json = ?, enabled = ?, updated_at = ? WHERE org_id = ? AND id = ?')
      .bind(input.name, input.description ?? '', input.trigger, JSON.stringify(input.config), JSON.stringify(input.conditions), JSON.stringify(input.actions), input.enabled ? 1 : 0, now(), a.orgId, cur.id),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'automation.updated', targetType: 'automation', targetId: cur.id, before: dto(cur), after: input }),
  ]);
  return c.json(dto(await c.env.DB.prepare('SELECT * FROM crm_automations WHERE id = ?').bind(cur.id).first()));
});

automationRoutes.post('/orgs/:org/automations/:id/enabled', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'automations', 'manage', 'You cannot manage automations');
  const { enabled } = await body(c, z.object({ enabled: z.boolean() }));
  const r = await c.env.DB.prepare('UPDATE crm_automations SET enabled = ?, updated_at = ? WHERE org_id = ? AND id = ?').bind(enabled ? 1 : 0, now(), a.orgId, c.req.param('id')).run();
  if (!r.meta.changes) throw notFound('Automation');
  await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: enabled ? 'automation.enabled' : 'automation.disabled', targetType: 'automation', targetId: c.req.param('id') }).run();
  return c.json({ ok: true });
});

automationRoutes.delete('/orgs/:org/automations/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'automations', 'manage', 'You cannot manage automations');
  const cur = await c.env.DB.prepare('SELECT name FROM crm_automations WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<{ name: string }>();
  if (!cur) throw notFound('Automation');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM crm_automations WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'automation.deleted', targetType: 'automation', targetId: c.req.param('id'), before: { name: cur.name } }),
  ]);
  return c.json({ ok: true });
});

automationRoutes.get('/orgs/:org/automation-runs', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'automations', 'view', 'You cannot see automations');
  const auto = c.req.query('automation');
  const rows = await c.env.DB.prepare(`SELECT r.*, a.name AS automation_name FROM crm_automation_runs r JOIN crm_automations a ON a.id = r.automation_id WHERE r.org_id = ?${auto ? ' AND r.automation_id = ?' : ''} ORDER BY r.created_at DESC LIMIT 200`)
    .bind(...[a.orgId, ...(auto ? [auto] : [])])
    .all<any>();
  const out: AutomationRunDTO[] = rows.results.map((r) => ({ id: r.id, automationId: r.automation_id, automationName: r.automation_name, trigger: r.trigger_type, entityType: r.entity_type, entityId: r.entity_id, status: r.status, detail: r.detail, createdAt: r.created_at }));
  return c.json(out);
});
