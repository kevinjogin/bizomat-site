// Organisation members and invitations (an organisation is a workspace). Every check is made here, on the server.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, parseJson, randomToken, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { auditEventStmt, auditStmt } from '../services/audit';
import { eventStmt } from '../services/analytics';
import { svcFromContext } from '../services/context';
import { workspaceMembers } from '../services/mappers';
import { notify } from '../services/notify';
import { requireWorkspace, wsAtLeast } from '../services/permissions';
import { requireProject, requireTask } from '../services/access';
import { enqueueEmail } from '../services/email/outbox';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';
import {
  INVITE_TTL_MS,
  emailDeliveryLabel,
  invitationStatus,
  sendInvitationEmail,
  type InvitationRow,
  type InviteGrant,
} from '../services/invitations';
import { ROLE_LABELS } from '../../shared/permissions';
import type { WorkspaceRole } from '../../shared/types';

export const orgRoutes = new Hono<AppEnv>();

const ROLE = z.enum(['owner', 'admin', 'project_manager', 'member', 'viewer', 'guest']);
const INVITE_ROLE = z.enum(['admin', 'project_manager', 'member', 'viewer', 'guest']);

function wsName(db: D1Database, wsId: string) {
  return db.prepare('SELECT name, settings_json FROM workspaces WHERE id = ?').bind(wsId).first<{ name: string; settings_json: string }>();
}

// ------------------------------------------------------------------ members

orgRoutes.get('/workspaces/:ws/members', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const role = await requireWorkspace(c.env.DB, wsId, user.id);
  const all = await workspaceMembers(c.env.DB, wsId);
  if (role !== 'guest') return c.json(all);
  // Guests see the people on what is shared with them (and the organisation's administrators), not the whole list.
  const rows = await c.env.DB
    .prepare(
      `SELECT DISTINCT bm.user_id FROM board_members bm WHERE bm.board_id IN (SELECT board_id FROM board_members WHERE user_id = ?1 AND workspace_id = ?2)
       UNION SELECT user_id FROM workspace_members WHERE workspace_id = ?2 AND role IN ('owner','admin')
       UNION SELECT ?1`,
    )
    .bind(user.id, wsId)
    .all<{ user_id: string }>();
  const visible = new Set(rows.results.map((r) => r.user_id));
  return c.json(all.filter((m) => visible.has(m.id)));
});

/** The members page: status, projects, task grants and who invited them. Administrators only. */
orgRoutes.get('/workspaces/:ws/members/directory', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const db = c.env.DB;
  const [members, projects, grants] = await Promise.all([
    db
      .prepare(
        `SELECT u.id, u.email, u.name, u.avatar_key, u.last_active_at, m.role, m.status, m.joined_at, m.suspended_at, inv.name AS invited_by_name
         FROM workspace_members m JOIN users u ON u.id = m.user_id LEFT JOIN users inv ON inv.id = m.invited_by
         WHERE m.workspace_id = ? ORDER BY u.name`,
      )
      .bind(wsId)
      .all<any>(),
    db
      .prepare(`SELECT bm.user_id, bm.role, b.id, b.name FROM board_members bm JOIN boards b ON b.id = bm.board_id WHERE bm.workspace_id = ? AND b.archived_at IS NULL AND b.kind != 'template'`)
      .bind(wsId)
      .all<{ user_id: string; role: string; id: string; name: string }>(),
    db.prepare('SELECT user_id, COUNT(*) AS n FROM item_permissions WHERE workspace_id = ? GROUP BY user_id').bind(wsId).all<{ user_id: string; n: number }>(),
  ]);
  const { avatarUrl } = await import('../services/mappers');
  return c.json(
    members.results.map((m) => ({
      id: m.id,
      email: m.email,
      name: m.name,
      avatarUrl: avatarUrl(m.id, m.avatar_key),
      role: m.role,
      status: m.status,
      joinedAt: m.joined_at,
      suspendedAt: m.suspended_at,
      lastActiveAt: m.last_active_at,
      invitedBy: m.invited_by_name,
      projects: projects.results.filter((p) => p.user_id === m.id).map((p) => ({ id: p.id, name: p.name, role: p.role })),
      taskGrants: grants.results.find((g) => g.user_id === m.id)?.n ?? 0,
    })),
  );
});

async function ownerCount(db: D1Database, wsId: string) {
  const r = await db.prepare("SELECT COUNT(*) AS n FROM workspace_members WHERE workspace_id = ? AND role = 'owner' AND status = 'active'").bind(wsId).first<{ n: number }>();
  return r?.n ?? 0;
}

