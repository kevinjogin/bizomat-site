// Writing CRM records: create, update, archive, delete and restore, with their history (crm_events), search text,
// related "last activity" dates, lead scores and the automations they trigger. Routes call these; every function
// takes the caller's OrgAccess and checks the permission it needs.

import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, badRequest, newId, notFound, now, parseJson, placeholders } from '../lib/util';
import { FIELDS, type CrmEntity, type RecordEntity } from '../../shared/crm/fields';
import { leadScore } from '../../shared/crm/score';
import { optionLabel, statusesOfKind } from '../../shared/crm/defaults';
import { type OrgAccess, assertRecord, canRecord, requirePerm } from './access';
import { ENTITIES, checkRefs, customFields, derived, getRow, validateCustom, validateFields, type WriteResult } from './entities';
import { autoCtxFromAccess, dispatchLater } from './automations';
import { eventStmt, fullName, todayIn } from './util';

type C = Context<AppEnv>;

const LABEL: Record<string, string> = Object.fromEntries(Object.values(FIELDS).flatMap((list) => list.map((f) => [f.key, f.label])));

const refsOf = (entity: CrmEntity, id: string) => ({ [`${entity}Id`]: id }) as Record<string, string>;

/** The display name of a stored row. */
export function rowName(entity: CrmEntity, r: Record<string, any>): string {
  if (entity === 'company') return r.name;
  if (entity === 'deal' || entity === 'activity') return r.title;
  return fullName(r.first_name, r.last_name) || r.company_name || r.email || '(no name)';
}

async function memberName(db: D1Database, userId: string | null): Promise<string> {
  if (!userId) return 'nobody';
  const r = await db.prepare('SELECT name FROM users WHERE id = ?').bind(userId).first<{ name: string }>();
  return r?.name ?? 'a former member';
}

/** Contact emails and phones beyond the main ones: [{label, value}], at most ten each. */
function extraList(raw: unknown, kind: 'email' | 'phone'): string {
  if (raw === undefined) return '';
  if (!Array.isArray(raw) || raw.length > 10) throw badRequest(`Give at most ten more ${kind === 'email' ? 'email addresses' : 'phone numbers'}`);
  const out = raw.map((x) => {
    const label = String((x as any)?.label ?? '').trim().slice(0, 30);
    let value = String((x as any)?.value ?? '').trim();
    if (kind === 'email') {
      value = value.toLowerCase();
      if (value && !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(value)) throw badRequest(`${value} is not a valid email address`);
    }
    if (value.length > 320) throw badRequest('That value is too long');
    return { label, value };
  });
  return JSON.stringify(out.filter((x) => x.value));
}

async function companyName(db: D1Database, orgId: string, id: unknown): Promise<string | null> {
  if (!id) return null;
  const r = await db.prepare('SELECT name FROM crm_companies WHERE org_id = ? AND id = ?').bind(orgId, id).first<{ name: string }>();
  return r?.name ?? null;
}

function insertSql(table: string, cols: Record<string, unknown>) {
  const keys = Object.keys(cols);
  return { sql: `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders(keys.length)})`, args: keys.map((k) => cols[k]) };
}

function updateSql(table: string, cols: Record<string, unknown>, orgId: string, id: string) {
  const keys = Object.keys(cols);
  return { sql: `UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE org_id = ? AND id = ?`, args: [...keys.map((k) => cols[k]), orgId, id] };
}

/** History lines for an update: the owner, the status and the other fields that changed. */
async function changeEvents(c: C, a: OrgAccess, entity: CrmEntity, id: string, changes: WriteResult['changes'], customChanged: string[], extraRefs: Record<string, string | null> = {}): Promise<D1PreparedStatement[]> {
  const db = c.env.DB;
  const refs = { ...refsOf(entity, id), ...extraRefs };
  const out: D1PreparedStatement[] = [];
  const rest: string[] = [];
  for (const [key, [before, after]] of Object.entries(changes)) {
    if (key === 'ownerId' || key === 'assignedTo') {
      out.push(eventStmt(db, { orgId: a.orgId, type: 'assigned', actorId: a.userId, refs, summary: `${key === 'ownerId' ? 'Owner' : 'Assignee'} changed to ${await memberName(db, after as string | null)}`, data: { field: key, before, after } }));
    } else if (key === 'status' && entity !== 'deal') {
      const list = entity === 'lead' ? a.settings.leadStatuses : entity === 'contact' ? a.settings.contactStatuses : entity === 'company' ? a.settings.companyStatuses : [];
      const label = (v: unknown) => optionLabel(list, String(v ?? '')) || String(v ?? '');
      out.push(eventStmt(db, { orgId: a.orgId, type: 'status_changed', actorId: a.userId, refs, summary: `Status changed from ${label(before) || 'none'} to ${label(after)}`, data: { before, after } }));
    } else if (key !== 'description') {
      rest.push(LABEL[key] ?? key);
    } else {
      rest.push('Description');
    }
  }
  rest.push(...customChanged);
  if (rest.length) {
    const data: Record<string, unknown> = {};
    for (const [k, [b, af]] of Object.entries(changes)) if (k !== 'description' && k !== 'ownerId' && k !== 'status') data[k] = { before: b, after: af };
    out.push(eventStmt(db, { orgId: a.orgId, type: 'updated', actorId: a.userId, refs, summary: `Updated ${rest.slice(0, 6).join(', ')}${rest.length > 6 ? ` and ${rest.length - 6} more` : ''}`, data }));
  }
  return out;
}

// ------------------------------------------------------------------ contacts, companies, leads

const GENERIC_DEFAULTS: Record<'contact' | 'company' | 'lead', Record<string, unknown>> = {
  contact: { status: 'active', priority: 'medium' },
  company: { status: 'prospect' },
  lead: { status: 'new', priority: 'medium' },
};

