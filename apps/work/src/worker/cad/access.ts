// Who may do what with CAD Automation in a company (owner's brief, Part 4; docs/cad/README.md, "Permissions").
//
// The company and the person's company role come from the ERP (erp/access.ts: registered, own or example company; 404
// for anyone outside it). CAD Automation acts only where the flag cad_in_erp is on for the company. The brief's matrix:
//
//   capability                          owner  admin  manager  employee  read-only
//   view computers, history, exports     yes    yes    yes      yes       yes
//   pair computers, run and cancel work  yes    yes    yes      own       no
//   download or save exports             yes    yes    config   config    no      (every download recorded)
//   company computers and settings       yes    yes    yes      no        no      ("manage templates and rules")
//   remove other people's computers      yes    yes    no       no        no      ("delete designs")
//   release a revision                   the ERP's engineering approver, with segregation of duties (unchanged)
//
// "config": the company decides (company_settings 'cad.download'; managers yes and employees no by default). Where the
// central permission service acts (flag company_members_v2), its module access and scope for 'cad' apply too; both must
// pass, and neither ever widens the other.

import type { Context } from 'hono';
import type { AppEnv, Env } from '../env';
import { HttpError, parseJson } from '../lib/util';
import { flagOn } from '../platform/flags';
import { type ErpAccess, loadErpAccess } from '../erp/access';
import { type CompanyRole, normRole } from '../company/access';
import { DEFAULT_SCOPE, loadMemberAccess, membersV2 } from '../company/members-access';
import type { AssertionClaims, CadLimits, CadPerms } from './keys';

export const LIMIT_DEFAULTS: CadLimits = { concurrent: 5, commandSeconds: 600, uploadMb: 32, storageMb: 128 };
export const LIMIT_BOUNDS: Record<keyof CadLimits, [number, number]> = { concurrent: [1, 50], commandSeconds: [60, 3600], uploadMb: [1, 32], storageMb: [16, 256] };
export const DOWNLOAD_DEFAULTS = { manager: true, employee: false };

export const CAD_SUBFLAGS = ['cad_products', 'cad_bom', 'cad_manufacturing', 'cad_quality', 'cad_projects'] as const;
export type CadSubflag = (typeof CAD_SUBFLAGS)[number];

export interface CadAccess {
  erp: ErpAccess;
  role: CompanyRole;
  perms: CadPerms;
  limits: CadLimits;
  claims: AssertionClaims;
}

/** Limits within their bounds (a stored value out of range is pulled back in). */
export function clampLimits(v: Partial<Record<keyof CadLimits, unknown>>, base: CadLimits = LIMIT_DEFAULTS): CadLimits {
  const out = { ...base };
  for (const k of Object.keys(LIMIT_BOUNDS) as (keyof CadLimits)[]) {
    const n = Number(v[k]);
    if (Number.isFinite(n)) out[k] = Math.min(LIMIT_BOUNDS[k][1], Math.max(LIMIT_BOUNDS[k][0], Math.round(n)));
  }
  return out;
}

/** The platform's default limits (system_kv 'cad_limits'), then the company's own (company_settings 'cad.limits'). */
export async function limitsFor(db: D1Database, companyId: string | null): Promise<CadLimits> {
  const def = await db.prepare("SELECT value FROM system_kv WHERE key = 'cad_limits'").first<{ value: string }>();
  const base = clampLimits(parseJson(def?.value, {}));
  if (!companyId) return base;
  const own = await db.prepare("SELECT value_json FROM company_settings WHERE company_id = ? AND key = 'cad.limits'").bind(companyId).first<{ value_json: string }>();
  return own ? clampLimits(parseJson(own.value_json, {}), base) : base;
}

export async function downloadConfig(db: D1Database, companyId: string): Promise<{ manager: boolean; employee: boolean }> {
  const row = await db.prepare("SELECT value_json FROM company_settings WHERE company_id = ? AND key = 'cad.download'").bind(companyId).first<{ value_json: string }>();
  const v = parseJson<Partial<{ manager: boolean; employee: boolean }>>(row?.value_json, {});
  return { manager: v.manager ?? DOWNLOAD_DEFAULTS.manager, employee: v.employee ?? DOWNLOAD_DEFAULTS.employee };
}

/** The permissions of a company role, before the central permission service narrows them. */
export function permsFor(role: CompanyRole, download: { manager: boolean; employee: boolean }): Omit<CadPerms, 'scope' | 'team'> {
  const full = role === 'owner' || role === 'admin';
  return {
    view: true,
    operate: role === 'read_only' ? false : role === 'employee' ? 'own' : 'all',
    export: full || (role === 'manager' && download.manager) || (role === 'employee' && download.employee),
    manage: full || role === 'manager',
    delete: full,
  };
}