orgRoutes.patch('/workspaces/:ws/members/:userId', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const targetId = c.req.param('userId');
  const myRole = await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const { role } = await body(c, z.object({ role: ROLE }));
  const target = await c.env.DB.prepare('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId).first<{ role: WorkspaceRole }>();
  if (!target) throw notFound('Member');
  if ((role === 'owner' || target.role === 'owner') && myRole !== 'owner') throw new HttpError(403, 'Only owners can grant or remove the owner role');
  // An admin cannot make themselves an owner, and nobody raises their own role.
  if (targetId === user.id && wsAtLeast(role, myRole) && role !== myRole) throw new HttpError(403, 'You cannot raise your own role');
  if (target.role === 'owner' && role !== 'owner' && (await ownerCount(c.env.DB, wsId)) <= 1) throw new HttpError(400, 'A workspace must keep at least one owner');
  if (target.role === role) return c.json({ ok: true });
  const ws = await wsName(c.env.DB, wsId);
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE workspace_members SET role = ? WHERE workspace_id = ? AND user_id = ?').bind(role, wsId, targetId),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'member.role_changed', targetType: 'user', targetId, metadata: { from: target.role, to: role }, ip: clientIp(c) }),
    auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: 'permission.changed', before: { role: target.role }, after: { role }, metadata: { userId: targetId, scope: 'organisation' } }),
  ]);
  await notify(svcFromContext(c), {
    workspaceId: wsId,
    userIds: [targetId],
    type: 'permission_change',
    title: `Your role in ${ws?.name ?? 'the workspace'} is now ${ROLE_LABELS[role]}`,
    body: `Changed by ${user.name}`,
    link: `/w/${wsId}/home`,
    email: { template: 'permission_change', organisation: ws?.name ?? '', project: null, change: `Your role in ${ws?.name ?? 'the organisation'} changed from ${ROLE_LABELS[target.role]} to ${ROLE_LABELS[role]}.`, by: user.name, url: `/w/${wsId}/home` },
  });
  return c.json({ ok: true });
});

/** Suspend or restore a membership: a suspended member keeps their data and grants but can open nothing. */
orgRoutes.post('/workspaces/:ws/members/:userId/suspend', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const targetId = c.req.param('userId');
  const myRole = await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const { suspended } = await body(c, z.object({ suspended: z.boolean() }));
  if (targetId === user.id) throw new HttpError(400, 'You cannot suspend yourself');
  const target = await c.env.DB.prepare('SELECT role, status FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId).first<{ role: WorkspaceRole; status: string }>();
  if (!target) throw notFound('Member');
  if (target.role === 'owner' && myRole !== 'owner') throw new HttpError(403, 'Only owners can suspend owners');
  if (suspended && target.role === 'owner' && (await ownerCount(c.env.DB, wsId)) <= 1) throw new HttpError(400, 'A workspace must keep at least one active owner');
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE workspace_members SET status = ?, suspended_at = ?, suspended_by = ? WHERE workspace_id = ? AND user_id = ?').bind(suspended ? 'suspended' : 'active', suspended ? t : null, suspended ? user.id : null, wsId, targetId),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: suspended ? 'member.suspended' : 'member.restored', targetType: 'user', targetId, ip: clientIp(c) }),
    auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: suspended ? 'member.suspended' : 'member.restored', before: { status: target.status }, after: { status: suspended ? 'suspended' : 'active' }, metadata: { userId: targetId } }),
  ]);
  return c.json({ ok: true });
});

