import { expect, test } from '@playwright/test';

test('documents can be organised into coloured folders', async ({ page }) => {
  const email = `folders.${Date.now().toString(36)}@example.com`;
  await page.goto('/signup');
  await page.getByLabel('Full name').fill('Folder Tester');
  await page.getByLabel('Work email').fill(email);
  await page.getByLabel('Password').fill('Sunset-paper-88!');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/home/);
  const ws = page.url().match(/\/w\/([^/]+)/)![1];

  await page.goto(`/w/${ws}/docs`);
  await page.getByRole('button', { name: 'New folder' }).click();
  await page.getByLabel('Folder name').fill('Client proposals');
  await page.getByRole('radio', { name: 'Colour #0ea5e9' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('navigation', { name: 'Documents folders' }).getByText('Client proposals')).toBeVisible();

  // The new folder is selected; a new document is created inside it.
  await page.getByRole('button', { name: 'New document here' }).click();
  await expect(page).toHaveURL(/\/docs\//);
  const docUrl = page.url();
  await page.goto(`/w/${ws}/docs`);
  const panel = page.getByRole('navigation', { name: 'Documents folders' });
  await panel.getByRole('button', { name: 'Client proposals', exact: true }).click();
  await expect(page.locator('.list-row', { hasText: 'Untitled document' })).toBeVisible();

  // Persisted server-side: survives a reload with the folder in the URL.
  await page.reload();
  await expect(page.locator('.list-row', { hasText: 'Untitled document' })).toBeVisible();
  await panel.getByRole('button', { name: 'Not in a folder' }).click();
  await expect(page.locator('.list-row', { hasText: 'Untitled document' })).toHaveCount(0);

  // Recolour from the folder menu.
  await panel.getByRole('button', { name: 'Client proposals folder options' }).click();
  await page.getByRole('radio', { name: 'Colour #00a36c' }).click();
  await page.keyboard.press('Escape');
  const res = await page.request.get(`/api/workspaces/${ws}/folders?scope=documents`);
  const folders = await res.json();
  expect(folders[0].color).toBe('#00a36c');
  expect(docUrl).toContain('/docs/');
});
