// Consolidation and intercompany (src/worker/erp/objects/intercompany.ts, fx.ts): legal entities name their Finance
// workspaces (only ones the person may read there); an intercompany sale approved by someone else makes a draft invoice in
// the seller's workspace and a draft bill in the buyer's, once, the bill converted at the company's own rate; the
// consolidated report translates each ledger at the closing rate, eliminates the intercompany balances to the cent,
// keeps outside sales, and leaves out (and says so) a workspace the person may not read. A fixed asset in another
// currency posts its depreciation converted at the rate.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';
import { monthEnd } from '../src/worker/erp/objects/hooks';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function registerCompany(c: Client, name: string) {
  const res = await c.req('POST', '/api/company/companies', { kind: 'business', name, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(`create company ${res.status}: ${JSON.stringify(data)}`);
  return data as { company: { id: string }; tools: { tasks: string; crm: string; finance: string } };
}

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const obj = (co: string, object: string, path = '') => erp(co, `/x/o/${object}${path}`);
const create = (c: Client, co: string, object: string, data: Record<string, unknown>) => c.json('POST', obj(co, object), { data });
const step = (c: Client, co: string, object: string, id: string, s: string, note?: string) => c.json('POST', obj(co, object, `/${id}/step/${s}`), { note });
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
function ym(k: number) {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - k, 1)).toISOString().slice(0, 7);
}

