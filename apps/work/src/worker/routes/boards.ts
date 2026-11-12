import { Hono, type Context } from 'hono';
import { ensureTaskKeys } from '../services/schedule/task-keys';
import { z } from 'zod';
import { canConvert, convertValue, getColumnType, isColumnType, PALETTE, sanitizeColumnSettings } from '../../shared/columns';
import { checkFormula } from '../../shared/formula';
import { positionBetween } from '../../shared/items';
import { sanitizeFilter } from '../../shared/filters';
import type { BoardBundle, ViewType, WorkspaceRole } from '../../shared/types';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, newId, notFound, now, parseJson } from '../lib/util';
import { broadcast } from '../realtime/board-room';
import { activityStmt, auditEventStmt, auditStmt } from '../services/audit';
import { BLANK_TEMPLATE, builtinTemplates, cloneBoard, instantiateTemplate } from '../services/boards';
import { boardDTO, columnDTO, groupDTO, itemDTO, viewDTO, workspaceMembers, type ColumnRow, type GroupRow, type ViewRow } from '../services/mappers';
import { computeBoardAccess, requireBoard, requireWorkspace, type BoardRow, type ItemRow } from '../services/permissions';
import { buildSearchText } from '../services/item-ops';
import { assertFolder } from './folders';
import { eventStmt } from '../services/analytics';
import { financePolicy, financialColumnIds, memberAccessMap, requireProject, stripValues } from '../services/access';
import { resolveColumnCurrency } from '../../shared/finance';
import { GROUP_DESCRIPTION_MAX, normalizeGroupDescription } from '../../shared/group-description';

export const boardRoutes = new Hono<AppEnv>();

const VIEW_TYPES: ViewType[] = ['table', 'kanban', 'calendar', 'timeline', 'chart', 'workload', 'form', 'map', 'files'];
const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

function rt(c: Context<AppEnv, any, any>, boardId: string, kind: string, extra: Record<string, unknown> = {}) {
  c.executionCtx.waitUntil(broadcast(c.env, boardId, { kind, actorId: c.get('user').id, ...extra }));
}

// ------------------------------------------------------------------- boards

boardRoutes.get('/workspaces/:ws/boards', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const role = await requireWorkspace(c.env.DB, wsId, user.id);
  const archived = c.req.query('archived') === '1';
  const kind = c.req.query('kind');
  const rows = await c.env.DB.prepare(
    `SELECT b.*, bm.role AS board_role, COALESCE(bp.denied, 0) AS bp_denied,
       (SELECT COUNT(*) FROM items i WHERE i.board_id = b.id AND i.archived_at IS NULL AND i.parent_item_id IS NULL) AS item_count
     FROM boards b LEFT JOIN board_members bm ON bm.board_id = b.id AND bm.user_id = ?1
     LEFT JOIN board_permissions bp ON bp.board_id = b.id AND bp.user_id = ?1
     WHERE b.workspace_id = ?2 AND ${archived ? 'b.archived_at IS NOT NULL' : 'b.archived_at IS NULL'} ${kind ? 'AND b.kind = ?3' : "AND b.kind != 'template'"}
     ORDER BY b.position, b.created_at`,
  )
    .bind(user.id, wsId, ...(kind ? [kind] : []))
    .all<BoardRow & { board_role: 'owner' | 'editor' | 'viewer' | null; item_count: number; bp_denied: number }>();
  const out = rows.results
    .map((b) => ({ b, access: computeBoardAccess(b, role, b.board_role, user.id, !!b.bp_denied) }))
    .filter((x) => x.access)
    .map(({ b, access }) => ({ ...boardDTO(b), access: access!, itemCount: b.item_count }));
  return c.json(out);
});

boardRoutes.post('/workspaces/:ws/boards', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const input = await body(
    c,
    z.object({
      name: z.string().trim().min(1).max(200),
      visibility: z.enum(['workspace', 'private']).default('workspace'),
      kind: z.enum(['board', 'personal']).default('board'),
      templateId: z.string().max(64).optional(),
      withSampleItems: z.boolean().default(true),
      folderId: z.string().nullable().optional(),
    }),
  );
  await requireWorkspace(c.env.DB, wsId, user.id, input.kind === 'personal' ? 'viewer' : 'member');
  let boardId: string;
  if (input.templateId) {
    const builtin = builtinTemplates().find((t) => t.id === input.templateId);
    if (builtin) {
      boardId = await instantiateTemplate(c.env.DB, builtin, { workspaceId: wsId, name: input.name, createdBy: user.id, kind: input.kind, visibility: input.kind === 'personal' ? 'private' : input.visibility, withItems: input.withSampleItems });
    } else {
      const tpl = await c.env.DB.prepare("SELECT id FROM boards WHERE id = ? AND workspace_id = ? AND kind = 'template'").bind(input.templateId, wsId).first<{ id: string }>();
      if (!tpl) throw notFound('Template');
      boardId = await cloneBoard(c.env.DB, tpl.id, { name: input.name, createdBy: user.id, kind: input.kind, withItems: input.withSampleItems, withAutomations: true });
      if (input.kind === 'personal' || input.visibility === 'private') await c.env.DB.prepare("UPDATE boards SET visibility = 'private' WHERE id = ?").bind(boardId).run();
    }
  } else {
    boardId = await instantiateTemplate(c.env.DB, { ...BLANK_TEMPLATE, description: '' }, { workspaceId: wsId, name: input.name, createdBy: user.id, kind: input.kind, visibility: input.kind === 'personal' ? 'private' : input.visibility });
  }
  if (input.folderId) {
    await assertFolder(c.env.DB, wsId, 'boards', input.folderId);
    await c.env.DB.prepare('UPDATE boards SET folder_id = ? WHERE id = ?').bind(input.folderId, boardId).run();
  }
  await c.env.DB.batch([
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'board.created', targetType: 'board', targetId: boardId, ip: clientIp(c) }),
    eventStmt(c.env.DB, { type: 'project.created', userId: user.id, workspaceId: wsId, boardId, entityType: 'board', entityId: boardId, metadata: { template: input.templateId ?? 'blank', kind: input.kind } }),
  ]);
  const row = await c.env.DB.prepare('SELECT * FROM boards WHERE id = ?').bind(boardId).first<BoardRow>();
  return c.json({ ...boardDTO(row!), access: 'admin' }, 201);
});