export async function createRecord(c: C, a: OrgAccess, entity: 'contact' | 'company' | 'lead', input: Record<string, any>, opts: { skipAutomations?: boolean; tagIds?: string[]; extraCols?: Record<string, unknown> } = {}): Promise<any> {
  const cfg = ENTITIES[entity];
  requirePerm(a, cfg.module, 'create', `You cannot create ${entity === 'company' ? 'companies' : `${entity}s`}`);
  const db = c.env.DB;
  const { emails, phones, custom, tagIds, ...fields } = input;
  const v = validateFields(entity, fields, a.settings, null);
  await checkRefs(db, a, v.refs);
  const cf = validateCustom(await customFields(db, a.orgId, entity), custom, null, true);
  const t = now();
  const id = newId();
  const cols: Record<string, unknown> = { ...GENERIC_DEFAULTS[entity], ...v.cols, id, org_id: a.orgId, custom_json: cf.json, created_by: a.userId, created_at: t, updated_at: t, ...(opts.extraCols ?? {}) };
  // Owner defaults to the person creating the record.
  if (!('owner_id' in cols)) cols.owner_id = a.userId;
  if (entity === 'contact') {
    if (emails !== undefined) cols.emails_json = extraList(emails, 'email');
    if (phones !== undefined) cols.phones_json = extraList(phones, 'phone');
    if (!fullName(cols.first_name as string, cols.last_name as string) && !cols.email) throw badRequest('Give the contact a name or an email address');
  }
  if (entity === 'lead' && !fullName(cols.first_name as string, cols.last_name as string) && !cols.company_name && !cols.email) throw badRequest('Give the lead a name, a company or an email address');
  if (entity === 'company' && !cols.name) throw badRequest('Company name is required');
  Object.assign(cols, derived(entity, { ...cols, company_name: entity === 'contact' ? await companyName(db, a.orgId, cols.company_id) : cols.company_name }));
  if (entity === 'lead' && !cols.score_locked) cols.score = scoreOf(a, cols, 0);
  const ins = insertSql(cfg.table, cols);
  const stmts = [db.prepare(ins.sql).bind(...ins.args), eventStmt(db, { orgId: a.orgId, type: 'created', actorId: a.userId, refs: refsOf(entity, id), summary: `${entity === 'company' ? 'Company' : entity === 'lead' ? 'Lead' : 'Contact'} created`, at: t })];
  const tags = opts.tagIds ?? (Array.isArray(tagIds) ? tagIds : []);
  stmts.push(...(await tagStmts(db, a.orgId, entity, id, tags)));
  if (cols.owner_id && cols.owner_id !== a.userId) stmts.push(eventStmt(db, { orgId: a.orgId, type: 'assigned', actorId: a.userId, refs: refsOf(entity, id), summary: `Owner set to ${await memberName(db, cols.owner_id as string)}`, at: t }));
  await db.batch(stmts);
  const row = await getRow(db, cfg, a.orgId, id);
  if (!opts.skipAutomations) {
    const ctx = autoCtxFromAccess(a);
    if (entity === 'lead') {
      dispatchLater(c, ctx, 'lead.created', 'lead', row, { eventKey: `created:${id}` });
      if (row.owner_id) dispatchLater(c, ctx, 'lead.assigned', 'lead', row, { eventKey: `assigned:${id}:${row.owner_id}:${t}` });
    }
    if (entity === 'contact') dispatchLater(c, ctx, 'contact.created', 'contact', row, { eventKey: `created:${id}` });
  }
  return row;
}

export async function updateRecord(c: C, a: OrgAccess, entity: 'contact' | 'company' | 'lead', id: string, input: Record<string, any>): Promise<any> {
  const cfg = ENTITIES[entity];
  const db = c.env.DB;
  const existing = await getRow(db, cfg, a.orgId, id);
  if (!existing || existing.deleted_at) throw notFound(entity === 'company' ? 'Company' : entity === 'lead' ? 'Lead' : 'Contact');
  assertRecord(a, cfg.module, 'edit', existing, 'Record');
  const { emails, phones, custom, tagIds: _ignored, scoreLocked, ...fields } = input;
  if (entity === 'lead' && 'status' in fields && fields.status === 'converted' && existing.status !== 'converted') throw badRequest('Use "Convert" to convert a lead');
  if (entity === 'lead' && existing.status === 'converted' && 'status' in fields && fields.status !== 'converted') throw badRequest('A converted lead keeps its status');
  const v = validateFields(entity, fields, a.settings, existing);
  await checkRefs(db, a, v.refs);
  const cf = custom !== undefined ? validateCustom(await customFields(db, a.orgId, entity), custom, existing.custom_json, false) : { json: existing.custom_json, changed: [] };
  const cols: Record<string, unknown> = { ...v.cols };
  if (cf.changed.length) cols.custom_json = cf.json;
  if (entity === 'contact') {
    if (emails !== undefined) {
      const j = extraList(emails, 'email');
      if (j !== existing.emails_json) {
        cols.emails_json = j;
        v.changes.emails = [null, null];
      }
    }
    if (phones !== undefined) {
      const j = extraList(phones, 'phone');
      if (j !== existing.phones_json) {
        cols.phones_json = j;
        v.changes.phones = [null, null];
      }
    }
  }
  if (entity === 'lead' && typeof scoreLocked === 'boolean' && scoreLocked !== !!existing.score_locked) cols.score_locked = scoreLocked ? 1 : 0;
  if (!Object.keys(cols).length) return existing;
  const merged = { ...existing, ...cols };
  if (entity === 'contact' && 'company_id' in cols) merged.company_name = await companyName(db, a.orgId, cols.company_id);
  Object.assign(cols, derived(entity, merged), { updated_at: now() });
  if (entity === 'lead' && !(merged.score_locked ?? 0) && !('score' in v.cols)) cols.score = scoreOf(a, merged, await doneActivities(db, a.orgId, 'lead', id));
  if (entity === 'lead' && 'score' in v.cols && !('score_locked' in cols)) cols.score_locked = 1;
  if (entity === 'lead' && 'status' in v.cols && a.settings.leadStatuses.find((s) => s.key === v.cols.status)?.kind !== 'unqualified') cols.unqualified_reason = '';
  const up = updateSql(cfg.table, cols, a.orgId, id);
  await db.batch([db.prepare(up.sql).bind(...up.args), ...(await changeEvents(c, a, entity, id, v.changes, cf.changed))]);
  const row = await getRow(db, cfg, a.orgId, id);
  const ctx = autoCtxFromAccess(a);
  if (entity === 'lead' && 'ownerId' in v.changes && row.owner_id) dispatchLater(c, ctx, 'lead.assigned', 'lead', row, { eventKey: `assigned:${id}:${row.owner_id}:${row.updated_at}` });
  if (entity === 'lead' && 'status' in v.changes) dispatchLater(c, ctx, 'lead.status_changed', 'lead', row, { eventKey: `status:${id}:${row.status}:${row.updated_at}` });
  return row;
}

