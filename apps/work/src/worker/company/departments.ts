// Departments of a company (/api/company/c/:company/departments). A department is made once, here, and appears in
// every tool the company runs (src/worker/company/sync.ts). Departments can sit under other departments, to any depth.
// Administrators manage them; a department's head may change who is in it (and in the departments under it).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, placeholders } from '../lib/util';
import { atLeast, coAuditStmt, requireCompany, type CompanyAccess } from './access';
import { syncDepartment, type DepartmentRow } from './sync';

export async function loadDepartments(db: D1Database, companyId: string): Promise<DepartmentRow[]> {
  return (await db.prepare('SELECT * FROM co_departments WHERE company_id = ? ORDER BY name COLLATE NOCASE').bind(companyId).all<DepartmentRow>()).results;
}

/** A department and every department above it, nearest first. */
export function lineage(depts: DepartmentRow[], id: string): DepartmentRow[] {
  const byId = new Map(depts.map((d) => [d.id, d]));
  const out: DepartmentRow[] = [];
  let cur = byId.get(id);
  const seen = new Set<string>();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    out.push(cur);
    cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
  }
  return out;
}

/** A department and every department under it. */
export function subtree(depts: DepartmentRow[], id: string): DepartmentRow[] {
  const out: DepartmentRow[] = [];
  const walk = (pid: string, depth: number) => {
    if (depth > 50) return;
    for (const d of depts) if (d.parent_id === pid) {
      out.push(d);
      walk(d.id, depth + 1);
    }
  };
  const self = depts.find((d) => d.id === id);
  if (self) out.push(self);
  walk(id, 0);
  return out;
}

/** Whether the caller heads this department or one above it. */
export function heads(a: Pick<CompanyAccess, 'userId'>, depts: DepartmentRow[], id: string): boolean {
  return lineage(depts, id).some((d) => d.head_id === a.userId && !d.archived_at);
}

async function assertMembers(db: D1Database, companyId: string, userIds: string[]) {
  if (!userIds.length) return;
  const rows = await db.prepare(`SELECT user_id FROM co_members WHERE company_id = ? AND user_id IN (${placeholders(userIds.length)})`).bind(companyId, ...userIds).all<{ user_id: string }>();
  if (rows.results.length !== new Set(userIds).size) throw new HttpError(400, 'Everyone in a department must be in the company');
}

export const departmentRoutes = new Hono<AppEnv>();

departmentRoutes.get('/', async (c) => {
  const a = await requireCompany(c);
  const depts = await loadDepartments(c.env.DB, a.companyId);
  const members = await c.env.DB.prepare('SELECT department_id, user_id FROM co_department_members WHERE company_id = ?').bind(a.companyId).all<{ department_id: string; user_id: string }>();
  const archived = c.req.query('archived') === '1';
  return c.json(
    depts
      .filter((d) => archived || !d.archived_at)
      .map((d) => ({
        id: d.id,
        parentId: d.parent_id,
        name: d.name,
        description: d.description,
        headId: d.head_id,
        memberIds: members.results.filter((m) => m.department_id === d.id).map((m) => m.user_id),
        archivedAt: d.archived_at,
        inTools: { tasks: !!d.pm_team_id, crm: !!d.crm_team_id, finance: !!d.fin_tracking_id },
        canManage: atLeast(a.role, 'admin'),
        canChangeMembers: atLeast(a.role, 'admin') || heads(a, depts, d.id),
      })),
  );
});

const deptSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional(),
  parentId: z.string().max(64).nullable().optional(),
  headId: z.string().max(64).nullable().optional(),
  memberIds: z.array(z.string().max(64)).max(500).optional(),
});

departmentRoutes.post('/', async (c) => {
  const a = await requireCompany(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, deptSchema);
  const depts = await loadDepartments(db, a.companyId);
  if (depts.filter((d) => !d.archived_at).length >= 200) throw new HttpError(400, 'A company can have up to 200 departments');
  if (depts.some((d) => !d.archived_at && d.name.toLowerCase() === input.name.toLowerCase() && (d.parent_id ?? null) === (input.parentId ?? null))) throw new HttpError(409, 'There is already a department with this name here');
  if (input.parentId && !depts.some((d) => d.id === input.parentId && !d.archived_at)) throw notFound('Parent department');
  const memberIds = Array.from(new Set([...(input.memberIds ?? []), ...(input.headId ? [input.headId] : [])]));
  await assertMembers(db, a.companyId, memberIds);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO co_departments (id, company_id, parent_id, name, description, head_id, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, input.parentId ?? null, input.name, input.description ?? '', input.headId ?? null, a.userId, t, t),
    ...memberIds.map((u) => db.prepare('INSERT INTO co_department_members (company_id, department_id, user_id, added_at) VALUES (?, ?, ?, ?)').bind(a.companyId, id, u, t)),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'department.created', targetType: 'department', targetId: id, metadata: { members: memberIds.length }, ip: clientIp(c) }),
  ]);
  await syncDepartment(db, a.tools, id);
  return c.json({ id }, 201);
});

