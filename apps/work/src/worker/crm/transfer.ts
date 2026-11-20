// Moving CRM records to another company's CRM (owner, 20 Nov 2026: "allow tasks and entries to move between companies as
// user may mistakenly entered to wrong company ... and allow mass selection"). Behind the flag move_records (off), on for
// both companies; docs/platform/moving-records.md.
//
// Contacts, leads and companies move, one or many. A record keeps its id and takes its notes, files, activities and
// timeline with it. A company takes its contacts, and a contact takes the lead it was converted from. Tags carry by name,
// custom fields by label and type, statuses and activity types by their key or name; what cannot carry is listed first
// and kept whole in the audit trail. A record linked to something only the old company holds stays where it is, with the
// reason: a deal (deals stay with the company that made them), an ERP sales order or a Finance customer. A lead
// converted into a contact moves with its contact, never alone. Posted Finance entries never move.
//
// Every statement of one record's move runs in one batch with foreign keys checked at its end (defer_foreign_keys), so a
// record and everything that points at it change organisation together or not at all.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, now, parseJson, placeholders } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { requireOrg, loadAccess, canRecord, type OrgAccess } from './access';
import { customFields, derived, validateCustom } from './entities';
import { auditStmt, eventStmt } from './util';
import type { ListOption, OrgSettings } from '../../shared/crm/defaults';
import type { CustomFieldDTO } from '../../shared/crm/types';
import { assertMemberRules, assertMoveAllowed, moveOn, toolCompany } from '../platform/moves';
import { companiesFor } from '../system/system';

export type MoveEntity = 'contact' | 'lead' | 'company';
const PATH_ENTITY: Record<string, MoveEntity> = { contacts: 'contact', leads: 'lead', companies: 'company' };
const TABLE: Record<MoveEntity, string> = { contact: 'crm_contacts', lead: 'crm_leads', company: 'crm_companies' };
const MODULE = { contact: 'contacts', lead: 'leads', company: 'companies' } as const;
const STATUS_LIST: Record<MoveEntity, keyof OrgSettings> = { contact: 'contactStatuses', lead: 'leadStatuses', company: 'companyStatuses' };
const LABEL: Record<MoveEntity, [string, string]> = { contact: ['contact', 'contacts'], lead: ['lead', 'leads'], company: ['company', 'companies'] };
export const MAX_CRM_MOVE = 100;

type Row = Record<string, any> & { id: string; org_id: string };

export interface CrmMoveRecord {
  id: string;
  entity: MoveEntity;
  name: string;
  ok: boolean;
  /** Why the record stays where it is. */
  error?: string;
  /** What goes with it. */
  carries: { contacts: number; leads: number; notes: number; activities: number; files: number };
  notCarried: { field: string; reason: string }[];
}

export interface CrmMoveResult {
  target: { orgId: string; orgName: string; companyId: string };
  records: CrmMoveRecord[];
  moved: number;
}

const nameOf = (entity: MoveEntity, r: Row) =>
  (entity === 'company' ? r.name : [r.first_name, r.last_name].filter(Boolean).join(' ').trim() || r.email || r.company_name || 'Unnamed').slice(0, 200);

/** A query over a list of ids, in parts (a statement takes at most 100 bound values). */
async function rowsIn<T = Row>(db: D1Database, sql: (ph: string) => string, ids: string[], before: unknown[] = []): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < ids.length; i += 80) {
    const part = ids.slice(i, i + 80);
    if (part.length) out.push(...(await db.prepare(sql(placeholders(part.length))).bind(...before, ...part).all<T>()).results);
  }
  return out;
}

/** The option of the new organisation's list for a value: the same key, else the same name, else none. */
export function mapOption(value: unknown, from: ListOption[], to: ListOption[]): string | null {
  if (value == null || value === '') return null;
  const v = String(value);
  if (to.some((o) => o.key === v)) return v;
  const label = (from.find((o) => o.key === v)?.label ?? v).trim().toLowerCase();
  return to.find((o) => o.label.trim().toLowerCase() === label)?.key ?? null;
}

