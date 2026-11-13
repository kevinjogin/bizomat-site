// BIZOMAT CRM: records and workflows (contacts, companies, leads and conversion, pipelines and deals, activities),
// lists and filters, timelines, notes and files, automations, dashboard and reports, CSV, and the /crm address.
import { describe, expect, it } from 'vitest';
import { env } from 'cloudflare:test';
import { ORIGIN, PASSWORD, createBoard, raw, signup, uniqueEmail } from './helpers';
import { createOrg, eventually, joinOrg, q } from './crm-helpers';
import { runCrmScheduled } from '../src/worker/crm';

describe('contacts and companies', () => {
  it('creates, edits, tags, archives, deletes and restores, with history and duplicate warnings', async () => {
    const a = await signup('Rec Owner');
    const org = await createOrg(a);
    const co = await a.json('POST', `/api/crm/orgs/${org}/companies`, { name: 'Acme Fabrication', website: 'https://www.acme-fab.example.com/about', industry: 'manufacturing', size: '51-200', annualRevenue: 1250000000 });
    expect(co.domain).toBe('acme-fab.example.com');
    const ct = await a.json('POST', `/api/crm/orgs/${org}/contacts`, {
      firstName: 'Jo',
      lastName: 'Smith',
      email: 'Jo.Smith@Acme.example.com',
      phone: '+61 400 111 222',
      companyId: co.id,
      jobTitle: 'Plant manager',
      emails: [{ label: 'Personal', value: 'jo@home.example.com' }],
      nextFollowUp: '2026-12-01',
    });
    expect(ct.email).toBe('jo.smith@acme.example.com');
    expect(ct.company).toEqual({ id: co.id, name: 'Acme Fabrication' });
    expect(ct.emails).toEqual([{ label: 'Personal', value: 'jo@home.example.com' }]);
    expect(ct.ownerId).toBe(a.userId);
    // Validation
    expect((await a.req('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'X', email: 'not-an-email' })).status).toBe(400);
    expect((await a.req('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'X', status: 'nonsense' })).status).toBe(400);
    expect((await a.req('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'X', unknownField: 1 })).status).toBe(400);
    expect((await a.req('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'X', nextFollowUp: '01/12/2026' })).status).toBe(400);
    // Duplicates by email, phone and name
    const dups = await a.json('POST', `/api/crm/orgs/${org}/duplicates`, { entity: 'contact', probe: { email: 'jo.smith@acme.example.com', phone: '0400 111 222' } });
    expect(dups).toHaveLength(1);
    expect(dups[0]).toMatchObject({ id: ct.id, name: 'Jo Smith', reason: 'Same email address, same phone number' });
    const coDups = await a.json('POST', `/api/crm/orgs/${org}/duplicates`, { entity: 'company', probe: { name: 'acme fabrication', website: 'acme-fab.example.com' } });
    expect(coDups[0].id).toBe(co.id);
    // Edit and history
    await a.json('PATCH', `/api/crm/orgs/${org}/contacts/${ct.id}`, { jobTitle: 'Operations director', status: 'customer' });
    const tl = await a.json('GET', `/api/crm/orgs/${org}/timeline/contact/${ct.id}`);
    const kinds = tl.items.map((i: any) => i.type);
    expect(kinds).toEqual(expect.arrayContaining(['created', 'status_changed', 'updated']));
    // Tags
    const tag = await a.json('POST', `/api/crm/orgs/${org}/tags`, { name: 'Key account', color: '#d97706' });
    await a.json('PUT', `/api/crm/orgs/${org}/contacts/${ct.id}/tags`, { tagIds: [tag.id] });
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts/${ct.id}`)).tags).toEqual([{ id: tag.id, name: 'Key account', color: '#d97706' }]);
    // Company profile: contacts and counts
    const profile = await a.json('GET', `/api/crm/orgs/${org}/companies/${co.id}`);
    expect(profile.contactCount).toBe(1);
    expect((await a.json('GET', `/api/crm/orgs/${org}/companies/${co.id}/contacts`)).rows.map((r: any) => r.id)).toEqual([ct.id]);
    // Archive, delete, restore
    await a.json('POST', `/api/crm/orgs/${org}/contacts/${ct.id}/archive`, { archived: true });
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts`)).total).toBe(0);
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts?${q({ scope: 'archived' })}`)).total).toBe(1);
    await a.json('POST', `/api/crm/orgs/${org}/contacts/${ct.id}/archive`, { archived: false });
    await a.json('DELETE', `/api/crm/orgs/${org}/contacts/${ct.id}`);
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts`)).total).toBe(0);
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts?${q({ scope: 'deleted' })}`)).total).toBe(1);
    await a.json('POST', `/api/crm/orgs/${org}/contacts/${ct.id}/restore`, {});
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts`)).total).toBe(1);
  });

  it('custom fields: defined per organisation and record type, validated, filterable and sortable', async () => {
    const a = await signup('Cf Owner');
    const org = await createOrg(a);
    const sel = await a.json('POST', `/api/crm/orgs/${org}/custom-fields`, { entity: 'contact', label: 'Region', type: 'select', options: ['North', 'South'] });
    const num = await a.json('POST', `/api/crm/orgs/${org}/custom-fields`, { entity: 'contact', label: 'Sites', type: 'number' });
    await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'N', custom: { [sel.id]: 'North', [num.id]: 3 } });
    await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'S', custom: { [sel.id]: 'South', [num.id]: 12 } });
    expect((await a.req('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Bad', custom: { [sel.id]: 'East' } })).status).toBe(400);
    expect((await a.req('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Bad', custom: { nope: 'x' } })).status).toBe(400);
    const north = await a.json('GET', `/api/crm/orgs/${org}/contacts?${q({ filters: [{ field: `cf:${sel.id}`, op: 'in', value: ['North'] }] })}`);
    expect(north.rows.map((r: any) => r.firstName)).toEqual(['N']);
    const many = await a.json('GET', `/api/crm/orgs/${org}/contacts?${q({ filters: [{ field: `cf:${num.id}`, op: 'gte', value: 10 }] })}`);
    expect(many.rows.map((r: any) => r.firstName)).toEqual(['S']);
    const sorted = await a.json('GET', `/api/crm/orgs/${org}/contacts?${q({ sort: { field: `cf:${num.id}`, dir: 'desc' } })}`);
    expect(sorted.rows.map((r: any) => r.firstName)).toEqual(['S', 'N']);
    // Another organisation's custom field cannot be used here.
    const b = await signup('Cf Other');
    const orgB = await createOrg(b);
    expect((await b.req('GET', `/api/crm/orgs/${orgB}/contacts?${q({ filters: [{ field: `cf:${sel.id}`, op: 'in', value: ['North'] }] })}`)).status).toBe(400);
  });

  it('lists filter, search, sort and page on the server; unknown fields and operators are refused', async () => {
    const a = await signup('List Owner');
    const org = await createOrg(a);
    const colleague = await signup('List Colleague');
    await joinOrg(a, org, colleague, 'sales');
    for (let i = 1; i <= 7; i++) await a.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: `Lead${i}`, companyName: i % 2 ? 'Odd Co' : 'Even Co', estimatedValue: i * 100000, source: i <= 3 ? 'referral' : 'website', ownerId: i === 7 ? colleague.userId : a.userId });
    const page1 = await a.json('GET', `/api/crm/orgs/${org}/leads?${q({ sort: { field: 'estimatedValue', dir: 'desc' } })}&pageSize=3`);
    expect(page1.total).toBe(7);
    expect(page1.rows.map((r: any) => r.firstName)).toEqual(['Lead7', 'Lead6', 'Lead5']);
    const page3 = await a.json('GET', `/api/crm/orgs/${org}/leads?${q({ sort: { field: 'estimatedValue', dir: 'desc' } })}&pageSize=3&page=3`);
    expect(page3.rows.map((r: any) => r.firstName)).toEqual(['Lead1']);
    const combo = await a.json('GET', `/api/crm/orgs/${org}/leads?${q({ filters: [{ field: 'source', op: 'in', value: ['referral'] }, { field: 'companyName', op: 'contains', value: 'odd' }] })}`);
    expect(combo.rows.map((r: any) => r.firstName).sort()).toEqual(['Lead1', 'Lead3']);
    const any = await a.json('GET', `/api/crm/orgs/${org}/leads?${q({ match: 'any', filters: [{ field: 'estimatedValue', op: 'gte', value: 600000 }, { field: 'companyName', op: 'eq', value: 'Even Co' }] })}`);
    expect(any.rows.map((r: any) => r.firstName).sort()).toEqual(['Lead2', 'Lead4', 'Lead6', 'Lead7']);
    // A view's conditions stay required while "any of" conditions are added on top.
    const grouped = await a.json('GET', `/api/crm/orgs/${org}/leads?${q({ filters: [{ field: 'source', op: 'in', value: ['website'] }], anyOf: [{ field: 'estimatedValue', op: 'lte', value: 400000 }, { field: 'companyName', op: 'eq', value: 'Odd Co' }] })}`);
    expect(grouped.rows.map((r: any) => r.firstName).sort()).toEqual(['Lead4', 'Lead5', 'Lead7']);
    const theirs = await a.json('GET', `/api/crm/orgs/${org}/leads?${q({ filters: [{ field: 'ownerId', op: 'in', value: [colleague.userId] }] })}`);
    expect(theirs.rows.map((r: any) => r.firstName)).toEqual(['Lead7']);
  });

  it('lists: "me", search words, "mine" view, and refusals', async () => {
    const a = await signup('Me Owner');
    const org = await createOrg(a);
    const other = await signup('Me Other');
    await joinOrg(a, org, other, 'manager');
    await a.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: 'Mine', lastName: 'Lead', companyName: 'Blue Water Pumps' });
    await a.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: 'Theirs', companyName: 'Red Rock', ownerId: other.userId });
    expect((await a.json('GET', `/api/crm/orgs/${org}/leads?${q({ filters: [{ field: 'ownerId', op: 'in', value: ['me'] }] })}`)).rows.map((r: any) => r.firstName)).toEqual(['Mine']);
    expect((await other.json('GET', `/api/crm/orgs/${org}/leads?${q({ filters: [{ field: 'ownerId', op: 'in', value: ['me'] }] })}`)).rows.map((r: any) => r.firstName)).toEqual(['Theirs']);
    expect((await a.json('GET', `/api/crm/orgs/${org}/leads?q=water%20blue`)).total).toBe(1);
    expect((await a.req('GET', `/api/crm/orgs/${org}/leads?${q({ filters: [{ field: 'password_hash', op: 'eq', value: 'x' }] })}`)).status).toBe(400);
    expect((await a.req('GET', `/api/crm/orgs/${org}/leads?${q({ filters: [{ field: 'score', op: 'contains', value: 'x' }] })}`)).status).toBe(400);
    expect((await a.req('GET', `/api/crm/orgs/${org}/leads?${q({ sort: { field: 'id; DROP TABLE users', dir: 'asc' } })}`)).status).toBe(200);
    expect((await a.req('GET', `/api/crm/orgs/${org}/leads?query=notjson`)).status).toBe(400);
  });
});

