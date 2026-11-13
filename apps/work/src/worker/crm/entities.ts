// The record engine of the CRM: for each record type, how its fields map to SQL, how a list is filtered, sorted and
// paged on the server, how input is validated, and how a row becomes the API's shape.
//
// Safety: a filter or sort names a field key; the key is looked up in FIELDS (src/shared/crm/fields.ts) or in the
// organisation's own custom fields, and only the SQL written here is used. Values are always bound parameters.
// Every query starts with `t.org_id = ?` and the caller's visibility scope (access.ts scopeSql).

import { HttpError, badRequest, parseJson, placeholders } from '../lib/util';
import { FIELDS, MAX_PAGE_SIZE, VALUELESS_OPS, customFieldFilterType, opsFor, type CrmEntity, type FieldDef, type FieldType, type FilterCond, type ListQuery, type RecordEntity } from '../../shared/crm/fields';
import { ACTIVITY_STATUSES, COMPANY_SIZES, DEAL_STATUSES, PRIORITIES, type ListOption, type OrgSettings } from '../../shared/crm/defaults';
import type { RecordModule } from '../../shared/crm/roles';
import type { ActivityDTO, CompanyDTO, ContactDTO, CustomFieldDTO, DealDTO, LeadDTO, ListResult, TagDTO } from '../../shared/crm/types';
import { weighted } from '../../shared/crm/money';
import { type OrgAccess, canRecord, scopeSql } from './access';
import { DATE_RE, TIME_RE, addDays, domainOf, todayIn } from './util';

export interface EntityConfig {
  entity: CrmEntity;
  table: string;
  module: RecordModule;
  /** SELECT list (t is the record). */
  select: string;
  joins: string;
  hasArchive: boolean;
  /** Field key -> SQL expression, for filters, sorts and columns. */
  expr: Record<string, string>;
}

const snake = (k: string) => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

function baseExpr(entity: CrmEntity): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of FIELDS[entity]) if (!f.computed || f.key === 'createdAt' || f.key === 'updatedAt') out[f.key] = `t.${snake(f.key)}`;
  for (const f of FIELDS[entity]) if (f.computed && !out[f.key] && !['name', 'contactCount', 'openDealCount', 'weightedValue'].includes(f.key)) out[f.key] = `t.${snake(f.key)}`;
  return out;
}

const PERSON_NAME = "TRIM(t.first_name || ' ' || t.last_name)";

export const ENTITIES: Record<CrmEntity, EntityConfig> = {
  contact: {
    entity: 'contact',
    table: 'crm_contacts',
    module: 'contacts',
    select: 't.*, co.name AS company_name',
    joins: 'LEFT JOIN crm_companies co ON co.org_id = t.org_id AND co.id = t.company_id',
    hasArchive: true,
    expr: { ...baseExpr('contact'), name: PERSON_NAME, companyId: 't.company_id' },
  },
  company: {
    entity: 'company',
    table: 'crm_companies',
    module: 'companies',
    select:
      "t.*, (SELECT COUNT(*) FROM crm_contacts x WHERE x.org_id = t.org_id AND x.company_id = t.id AND x.deleted_at IS NULL) AS contact_count, (SELECT COUNT(*) FROM crm_deals d WHERE d.org_id = t.org_id AND d.company_id = t.id AND d.deleted_at IS NULL AND d.status = 'open') AS open_deal_count",
    joins: '',
    hasArchive: true,
    expr: {
      ...baseExpr('company'),
      contactCount: '(SELECT COUNT(*) FROM crm_contacts x WHERE x.org_id = t.org_id AND x.company_id = t.id AND x.deleted_at IS NULL)',
      openDealCount: "(SELECT COUNT(*) FROM crm_deals d WHERE d.org_id = t.org_id AND d.company_id = t.id AND d.deleted_at IS NULL AND d.status = 'open')",
    },
  },
  lead: {
    entity: 'lead',
    table: 'crm_leads',
    module: 'leads',
    select: 't.*',
    joins: '',
    hasArchive: true,
    expr: { ...baseExpr('lead'), name: PERSON_NAME },
  },
  deal: {
    entity: 'deal',
    table: 'crm_deals',
    module: 'deals',
    select: 't.*, s.name AS stage_name, s.probability AS stage_probability, s.position AS stage_position, co.name AS company_name',
    joins: 'LEFT JOIN crm_stages s ON s.org_id = t.org_id AND s.id = t.stage_id LEFT JOIN crm_companies co ON co.org_id = t.org_id AND co.id = t.company_id',
    hasArchive: true,
    expr: { ...baseExpr('deal'), weightedValue: '(t.value * COALESCE(t.probability, s.probability, 0) / 100)' },
  },
  activity: {
    entity: 'activity',
    table: 'crm_activities',
    module: 'activities',
    select:
      "t.*, TRIM(ct.first_name || ' ' || ct.last_name) AS contact_name, co.name AS company_name, d.title AS deal_title, TRIM(l.first_name || ' ' || l.last_name) AS lead_name",
    joins:
      'LEFT JOIN crm_contacts ct ON ct.org_id = t.org_id AND ct.id = t.contact_id LEFT JOIN crm_companies co ON co.org_id = t.org_id AND co.id = t.company_id LEFT JOIN crm_deals d ON d.org_id = t.org_id AND d.id = t.deal_id LEFT JOIN crm_leads l ON l.org_id = t.org_id AND l.id = t.lead_id',
    hasArchive: false,
    expr: baseExpr('activity'),
  },
};

