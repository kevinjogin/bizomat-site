// Moving tasks to another project, in the same company or in another company the person works in (owner, 20 Nov 2026:
// "allow tasks and entries to move between companies as user may mistakenly entered to wrong company or department ...
// and allow mass selection move between companies"). Behind the flag move_records (off), which both companies must have
// on; docs/platform/moving-records.md.
//
// A task keeps its id, so links to it keep working, and takes a new key from the new project's counter (the old key is
// in its history). Its subtasks, comments, files, time, progress and cost records, schedule and history go with it.
// Values are carried column by column: the same type and title, else the only column of that type on both sides;
// labels by their name; people only when they may open the new project; dependencies only between tasks moved together;
// amounts only between columns of the same currency. What cannot be carried is listed before the move (the preview) and
// recorded on the task; the audit trail (append only) keeps every value as it was. A task with financial data moves only
// for someone who may see it where it is and change it where it goes. Automations do not run on a moved task.

import { convertValue, getColumnType, isComputed, normalizeColumnValue, doneLabelIds } from '../../shared/columns';
import { resolveColumnCurrency } from '../../shared/finance';
import { isFinancialColumn } from '../../shared/permissions';
import type { ColumnDTO } from '../../shared/types';
import { HttpError, badRequest, now, parseJson, placeholders } from '../lib/util';
import { flagOn, moduleEnabled } from '../platform/flags';
import { companyOfTool } from '../platform/context';
import { ensureOwnCompany } from '../system/system';
import { loadMemberAccess, membersV2, roleAllows } from '../company/members-access';
import { broadcast } from '../realtime/board-room';
import { activityStmt, auditEventStmt } from './audit';
import type { Svc } from './context';
import { buildSearchText } from './item-ops';
import { loadColumns } from './mappers';
import { financePolicy, usersWithAccess, type ProjectAuth } from './access';
import type { BoardRow, ItemRow } from './permissions';
import { positionBetween } from '../../shared/items';
import { allocateTaskKeys } from './schedule/task-keys';

export const MAX_TRANSFER = 200;

// ------------------------------------------------------------------ columns (pure)

