// Shared types of the BIZOMAT System design prototype. Demonstration data only: nothing here talks to a server.
import type { ReactNode } from 'react';

export type Tone = 'success' | 'warning' | 'danger' | 'accent' | 'info' | 'neutral';
export type PageState = 'W' | 'C' | 'P';
export type ModuleId = 'System' | 'CRM' | 'Finance' | 'Project Management' | 'CAD Automation' | 'Company';
export type SectionId =
  | 'sales'
  | 'finance'
  | 'projects'
  | 'engineering'
  | 'cad'
  | 'procurement'
  | 'inventory'
  | 'manufacturing'
  | 'quality'
  | 'maintenance'
  | 'supply-chain'
  | 'reports'
  | 'administration';

export type RoleId =
  | 'ceo'
  | 'executive'
  | 'sales'
  | 'finance'
  | 'accountant'
  | 'engineer'
  | 'procurement'
  | 'production'
  | 'warehouse'
  | 'quality'
  | 'project'
  | 'admin';

/** A record of demonstration data. Every record has an identifier; the rest depends on its kind. */
export type Row = { id: string; [key: string]: any };

export type ColKind = 'id' | 'text' | 'money' | 'date' | 'status' | 'number' | 'percent';

export interface Column {
  key: string;
  label: string;
  kind?: ColKind;
  /** Shown by default (true unless false). */
  visible?: boolean;
  /** Shown on the phone card. */
  card?: boolean;
  render?: (r: Row) => ReactNode;
}

export type Op = 'contains' | 'is' | 'isNot' | 'startsWith' | 'eq' | 'gt' | 'lt' | 'before' | 'after' | 'on';
export interface Condition {
  field: string;
  op: Op;
  value: string;
}
export interface SavedView {
  id: string;
  label: string;
  conditions: Condition[];
  sort?: { key: string; dir: 'asc' | 'desc' };
  columns?: string[];
  search?: string;
  builtIn?: boolean;
}

export interface FieldDef {
  name: string;
  label: string;
  description?: string;
  type: 'text' | 'select' | 'date' | 'number' | 'money' | 'textarea' | 'checkbox';
  options?: string[];
  required?: boolean;
  default?: string | number | boolean;
  min?: number;
  /** Takes the full width of the form grid. */
  wide?: boolean;
}
export interface FormDef {
  title: string;
  intro?: string;
  groups: { title: string; description?: string; fields: FieldDef[] }[];
  /** Turns the values into a new record. */
  toRow: (v: Record<string, any>) => Partial<Row>;
}

export interface RecordTab {
  id: string;
  label: string;
  render: (r: Row) => ReactNode;
}
export interface RecordAction {
  label: string;
  primary?: boolean;
  icon?: string;
  patch?: Partial<Row>;
  toast?: string;
  to?: string;
  external?: string;
  when?: (r: Row) => boolean;
}
export interface RelatedRef {
  entity: string;
  id: string;
  note?: string;
}
export interface DocRef {
  name: string;
  kind: string;
  size: string;
  date: string;
}
export interface BulkAction {
  label: string;
  patch?: Partial<Row>;
  toast: string;
}
export interface WorkflowStep {
  label: string;
  who: string;
  when?: string;
  state: 'done' | 'current' | 'waiting' | 'returned';
  comment?: string;
}

export interface EntityDef {
  key: string;
  label: string;
  plural: string;
  /** Canonical page path, without the leading slash ("sales/orders"). */
  path: string;
  module: ModuleId;
  /** Search scope (section 7 of the information architecture). */
  scope?: string;
  rows: Row[];
  title: (r: Row) => string;
  subtitle?: (r: Row) => string;
  columns: Column[];
  details?: { group: string; keys: [string, string, ColKind?][] }[];
  views?: SavedView[];
  tabs?: RecordTab[];
  overview?: (r: Row) => ReactNode;
  side?: (r: Row) => ReactNode;
  related?: (r: Row) => RelatedRef[];
  actions?: (r: Row) => RecordAction[];
  workflow?: (r: Row) => WorkflowStep[] | null;
  bulk?: BulkAction[];
  form?: FormDef;
  docs?: (r: Row) => DocRef[];
}

export interface NavPage {
  path: string;
  label: string;
  icon: string;
  state: PageState[];
  module: ModuleId;
  /** The existing route the page opens, as written in the information architecture. */
  opens?: string;
  /** What the mixed state means, for pages such as "W (contact) / P (profile)". */
  stateNote?: string;
  entity?: string;
}
export interface NavSection {
  id: SectionId;
  label: string;
  icon: string;
  pages: NavPage[];
}