orgRoutes.delete('/workspaces/:ws/members/:userId', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const targetId = c.req.param('userId');
  const myRole = await requireWorkspace(c.env.DB, wsId, user.id);
  const self = targetId === user.id;
  if (!self && !wsAtLeast(myRole, 'admin')) throw new HttpError(403, 'Only admins can remove members');
  const target = await c.env.DB.prepare('SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId).first<{ role: string }>();
  if (!target) throw notFound('Member');
  if (target.role === 'owner') {
    if (!self && myRole !== 'owner') throw new HttpError(403, 'Only owners can remove owners');
    if ((await ownerCount(c.env.DB, wsId)) <= 1) throw new HttpError(400, 'Transfer ownership before the last owner leaves');
  }
  const person = await c.env.DB.prepare('SELECT email, name FROM users WHERE id = ?').bind(targetId).first<{ email: string; name: string }>();
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM workspace_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM board_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM board_permissions WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM item_permissions WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM team_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    c.env.DB.prepare('DELETE FROM document_members WHERE workspace_id = ? AND user_id = ?').bind(wsId, targetId),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: self ? 'member.left' : 'member.removed', targetType: 'user', targetId, ip: clientIp(c) }),
    auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: self ? 'member.left' : 'member.removed', before: { role: target.role }, metadata: { userId: targetId } }),
  ]);
  // They are no longer a member, so they get an email only (no in-app notification can reach them here).
  if (!self && person) {
    const ws = await wsName(c.env.DB, wsId);
    const cfg = emailConfig(await emailEnv(c.env));
    await enqueueEmail(c.env, {
      workspaceId: wsId,
      userId: targetId,
      to: person.email,
      toName: person.name,
      data: { template: 'project_membership', organisation: ws?.name ?? '', project: null, change: `You were removed from ${ws?.name ?? 'the organisation'} and no longer have access to its projects.`, by: user.name, url: cfg.baseUrl || '/' },
      idempotencyKey: `member-removed:${wsId}:${targetId}:${now()}`,
    }).catch(() => null);
  }
  return c.json({ ok: true });
});

// -------------------------------------------------------------- invitations

orgRoutes.get('/workspaces/:ws/invitations', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const rows = await c.env.DB.prepare(
    `SELECT i.*, u.name AS invited_by_name FROM invitations i JOIN users u ON u.id = i.invited_by WHERE i.workspace_id = ? ORDER BY i.created_at DESC LIMIT 200`,
  )
    .bind(wsId)
    .all<InvitationRow & { invited_by_name: string }>();
  // The last email for each invitation (its idempotency key starts with invite:<id>:).
  const ids = rows.results.map((r) => r.id);
  const mails = ids.length
    ? await c.env.DB.prepare(
        `SELECT idempotency_key, status, last_error, last_event, sent_at, created_at FROM email_outbox WHERE workspace_id = ? AND template = 'invitation' ORDER BY created_at DESC LIMIT 1000`,
      )
        .bind(wsId)
        .all<{ idempotency_key: string; status: string; last_error: string | null; last_event: string | null; sent_at: number | null; created_at: number }>()
    : { results: [] };
  return c.json(
    rows.results.map(({ token_hash: _t, grants_json, ...i }) => {
      const mail = mails.results.find((m) => m.idempotency_key.startsWith(`invite:${i.id}:`));
      return {
        ...i,
        status: invitationStatus(i),
        grants: parseJson<InviteGrant[]>(grants_json, []),
        delivery: mail ? { status: mail.status, error: mail.last_error, event: mail.last_event, sentAt: mail.sent_at } : null,
      };
    }),
  );
});

const grantSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('board'), id: z.string().max(64), level: z.enum(['view', 'edit']).default('view') }),
  z.object({
    kind: z.literal('item'),
    id: z.string().max(64),
    canEdit: z.boolean().optional(),
    canUpdateStatus: z.boolean().optional(),
    canComment: z.boolean().optional(),
    canUpload: z.boolean().optional(),
    canViewFinance: z.boolean().optional(),
  }),
]);

/** The inviter must be allowed to give each grant: manage members on the project, or assign its tasks. */
async function checkGrants(db: D1Database, wsId: string, userId: string, grants: InviteGrant[]) {
  for (const g of grants) {
    if (g.kind === 'board') {
      const p = await requireProject(db, g.id, userId, 'manageMembers');
      if (p.board.workspace_id !== wsId) throw notFound('Board');
      if (g.level === 'edit' && p.caps.level === 'view') throw new HttpError(403, 'You cannot give more access than you have');
    } else {
      const t = await requireTask(db, g.id, userId, 'view');
      if (t.board.workspace_id !== wsId) throw notFound('Item');
      if (!t.project || !(t.project.caps.manageMembers || t.project.caps.assignTasks)) throw new HttpError(403, 'You cannot share this task');
      if (g.canViewFinance && !t.caps.viewFinance) throw new HttpError(403, 'You cannot share financial data you cannot see');
    }
  }
}

function inviteUrlFor(c: any, token: string) {
  const origin = new URL(c.req.url).origin + (c.env.BASE_PATH ?? '');
  return `${origin}/invite/${token}`;
}

