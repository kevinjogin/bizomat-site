// CAD Automation's sync with the ERP (docs/cad/README.md, "The contract"): POST /company/api/id/cad-sync, once a
// minute, with the client "cad"'s credentials (HTTP Basic, as /cad-status). CAD Automation sends its accounts (and how
// many computers, commands and AI connections each has, and how many have no company yet), its usage by company, the
// automation runs it finished, its worker's health and checksums of what it holds. The ERP answers, per account, which
// BIZOMAT account it is, the companies where it may use CAD Automation in the ERP, the company its existing computers,
// commands and AI connections belong to (only once that company has CAD Automation in the ERP), each company's limits
// and whether the old pages open in the ERP.
//
// Mapping (Part 3 of the brief, decision 2 of the audit): by BIZOMAT id, else by an email both sides have confirmed;
// placement: the one registered company the person is an active member of, else their own company when they are in
// none; anything else waits for a platform admin (status 'review'). An admin's decision is kept. Nothing is deleted.
//
// Contract 2 (owner's approval of 20 Nov 2026; docs/cad/README.md, "Contract 2"): an engine that says `contract: 2` is
// also told the companies where the person's role is read only (operate false: refused there, never by person) and
// whether each role may download (export); it sends the downloads made through AI assistants' links, which go into the
// company's history once each (cad_downloads); and it is told when password sign-in is retired (flag
// cad_password_retired, acting only while every account it reports is linked to a BIZOMAT account). An engine from
// before is told only the companies where the person may work, as before, so the order of the two deploys never
// widens anyone's access.

import { z } from 'zod';
import type { Env } from '../env';
import { newId, now, parseJson } from '../lib/util';
import { flagOn } from '../platform/flags';
import { eventStmt } from '../erp/util';
import { cadCompanies, limitsFor } from './access';
import type { CadLimits } from './keys';

const short = (n: number) => z.string().trim().max(n);
const id64 = z.string().trim().min(1).max(64);
const count = z.number().int().nonnegative().max(10_000_000);
const counts = z.object({ computers: count, commands: count, grants: count }).partial();

export const syncInput = z.object({
  contract: z.number().int().min(1).max(100).default(1),
  accounts: z
    .array(
      z.object({
        id: id64,
        email: z.string().trim().max(254),
        emailVerified: z.boolean(),
        sub: short(64).nullish(),
        created: z.number().nonnegative().nullish(),
        counts: counts.optional(),
        unassigned: counts.optional(),
      }),
    )
    .max(5000),
  companies: z
    .array(z.object({ id: id64, computers: count, online: count, queued: count, running: count, failed24h: count, done24h: count, avgSeconds: z.number().nonnegative().max(86400), storageBytes: count }).partial({ online: true, queued: true, running: true, failed24h: true, done24h: true, avgSeconds: true, storageBytes: true }))
    .max(5000)
    .default([]),
  runs: z
    .array(z.object({ id: id64, account: id64, company: id64.nullish(), tool: short(80), status: z.enum(['done', 'failed', 'cancelled', 'expired']), at: z.number().nonnegative().max(4_102_444_800_000), seconds: z.number().nonnegative().max(86400).nullish(), error: short(300).nullish() }))
    .max(1000)
    .default([]),
  downloads: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9a-f]{32}$/),
        export: id64,
        account: id64,
        company: id64,
        name: short(200),
        format: short(16),
        size: count.max(1024 * 1024 * 1024),
        sha256: z.string().regex(/^([0-9a-f]{64})?$/),
        at: z.number().nonnegative().max(4_102_444_800_000),
      }),
    )
    .max(1000)
    .default([]),
  worker: z.record(z.string().max(40), z.union([z.string().max(200), z.number(), z.boolean(), z.null()])).default({}),
  checksums: z.record(z.string().max(40), z.string().regex(/^[0-9a-f]{64}$/)).default({}),
});
export type SyncInput = z.infer<typeof syncInput>;

interface AccountRow {
  cad_account_id: string;
  user_id: string | null;
  company_id: string | null;
  status: string;
  assigned_by: string | null;
}

export interface SyncCompany {
  id: string;
  name: string;
  /** May send work to SOLIDWORKS there (false: read only; sent to an engine of contract 2 only). */
  operate: boolean;
  /** May download CAD files there (the company's download setting). */
  export: boolean;
}

export interface SyncAnswer {
  redirect: boolean;
  passwordRetired: boolean;
  accounts: Record<string, { userId: string | null; companies: SyncCompany[]; default: string | null; review: boolean }>;
  limits: Record<string, CadLimits>;
}

/** Minutes after which the console and the module say CAD Automation's sync is late (it runs once a minute; after
 * 15 minutes without an answer the engine works by person, and company limits and team views stop applying). */
