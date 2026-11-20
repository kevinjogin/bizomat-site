// What every move between companies shares (docs/platform/moving-records.md; flag move_records, off): the company a tool
// belongs to, whether moving is on for it, the example company's rule, and a company's member rules. Used by moving tasks
// (services/item-transfer.ts) and CRM records (crm/transfer.ts).

import { HttpError } from '../lib/util';
import { flagOn, moduleEnabled, type ModuleKey } from './flags';
import { companyOfTool, type ToolApp } from './context';
import { ensureOwnCompany } from '../system/system';
import { loadMemberAccess, membersV2, roleAllows, type MemberModule } from '../company/members-access';

const OWNER_SQL: Record<ToolApp, string> = {
  tasks: "SELECT u.id, u.name, u.email FROM workspace_members m JOIN users u ON u.id = m.user_id WHERE m.workspace_id = ? AND m.role = 'owner' ORDER BY m.joined_at LIMIT 1",
  crm: "SELECT u.id, u.name, u.email FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND m.role = 'owner' ORDER BY m.joined_at LIMIT 1",
  finance: "SELECT u.id, u.name, u.email FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND m.role = 'owner' ORDER BY m.joined_at LIMIT 1",
};

/** The company a tool belongs to. A tool of no registered company belongs to its owner's own company, made here if the
 * owner has not opened the ERP yet (as system/system.ts does on a first visit). */
export async function toolCompany(db: D1Database, app: ToolApp, id: string): Promise<string | null> {
  const found = await companyOfTool(db, app, id);
  if (found) return found;
  const owner = await db.prepare(OWNER_SQL[app]).bind(id).first<{ id: string; name: string; email: string }>();
  if (!owner) return null;
  await ensureOwnCompany(db, owner, 'backfill');
  return companyOfTool(db, app, id);
}

export async function isDemoCompany(db: D1Database, companyId: string): Promise<boolean> {
  return !!(await db.prepare("SELECT 1 FROM sys_demo WHERE company_id = ? AND status <> 'removed'").bind(companyId).first());
}

/** Whether records may be moved from or to a company: the flag on for it, and the module not switched off there. */
export async function moveOn(db: D1Database, companyId: string, module: ModuleKey): Promise<boolean> {
  try {
    return (await flagOn(db, 'move_records', { companyId })) && (await moduleEnabled(db, module, companyId));
  } catch {
    return false;
  }
}

/** The flag for both companies, and the example company's invented data staying in it. */
export async function assertMoveAllowed(db: D1Database, from: string, to: string, module: ModuleKey, what: string): Promise<void> {
  if (!(await moveOn(db, from, module)) || !(await moveOn(db, to, module))) throw new HttpError(403, `Moving ${what} is not switched on for this company.`, { code: 'MOVE_OFF' });
  if (from !== to && ((await isDemoCompany(db, from)) || (await isDemoCompany(db, to)))) {
    throw new HttpError(403, 'The example company’s invented data stays in it, and nothing moves into it.', { code: 'MOVE_EXAMPLE' });
  }
}

/**
 * A company's member rules (company_members_v2), where they act, for both companies: no suspended access, the module
 * allowed, a role that may change records. In the company the records leave, a role that cannot delete records may move
 * only records the person created.
 */
export async function assertMemberRules(
  db: D1Database,
  userId: string,
  companies: { from: string; to: string },
  module: MemberModule,
  label: string,
  createdByOthers: boolean,
): Promise<void> {
  for (const companyId of companies.from === companies.to ? [companies.from] : [companies.from, companies.to]) {
    if (!(await membersV2(db, companyId))) continue;
    const a = await loadMemberAccess(db, companyId, userId);
    if (!a) continue;
    if (a.status === 'suspended') throw new HttpError(403, 'Your access to that company is suspended.', { code: 'MEMBER_SUSPENDED' });
    if (!a.modules[module].access) throw new HttpError(403, `You do not have access to ${label} in that company.`, { code: 'MODULE_ACCESS', module });
    if (!roleAllows(a.role, 'create_edit')) throw new HttpError(403, 'Your company role can view but not change anything.', { code: 'READ_ONLY' });
    if (companyId === companies.from && !roleAllows(a.role, 'delete') && createdByOthers) {
      throw new HttpError(403, 'Your company role can move only records you created.', { code: 'SCOPE', scope: 'own' });
    }
  }
}
