// Moving tasks to another project or company (services/item-transfer.ts; flag move_records, off;
// docs/platform/moving-records.md).
//
//   GET  /transfer/status?from=<board>           whether moving is on for the project's company
//   GET  /transfer/targets?from=<board>          where the person may move the project's tasks: by company, its projects
//                                                and their groups (only companies with the flag on, only projects where
//                                                the person may add tasks)
//   POST /boards/:id/items/transfer/preview      what a move would carry over and what it would not, task by task
//   POST /boards/:id/items/transfer              the move (one task or many; each with its subtasks)

import { Hono } from 'hono';
import { z } from 'zod';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, body } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { svcFromContext } from '../services/context';
import { loadBoardAuth, type BoardRow } from '../services/permissions';
import { projectCapsFor, requireProject } from '../services/access';
import { MAX_TRANSFER, loadSelected, moveOn, previewTransfer, transferItems, workspaceCompany } from '../services/item-transfer';
import { companiesFor } from '../system/system';

export const transferRoutes = new Hono<AppEnv>();

const input = z.object({
  itemIds: z.array(z.string().max(64)).min(1).max(MAX_TRANSFER),
  toBoardId: z.string().max(64),
  toGroupId: z.string().max(64).optional(),
});

/** An API token limited to one company may not move tasks out of it. */
async function tokenAllows(c: Context<AppEnv>, db: D1Database, boardId: string): Promise<void> {
  if (c.get('authKind') !== 'token') return;
  const scope = c.get('tokenScope');
  if (!scope?.companyId) return;
  const ws = await db.prepare('SELECT workspace_id FROM boards WHERE id = ?').bind(boardId).first<{ workspace_id: string }>();
  const company = ws ? await workspaceCompany(db, ws.workspace_id) : null;
  if (company !== scope.companyId) throw new HttpError(403, 'This API token is limited to one company, and that project is not in it.', { code: 'TOKEN_SCOPE' });
}

/** Whether tasks may be moved out of this project at all (the screens show the option only then). */
transferRoutes.get('/transfer/status', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const from = await loadBoardAuth(db, c.req.query('from') ?? '', user.id);
  if (!from) return c.json({ enabled: false });
  const company = await workspaceCompany(db, from.board.workspace_id);
  return c.json({ enabled: !!company && (await moveOn(db, company)) });
});

transferRoutes.get('/transfer/targets', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const fromId = c.req.query('from') ?? '';
  const from = fromId ? await loadBoardAuth(db, fromId, user.id) : null;
  if (fromId && !from) throw new HttpError(404, 'Project not found');
  const fromCompany = from ? await workspaceCompany(db, from.board.workspace_id) : null;
  const on = fromCompany ? await moveOn(db, fromCompany) : false;
  if (!on) return c.json({ enabled: false, companies: [] });
  const companies = await companiesFor(db, user);
  const fromDemo = companies.find((x) => x.id === fromCompany)?.kind === 'demo';
  const out: { id: string; name: string; kind: string; current: boolean; projects: { id: string; name: string; workspaceId: string; groups: { id: string; name: string }[] }[] }[] = [];
  for (const co of companies) {
    if ((co.kind === 'demo' || fromDemo) && co.id !== fromCompany) continue;
    if (co.id !== fromCompany && !(await moveOn(db, co.id))) continue;
    const projects: (typeof out)[number]['projects'] = [];
    for (const tool of co.tools.filter((t) => t.app === 'tasks')) {
      const boards = await db
        .prepare("SELECT * FROM boards WHERE workspace_id = ? AND archived_at IS NULL AND kind != 'template' ORDER BY position, name LIMIT 200")
        .bind(tool.id)
        .all<BoardRow>();
      for (const b of boards.results) {
        if (b.id === fromId) continue;
        const auth = await loadBoardAuth(db, b.id, user.id);
        if (!auth) continue;
        const caps = await projectCapsFor(db, auth, user.id);
        if (!caps.createTasks) continue;
        const groups = await db.prepare('SELECT id, name FROM groups WHERE board_id = ? AND archived_at IS NULL ORDER BY position').bind(b.id).all<{ id: string; name: string }>();
        if (!groups.results.length) continue;
        projects.push({ id: b.id, name: b.name, workspaceId: b.workspace_id, groups: groups.results });
      }
    }
    if (projects.length) out.push({ id: co.id, name: co.name, kind: co.kind, current: co.id === fromCompany, projects });
  }
  out.sort((a, b) => Number(b.current) - Number(a.current));
  return c.json({ enabled: true, companies: out });
});

async function load(c: Context<AppEnv>) {
  const user = c.get('user');
  const db = c.env.DB;
  const boardId = c.req.param('id') ?? '';
  const req = await body(c, input);
  await tokenAllows(c, db, req.toBoardId);
  const src = await requireProject(db, boardId, user.id, 'edit');
  const dst = await requireProject(db, req.toBoardId, user.id, 'view');
  const items = await loadSelected(db, src.board, req.itemIds);
  return { src, dst, items, groupId: req.toGroupId };
}

transferRoutes.post('/boards/:id/items/transfer/preview', async (c) => {
  const { src, dst, items, groupId } = await load(c);
  return c.json(await previewTransfer(svcFromContext(c), src, dst, items, groupId));
});

transferRoutes.post('/boards/:id/items/transfer', async (c) => {
  await rateLimit(c.env.DB, `transfer:${c.get('user').id}`, 30, 10 * 60_000);
  const { src, dst, items, groupId } = await load(c);
  const result = await transferItems(svcFromContext(c), src, dst, items, groupId);
  return c.json({ ok: result.tasks.every((t) => t.ok), ...result });
});
