// CRM configuration per organisation: pipelines and stages, products and services, tags, custom fields, saved views
// and email templates.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, newId, notFound, now, parseJson } from '../lib/util';
import { CRM_ENTITIES, CUSTOM_FIELD_TYPES, RECORD_ENTITIES, type CrmEntity } from '../../shared/crm/fields';
import type { EmailTemplateDTO, PipelineDTO, ProductDTO, SavedViewDTO, TagDTO } from '../../shared/crm/types';
import { deny, requireOrg, requirePerm } from './access';
import { customFields } from './entities';
import { auditStmt } from './util';

export const configRoutes = new Hono<AppEnv>();

const manage = (a: Awaited<ReturnType<typeof requireOrg>>) => requirePerm(a, 'settings', 'manage', 'You cannot change CRM settings');

// ------------------------------------------------------------------ pipelines and stages

export async function pipelines(db: D1Database, orgId: string, includeArchived = true): Promise<PipelineDTO[]> {
  const [ps, ss] = await Promise.all([
    db.prepare(`SELECT * FROM crm_pipelines WHERE org_id = ?${includeArchived ? '' : ' AND archived_at IS NULL'} ORDER BY position`).bind(orgId).all<any>(),
    db.prepare('SELECT * FROM crm_stages WHERE org_id = ? ORDER BY position').bind(orgId).all<any>(),
  ]);
  return ps.results.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    isDefault: !!p.is_default,
    archived: !!p.archived_at,
    stages: ss.results.filter((s) => s.pipeline_id === p.id).map((s) => ({ id: s.id, name: s.name, probability: s.probability, position: s.position, rotDays: s.rot_days })),
  }));
}

configRoutes.get('/orgs/:org/pipelines', async (c) => {
  const a = await requireOrg(c);
  return c.json(await pipelines(c.env.DB, a.orgId));
});

const stageInput = z.object({ id: z.string().max(64).optional(), name: z.string().trim().min(1).max(60), probability: z.number().int().min(0).max(100), rotDays: z.number().int().min(1).max(365).nullable().optional() });

configRoutes.post('/orgs/:org/pipelines', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(80), description: z.string().trim().max(300).optional(), stages: z.array(stageInput.omit({ id: true })).min(1).max(30) }));
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS n, MAX(position) AS p FROM crm_pipelines WHERE org_id = ?').bind(a.orgId).first<{ n: number; p: number | null }>();
  if ((count?.n ?? 0) >= 50) throw new HttpError(400, 'An organisation can have at most 50 pipelines');
  const id = newId();
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO crm_pipelines (id, org_id, name, description, position, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, input.name, input.description ?? '', (count?.p ?? 0) + 1000, count?.n ? 0 : 1, t, t),
    ...input.stages.map((s, i) => c.env.DB.prepare('INSERT INTO crm_stages (id, org_id, pipeline_id, name, probability, position, rot_days, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.orgId, id, s.name, s.probability, (i + 1) * 1000, s.rotDays ?? null, t)),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'pipeline.created', targetType: 'pipeline', targetId: id, after: { name: input.name, stages: input.stages.length } }),
  ]);
  return c.json((await pipelines(c.env.DB, a.orgId)).find((p) => p.id === id), 201);
});

/**
 * Rename a pipeline and set its stages in order (add, rename, reorder, change probability). A stage that still has
 * deals cannot be removed: move them first (moveDealsTo names the stage to move them to).
 */
