// Company context (Stage 1, R4; docs/platform/company-context.md). Which company, and which of its tools and modules, a
// request under /api is for, worked out on the server from the address alone. The address is the only source of the
// active company: a tool belongs to exactly one company, so /api/crm/orgs/<org>/... is as explicit as
// /api/erp/c/<company>/... and nothing stored about "the current company" is ever trusted.
//
// A tool's company is worked out, never copied (the owner's rule; system/system.ts): the registered company that runs
// it (co_tools), else the example company it was made for (sys_demo), else its owner's own company (sys_companies).
//
// Used by the company-scoped API tokens (tokenScopeGate) and the module switches of every module (moduleSwitchGate).

import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { loadErpAccess } from '../erp/access';
import { MODULES, flagOn, moduleEnabled, type ModuleKey } from './flags';

export type ToolApp = 'tasks' | 'crm' | 'finance';
/** What a scoped API token may be limited to. */
export const TOKEN_APPS = ['tasks', 'crm', 'finance', 'erp', 'company'] as const;
export type TokenApp = (typeof TOKEN_APPS)[number];

export interface RequestContext {
  companyId: string;
  /** The application the address belongs to (a token can be limited to some). */
  app: TokenApp;
  /** The module whose switch applies, when there is one. */
  module: ModuleKey | null;
  /** The tool the address names, for the tools that keep their own members. */
  tool: { app: ToolApp; id: string } | null;
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

// ERP addresses (/erp/c/<company>/<segment>) by module. Overview, reports, files, events, roles and settings are shared
// by every module and have no switch of their own.
const ERP_SEGMENTS: Record<string, ModuleKey> = {};
const erpModule = (m: ModuleKey, segments: string[]) => segments.forEach((s) => (ERP_SEGMENTS[s] = m));
erpModule('products', ['products', 'revisions', 'revision-compare', 'change-requests', 'change-orders', 'documents']);
erpModule('procurement', ['suppliers', 'supplier-options', 'requisitions', 'requisition-options', 'rfqs', 'purchase-orders', 'purchase-order-options', 'receipts']);
erpModule('inventory', ['warehouses', 'locations', 'stock', 'movements', 'reservations', 'adjustments', 'counts', 'labels', 'scan', 'valuation', 'trace']);
erpModule('manufacturing', ['work-centres', 'machines', 'mfg-assets', 'mfg-settings', 'routings', 'mos', 'mo-options', 'shop-floor', 'mps', 'mrp', 'capacity']);
erpModule('quality', ['qc-plans', 'inspections', 'quality', 'quality-options', 'ncrs', 'capas']);
erpModule('cad', ['cad']);
erpModule('supply_chain', ['sales-orders', 'sales-order-options', 'shipments', 'carriers', 'rmas', 'delivery-schedule', 'supply-chain']);

const TOOL_MODULE: Record<ToolApp, ModuleKey> = { tasks: 'tasks', crm: 'crm', finance: 'finance' };

function decodeSegment(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

const okId = (id: string | undefined): id is string => !!id && id.length <= 64;

/** The company a tool belongs to (registered, example, else its owner's own), or null for an unknown or deleted tool. */
export async function companyOfTool(db: D1Database, app: ToolApp, refId: string): Promise<string | null> {
  const reg = await db
    .prepare('SELECT t.company_id FROM co_tools t JOIN co_companies co ON co.id = t.company_id AND co.deleted_at IS NULL WHERE t.app = ? AND t.ref_id = ?')
    .bind(app, refId)
    .first<{ company_id: string }>();
  if (reg) return reg.company_id;
  const column = app === 'tasks' ? 'workspace_id' : app === 'crm' ? 'crm_org_id' : 'fin_org_id';
  const demo = await db.prepare(`SELECT company_id FROM sys_demo WHERE ${column} = ? AND status <> 'removed'`).bind(refId).first<{ company_id: string }>();
  if (demo) return demo.company_id;
  const owner =
    app === 'tasks'
      ? "SELECT m.user_id FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id AND w.deleted_at IS NULL WHERE m.workspace_id = ? AND m.role = 'owner' ORDER BY m.joined_at LIMIT 1"
      : app === 'crm'
        ? "SELECT m.user_id FROM crm_members m JOIN crm_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL WHERE m.org_id = ? AND m.role = 'owner' ORDER BY m.joined_at LIMIT 1"
        : "SELECT m.user_id FROM fin_members m JOIN fin_orgs o ON o.id = m.org_id AND o.deleted_at IS NULL WHERE m.org_id = ? AND m.role = 'owner' ORDER BY m.joined_at LIMIT 1";
  const o = await db.prepare(owner).bind(refId).first<{ user_id: string }>();
  if (!o) return null;
  const own = await db.prepare('SELECT id FROM sys_companies WHERE owner_id = ?').bind(o.user_id).first<{ id: string }>();
  return own?.id ?? null;
}

/**
 * The company, application, module and tool an address under /api is for. null: the address belongs to no single
 * company (a person's own settings, notifications, search across their tools, the console).
 */
export async function contextOfPath(db: D1Database, apiPath: string): Promise<RequestContext | null> {
  // Each segment decoded as the router decodes route parameters (audit S11).
  const p = apiPath.replace(/^\/+/, '').split('/').map(decodeSegment);
  const seg = p[0];
  if ((seg === 'erp' || seg === 'maintenance' || seg === 'whs' || seg === 'company' || seg === 'billing') && p[1] === 'c' && okId(p[2])) {
    const module = seg === 'maintenance' ? 'maintenance' : seg === 'whs' ? 'whs' : seg === 'erp' ? (ERP_SEGMENTS[p[3] ?? ''] ?? null) : null;
    return { companyId: p[2], app: seg === 'company' || seg === 'billing' ? 'company' : 'erp', module, tool: null };
  }
  // One company as the person sees it, with its tools (where a token limited to that company finds them).
  if (seg === 'system' && p[1] === 'companies' && okId(p[2])) return { companyId: p[2], app: 'company', module: null, tool: null };
  const tool = async (app: ToolApp, id: string): Promise<RequestContext | null> => {
    const companyId = await companyOfTool(db, app, id);
    return companyId ? { companyId, app, module: TOOL_MODULE[app], tool: { app, id } } : null;
  };
  if (seg === 'crm' && p[1] === 'orgs' && okId(p[2])) return tool('crm', p[2]);
  if (seg === 'fin' && p[1] === 'orgs' && okId(p[2])) return tool('finance', p[2]);
  if (seg === 'workspaces' && okId(p[1])) return tool('tasks', p[1]);
  const table = PROJECT_TABLES[seg];
  if (table && okId(p[1])) {
    const r = await db.prepare(`SELECT workspace_id FROM ${table} WHERE id = ?`).bind(p[1]).first<{ workspace_id: string }>();
    return r?.workspace_id ? tool('tasks', r.workspace_id) : null;
  }
  return null;
}

/** Whether a person is an active member of a tool (the tools keep their own members). */
async function memberOfTool(db: D1Database, tool: { app: ToolApp; id: string }, userId: string): Promise<boolean> {
  const sql =
    tool.app === 'tasks'
      ? "SELECT 1 FROM workspace_members WHERE workspace_id = ? AND user_id = ? AND status = 'active'"
      : tool.app === 'crm'
        ? 'SELECT 1 FROM crm_members WHERE org_id = ? AND user_id = ?'
        : 'SELECT 1 FROM fin_members WHERE org_id = ? AND user_id = ?';
  return !!(await db.prepare(sql).bind(tool.id, userId).first());
}

/** Whether any module is switched off anywhere: when none is (the usual case), the gate costs one small query. */
async function anyModuleOff(db: D1Database): Promise<boolean> {
  try {
    return !!(await db.prepare("SELECT 1 FROM feature_flags WHERE key LIKE 'module\\_%' ESCAPE '\\' AND value = 'off' LIMIT 1").first());
  } catch {
    return false; // before migration 0029
  }
}

/**
 * Module switches for every module (Admin Control Centre; Maintenance and WHS keep their own gate on their routes). A
 * module switched off for a company answers 403 MODULE_DISABLED to the people of that company's tool or ERP; anyone
 * else goes on to the route's own answer (usually 404), so a switch never reveals that a company exists.
 */
export const moduleSwitchGate: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (!(await anyModuleOff(c.env.DB))) return next();
  const path = c.req.path.replace(/^.*?\/api\//, '/');
  const ctx = await contextOfPath(c.env.DB, path);
  if (!ctx?.module || ctx.module === 'maintenance' || ctx.module === 'whs') return next();
  if (await moduleEnabled(c.env.DB, ctx.module, ctx.companyId)) return next();
  const user = c.get('user');
  if (ctx.tool) {
    if (!(await memberOfTool(c.env.DB, ctx.tool, user.id))) return next();
  } else {
    await loadErpAccess(c.env.DB, ctx.companyId, user); // 404 for people outside the company
  }
  throw new HttpError(403, `${MODULES[ctx.module].label} is switched off for this company. Ask BIZOMAT support if you need it.`, { code: 'MODULE_DISABLED', module: ctx.module });
};

export interface TokenScope {
  companyId: string | null;
  apps: TokenApp[] | null;
  readOnly: boolean;
}

/**
 * API tokens limited to one company (audit E3): every address must belong to that company (and, when the token names
 * them, to one of its applications), worked out from the address. An address that belongs to no single company is
 * refused. A read-only token can only read. Unscoped tokens made before R4 keep
 * acting as their person.
 */
export const tokenScopeGate: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (c.get('authKind') !== 'token') return next();
  const scope = c.get('tokenScope');
  if (!scope) return next();
  const method = c.req.method.toUpperCase();
  const reading = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
  if (scope.readOnly && !reading) throw new HttpError(403, 'This API token can only read.', { code: 'TOKEN_READ_ONLY' });
  if (!scope.companyId) return next();
  const path = c.req.path.replace(/^.*?\/api\//, '/');
  // The console refuses every API token itself, with its usual 404.
  if (path === '/admin' || path.startsWith('/admin/')) return next();
  const ctx = await contextOfPath(c.env.DB, path);
  if (!ctx || ctx.companyId !== scope.companyId) throw new HttpError(403, 'This API token is limited to one company, and this address is not in it.', { code: 'TOKEN_SCOPE' });
  if (scope.apps && !scope.apps.includes(ctx.app)) throw new HttpError(403, 'This API token is not allowed to use this application.', { code: 'TOKEN_SCOPE' });
  return next();
};

/** Whether verification enforcement is on anywhere: when it is not (the usual case), the gate costs one small query. */
async function enforcementAnywhere(db: D1Database): Promise<boolean> {
  try {
    return !!(await db.prepare("SELECT 1 FROM feature_flags WHERE key = 'verification_enforcement' AND value = 'on' LIMIT 1").first());
  } catch {
    return false;
  }
}

/**
 * Verification enforcement (brief 5.4; flag verification_enforcement, off): a registered company that is not verified
 * keeps its company area (onboarding, verification and its people) and support, and its tools and ERP answer 403
 * VERIFICATION_REQUIRED to its people. Anyone else gets the route's usual answer. Personal and example companies are
 * governed by the individual accounts policy (R7), not by this.
 */
export const verificationGate: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (!(await enforcementAnywhere(c.env.DB))) return next();
  const path = c.req.path.replace(/^.*?\/api\//, '/');
  const ctx = await contextOfPath(c.env.DB, path);
  if (!ctx || ctx.app === 'company') return next();
  const co = await c.env.DB.prepare("SELECT registration_status FROM companies WHERE id = ? AND type = 'registered' AND deleted_at IS NULL").bind(ctx.companyId).first<{ registration_status: string }>();
  if (!co || co.registration_status === 'verified') return next();
  if (!(await flagOn(c.env.DB, 'verification_enforcement', { companyId: ctx.companyId }))) return next();
  const user = c.get('user');
  if (ctx.tool) {
    if (!(await memberOfTool(c.env.DB, ctx.tool, user.id))) return next();
  } else {
    await loadErpAccess(c.env.DB, ctx.companyId, user);
  }
  throw new HttpError(403, 'This company is not verified yet, so its tools are closed until it is. Its owner and administrators can see what is needed in Company settings, Verification.', { code: 'VERIFICATION_REQUIRED' });
};
