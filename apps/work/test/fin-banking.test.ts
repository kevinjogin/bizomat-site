// BIZOMAT Finance: bank statement import (CSV, OFX, QIF) with duplicate detection, matching, categorising and
// reconciliation; recurring transactions and the scheduled alerts, summaries and reports; budgets, goals, documents
// and the dashboard.
import { describe, expect, it } from 'vitest';
import { env } from 'cloudflare:test';
import { signup } from './helpers';
import { accounts, byCode, createWs, fin, joinWs } from './fin-helpers';
import { runFinanceScheduled } from '../src/worker/fin/scheduled';

const CSV = ['Date,Description,Amount', '01/10/2026,SALARY ACME PTY LTD,3500.00', '03/10/2026,WOOLWORTHS 1234 SYDNEY,-182.50', '05/10/2026,SHELL COLES EXPRESS,-60.00', '05/10/2026,SHELL COLES EXPRESS,-60.00'].join('\n');

describe('bank statements and reconciliation', () => {
  it('imports a CSV statement once, matches, categorises, ignores and reconciles its lines', async () => {
    const me = await signup('Statement Person');
    const ws = await createWs(me, 'personal');
    const acc = await accounts(me, ws);
    const everyday = byCode(acc, '1000');
    await me.json('POST', fin(ws, `/accounts/${everyday}/opening-balance`), { amount: 100_000, date: '2026-09-30' });
    // Already recorded by hand: the groceries.
    const groceries = await me.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: everyday, date: '2026-10-02', payee: 'Woolworths', lines: [{ accountId: byCode(acc, '5001'), amount: 18_250 }] });

    const preview = await me.json('POST', fin(ws, `/accounts/${everyday}/statement/preview`), { format: 'csv', text: CSV });
    expect(preview).toMatchObject({ total: 4, duplicates: 0, header: ['Date', 'Description', 'Amount'] });
    expect(preview.mapping).toMatchObject({ date: 0, amount: 2, description: 1 });
    expect(preview.rows[1]).toMatchObject({ date: '2026-10-03', amount: -18_250 });
    const first = await me.json('POST', fin(ws, `/accounts/${everyday}/statement/import`), { format: 'csv', filename: 'october.csv', text: CSV });
    // Two identical lines on one day are both kept; importing the same file again adds nothing.
    expect(first).toMatchObject({ imported: 4, duplicates: 0 });
    expect(await me.json('POST', fin(ws, `/accounts/${everyday}/statement/import`), { format: 'csv', text: CSV })).toMatchObject({ imported: 0, duplicates: 4 });
    expect((await me.json('POST', fin(ws, `/accounts/${everyday}/statement/preview`), { format: 'csv', text: CSV })).duplicates).toBe(4);

    let st = await me.json('GET', fin(ws, `/accounts/${everyday}/statement`));
    expect(st.counts).toEqual({ unmatched: 4 });
    const line = (desc: string, i = 0) => st.lines.filter((l: any) => l.description === desc)[i];
    // The groceries line finds the transaction already recorded.
    const woolies = line('WOOLWORTHS 1234 SYDNEY');
    expect(woolies.matches.map((m: any) => m.id)).toEqual([groceries.id]);
    expect((await me.req('POST', fin(ws, `/statement-lines/${woolies.id}/match`), { type: 'transaction', id: 'nope' })).status).toBe(400);
    await me.json('POST', fin(ws, `/statement-lines/${woolies.id}/match`), { type: 'transaction', id: groceries.id });
    expect((await me.json('GET', fin(ws, `/transactions/${groceries.id}`))).reconciled).toBe(true);
    // A reconciled transaction keeps its amount until it is unmatched.
    expect((await me.req('PATCH', fin(ws, `/transactions/${groceries.id}`), { lines: [{ accountId: byCode(acc, '5001'), amount: 18_000 }] })).status).toBe(409);
    // New transactions from the other lines; "remember" teaches the next suggestion.
    const salary = await me.json('POST', fin(ws, `/statement-lines/${line('SALARY ACME PTY LTD').id}/create`), { accountId: byCode(acc, '4000'), remember: true });
    await me.json('POST', fin(ws, `/statement-lines/${line('SHELL COLES EXPRESS', 0).id}/create`), { accountId: byCode(acc, '5301'), remember: true });
    expect((await me.json('GET', fin(ws, `/transactions/${salary.id}`))).status).toBe('posted');
    st = await me.json('GET', fin(ws, `/accounts/${everyday}/statement`));
    const shell2 = line('SHELL COLES EXPRESS', 0);
    expect(shell2.suggestions[0]).toMatchObject({ accountId: byCode(acc, '5301') });
    expect(shell2.suggestions[0].reason).toMatch(/Rule/);
    await me.json('POST', fin(ws, `/statement-lines/${shell2.id}/ignore`), { ignored: true });

    // Reconcile at 5 October: the bank says 4,197.50 but the ledger has 4,257.50 (the ignored line is missing).
    let rec = await me.json('POST', fin(ws, `/accounts/${everyday}/reconcile`), { statementDate: '2026-10-05', statementBalance: 419_750 });
    expect(rec).toMatchObject({ ledgerBalance: 425_750, difference: -6_000, balanced: false });
    await me.json('POST', fin(ws, `/statement-lines/${shell2.id}/ignore`), { ignored: false });
    await me.json('POST', fin(ws, `/statement-lines/${shell2.id}/create`), { accountId: byCode(acc, '5301') });
    rec = await me.json('POST', fin(ws, `/accounts/${everyday}/reconcile`), { statementDate: '2026-10-05', statementBalance: 419_750 });
    expect(rec.balanced).toBe(true);
    const status = await me.json('GET', `${fin(ws, `/accounts/${everyday}/reconcile`)}?date=2026-10-05`);
    expect(status).toMatchObject({ ledgerBalance: 419_750, unmatchedLines: { count: 0 } });
    expect(status.history).toHaveLength(2);
    expect((await me.json('GET', `${fin(ws, '/transactions')}?reconciled=1`)).total).toBe(4);
    // Unmatching frees the transaction again.
    await me.json('POST', fin(ws, `/statement-lines/${woolies.id}/unmatch`), {});
    expect((await me.json('GET', fin(ws, `/transactions/${groceries.id}`))).reconciled).toBe(false);

    // Another person cannot reach these lines, even through their own workspace.
    const other = await signup('Other Person');
    const theirs = await createWs(other, 'personal');
    expect((await other.req('POST', fin(theirs, `/statement-lines/${woolies.id}/match`), { type: 'transaction', id: groceries.id })).status).toBe(404);
    expect((await other.req('GET', fin(ws, `/accounts/${everyday}/statement`))).status).toBe(404);
  });

  it('reads OFX and QIF statements and refuses files that are not statements', async () => {
    const me = await signup('Formats Person');
    const ws = await createWs(me, 'personal');
    const card = byCode(await accounts(me, ws), '2000');
    const ofx = `OFXHEADER:100\nDATA:OFXSGML\n<OFX><BANKMSGSRSV1><STMTTRNRS><STMTRS><BANKTRANLIST>
<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20261004120000<TRNAMT>-45.90<FITID>A1001<NAME>BUNNINGS &amp; CO<MEMO>Hardware</STMTTRN>
<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20261006<TRNAMT>200.00<FITID>A1002<NAME>PAYMENT THANK YOU</STMTTRN>
</BANKTRANLIST></STMTRS></STMTTRNRS></BANKMSGSRSV1></OFX>`;
    expect(await me.json('POST', fin(ws, `/accounts/${card}/statement/import`), { format: 'ofx', text: ofx })).toMatchObject({ imported: 2, duplicates: 0 });
    expect(await me.json('POST', fin(ws, `/accounts/${card}/statement/import`), { format: 'ofx', text: ofx })).toMatchObject({ imported: 0, duplicates: 2 });
    const st = await me.json('GET', fin(ws, `/accounts/${card}/statement`));
    expect(st.lines.map((l: any) => [l.date, l.amount, l.payee])).toEqual([
      ['2026-10-06', 20_000, 'PAYMENT THANK YOU'],
      ['2026-10-04', -4_590, 'BUNNINGS & CO'],
    ]);
    const qif = '!Type:Bank\nD07/10/2026\nT-12.40\nPCafe Nero\nMFlat white x2\n^\nD08/10/2026\nT1,250.00\nPRefund\n^\n';
    expect(await me.json('POST', fin(ws, `/accounts/${card}/statement/import`), { format: 'qif', text: qif })).toMatchObject({ imported: 2 });
    expect((await me.req('POST', fin(ws, `/accounts/${card}/statement/import`), { format: 'csv', text: 'just some text' })).status).toBe(400);
    // Only money accounts take statements.
    const food = (await accounts(me, ws)).find((x: any) => x.name === 'Food').id;
    expect((await me.req('POST', fin(ws, `/accounts/${food}/statement/import`), { format: 'qif', text: qif })).status).toBe(400);
  });
});