/** Custom field values by label and type; what has no match is listed. */
export function mapCustom(json: string, from: CustomFieldDTO[], to: CustomFieldDTO[]): { json: string; dropped: string[] } {
  const values = parseJson<Record<string, unknown>>(json, {});
  const out: Record<string, unknown> = {};
  const dropped: string[] = [];
  for (const [id, v] of Object.entries(values)) {
    if (v == null || v === '') continue;
    const f = from.find((x) => x.id === id);
    const t = f && to.find((x) => !x.archived && x.type === f.type && x.label.trim().toLowerCase() === f.label.trim().toLowerCase());
    if (!f || !t) {
      dropped.push(f?.label ?? 'A custom field');
      continue;
    }
    try {
      const cleaned = parseJson<Record<string, unknown>>(validateCustom([t], { [t.id]: v }, null, false).json, {});
      if (cleaned[t.id] !== undefined) out[t.id] = cleaned[t.id];
      else dropped.push(f.label);
    } catch {
      dropped.push(f.label);
    }
  }
  return { json: JSON.stringify(out), dropped };
}

interface Family {
  root: Row;
  companies: Row[];
  contacts: Row[];
  leads: Row[];
}

/** The record and what moves with it: a company's contacts, the leads converted into its contacts or itself. */
async function familyOf(db: D1Database, orgId: string, entity: MoveEntity, root: Row): Promise<Family> {
  const f: Family = { root, companies: [], contacts: [], leads: [] };
  if (entity === 'company') {
    f.companies = [root];
    // Every row that points at the company moves too, deleted ones included (they still point at it).
    f.contacts = (await db.prepare('SELECT * FROM crm_contacts WHERE org_id = ? AND company_id = ?').bind(orgId, root.id).all<Row>()).results;
  } else if (entity === 'contact') f.contacts = [root];
  else f.leads = [root];
  if (entity !== 'lead') {
    const cids = f.contacts.map((c) => c.id);
    const byContact = await rowsIn(db, (ph) => `SELECT * FROM crm_leads WHERE org_id = ? AND contact_id IN (${ph})`, cids, [orgId]);
    const byCompany = entity === 'company' ? (await db.prepare('SELECT * FROM crm_leads WHERE org_id = ? AND company_id = ?').bind(orgId, root.id).all<Row>()).results : [];
    const seen = new Set<string>();
    f.leads = [...byContact, ...byCompany].filter((l) => !seen.has(l.id) && seen.add(l.id));
  }
  return f;
}

/** Why a record cannot leave: links to what only this company holds. null when it may move. */
async function blockerOf(db: D1Database, src: OrgAccess, companyId: string, entity: MoveEntity, f: Family): Promise<string | null> {
  const orgId = src.orgId;
  if (entity === 'lead' && (f.root.contact_id || f.root.company_id || f.root.deal_id)) {
    return 'This lead was converted. Move the contact it became; the lead goes with it.';
  }
  const companyIds = f.companies.map((c) => c.id);
  const contactIds = f.contacts.map((c) => c.id);
  const leadIds = f.leads.map((l) => l.id);
  const deals =
    (companyIds.length ? (await rowsIn<{ n: number }>(db, (ph) => `SELECT COUNT(*) AS n FROM crm_deals WHERE org_id = ? AND company_id IN (${ph})`, companyIds, [orgId]))[0]?.n ?? 0 : 0) +
    (contactIds.length ? (await rowsIn<{ n: number }>(db, (ph) => `SELECT COUNT(*) AS n FROM crm_deal_contacts WHERE org_id = ? AND contact_id IN (${ph})`, contactIds, [orgId]))[0]?.n ?? 0 : 0) +
    (leadIds.length ? (await rowsIn<{ n: number }>(db, (ph) => `SELECT COUNT(*) AS n FROM crm_deals WHERE org_id = ? AND lead_id IN (${ph})`, leadIds, [orgId]))[0]?.n ?? 0 : 0) +
    f.leads.filter((l) => l.deal_id).length;
  if (deals) return `It is on ${deals === 1 ? 'a deal' : `${deals} deals`} here. Deals stay with the company that made them, so it stays too.`;
  const dealActivities = await activityRows(db, orgId, f);
  if (dealActivities.some((a) => a.deal_id)) return 'Some of its activities are on a deal here, so it stays with the deal.';
  // ERP sales orders of this company that name the CRM company or contact (each id list bound twice, in parts).
  const ids = [...companyIds, ...contactIds];
  for (let i = 0; i < ids.length; i += 45) {
    const part = ids.slice(i, i + 45);
    const r = await db
      .prepare(`SELECT COUNT(*) AS n FROM erp_sales_orders WHERE company_id = ? AND (crm_company_id IN (${placeholders(part.length)}) OR crm_contact_id IN (${placeholders(part.length)}))`)
      .bind(companyId, ...part, ...part)
      .first<{ n: number }>();
    if (r?.n) return 'It is on sales orders here, so it stays with them.';
  }
  if (companyIds.length) {
    const linked = await rowsIn<{ n: number }>(db, (ph) => `SELECT COUNT(*) AS n FROM co_customer_links WHERE company_id = ? AND crm_company_id IN (${ph})`, companyIds, [companyId]);
    if (linked[0]?.n) return 'It is linked to a Finance customer here, so it stays with its invoices.';
  }
  const own = (list: Row[], e: MoveEntity) => list.filter((r) => !canRecord(src, MODULE[e], 'delete', r as Parameters<typeof canRecord>[3])).length;
  const blocked = own(f.companies, 'company') + own(f.contacts, 'contact') + own(f.leads, 'lead');
  if (blocked) return entity === 'company' && f.contacts.length ? 'Your access here does not include taking it, or some of its contacts, out of this CRM.' : 'Your access here does not include taking it out of this CRM.';
  return null;
}