// ------------------------------------------------------------------ lead score

export function scoreOf(a: OrgAccess, r: Record<string, any>, done: number): number {
  const kind = a.settings.leadStatuses.find((s) => s.key === r.status)?.kind ?? 'open';
  return leadScore({
    email: r.email ?? '',
    phone: r.phone ?? '',
    companyName: r.company_name ?? '',
    jobTitle: r.job_title ?? '',
    website: r.website ?? '',
    estimatedValue: r.estimated_value ?? null,
    source: r.source ?? '',
    status: r.status ?? '',
    statusKind: kind,
    doneActivities: done,
    highValue: a.settings.highValueDeal,
  }).score;
}

async function doneActivities(db: D1Database, orgId: string, entity: 'lead', id: string): Promise<number> {
  const r = await db.prepare(`SELECT COUNT(*) AS n FROM crm_activities WHERE org_id = ? AND ${entity}_id = ? AND status = 'done' AND deleted_at IS NULL`).bind(orgId, id).first<{ n: number }>();
  return r?.n ?? 0;
}

export async function rescoreLead(db: D1Database, a: OrgAccess, leadId: string | null | undefined) {
  if (!leadId) return;
  const lead = await db.prepare('SELECT * FROM crm_leads WHERE org_id = ? AND id = ?').bind(a.orgId, leadId).first<any>();
  if (!lead || lead.score_locked) return;
  const score = scoreOf(a, lead, await doneActivities(db, a.orgId, 'lead', leadId));
  if (score !== lead.score) await db.prepare('UPDATE crm_leads SET score = ? WHERE org_id = ? AND id = ?').bind(score, a.orgId, leadId).run();
}

// ------------------------------------------------------------------ tags

export async function tagStmts(db: D1Database, orgId: string, entity: RecordEntity, recordId: string, tagIds: unknown[]): Promise<D1PreparedStatement[]> {
  const ids = [...new Set(tagIds.map(String))].slice(0, 30);
  if (!ids.length) return [];
  const found = await db.prepare(`SELECT id FROM crm_tags WHERE org_id = ? AND id IN (${placeholders(ids.length)})`).bind(orgId, ...ids).all<{ id: string }>();
  if (found.results.length !== ids.length) throw badRequest('Unknown tag');
  return ids.map((tagId) => db.prepare('INSERT OR IGNORE INTO crm_record_tags (org_id, tag_id, entity, record_id) VALUES (?, ?, ?, ?)').bind(orgId, tagId, entity, recordId));
}

export async function setTags(c: C, a: OrgAccess, entity: RecordEntity, id: string, tagIds: string[]) {
  const db = c.env.DB;
  const cfg = ENTITIES[entity];
  const row = await getRow(db, cfg, a.orgId, id);
  if (!row || row.deleted_at) throw notFound('Record');
  assertRecord(a, cfg.module, 'edit', row);
  await db.batch([
    db.prepare('DELETE FROM crm_record_tags WHERE org_id = ? AND entity = ? AND record_id = ?').bind(a.orgId, entity, id),
    ...(await tagStmts(db, a.orgId, entity, id, tagIds)),
    db.prepare(`UPDATE ${cfg.table} SET updated_at = ? WHERE org_id = ? AND id = ?`).bind(now(), a.orgId, id),
  ]);
}

// ------------------------------------------------------------------ archive, delete, restore

export async function setState(c: C, a: OrgAccess, entity: CrmEntity, id: string, action: 'archive' | 'unarchive' | 'delete' | 'restore') {
  const db = c.env.DB;
  const cfg = ENTITIES[entity];
  const row = await getRow(db, cfg, a.orgId, id);
  if (!row) throw notFound('Record');
  if (action === 'restore') {
    if (!row.deleted_at) return row;
    if (!canRecord(a, cfg.module, 'delete', row)) throw notFound('Record');
  } else {
    if (row.deleted_at) throw notFound('Record');
    assertRecord(a, cfg.module, action === 'delete' ? 'delete' : 'edit', row);
  }
  if ((action === 'archive' || action === 'unarchive') && !cfg.hasArchive) throw badRequest('Activities are completed or deleted, not archived');
  const t = now();
  const set = action === 'archive' ? 'archived_at = ?' : action === 'unarchive' ? 'archived_at = NULL' : action === 'delete' ? 'deleted_at = ?' : 'deleted_at = NULL';
  const args = action === 'archive' || action === 'delete' ? [t] : [];
  const summary = { archive: 'Archived', unarchive: 'Taken out of the archive', delete: 'Deleted', restore: 'Restored' }[action];
  const refs = entity === 'activity' ? { contactId: row.contact_id, companyId: row.company_id, dealId: row.deal_id, leadId: row.lead_id } : refsOf(entity, id);
  await db.batch([
    db.prepare(`UPDATE ${cfg.table} SET ${set}, updated_at = ? WHERE org_id = ? AND id = ?`).bind(...args, t, a.orgId, id),
    eventStmt(db, { orgId: a.orgId, type: action, actorId: a.userId, refs, summary: entity === 'activity' ? `${summary}: ${row.title}` : summary }),
  ]);
  return getRow(db, cfg, a.orgId, id);
}

