// The central permission service for projects and tasks. Every route that reads or changes a project, a task or its
// financial data asks this module; the rules themselves are in src/shared/permissions.ts. Anything a person may not
// see answers 404 (its existence is not revealed); anything they may see but not do answers 403.

import {
  CAPABILITY_COLUMNS,
  CAPABILITY_KEYS,
  isFinancialColumn,
  mergeTaskCaps,
  resolveCaps,
  taskCapsFromGrant,
  taskCapsFromProject,
  type CapabilityKey,
  type CapabilityOverrides,
  type FinanceVisibility,
  type ProjectCaps,
  type ProjectLevel,
  type TaskCaps,
  type TaskGrant,
} from '../../shared/permissions';
import type { BoardAccess, ColumnDTO, WorkspaceRole } from '../../shared/types';
import { HttpError, notFound, parseJson, placeholders } from '../lib/util';
import { computeBoardAccess, loadBoardAuth, type BoardAuth, type BoardRow, type ItemRow } from './permissions';

export function levelOf(access: BoardAccess): ProjectLevel {
  return access === 'admin' ? 'manage' : access;
}

export interface FinancePolicy {
  visibility: FinanceVisibility;
  defaultCurrency: string | null;
  enabledFields: string[];
}

export async function financePolicy(db: D1Database, workspaceId: string): Promise<FinancePolicy> {
  const row = await db.prepare('SELECT settings_json, default_currency FROM workspaces WHERE id = ?').bind(workspaceId).first<{ settings_json: string; default_currency: string | null }>();
  const fin = parseJson<{ finance?: { visibility?: FinanceVisibility; enabledFields?: string[] } }>(row?.settings_json, {}).finance ?? {};
  const visibility: FinanceVisibility = fin.visibility === 'editors' || fin.visibility === 'managers' ? fin.visibility : 'all';
  return { visibility, defaultCurrency: row?.default_currency ?? null, enabledFields: Array.isArray(fin.enabledFields) ? fin.enabledFields : ['approved_budget', 'estimated_cost', 'actual_cost', 'committed'] };
}

interface PermRow {
  denied: number;
  view_finance: number | null;
  edit_finance: number | null;
  manage_members: number | null;
  create_tasks: number | null;
  assign_tasks: number | null;
  delete_tasks: number | null;
  generate_reports: number | null;
}

export function overridesFrom(row: PermRow | null | undefined): CapabilityOverrides | null {
  if (!row) return null;
  const out: CapabilityOverrides = {};
  for (const k of CAPABILITY_KEYS) {
    const v = (row as unknown as Record<string, number | null>)[CAPABILITY_COLUMNS[k]];
    out[k] = v == null ? null : !!v;
  }
  return out;
}

export async function projectCapsFor(db: D1Database, auth: BoardAuth, userId: string, policy?: FinancePolicy): Promise<ProjectCaps> {
  const p = policy ?? (await financePolicy(db, auth.board.workspace_id));
  const row = await db.prepare('SELECT * FROM board_permissions WHERE board_id = ? AND user_id = ?').bind(auth.board.id, userId).first<PermRow>();
  return resolveCaps(levelOf(auth.access), auth.wsRole, overridesFrom(row), p.visibility);
}

export interface ProjectAuth extends BoardAuth {
  caps: ProjectCaps;
}

/** The caller's project access. `need` is a level ('view' | 'edit' | 'manage') or a capability. */
export async function requireProject(db: D1Database, boardId: string, userId: string, need: ProjectLevel | CapabilityKey = 'view'): Promise<ProjectAuth> {
  const auth = await loadBoardAuth(db, boardId, userId);
  if (!auth) throw notFound('Board');
  const caps = await projectCapsFor(db, auth, userId);
  if (need === 'view' || need === 'edit' || need === 'manage') {
    const rank = { view: 1, edit: 2, manage: 3 };
    if (rank[caps.level] < rank[need]) throw new HttpError(403, need === 'edit' ? 'You need edit access to this project' : 'You need to manage this project to do that');
    if (need !== 'view' && auth.board.archived_at && need !== 'manage') throw new HttpError(409, 'Board is archived. Restore it before editing.');
  } else if (!caps[need]) {
    throw new HttpError(403, `Your access to this project does not include: ${need.replace(/[A-Z]/g, (m) => ` ${m.toLowerCase()}`)}`);
  }
  return { ...auth, caps };
}

