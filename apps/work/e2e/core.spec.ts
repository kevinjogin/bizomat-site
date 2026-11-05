import { expect, test, type Page } from '@playwright/test';

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
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  const res = await request.get('/api/workspaces');
  expect(res.status()).toBe(401);
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

  // Reload: data must come from the backend
  await page.waitForTimeout(500);
  await page.reload();
  const row2 = page.locator('tr', { hasText: 'Write launch plan' });
  await expect(row2.getByRole('button', { name: 'Status: Working on it' })).toBeVisible();

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