async function activityRows(db: D1Database, orgId: string, f: Family): Promise<Row[]> {
  const out = new Map<string, Row>();
  for (const [col, list] of [['company_id', f.companies], ['contact_id', f.contacts], ['lead_id', f.leads]] as const) {
    const rows = await rowsIn(db, (ph) => `SELECT * FROM crm_activities WHERE org_id = ? AND ${col} IN (${ph})`, list.map((r) => r.id), [orgId]);
    for (const r of rows) out.set(r.id, r);
  }
  return [...out.values()];
}

async function countFor(db: D1Database, table: 'crm_notes' | 'crm_files', orgId: string, f: Family): Promise<number> {
  let n = 0;
  for (const [col, list] of [['company_id', f.companies], ['contact_id', f.contacts], ['lead_id', f.leads]] as const) {
    const r = await rowsIn<{ n: number }>(db, (ph) => `SELECT COUNT(*) AS n FROM ${table} WHERE org_id = ? AND deleted_at IS NULL AND ${col} IN (${ph})`, list.map((x) => x.id), [orgId]);
    n += r.reduce((s, x) => s + x.n, 0);
  }
  return n;
}

interface Ctx {
  src: OrgAccess;
  dst: OrgAccess;
  fromCompany: string;
  toCompany: string;
  members: Set<string>;
  fields: Record<MoveEntity, { from: CustomFieldDTO[]; to: CustomFieldDTO[] }>;
  dstTags: Map<string, string>;
}

async function context(c: Context<AppEnv>, entity: MoveEntity, toOrgId: string): Promise<Ctx> {
  const db = c.env.DB;
  const user = c.get('user');
  const src = await requireOrg(c);
  if (toOrgId === src.orgId) throw badRequest('The records are already in this CRM.');
  const dst = await loadAccess(db, toOrgId, { id: user.id, name: user.name });
  const fromCompany = await toolCompany(db, 'crm', src.orgId);
  const toCompany = await toolCompany(db, 'crm', dst.orgId);
  if (!fromCompany || !toCompany) throw new HttpError(404, 'Organisation not found');
  await assertMoveAllowed(db, fromCompany, toCompany, 'crm', 'records between companies');
  // An API token limited to one company stays in it.
  const scope = c.get('authKind') === 'token' ? c.get('tokenScope') : null;
  if (scope?.companyId && scope.companyId !== toCompany) throw new HttpError(403, 'This API token is limited to one company, and that CRM is not in it.', { code: 'TOKEN_SCOPE' });
  for (const e of entity === 'company' ? (['company', 'contact', 'lead'] as MoveEntity[]) : entity === 'contact' ? (['contact', 'lead'] as MoveEntity[]) : (['lead'] as MoveEntity[])) {
    if (!dst.perms[MODULE[e]].create) throw new HttpError(403, `Your access to that CRM does not include adding ${LABEL[e][1]}.`);
  }
  const members = new Set((await db.prepare('SELECT user_id FROM crm_members WHERE org_id = ?').bind(dst.orgId).all<{ user_id: string }>()).results.map((r) => r.user_id));
  const fields = {} as Ctx['fields'];
  for (const e of ['contact', 'lead', 'company'] as MoveEntity[]) fields[e] = { from: await customFields(db, src.orgId, e, true), to: await customFields(db, dst.orgId, e) };
  const dstTags = new Map((await db.prepare('SELECT id, name FROM crm_tags WHERE org_id = ?').bind(dst.orgId).all<{ id: string; name: string }>()).results.map((t) => [t.name.trim().toLowerCase(), t.id]));
  return { src, dst, fromCompany, toCompany, members, fields, dstTags };
}