export interface ColumnMatch {
  from: { id: string; title: string; type: string };
  to: { id: string; title: string } | null;
  /** Why the column's values do not move (or move with a condition). */
  note?: string;
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const worked = (c: ColumnDTO) => isComputed(c.type) || (c.type === 'progress' && !!c.settings?.mode && c.settings.mode !== 'manual');

/** Which column of the new project each column's values go to: the same type and title, else the only one of its type. */
export function matchColumns(src: ColumnDTO[], dst: ColumnDTO[]): ColumnMatch[] {
  const taken = new Set<string>();
  const out = new Map<string, ColumnMatch>();
  const open = (c: ColumnDTO) => !worked(c) && !taken.has(c.id);
  for (const s of src) {
    if (worked(s)) {
      out.set(s.id, { from: { id: s.id, title: s.title, type: s.type }, to: null, note: 'Worked out again in the new project' });
      continue;
    }
    const d = dst.find((x) => open(x) && x.type === s.type && norm(x.title) === norm(s.title));
    if (d) {
      taken.add(d.id);
      out.set(s.id, { from: { id: s.id, title: s.title, type: s.type }, to: { id: d.id, title: d.title } });
    }
  }
  for (const s of src) {
    if (out.has(s.id)) continue;
    const mine = src.filter((x) => x.type === s.type && !out.has(x.id));
    const theirs = dst.filter((x) => open(x) && x.type === s.type);
    if (mine.length === 1 && theirs.length === 1) {
      taken.add(theirs[0].id);
      out.set(s.id, { from: { id: s.id, title: s.title, type: s.type }, to: { id: theirs[0].id, title: theirs[0].title } });
    } else out.set(s.id, { from: { id: s.id, title: s.title, type: s.type }, to: null, note: 'No matching column in the new project' });
  }
  return src.map((s) => out.get(s.id)!);
}

export interface CarryContext {
  /** People who may open the new project (and may be assigned there). */
  people: Set<string>;
  /** Whether the person moving may assign people in the new project. */
  mayAssign: boolean;
  /** Ids of every task moved together (dependencies between them stay). */
  moved: Set<string>;
  currency: (col: ColumnDTO, side: 'src' | 'dst') => string | null;
}

/** One value in the new project's column, or why it cannot go there. */
export type Carried = { value: unknown; partly?: boolean } | { dropped: string };

export function carryValue(from: ColumnDTO, to: ColumnDTO, value: unknown, ctx: CarryContext): Carried {
  if (value == null || value === '') return { value: null };
  if (from.type === 'person' || from.type === 'people') {
    if (!ctx.mayAssign) return { dropped: 'you cannot assign people in the new project' };
    const ids = Array.isArray(value) ? (value as string[]) : [String(value)];
    const kept = ids.filter((u) => ctx.people.has(u));
    if (!kept.length) return { dropped: 'the people assigned cannot open the new project' };
    const v = from.type === 'person' ? kept[0] : kept;
    return kept.length < ids.length ? { value: v, partly: true } : { value: v };
  }
  if (from.type === 'dependency') {
    const ids = (Array.isArray(value) ? value : [value]).map(String).filter((i) => ctx.moved.has(i));
    return ids.length ? { value: ids } : { dropped: 'it depends on tasks that stay where they are' };
  }
  if (from.type === 'files') return { value };
  if (from.type === 'currency') {
    const a = ctx.currency(from, 'src');
    const b = ctx.currency(to, 'dst');
    if (a && b && a !== b) return { dropped: `the amount is in ${a} and the new column is in ${b}` };
  }
  const settings = to.settings ?? {};
  let v: unknown;
  if (from.type === 'status' || from.type === 'priority' || from.type === 'dropdown') {
    v = convertValue(from, to.type, settings, value);
    if (v == null) {
      const text = getColumnType(from.type).toText(value, from.settings ?? {});
      return { dropped: text ? `the new project has no label "${text}"` : 'the label is not in the new project' };
    }
    return { value: v };
  }
  const r = normalizeColumnValue({ ...to, required: false }, value);
  return r.ok ? { value: r.value } : { dropped: r.error.toLowerCase() };
}

// ------------------------------------------------------------------ the move

export interface TransferTask {
  id: string;
  name: string;
  key: string | null;
  subtasks: number;
  ok: boolean;
  /** Why the task cannot move (it is left where it is). */
  error?: string;
  /** Values that will not be carried over, by column. */
  notCarried: { column: string; reason: string }[];
  newKey?: string;
}

export interface TransferResult {
  sameCompany: boolean;
  target: { companyId: string; boardId: string; boardName: string; groupId: string; groupName: string };
  columns: ColumnMatch[];
  tasks: TransferTask[];
  moved: number;
}

interface Side {
  auth: ProjectAuth;
  companyId: string;
  demo: boolean;
  columns: ColumnDTO[];
  currency: string | null;
}

async function isDemo(db: D1Database, companyId: string): Promise<boolean> {
  return !!(await db.prepare("SELECT 1 FROM sys_demo WHERE company_id = ? AND status <> 'removed'").bind(companyId).first());
}

/** The company a workspace belongs to. A workspace of no registered company belongs to its owner's own company, made
 * here if the owner has not opened the ERP yet (as system/system.ts does on a first visit). */
export async function workspaceCompany(db: D1Database, workspaceId: string): Promise<string | null> {
  const found = await companyOfTool(db, 'tasks', workspaceId);
  if (found) return found;
  const owner = await db
    .prepare("SELECT u.id, u.name, u.email FROM workspace_members m JOIN users u ON u.id = m.user_id WHERE m.workspace_id = ? AND m.role = 'owner' ORDER BY m.joined_at LIMIT 1")
    .bind(workspaceId)
    .first<{ id: string; name: string; email: string }>();
  if (!owner) return null;
  await ensureOwnCompany(db, owner, 'backfill');
  return companyOfTool(db, 'tasks', workspaceId);
}

async function side(db: D1Database, auth: ProjectAuth): Promise<Side> {
  const companyId = await workspaceCompany(db, auth.board.workspace_id);
  if (!companyId) throw new HttpError(404, 'Project not found');
  const policy = await financePolicy(db, auth.board.workspace_id);
  return { auth, companyId, demo: await isDemo(db, companyId), columns: await loadColumns(db, auth.board.id), currency: policy.defaultCurrency };
}

/** Whether tasks may be moved from or to a company: the flag on for it, and its Projects and Tasks not switched off. */
export async function moveOn(db: D1Database, companyId: string): Promise<boolean> {
  try {
    return (await flagOn(db, 'move_records', { companyId })) && (await moduleEnabled(db, 'tasks', companyId));
  } catch {
    return false;
  }
}

/**
 * The checks shared by the preview and the move: both companies have the flag on, the example company's invented data
 * stays in it, the person may take tasks out of the first project and add them to the second, in both companies.
 */
async function checkMove(db: D1Database, userId: string, from: Side, to: Side, items: ItemRow[]): Promise<void> {
  if (from.auth.board.id === to.auth.board.id) throw badRequest('The tasks are already in this project. To change their group, use Move to group.');
  if (to.auth.board.kind === 'template') throw badRequest('Tasks cannot be moved into a template.');
  if (to.auth.board.archived_at) throw new HttpError(409, 'The project is archived. Restore it before moving tasks into it.');
  if (!(await moveOn(db, from.companyId)) || !(await moveOn(db, to.companyId))) {
    throw new HttpError(403, 'Moving tasks between projects is not switched on for this company.', { code: 'MOVE_OFF' });
  }
  if (from.companyId !== to.companyId && (from.demo || to.demo)) throw new HttpError(403, 'The example company’s invented data stays in it, and nothing moves into it.', { code: 'MOVE_EXAMPLE' });
  if (!from.auth.caps.deleteTasks) throw new HttpError(403, 'Your access to this project does not include taking tasks out of it.');
  if (!to.auth.caps.createTasks) throw new HttpError(403, 'Your access to the new project does not include adding tasks.');
  // A company's member rules (company_members_v2), where they act: both must allow it.
  for (const s of from.companyId === to.companyId ? [from] : [from, to]) {
    if (!(await membersV2(db, s.companyId))) continue;
    const a = await loadMemberAccess(db, s.companyId, userId);
    if (!a) continue;
    if (a.status === 'suspended') throw new HttpError(403, 'Your access to that company is suspended.', { code: 'MEMBER_SUSPENDED' });
    if (!a.modules.projects.access) throw new HttpError(403, 'You do not have access to Projects and Tasks in that company.', { code: 'MODULE_ACCESS', module: 'projects' });
    if (!roleAllows(a.role, 'create_edit')) throw new HttpError(403, 'Your company role can view but not change anything.', { code: 'READ_ONLY' });
    if (s === from && !roleAllows(a.role, 'delete') && items.some((i) => i.created_by !== userId)) {
      throw new HttpError(403, 'Your company role can move only tasks you created.', { code: 'SCOPE', scope: 'own' });
    }
  }
}

/** A query over a list of ids, in parts (a statement takes at most 100 bound values). */
async function selectIn<T>(db: D1Database, sql: (ph: string) => string, ids: string[], before: unknown[] = []): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < ids.length; i += 80) {
    const part = ids.slice(i, i + 80);
    out.push(...(await db.prepare(sql(placeholders(part.length))).bind(...before, ...part).all<T>()).results);
  }
  return out;
}

