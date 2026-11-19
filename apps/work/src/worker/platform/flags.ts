// BIZOMAT Stage 1 feature flags (owner, 19 Nov 2026; Admin Control Centre, R2). Every new capability ships switched
// off and is switched on only by a platform admin, on the server. The registry below is the one list: each flag's
// values (the first is its default), the scopes it may be set for, its risk, whether the kill switch turns it off, and
// the release in which it starts to act. Values live in feature_flags (migration 0029); history in
// feature_flag_changes (append only).
//
// Resolution, most specific first: the company, the company's rollout stage (internal or pilot), its country, global,
// then the default. A flag that a release has not built yet is stored and shown, and does nothing until then.

import type { Env } from '../env';
import { billingLocked } from '../billing/config';

export type FlagScope = 'global' | 'stage' | 'country' | 'company';
export type Risk = 'low' | 'medium' | 'high' | 'highest';
export const STAGES = ['internal', 'pilot'] as const;
export type Stage = (typeof STAGES)[number];

export interface FlagDef {
  label: string;
  description: string;
  /** Allowed values; the first is the default. */
  values: readonly string[];
  scopes: readonly FlagScope[];
  risk: Risk;
  /** Part of the enforcement the kill switch turns off (back to the default). */
  enforcement: boolean;
  /** When the flag starts to act. */
  release: string;
  /** Set elsewhere, never through the flags API (for example by the legal review record). */
  managedBy?: string;
  /** Another flag that must have a value before this one may leave its default. */
  requires?: { key: string; value: string; message: string };
}

const ONOFF = ['off', 'on'] as const;

/** The modules a company can have switched off (on by default, so nothing changes until a platform admin acts). */
export const MODULES = {
  maintenance: { label: 'Maintenance', enforcedFrom: 'R2' },
  whs: { label: 'Health and Safety (WHS)', enforcedFrom: 'R2' },
  tasks: { label: 'Projects and Tasks', enforcedFrom: 'R4' },
  crm: { label: 'Sales and CRM', enforcedFrom: 'R4' },
  finance: { label: 'Finance and Accounting', enforcedFrom: 'R4' },
  products: { label: 'Products and Engineering', enforcedFrom: 'R4' },
  procurement: { label: 'Procurement', enforcedFrom: 'R4' },
  inventory: { label: 'Inventory', enforcedFrom: 'R4' },
  manufacturing: { label: 'Manufacturing', enforcedFrom: 'R4' },
  quality: { label: 'Quality', enforcedFrom: 'R4' },
  supply_chain: { label: 'Supply chain', enforcedFrom: 'R4' },
} as const;
export type ModuleKey = keyof typeof MODULES;
export const moduleFlag = (m: ModuleKey) => `module_${m}_enabled`;

