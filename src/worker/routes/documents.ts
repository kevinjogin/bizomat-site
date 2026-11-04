import { Hono } from 'hono';
import { z } from 'zod';
import { isSafeUrl } from '../../shared/columns';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, newId, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { svcFromContext } from '../services/context';
import { extractMentions, notify } from '../services/notify';
import { requireBoard, requireDocument, requireItem, requireWorkspace, wsAtLeast, type DocumentRow } from '../services/permissions';

export const documentRoutes = new Hono<AppEnv>();

const MAX_DOC_BYTES = 1_000_000;
const SNAPSHOT_INTERVAL_MS = 5 * 60_000;

// --------------------------------------------- rich-text sanitisation (XSS)

const NODE_TYPES = new Set([
  'doc', 'paragraph', 'text', 'heading', 'bulletList', 'orderedList', 'listItem', 'taskList', 'taskItem',
  'blockquote', 'codeBlock', 'horizontalRule', 'hardBreak', 'image', 'table', 'tableRow', 'tableHeader', 'tableCell',
]);
const MARK_TYPES = new Set(['bold', 'italic', 'strike', 'code', 'link', 'underline', 'highlight']);

function safeImageSrc(src: unknown): string | null {
  if (typeof src !== 'string') return null;
  if (/^\/api\/files\/[A-Za-z0-9_-]+$/.test(src)) return src;
  try {
    const u = new URL(src);
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Walk TipTap/ProseMirror JSON keeping only allowed nodes, marks and attributes. */
export function sanitizeDoc(node: any, depth = 0): any | null {
  if (!node || typeof node !== 'object' || depth > 40) return null;
  const type = String(node.type ?? '');
  if (!NODE_TYPES.has(type)) return null;
  const out: any = { type };
  if (type === 'text') {
    if (typeof node.text !== 'string' || !node.text) return null;
    out.text = node.text.slice(0, 100_000);
  }
  const attrs = node.attrs && typeof node.attrs === 'object' ? node.attrs : {};
  const a: Record<string, unknown> = {};
  if (type === 'heading') a.level = Math.min(6, Math.max(1, Number(attrs.level) || 1));
  if (type === 'taskItem') a.checked = !!attrs.checked;
  if (type === 'orderedList' && Number.isFinite(Number(attrs.start))) a.start = Number(attrs.start);
  if (type === 'codeBlock' && typeof attrs.language === 'string') a.language = attrs.language.replace(/[^a-z0-9+#-]/gi, '').slice(0, 20);
  if ((type === 'tableCell' || type === 'tableHeader') && attrs) {
    a.colspan = Math.min(20, Math.max(1, Number(attrs.colspan) || 1));
    a.rowspan = Math.min(20, Math.max(1, Number(attrs.rowspan) || 1));
    if (Array.isArray(attrs.colwidth)) a.colwidth = attrs.colwidth.slice(0, 20).map((n: unknown) => Math.min(2000, Math.max(20, Number(n) || 100)));
  }
  if (type === 'image') {
    const src = safeImageSrc(attrs.src);
    if (!src) return null;
    a.src = src;
    if (typeof attrs.alt === 'string') a.alt = attrs.alt.slice(0, 300);
    if (typeof attrs.title === 'string') a.title = attrs.title.slice(0, 300);
  }
  if (Object.keys(a).length) out.attrs = a;
  if (Array.isArray(node.marks) && type === 'text') {
    const marks = [];
    for (const m of node.marks.slice(0, 10)) {
      if (!m || !MARK_TYPES.has(m.type)) continue;
      if (m.type === 'link') {
        const href = typeof m.attrs?.href === 'string' ? m.attrs.href : '';
        if (!isSafeUrl(href) && !href.startsWith('/')) continue;
        marks.push({ type: 'link', attrs: { href: href.slice(0, 2000), target: '_blank', rel: 'noopener noreferrer nofollow' } });
      } else marks.push({ type: m.type });
    }
    if (marks.length) out.marks = marks;
  }
  if (Array.isArray(node.content)) {
    out.content = node.content.slice(0, 5000).map((n: any) => sanitizeDoc(n, depth + 1)).filter(Boolean);
  }
  return out;
}

export function docText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.text ?? '';
  const inner = (node.content ?? []).map(docText).join(node.type === 'doc' ? '\n' : ' ');
  return inner;
}

const docDTO = (d: DocumentRow, access?: string) => ({
  id: d.id,
  workspaceId: d.workspace_id,
  title: d.title,
  content: parseJson(d.content_json, { type: 'doc', content: [] }),
  boardId: d.board_id,
  itemId: d.item_id,
  visibility: d.visibility,
  version: d.version,
  createdBy: d.created_by,
  updatedBy: d.updated_by,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
  archivedAt: d.archived_at,
  access,
});

documentRoutes.get('/workspaces/:ws/documents', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const role = await requireWorkspace(c.env.DB, wsId, user.id);
  const archived = c.req.query('archived') === '1';
  const boardId = c.req.query('boardId');
  const itemId = c.req.query('itemId');
  const rows = await c.env.DB.prepare(
    `SELECT d.id, d.workspace_id, d.title, d.board_id, d.item_id, d.visibility, d.version, d.created_by, d.updated_by, d.created_at, d.updated_at, d.archived_at,
            substr(d.search_text, 1, 200) AS excerpt, u.name AS created_by_name, dm.role AS doc_role
     FROM documents d JOIN users u ON u.id = d.created_by
     LEFT JOIN document_members dm ON dm.document_id = d.id AND dm.user_id = ?
     WHERE d.workspace_id = ? AND ${archived ? 'd.archived_at IS NOT NULL' : 'd.archived_at IS NULL'}
       ${boardId ? 'AND d.board_id = ?' : ''} ${itemId ? 'AND d.item_id = ?' : ''}
     ORDER BY d.updated_at DESC LIMIT 500`,
  )
    .bind(user.id, wsId, ...(boardId ? [boardId] : []), ...(itemId ? [itemId] : []))
    .all<any>();
  const visible = rows.results.filter((d) => wsAtLeast(role, 'admin') || d.visibility === 'workspace' || d.created_by === user.id || d.doc_role);
  return c.json(visible.map((d) => ({ id: d.id, title: d.title, boardId: d.board_id, itemId: d.item_id, visibility: d.visibility, excerpt: d.excerpt, createdBy: d.created_by, createdByName: d.created_by_name, updatedAt: d.updated_at, createdAt: d.created_at, archivedAt: d.archived_at })));
});

const linkSchema = z.object({ boardId: z.string().nullable().optional(), itemId: z.string().nullable().optional() });

async function validateLinks(c: any, wsId: string, input: { boardId?: string | null; itemId?: string | null }) {
  const userId = c.get('user').id;
  if (input.itemId) {
    const { item } = await requireItem(c.env.DB, input.itemId, userId, 'view');
    if (item.workspace_id !== wsId) throw notFound('Item');
    input.boardId = item.board_id;
  } else if (input.boardId) {
    const { board } = await requireBoard(c.env.DB, input.boardId, userId, 'view');
    if (board.workspace_id !== wsId) throw notFound('Board');
  }
}

documentRoutes.post('/workspaces/:ws/documents', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'member');
  const input = await body(c, linkSchema.extend({ title: z.string().trim().min(1).max(300).default('Untitled'), content: z.unknown().optional(), visibility: z.enum(['workspace', 'private']).default('workspace') }));
  await validateLinks(c, wsId, input);
  const content = sanitizeDoc(input.content ?? { type: 'doc', content: [{ type: 'paragraph' }] }) ?? { type: 'doc', content: [] };
  const json = JSON.stringify(content);
  if (json.length > MAX_DOC_BYTES) throw new HttpError(413, 'Document is too large');
  const id = newId();
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO documents (id, workspace_id, title, content_json, search_text, board_id, item_id, visibility, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(
      id, wsId, input.title, json, `${input.title}\n${docText(content)}`.toLowerCase().slice(0, 20000), input.boardId ?? null, input.itemId ?? null, input.visibility, user.id, user.id, t, t,
    ),
    c.env.DB.prepare('INSERT INTO document_versions (id, document_id, workspace_id, version, title, content_json, created_by, created_at) VALUES (?, ?, ?, 1, ?, ?, ?, ?)').bind(newId(), id, wsId, input.title, json, user.id, t),
  ]);
  const row = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(id).first<DocumentRow>();
  return c.json(docDTO(row!, 'admin'), 201);
});

