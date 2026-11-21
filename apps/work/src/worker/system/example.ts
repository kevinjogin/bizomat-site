// BIZOMAT ERP: the example company (owner's request, 14 Nov 2026: "add example site (Acme) to all users so they can learn
// and ensure its demo site only for accounts"). Table: migrations/0019_example_company.sql.
//
// Every person gets a company of invented example data of their own, "Acme Studio (example)": a Projects workspace, a
// CRM organisation, a Finance business workspace, Maintenance records, Products and Engineering and supplier records
// (ERP Release 1) and purchasing and inventory records (ERP Release 2), all named for it and owned by that person alone.
// From ERP Release 4 part A, quality records too (an inspection plan, a failed inspection, an NCR and a corrective action),
// and from Release 5 part A supply chain records (a carrier, a sales order shipped and invoiced, a line made to order, a
// return). From BIZOMAT WHS Release 1, health and safety records (a site in New South Wales, a hazard being controlled,
// an approved JSA, a near miss and an injury with its investigation, actions, and a regulator notification record marked
// as example data).
// It is made the first time they open the ERP (the client asks for it), and again only when they ask after removing it.
// Example companies made before a release keep what they had: nothing is added to them.
//
// Rules:
// - Private: only its owner sees it. Nobody can be invited into it, and its tools cannot join a registered company.
// - No email: its notifications stay in the app (services/notify.ts, crm/notify.ts, fin/util.ts) and its Finance
//   documents are not emailed (fin/routes-sales.ts).
// - Built through the app's own API, with a personal API token that lives for the build only, so every record goes
//   through the same checks, ledger, numbering, search and audit as one a person makes.
// - Nothing invented about real people: no other accounts, example.com addresses only, names made up.

import type { Context } from 'hono';
import type { AppEnv, AuthUser, Env } from '../env';
import { HttpError, clientIp, newId, now, randomToken, sha256Hex } from '../lib/util';
import { auditStmt } from '../services/audit';
import { syncCompany, syncCompanyStatements } from '../company/identity';

export const EXAMPLE_NAME = 'Acme Studio (example)';
export type ExampleStatus = 'building' | 'ready' | 'failed' | 'removed';
export type ExampleApp = 'tasks' | 'crm' | 'finance';

export interface ExampleRow {
  user_id: string;
  company_id: string;
  name: string;
  status: ExampleStatus;
  workspace_id: string | null;
  crm_org_id: string | null;
  fin_org_id: string | null;
  error: string | null;
  created_at: number;
  updated_at: number;
  removed_at: number | null;
}

/** A build that has said nothing for this long is taken to have stopped (the server restarted mid-build). */
const STALE_BUILD_MS = 5 * 60_000;
const COLUMN: Record<ExampleApp, 'workspace_id' | 'crm_org_id' | 'fin_org_id'> = { tasks: 'workspace_id', crm: 'crm_org_id', finance: 'fin_org_id' };

export async function exampleOf(db: D1Database, userId: string): Promise<ExampleRow | null> {
  return (await db.prepare('SELECT * FROM sys_demo WHERE user_id = ?').bind(userId).first<ExampleRow>()) ?? null;
}

/** What the ERP tells a person about their example company. */
export function exampleInfo(row: ExampleRow | null) {
  if (!row) return { status: 'none' as const };
  return { status: row.status, companyId: row.status === 'ready' ? row.company_id : undefined, failed: row.status === 'failed' ? row.error ?? 'The example company could not be made' : undefined };
}

/** True when the space belongs to someone's example company (being made or in use). */
export async function isExampleSpace(db: D1Database, app: ExampleApp, id: string | null | undefined): Promise<boolean> {
  if (!id) return false;
  try {
    const r = await db.prepare(`SELECT 1 FROM sys_demo WHERE ${COLUMN[app]} = ? AND status IN ('building', 'ready')`).bind(id).first();
    return !!r;
  } catch {
    // Before migration 0019 (a test database without it): no example companies.
    return false;
  }
}

const REFUSALS = {
  invite: 'This is the example company: it is only for you, so nobody can be invited to it. Invite people to your own company instead.',
  email: 'This is the example company: its documents are not emailed. Use your own company for real customers.',
  link: "The example company's tools cannot join a registered company.",
} as const;

/** 409 for an action the example company does not allow. */
export async function refuseExample(db: D1Database, app: ExampleApp, id: string | null | undefined, what: keyof typeof REFUSALS) {
  if (await isExampleSpace(db, app, id)) throw new HttpError(409, REFUSALS[what], { code: 'EXAMPLE_COMPANY' });
}

/** The ids of the person's example spaces (for grouping them under the example company). */
export async function exampleSpaces(db: D1Database, userId: string): Promise<{ companyId: string; name: string; ids: Set<string> } | null> {
  let row: ExampleRow | null = null;
  try {
    row = await exampleOf(db, userId);
  } catch {
    return null;
  }
  if (!row || (row.status !== 'ready' && row.status !== 'building')) return null;
  return { companyId: row.company_id, name: row.name, ids: new Set([row.workspace_id, row.crm_org_id, row.fin_org_id].filter((x): x is string => !!x)) };
}

// ------------------------------------------------------------------ building

/**
 * Makes the person's example company, or answers with the one they have. `again` (asked for in Administration) makes a
 * removed or failed one again; without it a removed one stays removed. Concurrent calls make one company.
 */
export async function buildExample(c: Context<AppEnv>, user: AuthUser, again = false): Promise<{ status: ExampleStatus | 'none'; companyId?: string; built: boolean }> {
  const db = c.env.DB;
  const t = now();
  const ins = await db
    .prepare("INSERT OR IGNORE INTO sys_demo (user_id, company_id, name, status, created_at, updated_at) VALUES (?, ?, ?, 'building', ?, ?)")
    .bind(user.id, newId(), EXAMPLE_NAME, t, t)
    .run();
  if (!ins.meta.changes) {
    // One exists: claim it only when it may be made (again).
    const claimable = again ? "status IN ('failed', 'removed')" : '0';
    const claim = await db
      .prepare(
        `UPDATE sys_demo SET status = 'building', workspace_id = NULL, crm_org_id = NULL, fin_org_id = NULL, error = NULL, removed_at = NULL, updated_at = ?
          WHERE user_id = ? AND (${claimable} OR (status = 'building' AND updated_at < ?))`,
      )
      .bind(t, user.id, t - STALE_BUILD_MS)
      .run();
    if (!claim.meta.changes) {
      const row = await exampleOf(db, user.id);
      return { status: row?.status ?? 'none', companyId: row?.status === 'ready' ? row.company_id : undefined, built: false };
    }
  }
  const row = (await exampleOf(db, user.id))!;
  await syncCompany(db, row.company_id, t);
  try {
    await makeExample(c, user, row.company_id);
    await db.prepare("UPDATE sys_demo SET status = 'ready', error = NULL, updated_at = ? WHERE user_id = ?").bind(now(), user.id).run();
    await auditStmt(db, { actorId: user.id, action: 'example_company.created', targetType: 'example_company', targetId: row.company_id, ip: clientIp(c) }).run();
    return { status: 'ready', companyId: row.company_id, built: true };
  } catch (e) {
    const reason = e instanceof ExampleStepError ? e.message : 'The example company could not be made';
    console.error('example_company_failed', reason, e instanceof ExampleStepError ? '' : e instanceof Error ? e.message : '');
    await clearSpaces(c, user.id, row.company_id).catch(() => null);
    await db.prepare("UPDATE sys_demo SET status = 'failed', error = ?, updated_at = ? WHERE user_id = ?").bind(reason.slice(0, 200), now(), user.id).run();
    return { status: 'failed', built: false };
  }
}

/** Removes the example company: its spaces are deleted (soft, as a person's delete is) and its maintenance and ERP records erased. */
export async function removeExample(c: Context<AppEnv>, user: AuthUser): Promise<void> {
  const db = c.env.DB;
  const row = await exampleOf(db, user.id);
  if (!row || row.status === 'removed') return;
  if (row.status === 'building' && row.updated_at > now() - STALE_BUILD_MS) throw new HttpError(409, 'The example company is still being made. Try again in a moment.');
  await clearSpaces(c, user.id, row.company_id);
  const t = now();
  await db.batch([
    db.prepare("UPDATE sys_demo SET status = 'removed', removed_at = ?, updated_at = ? WHERE user_id = ?").bind(t, t, user.id),
    auditStmt(db, { actorId: user.id, action: 'example_company.removed', targetType: 'example_company', targetId: row.company_id, ip: clientIp(c) }),
    ...syncCompanyStatements(db, row.company_id, t),
  ]);
}

