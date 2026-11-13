// BIZOMAT Finance: workspaces (personal, household, business), members, invitations, roles and permissions, and
// isolation between workspaces.
import { describe, expect, it } from 'vitest';
import { PASSWORD, raw, signup, uniqueEmail } from './helpers';
import { accounts, byCode, createWs, fin, joinWs, taxCodes } from './fin-helpers';

describe('workspaces', () => {
  it('creates personal, household and business workspaces with their own charts; only businesses get tax codes', async () => {
    const a = await signup('Fin Owner');
    const personal = await createWs(a, 'personal');
    const household = await createWs(a, 'household');
    const business = await createWs(a, 'business', { gstRegistered: true, abn: '51 824 753 556' });
    const list = await a.json('GET', '/api/fin/orgs');
    expect(list.orgs.map((o: any) => o.kind).sort()).toEqual(['business', 'household', 'personal']);
    const p = await a.json('GET', fin(personal));
    expect(p).toMatchObject({ kind: 'personal', role: 'owner', currency: 'AUD', fyStartMonth: 7, gst: false });
    expect(p.settings.approvals.transactions).toBe(false);
    const b = await a.json('GET', fin(business));
    expect(b).toMatchObject({ kind: 'business', gst: true, abn: '51824753556' });
    expect(b.settings.approvals.transactions).toBe(true);
    const pAcc = await accounts(a, personal);
    expect(pAcc.find((x: any) => x.name === 'Groceries')).toMatchObject({ type: 'expense', parentId: pAcc.find((x: any) => x.name === 'Food').id });
    expect(pAcc.some((x: any) => x.systemKey === 'ar')).toBe(false);
    const bAcc = await accounts(a, business);
    for (const key of ['ar', 'ap', 'gst', 'claims', 'retained', 'opening']) expect(bAcc.some((x: any) => x.systemKey === key)).toBe(true);
    expect(Object.keys(await taxCodes(a, business)).sort()).toEqual(['BASX', 'CAP', 'CAPF', 'EXP', 'FRE', 'FREP', 'GST', 'GSTP', 'ITP', 'ITS']);
    expect(await a.json('GET', fin(personal, '/tax-codes'))).toEqual([]);
    // A business that registers for GST later already has the tax codes, and its accounts their usual code.
    const later = await createWs(a, 'business');
    expect((await a.json('GET', fin(later))).gst).toBe(false);
    await a.json('PATCH', fin(later), { gstRegistered: true });
    expect((await a.json('GET', fin(later))).gst).toBe(true);
    const lt = await taxCodes(a, later);
    const la = await accounts(a, later);
    expect(la.find((x: any) => x.code === '200').taxCodeId).toBe(lt.GST);
    expect(la.find((x: any) => x.code === '453').taxCodeId).toBe(lt.GSTP);
    expect(la.find((x: any) => x.code === '404').taxCodeId).toBe(lt.FREP);
    // Business features are refused in personal and household workspaces.
    expect((await a.req('GET', `${fin(household, '/docs')}?kind=invoice`)).status).toBe(400);
    void byCode;
  });

  it('isolates workspaces: a non-member gets 404, and records of one workspace cannot be used in another', async () => {
    const a = await signup('Iso A');
    const b = await signup('Iso B');
    const wa = await createWs(a, 'business');
    const wb = await createWs(b, 'business');
    expect((await b.req('GET', fin(wa))).status).toBe(404);
    expect((await b.req('GET', fin(wa, '/accounts'))).status).toBe(404);
    expect((await b.req('GET', fin(wa, '/transactions'))).status).toBe(404);
    expect((await b.req('POST', fin(wa, '/contacts'), { name: 'Sneaky' })).status).toBe(404);
    const accA = await accounts(a, wa);
    const accB = await accounts(b, wb);
    // B posts in its own workspace with A's bank account: refused.
    const res = await b.req('POST', fin(wb, '/transactions'), { kind: 'spend', accountId: byCode(accA, '090'), date: '2026-11-01', lines: [{ accountId: byCode(accB, '429'), amount: 1000 }] });
    expect(res.status).toBe(400);
    const tx = await a.json('POST', fin(wa, '/transactions'), { kind: 'spend', accountId: byCode(accA, '090'), date: '2026-11-01', lines: [{ accountId: byCode(accA, '429'), amount: 1000 }] });
    expect((await b.req('GET', fin(wb, `/transactions/${tx.id}`))).status).toBe(404);
    expect((await b.req('GET', fin(wa, `/transactions/${tx.id}`))).status).toBe(404);
    // B's lists never show A's records.
    expect((await b.json('GET', fin(wb, '/transactions'))).total).toBe(0);
  });
});