configRoutes.put('/orgs/:org/pipelines/:id', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const db = c.env.DB;
  const pid = c.req.param('id');
  const current = (await pipelines(db, a.orgId)).find((p) => p.id === pid);
  if (!current) throw notFound('Pipeline');
  const input = await body(
    c,
    z.object({
      name: z.string().trim().min(1).max(80),
      description: z.string().trim().max(300).optional(),
      isDefault: z.boolean().optional(),
      archived: z.boolean().optional(),
      stages: z.array(stageInput).min(1).max(30),
      moveDealsTo: z.record(z.string(), z.string()).optional(),
    }),
  );
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db
      .prepare('UPDATE crm_pipelines SET name = ?3, description = ?4, archived_at = CASE WHEN ?1 IS NULL THEN archived_at WHEN ?1 = 1 THEN COALESCE(archived_at, ?2) ELSE NULL END, updated_at = ?2 WHERE org_id = ?5 AND id = ?6')
      .bind(input.archived === undefined ? null : input.archived ? 1 : 0, t, input.name, input.description ?? current.description, a.orgId, pid),
  ];
  if (input.archived && current.isDefault) throw badRequest('Make another pipeline the default before archiving this one');
  if (input.isDefault) stmts.push(db.prepare('UPDATE crm_pipelines SET is_default = CASE WHEN id = ? THEN 1 ELSE 0 END WHERE org_id = ?').bind(pid, a.orgId));
  const keep = new Set(input.stages.filter((s) => s.id).map((s) => s.id!));
  for (const id of keep) if (!current.stages.some((s) => s.id === id)) throw badRequest('A stage you gave is not in this pipeline');
  const newIds: string[] = [];
  input.stages.forEach((s, i) => {
    const pos = (i + 1) * 1000;
    if (s.id) stmts.push(db.prepare('UPDATE crm_stages SET name = ?, probability = ?, position = ?, rot_days = ? WHERE org_id = ? AND id = ? AND pipeline_id = ?').bind(s.name, s.probability, pos, s.rotDays ?? null, a.orgId, s.id, pid));
    else {
      const id = newId();
      newIds.push(id);
      stmts.push(db.prepare('INSERT INTO crm_stages (id, org_id, pipeline_id, name, probability, position, rot_days, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, pid, s.name, s.probability, pos, s.rotDays ?? null, t));
    }
  });
  for (const removed of current.stages.filter((s) => !keep.has(s.id))) {
    const deals = await db.prepare('SELECT COUNT(*) AS n FROM crm_deals WHERE org_id = ? AND stage_id = ?').bind(a.orgId, removed.id).first<{ n: number }>();
    if (deals?.n) {
      const target = input.moveDealsTo?.[removed.id];
      if (!target || !keep.has(target)) throw new HttpError(409, `The stage "${removed.name}" has ${deals.n} deal${deals.n === 1 ? '' : 's'}. Choose a stage to move them to.`, { code: 'STAGE_HAS_DEALS', stageId: removed.id, count: deals.n });
      stmts.push(db.prepare('UPDATE crm_deals SET stage_id = ?, updated_at = ? WHERE org_id = ? AND stage_id = ?').bind(target, t, a.orgId, removed.id));
    }
    stmts.push(db.prepare('DELETE FROM crm_stages WHERE org_id = ? AND id = ?').bind(a.orgId, removed.id));
  }
  stmts.push(auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'pipeline.updated', targetType: 'pipeline', targetId: pid, before: { name: current.name, stages: current.stages.map((s) => s.name) }, after: { name: input.name, stages: input.stages.map((s) => s.name) }, ip: clientIp(c) }));
  await db.batch(stmts);
  return c.json((await pipelines(db, a.orgId)).find((p) => p.id === pid));
});