// ------------------------------------------------------------------ deals

export async function stageOf(db: D1Database, orgId: string, stageId: string) {
  return db.prepare('SELECT s.*, p.archived_at AS pipeline_archived FROM crm_stages s JOIN crm_pipelines p ON p.id = s.pipeline_id WHERE s.org_id = ? AND s.id = ?').bind(orgId, stageId).first<{ id: string; pipeline_id: string; name: string; probability: number; position: number; pipeline_archived: number | null }>();
}

async function firstStage(db: D1Database, orgId: string, pipelineId?: string | null) {
  const pid =
    pipelineId ??
    (await db.prepare('SELECT id FROM crm_pipelines WHERE org_id = ? AND archived_at IS NULL ORDER BY is_default DESC, position LIMIT 1').bind(orgId).first<{ id: string }>())?.id;
  if (!pid) throw new HttpError(409, 'Create a pipeline first');
  const p = await db.prepare('SELECT id, archived_at FROM crm_pipelines WHERE org_id = ? AND id = ?').bind(orgId, pid).first<{ id: string; archived_at: number | null }>();
  if (!p) throw badRequest('Unknown pipeline');
  if (p.archived_at) throw badRequest('That pipeline is archived');
  const s = await db.prepare('SELECT * FROM crm_stages WHERE org_id = ? AND pipeline_id = ? ORDER BY position LIMIT 1').bind(orgId, pid).first<any>();
  if (!s) throw new HttpError(409, 'That pipeline has no stages');
  return s as { id: string; pipeline_id: string; name: string; probability: number };
}

async function bottomPosition(db: D1Database, orgId: string, stageId: string): Promise<number> {
  const r = await db.prepare("SELECT MAX(position) AS p FROM crm_deals WHERE org_id = ? AND stage_id = ? AND status = 'open'").bind(orgId, stageId).first<{ p: number | null }>();
  return (r?.p ?? 0) + 1000;
}

