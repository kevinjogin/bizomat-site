// Data export (Stage 1, R7; brief 7.6 "Data export requirements"; docs/platform/compliance.md).
//
// Every person can export their own data at any time; a company's owner and administrators can export the company.
// An export is built by the 15-minute run (a background job), as a ZIP of JSON and CSV per module plus attached files,
// stored privately and fetched with a link that works for 7 days, only signed in as the person who asked (the link is
// useless to anyone else, so it carries no secret of its own). Asking, building and
// downloading are each written to the audit log. An export never holds another company's data or another person's
// personal data beyond what the person may see: a personal export holds the person's own records only, and records they
// made in a registered company's tools only where that company allows it (company setting export.personal_records).

import { zipSync, strToU8 } from 'fflate';
import type { Env } from '../env';
import { HttpError, newId, now, parseJson } from '../lib/util';
import { auditStmt } from '../services/audit';
import { enqueueEmail } from '../services/email/outbox';
import { companyTools } from '../company/access';
import { companyOwnedTables } from '../platform/integrity';

export const LINK_DAYS = 7;
const MAX_ROWS = 100_000;
const MAX_FILE_BYTES = 50 * 1024 * 1024;
// Never exported: credentials and secrets, whoever asks.
const SECRET_COLUMN = /(password|hash|secret|token|_enc$|api_key|private_key)/i;

type Rows = Record<string, unknown>[];

function clean(rows: Rows): Rows {
  return rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => !SECRET_COLUMN.test(k))));
}

export function toCsv(rows: Rows): string {
  if (!rows.length) return '';
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\r\n') + '\r\n';
}

class Bundle {
  files: Record<string, Uint8Array> = {};
  index: { module: string; rows: number }[] = [];
  add(module: string, rows: Rows) {
    const safe = clean(rows);
    this.files[`${module}.json`] = strToU8(JSON.stringify(safe, null, 2));
    this.files[`${module}.csv`] = strToU8(toCsv(safe));
    this.index.push({ module, rows: safe.length });
  }
  zip(meta: Record<string, unknown>): Uint8Array {
    this.files['README.json'] = strToU8(JSON.stringify({ ...meta, modules: this.index }, null, 2));
    return zipSync(this.files, { level: 6 });
  }
}

async function columns(db: D1Database, table: string): Promise<string[]> {
  return (await db.prepare(`SELECT name FROM pragma_table_info('${table}')`).all<{ name: string }>()).results.map((r) => r.name);
}

async function tablesWith(db: D1Database, prefix: RegExp, column: string): Promise<string[]> {
  const all = (await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all<{ name: string }>()).results.map((r) => r.name);
  const out: string[] = [];
  for (const t of all) if (prefix.test(t) && /^[a-z_][a-z0-9_]*$/.test(t) && (await columns(db, t)).includes(column)) out.push(t);
  return out;
}

const rowsOf = async (db: D1Database, sql: string, ...args: unknown[]) => (await db.prepare(`${sql} LIMIT ${MAX_ROWS}`).bind(...args).all()).results as Rows;

/** May the person's records in this company's tools go in their personal export? Personal and example: yes. */
async function companyAllowsPersonal(db: D1Database, companyId: string | null): Promise<boolean> {
  if (!companyId) return true;
  const co = await db.prepare('SELECT type FROM companies WHERE id = ?').bind(companyId).first<{ type: string }>();
  if (!co || co.type !== 'registered') return true;
  const s = await db.prepare("SELECT value_json FROM company_settings WHERE company_id = ? AND key = 'export.personal_records'").bind(companyId).first<{ value_json: string }>();
  return parseJson<boolean>(s?.value_json, false) === true;
}

