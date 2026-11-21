import { expect, test, type Page } from '@playwright/test';

// BIZOMAT CRM inside BIZOMAT ERP, at /erp/crm (the same build and server as Project Management): the CRM's own address
// /crm answers 302 there and a signed-out visitor signs in at the ERP's sign-in; then sign-up, an organisation, records,
// the pipeline board, activities and the dashboard, staying inside the ERP (/erp) only (src/worker/mount.ts).
const password = 'e2e-Password-123!';

// The only requests outside /erp: the page loads of a signed-out visit, each a 302 on the way to the ERP's sign-in (the
// CRM's own address, which the spec opens to see it answer into the ERP, and the shared session's carry).
const SIGNED_OUT_HOPS = ['/crm/', '/tasks/api/app-carry'];

// The suite's other specs already use the ten sign-ups an address may make per hour, so the CRM specs come from an
// address of their own (192.0.2.0/24 is reserved for documentation) and share one account: the data folder is new on
// every run, so a fixed address is new too.
test.use({ extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.44', 'X-Forwarded-For': '192.0.2.44' } });
const EMAIL = 'e2e.crm.owner@example.com';

/** Sign in (or, the first time in a run, sign up) to the CRM in the ERP, and open an organisation (created when there is none). */
async function signUpAndCreateOrg(page: Page, orgName: string) {
  // The CRM's own address opens inside the ERP: signed out, at the ERP's sign-in, which brings the visitor back to it.
  await page.goto('/crm/');
  await expect(page).toHaveURL(/\/erp\/login\?next=%2Fcrm%2F$/);
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/erp\/crm\/(start|o\/)/, { timeout: 5000 }).catch(async () => {
    await page.goto('/erp/crm/signup');
    await page.getByLabel('Full name').fill('Crm User');
    await page.getByLabel('Work email').fill(EMAIL);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
  });
  await expect(page).toHaveURL(/\/erp\/crm\/(start|o\/[^/]+\/overview)/);
  if (/\/erp\/crm\/start/.test(page.url())) {
    await page.getByLabel('Organisation name').fill(orgName);
    await page.getByRole('button', { name: 'Create organisation' }).click();
  }
  await expect(page).toHaveURL(/\/erp\/crm\/o\/[^/]+\/overview/);
  return page.url().replace(/\/overview.*$/, '');
}

test('a new account creates an organisation and works with contacts, deals and activities in the ERP at /erp/crm', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.hostname !== 'localhost' || u.pathname.startsWith('/erp/')) return;
    if (!(r.isNavigationRequest() && SIGNED_OUT_HOPS.includes(u.pathname))) outside.push(u.pathname);
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const org = await signUpAndCreateOrg(page, 'E2E Engineering');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  // A company, then a contact linked to it (the picker searches the organisation's companies).
  await page.goto(`${org}/companies`);
  await page.getByRole('button', { name: 'New company' }).click();
  await page.getByLabel('Company name *').fill('Acme Fabrication');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Acme Fabrication' })).toBeVisible();
  await page.goto(`${org}/contacts`);
  await page.getByRole('button', { name: 'New contact' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('First name').fill('Jo');
  await dialog.getByLabel('Last name').fill('Smith');
  await dialog.getByLabel('Email').first().fill('jo@acme.example.com');
  await dialog.getByLabel('Company', { exact: true }).fill('Acme');
  await page.getByRole('option', { name: /Acme Fabrication/ }).click();
  await dialog.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Jo Smith' })).toBeVisible();
  await page.getByLabel('Note', { exact: true }).fill('Interested in a conveyor upgrade.');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByText('Interested in a conveyor upgrade.').first()).toBeVisible();

  // Deals on the board: create, drag to another stage, win.
  await page.goto(`${org}/deals`);
  for (const title of ['Conveyor upgrade', 'Spare parts']) {
    await page.getByRole('button', { name: 'New deal', exact: true }).click();
    await page.getByLabel('Deal *').fill(title);
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.locator('article.crm-deal-card', { hasText: title })).toBeVisible();
  }
  await page.locator('article.crm-deal-card', { hasText: 'Conveyor upgrade' }).dragTo(page.locator('section.lane', { hasText: 'Proposal' }).first());
  await expect(page.locator('section.lane', { hasText: 'Proposal' }).locator('article', { hasText: 'Conveyor upgrade' })).toBeVisible();
  await page.reload();
  await expect(page.locator('section.lane', { hasText: 'Proposal' }).locator('article', { hasText: 'Conveyor upgrade' })).toBeVisible();
  await page.getByRole('button', { name: 'Move Spare parts' }).click();
  await page.getByRole('menuitem', { name: 'Won' }).click();
  await expect(page.locator('article', { hasText: 'Spare parts' })).toHaveCount(0);

  // An activity for today, completed from the list.
  await page.goto(`${org}/activities`);
  await page.getByRole('button', { name: 'New activity' }).click();
  await page.getByLabel('Title *').fill('Call Jo about the quote');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Complete Call Jo about the quote' }).check();
  await page.getByRole('tab', { name: 'Completed' }).click();
  await expect(page.getByRole('link', { name: 'Call Jo about the quote' })).toBeVisible();

  // The dashboard counts what was just done.
  await page.goto(`${org}/overview`);
  await expect(page.locator('.crm-stat', { hasText: 'Win rate' })).toContainText('100%');
  expect(outside).toEqual([]);
  expect(errors).toEqual([]);
});

test('@mobile the CRM fits a phone: overview, board and navigation', async ({ page }) => {
  const org = await signUpAndCreateOrg(page, 'Phone Org');
  for (const path of ['overview', 'deals', 'contacts']) {
    await page.goto(`${org}/${path}`);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('navigation', { name: 'CRM navigation' }).getByRole('link', { name: 'Reports' }).click();
  await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
});
