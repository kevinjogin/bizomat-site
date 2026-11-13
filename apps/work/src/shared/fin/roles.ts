// BIZOMAT Finance roles and permissions. The server enforces every permission (src/worker/fin/access.ts); the screens
// only hide what a person cannot use. Owners and administrators always have every permission; the other four roles
// start from these defaults, which owners and administrators can change per module and action. A stored change can
// never widen what the code allows (resolvePerms), and editing or deleting never reaches beyond viewing.

export const FIN_ROLES = ['owner', 'admin', 'accountant', 'finance_manager', 'contributor', 'viewer'] as const;
export type FinRole = (typeof FIN_ROLES)[number];
export const INVITABLE_ROLES = ['admin', 'accountant', 'finance_manager', 'contributor', 'viewer'] as const;
export type InvitableRole = (typeof INVITABLE_ROLES)[number];
export const CONFIGURABLE_ROLES = ['accountant', 'finance_manager', 'contributor', 'viewer'] as const;

export const FIN_ROLE_LABELS: Record<FinRole, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  accountant: 'Accountant',
  finance_manager: 'Finance Manager',
  contributor: 'Contributor',
  viewer: 'Viewer',
};

export const FIN_ROLE_DESCRIPTIONS: Record<FinRole, string> = {
  owner: 'Complete control of the workspace, including ownership and deletion.',
  admin: 'Manages members, permissions, settings and every financial record.',
  accountant: 'Keeps the books: every record, the chart of accounts, tax codes, journals and the period lock.',
  finance_manager: 'Runs day-to-day finance: transactions, invoices, bills, approvals, budgets and reports.',
  contributor: 'Adds transactions, receipts, bills and expense claims, for approval where required.',
  viewer: 'Reads the records and reports the workspace allows, and changes nothing.',
};

export type WorkspaceKind = 'personal' | 'household' | 'business';
export const WORKSPACE_KINDS: WorkspaceKind[] = ['personal', 'household', 'business'];
export const WORKSPACE_KIND_LABELS: Record<WorkspaceKind, string> = { personal: 'Personal', household: 'Household', business: 'Business' };

export type Scope = 'all' | 'own' | 'none';
export const SCOPES: Scope[] = ['all', 'own', 'none'];

/** Modules holding records someone creates: who may see and change which of them. */
export const RECORD_MODULES = ['banking', 'sales', 'purchases', 'contacts', 'documents'] as const;
export type RecordModule = (typeof RECORD_MODULES)[number];

export interface RecordPerms {
  view: Scope;
  create: boolean;
  edit: Scope;
  delete: Scope;
  /** Post, approve, void and reverse: anything that writes to the ledger on someone's behalf. */
  approve: boolean;
  import: boolean;
  export: boolean;
}

export interface FinPerms {
  banking: RecordPerms;
  sales: RecordPerms;
  purchases: RecordPerms;
  contacts: RecordPerms;
  documents: RecordPerms;
  /** The chart of accounts, tax codes and tracking (manage), manual journals (journal) and the period lock (lock). */
  accounting: { view: boolean; manage: boolean; journal: boolean; lock: boolean };
  reports: { view: boolean; export: boolean };
  budgets: { view: boolean; manage: boolean };
  settings: { manage: boolean };
  members: { invite: boolean; manage: boolean };
}

export type FinModule = keyof FinPerms;
export const FIN_MODULES: FinModule[] = ['banking', 'sales', 'purchases', 'contacts', 'documents', 'accounting', 'reports', 'budgets', 'settings', 'members'];

export const MODULE_LABELS: Record<FinModule, string> = {
  banking: 'Money accounts and transactions',
  sales: 'Sales invoices',
  purchases: 'Bills, purchase orders and expense claims',
  contacts: 'Customers and suppliers',
  documents: 'Receipts and documents',
  accounting: 'Chart of accounts, tax codes and journals',
  reports: 'Reports and dashboard',
  budgets: 'Budgets and goals',
  settings: 'Workspace settings',
  members: 'Members and invitations',
};

export const ACTION_LABELS: Record<string, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  approve: 'Approve and post',
  import: 'Import',
  export: 'Export',
  manage: 'Manage',
  journal: 'Manual journals',
  lock: 'Lock periods',
  invite: 'Invite',
};

const SCOPED = new Set(['view', 'edit', 'delete']);

export function moduleActions(m: FinModule): string[] {
  if ((RECORD_MODULES as readonly string[]).includes(m)) return ['view', 'create', 'edit', 'delete', 'approve', 'import', 'export'];
  return Object.keys(DEFAULT_PERMS.owner[m]);
}