describe('members, roles and invitations', () => {
  it('invites by link for the invited address only, once; roles decide what each person can do', async () => {
    const owner = await signup('Biz Owner');
    const accountant = await signup('Biz Accountant');
    const staff = await signup('Biz Staff');
    const viewer = await signup('Biz Viewer');
    const stranger = await signup('Stranger');
    const ws = await createWs(owner, 'business', { gstRegistered: true });
    const inv = await owner.json('POST', fin(ws, '/invitations'), { email: accountant.email, role: 'accountant' });
    expect(inv.inviteUrl).toMatch(/\/finance\/join\//);
    const token = decodeURIComponent(inv.inviteUrl.split('/join/')[1]);
    const preview = await (await accountant.req('GET', `/api/fin-public/invitations/${token}`)).json<any>();
    expect(preview).toMatchObject({ roleLabel: 'Accountant', status: 'pending', orgKind: 'business' });
    expect((await stranger.req('POST', `/api/fin/invitations/${token}/accept`, {})).status).toBe(403);
    await accountant.json('POST', `/api/fin/invitations/${token}/accept`, {});
    expect((await stranger.req('POST', `/api/fin/invitations/${token}/accept`, {})).status).toBe(410);
    await joinWs(owner, ws, staff, 'contributor');
    await joinWs(owner, ws, viewer, 'viewer');
    const members = await owner.json('GET', fin(ws, '/members'));
    expect(members.map((m: any) => m.role).sort()).toEqual(['accountant', 'contributor', 'owner', 'viewer']);

    const acc = await accounts(owner, ws);
    const bank = byCode(acc, '090');
    const office = byCode(acc, '453');
    // The contributor's spending waits for approval (business default) and is visible only to them and approvers.
    const t = await staff.json('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-11-02', payee: 'Officeworks', lines: [{ accountId: office, amount: 5500 }] });
    expect(t.status).toBe('submitted');
    expect((await viewer.json('GET', fin(ws, '/transactions'))).rows.map((r: any) => r.id)).toEqual([t.id]);
    const ownerTx = await owner.json('POST', fin(ws, '/transactions'), { kind: 'receive', accountId: bank, date: '2026-11-02', lines: [{ accountId: byCode(acc, '200'), amount: 11000 }] });
    expect(ownerTx.status).toBe('posted');
    expect((await staff.json('GET', fin(ws, '/transactions'))).rows.map((r: any) => r.id)).toEqual([t.id]);
    expect((await staff.req('GET', fin(ws, `/transactions/${ownerTx.id}`))).status).toBe(404);
    expect((await staff.req('POST', fin(ws, `/transactions/${t.id}/approve`), {})).status).toBe(403);
    // The viewer reads, never writes; nor can a contributor see reports in a business.
    expect((await viewer.req('POST', fin(ws, '/transactions'), { kind: 'spend', accountId: bank, date: '2026-11-02', lines: [{ accountId: office, amount: 100 }] })).status).toBe(403);
    expect((await viewer.req('GET', fin(ws, '/reports/profit_loss'))).status).toBe(200);
    expect((await staff.req('GET', fin(ws, '/reports/profit_loss'))).status).toBe(403);
    // The accountant approves; the ledger now has it.
    await accountant.json('POST', fin(ws, `/transactions/${t.id}/approve`), {});
    expect((await staff.json('GET', fin(ws, `/transactions/${t.id}`))).status).toBe('posted');
    // Accountants keep the chart and lock periods, but do not manage members.
    await accountant.json('POST', fin(ws, '/accounts'), { code: '455', name: 'Cloud hosting', subtype: 'expense' });
    expect((await accountant.req('POST', fin(ws, '/invitations'), { email: 'x@example.com', role: 'viewer' })).status).toBe(403);
    expect((await staff.req('POST', fin(ws, '/accounts'), { code: '456', name: 'Nope', subtype: 'expense' })).status).toBe(403);
    // Ownership: only the owner transfers; the old owner becomes an administrator.
    expect((await accountant.req('POST', fin(ws, '/transfer'), { userId: accountant.userId })).status).toBe(403);
    await owner.json('POST', fin(ws, '/transfer'), { userId: accountant.userId });
    expect((await owner.json('GET', fin(ws))).role).toBe('admin');
    expect((await accountant.json('GET', fin(ws))).role).toBe('owner');
    // Leaving and removing.
    await viewer.json('POST', fin(ws, '/leave'), {});
    expect((await viewer.req('GET', fin(ws))).status).toBe(404);
    await accountant.json('DELETE', fin(ws, `/members/${staff.userId}`));
    expect((await staff.req('GET', fin(ws))).status).toBe(404);
  });

  it('permissions can be narrowed or widened per role and action, never beyond viewing, and never for the owner', async () => {
    const owner = await signup('Perm Owner');
    const staff = await signup('Perm Staff');
    const ws = await createWs(owner, 'business');
    await joinWs(owner, ws, staff, 'contributor');
    expect((await owner.req('PUT', fin(ws, '/permissions/owner'), { banking: { view: 'none' } })).status).toBe(400);
    await owner.json('PUT', fin(ws, '/permissions/contributor'), { banking: { view: 'all', edit: 'all', approve: true }, reports: { view: true } });
    let me = await staff.json('GET', fin(ws));
    expect(me.perms.banking).toMatchObject({ view: 'all', edit: 'all', approve: true });
    expect(me.perms.reports.view).toBe(true);
    await owner.json('PUT', fin(ws, '/permissions/contributor'), { banking: { view: 'own', edit: 'all', delete: 'all' } });
    me = await staff.json('GET', fin(ws));
    expect(me.perms.banking).toMatchObject({ view: 'own', edit: 'own', delete: 'own' });
    expect((await staff.req('PUT', fin(ws, '/permissions/contributor'), { banking: { view: 'all' } })).status).toBe(403);
    expect((await owner.req('PUT', fin(ws, '/permissions/contributor'), { banking: { view: true } })).status).toBe(400);
  });

  it('a personal workspace is private to its owner until they invite someone; household contributors see everything', async () => {
    const me = await signup('Private Person');
    const partner = await signup('Partner');
    const personal = await createWs(me, 'personal');
    expect((await partner.req('GET', fin(personal))).status).toBe(404);
    const home = await createWs(me, 'household');
    await joinWs(me, home, partner, 'contributor');
    const acc = await accounts(me, home);
    const t = await me.json('POST', fin(home, '/transactions'), { kind: 'spend', accountId: byCode(acc, '1000'), date: '2026-11-03', lines: [{ accountId: byCode(acc, '5001'), amount: 18250 }] });
    expect(t.status).toBe('posted');
    const seen = await partner.json('GET', fin(home, '/transactions'));
    expect(seen.rows.map((r: any) => r.id)).toEqual([t.id]);
    expect((await partner.json('GET', fin(home))).perms.reports.view).toBe(true);
    // The partner adds their own spending, posted straight away (no approvals at home), and cannot change mine.
    const mine = await partner.json('POST', fin(home, '/transactions'), { kind: 'spend', accountId: byCode(acc, '1000'), date: '2026-11-04', personId: partner.userId, lines: [{ accountId: byCode(acc, '5301'), amount: 6000 }] });
    expect(mine.status).toBe('posted');
    expect((await partner.req('PATCH', fin(home, `/transactions/${t.id}`), { description: 'changed' })).status).toBe(403);
    // Individual and combined views.
    const pl = await me.json('GET', `${fin(home, '/reports/profit_loss')}?from=2026-11-01&to=2026-11-30&person=${partner.userId}`);
    expect(pl.summary.expenses).toBe(6000);
    const all = await me.json('GET', `${fin(home, '/reports/profit_loss')}?from=2026-11-01&to=2026-11-30`);
    expect(all.summary.expenses).toBe(24250);
  });
});

