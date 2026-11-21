// The modules framework's API under /api/erp/c/:company (signed in; the ERP's company, roles and module switches):
//
//   GET  /catalogue                       the 97-module catalogue with where each module stands and opens
//   GET  /x/modules                       the framework modules this person can open, with counts
//   GET  /x/m/:module                     a module's overview: its kinds of record, counts by status, due soon, mine
//   GET  /x/o/:object                     a list (q, status, f.<field>, mine, assigned, overdue, archived, sort, dir, paging, CSV)
//   POST /x/o/:object                     a new record {data, lines}
//   POST /x/o/:object/import              CSV import, checked whole before anything is saved {csv, dryRun}
//   GET  /x/o/:object/report/:report      a report (CSV with format=csv)
//   GET  /x/o/:object/:id                 a record with its lines, steps, actions, related records, files, comments, history
//   PATCH /x/o/:object/:id                a change {data, lines, version}
//   POST /x/o/:object/:id/step/:step      a workflow step {note}
//   POST /x/o/:object/:id/action/:action  an action {input}
//   DELETE /x/o/:object/:id               delete a draft nobody refers to; ?archive=1 archives; POST .../restore
//   POST /x/o/:object/:id/comments, POST /x/o/:object/:id/files, GET|DELETE /x/files/:id
//   GET  /x/lookup/:kind                  options for a reference field
//   GET  /x/inbox                         waiting for me: approvals, my steps, assigned to me, due soon
//   GET  /x/search                        one search across the modules' records and the ERP's products, suppliers, orders
//   GET|POST|DELETE /x/views              saved list filters
//   GET  /x/alerts, POST /x/alerts/read   the person's ERP alerts
//   GET  /x/payslips                      the person's own payslips
//   GET  /x/price                         the price check (price lists and promotions)
//   GET|PUT /x/postings                   the accounts depreciation, pay runs and revenue post to in Finance
//   POST /x/postings/run                  post every asset's depreciation or every schedule's earned revenue up to a date
//   GET  /x/consolidation                 the group's consolidated profit and loss and balance sheet (CSV with format=csv)
//   GET|POST /x/fields/:object, PATCH /x/fields/:object/:key   custom fields (ERP administrators)
// Records are the company's only (404 otherwise); sensitive fields are left out for people who may not read them.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../../lib/util';
import { rateLimit } from '../../auth/rate-limit';
import { MAX_FILE_BYTES, validateUpload } from '../../routes/files';
import { moduleEnabled, type ModuleKey } from '../../platform/flags';
import { parseCsv } from '../../../shared/crm/csv';
import { CATALOGUE, AREAS, STATUS_LABELS } from '../../../shared/erp-catalogue';
import { FRAMEWORK_SWITCHES, MODULE_BY_KEY, MODULE_DEFS, OBJECT_BY_KEY, type FieldDef, type ObjectDef, type RefKind } from '../../../shared/erp-objects';
import { can, requireErp, type ErpAccess } from '../access';
import { csvResponse, eventStmt, historyOf, likeOf, paging, wantsCsv } from '../util';
import { defOf, isEditable, labelsOf, mergeData, requireFields, sensitiveEditable, loadRow, mayEdit, mayStep, objAccess, reachable, relation, sensitiveVisible, shown, visibleSql, type Data, type ObjAccess, type RecordRow } from './engine';
import { checkRef, lookup } from './refs';
import { linesOf, removeRecord, saveRecord, takeStep, todayUtc, unarchiveRecord } from './store';
import { runAction } from './actions';
import { reportsOf, runReport } from './reports';
import { consolidate } from './intercompany';
import { customerRefsFor, loadPricing, suggest } from './pricing';
import { CUSTOM_TYPES, CUSTOM_TYPE_LABELS, addCustom, changeCustom, listCustom, withCustom } from './custom';
import { KIND_LABELS, POSTING_OF, financeTarget, postRecord, postingSettings, postingsOf, savePostingSettings, type PostingKind } from './postings';

export const objectRoutes = new Hono<AppEnv>();

const user = (c: Context<AppEnv>) => c.get('user') as { id: string; name: string };

/** The ERP company and access, then the framework module's switch (403 when a platform admin switched it off). */
async function enter(c: Context<AppEnv>, def?: ObjectDef): Promise<ErpAccess> {
  const a = await requireErp(c, 'products.view');
  if (def) {
    const m = MODULE_BY_KEY[def.module];
    if (m && !(await moduleEnabled(c.env.DB, m.switch as ModuleKey, a.companyId).catch(() => true))) throw new HttpError(403, `${FRAMEWORK_SWITCHES[m.switch as keyof typeof FRAMEWORK_SWITCHES]} is switched off for this company. Ask BIZOMAT support if you need it.`, { code: 'MODULE_DISABLED', module: m.switch });
  }
  return a;
}

/** The kind of record in the address, with the company's custom fields, after enter(). */
async function enterObject(c: Context<AppEnv>): Promise<{ def: ObjectDef; a: ErpAccess }> {
  const base = defOf(c.req.param('object') ?? '');
  const a = await enter(c, base);
  return { a, def: await withCustom(c.env.DB, a.companyId, base) };
}

function objectInfo(x: ObjAccess, a: ErpAccess) {
  const d = x.def;
  return {
    key: d.key,
    module: d.module,
    label: d.label,
    plural: d.plural,
    title: d.title,
    closed: d.closed ?? [],
    what: d.what,
    notice: d.notice ?? null,
    can: { view: x.view, create: !d.noCreate && (x.edit || x.self), edit: x.edit, approve: x.approve, self: x.self, import: x.edit && !d.noCreate, own: !!d.ownField, customFields: x.admin },
    reports: reportsOf(d),
    /** Sensitive fields this person may set (the others are left out of their forms). */
    sensitiveEditable: d.fields.filter((f) => f.sensitive && sensitiveEditable(x, a, f)).map((f) => f.key),
  };
}

async function switchesOn(c: Context<AppEnv>, a: ErpAccess) {
  const out: Record<string, boolean> = {};
  for (const k of Object.keys(FRAMEWORK_SWITCHES)) out[k] = await moduleEnabled(c.env.DB, k as ModuleKey, a.companyId).catch(() => true);
  return out;
}

// ------------------------------------------------------------------ catalogue and modules

objectRoutes.get('/c/:company/catalogue', async (c) => {
  const a = await enter(c);
  const on = await switchesOn(c, a);
  const modules = CATALOGUE.map((e) => {
    const m = e.module ? MODULE_BY_KEY[e.module] : null;
    const opens = m ? m.objects.some((k) => reachable(objAccess(a, OBJECT_BY_KEY[k]))) : true;
    return { ...e, statusLabel: STATUS_LABELS[e.status], areaLabel: AREAS[e.area], path: e.path?.replace('{co}', encodeURIComponent(a.companyId)) ?? null, switchOn: m ? on[m.switch] !== false : true, opens };
  });
  const counts = { total: modules.length, live: 0, improved: 0, new: 0, partial: 0, planned: 0 } as Record<string, number>;
  for (const m of modules) counts[m.status]++;
  return c.json({ company: { id: a.companyId, name: a.companyName }, areas: AREAS, statuses: STATUS_LABELS, counts, modules });
});

