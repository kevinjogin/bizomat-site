// BIZOMAT is free (Stage 1, owner 19 Nov 2026): no page shows a price, billing is locked in production, and Stripe is
// preserved.
//
// src/config/pricing.ts stays the record of the owner's live Stripe price, and production still names that price
// (fly.website.toml), so the billing code, the Stripe product and its tests stay intact. But no page publishes the price,
// /pricing/ answers 301 to /systems/, and the work app is locked (BIZOMAT_BILLING_LOCK): nobody can subscribe or be
// charged, whatever the console says.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { ERP_PRICE, GST_LINE, PRICE_LINE, PRICE_LINE_GST, PRICE_PER_USER, PRICE_WITH_AU_GST, example } from '../src/config/pricing.ts';

const read = (path: string) => readFileSync(path, 'utf8');

function flyEnv(name: string, file = 'fly.website.toml'): string | null {
  const m = read(file).match(new RegExp(`^\\s*${name}\\s*=\\s*"([^"]*)"`, 'm'));
  return m ? m[1] : null;
}

test('production is locked to free mode, and the entrypoint keeps it locked unless told otherwise', () => {
  assert.equal(flyEnv('WORK_BIZOMAT_BILLING_LOCK'), 'true');
  // The work role receives the lock under the app's name, "true" when fly.website.toml does not set it.
  assert.match(read('infrastructure/fly/entrypoint.sh'), /^\s*map WORK_BIZOMAT_BILLING_LOCK BIZOMAT_BILLING_LOCK "true"$/m);
});

test('Stripe is preserved: production still names the owner\'s live price, in live mode, with no key in the file', () => {
  assert.equal(flyEnv('WORK_STRIPE_PRICE_SEAT_MONTHLY'), ERP_PRICE.stripePriceId);
  assert.equal(flyEnv('WORK_STRIPE_ENVIRONMENT'), 'live');
  assert.match(ERP_PRICE.stripePriceId, /^price_[A-Za-z0-9]+$/);
  // The Stripe sandbox's test price (docs/billing/README.md) never reaches production.
  assert.doesNotMatch(read('fly.website.toml'), /price_1Uc2bqRymx2K9qJ1EVaxV6Hd/);
  // Stripe keys and signing secrets live in repository secrets, never in the configuration.
  assert.doesNotMatch(read('fly.website.toml'), /\b(sk|rk|pk)_(live|test)_|whsec_/);
});

test('the price record is unchanged: the amount and GST as Stripe holds them', () => {
  assert.equal(ERP_PRICE.currency, 'AUD');
  assert.equal(ERP_PRICE.interval, 'month');
  assert.equal(ERP_PRICE.open, false);
  assert.equal(ERP_PRICE.gst, 'exclusive');
  assert.equal(PRICE_PER_USER, 'A$10.00');
  assert.equal(PRICE_LINE, 'A$10.00 per active user per month');
  assert.equal(PRICE_LINE_GST, 'A$10.00 per active user per month, plus GST');
  assert.equal(example(5), '5 × A$10.00 = A$50.00 a month, plus GST');
  assert.equal(PRICE_WITH_AU_GST, 'A$11.00');
  assert.match(GST_LINE.exclusive, /excludes GST/);
});

test('no pricing page: /pricing/ answers 301 to the Systems catalogue, and nothing links to it', () => {
  assert.equal(existsSync('src/pages/pricing.astro'), false);
  const redirects = read('public/_redirects');
  assert.match(redirects, /^\/pricing \/systems\/ 301$/m);
  assert.match(redirects, /^\/pricing\/ \/systems\/ 301$/m);
  for (const file of ['src/config/site.ts', 'src/pages/systems/index.astro', 'src/pages/systems/erp/index.astro', 'apps/work/src/client/company/Register.tsx', 'apps/work/src/client/system/billing/Billing.tsx']) {
    assert.doesNotMatch(read(file), /\/pricing\//, `${file} links to the withdrawn pricing page`);
  }
});

test('no page or screen shows the subscription price, and the Systems pages say it is free', () => {
  for (const file of ['src/pages/systems/index.astro', 'src/pages/systems/erp/index.astro', 'apps/work/src/client/company/Register.tsx', 'apps/work/src/client/system/billing/Billing.tsx']) {
    const src = read(file);
    assert.doesNotMatch(src, /config\/pricing\.ts/, `${file} reads the price`);
    assert.doesNotMatch(src, /A\$\s?\d/, `${file} writes an amount`);
    assert.doesNotMatch(src, /per active user per month/, `${file} describes a per-user price`);
  }
  assert.match(read('src/pages/systems/erp/index.astro'), /BIZOMAT ERP is free for every company: nothing is charged\./);
  assert.match(read('src/pages/systems/index.astro'), /Every system is free to use: nothing is charged\./);
  // The billing screen's free view.
  assert.match(read('apps/work/src/client/system/billing/Billing.tsx'), /BIZOMAT is free for every company/);
});

// Every price is withdrawn for now (owner, 19 Nov 2026: "remove all pricings for now"), engineering services included.
// Amounts stay only where they are records, never shown: src/config/pricing.ts and the numeric fields of the service
// configs. The Library and the calculators (tools) use amounts as subject matter, so they are not part of this check.
test('no page, component, FAQ, assistant knowledge or service config shows an amount', async () => {
  const { readdirSync, statSync } = await import('node:fs');
  const { join } = await import('node:path');
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
  const skip = /^src\/(pages\/(library|reados|tools)|data\/tools|lib\/tools|content)\b|config\/pricing\.ts$|knowledge-link|tool-input/;
  const files = ['src/pages', 'src/components', 'src/layouts', 'src/config', 'src/data', 'src/lib', 'src/server']
    .flatMap(walk)
    .filter((f) => /\.(astro|ts|json|mjs)$/.test(f) && !skip.test(f.replaceAll('\\', '/')));
  assert.ok(files.length > 50, 'the check covers the site');
  const priced = files.filter((f) => /A\$\s?\d/.test(read(f)));
  assert.deepEqual(priced, [], 'files that show an amount');
  // The withdrawn marketing files answer 301 to the assessment page.
  const redirects = read('public/_redirects');
  for (const f of ['kevos-engineering-problem-assessment-brochure.pdf', 'kevos-sample-assessment-report.pdf', 'kevos-assessment-qr-card.pdf', 'kevos-assessment-social.png', 'kevos-assessment-banner.png']) {
    assert.equal(existsSync(`public/assessment/${f}`), false, f);
    assert.match(redirects, new RegExp(`^/assessment/${f.replace('.', '\\.')} /assessment/ 301$`, 'm'), f);
  }
  // The website assistant is told never to quote a price.
  assert.match(read('src/server/chat/handler.ts'), /Never quote, calculate, estimate, discount or invent a price/);
});
