// CRM roles and permissions, in one place. The server enforces them (src/worker/crm/access.ts); the client only uses
// them to decide what to show. Hiding a button is never the control.
//
// Six roles per CRM organisation. Owner and Administrator always have every permission; the four other roles start
// from the defaults below, and an owner or administrator can change them per module and action (crm_role_permissions).
//
// Record modules (leads, contacts, companies, deals, activities) have scoped actions:
//   'all'  every record of the organisation
//   'own'  records the person owns (owner_id), or created while unowned; for activities, assigned to or created by them
//   'none' nothing

export const CRM_ROLES = ['owner', 'admin', 'manager', 'sales', 'member', 'viewer'] as const;
export type CrmRole = (typeof CRM_ROLES)[number];

/** Roles whose permissions can be changed (owner and admin are fixed). */
export const CONFIGURABLE_ROLES = ['manager', 'sales', 'member', 'viewer'] as const;
export type ConfigurableRole = (typeof CONFIGURABLE_ROLES)[number];

/** Roles an invitation can give (ownership only moves by transfer). */
export const INVITABLE_ROLES = ['admin', 'manager', 'sales', 'member', 'viewer'] as const;

export const CRM_ROLE_LABELS: Record<CrmRole, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  manager: 'Manager',
  sales: 'Sales Executive',
  member: 'Member',
  viewer: 'Viewer',
};

export const CRM_ROLE_DESCRIPTIONS: Record<CrmRole, string> = {
  owner: 'Complete control of the organisation, including ownership and deletion.',
  admin: 'Manages members, settings, permissions and all CRM data.',
  manager: 'Manages teams, pipelines, fields, automations and all records.',
  sales: 'Works on the customers, leads and deals assigned to them.',
  member: 'Uses the CRM functions the organisation allows.',
  viewer: 'Read-only access.',
};

export const CRM_ROLE_RANK: Record<CrmRole, number> = { viewer: 0, member: 1, sales: 2, manager: 3, admin: 4, owner: 5 };

export type Scope = 'all' | 'own' | 'none';
export const SCOPES: Scope[] = ['all', 'own', 'none'];

export const RECORD_MODULES = ['leads', 'contacts', 'companies', 'deals', 'activities'] as const;
export type RecordModule = (typeof RECORD_MODULES)[number];

export interface RecordPerms {
  view: Scope;
  create: boolean;
  edit: Scope;
  delete: Scope;
  export: boolean;
  import: boolean;
}

export interface CrmPerms {
  leads: RecordPerms;
  contacts: RecordPerms;
  companies: RecordPerms;
  deals: RecordPerms;
  activities: RecordPerms;
  reports: { view: boolean; export: boolean };
  automations: { view: boolean; manage: boolean };
  /** Pipelines and stages, custom fields, tags, lists (statuses, sources, activity types), products, shared templates. */
  settings: { manage: boolean };
  /** invite: send invitations; teams: create and staff teams; manage: change roles and remove members. */
  members: { invite: boolean; teams: boolean; manage: boolean };
}

export type CrmModule = keyof CrmPerms;
export const CRM_MODULES: CrmModule[] = ['leads', 'contacts', 'companies', 'deals', 'activities', 'reports', 'automations', 'settings', 'members'];

export const MODULE_LABELS: Record<CrmModule, string> = {
  leads: 'Leads',
  contacts: 'Contacts',
  companies: 'Companies',
  deals: 'Deals',
  activities: 'Activities and tasks',
  reports: 'Reports and dashboard',
  automations: 'Automations',
  settings: 'CRM settings',
  members: 'Team and members',
};

export const ACTION_LABELS: Record<string, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  export: 'Export',
  import: 'Import',
  manage: 'Manage',
  invite: 'Invite',
  teams: 'Manage teams',
};

const full: RecordPerms = { view: 'all', create: true, edit: 'all', delete: 'all', export: true, import: true };
const readOnly: RecordPerms = { view: 'all', create: false, edit: 'none', delete: 'none', export: false, import: false };

function allPerms(): CrmPerms {
  return {
    leads: { ...full },
    contacts: { ...full },
    companies: { ...full },
    deals: { ...full },
    activities: { ...full },
    reports: { view: true, export: true },
    automations: { view: true, manage: true },
    settings: { manage: true },
    members: { invite: true, teams: true, manage: true },
  };
}

