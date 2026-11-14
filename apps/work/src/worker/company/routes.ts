// BIZOMAT company accounts: /api/company (owner's request, 13 Nov 2026). People work as a company; the company runs
// one Project Management workspace, one CRM organisation and one Finance business workspace, gives each person a
// role in each, and has departments that appear in every tool. See src/worker/company/access.ts (roles),
// verify.ts (registration checks), sync.ts (keeping the tools in step) and summary.ts (the control centre's numbers).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, placeholders, randomToken, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { audit } from '../services/audit';
import { checkAddress, loadPolicy } from '../services/signup-guard';
import { enqueueEmail, processOutbox } from '../services/email/outbox';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';
import { appBase } from '../services/app-url';
import { createWorkspaceStmts } from '../routes/helpers';
import { createOrgStmts as createCrmOrgStmts } from '../crm/routes-orgs';
import { createOrgStmts as createFinOrgStmts } from '../fin/routes-orgs';
import {
  COMPANY_ROLE_LABELS,
  CRM_ROLES,
  FIN_ROLES,
  TASKS_ROLES,
  TOOL_APPS,
  TOOL_LABELS,
  atLeast,
  coAuditStmt,
  companyTools,
  requireCompany,
  type CompanyAccess,
  type CompanyRole,
  type CompanyRow,
  type MemberRow,
  type ToolApp,
} from './access';
import { STATES, abnValid, abrConfigured, abrLookup, acnValid, checkPostcode, checkStreet, checkSuburb, displayPhone, formatAbn, namesMatch, normaliseAbn, normaliseAcn, parsePhone, type AbrResult } from './verify';
import { memberToolStmts, rolesOf, syncAllDepartments, syncDepartmentsOf, type ToolRoles } from './sync';
import { departmentRoutes } from './departments';
import { overviewRoutes } from './overview';
import { idAuthorizeRoutes } from './id-provider';
import { companyProjects, linkRoutes } from './links';
import { refuseExample } from '../system/example';

export const COMPANY_MOUNT = '/company';

/** An absolute address in the company area, for emails (from configuration, never from the request). */
export function companyUrl(env: Env, path: string): string {
  return `${appBase(env).origin}${COMPANY_MOUNT}${path.startsWith('/') ? path : `/${path}`}`;
}

async function emailConnected(env: Env): Promise<boolean> {
  return emailConfig(await emailEnv(env)).provider !== 'none';
}

const STATE_TIMEZONES: Record<string, string> = {
  ACT: 'Australia/Sydney',
  NSW: 'Australia/Sydney',
  VIC: 'Australia/Melbourne',
  TAS: 'Australia/Hobart',
  QLD: 'Australia/Brisbane',
  SA: 'Australia/Adelaide',
  NT: 'Australia/Darwin',
  WA: 'Australia/Perth',
};

// ------------------------------------------------------------------ registration details and their checks

export const detailsSchema = z.object({
  kind: z.enum(['business', 'individual']),
  name: z.string().trim().min(2).max(120),
  legalName: z.string().trim().max(200).optional().default(''),
  abn: z.string().trim().max(20).optional().default(''),
  acn: z.string().trim().max(20).optional().default(''),
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z.string().trim().min(1).max(30),
  addressLine1: z.string().trim().min(1).max(120),
  addressLine2: z.string().trim().max(120).optional().default(''),
  suburb: z.string().trim().min(1).max(60),
  state: z.enum(STATES),
  postcode: z.string().trim().max(10),
  website: z.string().trim().max(200).optional().default(''),
});
export type Details = z.infer<typeof detailsSchema>;

export interface Checked {
  problems: { field: string; message: string }[];
  warnings: string[];
  abn: string | null;
  acn: string | null;
  abnStatus: CompanyRow['abn_status'];
  abr: Extract<AbrResult, { status: 'active' | 'cancelled' }> | null;
  abrUnavailable: boolean;
  phone: string;
  phoneKind: string;
  legalName: string;
}

/** Every check on a company's details. Problems stop registration; warnings are shown and stored with the company. */
export async function checkDetails(env: Env, d: Details, opts: { exceptCompanyId?: string; lookup?: boolean } = {}): Promise<Checked> {
  const problems: Checked['problems'] = [];
  const warnings: string[] = [];
  const out: Checked = { problems, warnings, abn: null, acn: null, abnStatus: 'none', abr: null, abrUnavailable: false, phone: '', phoneKind: '', legalName: d.legalName };

  if (d.kind === 'business' && !d.abn) problems.push({ field: 'abn', message: 'A business registers with its ABN (Australian Business Number).' });
  if (d.abn) {
    const abn = normaliseAbn(d.abn);
    if (!abn) problems.push({ field: 'abn', message: 'An ABN has 11 digits.' });
    else if (!abnValid(abn)) problems.push({ field: 'abn', message: 'That is not a valid ABN: its check digits do not add up. Check it against your ABN registration.' });
    else {
      out.abn = abn;
      out.abnStatus = 'format_ok';
      const taken = await env.DB.prepare('SELECT id FROM co_companies WHERE abn = ? AND deleted_at IS NULL AND id != ?').bind(abn, opts.exceptCompanyId ?? '').first();
      if (taken) problems.push({ field: 'abn', message: 'A BIZOMAT company account already uses this ABN. Ask its owner to invite you, or contact BIZOMAT support if it is yours.' });
      if (opts.lookup !== false) {
        const r = await abrLookup(env, abn);
        if (r.status === 'active') {
          out.abnStatus = 'active';
          out.abr = r;
        } else if (r.status === 'cancelled') {
          out.abnStatus = 'cancelled';
          out.abr = r;
          problems.push({ field: 'abn', message: 'This ABN is cancelled on the Australian Business Register.' });
        } else if (r.status === 'not_found') {
          out.abnStatus = 'not_found';
          problems.push({ field: 'abn', message: 'This ABN is not on the Australian Business Register.' });
        } else if (r.status === 'unavailable') {
          out.abrUnavailable = true;
          warnings.push(
            r.reason === 'not_configured'
              ? 'The ABN’s check digits are valid. It has not been looked up on the Australian Business Register yet (the register lookup is not set up on this service).'
              : 'The ABN’s check digits are valid. The Australian Business Register could not be reached, so it will be looked up again later.',
          );
        }
      }
    }
  }
  if (d.acn) {
    const acn = normaliseAcn(d.acn);
    if (!acn || !acnValid(acn)) problems.push({ field: 'acn', message: 'That is not a valid ACN (9 digits with a valid check digit).' });
    else {
      out.acn = acn;
      if (out.abr?.acn && out.abr.acn !== acn) problems.push({ field: 'acn', message: 'This ACN is not the one the Australian Business Register lists for the ABN.' });
    }
  } else if (out.abr?.acn) out.acn = out.abr.acn;

  const policy = await loadPolicy(env.DB);
  const mail = await checkAddress(env, d.email, policy);
  if (!mail.ok) problems.push({ field: 'email', message: mail.message });

  const phone = parsePhone(d.phone);
  if (!phone.ok) problems.push({ field: 'phone', message: phone.message });
  else {
    out.phone = phone.value;
    out.phoneKind = phone.kind;
  }

  for (const check of [checkStreet(d.addressLine1, d.addressLine2), checkSuburb(d.suburb), checkPostcode(d.postcode, d.state)]) {
    if (!check.ok) problems.push({ field: check.field, message: check.message });
  }
  if (d.website && !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(d.website)) problems.push({ field: 'website', message: 'Enter the website as an address starting with https://' });

  if (out.abr && out.abnStatus === 'active') {
    out.legalName = out.abr.entityName || d.legalName;
    const named = [out.abr.entityName, ...out.abr.businessNames].filter(Boolean);
    if (named.length && !named.some((n) => namesMatch(d.name, n) || (d.legalName && namesMatch(d.legalName, n)))) {
      warnings.push(`The name differs from the Australian Business Register, which lists this ABN for ${out.abr.entityName}.`);
    }
    if (out.abr.state && out.abr.state !== d.state) warnings.push(`The Australian Business Register lists the main business location in ${out.abr.state} ${out.abr.postcode}, not ${d.state}.`);
    else if (out.abr.postcode && out.abr.postcode !== d.postcode) warnings.push(`The Australian Business Register lists the main business location at postcode ${out.abr.postcode}.`);
  }
  if (!out.legalName && d.kind === 'individual') out.legalName = d.name;
  return out;
}

