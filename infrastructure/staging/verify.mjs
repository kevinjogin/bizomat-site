#!/usr/bin/env node
// Staging verification (docs/deployment/staging.md, "Verifying a release"): a tester's walk through bizomat-staging, through
// the gate, in a real browser. Run by .github/workflows/bizomat-staging.yml (action verify), never against production: it refuses
// any address that is not a *-staging app, signs up invented accounts and registers an invented company.
//
//   node infrastructure/staging/verify.mjs off     the release with every flag off: pages, ERP modules, no new UI
//   node infrastructure/staging/verify.mjs on      new_ui_enabled and company_members_v2 on (switched by the workflow)
//   node infrastructure/staging/verify.mjs reset   after the workflow switched them off again: the old look is back
//
// Settings: STAGING_URL, GATE_PW (the gate's password; never printed), PW_DIR (where playwright is installed),
// VERIFY_STATE (a private file that carries the tester between phases). Prints ok/FAILED lines; exits 1 on a failure.
import { createRequire } from 'node:module';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { request as httpsRequest } from 'node:https';
import { request as httpRequest } from 'node:http';
import { brotliDecompressSync } from 'node:zlib';
import { randomBytes } from 'node:crypto';

const phase = process.argv[2];
const BASE = (process.env.STAGING_URL ?? '').replace(/\/$/, '');
const PW = process.env.GATE_PW ?? '';
if (!['off', 'on', 'reset'].includes(phase)) throw new Error('phase: off, on or reset');
// VERIFY_LOCAL=1 lets the script itself be tried against a local stack (http://127.0.0.1:<port>), nothing else.
const local = process.env.VERIFY_LOCAL === '1' && /^http:\/\/127\.0\.0\.1:\d+$/.test(BASE);
if (!local && !/^https:\/\/[a-z0-9-]+-staging\.fly\.dev$/.test(BASE)) throw new Error('STAGING_URL must be a *-staging.fly.dev address');
if (!PW) throw new Error('GATE_PW is not set');
const { chromium } = createRequire(`${process.env.PW_DIR ?? process.cwd()}/`)('playwright');
const STATE = process.env.VERIFY_STATE ?? '/tmp/bizomat-verify.json';
const summary = process.env.GITHUB_STEP_SUMMARY;
let failures = 0;
const say = (line) => {
  console.log(line);
  if (summary) appendFileSync(summary, `${line}\n`);
};
const ok = (what) => say(`- ok: ${what}`);
const bad = (what) => {
  failures++;
  say(`- FAILED: ${what}`);
};
const check = (cond, what) => (cond ? ok(what) : bad(what));
const newUi = phase === 'on';
say(`\n### Staging verification: ${phase === 'off' ? 'every flag off' : phase === 'on' ? 'new_ui_enabled and company_members_v2 on' : 'flags off again'}\n`);

// ------------------------------------------------------------------ the website, as the server sends it
/** A page with a browser's Accept-Encoding, decoded here (fetch would decode on its own and hide a broken body). */
function rawPage(path) {
  return new Promise((done, fail) => {
    const req = (local ? httpRequest : httpsRequest)(`${BASE}${path}`, { headers: { 'Accept-Encoding': 'br', Authorization: `Basic ${Buffer.from(`review:${PW}`).toString('base64')}` } }, (res) => {
      const parts = [];
      res.on('data', (c) => parts.push(c));
      res.on('end', () => {
        const body = Buffer.concat(parts);
        let text = '';
        try {
          text = res.headers['content-encoding'] === 'br' ? brotliDecompressSync(body).toString('utf8') : body.toString('utf8');
        } catch {
          text = '';
        }
        done({ status: res.statusCode, headers: res.headers, text });
      });
    });
    req.on('error', fail);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
    req.end();
  });
}
const marked = (html) => /<html\b[^>]*\bdata-ui="new"/i.test(html);

// The website's server reads the flag every minute: wait for it to follow (up to 150 s).
if (phase !== 'off') {
  let seen = null;
  for (let i = 0; i < 30; i++) {
    const r = await rawPage('/');
    seen = r.status === 200 && marked(r.text);
    if (seen === newUi) break;
    await new Promise((s) => setTimeout(s, 5000));
  }
  check(seen === newUi, `the website follows the flag within 150 s (${newUi ? 'new UI' : 'old look'})`);
}

const SITE = ['/', '/systems/', '/systems/erp/', '/systems/erp/guide/', '/systems/crm/', '/systems/crm/guide/', '/systems/finance/', '/systems/finance/guide/',
  '/systems/projects/', '/systems/projects/guide/', '/systems/engineering/', '/systems/engineering/guide/', '/systems/manufacturing/',
  '/systems/manufacturing/guide/', '/resources/', '/tools/', '/tools/abbe-error/', '/reados/', '/engine-room/', '/privacy/', '/terms/', '/disclaimer/',
  '/contact/', '/assessment/'];
