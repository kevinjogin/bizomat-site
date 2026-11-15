// BIZOMAT WHS, Release 1: the shapes the API returns (src/worker/whs), the paths and the data hooks. The fixed lists
// and their labels come from the server (GET /c/:company/me, `lists`), so the screens keep no copies. The server decides
// what each person may see and do; the screens only show it.
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { appUrl } from '../../lib/base';

export const whsPath = (companyId: string, path = '') => `/whs/c/${encodeURIComponent(companyId)}${path}`;
/** A WHS page inside the ERP (router paths, under /erp). */
export const whsPage = (companyId: string, path = '') => `/c/${encodeURIComponent(companyId)}/whs${path}`;
export const csvHref = (companyId: string, path: string) => appUrl(`/api${whsPath(companyId, path)}${path.includes('?') ? '&' : '?'}format=csv`);

export type Labels = Record<string, string>;

export interface MatrixLevel {
  key: string;
  label: string;
  rank: number;
  action: string;
}
export interface Matrix {
  likelihood: { value: number; label: string }[];
  consequence: { value: number; label: string }[];
  levels: MatrixLevel[];
  grid: string[][];
  highFrom: number;
}

export interface WhsCan {
  report: boolean;
  view: boolean;
  assess: boolean;
  investigate: boolean;
  approve: boolean;
  notify: boolean;
  manage: boolean;
  consult: boolean;
  confidential: boolean;
  health: boolean;
}

export interface SitePack {
  id: string;
  code: string;
  name: string;
  regulator: string;
  rules?: number;
  verifiedRules?: number;
}

export interface WhsMe {
  company: { id: string; name: string; kind: 'registered' | 'own' | 'demo' };
  user: { id: string; name: string };
  roles: string[];
  roleLabels: string[];
  whsRoleLabels: string[];
  solo: boolean;
  can: WhsCan;
  people: { id: string; name: string }[];
  departments: { id: string; name: string }[];
  sites: { id: string; code: string; name: string; packs: SitePack[] }[];
  matrix: Matrix;
  matrixVersion: number;
  confidentialReaders: { names: string[]; fallback: boolean };
  healthOfficers: number;
  lists: {
    hazardCategories: Labels;
    hazardStatus: Labels;
    confidentialCategories: string[];
    raKinds: Labels;
    raStatus: Labels;
    reviewTriggers: Labels;
    hierarchy: Labels;
    effectiveness: Labels;
    incidentKinds: Labels;
    incidentStatus: Labels;
    outcomes: Labels;
    severities: Labels;
    notificationStatus: Labels;
    submissionMethods: Labels;
    invMethods: Labels;
    fishbone: Labels;
    actionStatus: Labels;
    actionKinds: Labels;
    actionSources: Labels;
    liveActionSources: string[];
    priorities: Labels;
    instrumentKinds: Labels;
    instrumentNotes: Labels;
  };
  notice: string;
}

export const useWhsMe = (companyId: string) => useQuery({ queryKey: ['whs', companyId, 'me'], queryFn: () => get<WhsMe>(whsPath(companyId, '/me')), retry: false, enabled: !!companyId });

export interface WhsFile {
  id: string;
  name: string;
  mime: string;
  size: number;
  isImage: boolean;
  uploadedBy: string | null;
  uploadedByName: string | null;
  createdAt: number;
  url: string;
}
export interface WhsEvent {
  id: string;
  action: string;
  summary: string;
  actorName: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  at: number;
}
export interface WhsComment {
  id: string;
  kind: 'note' | 'consultation';
  body: string;
  authorName: string | null;
  at: number;
}
export interface WhsLink {
  type: string;
  typeLabel: string;
  id: string;
  number: string;
  title: string;
  status: string;
}

export interface Hazard {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  siteId: string | null;
  siteName: string | null;
  location: string;
  departmentId: string | null;
  departmentName: string | null;
  assetId: string | null;
  assetLabel: string | null;
  activity: string;
  peopleExposed: string;
  consequenceText: string;
  existingControls: string;
  proposedControls: string;
  likelihood: number | null;
  consequence: number | null;
  riskLevel: string | null;
  riskLabel: string;
  riskRank: number | null;
  high: boolean;
  residualLikelihood: number | null;
  residualConsequence: number | null;
  residualLevel: string | null;
  residualLabel: string;
  responsibleId: string | null;
  responsibleName: string | null;
  dueDate: string | null;
  overdue: boolean;
  status: string;
  statusLabel: string;
  confidential: boolean;
  reportedByName: string | null;
  reportedAt: number;
  assessedAt: number | null;
  assessedByName: string | null;
  verifiedAt: number | null;
  verifiedByName: string | null;
  verificationNote: string;
  closedAt: number | null;
  closureNote: string;
  mine: boolean;
}