// ------------------------------------------------------------------ what the client sees

export interface CompanyDTO {
  id: string;
  name: string;
  kind: 'business' | 'individual';
  legalName: string;
  country: string;
  abn: string | null;
  acn: string | null;
  abnStatus: CompanyRow['abn_status'];
  register: { entityName: string; entityType: string; gstFrom: string | null; state: string; postcode: string; checkedAt: number | null } | null;
  registerLookup: boolean;
  email: string;
  emailConfirmed: boolean;
  phone: string;
  phoneKind: string;
  address: { line1: string; line2: string; suburb: string; state: string; postcode: string };
  website: string;
  createdAt: number;
  warnings: string[];
}

export function companyDTO(env: Env, co: CompanyRow): CompanyDTO {
  const settings = JSON.parse(co.settings_json || '{}') as { warnings?: string[] };
  return {
    id: co.id,
    name: co.name,
    kind: co.kind,
    legalName: co.legal_name,
    country: co.country,
    abn: co.abn ? formatAbn(co.abn) : null,
    acn: co.acn,
    abnStatus: co.abn_status,
    register: co.abr_checked_at ? { entityName: co.abr_entity_name, entityType: co.abr_entity_type, gstFrom: co.abr_gst_from, state: co.abr_state, postcode: co.abr_postcode, checkedAt: co.abr_checked_at } : null,
    registerLookup: abrConfigured(env),
    email: co.email,
    emailConfirmed: !!co.email_verified_at,
    phone: displayPhone(co.phone),
    phoneKind: co.phone_kind,
    address: { line1: co.address_line1, line2: co.address_line2, suburb: co.suburb, state: co.state, postcode: co.postcode },
    website: co.website,
    createdAt: co.created_at,
    warnings: Array.isArray(settings.warnings) ? settings.warnings : [],
  };
}

/** The tools of a company with their names and the caller's role in each (null: no access). */
async function toolsView(db: D1Database, a: Pick<CompanyAccess, 'tools' | 'userId'>) {
  const out: Record<ToolApp, { id: string; name: string; myRole: string | null } | null> = { tasks: null, crm: null, finance: null };
  if (a.tools.tasks) {
    const r = await db.prepare('SELECT w.name, m.role FROM workspaces w LEFT JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = ? WHERE w.id = ?').bind(a.userId, a.tools.tasks).first<{ name: string; role: string | null }>();
    out.tasks = { id: a.tools.tasks, name: r?.name ?? '', myRole: r?.role ?? null };
  }
  if (a.tools.crm) {
    const r = await db.prepare('SELECT o.name, m.role FROM crm_orgs o LEFT JOIN crm_members m ON m.org_id = o.id AND m.user_id = ? WHERE o.id = ?').bind(a.userId, a.tools.crm).first<{ name: string; role: string | null }>();
    out.crm = { id: a.tools.crm, name: r?.name ?? '', myRole: r?.role ?? null };
  }
  if (a.tools.finance) {
    const r = await db.prepare('SELECT o.name, m.role FROM fin_orgs o LEFT JOIN fin_members m ON m.org_id = o.id AND m.user_id = ? WHERE o.id = ?').bind(a.userId, a.tools.finance).first<{ name: string; role: string | null }>();
    out.finance = { id: a.tools.finance, name: r?.name ?? '', myRole: r?.role ?? null };
  }
  return out;
}

// ------------------------------------------------------------------ routes

export const companyRoutes = new Hono<AppEnv>();
/** No session: confirmation links and invitation previews (the token in the address is the secret). */
export const companyPublicRoutes = new Hono<AppEnv>();

/** The caller's companies, their pending invitations, and the tools they own that a company could take on. */
companyRoutes.get('/mine', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const companies = await db
    .prepare(
      `SELECT co.id, co.name, co.kind, co.abn_status, co.email_verified_at, co.suspended_at, m.role,
              (SELECT COUNT(*) FROM co_members x WHERE x.company_id = co.id) AS member_count
       FROM co_companies co JOIN co_members m ON m.company_id = co.id AND m.user_id = ?
       WHERE co.deleted_at IS NULL ORDER BY co.name COLLATE NOCASE`,
    )
    .bind(user.id)
    .all<{ id: string; name: string; kind: string; abn_status: string; email_verified_at: number | null; suspended_at: number | null; role: CompanyRole; member_count: number }>();
  const invitations = await db
    .prepare(
      `SELECT i.id, i.role, i.expires_at, co.name AS company, u.name AS inviter FROM co_invitations i
       JOIN co_companies co ON co.id = i.company_id AND co.deleted_at IS NULL LEFT JOIN users u ON u.id = i.invited_by
       WHERE i.email = ? AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > ?
         AND NOT EXISTS (SELECT 1 FROM co_members m WHERE m.company_id = i.company_id AND m.user_id = ?)
       ORDER BY i.created_at DESC LIMIT 20`,
    )
    .bind(user.email, now(), user.id)
    .all<{ id: string; role: string; expires_at: number; company: string; inviter: string | null }>();
  // Tools this person owns and no company runs yet (Finance: business workspaces only; personal and household
  // workspaces stay private and are never offered).
  const [tasks, crm, fin] = await db.batch([
    db.prepare(`SELECT w.id, w.name FROM workspaces w JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = ? AND m.role = 'owner' WHERE w.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'tasks' AND t.ref_id = w.id) ORDER BY w.name`).bind(user.id),
    db.prepare(`SELECT o.id, o.name FROM crm_orgs o JOIN crm_members m ON m.org_id = o.id AND m.user_id = ? AND m.role = 'owner' WHERE o.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'crm' AND t.ref_id = o.id) ORDER BY o.name`).bind(user.id),
    db.prepare(`SELECT o.id, o.name FROM fin_orgs o JOIN fin_members m ON m.org_id = o.id AND m.user_id = ? AND m.role = 'owner' WHERE o.deleted_at IS NULL AND o.kind = 'business' AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'finance' AND t.ref_id = o.id) ORDER BY o.name`).bind(user.id),
  ]);
  return c.json({
    companies: companies.results.map((r) => ({ id: r.id, name: r.name, kind: r.kind, abnStatus: r.abn_status, emailConfirmed: !!r.email_verified_at, suspended: !!r.suspended_at, role: r.role, memberCount: r.member_count })),
    invitations: invitations.results.map((i) => ({ id: i.id, role: i.role, company: i.company, inviter: i.inviter, expiresAt: i.expires_at })),
    ownedTools: { tasks: tasks.results, crm: crm.results, finance: fin.results },
    registerLookup: abrConfigured(c.env),
  });
});

/** Checks registration details without saving anything (the form calls it as people type). */
companyRoutes.post('/check', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `co-check:${user.id}`, 60, 10 * 60_000);
  const raw = await c.req.json().catch(() => null);
  const parsed = detailsSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json({ problems: parsed.error.issues.map((i) => ({ field: String(i.path[0] ?? ''), message: i.message })), warnings: [], abnStatus: 'none', register: null });
  }
  const r = await checkDetails(c.env, parsed.data, { exceptCompanyId: c.req.query('except') ?? undefined });
  return c.json({
    problems: r.problems,
    warnings: r.warnings,
    abnStatus: r.abnStatus,
    register: r.abr ? { entityName: r.abr.entityName, entityType: r.abr.entityType, gstFrom: r.abr.gstFrom, state: r.abr.state, postcode: r.abr.postcode } : null,
    phone: r.phone ? displayPhone(r.phone) : null,
  });
});

const toolChoice = z.union([z.object({ create: z.literal(true) }), z.object({ link: z.string().min(1).max(64) }), z.null()]);

