// BIZOMAT System (owner, 14 Nov 2026): every tool a person uses, in one place, organised by company. Served by this app
// at bizomat.ai/system with the same accounts and session (migration 0016_system.sql).
//
// Companies. A registered company (co_companies) is used as it is, with each person's role in it. Every person also
// has a company of their own (sys_companies, in their own name, not registered): it holds the tools they own that no
// registered company runs. Its tools are worked out when asked, so a new or transferred tool is always in the right
// place and nothing is copied. A person sees:
//   * their registered companies (co_members) and their own company, with the tools in each that they are a member of;
//   * the companies of tools they were added to directly ("shared with you", role guest), with those tools only.
// The System never gives access to anything: every tool keeps its own members and permissions, and a figure from a
// tool is shown only to someone whose role in that tool may see it (the rules of company/overview.ts).
//
// CAD Automation reports each of its accounts (sys_cad_status). In a company, its owner and administrators see the CAD
// computers, jobs and assistants of the company's people; every other person sees only their own. A report is matched
// to a person by their BIZOMAT account id, or by their confirmed email when CAD Automation has proven it too.
import type { AuthUser } from '../env';
import { newId, now, notFound, parseJson, placeholders } from '../lib/util';
import { crmNumbers, financeNumbers, tasksNumbers, type CrmNumbers, type FinanceNumbers, type TasksNumbers } from '../company/summary';
import { loadAccess as crmAccess } from '../crm/access';
import { hasPerm, loadAccess as finAccess } from '../fin/access';

export type SysApp = 'tasks' | 'crm' | 'finance';
export const SYS_APPS: SysApp[] = ['tasks', 'crm', 'finance'];
export type SysRole = 'owner' | 'admin' | 'member' | 'guest';
export type SysKind = 'registered' | 'own';

export interface SysTool {
  app: SysApp;
  id: string;
  name: string;
  /** The person's role in the tool itself. */
  role: string;
  /** Finance workspaces: personal, household or business. */
  kind?: string;
  /** Where the tool opens, on this site. */
  url: string;
}

export interface SysCompany {
  id: string;
  kind: SysKind;
  name: string;
  role: SysRole;
  /** Registered companies: what the registration checks found (never more than that). */
  registration?: { abnStatus: string; emailConfirmed: boolean; suspended: boolean };
  tools: SysTool[];
}

const TOOL_URL: Record<SysApp, (id: string) => string> = {
  tasks: (id) => `/tasks/w/${id}/home`,
  crm: (id) => `/crm/o/${id}/overview`,
  finance: (id) => `/finance/o/${id}/dashboard`,
};

const ownName = (u: { name?: string | null; email?: string | null }) => (u.name ?? '').trim().slice(0, 100) || (u.email ?? '').split('@')[0] || 'My company';

