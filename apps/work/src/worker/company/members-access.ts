// The central permission service for a company's people (owner's brief of 19 Nov 2026, "Company members, roles and
// ownership transfer", Part 1; docs/platform/members.md). One place answers what a person may do in a company:
//
//   membership (active, not suspended) + company role + module access + record visibility scope + sensitive fields
//
// It acts only for a company where the flag company_members_v2 is on (off by default). It never widens access: a
// request must pass both this service (members-gate.ts) and the module's own checks, which stay as they are (job roles
// in the ERP, Maintenance and WHS; tool roles in Projects, CRM and Finance). Owner and administrators always have every
// module, every record and every field.

import { HttpError, now } from '../lib/util';
import { flagOn } from '../platform/flags';
import { type CompanyRole, normRole } from './access';

// ------------------------------------------------------------------ modules

/** The modules a member can be given (brief 1.2, mapped to the product's real modules: decision C3 of the audit). */
export const MEMBER_MODULES = [
  { key: 'projects', label: 'Projects and Tasks' },
  { key: 'crm', label: 'Sales and CRM' },
  { key: 'finance', label: 'Finance and Accounting' },
  { key: 'products', label: 'Products and Engineering' },
  { key: 'procurement', label: 'Procurement' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'manufacturing', label: 'Manufacturing' },
  { key: 'quality', label: 'Quality' },
  { key: 'supply_chain', label: 'Sales orders and logistics' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'whs', label: 'Health and Safety' },
  { key: 'reports', label: 'Reports' },
] as const;
export type MemberModule = (typeof MEMBER_MODULES)[number]['key'];
export const MEMBER_MODULE_KEYS = MEMBER_MODULES.map((m) => m.key) as MemberModule[];
export const isMemberModule = (m: string): m is MemberModule => (MEMBER_MODULE_KEYS as string[]).includes(m);

export const SCOPES = ['all', 'team', 'own'] as const;
export type Scope = (typeof SCOPES)[number];
export const SCOPE_LABELS: Record<Scope, string> = { all: 'All records', team: 'Team records', own: 'Own records' };

/**
 * Where "own" and "team" limit what a person sees. CRM and Finance keep an owner on every record and apply the scope
 * to lists and records. In the operational modules a record's job role decides who works on it (audit decision C1):
 * there the scope limits changing and deleting to records the person created, and seeing follows the job role.
 */
export const SCOPE_APPLIES: Record<MemberModule, 'records' | 'changes'> = {
  projects: 'changes',
  crm: 'records',
  finance: 'records',
  products: 'changes',
  procurement: 'changes',
  inventory: 'changes',
  manufacturing: 'changes',
  quality: 'changes',
  supply_chain: 'changes',
  maintenance: 'changes',
  whs: 'changes',
  reports: 'changes',
};

// ------------------------------------------------------------------ the role matrix

export const CAPABILITIES = [
  'view',
  'create_edit',
  'delete',
  'approve',
  'export',
  'sensitive',
  'invite',
  'manage_members',
  'manage_admins',
  'company_settings',
  'transfer_ownership',
  'delete_company',
] as const;
export type Capability = (typeof CAPABILITIES)[number];
/** true: allowed; false: refused; 'own': only records the person created or owns; 'config': set per member. */
export type Allow = boolean | 'own' | 'config';

export const CAPABILITY_LABELS: Record<Capability, string> = {
  view: 'View company data (allowed modules)',
  create_edit: 'Create and edit records',
  delete: 'Delete records',
  approve: 'Approve (orders, purchase orders and the like)',
  export: 'Export data',
  sensitive: 'View sensitive fields (costs, margins, rates, bank details)',
  invite: 'Invite members',
  manage_members: 'Manage managers, employees and read-only members',
  manage_admins: 'Grant or revoke the administrator role',
  company_settings: 'Company settings and legal details',
  transfer_ownership: 'Transfer ownership',
  delete_company: 'Delete or close the company',
};

/** The defaults of the brief's matrix (Part 1.1), kept as configuration: the Roles & Access tab shows exactly this. */
export const ROLE_MATRIX: Record<Capability, Record<CompanyRole, Allow>> = {
  view: { owner: true, admin: true, manager: true, employee: true, read_only: true },
  create_edit: { owner: true, admin: true, manager: true, employee: 'own', read_only: false },
  delete: { owner: true, admin: true, manager: true, employee: false, read_only: false },
  approve: { owner: true, admin: true, manager: true, employee: false, read_only: false },
  export: { owner: true, admin: true, manager: true, employee: false, read_only: false },
  sensitive: { owner: true, admin: true, manager: 'config', employee: false, read_only: false },
  invite: { owner: true, admin: true, manager: false, employee: false, read_only: false },
  manage_members: { owner: true, admin: true, manager: false, employee: false, read_only: false },
  manage_admins: { owner: true, admin: false, manager: false, employee: false, read_only: false },
  company_settings: { owner: true, admin: true, manager: false, employee: false, read_only: false },
  transfer_ownership: { owner: true, admin: false, manager: false, employee: false, read_only: false },
  delete_company: { owner: true, admin: false, manager: false, employee: false, read_only: false },
};