/** View, edit and delete take all, own or none in the record modules; everything else is on or off. */
export function isScopedAction(action: string, module: string): boolean {
  return SCOPED.has(action) && (RECORD_MODULES as readonly string[]).includes(module);
}

const rec = (o: Partial<RecordPerms> = {}): RecordPerms => ({ view: 'all', create: true, edit: 'all', delete: 'all', approve: true, import: true, export: true, ...o });
const readOnly = (): RecordPerms => ({ view: 'all', create: false, edit: 'none', delete: 'none', approve: false, import: false, export: false });

function everything(): FinPerms {
  return {
    banking: rec(),
    sales: rec(),
    purchases: rec(),
    contacts: rec(),
    documents: rec(),
    accounting: { view: true, manage: true, journal: true, lock: true },
    reports: { view: true, export: true },
    budgets: { view: true, manage: true },
    settings: { manage: true },
    members: { invite: true, manage: true },
  };
}

/** The defaults for business workspaces. Household and personal workspaces share more (defaultPerms). */
export const DEFAULT_PERMS: Record<FinRole, FinPerms> = {
  owner: everything(),
  admin: everything(),
  accountant: {
    ...everything(),
    members: { invite: false, manage: false },
  },
  finance_manager: {
    ...everything(),
    accounting: { view: true, manage: false, journal: false, lock: false },
    settings: { manage: false },
    members: { invite: false, manage: false },
  },
  contributor: {
    banking: rec({ view: 'own', edit: 'own', delete: 'own', approve: false, import: false, export: false }),
    sales: rec({ view: 'own', edit: 'own', delete: 'own', approve: false, import: false, export: false }),
    purchases: rec({ view: 'own', edit: 'own', delete: 'own', approve: false, import: false, export: false }),
    contacts: rec({ view: 'all', edit: 'own', delete: 'none', approve: false, import: false, export: false }),
    documents: rec({ view: 'own', edit: 'own', delete: 'own', approve: false, import: false, export: false }),
    accounting: { view: false, manage: false, journal: false, lock: false },
    reports: { view: false, export: false },
    budgets: { view: false, manage: false },
    settings: { manage: false },
    members: { invite: false, manage: false },
  },
  viewer: {
    banking: readOnly(),
    sales: readOnly(),
    purchases: readOnly(),
    contacts: readOnly(),
    documents: readOnly(),
    accounting: { view: true, manage: false, journal: false, lock: false },
    reports: { view: true, export: false },
    budgets: { view: true, manage: false },
    settings: { manage: false },
    members: { invite: false, manage: false },
  },
};

/**
 * The defaults for a role in a kind of workspace. In personal and household workspaces the money is shared by the
 * people invited in: contributors see every transaction, the reports and the budgets (they still change only their
 * own records unless given more).
 */
export function defaultPerms(role: FinRole, kind: WorkspaceKind): FinPerms {
  const base: FinPerms = JSON.parse(JSON.stringify(DEFAULT_PERMS[role]));
  if (kind !== 'business' && role === 'contributor') {
    base.banking.view = 'all';
    base.documents.view = 'all';
    base.reports.view = true;
    base.budgets.view = true;
  }
  return base;
}

const rank: Record<Scope, number> = { none: 0, own: 1, all: 2 };
const narrower = (a: Scope, b: Scope): Scope => (rank[a] <= rank[b] ? a : b);

/** A role's effective permissions: the defaults, then the stored overrides (configurable roles only), clamped. */
export function resolvePerms(role: FinRole, overrides: Record<string, Record<string, unknown>>, kind: WorkspaceKind): FinPerms {
  const out = defaultPerms(role, kind);
  if (role === 'owner' || role === 'admin') return out;
  for (const m of FIN_MODULES) {
    const o = overrides[m];
    if (!o || typeof o !== 'object') continue;
    const target = out[m] as unknown as Record<string, unknown>;
    for (const action of moduleActions(m)) {
      const v = o[action];
      if (SCOPED.has(action) && (RECORD_MODULES as readonly string[]).includes(m)) {
        if (v === 'all' || v === 'own' || v === 'none') target[action] = v;
      } else if (typeof v === 'boolean') target[action] = v;
    }
  }
  for (const m of RECORD_MODULES) {
    const p = out[m];
    p.edit = narrower(p.edit, p.view);
    p.delete = narrower(p.delete, p.view);
    if (p.view === 'none') {
      p.create = false;
      p.approve = false;
      p.import = false;
      p.export = false;
    }
  }
  if (!out.reports.view) out.reports.export = false;
  if (!out.budgets.view) out.budgets.manage = false;
  if (!out.accounting.view) {
    out.accounting.manage = false;
    out.accounting.journal = false;
    out.accounting.lock = false;
  }
  return out;
}