const BASE: Record<string, FlagDef> = {
  company_registration_required: {
    label: 'Company registration required',
    description: 'New people must register a company or join one by invitation before they can use the tools.',
    values: ONOFF,
    scopes: ['global', 'stage', 'country'],
    risk: 'medium',
    enforcement: true,
    release: 'R6',
  },
  registry_verification_enabled: {
    label: 'Automatic registry checks',
    description: 'Companies are checked against their country’s official register (where a provider exists).',
    values: ONOFF,
    scopes: ['global', 'country'],
    risk: 'low',
    enforcement: false,
    release: 'R6',
  },
  verification_enforcement: {
    label: 'Verification enforcement',
    description: 'Companies that are not verified can use onboarding, verification and support only.',
    values: ONOFF,
    scopes: ['global', 'stage', 'country', 'company'],
    risk: 'high',
    enforcement: true,
    release: 'R6',
  },
  scheduled_reverification: {
    label: 'Scheduled re-verification',
    description: 'Verified companies are checked again on a schedule (30 days by default).',
    values: ONOFF,
    scopes: ['global'],
    risk: 'low',
    enforcement: false,
    release: 'R6',
  },
  international_registration: {
    label: 'Registration outside Australia',
    description: 'Companies can register in any country, with that country’s registration numbers (verified by hand where no register can be asked).',
    values: ONOFF,
    scopes: ['global', 'country'],
    risk: 'medium',
    enforcement: false,
    release: 'R6',
  },
  self_service_password_reset: {
    label: 'Forgotten password',
    description: 'People can reset a forgotten password with a one-hour link sent to their proven email address.',
    values: ONOFF,
    scopes: ['global'],
    risk: 'low',
    enforcement: false,
    release: 'R7',
  },
  new_ui_enabled: {
    label: 'New UI (design system)',
    description: 'The new look of the website and BIZOMAT ERP: one spacing and type scale, buttons and links with depth and motion, skeleton loading, the density choice. Off: everything looks as before.',
    values: ONOFF,
    scopes: ['global', 'stage', 'company'],
    risk: 'low',
    enforcement: false,
    release: 'UI',
  },
  company_members_v2: {
    label: 'Company members, roles and ownership transfer',
    description: 'The Members page and the central permission service: module access, own and team scopes, sensitive fields, suspension, invitations with modules and a message, and ownership transfer the new owner accepts.',
    values: ONOFF,
    scopes: ['global', 'stage', 'company'],
    risk: 'high',
    enforcement: true,
    release: 'Members',
  },
  evidence_scanning: {
    label: 'Malware scan of verification documents',
    description: 'Uploaded verification documents are handed to the ClamAV scanner on CAD Automation’s Machine. Documents can be opened or accepted only after a clean scan, whether this is on or not.',
    values: ONOFF,
    scopes: ['global'],
    risk: 'low',
    enforcement: false,
    release: 'R6',
  },
  join_requests: {
    label: 'Request to join',
    description: 'Someone registering a company that already exists can ask its owner to join it instead.',
    values: ONOFF,
    scopes: ['global', 'country'],
    risk: 'low',
    enforcement: false,
    release: 'R6',
  },
  migration_notifications: {
    label: 'Migration notifications',
    description: 'Existing users are told, in the app and by email, how to register or join a company. The recipient list is shown for approval first.',
    values: ONOFF,
    scopes: ['global', 'stage', 'company'],
    risk: 'medium',
    enforcement: true,
    release: 'R7',
  },
  compliance_countdown: {
    label: 'Compliance countdown',
    description: 'Deadline timers start for users who have not registered or joined a company (only after recorded delivery of the notice).',
    values: ONOFF,
    scopes: ['global', 'stage', 'company'],
    risk: 'high',
    enforcement: true,
    release: 'R7',
  },
  auto_suspension: {
    label: 'Automatic suspension',
    description: 'Accounts past their deadline are suspended (they can still sign in to comply, accept an invitation, contact support and export their data).',
    values: ONOFF,
    scopes: ['global', 'stage'],
    risk: 'high',
    enforcement: true,
    release: 'R7',
  },
  legal_review_completed: {
    label: 'Privacy and legal review recorded',
    description: 'Set when the privacy and legal review is recorded (reviewer, date, jurisdictions, retention periods). Required before automatic deletion.',
    values: ONOFF,
    scopes: ['global'],
    risk: 'high',
    enforcement: false,
    release: 'R7',
    managedBy: 'the privacy and legal review record (R7)',
  },
  auto_deletion: {
    label: 'Automatic deletion',
    description: 'Accounts past the grace period are deleted or anonymised, in reviewed batches. Shared company data is never deleted.',
    values: ONOFF,
    scopes: ['global'],
    risk: 'highest',
    enforcement: true,
    release: 'R7',
    requires: { key: 'legal_review_completed', value: 'on', message: 'Automatic deletion stays off until a privacy and legal review is recorded.' },
  },
  individual_accounts_policy: {
    label: 'People without a registered business',
    description: 'ALLOW_PERSONAL_WORKSPACE: an "Unverified – Personal" workspace. INVITATION_ONLY: sign in only to accept an invitation or register. REQUIRE_COMPANY: the compliance rules apply.',
    values: ['ALLOW_PERSONAL_WORKSPACE', 'INVITATION_ONLY', 'REQUIRE_COMPANY'],
    scopes: ['global'],
    risk: 'high',
    enforcement: true,
    release: 'R7',
  },
  billing_mode: {
    label: 'Billing mode',
    description: 'free: BIZOMAT is free for everyone. paid is refused while the server’s billing lock (BIZOMAT_BILLING_LOCK) is set.',
    values: ['free', 'paid'],
    scopes: ['global'],
    risk: 'highest',
    enforcement: true,
    release: 'R1',
  },
};

