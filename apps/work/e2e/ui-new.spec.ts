import { expect, test, type Page } from '@playwright/test';

// The new UI (docs/ui/README.md): what it does to behaviour, not to looks. The UI kit's preview switch (sessionStorage
// "bizomat-ui-preview") turns it on in one browser tab, as it does for a platform admin; the flag new_ui_enabled itself
// stays off. Run with `npm run test:e2e:node` (or test:e2e).

const password = 'e2e-Password-123!';
const unique = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// An address of its own for the sign-up limit (ten an hour per address; 192.0.2.0/24 is reserved for documentation), as
// the other specs that sign up have.
test.use({ extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.48', 'X-Forwarded-For': '192.0.2.48' } });

/** A new account in BIZOMAT ERP, with its own company and its example company. Returns their ids. */
async function erpAccount(page: Page): Promise<{ own: string; example: string }> {
  await page.goto('/signup');
  await page.getByLabel('Full name').fill('UI Test');
  await page.getByLabel('Work email').fill(`e2e.${unique()}@example.com`);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(/\/w\/[^/]+\/home/);
  // The example company is made on the first visit to the ERP.
  await page.goto('/erp/');
  let companies: { id: string; kind: string }[] = [];
  await expect
    .poll(async () => {
      const r = await page.request.get('/api/system/me');
      companies = r.ok() ? ((await r.json()) as { companies: { id: string; kind: string }[] }).companies : [];
      return companies.some((c) => c.kind === 'demo') && companies.some((c) => c.kind === 'own');
    }, { timeout: 30_000 })
    .toBe(true);
  return { own: companies.find((c) => c.kind === 'own')!.id, example: companies.find((c) => c.kind === 'demo')!.id };
}

const preview = (page: Page) => page.addInitScript(() => sessionStorage.setItem('bizomat-ui-preview', '1'));

test('with the flag off the new UI does not apply, and a closed dialog leaves nothing behind', async ({ page }) => {
  await erpAccount(page);
  await page.goto('/erp/');
  await expect(page.locator('html')).not.toHaveAttribute('data-ui', 'new');
  await page.getByRole('button', { name: /Report a fault/ }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.ui-exit')).toHaveCount(0);
});

test('under the new UI a closed dialog fades out: an inert copy, gone within a moment', async ({ page }) => {
  await preview(page);
  await erpAccount(page);
  await page.goto('/erp/');
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'new');
  await page.getByRole('button', { name: /Report a fault/ }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  // The dialog itself is gone at once: nothing waits for the animation.
  await expect(dialog).toHaveCount(0);
  // The copy, read at once (it lives for about 200 ms): hidden from assistive technology, inert, no dialog role, no ids.
  const copy = await page.evaluate(() => {
    const el = document.querySelector('.overlay.ui-exit');
    return el && { hidden: el.getAttribute('aria-hidden'), inert: el.hasAttribute('inert'), dialogs: el.querySelectorAll('[role="dialog"], [aria-modal], [id]').length + (el.hasAttribute('role') ? 1 : 0) };
  });
  expect(copy).toEqual({ hidden: 'true', inert: true, dialogs: 0 });
  await expect(page.locator('.ui-exit')).toHaveCount(0, { timeout: 1000 });
  // Focus went back to the page, not to the copy.
  expect(await page.evaluate(() => !!document.activeElement?.closest('.ui-exit'))).toBe(false);
});

test('a company switch never shows the old company’s content', async ({ page }) => {
  await preview(page);
  const { own, example } = await erpAccount(page);
  await page.goto(`/erp/c/${example}/home`);
  await expect(page.locator('#main h1').first()).toContainText('Acme Studio');
  // Every frame from now: the address, whether the cover is up, and whether the old company shows in the page.
  await page.evaluate(() => {
    const w = window as unknown as { frames_: { path: string; covered: boolean; old: boolean }[] };
    w.frames_ = [];
    const tick = () => {
      // The old company's own heading (its name), not a list that may name it.
      const heading = document.querySelector('#main h1');
      w.frames_.push({ path: location.pathname, covered: document.documentElement.dataset.switching === '1', old: !!heading && (heading as HTMLElement).innerText.includes('Acme Studio') });
      if (w.frames_.length < 600) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.getByRole('button', { name: /Switch company/ }).click();
  await page.getByRole('menuitem', { name: /Own/ }).click();
  await expect(page).toHaveURL(new RegExp(`/erp/c/${own}/home`));
  await page.waitForTimeout(2500);
  const frames = await page.evaluate(() => (window as unknown as { frames_: { path: string; covered: boolean; old: boolean }[] }).frames_);
  // From the first frame React drew for the new company (the cover is up, or the old heading has gone): until then the
  // browser still shows the screen the person clicked on, as with any link.
  const first = frames.findIndex((f) => f.path.includes(`/c/${own}/`) && (f.covered || !f.old));
  expect(first).toBeGreaterThanOrEqual(0);
  const after = frames.slice(first);
  expect(after.length).toBeGreaterThan(10);
  // The cover was up while the new company loaded.
  expect(after[0].covered).toBe(true);
  // In the new company's address, the old company's content is never visible: either it is gone or the cover is up.
  expect(after.filter((f) => f.old && !f.covered)).toEqual([]);
  // The cover comes down once the new company has loaded.
  expect(after[after.length - 1].covered).toBe(false);
});