/** Sort expressions where the plain column is not what people expect. */
const SORT_EXPR: Partial<Record<CrmEntity, Record<string, string>>> = {
  contact: { name: `LOWER(${PERSON_NAME})`, companyId: 'LOWER(co.name)' },
  lead: { name: `LOWER(${PERSON_NAME})` },
  company: { name: 'LOWER(t.name)' },
  deal: { stageId: 's.position', companyId: 'LOWER(co.name)', title: 'LOWER(t.title)' },
  activity: { title: 'LOWER(t.title)' },
};

// ------------------------------------------------------------------ custom fields

export interface CustomFieldRow {
  id: string;
  org_id: string;
  entity: RecordEntity;
  label: string;
  type: CustomFieldDTO['type'];
  options_json: string;
  required: number;
  position: number;
  archived_at: number | null;
}

export function customFieldDTO(r: CustomFieldRow): CustomFieldDTO {
  return { id: r.id, entity: r.entity, label: r.label, type: r.type, options: parseJson<string[]>(r.options_json, []), required: !!r.required, position: r.position, archived: !!r.archived_at };
}

export async function customFields(db: D1Database, orgId: string, entity: CrmEntity, includeArchived = false): Promise<CustomFieldDTO[]> {
  if (entity === 'activity') return [];
  const rows = await db
    .prepare(`SELECT * FROM crm_custom_fields WHERE org_id = ? AND entity = ?${includeArchived ? '' : ' AND archived_at IS NULL'} ORDER BY position`)
    .bind(orgId, entity)
    .all<CustomFieldRow>();
  return rows.results.map(customFieldDTO);
}

const CF_ID = /^[A-Za-z0-9_-]{6,40}$/;

// ------------------------------------------------------------------ lists of options

export function optionsFor(def: Pick<FieldDef, 'list'>, settings: OrgSettings): ListOption[] {
  switch (def.list) {
    case 'priorities':
      return PRIORITIES;
    case 'companySizes':
      return COMPANY_SIZES;
    case 'dealStatuses':
      return DEAL_STATUSES;
    case 'activityStatuses':
      return ACTIVITY_STATUSES;
    case undefined:
      return [];
    default:
      return settings[def.list];
  }
}

/** Lists whose values must be one of the options; the others (sources, industries) also take free text. */
const STRICT_LISTS = new Set(['leadStatuses', 'contactStatuses', 'companyStatuses', 'priorities', 'companySizes', 'activityTypes', 'dealStatuses', 'activityStatuses']);

// ------------------------------------------------------------------ list queries

interface Built {
  where: string[];
  args: unknown[];
}

function resolveUserValue(v: unknown, a: OrgAccess): unknown {
  return v === 'me' ? a.userId : v;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v.slice(0, 200) : v === undefined || v === null || v === '' ? [] : [v];
}

function dateValue(v: unknown, today: string): string {
  const s = v === 'today' ? today : String(v ?? '');
  if (!DATE_RE.test(s)) throw badRequest('A date filter needs a date (YYYY-MM-DD)');
  return s;
}

function days(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 3650) throw badRequest('Enter a number of days between 0 and 3650');
  return Math.round(n);
}