describe('automation, planning and documents', () => {
  it('runs recurring transactions on schedule, keeps their day of the month, and sends each alert once', async () => {
    const owner = await signup('Auto Owner');
    const ws = await createWs(owner, 'business');
    const acc = await accounts(owner, ws);
    const bank = byCode(acc, '090');
    const office = byCode(acc, '453');
    const rent = await owner.json('POST', fin(ws, '/recurring'), { kind: 'transaction', name: 'Office rent', frequency: 'monthly', nextDate: '2026-01-31', autoPost: true, template: { kind: 'spend', accountId: bank, payee: 'Landlord', taxMode: 'none', lines: [{ accountId: office, amount: 250_000 }] } });
    // A template that would fail is refused when it is saved.
    expect((await owner.req('POST', fin(ws, '/recurring'), { kind: 'transaction', name: 'Bad', frequency: 'monthly', nextDate: '2026-01-31', template: { kind: 'spend', accountId: office, lines: [{ accountId: office, amount: 1 }] } })).status).toBe(400);
    // An invoice due at the end of January and never paid; a budget for March; a report every month.
    const customer = await owner.json('POST', fin(ws, '/contacts'), { name: 'Harbour Cafe', kind: 'customer' });
    const inv = await owner.json('POST', fin(ws, '/docs'), { kind: 'invoice', contactId: customer.id, issueDate: '2026-01-01', dueDate: '2026-01-31', action: 'approve', lines: [{ description: 'Catering', unitPrice: 80_000, accountId: byCode(acc, '200') }] });
    const budget = await owner.json('POST', fin(ws, '/budgets'), { name: '2026 plan', startMonth: '2026-01', months: 12 });
    await owner.json('PUT', fin(ws, `/budgets/${budget.id}/lines`), { lines: [{ accountId: office, month: '2026-03', amount: 10_000 }] });
    expect((await owner.req('PUT', fin(ws, `/budgets/${budget.id}/lines`), { lines: [{ accountId: bank, month: '2026-03', amount: 1 }] })).status).toBe(400);
    expect((await owner.req('PUT', fin(ws, `/budgets/${budget.id}/lines`), { lines: [{ accountId: office, month: '2027-03', amount: 1 }] })).status).toBe(400);
    await owner.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-03-01', taxMode: 'none', lines: [{ accountId: byCode(acc, '429'), amount: 9_500 }] });
    await owner.json('PUT', fin(ws, `/budgets/${budget.id}/lines`), { lines: [{ accountId: byCode(acc, '429'), month: '2026-03', amount: 10_000 }] });
    await owner.json('POST', fin(ws, '/report-schedules'), { reportKey: 'profit_loss', frequency: 'monthly', format: 'csv', nextDate: '2026-03-01' });

    // 2 March 2026, 9:05 am in Sydney.
    const at = Date.UTC(2026, 2, 1, 22, 5);
    const run = await runFinanceScheduled(env, at);
    expect(run.errors).toBe(0);
    const tx = await owner.json('GET', `${fin(ws, '/transactions')}?q=landlord`);
    expect(tx.rows.map((r: any) => [r.date, r.status])).toEqual([
      ['2026-02-28', 'posted'],
      ['2026-01-31', 'posted'],
    ]);
    const sched = (await owner.json('GET', fin(ws, '/recurring'))).find((r: any) => r.id === rent.id);
    expect(sched.nextDate).toBe('2026-03-31');
    const notes = await owner.json('GET', fin(ws, '/notifications'));
    const types = notes.items.map((n: any) => n.type);
    expect(types.filter((t: string) => t === 'recurring')).toHaveLength(2);
    expect(notes.items.find((n: any) => n.type === 'invoice_due').title).toBe(`Invoice ${inv.number} is overdue`);
    expect(notes.items.find((n: any) => n.type === 'budget').title).toMatch(/^General expenses: 95% of this month's budget spent/);
    expect(notes.items.find((n: any) => n.type === 'summary').title).toMatch(/February 2026 in summary/);
    expect(notes.items.find((n: any) => n.type === 'report').title).toMatch(/2026-02-01 to 2026-02-28 is ready/);
    const reports = await owner.json('GET', `${fin(ws, '/files')}?folder=Reports`);
    expect(reports.files).toHaveLength(1);
    expect(await (await owner.req('GET', reports.files[0].url)).text()).toContain('Profit and loss');
    // The same hour again: nothing is sent twice and nothing runs twice.
    const again = await runFinanceScheduled(env, at + 60_000);
    expect(again.recurring).toBe(0);
    expect((await owner.json('GET', fin(ws, '/notifications'))).items).toHaveLength(notes.items.length);
    // Running a schedule by hand, and pausing it.
    await owner.json('POST', fin(ws, `/recurring/${rent.id}/run`), {});
    await owner.json('PATCH', fin(ws, `/recurring/${rent.id}`), { active: false });
    expect((await owner.req('POST', fin(ws, `/recurring/${rent.id}/run`), {})).status).toBe(409);
    expect((await owner.json('GET', `${fin(ws, '/transactions')}?q=landlord`)).total).toBe(3);
  });

  it('compares budgets with actuals, fills a budget from last year, and tracks savings goals', async () => {
    const me = await signup('Budget Person');
    const ws = await createWs(me, 'personal');
    const acc = await accounts(me, ws);
    const everyday = byCode(acc, '1000');
    const groceries = byCode(acc, '5001');
    for (const [date, amount] of [['2025-10-04', 50_000], ['2025-11-04', 60_000], ['2026-10-04', 45_000]] as const) {
      await me.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: everyday, date, lines: [{ accountId: groceries, amount }] });
    }
    const b = await me.json('POST', fin(ws, '/budgets'), { name: 'Next year', startMonth: '2026-10', months: 12 });
    const filled = await me.json('POST', fin(ws, `/budgets/${b.id}/from-actuals`), { fromMonth: '2025-10', upliftPct: 10 });
    expect(filled.lines).toBe(2);
    const detail = await me.json('GET', fin(ws, `/budgets/${b.id}`));
    expect(detail.lines).toEqual(expect.arrayContaining([{ accountId: groceries, month: '2026-10', amount: 55_000 }, { accountId: groceries, month: '2026-11', amount: 66_000 }]));
    // Without dates, the budget's own months.
    expect((await me.json('GET', `${fin(ws, '/reports/budget_actual')}?budget=${b.id}`)).summary.expenseBudget).toBe(121_000);
    expect((await me.req('POST', fin(ws, '/report-schedules'), { reportKey: 'budget_actual', frequency: 'monthly', nextDate: '2026-12-01' })).status).toBe(400);
    const ba = await me.json('GET', `${fin(ws, '/reports/budget_actual')}?budget=${b.id}&from=2026-10-01&to=2026-10-31`);
    expect(ba.rows.find((r: any) => r.cells[0] === 'Groceries').cells.slice(1, 4)).toEqual([55_000, 45_000, 10_000]);
    // Goals: progress from a linked account, or an amount kept by hand.
    const saver = await me.json('POST', fin(ws, '/accounts'), { code: '1030', name: 'House deposit', subtype: 'bank', openingBalance: 1_500_000, openingDate: '2026-07-01' });
    await me.json('POST', fin(ws, '/goals'), { name: 'House deposit', targetAmount: 6_000_000, accountId: saver.id, targetDate: '2028-12-31' });
    await me.json('POST', fin(ws, '/goals'), { name: 'Holiday', targetAmount: 400_000, savedAmount: 400_000 });
    const goals = await me.json('GET', fin(ws, '/goals'));
    expect(goals.map((g: any) => [g.name, g.saved, g.progressPct, g.achieved])).toEqual([
      ['House deposit', 1_500_000, 25, false],
      ['Holiday', 400_000, 100, true],
    ]);
    // The dashboard brings it together.
    const dash = await me.json('GET', `${fin(ws, '/dashboard')}?period=this_month`);
    expect(dash.limited).toBe(false);
    expect(dash.goals).toHaveLength(2);
    expect(dash.moneyAccounts.find((m: any) => m.id === saver.id).balance).toBe(1_500_000);
  });

  it('keeps documents in folders with versions, served only to people who may see them', async () => {
    const owner = await signup('Docs Lib Owner');
    const staff = await signup('Docs Lib Staff');
    const ws = await createWs(owner, 'business');
    await joinWs(owner, ws, staff, 'contributor');
    const acc = await accounts(owner, ws);
    const upload = async (c: typeof owner, name: string, extra: Record<string, string> = {}) => {
      const form = new FormData();
      form.set('file', new File([`%PDF-1.4 ${name}`], name, { type: 'application/pdf' }));
      for (const [k, v] of Object.entries(extra)) form.set(k, v);
      return c.req('POST', fin(ws, '/files'), form);
    };
    const lease = await (await upload(owner, 'lease.pdf', { folder: 'Contracts', accountId: byCode(acc, '453') })).json<any>();
    const v2 = await (await upload(owner, 'lease-signed.pdf', { replacesId: lease.id })).json<any>();
    expect(v2.version).toBe(2);
    const receipt = await (await upload(staff, 'taxi.pdf', { folder: 'Receipts' })).json<any>();
    // The owner sees the newest version of each; the contributor sees only their own.
    const lib = await owner.json('GET', fin(ws, '/files'));
    expect(lib.files.map((f: any) => f.name).sort()).toEqual(['lease-signed.pdf', 'taxi.pdf']);
    expect(lib.folders.map((f: any) => f.folder)).toEqual(['Contracts', 'Receipts']);
    expect((await staff.json('GET', fin(ws, '/files'))).files.map((f: any) => f.id)).toEqual([receipt.id]);
    expect((await staff.req('GET', fin(ws, `/files/${lease.id}/download`))).status).toBe(404);
    expect((await owner.json('GET', `${fin(ws, '/files')}?q=taxi`)).files).toHaveLength(1);
    const versions = await owner.json('GET', fin(ws, `/files/${lease.id}/versions`));
    expect(versions.map((f: any) => f.version)).toEqual([2, 1]);
    const dl = await owner.req('GET', fin(ws, `/files/${v2.id}/download`));
    expect(dl.headers.get('Content-Disposition')).toMatch(/^attachment/);
    expect(dl.headers.get('Content-Security-Policy')).toContain('sandbox');
    expect(await dl.text()).toBe('%PDF-1.4 lease-signed.pdf');
    // Attached to a transaction the contributor cannot see: refused.
    const t = await owner.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: byCode(acc, '090'), date: '2026-10-01', lines: [{ accountId: byCode(acc, '453'), amount: 100 }] });
    expect((await upload(owner, 'invoice.pdf', { parentType: 'transaction', parentId: t.id })).status).toBe(201);
    expect((await upload(staff, 'sneaky.pdf', { parentType: 'transaction', parentId: t.id })).status).toBe(404);
    expect((await staff.req('GET', `${fin(ws, '/files')}?parentType=transaction&parentId=${t.id}`)).status).toBe(404);
    expect((await owner.json('GET', `${fin(ws, '/files')}?parentType=transaction&parentId=${t.id}`)).files).toHaveLength(1);
    // Files of another workspace are out of reach; deleting keeps the stored file for the audit trail.
    const other = await signup('Docs Lib Other');
    const theirs = await createWs(other, 'business');
    expect((await other.req('GET', fin(theirs, `/files/${receipt.id}/download`))).status).toBe(404);
    await staff.json('DELETE', fin(ws, `/files/${receipt.id}`));
    expect((await owner.json('GET', fin(ws, '/files'))).files.map((f: any) => f.name).sort()).toEqual(['invoice.pdf', 'lease-signed.pdf']);
    // The contributor's dashboard is limited to their own records.
    expect((await staff.json('GET', fin(ws, '/dashboard'))).limited).toBe(true);
  });
});