/** One record's new columns in the new organisation, and what did not carry. */
async function newColumns(db: D1Database, x: Ctx, entity: MoveEntity, r: Row, f: Family, dropped: Map<string, Set<string>>): Promise<Record<string, unknown>> {
  const note = (field: string, reason: string) => (dropped.get(field) ?? dropped.set(field, new Set()).get(field)!).add(reason);
  const cols: Record<string, unknown> = {};
  if (r.owner_id && !x.members.has(r.owner_id)) {
    cols.owner_id = x.dst.userId;
    note('Owner', 'the owner does not work in the new CRM, so you own it there');
  }
  const status = mapOption(r.status, x.src.settings[STATUS_LIST[entity]] as ListOption[], x.dst.settings[STATUS_LIST[entity]] as ListOption[]);
  if (r.status && status !== r.status) {
    const first = (x.dst.settings[STATUS_LIST[entity]] as ListOption[])[0]?.key ?? r.status;
    cols.status = status ?? first;
    if (!status) note('Status', `the new CRM has no status "${r.status}"`);
  }
  const custom = mapCustom(r.custom_json, x.fields[entity].from, x.fields[entity].to);
  cols.custom_json = custom.json;
  for (const d of custom.dropped) note(d, 'no matching custom field in the new CRM');
  // A link to a company that stays: the new CRM's company of the same name, else none.
  if ((entity === 'contact' || entity === 'lead') && r.company_id && !f.companies.some((co) => co.id === r.company_id)) {
    const was = await db.prepare('SELECT name FROM crm_companies WHERE org_id = ? AND id = ?').bind(x.src.orgId, r.company_id).first<{ name: string }>();
    const match = was ? await db.prepare('SELECT id FROM crm_companies WHERE org_id = ? AND name = ? COLLATE NOCASE AND deleted_at IS NULL LIMIT 1').bind(x.dst.orgId, was.name).first<{ id: string }>() : null;
    cols.company_id = match?.id ?? null;
    if (!match) note('Company', `"${was?.name ?? 'its company'}" stays here and is not in the new CRM`);
  }
  if (entity === 'contact' && r.lead_id && !f.leads.some((l) => l.id === r.lead_id)) cols.lead_id = null;
  if (entity === 'contact') {
    const companyId = (cols.company_id !== undefined ? cols.company_id : r.company_id) as string | null;
    const co = companyId ? await db.prepare('SELECT name FROM crm_companies WHERE id = ?').bind(companyId).first<{ name: string }>() : null;
    Object.assign(cols, derived('contact', { ...r, ...cols, company_name: co?.name ?? f.companies.find((x2) => x2.id === companyId)?.name ?? '' }));
  }
  return cols;
}

interface Planned {
  record: CrmMoveRecord;
  family: Family;
  activities: Row[];
}