const createSchema = detailsSchema.extend({
  tools: z.object({ tasks: toolChoice.optional().default({ create: true }), crm: toolChoice.optional().default({ create: true }), finance: toolChoice.optional().default({ create: true }) }).optional(),
});

/** Whether the caller owns this tool, and no company runs it yet. Throws 400 with the reason otherwise. */
async function assertLinkable(db: D1Database, app: ToolApp, refId: string, userId: string) {
  const owned =
    app === 'tasks'
      ? await db.prepare("SELECT 1 FROM workspaces w JOIN workspace_members m ON m.workspace_id = w.id WHERE w.id = ? AND m.user_id = ? AND m.role = 'owner' AND w.deleted_at IS NULL").bind(refId, userId).first()
      : app === 'crm'
        ? await db.prepare("SELECT 1 FROM crm_orgs o JOIN crm_members m ON m.org_id = o.id WHERE o.id = ? AND m.user_id = ? AND m.role = 'owner' AND o.deleted_at IS NULL").bind(refId, userId).first()
        : await db.prepare("SELECT o.kind FROM fin_orgs o JOIN fin_members m ON m.org_id = o.id WHERE o.id = ? AND m.user_id = ? AND m.role = 'owner' AND o.deleted_at IS NULL").bind(refId, userId).first<{ kind: string }>();
  if (!owned) throw new HttpError(400, `You can link only a ${TOOL_LABELS[app]} ${app === 'tasks' ? 'workspace' : app === 'crm' ? 'organisation' : 'workspace'} you own.`);
  await refuseExample(db, app, refId, 'link');
  if (app === 'finance' && (owned as { kind: string }).kind !== 'business') throw new HttpError(400, 'Only a business workspace can belong to a company. Personal and household workspaces stay private.');
  if (await db.prepare('SELECT 1 FROM co_tools WHERE app = ? AND ref_id = ?').bind(app, refId).first()) throw new HttpError(409, `That ${TOOL_LABELS[app]} space already belongs to a company.`);
}

/** The tool roles a person already has in a tool (when a company takes on a tool its people already use). */
async function existingToolRole(db: D1Database, app: ToolApp, refId: string, userId: string): Promise<string | null> {
  const sql = app === 'tasks' ? 'SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?' : app === 'crm' ? 'SELECT role FROM crm_members WHERE org_id = ? AND user_id = ?' : 'SELECT role FROM fin_members WHERE org_id = ? AND user_id = ?';
  return (await db.prepare(sql).bind(refId, userId).first<{ role: string }>())?.role ?? null;
}

const roleColumn: Record<ToolApp, 'tasks_role' | 'crm_role' | 'fin_role'> = { tasks: 'tasks_role', crm: 'crm_role', finance: 'fin_role' };

companyRoutes.post('/companies', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  await rateLimit(db, `co-create:${user.id}`, 20, 60 * 60_000);
  const input = await body(c, createSchema);
  const owned = await db.prepare("SELECT COUNT(*) AS n, SUM(CASE WHEN co.kind = 'individual' THEN 1 ELSE 0 END) AS ind FROM co_companies co JOIN co_members m ON m.company_id = co.id AND m.user_id = ? AND m.role = 'owner' WHERE co.deleted_at IS NULL").bind(user.id).first<{ n: number; ind: number | null }>();
  if ((owned?.n ?? 0) >= 10) throw new HttpError(400, 'You own ten company accounts already.');
  if (input.kind === 'individual' && (owned?.ind ?? 0) >= 1) throw new HttpError(400, 'You already have a company account in your own name.');
  const checked = await checkDetails(c.env, input);
  if (checked.problems.length) throw new HttpError(400, checked.problems[0].message, { code: 'COMPANY_DETAILS', problems: checked.problems, warnings: checked.warnings });

  const tools = input.tools ?? { tasks: { create: true as const }, crm: { create: true as const }, finance: { create: true as const } };
  for (const app of TOOL_APPS) {
    const choice = tools[app];
    if (choice && 'link' in choice) await assertLinkable(db, app, choice.link, user.id);
  }

  const id = newId();
  const t = now();
  const me = await db.prepare('SELECT email, email_verified_at FROM users WHERE id = ?').bind(user.id).first<{ email: string; email_verified_at: number | null }>();
  // The owner's own sign-in address, already confirmed, is confirmed for the company too.
  const emailConfirmed = !!me?.email_verified_at && me.email.toLowerCase() === input.email.toLowerCase();
  const timezone = STATE_TIMEZONES[input.state] ?? 'Australia/Sydney';
  const address = [input.addressLine1, input.addressLine2, `${input.suburb} ${input.state} ${input.postcode}`].filter(Boolean).join(', ');
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO co_companies (id, name, kind, legal_name, country, abn, acn, abn_status, abr_entity_name, abr_entity_type, abr_gst_from, abr_state, abr_postcode, abr_checked_at,
           email, email_verified_at, phone, phone_kind, address_line1, address_line2, suburb, state, postcode, website, settings_json, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'AU', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.name,
        input.kind,
        checked.legalName,
        checked.abn,
        checked.acn,
        checked.abnStatus,
        checked.abr?.entityName ?? '',
        checked.abr?.entityType ?? '',
        checked.abr?.gstFrom ?? null,
        checked.abr?.state ?? '',
        checked.abr?.postcode ?? '',
        checked.abr ? t : null,
        input.email,
        emailConfirmed ? t : null,
        checked.phone,
        checked.phoneKind,
        input.addressLine1,
        input.addressLine2,
        input.suburb.trim(),
        input.state,
        input.postcode,
        input.website,
        JSON.stringify({ warnings: checked.warnings }),
        user.id,
        t,
        t,
      ),
  ];
  const toolIds: Partial<Record<ToolApp, string>> = {};
  for (const app of TOOL_APPS) {
    const choice = tools[app];
    if (!choice) continue;
    if ('link' in choice) toolIds[app] = choice.link;
    else if (app === 'tasks') {
      const ws = createWorkspaceStmts(db, { name: input.name, ownerId: user.id });
      toolIds.tasks = ws.id;
      stmts.push(...ws.stmts);
    } else if (app === 'crm') {
      const org = createCrmOrgStmts(db, { name: input.name, currency: 'AUD', timezone, phone: displayPhone(checked.phone), email: input.email, address, country: 'Australia', website: input.website }, user.id);
      toolIds.crm = org.id;
      stmts.push(...org.stmts);
    } else {
      const org = createFinOrgStmts(db, { name: input.name, kind: 'business', currency: 'AUD', country: 'Australia', timezone, legalName: checked.legalName, abn: checked.abn ?? '', address, email: input.email, phone: displayPhone(checked.phone), gstRegistered: !!checked.abr?.gstFrom }, user.id);
      toolIds.finance = org.id;
      stmts.push(...org.stmts);
    }
    stmts.push(db.prepare('INSERT INTO co_tools (company_id, app, ref_id, linked_by, linked_at) VALUES (?, ?, ?, ?, ?)').bind(id, app, toolIds[app], user.id, t));
  }
  stmts.push(
    db
      .prepare("INSERT INTO co_members (company_id, user_id, role, tasks_role, crm_role, fin_role, joined_at) VALUES (?, ?, 'owner', ?, ?, ?, ?)")
      .bind(id, user.id, toolIds.tasks ? 'owner' : null, toolIds.crm ? 'owner' : null, toolIds.finance ? 'owner' : null, t),
    coAuditStmt(db, { companyId: id, actorId: user.id, action: 'company.created', targetType: 'company', targetId: id, metadata: { kind: input.kind, abnStatus: checked.abnStatus, tools: Object.keys(toolIds) }, ip: clientIp(c) }),
  );
  await db.batch(stmts);
  // People already in a linked tool keep it; they are listed as "in a tool only" until added to the company.
  await audit(db, { actorId: user.id, action: 'company.created', targetType: 'company', targetId: id, metadata: { abnStatus: checked.abnStatus }, ip: clientIp(c) });
  let confirmation: string | null = null;
  if (!emailConfirmed) confirmation = await sendEmailConfirmation(c, id, input.name, input.email);
  const company = await db.prepare('SELECT * FROM co_companies WHERE id = ?').bind(id).first<CompanyRow>();
  return c.json({ company: companyDTO(c.env, company!), tools: toolIds, emailConfirmation: emailConfirmed ? 'confirmed' : confirmation }, 201);
});

