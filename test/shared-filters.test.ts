import { describe, expect, it } from 'vitest';
import { matchFilter, sanitizeFilter, sortItems, isItemDone, operatorsFor } from '../src/shared/filters';

const columns = new Map<string, any>([
  ['st', { id: 'st', title: 'Status', type: 'status', settings: { labels: [{ id: 'todo', label: 'To do', color: '#000000' }, { id: 'done', label: 'Done', color: '#00ff00', done: true }] } }],
  ['n', { id: 'n', title: 'Points', type: 'number', settings: {} }],
  ['d', { id: 'd', title: 'Due', type: 'date', settings: {} }],
  ['o', { id: 'o', title: 'Owner', type: 'person', settings: {} }],
  ['t', { id: 't', title: 'Tags', type: 'tags', settings: {} }],
  ['c', { id: 'c', title: 'Check', type: 'checkbox', settings: {} }],
]);

const mk = (id: string, name: string, values: Record<string, unknown>) => ({ id, name, boardId: 'b', groupId: 'g', createdAt: Date.parse('2026-01-05T10:00:00Z'), updatedAt: 0, values });
const items = [
  mk('1', 'Alpha task', { st: 'todo', n: 5, d: '2026-01-09', o: 'u1', t: ['red'] }),
  mk('2', 'Beta', { st: 'done', n: 1, d: '2026-01-01', o: 'u2', c: true }),
  mk('3', 'Gamma', { n: 10, d: '2026-01-20' }),
];
const ctx = { columns, currentUserId: 'u1', today: '2026-01-10' };
const ids = (f: any) => items.filter((i) => matchFilter(i, f, ctx)).map((i) => i.id);

describe('filter engine', () => {
  it('empty filter matches all', () => expect(ids({ op: 'and', rules: [] })).toEqual(['1', '2', '3']));
  it('text operators', () => {
    expect(ids({ op: 'and', rules: [{ field: 'name', op: 'contains', value: 'alp' }] })).toEqual(['1']);
    expect(ids({ op: 'and', rules: [{ field: 'name', op: 'not_contains', value: 'a' }] })).toEqual([]);
  });
  it('label, number, person, tags, checkbox', () => {
    expect(ids({ op: 'and', rules: [{ field: 'st', op: 'is', value: 'done' }] })).toEqual(['2']);
    expect(ids({ op: 'and', rules: [{ field: 'st', op: 'is_empty' }] })).toEqual(['3']);
    expect(ids({ op: 'and', rules: [{ field: 'n', op: 'gte', value: 5 }] })).toEqual(['1', '3']);
    expect(ids({ op: 'and', rules: [{ field: 'n', op: 'between', value: [2, 9] }] })).toEqual(['1']);
    expect(ids({ op: 'and', rules: [{ field: 'o', op: 'includes_me' }] })).toEqual(['1']);
    expect(ids({ op: 'and', rules: [{ field: 'o', op: 'any_of', value: ['u2'] }] })).toEqual(['2']);
    expect(ids({ op: 'and', rules: [{ field: 't', op: 'contains', value: 'red' }] })).toEqual(['1']);
    expect(ids({ op: 'and', rules: [{ field: 'c', op: 'is', value: true }] })).toEqual(['2']);
  });
  it('date operators', () => {
    expect(ids({ op: 'and', rules: [{ field: 'd', op: 'overdue' }] })).toEqual(['1']); // item 2 is done
    expect(ids({ op: 'and', rules: [{ field: 'd', op: 'before', value: '2026-01-05' }] })).toEqual(['2']);
    expect(ids({ op: 'and', rules: [{ field: 'd', op: 'within_next_days', value: 14 }] })).toEqual(['3']);
    expect(ids({ op: 'and', rules: [{ field: 'd', op: 'this_week' }] })).toEqual(['1']);
    expect(ids({ op: 'and', rules: [{ field: 'created_at', op: 'on', value: '2026-01-05' }] })).toEqual(['1', '2', '3']);
  });
  it('AND / OR nesting', () => {
    const f = { op: 'or', rules: [{ field: 'st', op: 'is', value: 'done' }, { op: 'and', rules: [{ field: 'n', op: 'gt', value: 4 }, { field: 'name', op: 'contains', value: 'gam' }] }] };
    expect(ids(f)).toEqual(['2', '3']);
  });
  it('done pseudo field', () => {
    expect(ids({ op: 'and', rules: [{ field: 'done', op: 'is' }] })).toEqual(['2']);
    expect(ids({ op: 'and', rules: [{ field: 'done', op: 'is_not' }] })).toEqual(['1', '3']);
    expect(isItemDone(items[1], columns)).toBe(true);
  });
  it('sanitizeFilter drops junk and limits depth', () => {
    const s = sanitizeFilter({ op: 'xor', rules: [null, 'x', { field: 1, op: 'is' }, { field: 'name', op: 'is', value: 'a' }, { rules: [{ rules: [{ rules: [{ rules: [{ rules: [{ rules: [] }] }] }] }] }] }] });
    expect(s.op).toBe('and');
    expect(s.rules.length).toBe(2);
    expect(sanitizeFilter('nope')).toEqual({ op: 'and', rules: [] });
  });
  it('sorting with empties last', () => {
    expect(sortItems(items, [{ field: 'n', dir: 'desc' }], ctx).map((i) => i.id)).toEqual(['3', '1', '2']);
    expect(sortItems(items, [{ field: 'st', dir: 'asc' }], ctx).map((i) => i.id)).toEqual(['1', '2', '3']);
    expect(sortItems(items, [{ field: 'st', dir: 'desc' }], ctx).map((i) => i.id)).toEqual(['2', '1', '3']);
  });
  it('operators per field', () => {
    expect(operatorsFor('name', columns)).toContain('contains');
    expect(operatorsFor('d', columns)).toContain('overdue');
    expect(operatorsFor('unknown', columns)).toEqual([]);
  });
});
