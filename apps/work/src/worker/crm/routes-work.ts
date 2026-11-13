// Working on customer relationships: notes and comments with mentions, documents, the unified timeline, notifications,
// organisation-wide search, logged emails, calendar files and feeds, and turning an activity into a project task.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, newId, notFound, now, parseJson, placeholders, randomToken, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { validateUpload } from '../routes/files';
import { RECORD_ENTITIES, type RecordEntity } from '../../shared/crm/fields';
import type { FileDTO, NoteDTO, TimelineItemDTO } from '../../shared/crm/types';
import { type OrgAccess, assertRecord, canRecord, deny, loadAccess, requireOrg, requirePerm, scopeSql } from './access';
import { ENTITIES, escapeLike, getRow, listRows, toDTOs } from './entities';
import { createActivity, rowName } from './records';
import { crmNotify } from './notify';
import { auditStmt, crmUrl, eventStmt, mentionedIds, recordLink, todayIn } from './util';
import { recordDTO } from './routes-records';

export const workRoutes = new Hono<AppEnv>();

const entityEnum = z.enum(RECORD_ENTITIES as ['lead', 'contact', 'company', 'deal']);

async function parentRecord(c: any, a: OrgAccess, entity: RecordEntity, id: string, need: 'view' | 'edit' = 'view') {
  const row = await getRow(c.env.DB, ENTITIES[entity], a.orgId, id);
  if (!row || row.deleted_at) throw notFound('Record');
  assertRecord(a, ENTITIES[entity].module, need, row);
  return row;
}

/** Who may write notes and upload documents: anyone who can log activities (viewers cannot). */
function requireContribute(a: OrgAccess) {
  requirePerm(a, 'activities', 'create', 'You have read-only access');
}

// ------------------------------------------------------------------ notes and comments

function noteDTO(a: OrgAccess, r: any): NoteDTO {
  const mine = r.author_id === a.userId;
  const moderator = a.role === 'owner' || a.role === 'admin' || a.role === 'manager';
  return { id: r.id, kind: r.kind, body: r.body, authorId: r.author_id, authorName: r.author_name ?? null, pinned: !!r.pinned, mentions: parseJson(r.mentions_json, []), createdAt: r.created_at, updatedAt: r.updated_at, can: { edit: mine, delete: mine || moderator } };
}

workRoutes.get('/orgs/:org/notes', async (c) => {
  const a = await requireOrg(c);
  const entity = entityEnum.parse(c.req.query('entity'));
  const rec = await parentRecord(c, a, entity, c.req.query('recordId') ?? '');
  const rows = await c.env.DB.prepare(`SELECT n.*, u.name AS author_name FROM crm_notes n LEFT JOIN users u ON u.id = n.author_id WHERE n.org_id = ? AND n.${entity}_id = ? AND n.deleted_at IS NULL ORDER BY n.pinned DESC, n.created_at DESC LIMIT 200`)
    .bind(a.orgId, rec.id)
    .all<any>();
  return c.json(rows.results.map((r) => noteDTO(a, r)));
});

