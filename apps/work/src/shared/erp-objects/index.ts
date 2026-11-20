// The registry of the ERP modules framework: every module and kind of record, checked once when it loads (a mistake in a
// definition fails the build's tests, never a customer's request). Shared by the server and the screens.
import type { FieldDef, ModuleDef, ObjectDef } from './types';
import { ALL_ROLE_LABELS } from './roles';
import { CORE_MODULES, CORE_OBJECTS } from './defs/core';
import { SALES_MODULES, SALES_OBJECTS } from './defs/sales';
import { OPERATIONS_MODULES, OPERATIONS_OBJECTS } from './defs/operations';
import { PEOPLE_MODULES, PEOPLE_OBJECTS } from './defs/people';
import { INDUSTRY_MODULES, INDUSTRY_OBJECTS } from './defs/industry';

export * from './types';
export * from './roles';

export const OBJECTS: readonly ObjectDef[] = [...CORE_OBJECTS, ...SALES_OBJECTS, ...OPERATIONS_OBJECTS, ...PEOPLE_OBJECTS, ...INDUSTRY_OBJECTS];
export const MODULE_DEFS: readonly ModuleDef[] = [...CORE_MODULES, ...SALES_MODULES, ...OPERATIONS_MODULES, ...PEOPLE_MODULES, ...INDUSTRY_MODULES];

export const OBJECT_BY_KEY: Readonly<Record<string, ObjectDef>> = Object.fromEntries(OBJECTS.map((o) => [o.key, o]));
export const MODULE_BY_KEY: Readonly<Record<string, ModuleDef>> = Object.fromEntries(MODULE_DEFS.map((m) => [m.key, m]));

/** The module switches (Admin Control Centre) the framework's modules answer to, with their labels. */
export const FRAMEWORK_SWITCHES = {
  organisation: 'Organisation, documents and workflow',
  finance_plus: 'Fixed assets and revenue recognition',
  commercial: 'Marketing, contracts, pricing, commissions and subscriptions',
  services: 'Customer and field service',
  workforce: 'Timesheets and resource planning',
  people: 'People and HR',
  payroll: 'Payroll',
  trade: 'Trade compliance, invoice matching and subcontracting',
  calibration: 'Calibration',
  environment: 'Environment',
  fleet: 'Fleet and transportation',
  industry: 'Industry solutions',
} as const;
export type FrameworkSwitch = keyof typeof FRAMEWORK_SWITCHES;

// The workflow rule picks any kind of record and any role.
const wf = OBJECT_BY_KEY.wf_rule;
if (wf) {
  const objects = Object.fromEntries(OBJECTS.filter((o) => o.key !== 'wf_rule').map((o) => [o.key, `${MODULE_BY_KEY[o.module]?.label ?? o.module}: ${o.plural}`]));
  const roles = Object.fromEntries(Object.entries(ALL_ROLE_LABELS));
  for (const f of wf.fields) {
    if (f.key === 'object') f.options = objects;
    if (f.key === 'notifyRole' || f.key === 'escalateRole') f.options = roles;
  }
}

/** The fields of a title template ('{firstName} {lastName}') or the one title field. */
export const titleFields = (o: ObjectDef) => (o.title.includes('{') ? [...o.title.matchAll(/\{(\w+)\}/g)].map((m) => m[1]) : [o.title]);

export const fieldOf = (o: ObjectDef, key: string): FieldDef | undefined => o.fields.find((f) => f.key === key);