/** Whether CAD Automation in the ERP is on for a company (and, with a sub-flag, that part of it too). */
export async function cadOn(db: D1Database, companyId: string, sub?: CadSubflag): Promise<boolean> {
  try {
    if (!(await flagOn(db, 'cad_in_erp', { companyId }))) return false;
    return sub ? await flagOn(db, sub, { companyId }) : true;
  } catch {
    return false;
  }
}

export async function loadCadAccess(env: Env, companyId: string, user: { id: string; name: string; email: string }): Promise<CadAccess> {
  const db = env.DB;
  const erp = await loadErpAccess(db, companyId, user);
  if (erp.kind === 'demo') throw new HttpError(404, 'The example company has no CAD Automation. Use it in your own company.', { code: 'CAD_EXAMPLE' });
  if (!(await cadOn(db, erp.companyId))) throw new HttpError(403, 'CAD Automation is not switched on in the ERP for this company yet. Products and Engineering shows how to set it up.', { code: 'CAD_NOT_ENABLED' });
  let role = normRole(erp.companyRole);
  let scope: CadPerms['scope'] = DEFAULT_SCOPE[role];
  let team = [user.id];
  if (erp.kind === 'registered' && (await membersV2(db, erp.companyId))) {
    const m = await loadMemberAccess(db, erp.companyId, user.id);
    if (!m || m.status === 'suspended') throw new HttpError(403, 'Your access to this company is suspended.', { code: 'MEMBER_SUSPENDED' });
    if (!m.modules.cad.access) throw new HttpError(403, 'You do not have access to CAD Automation in this company.', { code: 'MODULE_ACCESS', module: 'cad' });
    role = m.role;
    scope = m.modules.cad.scope;
    team = m.team;
  }
  if (role === 'owner' || role === 'admin') scope = 'all';
  const base = permsFor(role, await downloadConfig(db, erp.companyId));
  const perms: CadPerms = { ...base, scope, team: scope === 'team' ? team : [user.id] };
  // An employee limited to their own records operates only their own computers, whatever the scope says.
  if (perms.operate === 'all' && scope !== 'all') perms.operate = 'own';
  const limits = await limitsFor(db, erp.companyId);
  const u = await db.prepare('SELECT email, email_verified_at FROM users WHERE id = ?').bind(user.id).first<{ email: string; email_verified_at: number | null }>();
  const claims: AssertionClaims = {
    sub: user.id,
    email: (u?.email ?? user.email).toLowerCase(),
    ev: !!u?.email_verified_at,
    name: user.name,
    co: { id: erp.companyId, name: erp.companyName, kind: erp.kind },
    perm: perms,
    lim: limits,
  };
  return { erp, role, perms, limits, claims };
}

/** The company in the route (":company") with the caller's CAD access, cached on the request. */
export async function requireCad(c: Context<AppEnv>): Promise<CadAccess> {
  const id = c.req.param('company') ?? '';
  const cached = (c as any).__cadAccess as CadAccess | undefined;
  if (cached && cached.erp.companyId === id) return cached;
  const a = await loadCadAccess(c.env, id, c.get('user'));
  (c as any).__cadAccess = a;
  return a;
}

export function need(ok: boolean, message: string, code = 'CAD_FORBIDDEN'): void {
  if (!ok) throw new HttpError(403, message, { code });
}

/** The companies where a person may use CAD Automation in the ERP: it is on there, and their role lets them see it
 * (operate: also work with it, as the sync and the AI connector need). Registered companies, then their own. */
export async function cadCompanies(env: Env, user: { id: string; name: string; email: string }, opts: { operate?: boolean } = { operate: true }): Promise<{ id: string; name: string; kind: string; operate: boolean }[]> {
  const db = env.DB;
  const reg = await db
    .prepare("SELECT co.id FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL AND co.suspended_at IS NULL WHERE m.user_id = ? AND COALESCE(m.status, 'active') = 'active' ORDER BY co.name")
    .bind(user.id)
    .all<{ id: string }>();
  const own = await db.prepare('SELECT id FROM sys_companies WHERE owner_id = ?').bind(user.id).first<{ id: string }>();
  const ids = [...reg.results.map((r) => r.id), ...(own ? [own.id] : [])];
  const out: { id: string; name: string; kind: string; operate: boolean }[] = [];
  for (const id of ids) {
    if (!(await cadOn(db, id))) continue;
    try {
      const a = await loadCadAccess(env, id, user);
      if (a.perms.operate || !opts.operate) out.push({ id, name: a.erp.companyName, kind: a.erp.kind, operate: !!a.perms.operate });
    } catch {
      // not allowed in this company: left out
    }
  }
  return out;
}