/** One condition as SQL. `type` is the field's type; `expr` its SQL expression. */
function condSql(expr: string, type: FieldType, cond: FilterCond, a: OrgAccess, today: string, multi = false): { sql: string; args: unknown[] } {
  const { op } = cond;
  if (!opsFor(type).includes(op) && !(multi && (op === 'in' || op === 'not_in'))) throw badRequest(`The filter "${op}" does not apply to this field`);
  const v = cond.value;
  const str = () => String(v ?? '').toLowerCase().slice(0, 200);
  const num = () => {
    const n = Number(v);
    if (!Number.isFinite(n)) throw badRequest('Enter a number');
    return n;
  };
  const isText = ['text', 'longtext', 'email', 'url', 'phone', 'time'].includes(type);
  const emptySql = isText || type === 'enum' ? `COALESCE(${expr}, '') = ''` : `${expr} IS NULL`;
  switch (op) {
    case 'empty':
      return { sql: multi ? `COALESCE(json_array_length(${expr}), 0) = 0` : emptySql, args: [] };
    case 'not_empty':
      return { sql: multi ? `COALESCE(json_array_length(${expr}), 0) > 0` : `NOT (${emptySql})`, args: [] };
    case 'contains':
      return { sql: `LOWER(COALESCE(${expr}, '')) LIKE ? ESCAPE '\\'`, args: [`%${escapeLike(str())}%`] };
    case 'not_contains':
      return { sql: `LOWER(COALESCE(${expr}, '')) NOT LIKE ? ESCAPE '\\'`, args: [`%${escapeLike(str())}%`] };
    case 'starts_with':
      return { sql: `LOWER(COALESCE(${expr}, '')) LIKE ? ESCAPE '\\'`, args: [`${escapeLike(str())}%`] };
    case 'eq':
      return isText ? { sql: `LOWER(COALESCE(${expr}, '')) = ?`, args: [str()] } : { sql: `${expr} = ?`, args: [num()] };
    case 'neq':
      return isText ? { sql: `LOWER(COALESCE(${expr}, '')) != ?`, args: [str()] } : { sql: `(${expr} IS NULL OR ${expr} != ?)`, args: [num()] };
    case 'gt':
      return { sql: `${expr} > ?`, args: [num()] };
    case 'gte':
      return { sql: `${expr} >= ?`, args: [num()] };
    case 'lt':
      return { sql: `${expr} < ?`, args: [num()] };
    case 'lte':
      return { sql: `${expr} <= ?`, args: [num()] };
    case 'in':
    case 'not_in': {
      const vals = asArray(v).map((x) => (type === 'user' ? resolveUserValue(x, a) : x)).map((x) => String(x).slice(0, 100));
      if (!vals.length) return { sql: op === 'in' ? '0' : '1', args: [] };
      const inner = multi ? `EXISTS (SELECT 1 FROM json_each(${expr}) j WHERE j.value IN (${placeholders(vals.length)}))` : `${expr} IN (${placeholders(vals.length)})`;
      return op === 'in' ? { sql: inner, args: vals } : { sql: multi ? `NOT ${inner}` : `(${expr} IS NULL OR ${expr} NOT IN (${placeholders(vals.length)}))`, args: vals };
    }
    case 'on':
      return { sql: `${expr} = ?`, args: [dateValue(v, today)] };
    case 'before':
      if (type === 'datetime') return { sql: `${expr} < ?`, args: [Date.parse(`${dateValue(v, today)}T00:00:00Z`)] };
      return { sql: `${expr} < ?`, args: [dateValue(v, today)] };
    case 'after':
      if (type === 'datetime') return { sql: `${expr} >= ?`, args: [Date.parse(`${dateValue(v, today)}T00:00:00Z`) + 86_400_000] };
      return { sql: `${expr} > ?`, args: [dateValue(v, today)] };
    case 'last_days':
      if (type === 'datetime') return { sql: `${expr} >= ?`, args: [Date.now() - days(v) * 86_400_000] };
      return { sql: `${expr} BETWEEN ? AND ?`, args: [addDays(today, -days(v)), today] };
    case 'next_days':
      return { sql: `${expr} BETWEEN ? AND ?`, args: [today, addDays(today, days(v))] };
    case 'overdue':
      return { sql: `${expr} < ?`, args: [today] };
    case 'is_true':
      return { sql: `COALESCE(${expr}, 0) IN (1, 'true')`, args: [] };
    case 'is_false':
      return { sql: `COALESCE(${expr}, 0) NOT IN (1, 'true')`, args: [] };
    default:
      throw badRequest('Unknown filter');
  }
}

export function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (m) => `\\${m}`);
}

/** One filter condition of a list as SQL; the field must be a defined field, "tag" or a custom field of this organisation. */
function filterSql(cfg: EntityConfig, f: FilterCond, a: OrgAccess, today: string, cfs: CustomFieldDTO[]): { sql: string; args: unknown[] } {
  if (!f || typeof f.field !== 'string' || typeof f.op !== 'string') throw badRequest('Invalid filter');
  if (!VALUELESS_OPS.has(f.op) && f.value === undefined) throw badRequest('A filter needs a value');
  if (f.field === 'tag') {
    if (cfg.entity === 'activity') throw badRequest('Activities have no tags');
    const ids = asArray(f.value).map((x) => String(x).slice(0, 64));
    if (f.op !== 'has' && f.op !== 'has_not') throw badRequest('Use "has tag" or "does not have tag"');
    if (!ids.length) return { sql: '1', args: [] };
    const inner = `EXISTS (SELECT 1 FROM crm_record_tags rt WHERE rt.org_id = t.org_id AND rt.entity = '${cfg.entity}' AND rt.record_id = t.id AND rt.tag_id IN (${placeholders(ids.length)}))`;
    return { sql: f.op === 'has' ? inner : `NOT ${inner}`, args: ids };
  }
  if (f.field.startsWith('cf:')) {
    const id = f.field.slice(3);
    const cf = CF_ID.test(id) ? cfs.find((x) => x.id === id) : undefined;
    if (!cf) throw badRequest('Unknown custom field');
    return condSql(`json_extract(t.custom_json, '$."${id}"')`, customFieldFilterType(cf.type), f, a, today, cf.type === 'multiselect');
  }
  const def = FIELDS[cfg.entity].find((d) => d.key === f.field && !d.formOnly);
  const expr = def ? cfg.expr[def.key] : undefined;
  if (!def || !expr) throw badRequest(`Unknown field ${f.field}`);
  return condSql(expr, def.type, f, a, today);
}

