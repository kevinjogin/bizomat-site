// Custom fields on the modules framework's records (src/worker/erp/objects/custom.ts): added only by an ERP
// administrator, the company's own, checked on the server like any field (required, choices, money), shown on forms,
// records, lists, filters and CSV export and import, archived with their values kept and restored.
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function company(label: string) {
  const owner = await signup(`${label} Owner`);
  const res = await owner.req('POST', '/api/company/companies', { kind: 'business', name: `${label} Works`, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  const data = (await res.json()) as any;
  return { owner, co: data.company.id as string };
}

async function join(owner: Client, co: string, who: Client, roles: string[]) {
  const inv = await owner.json('POST', `/api/company/c/${co}/invitations`, { email: who.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  await who.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
  await owner.json('PUT', `/api/erp/c/${co}/roles/${who.userId}`, { roles });
}

const x = (co: string, p: string) => `/api/erp/c/${co}/x${p}`;

describe('custom fields', () => {
  it('are added by an ERP administrator and checked, listed, filtered, exported, imported, archived and restored', async () => {
    const { owner, co } = await company('Cf');
    const contracts = await signup('Cf Contracts');
    await join(owner, co, contracts, ['contracts_manager']);
    // only an ERP administrator adds them
    expect((await contracts.req('POST', x(co, '/fields/ct_contract'), { label: 'Risk rating', type: 'select', options: ['Low', 'High'] })).status).toBe(403);
    expect((await owner.req('POST', x(co, '/fields/ct_contract'), { label: 'Risk rating', type: 'select', options: ['Low'] })).status).toBe(400);
    const added = await owner.json('POST', x(co, '/fields/ct_contract'), { label: 'Risk rating', type: 'select', options: ['Low', 'Medium', 'High'], required: true, list: true });
    expect(added.fields[0]).toMatchObject({ key: 'cf_risk_rating', type: 'select', required: true, list: true });
    await owner.json('POST', x(co, '/fields/ct_contract'), { label: 'Insurance cover', type: 'money' });
    await owner.json('POST', x(co, '/fields/ct_contract'), { label: 'Signed by the customer', type: 'bool' });
    // a name already used (its own or the definition's) is refused
    expect((await owner.req('POST', x(co, '/fields/ct_contract'), { label: 'risk rating', type: 'text' })).status).toBe(409);
    expect((await owner.req('POST', x(co, '/fields/ct_contract'), { label: 'Title', type: 'text' })).status).toBe(409);

    // the form's definition carries them; the server checks them
    const list = await contracts.json('GET', x(co, '/o/ct_contract'));
    const cf = list.object.fields.filter((f: any) => f.custom);
    expect(cf.map((f: any) => f.key)).toEqual(['cf_risk_rating', 'cf_insurance_cover', 'cf_signed_by_the_customer']);
    expect(cf[0]).toMatchObject({ section: 'Custom fields', options: { low: 'Low', medium: 'Medium', high: 'High' } });
    const base = { title: 'Fit-out support', partyType: 'other', otherParty: 'Someone', startDate: '2026-11-01' };
    const missing = await contracts.req('POST', x(co, '/o/ct_contract'), { data: base });
    expect(missing.status).toBe(400);
    expect(((await missing.json()) as any).error).toBe('Risk rating is required');
    expect((await contracts.req('POST', x(co, '/o/ct_contract'), { data: { ...base, cf_risk_rating: 'extreme' } })).status).toBe(400);
    const made = await contracts.json('POST', x(co, '/o/ct_contract'), { data: { ...base, cf_risk_rating: 'high', cf_insurance_cover: 2_000_000, cf_signed_by_the_customer: true } });
    expect(made.record.data).toMatchObject({ cf_risk_rating: 'high', cf_insurance_cover: 2_000_000, cf_signed_by_the_customer: true });
    await contracts.json('POST', x(co, '/o/ct_contract'), { data: { ...base, title: 'Small job', cf_risk_rating: 'low' } });
    // filtered and exported
    const high = await contracts.json('GET', x(co, '/o/ct_contract?f.cf_risk_rating=high'));
    expect(high.records.map((r: any) => r.id)).toEqual([made.record.id]);
    const csv = await (await contracts.req('GET', x(co, '/o/ct_contract?format=csv'))).text();
    expect(csv.split('\n')[0]).toContain('Risk rating');
    expect(csv).toContain('High');
    // imported by its name, checked whole first
    const bad = await contracts.req('POST', x(co, '/o/ct_contract/import'), { csv: 'Title,Party,Other party,Starts,Risk rating\nA,other,X,2026-11-02,High\nB,other,Y,2026-11-03,Unknown', dryRun: false });
    expect(bad.status).toBe(400);
    const imp = await contracts.json('POST', x(co, '/o/ct_contract/import'), { csv: 'title,partyType,otherParty,startDate,cf_risk_rating\nImported,other,Z,2026-11-04,medium', dryRun: false });
    expect(imp.made).toHaveLength(1);

    // archived: hidden from the forms, the value kept; restored: back
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_risk_rating'), { archived: true });
    const after = await contracts.json('GET', x(co, `/o/ct_contract/${made.record.id}`));
    expect(after.object.fields.some((f: any) => f.key === 'cf_risk_rating')).toBe(false);
    // a change saved meanwhile keeps the archived field's value
    await contracts.json('PATCH', x(co, `/o/ct_contract/${made.record.id}`), { data: { reference: 'R-1' }, version: after.record.version });
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_risk_rating'), { archived: false });
    const back = await contracts.json('GET', x(co, `/o/ct_contract/${made.record.id}`));
    expect(back.record.data.cf_risk_rating).toBe('high');
    expect(back.record.data.reference).toBe('R-1');

    // changing the choices: one still offered keeps its key, whatever the order; one left out is kept, marked once,
    // and not offered on the form; a new one gets a key never used
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_risk_rating'), { options: ['High', 'Critical', 'Low'] });
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_risk_rating'), { options: ['Low', 'High', 'Critical'] });
    const listed = (await owner.json('GET', x(co, '/fields/ct_contract'))).fields.find((f: any) => f.key === 'cf_risk_rating');
    expect(listed.options).toEqual([
      { key: 'low', label: 'Low', retired: false },
      { key: 'high', label: 'High', retired: false },
      { key: 'critical', label: 'Critical', retired: false },
      { key: 'medium', label: 'Medium (no longer offered)', retired: true },
    ]);
    const shown = await contracts.json('GET', x(co, `/o/ct_contract/${made.record.id}`));
    expect(shown.record.data.cf_risk_rating).toBe('high');
    expect(shown.object.fields.find((f: any) => f.key === 'cf_risk_rating')).toMatchObject({ retired: ['medium'] });
    // offered again: it gets its own key back
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_risk_rating'), { options: ['Low', 'Medium', 'High', 'Critical'] });
    expect((await owner.json('GET', x(co, '/fields/ct_contract'))).fields.find((f: any) => f.key === 'cf_risk_rating').options.map((o: any) => o.key)).toEqual(['low', 'medium', 'high', 'critical']);

    // labels that make the same key, or none in Latin letters, each get their own (and the request ends)
    const regions = ['North', 'South', 'East', 'West', 'Central', 'Islands', 'Remote', 'Coast'].map((r) => `Customer category for the region ${r}`);
    const long = await owner.json('POST', x(co, '/fields/ct_contract'), { label: 'Region category', type: 'select', options: regions });
    const longKeys = long.fields.find((f: any) => f.label === 'Region category').options.map((o: any) => o.key);
    expect(new Set(longKeys).size).toBe(8);
    const cities = ['東京', '大阪', '名古屋', '札幌', '福岡', '神戸', '京都', '仙台', '広島', '千葉', '横浜', '川崎', '堺', '新潟', '浜松', '熊本', '岡山', '静岡', '鹿児島', '那覇', '金沢'];
    const jp = await owner.json('POST', x(co, '/fields/ct_contract'), { label: 'City', type: 'select', options: cities });
    const jpKeys = jp.fields.find((f: any) => f.label === 'City').options.map((o: any) => o.key);
    expect(new Set(jpKeys).size).toBe(cities.length);
    // reordered: each choice keeps its own key
    const byLabel = (opts: any[]) => Object.fromEntries(opts.map((o: any) => [o.label, o.key]));
    const jpBefore = byLabel(jp.fields.find((f: any) => f.label === 'City').options);
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_city'), { options: [...cities].reverse() });
    expect(byLabel((await owner.json('GET', x(co, '/fields/ct_contract'))).fields.find((f: any) => f.key === 'cf_city').options)).toEqual(jpBefore);
    // an offered label that itself ends like a retired one keeps its key
    const legacy = await owner.json('POST', x(co, '/fields/ct_contract'), { label: 'Legacy flag', type: 'select', options: ['A', 'Old (no longer offered)'] });
    const legacyKeys = legacy.fields.find((f: any) => f.label === 'Legacy flag').options.map((o: any) => o.key);
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_legacy_flag'), { options: ['A', 'Old (no longer offered)'] });
    await owner.json('PATCH', x(co, '/fields/ct_contract/cf_legacy_flag'), { options: ['A', 'Old (no longer offered)'] });
    const again = (await owner.json('GET', x(co, '/fields/ct_contract'))).fields.find((f: any) => f.key === 'cf_legacy_flag').options;
    expect(again.map((o: any) => o.key)).toEqual(legacyKeys);
    expect(again.every((o: any) => !o.retired)).toBe(true);

    // another company has none of them, and cannot reach these
    const other = await company('Cg');
    expect((await other.owner.json('GET', x(other.co, '/o/ct_contract'))).object.fields.some((f: any) => f.custom)).toBe(false);
    expect((await other.owner.req('GET', x(co, '/fields/ct_contract'))).status).toBe(404);
    expect((await owner.req('GET', x(co, '/fields/nonsense'))).status).toBe(404);
  });
});