objectRoutes.get('/c/:company/x/modules', async (c) => {
  const a = await enter(c);
  const on = await switchesOn(c, a);
  const rows = await c.env.DB.prepare('SELECT object, COUNT(*) AS n FROM erp_objects WHERE company_id = ? AND archived_at IS NULL GROUP BY object').bind(a.companyId).all<{ object: string; n: number }>();
  const total = new Map(rows.results.map((r) => [r.object, r.n]));
  return c.json({
    modules: MODULE_DEFS.map((m) => {
      const objects = m.objects.map((k) => objAccess(a, OBJECT_BY_KEY[k])).filter(reachable);
      return { key: m.key, label: m.label, area: m.area, catalogue: m.catalogue, summary: m.summary, icon: m.icon, limits: m.limits ?? [], switchOn: on[m.switch] !== false, opens: objects.length > 0 && on[m.switch] !== false, records: objects.reduce((s, x) => s + (x.view ? (total.get(x.def.key) ?? 0) : 0), 0) };
    }),
  });
});

objectRoutes.get('/c/:company/x/m/:module', async (c) => {
  const m = MODULE_BY_KEY[c.req.param('module')];
  if (!m) throw notFound('Module');
  const a = await enter(c, OBJECT_BY_KEY[m.objects[0]]);
  const db = c.env.DB;
  const today = todayUtc();
  const objects = [];
  for (const k of m.objects) {
    const x = objAccess(a, OBJECT_BY_KEY[k]);
    if (!reachable(x)) continue;
    const vis = visibleSql(x, a.userId);
    const [byStatus, due, mine] = await db.batch([
      db.prepare(`SELECT e.status, COUNT(*) AS n FROM erp_objects e WHERE e.company_id = ? AND e.object = ? AND e.archived_at IS NULL AND ${vis.sql} GROUP BY e.status`).bind(a.companyId, k, ...vis.args),
      db.prepare(`SELECT COUNT(*) AS n FROM erp_objects e WHERE e.company_id = ? AND e.object = ? AND e.archived_at IS NULL AND e.due_date IS NOT NULL AND e.due_date <= ? AND e.status NOT IN (${(x.def.closed ?? []).map(() => '?').join(',') || "''"}) AND ${vis.sql}`).bind(a.companyId, k, addDaysIso(today, 14), ...(x.def.closed ?? []), ...vis.args),
      db.prepare('SELECT COUNT(*) AS n FROM erp_objects e WHERE e.company_id = ? AND e.object = ? AND e.archived_at IS NULL AND (e.owner_user_id = ? OR e.assignee_id = ?)').bind(a.companyId, k, a.userId, a.userId),
    ]);
    objects.push({ ...objectInfo(x, a), statuses: x.def.statuses, counts: Object.fromEntries((byStatus.results as any[]).map((r) => [r.status, r.n])), dueSoon: (due.results[0] as any)?.n ?? 0, mine: (mine.results[0] as any)?.n ?? 0 });
  }
  if (!objects.length) throw new HttpError(403, `Your ERP roles do not include ${m.label}. An ERP administrator gives roles on the ERP roles page.`);
  const recent = await db
    .prepare(`SELECT e.id, e.object, e.number, e.title, e.status, e.updated_at FROM erp_objects e WHERE e.company_id = ? AND e.object IN (${objects.map(() => '?').join(',')}) AND e.archived_at IS NULL ORDER BY e.updated_at DESC LIMIT 60`)
    .bind(a.companyId, ...objects.map((o) => o.key))
    .all<any>();
  const visible = recent.results.filter((r) => {
    const x = objAccess(a, OBJECT_BY_KEY[r.object]);
    return x.view;
  });
  return c.json({ module: { key: m.key, label: m.label, summary: m.summary, area: m.area, catalogue: m.catalogue, limits: m.limits ?? [], icon: m.icon }, objects, recent: visible.slice(0, 12).map((r) => ({ id: r.id, object: r.object, number: r.number, title: r.title, status: r.status, updatedAt: r.updated_at })) });
});

const addDaysIso = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

// ------------------------------------------------------------------ lists

const SORTS: Record<string, string> = { number: 'e.number', title: 'e.title COLLATE NOCASE', status: 'e.status', updated: 'e.updated_at', created: 'e.created_at', date: 'e.date', due: 'e.due_date', amount: 'e.amount_cents' };

function listQuery(c: Context<AppEnv>, a: ErpAccess, x: ObjAccess) {
  const def = x.def;
  const vis = visibleSql(x, a.userId);
  // the company itself is named in each statement (WHERE e.company_id = ? AND ...)
  const where: string[] = ['e.object = ?', vis.sql];
  const args: unknown[] = [def.key, ...vis.args];
  const q = c.req.query('q');
  if (q && q.trim()) {
    where.push('e.search LIKE ?');
    args.push(likeOf(q));
  }
  where.push(c.req.query('archived') === '1' ? 'e.archived_at IS NOT NULL' : 'e.archived_at IS NULL');
  const status = c.req.query('status');
  if (status) {
    const list = status.split(',').filter((s) => def.statuses.some((t) => t.key === s));
    if (list.length) {
      where.push(`e.status IN (${list.map(() => '?').join(',')})`);
      args.push(...list);
    }
  } else if (c.req.query('open') === '1' && def.closed?.length) {
    where.push(`e.status NOT IN (${def.closed.map(() => '?').join(',')})`);
    args.push(...def.closed);
  }
  if (c.req.query('mine') === '1') {
    where.push('e.owner_user_id = ?');
    args.push(a.userId);
  }
  if (c.req.query('assigned') === '1') {
    where.push('e.assignee_id = ?');
    args.push(a.userId);
  }
  if (c.req.query('overdue') === '1') {
    where.push(`e.due_date IS NOT NULL AND e.due_date < ?${def.closed?.length ? ` AND e.status NOT IN (${def.closed.map(() => '?').join(',')})` : ''}`);
    args.push(todayUtc(), ...(def.closed ?? []));
  }
  const from = c.req.query('from');
  const to = c.req.query('to');
  if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) {
    where.push('e.date >= ?');
    args.push(from);
  }
  if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) {
    where.push('e.date <= ?');
    args.push(to);
  }
  // field filters: f.<field>=value (select, bool and reference fields the person may read)
  for (const f of def.fields) {
    const v = c.req.query(`f.${f.key}`);
    if (!v || !f.filter || !['select', 'bool', 'ref', 'currency', 'country'].includes(f.type)) continue;
    if (f.sensitive && !sensitiveVisible(x, a, f, false)) continue;
    if (f.type === 'bool') {
      where.push(`json_extract(e.data_json, '$.${f.key}') = ?`);
      args.push(v === '1' || v === 'true' ? 1 : 0);
    } else {
      where.push(`json_extract(e.data_json, '$.${f.key}') = ?`);
      args.push(v.slice(0, 140));
    }
  }
  const sortKey = c.req.query('sort') ?? 'updated';
  const field = sortKey.startsWith('f.') ? def.fields.find((f) => f.key === sortKey.slice(2) && !f.sensitive) : undefined;
  const sort = field ? `json_extract(e.data_json, '$.${field.key}')` : (SORTS[sortKey] ?? 'e.updated_at');
  const dir = c.req.query('dir') === 'asc' ? 'ASC' : c.req.query('dir') === 'desc' ? 'DESC' : sortKey === 'updated' || sortKey === 'created' ? 'DESC' : 'ASC';
  return { where: where.join(' AND '), args, order: `${sort} ${dir}, e.rowid DESC` };
}

function cell(f: FieldDef, v: unknown, label: string | undefined) {
  if (v === null || v === undefined) return '';
  if (f.type === 'money') return (Number(v) / 100).toFixed(2);
  if (f.type === 'ref') return label ?? '';
  if (f.type === 'select') return f.options?.[String(v)] ?? String(v);
  if (f.type === 'bool') return v ? 'yes' : 'no';
  return String(v);
}

