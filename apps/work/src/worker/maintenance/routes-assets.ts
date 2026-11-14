// The asset register (/api/maintenance/c/:company/assets): a hierarchy of assets of any depth, each with its details,
// technical specifications, outstanding work, open requests, history and files. Everyone with access to the company
// may view it; supervisors and administrators change it; administrators import it from a CSV file.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { assertPerson, isManager, requestScope, requireMt, workOrderScope, type MtAccess } from './access';
import { MAX_IMPORT_BYTES, importOrder, planImport, type ExistingAsset } from './csv';
import {
  ASSET_NUMBER_RE,
  ASSET_STATUS,
  CRITICALITY,
  OPEN_REQUESTS,
  OUTSTANDING,
  STRATEGY,
  changes,
  departmentName,
  eventDTO,
  eventStmt,
  filesOf,
  likeOf,
  nextNumbers,
  searchText,
  sqlList,
  zDate,
  zId,
  zText,
} from './util';
import { requestDTO, workOrderDTO } from './dto';

export const assetRoutes = new Hono<AppEnv>();

const SELECT = `SELECT a.*, d.name AS department_name, u.name AS responsible_name, p.number AS parent_number, p.name AS parent_name
  FROM mt_assets a
  LEFT JOIN co_departments d ON d.id = a.department_id
  LEFT JOIN users u ON u.id = a.responsible_id
  LEFT JOIN mt_assets p ON p.company_id = a.company_id AND p.id = a.parent_id`;

