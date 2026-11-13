// Keeps the tools a company runs in step with the company (src/worker/company/routes.ts):
//
//   * People: a member's role in each tool (co_members.tasks_role, crm_role, fin_role) is written to that tool's
//     members table; no role means the person is taken out of that tool (as the tool's own "remove member" does). A
//     tool's owner is never changed or removed here, and people who joined a tool directly (not through the company)
//     are left alone.
//   * Departments: each department is a team in Project Management (teams, team_members), a team in the CRM
//     (crm_teams, crm_team_members, its lead the department head) and a department in Finance's tracking (fin_tracking,
//     kind 'department'). Team members are the department's members who have that tool. An archived department's teams
//     are removed; its Finance department is archived, never deleted, because posted journal lines keep pointing at it.

import { newId, now, placeholders } from '../lib/util';
import type { CrmRole, FinRole, MemberRow, TasksRole, ToolApp } from './access';

export interface ToolRoles {
  tasks: TasksRole | null;
  crm: CrmRole | null;
  finance: FinRole | null;
}

/** The statements that give a person their roles in the company's tools (and take away the tools without a role). */
export function memberToolStmts(db: D1Database, tools: Partial<Record<ToolApp, string>>, userId: string, roles: ToolRoles, invitedBy: string | null): D1PreparedStatement[] {
  const t = now();
  const out: D1PreparedStatement[] = [];
  if (tools.tasks) {
    const ws = tools.tasks;
    if (roles.tasks && roles.tasks !== 'owner') {
      out.push(
        db
          .prepare(
            `INSERT INTO workspace_members (workspace_id, user_id, role, joined_at, status, invited_by) VALUES (?, ?, ?, ?, 'active', ?)
             ON CONFLICT(workspace_id, user_id) DO UPDATE SET role = excluded.role WHERE workspace_members.role != 'owner'`,
          )
          .bind(ws, userId, roles.tasks, t, invitedBy),
      );
    } else if (!roles.tasks) {
      // As Project Management's own "remove member" (src/worker/routes/org.ts), never for an owner.
      const notOwner = `AND NOT EXISTS (SELECT 1 FROM workspace_members o WHERE o.workspace_id = ? AND o.user_id = ? AND o.role = 'owner')`;
      for (const table of ['board_members', 'board_permissions', 'item_permissions', 'team_members', 'document_members']) {
        out.push(db.prepare(`DELETE FROM ${table} WHERE workspace_id = ? AND user_id = ? ${notOwner}`).bind(ws, userId, ws, userId));
      }
      out.push(db.prepare("DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ? AND role != 'owner'").bind(ws, userId));
    }
  }
  if (tools.crm) {
    const org = tools.crm;
    if (roles.crm && roles.crm !== 'owner') {
      out.push(
        db
          .prepare(`INSERT INTO crm_members (org_id, user_id, role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(org_id, user_id) DO UPDATE SET role = excluded.role WHERE crm_members.role != 'owner'`)
          .bind(org, userId, roles.crm, invitedBy, t),
      );
    } else if (!roles.crm) {
      out.push(db.prepare("DELETE FROM crm_calendar_feeds WHERE org_id = ? AND user_id = ? AND NOT EXISTS (SELECT 1 FROM crm_members o WHERE o.org_id = ? AND o.user_id = ? AND o.role = 'owner')").bind(org, userId, org, userId));
      out.push(db.prepare("DELETE FROM crm_members WHERE org_id = ? AND user_id = ? AND role != 'owner'").bind(org, userId));
    }
  }
  if (tools.finance) {
    const org = tools.finance;
    if (roles.finance && roles.finance !== 'owner') {
      out.push(
        db
          .prepare(`INSERT INTO fin_members (org_id, user_id, role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(org_id, user_id) DO UPDATE SET role = excluded.role WHERE fin_members.role != 'owner'`)
          .bind(org, userId, roles.finance, invitedBy, t),
      );
    } else if (!roles.finance) {
      out.push(db.prepare("DELETE FROM fin_members WHERE org_id = ? AND user_id = ? AND role != 'owner'").bind(org, userId));
    }
  }
  return out;
}

export const rolesOf = (m: Pick<MemberRow, 'tasks_role' | 'crm_role' | 'fin_role'>): ToolRoles => ({ tasks: m.tasks_role, crm: m.crm_role, finance: m.fin_role });

export interface DepartmentRow {
  id: string;
  company_id: string;
  parent_id: string | null;
  name: string;
  description: string;
  head_id: string | null;
  pm_team_id: string | null;
  crm_team_id: string | null;
  fin_tracking_id: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
}

/** The people of a department who are members of a tool (by the tool's own members table). */
async function inTool(db: D1Database, table: 'workspace_members' | 'crm_members' | 'fin_members', key: 'workspace_id' | 'org_id', toolId: string, userIds: string[]): Promise<string[]> {
  if (!userIds.length) return [];
  const rows = await db.prepare(`SELECT user_id FROM ${table} WHERE ${key} = ? AND user_id IN (${placeholders(userIds.length)})`).bind(toolId, ...userIds).all<{ user_id: string }>();
  return rows.results.map((r) => r.user_id);
}

/**
 * Brings a department's teams in the tools in line with the department: creates the team (or Finance department)
 * when it is missing, renames it, and sets its members. Safe to run any number of times.
 */
