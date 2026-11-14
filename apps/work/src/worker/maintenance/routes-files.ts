// Photos and documents of assets, requests and work orders (/api/maintenance/c/:company/files), kept in the app's file
// store (FILES: R2 on Cloudflare, the data folder on the Node runtime) with the same checks as every other upload
// (routes/files.ts validateUpload: allowed types only, images checked by their content). A file is served only to
// people who can see what it belongs to, and changed only by people who may change that.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { MAX_FILE_BYTES, validateUpload } from '../routes/files';
import { deny, isManager, requestScope, requireMt, type MtAccess } from './access';
import { canWork, loadWorkOrder } from './routes-work';
import { LOCKED, eventStmt, fileDTO } from './util';

export const fileRoutes = new Hono<AppEnv>();

type Parent = { column: 'asset_id' | 'request_id' | 'work_order_id'; id: string; assetId: string | null; label: string };

/** What the file belongs to, after checking the caller may see it (404) and, for `change`, change its files (403/409). */
async function parentOf(db: D1Database, a: MtAccess, column: Parent['column'], id: string, change: boolean, uploaderId?: string | null): Promise<Parent> {
  if (column === 'asset_id') {
    const r = await db.prepare('SELECT id, number FROM mt_assets WHERE company_id = ? AND id = ?').bind(a.companyId, id).first<{ id: string; number: string }>();
    if (!r) throw notFound('Asset');
    if (change && !isManager(a)) deny('Only maintenance supervisors and administrators can change an asset’s files');
    return { column, id: r.id, assetId: r.id, label: `asset ${r.number}` };
  }
  if (column === 'request_id') {
    const s = requestScope(a, 'r');
    const r = await db.prepare(`SELECT r.id, r.number, r.asset_id, r.status, r.requested_by FROM mt_requests r WHERE r.company_id = ? AND r.id = ? AND ${s.sql}`).bind(a.companyId, id, ...s.args).first<any>();
    if (!r) throw notFound('Request');
    if (change) {
      if (r.requested_by !== a.userId && !isManager(a)) deny('Only the person who raised the request, a supervisor or an administrator can change its files');
      if (r.status === 'closed') throw new HttpError(409, `${r.number} is closed`);
    }
    return { column, id: r.id, assetId: r.asset_id, label: `request ${r.number}` };
  }
  const w = await loadWorkOrder(db, a, id);
  if (change) {
    // Supervisors and administrators remove anyone's files; the assigned technician adds files and removes their own.
    if (!canWork(a, w) || (uploaderId !== undefined && uploaderId !== a.userId && !isManager(a))) deny('Only the assigned technician, a supervisor or an administrator can change this work order’s files');
    if ((LOCKED as string[]).includes(w.status)) throw new HttpError(409, `${w.number} is ${w.status} and locked. A supervisor or administrator can reopen it with a reason.`);
  }
  return { column, id: w.id, assetId: w.asset_id, label: `work order ${w.number}` };
}

fileRoutes.post('/c/:company/files', async (c) => {
  const a = await requireMt(c);
  await rateLimit(c.env.DB, `mt-upload:${a.userId}`, 60, 60_000);
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const given = (['assetId', 'requestId', 'workOrderId'] as const).filter((k) => String(form!.get(k) ?? ''));
  if (given.length !== 1) throw new HttpError(400, 'Say what the file belongs to: one asset, request or work order');
  const column = ({ assetId: 'asset_id', requestId: 'request_id', workOrderId: 'work_order_id' } as const)[given[0]];
  const parent = await parentOf(c.env.DB, a, column, String(form!.get(given[0])).slice(0, 64), true);
  const { name, type, bytes } = await validateUpload(file);
  const id = newId();
  const key = `mt/${a.companyId}/${column.replace('_id', '')}/${parent.id}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: a.userId } });
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare(`INSERT INTO mt_files (id, company_id, ${column}, name, mime, size, r2_key, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, a.companyId, parent.id, name, type, bytes.byteLength, key, a.userId, t),
    eventStmt(c.env.DB, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'file.uploaded',
      assetId: parent.assetId,
      requestId: column === 'request_id' ? parent.id : null,
      workOrderId: column === 'work_order_id' ? parent.id : null,
      summary: `${type.startsWith('image/') ? 'Photo' : 'Document'} added to ${parent.label}: ${name}`,
      after: { file: id, name, size: bytes.byteLength },
      at: t,
    }),
  ]);
  return c.json(fileDTO({ id, company_id: a.companyId, name, mime: type, size: bytes.byteLength, uploaded_by: a.userId, uploader: a.userName, created_at: t }), 201);
});

async function loadFile(c: any, a: MtAccess, change: boolean) {
  const f = await c.env.DB.prepare('SELECT * FROM mt_files WHERE company_id = ? AND id = ? AND deleted_at IS NULL').bind(a.companyId, c.req.param('id')).first();
  if (!f) throw notFound('File');
  const column = f.asset_id ? 'asset_id' : f.request_id ? 'request_id' : 'work_order_id';
  const parent = await parentOf(c.env.DB, a, column, f[column], change, change ? f.uploaded_by : undefined).catch((e) => {
    // Someone who cannot see the record cannot tell the file exists.
    if (e instanceof HttpError && e.status === 404) throw notFound('File');
    throw e;
  });
  return { f, parent };
}

fileRoutes.get('/c/:company/files/:id', async (c) => {
  const a = await requireMt(c);
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
  const a = await requireMt(c);
  const { f, parent } = await loadFile(c, a, true);
  if (parent.column === 'request_id' && f.uploaded_by !== a.userId && !isManager(a)) deny('You can remove only files you added');
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE mt_files SET deleted_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, f.id),
    eventStmt(c.env.DB, {
      companyId: a.companyId,
      actorId: a.userId,
      action: 'file.removed',
      assetId: parent.assetId,
      requestId: parent.column === 'request_id' ? parent.id : null,
      workOrderId: parent.column === 'work_order_id' ? parent.id : null,
      summary: `File removed from ${parent.label}: ${f.name}`,
      before: { file: f.id, name: f.name },
      at: t,
    }),
  ]);
  c.executionCtx.waitUntil(c.env.FILES.delete(f.r2_key));
  return c.json({ ok: true });
});