describe('leads', () => {
  it('scores leads, converts once into a contact, company and deal, and never duplicates a contact by accident', async () => {
    const a = await signup('Lead Owner');
    const org = await createOrg(a);
    const lead = await a.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: 'Pat', lastName: 'Lee', companyName: 'Lee Mining', email: 'pat@leemining.example.com', phone: '0412 345 678', source: 'referral', estimatedValue: 2500000, jobTitle: 'Engineer' });
    expect(lead.score).toBe(55); // email 10, phone 10, company 10, title 5, value 10, warm source 10
    await a.json('PATCH', `/api/crm/orgs/${org}/leads/${lead.id}`, { status: 'qualified' });
    expect((await a.json('GET', `/api/crm/orgs/${org}/leads/${lead.id}`)).score).toBe(75);
    const breakdown = await a.json('GET', `/api/crm/orgs/${org}/leads/${lead.id}/score`);
    expect(breakdown.parts.map((p: any) => p.label)).toContain('Qualified');
    // Status "converted" is only set by converting.
    expect((await a.req('PATCH', `/api/crm/orgs/${org}/leads/${lead.id}`, { status: 'converted' })).status).toBe(400);
    // An existing contact with the same email blocks a second one unless confirmed.
    const existing = await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Pat', lastName: 'Lee', email: 'pat@leemining.example.com' });
    const preview = await a.json('GET', `/api/crm/orgs/${org}/leads/${lead.id}/convert-preview`);
    expect(preview.contacts.map((d: any) => d.id)).toContain(existing.id);
    const refused = await a.req('POST', `/api/crm/orgs/${org}/leads/${lead.id}/convert`, { contact: { mode: 'create' }, company: { mode: 'create' }, deal: { create: false } });
    expect(refused.status).toBe(409);
    expect(((await refused.json()) as any).details.code).toBe('DUPLICATE_CONTACT');
    // Nothing was created by the refused attempt.
    expect((await a.json('GET', `/api/crm/orgs/${org}/companies`)).total).toBe(0);
    const pipes = await a.json('GET', `/api/crm/orgs/${org}/pipelines`);
    const result = await a.json('POST', `/api/crm/orgs/${org}/leads/${lead.id}/convert`, {
      contact: { mode: 'existing', id: existing.id },
      company: { mode: 'create' },
      deal: { create: true, title: 'Lee Mining pumps', value: 3000000, stageId: pipes[0].stages[1].id },
    });
    expect(result.contactId).toBe(existing.id);
    const converted = await a.json('GET', `/api/crm/orgs/${org}/leads/${lead.id}`);
    expect(converted.status).toBe('converted');
    expect(converted.convertedAt).toBeTruthy();
    expect(converted.dealId).toBe(result.dealId);
    const deal = await a.json('GET', `/api/crm/orgs/${org}/deals/${result.dealId}`);
    expect(deal).toMatchObject({ title: 'Lee Mining pumps', value: 3000000, companyId: result.companyId, stageId: pipes[0].stages[1].id, leadId: lead.id });
    expect(deal.contacts.map((c: any) => c.id)).toEqual([existing.id]);
    expect((await a.json('GET', `/api/crm/orgs/${org}/companies/${result.companyId}`)).name).toBe('Lee Mining');
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts/${existing.id}`)).companyId).toBe(result.companyId);
    // Twice: refused.
    expect((await a.req('POST', `/api/crm/orgs/${org}/leads/${lead.id}/convert`, { contact: { mode: 'create' }, company: { mode: 'none' }, deal: { create: false }, allowDuplicate: true })).status).toBe(409);
  });
});

describe('pipelines and deals', () => {
  it('moves deals between stages by drag and drop, records every change, wins and loses, with weighted values', async () => {
    const a = await signup('Deal Owner');
    const org = await createOrg(a);
    const [pipe] = await a.json('GET', `/api/crm/orgs/${org}/pipelines`);
    const [s1, , s3] = pipe.stages;
    const d1 = await a.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Conveyor upgrade', value: 1000000, expectedCloseDate: '2027-01-31' });
    const d2 = await a.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Spare parts', value: 200000 });
    expect(d1.stageId).toBe(s1.id);
    expect(d1.weightedValue).toBe(100000); // 10%
    expect(d1.currency).toBe('AUD');
    // Move d2 above d1 within the first stage, then d1 to the third stage.
    await a.json('POST', `/api/crm/orgs/${org}/deals/${d2.id}/move`, { stageId: s1.id, afterId: d1.id });
    let board = await a.json('GET', `/api/crm/orgs/${org}/pipelines/${pipe.id}/board`);
    expect(board.deals.filter((d: any) => d.stageId === s1.id).map((d: any) => d.title)).toEqual(['Spare parts', 'Conveyor upgrade']);
    const moved = await a.json('POST', `/api/crm/orgs/${org}/deals/${d1.id}/move`, { stageId: s3.id });
    expect(moved.stageId).toBe(s3.id);
    expect(moved.weightedValue).toBe(500000); // Proposal, 50%
    await a.json('PATCH', `/api/crm/orgs/${org}/deals/${d1.id}`, { probability: 60 });
    expect((await a.json('GET', `/api/crm/orgs/${org}/deals/${d1.id}`)).weightedValue).toBe(600000);
    // A stage of another pipeline is accepted with that pipeline; a stage from another org is not.
    const p2 = await a.json('POST', `/api/crm/orgs/${org}/pipelines`, { name: 'Service', stages: [{ name: 'Quoted', probability: 30 }, { name: 'Booked', probability: 80 }] });
    const across = await a.json('PATCH', `/api/crm/orgs/${org}/deals/${d2.id}`, { stageId: p2.stages[1].id });
    expect(across.pipelineId).toBe(p2.id);
    // Lost needs a reason; won and reopen.
    expect((await a.req('POST', `/api/crm/orgs/${org}/deals/${d2.id}/close`, { outcome: 'lost' })).status).toBe(400);
    await a.json('POST', `/api/crm/orgs/${org}/deals/${d2.id}/close`, { outcome: 'lost', reason: 'price' });
    const won = await a.json('POST', `/api/crm/orgs/${org}/deals/${d1.id}/close`, { outcome: 'won' });
    expect(won.status).toBe('won');
    expect(won.weightedValue).toBe(1000000);
    board = await a.json('GET', `/api/crm/orgs/${org}/pipelines/${pipe.id}/board`);
    expect(board.deals).toHaveLength(0);
    const history = await a.json('GET', `/api/crm/orgs/${org}/deals/${d1.id}/history`);
    expect(history.map((h: any) => [h.fromStage, h.toStage, h.toStatus])).toEqual([
      [null, 'Qualification', 'open'],
      ['Qualification', 'Proposal', 'open'],
      ['Proposal', 'Proposal', 'won'],
    ]);
    // Removing a stage that has deals needs a target; then it moves them.
    const res = await a.req('PUT', `/api/crm/orgs/${org}/pipelines/${p2.id}`, { name: 'Service', stages: [{ id: p2.stages[0].id, name: 'Quoted', probability: 30 }] });
    expect(res.status).toBe(409);
    await a.json('PUT', `/api/crm/orgs/${org}/pipelines/${p2.id}`, { name: 'Service', stages: [{ id: p2.stages[0].id, name: 'Quoted', probability: 30 }], moveDealsTo: { [p2.stages[1].id]: p2.stages[0].id } });
    expect((await a.json('GET', `/api/crm/orgs/${org}/deals/${d2.id}`)).stageId).toBe(p2.stages[0].id);
  });

  it('products and services on a deal set its value; contacts on a deal', async () => {
    const a = await signup('Items Owner');
    const org = await createOrg(a);
    const product = await a.json('POST', `/api/crm/orgs/${org}/products`, { name: 'Pump overhaul', unitPrice: 450000 });
    const deal = await a.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Overhauls' });
    const updated = await a.json('PUT', `/api/crm/orgs/${org}/deals/${deal.id}/items`, {
      items: [
        { productId: product.id, name: 'Pump overhaul', quantity: 2, unitPrice: 450000, discountPct: 10 },
        { name: 'Call-out', quantity: 1.5, unitPrice: 33333 },
      ],
    });
    expect(updated.items.map((i: any) => i.total)).toEqual([810000, 50000]);
    expect(updated.value).toBe(860000);
    const c1 = await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Buyer' });
    const c2 = await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Engineer' });
    const contacts = await a.json('PUT', `/api/crm/orgs/${org}/deals/${deal.id}/contacts`, { contacts: [{ contactId: c1.id, role: 'Decision maker' }, { contactId: c2.id }] });
    expect(contacts.map((c: any) => [c.name, c.role])).toEqual([['Buyer', 'Decision maker'], ['Engineer', '']]);
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts/${c1.id}/deals`)).rows.map((d: any) => d.id)).toEqual([deal.id]);
  });
});