documentRoutes.get('/documents/:id', async (c) => {
  const user = c.get('user');
  const { doc, access } = await requireDocument(c.env.DB, c.req.param('id'), user.id, 'view');
  const members = await c.env.DB.prepare('SELECT dm.user_id, dm.role, u.name FROM document_members dm JOIN users u ON u.id = dm.user_id WHERE dm.document_id = ?').bind(doc.id).all();
  const attachments = await c.env.DB.prepare('SELECT id, file_name, content_type, size, created_at FROM attachments WHERE document_id = ? AND deleted_at IS NULL ORDER BY created_at DESC').bind(doc.id).all<any>();
  c.executionCtx.waitUntil(
    c.env.DB.prepare("INSERT INTO recents (user_id, workspace_id, entity_type, entity_id, visited_at) VALUES (?, ?, 'document', ?, ?) ON CONFLICT(user_id, entity_type, entity_id) DO UPDATE SET visited_at = excluded.visited_at")
      .bind(user.id, doc.workspace_id, doc.id, now())
      .run(),
  );
  return c.json({
    ...docDTO(doc, access),
    members: members.results,
    attachments: attachments.results.map((a) => ({ id: a.id, fileName: a.file_name, contentType: a.content_type, size: a.size, url: `/api/files/${a.id}`, createdAt: a.created_at })),
  });
});

