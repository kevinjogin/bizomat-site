import { execFileSync } from 'node:child_process';
import { expect, test, type Page } from '@playwright/test';

const PERSIST = '.wrangler/e2e-state';

async function signup(page: Page, name: string) {
  const email = `${name.toLowerCase().replace(/\W+/g, '')}.${Date.now().toString(36)}@example.com`;
  await page.goto('/signup');
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Work email').fill(email);
  await page.getByLabel('Password').fill('Granite-river-74!');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/home/);
  return email;
}

function grantFounder(email: string) {
  execFileSync('npx', ['wrangler', 'd1', 'execute', 'DB', '--local', '--persist-to', PERSIST, '--command',
    `INSERT OR IGNORE INTO platform_admins (user_id, role, granted_by, granted_at) SELECT id, 'founder', 'e2e', 0 FROM users WHERE email = '${email}'`], { stdio: 'ignore' });
}

test('normal users cannot open the founder console', async ({ page }) => {
  await signup(page, 'Regular Person');
  const res = await page.goto('/admin');
  expect(res?.status()).toBe(404);
  const api = await page.request.get('/api/admin/overview');
  expect(api.status()).toBe(404);
});

test('founder sees real numbers and live sessions', async ({ page, browser }) => {
  const email = await signup(page, 'Founder Person');
  grantFounder(email);
  // A second user who is active right now.
  const other = await browser.newPage();
  await signup(other, 'Active Visitor');
  await other.mouse.move(10, 10);

  await page.goto('/admin');
  await expect(page.getByLabel('Founder console navigation')).toBeVisible();
  const overview = await (await page.request.get('/api/admin/overview?range=all')).json();
  // The page renders the same totals the API (and database) report.
  await expect(page.getByText(String(overview.users.total)).first()).toBeVisible();

  await page.getByLabel('Founder console navigation').getByRole('link', { name: 'Live Sessions' }).click();
  await expect(page).toHaveURL(/\/admin\/sessions/);
  const sessions = await (await page.request.get('/api/admin/sessions?status=active')).json();
  expect(sessions.summary.activeUsers).toBeGreaterThanOrEqual(1);
  await expect(page.getByText(email).first()).toBeVisible();

  await page.getByLabel('Founder console navigation').getByRole('link', { name: 'Users' }).click();
  await expect(page.getByText(email).first()).toBeVisible();
  await other.close();
});

test('founder console fits a phone screen @mobile', async ({ page }) => {
  const email = await signup(page, 'Mobile Founder');
  grantFounder(email);
  for (const path of ['/admin', '/admin/users', '/admin/sessions', '/admin/adoption', '/admin/health']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});
