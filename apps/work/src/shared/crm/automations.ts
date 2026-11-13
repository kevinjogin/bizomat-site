// CRM automations: Trigger -> Conditions -> Actions. Only triggers and actions the engine runs are defined here
// (src/worker/crm/automations.ts executes every one of them); the builder offers nothing else.

export const TRIGGERS = {
  'lead.created': { label: 'A lead is created', entity: 'lead', scheduled: false },
  'lead.assigned': { label: 'A lead is assigned to someone', entity: 'lead', scheduled: false },
  'lead.status_changed': { label: "A lead's status changes", entity: 'lead', scheduled: false },
  'contact.created': { label: 'A contact is created', entity: 'contact', scheduled: false },
  'deal.created': { label: 'A deal is created', entity: 'deal', scheduled: false },
  'deal.stage_changed': { label: 'A deal enters a stage', entity: 'deal', scheduled: false },
  'deal.closed': { label: 'A deal is won or lost', entity: 'deal', scheduled: false },
  'deal.closing_soon': { label: "A deal's expected close date is near", entity: 'deal', scheduled: true },
  'activity.assigned': { label: 'An activity or task is assigned to someone', entity: 'activity', scheduled: false },
  'activity.overdue': { label: 'An activity or follow-up becomes overdue', entity: 'activity', scheduled: true },
} as const;

export type TriggerType = keyof typeof TRIGGERS;
export const TRIGGER_TYPES = Object.keys(TRIGGERS) as TriggerType[];

/** Trigger options: deal.stage_changed {pipelineId?, stageId?}; deal.closed {outcome}; deal.closing_soon {days}. */
export interface TriggerConfig {
  pipelineId?: string | null;
  stageId?: string | null;
  outcome?: 'won' | 'lost' | 'any';
  days?: number;
}

export interface AutomationCondition {
  field: string;
  op: 'eq' | 'neq' | 'gte' | 'lte' | 'in' | 'contains' | 'empty' | 'not_empty';
  value?: unknown;
}

/** The fields a condition can test, per entity. */
export const CONDITION_FIELDS: Record<'lead' | 'contact' | 'deal' | 'activity', { key: string; label: string; type: 'money' | 'int' | 'enum' | 'user' | 'text' | 'stage' | 'pipeline' }[]> = {
  lead: [
    { key: 'source', label: 'Source', type: 'enum' },
    { key: 'status', label: 'Status', type: 'enum' },
    { key: 'score', label: 'Lead score', type: 'int' },
    { key: 'estimatedValue', label: 'Estimated value', type: 'money' },
    { key: 'priority', label: 'Priority', type: 'enum' },
    { key: 'ownerId', label: 'Owner', type: 'user' },
    { key: 'industry', label: 'Industry', type: 'enum' },
  ],
  contact: [
    { key: 'source', label: 'Source', type: 'enum' },
    { key: 'status', label: 'Status', type: 'enum' },
    { key: 'ownerId', label: 'Owner', type: 'user' },
  ],
  deal: [
    { key: 'value', label: 'Value', type: 'money' },
    { key: 'pipelineId', label: 'Pipeline', type: 'pipeline' },
    { key: 'stageId', label: 'Stage', type: 'stage' },
    { key: 'ownerId', label: 'Owner', type: 'user' },
    { key: 'priority', label: 'Priority', type: 'enum' },
    { key: 'source', label: 'Source', type: 'enum' },
  ],
  activity: [
    { key: 'type', label: 'Type', type: 'enum' },
    { key: 'priority', label: 'Priority', type: 'enum' },
    { key: 'assignedTo', label: 'Assigned to', type: 'user' },
  ],
};

export type Recipient = 'owner' | 'assignee' | 'actor' | 'managers' | 'admins' | 'everyone' | 'users';

export const RECIPIENT_LABELS: Record<Recipient, string> = {
  owner: "The record's owner",
  assignee: 'The person assigned',
  actor: 'The person who made the change',
  managers: 'Managers, administrators and the owner',
  admins: 'Administrators and the owner',
  everyone: 'Everyone in the organisation',
  users: 'Chosen people',
};

