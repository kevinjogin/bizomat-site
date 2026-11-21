// Price lists and promotions on sales orders (src/worker/erp/objects/pricing.ts, src/worker/erp/sales.ts): a line without
// a price takes the customer's own list, else the lowest list price whose quantity break is met, else the standard
// price, then the best promotion; each line says where its price came from, a typed price is kept and called typed; the
// price check gives the same answer; with the Pricing module switched off, only standard prices apply.
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

const erp = (co: string, path = '') => `/api/erp/c/${co}${path}`;
const x = (co: string, p: string) => erp(co, `/x${p}`);
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

async function customer(owner: Client, crm: string, name: string) {
  const crmCo = await owner.json('POST', `/api/crm/orgs/${crm}/companies`, { name, email: `accounts@${name.toLowerCase().replace(/\W+/g, '')}.example.com` });
  const link = await owner.json('POST', `/api/company/links/crm/${crm}/companies/${crmCo.id}/customer`, {});
  return { crmCompanyId: crmCo.id as string, finContactId: link.contactId as string };
}

describe('price lists and promotions on sales orders', () => {
  it('price each line from the lists and promotions, say where from, and keep a typed price', async () => {
    const owner = await signup('Pr Owner');
    const res = await owner.req('POST', '/api/company/companies', { kind: 'business', name: 'Pr Supplies', legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
    const { company, tools } = (await res.json()) as any;
    const co = company.id as string;
    const kit = await owner.json('POST', erp(co, '/products'), { name: 'Bracket kit', type: 'finished_product', priceCents: 3_900, sku: 'KIT-1' });
    const trade = await customer(owner, tools.crm, 'Trade Customer');
    const walkIn = await customer(owner, tools.crm, 'Walk In');

    // a general list with a break at 10, a list of the trade customer's own, a 10% promotion on the kit
    const general = await owner.json('POST', x(co, '/o/pr_pricelist'), { data: { name: 'Trade prices', currency: 'AUD', validFrom: day(-30) }, lines: [{ product: kit.id, minQty: 10, unitPrice: 3_400 }] });
    await owner.json('POST', x(co, `/o/pr_pricelist/${general.record.id}/step/activate`), {});
    const own = await owner.json('POST', x(co, '/o/pr_pricelist'), { data: { name: 'Trade Customer contract prices', customer: `crm:${trade.crmCompanyId}`, currency: 'AUD' }, lines: [{ product: kit.id, minQty: 1, unitPrice: 3_600 }] });
    await owner.json('POST', x(co, `/o/pr_pricelist/${own.record.id}/step/activate`), {});
    const promo = await owner.json('POST', x(co, '/o/pr_promotion'), { data: { name: 'Spring offer', discountType: 'percent', discountValue: 10, product: kit.id, validFrom: day(-1), validTo: day(30) } });
    await owner.json('POST', x(co, `/o/pr_promotion/${promo.record.id}/step/activate`), {});

    // a coded promotion and a customer group's list are applied by hand only
    const coded = await owner.json('POST', x(co, '/o/pr_promotion'), { data: { name: 'Half price code', code: 'HALF', discountType: 'percent', discountValue: 50, product: kit.id, validFrom: day(-1), validTo: day(30) } });
    await owner.json('POST', x(co, `/o/pr_promotion/${coded.record.id}/step/activate`), {});
    const group = await owner.json('POST', x(co, '/o/pr_pricelist'), { data: { name: 'Wholesale group', customerGroup: 'Wholesale', currency: 'AUD' }, lines: [{ product: kit.id, minQty: 1, unitPrice: 1_000 }] });
    await owner.json('POST', x(co, `/o/pr_pricelist/${group.record.id}/step/activate`), {});
    // the order form's suggestion: the customer's own list first, even when a general list is lower
    const s1 = await owner.json('GET', erp(co, `/sales-orders/price?productId=${kit.id}&customer=crm:${trade.crmCompanyId}&qty=20`));
    expect(s1).toMatchObject({ unitPriceCents: 3_600, discountBp: 1_000 });
    expect(s1.note).toContain('Trade Customer contract prices');
    expect(s1.note).toContain('Spring offer');
    // another customer: the general list at 10 or more, the standard price below
    expect((await owner.json('GET', erp(co, `/sales-orders/price?productId=${kit.id}&customer=crm:${walkIn.crmCompanyId}&qty=12`))).unitPriceCents).toBe(3_400);
    const small = await owner.json('GET', erp(co, `/sales-orders/price?productId=${kit.id}&customer=crm:${walkIn.crmCompanyId}&qty=2`));
    expect(small).toMatchObject({ unitPriceCents: 3_900, discountBp: 1_000 });
    expect(small.note).toContain('Standard price');

    // an order whose lines give no price takes the suggestion; a typed price is kept and called typed
    const so = await owner.json('POST', erp(co, '/sales-orders'), { crmCompanyId: walkIn.crmCompanyId, lines: [{ productId: kit.id, quantity: 12 }, { productId: kit.id, quantity: 1, unitPriceCents: 5_000, discountBp: 0 }] });
    const view = await owner.json('GET', erp(co, `/sales-orders/${so.id}`));
    expect(view.lines[0]).toMatchObject({ unitPriceCents: 3_400, discountBp: 1_000 });
    expect(view.lines[0].priceNote).toContain('Trade prices');
    expect(view.lines[0].priceNote).toContain('Spring offer');
    expect(view.lines[1]).toMatchObject({ unitPriceCents: 5_000, discountBp: 0, priceNote: 'Price typed on the order' });
    // 12 at 34.00 less 10% is 367.20, plus 50.00
    expect(view.order.subtotalCents).toBe(36_720 + 5_000);
    // the price check gives the same rule
    const check = await owner.json('GET', x(co, `/price?product=${kit.id}&customer=crm:${trade.crmCompanyId}&qty=20`));
    expect(check.priceList).toMatchObject({ price: 3_600, customer: true });
    expect(check.unitPrice).toBe(3_600 - 360);

    // a list made for the Finance half of the customer record applies when the CRM half is chosen, in both places
    const finOnly = await owner.json('POST', x(co, '/o/pr_pricelist'), { data: { name: 'Walk In account prices', customer: `fin:${walkIn.finContactId}`, currency: 'AUD' }, lines: [{ product: kit.id, minQty: 1, unitPrice: 3_700 }] });
    await owner.json('POST', x(co, `/o/pr_pricelist/${finOnly.record.id}/step/activate`), {});
    expect((await owner.json('GET', x(co, `/price?product=${kit.id}&customer=crm:${walkIn.crmCompanyId}&qty=2`))).priceList).toMatchObject({ price: 3_700, customer: true });
    expect((await owner.json('GET', erp(co, `/sales-orders/price?productId=${kit.id}&customer=crm:${walkIn.crmCompanyId}&qty=2`))).unitPriceCents).toBe(3_700);

    // an amendment that changes only the delivery address keeps every line's note, though the suggestion has changed
    await owner.json('POST', erp(co, `/sales-orders/${so.id}/confirm`), {});
    const before = await owner.json('GET', erp(co, `/sales-orders/${so.id}`));
    await owner.json('POST', erp(co, `/sales-orders/${so.id}/amend`), { reason: 'New delivery address', deliveryAddress: '1 New Street', lines: before.lines.map((l: any) => ({ id: l.id, productId: l.productId, quantity: l.quantity, unitPriceCents: l.unitPriceCents, discountBp: l.discountBp, taxCode: l.taxCode })) });
    const amended = await owner.json('GET', erp(co, `/sales-orders/${so.id}`));
    expect(amended.lines.map((l: any) => l.priceNote)).toEqual(before.lines.map((l: any) => l.priceNote));
    expect(amended.order.revision).toBe(before.order.revision + 1);

    // the Pricing module switched off: standard prices only, nothing noted from the lists
    await env.DB.prepare("INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES ('module_commercial_enabled', 'company', ?, 'off', 'test switch', 'test', ?)").bind(co, Date.now()).run();
    const off = await owner.json('GET', erp(co, `/sales-orders/price?productId=${kit.id}&customer=crm:${trade.crmCompanyId}&qty=20`));
    expect(off).toMatchObject({ unitPriceCents: 3_900, discountBp: 0, note: 'Standard price' });
    const so2 = await owner.json('POST', erp(co, '/sales-orders'), { crmCompanyId: trade.crmCompanyId, lines: [{ productId: kit.id, quantity: 20 }] });
    expect((await owner.json('GET', erp(co, `/sales-orders/${so2.id}`))).lines[0]).toMatchObject({ unitPriceCents: 3_900, discountBp: 0 });
  });
});