async function plan(c: Context<AppEnv>, entity: MoveEntity, ids: string[], toOrgId: string): Promise<{ x: Ctx; planned: Planned[] }> {
  const db = c.env.DB;
  const x = await context(c, entity, toOrgId);
  const unique = [...new Set(ids)];
  if (!unique.length) throw badRequest('Select at least one record.');
  if (unique.length > MAX_CRM_MOVE) throw badRequest(`Move at most ${MAX_CRM_MOVE} records at a time.`);
  const rows = await rowsIn(db, (ph) => `SELECT * FROM ${TABLE[entity]} WHERE org_id = ? AND deleted_at IS NULL AND id IN (${ph})`, unique, [x.src.orgId]);
  const visible = rows.filter((r) => canRecord(x.src, MODULE[entity], 'view', r as Parameters<typeof canRecord>[3]));
  if (visible.length !== unique.length) throw new HttpError(404, 'One or more records were not found.');
  await assertMemberRules(db, x.src.userId, { from: x.fromCompany, to: x.toCompany }, 'crm', 'Sales and CRM', visible.some((r) => r.created_by !== x.src.userId));
  const planned: Planned[] = [];
  const claimed = new Set<string>();
  for (const root of visible) {
    const family = await familyOf(db, x.src.orgId, entity, root);
    const record: CrmMoveRecord = {
      id: root.id,
      entity,
      name: nameOf(entity, root),
      ok: true,
      carries: { contacts: entity === 'company' ? family.contacts.length : 0, leads: family.leads.length - (entity === 'lead' ? 1 : 0), notes: 0, activities: 0, files: 0 },
      notCarried: [],
    };
    const ownIds = [...family.companies, ...family.contacts, ...family.leads].map((r) => r.id);
    const blocker = ownIds.some((id) => claimed.has(id)) ? 'It moves already with another record you selected.' : await blockerOf(db, x.src, x.fromCompany, entity, family);
    const activities = blocker ? [] : await activityRows(db, x.src.orgId, family);
    if (blocker) {
      record.ok = false;
      record.error = blocker;
    } else {
      ownIds.forEach((id) => claimed.add(id));
      record.carries.notes = await countFor(db, 'crm_notes', x.src.orgId, family);
      record.carries.files = await countFor(db, 'crm_files', x.src.orgId, family);
      record.carries.activities = activities.filter((a) => !a.deleted_at).length;
      const dropped = new Map<string, Set<string>>();
      for (const [e, list] of [['company', family.companies], ['contact', family.contacts], ['lead', family.leads]] as [MoveEntity, Row[]][]) for (const r of list) await newColumns(db, x, e, r, family, dropped);
      const tags = await tagNames(db, x.src.orgId, family);
      const missing = [...new Set(tags.map((t) => t.name).filter((n) => !x.dstTags.has(n.trim().toLowerCase())))];
      if (missing.length) dropped.set('Tags', new Set([`the new CRM has no tag ${missing.map((m) => `"${m}"`).join(', ')}`]));
      if (activities.some((a) => a.assigned_to && !x.members.has(a.assigned_to))) dropped.set('Activities', new Set(['some are assigned to people who do not work in the new CRM; they are unassigned there']));
      record.notCarried = [...dropped].map(([field, reasons]) => ({ field, reason: [...reasons].join('; ') }));
    }
    planned.push({ record, family, activities });
  }
  return { x, planned };
}

async function tagNames(db: D1Database, orgId: string, f: Family): Promise<{ entity: string; record_id: string; name: string }[]> {
  const out: { entity: string; record_id: string; name: string }[] = [];
  for (const [e, list] of [['company', f.companies], ['contact', f.contacts], ['lead', f.leads]] as const) {
    out.push(
      ...(await rowsIn<{ entity: string; record_id: string; name: string }>(
        db,
        (ph) => `SELECT rt.entity, rt.record_id, t.name FROM crm_record_tags rt JOIN crm_tags t ON t.org_id = rt.org_id AND t.id = rt.tag_id WHERE rt.org_id = ? AND rt.entity = ? AND rt.record_id IN (${ph})`,
        list.map((r) => r.id),
        [orgId, e],
      )),
    );
  }
  return out;
}

const result = (x: Ctx, planned: Planned[], moved: number): CrmMoveResult => ({
  target: { orgId: x.dst.orgId, orgName: x.dst.org.name, companyId: x.toCompany },
  records: planned.map((p) => p.record),
  moved,
});

