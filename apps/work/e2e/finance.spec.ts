import { expect, test, type Page } from '@playwright/test';

// BIZOMAT Finance under /finance (the same build and server as Project Management and the CRM): sign-up, a GST-registered
// business workspace, a customer, a posted expense with GST, an invoice with a payment, and the reports computed from
// the ledger, staying under /finance and /tasks (the shared sign-in) only.
const password = 'e2e-Password-123!';

// An address of its own for the sign-up limit (192.0.2.0/24 is reserved for documentation), as the CRM specs do.
test.use({ extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.45', 'X-Forwarded-For': '192.0.2.45' } });
const EMAIL = 'e2e.finance.owner@example.com';

async function signIn(page: Page) {
  await page.goto('/finance/');
  await expect(page).toHaveURL(/\/finance\/login/);
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/finance\/(start|o\/)/, { timeout: 5000 }).catch(async () => {
    await page.goto('/finance/signup');
    await page.getByLabel('Full name').fill('Finance User');
    await page.getByLabel('Work email').fill(EMAIL);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
  });
  await expect(page).toHaveURL(/\/finance\/(start|o\/[^/]+\/dashboard)/);
}

test('a new account creates a business workspace, records an expense and an invoice, and reads the reports', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.hostname === 'localhost' && !/^\/(finance|tasks)\//.test(u.pathname)) outside.push(u.pathname);
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await signIn(page);
  if (/\/finance\/o\//.test(page.url())) await page.goto('/finance/start');
  await page.getByRole('radio', { name: /Business/ }).check();
  await page.getByLabel('Workspace name').fill('E2E Design Pty Ltd');
  await page.getByLabel(/Registered for GST/).check();
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page).toHaveURL(/\/finance\/o\/[^/]+\/dashboard/);
  const ws = page.url().replace(/\/dashboard.*$/, '');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // A customer.
  await page.goto(`${ws}/contacts`);
  await page.getByRole('button', { name: 'New contact' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Name').fill('Harbour Cafe');
  await dialog.getByLabel('Type').selectOption('customer');
  await dialog.getByRole('button', { name: 'Add contact' }).click();
  await expect(page.getByRole('link', { name: 'Harbour Cafe' }).first()).toBeVisible();

  // An expense of $110 including GST, posted straight away (the owner approves).
  await page.goto(`${ws}/transactions`);
  await page.getByRole('button', { name: 'New transaction' }).first().click();
  await page.getByRole('radio', { name: 'Money out' }).check();
  await page.getByLabel('Paid to').fill('Officeworks');
  await page.getByLabel('Category, line 1').selectOption({ label: '453 Office expenses' });
  await page.getByLabel('GST code, line 1').selectOption({ label: /^GSTP:/ });
  await page.getByLabel('Amount, line 1').fill('110');
  await page.getByLabel('Amount, line 1').press('Tab');
  await page.getByRole('button', { name: 'Save and post' }).click();
  await page.getByRole('button', { name: 'Save anyway' }).click({ timeout: 1500 }).catch(() => {});
  await expect(page.getByText('Officeworks').first()).toBeVisible();

  // An invoice for $550 including GST, approved, then paid in full.
  await page.goto(`${ws}/invoices/new`);
  await page.getByLabel('Customer').selectOption({ label: 'Harbour Cafe' });
  await page.getByLabel('Line 1 description').fill('Design work');
  await page.getByLabel('Line 1 unit price').fill('550');
  await page.getByLabel('Line 1 unit price').press('Tab');
  await page.getByLabel('Line 1 account').selectOption({ label: '200 Sales' });
  await page.getByRole('button', { name: 'Save and approve (post to the ledger)' }).click();
  await expect(page.getByRole('heading', { name: /INV-0001/ })).toBeVisible();
  await page.getByRole('button', { name: 'Record a payment' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Record payment' }).click();
  await expect(page.getByText('Paid', { exact: true }).first()).toBeVisible();

  // The reports read the ledger: the trial balance balances.
  await page.goto(`${ws}/reports/trial_balance`);
  await expect(page.getByRole('heading', { name: /Trial balance/ })).toBeVisible();
  await expect(page.getByText('Balanced', { exact: false }).first()).toBeVisible();
  expect(errors).toEqual([]);
  expect(outside).toEqual([]);
});

test('a personal workspace on a phone: the menu, a category and a transaction @mobile', async ({ page }) => {
  await signIn(page);
  await page.goto('/finance/start');
  await page.getByRole('radio', { name: /Personal/ }).check();
  await page.getByLabel('Workspace name').fill('My money');
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page).toHaveURL(/\/finance\/o\/[^/]+\/dashboard/);
  const ws = page.url().replace(/\/dashboard.*$/, '');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('link', { name: 'Transactions' }).click();
  await expect(page).toHaveURL(/\/transactions/);
  await page.getByRole('button', { name: 'New transaction' }).first().click();
  await page.getByRole('radio', { name: 'Money out' }).check();
  await page.getByLabel('Paid to').fill('Corner grocer');
  await page.getByLabel('Category, line 1').selectOption({ label: /Groceries/ });
  await page.getByLabel('Amount, line 1').fill('42.50');
  await page.getByLabel('Amount, line 1').press('Tab');
  await page.getByRole('button', { name: 'Save and post' }).click();
  await page.getByRole('button', { name: 'Save anyway' }).click({ timeout: 1500 }).catch(() => {});
  await page.goto(`${ws}/transactions`);
  await expect(page.getByText('Corner grocer').first()).toBeVisible();
  // Nothing on the page is wider than the phone.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
