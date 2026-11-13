// The control centre's numbers (/api/company/c/:company/overview): one view of the whole company and of each
// department, across Project Management, the CRM and Finance (src/worker/company/summary.ts computes them).
//
// Who sees which numbers. A figure from a tool is shown only to someone who could see it in that tool, using the
// tool's own permissions:
//   * Project Management: the company's owner and administrators, and the workspace's owners, administrators and
//     project managers.
//   * CRM: the company's owner and administrators, and anyone whose CRM role sees every deal.
//   * Finance: the company's owner, and anyone whose Finance role may view reports (custom role settings included).
// The head of a department sees that department's numbers (and those of the departments under it) in every tool the
// company runs: the owner's decision of 13 Nov 2026 ("department heads see numbers across tools").

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { requireCompany, type CompanyAccess, type ToolApp } from './access';
import { heads, loadDepartments, subtree } from './departments';
import { crmNumbers, financeNumbers, tasksNumbers } from './summary';
import { loadAccess as crmAccess } from '../crm/access';
import { hasPerm, loadAccess as finAccess } from '../fin/access';

async function seesAll(db: D1Database, a: CompanyAccess, app: ToolApp): Promise<boolean> {
  const id = a.tools[app];
  if (!id) return false;
  if (a.role === 'owner') return true;
  const user = { id: a.userId, name: a.userName };
  if (app === 'tasks') {
    if (a.role === 'admin') return true;
    const r = await db.prepare("SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ? AND status = 'active'").bind(id, a.userId).first<{ role: string }>();
    return !!r && ['owner', 'admin', 'project_manager'].includes(r.role);
  }
  if (app === 'crm') {
    if (a.role === 'admin') return true;
    try {
      return (await crmAccess(db, id, user)).perms.deals.view === 'all';
    } catch {
      return false;
    }
  }
  try {
    return hasPerm(await finAccess(db, id, user), 'reports', 'view');
  } catch {
    return false;
  }
}

export const overviewRoutes = new Hono<AppEnv>();

overviewRoutes.get('/', async (c) => {
  const a = await requireCompany(c);
  const db = c.env.DB;
  const tz = ({ ACT: 'Australia/Sydney', NSW: 'Australia/Sydney', VIC: 'Australia/Melbourne', TAS: 'Australia/Hobart', QLD: 'Australia/Brisbane', SA: 'Australia/Adelaide', NT: 'Australia/Darwin', WA: 'Australia/Perth' } as Record<string, string>)[a.company.state] ?? 'Australia/Sydney';
  const all = { tasks: await seesAll(db, a, 'tasks'), crm: await seesAll(db, a, 'crm'), finance: await seesAll(db, a, 'finance') };
  const company = {
    tasks: all.tasks && a.tools.tasks ? await tasksNumbers(db, a.tools.tasks, null, tz) : null,
    crm: all.crm && a.tools.crm ? await crmNumbers(db, a.tools.crm, null) : null,
    finance: all.finance && a.tools.finance ? await financeNumbers(db, a.tools.finance, null) : null,
  };
  const depts = (await loadDepartments(db, a.companyId)).filter((d) => !d.archived_at);
  const members = (await db.prepare('SELECT department_id, user_id FROM co_department_members WHERE company_id = ?').bind(a.companyId).all<{ department_id: string; user_id: string }>()).results;
  const departments = [];
  for (const d of depts.slice(0, 100)) {
    const tree = subtree(depts, d.id);
    const people = Array.from(new Set(members.filter((m) => tree.some((t) => t.id === m.department_id)).map((m) => m.user_id)));
    const head = heads(a, depts, d.id);
    const see = (app: ToolApp) => !!a.tools[app] && (all[app] || head);
    const tracking = tree.map((t) => t.fin_tracking_id).filter((x): x is string => !!x);
    departments.push({
      id: d.id,
      name: d.name,
      parentId: d.parent_id,
      headId: d.head_id,
      people: people.length,
      tasks: see('tasks') ? await tasksNumbers(db, a.tools.tasks!, people, tz) : null,
      crm: see('crm') ? await crmNumbers(db, a.tools.crm!, people) : null,
      finance: see('finance') && tracking.length ? await financeNumbers(db, a.tools.finance!, tracking) : null,
    });
  }
  return c.json({
    tools: { tasks: !!a.tools.tasks, crm: !!a.tools.crm, finance: !!a.tools.finance },
    seesAll: all,
    company,
    departments,
  });
});