async function personalBundle(env: Env, userId: string): Promise<Bundle> {
  const db = env.DB;
  const { companyOfTool } = await import('../platform/context');
  const b = new Bundle();
  b.add('profile', await rowsOf(db, 'SELECT * FROM users WHERE id = ?', userId));
  b.add('sign_in_methods', await rowsOf(db, 'SELECT provider, email, created_at FROM user_identities WHERE user_id = ?', userId));
  b.add('sessions', await rowsOf(db, 'SELECT provider, user_agent, ip, created_at, last_seen_at, ended_at, end_reason FROM sessions WHERE user_id = ? ORDER BY created_at DESC', userId));
  b.add('notification_preferences', await rowsOf(db, 'SELECT * FROM notification_preferences WHERE user_id = ?', userId));
  b.add('notifications', await rowsOf(db, 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', userId));
  b.add('activity', await rowsOf(db, 'SELECT action, target_type, target_id, metadata_json, ip, created_at FROM audit_log WHERE actor_id = ? ORDER BY created_at DESC', userId));
  // Records the person made in tools they are still in, where the tool's company allows it.
  const ws = (await db.prepare("SELECT workspace_id AS id FROM workspace_members WHERE user_id = ? AND status = 'active'").bind(userId).all<{ id: string }>()).results;
  const allowedWs: string[] = [];
  for (const w of ws) if (await companyAllowsPersonal(db, await companyOfTool(db, 'tasks', w.id))) allowedWs.push(w.id);
  const inList = (n: number) => Array(n).fill('?').join(',');
  if (allowedWs.length) {
    b.add('items_created', await rowsOf(db, `SELECT * FROM items WHERE created_by = ? AND workspace_id IN (${inList(allowedWs.length)})`, userId, ...allowedWs));
    b.add('updates_written', await rowsOf(db, `SELECT * FROM updates WHERE author_id = ? AND workspace_id IN (${inList(allowedWs.length)})`, userId, ...allowedWs).catch(() => []));
    b.add('documents_created', await rowsOf(db, `SELECT id, workspace_id, title, content_json, created_at, updated_at FROM documents WHERE created_by = ? AND workspace_id IN (${inList(allowedWs.length)})`, userId, ...allowedWs));
    b.add('time_entries', await rowsOf(db, `SELECT * FROM time_entries WHERE user_id = ? AND workspace_id IN (${inList(allowedWs.length)})`, userId, ...allowedWs).catch(() => []));
  }
  const crm = (await db.prepare('SELECT org_id AS id FROM crm_members WHERE user_id = ?').bind(userId).all<{ id: string }>()).results;
  const allowedCrm: string[] = [];
  for (const o of crm) if (await companyAllowsPersonal(db, await companyOfTool(db, 'crm', o.id))) allowedCrm.push(o.id);
  if (allowedCrm.length) {
    for (const t of ['crm_contacts', 'crm_companies', 'crm_leads', 'crm_deals', 'crm_notes']) {
      b.add(`${t}_created`, await rowsOf(db, `SELECT * FROM ${t} WHERE created_by = ? AND org_id IN (${inList(allowedCrm.length)})`, userId, ...allowedCrm).catch(() => []));
    }
  }
  return b;
}

async function companyBundle(env: Env, companyId: string): Promise<{ b: Bundle; files: { key: string; name: string }[] }> {
  const db = env.DB;
  const b = new Bundle();
  b.add('company', await rowsOf(db, 'SELECT * FROM co_companies WHERE id = ?', companyId));
  b.add('registration', await rowsOf(db, 'SELECT * FROM companies WHERE id = ?', companyId));
  b.add('people', await rowsOf(db, 'SELECT m.role, m.title, m.tasks_role, m.crm_role, m.fin_role, m.joined_at, u.name, u.email FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ?', companyId));
  // Every table of the company's own (ERP, Maintenance, WHS, company area), by its company_id.
  for (const t of await companyOwnedTables(db)) {
    if (t === 'co_members' || t === 'api_tokens') continue;
    b.add(`company/${t}`, await rowsOf(db, `SELECT * FROM ${t} WHERE company_id = ?`, companyId));
  }
  const tools = await companyTools(db, companyId);
  const files: { key: string; name: string }[] = [];
  if (tools.tasks) {
    for (const t of await tablesWith(db, /^(?!crm_|fin_|co_|erp_|mt_|whs_|billing_)/, 'workspace_id')) b.add(`projects/${t}`, await rowsOf(db, `SELECT * FROM ${t} WHERE workspace_id = ?`, tools.tasks));
    const att = await db.prepare('SELECT r2_key AS key, file_name AS name FROM attachments WHERE workspace_id = ? LIMIT 5000').bind(tools.tasks).all<{ key: string; name: string }>().catch(() => ({ results: [] as { key: string; name: string }[] }));
    files.push(...att.results);
  }
  if (tools.crm) for (const t of await tablesWith(db, /^crm_/, 'org_id')) b.add(`crm/${t}`, await rowsOf(db, `SELECT * FROM ${t} WHERE org_id = ?`, tools.crm));
  if (tools.finance) for (const t of await tablesWith(db, /^fin_/, 'org_id')) b.add(`finance/${t}`, await rowsOf(db, `SELECT * FROM ${t} WHERE org_id = ?`, tools.finance));
  return { b, files };
}

/** Asks for an export (one waiting or being built at a time per person). */
export async function requestExport(env: Env, userId: string, scope: 'personal' | 'company', companyId: string | null, ip: string | null) {
  const db = env.DB;
  const open = await db.prepare("SELECT id FROM data_exports WHERE user_id = ? AND status IN ('queued', 'running')").bind(userId).first<{ id: string }>();
  if (open) throw new HttpError(409, 'An export is already being prepared. You get an email when it is ready.', { code: 'EXPORT_PENDING' });
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare("INSERT INTO data_exports (id, user_id, scope, company_id, status, created_at) VALUES (?, ?, ?, ?, 'queued', ?)").bind(id, userId, scope, companyId, t),
    auditStmt(db, { actorId: userId, action: 'export.requested', targetType: 'export', targetId: id, metadata: { scope, companyId }, ip: ip ?? undefined }),
  ]);
  return { id };
}