for (const [m, d] of Object.entries(MODULES)) {
  BASE[moduleFlag(m as ModuleKey)] = {
    label: `Module: ${d.label}`,
    description: `Whether ${d.label} is available to a company. Switched off, its pages and API answer that the module is off for that company. Acts from ${d.enforcedFrom}.`,
    values: ['on', 'off'],
    scopes: ['global', 'stage', 'company'],
    risk: 'medium',
    enforcement: false,
    release: d.enforcedFrom,
  };
}

export const FLAGS: Readonly<Record<string, FlagDef>> = BASE;
export const isFlag = (key: string): key is string => Object.hasOwn(FLAGS, key);
export const defaultOf = (key: string) => FLAGS[key].values[0];

/** High and highest risk changes need a recent re-authentication and the flag's key typed to confirm. */
export const needsConfirmation = (key: string) => FLAGS[key].risk === 'high' || FLAGS[key].risk === 'highest';

export interface FlagContext {
  companyId?: string | null;
  country?: string | null;
}

interface Row {
  scope: FlagScope;
  scope_id: string;
  value: string;
}

/** The company's rollout stage, or null (the general stage). */
export async function stageOf(db: D1Database, companyId: string): Promise<Stage | null> {
  const r = await db.prepare('SELECT stage FROM company_rollout WHERE company_id = ?').bind(companyId).first<{ stage: Stage }>();
  return r?.stage ?? null;
}

/** A registered company's country (personal and example companies have none). */
async function countryOf(db: D1Database, companyId: string): Promise<string | null> {
  const r = await db.prepare('SELECT country FROM co_companies WHERE id = ?').bind(companyId).first<{ country: string }>();
  return r?.country ?? null;
}

/** Picks the value for a context from a flag's stored rows (pure: used by flagValue and by the console). */
export function resolve(key: string, rows: Row[], ctx: { companyId?: string | null; stage?: Stage | null; country?: string | null }): { value: string; from: FlagScope | 'default' } {
  const def = FLAGS[key];
  const ok = (r: Row | undefined) => !!r && def.values.includes(r.value) && def.scopes.includes(r.scope);
  const pick = (scope: FlagScope, id: string | null | undefined) => (id === null || id === undefined ? undefined : rows.find((r) => r.scope === scope && r.scope_id === id));
  for (const [scope, id] of [
    ['company', ctx.companyId],
    ['stage', ctx.stage],
    ['country', ctx.country],
    ['global', ''],
  ] as [FlagScope, string | null | undefined][]) {
    const r = pick(scope, id);
    if (ok(r)) return { value: r!.value, from: scope };
  }
  return { value: def.values[0], from: 'default' };
}

/** A flag's value for a context, on the server. Unknown keys throw: a typo must never read as "off". */
export async function flagValue(db: D1Database, key: string, ctx: FlagContext = {}): Promise<string> {
  if (!isFlag(key)) throw new Error(`Unknown feature flag: ${key}`);
  let rows: Row[];
  try {
    rows = (await db.prepare('SELECT scope, scope_id, value FROM feature_flags WHERE key = ?').bind(key).all<Row>()).results;
  } catch {
    // Before migration 0029 (an older database): every flag has its default.
    return defaultOf(key);
  }
  if (!rows.length) return defaultOf(key);
  const companyId = ctx.companyId ?? null;
  const stage = companyId ? await stageOf(db, companyId) : null;
  const country = ctx.country ?? (companyId ? await countryOf(db, companyId) : null);
  return resolve(key, rows, { companyId, stage, country }).value;
}

export async function flagOn(db: D1Database, key: string, ctx: FlagContext = {}): Promise<boolean> {
  return (await flagValue(db, key, ctx)) === 'on';
}

/** The billing mode in force: always free while the server's billing lock is set, whatever is stored. */
export async function billingMode(env: Env): Promise<'free' | 'paid'> {
  if (billingLocked(env)) return 'free';
  return (await flagValue(env.DB, 'billing_mode')) === 'paid' ? 'paid' : 'free';
}

/** Whether a module is available to a company (on unless a platform admin switched it off). */
export async function moduleEnabled(db: D1Database, m: ModuleKey, companyId: string): Promise<boolean> {
  return (await flagValue(db, moduleFlag(m), { companyId })) !== 'off';
}
