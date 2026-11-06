import { describe, expect, it } from 'vitest';
import { COLUMN_TYPES } from '../src/shared/columns';
import { createBoard, signup } from './helpers';

describe('columns (critical test 6)', () => {
  it('adds every column type', async () => {
    const c = await signup();
    const b = await createBoard(c);
    for (const type of COLUMN_TYPES) {
      const col = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: `Col ${type}`, type });
      expect(col.type).toBe(type);
    }
    expect((await c.req('POST', `/api/boards/${b.board.id}/columns`, { title: 'x', type: 'magic' })).status).toBe(400);
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.columns.length).toBe(4 + COLUMN_TYPES.length);
  });

  it('renames, reorders, resizes, hides and positions columns', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const [person, status] = b.columns;
    const after = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Notes', type: 'text', afterColumnId: person.id });
    let bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.columns.map((x: any) => x.id).slice(0, 3)).toEqual([person.id, after.id, status.id]);
    await c.json('PATCH', `/api/columns/${after.id}`, { title: 'Comments', width: 300, hidden: true, position: -1 });
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.columns[0]).toMatchObject({ id: after.id, title: 'Comments', width: 300, hidden: true });
  });

  it('configures status labels with colours and done flags', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const status = b.columns[1];
    const labels = [
      { id: 'new', label: 'New', color: '#111111' },
      { id: 'shipped', label: 'Shipped', color: '#00a36c', done: true },
    ];
    const updated = await c.json('PATCH', `/api/columns/${status.id}`, { settings: { labels } });
    expect(updated.settings.labels).toEqual(labels);
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x', values: { [status.id]: 'shipped' } });
    expect(it.completedAt).toBeGreaterThan(0);
  });

  it('enforces validation rules and required columns', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const num = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Score', type: 'number', settings: { min: 0, max: 10 } });
    const code = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Code', type: 'text', settings: { pattern: '^[A-Z]{3}$' }, required: true });
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x' });
    expect((await c.req('PATCH', `/api/items/${it.id}`, { values: { [num.id]: 11 } })).status).toBe(422);
    expect((await c.req('PATCH', `/api/items/${it.id}`, { values: { [num.id]: 7 } })).status).toBe(200);
    expect((await c.req('PATCH', `/api/items/${it.id}`, { values: { [code.id]: 'abcd' } })).status).toBe(422);
    expect((await c.req('PATCH', `/api/items/${it.id}`, { values: { [code.id]: 'ABC' } })).status).toBe(200);
    expect((await c.req('PATCH', `/api/items/${it.id}`, { values: { [code.id]: null } })).status).toBe(422);
  });

  it('converts column types safely and refuses unsafe conversions', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const text = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Phase', type: 'text' });
    const i1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'a', values: { [text.id]: 'Alpha' } });
    const i2 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'b', values: { [text.id]: 'Beta' } });
    const asStatus = await c.json('PATCH', `/api/columns/${text.id}`, { type: 'status' });
    expect(asStatus.type).toBe('status');
    const labels = asStatus.settings.labels.map((l: any) => l.label);
    expect(labels).toEqual(expect.arrayContaining(['Alpha', 'Beta']));
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    const v1 = bundle.items.find((i: any) => i.id === i1.id).values[text.id];
    expect(asStatus.settings.labels.find((l: any) => l.id === v1).label).toBe('Alpha');
    // status -> text restores text
    await c.json('PATCH', `/api/columns/${text.id}`, { type: 'text' });
    const back = await c.json('GET', `/api/items/${i2.id}`);
    expect(back.item.values[text.id]).toBe('Beta');
    // number <-> currency
    const n = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Amount', type: 'number' });
    await c.json('PATCH', `/api/items/${i1.id}`, { values: { [n.id]: 12.5 } });
    await c.json('PATCH', `/api/columns/${n.id}`, { type: 'currency' });
    expect((await c.json('GET', `/api/items/${i1.id}`)).item.values[n.id]).toBe(12.5);
    // date -> timeline
    const d = b.columns.find((x: any) => x.type === 'date');
    await c.json('PATCH', `/api/items/${i1.id}`, { values: { [d.id]: '2026-04-01' } });
    await c.json('PATCH', `/api/columns/${d.id}`, { type: 'timeline' });
    expect((await c.json('GET', `/api/items/${i1.id}`)).item.values[d.id]).toEqual({ start: '2026-04-01', end: '2026-04-01' });
    // unsafe
    const files = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'F', type: 'files' });
    expect((await c.req('PATCH', `/api/columns/${files.id}`, { type: 'text' })).status).toBe(400);
    expect((await c.req('PATCH', `/api/columns/${n.id}`, { type: 'person' })).status).toBe(400);
  });

  it('computes formula, created/updated date and progress columns (never stored)', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const price = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Price', type: 'number' });
    const qty = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Qty', type: 'number' });
    const total = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Total', type: 'formula', settings: { formula: '{Price} * {Qty}' } });
    expect((await c.req('POST', `/api/boards/${b.board.id}/columns`, { title: 'Bad', type: 'formula', settings: { formula: '1 +' } })).status).toBe(400);
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x', values: { [price.id]: 3, [qty.id]: 4 } });
    expect((await c.req('PATCH', `/api/items/${it.id}`, { values: { [total.id]: 99 } })).status).toBe(422);
    const chart = await c.json('POST', `/api/boards/${b.board.id}/chart`, { groupBy: 'group', metric: { kind: 'sum', columnId: total.id } });
    expect(chart.segments.reduce((s: number, x: any) => s + x.value, 0)).toBe(12);
    // Formula referencing a renamed column fails gracefully (value null) rather than crashing.
    await c.json('PATCH', `/api/columns/${qty.id}`, { title: 'Quantity' });
    const chart2 = await c.json('POST', `/api/boards/${b.board.id}/chart`, { groupBy: 'group', metric: { kind: 'sum', columnId: total.id } });
    expect(chart2.segments.reduce((s: number, x: any) => s + x.value, 0)).toBe(0);
    // Progress from subitems is calculated, not editable.
    const prog = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Progress', type: 'progress', settings: { mode: 'subitems' } });
    expect((await c.req('PATCH', `/api/items/${it.id}`, { values: { [prog.id]: 50 } })).status).toBe(422);
  });

  it('deleting a column removes its values from all items', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const col = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Temp', type: 'text' });
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x', values: { [col.id]: 'value' } });
    await c.json('DELETE', `/api/columns/${col.id}`, {});
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.columns.map((x: any) => x.id)).not.toContain(col.id);
    expect(bundle.items.find((i: any) => i.id === it.id).values[col.id]).toBeUndefined();
  });

  it('board default values are validated and applied to new items', async () => {
    const c = await signup();
    const b = await createBoard(c);
    const status = b.columns[1];
    expect((await c.req('PATCH', `/api/boards/${b.board.id}`, { settings: { defaultValues: { [status.id]: 'bogus' } } })).status).toBe(422);
    await c.json('PATCH', `/api/boards/${b.board.id}`, { settings: { defaultValues: { [status.id]: 'working' } } });
    const it = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'defaulted' });
    expect(it.values[status.id]).toBe('working');
  });
});