export interface Action {
  id: string;
  number: string;
  title: string;
  description: string;
  kind: string;
  kindLabel: string;
  sourceType: string;
  sourceLabel: string;
  sourceId: string | null;
  sourceNumber: string | null;
  hierarchy: string | null;
  hierarchyLabel: string;
  priority: string;
  priorityLabel: string;
  responsibleId: string | null;
  responsibleName: string | null;
  dueDate: string | null;
  overdue: boolean;
  evidenceRequired: boolean;
  evidenceNote: string;
  evidenceCount: number;
  status: string;
  statusLabel: string;
  confidential: boolean;
  completedAt: number | null;
  completedByName: string | null;
  completionNote: string;
  verifiedAt: number | null;
  verifiedByName: string | null;
  verificationNote: string;
  verifySod: boolean;
  closedAt: number | null;
  closedByName: string | null;
  closureNote: string;
  closeSod: boolean;
  createdAt: number;
  createdByName: string | null;
}

export interface Incident {
  id: string;
  number: string;
  kind: string;
  kindLabel: string;
  title: string;
  description: string;
  occurredDate: string;
  occurredTime: string;
  occurredAt: number;
  siteId: string | null;
  siteName: string | null;
  location: string;
  status: string;
  statusLabel: string;
  confidential: boolean;
  reportedByName: string | null;
  reportedAt: number;
  serious: boolean;
  full: boolean;
  awareAt?: number;
  departmentId?: string | null;
  departmentName?: string | null;
  activity?: string;
  peopleInvolved?: string;
  witnesses?: string;
  assetId?: string | null;
  assetLabel?: string | null;
  assetsText?: string;
  immediateResponse?: string;
  firstAid?: boolean;
  initialNotification?: string;
  outcome?: string;
  outcomeLabel?: string;
  bodyPart?: string;
  injuryNature?: string;
  severity?: string;
  severityLabel?: string;
  investigationRequired?: boolean;
  potentiallyNotifiable?: boolean;
  notificationStatus?: string;
  notificationLabel?: string;
  respondedAt?: number | null;
  respondedByName?: string | null;
  classifiedAt?: number | null;
  classifiedByName?: string | null;
  closedAt?: number | null;
  closedByName?: string | null;
  closureNote?: string;
}

export interface Investigation {
  id: string;
  number: string;
  leadId: string | null;
  leadName: string | null;
  status: string;
  statusLabel: string;
  method: string;
  methodLabel: string;
  scope: string;
  whys: string[];
  fishbone: Record<string, string[]>;
  rootCause: string;
  factors: string[];
  failedControls: { control: string; hierarchy?: string | null; why?: string }[];
  findings: string;
  team: { id: string; name: string }[];
  timeline: { id: string; at: string; description: string; byName: string | null }[];
  statements: { id: string; witness: string; takenOn: string | null; statement: string; takenByName: string | null; createdAt: number }[] | null;
  statementCount: number;
  files: WhsFile[];
  submittedAt: number | null;
  approvedAt: number | null;
  approvedByName: string | null;
  approvalNote: string;
  approvalSod: boolean;
  can: { edit: boolean; submit: boolean; approve: boolean };
}

export interface IncidentView {
  incident: Incident;
  investigation: Investigation | null;
  actions: Action[];
  links: WhsLink[];
  files: WhsFile[];
  comments: WhsComment[];
  history: WhsEvent[];
  revisions: { id: string; at: number; changes: { field: string; before: unknown; after: unknown }[] }[];
  healthRecorded: boolean;
  can: Record<'edit' | 'respond' | 'classify' | 'investigate' | 'toCorrective' | 'toVerification' | 'close' | 'reopen' | 'health' | 'notify' | 'actions' | 'comment' | 'consult' | 'addFiles', boolean>;
}

export interface RuleSnapshot {
  id: string;
  key: string;
  version: number;
  title: string;
  provision: string;
  sourceUrl: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  body: string;
  deadlineMinutes: number | null;
  deadlineText: string;
  requiredInfo: string[];
  sitePreservation: string;
  responsibleParty: string;
  procedure: string;
  regulator: string;
  notifyUrl: string;
  verification: string;
  verifiedAt: number | null;
  verifiedSource: string;
}

export interface RuleCheck {
  id: string;
  packId: string;
  pack: { id: string; code: string; name: string; regulator: string } | null;
  ruleKey: string;
  ruleVersion: number;
  rule: RuleSnapshot | null;
  verified: boolean;
  matches: boolean | null;
  dueAt: number | null;
  dueNote: string;
  evaluatedAt: number;
}

export interface Notice {
  id: string;
  packId: string;
  packName: string | null;
  regulator: string;
  status: string;
  statusLabel: string;
  decision: string | null;
  decisionReasons: string;
  decidedAt: number | null;
  decidedByName: string | null;
  responsibleId: string | null;
  responsibleName: string | null;
  dueAt: number | null;
  dueNote: string;
  checklist: { text: string; done: boolean }[];
  method: string | null;
  methodLabel: string;
  submittedAt: number | null;
  submittedByName: string | null;
  reference: string | null;
  submissionNotes: string;
  recordedAt: number | null;
  recordedByName: string | null;
  example: boolean;
  files: WhsFile[];
}

