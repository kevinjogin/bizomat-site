// BIZOMAT Finance: double-entry integrity, GST, editing and voiding posted entries, the period lock, invoices, bills,
// purchase orders, expense claims, payments and the reports computed from the ledger.
import { describe, expect, it } from 'vitest';
import { env } from 'cloudflare:test';
import { signup } from './helpers';
import { accounts, byCode, createWs, fin, joinWs, rowMap, taxCodes } from './fin-helpers';

async function business(name = 'Ledger Owner') {
  const a = await signup(name);
  const ws = await createWs(a, 'business', { gstRegistered: true, gstBasis: 'accrual', basMethod: 'full' });
  const acc = await accounts(a, ws);
  const tax = await taxCodes(a, ws);
  return { a, ws, acc, tax, bank: byCode(acc, '090'), sales: byCode(acc, '200'), office: byCode(acc, '453'), gst: byCode(acc, '820') };
}

describe('the ledger', () => {
  it('splits GST exactly, keeps every journal balanced, and the trial balance and balance sheet balance across a financial year', async () => {
    const { a, ws, acc, tax, bank, sales, office } = await business();
    await a.json('POST', fin(ws, `/accounts/${bank}/opening-balance`), { amount: 1_000_000, date: '2026-06-30' });
    const prior = await a.json('POST', fin(ws, '/transactions'), { kind: 'receive', accountId: bank, date: '2026-06-15', taxMode: 'inclusive', lines: [{ accountId: sales, amount: 110_000, taxCodeId: tax.GST }] });
    const inc = await a.json('POST', fin(ws, '/transactions'), { kind: 'receive', accountId: bank, date: '2026-08-01', taxMode: 'inclusive', lines: [{ accountId: sales, amount: 220_000, taxCodeId: tax.GST }] });
    const spend = await a.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-08-02', taxMode: 'inclusive', lines: [{ accountId: office, amount: 55_000, taxCodeId: tax.GSTP }] });
    const ex = await a.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-08-03', taxMode: 'exclusive', lines: [{ accountId: office, amount: 10_000, taxCodeId: tax.GSTP }] });
    for (const t of [prior, inc, spend, ex]) expect(t.status).toBe('posted');
    const detail = await a.json('GET', fin(ws, `/transactions/${spend.id}`));
    expect(detail.lines[0]).toMatchObject({ net: 50_000, tax: 5_000, amount: 55_000 });
    expect((await a.json('GET', fin(ws, `/transactions/${ex.id}`))).total).toBe(11_000);
    const journals = await a.json('GET', `${fin(ws, '/journals')}?source=${inc.id}`);
    expect(journals).toHaveLength(1);
    const dr = journals[0].lines.reduce((n: number, l: any) => n + l.debit, 0);
    const cr = journals[0].lines.reduce((n: number, l: any) => n + l.credit, 0);
    expect(dr).toBe(cr);
    expect(journals[0].lines.find((l: any) => l.accountId === sales)).toMatchObject({ credit: 200_000, taxAmount: -20_000 });

    const tb = await a.json('GET', `${fin(ws, '/reports/trial_balance')}?date=2026-08-31`);
    expect(tb.summary.balanced).toBe(true);
    const bs = await a.json('GET', `${fin(ws, '/reports/balance_sheet')}?date=2026-08-31`);
    expect(bs.summary.balanced).toBe(true);
    const rows = rowMap(bs);
    expect(rows.get('Retained earnings')).toEqual([100_000]);
    expect(rows.get('Current year earnings')).toEqual([200_000 - 50_000 - 10_000]);
    const pl = await a.json('GET', `${fin(ws, '/reports/profit_loss')}?from=2026-08-01&to=2026-08-31`);
    expect(pl.summary).toMatchObject({ income: 200_000, expenses: 60_000, net: 140_000 });
    const cf = await a.json('GET', `${fin(ws, '/reports/cash_flow')}?from=2026-08-01&to=2026-08-31`);
    expect(cf.summary).toMatchObject({ opening: 1_110_000, closing: 1_110_000 + 220_000 - 55_000 - 11_000, reconciles: true });
    const g = await a.json('GET', `${fin(ws, '/reports/gst')}?from=2026-07-01&to=2026-09-30`);
    expect(g.summary).toMatchObject({ G1: 220_000, G11: 66_000, '1A': 20_000, '1B': 6_000, net: 14_000 });
    expect(g.notes.join(' ')).toMatch(/does not lodge/);
    // Exports
    const csv = await a.req('GET', `${fin(ws, '/reports/profit_loss')}?from=2026-08-01&to=2026-08-31&format=csv`);
    expect(csv.headers.get('Content-Type')).toContain('text/csv');
    expect(await csv.text()).toContain('2000.00');
    const pdf = await a.req('GET', `${fin(ws, '/reports/balance_sheet')}?date=2026-08-31&format=pdf`);
    expect(pdf.headers.get('Content-Type')).toBe('application/pdf');
    expect(new TextDecoder().decode((await pdf.arrayBuffer()).slice(0, 5))).toBe('%PDF-');
    void acc;
  });

  it('refuses at the database level to change or delete a posted journal, or to post an unbalanced one', async () => {
    const { a, ws, bank, office } = await business('Trigger Owner');
    const t = await a.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-10-01', taxMode: 'none', lines: [{ accountId: office, amount: 1000 }] });
    const tx = await a.json('GET', fin(ws, `/transactions/${t.id}`));
    await expect(env.DB.prepare('UPDATE fin_journal_lines SET debit = debit + 1 WHERE journal_id = ?').bind(tx.journalId).run()).rejects.toThrow(/FIN_POSTED/);
    await expect(env.DB.prepare('DELETE FROM fin_journal_lines WHERE journal_id = ?').bind(tx.journalId).run()).rejects.toThrow(/FIN_POSTED/);
    await expect(env.DB.prepare('DELETE FROM fin_journals WHERE id = ?').bind(tx.journalId).run()).rejects.toThrow(/FIN_POSTED/);
    await expect(env.DB.prepare("UPDATE fin_journals SET date = '2026-01-01' WHERE id = ?").bind(tx.journalId).run()).rejects.toThrow(/FIN_POSTED/);
    // A draft journal with lines that do not balance cannot be posted.
    const j = `test-j-${Date.now()}`;
    await env.DB.prepare("INSERT INTO fin_journals (id, org_id, number, date, source_type, status, created_at) VALUES (?, ?, 9999, '2026-10-02', 'manual', 'draft', 0)").bind(j, ws).run();
    await env.DB.prepare('INSERT INTO fin_journal_lines (id, org_id, journal_id, line_no, account_id, debit) VALUES (?, ?, ?, 1, ?, 500)').bind(`${j}-1`, ws, j, office).run();
    await env.DB.prepare('INSERT INTO fin_journal_lines (id, org_id, journal_id, line_no, account_id, credit) VALUES (?, ?, ?, 2, ?, 400)').bind(`${j}-2`, ws, j, bank).run();
    await expect(env.DB.prepare("UPDATE fin_journals SET status = 'posted' WHERE id = ?").bind(j).run()).rejects.toThrow(/FIN_UNBALANCED/);
    // A line is a debit or a credit, never both.
    await expect(env.DB.prepare('INSERT INTO fin_journal_lines (id, org_id, journal_id, line_no, account_id, debit, credit) VALUES (?, ?, ?, 3, ?, 5, 5)').bind(`${j}-3`, ws, j, bank).run()).rejects.toThrow();
    // A manual journal through the API must balance.
    expect((await a.req('POST', fin(ws, '/journals'), { date: '2026-10-03', memo: 'Bad', lines: [{ accountId: office, debit: 100 }, { accountId: bank, credit: 99 }] })).status).toBe(400);
    const good = await a.json('POST', fin(ws, '/journals'), { date: '2026-10-03', memo: 'Depreciation', lines: [{ accountId: office, debit: 100 }, { accountId: bank, credit: 100 }] });
    const rev = await a.json('POST', fin(ws, `/journals/${good.id}/reverse`), {});
    expect(rev.date).toBe('2026-10-03');
    expect((await a.req('POST', fin(ws, `/journals/${good.id}/reverse`), {})).status).toBe(409);
  });

  it('changes a posted transaction by reversing and reposting, voids it, and respects the period lock', async () => {
    const { a, ws, bank, office } = await business('Lock Owner');
    const t = await a.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-08-10', taxMode: 'none', lines: [{ accountId: office, amount: 2000 }] });
    const before = await a.json('GET', fin(ws, `/transactions/${t.id}`));
    await a.json('PATCH', fin(ws, `/transactions/${t.id}`), { lines: [{ accountId: office, amount: 2500 }] });
    const after = await a.json('GET', fin(ws, `/transactions/${t.id}`));
    expect(after.total).toBe(2500);
    expect(after.journalId).not.toBe(before.journalId);
    const old = await env.DB.prepare('SELECT reversed_by_id FROM fin_journals WHERE id = ?').bind(before.journalId).first<{ reversed_by_id: string }>();
    expect(old?.reversed_by_id).toBeTruthy();
    // A description change does not touch the ledger.
    await a.json('PATCH', fin(ws, `/transactions/${t.id}`), { description: 'Printer paper' });
    expect((await a.json('GET', fin(ws, `/transactions/${t.id}`))).journalId).toBe(after.journalId);
    let pl = await a.json('GET', `${fin(ws, '/reports/profit_loss')}?from=2026-08-01&to=2026-08-31`);
    expect(pl.summary.expenses).toBe(2500);
    // Lock August: nothing new may be dated in it, and a reversal needs a later date.
    expect((await a.req('PUT', fin(ws, '/lock'), { lockDate: '2099-01-01' })).status).toBe(400);
    await a.json('PUT', fin(ws, '/lock'), { lockDate: '2026-08-31' });
    expect((await a.req('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-08-15', taxMode: 'none', lines: [{ accountId: office, amount: 100 }] })).status).toBe(409);
    expect((await a.req('PATCH', fin(ws, `/transactions/${t.id}`), { lines: [{ accountId: office, amount: 3000 }] })).status).toBe(409);
    const v = await a.req('POST', fin(ws, `/transactions/${t.id}/void`), {});
    expect(v.status).toBe(409);
    expect((await v.json<any>()).details?.code).toBe('PERIOD_LOCKED');
    await a.json('POST', fin(ws, `/transactions/${t.id}/void`), { date: '2026-09-01' });
    expect((await a.json('GET', fin(ws, `/transactions/${t.id}`))).status).toBe('void');
    // August stays as it was (locked); September carries the reversal.
    pl = await a.json('GET', `${fin(ws, '/reports/profit_loss')}?from=2026-08-01&to=2026-08-31`);
    expect(pl.summary.expenses).toBe(2500);
    pl = await a.json('GET', `${fin(ws, '/reports/profit_loss')}?from=2026-09-01&to=2026-09-30`);
    expect(pl.summary.expenses).toBe(-2500);
    // Drafts are deleted; posted entries are voided, never deleted.
    const d = await a.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-10-01', taxMode: 'none', action: 'draft', lines: [{ accountId: office, amount: 100 }] });
    expect(d.status).toBe('draft');
    await a.json('DELETE', fin(ws, `/transactions/${d.id}`));
    const p = await a.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-10-01', taxMode: 'none', lines: [{ accountId: office, amount: 100 }] });
    expect((await a.req('DELETE', fin(ws, `/transactions/${p.id}`))).status).toBe(409);
    // Possible duplicates are pointed out.
    const dups = await a.json('POST', fin(ws, '/transactions/duplicates'), { accountId: bank, date: '2026-10-02', total: 100, kind: 'spend' });
    expect(dups.map((x: any) => x.id)).toContain(p.id);
  });

  it('runs invoices, bills, purchase orders and expense claims through approval, payment and void', async () => {
    const { a, ws, acc, tax, bank, sales, office } = await business('Docs Owner');
    const staff = await signup('Docs Staff');
    await joinWs(a, ws, staff, 'contributor');
    const customer = await a.json('POST', fin(ws, '/contacts'), { name: 'Kestrel Packaging', kind: 'customer', email: 'accounts@kestrel.example.com', termsDays: 30 });
    const supplier = await a.json('POST', fin(ws, '/contacts'), { name: 'Bluegum Supplies', kind: 'supplier' });
    const inv = await a.json('POST', fin(ws, '/docs'), {
      kind: 'invoice',
      contactId: customer.id,
      issueDate: '2026-10-01',
      taxMode: 'exclusive',
      lines: [
        { description: 'Design work', quantity: 2, unitPrice: 15_000, accountId: sales, taxCodeId: tax.GST },
        { description: 'Site visit', quantity: 1, unitPrice: 5_000, accountId: sales, taxCodeId: tax.GST },
      ],
    });
    expect(inv).toMatchObject({ number: 'INV-0001', status: 'draft' });
    let d = await a.json('GET', fin(ws, `/docs/${inv.id}`));
    expect(d).toMatchObject({ subtotal: 35_000, taxTotal: 3_500, total: 38_500, dueDate: '2026-10-31' });
    await a.json('POST', fin(ws, `/docs/${inv.id}/approve`), {});
    const second = await a.json('POST', fin(ws, '/docs'), { kind: 'invoice', contactId: customer.id, issueDate: '2026-11-20', action: 'approve', lines: [{ unitPrice: 1000, accountId: sales }] });
    expect(second).toMatchObject({ number: 'INV-0002', status: 'approved' });
    expect((await a.req('POST', fin(ws, '/docs'), { kind: 'invoice', number: 'INV-0002', contactId: customer.id, issueDate: '2026-10-02', lines: [{ unitPrice: 1000, accountId: sales }] })).status).toBe(409);
    // Payments: in part, too much, the rest.
    await a.json('POST', fin(ws, `/docs/${inv.id}/payments`), { accountId: bank, date: '2026-10-10', amount: 10_000 });
    d = await a.json('GET', fin(ws, `/docs/${inv.id}`));
    expect(d).toMatchObject({ status: 'part_paid', amountPaid: 10_000, amountDue: 28_500 });
    expect((await a.req('POST', fin(ws, `/docs/${inv.id}/payments`), { accountId: bank, date: '2026-10-11', amount: 30_000 })).status).toBe(400);
    await a.json('POST', fin(ws, `/docs/${inv.id}/payments`), { accountId: bank, date: '2026-10-12', amount: 28_500 });
    d = await a.json('GET', fin(ws, `/docs/${inv.id}`));
    expect(d.status).toBe('paid');
    expect((await a.req('POST', fin(ws, `/docs/${inv.id}/void`), {})).status).toBe(409);
    await a.json('POST', fin(ws, `/docs/${inv.id}/payments/${d.payments[1].id}/void`), {});
    d = await a.json('GET', fin(ws, `/docs/${inv.id}`));
    expect(d).toMatchObject({ status: 'part_paid', amountDue: 28_500 });
    // Receivables in the ledger equal what customers still owe.
    const bs = await a.json('GET', `${fin(ws, '/reports/balance_sheet')}?date=2026-12-31`);
    expect(bs.summary.balanced).toBe(true);
    expect(rowMap(bs).get('610 Accounts receivable')).toEqual([28_500 + 1000]);
    const aged = await a.json('GET', `${fin(ws, '/reports/aged_receivables')}?date=2026-12-15`);
    expect(rowMap(aged).get('Kestrel Packaging')).toEqual([1000, 0, 28_500, 0, 0, 29_500]);
    // A draft is not in the ledger and not owed.
    await a.json('POST', fin(ws, '/docs'), { kind: 'invoice', contactId: customer.id, issueDate: '2026-11-21', lines: [{ unitPrice: 777, accountId: sales }] });
    expect((await a.json('GET', `${fin(ws, '/reports/aged_receivables')}?date=2026-12-15`)).summary.total).toBe(29_500);
    // The invoice as a PDF, and the list as CSV.
    const pdf = await a.req('GET', fin(ws, `/docs/${inv.id}/pdf`));
    expect(pdf.headers.get('Content-Type')).toBe('application/pdf');
    const csv = await (await a.req('GET', `${fin(ws, '/docs')}?kind=invoice&format=csv`)).text();
    expect(csv).toContain('INV-0001');

    // A purchase order becomes a draft bill; the bill is approved and paid.
    const po = await a.json('POST', fin(ws, '/docs'), { kind: 'purchase_order', contactId: supplier.id, issueDate: '2026-10-05', taxMode: 'inclusive', lines: [{ description: 'Toner', unitPrice: 22_000, accountId: office, taxCodeId: tax.GSTP }] });
    expect(po.number).toBe('PO-0001');
    await a.json('POST', fin(ws, `/docs/${po.id}/approve`), {});
    const bill = await a.json('POST', fin(ws, `/docs/${po.id}/convert`), {});
    expect((await a.json('GET', fin(ws, `/docs/${po.id}`))).status).toBe('billed');
    const b = await a.json('GET', fin(ws, `/docs/${bill.id}`));
    expect(b).toMatchObject({ kind: 'bill', status: 'draft', reference: 'PO-0001', total: 22_000, taxTotal: 2_000 });
    await a.json('POST', fin(ws, `/docs/${bill.id}/approve`), {});
    await a.json('POST', fin(ws, `/docs/${bill.id}/payments`), { accountId: bank, date: '2026-10-20', amount: 22_000 });
    expect((await a.json('GET', fin(ws, `/docs/${bill.id}`))).status).toBe('paid');

    // A contributor's expense claim waits for approval; the owner approves and reimburses.
    const claim = await staff.json('POST', fin(ws, '/docs'), { kind: 'expense_claim', issueDate: '2026-10-06', action: 'approve', taxMode: 'inclusive', lines: [{ description: 'Taxi', unitPrice: 4_400, accountId: byCode(acc, '493'), taxCodeId: tax.GSTP }] });
    expect(claim.status).toBe('submitted');
    expect((await staff.req('POST', fin(ws, `/docs/${claim.id}/approve`), {})).status).toBe(403);
    await a.json('POST', fin(ws, `/docs/${claim.id}/approve`), {});
    await a.json('POST', fin(ws, `/docs/${claim.id}/payments`), { accountId: bank, date: '2026-10-21', amount: 4_400 });
    const c2 = await staff.json('GET', fin(ws, `/docs/${claim.id}`));
    expect(c2).toMatchObject({ status: 'paid', claimantId: staff.userId });

    // GST on the cash basis counts invoices as they are paid.
    await a.json('PATCH', fin(ws), { gstBasis: 'cash' });
    const g = await a.json('GET', `${fin(ws, '/reports/gst')}?from=2026-10-01&to=2026-10-31`);
    // Received 10,000 of the 38,500 invoice (its GST 3,500 x 10,000/38,500 = 909), paid the bill (2,000) and the claim (400).
    expect(g.summary['1A']).toBe(909);
    expect(g.summary['1B']).toBe(2_400);
    const tb = await a.json('GET', `${fin(ws, '/reports/trial_balance')}?date=2026-12-31`);
    expect(tb.summary.balanced).toBe(true);
  });

  it('keeps business features out of personal workspaces and lets owners add categories, subcategories and opening balances', async () => {
    const me = await signup('Personal Books');
    const ws = await createWs(me, 'personal');
    expect((await me.req('POST', fin(ws, '/docs'), { kind: 'invoice', issueDate: '2026-10-01', lines: [{ unitPrice: 100 }] })).status).toBe(400);
    const acc = await accounts(me, ws);
    const food = acc.find((x: any) => x.name === 'Food').id;
    const pets = await me.json('POST', fin(ws, '/accounts'), { code: '5003', name: 'Pet food', subtype: 'expense', parentId: food });
    expect((await me.req('POST', fin(ws, '/accounts'), { code: '5004', name: 'Wrong', subtype: 'revenue', parentId: food })).status).toBe(400);
    const saver = await me.json('POST', fin(ws, '/accounts'), { code: '1015', name: 'Holiday saver', subtype: 'bank', openingBalance: 250_000, openingDate: '2026-07-01' });
    const card = await me.json('POST', fin(ws, '/accounts'), { code: '2001', name: 'Second card', subtype: 'credit_card', openingBalance: 40_000, openingDate: '2026-07-01' });
    const list = await accounts(me, ws);
    expect(list.find((x: any) => x.id === saver.id).balance).toBe(250_000);
    expect(list.find((x: any) => x.id === card.id).balance).toBe(40_000);
    const nw = await me.json('GET', `${fin(ws, '/reports/balance_sheet')}?date=2026-12-31`);
    expect(nw.title).toBe('Net worth (assets and debts)');
    expect(nw.summary).toMatchObject({ netAssets: 210_000, balanced: true });
    // Rename, archive (needs a zero balance), delete only if never used.
    await me.json('PATCH', fin(ws, `/accounts/${pets.id}`), { name: 'Pet food and vet' });
    expect((await me.req('POST', fin(ws, `/accounts/${saver.id}/archive`), { archived: true })).status).toBe(409);
    await me.json('DELETE', fin(ws, `/accounts/${pets.id}`));
    expect((await me.req('DELETE', fin(ws, `/accounts/${saver.id}`))).status).toBe(409);
    const opening = acc.find((x: any) => x.systemKey === 'opening');
    expect((await me.req('POST', fin(ws, `/accounts/${opening.id}/archive`), { archived: true })).status).toBe(400);
  });
});
