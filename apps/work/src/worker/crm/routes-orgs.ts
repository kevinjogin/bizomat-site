// CRM organisations: creating one, its settings, members and roles, invitations, teams, permissions, ownership and the
// audit trail. Every check is made here, on the server.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, parseJson, placeholders, randomToken, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { avatarUrl } from '../services/mappers';
import { enqueueEmail, processOutbox } from '../services/email/outbox';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';
import { validateUpload } from '../routes/files';
import { isSupportedCurrency } from '../../shared/money';
import { CONFIGURABLE_ROLES, CRM_MODULES, CRM_ROLE_LABELS, DEFAULT_PERMS, INVITABLE_ROLES, moduleActions, resolvePerms, type CrmRole } from '../../shared/crm/roles';
import { DEFAULT_PIPELINE, LEAD_STATUS_KINDS, LIST_KEYS, orgSettings } from '../../shared/crm/defaults';
import { PRESETS } from '../../shared/crm/automations';
import type { CrmInvitationDTO, CrmMemberDTO, CrmOrgDTO, CrmOrgSummary, CrmTeamDTO } from '../../shared/crm/types';
import { type OrgAccess, type OrgRow, deny, requireOrg, requirePerm } from './access';
import { CRM_NOTIFICATION_KEYS, CRM_NOTIFICATION_TYPES, crmNotify } from './notify';
import { auditStmt, crmUrl } from './util';
import { refuseExample } from '../system/example';

export const orgRoutes = new Hono<AppEnv>();

export const CRM_INVITE_TTL_MS = 14 * 86_400_000;

function logoUrl(o: Pick<OrgRow, 'id' | 'logo_key'>): string | null {
  return o.logo_key ? `/api/crm/orgs/${o.id}/logo?v=${o.logo_key.slice(-8)}` : null;
}

async function emailConnected(c: { env: AppEnv['Bindings'] }): Promise<boolean> {
  return emailConfig(await emailEnv(c.env)).provider !== 'none';
}

export async function orgDTO(c: { env: AppEnv['Bindings'] }, a: OrgAccess): Promise<CrmOrgDTO> {
  const o = a.org;
  return {
    id: o.id,
    name: o.name,
    industry: o.industry,
    website: o.website,
    phone: o.phone,
    email: o.email,
    address: o.address,
    country: o.country,
    description: o.description,
    currency: o.currency,
    timezone: o.timezone,
    logoUrl: logoUrl(o),
    settings: a.settings,
    createdAt: o.created_at,
    role: a.role,
    perms: a.perms,
    emailConnected: await emailConnected(c),
  };
}

const text = (max: number) => z.string().trim().max(max);

const orgFields = {
  name: text(120).min(1, 'Give the organisation a name'),
  industry: text(80).optional(),
  website: text(300).optional(),
  phone: text(60).optional(),
  email: z.union([z.literal(''), z.string().trim().toLowerCase().email().max(320)]).optional(),
  address: text(300).optional(),
  country: text(100).optional(),
  description: text(2000).optional(),
  currency: z.string().refine(isSupportedCurrency, 'Choose a supported currency').optional(),
  timezone: text(64).optional(),
};

function validTimezone(tz: string | undefined): string {
  if (!tz) return 'UTC';
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    throw new HttpError(400, 'Unknown time zone');
  }
}

