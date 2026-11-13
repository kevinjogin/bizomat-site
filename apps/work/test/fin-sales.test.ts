// BIZOMAT Finance, Stage 1 of the accounting upgrade: quotes (versions, the online link, acceptance, progress
// invoicing), credit notes (posting, applying, refunds, voids), the document engine (one renderer for previews and
// PDFs), the CRM link (quotes from a deal, customers from the CRM) and who may do what.
import { afterEach, describe, expect, it } from 'vitest';
import { env } from 'cloudflare:test';
import { raw, signup, uniqueEmail, type Client } from './helpers';
import { accounts, byCode, createWs, fin, joinWs, rowMap, taxCodes } from './fin-helpers';
import { setEmailProviderForTests, type EmailProvider, type OutgoingEmail } from '../src/worker/services/email/provider';
import { processOutbox } from '../src/worker/services/email/outbox';
import { abnValid } from '../src/worker/company/verify';

async function business(name = 'Sales Owner', extra: Record<string, unknown> = {}) {
  const a = await signup(name);
  const ws = await createWs(a, 'business', { gstRegistered: true, gstBasis: 'accrual', basMethod: 'full', ...extra });
  const acc = await accounts(a, ws);
  const tax = await taxCodes(a, ws);
  const customer = await a.json('POST', fin(ws, '/contacts'), { name: 'Harbour Builders', kind: 'customer', email: 'accounts@harbour.example.com' });
  return { a, ws, acc, tax, bank: byCode(acc, '090'), sales: byCode(acc, '200'), customer: customer.id as string };
}

const isPdf = async (res: Response) => new TextDecoder().decode((await res.arrayBuffer()).slice(0, 5)) === '%PDF-';
const publicPath = (url: string) => url.replace(/^https?:\/\/[^/]+\/finance/, '');
const viewApi = (url: string) => `/api/fin-public${publicPath(url).replace(/^\/view/, '/view')}`;

class FakeProvider implements EmailProvider {
  name = 'fake';
  sent: OutgoingEmail[] = [];
  async send(m: OutgoingEmail) {
    this.sent.push(m);
    return { ok: true as const, messageId: `<m${this.sent.length}@test>` };
  }
}
afterEach(() => setEmailProviderForTests(null));

function quoteBody(b: { sales: string; tax: Record<string, string>; customer: string }, extra: Record<string, unknown> = {}) {
  return {
    contactId: b.customer,
    issueDate: '2026-11-02',
    expiryDate: '2099-12-31',
    reference: 'Site works',
    discountBp: 500,
    lines: [
      { lineKind: 'heading', description: 'Design', unitPrice: 0 },
      { itemCode: 'DS-1', description: 'Concept design', quantity: 10, unit: 'hr', unitPrice: 15_000, accountId: b.sales, taxCodeId: b.tax.GST },
      { itemCode: 'DS-2', description: 'Drawings', quantity: 1, unitPrice: 85_000, discountBp: 1000, accountId: b.sales, taxCodeId: b.tax.GST },
      { itemCode: 'OP-1', description: 'Extended support', quantity: 1, unitPrice: 120_000, accountId: b.sales, taxCodeId: b.tax.GST, optional: true },
    ],
    ...extra,
  };
}