describe('activities, timeline, notes and files', () => {
  it('assigns follow-ups to colleagues, notifies them through the starting automation, and completes them', async () => {
    const a = await signup('Act Owner');
    const org = await createOrg(a);
    const colleague = await signup('Act Colleague');
    await joinOrg(a, org, colleague, 'sales');
    const ct = await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Called', lastName: 'Person' });
    const act = await a.json('POST', `/api/crm/orgs/${org}/activities`, { type: 'call', title: 'Discovery call', contactId: ct.id, assignedTo: colleague.userId, dueDate: '2026-11-20', dueTime: '10:30', priority: 'high' });
    expect(act.assignedTo).toBe(colleague.userId);
    expect(act.contact).toEqual({ id: ct.id, name: 'Called Person' });
    const n = await eventually(() => colleague.json('GET', `/api/crm/orgs/${org}/notifications`), (r: any) => r.unread >= 1);
    expect(n.notifications[0].title).toContain('Discovery call');
    expect(n.notifications[0].link).toBe(`/o/${org}/activities/${act.id}`);
    // The person assigned completes it even without edit rights over records they do not own.
    const done = await colleague.json('PATCH', `/api/crm/orgs/${org}/activities/${act.id}`, { status: 'done', outcome: 'Interested in a site visit' });
    expect(done.status).toBe('done');
    expect(done.doneAt).toBeTruthy();
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts/${ct.id}`)).lastContactedAt).toBeTruthy();
    // Views: mine, overdue, completed
    const mine = await colleague.json('GET', `/api/crm/orgs/${org}/activities?${q({ filters: [{ field: 'assignedTo', op: 'in', value: ['me'] }, { field: 'status', op: 'in', value: ['done'] }] })}`);
    expect(mine.total).toBe(1);
    // Calendar file
    const ics = await (await a.req('GET', `/api/crm/orgs/${org}/activities/${act.id}/ics`)).text();
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('DTSTART;TZID=Australia/Sydney:20261120T103000');
    await colleague.json('POST', `/api/crm/orgs/${org}/notifications/read`, {});
    expect((await colleague.json('GET', `/api/crm/orgs/${org}/notifications`)).unread).toBe(0);
  });

  it('overdue follow-ups and deals near their close date are found by the maintenance run, once', async () => {
    const a = await signup('Sched Owner');
    const org = await createOrg(a);
    const act = await a.json('POST', `/api/crm/orgs/${org}/activities`, { type: 'follow_up', title: 'Chase the quote', dueDate: '2026-01-05' });
    const soon = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
    const deal = await a.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Closing soon deal', value: 100, expectedCloseDate: soon });
    await runCrmScheduled(env);
    await runCrmScheduled(env); // a second run changes nothing
    const n = await a.json('GET', `/api/crm/orgs/${org}/notifications`);
    expect(n.notifications.filter((x: any) => x.title.includes('Chase the quote'))).toHaveLength(1);
    expect(n.notifications.filter((x: any) => x.title.includes('Closing soon deal'))).toHaveLength(1);
    const flagged = await a.json('GET', `/api/crm/orgs/${org}/deals/${deal.id}`);
    expect(flagged.flagged).toBe(true);
    const runs = await a.json('GET', `/api/crm/orgs/${org}/automation-runs`);
    expect(runs.filter((r: any) => r.entityId === act.id && r.trigger === 'activity.overdue')).toHaveLength(1);
    expect(runs.filter((r: any) => r.entityId === deal.id && r.trigger === 'deal.closing_soon')).toHaveLength(1);
    expect(runs.every((r: any) => r.status === 'success')).toBe(true);
  });

  it('the company timeline brings together its own history and that of its contacts and deals, with notes, mentions and files', async () => {
    const a = await signup('Tl Owner');
    const org = await createOrg(a);
    const colleague = await signup('Tl Colleague');
    await joinOrg(a, org, colleague, 'member');
    const co = await a.json('POST', `/api/crm/orgs/${org}/companies`, { name: 'Timeline Co' });
    const ct = await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Tim', companyId: co.id });
    const deal = await a.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Timeline deal', companyId: co.id });
    await a.json('POST', `/api/crm/orgs/${org}/activities`, { type: 'meeting', title: 'Kick-off meeting', contactId: ct.id, status: 'done' });
    const note = await a.json('POST', `/api/crm/orgs/${org}/notes`, { entity: 'deal', recordId: deal.id, body: `Pricing agreed. @[Tl Colleague](${colleague.userId}) please send the contract.` });
    expect(note.mentions).toEqual([colleague.userId]);
    const form = new FormData();
    form.set('file', new File(['%PDF-1.4 proposal'], 'proposal.pdf', { type: 'application/pdf' }));
    form.set('entity', 'deal');
    form.set('recordId', deal.id);
    form.set('kind', 'proposal');
    const file = await (await a.req('POST', `/api/crm/orgs/${org}/files`, form)).json<any>();
    expect(file.kind).toBe('proposal');
    // A new version
    const form2 = new FormData();
    form2.set('file', new File(['%PDF-1.4 proposal v2'], 'proposal-v2.pdf', { type: 'application/pdf' }));
    form2.set('entity', 'deal');
    form2.set('recordId', deal.id);
    form2.set('previousId', file.id);
    const v2 = await (await a.req('POST', `/api/crm/orgs/${org}/files`, form2)).json<any>();
    expect(v2.version).toBe(2);
    const dl = await a.req('GET', `/api/crm/orgs/${org}/files/${v2.id}`);
    expect(dl.status).toBe(200);
    expect(await dl.text()).toBe('%PDF-1.4 proposal v2');
    const tl = await a.json('GET', `/api/crm/orgs/${org}/timeline/company/${co.id}`);
    const titles = tl.items.map((i: any) => i.title);
    expect(titles).toEqual(expect.arrayContaining(['Kick-off meeting', 'Note', 'proposal.pdf', 'proposal-v2.pdf']));
    const viaDeal = tl.items.find((i: any) => i.kind === 'note');
    expect(viaDeal.via).toEqual({ entity: 'deal', id: deal.id, name: 'Timeline deal' });
    const mention = await eventually(() => colleague.json('GET', `/api/crm/orgs/${org}/notifications`), (r: any) => r.notifications.some((n: any) => n.type === 'mention'));
    expect(mention.notifications.find((n: any) => n.type === 'mention').body).toContain('@Tl Colleague please send the contract');
    // Search finds the note on the deal.
    const s = await colleague.json('GET', `/api/crm/orgs/${org}/search?q=pricing`);
    expect(s.results.note[0].recordName).toBe('Timeline deal');
    // Only the author edits a note; the colleague (a member) cannot delete it.
    expect((await colleague.req('PATCH', `/api/crm/orgs/${org}/notes/${note.id}`, { body: 'changed' })).status).toBe(403);
    expect((await colleague.req('DELETE', `/api/crm/orgs/${org}/notes/${note.id}`)).status).toBe(403);
  });

  it('logs an email on the timeline (sent from the person\'s own mail program), and turns an activity into a project task', async () => {
    const a = await signup('Mail Owner');
    const org = await createOrg(a);
    const ct = await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'Mai', email: 'mai@example.com' });
    const email = await a.json('POST', `/api/crm/orgs/${org}/emails`, { direction: 'outbound', to: 'mai@example.com', subject: 'Your quote', body: 'Attached is the quote.', contactId: ct.id });
    expect(email).toMatchObject({ type: 'email', status: 'done', emailDirection: 'outbound', emailDelivery: 'logged' });
    const integrations = await a.json('GET', '/api/crm/integrations');
    expect(integrations.mailbox.every((p: any) => p.configured === false)).toBe(true);
    // Project Management link: a board in the person's workspace.
    const board = (await createBoard(a, 'Delivery')).board;
    const targets = await a.json('GET', '/api/crm/project-targets');
    expect(targets.map((t: any) => t.boardId)).toContain(board.id);
    const act = await a.json('POST', `/api/crm/orgs/${org}/activities`, { type: 'task', title: 'Prepare installation plan', contactId: ct.id });
    const task = await a.json('POST', `/api/crm/orgs/${org}/activities/${act.id}/project-task`, { boardId: board.id });
    const { item } = await a.json('GET', `/api/items/${task.itemId}`);
    expect(item.name).toBe('Prepare installation plan');
    expect(item.description).toContain(`/crm/o/${org}/activities/${act.id}`);
    expect((await a.json('GET', `/api/crm/orgs/${org}/activities/${act.id}`)).pmItem).toEqual({ workspaceId: a.workspaceId, itemId: task.itemId });
    expect((await a.req('POST', `/api/crm/orgs/${org}/activities/${act.id}/project-task`, { boardId: board.id })).status).toBe(409);
    // Someone without access to that board cannot use it.
    const outsider = await signup('Pm Outsider');
    await joinOrg(a, org, outsider, 'manager');
    const act2 = await outsider.json('POST', `/api/crm/orgs/${org}/activities`, { type: 'task', title: 'Not allowed' });
    expect([403, 404]).toContain((await outsider.req('POST', `/api/crm/orgs/${org}/activities/${act2.id}/project-task`, { boardId: board.id })).status);
  });
});

describe('automations', () => {
  it('validates what an automation may do, runs high-value deal alerts and stage follow-ups, and records history', async () => {
    const a = await signup('Auto Owner');
    const org = await createOrg(a);
    const manager = await signup('Auto Manager');
    await joinOrg(a, org, manager, 'manager');
    const [pipe] = await a.json('GET', `/api/crm/orgs/${org}/pipelines`);
    // Refusals: an action that does not fit the trigger, a person outside the organisation.
    expect((await a.req('POST', `/api/crm/orgs/${org}/automations`, { name: 'x', trigger: 'activity.assigned', actions: [{ type: 'flag_deal' }] })).status).toBe(400);
    const stranger = await signup('Auto Stranger');
    expect((await a.req('POST', `/api/crm/orgs/${org}/automations`, { name: 'x', trigger: 'lead.created', actions: [{ type: 'assign_owner', userId: stranger.userId }] })).status).toBe(400);
    // A new automation: leads from a referral go to the manager.
    await a.json('POST', `/api/crm/orgs/${org}/automations`, { name: 'Referrals to the manager', trigger: 'lead.created', conditions: [{ field: 'source', op: 'eq', value: 'referral' }], actions: [{ type: 'assign_owner', userId: manager.userId }] });
    const lead = await a.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: 'Ref', source: 'referral' });
    await eventually(() => a.json('GET', `/api/crm/orgs/${org}/leads/${lead.id}`), (l: any) => l.ownerId === manager.userId);
    // The starting automation tells the new owner.
    await eventually(() => manager.json('GET', `/api/crm/orgs/${org}/notifications`), (r: any) => r.notifications.some((n: any) => n.title.includes('Ref')));
    // High-value deal moving: managers hear; a proposal stage creates a follow-up.
    const deal = await a.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Big plant', value: 9_000_000 });
    const proposal = pipe.stages.find((s: any) => s.name === 'Proposal');
    await a.json('POST', `/api/crm/orgs/${org}/deals/${deal.id}/move`, { stageId: proposal.id });
    await eventually(() => manager.json('GET', `/api/crm/orgs/${org}/notifications`), (r: any) => r.notifications.some((n: any) => n.title.includes('Big plant moved to Proposal')));
    const followUps = await eventually(() => a.json('GET', `/api/crm/orgs/${org}/deals/${deal.id}/activities`), (r: any) => r.length === 1);
    expect(followUps[0]).toMatchObject({ title: 'Follow up on the proposal', type: 'follow_up', assignedTo: a.userId, priority: 'high' });
    // Switching off stops it.
    const autos = (await a.json('GET', `/api/crm/orgs/${org}/automations`)).automations;
    const wonLost = autos.find((x: any) => x.preset === 'won_lost');
    await a.json('POST', `/api/crm/orgs/${org}/automations/${wonLost.id}/enabled`, { enabled: false });
    await a.json('POST', `/api/crm/orgs/${org}/deals/${deal.id}/close`, { outcome: 'won' });
    await new Promise((r) => setTimeout(r, 300));
    expect((await manager.json('GET', `/api/crm/orgs/${org}/notifications`)).notifications.some((n: any) => n.title.includes('was won'))).toBe(false);
    // A sales executive can look but not change.
    const sales = await signup('Auto Sales');
    await joinOrg(a, org, sales, 'sales');
    expect((await sales.req('GET', `/api/crm/orgs/${org}/automations`)).status).toBe(200);
    expect((await sales.req('POST', `/api/crm/orgs/${org}/automations/${wonLost.id}/enabled`, { enabled: true })).status).toBe(403);
  });
});

describe('dashboard and reports', () => {
  it('computes every figure from the organisation\'s records, with filters, and exports CSV', async () => {
    const a = await signup('Rep Owner');
    const org = await createOrg(a);
    const seller = await signup('Rep Seller');
    await joinOrg(a, org, seller, 'sales');
    await a.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: 'L1', source: 'website' });
    await a.json('POST', `/api/crm/orgs/${org}/leads`, { firstName: 'L2', source: 'website' });
    await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: 'C1' });
    const d1 = await a.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Won one', value: 500000 });
    const d2 = await seller.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Lost one', value: 200000 });
    await seller.json('POST', `/api/crm/orgs/${org}/deals`, { title: 'Open one', value: 1000000 });
    await a.json('POST', `/api/crm/orgs/${org}/deals/${d1.id}/close`, { outcome: 'won' });
    await seller.json('POST', `/api/crm/orgs/${org}/deals/${d2.id}/close`, { outcome: 'lost', reason: 'competitor' });
    const dash = await a.json('GET', `/api/crm/orgs/${org}/dashboard`);
    expect(dash.kpis).toMatchObject({ totalLeads: 2, newLeads: 2, totalContacts: 1, openDeals: 1, pipelineValue: 1000000, weightedForecast: 100000, wonDeals: 1, wonValue: 500000, lostDeals: 1, winRate: 50 });
    expect(dash.leadSources).toEqual([expect.objectContaining({ source: 'website', count: 2 })]);
    expect(dash.dealsByStage.stages[0]).toMatchObject({ name: 'Qualification', count: 1, value: 1000000 });
    expect(dash.revenueByMonth.at(-1).value).toBe(500000);
    // By owner
    const mine = await a.json('GET', `/api/crm/orgs/${org}/dashboard?owner=${seller.userId}`);
    expect(mine.kpis).toMatchObject({ openDeals: 1, wonDeals: 0, lostDeals: 1 });
    const winLoss = await a.json('GET', `/api/crm/orgs/${org}/reports/win-loss`);
    expect(winLoss.summary.find((s: any) => s.label === 'Win rate').value).toBe(50);
    expect(winLoss.rows).toEqual([expect.objectContaining({ reason: 'Went with a competitor', count: 1, value: 200000 })]);
    const perf = await a.json('GET', `/api/crm/orgs/${org}/reports/performance`);
    expect(perf.rows.find((r: any) => r.person === 'Rep Owner')).toMatchObject({ won: 1, wonValue: 500000 });
    for (const key of ['lead-conversion', 'pipeline', 'revenue', 'sources', 'activities', 'trends', 'forecast', 'ageing', 'cycle']) {
      const r = await a.json('GET', `/api/crm/orgs/${org}/reports/${key}?from=2026-01-01&to=2026-12-31`);
      expect(r.columns.length, key).toBeGreaterThan(0);
    }
    const csv = await (await a.req('GET', `/api/crm/orgs/${org}/reports/revenue?format=csv`)).text();
    expect(csv).toContain('Revenue (AUD)');
    expect(csv).toContain('5000.00');
    expect((await seller.req('GET', `/api/crm/orgs/${org}/reports/revenue?format=csv`)).status).toBe(403);
    expect((await a.req('GET', `/api/crm/orgs/${org}/reports/nope`)).status).toBe(400);
  });
});

describe('CSV import and export', () => {
  it('imports mapped rows with owners, companies, choices and tags; skips or updates duplicates; exports what is visible', async () => {
    const a = await signup('Csv Owner');
    const org = await createOrg(a);
    const r1 = await a.json('POST', `/api/crm/orgs/${org}/contacts/import`, {
      rows: [
        { firstName: 'Imp', lastName: 'One', email: 'imp1@example.com', companyId: 'Imported Co', status: 'Customer', ownerId: a.email, tags: 'VIP; Northern' },
        { firstName: 'Imp', lastName: 'Two', email: 'imp2@example.com', nextFollowUp: '15/12/2026' },
        { firstName: 'Bad', email: 'bad-email' },
      ],
    });
    expect(r1).toMatchObject({ created: 2, updated: 0, skipped: 0 });
    expect(r1.errors).toEqual([expect.objectContaining({ row: 3 })]);
    const one = (await a.json('GET', `/api/crm/orgs/${org}/contacts?q=imp1`)).rows[0];
    expect(one).toMatchObject({ status: 'customer', ownerId: a.userId, company: { id: expect.any(String), name: 'Imported Co' } });
    expect(one.tags.map((t: any) => t.name).sort()).toEqual(['Northern', 'VIP']);
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts?q=imp2`)).rows[0].nextFollowUp).toBe('2026-12-15');
    const r2 = await a.json('POST', `/api/crm/orgs/${org}/contacts/import`, { rows: [{ firstName: 'Imp', email: 'imp1@example.com', jobTitle: 'Buyer' }], duplicates: 'skip' });
    expect(r2.skipped).toBe(1);
    const r3 = await a.json('POST', `/api/crm/orgs/${org}/contacts/import`, { rows: [{ email: 'imp1@example.com', jobTitle: 'Buyer' }], duplicates: 'update' });
    expect(r3.updated).toBe(1);
    expect((await a.json('GET', `/api/crm/orgs/${org}/contacts?q=imp1`)).rows[0].jobTitle).toBe('Buyer');
    const csv = await (await a.req('GET', `/api/crm/orgs/${org}/contacts/export`)).text();
    expect(csv.split('\r\n')[0]).toContain('Email');
    expect(csv).toContain('imp1@example.com');
    expect(csv).toContain('Imported Co');
    // A formula is neutralised in the export.
    await a.json('POST', `/api/crm/orgs/${org}/contacts`, { firstName: '=HYPERLINK("x")' });
    expect(await (await a.req('GET', `/api/crm/orgs/${org}/contacts/export`)).text()).toContain(`"'=HYPERLINK(""x"")"`);
    const audit = await a.json('GET', `/api/crm/orgs/${org}/audit`);
    expect(audit.map((x: any) => x.action)).toEqual(expect.arrayContaining(['records.imported', 'records.exported']));
  });
});

