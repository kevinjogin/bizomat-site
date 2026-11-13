// The fields of each CRM record type: what forms show, which columns a list can have, what can be filtered and sorted,
// and the CSV columns. The server maps each key to SQL (src/worker/crm/entities.ts) and accepts nothing else, so a
// filter or sort can only ever name a field defined here (or a custom field of the organisation).

import type { ListKey } from './defaults';

export type CrmEntity = 'lead' | 'contact' | 'company' | 'deal' | 'activity';
export const CRM_ENTITIES: CrmEntity[] = ['lead', 'contact', 'company', 'deal', 'activity'];
/** Entities that have owners, tags, custom fields, notes and files. */
export type RecordEntity = Exclude<CrmEntity, 'activity'>;
export const RECORD_ENTITIES: RecordEntity[] = ['lead', 'contact', 'company', 'deal'];

export const ENTITY_LABELS: Record<CrmEntity, { one: string; many: string; path: string; module: 'leads' | 'contacts' | 'companies' | 'deals' | 'activities' }> = {
  lead: { one: 'Lead', many: 'Leads', path: 'leads', module: 'leads' },
  contact: { one: 'Contact', many: 'Contacts', path: 'contacts', module: 'contacts' },
  company: { one: 'Company', many: 'Companies', path: 'companies', module: 'companies' },
  deal: { one: 'Deal', many: 'Deals', path: 'deals', module: 'deals' },
  activity: { one: 'Activity', many: 'Activities', path: 'activities', module: 'activities' },
};

export type FieldType =
  | 'text'
  | 'longtext'
  | 'email'
  | 'url'
  | 'phone'
  | 'enum'
  | 'user'
  | 'date'
  | 'time'
  | 'money'
  | 'int'
  | 'percent'
  | 'bool'
  | 'company'
  | 'contact'
  | 'deal'
  | 'lead'
  | 'pipeline'
  | 'stage'
  | 'datetime';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** For enum fields: the organisation list, or a fixed list name. */
  list?: ListKey | 'priorities' | 'companySizes' | 'dealStatuses' | 'activityStatuses';
  /** Set by the server only (timestamps, computed values). */
  readOnly?: boolean;
  /** Shown as a list column by default. */
  defaultColumn?: boolean;
  /** Not a list column, filter or sort (form only). */
  formOnly?: boolean;
  /** Not in forms (computed or system). */
  computed?: boolean;
  required?: boolean;
  maxLength?: number;
}

const T = (key: string, label: string, type: FieldType, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type, ...extra });

const ADDRESS: FieldDef[] = [
  T('address', 'Street address', 'text', { maxLength: 200 }),
  T('city', 'City', 'text', { maxLength: 100 }),
  T('region', 'State or region', 'text', { maxLength: 100 }),
  T('postcode', 'Postcode', 'text', { maxLength: 20 }),
  T('country', 'Country', 'text', { maxLength: 100 }),
];

const SYSTEM: FieldDef[] = [
  T('createdAt', 'Created', 'datetime', { readOnly: true, computed: true }),
  T('updatedAt', 'Updated', 'datetime', { readOnly: true, computed: true }),
];