documentRoutes.patch('/documents/:id', async (c) => {
  const user = c.get('user');
  const input = await body(
    c,
    linkSchema.extend({
      title: z.string().trim().min(1).max(300).optional(),
      content: z.unknown().optional(),
      baseVersion: z.number().int().optional(),
      snapshot: z.boolean().optional(),
      visibility: z.enum(['workspace', 'private']).optional(),
    }),
  );
  const need = input.visibility ? 'admin' : 'edit';
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), user.id, need);
  if (doc.archived_at) throw new HttpError(409, 'Document is archived');
  // Optimistic concurrency: reject saves based on a stale version.
  if (input.content !== undefined && input.baseVersion !== undefined && input.baseVersion !== doc.version) {
    return c.json({ error: 'This document was changed by someone else. Reload to see the latest version.', latest: docDTO(doc) }, 409);
  }
  if (input.boardId !== undefined || input.itemId !== undefined) await validateLinks(c, doc.workspace_id, input);
  let contentJson = doc.content_json;
  let content = parseJson<any>(doc.content_json, null);
  if (input.content !== undefined) {
    content = sanitizeDoc(input.content) ?? { type: 'doc', content: [] };
    contentJson = JSON.stringify(content);
    if (contentJson.length > MAX_DOC_BYTES) throw new HttpError(413, 'Document is too large');
  }
  const title = input.title ?? doc.title;
  const changed = contentJson !== doc.content_json || title !== doc.title;
  const version = changed ? doc.version + 1 : doc.version;
  const t = now();
  const stmts = [
    c.env.DB.prepare('UPDATE documents SET title = ?, content_json = ?, search_text = ?, board_id = ?, item_id = ?, visibility = ?, version = ?, updated_by = ?, updated_at = ? WHERE id = ?').bind(
      title,
      contentJson,
      `${title}\n${docText(content)}`.toLowerCase().slice(0, 20000),
      input.boardId !== undefined ? input.boardId : doc.board_id,
      input.itemId !== undefined ? input.itemId : doc.item_id,
      input.visibility ?? doc.visibility,
      version,
      user.id,
      t,
      doc.id,
    ),
  ];
  if (changed) {
    const last = await c.env.DB.prepare('SELECT created_at, created_by FROM document_versions WHERE document_id = ? ORDER BY version DESC LIMIT 1').bind(doc.id).first<{ created_at: number; created_by: string }>();
    if (input.snapshot || !last || t - last.created_at > SNAPSHOT_INTERVAL_MS || last.created_by !== user.id || title !== doc.title) {
      stmts.push(c.env.DB.prepare('INSERT INTO document_versions (id, document_id, workspace_id, version, title, content_json, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), doc.id, doc.workspace_id, version, title, contentJson, user.id, t));
    }
  }
  await c.env.DB.batch(stmts);
  return c.json({ ok: true, version, updatedAt: t });
});

documentRoutes.post('/documents/:id/archive', async (c) => {
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), c.get('user').id, 'admin');
  const { archived } = await body(c, z.object({ archived: z.boolean() }));
  await c.env.DB.prepare('UPDATE documents SET archived_at = ? WHERE id = ?').bind(archived ? now() : null, doc.id).run();
  return c.json({ ok: true });
});