function historyStmt(db: D1Database, h: { orgId: string; dealId: string; pipelineId: string; from?: { id: string; name: string } | null; to?: { id: string; name: string } | null; fromStatus: string | null; toStatus: string; since: number | null; by: string }) {
  const t = now();
  return db
    .prepare('INSERT INTO crm_deal_stage_history (id, org_id, deal_id, pipeline_id, from_stage_id, from_stage_name, to_stage_id, to_stage_name, from_status, to_status, time_in_stage_ms, moved_by, moved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), h.orgId, h.dealId, h.pipelineId, h.from?.id ?? null, h.from?.name ?? null, h.to?.id ?? null, h.to?.name ?? null, h.fromStatus, h.toStatus, h.since === null ? null : t - h.since, h.by, t);
}

export async function createDeal(c: C, a: OrgAccess, input: Record<string, any>, opts: { skipAutomations?: boolean; extraCols?: Record<string, unknown>; contactIds?: string[] } = {}) {
  requirePerm(a, 'deals', 'create', 'You cannot create deals');
  const db = c.env.DB;
  const { custom, tagIds, contactIds, pipelineId, stageId, ...fields } = input;
  const v = validateFields('deal', fields, a.settings, null);
  await checkRefs(db, a, v.refs);
  const stage = stageId ? await stageOf(db, a.orgId, String(stageId)) : await firstStage(db, a.orgId, pipelineId ? String(pipelineId) : null);
  if (!stage) throw badRequest('Unknown stage');
  if (pipelineId && stage.pipeline_id !== pipelineId) throw badRequest('That stage is not in that pipeline');
  if ((stage as any).pipeline_archived) throw badRequest('That pipeline is archived');
  const cf = validateCustom(await customFields(db, a.orgId, 'deal'), custom, null, true);
  const t = now();
  const id = newId();
  const cols: Record<string, unknown> = {
    priority: 'medium',
    value: 0,
    ...v.cols,
    id,
    org_id: a.orgId,
    pipeline_id: stage.pipeline_id,
    stage_id: stage.id,
    currency: a.org.currency,
    status: 'open',
    custom_json: cf.json,
    position: await bottomPosition(db, a.orgId, stage.id),
    stage_entered_at: t,
    created_by: a.userId,
    created_at: t,
    updated_at: t,
    ...(opts.extraCols ?? {}),
  };
  if (cols.value === null) cols.value = 0;
  if (!('owner_id' in cols)) cols.owner_id = a.userId;
  if (!cols.title) throw badRequest('Give the deal a title');
  Object.assign(cols, derived('deal', { ...cols, company_name: await companyName(db, a.orgId, cols.company_id) }));
  const contacts = [...new Set((opts.contactIds ?? (Array.isArray(contactIds) ? contactIds : [])).map(String))].slice(0, 50);
  for (const cid of contacts) await checkRefs(db, a, [{ field: 'contact', type: 'contact', id: cid }]);
  const ins = insertSql('crm_deals', cols);
  await db.batch([
    db.prepare(ins.sql).bind(...ins.args),
    ...contacts.map((cid) => db.prepare('INSERT INTO crm_deal_contacts (org_id, deal_id, contact_id, created_at) VALUES (?, ?, ?, ?)').bind(a.orgId, id, cid, t)),
    ...(await tagStmts(db, a.orgId, 'deal', id, Array.isArray(tagIds) ? tagIds : [])),
    historyStmt(db, { orgId: a.orgId, dealId: id, pipelineId: stage.pipeline_id, from: null, to: stage, fromStatus: null, toStatus: 'open', since: null, by: a.userId }),
    eventStmt(db, { orgId: a.orgId, type: 'created', actorId: a.userId, refs: { dealId: id, companyId: (cols.company_id as string) ?? null }, summary: `Deal created in ${stage.name}`, at: t }),
  ]);
  const row = await getRow(db, ENTITIES.deal, a.orgId, id);
  if (!opts.skipAutomations) dispatchLater(c, autoCtxFromAccess(a), 'deal.created', 'deal', row, { eventKey: `created:${id}` });
  return row;
}

export async function updateDeal(c: C, a: OrgAccess, id: string, input: Record<string, any>) {
  const db = c.env.DB;
  const existing = await getRow(db, ENTITIES.deal, a.orgId, id);
  if (!existing || existing.deleted_at) throw notFound('Deal');
  assertRecord(a, 'deals', 'edit', existing, 'Deal');
  const { custom, tagIds: _t, contactIds: _c, pipelineId, stageId, ...fields } = input;
  const v = validateFields('deal', fields, a.settings, existing);
  await checkRefs(db, a, v.refs);
  const cf = custom !== undefined ? validateCustom(await customFields(db, a.orgId, 'deal'), custom, existing.custom_json, false) : { json: existing.custom_json, changed: [] };
  const cols: Record<string, unknown> = { ...v.cols };
  if (cols.value === null) cols.value = 0;
  if ('flagged' in cols && !cols.flagged) cols.flag_reason = '';
  if (cf.changed.length) cols.custom_json = cf.json;
  const stmts: D1PreparedStatement[] = [];
  let moved: { id: string; name: string; pipeline_id: string } | null = null;
  if ((stageId && stageId !== existing.stage_id) || (pipelineId && pipelineId !== existing.pipeline_id)) {
    const target = stageId ? await stageOf(db, a.orgId, String(stageId)) : await firstStage(db, a.orgId, String(pipelineId));
    if (!target) throw badRequest('Unknown stage');
    if (pipelineId && target.pipeline_id !== pipelineId) throw badRequest('That stage is not in that pipeline');
    moved = target;
    Object.assign(cols, { pipeline_id: target.pipeline_id, stage_id: target.id, stage_entered_at: now(), position: await bottomPosition(db, a.orgId, target.id) });
    stmts.push(
      historyStmt(db, { orgId: a.orgId, dealId: id, pipelineId: target.pipeline_id, from: { id: existing.stage_id, name: existing.stage_name }, to: target, fromStatus: existing.status, toStatus: existing.status, since: existing.stage_entered_at, by: a.userId }),
      eventStmt(db, { orgId: a.orgId, type: 'stage_changed', actorId: a.userId, refs: { dealId: id }, summary: `Moved from ${existing.stage_name || 'a removed stage'} to ${target.name}`, data: { from: existing.stage_id, to: target.id } }),
    );
  }
  if (!Object.keys(cols).length) return existing;
  const merged = { ...existing, ...cols };
  if ('company_id' in cols) merged.company_name = await companyName(db, a.orgId, cols.company_id);
  Object.assign(cols, derived('deal', merged), { updated_at: now() });
  const up = updateSql('crm_deals', cols, a.orgId, id);
  await db.batch([db.prepare(up.sql).bind(...up.args), ...stmts, ...(await changeEvents(c, a, 'deal', id, v.changes, cf.changed))]);
  const row = await getRow(db, ENTITIES.deal, a.orgId, id);
  if (moved) dispatchLater(c, autoCtxFromAccess(a), 'deal.stage_changed', 'deal', row, { eventKey: `stage:${id}:${moved.id}:${row.stage_entered_at}`, toStageId: moved.id, stageName: moved.name });
  return row;
}

/** Drag and drop: a deal to a stage (any pipeline), between two neighbours. Only one row changes. */
export async function moveDeal(c: C, a: OrgAccess, id: string, to: { stageId: string; beforeId?: string | null; afterId?: string | null }) {
  const db = c.env.DB;
  const deal = await getRow(db, ENTITIES.deal, a.orgId, id);
  if (!deal || deal.deleted_at) throw notFound('Deal');
  assertRecord(a, 'deals', 'edit', deal, 'Deal');
  const stage = await stageOf(db, a.orgId, to.stageId);
  if (!stage) throw badRequest('Unknown stage');
  if (stage.pipeline_archived) throw badRequest('That pipeline is archived');
  const neighbour = async (nid?: string | null) =>
    nid ? db.prepare('SELECT position FROM crm_deals WHERE org_id = ? AND id = ? AND stage_id = ?').bind(a.orgId, nid, stage.id).first<{ position: number }>() : null;
  const before = await neighbour(to.beforeId); // the card above the drop point
  const after = await neighbour(to.afterId); // the card below
  let position: number;
  if (before && after) position = (before.position + after.position) / 2;
  else if (before) position = before.position + 1000;
  else if (after) position = after.position - 1000;
  else position = await bottomPosition(db, a.orgId, stage.id);
  const t = now();
  const changedStage = stage.id !== deal.stage_id;
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(`UPDATE crm_deals SET stage_id = ?, pipeline_id = ?, position = ?, updated_at = ?${changedStage ? ', stage_entered_at = ?' : ''} WHERE org_id = ? AND id = ?`)
      .bind(...[stage.id, stage.pipeline_id, position, t, ...(changedStage ? [t] : []), a.orgId, id]),
  ];
  if (changedStage) {
    stmts.push(
      historyStmt(db, { orgId: a.orgId, dealId: id, pipelineId: stage.pipeline_id, from: { id: deal.stage_id, name: deal.stage_name }, to: stage, fromStatus: deal.status, toStatus: deal.status, since: deal.stage_entered_at, by: a.userId }),
      eventStmt(db, { orgId: a.orgId, type: 'stage_changed', actorId: a.userId, refs: { dealId: id }, summary: `Moved from ${deal.stage_name || 'a removed stage'} to ${stage.name}`, data: { from: deal.stage_id, to: stage.id } }),
    );
  }
  await db.batch(stmts);
  const row = await getRow(db, ENTITIES.deal, a.orgId, id);
  if (changedStage) dispatchLater(c, autoCtxFromAccess(a), 'deal.stage_changed', 'deal', row, { eventKey: `stage:${id}:${stage.id}:${t}`, toStageId: stage.id, stageName: stage.name });
  return row;
}

