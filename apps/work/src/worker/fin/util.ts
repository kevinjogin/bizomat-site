// Helpers shared by the BIZOMAT Finance routes: links, the audit trail, notifications and small parsers.

import type { Env } from '../env';
import { appBase } from '../services/app-url';
import { HttpError, newId, now, placeholders } from '../lib/util';
import { enqueueEmail, processOutbox } from '../services/email/outbox';
import { toCsv } from '../../shared/crm/csv';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';

/** Finance is served at /finance on the same host as the app (https://bizomat.ai/finance in production). */
export const FIN_MOUNT = '/finance';

/** An absolute Finance address for emails, built from configuration, never from the request. */
export function finUrl(env: Env, path: string): string {
  const b = appBase(env);
  return `${b.origin}${FIN_MOUNT}${path.startsWith('/') ? path : `/${path}`}`;
}

/** The audit trail of important changes. Never put passwords, tokens or file contents here. */
export function auditStmt(db: D1Database, e: { orgId: string; actorId: string | null; action: string; targetType?: string; targetId?: string; before?: unknown; after?: unknown; metadata?: Record<string, unknown>; ip?: string | null }) {
  return db
    .prepare('INSERT INTO fin_audit_log (id, org_id, actor_id, action, target_type, target_id, before_json, after_json, metadata_json, ip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), e.orgId, e.actorId, e.action, e.targetType ?? null, e.targetId ?? null, e.before === undefined ? null : JSON.stringify(e.before), e.after === undefined ? null : JSON.stringify(e.after), JSON.stringify(e.metadata ?? {}), e.ip ?? null, now());
}

export function searchText(...parts: (string | null | undefined)[]): string {
  return parts
    .filter((p): p is string => !!p)
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);
}

/** A database refusal from the ledger triggers (migrations/0011_finance.sql) as a clear 409. */
export function ledgerError(e: unknown): never {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes('FIN_LOCKED')) throw new HttpError(409, 'That date is in a locked period');
  if (msg.includes('FIN_UNBALANCED')) throw new HttpError(409, 'The journal does not balance');
  if (msg.includes('FIN_POSTED')) throw new HttpError(409, 'Posted entries cannot be changed; reverse them instead');
  if (/UNIQUE constraint failed: fin_(docs|quotes|credit_notes)/.test(msg)) throw new HttpError(409, 'That number is already used');
  if (/CHECK constraint failed/i.test(msg)) throw new HttpError(409, 'That is more than is left, or another change was made at the same time. Refresh and try again.');
  if (/UNIQUE constraint failed: fin_accounts/.test(msg)) throw new HttpError(409, 'That account code is already used');
  if (/UNIQUE constraint failed: fin_tax_codes/.test(msg)) throw new HttpError(409, 'That tax code is already used');
  if (/FOREIGN KEY constraint failed/i.test(msg)) throw new HttpError(400, 'A record it refers to is not in this workspace');
  throw e;
}

/** Run a batch; ledger refusals become 409s. */
export async function runBatch(db: D1Database, stmts: D1PreparedStatement[]) {
  try {
    return await db.batch(stmts);
  } catch (e) {
    ledgerError(e);
  }
}

// ------------------------------------------------------------------ notifications

export const FIN_NOTIFICATION_TYPES = {
  approval: { label: 'Records waiting for my approval', email: true },
  approved: { label: 'My records approved or returned', email: false },
  invoice_due: { label: 'Invoices due soon or overdue', email: true },
  bill_due: { label: 'Bills due soon or overdue', email: true },
  budget: { label: 'Budget warnings', email: true },
  summary: { label: 'Monthly financial summary', email: false },
  recurring: { label: 'Recurring records created', email: false },
  report: { label: 'Scheduled reports ready', email: false },
  membership: { label: 'Invitations and membership changes', email: true },
} as const;
export type FinNotificationType = keyof typeof FIN_NOTIFICATION_TYPES;
export const FIN_NOTIFICATION_KEYS = Object.keys(FIN_NOTIFICATION_TYPES) as FinNotificationType[];

