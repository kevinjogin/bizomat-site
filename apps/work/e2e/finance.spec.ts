import { expect, test, type Page } from '@playwright/test';

// BIZOMAT Finance inside BIZOMAT ERP, at /erp/finance (the same build and server as Project Management and the CRM):
// Finance's own address /finance answers 302 there and a signed-out visitor signs in at the ERP's sign-in; then sign-up,
// a GST-registered business workspace, a customer, a posted expense with GST, an invoice with a payment, and the reports
// computed from the ledger, staying inside the ERP (/erp) only (src/worker/mount.ts).
const password = 'e2e-Password-123!';

// The only requests outside /erp: the page loads of a signed-out visit, each a 302 on the way to the ERP's sign-in
// (Finance's own address, which the spec opens to see it answer into the ERP, and the shared session's carry).
const SIGNED_OUT_HOPS = ['/finance/', '/tasks/api/app-carry'];

// An address of its own for the sign-up limit (192.0.2.0/24 is reserved for documentation), as the CRM specs do.
test.use({ extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.45', 'X-Forwarded-For': '192.0.2.45' } });
const EMAIL = 'e2e.finance.owner@example.com';

/** Choose the option whose text contains `text` (option labels can carry an indent or a rate). */
async function choose(page: Page, label: string, text: string) {
  const select = label.startsWith('#') ? page.locator(label) : page.getByLabel(label, { exact: true });
  const value = await select.evaluate((el, t) => [...(el as HTMLSelectElement).options].find((o) => o.textContent!.includes(t))?.value ?? '', text);
  expect(value, `${label}: an option with "${text}"`).not.toBe('');
  await select.selectOption(value);
}

async function signIn(page: Page) {
  // Finance's own address opens inside the ERP: signed out, at the ERP's sign-in, which brings the visitor back to it.
  await page.goto('/finance/');
  await expect(page).toHaveURL(/\/erp\/login\?next=%2Ffinance%2F$/);
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/erp\/finance\/(start|o\/)/, { timeout: 5000 }).catch(async () => {
    await page.goto('/erp/finance/signup');
    await page.getByLabel('Full name').fill('Finance User');
    await page.getByLabel('Work email').fill(EMAIL);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
  });
  await expect(page).toHaveURL(/\/erp\/finance\/(start|o\/[^/]+\/dashboard)/);
}

test('a new account creates a business workspace, records an expense and an invoice, and reads the reports', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.hostname !== 'localhost' || u.pathname.startsWith('/erp/')) return;
    if (!(r.isNavigationRequest() && SIGNED_OUT_HOPS.includes(u.pathname))) outside.push(u.pathname);
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await signIn(page);
  if (/\/erp\/finance\/o\//.test(page.url())) await page.goto('/erp/finance/start');
  await page.getByRole('radio', { name: /Business/ }).check();
  await page.getByLabel('Workspace name').fill('E2E Design Pty Ltd');
  await page.getByLabel(/Registered for GST/).check();
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page).toHaveURL(/\/erp\/finance\/o\/[^/]+\/dashboard/);
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
  await page.getByLabel('Paid to').fill('Paperbark Office Supplies');
  await choose(page, 'Category, line 1', '453 Office expenses');
  await choose(page, 'GST code, line 1', 'GSTP:');
  await page.getByLabel('Amount, line 1').fill('110');
  await page.getByLabel('Amount, line 1').press('Tab');
  await page.getByRole('button', { name: 'Save and post' }).click();
  await page.getByRole('button', { name: 'Save anyway' }).click({ timeout: 1500 }).catch(() => {});
  await expect(page.getByText('Paperbark Office Supplies').first()).toBeVisible();

  // An invoice for $500 plus GST (the Sales account's GST code fills in), approved, then paid in full.
  await page.goto(`${ws}/invoices/new`);
  await choose(page, '#doc-contact', 'Harbour Cafe');
  await page.getByLabel('Line 1 description').fill('Design work');
  await page.getByLabel('Line 1 unit price').fill('500');
  await page.getByLabel('Line 1 unit price').press('Tab');
  await choose(page, 'Line 1 account', '200 Sales');
  await page.getByRole('button', { name: 'Save and approve (post to the ledger)' }).click();
  await expect(page.getByRole('heading', { name: /INV-0001/ })).toBeVisible();
  await expect(page.getByText('$550').first()).toBeVisible();
  await page.getByRole('button', { name: 'Record a payment' }).click();
  await choose(page, '#pay-account', 'Business bank account');
  await page.getByRole('dialog').getByRole('button', { name: 'Record payment' }).click();
  await expect(page.getByText('Paid', { exact: true }).first()).toBeVisible();

  // The reports read the ledger: the trial balance balances.
  await page.goto(`${ws}/reports/trial_balance`);
  await expect(page.getByRole('heading', { name: /Trial balance/ })).toBeVisible();
  await expect(page.getByText('Balances', { exact: true }).first()).toBeVisible();
  // Bank 550 - 110, GST 50 - 10, sales 500, office 100: both sides 540.
  await expect(page.getByRole('row', { name: /^Total/ })).toContainText('$540');
  await expect(page.getByRole('row', { name: /090 Business bank account/ })).toContainText('$440');
  expect(errors).toEqual([]);
  expect(outside).toEqual([]);
});

test('a personal workspace on a phone: the menu, a category and a transaction @mobile', async ({ page }) => {
  await signIn(page);
  await page.goto('/erp/finance/start');
  await page.getByRole('radio', { name: /Personal/ }).check();
  await page.getByLabel('Workspace name').fill('My money');
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page).toHaveURL(/\/erp\/finance\/o\/[^/]+\/dashboard/);
  const ws = page.url().replace(/\/dashboard.*$/, '');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('link', { name: 'Transactions' }).click();
  await expect(page).toHaveURL(/\/transactions/);
  await page.getByRole('button', { name: 'New transaction' }).first().click();
  await page.getByRole('radio', { name: 'Money out' }).check();
  await page.getByLabel('Paid to').fill('Corner grocer');
  await choose(page, 'Category, line 1', 'Groceries');
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
