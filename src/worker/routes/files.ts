import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, badRequest, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { activityStmt } from '../services/audit';
import { requireDocument, requireItem, requireWorkspace } from '../services/permissions';
import { broadcast } from '../realtime/board-room';

export const fileRoutes = new Hono<AppEnv>();

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Extension allowlist -> canonical content type. Anything else is rejected. */
export const ALLOWED_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  txt: 'text/plain',
  md: 'text/markdown',
  csv: 'text/csv',
  json: 'application/json',
  zip: 'application/zip',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odt: 'application/vnd.oasis.opendocument.text',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
};

const INLINE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'audio/mpeg']);
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);

function sniffImage(bytes: Uint8Array): string | null {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45) return 'image/webp';
  return null;
}

export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  return base.replace(/[\u0000-\u001f\u007f"<>|*?:]/g, '_').slice(0, 200) || 'file';
}

export async function validateUpload(file: File, opts: { imagesOnly?: boolean } = {}) {
  const name = safeFileName(file.name || 'file');
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  const type = ALLOWED_TYPES[ext];
  if (!type) throw badRequest(`File type .${ext || '?'} is not allowed`);
  if (opts.imagesOnly && !IMAGE_TYPES.has(type)) throw badRequest('Only PNG, JPEG, GIF or WebP images are allowed');
  const limit = opts.imagesOnly ? MAX_IMAGE_BYTES : MAX_FILE_BYTES;
  if (file.size > limit) throw new HttpError(413, `File is larger than ${Math.round(limit / 1024 / 1024)} MB`);
  if (file.size === 0) throw badRequest('File is empty');
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (IMAGE_TYPES.has(type)) {
    const sniffed = sniffImage(bytes);
    if (!sniffed) throw badRequest('File content does not match its image type');
  }
  if (type === 'application/pdf' && !(bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46)) {
    throw badRequest('File content is not a PDF');
  }
  return { name, type: IMAGE_TYPES.has(type) ? sniffImage(bytes)! : type, bytes };
}

fileRoutes.post('/files', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `upload:${user.id}`, 60, 60_000);
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 1024 * 64) throw new HttpError(413, 'File is too large');
  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    throw badRequest('Expected multipart/form-data');
  }
  const file = form.get('file');
  if (!(file instanceof File)) throw badRequest('Missing file');
  const scope = String(form.get('scope') ?? 'item');
  const t = now();
  const id = newId();
  if (scope === 'item') {
    const itemId = String(form.get('itemId') ?? '');
    const { item, board } = await requireItem(c.env.DB, itemId, user.id, 'edit');
    const { name, type, bytes } = await validateUpload(file);
    const key = `ws/${board.workspace_id}/boards/${board.id}/${id}`;
    await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: user.id } });
    await c.env.DB.batch([
      c.env.DB.prepare("INSERT INTO attachments (id, workspace_id, board_id, item_id, scope, uploader_id, file_name, content_type, size, r2_key, created_at) VALUES (?, ?, ?, ?, 'item', ?, ?, ?, ?, ?, ?)").bind(id, board.workspace_id, board.id, item.id, user.id, name, type, bytes.byteLength, key, t),
      activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, itemId: item.id, actorId: user.id, action: 'file_uploaded', newValue: name }),
    ]);
    // Optionally attach to a files column on the item.
    const columnId = form.get('columnId');
    if (typeof columnId === 'string' && columnId) {
      const { svcFromContext } = await import('../services/context');
      const { updateItem } = await import('../services/item-ops');
      const { parseJson } = await import('../lib/util');
      const fresh = await c.env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(item.id).first<any>();
      const current = parseJson<Record<string, unknown>>(fresh.values_json, {})[columnId];
      await updateItem(svcFromContext(c), board, fresh, { values: { [columnId]: [...(Array.isArray(current) ? current : []), id] } });
    }
    c.executionCtx.waitUntil(broadcast(c.env, board.id, { kind: 'item_updated', itemId: item.id, actorId: user.id }));
    return c.json({ id, fileName: name, contentType: type, size: bytes.byteLength, url: `/api/files/${id}`, itemId: item.id, documentId: null, uploaderId: user.id, createdAt: t }, 201);
  }
  if (scope === 'document') {
    const docId = String(form.get('documentId') ?? '');
    const { doc } = await requireDocument(c.env.DB, docId, user.id, 'edit');
    const { name, type, bytes } = await validateUpload(file);
    const key = `ws/${doc.workspace_id}/docs/${doc.id}/${id}`;
    await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
    await c.env.DB.prepare("INSERT INTO attachments (id, workspace_id, document_id, scope, uploader_id, file_name, content_type, size, r2_key, created_at) VALUES (?, ?, ?, 'document', ?, ?, ?, ?, ?, ?)").bind(id, doc.workspace_id, doc.id, user.id, name, type, bytes.byteLength, key, t).run();
    return c.json({ id, fileName: name, contentType: type, size: bytes.byteLength, url: `/api/files/${id}`, itemId: null, documentId: doc.id, uploaderId: user.id, createdAt: t }, 201);
  }
  if (scope === 'avatar') {
    const { name, type, bytes } = await validateUpload(file, { imagesOnly: true });
    const key = `users/${user.id}/avatar-${id}`;
    const old = await c.env.DB.prepare('SELECT avatar_key FROM users WHERE id = ?').bind(user.id).first<{ avatar_key: string | null }>();
    await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
    await c.env.DB.prepare('UPDATE users SET avatar_key = ?, updated_at = ? WHERE id = ?').bind(key, t, user.id).run();
    if (old?.avatar_key) c.executionCtx.waitUntil(c.env.FILES.delete(old.avatar_key));
    return c.json({ avatarUrl: `/api/users/${user.id}/avatar?v=${key.slice(-8)}`, fileName: name }, 201);
  }
  if (scope === 'logo') {
    const wsId = String(form.get('workspaceId') ?? '');
    await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
    const { type, bytes } = await validateUpload(file, { imagesOnly: true });
    const key = `ws/${wsId}/logo-${id}`;
    const old = await c.env.DB.prepare('SELECT logo_key FROM workspaces WHERE id = ?').bind(wsId).first<{ logo_key: string | null }>();
    await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
    await c.env.DB.prepare('UPDATE workspaces SET logo_key = ?, updated_at = ? WHERE id = ?').bind(key, t, wsId).run();
    if (old?.logo_key) c.executionCtx.waitUntil(c.env.FILES.delete(old.logo_key));
    return c.json({ logoUrl: `/api/workspaces/${wsId}/logo?v=${key.slice(-8)}` }, 201);
  }
  throw badRequest('Unknown upload scope');
});

