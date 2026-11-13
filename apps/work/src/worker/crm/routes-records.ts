// Routes for CRM records: leads, contacts, companies, deals and activities. The same list, read, write, archive, delete,
// bulk, export and import endpoints for each, plus lead conversion and duplicate checks.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, notFound, now, parseJson, placeholders } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { FIELDS, RECORD_ENTITIES, type CrmEntity, type RecordEntity } from '../../shared/crm/fields';
import { leadScore } from '../../shared/crm/score';
import { fromMinor, toMinor } from '../../shared/crm/money';
import { optionLabel } from '../../shared/crm/defaults';
import { toCsv } from '../../shared/crm/csv';
import { type OrgAccess, assertRecord, canRecord, requireOrg, requirePerm } from './access';
import { ENTITIES, customFields, dealContacts, getRow, listResult, listRows, optionsFor, parseListQuery, tagsFor, toDTOs } from './entities';
import { closeDeal, convertLead, createActivity, createDeal, createRecord, findDuplicates, moveDeal, setState, setTags, updateActivity, updateDeal, updateRecord } from './records';
import { auditStmt } from './util';
import { lineTotal } from '../../shared/crm/money';

export const recordRoutes = new Hono<AppEnv>();

const PATHS: Record<string, CrmEntity> = { leads: 'lead', contacts: 'contact', companies: 'company', deals: 'deal', activities: 'activity' };

async function readJson(c: any): Promise<Record<string, any>> {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    throw badRequest('Request body must be valid JSON');
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw badRequest('Request body must be an object');
  return raw as Record<string, any>;
}

/** A full record for the detail page. */
export async function recordDTO(db: D1Database, a: OrgAccess, entity: CrmEntity, row: any) {
  if (entity === 'deal') {
    const [dto] = await toDTOs(db, a, 'deal', [row]);
    const items = await db.prepare('SELECT * FROM crm_deal_items WHERE org_id = ? AND deal_id = ? ORDER BY position').bind(a.orgId, row.id).all<any>();
    dto.items = items.results.map((i) => ({ id: i.id, productId: i.product_id, name: i.name, quantity: i.quantity_milli / 1000, unitPrice: i.unit_price, discountPct: i.discount_bp / 100, total: lineTotal(i.unit_price, i.quantity_milli, i.discount_bp) }));
    return dto;
  }
  const [dto] = await toDTOs(db, a, entity, [row]);
  return dto;
}

async function loadVisible(c: any, a: OrgAccess, entity: CrmEntity, id: string, opts: { allowDeleted?: boolean } = {}) {
  const row = await getRow(c.env.DB, ENTITIES[entity], a.orgId, id);
  if (!row || (row.deleted_at && !opts.allowDeleted)) throw notFound('Record');
  assertRecord(a, ENTITIES[entity].module, 'view', row);
  return row;
}

