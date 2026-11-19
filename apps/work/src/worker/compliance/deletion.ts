// Deletion of accounts that stayed suspended (Stage 1, R7; brief 7.5 and 7.6; docs/platform/compliance.md).
//
// The gate: automatic deletion (flag auto_deletion) cannot be switched on before a platform admin has recorded a
// privacy and legal review (reviewer, date, jurisdictions, retention periods), which sets legal_review_completed.
// Then, for a suspended account:
//   1. after the grace period, a final warning email at least 7 days before deletion, with how to export the data and
//      how to recover the account;
//   2. a dry-run report of the accounts that would be deleted, at most N per batch, which a platform admin reviews and
//      approves (until they choose automatic mode);
//   3. the 15-minute run deletes an approved batch, checking each account again first.
// Deletion anonymises the person (name, email, password, sign-in methods, sessions, tokens, notifications, preferences)
// and closes the personal tools only they were in. Records in tools shared with other people stay, as the company's.
// It is not complete while backups still hold the data: each batch records when they expire. Deletion is never started
// from a public API: only the maintenance run deletes, and only approved batches (or, in automatic mode, batches it
// makes itself under the same checks).

import type { Env } from '../env';
import { HttpError, newId, now, parseJson } from '../lib/util';
import { auditStmt } from '../services/audit';
import { enqueueEmail } from '../services/email/outbox';
import { flagOn } from '../platform/flags';
import { getSettings, inRegisteredCompany, isExempt, policy } from './core';

const DAY = 86_400_000;

export interface LegalReviewInput {
  reviewer: string;
  reviewedOn: string;
  jurisdictions: string[];
  retention: Record<string, string>;
  notes: string;
}