/** The WHERE conditions of a list (organisation, state, visibility, search and filters). */
export async function buildWhere(db: D1Database, a: OrgAccess, cfg: EntityConfig, q: ListQuery): Promise<Built> {
  const where = ['t.org_id = ?'];
  const args: unknown[] = [a.orgId];
  const scope = q.scope ?? 'active';
  if (scope === 'deleted') where.push('t.deleted_at IS NOT NULL');
  else where.push('t.deleted_at IS NULL');
  if (cfg.hasArchive) {
    if (scope === 'active') where.push('t.archived_at IS NULL');
    if (scope === 'archived') where.push('t.archived_at IS NOT NULL');
  }
  const vis = scopeSql(a, cfg.module, 't', scope === 'deleted' ? 'delete' : 'view');
  where.push(vis.sql);
  args.push(...vis.args);
  const words = (q.q ?? '').toLowerCase().trim().split(/\s+/).filter(Boolean).slice(0, 8);
  for (const w of words) {
    where.push("t.search_text LIKE ? ESCAPE '\\'");
    args.push(`%${escapeLike(w.slice(0, 60))}%`);
  }
  const filters = (q.filters ?? []).slice(0, 25);
  const anyOf = Array.isArray(q.anyOf) ? q.anyOf.slice(0, 25) : [];
  if (filters.length || anyOf.length) {
    const today = todayIn(a.org.timezone);
    const cfs = [...filters, ...anyOf].some((f) => typeof f?.field === 'string' && f.field.startsWith('cf:')) ? await customFields(db, a.orgId, cfg.entity, true) : [];
    const group = (list: FilterCond[], joiner: ' AND ' | ' OR ') => {
      const parts: string[] = [];
      for (const f of list) {
        const built = filterSql(cfg, f, a, today, cfs);
        parts.push(built.sql);
        args.push(...built.args);
      }
      if (parts.length) where.push(`(${parts.join(joiner)})`);
    };
    group(filters, q.match === 'any' ? ' OR ' : ' AND ');
    group(anyOf, ' OR ');
  }
  return { where, args };
}

export function orderBy(cfg: EntityConfig, sort: ListQuery['sort']): string {
  const dir = sort?.dir === 'asc' ? 'ASC' : 'DESC';
  const key = sort?.field ?? 'updatedAt';
  const def = FIELDS[cfg.entity].find((d) => d.key === key && !d.formOnly);
  const expr = (def && (SORT_EXPR[cfg.entity]?.[key] ?? cfg.expr[key])) || (/^cf:[A-Za-z0-9_-]{6,40}$/.test(key) ? `json_extract(t.custom_json, '$."${key.slice(3)}"')` : 't.updated_at');
  // Empty values last in both directions, then a stable order.
  return `ORDER BY (${expr}) IS NULL, ${expr} ${dir}, t.id ${dir}`;
}

export function parseListQuery(raw: string | undefined | null, extra: Record<string, string | undefined> = {}): ListQuery {
  let q: ListQuery = {};
  if (raw) {
    try {
      q = JSON.parse(raw) as ListQuery;
    } catch {
      throw badRequest('Invalid list query');
    }
  }
  if (extra.q !== undefined) q.q = extra.q;
  if (extra.page) q.page = Number(extra.page);
  if (extra.pageSize) q.pageSize = Number(extra.pageSize);
  if (q.filters && !Array.isArray(q.filters)) throw badRequest('Filters must be a list');
  if (q.anyOf && !Array.isArray(q.anyOf)) throw badRequest('Filters must be a list');
  if (q.scope && !['active', 'archived', 'deleted', 'all'].includes(q.scope)) throw badRequest('Invalid scope');
  return q;
}

export async function listRows<T = any>(db: D1Database, a: OrgAccess, cfg: EntityConfig, q: ListQuery, opts: { maxPageSize?: number; extraWhere?: { sql: string; args: unknown[] } } = {}): Promise<{ rows: T[]; total: number; page: number; pageSize: number }> {
  const built = await buildWhere(db, a, cfg, q);
  if (opts.extraWhere) {
    built.where.push(opts.extraWhere.sql);
    built.args.push(...opts.extraWhere.args);
  }
  const max = opts.maxPageSize ?? MAX_PAGE_SIZE;
  const pageSize = Math.max(1, Math.min(max, Math.round(Number(q.pageSize) || 50)));
  const page = Math.max(1, Math.round(Number(q.page) || 1));
  const whereSql = built.where.join(' AND ');
  const [count, rows] = await Promise.all([
    db.prepare(`SELECT COUNT(*) AS n FROM ${cfg.table} t ${cfg.joins} WHERE ${whereSql}`).bind(...built.args).first<{ n: number }>(),
    db
      .prepare(`SELECT ${cfg.select} FROM ${cfg.table} t ${cfg.joins} WHERE ${whereSql} ${orderBy(cfg, q.sort)} LIMIT ? OFFSET ?`)
      .bind(...built.args, pageSize, (page - 1) * pageSize)
      .all<T>(),
  ]);
  return { rows: rows.results, total: count?.n ?? 0, page, pageSize };
}

export async function getRow<T = any>(db: D1Database, cfg: EntityConfig, orgId: string, id: string): Promise<T | null> {
  if (typeof id !== 'string' || id.length > 64) return null;
  return db.prepare(`SELECT ${cfg.select} FROM ${cfg.table} t ${cfg.joins} WHERE t.org_id = ? AND t.id = ?`).bind(orgId, id).first<T>();
}