async function withCosts(db: D1Database, ids: string[]): Promise<Set<string>> {
  return new Set((await selectIn<{ item_id: string }>(db, (ph) => `SELECT DISTINCT item_id FROM task_cost_entries WHERE item_id IN (${ph})`, ids)).map((x) => x.item_id));
}

interface Plan {
  result: TransferResult;
  /** Per moving task: the new values of the task and each subtask. */
  rows: Map<string, { item: ItemRow; values: Record<string, unknown>; done: boolean }[]>;
}

async function plan(svc: Svc, from: Side, to: Side, items: ItemRow[], groupId: string | undefined): Promise<Plan> {
  const db = svc.db;
  const top = items.filter((i) => !i.parent_item_id);
  if (top.length !== items.length) throw badRequest('Subtasks move with their task: select the task instead.');
  const subs = (await selectIn<ItemRow>(db, (ph) => `SELECT * FROM items WHERE parent_item_id IN (${ph})`, top.map((t) => t.id))).sort((a, b) => a.position - b.position);
  const all = [...top, ...subs];
  const moved = new Set(all.map((i) => i.id));

  const group = groupId
    ? await db.prepare('SELECT id, name FROM groups WHERE id = ? AND board_id = ?').bind(groupId, to.auth.board.id).first<{ id: string; name: string }>()
    : await db.prepare('SELECT id, name FROM groups WHERE board_id = ? AND archived_at IS NULL ORDER BY position LIMIT 1').bind(to.auth.board.id).first<{ id: string; name: string }>();
  if (!group) throw badRequest(groupId ? 'The group is not in that project.' : 'The project has no group to put the tasks in. Add one first.');

  const matches = matchColumns(from.columns, to.columns);
  const people = new Set<string>();
  const named = new Set<string>();
  for (const it of all) {
    const v = parseJson<Record<string, unknown>>(it.values_json, {});
    for (const c of from.columns) if ((c.type === 'person' || c.type === 'people') && v[c.id] != null) (Array.isArray(v[c.id]) ? (v[c.id] as string[]) : [String(v[c.id])]).forEach((u) => named.add(u));
  }
  if (named.size) for (const u of await usersWithAccess(db, to.auth.board, null, [...named])) people.add(u);
  const ctx: CarryContext = {
    people,
    mayAssign: to.auth.caps.assignTasks,
    moved,
    currency: (col, s) => resolveColumnCurrency(col.settings, (s === 'src' ? from : to).auth.board.currency ?? null, (s === 'src' ? from : to).currency).currency,
  };
  const financial = new Set(from.columns.filter(isFinancialColumn).map((c) => c.id));
  const costs = await withCosts(db, [...moved]);
  const financeOk = from.auth.caps.viewFinance && to.auth.caps.editFinance;

  const tasks: TransferTask[] = [];
  const rows: Plan['rows'] = new Map();
  for (const t of top) {
    const family = [t, ...subs.filter((s) => s.parent_item_id === t.id)];
    const notCarried = new Map<string, Set<string>>();
    const out: { item: ItemRow; values: Record<string, unknown>; done: boolean }[] = [];
    let hasFinance = false;
    for (const it of family) {
      const v = parseJson<Record<string, unknown>>(it.values_json, {});
      const next: Record<string, unknown> = {};
      if (costs.has(it.id)) hasFinance = true;
      for (const m of matches) {
        const value = v[m.from.id];
        if (value == null || value === '') continue;
        if (financial.has(m.from.id)) hasFinance = true;
        const fromCol = from.columns.find((c) => c.id === m.from.id)!;
        if (!m.to) {
          if (!worked(fromCol)) (notCarried.get(m.from.title) ?? notCarried.set(m.from.title, new Set()).get(m.from.title)!).add(m.note ?? 'no matching column');
          continue;
        }
        const toCol = to.columns.find((c) => c.id === m.to!.id)!;
        const r = carryValue(fromCol, toCol, value, ctx);
        if ('dropped' in r) (notCarried.get(m.from.title) ?? notCarried.set(m.from.title, new Set()).get(m.from.title)!).add(r.dropped);
        else if (r.value != null) {
          next[toCol.id] = r.value;
          if (r.partly) (notCarried.get(m.from.title) ?? notCarried.set(m.from.title, new Set()).get(m.from.title)!).add('some of the people assigned cannot open the new project');
        }
      }
      const done = to.columns.some((c) => c.type === 'status' && typeof next[c.id] === 'string' && doneLabelIds(c).includes(next[c.id] as string));
      out.push({ item: it, values: next, done });
    }
    const task: TransferTask = {
      id: t.id,
      name: t.name,
      key: t.task_key ?? null,
      subtasks: family.length - 1,
      ok: true,
      notCarried: [...notCarried].map(([column, reasons]) => ({ column, reason: [...reasons].join('; ') })),
    };
    if (hasFinance && !financeOk) {
      task.ok = false;
      task.error = 'This task has financial data. It can be moved by someone who may see it in this project and change it in the new one.';
    }
    tasks.push(task);
    if (task.ok) rows.set(t.id, out);
  }
  return {
    result: {
      sameCompany: from.companyId === to.companyId,
      target: { companyId: to.companyId, boardId: to.auth.board.id, boardName: to.auth.board.name, groupId: group.id, groupName: group.name },
      columns: matches,
      tasks,
      moved: 0,
    },
    rows,
  };
}