boardRoutes.get('/boards/:id', async (c) => {
  const user = c.get('user');
  const { board, access, caps, wsRole } = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  const db = c.env.DB;
  const policy = await financePolicy(db, board.workspace_id);
  // Tasks from before keys existed, and copies of boards and templates, get their permanent keys here.
  await ensureTaskKeys(db, board);
  const [groups, columns, items, views, members, boardMembers, counts, memberAccess] = await Promise.all([
    db.prepare('SELECT * FROM groups WHERE board_id = ? AND archived_at IS NULL ORDER BY position').bind(board.id).all<GroupRow>(),
    db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').bind(board.id).all<ColumnRow>(),
    db.prepare(`SELECT * FROM items WHERE board_id = ? AND ${c.req.query('archived') === '1' ? 'archived_at IS NOT NULL' : 'archived_at IS NULL'} ORDER BY position`).bind(board.id).all<ItemRow>(),
    db.prepare('SELECT * FROM views WHERE board_id = ? AND (owner_id IS NULL OR owner_id = ?) ORDER BY position').bind(board.id, user.id).all<ViewRow>(),
    workspaceMembers(db, board.workspace_id),
    db.prepare('SELECT user_id, role FROM board_members WHERE board_id = ?').bind(board.id).all<{ user_id: string; role: 'owner' | 'editor' | 'viewer' }>(),
    db.prepare('SELECT item_id, COUNT(*) AS n FROM updates WHERE board_id = ? AND deleted_at IS NULL GROUP BY item_id').bind(board.id).all<{ item_id: string; n: number }>(),
    memberAccessMap(db, board),
  ]);
  const updateCounts = new Map(counts.results.map((r) => [r.item_id, r.n]));
  const subCounts = new Map<string, number>();
  for (const i of items.results) if (i.parent_item_id) subCounts.set(i.parent_item_id, (subCounts.get(i.parent_item_id) ?? 0) + 1);
  // Financial columns are left out entirely for people without finance access (values and the columns themselves).
  const allColumns = columns.results.map(columnDTO);
  const hidden = caps.viewFinance ? new Set<string>() : financialColumnIds(allColumns);
  const visibleColumns = allColumns
    .filter((col) => !hidden.has(col.id))
    .map((col) => {
      if (col.type !== 'currency') return col;
      const r = resolveColumnCurrency(col.settings, board.currency ?? null, policy.defaultCurrency);
      return { ...col, settings: { ...col.settings, currency: r.currency ?? undefined, currencySource: r.source } };
    });
  // Guests see the people on this project, not the whole organisation.
  const people = wsRole === 'guest' ? members.filter((m) => memberAccess[m.id] && memberAccess[m.id] !== 'none') : members;
  const bundle: BoardBundle = {
    board: { ...boardDTO(board), access, caps },
    groups: groups.results.map(groupDTO),
    columns: visibleColumns,
    items: items.results.map((i) => stripValues({ ...itemDTO(i), subitemCount: subCounts.get(i.id) ?? 0, updateCount: updateCounts.get(i.id) ?? 0 }, hidden)),
    views: views.results.map(viewDTO),
    members: people,
    boardMembers: boardMembers.results.map((m) => ({ userId: m.user_id, role: m.role })),
    memberAccess: Object.fromEntries(people.map((m) => [m.id, memberAccess[m.id] ?? 'none'])),
    finance: { workspaceCurrency: policy.defaultCurrency, boardCurrency: board.currency ?? null, effectiveCurrency: board.currency ?? policy.defaultCurrency, hiddenColumns: hidden.size },
  };
  c.executionCtx.waitUntil(
    db.prepare("INSERT INTO recents (user_id, workspace_id, entity_type, entity_id, visited_at) VALUES (?, ?, 'board', ?, ?) ON CONFLICT(user_id, entity_type, entity_id) DO UPDATE SET visited_at = excluded.visited_at")
      .bind(user.id, board.workspace_id, board.id, now())
      .run(),
  );
  return c.json(bundle);
});