function serveObject(obj: R2ObjectBody, contentType: string, fileName: string, forceDownload: boolean) {
  const inline = !forceDownload && INLINE_TYPES.has(contentType);
  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set('Content-Length', String(obj.size));
  headers.set('Content-Disposition', `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(fileName)}`);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Content-Security-Policy', "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'; sandbox");
  headers.set('Cache-Control', 'private, max-age=300');
  headers.set('ETag', obj.httpEtag);
  return new Response(obj.body, { headers });
}

async function loadAttachment(c: any, need: 'view' | 'edit') {
  const a = (await c.env.DB.prepare('SELECT * FROM attachments WHERE id = ? AND deleted_at IS NULL').bind(c.req.param('id')).first()) as any;
  if (!a) throw notFound('File');
  const userId = c.get('user').id;
  let access: string;
  if (a.scope === 'item') {
    // Resolve visibility first (404 hides existence), then enforce edit (403).
    const r = await requireItem(c.env.DB, a.item_id, userId, 'view').catch(() => {
      throw notFound('File');
    });
    if (need === 'edit') await requireItem(c.env.DB, a.item_id, userId, 'edit');
    if (r.item.workspace_id !== a.workspace_id) throw notFound('File');
    access = r.access;
  } else if (a.scope === 'document') {
    const r = await requireDocument(c.env.DB, a.document_id, userId, 'view').catch(() => {
      throw notFound('File');
    });
    if (need === 'edit') await requireDocument(c.env.DB, a.document_id, userId, 'edit');
    access = r.access;
  } else throw notFound('File');
  return { attachment: a, access };
}