for (const [path, entity] of Object.entries(PATHS)) {
  const cfg = ENTITIES[entity];

  recordRoutes.get(`/orgs/:org/${path}`, async (c) => {
    const a = await requireOrg(c);
    const q = parseListQuery(c.req.query('query'), { q: c.req.query('q'), page: c.req.query('page'), pageSize: c.req.query('pageSize') });
    if (q.scope === 'deleted' && a.perms[cfg.module].delete === 'none') throw new HttpError(403, 'You cannot see deleted records');
    return c.json(await listResult(c.env.DB, a, cfg, q));
  });

  recordRoutes.post(`/orgs/:org/${path}`, async (c) => {
    const a = await requireOrg(c);
    await rateLimit(c.env.DB, `crm-write:${a.userId}`, 600, 60_000);
    const input = await readJson(c);
    const row = entity === 'deal' ? await createDeal(c, a, input) : entity === 'activity' ? await createActivity(c, a, input) : await createRecord(c, a, entity, input);
    return c.json(await recordDTO(c.env.DB, a, entity, row), 201);
  });

  // ---------------------------------------------------------------- bulk actions

  recordRoutes.post(`/orgs/:org/${path}/bulk`, async (c) => {
    const a = await requireOrg(c);
    await rateLimit(c.env.DB, `crm-bulk:${a.userId}`, 60, 60_000);
    const input = await body(
      c,
      z.object({
        ids: z.array(z.string().max(64)).min(1).max(500),
        action: z.enum(['assign', 'status', 'priority', 'tag', 'untag', 'archive', 'unarchive', 'delete', 'restore', 'complete']),
        value: z.union([z.string().max(64), z.null()]).optional(),
      }),
    );
    let updated = 0;
    const skipped: { id: string; reason: string }[] = [];
    for (const id of [...new Set(input.ids)]) {
      try {
        switch (input.action) {
          case 'assign': {
            const key = entity === 'activity' ? 'assignedTo' : 'ownerId';
            const patch = { [key]: input.value ?? null };
            if (entity === 'deal') await updateDeal(c, a, id, patch);
            else if (entity === 'activity') await updateActivity(c, a, id, patch);
            else await updateRecord(c, a, entity, id, patch);
            break;
          }
          case 'status':
          case 'priority': {
            if (entity === 'deal' && input.action === 'status') throw badRequest('Use won, lost or reopen for deals');
            const patch = { [input.action]: input.value };
            if (entity === 'deal') await updateDeal(c, a, id, patch);
            else if (entity === 'activity') await updateActivity(c, a, id, patch);
            else await updateRecord(c, a, entity, id, patch);
            break;
          }
          case 'complete':
            if (entity !== 'activity') throw badRequest('Only activities are completed');
            await updateActivity(c, a, id, { status: 'done' });
            break;
          case 'tag':
          case 'untag': {
            if (entity === 'activity') throw badRequest('Activities have no tags');
            if (!input.value) throw badRequest('Choose a tag');
            const row = await getRow(c.env.DB, cfg, a.orgId, id);
            if (!row || row.deleted_at) throw notFound('Record');
            assertRecord(a, cfg.module, 'edit', row);
            const tag = await c.env.DB.prepare('SELECT id FROM crm_tags WHERE org_id = ? AND id = ?').bind(a.orgId, input.value).first();
            if (!tag) throw badRequest('Unknown tag');
            await (input.action === 'tag'
              ? c.env.DB.prepare('INSERT OR IGNORE INTO crm_record_tags (org_id, tag_id, entity, record_id) VALUES (?, ?, ?, ?)').bind(a.orgId, input.value, entity, id)
              : c.env.DB.prepare('DELETE FROM crm_record_tags WHERE org_id = ? AND tag_id = ? AND entity = ? AND record_id = ?').bind(a.orgId, input.value, entity, id)
            ).run();
            break;
          }
          default:
            await setState(c, a, entity, id, input.action as 'archive' | 'unarchive' | 'delete' | 'restore');
        }
        updated++;
      } catch (e) {
        skipped.push({ id, reason: e instanceof HttpError ? e.message : 'Failed' });
      }
    }
    if (input.action === 'delete' && updated) await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'records.bulk_deleted', targetType: entity, metadata: { count: updated }, ip: clientIp(c) }).run();
    return c.json({ updated, skipped });
  });

  // ---------------------------------------------------------------- export

  recordRoutes.get(`/orgs/:org/${path}/export`, async (c) => {
    const a = await requireOrg(c);
    requirePerm(a, cfg.module, 'export', 'You cannot export these records');
    await rateLimit(c.env.DB, `crm-export:${a.userId}`, 20, 60 * 60_000);
    const q = parseListQuery(c.req.query('query'));
    const all: any[] = [];
    for (let page = 1; page <= 50; page++) {
      const r = await listRows(c.env.DB, a, cfg, { ...q, page, pageSize: 200 });
      all.push(...r.rows);
      if (all.length >= r.total || r.rows.length < 200) break;
    }
    const csv = await exportCsv(c.env.DB, a, entity, all);
    await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'records.exported', targetType: entity, metadata: { count: all.length }, ip: clientIp(c) }).run();
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${path}-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  });

  // ---------------------------------------------------------------- import

  if (entity === 'contact' || entity === 'company' || entity === 'lead') {
    recordRoutes.post(`/orgs/:org/${path}/import`, async (c) => {
      const a = await requireOrg(c);
      requirePerm(a, cfg.module, 'import', 'You cannot import these records');
      requirePerm(a, cfg.module, 'create', 'You cannot create these records');
      await rateLimit(c.env.DB, `crm-import:${a.userId}`, 120, 60 * 60_000);
      const input = await body(c, z.object({ rows: z.array(z.record(z.string(), z.unknown())).min(1).max(500), duplicates: z.enum(['skip', 'update', 'create']).default('skip'), createCompanies: z.boolean().default(true) }));
      const result = await importRows(c, a, entity, input.rows, input.duplicates, input.createCompanies);
      await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'records.imported', targetType: entity, metadata: { created: result.created, updated: result.updated, skipped: result.skipped, failed: result.errors.length }, ip: clientIp(c) }).run();
      return c.json(result);
    });
  }

  // ---------------------------------------------------------------- one record (after the fixed paths above)

  recordRoutes.get(`/orgs/:org/${path}/:id`, async (c) => {
    const a = await requireOrg(c);
    const row = await loadVisible(c, a, entity, c.req.param('id'), { allowDeleted: true });
    if (row.deleted_at && !canRecord(a, cfg.module, 'delete', row)) throw notFound('Record');
    return c.json(await recordDTO(c.env.DB, a, entity, row));
  });

  recordRoutes.patch(`/orgs/:org/${path}/:id`, async (c) => {
    const a = await requireOrg(c);
    await rateLimit(c.env.DB, `crm-write:${a.userId}`, 600, 60_000);
    const input = await readJson(c);
    const id = c.req.param('id');
    const row = entity === 'deal' ? await updateDeal(c, a, id, input) : entity === 'activity' ? await updateActivity(c, a, id, input) : await updateRecord(c, a, entity, id, input);
    return c.json(await recordDTO(c.env.DB, a, entity, row));
  });

  recordRoutes.delete(`/orgs/:org/${path}/:id`, async (c) => {
    const a = await requireOrg(c);
    await setState(c, a, entity, c.req.param('id'), 'delete');
    return c.json({ ok: true });
  });

  recordRoutes.post(`/orgs/:org/${path}/:id/restore`, async (c) => {
    const a = await requireOrg(c);
    const row = await setState(c, a, entity, c.req.param('id'), 'restore');
    return c.json(await recordDTO(c.env.DB, a, entity, row));
  });

  if (cfg.hasArchive) {
    recordRoutes.post(`/orgs/:org/${path}/:id/archive`, async (c) => {
      const a = await requireOrg(c);
      const { archived } = await body(c, z.object({ archived: z.boolean() }));
      const row = await setState(c, a, entity, c.req.param('id'), archived ? 'archive' : 'unarchive');
      return c.json(await recordDTO(c.env.DB, a, entity, row));
    });
  }

  if (entity !== 'activity') {
    recordRoutes.put(`/orgs/:org/${path}/:id/tags`, async (c) => {
      const a = await requireOrg(c);
      const { tagIds } = await body(c, z.object({ tagIds: z.array(z.string().max(64)).max(30) }));
      await setTags(c, a, entity as RecordEntity, c.req.param('id'), tagIds);
      return c.json({ ok: true });
    });
  }

}