workRoutes.post('/orgs/:org/notes', async (c) => {
  const a = await requireOrg(c);
  requireContribute(a);
  await rateLimit(c.env.DB, `crm-note:${a.userId}`, 120, 60_000);
  const input = await body(c, z.object({ entity: entityEnum, recordId: z.string().max(64), kind: z.enum(['note', 'comment', 'meeting']).default('note'), body: z.string().trim().min(1).max(20_000) }));
  const rec = await parentRecord(c, a, input.entity, input.recordId);
  const members = await c.env.DB.prepare('SELECT user_id FROM crm_members WHERE org_id = ?').bind(a.orgId).all<{ user_id: string }>();
  const memberSet = new Set(members.results.map((m) => m.user_id));
  const mentions = mentionedIds(input.body).filter((id) => memberSet.has(id));
  const id = newId();
  const t = now();
  const db = c.env.DB;
  await db.batch([
    db.prepare(`INSERT INTO crm_notes (id, org_id, kind, body, ${input.entity}_id, author_id, mentions_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, a.orgId, input.kind, input.body, rec.id, a.userId, JSON.stringify(mentions), t, t),
    db.prepare(`UPDATE ${ENTITIES[input.entity].table} SET last_activity_at = ? WHERE org_id = ? AND id = ?`).bind(t, a.orgId, rec.id),
  ]);
  if (mentions.length) {
    const plain = input.body.replace(/@\[([^\]]{1,100})\]\([A-Za-z0-9_-]{8,40}\)/g, '@$1');
    await crmNotify(c.env, {
      orgId: a.orgId,
      orgName: a.org.name,
      userIds: mentions,
      type: 'mention',
      title: `${a.userName} mentioned you on ${rowName(input.entity, rec)}`,
      body: plain.slice(0, 300),
      link: recordLink(a.orgId, input.entity, rec.id),
      entityType: input.entity,
      entityId: rec.id,
      actorId: a.userId,
      dedupeKey: `mention:${id}`,
    }, (p) => c.executionCtx.waitUntil(p));
  }
  const row = await db.prepare('SELECT n.*, u.name AS author_name FROM crm_notes n LEFT JOIN users u ON u.id = n.author_id WHERE n.id = ?').bind(id).first();
  return c.json(noteDTO(a, row), 201);
});

workRoutes.patch('/orgs/:org/notes/:id', async (c) => {
  const a = await requireOrg(c);
  const n = await c.env.DB.prepare('SELECT * FROM crm_notes WHERE org_id = ? AND id = ? AND deleted_at IS NULL').bind(a.orgId, c.req.param('id')).first<any>();
  if (!n) throw notFound('Note');
  const entity = RECORD_ENTITIES.find((e) => n[`${e}_id`])!;
  await parentRecord(c, a, entity, n[`${entity}_id`]);
  const input = await body(c, z.object({ body: z.string().trim().min(1).max(20_000).optional(), pinned: z.boolean().optional() }));
  if (input.body !== undefined && n.author_id !== a.userId) deny('Only the author can change a note');
  if (input.pinned !== undefined) requireContribute(a);
  await c.env.DB.prepare('UPDATE crm_notes SET body = ?, pinned = ?, updated_at = ? WHERE id = ?').bind(input.body ?? n.body, input.pinned === undefined ? n.pinned : input.pinned ? 1 : 0, now(), n.id).run();
  const row = await c.env.DB.prepare('SELECT n.*, u.name AS author_name FROM crm_notes n LEFT JOIN users u ON u.id = n.author_id WHERE n.id = ?').bind(n.id).first();
  return c.json(noteDTO(a, row));
});

workRoutes.delete('/orgs/:org/notes/:id', async (c) => {
  const a = await requireOrg(c);
  const n = await c.env.DB.prepare('SELECT * FROM crm_notes WHERE org_id = ? AND id = ? AND deleted_at IS NULL').bind(a.orgId, c.req.param('id')).first<any>();
  if (!n) throw notFound('Note');
  const entity = RECORD_ENTITIES.find((e) => n[`${e}_id`])!;
  await parentRecord(c, a, entity, n[`${entity}_id`]);
  if (!noteDTO(a, n).can.delete) deny('Only the author or a manager can delete this note');
  await c.env.DB.prepare('UPDATE crm_notes SET deleted_at = ? WHERE id = ?').bind(now(), n.id).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ files

function fileDTO(r: any): FileDTO {
  return { id: r.id, kind: r.kind, fileName: r.file_name, contentType: r.content_type, size: r.size, version: r.version, previousId: r.previous_id, uploaderId: r.uploader_id, uploaderName: r.uploader_name ?? null, createdAt: r.created_at, url: `/api/crm/orgs/${r.org_id}/files/${r.id}` };
}

workRoutes.get('/orgs/:org/files', async (c) => {
  const a = await requireOrg(c);
  const entity = entityEnum.parse(c.req.query('entity'));
  const rec = await parentRecord(c, a, entity, c.req.query('recordId') ?? '');
  const rows = await c.env.DB.prepare(`SELECT f.*, u.name AS uploader_name FROM crm_files f LEFT JOIN users u ON u.id = f.uploader_id WHERE f.org_id = ? AND f.${entity}_id = ? AND f.deleted_at IS NULL ORDER BY f.created_at DESC LIMIT 300`)
    .bind(a.orgId, rec.id)
    .all<any>();
  return c.json(rows.results.map(fileDTO));
});

workRoutes.post('/orgs/:org/files', async (c) => {
  const a = await requireOrg(c);
  requireContribute(a);
  await rateLimit(c.env.DB, `crm-upload:${a.userId}`, 60, 60_000);
  const form = await c.req.formData().catch(() => null);
  if (!form) throw badRequest('Expected multipart/form-data');
  const file = form.get('file');
  if (!(file instanceof File)) throw badRequest('Missing file');
  const entity = entityEnum.parse(String(form.get('entity') ?? ''));
  const rec = await parentRecord(c, a, entity, String(form.get('recordId') ?? ''));
  const kind = z.enum(['document', 'proposal', 'contract', 'quote', 'other']).parse(String(form.get('kind') ?? 'document'));
  const previousId = String(form.get('previousId') ?? '') || null;
  let version = 1;
  if (previousId) {
    const prev = await c.env.DB.prepare(`SELECT version FROM crm_files WHERE org_id = ? AND id = ? AND ${entity}_id = ? AND deleted_at IS NULL`).bind(a.orgId, previousId, rec.id).first<{ version: number }>();
    if (!prev) throw badRequest('The document this replaces was not found');
    version = prev.version + 1;
  }
  const { name, type, bytes } = await validateUpload(file);
  const id = newId();
  const key = `crm/${a.orgId}/${entity}/${rec.id}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: a.userId } });
  const t = now();
  const db = c.env.DB;
  await db.batch([
    db.prepare(`INSERT INTO crm_files (id, org_id, kind, ${entity}_id, file_name, content_type, size, r2_key, version, previous_id, uploader_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, a.orgId, kind, rec.id, name, type, bytes.byteLength, key, version, previousId, a.userId, t),
    eventStmt(db, { orgId: a.orgId, type: 'file_uploaded', actorId: a.userId, refs: { [`${entity}Id`]: rec.id }, summary: `${version > 1 ? `New version (${version}) of` : 'Uploaded'} ${name}` }),
  ]);
  const row = await db.prepare('SELECT f.*, u.name AS uploader_name FROM crm_files f LEFT JOIN users u ON u.id = f.uploader_id WHERE f.id = ?').bind(id).first();
  return c.json(fileDTO(row), 201);
});

async function loadFile(c: any, a: OrgAccess) {
  const f = await c.env.DB.prepare('SELECT * FROM crm_files WHERE org_id = ? AND id = ? AND deleted_at IS NULL').bind(a.orgId, c.req.param('id')).first();
  if (!f) throw notFound('File');
  const entity = RECORD_ENTITIES.find((e) => (f as any)[`${e}_id`])!;
  const rec = await parentRecord(c, a, entity, (f as any)[`${entity}_id`]).catch(() => {
    throw notFound('File');
  });
  return { f: f as any, entity, rec };
}

workRoutes.get('/orgs/:org/files/:id', async (c) => {
  const a = await requireOrg(c);
  const { f } = await loadFile(c, a);
  const obj = await c.env.FILES.get(f.r2_key);
  if (!obj) throw notFound('File');
  const inline = c.req.query('download') !== '1' && /^(image\/(png|jpeg|gif|webp)|application\/pdf)$/.test(f.content_type);
  return new Response(obj.body, {
    headers: {
      'Content-Type': f.content_type,
      'Content-Length': String(f.size),
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(f.file_name)}`,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      'Cache-Control': 'private, max-age=300',
    },
  });
});

