// Finance (currencies, decimal-safe totals), reports (history, exports, snapshots, access) and email (Brevo, outbox,
// daily limit, webhooks, templates). 12 Nov 2026 platform upgrade.
import { env } from 'cloudflare:test';
import { afterEach, describe, expect, it } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { addMember, raw, signup, signupWith, uniqueEmail, type Client } from './helpers';
import { formatMoney, formatScaled, MoneyTotals, normalizeAmount, percent, scaledToDecimal, sumScaled, toScaled } from '../src/shared/money';
import { summariseFinance } from '../src/shared/finance';
import { BrevoProvider, setEmailProviderForTests, type EmailProvider, type OutgoingEmail } from '../src/worker/services/email/provider';
import { applyWebhookEvents, enqueueEmail, processOutbox } from '../src/worker/services/email/outbox';
import { renderEmail } from '../src/worker/services/email/templates';
import { csvCell } from '../src/worker/services/reports/xlsx';
import { pdfSafe } from '../src/worker/services/reports/pdf';

async function project(owner: Client, name = 'Pump station upgrade') {
  const b = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/boards`, { name, templateId: 'project-plan', withSampleItems: true });
  return owner.json('GET', `/api/boards/${b.id}`);
}

// ------------------------------------------------------------------ money

describe('money and currencies', () => {
  it('formats the supported currencies with their minor units and the ISO code', () => {
    expect(formatMoney(1234.5, 'AUD')).toBe('AUD 1,234.50');
    expect(formatMoney(1234.5, 'USD')).toBe('USD 1,234.50');
    expect(formatMoney(1234567.891, 'INR')).toBe('INR 1,234,567.89');
    expect(formatMoney(1234.5, 'JPY')).toBe('JPY 1,235');
    expect(formatMoney(-12, 'EUR')).toBe('-EUR 12.00');
    for (const c of ['GBP', 'NZD', 'CAD', 'SGD', 'CHF', 'CNY']) expect(formatMoney(1, c)).toBe(`${c} 1.00`);
    expect(formatMoney(12, null)).toBe('12.00');
    expect(formatMoney(5, 'EUR', { symbol: true })).toBe('€5.00');
  });

  it('adds without floating-point error and rounds half away from zero', () => {
    const { total } = sumScaled([0.1, 0.2, '0.3']);
    expect(scaledToDecimal(total, 2)).toBe('0.60');
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(scaledToDecimal(toScaled(2.675)!, 2)).toBe('2.68');
    expect(scaledToDecimal(toScaled(-2.675)!, 2)).toBe('-2.68');
    expect(scaledToDecimal(toScaled('1e-7')!, 4)).toBe('0.0000');
    expect(scaledToDecimal(toScaled(123456789012.34)!, 2)).toBe('123456789012.34');
    expect(percent(toScaled(1)!, toScaled(3)!)).toBe('33.3');
    expect(normalizeAmount('1,234.5678')).toEqual({ ok: true, value: 1234.5678 });
    expect(normalizeAmount('1.23456').ok).toBe(false);
  });

  it('never adds different currencies together', () => {
    const t = new MoneyTotals();
    t.add('AUD', 10);
    t.add('USD', 5);
    t.add('AUD', 2.5);
    expect(t.size).toBe(2);
    expect(formatScaled(t.get('AUD'), 'AUD')).toBe('AUD 12.50');
    expect(formatScaled(t.get('USD'), 'USD')).toBe('USD 5.00');
  });

  it('summarises by group and role: remaining budget, variance and utilisation', () => {
    const cols = [
      { id: 'b', title: 'Budget', type: 'currency', settings: { currencyMode: 'inherit', financeRole: 'approved_budget' } },
      { id: 'a', title: 'Actual', type: 'currency', settings: { currencyMode: 'inherit', financeRole: 'actual_cost' } },
      { id: 'c', title: 'Committed', type: 'currency', settings: { currencyMode: 'inherit', financeRole: 'committed' } },
      { id: 'x', title: 'Spare parts (USD)', type: 'currency', settings: { currency: 'USD', currencyMode: 'fixed', currencyConfirmed: true } },
    ];
    const items = [
      { id: '1', name: 'T1', groupId: 'g1', parentItemId: null, values: { b: 1000, a: 250.1, c: 100, x: 12 } },
      { id: '2', name: 'T2', groupId: 'g2', parentItemId: null, values: { b: 500, a: 0.2 } },
      { id: '3', name: 'Sub', groupId: 'g1', parentItemId: '1', values: { a: 999 } },
    ];
    const s = summariseFinance(cols, items, [{ id: 'g1', name: 'G1' }, { id: 'g2', name: 'G2' }], { boardCurrency: null, workspaceCurrency: 'AUD' });
    const aud = s.byRole.find((r) => r.currency === 'AUD')!;
    expect(aud.approvedBudget!.display).toBe('AUD 1,500.00');
    expect(aud.actualCost!.display).toBe('AUD 250.30');
    expect(aud.remaining!.display).toBe('AUD 1,149.70');
    expect(aud.variance!.display).toBe('AUD 1,249.70');
    expect(aud.utilisation).toBe('23.4');
    expect(s.mixedCurrencies).toBe(true);
    expect(s.columns.find((c) => c.columnId === 'x')!.total.display).toBe('USD 12.00');
    expect(s.groups.find((g) => g.groupId === 'g1')!.totals.find((t) => t.columnId === 'a')!.total.display).toBe('AUD 250.10');
  });
});

describe('finance settings on the API', () => {
  it('keeps existing amounts untouched when the organisation currency is chosen; old columns stay unconfirmed until reviewed', async () => {
    const owner = await signup();
    const a = await project(owner);
    const budget = a.columns.find((c: any) => c.type === 'currency');
    const task = a.items.find((i: any) => !i.parentItemId);
    // A column as boards made before this release have it: a stored USD code nobody chose.
    await env.DB.prepare('UPDATE columns SET settings_json = ? WHERE id = ?').bind(JSON.stringify({ currency: 'USD', decimals: 0 }), budget.id).run();
    await env.DB.prepare('UPDATE items SET values_json = json_set(values_json, ?, 78) WHERE id = ?').bind(`$."${budget.id}"`, task.id).run();
    const before = (await env.DB.prepare('SELECT values_json FROM items WHERE id = ?').bind(task.id).first<{ values_json: string }>())!.values_json;
    await owner.json('PUT', `/api/workspaces/${owner.workspaceId}/finance`, { defaultCurrency: 'AUD' });
    const fin = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/finance`);
    const col = fin.columns.find((c: any) => c.id === budget.id);
    expect(col).toMatchObject({ currency: 'USD', currencySource: 'column', confirmed: false, valueCount: expect.any(Number) });
    // The administrator decides: follow the organisation's currency. The stored number stays 78.
    await owner.json('POST', `/api/workspaces/${owner.workspaceId}/finance/columns/${budget.id}`, { action: 'inherit' });
    const after = (await env.DB.prepare('SELECT values_json FROM items WHERE id = ?').bind(task.id).first<{ values_json: string }>())!.values_json;
    expect(after).toBe(before);
    const bundle = await owner.json('GET', `/api/boards/${a.board.id}`);
    expect(bundle.columns.find((c: any) => c.id === budget.id).settings).toMatchObject({ currency: 'AUD', currencySource: 'organisation' });
    expect(bundle.items.find((i: any) => i.id === task.id).values[budget.id]).toBe(78);
    // A project can override the organisation's currency.
    await owner.json('PATCH', `/api/boards/${a.board.id}/project`, { currency: 'INR' });
    const sum = await owner.json('GET', `/api/boards/${a.board.id}/finance`);
    expect(sum.columns.find((c: any) => c.columnId === budget.id).currency).toBe('INR');
    expect((await owner.req('PATCH', `/api/boards/${a.board.id}/project`, { currency: 'XYZ' })).status).toBe(400);
    expect((await owner.req('PUT', `/api/workspaces/${owner.workspaceId}/finance`, { defaultCurrency: 'XYZ' })).status).toBe(400);
  });

  it('only administrators change finance settings', async () => {
    const owner = await signup();
    const member = await signup();
    await addMember(owner, member, 'member');
    expect((await member.req('PUT', `/api/workspaces/${owner.workspaceId}/finance`, { defaultCurrency: 'AUD' })).status).toBe(403);
  });
});