objectRoutes.get('/c/:company/x/o/:object', async (c) => {
  const { def, a } = await enterObject(c);
  const x = objAccess(a, def);
  if (!reachable(x)) throw new HttpError(403, `Your ERP roles do not include ${def.plural.toLowerCase()}`);
  const db = c.env.DB;
  const lq = listQuery(c, a, x);
  const csv = wantsCsv(c);
  const { limit, offset } = csv ? { limit: 5000, offset: 0 } : paging(c);
  const [rows, total] = await db.batch([
    db.prepare(`SELECT e.*, u.name AS created_by_name FROM erp_objects e LEFT JOIN users u ON u.id = e.created_by WHERE e.company_id = ? AND ${lq.where} ORDER BY ${lq.order} LIMIT ? OFFSET ?`).bind(a.companyId, ...lq.args, limit, offset),
    db.prepare(`SELECT COUNT(*) AS n FROM erp_objects e WHERE e.company_id = ? AND ${lq.where}`).bind(a.companyId, ...lq.args),
  ]);
  const list = rows.results as (RecordRow & { created_by_name: string | null })[];
  const labels = await labelsOf(db, a.companyId, list.map((r) => r.id));
  const records = list.map((r) => shown(x, a, r, labels.get(r.id) ?? {}));
  if (csv) {
    const fields = def.fields.filter((f) => !f.sensitive || sensitiveVisible(x, a, f, false));
    return csvResponse(`${def.plural.toLowerCase().replace(/\s+/g, '-')}-${todayUtc()}`, [
      ['Number', 'Status', ...fields.map((f) => f.label), 'Created', 'Updated'],
      ...records.map((r) => [r.number, def.statuses.find((s) => s.key === r.status)?.label ?? r.status, ...fields.map((f) => cell(f, r.data[f.key], r.labels[f.key])), new Date(r.createdAt).toISOString().slice(0, 10), new Date(r.updatedAt).toISOString().slice(0, 10)]),
    ]);
  }
  return c.json({ object: { ...objectInfo(x, a), fields: def.fields, statuses: def.statuses }, records, total: (total.results[0] as any)?.n ?? 0 });
});

const zSave = z.object({ data: z.record(z.string(), z.unknown()).default({}), lines: z.array(z.record(z.string(), z.unknown())).max(2000).optional(), version: z.number().int().positive().optional() });

objectRoutes.post('/c/:company/x/o/:object', async (c) => {
  const { def, a } = await enterObject(c);
  await rateLimit(c.env.DB, `erp-obj:${a.userId}`, 240, 60_000);
  const input = await body(c, zSave);
  const row = await saveRecord(c.env, a, user(c), def, { input: input.data as Data, lines: def.lines ? (input.lines ?? []) : undefined });
  return c.json(await detail(c, a, def, row), 201);
});

// ------------------------------------------------------------------ CSV import (whole file checked first)

objectRoutes.post('/c/:company/x/o/:object/import', async (c) => {
  const { def, a } = await enterObject(c);
  const x = objAccess(a, def);
  if (!x.edit || def.noCreate) throw new HttpError(403, `Your ERP roles do not let you import ${def.plural.toLowerCase()}`);
  await rateLimit(c.env.DB, `erp-import:${a.userId}`, 10, 60_000);
  const input = await body(c, z.object({ csv: z.string().min(1).max(1_000_000), dryRun: z.boolean().optional() }));
  const rows = parseCsv(input.csv, 501);
  if (rows.length < 2) throw new HttpError(400, 'Give a header row and at least one record');
  if (rows.length > 501) throw new HttpError(400, 'At most 500 records at a time');
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const fields = def.fields.filter((f) => !f.computed && (!f.sensitive || sensitiveVisible(x, a, f, false)));
  const col = new Map<string, number>();
  for (const f of fields) {
    const i = header.findIndex((h) => h === f.label.toLowerCase() || h === f.key.toLowerCase());
    if (i >= 0) col.set(f.key, i);
  }
  if (!col.size) throw new HttpError(400, `No column matches a field. Use the field names: ${fields.map((f) => f.label).join(', ')}`);
  const refCache = new Map<string, string | null>();
  const parsed: Data[] = [];
  const errors: { row: number; message: string }[] = [];
  for (let r = 1; r < rows.length; r++) {
    const data: Data = {};
    try {
      for (const f of fields) {
        const i = col.get(f.key);
        if (i === undefined) continue;
        let v: unknown = rows[r][i] ?? '';
        if (typeof v === 'string' && v.trim() === '') continue;
        if (f.type === 'money') v = Math.round(Number(String(v).replace(/[$,\s]/g, '')) * 100);
        else if (f.type === 'select' && f.options && !Object.hasOwn(f.options, String(v))) {
          const k = Object.entries(f.options).find(([, l]) => l.toLowerCase() === String(v).trim().toLowerCase())?.[0];
          if (k) v = k;
        } else if (f.type === 'ref') {
          // a reference by its number or name, as the lookup finds it
          const key = `${f.key}:${String(v).trim().toLowerCase()}`;
          if (!refCache.has(key)) {
            const opts = await lookup(c.env.DB, a, user(c), f.ref as RefKind, String(v).trim(), async (k) => visibleFor(a, k));
            const hit = opts.find((o) => o.label.toLowerCase() === String(v).trim().toLowerCase() || o.label.toLowerCase().startsWith(`${String(v).trim().toLowerCase()} `)) ?? (opts.length === 1 ? opts[0] : null);
            refCache.set(key, hit?.id ?? null);
          }
          v = refCache.get(key);
          if (!v) throw new HttpError(400, `${f.label}: ${rows[r][i]} not found in this company`);
        }
        data[f.key] = v;
      }
      // every field checked now, so nothing is saved unless every row is right
      requireFields(def, mergeData(def, data, null, () => true));
      parsed.push(data);
    } catch (e) {
      errors.push({ row: r + 1, message: e instanceof HttpError ? e.message : 'Could not read this row' });
    }
  }
  if (errors.length) return c.json({ ok: false, errors: errors.slice(0, 50), checked: rows.length - 1 }, 400);
  // every row is checked against the rules (without saving) before any is saved
  const made: { id: string; number: string }[] = [];
  if (input.dryRun) return c.json({ ok: true, checked: parsed.length, made: [] });
  for (let i = 0; i < parsed.length; i++) {
    try {
      const row = await saveRecord(c.env, a, user(c), def, { input: parsed[i], lines: def.lines ? [] : undefined });
      made.push({ id: row.id, number: row.number });
    } catch (e) {
      return c.json({ ok: false, errors: [{ row: i + 2, message: e instanceof HttpError ? e.message : 'Could not save this row' }], made }, made.length ? 207 : 400);
    }
  }
  await c.env.DB.batch([eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'record.imported', entityType: 'record', entityId: null, summary: `${made.length} ${def.plural.toLowerCase()} imported from CSV`, at: now() })]);
  return c.json({ ok: true, checked: parsed.length, made }, 201);
});

async function visibleFor(a: ErpAccess, key: string) {
  const d = OBJECT_BY_KEY[key];
  if (!d) return null;
  const x = objAccess(a, d);
  if (!reachable(x)) return null;
  return visibleSql(x, a.userId);
}

// ------------------------------------------------------------------ reports