documentRoutes.delete('/documents/:id', async (c) => {
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), c.get('user').id, 'admin');
  const files = await c.env.DB.prepare('SELECT r2_key FROM attachments WHERE document_id = ?').bind(doc.id).all<{ r2_key: string }>();
  await c.env.DB.batch([c.env.DB.prepare('DELETE FROM attachments WHERE document_id = ?').bind(doc.id), c.env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(doc.id)]);
  if (files.results.length) c.executionCtx.waitUntil(c.env.FILES.delete(files.results.map((f) => f.r2_key)));
  return c.json({ ok: true });
});

documentRoutes.post('/documents/:id/duplicate', async (c) => {
  const user = c.get('user');
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), user.id, 'view');
  await requireWorkspace(c.env.DB, doc.workspace_id, user.id, 'member');
  const id = newId();
  const t = now();
  await c.env.DB.prepare('INSERT INTO documents (id, workspace_id, title, content_json, search_text, board_id, item_id, visibility, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, doc.workspace_id, `${doc.title} (copy)`, doc.content_json, doc.search_text, doc.board_id, doc.item_id, doc.visibility, user.id, user.id, t, t)
    .run();
  return c.json({ id }, 201);
});

// ----------------------------------------------------------------- history

documentRoutes.get('/documents/:id/versions', async (c) => {
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), c.get('user').id, 'view');
  const rows = await c.env.DB.prepare('SELECT v.id, v.version, v.title, v.created_at, u.name AS author FROM document_versions v JOIN users u ON u.id = v.created_by WHERE v.document_id = ? ORDER BY v.version DESC LIMIT 100').bind(doc.id).all();
  return c.json(rows.results);
});

documentRoutes.get('/documents/:id/versions/:versionId', async (c) => {
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), c.get('user').id, 'view');
  const v = await c.env.DB.prepare('SELECT * FROM document_versions WHERE id = ? AND document_id = ?').bind(c.req.param('versionId'), doc.id).first<any>();
  if (!v) throw notFound('Version');
  return c.json({ id: v.id, version: v.version, title: v.title, content: parseJson(v.content_json, null), createdAt: v.created_at });
});

documentRoutes.post('/documents/:id/versions/:versionId/restore', async (c) => {
  const user = c.get('user');
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), user.id, 'edit');
  const v = await c.env.DB.prepare('SELECT * FROM document_versions WHERE id = ? AND document_id = ?').bind(c.req.param('versionId'), doc.id).first<any>();
  if (!v) throw notFound('Version');
  const version = doc.version + 1;
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE documents SET title = ?, content_json = ?, search_text = ?, version = ?, updated_by = ?, updated_at = ? WHERE id = ?').bind(v.title, v.content_json, `${v.title}\n${docText(parseJson(v.content_json, null))}`.toLowerCase(), version, user.id, t, doc.id),
    c.env.DB.prepare('INSERT INTO document_versions (id, document_id, workspace_id, version, title, content_json, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), doc.id, doc.workspace_id, version, v.title, v.content_json, user.id, t),
  ]);
  return c.json({ ok: true, version });
});

// ----------------------------------------------------------------- sharing

documentRoutes.put('/documents/:id/members', async (c) => {
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), c.get('user').id, 'admin');
  const input = await body(c, z.object({ userId: z.string(), role: z.enum(['editor', 'viewer']) }));
  const m = await c.env.DB.prepare('SELECT 1 FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(doc.workspace_id, input.userId).first();
  if (!m) throw badRequest('User must be a workspace member');
  await c.env.DB.prepare('INSERT INTO document_members (document_id, workspace_id, user_id, role) VALUES (?, ?, ?, ?) ON CONFLICT(document_id, user_id) DO UPDATE SET role = excluded.role').bind(doc.id, doc.workspace_id, input.userId, input.role).run();
  return c.json({ ok: true });
});

documentRoutes.delete('/documents/:id/members/:userId', async (c) => {
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), c.get('user').id, 'admin');
  await c.env.DB.prepare('DELETE FROM document_members WHERE document_id = ? AND user_id = ?').bind(doc.id, c.req.param('userId')).run();
  return c.json({ ok: true });
});

// ---------------------------------------------------------------- comments