configRoutes.delete('/orgs/:org/pipelines/:id', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const db = c.env.DB;
  const p = await db.prepare('SELECT * FROM crm_pipelines WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!p) throw notFound('Pipeline');
  if (p.is_default) throw badRequest('The default pipeline cannot be deleted');
  const deals = await db.prepare('SELECT COUNT(*) AS n FROM crm_deals WHERE org_id = ? AND pipeline_id = ?').bind(a.orgId, p.id).first<{ n: number }>();
  if (deals?.n) throw new HttpError(409, `This pipeline has ${deals.n} deal${deals.n === 1 ? '' : 's'} (deleted ones included). Archive it instead, or move them first.`);
  await db.batch([db.prepare('DELETE FROM crm_pipelines WHERE org_id = ? AND id = ?').bind(a.orgId, p.id), auditStmt(db, { orgId: a.orgId, actorId: a.userId, action: 'pipeline.deleted', targetType: 'pipeline', targetId: p.id, before: { name: p.name } })]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ products and services

const productDTO = (r: any): ProductDTO => ({ id: r.id, name: r.name, sku: r.sku, unitPrice: r.unit_price, description: r.description, active: !!r.active });
const productInput = z.object({ name: z.string().trim().min(1).max(200), sku: z.string().trim().max(60).optional(), unitPrice: z.number().int().min(0).max(1e13), description: z.string().trim().max(1000).optional(), active: z.boolean().optional() });

configRoutes.get('/orgs/:org/products', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT * FROM crm_products WHERE org_id = ? ORDER BY active DESC, name COLLATE NOCASE LIMIT 1000').bind(a.orgId).all<any>();
  return c.json(rows.results.map(productDTO));
});

configRoutes.post('/orgs/:org/products', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const input = await body(c, productInput);
  const id = newId();
  await c.env.DB.prepare('INSERT INTO crm_products (id, org_id, name, sku, unit_price, description, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, input.name, input.sku ?? '', input.unitPrice, input.description ?? '', input.active === false ? 0 : 1, now(), now()).run();
  return c.json(productDTO(await c.env.DB.prepare('SELECT * FROM crm_products WHERE id = ?').bind(id).first()), 201);
});

configRoutes.patch('/orgs/:org/products/:id', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const input = await body(c, productInput.partial());
  const p = await c.env.DB.prepare('SELECT * FROM crm_products WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!p) throw notFound('Product');
  await c.env.DB.prepare('UPDATE crm_products SET name = ?, sku = ?, unit_price = ?, description = ?, active = ?, updated_at = ? WHERE org_id = ? AND id = ?')
    .bind(input.name ?? p.name, input.sku ?? p.sku, input.unitPrice ?? p.unit_price, input.description ?? p.description, input.active === undefined ? p.active : input.active ? 1 : 0, now(), a.orgId, p.id)
    .run();
  return c.json(productDTO(await c.env.DB.prepare('SELECT * FROM crm_products WHERE id = ?').bind(p.id).first()));
});

// ------------------------------------------------------------------ tags

configRoutes.get('/orgs/:org/tags', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT g.id, g.name, g.color, (SELECT COUNT(*) FROM crm_record_tags rt WHERE rt.tag_id = g.id) AS uses FROM crm_tags g WHERE g.org_id = ? ORDER BY g.name COLLATE NOCASE').bind(a.orgId).all<TagDTO & { uses: number }>();
  return c.json(rows.results);
});

const tagInput = z.object({ name: z.string().trim().min(1).max(40), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional() });

/** Anyone who can edit records can create a tag (tagging is part of working on records); renaming and deleting is settings. */
configRoutes.post('/orgs/:org/tags', async (c) => {
  const a = await requireOrg(c);
  const canTag = (['leads', 'contacts', 'companies', 'deals'] as const).some((m) => a.perms[m].edit !== 'none');
  if (!canTag) deny('You cannot create tags');
  const input = await body(c, tagInput);
  const existing = await c.env.DB.prepare('SELECT id, name, color FROM crm_tags WHERE org_id = ? AND name = ?').bind(a.orgId, input.name).first<TagDTO>();
  if (existing) return c.json(existing);
  const id = newId();
  await c.env.DB.prepare('INSERT INTO crm_tags (id, org_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, a.orgId, input.name, input.color ?? '#0f766e', now()).run();
  return c.json({ id, name: input.name, color: input.color ?? '#0f766e' }, 201);
});

configRoutes.patch('/orgs/:org/tags/:id', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const input = await body(c, tagInput.partial());
  const r = await c.env.DB.prepare('UPDATE crm_tags SET name = COALESCE(?, name), color = COALESCE(?, color) WHERE org_id = ? AND id = ?').bind(input.name ?? null, input.color ?? null, a.orgId, c.req.param('id')).run().catch((e) => {
    if (String(e).includes('UNIQUE')) throw new HttpError(409, 'A tag with that name exists');
    throw e;
  });
  if (!r.meta.changes) throw notFound('Tag');
  return c.json({ ok: true });
});

configRoutes.delete('/orgs/:org/tags/:id', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const r = await c.env.DB.prepare('DELETE FROM crm_tags WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).run();
  if (!r.meta.changes) throw notFound('Tag');
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ custom fields

configRoutes.get('/orgs/:org/custom-fields', async (c) => {
  const a = await requireOrg(c);
  const out = await Promise.all(RECORD_ENTITIES.map((e) => customFields(c.env.DB, a.orgId, e, true)));
  return c.json(out.flat());
});

const cfInput = z.object({
  entity: z.enum(RECORD_ENTITIES as ['lead', 'contact', 'company', 'deal']),
  label: z.string().trim().min(1).max(60),
  type: z.enum(CUSTOM_FIELD_TYPES),
  options: z.array(z.string().trim().min(1).max(60)).max(100).optional(),
  required: z.boolean().optional(),
});

configRoutes.post('/orgs/:org/custom-fields', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const input = await body(c, cfInput);
  if ((input.type === 'select' || input.type === 'multiselect') && !input.options?.length) throw badRequest('Give the choices for this field');
  const n = await c.env.DB.prepare('SELECT COUNT(*) AS n, MAX(position) AS p FROM crm_custom_fields WHERE org_id = ? AND entity = ?').bind(a.orgId, input.entity).first<{ n: number; p: number | null }>();
  if ((n?.n ?? 0) >= 60) throw badRequest('At most 60 custom fields per record type');
  const id = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO crm_custom_fields (id, org_id, entity, label, type, options_json, required, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, input.entity, input.label, input.type, JSON.stringify([...new Set(input.options ?? [])]), input.required ? 1 : 0, (n?.p ?? 0) + 1000, now(), now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'custom_field.created', targetType: 'custom_field', targetId: id, after: { entity: input.entity, label: input.label, type: input.type } }),
  ]);
  return c.json({ id }, 201);
});