// ------------------------------------------------------------------ tasks

interface GrantRow {
  item_id: string;
  can_edit: number;
  can_update_status: number;
  can_comment: number;
  can_upload: number;
  can_manage_assignments: number;
  can_view_finance: number;
}

export function grantFrom(r: GrantRow): TaskGrant {
  return {
    canEdit: !!r.can_edit,
    canUpdateStatus: !!r.can_update_status,
    canComment: !!r.can_comment,
    canUpload: !!r.can_upload,
    canManageAssignments: !!r.can_manage_assignments,
    canViewFinance: !!r.can_view_finance,
  };
}

export interface TaskAuth {
  item: ItemRow;
  board: BoardRow;
  wsRole: WorkspaceRole;
  /** Null when the person sees this task only through a task grant. */
  project: ProjectAuth | null;
  caps: TaskCaps;
}

async function activeRole(db: D1Database, workspaceId: string, userId: string): Promise<WorkspaceRole | null> {
  const r = await db
    .prepare("SELECT m.role FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id WHERE m.workspace_id = ? AND m.user_id = ? AND m.status = 'active' AND w.deleted_at IS NULL")
    .bind(workspaceId, userId)
    .first<{ role: WorkspaceRole }>();
  return r?.role ?? null;
}

/** Grants on this task, or on its parent for a subitem. */
async function taskGrant(db: D1Database, item: ItemRow, userId: string): Promise<TaskGrant | null> {
  const ids = item.parent_item_id ? [item.id, item.parent_item_id] : [item.id];
  const rows = await db.prepare(`SELECT * FROM item_permissions WHERE user_id = ? AND item_id IN (${placeholders(ids.length)})`).bind(userId, ...ids).all<GrantRow>();
  if (!rows.results.length) return null;
  // Several rows (task and parent): any right on either counts.
  return rows.results.map(grantFrom).reduce((a, b) => ({
    canEdit: a.canEdit || b.canEdit,
    canUpdateStatus: a.canUpdateStatus || b.canUpdateStatus,
    canComment: a.canComment || b.canComment,
    canUpload: a.canUpload || b.canUpload,
    canManageAssignments: a.canManageAssignments || b.canManageAssignments,
    canViewFinance: a.canViewFinance || b.canViewFinance,
  }));
}

/** The caller's rights on one task, from the project, a task grant or both. 404 when they have neither. */
export async function loadTask(db: D1Database, itemId: string, userId: string): Promise<TaskAuth | null> {
  const item = await db.prepare('SELECT * FROM items WHERE id = ?').bind(itemId).first<ItemRow>();
  if (!item) return null;
  const auth = await loadBoardAuth(db, item.board_id, userId);
  let project: ProjectAuth | null = null;
  if (auth && auth.board.workspace_id === item.workspace_id) project = { ...auth, caps: await projectCapsFor(db, auth, userId) };
  let fromGrant: TaskCaps | null = null;
  let wsRole = project?.wsRole ?? null;
  let board = project?.board ?? null;
  const grant = await taskGrant(db, item, userId);
  if (grant) {
    wsRole = wsRole ?? (await activeRole(db, item.workspace_id, userId));
    if (wsRole) {
      fromGrant = taskCapsFromGrant(grant);
      board = board ?? (await db.prepare('SELECT * FROM boards WHERE id = ? AND workspace_id = ?').bind(item.board_id, item.workspace_id).first<BoardRow>());
    }
  }
  const caps = mergeTaskCaps(project ? taskCapsFromProject(project.caps) : null, fromGrant);
  if (!caps || !board || !wsRole) return null;
  return { item, board, wsRole, project, caps };
}

