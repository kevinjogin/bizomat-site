// Shared DTOs between the Worker API and the React client.

export type WorkspaceRole = 'owner' | 'admin' | 'project_manager' | 'member' | 'viewer' | 'guest';
export const WORKSPACE_ROLES: WorkspaceRole[] = ['owner', 'admin', 'project_manager', 'member', 'viewer', 'guest'];
export type MemberStatus = 'active' | 'suspended';
export type BoardRole = 'owner' | 'editor' | 'viewer';
export type BoardAccess = 'view' | 'edit' | 'admin';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  timezone: string;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  preferences: Record<string, unknown>;
  /** The account must choose a new password before anything else (founder reset or security reset). */
  passwordResetRequired?: boolean;
}

export interface MemberDTO {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: WorkspaceRole;
  status?: MemberStatus;
}

export interface WorkspaceDTO {
  id: string;
  name: string;
  description: string;
  color: string;
  logoUrl: string | null;
  role: WorkspaceRole;
  createdAt: number;
}

export interface BoardDTO {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  kind: 'board' | 'personal' | 'template';
  visibility: 'workspace' | 'private';
  icon: string;
  settings: BoardSettings;
  position: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
  folderId: string | null;
  access?: BoardAccess;
  itemCount?: number;
  /** ISO 4217 code set on the project, or null to inherit the organisation's. */
  currency?: string | null;
  startDate?: string | null;
  managerId?: string | null;
  /** The caller's capabilities on this project (computed by the server). */
  caps?: import('./permissions').ProjectCaps;
}

export interface BoardSettings {
  statusColumnId?: string;
  dateColumnId?: string;
  personColumnId?: string;
  timelineColumnId?: string;
  defaultGroupId?: string;
  defaultValues?: Record<string, unknown>;
  [k: string]: unknown;
}

export interface GroupDTO {
  id: string;
  boardId: string;
  name: string;
  color: string;
  position: number;
  collapsed: boolean;
  archivedAt: number | null;
  /** Plain text (paragraphs and "- " bullets, rendered as text, never as HTML); '' when there is none. */
  description: string;
}

export interface ColumnDTO {
  id: string;
  boardId: string;
  title: string;
  type: string;
  settings: Record<string, any>;
  position: number;
  width: number;
  hidden: boolean;
  required: boolean;
  description: string;
}

export interface ItemDTO {
  id: string;
  boardId: string;
  groupId: string;
  parentItemId: string | null;
  name: string;
  description: string;
  position: number;
  values: Record<string, unknown>;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
  archivedAt: number | null;
  /** Permanent task key (PREFIX-0001), never reused or changed. */
  key?: string | null;
  subitemCount?: number;
  updateCount?: number;
}

export interface ViewDTO {
  id: string;
  boardId: string;
  name: string;
  type: ViewType;
  settings: ViewSettings;
  position: number;
  ownerId: string | null;
}

export type ViewType =
  | 'table'
  | 'kanban'
  | 'calendar'
  | 'timeline'
  | 'chart'
  | 'workload'
  | 'form'
  | 'map'
  | 'files';

export interface ViewSettings {
  filter?: import('./filters').FilterGroup;
  sort?: { field: string; dir: 'asc' | 'desc' }[];
  groupBy?: string | null; // 'group' | columnId
  hiddenColumns?: string[];
  columnWidths?: Record<string, number>;
  kanbanColumnId?: string;
  calendarColumnId?: string;
  calendarMode?: 'month' | 'week' | 'day';
  timelineColumnId?: string;
  chartType?: 'bar' | 'pie' | 'line';
  chartGroupBy?: string;
  chartMetric?: { kind: 'count' } | { kind: 'sum' | 'avg'; columnId: string };
  workloadPersonColumnId?: string;
  workloadEffortColumnId?: string;
  formColumns?: string[];
  formTitle?: string;
  formDescription?: string;
  formGroupId?: string;
  mapColumnId?: string;
  [k: string]: unknown;
}

export interface BoardBundle {
  board: BoardDTO;
  groups: GroupDTO[];
  columns: ColumnDTO[];
  items: ItemDTO[];
  views: ViewDTO[];
  members: MemberDTO[];
  boardMembers: { userId: string; role: BoardRole }[];
  /** Each listed member's access to this project: 'manage' | 'edit' | 'view' | 'none'. */
  memberAccess?: Record<string, 'manage' | 'edit' | 'view' | 'none'>;
  finance?: FinanceContextDTO;
}

export interface FinanceContextDTO {
  /** The organisation's default currency, or null when an administrator has not chosen one. */
  workspaceCurrency: string | null;
  /** The project's own currency, or null when it inherits. */
  boardCurrency: string | null;
  /** The currency amounts on this project are in, or null when none is configured. */
  effectiveCurrency: string | null;
  /** Columns hidden from the caller because they hold financial data the caller may not view. */
  hiddenColumns: number;
}

export interface UpdateDTO {
  id: string;
  itemId: string;
  parentUpdateId: string | null;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: number;
  editedAt: number | null;
  replies?: UpdateDTO[];
}

export interface ActivityDTO {
  id: string;
  boardId: string | null;
  itemId: string | null;
  actorId: string | null;
  actorName: string | null;
  action: string;
  columnId: string | null;
  oldValue: unknown;
  newValue: unknown;
  createdAt: number;
}

export interface AttachmentDTO {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  url: string;
  itemId: string | null;
  documentId: string | null;
  uploaderId: string;
  createdAt: number;
}

export interface NotificationDTO {
  id: string;
  workspaceId: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  entityType: string | null;
  entityId: string | null;
  actorId: string | null;
  readAt: number | null;
  createdAt: number;
}

export const NOTIFICATION_TYPES = [
  'assignment',
  'mention',
  'comment',
  'reply',
  'status_change',
  'due_soon',
  'overdue',
  'automation',
  'invitation',
  'invitation_accepted',
  'project_membership',
  'permission_change',
  'report_generated',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface AppConfigDTO {
  appName: string;
  environment: string;
  allowSignup: boolean;
  providers: { id: string; name: string; enabled: boolean }[];
}

export interface FolderDTO {
  id: string;
  scope: 'documents' | 'boards' | 'dashboards';
  parentId: string | null;
  name: string;
  color: string;
  position: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}
