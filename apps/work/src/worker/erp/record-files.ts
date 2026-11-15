// Attachments of procurement records (requisitions, requests for quotation, supplier quotations, purchase orders and
// goods receipts) and, from Release 3, of routings and manufacturing orders: erp_record_files, in the app's file store
// with the same checks as every other upload (routes/files.ts validateUpload). A file is served only to people who may
// see that kind of record in the company (purchasing or manufacturing).

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { MAX_FILE_BYTES, validateUpload } from '../routes/files';
import { assertCan, requireErp, type Capability } from './access';
import { eventStmt, zId } from './util';

export const recordFileRoutes = new Hono<AppEnv>();

export type RecordKind = 'requisition' | 'rfq' | 'quotation' | 'purchase_order' | 'receipt' | 'routing' | 'manufacturing_order';
const KINDS: Record<RecordKind, { table: string; label: string; event: 'requisition' | 'rfq' | 'purchase_order' | 'receipt' | 'routing' | 'manufacturing_order'; parent?: string; view: Capability; number?: string }> = {
  requisition: { table: 'erp_requisitions', label: 'requisition', event: 'requisition', view: 'purchasing.view' },
  rfq: { table: 'erp_rfqs', label: 'request for quotation', event: 'rfq', view: 'purchasing.view' },
  quotation: { table: 'erp_quotations', label: 'quotation', event: 'rfq', parent: 'rfq_id', view: 'purchasing.view' },
  purchase_order: { table: 'erp_purchase_orders', label: 'purchase order', event: 'purchase_order', view: 'purchasing.view' },
  receipt: { table: 'erp_receipts', label: 'goods receipt', event: 'receipt', view: 'purchasing.view' },
  routing: { table: 'erp_routings', label: 'routing revision', event: 'routing', view: 'manufacturing.view', number: 'revision' },
  manufacturing_order: { table: 'erp_mfg_orders', label: 'manufacturing order', event: 'manufacturing_order', view: 'manufacturing.view' },
};

export function recordFileDTO(f: any) {
  return { id: f.id, name: f.name, mime: f.mime, size: f.size, isImage: String(f.mime).startsWith('image/'), uploadedBy: f.uploaded_by, uploadedByName: f.uploader ?? null, createdAt: f.created_at, url: `/api/erp/c/${f.company_id}/record-files/${f.id}` };
}

export async function recordFiles(db: D1Database, companyId: string, kind: RecordKind, id: string) {
  const rows = await db
    .prepare('SELECT f.*, u.name AS uploader FROM erp_record_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.company_id = ? AND f.entity_type = ? AND f.entity_id = ? AND f.deleted_at IS NULL ORDER BY f.created_at DESC LIMIT 200')
    .bind(companyId, kind, id)
    .all<any>();
  return rows.results.map(recordFileDTO);
}

async function parent(db: D1Database, companyId: string, kind: RecordKind, id: string) {
  const k = KINDS[kind];
  const row = await db.prepare(`SELECT id, ${k.parent ? `${k.parent} AS parent_id,` : ''} ${kind === 'quotation' ? "'' AS number" : `${k.number ?? 'number'} AS number`} FROM ${k.table} WHERE company_id = ? AND id = ?`).bind(companyId, id).first<any>();
  if (!row) throw notFound(k.label[0].toUpperCase() + k.label.slice(1));
  return { entityId: k.parent ? row.parent_id : row.id, label: kind === 'quotation' ? 'a quotation' : `${k.label} ${row.number}`, event: k.event };
}

recordFileRoutes.post('/c/:company/record-files', async (c) => {
  const a = await requireErp(c, 'products.view');
  await rateLimit(c.env.DB, `erp-upload:${a.userId}`, 60, 60_000);
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const kind = String(form!.get('kind') ?? '') as RecordKind;
  if (!Object.hasOwn(KINDS, kind)) throw new HttpError(400, 'Say what the file belongs to');
  // a requisition's files: whoever may raise requisitions; the rest: buyers, and the warehouse for receipts; routings:
  // whoever may change them; manufacturing orders: production managers
  if (kind === 'requisition') assertCan(a, 'requisitions.raise');
  else if (kind === 'receipt') assertCan(a, 'receiving.post');
  else if (kind === 'routing') assertCan(a, 'manufacturing.setup');
  else if (kind === 'manufacturing_order') assertCan(a, 'production.plan');
  else assertCan(a, 'purchasing.edit');
  const id0 = zId.parse(String(form!.get('id') ?? ''));
  const p = await parent(c.env.DB, a.companyId, kind, id0);
  const { name, type, bytes } = await validateUpload(file);
  const id = newId();
  const key = `erp/${a.companyId}/${kind}/${id0}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: a.userId } });
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO erp_record_files (id, company_id, entity_type, entity_id, name, mime, size, r2_key, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, kind, id0, name, type, bytes.byteLength, key, a.userId, t),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'file.uploaded', entityType: p.event, entityId: p.entityId, summary: `File added to ${p.label}: ${name}`, after: { file: id, name, size: bytes.byteLength }, at: t }),
  ]);
  return c.json(recordFileDTO({ id, company_id: a.companyId, name, mime: type, size: bytes.byteLength, uploaded_by: a.userId, uploader: a.userName, created_at: t }), 201);
});

async function loadRecordFile(c: any) {
  const a = await requireErp(c, 'products.view');
  const f = await c.env.DB.prepare('SELECT * FROM erp_record_files WHERE company_id = ? AND id = ? AND deleted_at IS NULL').bind(a.companyId, String(c.req.param('id')).slice(0, 64)).first();
  if (!f) throw notFound('File');
  if (!Object.hasOwn(KINDS, f.entity_type)) throw notFound('File');
  const k = KINDS[f.entity_type as RecordKind];
  assertCan(a, k.view);
  return { a, f };
}

recordFileRoutes.get('/c/:company/record-files/:id', async (c) => {
  const { f } = await loadRecordFile(c);
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

recordFileRoutes.delete('/c/:company/record-files/:id', async (c) => {
  const { a, f } = await loadRecordFile(c);
  const manager = f.entity_type === 'routing' || f.entity_type === 'manufacturing_order' ? 'production_manager' : 'procurement_manager';
  if (f.uploaded_by !== a.userId && !a.roles.includes('erp_admin') && !a.roles.includes(manager)) throw new HttpError(403, `Only the person who added it, a ${manager === 'production_manager' ? 'production' : 'procurement'} manager or an ERP administrator can remove it`);
  const p = await parent(c.env.DB, a.companyId, f.entity_type, f.entity_id);
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE erp_record_files SET deleted_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, f.id),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'file.removed', entityType: p.event, entityId: p.entityId, summary: `File removed from ${p.label}: ${f.name}`, before: { file: f.id, name: f.name }, at: t }),
  ]);
  c.executionCtx.waitUntil(c.env.FILES.delete(f.r2_key));
  return c.json({ ok: true });
});
