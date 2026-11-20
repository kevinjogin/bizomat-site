// CAD Automation inside the ERP (owner's brief and approved audit of 19 Nov 2026; docs/cad/README.md). A stand-in for
// CAD Automation's engine answers the ERP's calls and checks that each carries a valid assertion, signed by the key the
// ERP publishes, bound to the request, for the right person, company and permissions.
import { SELF, createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import worker from '../src/worker/index';
import { ORIGIN, randomIp, signup, uniqueEmail, type Client } from './helpers';
import { abnValid } from '../src/worker/company/verify';

const CAD = 'http://cad.test';
const cadEnv = { ...env, CAD_URL: CAD } as typeof env;
const CAD_AUTH = `Basic ${btoa('cad:test-cad-status-secret')}`;
const PDF = new TextEncoder().encode('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n');

function newAbn(): string {
  for (;;) {
    const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
    if (abnValid(n)) return n;
  }
}

const b64uDecode = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)), (ch) => ch.charCodeAt(0));
const hex = async (b: Uint8Array) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', b)), (x) => x.toString(16).padStart(2, '0')).join('');

/** What the stand-in saw and answers. */
const seen: { op: string; claims: any }[] = [];
const answers: Record<string, (claims: any, body: any) => unknown> = {};
let publicKey: CryptoKey | null = null;

async function verify(req: Request, op: string): Promise<any> {
  const auth = req.headers.get('Authorization') ?? '';
  expect(auth.startsWith('BIZOMAT-ERP ')).toBe(true);
  const [h, p, s] = auth.slice(12).split('.');
  const header = JSON.parse(new TextDecoder().decode(b64uDecode(h)));
  expect(header.alg).toBe('ES256');
  if (!publicKey) {
    const jwks = (await (await SELF.fetch(`${ORIGIN}/api/id/jwks`)).json()) as any;
    const k = jwks.keys.find((x: any) => x.kid === header.kid);
    expect(k).toBeTruthy();
    publicKey = await crypto.subtle.importKey('jwk', k, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
  }
  const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, publicKey, b64uDecode(s), new TextEncoder().encode(`${h}.${p}`));
  expect(ok).toBe(true);
  const claims = JSON.parse(new TextDecoder().decode(b64uDecode(p)));
  const body = req.method === 'POST' ? await req.clone().text() : '';
  expect(claims.aud).toBe('cad');
  expect(claims.htm).toBe(req.method);
  expect(claims.htu).toBe(new URL(req.url).pathname);
  const bh = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  expect(claims.bh).toBe(bh);
  expect(claims.exp - claims.iat).toBeLessThanOrEqual(60);
  seen.push({ op, claims });
  return claims;
}