export async function closeDeal(c: C, a: OrgAccess, id: string, outcome: 'won' | 'lost' | 'open', reason = '') {
  const db = c.env.DB;
  const deal = await getRow(db, ENTITIES.deal, a.orgId, id);
  if (!deal || deal.deleted_at) throw notFound('Deal');
  assertRecord(a, 'deals', 'edit', deal, 'Deal');
  if (deal.status === outcome) return deal;
  const t = now();
  const cols =
    outcome === 'won'
      ? { status: 'won', won_at: t, lost_at: null, lost_reason: '', flagged: 0, flag_reason: '' }
      : outcome === 'lost'
        ? { status: 'lost', lost_at: t, won_at: null, lost_reason: reason.slice(0, 300), flagged: 0, flag_reason: '' }
        : { status: 'open', won_at: null, lost_at: null, lost_reason: '', position: await bottomPosition(db, a.orgId, deal.stage_id) };
  const up = updateSql('crm_deals', { ...cols, updated_at: t }, a.orgId, id);
  const summary = outcome === 'won' ? 'Deal won' : outcome === 'lost' ? `Deal lost${reason ? `: ${optionLabel(a.settings.lostReasons, reason) || reason}` : ''}` : 'Deal reopened';
  await db.batch([
    db.prepare(up.sql).bind(...up.args),
    historyStmt(db, { orgId: a.orgId, dealId: id, pipelineId: deal.pipeline_id, from: { id: deal.stage_id, name: deal.stage_name }, to: { id: deal.stage_id, name: deal.stage_name }, fromStatus: deal.status, toStatus: outcome, since: deal.stage_entered_at, by: a.userId }),
    eventStmt(db, { orgId: a.orgId, type: outcome === 'open' ? 'reopened' : outcome, actorId: a.userId, refs: { dealId: id }, summary }),
  ]);
  const row = await getRow(db, ENTITIES.deal, a.orgId, id);
  if (outcome !== 'open') dispatchLater(c, autoCtxFromAccess(a), 'deal.closed', 'deal', row, { eventKey: `closed:${id}:${outcome}:${t}`, outcome });
  return row;
}

// ------------------------------------------------------------------ activities

const INTERACTIONS = new Set(['call', 'email', 'meeting', 'visit', 'demo', 'presentation', 'appointment']);

/** Activities keep the "last activity" of the records they are linked to, and contacts their "last contacted". */
async function touchRelated(db: D1Database, a: OrgAccess, row: Record<string, any>) {
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const [col, table] of [
    ['contact_id', 'crm_contacts'],
    ['company_id', 'crm_companies'],
    ['deal_id', 'crm_deals'],
    ['lead_id', 'crm_leads'],
  ] as const) {
    if (row[col]) stmts.push(db.prepare(`UPDATE ${table} SET last_activity_at = ? WHERE org_id = ? AND id = ?`).bind(t, a.orgId, row[col]));
  }
  if (row.contact_id && row.status === 'done' && INTERACTIONS.has(row.type)) stmts.push(db.prepare('UPDATE crm_contacts SET last_contacted_at = ? WHERE org_id = ? AND id = ?').bind(row.done_at ?? t, a.orgId, row.contact_id));
  if (stmts.length) await db.batch(stmts);
  await rescoreLead(db, a, row.lead_id);
}

/** A deal's company follows the deal when the activity names only the deal; a contact's company likewise. */
async function fillRefs(db: D1Database, orgId: string, cols: Record<string, unknown>) {
  if (cols.deal_id && !cols.company_id) {
    const d = await db.prepare('SELECT company_id FROM crm_deals WHERE org_id = ? AND id = ?').bind(orgId, cols.deal_id).first<{ company_id: string | null }>();
    if (d?.company_id) cols.company_id = d.company_id;
  }
  if (cols.contact_id && !cols.company_id) {
    const ct = await db.prepare('SELECT company_id FROM crm_contacts WHERE org_id = ? AND id = ?').bind(orgId, cols.contact_id).first<{ company_id: string | null }>();
    if (ct?.company_id) cols.company_id = ct.company_id;
  }
}

function activityStatusCols(status: unknown, existing: Record<string, any> | null, userId: string): Record<string, unknown> {
  if (status === undefined || (existing && existing.status === status)) return {};
  if (status === 'done') return { done_at: now(), done_by: userId };
  return { done_at: null, done_by: null };
}