/** A role's default visibility scope (brief 1.3): employees see their own records, everyone else all. */
export const DEFAULT_SCOPE: Record<CompanyRole, Scope> = { owner: 'all', admin: 'all', manager: 'all', employee: 'own', read_only: 'all' };

// ------------------------------------------------------------------ sensitive fields (brief 1.4)

/**
 * The central registry of sensitive fields: costs, margins, labour and machine rates, stock values and bank details,
 * by JSON key (snake_case and camelCase) and by CSV column heading. Selling prices are not sensitive. They are removed
 * from every JSON answer and CSV export of a company module for a person who may not see them (members-gate.ts).
 */
export const SENSITIVE_KEY = /(cost(?!_?centre|ing_?method|ingMethod|Centre)|margin|profit|labour_?rate|labourRate|machine_?rate|machineRate|overhead_?rate|overheadRate|hourly_?rate|hourlyRate|salary|wage|bank|bsb|account_?number|accountNumber|tax_?file|taxFile|^value_cents$|^valueCents$|received_?value|receivedValue|stock_?value|stockValue|valuation_?total|valuationTotal|^rate_cents$|^rateCents$)/i;
export const SENSITIVE_HEADING = /\b(cost|costs|margin|profit|salary|wage|bank|bsb|account number|valuation|stock value|value at cost|labour rate|machine rate|overhead rate|hourly rate)\b/i;
const NOT_SENSITIVE_HEADING = /\bcost cent(re|er)\b|\bcosting method\b/i;
/** An identifier is never sensitive (bankAccountId names a Finance account; it carries no amount or number). */
export const isSensitiveKey = (k: string) => SENSITIVE_KEY.test(k) && !/(_id|Id|_ids|Ids)$/.test(k);
export const isSensitiveHeading = (h: string) => SENSITIVE_HEADING.test(h) && !NOT_SENSITIVE_HEADING.test(h);

/** A JSON value without its sensitive keys, at any depth. */
export function redact(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(redact);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) if (!isSensitiveKey(k)) out[k] = redact(x);
    return out;
  }
  return v;
}

/** A CSV text without its sensitive columns (headings in the first row). */
export function redactCsv(text: string): string {
  const rows = parseCsv(text);
  if (!rows.length) return text;
  const keep = rows[0].map((h, i) => (isSensitiveHeading(h) ? -1 : i)).filter((i) => i >= 0);
  if (keep.length === rows[0].length) return text;
  const bom = text.startsWith('\uFEFF') ? '\uFEFF' : '';
  return bom + rows.map((r) => keep.map((i) => csvCell(r[i] ?? '')).join(',')).join('\r\n') + '\r\n';
}

