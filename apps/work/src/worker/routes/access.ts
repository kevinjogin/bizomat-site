// Project access (the permission matrix), task access (one task without its project), the owner picker and the
// standalone task page. Every rule is checked here and in services/access.ts, never only in the interface.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, notFound, now, parseJson } from '../lib/util';
import { auditEventStmt, auditStmt } from '../services/audit';
import { avatarUrl, columnDTO, groupDTO, itemDTO, type ColumnRow, type GroupRow } from '../services/mappers';
import {
  financePolicy,
  financialColumnIds,
  grantFrom,
  levelOf,
  memberAccessMap,
  overridesFrom,
  requireProject,
  requireTask,
  stripValues,
} from '../services/access';
import { computeBoardAccess, type ItemRow } from '../services/permissions';
import { CAPABILITY_KEYS, resolveCaps } from '../../shared/permissions';
import { isSupportedCurrency } from '../../shared/money';
import { resolveColumnCurrency } from '../../shared/finance';
import type { BoardBundle, WorkspaceRole } from '../../shared/types';
import { setProjectLevel } from './boards';
import { svcFromContext } from '../services/context';
import { notify, taskLink } from '../services/notify';
import { broadcast } from '../realtime/board-room';

export const accessRoutes = new Hono<AppEnv>();

// ------------------------------------------------------------------ project access matrix

accessRoutes.get('/boards/:id/access', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manageMembers');
  const db = c.env.DB;
  const policy = await financePolicy(db, p.board.workspace_id);
  const rows = await db
    .prepare(
      `SELECT u.id, u.email, u.name, u.avatar_key, m.role, bm.role AS board_role, bp.denied, bp.view_finance, bp.edit_finance, bp.manage_members,
              bp.create_tasks, bp.assign_tasks, bp.delete_tasks, bp.generate_reports
       FROM workspace_members m JOIN users u ON u.id = m.user_id
       LEFT JOIN board_members bm ON bm.board_id = ?1 AND bm.user_id = m.user_id
       LEFT JOIN board_permissions bp ON bp.board_id = ?1 AND bp.user_id = m.user_id
       WHERE m.workspace_id = ?2 AND m.status = 'active' ORDER BY u.name`,
    )
    .bind(p.board.id, p.board.workspace_id)
    .all<any>();
  const grants = await db
    .prepare('SELECT ip.user_id, ip.item_id, i.name FROM item_permissions ip JOIN items i ON i.id = ip.item_id WHERE ip.board_id = ?')
    .bind(p.board.id)
    .all<{ user_id: string; item_id: string; name: string }>();
  return c.json({
    board: { id: p.board.id, name: p.board.name, visibility: p.board.visibility },
    myCaps: p.caps,
    financeVisibility: policy.visibility,
    people: rows.results.map((r) => {
      const access = computeBoardAccess(p.board, r.role as WorkspaceRole, r.board_role, r.id, !!r.denied);
      const overrides = overridesFrom(r.denied == null ? null : r);
      const caps = access ? resolveCaps(levelOf(access), r.role, overrides, policy.visibility) : null;
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        avatarUrl: avatarUrl(r.id, r.avatar_key),
        orgRole: r.role,
        // 'default' = from the organisation role and the project's visibility
        setting: r.denied ? 'none' : r.board_role ? (r.board_role === 'owner' ? 'manage' : r.board_role === 'editor' ? 'edit' : 'view') : 'default',
        level: access ? levelOf(access) : 'none',
        locked: r.role === 'owner' || r.role === 'admin',
        overrides: overrides ?? Object.fromEntries(CAPABILITY_KEYS.map((k) => [k, null])),
        caps,
        tasks: grants.results.filter((g) => g.user_id === r.id).map((g) => ({ id: g.item_id, name: g.name })),
      };
    }),
  });
});

const levelSchema = z.enum(['default', 'none', 'view', 'edit', 'manage']);
const overridesSchema = z.object(Object.fromEntries(CAPABILITY_KEYS.map((k) => [k, z.boolean().nullable().optional()])) as Record<(typeof CAPABILITY_KEYS)[number], z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>);

accessRoutes.put('/boards/:id/access/:userId', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manageMembers');
  const input = await body(c, z.object({ level: levelSchema, overrides: overridesSchema.optional() }));
  await setProjectLevel(c, p, c.req.param('userId'), input.level, input.overrides as Record<string, boolean | null> | undefined);
  return c.json({ ok: true });
});