export async function createActivity(c: C, a: OrgAccess, input: Record<string, any>, opts: { email?: { direction: 'outbound' | 'inbound'; to: string; delivery?: string | null } } = {}) {
  requirePerm(a, 'activities', 'create', 'You cannot create activities');
  const db = c.env.DB;
  const v = validateFields('activity', input, a.settings, null);
  await checkRefs(db, a, v.refs);
  const t = now();
  const id = newId();
  const cols: Record<string, unknown> = { type: 'task', priority: 'medium', status: 'open', ...v.cols, id, org_id: a.orgId, created_by: a.userId, created_at: t, updated_at: t };
  if (!cols.title) throw badRequest('Give the activity a title');
  if (!('assigned_to' in cols)) cols.assigned_to = a.userId;
  Object.assign(cols, activityStatusCols(cols.status, null, a.userId));
  if (opts.email) Object.assign(cols, { email_direction: opts.email.direction, email_to: opts.email.to.slice(0, 500), email_delivery: opts.email.delivery ?? null });
  await fillRefs(db, a.orgId, cols);
  Object.assign(cols, derived('activity', cols));
  const typeLabel = optionLabel(a.settings.activityTypes, cols.type as string) || 'Activity';
  const ins = insertSql('crm_activities', cols);
  await db.batch([db.prepare(ins.sql).bind(...ins.args)]);
  const row = await getRow(db, ENTITIES.activity, a.orgId, id);
  await touchRelated(db, a, row);
  if (row.assigned_to) dispatchLater(c, autoCtxFromAccess(a), 'activity.assigned', 'activity', row, { eventKey: `assigned:${id}:${row.assigned_to}` });
  void typeLabel;
  return row;
}

export async function updateActivity(c: C, a: OrgAccess, id: string, input: Record<string, any>) {
  const db = c.env.DB;
  const existing = await getRow(db, ENTITIES.activity, a.orgId, id);
  if (!existing || existing.deleted_at) throw notFound('Activity');
  // The person assigned can always complete or reopen their own activity.
  const onlyStatus = Object.keys(input).every((k) => k === 'status' || k === 'outcome');
  if (!(onlyStatus && existing.assigned_to === a.userId)) assertRecord(a, 'activities', 'edit', existing, 'Activity');
  const v = validateFields('activity', input, a.settings, existing);
  await checkRefs(db, a, v.refs);
  const cols: Record<string, unknown> = { ...v.cols, ...activityStatusCols(v.cols.status, existing, a.userId) };
  if (!Object.keys(cols).length) return existing;
  if ('deal_id' in cols || 'contact_id' in cols) {
    const merged = { ...existing, ...cols };
    if (!('company_id' in cols)) merged.company_id = null;
    await fillRefs(db, a.orgId, merged);
    if (merged.company_id !== existing.company_id && !('company_id' in v.cols)) cols.company_id = merged.company_id;
  }
  Object.assign(cols, derived('activity', { ...existing, ...cols }), { updated_at: now() });
  const up = updateSql('crm_activities', cols, a.orgId, id);
  const stmts = [db.prepare(up.sql).bind(...up.args)];
  if (v.cols.status === 'done') stmts.push(eventStmt(db, { orgId: a.orgId, type: 'completed', actorId: a.userId, refs: { contactId: existing.contact_id, companyId: existing.company_id, dealId: existing.deal_id, leadId: existing.lead_id }, summary: `Completed: ${existing.title}` }));
  await db.batch(stmts);
  const row = await getRow(db, ENTITIES.activity, a.orgId, id);
  await touchRelated(db, a, row);
  if ('assignedTo' in v.changes && row.assigned_to) dispatchLater(c, autoCtxFromAccess(a), 'activity.assigned', 'activity', row, { eventKey: `assigned:${id}:${row.assigned_to}:${row.updated_at}` });
  return row;
}

// ------------------------------------------------------------------ lead conversion

export interface ConvertInput {
  contact: { mode: 'create' } | { mode: 'existing'; id: string };
  company: { mode: 'create'; name?: string } | { mode: 'existing'; id: string } | { mode: 'none' };
  deal: { create: false } | { create: true; title: string; value?: number | null; pipelineId?: string | null; stageId?: string | null; expectedCloseDate?: string | null };
  /** Create even when a contact with the same email already exists. */
  allowDuplicate?: boolean;
}

/**
 * Convert a lead into a contact (new or existing), optionally a company (new or existing) and a deal, in one step.
 * A lead converts once; an exact email match blocks a second contact unless the person confirms (allowDuplicate).
 */