export interface FinNotifyInput {
  orgId: string;
  orgName: string;
  userIds: string[];
  type: FinNotificationType;
  title: string;
  body?: string;
  /** A Finance path such as /o/<org>/invoices/<id>. */
  link?: string | null;
  actorId?: string | null;
  /** The same key never notifies the same person twice. */
  dedupeKey?: string;
}

/** In-app notifications (and email where the person chose it). Only current members are notified. */
export async function finNotify(env: Env, n: FinNotifyInput, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  let ids = Array.from(new Set(n.userIds.filter(Boolean)));
  if (n.actorId) ids = ids.filter((id) => id !== n.actorId);
  if (!ids.length) return 0;
  const db = env.DB;
  const members = await db
    .prepare(`SELECT m.user_id, u.email, u.name FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND u.disabled_at IS NULL AND m.user_id IN (${placeholders(ids.length)})`)
    .bind(n.orgId, ...ids)
    .all<{ user_id: string; email: string; name: string }>();
  if (!members.results.length) return 0;
  const prefs = await db
    .prepare(`SELECT user_id, in_app, email FROM fin_notification_prefs WHERE type = ? AND user_id IN (${placeholders(members.results.length)})`)
    .bind(n.type, ...members.results.map((m) => m.user_id))
    .all<{ user_id: string; in_app: number; email: number }>();
  const pref = new Map(prefs.results.map((p) => [p.user_id, p]));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  const emailTo: { id: string; email: string; name: string }[] = [];
  for (const m of members.results) {
    const p = pref.get(m.user_id);
    if (p ? !!p.in_app : true) {
      stmts.push(
        db
          .prepare('INSERT OR IGNORE INTO fin_notifications (id, org_id, user_id, type, title, body, link, actor_id, dedupe_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(newId(), n.orgId, m.user_id, n.type, n.title.slice(0, 300), (n.body ?? '').slice(0, 1000), n.link ?? null, n.actorId ?? null, n.dedupeKey ?? null, t),
      );
    }
    if (p ? !!p.email : FIN_NOTIFICATION_TYPES[n.type].email) emailTo.push({ id: m.user_id, email: m.email, name: m.name });
  }
  let created = 0;
  if (stmts.length) created = (await db.batch(stmts)).reduce((s, r) => s + (r.meta.changes ?? 0), 0);
  // Email only for notifications that are new (a repeat with the same key sends nothing).
  if (emailTo.length && created > 0) {
    const cfg = emailConfig(await emailEnv(env));
    if (cfg.provider !== 'none') {
      let link: string | null = null;
      let prefsUrl: string | undefined;
      try {
        link = n.link ? finUrl(env, n.link) : null;
        prefsUrl = finUrl(env, `/o/${n.orgId}/settings/notifications`);
      } catch {
        link = null;
      }
      const work = (async () => {
        for (const r of emailTo) {
          await enqueueEmail(env, {
            userId: r.id,
            to: r.email,
            toName: r.name,
            data: { template: 'fin_notification', organisation: n.orgName, title: n.title, body: n.body ?? null, url: link, preferencesUrl: prefsUrl },
            idempotencyKey: `fin:${n.dedupeKey ?? newId()}:${r.id}`,
          }).catch(() => null);
        }
        await processOutbox(env, { max: 10 }).catch(() => null);
      })();
      if (waitUntil) waitUntil(work);
      else await work;
    }
  }
  return created;
}

export const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Rows to CSV, the first row being the header (formulas neutralised, UTF-8 with a byte order mark). */
export function csvOf(rows: unknown[][]): string {
  const cell = (v: unknown) => (v === null || v === undefined ? '' : typeof v === 'number' ? v : String(v));
  return toCsv((rows[0] ?? []).map((v) => String(cell(v))), rows.slice(1).map((r) => r.map(cell)));
}