/** Project details used by finance and reports: its currency, start date and project manager. */
accessRoutes.patch('/boards/:id/project', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manage');
  const input = await body(
    c,
    z.object({
      currency: z.string().nullable().optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
      managerId: z.string().max(64).nullable().optional(),
    }),
  );
  if (input.currency != null && !isSupportedCurrency(input.currency)) throw badRequest('Choose one of the supported currencies');
  if (input.currency !== undefined && !p.caps.editFinance) throw new HttpError(403, 'Changing the project currency needs permission to edit financial data');
  if (input.managerId) {
    const access = await memberAccessMap(c.env.DB, p.board);
    if (!access[input.managerId] || access[input.managerId] === 'none') throw badRequest('The project manager must have access to the project');
  }
  const b = p.board;
  const next = {
    currency: input.currency !== undefined ? input.currency : b.currency ?? null,
    startDate: input.startDate !== undefined ? input.startDate : b.start_date ?? null,
    managerId: input.managerId !== undefined ? input.managerId : b.manager_id ?? null,
  };
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE boards SET currency = ?, start_date = ?, manager_id = ?, updated_at = ? WHERE id = ?').bind(next.currency, next.startDate, next.managerId, now(), b.id),
    auditStmt(c.env.DB, { workspaceId: b.workspace_id, actorId: user.id, action: 'project.updated', targetType: 'board', targetId: b.id, metadata: input, ip: clientIp(c) }),
    auditEventStmt(c.env.DB, { workspaceId: b.workspace_id, boardId: b.id, actorId: user.id, type: input.currency !== undefined ? 'project.currency_changed' : 'project.modified', before: { currency: b.currency ?? null, startDate: b.start_date ?? null, managerId: b.manager_id ?? null }, after: next }),
  ]);
  c.executionCtx.waitUntil(broadcast(c.env, b.id, { kind: 'board_updated', actorId: user.id }));
  return c.json({ ok: true, ...next });
});

// ------------------------------------------------------------------ task access

/** Who may share a task: people who manage the project's members or allocate its tasks. */
async function requireTaskSharer(c: any) {
  const t = await requireTask(c.env.DB, c.req.param('id'), c.get('user').id, 'view');
  if (!t.project || !(t.project.caps.manageMembers || t.project.caps.assignTasks)) throw new HttpError(403, 'You cannot manage who can access this task');
  return t;
}

accessRoutes.get('/items/:id/access', async (c) => {
  const t = await requireTaskSharer(c);
  const rows = await c.env.DB.prepare(
    `SELECT ip.*, u.name, u.email, u.avatar_key, m.role FROM item_permissions ip JOIN users u ON u.id = ip.user_id
     JOIN workspace_members m ON m.workspace_id = ip.workspace_id AND m.user_id = ip.user_id WHERE ip.item_id = ? ORDER BY u.name`,
  )
    .bind(t.item.id)
    .all<any>();
  return c.json(rows.results.map((r) => ({ userId: r.user_id, name: r.name, email: r.email, avatarUrl: avatarUrl(r.user_id, r.avatar_key), orgRole: r.role, grant: grantFrom(r), createdAt: r.created_at })));
});

const grantSchema = z.object({
  canEdit: z.boolean().default(false),
  canUpdateStatus: z.boolean().default(true),
  canComment: z.boolean().default(true),
  canUpload: z.boolean().default(false),
  canManageAssignments: z.boolean().default(false),
  canViewFinance: z.boolean().default(false),
});

