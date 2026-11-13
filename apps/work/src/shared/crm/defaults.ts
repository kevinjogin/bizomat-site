// Organisation settings of the CRM: the lists each organisation can change (lead statuses, sources, activity types,
// lost reasons, company and contact statuses, industries) and their defaults. Stored in crm_orgs.settings_json and
// always read through orgSettings(), which fills in what is missing and drops what is malformed.

export interface ListOption {
  key: string;
  label: string;
  color?: string;
  /** For lead statuses: open, qualified, unqualified or converted (what reports count them as). */
  kind?: string;
  archived?: boolean;
}

export const LEAD_STATUS_KINDS = ['open', 'qualified', 'unqualified', 'converted'] as const;

export interface OrgSettings {
  leadStatuses: ListOption[];
  sources: ListOption[];
  activityTypes: ListOption[];
  lostReasons: ListOption[];
  companyStatuses: ListOption[];
  contactStatuses: ListOption[];
  industries: ListOption[];
  /** "Deals closing soon": expected close within this many days. */
  closingSoonDays: number;
  /** Deals at or above this value (minor units) count as high-value in automations and reports. */
  highValueDeal: number;
}

export type ListKey = 'leadStatuses' | 'sources' | 'activityTypes' | 'lostReasons' | 'companyStatuses' | 'contactStatuses' | 'industries';
export const LIST_KEYS: ListKey[] = ['leadStatuses', 'sources', 'activityTypes', 'lostReasons', 'companyStatuses', 'contactStatuses', 'industries'];

export const LIST_LABELS: Record<ListKey, string> = {
  leadStatuses: 'Lead statuses',
  sources: 'Lead and contact sources',
  activityTypes: 'Activity types',
  lostReasons: 'Lost reasons',
  companyStatuses: 'Company relationship statuses',
  contactStatuses: 'Contact statuses',
  industries: 'Industries',
};

const o = (key: string, label: string, extra: Partial<ListOption> = {}): ListOption => ({ key, label, ...extra });

export const DEFAULT_SETTINGS: OrgSettings = {
  leadStatuses: [
    o('new', 'New', { color: '#2563eb', kind: 'open' }),
    o('contacted', 'Contacted', { color: '#7c3aed', kind: 'open' }),
    o('engaged', 'Engaged', { color: '#d97706', kind: 'open' }),
    o('qualified', 'Qualified', { color: '#0f766e', kind: 'qualified' }),
    o('unqualified', 'Unqualified', { color: '#6b7280', kind: 'unqualified' }),
    o('converted', 'Converted', { color: '#15803d', kind: 'converted' }),
  ],
  sources: [
    o('website', 'Website'),
    o('referral', 'Referral'),
    o('email', 'Email campaign'),
    o('social', 'Social media'),
    o('event', 'Event or trade show'),
    o('outbound', 'Outbound prospecting'),
    o('partner', 'Partner'),
    o('advertising', 'Advertising'),
    o('existing', 'Existing customer'),
    o('other', 'Other'),
  ],
  activityTypes: [
    o('call', 'Call'),
    o('email', 'Email'),
    o('meeting', 'Meeting'),
    o('appointment', 'Appointment'),
    o('follow_up', 'Follow-up'),
    o('presentation', 'Presentation'),
    o('demo', 'Demonstration'),
    o('proposal', 'Proposal'),
    o('visit', 'Customer visit'),
    o('task', 'Task'),
    o('general', 'General'),
  ],
  lostReasons: [
    o('price', 'Price'),
    o('competitor', 'Went with a competitor'),
    o('timing', 'Timing'),
    o('budget', 'No budget'),
    o('no_decision', 'No decision'),
    o('requirements', 'Requirements not met'),
    o('unresponsive', 'Stopped responding'),
    o('other', 'Other'),
  ],
  companyStatuses: [
    o('prospect', 'Prospect', { color: '#2563eb' }),
    o('customer', 'Customer', { color: '#15803d' }),
    o('partner', 'Partner', { color: '#7c3aed' }),
    o('supplier', 'Supplier', { color: '#d97706' }),
    o('former', 'Former customer', { color: '#6b7280' }),
  ],
  contactStatuses: [
    o('active', 'Active', { color: '#0f766e' }),
    o('customer', 'Customer', { color: '#15803d' }),
    o('inactive', 'Inactive', { color: '#6b7280' }),
  ],
  industries: [
    o('engineering', 'Engineering'),
    o('manufacturing', 'Manufacturing'),
    o('construction', 'Construction'),
    o('consulting', 'Consulting'),
    o('technology', 'Technology'),
    o('energy', 'Energy and utilities'),
    o('mining', 'Mining and resources'),
    o('healthcare', 'Healthcare'),
    o('education', 'Education'),
    o('finance', 'Finance and insurance'),
    o('retail', 'Retail and wholesale'),
    o('logistics', 'Transport and logistics'),
    o('government', 'Government'),
    o('hospitality', 'Hospitality'),
    o('professional', 'Professional services'),
    o('other', 'Other'),
  ],
  closingSoonDays: 30,
  highValueDeal: 5_000_000,
};