/** Sends a confirmation link for the company's contact address. Returns 'sent', 'not_configured' or 'limited'. */
async function sendEmailConfirmation(c: any, companyId: string, name: string, email: string): Promise<string> {
  const db = c.env.DB as D1Database;
  if (!(await emailConnected(c.env))) return 'not_configured';
  try {
    await rateLimit(db, `co-confirm:${companyId}`, 5, 60 * 60_000);
  } catch {
    return 'limited';
  }
  const token = randomToken(32);
  const t = now();
  const expires = t + 48 * 3_600_000;
  await db.prepare('INSERT INTO co_email_confirmations (token_hash, company_id, email, created_at, expires_at) VALUES (?, ?, ?, ?, ?)').bind(await sha256Hex(token), companyId, email, t, expires).run();
  let url: string;
  try {
    url = companyUrl(c.env, `/confirm-email?token=${encodeURIComponent(token)}`);
  } catch {
    return 'not_configured';
  }
  await enqueueEmail(c.env, {
    to: email,
    data: { template: 'company_email', organisation: name, email, url, expires: new Date(expires).toUTCString().replace(/:\d\d GMT$/, ' UTC') },
    idempotencyKey: `co-email:${companyId}:${t}`,
    sensitive: true,
  }).catch(() => null);
  c.executionCtx?.waitUntil?.(processOutbox(c.env, { max: 5 }).catch(() => null));
  return 'sent';
}

/** Opens a confirmation link (anyone with the link: it proves the mailbox, not the person). */
companyPublicRoutes.post('/confirm-email', async (c) => {
  await rateLimit(c.env.DB, `co-confirm-open:${clientIp(c)}`, 30, 15 * 60_000);
  const input = await body(c, z.object({ token: z.string().min(10).max(200) }));
  const row = await c.env.DB.prepare('SELECT * FROM co_email_confirmations WHERE token_hash = ?').bind(await sha256Hex(input.token)).first<{ company_id: string; email: string; expires_at: number; used_at: number | null }>();
  if (!row) throw new HttpError(400, 'This confirmation link is not valid.');
  if (row.used_at) throw new HttpError(400, 'This confirmation link was already used.');
  if (row.expires_at < now()) throw new HttpError(400, 'This confirmation link has expired. Send a new one from the company’s settings.');
  const co = await c.env.DB.prepare('SELECT id, name, email FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(row.company_id).first<{ id: string; name: string; email: string }>();
  if (!co || co.email.toLowerCase() !== row.email.toLowerCase()) throw new HttpError(400, 'The company’s contact address has changed since this link was sent.');
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE co_email_confirmations SET used_at = ? WHERE token_hash = ?').bind(t, await sha256Hex(input.token)),
    c.env.DB.prepare('UPDATE co_companies SET email_verified_at = ?, updated_at = ? WHERE id = ?').bind(t, t, co.id),
    coAuditStmt(c.env.DB, { companyId: co.id, actorId: null, action: 'company.email_confirmed', ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, company: co.name });
});

// ------------------------------------------------------------------ one company

const one = new Hono<AppEnv>();

one.get('/', async (c) => {
  const a = await requireCompany(c);
  const counts = await c.env.DB.prepare(
    `SELECT (SELECT COUNT(*) FROM co_members WHERE company_id = ?1) AS members,
            (SELECT COUNT(*) FROM co_departments WHERE company_id = ?1 AND archived_at IS NULL) AS departments,
            (SELECT COUNT(*) FROM co_invitations WHERE company_id = ?1 AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?2) AS invitations`,
  )
    .bind(a.companyId, now())
    .first<{ members: number; departments: number; invitations: number }>();
  const heads = await c.env.DB.prepare('SELECT id FROM co_departments WHERE company_id = ? AND head_id = ? AND archived_at IS NULL').bind(a.companyId, a.userId).all<{ id: string }>();
  return c.json({
    company: companyDTO(c.env, a.company),
    me: { role: a.role, roleLabel: COMPANY_ROLE_LABELS[a.role], title: a.member.title, toolRoles: rolesOf(a.member), headOf: heads.results.map((h) => h.id) },
    tools: await toolsView(c.env.DB, a),
    counts,
  });
});

one.patch('/', async (c) => {
  const a = await requireCompany(c, 'admin');
  const input = await body(c, detailsSchema);
  if (input.kind !== a.company.kind && a.role !== 'owner') throw new HttpError(403, 'Only the owner can change the kind of company');
  const abnChanged = (normaliseAbn(input.abn) ?? null) !== a.company.abn;
  if (abnChanged && a.role !== 'owner') throw new HttpError(403, 'Only the owner can change the ABN');
  const checked = await checkDetails(c.env, input, { exceptCompanyId: a.companyId, lookup: abnChanged || a.company.abn_status === 'format_ok' });
  if (checked.problems.length) throw new HttpError(400, checked.problems[0].message, { code: 'COMPANY_DETAILS', problems: checked.problems, warnings: checked.warnings });
  const t = now();
  const emailChanged = input.email.toLowerCase() !== a.company.email.toLowerCase();
  const keepAbr = !abnChanged && !checked.abr && a.company.abr_checked_at;
  await c.env.DB.batch([
    c.env.DB
      .prepare(
        `UPDATE co_companies SET name = ?, kind = ?, legal_name = ?, abn = ?, acn = ?, abn_status = ?, abr_entity_name = ?, abr_entity_type = ?, abr_gst_from = ?, abr_state = ?, abr_postcode = ?, abr_checked_at = ?,
           email = ?, email_verified_at = ?, phone = ?, phone_kind = ?, address_line1 = ?, address_line2 = ?, suburb = ?, state = ?, postcode = ?, website = ?, settings_json = ?, updated_at = ? WHERE id = ?`,
      )
      .bind(
        input.name,
        input.kind,
        keepAbr ? a.company.legal_name : checked.legalName,
        checked.abn,
        checked.acn,
        keepAbr ? a.company.abn_status : checked.abnStatus,
        keepAbr ? a.company.abr_entity_name : (checked.abr?.entityName ?? ''),
        keepAbr ? a.company.abr_entity_type : (checked.abr?.entityType ?? ''),
        keepAbr ? a.company.abr_gst_from : (checked.abr?.gstFrom ?? null),
        keepAbr ? a.company.abr_state : (checked.abr?.state ?? ''),
        keepAbr ? a.company.abr_postcode : (checked.abr?.postcode ?? ''),
        keepAbr ? a.company.abr_checked_at : checked.abr ? t : null,
        input.email,
        emailChanged ? null : a.company.email_verified_at,
        checked.phone,
        checked.phoneKind,
        input.addressLine1,
        input.addressLine2,
        input.suburb.trim(),
        input.state,
        input.postcode,
        input.website,
        JSON.stringify({ ...JSON.parse(a.company.settings_json || '{}'), warnings: checked.warnings }),
        t,
        a.companyId,
      ),
    coAuditStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'company.updated', targetType: 'company', targetId: a.companyId, metadata: { abnChanged, emailChanged }, ip: clientIp(c) }),
  ]);
  let confirmation: string | null = null;
  if (emailChanged) confirmation = await sendEmailConfirmation(c, a.companyId, input.name, input.email);
  const co = await c.env.DB.prepare('SELECT * FROM co_companies WHERE id = ?').bind(a.companyId).first<CompanyRow>();
  return c.json({ company: companyDTO(c.env, co!), emailConfirmation: confirmation });
});

one.post('/email/send-confirmation', async (c) => {
  const a = await requireCompany(c, 'admin');
  if (a.company.email_verified_at) return c.json({ result: 'confirmed' });
  return c.json({ result: await sendEmailConfirmation(c, a.companyId, a.company.name, a.company.email) });
});

