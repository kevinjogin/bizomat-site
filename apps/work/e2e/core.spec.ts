import { expect, test, type Page, type Request } from '@playwright/test';

const password = 'e2e-Password-123!';
const unique = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function signup(page: Page, name = 'E2E User') {
  const email = `e2e.${unique()}@example.com`;
  await page.goto('/signup');
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Work email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/w\/[^/]+\/home/);
  return email;
}

test('unauthenticated visitors are sent to login and APIs refuse data', async ({ page, request }) => {
  await page.goto('/w/some-workspace/boards');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Sign in to BIZOMAT' })).toBeVisible();
  const res = await request.get('/api/workspaces');
  expect(res.status()).toBe(401);
});

test('BIZOMAT branding on the sign-in page and in the app shell', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle('Sign in to BIZOMAT · BIZOMAT Project Management');
  await expect(page.getByRole('heading', { name: 'Sign in to BIZOMAT' })).toBeVisible();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'BIZOMAT Project Management');
  // Headings use the platform's heading face, body text Inter Tight.
  expect(await page.getByRole('heading', { level: 1 }).evaluate((h) => getComputedStyle(h).fontFamily)).toContain('Oxanium');
  expect(await page.locator('body').evaluate((b) => getComputedStyle(b).fontFamily)).toContain('Inter Tight');
  // Platform legal pages open in the same tab; links to other hosts carry rel="noopener".
  const legal = page.getByRole('navigation', { name: 'BIZOMAT legal' });
  for (const [name, href] of [['Privacy Policy', 'https://bizomat.ai/privacy/'], ['Terms of Use', 'https://bizomat.ai/terms/'], ['Disclaimer', 'https://bizomat.ai/disclaimer/']]) {
    const link = legal.getByRole('link', { name, exact: true });
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('rel', 'noopener');
    expect(await link.getAttribute('target')).toBeNull();
  }
  await expect(page.locator('body')).not.toContainText(/KEVOS|WorkOS/i);

  await signup(page, 'Brand Tester');
  await expect(page).toHaveTitle('Home · BIZOMAT Project Management');
  await expect(page.getByRole('link', { name: 'BIZOMAT Project Management home' })).toBeVisible();
  await expect(page.getByText('Part of the BIZOMAT platform')).toBeVisible();
  await expect(page.getByText('Connecting Intelligence. Empowering Progress.')).toBeVisible();
  await expect(page.getByText(/© \d{4} BIZOMAT\. All rights reserved\./).first()).toBeVisible();
  const platform = page.getByRole('navigation', { name: 'BIZOMAT platform' });
  await expect(platform.getByRole('link', { name: 'BIZOMAT', exact: true })).toHaveAttribute('href', 'https://bizomat.ai/');
  await expect(platform.getByRole('link', { name: 'CAD Automation', exact: true })).toHaveAttribute('href', 'https://bizomat.ai/cad/');
  await expect(platform.getByRole('link', { name: 'CAD Automation', exact: true })).toHaveAttribute('rel', 'noopener');
  await expect(page.locator('body')).not.toContainText(/KEVOS|WorkOS/i);
});

test('core board workflow persists across reloads', async ({ page }) => {
  await signup(page);
  // Create a board
  await page.getByRole('button', { name: 'New', exact: false }).first().click();
  await page.getByRole('menuitem', { name: 'Board', exact: true }).click();
  await page.getByLabel('Board name').fill('E2E Launch');
  await page.getByRole('button', { name: 'Create board' }).click();
  await expect(page.getByLabel('Board name')).toHaveValue('E2E Launch');

  // Add an item in the first group
  const add = page.getByLabel('Add item').first();
  await add.fill('Write launch plan');
  await add.press('Enter');
  await expect(page.getByText('Write launch plan')).toBeVisible();

  // Set its status through the cell editor
  const row = page.locator('tr', { hasText: 'Write launch plan' });
  await row.getByRole('button', { name: /^Status:/ }).click();
  await page.getByRole('button', { name: 'Working on it' }).click();
  await expect(row.getByRole('button', { name: 'Status: Working on it' })).toBeVisible();

  // A new row can be edited before the server has saved it: hold the save until the status is picked.
  // The row and its open menu must survive a board refetch meanwhile (here: another item is added, so the
  // board's live channel asks for one), the edit must survive the saved row replacing the temporary one, and
  // it must be saved under the item's real id.
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  let heldSave: Request | undefined;
  const isCreate = (url: URL) => /\/api\/boards\/[^/]+\/items$/.test(url.pathname);
  await page.route(isCreate, async (route) => {
    if (route.request().method() === 'POST') {
      heldSave = route.request();
      await held;
    }
    await route.continue();
  });
  await add.fill('Review launch plan');
  await add.press('Enter');
  const unsaved = page.locator('tr', { hasText: 'Review launch plan' });
  await unsaved.getByRole('button', { name: /^Status:/ }).click();
  await expect(page.getByRole('button', { name: 'Stuck' })).toBeVisible();
  const refetched = page.waitForResponse((r) => r.request().method() === 'GET' && /\/api\/boards\/[^/]+$/.test(new URL(r.url()).pathname));
  const sent = await heldSave!.allHeaders();
  const other = await page.request.post(heldSave!.url(), { data: { name: 'Book launch venue' }, headers: { origin: sent.origin, 'x-csrf-token': sent['x-csrf-token'] } });
  expect(other.ok()).toBe(true);
  await refetched;
  await expect(page.locator('tr', { hasText: 'Book launch venue' })).toBeVisible();
  await page.getByRole('button', { name: 'Stuck' }).click();
  const statusSaved = page.waitForResponse((r) => r.request().method() === 'PATCH' && /\/api\/items\/[^/]+$/.test(new URL(r.url()).pathname));
  release();
  const patched = await statusSaved;
  expect(patched.ok()).toBe(true);
  expect(patched.url()).not.toContain('tmp-');
  await expect(unsaved.getByRole('button', { name: 'Status: Stuck' })).toBeVisible();
  await expect(unsaved).toHaveCount(1);
  await page.unroute(isCreate);

  // Reload: data must come from the backend
  await page.waitForTimeout(500);
  await page.reload();
  const row2 = page.locator('tr', { hasText: 'Write launch plan' });
  await expect(row2.getByRole('button', { name: 'Status: Working on it' })).toBeVisible();
  await expect(page.locator('tr', { hasText: 'Review launch plan' }).getByRole('button', { name: 'Status: Stuck' })).toBeVisible();

  // Same data in the Kanban view
  await page.getByRole('tab', { name: 'Kanban' }).click();
  await expect(page.getByText('Write launch plan')).toBeVisible();

  // Open the item and post an update
  await page.getByRole('tab', { name: 'Main table' }).click();
  await page.getByRole('button', { name: 'Open Write launch plan' }).click();
  await page.getByLabel('Write an update… use @ to mention').fill('First draft is ready');
  await page.getByRole('button', { name: 'Post update' }).click();
  await expect(page.locator('.update-body', { hasText: 'First draft is ready' })).toBeVisible();
  await page.keyboard.press('Escape');
});

test('logout ends the session', async ({ page }) => {
  await signup(page, 'Logout Tester');
  await page.getByRole('button', { name: 'Profile menu' }).click();
  await page.getByRole('menuitem', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
});

test('mobile layout has no horizontal scroll @mobile', async ({ page }) => {
  await signup(page, 'Mobile Tester');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.getByRole('link', { name: 'My Work' })).toBeVisible();
});