boardRoutes.patch('/boards/:id', async (c) => {
  const user = c.get('user');
  const input = await body(
    c,
    z.object({
      name: z.string().trim().min(1).max(200).optional(),
      description: z.string().max(5000).optional(),
      icon: z.string().max(32).optional(),
      visibility: z.enum(['workspace', 'private']).optional(),
      position: z.number().optional(),
      folderId: z.string().nullable().optional(),
      settings: z.record(z.string(), z.unknown()).optional(),
    }),
  );
  const need = input.visibility || input.settings ? 'admin' : 'edit';
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, need);
  if (input.folderId) await assertFolder(c.env.DB, board.workspace_id, 'boards', input.folderId);
  let settings = parseJson<Record<string, unknown>>(board.settings_json, {});
  if (input.settings) {
    settings = { ...settings, ...input.settings };
    if (settings.defaultValues && typeof settings.defaultValues === 'object') {
      const { validateValues } = await import('../services/item-ops');
      const cols = (await c.env.DB.prepare('SELECT * FROM columns WHERE board_id = ?').bind(board.id).all<ColumnRow>()).results.map(columnDTO);
      const { svcFromContext } = await import('../services/context');
      settings.defaultValues = await validateValues(svcFromContext(c), board, cols.map((x) => ({ ...x, required: false })), settings.defaultValues as Record<string, unknown>);
    }
    if (JSON.stringify(settings).length > 20000) throw badRequest('Board settings too large');
  }
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE boards SET name = ?, description = ?, icon = ?, visibility = ?, position = ?, settings_json = ?, folder_id = ?, updated_at = ? WHERE id = ?').bind(
      input.name ?? board.name,
      input.description ?? board.description,
      input.icon ?? board.icon,
      board.kind === 'personal' ? 'private' : input.visibility ?? board.visibility,
      input.position ?? board.position,
      JSON.stringify(settings),
      input.folderId !== undefined ? input.folderId : board.folder_id ?? null,
      now(),
      board.id,
    ),
    ...(input.name !== undefined || input.description !== undefined || input.visibility !== undefined || input.settings !== undefined
      ? [eventStmt(c.env.DB, { type: 'project.updated', userId: user.id, workspaceId: board.workspace_id, boardId: board.id, entityType: 'board', entityId: board.id })]
      : []),
    ...(input.visibility && input.visibility !== board.visibility
      ? [auditStmt(c.env.DB, { workspaceId: board.workspace_id, actorId: user.id, action: 'board.visibility_changed', targetType: 'board', targetId: board.id, metadata: { to: input.visibility }, ip: clientIp(c) })]
      : []),
  ]);
  rt(c, board.id, 'board_updated');
  return c.json({ ok: true });
});

boardRoutes.post('/boards/:id/duplicate', async (c) => {
  const user = c.get('user');
  const { board, caps } = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  await requireWorkspace(c.env.DB, board.workspace_id, user.id, 'member');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(200).optional(), withItems: z.boolean().default(true), withAutomations: z.boolean().default(true) }));
  await refuseFinanceCopy(c.env.DB, board.id, caps.viewFinance, input.withItems);
  const id = await cloneBoard(c.env.DB, board.id, { name: input.name ?? `${board.name} (copy)`, createdBy: user.id, withItems: input.withItems, withAutomations: input.withAutomations, kind: board.kind === 'template' ? 'board' : board.kind });
  return c.json({ id }, 201);
});

boardRoutes.post('/boards/:id/save-as-template', async (c) => {
  const user = c.get('user');
  const { board, caps } = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manage');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(200), withItems: z.boolean().default(false) }));
  await refuseFinanceCopy(c.env.DB, board.id, caps.viewFinance, input.withItems);
  const id = await cloneBoard(c.env.DB, board.id, { name: input.name, createdBy: user.id, kind: 'template', withItems: input.withItems, withAutomations: true });
  return c.json({ id }, 201);
});

boardRoutes.post('/boards/:id/archive', async (c) => {
  const user = c.get('user');
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'admin');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE boards SET archived_at = ?, updated_at = ? WHERE id = ?').bind(now(), now(), board.id),
    auditStmt(c.env.DB, { workspaceId: board.workspace_id, actorId: user.id, action: 'board.archived', targetType: 'board', targetId: board.id, ip: clientIp(c) }),
    eventStmt(c.env.DB, { type: 'project.archived', userId: user.id, workspaceId: board.workspace_id, boardId: board.id, entityType: 'board', entityId: board.id }),
  ]);
  rt(c, board.id, 'board_updated');
  return c.json({ ok: true });
});

boardRoutes.post('/boards/:id/restore', async (c) => {
  const user = c.get('user');
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'admin');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE boards SET archived_at = NULL, updated_at = ? WHERE id = ?').bind(now(), board.id),
    auditStmt(c.env.DB, { workspaceId: board.workspace_id, actorId: user.id, action: 'board.restored', targetType: 'board', targetId: board.id, ip: clientIp(c) }),
  ]);
  rt(c, board.id, 'board_updated');
  return c.json({ ok: true });
});