workRoutes.delete('/orgs/:org/files/:id', async (c) => {
  const a = await requireOrg(c);
  const { f, entity, rec } = await loadFile(c, a);
  if (f.uploader_id !== a.userId && !canRecord(a, ENTITIES[entity].module, 'delete', rec)) deny('Only the person who uploaded it, or someone who can delete the record, can delete this file');
  const db = c.env.DB;
  await db.batch([
    db.prepare('UPDATE crm_files SET deleted_at = ?, deleted_by = ? WHERE id = ?').bind(now(), a.userId, f.id),
    eventStmt(db, { orgId: a.orgId, type: 'file_deleted', actorId: a.userId, refs: { [`${entity}Id`]: rec.id }, summary: `Deleted ${f.file_name}` }),
  ]);
  // The stored bytes go with it; the record of the file stays in the history.
  c.executionCtx.waitUntil(c.env.FILES.delete(f.r2_key));
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ timeline

/**
 * Everything that happened on a record, newest first: history, activities, notes and documents. A company's timeline
 * also has its contacts' and deals'; a contact's has the deals they are on. Paged by time (before=<ms>).
 */
workRoutes.get('/orgs/:org/timeline/:entity/:id', async (c) => {
  const a = await requireOrg(c);
  const entity = entityEnum.parse(c.req.param('entity'));
  const rec = await parentRecord(c, a, entity, c.req.param('id'));
  const db = c.env.DB;
  const before = Number(c.req.query('before') ?? Date.now() + 1);
  const limit = 60;
  const id = rec.id;
  // Which rows belong to this record (x is the source table).
  let rel: { sql: string; args: unknown[] };
  if (entity === 'company') {
    rel = { sql: '(x.company_id = ? OR x.contact_id IN (SELECT id FROM crm_contacts WHERE org_id = x.org_id AND company_id = ?) OR x.deal_id IN (SELECT id FROM crm_deals WHERE org_id = x.org_id AND company_id = ?))', args: [id, id, id] };
  } else if (entity === 'contact') {
    rel = { sql: '(x.contact_id = ? OR x.deal_id IN (SELECT deal_id FROM crm_deal_contacts WHERE org_id = x.org_id AND contact_id = ?))', args: [id, id] };
  } else rel = { sql: `x.${entity}_id = ?`, args: [id] };
  // Rows that came through another record must be visible to the caller too.
  const vis: string[] = [];
  const visArgs: unknown[] = [];
  for (const [col, e] of [
    ['deal_id', 'deal'],
    ['contact_id', 'contact'],
  ] as const) {
    if (e === entity) continue;
    const s = scopeSql(a, ENTITIES[e].module, 'v');
    if (s.sql === '1') continue;
    vis.push(`(x.${col} IS NULL OR EXISTS (SELECT 1 FROM ${ENTITIES[e].table} v WHERE v.org_id = x.org_id AND v.id = x.${col} AND ${s.sql}))`);
    visArgs.push(...s.args);
  }
  const visSql = vis.length ? ` AND ${vis.join(' AND ')}` : '';
  const actScope = scopeSql(a, 'activities', 'x');
  const [events, acts, notes, files] = await Promise.all([
    db.prepare(`SELECT x.*, u.name AS actor_name FROM crm_events x LEFT JOIN users u ON u.id = x.actor_id WHERE x.org_id = ? AND ${rel.sql}${visSql} AND x.created_at < ? ORDER BY x.created_at DESC LIMIT ?`).bind(a.orgId, ...rel.args, ...visArgs, before, limit).all<any>(),
    db
      .prepare(`SELECT x.*, u.name AS actor_name FROM crm_activities x LEFT JOIN users u ON u.id = COALESCE(x.done_by, x.created_by) WHERE x.org_id = ? AND ${rel.sql}${visSql} AND ${actScope.sql} AND x.deleted_at IS NULL AND COALESCE(x.done_at, x.created_at) < ? ORDER BY COALESCE(x.done_at, x.created_at) DESC LIMIT ?`)
      .bind(a.orgId, ...rel.args, ...visArgs, ...actScope.args, before, limit)
      .all<any>(),
    db.prepare(`SELECT x.*, u.name AS actor_name FROM crm_notes x LEFT JOIN users u ON u.id = x.author_id WHERE x.org_id = ? AND ${rel.sql}${visSql} AND x.deleted_at IS NULL AND x.created_at < ? ORDER BY x.created_at DESC LIMIT ?`).bind(a.orgId, ...rel.args, ...visArgs, before, limit).all<any>(),
    db.prepare(`SELECT x.*, u.name AS actor_name FROM crm_files x LEFT JOIN users u ON u.id = x.uploader_id WHERE x.org_id = ? AND ${rel.sql}${visSql} AND x.deleted_at IS NULL AND x.created_at < ? ORDER BY x.created_at DESC LIMIT ?`).bind(a.orgId, ...rel.args, ...visArgs, before, limit).all<any>(),
  ]);
  // Names of the records items came through.
  const viaIds: Record<string, Set<string>> = { contact: new Set(), deal: new Set(), company: new Set(), lead: new Set() };
  const all = [...events.results, ...acts.results, ...notes.results, ...files.results];
  for (const r of all) for (const e of RECORD_ENTITIES) if (r[`${e}_id`] && !(e === entity && r[`${e}_id`] === id)) viaIds[e].add(r[`${e}_id`]);
  const names = new Map<string, string>();
  for (const e of RECORD_ENTITIES) {
    const ids = [...viaIds[e]].slice(0, 200);
    if (!ids.length) continue;
    const col = e === 'company' ? 'name' : e === 'deal' ? 'title' : "TRIM(first_name || ' ' || last_name)";
    const rows = await db.prepare(`SELECT id, ${col} AS n FROM ${ENTITIES[e].table} WHERE org_id = ? AND id IN (${placeholders(ids.length)})`).bind(a.orgId, ...ids).all<{ id: string; n: string }>();
    for (const r of rows.results) names.set(`${e}:${r.id}`, r.n || '(no name)');
  }
  const via = (r: any): TimelineItemDTO['via'] => {
    if (r[`${entity}_id`] === id) return null;
    for (const e of ['deal', 'contact', 'lead', 'company'] as RecordEntity[]) if (r[`${e}_id`] && !(e === entity)) return { entity: e, id: r[`${e}_id`], name: names.get(`${e}:${r[`${e}_id`]}`) ?? '' };
    return null;
  };
  const items: TimelineItemDTO[] = [
    ...events.results.map((r) => ({ kind: 'event' as const, id: r.id, at: r.created_at, type: r.type, title: r.summary, body: '', actorId: r.actor_id, actorName: r.actor_name, via: via(r), data: parseJson(r.data_json, {}) })),
    ...acts.results.map((r) => ({
      kind: 'activity' as const,
      id: r.id,
      at: r.done_at ?? r.created_at,
      type: r.type,
      title: r.title,
      body: r.status === 'done' ? (r.outcome || r.description) : r.description,
      actorId: r.done_by ?? r.created_by,
      actorName: r.actor_name,
      via: via(r),
      data: { status: r.status, dueDate: r.due_date, dueTime: r.due_time, assignedTo: r.assigned_to, emailDirection: r.email_direction, emailTo: r.email_to },
    })),
    ...notes.results.map((r) => ({ kind: 'note' as const, id: r.id, at: r.created_at, type: r.kind, title: r.kind === 'meeting' ? 'Meeting notes' : r.kind === 'comment' ? 'Comment' : 'Note', body: r.body, actorId: r.author_id, actorName: r.actor_name, via: via(r), data: { pinned: !!r.pinned } })),
    ...files.results.map((r) => ({ kind: 'file' as const, id: r.id, at: r.created_at, type: r.kind, title: r.file_name, body: '', actorId: r.uploader_id, actorName: r.actor_name, via: via(r), data: { size: r.size, version: r.version, url: `/api/crm/orgs/${a.orgId}/files/${r.id}` } })),
  ]
    .sort((x, y) => y.at - x.at)
    .slice(0, limit);
  const more = [events, acts, notes, files].some((r) => r.results.length === limit);
  return c.json({ items, next: more && items.length ? items[items.length - 1].at : null });
});

// ------------------------------------------------------------------ notifications

workRoutes.get('/orgs/:org/notifications', async (c) => {
  const a = await requireOrg(c);
  const unreadOnly = c.req.query('unread') === '1';
  const [rows, count] = await Promise.all([
    c.env.DB.prepare(`SELECT * FROM crm_notifications WHERE user_id = ? AND org_id = ?${unreadOnly ? ' AND read_at IS NULL' : ''} ORDER BY created_at DESC LIMIT 100`).bind(a.userId, a.orgId).all<any>(),
    c.env.DB.prepare('SELECT COUNT(*) AS n FROM crm_notifications WHERE user_id = ? AND org_id = ? AND read_at IS NULL').bind(a.userId, a.orgId).first<{ n: number }>(),
  ]);
  return c.json({
    unread: count?.n ?? 0,
    notifications: rows.results.map((r) => ({ id: r.id, type: r.type, title: r.title, body: r.body, link: r.link, actorId: r.actor_id, readAt: r.read_at, createdAt: r.created_at })),
  });
});

workRoutes.post('/orgs/:org/notifications/read', async (c) => {
  const a = await requireOrg(c);
  const { ids } = await body(c, z.object({ ids: z.array(z.string().max(64)).max(200).optional() }));
  if (ids?.length) await c.env.DB.prepare(`UPDATE crm_notifications SET read_at = ? WHERE user_id = ? AND org_id = ? AND read_at IS NULL AND id IN (${placeholders(ids.length)})`).bind(now(), a.userId, a.orgId, ...ids).run();
  else await c.env.DB.prepare('UPDATE crm_notifications SET read_at = ? WHERE user_id = ? AND org_id = ? AND read_at IS NULL').bind(now(), a.userId, a.orgId).run();
  return c.json({ ok: true });
});

/** Unread counts per organisation (for the organisation switcher). */
workRoutes.get('/notifications/unread', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare('SELECT n.org_id, COUNT(*) AS n FROM crm_notifications n JOIN crm_members m ON m.org_id = n.org_id AND m.user_id = n.user_id WHERE n.user_id = ? AND n.read_at IS NULL GROUP BY n.org_id').bind(user.id).all<{ org_id: string; n: number }>();
  return c.json(Object.fromEntries(rows.results.map((r) => [r.org_id, r.n])));
});

// ------------------------------------------------------------------ search

workRoutes.get('/orgs/:org/search', async (c) => {
  const a = await requireOrg(c);
  const q = (c.req.query('q') ?? '').trim().slice(0, 100);
  if (q.length < 2) return c.json({ q, results: {} });
  await rateLimit(c.env.DB, `crm-search:${a.userId}`, 120, 60_000);
  const db = c.env.DB;
  const out: Record<string, unknown[]> = {};
  for (const e of ['contact', 'company', 'lead', 'deal', 'activity'] as const) {
    if (a.perms[ENTITIES[e].module].view === 'none') continue;
    const r = await listRows(db, a, ENTITIES[e], { q, scope: e === 'activity' ? 'active' : 'all', sort: { field: 'updatedAt', dir: 'desc' }, pageSize: 8 });
    out[e] = await toDTOs(db, a, e, r.rows);
  }
  // Notes, where the record they belong to is visible.
  const like = `%${escapeLike(q.toLowerCase())}%`;
  const notes = await db.prepare("SELECT n.id, n.body, n.kind, n.contact_id, n.company_id, n.deal_id, n.lead_id, n.created_at FROM crm_notes n WHERE n.org_id = ? AND n.deleted_at IS NULL AND LOWER(n.body) LIKE ? ESCAPE '\\' ORDER BY n.created_at DESC LIMIT 30").bind(a.orgId, like).all<any>();
  const noteHits: unknown[] = [];
  for (const n of notes.results) {
    const entity = RECORD_ENTITIES.find((e) => n[`${e}_id`])!;
    const rec = await getRow(db, ENTITIES[entity], a.orgId, n[`${entity}_id`]);
    if (!rec || rec.deleted_at || !canRecord(a, ENTITIES[entity].module, 'view', rec)) continue;
    noteHits.push({ id: n.id, kind: n.kind, excerpt: excerpt(n.body, q), entity, recordId: rec.id, recordName: rowName(entity, rec), createdAt: n.created_at });
    if (noteHits.length >= 8) break;
  }
  out.note = noteHits;
  return c.json({ q, results: out });
});

function excerpt(body: string, q: string): string {
  const plain = body.replace(/@\[([^\]]{1,100})\]\([A-Za-z0-9_-]{8,40}\)/g, '@$1');
  const i = plain.toLowerCase().indexOf(q.toLowerCase());
  const start = Math.max(0, i - 60);
  return `${start ? '…' : ''}${plain.slice(start, start + 180)}${plain.length > start + 180 ? '…' : ''}`;
}