export function assetDTO(r: any) {
  return {
    id: r.id,
    number: r.number,
    name: r.name,
    description: r.description,
    category: r.category,
    type: r.type,
    manufacturer: r.manufacturer,
    model: r.model,
    serialNumber: r.serial_number,
    registrationNumber: r.registration_number,
    purchaseDate: r.purchase_date,
    commissioningDate: r.commissioning_date,
    warrantyUntil: r.warranty_until,
    supplier: r.supplier,
    purchaseCostCents: r.purchase_cost_cents,
    replacementCostCents: r.replacement_cost_cents,
    location: r.location,
    department: r.department,
    departmentId: r.department_id,
    departmentName: r.department_name ?? null,
    responsibleId: r.responsible_id,
    responsibleName: r.responsible_name ?? null,
    criticality: r.criticality,
    status: r.status,
    strategy: r.strategy,
    specs: parseJson<{ key: string; value: string }[]>(r.specs_json, []),
    parentId: r.parent_id,
    parentNumber: r.parent_number ?? null,
    parentName: r.parent_name ?? null,
    archived: !!r.archived_at,
    archivedAt: r.archived_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function loadAsset(db: D1Database, companyId: string, id: string) {
  const r = await db.prepare(`${SELECT} WHERE a.company_id = ? AND a.id = ?`).bind(companyId, id).first<any>();
  if (!r) throw notFound('Asset');
  return r;
}

/** The asset and every asset above it, root first. */
export async function assetPath(db: D1Database, companyId: string, id: string): Promise<{ id: string; number: string; name: string }[]> {
  const rows = await db
    .prepare(
      `WITH RECURSIVE up(id, parent_id, number, name, depth) AS (
         SELECT id, parent_id, number, name, 0 FROM mt_assets WHERE company_id = ?1 AND id = ?2
         UNION ALL
         SELECT a.id, a.parent_id, a.number, a.name, up.depth + 1 FROM mt_assets a JOIN up ON a.id = up.parent_id WHERE a.company_id = ?1 AND up.depth < 200
       ) SELECT id, number, name FROM up ORDER BY depth DESC`,
    )
    .bind(companyId, id)
    .all<{ id: string; number: string; name: string }>();
  return rows.results;
}

/** SQL for the ids of an asset and every asset under it (bind: companyId, assetId, companyId). */
export const SUBTREE_SQL = `WITH RECURSIVE down(id, depth) AS (
  SELECT id, 0 FROM mt_assets WHERE company_id = ? AND id = ?
  UNION ALL
  SELECT a.id, down.depth + 1 FROM mt_assets a JOIN down ON a.parent_id = down.id WHERE a.company_id = ? AND down.depth < 200
) SELECT id FROM down`;

const spec = z.object({ key: zText(80).min(1), value: zText(500) });
const fields = {
  number: zText(40).optional(),
  name: zText(200).min(1),
  description: zText(5000).optional(),
  category: zText(80).optional(),
  type: zText(80).optional(),
  manufacturer: zText(120).optional(),
  model: zText(120).optional(),
  serialNumber: zText(120).optional(),
  registrationNumber: zText(120).optional(),
  purchaseDate: zDate.optional(),
  commissioningDate: zDate.optional(),
  warrantyUntil: zDate.optional(),
  supplier: zText(200).optional(),
  purchaseCostCents: z.number().int().min(0).max(1e13).nullable().optional(),
  replacementCostCents: z.number().int().min(0).max(1e13).nullable().optional(),
  location: zText(200).optional(),
  department: zText(120).optional(),
  departmentId: zId.nullable().optional(),
  responsibleId: zId.nullable().optional(),
  criticality: z.enum(CRITICALITY).optional(),
  status: z.enum(ASSET_STATUS).optional(),
  strategy: z.enum(STRATEGY).optional(),
  specs: z.array(spec).max(60).optional(),
  parentId: zId.nullable().optional(),
};
const createSchema = z.object(fields);
const updateSchema = z.object({ ...fields, name: zText(200).min(1).optional() });
type AssetInput = z.infer<typeof updateSchema>;

/** Column values from the input (only the fields given). */
function columnsOf(i: AssetInput): Record<string, unknown> {
  const map: Record<string, [string, unknown]> = {
    number: ['number', i.number],
    name: ['name', i.name],
    description: ['description', i.description],
    category: ['category', i.category],
    type: ['type', i.type],
    manufacturer: ['manufacturer', i.manufacturer],
    model: ['model', i.model],
    serialNumber: ['serial_number', i.serialNumber],
    registrationNumber: ['registration_number', i.registrationNumber],
    purchaseDate: ['purchase_date', i.purchaseDate],
    commissioningDate: ['commissioning_date', i.commissioningDate],
    warrantyUntil: ['warranty_until', i.warrantyUntil],
    supplier: ['supplier', i.supplier],
    purchaseCostCents: ['purchase_cost_cents', i.purchaseCostCents],
    replacementCostCents: ['replacement_cost_cents', i.replacementCostCents],
    location: ['location', i.location],
    department: ['department', i.department],
    departmentId: ['department_id', i.departmentId],
    responsibleId: ['responsible_id', i.responsibleId],
    criticality: ['criticality', i.criticality],
    status: ['status', i.status],
    strategy: ['strategy', i.strategy],
    specs: ['specs_json', i.specs === undefined ? undefined : JSON.stringify(i.specs)],
    parentId: ['parent_id', i.parentId],
  };
  const out: Record<string, unknown> = {};
  for (const [, [col, v]] of Object.entries(map)) if (v !== undefined) out[col] = v;
  return out;
}

/** Number free, no duplicate serial, parent in the company and not under the asset itself, department and person valid. */
async function validate(db: D1Database, a: MtAccess, cols: Record<string, unknown>, self: any | null) {
  if (cols.number !== undefined && cols.number !== '') {
    if (!ASSET_NUMBER_RE.test(String(cols.number))) throw new HttpError(400, 'An asset number may use only letters, digits and . _ / - (up to 40)');
    const taken = await db.prepare('SELECT id FROM mt_assets WHERE company_id = ? AND number = ? AND id <> ?').bind(a.companyId, cols.number, self?.id ?? '').first();
    if (taken) throw new HttpError(409, `Asset number ${cols.number} is already used in this company`);
  }
  const manufacturer = String(cols.manufacturer ?? self?.manufacturer ?? '');
  const serial = String(cols.serial_number ?? self?.serial_number ?? '');
  if (serial.trim() && (cols.serial_number !== undefined || cols.manufacturer !== undefined)) {
    const dup = await db
      .prepare('SELECT number FROM mt_assets WHERE company_id = ? AND serial_number = ? COLLATE NOCASE AND manufacturer = ? COLLATE NOCASE AND id <> ?')
      .bind(a.companyId, serial.trim(), manufacturer.trim(), self?.id ?? '')
      .first<{ number: string }>();
    if (dup) throw new HttpError(409, `An asset with this manufacturer and serial number is already in the register (${dup.number})`);
  }
  if (cols.parent_id) {
    const parent = await db.prepare('SELECT id FROM mt_assets WHERE company_id = ? AND id = ?').bind(a.companyId, cols.parent_id).first();
    if (!parent) throw new HttpError(400, 'Choose a parent asset from this company');
    if (self) {
      if (cols.parent_id === self.id) throw new HttpError(400, 'An asset cannot sit under itself');
      const above = await assetPath(db, a.companyId, String(cols.parent_id));
      if (above.some((x) => x.id === self.id)) throw new HttpError(400, 'An asset cannot sit under one of the assets below it');
    }
  }
  if (cols.department_id) {
    if (a.kind !== 'registered') throw new HttpError(400, 'Departments belong to registered companies; type the department instead');
    await departmentName(db, a.companyId, String(cols.department_id));
  }
  if (cols.responsible_id) await assertPerson(db, a, String(cols.responsible_id), 'requester', 'The responsible person');
}

function searchOf(r: Record<string, unknown>) {
  return searchText(r.number as string, r.name as string, r.manufacturer as string, r.model as string, r.serial_number as string, r.registration_number as string, r.location as string, r.category as string, r.type as string);
}

// ------------------------------------------------------------------ list, tree

assetRoutes.get('/c/:company/assets', async (c) => {
  const a = await requireMt(c);
  const where = ['a.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const archived = c.req.query('archived');
  if (archived === '1') where.push('a.archived_at IS NOT NULL');
  else if (archived !== 'all') where.push('a.archived_at IS NULL');
  const q = (c.req.query('q') ?? '').trim();
  if (q) {
    where.push('a.search LIKE ?');
    args.push(likeOf(q));
  }
  for (const [key, col, allowed] of [
    ['status', 'status', ASSET_STATUS],
    ['criticality', 'criticality', CRITICALITY],
    ['strategy', 'strategy', STRATEGY],
  ] as const) {
    const v = c.req.query(key);
    if (v && (allowed as readonly string[]).includes(v)) {
      where.push(`a.${col} = ?`);
      args.push(v);
    }
  }
  const category = c.req.query('category');
  if (category) {
    where.push('a.category = ? COLLATE NOCASE');
    args.push(category.slice(0, 80));
  }
  const parent = c.req.query('parent');
  if (parent === 'root') where.push('a.parent_id IS NULL');
  else if (parent) {
    where.push('a.parent_id = ?');
    args.push(parent.slice(0, 64));
  }
  const sort = c.req.query('sort') === 'name' ? 'a.name COLLATE NOCASE' : c.req.query('sort') === 'updated' ? 'a.updated_at DESC' : 'a.number COLLATE NOCASE';
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 200, 1), 1000);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);
  const [rows, total, cats] = await c.env.DB.batch([
    c.env.DB.prepare(`${SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort} LIMIT ? OFFSET ?`).bind(...args, limit, offset),
    c.env.DB.prepare(`SELECT COUNT(*) AS n FROM mt_assets a WHERE ${where.join(' AND ')}`).bind(...args),
    c.env.DB.prepare("SELECT DISTINCT category FROM mt_assets WHERE company_id = ? AND category <> '' ORDER BY category COLLATE NOCASE LIMIT 200").bind(a.companyId),
  ]);
  return c.json({ assets: (rows.results as any[]).map(assetDTO), total: (total.results[0] as any)?.n ?? 0, categories: (cats.results as any[]).map((r) => r.category) });
});

