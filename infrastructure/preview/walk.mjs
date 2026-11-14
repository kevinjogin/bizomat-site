#!/usr/bin/env node
// BIZOMAT review preview: a browser walk of a preview (the website, then signing in and every ERP module), run by
// .github/workflows/review-preview.yml before the address is shared, and usable by hand against any preview.
// Fails on a Content-Security-Policy violation, a script error, a failed page or asset, a missing H1, a request that
// leaves the preview for bizomat.ai, or a page that does not open.
//
// Usage: node infrastructure/preview/walk.mjs <preview origin> [review password]

import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const [origin, password] = process.argv.slice(2);
if (!origin) throw new Error('Usage: walk.mjs <preview origin> [review password]');
const PRODUCTION = /^https?:\/\/(www\.)?bizomat\.ai(\/|$)/i;

const SITE = ['/', '/systems/', '/systems/erp/', '/systems/erp/guide/', '/systems/crm/', '/systems/crm/guide/', '/systems/finance/', '/systems/finance/guide/', '/systems/projects/', '/systems/projects/guide/', '/systems/engineering/', '/systems/engineering/guide/', '/systems/manufacturing/', '/resources/', '/tools/', '/reados/', '/engine-room/', '/contact/', '/privacy/'];
const problems = [];
const browser = await chromium.launch();

async function context(viewport, scheme) {
  const ctx = await browser.newContext({ viewport, colorScheme: scheme, httpCredentials: password ? { username: 'review', password } : undefined });
  const page = await ctx.newPage();
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', (e) => console.error(`CSPV ${e.violatedDirective} ${e.blockedURI}`)));
  let at = '';
  page.on('console', (m) => { if (m.type() === 'error' && /CSPV/.test(m.text())) problems.push(`${at}: ${m.text().slice(0, 160)}`); });
  page.on('pageerror', (e) => problems.push(`${at}: script error ${String(e).slice(0, 160)}`));
  page.on('request', (r) => { if (PRODUCTION.test(r.url())) problems.push(`${at}: request left the preview for ${r.url()}`); });
  page.on('response', (r) => { if (r.status() >= 500 || (r.status() >= 400 && !r.url().includes('/api/'))) problems.push(`${at}: HTTP ${r.status()} ${r.url()}`); });
  return { ctx, page, set: (p) => { at = p; } };
}

let pagesOk = 0;
for (const [label, viewport, scheme] of [['desktop', { width: 1440, height: 900 }, 'light'], ['phone', { width: 390, height: 844 }, 'dark']]) {
  const { ctx, page, set } = await context(viewport, scheme);
  for (const path of SITE) {
    set(`${label} ${path}`);
    const res = await page.goto(origin + path, { waitUntil: 'networkidle' });
    if (!res || res.status() !== 200) { problems.push(`${label} ${path}: HTTP ${res?.status()}`); continue; }
    const h1 = await page.locator('h1').count();
    if (h1 !== 1) problems.push(`${label} ${path}: ${h1} H1`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) problems.push(`${label} ${path}: wider than the screen`);
    pagesOk++;
  }
  await ctx.close();
}

// Sign in from the website's own Sign in link, then every ERP module.
const { ctx, page, set } = await context({ width: 1440, height: 900 }, 'light');
set('sign in');
await page.goto(origin + '/sign-in/', { waitUntil: 'networkidle' });
const erpLink = page.locator('a[href$="/erp/login"]').first();
const href = await erpLink.getAttribute('href');
if (!href || !href.startsWith(origin)) problems.push(`sign in: the BIZOMAT ERP link points to ${href}`);
await page.goto(origin + '/erp/login', { waitUntil: 'networkidle' });
await page.getByLabel(/email/i).first().fill('demo@example.com');
await page.getByLabel(/password/i).first().fill('Granite-harbour-2026!');
await page.getByRole('button', { name: /sign in/i }).first().click();
await page.waitForURL((u) => !/\/login/.test(u.pathname), { timeout: 20000 }).catch(() => problems.push('sign in: still on the sign-in page'));
await page.waitForLoadState('networkidle');
const notNow = page.getByRole('button', { name: 'Not now' });
if (await notNow.count()) await notNow.first().click();

const modules = [];
for (const [name, path] of [['Dashboard', '/erp/'], ['My Work', '/erp/my-work'], ['Sales and CRM', '/erp/crm/'], ['Finance and Accounting', '/erp/finance/'], ['Projects and Tasks', '/erp/tasks/'], ['Products and Engineering', '/erp/cad'], ['Maintenance', '/erp/maintenance'], ['Maintenance: assets', null], ['Operations', '/erp/operations'], ['Reports', '/erp/reports'], ['Administration', '/erp/administration']]) {
  set(`ERP ${name}`);
  if (path) await page.goto(origin + path, { waitUntil: 'networkidle' });
  else await page.getByRole('link', { name: 'Assets' }).first().click().then(() => page.waitForLoadState('networkidle'));
  await page.waitForTimeout(600);
  const url = new URL(page.url());
  if (/\/login/.test(url.pathname)) problems.push(`ERP ${name}: sent to sign in`);
  if (!(await page.locator('.suite-rail').count())) problems.push(`ERP ${name}: no module rail`);
  modules.push(`${name} -> ${url.pathname}`);
}
set('ERP Report a fault');
await page.locator('.suite-rail .suite-fault').click();
await page.getByRole('dialog', { name: 'Report a fault' }).waitFor({ timeout: 10000 }).catch(() => problems.push('ERP Report a fault: no dialog'));
await ctx.close();
await browser.close();

console.log(`${pagesOk} website pages opened (desktop and phone); ERP modules: ${modules.join(', ')}`);
if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):\n${[...new Set(problems)].slice(0, 40).join('\n')}`);
  process.exit(1);
}
console.log('No CSP violation, script error, failed request, H1 or overflow problem, and no request left the preview.');
