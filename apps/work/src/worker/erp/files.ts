// Attachments of products (images and documents) and suppliers (documents), in the app's file store with the same
// checks as every other upload (routes/files.ts validateUpload). Engineering documents with versions and CAD references
// are documents.ts. A file is served only to people who can see what it belongs to.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { MAX_FILE_BYTES, validateUpload } from '../routes/files';
import { assertCan, requireErp, type ErpAccess } from './access';
import { eventStmt, zId } from './util';

export const fileRoutes = new Hono<AppEnv>();

export function fileDTO(f: any) {
  return {
    id: f.id,
    name: f.name,
    mime: f.mime,
    size: f.size,
    isImage: String(f.mime).startsWith('image/'),
    uploadedByName: f.uploader ?? null,
    createdAt: f.created_at,
    url: `/api/erp/c/${f.company_id}/files/${f.id}`,
  };
}

export async function filesOf(db: D1Database, companyId: string, column: 'product_id' | 'supplier_id', id: string) {
  const rows = await db
    .prepare(`SELECT f.*, u.name AS uploader FROM erp_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.company_id = ? AND f.${column} = ? AND f.deleted_at IS NULL ORDER BY f.created_at DESC LIMIT 200`)
    .bind(companyId, id)
    .all<any>();
  return rows.results.map(fileDTO);
}

async function parentOf(db: D1Database, a: ErpAccess, column: 'product_id' | 'supplier_id', id: string, change: boolean) {
  if (column === 'product_id') {
    assertCan(a, change ? 'products.edit' : 'products.view');
    const p = await db.prepare('SELECT id, number FROM erp_products WHERE company_id = ? AND id = ?').bind(a.companyId, id).first<{ id: string; number: string }>();
    if (!p) throw notFound('Product');
    return { column, id: p.id, label: `product ${p.number}`, productId: p.id, entityType: 'product' as const };
  }
  assertCan(a, change ? 'suppliers.edit' : 'suppliers.view');
  const s = await db.prepare('SELECT id, number FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(a.companyId, id).first<{ id: string; number: string }>();
  if (!s) throw notFound('Supplier');
  return { column, id: s.id, label: `supplier ${s.number}`, productId: null, entityType: 'supplier' as const };
}

fileRoutes.post('/c/:company/files', async (c) => {
  const a = await requireErp(c, 'products.view');
  await rateLimit(c.env.DB, `erp-upload:${a.userId}`, 60, 60_000);
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const productId = String(form!.get('productId') ?? '');
  const supplierId = String(form!.get('supplierId') ?? '');
  if (!!productId === !!supplierId) throw new HttpError(400, 'Say what the file belongs to: one product or one supplier');
  const column = productId ? 'product_id' : 'supplier_id';
  const parent = await parentOf(c.env.DB, a, column, zId.parse(productId || supplierId), true);
  const { name, type, bytes } = await validateUpload(file);
  const id = newId();
  const key = `erp/${a.companyId}/${column.replace('_id', '')}/${parent.id}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: a.userId } });
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare(`INSERT INTO erp_files (id, company_id, ${column}, name, mime, size, r2_key, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, a.companyId, parent.id, name, type, bytes.byteLength, key, a.userId, t),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'file.uploaded', entityType: parent.entityType, entityId: parent.id, productId: parent.productId, summary: `File added to ${parent.label}: ${name}`, after: { file: id, name, size: bytes.byteLength }, at: t }),
  ]);
  return c.json(fileDTO({ id, company_id: a.companyId, name, mime: type, size: bytes.byteLength, uploader: a.userName, created_at: t }), 201);
});

async function loadFile(c: any, a: ErpAccess, change: boolean) {
  const f = await c.env.DB.prepare('SELECT * FROM erp_files WHERE company_id = ? AND id = ? AND deleted_at IS NULL').bind(a.companyId, String(c.req.param('id')).slice(0, 64)).first();
  if (!f) throw notFound('File');
  const column = f.product_id ? 'product_id' : 'supplier_id';
  const parent = await parentOf(c.env.DB, a, column, f[column], change);
  return { f, parent };
}

fileRoutes.get('/c/:company/files/:id', async (c) => {
  const a = await requireErp(c, 'products.view');
  const { f } = await loadFile(c, a, false);
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

fileRoutes.delete('/c/:company/files/:id', async (c) => {
  const a = await requireErp(c, 'products.view');
  const { f, parent } = await loadFile(c, a, true);
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE erp_files SET deleted_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, f.id),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'file.removed', entityType: parent.entityType, entityId: parent.id, productId: parent.productId, summary: `File removed from ${parent.label}: ${f.name}`, before: { file: f.id, name: f.name }, at: t }),
  ]);
  c.executionCtx.waitUntil(c.env.FILES.delete(f.r2_key));
  return c.json({ ok: true });
});