fileRoutes.get('/files/:id', async (c) => {
  const { attachment } = await loadAttachment(c, 'view');
  const obj = await c.env.FILES.get(attachment.r2_key);
  if (!obj) throw notFound('File');
  return serveObject(obj, attachment.content_type, attachment.file_name, c.req.query('download') === '1');
});

fileRoutes.delete('/files/:id', async (c) => {
  const user = c.get('user');
  const { attachment, access } = await loadAttachment(c, 'edit');
  if (attachment.uploader_id !== user.id && access !== 'admin' && access !== 'edit') throw new HttpError(403, 'Cannot delete this file');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE attachments SET deleted_at = ? WHERE id = ?').bind(now(), attachment.id),
    ...(attachment.item_id
      ? [
          c.env.DB.prepare('UPDATE items SET updated_at = ? WHERE id = ?').bind(now(), attachment.item_id),
          activityStmt(c.env.DB, { workspaceId: attachment.workspace_id, boardId: attachment.board_id, itemId: attachment.item_id, actorId: user.id, action: 'file_deleted', oldValue: attachment.file_name }),
        ]
      : []),
  ]);
  c.executionCtx.waitUntil(c.env.FILES.delete(attachment.r2_key));
  if (attachment.board_id) c.executionCtx.waitUntil(broadcast(c.env, attachment.board_id, { kind: 'item_updated', itemId: attachment.item_id, actorId: user.id }));
  return c.json({ ok: true });
});

fileRoutes.get('/boards/:id/files', async (c) => {
  const user = c.get('user');
  const { requireBoard } = await import('../services/permissions');
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'view');
  const rows = await c.env.DB.prepare(
    `SELECT a.*, i.name AS item_name, u.name AS uploader_name FROM attachments a JOIN items i ON i.id = a.item_id JOIN users u ON u.id = a.uploader_id
     WHERE a.board_id = ? AND a.deleted_at IS NULL AND i.archived_at IS NULL ORDER BY a.created_at DESC LIMIT 500`,
  )
    .bind(board.id)
    .all<any>();
  return c.json(rows.results.map((a) => ({ id: a.id, fileName: a.file_name, contentType: a.content_type, size: a.size, url: `/api/files/${a.id}`, itemId: a.item_id, itemName: a.item_name, uploaderName: a.uploader_name, createdAt: a.created_at })));
});

fileRoutes.get('/users/:id/avatar', async (c) => {
  const user = c.get('user');
  const target = c.req.param('id');
  if (target !== user.id) {
    const shared = await c.env.DB.prepare('SELECT 1 FROM workspace_members a JOIN workspace_members b ON a.workspace_id = b.workspace_id WHERE a.user_id = ? AND b.user_id = ? LIMIT 1').bind(user.id, target).first();
    if (!shared) throw notFound('Avatar');
  }
  const row = await c.env.DB.prepare('SELECT avatar_key FROM users WHERE id = ?').bind(target).first<{ avatar_key: string | null }>();
  if (!row?.avatar_key) throw notFound('Avatar');
  const obj = await c.env.FILES.get(row.avatar_key);
  if (!obj) throw notFound('Avatar');
  return serveObject(obj, obj.httpMetadata?.contentType ?? 'image/png', 'avatar', false);
});

fileRoutes.get('/workspaces/:ws/logo', async (c) => {
  await requireWorkspace(c.env.DB, c.req.param('ws'), c.get('user').id);
  const row = await c.env.DB.prepare('SELECT logo_key FROM workspaces WHERE id = ?').bind(c.req.param('ws')).first<{ logo_key: string | null }>();
  if (!row?.logo_key) throw notFound('Logo');
  const obj = await c.env.FILES.get(row.logo_key);
  if (!obj) throw notFound('Logo');
  return serveObject(obj, obj.httpMetadata?.contentType ?? 'image/png', 'logo', false);
});
