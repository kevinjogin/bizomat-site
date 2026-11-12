// The permission model, in one place. The server enforces it (src/worker/services/access.ts); the client only uses it
// to decide what to show. Hiding a button is never the control.
//
// Three layers:
//   1. Organisation role (workspace_members.role): owner, admin, project_manager, member, viewer, guest.
//   2. Project access (a project is a board): a level (manage, edit, view, or none) and capabilities. The level comes
//      from the person's board role (board_members) or, without one, from the organisation role and the board's
//      visibility. Capabilities default from the level and can be switched on or off per person (board_permissions).
//   3. Task access (item_permissions): rights on one task and its subitems, without access to the rest of the project.

import type { WorkspaceRole } from './types';

export type ProjectLevel = 'manage' | 'edit' | 'view';

export interface ProjectCaps {
  level: ProjectLevel;
  viewFinance: boolean;
  editFinance: boolean;
  manageMembers: boolean;
  createTasks: boolean;
  assignTasks: boolean;
  deleteTasks: boolean;
  generateReports: boolean;
}

export const CAPABILITY_KEYS = ['viewFinance', 'editFinance', 'manageMembers', 'createTasks', 'assignTasks', 'deleteTasks', 'generateReports'] as const;
export type CapabilityKey = (typeof CAPABILITY_KEYS)[number];

/** Column names in board_permissions, by capability. */
export const CAPABILITY_COLUMNS: Record<CapabilityKey, string> = {
  viewFinance: 'view_finance',
  editFinance: 'edit_finance',
  manageMembers: 'manage_members',
  createTasks: 'create_tasks',
  assignTasks: 'assign_tasks',
  deleteTasks: 'delete_tasks',
  generateReports: 'generate_reports',
};

export const CAPABILITY_LABELS: Record<CapabilityKey, string> = {
  viewFinance: 'View financial data',
  editFinance: 'Edit financial data',
  manageMembers: 'Manage project members',
  createTasks: 'Create tasks',
  assignTasks: 'Assign tasks',
  deleteTasks: 'Delete tasks',
  generateReports: 'Generate reports',
};

/** Who sees financial columns by default: everyone with access (the behaviour before finance settings existed). */
export type FinanceVisibility = 'all' | 'editors' | 'managers';

export const ROLE_RANK: Record<WorkspaceRole, number> = { guest: 0, viewer: 1, member: 2, project_manager: 3, admin: 4, owner: 5 };

export const ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  project_manager: 'Project manager',
  member: 'Member',
  viewer: 'Viewer',
  guest: 'Guest / contractor',
};

export const ROLE_HELP: Record<WorkspaceRole, string> = {
  owner: 'Full control: organisation settings, members, finance settings, every project and report',
  admin: 'Manage members and settings, create and manage every project, see every report',
  project_manager: 'Create projects, manage the projects they are given, allocate tasks and generate project reports',
  member: 'Work on the organisation’s shared projects: update tasks, comment and upload files',
  viewer: 'Read and comment on the organisation’s shared projects',
  guest: 'Sees only the projects or tasks shared with them; nothing organisation-wide',
};

export function isOrgAdmin(role: WorkspaceRole | null | undefined): boolean {
  return role === 'owner' || role === 'admin';
}

const RANK: Record<ProjectLevel, number> = { view: 1, edit: 2, manage: 3 };

export function levelAtLeast(level: ProjectLevel, min: ProjectLevel): boolean {
  return RANK[level] >= RANK[min];
}

/** Default capabilities for a project access level. */
export function defaultCaps(level: ProjectLevel, role: WorkspaceRole, financeVisibility: FinanceVisibility = 'all'): ProjectCaps {
  const edit = level !== 'view';
  const manage = level === 'manage';
  const viewFinance = financeVisibility === 'all' ? true : financeVisibility === 'editors' ? edit : manage;
  return {
    level,
    viewFinance,
    editFinance: edit && viewFinance,
    manageMembers: manage,
    createTasks: edit,
    assignTasks: edit,
    deleteTasks: edit,
    generateReports: manage || (edit && role === 'project_manager'),
  };
}

