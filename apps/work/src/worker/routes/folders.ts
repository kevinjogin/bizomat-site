import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, newId, notFound, now } from '../lib/util';
import { requireWorkspace, wsAtLeast } from '../services/permissions';

export const folderRoutes = new Hono<AppEnv>();

export const FOLDER_SCOPES = ['documents', 'boards', 'dashboards'] as const;
export type FolderScope = (typeof FOLDER_SCOPES)[number];
const SCOPE_TABLE: Record<FolderScope, string> = { documents: 'documents', boards: 'boards', dashboards: 'dashboards' };
const MAX_FOLDERS = 500;
const MAX_DEPTH = 8;

const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Colour must be a hex value like #F97316');

interface FolderRow {
  id: string;
  workspace_id: string;
  scope: FolderScope;
  parent_id: string | null;
  name: string;
  color: string;
  position: number;
  created_by: string;
  created_at: number;
  updated_at: number;
}

const dto = (f: FolderRow) => ({
  id: f.id,
  scope: f.scope,
  parentId: f.parent_id,
  name: f.name,
  color: f.color,
  position: f.position,
  createdBy: f.created_by,
  createdAt: f.created_at,
  updatedAt: f.updated_at,
});

/**
 * Validates that `folderId` is a folder of the given scope in the given
 * workspace. Used by documents/boards/dashboards when filing an entity.
 */
export async function assertFolder(db: D1Database, workspaceId: string, scope: FolderScope, folderId: string | null | undefined) {
  if (!folderId) return;
  const f = await db.prepare('SELECT scope FROM folders WHERE id = ? AND workspace_id = ?').bind(folderId, workspaceId).first<{ scope: string }>();
  if (!f) throw badRequest('Folder not found in this workspace');
  if (f.scope !== scope) throw badRequest(`That folder holds ${f.scope}, not ${scope}`);
}

async function ancestors(db: D1Database, folderId: string | null): Promise<string[]> {
  const chain: string[] = [];
  let cur = folderId;
  while (cur && chain.length <= MAX_DEPTH + 1) {
    chain.push(cur);
    const row = await db.prepare('SELECT parent_id FROM folders WHERE id = ?').bind(cur).first<{ parent_id: string | null }>();
    cur = row?.parent_id ?? null;
  }
  return chain;
}

folderRoutes.get('/workspaces/:ws/folders', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id);
  const scope = c.req.query('scope');
  if (scope && !FOLDER_SCOPES.includes(scope as FolderScope)) throw badRequest('Unknown folder scope');
  const rows = await c.env.DB.prepare(`SELECT * FROM folders WHERE workspace_id = ? ${scope ? 'AND scope = ?' : ''} ORDER BY position, name`)
    .bind(wsId, ...(scope ? [scope] : []))
    .all<FolderRow>();
  return c.json(rows.results.map(dto));
});

folderRoutes.post('/workspaces/:ws/folders', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'member');
  const input = await body(
    c,
    z.object({ scope: z.enum(FOLDER_SCOPES), name: z.string().trim().min(1).max(100), color: colorSchema.optional(), parentId: z.string().nullable().optional() }),
  );
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM folders WHERE workspace_id = ?').bind(wsId).first<{ n: number }>();
  if ((count?.n ?? 0) >= MAX_FOLDERS) throw badRequest('Folder limit reached for this workspace');
  if (input.parentId) {
    await assertFolder(c.env.DB, wsId, input.scope, input.parentId);
    if ((await ancestors(c.env.DB, input.parentId)).length >= MAX_DEPTH) throw badRequest(`Folders can be nested at most ${MAX_DEPTH} levels deep`);
  }
  const agg = await c.env.DB.prepare('SELECT MAX(position) AS hi FROM folders WHERE workspace_id = ? AND scope = ?').bind(wsId, input.scope).first<{ hi: number | null }>();
  const id = newId();
  const t = now();
  await c.env.DB.prepare('INSERT INTO folders (id, workspace_id, scope, parent_id, name, color, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, wsId, input.scope, input.parentId ?? null, input.name, input.color ?? '#F97316', (agg?.hi ?? 0) + 1000, user.id, t, t)
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM folders WHERE id = ?').bind(id).first<FolderRow>();
  return c.json(dto(row!), 201);
});

async function loadFolder(c: any) {
  const f = (await c.env.DB.prepare('SELECT * FROM folders WHERE id = ?').bind(c.req.param('id')).first()) as FolderRow | null;
  if (!f) throw notFound('Folder');
  const role = await requireWorkspace(c.env.DB, f.workspace_id, c.get('user').id).catch(() => {
    throw notFound('Folder');
  });
  return { folder: f, role };
}

folderRoutes.patch('/folders/:id', async (c) => {
  const { folder, role } = await loadFolder(c);
  if (!wsAtLeast(role, 'member')) throw new HttpError(403, 'Viewers cannot change folders');
  const input = await body(
    c,
    z.object({ name: z.string().trim().min(1).max(100).optional(), color: colorSchema.optional(), parentId: z.string().nullable().optional(), position: z.number().optional() }),
  );
  let parentId = folder.parent_id;
  if (input.parentId !== undefined) {
    parentId = input.parentId;
    if (parentId) {
      await assertFolder(c.env.DB, folder.workspace_id, folder.scope, parentId);
      const chain = await ancestors(c.env.DB, parentId);
      if (chain.includes(folder.id)) throw badRequest('A folder cannot be moved inside itself');
      if (chain.length >= MAX_DEPTH) throw badRequest(`Folders can be nested at most ${MAX_DEPTH} levels deep`);
    }
  }
  await c.env.DB.prepare('UPDATE folders SET name = ?, color = ?, parent_id = ?, position = ?, updated_at = ? WHERE id = ?')
    .bind(input.name ?? folder.name, input.color ?? folder.color, parentId, input.position ?? folder.position, now(), folder.id)
    .run();
  const row = await c.env.DB.prepare('SELECT * FROM folders WHERE id = ?').bind(folder.id).first<FolderRow>();
  return c.json(dto(row!));
});

/** Deleting a folder never deletes content: sub-folders and items move up to the parent. */
folderRoutes.delete('/folders/:id', async (c) => {
  const { folder, role } = await loadFolder(c);
  if (folder.created_by !== c.get('user').id && !wsAtLeast(role, 'admin')) throw new HttpError(403, 'Only the folder creator or a workspace admin can delete this folder');
  const table = SCOPE_TABLE[folder.scope];
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE folders SET parent_id = ? WHERE parent_id = ? AND workspace_id = ?').bind(folder.parent_id, folder.id, folder.workspace_id),
    c.env.DB.prepare(`UPDATE ${table} SET folder_id = ? WHERE folder_id = ? AND workspace_id = ?`).bind(folder.parent_id, folder.id, folder.workspace_id),
    c.env.DB.prepare('DELETE FROM folders WHERE id = ?').bind(folder.id),
  ]);
  return c.json({ ok: true });
});