export const DEFAULT_PERMS: Record<CrmRole, CrmPerms> = {
  owner: allPerms(),
  admin: allPerms(),
  manager: { ...allPerms(), members: { invite: true, teams: true, manage: false } },
  sales: {
    leads: { view: 'all', create: true, edit: 'own', delete: 'own', export: false, import: false },
    contacts: { view: 'all', create: true, edit: 'own', delete: 'own', export: false, import: false },
    companies: { view: 'all', create: true, edit: 'own', delete: 'own', export: false, import: false },
    deals: { view: 'all', create: true, edit: 'own', delete: 'own', export: false, import: false },
    activities: { view: 'all', create: true, edit: 'own', delete: 'own', export: false, import: false },
    reports: { view: true, export: false },
    automations: { view: true, manage: false },
    settings: { manage: false },
    members: { invite: false, teams: false, manage: false },
  },
  member: {
    leads: { view: 'all', create: true, edit: 'own', delete: 'none', export: false, import: false },
    contacts: { view: 'all', create: true, edit: 'own', delete: 'none', export: false, import: false },
    companies: { view: 'all', create: true, edit: 'own', delete: 'none', export: false, import: false },
    deals: { view: 'all', create: true, edit: 'own', delete: 'none', export: false, import: false },
    activities: { view: 'all', create: true, edit: 'own', delete: 'own', export: false, import: false },
    reports: { view: true, export: false },
    automations: { view: false, manage: false },
    settings: { manage: false },
    members: { invite: false, teams: false, manage: false },
  },
  viewer: {
    leads: { ...readOnly },
    contacts: { ...readOnly },
    companies: { ...readOnly },
    deals: { ...readOnly },
    activities: { ...readOnly },
    reports: { view: true, export: false },
    automations: { view: false, manage: false },
    settings: { manage: false },
    members: { invite: false, teams: false, manage: false },
  },
};

/** The actions of a module, with their kind: a scope (all/own/none) or on/off. */
export function moduleActions(module: CrmModule): { action: string; kind: 'scope' | 'bool' }[] {
  if ((RECORD_MODULES as readonly string[]).includes(module)) {
    return [
      { action: 'view', kind: 'scope' },
      { action: 'create', kind: 'bool' },
      { action: 'edit', kind: 'scope' },
      { action: 'delete', kind: 'scope' },
      { action: 'export', kind: 'bool' },
      ...(module === 'activities' || module === 'deals' ? [] : [{ action: 'import', kind: 'bool' as const }]),
    ];
  }
  return Object.keys(DEFAULT_PERMS.owner[module]).map((action) => ({ action, kind: 'bool' as const }));
}

/**
 * The effective permissions of a role, from the defaults and the organisation's overrides
 * ({ module: { action: value } }). Unknown modules, actions and values are ignored, so a stored override can never
 * widen what the code defines. Owner and admin ignore overrides.
 */
export function resolvePerms(role: CrmRole, overrides: Partial<Record<string, Record<string, unknown>>> = {}): CrmPerms {
  const base = structuredClone(DEFAULT_PERMS[role]);
  if (role === 'owner' || role === 'admin') return base;
  for (const module of CRM_MODULES) {
    const o = overrides[module];
    if (!o || typeof o !== 'object') continue;
    for (const { action, kind } of moduleActions(module)) {
      const v = o[action];
      const target = base[module] as unknown as Record<string, unknown>;
      if (kind === 'scope' && (v === 'all' || v === 'own' || v === 'none')) target[action] = v;
      if (kind === 'bool' && typeof v === 'boolean') target[action] = v;
    }
  }
  // Viewing is the floor of every other record action: edit 'all' with view 'own' would reach records one cannot see.
  for (const m of RECORD_MODULES) {
    const p = base[m];
    const rank = { none: 0, own: 1, all: 2 } as const;
    if (rank[p.edit] > rank[p.view]) p.edit = p.view;
    if (rank[p.delete] > rank[p.view]) p.delete = p.view;
    if (p.view === 'none') {
      p.create = false;
      p.export = false;
      p.import = false;
    }
  }
  return base;
}

export function roleAtLeast(role: CrmRole, min: CrmRole): boolean {
  return CRM_ROLE_RANK[role] >= CRM_ROLE_RANK[min];
}
