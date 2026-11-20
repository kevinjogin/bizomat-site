// Moving CRM records to another company's CRM (owner, 20 Nov 2026; crm/transfer.ts; flag move_records, off): off until
// both companies have the flag; a company with its contacts, notes, activities, files, timeline, tags (by name) and custom
// fields (by label); records on a deal, converted leads on their own and people who may not add records there refused;
// foreign keys intact after every move; the pure option and custom field mapping.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { createOrg, joinOrg } from './crm-helpers';
import { abnValid } from '../src/worker/company/verify';
import { mapCustom, mapOption } from '../src/worker/crm/transfer';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

const flag = (scope: 'global' | 'company', scopeId = '', value = 'on') =>
  env.DB.prepare('INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1)').bind('move_records', scope, scopeId, value, 'test', 'test').run();

/** A registered company with its tools; returns its id and its CRM organisation. */
async function company(owner: Client, name: string) {
  const res = await owner.req('POST', '/api/company/companies', { kind: 'business', name, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  expect(res.status).toBe(201);
  const data = (await res.json()) as any;
  return { id: data.company.id as string, crm: data.tools.crm as string };
}

const fkClean = async () => (await env.DB.prepare('PRAGMA foreign_key_check').all()).results.filter((r: any) => String(r.table).startsWith('crm_'));

describe('moving CRM records between companies', () => {
  it('is off until the flag is on for both companies', async () => {
    const a = await signup();
    const mine = await createOrg(a, 'My CRM');
    const co = await company(a, 'Off Switch Pty');
    const ct = await a.json('POST', `/api/crm/orgs/${mine}/contacts`, { firstName: 'Ann', lastName: 'Wrong' });
    expect((await a.json('GET', `/api/crm/orgs/${mine}/transfer/status`)).enabled).toBe(false);
    const off = await a.req('POST', `/api/crm/orgs/${mine}/contacts/transfer/preview`, { ids: [ct.id], toOrgId: co.crm });
    expect(off.status).toBe(403);
    expect(((await off.json()) as any).details.code).toBe('MOVE_OFF');
    await flag('company', co.id);
    // On for the company it would go to, not the one it is in: still refused.
    expect((await a.req('POST', `/api/crm/orgs/${mine}/contacts/transfer`, { ids: [ct.id], toOrgId: co.crm })).status).toBe(403);
    await flag('global');
    const targets = await a.json('GET', `/api/crm/orgs/${mine}/transfer/targets`);
    expect(targets.targets.map((t: any) => t.orgId)).toContain(co.crm);
    expect(targets.targets.map((t: any) => t.orgId)).not.toContain(mine);
  });

  it('moves a company with its contacts, notes, activities, timeline, tags and custom fields', async () => {
    await flag('global');
    const a = await signup();
    const mine = await createOrg(a, 'Personal CRM');
    const co = await company(a, 'Right Place Pty');
    for (const org of [mine, co.crm]) {
      await a.json('POST', `/api/crm/orgs/${org}/tags`, { name: 'Key account' });
      await a.json('POST', `/api/crm/orgs/${org}/custom-fields`, { entity: 'company', label: 'Account number', type: 'text' });
    }
    const only = await a.json('POST', `/api/crm/orgs/${mine}/tags`, { name: 'Local only' });
    const key = (await a.json('GET', `/api/crm/orgs/${mine}/tags`)).find((t: any) => t.name === 'Key account');
    const cf = (await a.json('GET', `/api/crm/orgs/${mine}/custom-fields`)).find((f: any) => f.label === 'Account number');
    const firm = await a.json('POST', `/api/crm/orgs/${mine}/companies`, { name: 'Harbour Pumps', custom: { [cf.id]: 'HP-001' }, tagIds: [key.id, only.id] });
    const c1 = await a.json('POST', `/api/crm/orgs/${mine}/contacts`, { firstName: 'Bo', lastName: 'One', companyId: firm.id });
    const c2 = await a.json('POST', `/api/crm/orgs/${mine}/contacts`, { firstName: 'Cy', lastName: 'Two', companyId: firm.id });
    await a.json('POST', `/api/crm/orgs/${mine}/notes`, { entity: 'company', recordId: firm.id, body: 'Pays on time' });
    const act = await a.json('POST', `/api/crm/orgs/${mine}/activities`, { title: 'Call about pumps', type: 'call', contactId: c1.id });
    const stays = await a.json('POST', `/api/crm/orgs/${mine}/contacts`, { firstName: 'Di', lastName: 'Stays' });

    const preview = await a.json('POST', `/api/crm/orgs/${mine}/companies/transfer/preview`, { ids: [firm.id], toOrgId: co.crm });
    expect(preview.records).toHaveLength(1);
    expect(preview.records[0]).toMatchObject({ id: firm.id, ok: true, carries: { contacts: 2, notes: 1, activities: 1 } });
    expect(preview.records[0].notCarried.map((n: any) => n.field)).toContain('Tags');
    // The preview changes nothing.
    expect((await a.req('GET', `/api/crm/orgs/${mine}/companies/${firm.id}`)).status).toBe(200);

    const res = await a.json('POST', `/api/crm/orgs/${mine}/companies/transfer`, { ids: [firm.id], toOrgId: co.crm });
    expect(res).toMatchObject({ ok: true, moved: 1 });
    expect((await a.req('GET', `/api/crm/orgs/${mine}/companies/${firm.id}`)).status).toBe(404);
    expect((await a.req('GET', `/api/crm/orgs/${mine}/contacts/${c1.id}`)).status).toBe(404);
    expect((await a.req('GET', `/api/crm/orgs/${mine}/contacts/${stays.id}`)).status).toBe(200);
    const moved = await a.json('GET', `/api/crm/orgs/${co.crm}/companies/${firm.id}`);
    expect(moved.name).toBe('Harbour Pumps');
    expect(moved.tags.map((t: any) => t.name)).toEqual(['Key account']);
    const targetCf = (await a.json('GET', `/api/crm/orgs/${co.crm}/custom-fields`)).find((f: any) => f.label === 'Account number');
    expect(moved.custom[targetCf.id]).toBe('HP-001');
    const people = await a.json('GET', `/api/crm/orgs/${co.crm}/contacts`);
    expect(people.rows.map((r: any) => r.id).sort()).toEqual([c1.id, c2.id].sort());
    expect((await a.json('GET', `/api/crm/orgs/${co.crm}/contacts/${c1.id}`)).companyId).toBe(firm.id);
    const notes = await a.json('GET', `/api/crm/orgs/${co.crm}/notes?entity=company&recordId=${firm.id}`);
    expect(JSON.stringify(notes)).toContain('Pays on time');
    expect((await a.json('GET', `/api/crm/orgs/${co.crm}/activities/${act.id}`)).contact.id).toBe(c1.id);
    const audit = await env.DB.prepare("SELECT org_id, action FROM crm_audit_log WHERE target_id = ? AND action LIKE 'records.moved_%' ORDER BY action").bind(firm.id).all<{ org_id: string; action: string }>();
    expect(audit.results).toEqual([{ org_id: co.crm, action: 'records.moved_in' }, { org_id: mine, action: 'records.moved_out' }]);
    expect(await fkClean()).toEqual([]);
  });

  it('keeps records on a deal, and converted leads on their own; a contact takes the lead it came from', async () => {
    await flag('global');
    const a = await signup();
    const mine = await createOrg(a, 'Deals CRM');
    const co = await company(a, 'Elsewhere Pty');
    const onDeal = await a.json('POST', `/api/crm/orgs/${mine}/contacts`, { firstName: 'Ed', lastName: 'Deal' });
    await a.json('POST', `/api/crm/orgs/${mine}/deals`, { title: 'Big order', value: 100000, contactIds: [onDeal.id] });
    const lead = await a.json('POST', `/api/crm/orgs/${mine}/leads`, { firstName: 'Fay', lastName: 'Lead', companyName: 'Fay Co', email: 'fay@example.com' });
    const conv = await a.json('POST', `/api/crm/orgs/${mine}/leads/${lead.id}/convert`, { contact: { mode: 'create' }, company: { mode: 'none' }, deal: { create: false } });
    const free = await a.json('POST', `/api/crm/orgs/${mine}/contacts`, { firstName: 'Gus', lastName: 'Free' });

    const preview = await a.json('POST', `/api/crm/orgs/${mine}/contacts/transfer/preview`, { ids: [onDeal.id, conv.contactId, free.id], toOrgId: co.crm });
    const by = Object.fromEntries(preview.records.map((r: any) => [r.id, r]));
    expect(by[onDeal.id].ok).toBe(false);
    expect(by[onDeal.id].error).toMatch(/deal/);
    expect(by[conv.contactId]).toMatchObject({ ok: true, carries: { leads: 1 } });
    expect(by[free.id].ok).toBe(true);
    const leadAlone = await a.json('POST', `/api/crm/orgs/${mine}/leads/transfer/preview`, { ids: [lead.id], toOrgId: co.crm });
    expect(leadAlone.records[0].ok).toBe(false);
    expect(leadAlone.records[0].error).toMatch(/converted/);

    const res = await a.json('POST', `/api/crm/orgs/${mine}/contacts/transfer`, { ids: [onDeal.id, conv.contactId, free.id], toOrgId: co.crm });
    expect(res.moved).toBe(2);
    expect(res.ok).toBe(false);
    expect((await a.req('GET', `/api/crm/orgs/${mine}/contacts/${onDeal.id}`)).status).toBe(200);
    expect((await a.json('GET', `/api/crm/orgs/${co.crm}/leads/${lead.id}`)).contactId).toBe(conv.contactId);
    expect(await fkClean()).toEqual([]);
  });

  it('refuses people who may not add records in the other CRM, and records they cannot see', async () => {
    await flag('global');
    const a = await signup();
    const b = await signup();
    const theirs = await createOrg(b, 'Their CRM');
    const mine = await createOrg(a, 'Mine');
    await joinOrg(b, theirs, a, 'viewer');
    const ct = await a.json('POST', `/api/crm/orgs/${mine}/contacts`, { firstName: 'Hal', lastName: 'Here' });
    const r = await a.req('POST', `/api/crm/orgs/${mine}/contacts/transfer/preview`, { ids: [ct.id], toOrgId: theirs });
    expect(r.status).toBe(403);
    // Another CRM's record, named from this one, is not found.
    const other = await b.json('POST', `/api/crm/orgs/${theirs}/contacts`, { firstName: 'Not', lastName: 'Yours' });
    const second = await createOrg(a, 'Mine too');
    expect((await a.req('POST', `/api/crm/orgs/${mine}/contacts/transfer/preview`, { ids: [other.id], toOrgId: second })).status).toBe(404);
    // A CRM the person is not in at all answers as if it did not exist.
    const stranger = await createOrg(await signup(), 'Stranger');
    expect((await a.req('POST', `/api/crm/orgs/${mine}/contacts/transfer/preview`, { ids: [ct.id], toOrgId: stranger })).status).toBe(404);
  });
});

describe('carrying CRM values to another organisation', () => {
  it('maps list options by key, then by name', () => {
    const from = [{ key: 'warm', label: 'Warm' }, { key: 'cold', label: 'Cold' }];
    const to = [{ key: 'w2', label: 'warm' }, { key: 'cold', label: 'Frozen' }];
    expect(mapOption('warm', from, to)).toBe('w2');
    expect(mapOption('cold', from, to)).toBe('cold');
    expect(mapOption('hot', from, to)).toBeNull();
    expect(mapOption(null, from, to)).toBeNull();
  });

  it('maps custom fields by label and type, listing the rest', () => {
    const f = (id: string, label: string, type: string) => ({ id, entity: 'contact', label, type, options: [], required: false, position: 0, archived: false }) as any;
    const out = mapCustom(JSON.stringify({ a: 'X-1', b: 5, c: 'gone' }), [f('a', 'Account', 'text'), f('b', 'Size', 'number'), f('c', 'Region', 'text')], [f('z', 'account', 'text'), f('y', 'Size', 'text')]);
    expect(JSON.parse(out.json)).toEqual({ z: 'X-1' });
    expect(out.dropped.sort()).toEqual(['Region', 'Size']);
  });
});
