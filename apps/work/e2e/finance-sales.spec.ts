import { expect, test, type Page } from '@playwright/test';

// BIZOMAT Finance, Stage 1 of the accounting upgrade, in the browser: a quote with a heading, an optional line and a
// discount, its live preview (the PDF itself), the online link a signed-out customer opens and accepts, the invoice
// made from it, a credit note for that invoice, and the document templates. Nothing leaves /finance and /tasks.
const password = 'e2e-Password-123!';
const EMAIL = 'e2e.sales.owner@example.com';
test.use({ extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.46', 'X-Forwarded-For': '192.0.2.46' } });

async function choose(page: Page, label: string, text: string) {
  const select = label.startsWith('#') ? page.locator(label) : page.getByLabel(label, { exact: true });
  const value = await select.evaluate((el, t) => [...(el as HTMLSelectElement).options].find((o) => o.textContent!.includes(t))?.value ?? '', text);
  expect(value, `${label}: an option with "${text}"`).not.toBe('');
  await select.selectOption(value);
}

async function signIn(page: Page) {
  await page.goto('/finance/');
  await expect(page).toHaveURL(/\/finance\/login/);
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/finance\/(start|o\/)/, { timeout: 5000 }).catch(async () => {
    await page.goto('/finance/signup');
    await page.getByLabel('Full name').fill('Sales Owner');
    await page.getByLabel('Work email').fill(EMAIL);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
  });
  await expect(page).toHaveURL(/\/finance\/(start|o\/[^/]+\/dashboard)/);
}

const shots = process.env.E2E_SHOTS;
async function shot(page: Page, name: string) {
  if (shots) await page.screenshot({ path: `${shots}/${name}.png`, fullPage: true });
}

test('quote to online acceptance to invoice to credit note, with the live preview', async ({ page, browser }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && /Content Security Policy|Refused to/.test(m.text())) errors.push(m.text());
  });
  const outside: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.hostname === 'localhost' && !/^\/(finance|tasks)\//.test(u.pathname)) outside.push(u.pathname);
  });
  await signIn(page);
  await page.goto('/finance/start');
  await page.getByRole('radio', { name: /Business/ }).check();
  await page.getByLabel('Workspace name').fill('E2E Sales Pty Ltd');
  await page.getByLabel(/Registered for GST/).check();
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await expect(page).toHaveURL(/\/finance\/o\/[^/]+\/dashboard/);
  const ws = page.url().replace(/\/dashboard.*$/, '');

  // The sidebar is in sections, with quotes and credit notes under Sales.
  const nav = page.getByRole('navigation', { name: 'Finance navigation' });
  await expect(nav.getByRole('group', { name: 'Sales' }).getByRole('link', { name: 'Quotes' })).toBeVisible();
  await expect(nav.getByRole('group', { name: 'Sales' }).getByRole('link', { name: 'Credit notes' })).toBeVisible();
  await expect(nav.getByRole('group', { name: 'Purchases' }).getByRole('link', { name: 'Bills' })).toBeVisible();

  await page.goto(`${ws}/contacts`);
  await page.getByRole('button', { name: 'New contact' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Name').fill('Harbour Builders');
  await dialog.getByLabel('Type').selectOption('customer');
  await dialog.getByRole('button', { name: 'Add contact' }).click();
  await expect(page.getByRole('link', { name: 'Harbour Builders' }).first()).toBeVisible();

  // A quote: a heading, a priced line, an optional line and 10% off the whole quote.
  await page.goto(`${ws}/quotes`);
  await page.getByRole('button', { name: 'New quote' }).first().click();
  await choose(page, '#q-contact', 'Harbour Builders');
  await page.getByLabel('Line 1 description').fill('Concept design');
  await page.getByLabel('Line 1 item code').fill('DS-1');
  await page.getByLabel('Line 1 quantity').fill('10');
  await page.getByLabel('Line 1 unit', { exact: true }).fill('hr');
  await page.getByLabel('Line 1 unit price').fill('150');
  await page.getByLabel('Line 1 unit price').press('Tab');
  await choose(page, 'Line 1 account', '200 Sales');
  await page.getByRole('button', { name: 'Add a line' }).click();
  await page.getByLabel('Line 2 description').fill('Extended support');
  await page.getByLabel('Line 2 unit price').fill('1200');
  await page.getByLabel('Line 2 unit price').press('Tab');
  await choose(page, 'Line 2 account', '200 Sales');
  await page.getByLabel('Line 2 is optional').check();
  await page.getByRole('button', { name: 'Add a heading' }).click();
  await page.getByLabel('Line 3 heading').fill('Design');
  await page.getByRole('button', { name: 'Move line 3 up' }).click();
  await page.getByRole('button', { name: 'Move line 2 up' }).click();
  await page.getByLabel('Discount on the whole quote (%)').fill('10');
  // 10 x $150 = $1,500, less 10% = $1,350, GST $135, total $1,485 (the optional line is not counted).
  const totals = page.locator('dl.fin-totals').first();
  await expect(totals).toContainText('$1,485');
  await shot(page, '01-quote-editor');
  // The live preview is the PDF from the server's document engine: on this screen, opened from the bar under the form.
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('dialog').locator('iframe.fin-preview-frame')).toHaveAttribute('src', /^blob:/, { timeout: 15_000 });
  await page.waitForTimeout(1500);
  await shot(page, '01b-quote-preview');
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Quote QU-0001/ })).toBeVisible();
  await expect(page.getByText('Draft', { exact: true }).first()).toBeVisible();

  // A secure online link; the customer, signed out, opens it and accepts.
  await page.getByRole('button', { name: 'Get a link' }).click();
  const link = await page.getByLabel('Online link').inputValue();
  expect(link).toMatch(/\/finance\/view\/quote\/[^?]+\?k=/);
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click().catch(() => page.keyboard.press('Escape'));
  const customer = await browser.newContext();
  const cp = await customer.newPage();
  const cerrors: string[] = [];
  cp.on('pageerror', (e) => cerrors.push(e.message));
  await cp.goto(new URL(link).pathname + new URL(link).search);
  await expect(cp.getByRole('heading', { name: /Quote QU-0001/ })).toBeVisible();
  await expect(cp.getByText('$1,485').first()).toBeVisible();
  await shot(cp, '02-customer-view');
  await cp.getByLabel('Your full name').fill('Pat Customer');
  await cp.getByRole('checkbox').check();
  await cp.getByRole('button', { name: 'Accept the quote' }).click();
  await expect(cp.getByText(/Accepted by Pat Customer/)).toBeVisible();
  expect(cerrors).toEqual([]);
  await customer.close();

  // Back in Finance: accepted online; invoice it in full.
  await page.reload();
  await expect(page.getByText(/Accepted by Pat Customer online/)).toBeVisible();
  await expect(page.getByText(/First opened by the customer/)).toBeVisible();
  await page.getByRole('button', { name: 'Create invoice' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Create the draft invoice' }).click();
  await expect(page.getByRole('heading', { name: /Invoice INV-0001/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'QU-0001' })).toBeVisible();
  await page.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByText('Approved', { exact: true }).first()).toBeVisible();
  await shot(page, '03-invoice');

  // A credit note for it, prefilled from its lines: credit 4 of the 10 hours.
  await page.getByRole('button', { name: 'Credit note' }).click();
  await expect(page.getByRole('heading', { name: 'New credit note' })).toBeVisible();
  await page.getByLabel('Line 2 quantity').fill('4');
  await page.getByLabel('Reason').fill('Fewer hours than quoted');
  // On a wide screen the preview sits beside the form and follows it.
  await page.setViewportSize({ width: 1720, height: 1000 });
  await expect(page.getByRole('region', { name: 'Credit note preview' }).locator('iframe.fin-preview-frame')).toHaveAttribute('src', /^blob:/, { timeout: 15_000 });
  await page.waitForTimeout(1500);
  await shot(page, '04-credit-editor');
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.getByRole('button', { name: 'Save and approve (post to the ledger)' }).click();
  await expect(page.getByRole('heading', { name: /Credit note CN-0001/ })).toBeVisible();
  // 4 x $150 less 10% = $540, GST $54: $594, applied to the invoice straight away.
  await expect(page.locator('dl.fin-totals')).toContainText('$594');
  await expect(page.getByText('Used', { exact: true }).first()).toBeVisible();
  await page.getByRole('link', { name: 'INV-0001' }).first().click();
  await expect(page.getByRole('heading', { name: 'Credit applied' })).toBeVisible();
  await expect(page.locator('dl.fin-totals')).toContainText('$891');

  // Document templates: change the page and see the sample.
  await page.goto(`${ws}/settings/templates`);
  await page.getByLabel('Page').selectOption('landscape');
  await page.getByLabel('Quote title').fill('Proposal');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('dialog').locator('iframe.fin-preview-frame')).toHaveAttribute('src', /^blob:/, { timeout: 15_000 });
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Save template' }).click();
  await expect(page.getByText('Template saved')).toBeVisible();
  await shot(page, '05-templates');

  // Numbering covers quotes and credit notes.
  await page.goto(`${ws}/accounting/numbering`);
  await expect(page.getByRole('cell', { name: 'Quotes' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Credit notes' })).toBeVisible();

  expect(errors).toEqual([]);
  expect(outside).toEqual([]);
});