configRoutes.patch('/orgs/:org/custom-fields/:id', async (c) => {
  const a = await requireOrg(c);
  manage(a);
  const input = await body(c, z.object({ label: z.string().trim().min(1).max(60).optional(), options: z.array(z.string().trim().min(1).max(60)).max(100).optional(), required: z.boolean().optional(), archived: z.boolean().optional(), position: z.number().optional() }));
  const f = await c.env.DB.prepare('SELECT * FROM crm_custom_fields WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!f) throw notFound('Field');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_custom_fields SET label = ?, options_json = ?, required = ?, archived_at = ?, position = ?, updated_at = ? WHERE org_id = ? AND id = ?').bind(
      input.label ?? f.label,
      input.options ? JSON.stringify([...new Set(input.options)]) : f.options_json,
      input.required === undefined ? f.required : input.required ? 1 : 0,
      input.archived === undefined ? f.archived_at : input.archived ? (f.archived_at ?? now()) : null,
      input.position ?? f.position,
      now(),
      a.orgId,
      f.id,
    ),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'custom_field.updated', targetType: 'custom_field', targetId: f.id, before: { label: f.label }, after: input }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ saved views

const viewQuery = z.object({
  q: z.string().max(200).optional(),
  filters: z.array(z.object({ field: z.string().max(64), op: z.string().max(20), value: z.unknown().optional() })).max(25).optional(),
  match: z.enum(['all', 'any']).optional(),
  anyOf: z.array(z.object({ field: z.string().max(64), op: z.string().max(20), value: z.unknown().optional() })).max(25).optional(),
  sort: z.object({ field: z.string().max(64), dir: z.enum(['asc', 'desc']) }).optional(),
  scope: z.enum(['active', 'archived', 'deleted', 'all']).optional(),
});

function viewDTO(r: any, userId: string): SavedViewDTO {
  const cfg = parseJson<{ query?: SavedViewDTO['query']; columns?: string[] }>(r.config_json, {});
  return { id: r.id, entity: r.entity, name: r.name, query: cfg.query ?? {}, columns: cfg.columns ?? [], shared: !!r.shared, userId: r.user_id, mine: r.user_id === userId };
}

configRoutes.get('/orgs/:org/views', async (c) => {
  const a = await requireOrg(c);
  const entity = c.req.query('entity');
  if (entity && !CRM_ENTITIES.includes(entity as CrmEntity)) throw badRequest('Unknown record type');
  const rows = await c.env.DB.prepare(`SELECT * FROM crm_saved_views WHERE org_id = ? AND (user_id = ? OR shared = 1)${entity ? ' AND entity = ?' : ''} ORDER BY name COLLATE NOCASE`)
    .bind(...[a.orgId, a.userId, ...(entity ? [entity] : [])])
    .all<any>();
  return c.json(rows.results.map((r) => viewDTO(r, a.userId)));
});

const viewInput = z.object({ entity: z.enum(CRM_ENTITIES as ['lead', 'contact', 'company', 'deal', 'activity']), name: z.string().trim().min(1).max(60), query: viewQuery, columns: z.array(z.string().max(64)).max(40).default([]), shared: z.boolean().default(false) });

/** Shared views are visible to everyone in the organisation: managers and administrators may share. */
function canShare(a: Awaited<ReturnType<typeof requireOrg>>) {
  return a.role === 'owner' || a.role === 'admin' || a.role === 'manager';
}

configRoutes.post('/orgs/:org/views', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, viewInput);
  if (input.shared && !canShare(a)) deny('Only managers and administrators can share views');
  const n = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM crm_saved_views WHERE org_id = ? AND user_id = ?').bind(a.orgId, a.userId).first<{ n: number }>();
  if ((n?.n ?? 0) >= 100) throw badRequest('You can save at most 100 views');
  const id = newId();
  await c.env.DB.prepare('INSERT INTO crm_saved_views (id, org_id, user_id, entity, name, config_json, shared, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, a.userId, input.entity, input.name, JSON.stringify({ query: input.query, columns: input.columns }), input.shared ? 1 : 0, now(), now()).run();
  return c.json(viewDTO(await c.env.DB.prepare('SELECT * FROM crm_saved_views WHERE id = ?').bind(id).first(), a.userId), 201);
});