/** Moves one record and what goes with it, in one batch. */
async function moveOne(db: D1Database, x: Ctx, entity: MoveEntity, p: Planned, ip: string | null): Promise<void> {
  const S = x.src.orgId;
  const T = x.dst.orgId;
  const t = now();
  const f = p.family;
  const stmts: D1PreparedStatement[] = [db.prepare('PRAGMA defer_foreign_keys = ON')];
  const inFamily = { company: new Set(f.companies.map((r) => r.id)), contact: new Set(f.contacts.map((r) => r.id)), lead: new Set(f.leads.map((r) => r.id)) };
  const dropped = new Map<string, Set<string>>();
  for (const [e, list] of [['company', f.companies], ['contact', f.contacts], ['lead', f.leads]] as [MoveEntity, Row[]][]) {
    for (const r of list) {
      const cols = await newColumns(db, x, e, r, f, dropped);
      const keys = Object.keys(cols);
      stmts.push(
        db
          .prepare(`UPDATE ${TABLE[e]} SET org_id = ?, ${keys.map((k) => `${k} = ?`).join(', ')}${keys.length ? ', ' : ''}updated_at = ? WHERE org_id = ? AND id = ?`)
          .bind(T, ...keys.map((k) => cols[k]), t, S, r.id),
      );
      // Notes and files belong to one record each.
      stmts.push(db.prepare(`UPDATE crm_notes SET org_id = ? WHERE org_id = ? AND ${e}_id = ?`).bind(T, S, r.id));
      stmts.push(db.prepare(`UPDATE crm_files SET org_id = ? WHERE org_id = ? AND ${e}_id = ?`).bind(T, S, r.id));
      // Tags by name, where the new CRM has them.
      stmts.push(db.prepare('DELETE FROM crm_record_tags WHERE org_id = ? AND entity = ? AND record_id = ?').bind(S, e, r.id));
    }
  }
  for (const tg of await tagNames(db, S, f)) {
    const id = x.dstTags.get(tg.name.trim().toLowerCase());
    if (id) stmts.push(db.prepare('INSERT OR IGNORE INTO crm_record_tags (org_id, tag_id, entity, record_id) VALUES (?, ?, ?, ?)').bind(T, id, tg.entity, tg.record_id));
  }
  // Activities: references to records that stay are cleared (deals were refused before); the type by key or name.
  const types = { from: x.src.settings.activityTypes, to: x.dst.settings.activityTypes };
  for (const a of p.activities) {
    const keep = (col: 'company_id' | 'contact_id' | 'lead_id', set: Set<string>) => (a[col] && set.has(a[col]) ? a[col] : null);
    const type = mapOption(a.type, types.from, types.to) ?? types.to[0]?.key ?? a.type;
    const sameCompany = x.fromCompany === x.toCompany;
    stmts.push(
      db
        .prepare(
          `UPDATE crm_activities SET org_id = ?, company_id = ?, contact_id = ?, lead_id = ?, deal_id = NULL, type = ?, assigned_to = ?,
             pm_workspace_id = ?, pm_item_id = ?, updated_at = ? WHERE org_id = ? AND id = ?`,
        )
        .bind(
          T,
          keep('company_id', inFamily.company),
          keep('contact_id', inFamily.contact),
          keep('lead_id', inFamily.lead),
          type,
          a.assigned_to && x.members.has(a.assigned_to) ? a.assigned_to : null,
          sameCompany ? a.pm_workspace_id : null,
          sameCompany ? a.pm_item_id : null,
          t,
          S,
          a.id,
        ),
    );
  }
  // The timeline (no foreign keys): events of the moving records go with them.
  for (const [col, set] of [['company_id', inFamily.company], ['contact_id', inFamily.contact], ['lead_id', inFamily.lead]] as const) {
    for (const id of set) {
      stmts.push(
        db
          .prepare(
            `UPDATE crm_events SET org_id = ?,
               company_id = CASE WHEN company_id IS NULL THEN NULL WHEN company_id IN (SELECT id FROM crm_companies WHERE org_id = ?) THEN company_id ELSE NULL END,
               contact_id = CASE WHEN contact_id IS NULL THEN NULL WHEN contact_id IN (SELECT id FROM crm_contacts WHERE org_id = ?) THEN contact_id ELSE NULL END,
               lead_id = CASE WHEN lead_id IS NULL THEN NULL WHEN lead_id IN (SELECT id FROM crm_leads WHERE org_id = ?) THEN lead_id ELSE NULL END,
               deal_id = NULL
             WHERE org_id = ? AND ${col} = ?`,
          )
          .bind(T, T, T, T, S, id),
      );
    }
  }
  const root = f.root;
  const refs = entity === 'company' ? { companyId: root.id } : entity === 'contact' ? { contactId: root.id } : { leadId: root.id };
  const same = x.fromCompany === x.toCompany;
  stmts.push(
    eventStmt(db, { orgId: T, type: 'moved', actorId: x.src.userId, refs, summary: same ? `Moved from ${x.src.org.name}` : 'Moved from another company', data: { notCarried: p.record.notCarried }, at: t }),
    auditStmt(db, {
      orgId: S,
      actorId: x.src.userId,
      action: 'records.moved_out',
      targetType: entity,
      targetId: root.id,
      before: { companies: f.companies, contacts: f.contacts, leads: f.leads },
      metadata: { toCompanyId: x.toCompany, toOrgId: T, notCarried: p.record.notCarried },
      ip,
    }),
    auditStmt(db, {
      orgId: T,
      actorId: x.src.userId,
      action: 'records.moved_in',
      targetType: entity,
      targetId: root.id,
      metadata: { fromCompanyId: x.fromCompany, fromOrgId: S, contacts: f.contacts.length, leads: f.leads.length },
      ip,
    }),
  );
  await db.batch(stmts);
}

