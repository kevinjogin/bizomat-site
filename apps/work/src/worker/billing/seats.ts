// Seats: who a company pays for, and keeping Stripe's subscription quantity equal to it (docs/billing/README.md).
//
// The company's membership records are the only source: a billable user is a member of the registered company
// (co_members: the owner, administrators and members) whose BIZOMAT account is not disabled. Pending invitations are
// not members yet; people removed from the company have no co_members row; disabled accounts are left out. One row per
// person and company (co_members' primary key), counted once. A browser never sends a seat count.

import type { Context } from 'hono';
import type { AppEnv, Env } from '../env';
import { newId, now } from '../lib/util';
import { billingConfig, redact, type BillingOn } from './config';
import { currentSubscription, historyStmt, OPEN_STATUSES, SEAT_STATUSES, type SubscriptionRow } from './store';
import { stripeFor, stripeMessage } from './stripe';
import { applySubscription } from './sync';

export interface SeatPerson {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
}

/** The people a company is billed for, owner first. */
export async function billablePeople(db: D1Database, companyId: string): Promise<SeatPerson[]> {
  const rows = await db
    .prepare(
      `SELECT u.id, u.name, u.email, m.role
         FROM co_members m
         JOIN users u ON u.id = m.user_id
         JOIN co_companies co ON co.id = m.company_id
        WHERE m.company_id = ? AND u.disabled_at IS NULL AND co.deleted_at IS NULL
        ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, u.name COLLATE NOCASE`,
    )
    .bind(companyId)
    .all<SeatPerson>();
  return rows.results;
}

export async function countBillableSeats(db: D1Database, companyId: string): Promise<number> {
  const r = await db
    .prepare(
      `SELECT COUNT(DISTINCT m.user_id) AS n
         FROM co_members m
         JOIN users u ON u.id = m.user_id
         JOIN co_companies co ON co.id = m.company_id
        WHERE m.company_id = ? AND u.disabled_at IS NULL AND co.deleted_at IS NULL`,
    )
    .bind(companyId)
    .first<{ n: number }>();
  return Number(r?.n ?? 0);
}

/** Who is not billed, and why: shown beside the count so the number can be checked. */
export async function notBilled(db: D1Database, companyId: string): Promise<{ pendingInvitations: number; disabledMembers: number }> {
  const t = now();
  const inv = await db.prepare('SELECT COUNT(*) AS n FROM co_invitations WHERE company_id = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?').bind(companyId, t).first<{ n: number }>();
  const dis = await db.prepare('SELECT COUNT(*) AS n FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? AND u.disabled_at IS NOT NULL').bind(companyId).first<{ n: number }>();
  return { pendingInvitations: Number(inv?.n ?? 0), disabledMembers: Number(dis?.n ?? 0) };
}

export type SeatSyncResult =
  | { status: 'off' | 'no-subscription' | 'in-step' }
  | { status: 'no-users'; count: number }
  | { status: 'applied'; from: number; to: number }
  | { status: 'failed'; from: number; to: number; error: string }
  | { status: 'raced'; to: number };

/**
 * Makes Stripe's seat quantity equal to the company's billable users. Each change is recorded first with an
 * idempotency key made of the subscription, the number of seat changes already applied, the new quantity and the
 * failed tries so far: two requests for the same change (a double click, the cron and a membership change at once)
 * send Stripe the same key and are one change, while a retry after a failure gets a new key. Stripe's answer is then
 * recorded, and the stored quantity is moved on only from the version it was read at.
 */