// ------------------------------------------------------------------ emails

/**
 * Log an email to or from a customer on their timeline. Sending happens in the person's own mail program (the client
 * opens it with the message filled in); BIZOMAT does not send or receive customer mail until a mailbox is connected
 * (src/worker/crm/mailbox.ts).
 */
workRoutes.post('/orgs/:org/emails', async (c) => {
  const a = await requireOrg(c);
  const input = await body(
    c,
    z.object({
      direction: z.enum(['outbound', 'inbound']),
      to: z.string().trim().max(500),
      subject: z.string().trim().min(1).max(200),
      body: z.string().max(20_000).default(''),
      contactId: z.string().max(64).nullable().optional(),
      companyId: z.string().max(64).nullable().optional(),
      dealId: z.string().max(64).nullable().optional(),
      leadId: z.string().max(64).nullable().optional(),
      templateId: z.string().max(64).nullable().optional(),
    }),
  );
  const row = await createActivity(c, a, { type: 'email', title: input.subject, description: input.body, status: 'done', contactId: input.contactId ?? null, companyId: input.companyId ?? null, dealId: input.dealId ?? null, leadId: input.leadId ?? null }, { email: { direction: input.direction, to: input.to, delivery: 'logged' } });
  return c.json(await recordDTO(c.env.DB, a, 'activity', row), 201);
});

