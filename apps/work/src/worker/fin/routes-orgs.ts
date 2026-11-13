// BIZOMAT Finance workspaces: creating one (personal, household or business, each with its chart of accounts), its
// settings, members and roles, invitations, permissions, ownership, notifications and the audit trail. Every check is
// made here, on the server, in the same way as the CRM's organisations (src/worker/crm/routes-orgs.ts).

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
import { CONFIGURABLE_ROLES, FIN_MODULES, FIN_ROLE_LABELS, INVITABLE_ROLES, WORKSPACE_KINDS, defaultPerms, isScopedAction, moduleActions, resolvePerms, type FinRole, type WorkspaceKind } from '../../shared/fin/roles';
import { BUSINESS_CHART, PERSONAL_CHART } from '../../shared/fin/charts';
import { DEFAULT_TAX_CODES } from '../../shared/fin/tax';
import { finSettings } from '../../shared/fin/settings';
import { type FinAccess, type FinOrgRow, deny, requireOrg, requirePerm } from './access';
import { FIN_NOTIFICATION_KEYS, FIN_NOTIFICATION_TYPES, auditStmt, finNotify, finUrl } from './util';

export const orgRoutes = new Hono<AppEnv>();

export const FIN_INVITE_TTL_MS = 14 * 86_400_000;

const text = (max: number) => z.string().trim().max(max);

function logoUrl(o: Pick<FinOrgRow, 'id' | 'logo_key'>): string | null {
  return o.logo_key ? `/api/fin/orgs/${o.id}/logo?v=${o.logo_key.slice(-8)}` : null;
}

async function emailConnected(c: { env: AppEnv['Bindings'] }): Promise<boolean> {
  return emailConfig(await emailEnv(c.env)).provider !== 'none';
}

export async function orgDTO(c: { env: AppEnv['Bindings'] }, a: FinAccess) {
  const o = a.org;
  return {
    id: o.id,
    name: o.name,
    kind: o.kind,
    currency: o.currency,
    country: o.country,
    timezone: o.timezone,
    fyStartMonth: o.fy_start_month,
    gstRegistered: !!o.gst_registered,
    gst: a.gst,
    gstBasis: o.gst_basis,
    gstPeriod: o.gst_period,
    basMethod: o.bas_method,
    legalName: o.legal_name,
    abn: o.abn,
    address: o.address,
    email: o.email,
    phone: o.phone,
    lockDate: o.lock_date,
    logoUrl: logoUrl(o),
    settings: a.settings,
    createdAt: o.created_at,
    role: a.role,
    perms: a.perms,
    emailConnected: await emailConnected(c),
  };
}

function validTimezone(tz: string | undefined): string {
  if (!tz) return 'Australia/Sydney';
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    throw new HttpError(400, 'Unknown time zone');
  }
}

const orgFields = {
  name: text(120).min(1, 'Give the workspace a name'),
  currency: z.string().refine(isSupportedCurrency, 'Choose a supported currency').optional(),
  country: text(100).optional(),
  timezone: text(64).optional(),
  fyStartMonth: z.number().int().min(1).max(12).optional(),
  gstRegistered: z.boolean().optional(),
  gstBasis: z.enum(['cash', 'accrual']).optional(),
  gstPeriod: z.enum(['monthly', 'quarterly', 'annual']).optional(),
  basMethod: z.enum(['simpler', 'full']).optional(),
  legalName: text(160).optional(),
  abn: z.string().trim().max(20).regex(/^[0-9 ]*$/, 'An ABN is digits only').optional(),
  address: text(300).optional(),
  email: z.union([z.literal(''), z.string().trim().toLowerCase().email().max(320)]).optional(),
  phone: text(60).optional(),
};

