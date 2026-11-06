import type { NotificationType } from '../../shared/types';
import { newId, now, placeholders } from '../lib/util';
import type { Svc } from './context';

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
}

/**
 * Creates in-app notifications, honouring per-user preferences, workspace
 * membership (no notifications leak to former members) and de-duplication.
 */
export async function notify(svc: Svc, n: NotifyInput): Promise<number> {
  let ids = Array.from(new Set(n.userIds.filter(Boolean)));
  if (!n.includeActor && svc.actor) ids = ids.filter((id) => id !== svc.actor!.id);
  if (ids.length === 0) return 0;
  const members = await svc.db
    .prepare(`SELECT user_id FROM workspace_members WHERE workspace_id = ? AND user_id IN (${placeholders(ids.length)})`)
    .bind(n.workspaceId, ...ids)
    .all<{ user_id: string }>();
  const memberSet = new Set(members.results.map((m) => m.user_id));
  const prefs = await svc.db
    .prepare(`SELECT user_id, in_app FROM notification_preferences WHERE type = ? AND user_id IN (${placeholders(ids.length)})`)
    .bind(n.type, ...ids)
    .all<{ user_id: string; in_app: number }>();
  const muted = new Set(prefs.results.filter((p) => !p.in_app).map((p) => p.user_id));
  const targets = ids.filter((id) => memberSet.has(id) && !muted.has(id));
  if (targets.length === 0) return 0;
  const t = now();
  const stmts = targets.map((uid) =>
    svc.db
      .prepare(
        `INSERT OR IGNORE INTO notifications (id, workspace_id, user_id, type, title, body, entity_type, entity_id, link, actor_id, dedupe_key, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        newId(),
        n.workspaceId,
        uid,
        n.type,
        n.title.slice(0, 200),
        (n.body ?? '').slice(0, 1000),
        n.entityType ?? null,
        n.entityId ?? null,
        n.link ?? null,
        svc.actor?.id ?? null,
        n.dedupeKey ? `${n.dedupeKey}:${uid}` : null,
        t,
      ),
  );
  const res = await svc.db.batch(stmts);
  return res.reduce((s, r) => s + (r.meta.changes ?? 0), 0);
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
