// Existing users and the company rule (Stage 1, R7; brief Part 7 and 7.6; docs/platform/compliance.md).
//
// Nothing here acts while its flag is off, and nothing is sent to anyone before a platform admin has seen and approved
// the list of recipients. In order:
//   classification   a report of who is in which situation (counts), to decide the policy before anything is enforced;
//   recipients       a dry run of who would be told, approved, then sent (flag migration_notifications);
//   delivery         each notice per person and channel is recorded, and a deadline starts only once one was delivered
//                    or displayed (flag compliance_countdown);
//   reminders        on the configured days before the deadline;
//   suspension       after the deadline (flag auto_suspension); completing compliance restores access at once;
//   the gate         while company_registration_required is on, people without a registered company follow the
//                    individual accounts policy (individual_accounts_policy).
// Exempt people (testers, partners, staff) and platform admins are never notified, suspended or deleted.

import type { MiddlewareHandler } from 'hono';
import type { AppEnv, Env } from '../env';
import { HttpError, newId, now, parseJson } from '../lib/util';
import { enqueueEmail } from '../services/email/outbox';
import { flagOn, flagValue } from '../platform/flags';
import { companyOfTool } from '../platform/context';

export type IndividualPolicy = 'ALLOW_PERSONAL_WORKSPACE' | 'INVITATION_ONLY' | 'REQUIRE_COMPANY';
export type Audience = 'no_company' | 'invitation_only' | 'require_company';

export interface ComplianceSettings {
  deadlineDays: number;
  reminderDays: number[];
  graceDays: number;
  finalWarningDays: number;
  batchMax: number;
  deletionMode: 'review' | 'automatic';
  backupRetentionDays: number;
}

export const DEFAULT_SETTINGS: ComplianceSettings = { deadlineDays: 7, reminderDays: [3, 5, 6], graceDays: 30, finalWarningDays: 7, batchMax: 50, deletionMode: 'review', backupRetentionDays: 30 };
const KV = 'compliance_settings';
const DAY = 86_400_000;

export async function getSettings(db: D1Database): Promise<ComplianceSettings> {
  const raw = (await db.prepare('SELECT value FROM system_kv WHERE key = ?').bind(KV).first<{ value: string }>())?.value;
  return { ...DEFAULT_SETTINGS, ...parseJson<Partial<ComplianceSettings>>(raw, {}) };
}

export async function saveSettings(db: D1Database, s: ComplianceSettings) {
  await db.prepare('INSERT INTO system_kv (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = ?3').bind(KV, JSON.stringify(s), now()).run();
}

// ------------------------------------------------------------------ who is who

/** In a registered company (as anyone): compliant with the company rule. */
export async function inRegisteredCompany(db: D1Database, userId: string): Promise<boolean> {
  return !!(await db.prepare('SELECT 1 FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL WHERE m.user_id = ? LIMIT 1').bind(userId).first());
}

export async function isExempt(db: D1Database, userId: string, at = now()): Promise<boolean> {
  return !!(await db.prepare('SELECT 1 FROM compliance_exemptions WHERE user_id = ? AND (expires_at IS NULL OR expires_at > ?)').bind(userId, at).first());
}

const isPlatformAdmin = async (db: D1Database, userId: string) => !!(await db.prepare('SELECT 1 FROM platform_admins WHERE user_id = ?').bind(userId).first());

export async function policy(db: D1Database): Promise<IndividualPolicy> {
  return (await flagValue(db, 'individual_accounts_policy')) as IndividualPolicy;
}