export async function syncDepartment(db: D1Database, tools: Partial<Record<ToolApp, string>>, deptId: string): Promise<void> {
  const d = await db.prepare('SELECT * FROM co_departments WHERE id = ?').bind(deptId).first<DepartmentRow>();
  if (!d) return;
  const t = now();
  const members = (await db.prepare('SELECT user_id FROM co_department_members WHERE department_id = ?').bind(deptId).all<{ user_id: string }>()).results.map((r) => r.user_id);
  const stmts: D1PreparedStatement[] = [];
  const set: Record<string, string | null> = {};

  if (tools.tasks) {
    const ws = tools.tasks;
    let teamId = d.pm_team_id;
    if (teamId && !(await db.prepare('SELECT 1 FROM teams WHERE id = ? AND workspace_id = ?').bind(teamId, ws).first())) teamId = null;
    if (d.archived_at) {
      if (teamId) stmts.push(db.prepare('DELETE FROM teams WHERE id = ? AND workspace_id = ?').bind(teamId, ws));
      set.pm_team_id = null;
    } else {
      if (!teamId) {
        teamId = newId();
        stmts.push(db.prepare("INSERT INTO teams (id, workspace_id, name, description, color, created_at) VALUES (?, ?, ?, ?, '#0f766e', ?)").bind(teamId, ws, d.name, d.description, t));
        set.pm_team_id = teamId;
      } else stmts.push(db.prepare('UPDATE teams SET name = ?, description = ? WHERE id = ? AND workspace_id = ?').bind(d.name, d.description, teamId, ws));
      const ids = await inTool(db, 'workspace_members', 'workspace_id', ws, members);
      stmts.push(db.prepare(`DELETE FROM team_members WHERE team_id = ?${ids.length ? ` AND user_id NOT IN (${placeholders(ids.length)})` : ''}`).bind(teamId, ...ids));
      for (const uid of ids) stmts.push(db.prepare('INSERT OR IGNORE INTO team_members (team_id, workspace_id, user_id) VALUES (?, ?, ?)').bind(teamId, ws, uid));
    }
  }

  if (tools.crm) {
    const org = tools.crm;
    let teamId = d.crm_team_id;
    if (teamId && !(await db.prepare('SELECT 1 FROM crm_teams WHERE id = ? AND org_id = ?').bind(teamId, org).first())) teamId = null;
    if (d.archived_at) {
      if (teamId) stmts.push(db.prepare('DELETE FROM crm_teams WHERE id = ? AND org_id = ?').bind(teamId, org));
      set.crm_team_id = null;
    } else {
      const ids = await inTool(db, 'crm_members', 'org_id', org, members);
      const lead = d.head_id && (await inTool(db, 'crm_members', 'org_id', org, [d.head_id])).length ? d.head_id : null;
      if (!teamId) {
        teamId = newId();
        stmts.push(db.prepare('INSERT INTO crm_teams (id, org_id, name, description, lead_id, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(teamId, org, d.name, d.description, lead, t));
        set.crm_team_id = teamId;
      } else stmts.push(db.prepare('UPDATE crm_teams SET name = ?, description = ?, lead_id = ? WHERE id = ? AND org_id = ?').bind(d.name, d.description, lead, teamId, org));
      stmts.push(db.prepare(`DELETE FROM crm_team_members WHERE team_id = ?${ids.length ? ` AND user_id NOT IN (${placeholders(ids.length)})` : ''}`).bind(teamId, ...ids));
      for (const uid of ids) stmts.push(db.prepare('INSERT OR IGNORE INTO crm_team_members (org_id, team_id, user_id) VALUES (?, ?, ?)').bind(org, teamId, uid));
    }
  }

  if (tools.finance) {
    const org = tools.finance;
    let trackId = d.fin_tracking_id;
    if (trackId && !(await db.prepare("SELECT 1 FROM fin_tracking WHERE id = ? AND org_id = ? AND kind = 'department'").bind(trackId, org).first())) trackId = null;
    if (!trackId && !d.archived_at) {
      trackId = newId();
      stmts.push(db.prepare("INSERT INTO fin_tracking (id, org_id, kind, name, code, created_at) VALUES (?, ?, 'department', ?, '', ?)").bind(trackId, org, d.name, t));
      set.fin_tracking_id = trackId;
    } else if (trackId) {
      stmts.push(db.prepare('UPDATE fin_tracking SET name = ?, archived_at = ? WHERE id = ? AND org_id = ?').bind(d.name, d.archived_at ? (d.archived_at ?? t) : null, trackId, org));
    }
  }

  const cols = Object.keys(set);
  if (cols.length) stmts.push(db.prepare(`UPDATE co_departments SET ${cols.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`).bind(...cols.map((k) => set[k]), deptId));
  if (stmts.length) await db.batch(stmts);
}

/** Every department of a company, after its people or tools changed. */
export async function syncAllDepartments(db: D1Database, tools: Partial<Record<ToolApp, string>>, companyId: string): Promise<void> {
  const rows = await db.prepare('SELECT id FROM co_departments WHERE company_id = ?').bind(companyId).all<{ id: string }>();
  for (const r of rows.results) await syncDepartment(db, tools, r.id);
}

/** The departments of a person's company they belong to, re-synced (after their tool roles changed). */
export async function syncDepartmentsOf(db: D1Database, tools: Partial<Record<ToolApp, string>>, companyId: string, userId: string): Promise<void> {
  const rows = await db.prepare('SELECT department_id FROM co_department_members WHERE company_id = ? AND user_id = ?').bind(companyId, userId).all<{ department_id: string }>();
  for (const r of rows.results) await syncDepartment(db, tools, r.department_id);
}
