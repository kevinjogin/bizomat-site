// BIZOMAT ERP, Release 1: engineering documents (/api/erp/c/:company/documents...).
//
// A document (DOC-0001) belongs to a product and, optionally, one of its revisions. Each version is either a file in the
// app's file store (checked as every upload is; DXF and STEP files only when their content starts the way those formats
// must, and then only ever downloaded, never shown in the browser) or a CAD reference: the path, configuration and file
// name of a SOLIDWORKS file on the engineer's own computer. A CAD reference is a note of where the file is; the server
// never has the file and never claims to. Documents are drafts until an engineering approver approves them; a new
// version returns an approved document to draft. Obsolete documents take no new versions.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, andAll, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { MAX_FILE_BYTES, safeFileName, validateUpload } from '../routes/files';
import { can, requireErp, type ErpAccess } from './access';
import { DOC_KINDS, DOC_STATUS, badState, csvResponse, eventStmt, historyOf, likeOf, nextNumber, paging, searchText, wantsCsv, zId, zText } from './util';

export const documentRoutes = new Hono<AppEnv>();

const KIND_LABELS: Record<(typeof DOC_KINDS)[number], string> = { drawing: 'Drawing', model: '3D model', pdf: 'PDF', dxf: 'DXF', step: 'STEP', specification: 'Specification', image: 'Image', other: 'Other' };
const STATUS_LABELS: Record<(typeof DOC_STATUS)[number], string> = { draft: 'Draft', approved: 'Approved', obsolete: 'Obsolete' };

/** CAD exchange files: accepted only when their content starts the way the format requires. */
const CAD_TYPES: Record<string, { mime: string; check: (head: string) => boolean; label: string }> = {
  dxf: { mime: 'application/dxf', label: 'DXF', check: (h) => h.startsWith('AutoCAD Binary DXF') || /^\s*0\s*\r?\n\s*SECTION\b/.test(h) || /^\s*999\s*\r?\n/.test(h) },
  step: { mime: 'model/step', label: 'STEP', check: (h) => /^\s*ISO-10303-21\s*;/.test(h) },
  stp: { mime: 'model/step', label: 'STEP', check: (h) => /^\s*ISO-10303-21\s*;/.test(h) },
  // AutoCAD drawings (CAD Automation exports them from SOLIDWORKS drawings): the version string every DWG starts with.
  dwg: { mime: 'image/vnd.dwg', label: 'DWG', check: (h) => /^AC10\d\d/.test(h) },
};

/** validateUpload, plus DXF and STEP after a content check. */
export async function validateEngineeringUpload(file: File) {
  const name = safeFileName(file.name || 'file');
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  const cad = CAD_TYPES[ext];
  if (!cad) return validateUpload(file);
  if (file.size > MAX_FILE_BYTES) throw new HttpError(413, `File is larger than ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB`);
  if (file.size === 0) throw new HttpError(400, 'File is empty');
  const bytes = new Uint8Array(await file.arrayBuffer());
  // A UTF-8 byte order mark before the text is allowed.
  const start = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? 3 : 0;
  const head = new TextDecoder('latin1').decode(bytes.subarray(start, start + 256));
  if (!cad.check(head)) throw new HttpError(400, `This file does not look like a ${cad.label} file`);
  return { name, type: cad.mime, bytes };
}