objectRoutes.get('/c/:company/x/o/:object/report/:report', async (c) => {
  const { def, a } = await enterObject(c);
  const x = objAccess(a, def);
  if (!reachable(x)) throw new HttpError(403, `Your ERP roles do not include ${def.plural.toLowerCase()}`);
  const r = await runReport(c.env.DB, a, x, c.req.param('report'), todayUtc());
  if (wantsCsv(c)) return csvResponse(`${def.key}-${r.key}-${todayUtc()}`, [r.columns.map((k) => k.label), ...r.rows.map((row) => r.columns.map((k) => (k.kind === 'money' && typeof row[k.key] === 'number' ? ((row[k.key] as number) / 100).toFixed(2) : (row[k.key] ?? '') as string)))]);
  return c.json({ report: r });
});

// ------------------------------------------------------------------ one record

async function detail(c: Context<AppEnv>, a: ErpAccess, def: ObjectDef, row: RecordRow) {
  const db = c.env.DB;
  const x = objAccess(a, def);
  const labels = (await labelsOf(db, a.companyId, [row.id])).get(row.id) ?? {};
  const creator = row.created_by ? await db.prepare('SELECT name FROM users WHERE id = ?').bind(row.created_by).first<{ name: string }>() : null;
  const rec = shown(x, a, { ...row, created_by_name: creator?.name ?? null }, labels);
  const own = relation(x, row, a.userId).own;
  const lines = def.lines ? await linesOf(db, a.companyId, row.id) : null;
  const hiddenLine = def.lines?.fields.filter((f) => !sensitiveVisible(x, a, f, own)).map((f) => f.key) ?? [];
  const lineLabels: Record<string, string> = {};
  for (const [k, v] of Object.entries(labels)) if (k.startsWith('line:')) lineLabels[k] = v;
  // related: what refers to this record (other framework records), each only if the person may see it
  const inbound = await db
    .prepare("SELECT r.record_id, r.field, e.object, e.number, e.title, e.status, e.owner_user_id, e.assignee_id, e.approver_id FROM erp_object_refs r JOIN erp_objects e ON e.company_id = r.company_id AND e.id = r.record_id WHERE r.company_id = ? AND r.kind = ? AND r.target_id = ? AND e.archived_at IS NULL ORDER BY e.updated_at DESC LIMIT 100")
    .bind(a.companyId, `obj:${def.key}`, row.id)
    .all<any>();
  const related = inbound.results
    .filter((r) => OBJECT_BY_KEY[r.object] && relation(objAccess(a, OBJECT_BY_KEY[r.object]), r, a.userId).sees)
    .map((r) => ({ id: r.record_id, object: r.object, module: OBJECT_BY_KEY[r.object].module, objectLabel: OBJECT_BY_KEY[r.object].label, number: r.number, title: r.title, status: r.status, via: r.field.startsWith('line:') ? r.field.split(':')[2] : r.field }));
  const [files, comments] = await db.batch([
    db.prepare("SELECT f.id, f.name, f.mime, f.size, f.created_at, f.uploaded_by, u.name AS uploader FROM erp_record_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.company_id = ? AND f.entity_type = 'object' AND f.entity_id = ? AND f.deleted_at IS NULL ORDER BY f.created_at DESC LIMIT 200").bind(a.companyId, row.id),
    db.prepare('SELECT m.id, m.body, m.created_at, m.author_id, u.name AS author FROM erp_object_comments m LEFT JOIN users u ON u.id = m.author_id WHERE m.company_id = ? AND m.record_id = ? ORDER BY m.created_at DESC LIMIT 200').bind(a.companyId, row.id),
  ]);
  const editable = mayEdit(x, row, a.userId);
  const steps = def.transitions.filter((t) => mayStep(x, t, row, a.userId)).map((t) => ({ key: t.key, label: t.label, to: t.to, note: t.note ?? null, confirm: t.confirm ?? null, requires: t.requires ?? [], approval: t.cap === 'approve', segregation: !!t.segregation && !a.solo && (row.created_by === a.userId || row.owner_user_id === a.userId) }));
  const rel = relation(x, row, a.userId);
  const actions = (def.actions ?? [])
    .filter((ac) => (!ac.statuses || ac.statuses.includes(row.status)) && !row.archived_at && (ac.cap === 'edit' ? x.edit : ac.cap === 'approve' ? x.approve || rel.approver : x.edit || rel.own))
    .map((ac) => ({ key: ac.key, label: ac.label, what: ac.what, confirm: ac.confirm ?? null, input: ac.input ?? [] }));
  return {
    object: { ...objectInfo(x, a), fields: def.fields, statuses: def.statuses, lines: def.lines ?? null },
    record: rec,
    lines: lines?.map((l) => Object.fromEntries(Object.entries(l).filter(([k]) => !hiddenLine.includes(k)))) ?? null,
    lineLabels,
    can: { edit: editable, editLines: !!def.lines && editable && (def.lines.editableIn ?? def.editable ?? def.statuses.map((s) => s.key).filter((s) => !(def.closed ?? []).includes(s))).includes(row.status), remove: x.edit || (x.self && rel.own && row.status === def.initial), archive: x.edit, comment: rel.sees, attach: editable || x.edit || rel.own || rel.assigned },
    steps,
    actions,
    related,
    files: (files.results as any[]).map((f) => ({ id: f.id, name: f.name, mime: f.mime, size: f.size, isImage: String(f.mime).startsWith('image/'), uploadedBy: f.uploaded_by, uploadedByName: f.uploader ?? null, createdAt: f.created_at, url: `/api/erp/c/${a.companyId}/x/files/${f.id}` })),
    comments: (comments.results as any[]).map((m) => ({ id: m.id, body: m.body, at: m.created_at, authorId: m.author_id, author: m.author ?? null })),
    history: await historyOf(db, a.companyId, { entityType: 'record', entityId: row.id }, 100),
    editableStatus: isEditable(def, row.status),
    postings: POSTING_OF[def.key] ? await postingsDTO(db, a.companyId, def.key, row.id) : null,
  };
}

async function postingsDTO(db: D1Database, companyId: string, object: string, id: string) {
  const list = await postingsOf(db, companyId, object, id);
  const org = await db.prepare("SELECT target_org_id FROM erp_integration_events WHERE company_id = ? AND source_type = ? AND source_id = ? AND kind IN ('finance.journal', 'finance.reversed') ORDER BY created_at DESC LIMIT 1").bind(companyId, object, id).first<{ target_org_id: string }>();
  // one row per journal (a catch-up journal covers several months, each its own key)
  const byJournal = new Map<string, { number: number | null; date: string | null; amount: number; covers: string[]; reversed: boolean; reversalNumber: number | null }>();
  for (const p of list) {
    const label = p.part === 'whole' ? 'Pay run' : p.part === 'deferral' ? 'Moved to deferred revenue' : p.part;
    const j = byJournal.get(p.journalId);
    if (j) {
      j.covers.unshift(label);
      j.amount = Math.max(j.amount, p.amount);
    } else byJournal.set(p.journalId, { number: p.number, date: p.date, amount: p.amount, covers: [label], reversed: p.reversed, reversalNumber: p.reversalNumber });
  }
  const cur = org ? await db.prepare('SELECT currency FROM fin_orgs WHERE id = ?').bind(org.target_org_id).first<{ currency: string }>() : null;
  // amounts are in the record's currency; a record without one (a cost allocation) posts in the workspace's
  return { journals: [...byJournal.values()].map((j) => ({ ...j, covers: j.covers.sort().join(', ') })), url: org ? `/erp/finance/o/${org.target_org_id}/accounting/journals` : null, currency: cur?.currency ?? null };
}