/** The background job (the 15-minute run): builds waiting exports, a couple a run, and expires old links. */
export async function runExports(env: Env, at = now(), max = 2) {
  const db = env.DB;
  const expired = await db.prepare("UPDATE data_exports SET status = 'expired' WHERE status = 'ready' AND expires_at <= ?").bind(at).run();
  const queued = await db.prepare("SELECT * FROM data_exports WHERE status = 'queued' ORDER BY created_at LIMIT ?").bind(max).all<{ id: string; user_id: string; scope: 'personal' | 'company'; company_id: string | null }>();
  let built = 0;
  for (const x of queued.results) {
    const claimed = await db.prepare("UPDATE data_exports SET status = 'running' WHERE id = ? AND status = 'queued'").bind(x.id).run();
    if (!claimed.meta.changes) continue;
    try {
      const meta = { bizomat: 'data export', scope: x.scope, createdAt: new Date(at).toISOString(), formats: 'JSON and CSV per module; attached files under files/' };
      let zip: Uint8Array;
      if (x.scope === 'personal') zip = (await personalBundle(env, x.user_id)).zip(meta);
      else {
        const { b, files } = await companyBundle(env, x.company_id!);
        let total = 0;
        const left: { key: string; name: string }[] = [];
        for (const f of files) {
          const obj = total < MAX_FILE_BYTES ? await env.FILES.get(f.key) : null;
          if (!obj) {
            left.push(f);
            continue;
          }
          const bytes = new Uint8Array(await obj.arrayBuffer());
          total += bytes.length;
          b.files[`files/${f.key.replace(/[^\w.-]+/g, '_')}_${f.name.replace(/[^\w.-]+/g, '_').slice(0, 80)}`] = bytes;
        }
        if (left.length) b.add('files_not_included', left.map((f) => ({ key: f.key, name: f.name, why: 'over the size limit of one export, or not found' })));
        zip = b.zip(meta);
      }
      const key = `exports/${x.user_id}/${x.id}.zip`;
      await env.FILES.put(key, zip, { httpMetadata: { contentType: 'application/zip' } });
      await db.batch([
        db.prepare("UPDATE data_exports SET status = 'ready', file_key = ?, size = ?, expires_at = ?, completed_at = ? WHERE id = ?").bind(key, zip.length, at + LINK_DAYS * 86_400_000, at, x.id),
        auditStmt(db, { actorId: x.user_id, action: 'export.built', targetType: 'export', targetId: x.id, metadata: { scope: x.scope, size: zip.length } }),
      ]);
      const u = await db.prepare('SELECT email, name FROM users WHERE id = ?').bind(x.user_id).first<{ email: string; name: string }>();
      if (u) {
        await enqueueEmail(env, {
          userId: x.user_id,
          to: u.email,
          toName: u.name,
          data: { template: 'notification', organisation: 'BIZOMAT', title: 'Your data export is ready', body: `Your ${x.scope} export is ready for ${LINK_DAYS} days. Download it from your account settings (Export your data) while signed in.`, url: null },
          idempotencyKey: `export:${x.id}`,
          sensitive: true,
        }).catch(() => null);
      }
      built++;
    } catch (e) {
      await db.prepare("UPDATE data_exports SET status = 'failed', error = ? WHERE id = ?").bind((e instanceof Error ? e.message : 'failed').slice(0, 200), x.id).run();
    }
  }
  return { built, expired: expired.meta.changes ?? 0 };
}
