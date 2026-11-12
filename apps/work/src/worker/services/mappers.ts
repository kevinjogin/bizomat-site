import type { BoardDTO, ColumnDTO, GroupDTO, ItemDTO, ViewDTO, WorkspaceRole } from '../../shared/types';
import { parseJson } from '../lib/util';
import type { BoardRow, ItemRow } from './permissions';

export interface GroupRow {
  id: string;
  workspace_id: string;
  board_id: string;
  name: string;
  color: string;
  position: number;
  collapsed: number;
  archived_at: number | null;
  created_at: number;
}

export interface ColumnRow {
  id: string;
  workspace_id: string;
  board_id: string;
  title: string;
  type: string;
  settings_json: string;
  position: number;
  width: number;
  hidden: number;
  required: number;
  description: string;
  created_at: number;
}

export interface ViewRow {
  id: string;
  workspace_id: string;
  board_id: string;
  name: string;
  type: string;
  settings_json: string;
  position: number;
  owner_id: string | null;
  created_by: string;
  created_at: number;
  updated_at: number;
}

export const boardDTO = (b: BoardRow): BoardDTO => ({
  id: b.id,
  workspaceId: b.workspace_id,
  name: b.name,
  description: b.description,
  kind: b.kind,
  visibility: b.visibility,
  icon: b.icon,
  settings: parseJson(b.settings_json, {}),
  position: b.position,
  createdBy: b.created_by,
  createdAt: b.created_at,
  updatedAt: b.updated_at,
  archivedAt: b.archived_at,
  folderId: b.folder_id ?? null,
  currency: b.currency ?? null,
  startDate: b.start_date ?? null,
  managerId: b.manager_id ?? null,
});

export const groupDTO = (g: GroupRow): GroupDTO => ({
  id: g.id,
  boardId: g.board_id,
  name: g.name,
  color: g.color,
  position: g.position,
  collapsed: !!g.collapsed,
  archivedAt: g.archived_at,
});

export const columnDTO = (c: ColumnRow): ColumnDTO => ({
  id: c.id,
  boardId: c.board_id,
  title: c.title,
  type: c.type,
  settings: parseJson(c.settings_json, {}),
  position: c.position,
  width: c.width,
  hidden: !!c.hidden,
  required: !!c.required,
  description: c.description,
});

export const itemDTO = (i: ItemRow): ItemDTO => ({
  id: i.id,
  boardId: i.board_id,
  groupId: i.group_id,
  parentItemId: i.parent_item_id,
  name: i.name,
  description: i.description,
  position: i.position,
  values: parseJson(i.values_json, {}),
  createdBy: i.created_by,
  createdAt: i.created_at,
  updatedAt: i.updated_at,
  completedAt: i.completed_at,
  archivedAt: i.archived_at,
});

export const viewDTO = (v: ViewRow): ViewDTO => ({
  id: v.id,
  boardId: v.board_id,
  name: v.name,
  type: v.type as ViewDTO['type'],
  settings: parseJson(v.settings_json, {}),
  position: v.position,
  ownerId: v.owner_id,
});

export function avatarUrl(userId: string, avatarKey: string | null): string | null {
  return avatarKey ? `/api/users/${userId}/avatar?v=${encodeURIComponent(avatarKey.slice(-8))}` : null;
}

export async function loadColumns(db: D1Database, boardId: string): Promise<ColumnDTO[]> {
  const rows = await db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').bind(boardId).all<ColumnRow>();
  return rows.results.map(columnDTO);
}

/** Active members (suspended ones only when asked, for the members page). */
export async function workspaceMembers(db: D1Database, workspaceId: string, opts: { includeSuspended?: boolean } = {}) {
  const rows = await db
    .prepare(
      `SELECT u.id, u.email, u.name, u.avatar_key, m.role, m.status FROM workspace_members m JOIN users u ON u.id = m.user_id
       WHERE m.workspace_id = ? ${opts.includeSuspended ? '' : "AND m.status = 'active'"} ORDER BY u.name`,
    )
    .bind(workspaceId)
    .all<{ id: string; email: string; name: string; avatar_key: string | null; role: WorkspaceRole; status: 'active' | 'suspended' }>();
  return rows.results.map((r) => ({ id: r.id, email: r.email, name: r.name, avatarUrl: avatarUrl(r.id, r.avatar_key), role: r.role, status: r.status }));
}