/** Deletes the example's spaces the person still owns, and its maintenance and ERP records and files. */
async function clearSpaces(c: Context<AppEnv>, userId: string, companyId: string) {
  const db = c.env.DB;
  const row = await exampleOf(db, userId);
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  if (row?.workspace_id) {
    stmts.push(db.prepare("UPDATE workspaces SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM workspace_members m WHERE m.workspace_id = workspaces.id AND m.user_id = ? AND m.role = 'owner')").bind(t, row.workspace_id, userId));
  }
  if (row?.crm_org_id) {
    stmts.push(db.prepare("UPDATE crm_orgs SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM crm_members m WHERE m.org_id = crm_orgs.id AND m.user_id = ? AND m.role = 'owner')").bind(t, t, row.crm_org_id, userId));
  }
  if (row?.fin_org_id) {
    stmts.push(
      db.prepare("UPDATE fin_orgs SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM fin_members m WHERE m.org_id = fin_orgs.id AND m.user_id = ? AND m.role = 'owner')").bind(t, t, row.fin_org_id, userId),
      db.prepare('UPDATE fin_recurring SET active = 0 WHERE org_id = ?').bind(row.fin_org_id),
      db.prepare('UPDATE fin_report_schedules SET active = 0 WHERE org_id = ?').bind(row.fin_org_id),
    );
  }
  const files = await db.prepare('SELECT r2_key FROM mt_files WHERE company_id = ?').bind(companyId).all<{ r2_key: string }>();
  // BIZOMAT WHS (migrations/0026_whs_core.sql) first: its site jurisdictions point at Maintenance's sites. Incidents,
  // health records, rule checks, notices and the history refuse deletion except for a whole-company removal written to
  // whs_purges in the same transaction (taken out at the end).
  try {
    const whsFiles = await db.prepare('SELECT r2_key FROM whs_files WHERE company_id = ?').bind(companyId).all<{ r2_key: string }>();
    files.results.push(...whsFiles.results);
    stmts.push(db.prepare('INSERT INTO whs_purges (company_id, started_at) VALUES (?, ?) ON CONFLICT(company_id) DO NOTHING').bind(companyId, t));
    for (const table of [
      'whs_alerts',
      'whs_comments',
      'whs_files',
      'whs_links',
      'whs_events',
      'whs_rule_checks',
      'whs_reg_notices',
      'whs_inv_statements',
      'whs_inv_timeline',
      'whs_inv_team',
      'whs_investigations',
      'whs_health',
      'whs_incident_revisions',
      'whs_incidents',
      'whs_actions',
      'whs_ra_controls',
      'whs_ra_hazards',
      'whs_ra_steps',
      'whs_risk_assessments',
      'whs_hazards',
      'whs_site_packs',
      'whs_hours_revisions',
      'whs_hours',
      'whs_policies',
      'whs_settings',
      'whs_matrices',
      'whs_counters',
      'whs_purges',
    ]) {
      stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
    }
  } catch {
    // before migration 0026 (a test database without it): no WHS records
  }
  // Maintenance stages M2 and M3 (migrations/0024_maintenance_m2_m3.sql) first: they point at 0018's records.
  for (const table of [
    'mt_insp_results',
    'mt_wo_inspections',
    'mt_pm_occurrences',
    'mt_readings',
    'mt_prestarts',
    'mt_pm_schedules',
    'mt_pm_templates',
    'mt_asset_prestart',
    'mt_insp_items',
    'mt_insp_templates',
    'mt_meters',
    'mt_downtime',
    'mt_labour_costs',
    'mt_wo_stock',
    'mt_stores',
    'mt_technician_trades',
    'mt_technicians',
    'mt_trades',
    'mt_asset_sites',
    'mt_sites',
    'mt_done',
  ]) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  // Children before parents (migrations/0018_maintenance.sql).
  for (const table of ['mt_events', 'mt_files', 'mt_comments', 'mt_labour', 'mt_wo_parts', 'mt_wo_tasks', 'mt_requests', 'mt_work_orders']) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  // Assets point at their parents: the deepest first.
  stmts.push(db.prepare('UPDATE mt_assets SET parent_id = NULL WHERE company_id = ?').bind(companyId));
  for (const table of ['mt_assets', 'mt_roles', 'mt_settings', 'mt_counters']) stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  // ERP Release 1 records (migrations/0020_erp_engineering_procurement.sql), children before parents.
  const erpFiles = await db
    .prepare("SELECT r2_key FROM erp_files WHERE company_id = ? UNION ALL SELECT r2_key FROM erp_document_versions WHERE company_id = ? AND r2_key IS NOT NULL")
    .bind(companyId, companyId)
    .all<{ r2_key: string }>();
  files.results.push(...erpFiles.results);
  // ERP Release 2 records (migrations/0021_erp_purchasing_inventory.sql) first: they point at Release 1's. The movement
  // ledger is append-only; erp_purges lets this one whole-company removal through, and is cleared at the end.
  const r2Files = await db.prepare('SELECT r2_key FROM erp_record_files WHERE company_id = ?').bind(companyId).all<{ r2_key: string }>();
  files.results.push(...r2Files.results);
  stmts.push(db.prepare('INSERT INTO erp_purges (company_id, started_at) VALUES (?, ?) ON CONFLICT(company_id) DO NOTHING').bind(companyId, t));
  // ERP Release 5 part A records (migrations/0025_erp_supply_chain.sql) first: they point at Release 4's inspections and
  // NCRs, Release 3's orders and Release 2's reservations, locations and products. Their files are erp_record_files.
  for (const table of ['erp_pick_lines', 'erp_packages', 'erp_shipment_lines', 'erp_rma_lines', 'erp_rmas', 'erp_shipments', 'erp_so_allocations', 'erp_so_mo_links', 'erp_so_revisions', 'erp_so_lines', 'erp_sales_orders', 'erp_carriers']) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  // ERP Release 4 part A records (migrations/0023_erp_quality.sql) before Release 3's and 2's: they point at their orders,
  // receipts, locations and suppliers. Their files are erp_record_files, collected above.
  for (const table of ['erp_qc_ncr_actions', 'erp_qc_dispositions', 'erp_qc_ncr_inspections', 'erp_qc_capas', 'erp_qc_ncrs', 'erp_qc_readings', 'erp_qc_insp_chars', 'erp_qc_inspections', 'erp_qc_plan_chars', 'erp_qc_plans']) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  // ERP Release 3 records (migrations/0022_erp_manufacturing.sql) before Release 2's: they point at its reservations,
  // locations and suppliers.
  for (const table of [
    'erp_mrp_suggestions',
    'erp_mrp_lines',
    'erp_mrp_runs',
    'erp_mps_entries',
    'erp_mo_costs',
    'erp_mo_receipts',
    'erp_mo_reports',
    'erp_mo_time',
    'erp_mo_reservations',
    'erp_mo_operations',
    'erp_mo_materials',
    'erp_mo_assignees',
    'erp_mo_revisions',
    'erp_mfg_orders',
    'erp_routing_operations',
    'erp_routings',
    'erp_machines',
    'erp_work_centres',
    'erp_product_planning',
    'erp_mfg_settings',
  ]) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  // The modules framework (migrations/0038_erp_modules.sql and 0041): lines, references, comments, posting accounts,
  // intercompany contacts and custom fields go with their records.
  for (const table of ['erp_object_marks', 'erp_object_views', 'erp_alerts', 'erp_object_comments', 'erp_object_refs', 'erp_object_lines', 'erp_objects', 'erp_posting_accounts', 'erp_ic_contacts', 'erp_custom_fields']) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  for (const table of [
    'erp_record_files',
    'erp_integration_events',
    'erp_done',
    'erp_count_lines',
    'erp_counts',
    'erp_adjustments',
    'erp_reservations',
    'erp_cost_layers',
    'erp_valuation',
    'erp_stock_moves',
    'erp_stock',
    'erp_receipt_lines',
    'erp_receipts',
    'erp_po_revisions',
    'erp_po_lines',
    'erp_purchase_orders',
    'erp_quotation_lines',
    'erp_quotations',
    'erp_rfq_suppliers',
    'erp_rfq_lines',
    'erp_rfqs',
    'erp_requisition_lines',
    'erp_requisitions',
    'erp_product_stock',
  ]) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  stmts.push(db.prepare('UPDATE erp_locations SET parent_id = NULL WHERE company_id = ?').bind(companyId));
  for (const table of ['erp_locations', 'erp_warehouses', 'erp_settings', 'erp_sequences', 'erp_role_grants']) stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  for (const table of ['erp_events', 'erp_files', 'erp_document_versions', 'erp_documents', 'erp_product_suppliers', 'erp_supplier_contacts', 'erp_suppliers', 'erp_bom_lines', 'erp_revisions', 'erp_change_request_products', 'erp_change_orders', 'erp_change_requests']) {
    stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  }
  stmts.push(db.prepare('UPDATE erp_products SET variant_of = NULL WHERE company_id = ?').bind(companyId));
  for (const table of ['erp_products', 'erp_user_roles', 'erp_counters', 'erp_purges']) stmts.push(db.prepare(`DELETE FROM ${table} WHERE company_id = ?`).bind(companyId));
  await db.batch(stmts);
  for (const f of files.results) {
    const p = c.env.FILES.delete(f.r2_key).catch(() => null);
    try {
      c.executionCtx.waitUntil(p);
    } catch {
      await p;
    }
  }
}

class ExampleStepError extends Error {}

type Api = <T = any>(step: string, method: string, path: string, body?: unknown) => Promise<T>;

let internalApp: { fetch: (req: Request, env: Env, ctx?: any) => Response | Promise<Response> } | null = null;

/** The app itself, to call its API from inside (loaded on first use: app.ts imports this module's routes). */
async function appInstance() {
  if (!internalApp) {
    const { createApp } = await import('../app');
    internalApp = createApp() as unknown as typeof internalApp;
  }
  return internalApp!;
}