// ------------------------------------------------------------------ duplicates

recordRoutes.post('/orgs/:org/duplicates', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, z.object({ entity: z.enum(RECORD_ENTITIES as [RecordEntity, ...RecordEntity[]]), excludeId: z.string().max(64).nullable().optional(), probe: z.record(z.string(), z.unknown()) }));
  return c.json(await findDuplicates(c.env.DB, a, input.entity, input.probe, input.excludeId));
});

// ------------------------------------------------------------------ leads

recordRoutes.get('/orgs/:org/leads/:id/score', async (c) => {
  const a = await requireOrg(c);
  const lead = await loadVisible(c, a, 'lead', c.req.param('id'));
  const done = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM crm_activities WHERE org_id = ? AND lead_id = ? AND status = 'done' AND deleted_at IS NULL").bind(a.orgId, lead.id).first<{ n: number }>();
  const kind = a.settings.leadStatuses.find((s) => s.key === lead.status)?.kind ?? 'open';
  return c.json({
    ...leadScore({ email: lead.email, phone: lead.phone, companyName: lead.company_name, jobTitle: lead.job_title, website: lead.website, estimatedValue: lead.estimated_value, source: lead.source, status: lead.status, statusKind: kind, doneActivities: done?.n ?? 0, highValue: a.settings.highValueDeal }),
    locked: !!lead.score_locked,
    stored: lead.score,
  });
});