async function visibleRow(c: Context<AppEnv>, a: ErpAccess, def: ObjectDef, id: string) {
  const row = await loadRow(c.env.DB, a.companyId, def, id);
  if (!relation(objAccess(a, def), row, a.userId).sees) throw notFound(def.label);
  return row;
}

objectRoutes.get('/c/:company/x/o/:object/:id', async (c) => {
  const { def, a } = await enterObject(c);
  return c.json(await detail(c, a, def, await visibleRow(c, a, def, c.req.param('id'))));
});

objectRoutes.patch('/c/:company/x/o/:object/:id', async (c) => {
  const { def, a } = await enterObject(c);
  await rateLimit(c.env.DB, `erp-obj:${a.userId}`, 240, 60_000);
  const input = await body(c, zSave);
  const row = await saveRecord(c.env, a, user(c), def, { id: c.req.param('id'), input: input.data as Data, lines: input.lines, version: input.version });
  return c.json(await detail(c, a, def, row));
});

objectRoutes.post('/c/:company/x/o/:object/:id/step/:step', async (c) => {
  const { def, a } = await enterObject(c);
  const input = await body(c, z.object({ note: z.string().max(2000).optional().nullable() }));
  const row = await takeStep(c.env, a, user(c), def, c.req.param('id'), c.req.param('step'), input.note ?? null, (p) => c.executionCtx.waitUntil(p));
  return c.json(await detail(c, a, def, row));
});

objectRoutes.post('/c/:company/x/o/:object/:id/action/:action', async (c) => {
  const { def, a } = await enterObject(c);
  await rateLimit(c.env.DB, `erp-action:${a.userId}`, 60, 60_000);
  const input = await body(c, z.object({ input: z.record(z.string(), z.unknown()).optional() }));
  const r = await runAction(c.env, a, user(c), def, c.req.param('id'), c.req.param('action'), (input.input ?? {}) as Data, (p) => c.executionCtx.waitUntil(p), !!c.get('session'));
  const row = r.record ? await loadRow(c.env.DB, a.companyId, def, r.record.id) : null;
  return c.json({ message: r.message, link: r.link ?? null, result: r.result ?? null, detail: row ? await detail(c, a, def, row) : null });
});

objectRoutes.delete('/c/:company/x/o/:object/:id', async (c) => {
  const { def, a } = await enterObject(c);
  const row = await removeRecord(c.env.DB, a, def, c.req.param('id'), c.req.query('archive') === '1');
  return c.json(row ? await detail(c, a, def, row) : { deleted: true });
});

objectRoutes.post('/c/:company/x/o/:object/:id/restore', async (c) => {
  const { def, a } = await enterObject(c);
  return c.json(await detail(c, a, def, await unarchiveRecord(c.env.DB, a, def, c.req.param('id'))));
});

objectRoutes.post('/c/:company/x/o/:object/:id/comments', async (c) => {
  const { def, a } = await enterObject(c);
  await rateLimit(c.env.DB, `erp-comment:${a.userId}`, 60, 60_000);
  const row = await visibleRow(c, a, def, c.req.param('id'));
  const input = await body(c, z.object({ body: z.string().trim().min(1).max(5000) }));
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO erp_object_comments (id, company_id, record_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, row.id, a.userId, input.body, t),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'record.commented', entityType: 'record', entityId: row.id, summary: `Comment on ${def.label.toLowerCase()} ${row.number}`, at: t }),
  ]);
  return c.json(await detail(c, a, def, row), 201);
});

// ------------------------------------------------------------------ files (the app's file store, the same checks as every upload)

objectRoutes.post('/c/:company/x/o/:object/:id/files', async (c) => {
  const { def, a } = await enterObject(c);
  await rateLimit(c.env.DB, `erp-upload:${a.userId}`, 60, 60_000);
  const row = await visibleRow(c, a, def, c.req.param('id'));
  const x = objAccess(a, def);
  const rel = relation(x, row, a.userId);
  if (!(mayEdit(x, row, a.userId) || x.edit || rel.own || rel.assigned)) throw new HttpError(403, 'You may not add files to this record');
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const { name, type, bytes } = await validateUpload(file);
  const id = newId();
  const key = `erp/${a.companyId}/object/${row.id}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: a.userId } });
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO erp_record_files (id, company_id, entity_type, entity_id, name, mime, size, r2_key, uploaded_by, created_at) VALUES (?, ?, 'object', ?, ?, ?, ?, ?, ?, ?)").bind(id, a.companyId, row.id, name, type, bytes.byteLength, key, a.userId, t),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'file.uploaded', entityType: 'record', entityId: row.id, summary: `File added to ${def.label.toLowerCase()} ${row.number}: ${name}`, after: { file: id, name, size: bytes.byteLength }, at: t }),
  ]);
  return c.json(await detail(c, a, def, row), 201);
});

async function fileOf(c: Context<AppEnv>) {
  const a = await enter(c);
  const f = await c.env.DB.prepare("SELECT f.*, e.object FROM erp_record_files f JOIN erp_objects e ON e.company_id = f.company_id AND e.id = f.entity_id WHERE f.company_id = ? AND f.id = ? AND f.entity_type = 'object' AND f.deleted_at IS NULL").bind(a.companyId, String(c.req.param('id')).slice(0, 64)).first<any>();
  if (!f || !OBJECT_BY_KEY[f.object]) throw notFound('File');
  const def = OBJECT_BY_KEY[f.object];
  const row = await visibleRow(c, a, def, f.entity_id);
  return { a, f, def, row };
}

objectRoutes.get('/c/:company/x/files/:id', async (c) => {
  const { f } = await fileOf(c);
  const obj = await c.env.FILES.get(f.r2_key);
  if (!obj) throw notFound('File');
  const inline = c.req.query('download') !== '1' && (String(f.mime).startsWith('image/') || f.mime === 'application/pdf');
  return new Response(obj.body, {
    headers: {
      'Content-Type': f.mime,
      'Content-Length': String(f.size),
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(f.name)}`,
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
});

objectRoutes.delete('/c/:company/x/files/:id', async (c) => {
  const { a, f, def, row } = await fileOf(c);
  if (f.uploaded_by !== a.userId && !objAccess(a, def).edit) throw new HttpError(403, 'Only the person who added it, or someone who manages these records, can remove it');
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE erp_record_files SET deleted_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, f.id),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'file.removed', entityType: 'record', entityId: row.id, summary: `File removed from ${def.label.toLowerCase()} ${row.number}: ${f.name}`, before: { file: f.id, name: f.name }, at: t }),
  ]);
  c.executionCtx.waitUntil(c.env.FILES.delete(f.r2_key));
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ lookups, inbox, search

