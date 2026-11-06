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
