// Custom fields on the modules framework's records (batch 2, item 3): an ERP administrator adds fields of their own to
// any kind of record (text, long text, number, money, date, a choice or yes/no), shown in a "Custom fields" section of its
// forms and page, in lists when asked, in CSV export and import, and checked on the server like every other field. Each
// is the company's own (erp_custom_fields); values are kept in the record under the field's key (cf_...). Archiving a
// field hides it and keeps the values; its type never changes, so a value is never read as another kind.

import { HttpError, now, parseJson } from '../../lib/util';
import { OBJECT_BY_KEY, type FieldDef, type ObjectDef } from '../../../shared/erp-objects';

export const CUSTOM_TYPES = ['text', 'textarea', 'number', 'money', 'date', 'select', 'bool'] as const;
export type CustomType = (typeof CUSTOM_TYPES)[number];
export const CUSTOM_TYPE_LABELS: Record<CustomType, string> = { text: 'Text', textarea: 'Long text', number: 'Number', money: 'Money', date: 'Date', select: 'Choice', bool: 'Yes or no' };
export const MAX_CUSTOM_FIELDS = 30;

interface Row {
  company_id: string;
  object: string;
  key: string;
  label: string;
  type: CustomType;
  options_json: string;
  required: number;
  list: number;
  help: string;
  position: number;
  archived_at: number | null;
  created_at: number;
  updated_at: number;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30) || 'field';

function toField(r: Row): FieldDef {
  const options = parseJson<{ key: string; label: string }[]>(r.options_json, []);
  return {
    key: r.key,
    label: r.label,
    type: r.type,
    section: 'Custom fields',
    required: !!r.required,
    list: !!r.list,
    filter: r.type === 'select' || r.type === 'bool',
    ...(r.type === 'select' ? { options: Object.fromEntries(options.map((o) => [o.key, o.label])) } : {}),
    ...(r.type === 'text' ? { max: 500 } : r.type === 'textarea' ? { max: 5000 } : {}),
    ...(r.type === 'number' ? { min: -1e12, max: 1e12 } : r.type === 'money' ? { min: -1e13, max: 1e13 } : {}),
    ...(r.help ? { help: r.help } : {}),
    custom: true,
  } as FieldDef;
}

async function rows(db: D1Database, companyId: string, object: string, archived = false): Promise<Row[]> {
  return (await db.prepare(`SELECT * FROM erp_custom_fields WHERE company_id = ? AND object = ?${archived ? '' : ' AND archived_at IS NULL'} ORDER BY position, created_at`).bind(companyId, object).all<Row>()).results;
}

/** The definition with the company's custom fields after its own. */
export async function withCustom(db: D1Database, companyId: string, def: ObjectDef): Promise<ObjectDef> {
  const extra = await rows(db, companyId, def.key);
  if (!extra.length) return def;
  return { ...def, fields: [...def.fields, ...extra.map(toField)] };
}

export function customDTO(r: Row) {
  return { key: r.key, label: r.label, type: r.type, typeLabel: CUSTOM_TYPE_LABELS[r.type], options: parseJson<{ key: string; label: string }[]>(r.options_json, []), required: !!r.required, list: !!r.list, help: r.help, position: r.position, archived: !!r.archived_at };
}

export async function listCustom(db: D1Database, companyId: string, object: string) {
  if (!OBJECT_BY_KEY[object]) throw new HttpError(404, 'Kind of record not found');
  return (await rows(db, companyId, object, true)).map(customDTO);
}

function cleanOptions(type: CustomType, options: unknown): { key: string; label: string }[] {
  if (type !== 'select') return [];
  if (!Array.isArray(options)) throw new HttpError(400, 'Give the choices');
  const out: { key: string; label: string }[] = [];
  for (const o of options) {
    const label = String(typeof o === 'object' && o ? ((o as any).label ?? '') : o).trim().slice(0, 80);
    if (!label) continue;
    let key = (typeof o === 'object' && o && typeof (o as any).key === 'string' ? (o as any).key : slug(label)).slice(0, 40);
    while (out.some((x) => x.key === key)) key = `${key}_2`.slice(0, 40);
    out.push({ key, label });
  }
  if (out.length < 2) throw new HttpError(400, 'A choice needs at least two options');
  if (out.length > 50) throw new HttpError(400, 'At most 50 choices');
  return out;
}