/** Every asset of the company with its parent, for the tree (up to 5,000). */
assetRoutes.get('/c/:company/assets/tree', async (c) => {
  const a = await requireMt(c);
  const all = c.req.query('archived') === 'all';
  const wo = workOrderScope(a, 'w');
  const rows = await c.env.DB.prepare(
    `SELECT a.id, a.number, a.name, a.parent_id, a.status, a.criticality, a.category, a.archived_at,
            (SELECT COUNT(*) FROM mt_work_orders w WHERE w.company_id = a.company_id AND w.asset_id = a.id AND w.status IN (${sqlList(OUTSTANDING)}) AND ${wo.sql}) AS open_work
       FROM mt_assets a WHERE a.company_id = ? ${all ? '' : 'AND a.archived_at IS NULL'} ORDER BY a.number COLLATE NOCASE LIMIT 5000`,
  )
    .bind(...wo.args, a.companyId)
    .all<any>();
  return c.json({
    nodes: rows.results.map((r) => ({ id: r.id, number: r.number, name: r.name, parentId: r.parent_id, status: r.status, criticality: r.criticality, category: r.category, archived: !!r.archived_at, openWork: r.open_work })),
  });
});

// ------------------------------------------------------------------ create, read, change

assetRoutes.post('/c/:company/assets', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const input = await body(c, createSchema);
  const cols = columnsOf(input);
  await validate(c.env.DB, a, cols, null);
  if (!cols.number) cols.number = (await nextNumbers(c.env.DB, a.companyId, 'asset'))[0];
  const id = newId();
  const t = now();
  const row = { ...cols, id, company_id: a.companyId, search: searchOf(cols), created_by: a.userId, created_at: t, updated_at: t };
  const keys = Object.keys(row);
  await c.env.DB.batch([
    c.env.DB.prepare(`INSERT INTO mt_assets (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => (row as any)[k])),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'asset.created', assetId: id, summary: `Asset ${cols.number} ${input.name} created`, after: cols }),
  ]);
  return c.json(assetDTO(await loadAsset(c.env.DB, a.companyId, id)), 201);
});

assetRoutes.get('/c/:company/assets/:id', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const r = await loadAsset(db, a.companyId, c.req.param('id'));
  const wo = workOrderScope(a, 'w');
  const rq = requestScope(a, 'r');
  const ev = (() => {
    // History lines about requests and work orders the person cannot see are left out.
    const w2 = workOrderScope(a, 'hw');
    const r2 = requestScope(a, 'hr');
    return {
      sql: `(e.work_order_id IS NULL OR EXISTS (SELECT 1 FROM mt_work_orders hw WHERE hw.company_id = e.company_id AND hw.id = e.work_order_id AND ${w2.sql}))
        AND (e.request_id IS NULL OR EXISTS (SELECT 1 FROM mt_requests hr WHERE hr.company_id = e.company_id AND hr.id = e.request_id AND ${r2.sql}))`,
      args: [...w2.args, ...r2.args],
    };
  })();
  const [children, work, requests, events] = await db.batch([
    db.prepare(`SELECT a.id, a.number, a.name, a.status, a.criticality, a.archived_at, (SELECT COUNT(*) FROM mt_assets x WHERE x.company_id = a.company_id AND x.parent_id = a.id) AS children FROM mt_assets a WHERE a.company_id = ? AND a.parent_id = ? ORDER BY a.number COLLATE NOCASE LIMIT 500`).bind(a.companyId, r.id),
    db
      .prepare(`SELECT w.*, u.name AS assignee_name, ? AS asset_number, ? AS asset_name FROM mt_work_orders w LEFT JOIN users u ON u.id = w.assigned_to WHERE w.company_id = ? AND w.asset_id = ? AND w.status IN (${sqlList(OUTSTANDING)}) AND ${wo.sql} ORDER BY COALESCE(w.due_finish, '9999') , w.number LIMIT 200`)
      .bind(r.number, r.name, a.companyId, r.id, ...wo.args),
    db
      .prepare(`SELECT r.*, u.name AS requester_name, ? AS asset_number, ? AS asset_name, NULL AS wo_number, NULL AS wo_status FROM mt_requests r LEFT JOIN users u ON u.id = r.requested_by WHERE r.company_id = ? AND r.asset_id = ? AND r.status IN (${sqlList(OPEN_REQUESTS)}) AND ${rq.sql} ORDER BY r.created_at DESC LIMIT 200`)
      .bind(r.number, r.name, a.companyId, r.id, ...rq.args),
    db.prepare(`SELECT e.*, u.name AS actor_name FROM mt_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.company_id = ? AND e.asset_id = ? AND ${ev.sql} ORDER BY e.created_at DESC LIMIT 200`).bind(a.companyId, r.id, ...ev.args),
  ]);
  const path = await assetPath(db, a.companyId, r.id);
  return c.json({
    asset: assetDTO(r),
    path,
    parent: r.parent_id ? { id: r.parent_id, number: r.parent_number, name: r.parent_name } : null,
    children: (children.results as any[]).map((x) => ({ id: x.id, number: x.number, name: x.name, status: x.status, criticality: x.criticality, archived: !!x.archived_at, children: x.children })),
    outstandingWorkOrders: (work.results as any[]).map(workOrderDTO),
    openRequests: (requests.results as any[]).map(requestDTO),
    history: (events.results as any[]).map(eventDTO),
    files: await filesOf(db, a.companyId, 'asset_id', r.id),
    can: { edit: isManager(a), upload: isManager(a) },
  });
});

assetRoutes.patch('/c/:company/assets/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const before = await loadAsset(c.env.DB, a.companyId, c.req.param('id'));
  const input = await body(c, updateSchema);
  const cols = columnsOf(input);
  if (cols.number === '') delete cols.number;
  await validate(c.env.DB, a, cols, before);
  const diff = changes(before, cols);
  if (!diff) return c.json(assetDTO(before));
  const merged = { ...before, ...cols };
  const set = { ...cols, search: searchOf(merged), updated_at: now() };
  const keys = Object.keys(set);
  await c.env.DB.batch([
    c.env.DB.prepare(`UPDATE mt_assets SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ?`).bind(...keys.map((k) => (set as any)[k]), a.companyId, before.id),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'asset.updated', assetId: before.id, summary: `Changed ${Object.keys(diff.after).map((k) => k.replace(/_json$|_id$|_cents$/, '').replace(/_/g, ' ')).join(', ')}`, before: diff.before, after: diff.after }),
  ]);
  return c.json(assetDTO(await loadAsset(c.env.DB, a.companyId, before.id)));
});

for (const [path, archive] of [
  ['archive', true],
  ['restore', false],
] as const) {
  assetRoutes.post(`/c/:company/assets/:id/${path}`, async (c) => {
    const a = await requireMt(c, 'supervisor');
    const r = await loadAsset(c.env.DB, a.companyId, c.req.param('id'));
    if (!!r.archived_at === archive) return c.json(assetDTO(r));
    const t = now();
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE mt_assets SET archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(archive ? t : null, t, a.companyId, r.id),
      eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: archive ? 'asset.archived' : 'asset.restored', assetId: r.id, summary: archive ? `Asset ${r.number} archived` : `Asset ${r.number} restored` }),
    ]);
    return c.json(assetDTO(await loadAsset(c.env.DB, a.companyId, r.id)));
  });
}

// ------------------------------------------------------------------ CSV import

assetRoutes.post('/c/:company/assets/import', async (c) => {
  const a = await requireMt(c, 'admin');
  await rateLimit(c.env.DB, `mt-import:${a.userId}`, 20, 60_000);
  const input = await body(c, z.object({ csv: z.string().min(1).max(MAX_IMPORT_BYTES), dryRun: z.boolean().default(true) }));
  const db = c.env.DB;
  const existing = (await db.prepare('SELECT id, number, manufacturer, serial_number FROM mt_assets WHERE company_id = ?').bind(a.companyId).all<ExistingAsset>()).results;
  const plan = planImport(input.csv, existing);
  if (!plan.columns.some((x) => x.field === 'name')) throw new HttpError(400, 'The file needs a Name column. The first row must name the columns.');
  const preview = {
    columns: plan.columns,
    rows: plan.rows.map(({ values: _v, parentId: _p, parentLine: _l, ...r }) => r),
    summary: plan.summary,
  };
  if (input.dryRun) return c.json({ dryRun: true, ...preview, created: 0 });
  const order = importOrder(plan);
  if (!order.length) return c.json({ dryRun: false, ...preview, created: 0 });
  const auto = order.filter((r) => !r.values!.number);
  const numbers = auto.length ? await nextNumbers(db, a.companyId, 'asset', auto.length) : [];
  auto.forEach((r, i) => (r.values!.number = numbers[i]));
  const idByLine = new Map(order.map((r) => [r.line, newId()]));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const r of order) {
    const v = r.values!;
    const id = idByLine.get(r.line)!;
    const parentId = r.parentLine ? idByLine.get(r.parentLine)! : (r.parentId ?? null);
    const row: Record<string, unknown> = {
      id,
      company_id: a.companyId,
      number: v.number,
      name: v.name,
      description: v.description,
      category: v.category,
      type: v.type,
      manufacturer: v.manufacturer,
      model: v.model,
      serial_number: v.serialNumber,
      registration_number: v.registrationNumber,
      purchase_date: v.purchaseDate,
      commissioning_date: v.commissioningDate,
      warranty_until: v.warrantyUntil,
      supplier: v.supplier,
      purchase_cost_cents: v.purchaseCostCents,
      replacement_cost_cents: v.replacementCostCents,
      location: v.location,
      department: v.department,
      criticality: v.criticality,
      status: v.status,
      strategy: v.strategy,
      specs_json: JSON.stringify(v.specs),
      parent_id: parentId,
      created_by: a.userId,
      created_at: t,
      updated_at: t,
    };
    row.search = searchOf(row);
    const keys = Object.keys(row);
    stmts.push(db.prepare(`INSERT INTO mt_assets (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`).bind(...keys.map((k) => row[k])));
    stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'asset.imported', assetId: id, summary: `Asset ${v.number} ${v.name} imported from a CSV file (line ${r.line})`, at: t }));
  }
  // Parents are inserted before their children; a batch is one transaction.
  for (let i = 0; i < stmts.length; i += 200) await db.batch(stmts.slice(i, i + 200));
  await db.prepare('INSERT INTO mt_events (id, company_id, actor_id, action, summary, after_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, a.userId, 'assets.imported', `${order.length} assets imported from a CSV file`, JSON.stringify(plan.summary), t).run();
  const numberByLine = new Map(order.map((r) => [r.line, r.values!.number]));
  return c.json({ dryRun: false, ...preview, rows: preview.rows.map((r) => (numberByLine.has(r.line) ? { ...r, number: numberByLine.get(r.line)!, imported: true } : r)), created: order.length });
});