export const FIELDS: Record<CrmEntity, FieldDef[]> = {
  contact: [
    T('name', 'Name', 'text', { computed: true, readOnly: true, defaultColumn: true }),
    T('firstName', 'First name', 'text', { maxLength: 100, formOnly: true }),
    T('lastName', 'Last name', 'text', { maxLength: 100, formOnly: true }),
    T('jobTitle', 'Job title', 'text', { maxLength: 120, defaultColumn: true }),
    T('companyId', 'Company', 'company', { defaultColumn: true }),
    T('email', 'Email', 'email', { defaultColumn: true }),
    T('phone', 'Phone', 'phone', { defaultColumn: true }),
    T('mobile', 'Mobile', 'phone'),
    T('website', 'Website', 'url'),
    ...ADDRESS,
    T('source', 'Source', 'enum', { list: 'sources' }),
    T('status', 'Status', 'enum', { list: 'contactStatuses', defaultColumn: true }),
    T('priority', 'Priority', 'enum', { list: 'priorities' }),
    T('ownerId', 'Owner', 'user', { defaultColumn: true }),
    T('nextFollowUp', 'Next follow-up', 'date', { defaultColumn: true }),
    T('lastContactedAt', 'Last contacted', 'datetime', { readOnly: true, computed: true }),
    T('description', 'Description', 'longtext', { maxLength: 10_000, formOnly: true }),
    ...SYSTEM,
  ],
  company: [
    T('name', 'Company name', 'text', { required: true, maxLength: 200, defaultColumn: true }),
    T('industry', 'Industry', 'enum', { list: 'industries', defaultColumn: true }),
    T('website', 'Website', 'url', { defaultColumn: true }),
    T('phone', 'Phone', 'phone'),
    T('email', 'Email', 'email'),
    T('size', 'Business size', 'enum', { list: 'companySizes' }),
    T('annualRevenue', 'Annual revenue', 'money'),
    ...ADDRESS,
    T('status', 'Relationship', 'enum', { list: 'companyStatuses', defaultColumn: true }),
    T('ownerId', 'Owner', 'user', { defaultColumn: true }),
    T('contactCount', 'Contacts', 'int', { computed: true, readOnly: true, defaultColumn: true }),
    T('openDealCount', 'Open deals', 'int', { computed: true, readOnly: true, defaultColumn: true }),
    T('lastActivityAt', 'Last activity', 'datetime', { readOnly: true, computed: true }),
    T('description', 'Description', 'longtext', { maxLength: 10_000, formOnly: true }),
    ...SYSTEM,
  ],
  lead: [
    T('name', 'Name', 'text', { computed: true, readOnly: true, defaultColumn: true }),
    T('firstName', 'First name', 'text', { maxLength: 100, formOnly: true }),
    T('lastName', 'Last name', 'text', { maxLength: 100, formOnly: true }),
    T('companyName', 'Company', 'text', { maxLength: 200, defaultColumn: true }),
    T('jobTitle', 'Job title', 'text', { maxLength: 120 }),
    T('email', 'Email', 'email', { defaultColumn: true }),
    T('phone', 'Phone', 'phone'),
    T('website', 'Website', 'url'),
    T('country', 'Country', 'text', { maxLength: 100 }),
    T('industry', 'Industry', 'enum', { list: 'industries' }),
    T('source', 'Source', 'enum', { list: 'sources', defaultColumn: true }),
    T('status', 'Status', 'enum', { list: 'leadStatuses', defaultColumn: true }),
    T('score', 'Lead score', 'int', { defaultColumn: true }),
    T('estimatedValue', 'Estimated value', 'money', { defaultColumn: true }),
    T('priority', 'Priority', 'enum', { list: 'priorities' }),
    T('ownerId', 'Owner', 'user', { defaultColumn: true }),
    T('followUpDate', 'Follow-up date', 'date'),
    T('convertedAt', 'Converted', 'datetime', { readOnly: true, computed: true }),
    T('description', 'Description', 'longtext', { maxLength: 10_000, formOnly: true }),
    ...SYSTEM,
  ],
  deal: [
    T('title', 'Deal', 'text', { required: true, maxLength: 200, defaultColumn: true }),
    T('value', 'Value', 'money', { defaultColumn: true }),
    T('pipelineId', 'Pipeline', 'pipeline'),
    T('stageId', 'Stage', 'stage', { defaultColumn: true }),
    T('status', 'Status', 'enum', { list: 'dealStatuses', readOnly: true, defaultColumn: true }),
    T('probability', 'Probability', 'percent'),
    T('weightedValue', 'Weighted value', 'money', { computed: true, readOnly: true }),
    T('expectedCloseDate', 'Expected close', 'date', { defaultColumn: true }),
    T('companyId', 'Company', 'company', { defaultColumn: true }),
    T('ownerId', 'Owner', 'user', { defaultColumn: true }),
    T('priority', 'Priority', 'enum', { list: 'priorities' }),
    T('source', 'Source', 'enum', { list: 'sources' }),
    T('competitors', 'Competitors', 'text', { maxLength: 500 }),
    T('lostReason', 'Lost reason', 'text', { readOnly: true, maxLength: 300 }),
    T('flagged', 'Flagged', 'bool'),
    T('wonAt', 'Won', 'datetime', { readOnly: true, computed: true }),
    T('lostAt', 'Lost', 'datetime', { readOnly: true, computed: true }),
    T('stageEnteredAt', 'In stage since', 'datetime', { readOnly: true, computed: true }),
    T('description', 'Description', 'longtext', { maxLength: 10_000, formOnly: true }),
    ...SYSTEM,
  ],
  activity: [
    T('title', 'Title', 'text', { required: true, maxLength: 200, defaultColumn: true }),
    T('type', 'Type', 'enum', { list: 'activityTypes', defaultColumn: true }),
    T('status', 'Status', 'enum', { list: 'activityStatuses', defaultColumn: true }),
    T('dueDate', 'Due date', 'date', { defaultColumn: true }),
    T('dueTime', 'Time', 'time'),
    T('durationMin', 'Duration (minutes)', 'int'),
    T('priority', 'Priority', 'enum', { list: 'priorities', defaultColumn: true }),
    T('assignedTo', 'Assigned to', 'user', { defaultColumn: true }),
    T('contactId', 'Contact', 'contact', { defaultColumn: true }),
    T('companyId', 'Company', 'company'),
    T('dealId', 'Deal', 'deal', { defaultColumn: true }),
    T('leadId', 'Lead', 'lead'),
    T('location', 'Location', 'text', { maxLength: 300 }),
    T('outcome', 'Outcome', 'text', { maxLength: 2000 }),
    T('doneAt', 'Completed', 'datetime', { readOnly: true, computed: true }),
    T('description', 'Description', 'longtext', { maxLength: 10_000, formOnly: true }),
    ...SYSTEM,
  ],
};

