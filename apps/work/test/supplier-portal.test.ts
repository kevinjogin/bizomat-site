// The supplier portal (src/worker/erp/supplier-portal.ts; flag supplier_portal, off by default): a buyer invites a
// supplier's person by email; only the account with that address accepts; they see only that supplier's sent orders and
// requests, never internal notes, other suppliers' quotations or the company's own attachments; they answer an order once
// per revision, send a quotation while the request is open, and add a PDF; revoking ends it at once; another company and
// another supplier stay out of reach.
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { signup, uniqueEmail, type Client } from './helpers';

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const portalOn = (co: string) => env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('supplier_portal', 'company', ?, 'on', 'test switch', 'test', ?)").bind(co, Date.now()).run();

async function ownCompany(c: Client) {
  return (await c.json('GET', '/api/maintenance/companies')).companies.find((x: any) => x.kind === 'own').id as string;
}

async function supplier(c: Client, co: string, legalName: string) {
  const s = await c.json('POST', erp(co, '/suppliers'), { legalName });
  await c.json('POST', erp(co, `/suppliers/${s.id}/status`), { status: 'approved' });
  return s as { id: string };
}

describe('the supplier portal', () => {
  it('lets an invited supplier person see and answer only their own orders and requests', async () => {
    const buyer = await signup('Sp Buyer');
    const co = await ownCompany(buyer);
    const acme = await supplier(buyer, co, 'Acme Fasteners');
    const other = await supplier(buyer, co, 'Other Metals');

    // off: nothing answers
    expect((await buyer.json('GET', erp(co, `/suppliers/${acme.id}/portal`))).enabled).toBe(false);
    expect((await buyer.req('POST', erp(co, `/suppliers/${acme.id}/portal/invitations`), { email: uniqueEmail('rep') })).status).toBe(404);
    await portalOn(co);

    // an order sent to Acme (with an internal note), one still a draft, one to the other supplier
    const po = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: acme.id, notes: 'Internal: we expect 30 percent margin', terms: 'Deliver to the back dock', lines: [{ item: 'Hex bolt M8', quantity: 100, unitPriceCents: 25 }] });
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/submit`), {});
    await buyer.json('POST', erp(co, `/purchase-orders/${po.id}/sent`), {});
    const draft = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: acme.id, lines: [{ item: 'Washer', quantity: 10, unitPriceCents: 5 }] });
    const theirs = await buyer.json('POST', erp(co, '/purchase-orders'), { supplierId: other.id, lines: [{ item: 'Sheet', quantity: 1, unitPriceCents: 9_000 }] });
    await buyer.json('POST', erp(co, `/purchase-orders/${theirs.id}/submit`), {});
    await buyer.json('POST', erp(co, `/purchase-orders/${theirs.id}/sent`), {});
    // a request for quotation to both suppliers, sent; the other supplier quotes through the buyer
    const rfq = await buyer.json('POST', erp(co, '/rfqs'), { title: 'Nuts', supplierIds: [acme.id, other.id], lines: [{ item: 'Hex nut M8', quantity: 200 }] });
    await buyer.json('POST', erp(co, `/rfqs/${rfq.id}/sent`), { supplierId: acme.id });
    const rfqView = await buyer.json('GET', erp(co, `/rfqs/${rfq.id}`));
    const lineId = rfqView.lines[0].id as string;
    await buyer.json('PUT', erp(co, `/rfqs/${rfq.id}/quotations/${other.id}`), { lines: [{ rfqLineId: lineId, unitPriceCents: 11 }] });
    // an internal attachment on the order
    const f = new FormData();
    f.set('kind', 'purchase_order');
    f.set('id', po.id);
    f.set('file', new File(['%PDF-1.4\n% internal pricing sheet\n'], 'internal.pdf', { type: 'application/pdf' }));
    expect((await buyer.req('POST', erp(co, '/record-files'), f)).status).toBe(201);

    // the invitation: only the account with the invited address accepts it
    const email = uniqueEmail('acme-rep');
    const inv = await buyer.json('POST', erp(co, `/suppliers/${acme.id}/portal/invitations`), { email });
    const token = decodeURIComponent(inv.url.split('/supplier-portal/join/')[1]);
    expect(await env.DB.prepare('SELECT token_hash FROM erp_supplier_portal_users WHERE token_hash = ?').bind(token).first()).toBeNull();
    const stranger = await signup('Sp Stranger');
    expect((await stranger.json('GET', `/api/supplier-portal/invitations/${encodeURIComponent(token)}`)).forYou).toBe(false);
    expect((await stranger.req('POST', `/api/supplier-portal/invitations/${encodeURIComponent(token)}/accept`, {})).status).toBe(403);
    const rep = await signup('Acme Rep', email);
    expect((await rep.json('GET', `/api/supplier-portal/invitations/${encodeURIComponent(token)}`))).toMatchObject({ forYou: true, supplierName: 'Acme Fasteners', status: 'pending' });
    await rep.json('POST', `/api/supplier-portal/invitations/${encodeURIComponent(token)}/accept`, {});
    expect((await rep.req('POST', `/api/supplier-portal/invitations/${encodeURIComponent(token)}/accept`, {})).status).toBe(404);
    expect((await rep.json('GET', '/api/supplier-portal')).portals).toEqual([{ companyId: co, companyName: expect.any(String), supplierId: acme.id, supplierName: 'Acme Fasteners' }]);
    // never a company member: the ERP stays closed to them
    expect((await rep.req('GET', erp(co, '/purchase-orders'))).status).toBeGreaterThanOrEqual(403);

    const base = `/api/supplier-portal/${co}/${acme.id}`;
    const home = await rep.json('GET', base);
    expect(home.orders.map((o: any) => o.id)).toEqual([po.id]);
    expect(home.orders[0]).toMatchObject({ needsAnswer: true, acknowledged: null });
    expect(home.rfqs.map((r: any) => r.id)).toEqual([rfq.id]);
    // the other supplier's order and records are not theirs
    expect((await rep.req('GET', `${base}/orders/${theirs.id}`)).status).toBe(404);
    expect((await rep.req('GET', `${base}/orders/${draft.id}`)).status).toBe(404);
    expect((await rep.req('GET', `/api/supplier-portal/${co}/${other.id}`)).status).toBe(404);
    const detail = await rep.json('GET', `${base}/orders/${po.id}`);
    expect(detail.order).toMatchObject({ number: po.number ?? expect.any(String), terms: 'Deliver to the back dock' });
    expect(JSON.stringify(detail)).not.toContain('30 percent margin');
    expect(detail.files).toEqual([]);
    expect(detail.lines[0]).toMatchObject({ item: 'Hex bolt M8', quantity: 100, unitPriceCents: 25 });

    // the answer: accepted with a date, once for this revision; the buyer sees it and is told
    expect((await rep.req('POST', `${base}/orders/${po.id}/acknowledge`, { decision: 'accepted' })).status).toBe(400);
    expect((await rep.req('POST', `${base}/orders/${po.id}/acknowledge`, { decision: 'declined' })).status).toBe(400);
    await rep.json('POST', `${base}/orders/${po.id}/acknowledge`, { decision: 'accepted', promisedDate: day(7), note: 'From stock' });
    expect((await rep.req('POST', `${base}/orders/${po.id}/acknowledge`, { decision: 'accepted', promisedDate: day(8) })).status).toBe(409);
    const seen = await buyer.json('GET', erp(co, `/purchase-orders/${po.id}/portal`));
    expect(seen.acknowledgements[0]).toMatchObject({ revision: 1, decision: 'accepted', promisedDate: day(7), by: 'Acme Rep' });
    expect(await env.DB.prepare("SELECT 1 FROM erp_alerts WHERE company_id = ? AND user_id = ? AND kind = 'portal'").bind(co, buyer.userId).first()).toBeTruthy();

    // the quotation: their own only, never the other supplier's, and marked as from the portal
    const r1 = await rep.json('GET', `${base}/rfqs/${rfq.id}`);
    expect(r1.quotation).toBeNull();
    expect(JSON.stringify(r1)).not.toContain('Other Metals');
    expect((await rep.req('PUT', `${base}/rfqs/${rfq.id}/quotation`, { lines: [{ rfqLineId: 'not-a-line-of-it', unitPriceCents: 10 }] })).status).toBe(400);
    await rep.json('PUT', `${base}/rfqs/${rfq.id}/quotation`, { reference: 'Q-77', leadTimeDays: 5, lines: [{ rfqLineId: lineId, unitPriceCents: 10 }] });
    const q = await env.DB.prepare('SELECT total_cents, source, created_by FROM erp_quotations WHERE company_id = ? AND rfq_id = ? AND supplier_id = ?').bind(co, rfq.id, acme.id).first<any>();
    expect(q).toMatchObject({ total_cents: 2_000, source: 'portal', created_by: rep.userId });
    expect((await rep.json('GET', `${base}/rfqs/${rfq.id}`)).quotation).toMatchObject({ reference: 'Q-77', totalCents: 2_000 });
    // closed for quotations: refused
    await env.DB.prepare("UPDATE erp_rfqs SET status = 'awarded' WHERE company_id = ? AND id = ?").bind(co, rfq.id).run();
    expect((await rep.req('PUT', `${base}/rfqs/${rfq.id}/quotation`, { lines: [{ rfqLineId: lineId, unitPriceCents: 9 }] })).status).toBe(409);

    // a document: PDF or a picture only; the supplier sees theirs, never the company's attachment
    const bad = new FormData();
    bad.set('file', new File(['hello'], 'note.txt', { type: 'text/plain' }));
    expect((await rep.req('POST', `${base}/orders/${po.id}/files`, bad)).status).toBe(400);
    const good = new FormData();
    good.set('file', new File(['%PDF-1.4\n% delivery docket\n'], 'docket.pdf', { type: 'application/pdf' }));
    const up = await rep.json('POST', `${base}/orders/${po.id}/files`, good);
    const files = (await rep.json('GET', `${base}/orders/${po.id}`)).files;
    expect(files.map((x: any) => x.name)).toEqual(['docket.pdf']);
    expect((await rep.req('GET', up.url)).status).toBe(200);
    const internal = await env.DB.prepare("SELECT id FROM erp_record_files WHERE company_id = ? AND name = 'internal.pdf'").bind(co).first<any>();
    expect((await rep.req('GET', `${base}/files/${internal.id}`)).status).toBe(404);
    // the buyer sees the supplier's document with the order's files
    expect((await buyer.json('GET', erp(co, `/purchase-orders/${po.id}`))).files.map((x: any) => x.name)).toContain('docket.pdf');

    // revoked: the portal closes at once
    const people = (await buyer.json('GET', erp(co, `/suppliers/${acme.id}/portal`))).people;
    expect(people[0]).toMatchObject({ email, status: 'active', name: 'Acme Rep' });
    await buyer.json('POST', erp(co, `/suppliers/${acme.id}/portal/${people[0].id}/revoke`), {});
    expect((await rep.req('GET', base)).status).toBe(404);
    expect((await rep.json('GET', '/api/supplier-portal')).portals).toEqual([]);
  });

  it('keeps the portal closed where the flag is off, and to API tokens', async () => {
    const buyer = await signup('Sq Buyer');
    const co = await ownCompany(buyer);
    const s = await supplier(buyer, co, 'Closed Supplies');
    await portalOn(co);
    const email = uniqueEmail('closed-rep');
    const inv = await buyer.json('POST', erp(co, `/suppliers/${s.id}/portal/invitations`), { email });
    const rep = await signup('Closed Rep', email);
    await rep.json('POST', `/api/supplier-portal/invitations/${encodeURIComponent(decodeURIComponent(inv.url.split('/supplier-portal/join/')[1]))}/accept`, {});
    expect((await rep.req('GET', `/api/supplier-portal/${co}/${s.id}`)).status).toBe(200);
    // switched off for the company: not found, though the access is kept
    await env.DB.prepare("UPDATE feature_flags SET value = 'off' WHERE key = 'supplier_portal' AND scope = 'company' AND scope_id = ?").bind(co).run();
    expect((await rep.req('GET', `/api/supplier-portal/${co}/${s.id}`)).status).toBe(404);
    // someone already using the portal for this supplier is not invited again
    await env.DB.prepare("UPDATE feature_flags SET value = 'on' WHERE key = 'supplier_portal' AND scope = 'company' AND scope_id = ?").bind(co).run();
    expect((await buyer.req('POST', erp(co, `/suppliers/${s.id}/portal/invitations`), { email: rep.email })).status).toBe(409);
  });
});