function csvCell(s: string): string {
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function parseCsv(text: string): string[][] {
  const src = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

// ------------------------------------------------------------------ a member's access

export interface ModuleAccess {
  access: boolean;
  scope: Scope;
}

export interface MemberAccess {
  companyId: string;
  userId: string;
  role: CompanyRole;
  status: 'active' | 'suspended';
  modules: Record<MemberModule, ModuleAccess>;
  sensitive: boolean;
  /** Who shares a department with the person (their team), themselves included. */
  team: string[];
}

interface MemberRowV2 {
  role: string;
  status: string | null;
  sensitive: number | null;
}

/** The access of a person in a registered company, or null when they are not its member. */
export async function loadMemberAccess(db: D1Database, companyId: string, userId: string): Promise<MemberAccess | null> {
  const m = await db.prepare('SELECT role, status, sensitive FROM co_members WHERE company_id = ? AND user_id = ?').bind(companyId, userId).first<MemberRowV2>();
  if (!m) return null;
  const role = normRole(m.role);
  const rows = await db.prepare('SELECT module, access, scope FROM co_member_access WHERE company_id = ? AND user_id = ?').bind(companyId, userId).all<{ module: string; access: number; scope: string }>();
  const team = await db
    .prepare(
      `SELECT DISTINCT o.user_id FROM co_department_members me JOIN co_department_members o ON o.company_id = me.company_id AND o.department_id = me.department_id
        WHERE me.company_id = ? AND me.user_id = ?`,
    )
    .bind(companyId, userId)
    .all<{ user_id: string }>();
  return accessFrom(companyId, userId, role, m.status === 'suspended' ? 'suspended' : 'active', m.sensitive, rows.results, team.results.map((t) => t.user_id));
}

export function accessFrom(
  companyId: string,
  userId: string,
  role: CompanyRole,
  status: 'active' | 'suspended',
  sensitive: number | null,
  rows: { module: string; access: number; scope: string }[],
  team: string[],
): MemberAccess {
  const full = role === 'owner' || role === 'admin';
  const modules = {} as Record<MemberModule, ModuleAccess>;
  for (const k of MEMBER_MODULE_KEYS) {
    const r = full ? undefined : rows.find((x) => x.module === k);
    const scope = r && (SCOPES as readonly string[]).includes(r.scope) ? (r.scope as Scope) : DEFAULT_SCOPE[role];
    modules[k] = { access: full || !r || r.access === 1, scope: full ? 'all' : scope };
  }
  const sens = ROLE_MATRIX.sensitive[role];
  return {
    companyId,
    userId,
    role,
    status,
    modules,
    sensitive: sens === true || (sens === 'config' && sensitive === 1),
    team: Array.from(new Set([userId, ...team])),
  };
}

/** Whether the role allows a capability (the matrix); 'own' and 'config' count as allowed here, narrowed elsewhere. */
export function roleAllows(role: CompanyRole, cap: Capability): boolean {
  return ROLE_MATRIX[cap][role] !== false;
}

/** Whether the members work acts for a company (flag company_members_v2, off). */
export async function membersV2(db: D1Database, companyId: string): Promise<boolean> {
  try {
    return await flagOn(db, 'company_members_v2', { companyId });
  } catch {
    return false;
  }
}

/** Throws 403 unless the role allows the capability. */
export function requireCapability(role: CompanyRole, cap: Capability, message?: string): void {
  if (!roleAllows(role, cap)) throw new HttpError(403, message ?? `Your company role cannot do that (${CAPABILITY_LABELS[cap].toLowerCase()}).`, { code: 'ROLE_FORBIDS', capability: cap });
}

/**
 * Anti-escalation (brief 1.5): who may change another member. Nobody changes themselves; only the owner touches an
 * administrator or makes one; nobody touches the owner; a non-owner can give only roles below their own.
 */
export function assertMayManage(actor: CompanyRole, actorId: string, target: { role: CompanyRole; userId: string }, newRole?: CompanyRole): void {
  if (actorId === target.userId) throw new HttpError(403, 'Nobody can change their own role or access. Ask the owner or another administrator.', { code: 'SELF_CHANGE' });
  if (target.role === 'owner') throw new HttpError(403, 'The owner cannot be changed, suspended or removed. Ownership can only be transferred.', { code: 'OWNER_PROTECTED' });
  if (!roleAllows(actor, 'manage_members')) throw new HttpError(403, 'Only the owner and administrators can manage members.', { code: 'ROLE_FORBIDS' });
  if (actor !== 'owner' && (target.role === 'admin' || newRole === 'admin' || newRole === 'owner'))
    throw new HttpError(403, 'Only the owner can change administrators or make someone an administrator.', { code: 'ADMIN_PROTECTED' });
}

/** A member's last request to the company, at most once a minute. */
export async function touchMember(db: D1Database, companyId: string, userId: string): Promise<void> {
  const t = now();
  await db.prepare('UPDATE co_members SET last_active_at = ? WHERE company_id = ? AND user_id = ? AND (last_active_at IS NULL OR last_active_at < ?)').bind(t, companyId, userId, t - 60_000).run();
}

/**
 * The central scope for a person in a company tool (CRM or Finance), when the members work acts for the tool's
 * company and the scope is narrower than all. CRM and Finance apply it to their own record scopes (decision C4: the
 * stricter of the two). Null: the tool's own rules alone.
 */
export async function toolMemberScope(db: D1Database, app: 'crm' | 'finance', toolId: string, userId: string): Promise<{ scope: 'own' | 'team'; team: string[] } | null> {
  try {
    if (!(await db.prepare("SELECT 1 FROM feature_flags WHERE key = 'company_members_v2' AND value = 'on' LIMIT 1").first())) return null;
  } catch {
    return null;
  }
  const { companyOfTool } = await import('../platform/context');
  const companyId = await companyOfTool(db, app, toolId);
  if (!companyId || !(await membersV2(db, companyId))) return null;
  const a = await loadMemberAccess(db, companyId, userId);
  if (!a) return null;
  const m = a.modules[app === 'crm' ? 'crm' : 'finance'];
  return m.scope === 'all' ? null : { scope: m.scope, team: m.scope === 'team' ? a.team : [userId] };
}

/** Record scopes narrowed to own: every 'all' of view, edit and delete becomes 'own' (never widened). */
export function narrowPerms<P extends object>(perms: P): P {
  const out: Record<string, unknown> = {};
  for (const [mod, v] of Object.entries(perms as Record<string, unknown>)) {
    if (v && typeof v === 'object' && 'view' in (v as object)) {
      const x = { ...(v as Record<string, unknown>) };
      for (const k of ['view', 'edit', 'delete']) if (x[k] === 'all') x[k] = 'own';
      out[mod] = x;
    } else out[mod] = v;
  }
  return out as P;
}