// ------------------------------------------------------------------ calendar

function icsText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n').slice(0, 2000);
}

function icsDate(t: number): string {
  return new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function vevent(r: any, url: string, tz: string): string[] {
  const lines = ['BEGIN:VEVENT', `UID:${r.id}@crm.bizomat.ai`, `DTSTAMP:${icsDate(r.updated_at)}`, `SUMMARY:${icsText(r.title)}`];
  if (r.due_time) {
    // Wall-clock times in the organisation's time zone (TZID), so the calendar shows them where they were planned.
    const start = new Date(`${r.due_date}T${r.due_time}:00Z`);
    const end = new Date(start.getTime() + (r.duration_min || 30) * 60_000);
    const wall = (d: Date) => d.toISOString().slice(0, 19).replace(/[-:]/g, '');
    lines.push(`DTSTART;TZID=${tz}:${wall(start)}`, `DTEND;TZID=${tz}:${wall(end)}`);
  } else {
    const next = new Date(`${r.due_date}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    lines.push(`DTSTART;VALUE=DATE:${String(r.due_date).replace(/-/g, '')}`, `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, '')}`);
  }
  if (r.location) lines.push(`LOCATION:${icsText(r.location)}`);
  lines.push(`DESCRIPTION:${icsText(`${r.description ? `${r.description}\n\n` : ''}${url}`)}`, `URL:${url}`, `STATUS:${r.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`, 'END:VEVENT');
  return lines;
}

function calendar(name: string, events: string[][]): string {
  // Lines over 75 octets are folded (RFC 5545).
  const fold = (l: string) => {
    const out: string[] = [];
    let s = l;
    while (s.length > 74) {
      out.push(s.slice(0, 74));
      s = ` ${s.slice(74)}`;
    }
    out.push(s);
    return out.join('\r\n');
  };
  return [['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BIZOMAT//CRM//EN', 'CALSCALE:GREGORIAN', `X-WR-CALNAME:${icsText(name)}`], ...events, ['END:VCALENDAR']].flat().map(fold).join('\r\n') + '\r\n';
}

/** One activity as an .ics file (add it to Google Calendar, Outlook or Apple Calendar). */
workRoutes.get('/orgs/:org/activities/:id/ics', async (c) => {
  const a = await requireOrg(c);
  const r = await getRow(c.env.DB, ENTITIES.activity, a.orgId, c.req.param('id'));
  if (!r || r.deleted_at) throw notFound('Activity');
  assertRecord(a, 'activities', 'view', r);
  if (!r.due_date) throw badRequest('This activity has no date');
  let url = '';
  try {
    url = crmUrl(c.env, recordLink(a.orgId, 'activity', r.id));
  } catch {
    url = '';
  }
  return new Response(calendar(a.org.name, [vevent(r, url, a.org.timezone || 'UTC')]), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="activity-${r.id}.ics"`, 'Cache-Control': 'no-store' },
  });
});