objectRoutes.get('/c/:company/x/lookup/:kind', async (c) => {
  const a = await enter(c);
  const kind = decodeURIComponent(c.req.param('kind')) as RefKind;
  const known = ['user', 'customer', 'supplier', 'product', 'warehouse', 'asset', 'project', 'department', 'purchase_order', 'sales_order', 'mfg_order', 'shipment', 'fin_workspace'];
  if (!known.includes(kind) && !(kind.startsWith('obj:') && OBJECT_BY_KEY[kind.slice(4)])) throw notFound('Lookup');
  const id = c.req.query('id');
  if (id) {
    // the label of one value (an edit form showing a value given earlier); a framework record only if the person may see it
    if (kind.startsWith('obj:')) {
      const vis = await visibleFor(a, kind.slice(4));
      const r = vis ? await c.env.DB.prepare(`SELECT e.number, e.title FROM erp_objects e WHERE e.company_id = ? AND e.object = ? AND e.id = ? AND ${vis.sql}`).bind(a.companyId, kind.slice(4), id.slice(0, 64), ...vis.args).first<{ number: string; title: string }>() : null;
      return c.json({ options: r ? [{ id, label: `${r.number} ${r.title}`.trim() }] : [] });
    }
    const label = await checkRef(c.env.DB, a, user(c), kind, id, 'Value').catch(() => null);
    return c.json({ options: label ? [{ id, label }] : [] });
  }
  return c.json({ options: await lookup(c.env.DB, a, user(c), kind, (c.req.query('q') ?? '').slice(0, 100), async (k) => visibleFor(a, k)) });
});

objectRoutes.get('/c/:company/x/inbox', async (c) => {
  const a = await enter(c);
  const db = c.env.DB;
  const today = todayUtc();
  // approvals waiting: kinds the person approves, in the statuses an approval step starts from
  const clauses: string[] = [];
  const args: unknown[] = [];
  for (const def of Object.values(OBJECT_BY_KEY)) {
    const x = objAccess(a, def);
    const from = [...new Set(def.transitions.filter((t) => t.cap === 'approve').flatMap((t) => t.from))];
    if (!from.length) continue;
    if (x.approve) {
      clauses.push(`(e.object = ? AND e.status IN (${from.map(() => '?').join(',')}))`);
      args.push(def.key, ...from);
    }
  }
  const approvals = await db
    .prepare(`SELECT e.* FROM erp_objects e WHERE e.company_id = ? AND e.archived_at IS NULL AND (${clauses.length ? clauses.join(' OR ') : '0'} OR e.approver_id = ?) ORDER BY e.status_at LIMIT 200`)
    .bind(a.companyId, ...args, a.userId)
    .all<RecordRow>();
  const mine = await db.prepare('SELECT e.* FROM erp_objects e WHERE e.company_id = ? AND e.archived_at IS NULL AND (e.assignee_id = ? OR e.owner_user_id = ?) ORDER BY e.updated_at DESC LIMIT 300').bind(a.companyId, a.userId, a.userId).all<RecordRow>();
  const item = (r: RecordRow, why: string) => {
    const def = OBJECT_BY_KEY[r.object];
    return { id: r.id, object: r.object, module: def.module, objectLabel: def.label, number: r.number, title: r.title, status: r.status, statusLabel: def.statuses.find((s) => s.key === r.status)?.label ?? r.status, dueDate: r.due_date, why, since: r.status_at };
  };
  const waiting = approvals.results
    .filter((r) => OBJECT_BY_KEY[r.object])
    .filter((r) => {
      const def = OBJECT_BY_KEY[r.object];
      const x = objAccess(a, def);
      return def.transitions.some((t) => t.cap === 'approve' && mayStep(x, t, r, a.userId));
    })
    .map((r) => item(r, 'Waiting for your approval'));
  const ownSteps = mine.results
    .filter((r) => OBJECT_BY_KEY[r.object])
    .filter((r) => {
      const def = OBJECT_BY_KEY[r.object];
      return !(def.closed ?? []).includes(r.status);
    })
    .map((r) => {
      const def = OBJECT_BY_KEY[r.object];
      const x = objAccess(a, def);
      const step = def.transitions.find((t) => t.cap === 'own' && mayStep(x, t, r, a.userId));
      return item(r, step ? `Your step: ${step.label}` : r.assignee_id === a.userId ? 'Given to you' : 'Yours');
    });
  const due = [...waiting, ...ownSteps].filter((i) => i.dueDate && i.dueDate <= addDaysIso(today, 7));
  return c.json({ waiting: waiting.slice(0, 100), mine: ownSteps.slice(0, 150), dueSoon: due.length, today });
});

objectRoutes.get('/c/:company/x/search', async (c) => {
  const a = await enter(c);
  const q = (c.req.query('q') ?? '').trim();
  if (q.length < 2) return c.json({ results: [] });
  await rateLimit(c.env.DB, `erp-search:${a.userId}`, 120, 60_000);
  const db = c.env.DB;
  const like = likeOf(q);
  const viewable = Object.values(OBJECT_BY_KEY).filter((d) => objAccess(a, d).view).map((d) => d.key);
  const rows = await db
    .prepare(`SELECT e.id, e.object, e.number, e.title, e.status FROM erp_objects e WHERE e.company_id = ? AND e.archived_at IS NULL AND e.search LIKE ? AND (e.object IN (${viewable.map(() => '?').join(',') || "''"}) OR e.owner_user_id = ? OR e.assignee_id = ? OR e.approver_id = ?) ORDER BY e.updated_at DESC LIMIT 40`)
    .bind(a.companyId, like, ...viewable, a.userId, a.userId, a.userId)
    .all<any>();
  const co = encodeURIComponent(a.companyId);
  const results: { kind: string; label: string; number: string; title: string; status: string; path: string }[] = rows.results.map((r) => {
    const def = OBJECT_BY_KEY[r.object];
    return { kind: def.label, label: def.plural, number: r.number, title: r.title, status: def.statuses.find((s) => s.key === r.status)?.label ?? r.status, path: `/c/${co}/m/${def.module}/${def.key}/${r.id}` };
  });
  const more = async (capOk: boolean, sql: string, kind: string, path: (r: any) => string, status: (r: any) => string) => {
    if (!capOk) return;
    const rs = await db.prepare(sql).bind(a.companyId, like).all<any>();
    results.push(...rs.results.map((r) => ({ kind, label: kind, number: r.number, title: r.title ?? '', status: status(r), path: path(r) })));
  };
  await more(can(a, 'products.view'), 'SELECT id, number, name AS title, lifecycle FROM erp_products WHERE company_id = ? AND archived_at IS NULL AND search LIKE ? ORDER BY number LIMIT 10', 'Product', (r) => `/c/${co}/products/${r.id}`, (r) => r.lifecycle);
  await more(can(a, 'suppliers.view'), 'SELECT id, number, legal_name AS title, status FROM erp_suppliers WHERE company_id = ? AND archived_at IS NULL AND search LIKE ? ORDER BY number LIMIT 10', 'Supplier', (r) => `/c/${co}/procurement/suppliers/${r.id}`, (r) => r.status);
  await more(can(a, 'purchasing.view'), 'SELECT id, number, notes AS title, status FROM erp_purchase_orders WHERE company_id = ? AND search LIKE ? ORDER BY created_at DESC LIMIT 10', 'Purchase order', (r) => `/c/${co}/procurement/purchase-orders/${r.id}`, (r) => r.status);
  await more(can(a, 'sales.view'), 'SELECT id, number, customer_name AS title, status FROM erp_sales_orders WHERE company_id = ? AND search LIKE ? ORDER BY created_at DESC LIMIT 10', 'Sales order', (r) => `/c/${co}/supply-chain/orders/${r.id}`, (r) => r.status);
  await more(can(a, 'manufacturing.view'), 'SELECT id, number, notes AS title, status FROM erp_mfg_orders WHERE company_id = ? AND search LIKE ? ORDER BY created_at DESC LIMIT 10', 'Manufacturing order', (r) => `/c/${co}/manufacturing/orders/${r.id}`, (r) => r.status);
  return c.json({ results: results.slice(0, 80).map((r) => ({ ...r, title: String(r.title ?? '').slice(0, 200) })) });
});