// ------------------------------------------------------------------ tags

export async function tagsFor(db: D1Database, orgId: string, entity: CrmEntity, ids: string[]): Promise<Map<string, TagDTO[]>> {
  const out = new Map<string, TagDTO[]>();
  if (!ids.length || entity === 'activity') return out;
  for (let i = 0; i < ids.length; i += 90) {
    const part = ids.slice(i, i + 90);
    const rows = await db
      .prepare(`SELECT rt.record_id, g.id, g.name, g.color FROM crm_record_tags rt JOIN crm_tags g ON g.id = rt.tag_id WHERE rt.org_id = ? AND rt.entity = ? AND rt.record_id IN (${placeholders(part.length)}) ORDER BY g.name COLLATE NOCASE`)
      .bind(orgId, entity, ...part)
      .all<{ record_id: string; id: string; name: string; color: string }>();
    for (const r of rows.results) {
      const list = out.get(r.record_id) ?? [];
      list.push({ id: r.id, name: r.name, color: r.color });
      out.set(r.record_id, list);
    }
  }
  return out;
}

// ------------------------------------------------------------------ rows to DTOs

const ref = (id: string | null, name: string | null | undefined) => (id ? { id, name: name || '(no name)' } : null);

function base(a: OrgAccess, module: RecordModule, r: any, tags: TagDTO[]) {
  return {
    id: r.id,
    ownerId: r.owner_id ?? null,
    tags,
    custom: parseJson<Record<string, unknown>>(r.custom_json, {}),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    createdBy: r.created_by ?? null,
    archivedAt: r.archived_at ?? null,
    deletedAt: r.deleted_at ?? null,
    can: { edit: canRecord(a, module, 'edit', r), delete: canRecord(a, module, 'delete', r) },
  };
}

export function contactDTO(a: OrgAccess, r: any, tags: TagDTO[] = []): ContactDTO {
  return {
    ...base(a, 'contacts', r, tags),
    name: `${r.first_name} ${r.last_name}`.trim() || r.email || '(no name)',
    firstName: r.first_name,
    lastName: r.last_name,
    jobTitle: r.job_title,
    email: r.email,
    emails: parseJson(r.emails_json, []),
    phone: r.phone,
    mobile: r.mobile,
    phones: parseJson(r.phones_json, []),
    companyId: r.company_id,
    company: ref(r.company_id, r.company_name),
    website: r.website,
    address: r.address,
    city: r.city,
    region: r.region,
    postcode: r.postcode,
    country: r.country,
    source: r.source,
    status: r.status,
    priority: r.priority,
    description: r.description,
    avatarUrl: r.avatar_key ? `/api/crm/orgs/${r.org_id}/contacts/${r.id}/avatar?v=${String(r.avatar_key).slice(-8)}` : null,
    lastContactedAt: r.last_contacted_at,
    nextFollowUp: r.next_follow_up,
    leadId: r.lead_id,
  };
}

export function companyDTO(a: OrgAccess, r: any, tags: TagDTO[] = []): CompanyDTO {
  return {
    ...base(a, 'companies', r, tags),
    name: r.name,
    website: r.website,
    domain: r.domain,
    industry: r.industry,
    size: r.size,
    annualRevenue: r.annual_revenue,
    phone: r.phone,
    email: r.email,
    address: r.address,
    city: r.city,
    region: r.region,
    postcode: r.postcode,
    country: r.country,
    status: r.status,
    description: r.description,
    logoUrl: r.logo_key ? `/api/crm/orgs/${r.org_id}/companies/${r.id}/logo?v=${String(r.logo_key).slice(-8)}` : null,
    contactCount: r.contact_count ?? 0,
    openDealCount: r.open_deal_count ?? 0,
    lastActivityAt: r.last_activity_at,
  };
}

export function leadDTO(a: OrgAccess, r: any, tags: TagDTO[] = []): LeadDTO {
  return {
    ...base(a, 'leads', r, tags),
    name: `${r.first_name} ${r.last_name}`.trim() || r.company_name || r.email || '(no name)',
    firstName: r.first_name,
    lastName: r.last_name,
    companyName: r.company_name,
    jobTitle: r.job_title,
    email: r.email,
    phone: r.phone,
    website: r.website,
    country: r.country,
    industry: r.industry,
    source: r.source,
    status: r.status,
    score: r.score,
    scoreLocked: !!r.score_locked,
    estimatedValue: r.estimated_value,
    priority: r.priority,
    description: r.description,
    followUpDate: r.follow_up_date,
    unqualifiedReason: r.unqualified_reason,
    convertedAt: r.converted_at,
    contactId: r.contact_id,
    companyId: r.company_id,
    dealId: r.deal_id,
    lastActivityAt: r.last_activity_at,
  };
}

