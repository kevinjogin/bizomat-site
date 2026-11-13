import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';

// Static assets are only needed for the SPA fallback; ensure the directory
// exists so tests can run before the client is built.
if (!existsSync('dist/client/index.html')) {
  mkdirSync('dist/client', { recursive: true });
  writeFileSync('dist/client/index.html', '<!doctype html><html><head><title>BIZOMAT Project Management</title></head><body><div id="root"></div></body></html>');
}

export default defineConfig(async () => {
  const migrations = await readD1Migrations('migrations');
  return {
    // This app's own tsconfig for every transform: in the BIZOMAT monorepo, Vite would otherwise walk up to the
    // website's tsconfig.json (which extends Astro's) for files this app's tsconfig.json does not include.
    tsconfig: './tsconfig.worker.json',
    plugins: [
      cloudflareTest({
        main: './src/worker/index.ts',
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          bindings: { TEST_MIGRATIONS: migrations, ENVIRONMENT: 'test', ALLOW_SIGNUP: 'true', APP_URL: 'http://example.com', BREVO_WEBHOOK_TOKEN: 'test-webhook-token', SETTINGS_ENCRYPTION_KEY: 'BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc=',
            // One BIZOMAT sign-in client for test/company.test.ts (its secret is "test-client-secret").
            BIZOMAT_ID_CLIENTS: JSON.stringify([{ id: 'cad-test', name: 'CAD Automation', secretSha256: '8ac950188678f9bb3524b275130332b511bf5092394da6975b5fb9e84302f026', redirectUris: ['https://cad.example.com/auth/bizomat/callback'] }]),
          },
        },
      }),
    ],
    test: {
      include: ['test/**/*.test.ts'],
      setupFiles: ['./test/setup.ts'],
      testTimeout: 30_000,
    },
  };
});
