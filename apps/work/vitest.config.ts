import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';

// Static assets are only needed for the SPA fallback; ensure the directory
// exists so tests can run before the client is built.
if (!existsSync('dist/client/index.html')) {
  mkdirSync('dist/client', { recursive: true });
  writeFileSync('dist/client/index.html', '<!doctype html><title>BIZOMAT Project Management</title><div id="root"></div>');
}

export default defineConfig(async () => {
  const migrations = await readD1Migrations('migrations');
  return {
    plugins: [
      cloudflareTest({
        main: './src/worker/index.ts',
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          bindings: { TEST_MIGRATIONS: migrations, ENVIRONMENT: 'test', ALLOW_SIGNUP: 'true', APP_URL: 'http://example.com' },
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