describe('the /finance address', () => {
  it('serves the API and pages under /finance with its own title; a page without a cookie goes through /tasks once', async () => {
    const email = uniqueEmail('finmount');
    const res = await raw('POST', '/finance/api/auth/signup', { body: { email, name: 'Fin Mount', password: PASSWORD } });
    expect(res.status).toBe(201);
    const cookies = res.headers.getSetCookie().filter((c) => c.startsWith('workos_sid='));
    expect(cookies.map((c) => /;\s*path=([^;]+)/i.exec(c)?.[1])).toEqual(['/finance', '/tasks', '/crm', '/company']);
    const cookie = cookies[0].split(';')[0];
    const csrf = ((await res.json()) as any).csrfToken;
    expect((await raw('POST', '/finance/api/fin/orgs', { body: { name: 'Mounted books', kind: 'personal' }, cookie, csrf })).status).toBe(201);
    const page = await raw('GET', '/finance/o/x/dashboard', { cookie, headers: { Accept: 'text/html' } });
    expect(page.status).toBe(200);
    const html = await page.text();
    expect(html).toContain('<base href="/finance/">');
    expect(html).toContain('<title>BIZOMAT Finance</title>');
    // Without a cookie: through /tasks, where a Project Management session carries over.
    const anon = await raw('GET', '/finance/o/abc/transactions?q=rent', { headers: { Accept: 'text/html' } });
    expect(anon.status).toBe(302);
    const carry = anon.headers.get('Location')!;
    expect(carry).toBe(`/tasks/api/app-carry?to=${encodeURIComponent('/finance/o/abc/transactions?q=rent')}`);
    const pm = await raw('POST', '/tasks/api/auth/signup', { body: { email: uniqueEmail('fincarry'), name: 'Fin Carry', password: PASSWORD } });
    const tasksCookie = pm.headers.getSetCookie().find((c) => /path=\/tasks/i.test(c))!.split(';')[0];
    const carried = await raw('GET', carry, { cookie: tasksCookie });
    expect(carried.headers.get('Location')).toBe('/finance/o/abc/transactions?q=rent');
    const set = carried.headers.getSetCookie();
    expect(set.some((c) => c.startsWith('workos_sid=') && /path=\/finance(;|$)/i.test(c))).toBe(true);
    expect(set.some((c) => c.startsWith('fin_carry=1'))).toBe(true);
    // Not signed in: Finance's sign-in page; the marker stops a loop; the carry only ever leads into Finance.
    expect((await raw('GET', carry)).headers.get('Location')).toBe(`/finance/login?next=${encodeURIComponent('/o/abc/transactions?q=rent')}`);
    const again = await raw('GET', '/finance/o/abc', { headers: { Accept: 'text/html', Cookie: 'fin_carry=1' } });
    expect(again.headers.get('Location')).toBe(`/finance/login?next=${encodeURIComponent('/o/abc')}`);
    for (const to of ['//evil.example.com/x', 'https://evil.example.com/finance/', '/finance\\evil']) {
      const loc = (await raw('GET', `/tasks/api/app-carry?to=${encodeURIComponent(to)}`, { cookie: tasksCookie })).headers.get('Location')!;
      expect(loc.startsWith('/') && !loc.startsWith('//') && !loc.includes('evil.example')).toBe(true);
    }
    // The invitation page is public under /finance.
    expect((await raw('GET', '/finance/join/abcdefghijklmnopqrstuvwxyz', { headers: { Accept: 'text/html' } })).status).toBe(200);
  });
});