// ------------------------------------------------------------------ reports

const DAY = 86_400_000;

/** Move recorded history into the past so a report can be asked about a past month. */
async function backdate(boardId: string, ms: number) {
  await env.DB.batch([
    env.DB.prepare('UPDATE activity_log SET created_at = created_at - ? WHERE board_id = ?').bind(ms, boardId),
    env.DB.prepare('UPDATE items SET created_at = created_at - ?, updated_at = updated_at - ? WHERE board_id = ?').bind(ms, ms, boardId),
    env.DB.prepare('UPDATE boards SET created_at = created_at - ? WHERE id = ?').bind(ms, boardId),
  ]);
}

describe('project reports', () => {
  it('uses recorded history: a task completed last month shows in that month, a status changed today does not rewrite the past', async () => {
    const owner = await signup('Pat Manager');
    const a = await project(owner);
    const status = a.columns.find((c: any) => c.type === 'status');
    const [t1, t2] = a.items.filter((i: any) => !i.parentItemId && i.values[status.id] !== 'done');
    await owner.json('PATCH', `/api/items/${t1.id}`, { values: { [status.id]: 'done' } });
    await owner.json('PATCH', `/api/items/${t2.id}`, { values: { [status.id]: 'working' } });
    await backdate(a.board.id, 40 * DAY);
    // Today: t1 is reopened. Last month's report must still show it as completed then.
    await owner.json('PATCH', `/api/items/${t1.id}`, { values: { [status.id]: 'stuck' } });
    const now = new Date();
    const past = new Date(Date.now() - 40 * DAY);
    const month = `${past.getUTCFullYear()}-${String(past.getUTCMonth() + 1).padStart(2, '0')}`;
    const { report } = await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'monthly', month, timezone: 'UTC' });
    expect(report.previous.completed.map((r: any) => r.id)).toContain(t1.id);
    expect(report.previous.started.map((r: any) => r.id)).toContain(t2.id);
    // At the end of that month t1 was done (not stuck): the overview counts it as completed.
    const endRow = report.tasks.find((r: any) => r.id === t1.id);
    if (endRow) expect(endRow.statusClass).toBe('done');
    // The current month sees the reopening and the blocker.
    const cur = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'current_month', timezone: 'UTC' })).report;
    if (now.getUTCDate() > 0) expect(cur.remaining.blocked.map((r: any) => r.id)).toContain(t1.id);
    expect(cur.previous.completed.map((r: any) => r.id)).not.toContain(t1.id);
    expect(cur.history.reliableFrom).toBeLessThan(Date.now() - 30 * DAY);
  });

  it('inception-to-date, custom range and outstanding reports; carried-forward work; disclosure of missing history', async () => {
    const owner = await signup();
    const a = await project(owner);
    const fresh = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', timezone: 'UTC' })).report;
    expect(fresh.history.notes.join(' ')).toMatch(/No change has been recorded/);
    const status = a.columns.find((c: any) => c.type === 'status');
    const open = a.items.find((i: any) => !i.parentItemId && i.values[status.id] !== 'done');
    await owner.json('PATCH', `/api/items/${open.id}`, { values: { [status.id]: 'stuck' } });
    await backdate(a.board.id, 10 * DAY);
    const inc = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', timezone: 'UTC' })).report;
    expect(inc.overview.total).toBe(a.items.filter((i: any) => !i.parentItemId).length);
    expect(inc.overview.completed).toBeGreaterThan(0);
    expect(inc.summary.status.rule).toMatch(/Calculated from recorded task data/);
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - DAY).toISOString().slice(0, 10);
    const custom = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'custom', start: yesterday, end: today, timezone: 'UTC' })).report;
    expect(custom.meta.period).toMatchObject({ start: yesterday, end: today });
    expect(custom.previous.created).toHaveLength(0);
    expect(custom.remaining.carriedForward.length).toBeGreaterThan(0);
    const out = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'outstanding', timezone: 'UTC' })).report;
    expect(out.meta.sections).not.toContain('finance');
    // History that starts long after the board was created is disclosed.
    await env.DB.prepare('UPDATE boards SET created_at = created_at - ? WHERE id = ?').bind(100 * DAY, a.board.id).run();
    const late = (await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', timezone: 'UTC' })).report;
    expect(late.history.notes.join(' ')).toMatch(/Recorded history for this board starts on/);
  });

  it('keeps commentary apart from recorded data and labels it', async () => {
    const owner = await signup('Alex');
    const a = await project(owner);
    const { report, html } = await owner.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', commentary: { summary: 'Supplier delay <b>expected</b>', statusAssessment: 'at_risk' } });
    expect(report.summary.commentary).toMatchObject({ summary: 'Supplier delay <b>expected</b>', author: 'Alex' });
    expect(html).toContain('Management commentary, entered by Alex (not derived from recorded data)');
    expect(html).toContain('Supplier delay &lt;b&gt;expected&lt;/b&gt;');
    expect(html).not.toContain('<b>expected</b>');
  });

  it('finalises a report into PDF, Excel, HTML and CSV that never change afterwards', async () => {
    const owner = await signup();
    const a = await project(owner);
    const budget = a.columns.find((c: any) => c.type === 'currency');
    const task = a.items.find((i: any) => !i.parentItemId);
    await owner.json('PUT', `/api/workspaces/${owner.workspaceId}/finance`, { defaultCurrency: 'AUD' });
    await owner.json('PATCH', `/api/items/${task.id}`, { values: { [budget.id]: 1500.25, }, name: '=HYPERLINK("http://evil")' });
    const r = await owner.json('POST', `/api/boards/${a.board.id}/reports`, { type: 'financial', timezone: 'UTC', confidentiality: 'Commercial in confidence' });
    expect(r.version).toBe(1);
    const dl = async (f: string) => {
      const res = await owner.req('GET', `/api/reports/${r.id}/download/${f}`);
      expect(res.status).toBe(200);
      return { bytes: new Uint8Array(await res.arrayBuffer()), sha: res.headers.get('X-Report-SHA256'), type: res.headers.get('Content-Type') };
    };
    const pdf = await dl('pdf');
    expect(new TextDecoder().decode(pdf.bytes.slice(0, 5))).toBe('%PDF-');
    expect(pdf.type).toBe('application/pdf');
    const xlsx = await dl('xlsx');
    const zip = unzipSync(xlsx.bytes);
    expect(Object.keys(zip)).toEqual(expect.arrayContaining(['xl/workbook.xml', 'xl/worksheets/sheet1.xml', '[Content_Types].xml']));
    const wb = strFromU8(zip['xl/workbook.xml']);
    expect(wb).toContain('name="Finance"');
    const finSheet = Object.entries(zip).find(([k, v]) => k.startsWith('xl/worksheets/') && strFromU8(v).includes('Approved budget'));
    expect(finSheet).toBeTruthy();
    expect(strFromU8(finSheet![1])).toContain('1500.25');
    const csv = new TextDecoder().decode((await dl('csv')).bytes);
    expect(csv).toContain(`"'=HYPERLINK(""http://evil"")"`);
    const html = new TextDecoder().decode((await dl('html')).bytes);
    expect(html).toContain('AUD 1,500.25');
    expect(html).toContain('Commercial in confidence');
    // The project changes; the saved report does not.
    await owner.json('PATCH', `/api/items/${task.id}`, { values: { [budget.id]: 99 } });
    const again = await dl('pdf');
    expect(again.sha).toBe(pdf.sha);
    expect(Buffer.from(again.bytes).equals(Buffer.from(pdf.bytes))).toBe(true);
    expect(new TextDecoder().decode((await dl('html')).bytes)).toContain('AUD 1,500.25');
    const list = await owner.json('GET', `/api/boards/${a.board.id}/reports`);
    expect(list.reports[0]).toMatchObject({ id: r.id, version: 1, includesFinance: true, type: 'financial' });
    const second = await owner.json('POST', `/api/boards/${a.board.id}/reports`, { type: 'inception' });
    expect(second.version).toBe(2);
    const audit = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/audit-events?type=report`);
    expect(audit.filter((e: any) => e.type === 'report.generated').length).toBe(2);
  });

  it('only authorised people see reports, and finance reports only those who may see finances', async () => {
    const owner = await signup();
    const member = await signup();
    await addMember(owner, member, 'member');
    const a = await project(owner);
    const r = await owner.json('POST', `/api/boards/${a.board.id}/reports`, { type: 'financial' });
    // A member edits the project but does not generate reports by default.
    expect((await member.req('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception' })).status).toBe(403);
    expect((await member.req('GET', `/api/boards/${a.board.id}/reports`)).status).toBe(403);
    expect((await member.req('GET', `/api/reports/${r.id}/download/pdf`)).status).toBe(404);
    // Given the right, with finance hidden from them: the finance report stays closed, others open.
    await owner.json('PUT', `/api/boards/${a.board.id}/access/${member.userId}`, { level: 'edit', overrides: { generateReports: true, viewFinance: false } });
    const list = await member.json('GET', `/api/boards/${a.board.id}/reports`);
    expect(list.reports.find((x: any) => x.id === r.id)).toBeUndefined();
    expect(list.hiddenWithFinance).toBe(1);
    expect((await member.req('GET', `/api/reports/${r.id}/download/pdf`)).status).toBe(403);
    const own = (await member.json('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception', includeFinance: true })).report;
    expect(own.finance).toBeNull();
    expect(own.meta.sections).not.toContain('finance');
    // Signed out: nothing.
    expect((await raw('GET', `/api/reports/${r.id}/download/pdf`)).status).toBe(401);
  });

  it('a project manager generates reports on the projects they manage', async () => {
    const owner = await signup();
    const email = uniqueEmail('pm');
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email, role: 'project_manager' });
    const pm = await signupWith('PM', email, inv.inviteUrl.split('/invite/')[1]);
    const a = await project(owner);
    expect((await pm.req('POST', `/api/boards/${a.board.id}/reports/preview`, { type: 'inception' })).status).toBe(200);
  });

  it('PDF text is limited to what the standard fonts can draw', () => {
    expect(pdfSafe('Café – €5 → नमस्ते 😀')).toBe('Café – €5 -> ?????? ?');
    expect(csvCell('+1')).toBe("'+1");
    expect(csvCell('a,b')).toBe('"a,b"');
  });
});

// ------------------------------------------------------------------ email

class FakeProvider implements EmailProvider {
  name = 'fake';
  sent: OutgoingEmail[] = [];
  next: Awaited<ReturnType<EmailProvider['send']>>[] = [];
  async send(m: OutgoingEmail) {
    this.sent.push(m);
    return this.next.shift() ?? { ok: true as const, messageId: `<m${this.sent.length}.${crypto.randomUUID()}@test>` };
  }
}

afterEach(() => setEmailProviderForTests(null));

describe('email', () => {
  it('without a provider nothing is queued and invitations offer the link instead', async () => {
    const owner = await signup();
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: uniqueEmail('x'), role: 'member' });
    expect(inv.emailDelivery).toBe('not_configured');
    expect(inv.inviteUrl).toMatch(/\/invite\//);
    expect((await enqueueEmail(env, { to: 'a@example.com', data: { template: 'test', organisation: 'o', sentBy: 's', provider: 'p', at: 'now' }, idempotencyKey: 'k-none' })).queued).toBe(false);
  });

  it('sends an invitation through the provider, clears the secret link afterwards, and never sends it twice', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const owner = await signup('Olivia');
    const email = uniqueEmail('invitee');
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email, role: 'viewer' });
    expect(inv.emailDelivery).toBe('queued');
    await processOutbox(env);
    const msg = fake.sent.find((m) => m.to.email === email)!;
    expect(msg.subject).toBe("You've been invited to join an organisation on BIZOMAT");
    expect(msg.html).toContain(inv.inviteUrl);
    expect(msg.text).toContain(inv.inviteUrl);
    expect(msg.html).toContain('Olivia');
    expect(msg.html).toContain('Viewer');
    const row = await env.DB.prepare("SELECT status, html, text FROM email_outbox WHERE to_email = ? AND template = 'invitation'").bind(email).first<{ status: string; html: string; text: string }>();
    expect(row).toMatchObject({ status: 'sent', html: '', text: '' });
    await processOutbox(env);
    expect(fake.sent.filter((m) => m.to.email === email)).toHaveLength(1);
    // The same idempotency key queues nothing more.
    const d1 = await enqueueEmail(env, { to: email, data: { template: 'test', organisation: 'o', sentBy: 's', provider: 'p', at: 'now' }, idempotencyKey: 'same-key' });
    const d2 = await enqueueEmail(env, { to: email, data: { template: 'test', organisation: 'o', sentBy: 's', provider: 'p', at: 'now' }, idempotencyKey: 'same-key' });
    expect(d1.queued).toBe(true);
    expect(d2).toEqual({ queued: false, reason: 'duplicate' });
  });

  it('emails the assignee with the task details and their permitted actions', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const owner = await signup('Morgan');
    const bob = await signup('Bob');
    await addMember(owner, bob, 'member');
    const a = await project(owner, 'Line 3 commissioning');
    const person = a.columns.find((c: any) => c.type === 'person');
    const task = a.items.find((i: any) => !i.parentItemId);
    await owner.json('PATCH', `/api/items/${task.id}`, { values: { [person.id]: bob.userId } });
    await processOutbox(env);
    const msg = fake.sent.find((m) => m.to.email === bob.email && m.tags[0] === 'task_assignment')!;
    expect(msg.subject).toBe(`New task assigned to you – ${task.name}`);
    expect(msg.html).toContain('Line 3 commissioning');
    expect(msg.html).toContain('Morgan');
    expect(msg.html).toMatch(/You can: view the task, edit it, update its status/);
    expect(msg.html).toContain(`/tasks/${task.id}`);
  });

  it('retries failures, gives up on permanent errors, and keeps within the daily limit with a reserve for invitations', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const limited = { ...env, EMAIL_DAILY_LIMIT: '1', EMAIL_CRITICAL_RESERVE: '1' } as typeof env;
    const day = `d${Date.now()}`;
    // Clear today's count for this test.
    await env.DB.prepare("UPDATE email_outbox SET sent_at = sent_at - 172800000 WHERE sent_at IS NOT NULL").run();
    fake.next.push({ ok: false, kind: 'retry', status: 503, error: 'Brevo error (503)' });
    const a = await enqueueEmail(limited, { to: 'a@example.com', data: { template: 'notification', organisation: 'o', title: 'One' }, idempotencyKey: `${day}-1` });
    await processOutbox(limited);
    let row = await env.DB.prepare('SELECT status, attempts, last_error FROM email_outbox WHERE id = ?').bind((a as any).id).first<any>();
    expect(row).toMatchObject({ status: 'deferred', attempts: 1 });
    await env.DB.prepare('UPDATE email_outbox SET next_attempt_at = 0 WHERE id = ?').bind((a as any).id).run();
    await processOutbox(limited);
    row = await env.DB.prepare('SELECT status FROM email_outbox WHERE id = ?').bind((a as any).id).first<any>();
    expect(row.status).toBe('sent');
    // The limit (1) is used: the next normal message waits for tomorrow, an invitation still goes (reserve 1).
    const b = await enqueueEmail(limited, { to: 'b@example.com', data: { template: 'notification', organisation: 'o', title: 'Two' }, idempotencyKey: `${day}-2` });
    const inv = await enqueueEmail(limited, { to: 'c@example.com', data: { template: 'invitation', organisation: 'o', inviter: 'i', role: 'Member', expires: 'soon', url: 'https://x/invite/t', existingUser: false }, idempotencyKey: `${day}-3`, sensitive: true });
    await processOutbox(limited);
    const rb = await env.DB.prepare('SELECT status, next_attempt_at, last_error FROM email_outbox WHERE id = ?').bind((b as any).id).first<any>();
    expect(rb.status).toBe('deferred');
    expect(rb.last_error).toMatch(/Daily sending limit/);
    expect(rb.next_attempt_at).toBeGreaterThan(Date.now());
    expect((await env.DB.prepare('SELECT status FROM email_outbox WHERE id = ?').bind((inv as any).id).first<any>()).status).toBe('sent');
    // A rejected address fails at once and is not retried.
    fake.next.push({ ok: false, kind: 'permanent', status: 400, error: 'Brevo rejected the message (400 invalid_parameter)' });
    const big = { ...env, EMAIL_DAILY_LIMIT: '1000' } as typeof env;
    const bad = await enqueueEmail(big, { to: 'bad@example.com', data: { template: 'notification', organisation: 'o', title: 'X' }, idempotencyKey: `${day}-4` });
    await processOutbox(big);
    expect((await env.DB.prepare('SELECT status, attempts FROM email_outbox WHERE id = ?').bind((bad as any).id).first<any>())).toMatchObject({ status: 'failed', attempts: 1 });
    expect((await enqueueEmail(big, { to: 'not-an-address', data: { template: 'notification', organisation: 'o', title: 'X' }, idempotencyKey: `${day}-5` }))).toEqual({ queued: false, reason: 'invalid_address' });
  });

  it('talks to the Brevo API as documented: api-key header, sender, recipient, both bodies; maps its errors', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const reply = (status: number, body: unknown) => async (url: any, init: any) => {
      calls.push({ url, init });
      return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
    };
    const msg: OutgoingEmail = { to: { email: 'r@example.com', name: 'R' }, from: { email: 'notifications@bizomat.ai', name: 'BIZOMAT' }, replyTo: null, subject: 'S', html: '<p>H</p>', text: 'T', tags: ['test'], correlationId: 'abc123' };
    const ok = await new BrevoProvider('KEY', false, reply(201, { messageId: '<id@brevo>' }) as any).send(msg);
    expect(ok).toEqual({ ok: true, messageId: '<id@brevo>' });
    expect(calls[0].url).toBe('https://api.brevo.com/v3/smtp/email');
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers['api-key']).toBe('KEY');
    const body = JSON.parse(String(calls[0].init.body));
    expect(body).toMatchObject({ sender: { email: 'notifications@bizomat.ai', name: 'BIZOMAT' }, to: [{ email: 'r@example.com', name: 'R' }], subject: 'S', htmlContent: '<p>H</p>', textContent: 'T', headers: { 'X-Mailin-custom': 'outbox_id:abc123' } });
    expect((await new BrevoProvider('K', false, reply(400, { code: 'invalid_parameter', message: 'email is not valid' }) as any).send(msg))).toMatchObject({ ok: false, kind: 'permanent' });
    expect((await new BrevoProvider('K', false, reply(401, { code: 'unauthorized' }) as any).send(msg))).toMatchObject({ ok: false, kind: 'config' });
    expect((await new BrevoProvider('K', false, reply(402, { code: 'not_enough_credits' }) as any).send(msg))).toMatchObject({ ok: false, kind: 'quota' });
    expect((await new BrevoProvider('K', false, reply(429, {}) as any).send(msg))).toMatchObject({ ok: false, kind: 'retry', status: 429 });
    expect((await new BrevoProvider('K', false, reply(500, {}) as any).send(msg))).toMatchObject({ ok: false, kind: 'retry' });
    const failing = async () => {
      throw new TypeError('fetch failed');
    };
    expect((await new BrevoProvider('K', false, failing as any).send(msg))).toMatchObject({ ok: false, kind: 'retry' });
    await new BrevoProvider('K', true, reply(201, { messageId: 'x' }) as any).send(msg);
    expect(JSON.parse(String(calls.at(-1)!.init.body)).headers['X-Sib-Sandbox']).toBe('drop');
  });

  it('accepts Brevo webhooks only with the token, records bounces and stops sending to bounced addresses', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const q = await enqueueEmail(env, { to: 'bounce@example.com', data: { template: 'notification', organisation: 'o', title: 'X' }, idempotencyKey: `wh-${Date.now()}` });
    await processOutbox(env);
    const sent = await env.DB.prepare('SELECT provider_message_id FROM email_outbox WHERE id = ?').bind((q as any).id).first<{ provider_message_id: string }>();
    const event = { event: 'hard_bounce', email: 'bounce@example.com', 'message-id': sent!.provider_message_id, ts_event: Math.floor(Date.now() / 1000), reason: 'mailbox does not exist' };
    expect((await raw('POST', '/api/email-webhooks/brevo', { body: event })).status).toBe(401);
    expect((await raw('POST', '/api/email-webhooks/brevo', { body: event, headers: { Authorization: 'Bearer wrong' } })).status).toBe(401);
    const ok = await raw('POST', '/api/email-webhooks/brevo', { body: [event], headers: { Authorization: 'Bearer test-webhook-token' } });
    expect(ok.status).toBe(200);
    expect(await ok.json()).toMatchObject({ received: 1, matched: 1 });
    const row = await env.DB.prepare('SELECT status, last_event FROM email_outbox WHERE id = ?').bind((q as any).id).first<any>();
    expect(row).toMatchObject({ status: 'bounced', last_event: 'hard_bounce' });
    const again = await enqueueEmail(env, { to: 'bounce@example.com', data: { template: 'notification', organisation: 'o', title: 'Y' }, idempotencyKey: `wh2-${Date.now()}` });
    expect(again).toEqual({ queued: false, reason: 'suppressed' });
    // A delivered event later never undoes the bounce; unknown messages are recorded but match nothing.
    const r2 = await applyWebhookEvents(env.DB, [{ event: 'delivered', 'message-id': sent!.provider_message_id }, { event: 'delivered', 'message-id': '<unknown>' }]);
    expect(r2).toEqual({ received: 2, matched: 1 });
    expect((await env.DB.prepare('SELECT status FROM email_outbox WHERE id = ?').bind((q as any).id).first<any>()).status).toBe('bounced');
  });

  it('administrators see delivery status and can send a test to themselves only', async () => {
    const fake = new FakeProvider();
    setEmailProviderForTests(fake);
    const owner = await signup();
    const t = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/email/test`, {});
    expect(t).toMatchObject({ ok: true, status: 'sent' });
    expect(fake.sent.at(-1)!.to.email).toBe(owner.email);
    const s = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/email`);
    expect(s).toMatchObject({ configured: true, dailyLimit: 250, sender: { email: 'notifications@bizomat.ai', name: 'BIZOMAT' } });
    expect(JSON.stringify(s)).not.toMatch(/api-key|BREVO_API_KEY/);
    const member = await signup();
    await addMember(owner, member, 'member');
    expect((await member.req('POST', `/api/workspaces/${owner.workspaceId}/email/test`, {})).status).toBe(403);
  });

  it('renders every template with escaping and a plain-text part', () => {
    const evil = '<script>alert(1)</script>';
    const all = [
      renderEmail({ template: 'invitation', organisation: evil, inviter: 'I', role: 'Guest / contractor', expires: 'Fri, 19 Nov 2026 10:00 UTC', url: 'https://bizomat.ai/tasks/invite/t', existingUser: true }),
      renderEmail({ template: 'invitation_accepted', organisation: 'O', person: 'P', email: 'p@x.com', role: 'Member', url: 'u' }),
      renderEmail({ template: 'project_assignment', organisation: 'O', project: 'P', level: 'edit', by: 'B', url: 'u' }),
      renderEmail({ template: 'task_assignment', organisation: 'O', project: 'P', board: 'P', task: evil, url: 'u', priority: 'High', dueDate: '2026-11-20' }),
      renderEmail({ template: 'task_reassignment', organisation: 'O', project: 'P', board: 'P', task: 'T', url: 'u', previous: 'Sam' }),
      renderEmail({ template: 'due_reminder', organisation: 'O', project: 'P', board: 'P', task: 'T', url: 'u', dueDate: '2026-11-20' }),
      renderEmail({ template: 'overdue', organisation: 'O', project: 'P', board: 'P', task: 'T', url: 'u', dueDate: '2026-11-01' }),
      renderEmail({ template: 'status_update', organisation: 'O', project: 'P', board: 'P', task: 'T', url: 'u', status: 'Done', from: 'Working' }),
      renderEmail({ template: 'comment_mention', organisation: 'O', project: 'P', board: 'P', task: 'T', url: 'u', author: 'A', mention: true, excerpt: 'Hi' }),
      renderEmail({ template: 'project_membership', organisation: 'O', project: 'P', change: 'c', by: 'b', url: 'u' }),
      renderEmail({ template: 'permission_change', organisation: 'O', project: null, change: 'c', by: 'b', url: 'u' }),
      renderEmail({ template: 'report_generated', organisation: 'O', project: 'P', report: 'R', period: 'Oct', by: 'b', url: 'u' }),
    ];
    for (const e of all) {
      expect(e.subject.length).toBeGreaterThan(0);
      expect(e.html).not.toContain('<script>');
      expect(e.text.length).toBeGreaterThan(20);
      expect(e.html).toContain('Connecting Intelligence. Empowering Progress.');
      expect(e.html).toContain('BIZOMAT. All rights reserved.');
    }
    expect(all[0].subject).toBe("You've been invited to join an organisation on BIZOMAT");
    expect(all[0].html).toContain('Accept invitation');
    expect(all[3].subject).toBe('New task assigned to you – <script>alert(1)</script>');
  });
});
