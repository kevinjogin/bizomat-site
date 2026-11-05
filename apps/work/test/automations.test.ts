import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { runMaintenance } from '../src/worker/index';
import { addMember, createBoard, signup } from './helpers';

const todayUtc = () => new Date().toISOString().slice(0, 10);

async function setup() {
  const c = await signup();
  const b = await createBoard(c);
  const [person, status, due, priority] = b.columns;
  return { c, b, person, status, due, priority };
}

describe('automations (critical test 9)', () => {
  it('WHEN status changes to Done THEN set completion date', async () => {
    const { c, b, status } = await setup();
    const completed = await c.json('POST', `/api/boards/${b.board.id}/columns`, { title: 'Completed on', type: 'date' });
    const a = await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Stamp completion',
      trigger: { type: 'status_changed', columnId: status.id, to: 'done' },
      actions: [{ type: 'set_date_today', columnId: completed.id }],
    });
    const it1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'task' });
    await c.json('PATCH', `/api/items/${it1.id}`, { values: { [status.id]: 'working' } });
    expect((await c.json('GET', `/api/items/${it1.id}`)).item.values[completed.id]).toBeUndefined();
    await c.json('PATCH', `/api/items/${it1.id}`, { values: { [status.id]: 'done' } });
    expect((await c.json('GET', `/api/items/${it1.id}`)).item.values[completed.id]).toBe(todayUtc());
    const runs = await c.json('GET', `/api/automations/${a.id}/runs`);
    expect(runs).toHaveLength(1);
    expect(runs[0].status).toBe('succeeded');
    const act = await c.json('GET', `/api/items/${it1.id}/activity`);
    expect(act.some((x: any) => x.action === 'value_changed:automation' && x.actorName === 'Automation')).toBe(true);
  });

  it('WHEN item is created THEN assign a user; status change THEN move to group; with conditions', async () => {
    const { c, b, person, status, priority } = await setup();
    const teammate = await signup('Teammate');
    await addMember(c, teammate);
    await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Auto-assign',
      trigger: { type: 'item_created' },
      actions: [{ type: 'assign', columnId: person.id, userId: teammate.userId }],
    });
    await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Move done',
      trigger: { type: 'status_changed', columnId: status.id, to: 'done' },
      conditions: { op: 'and', rules: [{ field: priority.id, op: 'is', value: 'high' }] },
      actions: [{ type: 'move_to_group', groupId: b.groups[2].id }],
    });
    const it1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'one', values: { [priority.id]: 'high' } });
    const it2 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'two', values: { [priority.id]: 'low' } });
    const d1 = await c.json('GET', `/api/items/${it1.id}`);
    expect(d1.item.values[person.id]).toBe(teammate.userId);
    // The assignee is notified about the automated assignment.
    const n = await teammate.json('GET', `/api/notifications?workspaceId=${c.workspaceId}`);
    expect(n.notifications.filter((x: any) => x.type === 'assignment').length).toBe(2);
    await c.json('PATCH', `/api/items/${it1.id}`, { values: { [status.id]: 'done' } });
    await c.json('PATCH', `/api/items/${it2.id}`, { values: { [status.id]: 'done' } });
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.find((i: any) => i.id === it1.id).groupId).toBe(b.groups[2].id);
    expect(bundle.items.find((i: any) => i.id === it2.id).groupId).toBe(b.groups[0].id);
  });

  it('notify action reaches the chosen user with item name substitution', async () => {
    const { c, b } = await setup();
    const other = await signup('Other');
    await addMember(c, other);
    await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Ping',
      trigger: { type: 'item_created' },
      actions: [{ type: 'notify', target: 'user', userId: other.userId, message: 'New: {item} on {board}' }],
    });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Widget' });
    const n = await other.json('GET', `/api/notifications?workspaceId=${c.workspaceId}`);
    const hit = n.notifications.find((x: any) => x.type === 'automation');
    expect(hit.title).toBe(`New: Widget on ${b.board.name}`);
    expect(hit.link).toContain(`/boards/${b.board.id}?item=`);
  });

  it('disabled automations do not run; manual run works', async () => {
    const { c, b, status } = await setup();
    const a = await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Off',
      enabled: false,
      trigger: { type: 'item_created' },
      actions: [{ type: 'set_value', columnId: status.id, value: 'stuck' }],
    });
    const it1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'x' });
    expect((await c.json('GET', `/api/items/${it1.id}`)).item.values[status.id]).toBeUndefined();
    const r = await c.json('POST', `/api/automations/${a.id}/run`, { itemId: it1.id });
    expect(r.status).toBe('succeeded');
    expect((await c.json('GET', `/api/items/${it1.id}`)).item.values[status.id]).toBe('stuck');
    await c.json('PATCH', `/api/automations/${a.id}`, { enabled: true, name: 'On' });
    const list = await c.json('GET', `/api/boards/${b.board.id}/automations`);
    expect(list[0]).toMatchObject({ name: 'On', enabled: true });
    await c.json('DELETE', `/api/automations/${a.id}`, {});
    expect(await c.json('GET', `/api/boards/${b.board.id}/automations`)).toHaveLength(0);
  });

  it('validates references when creating automations', async () => {
    const { c, b, status } = await setup();
    const bad = async (body: any) => (await c.req('POST', `/api/boards/${b.board.id}/automations`, body)).status;
    expect(await bad({ name: 'x', trigger: { type: 'status_changed', columnId: 'nope' }, actions: [{ type: 'archive_item' }] })).toBe(400);
    expect(await bad({ name: 'x', trigger: { type: 'status_changed', columnId: status.id, to: 'nope' }, actions: [{ type: 'archive_item' }] })).toBe(400);
    expect(await bad({ name: 'x', trigger: { type: 'item_created' }, actions: [{ type: 'move_to_group', groupId: 'nope' }] })).toBe(400);
    expect(await bad({ name: 'x', trigger: { type: 'item_created' }, actions: [] })).toBe(400);
    expect(await bad({ name: 'x', trigger: { type: 'recurring', interval: 'daily' }, actions: [{ type: 'archive_item' }] })).toBe(400);
    expect(await bad({ name: 'x', trigger: { type: 'teleport' }, actions: [{ type: 'archive_item' }] })).toBe(400);
  });

  it('prevents infinite loops between automations', async () => {
    const { c, b, status, priority } = await setup();
    const a1 = await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'status->priority',
      trigger: { type: 'column_changed', columnId: status.id },
      actions: [{ type: 'set_value', columnId: priority.id, value: 'high' }],
    });
    const a2 = await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'priority->status',
      trigger: { type: 'column_changed', columnId: priority.id },
      actions: [{ type: 'set_value', columnId: status.id, value: 'stuck' }],
    });
    const it1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'loop' });
    const res = await c.req('PATCH', `/api/items/${it1.id}`, { values: { [status.id]: 'working' } });
    expect(res.status).toBe(200);
    const r1 = await c.json('GET', `/api/automations/${a1.id}/runs`);
    const r2 = await c.json('GET', `/api/automations/${a2.id}/runs`);
    expect(r1).toHaveLength(1);
    expect(r2).toHaveLength(1);
    const final = await c.json('GET', `/api/items/${it1.id}`);
    expect(final.item.values[priority.id]).toBe('high');
    expect(final.item.values[status.id]).toBe('stuck');
  });

  it('recurring schedule generates the next task exactly once per period', async () => {
    const { c, b } = await setup();
    const a = await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Daily standup',
      trigger: { type: 'recurring', interval: 'daily', hourUtc: 8 },
      actions: [{ type: 'create_item', groupId: b.groups[0].id, name: 'Standup {date}' }],
    });
    const at = Date.UTC(2031, 4, 6, 9, 0); // after 08:00 UTC
    await runMaintenance(env, at);
    await runMaintenance(env, at + 15 * 60_000); // same period
    let bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    const standups = () => bundle.items.filter((i: any) => i.name.startsWith('Standup'));
    expect(standups()).toHaveLength(1);
    expect(standups()[0].name).toBe(`Standup ${new Date().toISOString().slice(0, 10)}`);
    // Before the hour: nothing.
    await runMaintenance(env, Date.UTC(2031, 4, 7, 7, 0));
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(standups()).toHaveLength(1);
    // Next day after the hour: a second one.
    await runMaintenance(env, Date.UTC(2031, 4, 7, 10, 0));
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(standups()).toHaveLength(2);
    const runs = await c.json('GET', `/api/automations/${a.id}/runs`);
    expect(runs.filter((r: any) => r.status === 'succeeded')).toHaveLength(2);
  });

  it('weekly recurrence only fires on the configured weekday', async () => {
    const { c, b } = await setup();
    await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Weekly report',
      trigger: { type: 'recurring', interval: 'weekly', weekday: 0, hourUtc: 6 },
      actions: [{ type: 'create_item', name: 'Weekly report' }],
    });
    await runMaintenance(env, Date.UTC(2031, 4, 6, 9)); // Tuesday
    let bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.filter((i: any) => i.name === 'Weekly report')).toHaveLength(0);
    await runMaintenance(env, Date.UTC(2031, 4, 12, 9)); // Monday
    await runMaintenance(env, Date.UTC(2031, 4, 12, 11)); // Monday again
    bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.filter((i: any) => i.name === 'Weekly report')).toHaveLength(1);
  });

  it('WHEN due date arrives AND status is not Done THEN notify assignee (deduplicated)', async () => {
    const { c, b, person, status, due } = await setup();
    const assignee = await signup('Assignee');
    await addMember(c, assignee);
    const a = await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Due reminder',
      trigger: { type: 'date_arrived', columnId: due.id, offsetDays: 0 },
      conditions: { op: 'and', rules: [{ field: status.id, op: 'is_not', value: 'done' }] },
      actions: [{ type: 'notify', target: 'assignees', message: '{item} is due today' }],
    });
    const day = '2031-06-10';
    const open = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Open task', values: { [due.id]: day, [person.id]: assignee.userId } });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Done task', values: { [due.id]: day, [person.id]: assignee.userId, [status.id]: 'done' } });
    await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Other day', values: { [due.id]: '2031-06-11', [person.id]: assignee.userId } });
    const at = Date.parse(`${day}T09:00:00Z`);
    await runMaintenance(env, at);
    await runMaintenance(env, at + 3600_000);
    const runs = await c.json('GET', `/api/automations/${a.id}/runs`);
    expect(runs).toHaveLength(1);
    expect(runs[0].item_id).toBe(open.id);
    const n = await assignee.json('GET', `/api/notifications?workspaceId=${c.workspaceId}&type=automation`);
    expect(n.notifications.map((x: any) => x.title)).toEqual(['Open task is due today']);
  });

  it('failed runs are logged, owner notified, and retried with backoff', async () => {
    const { c, b } = await setup();
    const integ = await c.json('POST', `/api/workspaces/${c.workspaceId}/integrations`, { provider: 'webhook', name: 'Down', url: 'https://unreachable.workos-test.invalid/hook', events: ['test'] });
    const a = await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Webhook out',
      trigger: { type: 'item_created' },
      actions: [{ type: 'send_webhook', integrationId: integ.id }],
    });
    // The user request itself still succeeds even though the automation fails.
    const it1 = await c.req('POST', `/api/boards/${b.board.id}/items`, { name: 'trigger' });
    expect(it1.status).toBe(201);
    let runs = await c.json('GET', `/api/automations/${a.id}/runs`);
    expect(runs).toHaveLength(1);
    expect(runs[0].status).toBe('failed');
    expect(runs[0].attempts).toBe(1);
    expect(runs[0].next_retry_at).toBeGreaterThan(Date.now());
    expect(runs[0].error).toMatch(/Webhook delivery failed/);
    const n = await c.json('GET', `/api/notifications?workspaceId=${c.workspaceId}&type=automation`);
    expect(n.notifications.some((x: any) => x.title.includes('failed'))).toBe(true);
    // Not yet due for retry.
    await runMaintenance(env, Date.now());
    runs = await c.json('GET', `/api/automations/${a.id}/runs`);
    expect(runs[0].attempts).toBe(1);
    // After backoff the run is retried (still failing -> attempts 2).
    await runMaintenance(env, Date.now() + 3 * 60_000);
    runs = await c.json('GET', `/api/automations/${a.id}/runs`);
    expect(runs).toHaveLength(1);
    expect(runs[0].attempts).toBe(2);
    expect(runs[0].status).toBe('failed');
    // Attempt 3 is the last one: no further retry scheduled.
    await runMaintenance(env, Date.now() + 60 * 60_000);
    runs = await c.json('GET', `/api/automations/${a.id}/runs`);
    expect(runs[0].attempts).toBe(3);
    expect(runs[0].next_retry_at).toBeNull();
    const deliveries = await c.json('GET', `/api/integrations/${integ.id}/deliveries`);
    expect(deliveries.length).toBe(3);
    const list = await c.json('GET', `/api/workspaces/${c.workspaceId}/integrations`);
    expect(list[0].status).toBe('error');
  });

  it('subitem and other actions: create_subitem, duplicate, archive', async () => {
    const { c, b, status } = await setup();
    await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Checklist',
      trigger: { type: 'item_created' },
      actions: [{ type: 'create_subitem', name: 'Review {item}' }],
    });
    await c.json('POST', `/api/boards/${b.board.id}/automations`, {
      name: 'Archive stuck',
      trigger: { type: 'status_changed', columnId: status.id, to: 'stuck' },
      actions: [{ type: 'archive_item' }],
    });
    const it1 = await c.json('POST', `/api/boards/${b.board.id}/items`, { name: 'Doc' });
    const d = await c.json('GET', `/api/items/${it1.id}`);
    expect(d.subitems.map((s: any) => s.name)).toEqual(['Review Doc']);
    await c.json('PATCH', `/api/items/${it1.id}`, { values: { [status.id]: 'stuck' } });
    const bundle = await c.json('GET', `/api/boards/${b.board.id}`);
    expect(bundle.items.map((i: any) => i.id)).not.toContain(it1.id);
    // The run log contains no duplicate rows for the same event.
    const dupes = await env.DB.prepare('SELECT event_key, COUNT(*) AS n FROM automation_runs GROUP BY event_key HAVING n > 1').all();
    expect(dupes.results).toHaveLength(0);
  });
});
