// The members gate (owner's brief of 19 Nov 2026, Part 1; docs/platform/members.md): every request under /api that
// belongs to one company passes through here, and for a company where company_members_v2 is on it applies the central
// permission service (members-access.ts) before the module's own checks, which still apply (both must pass):
//
//   - a suspended member reaches nothing of the company but leaving it;
//   - a module the member has no access to answers 403 MODULE_ACCESS;
//   - read-only members cannot change anything; employees cannot delete, void or approve;
//   - in the operational modules, "own" or "team" scope limits changes to records the person (or their team) made;
//   - exports (CSV and spreadsheet answers) need the export capability;
//   - sensitive fields are removed from JSON answers and CSV exports for anyone who may not see them.
//
// The company area (/company/c/<id>/...) keeps its own rules (members-routes.ts). Safety reports stay open to everyone
// in the company: anyone may report a hazard or an incident, or ask for maintenance.

import type { Context, MiddlewareHandler } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { contextOfPath, type RequestContext } from '../platform/context';
import { type MemberAccess, type MemberModule, SCOPE_APPLIES, isMemberModule, loadMemberAccess, membersV2, redact, redactCsv, roleAllows, touchMember } from './members-access';

/** Whether the flag is on anywhere: when it is not (the usual case), the gate costs one small query. */
async function v2Anywhere(db: D1Database): Promise<boolean> {
  try {
    return !!(await db.prepare("SELECT 1 FROM feature_flags WHERE key = 'company_members_v2' AND value = 'on' LIMIT 1").first());
  } catch {
    return false;
  }
}

const APPROVE = new Set(['approve', 'reject', 'release', 'decide', 'disposition', 'verify']);
const DELETE_LIKE = new Set(['void']);
// Personal settings inside a module (saved views, preferences, read marks): anyone may keep their own.
const PERSONAL = new Set(['views', 'preferences', 'favourites', 'favorites', 'read', 'read-all', 'seen']);

/** The member module an address belongs to (Projects, CRM and Finance by their tool; the ERP's reports by address). */
export function memberModuleOf(ctx: RequestContext, segments: string[]): MemberModule | null {
  if (ctx.app === 'erp' && segments[0] === 'erp' && (segments[3] === 'reports' || segments[3] === 'analysis')) return 'reports';
  if (!ctx.module) return null;
  if (ctx.module === 'tasks') return 'projects';
  return isMemberModule(ctx.module) ? ctx.module : null;
}

// The record tables of the operational modules by address segment, with the column that names who made the record.
const RECORDS: Record<string, { table: string; owner: string }> = {
  products: { table: 'erp_products', owner: 'created_by' },
  'change-requests': { table: 'erp_change_requests', owner: 'requested_by' },
  'change-orders': { table: 'erp_change_orders', owner: 'created_by' },
  documents: { table: 'erp_documents', owner: 'created_by' },
  suppliers: { table: 'erp_suppliers', owner: 'created_by' },
  requisitions: { table: 'erp_requisitions', owner: 'created_by' },
  rfqs: { table: 'erp_rfqs', owner: 'created_by' },
  'purchase-orders': { table: 'erp_purchase_orders', owner: 'created_by' },
  receipts: { table: 'erp_receipts', owner: 'created_by' },
  adjustments: { table: 'erp_adjustments', owner: 'requested_by' },
  counts: { table: 'erp_counts', owner: 'created_by' },
  routings: { table: 'erp_routings', owner: 'created_by' },
  mos: { table: 'erp_mfg_orders', owner: 'created_by' },
  'qc-plans': { table: 'erp_qc_plans', owner: 'created_by' },
  inspections: { table: 'erp_qc_inspections', owner: 'created_by' },
  ncrs: { table: 'erp_qc_ncrs', owner: 'raised_by' },
  capas: { table: 'erp_qc_capas', owner: 'created_by' },
  'sales-orders': { table: 'erp_sales_orders', owner: 'created_by' },
  shipments: { table: 'erp_shipments', owner: 'created_by' },
  rmas: { table: 'erp_rmas', owner: 'created_by' },
};
const MT_RECORDS: Record<string, { table: string; owner: string }> = {
  assets: { table: 'mt_assets', owner: 'created_by' },
  'work-orders': { table: 'mt_work_orders', owner: 'created_by' },
  requests: { table: 'mt_requests', owner: 'requested_by' },
};
const WHS_RECORDS: Record<string, { table: string; owner: string }> = {
  hazards: { table: 'whs_hazards', owner: 'reported_by' },
  incidents: { table: 'whs_incidents', owner: 'reported_by' },
  'risk-assessments': { table: 'whs_risk_assessments', owner: 'drafted_by' },
  actions: { table: 'whs_actions', owner: 'created_by' },
};

