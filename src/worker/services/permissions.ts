// Central authorisation. EVERY route that touches workspace data goes through
// one of these helpers. Non-members get 404 (not 403) so the existence of other
// tenants' records is never revealed.

import type { BoardAccess, WorkspaceRole } from '../../shared/types';
import { HttpError, notFound } from '../lib/util';

const WS_RANK: Record<WorkspaceRole, number> = { viewer: 1, member: 2, admin: 3, owner: 4 };
const ACCESS_RANK: Record<BoardAccess, number> = { view: 1, edit: 2, admin: 3 };

export function wsAtLeast(role: WorkspaceRole, min: WorkspaceRole): boolean {
  return WS_RANK[role] >= WS_RANK[min];
}

export async function getWorkspaceRole(db: D1Database, workspaceId: string, userId: string): Promise<WorkspaceRole | null> {
  const row = await db
    .prepare(
      `SELECT m.role FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id
       WHERE m.workspace_id = ? AND m.user_id = ? AND w.deleted_at IS NULL`,
    )
    .bind(workspaceId, userId)
    .first<{ role: WorkspaceRole }>();
  return row?.role ?? null;
}

export async function requireWorkspace(
  db: D1Database,
  workspaceId: string,
  userId: string,
  min: WorkspaceRole = 'viewer',
): Promise<WorkspaceRole> {
  const role = await getWorkspaceRole(db, workspaceId, userId);
  if (!role) throw notFound('Workspace');
  if (!wsAtLeast(role, min)) throw new HttpError(403, `This action requires the ${min} role`);
  return role;
}

export interface BoardRow {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  kind: 'board' | 'personal' | 'template';
  visibility: 'workspace' | 'private';
  icon: string;
  settings_json: string;
  position: number;
  created_by: string;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
}

export function computeBoardAccess(
  board: Pick<BoardRow, 'visibility' | 'kind' | 'created_by'>,
  wsRole: WorkspaceRole,
  boardRole: 'owner' | 'editor' | 'viewer' | null,
  userId: string,
): BoardAccess | null {
  if (wsRole === 'owner' || wsRole === 'admin') return 'admin';
  const fromBoardRole: BoardAccess | null = boardRole === 'owner' ? 'admin' : boardRole === 'editor' ? 'edit' : boardRole === 'viewer' ? 'view' : null;
  if (board.kind === 'personal') return board.created_by === userId ? 'admin' : fromBoardRole;
  if (board.visibility === 'private') return fromBoardRole;
  const fromWs: BoardAccess = wsRole === 'viewer' ? 'view' : 'edit';
  if (!fromBoardRole) return fromWs;
  // A workspace viewer explicitly granted edit on the board gets edit; an explicit
  // board viewer role restricts a workspace member to view.
  return fromBoardRole;
}

export interface BoardAuth {
  board: BoardRow;
  access: BoardAccess;
  wsRole: WorkspaceRole;
}

export async function loadBoardAuth(db: D1Database, boardId: string, userId: string): Promise<BoardAuth | null> {
  const row = await db
    .prepare(
      `SELECT b.*, m.role AS ws_role, bm.role AS board_role
       FROM boards b
       JOIN workspaces w ON w.id = b.workspace_id AND w.deleted_at IS NULL
       JOIN workspace_members m ON m.workspace_id = b.workspace_id AND m.user_id = ?1
       LEFT JOIN board_members bm ON bm.board_id = b.id AND bm.user_id = ?1
       WHERE b.id = ?2`,
    )
    .bind(userId, boardId)
    .first<BoardRow & { ws_role: WorkspaceRole; board_role: 'owner' | 'editor' | 'viewer' | null }>();
  if (!row) return null;
  const access = computeBoardAccess(row, row.ws_role, row.board_role, userId);
  if (!access) return null;
  const { ws_role, board_role: _br, ...board } = row;
  return { board, access, wsRole: ws_role };
}