/** The classification report (brief 7.1 and 7.6): counts only, for every active account. */
export async function classify(db: D1Database, at = now()) {
  const one = async (sql: string, ...args: unknown[]) => Number((await db.prepare(sql).bind(...args).first<{ n: number }>())?.n ?? 0);
  const ACTIVE = 'u.disabled_at IS NULL';
  const IN_CO = 'EXISTS (SELECT 1 FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL WHERE m.user_id = u.id)';
  const EXEMPT = 'EXISTS (SELECT 1 FROM compliance_exemptions e WHERE e.user_id = u.id AND (e.expires_at IS NULL OR e.expires_at > ?1))';
  const ADMIN = 'EXISTS (SELECT 1 FROM platform_admins p WHERE p.user_id = u.id)';
  const INVITED = `(EXISTS (SELECT 1 FROM co_invitations i WHERE i.email = u.email AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > ?1)
    OR EXISTS (SELECT 1 FROM invitations i WHERE i.email = u.email AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > ?1))`;
  const role = (r: string) => one(`SELECT COUNT(DISTINCT m.user_id) AS n FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL JOIN users u ON u.id = m.user_id WHERE ${ACTIVE} AND m.role IN (${r})`);
  return {
    at,
    activeAccounts: await one(`SELECT COUNT(*) AS n FROM users u WHERE ${ACTIVE}`),
    platformAdmins: await one(`SELECT COUNT(*) AS n FROM users u WHERE ${ACTIVE} AND ${ADMIN}`),
    exempt: await one(`SELECT COUNT(*) AS n FROM users u WHERE ${ACTIVE} AND ${EXEMPT}`, at),
    owners: await role("'owner'"),
    admins: await role("'admin'"),
    members: await role("'manager', 'employee', 'read_only', 'member'"),
    inSeveralCompanies: await one(`SELECT COUNT(*) AS n FROM (SELECT m.user_id FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL JOIN users u ON u.id = m.user_id WHERE ${ACTIVE} GROUP BY m.user_id HAVING COUNT(*) > 1)`),
    companiesWithIncompleteInfo: await one("SELECT COUNT(*) AS n FROM companies WHERE type = 'registered' AND deleted_at IS NULL AND registration_status <> 'verified'"),
    // The people the company rule would concern: active, not exempt, not platform admins, in no registered company.
    noCompany: await one(`SELECT COUNT(*) AS n FROM users u WHERE ${ACTIVE} AND NOT ${IN_CO} AND NOT ${EXEMPT} AND NOT ${ADMIN}`, at),
    noCompanyInvited: await one(`SELECT COUNT(*) AS n FROM users u WHERE ${ACTIVE} AND NOT ${IN_CO} AND NOT ${EXEMPT} AND NOT ${ADMIN} AND ${INVITED}`, at),
    noCompanyWithOwnTools: await one(
      `SELECT COUNT(*) AS n FROM users u WHERE ${ACTIVE} AND NOT ${IN_CO} AND NOT ${EXEMPT} AND NOT ${ADMIN}
         AND (EXISTS (SELECT 1 FROM workspace_members w JOIN workspaces x ON x.id = w.workspace_id AND x.deleted_at IS NULL WHERE w.user_id = u.id AND w.role = 'owner')
           OR EXISTS (SELECT 1 FROM crm_members c WHERE c.user_id = u.id AND c.role = 'owner') OR EXISTS (SELECT 1 FROM fin_members f WHERE f.user_id = u.id AND f.role = 'owner'))`,
      at,
    ),
    suspended: await one('SELECT COUNT(*) AS n FROM compliance_accounts WHERE suspended_at IS NOT NULL AND restored_at IS NULL AND deleted_at IS NULL'),
    policy: await policy(db),
  };
}

// ------------------------------------------------------------------ recipients and notices

const AUDIENCE: Record<IndividualPolicy, Audience> = { ALLOW_PERSONAL_WORKSPACE: 'no_company', INVITATION_ONLY: 'invitation_only', REQUIRE_COMPANY: 'require_company' };

/** Who would be told now (a dry run): active, not exempt, not platform admins, in no registered company. */
export async function buildRecipientList(db: D1Database, actorId: string, at = now()) {
  const rows = await db
    .prepare(
      `SELECT u.id FROM users u WHERE u.disabled_at IS NULL
          AND NOT EXISTS (SELECT 1 FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL WHERE m.user_id = u.id)
          AND NOT EXISTS (SELECT 1 FROM compliance_exemptions e WHERE e.user_id = u.id AND (e.expires_at IS NULL OR e.expires_at > ?1))
          AND NOT EXISTS (SELECT 1 FROM platform_admins p WHERE p.user_id = u.id)
          AND NOT EXISTS (SELECT 1 FROM compliance_notifications n WHERE n.user_id = u.id AND n.kind = 'migration' AND n.channel = 'email')
        ORDER BY u.created_at LIMIT 5000`,
    )
    .bind(at)
    .all<{ id: string }>();
  const ids = rows.results.map((r) => r.id);
  const audience = AUDIENCE[await policy(db)];
  const id = newId();
  await db.prepare("INSERT INTO compliance_recipient_lists (id, kind, audience, user_ids_json, count, status, created_by, created_at) VALUES (?, 'migration', ?, ?, ?, 'draft', ?, ?)").bind(id, audience, JSON.stringify(ids), ids.length, actorId, at).run();
  return { id, audience, count: ids.length };
}