recordRoutes.get('/orgs/:org/leads/:id/convert-preview', async (c) => {
  const a = await requireOrg(c);
  const lead = await loadVisible(c, a, 'lead', c.req.param('id'));
  const dups = await findDuplicates(c.env.DB, a, 'lead', { email: lead.email, phone: lead.phone, firstName: lead.first_name, lastName: lead.last_name, companyName: lead.company_name, website: lead.website }, lead.id);
  return c.json({ contacts: dups.filter((d) => d.entity === 'contact'), companies: dups.filter((d) => d.entity === 'company') });
});

const convertSchema = z.object({
  contact: z.discriminatedUnion('mode', [z.object({ mode: z.literal('create') }), z.object({ mode: z.literal('existing'), id: z.string().max(64) })]),
  company: z.discriminatedUnion('mode', [z.object({ mode: z.literal('create'), name: z.string().trim().max(200).optional() }), z.object({ mode: z.literal('existing'), id: z.string().max(64) }), z.object({ mode: z.literal('none') })]),
  deal: z.discriminatedUnion('create', [
    z.object({ create: z.literal(false) }),
    z.object({ create: z.literal(true), title: z.string().trim().max(200), value: z.number().int().min(0).max(1e15).nullable().optional(), pipelineId: z.string().max(64).nullable().optional(), stageId: z.string().max(64).nullable().optional(), expectedCloseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional() }),
  ]),
  allowDuplicate: z.boolean().optional(),
});

recordRoutes.post('/orgs/:org/leads/:id/convert', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'contacts', 'create', 'You cannot create contacts');
  const input = await body(c, convertSchema);
  if (input.company.mode === 'create') requirePerm(a, 'companies', 'create', 'You cannot create companies');
  if (input.deal.create) requirePerm(a, 'deals', 'create', 'You cannot create deals');
  return c.json(await convertLead(c, a, c.req.param('id'), input as any));
});

// ------------------------------------------------------------------ deals: board, move, close

/** The pipeline board: open deals of one pipeline by stage, with totals (filters apply). */
recordRoutes.get('/orgs/:org/pipelines/:pid/board', async (c) => {
  const a = await requireOrg(c);
  const pid = c.req.param('pid');
  const p = await c.env.DB.prepare('SELECT id FROM crm_pipelines WHERE org_id = ? AND id = ?').bind(a.orgId, pid).first();
  if (!p) throw notFound('Pipeline');
  const q = parseListQuery(c.req.query('query'), { q: c.req.query('q') });
  const status = c.req.query('status') ?? 'open';
  if (!['open', 'won', 'lost'].includes(status)) throw badRequest('Invalid status');
  const rows = await listRows(c.env.DB, a, ENTITIES.deal, { ...q, filters: [...(q.filters ?? []), { field: 'status', op: 'in', value: [status] }], sort: { field: 'stageId', dir: 'asc' }, page: 1, pageSize: 1000 }, {
    maxPageSize: 1000,
    extraWhere: { sql: 't.pipeline_id = ?', args: [pid] },
  });
  rows.rows.sort((x: any, y: any) => (x.stage_position - y.stage_position) || (x.position - y.position));
  const deals = await toDTOs(c.env.DB, a, 'deal', rows.rows);
  return c.json({ deals, total: rows.total, truncated: rows.total > rows.rows.length });
});

recordRoutes.post('/orgs/:org/deals/:id/move', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, z.object({ stageId: z.string().max(64), beforeId: z.string().max(64).nullable().optional(), afterId: z.string().max(64).nullable().optional() }));
  const row = await moveDeal(c, a, c.req.param('id'), input);
  return c.json(await recordDTO(c.env.DB, a, 'deal', row));
});

recordRoutes.post('/orgs/:org/deals/:id/close', async (c) => {
  const a = await requireOrg(c);
  const input = await body(c, z.object({ outcome: z.enum(['won', 'lost', 'open']), reason: z.string().trim().max(300).optional() }));
  if (input.outcome === 'lost' && !input.reason) throw badRequest('Give a reason the deal was lost');
  const row = await closeDeal(c, a, c.req.param('id'), input.outcome, input.reason ?? '');
  return c.json(await recordDTO(c.env.DB, a, 'deal', row));
});