export interface NotificationView {
  incident: { id: string; number: string; siteId: string | null; siteName: string | null; occurredDate: string; potentiallyNotifiable: boolean; notificationStatus: string; notificationLabel: string };
  packs: { id: string; code: string; name: string; regulator: string; regulatorUrl: string }[];
  checks: RuleCheck[];
  evaluations: number;
  notices: Notice[];
  notice: string;
  noSubmission: string;
  can: { decide: boolean; evaluate: boolean };
}

export interface RaControl {
  id?: string;
  stage: 'existing' | 'additional';
  hierarchy: string;
  hierarchyLabel?: string;
  description: string;
  effectiveness?: string;
  effectivenessLabel?: string;
  responsibleId?: string | null;
  responsibleName?: string | null;
}
export interface RaLine {
  id: string;
  stepId: string | null;
  hazardId: string | null;
  hazardNumber: string | null;
  hazard: string;
  harm: string;
  persons: string;
  likelihood: number;
  consequence: number;
  level: string;
  levelLabel: string;
  rank: number;
  high: boolean;
  residualLikelihood: number | null;
  residualConsequence: number | null;
  residualLevel: string | null;
  residualLabel: string;
  responsibleId: string | null;
  responsibleName: string | null;
  controls: RaControl[];
  warnings: string[];
}
export interface RiskAssessment {
  id: string;
  number: string;
  revision: number;
  kind: string;
  kindLabel: string;
  title: string;
  activity: string;
  scope: string;
  siteId: string | null;
  siteName: string | null;
  location: string;
  assetLabel: string | null;
  responsibleId: string | null;
  responsibleName: string | null;
  reviewDate: string | null;
  reviewDue: boolean;
  status: string;
  statusLabel: string;
  confidential: boolean;
  reviewTrigger: string;
  reviewTriggerLabel: string;
  reviewReason: string;
  draftedByName: string | null;
  submittedAt: number | null;
  approvedAt: number | null;
  approvedByName: string | null;
  approvalNote: string;
  approvalSod: boolean;
  warningsAcknowledged: boolean;
  createdAt: number;
}
export interface RaView {
  assessment: RiskAssessment;
  matrix: Matrix | null;
  steps: { id: string; seq: number; step: string }[];
  lines: RaLine[];
  warnings: string[];
  revisions: { id: string; revision: number; status: string; statusLabel: string; trigger: string; reason: string; approvedAt: number | null; createdAt: number }[];
  actions: Action[];
  links: WhsLink[];
  files: WhsFile[];
  comments: WhsComment[];
  history: WhsEvent[];
  can: Record<'edit' | 'submit' | 'approve' | 'revise' | 'cancel' | 'consult', boolean>;
}

export interface Instrument {
  id: string;
  packId: string;
  kind: string;
  kindLabel: string;
  kindNote: string;
  title: string;
  citation: string;
  industry: string;
  sourceUrl: string;
  effectiveFrom: string | null;
  amendedAt: string | null;
  summary: string;
  status: string;
  statusLabel: string;
  verifiedAt: number | null;
  verifiedSource: string;
  verifiedNotes: string;
  verifiedByName: string | null;
  sourceCheck: string;
}
export interface Rule extends Omit<RuleSnapshot, 'verification'> {
  packId: string;
  kind: string;
  kindLabel: string;
  instrumentId: string | null;
  criteria: { kinds?: string[]; outcomes?: string[]; severities?: string[] };
  deadlineFrom: 'awareness' | 'occurrence';
  retention: string;
  changeNote: string;
  sourceCheck: string;
  status: string;
  statusLabel: string;
  verification: string;
  verificationLabel: string;
  verifiedNotes: string;
  verifySod: boolean;
  reviewedAt: number | null;
  reviewNotes?: string;
  reviewSod: boolean;
  activatedAt: number | null;
  submittedAt: number | null;
  draftedByName?: string | null;
  reviewedByName?: string | null;
  verifiedByName?: string | null;
  applies: boolean;
}
export interface Pack {
  id: string;
  code: string;
  country: string;
  region: string;
  name: string;
  framework: string;
  regulator: string;
  regulatorUrl: string;
  assignable: boolean;
  coverage: string;
  notes: string;
  version: number;
  counts?: { instruments: number; rules: number; verifiedRules: number; verifiedInstruments: number };
  openVersions?: number;
}

export interface WhsAlert {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  emailed: boolean;
  at: number;
}

export const DAY_MS = 86_400_000;
export const dateTimeText = (t: number | null | undefined) => (t ? new Date(t).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');
export function dateText(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
export const dayText = (t: number | null | undefined) => (t ? new Date(t).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function localTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
/** A local date and time (from the form) as milliseconds, in this computer's time zone. */
export function localMs(date: string, time: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time || '00:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm).getTime();
}