export async function syncSeats(env: Env, companyId: string, opts: { reason: string; actorId?: string | null; cfg?: BillingOn }): Promise<SeatSyncResult> {
  const cfg = opts.cfg ?? billingConfig(env);
  if (!cfg.enabled) return { status: 'off' };
  const db = env.DB;
  const sub = await currentSubscription(db, companyId, cfg.environment);
  if (!sub || !(SEAT_STATUSES as readonly string[]).includes(sub.status) || !sub.item_id) return { status: 'no-subscription' };
  const count = await countBillableSeats(db, companyId);
  if (count === sub.quantity) return { status: 'in-step' };
  // A subscription with nobody to bill is left for a person to look at (the owner's account was disabled, say).
  if (count < 1) return { status: 'no-users', count };
  const failures = await db
    .prepare("SELECT COUNT(*) AS n FROM billing_seat_changes WHERE subscription_id = ? AND status = 'failed' AND idempotency_key LIKE ?")
    .bind(sub.id, `seats:${sub.id}:v${sub.seat_version}:${count}:%`)
    .first<{ n: number }>();
  const key = `seats:${sub.id}:v${sub.seat_version}:${count}:${Number(failures?.n ?? 0)}`;
  const changeId = newId();
  const reason = opts.reason.slice(0, 60) || 'reconcile';
  await db
    .prepare(
      "INSERT OR IGNORE INTO billing_seat_changes (id, company_id, subscription_id, from_quantity, to_quantity, reason, proration_behavior, idempotency_key, status, actor_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)",
    )
    .bind(changeId, companyId, sub.id, sub.quantity, count, reason, cfg.proration, key, opts.actorId ?? null, now())
    .run();
  const change = await db.prepare('SELECT id, status FROM billing_seat_changes WHERE idempotency_key = ?').bind(key).first<{ id: string; status: string }>();
  try {
    const updated = await stripeFor(cfg).subscriptions.update(
      sub.id,
      { items: [{ id: sub.item_id, quantity: count }], proration_behavior: cfg.proration, expand: ['default_payment_method'] },
      { idempotencyKey: key },
    );
    // Move the version on only from the one this change was made from; whoever loses the race just records Stripe's answer.
    const moved = await db
      .prepare('UPDATE billing_subscriptions SET seat_version = seat_version + 1 WHERE id = ? AND seat_version = ?')
      .bind(sub.id, sub.seat_version)
      .run();
    await applySubscription(env, cfg, updated);
    const t = now();
    const stmts = [db.prepare("UPDATE billing_seat_changes SET status = 'applied', applied_at = COALESCE(applied_at, ?), error = NULL WHERE id = ?").bind(t, change?.id ?? changeId)];
    if ((moved.meta?.changes ?? 0) > 0) {
      const more = count > sub.quantity;
      stmts.push(
        historyStmt(db, {
          companyId,
          environment: cfg.environment,
          kind: 'seats.changed',
          summary: `Billed users changed from ${sub.quantity} to ${count} (${reasonWords(reason)}). ${prorationWords(cfg.proration, more)}`,
          ref: change?.id ?? changeId,
          actorId: opts.actorId ?? null,
        }),
      );
    }
    await db.batch(stmts);
    return (moved.meta?.changes ?? 0) > 0 ? { status: 'applied', from: sub.quantity, to: count } : { status: 'raced', to: count };
  } catch (e) {
    const error = redact(stripeMessage(e));
    await db.prepare("UPDATE billing_seat_changes SET status = 'failed', error = ? WHERE id = ? AND status = 'pending'").bind(error, change?.id ?? changeId).run();
    return { status: 'failed', from: sub.quantity, to: count, error };
  }
}

const REASONS: Record<string, string> = {
  'member.added': 'a person joined the company',
  'invitation.accepted': 'a person accepted an invitation',
  'member.removed': 'a person was removed from the company',
  'member.left': 'a person left the company',
  'user.disabled': 'an account was disabled',
  'user.enabled': 'an account was enabled again',
  reconcile: 'the scheduled check',
  manual: 'updated by an administrator',
  checkout: 'the subscription started',
};
export const reasonWords = (r: string) => REASONS[r] ?? r;

/** The customer-facing explanation of how Stripe charges a seat change. */
export function prorationWords(p: BillingOn['proration'], more: boolean): string {
  if (p === 'none') return more ? 'The new user is charged from the next billing period.' : 'The change applies from the next billing period; no credit is given for the current one.';
  if (p === 'always_invoice') return more ? 'Stripe invoiced the time left in this billing period for the new user now.' : 'Stripe credited the unused time for the removed user now.';
  return more ? 'Stripe adds a charge for the time left in this billing period to the next invoice.' : 'Stripe credits the unused time for the removed user on the next invoice.';
}

/** After a membership change: bring the companies' seat counts up to date in the background. Never fails the request
 * that changed the membership; the scheduled check catches anything missed. */
export function requestSeatSync(c: Context<AppEnv>, companyIds: string[], reason: string) {
  const cfg = billingConfig(c.env);
  if (!cfg.enabled || !companyIds.length) return;
  let actorId: string | null = null;
  try {
    actorId = c.get('user')?.id ?? null;
  } catch {
    actorId = null;
  }
  const run = (async () => {
    for (const id of companyIds) {
      try {
        await syncSeats(c.env, id, { reason, actorId, cfg });
      } catch {
        // recorded on the next scheduled check
      }
    }
  })();
  try {
    c.executionCtx.waitUntil(run);
  } catch {
    void run;
  }
}

/** Whether a company has a subscription that has not ended, in either Stripe environment (false before migration 0027). */
export async function hasOpenSubscription(db: D1Database, companyId: string): Promise<boolean> {
  try {
    const r = await db.prepare(`SELECT 1 FROM billing_subscriptions WHERE company_id = ? AND status IN (${OPEN_STATUSES.map(() => '?').join(',')}) LIMIT 1`).bind(companyId, ...OPEN_STATUSES).first();
    return !!r;
  } catch {
    return false;
  }
}

/** The registered companies a person belongs to (for a change to their account, such as disabling it). */
export async function companiesOfUser(db: D1Database, userId: string): Promise<string[]> {
  const r = await db.prepare('SELECT company_id FROM co_members WHERE user_id = ?').bind(userId).all<{ company_id: string }>();
  return r.results.map((x) => x.company_id);
}

export type { SubscriptionRow };