/** The person's own company (made on first use). Returns its id. */
export async function ensureOwnCompany(db: D1Database, user: { id: string; name?: string | null; email?: string | null }, via: 'visit' | 'backfill' = 'visit'): Promise<string> {
  const have = await db.prepare('SELECT id FROM sys_companies WHERE owner_id = ?').bind(user.id).first<{ id: string }>();
  if (have) return have.id;
  const t = now();
  await db.prepare('INSERT OR IGNORE INTO sys_companies (id, owner_id, name, created_via, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), user.id, ownName(user), via, t, t).run();
  const row = await db.prepare('SELECT id FROM sys_companies WHERE owner_id = ?').bind(user.id).first<{ id: string }>();
  return row!.id;
}

/** A company of their own for every active account that has none yet, up to `limit` a call. Returns how many were made. */
export async function backfillOwnCompanies(db: D1Database, limit = 500): Promise<number> {
  const rows = await db
    .prepare('SELECT u.id, u.name, u.email FROM users u LEFT JOIN sys_companies s ON s.owner_id = u.id WHERE s.id IS NULL AND u.disabled_at IS NULL ORDER BY u.created_at LIMIT ?')
    .bind(limit)
    .all<{ id: string; name: string; email: string }>();
  for (const u of rows.results) await ensureOwnCompany(db, u, 'backfill');
  return rows.results.length;
}

interface MemberTool extends SysTool {
  /** The registered company that runs it, else ''. */
  companyId: string;
  /** Who owns it (for tools no registered company runs). */
  ownerId: string;
}

/** Every tool the person is an active member of, with the company that holds it. */
async function memberTools(db: D1Database, userId: string): Promise<MemberTool[]> {
  const [ws, crm, fin] = await db.batch([
    db.prepare(
      `SELECT w.id, w.name, m.role,
              (SELECT o.user_id FROM workspace_members o WHERE o.workspace_id = w.id AND o.role = 'owner' ORDER BY o.joined_at LIMIT 1) AS owner_id
         FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id
        WHERE m.user_id = ? AND m.status = 'active' AND w.deleted_at IS NULL ORDER BY w.name`,
    ).bind(userId),
    db.prepare(
      `SELECT o.id, o.name, m.role,
              (SELECT x.user_id FROM crm_members x WHERE x.org_id = o.id AND x.role = 'owner' ORDER BY x.joined_at LIMIT 1) AS owner_id
         FROM crm_members m JOIN crm_orgs o ON o.id = m.org_id WHERE m.user_id = ? AND o.deleted_at IS NULL ORDER BY o.name`,
    ).bind(userId),
    db.prepare(
      `SELECT o.id, o.name, o.kind, m.role,
              (SELECT x.user_id FROM fin_members x WHERE x.org_id = o.id AND x.role = 'owner' ORDER BY x.joined_at LIMIT 1) AS owner_id
         FROM fin_members m JOIN fin_orgs o ON o.id = m.org_id WHERE m.user_id = ? AND o.deleted_at IS NULL ORDER BY o.name`,
    ).bind(userId),
  ]);
  const tools: MemberTool[] = [];
  const add = (app: SysApp, rows: any[]) => {
    for (const r of rows) tools.push({ app, id: r.id, name: r.name, role: r.role, kind: r.kind ?? undefined, url: TOOL_URL[app](r.id), companyId: '', ownerId: r.owner_id ?? '' });
  };
  add('tasks', ws.results as any[]);
  add('crm', crm.results as any[]);
  add('finance', fin.results as any[]);
  if (!tools.length) return tools;
  const links = await db
    .prepare(`SELECT t.app, t.ref_id, t.company_id FROM co_tools t JOIN co_companies co ON co.id = t.company_id AND co.deleted_at IS NULL WHERE t.ref_id IN (${placeholders(tools.length)})`)
    .bind(...tools.map((t) => t.id))
    .all<{ app: string; ref_id: string; company_id: string }>();
  for (const l of links.results) {
    const t = tools.find((x) => x.app === l.app && x.id === l.ref_id);
    if (t) t.companyId = l.company_id;
  }
  return tools;
}

/** The companies a person sees in the System, each with the tools in it they are a member of. */
export async function companiesFor(db: D1Database, user: AuthUser): Promise<SysCompany[]> {
  const ownId = await ensureOwnCompany(db, user);
  const [tools, memberships] = await Promise.all([
    memberTools(db, user.id),
    db
      .prepare(
        `SELECT co.id, co.name, co.abn_status, co.email_verified_at, co.suspended_at, m.role FROM co_members m
           JOIN co_companies co ON co.id = m.company_id WHERE m.user_id = ? AND co.deleted_at IS NULL ORDER BY co.name`,
      )
      .bind(user.id)
      .all<{ id: string; name: string; abn_status: string; email_verified_at: number | null; suspended_at: number | null; role: SysRole }>(),
  ]);
  const out = new Map<string, SysCompany>();
  const registered = (r: { id: string; name: string; abn_status: string; email_verified_at: number | null; suspended_at: number | null }, role: SysRole): SysCompany => ({
    id: r.id,
    kind: 'registered',
    name: r.name,
    role,
    registration: { abnStatus: r.abn_status, emailConfirmed: !!r.email_verified_at, suspended: !!r.suspended_at },
    tools: [],
  });
  for (const r of memberships.results) out.set(r.id, registered(r, r.role));
  const own = await db.prepare('SELECT id, name FROM sys_companies WHERE id = ?').bind(ownId).first<{ id: string; name: string }>();
  out.set(ownId, { id: ownId, kind: 'own', name: own!.name, role: 'owner', tools: [] });

  // Tools no registered company runs belong to their owner's own company.
  const owners = [...new Set(tools.filter((t) => !t.companyId && t.ownerId && t.ownerId !== user.id).map((t) => t.ownerId))];
  const ownerCompany = new Map<string, { id: string; name: string }>([[user.id, { id: ownId, name: own!.name }]]);
  if (owners.length) {
    const rows = await db.prepare(`SELECT id, name, email FROM users WHERE id IN (${placeholders(owners.length)})`).bind(...owners).all<{ id: string; name: string; email: string }>();
    for (const u of rows.results) {
      const id = await ensureOwnCompany(db, u, 'backfill');
      const c = await db.prepare('SELECT name FROM sys_companies WHERE id = ?').bind(id).first<{ name: string }>();
      ownerCompany.set(u.id, { id, name: c!.name });
    }
  }
  const unknownRegistered = [...new Set(tools.filter((t) => t.companyId && !out.has(t.companyId)).map((t) => t.companyId))];
  if (unknownRegistered.length) {
    const rows = await db
      .prepare(`SELECT id, name, abn_status, email_verified_at, suspended_at FROM co_companies WHERE id IN (${placeholders(unknownRegistered.length)})`)
      .bind(...unknownRegistered)
      .all<{ id: string; name: string; abn_status: string; email_verified_at: number | null; suspended_at: number | null }>();
    for (const r of rows.results) out.set(r.id, registered(r, 'guest'));
  }
  for (const t of tools) {
    let holder = t.companyId ? out.get(t.companyId) : undefined;
    if (!holder) {
      const oc = ownerCompany.get(t.ownerId || user.id) ?? ownerCompany.get(user.id)!;
      holder = out.get(oc.id) ?? { id: oc.id, kind: 'own', name: oc.name, role: 'guest', tools: [] };
      out.set(oc.id, holder);
    }
    const { companyId: _c, ownerId: _o, ...tool } = t;
    holder.tools.push(tool);
  }
  const rank = (c: SysCompany) => (c.role === 'guest' ? 2 : c.kind === 'registered' ? 0 : 1);
  return [...out.values()].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

/** One company as the person sees it, or 404 (also for a company they have nothing in). */
export async function companyFor(db: D1Database, user: AuthUser, id: string): Promise<SysCompany> {
  const found = (await companiesFor(db, user)).find((c) => c.id === id);
  if (!found) throw notFound('Company');
  return found;
}

export type ToolNumbers = { app: 'tasks'; numbers: TasksNumbers } | { app: 'crm'; numbers: CrmNumbers } | { app: 'finance'; numbers: FinanceNumbers };

/** A tool's figures for the person, when their role in that tool may see them (the rules of company/overview.ts). */
export async function toolNumbers(db: D1Database, user: AuthUser, tool: SysTool): Promise<ToolNumbers['numbers'] | null> {
  const who = { id: user.id, name: user.name };
  try {
    if (tool.app === 'tasks') return ['owner', 'admin', 'project_manager'].includes(tool.role) ? await tasksNumbers(db, tool.id, null) : null;
    if (tool.app === 'crm') return (await crmAccess(db, tool.id, who)).perms.deals.view === 'all' ? await crmNumbers(db, tool.id, null) : null;
    return hasPerm(await finAccess(db, tool.id, who), 'reports', 'view') ? await financeNumbers(db, tool.id, null) : null;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ CAD Automation

export interface CadComputer {
  name: string;
  online: boolean;
  solidworks?: string;
  addin?: string;
  lastSeen?: number | null;
  open?: string;
}
export interface CadJob {
  id: string;
  tool: string;
  status: string;
  at: number;
}
export interface CadAssistant {
  app: string;
  connectedAt?: number | null;
  lastUsed?: number | null;
}
export interface CadPerson {
  userId: string;
  name: string;
  email: string;
  emailConfirmed: boolean;
  status: { computers: CadComputer[]; jobs: CadJob[]; assistants: CadAssistant[]; reportedAt: number } | null;
}

/**
 * The CAD Automation status the person may see in this company: everyone's for the owner and administrators of a
 * registered company, and the person's own in every other case. Nothing for a company they only share a tool with.
 */
export async function cadFor(db: D1Database, user: AuthUser, company: SysCompany): Promise<{ scope: 'company' | 'self' | 'none'; people: CadPerson[] }> {
  if (company.role === 'guest') return { scope: 'none', people: [] };
  const everyone = company.kind === 'registered' && (company.role === 'owner' || company.role === 'admin');
  const ids = everyone
    ? (await db.prepare('SELECT user_id FROM co_members WHERE company_id = ?').bind(company.id).all<{ user_id: string }>()).results.map((r) => r.user_id)
    : [user.id];
  if (!ids.length) return { scope: everyone ? 'company' : 'self', people: [] };
  const people = await db
    .prepare(`SELECT id, name, email, email_verified_at FROM users WHERE id IN (${placeholders(ids.length)}) AND disabled_at IS NULL ORDER BY name`)
    .bind(...ids)
    .all<{ id: string; name: string; email: string; email_verified_at: number | null }>();
  const out: CadPerson[] = [];
  for (const p of people.results) {
    // A report counts for a person by their BIZOMAT account id, or by an email both sides have confirmed.
    const row = await db
      .prepare(
        `SELECT * FROM sys_cad_status WHERE bizomat_sub = ? OR (email = ? AND email_verified = 1 AND ? = 1) ORDER BY (bizomat_sub = ?) DESC, reported_at DESC LIMIT 1`,
      )
      .bind(p.id, p.email, p.email_verified_at ? 1 : 0, p.id)
      .first<{ computers_json: string; jobs_json: string; assistants_json: string; reported_at: number }>();
    out.push({
      userId: p.id,
      name: p.name,
      email: p.email,
      emailConfirmed: !!p.email_verified_at,
      status: row
        ? {
            computers: parseJson<CadComputer[]>(row.computers_json, []),
            jobs: parseJson<CadJob[]>(row.jobs_json, []),
            assistants: parseJson<CadAssistant[]>(row.assistants_json, []),
            reportedAt: row.reported_at,
          }
        : null,
    });
  }
  return { scope: everyone ? 'company' : 'self', people: out };
}