departmentRoutes.patch('/:id', async (c) => {
  const a = await requireCompany(c, 'admin');
  const db = c.env.DB;
  const id = c.req.param('id');
  const depts = await loadDepartments(db, a.companyId);
  const d = depts.find((x) => x.id === id);
  if (!d) throw notFound('Department');
  const input = await body(c, deptSchema.partial().omit({ memberIds: true }));
  if (input.parentId !== undefined && input.parentId !== null) {
    if (!depts.some((x) => x.id === input.parentId && !x.archived_at)) throw notFound('Parent department');
    // A department cannot sit under itself or under one of its own departments.
    if (subtree(depts, id).some((x) => x.id === input.parentId)) throw new HttpError(400, 'A department cannot sit under itself or one of its own departments');
  }
  const stmts: D1PreparedStatement[] = [];
  if (input.headId) {
    await assertMembers(db, a.companyId, [input.headId]);
    stmts.push(db.prepare('INSERT OR IGNORE INTO co_department_members (company_id, department_id, user_id, added_at) VALUES (?, ?, ?, ?)').bind(a.companyId, id, input.headId, now()));
  }
  stmts.push(
    db
      .prepare('UPDATE co_departments SET name = ?, description = ?, parent_id = ?, head_id = ?, updated_at = ? WHERE id = ? AND company_id = ?')
      .bind(input.name ?? d.name, input.description ?? d.description, input.parentId !== undefined ? input.parentId : d.parent_id, input.headId !== undefined ? input.headId : d.head_id, now(), id, a.companyId),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'department.updated', targetType: 'department', targetId: id, ip: clientIp(c) }),
  );
  await db.batch(stmts);
  await syncDepartment(db, a.tools, id);
  return c.json({ ok: true });
});

/** Sets who is in a department. Administrators, and the head of the department or of one above it. */
departmentRoutes.put('/:id/members', async (c) => {
  const a = await requireCompany(c);
  const db = c.env.DB;
  const id = c.req.param('id');
  const depts = await loadDepartments(db, a.companyId);
  const d = depts.find((x) => x.id === id && !x.archived_at);
  if (!d) throw notFound('Department');
  if (!atLeast(a.role, 'admin') && !heads(a, depts, id)) throw new HttpError(403, 'Only administrators and the department’s head can change who is in it');
  const input = await body(c, z.object({ userIds: z.array(z.string().max(64)).max(500) }));
  const ids = Array.from(new Set([...input.userIds, ...(d.head_id ? [d.head_id] : [])]));
  await assertMembers(db, a.companyId, ids);
  const t = now();
  await db.batch([
    db.prepare(`DELETE FROM co_department_members WHERE department_id = ?${ids.length ? ` AND user_id NOT IN (${placeholders(ids.length)})` : ''}`).bind(id, ...ids),
    ...ids.map((u) => db.prepare('INSERT OR IGNORE INTO co_department_members (company_id, department_id, user_id, added_at) VALUES (?, ?, ?, ?)').bind(a.companyId, id, u, t)),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'department.members_set', targetType: 'department', targetId: id, metadata: { members: ids.length }, ip: clientIp(c) }),
  ]);
  await syncDepartment(db, a.tools, id);
  return c.json({ ok: true, memberIds: ids });
});

departmentRoutes.post('/:id/archive', async (c) => {
  const a = await requireCompany(c, 'admin');
  const db = c.env.DB;
  const id = c.req.param('id');
  const depts = await loadDepartments(db, a.companyId);
  const d = depts.find((x) => x.id === id && !x.archived_at);
  if (!d) throw notFound('Department');
  if (depts.some((x) => x.parent_id === id && !x.archived_at)) throw new HttpError(400, 'Move or archive the departments under it first');
  const t = now();
  await db.batch([
    db.prepare('UPDATE co_departments SET archived_at = ?, updated_at = ? WHERE id = ?').bind(t, t, id),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'department.archived', targetType: 'department', targetId: id, ip: clientIp(c) }),
  ]);
  await syncDepartment(db, a.tools, id);
  return c.json({ ok: true });
});

departmentRoutes.post('/:id/restore', async (c) => {
  const a = await requireCompany(c, 'admin');
  const db = c.env.DB;
  const id = c.req.param('id');
  const depts = await loadDepartments(db, a.companyId);
  const d = depts.find((x) => x.id === id && x.archived_at);
  if (!d) throw notFound('Department');
  const parentGone = d.parent_id && !depts.some((x) => x.id === d.parent_id && !x.archived_at);
  await db.batch([
    db.prepare('UPDATE co_departments SET archived_at = NULL, parent_id = ?, updated_at = ? WHERE id = ?').bind(parentGone ? null : d.parent_id, now(), id),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'department.restored', targetType: 'department', targetId: id, ip: clientIp(c) }),
  ]);
  await syncDepartment(db, a.tools, id);
  return c.json({ ok: true });
});