boardRoutes.delete('/boards/:id', async (c) => {
  const user = c.get('user');
  const { board, wsRole } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'admin');
  const role = await c.env.DB.prepare('SELECT role FROM board_members WHERE board_id = ? AND user_id = ?').bind(board.id, user.id).first<{ role: string }>();
  if (!(wsRole === 'owner' || wsRole === 'admin' || role?.role === 'owner')) throw new HttpError(403, 'Only board owners or workspace admins can delete boards');
  const input = await body(c, z.object({ confirmName: z.string() }));
  if (input.confirmName !== board.name) throw badRequest('Type the board name to confirm deletion');
  const files = await c.env.DB.prepare('SELECT r2_key FROM attachments WHERE board_id = ?').bind(board.id).all<{ r2_key: string }>();
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM attachments WHERE board_id = ?').bind(board.id),
    c.env.DB.prepare('DELETE FROM activity_log WHERE board_id = ?').bind(board.id),
    c.env.DB.prepare("DELETE FROM favourites WHERE entity_type = 'board' AND entity_id = ?").bind(board.id),
    c.env.DB.prepare("DELETE FROM recents WHERE entity_type = 'board' AND entity_id = ?").bind(board.id),
    c.env.DB.prepare('DELETE FROM items WHERE board_id = ? AND parent_item_id IS NOT NULL').bind(board.id),
    c.env.DB.prepare('DELETE FROM boards WHERE id = ?').bind(board.id),
    auditStmt(c.env.DB, { workspaceId: board.workspace_id, actorId: user.id, action: 'board.deleted', targetType: 'board', targetId: board.id, metadata: { name: board.name }, ip: clientIp(c) }),
    eventStmt(c.env.DB, { type: 'project.deleted', userId: user.id, workspaceId: board.workspace_id, boardId: board.id, entityType: 'board', entityId: board.id }),
  ]);
  for (let i = 0; i < files.results.length; i += 1000) await c.env.FILES.delete(files.results.slice(i, i + 1000).map((f) => f.r2_key));
  rt(c, board.id, 'board_deleted');
  return c.json({ ok: true });
});

boardRoutes.put('/boards/:id/members', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manageMembers');
  const input = await body(c, z.object({ userId: z.string(), role: z.enum(['owner', 'editor', 'viewer']) }));
  await setProjectLevel(c, p, input.userId, input.role === 'owner' ? 'manage' : input.role === 'editor' ? 'edit' : 'view');
  return c.json({ ok: true });
});

boardRoutes.delete('/boards/:id/members/:userId', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'manageMembers');
  const owners = await c.env.DB.prepare("SELECT user_id FROM board_members WHERE board_id = ? AND role = 'owner'").bind(p.board.id).all<{ user_id: string }>();
  if (owners.results.length === 1 && owners.results[0].user_id === c.req.param('userId')) throw badRequest('A board must keep at least one owner');
  await setProjectLevel(c, p, c.req.param('userId'), 'default');
  return c.json({ ok: true });
});

boardRoutes.get('/boards/:id/activity', async (c) => {
  const user = c.get('user');
  const { board, caps } = await requireProject(c.env.DB, c.req.param('id'), user.id, 'view');
  const hidden = caps.viewFinance ? new Set<string>() : financialColumnIds((await c.env.DB.prepare('SELECT * FROM columns WHERE board_id = ?').bind(board.id).all<ColumnRow>()).results.map(columnDTO));
  const rows = await c.env.DB.prepare(
    `SELECT a.*, u.name AS actor_name, i.name AS item_name FROM activity_log a LEFT JOIN users u ON u.id = a.actor_id LEFT JOIN items i ON i.id = a.item_id
     WHERE a.board_id = ? ORDER BY a.created_at DESC LIMIT 200`,
  )
    .bind(board.id)
    .all<any>();
  return c.json(
    rows.results.map((r) =>
      hidden.has(r.column_id) ? { ...r, old_value: null, new_value: null, restricted: true } : { ...r, old_value: parseJson(r.old_value, null), new_value: parseJson(r.new_value, null) },
    ),
  );
});

// ------------------------------------------------------------------- groups

boardRoutes.post('/boards/:id/groups', async (c) => {
  const user = c.get('user');
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'edit');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(200), color: colorSchema.optional(), position: z.enum(['top', 'bottom']).default('top'), description: z.string().max(GROUP_DESCRIPTION_MAX * 4).optional() }));
  const description = normalizeGroupDescription(input.description ?? '');
  if (description.length > GROUP_DESCRIPTION_MAX) throw badRequest(`A description can be up to ${GROUP_DESCRIPTION_MAX.toLocaleString('en')} characters long.`);
  const agg = await c.env.DB.prepare('SELECT MIN(position) AS lo, MAX(position) AS hi, COUNT(*) AS n FROM groups WHERE board_id = ?').bind(board.id).first<{ lo: number | null; hi: number | null; n: number }>();
  if ((agg?.n ?? 0) >= 200) throw badRequest('Group limit reached');
  const id = newId();
  const position = input.position === 'top' ? positionBetween(null, agg?.lo) : positionBetween(agg?.hi, null);
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO groups (id, workspace_id, board_id, name, color, position, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, board.workspace_id, board.id, input.name, input.color ?? PALETTE[(agg?.n ?? 0) % PALETTE.length], position, description, now()),
    activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: user.id, action: 'group_created', newValue: input.name }),
  ]);
  rt(c, board.id, 'groups_changed');
  const g = await c.env.DB.prepare('SELECT * FROM groups WHERE id = ?').bind(id).first<GroupRow>();
  return c.json(groupDTO(g!), 201);
});

async function loadGroup(c: any, need: 'view' | 'edit' | 'admin') {
  const g = await c.env.DB.prepare('SELECT * FROM groups WHERE id = ?').bind(c.req.param('groupId')).first();
  if (!g) throw notFound('Group');
  const auth = await requireBoard(c.env.DB, (g as GroupRow).board_id, c.get('user').id, need);
  return { group: g as GroupRow, ...auth };
}

