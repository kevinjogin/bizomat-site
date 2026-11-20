// BIZOMAT ERP modules framework (owner's brief "97-module enterprise expansion", 20 Nov 2026): the typed definitions
// every new module is built from. One definition per kind of record ("object") says its fields, statuses, workflow
// steps (with approval and segregation of duties), line items, who may read, change and approve it, its reports and
// reminders. The server (src/worker/erp/objects) validates, stores, numbers, records history, notifies and enforces
// access from these definitions; the screens (src/client/system/erp/objects) are drawn from the same definitions.
// Domain rules that a definition cannot say (leave balances, payroll, depreciation, calibration due dates, invoices in
// Finance) live in the server's hooks and actions, never in the browser.

/** The ERP roles of src/worker/erp/access.ts (kept in step by a test). */
export type Role = string;

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'integer'
  | 'money'
  | 'percent'
  | 'date'
  | 'time'
  | 'select'
  | 'bool'
  | 'email'
  | 'phone'
  | 'url'
  | 'currency'
  | 'country'
  | 'ref';

/**
 * What a reference field points at. Shared master records are referenced, never copied: people (company members),
 * customers (the company's CRM companies), suppliers (ERP supplier master), products (ERP product master), warehouses,
 * maintenance assets, Projects boards, departments, and other records of this framework (`obj:<object key>`).
 */
export type RefKind = 'user' | 'customer' | 'supplier' | 'product' | 'warehouse' | 'asset' | 'project' | 'department' | 'purchase_order' | 'sales_order' | 'mfg_order' | 'shipment' | `obj:${string}`;

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Text: most characters. Numbers: largest value. */
  max?: number;
  min?: number;
  options?: Record<string, string>;
  ref?: RefKind;
  help?: string;
  /** Shown as a column in the list. */
  list?: boolean;
  /** Offered as a filter on the list (select, bool, ref and date fields). */
  filter?: boolean;
  /** Grouping on the form and the record page. */
  section?: string;
  default?: string | number | boolean;
  /** Worked out by the server (hooks.ts); shown, never typed. */
  computed?: boolean;
  /** Only these roles (and ERP administrators) see or change it; never written to the history's values. */
  sensitive?: readonly Role[];
  /** Full width on the form. */
  wide?: boolean;
  /** Shown (and kept) only while another field has one of these values; cleared otherwise. */
  showIf?: { field: string; is: readonly string[] };
}

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface StatusDef {
  key: string;
  label: string;
  tone: Tone;
}

export interface TransitionDef {
  key: string;
  label: string;
  from: readonly string[];
  to: string;
  /** edit: anyone who may change the record; approve: the approvers (and approveField's person); own: the record's own person. */
  cap: 'edit' | 'approve' | 'own';
  /** The person who created the record (or `by` field's person) may not take this step unless alone in the company. */
  segregation?: boolean;
  note?: 'required' | 'optional';
  confirm?: string;
  /** Fields that must have a value before this step. */
  requires?: readonly string[];
  /** Notify the record's own person, assignee or creator when taken. */
  notify?: readonly ('own' | 'assignee' | 'creator' | 'approvers')[];
}

export interface LinesDef {
  label: string;
  fields: FieldDef[];
  /** The line's amount: price times quantity, or one money field. */
  amount?: { qty?: string; price: string } | null;
  /** Lines may change only in these statuses (default: the object's editable statuses). */
  editableIn?: readonly string[];
  max?: number;
}

export interface ReportDef {
  key: string;
  label: string;
  what: string;
  /** Count (and sum of `sum`) by a field: 'status', a select/ref/bool field, or 'month:<date field>'. */
  by: string;
  sum?: string;
}

export interface ActionDef {
  key: string;
  label: string;
  what: string;
  cap: 'edit' | 'approve' | 'own';
  statuses?: readonly string[];
  confirm?: string;
  /** Fields the person gives when running it. */
  input?: FieldDef[];
}