/** Every problem with the definitions (empty when they are sound); the tests require none. */
export function registryProblems(): string[] {
  const out: string[] = [];
  const keyRe = /^[a-z][a-z0-9_]{2,39}$/;
  const fieldRe = /^[a-z][a-zA-Z0-9]{0,39}$/;
  const roles = new Set([...Object.keys(ALL_ROLE_LABELS), '*']);
  const seen = new Set<string>();
  for (const o of OBJECTS) {
    const at = `object ${o.key}`;
    if (!keyRe.test(o.key)) out.push(`${at}: bad key`);
    if (seen.has(o.key)) out.push(`${at}: duplicate key`);
    seen.add(o.key);
    if (!MODULE_BY_KEY[o.module]) out.push(`${at}: unknown module ${o.module}`);
    else if (!MODULE_BY_KEY[o.module].objects.includes(o.key)) out.push(`${at}: not listed by its module`);
    if (!/^[A-Z]{1,6}-$/.test(o.prefix)) out.push(`${at}: bad prefix`);
    const fkeys = new Set<string>();
    const checkField = (f: FieldDef, where: string) => {
      if (!fieldRe.test(f.key)) out.push(`${where}: bad field key ${f.key}`);
      if (f.type === 'select' && !f.options) out.push(`${where}: select ${f.key} without options`);
      if (f.type === 'ref') {
        if (!f.ref) out.push(`${where}: ref ${f.key} without a kind`);
        else if (f.ref.startsWith('obj:') && !OBJECT_BY_KEY[f.ref.slice(4)]) out.push(`${where}: ref ${f.key} to unknown ${f.ref}`);
      }
      for (const r of f.sensitive ?? []) if (!roles.has(r)) out.push(`${where}: unknown role ${r} on ${f.key}`);
      if (f.default !== undefined && f.type === 'select' && !Object.hasOwn(f.options ?? {}, String(f.default)) && o.key !== 'wf_rule') out.push(`${where}: default of ${f.key} is not an option`);
    };
    for (const f of o.fields) {
      if (f.showIf && !o.fields.some((x) => x.key === f.showIf!.field && x.type === 'select' && f.showIf!.is.every((v) => Object.hasOwn(x.options ?? {}, v)))) out.push(`${at}: ${f.key} shows for an unknown field or value`);
      if (fkeys.has(f.key)) out.push(`${at}: duplicate field ${f.key}`);
      fkeys.add(f.key);
      checkField(f, at);
    }
    for (const f of o.lines?.fields ?? []) checkField(f, `${at} lines`);
    if (o.lines?.amount) {
      const lk = new Set(o.lines.fields.map((f) => f.key));
      if (!lk.has(o.lines.amount.price) || (o.lines.amount.qty && !lk.has(o.lines.amount.qty))) out.push(`${at}: line amount names unknown fields`);
    }
    for (const t of titleFields(o)) if (!fkeys.has(t)) out.push(`${at}: title field ${t} unknown`);
    const st = new Set(o.statuses.map((s) => s.key));
    if (!st.has(o.initial)) out.push(`${at}: initial status unknown`);
    for (const s of [...(o.editable ?? []), ...(o.closed ?? []), ...(o.lines?.editableIn ?? [])]) if (!st.has(s)) out.push(`${at}: status ${s} unknown`);
    const tk = new Set<string>();
    for (const t of o.transitions) {
      if (tk.has(t.key)) out.push(`${at}: duplicate step ${t.key}`);
      tk.add(t.key);
      if (!st.has(t.to)) out.push(`${at}: step ${t.key} goes to an unknown status`);
      for (const s of t.from) if (!st.has(s)) out.push(`${at}: step ${t.key} from unknown ${s}`);
      for (const r of t.requires ?? []) if (!fkeys.has(r)) out.push(`${at}: step ${t.key} requires unknown ${r}`);
      if (t.cap === 'own' && !o.ownField && !o.assigneeField) out.push(`${at}: step ${t.key} for the own person, but no own field`);
      if (t.cap === 'approve' && !o.access.approve && !o.approveField) out.push(`${at}: approval step ${t.key} without approvers`);
    }
    for (const r of [...o.access.view, ...o.access.edit, ...(o.access.approve ?? [])]) if (!roles.has(r)) out.push(`${at}: unknown role ${r}`);
    const typed = (k: string | undefined, types: string[], what: string) => {
      if (!k) return;
      const f = fieldOf(o, k);
      if (!f) out.push(`${at}: ${what} ${k} unknown`);
      else if (!types.includes(f.type) && !(f.type === 'ref' && types.includes(`ref:${f.ref}`))) out.push(`${at}: ${what} ${k} has the wrong type`);
    };
    typed(o.ownField, ['ref:user', 'ref:obj:hr_employee', 'ref:obj:fl_vehicle'], 'own field');
    typed(o.approveField, ['ref:user'], 'approve field');
    typed(o.assigneeField, ['ref:user'], 'assignee field');
    typed(o.dateField, ['date'], 'date field');
    typed(o.dueField, ['date'], 'due field');
    typed(o.amountField, ['money'], 'amount field');
    typed(o.currencyField, ['currency'], 'currency field');
    if (o.access.selfService && !o.ownField) out.push(`${at}: self service without an own field`);
    for (const r of o.reports ?? []) {
      if (r.by === 'custom' || r.by === 'status') continue;
      const k = r.by.startsWith('month:') ? r.by.slice(6) : r.by;
      if (!fkeys.has(k)) out.push(`${at}: report ${r.key} by unknown ${k}`);
      if (r.sum && !fkeys.has(r.sum)) out.push(`${at}: report ${r.key} sums unknown ${r.sum}`);
    }
  }
  const mkeys = new Set<string>();
  const numbers = new Set<number>();
  for (const m of MODULE_DEFS) {
    if (mkeys.has(m.key)) out.push(`module ${m.key}: duplicate`);
    mkeys.add(m.key);
    if (!Object.hasOwn(FRAMEWORK_SWITCHES, m.switch)) out.push(`module ${m.key}: unknown switch ${m.switch}`);
    for (const k of m.objects) if (!OBJECT_BY_KEY[k] || OBJECT_BY_KEY[k].module !== m.key) out.push(`module ${m.key}: object ${k} is not its own`);
    for (const n of m.catalogue) {
      if (n < 1 || n > 97) out.push(`module ${m.key}: catalogue number ${n}`);
      if (numbers.has(n)) out.push(`module ${m.key}: catalogue number ${n} delivered twice`);
      numbers.add(n);
    }
  }
  return out;
}