/** Runs `fn` with an API client signed in as the person through a personal API token that exists for the build only. */
async function withApi<T>(c: Context<AppEnv>, user: AuthUser, fn: (api: Api) => Promise<T>): Promise<T> {
  const db = c.env.DB;
  const token = `wos_${randomToken(32)}`;
  const id = newId();
  await db
    .prepare('INSERT INTO api_tokens (id, user_id, name, token_hash, prefix, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, user.id, 'Example company setup', await sha256Hex(token), token.slice(0, 10), now() + 10 * 60_000, now())
    .run();
  const app = await appInstance();
  let ctx: any;
  try {
    ctx = c.executionCtx;
  } catch {
    ctx = undefined;
  }
  const api: Api = async (step, method, path, body) => {
    const headers: Record<string, string> = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const ip = c.req.header('CF-Connecting-IP');
    if (ip) headers['CF-Connecting-IP'] = ip;
    const res = await app.fetch(new Request(`http://example-company.internal${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), c.env, ctx);
    if (!res.ok) throw new ExampleStepError(`${step} step failed (HTTP ${res.status})`);
    const text = await res.text();
    return (text ? JSON.parse(text) : null) as any;
  };
  try {
    return await fn(api);
  } finally {
    await db.prepare('DELETE FROM api_tokens WHERE id = ?').bind(id).run();
  }
}

// ------------------------------------------------------------------ the example data (all invented)

const DAY = 86_400_000;

async function makeExample(c: Context<AppEnv>, user: AuthUser, companyId: string) {
  const db = c.env.DB;
  const today = new Date(new Date(now()).toISOString().slice(0, 10) + 'T00:00:00Z');
  const d = (offset: number) => new Date(today.getTime() + offset * DAY).toISOString().slice(0, 10);
  const span = (from: number, to: number) => ({ start: d(from), end: d(to) });
  const record = (app: ExampleApp, id: string) => db.prepare(`UPDATE sys_demo SET ${COLUMN[app]} = ?, updated_at = ? WHERE user_id = ?`).bind(id, now(), user.id).run();

  await withApi(c, user, async (api) => {
    // ---------------------------------------------------------------- Project Management
    const ws = await api('Projects', 'POST', '/api/workspaces', { name: EXAMPLE_NAME, description: 'Invented example data to learn BIZOMAT. Only you can see it, and changes here affect nothing else.' });
    await record('tasks', ws.id);
    const boardIds: string[] = [];
    for (const def of BOARDS(span)) {
      const created = await api('Projects', 'POST', `/api/workspaces/${ws.id}/boards`, { name: def.name, templateId: 'project-plan', withSampleItems: false });
      const bundle = await api('Projects', 'GET', `/api/boards/${created.id}`);
      boardIds.push(created.id);
      const col = (type: string, title?: string) => bundle.columns.find((x: any) => x.type === type && (!title || x.title === title))?.id;
      const C = { owner: col('person'), status: col('status'), timeline: col('timeline'), priority: col('priority'), effort: col('number', 'Effort (days)'), budget: col('currency') };
      const groups = [...bundle.groups].sort((a: any, b: any) => a.position - b.position);
      for (const [i, g] of def.groups.entries()) if (groups[i]) await api('Projects', 'PATCH', `/api/groups/${groups[i].id}`, g);
      for (const it of def.items) {
        const values: Record<string, unknown> = {};
        if (C.owner) values[C.owner] = user.id;
        if (C.status) values[C.status] = it.status;
        if (C.timeline) values[C.timeline] = it.timeline;
        if (C.priority) values[C.priority] = it.priority;
        if (C.effort) values[C.effort] = it.effort;
        if (it.budget && C.budget) values[C.budget] = it.budget;
        await api('Projects', 'POST', `/api/boards/${created.id}/items`, { name: it.name, groupId: groups[Math.min(it.group, groups.length - 1)]?.id, values, position: 'bottom' });
      }
    }
    const dash = await api('Projects', 'POST', `/api/workspaces/${ws.id}/dashboards`, { name: 'Delivery overview', description: 'Both example projects at a glance', boardIds });
    const doc = await api('Projects', 'POST', `/api/workspaces/${ws.id}/documents`, { title: 'Website relaunch brief', content: BRIEF(d), boardId: boardIds[0] });
    await api('Projects', 'POST', `/api/workspaces/${ws.id}/favourites`, { type: 'board', id: boardIds[0] });
    await api('Projects', 'POST', `/api/workspaces/${ws.id}/favourites`, { type: 'dashboard', id: dash.id });
    await api('Projects', 'POST', `/api/workspaces/${ws.id}/favourites`, { type: 'document', id: doc.id });

    // ---------------------------------------------------------------- Sales and CRM
    const org = await api('CRM', 'POST', '/api/crm/orgs', { name: EXAMPLE_NAME, currency: 'AUD', timezone: 'Australia/Sydney' });
    await record('crm', org.id);
    const crm = (p: string) => `/api/crm/orgs/${org.id}${p}`;
    const companies: Record<string, string> = {};
    for (const co of CRM_COMPANIES) companies[co.key] = (await api('CRM', 'POST', crm('/companies'), { name: co.name, website: co.website, industry: co.industry })).id;
    const contacts: Record<string, string> = {};
    for (const ct of CRM_CONTACTS) contacts[ct.key] = (await api('CRM', 'POST', crm('/contacts'), { firstName: ct.firstName, lastName: ct.lastName, email: ct.email, jobTitle: ct.jobTitle, companyId: companies[ct.company] })).id;
    for (const deal of CRM_DEALS) await api('CRM', 'POST', crm('/deals'), { title: deal.title, value: deal.value, companyId: companies[deal.company] });
    for (const lead of CRM_LEADS) await api('CRM', 'POST', crm('/leads'), lead);
    await api('CRM', 'POST', crm('/activities'), { type: 'call', title: 'Discovery call about the website relaunch', contactId: contacts.dana, dueDate: d(2), dueTime: '10:00', priority: 'high' });
    await api('CRM', 'POST', crm('/activities'), { type: 'follow_up', title: 'Send the revised proposal', contactId: contacts.omar, dueDate: d(5), priority: 'medium' });

    // ---------------------------------------------------------------- Finance and Accounting
    const fin = await api('Finance', 'POST', '/api/fin/orgs', { name: EXAMPLE_NAME, kind: 'business', currency: 'AUD', timezone: 'Australia/Sydney', gstRegistered: true, gstBasis: 'accrual', basMethod: 'full' });
    await record('finance', fin.id);
    const f = (p: string) => `/api/fin/orgs/${fin.id}${p}`;
    const accounts = await api<any[]>('Finance', 'GET', f('/accounts'));
    const code = (x: string) => accounts.find((a) => a.code === x)?.id;
    const tax = Object.fromEntries((await api<any[]>('Finance', 'GET', f('/tax-codes'))).map((x) => [x.code, x.id]));
    const bank = code('090');
    const sales = code('200');
    const costs = code('453');
    if (bank) {
      await api('Finance', 'POST', f(`/accounts/${bank}/opening-balance`), { amount: 2500000, date: d(-90) });
      for (const [kind, offset, acct, amount, t] of FIN_TRANSACTIONS) {
        const accountId = acct === '200' ? sales : costs;
        if (accountId) await api('Finance', 'POST', f('/transactions'), { kind, accountId: bank, date: d(offset), taxMode: 'inclusive', lines: [{ accountId, amount, taxCodeId: tax[t] }] });
      }
    }
    const customer = await api('Finance', 'POST', f('/contacts'), { name: 'Harbour Cafe', kind: 'customer', email: 'accounts@harbour-cafe.example.com' });
    if (sales) {
      await api('Finance', 'POST', f('/quotes'), {
        contactId: customer.id,
        issueDate: d(0),
        expiryDate: d(30),
        reference: 'Website relaunch',
        lines: [
          { description: 'Discovery and site map', quantity: 1, unitPrice: 240_000, accountId: sales, taxCodeId: tax.GST },
          { description: 'Design and build', quantity: 1, unitPrice: 960_000, accountId: sales, taxCodeId: tax.GST },
          { description: 'Content migration', quantity: 12, unit: 'hr', unitPrice: 12_000, accountId: sales, taxCodeId: tax.GST },
        ],
      });
    }

    // ---------------------------------------------------------------- Maintenance
    const mt = (p: string) => `/api/maintenance/c/${companyId}${p}`;
    const asset = (b: Record<string, unknown>) => api('Maintenance', 'POST', mt('/assets'), b);
    const site = await asset({ number: 'SITE-01', name: 'Riverside workshop', category: 'Site', location: '12 Example Street', criticality: 'high' });
    const area = await asset({ number: 'AREA-02', name: 'Fabrication bay', category: 'Area', parentId: site.id, criticality: 'high' });
    const line = await asset({ number: 'LINE-03', name: 'Cutting line', category: 'Line', parentId: area.id, criticality: 'high' });
    const laser = await asset({ number: 'MC-0104', name: 'Laser cutter', category: 'Machine', type: 'CNC laser', manufacturer: 'Example Machines', model: 'LX-3015', serialNumber: 'EX-55210', parentId: line.id, criticality: 'critical', strategy: 'preventive', specs: [{ key: 'Power', value: '6 kW' }, { key: 'Bed size', value: '3000 x 1500 mm' }] });
    const chiller = await asset({ number: 'MC-0104-CH', name: 'Chiller unit', category: 'Component', parentId: laser.id, criticality: 'high' });
    const brake = await asset({ number: 'MC-0107', name: 'Press brake', category: 'Machine', manufacturer: 'Example Machines', model: 'PB-160', parentId: line.id, criticality: 'high' });
    const comp = await asset({ number: 'UT-0201', name: 'Air compressor', category: 'Utility', parentId: area.id, criticality: 'medium', status: 'under_maintenance' });
    const r1 = await api('Maintenance', 'POST', mt('/requests'), { assetId: laser.id, priority: 'high', description: 'Chiller alarm on the laser cutter: coolant temperature high after twenty minutes of cutting.' });
    await api('Maintenance', 'POST', mt('/requests'), { assetId: brake.id, priority: 'medium', description: 'Back gauge does not return to zero after a job change.' });
    await api('Maintenance', 'POST', mt('/requests'), { assetId: comp.id, priority: 'urgent', description: 'Air compressor tripping the breaker on start-up.' });
    const chillerWo = await api('Maintenance', 'POST', mt(`/requests/${r1.id}/convert`), {
      jobType: 'corrective',
      priority: 'high',
      assignedTo: user.id,
      dueStart: d(0),
      dueFinish: d(3),
      estimatedHours: 3,
      instructions: 'Check the coolant level and the chiller filter. Clean the condenser fins. Run the laser for thirty minutes and record the coolant temperature.',
      safety: 'Isolate and lock out the laser and the chiller before opening any panel.',
      tasks: ['Isolate and lock out', 'Check the coolant level and top up', 'Replace the chiller filter', 'Test run and record the temperature'],
      parts: [{ part: 'Chiller filter cartridge', quantity: 1 }],
    });
    await api('Maintenance', 'POST', mt('/work-orders'), { assetId: brake.id, description: 'Quarterly check of the press brake hydraulics', jobType: 'inspection', priority: 'medium', dueFinish: d(6), assignedTo: user.id, estimatedHours: 2 });

    // ---------------------------------------------------------------- Products and Engineering, Procurement (ERP Release 1)
    // A kit with a two-level bill of materials, released through a change order (the one-person company exception is
    // recorded), a second change order still in draft, a CAD reference, and two suppliers, one approved. No ABNs: an
    // invented number that passes the check could belong to a real business.
    const e = (p: string) => `/api/erp/c/${companyId}${p}`;
    const prod = (b: Record<string, unknown>) => api('Products', 'POST', e('/products'), b);
    const kit = await prod({ name: 'Shelf bracket kit', type: 'finished_product', category: 'Brackets', sku: 'SBK-100', priceCents: 3900, lifecycle: 'active', description: 'Two powder-coated shelf brackets with fixings.', weight: 1.4, weightUnit: 'kg' });
    const weld = await prod({ name: 'Bracket weldment', type: 'subassembly', category: 'Brackets', material: 'Mild steel' });
    const arm = await prod({ name: 'Bracket arm, laser cut', type: 'manufactured_part', category: 'Brackets', standardCostCents: 420, material: 'Mild steel 3 mm' });
    const gusset = await prod({ name: 'Gusset plate', type: 'manufactured_part', category: 'Brackets', standardCostCents: 120, material: 'Mild steel 3 mm' });
    const bolt = await prod({ name: 'Hex bolt M8 x 30', type: 'purchased_item', category: 'Fasteners', standardCostCents: 18 });
    const plug = await prod({ name: 'Wall plug 10 mm', type: 'purchased_item', category: 'Fasteners', standardCostCents: 9 });
    const coat = await prod({ name: 'Powder coat, black', type: 'consumable', category: 'Finishing', standardCostCents: 150, uom: 'kit' });
    await api('Products', 'POST', e(`/products/${kit.id}/variants`), { variantAttributes: { finish: 'White' } });
    const firstRev = async (id: string) => (await api('Products', 'GET', e(`/products/${id}`))).revisions[0].id as string;
    const weldRev = await firstRev(weld.id);
    await api('Products', 'POST', e(`/revisions/${weldRev}/lines`), { componentId: arm.id, quantity: 1 });
    await api('Products', 'POST', e(`/revisions/${weldRev}/lines`), { componentId: gusset.id, quantity: 2, scrapPct: 5 });
    const kitRev = await firstRev(kit.id);
    for (const [componentId, quantity] of [
      [weld.id, 2],
      [bolt.id, 4],
      [plug.id, 4],
      [coat.id, 1],
    ] as const) {
      await api('Products', 'POST', e(`/revisions/${kitRev}/lines`), { componentId, quantity });
    }
    const first = await api('Products', 'POST', e('/change-orders'), { title: 'First release of the shelf bracket kit', reason: 'Ready for production', productIds: [kit.id, weld.id] });
    await api('Products', 'POST', e(`/change-orders/${first.id}/submit`), {});
    await api('Products', 'POST', e(`/change-orders/${first.id}/approve`), { note: 'Checked against the drawings' });
    await api('Products', 'POST', e(`/change-orders/${first.id}/release`), {});
    await api('Products', 'POST', e('/change-requests'), { title: 'Thicker gusset plate', reason: 'A customer reported flex under heavy loads.', productIds: [weld.id] });
    const draft = await api('Products', 'POST', e('/change-orders'), { title: 'Gusset plate from 4 mm steel', reason: 'Stiffer bracket under heavy loads', productIds: [gusset.id] });
    const draftRev = (await api('Products', 'GET', e(`/change-orders/${draft.id}`))).revisions[0];
    await api('Products', 'PATCH', e(`/revisions/${draftRev.id}`), { description: 'Gusset plate cut from 4 mm mild steel', changeReason: 'Stiffer bracket under heavy loads' });
    await api('Products', 'POST', e('/documents'), { productId: arm.id, title: 'Bracket arm model', kind: 'model', docRevision: 'A', cadPath: 'C:\\Users\\You\\Documents\\Acme\\Bracket-arm.SLDPRT', cadConfig: 'Default', note: 'Example CAD reference: the file is on the engineer’s computer, not on the server.' });
    const steel = await api('Procurement', 'POST', e('/suppliers'), { legalName: 'Example Steel Supplies', category: 'Steel', email: 'orders@steel.example.com', paymentTermsDays: 30, leadTimeDays: 10, deliveryTerms: 'Delivered to the workshop' });
    await api('Procurement', 'POST', e(`/suppliers/${steel.id}/contacts`), { name: 'Robin Sales', role: 'Account manager', email: 'robin@steel.example.com' });
    await api('Procurement', 'POST', e(`/suppliers/${steel.id}/status`), { status: 'approved', note: 'Approved for steel plate' });
    const fasteners = await api('Procurement', 'POST', e('/suppliers'), { legalName: 'Example Fasteners', category: 'Fasteners', email: 'sales@fasteners.example.com', paymentTermsDays: 14, leadTimeDays: 5 });
    await api('Procurement', 'PUT', e(`/products/${arm.id}/suppliers/${steel.id}`), { supplierPartNumber: 'PL3-2412', priceCents: 380, leadTimeDays: 10, preferred: true });
    await api('Procurement', 'PUT', e(`/products/${bolt.id}/suppliers/${fasteners.id}`), { supplierPartNumber: 'M8X30-ZP', priceCents: 15, moq: 100, preferred: true });

    // ---------------------------------------------------------------- Purchasing and inventory (ERP Release 2)
    // A warehouse with a location tree, purchase order approval at or below 2,000 dollars, a requisition, a request for
    // quotation to two suppliers with both quotations recorded (left open for comparison), and a purchase order for the
    // bracket arms received into stock. The one-person company exception is recorded where an approval is needed.
    await api('Inventory', 'PUT', e('/erp-settings'), { costingMethod: 'weighted_average', poApprovalLimitCents: 200_000, adjustmentApprovalCents: 50_000 });
    const wh = await api('Inventory', 'POST', e('/warehouses'), { code: 'MAIN', name: 'Workshop store', address: '1 Example Street, Exampleville' });
    const loc = (b: Record<string, unknown>) => api('Inventory', 'POST', e('/locations'), { warehouseId: wh.id, ...b });
    const store = await loc({ code: 'STORE', name: 'Main store', level: 'store' });
    const zoneA = await loc({ code: 'A', name: 'Zone A', level: 'zone', parentId: store.id });
    const rack1 = await loc({ code: 'A1', name: 'Rack A1', level: 'rack', parentId: zoneA.id });
    const shelf = await loc({ code: 'A1-1', name: 'Shelf 1', level: 'shelf', parentId: rack1.id });
    const binArms = await loc({ code: 'A1-1-01', name: 'Bin 01', level: 'bin', parentId: shelf.id });
    await loc({ code: 'A1-1-02', name: 'Bin 02', level: 'bin', parentId: shelf.id });
    await loc({ code: 'RECV', name: 'Receiving bay', level: 'zone', kind: 'receiving', parentId: store.id });
    const quarLoc = await loc({ code: 'QUAR', name: 'Quarantine cage', level: 'zone', kind: 'quarantine', parentId: store.id });
    await loc({ code: 'DISP', name: 'Dispatch bay', level: 'zone', kind: 'dispatch', parentId: store.id });
    await api('Inventory', 'PUT', e(`/products/${arm.id}/stock-settings`), { reorderPoint: 20, minQty: 10, maxQty: 80, defaultLocationId: binArms.id });
    await api('Inventory', 'PUT', e(`/products/${bolt.id}/stock-settings`), { reorderPoint: 200, minQty: 100, maxQty: 1000 });
    await api('Inventory', 'PUT', e(`/products/${plug.id}/stock-settings`), { reorderPoint: 200, minQty: 100, maxQty: 1000 });
    const boltCo = await api('Procurement', 'POST', e('/suppliers'), { legalName: 'Example Bolt Company', category: 'Fasteners', email: 'quotes@bolts.example.com', paymentTermsDays: 30, leadTimeDays: 7 });
    await api('Procurement', 'POST', e(`/suppliers/${boltCo.id}/status`), { status: 'approved', note: 'Approved for fasteners' });
    const wholesale = await api('Procurement', 'POST', e('/suppliers'), { legalName: 'Example Hardware Wholesale', category: 'Fasteners', email: 'trade@hardware.example.com', paymentTermsDays: 14, leadTimeDays: 3 });
    await api('Procurement', 'POST', e(`/suppliers/${wholesale.id}/status`), { status: 'approved', note: 'Approved for fasteners and fixings' });
    const req = await api('Purchasing', 'POST', e('/requisitions'), {
      title: 'Fixings for the next bracket batch',
      requiredDate: d(14),
      budgetRef: 'Production materials',
      reason: 'Bolts and wall plugs are below their reorder points.',
      lines: [
        { productId: bolt.id, quantity: 500, estUnitCostCents: 16 },
        { productId: plug.id, quantity: 500, estUnitCostCents: 9 },
      ],
      submit: true,
    });
    await api('Purchasing', 'POST', e(`/requisitions/${req.id}/approve`), { note: 'Within the production budget' });
    const rfq = await api('Purchasing', 'POST', e('/rfqs'), { requisitionId: req.id, replyBy: d(5), deliveryAddress: 'Acme Studio, 1 Example Street, Exampleville', supplierIds: [boltCo.id, wholesale.id] });
    const rfqView = await api('Purchasing', 'GET', e(`/rfqs/${rfq.id}`));
    const [boltLine, plugLine] = rfqView.lines;
    await api('Purchasing', 'POST', e(`/rfqs/${rfq.id}/sent`), { supplierId: boltCo.id });
    await api('Purchasing', 'POST', e(`/rfqs/${rfq.id}/sent`), { supplierId: wholesale.id });
    await api('Purchasing', 'PUT', e(`/rfqs/${rfq.id}/quotations/${boltCo.id}`), { reference: 'Q-1042', validUntil: d(30), leadTimeDays: 7, freightCents: 2500, paymentTermsDays: 30, lines: [{ rfqLineId: boltLine.id, unitPriceCents: 14 }, { rfqLineId: plugLine.id, unitPriceCents: 8 }] });
    await api('Purchasing', 'PUT', e(`/rfqs/${rfq.id}/quotations/${wholesale.id}`), { reference: 'WQ-77', validUntil: d(21), leadTimeDays: 3, freightCents: 0, paymentTermsDays: 14, lines: [{ rfqLineId: boltLine.id, unitPriceCents: 18 }, { rfqLineId: plugLine.id, unitPriceCents: 10 }] });
    const po = await api('Purchasing', 'POST', e('/purchase-orders'), { supplierId: steel.id, requiredDate: d(-2), deliveryAddress: 'Acme Studio, 1 Example Street, Exampleville', lines: [{ productId: arm.id, quantity: 40, unitPriceCents: 380, specification: 'Laser cut from 3 mm mild steel, deburred' }] });
    await api('Purchasing', 'POST', e(`/purchase-orders/${po.id}/submit`), {});
    await api('Purchasing', 'POST', e(`/purchase-orders/${po.id}/sent`), {});
    const poView = await api('Purchasing', 'GET', e(`/purchase-orders/${po.id}`));
    await api('Purchasing', 'POST', e(`/purchase-orders/${po.id}/receipts`), { receivedDate: d(-3), deliveryRef: 'DN-58811', lines: [{ poLineId: poView.lines[0].id, received: 40, locationId: binArms.id }] });

    // ---------------------------------------------------------------- Manufacturing (ERP Release 3)
    // Three work centres (two machines linked to the Maintenance assets above), released routings for the weldment and
    // the kit, a manufacturing order for ten weldments in progress (materials reserved, gusset plates issued, the laser
    // cutting done with its labour and machine time, welding started), a confirmed demand for 60 kits in the master
    // production schedule, and an MRP run whose suggestions are left open to review.
    await api('Manufacturing', 'PUT', e('/mfg-settings'), { overCompletionPct: 5, reserveOnRelease: true });
    await loc({ code: 'WIP', name: 'Work in progress', level: 'zone', kind: 'work_in_progress', parentId: store.id });
    const fgLoc = await loc({ code: 'FG', name: 'Finished goods', level: 'zone', kind: 'finished_goods', parentId: store.id });
    await api('Manufacturing', 'PUT', e('/mfg-settings'), { fgLocationId: fgLoc.id });
    const wc = (b: Record<string, unknown>) => api('Manufacturing', 'POST', e('/work-centres'), b);
    const cut = await wc({ code: 'CUT', name: 'Laser cutting', hoursPerDay: 8, efficiencyPct: 90, machines: 1, labourRateCents: 6500, machineRateCents: 4500, overheadRateCents: 1500 });
    const fab = await wc({ code: 'FAB', name: 'Welding and forming', hoursPerDay: 8, efficiencyPct: 85, machines: 2, labourRateCents: 6000, machineRateCents: 2500, overheadPct: 40 });
    const assy = await wc({ code: 'ASSY', name: 'Assembly and packing', hoursPerDay: 7.5, machines: 2, labourRateCents: 5000, overheadPct: 30 });
    const laserM = await api('Manufacturing', 'POST', e('/machines'), { workCentreId: cut.id, code: 'LASER-01', name: 'Laser cutter', assetId: laser.id });
    await api('Manufacturing', 'POST', e('/machines'), { workCentreId: fab.id, code: 'PB-01', name: 'Press brake', assetId: brake.id });
    const coater = await api('Procurement', 'POST', e('/suppliers'), { legalName: 'Example Coatings', category: 'Finishing', email: 'jobs@coatings.example.com', paymentTermsDays: 30, leadTimeDays: 4 });
    await api('Procurement', 'POST', e(`/suppliers/${coater.id}/status`), { status: 'approved', note: 'Approved for powder coating' });
    const routing = async (productId: string, leadTimeDays: number | null, ops: Record<string, unknown>[]) => {
      const r = await api('Manufacturing', 'POST', e('/routings'), { productId, leadTimeDays });
      for (const op of ops) await api('Manufacturing', 'POST', e(`/routings/${r.id}/operations`), op);
      await api('Manufacturing', 'POST', e(`/routings/${r.id}/release`), { note: 'First routing' });
      return r;
    };
    await routing(weld.id, 6, [
      { opNo: 10, name: 'Laser cut gusset plates', workCentreId: cut.id, machineId: laserM.id, setupMinutes: 20, runMinutes: 2, crew: 1 },
      { opNo: 20, name: 'Weld arm and gussets', workCentreId: fab.id, setupMinutes: 15, runMinutes: 8, crew: 1, inspection: true, inspectionNote: 'Check weld penetration and squareness' },
      { opNo: 30, name: 'Powder coat', outsourced: true, supplierId: coater.id, outsourceCostCents: 180, outsourceDays: 4 },
    ]);
    await routing(kit.id, 2, [{ opNo: 10, name: 'Pack kit with fixings', workCentreId: assy.id, setupMinutes: 10, runMinutes: 3, crew: 1 }]);
    await api('Manufacturing', 'PUT', e(`/products/${gusset.id}/planning`), { purchaseLeadDays: 3, safetyStock: 20 });
    await api('Inventory', 'POST', e('/adjustments'), { productId: gusset.id, locationId: binArms.id, quantity: 21, unitCostCents: 120, reason: 'Opening stock of gusset plates' });
    const mo = await api('Manufacturing', 'POST', e('/mos'), { productId: weld.id, quantity: 10, requiredDate: d(7), startDate: d(0), priority: 'high', customerRef: 'Stock for kits', assignees: [user.id] });
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/release`), { reserve: true });
    const moView = await api('Manufacturing', 'GET', e(`/mos/${mo.id}`));
    const gussetLine = moView.materials.find((m: any) => m.productId === gusset.id);
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/issue`), { lines: [{ materialId: gussetLine.id, locationId: binArms.id, quantity: gussetLine.requiredQty }] });
    const [op10, op20] = moView.operations;
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op10.id}/start`), {});
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op10.id}/time`), { kind: 'labour', minutes: 45, note: 'Cutting and deburring' });
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op10.id}/time`), { kind: 'machine', minutes: 40 });
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op10.id}/report`), { kind: 'good', quantity: 10 });
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op10.id}/complete`), {});
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op20.id}/start`), {});
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op20.id}/time`), { kind: 'labour', minutes: 30, note: 'First four brackets welded' });
    await api('Manufacturing', 'POST', e(`/mos/${mo.id}/operations/${op20.id}/report`), { kind: 'good', quantity: 4 });
    await api('Manufacturing', 'POST', e('/mps'), { productId: kit.id, quantity: 60, dueDate: d(21), kind: 'confirmed', reference: 'Harbour Cafe fit-out (example)' });
    await api('Manufacturing', 'POST', e('/mps'), { productId: kit.id, quantity: 40, dueDate: d(35), kind: 'forecast', reference: 'Next month (forecast)' });
    await api('Manufacturing', 'POST', e('/mrp/runs'), {});

    // ---------------------------------------------------------------- Maintenance, stages M2 and M3 (ERP Release 4)
    // A site holding every asset, trades and a labour rate, a meter with readings and a gauge, an inspection template and
    // a prestart checklist, a monthly service schedule that made its work order (inspected with a failed item that
    // raised a request, labour and a part recorded, then completed, so its next due date moved on), a meter-based and a
    // condition-based schedule, a template for the class of machines, the workshop store as a maintenance store with
    // spare bolts issued to the chiller work order, a breakdown with its downtime, and a passed prestart. The earlier
    // releases' figures stay as they were: seven assets, two open work orders, eight products, and only the bracket arms
    // in stock (the spare bolts received into the store are all issued).
    const mtSite = await api('Maintenance', 'POST', mt('/sites'), { code: 'RIVERSIDE', name: 'Riverside workshop', address: '12 Example Street' });
    await api('Maintenance', 'PUT', mt(`/assets/${site.id}/site`), { siteId: mtSite.id, includeChildren: true });
    const fitter = await api('Maintenance', 'POST', mt('/trades'), { name: 'Mechanical fitter', rateCents: 8500 });
    await api('Maintenance', 'POST', mt('/trades'), { name: 'Electrician', rateCents: 9500 });
    await api('Maintenance', 'PUT', mt(`/technicians/${user.id}`), { rateCents: 9000, tradeIds: [fitter.id] });
    const laserHours = await api('Maintenance', 'POST', mt('/meters'), { assetId: laser.id, name: 'Laser hours', unit: 'h' });
    const coolant = await api('Maintenance', 'POST', mt('/meters'), { assetId: chiller.id, name: 'Coolant temperature', unit: 'C', rising: false, expectedMin: 15, expectedMax: 25 });
    const at = (offset: number, hour: number) => today.getTime() + offset * DAY + hour * 3_600_000;
    await api('Maintenance', 'POST', mt(`/meters/${laserHours.id}/readings`), { value: 4120, readAt: at(-14, 8) });
    await api('Maintenance', 'POST', mt(`/meters/${laserHours.id}/readings`), { value: 4168, readAt: at(-7, 8) });
    await api('Maintenance', 'POST', mt(`/meters/${coolant.id}/readings`), { value: 19, readAt: at(-7, 9) });
    await api('Maintenance', 'POST', mt(`/meters/${coolant.id}/readings`), { value: 21, readAt: at(-1, 9) });
    const inspection = await api('Maintenance', 'POST', mt('/inspection-templates'), {
      name: 'Laser cutter monthly inspection',
      description: 'Checked at each monthly service.',
      failAction: 'request',
      items: [
        { label: 'Beam guard interlocks work', kind: 'pass_fail', critical: true },
        { label: 'Coolant temperature after 30 minutes', kind: 'number', unit: 'C', min: 15, max: 25 },
        { label: 'Fume extraction filter clean', kind: 'pass_fail' },
        { label: 'Remarks', kind: 'text', required: false },
      ],
    });
    const prestartList = await api('Maintenance', 'POST', mt('/inspection-templates'), {
      name: 'Laser cutter daily prestart',
      failAction: 'request',
      items: [
        { label: 'Emergency stop works', kind: 'pass_fail', critical: true },
        { label: 'Work area clear of offcuts', kind: 'pass_fail' },
        { label: 'Assist gas pressure', kind: 'number', unit: 'bar', min: 8, max: 12 },
      ],
    });
    await api('Maintenance', 'PUT', mt(`/assets/${laser.id}/prestart`), { templateId: prestartList.id });
    await api('Maintenance', 'PUT', mt(`/stores/${wh.id}`), { store: true });
    const spares = await loc({ code: 'MNT', name: 'Maintenance spares', level: 'zone', parentId: store.id });
    await api('Inventory', 'POST', e('/adjustments'), { productId: bolt.id, locationId: spares.id, quantity: 4, unitCostCents: 18, reason: 'Spare bolts for the maintenance store' });
    await api('Maintenance', 'POST', mt(`/work-orders/${chillerWo.workOrder.id}/stock/issue`), { lines: [{ productId: bolt.id, locationId: spares.id, quantity: 4 }] });
    await api('Maintenance', 'PUT', mt(`/work-orders/${chillerWo.workOrder.id}/downtime`), { startedAt: at(-1, 14), endedAt: null, cause: 'Laser stopped on the chiller alarm' });
    // The monthly service: made by its schedule, inspected, labour and a part recorded, completed.
    const monthly = await api('Maintenance', 'POST', mt(`/pm/schedules?today=${d(0)}`), {
      assetId: laser.id,
      name: 'Monthly laser service',
      description: 'Clean the lens and the nozzle, check the beam guards and the chiller',
      triggerKind: 'time',
      intervalN: 1,
      intervalUnit: 'month',
      startDate: d(0),
      priority: 'medium',
      tasks: ['Isolate and lock out', 'Clean the lens and the nozzle', 'Check the beam guard interlocks', 'Run for thirty minutes and record the coolant temperature'],
      parts: [{ part: 'Laser lens cleaning kit', quantity: 1 }],
      estimatedHours: 1.5,
      trade: 'Mechanical fitter',
      assignedTo: user.id,
      inspectionTemplateId: inspection.id,
      safety: 'Isolate and lock out the laser before opening any panel.',
    });
    const generated = await api('Maintenance', 'POST', mt('/pm/generate'), { today: d(0) });
    const pmWoId = generated.made.find((m: any) => m.scheduleId === monthly.id)?.workOrderId;
    if (pmWoId) {
      const pmWo = await api('Maintenance', 'GET', mt(`/work-orders/${pmWoId}`));
      const insp = pmWo.inspections[0];
      const item = (label: string) => insp.items.find((x: any) => x.label.startsWith(label))?.id;
      await api('Maintenance', 'PUT', mt(`/work-orders/${pmWoId}/inspections/${insp.id}/results`), {
        results: [
          { itemId: item('Beam guard'), passed: true },
          { itemId: item('Coolant temperature'), value: 22 },
          { itemId: item('Fume extraction'), passed: false, note: 'Filter loaded with dust: replace at the next stop' },
          { itemId: item('Remarks'), text: 'Lens cleaned; nozzle in good condition.' },
        ],
      });
      await api('Maintenance', 'POST', mt(`/work-orders/${pmWoId}/inspections/${insp.id}/complete`), {});
      await api('Maintenance', 'POST', mt(`/work-orders/${pmWoId}/labour`), { date: d(0), minutes: 75, note: 'Monthly service' });
      await api('Maintenance', 'POST', mt(`/work-orders/${pmWoId}/complete`), { notes: 'Service done. The fume extraction filter needs replacing: request raised by the inspection.' });
    }
    await api('Maintenance', 'POST', mt('/pm/schedules'), { assetId: laser.id, name: '500-hour laser service', triggerKind: 'meter', meterId: laserHours.id, meterInterval: 500, leadDays: 5, priority: 'high', tasks: ['Replace the nozzle', 'Check the beam alignment'], estimatedHours: 3, assignedTo: user.id });
    await api('Maintenance', 'POST', mt('/pm/schedules'), { assetId: chiller.id, name: 'Coolant over temperature', triggerKind: 'condition', meterId: coolant.id, condAbove: 25, jobType: 'inspection', priority: 'high', leadDays: 1, tasks: ['Check the coolant level', 'Clean the condenser fins'] });
    await api('Maintenance', 'POST', mt(`/pm/templates?today=${d(0)}`), { name: 'Quarterly machine safety check', assetCategory: 'Machine', triggerKind: 'time', intervalN: 3, intervalUnit: 'month', basis: 'fixed', startDate: d(10), jobType: 'inspection', tasks: ['Check the guards and the emergency stops', 'Check the warning labels'], estimatedHours: 0.5 });
    // A breakdown last fortnight, repaired, with its downtime (for the reliability report).
    const burst = await api('Maintenance', 'POST', mt('/work-orders'), { assetId: brake.id, description: 'Hydraulic hose burst on the press brake', jobType: 'breakdown', priority: 'urgent', assignedTo: user.id, trade: 'Mechanical fitter' });
    await api('Maintenance', 'PUT', mt(`/work-orders/${burst.id}/downtime`), { startedAt: at(-12, 9), endedAt: at(-12, 12.5), cause: 'Hose burst' });
    await api('Maintenance', 'POST', mt(`/work-orders/${burst.id}/labour`), { date: d(-12), minutes: 150, note: 'Hose replaced and bled' });
    await api('Maintenance', 'POST', mt(`/work-orders/${burst.id}/complete`), { notes: 'Hose replaced, system bled and tested.' });
    // Today's prestart of the laser, passed, with its hours.
    const ps = await api('Maintenance', 'GET', mt(`/assets/${laser.id}/prestart`));
    await api('Maintenance', 'POST', mt('/prestarts'), {
      assetId: laser.id,
      results: ps.template.items.map((x: any) => (x.kind === 'number' ? { itemId: x.id, value: 10 } : { itemId: x.id, passed: true })),
      reading: { meterId: laserHours.id, value: 4215 },
      today: d(0),
    });

    // ---------------------------------------------------------------- Quality (ERP Release 4 part A)
    // A released incoming inspection plan for the bracket arms, the incoming inspection of the arms received above (one
    // sample under the minimum thickness, so it failed), a nonconformance with its containment and root cause, and a
    // corrective action, approved under the recorded one-person exception and in progress. No stock moves: the arms stay
    // where Releases 2 and 3 put them.
    const plan = await api('Quality', 'POST', e('/qc-plans'), {
      name: 'Incoming check of laser-cut bracket arms',
      kind: 'incoming',
      productId: arm.id,
      supplierId: steel.id,
      description: 'Three arms from every delivery: thickness, length and edges.',
      characteristics: [
        { name: 'Plate thickness', kind: 'dimension', unit: 'mm', nominal: 3, tolerance: 0.15, sampleSize: 3, instructions: 'Micrometer, 10 mm from the cut edge.' },
        { name: 'Arm length', kind: 'dimension', unit: 'mm', nominal: 240, tolerance: 0.5, sampleSize: 3 },
        { name: 'Edges free of burrs', kind: 'visual', sampleSize: 3 },
      ],
    });
    await api('Quality', 'POST', e(`/qc-plans/${plan.id}/release`), { note: 'Agreed with the supplier' });
    const armReceipt = (await api('Quality', 'GET', e(`/purchase-orders/${po.id}`))).receipts[0];
    const armLine = (await api('Quality', 'GET', e(`/receipts/${armReceipt.id}`))).lines[0];
    const qi = await api('Quality', 'POST', e('/inspections'), { sourceType: 'receipt_line', sourceId: armLine.id });
    const [thick, length, edges] = (await api('Quality', 'GET', e(`/inspections/${qi.id}`))).characteristics;
    await api('Quality', 'PUT', e(`/inspections/${qi.id}/readings`), {
      readings: [
        { charId: thick.id, sampleNo: 1, value: 3.02 },
        { charId: thick.id, sampleNo: 2, value: 2.81, note: 'Thin near the bend line' },
        { charId: thick.id, sampleNo: 3, value: 2.98 },
        { charId: length.id, sampleNo: 1, value: 240.1 },
        { charId: length.id, sampleNo: 2, value: 239.8 },
        { charId: length.id, sampleNo: 3, value: 240.2 },
        ...[1, 2, 3].map((sampleNo) => ({ charId: edges.id, sampleNo, conforming: true })),
      ],
    });
    await api('Quality', 'POST', e(`/inspections/${qi.id}/complete`), { notes: 'One of three arms under the minimum thickness.' });
    const ncr = await api('Quality', 'POST', e('/ncrs'), {
      title: 'Bracket arm under the minimum plate thickness',
      description: 'One sampled arm measured 2.81 mm against 3.00 ± 0.15 mm. The rest of the delivery may be thin too.',
      severity: 'major',
      inspectionIds: [qi.id],
    });
    await api('Quality', 'POST', e(`/ncrs/${ncr.id}/contain`), { containment: 'Every arm of this delivery is to be measured before use. The ten reserved for MO-00001 were measured first and are within the limits.' });
    await api('Quality', 'POST', e(`/ncrs/${ncr.id}/investigate`), {
      method: 'five_whys',
      whys: ['The arm was cut from plate rolled under thickness.', 'The supplier checks one sheet per batch.', 'Their plan sets no sample size for thin plate.'],
      rootCause: 'The supplier samples too few sheets of thin plate.',
    });
    const capa = await api('Quality', 'POST', e('/capas'), {
      kind: 'corrective',
      ncrId: ncr.id,
      title: 'Agree a sampling plan for thin plate with Example Steel Supplies',
      description: 'Ask for three sheets checked per batch, with their thickness readings sent with each delivery.',
      responsibleId: user.id,
      dueDate: d(10),
    });
    await api('Quality', 'POST', e(`/capas/${capa.id}/approve`), { note: 'Approved' });
    await api('Quality', 'POST', e(`/capas/${capa.id}/start`), {});

    // ---------------------------------------------------------------- Supply chain (ERP Release 5 part A)
    // A carrier; a sales order for Harbour Cafe (the CRM company and its contact, billed as the Finance customer above):
    // six shelf bracket kits from stock (opening stock in the finished goods location), allocated, picked, packed,
    // dispatched with the dispatch email asked for (the example company sends none, and the shipment says so), delivered,
    // and its draft invoice in Finance; ten bracket weldments made to order through a draft manufacturing order; and a
    // return of one kit, authorised, received into quarantine, with its draft credit note. The bracket arms stay as they
    // were.
    const carrier = await api('Supply chain', 'POST', e('/carriers'), { code: 'EXFR', name: 'Example Freight', services: ['Road', 'Overnight'], trackingUrl: 'https://track.example.com/?n={tracking}', email: 'bookings@freight.example.com', notes: 'Invented carrier for the example company.' });
    await api('Supply chain', 'POST', e('/adjustments'), { productId: kit.id, locationId: fgLoc.id, quantity: 6, unitCostCents: 2450, reason: 'Opening stock of packed kits' });
    const so = await api('Supply chain', 'POST', e('/sales-orders'), {
      crmCompanyId: companies.harbour,
      crmContactId: contacts.dana,
      finContactId: customer.id,
      requestedDate: d(5),
      promisedDate: d(7),
      customerPo: 'HC-2041',
      shippingTerms: 'Delivered to the cafe',
      deliveryAddress: 'Harbour Cafe, 2 Example Wharf, Exampleville',
      lines: [
        { productId: kit.id, quantity: 6, taxCode: 'GST' },
        { productId: weld.id, quantity: 10, unitPriceCents: 1500, taxCode: 'GST', fulfil: 'make', description: 'Bracket weldment, powder coated (made to order)' },
      ],
      confirm: true,
    });
    await api('Supply chain', 'POST', e(`/sales-orders/${so.id}/allocate`), {});
    const soView = await api('Supply chain', 'GET', e(`/sales-orders/${so.id}`));
    await api('Supply chain', 'POST', e(`/sales-orders/${so.id}/lines/${soView.lines[1].id}/make`), {});
    const shp = await api('Supply chain', 'POST', e(`/sales-orders/${so.id}/shipments`), { carrierId: carrier.id, service: 'Road', freightCostCents: 1800, freightChargeCents: 2500, plannedDate: d(0), windowStart: d(0), windowEnd: d(1), notify: true });
    const shpView = await api('Supply chain', 'GET', e(`/shipments/${shp.id}`));
    await api('Supply chain', 'POST', e(`/shipments/${shp.id}/pick`), { lines: shpView.picks.map((k: any) => ({ pickLineId: k.id, pickedQty: k.suggestedQty })) });
    await api('Supply chain', 'POST', e(`/shipments/${shp.id}/packages`), { kind: 'carton', weightKg: 9.6, lengthCm: 60, widthCm: 40, heightCm: 25, contents: [{ soLineId: soView.lines[0].id, quantity: 6 }], notes: 'Six kits, taped and labelled' });
    await api('Supply chain', 'POST', e(`/shipments/${shp.id}/packed`), {});
    await api('Supply chain', 'POST', e(`/shipments/${shp.id}/dispatch`), { trackingNumber: 'EXF000123' });
    await api('Supply chain', 'POST', e(`/shipments/${shp.id}/deliver`), { receivedBy: 'Dana Webb', note: 'Signed at the counter' });
    await api('Supply chain', 'POST', e(`/shipments/${shp.id}/invoice`));
    const rma = await api('Supply chain', 'POST', e('/rmas'), { soId: so.id, shipmentId: shp.id, reason: 'damaged', details: 'One kit box crushed in transit', lines: [{ soLineId: soView.lines[0].id, quantity: 1 }] });
    await api('Supply chain', 'POST', e(`/rmas/${rma.id}/authorise`), { note: 'Photo of the box checked' });
    const rmaView = await api('Supply chain', 'GET', e(`/rmas/${rma.id}`));
    await api('Supply chain', 'POST', e(`/rmas/${rma.id}/receive`), { lines: [{ lineId: rmaView.lines[0].id, quantity: 1, locationId: quarLoc.id }], note: 'Box crushed; kit to be inspected' });
    await api('Supply chain', 'POST', e(`/rmas/${rma.id}/credit-note`));

    // ---------------------------------------------------------------- the newer modules (modules framework, migration 0038)
    // A few invented records in each, made through the modules' own API: the legal entity that keeps its books in the
    // example's Finance, a location, the person's own employee record (so their leave and payslips show), a leave type and
    // a request waiting for approval, a course and training, a fixed asset in service with the Finance posting accounts
    // suggested from the chart saved (posting is left for the person to try), a contract, a service ticket, a vehicle and a
    // fuel purchase, a price list and a promotion for the kit, a revenue schedule, a pay run worked out and an instrument
    // due for calibration. In a company of one the approvals are the recorded exception.
    const x = (o: string, p = '') => e(`/x/o/${o}${p}`);
    const make = async (o: string, data: Record<string, unknown>, lines?: unknown[]) => (await api('Modules', 'POST', x(o), { data, ...(lines ? { lines } : {}) })).record.id as string;
    const go = (o: string, id: string, s: string, note?: string) => api('Modules', 'POST', x(o, `/${id}/step/${s}`), { note: note ?? null });
    const monday = (() => {
      const dow = today.getUTCDay();
      return (8 - dow) % 7 || 7;
    })();
    await make('org_entity', { name: 'Acme Studio Pty Ltd (example)', entityType: 'parent', country: 'AU', currency: 'AUD', finWorkspace: fin.id });
    const workshop = await make('org_location', { name: 'Workshop (example)', locationType: 'plant' });
    const annual = await make('hr_leave_type', { name: 'Annual leave', paid: true, annualDays: 20 });
    const me = await make('hr_employee', { firstName: 'Alex', lastName: 'Morgan (example)', user: user.id, position: 'Studio manager', location: workshop, employmentType: 'full_time', startDate: d(-400), hoursPerWeek: 38, payBasis: 'salary', annualSalary: 9_100_000, withholdingPct: 25 });
    await go('hr_employee', me, 'activate');
    const leave = await make('hr_leave', { employee: me, leaveType: annual, fromDate: d(monday + 14), toDate: d(monday + 18) });
    await go('hr_leave', leave, 'submit');
    const firstAid = await make('tr_course', { name: 'First aid (example)', provider: 'Example Training Co', delivery: 'classroom', durationHours: 8, validityMonths: 36, mandatory: true });
    // completed almost three years ago, so it shows as expiring soon
    const trained = await make('tr_record', { employee: me, course: firstAid, plannedDate: d(-1060), completedDate: d(-1060), result: 'passed', trainer: 'Example trainer' });
    await go('tr_record', trained, 'complete');
    const cutter = await make('fa_asset', { name: 'Laser cutter (example)', category: 'plant', assetTag: 'FA-LASER-1', acquisitionDate: d(-200), cost: 4_500_000, residualValue: 300_000, usefulLifeMonths: 60, method: 'straight_line', currency: 'AUD', location: workshop });
    await go('fa_asset', cutter, 'place');
    const posting = await api('Modules', 'GET', e('/x/postings'));
    await api('Modules', 'PUT', e('/x/postings'), { accounts: Object.fromEntries(posting.roles.filter((r: any) => r.suggested).map((r: any) => [r.role, r.suggested.id])) });
    await make('ct_contract', { title: 'Maintenance support for the workshop (example)', partyType: 'other', otherParty: 'Example Service Co', contractType: 'service', startDate: d(-60), endDate: d(305), value: 480_000, currency: 'AUD', autoRenew: true, noticeDays: 30, owner: user.id });
    await make('sv_ticket', { subject: 'Bracket kit arrived with a missing wall plug (example)', priority: 'normal', channel: 'email', category: 'problem', product: kit.id, assignee: user.id, description: 'Invented example: a customer reports one wall plug missing from a kit.' });
    const van = await make('fl_vehicle', { registration: 'EXAMPLE1', make: 'Example', model: 'Van', year: 2023, vehicleType: 'van', fuel: 'diesel', driver: user.id, location: workshop });
    await make('fl_fuel', { vehicle: van, date: d(-6), litres: 62.5, cost: 13_750, odometer: 41_250, station: 'Example fuel stop' });
    const prices = await make('pr_pricelist', { name: 'Trade prices (example)', customerGroup: 'Trade', currency: 'AUD', validFrom: d(-30) }, [{ product: kit.id, minQty: 10, unitPrice: 3_400 }, { product: kit.id, minQty: 50, unitPrice: 3_100 }]);
    await go('pr_pricelist', prices, 'activate');
    const promo = await make('pr_promotion', { name: 'Spring offer (example)', code: 'SPRING10', discountType: 'percent', discountValue: 10, product: kit.id, validFrom: d(-7), validTo: d(23) });
    await go('pr_promotion', promo, 'activate');
    const support = await make('rr_schedule', { name: 'Annual support plan (example)', total: 1_200_000, currency: 'AUD', startDate: `${d(-90).slice(0, 7)}-01`, endDate: `${d(270).slice(0, 7)}-28` });
    await go('rr_schedule', support, 'activate');
    const pay = await make('py_run', { periodStart: d(-14), periodEnd: d(-1), payDate: d(2), frequency: 'fortnightly', contributionPct: 12, currency: 'AUD' });
    await api('Modules', 'POST', x('py_run', `/${pay}/action/calculate`), { input: {} });
    await make('cal_instrument', { name: 'Digital caliper (example)', instrumentType: 'Caliper', serialNumber: 'EX-0001', range: '0 to 150 mm', tolerance: '0.02 mm', location: workshop, intervalDays: 365 });

    // ---------------------------------------------------------------- Health and Safety (BIZOMAT WHS, Release 1)
    // The workshop site in New South Wales (its legal pack is not verified, so no deadline is ever computed from it), a
    // hazard at the press brake rated high with an engineering control assigned, an approved JSA for the lens change of
    // the laser cutter, a near miss with an overdue preventive action, an injury with its investigation by five whys and
    // fishbone, its corrective actions, and a regulator notification record that says plainly it is example data: no
    // regulator was contacted. Twelve months of invented hours worked, so the dashboard can show frequency rates. Every
    // name is invented; the health record holds nothing but a made-up line. No email is sent.
    const w = (p: string) => `/api/whs/c/${companyId}${p}`;
    await api('WHS', 'PUT', w(`/sites/${mtSite.id}/jurisdictions`), { packIds: ['au-nsw'] });
    await api('WHS', 'PUT', w('/hours'), { entries: Array.from({ length: 12 }, (_, i) => ({ siteId: mtSite.id, month: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - i, 1)).toISOString().slice(0, 7), hours: 1520 })) });
    const hz = await api('WHS', 'POST', w('/hazards'), {
      title: 'Open pinch point at the press brake back gauge',
      category: 'machinery',
      description: 'The back gauge fingers move without a guard while the setter adjusts them between jobs.',
      siteId: mtSite.id,
      location: 'Fabrication bay, press brake',
      assetId: brake.id,
      activity: 'Setting up the back gauge between jobs',
      peopleExposed: 'Press brake setters and operators',
      consequenceText: 'Crushed or cut fingers',
      existingControls: 'Setters told to keep hands clear; cut-resistant gloves',
    });
    await api('WHS', 'POST', w(`/hazards/${hz.id}/assess`), { likelihood: 3, consequence: 4, note: 'Seen twice this month' });
    await api('WHS', 'POST', w(`/hazards/${hz.id}/controls`), {
      proposedControls: 'Fit an interlocked guard over the back gauge; until then, set the gauge only with the machine isolated.',
      responsibleId: user.id,
      dueDate: d(14),
      actions: [
        { title: 'Fit an interlocked guard over the back gauge', hierarchy: 'engineering', priority: 'high', responsibleId: user.id, dueDate: d(14), evidenceRequired: true, evidenceNote: 'A photo of the guard fitted and the interlock test record' },
        { title: 'Isolate the press brake before every back gauge adjustment', hierarchy: 'isolation', priority: 'high', responsibleId: user.id, dueDate: d(3) },
      ],
    });
    await api('WHS', 'POST', w(`/hazards/${hz.id}/advance`), { to: 'implementation', note: 'Guard ordered from Example Machines' });
    const jsa = await api('WHS', 'POST', w('/risk-assessments'), {
      kind: 'jsa',
      title: 'Changing the lens of the laser cutter',
      activity: 'Lens change on the laser cutter',
      siteId: mtSite.id,
      assetId: laser.id,
      responsibleId: user.id,
      reviewDate: d(180),
      content: {
        steps: [
          { key: 's1', step: 'Isolate and lock out the laser and the chiller' },
          { key: 's2', step: 'Open the cutting head and remove the lens' },
          { key: 's3', step: 'Fit the new lens, close the head and test' },
        ],
        lines: [
          { stepKey: 's1', hazard: 'Unexpected start of the laser', harm: 'Burns, eye injury', persons: 'The technician', likelihood: 2, consequence: 5, residualLikelihood: 1, residualConsequence: 5, controls: [{ stage: 'existing', hierarchy: 'isolation', description: 'Lock out the laser and the chiller with a personal lock', effectiveness: 'effective' }, { stage: 'existing', hierarchy: 'administrative', description: 'Try the start button after isolating', effectiveness: 'effective' }] },
          { stepKey: 's2', hazard: 'Hot optics and sharp edges inside the head', harm: 'Burns and cuts to the hands', persons: 'The technician', likelihood: 3, consequence: 2, residualLikelihood: 2, residualConsequence: 2, controls: [{ stage: 'existing', hierarchy: 'administrative', description: 'Wait 15 minutes for the head to cool', effectiveness: 'effective' }, { stage: 'additional', hierarchy: 'ppe', description: 'Cut-resistant gloves', effectiveness: 'not_assessed' }] },
          { stepKey: 's3', hazard: 'Stray laser light during the test', harm: 'Eye injury', persons: 'The technician and people nearby', likelihood: 2, consequence: 4, residualLikelihood: 1, residualConsequence: 4, controls: [{ stage: 'existing', hierarchy: 'engineering', description: 'Test with the enclosure doors closed and interlocked', effectiveness: 'effective' }] },
        ],
      },
    });
    await api('WHS', 'POST', w(`/risk-assessments/${jsa.assessment.id}/submit`), {});
    await api('WHS', 'POST', w(`/risk-assessments/${jsa.assessment.id}/approve`), { note: 'Checked with the technician on the floor' });
    const at2 = (offset: number, hour: number) => today.getTime() + offset * DAY + hour * 3_600_000;
    const near = await api('WHS', 'POST', w('/incidents'), {
      kind: 'near_miss',
      title: 'Forklift reversed close to a person in the store',
      description: 'A forklift reversing out of aisle A passed about a metre from a person walking to the receiving bay. Nobody was hurt.',
      occurredDate: d(-9),
      occurredTime: '10:15',
      occurredAt: at2(-9, 10.25),
      siteId: mtSite.id,
      location: 'Workshop store, aisle A',
      immediateResponse: 'Work stopped in the aisle; the driver and the person were spoken to.',
      severity: 'minor',
      outcome: 'none',
    });
    await api('WHS', 'POST', w(`/incidents/${near.id}/respond`), { immediateResponse: 'Work stopped in the aisle; the driver and the person were spoken to.' });
    await api('WHS', 'POST', w(`/incidents/${near.id}/classify`), { kind: 'near_miss', severity: 'moderate', outcome: 'none', investigationRequired: false, note: 'No walkway markings in the store' });
    await api('WHS', 'POST', w(`/incidents/${near.id}/advance`), { to: 'corrective_action' });
    const walk = await api('WHS', 'POST', w('/actions'), { sourceType: 'incident', sourceId: near.id, kind: 'preventive', title: 'Mark pedestrian walkways and a crossing in the store', hierarchy: 'isolation', priority: 'high', responsibleId: user.id, dueDate: d(-2) });
    await api('WHS', 'POST', w(`/actions/${walk.id}/start`), {});
    const injury = await api('WHS', 'POST', w('/incidents'), {
      kind: 'injury',
      title: 'Cut to the hand while handling a bracket arm',
      description: 'A worker unloading laser-cut bracket arms cut the back of the hand on a sharp edge.',
      occurredDate: d(-4),
      occurredTime: '14:30',
      occurredAt: at2(-4, 14.5),
      siteId: mtSite.id,
      location: 'Fabrication bay, laser unloading table',
      activity: 'Unloading cut parts',
      peopleInvolved: 'One worker (example)',
      witnesses: 'Sam Rivers (example)',
      immediateResponse: 'First aid given; the worker was taken to a clinic for treatment.',
      firstAid: true,
      outcome: 'medical_treatment',
      severity: 'moderate',
      // invented and minimal: shown only to a health officer (in the example company, its owner)
      health: { personName: 'Example worker', treatment: 'Example only: wound cleaned and dressed at a clinic.', daysLost: 0 },
    });
    await api('WHS', 'POST', w(`/incidents/${injury.id}/respond`), { immediateResponse: 'First aid given; the worker was taken to a clinic for treatment.', firstAid: true, initialNotification: 'Supervisor told in person at 14:35' });
    await api('WHS', 'POST', w(`/incidents/${injury.id}/classify`), { kind: 'injury', severity: 'moderate', outcome: 'medical_treatment', bodyPart: 'Left hand', injuryNature: 'Laceration', investigationRequired: true });
    const invView = await api('WHS', 'POST', w(`/incidents/${injury.id}/investigation`), { leadId: user.id, method: 'both', scope: 'How sharp edges reach the unloading table, and why gloves were not worn.' });
    const inv = invView.investigation;
    await api('WHS', 'POST', w(`/investigations/${inv.id}/timeline`), { at: `${d(-4)} 14:20`, description: 'Unloading of the bracket arm batch started' });
    await api('WHS', 'POST', w(`/investigations/${inv.id}/timeline`), { at: `${d(-4)} 14:30`, description: 'The worker cut the back of the left hand on an arm’s edge' });
    await api('WHS', 'POST', w(`/investigations/${inv.id}/timeline`), { at: `${d(-4)} 14:35`, description: 'First aid given; the supervisor was told' });
    await api('WHS', 'POST', w(`/investigations/${inv.id}/statements`), { witness: 'Sam Rivers (example)', takenOn: d(-3), statement: 'Invented example statement: I saw the arms come off the table with sharp edges. Gloves were on the shelf by the door.' });
    await api('WHS', 'PATCH', w(`/investigations/${inv.id}`), {
      whys: ['The worker cut the hand on an arm’s edge.', 'The edge was sharp.', 'Arms are not deburred before unloading.', 'Deburring was moved to the end of the line last month.', 'Nobody assessed the change to the work.'],
      fishbone: { methods: ['Deburring moved after unloading'], materials: ['Sharp laser-cut edges'], people: ['Gloves not worn for a short job'], management: ['No review of the change to the work'] },
      rootCause: 'The work changed without its risk assessment being reviewed, so sharp parts reach the unloading table.',
      factors: ['A short, rushed job', 'Gloves kept away from the table'],
      failedControls: [{ control: 'Cut-resistant gloves', hierarchy: 'ppe', why: 'Not worn: kept by the door' }],
      findings: 'Deburr parts before they are unloaded, and review the unloading task’s risk assessment.',
    });
    await api('WHS', 'POST', w(`/investigations/${inv.id}/submit`), {});
    await api('WHS', 'POST', w(`/investigations/${inv.id}/approve`), { decision: 'approve', note: 'Root cause agreed' });
    await api('WHS', 'POST', w('/actions'), { sourceType: 'investigation', sourceId: inv.id, kind: 'corrective', title: 'Deburr bracket arms before they leave the laser cell', hierarchy: 'engineering', priority: 'high', responsibleId: user.id, dueDate: d(10), evidenceRequired: true, evidenceNote: 'A photo of the deburred parts at the unloading table' });
    await api('WHS', 'POST', w('/actions'), { sourceType: 'investigation', sourceId: inv.id, kind: 'preventive', title: 'Keep cut-resistant gloves at the unloading table', hierarchy: 'ppe', priority: 'medium', responsibleId: user.id, dueDate: d(5) });
    await api('WHS', 'POST', w('/links'), { fromType: 'incident', fromId: injury.id, toType: 'risk_assessment', toId: jsa.assessment.id });
    // A regulator notification record, to show how one is kept. EXAMPLE DATA: no regulator was contacted.
    await api('WHS', 'POST', w(`/incidents/${injury.id}/notification/decision`), { packId: 'au-nsw', decision: 'notifiable', reasons: 'Example data: recorded to show how a decision and a submission are kept. In a real case a WHS manager decides from the verified rule and the regulator’s guidance.', responsibleId: user.id });
    const nv = await api('WHS', 'GET', w(`/incidents/${injury.id}/notification`));
    await api('WHS', 'POST', w(`/incidents/${injury.id}/notification/${nv.notices[0].id}/submission`), { method: 'online', submittedAt: at2(-4, 16), submittedById: user.id, reference: 'EXAMPLE-0001 (invented)', notes: 'Example data only: no notification was made to any regulator.' });
  });
}

