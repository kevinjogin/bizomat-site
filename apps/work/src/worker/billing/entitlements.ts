// Entitlements (docs/billing/README.md): may this company change records? Decided on the server for every write to a
// company's tools, whatever the browser shows. Reads are never refused by billing, and billing never hides or deletes
// data.
//
// Enforcement ('enforcement' in billing_settings, set by the founder; default off):
//   off     nothing is refused (today's behaviour);
//   shadow  nothing is refused, but each write "on" would refuse is counted per company and day;
//   on      a registered company with no active subscription, no grant and no grace left can read but not write: 402
//           with code PLAN_REQUIRED.
// Billing that is not configured counts as off: nothing can be sold, so nothing is refused.
//
// Never paid for: the example company, a person's own (unregistered) company, CAD Automation (its own app), the public
// Resources (the website), company administration (people, invitations, departments: /api/company) and billing itself.

import type { MiddlewareHandler } from 'hono';
import type { AppEnv, Env } from '../env';
import { HttpError, now } from '../lib/util';
import { billingConfig } from './config';
import { currentSubscription, enforcement, type Enforcement } from './store';

export type Decision = { allowed: true; why: 'grant' | 'subscription' | 'grace' | 'not-billed' | 'off' } | { allowed: false; why: 'no-subscription' | 'lapsed' };

/** Whether a registered company has paid access now. */
export async function companyEntitled(env: Env, companyId: string, at = now()): Promise<Decision> {
  const cfg = billingConfig(env);
  if (!cfg.enabled) return { allowed: true, why: 'off' };
  const db = env.DB;
  const grant = await db
    .prepare('SELECT 1 FROM billing_grants WHERE company_id = ? AND revoked_at IS NULL AND starts_at <= ? AND (ends_at IS NULL OR ends_at > ?) LIMIT 1')
    .bind(companyId, at, at)
    .first();
  if (grant) return { allowed: true, why: 'grant' };
  const sub = await currentSubscription(db, companyId, cfg.environment);
  if (!sub) return { allowed: false, why: 'no-subscription' };
  if (sub.status === 'active' || sub.status === 'trialing') return { allowed: true, why: 'subscription' };
  if ((sub.status === 'past_due' || sub.status === 'unpaid') && sub.past_due_since && at < sub.past_due_since + cfg.graceDays * 86_400_000) return { allowed: true, why: 'grace' };
  return { allowed: false, why: sub.status === 'past_due' || sub.status === 'unpaid' || sub.status === 'canceled' ? 'lapsed' : 'no-subscription' };
}

// Projects records that name their workspace (every one of these tables has workspace_id).
const PROJECT_TABLES: Record<string, string> = {
  boards: 'boards',
  items: 'items',
  groups: 'groups',
  columns: 'columns',
  views: 'views',
  updates: 'updates',
  documents: 'documents',
  dashboards: 'dashboards',
  widgets: 'dashboard_widgets',
  goals: 'goals',
  folders: 'folders',
  time: 'time_entries',
  automations: 'automations',
};

/** The registered company a write under /api goes to, or null when the path is not a paid tool of a registered
 * company (own and example companies, company administration, billing, the console, a person's own settings). */
export async function registeredCompanyOf(db: D1Database, apiPath: string): Promise<string | null> {
  const p = apiPath.replace(/^\/+/, '').split('/');
  const seg = p[0];
  const id = p[2] ?? '';
  const okId = id.length > 0 && id.length <= 64;
  // ERP Releases 1 to 5, Maintenance and Health and Safety: /erp/c/:company, /maintenance/c/:company, /whs/c/:company.
  if ((seg === 'erp' || seg === 'maintenance' || seg === 'whs') && p[1] === 'c' && okId) {
    const r = await db.prepare('SELECT id FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(id).first<{ id: string }>();
    return r?.id ?? null;
  }
  // The tools a registered company runs: the CRM (/crm/orgs/:org), Finance (/fin/orgs/:org), Projects (/workspaces/:ws).
  const tool = (app: 'crm' | 'finance' | 'tasks', ref: string) =>
    db.prepare('SELECT t.company_id FROM co_tools t JOIN co_companies co ON co.id = t.company_id AND co.deleted_at IS NULL WHERE t.app = ? AND t.ref_id = ?').bind(app, ref).first<{ company_id: string }>();
  if (seg === 'crm' && p[1] === 'orgs' && okId) return (await tool('crm', id))?.company_id ?? null;
  if (seg === 'fin' && p[1] === 'orgs' && okId) return (await tool('finance', id))?.company_id ?? null;
  const wsId = p[1] ?? '';
  if (seg === 'workspaces' && wsId && wsId.length <= 64) return (await tool('tasks', wsId))?.company_id ?? null;
  const table = PROJECT_TABLES[seg];
  if (table && wsId && wsId.length <= 64) {
    const r = await db.prepare(`SELECT workspace_id FROM ${table} WHERE id = ?`).bind(wsId).first<{ workspace_id: string }>();
    return r?.workspace_id ? ((await tool('tasks', r.workspace_id))?.company_id ?? null) : null;
  }
  return null;
}

async function countShadow(db: D1Database, companyId: string) {
  const day = new Date().toISOString().slice(0, 10);
  await db
    .prepare('INSERT INTO billing_shadow_denials (day, company_id, count) VALUES (?, ?, 1) ON CONFLICT(day, company_id) DO UPDATE SET count = count + 1')
    .bind(day, companyId)
    .run();
}

export const PLAN_REQUIRED_MESSAGE =
  'This company has no active BIZOMAT subscription, so its records can be read but not changed. A company administrator can subscribe under Administration, Billing.';

/** Middleware on the signed-in API: refuses writes to a registered company's paid tools when enforcement is on and the
 * company is not entitled. Reads always pass. */
export const entitlementGate: MiddlewareHandler<AppEnv> = async (c, next) => {
  const method = c.req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();
  let mode: Enforcement;
  try {
    mode = await enforcement(c.env.DB);
  } catch {
    // Before migration 0027 (an older database): nothing is enforced.
    return next();
  }
  if (mode === 'off' || !billingConfig(c.env).enabled) return next();
  const path = new URL(c.req.url).pathname.replace(/^.*?\/api\//, '');
  const companyId = await registeredCompanyOf(c.env.DB, path);
  if (!companyId) return next();
  const d = await companyEntitled(c.env, companyId);
  if (d.allowed) return next();
  if (mode === 'shadow') {
    await countShadow(c.env.DB, companyId).catch(() => undefined);
    return next();
  }
  throw new HttpError(402, PLAN_REQUIRED_MESSAGE, { code: 'PLAN_REQUIRED' });
};