export function fieldDef(entity: CrmEntity, key: string): FieldDef | undefined {
  return FIELDS[entity].find((f) => f.key === key);
}

// ------------------------------------------------------------------ custom fields

export const CUSTOM_FIELD_TYPES = ['text', 'textarea', 'number', 'money', 'date', 'select', 'multiselect', 'checkbox', 'url', 'email', 'phone'] as const;
export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number];
export const CUSTOM_FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: 'Text',
  textarea: 'Long text',
  number: 'Number',
  money: 'Amount',
  date: 'Date',
  select: 'Dropdown',
  multiselect: 'Multiple choice',
  checkbox: 'Checkbox',
  url: 'Web address',
  email: 'Email',
  phone: 'Phone',
};

/** The filter type of a custom field. */
export function customFieldFilterType(t: CustomFieldType): FieldType {
  switch (t) {
    case 'textarea':
      return 'longtext';
    case 'number':
      return 'int';
    case 'money':
      return 'money';
    case 'date':
      return 'date';
    case 'select':
      return 'enum';
    case 'multiselect':
      return 'enum';
    case 'checkbox':
      return 'bool';
    case 'url':
      return 'url';
    case 'email':
      return 'email';
    case 'phone':
      return 'phone';
    default:
      return 'text';
  }
}

// ------------------------------------------------------------------ filters

export type FilterOp =
  | 'contains'
  | 'not_contains'
  | 'eq'
  | 'neq'
  | 'starts_with'
  | 'empty'
  | 'not_empty'
  | 'in'
  | 'not_in'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'before'
  | 'after'
  | 'on'
  | 'last_days'
  | 'next_days'
  | 'overdue'
  | 'is_true'
  | 'is_false'
  | 'has'
  | 'has_not';

export interface FilterCond {
  /** A field key, "tag", or "cf:<custom field id>". */
  field: string;
  op: FilterOp;
  value?: unknown;
}

export interface ListQuery {
  q?: string;
  filters?: FilterCond[];
  match?: 'all' | 'any';
  /** A second group of conditions of which at least one must hold, on top of `filters` (a view's own conditions
   * stay required while the person adds "any of" conditions). */
  anyOf?: FilterCond[];
  sort?: { field: string; dir: 'asc' | 'desc' };
  page?: number;
  pageSize?: number;
  /** active (default), archived, deleted, or all (active and archived). */
  scope?: 'active' | 'archived' | 'deleted' | 'all';
}