type Span = (from: number, to: number) => { start: string; end: string };
interface ExampleItem { group: number; name: string; status: string; timeline: { start: string; end: string }; priority: string; effort: number; budget?: number }

function BOARDS(span: Span): { name: string; groups: { name: string; color: string }[]; items: ExampleItem[] }[] {
  return [
    {
      name: 'Website relaunch',
      groups: [
        { name: 'Discovery', color: '#0ea5e9' },
        { name: 'Design and build', color: '#f5a524' },
        { name: 'Launch', color: '#00a36c' },
      ],
      items: [
        { group: 0, name: 'Audit current site content', status: 'done', timeline: span(-20, -14), priority: 'medium', effort: 5, budget: 1200 },
        { group: 0, name: 'Define site map and goals', status: 'done', timeline: span(-13, -9), priority: 'high', effort: 4 },
        { group: 1, name: 'Wireframes for key pages', status: 'done', timeline: span(-8, -4), priority: 'high', effort: 5, budget: 2500 },
        { group: 1, name: 'Visual design system', status: 'working', timeline: span(-3, 3), priority: 'high', effort: 6, budget: 4000 },
        { group: 1, name: 'Write new product page copy', status: 'working', timeline: span(-2, 1), priority: 'critical', effort: 3 },
        { group: 1, name: 'Migrate blog posts', status: 'stuck', timeline: span(-5, -1), priority: 'medium', effort: 4 },
        { group: 2, name: 'QA on staging', status: 'todo', timeline: span(9, 12), priority: 'high', effort: 4 },
        { group: 2, name: 'Go live', status: 'todo', timeline: span(13, 13), priority: 'critical', effort: 1 },
      ],
    },
    {
      name: 'Product launch',
      groups: [
        { name: 'Prepare', color: '#5b5bd6' },
        { name: 'Launch week', color: '#f5a524' },
        { name: 'After launch', color: '#00a36c' },
      ],
      items: [
        { group: 0, name: 'Finalise pricing and packaging', status: 'done', timeline: span(-14, -9), priority: 'critical', effort: 5 },
        { group: 0, name: 'Press kit and screenshots', status: 'working', timeline: span(-3, 2), priority: 'medium', effort: 3, budget: 1500 },
        { group: 0, name: 'Update help centre articles', status: 'todo', timeline: span(1, 5), priority: 'medium', effort: 3 },
        { group: 1, name: 'Email announcement', status: 'todo', timeline: span(6, 7), priority: 'high', effort: 2 },
        { group: 1, name: 'Launch webinar', status: 'todo', timeline: span(9, 9), priority: 'high', effort: 1, budget: 800 },
        { group: 2, name: 'Collect early customer feedback', status: 'todo', timeline: span(12, 20), priority: 'medium', effort: 5 },
      ],
    },
  ];
}

