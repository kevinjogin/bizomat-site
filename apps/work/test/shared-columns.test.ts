import { describe, expect, it } from 'vitest';
import {
  COLUMN_TYPES,
  canConvert,
  convertValue,
  getColumnType,
  normalizeColumnValue,
  sanitizeColumnSettings,
  sanitizeLabels,
  isSafeUrl,
} from '../src/shared/columns';
import { computeValues, positionBetween, dueDateOf, assigneesOf } from '../src/shared/items';

const col = (type: string, settings: any = {}, extra: any = {}) => ({ id: 'c1', title: 'Col', type, settings: { ...getColumnType(type).defaultSettings(), ...settings }, ...extra });

describe('column registry', () => {
  it('defines every type', () => {
    expect(COLUMN_TYPES.length).toBe(25);
    for (const t of COLUMN_TYPES) {
      const d = getColumnType(t);
      expect(d.type).toBe(t);
      expect(d.label).toBeTruthy();
      expect(Array.isArray(d.operators)).toBe(true);
    }
    expect(() => getColumnType('nope')).toThrow();
  });

  it('validates values per type', () => {
    expect(normalizeColumnValue(col('number'), '12').ok).toBe(true);
    expect(normalizeColumnValue(col('number'), 'abc').ok).toBe(false);
    expect(normalizeColumnValue(col('number', { min: 0, max: 10 }), 11).ok).toBe(false);
    expect(normalizeColumnValue(col('email'), 'not-an-email').ok).toBe(false);
    expect(normalizeColumnValue(col('email'), 'a@b.co').ok).toBe(true);
    expect(normalizeColumnValue(col('link'), 'javascript:alert(1)').ok).toBe(false);
    expect(normalizeColumnValue(col('link'), 'https://example.com').ok).toBe(true);
    expect(normalizeColumnValue(col('phone'), '+44 20 7946 0958').ok).toBe(true);
    expect(normalizeColumnValue(col('phone'), '<script>').ok).toBe(false);
    expect(normalizeColumnValue(col('date'), '2026-02-30x').ok).toBe(false);
    expect(normalizeColumnValue(col('date'), '2026-02-03').ok).toBe(true);
    expect(normalizeColumnValue(col('timeline'), { start: '2026-02-05', end: '2026-02-01' }).ok).toBe(false);
    expect(normalizeColumnValue(col('timeline'), { start: '2026-02-01', end: '2026-02-05' })).toEqual({ ok: true, value: { start: '2026-02-01', end: '2026-02-05' } });
    expect(normalizeColumnValue(col('status'), 'done')).toEqual({ ok: true, value: 'done' });
    expect(normalizeColumnValue(col('status'), 'Done')).toEqual({ ok: true, value: 'done' });
    expect(normalizeColumnValue(col('status'), 'zzz').ok).toBe(false);
    expect(normalizeColumnValue(col('rating', { max: 5 }), 6).ok).toBe(false);
    expect(normalizeColumnValue(col('progress'), 150).ok).toBe(false);
    expect(normalizeColumnValue(col('checkbox'), true)).toEqual({ ok: true, value: true });
    expect(normalizeColumnValue(col('tags'), 'a, b, a')).toEqual({ ok: true, value: ['a', 'b'] });
    expect(normalizeColumnValue(col('dropdown', { multiple: false }), ['opt1', 'opt1']).ok).toBe(true);
    expect(normalizeColumnValue(col('location'), { address: 'x', lat: 100, lng: 0 }).ok).toBe(false);
    expect(normalizeColumnValue(col('formula'), 1).ok).toBe(false);
    expect(normalizeColumnValue(col('text', { pattern: '^[A-Z]+$' }), 'abc').ok).toBe(false);
    expect(normalizeColumnValue(col('text', {}, { required: true }), '').ok).toBe(false);
  });

  it('converts between compatible types', () => {
    expect(canConvert('text', 'number')).toBe(true);
    expect(canConvert('files', 'text')).toBe(false);
    expect(canConvert('formula', 'number')).toBe(false);
    const status = col('status');
    expect(convertValue(status, 'text', {}, 'done')).toBe('Done');
    expect(convertValue(col('date'), 'timeline', {}, '2026-01-01')).toEqual({ start: '2026-01-01', end: '2026-01-01' });
    expect(convertValue(col('timeline'), 'date', {}, { start: '2026-01-01', end: '2026-01-04' })).toBe('2026-01-04');
    expect(convertValue(col('person'), 'people', {}, 'u1')).toEqual(['u1']);
    expect(convertValue(col('number'), 'currency', { currency: 'USD' }, 5)).toBe(5);
    const prio = sanitizeColumnSettings('priority', {});
    expect(convertValue(status, 'priority', prio, 'done')).toBeNull(); // no "Done" priority label
    expect(convertValue(col('text'), 'number', {}, '42')).toBe(42);
  });

  it('sanitises labels and settings', () => {
    const labels = sanitizeLabels([{ id: 'a', label: 'A', color: 'red' }, { id: 'a', label: 'B', color: '#000000' }, { label: '' }, 'junk']);
    expect(labels).toHaveLength(2);
    expect(labels[0].color).toMatch(/^#/);
    expect(labels[1].id).not.toBe('a');
    const s = sanitizeColumnSettings('currency', { currency: 'eur', decimals: '3', evil: '<x>' });
    // No currency is assumed (12 Nov 2026): an invalid code leaves the column on the project's or organisation's.
    expect(s.currency).toBeUndefined();
    expect(s.currencyMode).toBe('inherit');
    expect(s.decimals).toBe(3);
    expect((s as any).evil).toBeUndefined();
    expect(isSafeUrl('data:text/html,hi')).toBe(false);
  });
});

describe('computed values', () => {
  const columns = [
    { id: 'st', title: 'Status', type: 'status', settings: { labels: [{ id: 'todo', label: 'To do', color: '#000000' }, { id: 'done', label: 'Done', color: '#00ff00', done: true }] } },
    { id: 'v', title: 'Value', type: 'number', settings: {} },
    { id: 'p', title: 'Prob', type: 'percentage', settings: {} },
    { id: 'f', title: 'Forecast', type: 'formula', settings: { formula: '{Value} * {Prob} / 100' } },
    { id: 'f2', title: 'Double', type: 'formula', settings: { formula: '{Forecast} * 2' } },
    { id: 'loop', title: 'Loop', type: 'formula', settings: { formula: '{Loop} + 1' } },
    { id: 'pr', title: 'Progress', type: 'progress', settings: { mode: 'subitems' } },
    { id: 'ca', title: 'Created', type: 'created_at', settings: {} },
  ];
  it('fills formula, created date and subitem progress', () => {
    const item = { id: 'i1', name: 'X', createdAt: 1000, updatedAt: 2000, values: { v: 200, p: 50 } };
    const subs = [
      { id: 's1', name: 'a', createdAt: 0, updatedAt: 0, values: { st: 'done' } },
      { id: 's2', name: 'b', createdAt: 0, updatedAt: 0, values: { st: 'todo' } },
    ];
    const out = computeValues(item, columns as any, { subitemsOf: () => subs });
    expect(out.f).toBe(100);
    expect(out.f2).toBe(200);
    expect(out.loop).toBeNull();
    expect(out.pr).toBe(50);
    expect(out.ca).toBe(1000);
  });

  it('helpers', () => {
    expect(positionBetween(null, null)).toBe(1000);
    expect(positionBetween(1000, 2000)).toBe(1500);
    expect(positionBetween(null, 1000)).toBe(0);
    const cols = [
      { id: 'd', title: 'Due', type: 'date', settings: {} },
      { id: 'o', title: 'Owner', type: 'person', settings: {} },
      { id: 'm', title: 'Team', type: 'people', settings: {} },
    ];
    expect(dueDateOf({ d: '2026-05-01' }, cols as any)).toBe('2026-05-01');
    expect(assigneesOf({ o: 'u1', m: ['u2', 'u1'] }, cols as any).sort()).toEqual(['u1', 'u2']);
  });
});