/** For a change to one record: whether it was made by the person (or their team, for team scope). Null: not a record. */
async function madeByScope(db: D1Database, a: MemberAccess, ctx: RequestContext, segments: string[], scope: 'own' | 'team'): Promise<boolean | null> {
  const map = segments[0] === 'erp' ? RECORDS : segments[0] === 'maintenance' ? MT_RECORDS : segments[0] === 'whs' ? WHS_RECORDS : null;
  const rec = map?.[segments[3] ?? ''];
  const id = segments[4];
  if (!rec || !id) return null;
  const row = await db.prepare(`SELECT ${rec.owner} AS owner FROM ${rec.table} WHERE company_id = ? AND id = ?`).bind(ctx.companyId, id).first<{ owner: string | null }>();
  if (!row) return null; // the route answers 404 itself
  const people = scope === 'own' ? [a.userId] : a.team;
  return !!row.owner && people.includes(row.owner);
}

const isExportAnswer = (res: Response) => {
  const type = (res.headers.get('Content-Type') ?? '').toLowerCase();
  return type.includes('text/csv') || type.includes('spreadsheetml') || type.includes('application/vnd.ms-excel');
};

/** The member's access for the company of the request, when the members work acts there (members-routes.ts uses it). */
export const memberOf = (c: Context<AppEnv>): MemberAccess | undefined => (c as any).__memberAccess;

export const memberAccessGate: MiddlewareHandler<AppEnv> = async (c, next) => {
  const db = c.env.DB;
  if (!(await v2Anywhere(db))) return next();
  const path = c.req.path.replace(/^.*?\/api\//, '/');
  const ctx = await contextOfPath(db, path);
  if (!ctx || !(await membersV2(db, ctx.companyId))) return next();
  const user = c.get('user');
  const a = await loadMemberAccess(db, ctx.companyId, user.id);
  // Not a member of a registered company (a person's own company, the example, an outsider): the route answers.
  if (!a) return next();
  (c as any).__memberAccess = a;
  await touchMember(db, ctx.companyId, user.id);
  const segments = path.replace(/^\/+/, '').split('/');
  const method = c.req.method.toUpperCase();
  const reading = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
  const last = segments[segments.length - 1] ?? '';

  if (a.status === 'suspended') {
    if (ctx.app === 'company' && method === 'POST' && last === 'leave') return next();
    throw new HttpError(403, 'Your access to this company is suspended. Ask its owner or an administrator.', { code: 'MEMBER_SUSPENDED' });
  }
  // The company area keeps its own rules (who manages members, settings, ownership).
  if (ctx.app === 'company') return next();

  const mod = memberModuleOf(ctx, segments);
  if (mod && !a.modules[mod].access) throw new HttpError(403, 'You do not have access to this module in this company. Ask its owner or an administrator.', { code: 'MODULE_ACCESS', module: mod });

  if (!reading && !PERSONAL.has(last)) {
    const safety =
      method === 'POST' &&
      ((segments[0] === 'whs' && (segments[3] === 'hazards' || segments[3] === 'incidents') && segments.length === 4) ||
        (segments[0] === 'maintenance' && segments[3] === 'requests' && segments.length === 4));
    if (!safety) {
      if (!roleAllows(a.role, 'create_edit')) throw new HttpError(403, 'Your company role can view but not change anything.', { code: 'READ_ONLY' });
      if ((method === 'DELETE' || DELETE_LIKE.has(last)) && !roleAllows(a.role, 'delete')) throw new HttpError(403, 'Your company role cannot delete records.', { code: 'ROLE_FORBIDS', capability: 'delete' });
      if (APPROVE.has(last) && !roleAllows(a.role, 'approve')) throw new HttpError(403, 'Your company role cannot approve or release.', { code: 'ROLE_FORBIDS', capability: 'approve' });
      if (mod && SCOPE_APPLIES[mod] === 'changes' && a.modules[mod].scope !== 'all') {
        const scope = a.modules[mod].scope as 'own' | 'team';
        const ok = await madeByScope(db, a, ctx, segments, scope);
        if (ok === false) throw new HttpError(403, scope === 'own' ? 'You can change only records you created.' : 'You can change only records your team created.', { code: 'SCOPE', scope });
      }
    }
  }
  const exportAsked = reading && (c.req.query('format') === 'csv' || segments.includes('export') || segments.includes('download'));
  if (exportAsked && !roleAllows(a.role, 'export') && !(segments.includes('files') || segments.includes('attachments'))) {
    throw new HttpError(403, 'Your company role cannot export data.', { code: 'ROLE_FORBIDS', capability: 'export' });
  }

  await next();

  const res = c.res;
  if (!res || res.status >= 400) return;
  if (isExportAnswer(res)) {
    if (!roleAllows(a.role, 'export')) {
      c.res = new Response(JSON.stringify({ error: 'Your company role cannot export data.', details: { code: 'ROLE_FORBIDS', capability: 'export' } }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      return;
    }
    if (!a.sensitive && (res.headers.get('Content-Type') ?? '').toLowerCase().includes('text/csv')) {
      const text = await res.text();
      const headers = new Headers(res.headers);
      headers.delete('Content-Length');
      c.res = new Response(redactCsv(text), { status: res.status, headers });
    }
    return;
  }
  if (!a.sensitive && (res.headers.get('Content-Type') ?? '').toLowerCase().includes('application/json')) {
    const body = await res.clone().json().catch(() => undefined);
    if (body === undefined) return;
    const headers = new Headers(res.headers);
    headers.delete('Content-Length');
    c.res = new Response(JSON.stringify(redact(body)), { status: res.status, headers });
  }
};