// Renaming, recolouring, collapsing, reordering and describing a group need edit access to the board (the same right
// for each); anyone who can view the board reads the description in the board bundle.
boardRoutes.patch('/groups/:groupId', async (c) => {
  const { group, board } = await loadGroup(c, 'edit');
  const input = await body(
    c,
    z.object({ name: z.string().trim().min(1).max(200).optional(), color: colorSchema.optional(), collapsed: z.boolean().optional(), position: z.number().optional(), description: z.string().max(GROUP_DESCRIPTION_MAX * 4).optional() }),
  );
  const description = input.description === undefined ? undefined : normalizeGroupDescription(input.description);
  if (description !== undefined && description.length > GROUP_DESCRIPTION_MAX) {
    throw badRequest(`A description can be up to ${GROUP_DESCRIPTION_MAX.toLocaleString('en')} characters long.`, [{ path: 'description', message: `Up to ${GROUP_DESCRIPTION_MAX} characters.` }]);
  }
  const before = group.description ?? '';
  const describedChanged = description !== undefined && description !== before;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE groups SET name = ?, color = ?, collapsed = ?, position = ?, description = ? WHERE id = ?').bind(
      input.name ?? group.name,
      input.color ?? group.color,
      input.collapsed === undefined ? group.collapsed : input.collapsed ? 1 : 0,
      input.position ?? group.position,
      description ?? before,
      group.id,
    ),
    ...(describedChanged
      ? [
          activityStmt(c.env.DB, {
            workspaceId: board.workspace_id,
            boardId: board.id,
            actorId: c.get('user').id,
            action: description ? 'group_description_changed' : 'group_description_cleared',
            newValue: input.name ?? group.name,
          }),
        ]
      : []),
  ]);
  rt(c, board.id, 'groups_changed');
  return c.json({ ok: true, description: description ?? before });
});

boardRoutes.post('/groups/:groupId/duplicate', async (c) => {
  const { group, board } = await loadGroup(c, 'edit');
  const { svcFromContext } = await import('../services/context');
  const { duplicateItem } = await import('../services/item-ops');
  const id = newId();
  const next = await c.env.DB.prepare('SELECT MIN(position) AS p FROM groups WHERE board_id = ? AND position > ?').bind(board.id, group.position).first<{ p: number | null }>();
  await c.env.DB.prepare('INSERT INTO groups (id, workspace_id, board_id, name, color, position, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, board.workspace_id, board.id, `${group.name} (copy)`, group.color, positionBetween(group.position, next?.p ?? null), group.description ?? '', now()).run();
  const items = await c.env.DB.prepare('SELECT * FROM items WHERE group_id = ? AND parent_item_id IS NULL AND archived_at IS NULL ORDER BY position').bind(group.id).all<ItemRow>();
  const svc = svcFromContext(c);
  for (const it of items.results) await duplicateItem(svc, board, it, { groupId: id, name: it.name });
  rt(c, board.id, 'groups_changed');
  return c.json({ id }, 201);
});

boardRoutes.post('/groups/:groupId/archive', async (c) => {
  const { group, board } = await loadGroup(c, 'edit');
  const { archived } = await body(c, z.object({ archived: z.boolean() }));
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE groups SET archived_at = ? WHERE id = ?').bind(archived ? t : null, group.id),
    c.env.DB.prepare('UPDATE items SET archived_at = ? WHERE group_id = ?').bind(archived ? t : null, group.id),
    activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: c.get('user').id, action: archived ? 'group_archived' : 'group_restored', newValue: group.name }),
  ]);
  rt(c, board.id, 'groups_changed');
  return c.json({ ok: true });
});

boardRoutes.delete('/groups/:groupId', async (c) => {
  const { group, board } = await loadGroup(c, 'edit');
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM groups WHERE board_id = ? AND archived_at IS NULL').bind(board.id).first<{ n: number }>();
  if ((count?.n ?? 0) <= 1 && !group.archived_at) throw badRequest('A board needs at least one group');
  const files = await c.env.DB.prepare('SELECT r2_key FROM attachments WHERE item_id IN (SELECT id FROM items WHERE group_id = ?)').bind(group.id).all<{ r2_key: string }>();
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM attachments WHERE item_id IN (SELECT id FROM items WHERE group_id = ?)').bind(group.id),
    c.env.DB.prepare('DELETE FROM items WHERE group_id = ? AND parent_item_id IS NOT NULL').bind(group.id),
    c.env.DB.prepare('DELETE FROM groups WHERE id = ?').bind(group.id),
    activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: c.get('user').id, action: 'group_deleted', oldValue: group.name }),
  ]);
  if (files.results.length) c.executionCtx.waitUntil(c.env.FILES.delete(files.results.map((f) => f.r2_key)));
  rt(c, board.id, 'groups_changed');
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ columns

const columnInput = z.object({
  title: z.string().trim().min(1).max(100),
  type: z.string(),
  settings: z.record(z.string(), z.unknown()).optional(),
  width: z.number().int().min(60).max(800).optional(),
  required: z.boolean().optional(),
  hidden: z.boolean().optional(),
  description: z.string().max(500).optional(),
  afterColumnId: z.string().optional(),
});