/** Looks the ABN up on the register again (an admin's request; the maintenance run also retries). */
one.post('/abn/recheck', async (c) => {
  const a = await requireCompany(c, 'admin');
  if (!a.company.abn) throw new HttpError(400, 'This company has no ABN');
  await rateLimit(c.env.DB, `co-abr:${a.companyId}`, 10, 60 * 60_000);
  const r = await recheckAbn(c.env, a.company);
  if (r === 'unavailable') throw new HttpError(503, abrConfigured(c.env) ? 'The Australian Business Register could not be reached. Try again later.' : 'The register lookup is not set up on this service.');
  const co = await c.env.DB.prepare('SELECT * FROM co_companies WHERE id = ?').bind(a.companyId).first<CompanyRow>();
  return c.json({ company: companyDTO(c.env, co!) });
});

/** Looks a company's ABN up and stores the register's answer. */
export async function recheckAbn(env: Env, co: CompanyRow): Promise<'active' | 'cancelled' | 'not_found' | 'unavailable'> {
  if (!co.abn) return 'unavailable';
  const r = await abrLookup(env, co.abn);
  if (r.status === 'unavailable') return 'unavailable';
  const t = now();
  if (r.status === 'not_found') {
    await env.DB.prepare("UPDATE co_companies SET abn_status = 'not_found', abr_checked_at = ?, updated_at = ? WHERE id = ?").bind(t, t, co.id).run();
  } else {
    await env.DB
      .prepare('UPDATE co_companies SET abn_status = ?, abr_entity_name = ?, abr_entity_type = ?, abr_gst_from = ?, abr_state = ?, abr_postcode = ?, abr_checked_at = ?, legal_name = CASE WHEN ? != \'\' THEN ? ELSE legal_name END, updated_at = ? WHERE id = ?')
      .bind(r.status, r.entityName, r.entityType, r.gstFrom, r.state, r.postcode, t, r.entityName, r.entityName, t, co.id)
      .run();
  }
  await env.DB.batch([coAuditStmt(env.DB, { companyId: co.id, actorId: null, action: 'company.abn_checked', metadata: { result: r.status } })]);
  return r.status;
}

/** The maintenance run: companies whose ABN was not yet looked up, a few at a time, when the lookup is set up. */
export async function recheckPendingAbns(env: Env, max = 5): Promise<number> {
  if (!abrConfigured(env)) return 0;
  const rows = await env.DB.prepare("SELECT * FROM co_companies WHERE abn_status = 'format_ok' AND abn IS NOT NULL AND deleted_at IS NULL ORDER BY COALESCE(abr_checked_at, 0), created_at LIMIT ?").bind(max).all<CompanyRow>();
  let done = 0;
  for (const co of rows.results) if ((await recheckAbn(env, co)) !== 'unavailable') done++;
  return done;
}

one.delete('/', async (c) => {
  const a = await requireCompany(c, 'owner');
  const input = await body(c, z.object({ confirm: z.string().max(200) }));
  if (input.confirm.trim() !== a.company.name) throw new HttpError(400, 'Type the company’s name to confirm');
  const t = now();
  // The tools stay as they are, with their people and records: only the company account goes.
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE co_companies SET deleted_at = ?, updated_at = ? WHERE id = ?').bind(t, t, a.companyId),
    c.env.DB.prepare('DELETE FROM co_tools WHERE company_id = ?').bind(a.companyId),
    c.env.DB.prepare('UPDATE co_invitations SET revoked_at = ? WHERE company_id = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(t, a.companyId),
    coAuditStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'company.deleted', ip: clientIp(c) }),
  ]);
  await audit(c.env.DB, { actorId: a.userId, action: 'company.deleted', targetType: 'company', targetId: a.companyId, ip: clientIp(c) });
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ people

const tasksRole = z.enum(TASKS_ROLES).nullable();
const crmRole = z.enum(CRM_ROLES).nullable();
const finRole = z.enum(FIN_ROLES).nullable();

one.get('/members', async (c) => {
  const a = await requireCompany(c);
  const db = c.env.DB;
  const rows = await db
    .prepare(
      `SELECT m.*, u.name, u.email, u.last_active_at FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ?
       ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, u.name COLLATE NOCASE`,
    )
    .bind(a.companyId)
    .all<MemberRow & { name: string; email: string; last_active_at: number | null }>();
  const depts = await db.prepare('SELECT dm.user_id, dm.department_id FROM co_department_members dm JOIN co_departments d ON d.id = dm.department_id AND d.archived_at IS NULL WHERE dm.company_id = ?').bind(a.companyId).all<{ user_id: string; department_id: string }>();
  const members = rows.results.map((m) => ({
    userId: m.user_id,
    name: m.name,
    email: m.email,
    role: m.role,
    title: m.title,
    toolRoles: rolesOf(m),
    departmentIds: depts.results.filter((d) => d.user_id === m.user_id).map((d) => d.department_id),
    joinedAt: m.joined_at,
    lastActiveAt: atLeast(a.role, 'admin') ? m.last_active_at : null,
  }));
  // People in one of the company's tools who are not in the company (they joined the tool directly).
  const inCompany = new Set(members.map((m) => m.userId));
  const toolOnly = new Map<string, { userId: string; name: string; email: string; tools: Partial<Record<ToolApp, string>> }>();
  const add = (app: ToolApp, r: { user_id: string; name: string; email: string; role: string }) => {
    if (inCompany.has(r.user_id)) return;
    const x = toolOnly.get(r.user_id) ?? { userId: r.user_id, name: r.name, email: r.email, tools: {} };
    x.tools[app] = r.role;
    toolOnly.set(r.user_id, x);
  };
  if (atLeast(a.role, 'admin')) {
    if (a.tools.tasks) for (const r of (await db.prepare("SELECT m.user_id, m.role, u.name, u.email FROM workspace_members m JOIN users u ON u.id = m.user_id WHERE m.workspace_id = ? AND m.status = 'active'").bind(a.tools.tasks).all<any>()).results) add('tasks', r);
    if (a.tools.crm) for (const r of (await db.prepare('SELECT m.user_id, m.role, u.name, u.email FROM crm_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ?').bind(a.tools.crm).all<any>()).results) add('crm', r);
    if (a.tools.finance) for (const r of (await db.prepare('SELECT m.user_id, m.role, u.name, u.email FROM fin_members m JOIN users u ON u.id = m.user_id WHERE m.org_id = ?').bind(a.tools.finance).all<any>()).results) add('finance', r);
  }
  return c.json({ members, toolOnly: Array.from(toolOnly.values()) });
});

