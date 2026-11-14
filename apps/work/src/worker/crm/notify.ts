// CRM notifications: in-app (crm_notifications) and, where the person chose it, email through the app's outbox.
// Only current members of the organisation are notified; the person who caused the change is skipped unless asked.

import type { Env } from '../env';
import { newId, now, placeholders } from '../lib/util';
import { enqueueEmail, processOutbox } from '../services/email/outbox';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';
import { crmUrl } from './util';
import { isExampleSpace } from '../system/example';

export const CRM_NOTIFICATION_TYPES = {
  assignment: { label: 'Records assigned to me', email: true },
  task: { label: 'Activities and tasks assigned to me', email: true },
  mention: { label: 'Mentions in notes and comments', email: true },
  overdue: { label: 'Overdue activities and follow-ups', email: true },
  due: { label: 'Deals close to their expected close date', email: false },
  deal: { label: 'Deal stage changes', email: false },
  won_lost: { label: 'Deals won or lost', email: false },
  invitation: { label: 'Invitations and membership changes', email: true },
  automation: { label: 'Other automation messages', email: false },
} as const;

export type CrmNotificationType = keyof typeof CRM_NOTIFICATION_TYPES;
export const CRM_NOTIFICATION_KEYS = Object.keys(CRM_NOTIFICATION_TYPES) as CrmNotificationType[];

export interface CrmNotifyInput {
  orgId: string;
  orgName: string;
  userIds: string[];
  type: CrmNotificationType;
  title: string;
  body?: string;
  /** A CRM path such as /o/<org>/deals/<id>. */
  link?: string | null;
  entityType?: string;
  entityId?: string;
  actorId?: string | null;
  includeActor?: boolean;
  /** The same key never notifies the same person twice. */
  dedupeKey?: string;
}

/** Returns the number of people notified in the app. */
export async function crmNotify(env: Env, n: CrmNotifyInput, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  let ids = Array.from(new Set(n.userIds.filter(Boolean)));
  if (!n.includeActor && n.actorId) ids = ids.filter((id) => id !== n.actorId);
  if (!ids.length) return 0;
  const db = env.DB;
  const members = await db
    .prepare(`SELECT m.user_id, u.email, u.name FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND u.disabled_at IS NULL AND m.user_id IN (${placeholders(ids.length)})`)
    .bind(n.orgId, ...ids)
    .all<{ user_id: string; email: string; name: string }>();
  if (!members.results.length) return 0;
  const prefs = await db
    .prepare(`SELECT user_id, in_app, email FROM crm_notification_prefs WHERE type = ? AND user_id IN (${placeholders(members.results.length)})`)
    .bind(n.type, ...members.results.map((m) => m.user_id))
    .all<{ user_id: string; in_app: number; email: number }>();
  const pref = new Map(prefs.results.map((p) => [p.user_id, p]));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  const emailTo: { id: string; email: string; name: string }[] = [];
  for (const m of members.results) {
    const p = pref.get(m.user_id);
    const inApp = p ? !!p.in_app : true;
    const email = p ? !!p.email : CRM_NOTIFICATION_TYPES[n.type].email;
    if (inApp) {
      stmts.push(
        db
          .prepare('INSERT OR IGNORE INTO crm_notifications (id, org_id, user_id, type, title, body, link, entity_type, entity_id, actor_id, dedupe_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(newId(), n.orgId, m.user_id, n.type, n.title.slice(0, 300), (n.body ?? '').slice(0, 1000), n.link ?? null, n.entityType ?? null, n.entityId ?? null, n.actorId ?? null, n.dedupeKey ?? null, t),
      );
    }
    if (email) emailTo.push({ id: m.user_id, email: m.email, name: m.name });
  }
  let created = 0;
  if (stmts.length) {
    const res = await db.batch(stmts);
    created = res.reduce((s, r) => s + (r.meta.changes ?? 0), 0);
  }
  // The example company's notifications stay in the app: no email about invented data (system/example.ts).
  if (emailTo.length && !(await isExampleSpace(db, 'crm', n.orgId))) {
    const cfg = emailConfig(await emailEnv(env));
    if (cfg.provider !== 'none') {
      let link: string | null = null;
      let prefsUrl: string | undefined;
      try {
        link = n.link ? crmUrl(env, n.link) : null;
        prefsUrl = crmUrl(env, `/o/${n.orgId}/settings/notifications`);
      } catch {
        link = null;
      }
      const work = (async () => {
        for (const r of emailTo) {
          await enqueueEmail(env, {
            userId: r.id,
            to: r.email,
            toName: r.name,
            data: { template: 'crm_notification', organisation: n.orgName, title: n.title, body: n.body ?? null, url: link, preferencesUrl: prefsUrl },
            idempotencyKey: `crm:${n.dedupeKey ?? newId()}:${r.id}`,
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

/** Members of an organisation with one of the given roles. */
export async function membersWithRoles(db: D1Database, orgId: string, roles: string[]): Promise<string[]> {
  const rows = await db.prepare(`SELECT user_id FROM crm_members WHERE org_id = ? AND role IN (${placeholders(roles.length)})`).bind(orgId, ...roles).all<{ user_id: string }>();
  return rows.results.map((r) => r.user_id);
}