/** What a move would do, without doing it. */
export async function previewTransfer(svc: Svc, src: ProjectAuth, dst: ProjectAuth, items: ItemRow[], groupId?: string): Promise<TransferResult> {
  const from = await side(svc.db, src);
  const to = await side(svc.db, dst);
  await checkMove(svc.db, svc.actor!.id, from, to, items);
  return (await plan(svc, from, to, items, groupId)).result;
}

/** Moves the tasks (each with its subtasks) to the new project. A task that cannot move is left where it is. */
export async function transferItems(svc: Svc, src: ProjectAuth, dst: ProjectAuth, items: ItemRow[], groupId?: string): Promise<TransferResult> {
  const db = svc.db;
  const from = await side(db, src);
  const to = await side(db, dst);
  await checkMove(db, svc.actor!.id, from, to, items);
  const { result, rows } = await plan(svc, from, to, items, groupId);
  const sb = from.auth.board;
  const tb = to.auth.board;
  const actor = svc.actor!.id;
  const same = result.sameCompany;
  const sameWs = sb.workspace_id === tb.workspace_id;
  const g = result.target.groupId;
  const t0 = now();

  const agg = await db.prepare('SELECT MAX(position) AS hi FROM items WHERE group_id = ? AND parent_item_id IS NULL').bind(g).first<{ hi: number | null }>();
  let hi = agg?.hi ?? null;
  const movedIds: string[] = [];

  for (const task of result.tasks) {
    const family = rows.get(task.id);
    if (!family) continue;
    const ids = family.map((f) => f.item.id);
    const keys = await allocateTaskKeys(db, tb, ids.length);
    const position = positionBetween(hi, null);
    const stmts: D1PreparedStatement[] = [];
    family.forEach((f, i) => {
      const it = f.item;
      const top = !it.parent_item_id;
      stmts.push(
        db
          .prepare(
            `UPDATE items SET workspace_id = ?, board_id = ?, group_id = ?, position = ?, values_json = ?, search_text = ?, task_number = ?, task_key = ?,
               completed_at = ?, updated_at = ? WHERE id = ? AND board_id = ?`,
          )
          .bind(
            tb.workspace_id,
            tb.id,
            g,
            top ? position : it.position,
            JSON.stringify(f.values),
            buildSearchText(it.name, it.description, f.values, to.columns),
            keys[i].number,
            keys[i].key,
            f.done ? (it.completed_at ?? t0) : null,
            t0,
            it.id,
            sb.id,
          ),
      );
    });
    // The task and its subtasks, by the task's id alone (one bound value, however many subtasks).
    const fam = '(SELECT id FROM items WHERE id = ? OR parent_item_id = ?)';
    const top = family[0].item.id;
    const up = (sql: string, ...args: unknown[]) => stmts.push(db.prepare(sql.replace('$FAM', fam)).bind(...args, top, top));
    const notIn = " AND user_id NOT IN (SELECT user_id FROM workspace_members WHERE workspace_id = ? AND status = 'active')";
    up('UPDATE updates SET workspace_id = ?, board_id = ? WHERE item_id IN $FAM', tb.workspace_id, tb.id);
    stmts.push(
      db
        .prepare(`UPDATE attachments SET workspace_id = ?, board_id = ? WHERE item_id IN ${fam} OR update_id IN (SELECT id FROM updates WHERE item_id IN ${fam})`)
        .bind(tb.workspace_id, tb.id, top, top, top, top),
    );
    up('UPDATE time_entries SET workspace_id = ?, board_id = ? WHERE item_id IN $FAM', tb.workspace_id, tb.id);
    up('UPDATE task_schedules SET board_id = ? WHERE item_id IN $FAM', tb.id);
    up('UPDATE task_progress_entries SET board_id = ? WHERE item_id IN $FAM', tb.id);
    up('UPDATE task_cost_entries SET board_id = ? WHERE item_id IN $FAM', tb.id);
    up('UPDATE activity_log SET workspace_id = ?, board_id = ? WHERE item_id IN $FAM', tb.workspace_id, tb.id);
    // Grants on a single task belong to the project it was in.
    up('DELETE FROM item_permissions WHERE item_id IN $FAM');
    if (!sameWs) {
      // People who cannot open the new place lose it from their planner, favourites and recent list.
      const gone = (sql: string) => stmts.push(db.prepare(sql.replace('$FAM', fam) + notIn).bind(top, top, tb.workspace_id));
      gone('DELETE FROM planner_entries WHERE item_id IN $FAM');
      gone("DELETE FROM favourites WHERE entity_type = 'item' AND entity_id IN $FAM");
      gone("DELETE FROM recents WHERE entity_type = 'item' AND entity_id IN $FAM");
      up('UPDATE planner_entries SET workspace_id = ? WHERE item_id IN $FAM', tb.workspace_id);
      up("UPDATE favourites SET workspace_id = ? WHERE entity_type = 'item' AND entity_id IN $FAM", tb.workspace_id);
      up("UPDATE recents SET workspace_id = ? WHERE entity_type = 'item' AND entity_id IN $FAM", tb.workspace_id);
      // A document stays in its workspace; it is no longer linked to the task.
      up('UPDATE documents SET item_id = NULL WHERE workspace_id = ? AND item_id IN $FAM', sb.workspace_id);
    } else {
      up('UPDATE documents SET board_id = ? WHERE workspace_id = ? AND item_id IN $FAM', tb.id, sb.workspace_id);
    }
    // Links from other tools: a CRM activity's task, a design review task.
    if (same) {
      up('UPDATE crm_activities SET pm_workspace_id = ? WHERE pm_item_id IN $FAM', tb.workspace_id);
      up('UPDATE cad_review_tasks SET board_id = ? WHERE company_id = ? AND item_id IN $FAM', tb.id, from.companyId);
    } else {
      up('UPDATE crm_activities SET pm_workspace_id = NULL, pm_item_id = NULL WHERE pm_workspace_id = ? AND pm_item_id IN $FAM', sb.workspace_id);
      up('DELETE FROM cad_review_tasks WHERE company_id = ? AND item_id IN $FAM', from.companyId);
    }
    const it = family[0].item;
    const where = same ? { boardId: tb.id, boardName: tb.name } : { company: 'another company' };
    const fromWhere = same ? { boardId: sb.id, boardName: sb.name } : { company: 'another company' };
    stmts.push(
      activityStmt(db, { workspaceId: sb.workspace_id, boardId: sb.id, itemId: null, actorId: actor, action: 'item_moved_out', oldValue: { id: it.id, name: it.name, key: it.task_key ?? null }, newValue: where }),
      activityStmt(db, {
        workspaceId: tb.workspace_id,
        boardId: tb.id,
        itemId: it.id,
        actorId: actor,
        action: 'item_transferred',
        oldValue: { ...fromWhere, key: it.task_key ?? null },
        newValue: { boardId: tb.id, boardName: tb.name, key: keys[0].key, notCarried: task.notCarried },
      }),
      auditEventStmt(db, {
        workspaceId: sb.workspace_id,
        boardId: sb.id,
        itemId: it.id,
        actorId: actor,
        type: 'task.moved_out',
        before: { key: it.task_key ?? null, values: family.map((f) => ({ id: f.item.id, values: parseJson(f.item.values_json, {}) })) },
        after: { companyId: to.companyId, workspaceId: tb.workspace_id, boardId: tb.id, key: keys[0].key },
        metadata: { subtasks: family.length - 1, notCarried: task.notCarried },
        at: t0,
      }),
      auditEventStmt(db, {
        workspaceId: tb.workspace_id,
        boardId: tb.id,
        itemId: it.id,
        actorId: actor,
        type: 'task.moved_in',
        before: { companyId: from.companyId, workspaceId: sb.workspace_id, boardId: sb.id, key: it.task_key ?? null },
        after: { groupId: g, key: keys[0].key },
        metadata: { subtasks: family.length - 1, notCarried: task.notCarried },
        at: t0,
      }),
    );
    try {
      await db.batch(stmts);
      hi = position;
      task.newKey = keys[0].key;
      movedIds.push(...ids);
    } catch (e) {
      task.ok = false;
      task.error = e instanceof Error && /UNIQUE/i.test(e.message) ? 'The task could not be given a key in the new project. Try again.' : 'The task could not be moved. Nothing was changed for it.';
    }
  }

  if (movedIds.length) {
    // The old project's dependency links: between tasks moved together they go with them, any other is removed. A task of
    // the new project that is still linked in the old one can only be one that was just moved.
    const inNew = '(SELECT id FROM items WHERE board_id = ?)';
    await db.batch([
      db.prepare(`UPDATE task_links SET board_id = ? WHERE board_id = ? AND predecessor_id IN ${inNew} AND successor_id IN ${inNew}`).bind(tb.id, sb.id, tb.id, tb.id),
      db.prepare(`DELETE FROM task_links WHERE board_id = ? AND (predecessor_id IN ${inNew} OR successor_id IN ${inNew})`).bind(sb.id, tb.id, tb.id),
      db.prepare('UPDATE boards SET updated_at = ? WHERE id IN (?, ?)').bind(t0, sb.id, tb.id),
    ]);
    // Dependency values of the tasks left behind that pointed at the moved ones.
    const deps = from.columns.filter((c) => c.type === 'dependency');
    if (deps.length) {
      const moved = new Set(movedIds);
      const left = await db.prepare('SELECT id, values_json FROM items WHERE board_id = ?').bind(sb.id).all<{ id: string; values_json: string }>();
      const fix: D1PreparedStatement[] = [];
      for (const r of left.results) {
        const v = parseJson<Record<string, unknown>>(r.values_json, {});
        let changed = false;
        for (const c of deps) {
          const list = Array.isArray(v[c.id]) ? (v[c.id] as string[]) : null;
          if (!list || !list.some((i) => moved.has(i))) continue;
          const kept = list.filter((i) => !moved.has(i));
          if (kept.length) v[c.id] = kept;
          else delete v[c.id];
          changed = true;
        }
        if (changed) fix.push(db.prepare('UPDATE items SET values_json = ? WHERE id = ? AND board_id = ?').bind(JSON.stringify(v), r.id, sb.id));
      }
      for (let i = 0; i < fix.length; i += 50) await db.batch(fix.slice(i, i + 50));
    }
    svc.waitUntil(broadcast(svc.env, sb.id, { kind: 'items_moved_out', actorId: actor, itemIds: movedIds }));
    svc.waitUntil(broadcast(svc.env, tb.id, { kind: 'items_moved_in', actorId: actor, itemIds: movedIds }));
  }
  result.moved = result.tasks.filter((t) => t.ok && t.newKey).length;
  return result;
}

/** The rows of the selected tasks in the project, or 404 when one is not there. */
export async function loadSelected(db: D1Database, board: BoardRow, itemIds: string[]): Promise<ItemRow[]> {
  const unique = [...new Set(itemIds)];
  if (!unique.length) throw badRequest('Select at least one task.');
  if (unique.length > MAX_TRANSFER) throw badRequest(`Move at most ${MAX_TRANSFER} tasks at a time.`);
  const rows = await selectIn<ItemRow>(db, (ph) => `SELECT * FROM items WHERE board_id = ? AND id IN (${ph})`, unique, [board.id]);
  if (rows.length !== unique.length) throw new HttpError(404, 'One or more tasks were not found in this project.');
  return rows.sort((a, b) => (a.group_id === b.group_id ? a.position - b.position : a.group_id.localeCompare(b.group_id)));
}