export async function convertLead(c: C, a: OrgAccess, leadId: string, input: ConvertInput) {
  const db = c.env.DB;
  const lead = await getRow(db, ENTITIES.lead, a.orgId, leadId);
  if (!lead || lead.deleted_at) throw notFound('Lead');
  assertRecord(a, 'leads', 'edit', lead, 'Lead');
  if (lead.converted_at) throw new HttpError(409, 'This lead has already been converted');
  const owner = lead.owner_id ?? a.userId;
  // Company
  let companyId: string | null = null;
  if (input.company.mode === 'existing') {
    const co = await getRow(db, ENTITIES.company, a.orgId, input.company.id);
    if (!co || co.deleted_at) throw badRequest('The company you chose was not found');
    companyId = co.id;
  }
  // Contact
  let contactId: string | null = null;
  if (input.contact.mode === 'existing') {
    const ct = await getRow(db, ENTITIES.contact, a.orgId, input.contact.id);
    if (!ct || ct.deleted_at) throw badRequest('The contact you chose was not found');
    contactId = ct.id;
  } else if (lead.email && !input.allowDuplicate) {
    const dup = await db.prepare('SELECT id FROM crm_contacts WHERE org_id = ? AND deleted_at IS NULL AND email = ?').bind(a.orgId, lead.email).first<{ id: string }>();
    if (dup) throw new HttpError(409, 'A contact with this email address already exists. Choose it, or confirm that you want a second one.', { code: 'DUPLICATE_CONTACT', contactId: dup.id });
  }
  if (input.company.mode === 'create') {
    const name = (input.company.name ?? lead.company_name ?? '').trim();
    if (!name) throw badRequest('Give the company a name');
    const co = await createRecord(c, a, 'company', { name, website: lead.website || '', industry: lead.industry || '', country: lead.country || '', ownerId: owner }, { skipAutomations: true });
    companyId = co.id;
  }
  if (!contactId) {
    const ct = await createRecord(
      c,
      a,
      'contact',
      { firstName: lead.first_name, lastName: lead.last_name, jobTitle: lead.job_title, email: lead.email, phone: lead.phone, website: lead.website, country: lead.country, source: lead.source, ownerId: owner, companyId, description: lead.description },
      { extraCols: { lead_id: lead.id } },
    );
    contactId = ct.id;
  } else if (companyId) {
    const ct = await db.prepare('SELECT company_id FROM crm_contacts WHERE org_id = ? AND id = ?').bind(a.orgId, contactId).first<{ company_id: string | null }>();
    if (ct && !ct.company_id) await db.prepare('UPDATE crm_contacts SET company_id = ?, updated_at = ? WHERE org_id = ? AND id = ?').bind(companyId, now(), a.orgId, contactId).run();
  }
  let dealId: string | null = null;
  if (input.deal.create) {
    const d = await createDeal(
      c,
      a,
      { title: input.deal.title || `${lead.company_name || rowName('lead', lead)} deal`, value: input.deal.value ?? lead.estimated_value ?? 0, pipelineId: input.deal.pipelineId ?? undefined, stageId: input.deal.stageId ?? undefined, expectedCloseDate: input.deal.expectedCloseDate ?? null, companyId, ownerId: owner, source: lead.source },
      { extraCols: { lead_id: lead.id }, contactIds: contactId ? [contactId] : [] },
    );
    dealId = d.id;
  }
  const t = now();
  const converted = statusesOfKind(a.settings, 'converted')[0] ?? 'converted';
  await db.batch([
    db.prepare('UPDATE crm_leads SET status = ?, converted_at = ?, converted_by = ?, contact_id = ?, company_id = ?, deal_id = ?, updated_at = ? WHERE org_id = ? AND id = ? AND converted_at IS NULL').bind(converted, t, a.userId, contactId, companyId, dealId, t, a.orgId, leadId),
    // The lead's activities, notes and files now also show on the contact.
    db.prepare('UPDATE crm_activities SET contact_id = COALESCE(contact_id, ?), company_id = COALESCE(company_id, ?), deal_id = COALESCE(deal_id, ?) WHERE org_id = ? AND lead_id = ?').bind(contactId, companyId, dealId, a.orgId, leadId),
    eventStmt(db, { orgId: a.orgId, type: 'converted', actorId: a.userId, refs: { leadId, contactId, companyId, dealId }, summary: `Lead converted${dealId ? ' with a deal' : ''}`, at: t }),
  ]);
  return { leadId, contactId, companyId, dealId };
}

/** Records that look like the same person or company (email, phone, name, website), for warnings and conversion. */
export async function findDuplicates(db: D1Database, a: OrgAccess, entity: RecordEntity, probe: Record<string, any>, excludeId?: string | null) {
  const out: { entity: RecordEntity; id: string; name: string; detail: string; reason: string }[] = [];
  const add = (e: RecordEntity, rows: any[], reason: string) => {
    for (const r of rows) {
      if (r.id === excludeId) continue;
      const seen = out.find((x) => x.id === r.id);
      if (seen) {
        // One entry per record, with every reason it matched.
        if (!seen.reason.toLowerCase().includes(reason.toLowerCase())) seen.reason += `, ${reason.charAt(0).toLowerCase()}${reason.slice(1)}`;
        continue;
      }
      if (!canRecord(a, ENTITIES[e].module, 'view', r)) continue;
      out.push({ entity: e, id: r.id, name: rowName(e, r), detail: r.email || r.website || r.company_name || '', reason });
    }
  };
  const email = String(probe.email ?? '').trim().toLowerCase();
  const digits = String(probe.phone ?? probe.mobile ?? '').replace(/\D/g, '');
  const name = fullName(probe.firstName, probe.lastName).toLowerCase();
  if (entity === 'contact' || entity === 'lead') {
    for (const e of ['contact', 'lead'] as const) {
      const table = ENTITIES[e].table;
      if (email) add(e, (await db.prepare(`SELECT * FROM ${table} WHERE org_id = ? AND deleted_at IS NULL AND email = ? LIMIT 5`).bind(a.orgId, email).all<any>()).results, 'Same email address');
      if (digits.length >= 6) add(e, (await db.prepare(`SELECT * FROM ${table} WHERE org_id = ? AND deleted_at IS NULL AND phone_keys LIKE ? LIMIT 5`).bind(a.orgId, `% ${digits.slice(-9)} %`).all<any>()).results, 'Same phone number');
      if (name.length >= 3) add(e, (await db.prepare(`SELECT * FROM ${table} WHERE org_id = ? AND deleted_at IS NULL AND LOWER(TRIM(first_name || ' ' || last_name)) = ? LIMIT 5`).bind(a.orgId, name).all<any>()).results, 'Same name');
    }
  }
  if (entity === 'company' || (entity === 'lead' && probe.companyName)) {
    const coName = String(entity === 'company' ? (probe.name ?? '') : probe.companyName).trim().toLowerCase();
    const domain = String(probe.website ?? '').trim() ? (await import('./util')).domainOf(String(probe.website)) : '';
    if (coName) add('company', (await db.prepare('SELECT * FROM crm_companies WHERE org_id = ? AND deleted_at IS NULL AND LOWER(name) = ? LIMIT 5').bind(a.orgId, coName).all<any>()).results, 'Same company name');
    if (domain) add('company', (await db.prepare('SELECT * FROM crm_companies WHERE org_id = ? AND deleted_at IS NULL AND domain = ? LIMIT 5').bind(a.orgId, domain).all<any>()).results, 'Same website');
  }
  return out.slice(0, 20);
}

export { todayIn, parseJson };
