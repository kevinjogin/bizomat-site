// The email outbox. Every email is first written to email_outbox with a unique idempotency key (so the same event
// can never queue a second message), then handed to the provider by processOutbox(), right after it is queued and on
// every 15-minute maintenance run.
//
// Daily limit: at most EMAIL_DAILY_LIMIT messages (default 250) are handed over per UTC day; invitations and test
// messages may use EMAIL_CRITICAL_RESERVE more (default 40, so 290 stays under Brevo Free's 300). A message over the
// limit is not dropped: it waits ('deferred') until the next UTC day, and administrators see it as delayed.
//
// Duplicates: a row is claimed ('sending') with a conditional update before it is sent, so two runs cannot both send
// it. A row left in 'sending' (the process stopped mid-send) is never retried automatically, because the provider may
// have accepted it: it is marked failed with "outcome unknown" and an administrator can resend it.

import type { Env } from '../../env';
import { newId, now, placeholders } from '../../lib/util';
import { CRITICAL_TEMPLATES, renderEmail, type EmailTemplate, type TemplateData } from './templates';
import { emailConfig, providerFor, type EmailConfig } from './provider';
import { emailEnv } from './settings';

export const MAX_ATTEMPTS = 8;
const BACKOFF_MS = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000, 3 * 3_600_000, 6 * 3_600_000, 12 * 3_600_000];
const STALE_SENDING_MS = 15 * 60_000;
const DAY = 86_400_000;

export interface QueueInput {
  workspaceId?: string | null;
  userId?: string | null;
  to: string;
  toName?: string;
  data: TemplateData;
  /** Same key, same message: a second enqueue with this key does nothing. */
  idempotencyKey: string;
  /** The body holds a secret link (invitations): cleared once sent or given up. */
  sensitive?: boolean;
}

export type QueueResult = { queued: true; id: string } | { queued: false; reason: 'not_configured' | 'duplicate' | 'suppressed' | 'invalid_address' };

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export function utcDayStart(t: number): number {
  return Math.floor(t / DAY) * DAY;
}

export async function sentToday(db: D1Database, at = now()): Promise<number> {
  const r = await db.prepare('SELECT COUNT(*) AS n FROM email_outbox WHERE sent_at >= ?').bind(utcDayStart(at)).first<{ n: number }>();
  return r?.n ?? 0;
}

