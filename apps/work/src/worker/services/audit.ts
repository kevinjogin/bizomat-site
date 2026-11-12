import { newId, now } from '../lib/util';

export function auditStmt(
  db: D1Database,
  e: { workspaceId?: string | null; actorId?: string | null; action: string; targetType?: string; targetId?: string; metadata?: unknown; ip?: string },
) {
  return db
    .prepare(
      `INSERT INTO audit_log (id, workspace_id, actor_id, action, target_type, target_id, metadata_json, ip, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(newId(), e.workspaceId ?? null, e.actorId ?? null, e.action, e.targetType ?? null, e.targetId ?? null, JSON.stringify(e.metadata ?? {}), e.ip ?? null, now());
}

export async function audit(db: D1Database, e: Parameters<typeof auditStmt>[1]) {
  await auditStmt(db, e).run();
}

export function activityStmt(
  db: D1Database,
  e: {
    workspaceId: string;
    boardId?: string | null;
    itemId?: string | null;
    actorId?: string | null;
    action: string;
    columnId?: string | null;
    oldValue?: unknown;
    newValue?: unknown;
  },
) {
  return db
    .prepare(
      `INSERT INTO activity_log (id, workspace_id, board_id, item_id, actor_id, action, column_id, old_value, new_value, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      newId(),
      e.workspaceId,
      e.boardId ?? null,
      e.itemId ?? null,
      e.actorId ?? null,
      e.action,
      e.columnId ?? null,
      e.oldValue === undefined ? null : JSON.stringify(e.oldValue),
      e.newValue === undefined ? null : JSON.stringify(e.newValue),
      now(),
    );
}

/**
 * The permanent audit trail (audit_events): one row per significant event, with the values before and after where
 * they matter. Insert-only: nothing in the application updates or deletes these rows, and they carry no foreign keys,
 * so they outlive the task, project or person they describe. Never put passwords, tokens or message bodies here.
 */
export interface AuditEvent {
  workspaceId?: string | null;
  boardId?: string | null;
  itemId?: string | null;
  actorId?: string | null;
  type: string;
  before?: unknown;
  after?: unknown;
  metadata?: Record<string, unknown>;
  at?: number;
}

export function auditEventStmt(db: D1Database, e: AuditEvent) {
  return db
    .prepare(
      `INSERT INTO audit_events (id, workspace_id, board_id, item_id, actor_id, event_type, before_json, after_json, metadata_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      newId(),
      e.workspaceId ?? null,
      e.boardId ?? null,
      e.itemId ?? null,
      e.actorId ?? null,
      e.type,
      e.before === undefined ? null : JSON.stringify(e.before),
      e.after === undefined ? null : JSON.stringify(e.after),
      JSON.stringify(e.metadata ?? {}),
      e.at ?? now(),
    );
}

export async function auditEvent(db: D1Database, e: AuditEvent) {
  await auditEventStmt(db, e).run();
}