/** Activity types that are to-dos (the Tasks page), as opposed to interactions. */
export const TASK_TYPES = new Set(['task', 'follow_up']);

export const PRIORITIES: ListOption[] = [
  o('low', 'Low', { color: '#6b7280' }),
  o('medium', 'Medium', { color: '#2563eb' }),
  o('high', 'High', { color: '#d97706' }),
  o('urgent', 'Urgent', { color: '#dc2626' }),
];

export const COMPANY_SIZES: ListOption[] = [
  o('1-10', '1 to 10'),
  o('11-50', '11 to 50'),
  o('51-200', '51 to 200'),
  o('201-500', '201 to 500'),
  o('501-1000', '501 to 1,000'),
  o('1001+', 'More than 1,000'),
];

export const DEAL_STATUSES: ListOption[] = [o('open', 'Open', { color: '#2563eb' }), o('won', 'Won', { color: '#15803d' }), o('lost', 'Lost', { color: '#dc2626' })];

export const ACTIVITY_STATUSES: ListOption[] = [o('open', 'To do', { color: '#2563eb' }), o('done', 'Done', { color: '#15803d' }), o('cancelled', 'Cancelled', { color: '#6b7280' })];

export const DEFAULT_PIPELINE = {
  name: 'Sales pipeline',
  stages: [
    { name: 'Qualification', probability: 10 },
    { name: 'Needs analysis', probability: 25 },
    { name: 'Proposal', probability: 50 },
    { name: 'Negotiation', probability: 75 },
    { name: 'Contract sent', probability: 90 },
  ],
};

const KEY_RE = /^[a-z0-9_]{1,40}$/;
const COLOR_RE = /^#[0-9a-f]{6}$/i;

function cleanList(v: unknown, fallback: ListOption[], kinds?: readonly string[]): ListOption[] {
  if (!Array.isArray(v)) return fallback;
  const seen = new Set<string>();
  const out: ListOption[] = [];
  for (const x of v.slice(0, 100)) {
    if (!x || typeof x !== 'object') continue;
    const r = x as Record<string, unknown>;
    const key = typeof r.key === 'string' ? r.key : '';
    const label = typeof r.label === 'string' ? r.label.trim().slice(0, 60) : '';
    if (!KEY_RE.test(key) || !label || seen.has(key)) continue;
    seen.add(key);
    const opt: ListOption = { key, label };
    if (typeof r.color === 'string' && COLOR_RE.test(r.color)) opt.color = r.color;
    if (kinds && typeof r.kind === 'string' && kinds.includes(r.kind)) opt.kind = r.kind;
    if (r.archived === true) opt.archived = true;
    out.push(opt);
  }
  return out.length ? out : fallback;
}

/** Lead statuses always keep one converted status (conversion sets it) and every status has a kind. */
function cleanLeadStatuses(v: unknown): ListOption[] {
  const list: ListOption[] = cleanList(v, DEFAULT_SETTINGS.leadStatuses, LEAD_STATUS_KINDS).map((s) => ({ ...s, kind: s.kind ?? 'open' }));
  if (!list.some((s) => s.key === 'converted')) list.push({ ...DEFAULT_SETTINGS.leadStatuses.find((s) => s.key === 'converted')! });
  return list.map((s) => (s.key === 'converted' ? { ...s, kind: 'converted', archived: undefined } : s));
}

export function orgSettings(raw: unknown): OrgSettings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const num = (v: unknown, d: number, min: number, max: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : d);
  return {
    leadStatuses: cleanLeadStatuses(r.leadStatuses),
    sources: cleanList(r.sources, DEFAULT_SETTINGS.sources),
    activityTypes: cleanList(r.activityTypes, DEFAULT_SETTINGS.activityTypes),
    lostReasons: cleanList(r.lostReasons, DEFAULT_SETTINGS.lostReasons),
    companyStatuses: cleanList(r.companyStatuses, DEFAULT_SETTINGS.companyStatuses),
    contactStatuses: cleanList(r.contactStatuses, DEFAULT_SETTINGS.contactStatuses),
    industries: cleanList(r.industries, DEFAULT_SETTINGS.industries),
    closingSoonDays: num(r.closingSoonDays, DEFAULT_SETTINGS.closingSoonDays, 1, 365),
    highValueDeal: num(r.highValueDeal, DEFAULT_SETTINGS.highValueDeal, 0, 1e15),
  };
}

export function optionLabel(list: ListOption[], key: string | null | undefined): string {
  if (!key) return '';
  return list.find((x) => x.key === key)?.label ?? key;
}

/** The lead statuses of one kind (for reports: qualified leads, converted leads). */
export function statusesOfKind(settings: OrgSettings, kind: string): string[] {
  return settings.leadStatuses.filter((s) => s.kind === kind).map((s) => s.key);
}