export const SYNC_LATE_MINUTES = 5;
export const SYNC_STALE_MINUTES = 15;

/** When CAD Automation last reported, and whether that is late (null: it never has). */
export async function syncState(db: D1Database): Promise<{ at: number; minutes: number; late: boolean; stale: boolean } | null> {
  const h = await db.prepare("SELECT updated_at FROM system_kv WHERE key = 'cad_health'").first<{ updated_at: number }>().catch(() => null);
  if (!h) return null;
  const minutes = Math.max(0, Math.floor((now() - h.updated_at) / 60_000));
  return { at: h.updated_at, minutes, late: minutes >= SYNC_LATE_MINUTES, stale: minutes >= SYNC_STALE_MINUTES };
}

/** The BIZOMAT account of a CAD account: by BIZOMAT id, else by an email both sides confirmed. */
async function mapUser(db: D1Database, a: SyncInput['accounts'][number]): Promise<{ id: string; name: string; email: string; method: 'sub' | 'email' } | null> {
  if (a.sub) {
    const u = await db.prepare('SELECT id, name, email FROM users WHERE id = ? AND disabled_at IS NULL').bind(a.sub).first<{ id: string; name: string; email: string }>();
    if (u) return { ...u, method: 'sub' };
  }
  if (a.emailVerified && a.email) {
    const u = await db.prepare('SELECT id, name, email FROM users WHERE lower(email) = ? AND email_verified_at IS NOT NULL AND disabled_at IS NULL').bind(a.email.toLowerCase()).first<{ id: string; name: string; email: string }>();
    if (u) return { ...u, method: 'email' };
  }
  return null;
}

/** Where a person's existing CAD work belongs: their one registered company, else their own company when they have none. */
async function placeUser(db: D1Database, userId: string): Promise<{ companyId: string | null; reason: string }> {
  const reg = await db
    .prepare("SELECT co.id FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL WHERE m.user_id = ? AND COALESCE(m.status, 'active') = 'active'")
    .bind(userId)
    .all<{ id: string }>();
  if (reg.results.length === 1) return { companyId: reg.results[0].id, reason: 'The person’s only company' };
  if (reg.results.length > 1) return { companyId: null, reason: `The person is in ${reg.results.length} companies: choose one` };
  const own = await db.prepare('SELECT id FROM sys_companies WHERE owner_id = ?').bind(userId).first<{ id: string }>();
  return own ? { companyId: own.id, reason: 'The person’s own company (no registered company)' } : { companyId: null, reason: 'The person has no company yet' };
}