export type CapabilityOverrides = Partial<Record<CapabilityKey, boolean | null>>;

/**
 * Apply per-person overrides to the defaults. Rights that change data need edit access; finance editing needs finance
 * viewing. Organisation owners and admins always have every capability.
 */
export function resolveCaps(level: ProjectLevel, role: WorkspaceRole, overrides: CapabilityOverrides | null, financeVisibility: FinanceVisibility = 'all'): ProjectCaps {
  if (isOrgAdmin(role)) return { level: 'manage', viewFinance: true, editFinance: true, manageMembers: true, createTasks: true, assignTasks: true, deleteTasks: true, generateReports: true };
  const caps = defaultCaps(level, role, financeVisibility);
  for (const k of CAPABILITY_KEYS) {
    const v = overrides?.[k];
    if (v === true || v === false) caps[k] = v;
  }
  if (level === 'view') {
    caps.editFinance = false;
    caps.createTasks = false;
    caps.assignTasks = false;
    caps.deleteTasks = false;
  }
  if (!caps.viewFinance) caps.editFinance = false;
  if (level === 'manage') caps.manageMembers = true;
  return caps;
}

export interface TaskCaps {
  view: boolean;
  edit: boolean;
  updateStatus: boolean;
  comment: boolean;
  upload: boolean;
  manageAssignments: boolean;
  viewFinance: boolean;
  editFinance: boolean;
  delete: boolean;
  /** Where the rights come from. 'task' means the person sees this task only, not the project. */
  via: 'project' | 'task' | 'both';
}

export interface TaskGrant {
  canEdit: boolean;
  canUpdateStatus: boolean;
  canComment: boolean;
  canUpload: boolean;
  canManageAssignments: boolean;
  canViewFinance: boolean;
}

export const TASK_GRANT_LABELS: Record<keyof TaskGrant, string> = {
  canEdit: 'Edit task',
  canUpdateStatus: 'Update status',
  canComment: 'Add comments',
  canUpload: 'Upload attachments',
  canManageAssignments: 'Manage assignments',
  canViewFinance: 'View task finances',
};

export function taskCapsFromProject(p: ProjectCaps): TaskCaps {
  const edit = p.level !== 'view';
  return { view: true, edit, updateStatus: edit, comment: true, upload: edit, manageAssignments: p.assignTasks, viewFinance: p.viewFinance, editFinance: p.editFinance, delete: p.deleteTasks, via: 'project' };
}

export function taskCapsFromGrant(g: TaskGrant): TaskCaps {
  return {
    view: true,
    edit: g.canEdit,
    updateStatus: g.canUpdateStatus || g.canEdit,
    comment: g.canComment,
    upload: g.canUpload,
    manageAssignments: g.canManageAssignments,
    viewFinance: g.canViewFinance,
    editFinance: false,
    delete: false,
    via: 'task',
  };
}

/** The union of the rights from the project and from a task grant. */
export function mergeTaskCaps(a: TaskCaps | null, b: TaskCaps | null): TaskCaps | null {
  if (!a) return b;
  if (!b) return a;
  return {
    view: true,
    edit: a.edit || b.edit,
    updateStatus: a.updateStatus || b.updateStatus,
    comment: a.comment || b.comment,
    upload: a.upload || b.upload,
    manageAssignments: a.manageAssignments || b.manageAssignments,
    viewFinance: a.viewFinance || b.viewFinance,
    editFinance: a.editFinance || b.editFinance,
    delete: a.delete || b.delete,
    via: 'both',
  };
}

/** True for a column that holds money: every currency column, and number columns marked as financial. */
export function isFinancialColumn(col: { type: string; settings?: Record<string, unknown> | null }): boolean {
  return col.type === 'currency' || (col.type === 'number' && col.settings?.financial === true);
}