/** Statements that create an organisation with its owner, a default pipeline and the starting automations. */
export function createOrgStmts(db: D1Database, input: { id?: string; name: string; currency?: string; timezone?: string; industry?: string; website?: string; phone?: string; email?: string; address?: string; country?: string; description?: string }, ownerId: string) {
  const id = input.id ?? newId();
  const t = now();
  const pipelineId = newId();
  const stages = DEFAULT_PIPELINE.stages.map((s, i) => ({ ...s, id: newId(), position: (i + 1) * 1000 }));
  const proposal = stages.find((s) => s.name === 'Proposal')?.id ?? stages[0].id;
  const stmts: D1PreparedStatement[] = [
    db
      .prepare('INSERT INTO crm_orgs (id, name, industry, website, phone, email, address, country, description, currency, timezone, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.name, input.industry ?? '', input.website ?? '', input.phone ?? '', input.email ?? '', input.address ?? '', input.country ?? '', input.description ?? '', input.currency ?? 'AUD', input.timezone ?? 'UTC', ownerId, t, t),
    db.prepare("INSERT INTO crm_members (org_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?)").bind(id, ownerId, t),
    db.prepare('INSERT INTO crm_pipelines (id, org_id, name, position, is_default, created_at, updated_at) VALUES (?, ?, ?, 1000, 1, ?, ?)').bind(pipelineId, id, DEFAULT_PIPELINE.name, t, t),
    ...stages.map((s) => db.prepare('INSERT INTO crm_stages (id, org_id, pipeline_id, name, probability, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(s.id, id, pipelineId, s.name, s.probability, s.position, t)),
  ];
  const highValue = orgSettings({}).highValueDeal;
  for (const p of PRESETS) {
    const config = JSON.parse(JSON.stringify(p.config).replace('"{proposalStage}"', JSON.stringify(proposal)));
    const conditions = JSON.parse(JSON.stringify(p.conditions).replace('"{highValue}"', String(highValue)));
    stmts.push(
      db
        .prepare('INSERT INTO crm_automations (id, org_id, name, description, trigger_type, trigger_json, conditions_json, actions_json, enabled, preset, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)')
        .bind(newId(), id, p.name, p.description, p.trigger, JSON.stringify(config), JSON.stringify(conditions), JSON.stringify(p.actions), p.key, ownerId, t, t),
    );
  }
  stmts.push(auditStmt(db, { orgId: id, actorId: ownerId, action: 'org.created', targetType: 'org', targetId: id, after: { name: input.name } }));
  return { id, stmts };
}

// ------------------------------------------------------------------ organisations

orgRoutes.get('/orgs', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare(
    `SELECT o.id, o.name, o.industry, o.logo_key, m.role, (SELECT COUNT(*) FROM crm_members x WHERE x.org_id = o.id) AS member_count
     FROM crm_orgs o JOIN crm_members m ON m.org_id = o.id WHERE m.user_id = ? AND o.deleted_at IS NULL ORDER BY o.name COLLATE NOCASE`,
  )
    .bind(user.id)
    .all<{ id: string; name: string; industry: string; logo_key: string | null; role: CrmRole; member_count: number }>();
  const orgs: CrmOrgSummary[] = rows.results.map((o) => ({ id: o.id, name: o.name, industry: o.industry, logoUrl: logoUrl(o), role: o.role, memberCount: o.member_count }));
  const invites = await c.env.DB.prepare(
    `SELECT i.id, i.role, i.expires_at, i.created_at, i.message, o.name AS org_name, u.name AS inviter FROM crm_invitations i
     JOIN crm_orgs o ON o.id = i.org_id AND o.deleted_at IS NULL LEFT JOIN users u ON u.id = i.invited_by
     WHERE i.email = ? AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.declined_at IS NULL AND i.expires_at > ?
       AND NOT EXISTS (SELECT 1 FROM crm_members m WHERE m.org_id = i.org_id AND m.user_id = ?)
     ORDER BY i.created_at DESC LIMIT 50`,
  )
    .bind(user.email, now(), user.id)
    .all<{ id: string; role: CrmRole; expires_at: number; created_at: number; message: string; org_name: string; inviter: string | null }>();
  return c.json({
    orgs,
    invitations: invites.results.map((i) => ({ id: i.id, role: i.role, orgName: i.org_name, inviter: i.inviter, message: i.message, createdAt: i.created_at, expiresAt: i.expires_at })),
  });
});

orgRoutes.post('/orgs', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `crm-org-create:${user.id}`, 20, 24 * 3_600_000);
  const input = await body(c, z.object(orgFields));
  const { id, stmts } = createOrgStmts(c.env.DB, { ...input, timezone: validTimezone(input.timezone), email: input.email ?? '' }, user.id);
  await c.env.DB.batch(stmts);
  return c.json({ id }, 201);
});

orgRoutes.get('/orgs/:org', async (c) => {
  const a = await requireOrg(c);
  return c.json(await orgDTO(c, a));
});

const listOption = z.object({
  key: z.string().regex(/^[a-z0-9_]{1,40}$/),
  label: z.string().trim().min(1).max(60),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  kind: z.enum(LEAD_STATUS_KINDS).optional(),
  archived: z.boolean().optional(),
});