/** What each group is told (brief 7.2 and 7.6: people without a business get their own text, not the owner's). */
export function noticeText(audience: Audience, deadlineDays: number) {
  const why = 'BIZOMAT now works company by company: every account belongs to a registered company, so each company’s data stays its own and can be verified.';
  const exportLine = 'You can export your data at any time from your account settings.';
  if (audience === 'no_company')
    return {
      title: 'Your workspace is a personal one',
      body: `${why} Your account has a personal workspace, labelled "Unverified – Personal". It keeps working, but it cannot invite other people. To work with others, register your company or accept an invitation from one; everything in your personal workspace can move into your company. ${exportLine}`,
    };
  if (audience === 'invitation_only')
    return {
      title: 'Register your company or accept an invitation',
      body: `${why} Until you register your company or accept an invitation from one, you can sign in only to do that. Register a company with its legal name, registration number and address, or ask your company to invite you. ${exportLine}`,
    };
  return {
    title: `Register your company within ${deadlineDays} days`,
    body: `${why} Register your company (its legal name, registration number and address) or accept an invitation from it within ${deadlineDays} days of this notice. After that, your account is suspended: you can still sign in to register, accept an invitation, contact support and export your data. If it stays suspended, it may later be deleted, after a final warning. ${exportLine}`,
  };
}

/** Sends an approved list (flag migration_notifications): an email and an in-app notice per person, each recorded. */
export async function sendRecipientList(env: Env, listId: string, at = now()) {
  const db = env.DB;
  if (!(await flagOn(db, 'migration_notifications'))) throw new HttpError(409, 'Migration notifications are switched off.', { code: 'NOTIFICATIONS_OFF' });
  const list = await db.prepare("SELECT * FROM compliance_recipient_lists WHERE id = ? AND status = 'approved'").bind(listId).first<{ id: string; audience: Audience; user_ids_json: string }>();
  if (!list) throw new HttpError(409, 'Approve the list first');
  const s = await getSettings(db);
  const text = noticeText(list.audience, s.deadlineDays);
  let sent = 0;
  for (const userId of parseJson<string[]>(list.user_ids_json, [])) {
    const u = await db.prepare('SELECT id, email, name FROM users WHERE id = ? AND disabled_at IS NULL').bind(userId).first<{ id: string; email: string; name: string }>();
    if (!u || (await inRegisteredCompany(db, u.id)) || (await isExempt(db, u.id, at))) continue;
    const key = `compliance:migration:${u.id}`;
    const r = await enqueueEmail(env, { userId: u.id, to: u.email, toName: u.name, data: { template: 'notification', organisation: 'BIZOMAT', title: text.title, body: text.body, url: null }, idempotencyKey: key }).catch(() => ({ queued: false }));
    await db.batch([
      db.prepare("INSERT OR IGNORE INTO compliance_notifications (id, user_id, kind, channel, list_id, status, outbox_key, created_at) VALUES (?, ?, 'migration', 'email', ?, ?, ?, ?)").bind(newId(), u.id, list.id, r.queued ? 'queued' : 'failed', key, at),
      db.prepare("INSERT OR IGNORE INTO compliance_notifications (id, user_id, kind, channel, list_id, status, created_at) VALUES (?, ?, 'migration', 'in_app', ?, 'queued', ?)").bind(newId(), u.id, list.id, at),
      db.prepare('INSERT OR IGNORE INTO compliance_accounts (user_id, updated_at) VALUES (?, ?)').bind(u.id, at),
    ]);
    sent++;
  }
  await db.prepare("UPDATE compliance_recipient_lists SET status = 'sent', sent_at = ? WHERE id = ?").bind(at, list.id).run();
  return { sent };
}

// ------------------------------------------------------------------ deadlines

/** Extensions that apply to a person: their own, their company's (by any company they were invited to) and everyone's. */
async function extensionDays(db: D1Database, userId: string): Promise<number> {
  const r = await db
    .prepare("SELECT COALESCE(SUM(days), 0) AS n FROM compliance_extensions WHERE scope = 'global' OR (scope = 'user' AND scope_id = ?1) OR (scope = 'company' AND scope_id IN (SELECT company_id FROM co_members WHERE user_id = ?1))")
    .bind(userId)
    .first<{ n: number }>();
  return Number(r?.n ?? 0);
}

/**
 * The maintenance step: records email deliveries, starts deadlines once a notice was delivered or displayed (flag
 * compliance_countdown), sends reminders on the configured days, suspends after the deadline (flag auto_suspension) and
 * restores anyone who has become compliant.
 */