export type TaskCapKey = Exclude<keyof TaskCaps, 'via'>;

const TASK_CAP_TEXT: Record<TaskCapKey, string> = {
  view: 'view this task',
  edit: 'edit this task',
  updateStatus: 'update the status of this task',
  comment: 'comment on this task',
  upload: 'upload files to this task',
  manageAssignments: 'change who this task is assigned to',
  viewFinance: 'see the financial data of this task',
  editFinance: 'change the financial data of this task',
  delete: 'delete this task',
};

export async function requireTask(db: D1Database, itemId: string, userId: string, need: TaskCapKey = 'view'): Promise<TaskAuth> {
  const t = await loadTask(db, itemId, userId);
  if (!t) throw notFound('Item');
  if (!t.caps[need]) throw new HttpError(403, `You do not have permission to ${TASK_CAP_TEXT[need]}`);
  if (need !== 'view' && need !== 'comment' && t.board.archived_at) throw new HttpError(409, 'Board is archived. Restore it before editing.');
  return t;
}

/**
 * Which rights a values patch needs: each financial column needs editFinance, each person column manageAssignments,
 * each status column updateStatus (or edit), everything else edit.
 */
export function rightsForPatch(columns: ColumnDTO[], patch: { name?: string; description?: string; values?: Record<string, unknown> }): Set<TaskCapKey> {
  const need = new Set<TaskCapKey>();
  if (patch.name !== undefined || patch.description !== undefined) need.add('edit');
  for (const colId of Object.keys(patch.values ?? {})) {
    const col = columns.find((c) => c.id === colId);
    if (!col) {
      need.add('edit');
      continue;
    }
    if (isFinancialColumn(col)) need.add('editFinance');
    else if (col.type === 'person' || col.type === 'people') need.add('manageAssignments');
    else if (col.type === 'status') need.add('updateStatus');
    else need.add('edit');
  }
  return need;
}

export function assertPatchAllowed(caps: TaskCaps, need: Set<TaskCapKey>) {
  for (const n of need) {
    if (n === 'updateStatus' && (caps.updateStatus || caps.edit)) continue;
    if (!caps[n]) throw new HttpError(403, `You do not have permission to ${TASK_CAP_TEXT[n]}`);
  }
}

// ------------------------------------------------------------------ people and access

export type MemberAccess = 'manage' | 'edit' | 'view' | 'none';

/** Every active member's access to a project (for the owner picker and the access matrix). */
export async function memberAccessMap(db: D1Database, board: BoardRow): Promise<Record<string, MemberAccess>> {
  const rows = await db
    .prepare(
      `SELECT m.user_id, m.role, bm.role AS board_role, COALESCE(bp.denied, 0) AS denied FROM workspace_members m
       LEFT JOIN board_members bm ON bm.board_id = ?1 AND bm.user_id = m.user_id
       LEFT JOIN board_permissions bp ON bp.board_id = ?1 AND bp.user_id = m.user_id
       WHERE m.workspace_id = ?2 AND m.status = 'active'`,
    )
    .bind(board.id, board.workspace_id)
    .all<{ user_id: string; role: WorkspaceRole; board_role: 'owner' | 'editor' | 'viewer' | null; denied: number }>();
  const out: Record<string, MemberAccess> = {};
  for (const r of rows.results) {
    const a = computeBoardAccess(board, r.role, r.board_role, r.user_id, !!r.denied);
    out[r.user_id] = a ? levelOf(a) : 'none';
  }
  return out;
}