orgRoutes.patch('/orgs/:org', async (c) => {
  const a = await requireOrg(c);
  const input = await body(
    c,
    z.object({
      ...Object.fromEntries(Object.entries(orgFields).map(([k, v]) => [k, (v as z.ZodType).optional()])),
      settings: z
        .object({
          ...Object.fromEntries(LIST_KEYS.map((k) => [k, z.array(listOption).min(1).max(100).optional()])),
          closingSoonDays: z.number().int().min(1).max(365).optional(),
          highValueDeal: z.number().int().min(0).max(1e15).optional(),
        })
        .optional(),
    }) as z.ZodType<Record<string, any>>,
  );
  const detailKeys = Object.keys(orgFields).filter((k) => input[k] !== undefined);
  // Organisation details and permissions: administrators. CRM lists (statuses, sources...): whoever manages settings.
  if (detailKeys.length && a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can change organisation details');
  if (input.settings && !a.perms.settings.manage) deny('You cannot change CRM settings');
  if (input.currency && input.currency !== a.org.currency) {
    const used = await c.env.DB.prepare('SELECT 1 FROM crm_deals WHERE org_id = ? LIMIT 1').bind(a.orgId).first();
    if (used) throw new HttpError(409, 'The currency cannot change once the organisation has deals: their amounts are in the current currency');
  }
  const sets: string[] = [];
  const args: unknown[] = [];
  for (const k of detailKeys) {
    const col = k;
    sets.push(`${col} = ?`);
    args.push(k === 'timezone' ? validTimezone(input[k]) : input[k]);
  }
  let settingsBefore: unknown;
  let settingsAfter: unknown;
  if (input.settings) {
    const current = parseJson<Record<string, unknown>>(a.org.settings_json, {});
    const merged = { ...current, ...Object.fromEntries(Object.entries(input.settings).filter(([, v]) => v !== undefined)) };
    const clean = orgSettings(merged);
    sets.push('settings_json = ?');
    args.push(JSON.stringify(clean));
    settingsBefore = Object.keys(input.settings);
    settingsAfter = clean;
  }
  if (!sets.length) return c.json(await orgDTO(c, a));
  await c.env.DB.batch([
    c.env.DB.prepare(`UPDATE crm_orgs SET ${sets.join(', ')}, updated_at = ? WHERE id = ?`).bind(...args, now(), a.orgId),
    auditStmt(c.env.DB, {
      orgId: a.orgId,
      actorId: a.userId,
      action: input.settings ? 'org.settings_changed' : 'org.updated',
      targetType: 'org',
      targetId: a.orgId,
      before: Object.fromEntries(detailKeys.map((k) => [k, (a.org as any)[k]])),
      after: { ...Object.fromEntries(detailKeys.map((k) => [k, input[k]])), ...(settingsBefore ? { settings: settingsBefore } : {}) },
      ip: clientIp(c),
    }),
  ]);
  void settingsAfter;
  const fresh = await requireOrgFresh(c);
  return c.json(await orgDTO(c, fresh));
});

async function requireOrgFresh(c: any): Promise<OrgAccess> {
  (c as any).__crmAccess = undefined;
  return requireOrg(c);
}

/** Delete the organisation (owner only, the name typed to confirm). It disappears for every member; nothing is erased. */
orgRoutes.delete('/orgs/:org', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner') deny('Only the owner can delete the organisation');
  const { confirmName } = await body(c, z.object({ confirmName: z.string() }));
  if (confirmName.trim() !== a.org.name) throw new HttpError(400, 'Type the organisation name exactly to confirm');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_orgs SET deleted_at = ?, updated_at = ? WHERE id = ?').bind(now(), now(), a.orgId),
    c.env.DB.prepare('UPDATE crm_invitations SET revoked_at = ?, revoked_by = ? WHERE org_id = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(now(), a.userId, a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'org.deleted', targetType: 'org', targetId: a.orgId, before: { name: a.org.name }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

orgRoutes.post('/orgs/:org/logo', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can change the logo');
  await rateLimit(c.env.DB, `crm-upload:${a.userId}`, 60, 60_000);
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const { type, bytes } = await validateUpload(file, { imagesOnly: true });
  const key = `crm/${a.orgId}/logo-${newId()}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_orgs SET logo_key = ?, updated_at = ? WHERE id = ?').bind(key, now(), a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'org.logo_changed', targetType: 'org', targetId: a.orgId }),
  ]);
  if (a.org.logo_key) c.executionCtx.waitUntil(c.env.FILES.delete(a.org.logo_key));
  return c.json({ logoUrl: logoUrl({ id: a.orgId, logo_key: key }) }, 201);
});

orgRoutes.get('/orgs/:org/logo', async (c) => {
  const a = await requireOrg(c);
  if (!a.org.logo_key) throw notFound('Logo');
  const obj = await c.env.FILES.get(a.org.logo_key);
  if (!obj) throw notFound('Logo');
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType ?? 'image/png',
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
});

// ------------------------------------------------------------------ members

async function memberList(db: D1Database, orgId: string): Promise<CrmMemberDTO[]> {
  const [rows, teams] = await Promise.all([
    db
      .prepare('SELECT m.user_id, m.role, m.title, m.joined_at, u.name, u.email, u.avatar_key FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? ORDER BY u.name COLLATE NOCASE')
      .bind(orgId)
      .all<{ user_id: string; role: CrmRole; title: string; joined_at: number; name: string; email: string; avatar_key: string | null }>(),
    db.prepare('SELECT team_id, user_id FROM crm_team_members WHERE org_id = ?').bind(orgId).all<{ team_id: string; user_id: string }>(),
  ]);
  return rows.results.map((m) => ({
    userId: m.user_id,
    name: m.name,
    email: m.email,
    avatarUrl: avatarUrl(m.user_id, m.avatar_key),
    role: m.role,
    title: m.title,
    joinedAt: m.joined_at,
    teamIds: teams.results.filter((t) => t.user_id === m.user_id).map((t) => t.team_id),
  }));
}

orgRoutes.get('/orgs/:org/members', async (c) => {
  const a = await requireOrg(c);
  return c.json(await memberList(c.env.DB, a.orgId));
});

async function targetMember(db: D1Database, orgId: string, userId: string) {
  const m = await db.prepare('SELECT m.role, u.name, u.email FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND m.user_id = ?').bind(orgId, userId).first<{ role: CrmRole; name: string; email: string }>();
  if (!m) throw notFound('Member');
  return m;
}

orgRoutes.patch('/orgs/:org/members/:userId', async (c) => {
  const a = await requireOrg(c);
  const targetId = c.req.param('userId');
  const input = await body(c, z.object({ role: z.enum(INVITABLE_ROLES).optional(), title: text(80).optional() }));
  const target = await targetMember(c.env.DB, a.orgId, targetId);
  const self = targetId === a.userId;
  if (input.title !== undefined && !self && !a.perms.members.manage) deny('You cannot change other members');
  if (input.role !== undefined && input.role !== target.role) {
    if (!a.perms.members.manage) deny('You cannot change roles');
    if (self) deny('You cannot change your own role');
    if (target.role === 'owner') deny('Transfer ownership to change the owner role');
    // Only the owner gives or takes the administrator role.
    if ((input.role === 'admin' || target.role === 'admin') && a.role !== 'owner') deny('Only the owner can add or remove administrators');
  }
  const stmts: D1PreparedStatement[] = [];
  if (input.title !== undefined) stmts.push(c.env.DB.prepare('UPDATE crm_members SET title = ? WHERE org_id = ? AND user_id = ?').bind(input.title, a.orgId, targetId));
  if (input.role !== undefined && input.role !== target.role) {
    stmts.push(
      c.env.DB.prepare('UPDATE crm_members SET role = ? WHERE org_id = ? AND user_id = ?').bind(input.role, a.orgId, targetId),
      auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'member.role_changed', targetType: 'user', targetId, before: { role: target.role }, after: { role: input.role }, ip: clientIp(c) }),
    );
  }
  if (stmts.length) await c.env.DB.batch(stmts);
  if (input.role !== undefined && input.role !== target.role) {
    await crmNotify(c.env, {
      orgId: a.orgId,
      orgName: a.org.name,
      userIds: [targetId],
      type: 'invitation',
      title: `Your role in ${a.org.name} is now ${CRM_ROLE_LABELS[input.role]}`,
      body: `Changed by ${a.userName}.`,
      link: `/o/${a.orgId}/overview`,
      actorId: a.userId,
    }, (p) => c.executionCtx.waitUntil(p));
  }
  return c.json({ ok: true });
});

const reassignSchema = z.object({ reassignTo: z.string().max(64).nullable().optional() });

/** The statements that hand a person's records and open activities to someone else (or leave them unowned). */
function reassignStmts(db: D1Database, orgId: string, fromId: string, toId: string | null): D1PreparedStatement[] {
  const t = now();
  return [
    ...['crm_contacts', 'crm_companies', 'crm_leads', 'crm_deals'].map((tbl) => db.prepare(`UPDATE ${tbl} SET owner_id = ?, updated_at = ? WHERE org_id = ? AND owner_id = ?`).bind(toId, t, orgId, fromId)),
    db.prepare("UPDATE crm_activities SET assigned_to = ?, updated_at = ? WHERE org_id = ? AND assigned_to = ? AND status = 'open'").bind(toId, t, orgId, fromId),
  ];
}

orgRoutes.delete('/orgs/:org/members/:userId', async (c) => {
  const a = await requireOrg(c);
  const targetId = c.req.param('userId');
  if (targetId === a.userId) throw new HttpError(400, 'Use "Leave organisation" to remove yourself');
  if (!a.perms.members.manage) deny('You cannot remove members');
  const target = await targetMember(c.env.DB, a.orgId, targetId);
  if (target.role === 'owner') deny('The owner cannot be removed');
  if (target.role === 'admin' && a.role !== 'owner') deny('Only the owner can remove administrators');
  const { reassignTo } = await body(c, reassignSchema).catch(() => ({}) as { reassignTo?: string | null });
  if (reassignTo) {
    if (reassignTo === targetId) throw new HttpError(400, 'Choose someone else to take over the records');
    await targetMember(c.env.DB, a.orgId, reassignTo);
  }
  await c.env.DB.batch([
    ...(reassignTo !== undefined ? reassignStmts(c.env.DB, a.orgId, targetId, reassignTo ?? null) : []),
    c.env.DB.prepare('DELETE FROM crm_members WHERE org_id = ? AND user_id = ?').bind(a.orgId, targetId),
    c.env.DB.prepare('DELETE FROM crm_calendar_feeds WHERE org_id = ? AND user_id = ?').bind(a.orgId, targetId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'member.removed', targetType: 'user', targetId, before: { role: target.role }, metadata: { reassignedTo: reassignTo ?? null }, ip: clientIp(c) }),
  ]);
  // No longer a member, so an email only (when email is connected).
  if (await emailConnected(c)) {
    await enqueueEmail(c.env, {
      userId: targetId,
      to: target.email,
      toName: target.name,
      data: { template: 'crm_notification', organisation: a.org.name, title: `You were removed from ${a.org.name}`, body: `${a.userName} removed you from the CRM organisation ${a.org.name}. You no longer have access to its records.`, url: null },
      idempotencyKey: `crm-removed:${a.orgId}:${targetId}:${now()}`,
    }).catch(() => null);
  }
  return c.json({ ok: true });
});

orgRoutes.post('/orgs/:org/leave', async (c) => {
  const a = await requireOrg(c);
  if (a.role === 'owner') throw new HttpError(400, 'Transfer ownership to another member before leaving');
  const { reassignTo } = await body(c, reassignSchema).catch(() => ({}) as { reassignTo?: string | null });
  if (reassignTo) await targetMember(c.env.DB, a.orgId, reassignTo);
  await c.env.DB.batch([
    ...(reassignTo ? reassignStmts(c.env.DB, a.orgId, a.userId, reassignTo) : []),
    c.env.DB.prepare('DELETE FROM crm_members WHERE org_id = ? AND user_id = ?').bind(a.orgId, a.userId),
    c.env.DB.prepare('DELETE FROM crm_calendar_feeds WHERE org_id = ? AND user_id = ?').bind(a.orgId, a.userId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'member.left', targetType: 'user', targetId: a.userId, before: { role: a.role }, metadata: { reassignedTo: reassignTo ?? null }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

/** Ownership moves to another member, who must already belong to the organisation; the previous owner becomes an administrator. */
orgRoutes.post('/orgs/:org/transfer', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner') deny('Only the owner can transfer ownership');
  const { userId } = await body(c, z.object({ userId: z.string().max(64) }));
  if (userId === a.userId) throw new HttpError(400, 'You are already the owner');
  const target = await targetMember(c.env.DB, a.orgId, userId);
  await rateLimit(c.env.DB, `crm-transfer:${a.orgId}`, 10, 24 * 3_600_000);
  await c.env.DB.batch([
    // Demote first: the database allows one owner at a time (crm_members_one_owner).
    c.env.DB.prepare("UPDATE crm_members SET role = 'admin' WHERE org_id = ? AND user_id = ?").bind(a.orgId, a.userId),
    c.env.DB.prepare("UPDATE crm_members SET role = 'owner' WHERE org_id = ? AND user_id = ?").bind(a.orgId, userId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'org.ownership_transferred', targetType: 'user', targetId: userId, before: { owner: a.userId, newOwnerRole: target.role }, after: { owner: userId }, ip: clientIp(c) }),
  ]);
  await crmNotify(c.env, { orgId: a.orgId, orgName: a.org.name, userIds: [userId], type: 'invitation', title: `You are now the owner of ${a.org.name}`, body: `${a.userName} transferred ownership to you.`, link: `/o/${a.orgId}/settings/organisation`, actorId: a.userId }, (p) => c.executionCtx.waitUntil(p));
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ invitations

interface InviteRow {
  id: string;
  org_id: string;
  email: string;
  role: CrmRole;
  message: string;
  invited_by: string | null;
  created_at: number;
  expires_at: number;
  send_count: number;
  accepted_at: number | null;
  accepted_by: string | null;
  declined_at: number | null;
  revoked_at: number | null;
}

export function inviteStatus(i: Pick<InviteRow, 'accepted_at' | 'declined_at' | 'revoked_at' | 'expires_at'>, at = now()): CrmInvitationDTO['status'] {
  return i.revoked_at ? 'revoked' : i.accepted_at ? 'accepted' : i.declined_at ? 'declined' : i.expires_at < at ? 'expired' : 'pending';
}

function inviteLink(c: any, token: string): string {
  try {
    return crmUrl(c.env, `/join/${encodeURIComponent(token)}`);
  } catch (e) {
    throw new HttpError(503, `Invitation links cannot be created: ${e instanceof Error ? e.message : 'the app address is not configured'}`);
  }
}

async function sendInvite(c: any, a: OrgAccess, inv: { id: string; email: string; role: CrmRole; expiresAt: number; message: string; token: string; sendNumber: number }) {
  const url = inviteLink(c, inv.token);
  if (!(await emailConnected(c))) return { url, delivery: 'not_configured' };
  const existing = await c.env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(inv.email).first();
  const r = await enqueueEmail(c.env, {
    to: inv.email,
    data: {
      template: 'crm_invitation',
      organisation: a.org.name,
      inviter: a.userName,
      role: CRM_ROLE_LABELS[inv.role],
      expires: new Date(inv.expiresAt).toUTCString().replace(/:\d\d GMT$/, ' UTC'),
      url,
      message: inv.message || null,
      existingUser: !!existing,
    },
    idempotencyKey: `crm-invite:${inv.id}:${inv.sendNumber}`,
    sensitive: true,
  });
  c.executionCtx.waitUntil(processOutbox(c.env, { max: 5 }).catch(() => null));
  return { url, delivery: r.queued ? 'queued' : r.reason };
}

orgRoutes.get('/orgs/:org/invitations', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot see invitations');
  const rows = await c.env.DB.prepare('SELECT i.*, u.name AS inviter FROM crm_invitations i LEFT JOIN users u ON u.id = i.invited_by WHERE i.org_id = ? ORDER BY i.created_at DESC LIMIT 200')
    .bind(a.orgId)
    .all<InviteRow & { inviter: string | null }>();
  const out: CrmInvitationDTO[] = rows.results.map((i) => ({ id: i.id, email: i.email, role: i.role, status: inviteStatus(i), invitedBy: i.inviter, createdAt: i.created_at, expiresAt: i.expires_at, message: i.message }));
  return c.json(out);
});

orgRoutes.post('/orgs/:org/invitations', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot invite people');
  await refuseExample(c.env.DB, 'crm', a.orgId, 'invite');
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email().max(320), role: z.enum(INVITABLE_ROLES).default('member'), message: text(600).optional() }));
  if (input.role === 'admin' && a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can invite administrators');
  if (input.role === 'manager' && !a.perms.members.manage) deny('Only administrators can invite managers');
  await rateLimit(c.env.DB, `crm-invite:user:${a.userId}`, 50, 3_600_000);
  await rateLimit(c.env.DB, `crm-invite:org:${a.orgId}`, 200, 24 * 3_600_000);
  const member = await c.env.DB.prepare('SELECT 1 FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND u.email = ?').bind(a.orgId, input.email).first();
  if (member) throw new HttpError(409, 'That person is already a member');
  // The sign-up protection the invitee would meet (disposable addresses, blocked domains), so the inviter hears it now.
  const hasAccount = await c.env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(input.email).first();
  if (!hasAccount) {
    const { checkAddress, loadPolicy } = await import('../services/signup-guard');
    const check = await checkAddress(c.env, input.email, await loadPolicy(c.env.DB));
    if (!check.ok) throw new HttpError(400, check.message, { code: 'EMAIL_NOT_ALLOWED' });
  }
  const token = randomToken(32);
  const id = newId();
  const t = now();
  const expiresAt = t + CRM_INVITE_TTL_MS;
  await c.env.DB.batch([
    // One open invitation per address: an older one stops working.
    c.env.DB.prepare('UPDATE crm_invitations SET revoked_at = ?, revoked_by = ? WHERE org_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL AND declined_at IS NULL').bind(t, a.userId, a.orgId, input.email),
    c.env.DB.prepare('INSERT INTO crm_invitations (id, org_id, email, role, token_hash, message, invited_by, created_at, expires_at, last_sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, input.email, input.role, await sha256Hex(token), input.message ?? '', a.userId, t, expiresAt, t),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'invitation.sent', targetType: 'invitation', targetId: id, after: { email: input.email, role: input.role }, ip: clientIp(c) }),
  ]);
  const sent = await sendInvite(c, a, { id, email: input.email, role: input.role, expiresAt, message: input.message ?? '', token, sendNumber: 1 });
  // Someone with an account also sees it in the CRM (without the link: they accept from the email or a shared link).
  const dto: CrmInvitationDTO = { id, email: input.email, role: input.role, status: 'pending', invitedBy: a.userName, createdAt: t, expiresAt, message: input.message ?? '', emailDelivery: sent.delivery, inviteUrl: sent.url };
  return c.json(dto, 201);
});

orgRoutes.post('/orgs/:org/invitations/:id/resend', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot invite people');
  const inv = await c.env.DB.prepare('SELECT * FROM crm_invitations WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<InviteRow>();
  if (!inv) throw notFound('Invitation');
  const status = inviteStatus(inv);
  if (status !== 'pending' && status !== 'expired') throw new HttpError(409, `This invitation is ${status}`);
  await rateLimit(c.env.DB, `crm-invite-resend:${inv.id}`, 5, 24 * 3_600_000);
  const token = randomToken(32);
  const t = now();
  const expiresAt = t + CRM_INVITE_TTL_MS;
  const sendNumber = (inv.send_count || 1) + 1;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_invitations SET token_hash = ?, expires_at = ?, last_sent_at = ?, send_count = ? WHERE id = ?').bind(await sha256Hex(token), expiresAt, t, sendNumber, inv.id),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'invitation.resent', targetType: 'invitation', targetId: inv.id }),
  ]);
  const sent = await sendInvite(c, a, { id: inv.id, email: inv.email, role: inv.role, expiresAt, message: inv.message, token, sendNumber });
  return c.json({ id: inv.id, expiresAt, inviteUrl: sent.url, emailDelivery: sent.delivery });
});

orgRoutes.delete('/orgs/:org/invitations/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot manage invitations');
  const r = await c.env.DB.prepare('UPDATE crm_invitations SET revoked_at = ?, revoked_by = ? WHERE id = ? AND org_id = ? AND accepted_at IS NULL AND revoked_at IS NULL AND declined_at IS NULL').bind(now(), a.userId, c.req.param('id'), a.orgId).run();
  if (!r.meta.changes) throw notFound('Invitation');
  await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'invitation.revoked', targetType: 'invitation', targetId: c.req.param('id') }).run();
  return c.json({ ok: true });
});

async function inviteByToken(db: D1Database, token: string) {
  if (!/^[A-Za-z0-9_-]{20,200}$/.test(token)) throw notFound('Invitation');
  const inv = await db
    .prepare('SELECT i.*, o.name AS org_name, o.deleted_at AS org_deleted, u.name AS inviter FROM crm_invitations i JOIN crm_orgs o ON o.id = i.org_id LEFT JOIN users u ON u.id = i.invited_by WHERE i.token_hash = ?')
    .bind(await sha256Hex(token))
    .first<InviteRow & { org_name: string; org_deleted: number | null; inviter: string | null }>();
  if (!inv || inv.org_deleted) throw notFound('Invitation');
  return inv;
}

/** Public preview of an invitation (the link itself is the secret): organisation, inviter, role, status. */
export const publicInviteRoutes = new Hono<AppEnv>();
publicInviteRoutes.get('/invitations/:token', async (c) => {
  await rateLimit(c.env.DB, `crm-invite-view:${clientIp(c)}`, 60, 15 * 60_000);
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  return c.json({ orgName: inv.org_name, inviter: inv.inviter, role: inv.role, roleLabel: CRM_ROLE_LABELS[inv.role], email: inv.email, status: inviteStatus(inv), expiresAt: inv.expires_at, message: inv.message });
});

/**
 * Accept with the token from the email or the shared link. The signed-in account's email must be the invited address,
 * and the token works once.
 */
orgRoutes.post('/invitations/:token/accept', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `crm-invite-accept:${user.id}`, 30, 15 * 60_000);
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  const status = inviteStatus(inv);
  if (status === 'accepted' && inv.accepted_by === user.id) return c.json({ orgId: inv.org_id, already: true });
  if (status !== 'pending') throw new HttpError(410, `This invitation is ${status}`);
  if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new HttpError(403, `This invitation was sent to ${inv.email}. Sign in with that account to accept it.`);
  const t = now();
  const claim = await c.env.DB.prepare('UPDATE crm_invitations SET accepted_at = ?, accepted_by = ? WHERE id = ? AND accepted_at IS NULL AND revoked_at IS NULL AND declined_at IS NULL').bind(t, user.id, inv.id).run();
  if (!claim.meta.changes) throw new HttpError(410, 'This invitation has already been used');
  await c.env.DB.batch([
    // An existing membership is kept as it is (no silent role change).
    c.env.DB.prepare('INSERT OR IGNORE INTO crm_members (org_id, user_id, role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?)').bind(inv.org_id, user.id, inv.role, inv.invited_by, t),
    auditStmt(c.env.DB, { orgId: inv.org_id, actorId: user.id, action: 'member.joined', targetType: 'user', targetId: user.id, after: { role: inv.role }, metadata: { invitationId: inv.id } }),
  ]);
  if (inv.invited_by) {
    await crmNotify(c.env, { orgId: inv.org_id, orgName: inv.org_name, userIds: [inv.invited_by], type: 'invitation', title: `${user.name} joined ${inv.org_name}`, body: `${user.email} accepted your invitation as ${CRM_ROLE_LABELS[inv.role]}.`, link: `/o/${inv.org_id}/team`, actorId: user.id }, (p) => c.executionCtx.waitUntil(p));
  }
  return c.json({ orgId: inv.org_id, already: false });
});

orgRoutes.post('/invitations/:token/decline', async (c) => {
  const user = c.get('user');
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new HttpError(403, `This invitation was sent to ${inv.email}.`);
  return declineInvite(c, inv, user);
});

/** Decline one of my pending invitations from the list (no token needed: declining grants nothing). */
orgRoutes.post('/me/invitations/:id/decline', async (c) => {
  const user = c.get('user');
  const inv = await c.env.DB.prepare('SELECT i.*, o.name AS org_name FROM crm_invitations i JOIN crm_orgs o ON o.id = i.org_id WHERE i.id = ? AND i.email = ?').bind(c.req.param('id'), user.email).first<InviteRow & { org_name: string }>();
  if (!inv) throw notFound('Invitation');
  return declineInvite(c, inv, user);
});

async function declineInvite(c: any, inv: InviteRow & { org_name: string }, user: { id: string; name: string; email: string }) {
  if (inviteStatus(inv) !== 'pending') throw new HttpError(410, `This invitation is ${inviteStatus(inv)}`);
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE crm_invitations SET declined_at = ? WHERE id = ? AND accepted_at IS NULL AND declined_at IS NULL').bind(now(), inv.id),
    auditStmt(c.env.DB, { orgId: inv.org_id, actorId: user.id, action: 'invitation.declined', targetType: 'invitation', targetId: inv.id }),
  ]);
  if (inv.invited_by) {
    // The inviter hears it in the app only.
    await c.env.DB.prepare('INSERT INTO crm_notifications (id, org_id, user_id, type, title, body, link, actor_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), inv.org_id, inv.invited_by, 'invitation', `${inv.email} declined the invitation to ${inv.org_name}`, '', `/o/${inv.org_id}/team`, user.id, now())
      .run();
  }
  return c.json({ ok: true });
}

// ------------------------------------------------------------------ teams

orgRoutes.get('/orgs/:org/teams', async (c) => {
  const a = await requireOrg(c);
  const [teams, members] = await Promise.all([
    c.env.DB.prepare('SELECT * FROM crm_teams WHERE org_id = ? ORDER BY name COLLATE NOCASE').bind(a.orgId).all<{ id: string; name: string; description: string; lead_id: string | null }>(),
    c.env.DB.prepare('SELECT team_id, user_id FROM crm_team_members WHERE org_id = ?').bind(a.orgId).all<{ team_id: string; user_id: string }>(),
  ]);
  const out: CrmTeamDTO[] = teams.results.map((t) => ({ id: t.id, name: t.name, description: t.description, leadId: t.lead_id, memberIds: members.results.filter((m) => m.team_id === t.id).map((m) => m.user_id) }));
  return c.json(out);
});

const teamSchema = z.object({ name: text(80).min(1), description: text(300).optional(), leadId: z.string().max(64).nullable().optional(), memberIds: z.array(z.string().max(64)).max(500).optional() });

async function teamMemberStmts(db: D1Database, orgId: string, teamId: string, memberIds: string[]): Promise<D1PreparedStatement[]> {
  const ids = [...new Set(memberIds)];
  if (ids.length) {
    const found = await db.prepare(`SELECT user_id FROM crm_members WHERE org_id = ? AND user_id IN (${placeholders(ids.length)})`).bind(orgId, ...ids).all<{ user_id: string }>();
    if (found.results.length !== ids.length) throw new HttpError(400, 'Every team member must belong to the organisation');
  }
  return [db.prepare('DELETE FROM crm_team_members WHERE team_id = ? AND org_id = ?').bind(teamId, orgId), ...ids.map((u) => db.prepare('INSERT INTO crm_team_members (org_id, team_id, user_id) VALUES (?, ?, ?)').bind(orgId, teamId, u))];
}

orgRoutes.post('/orgs/:org/teams', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'teams', 'You cannot manage teams');
  const input = await body(c, teamSchema);
  if (input.leadId) await targetMember(c.env.DB, a.orgId, input.leadId);
  const id = newId();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO crm_teams (id, org_id, name, description, lead_id, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, a.orgId, input.name, input.description ?? '', input.leadId ?? null, now()),
    ...(await teamMemberStmts(c.env.DB, a.orgId, id, input.memberIds ?? [])),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'team.created', targetType: 'team', targetId: id, after: { name: input.name } }),
  ]);
  return c.json({ id }, 201);
});

orgRoutes.patch('/orgs/:org/teams/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'teams', 'You cannot manage teams');
  const team = await c.env.DB.prepare('SELECT id FROM crm_teams WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first();
  if (!team) throw notFound('Team');
  const input = await body(c, teamSchema.partial());
  if (input.leadId) await targetMember(c.env.DB, a.orgId, input.leadId);
  const stmts: D1PreparedStatement[] = [];
  if (input.name !== undefined || input.description !== undefined || input.leadId !== undefined) {
    stmts.push(
      c.env.DB.prepare('UPDATE crm_teams SET name = COALESCE(?, name), description = COALESCE(?, description), lead_id = CASE WHEN ? THEN ? ELSE lead_id END WHERE id = ? AND org_id = ?')
        .bind(input.name ?? null, input.description ?? null, input.leadId !== undefined ? 1 : 0, input.leadId ?? null, c.req.param('id'), a.orgId),
    );
  }
  if (input.memberIds) stmts.push(...(await teamMemberStmts(c.env.DB, a.orgId, c.req.param('id'), input.memberIds)));
  if (stmts.length) await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

orgRoutes.delete('/orgs/:org/teams/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'teams', 'You cannot manage teams');
  const r = await c.env.DB.prepare('DELETE FROM crm_teams WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).run();
  if (!r.meta.changes) throw notFound('Team');
  await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'team.deleted', targetType: 'team', targetId: c.req.param('id') }).run();
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ permissions

orgRoutes.get('/orgs/:org/permissions', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT role, module, perms_json FROM crm_role_permissions WHERE org_id = ?').bind(a.orgId).all<{ role: CrmRole; module: string; perms_json: string }>();
  const effective: Record<string, unknown> = {};
  for (const role of ['owner', 'admin', ...CONFIGURABLE_ROLES] as CrmRole[]) {
    const o: Record<string, Record<string, unknown>> = {};
    for (const r of rows.results.filter((x) => x.role === role)) o[r.module] = parseJson(r.perms_json, {});
    effective[role] = resolvePerms(role, o);
  }
  return c.json({ roles: effective, defaults: DEFAULT_PERMS, modules: CRM_MODULES.map((m) => ({ module: m, actions: moduleActions(m) })) });
});

orgRoutes.put('/orgs/:org/permissions/:role', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can change permissions');
  const role = c.req.param('role') as CrmRole;
  if (!(CONFIGURABLE_ROLES as readonly string[]).includes(role)) throw new HttpError(400, 'The owner and administrator roles always have every permission');
  const input = await body(c, z.record(z.string(), z.record(z.string(), z.union([z.boolean(), z.enum(['all', 'own', 'none'])]))));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const [module, perms] of Object.entries(input)) {
    if (!(CRM_MODULES as string[]).includes(module)) throw new HttpError(400, `Unknown module ${module}`);
    const allowed = new Map(moduleActions(module as any).map((x) => [x.action, x.kind]));
    const clean: Record<string, unknown> = {};
    for (const [action, v] of Object.entries(perms)) {
      const kind = allowed.get(action);
      if (!kind || (kind === 'bool') !== (typeof v === 'boolean')) throw new HttpError(400, `Invalid permission ${module}.${action}`);
      clean[action] = v;
    }
    stmts.push(
      c.env.DB.prepare('INSERT INTO crm_role_permissions (org_id, role, module, perms_json, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(org_id, role, module) DO UPDATE SET perms_json = excluded.perms_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at')
        .bind(a.orgId, role, module, JSON.stringify(clean), a.userId, t),
    );
  }
  stmts.push(auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'permissions.changed', targetType: 'role', targetId: role, after: input, ip: clientIp(c) }));
  await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

orgRoutes.delete('/orgs/:org/permissions/:role', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can change permissions');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM crm_role_permissions WHERE org_id = ? AND role = ?').bind(a.orgId, c.req.param('role')),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'permissions.reset', targetType: 'role', targetId: c.req.param('role') }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ audit trail

orgRoutes.get('/orgs/:org/audit', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can read the audit trail');
  const before = Number(c.req.query('before') ?? Date.now() + 1);
  const rows = await c.env.DB.prepare('SELECT l.*, u.name AS actor_name FROM crm_audit_log l LEFT JOIN users u ON u.id = l.actor_id WHERE l.org_id = ? AND l.created_at < ? ORDER BY l.created_at DESC LIMIT 200')
    .bind(a.orgId, Number.isFinite(before) ? before : Date.now() + 1)
    .all<any>();
  return c.json(
    rows.results.map((r) => ({
      id: r.id,
      action: r.action,
      actorId: r.actor_id,
      actorName: r.actor_name,
      targetType: r.target_type,
      targetId: r.target_id,
      before: parseJson(r.before_json, null),
      after: parseJson(r.after_json, null),
      metadata: parseJson(r.metadata_json, {}),
      createdAt: r.created_at,
    })),
  );
});

// ------------------------------------------------------------------ notification preferences (per person)

orgRoutes.get('/me/notification-prefs', async (c) => {
  const rows = await c.env.DB.prepare('SELECT type, in_app, email FROM crm_notification_prefs WHERE user_id = ?').bind(c.get('user').id).all<{ type: string; in_app: number; email: number }>();
  return c.json(
    CRM_NOTIFICATION_KEYS.map((type) => {
      const r = rows.results.find((x) => x.type === type);
      return { type, label: CRM_NOTIFICATION_TYPES[type].label, inApp: r ? !!r.in_app : true, email: r ? !!r.email : CRM_NOTIFICATION_TYPES[type].email };
    }),
  );
});

orgRoutes.put('/me/notification-prefs', async (c) => {
  const user = c.get('user');
  const input = await body(c, z.array(z.object({ type: z.enum(CRM_NOTIFICATION_KEYS as [string, ...string[]]), inApp: z.boolean(), email: z.boolean() })).max(50));
  await c.env.DB.batch(
    input.map((p) =>
      c.env.DB.prepare('INSERT INTO crm_notification_prefs (user_id, type, in_app, email) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, type) DO UPDATE SET in_app = excluded.in_app, email = excluded.email').bind(user.id, p.type, p.inApp ? 1 : 0, p.email ? 1 : 0),
    ),
  );
  return c.json({ ok: true });
});