export function docDTO(d: any) {
  return {
    id: d.id,
    number: d.number,
    title: d.title,
    kind: d.kind,
    kindLabel: KIND_LABELS[d.kind as keyof typeof KIND_LABELS] ?? d.kind,
    status: d.status,
    statusLabel: STATUS_LABELS[d.status as keyof typeof STATUS_LABELS] ?? d.status,
    productId: d.product_id,
    productNumber: d.product_number ?? null,
    productName: d.product_name ?? null,
    revisionId: d.revision_id,
    revisionLabel: d.revision_label ?? null,
    approvedByName: d.approved_by_name ?? null,
    approvedAt: d.approved_at,
    createdByName: d.created_by_name ?? null,
    latestVersion: d.latest_version ?? null,
    latestDocRevision: d.latest_doc_revision ?? null,
    latestSource: d.latest_source ?? null,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

function versionDTO(v: any) {
  return {
    id: v.id,
    version: v.version,
    docRevision: v.doc_revision,
    source: v.source,
    fileName: v.file_name,
    mime: v.mime,
    size: v.size,
    url: v.source === 'file' ? `/api/erp/c/${v.company_id}/documents/${v.document_id}/versions/${v.id}/file` : null,
    cadPath: v.cad_path,
    cadConfig: v.cad_config,
    cadFileName: v.cad_file_name,
    note: v.note,
    createdByName: v.created_by_name ?? null,
    createdAt: v.created_at,
  };
}

const DOC_SELECT = `SELECT d.*, p.number AS product_number, p.name AS product_name, r.label AS revision_label, au.name AS approved_by_name, cu.name AS created_by_name,
       v.version AS latest_version, v.doc_revision AS latest_doc_revision, v.source AS latest_source
  FROM erp_documents d JOIN erp_products p ON p.company_id = d.company_id AND p.id = d.product_id
  LEFT JOIN erp_revisions r ON r.company_id = d.company_id AND r.id = d.revision_id
  LEFT JOIN users au ON au.id = d.approved_by LEFT JOIN users cu ON cu.id = d.created_by
  LEFT JOIN erp_document_versions v ON v.company_id = d.company_id AND v.document_id = d.id AND v.version = (SELECT MAX(x.version) FROM erp_document_versions x WHERE x.company_id = d.company_id AND x.document_id = d.id)`;

export async function loadDoc(db: D1Database, companyId: string, id: string) {
  const d = await db.prepare(`${DOC_SELECT} WHERE d.company_id = ? AND d.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!d) throw notFound('Document');
  return d;
}

/** Documents of a product (for its page). */
export async function documentsOf(db: D1Database, companyId: string, productId: string) {
  const rows = await db.prepare(`${DOC_SELECT} WHERE d.company_id = ? AND d.product_id = ? ORDER BY d.number COLLATE NOCASE LIMIT 500`).bind(companyId, productId).all<any>();
  return rows.results.map(docDTO);
}

const cadRefSchema = z.object({
  cadPath: zText(1000).min(1, 'Give the file’s path on your computer'),
  cadConfig: zText(200).optional(),
  cadFileName: zText(260).optional(),
});
const metaSchema = z.object({
  productId: zId,
  revisionId: zId.nullable().optional(),
  title: zText(200).min(1),
  kind: z.enum(DOC_KINDS),
  docRevision: zText(20).optional(),
  note: zText(1000).optional(),
});

/** A version from the request: multipart with a file, or JSON with a CAD reference. */
async function readVersion(c: any): Promise<{ fields: Record<string, unknown>; file: { name: string; type: string; bytes: Uint8Array } | null; cad: z.infer<typeof cadRefSchema> | null }> {
  const ct = String(c.req.header('Content-Type') ?? '');
  if (ct.startsWith('multipart/form-data')) {
    const len = Number(c.req.header('Content-Length') ?? '0');
    if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
    const form = await c.req.formData().catch(() => null);
    if (!form) throw new HttpError(400, 'Expected a form with a file');
    const file = form.get('file');
    if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
    const fields: Record<string, unknown> = {};
    for (const k of ['productId', 'revisionId', 'title', 'kind', 'docRevision', 'note']) {
      const v = form.get(k);
      if (typeof v === 'string' && v !== '') fields[k] = v;
    }
    return { fields, file: await validateEngineeringUpload(file), cad: null };
  }
  const json = await c.req.json().catch(() => null);
  if (!json || typeof json !== 'object') throw new HttpError(400, 'Send a file, or a CAD reference (the file’s path on your computer)');
  const cad = cadRefSchema.safeParse(json);
  if (!cad.success) throw new HttpError(400, cad.error.issues[0]?.message ?? 'Give the file’s path on your computer');
  return { fields: json, file: null, cad: cad.data };
}

function parse<T>(schema: z.ZodType<T>, v: unknown): T {
  const r = schema.safeParse(v);
  if (!r.success) throw new HttpError(400, r.error.issues[0]?.message ?? 'Invalid input', r.error.issues);
  return r.data;
}

export async function versionStatements(c: any, a: ErpAccess, docId: string, version: number, v: Awaited<ReturnType<typeof readVersion>>, docRevision: string, note: string, t: number) {
  const db = c.env.DB as D1Database;
  const id = newId();
  if (v.file) {
    const key = `erp/${a.companyId}/documents/${docId}/${id}`;
    await c.env.FILES.put(key, v.file.bytes, { httpMetadata: { contentType: v.file.type }, customMetadata: { uploader: a.userId } });
    return {
      id,
      stmt: db
        .prepare("INSERT INTO erp_document_versions (id, company_id, document_id, version, doc_revision, source, file_name, mime, size, r2_key, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, 'file', ?, ?, ?, ?, ?, ?, ?)")
        .bind(id, a.companyId, docId, version, docRevision, v.file.name, v.file.type, v.file.bytes.byteLength, key, note, a.userId, t),
      describe: `file ${v.file.name}`,
    };
  }
  const cad = v.cad!;
  const fileName = cad.cadFileName || cad.cadPath.split(/[\\/]/).pop() || '';
  return {
    id,
    stmt: db
      .prepare("INSERT INTO erp_document_versions (id, company_id, document_id, version, doc_revision, source, cad_path, cad_config, cad_file_name, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, 'cad_reference', ?, ?, ?, ?, ?, ?)")
      .bind(id, a.companyId, docId, version, docRevision, cad.cadPath, cad.cadConfig ?? '', fileName, note, a.userId, t),
    describe: `CAD reference ${fileName}${cad.cadConfig ? ` (${cad.cadConfig})` : ''}`,
  };
}

documentRoutes.get('/c/:company/documents', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const where: string[] = [];
  const args: unknown[] = [a.companyId];
  const filters: [string, string, readonly string[] | null][] = [
    ['productId', 'd.product_id', null],
    ['revisionId', 'd.revision_id', null],
    ['kind', 'd.kind', DOC_KINDS],
    ['status', 'd.status', DOC_STATUS],
  ];
  for (const [q, col, allowed] of filters) {
    const v = c.req.query(q);
    if (v && (!allowed || allowed.includes(v))) {
      where.push(`${col} = ?`);
      args.push(v.slice(0, 64));
    }
  }
  const q = c.req.query('q');
  if (q?.trim()) {
    where.push('d.search LIKE ?');
    args.push(likeOf(q));
  }
  const { limit, offset } = paging(c);
  const sql = `${DOC_SELECT} WHERE d.company_id = ?${andAll(where)} ORDER BY d.updated_at DESC, d.rowid DESC`;
  if (wantsCsv(c)) {
    const rows = await db.prepare(`${sql} LIMIT 10000`).bind(...args).all<any>();
    return csvResponse('engineering-documents', [
      ['Number', 'Title', 'Kind', 'Status', 'Product', 'Product revision', 'Latest version', 'Document revision', 'Source', 'Approved by'],
      ...rows.results.map((d) => [d.number, d.title, KIND_LABELS[d.kind as keyof typeof KIND_LABELS], STATUS_LABELS[d.status as keyof typeof STATUS_LABELS], d.product_number, d.revision_label ?? '', d.latest_version ?? '', d.latest_doc_revision ?? '', d.latest_source === 'cad_reference' ? 'CAD reference' : 'File', d.approved_by_name ?? '']),
    ]);
  }
  const [rows, total] = await Promise.all([db.prepare(`${sql} LIMIT ? OFFSET ?`).bind(...args, limit, offset).all<any>(), db.prepare(`SELECT COUNT(*) AS n FROM erp_documents d WHERE d.company_id = ?${andAll(where)}`).bind(...args).first<{ n: number }>()]);
  return c.json({ documents: rows.results.map(docDTO), total: total?.n ?? 0 });
});

documentRoutes.post('/c/:company/documents', async (c) => {
  const a = await requireErp(c, 'documents.edit');
  const db = c.env.DB;
  await rateLimit(db, `erp-upload:${a.userId}`, 60, 60_000);
  const v = await readVersion(c);
  const meta = parse(metaSchema, v.fields);
  const p = await db.prepare('SELECT id, number, archived_at FROM erp_products WHERE company_id = ? AND id = ?').bind(a.companyId, meta.productId).first<{ id: string; number: string; archived_at: number | null }>();
  if (!p) throw notFound('Product');
  if (p.archived_at) badState(`${p.number} is archived: restore it first`);
  let revLabel: string | null = null;
  if (meta.revisionId) {
    const r = await db.prepare('SELECT label FROM erp_revisions WHERE company_id = ? AND id = ? AND product_id = ?').bind(a.companyId, meta.revisionId, p.id).first<{ label: string }>();
    if (!r) throw notFound('Revision');
    revLabel = r.label;
  }
  const id = newId();
  const t = now();
  const number = await nextNumber(db, a.companyId, 'document');
  const ver = await versionStatements(c, a, id, 1, v, meta.docRevision ?? '', meta.note ?? '', t);
  try {
    await db.batch([
      db
        .prepare("INSERT INTO erp_documents (id, company_id, number, product_id, revision_id, title, kind, status, search, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)")
        .bind(id, a.companyId, number, p.id, meta.revisionId ?? null, meta.title, meta.kind, searchText(number, meta.title, p.number, v.file?.name, v.cad?.cadFileName), a.userId, t, t),
      ver.stmt,
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'document.created', entityType: 'document', entityId: id, productId: p.id, summary: `Document ${number} added to ${p.number}${revLabel ? ` revision ${revLabel}` : ''}: ${meta.title} (${ver.describe})`, after: { title: meta.title, kind: meta.kind, version: 1 }, at: t }),
    ]);
  } catch (e) {
    if (v.file) c.executionCtx.waitUntil(c.env.FILES.delete(`erp/${a.companyId}/documents/${id}/${ver.id}`));
    throw e;
  }
  return c.json(docDTO(await loadDoc(db, a.companyId, id)), 201);
});

documentRoutes.get('/c/:company/documents/:id', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const d = await loadDoc(db, a.companyId, c.req.param('id'));
  const versions = await db
    .prepare('SELECT v.*, u.name AS created_by_name FROM erp_document_versions v LEFT JOIN users u ON u.id = v.created_by WHERE v.company_id = ? AND v.document_id = ? ORDER BY v.version DESC')
    .bind(a.companyId, d.id)
    .all<any>();
  return c.json({
    document: docDTO(d),
    versions: versions.results.map(versionDTO),
    history: await historyOf(db, a.companyId, { entityType: 'document', entityId: d.id }, 50),
    can: { edit: d.status !== 'obsolete' && can(a, 'documents.edit'), approve: d.status === 'draft' && can(a, 'documents.approve'), obsolete: d.status !== 'obsolete' && can(a, 'documents.approve') },
  });
});

documentRoutes.patch('/c/:company/documents/:id', async (c) => {
  const a = await requireErp(c, 'documents.edit');
  const db = c.env.DB;
  const d = await loadDoc(db, a.companyId, c.req.param('id'));
  if (d.status === 'obsolete') badState(`${d.number} is obsolete`);
  const input = parse(z.object({ title: zText(200).min(1).optional(), kind: z.enum(DOC_KINDS).optional(), revisionId: zId.nullable().optional() }), await c.req.json().catch(() => ({})));
  const row: Record<string, unknown> = {};
  if (input.title !== undefined && input.title !== d.title) row.title = input.title;
  if (input.kind !== undefined && input.kind !== d.kind) row.kind = input.kind;
  if (input.revisionId !== undefined && input.revisionId !== d.revision_id) {
    if (input.revisionId) {
      const r = await db.prepare('SELECT id FROM erp_revisions WHERE company_id = ? AND id = ? AND product_id = ?').bind(a.companyId, input.revisionId, d.product_id).first();
      if (!r) throw notFound('Revision');
    }
    row.revision_id = input.revisionId;
  }
  if (!Object.keys(row).length) return c.json(docDTO(d));
  const t = now();
  await db.batch([
    db.prepare(`UPDATE erp_documents SET ${Object.keys(row).map((k) => `${k} = ?`).join(', ')}, search = ?, updated_at = ? WHERE company_id = ? AND id = ?`).bind(...Object.values(row), searchText(d.number, (row.title as string) ?? d.title, d.product_number), t, a.companyId, d.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'document.updated', entityType: 'document', entityId: d.id, productId: d.product_id, summary: `${d.number} details changed`, before: Object.fromEntries(Object.keys(row).map((k) => [k, d[k]])), after: row, at: t }),
  ]);
  return c.json(docDTO(await loadDoc(db, a.companyId, d.id)));
});

documentRoutes.post('/c/:company/documents/:id/versions', async (c) => {
  const a = await requireErp(c, 'documents.edit');
  const db = c.env.DB;
  await rateLimit(db, `erp-upload:${a.userId}`, 60, 60_000);
  const d = await loadDoc(db, a.companyId, c.req.param('id'));
  if (d.status === 'obsolete') badState(`${d.number} is obsolete and takes no new versions`);
  const v = await readVersion(c);
  const meta = parse(z.object({ docRevision: zText(20).optional(), note: zText(1000).optional() }), v.fields);
  const version = Number(d.latest_version ?? 0) + 1;
  const t = now();
  const ver = await versionStatements(c, a, d.id, version, v, meta.docRevision ?? '', meta.note ?? '', t);
  try {
    await db.batch([
      ver.stmt,
      db.prepare("UPDATE erp_documents SET status = 'draft', approved_by = NULL, approved_at = NULL, updated_at = ? WHERE company_id = ? AND id = ?").bind(t, a.companyId, d.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'document.version_added', entityType: 'document', entityId: d.id, productId: d.product_id, summary: `${d.number} version ${version} added (${ver.describe})${d.status === 'approved' ? '; back to draft until approved again' : ''}`, before: { version: version - 1, status: d.status }, after: { version, status: 'draft' }, at: t }),
    ]);
  } catch (e) {
    if (v.file) c.executionCtx.waitUntil(c.env.FILES.delete(`erp/${a.companyId}/documents/${d.id}/${ver.id}`));
    // two versions added at the same moment: the second is refused by the unique version number
    if (String(e).includes('UNIQUE')) badState(`Someone added a version to ${d.number} at the same moment: reload it`);
    throw e;
  }
  return c.json(docDTO(await loadDoc(db, a.companyId, d.id)), 201);
});

documentRoutes.get('/c/:company/documents/:id/versions/:versionId/file', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const v = await db
    .prepare("SELECT * FROM erp_document_versions WHERE company_id = ? AND document_id = ? AND id = ? AND source = 'file'")
    .bind(a.companyId, String(c.req.param('id')).slice(0, 64), String(c.req.param('versionId')).slice(0, 64))
    .first<any>();
  if (!v) throw notFound('File');
  const obj = await c.env.FILES.get(v.r2_key);
  if (!obj) throw notFound('File');
  const inline = c.req.query('download') !== '1' && (String(v.mime).startsWith('image/') || v.mime === 'application/pdf');
  return new Response(obj.body, {
    headers: {
      // CAD exchange files are only ever downloaded
      'Content-Type': CAD_MIMES.has(v.mime) ? 'application/octet-stream' : v.mime,
      'Content-Length': String(v.size),
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(v.file_name)}`,
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
});
const CAD_MIMES = new Set(Object.values(CAD_TYPES).map((t) => t.mime));

documentRoutes.post('/c/:company/documents/:id/approve', async (c) => {
  const a = await requireErp(c, 'documents.approve');
  const db = c.env.DB;
  const d = await loadDoc(db, a.companyId, c.req.param('id'));
  if (d.status !== 'draft') badState(`${d.number} is ${d.status}: only a draft can be approved`);
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_documents SET status = 'approved', approved_by = ?, approved_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft' AND updated_at = ?").bind(a.userId, t, t, a.companyId, d.id, d.updated_at),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'document.approved', entityType: 'document', entityId: d.id, productId: d.product_id, summary: `${d.number} version ${d.latest_version} approved`, before: { status: 'draft' }, after: { status: 'approved', version: d.latest_version }, at: t }),
  ]);
  if (!res[0].meta.changes) badState(`${d.number} changed meanwhile: reload it before approving`);
  return c.json(docDTO(await loadDoc(db, a.companyId, d.id)));
});

documentRoutes.post('/c/:company/documents/:id/obsolete', async (c) => {
  const a = await requireErp(c, 'documents.approve');
  const db = c.env.DB;
  const d = await loadDoc(db, a.companyId, c.req.param('id'));
  if (d.status === 'obsolete') badState(`${d.number} is already obsolete`);
  const t = now();
  await db.batch([
    db.prepare("UPDATE erp_documents SET status = 'obsolete', updated_at = ? WHERE company_id = ? AND id = ?").bind(t, a.companyId, d.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'document.obsolete', entityType: 'document', entityId: d.id, productId: d.product_id, summary: `${d.number} marked obsolete`, before: { status: d.status }, after: { status: 'obsolete' }, at: t }),
  ]);
  return c.json(docDTO(await loadDoc(db, a.companyId, d.id)));
});
