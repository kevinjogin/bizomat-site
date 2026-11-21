import { expect, test } from '@playwright/test';

// Project Management inside BIZOMAT ERP, as https://bizomat.ai/erp/tasks serves it: the same build, with every address
// the client builds (pages, files, API calls, the live board socket) under /erp. The tool's own address /tasks answers
// 302 into the ERP, and a signed-out visitor signs in at the ERP's sign-in (src/worker/mount.ts, suiteRedirect).
const password = 'e2e-Password-123!';
const unique = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// An address of its own for the sign-up limit (ten an hour per address; 192.0.2.0/24 is reserved for documentation), as
// the other specs that sign up have.
test.use({ extraHTTPHeaders: { 'CF-Connecting-IP': '192.0.2.47', 'X-Forwarded-For': '192.0.2.47' } });

// The only requests outside /erp: the page loads of the signed-out visit, each a 302 on the way to the ERP's sign-in (the
// tool's own address, which the spec opens to see it answer into the ERP, and the shared session's carry).
const OWN_ADDRESS = '/tasks/w/some-workspace/boards';
const SIGNED_OUT_HOPS = [OWN_ADDRESS, '/tasks/api/app-carry'];

test('Project Management works inside the ERP under /erp/tasks and never leaves /erp', async ({ page }) => {
  const outside: string[] = [];
  const sockets: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.hostname !== 'localhost' || u.pathname.startsWith('/erp/')) return;
    if (!(r.isNavigationRequest() && SIGNED_OUT_HOPS.includes(u.pathname))) outside.push(u.pathname);
  });
  page.on('websocket', (ws) => sockets.push(new URL(ws.url()).pathname));
  // Signed out, the tool's own address opens inside the ERP, at its sign-in, which brings the visitor back to the page.
  await page.goto(OWN_ADDRESS);
  await expect(page).toHaveURL(/\/erp\/login\?next=%2Ftasks%2Fw%2Fsome-workspace%2Fboards$/);
  await page.goto('/erp/signup');
  await page.getByLabel('Full name').fill('Mount User');
  await page.getByLabel('Work email').fill(`e2e.${unique()}@example.com`);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  // A new account opens the ERP's dashboard of its own company; Project Management is the module rail's link to that
  // company's own workspace.
  await expect(page).toHaveURL(/\/erp\/c\/[^/]+\/home/);
  await page.getByRole('navigation', { name: 'BIZOMAT ERP modules' }).getByRole('link', { name: 'Project Management', exact: true }).click();
  await expect(page).toHaveURL(/\/erp\/tasks\/w\/[^/]+\/home/);

  await page.getByRole('button', { name: 'New', exact: false }).first().click();
  await page.getByRole('menuitem', { name: 'Board', exact: true }).click();
  await page.getByLabel('Board name').fill('Under a path');
  await page.getByRole('button', { name: 'Create board' }).click();
  await expect(page).toHaveURL(/\/erp\/tasks\/w\/[^/]+\/boards\//);
  const add = page.getByLabel('Add item').first();
  await add.fill('Works under /erp/tasks');
  await add.press('Enter');
  await expect(page.getByText('Works under /erp/tasks')).toBeVisible();
  await page.waitForTimeout(500);
  await page.reload();
  await expect(page.getByText('Works under /erp/tasks')).toBeVisible();
  expect(outside).toEqual([]);
  expect(sockets.length).toBeGreaterThan(0); // the live board channel
  for (const path of sockets) expect(path).toMatch(/^\/erp\/tasks\/api\/live\/boards\//);
  // The session cookie is written for this app's paths only, never for Path=/: the website and CAD Automation, at other
  // paths of bizomat.ai, never receive it.
  const paths = (await page.context().cookies()).filter((c) => c.name.endsWith('workos_sid')).map((c) => c.path);
  expect(paths.sort()).toEqual(['/company', '/crm', '/erp', '/finance', '/system', '/tasks']);
});