accessRoutes.put('/items/:id/access/:userId', async (c) => {
  const user = c.get('user');
  const t = await requireTaskSharer(c);
  const targetId = c.req.param('userId');
  const g = await body(c, grantSchema);
  if (targetId === user.id) throw new HttpError(403, 'You cannot change your own access');
  if (g.canViewFinance && !t.caps.viewFinance) throw new HttpError(403, 'You cannot share financial data you cannot see');
  if (g.canManageAssignments && !t.caps.manageAssignments) throw new HttpError(403, 'You cannot give a permission you do not have');
  const member = await c.env.DB.prepare("SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ? AND status = 'active'").bind(t.board.workspace_id, targetId).first<{ role: string }>();
  if (!member) throw badRequest('Invite this person to the organisation first');
  const existing = await c.env.DB.prepare('SELECT * FROM item_permissions WHERE item_id = ? AND user_id = ?').bind(t.item.id, targetId).first<any>();
  const tm = now();
  await c.env.DB.batch([
    c.env.DB
      .prepare(
        `INSERT INTO item_permissions (item_id, board_id, workspace_id, user_id, can_edit, can_update_status, can_comment, can_upload, can_manage_assignments, can_view_finance, granted_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(item_id, user_id) DO UPDATE SET can_edit = excluded.can_edit, can_update_status = excluded.can_update_status, can_comment = excluded.can_comment,
           can_upload = excluded.can_upload, can_manage_assignments = excluded.can_manage_assignments, can_view_finance = excluded.can_view_finance,
           granted_by = excluded.granted_by, updated_at = excluded.updated_at`,
      )
      .bind(t.item.id, t.board.id, t.board.workspace_id, targetId, +g.canEdit, +g.canUpdateStatus, +g.canComment, +g.canUpload, +g.canManageAssignments, +g.canViewFinance, user.id, tm, tm),
    auditEventStmt(c.env.DB, { workspaceId: t.board.workspace_id, boardId: t.board.id, itemId: t.item.id, actorId: user.id, type: 'permission.changed', before: existing ? grantFrom(existing) : null, after: g, metadata: { userId: targetId, scope: 'task' } }),
  ]);
  if (!existing) {
    const ws = await c.env.DB.prepare('SELECT name FROM workspaces WHERE id = ?').bind(t.board.workspace_id).first<{ name: string }>();
    await notify(svcFromContext(c), {
      workspaceId: t.board.workspace_id,
      userIds: [targetId],
      type: 'project_membership',
      title: `${user.name} shared the task "${t.item.name}" with you`,
      body: t.board.name,
      link: taskLink(t.board.workspace_id, t.item.id),
      entityType: 'item',
      entityId: t.item.id,
      email: { template: 'permission_change', organisation: ws?.name ?? '', project: t.board.name, change: `You can now open the task "${t.item.name}".`, by: user.name, url: taskLink(t.board.workspace_id, t.item.id) },
    });
  }
  return c.json({ ok: true });
});

accessRoutes.delete('/items/:id/access/:userId', async (c) => {
  const user = c.get('user');
  const t = await requireTaskSharer(c);
  const targetId = c.req.param('userId');
  const r = await c.env.DB.prepare('DELETE FROM item_permissions WHERE item_id = ? AND user_id = ?').bind(t.item.id, targetId).run();
  if (!r.meta.changes) throw notFound('Access');
  await auditEventStmt(c.env.DB, { workspaceId: t.board.workspace_id, boardId: t.board.id, itemId: t.item.id, actorId: user.id, type: 'permission.revoked', metadata: { userId: targetId, scope: 'task' } }).run();
  return c.json({ ok: true });
});

/**
 * The owner picker: every active member with their access to this task ('manage' | 'edit' | 'view' from the project,
 * 'task' from a task grant, 'none'). Only people with access can be assigned.
 */
accessRoutes.get('/items/:id/assignable', async (c) => {
  const t = await requireTask(c.env.DB, c.req.param('id'), c.get('user').id, 'view');
  const db = c.env.DB;
  const [access, members, grants] = await Promise.all([
    memberAccessMap(db, t.board),
    db
      .prepare("SELECT u.id, u.email, u.name, u.avatar_key, m.role FROM workspace_members m JOIN users u ON u.id = m.user_id WHERE m.workspace_id = ? AND m.status = 'active' ORDER BY u.name")
      .bind(t.board.workspace_id)
      .all<{ id: string; email: string; name: string; avatar_key: string | null; role: string }>(),
    db
      .prepare(`SELECT DISTINCT user_id FROM item_permissions WHERE item_id IN (?, ?)`)
      .bind(t.item.id, t.item.parent_item_id ?? t.item.id)
      .all<{ user_id: string }>(),
  ]);
  const granted = new Set(grants.results.map((g) => g.user_id));
  const canManage = !!t.project && (t.project.caps.manageMembers || t.project.caps.assignTasks);
  // People without project access see only those who share this task with them.
  const people = members.results.filter((m) => t.project || granted.has(m.id) || (access[m.id] && access[m.id] !== 'none'));
  return c.json({
    canShare: canManage,
    people: people.map((m) => ({
      id: m.id,
      name: m.name,
      email: t.project && t.wsRole !== 'guest' ? m.email : null,
      avatarUrl: avatarUrl(m.id, m.avatar_key),
      orgRole: m.role,
      access: access[m.id] && access[m.id] !== 'none' ? access[m.id] : granted.has(m.id) ? 'task' : 'none',
    })),
  });
});

