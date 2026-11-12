// Permanent task keys: PREFIX-0001. Allocation is concurrency-safe: a single atomic
// `UPDATE boards SET task_seq = task_seq + n ... RETURNING task_seq` hands out a block of numbers, and the counter only
// ever increases, so two requests never get the same number and a deleted task's number is never reused. A key is
// written once (`WHERE task_key IS NULL`) and never changes when the task is renamed, moved or the prefix changes.

import { PREFIX_RE, formatTaskKey } from '../../../shared/schedule';

/** A prefix from the project name: "Laser installation" -> LASER, "CNC line 2" -> CNC. */
export function suggestPrefix(name: string): string {
  const words = name
    .toUpperCase()
    .normalize('NFKD')
    .replace(/[^A-Z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const first = words.find((w) => /^[A-Z]/.test(w)) ?? '';
  let p = first.length >= 3 ? first.slice(0, 6) : words.map((w) => w[0]).join('').slice(0, 6);
  if (!/^[A-Z]/.test(p)) p = 'TASK';
  if (p.length < 2) p = (p + 'X').slice(0, 2);
  return PREFIX_RE.test(p) ? p : 'TASK';
}

/** Whether another project in the organisation uses or used this prefix (keys stay unique per organisation). */
export async function prefixTaken(db: D1Database, workspaceId: string, prefix: string, exceptBoardId: string): Promise<boolean> {
  const board = await db.prepare('SELECT 1 FROM boards WHERE workspace_id = ? AND task_prefix = ? AND id != ?').bind(workspaceId, prefix, exceptBoardId).first();
  if (board) return true;
  const used = await db.prepare("SELECT 1 FROM items WHERE workspace_id = ? AND board_id != ? AND task_key LIKE ? || '-%' LIMIT 1").bind(workspaceId, exceptBoardId, prefix).first();
  return !!used;
}

async function choosePrefix(db: D1Database, board: { id: string; workspace_id: string; name: string }): Promise<string> {
  const base = suggestPrefix(board.name).slice(0, 8);
  for (let i = 0; i < 50; i++) {
    const p = i === 0 ? base : `${base}${i + 1}`;
    if (!(await prefixTaken(db, board.workspace_id, p, board.id))) return p;
  }
  return `${base.slice(0, 4)}${Date.now().toString(36).toUpperCase().slice(-5)}`;
}

/** The project's prefix, choosing one the first time (only one request can set it). */
export async function ensurePrefix(db: D1Database, board: { id: string; workspace_id: string; name: string }): Promise<string> {
  const cur = await db.prepare('SELECT task_prefix FROM boards WHERE id = ?').bind(board.id).first<{ task_prefix: string | null }>();
  if (cur?.task_prefix) return cur.task_prefix;
  const p = await choosePrefix(db, board);
  await db.prepare('UPDATE boards SET task_prefix = ? WHERE id = ? AND task_prefix IS NULL').bind(p, board.id).run();
  const after = await db.prepare('SELECT task_prefix FROM boards WHERE id = ?').bind(board.id).first<{ task_prefix: string }>();
  return after!.task_prefix;
}

/** Reserves `n` numbers; returns the first. */
async function reserve(db: D1Database, boardId: string, n: number): Promise<number> {
  const r = await db.prepare('UPDATE boards SET task_seq = task_seq + ? WHERE id = ? RETURNING task_seq').bind(n, boardId).first<{ task_seq: number }>();
  if (!r) throw new Error('Project not found');
  return r.task_seq - n + 1;
}

/** A key for a task about to be created. */
export async function allocateTaskKey(db: D1Database, board: { id: string; workspace_id: string; name: string }): Promise<{ number: number; key: string }> {
  const prefix = await ensurePrefix(db, board);
  const n = await reserve(db, board.id, 1);
  return { number: n, key: formatTaskKey(prefix, n) };
}

/**
 * Gives a key to every task of the project that has none (tasks from before keys existed, copies of boards and
 * templates), oldest first. Cheap when there is nothing to do: one indexed count.
 */
export async function ensureTaskKeys(db: D1Database, board: { id: string; workspace_id: string; name: string }): Promise<number> {
  const missing = await db.prepare('SELECT id FROM items WHERE board_id = ? AND task_key IS NULL ORDER BY created_at, position, id').bind(board.id).all<{ id: string }>();
  if (!missing.results.length) return 0;
  const prefix = await ensurePrefix(db, board);
  const first = await reserve(db, board.id, missing.results.length);
  const stmts = missing.results.map((r, i) => db.prepare('UPDATE items SET task_number = ?, task_key = ? WHERE id = ? AND task_key IS NULL').bind(first + i, formatTaskKey(prefix, first + i), r.id));
  for (let i = 0; i < stmts.length; i += 100) await db.batch(stmts.slice(i, i + 100));
  return missing.results.length;
}