export function dealDTO(a: OrgAccess, r: any, tags: TagDTO[] = [], extra: { contacts?: DealDTO['contacts']; items?: DealDTO['items'] } = {}): DealDTO {
  const p = r.probability ?? r.stage_probability ?? 0;
  const effective = r.status === 'won' ? 100 : r.status === 'lost' ? 0 : p;
  return {
    ...base(a, 'deals', r, tags),
    title: r.title,
    value: r.value,
    currency: r.currency,
    pipelineId: r.pipeline_id,
    stageId: r.stage_id,
    stageName: r.stage_name ?? '',
    status: r.status,
    probability: r.probability,
    effectiveProbability: effective,
    weightedValue: weighted(r.value, effective),
    expectedCloseDate: r.expected_close_date,
    companyId: r.company_id,
    company: ref(r.company_id, r.company_name),
    contacts: extra.contacts ?? [],
    leadId: r.lead_id,
    priority: r.priority,
    source: r.source,
    competitors: r.competitors,
    lostReason: r.lost_reason,
    description: r.description,
    flagged: !!r.flagged,
    flagReason: r.flag_reason,
    wonAt: r.won_at,
    lostAt: r.lost_at,
    stageEnteredAt: r.stage_entered_at,
    position: r.position,
    items: extra.items ?? [],
    lastActivityAt: r.last_activity_at,
  };
}

export function activityDTO(a: OrgAccess, r: any, today = todayIn(a.org.timezone)): ActivityDTO {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.description,
    assignedTo: r.assigned_to,
    dueDate: r.due_date,
    dueTime: r.due_time,
    durationMin: r.duration_min,
    priority: r.priority,
    status: r.status,
    doneAt: r.done_at,
    outcome: r.outcome,
    location: r.location,
    emailDirection: r.email_direction,
    emailTo: r.email_to,
    emailDelivery: r.email_delivery,
    contact: ref(r.contact_id, r.contact_name),
    company: ref(r.company_id, r.company_name),
    deal: ref(r.deal_id, r.deal_title),
    lead: ref(r.lead_id, r.lead_name),
    pmItem: r.pm_item_id ? { workspaceId: r.pm_workspace_id, itemId: r.pm_item_id } : null,
    createdBy: r.created_by,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    overdue: r.status === 'open' && !!r.due_date && r.due_date < today,
    can: { edit: canRecord(a, 'activities', 'edit', r), delete: canRecord(a, 'activities', 'delete', r) },
  };
}

export async function toDTOs(db: D1Database, a: OrgAccess, entity: CrmEntity, rows: any[]): Promise<any[]> {
  if (entity === 'activity') {
    const today = todayIn(a.org.timezone);
    return rows.map((r) => activityDTO(a, r, today));
  }
  const tags = await tagsFor(db, a.orgId, entity, rows.map((r) => r.id));
  if (entity === 'deal') {
    const contacts = await dealContacts(db, a.orgId, rows.map((r) => r.id));
    return rows.map((r) => dealDTO(a, r, tags.get(r.id) ?? [], { contacts: contacts.get(r.id) ?? [] }));
  }
  const map = entity === 'contact' ? contactDTO : entity === 'company' ? companyDTO : leadDTO;
  return rows.map((r) => map(a, r, tags.get(r.id) ?? []));
}

export async function dealContacts(db: D1Database, orgId: string, dealIds: string[]): Promise<Map<string, DealDTO['contacts']>> {
  const out = new Map<string, DealDTO['contacts']>();
  for (let i = 0; i < dealIds.length; i += 90) {
    const part = dealIds.slice(i, i + 90);
    if (!part.length) continue;
    const rows = await db
      .prepare(
        `SELECT dc.deal_id, dc.contact_id, dc.role, TRIM(c.first_name || ' ' || c.last_name) AS name, c.email FROM crm_deal_contacts dc JOIN crm_contacts c ON c.org_id = dc.org_id AND c.id = dc.contact_id
         WHERE dc.org_id = ? AND c.deleted_at IS NULL AND dc.deal_id IN (${placeholders(part.length)}) ORDER BY dc.created_at`,
      )
      .bind(orgId, ...part)
      .all<{ deal_id: string; contact_id: string; role: string; name: string; email: string }>();
    for (const r of rows.results) {
      const list = out.get(r.deal_id) ?? [];
      list.push({ id: r.contact_id, name: r.name || r.email || '(no name)', role: r.role });
      out.set(r.deal_id, list);
    }
  }
  return out;
}

export async function listResult(db: D1Database, a: OrgAccess, cfg: EntityConfig, q: ListQuery): Promise<ListResult<any>> {
  const r = await listRows(db, a, cfg, q);
  return { ...r, rows: await toDTOs(db, a, cfg.entity, r.rows) };
}

// ------------------------------------------------------------------ input validation

export interface WriteResult {
  /** column -> value */
  cols: Record<string, unknown>;
  /** field key -> [before, after], for history */
  changes: Record<string, [unknown, unknown]>;
}

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

/**
 * Validate the built-in fields of `input` for an entity and return the columns to write. Unknown keys are refused;
 * read-only fields are refused. References (owner, company, contact, deal, lead) are checked against this
 * organisation by the caller (refsToCheck), because they need the database.
 */
