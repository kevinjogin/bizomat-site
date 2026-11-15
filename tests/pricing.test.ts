// The BIZOMAT ERP price: the pages, production's configuration and the app agree (src/config/pricing.ts).
//
// The pages name the amount from src/config/pricing.ts; the work app charges the Stripe price named by
// WORK_STRIPE_PRICE_SEAT_MONTHLY in fly.website.toml and shows the amount Stripe returns for it. A Stripe price's amount
// never changes, so keeping the two ids equal keeps the published amount and the charged amount equal.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ERP_PRICE, GST_LINE, PRICE_LINE, PRICE_PER_USER, example } from '../src/config/pricing.ts';

const read = (path: string) => readFileSync(path, 'utf8');

function flyEnv(name: string): string | null {
  const m = read('fly.website.toml').match(new RegExp(`^\\s*${name}\\s*=\\s*"([^"]*)"`, 'm'));
  return m ? m[1] : null;
}

test('production charges the price the pages publish, in live mode', () => {
  assert.equal(flyEnv('WORK_STRIPE_PRICE_SEAT_MONTHLY'), ERP_PRICE.stripePriceId);
  assert.equal(flyEnv('WORK_STRIPE_ENVIRONMENT'), 'live');
  assert.match(ERP_PRICE.stripePriceId, /^price_[A-Za-z0-9]+$/);
  // The Stripe sandbox's test price (docs/billing/README.md) never reaches production.
  assert.doesNotMatch(read('fly.website.toml'), /price_1Uc2bqRymx2K9qJ1EVaxV6Hd/);
  // Stripe keys and signing secrets live in repository secrets, never in the configuration.
  assert.doesNotMatch(read('fly.website.toml'), /\b(sk|rk|pk)_(live|test)_|whsec_/);
});

test('the amount is written once and formatted the same everywhere', () => {
  assert.equal(ERP_PRICE.currency, 'AUD');
  assert.equal(ERP_PRICE.interval, 'month');
  assert.ok(Number.isInteger(ERP_PRICE.unitAmount) && ERP_PRICE.unitAmount > 0);
  assert.equal(PRICE_PER_USER, 'A$10.00');
  assert.equal(PRICE_LINE, 'A$10.00 per active user per month');
  assert.equal(example(5), '5 × A$10.00 = A$50.00 a month');
  for (const page of ['src/pages/pricing.astro', 'src/pages/systems/erp/index.astro']) {
    const src = read(page);
    assert.match(src, /config\/pricing\.ts/, `${page} takes the price from src/config/pricing.ts`);
    assert.doesNotMatch(src, /A\$\s?\d/, `${page} writes no amount of its own`);
  }
  // The app's screens show Stripe's amount, never one of their own.
  for (const screen of ['apps/work/src/client/company/Register.tsx', 'apps/work/src/client/system/billing/Billing.tsx']) {
    assert.doesNotMatch(read(screen), /A\$\s?\d/, `${screen} writes no amount of its own`);
  }
});

test('no page says how GST applies until it is recorded', () => {
  if (ERP_PRICE.gst !== 'unconfirmed') return;
  assert.match(GST_LINE.unconfirmed, /being confirmed/);
  const claims = /GST (is )?(added|additional|included)|plus GST|includes GST|excludes GST|GST-(in|ex)clusive/i;
  for (const file of [
    'src/pages/pricing.astro',
    'src/pages/systems/erp/index.astro',
    'src/pages/systems/index.astro',
    'apps/work/src/client/company/Register.tsx',
  ]) {
    assert.doesNotMatch(read(file), claims, `${file} claims a GST treatment`);
  }
});

test('subscriptions are described as not open while they are not', () => {
  const page = read('src/pages/pricing.astro');
  assert.equal(ERP_PRICE.open, false);
  assert.match(page, /Subscriptions are not open yet/);
  assert.match(page, /nothing is charged today/);
});