boardRoutes.post('/boards/:id/columns', async (c) => {
  const user = c.get('user');
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, 'admin');
  const input = await body(c, columnInput);
  if (!isColumnType(input.type)) throw badRequest('Unknown column type');
  const settings = sanitizeColumnSettings(input.type, input.settings);
  if (input.type === 'formula' && settings.formula) {
    const err = checkFormula(settings.formula);
    if (err) throw badRequest(`Formula error: ${err}`);
  }
  const cols = await c.env.DB.prepare('SELECT id, position FROM columns WHERE board_id = ? ORDER BY position').bind(board.id).all<{ id: string; position: number }>();
  if (cols.results.length >= 100) throw badRequest('Column limit reached');
  let position: number;
  const idx = input.afterColumnId ? cols.results.findIndex((x) => x.id === input.afterColumnId) : -1;
  if (idx >= 0) position = positionBetween(cols.results[idx].position, cols.results[idx + 1]?.position ?? null);
  else position = positionBetween(cols.results.at(-1)?.position ?? null, null);
  const id = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO columns (id, workspace_id, board_id, title, type, settings_json, position, width, hidden, required, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(
      id,
      board.workspace_id,
      board.id,
      input.title,
      input.type,
      JSON.stringify(settings),
      position,
      input.width ?? 150,
      input.hidden ? 1 : 0,
      input.required ? 1 : 0,
      input.description ?? '',
      now(),
    ),
    activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: user.id, action: 'column_created', newValue: { title: input.title, type: input.type } }),
  ]);
  rt(c, board.id, 'columns_changed');
  const row = await c.env.DB.prepare('SELECT * FROM columns WHERE id = ?').bind(id).first<ColumnRow>();
  return c.json(columnDTO(row!), 201);
});

async function loadColumn(c: any, need: 'edit' | 'admin') {
  const col = (await c.env.DB.prepare('SELECT * FROM columns WHERE id = ?').bind(c.req.param('columnId')).first()) as ColumnRow | null;
  if (!col) throw notFound('Column');
  const auth = await requireBoard(c.env.DB, col.board_id, c.get('user').id, need);
  return { col, ...auth };
}

boardRoutes.patch('/columns/:columnId', async (c) => {
  const user = c.get('user');
  const input = await body(c, columnInput.partial().extend({ position: z.number().optional() }));
  // Width/visibility are personal-ish layout tweaks: editors may change them. Structure changes need admin.
  const structural = input.type !== undefined || input.settings !== undefined || input.required !== undefined || input.title !== undefined;
  const { col, board } = await loadColumn(c, structural ? 'admin' : 'edit');
  let type = col.type;
  let settings = parseJson<Record<string, unknown>>(col.settings_json, {});
  const stmts: D1PreparedStatement[] = [];
  if (input.type && input.type !== col.type) {
    if (!isColumnType(input.type)) throw badRequest('Unknown column type');
    if (!canConvert(col.type, input.type)) throw badRequest(`Cannot safely convert ${getColumnType(col.type).label} to ${getColumnType(input.type).label}`);
    const newSettings = sanitizeColumnSettings(input.type, input.settings ?? settings);
    // When converting to a label type, derive labels from existing text values.
    const items = await c.env.DB.prepare('SELECT id, name, description, values_json FROM items WHERE board_id = ?').bind(board.id).all<{ id: string; name: string; description: string; values_json: string }>();
    if (['status', 'priority', 'dropdown'].includes(input.type) && !input.settings) {
      const fromDef = getColumnType(col.type);
      const texts = new Set<string>();
      for (const it of items.results) {
        const v = parseJson<Record<string, unknown>>(it.values_json, {})[col.id];
        if (v != null) fromDef.toText(v, settings).split(', ').filter(Boolean).forEach((t) => texts.add(t));
      }
      const existing = (newSettings.labels ?? newSettings.options ?? []) as { id: string; label: string; color: string }[];
      const merged = [...existing];
      Array.from(texts).slice(0, 40).forEach((t, i) => {
        if (!merged.some((l) => l.label.toLowerCase() === t.toLowerCase())) merged.push({ id: `l${newId().slice(0, 6)}`, label: t.slice(0, 60), color: PALETTE[(i + 4) % PALETTE.length] });
      });
      if (input.type === 'dropdown') newSettings.options = merged;
      else newSettings.labels = merged;
    }
    const fromCol = { id: col.id, title: col.title, type: col.type, settings };
    const allCols = (await c.env.DB.prepare('SELECT * FROM columns WHERE board_id = ?').bind(board.id).all<ColumnRow>()).results.map(columnDTO);
    const nextCols = allCols.map((x) => (x.id === col.id ? { ...x, type: input.type!, settings: newSettings } : x));
    for (const it of items.results) {
      const values = parseJson<Record<string, unknown>>(it.values_json, {});
      if (values[col.id] == null) continue;
      const converted = convertValue(fromCol, input.type, newSettings, values[col.id]);
      if (converted == null) delete values[col.id];
      else values[col.id] = converted;
      stmts.push(c.env.DB.prepare('UPDATE items SET values_json = ?, search_text = ? WHERE id = ?').bind(JSON.stringify(values), buildSearchText(it.name, it.description, values, nextCols), it.id));
    }
    type = input.type;
    settings = newSettings;
    stmts.push(activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: user.id, action: 'column_type_changed', columnId: col.id, oldValue: col.type, newValue: type }));
  } else if (input.settings) {
    settings = sanitizeColumnSettings(type, { ...settings, ...input.settings });
  }
  if (type === 'formula' && settings.formula) {
    const err = checkFormula(String(settings.formula));
    if (err) throw badRequest(`Formula error: ${err}`);
  }
  stmts.unshift(
    c.env.DB.prepare('UPDATE columns SET title = ?, type = ?, settings_json = ?, width = ?, hidden = ?, required = ?, description = ?, position = ? WHERE id = ?').bind(
      input.title ?? col.title,
      type,
      JSON.stringify(settings),
      input.width ?? col.width,
      input.hidden === undefined ? col.hidden : input.hidden ? 1 : 0,
      input.required === undefined ? col.required : input.required ? 1 : 0,
      input.description ?? col.description,
      input.position ?? col.position,
      col.id,
    ),
  );
  if (input.title && input.title !== col.title) {
    stmts.push(activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: user.id, action: 'column_renamed', columnId: col.id, oldValue: col.title, newValue: input.title }));
  }
  for (let i = 0; i < stmts.length; i += 400) await c.env.DB.batch(stmts.slice(i, i + 400));
  rt(c, board.id, 'columns_changed');
  const row = await c.env.DB.prepare('SELECT * FROM columns WHERE id = ?').bind(col.id).first<ColumnRow>();
  return c.json(columnDTO(row!));
});