export async function runCompliance(env: Env, at = now()) {
  const db = env.DB;
  const out = { delivered: 0, started: 0, reminders: 0, suspended: 0, restored: 0 };
  // Deliveries: the outbox says when an email went.
  const pending = await db.prepare("SELECT n.id, n.outbox_key FROM compliance_notifications n WHERE n.channel = 'email' AND n.status = 'queued' AND n.outbox_key IS NOT NULL LIMIT 500").all<{ id: string; outbox_key: string }>();
  for (const n of pending.results) {
    const o = await db.prepare("SELECT status, updated_at FROM email_outbox WHERE idempotency_key = ? AND status IN ('sent', 'delivered')").bind(n.outbox_key).first<{ updated_at: number }>();
    if (o) {
      await db.prepare("UPDATE compliance_notifications SET status = 'delivered', delivered_at = ? WHERE id = ?").bind(o.updated_at, n.id).run();
      out.delivered++;
    }
  }
  const s = await getSettings(db);
  // Restore anyone compliant now (registered or joined a company, or exempted).
  const susp = await db.prepare('SELECT user_id FROM compliance_accounts WHERE suspended_at IS NOT NULL AND restored_at IS NULL AND deleted_at IS NULL').all<{ user_id: string }>();
  for (const a of susp.results) {
    if ((await inRegisteredCompany(db, a.user_id)) || (await isExempt(db, a.user_id, at))) {
      await restore(db, a.user_id, at);
      out.restored++;
    }
  }
  if (!(await flagOn(db, 'compliance_countdown'))) return out;
  // Deadlines start at the first recorded delivery or display, never before.
  const starts = await db
    .prepare(
      `SELECT a.user_id, MIN(n.delivered_at) AS first FROM compliance_accounts a JOIN compliance_notifications n ON n.user_id = a.user_id AND n.kind = 'migration' AND n.delivered_at IS NOT NULL
        WHERE a.notified_at IS NULL AND a.deleted_at IS NULL GROUP BY a.user_id LIMIT 500`,
    )
    .all<{ user_id: string; first: number }>();
  for (const r of starts.results) {
    await db.prepare('UPDATE compliance_accounts SET notified_at = ?, deadline_at = ?, updated_at = ? WHERE user_id = ? AND notified_at IS NULL').bind(r.first, r.first + s.deadlineDays * DAY, at, r.user_id).run();
    out.started++;
  }
  const running = await db.prepare('SELECT a.user_id, a.notified_at, a.deadline_at, u.email, u.name FROM compliance_accounts a JOIN users u ON u.id = a.user_id WHERE a.notified_at IS NOT NULL AND a.suspended_at IS NULL AND a.deleted_at IS NULL LIMIT 1000').all<{ user_id: string; notified_at: number; deadline_at: number; email: string; name: string }>();
  const suspending = await flagOn(db, 'auto_suspension');
  for (const a of running.results) {
    if ((await inRegisteredCompany(db, a.user_id)) || (await isExempt(db, a.user_id, at))) continue;
    const deadline = a.notified_at + (s.deadlineDays + (await extensionDays(db, a.user_id))) * DAY;
    if (deadline !== a.deadline_at) await db.prepare('UPDATE compliance_accounts SET deadline_at = ?, updated_at = ? WHERE user_id = ?').bind(deadline, at, a.user_id).run();
    const day = Math.floor((at - a.notified_at) / DAY);
    if (s.reminderDays.includes(day) && at < deadline) {
      const key = `compliance:reminder:${a.user_id}:${day}`;
      const ins = await db.prepare("INSERT OR IGNORE INTO compliance_notifications (id, user_id, kind, channel, day, status, outbox_key, created_at) VALUES (?, ?, 'reminder', 'email', ?, 'queued', ?, ?)").bind(newId(), a.user_id, day, key, at).run();
      if (ins.meta.changes) {
        const left = Math.max(1, Math.ceil((deadline - at) / DAY));
        await enqueueEmail(env, { userId: a.user_id, to: a.email, toName: a.name, data: { template: 'notification', organisation: 'BIZOMAT', title: `${left} ${left === 1 ? 'day' : 'days'} left to register your company`, body: `Your deadline is ${new Date(deadline).toISOString().slice(0, 10)} (UTC). Register your company or accept an invitation from it before then. You can export your data at any time from your account settings.`, url: null }, idempotencyKey: key }).catch(() => null);
        out.reminders++;
      }
    }
    if (suspending && at >= deadline) {
      await db.prepare('UPDATE compliance_accounts SET suspended_at = ?, restored_at = NULL, updated_at = ? WHERE user_id = ? AND suspended_at IS NULL').bind(at, at, a.user_id).run();
      const key = `compliance:suspension:${a.user_id}`;
      await db.prepare("INSERT OR IGNORE INTO compliance_notifications (id, user_id, kind, channel, status, outbox_key, created_at) VALUES (?, ?, 'suspension', 'email', 'queued', ?, ?)").bind(newId(), a.user_id, key, at).run();
      await enqueueEmail(env, { userId: a.user_id, to: a.email, toName: a.name, data: { template: 'notification', organisation: 'BIZOMAT', title: 'Your BIZOMAT account is suspended', body: 'The deadline to register your company has passed, so your tools are closed. You can still sign in to register your company, accept an invitation, contact support and export your data. Completing it restores your access at once. Export your data now if you may need it.', url: null }, idempotencyKey: key }).catch(() => null);
      out.suspended++;
    }
  }
  return out;
}