describe('quotes', () => {
  it('prices headings, optional lines and a whole-quote discount exactly, and the preview is the PDF', async () => {
    const b = await business();
    const q = await b.a.json('POST', fin(b.ws, '/quotes'), quoteBody(b));
    expect(q.number).toBe('QU-0001');
    const dto = await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`));
    // 150000 + 76500 = 226500 counted; 5% off each line: 142500 + 72675 = 215175; GST 10% of each line.
    expect(dto).toMatchObject({ status: 'draft', version: 1, subtotal: 215_175, discountTotal: 11_325, taxTotal: 21_518, total: 236_693 });
    expect(dto.lines.map((l: any) => l.lineKind)).toEqual(['heading', 'item', 'item', 'item']);
    expect(dto.lines[3].optional).toBe(true);
    // The PDF of the saved quote and the preview of the same input are the same document.
    const pdf = await b.a.req('GET', fin(b.ws, `/quotes/${q.id}/pdf?inline=1`));
    expect(pdf.headers.get('Content-Type')).toBe('application/pdf');
    expect(pdf.headers.get('Content-Disposition')).toMatch(/^inline/);
    expect(pdf.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(await isPdf(pdf)).toBe(true);
    const preview = await b.a.req('POST', fin(b.ws, '/quotes/preview'), { ...quoteBody(b), quoteId: q.id });
    expect(preview.status).toBe(200);
    expect(await isPdf(preview)).toBe(true);
    // A quote posts nothing.
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_journals WHERE org_id = ? AND source_id = ?').bind(b.ws, q.id).first<any>()).n).toBe(0);
  });

  it('TEST 1: quote, send by link, customer views and accepts online, progress invoices add up exactly, voiding gives the share back', async () => {
    const b = await business('Journey One');
    const q = await b.a.json('POST', fin(b.ws, '/quotes'), quoteBody(b));
    const link = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/link`), {});
    expect(link.url).toMatch(/\/finance\/view\/quote\//);
    let dto = await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`));
    expect(dto).toMatchObject({ status: 'sent', online: true });
    expect(dto.versions).toHaveLength(1);

    // The customer (signed out) opens the link: viewed, never anything else.
    const view = await raw('GET', viewApi(link.url));
    expect(view.status).toBe(200);
    expect(view.headers.get('X-Robots-Tag')).toContain('noindex');
    const v = (await view.json()) as any;
    expect(v).toMatchObject({ kind: 'quote', number: 'QU-0001', customer: 'Harbour Builders', total: 236_693, canRespond: true });
    const vpdf = await raw('GET', `/${v.pdf}`);
    expect(vpdf.headers.get('Content-Disposition')).toMatch(/^inline/);
    expect(await isPdf(vpdf)).toBe(true);
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe('viewed');

    // A wrong signature is refused, as is accepting without confirming.
    const bad = viewApi(link.url).replace(/k=[^&]+/, 'k=AAAA');
    expect((await raw('GET', bad)).status).toBe(404);
    const acceptUrl = viewApi(link.url).replace(/(\/view\/quote\/[^?]+)/, '$1/accept');
    expect((await raw('POST', acceptUrl, { body: { name: 'Pat Customer' } })).status).toBe(400);
    expect((await raw('POST', acceptUrl, { body: { name: 'Pat Customer', agree: true } })).status).toBe(200);
    dto = await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`));
    expect(dto).toMatchObject({ status: 'accepted', acceptedName: 'Pat Customer', acceptedOnline: true });
    expect(dto.events.map((e: any) => e.action)).toEqual(expect.arrayContaining(['created', 'link_created', 'viewed', 'accepted']));
    // An accepted quote is not changed.
    expect((await b.a.req('PATCH', fin(b.ws, `/quotes/${q.id}`), { reference: 'Changed' })).status).toBe(409);

    // 40% now, the rest later: the two invoices add up to the quote exactly.
    const first = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/invoice`), { percent: 40 });
    const inv1 = await b.a.json('GET', fin(b.ws, `/docs/${first.id}`));
    // A part carries the whole-quote discount inside its lines.
    expect(inv1).toMatchObject({ kind: 'invoice', status: 'draft', quoteId: q.id, quoteNumber: 'QU-0001', quoteBp: 4000, discountBp: 0 });
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).invoicedBp).toBe(4000);
    expect((await b.a.req('POST', fin(b.ws, `/quotes/${q.id}/invoice`), { percent: 61 })).status).toBe(400);
    const second = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/invoice`), {});
    const inv2 = await b.a.json('GET', fin(b.ws, `/docs/${second.id}`));
    expect(inv1.total + inv2.total).toBe(236_693);
    expect(inv1.subtotal + inv2.subtotal).toBe(215_175);
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe('converted');
    // The optional line was not chosen, so it is on neither invoice.
    expect([...inv1.lines, ...inv2.lines].some((l: any) => /Extended support/.test(l.description))).toBe(false);

    // Voiding the second invoice gives its share back to the quote.
    await b.a.json('POST', fin(b.ws, `/docs/${second.id}/void`), {});
    const back = await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`));
    expect(back).toMatchObject({ status: 'accepted', invoicedBp: 4000 });
    // Invoicing the rest again, with the optional line this time.
    const opt = back.lines.find((l: any) => l.optional);
    const third = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/invoice`), { optionalLineIds: [opt.id] });
    const inv3 = await b.a.json('GET', fin(b.ws, `/docs/${third.id}`));
    expect(inv3.lines.some((l: any) => /Extended support/.test(l.description))).toBe(true);
  });

  it('splits awkward amounts into progress invoices whose amounts add up to the quote exactly', async () => {
    const b = await business('Odd Cents');
    const q = await b.a.json('POST', fin(b.ws, '/quotes'), {
      contactId: b.customer,
      issueDate: '2026-11-02',
      discountBp: 333,
      taxMode: 'inclusive',
      lines: [
        { description: 'A', quantity: 3, unitPrice: 33_333, discountBp: 125, accountId: b.sales, taxCodeId: b.tax.GST },
        { description: 'B', quantity: 0.333, unitPrice: 10_001, accountId: b.sales, taxCodeId: b.tax.FRE },
        { description: 'C', quantity: 7, unitPrice: 1_999, accountId: b.sales, taxCodeId: b.tax.GST },
      ],
    });
    await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/accept`), { name: 'Odd Buyer' });
    const quote = await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`));
    const parts = [];
    for (const percent of [33.33, 33.33]) parts.push(await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/invoice`), { percent }));
    parts.push(await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/invoice`), {}));
    const docs = await Promise.all(parts.map((p) => b.a.json('GET', fin(b.ws, `/docs/${p.id}`))));
    // Amounts include GST here, so the totals add up exactly; each invoice's GST is its own.
    expect(docs.reduce((n, d) => n + d.total, 0)).toBe(quote.total);
    expect(Math.abs(docs.reduce((n, d) => n + d.taxTotal, 0) - quote.taxTotal)).toBeLessThanOrEqual(docs.length);
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe('converted');
  });

  it('keeps each version as sent: changing a sent quote starts version 2 and withdraws the old link', async () => {
    const b = await business('Versions');
    const q = await b.a.json('POST', fin(b.ws, '/quotes'), quoteBody(b));
    const link = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/link`), {});
    await b.a.json('PATCH', fin(b.ws, `/quotes/${q.id}`), { discountBp: 0 });
    const dto = await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`));
    expect(dto).toMatchObject({ status: 'draft', version: 2, online: false, discountBp: 0 });
    expect(dto.events.map((e: any) => e.action)).toContain('revised');
    expect((await raw('GET', viewApi(link.url))).status).toBe(404);
    // Version 1 is still there exactly as sent.
    const v1 = await b.a.req('GET', fin(b.ws, `/quotes/${q.id}/versions/1/pdf`));
    expect(v1.status).toBe(200);
    expect(await isPdf(v1)).toBe(true);
    const snap = await env.DB.prepare('SELECT snapshot_json FROM fin_quote_versions WHERE quote_id = ? AND version = 1').bind(q.id).first<any>();
    expect(JSON.parse(snap.snapshot_json)).toMatchObject({ discountBp: 500, total: 236_693 });
    expect((await b.a.req('GET', fin(b.ws, `/quotes/${q.id}/versions/2/pdf`))).status).toBe(404);
    await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/sent`), {});
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).versions.map((x: any) => x.version)).toEqual([2, 1]);
  });

  it('expires, declines, cancels, duplicates and deletes as the lifecycle allows', async () => {
    const b = await business('Lifecycle');
    const q = await b.a.json('POST', fin(b.ws, '/quotes'), quoteBody(b, { issueDate: '2026-01-02', expiryDate: '2026-02-01' }));
    // A draft past its expiry is not sent until the date is changed.
    expect((await b.a.req('POST', fin(b.ws, `/quotes/${q.id}/sent`), {})).status).toBe(400);
    await b.a.json('PATCH', fin(b.ws, `/quotes/${q.id}`), { expiryDate: '2099-01-01' });
    const link = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/link`), {});
    // Expiry passes: the quote is expired and the customer can no longer accept it.
    await env.DB.prepare("UPDATE fin_quotes SET expiry_date = '2026-02-01' WHERE id = ?").bind(q.id).run();
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe('expired');
    const v = (await (await raw('GET', viewApi(link.url))).json()) as any;
    expect(v).toMatchObject({ status: 'expired', canRespond: false });
    expect((await raw('POST', viewApi(link.url).replace(/(\/view\/quote\/[^?]+)/, '$1/accept'), { body: { name: 'Late Customer', agree: true } })).status).toBe(409);
    // A member can still record a decline; then cancel; then duplicate into a fresh draft.
    await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/decline`), { reason: 'Went with another supplier' });
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe('declined');
    await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/cancel`), {});
    expect((await b.a.req('DELETE', fin(b.ws, `/quotes/${q.id}`))).status).toBe(409);
    const dup = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/duplicate`), {});
    const d = await b.a.json('GET', fin(b.ws, `/quotes/${dup.id}`));
    expect(d).toMatchObject({ status: 'draft', version: 1, number: 'QU-0002', total: 236_693 });
    expect((await b.a.req('DELETE', fin(b.ws, `/quotes/${dup.id}`))).status).toBe(200);
    // Only an accepted quote is invoiced.
    expect((await b.a.req('POST', fin(b.ws, `/quotes/${q.id}/invoice`), {})).status).toBe(409);
  });

  it('lets roles do only what Finance allows, and keeps other workspaces out', async () => {
    const b = await business('Roles');
    const viewer = await signup('Quote Viewer');
    const contributor = await signup('Quote Contributor');
    await joinWs(b.a, b.ws, viewer, 'viewer');
    await joinWs(b.a, b.ws, contributor, 'contributor');
    const q = await b.a.json('POST', fin(b.ws, '/quotes'), quoteBody(b));
    expect((await viewer.req('POST', fin(b.ws, '/quotes'), quoteBody(b))).status).toBe(403);
    expect((await viewer.req('POST', fin(b.ws, `/quotes/${q.id}/link`), {})).status).toBe(403);
    expect((await viewer.req('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe(200);
    // A contributor sees and changes only its own quotes.
    const own = await contributor.json('POST', fin(b.ws, '/quotes'), quoteBody(b));
    const list = await contributor.json('GET', fin(b.ws, '/quotes'));
    expect(list.rows.map((r: any) => r.id)).toEqual([own.id]);
    expect((await contributor.req('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe(404);
    // Someone from another business sees nothing.
    const other = await business('Outsider');
    expect((await other.a.req('GET', fin(b.ws, `/quotes/${q.id}`))).status).toBe(404);
    expect((await other.a.req('POST', fin(other.ws, '/quotes'), quoteBody({ ...other, customer: b.customer }))).status).toBe(400);
  });

  it('emails the online link (never the file) when email is set up, and says so plainly when it is not', async () => {
    const b = await business('Mailer');
    const q = await b.a.json('POST', fin(b.ws, '/quotes'), quoteBody(b));
    const off = await b.a.req('POST', fin(b.ws, `/quotes/${q.id}/email`), {});
    expect(off.status).toBe(503);
    expect(((await off.json()) as any).error).toMatch(/Copy the link/);
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const r = await b.a.json('POST', fin(b.ws, `/quotes/${q.id}/email`), { message: 'Here is the quote we discussed.' });
    expect(r.to).toBe('accounts@harbour.example.com');
    await processOutbox(env);
    const msg = fake.sent.find((m) => m.to.email === 'accounts@harbour.example.com')!;
    expect(msg.subject).toMatch(/^Quote QU-0001 from /);
    expect(msg.html).toMatch(/\/finance\/view\/quote\//);
    expect(msg.text).toContain('Here is the quote we discussed.');
    expect((await b.a.json('GET', fin(b.ws, `/quotes/${q.id}`))).events.map((e: any) => e.action)).toContain('emailed');
    // An invoice is emailed only once approved, and emailing it never changes what is owed.
    const inv = await b.a.json('POST', fin(b.ws, '/docs'), { kind: 'invoice', contactId: b.customer, issueDate: '2026-11-02', lines: [{ description: 'Work', unitPrice: 10_000, accountId: b.sales, taxCodeId: b.tax.GST }] });
    expect((await b.a.req('POST', fin(b.ws, `/docs/${inv.id}/email`), {})).status).toBe(400);
    await b.a.json('POST', fin(b.ws, `/docs/${inv.id}/approve`), {});
    await b.a.json('POST', fin(b.ws, `/docs/${inv.id}/email`), {});
    const after = await b.a.json('GET', fin(b.ws, `/docs/${inv.id}`));
    expect(after).toMatchObject({ status: 'approved', amountPaid: 0, amountDue: 11_000 });
    // Opening the invoice's link records a view and nothing else.
    const link = await b.a.json('POST', fin(b.ws, `/docs/${inv.id}/link`), {});
    const pv = (await (await raw('GET', viewApi(link.url))).json()) as any;
    expect(pv).toMatchObject({ kind: 'invoice', status: 'due', amountDue: 11_000 });
    expect((await b.a.json('GET', fin(b.ws, `/docs/${inv.id}`))).status).toBe('approved');
    await b.a.req('DELETE', fin(b.ws, `/docs/${inv.id}/link`));
    expect((await raw('GET', viewApi(link.url))).status).toBe(404);
  });
});

describe('credit notes', () => {
  async function approvedInvoice(b: Awaited<ReturnType<typeof business>>, amount = 100_000) {
    const inv = await b.a.json('POST', fin(b.ws, '/docs'), { kind: 'invoice', contactId: b.customer, issueDate: '2026-11-02', lines: [{ description: 'Fit-out', quantity: 2, unitPrice: amount / 2, accountId: b.sales, taxCodeId: b.tax.GST }], action: 'approve' });
    return inv.id as string;
  }

  it('TEST 5: a credit note for an invoice reverses the sale and GST, is applied to the invoice, and reports follow', async () => {
    const b = await business('Credits');
    const invId = await approvedInvoice(b);
    const draft = await b.a.json('GET', fin(b.ws, `/credit-notes/from-invoice/${invId}`));
    expect(draft).toMatchObject({ contactId: b.customer, invoiceId: invId });
    // Credit half: one of the two units.
    draft.lines[0].quantity = 1;
    const cn = await b.a.json('POST', fin(b.ws, '/credit-notes'), { ...draft, issueDate: '2026-11-10', reason: 'One unit returned', action: 'approve' });
    expect(cn.number).toBe('CN-0001');
    const dto = await b.a.json('GET', fin(b.ws, `/credit-notes/${cn.id}`));
    expect(dto).toMatchObject({ status: 'applied', total: 55_000, taxTotal: 5_000, allocated: 55_000, remaining: 0, invoiceNumber: 'INV-0001' });
    const inv = await b.a.json('GET', fin(b.ws, `/docs/${invId}`));
    expect(inv).toMatchObject({ status: 'part_paid', amountPaid: 55_000, amountDue: 55_000 });
    expect(inv.credits[0]).toMatchObject({ creditNumber: 'CN-0001', amount: 55_000 });
    // The journal: sales and GST debited, the receivable credited, balanced.
    const j = await env.DB.prepare("SELECT id FROM fin_journals WHERE org_id = ? AND source_type = 'invoice' AND source_id = ?").bind(b.ws, cn.id).first<any>();
    const lines = (await env.DB.prepare('SELECT account_id, debit, credit, tax_amount FROM fin_journal_lines WHERE journal_id = ?').bind(j.id).all<any>()).results;
    expect(lines.find((l) => l.account_id === b.sales)).toMatchObject({ debit: 50_000, credit: 0, tax_amount: 5_000 });
    expect(lines.reduce((n, l) => n + l.debit - l.credit, 0)).toBe(0);
    // GST: 1A and G1 fall by the credit.
    const g = await b.a.json('GET', `${fin(b.ws, '/reports/gst')}?from=2026-10-01&to=2026-12-31`);
    expect(g.summary).toMatchObject({ G1: 55_000, '1A': 5_000 });
    // Aged receivables: what is still owed.
    const aged = await b.a.json('GET', `${fin(b.ws, '/reports/aged_receivables')}?date=2026-11-30`);
    expect(rowMap(aged).get('Harbour Builders')!.at(-1)).toBe(55_000);
    // Applied credit holds the credit note: remove it before voiding, then the invoice owes it again.
    expect((await b.a.req('POST', fin(b.ws, `/credit-notes/${cn.id}/void`), {})).status).toBe(409);
    expect((await b.a.req('POST', fin(b.ws, `/docs/${invId}/void`), {})).status).toBe(409);
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/allocations/${dto.allocations[0].id}/remove`), {});
    expect((await b.a.json('GET', fin(b.ws, `/docs/${invId}`))).amountDue).toBe(110_000);
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/void`), {});
    const tb = await b.a.json('GET', `${fin(b.ws, '/reports/trial_balance')}?date=2026-11-30`);
    expect(tb.summary.balanced).toBe(true);
    expect((await b.a.json('GET', `${fin(b.ws, '/reports/gst')}?from=2026-10-01&to=2026-12-31`)).summary).toMatchObject({ G1: 110_000, '1A': 10_000 });
  });

  it('keeps unused credit for the customer, applies it to another invoice or refunds it, and never over-credits', async () => {
    const b = await business('Refunds', { gstBasis: 'cash' });
    const invId = await approvedInvoice(b);
    await b.a.json('POST', fin(b.ws, `/docs/${invId}/payments`), { accountId: b.bank, date: '2026-11-03', amount: 110_000 });
    // A stand-alone credit (no invoice): stays as credit.
    const cn = await b.a.json('POST', fin(b.ws, '/credit-notes'), { contactId: b.customer, issueDate: '2026-11-05', reason: 'Goodwill', lines: [{ description: 'Credit', unitPrice: 20_000, accountId: b.sales, taxCodeId: b.tax.GST }], action: 'approve' });
    let dto = await b.a.json('GET', fin(b.ws, `/credit-notes/${cn.id}`));
    expect(dto).toMatchObject({ status: 'approved', total: 22_000, remaining: 22_000 });
    const aged = await b.a.json('GET', `${fin(b.ws, '/reports/aged_receivables')}?date=2026-11-30`);
    expect(rowMap(aged).get('Harbour Builders')!.at(-1)).toBe(-22_000);
    // Part goes to a new invoice, the rest is paid back.
    const inv2 = await approvedInvoice(b, 10_000);
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/allocations`), { invoiceId: inv2, amount: 11_000, date: '2026-11-06' });
    expect((await b.a.json('GET', fin(b.ws, `/docs/${inv2}`))).status).toBe('paid');
    expect((await b.a.req('POST', fin(b.ws, `/credit-notes/${cn.id}/refunds`), { accountId: b.bank, date: '2026-11-07', amount: 12_000 })).status).toBe(400);
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/refunds`), { accountId: b.bank, date: '2026-11-07', amount: 11_000 });
    dto = await b.a.json('GET', fin(b.ws, `/credit-notes/${cn.id}`));
    expect(dto).toMatchObject({ status: 'applied', remaining: 0, refunded: 11_000 });
    // Cash basis: the first invoice counts when paid; the refund lowers sales when paid out; the credit applied to
    // the unpaid second invoice is never received, so it never counts.
    const g = await b.a.json('GET', `${fin(b.ws, '/reports/gst')}?from=2026-10-01&to=2026-12-31&basis=cash`);
    expect(g.summary).toMatchObject({ G1: 110_000 - 11_000, '1A': 10_000 - 1_000 });
    // Never more credit for an invoice than the invoice.
    const big = await b.a.req('POST', fin(b.ws, '/credit-notes'), { contactId: b.customer, invoiceId: invId, issueDate: '2026-11-08', lines: [{ description: 'Too much', unitPrice: 200_000, accountId: b.sales, taxCodeId: b.tax.GST }] });
    expect(big.status).toBe(400);
    // Void the refund, then the credit can be voided once its applied part is removed.
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/refunds/${dto.refunds[0].id}/void`), {});
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/allocations/${dto.allocations[0].id}/remove`), {});
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/void`), {});
    expect((await b.a.json('GET', fin(b.ws, `/credit-notes/${cn.id}`))).status).toBe('void');
    expect((await b.a.json('GET', `${fin(b.ws, '/reports/trial_balance')}?date=2026-11-30`)).summary.balanced).toBe(true);
  });

  it('follows the workspace’s invoice approvals: with them on, only approvers approve, apply or refund credit', async () => {
    const b = await business('Credit Roles');
    const contributor = await signup('Credit Contributor');
    await joinWs(b.a, b.ws, contributor, 'contributor');
    await b.a.json('PATCH', fin(b.ws), { settings: { approvals: { invoices: true } } });
    const invId = await approvedInvoice(b);
    const draft = await b.a.json('GET', fin(b.ws, `/credit-notes/from-invoice/${invId}`));
    expect((await contributor.req('POST', fin(b.ws, '/credit-notes'), { ...draft, action: 'approve' })).status).toBe(403);
    const cn = await contributor.json('POST', fin(b.ws, '/credit-notes'), draft);
    expect((await contributor.req('POST', fin(b.ws, `/credit-notes/${cn.id}/approve`), {})).status).toBe(403);
    await b.a.json('POST', fin(b.ws, `/credit-notes/${cn.id}/approve`), {});
    expect((await contributor.req('POST', fin(b.ws, `/credit-notes/${cn.id}/refunds`), { accountId: b.bank, date: '2026-11-07', amount: 100 })).status).toBe(403);
  });
});

