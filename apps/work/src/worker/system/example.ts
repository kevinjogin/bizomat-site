// BIZOMAT ERP: the example company (owner's request, 14 Nov 2026: "add example site (Acme) to all users so they can learn
// and ensure its demo site only for accounts"). Table: migrations/0019_example_company.sql.
//
// Every person gets a company of invented example data of their own, "Acme Studio (example)": a Projects workspace, a
// CRM organisation, a Finance business workspace, Maintenance records, Products and Engineering and supplier records
// (ERP Release 1) and purchasing and inventory records (ERP Release 2), all named for it and owned by that person alone.
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
    // ---------------------------------------------------------------- Projects and Tasks
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
    await asset({ number: 'MC-0104-CH', name: 'Chiller unit', category: 'Component', parentId: laser.id, criticality: 'high' });
    const brake = await asset({ number: 'MC-0107', name: 'Press brake', category: 'Machine', manufacturer: 'Example Machines', model: 'PB-160', parentId: line.id, criticality: 'high' });
    const comp = await asset({ number: 'UT-0201', name: 'Air compressor', category: 'Utility', parentId: area.id, criticality: 'medium', status: 'under_maintenance' });
    const r1 = await api('Maintenance', 'POST', mt('/requests'), { assetId: laser.id, priority: 'high', description: 'Chiller alarm on the laser cutter: coolant temperature high after twenty minutes of cutting.' });
    await api('Maintenance', 'POST', mt('/requests'), { assetId: brake.id, priority: 'medium', description: 'Back gauge does not return to zero after a job change.' });
    await api('Maintenance', 'POST', mt('/requests'), { assetId: comp.id, priority: 'urgent', description: 'Air compressor tripping the breaker on start-up.' });
    await api('Maintenance', 'POST', mt(`/requests/${r1.id}/convert`), {
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
    await loc({ code: 'QUAR', name: 'Quarantine cage', level: 'zone', kind: 'quarantine', parentId: store.id });
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
