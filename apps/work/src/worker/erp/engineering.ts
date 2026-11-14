// BIZOMAT ERP, Release 1: engineering revisions and multi-level bills of materials (/api/erp/c/:company/...).
//
// A product's bill of materials belongs to one of its revisions. A product has at most one open revision (draft or
// in_change) at a time, and at most one released revision. Only an open revision whose change order (if any) is still a
// draft can change; a released revision is locked. Releases happen through change orders (changes.ts).
//
// Explosion, cost roll-up and where-used read each component's current released revision. Cycles are refused when a
// line is added or changed: a product may not contain itself at any depth, through released or open revisions.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { can, requireErp, type ErpAccess } from './access';
import { TYPE_LABELS, badState, changed, csvResponse, dollars, eventStmt, historyOf, validDate, wantsCsv, zDate, zId, zQty, zText } from './util';
import { loadProduct } from './products';

export const engineeringRoutes = new Hono<AppEnv>();

const ASSEMBLY_TYPES = new Set(['assembly', 'subassembly', 'finished_product', 'manufactured_part']);

export function revisionDTO(r: any) {
  return {
    id: r.id,
    productId: r.product_id,
    label: r.label,
    status: r.status,
    description: r.description,
    changeReason: r.change_reason,
    effectiveDate: r.effective_date,
    ecoId: r.eco_id,
    ecoNumber: r.eco_number ?? null,
    ecoStatus: r.eco_status ?? null,
    releasedAt: r.released_at,
    releasedByName: r.released_by_name ?? null,
    supersededAt: r.superseded_at,
    supersededBy: r.superseded_by,
    lines: r.lines ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function lineDTO(l: any) {
  return {
    id: l.id,
    revisionId: l.revision_id,
    componentId: l.component_id,
    componentNumber: l.component_number,
    componentName: l.component_name,
    componentType: l.component_type,
    componentTypeLabel: TYPE_LABELS[l.component_type as keyof typeof TYPE_LABELS] ?? l.component_type,
    componentUom: l.component_uom,
    componentReleased: l.component_released ?? null,
    componentReleasedId: l.component_released_id ?? null,
    hasStructure: !!l.component_lines,
    quantity: l.quantity,
    uom: l.uom,
    scrapPct: l.scrap_pct,
    refDesignator: l.ref_designator,
    position: l.position,
    effectiveFrom: l.effective_from,
    effectiveTo: l.effective_to,
    optional: !!l.optional,
    altGroup: l.alt_group,
    notes: l.notes,
  };
}

export async function loadRevision(db: D1Database, companyId: string, id: string) {
  const r = await db
    .prepare(
      `SELECT r.*, o.number AS eco_number, o.status AS eco_status, u.name AS released_by_name, p.number AS product_number, p.name AS product_name
         FROM erp_revisions r JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id
         LEFT JOIN erp_change_orders o ON o.company_id = r.company_id AND o.id = r.eco_id
         LEFT JOIN users u ON u.id = r.released_by
        WHERE r.company_id = ? AND r.id = ?`,
    )
    .bind(companyId, String(id).slice(0, 64))
    .first<any>();
  if (!r) throw notFound('Revision');
  return r;
}

/** Whether a revision's details and bill of materials can still change. */
export function editable(r: { status: string; eco_status?: string | null; eco_id?: string | null }) {
  return (r.status === 'draft' || r.status === 'in_change') && (!r.eco_id || r.eco_status === 'draft');
}

function assertEditable(r: any) {
  if (r.status === 'released') badState(`Revision ${r.label} of ${r.product_number} is released and locked. Start a new revision to change it.`);
  if (r.status === 'superseded') badState(`Revision ${r.label} of ${r.product_number} is superseded and locked.`);
  if (!editable(r)) badState(`Revision ${r.label} of ${r.product_number} is under change order ${r.eco_number} (${r.eco_status}). It can change again only if the change order goes back to draft.`);
}

const LINE_SELECT = `SELECT l.*, c.number AS component_number, c.name AS component_name, c.type AS component_type, c.uom AS component_uom,
       (SELECT r2.label FROM erp_revisions r2 WHERE r2.company_id = c.company_id AND r2.product_id = c.id AND r2.status = 'released') AS component_released,
       (SELECT r2.id FROM erp_revisions r2 WHERE r2.company_id = c.company_id AND r2.product_id = c.id AND r2.status = 'released') AS component_released_id,
       (SELECT COUNT(*) FROM erp_bom_lines l2 JOIN erp_revisions r3 ON r3.company_id = l2.company_id AND r3.id = l2.revision_id
          WHERE l2.company_id = c.company_id AND r3.product_id = c.id AND r3.status = 'released') AS component_lines
  FROM erp_bom_lines l JOIN erp_products c ON c.company_id = l.company_id AND c.id = l.component_id`;

async function linesOf(db: D1Database, companyId: string, revisionId: string) {
  const rows = await db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.revision_id = ? ORDER BY l.position, l.created_at, l.rowid`).bind(companyId, revisionId).all<any>();
  return rows.results;
}

// ------------------------------------------------------------------ revisions

const nextLabel = (labels: string[]) => {
  const letters = labels.filter((l) => /^[A-Z]{1,2}$/i.test(l)).map((l) => l.toUpperCase());
  if (!letters.length) return labels.length ? String(labels.length + 1).padStart(2, '0') : 'A';
  const toN = (s: string) => s.split('').reduce((n, ch) => n * 26 + (ch.charCodeAt(0) - 64), 0);
  const max = Math.max(...letters.map(toN)) + 1;
  let n = max;
  let out = '';
  while (n > 0) {
    const m = (n - 1) % 26;
    out = String.fromCharCode(65 + m) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
};

/**
 * The statements that start a product's next revision as a draft (or straight into a change order), with the lines of
 * its released revision (or `copyFrom`) copied. Refused while the product has an open revision.
 */
export async function newRevisionStatements(
  db: D1Database,
  a: ErpAccess,
  p: { id: string; number: string; archived_at: number | null },
  opts: { label?: string; description?: string; changeReason?: string; effectiveDate?: string | null; copyFrom?: string; eco?: { id: string; number: string } },
) {
  if (p.archived_at) throw new HttpError(409, `${p.number} is archived: restore it first`);
  const all = await db.prepare('SELECT id, label, status FROM erp_revisions WHERE company_id = ? AND product_id = ?').bind(a.companyId, p.id).all<{ id: string; label: string; status: string }>();
  const open = all.results.find((r) => r.status === 'draft' || r.status === 'in_change');
  if (open) badState(`${p.number} already has an open revision (${open.label}). Release or finish it before starting another.`);
  const label = (opts.label?.trim() || nextLabel(all.results.map((r) => r.label))).toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9.-]{0,9}$/.test(label)) throw new HttpError(400, 'A revision label may use letters, digits, . and - (up to 10)');
  if (all.results.some((r) => r.label.toUpperCase() === label)) throw new HttpError(409, `${p.number} already has a revision ${label}`);
  const source = opts.copyFrom ? all.results.find((r) => r.id === opts.copyFrom) : all.results.find((r) => r.status === 'released');
  if (opts.copyFrom && !source) throw notFound('Revision to copy');
  const id = newId();
  const t = now();
  const stmts = [
    db
      .prepare('INSERT INTO erp_revisions (id, company_id, product_id, label, status, description, change_reason, effective_date, eco_id, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, p.id, label, opts.eco ? 'in_change' : 'draft', opts.description ?? '', opts.changeReason ?? '', opts.effectiveDate ?? null, opts.eco?.id ?? null, a.userId, t, t),
  ];
  if (source) {
    stmts.push(
      db
        .prepare(
          `INSERT INTO erp_bom_lines (id, company_id, revision_id, component_id, quantity, uom, scrap_pct, ref_designator, position, effective_from, effective_to, optional, alt_group, notes, created_by, created_at, updated_at)
           SELECT lower(hex(randomblob(12))), company_id, ?, component_id, quantity, uom, scrap_pct, ref_designator, position, effective_from, effective_to, optional, alt_group, notes, ?, ?, ?
             FROM erp_bom_lines WHERE company_id = ? AND revision_id = ?`,
        )
        .bind(id, a.userId, t, t, a.companyId, source.id),
    );
  }
  stmts.push(
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'revision.created',
      entityType: 'revision',
      entityId: id,
      productId: p.id,
      summary: `Revision ${label} of ${p.number} started${source ? ` from revision ${source.label}` : ''}${opts.eco ? ` in change order ${opts.eco.number}` : ''}`,
      after: { label, copiedFrom: source?.label ?? null, changeOrder: opts.eco?.number ?? null },
      at: t,
    }),
  );
  return { id, label, stmts };
}

engineeringRoutes.post('/c/:company/products/:id/revisions', async (c) => {
  const a = await requireErp(c, 'products.edit');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ label: zText(10).optional(), description: zText(2000).optional(), changeReason: zText(2000).optional(), effectiveDate: zDate.optional(), copyFrom: zId.optional() }));
  const { id, stmts } = await newRevisionStatements(db, a, p, input);
  await db.batch(stmts);
  return c.json(revisionDTO(await loadRevision(db, a.companyId, id)), 201);
});

engineeringRoutes.get('/c/:company/revisions/:id', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const r = await loadRevision(db, a.companyId, c.req.param('id'));
  const lines = await linesOf(db, a.companyId, r.id);
  return c.json({
    revision: revisionDTO(r),
    product: { id: r.product_id, number: r.product_number, name: r.product_name },
    lines: lines.map(lineDTO),
    editable: editable(r),
    can: { edit: can(a, 'products.edit') && editable(r) },
    history: await historyOf(db, a.companyId, { entityType: 'revision', entityId: r.id }, 50),
  });
});

engineeringRoutes.patch('/c/:company/revisions/:id', async (c) => {
  const a = await requireErp(c, 'products.edit');
  const db = c.env.DB;
  const r = await loadRevision(db, a.companyId, c.req.param('id'));
  assertEditable(r);
  const input = await body(c, z.object({ label: zText(10).optional(), description: zText(2000).optional(), changeReason: zText(2000).optional(), effectiveDate: zDate.optional() }));
  const row: Record<string, unknown> = {};
  if (input.label !== undefined) {
    const label = input.label.trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9.-]{0,9}$/.test(label)) throw new HttpError(400, 'A revision label may use letters, digits, . and - (up to 10)');
    const dup = await db.prepare('SELECT id FROM erp_revisions WHERE company_id = ? AND product_id = ? AND label = ? AND id <> ?').bind(a.companyId, r.product_id, label, r.id).first();
    if (dup) throw new HttpError(409, `${r.product_number} already has a revision ${label}`);
    row.label = label;
  }
  if (input.description !== undefined) row.description = input.description;
  if (input.changeReason !== undefined) row.change_reason = input.changeReason;
  if (input.effectiveDate !== undefined) row.effective_date = input.effectiveDate;
  const diff = changed(r, row);
  if (!diff.any) return c.json(revisionDTO(r));
  const t = now();
  row.updated_at = t;
  await db.batch([
    db.prepare(`UPDATE erp_revisions SET ${Object.keys(row).map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ?`).bind(...Object.values(row), a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'revision.updated', entityType: 'revision', entityId: r.id, productId: r.product_id, summary: `Revision ${row.label ?? r.label} of ${r.product_number} changed`, before: diff.before, after: diff.after, at: t }),
  ]);
  return c.json(revisionDTO(await loadRevision(db, a.companyId, r.id)));
});

// ------------------------------------------------------------------ bill of materials lines

const lineFields = {
  componentId: zId,
  quantity: zQty,
  uom: zText(20).min(1).optional(),
  scrapPct: z.number().min(0).max(999).optional(),
  refDesignator: zText(200).optional(),
  position: z.number().int().min(0).max(100000).optional(),
  effectiveFrom: zDate.optional(),
  effectiveTo: zDate.optional(),
  optional: z.boolean().optional(),
  altGroup: zText(40).optional(),
  notes: zText(1000).optional(),
};

/** Refuses a component that would put `productId` inside itself, at any depth, through released or open revisions. */
async function assertNoCycle(db: D1Database, companyId: string, productId: string, componentId: string) {
  if (productId === componentId) throw new HttpError(400, 'A product cannot contain itself');
  const seen = new Set<string>([componentId]);
  let frontier = [componentId];
  for (let depth = 0; depth < 50 && frontier.length; depth++) {
    const rows = await db
      .prepare(
        `SELECT DISTINCT l.component_id FROM erp_bom_lines l JOIN erp_revisions r ON r.company_id = l.company_id AND r.id = l.revision_id
          WHERE l.company_id = ? AND r.status IN ('draft','in_change','released') AND r.product_id IN (${frontier.map(() => '?').join(',')})`,
      )
      .bind(companyId, ...frontier)
      .all<{ component_id: string }>();
    const next: string[] = [];
    for (const { component_id } of rows.results) {
      if (component_id === productId) throw new HttpError(400, 'That would make a loop: the component already contains this product, directly or further down');
      if (!seen.has(component_id)) {
        seen.add(component_id);
        next.push(component_id);
      }
    }
    if (seen.size > 20000) throw new HttpError(400, 'The structure is too large to check');
    frontier = next;
  }
}

function checkLineDates(from: string | null | undefined, to: string | null | undefined) {
  if (from && to && validDate(from) && validDate(to) && to < from) throw new HttpError(400, 'The line’s effective end date is before its start date');
}

engineeringRoutes.post('/c/:company/revisions/:id/lines', async (c) => {
  const a = await requireErp(c, 'products.edit');
  const db = c.env.DB;
  const r = await loadRevision(db, a.companyId, c.req.param('id'));
  assertEditable(r);
  const input = await body(c, z.object(lineFields));
  const comp = await db.prepare('SELECT id, number, name, uom, archived_at FROM erp_products WHERE company_id = ? AND id = ?').bind(a.companyId, input.componentId).first<any>();
  if (!comp) throw notFound('Component');
  if (comp.archived_at) throw new HttpError(409, `${comp.number} is archived and cannot be added`);
  await assertNoCycle(db, a.companyId, r.product_id, comp.id);
  checkLineDates(input.effectiveFrom, input.effectiveTo);
  const pos = input.position ?? Number((await db.prepare('SELECT COALESCE(MAX(position), 0) + 10 AS p FROM erp_bom_lines WHERE company_id = ? AND revision_id = ?').bind(a.companyId, r.id).first<{ p: number }>())?.p ?? 10);
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_bom_lines (id, company_id, revision_id, component_id, quantity, uom, scrap_pct, ref_designator, position, effective_from, effective_to, optional, alt_group, notes, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, a.companyId, r.id, comp.id, input.quantity, input.uom ?? comp.uom ?? 'each', input.scrapPct ?? 0, input.refDesignator ?? '', pos, input.effectiveFrom ?? null, input.effectiveTo ?? null, input.optional ? 1 : 0, input.altGroup ?? '', input.notes ?? '', a.userId, t, t),
    db.prepare('UPDATE erp_revisions SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'bom.line_added', entityType: 'revision', entityId: r.id, productId: r.product_id, summary: `${comp.number} ${comp.name} added to revision ${r.label} of ${r.product_number} (quantity ${input.quantity})`, after: { component: comp.number, quantity: input.quantity, scrapPct: input.scrapPct ?? 0 }, at: t }),
  ]);
  const line = await db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.id = ?`).bind(a.companyId, id).first<any>();
  return c.json(lineDTO(line), 201);
});

engineeringRoutes.patch('/c/:company/revisions/:id/lines/:lineId', async (c) => {
  const a = await requireErp(c, 'products.edit');
  const db = c.env.DB;
  const r = await loadRevision(db, a.companyId, c.req.param('id'));
  assertEditable(r);
  const line = await db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.revision_id = ? AND l.id = ?`).bind(a.companyId, r.id, String(c.req.param('lineId')).slice(0, 64)).first<any>();
  if (!line) throw notFound('Line');
  const input = await body(c, z.object({ ...lineFields, componentId: zId.optional(), quantity: zQty.optional() }));
  const row: Record<string, unknown> = {};
  if (input.componentId !== undefined && input.componentId !== line.component_id) {
    const comp = await db.prepare('SELECT id, archived_at, number FROM erp_products WHERE company_id = ? AND id = ?').bind(a.companyId, input.componentId).first<any>();
    if (!comp) throw notFound('Component');
    if (comp.archived_at) throw new HttpError(409, `${comp.number} is archived and cannot be added`);
    await assertNoCycle(db, a.companyId, r.product_id, comp.id);
    row.component_id = comp.id;
  }
  const map: Record<string, string> = { quantity: 'quantity', uom: 'uom', scrapPct: 'scrap_pct', refDesignator: 'ref_designator', position: 'position', effectiveFrom: 'effective_from', effectiveTo: 'effective_to', altGroup: 'alt_group', notes: 'notes' };
  for (const [k, col] of Object.entries(map)) if ((input as any)[k] !== undefined) row[col] = (input as any)[k];
  if (input.optional !== undefined) row.optional = input.optional ? 1 : 0;
  checkLineDates((row.effective_from ?? line.effective_from) as string | null, (row.effective_to ?? line.effective_to) as string | null);
  const diff = changed(line, row);
  if (!diff.any) return c.json(lineDTO(line));
  const t = now();
  row.updated_at = t;
  await db.batch([
    db.prepare(`UPDATE erp_bom_lines SET ${Object.keys(row).map((k) => `${k} = ?`).join(', ')} WHERE company_id = ? AND id = ?`).bind(...Object.values(row), a.companyId, line.id),
    db.prepare('UPDATE erp_revisions SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'bom.line_changed', entityType: 'revision', entityId: r.id, productId: r.product_id, summary: `Line ${line.component_number} changed in revision ${r.label} of ${r.product_number}`, before: diff.before, after: diff.after, at: t }),
  ]);
  return c.json(lineDTO(await db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.id = ?`).bind(a.companyId, line.id).first<any>()));
});

