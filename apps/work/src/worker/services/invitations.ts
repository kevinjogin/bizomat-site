// Invitations: what is granted on acceptance, the invitation email, and accepting one. Only the SHA-256 of the token
// is stored; the token itself exists in the email (and the link shown to the inviter) only.

import type { WorkspaceRole } from '../../shared/types';
import { ROLE_LABELS } from '../../shared/permissions';
import { HttpError, now, parseJson, sha256Hex } from '../lib/util';
import type { Env } from '../env';
import { auditEventStmt, auditStmt } from './audit';
import { eventStmt } from './analytics';
import { queueAndKick, type QueueResult } from './email/outbox';
import { emailConfig } from './email/provider';

export const INVITE_TTL_MS = 7 * 86_400_000;

export type InviteGrant =
  | { kind: 'board'; id: string; level: 'view' | 'edit' }
  | { kind: 'item'; id: string; canEdit?: boolean; canUpdateStatus?: boolean; canComment?: boolean; canUpload?: boolean; canViewFinance?: boolean };

export interface InvitationRow {
  id: string;
  workspace_id: string;
  email: string;
  role: string;
  token_hash: string;
  invited_by: string;
  created_at: number;
  expires_at: number;
  accepted_at: number | null;
  revoked_at: number | null;
  accepted_by: string | null;
  revoked_by: string | null;
  last_sent_at: number | null;
  send_count: number;
  grants_json: string;
  message: string;
}

export function invitationStatus(i: Pick<InvitationRow, 'accepted_at' | 'revoked_at' | 'expires_at'>, at = now()): 'accepted' | 'revoked' | 'expired' | 'pending' {
  return i.revoked_at ? 'revoked' : i.accepted_at ? 'accepted' : i.expires_at < at ? 'expired' : 'pending';
}

/** Human text for what the invitation gives, e.g. "Task: Pump maintenance (update status, comment)". */
export async function describeGrants(db: D1Database, grants: InviteGrant[]): Promise<string | null> {
  const parts: string[] = [];
  for (const g of grants.slice(0, 10)) {
    if (g.kind === 'board') {
      const b = await db.prepare('SELECT name FROM boards WHERE id = ?').bind(g.id).first<{ name: string }>();
      if (b) parts.push(`Project: ${b.name} (${g.level === 'edit' ? 'edit' : 'view'})`);
    } else {
      const i = await db.prepare('SELECT name FROM items WHERE id = ?').bind(g.id).first<{ name: string }>();
      if (i) parts.push(`Task: ${i.name}`);
    }
  }
  return parts.length ? parts.join('; ') : null;
}

export async function sendInvitationEmail(
  env: Env,
  waitUntil: (p: Promise<unknown>) => void,
  inv: { id: string; workspaceId: string; email: string; role: string; expiresAt: number; inviteUrl: string; inviterName: string; message?: string; grants: InviteGrant[]; sendNumber: number },
): Promise<QueueResult> {
  const ws = await env.DB.prepare('SELECT name FROM workspaces WHERE id = ?').bind(inv.workspaceId).first<{ name: string }>();
  const existing = await env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(inv.email).first();
  return queueAndKick(env, waitUntil, {
    workspaceId: inv.workspaceId,
    to: inv.email,
    data: {
      template: 'invitation',
      organisation: ws?.name ?? 'an organisation',
      inviter: inv.inviterName,
      role: ROLE_LABELS[inv.role as WorkspaceRole] ?? inv.role,
      expires: new Date(inv.expiresAt).toUTCString().replace(/:\d\d GMT$/, ' UTC'),
      url: inv.inviteUrl,
      message: inv.message || null,
      existingUser: !!existing,
      access: await describeGrants(env.DB, inv.grants),
    },
    // One email per sending of this invitation: a retry of the same request never sends twice.
    idempotencyKey: `invite:${inv.id}:${inv.sendNumber}`,
    sensitive: true,
  });
}

export function emailDeliveryLabel(env: Env, r: QueueResult | null): string {
  if (!r) return emailConfig(env).provider === 'none' ? 'not_configured' : 'queued';
  return r.queued ? 'queued' : r.reason;
}

