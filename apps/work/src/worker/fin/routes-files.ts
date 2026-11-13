// Receipts, invoices and other documents: uploaded to the app's file store, attached to a transaction, invoice, bill,
// journal or contact or kept in the library, organised by folder and account, searchable, with every version kept.
// A file is served only to people who can see what it belongs to.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { MAX_FILE_BYTES, validateUpload } from '../routes/files';
import { type FinAccess, assertRecord, deny, requireOrg, requirePerm, scopeSql } from './access';
import { moduleOf } from './docs';
import { auditStmt, searchText } from './util';

export const fileRoutes = new Hono<AppEnv>();

type ParentType = 'none' | 'transaction' | 'doc' | 'journal' | 'contact';

/** The person must be able to see the record a file belongs to (and change it, to add or remove files). */
async function assertParent(db: D1Database, a: FinAccess, type: ParentType, id: string | null, action: 'view' | 'edit') {
  if (type === 'none' || !id) return;
  if (type === 'transaction') {
    const r = await db.prepare('SELECT created_by FROM fin_transactions WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(id, a.orgId).first<any>();
    if (!r) throw notFound('Transaction');
    assertRecord(a, 'banking', action, r, 'Transaction');
  } else if (type === 'doc') {
    const r = await db.prepare('SELECT kind, created_by, claimant_id FROM fin_docs WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(id, a.orgId).first<any>();
    if (!r) throw notFound('Document');
    assertRecord(a, moduleOf(r.kind), action, r, 'Document');
  } else if (type === 'contact') {
    const r = await db.prepare('SELECT created_by FROM fin_contacts WHERE id = ? AND org_id = ?').bind(id, a.orgId).first<any>();
    if (!r) throw notFound('Contact');
    assertRecord(a, 'contacts', action === 'edit' ? 'view' : action, r, 'Contact');
  } else if (type === 'journal') {
    const r = await db.prepare('SELECT 1 FROM fin_journals WHERE id = ? AND org_id = ?').bind(id, a.orgId).first();
    if (!r) throw notFound('Journal');
    if (!a.perms.accounting.view) deny('You cannot see journals');
  }
}

function fileDTO(f: any) {
  return { id: f.id, name: f.name, mime: f.mime, size: f.size, parentType: f.parent_type, parentId: f.parent_id, folder: f.folder, accountId: f.account_id, version: f.version, replacesId: f.replaces_id, uploadedBy: f.uploaded_by, uploadedByName: f.uploader ?? null, createdAt: f.created_at, url: `/api/fin/orgs/${f.org_id}/files/${f.id}/download` };
}

fileRoutes.post('/orgs/:org/files', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'documents', 'create', 'You cannot upload documents');
  await rateLimit(c.env.DB, `fin-upload:${a.userId}`, 60, 60_000);
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const parentType = (String(form!.get('parentType') ?? 'none') || 'none') as ParentType;
  if (!['none', 'transaction', 'doc', 'journal', 'contact'].includes(parentType)) throw new HttpError(400, 'Unknown parent');
  const parentId = parentType === 'none' ? null : String(form!.get('parentId') ?? '') || null;
  await assertParent(c.env.DB, a, parentType, parentId, 'edit');
  const folder = String(form!.get('folder') ?? '').trim().slice(0, 80);
  const accountId = String(form!.get('accountId') ?? '') || null;
  if (accountId) {
    const ok = await c.env.DB.prepare('SELECT 1 FROM fin_accounts WHERE id = ? AND org_id = ?').bind(accountId, a.orgId).first();
    if (!ok) throw new HttpError(400, 'Choose an account from this workspace');
  }
  const replacesId = String(form!.get('replacesId') ?? '') || null;
  let version = 1;
  if (replacesId) {
    const old = await c.env.DB.prepare('SELECT * FROM fin_files WHERE id = ? AND org_id = ? AND deleted_at IS NULL').bind(replacesId, a.orgId).first<any>();
    if (!old) throw notFound('File');
    await assertParent(c.env.DB, a, old.parent_type, old.parent_id, 'edit');
    if (old.parent_type === 'none') assertRecord(a, 'documents', 'edit', old, 'File');
    version = old.version + 1;
  }
  const { name, type, bytes } = await validateUpload(file);
  const fid = newId();
  const key = `fin/${a.orgId}/files/${fid}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO fin_files (id, org_id, parent_type, parent_id, folder, account_id, name, mime, size, r2_key, version, replaces_id, search, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(fid, a.orgId, parentType, parentId, folder, accountId, name, type, bytes.length, key, version, replacesId, searchText(name, folder), a.userId, now()),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'file.uploaded', targetType: parentType === 'none' ? 'file' : parentType, targetId: parentId ?? fid, metadata: { file: fid, name, version } }),
  ]);
  return c.json({ id: fid, version }, 201);
});

fileRoutes.get('/orgs/:org/files', async (c) => {
  const a = await requireOrg(c);
  const parentType = c.req.query('parentType') as ParentType | undefined;
  const parentId = c.req.query('parentId');
  const where = ['f.org_id = ?', 'f.deleted_at IS NULL'];
  const args: unknown[] = [a.orgId];
  if (parentType && parentId) {
    await assertParent(c.env.DB, a, parentType, parentId, 'view');
    where.push('f.parent_type = ? AND f.parent_id = ?');
    args.push(parentType, parentId);
  } else {
    // The library: documents the person may see, newest version of each.
    if (a.perms.documents.view === 'none') deny('You cannot see documents');
    const scope = scopeSql(a, 'documents', 'f', 'uploaded_by');
    where.push(scope.sql, 'NOT EXISTS (SELECT 1 FROM fin_files n WHERE n.replaces_id = f.id AND n.deleted_at IS NULL)');
    args.push(...scope.args);
    // Files on records are listed only to people who can see those records.
    if (a.perms.banking.view !== 'all') {
      where.push("f.parent_type <> 'transaction' OR f.uploaded_by = ?");
      args.push(a.userId);
    }
    if (a.perms.sales.view !== 'all' || a.perms.purchases.view !== 'all') {
      where.push("f.parent_type <> 'doc' OR f.uploaded_by = ?");
      args.push(a.userId);
    }
    const folder = c.req.query('folder');
    if (folder) {
      where.push('f.folder = ?');
      args.push(folder);
    }
    const account = c.req.query('account');
    if (account) {
      where.push('f.account_id = ?');
      args.push(account);
    }
    const q = (c.req.query('q') ?? '').trim().toLowerCase();
    if (q) {
      where.push('f.search LIKE ?');
      args.push(`%${q.replace(/[%_]/g, '')}%`);
    }
  }
  const rows = await c.env.DB.prepare(`SELECT f.*, u.name AS uploader FROM fin_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE ${where.map((w) => `(${w})`).join(' AND ')} ORDER BY f.created_at DESC LIMIT 500`).bind(...args).all<any>();
  const folders = await c.env.DB.prepare("SELECT folder, COUNT(*) AS n FROM fin_files WHERE org_id = ? AND deleted_at IS NULL AND folder <> '' GROUP BY folder ORDER BY folder").bind(a.orgId).all<{ folder: string; n: number }>();
  return c.json({ files: rows.results.map(fileDTO), folders: folders.results });
});

async function loadFile(c: any, a: FinAccess, action: 'view' | 'edit' | 'delete') {
  const f = await c.env.DB.prepare('SELECT f.*, u.name AS uploader FROM fin_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.id = ? AND f.org_id = ? AND f.deleted_at IS NULL').bind(c.req.param('id'), a.orgId).first();
  if (!f) throw notFound('File');
  if ((f as any).parent_type !== 'none') await assertParent(c.env.DB, a, (f as any).parent_type, (f as any).parent_id, action === 'view' ? 'view' : 'edit');
  else assertRecord(a, 'documents', action, f as any, 'File');
  return f as any;
}

fileRoutes.get('/orgs/:org/files/:id/download', async (c) => {
  const a = await requireOrg(c);
  const f = await loadFile(c, a, 'view');
  const obj = await c.env.FILES.get(f.r2_key);
  if (!obj) throw notFound('File');
  const inline = c.req.query('inline') === '1' && (f.mime.startsWith('image/') || f.mime === 'application/pdf');
  return new Response(obj.body, {
    headers: {
      'Content-Type': f.mime,
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${f.name.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
});

fileRoutes.get('/orgs/:org/files/:id/versions', async (c) => {
  const a = await requireOrg(c);
  const f = await loadFile(c, a, 'view');
  // Walk back through the versions this one replaced, and forward through those that replaced it.
  const chain: any[] = [f];
  let back = f.replaces_id;
  for (let i = 0; back && i < 50; i++) {
    const prev = await c.env.DB.prepare('SELECT f.*, u.name AS uploader FROM fin_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.id = ? AND f.org_id = ?').bind(back, a.orgId).first<any>();
    if (!prev) break;
    chain.push(prev);
    back = prev.replaces_id;
  }
  let fwd = f.id;
  for (let i = 0; i < 50; i++) {
    const next = await c.env.DB.prepare('SELECT f.*, u.name AS uploader FROM fin_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.replaces_id = ? AND f.org_id = ?').bind(fwd, a.orgId).first<any>();
    if (!next) break;
    chain.unshift(next);
    fwd = next.id;
  }
  return c.json(chain.map((x) => ({ ...fileDTO(x), deleted: !!x.deleted_at })));
});

fileRoutes.patch('/orgs/:org/files/:id', async (c) => {
  const a = await requireOrg(c);
  const f = await loadFile(c, a, 'edit');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(200).optional(), folder: z.string().trim().max(80).optional(), accountId: z.string().max(64).nullable().optional() }));
  if (input.accountId) {
    const ok = await c.env.DB.prepare('SELECT 1 FROM fin_accounts WHERE id = ? AND org_id = ?').bind(input.accountId, a.orgId).first();
    if (!ok) throw new HttpError(400, 'Choose an account from this workspace');
  }
  const name = input.name ?? f.name;
  const folder = input.folder ?? f.folder;
  await c.env.DB.prepare('UPDATE fin_files SET name = ?, folder = ?, account_id = ?, search = ? WHERE id = ? AND org_id = ?').bind(name, folder, input.accountId !== undefined ? input.accountId : f.account_id, searchText(name, folder), f.id, a.orgId).run();
  return c.json({ ok: true });
});

fileRoutes.delete('/orgs/:org/files/:id', async (c) => {
  const a = await requireOrg(c);
  const f = await loadFile(c, a, 'delete');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_files SET deleted_at = ? WHERE id = ? AND org_id = ?').bind(now(), f.id, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'file.deleted', targetType: f.parent_type === 'none' ? 'file' : f.parent_type, targetId: f.parent_id ?? f.id, metadata: { file: f.id, name: f.name } }),
  ]);
  return c.json({ ok: true });
});