workRoutes.get('/orgs/:org/calendar-feed', async (c) => {
  const a = await requireOrg(c);
  const f = await c.env.DB.prepare('SELECT id, created_at, last_used_at FROM crm_calendar_feeds WHERE org_id = ? AND user_id = ? AND revoked_at IS NULL').bind(a.orgId, a.userId).first<any>();
  return c.json(f ? { active: true, createdAt: f.created_at, lastUsedAt: f.last_used_at } : { active: false });
});

/** A private address calendar programs can subscribe to (the person's open activities with a date). A new one replaces the old. */
workRoutes.post('/orgs/:org/calendar-feed', async (c) => {
  const a = await requireOrg(c);
  await rateLimit(c.env.DB, `crm-feed:${a.userId}`, 10, 3_600_000);
  const token = randomToken(32);
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_calendar_feeds SET revoked_at = ? WHERE org_id = ? AND user_id = ? AND revoked_at IS NULL').bind(t, a.orgId, a.userId),
    c.env.DB.prepare('INSERT INTO crm_calendar_feeds (id, org_id, user_id, token_hash, created_at) VALUES (?, ?, ?, ?, ?)').bind(newId(), a.orgId, a.userId, await sha256Hex(token), t),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'calendar_feed.created', targetType: 'user', targetId: a.userId, ip: clientIp(c) }),
  ]);
  let url: string;
  try {
    url = crmUrl(c.env, `/api/crm-public/calendar/${token}.ics`);
  } catch (e) {
    throw new HttpError(503, `Calendar addresses cannot be created: ${e instanceof Error ? e.message : 'the app address is not configured'}`);
  }
  return c.json({ url }, 201);
});