configRoutes.patch('/orgs/:org/views/:id', async (c) => {
  const a = await requireOrg(c);
  const v = await c.env.DB.prepare('SELECT * FROM crm_saved_views WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!v || (v.user_id !== a.userId && !v.shared)) throw notFound('View');
  if (v.user_id !== a.userId && !(a.role === 'owner' || a.role === 'admin')) deny('Only the person who saved this view can change it');
  const input = await body(c, viewInput.omit({ entity: true }).partial());
  if (input.shared && !canShare(a)) deny('Only managers and administrators can share views');
  const cfg = parseJson<Record<string, unknown>>(v.config_json, {});
  await c.env.DB.prepare('UPDATE crm_saved_views SET name = ?, config_json = ?, shared = ?, updated_at = ? WHERE id = ?')
    .bind(input.name ?? v.name, JSON.stringify({ query: input.query ?? cfg.query ?? {}, columns: input.columns ?? cfg.columns ?? [] }), input.shared === undefined ? v.shared : input.shared ? 1 : 0, now(), v.id)
    .run();
  return c.json(viewDTO(await c.env.DB.prepare('SELECT * FROM crm_saved_views WHERE id = ?').bind(v.id).first(), a.userId));
});

configRoutes.delete('/orgs/:org/views/:id', async (c) => {
  const a = await requireOrg(c);
  const v = await c.env.DB.prepare('SELECT * FROM crm_saved_views WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!v || (v.user_id !== a.userId && !v.shared)) throw notFound('View');
  if (v.user_id !== a.userId && !(a.role === 'owner' || a.role === 'admin')) deny('Only the person who saved this view can delete it');
  await c.env.DB.prepare('DELETE FROM crm_saved_views WHERE id = ?').bind(v.id).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ email templates

const templateDTO = (r: any, userId: string): EmailTemplateDTO => ({ id: r.id, name: r.name, subject: r.subject, body: r.body, shared: !!r.shared, createdBy: r.created_by, mine: r.created_by === userId });
const templateInput = z.object({ name: z.string().trim().min(1).max(80), subject: z.string().trim().min(1).max(200), body: z.string().max(10_000), shared: z.boolean().default(false) });

configRoutes.get('/orgs/:org/email-templates', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT * FROM crm_email_templates WHERE org_id = ? AND (shared = 1 OR created_by = ?) ORDER BY name COLLATE NOCASE').bind(a.orgId, a.userId).all<any>();
  return c.json(rows.results.map((r) => templateDTO(r, a.userId)));
});

configRoutes.post('/orgs/:org/email-templates', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'activities', 'create', 'You cannot write emails');
  const input = await body(c, templateInput);
  if (input.shared && !a.perms.settings.manage) deny('Only people who manage CRM settings can share templates');
  const id = newId();
  await c.env.DB.prepare('INSERT INTO crm_email_templates (id, org_id, name, subject, body, shared, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, input.name, input.subject, input.body, input.shared ? 1 : 0, a.userId, now(), now()).run();
  return c.json(templateDTO(await c.env.DB.prepare('SELECT * FROM crm_email_templates WHERE id = ?').bind(id).first(), a.userId), 201);
});

configRoutes.patch('/orgs/:org/email-templates/:id', async (c) => {
  const a = await requireOrg(c);
  const t = await c.env.DB.prepare('SELECT * FROM crm_email_templates WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!t || (!t.shared && t.created_by !== a.userId)) throw notFound('Template');
  if (t.created_by !== a.userId && !a.perms.settings.manage) deny('You cannot change this template');
  const input = await body(c, templateInput.partial());
  if (input.shared && !a.perms.settings.manage) deny('Only people who manage CRM settings can share templates');
  await c.env.DB.prepare('UPDATE crm_email_templates SET name = ?, subject = ?, body = ?, shared = ?, updated_at = ? WHERE id = ?').bind(input.name ?? t.name, input.subject ?? t.subject, input.body ?? t.body, input.shared === undefined ? t.shared : input.shared ? 1 : 0, now(), t.id).run();
  return c.json(templateDTO(await c.env.DB.prepare('SELECT * FROM crm_email_templates WHERE id = ?').bind(t.id).first(), a.userId));
});

configRoutes.delete('/orgs/:org/email-templates/:id', async (c) => {
  const a = await requireOrg(c);
  const t = await c.env.DB.prepare('SELECT * FROM crm_email_templates WHERE org_id = ? AND id = ?').bind(a.orgId, c.req.param('id')).first<any>();
  if (!t || (!t.shared && t.created_by !== a.userId)) throw notFound('Template');
  if (t.created_by !== a.userId && !a.perms.settings.manage) deny('You cannot delete this template');
  await c.env.DB.prepare('DELETE FROM crm_email_templates WHERE id = ?').bind(t.id).run();
  return c.json({ ok: true });
});
