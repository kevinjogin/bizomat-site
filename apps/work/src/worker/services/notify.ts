import { NOTIFICATION_TYPES, type NotificationType } from '../../shared/types';
import { newId, now, placeholders } from '../lib/util';
import type { Svc } from './context';
import { emailConfig } from './email/provider';
import { emailEnv } from './email/settings';
import { enqueueEmail, processOutbox } from './email/outbox';
import type { TemplateData } from './email/templates';

/**
 * Email is on by default for what needs action (assignments, mentions, due dates, access changes) and off for the
 * rest. Each person can change it per type (Settings > Notifications).
 */
export const EMAIL_DEFAULTS: Record<NotificationType, boolean> = {
  assignment: true,
  mention: true,
  comment: false,
  reply: false,
  status_change: false,
  due_soon: true,
  overdue: true,
  automation: false,
  invitation: true,
  invitation_accepted: true,
  project_membership: true,
  permission_change: true,
  report_generated: false,
};

export { NOTIFICATION_TYPES };

/** Template data for the email, without the recipient-specific links (added here). */
export type NotifyEmail = TemplateData;

export interface NotifyInput {
  workspaceId: string;
  userIds: string[];
  type: NotificationType;
  title: string;
  body?: string;
  link?: string | null;
  entityType?: string;
  entityId?: string;
  /** When set, the same (dedupeKey, user) pair is only ever notified once. */
  dedupeKey?: string;
  /** Include the acting user (default: the actor never notifies themselves). */
  includeActor?: boolean;
  /** Structured content for the email. Without it, the email repeats the title, body and link. */
  email?: NotifyEmail;
}

/** The address of an app link in emails, e.g. https://bizomat.ai/tasks/w/... */
export function absoluteLink(baseUrl: string, link: string | null | undefined): string {
  if (!link) return baseUrl || '/';
  if (/^https?:\/\//.test(link)) return link;
  return `${baseUrl}${link.startsWith('/') ? '' : '/'}${link}`;
}

/** The link to one task in emails: opens the board for project members and the task alone for task-only access. */
export function taskLink(workspaceId: string, itemId: string) {
  return `/w/${workspaceId}/tasks/${itemId}`;
}

/**
 * Creates in-app notifications, honouring per-user preferences, workspace membership (no notifications leak to
 * former or suspended members) and de-duplication, and queues the matching emails.
 */
export async function notify(svc: Svc, n: NotifyInput): Promise<number> {
  let ids = Array.from(new Set(n.userIds.filter(Boolean)));
  if (!n.includeActor && svc.actor) ids = ids.filter((id) => id !== svc.actor!.id);
  if (ids.length === 0) return 0;
  const members = await svc.db
    .prepare(`SELECT user_id FROM workspace_members WHERE workspace_id = ? AND status = 'active' AND user_id IN (${placeholders(ids.length)})`)
    .bind(n.workspaceId, ...ids)
    .all<{ user_id: string }>();
  const memberSet = new Set(members.results.map((m) => m.user_id));
  const prefs = await svc.db
    .prepare(`SELECT user_id, in_app, email FROM notification_preferences WHERE type = ? AND user_id IN (${placeholders(ids.length)})`)
    .bind(n.type, ...ids)
    .all<{ user_id: string; in_app: number; email: number }>();
  const prefOf = new Map(prefs.results.map((p) => [p.user_id, p]));
  const inApp = ids.filter((id) => memberSet.has(id) && (prefOf.get(id)?.in_app ?? 1) === 1);
  const byEmail = ids.filter((id) => memberSet.has(id) && (prefOf.has(id) ? prefOf.get(id)!.email === 1 : EMAIL_DEFAULTS[n.type]));
  const t = now();
  let created = 0;
  const notificationIds = new Map<string, string>();
  if (inApp.length) {
    const rows = inApp.map((uid) => ({ uid, id: newId() }));
    const res = await svc.db.batch(
      rows.map(({ uid, id }) =>
        svc.db
          .prepare(
            `INSERT OR IGNORE INTO notifications (id, workspace_id, user_id, type, title, body, entity_type, entity_id, link, actor_id, dedupe_key, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(id, n.workspaceId, uid, n.type, n.title.slice(0, 200), (n.body ?? '').slice(0, 1000), n.entityType ?? null, n.entityId ?? null, n.link ?? null, svc.actor?.id ?? null, n.dedupeKey ? `${n.dedupeKey}:${uid}` : null, t),
      ),
    );
    res.forEach((r, i) => {
      if (r.meta.changes) {
        created += r.meta.changes;
        notificationIds.set(rows[i].uid, rows[i].id);
      }
    });
  }
  if (byEmail.length) await emailNotification(svc, n, byEmail, notificationIds).catch((e) => console.error('notify_email_failed', e instanceof Error ? e.message : e));
  return created;
}

async function emailNotification(svc: Svc, n: NotifyInput, userIds: string[], notificationIds: Map<string, string>) {
  const cfg = emailConfig(await emailEnv(svc.env));
  if (cfg.provider === 'none') return;
  const users = await svc.db.prepare(`SELECT id, email, name FROM users WHERE disabled_at IS NULL AND id IN (${placeholders(userIds.length)})`).bind(...userIds).all<{ id: string; email: string; name: string }>();
  const ws = await svc.db.prepare('SELECT name FROM workspaces WHERE id = ?').bind(n.workspaceId).first<{ name: string }>();
  const prefsUrl = absoluteLink(cfg.baseUrl, `/w/${n.workspaceId}/settings/notifications`);
  const link = n.entityType === 'item' && n.entityId ? taskLink(n.workspaceId, n.entityId) : n.link;
  let queued = 0;
  for (const u of users.results) {
    // Same event, same person, one email: keyed on the notification's own de-duplication key or its row.
    const key = n.dedupeKey ? `notify:${n.dedupeKey}:${u.id}` : notificationIds.has(u.id) ? `notify:${notificationIds.get(u.id)}` : `notify:${n.type}:${n.entityId ?? ''}:${u.id}:${now()}`;
    const data: TemplateData = n.email
      ? ({ ...n.email, url: absoluteLink(cfg.baseUrl, 'url' in n.email ? (n.email as { url?: string }).url ?? link : link), preferencesUrl: prefsUrl } as TemplateData)
      : { template: 'notification', organisation: ws?.name ?? '', title: n.title, body: n.body ?? null, url: absoluteLink(cfg.baseUrl, link), preferencesUrl: prefsUrl };
    const r = await enqueueEmail(svc.env, { workspaceId: n.workspaceId, userId: u.id, to: u.email, toName: u.name, data, idempotencyKey: key }, cfg);
    if (r.queued) queued++;
  }
  if (queued) svc.waitUntil(processOutbox(svc.env, { max: 10 }).catch((e) => console.error('email_process_failed', e instanceof Error ? e.message : e)));
}

export function itemLink(workspaceId: string, boardId: string, itemId: string) {
  return `/w/${workspaceId}/boards/${boardId}?item=${itemId}`;
}

/** Extract @mentions encoded as `@[Display Name](user:ID)` from update text. */
export function extractMentions(body: string): string[] {
  const ids = new Set<string>();
  const re = /@\[[^\]]{1,80}\]\(user:([A-Za-z0-9_-]{1,64})\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) ids.add(m[1]);
  return Array.from(ids);
}