export async function requireBoard(db: D1Database, boardId: string, userId: string, need: BoardAccess = 'view'): Promise<BoardAuth> {
  const auth = await loadBoardAuth(db, boardId, userId);
  if (!auth) throw notFound('Board');
  if (ACCESS_RANK[auth.access] < ACCESS_RANK[need]) {
    throw new HttpError(403, need === 'view' ? 'No access to this board' : `You need ${need} access to this board`);
  }
  if (need !== 'view' && auth.board.archived_at && need !== 'admin') {
    throw new HttpError(409, 'Board is archived. Restore it before editing.');
  }
  return auth;
}

export interface ItemRow {
  id: string;
  workspace_id: string;
  board_id: string;
  group_id: string;
  parent_item_id: string | null;
  name: string;
  description: string;
  position: number;
  values_json: string;
  search_text: string;
  created_by: string;
  created_at: number;
  updated_at: number;
  completed_at: number | null;
  archived_at: number | null;
}

export async function requireItem(db: D1Database, itemId: string, userId: string, need: BoardAccess = 'view') {
  const item = await db.prepare('SELECT * FROM items WHERE id = ?').bind(itemId).first<ItemRow>();
  if (!item) throw notFound('Item');
  const auth = await loadBoardAuth(db, item.board_id, userId);
  if (!auth || auth.board.workspace_id !== item.workspace_id) throw notFound('Item');
  if (ACCESS_RANK[auth.access] < ACCESS_RANK[need]) throw new HttpError(403, `You need ${need} access to this board`);
  if (need !== 'view' && auth.board.archived_at) throw new HttpError(409, 'Board is archived. Restore it before editing.');
  return { item, ...auth };
}

/** Board ids in a workspace the user may view (used by search, dashboards, my work). */
export async function accessibleBoardIds(db: D1Database, workspaceId: string, userId: string, includeArchived = false): Promise<string[]> {
  const role = await getWorkspaceRole(db, workspaceId, userId);
  if (!role) return [];
  const rows = await db
    .prepare(
      `SELECT b.id, b.visibility, b.kind, b.created_by, bm.role AS board_role FROM boards b
       LEFT JOIN board_members bm ON bm.board_id = b.id AND bm.user_id = ?
       WHERE b.workspace_id = ? AND b.kind != 'template' ${includeArchived ? '' : 'AND b.archived_at IS NULL'}`,
    )
    .bind(userId, workspaceId)
    .all<{ id: string; visibility: 'workspace' | 'private'; kind: 'board' | 'personal' | 'template'; created_by: string; board_role: 'owner' | 'editor' | 'viewer' | null }>();
  return rows.results.filter((b) => computeBoardAccess(b, role, b.board_role, userId)).map((b) => b.id);
}

/** Documents: workspace-visible docs are readable by members; private docs require membership or authorship. */
export interface DocumentRow {
  id: string;
  workspace_id: string;
  title: string;
  content_json: string;
  search_text: string;
  board_id: string | null;
  item_id: string | null;
  visibility: 'workspace' | 'private';
  version: number;
  created_by: string;
  updated_by: string | null;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
}

export async function requireDocument(db: D1Database, docId: string, userId: string, need: 'view' | 'edit' | 'admin' = 'view') {
  const row = await db
    .prepare(
      `SELECT d.*, m.role AS ws_role, dm.role AS doc_role FROM documents d
       JOIN workspace_members m ON m.workspace_id = d.workspace_id AND m.user_id = ?1
       LEFT JOIN document_members dm ON dm.document_id = d.id AND dm.user_id = ?1
       WHERE d.id = ?2`,
    )
    .bind(userId, docId)
    .first<DocumentRow & { ws_role: WorkspaceRole; doc_role: 'editor' | 'viewer' | null }>();
  if (!row) throw notFound('Document');
  let access: BoardAccess | null;
  if (row.ws_role === 'owner' || row.ws_role === 'admin' || row.created_by === userId) access = 'admin';
  else if (row.doc_role) access = row.doc_role === 'editor' ? 'edit' : 'view';
  else if (row.visibility === 'workspace') access = row.ws_role === 'viewer' ? 'view' : 'edit';
  else access = null;
  if (!access) throw notFound('Document');
  if (ACCESS_RANK[access] < ACCESS_RANK[need]) throw new HttpError(403, `You need ${need} access to this document`);
  const { ws_role, doc_role: _d, ...doc } = row;
  return { doc, access, wsRole: ws_role };
}