recordRoutes.get('/orgs/:org/deals/:id/history', async (c) => {
  const a = await requireOrg(c);
  const deal = await loadVisible(c, a, 'deal', c.req.param('id'));
  const rows = await c.env.DB.prepare('SELECT h.*, u.name AS by_name FROM crm_deal_stage_history h LEFT JOIN users u ON u.id = h.moved_by WHERE h.org_id = ? AND h.deal_id = ? ORDER BY h.moved_at').bind(a.orgId, deal.id).all<any>();
  return c.json(
    rows.results.map((h) => ({ id: h.id, fromStage: h.from_stage_name, toStage: h.to_stage_name, fromStatus: h.from_status, toStatus: h.to_status, timeInStageMs: h.time_in_stage_ms, by: h.by_name, at: h.moved_at })),
  );
});

/** Products and services on a deal (replace the whole list). With line items, the deal value is their total. */
recordRoutes.put('/orgs/:org/deals/:id/items', async (c) => {
  const a = await requireOrg(c);
  const deal = await getRow(c.env.DB, ENTITIES.deal, a.orgId, c.req.param('id'));
  if (!deal || deal.deleted_at) throw notFound('Deal');
  assertRecord(a, 'deals', 'edit', deal, 'Deal');
  const { items } = await body(
    c,
    z.object({
      items: z
        .array(z.object({ productId: z.string().max(64).nullable().optional(), name: z.string().trim().min(1).max(200), quantity: z.number().min(0).max(1e9), unitPrice: z.number().int().min(0).max(1e13), discountPct: z.number().min(0).max(100).default(0) }))
        .max(100),
    }),
  );
  const db = c.env.DB;
  for (const it of items) {
    if (it.productId) {
      const p = await db.prepare('SELECT 1 FROM crm_products WHERE org_id = ? AND id = ?').bind(a.orgId, it.productId).first();
      if (!p) throw badRequest('Unknown product');
    }
  }
  const t = now();
  const rows = items.map((it, i) => ({ ...it, quantityMilli: Math.round(it.quantity * 1000), discountBp: Math.round(it.discountPct * 100), position: (i + 1) * 1000 }));
  const total = rows.reduce((s, r) => s + lineTotal(r.unitPrice, r.quantityMilli, r.discountBp), 0);
  const { newId } = await import('../lib/util');
  const { eventStmt } = await import('./util');
  await db.batch([
    db.prepare('DELETE FROM crm_deal_items WHERE org_id = ? AND deal_id = ?').bind(a.orgId, deal.id),
    ...rows.map((r) =>
      db.prepare('INSERT INTO crm_deal_items (id, org_id, deal_id, product_id, name, quantity_milli, unit_price, discount_bp, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.orgId, deal.id, r.productId ?? null, r.name, r.quantityMilli, r.unitPrice, r.discountBp, r.position, t),
    ),
    ...(rows.length ? [db.prepare('UPDATE crm_deals SET value = ?, updated_at = ? WHERE org_id = ? AND id = ?').bind(total, t, a.orgId, deal.id)] : []),
    eventStmt(db, { orgId: a.orgId, type: 'updated', actorId: a.userId, refs: { dealId: deal.id }, summary: rows.length ? `Products and services updated (${rows.length})` : 'Products and services removed' }),
  ]);
  return c.json(await recordDTO(db, a, 'deal', await getRow(db, ENTITIES.deal, a.orgId, deal.id)));
});

/** The contacts on a deal (replace the list). */
recordRoutes.put('/orgs/:org/deals/:id/contacts', async (c) => {
  const a = await requireOrg(c);
  const db = c.env.DB;
  const deal = await getRow(db, ENTITIES.deal, a.orgId, c.req.param('id'));
  if (!deal || deal.deleted_at) throw notFound('Deal');
  assertRecord(a, 'deals', 'edit', deal, 'Deal');
  const { contacts } = await body(c, z.object({ contacts: z.array(z.object({ contactId: z.string().max(64), role: z.string().trim().max(60).default('') })).max(50) }));
  const ids = [...new Set(contacts.map((x) => x.contactId))];
  if (ids.length) {
    const found = await db.prepare(`SELECT id FROM crm_contacts WHERE org_id = ? AND deleted_at IS NULL AND id IN (${placeholders(ids.length)})`).bind(a.orgId, ...ids).all<{ id: string }>();
    if (found.results.length !== ids.length) throw badRequest('A contact you chose was not found');
  }
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM crm_deal_contacts WHERE org_id = ? AND deal_id = ?').bind(a.orgId, deal.id),
    ...ids.map((id, i) => db.prepare('INSERT INTO crm_deal_contacts (org_id, deal_id, contact_id, role, created_at) VALUES (?, ?, ?, ?, ?)').bind(a.orgId, deal.id, id, contacts.find((x) => x.contactId === id)?.role ?? '', t + i)),
    db.prepare('UPDATE crm_deals SET updated_at = ? WHERE org_id = ? AND id = ?').bind(t, a.orgId, deal.id),
  ]);
  return c.json((await dealContacts(db, a.orgId, [deal.id])).get(deal.id) ?? []);
});