/** Statements that create a workspace with its owner, chart of accounts, tax codes (business) and invoice template. */
export function createOrgStmts(db: D1Database, input: { name: string; kind: WorkspaceKind; currency?: string; country?: string; timezone?: string; fyStartMonth?: number; gstRegistered?: boolean; gstBasis?: string; gstPeriod?: string; basMethod?: string; legalName?: string; abn?: string; address?: string; email?: string; phone?: string }, ownerId: string) {
  const id = newId();
  const t = now();
  const business = input.kind === 'business';
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO fin_orgs (id, name, kind, currency, country, timezone, fy_start_month, gst_registered, gst_basis, gst_period, bas_method, legal_name, abn, address, email, phone, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, input.name, input.kind, input.currency ?? 'AUD', input.country ?? 'Australia', input.timezone ?? 'Australia/Sydney', input.fyStartMonth ?? 7, business && input.gstRegistered ? 1 : 0, input.gstBasis ?? 'accrual', input.gstPeriod ?? 'quarterly', input.basMethod ?? 'simpler', input.legalName ?? '', (input.abn ?? '').replace(/\s+/g, ''), input.address ?? '', input.email ?? '', input.phone ?? '', ownerId, t, t),
    db.prepare("INSERT INTO fin_members (org_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?)").bind(id, ownerId, t),
  ];
  const taxIds = new Map<string, string>();
  if (business) {
    for (const tc of DEFAULT_TAX_CODES) {
      const tid = newId();
      taxIds.set(tc.key, tid);
      stmts.push(db.prepare('INSERT INTO fin_tax_codes (id, org_id, code, name, rate_bp, direction, bas_json, system_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(tid, id, tc.code, tc.name, tc.rateBp, tc.direction, JSON.stringify(tc.bas), tc.key, t));
    }
  }
  const chart = business ? BUSINESS_CHART : PERSONAL_CHART;
  const accIds = new Map(chart.map((c) => [c.code, newId()]));
  chart.forEach((c, i) => {
    stmts.push(
      db
        .prepare('INSERT INTO fin_accounts (id, org_id, code, name, type, subtype, parent_id, tax_code_id, system_key, is_default, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(accIds.get(c.code), id, c.code, c.name, subtypeType(c.subtype), c.subtype, c.parent ? accIds.get(c.parent) : null, c.tax ? (taxIds.get(c.tax) ?? null) : null, c.system ?? null, c.isDefault ? 1 : 0, (i + 1) * 10, t, t),
    );
  });
  if (business) {
    stmts.push(db.prepare("INSERT INTO fin_doc_templates (id, org_id, name, title, is_default, created_at, updated_at) VALUES (?, ?, 'Standard', '', 1, ?, ?)").bind(newId(), id, t, t));
  }
  stmts.push(auditStmt(db, { orgId: id, actorId: ownerId, action: 'org.created', targetType: 'org', targetId: id, after: { name: input.name, kind: input.kind } }));
  return { id, stmts };
}

function subtypeType(subtype: string) {
  const types: Record<string, string> = { bank: 'asset', cash: 'asset', receivable: 'asset', current_asset: 'asset', fixed_asset: 'asset', investment: 'asset', credit_card: 'liability', loan: 'liability', payable: 'liability', tax: 'liability', current_liability: 'liability', non_current_liability: 'liability', equity: 'equity', retained_earnings: 'equity', revenue: 'revenue', other_income: 'revenue', direct_cost: 'expense', expense: 'expense', other_expense: 'expense' };
  return types[subtype];
}

// ------------------------------------------------------------------ workspaces

orgRoutes.get('/orgs', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare(
    `SELECT o.id, o.name, o.kind, o.logo_key, m.role, (SELECT COUNT(*) FROM fin_members x WHERE x.org_id = o.id) AS member_count
     FROM fin_orgs o JOIN fin_members m ON m.org_id = o.id WHERE m.user_id = ? AND o.deleted_at IS NULL ORDER BY o.kind = 'business', o.name COLLATE NOCASE`,
  )
    .bind(user.id)
    .all<{ id: string; name: string; kind: WorkspaceKind; logo_key: string | null; role: FinRole; member_count: number }>();
  const invites = await c.env.DB.prepare(
    `SELECT i.id, i.role, i.expires_at, i.created_at, i.message, o.name AS org_name, o.kind AS org_kind, u.name AS inviter FROM fin_invitations i
     JOIN fin_orgs o ON o.id = i.org_id AND o.deleted_at IS NULL LEFT JOIN users u ON u.id = i.invited_by
     WHERE i.email = ? AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.declined_at IS NULL AND i.expires_at > ?
       AND NOT EXISTS (SELECT 1 FROM fin_members m WHERE m.org_id = i.org_id AND m.user_id = ?)
     ORDER BY i.created_at DESC LIMIT 50`,
  )
    .bind(user.email, now(), user.id)
    .all<{ id: string; role: FinRole; expires_at: number; created_at: number; message: string; org_name: string; org_kind: WorkspaceKind; inviter: string | null }>();
  return c.json({
    orgs: rows.results.map((o) => ({ id: o.id, name: o.name, kind: o.kind, logoUrl: logoUrl(o), role: o.role, memberCount: o.member_count })),
    invitations: invites.results.map((i) => ({ id: i.id, role: i.role, orgName: i.org_name, orgKind: i.org_kind, inviter: i.inviter, message: i.message, createdAt: i.created_at, expiresAt: i.expires_at })),
  });
});

orgRoutes.post('/orgs', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `fin-org-create:${user.id}`, 20, 24 * 3_600_000);
  const input = await body(c, z.object({ ...orgFields, kind: z.enum(WORKSPACE_KINDS as [WorkspaceKind, ...WorkspaceKind[]]) }));
  const { id, stmts } = createOrgStmts(c.env.DB, { ...input, timezone: validTimezone(input.timezone), email: input.email ?? '' }, user.id);
  await c.env.DB.batch(stmts);
  return c.json({ id }, 201);
});

orgRoutes.get('/orgs/:org', async (c) => {
  const a = await requireOrg(c);
  return c.json(await orgDTO(c, a));
});

const settingsPatch = z
  .object({
    prefixes: z.object({ quote: z.string(), invoice: z.string(), credit_note: z.string(), bill: z.string(), purchase_order: z.string(), expense_claim: z.string() }).partial().optional(),
    termsDays: z.number().int().min(0).max(365).optional(),
    approvals: z.object({ transactions: z.boolean(), bills: z.boolean(), expenseClaims: z.boolean(), invoices: z.boolean() }).partial().optional(),
    alerts: z.object({ invoiceDueDays: z.number().int().min(0).max(60), overdueInvoices: z.boolean(), billDueDays: z.number().int().min(0).max(60), overdueBills: z.boolean(), budgets: z.boolean(), monthlySummary: z.boolean() }).partial().optional(),
    duplicateDays: z.number().int().min(0).max(30).optional(),
  })
  .optional();