workRoutes.delete('/orgs/:org/calendar-feed', async (c) => {
  const a = await requireOrg(c);
  await c.env.DB.prepare('UPDATE crm_calendar_feeds SET revoked_at = ? WHERE org_id = ? AND user_id = ? AND revoked_at IS NULL').bind(now(), a.orgId, a.userId).run();
  return c.json({ ok: true });
});

/** The feed itself: public address, secret token; membership is checked on every read. */
export const publicCalendarRoutes = new Hono<AppEnv>();
publicCalendarRoutes.get('/calendar/:file', async (c) => {
  const m = /^([A-Za-z0-9_-]{20,200})\.ics$/.exec(c.req.param('file'));
  if (!m) throw notFound('Calendar');
  await rateLimit(c.env.DB, `crm-feed-read:${clientIp(c)}`, 120, 3_600_000);
  const db = c.env.DB;
  const feed = await db.prepare('SELECT f.*, u.name AS user_name FROM crm_calendar_feeds f JOIN users u ON u.id = f.user_id WHERE f.token_hash = ? AND f.revoked_at IS NULL AND u.disabled_at IS NULL').bind(await sha256Hex(m[1])).first<any>();
  if (!feed) throw notFound('Calendar');
  const a = await loadAccess(db, feed.org_id, { id: feed.user_id, name: feed.user_name }).catch(() => null);
  if (!a) throw notFound('Calendar');
  const today = todayIn(a.org.timezone);
  const from = new Date(Date.parse(`${today}T00:00:00Z`) - 30 * 86_400_000).toISOString().slice(0, 10);
  const rows = await db
    .prepare("SELECT * FROM crm_activities WHERE org_id = ? AND assigned_to = ? AND deleted_at IS NULL AND status != 'cancelled' AND due_date IS NOT NULL AND due_date >= ? ORDER BY due_date LIMIT 1000")
    .bind(a.orgId, a.userId, from)
    .all<any>();
  await db.prepare('UPDATE crm_calendar_feeds SET last_used_at = ? WHERE id = ?').bind(now(), feed.id).run();
  let base = '';
  try {
    base = crmUrl(c.env, '');
  } catch {
    base = '';
  }
  return new Response(calendar(`${a.org.name} CRM`, rows.results.map((r) => vevent(r, base ? `${base.replace(/\/$/, '')}${recordLink(a.orgId, 'activity', r.id)}` : '', a.org.timezone || 'UTC'))), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'private, max-age=900' },
  });
});