describe('consolidation and intercompany', () => {
  it('makes an intercompany invoice and bill once, then consolidates two currencies with the eliminations', async () => {
    const owner = await signup('Pa Owner');
    const { company, tools } = await registerCompany(owner, 'Pa Group');
    const co = company.id;
    const fa = tools.finance;
    // the subsidiary keeps its books in its own workspace, in New Zealand dollars
    const fc = (await owner.json('POST', '/api/fin/orgs', { name: 'Pa NZ books', kind: 'business', currency: 'NZD', country: 'New Zealand', timezone: 'Pacific/Auckland' })).id as string;
    // a finance controller who is an accountant in the parent's Finance only
    const controller = await signup('Pa Controller');
    const inv = await owner.json('POST', `/api/company/c/${co}/invitations`, { email: controller.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: 'accountant' });
    await controller.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
    await owner.json('PUT', erp(co, `/roles/${controller.userId}`), { roles: ['finance_controller'] });

    await create(owner, co, 'fx_rate', { fromCurrency: 'NZD', toCurrency: 'AUD', rate: 0.9, date: day(-30) });
    // the Finance workspace a person may pick: only those whose books they may read
    const opts = await controller.json('GET', erp(co, '/x/lookup/fin_workspace?q='));
    expect(opts.options.map((o: any) => o.id)).toEqual([fa]);
    expect((await controller.req('POST', obj(co, 'org_entity'), { data: { name: 'Pa NZ Ltd', entityType: 'subsidiary', country: 'NZ', currency: 'NZD', finWorkspace: fc } })).status).toBe(403);
    const parent = await create(owner, co, 'org_entity', { name: 'Pa Parent', entityType: 'parent', country: 'AU', currency: 'AUD', finWorkspace: fa });
    const sub = await create(owner, co, 'org_entity', { name: 'Pa NZ Ltd', entityType: 'subsidiary', country: 'NZ', currency: 'NZD', finWorkspace: fc, parent: parent.record.id, ownershipPct: 80 });

    // the same entity on both sides is refused
    expect((await owner.req('POST', obj(co, 'ic_transaction'), { data: { seller: parent.record.id, buyer: parent.record.id, date: day(-5), description: 'X', amount: 1, currency: 'AUD' } })).status).toBe(400);
    const ic = await create(owner, co, 'ic_transaction', { seller: parent.record.id, buyer: sub.record.id, date: day(-5), description: 'Management services', amount: 100_000, currency: 'AUD' });
    await step(owner, co, 'ic_transaction', ic.record.id, 'submit');
    // the person who made it does not approve it (someone else is in the company)
    expect((await owner.req('POST', obj(co, 'ic_transaction', `/${ic.record.id}/step/approve`), {})).status).toBe(403);
    await step(controller, co, 'ic_transaction', ic.record.id, 'approve');
    // the controller cannot make the bill in the subsidiary's books (no Finance role there)
    expect((await controller.req('POST', obj(co, 'ic_transaction', `/${ic.record.id}/action/documents`), {})).status).toBe(403);
    const made = await owner.json('POST', obj(co, 'ic_transaction', `/${ic.record.id}/action/documents`), {});
    expect(made.message).toContain('Draft invoice');
    expect(made.detail.record.status).toBe('documented');
    expect(made.detail.record.data).toMatchObject({ buyerAmount: 'NZD 1111.11' });
    expect(made.detail.record.data.rateUsed).toContain('AUD to NZD');
    expect((await owner.req('POST', obj(co, 'ic_transaction', `/${ic.record.id}/action/documents`), {})).status).toBe(409);
    const invoices = await env.DB.prepare("SELECT d.id, d.total, d.status, c.name FROM fin_docs d JOIN fin_contacts c ON c.id = d.contact_id WHERE d.org_id = ? AND d.kind = 'invoice'").bind(fa).all<any>();
    const bills = await env.DB.prepare("SELECT d.id, d.total, d.status, c.name FROM fin_docs d JOIN fin_contacts c ON c.id = d.contact_id WHERE d.org_id = ? AND d.kind = 'bill'").bind(fc).all<any>();
    expect(invoices.results).toHaveLength(1);
    expect(invoices.results[0]).toMatchObject({ total: 100_000, status: 'draft', name: 'Pa NZ Ltd' });
    expect(bills.results).toHaveLength(1);
    expect(bills.results[0]).toMatchObject({ total: 111_111, status: 'draft', name: 'Pa Parent' });
    // trade the other way: each workspace keeps one contact for the other entity, now customer and supplier
    const back = await create(owner, co, 'ic_transaction', { seller: sub.record.id, buyer: parent.record.id, date: day(-4), description: 'Parts', amount: 11_000, currency: 'NZD' });
    await step(owner, co, 'ic_transaction', back.record.id, 'submit');
    await step(controller, co, 'ic_transaction', back.record.id, 'approve');
    const backMade = await owner.json('POST', obj(co, 'ic_transaction', `/${back.record.id}/action/documents`), {});
    expect(backMade.message).toContain('Draft invoice');
    for (const [org, name] of [[fa, 'Pa NZ Ltd'], [fc, 'Pa Parent']]) {
      const contacts = await env.DB.prepare('SELECT kind FROM fin_contacts WHERE org_id = ? AND name = ?').bind(org, name).all<any>();
      expect(contacts.results).toEqual([{ kind: 'both' }]);
    }
    const backBill = await env.DB.prepare("SELECT d.total, c.name FROM fin_docs d JOIN fin_contacts c ON c.id = d.contact_id WHERE d.org_id = ? AND d.kind = 'bill'").bind(fa).first<any>();
    expect(backBill).toMatchObject({ name: 'Pa NZ Ltd', total: 9_900 });
    // the change of kind is in each workspace's audit log
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM fin_audit_log WHERE org_id = ? AND action = 'contact.updated' AND after_json LIKE '%both%'").bind(fa).first<any>()).n).toBe(1);
    // an archived intercompany contact is restored, not replaced by a second one
    const subContact = await env.DB.prepare("SELECT id FROM fin_contacts WHERE org_id = ? AND name = 'Pa NZ Ltd'").bind(fa).first<any>();
    await owner.json('PATCH', `/api/fin/orgs/${fa}/contacts/${subContact.id}`, { archived: true });
    const third = await create(owner, co, 'ic_transaction', { seller: parent.record.id, buyer: sub.record.id, date: day(-3), description: 'More services', amount: 1_000, currency: 'AUD' });
    await step(owner, co, 'ic_transaction', third.record.id, 'submit');
    await step(controller, co, 'ic_transaction', third.record.id, 'approve');
    await owner.json('POST', obj(co, 'ic_transaction', `/${third.record.id}/action/documents`), {});
    expect((await env.DB.prepare("SELECT id, archived_at FROM fin_contacts WHERE org_id = ? AND name = 'Pa NZ Ltd'").bind(fa).all<any>()).results).toEqual([{ id: subContact.id, archived_at: null }]);

    // Finance approves both (each workspace's own roles); the parent also sells 500.00 outside the group
    await owner.json('POST', `/api/fin/orgs/${fa}/docs/${invoices.results[0].id}/approve`, {});
    await owner.json('POST', `/api/fin/orgs/${fc}/docs/${bills.results[0].id}/approve`, {});
    const outside = await owner.json('POST', `/api/fin/orgs/${fa}/contacts`, { name: 'Outside Customer', kind: 'customer' });
    await owner.json('POST', `/api/fin/orgs/${fa}/docs`, { kind: 'invoice', contactId: outside.id, issueDate: day(-3), lines: [{ description: 'Consulting', quantity: 1, unitPrice: 50_000, accountId: (await env.DB.prepare("SELECT id FROM fin_accounts WHERE org_id = ? AND code = '200'").bind(fa).first<any>()).id }], action: 'approve' });

    const r = await owner.json('GET', erp(co, `/x/consolidation?from=${day(-60)}&to=${day(0)}&currency=AUD`));
    expect(r.entities.map((e: any) => e.name)).toEqual(['Pa Parent', 'Pa NZ Ltd']);
    expect(r.entities[1]).toMatchObject({ currency: 'NZD', rate: 0.9, ownershipPct: 80 });
    expect(r.excluded).toEqual([]);
    const P = parent.record.id;
    const S = sub.record.id;
    // income: the parent's 1,500.00 less the 1,000.00 to the subsidiary; expenses: the subsidiary's bill, eliminated
    expect(r.totals.revenue).toMatchObject({ [P]: 150_000, [S]: 0, __elim: -100_000, __total: 50_000 });
    expect(r.totals.expenses).toMatchObject({ [S]: 100_000, __elim: -100_000, __total: 0 });
    expect(r.totals.profit.__total).toBe(50_000);
    // the receivable and the payable eliminate; what the outside customer owes stays
    expect(r.totals.assets).toMatchObject({ [P]: 150_000, __elim: -100_000, __total: 50_000 });
    expect(r.totals.liabilities).toMatchObject({ [S]: 100_000, __elim: -100_000, __total: 0 });
    expect(r.totals.assets.__total).toBe(r.totals.liabilities.__total + r.totals.equity.__total);
    expect(r.intercompanyDifference).toEqual({ profitAndLoss: 0, balanceSheet: 0 });
    expect(r.notes.join(' ')).toContain('no minority interest');

    // the controller reads only the parent's books: the owner's own workspace is left out, with the reason
    const limited = await controller.json('GET', erp(co, `/x/consolidation?from=${day(-60)}&to=${day(0)}&currency=AUD`));
    expect(limited.entities.map((e: any) => e.name)).toEqual(['Pa Parent']);
    expect(limited.excluded[0]).toMatchObject({ name: 'Pa NZ Ltd', reason: expect.stringContaining('nor one of a company where you are the owner or an administrator') });
    // presented in a currency with no rate: each entity is left out, saying which rate to add
    const usd = await owner.json('GET', erp(co, `/x/consolidation?to=${day(0)}&currency=USD`));
    expect(usd.entities).toEqual([]);
    expect(usd.excluded[0].reason).toContain('Add an exchange rate from AUD to USD');
    // CSV
    const csv = await owner.req('GET', erp(co, `/x/consolidation?from=${day(-60)}&to=${day(0)}&currency=AUD&format=csv`));
    expect(csv.headers.get('content-type')).toContain('text/csv');
    expect(await csv.text()).toContain('Eliminations');
    // another company cannot open it
    const stranger = await signup('Pa Stranger');
    expect((await stranger.req('GET', erp(co, '/x/consolidation'))).status).toBe(404);
  });

  it('posts depreciation of an asset in another currency at the company’s rate, and refuses without one', async () => {
    const owner = await signup('Pb Owner');
    const { company, tools } = await registerCompany(owner, 'Pb Group');
    const co = company.id;
    const fin = tools.finance;
    const s = await owner.json('GET', erp(co, '/x/postings'));
    await owner.json('PUT', erp(co, '/x/postings'), { accounts: Object.fromEntries(s.roles.filter((r: any) => r.kind === 'depreciation').map((r: any) => [r.role, r.suggested.id])) });
    // 1,200.00 US dollars over 12 months: 100.00 a month
    const asset = await create(owner, co, 'fa_asset', { name: 'Imported scanner', category: 'it', acquisitionDate: `${ym(3)}-01`, cost: 120_000, usefulLifeMonths: 12, method: 'straight_line', currency: 'USD' });
    await step(owner, co, 'fa_asset', asset.record.id, 'place');
    const refused = await owner.req('POST', obj(co, 'fa_asset', `/${asset.record.id}/action/post`), { input: { upTo: monthEnd(ym(1)) } });
    expect(refused.status).toBe(409);
    expect(((await refused.json()) as any).error).toContain('Add an exchange rate from USD to AUD');
    // a rate entered the other way round (AUD to USD 0.64) is used inverted: 100.00 USD is 156.25 AUD
    await create(owner, co, 'fx_rate', { fromCurrency: 'AUD', toCurrency: 'USD', rate: 0.64, date: `${ym(4)}-01` });
    const posted = await owner.json('POST', obj(co, 'fa_asset', `/${asset.record.id}/action/post`), { input: { upTo: monthEnd(ym(1)) } });
    expect(posted.result).toHaveLength(3);
    const lines = await env.DB.prepare("SELECT SUM(l.debit) AS d, SUM(l.credit) AS c FROM fin_journal_lines l JOIN fin_journals j ON j.id = l.journal_id WHERE j.org_id = ? AND j.source_id = ?").bind(fin, asset.record.id).first<any>();
    expect(lines).toEqual({ d: 3 * 15_625, c: 3 * 15_625 });
    const memo = await env.DB.prepare('SELECT memo FROM fin_journals WHERE org_id = ? AND source_id = ? LIMIT 1').bind(fin, asset.record.id).first<any>();
    expect(memo.memo).toContain('USD 100.00 at 1.5625');
  });
});
