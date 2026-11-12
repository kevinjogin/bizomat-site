import type { UserDTO, WorkspaceDTO, WorkspaceRole } from '../../shared/types';
import { newId, now, parseJson } from '../lib/util';
import { avatarUrl } from '../services/mappers';
import { defaultStatusLabels, defaultPriorityLabels } from '../../shared/columns';
import { eventStmt } from '../services/analytics';
import { DEFAULT_COLOR } from '../../shared/brand';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  avatar_key: string | null;
  timezone: string;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  preferences_json: string;
  failed_logins: number;
  locked_until: number | null;
  disabled_at: number | null;
  created_at: number;
  updated_at: number;
  password_reset_required?: number;
}

export function userDTO(u: UserRow): UserDTO {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatarUrl: avatarUrl(u.id, u.avatar_key),
    timezone: u.timezone,
    locale: u.locale,
    theme: u.theme,
    preferences: parseJson(u.preferences_json, {}),
    passwordResetRequired: !!u.password_reset_required,
  };
}

export async function listWorkspaces(db: D1Database, userId: string): Promise<WorkspaceDTO[]> {
  const rows = await db
    .prepare(
      `SELECT w.id, w.name, w.description, w.color, w.logo_key, w.created_at, m.role FROM workspaces w
       JOIN workspace_members m ON m.workspace_id = w.id
       WHERE m.user_id = ? AND w.deleted_at IS NULL AND m.status = 'active' ORDER BY w.created_at`,
    )
    .bind(userId)
    .all<{ id: string; name: string; description: string; color: string; logo_key: string | null; created_at: number; role: WorkspaceRole }>();
  return rows.results.map((w) => ({
    id: w.id,
    name: w.name,
    description: w.description,
    color: w.color,
    logoUrl: w.logo_key ? `/api/workspaces/${w.id}/logo?v=${w.logo_key.slice(-8)}` : null,
    role: w.role,
    createdAt: w.created_at,
  }));
}

/** Statements that create a workspace with its owner. */
export function createWorkspaceStmts(db: D1Database, opts: { id?: string; name: string; description?: string; color?: string; ownerId: string }) {
  const id = opts.id ?? newId();
  const t = now();
  return {
    id,
    stmts: [
      db
        .prepare('INSERT INTO workspaces (id, name, description, color, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(id, opts.name, opts.description ?? '', opts.color ?? DEFAULT_COLOR, opts.ownerId, t, t),
      db.prepare("INSERT INTO workspace_members (workspace_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?)").bind(id, opts.ownerId, t),
      eventStmt(db, { type: 'workspace.created', userId: opts.ownerId, workspaceId: id, entityType: 'workspace', entityId: id, at: t }),
    ],
  };
}

export { defaultStatusLabels, defaultPriorityLabels };