export async function restore(db: D1Database, userId: string, at = now()) {
  await db.prepare('UPDATE compliance_accounts SET suspended_at = NULL, restored_at = ?, final_warning_at = NULL, deletion_due_at = NULL, updated_at = ? WHERE user_id = ?').bind(at, at, userId).run();
}

// ------------------------------------------------------------------ the gate

// What a person who must comply can still reach: their account and its export, the company area (to register or
// accept), invitations, the compliance notice and sign-out.
const ALLOWED = [/^\/auth\//, /^\/me(\/|$)/, /^\/company\//, /^\/compliance(\/|$)/, /^\/exports(\/|$)/, /^\/system\/me$/, /\/invitations\/[^/]+\/(accept|decline)$/];
const INVITE_WRITE = /^\/(workspaces\/[^/]+|crm\/orgs\/[^/]+|fin\/orgs\/[^/]+)\/invitations$/;

/** The person's situation under the company rule (null: the rule does not apply to them). */
export async function situation(db: D1Database, userId: string, at = now()) {
  if (!(await flagOn(db, 'company_registration_required'))) return null;
  if ((await isPlatformAdmin(db, userId)) || (await isExempt(db, userId, at)) || (await inRegisteredCompany(db, userId))) return null;
  const acc = await db.prepare('SELECT notified_at, deadline_at, suspended_at FROM compliance_accounts WHERE user_id = ? AND deleted_at IS NULL').bind(userId).first<{ notified_at: number | null; deadline_at: number | null; suspended_at: number | null }>();
  return { policy: await policy(db), deadlineAt: acc?.deadline_at ?? null, suspended: !!acc?.suspended_at };
}

/**
 * While company_registration_required is on: people in no registered company follow the individual accounts policy.
 * ALLOW_PERSONAL_WORKSPACE: their personal workspace works, but cannot invite anyone. INVITATION_ONLY: they can only
 * register a company or accept an invitation. REQUIRE_COMPANY: they work until their deadline; once suspended, only
 * the allowed addresses answer. Off (the default): nothing changes for anyone.
 */
export const complianceGate: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (c.get('authKind') !== 'session') return next();
  const db = c.env.DB;
  if (!(await flagOn(db, 'company_registration_required'))) return next();
  const path = c.req.path.replace(/^.*?\/api\//, '/');
  if (path.startsWith('/admin')) return next();
  const s = await situation(db, c.get('user').id);
  if (!s) return next();
  const allowed = ALLOWED.some((r) => r.test(path));
  if (s.policy === 'INVITATION_ONLY' && !allowed) throw new HttpError(403, 'Register your company or accept an invitation from it to use BIZOMAT.', { code: 'COMPANY_REQUIRED' });
  if (s.policy === 'REQUIRE_COMPANY' && s.suspended && !allowed) throw new HttpError(403, 'Your account is suspended until you register your company or accept an invitation. You can still export your data.', { code: 'ACCOUNT_SUSPENDED' });
  if (s.policy === 'ALLOW_PERSONAL_WORKSPACE' && c.req.method === 'POST' && INVITE_WRITE.test(path)) {
    const m = /^\/(workspaces|crm\/orgs|fin\/orgs)\/([^/]+)/.exec(path)!;
    const app = m[1] === 'workspaces' ? 'tasks' : m[1] === 'crm/orgs' ? 'crm' : 'finance';
    const companyId = await companyOfTool(db, app, decodeURIComponent(m[2]));
    // No registered or example company: the owner's own company (made on their first ERP visit), a personal one.
    const personal = !companyId || !!(await db.prepare("SELECT 1 FROM companies WHERE id = ? AND type = 'personal'").bind(companyId).first());
    if (personal) throw new HttpError(403, 'A personal workspace cannot invite other people. Register your company to work with others.', { code: 'PERSONAL_WORKSPACE_NO_INVITES' });
  }
  return next();
};