export const OP_LABELS: Record<FilterOp, string> = {
  contains: 'contains',
  not_contains: 'does not contain',
  eq: 'is',
  neq: 'is not',
  starts_with: 'starts with',
  empty: 'is empty',
  not_empty: 'is not empty',
  in: 'is any of',
  not_in: 'is none of',
  gt: 'greater than',
  gte: 'at least',
  lt: 'less than',
  lte: 'at most',
  before: 'before',
  after: 'after',
  on: 'on',
  last_days: 'in the last … days',
  next_days: 'in the next … days',
  overdue: 'is in the past',
  is_true: 'is yes',
  is_false: 'is no',
  has: 'has tag',
  has_not: 'does not have tag',
};

/** Operators that make sense for each field type. */
export function opsFor(type: FieldType | 'tag'): FilterOp[] {
  switch (type) {
    case 'text':
    case 'longtext':
    case 'email':
    case 'url':
    case 'phone':
    case 'time':
      return ['contains', 'not_contains', 'eq', 'neq', 'starts_with', 'empty', 'not_empty'];
    case 'enum':
    case 'user':
    case 'company':
    case 'contact':
    case 'deal':
    case 'lead':
    case 'pipeline':
    case 'stage':
      return ['in', 'not_in', 'empty', 'not_empty'];
    case 'money':
    case 'int':
    case 'percent':
      return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'empty', 'not_empty'];
    case 'date':
      return ['on', 'before', 'after', 'last_days', 'next_days', 'overdue', 'empty', 'not_empty'];
    case 'datetime':
      return ['before', 'after', 'last_days', 'empty', 'not_empty'];
    case 'bool':
      return ['is_true', 'is_false'];
    case 'tag':
      return ['has', 'has_not'];
  }
}

/** Operators that take no value. */
export const VALUELESS_OPS = new Set<FilterOp>(['empty', 'not_empty', 'overdue', 'is_true', 'is_false']);

// ------------------------------------------------------------------ default views

export interface ViewDef {
  key: string;
  name: string;
  query: Omit<ListQuery, 'page' | 'pageSize'>;
}