export function validateFields(entity: CrmEntity, input: Record<string, unknown>, settings: OrgSettings, existing: Record<string, unknown> | null, skip: string[] = []): WriteResult & { refs: { field: string; type: FieldType; id: string }[] } {
  const cols: Record<string, unknown> = {};
  const changes: Record<string, [unknown, unknown]> = {};
  const refs: { field: string; type: FieldType; id: string }[] = [];
  for (const [key, raw] of Object.entries(input)) {
    if (skip.includes(key) || key === 'custom' || key === 'tags' || key === 'tagIds') continue;
    const def = FIELDS[entity].find((f) => f.key === key);
    if (!def || def.computed) throw badRequest(`Unknown field ${key}`);
    if (def.readOnly) throw badRequest(`${def.label} cannot be set here`);
    const col = snake(key);
    const value = cleanValue(def, raw, settings);
    if (value !== null && ['user', 'company', 'contact', 'deal', 'lead'].includes(def.type)) refs.push({ field: key, type: def.type, id: String(value) });
    if (def.required && (value === null || value === '')) throw badRequest(`${def.label} is required`);
    const before = existing ? existing[col] : undefined;
    if (existing && (before ?? null) === (value ?? null)) continue;
    cols[col] = value;
    changes[key] = [before ?? null, value];
  }
  return { cols, changes, refs };
}

function cleanValue(def: FieldDef, raw: unknown, settings: OrgSettings): unknown {
  const label = def.label;
  const textOf = (max: number) => {
    if (raw === null || raw === undefined) return '';
    if (typeof raw !== 'string' && typeof raw !== 'number') throw badRequest(`${label} must be text`);
    const s = String(raw).replace(/\u0000/g, '').trim();
    if (s.length > max) throw badRequest(`${label} is longer than ${max} characters`);
    return s;
  };
  switch (def.type) {
    case 'text':
    case 'longtext':
    case 'phone':
      return textOf(def.maxLength ?? (def.type === 'phone' ? 60 : 300));
    case 'url':
      return textOf(500);
    case 'email': {
      const s = textOf(320).toLowerCase();
      if (s && !EMAIL.test(s)) throw badRequest(`${label} is not a valid email address`);
      return s;
    }
    case 'enum': {
      const s = textOf(80);
      if (!s) {
        if (def.list && STRICT_LISTS.has(def.list) && def.list !== 'companySizes') throw badRequest(`${label} is required`);
        return '';
      }
      const opts = optionsFor(def, settings);
      if (def.list && STRICT_LISTS.has(def.list) && !opts.some((o) => o.key === s)) throw badRequest(`${label}: "${s}" is not one of the choices`);
      return s;
    }
    case 'user':
    case 'company':
    case 'contact':
    case 'deal':
    case 'lead':
    case 'pipeline':
    case 'stage': {
      if (raw === null || raw === undefined || raw === '') return null;
      if (typeof raw !== 'string' || raw.length > 64) throw badRequest(`${label} is not valid`);
      return raw;
    }
    case 'date': {
      if (raw === null || raw === undefined || raw === '') return null;
      if (typeof raw !== 'string' || !DATE_RE.test(raw) || Number.isNaN(Date.parse(`${raw}T00:00:00Z`))) throw badRequest(`${label} must be a date (YYYY-MM-DD)`);
      return raw;
    }
    case 'time': {
      if (raw === null || raw === undefined || raw === '') return null;
      if (typeof raw !== 'string' || !TIME_RE.test(raw)) throw badRequest(`${label} must be a time (HH:MM)`);
      return raw;
    }
    case 'money': {
      if (raw === null || raw === undefined || raw === '') return null;
      const n = Number(raw);
      if (!Number.isSafeInteger(n) || n < 0 || n > 1e15) throw badRequest(`${label} must be a whole amount in the currency's smallest unit`);
      return n;
    }
    case 'int': {
      if (raw === null || raw === undefined || raw === '') return def.key === 'score' ? 0 : null;
      const n = Number(raw);
      const max = def.key === 'score' ? 100 : 100_000;
      if (!Number.isInteger(n) || n < 0 || n > max) throw badRequest(`${label} must be a whole number from 0 to ${max}`);
      return n;
    }
    case 'percent': {
      if (raw === null || raw === undefined || raw === '') return null;
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0 || n > 100) throw badRequest(`${label} must be from 0 to 100`);
      return n;
    }
    case 'bool':
      if (typeof raw !== 'boolean') throw badRequest(`${label} must be yes or no`);
      return raw ? 1 : 0;
    default:
      throw badRequest(`${label} cannot be set`);
  }
}

/** Custom field values: only this entity's fields of this organisation, each checked against its type. */
export function validateCustom(fields: CustomFieldDTO[], input: unknown, existingJson: string | null, creating: boolean): { json: string; changed: string[] } {
  const current = parseJson<Record<string, unknown>>(existingJson, {});
  const next = { ...current };
  const changed: string[] = [];
  if (input !== undefined && (typeof input !== 'object' || input === null || Array.isArray(input))) throw badRequest('Custom fields must be an object');
  for (const [id, raw] of Object.entries((input ?? {}) as Record<string, unknown>)) {
    const f = fields.find((x) => x.id === id);
    if (!f) throw badRequest('Unknown custom field');
    const v = cleanCustom(f, raw);
    if (JSON.stringify(current[id] ?? null) === JSON.stringify(v)) continue;
    if (v === null) delete next[id];
    else next[id] = v;
    changed.push(f.label);
  }
  if (creating) {
    for (const f of fields) if (f.required && !f.archived && (next[f.id] === undefined || next[f.id] === '' || (Array.isArray(next[f.id]) && !(next[f.id] as unknown[]).length))) throw badRequest(`${f.label} is required`);
  }
  const json = JSON.stringify(next);
  if (json.length > 20_000) throw badRequest('Too much data in custom fields');
  return { json, changed };
}

