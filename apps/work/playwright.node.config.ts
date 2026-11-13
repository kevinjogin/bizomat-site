// End-to-end tests against the Node runtime (`npm run test:e2e:node`): the same
// specs as playwright.config.ts (which runs them on `wrangler dev` at :8799),
// served by the built Node server (dist/node/server.mjs) on port 8792 with a
// fresh data directory.
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const PORT = 8792;
const DATA = '.data/e2e-node';
const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// admin.spec.ts changes data with `npx wrangler d1 execute DB --local ...`;
// test-node/e2e/bin/npx applies that SQL to the Node server's database instead
// and passes every other npx call through to the real npx.
process.env.PATH = `${here('./test-node/e2e/bin')}:${process.env.PATH ?? ''}`;
process.env.WORK_E2E_DATA_DIR = here(`./${DATA}`);

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results/node',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/node' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...(process.env.PW_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, grepInvert: /@mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: {
    command: `rm -rf ${DATA} && npm run build:client && npm run build:node && node dist/node/server.mjs`,
    env: {
      PORT: String(PORT),
      WORK_DATA_DIR: DATA,
      WORK_STATIC_DIR: 'dist/client',
      ENVIRONMENT: 'development',
      APP_URL: `http://localhost:${PORT}`,
      ALLOW_SIGNUP: 'true',
      WORK_CRON: '0',
      // Addresses as behind the platform proxy: a spec may send its own (e2e/crm.spec.ts does, to have a sign-up rate
      // limit of its own; the other specs send none and keep the socket address).
      WORK_TRUST_PROXY: '1',
    },
    url: `http://localhost:${PORT}/api/health`,
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