engineeringRoutes.delete('/c/:company/revisions/:id/lines/:lineId', async (c) => {
  const a = await requireErp(c, 'products.edit');
  const db = c.env.DB;
  const r = await loadRevision(db, a.companyId, c.req.param('id'));
  assertEditable(r);
  const line = await db.prepare(`${LINE_SELECT} WHERE l.company_id = ? AND l.revision_id = ? AND l.id = ?`).bind(a.companyId, r.id, String(c.req.param('lineId')).slice(0, 64)).first<any>();
  if (!line) throw notFound('Line');
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM erp_bom_lines WHERE company_id = ? AND id = ?').bind(a.companyId, line.id),
    db.prepare('UPDATE erp_revisions SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, r.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'bom.line_removed', entityType: 'revision', entityId: r.id, productId: r.product_id, summary: `${line.component_number} removed from revision ${r.label} of ${r.product_number}`, before: { component: line.component_number, quantity: line.quantity }, at: t }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ explosion and cost

interface Node {
  level: number;
  path: string;
  lineId: string;
  componentId: string;
  number: string;
  name: string;
  type: string;
  typeLabel: string;
  uom: string;
  revision: string | null;
  quantity: number;
  scrapPct: number;
  extendedQuantity: number;
  optional: boolean;
  altGroup: string;
  refDesignator: string;
  unitCostCents: number | null;
  currency: string;
  noRelease: boolean;
}

/** The structure under a revision, every level: components use their released revision. */
export async function explode(db: D1Database, companyId: string, revisionId: string, asOf: string | null = null): Promise<{ nodes: Node[]; truncated: boolean }> {
  const nodes: Node[] = [];
  let truncated = false;
  const released = new Map<string, string | null>();
  async function releasedOf(productId: string) {
    if (!released.has(productId)) {
      const r = await db.prepare("SELECT id FROM erp_revisions WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(companyId, productId).first<{ id: string }>();
      released.set(productId, r?.id ?? null);
    }
    return released.get(productId)!;
  }
  async function walk(revId: string, level: number, prefix: string, parentQty: number, stack: Set<string>) {
    if (level > 25 || nodes.length > 5000) {
      truncated = true;
      return;
    }
    const lines = await db
      .prepare(
        `SELECT l.*, c.number, c.name, c.type, c.uom AS c_uom, c.standard_cost_cents, c.currency,
                (SELECT r2.label FROM erp_revisions r2 WHERE r2.company_id = c.company_id AND r2.product_id = c.id AND r2.status = 'released') AS rel_label
           FROM erp_bom_lines l JOIN erp_products c ON c.company_id = l.company_id AND c.id = l.component_id
          WHERE l.company_id = ? AND l.revision_id = ? ORDER BY l.position, l.created_at, l.rowid`,
      )
      .bind(companyId, revId)
      .all<any>();
    let i = 0;
    for (const l of lines.results) {
      if (asOf && ((l.effective_from && l.effective_from > asOf) || (l.effective_to && l.effective_to < asOf))) continue;
      i++;
      const path = prefix ? `${prefix}.${i}` : String(i);
      const ext = parentQty * l.quantity * (1 + (l.scrap_pct || 0) / 100);
      const childRev = await releasedOf(l.component_id);
      nodes.push({
        level,
        path,
        lineId: l.id,
        componentId: l.component_id,
        number: l.number,
        name: l.name,
        type: l.type,
        typeLabel: TYPE_LABELS[l.type as keyof typeof TYPE_LABELS] ?? l.type,
        uom: l.uom,
        revision: l.rel_label ?? null,
        quantity: l.quantity,
        scrapPct: l.scrap_pct,
        extendedQuantity: Math.round(ext * 1e6) / 1e6,
        optional: !!l.optional,
        altGroup: l.alt_group,
        refDesignator: l.ref_designator,
        unitCostCents: l.standard_cost_cents,
        currency: l.currency,
        noRelease: !childRev && ASSEMBLY_TYPES.has(l.type),
      });
      if (childRev && !stack.has(l.component_id)) {
        stack.add(l.component_id);
        await walk(childRev, level + 1, path, ext, stack);
        stack.delete(l.component_id);
      }
    }
  }
  const root = await db.prepare('SELECT product_id FROM erp_revisions WHERE company_id = ? AND id = ?').bind(companyId, revisionId).first<{ product_id: string }>();
  await walk(revisionId, 1, '', 1, new Set(root ? [root.product_id] : []));
  return { nodes, truncated };
}

export interface CostResult {
  unitCostCents: number | null;
  currency: string;
  complete: boolean;
  missing: string[];
  mixedCurrency: string[];
  lines: { lineId: string; number: string; name: string; quantity: number; scrapPct: number; unitCostCents: number | null; extendedCents: number | null; source: 'rolled_up' | 'standard' | 'missing' | 'optional' | 'alternative' | 'other_currency' }[];
}

/**
 * The cost of one unit built from a revision: each line's quantity times (1 + scrap), at the component's rolled-up cost
 * when it has a released bill of materials, else its standard cost. Optional lines and alternatives after the first of
 * their group are not counted; missing costs and other currencies are listed, never guessed.
 */
export async function rollUp(db: D1Database, companyId: string, revisionId: string, currency: string): Promise<CostResult> {
  const memo = new Map<string, { cents: number | null; complete: boolean }>();
  const missing = new Set<string>();
  const mixed = new Set<string>();
  async function productCost(productId: string, depth: number, stack: Set<string>): Promise<{ cents: number | null; complete: boolean }> {
    if (memo.has(productId)) return memo.get(productId)!;
    const p = await db.prepare('SELECT number, standard_cost_cents, currency FROM erp_products WHERE company_id = ? AND id = ?').bind(companyId, productId).first<any>();
    const rel = await db.prepare("SELECT id FROM erp_revisions WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(companyId, productId).first<{ id: string }>();
    let out: { cents: number | null; complete: boolean };
    const hasLines = rel ? await db.prepare('SELECT 1 FROM erp_bom_lines WHERE company_id = ? AND revision_id = ? LIMIT 1').bind(companyId, rel.id).first() : null;
    if (rel && hasLines && depth < 25 && !stack.has(productId)) {
      stack.add(productId);
      const r = await revisionCost(rel.id, depth + 1, stack);
      stack.delete(productId);
      out = { cents: r.cents, complete: r.complete };
    } else if (p?.standard_cost_cents !== null && p?.standard_cost_cents !== undefined) {
      if (p.currency !== currency) {
        mixed.add(p.number);
        out = { cents: null, complete: false };
      } else out = { cents: p.standard_cost_cents, complete: true };
    } else {
      if (p) missing.add(p.number);
      out = { cents: null, complete: false };
    }
    memo.set(productId, out);
    return out;
  }
  async function revisionCost(revId: string, depth: number, stack: Set<string>, detail?: CostResult['lines']) {
    const lines = await db
      .prepare('SELECT l.*, c.number, c.name FROM erp_bom_lines l JOIN erp_products c ON c.company_id = l.company_id AND c.id = l.component_id WHERE l.company_id = ? AND l.revision_id = ? ORDER BY l.position, l.created_at, l.rowid')
      .bind(companyId, revId)
      .all<any>();
    let total = 0;
    let complete = true;
    const groupsSeen = new Set<string>();
    for (const l of lines.results) {
      const q = l.quantity * (1 + (l.scrap_pct || 0) / 100);
      if (l.optional) {
        detail?.push({ lineId: l.id, number: l.number, name: l.name, quantity: l.quantity, scrapPct: l.scrap_pct, unitCostCents: null, extendedCents: null, source: 'optional' });
        continue;
      }
      if (l.alt_group) {
        if (groupsSeen.has(l.alt_group)) {
          detail?.push({ lineId: l.id, number: l.number, name: l.name, quantity: l.quantity, scrapPct: l.scrap_pct, unitCostCents: null, extendedCents: null, source: 'alternative' });
          continue;
        }
        groupsSeen.add(l.alt_group);
      }
      const pc = await productCost(l.component_id, depth, stack);
      const ext = pc.cents === null ? null : Math.round(pc.cents * q);
      if (ext === null) complete = false;
      else total += ext;
      if (!pc.complete) complete = false;
      const relRev = await db.prepare("SELECT 1 FROM erp_revisions r JOIN erp_bom_lines x ON x.company_id = r.company_id AND x.revision_id = r.id WHERE r.company_id = ? AND r.product_id = ? AND r.status = 'released' LIMIT 1").bind(companyId, l.component_id).first();
      detail?.push({ lineId: l.id, number: l.number, name: l.name, quantity: l.quantity, scrapPct: l.scrap_pct, unitCostCents: pc.cents, extendedCents: ext, source: pc.cents === null ? (mixed.has(l.number) ? 'other_currency' : 'missing') : relRev ? 'rolled_up' : 'standard' });
    }
    return { cents: lines.results.length ? total : null, complete };
  }
  const detail: CostResult['lines'] = [];
  const r = await revisionCost(revisionId, 0, new Set(), detail);
  return { unitCostCents: r.cents, currency, complete: r.complete && !missing.size && !mixed.size, missing: [...missing], mixedCurrency: [...mixed], lines: detail };
}

engineeringRoutes.get('/c/:company/revisions/:id/explosion', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const r = await loadRevision(db, a.companyId, c.req.param('id'));
  const asOf = c.req.query('asOf');
  const { nodes, truncated } = await explode(db, a.companyId, r.id, asOf && validDate(asOf) ? asOf : null);
  if (wantsCsv(c)) {
    return csvResponse(`bom-${r.product_number}-rev-${r.label}`, [
      ['Level', 'Position', 'Number', 'Name', 'Type', 'Revision', 'Quantity', 'Unit', 'Scrap %', 'Extended quantity', 'Optional', 'Alternative group', 'Reference', 'Standard cost', 'Currency', 'No released revision'],
      ...nodes.map((n) => [n.level, n.path, n.number, n.name, n.typeLabel, n.revision ?? '', n.quantity, n.uom, n.scrapPct, n.extendedQuantity, n.optional ? 'yes' : '', n.altGroup, n.refDesignator, dollars(n.unitCostCents), n.currency, n.noRelease ? 'yes' : '']),
    ]);
  }
  return c.json({ revision: revisionDTO(r), product: { id: r.product_id, number: r.product_number, name: r.product_name }, nodes, truncated, availability: 'Component availability comes with Inventory (Release 2).' });
});

engineeringRoutes.get('/c/:company/revisions/:id/cost', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const r = await loadRevision(db, a.companyId, c.req.param('id'));
  const p = await loadProduct(db, a.companyId, r.product_id);
  return c.json({ revision: revisionDTO(r), product: { id: p.id, number: p.number, name: p.name }, ...(await rollUp(db, a.companyId, r.id, p.currency)) });
});

engineeringRoutes.get('/c/:company/products/:id/where-used', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const p = await loadProduct(db, a.companyId, c.req.param('id'));
  const rows = await db
    .prepare(
      `SELECT l.id AS line_id, l.quantity, l.uom, l.scrap_pct, l.optional, l.alt_group, r.id AS revision_id, r.label, r.status, pr.id AS product_id, pr.number, pr.name, pr.type
         FROM erp_bom_lines l JOIN erp_revisions r ON r.company_id = l.company_id AND r.id = l.revision_id
         JOIN erp_products pr ON pr.company_id = r.company_id AND pr.id = r.product_id
        WHERE l.company_id = ? AND l.component_id = ? ORDER BY pr.number COLLATE NOCASE, r.created_at`,
    )
    .bind(a.companyId, p.id)
    .all<any>();
  const parents = rows.results.map((x) => ({ lineId: x.line_id, productId: x.product_id, number: x.number, name: x.name, type: x.type, typeLabel: TYPE_LABELS[x.type as keyof typeof TYPE_LABELS] ?? x.type, revisionId: x.revision_id, revision: x.label, revisionStatus: x.status, quantity: x.quantity, uom: x.uom, scrapPct: x.scrap_pct, optional: !!x.optional, altGroup: x.alt_group }));
  // The top-level products that use it through released revisions, at any depth.
  const tops = new Map<string, { id: string; number: string; name: string }>();
  let frontier = [p.id];
  const seen = new Set(frontier);
  for (let depth = 0; depth < 25 && frontier.length; depth++) {
    const up = await db
      .prepare(
        `SELECT DISTINCT pr.id, pr.number, pr.name FROM erp_bom_lines l JOIN erp_revisions r ON r.company_id = l.company_id AND r.id = l.revision_id AND r.status = 'released'
           JOIN erp_products pr ON pr.company_id = r.company_id AND pr.id = r.product_id WHERE l.company_id = ? AND l.component_id IN (${frontier.map(() => '?').join(',')})`,
      )
      .bind(a.companyId, ...frontier)
      .all<{ id: string; number: string; name: string }>();
    const next: string[] = [];
    for (const u of up.results) {
      if (seen.has(u.id)) continue;
      seen.add(u.id);
      next.push(u.id);
      const usedAbove = await db.prepare("SELECT 1 FROM erp_bom_lines l JOIN erp_revisions r ON r.company_id = l.company_id AND r.id = l.revision_id AND r.status = 'released' WHERE l.company_id = ? AND l.component_id = ? LIMIT 1").bind(a.companyId, u.id).first();
      if (!usedAbove) tops.set(u.id, u);
    }
    frontier = next;
  }
  if (wantsCsv(c)) {
    return csvResponse(`where-used-${p.number}`, [['Parent number', 'Parent name', 'Revision', 'Revision status', 'Quantity', 'Unit', 'Scrap %', 'Optional'], ...parents.map((x) => [x.number, x.name, x.revision, x.revisionStatus, x.quantity, x.uom, x.scrapPct, x.optional ? 'yes' : ''])]);
  }
  return c.json({ product: { id: p.id, number: p.number, name: p.name }, parents, topLevel: [...tops.values()] });
});

engineeringRoutes.get('/c/:company/revision-compare', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const ra = await loadRevision(db, a.companyId, zId.parse(c.req.query('a') ?? ''));
  const rb = await loadRevision(db, a.companyId, zId.parse(c.req.query('b') ?? ''));
  const [la, lb] = await Promise.all([linesOf(db, a.companyId, ra.id), linesOf(db, a.companyId, rb.id)]);
  const key = (l: any) => `${l.component_id}|${l.ref_designator}|${l.alt_group}`;
  const mapA = new Map(la.map((l) => [key(l), l]));
  const mapB = new Map(lb.map((l) => [key(l), l]));
  const FIELDS: [string, string][] = [['quantity', 'Quantity'], ['uom', 'Unit'], ['scrap_pct', 'Scrap %'], ['position', 'Position'], ['optional', 'Optional'], ['effective_from', 'Effective from'], ['effective_to', 'Effective to'], ['notes', 'Notes']];
  const added = lb.filter((l) => !mapA.has(key(l))).map(lineDTO);
  const removed = la.filter((l) => !mapB.has(key(l))).map(lineDTO);
  const changedLines = lb
    .filter((l) => mapA.has(key(l)))
    .map((l) => {
      const o = mapA.get(key(l))!;
      const diffs = FIELDS.filter(([f]) => String(o[f] ?? '') !== String(l[f] ?? '')).map(([f, label]) => ({ field: label, from: o[f], to: l[f] }));
      return { component: lineDTO(l), diffs };
    })
    .filter((x) => x.diffs.length);
  const revFields: [string, string][] = [['label', 'Label'], ['status', 'Status'], ['description', 'Description'], ['change_reason', 'Change reason'], ['effective_date', 'Effective date']];
  return c.json({
    a: { ...revisionDTO(ra), productNumber: ra.product_number },
    b: { ...revisionDTO(rb), productNumber: rb.product_number },
    fields: revFields.filter(([f]) => String(ra[f] ?? '') !== String(rb[f] ?? '')).map(([f, label]) => ({ field: label, from: ra[f], to: rb[f] })),
    added,
    removed,
    changed: changedLines,
    same: lb.length - added.length - changedLines.length,
  });
});