boardRoutes.delete('/columns/:columnId', async (c) => {
  const user = c.get('user');
  const { col, board } = await loadColumn(c, 'admin');
  const path = `$."${col.id}"`;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE items SET values_json = json_remove(values_json, ?) WHERE board_id = ?').bind(path, board.id),
    c.env.DB.prepare('DELETE FROM columns WHERE id = ?').bind(col.id),
    activityStmt(c.env.DB, { workspaceId: board.workspace_id, boardId: board.id, actorId: user.id, action: 'column_deleted', oldValue: { title: col.title, type: col.type } }),
  ]);
  rt(c, board.id, 'columns_changed');
  return c.json({ ok: true });
});

// -------------------------------------------------------------------- views

function sanitizeViewSettings(raw: unknown) {
  const s = (raw && typeof raw === 'object' ? { ...(raw as Record<string, unknown>) } : {}) as Record<string, unknown>;
  if (s.filter) s.filter = sanitizeFilter(s.filter);
  if (JSON.stringify(s).length > 20000) throw badRequest('View settings too large');
  return s;
}

boardRoutes.post('/boards/:id/views', async (c) => {
  const user = c.get('user');
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(100), type: z.enum(VIEW_TYPES as [ViewType, ...ViewType[]]), settings: z.unknown().optional(), personal: z.boolean().default(false) }));
  const { board } = await requireBoard(c.env.DB, c.req.param('id'), user.id, input.personal ? 'view' : 'edit');
  const agg = await c.env.DB.prepare('SELECT MAX(position) AS hi FROM views WHERE board_id = ?').bind(board.id).first<{ hi: number | null }>();
  const id = newId();
  const t = now();
  await c.env.DB.prepare('INSERT INTO views (id, workspace_id, board_id, name, type, settings_json, position, owner_id, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, board.workspace_id, board.id, input.name, input.type, JSON.stringify(sanitizeViewSettings(input.settings)), positionBetween(agg?.hi ?? null, null), input.personal ? user.id : null, user.id, t, t)
    .run();
  if (!input.personal) rt(c, board.id, 'views_changed');
  const row = await c.env.DB.prepare('SELECT * FROM views WHERE id = ?').bind(id).first<ViewRow>();
  return c.json(viewDTO(row!), 201);
});

async function loadView(c: any) {
  const v = (await c.env.DB.prepare('SELECT * FROM views WHERE id = ?').bind(c.req.param('viewId')).first()) as ViewRow | null;
  if (!v) throw notFound('View');
  const userId = c.get('user').id;
  if (v.owner_id && v.owner_id !== userId) throw notFound('View');
  const auth = await requireBoard(c.env.DB, v.board_id, userId, v.owner_id ? 'view' : 'edit');
  return { view: v, ...auth };
}

boardRoutes.patch('/views/:viewId', async (c) => {
  const { view, board } = await loadView(c);
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(100).optional(), settings: z.unknown().optional(), position: z.number().optional() }));
  await c.env.DB.prepare('UPDATE views SET name = ?, settings_json = ?, position = ?, updated_at = ? WHERE id = ?')
    .bind(input.name ?? view.name, input.settings !== undefined ? JSON.stringify(sanitizeViewSettings(input.settings)) : view.settings_json, input.position ?? view.position, now(), view.id)
    .run();
  if (!view.owner_id) rt(c, board.id, 'views_changed');
  return c.json({ ok: true });
});

boardRoutes.delete('/views/:viewId', async (c) => {
  const { view, board } = await loadView(c);
  await c.env.DB.prepare('DELETE FROM views WHERE id = ?').bind(view.id).run();
  if (!view.owner_id) rt(c, board.id, 'views_changed');
  return c.json({ ok: true });
});

type LevelChoice = 'default' | 'none' | 'view' | 'edit' | 'manage';

/**
 * Set a person's access level on a project, with the rules against privilege escalation: nobody changes their own
 * access (except organisation administrators, who always have full access anyway), nobody gives a level above their
 * own, organisation owners and admins cannot be restricted, and the person must be an active member.
 */