for (const path of SITE) {
  const r = await rawPage(path);
  const html = r.status === 200 && /<html\b/i.test(r.text);
  check(html && marked(r.text) === newUi, `${path}: 200, decodes, ${newUi ? 'marked for the new UI' : 'not marked'}`);
}
for (const [from, to] of [['/about/', '/engine-room/'], ['/system-preview/', '/systems/erp/'], ['/work/', '/systems/'], ['/pricing/', '/systems/']]) {
  const r = await rawPage(from);
  check(r.status === 301 && String(r.headers.location ?? '').includes(to), `${from} answers 301 to ${to}`);
}

// ------------------------------------------------------------------ in a browser
const browser = await chromium.launch();
const problems = [];
const watch = (page, name) => {
  page.on('pageerror', (e) => problems.push(`${name}: ${e.message.slice(0, 160)}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/(401|403|404|Failed to load resource)/.test(m.text())) problems.push(`${name}: ${m.text().slice(0, 160)}`);
  });
};
const httpCredentials = { username: 'review', password: PW };
const site = await browser.newContext({ httpCredentials, viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
const sp = await site.newPage();
watch(sp, 'website');
for (const path of ['/', '/systems/erp/', '/tools/', '/privacy/']) {
  await sp.goto(BASE + path, { waitUntil: 'networkidle' });
  const ui = await sp.evaluate(() => document.documentElement?.dataset?.ui ?? '');
  check((ui === 'new') === newUi, `browser ${path}: data-ui ${ui || 'absent'}`);
  if (newUi && path === '/systems/erp/') {
    const h = await sp.evaluate(() => {
      const b = document.querySelector('main .button');
      return b ? Math.round(b.getBoundingClientRect().height) : 0;
    });
    check(h >= 40 && h <= 48, `a call to action is 40 to 48 px high under the new UI (${h})`);
  }
}
await site.close();

// The tester: made in the first phase, signed in again later.
let tester;
if (phase === 'off' || !existsSync(STATE)) {
  tester = { email: `verify-${Date.now()}-${randomBytes(3).toString('hex')}@example.com`, password: `${randomBytes(12).toString('base64url')}-Aa1!` };
  writeFileSync(STATE, JSON.stringify(tester), { mode: 0o600 });
} else tester = JSON.parse(readFileSync(STATE, 'utf8'));

const ctx = await browser.newContext({ httpCredentials, viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
watch(p, 'erp');
if (phase === 'off' || !tester.signedUp) {
  await p.goto(`${BASE}/erp/signup`, { waitUntil: 'networkidle' });
  await p.fill('#name', 'Vera Verify');
  await p.fill('#email', tester.email);
  await p.fill('#password', tester.password);
  await p.click('button.btn.primary');
  await p.waitForTimeout(2500);
  tester.signedUp = true;
  writeFileSync(STATE, JSON.stringify(tester), { mode: 0o600 });
} else {
  await p.goto(`${BASE}/erp/login`, { waitUntil: 'networkidle' });
  await p.fill('#email', tester.email);
  await p.fill('#password', tester.password);
  await p.click('button.btn.primary');
  await p.waitForTimeout(2500);
}
// API calls run inside the page, with the page's own cookies, as the app's code makes them.
const call = (method, path, body, csrf = '') =>
  p.evaluate(
    async ([m, url, b, token]) => {
      const r = await fetch(url, { method: m, credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(token ? { 'X-CSRF-Token': token } : {}) }, body: b == null ? undefined : JSON.stringify(b) });
      let j = null;
      try {
        j = await r.json();
      } catch {
        j = null;
      }
      return { status: r.status, body: j };
    },
    [method, `${BASE}/erp/api${path}`, body ?? null, csrf],
  );
const meRes = await call('GET', '/auth/me');
check(meRes.status === 200, `signed in to BIZOMAT ERP (${meRes.status})`);
const me = meRes.body ?? {};
check(Boolean(me.ui) && me.ui.newUi === newUi, `the account's UI setting says new UI ${newUi ? 'on' : 'off'}`);
const csrf = me.csrfToken ?? '';
const api = (method, path, body) => call(method, path, body, csrf);

// The example company is made on the first ERP visit.
await p.goto(`${BASE}/erp/`, { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
const sys = await api('GET', '/system/me');
/** The id of the object named "Acme Studio (example)" anywhere in the answer. */
const findExample = (o) => {
  if (!o || typeof o !== 'object') return null;
  const id = o.id ?? o.companyId;
  if (o.name === 'Acme Studio (example)' && typeof id === 'string') return id;
  for (const v of Object.values(o)) {
    const r = findExample(v);
    if (r) return r;
  }
  return null;
};
const example = findExample(sys.body);
check(Boolean(example), 'the example company is there');
const pages = [['dashboard', '/erp/'], ['my work', '/erp/my-work'], ['reports', '/erp/reports'], ['administration', '/erp/administration']];
if (example) {
  for (const m of ['home', 'products', 'procurement', 'inventory', 'manufacturing', 'quality', 'supply-chain', 'maintenance', 'whs', 'settings']) pages.push([m, `/erp/c/${example}/${m}`]);
  await p.goto(`${BASE}/erp/c/${example}/home`, { waitUntil: 'networkidle' });
  const links = await p.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const tool of ['tasks', 'crm', 'finance']) {
    const href = links.find((h) => h && h.startsWith(`/erp/${tool}/`));
    if (href) pages.push([tool, href]);
    else bad(`a link to ${tool} from the example company`);
  }
}
for (const [name, path] of pages) {
  const before = problems.length;
  const r = await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const state = await p.evaluate(() => ({ ui: document.documentElement?.dataset?.ui ?? '', main: Boolean(document.querySelector('main, #main, .page')), h1: document.querySelector('h1')?.textContent?.trim() ?? '' }));
  check(r && r.status() < 400 && state.main && (state.ui === 'new') === newUi && problems.length === before, `ERP ${name}: opens${state.h1 ? ` ("${state.h1.slice(0, 40)}")` : ''}, ${newUi ? 'new UI' : 'old look'}, no errors`);
}

// Density (new UI only): saved on the account, applied on the next page.
if (newUi) {
  const set = await api('PATCH', '/me', { preferences: { density: 'compact' } });
  await p.goto(`${BASE}/erp/`, { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => document.documentElement?.dataset?.density ?? '');
  check(set.status === 200 && d === 'compact', `Compact density is saved on the account and applied (${set.status}, ${d || 'none'})`);
  const back = await api('PATCH', '/me', { preferences: { density: 'comfortable' } });
  await p.goto(`${BASE}/erp/`, { waitUntil: 'networkidle' });
  const d2 = await p.evaluate(() => document.documentElement?.dataset?.density ?? '');
  check(back.status === 200 && d2 !== 'compact', 'Comfortable density restores the spacing');
  const btn = await p.evaluate(() => {
    const b = document.querySelector('.btn:not(.sm):not(.icon)');
    return b ? Math.round(b.getBoundingClientRect().height) : 0;
  });
  check(btn >= 32 && btn <= 48, `ERP buttons are on the control sizes (${btn} px)`);
}

// Members (company_members_v2): a registered, invented company and its Members page.
if (phase !== 'reset') {
  let cid = tester.companyId;
  if (!cid) {
    const abn = () => {
      for (;;) {
        const n = String(10 + Math.floor(Math.random() * 89)) + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
        const d = n.split('').map(Number);
        d[0] -= 1;
        const w = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        if (d.reduce((s, x, i) => s + x * w[i], 0) % 89 === 0) return n;
      }
    };
    const co = await api('POST', '/company/companies', { kind: 'business', name: `Verify Walk ${Date.now() % 100000} Pty`, legalName: '', abn: abn(), acn: '', email: `acct-${Date.now()}@example.com`, phone: '(02) 9876 5432', addressLine1: '1 Example Street', addressLine2: '', suburb: 'Sydney', state: 'NSW', postcode: '2000', website: '' });
    cid = co.body?.company?.id;
    check(co.status === 201 && Boolean(cid), `an invented company is registered (${co.status})`);
    tester.companyId = cid;
    writeFileSync(STATE, JSON.stringify(tester), { mode: 0o600 });
  }
  if (cid) {
    const before = problems.length;
    await p.goto(`${BASE}/erp/company/c/${cid}/people`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
    const tabs = await p.getByRole('tab').allTextContents();
    const hasMembers = ['Members', 'Invitations', 'Roles & Access', 'Activity'].every((t) => tabs.some((x) => x.includes(t)));
    check(hasMembers === newUi && problems.length === before, `the company's people page: ${newUi ? 'the Members page with its four tabs' : 'the page as before'}, no errors`);
    if (newUi) {
      const inv = await api('POST', `/company/c/${cid}/team/invitations`, { emails: [`invitee-${Date.now()}@example.com`], role: 'employee', message: 'Welcome' });
      check(inv.status < 300, `an invitation with a role and a message (${inv.status})`);
      const team = await api('GET', `/company/c/${cid}/team`);
      check(team.status === 200, `the Members API answers (${team.status})`);
    }
  }
}

say(problems.length ? `- browser errors: ${problems.length}` : '- ok: no browser errors');
for (const x of problems.slice(0, 20)) say(`  - ${x}`);
if (problems.length) failures++;
await browser.close();
say(failures ? `\n${failures} check(s) failed.` : '\nEvery check passed.');
process.exit(failures ? 1 : 0);