export async function enqueueEmail(env: Env, input: QueueInput, cfgIn?: EmailConfig): Promise<QueueResult> {
  // Settings saved in the founder console apply on top of the environment.
  const cfg = cfgIn ?? emailConfig(await emailEnv(env));
  if (cfg.provider === 'none') return { queued: false, reason: 'not_configured' };
  const to = input.to.trim().toLowerCase();
  if (!EMAIL_RE.test(to) || to.length > 320) return { queued: false, reason: 'invalid_address' };
  const t = now();
  const suppressed = await env.DB.prepare('SELECT 1 FROM email_suppressions WHERE email = ?').bind(to).first();
  const rendered = renderEmail(input.data);
  const id = newId();
  const priority = CRITICAL_TEMPLATES.includes(input.data.template as EmailTemplate) ? 0 : 1;
  const r = await env.DB.prepare(
    `INSERT OR IGNORE INTO email_outbox (id, workspace_id, user_id, to_email, to_name, template, priority, subject, html, text, sensitive, idempotency_key, status, next_attempt_at, created_at, updated_at, last_error)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      input.workspaceId ?? null,
      input.userId ?? null,
      to,
      (input.toName ?? '').slice(0, 100),
      input.data.template,
      priority,
      rendered.subject,
      suppressed ? '' : rendered.html,
      suppressed ? '' : rendered.text,
      input.sensitive ? 1 : 0,
      input.idempotencyKey.slice(0, 300),
      suppressed ? 'suppressed' : 'queued',
      t,
      t,
      t,
      suppressed ? 'The address bounced, was blocked or complained earlier; nothing is sent to it' : null,
    )
    .run();
  if (!r.meta.changes) return { queued: false, reason: 'duplicate' };
  if (suppressed) return { queued: false, reason: 'suppressed' };
  return { queued: true, id };
}

export interface ProcessResult {
  sent: number;
  deferred: number;
  failed: number;
  limitReached: boolean;
}

function backoff(attempts: number): number {
  return BACKOFF_MS[Math.min(Math.max(attempts - 1, 0), BACKOFF_MS.length - 1)];
}

/** Hand due messages to the provider, most important first, within the daily limit. */
export async function processOutbox(env: Env, opts: { max?: number; at?: number } = {}): Promise<ProcessResult> {
  const merged = await emailEnv(env);
  const cfg = emailConfig(merged);
  const out: ProcessResult = { sent: 0, deferred: 0, failed: 0, limitReached: false };
  const provider = providerFor(merged, cfg);
  if (!provider) return out;
  const db = env.DB;
  const t0 = opts.at ?? now();
  // A send that never finished: do not resend it automatically (it may have gone out).
  await db
    .prepare("UPDATE email_outbox SET status = 'failed', last_error = 'Outcome unknown: the send was interrupted. Not resent automatically, to avoid a duplicate.', updated_at = ? WHERE status = 'sending' AND updated_at < ?")
    .bind(t0, t0 - STALE_SENDING_MS)
    .run();
  const due = await db
    .prepare("SELECT * FROM email_outbox WHERE status IN ('queued','deferred') AND next_attempt_at <= ? ORDER BY priority, created_at LIMIT ?")
    .bind(t0, opts.max ?? 25)
    .all<OutboxRow>();
  if (!due.results.length) return out;
  let count = await sentToday(db, t0);
  const tomorrow = utcDayStart(t0) + DAY + 60_000;
  for (const row of due.results) {
    const limit = row.priority === 0 ? cfg.dailyLimit + cfg.criticalReserve : cfg.dailyLimit;
    if (count >= limit) {
      out.limitReached = true;
      out.deferred++;
      await db
        .prepare("UPDATE email_outbox SET status = 'deferred', next_attempt_at = ?, last_error = ?, updated_at = ? WHERE id = ? AND status IN ('queued','deferred')")
        .bind(tomorrow, `Daily sending limit reached (${count} of ${limit} today, UTC). Sends after 00:00 UTC.`, t0, row.id)
        .run();
      continue;
    }
    const claim = await db
      .prepare("UPDATE email_outbox SET status = 'sending', attempts = attempts + 1, updated_at = ? WHERE id = ? AND status IN ('queued','deferred')")
      .bind(now(), row.id)
      .run();
    if (!claim.meta.changes) continue;
    const attempts = row.attempts + 1;
    const res = await provider.send({
      to: { email: row.to_email, name: row.to_name || undefined },
      from: cfg.from,
      replyTo: cfg.replyTo ? { email: cfg.replyTo } : null,
      subject: row.subject,
      html: row.html,
      text: row.text,
      tags: [row.template],
      correlationId: row.id,
    });
    const t = now();
    if (res.ok) {
      count++;
      out.sent++;
      await db
        .prepare(
          `UPDATE email_outbox SET status = 'sent', sent_at = ?, provider = ?, provider_message_id = ?, last_error = NULL, updated_at = ?,
             html = CASE WHEN sensitive = 1 THEN '' ELSE html END, text = CASE WHEN sensitive = 1 THEN '' ELSE text END WHERE id = ?`,
        )
        .bind(t, provider.name, res.messageId, t, row.id)
        .run();
      continue;
    }
    const giveUp = res.kind === 'permanent' || attempts >= MAX_ATTEMPTS;
    if (giveUp) {
      out.failed++;
      await db
        .prepare(
          `UPDATE email_outbox SET status = 'failed', provider = ?, last_error = ?, updated_at = ?,
             html = CASE WHEN sensitive = 1 THEN '' ELSE html END, text = CASE WHEN sensitive = 1 THEN '' ELSE text END WHERE id = ?`,
        )
        .bind(provider.name, res.error.slice(0, 500), t, row.id)
        .run();
      continue;
    }
    out.deferred++;
    const next = res.kind === 'quota' ? tomorrow : t + (res.retryAfterMs ?? backoff(attempts));
    if (res.kind === 'quota') out.limitReached = true;
    await db
      .prepare("UPDATE email_outbox SET status = 'deferred', provider = ?, next_attempt_at = ?, last_error = ?, updated_at = ? WHERE id = ?")
      .bind(provider.name, next, res.error.slice(0, 500), t, row.id)
      .run();
    // The provider limits us: stop this run, the rest waits.
    if (res.kind === 'quota' || res.status === 429) break;
  }
  return out;
}

export interface OutboxRow {
  id: string;
  workspace_id: string | null;
  user_id: string | null;
  to_email: string;
  to_name: string;
  template: string;
  priority: number;
  subject: string;
  html: string;
  text: string;
  sensitive: number;
  idempotency_key: string;
  status: string;
  attempts: number;
  next_attempt_at: number;
  provider: string | null;
  provider_message_id: string | null;
  last_error: string | null;
  last_event: string | null;
  last_event_at: number | null;
  created_at: number;
  sent_at: number | null;
  updated_at: number;
}

/** Queue then try to send at once (in the background on the request). */
export async function queueAndKick(env: Env, waitUntil: (p: Promise<unknown>) => void, input: QueueInput): Promise<QueueResult> {
  const r = await enqueueEmail(env, input);
  if (r.queued) waitUntil(processOutbox(env, { max: 10 }).catch((e) => console.error('email_process_failed', e instanceof Error ? e.message : e)));
  return r;
}

// ------------------------------------------------------------------ webhooks (Brevo transactional events)

/** Event names Brevo uses in webhook payloads (snake_case) and in its webhook settings (camelCase). */
const EVENT_STATUS: Record<string, { status?: string; suppress?: string }> = {
  request: {},
  sent: {},
  delivered: { status: 'delivered' },
  deferred: {},
  soft_bounce: {},
  softbounce: {},
  hard_bounce: { status: 'bounced', suppress: 'hard bounce' },
  hardbounce: { status: 'bounced', suppress: 'hard bounce' },
  invalid_email: { status: 'bounced', suppress: 'invalid address' },
  invalid: { status: 'bounced', suppress: 'invalid address' },
  blocked: { status: 'blocked', suppress: 'blocked by the provider' },
  error: { status: 'failed' },
  spam: { suppress: 'marked as spam' },
  complaint: { suppress: 'marked as spam' },
  unsubscribed: { suppress: 'unsubscribed' },
};

function normEvent(e: unknown): string {
  return String(e ?? '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

/** Apply one or a batch of Brevo webhook events. Returns how many were matched to an outbox message. */
export async function applyWebhookEvents(db: D1Database, payload: unknown): Promise<{ received: number; matched: number }> {
  const events = (Array.isArray(payload) ? payload : [payload]).filter((e) => e && typeof e === 'object').slice(0, 500) as Record<string, unknown>[];
  let matched = 0;
  for (const e of events) {
    const event = normEvent(e.event);
    if (!event) continue;
    const messageId = typeof e['message-id'] === 'string' ? (e['message-id'] as string) : typeof e.messageId === 'string' ? (e.messageId as string) : null;
    const custom = typeof e['X-Mailin-custom'] === 'string' ? (e['X-Mailin-custom'] as string) : typeof e['x-mailin-custom'] === 'string' ? (e['x-mailin-custom'] as string) : '';
    const outboxId = /outbox_id:([A-Za-z0-9_-]{6,64})/.exec(custom)?.[1] ?? null;
    const row = outboxId
      ? await db.prepare('SELECT id, to_email, status FROM email_outbox WHERE id = ?').bind(outboxId).first<{ id: string; to_email: string; status: string }>()
      : messageId
        ? await db.prepare('SELECT id, to_email, status FROM email_outbox WHERE provider_message_id = ?').bind(messageId).first<{ id: string; to_email: string; status: string }>()
        : null;
    const ts = typeof e.ts_event === 'number' ? e.ts_event * 1000 : typeof e.ts_epoch === 'number' ? (e.ts_epoch as number) : null;
    const reason = typeof e.reason === 'string' ? (e.reason as string).slice(0, 300) : null;
    const t = now();
    const stmts: D1PreparedStatement[] = [
      db.prepare('INSERT INTO email_events (id, outbox_id, provider, provider_message_id, event, reason, occurred_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), row?.id ?? null, 'brevo', messageId, event.slice(0, 40), reason, ts, t),
    ];
    const effect = EVENT_STATUS[event];
    if (row) {
      matched++;
      // Delivery news never moves a message backwards (a late "delivered" after a bounce keeps the bounce).
      const keep = ['bounced', 'blocked', 'failed'].includes(row.status) && effect?.status === 'delivered';
      stmts.push(
        db
          .prepare('UPDATE email_outbox SET last_event = ?, last_event_at = ?, status = COALESCE(?, status), last_error = COALESCE(?, last_error), updated_at = ? WHERE id = ?')
          .bind(event.slice(0, 40), ts ?? t, keep ? null : effect?.status ?? null, effect?.status && effect.status !== 'delivered' ? `${event}${reason ? `: ${reason}` : ''}` : null, t, row.id),
      );
    }
    const email = row?.to_email ?? (typeof e.email === 'string' ? (e.email as string).toLowerCase() : null);
    if (effect?.suppress && email) stmts.push(db.prepare('INSERT OR IGNORE INTO email_suppressions (email, reason, created_at) VALUES (?, ?, ?)').bind(email, effect.suppress, t));
    await db.batch(stmts);
  }
  return { received: events.length, matched };
}

// ------------------------------------------------------------------ diagnostics

export async function outboxSummary(db: D1Database, workspaceId: string | null) {
  const where = workspaceId ? 'WHERE workspace_id = ?' : '';
  const args = workspaceId ? [workspaceId] : [];
  const counts = await db.prepare(`SELECT status, COUNT(*) AS n FROM email_outbox ${where} GROUP BY status`).bind(...args).all<{ status: string; n: number }>();
  const recent = await db
    .prepare(
      `SELECT id, to_email, template, priority, subject, status, attempts, next_attempt_at, last_error, last_event, last_event_at, created_at, sent_at, provider
       FROM email_outbox ${where} ORDER BY created_at DESC LIMIT 100`,
    )
    .bind(...args)
    .all();
  return { counts: Object.fromEntries(counts.results.map((c) => [c.status, c.n])), recent: recent.results };
}

export async function suppressedAmong(db: D1Database, emails: string[]): Promise<{ email: string; reason: string; created_at: number }[]> {
  if (!emails.length) return [];
  const r = await db.prepare(`SELECT * FROM email_suppressions WHERE email IN (${placeholders(emails.length)})`).bind(...emails).all<{ email: string; reason: string; created_at: number }>();
  return r.results;
}
