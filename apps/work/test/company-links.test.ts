// Links between a company's tools (src/worker/company/links.ts): one customer record, a won deal to a draft invoice, a
// deal to a project, and a project's costs and budget from Finance. Each checks both tools' permissions and the company.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function company(c: Client) {
  const res = await c.req('POST', '/api/company/companies', {
    kind: 'business', name: 'Ridge Electrical', abn: newAbn(), email: uniqueEmail('office'), phone: '(07) 3123 4567',
    addressLine1: '5 Example Road', suburb: 'Brisbane', state: 'QLD', postcode: '4000',
  });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(JSON.stringify(data));
  return data as { company: { id: string }; tools: { tasks: string; crm: string; finance: string } };
}

async function join(owner: Client, companyId: string, roles: Record<string, string | null>) {
  const person = await signup('Joined Person');
  const inv = await owner.json('POST', `/api/company/c/${companyId}/invitations`, { email: person.email, ...roles });
  await person.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
  return person;
}

describe('links between the tools of a company', () => {
  it('keeps one customer record across the CRM and Finance', async () => {
    const owner = await signup('Lin Owner');
    const { tools } = await company(owner);
    const crmCo = await owner.json('POST', `/api/crm/orgs/${tools.crm}/companies`, { name: 'Harbour Builders', email: 'accounts@harbour.example.com', phone: '0298765432' });
    const before = await owner.json('GET', `/api/company/links/crm/${tools.crm}/companies/${crmCo.id}`);
    expect(before.finance).toMatchObject({ access: true, canCreate: true, contact: null });
    const made = await owner.json('POST', `/api/company/links/crm/${tools.crm}/companies/${crmCo.id}/customer`, {});
    const contact = await env.DB.prepare('SELECT name, email, kind, org_id FROM fin_contacts WHERE id = ?').bind(made.contactId).first<any>();
    expect(contact).toMatchObject({ name: 'Harbour Builders', email: 'accounts@harbour.example.com', kind: 'customer', org_id: tools.finance });
    const after = await owner.json('GET', `/api/company/links/crm/${tools.crm}/companies/${crmCo.id}`);
    expect(after.finance.contact.id).toBe(made.contactId);
    expect(after.finance.receivables).toMatchObject({ openInvoices: 0, owed: 0 });
    // Asking again gives the same customer, never a second one.
    expect((await owner.json('POST', `/api/company/links/crm/${tools.crm}/companies/${crmCo.id}/customer`, {})).contactId).toBe(made.contactId);
  });

  it('turns a won deal into a draft invoice for its customer, once, and only for people Finance lets invoice', async () => {
    const owner = await signup('Max Owner');
    const { company: co, tools } = await company(owner);
    const crmCo = await owner.json('POST', `/api/crm/orgs/${tools.crm}/companies`, { name: 'Coast Fabrication' });
    const deal = await owner.json('POST', `/api/crm/orgs/${tools.crm}/deals`, { title: 'Switchboard upgrade', value: 1_250_000, companyId: crmCo.id });
    expect((await owner.req('POST', `/api/company/links/crm/${tools.crm}/deals/${deal.id}/invoice`, {})).status).toBe(400); // not won yet
    await owner.json('POST', `/api/crm/orgs/${tools.crm}/deals/${deal.id}/close`, { outcome: 'won' });
    const view = await owner.json('GET', `/api/company/links/crm/${tools.crm}/deals/${deal.id}`);
    expect(view.finance).toMatchObject({ access: true, canInvoice: true, invoice: null });

    const seller = await join(owner, co.id, { crmRole: 'sales', finRole: null });
    expect((await seller.req('POST', `/api/company/links/crm/${tools.crm}/deals/${deal.id}/invoice`, {})).status).toBe(403);

    const inv = await owner.json('POST', `/api/company/links/crm/${tools.crm}/deals/${deal.id}/invoice`, {});
    const doc = await env.DB.prepare('SELECT d.status, d.subtotal, d.org_id, c.name AS customer FROM fin_docs d JOIN fin_contacts c ON c.id = d.contact_id WHERE d.id = ?').bind(inv.invoiceId).first<any>();
    expect(doc).toMatchObject({ status: 'draft', subtotal: 1_250_000, org_id: tools.finance, customer: 'Coast Fabrication' });
    // A draft posts nothing to the ledger.
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM fin_journals WHERE org_id = ? AND source_id = ?").bind(tools.finance, inv.invoiceId).first<any>()).n).toBe(0);
    expect((await owner.req('POST', `/api/company/links/crm/${tools.crm}/deals/${deal.id}/invoice`, {})).status).toBe(409);
    const linked = await owner.json('GET', `/api/company/links/crm/${tools.crm}/deals/${deal.id}`);
    expect(linked.finance.invoice).toMatchObject({ id: inv.invoiceId, status: 'draft' });
    // The seller sees that there is an invoice, not its details.
    expect((await seller.json('GET', `/api/company/links/crm/${tools.crm}/deals/${deal.id}`)).finance).toMatchObject({ access: false, invoice: { hidden: true } });
  });

  it('starts a project from a deal, and shows the project’s Finance income and costs against its budget', async () => {
    const owner = await signup('Nia Owner');
    const { company: co, tools } = await company(owner);
    const deal = await owner.json('POST', `/api/crm/orgs/${tools.crm}/deals`, { title: 'Warehouse fit-out', value: 5_000_000 });
    const p = await owner.json('POST', `/api/company/links/crm/${tools.crm}/deals/${deal.id}/project`, {});
    const board = await env.DB.prepare('SELECT name, workspace_id FROM boards WHERE id = ?').bind(p.boardId).first<any>();
    expect(board).toMatchObject({ name: 'Warehouse fit-out', workspace_id: tools.tasks });
    expect((await owner.req('POST', `/api/company/links/crm/${tools.crm}/deals/${deal.id}/project`, {})).status).toBe(409);

    const view = await owner.json('GET', `/api/company/links/projects/${p.boardId}`);
    expect(view.finance).toMatchObject({ linked: false, canLink: true });
    expect(view.deal.id).toBe(deal.id);
    const link = await owner.json('POST', `/api/company/links/projects/${p.boardId}/finance`, { budget: 2_000_000 });
    const tracking = await env.DB.prepare('SELECT kind, name, org_id FROM fin_tracking WHERE id = ?').bind(link.trackingId).first<any>();
    expect(tracking).toMatchObject({ kind: 'project', name: 'Warehouse fit-out', org_id: tools.finance });

    // A cost posted in Finance to that project shows on the project.
    const accounts = await owner.json('GET', `/api/fin/orgs/${tools.finance}/accounts`);
    const bank = accounts.find((x: any) => x.subtype === 'bank');
    const expense = accounts.find((x: any) => x.type === 'expense' && x.code === '429');
    await owner.json('POST', `/api/fin/orgs/${tools.finance}/transactions`, { kind: 'spend', accountId: bank.id, date: new Date().toISOString().slice(0, 10), description: 'Steel', action: 'post', lines: [{ accountId: expense.id, amount: 300_000, projectId: link.trackingId }] });
    const figures = (await owner.json('GET', `/api/company/links/projects/${p.boardId}`)).finance.figures;
    expect(figures.budget).toBe(2_000_000);
    expect(figures.costs).toBeGreaterThan(0);
    expect(figures.remaining).toBe(2_000_000 - figures.costs);
    expect(figures.overBudget).toBe(false);
    const list = await owner.json('GET', `/api/company/c/${co.id}/projects`);
    expect(list.find((x: any) => x.id === p.boardId)).toMatchObject({ fromDeal: true, linked: true });

    // Someone with Project Management only sees the project, not its money.
    const pm = await join(owner, co.id, { tasksRole: 'member', crmRole: null, finRole: null });
    const theirs = await pm.json('GET', `/api/company/links/projects/${p.boardId}`);
    expect(theirs.finance).toMatchObject({ access: false, figures: null, canLink: false });
    expect((await pm.req('POST', `/api/company/links/projects/${p.boardId}/finance`, { budget: 1 })).status).toBe(403);
  });

  it('never links tools of different companies, or tools no company runs', async () => {
    const a = await signup('Ola First');
    const b = await signup('Pia Second');
    const ca = await company(a);
    await company(b);
    const deal = await a.json('POST', `/api/crm/orgs/${ca.tools.crm}/deals`, { title: 'Private', value: 100 });
    // Someone outside the CRM organisation cannot reach the deal through the links.
    expect((await b.req('GET', `/api/company/links/crm/${ca.tools.crm}/deals/${deal.id}`)).status).toBe(404);
    expect((await b.req('POST', `/api/company/links/crm/${ca.tools.crm}/deals/${deal.id}/project`, {})).status).toBe(404);
    // A CRM organisation outside any company has nothing to link to.
    const loose = await b.json('POST', '/api/crm/orgs', { name: 'Loose org', currency: 'AUD', timezone: 'Australia/Sydney' });
    const d2 = await b.json('POST', `/api/crm/orgs/${loose.id}/deals`, { title: 'Alone', value: 100 });
    expect((await b.json('GET', `/api/company/links/crm/${loose.id}/deals/${d2.id}`)).company).toBeNull();
    expect((await b.req('POST', `/api/company/links/crm/${loose.id}/deals/${d2.id}/project`, {})).status).toBe(400);
  });
});