// ------------------------------------------------------------------ routes

export const crmTransferRoutes = new Hono<AppEnv>();

const input = z.object({ ids: z.array(z.string().max(64)).min(1).max(MAX_CRM_MOVE), toOrgId: z.string().max(64) });

/** Whether records may be moved out of this CRM at all (the screens show the option only then). */
crmTransferRoutes.get('/orgs/:org/transfer/status', async (c) => {
  const a = await requireOrg(c);
  const company = await toolCompany(c.env.DB, 'crm', a.orgId);
  return c.json({ enabled: !!company && (await moveOn(c.env.DB, company, 'crm')) });
});

/** The CRMs of the person's other companies where moving is on. */
crmTransferRoutes.get('/orgs/:org/transfer/targets', async (c) => {
  const db = c.env.DB;
  const a = await requireOrg(c);
  const user = c.get('user');
  const fromCompany = await toolCompany(db, 'crm', a.orgId);
  if (!fromCompany || !(await moveOn(db, fromCompany, 'crm'))) return c.json({ enabled: false, targets: [] });
  const companies = await companiesFor(db, user);
  const fromDemo = companies.find((x) => x.id === fromCompany)?.kind === 'demo';
  const targets: { orgId: string; name: string; companyId: string; companyName: string; create: Record<MoveEntity, boolean> }[] = [];
  for (const co of companies) {
    if ((co.kind === 'demo' || fromDemo) && co.id !== fromCompany) continue;
    if (!(await moveOn(db, co.id, 'crm'))) continue;
    for (const tool of co.tools.filter((t) => t.app === 'crm' && t.id !== a.orgId)) {
      try {
        const d = await loadAccess(db, tool.id, { id: user.id, name: user.name });
        targets.push({ orgId: d.orgId, name: d.org.name, companyId: co.id, companyName: co.name, create: { contact: d.perms.contacts.create, lead: d.perms.leads.create, company: d.perms.companies.create } });
      } catch {
        /* not a member after all */
      }
    }
  }
  return c.json({ enabled: true, targets });
});

for (const [path, entity] of Object.entries(PATH_ENTITY)) {
  crmTransferRoutes.post(`/orgs/:org/${path}/transfer/preview`, async (c) => {
    const req = await body(c, input);
    const { x, planned } = await plan(c, entity, req.ids, req.toOrgId);
    return c.json(result(x, planned, 0));
  });

  crmTransferRoutes.post(`/orgs/:org/${path}/transfer`, async (c) => {
    await rateLimit(c.env.DB, `crm-transfer:${c.get('user').id}`, 30, 10 * 60_000);
    const req = await body(c, input);
    const { x, planned } = await plan(c, entity, req.ids, req.toOrgId);
    const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    let moved = 0;
    for (const p of planned) {
      if (!p.record.ok) continue;
      try {
        await moveOne(c.env.DB, x, entity, p, ip);
        moved++;
      } catch {
        p.record.ok = false;
        p.record.error = 'It could not be moved. Nothing was changed for it.';
      }
    }
    return c.json({ ok: planned.every((p) => p.record.ok), ...result(x, planned, moved) });
  });
}