/** The built-in views of each list. "me" stands for the signed-in person; "today" is resolved on the server. */
export const DEFAULT_VIEWS: Record<CrmEntity, ViewDef[]> = {
  contact: [
    { key: 'all', name: 'All contacts', query: { sort: { field: 'updatedAt', dir: 'desc' } } },
    { key: 'mine', name: 'My contacts', query: { filters: [{ field: 'ownerId', op: 'in', value: ['me'] }], sort: { field: 'name', dir: 'asc' } } },
    { key: 'follow_up', name: 'Overdue follow-ups', query: { filters: [{ field: 'nextFollowUp', op: 'overdue' }], sort: { field: 'nextFollowUp', dir: 'asc' } } },
    { key: 'recent', name: 'Recently updated', query: { filters: [{ field: 'updatedAt', op: 'last_days', value: 7 }], sort: { field: 'updatedAt', dir: 'desc' } } },
    { key: 'archived', name: 'Archived', query: { scope: 'archived', sort: { field: 'updatedAt', dir: 'desc' } } },
  ],
  company: [
    { key: 'all', name: 'All companies', query: { sort: { field: 'name', dir: 'asc' } } },
    { key: 'mine', name: 'My companies', query: { filters: [{ field: 'ownerId', op: 'in', value: ['me'] }], sort: { field: 'name', dir: 'asc' } } },
    { key: 'customers', name: 'Customers', query: { filters: [{ field: 'status', op: 'in', value: ['customer'] }], sort: { field: 'name', dir: 'asc' } } },
    { key: 'recent', name: 'Recently updated', query: { filters: [{ field: 'updatedAt', op: 'last_days', value: 7 }], sort: { field: 'updatedAt', dir: 'desc' } } },
    { key: 'archived', name: 'Archived', query: { scope: 'archived', sort: { field: 'updatedAt', dir: 'desc' } } },
  ],
  lead: [
    { key: 'open', name: 'Open leads', query: { filters: [{ field: 'status', op: 'not_in', value: ['converted', 'unqualified'] }], sort: { field: 'createdAt', dir: 'desc' } } },
    { key: 'new', name: 'New leads', query: { filters: [{ field: 'status', op: 'in', value: ['new'] }], sort: { field: 'createdAt', dir: 'desc' } } },
    { key: 'mine', name: 'My leads', query: { filters: [{ field: 'ownerId', op: 'in', value: ['me'] }, { field: 'status', op: 'not_in', value: ['converted'] }], sort: { field: 'score', dir: 'desc' } } },
    { key: 'qualified', name: 'Qualified', query: { filters: [{ field: 'status', op: 'in', value: ['qualified'] }], sort: { field: 'score', dir: 'desc' } } },
    { key: 'follow_up', name: 'Overdue follow-ups', query: { filters: [{ field: 'followUpDate', op: 'overdue' }, { field: 'status', op: 'not_in', value: ['converted', 'unqualified'] }], sort: { field: 'followUpDate', dir: 'asc' } } },
    { key: 'converted', name: 'Converted', query: { filters: [{ field: 'status', op: 'in', value: ['converted'] }], sort: { field: 'convertedAt', dir: 'desc' } } },
    { key: 'all', name: 'All leads', query: { sort: { field: 'updatedAt', dir: 'desc' } } },
    { key: 'archived', name: 'Archived', query: { scope: 'archived', sort: { field: 'updatedAt', dir: 'desc' } } },
  ],
  deal: [
    { key: 'open', name: 'Open deals', query: { filters: [{ field: 'status', op: 'in', value: ['open'] }], sort: { field: 'expectedCloseDate', dir: 'asc' } } },
    { key: 'mine', name: 'My open deals', query: { filters: [{ field: 'status', op: 'in', value: ['open'] }, { field: 'ownerId', op: 'in', value: ['me'] }], sort: { field: 'expectedCloseDate', dir: 'asc' } } },
    { key: 'closing', name: 'Closing soon', query: { filters: [{ field: 'status', op: 'in', value: ['open'] }, { field: 'expectedCloseDate', op: 'next_days', value: 30 }], sort: { field: 'expectedCloseDate', dir: 'asc' } } },
    { key: 'won', name: 'Won deals', query: { filters: [{ field: 'status', op: 'in', value: ['won'] }], sort: { field: 'wonAt', dir: 'desc' } } },
    { key: 'lost', name: 'Lost deals', query: { filters: [{ field: 'status', op: 'in', value: ['lost'] }], sort: { field: 'lostAt', dir: 'desc' } } },
    { key: 'recent', name: 'Recently updated', query: { filters: [{ field: 'updatedAt', op: 'last_days', value: 7 }], sort: { field: 'updatedAt', dir: 'desc' } } },
    { key: 'all', name: 'All deals', query: { sort: { field: 'updatedAt', dir: 'desc' } } },
    { key: 'archived', name: 'Archived', query: { scope: 'archived', sort: { field: 'updatedAt', dir: 'desc' } } },
  ],
  activity: [
    { key: 'mine', name: 'My activities', query: { filters: [{ field: 'assignedTo', op: 'in', value: ['me'] }, { field: 'status', op: 'in', value: ['open'] }], sort: { field: 'dueDate', dir: 'asc' } } },
    { key: 'today', name: "Today's follow-ups", query: { filters: [{ field: 'dueDate', op: 'on', value: 'today' }, { field: 'status', op: 'in', value: ['open'] }], sort: { field: 'dueDate', dir: 'asc' } } },
    { key: 'overdue', name: 'Overdue', query: { filters: [{ field: 'dueDate', op: 'overdue' }, { field: 'status', op: 'in', value: ['open'] }], sort: { field: 'dueDate', dir: 'asc' } } },
    { key: 'upcoming', name: 'Upcoming', query: { filters: [{ field: 'dueDate', op: 'next_days', value: 14 }, { field: 'status', op: 'in', value: ['open'] }], sort: { field: 'dueDate', dir: 'asc' } } },
    { key: 'team', name: 'Team activities', query: { filters: [{ field: 'status', op: 'in', value: ['open'] }], sort: { field: 'dueDate', dir: 'asc' } } },
    { key: 'completed', name: 'Completed', query: { filters: [{ field: 'status', op: 'in', value: ['done'] }], sort: { field: 'doneAt', dir: 'desc' } } },
  ],
};

export const MAX_PAGE_SIZE = 200;