/** Adds someone who already works in one of the company's tools to the company, keeping their tool roles. */
one.post('/members', async (c) => {
  const a = await requireCompany(c, 'admin');
  const input = await body(c, z.object({ userId: z.string().min(1).max(64), role: z.enum(['admin', 'member']).default('member'), title: z.string().trim().max(100).optional().default('') }));
  if (input.role === 'admin' && a.role !== 'owner') throw new HttpError(403, 'Only the owner can add administrators');
  const db = c.env.DB;
  if (await db.prepare('SELECT 1 FROM co_members WHERE company_id = ? AND user_id = ?').bind(a.companyId, input.userId).first()) throw new HttpError(409, 'Already in the company');
  const roles: Record<ToolApp, string | null> = { tasks: null, crm: null, finance: null };
  for (const app of TOOL_APPS) if (a.tools[app]) roles[app] = await existingToolRole(db, app, a.tools[app]!, input.userId);
  if (!roles.tasks && !roles.crm && !roles.finance) throw new HttpError(400, 'Invite people who are not in the company’s tools yet');
  await db.batch([
    db.prepare('INSERT INTO co_members (company_id, user_id, role, title, tasks_role, crm_role, fin_role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(a.companyId, input.userId, input.role, input.title, roles.tasks, roles.crm, roles.finance, a.userId, now()),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.added', targetType: 'user', targetId: input.userId, metadata: { role: input.role }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true }, 201);
});

one.patch('/members/:userId', async (c) => {
  const a = await requireCompany(c, 'admin');
  const targetId = c.req.param('userId');
  const db = c.env.DB;
  const target = await db.prepare('SELECT * FROM co_members WHERE company_id = ? AND user_id = ?').bind(a.companyId, targetId).first<MemberRow>();
  if (!target) throw notFound('Member');
  const input = await body(c, z.object({ role: z.enum(['admin', 'member']).optional(), title: z.string().trim().max(100).optional(), tasksRole: tasksRole.optional(), crmRole: crmRole.optional(), finRole: finRole.optional() }));
  if (target.role === 'owner' && (input.role || input.tasksRole !== undefined || input.crmRole !== undefined || input.finRole !== undefined)) throw new HttpError(400, 'The owner has every tool and role. Transfer ownership first.');
  if (target.role === 'admin' && a.role !== 'owner' && targetId !== a.userId) throw new HttpError(403, 'Only the owner can change an administrator');
  if (input.role === 'admin' && a.role !== 'owner') throw new HttpError(403, 'Only the owner can make someone an administrator');
  const roles: ToolRoles = {
    tasks: input.tasksRole !== undefined ? input.tasksRole : target.tasks_role,
    crm: input.crmRole !== undefined ? input.crmRole : target.crm_role,
    finance: input.finRole !== undefined ? input.finRole : target.fin_role,
  };
  for (const app of TOOL_APPS) if (!a.tools[app]) roles[app] = null;
  const changedTools = TOOL_APPS.filter((app) => roles[app] !== rolesOf(target)[app]);
  const changed: Partial<Record<ToolApp, ToolRoles[ToolApp]>> = {};
  for (const app of changedTools) changed[app] = roles[app];
  await db.batch([
    db.prepare('UPDATE co_members SET role = ?, title = ?, tasks_role = ?, crm_role = ?, fin_role = ? WHERE company_id = ? AND user_id = ?').bind(input.role ?? target.role, input.title ?? target.title, roles.tasks, roles.crm, roles.finance, a.companyId, targetId),
    // Only the tools whose role changed are touched.
    ...memberToolStmts(db, Object.fromEntries(changedTools.map((app) => [app, a.tools[app]])) as Partial<Record<ToolApp, string>>, targetId, roles, a.userId),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'member.updated', targetType: 'user', targetId, metadata: { role: input.role ?? target.role, tools: changed }, ip: clientIp(c) }),
  ]);
  if (changedTools.length) await syncDepartmentsOf(db, a.tools, a.companyId, targetId);
  return c.json({ ok: true });
});

async function removeMember(c: any, a: CompanyAccess, targetId: string, action: 'member.removed' | 'member.left') {
  const db = c.env.DB as D1Database;
  const depts = await db.prepare('SELECT department_id FROM co_department_members WHERE company_id = ? AND user_id = ?').bind(a.companyId, targetId).all<{ department_id: string }>();
  await db.batch([
    ...memberToolStmts(db, a.tools, targetId, { tasks: null, crm: null, finance: null }, a.userId),
    db.prepare('UPDATE co_departments SET head_id = NULL WHERE company_id = ? AND head_id = ?').bind(a.companyId, targetId),
    db.prepare('DELETE FROM co_members WHERE company_id = ? AND user_id = ?').bind(a.companyId, targetId),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action, targetType: 'user', targetId, ip: clientIp(c) }),
  ]);
  const { syncDepartment } = await import('./sync');
  for (const d of depts.results) await syncDepartment(db, a.tools, d.department_id);
}

one.delete('/members/:userId', async (c) => {
  const a = await requireCompany(c, 'admin');
  const targetId = c.req.param('userId');
  if (targetId === a.userId) throw new HttpError(400, 'Use "Leave company" to remove yourself');
  const target = await c.env.DB.prepare('SELECT role FROM co_members WHERE company_id = ? AND user_id = ?').bind(a.companyId, targetId).first<{ role: CompanyRole }>();
  if (!target) throw notFound('Member');
  if (target.role === 'owner') throw new HttpError(400, 'The owner cannot be removed');
  if (target.role === 'admin' && a.role !== 'owner') throw new HttpError(403, 'Only the owner can remove administrators');
  await removeMember(c, a, targetId, 'member.removed');
  return c.json({ ok: true });
});

one.post('/leave', async (c) => {
  const a = await requireCompany(c);
  if (a.role === 'owner') throw new HttpError(400, 'The owner cannot leave. Transfer ownership first.');
  await removeMember(c, a, a.userId, 'member.left');
  return c.json({ ok: true });
});

/** Hands the company, and every tool it runs, to another member. The old owner stays as an administrator. */
one.post('/transfer', async (c) => {
  const a = await requireCompany(c, 'owner');
  const input = await body(c, z.object({ userId: z.string().min(1).max(64) }));
  if (input.userId === a.userId) throw new HttpError(400, 'Choose someone else');
  const db = c.env.DB;
  const target = await db.prepare('SELECT * FROM co_members WHERE company_id = ? AND user_id = ?').bind(a.companyId, input.userId).first<MemberRow>();
  if (!target) throw notFound('Member');
  if (target.role !== 'admin') throw new HttpError(400, 'Make them an administrator first');
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db.prepare("UPDATE co_members SET role = 'admin', tasks_role = CASE WHEN tasks_role IS NULL THEN NULL ELSE 'admin' END, crm_role = CASE WHEN crm_role IS NULL THEN NULL ELSE 'admin' END, fin_role = CASE WHEN fin_role IS NULL THEN NULL ELSE 'admin' END WHERE company_id = ? AND user_id = ?").bind(a.companyId, a.userId),
    db.prepare('UPDATE co_members SET role = ?, tasks_role = ?, crm_role = ?, fin_role = ? WHERE company_id = ? AND user_id = ?').bind('owner', a.tools.tasks ? 'owner' : null, a.tools.crm ? 'owner' : null, a.tools.finance ? 'owner' : null, a.companyId, input.userId),
  ];
  if (a.tools.tasks) {
    stmts.push(
      db.prepare("UPDATE workspace_members SET role = 'admin' WHERE workspace_id = ? AND user_id = ? AND role = 'owner'").bind(a.tools.tasks, a.userId),
      db.prepare("INSERT INTO workspace_members (workspace_id, user_id, role, joined_at, status) VALUES (?, ?, 'owner', ?, 'active') ON CONFLICT(workspace_id, user_id) DO UPDATE SET role = 'owner', status = 'active'").bind(a.tools.tasks, input.userId, t),
    );
  }
  for (const [app, table] of [['crm', 'crm_members'], ['finance', 'fin_members']] as const) {
    const org = a.tools[app];
    if (!org) continue;
    // One owner per organisation: the old owner steps down first.
    stmts.push(
      db.prepare(`UPDATE ${table} SET role = 'admin' WHERE org_id = ? AND role = 'owner'`).bind(org),
      db.prepare(`INSERT INTO ${table} (org_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?) ON CONFLICT(org_id, user_id) DO UPDATE SET role = 'owner'`).bind(org, input.userId, t),
    );
  }
  stmts.push(coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'company.ownership_transferred', targetType: 'user', targetId: input.userId, ip: clientIp(c) }));
  await db.batch(stmts);
  await audit(db, { actorId: a.userId, action: 'company.ownership_transferred', targetType: 'company', targetId: a.companyId, metadata: { to: input.userId }, ip: clientIp(c) });
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ invitations

interface InviteRow {
  id: string;
  company_id: string;
  email: string;
  role: 'admin' | 'member';
  title: string;
  tasks_role: string | null;
  crm_role: string | null;
  fin_role: string | null;
  department_ids: string;
  invited_by: string;
  created_at: number;
  expires_at: number;
  accepted_at: number | null;
  revoked_at: number | null;
}

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  role: z.enum(['admin', 'member']).default('member'),
  title: z.string().trim().max(100).optional().default(''),
  tasksRole: tasksRole.optional().default(null),
  crmRole: crmRole.optional().default(null),
  finRole: finRole.optional().default(null),
  departmentIds: z.array(z.string().max(64)).max(50).optional().default([]),
});