export async function runSync(env: Env, input: SyncInput): Promise<SyncAnswer> {
  const db = env.DB;
  const t = now();
  const anywhere = !!(await db.prepare("SELECT 1 FROM feature_flags WHERE key = 'cad_in_erp' AND value = 'on' LIMIT 1").first().catch(() => null));
  const existing = new Map<string, AccountRow>();
  const ids = input.accounts.map((a) => a.id);
  for (let i = 0; i < ids.length; i += 90) {
    const part = ids.slice(i, i + 90);
    const rows = await db.prepare(`SELECT cad_account_id, user_id, company_id, status, assigned_by FROM cad_accounts WHERE cad_account_id IN (${part.map(() => '?').join(',')})`).bind(...part).all<AccountRow>();
    for (const r of rows.results) existing.set(r.cad_account_id, r);
  }
  const answer: SyncAnswer = { redirect: false, passwordRetired: false, accounts: {}, limits: {} };
  let linked = 0;
  const writes: D1PreparedStatement[] = [];
  const people = new Map<string, { id: string; name: string; email: string }>();
  for (const a of input.accounts) {
    const prev = existing.get(a.id);
    let userId: string | null = null;
    let method: 'sub' | 'email' | null = null;
    let companyId: string | null = null;
    let reason = '';
    if (prev?.assigned_by) {
      // A platform admin decided: kept as they left it.
      userId = prev.user_id;
      companyId = prev.company_id;
      reason = 'Assigned by a platform admin';
    } else {
      const u = await mapUser(db, a);
      if (u) {
        userId = u.id;
        method = u.method;
        people.set(u.id, u);
        const placed = await placeUser(db, u.id);
        companyId = placed.companyId;
        reason = placed.reason;
      } else reason = a.sub ? 'No active BIZOMAT account with this BIZOMAT id' : a.emailVerified ? 'No BIZOMAT account with this confirmed email' : 'The email is not confirmed on CAD Automation';
    }
    const status = userId && companyId ? 'mapped' : 'review';
    if (userId) linked++;
    const countsJson = JSON.stringify({ ...(a.counts ?? {}), unassigned: a.unassigned ?? {} });
    writes.push(
      db
        .prepare(
          `INSERT INTO cad_accounts (cad_account_id, email, email_verified, sub, user_id, method, company_id, status, reason, counts_json, first_seen, last_seen)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(cad_account_id) DO UPDATE SET email = excluded.email, email_verified = excluded.email_verified, sub = excluded.sub,
             user_id = CASE WHEN cad_accounts.assigned_by IS NULL THEN excluded.user_id ELSE cad_accounts.user_id END,
             method = CASE WHEN cad_accounts.assigned_by IS NULL THEN excluded.method ELSE cad_accounts.method END,
             company_id = CASE WHEN cad_accounts.assigned_by IS NULL THEN excluded.company_id ELSE cad_accounts.company_id END,
             status = CASE WHEN cad_accounts.assigned_by IS NULL THEN excluded.status ELSE cad_accounts.status END,
             reason = CASE WHEN cad_accounts.assigned_by IS NULL THEN excluded.reason ELSE cad_accounts.reason END,
             counts_json = excluded.counts_json, last_seen = excluded.last_seen`,
        )
        .bind(a.id, a.email.toLowerCase(), a.emailVerified ? 1 : 0, a.sub ?? null, userId, method, companyId, status, reason, countsJson, t, t),
    );
    let companies: SyncCompany[] = [];
    if (anywhere && userId) {
      if (!people.has(userId)) {
        const u = await db.prepare('SELECT id, name, email FROM users WHERE id = ? AND disabled_at IS NULL').bind(userId).first<{ id: string; name: string; email: string }>();
        if (u) people.set(u.id, u);
      }
      const person = people.get(userId);
      // Contract 2: read-only companies too (refused there); before it, only those where the person may work.
      if (person) companies = (await cadCompanies(env, person, { operate: input.contract < 2 })).map((x) => ({ id: x.id, name: x.name, operate: x.operate, export: x.export }));
    }
    // Existing work moves only into a company where CAD Automation in the ERP is on and the person may work.
    const into = companyId && companies.some((c) => c.id === companyId && c.operate) ? companyId : null;
    answer.accounts[a.id] = { userId, companies, default: into, review: status === 'review' };
  }
  for (let i = 0; i < writes.length; i += 50) await db.batch(writes.slice(i, i + 50));

  // Limits for every company that has CAD Automation in the ERP and appears in the answer.
  const companyIds = new Set<string>();
  for (const v of Object.values(answer.accounts)) for (const c of v.companies) companyIds.add(c.id);
  for (const id of companyIds) answer.limits[id] = await limitsFor(db, id);

  // Finished runs: recorded once each, in the company's history; a failed one is a notice for the person.
  for (const r of input.runs) {
    if (!r.company) continue;
    const acc = existing.get(r.account) ?? null;
    const userId = answer.accounts[r.account]?.userId ?? acc?.user_id ?? null;
    if (!userId || !(answer.accounts[r.account]?.companies ?? []).some((c) => c.id === r.company)) continue;
    const inserted = await db
      .prepare('INSERT OR IGNORE INTO cad_runs (company_id, command_id, user_id, tool, status, seconds, finished_at, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(r.company, r.id, userId, r.tool, r.status, r.seconds ?? null, Math.round(r.at), t)
      .run();
    if (!inserted.meta.changes) continue;
    await eventStmt(db, { companyId: r.company, actorId: userId, action: 'cad.run', entityType: 'cad_run', entityId: r.id, summary: `${r.tool || 'CAD Automation'}: ${r.status}${r.seconds ? ` in ${Math.round(r.seconds)} s` : ''}` }).run();
    if (r.status === 'failed') {
      // An in-app notice for the person (the bell), as the members work's notices; no email for a CAD run.
      await db
        .prepare('INSERT INTO co_member_notices (id, company_id, user_id, kind, title, body, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(
          newId(),
          r.company,
          userId,
          'cad.run_failed',
          `CAD Automation: ${r.tool || 'a command'} failed`.slice(0, 200),
          (r.error ?? 'See the command in CAD Automation’s history for what SOLIDWORKS said.').slice(0, 1000),
          `/erp/c/${encodeURIComponent(r.company)}/cad/history?command=${encodeURIComponent(r.id)}`,
          t,
        )
        .run();
    }
  }

  // Downloads through AI assistants' links (contract 2): into the company's history once each, as a download from the
  // ERP itself is. Only for a company the account is in.
  for (const d of input.downloads) {
    const userId = answer.accounts[d.account]?.userId ?? existing.get(d.account)?.user_id ?? null;
    if (!userId || !(answer.accounts[d.account]?.companies ?? []).some((c) => c.id === d.company)) continue;
    const inserted = await db
      .prepare('INSERT OR IGNORE INTO cad_downloads (company_id, download_id, export_id, user_id, file_name, format, size, sha256, downloaded_at, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(d.company, d.id, d.export, userId, d.name, d.format, d.size, d.sha256, Math.round(d.at), t)
      .run();
    if (!inserted.meta.changes) continue;
    await eventStmt(db, { companyId: d.company, actorId: userId, action: 'cad.export_downloaded', entityType: 'cad_export', entityId: d.export, summary: `Downloaded ${d.name || 'a file'} (${Math.round(d.size / 1024)} KB) through an AI assistant’s link`, after: { sha256: d.sha256 || null, via: 'ai_assistant_link' } }).run();
  }

  // Password sign-in on CAD Automation (decision 4 of the audit of 20 Nov 2026): retired only while the flag is on and
  // every account it reports is linked to a BIZOMAT account.
  const allLinked = input.accounts.length > 0 && linked === input.accounts.length;
  answer.passwordRetired = allLinked && (await flagOn(db, 'cad_password_retired').catch(() => false));

  // Health and usage for the Control Centre (platform-wide, one row).
  const health = { at: t, worker: input.worker, companies: input.companies, checksums: input.checksums, accounts: input.accounts.length, linked, runs: input.runs.length, downloads: input.downloads.length, contract: input.contract, passwordRetired: answer.passwordRetired };
  await db.prepare("INSERT INTO system_kv (key, value, updated_at) VALUES ('cad_health', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(JSON.stringify(health), t).run();
  answer.redirect = await flagOn(db, 'cad_redirect').catch(() => false);
  return answer;
}

/** The Control Centre's view of CAD Automation: worker health, usage by company, the migration report and review list. */
export async function cadOverview(db: D1Database) {
  const h = await db.prepare("SELECT value, updated_at FROM system_kv WHERE key = 'cad_health'").first<{ value: string; updated_at: number }>();
  const health = parseJson<any>(h?.value, null);
  const rows = await db
    .prepare(
      `SELECT a.cad_account_id, a.email, a.email_verified, a.user_id, a.method, a.company_id, a.status, a.reason, a.counts_json, a.assigned_by, a.assigned_at, a.last_seen,
              u.name AS user_name, c.name AS company_name
         FROM cad_accounts a LEFT JOIN users u ON u.id = a.user_id LEFT JOIN companies c ON c.id = a.company_id
        ORDER BY a.status DESC, a.last_seen DESC LIMIT 1000`,
    )
    .all<any>();
  const totals = { accounts: 0, mapped: 0, review: 0, computers: 0, commands: 0, grants: 0, unassignedComputers: 0, unassignedCommands: 0, unassignedGrants: 0 };
  const accounts = rows.results.map((r) => {
    const c = parseJson<any>(r.counts_json, {});
    totals.accounts++;
    if (r.status === 'mapped') totals.mapped++;
    else totals.review++;
    totals.computers += c.computers ?? 0;
    totals.commands += c.commands ?? 0;
    totals.grants += c.grants ?? 0;
    totals.unassignedComputers += c.unassigned?.computers ?? 0;
    totals.unassignedCommands += c.unassigned?.commands ?? 0;
    totals.unassignedGrants += c.unassigned?.grants ?? 0;
    return {
      cadAccountId: r.cad_account_id,
      email: r.email,
      emailVerified: !!r.email_verified,
      userId: r.user_id,
      userName: r.user_name ?? null,
      method: r.method,
      companyId: r.company_id,
      companyName: r.company_name ?? null,
      status: r.status as 'mapped' | 'review',
      reason: r.reason,
      counts: c,
      assignedBy: r.assigned_by,
      assignedAt: r.assigned_at,
      lastSeen: r.last_seen,
    };
  });
  const names = new Map<string, string>();
  for (const c of health?.companies ?? []) {
    const n = await db.prepare('SELECT name FROM companies WHERE id = ?').bind(c.id).first<{ name: string }>();
    names.set(c.id, n?.name ?? c.id);
  }
  const sync = await syncState(db);
  const reported = Number(health?.accounts ?? 0);
  const linked = Number(health?.linked ?? 0);
  return {
    health: health ? { at: h!.updated_at, worker: health.worker ?? {}, checksums: health.checksums ?? {}, contract: Number(health.contract ?? 1), companies: (health.companies ?? []).map((c: any) => ({ ...c, name: names.get(c.id) ?? c.id })) } : null,
    sync,
    password: {
      flag: await flagOn(db, 'cad_password_retired').catch(() => false),
      accounts: reported,
      linked,
      ready: !!health && reported > 0 && linked === reported,
      retired: !!health?.passwordRetired,
    },
    totals,
    accounts,
  };
}