export interface ObjectDef {
  key: string;
  module: string;
  label: string;
  plural: string;
  /** Numbering prefix (EMP-00001). */
  prefix: string;
  /** The field used as the record's title (or a template '{firstName} {lastName}'). */
  title: string;
  what: string;
  fields: FieldDef[];
  statuses: StatusDef[];
  initial: string;
  /** Statuses in which the record may still be changed (default: every status but the closed ones). */
  editable?: readonly string[];
  /** Statuses that end the record (no reminders, counted as closed). */
  closed?: readonly string[];
  transitions: TransitionDef[];
  lines?: LinesDef;
  access: {
    view: readonly Role[];
    edit: readonly Role[];
    approve?: readonly Role[];
    /** Everyone in the company may create a record for themselves and see their own (self service). */
    selfService?: boolean;
  };
  /** The user field (or employee ref) that makes a record a person's own. */
  ownField?: string;
  /** A user field whose person may also approve (for example an employee's manager). */
  approveField?: string;
  /** The user field the record is assigned to. */
  assigneeField?: string;
  /** The record's main date and due date (lists, reports, reminders). */
  dateField?: string;
  dueField?: string;
  /** Remind the assignee (or own person) this many days before the due date. */
  remindDays?: number;
  /** The money field shown as the record's amount; the currency field beside it. */
  amountField?: string;
  currencyField?: string;
  reports?: ReportDef[];
  actions?: ActionDef[];
  /** Created only by a step of another record (an action), never by hand. */
  noCreate?: boolean;
  /** Text shown above the list: what this is and what it is not. */
  notice?: string;
}

export type Area = 'core' | 'finance' | 'sales' | 'procurement' | 'inventory' | 'manufacturing' | 'quality' | 'services' | 'people' | 'industry';

export interface ModuleDef {
  key: string;
  label: string;
  area: Area;
  /** Catalogue numbers (1 to 97) this module delivers. */
  catalogue: number[];
  summary: string;
  icon: string;
  objects: string[];
  /** The module switch (Admin Control Centre) it answers to. */
  switch: string;
  /** Plainly stated limits: what it does not do. */
  limits?: string[];
}

// ------------------------------------------------------------------ builders (keep the definitions short)

type Extra = Partial<Omit<FieldDef, 'key' | 'label' | 'type'>>;
const mk =
  (type: FieldType) =>
  (key: string, label: string, extra: Extra = {}): FieldDef => ({ key, label, type, ...extra });

export const F = {
  text: (key: string, label: string, extra: Extra = {}) => mk('text')(key, label, { max: 200, ...extra }),
  long: (key: string, label: string, extra: Extra = {}) => mk('textarea')(key, label, { max: 5000, wide: true, ...extra }),
  num: (key: string, label: string, extra: Extra = {}) => mk('number')(key, label, { min: 0, max: 1e9, ...extra }),
  int: (key: string, label: string, extra: Extra = {}) => mk('integer')(key, label, { min: 0, max: 1e9, ...extra }),
  money: (key: string, label: string, extra: Extra = {}) => mk('money')(key, label, extra),
  pct: (key: string, label: string, extra: Extra = {}) => mk('percent')(key, label, { min: 0, max: 100, ...extra }),
  date: (key: string, label: string, extra: Extra = {}) => mk('date')(key, label, extra),
  time: (key: string, label: string, extra: Extra = {}) => mk('time')(key, label, extra),
  select: (key: string, label: string, options: Record<string, string>, extra: Extra = {}) => mk('select')(key, label, { options, filter: true, ...extra }),
  bool: (key: string, label: string, extra: Extra = {}) => mk('bool')(key, label, extra),
  email: (key: string, label: string, extra: Extra = {}) => mk('email')(key, label, { max: 320, ...extra }),
  phone: (key: string, label: string, extra: Extra = {}) => mk('phone')(key, label, { max: 40, ...extra }),
  url: (key: string, label: string, extra: Extra = {}) => mk('url')(key, label, { max: 300, ...extra }),
  currency: (key = 'currency', label = 'Currency', extra: Extra = {}) => mk('currency')(key, label, { default: 'AUD', ...extra }),
  country: (key = 'country', label = 'Country', extra: Extra = {}) => mk('country')(key, label, extra),
  ref: (key: string, label: string, ref: RefKind, extra: Extra = {}) => mk('ref')(key, label, { ref, filter: true, ...extra }),
};

export const S = (key: string, label: string, tone: Tone = 'neutral'): StatusDef => ({ key, label, tone });

export const T = (key: string, label: string, from: string[], to: string, cap: TransitionDef['cap'] = 'edit', extra: Partial<TransitionDef> = {}): TransitionDef => ({ key, label, from, to, cap, ...extra });

/** Counted by status, the commonest report. */
export const byStatus = (sum?: string): ReportDef => ({ key: 'by-status', label: 'By status', what: 'How many there are in each status.', by: 'status', sum });
export const byMonth = (field: string, label: string, sum?: string): ReportDef => ({ key: `by-month-${field}`, label, what: `By month of ${label.toLowerCase()}.`, by: `month:${field}`, sum });
export const byField = (field: string, label: string, sum?: string): ReportDef => ({ key: `by-${field}`, label, what: `Grouped by ${label.toLowerCase()}.`, by: field, sum });