describe('the /crm address', () => {
  it('serves the API and pages under /crm, with the session cookie written for both /tasks and /crm', async () => {
    const email = uniqueEmail('mount');
    const res = await raw('POST', '/crm/api/auth/signup', { body: { email, name: 'Crm Mount', password: PASSWORD } });
    expect(res.status).toBe(201);
    const cookies = res.headers.getSetCookie().filter((c) => c.startsWith('workos_sid='));
    expect(cookies.map((c) => /;\s*path=([^;]+)/i.exec(c)?.[1])).toEqual(['/crm', '/tasks']);
    const cookie = cookies[0].split(';')[0];
    const csrf = ((await res.json()) as any).csrfToken;
    const created = await raw('POST', '/crm/api/crm/orgs', { body: { name: 'Mounted Org' }, cookie, csrf });
    expect(created.status).toBe(201);
    // The same session works for Project Management.
    expect((await raw('GET', '/tasks/api/auth/me', { cookie })).status).toBe(200);
    const page = await raw('GET', '/crm/o/x/overview', { cookie, headers: { Accept: 'text/html' } });
    expect(page.status).toBe(200);
    const html = await page.text();
    expect(html).toContain('<base href="/crm/">');
    expect(html).toContain('<title>BIZOMAT CRM</title>');
  });

  it('a CRM page without a cookie goes through /tasks once: a Project Management session carries over, else the CRM sign-in', async () => {
    const res = await raw('GET', '/crm/o/abc/deals?view=board', { headers: { Accept: 'text/html' } });
    expect(res.status).toBe(302);
    const carry = res.headers.get('Location')!;
    expect(carry).toBe(`/tasks/api/crm-carry?to=${encodeURIComponent('/crm/o/abc/deals?view=board')}`);
    // Signed in to Project Management (a cookie on /tasks only, as before the CRM existed)
    const pm = await raw('POST', '/tasks/api/auth/signup', { body: { email: uniqueEmail('carry'), name: 'Carry Over', password: PASSWORD } });
    const tasksCookie = pm.headers.getSetCookie().find((c) => /path=\/tasks/i.test(c))!.split(';')[0];
    const carried = await raw('GET', carry, { cookie: tasksCookie });
    expect(carried.status).toBe(302);
    expect(carried.headers.get('Location')).toBe('/crm/o/abc/deals?view=board');
    const set = carried.headers.getSetCookie();
    expect(set.some((c) => c.startsWith('workos_sid=') && /path=\/crm(;|$)/i.test(c))).toBe(true);
    expect(set.some((c) => c.startsWith('crm_carry=1'))).toBe(true);
    // Not signed in: the CRM's sign-in page, and the marker stops a loop.
    const anon = await raw('GET', carry);
    expect(anon.headers.get('Location')).toBe(`/crm/login?next=${encodeURIComponent('/o/abc/deals?view=board')}`);
    const again = await raw('GET', '/crm/o/abc/deals', { headers: { Accept: 'text/html', Cookie: 'crm_carry=1' } });
    expect(again.headers.get('Location')).toBe(`/crm/login?next=${encodeURIComponent('/o/abc/deals')}`);
    // The carry address only ever sends people into the CRM.
    const evil = await raw('GET', `/tasks/api/crm-carry?to=${encodeURIComponent('//evil.example.com/x')}`, { cookie: tasksCookie });
    expect(evil.headers.get('Location')).toBe('/crm/');
    // The invitation page is public under /crm.
    expect((await raw('GET', '/crm/join/abcdefghijklmnopqrstuvwxyz', { headers: { Accept: 'text/html' } })).status).toBe(200);
    void ORIGIN;
  });
});