// ------------------------------------------------------------------ related lists

/** Contacts of a company; deals of a company or contact. */
recordRoutes.get('/orgs/:org/companies/:id/contacts', async (c) => {
  const a = await requireOrg(c);
  const co = await loadVisible(c, a, 'company', c.req.param('id'));
  return c.json(await listResult(c.env.DB, a, ENTITIES.contact, { filters: [{ field: 'companyId', op: 'in', value: [co.id] }], sort: { field: 'name', dir: 'asc' }, pageSize: 200 }));
});

recordRoutes.get('/orgs/:org/:kind{companies|contacts}/:id/deals', async (c) => {
  const a = await requireOrg(c);
  const kind = c.req.param('kind') === 'companies' ? 'company' : 'contact';
  const rec = await loadVisible(c, a, kind, c.req.param('id'));
  const extraWhere = kind === 'company' ? { sql: 't.company_id = ?', args: [rec.id] } : { sql: 'EXISTS (SELECT 1 FROM crm_deal_contacts dc WHERE dc.org_id = t.org_id AND dc.deal_id = t.id AND dc.contact_id = ?)', args: [rec.id] };
  const r = await listRows(c.env.DB, a, ENTITIES.deal, { scope: 'all', sort: { field: 'updatedAt', dir: 'desc' }, pageSize: 200 }, { extraWhere });
  return c.json({ ...r, rows: await toDTOs(c.env.DB, a, 'deal', r.rows) });
});

/** Activities linked to a record (open first, then by due date). Company activities include its contacts' and deals'. */
recordRoutes.get('/orgs/:org/:kind{leads|contacts|companies|deals}/:id/activities', async (c) => {
  const a = await requireOrg(c);
  const kind = PATHS[c.req.param('kind')] as RecordEntity;
  const rec = await loadVisible(c, a, kind, c.req.param('id'));
  const col = `${kind}_id`;
  const extraWhere =
    kind === 'company'
      ? { sql: '(t.company_id = ? OR t.contact_id IN (SELECT id FROM crm_contacts WHERE org_id = t.org_id AND company_id = ?) OR t.deal_id IN (SELECT id FROM crm_deals WHERE org_id = t.org_id AND company_id = ?))', args: [rec.id, rec.id, rec.id] }
      : { sql: `t.${col} = ?`, args: [rec.id] };
  const r = await listRows(c.env.DB, a, ENTITIES.activity, { sort: { field: 'dueDate', dir: 'asc' }, pageSize: 200 }, { extraWhere });
  const dtos = await toDTOs(c.env.DB, a, 'activity', r.rows);
  dtos.sort((x: any, y: any) => (x.status === 'open' ? 0 : 1) - (y.status === 'open' ? 0 : 1) || (x.status === 'open' ? String(x.dueDate ?? '9').localeCompare(String(y.dueDate ?? '9')) : (y.doneAt ?? y.updatedAt) - (x.doneAt ?? x.updatedAt)));
  return c.json(dtos);
});

// ------------------------------------------------------------------ CSV helpers