const text = (t: string, marks?: unknown[]) => ({ type: 'text', text: t, ...(marks ? { marks } : {}) });
const para = (...content: unknown[]) => ({ type: 'paragraph', content });
const heading = (level: number, t: string) => ({ type: 'heading', attrs: { level }, content: [text(t)] });
const bullets = (...items: string[]) => ({ type: 'bulletList', content: items.map((t) => ({ type: 'listItem', content: [para(text(t))] })) });

function BRIEF(d: (offset: number) => string) {
  return {
    type: 'doc',
    content: [
      para(text('This brief is invented example content for '), text('Acme Studio', [{ type: 'bold' }]), text(', the example company. Change it, or anything else here: it affects nothing outside the example.')),
      heading(2, 'Goal'),
      para(text('Relaunch the website with a clearer product story, faster pages and a content system the team can update without help.')),
      heading(2, 'Scope'),
      bullets('New home, product and pricing pages', 'Blog moved to the new content system', 'Redirects for every retired page'),
      heading(2, 'Milestones'),
      bullets(`Design system ready: ${d(3)}`, `Content system on staging: ${d(9)}`, `Go live: ${d(13)}`),
    ],
  };
}

const CRM_COMPANIES = [
  { key: 'harbour', name: 'Harbour Cafe', website: 'https://harbour-cafe.example.com', industry: 'hospitality' },
  { key: 'northside', name: 'Northside Physio', website: 'https://northside-physio.example.com', industry: 'healthcare' },
  { key: 'ridge', name: 'Ridge Tools', website: 'https://ridge-tools.example.com', industry: 'manufacturing' },
];
const CRM_CONTACTS = [
  { key: 'dana', firstName: 'Dana', lastName: 'Webb', email: 'dana@harbour-cafe.example.com', jobTitle: 'Owner', company: 'harbour' },
  { key: 'omar', firstName: 'Omar', lastName: 'Hale', email: 'omar@northside-physio.example.com', jobTitle: 'Practice manager', company: 'northside' },
  { key: 'ivy', firstName: 'Ivy', lastName: 'Brooks', email: 'ivy@ridge-tools.example.com', jobTitle: 'Marketing lead', company: 'ridge' },
];
const CRM_DEALS = [
  { title: 'Website relaunch for Harbour Cafe', value: 1_850_000, company: 'harbour' },
  { title: 'Brand refresh for Northside Physio', value: 940_000, company: 'northside' },
  { title: 'Product launch campaign for Ridge Tools', value: 2_600_000, company: 'ridge' },
];
const CRM_LEADS = [
  { firstName: 'Tara', lastName: 'Quinn', email: 'tara@quinn-joinery.example.com' },
  { firstName: 'Leo', lastName: 'Marsh', email: 'leo@marsh-dental.example.com' },
];
const FIN_TRANSACTIONS: [string, number, string, number, string][] = [
  ['receive', -40, '200', 1_210_000, 'GST'],
  ['receive', -18, '200', 880_000, 'GST'],
  ['spend', -25, '453', 132_000, 'GSTP'],
  ['spend', -6, '453', 275_000, 'GSTP'],
];