/** The subset of `userIds` who can see the task (through the project or a task grant), or the project when no task is given. */
export async function usersWithAccess(db: D1Database, board: BoardRow, itemId: string | null, userIds: string[]): Promise<Set<string>> {
  if (!userIds.length) return new Set();
  const access = await memberAccessMap(db, board);
  const ok = new Set(userIds.filter((u) => access[u] && access[u] !== 'none'));
  const rest = userIds.filter((u) => !ok.has(u) && access[u]);
  if (itemId && rest.length) {
    const item = await db.prepare('SELECT parent_item_id FROM items WHERE id = ?').bind(itemId).first<{ parent_item_id: string | null }>();
    const ids = item?.parent_item_id ? [itemId, item.parent_item_id] : [itemId];
    const g = await db
      .prepare(`SELECT DISTINCT user_id FROM item_permissions WHERE item_id IN (${placeholders(ids.length)}) AND user_id IN (${placeholders(rest.length)})`)
      .bind(...ids, ...rest)
      .all<{ user_id: string }>();
    for (const r of g.results) ok.add(r.user_id);
  }
  return ok;
}

// ------------------------------------------------------------------ financial data

export function financialColumnIds(columns: { id: string; type: string; settings?: Record<string, unknown> | null }[]): Set<string> {
  return new Set(columns.filter(isFinancialColumn).map((c) => c.id));
}

export function stripValues<T extends { values: Record<string, unknown> }>(item: T, hidden: Set<string>): T {
  if (!hidden.size) return item;
  const values: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(item.values)) if (!hidden.has(k)) values[k] = v;
  return { ...item, values };
}

/** Board ids (of those given) on which the caller may not see financial data. Empty for administrators. */
export async function financeHiddenBoards(db: D1Database, workspaceId: string, userId: string, boardIds: string[]): Promise<Set<string>> {
  if (!boardIds.length) return new Set();
  const role = await activeRole(db, workspaceId, userId);
  if (!role || role === 'owner' || role === 'admin') return new Set();
  const policy = await financePolicy(db, workspaceId);
  const rows = await db
    .prepare(
      `SELECT b.id, b.visibility, b.kind, b.created_by, bm.role AS board_role, bp.denied, bp.view_finance, bp.edit_finance, bp.manage_members, bp.create_tasks,
              bp.assign_tasks, bp.delete_tasks, bp.generate_reports
       FROM boards b LEFT JOIN board_members bm ON bm.board_id = b.id AND bm.user_id = ?1
       LEFT JOIN board_permissions bp ON bp.board_id = b.id AND bp.user_id = ?1
       WHERE b.workspace_id = ?2 AND b.id IN (${boardIds.map((_, i) => `?${i + 3}`).join(',')})`,
    )
    .bind(userId, workspaceId, ...boardIds)
    .all<BoardRow & PermRow & { board_role: 'owner' | 'editor' | 'viewer' | null }>();
  const hidden = new Set<string>();
  for (const r of rows.results) {
    const a = computeBoardAccess(r, role, r.board_role, userId, !!r.denied);
    if (!a) {
      hidden.add(r.id);
      continue;
    }
    const caps = resolveCaps(levelOf(a), role, r.denied == null ? null : overridesFrom(r), policy.visibility);
    if (!caps.viewFinance) hidden.add(r.id);
  }
  return hidden;
}

/** Remove financial columns and values from a list of items for the boards where they are hidden. */
export async function hideFinanceInItems<T extends { boardId: string; values: Record<string, unknown> }>(db: D1Database, workspaceId: string, userId: string, items: T[]): Promise<T[]> {
  const boardIds = Array.from(new Set(items.map((i) => i.boardId)));
  const hiddenBoards = await financeHiddenBoards(db, workspaceId, userId, boardIds);
  if (!hiddenBoards.size) return items;
  const cols = await db
    .prepare(`SELECT id, board_id, type, settings_json FROM columns WHERE board_id IN (${placeholders(hiddenBoards.size)}) AND type IN ('currency','number')`)
    .bind(...hiddenBoards)
    .all<{ id: string; board_id: string; type: string; settings_json: string }>();
  const hidden = financialColumnIds(cols.results.map((c) => ({ id: c.id, type: c.type, settings: parseJson(c.settings_json, {}) })));
  return items.map((i) => (hiddenBoards.has(i.boardId) ? stripValues(i, hidden) : i));
}