async function exportCsv(db: D1Database, a: OrgAccess, entity: CrmEntity, rows: any[]): Promise<string> {
  const fields = FIELDS[entity].filter((f) => !(f.key === 'name' && (entity === 'contact' || entity === 'lead')));
  const cfs = await customFields(db, a.orgId, entity);
  const members = await db.prepare('SELECT u.id, u.name, u.email FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ?').bind(a.orgId).all<{ id: string; name: string; email: string }>();
  const people = new Map(members.results.map((m) => [m.id, m.email]));
  const tags = entity === 'activity' ? new Map() : await tagsFor(db, a.orgId, entity, rows.map((r) => r.id));
  const pipelines = entity === 'deal' ? new Map((await db.prepare('SELECT id, name FROM crm_pipelines WHERE org_id = ?').bind(a.orgId).all<{ id: string; name: string }>()).results.map((p) => [p.id, p.name])) : new Map();
  const header = [...fields.map((f) => f.label), ...(entity === 'activity' ? [] : ['Tags']), ...cfs.map((f) => f.label), 'ID'];
  const out = rows.map((r) => {
    const cells = fields.map((f) => {
      const col = f.key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
      const v = r[col];
      switch (f.type) {
        case 'money':
          return v === null || v === undefined ? '' : fromMinor(v, a.org.currency);
        case 'user':
          return v ? (people.get(v) ?? '') : '';
        case 'company':
          return r.company_name ?? '';
        case 'contact':
          return r.contact_name ?? '';
        case 'deal':
          return r.deal_title ?? '';
        case 'lead':
          return r.lead_name ?? '';
        case 'pipeline':
          return pipelines.get(v) ?? '';
        case 'stage':
          return r.stage_name ?? '';
        case 'datetime':
          return v ? new Date(v).toISOString() : '';
        case 'bool':
          return v ? 'Yes' : 'No';
        case 'enum':
          return optionLabel(optionsFor(f, a.settings), v) || (v ?? '');
        default:
          if (f.key === 'contactCount') return r.contact_count ?? 0;
          if (f.key === 'openDealCount') return r.open_deal_count ?? 0;
          if (f.key === 'weightedValue') return fromMinor(Math.round(((r.value ?? 0) * (r.probability ?? r.stage_probability ?? 0)) / 100), a.org.currency);
          return v ?? '';
      }
    });
    const custom = parseJson<Record<string, unknown>>(r.custom_json, {});
    return [
      ...cells,
      ...(entity === 'activity' ? [] : [(tags.get(r.id) ?? []).map((t: any) => t.name).join('; ')]),
      ...cfs.map((f) => {
        const v = custom[f.id];
        if (v === undefined || v === null) return '';
        if (f.type === 'money') return fromMinor(Number(v), a.org.currency);
        if (Array.isArray(v)) return v.join('; ');
        if (typeof v === 'boolean') return v ? 'Yes' : 'No';
        return String(v);
      }),
      r.id,
    ];
  });
  return toCsv(header, out);
}

/**
 * Import rows already mapped to field keys by the browser (the CSV is read and previewed there). Values are text as in
 * a spreadsheet: amounts in currency units, owners by email or name, companies by name, choices by label or key, tags
 * by name. Duplicates (same email for people, same name or website for companies): skip, update or create.
 */