/**
 * Everything the standalone task page needs, in the board bundle's shape, for people who may see this task but not
 * its project. Project members get `projectAccess: true` and are sent to the board instead.
 */
accessRoutes.get('/items/:id/context', async (c) => {
  const user = c.get('user');
  const t = await requireTask(c.env.DB, c.req.param('id'), user.id, 'view');
  const db = c.env.DB;
  const root = t.item.parent_item_id ? await db.prepare('SELECT * FROM items WHERE id = ?').bind(t.item.parent_item_id).first<ItemRow>() : t.item;
  const policy = await financePolicy(db, t.board.workspace_id);
  const [cols, group, subs] = await Promise.all([
    db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').bind(t.board.id).all<ColumnRow>(),
    db.prepare('SELECT * FROM groups WHERE id = ?').bind(root!.group_id).first<GroupRow>(),
    db.prepare('SELECT * FROM items WHERE parent_item_id = ? AND archived_at IS NULL ORDER BY position').bind(root!.id).all<ItemRow>(),
  ]);
  const all = cols.results.map(columnDTO);
  const hidden = t.caps.viewFinance ? new Set<string>() : financialColumnIds(all);
  const columns = all
    .filter((col) => !hidden.has(col.id))
    .map((col) => (col.type === 'currency' ? { ...col, settings: { ...col.settings, currency: resolveColumnCurrency(col.settings, t.board.currency ?? null, policy.defaultCurrency).currency ?? undefined } } : col));
  const assignable = await db
    .prepare(
      `SELECT DISTINCT u.id, u.email, u.name, u.avatar_key, m.role FROM users u JOIN workspace_members m ON m.user_id = u.id AND m.workspace_id = ?1 AND m.status = 'active'
       WHERE u.id = ?2 OR u.id IN (SELECT user_id FROM item_permissions WHERE item_id = ?3) OR m.role IN ('owner','admin')`,
    )
    .bind(t.board.workspace_id, user.id, root!.id)
    .all<{ id: string; email: string; name: string; avatar_key: string | null; role: WorkspaceRole }>();
  const access = t.project ? t.project.access : t.caps.edit ? 'edit' : 'view';
  const bundle: BoardBundle & { projectAccess: boolean; taskCaps: typeof t.caps } = {
    projectAccess: !!t.project,
    taskCaps: t.caps,
    board: { id: t.board.id, workspaceId: t.board.workspace_id, name: t.board.name, description: '', kind: t.board.kind, visibility: t.board.visibility, icon: t.board.icon, settings: parseJson(t.board.settings_json, {}), position: 0, createdBy: t.board.created_by, createdAt: t.board.created_at, updatedAt: t.board.updated_at, archivedAt: t.board.archived_at, folderId: null, access },
    // Like the project's own description, the group's is project information: not shown to people who see only a task.
    groups: group ? [{ ...groupDTO(group), description: '' }] : [],
    columns,
    items: [root!, ...subs.results].map((i) => stripValues(itemDTO(i), hidden)),
    views: [],
    members: assignable.results.map((m) => ({ id: m.id, email: m.email, name: m.name, avatarUrl: avatarUrl(m.id, m.avatar_key), role: m.role })),
    boardMembers: [],
  };
  return c.json(bundle);
});

/** Tasks shared with me one by one (not through a project), for My Work. */
accessRoutes.get('/workspaces/:ws/shared-tasks', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const rows = await c.env.DB.prepare(
    `SELECT i.id, i.name, i.board_id, i.completed_at, b.name AS board_name, ip.created_at AS shared_at, g.name AS granted_by_name FROM item_permissions ip
     JOIN items i ON i.id = ip.item_id AND i.archived_at IS NULL JOIN boards b ON b.id = i.board_id
     JOIN workspace_members m ON m.workspace_id = ip.workspace_id AND m.user_id = ip.user_id AND m.status = 'active'
     LEFT JOIN users g ON g.id = ip.granted_by
     WHERE ip.workspace_id = ? AND ip.user_id = ? ORDER BY ip.created_at DESC LIMIT 200`,
  )
    .bind(wsId, user.id)
    .all<any>();
  return c.json(rows.results.map((r) => ({ id: r.id, name: r.name, boardId: r.board_id, boardName: r.board_name, done: !!r.completed_at, sharedAt: r.shared_at, sharedBy: r.granted_by_name })));
});