const realFetch = globalThis.fetch;
beforeAll(() => {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: any, init?: any) => {
    const req = input instanceof Request ? input : new Request(String(input), init);
    const url = new URL(req.url);
    if (url.origin !== CAD) return realFetch(input, init);
    const op = url.pathname.replace('/api/erp/v1/', '');
    const claims = await verify(req, op);
    if (/^exports\/[^/]+\/file$/.test(op)) {
      return new Response(PDF, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename*=UTF-8''Bracket%20drawing.pdf`, 'X-Sha256': await hex(PDF), 'Content-Length': String(PDF.byteLength) } });
    }
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const make = answers[op];
    if (!make) return new Response(JSON.stringify({ error: { code: 'NOT_FOUND', message: `No ${op} in the stand-in` } }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    const out = make(claims, body);
    if (out instanceof Response) return out;
    return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
  });
});
afterAll(() => vi.restoreAllMocks());

/** A request to the ERP with CAD_URL set (the stand-in), as a signed-in person. */
async function call(c: Client, method: string, path: string, body?: unknown) {
  const h: Record<string, string> = { Origin: ORIGIN, 'CF-Connecting-IP': randomIp(), Accept: 'application/json', Cookie: c.cookie, 'X-CSRF-Token': c.csrf };
  if (body !== undefined) h['Content-Type'] = 'application/json';
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' }), cadEnv, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}
const okJson = async (res: Response) => {
  const t = await res.text();
  if (res.status >= 400) throw new Error(`${res.status}: ${t}`);
  return JSON.parse(t);
};

const flag = (key: string, scope: 'global' | 'company', scopeId = '', value = 'on') =>
  env.DB.prepare('INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1)').bind(key, scope, scopeId, value, 'test', 'test').run();

async function company(owner: Client, name: string) {
  const res = await owner.req('POST', '/api/company/companies', { kind: 'business', name, legalName: '', abn: newAbn(), acn: '', email: uniqueEmail('accounts'), phone: '(02) 9876 5432', addressLine1: '12 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
  expect(res.status).toBe(201);
  return ((await res.json()) as any).company.id as string;
}

async function join(owner: Client, co: string, p: Client, role: 'manager' | 'employee' | 'read_only') {
  const inv = await owner.json('POST', `/api/company/c/${co}/invitations`, { email: p.email, role: 'member', tasksRole: 'member', crmRole: null, finRole: null });
  await p.json('POST', `/api/company/invitations/${decodeURIComponent(inv.url.split('/join/')[1])}/accept`, {});
  await env.DB.prepare('UPDATE co_members SET role = ? WHERE company_id = ? AND user_id = ?').bind(role, co, p.userId).run();
}

answers.state = (claims) => ({ computers: [], assistants: [], commands: [], exports: [{ id: 'exp-1', name: 'Bracket drawing.pdf', format: 'pdf', size: PDF.byteLength, owner: { sub: claims.sub } }], connector: { url: 'https://bizomat.ai/cad/mcp' }, tools: [] });

describe('CAD Automation in the ERP', () => {
  it('lists the companies where it is on, and answers what a person may do without asking CAD Automation', async () => {
    const owner = await signup('Cad Lister');
    const a = await company(owner, 'Cad List A Pty');
    const b = await company(owner, 'Cad List B Pty');
    expect((await okJson(await call(owner, 'GET', '/api/erp/cad/companies'))).companies).toEqual([]);
    await flag('cad_in_erp', 'company', a);
    const list = (await okJson(await call(owner, 'GET', '/api/erp/cad/companies'))).companies;
    expect(list.map((x: any) => x.id)).toEqual([a]);
    expect(list[0]).toMatchObject({ name: 'Cad List A Pty', kind: 'registered', operate: true });
    const before = seen.length;
    const f = await okJson(await call(owner, 'GET', `/api/erp/c/${a}/cad?part=flags`));
    expect(f.cad).toBeUndefined();
    expect(f.perms.operate).toBe('all');
    expect(seen.length).toBe(before);
    expect((await call(owner, 'GET', `/api/erp/c/${b}/cad?part=flags`)).status).toBe(403);
    // review tasks say they are off until their own flag is on
    expect(await okJson(await call(owner, 'GET', `/api/erp/c/${a}/cad/review-boards`))).toEqual({ enabled: false, boards: [] });
  });

  it('stays off until the flag is on for the company, and never opens in the example company or another company', async () => {
    const owner = await signup('Cad Owner');
    const co = await company(owner, 'Cad Off Pty');
    const off = await call(owner, 'GET', `/api/erp/c/${co}/cad`);
    expect(off.status).toBe(403);
    expect(((await off.json()) as any).details.code).toBe('CAD_NOT_ENABLED');
    await flag('cad_in_erp', 'company', co);
    const on = await okJson(await call(owner, 'GET', `/api/erp/c/${co}/cad`));
    expect(on.cad.connected).toBe(true);
    expect(on.perms).toMatchObject({ view: true, operate: 'all', export: true, manage: true, delete: true, scope: 'all' });
    expect(on.flags).toEqual({ products: false, bom: false, manufacturing: false, quality: false, projects: false });
    // Without CAD_URL (staging, tests): the module says so instead of failing.
    const plain = await owner.json('GET', `/api/erp/c/${co}/cad`);
    expect(plain.cad).toEqual({ connected: false, reason: expect.stringContaining('not connected') });
    // Another company's person sees nothing of this one (404, its existence is not revealed).
    const stranger = await signup('Cad Stranger');
    expect((await call(stranger, 'GET', `/api/erp/c/${co}/cad`)).status).toBe(404);
    // The assertion named this person and this company only.
    const last = seen.filter((s) => s.op === 'state').at(-1)!;
    expect(last.claims).toMatchObject({ sub: owner.userId, co: { id: co, kind: 'registered' }, iss: 'bizomat-erp' });
  });

  it('gives each company role the brief’s permissions, with downloads a company setting', async () => {
    const owner = await signup('Matrix Owner');
    const co = await company(owner, 'Matrix Pty');
    await flag('cad_in_erp', 'company', co);
    const manager = await signup('Matrix Manager');
    const employee = await signup('Matrix Employee');
    const reader = await signup('Matrix Reader');
    await join(owner, co, manager, 'manager');
    await join(owner, co, employee, 'employee');
    await join(owner, co, reader, 'read_only');
    const perms = async (c: Client) => (await okJson(await call(c, 'GET', `/api/erp/c/${co}/cad`))).perms;
    expect(await perms(manager)).toMatchObject({ operate: 'all', export: true, manage: true, delete: false, scope: 'all' });
    expect(await perms(employee)).toMatchObject({ operate: 'own', export: false, manage: false, delete: false, scope: 'own' });
    expect(await perms(reader)).toMatchObject({ operate: false, export: false, manage: false, delete: false });
    // Downloads: refused to the employee and recorded for the owner, every time.
    const refused = await call(employee, 'GET', `/api/erp/c/${co}/cad/exports/exp-1/file`);
    expect(refused.status).toBe(403);
    expect(((await refused.json()) as any).details.code).toBe('CAD_EXPORT_FORBIDDEN');
    const file = await call(owner, 'GET', `/api/erp/c/${co}/cad/exports/exp-1/file`);
    expect(file.status).toBe(200);
    expect(file.headers.get('Content-Disposition')).toContain('Bracket%20drawing.pdf');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(PDF);
    const logged = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_events WHERE company_id = ? AND action = 'cad.export_downloaded' AND actor_id = ?").bind(co, owner.userId).first<{ n: number }>();
    expect(logged?.n).toBe(1);
    // Only the owner and administrators change the setting; then employees may download.
    expect((await call(manager, 'PUT', `/api/erp/c/${co}/cad/settings`, { download: { manager: true, employee: true } })).status).toBe(403);
    await okJson(await call(owner, 'PUT', `/api/erp/c/${co}/cad/settings`, { download: { manager: false, employee: true } }));
    expect((await perms(employee)).export).toBe(true);
    expect((await perms(manager)).export).toBe(false);
    // Read-only members cannot pair a computer.
    expect((await call(reader, 'POST', `/api/erp/c/${co}/cad/pairing/ABCD-1234`, {})).status).toBe(403);
  });

  it('applies the central permission service when company members is on: module access and scope', async () => {
    const owner = await signup('Members Owner');
    const co = await company(owner, 'Members Cad Pty');
    await flag('cad_in_erp', 'company', co);
    await flag('company_members_v2', 'company', co);
    const manager = await signup('Members Manager');
    await join(owner, co, manager, 'manager');
    await env.DB.prepare("INSERT OR REPLACE INTO co_member_access (company_id, user_id, module, access, scope, updated_at) VALUES (?, ?, 'cad', 0, 'all', 1)").bind(co, manager.userId).run();
    const r = await call(manager, 'GET', `/api/erp/c/${co}/cad`);
    expect(r.status).toBe(403);
    expect(((await r.json()) as any).details.code).toBe('MODULE_ACCESS');
    await env.DB.prepare("UPDATE co_member_access SET access = 1, scope = 'own' WHERE company_id = ? AND user_id = ? AND module = 'cad'").bind(co, manager.userId).run();
    const p = (await okJson(await call(manager, 'GET', `/api/erp/c/${co}/cad`))).perms;
    expect(p.scope).toBe('own');
    expect(p.operate).toBe('own');
  });

  it('saves an export on a product revision with where it came from, only where that part is on', async () => {
    const owner = await signup('Save Owner');
    const co = await company(owner, 'Save Pty');
    await flag('cad_in_erp', 'company', co);
    const prod = await owner.json('POST', `/api/erp/c/${co}/products`, { type: 'component', number: 'BR-100', name: 'Bracket' });
    const rev = (await owner.json('GET', `/api/erp/c/${co}/products/${prod.id}`)).revisions[0];
    const off = await call(owner, 'POST', `/api/erp/c/${co}/cad/exports/exp-1/save`, { productId: prod.id, revisionId: rev.id });
    expect(off.status).toBe(403);
    await flag('cad_products', 'company', co);
    const doc = await okJson(await call(owner, 'POST', `/api/erp/c/${co}/cad/exports/exp-1/save?command=cmd-9`, { productId: prod.id, revisionId: rev.id }));
    expect(doc).toMatchObject({ kind: 'drawing', status: 'draft', productId: prod.id, revisionId: rev.id, title: 'Bracket drawing' });
    const src = await okJson(await call(owner, 'GET', `/api/erp/c/${co}/cad/sources?productId=${prod.id}`));
    expect(src.sources[0]).toMatchObject({ documentId: doc.id, exportId: 'exp-1', commandId: 'cmd-9', format: 'pdf', sha256: await hex(PDF) });
  });

  it('proposes a bill of materials from an assembly and applies it to a draft revision only', async () => {
    const owner = await signup('Bom Owner');
    const co = await company(owner, 'Bom Pty');
    await flag('cad_in_erp', 'company', co);
    await flag('cad_bom', 'company', co);
    const frame = await owner.json('POST', `/api/erp/c/${co}/products`, { type: 'assembly', number: 'FR-1', name: 'Frame' });
    const bracket = await owner.json('POST', `/api/erp/c/${co}/products`, { type: 'component', number: 'BR-100', name: 'Bracket' });
    const rev = (await owner.json('GET', `/api/erp/c/${co}/products/${frame.id}`)).revisions[0];
    answers['commands/get'] = () => ({
      command: {
        id: 'cmd-1',
        status: 'succeeded',
        tool: 'Read a document',
        result: {
          kind: 'assembly',
          title: 'Frame.SLDASM',
          components: [
            { name: 'BR-100-1', file: 'C:\\Parts\\BR-100.SLDPRT' },
            { name: 'BR-100-2', file: 'C:\\Parts\\BR-100.SLDPRT' },
            { name: 'M6-1', file: 'C:\\Parts\\M6 bolt.SLDPRT' },
            { name: 'Old-1', file: 'C:\\Parts\\Old.SLDPRT', suppressed: true },
          ],
        },
      },
    });
    const p = await okJson(await call(owner, 'POST', `/api/erp/c/${co}/cad/bom-proposals`, { commandId: 'cmd-1', revisionId: rev.id }));
    expect(p.lines).toEqual([
      { name: 'BR-100', file: 'C:\\Parts\\BR-100.SLDPRT', quantity: 2, productId: bracket.id, productNumber: 'BR-100' },
      { name: 'M6 bolt', file: 'C:\\Parts\\M6 bolt.SLDPRT', quantity: 1, productId: null, productNumber: null },
    ]);
    const applied = await okJson(await call(owner, 'POST', `/api/erp/c/${co}/cad/bom-proposals/${p.id}/apply`, {}));
    expect(applied).toMatchObject({ added: 1, changed: 0 });
    expect(applied.skipped[0]).toContain('M6 bolt');
    const detail = await owner.json('GET', `/api/erp/c/${co}/revisions/${rev.id}`);
    expect(detail.lines.map((l: any) => [l.componentId, l.quantity])).toEqual([[bracket.id, 2]]);
    // Applied once only.
    expect((await call(owner, 'POST', `/api/erp/c/${co}/cad/bom-proposals/${p.id}/apply`, {})).status).toBe(409);
    // A released revision is never changed by a proposal.
    await env.DB.prepare("UPDATE erp_revisions SET status = 'released' WHERE company_id = ? AND id = ?").bind(co, rev.id).run();
    const refused = await call(owner, 'POST', `/api/erp/c/${co}/cad/bom-proposals`, { commandId: 'cmd-1', revisionId: rev.id });
    expect(refused.status).toBe(409);
  });

  it('maps CAD Automation’s accounts by BIZOMAT id or confirmed email, places them, and keeps an admin’s decision', async () => {
    const solo = await signup('Sync Solo');
    const soloCo = await company(solo, 'Sync Solo Pty');
    await flag('cad_in_erp', 'company', soloCo);
    const both = await signup('Sync Both');
    await company(both, 'Sync One Pty');
    await company(both, 'Sync Two Pty');
    await env.DB.prepare('UPDATE users SET email_verified_at = 1 WHERE id IN (?, ?)').bind(solo.userId, both.userId).run();
    const sync = (body: unknown, auth = CAD_AUTH) => SELF.fetch(`${ORIGIN}/api/id/cad-sync`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: auth }, body: JSON.stringify(body) });
    expect((await sync({ accounts: [] }, `Basic ${btoa('cad:wrong')}`)).status).toBe(401);
    const res = await sync({
      accounts: [
        { id: 'c-solo', email: 'someone@else.example', emailVerified: false, sub: solo.userId, counts: { computers: 2, commands: 5, grants: 1 }, unassigned: { computers: 2, commands: 5, grants: 1 } },
        { id: 'c-both', email: both.email, emailVerified: true, sub: null },
        { id: 'c-nobody', email: 'nobody@example.com', emailVerified: false, sub: null },
      ],
      runs: [
        { id: 'run-1', account: 'c-solo', company: soloCo, tool: 'Add features', status: 'failed', at: Date.now(), seconds: 12, error: 'Rebuild error' },
        { id: 'run-1', account: 'c-solo', company: soloCo, tool: 'Add features', status: 'failed', at: Date.now(), seconds: 12 },
      ],
      worker: { version: 'test', lanes: 3 },
      checksums: { devices: 'a'.repeat(64) },
    });
    expect(res.status).toBe(200);
    const a = (await res.json()) as any;
    expect(a.accounts['c-solo']).toMatchObject({ userId: solo.userId, default: soloCo, review: false, companies: [{ id: soloCo, name: 'Sync Solo Pty' }] });
    expect(a.accounts['c-both']).toMatchObject({ userId: both.userId, default: null, review: true, companies: [] });
    expect(a.accounts['c-nobody']).toMatchObject({ userId: null, review: true });
    expect(a.limits[soloCo]).toEqual({ concurrent: 5, commandSeconds: 600, uploadMb: 32, storageMb: 128 });
    expect(a.redirect).toBe(false);
    // The failed run: one history line and one notice, once.
    const ev = await env.DB.prepare("SELECT COUNT(*) AS n FROM erp_events WHERE company_id = ? AND action = 'cad.run'").bind(soloCo).first<{ n: number }>();
    expect(ev?.n).toBe(1);
    const notice = await env.DB.prepare("SELECT title, link FROM co_member_notices WHERE user_id = ? AND kind = 'cad.run_failed'").bind(solo.userId).all<any>();
    expect(notice.results).toHaveLength(1);
    expect(notice.results[0].link).toContain(`/erp/c/${soloCo}/cad/history?command=run-1`);
    // A platform admin's decision for the review list is kept over later syncs.
    const two = (await env.DB.prepare('SELECT id FROM co_companies WHERE name = ?').bind('Sync Two Pty').first<{ id: string }>())!.id;
    await env.DB.prepare("UPDATE cad_accounts SET user_id = ?, company_id = ?, status = 'mapped', assigned_by = ?, assigned_at = 1 WHERE cad_account_id = 'c-both'").bind(both.userId, two, solo.userId).run();
    await flag('cad_in_erp', 'company', two);
    const again = (await (await sync({ accounts: [{ id: 'c-both', email: both.email, emailVerified: true, sub: null }] })).json()) as any;
    expect(again.accounts['c-both']).toMatchObject({ default: two, review: false });
    const row = await env.DB.prepare("SELECT status, company_id FROM cad_accounts WHERE cad_account_id = 'c-both'").first<any>();
    expect(row).toMatchObject({ status: 'mapped', company_id: two });
  });

  it('shows a manufacturing order the approved drawings of the revision it builds, only where that part is on', async () => {
    const owner = await signup('Mo Owner');
    const co = await company(owner, 'Mo Pty');
    await flag('cad_in_erp', 'company', co);
    const prod = await owner.json('POST', `/api/erp/c/${co}/products`, { type: 'assembly', number: 'AS-1', name: 'Assembly' });
    const rev = (await owner.json('GET', `/api/erp/c/${co}/products/${prod.id}`)).revisions[0];
    const t = Date.now();
    await env.DB.batch([
      env.DB.prepare("INSERT INTO erp_documents (id, company_id, number, product_id, revision_id, title, kind, status, created_at, updated_at) VALUES ('doc-a', ?, 'DOC-A', ?, ?, 'Assembly drawing', 'drawing', 'approved', ?, ?)").bind(co, prod.id, rev.id, t, t),
      env.DB.prepare("INSERT INTO erp_document_versions (id, company_id, document_id, version, source, file_name, mime, size, r2_key, created_at) VALUES ('ver-a', ?, 'doc-a', 1, 'file', 'AS-1.pdf', 'application/pdf', 10, 'erp/x/documents/doc-a/ver-a', ?)").bind(co, t),
      env.DB.prepare("INSERT INTO erp_documents (id, company_id, number, product_id, revision_id, title, kind, status, created_at, updated_at) VALUES ('doc-b', ?, 'DOC-B', ?, ?, 'Draft drawing', 'drawing', 'draft', ?, ?)").bind(co, prod.id, rev.id, t, t),
      env.DB.prepare("INSERT INTO erp_document_versions (id, company_id, document_id, version, source, file_name, mime, size, r2_key, created_at) VALUES ('ver-b', ?, 'doc-b', 1, 'file', 'draft.pdf', 'application/pdf', 10, 'erp/x/documents/doc-b/ver-b', ?)").bind(co, t),
    ]);
    const { drawingsOf } = await import('../src/worker/cad/drawings');
    const list = await drawingsOf(env.DB, co, rev.id);
    expect(list.map((d) => d.number)).toEqual(['DOC-A']);
    // Another company's revision gives nothing.
    expect(await drawingsOf(env.DB, 'another-company', rev.id)).toEqual([]);
  });
});