async function importRows(c: any, a: OrgAccess, entity: 'contact' | 'company' | 'lead', rows: Record<string, unknown>[], mode: 'skip' | 'update' | 'create', createCompanies: boolean) {
  const db = c.env.DB as D1Database;
  const members = await db.prepare('SELECT u.id, u.name, u.email FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ?').bind(a.orgId).all<{ id: string; name: string; email: string }>();
  const person = (v: string) => members.results.find((m) => m.email.toLowerCase() === v.toLowerCase() || m.name.toLowerCase() === v.toLowerCase())?.id;
  const cfs = await customFields(db, a.orgId, entity);
  const tagCache = new Map<string, string>();
  const tagIdFor = async (name: string) => {
    const key = name.trim().toLowerCase();
    if (!key) return null;
    if (tagCache.has(key)) return tagCache.get(key)!;
    let t = await db.prepare('SELECT id FROM crm_tags WHERE org_id = ? AND name = ?').bind(a.orgId, name.trim().slice(0, 40)).first<{ id: string }>();
    if (!t) {
      const { newId } = await import('../lib/util');
      const id = newId();
      await db.prepare('INSERT OR IGNORE INTO crm_tags (id, org_id, name, color, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, a.orgId, name.trim().slice(0, 40), '#0f766e', now()).run();
      t = await db.prepare('SELECT id FROM crm_tags WHERE org_id = ? AND name = ?').bind(a.orgId, name.trim().slice(0, 40)).first<{ id: string }>();
    }
    if (t) tagCache.set(key, t.id);
    return t?.id ?? null;
  };
  const companyCache = new Map<string, string>();
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: { row: number; message: string }[] = [];
  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    try {
      const input: Record<string, any> = {};
      const custom: Record<string, unknown> = {};
      let tagNames: string[] = [];
      for (const [key, value] of Object.entries(raw)) {
        const text = value === null || value === undefined ? '' : String(value).trim();
        if (key === 'tags') {
          tagNames = text.split(/[;,]/).map((s) => s.trim()).filter(Boolean).slice(0, 10);
          continue;
        }
        if (key.startsWith('cf:')) {
          const f = cfs.find((x) => x.id === key.slice(3));
          if (!f || !text) continue;
          if (f.type === 'number') custom[f.id] = Number(text.replace(/,/g, ''));
          else if (f.type === 'money') custom[f.id] = toMinor(text, a.org.currency);
          else if (f.type === 'checkbox') custom[f.id] = /^(yes|true|1|y)$/i.test(text);
          else if (f.type === 'multiselect') custom[f.id] = text.split(/[;,]/).map((s) => s.trim()).filter((s) => f.options.includes(s));
          else custom[f.id] = text;
          continue;
        }
        const def = FIELDS[entity].find((f) => f.key === key);
        if (!def || def.readOnly || def.computed) continue;
        if (!text) continue;
        switch (def.type) {
          case 'money':
            input[key] = toMinor(text.replace(/[^\d.,-]/g, '').replace(/,(?=\d{3}\b)/g, ''), a.org.currency);
            break;
          case 'int':
            input[key] = Math.round(Number(text));
            break;
          case 'user': {
            const id = person(text);
            if (!id) throw new HttpError(400, `${def.label} "${text}" is not a member of this organisation`);
            input[key] = id;
            break;
          }
          case 'company': {
            const k = text.toLowerCase();
            let id = companyCache.get(k) ?? (await db.prepare('SELECT id FROM crm_companies WHERE org_id = ? AND deleted_at IS NULL AND LOWER(name) = ?').bind(a.orgId, k).first<{ id: string }>())?.id;
            if (!id && createCompanies) id = (await createRecord(c, a, 'company', { name: text.slice(0, 200) }, { skipAutomations: true })).id;
            if (id) {
              companyCache.set(k, id);
              input[key] = id;
            }
            break;
          }
          case 'enum': {
            const opts = optionsFor(def, a.settings);
            const match = opts.find((o) => o.key === text || o.label.toLowerCase() === text.toLowerCase());
            input[key] = match ? match.key : text;
            break;
          }
          case 'date': {
            const d = /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text);
            input[key] = typeof d === 'string' ? d : d ? `${d[3]}-${d[2].padStart(2, '0')}-${d[1].padStart(2, '0')}` : text;
            break;
          }
          default:
            input[key] = text;
        }
      }
      if (Object.keys(custom).length) input.custom = custom;
      const tagIds = (await Promise.all(tagNames.map(tagIdFor))).filter((x): x is string => !!x);
      // duplicates
      let existingId: string | null = null;
      if (mode !== 'create') {
        if (entity === 'company') {
          if (input.name) existingId = (await db.prepare('SELECT id FROM crm_companies WHERE org_id = ? AND deleted_at IS NULL AND LOWER(name) = ?').bind(a.orgId, String(input.name).toLowerCase()).first<{ id: string }>())?.id ?? null;
        } else if (input.email) {
          existingId = (await db.prepare(`SELECT id FROM ${ENTITIES[entity].table} WHERE org_id = ? AND deleted_at IS NULL AND email = ?`).bind(a.orgId, String(input.email).toLowerCase()).first<{ id: string }>())?.id ?? null;
        }
      }
      if (existingId && mode === 'skip') {
        skipped++;
        continue;
      }
      if (existingId && mode === 'update') {
        await updateRecord(c, a, entity, existingId, input);
        if (tagIds.length) for (const t of tagIds) await db.prepare('INSERT OR IGNORE INTO crm_record_tags (org_id, tag_id, entity, record_id) VALUES (?, ?, ?, ?)').bind(a.orgId, t, entity, existingId).run();
        updated++;
        continue;
      }
      await createRecord(c, a, entity, input, { skipAutomations: true, tagIds });
      created++;
    } catch (e) {
      errors.push({ row: i + 1, message: e instanceof HttpError || e instanceof Error ? e.message : 'Could not import this row' });
    }
  }
  return { created, updated, skipped, errors: errors.slice(0, 200) };
}
