// The CRM API's data shapes, shared by the server and the client.

import type { CrmPerms, CrmRole } from './roles';
import type { OrgSettings } from './defaults';
import type { AutomationAction, AutomationCondition, TriggerConfig, TriggerType } from './automations';
import type { CrmEntity, CustomFieldType, ListQuery, RecordEntity } from './fields';

export interface CrmOrgSummary {
  id: string;
  name: string;
  industry: string;
  logoUrl: string | null;
  role: CrmRole;
  memberCount: number;
}

export interface CrmOrgDTO {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  description: string;
  currency: string;
  timezone: string;
  logoUrl: string | null;
  settings: OrgSettings;
  createdAt: number;
  /** The signed-in person's role and effective permissions in this organisation. */
  role: CrmRole;
  perms: CrmPerms;
  /** Whether BIZOMAT's email service is connected (invitations and notifications are emailed). */
  emailConnected: boolean;
}

export interface CrmMemberDTO {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: CrmRole;
  title: string;
  joinedAt: number;
  teamIds: string[];
}

export interface CrmInvitationDTO {
  id: string;
  email: string;
  role: CrmRole;
  status: 'pending' | 'accepted' | 'declined' | 'revoked' | 'expired';
  invitedBy: string | null;
  createdAt: number;
  expiresAt: number;
  message: string;
  emailDelivery?: string;
  /** Only in the answer to creating or resending: the link to share when email is not connected. */
  inviteUrl?: string;
}

export interface CrmTeamDTO {
  id: string;
  name: string;
  description: string;
  leadId: string | null;
  memberIds: string[];
}

export interface StageDTO {
  id: string;
  name: string;
  probability: number;
  position: number;
  rotDays: number | null;
}

export interface PipelineDTO {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  archived: boolean;
  stages: StageDTO[];
}

export interface TagDTO {
  id: string;
  name: string;
  color: string;
}

export interface RefDTO {
  id: string;
  name: string;
}

export interface BaseRecordDTO {
  id: string;
  ownerId: string | null;
  tags: TagDTO[];
  custom: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
  createdBy: string | null;
  archivedAt: number | null;
  deletedAt: number | null;
  /** What the signed-in person may do with this record (server-computed). */
  can: { edit: boolean; delete: boolean };
}

export interface ContactDTO extends BaseRecordDTO {
  name: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  emails: { label: string; value: string }[];
  phone: string;
  mobile: string;
  phones: { label: string; value: string }[];
  companyId: string | null;
  company: RefDTO | null;
  website: string;
  address: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  source: string;
  status: string;
  priority: string;
  description: string;
  avatarUrl: string | null;
  lastContactedAt: number | null;
  nextFollowUp: string | null;
  leadId: string | null;
}

export interface CompanyDTO extends BaseRecordDTO {
  name: string;
  website: string;
  domain: string;
  industry: string;
  size: string;
  annualRevenue: number | null;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  status: string;
  description: string;
  logoUrl: string | null;
  contactCount: number;
  openDealCount: number;
  lastActivityAt: number | null;
}

export interface LeadDTO extends BaseRecordDTO {
  name: string;
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  industry: string;
  source: string;
  status: string;
  score: number;
  scoreLocked: boolean;
  estimatedValue: number | null;
  priority: string;
  description: string;
  followUpDate: string | null;
  unqualifiedReason: string;
  convertedAt: number | null;
  contactId: string | null;
  companyId: string | null;
  dealId: string | null;
  lastActivityAt: number | null;
}

export interface DealItemDTO {
  id: string;
  productId: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  total: number;
}

export interface DealDTO extends BaseRecordDTO {
  title: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  stageName: string;
  status: 'open' | 'won' | 'lost';
  probability: number | null;
  effectiveProbability: number;
  weightedValue: number;
  expectedCloseDate: string | null;
  companyId: string | null;
  company: RefDTO | null;
  contacts: (RefDTO & { role: string })[];
  leadId: string | null;
  priority: string;
  source: string;
  competitors: string;
  lostReason: string;
  description: string;
  flagged: boolean;
  flagReason: string;
  wonAt: number | null;
  lostAt: number | null;
  stageEnteredAt: number;
  position: number;
  items: DealItemDTO[];
  lastActivityAt: number | null;
}

export interface ActivityDTO {
  id: string;
  type: string;
  title: string;
  description: string;
  assignedTo: string | null;
  dueDate: string | null;
  dueTime: string | null;
  durationMin: number | null;
  priority: string;
  status: 'open' | 'done' | 'cancelled';
  doneAt: number | null;
  outcome: string;
  location: string;
  emailDirection: 'outbound' | 'inbound' | null;
  emailTo: string;
  emailDelivery: string | null;
  contact: RefDTO | null;
  company: RefDTO | null;
  deal: RefDTO | null;
  lead: RefDTO | null;
  pmItem: { workspaceId: string; itemId: string } | null;
  createdBy: string | null;
  createdAt: number;
  updatedAt: number;
  overdue: boolean;
  can: { edit: boolean; delete: boolean };
}

export interface NoteDTO {
  id: string;
  kind: 'note' | 'comment' | 'meeting';
  body: string;
  authorId: string | null;
  authorName: string | null;
  pinned: boolean;
  mentions: string[];
  createdAt: number;
  updatedAt: number;
  can: { edit: boolean; delete: boolean };
}

export interface FileDTO {
  id: string;
  kind: 'document' | 'proposal' | 'contract' | 'quote' | 'other';
  fileName: string;
  contentType: string;
  size: number;
  version: number;
  previousId: string | null;
  uploaderId: string | null;
  uploaderName: string | null;
  createdAt: number;
  url: string;
}

export type TimelineKind = 'event' | 'activity' | 'note' | 'file';

export interface TimelineItemDTO {
  kind: TimelineKind;
  id: string;
  at: number;
  /** event: created, updated, assigned, stage_changed, won, lost, converted...; activity: its type; note: its kind. */
  type: string;
  title: string;
  body: string;
  actorId: string | null;
  actorName: string | null;
  /** The record it belongs to, when it is not the record being viewed (company timelines include contacts and deals). */
  via: { entity: RecordEntity; id: string; name: string } | null;
  data?: Record<string, unknown>;
}

export interface ListResult<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CustomFieldDTO {
  id: string;
  entity: RecordEntity;
  label: string;
  type: CustomFieldType;
  options: string[];
  required: boolean;
  position: number;
  archived: boolean;
}

export interface SavedViewDTO {
  id: string;
  entity: CrmEntity;
  name: string;
  query: Omit<ListQuery, 'page' | 'pageSize'>;
  columns: string[];
  shared: boolean;
  userId: string;
  mine: boolean;
}

export interface CrmNotificationDTO {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  actorId: string | null;
  readAt: number | null;
  createdAt: number;
}

export interface AutomationDTO {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  config: TriggerConfig;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
  preset: string | null;
  runCount: number;
  lastRunAt: number | null;
  createdAt: number;
}

export interface AutomationRunDTO {
  id: string;
  automationId: string;
  automationName: string;
  trigger: string;
  entityType: string | null;
  entityId: string | null;
  status: 'success' | 'failed' | 'skipped';
  detail: string;
  createdAt: number;
}

export interface EmailTemplateDTO {
  id: string;
  name: string;
  subject: string;
  body: string;
  shared: boolean;
  createdBy: string | null;
  mine: boolean;
}

export interface ProductDTO {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  description: string;
  active: boolean;
}

export interface DuplicateDTO {
  entity: RecordEntity;
  id: string;
  name: string;
  detail: string;
  reason: string;
}