// ------------------------------------------------------------------ saved filters, alerts, payslips, price check

objectRoutes.get('/c/:company/x/views', async (c) => {
  const a = await enter(c);
  const object = c.req.query('object') ?? '';
  const rows = await c.env.DB.prepare('SELECT id, object, name, query, created_at FROM erp_object_views WHERE company_id = ? AND user_id = ? AND object = ? ORDER BY name COLLATE NOCASE LIMIT 50').bind(a.companyId, a.userId, object).all<any>();
  return c.json({ views: rows.results.map((v) => ({ id: v.id, object: v.object, name: v.name, query: v.query, createdAt: v.created_at })) });
});

objectRoutes.post('/c/:company/x/views', async (c) => {
  const a = await enter(c);
  const input = await body(c, z.object({ object: z.string().min(3).max(40), name: z.string().trim().min(1).max(80), query: z.string().max(2000) }));
  defOf(input.object);
  const n = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM erp_object_views WHERE company_id = ? AND user_id = ?').bind(a.companyId, a.userId).first<{ n: number }>();
  if (Number(n?.n) >= 200) throw new HttpError(400, 'At most 200 saved filters');
  const id = newId();
  await c.env.DB.prepare('INSERT INTO erp_object_views (id, company_id, user_id, object, name, query, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, a.userId, input.object, input.name, input.query.replace(/^\?/, ''), now()).run();
  return c.json({ id }, 201);
});

objectRoutes.delete('/c/:company/x/views/:id', async (c) => {
  const a = await enter(c);
  await c.env.DB.prepare('DELETE FROM erp_object_views WHERE company_id = ? AND user_id = ? AND id = ?').bind(a.companyId, a.userId, c.req.param('id')).run();
  return c.json({ ok: true });
});

objectRoutes.get('/c/:company/x/alerts', async (c) => {
  const a = await enter(c);
  const [rows, unread] = await c.env.DB.batch([
    c.env.DB.prepare('SELECT id, kind, title, body, link, created_at, read_at FROM erp_alerts WHERE company_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 50').bind(a.companyId, a.userId),
    c.env.DB.prepare('SELECT COUNT(*) AS n FROM erp_alerts WHERE company_id = ? AND user_id = ? AND read_at IS NULL').bind(a.companyId, a.userId),
  ]);
  return c.json({ alerts: (rows.results as any[]).map((r) => ({ id: r.id, kind: r.kind, title: r.title, body: r.body, link: r.link, at: r.created_at, read: !!r.read_at })), unread: (unread.results[0] as any)?.n ?? 0 });
});

objectRoutes.post('/c/:company/x/alerts/read', async (c) => {
  const a = await enter(c);
  const input = await body(c, z.object({ ids: z.array(z.string().max(64)).max(100).optional(), all: z.boolean().optional() }));
  const t = now();
  if (input.all) await c.env.DB.prepare('UPDATE erp_alerts SET read_at = ? WHERE company_id = ? AND user_id = ? AND read_at IS NULL').bind(t, a.companyId, a.userId).run();
  else if (input.ids?.length) await c.env.DB.batch(input.ids.map((id) => c.env.DB.prepare('UPDATE erp_alerts SET read_at = ? WHERE company_id = ? AND user_id = ? AND id = ? AND read_at IS NULL').bind(t, a.companyId, a.userId, id)));
  return c.json({ ok: true });
});

objectRoutes.get('/c/:company/x/payslips', async (c) => {
  const a = await enter(c, OBJECT_BY_KEY.py_run);
  const db = c.env.DB;
  const emps = await db.prepare("SELECT id FROM erp_objects WHERE company_id = ? AND object = 'hr_employee' AND owner_user_id = ?").bind(a.companyId, a.userId).all<{ id: string }>();
  if (!emps.results.length) return c.json({ payslips: [], note: 'No employee record names your account yet: ask HR to link it.' });
  const ids = emps.results.map((e) => e.id);
  const rows = await db
    .prepare(`SELECT e.id, e.number, e.status, e.data_json AS run, l.data_json AS line FROM erp_object_lines l JOIN erp_objects e ON e.company_id = l.company_id AND e.id = l.record_id WHERE l.company_id = ? AND e.object = 'py_run' AND e.status IN ('approved','paid') AND json_extract(l.data_json, '$.employee') IN (${ids.map(() => '?').join(',')}) ORDER BY e.date DESC LIMIT 60`)
    .bind(a.companyId, ...ids)
    .all<any>();
  return c.json({
    payslips: rows.results.map((r) => {
      const run = parseJson<Data>(r.run, {});
      const line = parseJson<Data>(r.line, {});
      return { run: r.number, status: r.status, periodStart: run.periodStart, periodEnd: run.periodEnd, payDate: run.payDate, currency: run.currency ?? 'AUD', hours: line.hours ?? null, gross: line.gross ?? 0, withheld: line.withheld ?? 0, deductions: line.deductions ?? 0, contribution: line.contribution ?? 0, net: line.net ?? 0 };
    }),
    note: 'Worked out by BIZOMAT from your pay details; not a certified payslip.',
  });
});

objectRoutes.get('/c/:company/x/price', async (c) => {
  const def = OBJECT_BY_KEY.pr_pricelist;
  const a = await enter(c, def);
  const x = objAccess(a, def);
  if (!x.view) throw new HttpError(403, 'Your ERP roles do not include price lists');
  const db = c.env.DB;
  const product = (c.req.query('product') ?? '').slice(0, 64);
  const customer = (c.req.query('customer') ?? '').slice(0, 140);
  const qty = Math.max(0.000001, Number(c.req.query('qty')) || 1);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(c.req.query('date') ?? '') ? c.req.query('date')! : todayUtc();
  const p = await db.prepare('SELECT id, number, name, price_cents, currency FROM erp_products WHERE company_id = ? AND id = ?').bind(a.companyId, product).first<any>();
  if (!p) throw new HttpError(400, 'Choose a product');
  // the sales orders' currency (the ERP's), as orders are priced
  const currency = /^[A-Z]{3}$/.test(c.req.query('currency') ?? '') ? c.req.query('currency')! : (await db.prepare('SELECT currency FROM erp_settings WHERE company_id = ?').bind(a.companyId).first<{ currency: string }>())?.currency ?? 'AUD';
  // the same rule sales orders use (pricing.ts)
  const s = suggest(await loadPricing(db, a.companyId, [product]), { productId: product, standard: p.price_cents ?? null, customerRefs: await customerRefsFor(db, a.companyId, customer ? [customer] : []), qty, date, currency });
  const unit = s.listUnit ?? 0;
  const off = s.promotion?.offPerUnit ?? 0;
  return c.json({ product: { id: p.id, label: `${p.number} ${p.name}`, standardPrice: p.price_cents ?? null, currency: p.currency ?? 'AUD' }, quantity: qty, date, priceList: s.priceList ? { list: s.priceList.label, listId: s.priceList.id, price: s.priceList.price, customer: s.priceList.customer, minQty: s.priceList.minQty, currency } : null, promotion: s.promotion ? { id: s.promotion.id, name: s.promotion.label, off } : null, unitPrice: unit - off, total: Math.round((unit - off) * qty), note: 'The price sales orders take when no price is typed: the customer’s price list, else the lowest list price for the quantity, then the best promotion. A promotion’s minimum order is checked here against this quantity alone; an order checks its whole value.' });
});

// ------------------------------------------------------------------ postings to Finance's ledger

const POSTING_OBJECTS: Record<PostingKind, string> = { depreciation: 'fa_asset', payroll: 'py_run', revenue: 'rr_schedule', allocation: 'ca_allocation' };

/** Who sets the posting accounts: an ERP administrator or a finance controller (with the chart in Finance). */
const postingEditor = (a: ErpAccess) => a.roles.includes('erp_admin') || a.roles.includes('finance_controller');

async function enterPostings(c: Context<AppEnv>) {
  const a = await enter(c);
  const kinds = (Object.keys(POSTING_OBJECTS) as PostingKind[]).filter((k) => objAccess(a, OBJECT_BY_KEY[POSTING_OBJECTS[k]]).view);
  if (!kinds.length && !postingEditor(a)) throw new HttpError(403, 'Your ERP roles include no records that post to Finance');
  return a;
}

objectRoutes.get('/c/:company/x/postings', async (c) => {
  const a = await enterPostings(c);
  return c.json(await postingSettings(c.env, a, user(c), postingEditor(a)));
});

objectRoutes.put('/c/:company/x/postings', async (c) => {
  const a = await enterPostings(c);
  if (!postingEditor(a)) throw new HttpError(403, 'Only an ERP administrator or a finance controller chooses the posting accounts');
  const input = await body(c, z.object({ accounts: z.record(z.string().max(40), z.string().max(64).nullable()) }));
  return c.json(await savePostingSettings(c.env, a, user(c), input.accounts));
});

objectRoutes.post('/c/:company/x/postings/run', async (c) => {
  const input = await body(c, z.object({ kind: z.enum(['depreciation', 'revenue']), upTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), after: z.string().max(40).optional() }));
  const def = OBJECT_BY_KEY[POSTING_OBJECTS[input.kind]];
  const a = await enter(c, def);
  if (!objAccess(a, def).edit) throw new HttpError(403, `Your ERP roles do not let you post ${def.plural.toLowerCase()}`);
  await rateLimit(c.env.DB, `erp-postings:${a.userId}`, 10, 60_000);
  const db = c.env.DB;
  const target = await financeTarget(c.env, a, user(c), 'journal');
  const statuses = input.kind === 'depreciation' ? ['in_service', 'disposed', 'written_off'] : ['active', 'completed'];
  const rows = await db
    // 200 records a run, in number order; the next run starts after the last one (`next`)
    .prepare(`SELECT * FROM erp_objects WHERE company_id = ? AND object = ? AND archived_at IS NULL AND status IN (${statuses.map(() => '?').join(',')}) AND number > ? ORDER BY number LIMIT 200`)
    .bind(a.companyId, def.key, ...statuses, input.after ?? '')
    .all<RecordRow>();
  let journals = 0;
  let records = 0;
  const problems: { number: string; title: string; message: string }[] = [];
  for (const row of rows.results) {
    try {
      const r = await postRecord({ env: c.env, a, user: user(c), def, row, data: parseJson<Data>(row.data_json, {}) }, { upTo: input.upTo }, target);
      if (r.posted.length) records++;
      journals += r.posted.length;
    } catch (e) {
      if (!(e instanceof HttpError) || e.status >= 500) throw e;
      problems.push({ number: row.number, title: row.title, message: e.message });
    }
  }
  return c.json({ kind: input.kind, label: KIND_LABELS[input.kind], upTo: input.upTo, checked: rows.results.length, records, journals, problems, workspace: target.org, more: rows.results.length === 200, next: rows.results.length === 200 ? rows.results[rows.results.length - 1].number : null });
});

