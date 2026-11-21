import { randomBytes } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';

const PORT = 8799;
const PERSIST = '.wrangler/e2e-state';
// Finance's online links are signed with the settings key (src/worker/fin/render.ts), which the Node runtime makes in
// its data folder when none is set; `wrangler dev` has none, so each run is given a new one (32 bytes, base64). It only
// ever signs the run's own throwaway data, and nothing is committed.
const SETTINGS_KEY = randomBytes(32).toString('base64');

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
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
    command: `rm -rf ${PERSIST} && npm run build:client && npx wrangler d1 migrations apply DB --local --persist-to ${PERSIST} && npx wrangler dev --local --port ${PORT} --persist-to ${PERSIST} --var ALLOW_SIGNUP:true --var SETTINGS_ENCRYPTION_KEY:${SETTINGS_KEY}`,
    url: `http://localhost:${PORT}/api/health`,
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