// ------------------------------------------------------------------ Project Management link

/** Projects (boards) in Project Management where the person may add tasks. */
workRoutes.get('/project-targets', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare(
    `SELECT b.id, b.name, b.workspace_id, w.name AS workspace_name FROM boards b JOIN workspaces w ON w.id = b.workspace_id AND w.deleted_at IS NULL
     JOIN workspace_members m ON m.workspace_id = b.workspace_id AND m.user_id = ? AND m.status = 'active' AND m.role NOT IN ('viewer','guest')
     WHERE b.kind = 'board' AND b.archived_at IS NULL AND (b.visibility = 'workspace' OR m.role IN ('owner','admin') OR EXISTS (SELECT 1 FROM board_members bm WHERE bm.board_id = b.id AND bm.user_id = ? AND bm.role != 'viewer'))
     ORDER BY w.name COLLATE NOCASE, b.name COLLATE NOCASE LIMIT 300`,
  )
    .bind(user.id, user.id)
    .all<{ id: string; name: string; workspace_id: string; workspace_name: string }>();
  return c.json(rows.results.map((r) => ({ boardId: r.id, boardName: r.name, workspaceId: r.workspace_id, workspaceName: r.workspace_name })));
});

/**
 * Turn a CRM activity into a task in Project Management, with Project Management's own permission checks; the task
 * links back to the CRM and the activity remembers the task.
 */
workRoutes.post('/orgs/:org/activities/:id/project-task', async (c) => {
  const a = await requireOrg(c);
  const db = c.env.DB;
  const act = await getRow(db, ENTITIES.activity, a.orgId, c.req.param('id'));
  if (!act || act.deleted_at) throw notFound('Activity');
  assertRecord(a, 'activities', 'view', act);
  if (act.pm_item_id) throw new HttpError(409, 'This activity already has a project task');
  const { boardId } = await body(c, z.object({ boardId: z.string().max(64) }));
  const { requireProject } = await import('../services/access');
  const { createItem } = await import('../services/item-ops');
  const { svcFromContext } = await import('../services/context');
  const p = await requireProject(db, boardId, a.userId, 'createTasks');
  let link = '';
  try {
    link = crmUrl(c.env, recordLink(a.orgId, 'activity', act.id));
  } catch {
    link = '';
  }
  const context = [act.deal_title && `Deal: ${act.deal_title}`, act.company_name && `Company: ${act.company_name}`, act.contact_name && `Contact: ${act.contact_name}`].filter(Boolean).join('\n');
  const item = await createItem(svcFromContext(c), p.board, {
    name: act.title,
    description: [act.description, context, link && `From BIZOMAT CRM (${a.org.name}): ${link}`].filter(Boolean).join('\n\n').slice(0, 10_000),
  });
  await db.batch([
    db.prepare('UPDATE crm_activities SET pm_workspace_id = ?, pm_item_id = ?, updated_at = ? WHERE org_id = ? AND id = ?').bind(p.board.workspace_id, item.id, now(), a.orgId, act.id),
    eventStmt(db, { orgId: a.orgId, type: 'project_task', actorId: a.userId, refs: { contactId: act.contact_id, companyId: act.company_id, dealId: act.deal_id, leadId: act.lead_id }, summary: `Project task created in ${p.board.name}: ${act.title}` }),
  ]);
  return c.json({ workspaceId: p.board.workspace_id, itemId: item.id, path: `/tasks/w/${p.board.workspace_id}/tasks/${item.id}` }, 201);
});