function toolsLine(i: { tasks_role: string | null; crm_role: string | null; fin_role: string | null }): string {
  const parts = [i.tasks_role ? TOOL_LABELS.tasks : null, i.crm_role ? TOOL_LABELS.crm : null, i.fin_role ? TOOL_LABELS.finance : null].filter(Boolean);
  return parts.length ? parts.join(', ') : 'The company area only (no tools yet)';
}

one.get('/invitations', async (c) => {
  const a = await requireCompany(c, 'admin');
  const rows = await c.env.DB.prepare('SELECT i.*, u.name AS inviter FROM co_invitations i LEFT JOIN users u ON u.id = i.invited_by WHERE i.company_id = ? AND i.accepted_at IS NULL AND i.revoked_at IS NULL ORDER BY i.created_at DESC LIMIT 200').bind(a.companyId).all<InviteRow & { inviter: string | null }>();
  return c.json(
    rows.results.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      title: i.title,
      toolRoles: { tasks: i.tasks_role, crm: i.crm_role, finance: i.fin_role },
      departmentIds: JSON.parse(i.department_ids || '[]'),
      inviter: i.inviter,
      createdAt: i.created_at,
      expiresAt: i.expires_at,
      expired: i.expires_at < now(),
    })),
  );
});

async function sendInvite(c: any, a: CompanyAccess, inv: InviteRow, token: string) {
  let url: string;
  try {
    url = companyUrl(c.env, `/join/${encodeURIComponent(token)}`);
  } catch (e) {
    throw new HttpError(503, `Invitation links cannot be created: ${e instanceof Error ? e.message : 'the app address is not configured'}`);
  }
  if (!(await emailConnected(c.env))) return { url, delivery: 'not_configured' };
  const existing = await c.env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(inv.email).first();
  const r = await enqueueEmail(c.env, {
    to: inv.email,
    data: { template: 'company_invitation', organisation: a.company.name, inviter: a.userName, role: COMPANY_ROLE_LABELS[inv.role], tools: toolsLine(inv), expires: new Date(inv.expires_at).toUTCString().replace(/:\d\d GMT$/, ' UTC'), url, existingUser: !!existing },
    idempotencyKey: `co-invite:${inv.id}:${now()}`,
    sensitive: true,
  });
  c.executionCtx?.waitUntil?.(processOutbox(c.env, { max: 5 }).catch(() => null));
  return { url, delivery: r.queued ? 'queued' : r.reason };
}

one.post('/invitations', async (c) => {
  const a = await requireCompany(c, 'admin');
  const db = c.env.DB;
  await rateLimit(db, `co-invite:${a.userId}`, 60, 60 * 60_000);
  const input = await body(c, inviteSchema);
  if (input.role === 'admin' && a.role !== 'owner') throw new HttpError(403, 'Only the owner can invite administrators');
  const policy = await loadPolicy(db);
  const mail = await checkAddress(c.env, input.email, policy);
  if (!mail.ok) throw new HttpError(400, mail.message);
  const already = await db.prepare('SELECT 1 FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? AND u.email = ?').bind(a.companyId, input.email).first();
  if (already) throw new HttpError(409, 'This person is already in the company');
  const depts = input.departmentIds.length ? (await db.prepare(`SELECT id FROM co_departments WHERE company_id = ? AND archived_at IS NULL AND id IN (${placeholders(input.departmentIds.length)})`).bind(a.companyId, ...input.departmentIds).all<{ id: string }>()).results.map((d) => d.id) : [];
  const token = randomToken(32);
  const t = now();
  const inv: InviteRow = {
    id: newId(),
    company_id: a.companyId,
    email: input.email,
    role: input.role,
    title: input.title,
    tasks_role: a.tools.tasks ? input.tasksRole : null,
    crm_role: a.tools.crm ? input.crmRole : null,
    fin_role: a.tools.finance ? input.finRole : null,
    department_ids: JSON.stringify(depts),
    invited_by: a.userId,
    created_at: t,
    expires_at: t + 14 * 86_400_000,
    accepted_at: null,
    revoked_at: null,
  };
  await db.batch([
    // A new invitation to the same address replaces the earlier ones.
    db.prepare('UPDATE co_invitations SET revoked_at = ? WHERE company_id = ? AND email = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(t, a.companyId, input.email),
    db
      .prepare('INSERT INTO co_invitations (id, company_id, email, role, title, tasks_role, crm_role, fin_role, department_ids, token_hash, invited_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(inv.id, a.companyId, inv.email, inv.role, inv.title, inv.tasks_role, inv.crm_role, inv.fin_role, inv.department_ids, await sha256Hex(token), a.userId, t, inv.expires_at),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'invitation.created', targetType: 'invitation', targetId: inv.id, metadata: { role: inv.role, domain: input.email.split('@').pop() }, ip: clientIp(c) }),
  ]);
  const sent = await sendInvite(c, a, inv, token);
  return c.json({ id: inv.id, ...sent }, 201);
});

one.delete('/invitations/:id', async (c) => {
  const a = await requireCompany(c, 'admin');
  const r = await c.env.DB.prepare('UPDATE co_invitations SET revoked_at = ? WHERE id = ? AND company_id = ? AND accepted_at IS NULL AND revoked_at IS NULL').bind(now(), c.req.param('id'), a.companyId).run();
  if (!r.meta.changes) throw notFound('Invitation');
  await c.env.DB.batch([coAuditStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'invitation.revoked', targetType: 'invitation', targetId: c.req.param('id'), ip: clientIp(c) })]);
  return c.json({ ok: true });
});

/** A pending invitation by its token, for its preview and acceptance. */
async function inviteByToken(db: D1Database, token: string) {
  if (!token || token.length > 200) return null;
  return db
    .prepare('SELECT i.*, co.name AS company, co.kind AS company_kind, co.abn_status, u.name AS inviter FROM co_invitations i JOIN co_companies co ON co.id = i.company_id AND co.deleted_at IS NULL LEFT JOIN users u ON u.id = i.invited_by WHERE i.token_hash = ?')
    .bind(await sha256Hex(token))
    .first<InviteRow & { company: string; company_kind: string; abn_status: string; inviter: string | null }>();
}

companyPublicRoutes.get('/invitations/:token', async (c) => {
  await rateLimit(c.env.DB, `co-invite-view:${clientIp(c)}`, 60, 15 * 60_000);
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  if (!inv) throw notFound('Invitation');
  const status = inv.revoked_at ? 'revoked' : inv.accepted_at ? 'accepted' : inv.expires_at < now() ? 'expired' : 'pending';
  const existing = await c.env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(inv.email).first();
  return c.json({
    company: inv.company,
    companyKind: inv.company_kind,
    abnStatus: inv.abn_status,
    inviter: inv.inviter,
    role: inv.role,
    roleLabel: COMPANY_ROLE_LABELS[inv.role],
    tools: toolsLine(inv),
    status,
    // The address is shown only partly: the link may have been forwarded.
    emailHint: inv.email.replace(/^(.).*@/, '$1…@'),
    hasAccount: !!existing,
  });
});