export type AutomationAction =
  | { type: 'notify'; to: Recipient; userIds?: string[]; message?: string }
  | { type: 'create_activity'; activityType: string; title: string; dueInDays: number; assignTo: 'owner' | 'actor' | 'user'; userId?: string | null; priority?: string }
  | { type: 'set_priority'; priority: string }
  | { type: 'flag_deal'; reason?: string }
  | { type: 'assign_owner'; userId: string };

export const ACTION_TYPES = ['notify', 'create_activity', 'set_priority', 'flag_deal', 'assign_owner'] as const;

export const ACTION_LABELS: Record<AutomationAction['type'], string> = {
  notify: 'Send a notification',
  create_activity: 'Create a follow-up activity',
  set_priority: 'Set the priority',
  flag_deal: 'Flag the deal',
  assign_owner: 'Assign an owner',
};

/** Which actions apply to which trigger entity. */
export function actionsFor(entity: 'lead' | 'contact' | 'deal' | 'activity'): AutomationAction['type'][] {
  if (entity === 'deal') return ['notify', 'create_activity', 'set_priority', 'flag_deal', 'assign_owner'];
  if (entity === 'activity') return ['notify', 'set_priority'];
  return ['notify', 'create_activity', 'set_priority', 'assign_owner'];
}

export interface AutomationPreset {
  key: string;
  name: string;
  description: string;
  trigger: TriggerType;
  config: TriggerConfig;
  /** {highValue} is replaced by the organisation's high-value threshold. */
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

/**
 * The automations every new organisation starts with (switched on; each can be edited, switched off or deleted).
 * {proposalStage} is replaced by the id of the default pipeline's Proposal stage when the organisation is created.
 */
export const PRESETS: AutomationPreset[] = [
  {
    key: 'lead_assigned',
    name: 'Tell the owner about a new lead',
    description: 'Notifies the person a lead is assigned to.',
    trigger: 'lead.assigned',
    config: {},
    conditions: [],
    actions: [{ type: 'notify', to: 'owner', message: 'A lead was assigned to you: {record}' }],
  },
  {
    key: 'overdue_followups',
    name: 'Remind about overdue follow-ups',
    description: 'Notifies the person assigned once an activity is past its due date.',
    trigger: 'activity.overdue',
    config: {},
    conditions: [],
    actions: [{ type: 'notify', to: 'assignee', message: 'Overdue: {record}' }],
  },
  {
    key: 'high_value_stage',
    name: 'Tell managers when a high-value deal moves',
    description: 'Notifies managers when a deal at or above the high-value amount changes stage.',
    trigger: 'deal.stage_changed',
    config: {},
    conditions: [{ field: 'value', op: 'gte', value: '{highValue}' }],
    actions: [{ type: 'notify', to: 'managers', message: '{record} moved to {stage} ({value})' }],
  },
  {
    key: 'proposal_follow_up',
    name: 'Follow up after a proposal',
    description: 'Creates a follow-up for the deal owner three days after a deal enters the Proposal stage.',
    trigger: 'deal.stage_changed',
    config: { stageId: '{proposalStage}' },
    conditions: [],
    actions: [{ type: 'create_activity', activityType: 'follow_up', title: 'Follow up on the proposal', dueInDays: 3, assignTo: 'owner', priority: 'high' }],
  },
  {
    key: 'task_assigned',
    name: 'Tell people about tasks assigned to them',
    description: 'Notifies the person an activity or task is assigned to.',
    trigger: 'activity.assigned',
    config: {},
    conditions: [],
    actions: [{ type: 'notify', to: 'assignee', message: '{actor} assigned you: {record}' }],
  },
  {
    key: 'closing_soon',
    name: 'Flag deals close to their expected close date',
    description: 'Flags open deals seven days before their expected close date and tells the owner.',
    trigger: 'deal.closing_soon',
    config: { days: 7 },
    conditions: [],
    actions: [
      { type: 'flag_deal', reason: 'Expected close date is near' },
      { type: 'notify', to: 'owner', message: '{record} is expected to close on {closeDate}' },
    ],
  },
  {
    key: 'won_lost',
    name: 'Tell the team when a deal is won or lost',
    description: 'Notifies everyone in the organisation when a deal is won or lost.',
    trigger: 'deal.closed',
    config: { outcome: 'any' },
    conditions: [],
    actions: [{ type: 'notify', to: 'everyone', message: '{record} was {outcome} ({value})' }],
  },
];