/** Records the review and sets legal_review_completed (managed here, never in the flag list). */
export async function recordLegalReview(db: D1Database, input: LegalReviewInput, actorId: string, ip: string | null) {
  const t = now();
  const id = newId();
  const prev = await db.prepare("SELECT value FROM feature_flags WHERE key = 'legal_review_completed' AND scope = 'global' AND scope_id = ''").first<{ value: string }>();
  await db.batch([
    db.prepare('INSERT INTO legal_reviews (id, reviewer, reviewed_on, jurisdictions_json, retention_json, notes, recorded_by, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, input.reviewer, input.reviewedOn, JSON.stringify(input.jurisdictions), JSON.stringify(input.retention), input.notes, actorId, t),
    db
      .prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('legal_review_completed', 'global', '', 'on', ?1, ?2, ?3) ON CONFLICT(key, scope, scope_id) DO UPDATE SET value = 'on', reason = ?1, updated_by = ?2, updated_at = ?3")
      .bind(`Legal review recorded (${id})`, actorId, t),
    db
      .prepare("INSERT INTO feature_flag_changes (id, key, scope, scope_id, old_value, new_value, reason, actor_id, kind, ip, created_at) VALUES (?, 'legal_review_completed', 'global', '', ?, 'on', ?, ?, 'change', ?, ?)")
      .bind(newId(), prev?.value ?? null, `Legal review recorded (${id})`, actorId, ip, t),
    auditStmt(db, { actorId, action: 'platform.legal_review_recorded', targetType: 'legal_review', targetId: id, metadata: { reviewer: input.reviewer, jurisdictions: input.jurisdictions }, ip: ip ?? undefined }),
  ]);
  return { id };
}

/** Why an account may not be deleted now (empty: it may). The brief's pre-deletion checks, each by name. */
export async function blockers(db: D1Database, userId: string, at = now()): Promise<string[]> {
  const out: string[] = [];
  const a = await db.prepare('SELECT deadline_at, suspended_at, legal_hold, deleted_at FROM compliance_accounts WHERE user_id = ?').bind(userId).first<{ deadline_at: number | null; suspended_at: number | null; legal_hold: number; deleted_at: number | null }>();
  const u = await db.prepare('SELECT email FROM users WHERE id = ?').bind(userId).first<{ email: string }>();
  if (!a || !u || a.deleted_at) return ['not_found'];
  if (!a.deadline_at || a.deadline_at > at) out.push('deadline_not_passed');
  if (!a.suspended_at) out.push('not_suspended');
  if (await inRegisteredCompany(db, userId)) out.push('compliant');
  if (a.legal_hold) out.push('legal_hold');
  if (await isExempt(db, userId, at)) out.push('exempt');
  if (await db.prepare('SELECT 1 FROM platform_admins WHERE user_id = ?').bind(userId).first()) out.push('platform_admin');
  // The sole owner of a tool other people still work in: its data must be handed over first.
  const sharedOwned = await db
    .prepare(
      `SELECT 1 FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id AND w.deleted_at IS NULL WHERE m.user_id = ?1 AND m.role = 'owner'
         AND EXISTS (SELECT 1 FROM workspace_members x WHERE x.workspace_id = m.workspace_id AND x.user_id <> ?1 AND x.status = 'active')
       UNION SELECT 1 FROM crm_members m WHERE m.user_id = ?1 AND m.role = 'owner' AND EXISTS (SELECT 1 FROM crm_members x WHERE x.org_id = m.org_id AND x.user_id <> ?1)
       UNION SELECT 1 FROM fin_members m WHERE m.user_id = ?1 AND m.role = 'owner' AND EXISTS (SELECT 1 FROM fin_members x WHERE x.org_id = m.org_id AND x.user_id <> ?1)`,
    )
    .bind(userId)
    .first();
  if (sharedOwned) out.push('owns_shared_tools');
  if (await db.prepare("SELECT 1 FROM data_exports WHERE user_id = ? AND status IN ('queued', 'running')").bind(userId).first()) out.push('export_in_progress');
  if ((await policy(db)) === 'INVITATION_ONLY') {
    const invited = await db
      .prepare('SELECT 1 FROM co_invitations WHERE email = ?1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?2 UNION SELECT 1 FROM invitations WHERE email = ?1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?2')
      .bind(u.email, at)
      .first();
    if (invited) out.push('pending_invitation');
  }
  return out;
}

/** Final warnings for suspended accounts whose grace period is ending (flag auto_deletion). */
export async function sendFinalWarnings(env: Env, at = now()) {
  const db = env.DB;
  const s = await getSettings(db);
  const due = await db
    .prepare('SELECT a.user_id, u.email, u.name FROM compliance_accounts a JOIN users u ON u.id = a.user_id WHERE a.suspended_at IS NOT NULL AND a.final_warning_at IS NULL AND a.deleted_at IS NULL AND a.suspended_at <= ? LIMIT 200')
    .bind(at - Math.max(0, s.graceDays - s.finalWarningDays) * DAY)
    .all<{ user_id: string; email: string; name: string }>();
  let sent = 0;
  for (const a of due.results) {
    const blocked = (await blockers(db, a.user_id, at)).filter((b) => b !== 'export_in_progress');
    if (blocked.length) continue;
    const deleteOn = at + s.finalWarningDays * DAY;
    const key = `compliance:final_warning:${a.user_id}`;
    await db.batch([
      db.prepare('UPDATE compliance_accounts SET final_warning_at = ?, deletion_due_at = ?, updated_at = ? WHERE user_id = ? AND final_warning_at IS NULL').bind(at, deleteOn, at, a.user_id),
      db.prepare("INSERT OR IGNORE INTO compliance_notifications (id, user_id, kind, channel, status, outbox_key, created_at) VALUES (?, ?, 'final_warning', 'email', 'queued', ?, ?)").bind(newId(), a.user_id, key, at),
    ]);
    await enqueueEmail(env, {
      userId: a.user_id,
      to: a.email,
      toName: a.name,
      data: {
        template: 'notification',
        organisation: 'BIZOMAT',
        title: 'Your BIZOMAT account will be deleted',
        body: `Your account has been suspended since the deadline to register your company passed. It will be deleted on ${new Date(deleteOn).toISOString().slice(0, 10)} (UTC), at the earliest. Before then: export your data from your account settings (Export your data), and to keep the account, register your company, accept an invitation, or reply to support to recover it.`,
        url: null,
      },
      idempotencyKey: key,
    }).catch(() => null);
    sent++;
  }
  return { sent };
}

/** The dry-run report: who would be deleted in the next batch, and why the others would not. Nothing is deleted. */
export async function dryRun(db: D1Database, actorId: string | null, max?: number, at = now()) {
  const s = await getSettings(db);
  const limit = Math.min(500, Math.max(1, max ?? s.batchMax));
  const due = await db.prepare('SELECT user_id FROM compliance_accounts WHERE deletion_due_at IS NOT NULL AND deletion_due_at <= ? AND deleted_at IS NULL ORDER BY deletion_due_at LIMIT 2000').bind(at).all<{ user_id: string }>();
  const accounts: string[] = [];
  const held: Record<string, number> = {};
  for (const { user_id } of due.results) {
    const b = await blockers(db, user_id, at);
    if (b.length) for (const r of b) held[r] = (held[r] ?? 0) + 1;
    else if (accounts.length < limit) accounts.push(user_id);
  }
  const report = { at, due: due.results.length, toDelete: accounts.length, accounts, held, limit };
  const id = newId();
  await db.prepare("INSERT INTO deletion_batches (id, status, max_accounts, report_json, created_by, created_at) VALUES (?, 'dry_run', ?, ?, ?, ?)").bind(id, limit, JSON.stringify(report), actorId, at).run();
  return { id, ...report };
}

export async function approveBatch(db: D1Database, id: string, actorId: string) {
  const r = await db.prepare("UPDATE deletion_batches SET status = 'approved', approved_by = ?, approved_at = ? WHERE id = ? AND status = 'dry_run'").bind(actorId, now(), id).run();
  if (!r.meta.changes) throw new HttpError(409, 'Only a dry-run report can be approved, once');
}

/** Anonymises one account: what identifies the person goes; records others rely on stay, as the company's. */
export async function anonymise(db: D1Database, userId: string, at = now()) {
  const sole = (members: string, key: string, owner: string) =>
    `SELECT ${key} FROM ${members} m WHERE m.user_id = ?1 AND m.role = 'owner' AND NOT EXISTS (SELECT 1 FROM ${members} x WHERE x.${key} = m.${key} AND x.user_id <> ?1)${owner}`;
  await db.batch([
    db
      .prepare("UPDATE users SET email = ?2, name = 'Deleted user', password_hash = NULL, avatar_key = NULL, preferences_json = '{}', disabled_at = ?3, email_verified_at = NULL, email_verified_via = NULL, updated_at = ?3 WHERE id = ?1")
      .bind(userId, `deleted+${userId}@deleted.invalid`, at),
    db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM api_tokens WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM user_identities WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM user_mfa WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM notifications WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM notification_preferences WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM password_resets WHERE user_id = ?').bind(userId),
    // Personal tools only they were in close, as a person's own delete does (soft).
    db.prepare(`UPDATE workspaces SET deleted_at = ?2 WHERE deleted_at IS NULL AND id IN (${sole('workspace_members', 'workspace_id', '')})`).bind(userId, at),
    db.prepare(`UPDATE crm_orgs SET deleted_at = ?2 WHERE deleted_at IS NULL AND id IN (${sole('crm_members', 'org_id', '')})`).bind(userId, at),
    db.prepare(`UPDATE fin_orgs SET deleted_at = ?2 WHERE deleted_at IS NULL AND id IN (${sole('fin_members', 'org_id', '')})`).bind(userId, at),
    db.prepare("UPDATE data_exports SET status = 'expired' WHERE user_id = ?").bind(userId),
    db.prepare('UPDATE compliance_accounts SET deleted_at = ?, updated_at = ? WHERE user_id = ?').bind(at, at, userId),
  ]);
}

/** The 15-minute run (flag auto_deletion): final warnings, then approved batches, each account checked again first. */
export async function runDeletion(env: Env, at = now()) {
  const db = env.DB;
  if (!(await flagOn(db, 'auto_deletion')) || !(await flagOn(db, 'legal_review_completed'))) return { skipped: 'flag_off' };
  const warned = await sendFinalWarnings(env, at);
  const s = await getSettings(db);
  if (s.deletionMode === 'automatic' && !(await db.prepare("SELECT 1 FROM deletion_batches WHERE status IN ('dry_run', 'approved')").first())) {
    const d = await dryRun(db, null, s.batchMax, at);
    if (d.toDelete) await db.prepare("UPDATE deletion_batches SET status = 'approved', approved_at = ? WHERE id = ?").bind(at, d.id).run();
  }
  const batch = await db.prepare("SELECT id, max_accounts, report_json FROM deletion_batches WHERE status = 'approved' ORDER BY approved_at LIMIT 1").first<{ id: string; max_accounts: number; report_json: string }>();
  let deleted = 0;
  if (batch) {
    await db.prepare("UPDATE deletion_batches SET status = 'running' WHERE id = ?").bind(batch.id).run();
    const report = parseJson<{ accounts: string[] }>(batch.report_json, { accounts: [] });
    const skipped: Record<string, string[]> = {};
    for (const userId of report.accounts.slice(0, batch.max_accounts)) {
      const b = await blockers(db, userId, at);
      if (b.length) {
        skipped[userId] = b;
        continue;
      }
      await anonymise(db, userId, at);
      deleted++;
    }
    await db.batch([
      db.prepare("UPDATE deletion_batches SET status = 'done', done_at = ?, backups_expire_at = ?, report_json = json_set(report_json, '$.deleted', ?, '$.skipped', json(?)) WHERE id = ?").bind(at, at + s.backupRetentionDays * DAY, deleted, JSON.stringify(skipped), batch.id),
      auditStmt(db, { actorId: null, action: 'compliance.deletion_batch_done', targetType: 'deletion_batch', targetId: batch.id, metadata: { deleted, skipped: Object.keys(skipped).length } }),
    ]);
  }
  return { warned: warned.sent, deleted };
}

/** Recovery during the grace period: access back, the deadline extended, the warning and deletion date cleared. */
export async function recover(db: D1Database, userId: string, days: number, actorId: string, reason: string) {
  const a = await db.prepare('SELECT deleted_at FROM compliance_accounts WHERE user_id = ?').bind(userId).first<{ deleted_at: number | null }>();
  if (!a) throw new HttpError(404, 'No compliance record for this person');
  if (a.deleted_at) throw new HttpError(409, 'This account was already deleted; it cannot be recovered from here');
  const t = now();
  await db.batch([
    db.prepare('UPDATE compliance_accounts SET suspended_at = NULL, restored_at = ?, final_warning_at = NULL, deletion_due_at = NULL, updated_at = ? WHERE user_id = ?').bind(t, t, userId),
    db.prepare("INSERT INTO compliance_extensions (id, scope, scope_id, days, reason, created_by, created_at) VALUES (?, 'user', ?, ?, ?, ?, ?)").bind(newId(), userId, days, reason, actorId, t),
    auditStmt(db, { actorId, action: 'compliance.account_recovered', targetType: 'user', targetId: userId, metadata: { days, reason } }),
  ]);
}