companyRoutes.post('/invitations/:token/accept', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  await rateLimit(db, `co-invite-accept:${user.id}`, 30, 15 * 60_000);
  const inv = await inviteByToken(db, c.req.param('token'));
  if (!inv || inv.revoked_at || inv.expires_at < now()) throw new HttpError(400, 'This invitation is no longer valid. Ask for a new one.');
  if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new HttpError(403, `This invitation is for another email address. Sign in as ${inv.email.replace(/^(.).*@/, '$1…@')} to accept it.`);
  if (inv.accepted_at) return c.json({ companyId: inv.company_id, already: true });
  if (await db.prepare('SELECT 1 FROM co_members WHERE company_id = ? AND user_id = ?').bind(inv.company_id, user.id).first()) return c.json({ companyId: inv.company_id, already: true });
  const tools = await companyTools(db, inv.company_id);
  const roles: ToolRoles = { tasks: tools.tasks ? (inv.tasks_role as ToolRoles['tasks']) : null, crm: tools.crm ? (inv.crm_role as ToolRoles['crm']) : null, finance: tools.finance ? (inv.fin_role as ToolRoles['finance']) : null };
  const depts = (JSON.parse(inv.department_ids || '[]') as string[]).slice(0, 50);
  const live = depts.length ? (await db.prepare(`SELECT id FROM co_departments WHERE company_id = ? AND archived_at IS NULL AND id IN (${placeholders(depts.length)})`).bind(inv.company_id, ...depts).all<{ id: string }>()).results.map((d) => d.id) : [];
  const t = now();
  await db.batch([
    db.prepare('UPDATE co_invitations SET accepted_at = ?, accepted_by = ? WHERE id = ? AND accepted_at IS NULL').bind(t, user.id, inv.id),
    db.prepare('INSERT INTO co_members (company_id, user_id, role, title, tasks_role, crm_role, fin_role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(inv.company_id, user.id, inv.role, inv.title, roles.tasks, roles.crm, roles.finance, inv.invited_by, t),
    // The invitation reached this mailbox, so the address is confirmed.
    db.prepare('UPDATE users SET email_verified_at = COALESCE(email_verified_at, ?) WHERE id = ?').bind(t, user.id),
    ...memberToolStmts(db, Object.fromEntries(TOOL_APPS.filter((x) => roles[x]).map((x) => [x, tools[x]])) as Partial<Record<ToolApp, string>>, user.id, roles, inv.invited_by),
    ...live.map((d) => db.prepare('INSERT OR IGNORE INTO co_department_members (company_id, department_id, user_id, added_at) VALUES (?, ?, ?, ?)').bind(inv.company_id, d, user.id, t)),
    coAuditStmt(db, { companyId: inv.company_id, actorId: user.id, action: 'invitation.accepted', targetType: 'invitation', targetId: inv.id, ip: clientIp(c) }),
  ]);
  const { syncDepartment } = await import('./sync');
  for (const d of live) await syncDepartment(db, tools, d);
  return c.json({ companyId: inv.company_id });
});

companyRoutes.post('/invitations/:token/decline', async (c) => {
  const user = c.get('user');
  const inv = await inviteByToken(c.env.DB, c.req.param('token'));
  if (!inv || inv.email.toLowerCase() !== user.email.toLowerCase() || inv.accepted_at || inv.revoked_at) throw notFound('Invitation');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE co_invitations SET revoked_at = ? WHERE id = ?').bind(now(), inv.id),
    coAuditStmt(c.env.DB, { companyId: inv.company_id, actorId: user.id, action: 'invitation.declined', targetType: 'invitation', targetId: inv.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ tools

/** Links a tool the owner already runs, or makes a new one for the company. */
one.post('/tools', async (c) => {
  const a = await requireCompany(c, 'owner');
  const input = await body(c, z.object({ app: z.enum(['tasks', 'crm', 'finance']), link: z.string().min(1).max(64).optional() }));
  const db = c.env.DB;
  if (a.tools[input.app]) throw new HttpError(409, `The company already has ${TOOL_LABELS[input.app]}. Unlink it first.`);
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let refId: string;
  if (input.link) {
    await assertLinkable(db, input.app, input.link, a.userId);
    refId = input.link;
  } else {
    const co = a.company;
    const address = [co.address_line1, co.address_line2, `${co.suburb} ${co.state} ${co.postcode}`].filter(Boolean).join(', ');
    const timezone = STATE_TIMEZONES[co.state] ?? 'Australia/Sydney';
    const made =
      input.app === 'tasks'
        ? createWorkspaceStmts(db, { name: co.name, ownerId: a.userId })
        : input.app === 'crm'
          ? createCrmOrgStmts(db, { name: co.name, currency: 'AUD', timezone, phone: displayPhone(co.phone), email: co.email, address, country: 'Australia', website: co.website }, a.userId)
          : createFinOrgStmts(db, { name: co.name, kind: 'business', currency: 'AUD', country: 'Australia', timezone, legalName: co.legal_name, abn: co.abn ?? '', address, email: co.email, phone: displayPhone(co.phone), gstRegistered: !!co.abr_gst_from }, a.userId);
    refId = made.id;
    stmts.push(...made.stmts);
  }
  stmts.push(db.prepare('INSERT INTO co_tools (company_id, app, ref_id, linked_by, linked_at) VALUES (?, ?, ?, ?, ?)').bind(a.companyId, input.app, refId, a.userId, t));
  stmts.push(db.prepare(`UPDATE co_members SET ${roleColumn[input.app]} = 'owner' WHERE company_id = ? AND user_id = ?`).bind(a.companyId, a.userId));
  // People of the company who already work in a linked tool keep their role there.
  if (input.link) {
    const col = roleColumn[input.app];
    const table = input.app === 'tasks' ? "workspace_members WHERE workspace_id = ? AND status = 'active'" : input.app === 'crm' ? 'crm_members WHERE org_id = ?' : 'fin_members WHERE org_id = ?';
    stmts.push(db.prepare(`UPDATE co_members SET ${col} = (SELECT x.role FROM ${table.replace('WHERE ', 'x WHERE x.').replace(' AND status', ' AND x.status')} AND x.user_id = co_members.user_id) WHERE company_id = ? AND user_id != ?`).bind(refId, a.companyId, a.userId));
  }
  stmts.push(coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: input.link ? 'tool.linked' : 'tool.created', targetType: input.app, targetId: refId, ip: clientIp(c) }));
  await db.batch(stmts);
  await syncAllDepartments(db, await companyTools(db, a.companyId), a.companyId);
  return c.json({ app: input.app, id: refId }, 201);
});

/** Unlinks a tool: it keeps its people and records; the company stops managing it. */
one.delete('/tools/:app', async (c) => {
  const a = await requireCompany(c, 'owner');
  const app = c.req.param('app') as ToolApp;
  if (!TOOL_APPS.includes(app) || !a.tools[app]) throw notFound('Tool');
  const col = roleColumn[app];
  const teamCol = app === 'tasks' ? 'pm_team_id' : app === 'crm' ? 'crm_team_id' : 'fin_tracking_id';
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM co_tools WHERE company_id = ? AND app = ?').bind(a.companyId, app),
    c.env.DB.prepare(`UPDATE co_members SET ${col} = NULL WHERE company_id = ?`).bind(a.companyId),
    c.env.DB.prepare(`UPDATE co_departments SET ${teamCol} = NULL WHERE company_id = ?`).bind(a.companyId),
    coAuditStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'tool.unlinked', targetType: app, targetId: a.tools[app], ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

one.get('/activity', async (c) => {
  const a = await requireCompany(c, 'admin');
  const rows = await c.env.DB.prepare('SELECT l.*, u.name AS actor FROM co_audit l LEFT JOIN users u ON u.id = l.actor_id WHERE l.company_id = ? ORDER BY l.created_at DESC LIMIT 200').bind(a.companyId).all<{ id: string; action: string; actor: string | null; target_type: string | null; target_id: string | null; metadata_json: string; created_at: number }>();
  return c.json(rows.results.map((r) => ({ id: r.id, action: r.action, actor: r.actor, targetType: r.target_type, targetId: r.target_id, metadata: JSON.parse(r.metadata_json || '{}'), at: r.created_at })));
});

/** The company's projects (Project Management boards) with their Finance figures, where the viewer may see them. */
one.get('/projects', async (c) => {
  const a = await requireCompany(c);
  return c.json(await companyProjects(c.env.DB, a.tools, a.companyId, { id: a.userId, name: a.userName }));
});

one.route('/departments', departmentRoutes);
one.route('/overview', overviewRoutes);

companyRoutes.route('/c/:company', one);
companyRoutes.route('/id', idAuthorizeRoutes);
companyRoutes.route('/links', linkRoutes);