export async function addCustom(db: D1Database, companyId: string, userId: string, object: string, input: { label: string; type: CustomType; options?: unknown; required?: boolean; list?: boolean; help?: string }) {
  const def = OBJECT_BY_KEY[object];
  if (!def) throw new HttpError(404, 'Kind of record not found');
  const label = input.label.trim().slice(0, 80);
  if (!label) throw new HttpError(400, 'Give the field a name');
  if (!CUSTOM_TYPES.includes(input.type)) throw new HttpError(400, 'Choose the kind of field');
  const all = await rows(db, companyId, object, true);
  if (all.filter((r) => !r.archived_at).length >= MAX_CUSTOM_FIELDS) throw new HttpError(409, `At most ${MAX_CUSTOM_FIELDS} custom fields on ${def.plural.toLowerCase()}`);
  if ([...def.fields.map((f) => f.label), ...all.filter((r) => !r.archived_at).map((r) => r.label)].some((l) => l.toLowerCase() === label.toLowerCase())) throw new HttpError(409, `${def.plural} already have a field called ${label}`);
  let key = `cf_${slug(label)}`;
  for (let i = 2; all.some((r) => r.key === key) || def.fields.some((f) => f.key === key); i++) key = `cf_${slug(label).slice(0, 26)}_${i}`;
  const t = now();
  await db
    .prepare('INSERT INTO erp_custom_fields (company_id, object, key, label, type, options_json, required, list, help, position, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(companyId, object, key, label, input.type, JSON.stringify(cleanOptions(input.type, input.options)), input.required ? 1 : 0, input.list ? 1 : 0, (input.help ?? '').trim().slice(0, 200), all.length, userId, t, t)
    .run();
  return listCustom(db, companyId, object);
}

export async function changeCustom(db: D1Database, companyId: string, object: string, key: string, input: { label?: string; options?: unknown; required?: boolean; list?: boolean; help?: string; archived?: boolean; position?: number }) {
  const r = await db.prepare('SELECT * FROM erp_custom_fields WHERE company_id = ? AND object = ? AND key = ?').bind(companyId, object, key).first<Row>();
  if (!r) throw new HttpError(404, 'Custom field not found');
  const label = input.label !== undefined ? input.label.trim().slice(0, 80) : r.label;
  if (!label) throw new HttpError(400, 'Give the field a name');
  let options = parseJson<{ key: string; label: string }[]>(r.options_json, []);
  if (input.options !== undefined && r.type === 'select') {
    // choices keep their keys (values already given stay readable); new ones get new keys
    const next = cleanOptions('select', input.options);
    for (const o of options) if (!next.some((n) => n.key === o.key) && !next.some((n) => n.label === o.label)) next.push({ ...o, label: `${o.label} (no longer offered)` });
    options = next;
  }
  if (input.archived === false && r.archived_at) {
    const active = await rows(db, companyId, object);
    if (active.length >= MAX_CUSTOM_FIELDS) throw new HttpError(409, `At most ${MAX_CUSTOM_FIELDS} custom fields`);
    if (active.some((x) => x.label.toLowerCase() === label.toLowerCase())) throw new HttpError(409, `Another field is called ${label}: rename one first`);
  }
  if (input.label !== undefined && !r.archived_at) {
    const def = OBJECT_BY_KEY[object];
    const clash = [...(def?.fields.map((f) => f.label) ?? []), ...(await rows(db, companyId, object)).filter((x) => x.key !== key).map((x) => x.label)];
    if (clash.some((l) => l.toLowerCase() === label.toLowerCase())) throw new HttpError(409, `Another field is called ${label}`);
  }
  await db
    .prepare('UPDATE erp_custom_fields SET label = ?, options_json = ?, required = ?, list = ?, help = ?, position = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND object = ? AND key = ?')
    .bind(label, JSON.stringify(options), (input.required ?? !!r.required) ? 1 : 0, (input.list ?? !!r.list) ? 1 : 0, input.help !== undefined ? input.help.trim().slice(0, 200) : r.help, input.position ?? r.position, input.archived === undefined ? r.archived_at : input.archived ? now() : null, now(), companyId, object, key)
    .run();
  return listCustom(db, companyId, object);
}