orgRoutes.post('/workspaces/:ws/invitations', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  const role = await requireWorkspace(c.env.DB, wsId, user.id, 'member');
  const ws = await wsName(c.env.DB, wsId);
  const settings = parseJson<{ allowMembersToInvite?: boolean }>(ws?.settings_json, {});
  const input = await body(
    c,
    z.object({
      email: z.string().trim().toLowerCase().email().max(320),
      role: INVITE_ROLE.default('member'),
      message: z.string().trim().max(600).optional(),
      grants: z.array(grantSchema).max(20).optional(),
    }),
  );
  const grants = (input.grants ?? []) as InviteGrant[];
  // Project managers and administrators invite; members only when the organisation allows it, and only guests to
  // what they can share, members and viewers otherwise.
  const canInvite = wsAtLeast(role, 'project_manager') || settings.allowMembersToInvite;
  if (!canInvite) throw new HttpError(403, 'Only admins can invite members');
  if (input.role === 'admin' && !wsAtLeast(role, 'admin')) throw new HttpError(403, 'Only admins can invite admins');
  if (input.role === 'project_manager' && !wsAtLeast(role, 'admin')) throw new HttpError(403, 'Only admins can invite project managers');
  await rateLimit(c.env.DB, `invite:user:${user.id}`, 50, 60 * 60_000);
  await rateLimit(c.env.DB, `invite:ws:${wsId}`, 200, 24 * 60 * 60_000);
  if (grants.length) await checkGrants(c.env.DB, wsId, user.id, grants);
  const existingMember = await c.env.DB.prepare('SELECT u.id FROM users u JOIN workspace_members m ON m.user_id = u.id WHERE m.workspace_id = ? AND u.email = ?').bind(wsId, input.email).first();
  if (existingMember) throw new HttpError(409, 'That person is already a member');
  const token = randomToken(32);
  const id = newId();
  const t = now();
  const expiresAt = t + INVITE_TTL_MS;
  await c.env.DB.batch([
    // One active invitation per address: an older pending one is replaced (its link stops working).
    c.env.DB.prepare('UPDATE invitations SET revoked_at = ?, revoked_by = ? WHERE workspace_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(t, user.id, wsId, input.email),
    c.env.DB.prepare(
      'INSERT INTO invitations (id, workspace_id, email, role, token_hash, invited_by, created_at, expires_at, last_sent_at, send_count, grants_json, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)',
    ).bind(id, wsId, input.email, input.role, await sha256Hex(token), user.id, t, expiresAt, t, JSON.stringify(grants), input.message ?? ''),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'invitation.created', targetType: 'invitation', targetId: id, metadata: { email: input.email, role: input.role }, ip: clientIp(c) }),
    auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: 'invitation.sent', after: { role: input.role, grants: grants.length }, metadata: { invitationId: id } }),
    eventStmt(c.env.DB, { type: 'member.invited', userId: user.id, workspaceId: wsId, entityType: 'invitation', entityId: id, metadata: { role: input.role }, at: t }),
  ]);
  const inviteUrl = inviteUrlFor(c, token);
  const mail = await sendInvitationEmail(c.env, (p) => c.executionCtx.waitUntil(p), { id, workspaceId: wsId, email: input.email, role: input.role, expiresAt, inviteUrl, inviterName: user.name, message: input.message, grants, sendNumber: 1 });
  // Someone who already has an account also sees it in BIZOMAT (without the secret link: they accept from the email
  // or the link shared with them).
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(input.email).first<{ id: string }>();
  if (existingUser) {
    const other = await c.env.DB.prepare("SELECT workspace_id FROM workspace_members WHERE user_id = ? AND status = 'active' LIMIT 1").bind(existingUser.id).first<{ workspace_id: string }>();
    if (other) {
      const svc = svcFromContext(c);
      await notify(svc, {
        workspaceId: other.workspace_id,
        userIds: [existingUser.id],
        type: 'invitation',
        title: `${user.name} invited you to ${ws?.name}`,
        body: `Role: ${ROLE_LABELS[input.role]}. Open the invitation email to accept.`,
        link: `/invitations`,
        entityType: 'workspace',
        entityId: wsId,
        // The email itself is the invitation (sent above), so this notification sends none.
        email: undefined,
        dedupeKey: `invitation:${id}`,
      }).catch(() => 0);
    }
  }
  return c.json({ id, email: input.email, role: input.role, inviteUrl, expiresAt, emailDelivery: emailDeliveryLabel(c.env, mail) }, 201);
});

