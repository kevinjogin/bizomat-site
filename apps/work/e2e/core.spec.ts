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

/**
 * Holds the page's item-create requests until release(), so the rows they add stay unsaved (on their temporary
 * ids) meanwhile. release() lets them through and waits until the server has saved each one. The route then lets
 * every request through but stays in place: removing it just as the page sends the request an action was waiting
 * for (a move, say) can leave that request unanswered.
 */
async function holdItemSaves(page: Page) {
  let open = () => {};
  const gate = new Promise<void>((resolve) => (open = resolve));
  const held: Request[] = [];
  await page.route(/\/api\/boards\/[^/]+\/items$/, async (route) => {
    if (route.request().method() === 'POST') {
      held.push(route.request());
      await gate;
    }
    await route.continue();
  });
  return {
    held,
    async release() {
      open();
      for (const r of held) expect((await r.response())?.ok()).toBe(true);
    },
  };
}

const answered = (page: Page, method: string, path: RegExp) => page.waitForResponse((r) => r.request().method() === method && path.test(new URL(r.url()).pathname));

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
  // The server knows only real item ids: no request may carry a temporary one ('tmp-…'), even for a row still being saved.
  const sentTmp: string[] = [];
  page.on('request', (r) => {
    if (`${r.url()} ${r.postData() ?? ''}`.includes('tmp-')) sentTmp.push(`${r.method()} ${r.url()}`);
  });
  await signup(page);
  // Create a board
  await page.getByRole('button', { name: 'New', exact: false }).first().click();
  await page.getByRole('menuitem', { name: 'Board', exact: true }).click();
  await page.getByLabel('Board name').fill('E2E Launch');
  await page.getByRole('button', { name: 'Create board' }).click();
  await expect(page.getByLabel('Board name')).toHaveValue('E2E Launch');

  // Add an item in the first group
  const add = page.getByLabel('Add item', { exact: true }).first();
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
  let saves = await holdItemSaves(page);
  await add.fill('Review launch plan');
  await add.press('Enter');
  const unsaved = page.locator('tr', { hasText: 'Review launch plan' });
  await unsaved.getByRole('button', { name: /^Status:/ }).click();
  await expect(page.getByRole('button', { name: 'Stuck' })).toBeVisible();
  const refetched = answered(page, 'GET', /\/api\/boards\/[^/]+$/);
  const heldSave = saves.held[0];
  const sent = await heldSave.allHeaders();
  const other = await page.request.post(heldSave.url(), { data: { name: 'Book launch venue' }, headers: { origin: sent.origin, 'x-csrf-token': sent['x-csrf-token'] } });
  expect(other.ok()).toBe(true);
  await refetched;
  await expect(page.locator('tr', { hasText: 'Book launch venue' })).toBeVisible();
  await page.getByRole('button', { name: 'Stuck' }).click();
  const statusSaved = answered(page, 'PATCH', /\/api\/items\/[^/]+$/);
  await saves.release();
  const patched = await statusSaved;
  expect(patched.ok()).toBe(true);
  expect(patched.url()).not.toContain('tmp-');
  await expect(unsaved.getByRole('button', { name: 'Status: Stuck' })).toBeVisible();
  await expect(unsaved).toHaveCount(1);

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

  // Every other action on a row still being saved works too, and reaches the server under the item's real id.
  // Open: the panel waits for the save, then shows the item, and the address takes its real id.
  saves = await holdItemSaves(page);
  await add.fill('Draft budget');
  await add.press('Enter');
  await page.getByRole('button', { name: 'Open Draft budget' }).click();
  const panel = page.getByRole('dialog', { name: /^Item/ });
  await expect(panel.getByText('Saving the item…')).toBeVisible();
  await saves.release();
  await expect(page).toHaveURL(/[?&]item=(?!tmp-)[^&]+/);
  await expect(panel.getByLabel('Item name')).toHaveValue('Draft budget');
  await panel.getByLabel('Write an update… use @ to mention').fill('Outline is ready');
  await panel.getByRole('button', { name: 'Post update' }).click();
  await expect(panel.locator('.update-body', { hasText: 'Outline is ready' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);

  // Kanban drag: a card still being saved is dropped before another card still being saved.
  saves = await holdItemSaves(page);
  await add.fill('Pack samples');
  await add.press('Enter');
  await add.fill('Print labels');
  await add.press('Enter');
  await expect(page.locator('tr', { hasText: 'Print labels' })).toBeVisible();
  await page.getByRole('tab', { name: 'Kanban' }).click();
  const emptyLane = page.getByRole('listitem', { name: /^Empty,/ });
  const cardOrder = async () => (await emptyLane.locator('article').evaluateAll((cards) => cards.map((c) => c.getAttribute('aria-label')))).filter((n) => n === 'Pack samples' || n === 'Print labels');
  expect(await cardOrder()).toEqual(['Pack samples', 'Print labels']);
  const reordered = answered(page, 'POST', /\/api\/items\/[^/]+\/move$/);
  // Drag by hand: the card accepts a drop only on a dragover after the drag has started, so move over it twice.
  await emptyLane.locator('article', { hasText: 'Print labels' }).hover({ position: { x: 20, y: 15 } });
  await page.mouse.down();
  const packCard = emptyLane.locator('article', { hasText: 'Pack samples' });
  await packCard.hover({ position: { x: 20, y: 15 } });
  await packCard.hover({ position: { x: 30, y: 20 } });
  await page.mouse.up();
  await saves.release();
  expect((await reordered).ok()).toBe(true);
  await expect.poll(cardOrder).toEqual(['Print labels', 'Pack samples']);
  await page.getByRole('tab', { name: 'Main table' }).click();
  await expect(page.getByRole('region', { name: 'Group To do' })).toBeVisible();

  // Row menu: move to another group, duplicate, archive and delete, each on a row still being saved.
  saves = await holdItemSaves(page);
  for (const name of ['Order samples', 'Plan kickoff', 'Old notes', 'Scratch row']) {
    await add.fill(name);
    await add.press('Enter');
  }
  const rowMenu = async (name: string, action: string) => {
    await page.locator('tr', { hasText: name }).locator('.name-text').click({ button: 'right' });
    await page.getByRole('menuitem', { name: action, exact: true }).click();
  };
  const done = [
    answered(page, 'POST', /\/api\/items\/[^/]+\/move$/),
    answered(page, 'POST', /\/api\/items\/[^/]+\/duplicate$/),
    answered(page, 'POST', /\/api\/items\/[^/]+\/archive$/),
    answered(page, 'DELETE', /\/api\/items\/[^/]+$/),
  ];
  await rowMenu('Order samples', 'In progress');
  await expect(page.getByRole('region', { name: 'Group In progress' }).locator('tr', { hasText: 'Order samples' })).toBeVisible();
  await rowMenu('Plan kickoff', 'Duplicate');
  await rowMenu('Old notes', 'Archive');
  await expect(page.locator('tr', { hasText: 'Old notes' })).toHaveCount(0);
  await rowMenu('Scratch row', 'Delete');
  await page.getByRole('dialog', { name: 'Delete "Scratch row"?' }).getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('tr', { hasText: 'Scratch row' })).toHaveCount(0);
  await saves.release();
  for (const r of await Promise.all(done)) expect(r.ok(), `${r.request().method()} ${r.url()}`).toBe(true);

  // After a reload, the server has every change.
  await page.reload();
  await expect(page.getByRole('region', { name: 'Group In progress' }).locator('tr', { hasText: 'Order samples' })).toBeVisible();
  await expect(page.locator('tr', { hasText: 'Plan kickoff (copy)' })).toBeVisible();
  await expect(page.locator('tr', { hasText: 'Plan kickoff' })).toHaveCount(2);
  await expect(page.locator('tr', { hasText: 'Old notes' })).toHaveCount(0);
  await expect(page.locator('tr', { hasText: 'Scratch row' })).toHaveCount(0);
  await page.getByRole('tab', { name: 'Kanban' }).click();
  await expect.poll(cardOrder).toEqual(['Print labels', 'Pack samples']);
  expect(sentTmp).toEqual([]);
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