function cleanCustom(f: CustomFieldDTO, raw: unknown): unknown {
  if (raw === null || raw === undefined || raw === '') return null;
  const fail = (m: string): never => {
    throw badRequest(`${f.label}: ${m}`);
  };
  switch (f.type) {
    case 'text':
    case 'textarea':
    case 'url':
    case 'phone': {
      if (typeof raw !== 'string') fail('must be text');
      const s = (raw as string).trim();
      if (s.length > (f.type === 'textarea' ? 5000 : 500)) fail('is too long');
      return s || null;
    }
    case 'email': {
      const s = String(raw).trim().toLowerCase();
      if (!EMAIL.test(s)) fail('is not a valid email address');
      return s;
    }
    case 'number': {
      const n = Number(raw);
      if (!Number.isFinite(n) || Math.abs(n) > 1e15) fail('must be a number');
      return n;
    }
    case 'money': {
      const n = Number(raw);
      if (!Number.isSafeInteger(n)) fail('must be a whole amount in the smallest unit');
      return n;
    }
    case 'date':
      if (typeof raw !== 'string' || !DATE_RE.test(raw)) fail('must be a date (YYYY-MM-DD)');
      return raw;
    case 'checkbox':
      if (typeof raw !== 'boolean') fail('must be yes or no');
      return raw;
    case 'select':
      if (typeof raw !== 'string' || !f.options.includes(raw)) fail('is not one of the choices');
      return raw;
    case 'multiselect': {
      const list = Array.isArray(raw) ? raw : [raw];
      if (!list.every((x) => typeof x === 'string' && f.options.includes(x))) fail('has a value that is not one of the choices');
      return [...new Set(list as string[])];
    }
  }
}

/** Check that each referenced record exists in this organisation (and is not deleted), and owners are members. */
export async function checkRefs(db: D1Database, a: OrgAccess, refs: { field: string; type: FieldType; id: string }[]) {
  for (const r of refs) {
    if (r.type === 'user') {
      const m = await db.prepare('SELECT 1 FROM crm_members WHERE org_id = ? AND user_id = ?').bind(a.orgId, r.id).first();
      if (!m) throw new HttpError(400, 'That person is not a member of this organisation');
      continue;
    }
    const cfg = ENTITIES[r.type as CrmEntity];
    if (!cfg) continue;
    const row = await db.prepare(`SELECT * FROM ${cfg.table} WHERE org_id = ? AND id = ? AND deleted_at IS NULL`).bind(a.orgId, r.id).first<any>();
    if (!row || !canRecord(a, cfg.module, 'view', row)) throw new HttpError(400, `The ${r.type} you chose was not found`);
  }
}

/** Search text and normalised columns derived from a full row. */
export function derived(entity: CrmEntity, row: Record<string, any>): Record<string, unknown> {
  const s = (...p: unknown[]) =>
    p
      .filter((x) => typeof x === 'string' && x)
      .join(' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .slice(0, 2000);
  const digits = (...p: unknown[]) => {
    const keys = new Set<string>();
    for (const x of p) {
      const d = String(x ?? '').replace(/\D/g, '');
      if (d.length >= 6) keys.add(d.slice(-9));
    }
    return keys.size ? ` ${[...keys].join(' ')} ` : '';
  };
  const extraEmails = parseJson<{ value: string }[]>(row.emails_json, []).map((e) => e.value);
  const extraPhones = parseJson<{ value: string }[]>(row.phones_json, []).map((e) => e.value);
  switch (entity) {
    case 'contact':
      return { search_text: s(row.first_name, row.last_name, row.email, ...extraEmails, row.job_title, row.phone, row.mobile, row.city, row.country, row.company_name), phone_keys: digits(row.phone, row.mobile, ...extraPhones) };
    case 'company':
      return { search_text: s(row.name, row.website, row.email, row.phone, row.industry, row.city, row.country), phone_keys: digits(row.phone), domain: domainOf(row.website) };
    case 'lead':
      return { search_text: s(row.first_name, row.last_name, row.company_name, row.email, row.phone, row.job_title, row.country), phone_keys: digits(row.phone) };
    case 'deal':
      return { search_text: s(row.title, row.company_name, row.competitors, row.source) };
    case 'activity':
      return { search_text: s(row.title, row.description, row.location, row.outcome, row.email_to) };
  }
}

export function entityByPath(path: string): CrmEntity | null {
  return ({ contacts: 'contact', companies: 'company', leads: 'lead', deals: 'deal', activities: 'activity' } as Record<string, CrmEntity>)[path] ?? null;
}