export async function setProjectLevel(c: any, p: import('../services/access').ProjectAuth, targetId: string, level: LevelChoice, overrides?: Record<string, boolean | null>) {
  const user = c.get('user');
  const db: D1Database = c.env.DB;
  const board = p.board;
  if (targetId === user.id && p.wsRole !== 'owner' && p.wsRole !== 'admin') throw new HttpError(403, 'You cannot change your own access');
  const target = await db.prepare("SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ? AND status = 'active'").bind(board.workspace_id, targetId).first<{ role: WorkspaceRole }>();
  if (!target) throw badRequest('User must be a workspace member');
  if (target.role === 'owner' || target.role === 'admin') {
    if (level !== 'default' || (overrides && Object.values(overrides).some((v) => v === false))) throw new HttpError(400, 'Organisation owners and admins always have full access to every project');
  }
  const rank = { view: 1, edit: 2, manage: 3 } as const;
  if ((level === 'view' || level === 'edit' || level === 'manage') && rank[level] > rank[p.caps.level]) throw new HttpError(403, 'You cannot give more access than you have');
  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) {
      if (v === true && !(p.caps as unknown as Record<string, boolean>)[k]) throw new HttpError(403, 'You cannot give a permission you do not have');
    }
  }
  const before = await db.prepare('SELECT bm.role, bp.denied FROM workspace_members m LEFT JOIN board_members bm ON bm.board_id = ?1 AND bm.user_id = m.user_id LEFT JOIN board_permissions bp ON bp.board_id = ?1 AND bp.user_id = m.user_id WHERE m.workspace_id = ?2 AND m.user_id = ?3').bind(board.id, board.workspace_id, targetId).first<{ role: string | null; denied: number | null }>();
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  if (level === 'view' || level === 'edit' || level === 'manage') {
    const role = level === 'manage' ? 'owner' : level === 'edit' ? 'editor' : 'viewer';
    stmts.push(db.prepare('INSERT INTO board_members (board_id, workspace_id, user_id, role) VALUES (?, ?, ?, ?) ON CONFLICT(board_id, user_id) DO UPDATE SET role = excluded.role').bind(board.id, board.workspace_id, targetId, role));
  } else {
    stmts.push(db.prepare('DELETE FROM board_members WHERE board_id = ? AND user_id = ?').bind(board.id, targetId));
  }
  const ov = overrides ?? {};
  const col = (k: string) => (ov[k] === true ? 1 : ov[k] === false ? 0 : null);
  stmts.push(
    db
      .prepare(
        `INSERT INTO board_permissions (board_id, workspace_id, user_id, denied, view_finance, edit_finance, manage_members, create_tasks, assign_tasks, delete_tasks, generate_reports, updated_by, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(board_id, user_id) DO UPDATE SET denied = excluded.denied, view_finance = excluded.view_finance, edit_finance = excluded.edit_finance,
           manage_members = excluded.manage_members, create_tasks = excluded.create_tasks, assign_tasks = excluded.assign_tasks, delete_tasks = excluded.delete_tasks,
           generate_reports = excluded.generate_reports, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      )
      .bind(board.id, board.workspace_id, targetId, level === 'none' ? 1 : 0, col('viewFinance'), col('editFinance'), col('manageMembers'), col('createTasks'), col('assignTasks'), col('deleteTasks'), col('generateReports'), user.id, t),
  );
  stmts.push(
    auditStmt(db, { workspaceId: board.workspace_id, actorId: user.id, action: 'board.member_set', targetType: 'board', targetId: board.id, metadata: { userId: targetId, level, overrides: overrides ?? null }, ip: clientIp(c) }),
    auditEventStmt(db, { workspaceId: board.workspace_id, boardId: board.id, actorId: user.id, type: 'project.membership_changed', before: { role: before?.role ?? null, denied: !!before?.denied }, after: { level, overrides: overrides ?? null }, metadata: { userId: targetId } }),
  );
  await db.batch(stmts);
  c.executionCtx.waitUntil(broadcast(c.env, board.id, { kind: 'board_updated', actorId: user.id }));
  if (targetId !== user.id) {
    const ws = await db.prepare('SELECT name FROM workspaces WHERE id = ?').bind(board.workspace_id).first<{ name: string }>();
    const { notify } = await import('../services/notify');
    const { svcFromContext } = await import('../services/context');
    const gained = !before?.role && (level === 'view' || level === 'edit' || level === 'manage');
    const text = level === 'none' ? 'You no longer have access to this project.' : level === 'default' ? 'Your access now follows your organisation role.' : `You now have ${level} access.`;
    await notify(svcFromContext(c), {
      workspaceId: board.workspace_id,
      userIds: [targetId],
      type: gained ? 'project_membership' : 'permission_change',
      title: gained ? `You were added to ${board.name}` : `Your access to ${board.name} changed`,
      body: text,
      link: `/w/${board.workspace_id}/boards/${board.id}`,
      entityType: 'board',
      entityId: board.id,
      email: gained
        ? { template: 'project_assignment', organisation: ws?.name ?? '', project: board.name, level, by: user.name, url: `/w/${board.workspace_id}/boards/${board.id}` }
        : { template: 'permission_change', organisation: ws?.name ?? '', project: board.name, change: text, by: user.name, url: `/w/${board.workspace_id}/boards/${board.id}` },
    });
  }
}

/** A copy with items carries the amounts, and its maker owns the copy: not for people who may not see them. */
async function refuseFinanceCopy(db: D1Database, boardId: string, canSee: boolean, withItems: boolean) {
  if (canSee || !withItems) return;
  const cols = (await db.prepare('SELECT * FROM columns WHERE board_id = ?').bind(boardId).all<ColumnRow>()).results.map(columnDTO);
  if (financialColumnIds(cols).size) throw new HttpError(403, 'This project holds financial data you may not view: copy it without its items');
}
