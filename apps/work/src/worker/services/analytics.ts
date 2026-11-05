// Persistent product analytics: activity events, daily activity, daily
// counters and sanitised error records. Every write here is best-effort and
// must never break the user's request.

import { newId, now } from '../lib/util';

export type EventType =
  | 'user.registered'
  | 'user.login'
  | 'user.logout'
  | 'workspace.created'
  | 'project.created'
  | 'project.updated'
  | 'project.archived'
  | 'project.deleted'
  | 'task.created'
  | 'task.updated'
  | 'task.completed'
  | 'member.invited'
  | 'member.joined'
  | 'settings.changed';

export const EVENT_TYPES: EventType[] = [
  'user.registered', 'user.login', 'user.logout', 'workspace.created', 'project.created', 'project.updated', 'project.archived',
  'project.deleted', 'task.created', 'task.updated', 'task.completed', 'member.invited', 'member.joined', 'settings.changed',
];

export interface EventInput {
  type: EventType;
  userId?: string | null;
  workspaceId?: string | null;
  boardId?: string | null;
  entityType?: string;
  entityId?: string;
  /** Small, non-sensitive metadata only (never content). */
  metadata?: Record<string, string | number | boolean | null>;
  at?: number;
}

export function eventStmt(db: D1Database, e: EventInput) {
  return db
    .prepare(
      'INSERT INTO user_activity_events (id, user_id, workspace_id, board_id, event_type, entity_type, entity_id, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(newId(), e.userId ?? null, e.workspaceId ?? null, e.boardId ?? null, e.type, e.entityType ?? null, e.entityId ?? null, JSON.stringify(e.metadata ?? {}), e.at ?? now());
}

export async function trackEvent(db: D1Database, e: EventInput) {
  try {
    await eventStmt(db, e).run();
  } catch (err) {
    console.warn('trackEvent failed', err);
  }
}

export const utcDay = (t: number = now()) => new Date(t).toISOString().slice(0, 10);

export function dailyActivityStmt(db: D1Database, userId: string, t: number, heartbeat: boolean) {
  return db
    .prepare(
      `INSERT INTO user_daily_activity (user_id, day, first_seen_at, last_seen_at, heartbeats) VALUES (?1, ?2, ?3, ?3, ?4)
       ON CONFLICT(user_id, day) DO UPDATE SET last_seen_at = MAX(last_seen_at, ?3), heartbeats = heartbeats + ?4`,
    )
    .bind(userId, utcDay(t), t, heartbeat ? 1 : 0);
}

export function metricStmt(db: D1Database, metric: string, by = 1, day = utcDay()) {
  return db
    .prepare('INSERT INTO analytics_daily (day, metric, value) VALUES (?1, ?2, ?3) ON CONFLICT(day, metric) DO UPDATE SET value = value + ?3')
    .bind(day, metric, by);
}

export async function bumpMetric(db: D1Database, metric: string, by = 1) {
  try {
    await metricStmt(db, metric, by).run();
  } catch (err) {
    console.warn('bumpMetric failed', err);
  }
}

/** Replace ids in a path so error routes can be grouped without leaking data. */
export function routePattern(path: string): string {
  return path
    .split('/')
    .map((seg) => (/^[A-Za-z0-9_-]{12,}$/.test(seg) || /^\d+$/.test(seg) ? ':id' : seg))
    .join('/')
    .slice(0, 120);
}

export async function recordError(db: D1Database, e: { method: string; path: string; status: number; error: unknown }) {
  try {
    const err = e.error instanceof Error ? e.error : new Error(String(e.error));
    // First line only, capped, with anything that looks like a secret or email masked.
    const message = (err.message || '')
      .split('\n')[0]
      .replace(/[A-Za-z0-9_-]{24,}/g, '[redacted]')
      .replace(/[^\s@]+@[^\s@]+/g, '[email]')
      .slice(0, 160);
    await db.batch([
      db
        .prepare('INSERT INTO app_errors (id, created_at, method, route, status, error_name, message) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), now(), e.method, routePattern(e.path), e.status, (err.name || 'Error').slice(0, 60), message),
    ]);
  } catch (err) {
    console.warn('recordError failed', err);
  }
}