orgRoutes.patch('/orgs/:org', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'settings', 'manage', 'You cannot change the workspace settings');
  const input = await body(c, z.object({ ...orgFields, name: orgFields.name.optional(), settings: settingsPatch }));
  const o = a.org;
  if (input.currency && input.currency !== o.currency) {
    const used = await c.env.DB.prepare("SELECT 1 FROM fin_journals WHERE org_id = ? AND status = 'posted' LIMIT 1").bind(a.orgId).first();
    if (used) throw new HttpError(409, 'The currency is fixed once anything has been posted');
  }
  if (input.gstRegistered !== undefined && o.kind !== 'business' && input.gstRegistered) throw new HttpError(400, 'GST applies to business workspaces');
  const merged = input.settings
    ? finSettings(
        {
          ...a.settings,
          ...input.settings,
          prefixes: { ...a.settings.prefixes, ...(input.settings.prefixes ?? {}) },
          approvals: { ...a.settings.approvals, ...(input.settings.approvals ?? {}) },
          alerts: { ...a.settings.alerts, ...(input.settings.alerts ?? {}) },
        },
        o.kind,
      )
    : a.settings;
  const next = {
    name: input.name ?? o.name,
    currency: input.currency ?? o.currency,
    country: input.country ?? o.country,
    timezone: input.timezone !== undefined ? validTimezone(input.timezone) : o.timezone,
    fy_start_month: input.fyStartMonth ?? o.fy_start_month,
    gst_registered: input.gstRegistered !== undefined ? (input.gstRegistered ? 1 : 0) : o.gst_registered,
    gst_basis: input.gstBasis ?? o.gst_basis,
    gst_period: input.gstPeriod ?? o.gst_period,
    bas_method: input.basMethod ?? o.bas_method,
    legal_name: input.legalName ?? o.legal_name,
    abn: input.abn !== undefined ? input.abn.replace(/\s+/g, '') : o.abn,
    address: input.address ?? o.address,
    email: input.email ?? o.email,
    phone: input.phone ?? o.phone,
  };
  const stmts: D1PreparedStatement[] = [
    c.env.DB.prepare(
      'UPDATE fin_orgs SET name = ?, currency = ?, country = ?, timezone = ?, fy_start_month = ?, gst_registered = ?, gst_basis = ?, gst_period = ?, bas_method = ?, legal_name = ?, abn = ?, address = ?, email = ?, phone = ?, settings_json = ?, updated_at = ? WHERE id = ?',
    ).bind(next.name, next.currency, next.country, next.timezone, next.fy_start_month, next.gst_registered, next.gst_basis, next.gst_period, next.bas_method, next.legal_name, next.abn, next.address, next.email, next.phone, JSON.stringify(merged), now(), a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'org.updated', targetType: 'org', targetId: a.orgId, after: { ...input }, ip: clientIp(c) }),
  ];
  // A business that registers for GST gets the standard tax codes if it has none.
  if (next.gst_registered && o.kind === 'business') {
    const has = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM fin_tax_codes WHERE org_id = ?').bind(a.orgId).first<{ n: number }>();
    if (!has?.n) {
      const taxIds = new Map<string, string>();
      for (const tc of DEFAULT_TAX_CODES) {
        const tid = newId();
        taxIds.set(tc.key, tid);
        stmts.push(c.env.DB.prepare('INSERT INTO fin_tax_codes (id, org_id, code, name, rate_bp, direction, bas_json, system_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(tid, a.orgId, tc.code, tc.name, tc.rateBp, tc.direction, JSON.stringify(tc.bas), tc.key, now()));
      }
      // The starting chart's accounts get their usual GST code, as they do in a business registered from the start.
      for (const acc of BUSINESS_CHART) {
        if (acc.tax && taxIds.has(acc.tax)) stmts.push(c.env.DB.prepare('UPDATE fin_accounts SET tax_code_id = ? WHERE org_id = ? AND code = ? AND tax_code_id IS NULL').bind(taxIds.get(acc.tax), a.orgId, acc.code));
      }
    }
  }
  await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

orgRoutes.delete('/orgs/:org', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner') deny('Only the owner can delete the workspace');
  const { confirmName } = await body(c, z.object({ confirmName: z.string() }));
  if (confirmName.trim() !== a.org.name) throw new HttpError(400, 'Type the workspace name exactly to confirm');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_orgs SET deleted_at = ?, updated_at = ? WHERE id = ?').bind(now(), now(), a.orgId),
    c.env.DB.prepare('UPDATE fin_invitations SET revoked_at = ?, revoked_by = ? WHERE org_id = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(now(), a.userId, a.orgId),
    c.env.DB.prepare('UPDATE fin_recurring SET active = 0 WHERE org_id = ?').bind(a.orgId),
    c.env.DB.prepare('UPDATE fin_report_schedules SET active = 0 WHERE org_id = ?').bind(a.orgId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'org.deleted', targetType: 'org', targetId: a.orgId, before: { name: a.org.name }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

orgRoutes.post('/orgs/:org/logo', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'settings', 'manage', 'You cannot change the logo');
  await rateLimit(c.env.DB, `fin-upload:${a.userId}`, 60, 60_000);
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const { type, bytes } = await validateUpload(file, { imagesOnly: true });
  if (type !== 'image/png' && type !== 'image/jpeg') throw new HttpError(400, 'Use a PNG or JPEG logo (it appears on invoices)');
  const key = `fin/${a.orgId}/logo-${newId()}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
  await c.env.DB.batch([c.env.DB.prepare('UPDATE fin_orgs SET logo_key = ?, updated_at = ? WHERE id = ?').bind(key, now(), a.orgId), auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'org.logo_changed', targetType: 'org', targetId: a.orgId })]);
  if (a.org.logo_key) c.executionCtx.waitUntil(c.env.FILES.delete(a.org.logo_key));
  return c.json({ url: `/api/fin/orgs/${a.orgId}/logo?v=${key.slice(-8)}` }, 201);
});

orgRoutes.get('/orgs/:org/logo', async (c) => {
  const a = await requireOrg(c);
  if (!a.org.logo_key) throw notFound('Logo');
  const obj = await c.env.FILES.get(a.org.logo_key);
  if (!obj) throw notFound('Logo');
  return new Response(obj.body, { headers: { 'Content-Type': obj.httpMetadata?.contentType ?? 'image/png', 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox" } });
});

// ------------------------------------------------------------------ members

async function memberList(db: D1Database, orgId: string) {
  const rows = await db
    .prepare('SELECT m.user_id, m.role, m.title, m.joined_at, u.name, u.email, u.avatar_key FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? ORDER BY u.name COLLATE NOCASE')
    .bind(orgId)
    .all<{ user_id: string; role: FinRole; title: string; joined_at: number; name: string; email: string; avatar_key: string | null }>();
  return rows.results.map((m) => ({ userId: m.user_id, name: m.name, email: m.email, avatarUrl: avatarUrl(m.user_id, m.avatar_key), role: m.role, title: m.title, joinedAt: m.joined_at }));
}

orgRoutes.get('/orgs/:org/members', async (c) => {
  const a = await requireOrg(c);
  return c.json(await memberList(c.env.DB, a.orgId));
});

async function targetMember(db: D1Database, orgId: string, userId: string) {
  const m = await db.prepare('SELECT m.role, u.name, u.email FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND m.user_id = ?').bind(orgId, userId).first<{ role: FinRole; name: string; email: string }>();
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
  const changing = input.role !== undefined && input.role !== target.role;
  if (changing) {
    if (!a.perms.members.manage) deny('You cannot change roles');
    if (self) deny('You cannot change your own role');
    if (target.role === 'owner') deny('Transfer ownership to change the owner role');
    if ((input.role === 'admin' || target.role === 'admin') && a.role !== 'owner') deny('Only the owner can add or remove administrators');
  }
  const stmts: D1PreparedStatement[] = [];
  if (input.title !== undefined) stmts.push(c.env.DB.prepare('UPDATE fin_members SET title = ? WHERE org_id = ? AND user_id = ?').bind(input.title, a.orgId, targetId));
  if (changing) {
    stmts.push(
      c.env.DB.prepare('UPDATE fin_members SET role = ? WHERE org_id = ? AND user_id = ?').bind(input.role, a.orgId, targetId),
      auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'member.role_changed', targetType: 'user', targetId, before: { role: target.role }, after: { role: input.role }, ip: clientIp(c) }),
    );
  }
  if (stmts.length) await c.env.DB.batch(stmts);
  if (changing) {
    await finNotify(c.env, { orgId: a.orgId, orgName: a.org.name, userIds: [targetId], type: 'membership', title: `Your role in ${a.org.name} is now ${FIN_ROLE_LABELS[input.role!]}`, body: `Changed by ${a.userName}.`, link: `/o/${a.orgId}/dashboard`, actorId: a.userId }, (p) => c.executionCtx.waitUntil(p));
  }
  return c.json({ ok: true });
});

orgRoutes.delete('/orgs/:org/members/:userId', async (c) => {
  const a = await requireOrg(c);
  const targetId = c.req.param('userId');
  if (targetId === a.userId) throw new HttpError(400, 'Use "Leave workspace" to remove yourself');
  if (!a.perms.members.manage) deny('You cannot remove members');
  const target = await targetMember(c.env.DB, a.orgId, targetId);
  if (target.role === 'owner') deny('The owner cannot be removed');
  if (target.role === 'admin' && a.role !== 'owner') deny('Only the owner can remove administrators');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM fin_members WHERE org_id = ? AND user_id = ?').bind(a.orgId, targetId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'member.removed', targetType: 'user', targetId, before: { role: target.role }, ip: clientIp(c) }),
  ]);
  if (await emailConnected(c)) {
    await enqueueEmail(c.env, {
      userId: targetId,
      to: target.email,
      toName: target.name,
      data: { template: 'fin_notification', organisation: a.org.name, title: `You were removed from ${a.org.name}`, body: `${a.userName} removed you from the financial workspace ${a.org.name}. You no longer have access to its records.`, url: null },
      idempotencyKey: `fin-removed:${a.orgId}:${targetId}:${now()}`,
    }).catch(() => null);
  }
  return c.json({ ok: true });
});

orgRoutes.post('/orgs/:org/leave', async (c) => {
  const a = await requireOrg(c);
  if (a.role === 'owner') throw new HttpError(400, 'Transfer ownership to another member before leaving');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM fin_members WHERE org_id = ? AND user_id = ?').bind(a.orgId, a.userId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'member.left', targetType: 'user', targetId: a.userId, before: { role: a.role }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

/** Ownership moves to a member; the previous owner becomes an administrator. */
orgRoutes.post('/orgs/:org/transfer', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner') deny('Only the owner can transfer ownership');
  const { userId } = await body(c, z.object({ userId: z.string().max(64) }));
  if (userId === a.userId) throw new HttpError(400, 'You are already the owner');
  const target = await targetMember(c.env.DB, a.orgId, userId);
  await rateLimit(c.env.DB, `fin-transfer:${a.orgId}`, 10, 24 * 3_600_000);
  await c.env.DB.batch([
    // Demote first: the database allows one owner at a time (fin_members_one_owner).
    c.env.DB.prepare("UPDATE fin_members SET role = 'admin' WHERE org_id = ? AND user_id = ?").bind(a.orgId, a.userId),
    c.env.DB.prepare("UPDATE fin_members SET role = 'owner' WHERE org_id = ? AND user_id = ?").bind(a.orgId, userId),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'org.ownership_transferred', targetType: 'user', targetId: userId, before: { owner: a.userId, newOwnerRole: target.role }, after: { owner: userId }, ip: clientIp(c) }),
  ]);
  await finNotify(c.env, { orgId: a.orgId, orgName: a.org.name, userIds: [userId], type: 'membership', title: `You are now the owner of ${a.org.name}`, body: `${a.userName} transferred ownership to you.`, link: `/o/${a.orgId}/settings/workspace`, actorId: a.userId }, (p) => c.executionCtx.waitUntil(p));
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ invitations

interface InviteRow {
  id: string;
  org_id: string;
  email: string;
  role: FinRole;
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

export function inviteStatus(i: Pick<InviteRow, 'accepted_at' | 'declined_at' | 'revoked_at' | 'expires_at'>, at = now()) {
  return i.revoked_at ? 'revoked' : i.accepted_at ? 'accepted' : i.declined_at ? 'declined' : i.expires_at < at ? 'expired' : 'pending';
}

function inviteLink(c: any, token: string): string {
  try {
    return finUrl(c.env, `/join/${encodeURIComponent(token)}`);
  } catch (e) {
    throw new HttpError(503, `Invitation links cannot be created: ${e instanceof Error ? e.message : 'the app address is not configured'}`);
  }
}

async function sendInvite(c: any, a: FinAccess, inv: { id: string; email: string; role: FinRole; expiresAt: number; message: string; token: string; sendNumber: number }) {
  const url = inviteLink(c, inv.token);
  if (!(await emailConnected(c))) return { url, delivery: 'not_configured' };
  const existing = await c.env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(inv.email).first();
  const r = await enqueueEmail(c.env, {
    to: inv.email,
    data: { template: 'fin_invitation', organisation: a.org.name, inviter: a.userName, role: FIN_ROLE_LABELS[inv.role], expires: new Date(inv.expiresAt).toUTCString().replace(/:\d\d GMT$/, ' UTC'), url, message: inv.message || null, existingUser: !!existing },
    idempotencyKey: `fin-invite:${inv.id}:${inv.sendNumber}`,
    sensitive: true,
  });
  c.executionCtx.waitUntil(processOutbox(c.env, { max: 5 }).catch(() => null));
  return { url, delivery: r.queued ? 'queued' : r.reason };
}

orgRoutes.get('/orgs/:org/invitations', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot see invitations');
  const rows = await c.env.DB.prepare('SELECT i.*, u.name AS inviter FROM fin_invitations i LEFT JOIN users u ON u.id = i.invited_by WHERE i.org_id = ? ORDER BY i.created_at DESC LIMIT 200').bind(a.orgId).all<InviteRow & { inviter: string | null }>();
  return c.json(rows.results.map((i) => ({ id: i.id, email: i.email, role: i.role, status: inviteStatus(i), invitedBy: i.inviter, createdAt: i.created_at, expiresAt: i.expires_at, message: i.message })));
});

orgRoutes.post('/orgs/:org/invitations', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot invite people');
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email().max(320), role: z.enum(INVITABLE_ROLES).default('contributor'), message: text(600).optional() }));
  if (input.role === 'admin' && a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can invite administrators');
  await rateLimit(c.env.DB, `fin-invite:user:${a.userId}`, 50, 3_600_000);
  await rateLimit(c.env.DB, `fin-invite:org:${a.orgId}`, 200, 24 * 3_600_000);
  const member = await c.env.DB.prepare('SELECT 1 FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND u.email = ?').bind(a.orgId, input.email).first();
  if (member) throw new HttpError(409, 'That person is already a member');
  const hasAccount = await c.env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(input.email).first();
  if (!hasAccount) {
    const { checkAddress, loadPolicy } = await import('../services/signup-guard');
    const check = await checkAddress(c.env, input.email, await loadPolicy(c.env.DB));
    if (!check.ok) throw new HttpError(400, check.message, { code: 'EMAIL_NOT_ALLOWED' });
  }
  const token = randomToken(32);
  const id = newId();
  const t = now();
  const expiresAt = t + FIN_INVITE_TTL_MS;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_invitations SET revoked_at = ?, revoked_by = ? WHERE org_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL AND declined_at IS NULL').bind(t, a.userId, a.orgId, input.email),
    c.env.DB.prepare('INSERT INTO fin_invitations (id, org_id, email, role, token_hash, message, invited_by, created_at, expires_at, last_sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.orgId, input.email, input.role, await sha256Hex(token), input.message ?? '', a.userId, t, expiresAt, t),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'invitation.sent', targetType: 'invitation', targetId: id, after: { email: input.email, role: input.role }, ip: clientIp(c) }),
  ]);
  const sent = await sendInvite(c, a, { id, email: input.email, role: input.role, expiresAt, message: input.message ?? '', token, sendNumber: 1 });
  return c.json({ id, email: input.email, role: input.role, status: 'pending', invitedBy: a.userName, createdAt: t, expiresAt, message: input.message ?? '', emailDelivery: sent.delivery, inviteUrl: sent.url }, 201);
});

orgRoutes.post('/orgs/:org/invitations/:id/resend', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot invite people');
  const inv = await c.env.DB.prepare('SELECT * FROM fin_invitations WHERE id = ? AND org_id = ?').bind(c.req.param('id'), a.orgId).first<InviteRow>();
  if (!inv) throw notFound('Invitation');
  const status = inviteStatus(inv);
  if (status !== 'pending' && status !== 'expired') throw new HttpError(409, `This invitation is ${status}`);
  await rateLimit(c.env.DB, `fin-invite-resend:${inv.id}`, 5, 24 * 3_600_000);
  const token = randomToken(32);
  const t = now();
  const expiresAt = t + FIN_INVITE_TTL_MS;
  const sendNumber = (inv.send_count || 1) + 1;
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_invitations SET token_hash = ?, expires_at = ?, last_sent_at = ?, send_count = ? WHERE id = ?').bind(await sha256Hex(token), expiresAt, t, sendNumber, inv.id),
    auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'invitation.resent', targetType: 'invitation', targetId: inv.id }),
  ]);
  const sent = await sendInvite(c, a, { id: inv.id, email: inv.email, role: inv.role, expiresAt, message: inv.message, token, sendNumber });
  return c.json({ id: inv.id, expiresAt, inviteUrl: sent.url, emailDelivery: sent.delivery });
});

orgRoutes.delete('/orgs/:org/invitations/:id', async (c) => {
  const a = await requireOrg(c);
  requirePerm(a, 'members', 'invite', 'You cannot manage invitations');
  const r = await c.env.DB.prepare('UPDATE fin_invitations SET revoked_at = ?, revoked_by = ? WHERE id = ? AND org_id = ? AND accepted_at IS NULL AND revoked_at IS NULL AND declined_at IS NULL').bind(now(), a.userId, c.req.param('id'), a.orgId).run();
  if (!r.meta.changes) throw notFound('Invitation');
  await auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'invitation.revoked', targetType: 'invitation', targetId: c.req.param('id') }).run();
  return c.json({ ok: true });
});

async function inviteByToken(db: D1Database, token: string) {
  if (!/^[A-Za-z0-9_-]{20,200}$/.test(token)) throw notFound('Invitation');
  const inv = await db
    .prepare('SELECT i.*, o.name AS org_name, o.kind AS org_kind, o.deleted_at AS org_deleted, u.name AS inviter FROM fin_invitations i JOIN fin_orgs o ON o.id = i.org_id LEFT JOIN users u ON u.id = i.invited_by WHERE i.token_hash = ?')
    .bind(await sha256Hex(token))
    .first<InviteRow & { org_name: string; org_kind: WorkspaceKind; org_deleted: number | null; inviter: string | null }>();
  if (!inv || inv.org_deleted) throw notFound('Invitation');
  return inv;
}

/** Public preview of an invitation (the link itself is the secret). */
export const publicInviteRoutes = new Hono<AppEnv>();
publicInviteRoutes.get('/invitations/:token', async (c) => {
  await rateLimit(c.env.DB, `fin-invite-view:${clientIp(c)}`, 60, 15 * 60_000);
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  return c.json({ orgName: inv.org_name, orgKind: inv.org_kind, inviter: inv.inviter, role: inv.role, roleLabel: FIN_ROLE_LABELS[inv.role], email: inv.email, status: inviteStatus(inv), expiresAt: inv.expires_at, message: inv.message });
});

/** Accept with the token: the signed-in account's email must be the invited address, and the token works once. */
orgRoutes.post('/invitations/:token/accept', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `fin-invite-accept:${user.id}`, 30, 15 * 60_000);
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  const status = inviteStatus(inv);
  if (status === 'accepted' && inv.accepted_by === user.id) return c.json({ orgId: inv.org_id, already: true });
  if (status !== 'pending') throw new HttpError(410, `This invitation is ${status}`);
  if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new HttpError(403, `This invitation was sent to ${inv.email}. Sign in with that account to accept it.`);
  const t = now();
  const claim = await c.env.DB.prepare('UPDATE fin_invitations SET accepted_at = ?, accepted_by = ? WHERE id = ? AND accepted_at IS NULL AND revoked_at IS NULL AND declined_at IS NULL').bind(t, user.id, inv.id).run();
  if (!claim.meta.changes) throw new HttpError(410, 'This invitation has already been used');
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT OR IGNORE INTO fin_members (org_id, user_id, role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?)').bind(inv.org_id, user.id, inv.role, inv.invited_by, t),
    auditStmt(c.env.DB, { orgId: inv.org_id, actorId: user.id, action: 'member.joined', targetType: 'user', targetId: user.id, after: { role: inv.role }, metadata: { invitationId: inv.id } }),
  ]);
  if (inv.invited_by) {
    await finNotify(c.env, { orgId: inv.org_id, orgName: inv.org_name, userIds: [inv.invited_by], type: 'membership', title: `${user.name} joined ${inv.org_name}`, body: `${user.email} accepted your invitation as ${FIN_ROLE_LABELS[inv.role]}.`, link: `/o/${inv.org_id}/team`, actorId: user.id }, (p) => c.executionCtx.waitUntil(p));
  }
  return c.json({ orgId: inv.org_id, already: false });
});

orgRoutes.post('/invitations/:token/decline', async (c) => {
  const user = c.get('user');
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new HttpError(403, `This invitation was sent to ${inv.email}.`);
  return declineInvite(c, inv, user);
});

orgRoutes.post('/me/invitations/:id/decline', async (c) => {
  const user = c.get('user');
  const inv = await c.env.DB.prepare('SELECT i.*, o.name AS org_name FROM fin_invitations i JOIN fin_orgs o ON o.id = i.org_id WHERE i.id = ? AND i.email = ?').bind(c.req.param('id'), user.email).first<InviteRow & { org_name: string }>();
  if (!inv) throw notFound('Invitation');
  return declineInvite(c, inv, user);
});

async function declineInvite(c: any, inv: InviteRow & { org_name: string }, user: { id: string; email: string }) {
  if (inviteStatus(inv) !== 'pending') throw new HttpError(410, `This invitation is ${inviteStatus(inv)}`);
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE fin_invitations SET declined_at = ? WHERE id = ? AND accepted_at IS NULL AND declined_at IS NULL').bind(now(), inv.id),
    auditStmt(c.env.DB, { orgId: inv.org_id, actorId: user.id, action: 'invitation.declined', targetType: 'invitation', targetId: inv.id }),
  ]);
  if (inv.invited_by) {
    await c.env.DB.prepare('INSERT INTO fin_notifications (id, org_id, user_id, type, title, body, link, actor_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), inv.org_id, inv.invited_by, 'membership', `${inv.email} declined the invitation to ${inv.org_name}`, '', `/o/${inv.org_id}/team`, user.id, now())
      .run();
  }
  return c.json({ ok: true });
}

// ------------------------------------------------------------------ permissions

orgRoutes.get('/orgs/:org/permissions', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT role, module, perms_json FROM fin_role_permissions WHERE org_id = ?').bind(a.orgId).all<{ role: FinRole; module: string; perms_json: string }>();
  const roles: Record<string, unknown> = {};
  const defaults: Record<string, unknown> = {};
  for (const role of ['owner', 'admin', ...CONFIGURABLE_ROLES] as FinRole[]) {
    const o: Record<string, Record<string, unknown>> = {};
    for (const r of rows.results.filter((x) => x.role === role)) o[r.module] = parseJson(r.perms_json, {});
    roles[role] = resolvePerms(role, o, a.org.kind);
    defaults[role] = defaultPerms(role, a.org.kind);
  }
  return c.json({ roles, defaults, modules: FIN_MODULES.map((m) => ({ module: m, actions: moduleActions(m) })) });
});

orgRoutes.put('/orgs/:org/permissions/:role', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner' && a.role !== 'admin') deny('Only the owner and administrators can change permissions');
  const role = c.req.param('role') as FinRole;
  if (!(CONFIGURABLE_ROLES as readonly string[]).includes(role)) throw new HttpError(400, 'The owner and administrator roles always have every permission');
  const input = await body(c, z.record(z.string(), z.record(z.string(), z.union([z.boolean(), z.enum(['all', 'own', 'none'])]))));
  const t = now();
  const stmts: D1PreparedStatement[] = [c.env.DB.prepare('DELETE FROM fin_role_permissions WHERE org_id = ? AND role = ?').bind(a.orgId, role)];
  for (const [module, actions] of Object.entries(input)) {
    if (!(FIN_MODULES as string[]).includes(module)) throw new HttpError(400, `Unknown module ${module}`);
    const allowed = moduleActions(module as any);
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(actions)) {
      if (!allowed.includes(k)) throw new HttpError(400, `Unknown action ${k}`);
      if (isScopedAction(k, module) && typeof v === 'boolean') throw new HttpError(400, `${k} takes all, own or none`);
      if (!isScopedAction(k, module) && typeof v !== 'boolean') throw new HttpError(400, `${k} is on or off`);
      clean[k] = v;
    }
    stmts.push(c.env.DB.prepare('INSERT INTO fin_role_permissions (org_id, role, module, perms_json, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?)').bind(a.orgId, role, module, JSON.stringify(clean), a.userId, t));
  }
  stmts.push(auditStmt(c.env.DB, { orgId: a.orgId, actorId: a.userId, action: 'permissions.changed', targetType: 'role', targetId: role, after: input, ip: clientIp(c) }));
  await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ notifications

orgRoutes.get('/orgs/:org/notifications', async (c) => {
  const a = await requireOrg(c);
  const rows = await c.env.DB.prepare('SELECT id, type, title, body, link, created_at, read_at FROM fin_notifications WHERE org_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 100').bind(a.orgId, a.userId).all<any>();
  const unread = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM fin_notifications WHERE org_id = ? AND user_id = ? AND read_at IS NULL').bind(a.orgId, a.userId).first<{ n: number }>();
  return c.json({ unread: unread?.n ?? 0, items: rows.results.map((n) => ({ id: n.id, type: n.type, title: n.title, body: n.body, link: n.link, createdAt: n.created_at, readAt: n.read_at })) });
});

orgRoutes.post('/orgs/:org/notifications/read', async (c) => {
  const a = await requireOrg(c);
  const { ids } = await body(c, z.object({ ids: z.array(z.string().max(64)).max(200).optional() }));
  if (ids?.length) await c.env.DB.prepare(`UPDATE fin_notifications SET read_at = ? WHERE org_id = ? AND user_id = ? AND id IN (${placeholders(ids.length)})`).bind(now(), a.orgId, a.userId, ...ids).run();
  else await c.env.DB.prepare('UPDATE fin_notifications SET read_at = ? WHERE org_id = ? AND user_id = ? AND read_at IS NULL').bind(now(), a.orgId, a.userId).run();
  return c.json({ ok: true });
});

/** Unread counts in each of my workspaces (the workspace menu shows them). */
orgRoutes.get('/me/unread', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare('SELECT n.org_id, COUNT(*) AS n FROM fin_notifications n JOIN fin_members m ON m.org_id = n.org_id AND m.user_id = n.user_id WHERE n.user_id = ? AND n.read_at IS NULL GROUP BY n.org_id').bind(user.id).all<{ org_id: string; n: number }>();
  return c.json(Object.fromEntries(rows.results.map((r) => [r.org_id, r.n])));
});

orgRoutes.get('/me/notification-prefs', async (c) => {
  const user = c.get('user');
  const rows = await c.env.DB.prepare('SELECT type, in_app, email FROM fin_notification_prefs WHERE user_id = ?').bind(user.id).all<{ type: string; in_app: number; email: number }>();
  const stored = new Map(rows.results.map((r) => [r.type, r]));
  return c.json(FIN_NOTIFICATION_KEYS.map((k) => ({ type: k, label: FIN_NOTIFICATION_TYPES[k].label, inApp: stored.has(k) ? !!stored.get(k)!.in_app : true, email: stored.has(k) ? !!stored.get(k)!.email : FIN_NOTIFICATION_TYPES[k].email })));
});

orgRoutes.put('/me/notification-prefs', async (c) => {
  const user = c.get('user');
  const input = await body(c, z.array(z.object({ type: z.enum(FIN_NOTIFICATION_KEYS as [string, ...string[]]), inApp: z.boolean(), email: z.boolean() })).max(30));
  await c.env.DB.batch(input.map((p) => c.env.DB.prepare('INSERT INTO fin_notification_prefs (user_id, type, in_app, email) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, type) DO UPDATE SET in_app = excluded.in_app, email = excluded.email').bind(user.id, p.type, p.inApp ? 1 : 0, p.email ? 1 : 0)));
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ audit trail

orgRoutes.get('/orgs/:org/audit', async (c) => {
  const a = await requireOrg(c);
  if (a.role !== 'owner' && a.role !== 'admin' && !a.perms.accounting.manage) deny('Only owners, administrators and accountants see the audit trail');
  const target = c.req.query('target');
  const targetType = c.req.query('type');
  const before = Number(c.req.query('before') ?? 0) || null;
  const where = ['l.org_id = ?'];
  const args: unknown[] = [a.orgId];
  if (target) {
    where.push('l.target_id = ?');
    args.push(target);
  }
  if (targetType) {
    where.push('l.target_type = ?');
    args.push(targetType);
  }
  if (before) {
    where.push('l.created_at < ?');
    args.push(before);
  }
  const rows = await c.env.DB.prepare(`SELECT l.*, u.name AS actor_name FROM fin_audit_log l LEFT JOIN users u ON u.id = l.actor_id WHERE ${where.join(' AND ')} ORDER BY l.created_at DESC LIMIT 100`).bind(...args).all<any>();
  return c.json(rows.results.map((r) => ({ id: r.id, action: r.action, actorId: r.actor_id, actorName: r.actor_name, targetType: r.target_type, targetId: r.target_id, before: parseJson(r.before_json, null), after: parseJson(r.after_json, null), metadata: parseJson(r.metadata_json, {}), createdAt: r.created_at })));
});