// ------------------------------------------------------------------ custom fields

objectRoutes.get('/c/:company/x/fields/:object', async (c) => {
  const { def, a } = await enterObject(c);
  if (!objAccess(a, def).admin) throw new HttpError(403, 'Only an ERP administrator changes custom fields');
  return c.json({ fields: await listCustom(c.env.DB, a.companyId, def.key), types: CUSTOM_TYPES.map((t) => ({ value: t, label: CUSTOM_TYPE_LABELS[t] })) });
});

objectRoutes.post('/c/:company/x/fields/:object', async (c) => {
  const { def, a } = await enterObject(c);
  if (!objAccess(a, def).admin) throw new HttpError(403, 'Only an ERP administrator changes custom fields');
  const input = await body(c, z.object({ label: z.string().max(80), type: z.enum(CUSTOM_TYPES), options: z.array(z.string().max(80)).max(50).optional(), required: z.boolean().optional(), list: z.boolean().optional(), help: z.string().max(200).optional() }));
  const fields = await addCustom(c.env.DB, a.companyId, a.userId, def.key, input);
  await eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'fields.added', entityType: 'settings', entityId: a.companyId, summary: `Custom field ${input.label.slice(0, 80)} added to ${def.plural.toLowerCase()}` }).run();
  return c.json({ fields }, 201);
});

objectRoutes.patch('/c/:company/x/fields/:object/:key', async (c) => {
  const { def, a } = await enterObject(c);
  if (!objAccess(a, def).admin) throw new HttpError(403, 'Only an ERP administrator changes custom fields');
  const input = await body(c, z.object({ label: z.string().max(80).optional(), options: z.array(z.string().max(80)).max(50).optional(), required: z.boolean().optional(), list: z.boolean().optional(), help: z.string().max(200).optional(), archived: z.boolean().optional(), position: z.number().int().min(0).max(1000).optional() }));
  const fields = await changeCustom(c.env.DB, a.companyId, def.key, c.req.param('key'), input);
  await eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'fields.changed', entityType: 'settings', entityId: a.companyId, summary: `Custom field ${c.req.param('key').slice(0, 40)} of ${def.plural.toLowerCase()} ${input.archived ? 'archived' : input.archived === false ? 'restored' : 'changed'}` }).run();
  return c.json({ fields });
});

// ------------------------------------------------------------------ consolidation

objectRoutes.get('/c/:company/x/consolidation', async (c) => {
  const def = OBJECT_BY_KEY.ic_transaction;
  const a = await enter(c, def);
  if (!objAccess(a, def).view) throw new HttpError(403, 'Your ERP roles do not include consolidation');
  await rateLimit(c.env.DB, `erp-consolidation:${a.userId}`, 30, 60_000);
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const today = todayUtc();
  const to = iso.test(c.req.query('to') ?? '') ? c.req.query('to')! : today;
  const from = iso.test(c.req.query('from') ?? '') ? c.req.query('from')! : `${to.slice(0, 4)}-01-01`;
  if (from > to) throw new HttpError(400, 'The period ends before it starts');
  const currency = /^[A-Z]{3}$/.test(c.req.query('currency') ?? '') ? c.req.query('currency')! : 'AUD';
  const r = await consolidate(c.env, a, user(c), { from, to, currency, session: !!c.get('session') });
  if (wantsCsv(c)) {
    const head = ['Statement', 'Type', 'Code', 'Account', ...r.entities.map((e) => `${e.name} (${currency})`), 'Eliminations', 'Consolidated'];
    const body = [...r.profitAndLoss.map((x) => ['Profit and loss', x]), ...r.balanceSheet.map((x) => ['Balance sheet', x])].map(([st, x]: any) => [st, x.type, x.code, x.name, ...r.entities.map((e) => (x.amounts[e.id] ?? 0) / 100), x.eliminated / 100, x.total / 100]);
    return csvResponse(`consolidation-${from}-to-${to}`, [head, ...body]);
  }
  return c.json(r);
});

export { objAccess };