documentRoutes.get('/documents/:id/comments', async (c) => {
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), c.get('user').id, 'view');
  const rows = await c.env.DB.prepare('SELECT dc.*, u.name AS author_name FROM document_comments dc JOIN users u ON u.id = dc.author_id WHERE dc.document_id = ? AND dc.deleted_at IS NULL ORDER BY dc.created_at').bind(doc.id).all<any>();
  return c.json(rows.results.map((r) => ({ id: r.id, parentId: r.parent_id, authorId: r.author_id, authorName: r.author_name, body: r.body, resolvedAt: r.resolved_at, createdAt: r.created_at })));
});

documentRoutes.post('/documents/:id/comments', async (c) => {
  const user = c.get('user');
  const { doc } = await requireDocument(c.env.DB, c.req.param('id'), user.id, 'view');
  await rateLimit(c.env.DB, `doccomments:${user.id}`, 60, 60_000);
  const input = await body(c, z.object({ body: z.string().trim().min(1).max(5000), parentId: z.string().nullable().optional() }));
  let parentAuthor: string | null = null;
  if (input.parentId) {
    const p = await c.env.DB.prepare('SELECT author_id FROM document_comments WHERE id = ? AND document_id = ?').bind(input.parentId, doc.id).first<{ author_id: string }>();
    if (!p) throw badRequest('Parent comment not found');
    parentAuthor = p.author_id;
  }
  const id = newId();
  await c.env.DB.prepare('INSERT INTO document_comments (id, document_id, workspace_id, parent_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, doc.id, doc.workspace_id, input.parentId ?? null, user.id, input.body, now()).run();
  const svc = svcFromContext(c);
  const link = `/w/${doc.workspace_id}/docs/${doc.id}`;
  const mentioned: string[] = [];
  for (const uid of extractMentions(input.body)) if (await requireDocument(c.env.DB, doc.id, uid).catch(() => null)) mentioned.push(uid);
  await notify(svc, { workspaceId: doc.workspace_id, userIds: mentioned, type: 'mention', title: `${user.name} mentioned you in "${doc.title}"`, body: input.body.slice(0, 200), link, entityType: 'document', entityId: doc.id });
  const others = [doc.created_by, parentAuthor].filter((u): u is string => !!u && !mentioned.includes(u));
  await notify(svc, { workspaceId: doc.workspace_id, userIds: others, type: parentAuthor ? 'reply' : 'comment', title: `${user.name} commented on "${doc.title}"`, body: input.body.slice(0, 200), link, entityType: 'document', entityId: doc.id });
  return c.json({ id }, 201);
});

documentRoutes.patch('/document-comments/:id', async (c) => {
  const user = c.get('user');
  const cm = await c.env.DB.prepare('SELECT * FROM document_comments WHERE id = ? AND deleted_at IS NULL').bind(c.req.param('id')).first<any>();
  if (!cm) throw notFound('Comment');
  const { access } = await requireDocument(c.env.DB, cm.document_id, user.id, 'view');
  const input = await body(c, z.object({ resolved: z.boolean().optional(), body: z.string().trim().min(1).max(5000).optional() }));
  if (input.body && cm.author_id !== user.id) throw new HttpError(403, 'You can only edit your own comments');
  if (input.resolved !== undefined && access === 'view' && cm.author_id !== user.id) throw new HttpError(403, 'Cannot resolve this comment');
  await c.env.DB.prepare('UPDATE document_comments SET body = ?, resolved_at = ? WHERE id = ?').bind(input.body ?? cm.body, input.resolved === undefined ? cm.resolved_at : input.resolved ? now() : null, cm.id).run();
  return c.json({ ok: true });
});

documentRoutes.delete('/document-comments/:id', async (c) => {
  const user = c.get('user');
  const cm = await c.env.DB.prepare('SELECT * FROM document_comments WHERE id = ? AND deleted_at IS NULL').bind(c.req.param('id')).first<any>();
  if (!cm) throw notFound('Comment');
  const { access } = await requireDocument(c.env.DB, cm.document_id, user.id, 'view');
  if (cm.author_id !== user.id && access !== 'admin') throw new HttpError(403, 'Cannot delete this comment');
  await c.env.DB.prepare('UPDATE document_comments SET deleted_at = ? WHERE id = ? OR parent_id = ?').bind(now(), cm.id, cm.id).run();
  return c.json({ ok: true });
});