/** Statements that give the access an invitation carries, after the membership exists. */
export function grantStatements(db: D1Database, workspaceId: string, userId: string, grants: InviteGrant[], grantedBy: string, valid: { boards: Set<string>; items: Map<string, string> }): D1PreparedStatement[] {
  const t = now();
  const out: D1PreparedStatement[] = [];
  for (const g of grants) {
    if (g.kind === 'board' && valid.boards.has(g.id)) {
      out.push(
        db
          .prepare('INSERT INTO board_members (board_id, workspace_id, user_id, role) VALUES (?, ?, ?, ?) ON CONFLICT(board_id, user_id) DO NOTHING')
          .bind(g.id, workspaceId, userId, g.level === 'edit' ? 'editor' : 'viewer'),
      );
    } else if (g.kind === 'item' && valid.items.has(g.id)) {
      out.push(
        db
          .prepare(
            `INSERT INTO item_permissions (item_id, board_id, workspace_id, user_id, can_edit, can_update_status, can_comment, can_upload, can_manage_assignments, can_view_finance, granted_by, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?) ON CONFLICT(item_id, user_id) DO NOTHING`,
          )
          .bind(g.id, valid.items.get(g.id)!, workspaceId, userId, g.canEdit ? 1 : 0, g.canUpdateStatus === false ? 0 : 1, g.canComment === false ? 0 : 1, g.canUpload ? 1 : 0, g.canViewFinance ? 1 : 0, grantedBy, t, t),
      );
    }
  }
  return out;
}

/** Board and item ids from the grants that still exist in the workspace. */
export async function validGrantTargets(db: D1Database, workspaceId: string, grants: InviteGrant[]) {
  const boards = new Set<string>();
  const items = new Map<string, string>();
  for (const g of grants) {
    if (g.kind === 'board') {
      const b = await db.prepare("SELECT id FROM boards WHERE id = ? AND workspace_id = ? AND kind != 'template'").bind(g.id, workspaceId).first<{ id: string }>();
      if (b) boards.add(b.id);
    } else {
      const i = await db.prepare('SELECT id, board_id FROM items WHERE id = ? AND workspace_id = ?').bind(g.id, workspaceId).first<{ id: string; board_id: string }>();
      if (i) items.set(i.id, i.board_id);
    }
  }
  return { boards, items };
}

/**
 * Accept an invitation for the signed-in user: the token must match, be pending and unexpired, and the account's
 * email must be the address it was sent to. Single use: the first acceptance wins.
 */
export async function acceptInvitation(db: D1Database, token: string, user: { id: string; email: string; name: string }, ip?: string) {
  const inv = await db.prepare('SELECT * FROM invitations WHERE token_hash = ?').bind(await sha256Hex(token)).first<InvitationRow>();
  if (!inv || inv.revoked_at) throw new HttpError(404, 'Invitation not found');
  if (inv.accepted_at) {
    if (inv.accepted_by === user.id) return { inv, already: true };
    throw new HttpError(410, 'This invitation has already been used');
  }
  if (inv.expires_at < now()) throw new HttpError(410, 'This invitation has expired');
  if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new HttpError(403, `This invitation was sent to ${inv.email}. Sign in with that account to accept it.`);
  const ws = await db.prepare('SELECT id FROM workspaces WHERE id = ? AND deleted_at IS NULL').bind(inv.workspace_id).first();
  if (!ws) throw new HttpError(404, 'Invitation not found');
  const t = now();
  // Claim the invitation first (single use even with two simultaneous requests).
  const claim = await db.prepare('UPDATE invitations SET accepted_at = ?, accepted_by = ? WHERE id = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(t, user.id, inv.id).run();
  if (!claim.meta.changes) throw new HttpError(410, 'This invitation has already been used');
  const existing = await db.prepare('SELECT role, status FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(inv.workspace_id, user.id).first<{ role: string; status: string }>();
  const grants = parseJson<InviteGrant[]>(inv.grants_json, []);
  const valid = await validGrantTargets(db, inv.workspace_id, grants);
  await db.batch([
    // An existing membership is kept as it is (no duplicate, no silent role change).
    db.prepare('INSERT OR IGNORE INTO workspace_members (workspace_id, user_id, role, joined_at, invited_by) VALUES (?, ?, ?, ?, ?)').bind(inv.workspace_id, user.id, inv.role, t, inv.invited_by),
    ...grantStatements(db, inv.workspace_id, user.id, grants, inv.invited_by, valid),
    eventStmt(db, { type: 'member.joined', userId: user.id, workspaceId: inv.workspace_id, entityType: 'workspace', entityId: inv.workspace_id, metadata: { role: inv.role }, at: t }),
    auditStmt(db, { workspaceId: inv.workspace_id, actorId: user.id, action: 'member.joined', targetType: 'user', targetId: user.id, ip }),
    auditEventStmt(db, { workspaceId: inv.workspace_id, actorId: user.id, type: 'invitation.accepted', after: { role: inv.role, grants: grants.length }, metadata: { invitationId: inv.id, invitedBy: inv.invited_by, alreadyMember: !!existing } }),
  ]);
  return { inv, already: false, grants, valid };
}