describe('the document engine and templates', () => {
  it('stores template layout, typeface, titles and terms, and draws a clearly marked sample', async () => {
    const b = await business('Templates');
    const list = await b.a.json('GET', fin(b.ws, '/templates'));
    expect(list[0]).toMatchObject({ layout: 'portrait', font: 'helvetica', quoteTitle: 'Quote', creditNoteTitle: 'Credit note', showSignature: true, showRemittance: true });
    await b.a.json('PATCH', fin(b.ws, `/templates/${list[0].id}`), { layout: 'landscape', font: 'times', quoteTitle: 'Proposal', quoteTerms: 'Valid for 30 days.', showRemittance: false });
    expect((await b.a.json('GET', fin(b.ws, '/templates')))[0]).toMatchObject({ layout: 'landscape', font: 'times', quoteTitle: 'Proposal', quoteTerms: 'Valid for 30 days.', showRemittance: false });
    const sample = await b.a.req('POST', fin(b.ws, '/templates/preview'), { kind: 'quote', layout: 'landscape' });
    expect(sample.status).toBe(200);
    expect(await isPdf(sample)).toBe(true);
    // Numbering covers quotes and credit notes.
    const numbering = await b.a.json('GET', fin(b.ws, '/numbering'));
    expect(numbering.map((n: any) => n.kind)).toEqual(['quote', 'invoice', 'credit_note', 'bill', 'purchase_order', 'expense_claim']);
    await b.a.json('PATCH', fin(b.ws), { settings: { prefixes: { quote: 'Q-' } } });
    await b.a.json('PUT', fin(b.ws, '/numbering/quote'), { next: 41 });
    expect((await b.a.json('POST', fin(b.ws, '/quotes'), quoteBody(b))).number).toBe('Q-0041');
  });

  it('previews an invoice without saving it, as the PDF it will have', async () => {
    const b = await business('Preview');
    const body = { kind: 'invoice', contactId: b.customer, issueDate: '2026-11-02', discountBp: 1000, deliveryAddress: '1 Example Street', lines: [{ lineKind: 'heading', description: 'Stage 1', unitPrice: 0 }, { itemCode: 'A1', unit: 'ea', description: 'Work', unitPrice: 10_000, accountId: b.sales, taxCodeId: b.tax.GST }] };
    const before = (await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_docs WHERE org_id = ?').bind(b.ws).first<any>()).n;
    const res = await b.a.req('POST', fin(b.ws, '/docs/preview'), body);
    expect(res.status).toBe(200);
    expect(await isPdf(res)).toBe(true);
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM fin_docs WHERE org_id = ?').bind(b.ws).first<any>()).n).toBe(before);
    const saved = await b.a.json('POST', fin(b.ws, '/docs'), body);
    const dto = await b.a.json('GET', fin(b.ws, `/docs/${saved.id}`));
    expect(dto).toMatchObject({ discountBp: 1000, deliveryAddress: '1 Example Street', subtotal: 9_000, taxTotal: 900, total: 9_900 });
    expect(dto.lines[0]).toMatchObject({ lineKind: 'heading', net: 0 });
    expect(dto.lines[1]).toMatchObject({ itemCode: 'A1', unit: 'ea' });
    // The page's security headers let the app show its own PDFs, and nothing else.
    const page = await b.a.req('GET', fin(b.ws, '/docs?kind=invoice'));
    expect(page.headers.get('Content-Security-Policy') ?? '').toMatch(/frame-src 'self' blob:/);
    expect(page.headers.get('X-Frame-Options')).toBe('DENY');
  });
});

// ------------------------------------------------------------------ the CRM link

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

async function company(c: Client) {
  const res = await c.req('POST', '/api/company/companies', { kind: 'business', name: 'Ridge Electrical', abn: newAbn(), email: uniqueEmail('office'), phone: '(07) 3123 4567', addressLine1: '5 Example Road', suburb: 'Brisbane', state: 'QLD', postcode: '4000' });
  const data = (await res.json()) as any;
  if (res.status !== 201) throw new Error(JSON.stringify(data));
  return data as { company: { id: string }; tools: { tasks: string; crm: string; finance: string } };
}

describe('quotes and customers with the CRM', () => {
  it('TEST 2: a quote from a CRM deal, its progress on the deal and its timeline, and one customer record', async () => {
    const owner = await signup('Crm Quote Owner');
    const { tools } = await company(owner);
    const crmCo = await owner.json('POST', `/api/crm/orgs/${tools.crm}/companies`, { name: 'Coast Fabrication', email: 'ap@coast.example.com' });
    const deal = await owner.json('POST', `/api/crm/orgs/${tools.crm}/deals`, { title: 'Switchboard upgrade', value: 1_250_000, companyId: crmCo.id });
    const before = await owner.json('GET', `/api/company/links/crm/${tools.crm}/deals/${deal.id}`);
    expect(before.finance).toMatchObject({ canQuote: true, quotes: [] });
    const made = await owner.json('POST', `/api/company/links/crm/${tools.crm}/deals/${deal.id}/quote`, {});
    const q = await owner.json('GET', `/api/fin/orgs/${tools.finance}/quotes/${made.quoteId}`);
    expect(q).toMatchObject({ status: 'draft', crmDealId: deal.id, contactName: 'Coast Fabrication', subtotal: 1_250_000 });
    // The customer picker in Finance offers the CRM company, already linked: no second record.
    const picks = await owner.json('GET', `/api/company/links/finance/${tools.finance}/crm-customers?q=coast`);
    expect(picks.rows).toEqual([expect.objectContaining({ id: crmCo.id, contactId: q.contactId })]);
    expect((await owner.json('POST', `/api/company/links/finance/${tools.finance}/crm-customers/${crmCo.id}`, {})).contactId).toBe(q.contactId);
    const other = await owner.json('POST', `/api/crm/orgs/${tools.crm}/companies`, { name: 'Delta Joinery' });
    const linked = await owner.json('POST', `/api/company/links/finance/${tools.finance}/crm-customers/${other.id}`, {});
    expect((await env.DB.prepare('SELECT name FROM fin_contacts WHERE id = ?').bind(linked.contactId).first<any>()).name).toBe('Delta Joinery');
    // Sent and accepted: the deal shows it, and its timeline says so (without amounts).
    await owner.json('POST', `/api/fin/orgs/${tools.finance}/quotes/${made.quoteId}/sent`, {});
    await owner.json('POST', `/api/fin/orgs/${tools.finance}/quotes/${made.quoteId}/accept`, { name: 'Sam Buyer' });
    const after = await owner.json('GET', `/api/company/links/crm/${tools.crm}/deals/${deal.id}`);
    expect(after.finance.quotes[0]).toMatchObject({ number: q.number, status: 'accepted' });
    const events = (await env.DB.prepare("SELECT summary FROM crm_events WHERE deal_id = ? AND type = 'finance_quote' ORDER BY created_at").bind(deal.id).all<any>()).results.map((e) => e.summary);
    expect(events).toEqual([`Quote ${q.number} started in Finance`, `Quote ${q.number} sent`, `Quote ${q.number} accepted`]);
    expect(events.join(' ')).not.toMatch(/\$|12,500/);
  });
});

void uniqueEmail;