/** Send again with a new link (the previous one stops working) and a fresh seven days. */
orgRoutes.post('/workspaces/:ws/invitations/:id/resend', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const inv = await c.env.DB.prepare('SELECT * FROM invitations WHERE id = ? AND workspace_id = ?').bind(c.req.param('id'), wsId).first<InvitationRow>();
  if (!inv) throw notFound('Invitation');
  if (inv.accepted_at || inv.revoked_at) throw new HttpError(409, `This invitation is ${invitationStatus(inv)}`);
  await rateLimit(c.env.DB, `invite-resend:${inv.id}`, 5, 24 * 60 * 60_000);
  await rateLimit(c.env.DB, `invite-resend-burst:${inv.id}`, 1, 60_000);
  const token = randomToken(32);
  const t = now();
  const expiresAt = t + INVITE_TTL_MS;
  const sendNumber = (inv.send_count || 1) + 1;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE invitations SET token_hash = ?, expires_at = ?, last_sent_at = ?, send_count = ? WHERE id = ?').bind(await sha256Hex(token), expiresAt, t, sendNumber, inv.id),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'invitation.resent', targetType: 'invitation', targetId: inv.id, ip: clientIp(c) }),
    auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: 'invitation.resent', metadata: { invitationId: inv.id, sendNumber } }),
  ]);
  const inviteUrl = inviteUrlFor(c, token);
  const mail = await sendInvitationEmail(c.env, (p) => c.executionCtx.waitUntil(p), {
    id: inv.id,
    workspaceId: wsId,
    email: inv.email,
    role: inv.role,
    expiresAt,
    inviteUrl,
    inviterName: user.name,
    message: inv.message,
    grants: parseJson<InviteGrant[]>(inv.grants_json, []),
    sendNumber,
  });
  return c.json({ id: inv.id, inviteUrl, expiresAt, emailDelivery: emailDeliveryLabel(c.env, mail) });
});

orgRoutes.delete('/workspaces/:ws/invitations/:id', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const r = await c.env.DB.prepare('UPDATE invitations SET revoked_at = ?, revoked_by = ? WHERE id = ? AND workspace_id = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(now(), user.id, c.req.param('id'), wsId).run();
  if (!r.meta.changes) throw notFound('Invitation');
  await c.env.DB.batch([
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'invitation.revoked', targetId: c.req.param('id') }),
    auditEventStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, type: 'invitation.revoked', metadata: { invitationId: c.req.param('id') } }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------- my invitations

/** Pending invitations addressed to the signed-in person's email (to point them to the invitation email). */
orgRoutes.get('/me/invitations', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare(
    `SELECT i.id, i.role, i.expires_at, i.created_at, w.name AS workspace_name, u.name AS inviter FROM invitations i
     JOIN workspaces w ON w.id = i.workspace_id AND w.deleted_at IS NULL JOIN users u ON u.id = i.invited_by
     WHERE i.email = ? AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > ? ORDER BY i.created_at DESC LIMIT 50`,
  )
    .bind(user.email, now())
    .all();
  return c.json(rows.results);
});

// ------------------------------------------------------------------ audit trail

/** The permanent audit trail, by date range (administrators). Read-only: there is no route that changes it. */
orgRoutes.get('/workspaces/:ws/audit-events', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const from = Number(c.req.query('from') ?? 0);
  const to = Number(c.req.query('to') ?? Date.now() + 1);
  const type = c.req.query('type');
  const boardId = c.req.query('board');
  const args: unknown[] = [wsId, from, to];
  let extra = '';
  if (type) {
    extra += ' AND a.event_type LIKE ?';
    args.push(`${type.replace(/[%_]/g, '')}%`);
  }
  if (boardId) {
    extra += ' AND a.board_id = ?';
    args.push(boardId);
  }
  const rows = await c.env.DB.prepare(
    `SELECT a.*, u.name AS actor_name FROM audit_events a LEFT JOIN users u ON u.id = a.actor_id
     WHERE a.workspace_id = ? AND a.created_at >= ? AND a.created_at < ?${extra} ORDER BY a.created_at DESC LIMIT 500`,
  )
    .bind(...args)
    .all<any>();
  return c.json(
    rows.results.map((r) => ({
      id: r.id,
      boardId: r.board_id,
      itemId: r.item_id,
      actorId: r.actor_id,
      actorName: r.actor_name,
      type: r.event_type,
      before: parseJson(r.before_json, null),
      after: parseJson(r.after_json, null),
      metadata: parseJson(r.metadata_json, {}),
      createdAt: r.created_at,
    })),
  );
});

