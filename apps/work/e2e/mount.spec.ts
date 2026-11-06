import { expect, test } from '@playwright/test';

// The app under a path of another site's address, as https://bizomat.ai/tasks serves it: the same build, with every
// address the client builds (pages, files, API calls, the live board socket) under /tasks.
const password = 'e2e-Password-123!';
const unique = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

test('the app works under /tasks and never leaves it', async ({ page }) => {
  const outside: string[] = [];
  const sockets: string[] = [];
  const here = (u: URL) => u.hostname === 'localhost';
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (here(u) && !u.pathname.startsWith('/tasks/')) outside.push(u.pathname);
  });
  page.on('websocket', (ws) => sockets.push(new URL(ws.url()).pathname));
  await page.goto('/tasks/w/some-workspace/boards');
  await expect(page).toHaveURL(/\/tasks\/login\?next=/);
  await page.goto('/tasks/signup');
  await page.getByLabel('Full name').fill('Mount User');
  await page.getByLabel('Work email').fill(`e2e.${unique()}@example.com`);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/tasks\/w\/[^/]+\/home/);

  await page.getByRole('button', { name: 'New', exact: false }).first().click();
  await page.getByRole('menuitem', { name: 'Board', exact: true }).click();
  await page.getByLabel('Board name').fill('Under a path');
  await page.getByRole('button', { name: 'Create board' }).click();
  await expect(page).toHaveURL(/\/tasks\/w\/[^/]+\/boards\//);
  const add = page.getByLabel('Add item').first();
  await add.fill('Works under /tasks');
  await add.press('Enter');
  await expect(page.getByText('Works under /tasks')).toBeVisible();
  await page.waitForTimeout(500);
  await page.reload();
  await expect(page.getByText('Works under /tasks')).toBeVisible();
  expect(outside).toEqual([]);
  expect(sockets.length).toBeGreaterThan(0); // the live board channel
  for (const path of sockets) expect(path).toMatch(/^\/tasks\/api\/live\/boards\//);
  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name.endsWith('workos_sid'))?.path).toBe('/tasks');
});
